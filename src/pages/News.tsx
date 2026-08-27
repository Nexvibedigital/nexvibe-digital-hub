import { useMemo, useState } from 'react';
import { ExternalLink, RefreshCw, Search as SearchIcon } from 'lucide-react';
import { Link } from 'react-router-dom';
import { PageHero, EmptyState } from '../components/Common';
import { manualPosts } from '../data/manual';
import { useLiveNews, useCmsPosts } from '../lib/live';
import { siteConfig } from '../lib/config';
import type { NewsItem } from '../types';
import BookmarkButton from '../components/BookmarkButton';
import Seo from '../components/Seo';

function Card({item}:{item:NewsItem}){
  const internal=item.source==='NexVibe';
  return <article className="nv-card nv-card-hover nv-news-card"><Link className="nv-news-image" to={internal?`/news/${item.id}`:'/news'} onClick={e=>{if(!internal)e.preventDefault()}}><img loading="lazy" src={item.image||siteConfig.heroDesktop} alt={item.title}/></Link><div className="nv-news-body"><div className="nv-meta"><span className="nv-chip">{item.category}</span><span>{item.source}</span><span>{String(item.publishedAt).slice(0,10)}</span>{item.verificationStatus==='verified'&&<span className="nv-live-badge">Verified</span>}</div><h3>{internal?<Link to={`/news/${item.id}`}>{item.title}</Link>:item.title}</h3><p className="nv-muted nv-clamp-3">{item.summary}</p><div className="nv-card-footer"><span className={item.official?'nv-live-badge':'nv-muted'}>{item.official?'Official source':'NexVibe article'}</span><div className="nv-inline-actions"><BookmarkButton itemId={item.id} compact/>{internal?<Link to={`/news/${item.id}`} className="nv-button">Read more</Link>:<a href={item.sourceUrl} target="_blank" rel="noreferrer" className="nv-button">Original <ExternalLink size={14}/></a>}</div></div></div></article>
}

export default function News({alertsOnly=false}:{alertsOnly?:boolean}){
  const {data,loading,error}=useLiveNews(); const {items:cmsPosts}=useCmsPosts(); const [q,setQ]=useState(''); const [source,setSource]=useState('all'); const [category,setCategory]=useState('all'); const [range,setRange]=useState('all');
  const all=useMemo(()=>[...(data.items||[]),...cmsPosts,...manualPosts].filter((x,i,a)=>a.findIndex(y=>(y.sourceUrl&&y.sourceUrl===x.sourceUrl)||(!y.sourceUrl&&y.id===x.id&&y.source===x.source))===i),[data.items,cmsPosts]);
  const filtered=useMemo(()=>all.filter(i=>{
    if(alertsOnly && !/(alert|cisa|cert|vulnerability|cve|security)/i.test(`${i.category} ${i.title}`)) return false;
    if(source!=='all' && i.source!==source) return false;
    if(category!=='all' && i.category!==category) return false;
    if(q && !`${i.title} ${i.summary} ${i.category} ${i.source} ${(i.tags||[]).join(' ')}`.toLowerCase().includes(q.toLowerCase())) return false;
    if(range!=='all'&&i.publishedAt){const days=Number(range);const d=new Date(i.publishedAt).getTime();if(Number.isFinite(days)&&Date.now()-d>days*86400000)return false;}
    return true;
  }).sort((a,b)=>String(b.publishedAt).localeCompare(String(a.publishedAt))),[all,q,source,category,range,alertsOnly]);
  const sources=[...new Set(all.map(x=>x.source))].sort(); const categories=[...new Set(all.map(x=>x.category))].sort();
  return <><Seo title={alertsOnly?'Cyber Alerts':'News & Intelligence'} description="NexVibe cybersecurity news, official alerts, Sri Lanka CERT updates, CISA advisories and digital intelligence." path={alertsOnly?'/cyber-alerts':'/news'}/>
    <PageHero eyebrow={alertsOnly?'Cyber Alerts':'News & Intelligence'} title={alertsOnly?'Official cyber alerts & NexVibe awareness':'Cybersecurity news, alerts & digital intelligence'} lead="Filter by source, category and date. Official-source feed items link to the original authority; NexVibe editorial posts include full article pages."/>
    <section className="nv-section-compact"><div className="nv-container">
      <div className="nv-filter-panel nv-card"><div className="nv-filter-search"><SearchIcon size={18}/><input placeholder="Search news, CVEs, vendors, tags or source…" value={q} onChange={e=>setQ(e.target.value)}/></div><select className="nv-input" value={source} onChange={e=>setSource(e.target.value)}><option value="all">All sources</option>{sources.map(s=><option key={s}>{s}</option>)}</select><select className="nv-input" value={category} onChange={e=>setCategory(e.target.value)}><option value="all">All categories</option>{categories.map(c=><option key={c}>{c}</option>)}</select><select className="nv-input" value={range} onChange={e=>setRange(e.target.value)}><option value="all">Any date</option><option value="1">Last 24 hours</option><option value="7">Last 7 days</option><option value="30">Last 30 days</option><option value="90">Last 90 days</option></select><span className="nv-result-count">{filtered.length} items</span></div>
      <div className="nv-card nv-feed-status"><RefreshCw size={16}/><div><strong>Near-live official feed</strong><span>Scheduled GitHub sync refreshes official sources without a paid API. {data.syncedAt?`Last sync: ${new Date(data.syncedAt).toLocaleString()}.`:''}</span></div></div>
      {loading?<div className="nv-card" style={{padding:24}}>Loading feed…</div>:error?<div className="nv-card" style={{padding:24}}>Official live feed could not load. NexVibe posts are still available.</div>:null}
      <div className="nv-grid-3 nv-news-grid">{filtered.length?filtered.map(x=><Card key={`${x.source}-${x.id}`} item={x}/>):<EmptyState title="No matching news" body="Try another keyword, source, category or date range."/>}</div>
    </div></section>
  </>
}
