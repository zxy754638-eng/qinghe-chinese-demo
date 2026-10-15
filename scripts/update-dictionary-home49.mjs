import{readFileSync,writeFileSync}from'node:fs';
let html=readFileSync('dist/index.html','utf8');
html=html.replace(/<div class="dict-suggestions">[\s\S]*?<\/div>/,'');
if(!html.includes('id="dictFeedback"'))html=html.replace('<div class="dict-results" id="dictResults" aria-live="polite"></div>','<div class="dict-results" id="dictResults" aria-live="polite"></div><p id="dictFeedback" class="sub" role="status" hidden></p>');
html=html.replace('  </style>',`    .dict-entry[hidden]{display:none}.dict-entry{scroll-margin-top:110px}
    @media(max-width:620px){
      #home .home-watermark{font-size:9px;margin-bottom:6px}
      #home .home-dashboard,#home .home-secondary-grid{gap:10px}
      #home .lesson-card{padding:14px 18px}
      #home .lesson-card-layout{grid-template-columns:minmax(0,1fr) minmax(0,1fr);gap:12px;min-height:0}
      #home .lesson-card-copy{display:contents}
      #home .lesson-status,#home .lesson-card h2{grid-column:1/-1}
      #home .lesson-card h2{font-size:clamp(27px,7.6vw,32px);line-height:1.25;margin:0}
      #home .lesson-card-copy>.primary{grid-row:3;grid-column:1;justify-self:start;align-self:center;margin:0;padding:8px 12px;font-size:14px}
      #home .home-progress{grid-row:3;grid-column:2;gap:7px;justify-content:flex-end}
      #home .home-progress-ring{width:48px;height:48px}
      #home .home-progress-ring:before{inset:5px}
      #home .home-progress-ring strong{font-size:16px}
      #home .home-progress-copy{min-width:0;gap:2px;font-size:9px;line-height:1.4}
      #home .home-progress-copy small{font-size:10px}
      #home .lesson-landscape{top:40px;height:116px;left:24%;width:76%}
      #home .review-card{padding:13px 16px}
      #home .review-card h3,#home .week-card h3{font-size:16px;margin:0;line-height:1.6}
      #home .review-counts{margin:9px 0;gap:7px}
      #home .count{min-height:54px;padding:8px 3px;column-gap:7px}
      #home .count b{font-size:20px}
      #home .count-icon{width:23px;height:23px}
      #home .week-card{padding:13px 16px 29px}
      #home .week{height:46px;margin-top:10px}
      #home .bar:after{top:calc(100% + 5px);font-size:11px}
    }
    @media(max-width:620px) and (max-height:700px){
      #home .home-dashboard,#home .home-secondary-grid{gap:8px}
      #home .lesson-card{padding:12px 16px}
      #home .lesson-card-layout{gap:10px}
      #home .lesson-card h2{font-size:28px}
      #home .review-card{padding:11px 16px}
      #home .review-counts{margin:7px 0}
      #home .count{min-height:50px;padding:6px 3px}
      #home .week-card{padding:10px 16px 27px}
      #home .week{height:36px;margin-top:7px}
    }
  </style>`);
writeFileSync('dist/index.html',html);
let app=readFileSync('dist/app.js','utf8');
app=app.replace("button.onclick=()=>item.kind==='local'?lookupWord(item.key):item.kind==='advanced'?openAdvancedWord(item.sequence):lookupOnlineEntry(item.entry)","button.onclick=()=>openDictCandidate(item)");
for(const prefix of ["function lookupWord(key,notify=true){const d=words[key];if(!d)return;","function lookupOnlineEntry(entry,notify=true){if(!entry)return;","function openAdvancedWord(sequence,notify=true){const row=advancedRowBySequence(sequence);if(!row)return;"]){
  if(!app.includes(prefix))throw new Error('Expected dictionary function not found');
  app=app.replace(prefix,prefix+'clearDictCandidates();dictFeedback();setDictEntryVisible(true);');
}
writeFileSync('dist/app.js',app);
for(const file of ['dist/index.html','dist/sw.js','dist/pwa.js']){
  let source=readFileSync(file,'utf8');source=source.replaceAll('?v=48','?v=49').replace('qinghe-shell-v48','qinghe-shell-v49');writeFileSync(file,source);
}
