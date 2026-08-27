import { Link, useParams } from 'react-router-dom';
import { CheckCircle2, Copy, ExternalLink, Share2 } from 'lucide-react';
import { manualPosts } from '../data/manual';
import { siteConfig } from '../lib/config';
import { PageHero } from '../components/Common';
import { useCmsPosts } from '../lib/live';
import BookmarkButton from '../components/BookmarkButton';
import Seo from '../components/Seo';

export default function Article(){
  const {slug}=useParams(); const {items:cmsPosts}=useCmsPosts(); const all=[...cmsPosts,...manualPosts]; const item=all.find(x=>x.id===slug);
  if(!item) return <><Seo title="Article not found" path={`/news/${slug||''}`}/><PageHero eyebrow="News" title="Article not found" lead="The requested NexVibe editorial article does not exist."/><section className="nv-section-compact"><div className="nv-container"><Link className="nv-button" to="/news">Back to news</Link></div></section></>;
  const related=all.filter(x=>x.id!==item.id&&(x.category===item.category||(x.tags||[]).some(t=>(item.tags||[]).includes(t)))).slice(0,3);
  const verified=item.verificationStatus==='verified'||item.official;
  async function share(){if(navigator.share)await navigator.share({title:item.title,text:item.summary,url:location.href});else await navigator.clipboard.writeText(location.href)}
  return <><Seo title={item.title} description={item.summary} image={item.image||siteConfig.heroDesktop} path={`/news/${item.id}`} type="article"/><section className="nv-page-hero"><div className="nv-container nv-article">
    <div className="nv-article-head"><div className="nv-meta" style={{justifyContent:'center'}}><span className="nv-chip">{item.category}</span>{verified&&<span className="nv-live-badge"><CheckCircle2 size={13}/>Source verified</span>}{item.country&&<span>{item.country}</span>}</div><h1 className="nv-title">{item.title}</h1><p className="nv-article-dek">{item.summary}</p><div className="nv-meta" style={{justifyContent:'center'}}><span>{item.source}</span><span>{String(item.publishedAt).slice(0,10)}</span>{item.sourceVerifiedAt&&<span>Verified {new Date(item.sourceVerifiedAt).toLocaleDateString()}</span>}</div></div>
    <img className="nv-article-cover" src={item.image||siteConfig.heroDesktop} alt={item.title}/>
    <div className="nv-article-toolbar"><BookmarkButton itemId={item.id}/><button className="nv-button" onClick={share}><Share2 size={15}/>Share</button><button className="nv-button" onClick={()=>navigator.clipboard.writeText(location.href)}><Copy size={15}/>Copy link</button></div>
    <article className="nv-prose">{(item.content||[]).map((p,i)=><p key={i}>{p}</p>)}
      {(item.tags||[]).length>0&&<div className="nv-tag-row">{item.tags!.map(t=><span className="nv-chip" key={t}>{t}</span>)}</div>}
      <div className="nv-card nv-source-box"><strong>Source & verification</strong><p className="nv-muted">{verified?'This article includes a source marked as official or verified by NexVibe. Always open the primary source for operational decisions.':'This article should be checked against its cited source before security, legal or operational decisions.'}</p>{item.sourceUrl.startsWith('http')&&<a className="nv-button" href={item.sourceUrl} target="_blank" rel="noreferrer">Open original source <ExternalLink size={15}/></a>}</div>
    </article>
    {related.length>0&&<section className="nv-related"><div className="nv-section-head"><div><span className="nv-eyebrow">Keep reading</span><h2 className="nv-title">Related posts</h2></div><Link className="nv-button" to="/news">All news</Link></div><div className="nv-grid-3">{related.map(r=><Link key={r.id} to={`/news/${r.id}`} className="nv-card nv-related-card"><img src={r.image||siteConfig.heroDesktop} alt=""/><div><span className="nv-chip">{r.category}</span><h3>{r.title}</h3><p className="nv-muted">{r.summary}</p></div></Link>)}</div></section>}
  </div></section></>
}
