const CACHE='nexvibe-public-v2';
const BASE=new URL('./',self.location.href).pathname;
const STATIC=[BASE,`${BASE}offline.html`,`${BASE}assets/nexvibe-logo.png`,`${BASE}assets/hero-desktop.webp`,`${BASE}assets/hero-mobile.webp`,`${BASE}assets/brand-wide.webp`];
self.addEventListener('install',e=>e.waitUntil(caches.open(CACHE).then(c=>c.addAll(STATIC)).catch(()=>{})));
self.addEventListener('activate',e=>e.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k!==CACHE).map(k=>caches.delete(k))))));
self.addEventListener('fetch',e=>{
  const u=new URL(e.request.url); if(e.request.method!=='GET')return;
  const sensitive=/password-check|email-safety|url-check|qr-check|file-hash|domain-check|reports|admin|login|register|profile/i.test(u.pathname);
  if(e.request.mode==='navigate'){
    if(sensitive){e.respondWith(fetch(e.request));return;}
    e.respondWith(fetch(e.request).catch(()=>caches.match(`${BASE}offline.html`)));return;
  }
  if(e.request.destination==='image'||e.request.destination==='style'||e.request.destination==='script'){
    e.respondWith(caches.match(e.request).then(hit=>hit||fetch(e.request).then(r=>{const copy=r.clone();caches.open(CACHE).then(c=>c.put(e.request,copy));return r;})));
  }
});
