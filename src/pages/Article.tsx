import { Link, useParams } from 'react-router-dom';
import { ExternalLink, Share2 } from 'lucide-react';
import { manualPosts } from '../data/manual';
import { siteConfig } from '../lib/config';
import { PageHero } from '../components/Common';
import { useCmsPosts } from '../lib/live';

export default function Article(){
  const {slug}=useParams(); const {items:cmsPosts}=useCmsPosts(); const item=[...cmsPosts,...manualPosts].find(x=>x.id===slug);
  if(!item) return <><PageHero eyebrow="News" title="Article not found" lead="The requested NexVibe editorial article does not exist in this build."/><section className="nv-section-compact"><div className="nv-container"><Link className="nv-button" to="/news">Back to news</Link></div></section></>;
  return <section className="nv-page-hero"><div className="nv-container nv-article"><div className="nv-article-head"><span className="nv-chip">{item.category}</span><h1 className="nv-title">{item.title}</h1><p className="nv-muted">{item.summary}</p><div className="nv-meta" style={{justifyContent:'center'}}><span>{item.source}</span><span>{item.publishedAt}</span></div></div><img className="nv-article-cover" src={item.image||siteConfig.heroDesktop} alt=""/><article className="nv-prose">{(item.content||[]).map((p,i)=><p key={i}>{p}</p>)}<div className="nv-card" style={{padding:18,marginTop:24}}><strong>Source & verification</strong><p className="nv-muted">NexVibe summaries should be verified against the official source before operational decisions.</p>{item.sourceUrl.startsWith('http')&&<a className="nv-button" href={item.sourceUrl} target="_blank" rel="noreferrer">Open official source <ExternalLink size={15}/></a>}</div></article><div className="nv-hero-actions" style={{justifyContent:'center'}}><button className="nv-button" onClick={()=>navigator.share?navigator.share({title:item.title,url:location.href}):navigator.clipboard.writeText(location.href)}><Share2 size={15}/>Share</button><Link className="nv-button" to="/news">More news</Link></div></div></section>
}
