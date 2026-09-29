const words={
  '迟到':{p:'chí dào',m:'to be late',l:'HSK 3 · 动词',e:'我今天上课迟到了。'},
  '本来':{p:'běn lái',m:'originally; at first',l:'HSK 3 · 副词',e:'我本来想坐地铁。'},
  '地铁':{p:'dì tiě',m:'subway; metro',l:'HSK 2 · 名词',e:'我每天坐地铁上班。'},
  '特别':{p:'tè bié',m:'especially; particularly',l:'HSK 3 · 副词',e:'今天地铁的人特别多。'},
  '刚':{p:'gāng',m:'just; a moment ago',l:'HSK 3 · 副词',e:'我们也刚到。'}
};
let helper=true,phase=0,recording=false;
const wordModal=document.getElementById('wordModal'), modalWord=document.getElementById('modalWord'), modalPinyin=document.getElementById('modalPinyin'), modalMeaning=document.getElementById('modalMeaning'), modalLevel=document.getElementById('modalLevel'), modalExample=document.getElementById('modalExample'), modalSpeak=document.getElementById('modalSpeak');
const helperSwitch=document.getElementById('helperSwitch'), toast=document.getElementById('toast'), recordBtn=document.getElementById('recordBtn'), recordHint=document.getElementById('recordHint'), reviewDemo=document.getElementById('reviewDemo');
const dictInput=document.getElementById('dictInput'), dictWord=document.getElementById('dictWord'), dictPinyin=document.getElementById('dictPinyin'), dictMeaning=document.getElementById('dictMeaning'), dictLevel=document.getElementById('dictLevel'), dictExplain=document.getElementById('dictExplain');
window.qingheDemoReady=true;
function showView(id){document.querySelectorAll('.view').forEach(v=>v.classList.toggle('active',v.id===id));document.querySelectorAll('.nav button').forEach(b=>b.classList.toggle('active',b.dataset.view===id));window.scrollTo({top:0,behavior:'smooth'});}
document.querySelectorAll('.nav button').forEach(b=>b.addEventListener('click',()=>showView(b.dataset.view)));
document.querySelectorAll('.word').forEach(b=>b.addEventListener('click',e=>{e.stopPropagation();openWord(b.dataset.word)}));
function openWord(w){const d=words[w];if(!d)return;modalWord.textContent=w;modalPinyin.textContent=d.p;modalMeaning.textContent=d.m;modalLevel.textContent=d.l;modalExample.textContent=d.e;modalSpeak.onclick=()=>speakText(w);wordModal.classList.add('show')}
function closeModal(){wordModal.classList.remove('show')}wordModal.addEventListener('click',e=>{if(e.target===wordModal)closeModal()});document.addEventListener('keydown',e=>{if(e.key==='Escape')closeModal()});
function toggleHelper(){helper=!helper;document.body.classList.toggle('helper-off',!helper);document.querySelectorAll('.switch').forEach(s=>s.classList.toggle('on',helper));toastMsg('中文辅助模式已'+(helper?'开启':'关闭'))}helperSwitch.onclick=toggleHelper;
function speakText(text){if('speechSynthesis'in window){speechSynthesis.cancel();const u=new SpeechSynthesisUtterance(text);u.lang='zh-CN';u.rate=.88;speechSynthesis.speak(u);toastMsg('正在播放标准普通话')}else toastMsg('当前浏览器不支持语音播放')}
function setPhase(n){phase=Math.max(0,Math.min(5,n));document.querySelectorAll('.phase').forEach((p,i)=>p.classList.toggle('active',i===phase));document.querySelectorAll('.step').forEach((s,i)=>{s.className='step'+(i<phase?' done':i===phase?' current':'')});document.querySelectorAll('.outline-item').forEach((x,i)=>{x.classList.toggle('now',i===phase);x.lastElementChild.textContent=i===phase?'现在':i<phase?'完成':(['约 4 分','约 3 分','约 2 分','约 2 分','总结'][i-1]||'')});window.scrollTo({top:0,behavior:'smooth'})}
function nextPhase(){setPhase(phase+1)}function prevPhase(){setPhase(phase-1)}function restartLesson(){setPhase(0)}
function answerChoice(el,ok){el.parentElement.querySelectorAll('.choice').forEach(x=>x.classList.remove('selected','correct'));el.classList.add(ok?'correct':'selected');const f=el.parentElement.querySelector('.feedback');if(f)f.classList.add('show');toastMsg(ok?'回答正确':'再想一想，可以回到课文看看')}
function answerGrammar(el){el.parentElement.querySelectorAll('.choice').forEach(x=>x.classList.remove('correct'));el.classList.add('correct');toastMsg(el.textContent.startsWith('我本来')?'这个句子很自然':'注意：先说“本来”，再说“但是”')}
function toggleRecord(){recording=!recording;recordBtn.classList.toggle('recording',recording);recordHint.textContent=recording?'正在录音…再次点击结束（交互原型）':'录音完成。发音节奏很好！（交互原型）';if(!recording)toastMsg('口语练习已保存到本课记录')}
function startReview(){reviewDemo.style.display='block';reviewDemo.scrollIntoView({behavior:'smooth',block:'center'})}function reviewAnswer(el,ok){el.classList.add(ok?'correct':'selected');toastMsg(ok?'记得很清楚，下次复习会晚一点':'这项内容会更早再出现')}
function searchDict(){const q=dictInput.value.trim();if(words[q]){const d=words[q];dictWord.textContent=q;dictPinyin.textContent=d.p;dictMeaning.textContent=d.m;dictLevel.textContent=d.l;dictExplain.textContent='这是 Demo 词条。你也可以点击课程里的词语快速查看。';toastMsg('已找到“'+q+'”')}else toastMsg('Demo 词库收录：本来、迟到、地铁、特别、刚')}
function saveWord(){toastMsg('已加入生词本');closeModal()}function toastMsg(t){toast.textContent=t;toast.classList.add('show');clearTimeout(window._tt);window._tt=setTimeout(()=>toast.classList.remove('show'),1800)}
