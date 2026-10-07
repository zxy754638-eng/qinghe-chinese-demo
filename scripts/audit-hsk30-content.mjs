import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import {fileURLToPath} from 'node:url';

const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const dist=path.join(root,'dist');
const sources=['data-words.js','data-lessons.js','data-upper-lessons.js','data-upper-words.js','data-advanced-lessons.js','data-advanced-words.js','data-dictionary-fixes.js','data-themed-vocab.js','data-themed-example-en.js','data-themed-vocab-balanced.js','data-hsk30-syllabus.js'];
const code=sources.map(file=>fs.readFileSync(path.join(dist,file),'utf8')).join('\n')+'\n;globalThis.__auditData={lessons,words,themedVocabularyDecks,themedVocabularyCatalog,themedVocabularyStats,HSK30_META,HSK30_LEVELS,HSK30_LESSON_MAP,HSK30_REVIEW_SCHEMA};';
const context={console};vm.createContext(context);new vm.Script(code,{filename:'qinghe-content-bundle.js'}).runInContext(context);
const {lessons,words,themedVocabularyDecks,themedVocabularyCatalog,themedVocabularyStats,HSK30_META,HSK30_LEVELS,HSK30_LESSON_MAP,HSK30_REVIEW_SCHEMA}=context.__auditData;
const advancedVocabulary=JSON.parse(fs.readFileSync(path.join(dist,'data','hsk79-vocabulary.min.json'),'utf8'));

const problems=[];
const add=(severity,scope,id,message)=>problems.push({severity,scope,id,message});
const requiredLessonFields=['id','level','title','scene','vocab','dialogue','grammar','listening','shadowing','quiz'];
const ids=new Set();
for(const lesson of lessons){
  if(ids.has(lesson.id))add('error','lesson',lesson.id,'课程编号重复');ids.add(lesson.id);
  for(const field of requiredLessonFields)if(lesson[field]===undefined||lesson[field]===null)add('error','lesson',lesson.id,'缺少字段：'+field);
  if(!HSK30_LESSON_MAP[lesson.id])add('error','alignment',lesson.id,'缺少 HSK 3.0 教学映射');
  if(!lesson.standard||lesson.standard!==HSK30_LESSON_MAP[lesson.id])add('error','alignment',lesson.id,'前端课程对象未接入对应的 HSK 3.0 教学映射');
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

const wordEntries=Object.entries(words);
const exampleUsage=new Map();
let examplesWithoutTarget=0,singleExampleEntries=0,exampleMirrorMismatches=0,englishInChineseDefinitions=0,suspiciousEnglishMeanings=0;
const suspiciousMeaningPattern=/\b(?:surname|old variant|variant of|press charges)\b|\bChenggong\b|^band; belt$|^to bear fruit$/i;
for(const [word,entry] of wordEntries){
  const examples=Array.isArray(entry.examples)?entry.examples.filter(Boolean):[];
  if(!examples.some(example=>example.includes(word))){examplesWithoutTarget++;add('warning','example-target',word,'例句中没有一条包含目标词')}
  if(examples.length<2){singleExampleEntries++;add('warning','example-count',word,'当前只有 '+examples.length+' 条例句，建议至少补到 2 条')}
  if((entry.e||'')!==(examples[0]||'')){exampleMirrorMismatches++;add('warning','example-mirror',word,'e 字段与 examples[0] 不一致')}
  if(/[A-Za-z]{3,}/.test(entry.cn||'')){englishInChineseDefinitions++;add('warning','learner-definition',word,'中文学习释义中仍混有英文')}
  if(suspiciousMeaningPattern.test(entry.m||'')){suspiciousEnglishMeanings++;add('warning','english-meaning',word,'英文义项可能选中了姓氏、异体字或不相关义项：'+entry.m)}
  for(const example of examples){
    const usedBy=exampleUsage.get(example)||[];usedBy.push(word);exampleUsage.set(example,usedBy);
  }
}
const reusedExampleGroups=[...exampleUsage.entries()].filter(([,usedBy])=>usedBy.length>2).sort((a,b)=>b[1].length-a[1].length);
for(const [example,usedBy] of reusedExampleGroups)add('warning','example-reuse',usedBy.join('、'),'同一例句被 '+usedBy.length+' 个词条复用：'+example);

for(const deck of themedVocabularyDecks){for(const item of deck.words){
  if(!item.word||!item.pinyin||!item.en||!item.example)add('warning','themed-vocabulary',deck.id,'主题词条字段不完整：'+(item.word||'未命名'));
  if(!item.exampleEn)add('warning','themed-vocabulary',item.word,'例句缺少英文翻译');
  if(/\b[a-züv:]+[1-5]\b/i.test(item.pinyin||''))add('error','themed-vocabulary',item.word,'展示拼音仍含数字声调');
}}

const themedPlacements=themedVocabularyDecks.flatMap(deck=>deck.words.map(item=>({deckId:deck.id,word:item.word})));
const uniqueThemedWords=new Set(themedPlacements.map(item=>item.word));
const deckSizes=themedVocabularyDecks.map(deck=>deck.words.length);
const expectedThemedLevels={'HSK 1':107,'HSK 2':144,'HSK 3':199,'HSK 4':160,'HSK 5':100,'HSK 6':90};
if(themedVocabularyDecks.length!==46)add('error','themed-vocabulary','decks',`应有 46 个主题词组，当前为 ${themedVocabularyDecks.length} 个`);
if(themedPlacements.length!==800)add('error','themed-vocabulary','placements',`应有 800 个主题词位，当前为 ${themedPlacements.length} 个`);
if(uniqueThemedWords.size!==800)add('error','themed-vocabulary','unique',`应有 800 个不重复主题词，当前为 ${uniqueThemedWords.size} 个`);
if(Object.keys(themedVocabularyCatalog||{}).length!==800)add('error','themed-vocabulary','catalog',`中心词库应有 800 个词条，当前为 ${Object.keys(themedVocabularyCatalog||{}).length} 个`);
if(deckSizes.filter(size=>size===18).length!==32||deckSizes.filter(size=>size===16).length!==14||deckSizes.some(size=>size!==16&&size!==18))add('error','themed-vocabulary','deck-size','主题词组结构应为 32 组 × 18 词，加 14 组 × 16 词');
for(const item of Object.values(themedVocabularyCatalog||{}))if(!Array.isArray(item.deckIds)||item.deckIds.length!==1)add('error','themed-vocabulary',item.word||'未命名','中心词条必须归属且仅归属一个主题词组');
for(const [level,expected] of Object.entries(expectedThemedLevels))if(themedVocabularyStats?.levels?.[level]!==expected)add('error','themed-vocabulary',level,`均衡版应有 ${expected} 词，当前为 ${themedVocabularyStats?.levels?.[level]??0} 词`);

for(let level=1;level<=6;level++){
  const count=lessons.filter(item=>item.level===`HSK ${level}`).length;
  if(count!==10)add('error','level',`HSK ${level}`,`应有 10 门演示课，当前为 ${count} 门`);
}
const advancedLessonCount=lessons.filter(item=>item.level==='HSK 7–9').length;
if(advancedLessonCount!==10)add('error','level','HSK 7–9',`应有 10 门高等演示课，当前为 ${advancedLessonCount} 门`);
if(lessons.length!==70)add('error','catalog','all',`应有 70 门演示课，当前为 ${lessons.length} 门`);
if(HSK30_LEVELS.length!==7)add('error','syllabus','levels','HSK 3.0 等级元数据不完整');
const advancedRows=advancedVocabulary.entries||[],advancedSequences=advancedRows.map(item=>item[0]);
if(advancedRows.length!==5600)add('error','advanced-vocabulary','count',`HSK 7–9 高级词库应有 5,600 个词目，当前为 ${advancedRows.length} 个`);
if(advancedSequences[0]!==5401||advancedSequences.at(-1)!==11000)add('error','advanced-vocabulary','sequence','高级词目编号应覆盖 5401–11000');
if(new Set(advancedSequences).size!==advancedRows.length)add('error','advanced-vocabulary','sequence','高级词目编号存在重复');
for(let index=0;index<advancedRows.length;index++){
  const [sequence,hanzi,pinyin,meaning]=advancedRows[index];
  if(sequence!==5401+index)add('error','advanced-vocabulary',String(sequence),'高级词目编号不连续');
  if(!hanzi||!pinyin||!meaning)add('error','advanced-vocabulary',String(sequence),'高级词条缺少汉字、拼音或英文义项');
  if(/\b[a-züv:]+[1-5]\b/i.test(pinyin||''))add('error','advanced-vocabulary',hanzi||String(sequence),'展示拼音仍含数字声调');
}

const report={
  generatedAt:new Date().toISOString(),syllabus:HSK30_META,
  summary:{
    lessons:lessons.length,courseWords:[...new Set(lessons.flatMap(item=>item.vocab))].length,
    learningDictionaryWords:wordEntries.length,advancedVocabularyWords:advancedRows.length,advancedVocabularyExamples:advancedRows.filter(item=>item[4]).length,themedDecks:themedVocabularyDecks.length,themedWords:themedPlacements.length,
    themedUniqueWords:uniqueThemedWords.size,themedLevelDistribution:themedVocabularyStats.levels,themedCatalogCentralized:Object.keys(themedVocabularyCatalog).length===uniqueThemedWords.size,
    examplesWithoutTarget,singleExampleEntries,reusedExampleGroups:reusedExampleGroups.length,exampleMirrorMismatches,
    englishInChineseDefinitions,suspiciousEnglishMeanings,
    errors:problems.filter(item=>item.severity==='error').length,warnings:problems.filter(item=>item.severity==='warning').length,reviewStatus:'待人工审校'
  },
  reviewChecks:HSK30_REVIEW_SCHEMA.checks,levels:HSK30_LEVELS,problems
};
const output=path.join(dist,'data','hsk30-review-report.json');fs.mkdirSync(path.dirname(output),{recursive:true});fs.writeFileSync(output,JSON.stringify(report,null,2)+'\n','utf8');
console.log(JSON.stringify(report.summary,null,2));
if(report.summary.errors)process.exitCode=1;
