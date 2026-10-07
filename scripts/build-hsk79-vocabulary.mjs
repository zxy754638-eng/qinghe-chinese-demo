import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';

const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const sourcePath=path.join(root,'scripts','data','gushi-hsk30-words.json');
const sourceUrl='https://gushi-chinese.online/hsk-3.0/downloads/hsk-3.0-words-all.json';
const licensePath=path.join(root,'scripts','data','GUSHI-HSK30-LICENCE.txt');
const outputPath=path.join(root,'dist','data','hsk79-vocabulary.min.json');
const noticePath=path.join(root,'dist','licenses','GUSHI-HSK30-NOTICE.txt');

async function loadSource(){
  if(fs.existsSync(sourcePath))return JSON.parse(fs.readFileSync(sourcePath,'utf8'));
  const response=await fetch(sourceUrl);
  if(!response.ok)throw new Error(`Unable to download Gushi HSK data: HTTP ${response.status}`);
  return response.json();
}

const source=await loadSource();
const advanced=source.data.filter(item=>Number(item.level)>=7);
if(advanced.length!==5600)throw new Error(`Expected 5,600 HSK 7–9 entries, received ${advanced.length}`);

const entries=advanced.map((item,index)=>[
  5401+index,
  item.hanzi,
  item.pinyin,
  item.meaning,
  item.exampleChinese||'',
  item.exampleEnglish||''
]);

for(const [index,entry] of entries.entries()){
  const [sequence,hanzi,pinyin,meaning]=entry;
  if(sequence!==5401+index||!hanzi||!pinyin||!meaning)throw new Error(`Invalid advanced entry at sequence ${sequence}`);
  if(/\b[a-züv:]+[1-5]\b/i.test(pinyin))throw new Error(`Numeric tone found at sequence ${sequence}: ${pinyin}`);
}

const payload={
  meta:{
    id:'hsk-3.0-2025-advanced',
    band:'HSK 7–9',
    officialSequence:[5401,11000],
    count:entries.length,
    exampleCount:entries.filter(item=>item[4]).length,
    source:'The official HSK 3.0 考试大纲, published November 2025.',
    compiledBy:'Gushi — https://gushi-chinese.online/',
    license:'CC BY-SA 4.0',
    attribution:'HSK 3.0 syllabus data by Gushi (https://gushi-chinese.online/hsk-3.0/downloads), CC BY-SA 4.0',
    updated:source.updated,
    reviewStatus:'待人工审校',
    fields:['sequence','hanzi','pinyin','meaning','exampleChinese','exampleEnglish']
  },
  entries
};

fs.mkdirSync(path.dirname(outputPath),{recursive:true});
fs.writeFileSync(outputPath,JSON.stringify(payload),'utf8');
fs.mkdirSync(path.dirname(noticePath),{recursive:true});
fs.copyFileSync(licensePath,noticePath);
console.log(JSON.stringify({output:path.relative(root,outputPath),count:entries.length,examples:payload.meta.exampleCount,bytes:fs.statSync(outputPath).size},null,2));
