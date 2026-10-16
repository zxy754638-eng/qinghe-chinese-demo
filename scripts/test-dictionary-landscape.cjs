const assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm');
const source=fs.readFileSync('dist/experience.js','utf8'),css=fs.readFileSync('dist/experience.css','utf8');
const fn=source.slice(source.indexOf(' function positionDictionaryScenery('),source.indexOf(' function syncDictionaryLayout('));
for(const available of [280,430,630,736,780])for(const groupHeight of [60,160,300]){
 const scene={style:{},hidden:false},context={dictScenery:scene,searchGroup:{getBoundingClientRect:()=>({height:groupHeight})}};vm.createContext(context);vm.runInContext(fn,context);context.positionDictionaryScenery(available,true,false);
 if(!scene.hidden){const top=parseFloat(scene.style.top),height=parseFloat(scene.style.height);assert(top>=(available+groupHeight)/2+22);assert(top+height<=available-19);assert(height<=available*.28+.01)}
 context.positionDictionaryScenery(available,false,false);assert(scene.hidden,'Results must hide decorative scenery');context.positionDictionaryScenery(available,true,true);assert(scene.hidden,'Keyboard mode must hide decorative scenery');
}
const draw=source.slice(source.indexOf(' function dictionaryLandscapeMarkup('),source.indexOf(" const dictScenery=")),drawContext={};vm.createContext(drawContext);vm.runInContext(draw,drawContext);for(const compact of [true,false]){const markup=drawContext.dictionaryLandscapeMarkup(compact);assert.equal((markup.match(/class="dict-boat"/g)||[]).length,1);assert(!/<image|<text|<filter|<radialGradient/i.test(markup));assert.equal((markup.match(/<linearGradient /g)||[]).length,1);assert(markup.includes('stop-color="currentColor"'));assert(markup.includes('dict-boat-reflection'));assert(markup.includes(compact?'0 0 600 240':'0 0 1200 240'));}
assert(css.includes('.dict-scenery .dict-scenery-wide{display:none}'));assert(css.includes('pointer-events:none'));assert(css.includes('body.experience-refresh.exp-dictionary-idle-open .app{padding-bottom:0}'));
assert(source.includes("dictSubmit.setAttribute('aria-label','查找')"));assert(source.includes("dictSearchBar.prepend(searchIcon)"));
console.log('PASS: scenery bounds and keyboard/result hiding, separate responsive SVG compositions, one theme-derived mist fade, single boat and quiet reflection, no bitmap/text/filter, accessible search action.');
