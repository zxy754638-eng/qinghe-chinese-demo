import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import {fileURLToPath} from 'node:url';

const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const dist=path.join(root,'dist');
const sources=['data-words.js','data-lessons.js','data-upper-lessons.js','data-upper-words.js','data-dictionary-fixes.js','data-themed-vocab.js','data-themed-example-en.js','data-hsk30-syllabus.js'];
const code=sources.map(file=>fs.readFileSync(path.join(dist,file),'utf8')).join('\n')+'\n;globalThis.__auditData={lessons,words,themedVocabularyDecks,HSK30_META,HSK30_LEVELS,HSK30_LESSON_MAP,HSK30_REVIEW_SCHEMA};';
const context={console};vm.createContext(context);new vm.Script(code,{filename:'qinghe-content-bundle.js'}).runInContext(context);
const {lessons,words,themedVocabularyDecks,HSK30_META,HSK30_LEVELS,HSK30_LESSON_MAP,HSK30_REVIEW_SCHEMA}=context.__auditData;

const problems=[];
const add=(severity,scope,id,message)=>problems.push({severity,scope,id,message});
const requiredLessonFields=['id','level','title','scene','vocab','dialogue','grammar','listening','shadowing','quiz'];
const ids=new Set();
for(const lesson of lessons){
  if(ids.has(lesson.id))add('error','lesson',lesson.id,'课程编号重复');ids.add(lesson.id);
  for(const field of requiredLessonFields)if(lesson[field]===undefined||lesson[field]===null)add('error','lesson',lesson.id,'缺少字段：'+field);
  if(!HSK30_LESSON_MAP[lesson.id])add('error','alignment',lesson.id,'缺少 HSK 3.0 教学映射');
  if(lesson.standard?.reviewStatus!=='待审校')add('warning','review',lesson.id,'当前审校状态不是“待审校”');
  if(!Array.isArray(lesson.vocab)||lesson.vocab.length<7)add('warning','lesson',lesson.id,'核心词少于 7 个');
  for(const word of lesson.vocab||[]){
    const entry=words[word];if(!entry){add('error','word',word,'课程核心词缺少本地词条');continue}
    if(!entry.p)add('error','word',word,'缺少带声调拼音');
    if(/\b[a-züv:]+[1-5]\b/i.test(entry.p||''))add('error','word',word,'展示拼音仍含数字声调');
    if(!entry.m)add('warning','word',word,'缺少英文释义');
    if(!entry.cn||/待审校|待人工/.test(entry.cn))add('warning','word',word,'中文学习释义待审校');
    if(!entry.e||/暂时没有/.test(entry.e))add('warning','word',word,'原创例句待补充');
  }
}

for(const deck of themedVocabularyDecks){for(const item of deck.words){
  if(!item.word||!item.pinyin||!item.en||!item.example)add('warning','themed-vocabulary',deck.id,'主题词条字段不完整：'+(item.word||'未命名'));
  if(!item.exampleEn)add('warning','themed-vocabulary',item.word,'例句缺少英文翻译');
  if(/\b[a-züv:]+[1-5]\b/i.test(item.pinyin||''))add('error','themed-vocabulary',item.word,'展示拼音仍含数字声调');
}}

for(let level=1;level<=6;level++){
  const count=lessons.filter(item=>item.level===`HSK ${level}`).length;
  if(count!==10)add('error','level',`HSK ${level}`,`应有 10 门演示课，当前为 ${count} 门`);
}
if(lessons.length!==60)add('error','catalog','all',`应有 60 门演示课，当前为 ${lessons.length} 门`);
if(HSK30_LEVELS.length!==7)add('error','syllabus','levels','HSK 3.0 等级元数据不完整');

const report={
  generatedAt:new Date().toISOString(),syllabus:HSK30_META,
  summary:{lessons:lessons.length,courseWords:[...new Set(lessons.flatMap(item=>item.vocab))].length,themedDecks:themedVocabularyDecks.length,themedWords:themedVocabularyDecks.reduce((sum,deck)=>sum+deck.words.length,0),errors:problems.filter(item=>item.severity==='error').length,warnings:problems.filter(item=>item.severity==='warning').length,reviewStatus:'待人工审校'},
  reviewChecks:HSK30_REVIEW_SCHEMA.checks,levels:HSK30_LEVELS,problems
};
const output=path.join(dist,'data','hsk30-review-report.json');fs.mkdirSync(path.dirname(output),{recursive:true});fs.writeFileSync(output,JSON.stringify(report,null,2)+'\n','utf8');
console.log(JSON.stringify(report.summary,null,2));
if(report.summary.errors)process.exitCode=1;
