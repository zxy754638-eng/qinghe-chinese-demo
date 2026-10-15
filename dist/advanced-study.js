// Exact headword assignments only: unassigned entries stay in the comprehensive index.
const ADVANCED_AREAS=[
 ['expression','思想与表达','Thought & expression',[
  ['reason','思考与判断','Thinking & judgement','权衡 斟酌 推敲 辨别 思索 思绪 构思 思维 逻辑 推理 推论 推断 论证 论点 论据 假设 悖论 反思 判断 见解 观念 意识 认知 理性 感性 客观 主观 偏见 洞察 领悟 启迪'],
  ['speech','沟通与表达','Communication','阐述 阐明 澄清 辩解 辩论 辩驳 反驳 陈述 表述 措辞 言论 言辞 口吻 语气 寓意 比喻 暗示 讽刺 概括 诠释 含义 内涵 隐喻 沟通 商榷 质疑']]],
 ['people','人际与社会','People & society',[
  ['relations','人际关系','Relationships','爱戴 敬仰 敬佩 敬重 崇敬 崇拜 信赖 依赖 体谅 谅解 谦让 包容 关怀 关照 惦记 牵挂 怀念 眷恋 隔阂 疏远 冷落 嫉妒 妒忌 仇恨 憎恨 亲密 默契 友谊'],
  ['community','公共生活','Community','社区 群体 民众 公民 公益 福利 慈善 志愿者 养老 保障 救济 救助 扶贫 民生 人口 移民 邻里 和睦 团结 歧视 平等']]],
 ['education','教育与学术','Education & academia',[
  ['research','学术研究','Research','学术 论文 文献 文凭 学历 学位 博士 硕士 本科 专科 院校 学科 科研 学者 学说 理论 假说 课题 研讨 研修 研究生 论著 著作 引用 摘要 注释 考证 素养'],
  ['learning','学习与教学','Learning & teaching','教材 教程 教学 教育 培训 培育 启蒙 辅导 指导 传授 传承 授课 讲授 讲座 讲义 答辩 应试 考核 考察 测验 测评 评估 复习 温习 自习 自学']]],
 ['work','职场与经济','Work & economy',[
  ['career','职业与组织','Careers & organisations','招聘 应聘 聘请 聘用 任职 就职 就业 失业 辞职 解雇 裁员 薪水 薪酬 津贴 福利 职位 职务 职称 职责 岗位 职员 雇员 雇主 绩效 业绩 考勤 加班 晋升 升职 管理 监管 统筹 协调 策划 决策'],
  ['economy','金融与商业','Finance & business','财政 金融 资本 资产 负债 债务 债券 股票 股份 股东 股市 投资 融资 筹资 贷款 利息 利率 汇率 通货膨胀 物价 税收 税率 纳税 营业 营销 促销 销售 贸易 进口 出口 关税 垄断 竞争 盈利 亏损 利润']]],
 ['culture','社会与文化','Culture & institutions',[
  ['culture','文化与传统','Culture & traditions','民俗 风俗 习俗 礼仪 仪式 典礼 庆典 祭祀 祭奠 传统 文化 文明 遗产 遗址 古迹 文物 考古 历史 朝代 皇帝 帝国 封建 祖先 祖宗 家谱 族谱 民族 种族 宗教 信仰'],
  ['law','制度与法律','Institutions & law','宪法 法规 法律 法制 法治 立法 司法 执法 违法 犯罪 罪犯 判决 审判 审理 诉讼 起诉 上诉 辩护 律师 检察官 法官 证据 证人 版权 侵权 追责 问责 权益 权利 义务 责任']]],
 ['science','科技与发展','Science & technology',[
  ['digital','数字技术','Digital technology','算法 编程 程序 软件 硬件 芯片 数据 数据库 网络 网站 网页 互联网 数字化 智能 智能化 人工智能 机器人 自动化 信息化 媒介 媒体 平台 终端 接口 服务器 存储 缓存 加密 解密 密码 隐私'],
  ['technology','科学与工程','Science & engineering','物理 化学 生物 基因 细胞 分子 原子 电子 质子 中子 元素 物质 能量 能源 电能 核能 核心 实验 试验 技术 工程 航空 航天 卫星 火箭 探测 测量 仪器 设备 机械 机床']]],
 ['nature','自然与环境','Nature & environment',[
  ['environment','生态与保护','Ecology & conservation','生态 环保 环境 污染 排放 废气 废水 废物 废弃物 垃圾 回收 循环 再生 可持续 植被 森林 湿地 沙漠 荒漠 草原 物种 动物 植物 生物多样性 灭绝 濒临 栖息 繁殖 保护区'],
  ['earth','气候与地理','Climate & geography','气候 气象 天气 暴雨 雷雨 干旱 洪水 洪涝 海啸 台风 飓风 龙卷风 地震 火山 冰川 冰山 南极 北极 纬度 经度 海拔 地形 地貌 山脉 山峰 盆地 高原 平原 丘陵 河流 湖泊 海洋']]],
 ['life','生活与品质','Life & wellbeing',[
  ['health','健康与身心','Health & wellbeing','保健 养生 健身 营养 蛋白质 脂肪 维生素 免疫 免疫力 细菌 病毒 感染 炎症 过敏 症状 诊断 诊疗 疗效 治疗 处方 药剂 疾病 癌症 肿瘤 心脏 血液 血压 血糖 肝脏 肺 腺 紧张 焦虑 抑郁'],
  ['food','饮食与美食','Food & dining','烹饪 烹调 烘焙 烧烤 煎 炸 蒸 煮 炖 焖 腌 酿 调料 调味 香料 酱油 醋 芝麻 辣椒 胡椒 芥末 奶酪 酸奶 咖啡 甜点 糕点 面包 饼干 馒头 饺子 食谱 菜谱 菜肴 餐饮 味觉 酸甜苦辣'],
  ['home','居住与日常','Home & daily life','居住 住宅 公寓 别墅 楼房 楼层 房租 租赁 房贷 装修 装饰 家具 家电 沙发 橱柜 衣柜 抽屉 地板 天花板 窗帘 阳台 庭院 卫生间 厨房 卧室 客厅 被褥 床垫 枕头'],
  ['arts','兴趣与艺术','Interests & arts','审美 艺术 绘画 书法 雕塑 雕刻 油画 水墨 国画 画廊 展览 展品 收藏 摄影 音乐 旋律 音符 节奏 乐器 钢琴 小提琴 吉他 戏剧 戏曲 歌剧 舞蹈 芭蕾 演奏 演唱 演出 旅游 旅行 度假 休闲']]]
];
window.advancedStudyDecks=new Map();
let advancedArea=null,advancedSearch='',advancedIndexSource=null,advancedGroups=[];
try{const path=JSON.parse(localStorage.getItem('qinghe-advanced-path')||'null');if(ADVANCED_AREAS.some(a=>a[0]===path))advancedArea=path}catch{}
function advancedCardItem(row){
 const local=words[row[1]];
 return {word:row[1],pinyin:row[2],en:row[3],hsk:'HSK 7–9',pos:local?.pos||'',example:row[4]||local?.e||'',exampleEn:row[5]||'',sequence:row[0]};
}
function buildAdvancedGroups(){
 if(!hsk79Vocabulary||advancedIndexSource===hsk79Vocabulary)return;
 advancedIndexSource=hsk79Vocabulary;window.advancedStudyDecks.clear();const rows=new Map(),assigned=new Set();hsk79Vocabulary.entries.forEach(row=>{if(!rows.has(row[1]))rows.set(row[1],[]);rows.get(row[1]).push(row)});
 advancedGroups=ADVANCED_AREAS.map(([id,title,titleEn,topics])=>({id,title,titleEn,topics:topics.map(([key,name,en,list])=>{
  const selected=list.split(' ').flatMap(word=>rows.get(word)||[]).filter(row=>{if(assigned.has(row[0]))return false;assigned.add(row[0]);return true});
  const deck={id:'adv-'+id+'-'+key,title:name,titleEn:en,level:'HSK 7–9',advanced:true,words:selected.map(advancedCardItem)};window.advancedStudyDecks.set(deck.id,deck);return deck;
 }).filter(deck=>deck.words.length)}));
 const remaining=hsk79Vocabulary.entries.filter(row=>!assigned.has(row[0]));const topics=[];
 for(let i=0;i<remaining.length;i+=40){const batch=remaining.slice(i,i+40),n=String(topics.length+1).padStart(2,'0');const deck={id:'adv-index-'+batch[0][0],title:'综合词目 '+n,titleEn:'General vocabulary '+n,level:'HSK 7–9',advanced:true,words:batch.map(advancedCardItem)};topics.push(deck);window.advancedStudyDecks.set(deck.id,deck)}
 advancedGroups.push({id:'general',title:'综合词目',titleEn:'General vocabulary',topics});
}
function advancedAreaOpen(id){advancedArea=id;advancedSearch='';try{localStorage.setItem('qinghe-advanced-path',JSON.stringify(id))}catch{}window.renderAdvancedPath();document.getElementById('advancedVocabulary')?.scrollIntoView({block:'start',behavior:'smooth'})}
function advancedSearchSubmit(event){event.preventDefault();advancedSearch=document.getElementById('advancedPathSearch').value.trim();window.renderAdvancedPath()}
function openAdvancedStudy(id){const deck=window.advancedStudyDecks.get(id);if(!deck?.words.length)return;openThemedDeck(id)}
function advancedSearchStudy(sequence){const row=advancedRowBySequence(sequence);if(!row)return;const id='adv-search-'+sequence;window.advancedStudyDecks.set(id,{id,title:'检索词卡',titleEn:'Search result',level:'HSK 7–9',advanced:true,words:[advancedCardItem(row)]});openAdvancedStudy(id)}
window.renderAdvancedPath=function(){
 const section=document.getElementById('advancedVocabulary');if(!section)return;buildAdvancedGroups();const esc=escapeHtml;
 const current=advancedGroups.find(group=>group.id===advancedArea);const total=hsk79Vocabulary?.entries.length||5600;
 section.innerHTML=`<div class="advanced-path-head"><div><p class="eyebrow">HSK 7–9</p><h2>${esc(current?ui(current.title,current.titleEn):ui('高级词库','Advanced lexicon'))}</h2><p class="sub">${ui('按领域选主题，用词卡循序学习。','Choose an area, explore a topic and study one card at a time.')}</p></div><span class="advanced-path-summary">${total.toLocaleString()} ${ui('词目','entries')}</span></div><form class="advanced-path-search" onsubmit="advancedSearchSubmit(event)"><input id="advancedPathSearch" type="search" aria-label="${ui('搜索高级词库','Search advanced vocabulary')}" placeholder="${ui('搜索汉字、拼音或英文','Search Chinese, pinyin or English')}" value="${esc(advancedSearch)}"><button class="secondary" type="submit">${ui('搜索','Search')}</button></form><div id="advancedVocabStatus" role="status"></div><div id="advancedPathBody"></div><p class="source-note advanced-path-source">${ui('词目、拼音与开放释义：','Headwords, pinyin and open meanings: ')}<a href="https://gushi-chinese.online/hsk-3.0/downloads" target="_blank" rel="noopener">Gushi HSK 3.0</a> · <a href="https://creativecommons.org/licenses/by-sa/4.0/" target="_blank" rel="noopener">CC BY-SA 4.0</a> · ${ui('主题为青禾学习编排；未标注的词性与例句不作推测。','Topics are Qinghe learning groupings. Missing word types and examples are not inferred.')}</p>`;
 const body=section.querySelector('#advancedPathBody');if(!hsk79Vocabulary){body.innerHTML='<p class="sub">'+ui('正在加载高级词库…','Loading advanced vocabulary…')+'</p>';getAdvancedVocabulary(false).catch(()=>{body.innerHTML='<button class="secondary" onclick="renderAdvancedPath()">'+ui('加载失败，点击重试','Could not load. Retry')+'</button>'});return}
 if(advancedSearch){const found=searchAdvancedEntries(advancedSearch,100);body.innerHTML=`<button class="ghost" onclick="advancedAreaOpen(null)">${ui('← 全部领域','← All areas')}</button><p class="sub">${ui('检索结果（最多显示 100 词）','Search results (up to 100 entries)')}</p><div class="advanced-topic-list">${found.map(row=>`<button class="advanced-path-card" onclick="advancedSearchStudy(${row[0]})"><span><strong>${esc(row[1])}</strong><small>${esc(row[2])} · ${esc(row[3])}</small></span><span aria-hidden="true">→</span></button>`).join('')||'<p>'+ui('没有匹配词目，请更换关键词。','No matches. Try another search.')+'</p>'}</div>`;return}
 if(current){body.innerHTML=`<button class="ghost advanced-back" onclick="advancedAreaOpen(null)">${ui('← 全部领域','← All areas')}</button>${current.id==='general'?'<p class="sub">'+ui('尚未细分主题的词目按原始顺序分组，全部保留。','Entries without topic assignments, grouped in their original order.')+'</p>':''}<div class="advanced-topic-list">${current.topics.map(deck=>{const progress=readThemedProgress(deck.id),count=deck.words.filter(word=>progress.reviewed.includes(word.word)).length;return `<button class="advanced-path-card" onclick="openAdvancedStudy('${deck.id}')"><span><strong>${esc(ui(deck.title,deck.titleEn))}</strong><small>${deck.words.length} ${ui('词','words')} · ${ui('已学','learned')} ${count}</small></span><span aria-hidden="true">→</span></button>`}).join('')}</div>`;return}
 body.innerHTML='<div class="advanced-area-grid">'+advancedGroups.map(group=>`<button class="advanced-path-card" onclick="advancedAreaOpen('${group.id}')"><span><strong>${esc(ui(group.title,group.titleEn))}</strong><small>${group.topics.reduce((n,deck)=>n+deck.words.length,0)} ${ui('词','words')} · ${group.topics.length} ${ui('组','groups')}</small></span><span aria-hidden="true">→</span></button>`).join('')+'</div>';
};
document.addEventListener('keydown',event=>{if(!['ArrowLeft','ArrowRight'].includes(event.key)||event.repeat||!document.getElementById('themedVocabModal')?.classList.contains('show')||event.target.closest('input,textarea,select,[contenteditable="true"]'))return;event.preventDefault();gradeThemedWord(event.key==='ArrowLeft'?'hard':'good')});
window.renderAdvancedPath();
