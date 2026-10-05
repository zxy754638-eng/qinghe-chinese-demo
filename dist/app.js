// 青禾中文主逻辑（数据驱动版）
// 数据来源：开放词典数据 + HSK 1–6 共 60 节原创场景课程

const courses=lessons.map(l=>({
  id:l.id,level:l.level,title:l.title,scene:l.scene,
  grammar:l.grammar.name,vocab:l.vocab.join('、'),
  listening:l.listening.q,speaking:'跟读整句',
  review:l.grammar.name+'；'+l.vocab.slice(0,3).join('、'),ready:true,
  syllabusVersion:l.syllabusVersion,topicPath:l.standard?.topicPath||['待归类'],
  task:l.standard?.task||'待补充',skills:l.standard?.skills||[],reviewStatus:l.standard?.reviewStatus||'待审校'
}));

let currentLesson=lessons.find(l=>l.id==='QH-021')||lessons[0];
let shadowingText=currentLesson.shadowing;
let helper=true,phase=0,recording=false,recognition=null,liveTranscript='',recognitionFailed=false,reviewIndex=0;
let learnerIdentity={signedIn:false,name:'Alex',initial:'A'},homeRecommendedLessonId=currentLesson.id;
const wordModal=document.getElementById('wordModal'),courseModal=document.getElementById('courseModal'),dailyGoalModal=document.getElementById('dailyGoalModal');
const modalWord=document.getElementById('modalWord'),modalPinyin=document.getElementById('modalPinyin'),modalMeaning=document.getElementById('modalMeaning'),modalLevel=document.getElementById('modalLevel'),modalExample=document.getElementById('modalExample'),modalSpeak=document.getElementById('modalSpeak');
const helperSwitch=document.getElementById('helperSwitch'),toast=document.getElementById('toast'),recordBtn=document.getElementById('recordBtn'),recordHint=document.getElementById('recordHint');
const dictInput=document.getElementById('dictInput'),dictWord=document.getElementById('dictWord'),dictPinyin=document.getElementById('dictPinyin'),dictMeaning=document.getElementById('dictMeaning'),dictLevel=document.getElementById('dictLevel'),dictExplain=document.getElementById('dictExplain'),dictTraditional=document.getElementById('dictTraditional'),dictPos=document.getElementById('dictPos'),dictCollocations=document.getElementById('dictCollocations'),dictExamples=document.getElementById('dictExamples'),recentWords=document.getElementById('recentWords'),dictResults=document.getElementById('dictResults'),dictStatus=document.getElementById('dictStatus'),dictLoadBtn=document.getElementById('dictLoadBtn'),dictSource=document.getElementById('dictSource');
const pinyinTip=document.getElementById('pinyinTip'),tipWord=document.getElementById('tipWord'),tipPinyin=document.getElementById('tipPinyin');
const speechResult=document.getElementById('speechResult'),speechResultTitle=document.getElementById('speechResultTitle'),speechResultStatus=document.getElementById('speechResultStatus'),speechScore=document.getElementById('speechScore'),speechTranscript=document.getElementById('speechTranscript'),speechFeedback=document.getElementById('speechFeedback');
window.qingheDemoReady=true;

// ---------- 本地学习数据（按设备持久化） ----------
const QINGHE_LEARNING_KEY='qinghe-learning-state-v1';
const DAY_MS=86400000;
function emptyLearningState(){return{version:1,savedWords:[],completedLessons:{},lessonProgress:{},themeProgress:{},reviewQueue:[],activityDates:[],stats:{reviewed:0,correct:0},preferences:{dailyGoalMinutes:15},lastLessonId:null,updatedAt:null}}
function loadLearningState(){
  try{
    const raw=JSON.parse(localStorage.getItem(QINGHE_LEARNING_KEY)||'null');
    if(!raw||typeof raw!=='object')return emptyLearningState();
    const clean=emptyLearningState();
    clean.savedWords=Array.isArray(raw.savedWords)?raw.savedWords.filter(x=>typeof x==='string'):[];
    clean.completedLessons=raw.completedLessons&&typeof raw.completedLessons==='object'?raw.completedLessons:{};
    clean.lessonProgress=raw.lessonProgress&&typeof raw.lessonProgress==='object'?raw.lessonProgress:{};
    clean.themeProgress=raw.themeProgress&&typeof raw.themeProgress==='object'?raw.themeProgress:{};
    clean.reviewQueue=Array.isArray(raw.reviewQueue)?raw.reviewQueue.filter(x=>x&&typeof x.id==='string'):[];
    clean.activityDates=Array.isArray(raw.activityDates)?raw.activityDates.filter(x=>/^\d{4}-\d{2}-\d{2}$/.test(x)):[];
    clean.stats={reviewed:Number(raw.stats?.reviewed)||0,correct:Number(raw.stats?.correct)||0};
    const dailyGoal=Number(raw.preferences?.dailyGoalMinutes);
    clean.preferences={dailyGoalMinutes:Number.isInteger(dailyGoal)&&dailyGoal>=5&&dailyGoal<=180?dailyGoal:15};
    clean.lastLessonId=typeof raw.lastLessonId==='string'?raw.lastLessonId:null;
    clean.updatedAt=raw.updatedAt||null;
    return clean;
  }catch(error){return emptyLearningState()}
}
let learningState=loadLearningState();
if(learningState.lastLessonId){const savedLesson=lessons.find(x=>x.id===learningState.lastLessonId);if(savedLesson){currentLesson=savedLesson;shadowingText=savedLesson.shadowing}}
function localDateKey(date=new Date()){const y=date.getFullYear(),m=String(date.getMonth()+1).padStart(2,'0'),d=String(date.getDate()).padStart(2,'0');return `${y}-${m}-${d}`}
function saveLearningState(){try{learningState.updatedAt=new Date().toISOString();localStorage.setItem(QINGHE_LEARNING_KEY,JSON.stringify(learningState))}catch(error){}}
function dailyGoalMinutes(){const value=Number(learningState.preferences?.dailyGoalMinutes);return Number.isInteger(value)&&value>=5&&value<=180?value:15}
function markLearningActivity(){const key=localDateKey();if(!learningState.activityDates.includes(key)){learningState.activityDates.push(key);learningState.activityDates=learningState.activityDates.slice(-370)}saveLearningState()}
function learningStreak(){const days=new Set(learningState.activityDates),cursor=new Date();let count=0;if(!days.has(localDateKey(cursor)))cursor.setDate(cursor.getDate()-1);while(days.has(localDateKey(cursor))){count++;cursor.setDate(cursor.getDate()-1)}return count}
function learnedWordSet(){const result=new Set(learningState.savedWords);Object.keys(learningState.completedLessons).forEach(id=>{const lesson=lessons.find(x=>x.id===id);lesson?.vocab.forEach(word=>result.add(word))});Object.values(learningState.themeProgress).forEach(progress=>(progress?.reviewed||[]).forEach(word=>result.add(word)));return result}
function dueReviewCount(){const now=Date.now();return learningState.reviewQueue.filter(item=>(Number(item.dueAt)||0)<=now).length}
function addLessonReviewItems(lesson){
  const dueAt=Date.now()+DAY_MS;
  const incoming=[...lesson.vocab.map(word=>({id:'word:'+word,type:'word',value:word,lessonId:lesson.id,dueAt,interval:1,ease:2.5,repetitions:0,lastGrade:null})),{id:'grammar:'+lesson.id,type:'grammar',value:lesson.grammar.name,lessonId:lesson.id,dueAt,interval:1,ease:2.5,repetitions:0,lastGrade:null}];
  const existing=new Set(learningState.reviewQueue.map(x=>x.id));incoming.forEach(item=>{if(!existing.has(item.id))learningState.reviewQueue.push(item)});
}
function completeCurrentLesson(){
  const firstCompletion=!learningState.completedLessons[currentLesson.id];
  learningState.completedLessons[currentLesson.id]=new Date().toISOString();
  learningState.lessonProgress[currentLesson.id]={phase:5,updatedAt:new Date().toISOString()};
  if(firstCompletion)addLessonReviewItems(currentLesson);
  markLearningActivity();saveLearningState();renderLearningState();
}

// ---------- 界面语言（学习内容始终保留中文） ----------
const UI_TEXT=Object.freeze({
  '输入汉字、繁体字、拼音或英文，直接查发音、义项、搭配和例句。':'Search with simplified Chinese, traditional Chinese, pinyin or English to find pronunciation, meanings, collocations and examples.','本来 / 本來 / běn lái / ben3 lai2 / late':'本来 / 本來 / běn lái / ben3 lai2 / late',
  '主要导航':'Main navigation','首页':'Home','学习':'Learn','复习':'Review','词典':'Dictionary','我的':'Profile',
  '中文辅助模式':'Chinese helper mode','切换中文辅助模式':'Toggle Chinese helper mode','开启后，有帮助的词语会显示虚线。鼠标停留看拼音，点击查看完整词卡。':'Helpful words have dotted underlines. Hover to see pinyin, or click for the full word card.',
  '切换界面语言':'Switch interface language','搜索':'Search','通知':'Notifications','HSK 3 · 第 12 周':'HSK 3 · Week 12',
  '下午好，Alex。':'Good afternoon, Alex.','今天也学一点中文吧。':'Let’s learn a little Chinese today.','九月二十九日 · 星期二':'September 29 · Tuesday',
  '今天的学习 · 15 分钟':'Today’s lesson · 15 min','8 个词语 · 1 个语法 · 情境听说':'8 words · 1 grammar point · listening & speaking','继续学习':'Continue',
  '今天需要复习':'Due for review','17 项':'17 items','词语':'Words','语法':'Grammar','听力':'Listening','开始复习':'Start review','本周学习':'This week','4 / 7 天':'4 / 7 days',
  '课程路线':'Learning path','60 节场景课，从 HSK 1 的基础交流逐步过渡到 HSK 6 的观点论证。':'60 scenario-based lessons, from HSK 1 basics to HSK 6 argumentation.','课程等级筛选':'Filter by HSK level','全部':'All','场景课程':'Scenario lessons','每课核心词':'Core words per lesson','初始复习日':'Initial review days',
  '依据 HSK 3.0（2025 大纲）整理':'Aligned to the HSK 3.0 (2025 syllabus)','大纲对齐概览':'Syllabus alignment overview','官方累计词汇目标':'Official cumulative word target','青禾原创课程':'Original Qinghe lessons','能力任务':'Can-do task','话题路径':'Topic path','技能':'Skills','内容状态':'Content status','待审校':'Pending review','大纲映射':'Syllabus mapping','官方大纲目标，青禾原创内容':'Official syllabus goals · original Qinghe content','查看官方大纲':'View official syllabus','当前课程为教学映射，并非官方教材课序。':'These lessons are a teaching alignment, not an official textbook sequence.','当前 60 课是结构化样本，不代表已经覆盖全部大纲词汇。':'The current 60 lessons are a structured sample and do not yet cover the full syllabus vocabulary.','60 节原创场景课，按照 HSK 3.0 的等级目标、话题任务和语言能力方向重新归类。':'60 original scenario lessons reorganized around HSK 3.0 level goals, topic tasks and language skills.','原创场景课程':'Original scenario lessons','累计词汇':'cumulative words','个子话题':'subtopics',
  '拼音发音室':'Pinyin pronunciation lab','从声母、韵母和声调开始，点击卡片听标准普通话示范。':'Start with initials, finals and tones. Select a card to hear a Standard Mandarin model.','声母':'Initials','韵母':'Finals','声调':'Tones','基础单韵母':'Simple finals','复合韵母':'Compound finals','鼻韵母':'Nasal finals','点击任意卡片听发音。先听，再观察口形并模仿。':'Select any card to listen. Listen first, then watch your mouth shape and imitate.','声母不能单独发音；卡片播放“得、特、讷、勒”等教学呼读音。':'Initials cannot be pronounced alone. The cards play conventional teaching syllables such as dé, tè, nè and lè.','播放全部声调':'Play all tones','慢速播放':'Play slowly','听发音示范':'Play pronunciation model','第一声':'Tone 1','第二声':'Tone 2','第三声':'Tone 3','第四声':'Tone 4','轻声':'Neutral tone','发音要点':'Pronunciation tip','双唇音':'Lip sounds','舌尖音':'Tongue-tip sounds','舌根音':'Back-of-tongue sounds','舌面音':'Front-of-tongue sounds','卷舌音':'Retroflex sounds','平舌音':'Dental sibilants',
  '生词本':'Saved words','还没有保存词语':'No saved words yet','在课文或词典里点击词语，再选择“加入生词本”。':'Select a word in a lesson or the dictionary, then choose “Save word.”','移除':'Remove','未开始':'Not started','学习中':'In progress','已完成':'Completed','继续上次学习':'Resume lesson','已保存':'Saved','已从生词本移除':'Removed from saved words','学习数据已保存在当前设备':'Learning data is saved on this device','连续学习 0 天':'0-day streak',
  '学习统计':'Learning statistics','你的课程、复习和正确率都保存在当前设备。':'Your lessons, reviews and accuracy are saved on this device.','连续天数':'Day streak','掌握词数':'Words learned','复习次数':'Reviews','复习正确率':'Review accuracy','暂无记录':'No records yet','到期复习':'Due now','下一次复习':'Next review','暂无复习安排':'No reviews scheduled','课程完成后，新词和语法会自动进入复习队列。':'Finish a lesson to add its words and grammar to the review queue.','今天到期':'Due today','天后':'days','已根据你的选择更新复习时间':'Review time updated from your rating',
  '安装应用':'Install app','当前离线 · 已缓存课程仍可学习':'Offline · cached lessons remain available',
  '完整课程':'Full lesson','进入课程':'Open lesson','返回课程路线':'Back to learning path','听标题':'Play title','预计 15 分钟':'about 15 min',
  '情境':'Context','词汇':'Vocabulary','口语':'Speaking','完成':'Complete','先听一听':'Listen first','先读一遍对话。点击不认识的词语，或者听每一句。':'Read the dialogue once. Click unfamiliar words, or listen sentence by sentence.','播放整段':'Play dialogue','学习词语':'Study vocabulary','今天的词语':'Today’s vocabulary','上一页':'Back','听力练习':'Listening practice',
  '听音辨意':'Listen and choose','播放听力':'Play listening audio','标准速度 · 可重复播放':'Normal speed · Replay anytime','口语练习':'Speaking practice','跟读纠错':'Pronunciation practice','先听，再说':'Listen, then speak','慢速听示范':'Play slow model','开始跟读':'Start speaking','结束跟读':'Stop speaking','查看纠错示例':'View sample feedback','点击圆形按钮，听到提示后开始跟读':'Tap the round button and start speaking after the cue.','正在听，请完整读完这句话…':'Listening — please read the full sentence…','本 Demo 不保存录音；语音识别是否联网由浏览器决定。':'This demo does not save recordings. Your browser controls whether speech recognition uses the internet.',
  '本次跟读':'Your attempt','已完成识别':'Recognition complete','分':'pts','识别到的内容':'Recognized speech','正在听……':'Listening…','重新跟读':'Try again','慢速再听':'Play slowly','说话提示':'Speaking tip','注意句中的短暂停顿。语速不需要太快。':'Pause briefly within the sentence. You do not need to speak too fast.','完成课程':'Finish lesson',
  '课程完成':'Lesson complete','今天学得很好':'Great work today','新词语':'New words','语法点':'Grammar point','学习时间':'Study time','去看看复习安排':'View review schedule','再学一次':'Study again','本课内容':'In this lesson','学习小提示':'Learning tip','在课文里理解词语，比单独背词更容易记住。':'Words are easier to remember when you meet them in context.',
  '现在':'Now','约 4 分':'about 4 min','约 3 分':'about 3 min','约 2 分':'about 2 min','总结':'Summary',
  '今天的复习':'Today’s review','词义、听音、填空和表达会混合出现。':'Meaning, listening, fill-in and speaking tasks are mixed together.','17 项 · 预计 9 分钟':'17 items · about 9 min','间隔重复':'Spaced repetition','先回忆，再看答案':'Recall first, then reveal','答得困难会提前再出现；熟悉的内容会逐步延后。':'Hard items return sooner; familiar items are scheduled later.',
  '词义辨认':'Meaning','中文与英文':'Chinese & English','听音辨词':'Sound to word','标准普通话':'Standard Mandarin','句中填空':'Fill in context','恢复语境':'Recall in context','主动表达':'Active production','使用目标结构':'Use the target pattern','开始混合复习':'Start mixed review','输入你的答案':'Type your answer','复习答案':'Review answer','检查答案':'Check answer','困难 · 明天':'Hard · tomorrow','还好 · 3 天':'Good · 3 days','熟悉 · 7 天':'Easy · 7 days',
  '记忆节奏':'Review rhythm','初始安排来自课程规划，随后根据每次回答调整。':'The initial schedule follows the course plan, then adapts to each answer.','学习':'Study','1 天':'1 day','3 天':'3 days','7 天':'7 days','21 天':'21 days','今天':'Today','明天':'Tomorrow','3 天后':'In 3 days','7 天后':'In 7 days','无需一次全记住。':'You do not need to memorize everything at once.','复习时间由记忆表现决定，不只按固定日期重复。':'Review timing adapts to your memory, rather than repeating on fixed dates only.','本轮完成':'Round complete','4 种练习都做过了':'You completed all four practice types.','系统会根据刚才的难度选择安排下一次出现。':'The next review will be scheduled from the difficulty you chose.','再练一轮':'Practice another round',
  '学习词典':'Learner dictionary','输入汉字、繁体字或拼音，直接查发音、义项、搭配和例句。':'Search with simplified Chinese, traditional Chinese or pinyin to find pronunciation, meanings, collocations and examples.','词典搜索':'Dictionary search','查找':'Search','本地学习词库已可用；完整 CC-CEDICT 已随网站提供':'The local learning dictionary is ready. The complete CC-CEDICT is included with the site.','加载完整词库':'Load full dictionary','正在加载本地 CC-CEDICT 完整词库；首次加载后可离线使用…':'Loading the complete local CC-CEDICT. It will be available offline after the first load…','本地完整词库已加载 · ':'Local full dictionary loaded · ','本地完整词库暂时无法加载；课程词库仍可正常使用':'The local full dictionary could not be loaded. Course entries still work.','完整本地词库已加载':'Full local dictionary loaded','加载失败，请刷新页面后重试':'Loading failed. Refresh the page and try again.','完整词库尚未加载，当前只搜索课程词库':'The full dictionary is not loaded. Searching course entries only.','已加载':'Loaded','重新加载':'Reload','本地开放词条 · 数据来自 ':'Local open entry · Data from ','播放词语发音':'Play word pronunciation','繁体':'Traditional','词性':'Part of speech','常见搭配':'Common collocations','例句':'Examples','播放例句':'Play example','容易混淆':'Often confused','最近查过':'Recent searches','开放数据与许可':'Open data & licenses','青禾中文原创层':'Original Qinghe content','课程词条 · 拼音与英文释义参考':'Course entry · Pinyin and English meanings reference','）· 中文释义、搭配与例句为青禾中文原创':') · Chinese explanations, collocations and examples are original Qinghe content','CC-CEDICT / MDBG 社区词典':'CC-CEDICT / MDBG Community Dictionary','简繁体、数字声调拼音与英文义项；可商用，须署名，并按 CC BY-SA 4.0 分享词典数据的改编。':'Simplified/traditional forms, numbered-tone pinyin and English meanings. Commercial use is allowed with attribution, and dictionary adaptations must be shared under CC BY-SA 4.0.','作为后续单字读音与字形字段补充；Unicode 数据文件采用开放的 Unicode License。':'A future source for character readings and forms. Unicode data files use the open Unicode License.','中文学习释义、HSK 标签、搭配与例句单独审校，不复制商业词典内容。':'Chinese learner definitions, HSK labels, collocations and examples are edited independently without copying commercial dictionaries.',
  '我的学习':'My learning','Alex · 现在学习 HSK 3':'Alex · Currently studying HSK 3','连续学习 12 天':'12-day streak','本月进度':'This month','已学词语':'Words learned','完成课程':'Finish lesson','HSK 3 课程完成 62%':'62% of HSK 3 complete','学习设置':'Learning settings','界面语言':'Interface language','拼音显示':'Pinyin display','悬停 / 点击':'Hover / click','发音速度':'Speech speed','标准 1.0×':'Normal 1.0×','每日目标':'Daily goal','15 分钟':'15 min','设置每日目标':'Set daily goal','学习计划':'Learning plan','选择每天想学习的时间，也可以输入自己的分钟数。':'Choose how long you want to study each day, or enter your own time.','每日目标快捷选项':'Daily goal presets','10 分钟':'10 min','20 分钟':'20 min','30 分钟':'30 min','45 分钟':'45 min','60 分钟':'60 min','自定义时间':'Custom time','分钟 / 天':'min / day','请输入 5–180 分钟。设置会保存在当前设备。':'Enter 5–180 minutes. This setting is saved on this device.','取消':'Cancel','保存目标':'Save goal',
  '界面配色':'Color theme','四套低饱和主题，选择会保存在当前设备。':'Four calm color themes. Your choice is saved on this device.','青禾米绿':'Qinghe Sage','温暖、自然，当前默认':'Warm and natural · default','雾蓝杏仁':'Mist Blue','清爽、安静，适合长时间阅读':'Calm and clear for longer reading','茶棕月白':'Tea Brown','柔和、稳重，纸张感更强':'Soft, grounded and paper-like','紫藤岩灰':'Wisteria Gray','克制、现代，对比柔和':'Modern with gentle contrast',
  '内容体系':'Content system','课程、词典、语音和复习按同一套字段与审校流程组织。':'Lessons, dictionary, audio and review follow one shared content and editorial system.','HSK 1–6 场景课':'HSK 1–6 lessons','单课学习阶段':'Learning stages per lesson','混合复习类型':'Mixed review types','标准与慢速语音':'Normal & slow audio','正式发布前需要完成 HSK 最新大纲校准、母语教师审校、普通话审核，以及词典和音频的版本与许可记录。':'Before launch, content will be aligned to the latest HSK syllabus and reviewed by native teachers and Mandarin specialists, with dictionary and audio licensing records maintained.',
  '打开账户':'Open account','登录':'Sign in','正在检查登录状态':'Checking sign-in status','请稍候……':'Please wait…','青禾中文账户':'Qinghe account','登录后继续学习':'Sign in to continue learning','前往 Authing 安全登录页，使用邮箱或手机号码登录和注册。':'Continue to Authing’s secure page to sign in or register with email or phone.','密码和验证码不会交给青禾中文页面。':'Passwords and verification codes are never shared with the Qinghe page.','微信登录在 Authing 控制台启用后会自动出现在登录页。':'WeChat sign-in will appear after it is enabled in Authing.','当前 Demo 已接入账户身份，云端学习进度同步将在后端数据库接入后启用。':'Accounts are connected. Cloud progress sync will be enabled after a backend database is added.','登录 / 注册':'Sign in / Register','继续即表示你将前往 Authing 完成身份认证。':'Continue to Authing to verify your identity.','我的账户':'My account','学习者':'Learner','已登录':'Signed in','邮箱':'Email','未提供':'Not provided','手机号码':'Phone','账户服务':'Account service','账户已连接。当前 Demo 尚未开启云端学习进度同步。':'Account connected. Cloud progress sync is not enabled in this demo yet.','查看我的学习':'View my learning','退出登录':'Sign out','登录服务暂时不可用':'Sign-in is temporarily unavailable','请稍后重试。':'Please try again later.','重新连接':'Retry','正在完成登录':'Completing sign-in','身份验证成功后会自动返回学习页面。':'You’ll return to the learning page automatically after verification.','账户与登录':'Account & sign-in','未登录':'Not signed in','已连接 Authing':'Authing connected','账号登录已接入；当前 Demo 的学习进度仍保存在本机。':'Account sign-in is connected. Learning progress is still stored on this device in this demo.','管理账户':'Manage account',
  '关闭':'Close','听发音':'Play audio','加入生词本':'Save word','核心语法 / 功能':'Core grammar / function','词汇主题':'Vocabulary theme','听力任务':'Listening task','口语输出':'Speaking output','复习重点：':'Review focus:','返回目录':'Back to catalog','（':'(','已加入生词本':'Saved to your word list','12 分':'12 min'
});
const UI_TEXT_EN_TO_ZH=Object.freeze(Object.fromEntries(Object.entries(UI_TEXT).map(([zh,en])=>[en,zh])));
const UI_SKIP_SELECTOR='script,style,[data-no-ui-translate],.auth-user-data,.learning-quick-nav,.pinyin-symbol,.pinyin-reference,.pinyin-help,.word,.hanzi,.entry-word,.entry-pinyin,.modal-word,.modal-pinyin,.modal-meaning,.theme-study-card,.theme-word-strip,.theme-filter-btn,.theme-deck-title,.theme-deck-en,#dictMeaning,#dictExplain,#dictCollocations,#dictExamples,#recentWords,#dialogueLines,#grammarName,#grammarExplain,#grammarPattern,#grammarExamples,#grammarPractice,#listeningQ,#listeningOptions,#shadowingTarget,#speechTranscript,#reviewQuestion,#reviewOptions,#reviewFeedback,.course-card h3,.course-scene,.course-focus,.course-standard-task,.course-standard-path,#lessonStandard,#courseModalTitle,#courseModalScene,#courseModalGrammar,#courseModalVocab,#courseModalListening,#courseModalSpeaking,#courseModalReview,#courseModalStandard';
let uiLanguage='zh',applyingUiLanguage=false,uiLanguageFrame=0;
try{uiLanguage=localStorage.getItem('qinghe-ui-language')==='en'?'en':'zh'}catch(e){}
function ui(zh,en){return uiLanguage==='en'?en:zh}
function translateUiValue(value){
  const match=String(value).match(/^(\s*)(.*?)(\s*)$/s),core=match?match[2]:String(value);
  const translated=uiLanguage==='en'?UI_TEXT[core]:UI_TEXT_EN_TO_ZH[core];
  return translated===undefined?value:(match?match[1]+translated+match[3]:translated);
}
function shouldSkipUiText(node){const parent=node.parentElement;return !parent||Boolean(parent.closest(UI_SKIP_SELECTOR))}
// 首次应用语言前先记录初始文本：切换时始终从初始文案出发翻译，
// 既避免重复翻译累积出错，也能还原被浏览器“页面翻译”改坏的文字
let uiOriginalText=null,uiOriginalAttrs=null;
function captureUiOriginals(){
  uiOriginalText=new WeakMap();uiOriginalAttrs=new WeakMap();
  const walker=document.createTreeWalker(document.body,NodeFilter.SHOW_TEXT);
  let node;while((node=walker.nextNode()))uiOriginalText.set(node,node.nodeValue);
  document.querySelectorAll('[aria-label],[placeholder],[title]').forEach(el=>{
    const o={};['aria-label','placeholder','title'].forEach(a=>{if(el.hasAttribute(a))o[a]=el.getAttribute(a)});
    uiOriginalAttrs.set(el,o);
  });
}
const UI_EN_MONTHS=['January','February','March','April','May','June','July','August','September','October','November','December'];
const UI_ZH_DAYS=['日','一','二','三','四','五','六'],UI_EN_DAYS=['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
function renderHomeHead(){
  const now=new Date(),h=now.getHours();
  const g=document.getElementById('homeGreeting'),d=document.getElementById('homeDate');
  const name=String(learnerIdentity.name||'Alex').trim()||'Alex';
  if(g)g.textContent=uiLanguage==='en'
    ?(h<12?'Good morning':h<18?'Good afternoon':'Good evening')+', '+name+'.'
    :(h<12?'早上好':h<18?'下午好':'晚上好')+'，'+name+'。';
  if(d)d.textContent=uiLanguage==='en'
    ?(UI_EN_MONTHS[now.getMonth()]+' '+now.getDate()+' · '+UI_EN_DAYS[now.getDay()])
    :((now.getMonth()+1)+'月'+now.getDate()+'日 · 星期'+UI_ZH_DAYS[now.getDay()]);
}
function lastStudiedLesson(){
  const saved=lessons.find(lesson=>lesson.id===learningState.lastLessonId);
  if(saved)return saved;
  const latest=Object.entries(learningState.lessonProgress)
    .filter(([id])=>lessons.some(lesson=>lesson.id===id))
    .sort((a,b)=>new Date(b[1]?.updatedAt||0)-new Date(a[1]?.updatedAt||0))[0];
  return latest?lessons.find(lesson=>lesson.id===latest[0])||null:null;
}
function nextIncompleteLesson(afterLesson){
  if(!lessons.length)return null;
  const start=Math.max(-1,lessons.findIndex(lesson=>lesson.id===afterLesson?.id));
  for(let offset=1;offset<=lessons.length;offset++){
    const lesson=lessons[(start+offset)%lessons.length];
    if(!learningState.completedLessons[lesson.id])return lesson;
  }
  return null;
}
function homeRecommendationState(){
  const fallback=lessons.find(lesson=>lesson.id==='QH-021')||lessons[0];
  const last=lastStudiedLesson(),lastCompleted=Boolean(last&&learningState.completedLessons[last.id]);
  const next=last?nextIncompleteLesson(last):fallback;
  const recommended=(last&&!lastCompleted?last:next)||last||fallback;
  const following=last&&!lastCompleted?nextIncompleteLesson(last):(lastCompleted?next:recommended);
  const completed=Boolean(recommended&&learningState.completedLessons[recommended.id]);
  const phaseValue=Math.max(0,Math.min(5,Number(learningState.lessonProgress[recommended?.id]?.phase)||0));
  const percent=completed?100:Math.round(phaseValue/5*100);
  const level=recommended?.level||last?.level||'HSK 3';
  const levelLessons=lessons.filter(lesson=>lesson.level===level);
  const levelCompleted=levelLessons.filter(lesson=>learningState.completedLessons[lesson.id]).length;
  return {last,lastCompleted,recommended,following,completed,percent,level,levelCompleted,levelTotal:levelLessons.length};
}
function renderHomeRecommendation(){
  const state=homeRecommendationState(),lesson=state.recommended;
  if(!lesson)return state;
  homeRecommendedLessonId=lesson.id;
  renderHomeHead();
  const setText=(id,value)=>{const node=document.getElementById(id);if(node)node.textContent=value};
  const noHistory=!state.last;
  const allComplete=Object.keys(learningState.completedLessons).filter(id=>lessons.some(lesson=>lesson.id===id)).length>=lessons.length;
  const goal=dailyGoalMinutes(),goalText=ui('今日目标 '+goal+' 分钟','Daily goal · '+goal+' min');
  const status=(allComplete?ui('全部完成','All complete')
    :noHistory?ui('为你推荐','Recommended')
    :state.lastCompleted?ui('下一门课程','Next lesson')
    :ui('继续上次学习','Resume last lesson'))+' · '+goalText;
  const action=allComplete?ui('再次学习','Study again')
    :noHistory?ui('开始学习','Start learning')
    :state.lastCompleted?ui('开始下一课','Start next lesson')
    :ui('继续学习','Continue');
  setText('homeRecommendationStatus',status);
  setText('homeCurrentLevel',state.level);
  setText('homeLessonTitle',lesson.title);
  setText('homeLessonMeta',ui(lesson.vocab.length+' 个词语 · 1 个语法 · 情境听说',lesson.vocab.length+' words · 1 grammar point · listening & speaking'));
  setText('homeLastLessonLabel',ui('上次课程','Last lesson'));
  setText('homeLastLesson',state.last?state.last.id+' · '+state.last.title:ui('暂无学习记录','No learning history yet'));
  setText('homeNextLessonLabel',ui('下一门课程','Next lesson'));
  setText('homeNextLesson',state.following?state.following.id+' · '+state.following.title:ui('全部课程已完成','All lessons completed'));
  setText('homeLessonAction',action);
  setText('homeProgressLabel',ui('本课真实进度','Actual lesson progress'));
  setText('homeProgressText',state.percent+'% · '+ui(state.level+' 已完成 '+state.levelCompleted+' / '+state.levelTotal+' 课',state.level+' · '+state.levelCompleted+' / '+state.levelTotal+' lessons'));
  setText('currentLevelLabel',ui(state.level+' · '+state.levelCompleted+' / '+state.levelTotal+' 课',state.level+' · '+state.levelCompleted+' / '+state.levelTotal+' lessons'));
  const card=document.getElementById('homeRecommendation');if(card)card.dataset.mark=(lesson.title.match(/[\u3400-\u9fff]/)||['学'])[0];
  const bar=document.getElementById('homeProgressBar');if(bar){bar.setAttribute('aria-valuenow',String(state.percent));bar.setAttribute('aria-label',ui('本课完成 '+state.percent+'%','Lesson '+state.percent+'% complete'));const fill=bar.querySelector('span');if(fill)fill.style.width=state.percent+'%'}
  const name=String(learnerIdentity.name||'Alex').trim()||'Alex',initial=String(learnerIdentity.initial||name.charAt(0)||'A').toUpperCase();
  setText('profileMainName',name);setText('profileMainAvatar',initial);setText('profileIdentity',ui(name+' · 现在学习 '+state.level,name+' · Currently learning '+state.level));
  return state;
}
function applyUiLanguage(){
  if(applyingUiLanguage)return;applyingUiLanguage=true;
  if(!uiOriginalText)captureUiOriginals();
  document.documentElement.lang=uiLanguage==='en'?'en':'zh-CN';
  document.body.dataset.uiLang=uiLanguage;
  document.title=ui('青禾中文 · HSK 沉浸式学习','Qinghe Chinese · Immersive HSK Learning');
  const walker=document.createTreeWalker(document.body,NodeFilter.SHOW_TEXT);
  let node;
  while((node=walker.nextNode())){
    if(shouldSkipUiText(node))continue;
    if(!uiOriginalText.has(node))uiOriginalText.set(node,node.nodeValue);
    const original=uiOriginalText.get(node),next=translateUiValue(original);
    if(next!==node.nodeValue)node.nodeValue=next;
  }
  document.querySelectorAll('[aria-label],[placeholder],[title]').forEach(el=>['aria-label','placeholder','title'].forEach(attr=>{
    if(!el.hasAttribute(attr))return;
    if(!uiOriginalAttrs.has(el))uiOriginalAttrs.set(el,{});
    const originals=uiOriginalAttrs.get(el);
    if(originals[attr]===undefined)originals[attr]=el.getAttribute(attr);
    const next=translateUiValue(originals[attr]);
    if(next!==el.getAttribute(attr))el.setAttribute(attr,next);
  }));
  document.querySelectorAll('[data-lang-option]').forEach(el=>el.classList.toggle('active',el.dataset.langOption===uiLanguage));
  renderHomeHead();
  const lessonMeta=document.getElementById('lessonMeta');
  if(lessonMeta&&currentLesson)lessonMeta.textContent=currentLesson.level+' · HSK 3.0 · '+currentLesson.scene+' · '+ui('预计 15 分钟','about 15 min');
  renderHSK30Overview();renderLessonStandard(currentLesson);
  const profileStats=document.querySelectorAll('.stat small');if(profileStats[1])profileStats[1].textContent=ui('完成课程','Lessons completed');
  renderOpenDictionaryStatus();
  applyingUiLanguage=false;
}
function scheduleUiLanguage(){cancelAnimationFrame(uiLanguageFrame);uiLanguageFrame=requestAnimationFrame(applyUiLanguage)}
function setUiLanguage(language,silent=false){
  uiLanguage=language==='en'?'en':'zh';
  try{localStorage.setItem('qinghe-ui-language',uiLanguage)}catch(e){}
  applyUiLanguage();
  document.dispatchEvent(new CustomEvent('qinghe:languagechange',{detail:{language:uiLanguage}}));
  if(!silent)toastMsg(ui('界面已切换为中文','Interface switched to English'));
}
function toggleUiLanguage(){setUiLanguage(uiLanguage==='zh'?'en':'zh')}
new MutationObserver(()=>{if(!applyingUiLanguage)scheduleUiLanguage()}).observe(document.body,{subtree:true,childList:true,characterData:true});

function escapeHtml(value){return String(value).replace(/[&<>'"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c]))}
function renderHSK30Overview(){
  const root=document.getElementById('hsk30Overview');if(!root||typeof HSK30_LEVELS==='undefined')return;
  root.setAttribute('data-no-ui-translate','');
  if(root.dataset.footerNote==='true'){
    const levels=HSK30_LEVELS.filter(item=>item.level!=='HSK 7–9');
    root.innerHTML='<p class="syllabus-footer-intro">'+ui('本课程依据已发布的 HSK 3.0（2025 大纲）等级目标、话题任务和语言能力方向整理；课程顺序与教学内容由青禾中文原创。目前 60 课为结构化教学样本，不代表已经覆盖全部大纲词汇；考试实施与等级要求请以官方最新通知为准。','These courses are aligned with the published level goals, topic tasks and language skills in the HSK 3.0 (2025 syllabus). Course sequencing and teaching content are original to Qinghe Chinese. The current 60 lessons are a structured teaching sample and do not yet cover the full syllabus vocabulary; please follow the latest official notices for exam implementation and level requirements.')+'<a class="syllabus-footer-source" href="'+HSK30_META.source+'" target="_blank" rel="noopener">'+ui('查看官方大纲','View official syllabus')+'</a></p><div class="syllabus-footer-levels">'+levels.map(item=>'<span><b>'+item.level+'</b>'+item.words.toLocaleString(uiLanguage==='en'?'en-US':'zh-CN')+' '+ui('累计词汇','cumulative words')+'</span>').join('')+'</div>';
    return;
  }
  root.innerHTML='<div class="syllabus-head"><div><p class="eyebrow">'+ui('依据 HSK 3.0（2025 大纲）整理','Aligned to the HSK 3.0 (2025 syllabus)')+'</p><h2>'+ui('大纲对齐概览','Syllabus alignment overview')+'</h2><p class="sub">'+ui('官方大纲目标，青禾原创内容','Official syllabus goals · original Qinghe content')+'。'+ui('当前课程为教学映射，并非官方教材课序。','These lessons are a teaching alignment, not an official textbook sequence.')+' '+ui('当前 60 课是结构化样本，不代表已经覆盖全部大纲词汇。','The current 60 lessons are a structured sample and do not yet cover the full syllabus vocabulary.')+'</p></div><a class="secondary syllabus-source" href="'+HSK30_META.source+'" target="_blank" rel="noopener">'+ui('查看官方大纲','View official syllabus')+'</a></div><div class="syllabus-level-grid">'+HSK30_LEVELS.filter(item=>item.level!=='HSK 7–9').map(item=>{const lessonCount=lessons.filter(lesson=>lesson.level===item.level).length;return '<article class="syllabus-level"><div class="syllabus-level-top"><strong>'+item.level+'</strong><span>'+escapeHtml(item.stage)+'</span></div><b>'+item.words.toLocaleString(uiLanguage==='en'?'en-US':'zh-CN')+'</b><small>'+ui('累计词汇','cumulative words')+' · '+item.topicCount+' '+ui('个子话题','subtopics')+'</small><p'+(uiLanguage==='en'?' lang="en"':'')+'>'+escapeHtml(uiLanguage==='en'?item.focusEn:item.focus)+'</p><div>'+lessonCount+' '+ui('青禾原创课程','original Qinghe lessons')+'</div></article>'}).join('')+'</div>';
}
function renderLessonStandard(lesson){
  const root=document.getElementById('lessonStandard');if(!root||!lesson)return;const standard=lesson.standard||{};
  root.setAttribute('data-no-ui-translate','');
  root.innerHTML='<p class="eyebrow">HSK 3.0 · '+ui('大纲映射','Syllabus mapping')+'</p><div class="lesson-standard-row"><small>'+ui('话题路径','Topic path')+'</small><strong>'+escapeHtml((standard.topicPath||['待归类']).join(' · '))+'</strong></div><div class="lesson-standard-row"><small>'+ui('能力任务','Can-do task')+'</small><span>'+escapeHtml(standard.task||'待补充')+'</span></div><div class="lesson-standard-meta"><span>'+ui('技能','Skills')+' · '+escapeHtml((standard.skills||[]).join(' / '))+'</span></div>';
}
function showView(id){hidePinyinTip();document.querySelectorAll('.view').forEach(v=>{const active=v.id===id;v.classList.toggle('active',active);v.hidden=!active});document.querySelectorAll('.nav button').forEach(b=>b.classList.toggle('active',b.dataset.view===id));if(id==='learn')showLessonCatalog();window.scrollTo({top:0,behavior:'smooth'})}
document.querySelectorAll('.nav button').forEach(b=>b.addEventListener('click',()=>showView(b.dataset.view)));

const modalFocusOrigins=new WeakMap(),modalStack=[],focusableSelector='button:not([disabled]),a[href],input:not([disabled]),select:not([disabled]),textarea:not([disabled]),[tabindex]:not([tabindex="-1"])';
function visibleModalControls(modal){return [...modal.querySelectorAll(focusableSelector)].filter(element=>element.offsetParent!==null)}
function setModalBackgroundBlocked(blocked){const app=document.querySelector('.app');if(!app)return;if(blocked)app.setAttribute('inert','');else app.removeAttribute('inert')}
function syncModalLayers(){const open=modalStack.filter(modal=>modal.classList.contains('show')),active=open.at(-1);open.forEach(modal=>{const background=modal!==active;modal.toggleAttribute('inert',background);modal.setAttribute('aria-hidden',String(background))})}
function openManagedModal(modal,initialSelector){
  if(!modal)return;if(!modal.classList.contains('show'))modalFocusOrigins.set(modal,document.activeElement);const previous=modalStack.indexOf(modal);if(previous>=0)modalStack.splice(previous,1);modalStack.push(modal);modal.dataset.focusManaged='app';modal.setAttribute('aria-hidden','false');modal.classList.add('show');setModalBackgroundBlocked(true);syncModalLayers();
  setTimeout(()=>{const target=(initialSelector&&modal.querySelector(initialSelector))||visibleModalControls(modal)[0]||modal.querySelector('.modal');if(target){if(!target.matches(focusableSelector))target.tabIndex=-1;target.focus()}},0);
}
function closeManagedModal(modal){
  if(!modal||!modal.classList.contains('show'))return;const origin=modalFocusOrigins.get(modal),stackIndex=modalStack.indexOf(modal);if(stackIndex>=0)modalStack.splice(stackIndex,1);modal.classList.remove('show');modal.removeAttribute('inert');modal.setAttribute('aria-hidden','true');delete modal.dataset.focusManaged;modalFocusOrigins.delete(modal);syncModalLayers();if(!document.querySelector('.modal-wrap.show'))setModalBackgroundBlocked(false);if(origin instanceof HTMLElement&&origin.isConnected)setTimeout(()=>origin.focus(),0)
}
function closeActiveModal(modal){if(!modal)return;if(modal.id==='wordModal')closeModal();else if(modal.id==='courseModal')closeCourseModal();else if(modal.id==='dailyGoalModal')closeDailyGoalModal();else if(modal.id==='themedVocabModal')closeThemedDeck();else if(modal.id==='accountModal'&&typeof window.closeAccountModal==='function')window.closeAccountModal()}
const modalObserver=new MutationObserver(records=>records.forEach(record=>{const modal=record.target;if(!(modal instanceof HTMLElement)||!modal.classList.contains('modal-wrap'))return;if(modal.classList.contains('show')&&!modal.dataset.focusManaged){modal.dataset.focusManaged='external';modalFocusOrigins.set(modal,document.activeElement);const previous=modalStack.indexOf(modal);if(previous>=0)modalStack.splice(previous,1);modalStack.push(modal);modal.setAttribute('aria-hidden','false');setModalBackgroundBlocked(true);syncModalLayers();setTimeout(()=>{const target=visibleModalControls(modal)[0]||modal.querySelector('.modal');if(target){if(!target.matches(focusableSelector))target.tabIndex=-1;target.focus()}},0)}else if(!modal.classList.contains('show')&&modal.dataset.focusManaged==='external'){const origin=modalFocusOrigins.get(modal),stackIndex=modalStack.indexOf(modal);if(stackIndex>=0)modalStack.splice(stackIndex,1);modal.removeAttribute('inert');modal.setAttribute('aria-hidden','true');delete modal.dataset.focusManaged;modalFocusOrigins.delete(modal);syncModalLayers();if(!document.querySelector('.modal-wrap.show'))setModalBackgroundBlocked(false);if(origin instanceof HTMLElement&&origin.isConnected)setTimeout(()=>origin.focus(),0)}}));
modalObserver.observe(document.body,{subtree:true,childList:true,attributes:true,attributeFilter:['class']});

// ---------- 学习页快捷导航 ----------
function ensureLearningQuickNav(){
  let nav=document.getElementById('learningQuickNav');if(nav)return nav;
  const catalog=document.getElementById('courseCatalog');if(!catalog)return null;
  nav=document.createElement('nav');nav.id='learningQuickNav';nav.className='card learning-quick-nav';nav.setAttribute('data-no-ui-translate','');
  nav.innerHTML='<button class="learning-quick-btn" type="button" data-learning-section="themed" onclick="openLearningSection(\'themed\')"><span class="learning-quick-icon">词</span><strong></strong><small></small></button><button class="learning-quick-btn" type="button" data-learning-section="pinyin" onclick="openLearningSection(\'pinyin\')"><span class="learning-quick-icon">音</span><strong></strong><small></small></button><button class="learning-quick-btn" type="button" data-learning-section="courses" onclick="openLearningSection(\'courses\')"><span class="learning-quick-icon">课</span><strong></strong><small></small></button>';
  catalog.insertBefore(nav,catalog.firstChild);renderLearningQuickNav();return nav;
}
function renderLearningQuickNav(){
  const nav=ensureLearningQuickNav();if(!nav)return;
  nav.setAttribute('aria-label',ui('学习内容快捷入口','Study shortcuts'));
  const copy={themed:[ui('分类背词','Vocabulary decks'),ui('按主题和词性学习','Learn by theme and type')],pinyin:[ui('拼音库','Pinyin lab'),ui('声母、韵母和声调','Initials, finals and tones')],courses:[ui('课程路线','Course path'),ui('浏览 HSK 1–6 课程','Browse HSK 1–6 lessons')]};
  nav.querySelectorAll('.learning-quick-btn').forEach(button=>{const text=copy[button.dataset.learningSection];button.querySelector('strong').textContent=text[0];button.querySelector('small').textContent=text[1];button.setAttribute('aria-label',text.join('：'))});
}
function scrollToLearningTarget(target){setTimeout(()=>target?.scrollIntoView({behavior:'smooth',block:'start'}),80)}
function openLearningSection(section){
  showView('learn');showLessonCatalog();ensureLearningQuickNav();ensureThemedVocabularySection();ensurePinyinLab();
  document.querySelectorAll('.learning-quick-btn').forEach(button=>button.classList.toggle('active',button.dataset.learningSection===section));
  let target=document.querySelector('#courseCatalog .catalog-head');
  if(section==='themed')target=document.getElementById('themedVocabulary');
  if(section==='pinyin'){target=document.getElementById('pinyinLab');target?.classList.remove('hidden-by-filter')}
  scrollToLearningTarget(target);
}
function openLevelPath(level){
  showView('learn');showLessonCatalog();ensureLearningQuickNav();
  const button=[...document.querySelectorAll('.level-filters .filter-btn')].find(item=>item.dataset.level===level);
  filterCourses(level,button);document.querySelectorAll('.learning-quick-btn').forEach(item=>item.classList.toggle('active',item.dataset.learningSection==='courses'));
  scrollToLearningTarget(document.querySelector('#courseCatalog .catalog-head'));
}

// ---------- HSK 1 拼音发音室 ----------
const PINYIN_INITIALS=[
  {s:'b',p:'bō',a:'玻',tip:'双唇闭合，不送气'},{s:'p',p:'pō',a:'坡',tip:'双唇闭合，明显送气'},{s:'m',p:'mō',a:'摸',tip:'双唇闭合，气流从鼻腔出来'},{s:'f',p:'fó',a:'佛',tip:'上齿轻触下唇'},
  {s:'d',p:'dé',a:'得',tip:'舌尖抵住上齿龈，不送气'},{s:'t',p:'tè',a:'特',tip:'舌尖抵住上齿龈，送气'},{s:'n',p:'nè',a:'讷',tip:'舌尖抵住上齿龈，气流走鼻腔'},{s:'l',p:'lè',a:'勒',tip:'舌尖抵住上齿龈，气流从舌侧通过'},
  {s:'g',p:'gē',a:'哥',tip:'舌根抬起，不送气'},{s:'k',p:'kē',a:'科',tip:'舌根抬起，送气'},{s:'h',p:'hē',a:'喝',tip:'舌根靠近软腭，留出摩擦通道'},
  {s:'j',p:'jī',a:'鸡',tip:'舌面前部贴近硬腭，不送气'},{s:'q',p:'qī',a:'七',tip:'舌面前部贴近硬腭，送气'},{s:'x',p:'xī',a:'西',tip:'舌面前部接近硬腭，持续摩擦'},
  {s:'zh',p:'zhī',a:'知',tip:'舌尖卷起，不送气'},{s:'ch',p:'chī',a:'吃',tip:'舌尖卷起，送气'},{s:'sh',p:'shī',a:'师',tip:'舌尖卷起，持续摩擦'},{s:'r',p:'rì',a:'日',tip:'舌尖卷起，声带振动'},
  {s:'z',p:'zī',a:'资',tip:'舌尖平伸，不送气'},{s:'c',p:'cí',a:'雌',tip:'舌尖平伸，送气'},{s:'s',p:'sī',a:'思',tip:'舌尖平伸，持续摩擦'}
];
const PINYIN_FINAL_GROUPS=[
  {title:'基础单韵母',items:[{s:'a',p:'ā',a:'啊'},{s:'o',p:'ō',a:'哦'},{s:'e',p:'é',a:'鹅'},{s:'i',p:'yī',a:'衣'},{s:'u',p:'wū',a:'乌'},{s:'ü',p:'yū',a:'迂'}]},
  {title:'复合韵母',items:[{s:'ai',p:'āi',a:'哎'},{s:'ei',p:'ēi',a:'欸'},{s:'ao',p:'áo',a:'熬'},{s:'ou',p:'ōu',a:'欧'},{s:'ia',p:'yā',a:'鸭'},{s:'ie',p:'yē',a:'椰'},{s:'ua',p:'wā',a:'蛙'},{s:'uo',p:'wō',a:'窝'},{s:'üe',p:'yuē',a:'约'},{s:'iao',p:'yāo',a:'腰'},{s:'iu',p:'yōu',a:'优'},{s:'uai',p:'wāi',a:'歪'},{s:'ui',p:'wēi',a:'威'}]},
  {title:'鼻韵母',items:[{s:'an',p:'ān',a:'安'},{s:'en',p:'ēn',a:'恩'},{s:'in',p:'yīn',a:'音'},{s:'un',p:'wēn',a:'温'},{s:'ün',p:'yún',a:'云'},{s:'ang',p:'áng',a:'昂'},{s:'eng',p:'dēng',a:'灯'},{s:'ing',p:'yīng',a:'英'},{s:'ong',p:'wēng',a:'翁'},{s:'iang',p:'yāng',a:'央'},{s:'uang',p:'wāng',a:'汪'},{s:'iong',p:'yōng',a:'雍'}]}
];
const PINYIN_TONES=[
  {s:'mā',p:'第一声',a:'妈',shape:'55  ˉ  高而平'},{s:'má',p:'第二声',a:'麻',shape:'35  ˊ  由中到高'},{s:'mǎ',p:'第三声',a:'马',shape:'214  ˇ  先降后升'},{s:'mà',p:'第四声',a:'骂',shape:'51  ˋ  由高到低'},{s:'ma',p:'轻声',a:'吗',shape:'·  短而轻'}
];
let pinyinMode='initials',lastPinyinSample={a:'妈',s:'mā'};

function ensurePinyinLab(){
  if(document.getElementById('pinyinLab'))return;
  const summary=document.querySelector('#courseCatalog .course-summary');
  if(!summary)return;
  const lab=document.createElement('section');
  lab.id='pinyinLab';lab.className='card pinyin-lab';
  lab.innerHTML='<div class="pinyin-lab-head"><div><span class="pinyin-lab-badge">HSK 1 · 拼音</span><h2>拼音发音室</h2><p class="sub">从声母、韵母和声调开始，点击卡片听标准普通话示范。</p></div><div class="pinyin-mini-actions"><button class="secondary" type="button" onclick="playPinyinToneSeries()">播放全部声调</button><button class="secondary" type="button" onclick="repeatLastPinyin()">慢速播放</button></div></div><div class="pinyin-lab-body"><div class="pinyin-tabs" role="tablist" aria-label="拼音分类"><button class="pinyin-tab active" type="button" data-pinyin-mode="initials" onclick="renderPinyinLab(\'initials\')">声母</button><button class="pinyin-tab" type="button" data-pinyin-mode="finals" onclick="renderPinyinLab(\'finals\')">韵母</button><button class="pinyin-tab" type="button" data-pinyin-mode="tones" onclick="renderPinyinLab(\'tones\')">声调</button></div><div id="pinyinLabContent"></div><p class="pinyin-help">点击任意卡片听发音。先听，再观察口形并模仿。</p></div>';
  summary.insertAdjacentElement('afterend',lab);
  renderPinyinLab('initials');
}
function pinyinButton(item,tone=false){
  const label=ui(`听发音示范：${item.s}，${item.a}`,`Play pronunciation model: ${item.s}, ${item.a}`);
  return `<button class="pinyin-sound${tone?' tone-card':''}" type="button" aria-label="${escapeHtml(label)}" onclick="speakPinyinSample('${escapeHtml(item.a)}','${escapeHtml(item.s)}',this)"><span class="pinyin-symbol">${escapeHtml(item.s)}</span>${tone?`<span class="tone-shape">${escapeHtml(item.shape)}</span>`:''}<span class="pinyin-reference"><strong>${escapeHtml(item.a)}</strong><small>${escapeHtml(item.p)}</small><span class="pinyin-play">🔊</span></span></button>`;
}
function renderPinyinLab(mode='initials'){
  pinyinMode=mode;
  const root=document.getElementById('pinyinLabContent');if(!root)return;
  document.querySelectorAll('[data-pinyin-mode]').forEach(b=>{const active=b.dataset.pinyinMode===mode;b.classList.toggle('active',active);b.setAttribute('aria-selected',String(active))});
  if(mode==='initials')root.innerHTML='<div class="pinyin-group-title"><h3>声母</h3><span class="sub">21 个</span></div><div class="pinyin-grid">'+PINYIN_INITIALS.map(x=>pinyinButton(x)).join('')+'</div><p class="pinyin-help">'+escapeHtml(ui('声母不能单独发音；卡片播放“得、特、讷、勒”等教学呼读音。','Initials cannot be pronounced alone. The cards play conventional teaching syllables such as dé, tè, nè and lè.'))+'</p>';
  else if(mode==='finals')root.innerHTML=PINYIN_FINAL_GROUPS.map(g=>'<section style="margin-bottom:22px"><div class="pinyin-group-title"><h3>'+g.title+'</h3><span class="sub">'+g.items.length+' 个</span></div><div class="pinyin-grid">'+g.items.map(x=>pinyinButton(x)).join('')+'</div></section>').join('');
  else root.innerHTML='<div class="pinyin-group-title"><h3>声调</h3><span class="sub">mā · má · mǎ · mà · ma</span></div><div class="pinyin-grid tone-grid">'+PINYIN_TONES.map(x=>pinyinButton(x,true)).join('')+'</div>';
  scheduleUiLanguage();
}
function speakPinyinSample(audio,symbol,button,rate=.76){
  lastPinyinSample={a:audio,s:symbol};
  document.querySelectorAll('.pinyin-sound.playing').forEach(x=>x.classList.remove('playing'));
  if(button){button.classList.add('playing');setTimeout(()=>button.classList.remove('playing'),1200)}
  speakText(audio,rate);
}
function repeatLastPinyin(){speakPinyinSample(lastPinyinSample.a,lastPinyinSample.s,null,.62)}
function playPinyinToneSeries(){lastPinyinSample={a:'妈，麻，马，骂，吗',s:'mā má mǎ mà ma'};speakText(lastPinyinSample.a,.7)}

function ensureWordbookCard(){
  if(document.getElementById('wordbookCard'))return;
  const grid=document.querySelector('#profile .profile-grid');if(!grid)return;
  const card=document.createElement('article');card.id='wordbookCard';card.className='card wordbook-card';
  card.innerHTML='<div class="wordbook-head"><div><h3>生词本</h3><p class="sub">学习数据已保存在当前设备</p></div><div class="wordbook-count" id="wordbookCount">0</div></div><div id="wordbookList"></div>';
  const theme=grid.querySelector('.theme-card');grid.insertBefore(card,theme||null);
}
function ensureLearningStatsCard(){
  if(document.getElementById('learningStatsCard'))return;
  const grid=document.querySelector('#profile .profile-grid');if(!grid)return;
  const card=document.createElement('article');card.id='learningStatsCard';card.className='card learning-stats-card';
  card.innerHTML='<h3 id="learningStatsTitle"></h3><p class="sub" id="learningStatsNote"></p><div class="learning-metrics"><div class="learning-metric"><b id="metricStreak">0</b><small id="metricStreakLabel"></small></div><div class="learning-metric"><b id="metricWords">0</b><small id="metricWordsLabel"></small></div><div class="learning-metric"><b id="metricReviews">0</b><small id="metricReviewsLabel"></small></div><div class="learning-metric"><b id="metricAccuracy">—</b><small id="metricAccuracyLabel"></small><div class="accuracy-track"><span id="metricAccuracyBar"></span></div></div></div>';
  const wordbook=grid.querySelector('#wordbookCard');grid.insertBefore(card,wordbook||grid.querySelector('.theme-card')||null);
}
function renderLearningStats(){
  ensureLearningStatsCard();const reviewed=learningState.stats.reviewed,accuracy=reviewed?Math.round(learningState.stats.correct/reviewed*100):0;
  document.getElementById('learningStatsTitle').textContent=ui('学习统计','Learning statistics');document.getElementById('learningStatsNote').textContent=ui('你的课程、复习和正确率都保存在当前设备。','Your lessons, reviews and accuracy are saved on this device.');
  document.getElementById('metricStreak').textContent=learningStreak();document.getElementById('metricWords').textContent=learnedWordSet().size;document.getElementById('metricReviews').textContent=reviewed;document.getElementById('metricAccuracy').textContent=reviewed?accuracy+'%':'—';document.getElementById('metricAccuracyBar').style.width=accuracy+'%';
  document.getElementById('metricStreakLabel').textContent=ui('连续天数','Day streak');document.getElementById('metricWordsLabel').textContent=ui('掌握词数','Words learned');document.getElementById('metricReviewsLabel').textContent=ui('复习次数','Reviews');document.getElementById('metricAccuracyLabel').textContent=ui('复习正确率','Review accuracy');
}
function renderWordbook(){
  ensureWordbookCard();const root=document.getElementById('wordbookList'),count=document.getElementById('wordbookCount');if(!root||!count)return;
  count.textContent=learningState.savedWords.length;
  if(!learningState.savedWords.length){root.innerHTML='<div class="wordbook-empty"><strong>'+ui('还没有保存词语','No saved words yet')+'</strong><br><span>'+ui('在课文或词典里点击词语，再选择“加入生词本”。','Select a word in a lesson or the dictionary, then choose “Save word.”')+'</span></div>';return}
  root.innerHTML='<div class="wordbook-list">'+learningState.savedWords.map(word=>{const data=words[word];return '<div class="wordbook-item"><button class="wordbook-word" type="button" onclick="openWord(\''+escapeHtml(word)+'\')">'+escapeHtml(word)+(data?' · '+escapeHtml(data.p):'')+'</button><button class="wordbook-remove" type="button" aria-label="'+ui('移除','Remove')+' '+escapeHtml(word)+'" onclick="removeSavedWord(\''+escapeHtml(word)+'\')">×</button></div>'}).join('')+'</div>';
}
function removeSavedWord(word){learningState.savedWords=learningState.savedWords.filter(x=>x!==word);saveLearningState();renderWordbook();toastMsg(ui('已从生词本移除','Removed from saved words'))}
function renderLearningState(){
  ensureLearningQuickNav();renderLearningQuickNav();ensureWordbookCard();renderWordbook();renderLearningStats();renderDailyGoalSetting();renderThemedDecks();
  const learned=learnedWordSet().size,completed=Object.keys(learningState.completedLessons).length,streak=learningStreak(),reviewed=learningState.stats.reviewed,due=dueReviewCount();
  const stats=document.querySelectorAll('#profile .stats .stat b');if(stats[0])stats[0].textContent=learned;if(stats[1])stats[1].textContent=completed;if(stats[2])stats[2].textContent=((completed*12+reviewed*2)/60).toFixed(1)+'h';
  const streakPill=document.querySelector('#profile .profile-top .pill');if(streakPill)streakPill.textContent=ui('连续学习 '+streak+' 天',streak+'-day streak');
  const homeState=renderHomeRecommendation(),levelPercent=Math.round(homeState.levelCompleted/Math.max(1,homeState.levelTotal)*100);
  const progress=document.querySelector('#profile .progressline span');if(progress)progress.style.width=levelPercent+'%';
  const progressText=document.getElementById('profileLevelProgress');if(progressText)progressText.textContent=ui(homeState.level+' 课程完成 '+levelPercent+'%',levelPercent+'% of '+homeState.level+' complete');
  const reviewPill=document.querySelector('#review .section-head .pill');if(reviewPill)reviewPill.textContent=ui(due+' 项 · 预计 '+Math.max(1,Math.ceil(due*.55))+' 分钟',due+' items · about '+Math.max(1,Math.ceil(due*.55))+' min');
  const ring=document.querySelector('#review .ring');if(ring)ring.style.setProperty('--review-count','"'+due+'"');
  const homeReview=document.querySelector('#home .review-card h3 span');if(homeReview)homeReview.textContent=ui(due+' 项',due+' items');
  const homeCounts=document.querySelectorAll('#home .review-counts .count b');if(homeCounts[0])homeCounts[0].textContent=learningState.reviewQueue.filter(x=>x.type==='word'&&(Number(x.dueAt)||0)<=Date.now()).length;if(homeCounts[1])homeCounts[1].textContent=learningState.reviewQueue.filter(x=>x.type==='grammar'&&(Number(x.dueAt)||0)<=Date.now()).length;if(homeCounts[2])homeCounts[2].textContent=due;
  const monday=new Date();monday.setHours(12,0,0,0);monday.setDate(monday.getDate()-((monday.getDay()+6)%7));let activeWeekDays=0;document.querySelectorAll('#home .week .bar').forEach((bar,index)=>{const day=new Date(monday);day.setDate(monday.getDate()+index);const active=learningState.activityDates.includes(localDateKey(day));if(active)activeWeekDays++;bar.classList.toggle('done',active);bar.style.setProperty('--h',active?(52+(index%3)*12)+'%':'12%')});const weekText=document.querySelector('#home .week-card h3 .sub');if(weekText)weekText.textContent=ui(activeWeekDays+' / 7 天',activeWeekDays+' / 7 days');
  renderReviewSchedule();
  renderCourses(document.querySelector('.level-filters .filter-btn.active')?.dataset.level||'全部');
  scheduleUiLanguage();
}

// ---------- 主题分类背词 ----------
let themedDomainFilter='all',themedDeckFilter='all',themedDeckVisibleCount=12,activeThemedDeckId=null,activeThemedIndex=0,themedDeckComplete=false;
function themedDeckById(id){return typeof themedVocabularyDecks==='undefined'?null:themedVocabularyDecks.find(deck=>deck.id===id)}
function readThemedProgress(id){const raw=learningState.themeProgress?.[id]||{};return{reviewed:Array.isArray(raw.reviewed)?raw.reviewed:[],difficult:Array.isArray(raw.difficult)?raw.difficult:[],lastIndex:Number.isInteger(raw.lastIndex)?raw.lastIndex:0,completedAt:raw.completedAt||null}}
function writeThemedProgress(id){if(!learningState.themeProgress)learningState.themeProgress={};const current=readThemedProgress(id);learningState.themeProgress[id]=current;return current}
function ensureThemedVocabularySection(){
  if(typeof themedVocabularyDecks==='undefined'||document.getElementById('themedVocabulary'))return;
  const catalog=document.getElementById('courseCatalog');if(!catalog)return;
  const section=document.createElement('section');section.id='themedVocabulary';section.className='card themed-vocab';section.setAttribute('data-no-ui-translate','');
  section.innerHTML='<div class="themed-vocab-head"><div><p class="eyebrow" id="themedVocabEyebrow"></p><h2 id="themedVocabTitle"></h2><p class="sub" id="themedVocabIntro"></p></div><div class="theme-library-summary" id="themeLibrarySummary"></div></div><div class="themed-filter-stack"><div class="themed-filter-row"><span class="themed-filter-label" id="themedDomainLabel"></span><div class="themed-domain-filter" id="themedDomainFilter" role="group"></div></div><div class="themed-filter-row"><span class="themed-filter-label" id="themedPosLabel"></span><div class="themed-filter" id="themedFilter" role="group"></div></div></div><div class="theme-deck-grid" id="themeDeckGrid"></div><div class="theme-deck-more-wrap" id="themeDeckMoreWrap"><button class="secondary theme-deck-more" id="themeDeckMore" type="button" onclick="showMoreThemedDecks()"></button></div>';
  const quick=ensureLearningQuickNav();quick?quick.insertAdjacentElement('afterend',section):catalog.insertBefore(section,catalog.firstChild);ensureThemedVocabularyModal();renderThemedDecks();
}
function ensureThemedVocabularyModal(){
  if(document.getElementById('themedVocabModal'))return;
  const wrap=document.createElement('div');wrap.className='modal-wrap';wrap.id='themedVocabModal';wrap.setAttribute('role','dialog');wrap.setAttribute('aria-modal','true');wrap.setAttribute('aria-labelledby','themedDeckTitle');
  wrap.innerHTML='<div class="modal themed-study-modal"><button class="close" type="button" onclick="closeThemedDeck()" aria-label="关闭">×</button><div id="themedStudyContent"></div></div>';
  wrap.setAttribute('aria-hidden','true');wrap.addEventListener('click',event=>{if(event.target===wrap)closeThemedDeck()});document.body.appendChild(wrap);
}
function renderThemedDecks(){
  const grid=document.getElementById('themeDeckGrid');if(!grid||typeof themedVocabularyDecks==='undefined')return;
  document.getElementById('themedVocabEyebrow').textContent=ui('分类背词','Vocabulary decks');
  document.getElementById('themedVocabTitle').textContent=ui('青禾主题词库','Qinghe themed vocabulary');
  document.getElementById('themedVocabIntro').textContent=ui('从日常沟通逐步走向学习、职场和专业话题；每个词都配有中文、带声调拼音、英文和原创例句。','Move from everyday communication to study, work and specialist topics. Every word includes Chinese, tone-marked pinyin, English and an original example.');
  const domainFilter=document.getElementById('themedDomainFilter'),domains=typeof themedVocabularyDomains==='undefined'?[{id:'all',title:'全部领域',titleEn:'All areas'}]:themedVocabularyDomains;
  document.getElementById('themedDomainLabel').textContent=ui('学习领域','Area');
  domainFilter.setAttribute('aria-label',ui('按学习领域筛选','Filter by learning area'));
  domainFilter.innerHTML=domains.map(domain=>'<button class="theme-domain-btn'+(themedDomainFilter===domain.id?' active':'')+'" type="button" onclick="filterThemedDomain(\''+escapeHtml(domain.id)+'\')"><span>'+escapeHtml(ui(domain.title,domain.titleEn))+'</span></button>').join('');
  const filter=document.getElementById('themedFilter');filter.setAttribute('aria-label',ui('按词性筛选','Filter by part of speech'));
  document.getElementById('themedPosLabel').textContent=ui('词语类型','Word type');
  const filters=[['all','全部','All'],['noun','名词','Nouns'],['verb','动词','Verbs'],['adjective','形容词','Adjectives'],['adverb','副词','Adverbs'],['measure','量词','Measure words'],['conjunction','连词','Conjunctions']];
  filter.innerHTML=filters.map(([id,zh,en])=>'<button class="theme-filter-btn'+(themedDeckFilter===id?' active':'')+'" type="button" onclick="filterThemedDecks(\''+id+'\')">'+escapeHtml(ui(zh,en))+'</button>').join('');
  const decks=themedVocabularyDecks.filter(deck=>(themedDomainFilter==='all'||deck.domain===themedDomainFilter)&&(themedDeckFilter==='all'||deck.pos.includes(themedDeckFilter)));
  const totalWords=decks.reduce((sum,deck)=>sum+deck.words.length,0),summary=document.getElementById('themeLibrarySummary');
  summary.innerHTML='<strong>'+decks.length+'</strong><span>'+ui('个主题','topics')+'</span><i></i><strong>'+totalWords+'</strong><span>'+ui('个词','words')+'</span>';
  const domainName=id=>domains.find(domain=>domain.id===id),visibleDecks=decks.slice(0,themedDeckVisibleCount);
  grid.innerHTML=visibleDecks.map(deck=>{const progress=readThemedProgress(deck.id),count=progress.reviewed.filter(word=>deck.words.some(item=>item.word===word)).length,percent=Math.round(count/deck.words.length*100),label=count?ui('继续背词','Continue deck'):ui('开始背词','Start deck'),domain=domainName(deck.domain);return '<article class="theme-deck-card" data-deck="'+escapeHtml(deck.id)+'"><div class="theme-deck-top"><span class="theme-deck-mark">'+escapeHtml(deck.mark)+'</span><span class="theme-deck-badges"><small>'+escapeHtml(domain?ui(domain.title,domain.titleEn):'')+'</small><span class="pill">'+escapeHtml(deck.level)+'</span></span></div><h3 class="theme-deck-title">'+escapeHtml(deck.title)+'</h3><p class="theme-deck-en" lang="en">'+escapeHtml(deck.titleEn)+'</p><div class="theme-deck-meta"><span>'+ui(deck.words.length+' 个词',deck.words.length+' words')+'</span><strong>'+ui(count+' 个已学',count+' learned')+'</strong></div><div class="theme-deck-progress" role="progressbar" aria-valuemin="0" aria-valuemax="100" aria-valuenow="'+percent+'"><span style="width:'+percent+'%"></span></div><button class="secondary wide" type="button" onclick="openThemedDeck(\''+escapeHtml(deck.id)+'\')">'+label+'</button></article>'}).join('');
  const moreWrap=document.getElementById('themeDeckMoreWrap'),more=document.getElementById('themeDeckMore'),remaining=Math.max(0,decks.length-visibleDecks.length);moreWrap.hidden=!remaining;if(remaining)more.textContent=ui('显示更多主题（还剩 '+remaining+' 组）','Show more topics ('+remaining+' remaining)');
}
function filterThemedDomain(filter){themedDomainFilter=filter;themedDeckVisibleCount=12;renderThemedDecks()}
function filterThemedDecks(filter){themedDeckFilter=filter;themedDeckVisibleCount=12;renderThemedDecks()}
function showMoreThemedDecks(){themedDeckVisibleCount+=12;renderThemedDecks()}
function openThemedDeck(id){
  const deck=themedDeckById(id);if(!deck)return;ensureThemedVocabularyModal();activeThemedDeckId=id;const progress=readThemedProgress(id),next=deck.words.findIndex(item=>!progress.reviewed.includes(item.word));activeThemedIndex=next>=0?next:Math.min(progress.lastIndex,deck.words.length-1);themedDeckComplete=false;renderThemedStudy();openManagedModal(document.getElementById('themedVocabModal'),'.theme-audio');
}
function closeThemedDeck(){closeManagedModal(document.getElementById('themedVocabModal'))}
function selectThemedWord(index){const deck=themedDeckById(activeThemedDeckId);if(!deck||index<0||index>=deck.words.length)return;activeThemedIndex=index;themedDeckComplete=false;renderThemedStudy()}
function renderThemedStudy(){
  const root=document.getElementById('themedStudyContent'),deck=themedDeckById(activeThemedDeckId);if(!root||!deck)return;const progress=readThemedProgress(deck.id),learned=progress.reviewed.filter(word=>deck.words.some(item=>item.word===word)).length;
  if(themedDeckComplete){root.innerHTML='<div class="theme-complete"><span class="theme-complete-mark">✓</span><p class="eyebrow">'+escapeHtml(deck.title)+' · '+escapeHtml(deck.titleEn)+'</p><h2>'+ui('本组学习完成','Deck complete')+'</h2><p class="sub">'+ui(deck.words.length+' 个词已经进入间隔复习系统。',deck.words.length+' words are now in spaced review.')+'</p><div class="theme-complete-actions"><button class="secondary" type="button" onclick="restartThemedDeck()">'+ui('再学一遍','Study again')+'</button><button class="primary" type="button" onclick="openThemedReview()">'+ui('去复习','Go to review')+'</button></div></div>';return}
  const item=deck.words[activeThemedIndex],known=progress.reviewed.includes(item.word),saved=learningState.savedWords.includes(item.word),percent=Math.round(learned/deck.words.length*100);
  root.innerHTML='<div class="theme-study-head"><div><p class="eyebrow">'+ui('主题词库','Themed vocabulary')+' · '+escapeHtml(deck.level)+'</p><h2 id="themedDeckTitle"><span class="theme-deck-title">'+escapeHtml(deck.title)+'</span> <small lang="en">'+escapeHtml(deck.titleEn)+'</small></h2></div><strong>'+ui((activeThemedIndex+1)+' / '+deck.words.length+' 个词',(activeThemedIndex+1)+' / '+deck.words.length+' words')+'</strong></div><div class="theme-study-progress" role="progressbar" aria-valuemin="0" aria-valuemax="100" aria-valuenow="'+percent+'"><span style="width:'+percent+'%"></span></div><article class="theme-study-card"><button class="theme-audio" type="button" onclick="speakText(\''+escapeHtml(item.word)+'\')" aria-label="'+ui('播放词语发音','Play word pronunciation')+'">🔊</button><div class="theme-word-hanzi">'+escapeHtml(item.word)+'</div><div class="theme-word-pinyin">'+escapeHtml(item.pinyin)+'</div><div class="theme-word-en" lang="en">'+escapeHtml(item.en)+'</div><div class="theme-word-tags"><span>'+escapeHtml(item.hsk)+'</span><span>'+escapeHtml(item.pos)+'</span></div><div class="theme-example-block"><div class="theme-example-cn">'+markWords(item.example)+' <button class="speak theme-example-audio" type="button" onclick="speakThemedExample()" aria-label="'+ui('播放例句','Play example')+'">🔊</button></div><p class="theme-example-en" lang="en">'+escapeHtml(item.exampleEn||ui('暂无英文翻译','English translation unavailable'))+'</p><small>'+ui('鼠标停在词语上看拼音，点击查看词卡。','Hover over a word for pinyin; click to open its word card.')+'</small></div></article><div class="theme-save-row"><button class="ghost" type="button" onclick="saveThemedWord()">'+(saved?ui('已在生词本','Saved'):ui('加入生词本','Save word'))+'</button><span>'+ui('选择记忆情况后，会自动安排下次复习。','Choose how well you remember it to schedule the next review.')+'</span></div><div class="theme-grade-actions"><button class="secondary" type="button" onclick="gradeThemedWord(\'hard\')">'+ui('还要练 · 10 分钟','Again · 10 min')+'</button><button class="primary" type="button" onclick="gradeThemedWord(\'good\')">'+(known?ui('再记一次 · 明天','Remembered · tomorrow'):ui('认识了 · 明天','Got it · tomorrow'))+'</button></div><div class="theme-word-strip" aria-label="'+ui('本组词语','Words in this deck')+'">'+deck.words.map((word,index)=>'<button type="button" class="'+(index===activeThemedIndex?'current ':'')+(progress.reviewed.includes(word.word)?'learned':'')+'" onclick="selectThemedWord('+index+')"><span>'+escapeHtml(word.word)+'</span><small>'+escapeHtml(word.pinyin)+'</small></button>').join('')+'</div>';
  bindWords(root);
}
function speakThemedExample(){const deck=themedDeckById(activeThemedDeckId),item=deck?.words[activeThemedIndex];if(item)speakText(item.example)}
function saveThemedWord(){const deck=themedDeckById(activeThemedDeckId),item=deck?.words[activeThemedIndex];if(!item)return;if(!learningState.savedWords.includes(item.word)){learningState.savedWords.push(item.word);markLearningActivity();saveLearningState();renderLearningState();toastMsg(ui('已加入生词本','Saved to your word list'))}else toastMsg(ui('已保存在生词本','Already in saved words'));renderThemedStudy()}
function gradeThemedWord(level){
  const deck=themedDeckById(activeThemedDeckId),item=deck?.words[activeThemedIndex];if(!deck||!item)return;const progress=writeThemedProgress(deck.id);if(!progress.reviewed.includes(item.word))progress.reviewed.push(item.word);if(level==='hard'&&!progress.difficult.includes(item.word))progress.difficult.push(item.word);if(level==='good')progress.difficult=progress.difficult.filter(word=>word!==item.word);
  const dueAt=Date.now()+(level==='hard'?10*60*1000:DAY_MS),id='word:'+item.word,existing=learningState.reviewQueue.find(entry=>entry.id===id);if(existing){existing.dueAt=Math.min(Number(existing.dueAt)||dueAt,dueAt);existing.themeId=deck.id;existing.lastGrade=level}else learningState.reviewQueue.push({id,type:'word',value:item.word,themeId:deck.id,dueAt,interval:1,ease:level==='hard'?2.3:2.5,repetitions:0,lastGrade:level});
  const unlearned=deck.words.findIndex((word,index)=>index>activeThemedIndex&&!progress.reviewed.includes(word.word)),wrapped=deck.words.findIndex(word=>!progress.reviewed.includes(word.word));progress.lastIndex=unlearned>=0?unlearned:(wrapped>=0?wrapped:activeThemedIndex);if(progress.reviewed.length>=deck.words.length)progress.completedAt=new Date().toISOString();markLearningActivity();saveLearningState();renderLearningState();toastMsg(level==='hard'?ui('10 分钟后再复习','Review again in 10 minutes'):ui('已安排明天复习','Review scheduled for tomorrow'));
  if(progress.reviewed.length>=deck.words.length){themedDeckComplete=true}else activeThemedIndex=progress.lastIndex;renderThemedStudy();
}
function restartThemedDeck(){activeThemedIndex=0;themedDeckComplete=false;renderThemedStudy()}
function openThemedReview(){closeThemedDeck();showView('review')}

// ---------- 课程目录 ----------
function renderCourses(level='全部'){
  const list=level==='全部'?courses:courses.filter(c=>c.level===level);
  document.getElementById('courseGrid').innerHTML=list.map(c=>{const completed=Boolean(learningState.completedLessons[c.id]),started=(learningState.lessonProgress[c.id]?.phase||0)>0,status=completed?ui('已完成','Completed'):started?ui('学习中','In progress'):ui('未开始','Not started');return `<article class="card course-card${completed?' completed':''}"><div class="course-card-top"><span class="pill">${c.level} · HSK 3.0</span><span class="course-number">${c.id}</span></div><h3>${escapeHtml(c.title)}</h3><div class="course-scene">${escapeHtml(c.scene)}</div><div class="course-standard-path">${escapeHtml(c.topicPath.join(' · '))}</div><div class="course-focus">${escapeHtml(c.grammar)}</div><div class="course-standard-task">${escapeHtml(c.task)}</div><div class="course-card-actions"><span class="status-ready">${status}</span><button class="secondary" onclick="openLesson('${c.id}')">${started&&!completed?ui('继续上次学习','Resume lesson'):ui('进入课程','Open lesson')}</button></div>${started&&!completed?'<div class="progress-saved">'+ui('进度已保存','Progress saved')+' · '+Math.round((learningState.lessonProgress[c.id].phase||0)/5*100)+'%</div>':''}</article>`}).join('');
  scheduleUiLanguage();
}
function filterCourses(level,button){document.querySelectorAll('.level-filters .filter-btn').forEach(b=>b.classList.toggle('active',b===button));document.getElementById('pinyinLab')?.classList.toggle('hidden-by-filter',level!=='全部'&&level!=='HSK 1');renderCourses(level)}
function showLessonCatalog(){document.getElementById('courseCatalog').classList.remove('hidden');document.getElementById('lessonDetail').classList.add('hidden');ensurePinyinLab()}
function openLesson(id){const l=lessons.find(x=>x.id===id);if(!l)return;currentLesson=l;learningState.lastLessonId=id;markLearningActivity();saveLearningState();closeCourseModal();showView('learn');document.getElementById('courseCatalog').classList.add('hidden');document.getElementById('lessonDetail').classList.remove('hidden');renderLesson();window.scrollTo({top:0,behavior:'smooth'})}
function openCurrentLesson(){openLesson(homeRecommendedLessonId||currentLesson.id)}
function openCoursePreview(id){const c=courses.find(x=>x.id===id);if(!c)return;document.getElementById('courseModalLevel').textContent=c.level+' · HSK 3.0 · '+c.id;document.getElementById('courseModalTitle').textContent=c.title;document.getElementById('courseModalScene').textContent=c.scene;document.getElementById('courseModalGrammar').textContent=c.grammar;document.getElementById('courseModalVocab').textContent=c.vocab;document.getElementById('courseModalListening').textContent=c.listening;document.getElementById('courseModalSpeaking').textContent=c.speaking;document.getElementById('courseModalReview').textContent=c.review;const standard=document.getElementById('courseModalStandard');if(standard)standard.textContent=c.topicPath.join(' · ')+'｜'+c.task;const action=document.getElementById('courseModalAction');action.textContent=ui('进入课程','Open lesson');action.onclick=()=>openLesson(id);openManagedModal(courseModal,'#courseModalAction')}
function closeCourseModal(){closeManagedModal(courseModal)}
courseModal.addEventListener('click',e=>{if(e.target===courseModal)closeCourseModal()});

// ---------- 每日学习目标 ----------
function renderDailyGoalSetting(){
  const goal=dailyGoalMinutes(),value=document.getElementById('dailyGoalValue');
  if(value)value.textContent=ui(goal+' 分钟',goal+' min');
}
function syncDailyGoalChoices(value){document.querySelectorAll('.goal-option').forEach(button=>button.classList.toggle('selected',Number(button.dataset.goal)===Number(value)))}
function openDailyGoalModal(){
  const input=document.getElementById('dailyGoalInput'),goal=dailyGoalMinutes();
  if(input){input.value=String(goal);input.setCustomValidity('')}
  syncDailyGoalChoices(goal);openManagedModal(dailyGoalModal,'#dailyGoalInput');
}
function closeDailyGoalModal(){closeManagedModal(dailyGoalModal)}
function chooseDailyGoal(minutes){const input=document.getElementById('dailyGoalInput');if(input){input.value=String(minutes);input.setCustomValidity('')}syncDailyGoalChoices(minutes)}
function saveDailyGoal(){
  const input=document.getElementById('dailyGoalInput'),minutes=Number(input?.value);
  if(!Number.isInteger(minutes)||minutes<5||minutes>180){if(input){input.setCustomValidity(ui('请输入 5 到 180 之间的整数分钟。','Enter a whole number from 5 to 180 minutes.'));input.reportValidity()}return}
  learningState.preferences={...(learningState.preferences||{}),dailyGoalMinutes:minutes};saveLearningState();renderLearningState();closeDailyGoalModal();toastMsg(ui('每日目标已更新为 '+minutes+' 分钟','Daily goal updated to '+minutes+' minutes'));
}
dailyGoalModal?.addEventListener('click',event=>{if(event.target===dailyGoalModal)closeDailyGoalModal()});
document.getElementById('dailyGoalInput')?.addEventListener('input',event=>{event.target.setCustomValidity('');syncDailyGoalChoices(event.target.value)});
document.getElementById('dailyGoalInput')?.addEventListener('keydown',event=>{if(event.key==='Enter')saveDailyGoal()});

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
    if(d)b.setAttribute('aria-label',ui(b.dataset.word+'，拼音 '+d.p,b.dataset.word+', pinyin '+d.p));
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

function openWord(w){const d=words[w];if(!d)return;modalWord.textContent=w;modalPinyin.textContent=d.p;modalMeaning.textContent=d.m;modalLevel.textContent=d.l;modalExample.textContent=d.e;modalSpeak.onclick=()=>speakText(w);openManagedModal(wordModal,'#modalSpeak')}
function closeModal(){closeManagedModal(wordModal)}
wordModal.addEventListener('click',e=>{if(e.target===wordModal)closeModal()});
document.addEventListener('keydown',e=>{const modal=modalStack.filter(item=>item.classList.contains('show')).at(-1);if(!modal)return;if(e.key==='Escape'){e.preventDefault();closeActiveModal(modal);return}if(e.key!=='Tab')return;const controls=visibleModalControls(modal);if(!controls.length){e.preventDefault();return}const first=controls[0],last=controls[controls.length-1];if(e.shiftKey&&(document.activeElement===first||!modal.contains(document.activeElement))){e.preventDefault();last.focus()}else if(!e.shiftKey&&(document.activeElement===last||!modal.contains(document.activeElement))){e.preventDefault();first.focus()}});
function toggleHelper(){helper=!helper;document.body.classList.toggle('helper-off',!helper);document.querySelectorAll('.switch').forEach(s=>{s.classList.toggle('on',helper);s.setAttribute('aria-pressed',String(helper))});toastMsg(ui('中文辅助模式已'+(helper?'开启':'关闭'),'Chinese helper mode '+(helper?'on':'off')))}
helperSwitch.onclick=toggleHelper;

// ---------- 主题 ----------
function setTheme(name,silent=false){const allowed=['qinghe','mist','tea','wisteria'];if(!allowed.includes(name))name='qinghe';document.body.dataset.theme=name;document.querySelectorAll('.theme-option').forEach(b=>b.classList.toggle('active',b.dataset.themeOption===name));try{localStorage.setItem('qinghe-theme',name)}catch(e){}const colors={qinghe:'#60735a',mist:'#526c7a',tea:'#765f4c',wisteria:'#665f78'};document.querySelector('meta[name="theme-color"]').setAttribute('content',colors[name]);if(!silent)toastMsg(ui('已切换界面配色','Color theme updated'))}
try{setTheme(localStorage.getItem('qinghe-theme')||'qinghe',true)}catch(e){setTheme('qinghe',true)}

// ---------- 语音 ----------
function speakText(text,rate=.88){if('speechSynthesis'in window){speechSynthesis.cancel();const u=new SpeechSynthesisUtterance(text);u.lang='zh-CN';u.rate=rate;const voices=speechSynthesis.getVoices(),mandarin=voices.find(v=>/^zh[-_]CN$/i.test(v.lang))||voices.find(v=>/^zh/i.test(v.lang));if(mandarin)u.voice=mandarin;u.pitch=1;u.volume=1;speechSynthesis.speak(u);toastMsg(rate<.8?ui('正在慢速播放','Playing slowly'):ui('正在播放普通话','Playing Mandarin audio'))}else toastMsg(ui('当前浏览器不支持语音播放','Audio playback is not supported in this browser'))}

// ---------- 课程渲染 ----------
function renderLesson(){
  const L=currentLesson;
  document.getElementById('lessonCrumb').textContent=L.id+' · '+L.level;
  document.getElementById('lessonTitle').textContent=L.title;
  document.getElementById('lessonMeta').textContent=L.level+' · HSK 3.0 · '+L.scene+' · '+ui('预计 15 分钟','about 15 min');
  renderLessonStandard(L);
  document.getElementById('lessonTitleSpeak').onclick=()=>speakText(L.title);
  // 情境对话
  document.getElementById('dialogueTitle').textContent=L.scene;
  document.getElementById('dialogueLines').innerHTML=L.dialogue.map(d=>`<div class="line"><div class="speaker">${escapeHtml(d.s)}</div><div>${markWords(d.t,L.vocab)}</div><button class="speak" aria-label="播放这句">🔊</button></div>`).join('');
  document.querySelectorAll('#dialogueLines .line').forEach((line,i)=>{line.querySelector('.speak').onclick=()=>speakText(L.dialogue[i].t)});
  document.getElementById('playAllBtn').onclick=()=>speakText(L.dialogue.map(d=>d.t).join(''));
  // 词汇
  document.getElementById('vocabEyebrow').textContent=ui('今天的词语 · '+L.vocab.length+' 个','Today’s vocabulary · '+L.vocab.length+' words');
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
  document.getElementById('completeSummary').textContent=ui(`你完成了《${L.title}》，新内容会按照记忆节奏安排复习。`,`You completed “${L.title}”. New material will be scheduled using spaced repetition.`);
  document.getElementById('completeVocabCount').textContent=L.vocab.length;
  // 大纲
  const outlineItems=[[ui('情境对话','Dialogue'),ui('现在','Now')],[ui(L.vocab.length+' 个词语',L.vocab.length+' words'),ui('约 4 分','about 4 min')],[L.grammar.name,ui('约 3 分','about 3 min')],[ui('听音辨意','Listening'),ui('约 2 分','about 2 min')],[ui('跟读口语','Speaking'),ui('约 2 分','about 2 min')],[ui('完成','Complete'),ui('总结','Summary')]];
  document.getElementById('outline').innerHTML=outlineItems.map((x,i)=>`<div class="outline-item${i===0?' now':''}">${escapeHtml(x[0])} <span>${x[1]}</span></div>`).join('');
  bindWords(document.getElementById('lessonDetail'));
  const savedPhase=Math.max(0,Math.min(5,Number(learningState.lessonProgress[L.id]?.phase)||0));
  phase=-1;
  setPhase(savedPhase,false);
}

// ---------- 课程阶段 ----------
function setPhase(n,persist=true){
  const next=Math.max(0,Math.min(5,n)),reachingComplete=persist&&next===5&&phase!==5;phase=next;
  document.querySelectorAll('.phase').forEach((p,i)=>p.classList.toggle('active',i===phase));
  document.querySelectorAll('.step').forEach((s,i)=>{s.className='step'+(i<phase?' done':i===phase?' current':'')});
  document.querySelectorAll('.outline-item').forEach((x,i)=>{x.classList.toggle('now',i===phase);const labels=ui(['约 4 分','约 3 分','约 2 分','约 2 分','总结'],['about 4 min','about 3 min','about 2 min','about 2 min','Summary']);x.lastElementChild.textContent=i===phase?ui('现在','Now'):i<phase?ui('完成','Complete'):(labels[i-1]||'')});
  if(persist){learningState.lessonProgress[currentLesson.id]={phase,updatedAt:new Date().toISOString()};learningState.lastLessonId=currentLesson.id;markLearningActivity();saveLearningState();if(reachingComplete)completeCurrentLesson();else renderLearningState()}
  window.scrollTo({top:0,behavior:'smooth'});
}
function nextPhase(){setPhase(phase+1)}function prevPhase(){setPhase(phase-1)}function restartLesson(){learningState.lessonProgress[currentLesson.id]={phase:0,updatedAt:new Date().toISOString()};saveLearningState();setPhase(0,false);renderLearningState()}
function answerChoice(el,ok){el.parentElement.querySelectorAll('.choice').forEach(x=>x.classList.remove('selected','correct'));el.classList.add(ok?'correct':'selected');const f=el.parentElement.querySelector('.feedback');if(f)f.classList.add('show');toastMsg(ok?ui('回答正确','Correct'):ui('再想一想，可以回到课文看看','Try again — you can return to the dialogue'))}

// ---------- 复习 ----------
const demoReviewItems=[
  {type:'词义辨认',prompt:'“本来”最接近哪个意思？',mode:'choice',options:['originally; at first','especially','just now'],answer:0,feedback:'“本来”说明原来的情况或计划。'},
  {type:'听音辨词',prompt:'先听发音，再选择你听到的词。',mode:'choice',audio:'迟到',options:['知道','迟到','提到'],answer:1,feedback:'“迟到”读作 chí dào。'},
  {type:'句中填空',prompt:'我 ___ 想坐地铁，但是今天人太多。',mode:'input',answers:['本来'],feedback:'“本来……但是……”表示计划和实际情况发生了变化。'},
  {type:'主动表达',prompt:'用“本来……但是……”写一句自己的话。',mode:'open',feedback:'答案不必完全一样；重点是先说原计划，再说变化。'}
];
let reviewItems=demoReviewItems,currentReviewCorrect=false;
function rotateOptions(correct,distractors,seed){const list=[correct,...distractors.filter(x=>x&&x!==correct).slice(0,2)],offset=Math.abs(seed)%list.length,rotated=list.slice(offset).concat(list.slice(0,offset));return{options:rotated,answer:rotated.indexOf(correct)}}
function reviewItemFromQueue(queueItem,index){
  if(queueItem.type==='grammar'){
    const lesson=lessons.find(x=>x.id===queueItem.lessonId),grammar=lesson?.grammar;
    return{queueId:queueItem.id,type:'主动表达',prompt:'用“'+queueItem.value+'”写一句自己的话。',mode:'open',required:queueItem.value.split('……').filter(x=>x.length>1),feedback:grammar?.explain||'先说完整意思，再检查目标结构是否自然。'};
  }
  const word=queueItem.value,data=words[word]||{},keys=Object.keys(words).filter(x=>x!==word),seed=[...word].reduce((n,x)=>n+x.charCodeAt(0),index);
  if(index%3===1){const choices=rotateOptions(word,[keys[(seed+7)%keys.length],keys[(seed+19)%keys.length]],seed);return{queueId:queueItem.id,type:'听音辨词',prompt:'先听发音，再选择你听到的词。',mode:'choice',audio:word,options:choices.options,answer:choices.answer,feedback:'“'+word+'”读作 '+(data.p||'')+'。'}}
  if(index%3===2){const example=data.e||data.examples?.[0]||('请用“'+word+'”完成句子。'),prompt=example.includes(word)?example.replace(word,'___'):'请填入今天复习的词语：___';return{queueId:queueItem.id,type:'句中填空',prompt,mode:'input',answers:[word],feedback:'答案是“'+word+'”：'+example}}
  const meanings=keys.map(x=>words[x]?.m).filter(Boolean),choices=rotateOptions(data.m||word,[meanings[(seed+5)%meanings.length],meanings[(seed+17)%meanings.length]],seed);return{queueId:queueItem.id,type:'词义辨认',prompt:'“'+word+'”最接近哪个意思？',mode:'choice',options:choices.options,answer:choices.answer,feedback:'“'+word+'”表示：'+(data.cn||data.m||word)};
}
function buildReviewItems(){
  const sorted=[...learningState.reviewQueue].sort((a,b)=>(Number(a.dueAt)||0)-(Number(b.dueAt)||0)),due=sorted.filter(x=>(Number(x.dueAt)||0)<=Date.now()),pool=due.length?due:sorted;
  if(!pool.length)return demoReviewItems.map(x=>({...x}));
  const selected=pool.filter(x=>x.type==='word').slice(0,3),grammar=pool.find(x=>x.type==='grammar');if(grammar)selected.push(grammar);pool.forEach(x=>{if(selected.length<4&&!selected.some(y=>y.id===x.id))selected.push(x)});
  return selected.map(reviewItemFromQueue);
}
function dueLabel(dueAt){const ms=(Number(dueAt)||Date.now())-Date.now();if(ms<=0)return ui('今天到期','Due today');if(ms<=60*60*1000)return ui('1 小时内','Within an hour');const days=Math.ceil(ms/DAY_MS);if(days===1)return ui('明天','Tomorrow');return ui(days+' 天后','In '+days+' days')}
function renderReviewSchedule(){
  const root=document.querySelector('#review .schedule-list');if(!root)return;const items=[...learningState.reviewQueue].sort((a,b)=>(Number(a.dueAt)||0)-(Number(b.dueAt)||0)).slice(0,4);
  if(!items.length){root.innerHTML='<div class="wordbook-empty"><strong>'+ui('暂无复习安排','No reviews scheduled')+'</strong><br><span>'+ui('课程完成后，新词和语法会自动进入复习队列。','Finish a lesson to add its words and grammar to the review queue.')+'</span></div>';return}
  root.innerHTML=items.map(item=>{const data=item.type==='word'?words[item.value]:null;return '<div class="schedule-row"><span>'+escapeHtml(item.value)+(data?'<small>'+escapeHtml(data.p)+'</small>':'')+'</span><strong>'+dueLabel(item.dueAt)+'</strong></div>'}).join('');
}
function startReview(){reviewItems=buildReviewItems();reviewIndex=0;document.getElementById('startReviewBtn').classList.add('hidden');document.getElementById('reviewDemo').classList.add('show');renderReviewItem();document.getElementById('reviewDemo').scrollIntoView({behavior:'smooth',block:'center'})}
function renderReviewItem(){const item=reviewItems[reviewIndex],options=document.getElementById('reviewOptions'),input=document.getElementById('reviewInput'),check=document.getElementById('reviewCheckBtn');document.getElementById('reviewTypeLabel').textContent=(uiLanguage==='en'?(UI_TEXT[item.type]||item.type):item.type)+' · '+(reviewIndex+1)+' / '+reviewItems.length;document.getElementById('reviewProgressBar').style.width=((reviewIndex+1)/reviewItems.length*100)+'%';document.getElementById('reviewQuestion').textContent=item.prompt;document.getElementById('reviewMedia').innerHTML=item.audio?`<button class="bigplay" onclick="speakText('${item.audio}')" aria-label="${ui('播放复习发音','Play review audio')}">▶</button>`:'';document.getElementById('reviewFeedback').classList.remove('show');document.getElementById('reviewGrades').classList.remove('show');options.innerHTML='';input.classList.add('hidden');check.classList.add('hidden');input.value='';if(item.mode==='choice'){options.className='choice-grid';item.options.forEach((o,i)=>{const b=document.createElement('button');b.className='choice';b.textContent=o;b.onclick=()=>reviewChoice(i,b);options.appendChild(b)})}else{options.className='';input.classList.remove('hidden');check.classList.remove('hidden');input.placeholder=item.mode==='open'?'例如：我本来想去公园，但是下雨了。':ui('输入词语','Type the word')}}
function reviewChoice(index,button){const item=reviewItems[reviewIndex];document.querySelectorAll('#reviewOptions .choice').forEach(b=>b.disabled=true);button.classList.add(index===item.answer?'correct':'selected');showReviewFeedback(index===item.answer,item.feedback)}
function checkReviewInput(){const item=reviewItems[reviewIndex],value=document.getElementById('reviewInput').value.trim();let ok=false;if(item.mode==='input')ok=item.answers.includes(value);else{const required=item.required?.length?item.required:['本来','但是'];ok=value.length>=6&&required.every(part=>value.includes(part))}showReviewFeedback(ok,ok?item.feedback:(item.mode==='open'?'请在句子里使用完整的目标结构。':'正确答案是“'+item.answers[0]+'”。'))}
function showReviewFeedback(ok,message){currentReviewCorrect=ok;const feedback=document.getElementById('reviewFeedback');feedback.textContent=(ok?'✓ ':ui('再想一想：','Try again: '))+message;feedback.classList.add('show');document.getElementById('reviewGrades').classList.add('show')}
function gradeReview(level){
  const item=reviewItems[reviewIndex],queueItem=learningState.reviewQueue.find(x=>x.id===item.queueId),daysByGrade={hard:1,good:3,easy:7};let days=daysByGrade[level];
  if(queueItem){const oldInterval=Math.max(1,Number(queueItem.interval)||1);days=level==='hard'?1:level==='good'?Math.max(3,Math.round(oldInterval*2.2)):Math.max(7,Math.round(oldInterval*3));queueItem.interval=days;queueItem.ease=Math.max(1.3,(Number(queueItem.ease)||2.5)+(level==='hard'?-.2:level==='easy'?.1:0));queueItem.repetitions=(Number(queueItem.repetitions)||0)+1;queueItem.lastGrade=level;queueItem.dueAt=Date.now()+days*DAY_MS}
  learningState.stats.reviewed++;if(currentReviewCorrect)learningState.stats.correct++;markLearningActivity();saveLearningState();renderLearningState();toastMsg(ui('已根据你的选择更新复习时间','Review time updated from your rating')+' · '+dueLabel(Date.now()+days*DAY_MS));
  reviewIndex++;if(reviewIndex>=reviewItems.length){document.getElementById('reviewTypeLabel').textContent=ui('本轮完成','Round complete');document.getElementById('reviewProgressBar').style.width='100%';document.getElementById('reviewQuestion').textContent=ui(reviewItems.length+' 项练习已完成','You completed '+reviewItems.length+' review activities.');document.getElementById('reviewMedia').innerHTML='<p class="sub">'+ui('系统会根据刚才的难度选择安排下一次出现。','The next review will be scheduled from the difficulty you chose.')+'</p>';document.getElementById('reviewOptions').innerHTML='<button class="secondary" onclick="resetReview()">'+ui('再练一轮','Practice another round')+'</button>';document.getElementById('reviewInput').classList.add('hidden');document.getElementById('reviewCheckBtn').classList.add('hidden');document.getElementById('reviewFeedback').classList.remove('show');document.getElementById('reviewGrades').classList.remove('show');return}renderReviewItem()
}
function resetReview(){reviewItems=buildReviewItems();reviewIndex=0;renderReviewItem()}

// ---------- 词典 ----------
const OPEN_CEDICT_URL='./data/cedict.min.json?v=20261002';
const CC_CEDICT_URL='https://cc-cedict.org/editor/editor.php?handler=Download';
const CC_LICENSE_URL='https://creativecommons.org/licenses/by-sa/4.0/';
let openCedictEntries=null,openCedictMeta=null,openCedictPromise=null,openCedictState='idle',onlineSearchMatches=[];

function cedictTraditional(entry){return Array.isArray(entry)?entry[0]:entry.traditional}
function cedictSimplified(entry){return Array.isArray(entry)?entry[1]:entry.simplified}
function cedictPinyin(entry){return Array.isArray(entry)?entry[2]:entry.pinyin}
function cedictDefinitions(entry){return Array.isArray(entry)?entry.slice(3):(entry.definitions||[])}

function normalizeQuery(text){return String(text).normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/\s+/g,'').toLowerCase()}
function normalizePinyin(text,loose=false){let value=String(text).toLowerCase().replace(/u:/g,'v').replace(/ü/g,'v').normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[1-5]/g,'').replace(/[^a-zv]/g,'');return loose?value.replace(/v/g,'u'):value}
function normalizeEnglish(text){return String(text).toLowerCase().replace(/[’]/g,"'").replace(/\s+/g,' ').trim()}
function englishDefinitionRank(definition,query){const text=normalizeEnglish(definition),q=normalizeEnglish(query);if(!q||q.length<2)return 99;if(text===q)return 0;if(text.startsWith(q+' ')||text.startsWith('to '+q+' ')||text==='to '+q)return 2;const escaped=q.replace(/[.*+?^${}()|[\]\\]/g,'\\$&'),whole=new RegExp('(^|[^a-z0-9])'+escaped+'($|[^a-z0-9])');if(whole.test(text))return q.includes(' ')?3:6;if(q.includes(' ')&&q.length>=4&&text.includes(q))return 12;return 99}
function toneSyllable(token){const match=token.match(/^([A-Za-züÜvV:]+)([1-5])$/);if(!match)return token.replace(/u:/gi,'ü').replace(/v/gi,'ü');let base=match[1].replace(/u:/gi,'ü').replace(/v/gi,'ü').toLowerCase(),tone=Number(match[2]);if(tone===5)return base;const marks={a:['ā','á','ǎ','à'],e:['ē','é','ě','è'],i:['ī','í','ǐ','ì'],o:['ō','ó','ǒ','ò'],u:['ū','ú','ǔ','ù'],'ü':['ǖ','ǘ','ǚ','ǜ']};let index=base.indexOf('a');if(index<0)index=base.indexOf('e');if(index<0&&base.includes('ou'))index=base.indexOf('o');if(index<0){for(let i=base.length-1;i>=0;i--)if(marks[base[i]]){index=i;break}}return index<0?base:base.slice(0,index)+marks[base[index]][tone-1]+base.slice(index+1)}
function numberedPinyinToMarks(text){return String(text).split(/\s+/).map(toneSyllable).join(' ')}
function localMatches(query){const q=query.trim(),pin=normalizePinyin(q),loose=normalizePinyin(q,true),hasHan=/[\u3400-\u9fff]/.test(q),ranked=[];for(const key of Object.keys(words)){const d=words[key];let rank=99;if(hasHan){if(key===q)rank=0;else if(d.tr===q)rank=1;else if(key.startsWith(q))rank=3;else if(String(d.tr||'').startsWith(q))rank=4}else{const p=normalizePinyin(d.p),pl=normalizePinyin(d.p,true);if(p===pin)rank=0;else if(pl===loose)rank=1;else if(p.startsWith(pin))rank=3;else if(pl.startsWith(loose))rank=4;rank=Math.min(rank,englishDefinitionRank(d.m,q))}if(rank<99)ranked.push({key,rank})}return ranked.sort((a,b)=>a.rank-b.rank||a.key.length-b.key.length).map(x=>x.key).slice(0,10)}
function setDictStatus(kind,text){const className='dict-resource-status'+(kind?' '+kind:'');if(dictStatus.className!==className)dictStatus.className=className;const label=dictStatus.querySelector('span');if(label.textContent!==text)label.textContent=text}
function setDictButton(text,disabled){if(dictLoadBtn.textContent!==text)dictLoadBtn.textContent=text;if(dictLoadBtn.disabled!==disabled)dictLoadBtn.disabled=disabled}
function renderOpenDictionaryStatus(){if(!dictStatus||!dictLoadBtn)return;if(openCedictState==='ready'&&openCedictEntries){setDictStatus('online',ui('本地完整词库已加载 · ','Local full dictionary loaded · ')+openCedictEntries.length.toLocaleString(uiLanguage==='en'?'en-US':'zh-CN')+' '+ui('条 CC-CEDICT 词条','CC-CEDICT entries'));setDictButton(ui('已加载','Loaded'),true);return}if(openCedictState==='loading'){setDictStatus('loading',ui('正在加载本地 CC-CEDICT 完整词库；首次加载后可离线使用…','Loading the complete local CC-CEDICT. It will be available offline after the first load…'));setDictButton(ui('加载完整词库','Load full dictionary'),true);return}if(openCedictState==='error'){setDictStatus('error',ui('本地完整词库暂时无法加载；课程词库仍可正常使用','The local full dictionary could not be loaded. Course entries still work.'));setDictButton(ui('重新加载','Reload'),false);return}const localCount=Object.keys(words).length.toLocaleString(uiLanguage==='en'?'en-US':'zh-CN');setDictStatus('',ui('本地学习词库已可用 · '+localCount+' 条；完整 CC-CEDICT 已随网站提供','Local learning dictionary ready · '+localCount+' entries; the complete CC-CEDICT is included with the site.'));setDictButton(ui('加载完整词库','Load full dictionary'),false)}
async function getOpenDictionary(){if(openCedictEntries)return openCedictEntries;if(openCedictPromise)return openCedictPromise;openCedictState='loading';renderOpenDictionaryStatus();openCedictPromise=fetch(OPEN_CEDICT_URL,{cache:'force-cache'}).then(response=>{if(!response.ok)throw new Error('HTTP '+response.status);return response.json()}).then(data=>{if(!Array.isArray(data.entries)||data.entries.length<100000)throw new Error('词库格式不正确');openCedictEntries=data.entries;openCedictMeta=data.meta||{};openCedictState='ready';renderOpenDictionaryStatus();toastMsg(ui('完整本地词库已加载','Full local dictionary loaded'));return openCedictEntries}).catch(error=>{openCedictPromise=null;openCedictState='error';renderOpenDictionaryStatus();throw error});return openCedictPromise}
async function loadOpenDictionary(){try{await getOpenDictionary()}catch(error){toastMsg(ui('加载失败，请刷新页面后重试','Loading failed. Refresh the page and try again.'))}}
function entryPenalty(entry){const defs=cedictDefinitions(entry).join(' ').toLowerCase(),simplified=cedictSimplified(entry),traditional=cedictTraditional(entry),pinyin=cedictPinyin(entry),local=words[simplified]||words[traditional];let score=(/surname|variant of|old variant|see /.test(defs)?5:0)+(/^[A-Z]/.test(pinyin||'')?2:0);if(local){const pos=local.pos||'';if(pos.includes('助词')&&/particle/.test(defs))score-=7;if(pos.includes('代词')&&/pronoun|which|what|who|where/.test(defs))score-=5;if(pos.includes('量词')&&/classifier|measure word/.test(defs))score-=5;if(pos.includes('数词')&&/number|one|two|three|four|five|six|seven|eight|nine|ten/.test(defs))score-=4;if(pos.includes('时间')&&/today|tomorrow|yesterday|morning|afternoon|time/.test(defs))score-=4;if(pos.includes('连词')&&/although|but|however|if|because|therefore/.test(defs))score-=3}return score}
function searchOpenEntries(query){if(!openCedictEntries)return[];const q=query.trim(),hasHan=/[\u3400-\u9fff]/.test(q),pin=normalizePinyin(q),loose=normalizePinyin(q,true),ranked=[];for(const entry of openCedictEntries){const simplified=cedictSimplified(entry),traditional=cedictTraditional(entry),pinyin=cedictPinyin(entry);let rank=99;if(hasHan){if(simplified===q)rank=0;else if(traditional===q)rank=1;else if(simplified.startsWith(q))rank=3;else if(traditional.startsWith(q))rank=4}else{const p=normalizePinyin(pinyin),pl=normalizePinyin(pinyin,true);if(p===pin)rank=0;else if(pl===loose)rank=1;else if(p.startsWith(pin))rank=3;else if(pl.startsWith(loose))rank=4;for(const definition of cedictDefinitions(entry))rank=Math.min(rank,englishDefinitionRank(definition,q))}if(rank<99)ranked.push({entry,rank:rank+entryPenalty(entry)})}ranked.sort((a,b)=>a.rank-b.rank||cedictSimplified(a.entry).length-cedictSimplified(b.entry).length);const seen=new Set;return ranked.map(x=>x.entry).filter(entry=>{const key=cedictSimplified(entry)+'|'+cedictPinyin(entry);if(seen.has(key))return false;seen.add(key);return true}).slice(0,12)}
function matchingDefinition(entry,query){const definitions=cedictDefinitions(entry);if(!query)return definitions[0]||'CC-CEDICT 词条';return definitions.slice().sort((a,b)=>englishDefinitionRank(a,query)-englishDefinitionRank(b,query))[0]||'CC-CEDICT 词条'}
function renderResultButtons(localKeys=[],onlineEntries=[],query=''){dictResults.replaceChildren();const items=[];for(const key of localKeys)items.push({kind:'local',word:key,pinyin:words[key].p,meaning:words[key].m,key});for(const entry of onlineEntries){const simplified=cedictSimplified(entry),pinyin=cedictPinyin(entry),duplicate=items.some(item=>item.word===simplified&&normalizePinyin(item.pinyin)===normalizePinyin(pinyin));if(!duplicate)items.push({kind:'online',word:simplified,pinyin:numberedPinyinToMarks(pinyin),meaning:matchingDefinition(entry,query),entry})}items.slice(0,10).forEach(item=>{const button=document.createElement('button');button.className='dict-result';const word=document.createElement('span');word.className='result-word';word.textContent=item.word;const pinyin=document.createElement('span');pinyin.className='result-pinyin';pinyin.textContent=item.pinyin;const meaning=document.createElement('span');meaning.className='result-meaning';meaning.lang='en';meaning.textContent=item.meaning;button.append(word,pinyin,meaning);button.onclick=()=>item.kind==='local'?lookupWord(item.key):lookupOnlineEntry(item.entry);dictResults.appendChild(button)});if(items.length){const note=document.createElement('div');note.className='dict-result-more';note.textContent=ui('找到 '+items.length+' 个相关结果；选择一个查看完整词条。','Found '+items.length+' related results. Select one to view the full entry.');dictResults.appendChild(note);dictResults.classList.add('show')}else dictResults.classList.remove('show')}
async function searchDict(){const query=dictInput.value.trim();if(!query){toastMsg(ui('请输入汉字、拼音或英文','Enter Chinese characters, pinyin or English'));return}const locals=localMatches(query);if(locals.length)lookupWord(locals[0],false);renderResultButtons(locals,[],query);try{await getOpenDictionary();onlineSearchMatches=searchOpenEntries(query);renderResultButtons(locals,onlineSearchMatches,query);if(!locals.length&&onlineSearchMatches.length)lookupOnlineEntry(onlineSearchMatches[0],false);else if(!locals.length&&!onlineSearchMatches.length)toastMsg(ui('没有找到“'+query+'”，请检查英文或拼音拼写','No result for “'+query+'”. Check the English or pinyin spelling.'))}catch(error){if(!locals.length)toastMsg(ui('完整词库尚未加载，当前只搜索课程词库','The full dictionary is not loaded. Searching course entries only.'))}}
function renderExamples(examples,translations=[]){dictExamples.replaceChildren(...examples.map((text,index)=>{const div=document.createElement('div');div.className='example dictionary-example';const line=document.createElement('div');line.className='dictionary-example-cn';line.innerHTML=markWords(text);div.append(line);if(!text.includes('暂时没有原创例句')){const button=document.createElement('button');button.className='speak';button.textContent='🔊';button.setAttribute('aria-label',ui('播放例句','Play example'));button.onclick=()=>speakText(text);line.append(' ',button)}if(translations[index]){const translation=document.createElement('p');translation.className='example-translation';translation.lang='en';translation.textContent=translations[index];div.append(translation)}return div}));bindWords(dictExamples)}
function lookupWord(key,notify=true){const d=words[key];if(!d)return;dictInput.value=key;dictWord.textContent=key;dictPinyin.textContent=d.p;dictMeaning.textContent=d.m;dictLevel.textContent=d.l;dictExplain.textContent=d.cn;dictTraditional.textContent=d.tr||key;dictPos.textContent=d.pos;dictCollocations.replaceChildren(...d.col.map(text=>{const span=document.createElement('span');span.textContent=text;return span}));renderExamples(d.examples,d.examplesEn||[]);dictSource.innerHTML=ui('课程词条 · 拼音与英文释义参考 ','Course entry · Pinyin and English meanings reference ')+'<a href="'+CC_CEDICT_URL+'" target="_blank" rel="noopener">CC-CEDICT</a> (<a href="'+CC_LICENSE_URL+'" target="_blank" rel="noopener">CC BY-SA 4.0</a>) · '+ui('中文释义、搭配与例句为青禾中文原创','Chinese explanations, collocations and examples are original Qinghe content');updateRecent(key);if(notify)toastMsg(ui('已找到“'+key+'”','Found “'+key+'”'))}
function lookupOnlineEntry(entry,notify=true){if(!entry)return;const key=cedictSimplified(entry),traditional=cedictTraditional(entry),pinyin=cedictPinyin(entry),local=words[key]||words[traditional],definitions=cedictDefinitions(entry).filter(Boolean).slice(0,5);dictInput.value=key;dictWord.textContent=key;dictPinyin.textContent=numberedPinyinToMarks(pinyin);dictMeaning.textContent=definitions.join('; ')||'CC-CEDICT entry';dictLevel.textContent=local?local.l:ui('CC-CEDICT · 开放词条','CC-CEDICT · Open entry');dictExplain.textContent=local?local.cn:ui('英文义项来自开放词典；青禾中文暂未补充学习释义。','English meanings come from the open dictionary. A Qinghe learner explanation is not yet available.');dictTraditional.textContent=traditional||key;dictPos.textContent=local?local.pos:ui('词性未收录','Part of speech unavailable');const collocations=local?local.col:[ui('可加入生词本','Ready to save'),ui('开放词典词条','Open-dictionary entry')];dictCollocations.replaceChildren(...collocations.map(text=>{const span=document.createElement('span');span.textContent=text;return span}));renderExamples(local?local.examples:[ui('该词条暂时没有原创例句。','No original example is available for this entry yet.')]);dictSource.innerHTML=ui('本地开放词条 · 数据来自 ','Local open entry · Data from ')+'<a href="'+CC_CEDICT_URL+'" target="_blank" rel="noopener">CC-CEDICT / MDBG Community</a>, '+ui('按 ','used under ')+'<a href="'+CC_LICENSE_URL+'" target="_blank" rel="noopener">CC BY-SA 4.0</a> · '+ui('青禾中文的原创字段单独标注','Original Qinghe fields are labeled separately');updateRecent(key);if(notify)toastMsg(ui('已从开放词库找到“'+key+'”','Found “'+key+'” in the open dictionary'))}
function updateRecent(key){const existing=[...recentWords.querySelectorAll('.recent-word')].map(x=>x.textContent).filter(x=>x!==key);recentWords.replaceChildren(...[key,...existing].slice(0,4).map(word=>{const button=document.createElement('button');button.type='button';button.className='recent-word';button.textContent=word;button.onclick=()=>{dictInput.value=word;searchDict()};return button}))}
dictInput.addEventListener('keydown',e=>{if(e.key==='Enter')searchDict()});

// ---------- 跟读纠错 ----------
function speakShadowing(rate=.82){speakText(shadowingText,rate)}
function setRecording(active){recording=active;recordBtn.classList.toggle('recording',active);recordBtn.setAttribute('aria-pressed',String(active));recordBtn.setAttribute('aria-label',active?ui('结束跟读','Stop speaking'):ui('开始跟读','Start speaking'));recordHint.textContent=active?ui('正在听，请完整读完这句话…','Listening — please read the full sentence…'):ui('点击圆形按钮，听到提示后开始跟读','Tap the round button and start speaking after the cue.')}
function normalizeSpeech(text){return text.replace(/[，。！？、,.!?\s]/g,'')}
function speechSimilarity(a,b){a=normalizeSpeech(a);b=normalizeSpeech(b);if(!a.length||!b.length)return 0;const dp=Array.from({length:a.length+1},(_,i)=>[i]);for(let j=0;j<=b.length;j++)dp[0][j]=j;for(let i=1;i<=a.length;i++)for(let j=1;j<=b.length;j++)dp[i][j]=Math.min(dp[i-1][j]+1,dp[i][j-1]+1,dp[i-1][j-1]+(a[i-1]===b[j-1]?0:1));return Math.max(0,Math.round((1-dp[a.length][b.length]/Math.max(a.length,b.length))*100))}
function feedbackItem(mark,text){const li=document.createElement('li'),icon=document.createElement('i'),span=document.createElement('span');icon.textContent=mark;span.textContent=text;li.append(icon,span);return li}
function showCorrection(text,isDemo=false){const score=speechSimilarity(shadowingText,text);speechResult.classList.add('show');speechResultTitle.textContent=isDemo?ui('纠错示例','Sample feedback'):ui('本次跟读','Your attempt');speechResultStatus.textContent=isDemo?ui('示例结果，不是你的录音','Sample result — not your recording'):ui('浏览器语音识别结果','Browser speech recognition result');speechScore.textContent=score;speechTranscript.textContent=text||ui('没有识别到声音','No speech recognized');speechFeedback.replaceChildren();const compact=normalizeSpeech(text);const firstWord=currentLesson.vocab.find(w=>shadowingText.includes(w))||'';speechFeedback.append(feedbackItem(firstWord&&compact.includes(normalizeSpeech(firstWord))?'✓':'!',firstWord?(compact.includes(normalizeSpeech(firstWord))?ui('“'+firstWord+'”识别清楚，开头很自然。','“'+firstWord+'” was clear. The opening sounded natural.'):ui('“'+firstWord+'”没有识别清楚，试着放慢一点。','“'+firstWord+'” was unclear. Try slowing down.') ):ui('注意每个字都要读清楚。','Make each syllable clear.')));speechFeedback.append(feedbackItem(score>=88?'✓':'↻',score>=88?ui('整句节奏稳定，可以进入下一步。','Your rhythm was steady. You can continue.'):score>=68?ui('整体已经听懂，再练一次会更自然。','The sentence was understandable. One more try will sound more natural.'):ui('建议先慢速听一遍，再分成两段跟读。','Listen slowly first, then shadow the sentence in two parts.')));speechResult.scrollIntoView({behavior:'smooth',block:'nearest'})}
function showSpeechError(code){setRecording(false);speechResult.classList.add('show');speechResultTitle.textContent=ui('暂时无法识别','Recognition unavailable');speechResultStatus.textContent=code==='not-allowed'?ui('没有获得麦克风权限','Microphone permission not granted'):ui('浏览器未收到清晰语音','No clear speech received');speechScore.textContent='--';speechTranscript.textContent=code==='not-allowed'?ui('请允许麦克风后重试，或先查看纠错示例。','Allow microphone access and try again, or view the sample feedback.'):ui('请靠近麦克风，再完整读一次。','Move closer to the microphone and read the full sentence again.');speechFeedback.replaceChildren(feedbackItem('i',ui('你也可以点击“查看纠错示例”，先体验反馈方式。','You can also select “View sample feedback” to preview the feedback.')))}
function toggleRecord(){if(recording){if(recognition)recognition.stop();return}const SpeechRecognition=window.SpeechRecognition||window.webkitSpeechRecognition;if(!SpeechRecognition){toastMsg(ui('当前浏览器不支持实时识别，已打开纠错示例','Live recognition is not supported in this browser. Showing sample feedback.'));showCorrectionDemo();return}try{recognition=new SpeechRecognition();recognition.lang='zh-CN';recognition.interimResults=true;recognition.continuous=false;liveTranscript='';recognitionFailed=false;recognition.onstart=()=>{setRecording(true);speechResult.classList.add('show');speechResultTitle.textContent=ui('正在跟读','Speaking now');speechResultStatus.textContent=ui('实时识别中','Live recognition');speechScore.textContent='--';speechTranscript.textContent=ui('正在听……','Listening…');speechFeedback.replaceChildren()};recognition.onresult=e=>{let finalText='',interimText='';for(let i=e.resultIndex;i<e.results.length;i++){const part=e.results[i][0].transcript;if(e.results[i].isFinal)finalText+=part;else interimText+=part}if(finalText)liveTranscript+=finalText;speechTranscript.textContent=liveTranscript||interimText||ui('正在听……','Listening…')};recognition.onerror=e=>{recognitionFailed=true;showSpeechError(e.error)};recognition.onend=()=>{if(recognitionFailed)return;const text=(liveTranscript||speechTranscript.textContent).trim();setRecording(false);if(text&&text!==ui('正在听……','Listening…'))showCorrection(text);else showSpeechError('no-speech')};recognition.start()}catch(e){recognitionFailed=true;showSpeechError('start-failed')}}
function showCorrectionDemo(){setRecording(false);const w=currentLesson.vocab.find(x=>shadowingText.includes(x));showCorrection(w?shadowingText.replace(w,''):shadowingText.slice(0,-2),true)}
function resetCorrection(){if(recording&&recognition)recognition.stop();setRecording(false);speechResult.classList.remove('show');speechScore.textContent='--';speechTranscript.textContent=ui('正在听……','Listening…');speechFeedback.replaceChildren()}

function saveWord(){const word=modalWord.textContent.trim();if(!word){closeModal();return}const exists=learningState.savedWords.includes(word);if(!exists){learningState.savedWords.push(word);markLearningActivity();saveLearningState();renderLearningState()}toastMsg(exists?ui('已保存在生词本','Already in saved words'):ui('已加入生词本','Saved to your word list'));closeModal()}
function toastMsg(t){toast.textContent=t;toast.classList.add('show');clearTimeout(window._tt);window._tt=setTimeout(()=>toast.classList.remove('show'),1800)}

const dictionaryIntro=document.querySelector('#dictionary > div:first-child .sub');
if(dictionaryIntro)dictionaryIntro.textContent='输入汉字、繁体字、拼音或英文，直接查发音、义项、搭配和例句。';
dictInput.placeholder='本来 / 本來 / běn lái / ben3 lai2 / late';
ensureLearningQuickNav();
ensureThemedVocabularySection();
ensurePinyinLab();
renderHSK30Overview();
renderCourses();
bindWords(document);
renderLesson();
ensureWordbookCard();
setUiLanguage(uiLanguage,true);
renderLearningState();
document.addEventListener('qinghe:languagechange',renderLearningState);
document.addEventListener('qinghe:languagechange',()=>{if(document.getElementById('themedVocabModal')?.classList.contains('show'))renderThemedStudy()});
document.addEventListener('qinghe:identitychange',event=>{
  const detail=event.detail||{},rawName=String(detail.name||'').trim();
  const displayName=(rawName.includes('@')?rawName.split('@')[0]:rawName)||'Alex';
  learnerIdentity={signedIn:Boolean(detail.signedIn),name:detail.signedIn?displayName:'Alex',initial:detail.signedIn?(String(detail.initial||displayName.charAt(0)||'A').toUpperCase()):'A'};
  renderHomeRecommendation();
});
