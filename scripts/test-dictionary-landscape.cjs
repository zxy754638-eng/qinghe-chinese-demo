const assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm');
const source=fs.readFileSync('dist/experience.js','utf8'),css=fs.readFileSync('dist/experience.css','utf8');
const fn=source.slice(source.indexOf(' function positionDictionaryScenery('),source.indexOf(' function syncDictionaryLayout('));
for(const available of [280,430,630,736,780])for(const groupHeight of [60,160,300]){
 const scene={style:{},hidden:false},context={dictScenery:scene,searchGroup:{getBoundingClientRect:()=>({height:groupHeight})}};vm.createContext(context);vm.runInContext(fn,context);context.positionDictionaryScenery(available,true,false);
 if(!scene.hidden){const top=parseFloat(scene.style.top),height=parseFloat(scene.style.height);assert(top>=(available+groupHeight)/2+22);assert(top+height<=available-19);assert(height<=available*.28+.01)}
 context.positionDictionaryScenery(available,false,false);assert(scene.hidden,'Results must hide decorative scenery');context.positionDictionaryScenery(available,true,true);assert(scene.hidden,'Keyboard mode must hide decorative scenery');
}
const markup=source.slice(source.indexOf("const dictScenery="),source.indexOf(' function positionDictionaryScenery('));assert.equal((markup.match(/class="dict-boat"/g)||[]).length,2);assert(!/<image|<text|<filter|<linearGradient|<radialGradient/i.test(markup));
assert(css.includes('.dict-scenery .dict-scenery-wide{display:none}'));assert(css.includes('pointer-events:none'));assert(css.includes('body.experience-refresh.exp-dictionary-idle-open .app{padding-bottom:0}'));
assert(source.includes("dictSubmit.setAttribute('aria-label','查找')"));assert(source.includes("dictSearchBar.prepend(searchIcon)"));
console.log('PASS: scene stays below search/history and above navigation, short/keyboard/result states hide safely, separate responsive SVG compositions, no bitmap/text/gradient, accessible search action.');
