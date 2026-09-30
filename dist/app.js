// 青禾中文主逻辑（数据驱动版）
// 数据来源：开放词典数据 + HSK 1–6 共 60 节原创场景课程

const courses=lessons.map(l=>({
  id:l.id,level:l.level,title:l.title,scene:l.scene,
  grammar:l.grammar.name,vocab:l.vocab.join('、'),
  listening:l.listening.q,speaking:'跟读整句',
  review:l.grammar.name+'；'+l.vocab.slice(0,3).join('、'),ready:true
}));

let currentLesson=lessons.find(l=>l.id==='QH-021')||lessons[0];
let shadowingText=currentLesson.shadowing;
let helper=true,phase=0,recording=false,recognition=null,liveTranscript='',recognitionFailed=false,reviewIndex=0;
const wordModal=document.getElementById('wordModal'),courseModal=document.getElementById('courseModal');
const modalWord=document.getElementById('modalWord'),modalPinyin=document.getElementById('modalPinyin'),modalMeaning=document.getElementById('modalMeaning'),modalLevel=document.getElementById('modalLevel'),modalExample=document.getElementById('modalExample'),modalSpeak=document.getElementById('modalSpeak');
const helperSwitch=document.getElementById('helperSwitch'),toast=document.getElementById('toast'),recordBtn=document.getElementById('recordBtn'),recordHint=document.getElementById('recordHint');
const dictInput=document.getElementById('dictInput'),dictWord=document.getElementById('dictWord'),dictPinyin=document.getElementById('dictPinyin'),dictMeaning=document.getElementById('dictMeaning'),dictLevel=document.getElementById('dictLevel'),dictExplain=document.getElementById('dictExplain'),dictTraditional=document.getElementById('dictTraditional'),dictPos=document.getElementById('dictPos'),dictCollocations=document.getElementById('dictCollocations'),dictExamples=document.getElementById('dictExamples'),recentWords=document.getElementById('recentWords'),dictResults=document.getElementById('dictResults'),dictStatus=document.getElementById('dictStatus'),dictLoadBtn=document.getElementById('dictLoadBtn'),dictSource=document.getElementById('dictSource');
const pinyinTip=document.getElementById('pinyinTip'),tipWord=document.getElementById('tipWord'),tipPinyin=document.getElementById('tipPinyin');
const speechResult=document.getElementById('speechResult'),speechResultTitle=document.getElementById('speechResultTitle'),speechResultStatus=document.getElementById('speechResultStatus'),speechScore=document.getElementById('speechScore'),speechTranscript=document.getElementById('speechTranscript'),speechFeedback=document.getElementById('speechFeedback');
window.qingheDemoReady=true;

function escapeHtml(value){return String(value).replace(/[&<>'"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c]))}
function showView(id){hidePinyinTip();document.querySelectorAll('.view').forEach(v=>v.classList.toggle('active',v.id===id));document.querySelectorAll('.nav button').forEach(b=>b.classList.toggle('active',b.dataset.view===id));if(id==='learn')showLessonCatalog();window.scrollTo({top:0,behavior:'smooth'})}
document.querySelectorAll('.nav button').forEach(b=>b.addEventListener('click',()=>showView(b.dataset.view)));

// ---------- 课程目录 ----------
function renderCourses(level='全部'){
  const list=level==='全部'?courses:courses.filter(c=>c.level===level);
  document.getElementById('courseGrid').innerHTML=list.map(c=>`<article class="card course-card"><div class="course-card-top"><span class="pill">${c.level}</span><span class="course-number">${c.id}</span></div><h3>${escapeHtml(c.title)}</h3><div class="course-scene">${escapeHtml(c.scene)}</div><div class="course-focus">${escapeHtml(c.grammar)}</div><div class="course-card-actions"><span class="status-ready">完整课程</span><button class="secondary" onclick="openLesson('${c.id}')">进入课程</button></div></article>`).join('');
}
function filterCourses(level,button){document.querySelectorAll('.filter-btn').forEach(b=>b.classList.toggle('active',b===button));renderCourses(level)}
function showLessonCatalog(){document.getElementById('courseCatalog').classList.remove('hidden');document.getElementById('lessonDetail').classList.add('hidden')}
function openLesson(id){const l=lessons.find(x=>x.id===id);if(!l)return;currentLesson=l;closeCourseModal();showView('learn');document.getElementById('courseCatalog').classList.add('hidden');document.getElementById('lessonDetail').classList.remove('hidden');renderLesson();window.scrollTo({top:0,behavior:'smooth'})}
function openCurrentLesson(){openLesson(currentLesson.id)}
function openCoursePreview(id){const c=courses.find(x=>x.id===id);if(!c)return;document.getElementById('courseModalLevel').textContent=c.level+' · '+c.id;document.getElementById('courseModalTitle').textContent=c.title;document.getElementById('courseModalScene').textContent=c.scene;document.getElementById('courseModalGrammar').textContent=c.grammar;document.getElementById('courseModalVocab').textContent=c.vocab;document.getElementById('courseModalListening').textContent=c.listening;document.getElementById('courseModalSpeaking').textContent=c.speaking;document.getElementById('courseModalReview').textContent=c.review;const action=document.getElementById('courseModalAction');action.textContent='进入课程';action.onclick=()=>openLesson(id);courseModal.classList.add('show')}
function closeCourseModal(){courseModal.classList.remove('show')}
courseModal.addEventListener('click',e=>{if(e.target===courseModal)closeCourseModal()});

// ---------- 词语标注与词卡 ----------
function markWords(text,vocab){
  const keys=(vocab||Object.keys(words)).filter(w=>words[w]).sort((a,b)=>b.length-a.length);
  if(!keys.length)return escapeHtml(text);
  const re=new RegExp(keys.map(w=>w.replace(/[.*+?^${}()|[\]\\]/g,'\\$&')).join('|'),'g');
  return escapeHtml(text).replace(re,m=>`<button class="word" data-word="${m}">${m}</button>`);
}
function bindWords(root){
  root.querySelectorAll('.word').forEach(b=>{
    if(b.dataset.bound)return;b.dataset.bound='1';
    const d=words[b.dataset.word];
    if(d)b.setAttribute('aria-label',b.dataset.word+'，拼音 '+d.p);
    b.addEventListener('pointerenter',e=>{if(e.pointerType==='mouse')showPinyinTip(b)});
    b.addEventListener('pointerleave',hidePinyinTip);
    b.addEventListener('focus',()=>showPinyinTip(b));
    b.addEventListener('blur',hidePinyinTip);
    b.addEventListener('click',e=>{e.stopPropagation();hidePinyinTip();openWord(b.dataset.word)});
  });
}
function showPinyinTip(el){const d=words[el.dataset.word];if(!d)return;tipWord.textContent=el.dataset.word;tipPinyin.textContent=d.p;pinyinTip.classList.add('show');pinyinTip.setAttribute('aria-hidden','false');requestAnimationFrame(()=>{const r=el.getBoundingClientRect(),t=pinyinTip.getBoundingClientRect();const left=Math.min(window.innerWidth-t.width-12,Math.max(12,r.left+r.width/2-t.width/2));let top=r.top-t.height-10;if(top<12)top=r.bottom+10;pinyinTip.style.left=left+'px';pinyinTip.style.top=top+'px'})}
function hidePinyinTip(){pinyinTip.classList.remove('show');pinyinTip.setAttribute('aria-hidden','true')}
window.addEventListener('scroll',hidePinyinTip,{passive:true});window.addEventListener('resize',hidePinyinTip);

function openWord(w){const d=words[w];if(!d)return;modalWord.textContent=w;modalPinyin.textContent=d.p;modalMeaning.textContent=d.m;modalLevel.textContent=d.l;modalExample.textContent=d.e;modalSpeak.onclick=()=>speakText(w);wordModal.classList.add('show')}
function closeModal(){wordModal.classList.remove('show')}
wordModal.addEventListener('click',e=>{if(e.target===wordModal)closeModal()});
document.addEventListener('keydown',e=>{if(e.key==='Escape'){closeModal();closeCourseModal()}});
function toggleHelper(){helper=!helper;document.body.classList.toggle('helper-off',!helper);document.querySelectorAll('.switch').forEach(s=>s.classList.toggle('on',helper));toastMsg('中文辅助模式已'+(helper?'开启':'关闭'))}
helperSwitch.onclick=toggleHelper;

// ---------- 主题 ----------
function setTheme(name,silent=false){const allowed=['qinghe','mist','tea','wisteria'];if(!allowed.includes(name))name='qinghe';document.body.dataset.theme=name;document.querySelectorAll('.theme-option').forEach(b=>b.classList.toggle('active',b.dataset.themeOption===name));try{localStorage.setItem('qinghe-theme',name)}catch(e){}const colors={qinghe:'#60735a',mist:'#526c7a',tea:'#765f4c',wisteria:'#665f78'};document.querySelector('meta[name="theme-color"]').setAttribute('content',colors[name]);if(!silent)toastMsg('已切换界面配色')}
try{setTheme(localStorage.getItem('qinghe-theme')||'qinghe',true)}catch(e){setTheme('qinghe',true)}

// ---------- 语音 ----------
function speakText(text,rate=.88){if('speechSynthesis'in window){speechSynthesis.cancel();const u=new SpeechSynthesisUtterance(text);u.lang='zh-CN';u.rate=rate;speechSynthesis.speak(u);toastMsg(rate<.8?'正在慢速播放':'正在播放普通话')}else toastMsg('当前浏览器不支持语音播放')}

// ---------- 课程渲染 ----------
function renderLesson(){
  const L=currentLesson;
  document.getElementById('lessonCrumb').textContent=L.id+' · '+L.level;
  document.getElementById('lessonTitle').textContent=L.title;
  document.getElementById('lessonMeta').textContent=L.level+' · '+L.scene+' · 预计 15 分钟';
  document.getElementById('lessonTitleSpeak').onclick=()=>speakText(L.title);
  // 情境对话
  document.getElementById('dialogueTitle').textContent=L.scene;
  document.getElementById('dialogueLines').innerHTML=L.dialogue.map(d=>`<div class="line"><div class="speaker">${escapeHtml(d.s)}</div><div>${markWords(d.t,L.vocab)}</div><button class="speak" aria-label="播放这句">🔊</button></div>`).join('');
  document.querySelectorAll('#dialogueLines .line').forEach((line,i)=>{line.querySelector('.speak').onclick=()=>speakText(L.dialogue[i].t)});
  document.getElementById('playAllBtn').onclick=()=>speakText(L.dialogue.map(d=>d.t).join(''));
  // 词汇
  document.getElementById('vocabEyebrow').textContent='今天的词语 · '+L.vocab.length+' 个';
  document.getElementById('vocabGrid').innerHTML=L.vocab.map(w=>{const d=words[w];return `<div class="vocab-card"><div class="hanzi word" data-word="${escapeHtml(w)}">${escapeHtml(w)}</div><div class="pinyin">${d?d.p:''}</div><p class="meaning">${d?escapeHtml(d.m):''}</p><button class="iconbtn" aria-label="播放词语发音">🔊</button></div>`}).join('');
  document.querySelectorAll('#vocabGrid .vocab-card').forEach((card,i)=>{card.querySelector('.iconbtn').onclick=()=>speakText(L.vocab[i])});
  document.getElementById('vocabQuiz').innerHTML=`<p style="text-align:center">${escapeHtml(L.quiz.q)}</p>`+L.quiz.opts.map((o,i)=>`<button class="choice" onclick="answerChoice(this,${i===L.quiz.ans})">${String.fromCharCode(65+i)}. ${escapeHtml(o)}</button>`).join('')+`<div class="feedback">${escapeHtml(L.quiz.fb)}</div>`;
  // 语法
  document.getElementById('grammarName').textContent=L.grammar.name;
  document.getElementById('grammarExplain').textContent=L.grammar.explain;
  document.getElementById('grammarPattern').innerHTML=escapeHtml(L.grammar.pattern).replace(/\n/g,'<br>');
  document.getElementById('grammarExamples').innerHTML=L.grammar.examples.map(t=>`<div class="example">${markWords(t,L.vocab)} <button class="speak" aria-label="播放例句">🔊</button></div>`).join('');
  document.querySelectorAll('#grammarExamples .example').forEach((ex,i)=>{ex.querySelector('.speak').onclick=()=>speakText(L.grammar.examples[i])});
  const pr=L.grammar.practice;
  document.getElementById('grammarPractice').innerHTML=`<label>${escapeHtml(pr.q)}</label>`+pr.opts.map((o,i)=>`<button class="choice" onclick="answerChoice(this,${i===pr.ans})">${escapeHtml(o)}</button>`).join('');
  // 听力
  document.getElementById('listeningQ').textContent=L.listening.q;
  document.getElementById('listeningPlay').onclick=()=>speakText(L.listening.audio);
  document.getElementById('listeningOptions').innerHTML=L.listening.opts.map((o,i)=>`<button class="choice" onclick="answerChoice(this,${i===L.listening.ans})">${escapeHtml(o)}</button>`).join('');
  // 口语
  shadowingText=L.shadowing;
  document.getElementById('shadowingTarget').textContent=L.shadowing;
  resetCorrection();
  // 完成
  document.getElementById('completeSummary').textContent=`你完成了《${L.title}》，新内容会按照记忆节奏安排复习。`;
  document.getElementById('completeVocabCount').textContent=L.vocab.length;
  // 大纲
  const outlineItems=[['情境对话','现在'],[L.vocab.length+' 个词语','约 4 分'],[L.grammar.name,'约 3 分'],['听音辨意','约 2 分'],['跟读口语','约 2 分'],['完成','总结']];
  document.getElementById('outline').innerHTML=outlineItems.map((x,i)=>`<div class="outline-item${i===0?' now':''}">${escapeHtml(x[0])} <span>${x[1]}</span></div>`).join('');
  bindWords(document.getElementById('lessonDetail'));
  setPhase(0);
}

// ---------- 课程阶段 ----------
function setPhase(n){phase=Math.max(0,Math.min(5,n));document.querySelectorAll('.phase').forEach((p,i)=>p.classList.toggle('active',i===phase));document.querySelectorAll('.step').forEach((s,i)=>{s.className='step'+(i<phase?' done':i===phase?' current':'')});document.querySelectorAll('.outline-item').forEach((x,i)=>{x.classList.toggle('now',i===phase);x.lastElementChild.textContent=i===phase?'现在':i<phase?'完成':(['约 4 分','约 3 分','约 2 分','约 2 分','总结'][i-1]||'')});window.scrollTo({top:0,behavior:'smooth'})}
function nextPhase(){setPhase(phase+1)}function prevPhase(){setPhase(phase-1)}function restartLesson(){setPhase(0)}
function answerChoice(el,ok){el.parentElement.querySelectorAll('.choice').forEach(x=>x.classList.remove('selected','correct'));el.classList.add(ok?'correct':'selected');const f=el.parentElement.querySelector('.feedback');if(f)f.classList.add('show');toastMsg(ok?'回答正确':'再想一想，可以回到课文看看')}

// ---------- 复习 ----------
const reviewItems=[
  {type:'词义辨认',prompt:'“本来”最接近哪个意思？',mode:'choice',options:['originally; at first','especially','just now'],answer:0,feedback:'“本来”说明原来的情况或计划。'},
  {type:'听音辨词',prompt:'先听发音，再选择你听到的词。',mode:'choice',audio:'迟到',options:['知道','迟到','提到'],answer:1,feedback:'“迟到”读作 chí dào。'},
  {type:'句中填空',prompt:'我 ___ 想坐地铁，但是今天人太多。',mode:'input',answers:['本来'],feedback:'“本来……但是……”表示计划和实际情况发生了变化。'},
  {type:'主动表达',prompt:'用“本来……但是……”写一句自己的话。',mode:'open',feedback:'答案不必完全一样；重点是先说原计划，再说变化。'}
];
function startReview(){reviewIndex=0;document.getElementById('startReviewBtn').classList.add('hidden');document.getElementById('reviewDemo').classList.add('show');renderReviewItem();document.getElementById('reviewDemo').scrollIntoView({behavior:'smooth',block:'center'})}
function renderReviewItem(){const item=reviewItems[reviewIndex],options=document.getElementById('reviewOptions'),input=document.getElementById('reviewInput'),check=document.getElementById('reviewCheckBtn');document.getElementById('reviewTypeLabel').textContent=item.type+' · '+(reviewIndex+1)+' / '+reviewItems.length;document.getElementById('reviewProgressBar').style.width=((reviewIndex+1)/reviewItems.length*100)+'%';document.getElementById('reviewQuestion').textContent=item.prompt;document.getElementById('reviewMedia').innerHTML=item.audio?`<button class="bigplay" onclick="speakText('${item.audio}')" aria-label="播放复习发音">▶</button>`:'';document.getElementById('reviewFeedback').classList.remove('show');document.getElementById('reviewGrades').classList.remove('show');options.innerHTML='';input.classList.add('hidden');check.classList.add('hidden');input.value='';if(item.mode==='choice'){options.className='choice-grid';item.options.forEach((o,i)=>{const b=document.createElement('button');b.className='choice';b.textContent=o;b.onclick=()=>reviewChoice(i,b);options.appendChild(b)})}else{options.className='';input.classList.remove('hidden');check.classList.remove('hidden');input.placeholder=item.mode==='open'?'例如：我本来想去公园，但是下雨了。':'输入词语'}}
function reviewChoice(index,button){const item=reviewItems[reviewIndex];document.querySelectorAll('#reviewOptions .choice').forEach(b=>b.disabled=true);button.classList.add(index===item.answer?'correct':'selected');showReviewFeedback(index===item.answer,item.feedback)}
function checkReviewInput(){const item=reviewItems[reviewIndex],value=document.getElementById('reviewInput').value.trim();let ok=false;if(item.mode==='input')ok=item.answers.includes(value);else ok=value.length>=8&&value.includes('本来')&&value.includes('但是');showReviewFeedback(ok,ok?item.feedback:(item.mode==='open'?'试着同时使用“本来”和“但是”。':'正确答案是“本来”。'))}
function showReviewFeedback(ok,message){const feedback=document.getElementById('reviewFeedback');feedback.textContent=(ok?'✓ ':'再想一想：')+message;feedback.classList.add('show');document.getElementById('reviewGrades').classList.add('show')}
function gradeReview(level){const due={hard:'明天',good:'3 天后',easy:'7 天后'}[level];toastMsg('已安排在'+due+'再次复习');reviewIndex++;if(reviewIndex>=reviewItems.length){document.getElementById('reviewTypeLabel').textContent='本轮完成';document.getElementById('reviewProgressBar').style.width='100%';document.getElementById('reviewQuestion').textContent='4 种练习都做过了';document.getElementById('reviewMedia').innerHTML='<p class="sub">系统会根据刚才的难度选择安排下一次出现。</p>';document.getElementById('reviewOptions').innerHTML='<button class="secondary" onclick="resetReview()">再练一轮</button>';document.getElementById('reviewInput').classList.add('hidden');document.getElementById('reviewCheckBtn').classList.add('hidden');document.getElementById('reviewFeedback').classList.remove('show');document.getElementById('reviewGrades').classList.remove('show');return}renderReviewItem()}
function resetReview(){reviewIndex=0;renderReviewItem()}

// ---------- 词典 ----------
const OPEN_CEDICT_URL='https://raw.githubusercontent.com/leonsilicon/cc-cedict/main/cedict_1_0_ts_utf-8_mdbg.json';
const CC_CEDICT_URL='https://cc-cedict.org/editor/editor.php?handler=Download';
const CC_LICENSE_URL='https://creativecommons.org/licenses/by-sa/4.0/';
let openCedictEntries=null,openCedictPromise=null,onlineSearchMatches=[];

function normalizeQuery(text){return String(text).normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/\s+/g,'').toLowerCase()}
function normalizePinyin(text,loose=false){let value=String(text).toLowerCase().replace(/u:/g,'v').replace(/ü/g,'v').normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[1-5]/g,'').replace(/[^a-zv]/g,'');return loose?value.replace(/v/g,'u'):value}
function toneSyllable(token){const match=token.match(/^([A-Za-züÜvV:]+)([1-5])$/);if(!match)return token.replace(/u:/gi,'ü').replace(/v/gi,'ü');let base=match[1].replace(/u:/gi,'ü').replace(/v/gi,'ü').toLowerCase(),tone=Number(match[2]);if(tone===5)return base;const marks={a:['ā','á','ǎ','à'],e:['ē','é','ě','è'],i:['ī','í','ǐ','ì'],o:['ō','ó','ǒ','ò'],u:['ū','ú','ǔ','ù'],'ü':['ǖ','ǘ','ǚ','ǜ']};let index=base.indexOf('a');if(index<0)index=base.indexOf('e');if(index<0&&base.includes('ou'))index=base.indexOf('o');if(index<0){for(let i=base.length-1;i>=0;i--)if(marks[base[i]]){index=i;break}}return index<0?base:base.slice(0,index)+marks[base[index]][tone-1]+base.slice(index+1)}
function numberedPinyinToMarks(text){return String(text).split(/\s+/).map(toneSyllable).join(' ')}
function localMatches(query){const q=query.trim(),pin=normalizePinyin(q),loose=normalizePinyin(q,true),hasHan=/[\u3400-\u9fff]/.test(q);const keys=Object.keys(words);return keys.filter(key=>{const d=words[key];if(hasHan)return key===q||d.tr===q||key.startsWith(q)||String(d.tr||'').startsWith(q);const p=normalizePinyin(d.p),pl=normalizePinyin(d.p,true);return p===pin||pl===loose||p.startsWith(pin)||pl.startsWith(loose)}).slice(0,10)}
function setDictStatus(kind,text){dictStatus.className='dict-resource-status'+(kind?' '+kind:'');dictStatus.querySelector('span').textContent=text}
async function getOpenDictionary(){if(openCedictEntries)return openCedictEntries;if(openCedictPromise)return openCedictPromise;setDictStatus('loading','正在连接 CC-CEDICT 开放词库（首次约 4.5 MB）…');dictLoadBtn.disabled=true;openCedictPromise=fetch(OPEN_CEDICT_URL,{cache:'force-cache'}).then(response=>{if(!response.ok)throw new Error('HTTP '+response.status);return response.json()}).then(data=>{if(!Array.isArray(data.entries))throw new Error('词库格式不正确');openCedictEntries=data.entries;setDictStatus('online','在线词库已连接 · '+openCedictEntries.length.toLocaleString('zh-CN')+' 条 CC-CEDICT 词条');dictLoadBtn.textContent='已连接';toastMsg('完整开放词库已连接');return openCedictEntries}).catch(error=>{openCedictPromise=null;setDictStatus('error','在线词库暂时无法连接；课程词库仍可正常使用');dictLoadBtn.disabled=false;dictLoadBtn.textContent='重新连接';throw error});return openCedictPromise}
async function loadOpenDictionary(){try{await getOpenDictionary()}catch(error){toastMsg('连接失败，请检查网络后重试')}}
function entryPenalty(entry){const defs=(entry.definitions||[]).join(' ').toLowerCase(),local=words[entry.simplified]||words[entry.traditional];let score=(/surname|variant of|old variant|see /.test(defs)?5:0)+(/^[A-Z]/.test(entry.pinyin||'')?2:0);if(local){const pos=local.pos||'';if(pos.includes('助词')&&/particle/.test(defs))score-=7;if(pos.includes('代词')&&/pronoun|which|what|who|where/.test(defs))score-=5;if(pos.includes('量词')&&/classifier|measure word/.test(defs))score-=5;if(pos.includes('数词')&&/number|one|two|three|four|five|six|seven|eight|nine|ten/.test(defs))score-=4;if(pos.includes('时间')&&/today|tomorrow|yesterday|morning|afternoon|time/.test(defs))score-=4;if(pos.includes('连词')&&/although|but|however|if|because|therefore/.test(defs))score-=3}return score}
function searchOpenEntries(query){if(!openCedictEntries)return[];const q=query.trim(),hasHan=/[\u3400-\u9fff]/.test(q),pin=normalizePinyin(q),loose=normalizePinyin(q,true),ranked=[];for(const entry of openCedictEntries){let rank=99;if(hasHan){if(entry.simplified===q)rank=0;else if(entry.traditional===q)rank=1;else if(entry.simplified.startsWith(q))rank=3;else if(entry.traditional.startsWith(q))rank=4}else{const p=normalizePinyin(entry.pinyin),pl=normalizePinyin(entry.pinyin,true);if(p===pin)rank=0;else if(pl===loose)rank=1;else if(p.startsWith(pin))rank=3;else if(pl.startsWith(loose))rank=4}if(rank<99)ranked.push({entry,rank:rank+entryPenalty(entry)})}ranked.sort((a,b)=>a.rank-b.rank||a.entry.simplified.length-b.entry.simplified.length);const seen=new Set;return ranked.map(x=>x.entry).filter(entry=>{const key=entry.simplified+'|'+entry.pinyin;if(seen.has(key))return false;seen.add(key);return true}).slice(0,12)}
function renderResultButtons(localKeys=[],onlineEntries=[]){dictResults.replaceChildren();const items=[];for(const key of localKeys)items.push({kind:'local',word:key,pinyin:words[key].p,meaning:words[key].m,key});for(const entry of onlineEntries){const duplicate=items.some(item=>item.word===entry.simplified&&normalizePinyin(item.pinyin)===normalizePinyin(entry.pinyin));if(!duplicate)items.push({kind:'online',word:entry.simplified,pinyin:numberedPinyinToMarks(entry.pinyin),meaning:(entry.definitions||[])[0]||'CC-CEDICT 词条',entry})}items.slice(0,10).forEach(item=>{const button=document.createElement('button');button.className='dict-result';const word=document.createElement('span');word.className='result-word';word.textContent=item.word;const pinyin=document.createElement('span');pinyin.className='result-pinyin';pinyin.textContent=item.pinyin;const meaning=document.createElement('span');meaning.className='result-meaning';meaning.textContent=item.meaning;button.append(word,pinyin,meaning);button.onclick=()=>item.kind==='local'?lookupWord(item.key):lookupOnlineEntry(item.entry);dictResults.appendChild(button)});if(items.length){const note=document.createElement('div');note.className='dict-result-more';note.textContent='找到 '+items.length+' 个相关结果；选择一个查看完整词条。';dictResults.appendChild(note);dictResults.classList.add('show')}else dictResults.classList.remove('show')}
async function searchDict(){const query=dictInput.value.trim();if(!query){toastMsg('请输入汉字或拼音');return}const locals=localMatches(query);if(locals.length)lookupWord(locals[0],false);renderResultButtons(locals,[]);try{await getOpenDictionary();onlineSearchMatches=searchOpenEntries(query);renderResultButtons(locals,onlineSearchMatches);if(onlineSearchMatches.length)lookupOnlineEntry(onlineSearchMatches[0],false);else if(!locals.length)toastMsg('没有找到“'+query+'”，可以换一种拼音写法')}catch(error){if(!locals.length)toastMsg('在线词库未连接，当前只搜索课程词库')}}
function renderExamples(examples){dictExamples.replaceChildren(...examples.map(text=>{const div=document.createElement('div');div.className='example';const span=document.createElement('span');span.textContent=text+' ';div.append(span);if(!text.includes('暂时没有原创例句')){const button=document.createElement('button');button.className='speak';button.textContent='🔊';button.setAttribute('aria-label','播放例句');button.onclick=()=>speakText(text);div.append(button)}return div}))}
function lookupWord(key,notify=true){const d=words[key];if(!d)return;dictInput.value=key;dictWord.textContent=key;dictPinyin.textContent=d.p;dictMeaning.textContent=d.m;dictLevel.textContent=d.l;dictExplain.textContent=d.cn;dictTraditional.textContent=d.tr||key;dictPos.textContent=d.pos;dictCollocations.replaceChildren(...d.col.map(text=>{const span=document.createElement('span');span.textContent=text;return span}));renderExamples(d.examples);dictSource.innerHTML='课程词条 · 拼音与英文释义参考 <a href="'+CC_CEDICT_URL+'" target="_blank" rel="noopener">CC-CEDICT</a>（<a href="'+CC_LICENSE_URL+'" target="_blank" rel="noopener">CC BY-SA 4.0</a>）· 中文释义、搭配与例句为青禾中文原创';updateRecent(key);if(notify)toastMsg('已找到“'+key+'”')}
function lookupOnlineEntry(entry,notify=true){if(!entry)return;const key=entry.simplified,local=words[key]||words[entry.traditional],definitions=(entry.definitions||[]).filter(Boolean).slice(0,5);dictInput.value=key;dictWord.textContent=key;dictPinyin.textContent=numberedPinyinToMarks(entry.pinyin);dictMeaning.textContent=definitions.join('; ')||'CC-CEDICT entry';dictLevel.textContent=local?local.l:'CC-CEDICT · 开放词条';dictExplain.textContent=local?local.cn:'英文义项来自开放词典；中文学习释义尚待人工审校。';dictTraditional.textContent=entry.traditional||key;dictPos.textContent=local?local.pos:'待人工标注';const collocations=local?local.col:['可加入生词本','中文释义待审校'];dictCollocations.replaceChildren(...collocations.map(text=>{const span=document.createElement('span');span.textContent=text;return span}));renderExamples(local?local.examples:['该词条暂时没有原创例句。']);dictSource.innerHTML='在线开放词条 · 数据来自 <a href="'+CC_CEDICT_URL+'" target="_blank" rel="noopener">CC-CEDICT / MDBG 社区</a>，按 <a href="'+CC_LICENSE_URL+'" target="_blank" rel="noopener">CC BY-SA 4.0</a> 使用；青禾中文的原创字段单独标注';updateRecent(key);if(notify)toastMsg('已从开放词库找到“'+key+'”')}
function updateRecent(key){const existing=[...recentWords.querySelectorAll('.recent-word')].map(x=>x.textContent).filter(x=>x!==key);recentWords.replaceChildren(...[key,...existing].slice(0,4).map(word=>{const span=document.createElement('span');span.className='recent-word';span.textContent=word;span.onclick=()=>{dictInput.value=word;searchDict()};return span}))}
dictInput.addEventListener('keydown',e=>{if(e.key==='Enter')searchDict()});

// ---------- 跟读纠错 ----------
function speakShadowing(rate=.82){speakText(shadowingText,rate)}
function setRecording(active){recording=active;recordBtn.classList.toggle('recording',active);recordBtn.setAttribute('aria-pressed',String(active));recordBtn.setAttribute('aria-label',active?'结束跟读':'开始跟读');recordHint.textContent=active?'正在听，请完整读完这句话…':'点击圆形按钮，听到提示后开始跟读'}
function normalizeSpeech(text){return text.replace(/[，。！？、,.!?\s]/g,'')}
function speechSimilarity(a,b){a=normalizeSpeech(a);b=normalizeSpeech(b);if(!a.length||!b.length)return 0;const dp=Array.from({length:a.length+1},(_,i)=>[i]);for(let j=0;j<=b.length;j++)dp[0][j]=j;for(let i=1;i<=a.length;i++)for(let j=1;j<=b.length;j++)dp[i][j]=Math.min(dp[i-1][j]+1,dp[i][j-1]+1,dp[i-1][j-1]+(a[i-1]===b[j-1]?0:1));return Math.max(0,Math.round((1-dp[a.length][b.length]/Math.max(a.length,b.length))*100))}
function feedbackItem(mark,text){const li=document.createElement('li'),icon=document.createElement('i'),span=document.createElement('span');icon.textContent=mark;span.textContent=text;li.append(icon,span);return li}
function showCorrection(text,isDemo=false){const score=speechSimilarity(shadowingText,text);speechResult.classList.add('show');speechResultTitle.textContent=isDemo?'纠错示例':'本次跟读';speechResultStatus.textContent=isDemo?'示例结果，不是你的录音':'浏览器语音识别结果';speechScore.textContent=score;speechTranscript.textContent=text||'没有识别到声音';speechFeedback.replaceChildren();const compact=normalizeSpeech(text);const firstWord=currentLesson.vocab.find(w=>shadowingText.includes(w))||'';speechFeedback.append(feedbackItem(firstWord&&compact.includes(normalizeSpeech(firstWord))?'✓':'!',firstWord?(compact.includes(normalizeSpeech(firstWord))?'“'+firstWord+'”识别清楚，开头很自然。':'“'+firstWord+'”没有识别清楚，试着放慢一点。'):'注意每个字都要读清楚。'));speechFeedback.append(feedbackItem(score>=88?'✓':'↻',score>=88?'整句节奏稳定，可以进入下一步。':score>=68?'整体已经听懂，再练一次会更自然。':'建议先慢速听一遍，再分成两段跟读。'));speechResult.scrollIntoView({behavior:'smooth',block:'nearest'})}
function showSpeechError(code){setRecording(false);speechResult.classList.add('show');speechResultTitle.textContent='暂时无法识别';speechResultStatus.textContent=code==='not-allowed'?'没有获得麦克风权限':'浏览器未收到清晰语音';speechScore.textContent='--';speechTranscript.textContent=code==='not-allowed'?'请允许麦克风后重试，或先查看纠错示例。':'请靠近麦克风，再完整读一次。';speechFeedback.replaceChildren(feedbackItem('i','你也可以点击“查看纠错示例”，先体验反馈方式。'))}
function toggleRecord(){if(recording){if(recognition)recognition.stop();return}const SpeechRecognition=window.SpeechRecognition||window.webkitSpeechRecognition;if(!SpeechRecognition){toastMsg('当前浏览器不支持实时识别，已打开纠错示例');showCorrectionDemo();return}try{recognition=new SpeechRecognition();recognition.lang='zh-CN';recognition.interimResults=true;recognition.continuous=false;liveTranscript='';recognitionFailed=false;recognition.onstart=()=>{setRecording(true);speechResult.classList.add('show');speechResultTitle.textContent='正在跟读';speechResultStatus.textContent='实时识别中';speechScore.textContent='--';speechTranscript.textContent='正在听……';speechFeedback.replaceChildren()};recognition.onresult=e=>{let finalText='',interimText='';for(let i=e.resultIndex;i<e.results.length;i++){const part=e.results[i][0].transcript;if(e.results[i].isFinal)finalText+=part;else interimText+=part}if(finalText)liveTranscript+=finalText;speechTranscript.textContent=liveTranscript||interimText||'正在听……'};recognition.onerror=e=>{recognitionFailed=true;showSpeechError(e.error)};recognition.onend=()=>{if(recognitionFailed)return;const text=(liveTranscript||speechTranscript.textContent).trim();setRecording(false);if(text&&text!=='正在听……')showCorrection(text);else showSpeechError('no-speech')};recognition.start()}catch(e){recognitionFailed=true;showSpeechError('start-failed')}}
function showCorrectionDemo(){setRecording(false);const w=currentLesson.vocab.find(x=>shadowingText.includes(x));showCorrection(w?shadowingText.replace(w,''):shadowingText.slice(0,-2),true)}
function resetCorrection(){if(recording&&recognition)recognition.stop();setRecording(false);speechResult.classList.remove('show');speechScore.textContent='--';speechTranscript.textContent='正在听……';speechFeedback.replaceChildren()}

function saveWord(){toastMsg('已加入生词本');closeModal()}
function toastMsg(t){toast.textContent=t;toast.classList.add('show');clearTimeout(window._tt);window._tt=setTimeout(()=>toast.classList.remove('show'),1800)}

renderCourses();
bindWords(document);
renderLesson();
