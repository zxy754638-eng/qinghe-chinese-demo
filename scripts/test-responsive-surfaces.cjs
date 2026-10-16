const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
const source=fs.readFileSync('dist/experience.js','utf8'),css=fs.readFileSync('dist/experience.css','utf8');
const fn=source.slice(source.indexOf(' function syncDictionaryLayout(){'),source.indexOf(' const dictLayoutObserver='));
function check({width=390,height=844,visualHeight=height,navTop=760,submitted=false,entry=false,focus=false,historyCount=0}={}){
 const classes=new Set(),styles={},groupClasses=new Set(),input={};
 const dictionary={hidden:false,querySelector:()=>({hidden:!entry}),classList:{toggle:(key,on)=>on?classes.add(key):classes.delete(key)},getBoundingClientRect:()=>({top:12}),style:{setProperty:(key,value)=>styles[key]=value}};
 const context={dictionary,dictInput:input,searchSubmitted:submitted,route:{view:'dictionary'},mobile:()=>width<=980,innerHeight:height,scrollY:0,window:{visualViewport:{height:visualHeight,offsetTop:0}},document:{activeElement:focus?input:null,documentElement:{clientHeight:height},body:{classList:{toggle:(key,on)=>on?groupClasses.add(key):groupClasses.delete(key)}},querySelector:()=>({getBoundingClientRect:()=>({top:navTop})})}};
 vm.createContext(context);vm.runInContext(fn+';syncDictionaryLayout()',context);return {classes,styles};
}
let result=check();assert(result.classes.has('exp-dictionary-idle'));assert.equal(result.styles['--dict-available'],'736px');
result=check({width:1366,height:900});assert.equal(result.styles['--dict-available'],'868px');
assert(!check({submitted:true}).classes.has('exp-dictionary-idle'));
assert(!check({entry:true}).classes.has('exp-dictionary-idle'));
result=check({visualHeight:430,focus:true});assert(result.classes.has('exp-keyboard-open'));assert.equal(result.styles['--dict-available'],'418px');assert.equal(result.styles['--dict-history-max'],'220px');
assert(check({submitted:false,entry:false}).classes.has('exp-dictionary-idle'));
for(const id of ['wordbook','preferences','appearance','language','data','help'])assert(source.includes("profileEntry('"+id+"'"));
assert(css.includes('#themedVocabulary .themed-vocab-head{display:none'));
assert(css.includes('#courseCatalog>.exp-brand{display:none'));
assert(css.includes('.exp-desktop-tools{display:none}'));
assert(css.includes('body.experience-refresh.exp-dictionary-open .site-footer{display:none}'));
assert(!/localStorage\.clear|removeItem\(['"]qinghe-learning-state/.test(source));
console.log('PASS: mobile/desktop content bounds, keyboard-visible layout, empty/result/clear states, responsive profile modules, vocabulary header removal and no data resets.');
