const {chromium}=require('C:/Users/pc/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const fs=require('fs'),path=require('path'),assert=require('assert/strict');
const OUT=path.resolve('../../work/hsk1-papers/web-qa');fs.mkdirSync(OUT,{recursive:true});
const BASE='http://127.0.0.1:8765/';
async function shot(page,name){await page.evaluate(async()=>{await document.fonts.ready;scrollTo(0,0)});await page.waitForTimeout(650);await page.screenshot({path:OUT+'/'+name})}
(async()=>{
 const browser=await chromium.launch({executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe',headless:true});
 const ctx=await browser.newContext({viewport:{width:1440,height:1000}}),page=await ctx.newPage();const errors=[];page.on('pageerror',e=>errors.push(e.message));page.on('dialog',d=>d.accept());
 await page.goto(BASE);await page.evaluate(()=>showView('exam'));await page.locator('[data-paper="qh-hsk1-01"]').first().waitFor();
 assert.equal(await page.locator('#exam .exam-paper').count(),3);
 assert(await page.locator('[data-paper="qh-hsk1-01"][data-scope="full"]').isDisabled());
 const baseline=await page.evaluate(()=>JSON.parse(localStorage.getItem('qinghe-learning-state-v1')));
 await shot(page,'lobby-desktop.png');
 await page.locator('[data-paper="qh-hsk1-01"][data-scope="reading"]').click();await page.locator('#examDialog [data-exam-action="dialog-confirm"]').click();
 assert.equal(await page.locator('#exam .exam-question').count(),1);assert.equal(await page.locator('#exam .exam-practice-feedback').count(),0);
 await page.locator('#exam input[type=radio]').nth(0).check();await page.locator('#exam [data-exam-action=check]').click();
 assert(await page.locator('#exam .exam-practice-feedback').isVisible());assert(await page.locator('#exam input[type=radio]').first().isDisabled());
 const a=await page.evaluate(()=>JSON.parse(localStorage.getItem('qinghe-exams-v1')).active);assert.equal(a.mode,'practice');assert.equal(a.deadline,null);assert.equal(a.paper.sections.length,4);
 await page.locator('#exam [data-exam-action=next]').click();await page.locator('#exam [data-exam-action=prev]').click();assert(await page.locator('#exam .exam-practice-feedback').isVisible());
 await page.setViewportSize({width:390,height:844});await shot(page,'practice-mobile.png');assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
 await page.locator('#exam [data-exam-action=submit]').click();await page.locator('#examDialog [data-exam-action=dialog-confirm]').click();
 await page.locator('#exam [data-exam-action=add-wrong]').click();const count=await page.evaluate(()=>learningState.reviewQueue.length);await page.locator('#exam [data-exam-action=add-wrong]').click();assert.equal(await page.evaluate(()=>learningState.reviewQueue.length),count);
 const firstRecord=await page.evaluate(()=>JSON.parse(localStorage.getItem('qinghe-exams-v1')).history[0]);assert.equal(firstRecord.scope,'reading');assert.equal(firstRecord.mode,'practice');assert.equal(firstRecord.paper.sections.reduce((n,s)=>n+s.questions.length,0),20);
 if(baseline)for(const k of ['savedWords','completedLessons','lessonProgress','themeProgress','preferences'])assert.deepEqual(await page.evaluate(k=>learningState[k],k),baseline[k]);
 // Check original exam pictures survive in the shared review queue.
 assert(await page.evaluate(()=>learningState.reviewQueue.some(q=>q.type==='exam'&&q.examQuestion.optionImages?.length===6)));
 await page.locator('#exam [data-exam-action=lobby]').click();await page.locator('[data-exam-action=mode][data-mode=simulation]').click();await page.locator('[data-paper="qh-hsk1-01"][data-scope="reading"]').click();await page.locator('#examDialog [data-exam-action=dialog-confirm]').click();
 assert.equal(await page.locator('#exam .exam-question').count(),20);assert.equal(await page.locator('#exam [data-exam-action=check]').count(),0);assert.equal(await page.locator('#exam .exam-practice-feedback').count(),0);
 await page.locator('#exam-question-0 input[type=radio]').first().check();await page.locator('#exam-question-1 input[type=radio]').nth(3).check();
 await page.setViewportSize({width:1440,height:1000});await shot(page,'simulation-desktop.png');assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
 await page.reload();await page.evaluate(()=>showView('exam'));await page.locator('#exam [data-exam-action=resume]').click();assert.equal(await page.locator('#exam input:checked').count(),2);assert.equal(await page.locator('#exam .exam-question').count(),20);
 await page.setViewportSize({width:320,height:740});await shot(page,'simulation-mobile.png');assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
 await page.evaluate(()=>{const s=JSON.parse(localStorage.getItem('qinghe-exams-v1'));s.active.deadline=Date.now()+1100;const value=JSON.stringify(s);localStorage.setItem('qinghe-exams-v1',value);window.dispatchEvent(new StorageEvent('storage',{key:'qinghe-exams-v1',newValue:value}))});
 await page.waitForFunction(()=>JSON.parse(localStorage.getItem('qinghe-exams-v1')).active===null,null,{timeout:8000});
 const history=await page.evaluate(()=>JSON.parse(localStorage.getItem('qinghe-exams-v1')).history);assert.equal(history.length,2);assert.equal(history[1].expired,true);assert.equal(history[1].mode,'simulation');
 // Ready-audio fixture checks future full-paper rendering, without uploading or faking production audio.
 const readyCtx=await browser.newContext({viewport:{width:1366,height:900}});
 await readyCtx.route('**/exam-papers/qh-hsk1-01.json',route=>{const p=JSON.parse(fs.readFileSync('dist/exam-papers/qh-hsk1-01.json'));p.sections.filter(s=>s.skill==='listening').forEach(s=>s.questions.forEach(q=>q.audio=q.audioSlot));return route.fulfill({json:p})});
 const ready=await readyCtx.newPage();ready.on('dialog',d=>d.accept());await ready.goto(BASE);await ready.evaluate(()=>showView('exam'));await ready.locator('[data-paper="qh-hsk1-01"]').first().waitFor();await ready.locator('[data-exam-action=mode][data-mode=simulation]').click();await ready.locator('[data-paper="qh-hsk1-01"][data-scope="full"]').click();await ready.locator('#examDialog [data-exam-action=dialog-confirm]').click();assert.equal(await ready.locator('#exam .exam-question').count(),40);assert.equal(await ready.locator('#exam audio').count(),20);assert(!(await ready.locator('#exam').innerText()).includes('猫在椅子旁边。'));assert.equal(await ready.locator('#exam .exam-practice-feedback').count(),0);
 await shot(ready,'full-paper-fixture.png');
 const legacyCtx=await browser.newContext();const legacy=await legacyCtx.newPage();legacy.on('dialog',d=>d.accept());await legacy.goto(BASE);await legacy.evaluate(()=>{const p=QINGHE_EXAM_DEMO,now=Date.now();localStorage.setItem('qinghe-exams-v1',JSON.stringify({papers:[],history:[],futureField:{keep:true},active:{id:'legacy-attempt',paper:p,startedAt:now-1000,deadline:now+60000,index:1,answers:{'demo-l1':0},marked:[],times:{'demo-l1':1000}}}))});await legacy.reload();await legacy.evaluate(()=>showView('exam'));await legacy.locator('[data-exam-action=resume]').click();assert.equal(await legacy.locator('#exam .exam-question').count(),1);assert.equal(await legacy.evaluate(()=>JSON.parse(localStorage.getItem('qinghe-exams-v1')).active.answers['demo-l1']),0);assert(await legacy.evaluate(()=>JSON.parse(localStorage.getItem('qinghe-exams-v1')).futureField.keep));
 await legacyCtx.close();await readyCtx.close();await ctx.close();await browser.close();assert.deepEqual(errors,[]);console.log('PASS UI: Chrome desktop/mobile/narrow, practice check and lock, 20-question simulation, refresh resume, timeout auto-submit, deduplicated review images, preserved learning data and legacy active records, and future 40-question audio fixture.');
})().catch(e=>{console.error(e);process.exit(1)});
