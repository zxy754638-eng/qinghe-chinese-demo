const fs=require('fs'),vm=require('vm'),assert=require('assert/strict');
const ctx=vm.createContext({window:{}});vm.runInContext(fs.readFileSync('dist/exam-core.js','utf8'),ctx);const C=ctx.window.QingheExamCore;
const catalog=JSON.parse(fs.readFileSync('dist/exam-papers/index.json'));
assert.equal(catalog.papers.length,2);
for(const file of catalog.papers){
 const raw=JSON.parse(fs.readFileSync('dist/exam-papers/'+file)),p=C.validatePaper(raw),qs=C.flatten(p);
 assert.equal(qs.length,40);assert.equal(p.sections.length,8);assert.equal(qs.filter(q=>q.skill==='listening').length,20);assert.equal(qs.filter(q=>q.audioPending).length,20);
 for(const q of qs){assert(!q.disabledOptions?.includes(q.answer));for(const image of q.optionImages||[])assert(fs.existsSync('dist/'+image),image);if(q.skill==='reading')assert(q.promptPinyin)}
 assert.throws(()=>C.availablePaper(p));const reading=C.availablePaper(p,'reading');assert.equal(C.flatten(reading).length,20);assert.equal(reading.durationMinutes,20);assert(C.flatten(reading).every(q=>q.skill==='reading'));
 const correct=Object.fromEntries(qs.map(q=>[q.id,q.answer]));assert.equal(C.grade(p,correct).earned,40);assert.equal(C.grade(p,{}).wrongIds.length,40);
 for(const q of qs.filter(q=>q.disabledOptions?.length))assert.equal(C.answered(q,q.disabledOptions[0]),false);
 const ready=JSON.parse(JSON.stringify(p));ready.sections.filter(s=>s.skill==='listening').forEach(s=>s.questions.forEach(q=>{q.audio=q.audioSlot}));assert.equal(C.flatten(C.availablePaper(C.validatePaper(ready))).length,40);
 const unsafe=JSON.parse(JSON.stringify(p));unsafe.sections[0].questions[0].optionImages[0]='javascript:alert(1)';assert.throws(()=>C.validatePaper(unsafe));
 const reviewed=JSON.parse(JSON.stringify(p));reviewed.status='reviewed';assert.throws(()=>C.validatePaper(reviewed),'Missing audio cannot be hidden by a reviewed status');
 assert.equal(JSON.stringify(C.validatePaper(p)),JSON.stringify(p),'Saved snapshots survive revalidation');
}
const core=fs.readFileSync('dist/exam.js','utf8');assert(!core.includes('localStorage.clear'));assert(core.includes("KEY='qinghe-exams-v1'"));assert(core.includes('storageReadFailed'));assert(core.includes('a.mode===\'simulation\''));
console.log('PASS: two Word papers, 80 questions and answers, images, pinyin, shared scoring, reading scope, audio gating, future audio, old snapshots, unsafe URL rejection and storage preservation.');
