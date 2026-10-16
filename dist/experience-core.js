/* Pure calculations shared by responsive UI and regression tests. */
(function(root,factory){const api=factory();if(typeof module==='object'&&module.exports)module.exports=api;else root.QingheExperienceCore=api})(typeof window==='undefined'?globalThis:window,function(){
 function dueSummary(queue,now=Date.now()){
  const buckets={word:0,grammar:0,listening:0,exam:0,other:0},items=(queue||[]).filter(item=>Number.isFinite(Number(item.dueAt))&&Number(item.dueAt)<=now);
  for(const item of items){const kind=item.type==='word'?'word':item.type==='grammar'?'grammar':['listening','audio'].includes(item.type)?'listening':item.type==='exam'?'exam':'other';buckets[kind]++}
  return {total:items.length,buckets,items};
 }
 function lessonProgress(state,lesson){if(!lesson)return 0;if(state.completedLessons?.[lesson.id])return 100;return Math.round(Math.max(0,Math.min(5,Number(state.lessonProgress?.[lesson.id]?.phase)||0))/5*100)}
 function levelProgress(state,lessons,level){const rows=lessons.filter(row=>row.level===level),completed=rows.filter(row=>state.completedLessons?.[row.id]).length;return{level,completed,total:rows.length,percent:rows.length?Math.round(completed/rows.length*100):0}}
 function learnedWords(state,lessons,advanced=[]){const result=new Set(),bySequence=new Map(advanced.map(row=>['advanced:'+row[0],row[1]]));for(const lesson of lessons)if(state.completedLessons?.[lesson.id])lesson.vocab.forEach(word=>result.add(word));for(const progress of Object.values(state.themeProgress||{}))for(const key of progress.reviewed||[]){if(String(key).startsWith('advanced:')){const word=bySequence.get(key);result.add(word||key)}else result.add(key)}return result.size}
 function duration(seconds,en=false){const minutes=Math.floor(Math.max(0,Number(seconds)||0)/60),h=Math.floor(minutes/60),m=minutes%60;return h?(en?h+' hr'+(m?' '+m+' min':''):h+' 小时'+(m?' '+m+' 分钟':'')):(en?minutes+' min':minutes+' 分钟')}
 function addSearch(history,query,now=Date.now()){query=String(query||'').trim();if(!query)return history;return [{query,at:now},...(history||[]).filter(item=>item.query!==query)].slice(0,30)}
 function parseRoute(url,mobile=false){const u=new URL(url),hash=u.hash.slice(1),[path,query='']=hash.split('?'),p=new URLSearchParams(query),q=u.searchParams;let view=path.split('/')[0]||q.get('view')||(mobile?'learn':'home'),lesson=p.get('lesson')||q.get('lesson')||(path.startsWith('lesson/')?decodeURIComponent(path.slice(7)):''),word=p.get('word')||q.get('word')||'';if(lesson)view='learn';if(word)view='dictionary';if(!['home','learn','review','exam','dictionary','profile','profileDetail'].includes(view))view=mobile?'learn':'home';if(mobile&&view==='home')view='learn';return {view,tab:p.get('tab')||q.get('tab')||'',level:p.get('level')||q.get('level')||'',detail:p.get('detail')||'',lesson,word}}
 return {dueSummary,lessonProgress,levelProgress,learnedWords,duration,addSearch,parseRoute};
});
