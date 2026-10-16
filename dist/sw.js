const CACHE_NAME='qinghe-shell-v68';
const APP_SHELL=['./','./index.html','./app.js?v=68','./auth.js?v=68','./pwa.js?v=68','./data-words.js?v=68','./data-lessons.js?v=68','./data-upper-lessons.js?v=68','./data-upper-words.js?v=68','./data-advanced-lessons.js?v=68','./data-advanced-words.js?v=68','./data-dictionary-fixes.js?v=68','./data-themed-vocab.js?v=68','./data-themed-example-en.js?v=68','./data-themed-vocab-balanced.js?v=68','./data-hsk30-syllabus.js?v=68','./data/hsk30-review-report.json','./data/hsk79-vocabulary.min.json','./licenses/GUSHI-HSK30-NOTICE.txt','./vendor/axios.min.js','./vendor/authing-web.global.js','./manifest.webmanifest','./icon.svg','./share-card.png'];

APP_SHELL.push('./exam.css?v=68','./exam-core.js?v=68','./data-exam-demo.js?v=68','./exam.js?v=68','./exam-paper-template.json','./exam-import-guide.md');

APP_SHELL.push('./advanced-study.js?v=68','./advanced-study.css?v=68');
APP_SHELL.push('./experience.css?v=68','./experience-core.js?v=68','./experience.js?v=68','./fonts/InterVariable.woff2','./fonts/SourceHanSansCN-VF.woff2');
self.addEventListener('install',event=>{event.waitUntil(caches.open(CACHE_NAME).then(cache=>cache.addAll(APP_SHELL)).then(()=>self.skipWaiting()))});
self.addEventListener('activate',event=>{event.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(key=>key.startsWith('qinghe-')&&key!==CACHE_NAME).map(key=>caches.delete(key)))).then(()=>self.clients.claim()))});
self.addEventListener('fetch',event=>{
  const request=event.request;if(request.method!=='GET')return;const url=new URL(request.url);if(url.origin!==self.location.origin)return;
  if(request.mode==='navigate'){event.respondWith(fetch(request,{cache:'no-store'}).then(response=>{const copy=response.clone();caches.open(CACHE_NAME).then(cache=>cache.put('./index.html',copy));return response}).catch(()=>caches.match('./index.html')));return}
  event.respondWith(caches.match(request).then(cached=>cached||fetch(request).then(response=>{if(response.ok){const copy=response.clone();caches.open(CACHE_NAME).then(cache=>cache.put(request,copy))}return response})));
});
