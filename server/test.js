// Checks for the inbound agent, with no network and no API key needed:  node server/test.js
// A local mock stands in for the Claude API, so the tool loop, the claims gate and the lead desk are all exercised.
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import assert from 'node:assert/strict';
import * as C from '../site/src/js/agent-core.js';
import { handle } from './agent-server.js';

const here = path.dirname(fileURLToPath(import.meta.url));
const kbFile = [path.join(here, '../studio/out/assets/agent/kb.json'), path.join(here, '../site/dist/assets/agent/kb.json')].find((p) => fs.existsSync(p));
if (!kbFile) { console.error('Build first: cd site && python3 build.py'); process.exit(1); }
const KB = JSON.parse(fs.readFileSync(kbFile, 'utf8'));
let ok = 0; const t = async (name, fn) => { try { await fn(); ok++; console.log('ok  ', name); } catch (e) { console.error('FAIL', name, '\n    ', e.message); process.exitCode = 1; } };

// ---------------------------------------------------------------- the core
await t('facts and every site passage pass the claims gate', () => { for (const f of C.FACTS) assert.ok(C.gate(f).ok, f); for (const p of KB.passages) assert.ok(C.gate(p[2]).ok, p[2]); });
await t('gate catches barred claims', () => { for (const x of ['AmIMotion is FiRa certified', 'Payback in 6 months', 'cuts search time by 40%', 'Installed in days', 'Deployed at Maruti', 'Trusted by leading OEMs', 'Fleet Manager is now available', 'Tags cost ₹2,000 per tag', 'Barcodes fail on the shop floor']) assert.ok(!C.gate(x).ok, x); });
await t('a name the visitor typed may be repeated to them', () => assert.ok(C.gate('For Volvo’s plant, start with one bay.', 'we are from volvo').ok));
const ix = C.indexKB(KB);
await t('search cites the right pages', () => {
  const top = (q) => C.search(ix, q, 3).map((r) => r.text).join(' ');
  assert.match(top('how accurate is it'), /±10 cm/); assert.match(top('does it work without internet'), /no internet|on-premise|inside your plant/i);
  assert.match(top('how much does it cost'), /NDA/); assert.match(top('does it track people'), /not people/); assert.match(top('is it certified'), /specifications/);
});
await t('anchor estimate matches the /tools/anchors/ grid', () => { const a = C.estimateAnchors({ length_m: 100, width_m: 50 }); assert.equal(a.low, 22); assert.equal(a.high, 35); });
await t('ICP scoring: a strong lead is A, a thin one is C, people tracking is flagged', () => {
  assert.equal(C.scoreLead({ carriers: 'trolleys', waits_at: 'inspection', link: 'scan', role: 'Plant head', start: 'bay', industry: 'automotive' }, { pages: ['/pilot/', '/how-to-buy/'], tools: ['Anchor estimate'], asked_for_call: true }).grade, 'A');
  assert.equal(C.scoreLead({ role: 'Plant head' }, {}).grade, 'C');
  assert.ok(C.scoreLead({}, { transcript: 'we want to track workers' }).flags.some((f) => /people/.test(f)));
});
await t('local engine runs tools and asks one question', () => {
  const r = C.localTurn({ message: 'How many anchors for 120 x 60 m?', index: ix, turns: 1 });
  assert.equal(r.cards[0].type, 'anchors'); assert.ok(r.question && r.question.key === 'carriers');
  assert.equal(C.localTurn({ message: 'where is J-208', index: ix }).cards[0].rows[0].id, 'C-014');
  assert.ok(C.localTurn({ message: 'I want to talk to an engineer', index: ix }).handoff);
});
await t('dossier carries the reply draft, objections and consent', () => {
  const d = C.dossier({ profile: { name: 'Asha Rao', email: 'asha@example.com', carriers: 'bins', waits_at: 'rework' }, transcript: [{ role: 'user', content: 'We already scan barcodes. What is the ROI?' }], consent: { reply: true } });
  assert.match(d.reply, /Hi Asha/); assert.ok(d.objections.length >= 2); assert.ok(C.gate(d.reply).ok);
});

// ---------------------------------------------------------------- the server, with a mock Claude
const calls = [];
const mock = http.createServer(async (req, res) => {
  let b = ''; for await (const c of req) b += c; const body = JSON.parse(b); calls.push(body);
  const last = body.messages[body.messages.length - 1];
  const say = (content, stop = 'end_turn') => { res.writeHead(200, { 'content-type': 'application/json' }); res.end(JSON.stringify({ id: 'm' + calls.length, type: 'message', role: 'assistant', model: body.model, content, stop_reason: stop, usage: { input_tokens: 1, output_tokens: 1 } })); };
  if (body.system[0].text.startsWith('You are the lead desk')) return say([{ type: 'text', text: JSON.stringify({ summary: 'Production manager in Pune with trolleys waiting before inspection.', reply: 'Subject: Your first bay\n\nHi Asha,\n\nThanks for the floor profile. Could we take 30 minutes for a live demo on real AmIHub data?\n\n[Name]', risks: ['Wants SAP first'], questions: ['Where does the job live while it waits?'] }) }]);
  const userText = typeof last.content === 'string' ? last.content : '';
  if (/steel/.test(userText)) return say([{ type: 'text', text: 'AmIMotion is FiRa certified and works anywhere.' }]);                    // barred -> corrected
  if (/claims register/.test(JSON.stringify(last.content))) return say([{ type: 'text', text: 'UWB separates the direct path from reflections, and the survey tests the hardest spots.\nSource: How it locates a tag' }]);
  if (Array.isArray(last.content) && last.content[0].type === 'tool_result') return say([{ type: 'text', text: 'For 120 by 60 metres the planning grid gives a first range; the survey sets the count.' }]);
  return say([{ type: 'tool_use', id: 'tu1', name: 'estimate_anchors', input: { length_m: 120, width_m: 60 } }, { type: 'tool_use', id: 'tu2', name: 'remember', input: { carriers: 'trolleys' } }], 'tool_use');
}).listen(0);
const mockURL = `http://127.0.0.1:${mock.address().port}`;
const kbServe = http.createServer((q, s) => { s.writeHead(200, { 'content-type': 'application/json' }); s.end(JSON.stringify(KB)); }).listen(0);
const site = `http://127.0.0.1:${kbServe.address().port}`;
const store = new Map(); const LEADS = { put: async (k, v) => store.set(k, v), get: async (k) => store.get(k) || null, list: async () => ({ keys: [...store.keys()].map((name) => ({ name })) }) };
const env = { ANTHROPIC_API_KEY: 'test', ANTHROPIC_BASE_URL: mockURL, LEADS, DESK_TOKEN: 'k' };
const post = (p, body, e = env) => handle(new Request(site + p, { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(body) }), e, {}).then((r) => r.json());

await t('agent: tool loop runs, cards and memory come back', async () => {
  const r = await post('/api/agent', { messages: [{ role: 'user', content: 'How many anchors for 120 by 60 m?' }], page: '/technology/' });
  assert.equal(r.engine, 'claude'); assert.equal(r.cards[0].type, 'anchors'); assert.equal(r.profilePatch.carriers, 'trolleys');
  const req = calls.find((c) => c.tools); assert.equal(req.model, 'claude-opus-5-5'); assert.equal(req.fallbacks, 'default'); assert.equal(req.system[0].cache_control.type, 'ephemeral'); assert.ok(req.system[0].text.includes('SITE PASSAGES'));
});
await t('agent: a barred reply is rewritten before the visitor sees it', async () => {
  const r = await post('/api/agent', { messages: [{ role: 'user', content: 'Does it work near steel?' }] });
  assert.ok(C.gate(r.text).ok, r.text); assert.ok(!/certified/i.test(r.text)); assert.equal(r.source && r.source.url, '/technology/');
});
await t('agent: no key -> local engine', async () => { const r = await post('/api/agent', { messages: [{ role: 'user', content: 'where is C-014' }] }, { LEADS }); assert.equal(r.engine, 'local'); assert.equal(r.cards[0].type, 'plant'); });
await t('lead: needs consent, drops bots, stores a scored dossier with the desk’s draft', async () => {
  assert.ok((await post('/api/lead', { profile: { name: 'A', email: 'a@b.co' } })).error);
  assert.ok((await post('/api/lead', { website: 'spam', profile: {} })).ok);
  const r = await post('/api/lead', { profile: { name: 'Asha Rao', email: 'asha@example.com', company: 'Example', role: 'Production manager', carriers: 'trolleys', waits_at: 'inspection', link: 'scan', start: 'bay' }, signals: { pages: ['/pilot/'], tools: ['Flow plan'] }, consent: { reply: true } });
  assert.ok(r.ok); const d = JSON.parse([...store.values()].pop());
  assert.equal(d.desk, 'claude'); assert.match(d.reply, /Hi Asha/); assert.ok(d.score.fit > 50); assert.equal(d.consent.reply, true);
});
await t('desk: key required, lists leads, updates status', async () => {
  const bad = await handle(new Request(site + '/api/desk'), env); assert.equal(bad.status, 401);
  const list = await (await handle(new Request(site + '/api/desk', { headers: { authorization: 'Bearer k' } }), env)).json(); assert.equal(list.leads.length, 1);
  await handle(new Request(site + '/api/desk', { method: 'POST', headers: { authorization: 'Bearer k' }, body: JSON.stringify({ id: list.leads[0].id, status: 'replied' }) }), env);
  assert.equal(JSON.parse([...store.values()].pop()).status, 'replied');
});
await t('mcp: lists and calls the sample plant tools', async () => {
  const l = await post('/api/mcp', { jsonrpc: '2.0', id: 1, method: 'tools/list' }); assert.equal(l.result.tools.length, 3);
  const c = await post('/api/mcp', { jsonrpc: '2.0', id: 2, method: 'tools/call', params: { name: 'locate_carrier', arguments: { id: 'C-014' } } }); assert.equal(c.result.structuredContent.rows[0].zone, 'Buffer B');
});
await t('guard: another origin is refused', async () => { const r = await handle(new Request(site + '/api/agent', { method: 'POST', headers: { origin: 'https://evil.example' }, body: '{}' }), env); assert.equal(r.status, 403); });

mock.close(); kbServe.close();
console.log(`\n${ok} checks passed${process.exitCode ? ', some failed' : ''}.`);
