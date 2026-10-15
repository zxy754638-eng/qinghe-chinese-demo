(function(){
  'use strict';
  const C=window.QingheExamCore,KEY='qinghe-exams-v1',root=document.getElementById('exam'),esc=escapeHtml;
  const t=(zh,en)=>ui(zh,en),skillName=s=>({listening:t('听力','Listening'),reading:t('阅读','Reading'),writing:t('写作','Writing')})[s];
  let state={papers:[],active:null,history:[]},filter='all',screen='lobby',reportId=null,clock=null,lastQuestionAt=Date.now(),saveFailed=false,dialogAction=null,finishing=false;
  const demo=C.validatePaper(window.QINGHE_EXAM_DEMO);
  try{
    const raw=JSON.parse(localStorage.getItem(KEY)||'null');
    if(raw){state.papers=Array.isArray(raw.papers)?raw.papers.map(p=>C.validatePaper(p)):[];state.history=Array.isArray(raw.history)?raw.history.slice(0,30).map(h=>({...h,paper:C.validatePaper(h.paper)})):[];
      if(raw.active){const a=raw.active,p=C.validatePaper(a.paper);if(typeof a.id==='string'&&Number.isFinite(a.deadline)&&Number.isFinite(a.startedAt)&&a.deadline>a.startedAt&&a.answers&&typeof a.answers==='object')state.active={...a,paper:p,index:Math.max(0,Math.min(C.flatten(p).length-1,Number(a.index)||0)),marked:Array.isArray(a.marked)?a.marked:[],times:a.times&&typeof a.times==='object'?a.times:{}};}}
  }catch(e){saveFailed=true;}
  let publishedPapers=[];
  const allPapers=()=>[demo,...publishedPapers.filter(p=>!state.papers.some(local=>local.id===p.id)),...state.papers],activeQuestions=()=>C.flatten(state.active.paper);
  const status=p=>p.demo?t('流程演示','Workflow demo'):p.status==='reviewed'?t('已审校','Reviewed'):t('待审校 · 仅供试做','Draft · trial only');
  function persist(){try{localStorage.setItem(KEY,JSON.stringify(state));saveFailed=false;return true}catch(e){saveFailed=true;return false}}
  function errorBanner(){return saveFailed?'<div class="exam-storage-error" role="alert">'+t('本机存储不可用或空间不足，内容可能无法保存。请导出备份后再继续。','Local storage is unavailable or full. Export a backup before continuing.')+' <button class="secondary" data-exam-action="backup">'+t('导出备份','Export backup')+'</button></div>':''}
  function button(action,label,cls='secondary',extra=''){return '<button type="button" class="'+cls+'" data-exam-action="'+action+'" '+extra+'>'+label+'</button>'}
  function download(name,obj){const link=document.createElement('a'),url=URL.createObjectURL(new Blob([JSON.stringify(obj,null,2)],{type:'application/json;charset=utf-8'}));link.href=url;link.download=name;link.click();setTimeout(()=>URL.revokeObjectURL(url),1000)}
  function openDialog(title,body,label,action){
    const dialog=document.getElementById('examDialog');dialog.innerHTML='<h2>'+esc(title)+'</h2>'+body+'<div class="exam-actions">'+button('dialog-confirm',esc(label),'primary')+button('dialog-cancel',t('取消','Cancel'))+'</div>';dialogAction=action;dialog.showModal();
  }
  function render(){
    if(screen==='test'&&!state.active)screen='lobby';
    if(screen==='report'&&!state.history.some(h=>h.id===reportId))screen='lobby';
    root.innerHTML=errorBanner()+(screen==='test'?testHtml():screen==='report'?reportHtml():lobbyHtml());
    tick();
  }
  function lobbyHtml(){
    const papers=allPapers().filter(p=>filter==='all'||p.level===filter),active=state.active;
    const resume=active?'<div class="card exam-intro"><div><h2>'+t('有一场尚未提交的考试','An unfinished exam')+'</h2><p>'+esc(active.paper.title)+' · '+t('离开页面后计时仍会继续。','The timer continues while you are away.')+'</p></div><div class="exam-actions">'+button('resume',t('继续答题','Resume exam'),'primary')+'</div></div>':'';
    const waiting=C.levels.filter(level=>!allPapers().some(p=>p.level===level&&!p.demo&&p.status==='reviewed')&&(filter==='all'||filter===level));
    return '<div class="exam-header"><div><p class="eyebrow">'+t('学有所测','CHECK YOUR PROGRESS')+'</p><h1>'+t('模拟考试','Mock exams')+'</h1><p class="sub">'+t('从一次练习开始，找到下一步的学习方向。','Find your next learning step through practice.')+'</p></div><div class="exam-actions">'+button('history',t('考试记录','Exam history'))+'</div></div>'+resume+
      '<div class="card exam-intro"><div><h2>'+t('先试一卷，熟悉考试节奏','Get familiar with the exam')+'</h2><p>'+t('先体验演示卷，熟悉计时答题与成绩报告。正式卷将在命题、审校后逐步加入。','Try the workflow demo to explore timed answering and reports. Full papers will follow after writing and review.')+'</p></div><span class="exam-badge">'+t('按设备保存','Saved on this device')+'</span></div>'+
      '<div class="exam-filters" role="group" aria-label="'+t('模考等级','Exam levels')+'">'+['all',...C.levels].map(level=>button('filter',level==='all'?t('全部','All'):level,'filter-btn'+(filter===level?' active':''),'data-level="'+level+'" aria-pressed="'+(filter===level)+'"')).join('')+'</div>'+
      '<div class="exam-paper-grid">'+papers.map(p=>'<article class="card exam-paper"><div class="exam-meta"><span>'+esc(p.level)+'</span><span class="exam-badge">'+status(p)+'</span></div><h3>'+esc(p.title)+'</h3><p>'+C.flatten(p).length+' '+t('题','questions')+' · '+p.durationMinutes+' '+t('分钟','min')+' · v'+esc(p.version)+'</p><p>'+[...new Set(p.sections.map(s=>skillName(s.skill)))].join(' / ')+'</p><div class="exam-actions">'+button('prepare',t(p.demo?'体验演示卷':p.status==='draft'?'试做试卷':'进入考试',p.demo?'Try demo':p.status==='draft'?'Try draft':'Start exam'),'primary','data-paper="'+esc(p.id)+'"')+'</div></article>').join('')+
      waiting.map(level=>'<article class="card exam-paper"><div class="exam-meta">'+level+'</div><h3>'+t('正式试卷准备中','Papers in preparation')+'</h3><p>'+t('命题与教师审校完成后开放。','Available after authoring and teacher review.')+'</p><button class="secondary" disabled>'+t('敬请期待','Coming soon')+'</button></article>').join('')+'</div>'+historyHtml()+
      '<details class="exam-import"><summary>'+t('试卷管理与导入','Manage and import papers')+'</summary><p class="exam-import-note">'+t('导入的试卷、答案和记录只保存在当前浏览器，不会自动发布给其他人。正式发布时，将审校后的 JSON 和配套音频一起加入网站。相同编号会更新为新版本；已开始的考试和历史报告保留原试卷。','Imported papers, answers and records stay in this browser. To publish a paper for everyone, add the reviewed JSON and audio to the website. Reimporting an ID updates its paper; ongoing exams and past reports keep their original version.')+'</p><div class="exam-actions"><a class="secondary" href="exam-paper-template.json" download>'+t('下载 JSON 模板','Download JSON template')+'</a><a class="secondary" href="exam-import-guide.md" download>'+t('下载导入说明','Download import guide')+'</a>'+button('backup',t('导出考试数据','Export exam data'))+'</div><label>'+t('选择试卷 JSON（最多 2 MB）','Choose a paper JSON (up to 2 MB)')+'<br><input id="examImportFile" type="file" accept=".json,application/json"></label><div id="examImportFeedback" class="exam-file-feedback" role="status"></div></details>';
  }
  function historyHtml(){
    return '<section class="exam-history card" id="examHistory"><h2>'+t('考试记录','Exam history')+'</h2>'+(state.history.length?state.history.slice().reverse().map(h=>{const result=C.grade(h.paper,h.answers);return '<div class="exam-history-item"><div><span>'+esc(h.paper.title)+'</span><small>'+new Date(h.finishedAt).toLocaleString(uiLanguage==='en'?'en-US':'zh-CN')+' · '+status(h.paper)+'</small><small>'+t('客观题','Objective')+' '+result.earned+' / '+result.objectiveMax+(result.pendingMax?' · '+t('写作待评分','Writing pending'):'')+'</small></div>'+button('report',t('查看报告','View report'),'secondary','data-record="'+esc(h.id)+'"')+'</div>'}).join(''):'<div class="exam-empty">'+t('完成第一份试卷后，报告会出现在这里。','Your reports will appear here after you finish a paper.')+'</div>')+'</section>';
  }
  function prepare(id){
    if(state.active){openDialog(t('先完成当前考试','Finish your current exam'),'<p>'+t('当前有一场正在计时的考试。可以继续答题或交卷后再开启新试卷。','An exam is already running. Resume or submit it before starting another paper.')+'</p>',t('继续当前考试','Resume current exam'),()=>{screen='test';render()});return}
    const p=allPapers().find(p=>p.id===id);if(!p)return;
    openDialog(p.title,'<p>'+esc(p.instructions||t('请阅读题干并按要求作答。','Read each prompt and answer as instructed.'))+'</p><p>'+p.durationMinutes+' '+t('分钟','minutes')+' · '+C.flatten(p).length+' '+t('题','questions')+' · '+status(p)+'</p><p class="sub">'+t('开始后持续计时，刷新或离开页面不会暂停。客观题自动判分；写作等待人工评分。','The timer continues after refresh or navigation. Objective questions are scored automatically; writing awaits human marking.')+'</p>',t('开始计时答题','Start timed exam'),()=>start(p));
  }
  function start(paper){
    if(state.active)return;
    const now=Date.now();state.active={id:crypto.randomUUID(),paper:JSON.parse(JSON.stringify(paper)),startedAt:now,deadline:now+paper.durationMinutes*60000,index:0,answers:{},marked:[],times:{}};
    if(!persist()){state.active=null;render();return}lastQuestionAt=now;screen='test';render();focusQuestion();
  }
  function spend(){const a=state.active;if(!a)return;const q=activeQuestions()[a.index];a.times[q.id]=(Number(a.times[q.id])||0)+Math.max(0,Math.min(Date.now(),a.deadline)-lastQuestionAt);lastQuestionAt=Date.now()}
  function focusQuestion(){const h=root.querySelector('.exam-question h3');if(h){h.tabIndex=-1;h.focus({preventScroll:true})}}
  function testHtml(){
    const a=state.active,qs=activeQuestions(),q=qs[a.index],value=a.answers[q.id],marked=a.marked.includes(q.id);
    const answer=q.type==='choice'?'<fieldset class="exam-options"><legend class="sr-only">'+t('选择答案','Choose an answer')+'</legend>'+q.options.map((o,i)=>'<label class="exam-option"><input type="radio" name="examAnswer" value="'+i+'" '+(value===i?'checked':'')+'><span>'+String.fromCharCode(65+i)+'. '+esc(o)+'</span></label>').join('')+'</fieldset>':q.type==='writing'?'<label for="examAnswer">'+t('你的作文','Your writing')+'</label><textarea class="exam-answer" id="examAnswer" rows="7" maxlength="12000" placeholder="'+t('请在这里作答','Write your response here')+'">'+esc(value||'')+'</textarea><p class="sub" id="examWordCount">'+String(value||'').length+' '+t('字符 · 写作待人工评分','characters · human marking required')+'</p>':'<label for="examAnswer">'+t('填写答案','Enter your answer')+'</label><input class="exam-answer" id="examAnswer" maxlength="2000" autocomplete="off" value="'+esc(value||'')+'">';
    const audio=q.audio?'<audio class="exam-audio" controls preload="metadata" src="'+esc(q.audio)+'"></audio><p id="examAudioNotice" class="sub" role="status"></p>':q.audioText?button('listen',t('播放演示听力（机器语音）','Play demo listening (synthetic voice)')):'';
    return '<div class="exam-live-head"><div><h2>'+esc(a.paper.title)+'</h2><span class="exam-save-state">'+t('正在计时 · 答案自动保存','Timer running · answers save automatically')+'</span></div><div><span class="exam-clock-label">'+t('剩余时间','Time remaining')+'</span><strong class="exam-clock" id="examClock" role="timer"></strong></div><div class="exam-actions">'+button('leave',t('返回模考首页','Back to exams'))+button('submit',t('交卷','Submit exam'),'primary')+'</div></div><div class="exam-workspace"><article class="card exam-question"><div class="exam-meta"><span>'+esc(q.section)+'</span><span>'+t('第','Question ')+(a.index+1)+' / '+qs.length+'</span><span>'+q.points+' '+t('分','points')+'</span></div>'+(q.passage?'<div class="exam-passage">'+esc(q.passage)+'</div>':'')+'<h3>'+esc(q.prompt)+'</h3>'+audio+answer+'<div class="exam-actions">'+button('mark',marked?t('已标记 · 取消标记','Flagged · remove flag'):t('标记待检查','Flag for review'),'secondary','aria-pressed="'+marked+'"')+'</div><div class="exam-question-nav">'+button('prev',t('上一题','Previous'),'secondary',a.index===0?'disabled':'')+button('next',a.index===qs.length-1?t('检查并交卷','Review and submit'):t('下一题','Next'),'primary')+'</div></article><aside class="card exam-sheet"><h3>'+t('答题卡','Answer sheet')+'</h3><div class="exam-sheet-grid">'+qs.map((item,i)=>button('jump',String(i+1),(C.answered(item,a.answers[item.id])?'answered ':'')+(i===a.index?'current ':'')+(a.marked.includes(item.id)?'marked':''),'data-index="'+i+'" aria-label="'+t('第','Question ')+(i+1)+t('题','')+(C.answered(item,a.answers[item.id])?t(' 已答',' answered'):t(' 未答',' unanswered'))+(a.marked.includes(item.id)?t(' 已标记',' flagged'):'')+'" '+(i===a.index?'aria-current="step"':''))).join('')+'</div><p class="sub" id="examAnsweredCount">'+t('已答','Answered')+' '+qs.filter(item=>C.answered(item,a.answers[item.id])).length+' / '+qs.length+'</p><p class="sub">'+t('浅色填充：已答 · 小圆点：待检查','Filled: answered · dot: flagged')+'</p></aside></div>';
  }
  function collect(){
    if(!state.active)return;const q=activeQuestions()[state.active.index],input=root.querySelector('[name="examAnswer"]:checked')||root.querySelector('#examAnswer');
    if(input)state.active.answers[q.id]=q.type==='choice'?Number(input.value):input.value;spend();persist();
    const box=root.querySelector('.exam-storage-error');if(saveFailed&&!box)root.insertAdjacentHTML('afterbegin',errorBanner());
    const count=root.querySelector('#examWordCount');if(count)count.textContent=String(state.active.answers[q.id]||'').length+' '+t('字符 · 写作待人工评分','characters · human marking required');
    const index=state.active.index,b=root.querySelectorAll('.exam-sheet-grid button')[index];if(b)b.classList.toggle('answered',C.answered(q,state.active.answers[q.id]));
    const n=root.querySelector('#examAnsweredCount');if(n)n.textContent=t('已答','Answered')+' '+activeQuestions().filter(x=>C.answered(x,state.active.answers[x.id])).length+' / '+activeQuestions().length;
  }
  function go(index){if(!state.active)return;collect();if(Date.now()>=state.active.deadline){finish(true);return}window.speechSynthesis?.cancel();state.active.index=index;persist();render();focusQuestion();root.scrollIntoView({block:'start',behavior:'smooth'})}
  function submit(){collect();if(!state.active)return;const a=state.active,remaining=activeQuestions().filter(q=>!C.answered(q,a.answers[q.id])).length;openDialog(t('确认交卷','Submit your exam'),'<p>'+t('还有 '+remaining+' 题未作答，'+a.marked.length+' 题已标记待检查。交卷后无法更改答案。','You have '+remaining+' unanswered and '+a.marked.length+' flagged questions. Answers cannot be changed after submission.')+'</p>',t('确认交卷','Submit exam'),()=>finish(false))}
  function finish(expired){
    if(!state.active)return;spend();const a=state.active;
    const existing=state.history.find(h=>h.id===a.id);if(existing){state.active=null;persist();reportId=existing.id;screen='report';render();return}
    const record={...a,finishedAt:Math.min(Date.now(),a.deadline),expired:!!expired};const prev=state.history;state.history=[...prev,record].slice(-30);state.active=null;
    if(!persist()){state.history=prev;state.active=a;render();return}
    window.speechSynthesis?.cancel();document.getElementById('examDialog').close();reportId=record.id;screen='report';render();
  }
  function reportHtml(){
    const h=state.history.find(x=>x.id===reportId),p=h.paper,result=C.grade(p,h.answers),qs=C.flatten(p),elapsed=Math.max(0,Math.round((h.finishedAt-h.startedAt)/1000));
    const reports=state.history.filter(x=>x.paper.id===p.id&&x.paper.version===p.version&&!x.paper.demo&&x.paper.status==='reviewed').slice(-6);
    const trend=reports.length>1?'<h3>'+t('同卷同版本客观题趋势','Objective score trend · same paper/version')+'</h3><div class="exam-chart">'+reports.map(x=>{const r=C.grade(x.paper,x.answers);return '<span>'+new Date(x.finishedAt).toLocaleDateString()+' · '+r.earned+'/'+r.objectiveMax+'</span>'}).join('')+'</div>':'';
    return '<div class="exam-header"><div><p class="eyebrow">'+t('每次练习，都有收获','LEARN FROM EVERY ATTEMPT')+'</p><h1>'+t('考试报告','Exam report')+'</h1><p class="sub">'+esc(p.title)+' · v'+esc(p.version)+' · '+status(p)+'</p></div><div class="exam-actions">'+button('lobby',t('返回模考首页','Back to exams'))+button('export-report',t('导出报告','Export report'))+'</div></div><article class="card">'+(p.demo||p.status==='draft'?'<p class="exam-badge">'+t('流程演示 / 试做结果，不代表 HSK 等级或正式考试成绩。','Demo / draft results do not represent an HSK level or official exam score.')+'</p>':'')+'<div class="exam-report-summary"><div><b>'+result.earned+' / '+result.objectiveMax+'</b><small>'+t('客观题得分','Objective score')+'</small></div><div><b>'+Math.floor(elapsed/60)+':'+String(elapsed%60).padStart(2,'0')+'</b><small>'+t('总用时','Elapsed time')+(h.expired?' · '+t('到时自动交卷','auto-submitted'):'')+'</small></div><div><b>'+result.wrongIds.length+'</b><small>'+t('客观题错题（含未答）','Incorrect / unanswered objective items')+'</small></div></div>'+(result.pendingMax?'<p class="sub">'+t('写作满分 '+result.pendingMax+' 分：待人工评分，暂不计算整卷总分。','Writing: '+result.pendingMax+' points pending human marking. No full-paper total is calculated yet.')+'</p>':'')+['listening','reading','writing'].filter(skill=>qs.some(q=>q.skill===skill)).map(skill=>{const rows=result.rows.filter(r=>r.skill===skill);return '<div class="exam-skill-row"><span>'+skillName(skill)+'</span><span>'+(skill==='writing'?t('待人工评分','Awaiting human marking'):rows.reduce((n,r)=>n+r.earned,0)+' / '+rows.reduce((n,r)=>n+r.points,0))+'</span></div>'}).join('')+trend+'<div class="exam-actions" style="margin-top:20px">'+button('add-wrong',t('将错题加入复习','Add incorrect items to review'),'primary',result.wrongIds.length?'':'disabled')+'</div><p class="exam-import-note">'+t('每题展开可查看自己的答案、参考答案、解析和用时；写作参考范文仅在交卷后显示。','Expand an item to see your answer, the reference answer, explanation and time. Writing samples appear only after submission.')+'</p></article><article class="card" style="margin-top:18px"><h2>'+t('答案与解析','Answers and explanations')+'</h2>'+qs.map((q,i)=>{const row=result.rows[i],value=h.answers[q.id],given=q.type==='choice'?(q.options[value]||t('未作答','Unanswered')):value||t('未作答','Unanswered'),correct=q.type==='choice'?q.options[q.answer]:q.type==='fill'?q.answers.join(' / '):q.sampleAnswer;return '<details class="exam-report-question"><summary><span class="exam-result-tag'+(!row.pending&&!row.correct?' wrong':'')+'">'+(row.pending?t('待评分','Pending'):row.correct?t('正确','Correct'):t('需复习','Review'))+'</span>'+(i+1)+'. '+esc(q.prompt)+'</summary>'+(q.passage?'<p class="sub">'+esc(q.passage)+'</p>':'')+'<p>'+t('你的答案：','Your answer: ')+esc(given)+'</p><p>'+t(q.type==='writing'?'参考范文：':'参考答案：',q.type==='writing'?'Sample response: ':'Reference answer: ')+esc(correct)+'</p><p class="sub">'+esc(q.explanation)+'</p>'+(q.rubric?'<p class="sub">'+t('评分量表：','Rubric: ')+esc(q.rubric)+'</p>':'')+'<p class="sub">'+skillName(q.skill)+' · '+t('本题用时约 ','About ')+Math.round((h.times[q.id]||0)/1000)+t(' 秒',' seconds')+'</p></details>'}).join('')+'</article>';
  }
  function addWrong(){
    const h=state.history.find(x=>x.id===reportId);if(!h)return;const result=C.grade(h.paper,h.answers),qs=C.flatten(h.paper),now=Date.now();let added=0;
    for(const id of result.wrongIds){const q=qs.find(x=>x.id===id),qid='exam:'+h.paper.id+':'+h.paper.version+':'+q.id;if(!learningState.reviewQueue.some(x=>x.id===qid)){learningState.reviewQueue.push({id:qid,type:'exam',value:q.prompt,examQuestion:q,dueAt:now,interval:1,ease:2.5,repetitions:0,lastGrade:null});added++}}
    markLearningActivity();saveLearningState();renderLearningState();toastMsg(t(added+' 道错题已加入复习；重复项已跳过。',added+' incorrect items added; duplicates skipped.'));
  }
  async function importFile(file){
    if(!file)return;const feedback=document.getElementById('examImportFeedback');
    try{
      if(file.size>2*1024*1024)throw new Error(t('文件超过 2 MB','File exceeds 2 MB'));
      const p=C.validatePaper(JSON.parse(await file.text()));if(p.id===demo.id)throw new Error(t('演示卷编号为保留编号，请修改 id。','The demo ID is reserved. Choose a different id.'));
      openDialog(t('确认导入试卷','Import paper'),'<p>'+esc(p.title)+' · v'+esc(p.version)+'</p><p>'+p.level+' · '+C.flatten(p).length+' '+t('题','questions')+' · '+p.durationMinutes+' '+t('分钟','minutes')+'</p><p>'+status(p)+'</p><p class="sub">'+t('试卷仅在当前浏览器可见。若编号已存在，将更新列表中的对应试卷。','The paper is visible only in this browser. An existing ID updates that paper in the list.')+'</p>',t('确认导入','Import'),()=>{const before=state.papers;state.papers=[...state.papers.filter(x=>x.id!==p.id),p];if(!persist()){state.papers=before;render();return}filter=p.level;screen='lobby';render();toastMsg(t('试卷导入成功','Paper imported'))});
    }catch(e){feedback.textContent=t('导入失败：','Import failed: ')+e.message}
  }
  function tick(){
    const a=state.active;if(!a)return;const left=Math.max(0,Math.ceil((a.deadline-Date.now())/1000)),el=root.querySelector('#examClock');
    if(el){el.textContent=String(Math.floor(left/60)).padStart(2,'0')+':'+String(left%60).padStart(2,'0');el.classList.toggle('urgent',left<=60)}
    if(left===0&&!finishing){finishing=true;try{finish(true)}finally{finishing=false}}
  }
  root.addEventListener('click',e=>{
    const b=e.target.closest('[data-exam-action]');if(!b||b.disabled)return;const action=b.dataset.examAction;
    if(action==='filter'){filter=b.dataset.level;render()}
    else if(action==='prepare')prepare(b.dataset.paper);
    else if(action==='resume'){screen='test';lastQuestionAt=Date.now();render();focusQuestion()}
    else if(action==='leave'){collect();screen='lobby';window.speechSynthesis?.cancel();render()}
    else if(action==='lobby'){screen='lobby';render()}
    else if(action==='history')root.querySelector('#examHistory')?.scrollIntoView({behavior:'smooth'});
    else if(action==='report'){reportId=b.dataset.record;screen='report';render()}
    else if(action==='prev')go(Math.max(0,state.active.index-1));
    else if(action==='next'){if(state.active.index===activeQuestions().length-1)submit();else go(state.active.index+1)}
    else if(action==='jump')go(Number(b.dataset.index));
    else if(action==='mark'){collect();const q=activeQuestions()[state.active.index],m=state.active.marked;state.active.marked=m.includes(q.id)?m.filter(id=>id!==q.id):[...m,q.id];persist();render()}
    else if(action==='submit')submit();
    else if(action==='listen')speakText(activeQuestions()[state.active.index].audioText);
    else if(action==='backup')download('qinghe-exam-backup.json',state);
    else if(action==='export-report'){const h=state.history.find(x=>x.id===reportId);download('qinghe-exam-report.json',{...h,grading:C.grade(h.paper,h.answers)})}
    else if(action==='add-wrong')addWrong();
  });
  root.addEventListener('input',e=>{if(e.target.matches('#examAnswer,[name="examAnswer"]')){if(state.active&&Date.now()>=state.active.deadline){finish(true);return}collect()}});
  root.addEventListener('change',e=>{if(e.target.id==='examImportFile')importFile(e.target.files[0])});
  root.addEventListener('error',e=>{if(e.target.tagName==='AUDIO'){const notice=root.querySelector('#examAudioNotice');if(notice)notice.textContent=t('音频暂不可用，请检查网络或联系试卷维护者。','Audio unavailable. Check your connection or contact the paper author.')}},true);
  document.getElementById('examDialog').addEventListener('click',e=>{const b=e.target.closest('[data-exam-action]');if(!b)return;const action=dialogAction;document.getElementById('examDialog').close();dialogAction=null;if(b.dataset.examAction==='dialog-confirm')action?.()});
  document.getElementById('examDialog').addEventListener('cancel',()=>{dialogAction=null});
  document.addEventListener('qinghe:languagechange',()=>{if(screen==='test')collect();render()});
  window.addEventListener('beforeunload',e=>{if(state.active){if(screen==='test')collect();e.preventDefault();e.returnValue=''}});
  document.addEventListener('visibilitychange',()=>{if(state.active){if(screen==='test')spend();persist();tick()}});
  window.addEventListener('storage',e=>{if(e.key!==KEY)return;try{const latest=JSON.parse(e.newValue);if(latest&&Array.isArray(latest.history)){state=latest;lastQuestionAt=Date.now();render()}}catch(err){}});
  const originalReviewRender=window.renderReviewItem;
  window.renderReviewItem=function(){
    originalReviewRender();const item=reviewItems[reviewIndex];
    if(item?.audioUrl){const audio=document.createElement('audio');audio.controls=true;audio.src=item.audioUrl;audio.className='exam-audio';document.getElementById('reviewMedia').replaceChildren(audio)}
  };
  async function loadPublishedPapers(){
    try{
      const response=await fetch('./exam-papers/index.json',{cache:'no-store'});if(!response.ok)throw new Error('Paper catalog unavailable');
      const catalog=await response.json();if(catalog.schemaVersion!==1||!Array.isArray(catalog.papers)||catalog.papers.length>100)throw new Error('Invalid paper catalog');
      const loaded=await Promise.all(catalog.papers.map(async file=>{
        if(typeof file!=='string'||!/^[a-zA-Z0-9_-]+\.json$/.test(file))throw new Error('Invalid paper file');
        const res=await fetch('./exam-papers/'+file);if(!res.ok)throw new Error('Paper unavailable');return C.validatePaper(await res.json());
      }));
      if(new Set(loaded.map(p=>p.id)).size!==loaded.length||loaded.some(p=>p.id===demo.id))throw new Error('Duplicate paper ID');
      publishedPapers=loaded;if(screen==='lobby')render();
    }catch(error){const note=document.createElement('p');note.className='exam-import-note';note.setAttribute('role','status');note.textContent=t('公开试卷目录暂不可用，演示卷和本机导入的试卷仍可使用。','The published paper catalog is unavailable. The demo and locally imported papers remain available.');root.appendChild(note)}
  }
  clock=setInterval(tick,1000);render();loadPublishedPapers();
})();

