import { useMemo, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { ExternalLink, Search as SearchIcon } from 'lucide-react';
import { PageHero, EmptyState } from '../components/Common';
import { courses, manualPosts, toolDirectory, roadmaps } from '../data/manual';
import { useLiveNews, useCmsPosts, useKev, useNvd } from '../lib/live';
import Seo from '../components/Seo';

type Result={type:string;title:string;description:string;to?:string;url?:string;meta?:string;source?:string;date?:string;category?:string};
export default function SearchPage(){
  const [params,setParams]=useSearchParams(); const initial=params.get('q')||''; const [q,setQ]=useState(initial); const [type,setType]=useState('all'); const [source,setSource]=useState('all'); const [range,setRange]=useState('all'); const {data}=useLiveNews(); const {items:cmsPosts}=useCmsPosts(); const {data:kev}=useKev(); const {data:nvd}=useNvd();
  const all=useMemo<Result[]>(()=>[
    ...[...(data.items||[]),...cmsPosts,...manualPosts].map(n=>({type:'News',title:n.title,description:n.summary,to:n.source==='NexVibe'?`/news/${n.id}`:undefined,url:n.source!=='NexVibe'?n.sourceUrl:undefined,meta:`${n.source} • ${n.category}`,source:n.source,date:n.publishedAt,category:n.category})),
    ...(kev.vulnerabilities||[]).slice(0,150).map(v=>({type:'CVE',title:`${v.cveID} — ${v.vulnerabilityName}`,description:`${v.vendorProject} ${v.product}. ${v.shortDescription}`,to:'/cve',url:`https://www.cisa.gov/known-exploited-vulnerabilities-catalog?search_api_fulltext=${encodeURIComponent(v.cveID)}`,meta:'CISA KEV',source:'CISA',date:v.dateAdded,category:'Known Exploited Vulnerability'})),
    ...(nvd.items||[]).slice(0,120).map(v=>({type:'CVE',title:v.id,description:v.description,to:'/cve',url:v.url,meta:`NVD${v.severity?` • ${v.severity}`:''}`,source:'NVD',date:v.published,category:'CVE'})),
    ...toolDirectory.map(t=>({type:'Tool',title:t.name,description:t.description,url:t.officialUrl,meta:`${t.category} • ${t.pricing}`,source:'Directory',category:t.category})),
    ...courses.map(c=>({type:'Course',title:c.title,description:`${c.provider} • ${c.level} • ${c.pricing}`,url:c.officialUrl,meta:c.provider,source:c.provider,category:'Learning'})),
    ...roadmaps.map(r=>({type:'Roadmap',title:r.title,description:r.steps.join(' → '),to:`/roadmaps#${r.id}`,meta:'Learning Centre',source:'NexVibe',category:'Learning'})),
    {type:'Service',title:'Website Development',description:'Responsive websites and digital presence services.',to:'/services',source:'NexVibe',category:'Services'},
    {type:'Safety Tool',title:'Password Exposure Checker',description:'HIBP Pwned Passwords k-anonymity lookup.',to:'/digital-safety/password-check',source:'NexVibe',category:'Digital Safety'},
    {type:'Safety Tool',title:'Suspicious URL Analyser',description:'Local visible-warning-sign checks.',to:'/digital-safety/url-check',source:'NexVibe',category:'Digital Safety'},
    {type:'Safety Tool',title:'QR Safety Scanner',description:'Local QR image decode and destination review.',to:'/digital-safety/qr-check',source:'NexVibe',category:'Digital Safety'},
  ],[data.items,cmsPosts,kev.vulnerabilities,nvd.items]);
  const types=[...new Set(all.map(x=>x.type))].sort(); const sources=[...new Set(all.map(x=>x.source).filter(Boolean) as string[])].sort();
  const filtered=useMemo(()=>all.filter(r=>{
    if(type!=='all'&&r.type!==type)return false; if(source!=='all'&&r.source!==source)return false;
    if(q&&!`${r.title} ${r.description} ${r.meta} ${r.category}`.toLowerCase().includes(q.toLowerCase()))return false;
    if(range!=='all'&&r.date){const d=new Date(r.date).getTime();if(Date.now()-d>Number(range)*86400000)return false;}
    return true;
  }),[all,q,type,source,range]);
  return <><Seo title="Global Search" description="Search NexVibe news, CVEs, CISA KEV, NVD records, tools, courses, roadmaps and Digital Safety features." path="/search"/><PageHero eyebrow="Global Search" title="Search the entire NexVibe hub" lead="One search across news, CVEs, official alerts, tools, courses, roadmaps, services and Digital Safety Centre features."/>
    <section className="nv-section-compact"><div className="nv-container"><form className="nv-searchbar" onSubmit={e=>{e.preventDefault();setParams(q?{q}:{});}}><input autoFocus value={q} onChange={e=>setQ(e.target.value)} placeholder="Try CVE-2026, phishing, Microsoft, OSINT, Wireshark…"/><button className="nv-button nv-button-primary"><SearchIcon size={17}/>Search</button></form><div className="nv-filter-panel nv-card"><select className="nv-input" value={type} onChange={e=>setType(e.target.value)}><option value="all">All content types</option>{types.map(t=><option key={t}>{t}</option>)}</select><select className="nv-input" value={source} onChange={e=>setSource(e.target.value)}><option value="all">All sources</option>{sources.map(s=><option key={s}>{s}</option>)}</select><select className="nv-input" value={range} onChange={e=>setRange(e.target.value)}><option value="all">Any date</option><option value="7">Last 7 days</option><option value="30">Last 30 days</option><option value="90">Last 90 days</option></select><span className="nv-result-count">{filtered.length} results</span></div><div className="nv-grid-3">{filtered.length?filtered.map((r,i)=><article key={`${r.type}-${r.title}-${i}`} className="nv-card nv-card-hover nv-list-card"><div className="nv-meta"><span className="nv-chip">{r.type}</span>{r.category&&<span>{r.category}</span>}</div><h3>{r.title}</h3><p className="nv-clamp-3">{r.description}</p><div className="nv-card-footer"><span className="nv-muted">{r.meta}</span>{r.to?<Link className="nv-button" to={r.to}>Open</Link>:<a className="nv-button" href={r.url} target="_blank" rel="noreferrer">Official <ExternalLink size={14}/></a>}</div></article>):<EmptyState title="No results" body="Try a broader keyword, another source or a wider date range."/>}</div></div></section>
  </>
}
