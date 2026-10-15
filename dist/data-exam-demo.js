window.QINGHE_EXAM_DEMO={
  schemaVersion:1,id:'qh-workflow-demo',version:'1.0',title:'模考流程演示卷',level:'HSK 1',durationMinutes:10,status:'draft',demo:true,
  instructions:'这是一份用于体验系统的原创演示卷，题量、时长和分值不代表正式 HSK 试卷，也不用于判断 HSK 等级。听力暂用机器语音；正式试卷将另行导入。',
  sections:[
    {title:'听力演示',skill:'listening',questions:[{id:'demo-l1',type:'choice',prompt:'听一听，选择正确的回答。',audioText:'小明今天坐地铁去学校。小明怎么去学校？',options:['坐地铁','骑自行车','坐飞机'],answer:0,points:5,explanation:'材料说“小明今天坐地铁去学校”，因此选“坐地铁”。',keywords:['地铁']}]},
    {title:'阅读演示',skill:'reading',questions:[
      {id:'demo-r1',type:'choice',passage:'今天下雨了，小林没有去公园。他在家看书。',prompt:'小林今天在哪里看书？',options:['在公园','在家','在学校'],answer:1,points:5,explanation:'文中说“他在家看书”，因此选“在家”。',keywords:['看书']},
      {id:'demo-r2',type:'fill',prompt:'请填入合适的词：我每天早上七点___。',answers:['起床'],points:5,explanation:'“起床”表示睡醒后离开床铺。完整句子是“我每天早上七点起床”。',keywords:['起床']},
      {id:'demo-r3',type:'choice',prompt:'“谢谢”的常见回答是什么？',options:['不客气','对不起','再见'],answer:0,points:5,explanation:'别人表达感谢时，通常回答“不客气”。',keywords:['不客气']}
    ]},
    {title:'写作演示',skill:'writing',questions:[{id:'demo-w1',type:'writing',prompt:'请用中文写两三句话，介绍你喜欢的一种食物以及原因。',points:10,explanation:'检查是否回应题意、句子是否完整、用词是否恰当。此题仅演示写作流程，等待人工评分。',sampleAnswer:'我喜欢吃面条。面条很好吃，也很方便。',rubric:'回应题意 4 分；句子完整、语法恰当 4 分；用字准确 2 分。',keywords:[]}]}
  ]
};
