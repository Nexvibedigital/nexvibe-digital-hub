import { useEffect } from 'react';
import { siteConfig } from '../lib/config';

const SITE='https://nexvibedigital.github.io/nexvibe-digital-hub';

function ensureMeta(selector:string,attrs:Record<string,string>){
  let el=document.head.querySelector(selector) as HTMLMetaElement|null;
  if(!el){el=document.createElement('meta');Object.entries(attrs).forEach(([k,v])=>el!.setAttribute(k,v));document.head.appendChild(el)}
  return el;
}
function ensureLink(rel:string){
  let el=document.head.querySelector(`link[rel="${rel}"]`) as HTMLLinkElement|null;
  if(!el){el=document.createElement('link');el.rel=rel;document.head.appendChild(el)}
  return el;
}

export default function Seo({title,description,image,path,type='website'}:{title:string;description?:string;image?:string;path?:string;type?:'website'|'article'}){
  useEffect(()=>{
    const fullTitle=title.includes('NexVibe')?title:`${title} | NexVibe`;
    const desc=description||'NexVibe Cyber & Digital Hub — Learn. Investigate. Secure. Build.';
    const url=`${SITE}${path||location.pathname.replace('/nexvibe-digital-hub','')}`;
    const img=image||siteConfig.heroDesktop;
    document.title=fullTitle;
    ensureMeta('meta[name="description"]',{name:'description'}).content=desc;
    ensureMeta('meta[property="og:title"]',{property:'og:title'}).content=fullTitle;
    ensureMeta('meta[property="og:description"]',{property:'og:description'}).content=desc;
    ensureMeta('meta[property="og:type"]',{property:'og:type'}).content=type;
    ensureMeta('meta[property="og:url"]',{property:'og:url'}).content=url;
    ensureMeta('meta[property="og:image"]',{property:'og:image'}).content=img;
    ensureMeta('meta[name="twitter:card"]',{name:'twitter:card'}).content='summary_large_image';
    ensureMeta('meta[name="twitter:title"]',{name:'twitter:title'}).content=fullTitle;
    ensureMeta('meta[name="twitter:description"]',{name:'twitter:description'}).content=desc;
    ensureMeta('meta[name="twitter:image"]',{name:'twitter:image'}).content=img;
    ensureLink('canonical').href=url;
  },[title,description,image,path,type]);
  return null;
}
