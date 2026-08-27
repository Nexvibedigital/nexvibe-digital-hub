const CACHE='nexvibe-public-v3';
const BASE=new URL('./',self.location.href).pathname;
const STATIC=[BASE,`${BASE}offline.html`,`${BASE}manifest.webmanifest`,`${BASE}assets/nexvibe-logo.png`,`${BASE}assets/hero-desktop.webp`,`${BASE}assets/hero-mobile.webp`,`${BASE}assets/brand-wide.webp`];
self.addEventListener('install',e=>{self.skipWaiting();e.waitUntil(caches.open(CACHE).then(c=>c.addAll(STATIC)).catch(()=>{}))});
self.addEventListener('activate',e=>e.waitUntil(Promise.all([self.clients.claim(),caches.keys().then(keys=>Promise.all(keys.filter(k=>k!==CACHE).map(k=>caches.delete(k))))])));
self.addEventListener('fetch',e=>{
  const u=new URL(e.request.url);if(e.request.method!=='GET')return;
  const sensitive=/password-check|email-safety|url-check|qr-check|file-hash|domain-check|reports|admin|login|register|profile|saved/i.test(u.pathname);
  if(e.request.mode==='navigate'){
    if(sensitive){e.respondWith(fetch(e.request));return;}
    e.respondWith(fetch(e.request).then(r=>{const copy=r.clone();caches.open(CACHE).then(c=>c.put(BASE,copy));return r}).catch(()=>caches.match(BASE).then(r=>r||caches.match(`${BASE}offline.html`))));return;
  }
  if(e.request.destination==='image'){
    e.respondWith(caches.match(e.request).then(hit=>hit||fetch(e.request).then(r=>{const copy=r.clone();caches.open(CACHE).then(c=>c.put(e.request,copy));return r;})));return;
  }
  if(e.request.destination==='style'||e.request.destination==='script'){
    e.respondWith(fetch(e.request).then(r=>{const copy=r.clone();caches.open(CACHE).then(c=>c.put(e.request,copy));return r}).catch(()=>caches.match(e.request)));return;
  }
});
