const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
const source=fs.readFileSync('dist/auth.js','utf8');
async function setup({mobile=false,callback=false,callbackFailure=false,denied=false}={}){
  const nodes=new Map(),calls=[];
  function node(id){if(!nodes.has(id))nodes.set(id,{textContent:'',className:'',classList:{add(){},remove(){},toggle(){},contains(){return false}},setAttribute(){},removeAttribute(){},addEventListener(){}});return nodes.get(id)}
  const location={protocol:'https:',pathname:'/qinghe-chinese-demo/index.html',origin:'https://zxy754638-eng.github.io',href:'https://zxy754638-eng.github.io/qinghe-chinese-demo/'+(callback?'?'+(denied?'error=access_denied':'code=test&state=test'):''),search:callback?'?'+(denied?'error=access_denied':'code=test&state=test'):'',hash:''};
  let config;
  const window={AuthingFactory:{Authing:class{
    constructor(c){config=c} isRedirectCallback(){return callback}
    async handleRedirectCallback(){calls.push('callback');if(callbackFailure)throw new Error('test');return {parsedIdToken:{name:'Test'}}}
    async getLoginState(){return null} async getUserInfo(){return {name:'Test'}}
    async loginWithRedirect(){calls.push('redirect')} async loginWithPopup(){calls.push('popup');return {parsedIdToken:{name:'Test'}}}
  }},open(){calls.push('open');return {closed:false,close(){calls.push('close')}}},openManagedModal(){calls.push('modal')},closeManagedModal(){}};
  const ctx={window,location,navigator:{userAgent:mobile?'iPhone':'Desktop',platform:'',maxTouchPoints:0},history:{replaceState(){calls.push('clean')}},document:{title:'test',body:{dataset:{}},getElementById:node,querySelector(){return null},addEventListener(){},dispatchEvent(){}},CustomEvent:class{},URL,URLSearchParams,setTimeout,clearTimeout,console};
  vm.runInNewContext(source,ctx);await new Promise(resolve=>setImmediate(resolve));
  return {window,calls,nodes,config};
}
(async()=>{
  let t=await setup({mobile:true});await t.window.startAuthingLogin();assert(t.calls.includes('redirect'));assert(!t.calls.includes('open'));assert.equal(t.config.redirectResponseMode,'query');assert.equal(t.config.redirectUri,'https://zxy754638-eng.github.io/qinghe-chinese-demo/');
  t=await setup();await t.window.startAuthingLogin();assert(t.calls.includes('popup'));assert(!t.calls.includes('redirect'));
  t=await setup({mobile:true,callback:true});assert(t.window.qingheUserIdentity.signedIn);assert(t.calls.includes('clean'));
  t=await setup({callback:true,callbackFailure:true});assert(t.calls.includes('modal'));assert(t.nodes.get('authErrorMessage').textContent.includes('返回网站'));
  t=await setup({callback:true,callbackFailure:true,denied:true});assert(t.nodes.get('authErrorMessage').textContent.includes('访问权限'));
  console.log('PASS: mobile redirect, desktop popup, GitHub subpath, query callback, successful identity, failed callback modal, access-denied message.');
})().catch(error=>{console.error(error);process.exitCode=1});
