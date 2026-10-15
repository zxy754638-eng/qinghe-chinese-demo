const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
const source=fs.readFileSync('dist/app.js','utf8');
const implementation=source.slice(source.indexOf('function bindThemedCardSwipe('),source.indexOf('function gradeThemedWord('));
function setup(mobile=true){
 const events={},classes=new Set(),styles=new Map(),grades=[],timers=[];
 const card={classList:{add:(...xs)=>xs.forEach(x=>classes.add(x)),remove:(...xs)=>xs.forEach(x=>classes.delete(x)),toggle:(x,on)=>on?classes.add(x):classes.delete(x)},style:{setProperty:(k,v)=>styles.set(k,v),removeProperty:k=>styles.delete(k)},setAttribute(){},addEventListener:(name,fn)=>events[name]=fn,setPointerCapture(){},getBoundingClientRect:()=>({width:300})};
 const context={matchMedia:()=>({matches:mobile}),themedTransitioning:false,themedExitTimer:null,themedEnterNext:false,setTimeout:(fn,ms)=>timers.push({fn,ms}),document:{querySelectorAll:()=>[]},gradeThemedWord:level=>{grades.push(level);context.themedTransitioning=true;}};
 vm.runInNewContext(implementation,context);context.bindThemedCardSwipe(card);
 const send=(kind,x,y,{interactive=false,type='touch',id=1}={})=>events[kind]({clientX:x,clientY:y,pointerId:id,pointerType:type,isPrimary:true,target:{closest:()=>interactive}});
 const swipe=(dx,dy=0,options={})=>{send('pointerdown',150,150,options);send('pointermove',150+dx,150+dy,options);send('pointerup',150+dx,150+dy,options);};
 return {context,card,events,classes,styles,grades,timers,send,swipe};
}
let test=setup();test.swipe(100);assert.deepEqual(test.grades,['good']);assert(test.classes.has('theme-card-swipe-right'));test.swipe(100);assert.equal(test.grades.length,1);
test=setup();test.swipe(-100);assert.equal(test.grades.length,0);assert(test.context.themedTransitioning);test.timers.find(t=>t.ms===240).fn();assert.deepEqual(test.grades,['hard']);assert(test.context.themedEnterNext);
for(const [dx,dy]of[[20,0],[0,120],[60,100],[90,80]]){test=setup();test.swipe(dx,dy);assert.equal(test.grades.length,0);assert(!test.classes.has('is-swiping'));}
test=setup();test.swipe(100,0,{interactive:true});assert.equal(test.grades.length,0);
test=setup();test.swipe(100,0,{type:'mouse'});assert.equal(test.grades.length,0);
test=setup(false);test.swipe(100);assert.equal(test.grades.length,0);
test=setup();test.send('pointerdown',150,150);test.send('pointermove',250,150);test.events.pointercancel();test.send('pointerup',250,150);assert.equal(test.grades.length,0);assert.equal(test.styles.size,0);
assert(!source.includes('🔊'));assert(source.includes('center.append(wordAudio)'));
console.log('PASS: left=hard, right=good, duplicate lock, minimum distance, vertical/diagonal scrolling, interactive targets, desktop exclusion, pointer cancellation, centered pinyin audio, no emoji speakers.');
