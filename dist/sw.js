const CACHE_NAME='qinghe-shell-v34';
const APP_SHELL=['./','./index.html','./app.js?v=34','./auth.js?v=34','./pwa.js?v=34','./data-words.js?v=34','./data-lessons.js?v=34','./data-upper-lessons.js?v=34','./data-upper-words.js?v=34','./data-advanced-lessons.js?v=34','./data-advanced-words.js?v=34','./data-dictionary-fixes.js?v=34','./data-themed-vocab.js?v=34','./data-themed-example-en.js?v=34','./data-themed-vocab-balanced.js?v=34','./data-hsk30-syllabus.js?v=34','./data/hsk30-review-report.json','./vendor/axios.min.js','./vendor/authing-web.global.js','./manifest.webmanifest','./icon.svg','./share-card.png'];

self.addEventListener('install',event=>{event.waitUntil(caches.open(CACHE_NAME).then(cache=>cache.addAll(APP_SHELL)).then(()=>self.skipWaiting()))});
self.addEventListener('activate',event=>{event.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(key=>key.startsWith('qinghe-')&&key!==CACHE_NAME).map(key=>caches.delete(key)))).then(()=>self.clients.claim()))});
self.addEventListener('fetch',event=>{
  const request=event.request;if(request.method!=='GET')return;const url=new URL(request.url);if(url.origin!==self.location.origin)return;
  if(request.mode==='navigate'){event.respondWith(fetch(request,{cache:'no-store'}).then(response=>{const copy=response.clone();caches.open(CACHE_NAME).then(cache=>cache.put('./index.html',copy));return response}).catch(()=>caches.match('./index.html')));return}
  event.respondWith(caches.match(request).then(cached=>cached||fetch(request).then(response=>{if(response.ok){const copy=response.clone();caches.open(CACHE_NAME).then(cache=>cache.put(request,copy))}return response})));
});
