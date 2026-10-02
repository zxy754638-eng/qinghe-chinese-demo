const CACHE_NAME='qinghe-shell-v23';
const APP_SHELL=['./','./index.html','./app.js?v=23','./auth.js?v=23','./pwa.js?v=23','./data-words.js?v=23','./data-lessons.js?v=23','./data-upper-lessons.js?v=23','./data-upper-words.js?v=23','./data-dictionary-fixes.js?v=23','./data-themed-vocab.js?v=23','./vendor/axios.min.js','./vendor/authing-web.global.js','./manifest.webmanifest','./icon.svg'];

self.addEventListener('install',event=>{event.waitUntil(caches.open(CACHE_NAME).then(cache=>cache.addAll(APP_SHELL)).then(()=>self.skipWaiting()))});
self.addEventListener('activate',event=>{event.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(key=>key.startsWith('qinghe-')&&key!==CACHE_NAME).map(key=>caches.delete(key)))).then(()=>self.clients.claim()))});
self.addEventListener('fetch',event=>{
  const request=event.request;if(request.method!=='GET')return;const url=new URL(request.url);if(url.origin!==self.location.origin)return;
  if(request.mode==='navigate'){event.respondWith(fetch(request).then(response=>{const copy=response.clone();caches.open(CACHE_NAME).then(cache=>cache.put('./index.html',copy));return response}).catch(()=>caches.match('./index.html')));return}
  event.respondWith(caches.match(request).then(cached=>cached||fetch(request).then(response=>{if(response.ok){const copy=response.clone();caches.open(CACHE_NAME).then(cache=>cache.put(request,copy))}return response})));
});
