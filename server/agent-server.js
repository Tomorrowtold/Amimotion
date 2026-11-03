// AmIMotion inbound agent: the server. One fetch handler (Web Request -> Response) that runs on Cloudflare Pages
// Functions, Netlify Functions or Node (server/dev.js). Every secret lives in the host's environment, never in code.
//
//   POST /api/agent   one conversational turn: Claude with the site's tools, the founders' facts and the site's pages
//   POST /api/lead    a visitor sends their floor profile: the lead desk scores it, writes the dossier and a reply
//                     draft for a founder to approve, and routes it (KV store, HubSpot, webhook, email)
//   GET  /api/desk    the founders' lead desk reads stored leads (needs DESK_TOKEN)
//   POST /api/desk    mark a lead (status, owner, note)
//   POST /api/mcp     read-only MCP server over the sample plant (Simulation), for developers to try
//   GET  /api/health  what is configured (names only, never values)
//
// Environment (all optional; without ANTHROPIC_API_KEY the agent answers from the local engine):
//   ANTHROPIC_API_KEY, ANTHROPIC_MODEL (default claude-opus-5-5), AGENT_EFFORT (default low)
//   ALLOWED_ORIGINS (comma list, e.g. https://amimotion.com,https://www.amimotion.com)
//   LEADS (Cloudflare KV binding) or LEADS_WEBHOOK_STORE (any HTTPS endpoint that keeps JSON)
//   HUBSPOT_TOKEN (private app: crm.objects.contacts.write, crm.objects.notes.write)
//   or HUBSPOT_PORTAL_ID + HUBSPOT_FORM_ID (free Forms API)
//   LEAD_WEBHOOK (Slack, Teams or any JSON webhook)   RESEND_API_KEY + LEAD_EMAIL_TO + LEAD_EMAIL_FROM (dossier email)
//   DESK_TOKEN (opens /desk/)
import Anthropic from '@anthropic-ai/sdk';
import { POLICY, FACTS, TOOL_DEFS, runTool, gate, indexKB, search, localTurn, mergeProfile, dossier, scoreLead, askSamplePlant, PLANT, CARD_TYPES, nextQuestion, pageChips } from '../site/src/js/agent-core.js';

const json = (o, status = 200, extra = {}) => new Response(JSON.stringify(o), { status, headers: { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store', ...extra } });

// ------------------------------------------------------------------ guard: same site, rate limit, size caps
const hits = new Map();
function limited(key, n, ms) {
  const now = Date.now(), arr = (hits.get(key) || []).filter((t) => now - t < ms);
  arr.push(now); hits.set(key, arr); if (hits.size > 5000) hits.clear();
  return arr.length > n;
}
const ipOf = (req) => req.headers.get('cf-connecting-ip') || req.headers.get('x-nf-client-connection-ip') || (req.headers.get('x-forwarded-for') || '').split(',')[0].trim() || 'anon';
function sameSite(req, env) {
  const o = req.headers.get('origin'); if (!o) return true;            // same-origin fetches from older browsers
  const allow = String(env.ALLOWED_ORIGINS || '').split(',').map((s) => s.trim()).filter(Boolean);
  try { const host = new URL(req.url).host; return new URL(o).host === host || allow.includes(o); } catch { return false; }
}

// ------------------------------------------------------------------ the site's passages (fetched once per isolate)
let IX = null;
async function kbIndex(req, env) {
  if (IX) return IX;
  const url = new URL('/assets/agent/kb.json', req.url);
  const res = env.ASSETS ? await env.ASSETS.fetch(url) : await fetch(url);
  const kb = await res.json(); IX = { ix: indexKB(kb), text: kb.passages.map(([p, h, t]) => `[${kb.pages[p][1]} | ${kb.pages[p][0]}] ${h}: ${t}`).join('\n') };
  return IX;
}

// ------------------------------------------------------------------ /api/agent
const MODEL = (env) => env.ANTHROPIC_MODEL || 'claude-opus-5-5';
async function agentTurn(req, env) {
  const body = await req.json().catch(() => null);
  if (!body) return json({ error: 'bad request' }, 400);
  const turns = (body.messages || []).slice(-14).map((m) => ({ role: m.role === 'assistant' ? 'assistant' : 'user', content: String(m.content || '').slice(0, 2000) })).filter((m) => m.content);
  if (!turns.length || turns[turns.length - 1].role !== 'user') return json({ error: 'empty' }, 400);
  const profile = mergeProfile({}, body.profile || {}), page = String(body.page || '').slice(0, 200);
  const { ix, text: kbText } = await kbIndex(req, env);
  const last = turns[turns.length - 1].content, visitorWords = turns.filter((m) => m.role === 'user').map((m) => m.content).join(' ');
  const userTurns = turns.filter((m) => m.role === 'user').length - 1;
  if (!env.ANTHROPIC_API_KEY) return json(localTurn({ message: last, profile, page, index: ix, turns: userTurns }));
  try { return json(await claudeTurn(env, turns, profile, page, ix, kbText, visitorWords, userTurns)); }
  catch (e) { console.error('agent: Claude failed, local engine answers', e && e.message); return json(localTurn({ message: last, profile, page, index: ix, turns: userTurns })); }
}

async function claudeTurn(env, turns, profile, page, ix, kbText, visitorWords, userTurns) {
  const client = new Anthropic({ apiKey: env.ANTHROPIC_API_KEY, baseURL: env.ANTHROPIC_BASE_URL || undefined, timeout: 45_000, maxRetries: 1 });
  // frozen, cached prefix: rules + founders' facts + every site passage. The visitor's context comes after it.
  const system = [{ type: 'text', text: `${POLICY}\n\nFACTS (from the founders' documents; keep the qualifiers):\n${FACTS.map((f) => '- ' + f).join('\n')}\n\nSITE PASSAGES (amimotion.com, one per line: [page | url] heading: text):\n${kbText}`, cache_control: { type: 'ephemeral', ttl: '1h' } }];
  const context = `[Context for this conversation, not from the visitor] Page: ${page || 'unknown'}. What the site already knows about this visitor's floor: ${JSON.stringify(profile)}.`;
  const messages = [{ role: 'user', content: context }, { role: 'assistant', content: 'Understood.' }, ...turns];
  const cards = [], patch = {};
  let handoff = false, source = null;
  for (let round = 0; round < 5; round++) {
    const res = await client.beta.messages.create({
      model: MODEL(env), max_tokens: 4000, betas: ['server-side-fallback-2026-07-01'], fallbacks: 'default',
      output_config: { effort: env.AGENT_EFFORT || 'low' }, system, tools: TOOL_DEFS, messages,
    });
    if (res.stop_reason === 'refusal') return { ...localTurn({ message: turns[turns.length - 1].content, profile, page, index: ix, turns: userTurns }), engine: 'local' };
    const uses = res.content.filter((b) => b.type === 'tool_use');
    if (res.stop_reason !== 'tool_use' || !uses.length) {
      let text = res.content.filter((b) => b.type === 'text').map((b) => b.text).join('\n').trim();
      const src = text.match(/\n?Source:\s*(.+)\s*$/i); if (src) { text = text.slice(0, src.index).trim(); const want = src[1].trim().toLowerCase().replace(/^\[|\]$/g, ''); const hit = ix.kb.pages.find(([u, l]) => l.toLowerCase() === want || u === want || want.includes(u)); if (hit) source = { page: hit[1], url: hit[0] }; }
      const g = gate(text, visitorWords);
      if (!g.ok) {
        // one correction round, then the local engine
        messages.push({ role: 'assistant', content: res.content }, { role: 'user', content: `[System check, not from the visitor] Your reply used wording the claims register bars (${g.hits.join(', ')}). Rewrite it without that wording, using only the FACTS and SITE PASSAGES.` });
        if (round < 4) continue;
        return { ...localTurn({ message: turns[turns.length - 1].content, profile, page, index: ix, turns: userTurns }), engine: 'local' };
      }
      const prof = mergeProfile(profile, patch), q = handoff ? null : nextQuestion(prof, userTurns);
      return { text, cards, source, handoff, profilePatch: patch, question: /\?\s*$/.test(text) ? null : q, suggestions: pageChips(page), engine: 'claude' };
    }
    messages.push({ role: 'assistant', content: res.content });
    const results = uses.map((u) => {
      const out = runTool(u.name, u.input || {}, { index: ix });
      if (out && CARD_TYPES.has(out.type)) { cards.push(out); if (out.type === 'handoff') handoff = true; }
      if (u.name === 'remember') Object.assign(patch, u.input || {});
      return { type: 'tool_result', tool_use_id: u.id, content: JSON.stringify(out).slice(0, 8000) };
    });
    messages.push({ role: 'user', content: results });
  }
  return { text: 'Let me pass this to an engineer, who can answer it properly.', cards: [{ type: 'handoff', summary: turns[turns.length - 1].content.slice(0, 200) }], handoff: true, profilePatch: patch, engine: 'claude' };
}

// ------------------------------------------------------------------ /api/lead: the lead desk
const DESK_RULES = `You are the lead desk for AmIMotion's founders. You read one inbound lead (the visitor's floor profile, what they did on the site, their conversation with the site guide) and the desk's own scoring. Write for a founder who has 60 seconds.
Return only JSON with these keys:
"summary": two sentences: who they are, what their floor needs, how ready they look.
"reply": an email reply in the founder's voice, under 150 words, British spelling, specific to their floor; offer a 30-minute call with a live demo on real AmIHub data; ask at most two questions from the discovery list that would change the plan; end with "[Name]". Never mention prices, ROI, savings, timelines in days, certifications, customer names or anything planned as if it were available.
"risks": up to three short lines a founder should watch for.
"questions": the three best questions for the first call.`;
async function lead(req, env, ctx) {
  const b = await req.json().catch(() => null);
  if (!b) return json({ error: 'bad request' }, 400);
  if (b.website) return json({ ok: true });                                    // honeypot: bots fill the hidden field
  const P = mergeProfile({}, b.profile || {});
  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(P.email || '') || !P.name) return json({ error: 'name and a valid email are needed' }, 400);
  if (!b.consent || !b.consent.reply) return json({ error: 'consent needed' }, 400);
  const id = 'L' + Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
  const transcript = (b.transcript || []).slice(-30).map((m) => ({ role: m.role === 'assistant' ? 'assistant' : 'user', content: String(m.content || '').slice(0, 1500) }));
  const d = dossier({ id, profile: P, signals: b.signals || {}, transcript, cards: (b.cards || []).slice(0, 12), summary: String(b.summary || '').slice(0, 400), page: String(b.page || '').slice(0, 200), source: String(b.source || 'agent').slice(0, 40),
    consent: { reply: true, updates: !!b.consent.updates, notice: 'amimotion.com/privacy/ 2026-11-03', at: new Date().toISOString() } });
  d.status = 'new';
  // the desk's writing pass: Claude reads the dossier and writes the summary and reply draft (a founder approves; nothing is sent to the visitor)
  if (env.ANTHROPIC_API_KEY) {
    try {
      const client = new Anthropic({ apiKey: env.ANTHROPIC_API_KEY, baseURL: env.ANTHROPIC_BASE_URL || undefined, timeout: 40_000, maxRetries: 1 });
      const res = await client.beta.messages.create({ model: MODEL(env), max_tokens: 3000, betas: ['server-side-fallback-2026-07-01'], fallbacks: 'default', output_config: { effort: 'medium' },
        system: [{ type: 'text', text: `${DESK_RULES}\n\nFACTS:\n${FACTS.map((f) => '- ' + f).join('\n')}` }],
        messages: [{ role: 'user', content: JSON.stringify({ contact: d.contact, floor: d.floor, score: d.score, did: d.did, objections: d.objections, discovery: d.discovery, transcript: d.transcript }) }] });
      const t = res.content.filter((x) => x.type === 'text').map((x) => x.text).join('');
      const o = JSON.parse(t.slice(t.indexOf('{'), t.lastIndexOf('}') + 1));
      if (o.summary) d.summary = String(o.summary);
      if (o.reply && gate(o.reply, JSON.stringify(P)).ok) d.reply = String(o.reply);
      if (Array.isArray(o.risks)) d.score.flags = [...d.score.flags, ...o.risks.map(String)].slice(0, 8);
      if (Array.isArray(o.questions)) d.discovery = o.questions.map(String).slice(0, 4);
      d.desk = 'claude';
    } catch (e) { console.error('desk: Claude pass failed, template kept', e && e.message); d.desk = 'template'; }
  } else d.desk = 'template';
  const work = deliver(d, env);
  if (ctx && ctx.waitUntil) ctx.waitUntil(work); else await work;
  return json({ ok: true, id, grade: d.score.grade });
}

async function deliver(d, env) {
  const jobs = [];
  if (env.LEADS && env.LEADS.put) jobs.push(env.LEADS.put('lead:' + d.id, JSON.stringify(d), { metadata: { at: d.at, grade: d.score.grade, company: d.contact.company || '', status: d.status } }));
  if (env.LEADS_WEBHOOK_STORE) jobs.push(fetch(env.LEADS_WEBHOOK_STORE, { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(d) }));
  const line = `${d.score.grade} lead · ${d.contact.name}${d.contact.company ? ', ' + d.contact.company : ''}${d.contact.role ? ' (' + d.contact.role + ')' : ''} · fit ${d.score.fit} · intent ${d.score.intent}`;
  if (env.LEAD_WEBHOOK) jobs.push(fetch(env.LEAD_WEBHOOK, { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ text: `${line}\n${d.summary}\nNext: ${d.score.next}`, lead: d }) }));
  if (env.HUBSPOT_TOKEN) jobs.push(hubspotCRM(d, env));
  else if (env.HUBSPOT_PORTAL_ID && env.HUBSPOT_FORM_ID) jobs.push(hubspotForm(d, env));
  if (env.RESEND_API_KEY && env.LEAD_EMAIL_TO) jobs.push(fetch('https://api.resend.com/emails', { method: 'POST', headers: { authorization: `Bearer ${env.RESEND_API_KEY}`, 'content-type': 'application/json' },
    body: JSON.stringify({ from: env.LEAD_EMAIL_FROM || 'AmIMotion lead desk <desk@amimotion.com>', to: env.LEAD_EMAIL_TO.split(','), reply_to: d.contact.email, subject: line, text: dossierText(d) }) }));
  const r = await Promise.allSettled(jobs);
  r.forEach((x) => { if (x.status === 'rejected') console.error('deliver:', x.reason && x.reason.message); });
}
export function dossierText(d) {
  return [`${d.score.grade} · fit ${d.score.fit}/100 · intent ${d.score.intent}/100 · ${d.score.persona || 'role unknown'}`, '', d.summary, '', `Next: ${d.score.next}`, '',
    'Contact: ' + Object.entries(d.contact).filter(([, v]) => v).map(([k, v]) => `${k} ${v}`).join(' · '),
    'Floor: ' + Object.entries(d.floor).filter(([, v]) => v).map(([k, v]) => `${k}: ${v}`).join(' · '),
    d.did.length ? 'On the site: ' + d.did.join('; ') : '', '', 'Why: ' + d.score.reasons.join('; '), d.score.flags.length ? 'Watch: ' + d.score.flags.join('; ') : '', d.score.gaps.length ? 'Missing: ' + d.score.gaps.join(', ') : '',
    d.objections.length ? '\nObjections raised:\n' + d.objections.map((o) => `• ${o.said}: ${o.answer}`).join('\n') : '', '\nAsk on the call:\n' + d.discovery.map((q) => '• ' + q).join('\n'),
    '\nDraft reply (approve before sending):\n' + d.reply, d.transcript.length ? '\nConversation:\n' + d.transcript.map((m) => `${m.role === 'user' ? 'Visitor' : 'Guide'}: ${m.content}`).join('\n') : ''].filter((x) => x !== '').join('\n');
}
async function hubspotCRM(d, env) {
  const H = { authorization: `Bearer ${env.HUBSPOT_TOKEN}`, 'content-type': 'application/json' };
  const [firstname, ...rest] = String(d.contact.name || '').split(' ');
  const props = { email: d.contact.email, firstname, lastname: rest.join(' '), company: d.contact.company || '', jobtitle: d.contact.role || '', phone: d.contact.phone || '', hs_lead_status: 'NEW' };
  // upsert by email, then a note with the dossier on the contact
  let r = await fetch('https://api.hubapi.com/crm/v3/objects/contacts/batch/upsert', { method: 'POST', headers: H, body: JSON.stringify({ inputs: [{ idProperty: 'email', id: d.contact.email, properties: props }] }) });
  const j = await r.json().catch(() => ({})); const cid = j.results && j.results[0] && j.results[0].id; if (!cid) throw new Error('HubSpot upsert failed ' + r.status);
  r = await fetch('https://api.hubapi.com/crm/v3/objects/notes', { method: 'POST', headers: H, body: JSON.stringify({ properties: { hs_timestamp: new Date().toISOString(), hs_note_body: dossierText(d).replace(/\n/g, '<br>') }, associations: [{ to: { id: cid }, types: [{ associationCategory: 'HUBSPOT_DEFINED', associationTypeId: 202 }] }] }) });
  if (!r.ok) throw new Error('HubSpot note failed ' + r.status);
}
async function hubspotForm(d, env) {
  const [firstname, ...rest] = String(d.contact.name || '').split(' ');
  const fields = [['email', d.contact.email], ['firstname', firstname], ['lastname', rest.join(' ')], ['company', d.contact.company], ['phone', d.contact.phone], ['jobtitle', d.contact.role], ['message', dossierText(d).slice(0, 6000)]].filter(([, v]) => v).map(([name, value]) => ({ name, value }));
  const r = await fetch(`https://api.hsforms.com/submissions/v3/integration/submit/${env.HUBSPOT_PORTAL_ID}/${env.HUBSPOT_FORM_ID}`, { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ fields, context: { pageUri: d.page || '' }, legalConsentOptions: { consent: { consentToProcess: true, text: 'Reply about my floor' } } }) });
  if (!r.ok) throw new Error('HubSpot form failed ' + r.status);
}

// ------------------------------------------------------------------ /api/desk
async function desk(req, env) {
  const tok = (req.headers.get('authorization') || '').replace(/^Bearer\s+/i, '');
  if (!env.DESK_TOKEN || tok !== env.DESK_TOKEN) return json({ error: 'not allowed' }, 401);
  if (!env.LEADS || !env.LEADS.list) return json({ leads: [], note: 'No LEADS store is bound. Leads still arrive by webhook, HubSpot or email.' });
  if (req.method === 'POST') {
    const b = await req.json().catch(() => ({})); const raw = await env.LEADS.get('lead:' + b.id); if (!raw) return json({ error: 'not found' }, 404);
    const d = JSON.parse(raw); ['status', 'owner', 'note'].forEach((k) => { if (b[k] != null) d[k] = String(b[k]).slice(0, 500); });
    await env.LEADS.put('lead:' + d.id, JSON.stringify(d), { metadata: { at: d.at, grade: d.score.grade, company: d.contact.company || '', status: d.status } });
    return json({ ok: true });
  }
  const list = await env.LEADS.list({ prefix: 'lead:', limit: 200 });
  const leads = (await Promise.all(list.keys.map((k) => env.LEADS.get(k.name)))).filter(Boolean).map((x) => JSON.parse(x)).sort((a, b) => (b.at || '').localeCompare(a.at || ''));
  return json({ leads });
}

// ------------------------------------------------------------------ /api/mcp (Simulation)
const MCP_TOOLS = [
  { name: 'locate_carrier', description: 'Where a carrier or job is in the sample plant, how long it has waited, and when it was last observed.', inputSchema: { type: 'object', properties: { id: { type: 'string' } }, required: ['id'] }, annotations: { readOnlyHint: true } },
  { name: 'list_waiting', description: 'Carriers waiting in a zone, longest first.', inputSchema: { type: 'object', properties: { zone: { type: 'string', enum: PLANT.zones.map((z) => z[0]) }, min_minutes: { type: 'number' } } }, annotations: { readOnlyHint: true } },
  { name: 'list_exceptions', description: 'Carriers past the dwell rule for their zone, with the owner who decides.', inputSchema: { type: 'object', properties: {} }, annotations: { readOnlyHint: true } },
];
function mcpOne(m) {
  const ok = (result) => ({ jsonrpc: '2.0', id: m.id, result });
  if (m.method === 'initialize') return ok({ protocolVersion: (m.params && m.params.protocolVersion) || '2025-06-18', capabilities: { tools: {} }, serverInfo: { name: 'amimotion-sample-plant', version: '1.0.0' }, instructions: 'Simulation: illustrative data for one morning at 10:56. Read-only.' });
  if (m.method === 'tools/list') return ok({ tools: MCP_TOOLS });
  if (m.method === 'ping') return ok({});
  if (m.method === 'tools/call') {
    const a = (m.params && m.params.arguments) || {}, n = m.params && m.params.name;
    const r = n === 'locate_carrier' ? askSamplePlant({ op: 'locate', id: a.id }) : n === 'list_waiting' ? askSamplePlant({ op: 'waiting', zone: a.zone, min_minutes: a.min_minutes }) : n === 'list_exceptions' ? askSamplePlant({ op: 'exceptions' }) : null;
    if (!r) return { jsonrpc: '2.0', id: m.id, error: { code: -32602, message: 'Unknown tool ' + n } };
    return ok({ content: [{ type: 'text', text: JSON.stringify(r) }], structuredContent: r });
  }
  return m.id === undefined ? null : { jsonrpc: '2.0', id: m.id, error: { code: -32601, message: 'Method not found' } };
}

// ------------------------------------------------------------------ router
export async function handle(req, env = {}, ctx = {}) {
  const path = new URL(req.url).pathname.replace(/\/+$/, '');
  if (path === '/api/health') return json({ ok: true, engine: env.ANTHROPIC_API_KEY ? 'claude' : 'local', model: env.ANTHROPIC_API_KEY ? MODEL(env) : null, store: !!(env.LEADS || env.LEADS_WEBHOOK_STORE), hubspot: !!(env.HUBSPOT_TOKEN || env.HUBSPOT_FORM_ID), webhook: !!env.LEAD_WEBHOOK, email: !!(env.RESEND_API_KEY && env.LEAD_EMAIL_TO), desk: !!env.DESK_TOKEN });
  if (path === '/api/desk') return desk(req, env);
  if (req.method !== 'POST') return json({ error: 'method not allowed' }, 405);
  if (!sameSite(req, env)) return json({ error: 'forbidden' }, 403);
  if ((+req.headers.get('content-length') || 0) > 64_000) return json({ error: 'too large' }, 413);
  const ip = ipOf(req);
  if (path === '/api/agent') {
    if (limited('a:' + ip, 40, 10 * 60_000)) return json({ text: 'That is a lot of questions in a short time. An engineer can pick this up: send your floor profile.', cards: [{ type: 'handoff', summary: 'Many questions' }], handoff: true, engine: 'limit' });
    return agentTurn(req, env);
  }
  if (path === '/api/lead') { if (limited('l:' + ip, 6, 10 * 60_000)) return json({ error: 'slow down' }, 429); return lead(req, env, ctx); }
  if (path === '/api/mcp') {
    const b = await req.json().catch(() => null); if (!b) return json({ jsonrpc: '2.0', id: null, error: { code: -32700, message: 'Parse error' } }, 400);
    const out = Array.isArray(b) ? b.map(mcpOne).filter(Boolean) : mcpOne(b);
    return out === null || (Array.isArray(out) && !out.length) ? new Response(null, { status: 202 }) : json(out);
  }
  return json({ error: 'not found' }, 404);
}
export { scoreLead, search };
