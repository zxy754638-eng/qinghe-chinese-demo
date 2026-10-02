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
