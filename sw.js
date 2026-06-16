const CACHE='manufaktur-v28';
const ASSETS=['./','./index.html','./js/app.js?v=28','./manifest.webmanifest',
  './icons/icon-192.png','./icons/icon-512.png','./icons/icon-maskable-512.png',
  './icons/apple-touch-icon.png','./icons/favicon-64.png',
  './parque.html','./js/parque.js','./data/parque_data.json','./data/provincias.geojson',
  './data/equipment_catalog.json?v=23',
  './taller.html','./js/taller.js?v=24'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(CACHE).then(c=>c.addAll(ASSETS)).then(()=>self.skipWaiting()));});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim()));});
// RED PRIMERO: siempre intenta traer la versión nueva; la caché solo sirve si estás offline.
self.addEventListener('fetch',e=>{
  const u=new URL(e.request.url);
  if(u.origin!==location.origin) return;
  e.respondWith(
    fetch(e.request).then(res=>{
      const copy=res.clone();caches.open(CACHE).then(c=>c.put(e.request,copy));return res;
    }).catch(()=>caches.match(e.request).then(r=>r||caches.match('./index.html')))
  );
});
