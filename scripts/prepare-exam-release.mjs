import {readFileSync,writeFileSync} from 'node:fs';
for(const path of ['dist/index.html','dist/sw.js']){
  let source=readFileSync(path,'utf8');source=source.replaceAll('?v=44','?v=48').replaceAll('?v=47','?v=48').replace(/qinghe-shell-v(?:44|47(?:-exams)?)/,'qinghe-shell-v48');
  if(path.endsWith('sw.js')&&!source.includes("APP_SHELL.push('./exam.css"))source=source.replace("self.addEventListener('install'","APP_SHELL.push('./exam.css?v=48','./exam-core.js?v=48','./data-exam-demo.js?v=48','./exam.js?v=48','./exam-paper-template.json','./exam-import-guide.md');\n\nself.addEventListener('install'");
  writeFileSync(path,source);
}
const pwa='dist/pwa.js';writeFileSync(pwa,readFileSync(pwa,'utf8').replace(/sw.js\?v=(43|47)/,'sw.js?v=48'));
