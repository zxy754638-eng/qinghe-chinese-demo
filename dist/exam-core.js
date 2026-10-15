(function(root){
  'use strict';
  const levels=['HSK 1','HSK 2','HSK 3','HSK 4','HSK 5','HSK 6','HSK 7–9'];
  const normalize=value=>String(value??'').normalize('NFC').trim().replace(/\s+/gu,' ');
  function validatePaper(raw){
    const fail=message=>{throw new Error(message)};
    const text=(v,label,max=4000)=>{if(typeof v!=='string'||!v.trim()||v.length>max)fail(label+'需填写，且不得超过 '+max+' 字符');return v.trim()};
    if(!raw||typeof raw!=='object'||Array.isArray(raw))fail('试卷必须是一个 JSON 对象');
    if(raw.schemaVersion!==1)fail('schemaVersion 必须为 1');
    const id=text(raw.id,'试卷编号',80);if(!/^[a-zA-Z0-9_-]+$/.test(id))fail('试卷编号只能使用字母、数字、下划线和短横线');
    if(!levels.includes(raw.level))fail('level 应为 HSK 1 至 HSK 6，或 HSK 7–9（合并高级段）');
    if(!Number.isInteger(raw.durationMinutes)||raw.durationMinutes<1||raw.durationMinutes>300)fail('考试时长需为 1–300 的整数分钟');
    if(!['draft','reviewed'].includes(raw.status))fail('status 应为 draft 或 reviewed');
    if(typeof raw.demo!=='boolean')fail('demo 必须是 true 或 false');
    if(!Array.isArray(raw.sections)||!raw.sections.length||raw.sections.length>10)fail('试卷需包含 1–10 个部分');
    const ids=new Set();let total=0;
    const sections=raw.sections.map((s,si)=>{
      if(!s||!['listening','reading','writing'].includes(s.skill))fail('第 '+(si+1)+' 部分的 skill 应为 listening、reading 或 writing');
      if(!Array.isArray(s.questions)||!s.questions.length)fail('每部分至少需要一道题');
      const questions=s.questions.map((q,qi)=>{
        const label='第 '+(si+1)+' 部分第 '+(qi+1)+' 题';if(!q||typeof q!=='object')fail(label+'格式错误');
        const qid=text(q.id,label+'编号',80);if(!/^[a-zA-Z0-9_-]+$/.test(qid)||['__proto__','constructor','prototype'].includes(qid))fail(label+'编号请使用字母、数字、下划线和短横线');if(ids.has(qid))fail('题目编号重复：'+qid);ids.add(qid);total++;
        if(!['choice','fill','writing'].includes(q.type))fail(label+'题型应为 choice、fill 或 writing');
        if(s.skill==='writing'&&q.type!=='writing')fail(label+'写作部分需使用 writing 题型');
        if(s.skill!=='writing'&&q.type==='writing')fail(label+'写作题需放入 writing 部分');
        if(!Number.isFinite(q.points)||q.points<=0||q.points>1000)fail(label+'分值应大于 0 且不超过 1000');
        const clean={id:qid,type:q.type,prompt:text(q.prompt,label+'题干',12000),points:q.points,explanation:text(q.explanation,label+'解析或评分说明',8000),passage:typeof q.passage==='string'?q.passage.slice(0,20000):'',keywords:Array.isArray(q.keywords)?q.keywords.filter(x=>typeof x==='string').slice(0,10).map(x=>x.slice(0,80)):[]};
        if(q.type==='choice'){
          if(!Array.isArray(q.options)||q.options.length<2||q.options.length>8)fail(label+'需要 2–8 个选项');
          clean.options=q.options.map(x=>text(x,label+'选项',2000));
          if(new Set(clean.options).size!==clean.options.length)fail(label+'选项不可重复');
          if(!Number.isInteger(q.answer)||q.answer<0||q.answer>=clean.options.length)fail(label+'answer 必须是从 0 开始的正确选项索引');
          clean.answer=q.answer;
        }else if(q.type==='fill'){
          if(!Array.isArray(q.answers)||!q.answers.length||q.answers.length>20)fail(label+'需填写可接受答案 answers');
          clean.answers=q.answers.map(x=>text(x,label+'答案',2000));
        }else{
          clean.sampleAnswer=text(q.sampleAnswer,label+'参考范文',12000);
          clean.rubric=text(q.rubric,label+'评分量表',8000);
        }
        if(s.skill==='listening'){
          if(q.audio){
            const audio=text(q.audio,label+'音频路径',2000);
            if(/^[a-z]+:/i.test(audio)&&!/^https?:\/\//i.test(audio)||audio.startsWith('//')||/[\u0000-\u0020\\]/.test(audio))fail(label+'音频需为站内相对路径或 https/http 链接');
            clean.audio=audio;
          }else if(raw.demo&&typeof q.audioText==='string'&&q.audioText.trim())clean.audioText=q.audioText.slice(0,5000);
          else fail(label+'缺少音频 audio；机器语音仅供演示卷使用');
        }
        return clean;
      });
      return {title:text(s.title,'部分标题',100),skill:s.skill,questions};
    });
    if(total>300)fail('每份试卷最多 300 题');
    return {schemaVersion:1,id,version:text(raw.version,'版本号',80),title:text(raw.title,'试卷名称',200),level:raw.level,durationMinutes:raw.durationMinutes,status:raw.status,demo:raw.demo,instructions:typeof raw.instructions==='string'?raw.instructions.slice(0,8000):'',sections};
  }
  function flatten(paper){return paper.sections.flatMap(s=>s.questions.map(q=>({...q,section:s.title,skill:s.skill})))}
  function answered(q,value){return q.type==='choice'?Number.isInteger(value)&&value>=0&&value<q.options.length:typeof value==='string'&&value.trim().length>0}
  function grade(paper,answers){
    const rows=flatten(paper).map(q=>{const value=answers[q.id];const pending=q.type==='writing';const correct=pending?null:q.type==='choice'?value===q.answer:q.answers.some(a=>normalize(a)===normalize(value));return {id:q.id,skill:q.skill,points:q.points,answered:answered(q,value),pending,correct,earned:correct?q.points:0}});
    return {rows,earned:rows.reduce((n,r)=>n+r.earned,0),objectiveMax:rows.filter(r=>!r.pending).reduce((n,r)=>n+r.points,0),pendingMax:rows.filter(r=>r.pending).reduce((n,r)=>n+r.points,0),wrongIds:rows.filter(r=>!r.pending&&!r.correct).map(r=>r.id)};
  }
  root.QingheExamCore={levels,validatePaper,flatten,answered,grade};
})(typeof window!=='undefined'?window:globalThis);

