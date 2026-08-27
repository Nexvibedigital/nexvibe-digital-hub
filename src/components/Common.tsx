import type { ReactNode } from 'react';
import { ExternalLink } from 'lucide-react';

export function PageHero({eyebrow,title,lead,children}:{eyebrow:string;title:string;lead?:string;children?:ReactNode}){
  return <section className="nv-page-hero"><div className="nv-container"><span className="nv-eyebrow">{eyebrow}</span><h1 className="nv-title">{title}</h1>{lead&&<p>{lead}</p>}{children}</div></section>
}
export function SectionHead({eyebrow,title,lead,action}:{eyebrow:string;title:string;lead?:string;action?:ReactNode}){
  return <div className="nv-section-head"><div><span className="nv-eyebrow">{eyebrow}</span><h2 className="nv-title">{title}</h2>{lead&&<p>{lead}</p>}</div>{action}</div>
}
export function EmptyState({title='Nothing here yet',body='There is no verified content to show right now.'}:{title?:string;body?:string}){
  return <div className="nv-card" style={{padding:28,textAlign:'center',gridColumn:'1/-1'}}><h3 style={{marginTop:0}}>{title}</h3><p className="nv-muted">{body}</p></div>
}
export function SourceLink({href,children}:{href:string;children:ReactNode}){return <a href={href} target="_blank" rel="noreferrer" className="nv-button">{children}<ExternalLink size={15}/></a>}
