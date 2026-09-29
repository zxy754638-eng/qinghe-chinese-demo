const words={
  '迟到':{p:'chí dào',tr:'遲到',pos:'动词',m:'to be late',cn:'在规定或约定的时间以后到。',l:'HSK 3 · 动词',e:'我今天上课迟到了。',col:['上班迟到','上课迟到','迟到十分钟'],examples:['我今天上课迟到了。','对不起，我迟到了十分钟。']},
  '本来':{p:'běn lái',tr:'本來',pos:'副词',m:'originally; at first',cn:'表示原来的情况、想法或计划，后来可能发生了变化。',l:'HSK 3 · 副词',e:'我本来想坐地铁。',col:['本来想','本来就','本来以为'],examples:['我本来想坐地铁，但是今天人特别多。','这件事本来很简单。']},
  '地铁':{p:'dì tiě',tr:'地鐵',pos:'名词',m:'subway; metro',cn:'在城市地下或部分地面运行的铁路交通。',l:'HSK 2 · 名词',e:'我每天坐地铁上班。',col:['坐地铁','地铁站','地铁线路'],examples:['我每天坐地铁上班。','地铁站离学校不远。']},
  '特别':{p:'tè bié',tr:'特別',pos:'副词 / 形容词',m:'especially; special',cn:'表示程度很高，也可以表示与一般情况不同。',l:'HSK 3 · 副词',e:'今天地铁的人特别多。',col:['特别喜欢','特别忙','很特别'],examples:['今天地铁的人特别多。','这是一份很特别的礼物。']},
  '刚':{p:'gāng',tr:'剛',pos:'副词',m:'just; a moment ago',cn:'表示事情发生在不久以前。',l:'HSK 3 · 副词',e:'我们也刚到。',col:['刚到','刚才','刚开始'],examples:['我们也刚到。','会议刚开始。']},
  '快递':{p:'kuài dì',tr:'快遞',pos:'名词',m:'express delivery; parcel',cn:'快速寄送的物品或相关服务。',l:'HSK 3 · 名词',e:'我的快递已经到了。',col:['取快递','收到快递','快递到了'],examples:['我的快递已经到了。','我下楼去取快递。']},
  '收到':{p:'shōu dào',tr:'收到',pos:'动词',m:'to receive',cn:'得到别人寄来、送来或发来的东西。',l:'HSK 3 · 动词',e:'我收到你的消息了。',col:['收到消息','收到礼物','已经收到'],examples:['我收到你的消息了。','你收到快递了吗？']},
  '楼下':{p:'lóu xià',tr:'樓下',pos:'方位词',m:'downstairs; below the building',cn:'所在楼层的下面，也可以指楼的下面。',l:'HSK 2 · 方位词',e:'快递员在楼下等你。',col:['下楼','在楼下','楼下见'],examples:['快递员在楼下等你。','我们十分钟后楼下见。']},
  '护照':{p:'hù zhào',tr:'護照',pos:'名词',m:'passport',cn:'出入国境时使用的身份证件。',l:'HSK 3 · 名词',e:'我把护照忘在家了。',col:['带护照','检查护照','护照号码'],examples:['我把护照忘在家了。','出发前请检查护照。']},
  '忘记':{p:'wàng jì',tr:'忘記',pos:'动词',m:'to forget',cn:'没有记住，或者没有想起应该做的事。',l:'HSK 3 · 动词',e:'别忘记带护照。',col:['忘记带','忘记时间','差点忘记'],examples:['别忘记带护照。','我忘记会议时间了。']},
  '最近':{p:'zuì jìn',tr:'最近',pos:'时间词',m:'recently; lately',cn:'离现在不远的一段时间。',l:'HSK 3 · 时间词',e:'我最近越来越忙了。',col:['最近几天','最近很忙','最近怎么样'],examples:['我最近越来越忙了。','你最近怎么样？']},
  '越来越':{p:'yuè lái yuè',tr:'越來越',pos:'固定结构',m:'more and more',cn:'表示情况随着时间不断变化。',l:'HSK 3 · 语法结构',e:'天气越来越冷了。',col:['越来越好','越来越忙','越来越喜欢'],examples:['天气越来越冷了。','我越来越喜欢这座城市。']},
  '开会':{p:'kāi huì',tr:'開會',pos:'动词',m:'to have a meeting',cn:'多人集中在一起讨论或决定事情。',l:'HSK 2 · 动词',e:'我们吃完饭以后开会。',col:['参加会议','开会时间','正在开会'],examples:['我们吃完饭以后开会。','经理正在开会。']},
  '虽然':{p:'suī rán',tr:'雖然',pos:'连词',m:'although',cn:'表示承认一种情况，后面常用“但是”说明另一种情况。',l:'HSK 3 · 连词',e:'虽然下雨，但是我们还是去了。',col:['虽然……但是……','虽然很忙','虽然如此'],examples:['虽然下雨，但是我们还是去了。','虽然很累，但是她没有休息。']},
  '除了':{p:'chú le',tr:'除了',pos:'介词',m:'besides; except for',cn:'表示排除某项，或在某项之外还有其他内容。',l:'HSK 3 · 介词',e:'除了咖啡，我也喝茶。',col:['除了……以外','除了他','除了这些'],examples:['除了咖啡，我也喝茶。','除了周末，我每天都上班。']},
  '发现':{p:'fā xiàn',tr:'發現',pos:'动词',m:'to discover; to notice',cn:'看到或知道以前没有注意到的事情。',l:'HSK 3 · 动词',e:'我发现钥匙不见了。',col:['发现问题','突然发现','被发现'],examples:['我发现钥匙不见了。','这个问题很快被他发现了。']},
  '终于':{p:'zhōng yú',tr:'終於',pos:'副词',m:'finally; at last',cn:'经过较长时间或努力以后，某件事最后发生。',l:'HSK 3 · 副词',e:'我终于找到新工作了。',col:['终于找到','终于明白','终于完成'],examples:['我终于找到新工作了。','我们终于完成了这个项目。']},
  '面试':{p:'miàn shì',tr:'面試',pos:'名词 / 动词',m:'interview; to interview',cn:'用当面交谈等方式了解应聘者。',l:'HSK 3 · 名词',e:'我明天要去面试。',col:['参加面试','面试问题','面试成功'],examples:['我明天要去面试。','这次面试很顺利。']},
  '旅行':{p:'lǚ xíng',tr:'旅行',pos:'动词 / 名词',m:'to travel; trip',cn:'为了工作、休息或了解其他地方而外出。',l:'HSK 2 · 动词',e:'如果有时间，我就去旅行。',col:['去旅行','旅行计划','一次旅行'],examples:['如果有时间，我就去旅行。','这是一次很有意思的旅行。']}
};

const courseRows=[
  ['QH-001','HSK 1','你好，我叫 Alex','第一次见面','是；吗；自我介绍','姓名、国家、学生、老师','听姓名与身份','做 20 秒自我介绍','姓名与身份配对'],
  ['QH-002','HSK 1','你是哪国人','认识新同学','哪；谁；疑问句','国家、城市、语言','分辨国家与城市','询问并回答国籍','疑问词选择'],
  ['QH-003','HSK 1','这是我的老师','介绍身边的人','这 / 那；的','家人、朋友、老师','判断人物关系','介绍一个人','的字结构'],
  ['QH-004','HSK 1','现在几点','约定见面时间','几；点；分','时间、上午、下午','听时间选钟表','说出日程时间','时间辨听'],
  ['QH-005','HSK 1','我想喝茶','咖啡店点单','想 + 动词；要','饮料、食物、杯','听顾客点单','完成一次简单点单','想 / 要辨析'],
  ['QH-006','HSK 1','今天星期几','安排一周活动','日期与星期问答','星期、今天、明天','听日期和星期','说本周安排','日期顺序'],
  ['QH-007','HSK 1','我家有三个人','介绍家庭','有；数量 + 量词','家人、数字、个','听家庭成员数量','介绍自己的家','有 / 没有'],
  ['QH-008','HSK 1','我在学校学习','介绍日常地点','在 + 地点 + 动作','学校、公司、学习','听人物在哪里','说自己在哪里做什么','地点与动作搭配'],
  ['QH-009','HSK 1','商店里有苹果','在商店找东西','里 / 上 / 下；有','水果、商店、方位','按描述找物品','询问物品位置','方位词'],
  ['QH-010','HSK 1','明天天气怎么样','查看天气并安排活动','怎么样；很 / 不太','天气、冷、热、下雨','听天气预报要点','描述今天的天气','形容词判断'],
  ['QH-011','HSK 2','我坐地铁上班','早晨通勤','怎么；坐 + 交通工具','地铁、公交、上班','听路线和交通方式','描述上班路线','交通搭配'],
  ['QH-012','HSK 2','这件衣服多少钱','买衣服','多少钱；太……了','颜色、衣服、价格','听价格与尺码','询价并表达评价','数字与价格'],
  ['QH-013','HSK 2','我比你早十分钟','比较到达时间','A 比 B + 形容词','早、晚、高、近','听比较关系','比较两种选择','比较句'],
  ['QH-014','HSK 2','你正在做什么','电话中的即时状态','正在……呢','工作、做饭、看书','判断正在发生的事','说自己此刻在做什么','进行体'],
  ['QH-015','HSK 2','周末一起看电影吧','邀请朋友','一起；吧；可以吗','电影、周末、有空','听邀请与回应','发出并回应邀请','邀请表达'],
  ['QH-016','HSK 2','我已经吃过了','回应吃饭邀请','已经；过','吃饭、饭店、尝试','判断是否有过经历','说做过的三件事','经验体'],
  ['QH-017','HSK 2','离学校远不远','找住处','离；远不远','方向、距离、附近','听位置关系','描述住处位置','距离表达'],
  ['QH-018','HSK 2','因为下雨，所以我没去','解释原因','因为……所以……','天气、计划、原因','听原因与结果','解释计划变化','因果关系'],
  ['QH-019','HSK 2','他唱得很好','评价能力表现','动词 + 得 + 程度','唱歌、运动、快慢','听表现评价','评价自己和朋友','程度补语'],
  ['QH-020','HSK 2','我们去过上海','分享旅行经历','过；还没……过','旅行、城市、景点','判断经历真假','分享一次旅行','经历表达'],
  ['QH-021','HSK 3','我今天迟到了','上课迟到','本来……但是……','迟到、地铁、特别、刚','听出迟到原因','说明计划变化','本来 / 但是'],
  ['QH-022','HSK 3','快递已经到了','下楼取快递','趋向补语：来 / 去 / 上 / 下','快递、收到、楼下','判断人物移动方向','描述取快递过程','趋向补语'],
  ['QH-023','HSK 3','我把护照忘在家了','出门发现遗漏','把字句','护照、忘记、检查','听出物品处理结果','说明物品放在哪里','把字句'],
  ['QH-024','HSK 3','最近越来越忙了','谈论近期变化','越来越……','最近、忙、习惯、变化','识别变化趋势','描述生活变化','越来越'],
  ['QH-025','HSK 3','先吃饭，然后开会','安排工作顺序','先……然后……','开会、准备、顺序','给事件排序','说明一天的安排','顺序连接词'],
  ['QH-026','HSK 3','虽然下雨，但是我们去了','计划不受影响','虽然……但是……','出发、活动、坚持','判断转折信息','表达让步和决定','让步复句'],
  ['QH-027','HSK 3','除了咖啡，我也喝茶','说明范围与补充','除了……以外，也……','饮食、选择、习惯','听出包含与排除','补充个人喜好','除了结构'],
  ['QH-028','HSK 3','这件事被他发现了','描述意外结果','被字句','发现、秘密、结果','判断动作承受者','改写主动与被动句','被字句'],
  ['QH-029','HSK 3','如果有时间，就去旅行','讨论条件计划','如果……就……','假期、旅行、计划','识别条件与结果','说三个条件计划','条件复句'],
  ['QH-030','HSK 3','我终于找到新工作了','分享过程和结果','终于；结果补语','面试、工作、找到','听过程中的转折','讲述完成一件难事','结果表达']
];
const courses=courseRows.map(([id,level,title,scene,grammar,vocab,listening,speaking,review])=>({id,level,title,scene,grammar,vocab,listening,speaking,review,ready:id==='QH-021'}));

let helper=true,phase=0,recording=false,recognition=null,liveTranscript='',recognitionFailed=false,reviewIndex=0;
const wordModal=document.getElementById('wordModal'),courseModal=document.getElementById('courseModal');
const modalWord=document.getElementById('modalWord'),modalPinyin=document.getElementById('modalPinyin'),modalMeaning=document.getElementById('modalMeaning'),modalLevel=document.getElementById('modalLevel'),modalExample=document.getElementById('modalExample'),modalSpeak=document.getElementById('modalSpeak');
const helperSwitch=document.getElementById('helperSwitch'),toast=document.getElementById('toast'),recordBtn=document.getElementById('recordBtn'),recordHint=document.getElementById('recordHint');
const dictInput=document.getElementById('dictInput'),dictWord=document.getElementById('dictWord'),dictPinyin=document.getElementById('dictPinyin'),dictMeaning=document.getElementById('dictMeaning'),dictLevel=document.getElementById('dictLevel'),dictExplain=document.getElementById('dictExplain'),dictTraditional=document.getElementById('dictTraditional'),dictPos=document.getElementById('dictPos'),dictCollocations=document.getElementById('dictCollocations'),dictExamples=document.getElementById('dictExamples'),recentWords=document.getElementById('recentWords');
const pinyinTip=document.getElementById('pinyinTip'),tipWord=document.getElementById('tipWord'),tipPinyin=document.getElementById('tipPinyin');
const speechResult=document.getElementById('speechResult'),speechResultTitle=document.getElementById('speechResultTitle'),speechResultStatus=document.getElementById('speechResultStatus'),speechScore=document.getElementById('speechScore'),speechTranscript=document.getElementById('speechTranscript'),speechFeedback=document.getElementById('speechFeedback');
window.qingheDemoReady=true;

function escapeHtml(value){return String(value).replace(/[&<>'"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c]))}
function showView(id){hidePinyinTip();document.querySelectorAll('.view').forEach(v=>v.classList.toggle('active',v.id===id));document.querySelectorAll('.nav button').forEach(b=>b.classList.toggle('active',b.dataset.view===id));if(id==='learn')showLessonCatalog();window.scrollTo({top:0,behavior:'smooth'})}
document.querySelectorAll('.nav button').forEach(b=>b.addEventListener('click',()=>showView(b.dataset.view)));

function renderCourses(level='全部'){
  const list=level==='全部'?courses:courses.filter(c=>c.level===level);
  document.getElementById('courseGrid').innerHTML=list.map(c=>`<article class="card course-card"><div class="course-card-top"><span class="pill">${c.level}</span><span class="course-number">${c.id}</span></div><h3>${escapeHtml(c.title)}</h3><div class="course-scene">${escapeHtml(c.scene)}</div><div class="course-focus">${escapeHtml(c.grammar)}</div><div class="course-card-actions"><span class="${c.ready?'status-ready':'status-plan'}">${c.ready?'完整示例课':'课程规划'}</span><button class="secondary" onclick="${c.ready?'openCurrentLesson()':`openCoursePreview('${c.id}')`}">${c.ready?'继续课程':'查看预览'}</button></div></article>`).join('');
}
function filterCourses(level,button){document.querySelectorAll('.filter-btn').forEach(b=>b.classList.toggle('active',b===button));renderCourses(level)}
function showLessonCatalog(){document.getElementById('courseCatalog').classList.remove('hidden');document.getElementById('lessonDetail').classList.add('hidden')}
function startLesson(){closeCourseModal();document.getElementById('courseCatalog').classList.add('hidden');document.getElementById('lessonDetail').classList.remove('hidden');setPhase(phase);window.scrollTo({top:0,behavior:'smooth'})}
function openCurrentLesson(){showView('learn');startLesson()}
function openCoursePreview(id){const c=courses.find(x=>x.id===id);if(!c)return;document.getElementById('courseModalLevel').textContent=c.level+' · '+c.id;document.getElementById('courseModalTitle').textContent=c.title;document.getElementById('courseModalScene').textContent=c.scene;document.getElementById('courseModalGrammar').textContent=c.grammar;document.getElementById('courseModalVocab').textContent=c.vocab;document.getElementById('courseModalListening').textContent=c.listening;document.getElementById('courseModalSpeaking').textContent=c.speaking;document.getElementById('courseModalReview').textContent=c.review;const action=document.getElementById('courseModalAction');action.textContent=c.ready?'进入完整课程':'加入学习计划';action.onclick=c.ready?startLesson:()=>{closeCourseModal();toastMsg('已加入学习计划（Demo）')};courseModal.classList.add('show')}
function closeCourseModal(){courseModal.classList.remove('show')}
courseModal.addEventListener('click',e=>{if(e.target===courseModal)closeCourseModal()});

function showPinyinTip(el){const d=words[el.dataset.word];if(!d)return;tipWord.textContent=el.dataset.word;tipPinyin.textContent=d.p;pinyinTip.classList.add('show');pinyinTip.setAttribute('aria-hidden','false');requestAnimationFrame(()=>{const r=el.getBoundingClientRect(),t=pinyinTip.getBoundingClientRect();const left=Math.min(window.innerWidth-t.width-12,Math.max(12,r.left+r.width/2-t.width/2));let top=r.top-t.height-10;if(top<12)top=r.bottom+10;pinyinTip.style.left=left+'px';pinyinTip.style.top=top+'px'})}
function hidePinyinTip(){pinyinTip.classList.remove('show');pinyinTip.setAttribute('aria-hidden','true')}
document.querySelectorAll('.word').forEach(b=>{const d=words[b.dataset.word];if(d)b.setAttribute('aria-label',b.dataset.word+'，拼音 '+d.p);b.addEventListener('pointerenter',e=>{if(e.pointerType==='mouse')showPinyinTip(b)});b.addEventListener('pointerleave',hidePinyinTip);b.addEventListener('focus',()=>showPinyinTip(b));b.addEventListener('blur',hidePinyinTip);b.addEventListener('click',e=>{e.stopPropagation();hidePinyinTip();openWord(b.dataset.word)})});
window.addEventListener('scroll',hidePinyinTip,{passive:true});window.addEventListener('resize',hidePinyinTip);

function openWord(w){const d=words[w];if(!d)return;modalWord.textContent=w;modalPinyin.textContent=d.p;modalMeaning.textContent=d.m;modalLevel.textContent=d.l;modalExample.textContent=d.e;modalSpeak.onclick=()=>speakText(w);wordModal.classList.add('show')}
function closeModal(){wordModal.classList.remove('show')}
wordModal.addEventListener('click',e=>{if(e.target===wordModal)closeModal()});
document.addEventListener('keydown',e=>{if(e.key==='Escape'){closeModal();closeCourseModal()}});
function toggleHelper(){helper=!helper;document.body.classList.toggle('helper-off',!helper);document.querySelectorAll('.switch').forEach(s=>s.classList.toggle('on',helper));toastMsg('中文辅助模式已'+(helper?'开启':'关闭'))}
helperSwitch.onclick=toggleHelper;

function setTheme(name,silent=false){const allowed=['qinghe','mist','tea','wisteria'];if(!allowed.includes(name))name='qinghe';document.body.dataset.theme=name;document.querySelectorAll('.theme-option').forEach(b=>b.classList.toggle('active',b.dataset.themeOption===name));try{localStorage.setItem('qinghe-theme',name)}catch(e){}const colors={qinghe:'#60735a',mist:'#526c7a',tea:'#765f4c',wisteria:'#665f78'};document.querySelector('meta[name="theme-color"]').setAttribute('content',colors[name]);if(!silent)toastMsg('已切换界面配色')}
try{setTheme(localStorage.getItem('qinghe-theme')||'qinghe',true)}catch(e){setTheme('qinghe',true)}

function speakText(text,rate=.88){if('speechSynthesis'in window){speechSynthesis.cancel();const u=new SpeechSynthesisUtterance(text);u.lang='zh-CN';u.rate=rate;speechSynthesis.speak(u);toastMsg(rate<.8?'正在慢速播放':'正在播放普通话')}else toastMsg('当前浏览器不支持语音播放')}
function setPhase(n){phase=Math.max(0,Math.min(5,n));document.querySelectorAll('.phase').forEach((p,i)=>p.classList.toggle('active',i===phase));document.querySelectorAll('.step').forEach((s,i)=>{s.className='step'+(i<phase?' done':i===phase?' current':'')});document.querySelectorAll('.outline-item').forEach((x,i)=>{x.classList.toggle('now',i===phase);x.lastElementChild.textContent=i===phase?'现在':i<phase?'完成':(['约 4 分','约 3 分','约 2 分','约 2 分','总结'][i-1]||'')});window.scrollTo({top:0,behavior:'smooth'})}
function nextPhase(){setPhase(phase+1)}function prevPhase(){setPhase(phase-1)}function restartLesson(){setPhase(0)}
function answerChoice(el,ok){el.parentElement.querySelectorAll('.choice').forEach(x=>x.classList.remove('selected','correct'));el.classList.add(ok?'correct':'selected');const f=el.parentElement.querySelector('.feedback');if(f)f.classList.add('show');toastMsg(ok?'回答正确':'再想一想，可以回到课文看看')}
function answerGrammar(el){el.parentElement.querySelectorAll('.choice').forEach(x=>x.classList.remove('correct'));el.classList.add('correct');toastMsg(el.textContent.startsWith('我本来')?'这个句子很自然':'注意：先说“本来”，再说“但是”')}

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

function normalizeQuery(text){return text.normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/\s+/g,'').toLowerCase()}
function findWord(query){if(words[query])return query;const q=normalizeQuery(query);return Object.keys(words).find(w=>normalizeQuery(words[w].p)===q||normalizeQuery(words[w].p).includes(q))}
function searchDict(){const key=findWord(dictInput.value.trim());if(key)lookupWord(key);else toastMsg('未找到。可试试：本来、快递、护照、终于、旅行')}
function lookupWord(key){const d=words[key];if(!d)return;dictInput.value=key;dictWord.textContent=key;dictPinyin.textContent=d.p;dictMeaning.textContent=d.m;dictLevel.textContent=d.l;dictExplain.textContent=d.cn;dictTraditional.textContent=d.tr||key;dictPos.textContent=d.pos;dictCollocations.replaceChildren(...d.col.map(text=>{const span=document.createElement('span');span.textContent=text;return span}));dictExamples.replaceChildren(...d.examples.map(text=>{const div=document.createElement('div');div.className='example';const span=document.createElement('span');span.textContent=text+' ';const button=document.createElement('button');button.className='speak';button.textContent='🔊';button.setAttribute('aria-label','播放例句');button.onclick=()=>speakText(text);div.append(span,button);return div}));updateRecent(key);toastMsg('已找到“'+key+'”')}
function updateRecent(key){const existing=[...recentWords.querySelectorAll('.recent-word')].map(x=>x.textContent).filter(x=>x!==key);[key,...existing].slice(0,4).forEach((word,i)=>{let span=recentWords.children[i];if(!span){span=document.createElement('span');span.className='recent-word';recentWords.appendChild(span)}span.textContent=word;span.onclick=()=>lookupWord(word)})}
dictInput.addEventListener('keydown',e=>{if(e.key==='Enter')searchDict()});

const shadowingText='我本来想坐地铁，但是今天人特别多。';
function speakShadowing(rate=.82){speakText(shadowingText,rate)}
function setRecording(active){recording=active;recordBtn.classList.toggle('recording',active);recordBtn.setAttribute('aria-pressed',String(active));recordBtn.setAttribute('aria-label',active?'结束跟读':'开始跟读');recordHint.textContent=active?'正在听，请完整读完这句话…':'点击圆形按钮，听到提示后开始跟读'}
function normalizeSpeech(text){return text.replace(/[，。！？、,.!?\s]/g,'')}
function speechSimilarity(a,b){a=normalizeSpeech(a);b=normalizeSpeech(b);if(!a.length||!b.length)return 0;const dp=Array.from({length:a.length+1},(_,i)=>[i]);for(let j=0;j<=b.length;j++)dp[0][j]=j;for(let i=1;i<=a.length;i++)for(let j=1;j<=b.length;j++)dp[i][j]=Math.min(dp[i-1][j]+1,dp[i][j-1]+1,dp[i-1][j-1]+(a[i-1]===b[j-1]?0:1));return Math.max(0,Math.round((1-dp[a.length][b.length]/Math.max(a.length,b.length))*100))}
function feedbackItem(mark,text){const li=document.createElement('li'),icon=document.createElement('i'),span=document.createElement('span');icon.textContent=mark;span.textContent=text;li.append(icon,span);return li}
function showCorrection(text,isDemo=false){const score=speechSimilarity(shadowingText,text);speechResult.classList.add('show');speechResultTitle.textContent=isDemo?'纠错示例':'本次跟读';speechResultStatus.textContent=isDemo?'示例结果，不是你的录音':'浏览器语音识别结果';speechScore.textContent=score;speechTranscript.textContent=text||'没有识别到声音';speechFeedback.replaceChildren();const compact=normalizeSpeech(text);speechFeedback.append(feedbackItem(compact.includes('本来')?'✓':'!',compact.includes('本来')?'“本来”识别清楚，开头很自然。':'开头的“本来”没有识别清楚，试着放慢一点。'));speechFeedback.append(feedbackItem(compact.includes('但是')?'✓':'!',compact.includes('但是')?'转折词“但是”完整，可以在前面稍作停顿。':'“但是”没有识别清楚，注意两个音节都要读出来。'));speechFeedback.append(feedbackItem(compact.includes('特别')?'✓':'!',compact.includes('特别')?'“特别多”表达完整。':'“特别”可能漏读了，请重读“今天人特别多”。'));speechFeedback.append(feedbackItem(score>=88?'✓':'↻',score>=88?'整句节奏稳定，可以进入下一步。':score>=68?'整体已经听懂，再练一次会更自然。':'建议先慢速听一遍，再分成两段跟读。'));speechResult.scrollIntoView({behavior:'smooth',block:'nearest'})}
function showSpeechError(code){setRecording(false);speechResult.classList.add('show');speechResultTitle.textContent='暂时无法识别';speechResultStatus.textContent=code==='not-allowed'?'没有获得麦克风权限':'浏览器未收到清晰语音';speechScore.textContent='--';speechTranscript.textContent=code==='not-allowed'?'请允许麦克风后重试，或先查看纠错示例。':'请靠近麦克风，再完整读一次。';speechFeedback.replaceChildren(feedbackItem('i','你也可以点击“查看纠错示例”，先体验反馈方式。'))}
function toggleRecord(){if(recording){if(recognition)recognition.stop();return}const SpeechRecognition=window.SpeechRecognition||window.webkitSpeechRecognition;if(!SpeechRecognition){toastMsg('当前浏览器不支持实时识别，已打开纠错示例');showCorrectionDemo();return}try{recognition=new SpeechRecognition();recognition.lang='zh-CN';recognition.interimResults=true;recognition.continuous=false;liveTranscript='';recognitionFailed=false;recognition.onstart=()=>{setRecording(true);speechResult.classList.add('show');speechResultTitle.textContent='正在跟读';speechResultStatus.textContent='实时识别中';speechScore.textContent='--';speechTranscript.textContent='正在听……';speechFeedback.replaceChildren()};recognition.onresult=e=>{let finalText='',interimText='';for(let i=e.resultIndex;i<e.results.length;i++){const part=e.results[i][0].transcript;if(e.results[i].isFinal)finalText+=part;else interimText+=part}if(finalText)liveTranscript+=finalText;speechTranscript.textContent=liveTranscript||interimText||'正在听……'};recognition.onerror=e=>{recognitionFailed=true;showSpeechError(e.error)};recognition.onend=()=>{if(recognitionFailed)return;const text=(liveTranscript||speechTranscript.textContent).trim();setRecording(false);if(text&&text!=='正在听……')showCorrection(text);else showSpeechError('no-speech')};recognition.start()}catch(e){recognitionFailed=true;showSpeechError('start-failed')}}
function showCorrectionDemo(){setRecording(false);showCorrection('我本来想坐地铁，但是今天人太多。',true)}
function resetCorrection(){if(recording&&recognition)recognition.stop();setRecording(false);speechResult.classList.remove('show');speechScore.textContent='--';speechTranscript.textContent='正在听……';speechFeedback.replaceChildren();recordBtn.focus()}

function saveWord(){toastMsg('已加入生词本');closeModal()}
function toastMsg(t){toast.textContent=t;toast.classList.add('show');clearTimeout(window._tt);window._tt=setTimeout(()=>toast.classList.remove('show'),1800)}

renderCourses();
