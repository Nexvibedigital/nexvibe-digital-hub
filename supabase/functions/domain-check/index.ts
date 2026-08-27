// Deploy only after reviewing Supabase Edge Function egress/network behaviour.
// This is a passive domain-check scaffold; it deliberately avoids port scanning or crawling.
import { serve } from 'https://deno.land/std@0.224.0/http/server.ts';

const blockedHost=(host:string)=>{
  const h=host.toLowerCase();
  if(h==='localhost'||h.endsWith('.localhost')||h==='0.0.0.0'||h==='169.254.169.254') return true;
  if(/^127\./.test(h)||/^10\./.test(h)||/^192\.168\./.test(h)) return true;
  const m=h.match(/^172\.(\d+)\./); if(m&&Number(m[1])>=16&&Number(m[1])<=31)return true;
  if(h==='::1'||h.startsWith('fc')||h.startsWith('fd')||h.startsWith('fe80:'))return true;
  return false;
};
serve(async(req)=>{
  if(req.method!=='POST')return new Response('Method not allowed',{status:405});
  let body:any;try{body=await req.json()}catch{return Response.json({error:'Invalid JSON'},{status:400})}
  let url:URL;try{url=new URL(/^https?:\/\//i.test(body.domain)?body.domain:`https://${body.domain}`)}catch{return Response.json({error:'Invalid domain'},{status:400})}
  if(blockedHost(url.hostname))return Response.json({error:'Blocked destination'},{status:400});
  const ac=new AbortController();const timer=setTimeout(()=>ac.abort(),8000);
  try{
    const r=await fetch(url,{method:'HEAD',redirect:'manual',signal:ac.signal,headers:{'user-agent':'NexVibe-Domain-Check/1.0'}});
    const allowed=['content-security-policy','strict-transport-security','x-content-type-options','referrer-policy','permissions-policy'];
    const headers=Object.fromEntries(allowed.map(k=>[k,r.headers.get(k)]));
    return Response.json({checkedUrl:url.origin,status:r.status,https:url.protocol==='https:',redirect:r.headers.get('location'),headers,limitation:'This passive response check does not prove a website is safe.'});
  }catch{return Response.json({error:'Unable to verify'},{status:502})}finally{clearTimeout(timer)}
});
