// 青禾中文主题词库：分类、拼音、英文义项与例句为本项目教学整理。
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

for(const deck of themedVocabularyDecks){
  for(const item of deck.words){
    if(!words[item.word])words[item.word]={
      p:item.pinyin,tr:item.word,pos:item.pos,m:item.en,
      cn:'主题词库中的常用词。',l:item.hsk+' · '+item.pos,e:item.example,
      col:[],examples:[item.example]
    };
  }
}
