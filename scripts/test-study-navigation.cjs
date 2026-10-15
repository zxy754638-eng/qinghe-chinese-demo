const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
const source=fs.readFileSync('dist/app.js','utf8');
class Node{
 constructor(id='',classes=[]){this.id=id;this.children=[];this.classes=new Set(classes);this.classList={add:(...xs)=>xs.forEach(x=>this.classes.add(x)),remove:x=>this.classes.delete(x)};this.hidden=false;}
 append(node){if(node.parent)node.parent.children=node.parent.children.filter(x=>x!==node);node.parent=this;this.children.push(node);}
 prepend(node){this.append(node);this.children.splice(this.children.indexOf(node),1);this.children.unshift(node);}
 setAttribute(key,value){this[key]=value;}
 querySelector(selector){const match=node=>selector[0]==='#'?node.id===selector.slice(1):node.classes.has(selector.slice(1));for(const child of this.children){if(match(child))return child;const found=child.querySelector(selector);if(found)return found;}return null;}
}
const catalog=new Node('courseCatalog'),nodes={};
for(const [id,classes]of [['learningQuickNav',[]],['themedVocabulary',[]],['head',['catalog-head']],['summary',['course-summary']],['pinyinLab',[]],['courseGrid',[]]]){nodes[id]=new Node(id,classes);catalog.append(nodes[id]);}
const storage=new Map(),tabs=[];
const context={document:{getElementById:id=>id==='courseCatalog'?catalog:catalog.querySelector('#'+id),createElement:()=>new Node()},activeLearningSection:'themed',ensureLearningQuickNav(){},ensureThemedVocabularySection(){},ensurePinyinLab(){},renderLearningQuickNav(){},showView(){},showThemedLibraryTab:id=>tabs.push(id),window:{scrollTo(){}},localStorage:{setItem:(key,value)=>storage.set(key,value)}};
vm.runInNewContext(source.slice(source.indexOf('function ensureLearningPages('),source.indexOf('function openLevelPath(')),context);
for(const section of ['themed','courses','pinyin','themed']){
 context.openLearningSection(section);
 const ids=['themedVocabulary','learningCourses','pinyinLab'];
 assert.deepEqual(ids.filter(id=>!context.document.getElementById(id).hidden),[{themed:'themedVocabulary',courses:'learningCourses',pinyin:'pinyinLab'}[section]]);
 assert.equal(storage.get('qinghe-learning-section'),section);
}
const courses=context.document.getElementById('learningCourses');assert.deepEqual(courses.children.map(x=>x.id),['head','summary','courseGrid']);assert(!courses.children.includes(nodes.pinyinLab));
assert.equal(catalog.children.filter(x=>x.id==='learningPageTitle').length,1);
context.openLearningSection('advanced');assert.equal(context.activeLearningSection,'themed');assert.deepEqual(tabs,['advanced']);context.openLearningSection('invalid');assert.equal(context.activeLearningSection,'themed');
console.log('PASS: mutually exclusive learning pages, original course nodes preserved, pinyin independent, remembered selection, advanced route and invalid route fallback.');

