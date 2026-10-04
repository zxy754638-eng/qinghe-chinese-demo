// 青禾中文主题词库：领域体系、分类、英文义项与例句均为本项目教学整理。
// 拼音统一使用声调符号；主题词条会同时并入站内学习词典。
const themedVocabularyDecks=[
  {
    id:'colors',mark:'色',title:'颜色',titleEn:'Colors',pos:['noun','adjective'],level:'HSK 1–2',
    words:[
      {word:'红色',pinyin:'hóng sè',en:'red',pos:'名词 / 形容词',hsk:'HSK 1',example:'我喜欢红色的衣服。'},
      {word:'蓝色',pinyin:'lán sè',en:'blue',pos:'名词 / 形容词',hsk:'HSK 1',example:'天空是蓝色的。'},
      {word:'绿色',pinyin:'lǜ sè',en:'green',pos:'名词 / 形容词',hsk:'HSK 1',example:'这片叶子是绿色的。'},
      {word:'黄色',pinyin:'huáng sè',en:'yellow',pos:'名词 / 形容词',hsk:'HSK 1',example:'她买了一把黄色的伞。'},
      {word:'白色',pinyin:'bái sè',en:'white',pos:'名词 / 形容词',hsk:'HSK 1',example:'桌上有一个白色的杯子。'},
      {word:'黑色',pinyin:'hēi sè',en:'black',pos:'名词 / 形容词',hsk:'HSK 1',example:'他的书包是黑色的。'},
      {word:'粉色',pinyin:'fěn sè',en:'pink',pos:'名词 / 形容词',hsk:'HSK 2',example:'春天开了很多粉色的花。'},
      {word:'紫色',pinyin:'zǐ sè',en:'purple',pos:'名词 / 形容词',hsk:'HSK 2',example:'我想试试那件紫色的外套。'}
    ]
  },
  {
    id:'animals',mark:'动',title:'动物',titleEn:'Animals',pos:['noun'],level:'HSK 1–3',
    words:[
      {word:'猫',pinyin:'māo',en:'cat',pos:'名词',hsk:'HSK 1',example:'那只猫正在睡觉。'},
      {word:'狗',pinyin:'gǒu',en:'dog',pos:'名词',hsk:'HSK 1',example:'这只狗很喜欢跟人玩。'},
      {word:'熊猫',pinyin:'xióng māo',en:'panda',pos:'名词',hsk:'HSK 1',example:'熊猫喜欢吃竹子。'},
      {word:'鸟',pinyin:'niǎo',en:'bird',pos:'名词',hsk:'HSK 2',example:'树上有两只鸟。'},
      {word:'鱼',pinyin:'yú',en:'fish',pos:'名词',hsk:'HSK 1',example:'水里有很多鱼。'},
      {word:'马',pinyin:'mǎ',en:'horse',pos:'名词',hsk:'HSK 2',example:'草地上有一匹马。'},
      {word:'兔子',pinyin:'tù zi',en:'rabbit',pos:'名词',hsk:'HSK 2',example:'这只兔子有长长的耳朵。'},
      {word:'大象',pinyin:'dà xiàng',en:'elephant',pos:'名词',hsk:'HSK 3',example:'大象的鼻子很长。'}
    ]
  },
  {
    id:'plants',mark:'植',title:'植物',titleEn:'Plants',pos:['noun'],level:'HSK 1–3',
    words:[
      {word:'花',pinyin:'huā',en:'flower',pos:'名词',hsk:'HSK 1',example:'桌上有一束花。'},
      {word:'树',pinyin:'shù',en:'tree',pos:'名词',hsk:'HSK 1',example:'学校门口有一棵大树。'},
      {word:'草',pinyin:'cǎo',en:'grass',pos:'名词',hsk:'HSK 2',example:'雨后的草很绿。'},
      {word:'竹子',pinyin:'zhú zi',en:'bamboo',pos:'名词',hsk:'HSK 2',example:'院子里种了很多竹子。'},
      {word:'玫瑰',pinyin:'méi gui',en:'rose',pos:'名词',hsk:'HSK 3',example:'他送给妈妈一朵玫瑰。'},
      {word:'莲花',pinyin:'lián huā',en:'lotus',pos:'名词',hsk:'HSK 3',example:'夏天池塘里会开莲花。'},
      {word:'松树',pinyin:'sōng shù',en:'pine tree',pos:'名词',hsk:'HSK 3',example:'山上长着很多松树。'},
      {word:'叶子',pinyin:'yè zi',en:'leaf',pos:'名词',hsk:'HSK 2',example:'秋天，叶子慢慢变黄了。'}
    ]
  },
  {
    id:'food',mark:'食',title:'食物',titleEn:'Food',pos:['noun'],level:'HSK 1–2',
    words:[
      {word:'米饭',pinyin:'mǐ fàn',en:'cooked rice',pos:'名词',hsk:'HSK 1',example:'我中午想吃米饭。'},
      {word:'面条',pinyin:'miàn tiáo',en:'noodles',pos:'名词',hsk:'HSK 1',example:'这家店的面条很好吃。'},
      {word:'饺子',pinyin:'jiǎo zi',en:'dumplings',pos:'名词',hsk:'HSK 1',example:'春节的时候我们一起包饺子。'},
      {word:'苹果',pinyin:'píng guǒ',en:'apple',pos:'名词',hsk:'HSK 1',example:'我每天吃一个苹果。'},
      {word:'鸡蛋',pinyin:'jī dàn',en:'egg',pos:'名词',hsk:'HSK 1',example:'早餐有鸡蛋和牛奶。'},
      {word:'牛奶',pinyin:'niú nǎi',en:'milk',pos:'名词',hsk:'HSK 1',example:'孩子每天早上喝牛奶。'},
      {word:'蔬菜',pinyin:'shū cài',en:'vegetables',pos:'名词',hsk:'HSK 2',example:'多吃蔬菜对身体好。'},
      {word:'水果',pinyin:'shuǐ guǒ',en:'fruit',pos:'名词',hsk:'HSK 1',example:'桌上有很多新鲜水果。'}
    ]
  },
  {
    id:'transport',mark:'行',title:'交通',titleEn:'Transport',pos:['noun'],level:'HSK 1–3',
    words:[
      {word:'地铁',pinyin:'dì tiě',en:'subway',pos:'名词',hsk:'HSK 2',example:'我每天坐地铁上班。'},
      {word:'公共汽车',pinyin:'gōng gòng qì chē',en:'bus',pos:'名词',hsk:'HSK 1',example:'公共汽车马上就到了。'},
      {word:'火车',pinyin:'huǒ chē',en:'train',pos:'名词',hsk:'HSK 1',example:'我们坐火车去上海。'},
      {word:'飞机',pinyin:'fēi jī',en:'airplane',pos:'名词',hsk:'HSK 1',example:'飞机下午三点起飞。'},
      {word:'出租车',pinyin:'chū zū chē',en:'taxi',pos:'名词',hsk:'HSK 2',example:'下雨了，我们打出租车吧。'},
      {word:'自行车',pinyin:'zì xíng chē',en:'bicycle',pos:'名词',hsk:'HSK 2',example:'他骑自行车去学校。'},
      {word:'高铁',pinyin:'gāo tiě',en:'high-speed rail',pos:'名词',hsk:'HSK 3',example:'坐高铁去北京很方便。'},
      {word:'船',pinyin:'chuán',en:'boat; ship',pos:'名词',hsk:'HSK 2',example:'我们坐船去了小岛。'}
    ]
  },
  {
    id:'weather',mark:'天',title:'天气',titleEn:'Weather',pos:['noun','verb','adjective'],level:'HSK 1–3',
    words:[
      {word:'晴天',pinyin:'qíng tiān',en:'sunny day',pos:'名词',hsk:'HSK 2',example:'明天是晴天，适合出去玩。'},
      {word:'阴天',pinyin:'yīn tiān',en:'cloudy day',pos:'名词',hsk:'HSK 2',example:'今天是阴天，看不到太阳。'},
      {word:'下雨',pinyin:'xià yǔ',en:'to rain',pos:'动词',hsk:'HSK 1',example:'外面正在下雨，别忘了带伞。'},
      {word:'下雪',pinyin:'xià xuě',en:'to snow',pos:'动词',hsk:'HSK 2',example:'冬天这里常常下雪。'},
      {word:'刮风',pinyin:'guā fēng',en:'to be windy',pos:'动词',hsk:'HSK 2',example:'外面刮风了，有一点冷。'},
      {word:'热',pinyin:'rè',en:'hot',pos:'形容词',hsk:'HSK 1',example:'今天太热了。'},
      {word:'冷',pinyin:'lěng',en:'cold',pos:'形容词',hsk:'HSK 1',example:'晚上会很冷，多穿一点。'},
      {word:'温度',pinyin:'wēn dù',en:'temperature',pos:'名词',hsk:'HSK 3',example:'今天的最高温度是二十八度。'}
    ]
  },
  {
    id:'family',mark:'家',title:'家庭',titleEn:'Family',pos:['noun'],level:'HSK 1–2',
    words:[
      {word:'爸爸',pinyin:'bà ba',en:'father; dad',pos:'名词',hsk:'HSK 1',example:'我爸爸喜欢早上跑步。'},
      {word:'妈妈',pinyin:'mā ma',en:'mother; mom',pos:'名词',hsk:'HSK 1',example:'妈妈正在厨房做饭。'},
      {word:'父母',pinyin:'fù mǔ',en:'parents',pos:'名词',hsk:'HSK 2',example:'我的父母住在南方。'},
      {word:'哥哥',pinyin:'gē ge',en:'older brother',pos:'名词',hsk:'HSK 1',example:'哥哥比我大三岁。'},
      {word:'姐姐',pinyin:'jiě jie',en:'older sister',pos:'名词',hsk:'HSK 1',example:'姐姐在大学学习中文。'},
      {word:'弟弟',pinyin:'dì di',en:'younger brother',pos:'名词',hsk:'HSK 1',example:'弟弟今年十岁。'},
      {word:'妹妹',pinyin:'mèi mei',en:'younger sister',pos:'名词',hsk:'HSK 1',example:'妹妹正在画一只小猫。'},
      {word:'孩子',pinyin:'hái zi',en:'child; children',pos:'名词',hsk:'HSK 1',example:'孩子们在公园里玩。'}
    ]
  },
  {
    id:'body',mark:'身',title:'身体',titleEn:'Body',pos:['noun'],level:'HSK 1–4',
    words:[
      {word:'头',pinyin:'tóu',en:'head',pos:'名词',hsk:'HSK 2',example:'他的头有一点疼。'},
      {word:'眼睛',pinyin:'yǎn jing',en:'eyes',pos:'名词',hsk:'HSK 1',example:'她的眼睛很漂亮。'},
      {word:'耳朵',pinyin:'ěr duo',en:'ears',pos:'名词',hsk:'HSK 2',example:'兔子的耳朵很长。'},
      {word:'鼻子',pinyin:'bí zi',en:'nose',pos:'名词',hsk:'HSK 2',example:'天气冷的时候，我的鼻子会红。'},
      {word:'嘴',pinyin:'zuǐ',en:'mouth',pos:'名词',hsk:'HSK 2',example:'请张开嘴，慢慢地说。'},
      {word:'手',pinyin:'shǒu',en:'hand',pos:'名词',hsk:'HSK 1',example:'吃饭前要先洗手。'},
      {word:'脚',pinyin:'jiǎo',en:'foot',pos:'名词',hsk:'HSK 2',example:'我今天走得太多，脚有点累。'},
      {word:'心脏',pinyin:'xīn zàng',en:'heart',pos:'名词',hsk:'HSK 4',example:'运动对心脏健康有好处。'}
    ]
  },
  {
    id:'clothing',mark:'衣',title:'服装',titleEn:'Clothing',pos:['noun'],level:'HSK 1–3',
    words:[
      {word:'衬衫',pinyin:'chèn shān',en:'shirt',pos:'名词',hsk:'HSK 2',example:'他今天穿了一件白衬衫。'},
      {word:'裤子',pinyin:'kù zi',en:'trousers; pants',pos:'名词',hsk:'HSK 1',example:'这条裤子有一点长。'},
      {word:'裙子',pinyin:'qún zi',en:'skirt; dress',pos:'名词',hsk:'HSK 2',example:'她买了一条蓝色的裙子。'},
      {word:'外套',pinyin:'wài tào',en:'coat; jacket',pos:'名词',hsk:'HSK 2',example:'外面很冷，记得穿外套。'},
      {word:'鞋',pinyin:'xié',en:'shoes',pos:'名词',hsk:'HSK 1',example:'这双鞋走路很舒服。'},
      {word:'帽子',pinyin:'mào zi',en:'hat; cap',pos:'名词',hsk:'HSK 2',example:'太阳很大，戴上帽子吧。'},
      {word:'袜子',pinyin:'wà zi',en:'socks',pos:'名词',hsk:'HSK 3',example:'我需要买两双新袜子。'},
      {word:'围巾',pinyin:'wéi jīn',en:'scarf',pos:'名词',hsk:'HSK 3',example:'这条围巾是奶奶送给我的。'}
    ]
  },
  {
    id:'jobs',mark:'职',title:'职业',titleEn:'Jobs',pos:['noun'],level:'HSK 1–4',
    words:[
      {word:'老师',pinyin:'lǎo shī',en:'teacher',pos:'名词',hsk:'HSK 1',example:'王老师教我们汉语。'},
      {word:'医生',pinyin:'yī shēng',en:'doctor',pos:'名词',hsk:'HSK 1',example:'医生建议我多休息。'},
      {word:'司机',pinyin:'sī jī',en:'driver',pos:'名词',hsk:'HSK 2',example:'出租车司机很熟悉这座城市。'},
      {word:'厨师',pinyin:'chú shī',en:'cook; chef',pos:'名词',hsk:'HSK 3',example:'这位厨师最会做川菜。'},
      {word:'记者',pinyin:'jì zhě',en:'journalist; reporter',pos:'名词',hsk:'HSK 3',example:'记者正在采访运动员。'},
      {word:'工程师',pinyin:'gōng chéng shī',en:'engineer',pos:'名词',hsk:'HSK 3',example:'姐姐是一名软件工程师。'},
      {word:'律师',pinyin:'lǜ shī',en:'lawyer',pos:'名词',hsk:'HSK 4',example:'他们请律师帮助处理这个问题。'},
      {word:'服务员',pinyin:'fú wù yuán',en:'waiter; service worker',pos:'名词',hsk:'HSK 2',example:'服务员给我们拿来了菜单。'}
    ]
  },
  {
    id:'emotions',mark:'心',title:'情绪',titleEn:'Emotions',pos:['verb','adjective'],level:'HSK 2–4',
    words:[
      {word:'高兴',pinyin:'gāo xìng',en:'happy; glad',pos:'形容词',hsk:'HSK 1',example:'见到老朋友，我非常高兴。'},
      {word:'难过',pinyin:'nán guò',en:'sad; upset',pos:'形容词',hsk:'HSK 2',example:'听到这个消息，她有点难过。'},
      {word:'生气',pinyin:'shēng qì',en:'angry; to get angry',pos:'动词 / 形容词',hsk:'HSK 2',example:'别生气，我们可以慢慢商量。'},
      {word:'紧张',pinyin:'jǐn zhāng',en:'nervous; tense',pos:'形容词',hsk:'HSK 3',example:'第一次上台讲话，我很紧张。'},
      {word:'害怕',pinyin:'hài pà',en:'afraid; scared',pos:'动词 / 形容词',hsk:'HSK 2',example:'孩子有一点害怕黑夜。'},
      {word:'放心',pinyin:'fàng xīn',en:'relieved; reassured',pos:'动词 / 形容词',hsk:'HSK 3',example:'你放心，我会按时完成。'},
      {word:'失望',pinyin:'shī wàng',en:'disappointed',pos:'形容词',hsk:'HSK 4',example:'虽然结果不理想，但别太失望。'},
      {word:'兴奋',pinyin:'xīng fèn',en:'excited',pos:'形容词',hsk:'HSK 4',example:'想到明天要旅行，大家都很兴奋。'}
    ]
  },
  {
    id:'common-verbs',mark:'做',title:'常用动词',titleEn:'Common verbs',pos:['verb'],level:'HSK 1–2',
    words:[
      {word:'吃',pinyin:'chī',en:'to eat',pos:'动词',hsk:'HSK 1',example:'我们一起去吃午饭吧。'},
      {word:'喝',pinyin:'hē',en:'to drink',pos:'动词',hsk:'HSK 1',example:'运动以后要多喝水。'},
      {word:'看',pinyin:'kàn',en:'to look; to watch; to read',pos:'动词',hsk:'HSK 1',example:'周末我们去看电影。'},
      {word:'听',pinyin:'tīng',en:'to listen',pos:'动词',hsk:'HSK 1',example:'我每天听中文新闻。'},
      {word:'说',pinyin:'shuō',en:'to speak; to say',pos:'动词',hsk:'HSK 1',example:'请说慢一点，我还在学习。'},
      {word:'写',pinyin:'xiě',en:'to write',pos:'动词',hsk:'HSK 1',example:'她正在写一封电子邮件。'},
      {word:'买',pinyin:'mǎi',en:'to buy',pos:'动词',hsk:'HSK 1',example:'下班以后我要去买菜。'},
      {word:'帮助',pinyin:'bāng zhù',en:'to help; help',pos:'动词 / 名词',hsk:'HSK 2',example:'谢谢你帮助我练习中文。'}
    ]
  }
];

const themedVocabularyDomains=[
  {id:'all',title:'全部领域',titleEn:'All areas'},
  {id:'everyday',title:'日常与起居',titleEn:'Daily life'},
  {id:'people',title:'人与关系',titleEn:'People & relationships'},
  {id:'mobility',title:'出行与办事',titleEn:'Getting around'},
  {id:'study',title:'学习与工作',titleEn:'Study & work'},
  {id:'wellness',title:'健康与运动',titleEn:'Health & movement'},
  {id:'nature',title:'自然与生态',titleEn:'Nature & ecology'},
  {id:'culture',title:'文化与休闲',titleEn:'Culture & leisure'},
  {id:'advanced',title:'社会与专业',titleEn:'Society & specialist topics'}
];

const themeWord=([word,pinyin,en,pos,hsk,example])=>({word,pinyin,en,pos,hsk,example});
const themeDeck=(id,domain,mark,title,titleEn,pos,level,rows)=>({id,domain,mark,title,titleEn,pos,level,words:rows.map(themeWord)});

// 原有主题保持相同 id，用户已经保存的学习进度可以继续使用。
const themedDomainByDeck={
  colors:'everyday',animals:'nature',plants:'nature',food:'everyday',transport:'mobility',weather:'nature',
  family:'people',body:'wellness',clothing:'everyday',jobs:'study',emotions:'people','common-verbs':'everyday'
};
const themedVocabularyExpansions={
  colors:[
    ['灰色','huī sè','gray','名词 / 形容词','HSK 2','阴天的时候，天空常常是灰色的。'],
    ['橙色','chéng sè','orange','名词 / 形容词','HSK 3','她用橙色的笔画了一个太阳。']
  ],
  animals:[
    ['狮子','shī zi','lion','名词','HSK 3','动物园里的狮子正在休息。'],
    ['海豚','hǎi tún','dolphin','名词','HSK 4','海豚是一种聪明的海洋动物。']
  ],
  plants:[
    ['种子','zhǒng zi','seed','名词','HSK 3','春天我们把种子种在土里。'],
    ['森林','sēn lín','forest','名词','HSK 3','这片森林里生活着很多动物。']
  ],
  food:[
    ['豆腐','dòu fu','tofu','名词','HSK 2','这道菜里有豆腐和青菜。'],
    ['汤','tāng','soup','名词','HSK 2','天气冷的时候，我喜欢喝热汤。']
  ],
  transport:[
    ['车站','chē zhàn','station; stop','名词','HSK 2','下一个车站就是市中心。'],
    ['换乘','huàn chéng','to transfer','动词','HSK 4','去机场需要在这里换乘地铁。']
  ],
  weather:[
    ['多云','duō yún','cloudy','形容词','HSK 3','天气预报说明天多云。'],
    ['湿度','shī dù','humidity','名词','HSK 5','夏天这里的湿度比较高。']
  ],
  family:[
    ['丈夫','zhàng fu','husband','名词','HSK 3','她和丈夫周末一起做饭。'],
    ['妻子','qī zi','wife','名词','HSK 3','他的妻子是一名医生。']
  ],
  body:[
    ['肩膀','jiān bǎng','shoulder','名词','HSK 4','背包太重了，我的肩膀有点疼。'],
    ['胃','wèi','stomach','名词','HSK 4','空着胃喝咖啡可能不太舒服。']
  ],
  clothing:[
    ['手套','shǒu tào','gloves','名词','HSK 3','下雪天出门要戴手套。'],
    ['尺码','chǐ mǎ','size','名词','HSK 4','请问这件衣服有大一点的尺码吗？']
  ],
  jobs:[
    ['护士','hù shi','nurse','名词','HSK 3','护士帮病人量了体温。'],
    ['设计师','shè jì shī','designer','名词','HSK 4','这位设计师喜欢简单的风格。']
  ],
  emotions:[
    ['放松','fàng sōng','relaxed; to relax','动词 / 形容词','HSK 3','听音乐能让我慢慢放松下来。'],
    ['满意','mǎn yì','satisfied','形容词','HSK 3','大家对这次活动非常满意。']
  ],
  'common-verbs':[
    ['选择','xuǎn zé','to choose; choice','动词 / 名词','HSK 3','你可以选择适合自己的课程。'],
    ['决定','jué dìng','to decide; decision','动词 / 名词','HSK 3','我们决定周末去爬山。']
  ]
};

for(const deck of themedVocabularyDecks){
  deck.domain=themedDomainByDeck[deck.id]||'everyday';
  deck.words.push(...(themedVocabularyExpansions[deck.id]||[]).map(themeWord));
}

themedVocabularyDecks.push(
  themeDeck('home','everyday','居','居家空间','Home spaces',['noun'],'HSK 1–3',[
    ['客厅','kè tīng','living room','名词','HSK 2','我们在客厅里聊天。'],
    ['卧室','wò shì','bedroom','名词','HSK 2','我的卧室不大，但是很安静。'],
    ['厨房','chú fáng','kitchen','名词','HSK 2','爸爸正在厨房准备晚饭。'],
    ['阳台','yáng tái','balcony','名词','HSK 3','阳台上种着几盆花。'],
    ['门口','mén kǒu','doorway; entrance','名词','HSK 2','快递已经放在门口了。'],
    ['楼下','lóu xià','downstairs','名词 / 方位词','HSK 2','楼下有一家便利店。'],
    ['邻居','lín jū','neighbor','名词','HSK 3','新邻居很友好。'],
    ['家具','jiā jù','furniture','名词','HSK 4','这套家具的颜色很温暖。'],
    ['钥匙','yào shi','key','名词','HSK 3','我把钥匙忘在办公室了。'],
    ['地址','dì zhǐ','address','名词','HSK 3','请把收货地址再确认一遍。']
  ]),
  themeDeck('chores','everyday','务','家务与整理','Home routines',['verb'],'HSK 2–4',[
    ['打扫','dǎ sǎo','to clean','动词','HSK 2','周六上午我们一起打扫房间。'],
    ['整理','zhěng lǐ','to tidy; to organize','动词','HSK 3','请先整理一下桌上的文件。'],
    ['洗衣服','xǐ yī fu','to do the laundry','动词','HSK 2','我通常晚上洗衣服。'],
    ['晾衣服','liàng yī fu','to hang clothes to dry','动词','HSK 4','雨停以后再去阳台晾衣服。'],
    ['做饭','zuò fàn','to cook','动词','HSK 1','下班后我喜欢自己做饭。'],
    ['洗碗','xǐ wǎn','to wash dishes','动词','HSK 2','今天我做饭，你洗碗。'],
    ['倒垃圾','dào lā ji','to take out the trash','动词','HSK 3','出门的时候别忘了倒垃圾。'],
    ['修理','xiū lǐ','to repair','动词','HSK 4','师傅明天来修理洗衣机。'],
    ['收拾','shōu shi','to put in order; pack up','动词','HSK 3','我们收拾好东西就出发。'],
    ['搬家','bān jiā','to move house','动词','HSK 3','她下个月要搬家。']
  ]),
  themeDeck('personality','people','性','性格与特点','Personality',['adjective'],'HSK 2–4',[
    ['认真','rèn zhēn','serious; conscientious','形容词','HSK 2','她学习的时候非常认真。'],
    ['热情','rè qíng','warm; enthusiastic','形容词','HSK 3','当地人热情地欢迎了我们。'],
    ['友好','yǒu hǎo','friendly','形容词','HSK 3','新同学对大家都很友好。'],
    ['耐心','nài xīn','patient; patience','形容词 / 名词','HSK 4','老师很耐心地解释了三遍。'],
    ['诚实','chéng shí','honest','形容词','HSK 4','诚实是很重要的品质。'],
    ['勇敢','yǒng gǎn','brave','形容词','HSK 3','她勇敢地说出了自己的想法。'],
    ['开朗','kāi lǎng','cheerful; outgoing','形容词','HSK 4','他性格开朗，很容易交朋友。'],
    ['安静','ān jìng','quiet','形容词','HSK 2','她比较安静，但很喜欢帮助别人。'],
    ['幽默','yōu mò','humorous','形容词','HSK 4','他的讲话很幽默。'],
    ['独立','dú lì','independent','形容词','HSK 4','留学让我变得更加独立。']
  ]),
  themeDeck('relationships','people','伴','社交关系','Social connections',['noun','verb'],'HSK 1–4',[
    ['同学','tóng xué','classmate','名词','HSK 1','我和同学一起准备考试。'],
    ['同事','tóng shì','coworker','名词','HSK 2','新同事今天来公司报到。'],
    ['朋友','péng you','friend','名词','HSK 1','朋友邀请我去她家吃饭。'],
    ['客人','kè rén','guest; customer','名词','HSK 2','家里来了两位客人。'],
    ['室友','shì yǒu','roommate','名词','HSK 4','我的室友每天很早起床。'],
    ['伙伴','huǒ bàn','partner; companion','名词','HSK 4','学习伙伴可以互相鼓励。'],
    ['联系','lián xì','to contact; connection','动词 / 名词','HSK 3','到北京以后请和我联系。'],
    ['相处','xiāng chǔ','to get along','动词','HSK 4','我们相处得很愉快。'],
    ['信任','xìn rèn','to trust; trust','动词 / 名词','HSK 4','合作需要彼此信任。'],
    ['结婚','jié hūn','to get married','动词','HSK 3','他们计划明年结婚。']
  ]),
  themeDeck('travel','mobility','旅','旅行准备','Travel essentials',['noun','verb'],'HSK 2–4',[
    ['护照','hù zhào','passport','名词','HSK 3','出国前请检查护照是否有效。'],
    ['签证','qiān zhèng','visa','名词','HSK 4','我正在网上申请旅游签证。'],
    ['行李','xíng li','luggage','名词','HSK 3','这件行李可以带上飞机吗？'],
    ['酒店','jiǔ diàn','hotel','名词','HSK 2','我们预订了车站附近的酒店。'],
    ['景点','jǐng diǎn','tourist attraction','名词','HSK 4','这个城市有很多历史景点。'],
    ['地图','dì tú','map','名词','HSK 2','先在地图上看看路线吧。'],
    ['预订','yù dìng','to reserve; booking','动词 / 名词','HSK 4','最好提前预订火车票。'],
    ['出发','chū fā','to set off','动词','HSK 3','我们明天早上七点出发。'],
    ['到达','dào dá','to arrive','动词','HSK 3','火车将在下午到达南京。'],
    ['迷路','mí lù','to get lost','动词','HSK 3','如果迷路了，可以问工作人员。']
  ]),
  themeDeck('shopping','mobility','购','购物与付款','Shopping & payment',['noun','verb','adjective'],'HSK 1–4',[
    ['价格','jià gé','price','名词','HSK 3','这两家商店的价格差不多。'],
    ['打折','dǎ zhé','to offer a discount','动词','HSK 3','这家商店周末会打折。'],
    ['付款','fù kuǎn','to pay; payment','动词 / 名词','HSK 4','您可以用手机付款。'],
    ['现金','xiàn jīn','cash','名词','HSK 3','这家小店只收现金。'],
    ['零钱','líng qián','small change','名词','HSK 3','我没有零钱，可以扫码吗？'],
    ['发票','fā piào','invoice; receipt','名词','HSK 4','付款后请保存好发票。'],
    ['退货','tuì huò','to return goods','动词','HSK 4','商品没有使用过才能退货。'],
    ['试穿','shì chuān','to try on clothes','动词','HSK 4','这条裙子可以试穿吗？'],
    ['便宜','pián yi','inexpensive','形容词','HSK 1','网上买票可能更便宜。'],
    ['贵','guì','expensive','形容词','HSK 1','这里的咖啡有一点贵。']
  ]),
  themeDeck('public-services','mobility','办','城市办事','City services',['noun','verb'],'HSK 2–5',[
    ['银行','yín háng','bank','名词','HSK 2','银行周末下午不营业。'],
    ['派出所','pài chū suǒ','local police station','名词','HSK 5','丢失证件后可以去派出所咨询。'],
    ['图书馆','tú shū guǎn','library','名词','HSK 2','办借书证需要去图书馆前台。'],
    ['博物馆','bó wù guǎn','museum','名词','HSK 3','博物馆每周一闭馆。'],
    ['办事处','bàn shì chù','service office','名词','HSK 5','请到社区办事处提交材料。'],
    ['窗口','chuāng kǒu','service window; window','名词','HSK 3','请在三号窗口办理手续。'],
    ['排队','pái duì','to line up','动词','HSK 3','取号以后请排队等候。'],
    ['申请','shēn qǐng','to apply; application','动词 / 名词','HSK 4','学生可以在线申请这项服务。'],
    ['证件','zhèng jiàn','identity document','名词','HSK 4','请带好护照等有效证件。'],
    ['手续','shǒu xù','formalities; procedure','名词','HSK 4','这些手续大约需要十分钟。']
  ]),
  themeDeck('school','study','校','校园生活','Campus life',['noun'],'HSK 1–4',[
    ['校园','xiào yuán','campus','名词','HSK 3','秋天的校园很漂亮。'],
    ['教室','jiào shì','classroom','名词','HSK 1','学生们已经走进教室了。'],
    ['宿舍','sù shè','dormitory','名词','HSK 3','我的宿舍离食堂很近。'],
    ['食堂','shí táng','canteen','名词','HSK 3','学校食堂中午人很多。'],
    ['操场','cāo chǎng','sports field','名词','HSK 3','下课后我们去操场跑步。'],
    ['课本','kè běn','textbook','名词','HSK 2','请打开课本第五页。'],
    ['作业','zuò yè','homework','名词','HSK 1','今天的作业不太难。'],
    ['考试','kǎo shì','exam; test','名词','HSK 1','下周我们有一次听力考试。'],
    ['成绩','chéng jì','grade; result','名词','HSK 3','她的考试成绩进步很快。'],
    ['学期','xué qī','semester','名词','HSK 3','这个学期我选了五门课。']
  ]),
  themeDeck('study-skills','study','学','学习方法','Study skills',['verb'],'HSK 2–5',[
    ['复习','fù xí','to review','动词','HSK 2','我每天晚上复习当天的新词。'],
    ['预习','yù xí','to preview a lesson','动词','HSK 4','上课前先预习课文。'],
    ['记笔记','jì bǐ jì','to take notes','动词','HSK 3','听讲的时候要学会记笔记。'],
    ['查资料','chá zī liào','to look up information','动词','HSK 4','我们去图书馆查资料吧。'],
    ['练习','liàn xí','to practice; exercise','动词 / 名词','HSK 2','多练习才能说得更自然。'],
    ['理解','lǐ jiě','to understand','动词','HSK 3','我理解这句话的意思了。'],
    ['记住','jì zhu','to remember','动词','HSK 2','请记住这个词的声调。'],
    ['总结','zǒng jié','to summarize; summary','动词 / 名词','HSK 4','学完一课后要及时总结。'],
    ['提问','tí wèn','to ask a question','动词','HSK 4','有不明白的地方可以提问。'],
    ['讨论','tǎo lùn','to discuss; discussion','动词 / 名词','HSK 3','小组正在讨论学习计划。']
  ]),
  themeDeck('workplace','study','工','职场协作','Workplace collaboration',['noun','verb'],'HSK 3–5',[
    ['公司','gōng sī','company','名词','HSK 2','她在一家科技公司工作。'],
    ['办公室','bàn gōng shì','office','名词','HSK 3','经理现在不在办公室。'],
    ['会议','huì yì','meeting; conference','名词','HSK 3','下午的会议两点开始。'],
    ['项目','xiàng mù','project','名词','HSK 4','这个项目需要三个部门合作。'],
    ['任务','rèn wu','task; assignment','名词','HSK 4','我们按时完成了任务。'],
    ['合同','hé tong','contract','名词','HSK 4','签合同前要认真阅读。'],
    ['客户','kè hù','client; customer','名词','HSK 4','明天我们要去见客户。'],
    ['加班','jiā bān','to work overtime','动词','HSK 3','这个星期我不用加班。'],
    ['请假','qǐng jià','to ask for leave','动词','HSK 3','身体不舒服就请假休息。'],
    ['工资','gōng zī','salary; wages','名词','HSK 4','工资会在每月五号发放。']
  ]),
  themeDeck('medical','wellness','医','看病与恢复','Medical care',['noun','verb','adjective'],'HSK 2–4',[
    ['感冒','gǎn mào','to have a cold; cold','动词 / 名词','HSK 2','我好像感冒了，一直流鼻涕。'],
    ['发烧','fā shāo','to have a fever','动词','HSK 2','孩子昨晚有一点发烧。'],
    ['咳嗽','ké sou','to cough; cough','动词 / 名词','HSK 3','如果一直咳嗽，请及时看医生。'],
    ['头疼','tóu téng','headache; head hurts','形容词 / 动词','HSK 2','我睡得太少，现在有点头疼。'],
    ['挂号','guà hào','to register at a hospital','动词','HSK 4','看病前要先在一楼挂号。'],
    ['检查','jiǎn chá','to examine; examination','动词 / 名词','HSK 3','医生建议我做进一步检查。'],
    ['药','yào','medicine','名词','HSK 1','这种药需要饭后吃。'],
    ['处方','chǔ fāng','prescription','名词','HSK 5','请按照处方上的说明用药。'],
    ['恢复','huī fù','to recover; restore','动词','HSK 4','经过休息，他恢复得很好。'],
    ['急救','jí jiù','first aid; emergency treatment','名词 / 动词','HSK 5','每个人都可以学习一些急救知识。']
  ]),
  themeDeck('exercise','wellness','动','运动方式','Ways to exercise',['noun','verb'],'HSK 1–4',[
    ['跑步','pǎo bù','to run; jogging','动词 / 名词','HSK 1','我每周跑步三次。'],
    ['游泳','yóu yǒng','to swim; swimming','动词 / 名词','HSK 1','夏天很多人喜欢游泳。'],
    ['骑车','qí chē','to ride a bicycle','动词','HSK 2','天气好的时候我骑车上班。'],
    ['健身','jiàn shēn','to work out; fitness','动词 / 名词','HSK 4','他下班后去健身。'],
    ['比赛','bǐ sài','competition; match','名词 / 动词','HSK 2','这场足球比赛非常精彩。'],
    ['运动员','yùn dòng yuán','athlete','名词','HSK 3','运动员每天都要训练。'],
    ['训练','xùn liàn','to train; training','动词 / 名词','HSK 4','球队正在进行体能训练。'],
    ['球场','qiú chǎng','sports court; field','名词','HSK 4','孩子们在球场上打篮球。'],
    ['瑜伽','yú jiā','yoga','名词','HSK 5','做瑜伽可以帮助身体放松。'],
    ['散步','sàn bù','to take a walk','动词','HSK 2','晚饭后我们去河边散步。']
  ]),
  themeDeck('environment','nature','境','环境与资源','Environment & resources',['noun','verb'],'HSK 3–5',[
    ['空气','kōng qì','air','名词','HSK 2','雨后的空气很清新。'],
    ['污染','wū rǎn','pollution; to pollute','名词 / 动词','HSK 4','减少污染需要大家一起努力。'],
    ['垃圾分类','lā jī fēn lèi','waste sorting','名词','HSK 4','这个城市正在推广垃圾分类。'],
    ['节约','jié yuē','to save; conserve','动词','HSK 4','请节约用水和用电。'],
    ['回收','huí shōu','to recycle; recover','动词','HSK 4','旧纸箱可以分类回收。'],
    ['能源','néng yuán','energy source','名词','HSK 5','太阳能是一种清洁能源。'],
    ['资源','zī yuán','resource','名词','HSK 4','水是重要的自然资源。'],
    ['气候','qì hòu','climate','名词','HSK 4','这里的气候温和湿润。'],
    ['保护','bǎo hù','to protect; protection','动词 / 名词','HSK 3','我们应该保护野生动物。'],
    ['环境','huán jìng','environment','名词','HSK 3','安静的环境更适合学习。']
  ]),
  themeDeck('technology','advanced','数','数字生活','Digital life',['noun','verb'],'HSK 2–5',[
    ['电脑','diàn nǎo','computer','名词','HSK 1','我的电脑需要重新启动。'],
    ['手机','shǒu jī','mobile phone','名词','HSK 1','上课时请把手机调成静音。'],
    ['软件','ruǎn jiàn','software','名词','HSK 4','这个学习软件可以离线使用。'],
    ['程序','chéng xù','program; procedure','名词','HSK 4','工程师正在测试新程序。'],
    ['网络','wǎng luò','network; internet','名词','HSK 3','这里的网络不太稳定。'],
    ['密码','mì mǎ','password','名词','HSK 3','请不要把密码告诉别人。'],
    ['下载','xià zài','to download','动词','HSK 4','你可以先下载课程资料。'],
    ['上传','shàng chuán','to upload','动词','HSK 4','请把作业上传到系统。'],
    ['更新','gēng xīn','to update; update','动词 / 名词','HSK 4','应用更新以后更容易使用了。'],
    ['人工智能','rén gōng zhì néng','artificial intelligence','名词','HSK 5','人工智能正在改变学习方式。']
  ]),
  themeDeck('science','advanced','研','科学探索','Scientific inquiry',['noun','verb'],'HSK 4–6',[
    ['实验','shí yàn','experiment','名词 / 动词','HSK 4','学生按照步骤完成了实验。'],
    ['研究','yán jiū','to research; research','动词 / 名词','HSK 4','这个团队正在研究空气质量。'],
    ['数据','shù jù','data','名词','HSK 4','我们需要先检查这些数据。'],
    ['方法','fāng fǎ','method','名词','HSK 3','这个方法简单而且有效。'],
    ['结果','jié guǒ','result','名词','HSK 3','实验结果和我们的预测一致。'],
    ['发现','fā xiàn','to discover; discovery','动词 / 名词','HSK 3','研究人员发现了新的变化。'],
    ['证明','zhèng míng','to prove; proof','动词 / 名词','HSK 4','更多证据才能证明这个观点。'],
    ['理论','lǐ lùn','theory','名词','HSK 5','理论需要通过实践来检验。'],
    ['宇宙','yǔ zhòu','universe','名词','HSK 5','人类一直在探索宇宙。'],
    ['卫星','wèi xīng','satellite','名词','HSK 5','这颗卫星可以观察天气变化。']
  ]),
  themeDeck('law-safety','advanced','安','规则与安全','Rules & safety',['noun','verb','adjective'],'HSK 3–6',[
    ['法律','fǎ lǜ','law','名词','HSK 4','每个人都应该遵守法律。'],
    ['规则','guī zé','rule','名词','HSK 3','参加活动前请先阅读规则。'],
    ['权利','quán lì','right; entitlement','名词','HSK 5','消费者有了解商品信息的权利。'],
    ['责任','zé rèn','responsibility','名词','HSK 4','保护个人信息是平台的责任。'],
    ['安全','ān quán','safe; safety','形容词 / 名词','HSK 2','过马路时一定要注意安全。'],
    ['危险','wēi xiǎn','dangerous; danger','形容词 / 名词','HSK 3','请远离危险区域。'],
    ['报警','bào jǐng','to call the police','动词','HSK 4','遇到紧急情况可以立即报警。'],
    ['警察','jǐng chá','police officer','名词','HSK 2','警察正在帮助走失的孩子。'],
    ['犯罪','fàn zuì','crime; to commit a crime','名词 / 动词','HSK 5','网络犯罪也会受到法律制裁。'],
    ['证据','zhèng jù','evidence','名词','HSK 5','请保留付款记录作为证据。']
  ]),
  themeDeck('culture-media','culture','文','文化与媒介','Culture & media',['noun'],'HSK 2–5',[
    ['文化','wén huà','culture','名词','HSK 3','学习语言也能了解当地文化。'],
    ['历史','lì shǐ','history','名词','HSK 2','这座城市有很长的历史。'],
    ['传统','chuán tǒng','tradition; traditional','名词 / 形容词','HSK 4','春节有很多传统习俗。'],
    ['艺术','yì shù','art','名词','HSK 4','她对中国传统艺术很感兴趣。'],
    ['电影','diàn yǐng','movie','名词','HSK 1','这部电影有中英文字幕。'],
    ['音乐','yīn yuè','music','名词','HSK 1','音乐让这个晚上更轻松。'],
    ['新闻','xīn wén','news','名词','HSK 3','我每天听十分钟中文新闻。'],
    ['语言','yǔ yán','language','名词','HSK 3','语言会随着社会不断变化。'],
    ['文字','wén zì','writing; characters','名词','HSK 4','这段文字介绍了一位作家。'],
    ['节目','jié mù','program; show','名词','HSK 3','这个节目讲的是普通人的生活。']
  ]),
  themeDeck('leisure','culture','闲','兴趣与休闲','Interests & leisure',['noun','verb'],'HSK 1–4',[
    ['爱好','ài hào','hobby; to like','名词 / 动词','HSK 2','我的爱好是摄影和旅行。'],
    ['摄影','shè yǐng','photography','名词 / 动词','HSK 4','他周末常常出去摄影。'],
    ['画画','huà huà','to draw; painting','动词 / 名词','HSK 1','孩子坐在窗边画画。'],
    ['唱歌','chàng gē','to sing','动词','HSK 1','朋友们一起唱歌庆祝生日。'],
    ['跳舞','tiào wǔ','to dance','动词','HSK 2','她从小就喜欢跳舞。'],
    ['阅读','yuè dú','to read; reading','动词 / 名词','HSK 4','每天阅读可以积累新词。'],
    ['游戏','yóu xì','game','名词','HSK 2','这个游戏需要两个人合作。'],
    ['野餐','yě cān','picnic','名词 / 动词','HSK 4','天气好时我们去公园野餐。'],
    ['露营','lù yíng','camping; to camp','名词 / 动词','HSK 5','第一次露营要准备足够的水。'],
    ['休息','xiū xi','to rest; rest','动词 / 名词','HSK 1','学习四十分钟以后休息一下。']
  ]),
  themeDeck('engineering','advanced','造','建造与工程','Building & engineering',['noun','verb'],'HSK 4–6',[
    ['材料','cái liào','material','名词','HSK 4','这种材料轻而且很结实。'],
    ['木材','mù cái','timber; wood','名词','HSK 5','这张桌子使用了回收木材。'],
    ['钢','gāng','steel','名词','HSK 5','桥的主要结构由钢制成。'],
    ['水泥','shuǐ ní','cement','名词','HSK 5','水泥需要时间才能完全变硬。'],
    ['建筑','jiàn zhù','building; architecture','名词 / 动词','HSK 4','这座建筑结合了传统和现代设计。'],
    ['结构','jié gòu','structure','名词','HSK 5','工程师正在检查房屋结构。'],
    ['设备','shè bèi','equipment','名词','HSK 4','使用设备前必须接受培训。'],
    ['工程','gōng chéng','engineering project','名词','HSK 4','这项工程预计明年完成。'],
    ['测量','cè liáng','to measure; measurement','动词 / 名词','HSK 5','施工前要准确测量土地。'],
    ['施工','shī gōng','to carry out construction','动词','HSK 5','前方正在施工，请减速慢行。']
  ]),
  themeDeck('finance','advanced','财','个人财务','Personal finance',['noun','verb'],'HSK 3–6',[
    ['收入','shōu rù','income','名词','HSK 4','她会记录每个月的收入。'],
    ['支出','zhī chū','expense; expenditure','名词','HSK 5','房租是我最大的生活支出。'],
    ['预算','yù suàn','budget','名词','HSK 5','旅行前最好先做一份预算。'],
    ['账户','zhàng hù','account','名词','HSK 4','请不要向陌生人提供账户信息。'],
    ['存款','cún kuǎn','savings; deposit','名词 / 动词','HSK 5','他把一部分工资作为存款。'],
    ['贷款','dài kuǎn','loan; to lend','名词 / 动词','HSK 5','申请贷款前要了解还款条件。'],
    ['利息','lì xī','interest','名词','HSK 5','不同银行的存款利息不同。'],
    ['保险','bǎo xiǎn','insurance','名词','HSK 4','出发前我们购买了旅行保险。'],
    ['投资','tóu zī','to invest; investment','动词 / 名词','HSK 5','任何投资都可能有风险。'],
    ['市场','shì chǎng','market','名词','HSK 3','市场需求正在发生变化。']
  ])
);

for(const deck of themedVocabularyDecks){
  for(const item of deck.words){
    if(!words[item.word])words[item.word]={
      p:item.pinyin,tr:item.word,pos:item.pos,m:item.en,
      cn:'“'+deck.title+'”主题中的常用词。',l:item.hsk+' · '+item.pos,e:item.example,
      col:[],examples:[item.example]
    };
  }
}
