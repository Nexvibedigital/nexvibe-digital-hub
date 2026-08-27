import { useMemo, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { ExternalLink, Search as SearchIcon } from 'lucide-react';
import { PageHero, EmptyState } from '../components/Common';
import { courses, manualPosts, toolDirectory, roadmaps } from '../data/manual';
import { useLiveNews, useCmsPosts } from '../lib/live';

type Result={type:string;title:string;description:string;to?:string;url?:string;meta?:string};
export default function SearchPage(){
  const [params,setParams]=useSearchParams(); const initial=params.get('q')||''; const [q,setQ]=useState(initial); const [type,setType]=useState('all'); const {data}=useLiveNews(); const {items:cmsPosts}=useCmsPosts();
  const all=useMemo<Result[]>(()=>[
    ...[...(data.items||[]),...cmsPosts,...manualPosts].map(n=>({type:'News',title:n.title,description:n.summary,to:n.source==='NexVibe'?`/news/${n.id}`:undefined,url:n.source!=='NexVibe'?n.sourceUrl:undefined,meta:n.source})),
    ...toolDirectory.map(t=>({type:'Tool',title:t.name,description:t.description,url:t.officialUrl,meta:`${t.category} • ${t.pricing}`})),
    ...courses.map(c=>({type:'Course',title:c.title,description:`${c.provider} • ${c.level} • ${c.pricing}`,url:c.officialUrl,meta:c.provider})),
    ...roadmaps.map(r=>({type:'Roadmap',title:r.title,description:r.steps.join(' → '),to:`/roadmaps#${r.id}`,meta:'Learning Centre'})),
    {type:'Service',title:'Website Development',description:'Responsive websites and digital presence services.',to:'/services'},
    {type:'Safety Tool',title:'Password Exposure Checker',description:'HIBP Pwned Passwords k-anonymity lookup.',to:'/digital-safety/password-check'},
    {type:'Safety Tool',title:'Suspicious URL Analyser',description:'Local visible-warning-sign checks.',to:'/digital-safety/url-check'},
    {type:'Safety Tool',title:'QR Safety Scanner',description:'Local QR image decode and destination review.',to:'/digital-safety/qr-check'},
  ],[data.items,cmsPosts]);
  const types=[...new Set(all.map(x=>x.type))];
  const filtered=useMemo(()=>all.filter(r=>(type==='all'||r.type===type)&&(!q||`${r.title} ${r.description} ${r.meta}`.toLowerCase().includes(q.toLowerCase()))),[all,q,type]);
  return <><PageHero eyebrow="Global Search" title="Search across the NexVibe hub" lead="Find news, official alerts, tools, courses, roadmaps, services and Digital Safety Centre features."/>
    <section className="nv-section-compact"><div className="nv-container"><form className="nv-searchbar" onSubmit={e=>{e.preventDefault();setParams(q?{q}:{});}}><input autoFocus value={q} onChange={e=>setQ(e.target.value)} placeholder="Try phishing, OSINT, Microsoft, password, Wireshark…"/><button className="nv-button nv-button-primary"><SearchIcon size={17}/>Search</button></form><div className="nv-toolbar"><select className="nv-input nv-filter-select" value={type} onChange={e=>setType(e.target.value)}><option value="all">All content types</option>{types.map(t=><option key={t}>{t}</option>)}</select><span className="nv-muted">{filtered.length} results</span></div><div className="nv-grid-3">{filtered.length?filtered.map((r,i)=><article key={`${r.type}-${r.title}-${i}`} className="nv-card nv-card-hover nv-list-card"><span className="nv-chip">{r.type}</span><h3>{r.title}</h3><p>{r.description}</p><div className="nv-card-footer"><span className="nv-muted">{r.meta}</span>{r.to?<Link className="nv-button" to={r.to}>Open</Link>:<a className="nv-button" href={r.url} target="_blank" rel="noreferrer">Official <ExternalLink size={14}/></a>}</div></article>):<EmptyState title="No results" body="Try a broader keyword such as cyber, AI, OSINT, course, Apple or password."/>}</div></div></section>
  </>
}
