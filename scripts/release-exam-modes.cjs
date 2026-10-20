const fs=require('fs');
for(const file of ['dist/index.html','dist/sw.js','dist/pwa.js']){
 let s=fs.readFileSync(file,'utf8').replaceAll('?v=69','?v=70').replaceAll('qinghe-shell-v69','qinghe-shell-v70');
 if(file.endsWith('index.html')&&!s.includes('exam-modes.css'))s=s.replace('</head>','<link rel="stylesheet" href="exam-modes.css?v=70">\n</head>');
 if(file.endsWith('sw.js')&&!s.includes('exam-modes.css'))s=s.replace("self.addEventListener('install'","APP_SHELL.push('./exam-modes.css?v=70','./exam-papers/index.json','./exam-papers/qh-hsk1-01.json','./exam-papers/qh-hsk1-02.json','./licenses/HSK1-MOCK-IMAGES.txt');\nself.addEventListener('install'");
 // Paper versions and listening files must refresh after uploads, while still working from cache offline.
 if(file.endsWith('sw.js')&&!s.includes("url.pathname.includes('/exam-papers/')"))s=s.replace("  if(request.mode==='navigate')", "  if(url.pathname.includes('/exam-papers/')||url.pathname.includes('/audio/exams/')){event.respondWith(fetch(request,{cache:'no-store'}).then(response=>{if(response.ok){const copy=response.clone();caches.open(CACHE_NAME).then(cache=>cache.put(request,copy))}return response}).catch(()=>caches.match(request).then(cached=>cached||Response.error())));return}\n  if(request.mode==='navigate')");
 fs.writeFileSync(file,s);
}
