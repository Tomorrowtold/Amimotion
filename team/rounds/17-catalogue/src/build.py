import json,re,sys,collections
rows=[];fam=None
for f in ['p1.txt','p2.txt','p3.txt','p4.txt']:
  for l in open(f):
    l=l.rstrip('\n')
    if not l.strip(): continue
    if l.startswith('## '):
      code,name=l[3:].split('|'); fam=(code,name); continue
    p=l.split('|')
    if len(p) not in (8,9): print('BAD',f,len(p),l[:80]); continue
    rows.append((fam,p))
c=collections.Counter(r[0][1] for r in rows)
for k,v in c.items(): print(v,k)
print('total',len(rows),'picks',sum(1 for r in rows if len(r[1])==9))
names=collections.Counter(p[0].lower() for _,p in rows)
print('dupes',[n for n,v in names.items() if v>1])
thin=[(fam[0],p[0]) for fam,p in rows if re.search(r'\bSee F|^Rule\.?$|^Keep\.$|Lesson only|^Avoid\.$|^See above',p[5]) or len(p[5])<22]
print('thin',len(thin)); print(thin)
# apply fixes
fx={}
for l in open('fix.txt'):
  l=l.rstrip('\n')
  if '::' in l: k,v=l.split('::',1); fx.setdefault(k,[]).append(v)
used=set()
out=[]
for fam,p in rows:
  p=list(p)
  if p[0] in fx:
   used.add(p[0])
   for v in fx[p[0]]:
    if v.startswith('+'): p=p[:8]+[v[1:].replace('Pick: ','')]
    elif v.startswith('P='):
      a,b=v.split(';;'); p[4]=a[2:]; p[5]=b[2:]
    else:
      q=v.split('|'); assert len(q) in (8,9),v; p=q
  out.append((fam,p))
print('unused fixes',[k for k in fx if k not in used])
names=collections.Counter(p[0].lower() for _,p in out); print('dupes2',[n for n,v in names.items() if v>1])
thin=[(f[0],p[0]) for f,p in out if re.search(r'\bSee F|^Rule\.?$|^Keep\.$|Lesson only|^Avoid\.$|^See above',p[5]) or len(p[5])<22]
print('thin2',thin)
items=[]
for i,(fam,p) in enumerate(out,1):
  pick=len(p)==9
  items.append(dict(id=f"E{i:03d}",family=fam[1],family_code=fam[0],name=p[0],source=p[1],what=p[2],why=p[3],pages=[x.strip() for x in re.split(r',(?=\s*/|\s*all)',p[4])],use=p[5],cost=p[6],tech=p[7],pick=pick,pick_reason=(p[8].replace('Pick: ','') if pick else "")))
print('N',len(items),'picks',sum(x['pick'] for x in items))
json.dump(items,open('../catalogue.json','w'),indent=1,ensure_ascii=False)
# normalise
def normp(p):
  p=p.strip(); ph=' (phone)' in p; p=p.replace(' (phone)','')
  if p.startswith('all') or p in ('phone','site/tools'): p='all pages'
  p=re.sub(r'\*$','',p)
  return p
for x in items:
  ps=[]
  for p in x['pages']:
    q=normp(p)
    if q not in ps: ps.append(q)
  x['phone_only']=any('(phone)' in p for p in x['pages']) or x['family']=='Mobile-specific'
  x['pages']=ps
  if x['tech'].startswith('WebGL or'): x['tech']='WebGL'
json.dump(items,open('../catalogue.json','w'),indent=1,ensure_ascii=False)
# markdown
fams=[]
for x in items:
  if x['family'] not in fams: fams.append(x['family'])
md=["# AmIMotion pattern catalogue: 500 elements","",
"Round 17, 2 Nov 2026. 500 UI/UX and visual-storytelling elements for the design bench to redesign every page on (copy stays as is). Sources: the 100 reference sites (round 10 harvest captures and picks, round 16 study laws and moves) and a live Playwright study (desktop 1440x900, phone 390x844, DOM, canvas, video and cursor probes) of Active Theory, Locomotive, Resn, Hello Monday, Immersive Garden, Build in Amsterdam, Lusion, Basement Studio, Bruno Simon and Niccolò Miranda plus case pages (Lusion Oryzo AI and Porsche Dream Machine; Immersive Garden Orano and Longines Zulu Time; Build in Amsterdam Vitra Gift Finder and Polaroid; Basement Vercel Ship and Daylight; Locomotive Work index; Hello Monday Work; Niccolò Miranda The Roger Hub). Captures are local only in `caps/` (gitignored).","",
"Source notes: \"live\" = observed in the 2 Nov live study; \"caps NN dX\" = round 10 capture frame; \"study Lx\" = round 16 law; \"sites.py\" = the reference list's own observation of that site. Active Theory and Bruno Simon refused or crashed in headless Chromium (Active Theory shows a \"Your browser is not supported\" gate over its particle logo), so their entries rest on that gate page, its HTML head and the round 10 capture.","",
"Build cost: S = under a day, M = 2-5 days, L = a week or more. Tech: CSS/JS, Video, WebGL (three.js), or both.","",
"## Counts","","| Family | Elements | Picks |","|---|---|---|"]
for f in fams: md.append(f"| {f} | {sum(1 for x in items if x['family']==f)} | {sum(1 for x in items if x['family']==f and x['pick'])} |")
md+=["| **Total** | **500** | **60** |","","## The 60 Picks",""]
for x in items:
  if x['pick']: md.append(f"- **{x['id']} {x['name']}** ({x['family']}; {', '.join(x['pages'])}): {x['pick_reason']}")
for f in fams:
  md+=["",f"## {f}",""]
  for x in [y for y in items if y['family']==f]:
    pk=f" **Pick:** {x['pick_reason']}" if x['pick'] else ""
    md.append(f"**{x['id']} {x['name']}**{' (Pick)' if x['pick'] else ''}  \nSource: {x['source']}  \nWhat: {x['what']} Why: {x['why']}  \nAmIMotion: `{', '.join(x['pages'])}`: {x['use']}  \nCost {x['cost']} · {x['tech']}.{pk}\n")
open('../catalogue.md','w').write('\n'.join(md))
s=open('page.html').read().replace('__DATA__',json.dumps(items,ensure_ascii=False).replace('</','<\\/'))
open('../catalogue.html','w').write(s)
