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
  const article=item;
  const related=all.filter(x=>x.id!==article.id&&(x.category===article.category||(x.tags||[]).some(t=>(article.tags||[]).includes(t)))).slice(0,3);
  const verified=article.verificationStatus==='verified'||article.official;
  async function share(){if(navigator.share)await navigator.share({title:article.title,text:article.summary,url:location.href});else await navigator.clipboard.writeText(location.href)}
  return <><Seo title={article.title} description={article.summary} image={article.image||siteConfig.heroDesktop} path={`/news/${article.id}`} type="article"/><section className="nv-page-hero"><div className="nv-container nv-article">
    <div className="nv-article-head"><div className="nv-meta" style={{justifyContent:'center'}}><span className="nv-chip">{article.category}</span>{verified&&<span className="nv-live-badge"><CheckCircle2 size={13}/>Source verified</span>}{article.country&&<span>{article.country}</span>}</div><h1 className="nv-title">{article.title}</h1><p className="nv-article-dek">{article.summary}</p><div className="nv-meta" style={{justifyContent:'center'}}><span>{article.source}</span><span>{String(article.publishedAt).slice(0,10)}</span>{article.sourceVerifiedAt&&<span>Verified {new Date(article.sourceVerifiedAt).toLocaleDateString()}</span>}</div></div>
    <img className="nv-article-cover" src={article.image||siteConfig.heroDesktop} alt={article.title}/>
    <div className="nv-article-toolbar"><BookmarkButton itemId={article.id}/><button className="nv-button" onClick={share}><Share2 size={15}/>Share</button><button className="nv-button" onClick={()=>navigator.clipboard.writeText(location.href)}><Copy size={15}/>Copy link</button></div>
    <article className="nv-prose">{(article.content||[]).map((p,i)=><p key={i}>{p}</p>)}
      {(article.tags||[]).length>0&&<div className="nv-tag-row">{article.tags!.map(t=><span className="nv-chip" key={t}>{t}</span>)}</div>}
      <div className="nv-card nv-source-box"><strong>Source & verification</strong><p className="nv-muted">{verified?'This article includes a source marked as official or verified by NexVibe. Always open the primary source for operational decisions.':'This article should be checked against its cited source before security, legal or operational decisions.'}</p>{article.sourceUrl.startsWith('http')&&<a className="nv-button" href={article.sourceUrl} target="_blank" rel="noreferrer">Open original source <ExternalLink size={15}/></a>}</div>
    </article>
    {related.length>0&&<section className="nv-related"><div className="nv-section-head"><div><span className="nv-eyebrow">Keep reading</span><h2 className="nv-title">Related posts</h2></div><Link className="nv-button" to="/news">All news</Link></div><div className="nv-grid-3">{related.map(r=><Link key={r.id} to={`/news/${r.id}`} className="nv-card nv-related-card"><img src={r.image||siteConfig.heroDesktop} alt=""/><div><span className="nv-chip">{r.category}</span><h3>{r.title}</h3><p className="nv-muted">{r.summary}</p></div></Link>)}</div></section>}
  </div></section></>
}
