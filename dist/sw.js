const CACHE_NAME='qinghe-shell-v70';
const APP_SHELL=['./','./index.html','./app.js?v=70','./auth.js?v=70','./pwa.js?v=70','./data-words.js?v=70','./data-lessons.js?v=70','./data-upper-lessons.js?v=70','./data-upper-words.js?v=70','./data-advanced-lessons.js?v=70','./data-advanced-words.js?v=70','./data-dictionary-fixes.js?v=70','./data-themed-vocab.js?v=70','./data-themed-example-en.js?v=70','./data-themed-vocab-balanced.js?v=70','./data-hsk30-syllabus.js?v=70','./data/hsk30-review-report.json','./data/hsk79-vocabulary.min.json','./licenses/GUSHI-HSK30-NOTICE.txt','./vendor/axios.min.js','./vendor/authing-web.global.js','./manifest.webmanifest','./icon.svg','./share-card.png'];

APP_SHELL.push('./exam.css?v=70','./exam-core.js?v=70','./data-exam-demo.js?v=70','./exam.js?v=70','./exam-paper-template.json','./exam-import-guide.md');

APP_SHELL.push('./advanced-study.js?v=70','./advanced-study.css?v=70');
APP_SHELL.push('./experience.css?v=70','./experience-core.js?v=70','./experience.js?v=70','./fonts/InterVariable.woff2','./fonts/SourceHanSansCN-VF.woff2');
APP_SHELL.push('./exam-modes.css?v=70','./exam-papers/index.json','./exam-papers/qh-hsk1-01.json','./exam-papers/qh-hsk1-02.json','./licenses/HSK1-MOCK-IMAGES.txt');
self.addEventListener('install',event=>{event.waitUntil(caches.open(CACHE_NAME).then(cache=>cache.addAll(APP_SHELL)).then(()=>self.skipWaiting()))});
self.addEventListener('activate',event=>{event.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(key=>key.startsWith('qinghe-')&&key!==CACHE_NAME).map(key=>caches.delete(key)))).then(()=>self.clients.claim()))});
self.addEventListener('fetch',event=>{
  const request=event.request;if(request.method!=='GET')return;const url=new URL(request.url);if(url.origin!==self.location.origin)return;
  if(url.pathname.includes('/exam-papers/')||url.pathname.includes('/audio/exams/')){event.respondWith(fetch(request,{cache:'no-store'}).then(response=>{if(response.ok){const copy=response.clone();caches.open(CACHE_NAME).then(cache=>cache.put(request,copy))}return response}).catch(()=>caches.match(request).then(cached=>cached||Response.error())));return}
  if(request.mode==='navigate'){event.respondWith(fetch(request,{cache:'no-store'}).then(response=>{const copy=response.clone();caches.open(CACHE_NAME).then(cache=>cache.put('./index.html',copy));return response}).catch(()=>caches.match('./index.html')));return}
  event.respondWith(caches.match(request).then(cached=>cached||fetch(request).then(response=>{if(response.ok){const copy=response.clone();caches.open(CACHE_NAME).then(cache=>cache.put(request,copy))}return response})));
});
