import { useMemo, useState } from 'react';
import { ExternalLink, RefreshCw } from 'lucide-react';
import { Link } from 'react-router-dom';
import { PageHero, EmptyState } from '../components/Common';
import { manualPosts } from '../data/manual';
import { useLiveNews, useCmsPosts } from '../lib/live';
import { siteConfig } from '../lib/config';
import type { NewsItem } from '../types';

function Card({item}:{item:NewsItem}){
  const internal=item.source==='NexVibe';
  return <article className="nv-card nv-card-hover nv-news-card"><div className="nv-news-image"><img loading="lazy" src={item.image||siteConfig.heroDesktop} alt=""/></div><div className="nv-news-body"><div className="nv-meta"><span className="nv-chip">{item.category}</span><span>{item.source}</span><span>{String(item.publishedAt).slice(0,10)}</span></div><h3>{item.title}</h3><p className="nv-muted">{item.summary}</p><div className="nv-card-footer"><span className={item.official?'nv-live-badge':'nv-muted'}>{item.official?'Official source':'NexVibe article'}</span>{internal?<Link to={`/news/${item.id}`} className="nv-button">Read</Link>:<a href={item.sourceUrl} target="_blank" rel="noreferrer" className="nv-button">Original <ExternalLink size={14}/></a>}</div></div></article>
}

export default function News({alertsOnly=false}:{alertsOnly?:boolean}){
  const {data,loading,error}=useLiveNews(); const {items:cmsPosts}=useCmsPosts(); const [q,setQ]=useState(''); const [source,setSource]=useState('all');
  const all=useMemo(()=>[...(data.items||[]),...cmsPosts,...manualPosts].filter((x,i,a)=>a.findIndex(y=>y.id===x.id&&y.source===x.source)===i),[data.items,cmsPosts]);
  const filtered=useMemo(()=>all.filter(i=>{
    if(alertsOnly && !/(alert|cisa|cert|vulnerability|cve|security)/i.test(`${i.category} ${i.title}`)) return false;
    if(source!=='all' && i.source!==source) return false;
    if(q && !`${i.title} ${i.summary} ${i.category} ${i.source}`.toLowerCase().includes(q.toLowerCase())) return false;
    return true;
  }).sort((a,b)=>String(b.publishedAt).localeCompare(String(a.publishedAt))),[all,q,source,alertsOnly]);
  const sources=[...new Set(all.map(x=>x.source))];
  return <>
    <PageHero eyebrow={alertsOnly?'Cyber Alerts':'News & Intelligence'} title={alertsOnly?'Official cyber alerts & NexVibe awareness':'Cybersecurity news, alerts & digital intelligence'} lead="Official-source feed items link directly to the original authority. NexVibe editorial posts remain separate and manually published."/>
    <section className="nv-section-compact"><div className="nv-container">
      <div className="nv-toolbar"><input className="nv-input" placeholder="Search news, CVEs, vendors or source…" value={q} onChange={e=>setQ(e.target.value)}/><select className="nv-input nv-filter-select" value={source} onChange={e=>setSource(e.target.value)}><option value="all">All sources</option>{sources.map(s=><option key={s}>{s}</option>)}</select><span className="nv-muted">{filtered.length} items</span></div>
      <div className="nv-card" style={{padding:14,marginBottom:18,display:'flex',alignItems:'center',gap:10,flexWrap:'wrap'}}><RefreshCw size={16} color="var(--cyan)"/><strong>Near-live official feed</strong><span className="nv-muted">Scheduled GitHub sync refreshes official sources without a paid API. {data.syncedAt?`Last file sync: ${new Date(data.syncedAt).toLocaleString()}.`:''}</span></div>
      {loading?<div className="nv-card" style={{padding:24}}>Loading feed…</div>:error?<div className="nv-card" style={{padding:24}}>Official live feed could not load. Manual posts are still available.</div>:null}
      <div className="nv-grid-3">{filtered.length?filtered.map(x=><Card key={`${x.source}-${x.id}`} item={x}/>):<EmptyState title="No matching news" body="Try another keyword or source filter."/>}</div>
    </div></section>
  </>
}
