import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import {fileURLToPath} from 'node:url';

const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const seedPath=path.join(root,'scripts','data','themed-vocab-800.tsv');
const outputPath=path.join(root,'dist','data-themed-vocab-balanced.js');
const cedict=JSON.parse(fs.readFileSync(path.join(root,'dist','data','cedict.min.json'),'utf8'));

const newDecks=[
  ['quantity-measures','everyday','量','数量与量词','Numbers & measure words',['noun','measure'],'HSK 1–3'],
  ['time-frequency','everyday','时','时间与频率','Time & frequency',['noun','adverb'],'HSK 1–4'],
  ['directions-routes','mobility','向','方位与路线','Directions & routes',['noun','verb'],'HSK 1–4'],
  ['produce-drinks','everyday','鲜','果蔬与饮料','Produce & drinks',['noun'],'HSK 1–4'],
  ['cooking-dining','everyday','餐','烹饪与点餐','Cooking & dining',['noun','verb','adjective'],'HSK 1–4'],
  ['housing-rental','everyday','租','租房与居住','Housing & renting',['noun','verb'],'HSK 2–5'],
  ['payments-services','mobility','付','支付与银行服务','Payments & banking services',['noun','verb'],'HSK 2–5'],
  ['delivery-documents','mobility','件','快递与证件','Delivery & documents',['noun','verb'],'HSK 2–5'],
  ['symptoms-pharmacy','wellness','药','症状与用药','Symptoms & pharmacy',['noun','verb','adjective'],'HSK 2–5'],
  ['subjects-exams','study','考','学科与考试','Subjects & exams',['noun','verb','adjective'],'HSK 1–5'],
  ['recruitment-meetings','study','会','求职与会议','Recruitment & meetings',['noun','verb'],'HSK 3–6'],
  ['online-communication','culture','网','网络交流','Online communication',['noun','verb'],'HSK 2–6'],
  ['news-economy','advanced','经','新闻与经济','News & economy',['noun','verb'],'HSK 4–6'],
  ['logic-argumentation','advanced','理','逻辑与论证','Logic & argumentation',['adverb','conjunction','adjective','verb'],'HSK 4–6']
];

const newDeckIds=new Set(newDecks.map(([id])=>id));
// 主题词库使用六级教学梯度：基础词保持在 1–3 级，专业、社会与论证词向 5–6 级展开。
const levelOverrides={};
for(const word of ['研究员','建筑师','介绍人','市政府','气候变化','操作系统','研究方法','法规','条例','出版','传播','图纸','管道','机械','施工现场','维护','货币','汇率','理财','租期','物业','中介','电子钱包','账本','利率','还款','补办','政治','学分','应聘','候选人','面试官','录用','提议','截止日期','反馈','社交平台','企业','行业','贸易','价格上涨','就业','失业','增长','政策','然而','此外','一方面','另一方面','相反','一致','矛盾','客观','主观'])levelOverrides[word]='HSK 6';
for(const word of ['鲜艳','透明','企鹅','鲸鱼','鲨鱼','树根','花瓣','果实','小麦','水稻','棉花','轻轨','闪电','暴雨','台风','预报','夫妻','一代','膝盖','皮肤','腰带','程序员','会计','孤独','遗憾','自信','走廊','乐观','自私','可靠','拜访','尊重','误会','民宿','登机牌','海关','纪念品','订单','收据','退款','服务中心','提交','咨询','选修课','讲座','默写','分析','部门'])levelOverrides[word]='HSK 5';
for(const word of ['质量','社区','课程表','毕业','校长','背诵','朗读','面试','报告'])levelOverrides[word]='HSK 4';
const cedictBySimplified=new Map();
for(const row of cedict.entries){
  const simplified=row[1];
  if(!cedictBySimplified.has(simplified))cedictBySimplified.set(simplified,[]);
  cedictBySimplified.get(simplified).push(row);
}

const pinyinOverrides={
  '自动取款机':'zì dòng qǔ kuǎn jī','取件码':'qǔ jiàn mǎ','寄件人':'jì jiàn rén','收件人':'shōu jiàn rén',
  '证件照':'zhèng jiàn zhào','测体温':'cè tǐ wēn','视频通话':'shì pín tōng huà','语音消息':'yǔ yīn xiāo xi',
  '社交平台':'shè jiāo píng tái','价格上涨':'jià gé shàng zhǎng','截止日期':'jié zhǐ rì qī',
  '身份验证':'shēn fèn yàn zhèng','隐私保护':'yǐn sī bǎo hù','生物多样性':'shēng wù duō yàng xìng',
  '可再生能源':'kě zài shēng néng yuán','气候变化':'qì hòu biàn huà','学术论文':'xué shù lùn wén',
  '因果关系':'yīn guǒ guān xi','研究方法':'yán jiū fāng fǎ','实验组':'shí yàn zǔ','对照组':'duì zhào zǔ',
  '合法权益':'hé fǎ quán yì','施工现场':'shī gōng xiàn chǎng','操作系统':'cāo zuò xì tǒng',
  '网络安全':'wǎng luò ān quán','云计算':'yún jì suàn','温室气体':'wēn shì qì tǐ','生态系统':'shēng tài xì tǒng',
  '碳排放':'tàn pái fàng','电子钱包':'diàn zǐ qián bāo','验证码':'yàn zhèng mǎ','取件':'qǔ jiàn',
  '价格下降':'jià gé xià jiàng','志愿活动':'zhì yuàn huó dòng','家庭成员':'jiā tíng chéng yuán',
  '旅行团':'lǚ xíng tuán','登机牌':'dēng jī pái','售后':'shòu hòu','选修课':'xuǎn xiū kè',
  '学生证':'xué shēng zhèng','课程表':'kè chéng biǎo','肚子疼':'dù zi téng','嗓子疼':'sǎng zi téng',
  '流鼻涕':'liú bí tì','饭前':'fàn qián','饭后':'fàn hòu','不及格':'bù jí gé','面试官':'miàn shì guān',
  '朋友圈':'péng you quān','二维码':'èr wéi mǎ','另一个方面':'lìng yí gè fāng miàn','背':'bèi'
};

const toneVowels={
  a:['a','ā','á','ǎ','à'],e:['e','ē','é','ě','è'],i:['i','ī','í','ǐ','ì'],o:['o','ō','ó','ǒ','ò'],
  u:['u','ū','ú','ǔ','ù'],'ü':['ü','ǖ','ǘ','ǚ','ǜ']
};
function toneSyllable(raw){
  const match=raw.match(/^(.*?)([1-5])$/);if(!match)return raw.replace(/u:/gi,'ü').replace(/v/gi,'ü');
  let base=match[1].replace(/u:/gi,'ü').replace(/v/gi,'ü');const tone=Number(match[2]);if(tone===5)return base;
  const lower=base.toLowerCase();let index=-1;
  if(lower.includes('a'))index=lower.indexOf('a');
  else if(lower.includes('e'))index=lower.indexOf('e');
  else if(lower.includes('ou'))index=lower.indexOf('o');
  else for(let i=lower.length-1;i>=0;i--)if('iouü'.includes(lower[i])){index=i;break}
  if(index<0)return base;
  const vowel=lower[index];const marked=toneVowels[vowel]?.[tone]||base[index];
  if(base[index]===base[index].toUpperCase())base=base.slice(0,index)+marked.toUpperCase()+base.slice(index+1);
  else base=base.slice(0,index)+marked+base.slice(index+1);
  return base;
}
function tonePinyin(value){return value.split(/\s+/).filter(Boolean).map(toneSyllable).join(' ')}
function choosePinyin(word){
  if(pinyinOverrides[word])return pinyinOverrides[word];
  const candidates=cedictBySimplified.get(word)||[];
  if(!candidates.length){
    const chars=[...word],parts=[];let index=0;
    while(index<chars.length){
      let match='';
      for(let end=chars.length;end>index;end--){
        const candidate=chars.slice(index,end).join('');
        if(candidate!==word&&(pinyinOverrides[candidate]||cedictBySimplified.has(candidate))){match=candidate;break}
      }
      if(!match)throw new Error(`CC-CEDICT 中找不到拼音：${word}（停在 ${chars.slice(index).join('')}）`);
      parts.push(choosePinyin(match));index+=match.length;
    }
    return parts.join(' ');
  }
  const ranked=[...candidates].sort((a,b)=>{
    const score=row=>{
      const p=row[2]||'',defs=row.slice(3).join(' ');let total=0;
      if(/^[a-züv]/.test(p))total+=4;
      if(!/surname|variant of|old variant|used in/i.test(defs))total+=3;
      if(!/^[A-Z]/.test(p))total+=2;
      return total;
    };
    return score(b)-score(a);
  });
  return tonePinyin(ranked[0][2]);
}

const lines=fs.readFileSync(seedPath,'utf8').replace(/^\uFEFF/,'').split(/\r?\n/).filter(line=>line.trim()&&!line.startsWith('#'));
const header=lines.shift().split('\t');
const expected=['deck','word','en','pos','hsk','example','exampleEn'];
if(JSON.stringify(header)!==JSON.stringify(expected))throw new Error(`TSV 表头不正确：${header.join(',')}`);
const additions={};
for(const line of lines){
  const values=line.split('\t');
  if(values.length!==expected.length)throw new Error(`字段数量不是 ${expected.length}：${line}`);
  const row=Object.fromEntries(expected.map((key,index)=>[key,values[index].trim()]));
  if(levelOverrides[row.word])row.hsk=levelOverrides[row.word];
  if(!row.example.includes(row.word))throw new Error(`例句未包含目标词：${row.word}`);
  if(!/^HSK [1-6]$/.test(row.hsk))throw new Error(`HSK 标记不正确：${row.word} ${row.hsk}`);
  (additions[row.deck]??=[]).push([row.word,choosePinyin(row.word),row.en,row.pos,row.hsk,row.example,row.exampleEn]);
}

if(lines.length!==480)throw new Error(`新增词应为 480 个，当前为 ${lines.length} 个`);
const uniqueWords=new Set(lines.map(line=>line.split('\t')[1]));
if(uniqueWords.size!==480)throw new Error(`新增词存在重复，唯一词数为 ${uniqueWords.size}`);

const baseCode='const words={};\n'+fs.readFileSync(path.join(root,'dist','data-themed-vocab.js'),'utf8')+'\n'+fs.readFileSync(path.join(root,'dist','data-themed-example-en.js'),'utf8')+'\n;globalThis.__base=themedVocabularyDecks;';
const context={};vm.createContext(context);new vm.Script(baseCode).runInContext(context);
const baseDecks=context.__base;
const baseWords=new Set(baseDecks.flatMap(deck=>deck.words.map(item=>item.word)));
const collisions=[...uniqueWords].filter(word=>baseWords.has(word));
if(collisions.length)throw new Error(`新增词与现有主题词重复：${collisions.join('、')}`);
for(const deck of baseDecks){
  const rows=additions[deck.id]||[];
  if(rows.length!==8)throw new Error(`现有分类 ${deck.id} 应新增 8 词，当前为 ${rows.length}`);
}
for(const [id] of newDecks){
  const rows=additions[id]||[];
  if(rows.length!==16)throw new Error(`新分类 ${id} 应包含 16 词，当前为 ${rows.length}`);
}
const unknownDecks=Object.keys(additions).filter(id=>!baseDecks.some(deck=>deck.id===id)&&!newDeckIds.has(id));
if(unknownDecks.length)throw new Error(`未知分类：${unknownDecks.join('、')}`);

const generated=`// 由 scripts/build-themed-vocab-800.mjs 根据青禾原创教学种子生成。\n`+
`// 拼音以本地 CC-CEDICT 校验并转换为声调符号；释义、例句与英译为青禾教学整理。\n`+
`const themedVocabularyBalancedRows=${JSON.stringify(additions,null,2)};\n`+
`const themedVocabularyBalancedDecks=${JSON.stringify(newDecks,null,2)};\n`+
String.raw`
const balancedThemeWord=([word,pinyin,en,pos,hsk,example,exampleEn])=>({word,pinyin,en,pos,hsk,example,exampleEn});
for(const deck of themedVocabularyDecks){
  const rows=themedVocabularyBalancedRows[deck.id]||[];
  deck.words.push(...rows.map(balancedThemeWord));
}
for(const [id,domain,mark,title,titleEn,pos,level] of themedVocabularyBalancedDecks){
  const rows=themedVocabularyBalancedRows[id]||[];
  themedVocabularyDecks.push({id,domain,mark,title,titleEn,pos,level,words:rows.map(balancedThemeWord)});
}

// 所有分类引用同一份规范词条对象；跨分类扩展时不会产生重复学习卡。
const themedVocabularyCatalog=Object.create(null);
for(const deck of themedVocabularyDecks){
  deck.words=deck.words.map(item=>{
    const canonical=themedVocabularyCatalog[item.word]||item;
    if(!canonical.deckIds)canonical.deckIds=[];
    if(!canonical.deckIds.includes(deck.id))canonical.deckIds.push(deck.id);
    themedVocabularyCatalog[item.word]=canonical;
    if(!words[item.word])words[item.word]={
      p:canonical.pinyin,tr:canonical.word,pos:canonical.pos,m:canonical.en,
      cn:'这是“'+deck.title+'”主题中常用的'+canonical.pos.replaceAll(' / ','、')+'。',
      l:canonical.hsk+' · '+canonical.pos,e:canonical.example,col:[],
      examples:[canonical.example],examplesEn:[canonical.exampleEn],exampleEn:canonical.exampleEn
    };
    return canonical;
  });
}
const themedVocabularyStats={
  decks:themedVocabularyDecks.length,
  words:Object.keys(themedVocabularyCatalog).length,
  levels:Object.values(themedVocabularyCatalog).reduce((result,item)=>{result[item.hsk]=(result[item.hsk]||0)+1;return result;},{})
};
`;

fs.writeFileSync(outputPath,generated,'utf8');
const finalDecks=baseDecks.length+newDecks.length;
const finalWords=baseWords.size+uniqueWords.size;
if(finalDecks!==46||finalWords!==800)throw new Error(`生成结果不是 46 类 / 800 词：${finalDecks} 类 / ${finalWords} 词`);
const levels={};
for(const deck of baseDecks)for(const item of deck.words)levels[item.hsk]=(levels[item.hsk]||0)+1;
for(const rows of Object.values(additions))for(const row of rows)levels[row[4]]=(levels[row[4]]||0)+1;
const expectedLevels={'HSK 1':107,'HSK 2':144,'HSK 3':199,'HSK 4':160,'HSK 5':100,'HSK 6':90};
if(JSON.stringify(levels)!==JSON.stringify(expectedLevels))throw new Error(`六级分布不符合目标：${JSON.stringify(levels)}`);
console.log(JSON.stringify({output:outputPath,baseDecks:baseDecks.length,baseWords:baseWords.size,addedDecks:newDecks.length,addedWords:uniqueWords.size,finalDecks,finalWords,levels},null,2));
