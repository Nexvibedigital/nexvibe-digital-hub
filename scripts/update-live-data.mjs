import fs from 'node:fs/promises';
import path from 'node:path';

const ROOT=process.cwd();
const OUT=path.join(ROOT,'public','data');
const ua='NexVibe-Cyber-Digital-Hub/1.1 (+https://github.com/Nexvibedigital/nexvibe-digital-hub)';
const now=new Date();
const iso=now.toISOString();

async function get(url,{json=false,timeout=20000}={}){
  const ac=new AbortController();const timer=setTimeout(()=>ac.abort(),timeout);
  try{const r=await fetch(url,{headers:{'User-Agent':ua,'Accept':json?'application/json':'*/*'},signal:ac.signal});if(!r.ok)throw new Error(`${r.status} ${r.statusText}`);return json?r.json():r.text()}finally{clearTimeout(timer)}
}
const clean=s=>String(s||'').replace(/<!\[CDATA\[|\]\]>/g,'').replace(/<[^>]*>/g,' ').replace(/&amp;/g,'&').replace(/&quot;/g,'"').replace(/&#39;|&apos;/g,"'").replace(/&lt;/g,'<').replace(/&gt;/g,'>').replace(/\s+/g,' ').trim();
const slug=s=>clean(s).toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'').slice(0,110)||Math.random().toString(36).slice(2);
const normaliseUrl=u=>String(u||'').replace(/[?#].*$/,'').replace(/\/$/,'').toLowerCase();
const fingerprint=x=>normaliseUrl(x.sourceUrl)||`${String(x.source).toLowerCase()}|${slug(x.title)}`;
const uniq=(arr,keyFn)=>[...new Map(arr.map(x=>[keyFn(x),x])).values()];

async function readJson(name,fallback){try{return JSON.parse(await fs.readFile(path.join(OUT,name),'utf8'))}catch{return fallback}}
function decorate(item,country='Global'){return {...item,country,verificationStatus:'verified',sourceVerifiedAt:iso,official:true}}
function parseRss(xml,source,category,country='Global'){
  const items=[];for(const m of xml.matchAll(/<item\b[^>]*>([\s\S]*?)<\/item>/gi)){const b=m[1];const pick=t=>clean((b.match(new RegExp(`<${t}\\b[^>]*>([\\s\\S]*?)<\\/${t}>`,'i'))||[])[1]);const title=pick('title'),link=pick('link'),date=pick('pubDate')||pick('dc:date'),desc=pick('description');if(title&&link)items.push(decorate({id:`${slug(source)}-${slug(title)}`,title,summary:desc.slice(0,420),source,sourceUrl:link,publishedAt:date?new Date(date).toISOString():'',category},country));}return items;
}
function parseCert(html){
  const items=[];for(const m of html.matchAll(/<a\b[^>]*href=["']([^"']*\/alerts\/[^"']+)["'][^>]*>([\s\S]*?)<\/a>/gi)){const url=new URL(m[1],'https://www.cert.gov.lk/').href;const title=clean(m[2]);if(title.length<8||/read more/i.test(title))continue;const around=html.slice(Math.max(0,m.index-500),Math.min(html.length,(m.index||0)+m[0].length+500));const dm=around.match(/(January|February|March|April|May|June|July|August|September|October|November|December)\s+\d{1,2},\s+\d{4}/i);items.push(decorate({id:`certlk-${slug(title)}`,title,summary:'Official Sri Lanka CERT alert. Open the primary source for affected components, impact and remediation guidance.',source:'Sri Lanka CERT',sourceUrl:url,publishedAt:dm?new Date(dm[0]).toISOString():'',category:'Sri Lanka CERT'},'Sri Lanka'));}return uniq(items,x=>x.sourceUrl).slice(0,40);
}

const status={syncedAt:iso,sources:{}};let live=[];let reviewExtras=[];const existing=await readJson('live-news.json',{items:[]});
try{const xml=await get('https://www.cisa.gov/cybersecurity-advisories/all.xml');const items=parseRss(xml,'CISA','CISA Advisory','United States');live.push(...items);status.sources.cisa=`ok:${items.length}`}catch(e){status.sources.cisa=`error:${e.message}`}
try{const html=await get('https://www.cert.gov.lk/alert');const items=parseCert(html);live.push(...items);status.sources.sriLankaCert=`ok:${items.length}`}catch(e){status.sources.sriLankaCert=`error:${e.message}`}
try{const xml=await get('https://www.cisecurity.org/feed/advisories');const items=parseRss(xml,'Center for Internet Security','CIS Advisory','Global');live.push(...items);status.sources.cis=`ok:${items.length}`}catch(e){status.sources.cis=`error:${e.message}`}
if(live.length<3)live.push(...(existing.items||[]));
live=uniq(live,fingerprint).sort((a,b)=>String(b.publishedAt).localeCompare(String(a.publishedAt))).slice(0,100);
await fs.writeFile(path.join(OUT,'live-news.json'),JSON.stringify({syncedAt:iso,mode:'official_external_feed',note:'Official external items link to primary sources and are never auto-published as NexVibe editorial articles.',items:live},null,2));

try{
  const kev=await get('https://www.cisa.gov/sites/default/files/feeds/known_exploited_vulnerabilities.json',{json:true});const vulnerabilities=[...(kev.vulnerabilities||[])].sort((a,b)=>String(b.dateAdded).localeCompare(String(a.dateAdded)));
  await fs.writeFile(path.join(OUT,'kev.json'),JSON.stringify({syncedAt:iso,catalogVersion:kev.catalogVersion||'',count:kev.count||vulnerabilities.length,vulnerabilities},null,2));status.sources.kev=`ok:${vulnerabilities.length}`;
  reviewExtras.push(...vulnerabilities.slice(0,20).map(v=>decorate({id:`kev-${v.cveID}`,title:`${v.cveID}: ${v.vulnerabilityName}`,summary:`${v.vendorProject} ${v.product}. ${v.shortDescription} Required action: ${v.requiredAction}`,source:'CISA',sourceUrl:`https://www.cisa.gov/known-exploited-vulnerabilities-catalog?search_api_fulltext=${encodeURIComponent(v.cveID)}`,publishedAt:v.dateAdded,category:'CISA KEV',tags:[v.cveID,v.vendorProject,v.product]},'Global')));
}catch(e){status.sources.kev=`error:${e.message}`}

try{
  const start=new Date(now.getTime()-7*24*60*60*1000).toISOString();const url=`https://services.nvd.nist.gov/rest/json/cves/2.0?pubStartDate=${encodeURIComponent(start)}&pubEndDate=${encodeURIComponent(iso)}&resultsPerPage=100`;const nvd=await get(url,{json:true,timeout:30000});
  const items=(nvd.vulnerabilities||[]).map(({cve})=>{const d=(cve.descriptions||[]).find(x=>x.lang==='en')?.value||'';const m=cve.metrics||{};const metric=(m.cvssMetricV31||m.cvssMetricV30||m.cvssMetricV40||m.cvssMetricV2||[])[0];const score=metric?.cvssData?.baseScore;const severity=metric?.cvssData?.baseSeverity||metric?.baseSeverity;return {id:cve.id,published:cve.published,lastModified:cve.lastModified,description:d,score,severity,url:`https://nvd.nist.gov/vuln/detail/${encodeURIComponent(cve.id)}`}}).sort((a,b)=>String(b.published).localeCompare(String(a.published))).slice(0,100);
  await fs.writeFile(path.join(OUT,'nvd.json'),JSON.stringify({syncedAt:iso,items},null,2));status.sources.nvd=`ok:${items.length}`;
  reviewExtras.push(...items.filter(x=>['CRITICAL','HIGH'].includes(String(x.severity).toUpperCase())).slice(0,20).map(v=>decorate({id:`nvd-${v.id}`,title:`${v.id}${v.severity?` — ${v.severity}`:''}`,summary:v.description.slice(0,420),source:'NVD',sourceUrl:v.url,publishedAt:v.published,category:'NVD CVE',tags:[v.id,v.severity].filter(Boolean)},'Global')));
}catch(e){status.sources.nvd=`error:${e.message}`}

const queue=uniq([...live,...reviewExtras],fingerprint).sort((a,b)=>String(b.publishedAt).localeCompare(String(a.publishedAt))).slice(0,160);
await fs.writeFile(path.join(OUT,'review-queue.json'),JSON.stringify({syncedAt:iso,mode:'verified_draft_candidates',note:'Verified official-source candidates for admin review. Importing creates a draft and never auto-publishes.',items:queue},null,2));
await fs.writeFile(path.join(OUT,'sync-status.json'),JSON.stringify(status,null,2));
console.log(JSON.stringify(status,null,2));
