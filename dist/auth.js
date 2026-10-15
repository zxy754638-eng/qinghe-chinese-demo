// 青禾中文账户接入：Authing OIDC + PKCE（浏览器端不保存应用密钥）
(function(){
  'use strict';

  // 回调地址跟随当前访问域名，发布到任何网址都无需改代码；
  // 只需在 Authing 控制台的登录/登出回调白名单中加入对应网址。
  const FALLBACK_REDIRECT='https://qinghe-chinese-demo.zxy794393457.chatgpt.site/';
  // 统一到目录地址：/index.html、/xxx/ 都归一成 /xxx/，避免与控制台登记的地址不一致
  function currentRedirectUri(){
    if(location.protocol!=='https:'&&location.protocol!=='http:')return FALLBACK_REDIRECT;
    let path=location.pathname||'/';
    if(path.toLowerCase().endsWith('/index.html'))path=path.slice(0,-'index.html'.length);
    if(!path.endsWith('/'))path='/'===path?path:path.replace(/[^/]*$/,'');
    return location.origin+path;
  }

  const CURRENT_REDIRECT=currentRedirectUri();

  // 注意：SDK 构造函数会在配置对象上补写默认字段，不要冻结它
  const AUTHING_CONFIG={
    domain:'https://bhsq30d4kstm-demo.authing.cn',
    appId:'6abc74da833f137d76ec5f25',
    userPoolId:'6abc74d9e8a3bce782835196',
    redirectUri:CURRENT_REDIRECT,
    scope:'openid profile email phone',
    useImplicitMode:false
  };

  let authingClient=null;
  let authLoginState=null;
  let authUserInfo=null;
  let authStatus='loading';
  let authErrorType='connection';
  let lastIdentitySignature='';
  let operation=0;
  let loginPopup=null;
  let popupPending=false;

  function deadline(promise,ms=15000){
    let timer;
    return Promise.race([promise,new Promise((_,reject)=>{timer=setTimeout(()=>reject(new Error('AUTH_TIMEOUT')),ms)})]).finally(()=>clearTimeout(timer));
  }
  function cleanCallbackUrl(){
    const url=new URL(location.href);
    ['code','state','error','error_description','session_state','iss'].forEach(key=>url.searchParams.delete(key));
    if(/(?:access_token|id_token|error)=/.test(url.hash))url.hash='';
    history.replaceState(history.state,document.title,url.pathname+url.search+url.hash);
  }
  function cancelAuthingLogin(){
    operation++;
    if(loginPopup&&!loginPopup.closed)loginPopup.close();
    loginPopup=null;
    byId('authCallbackBanner')?.classList.add('hidden');
    cleanCallbackUrl();
    authStatus=authLoginState?'signed-in':'signed-out';
    renderAuthUI();
    closeAccountModal();
  }

  const byId=id=>document.getElementById(id);
  const authModal=byId('accountModal');
  const authPanels=['authLoading','authSignedOut','authSignedIn','authError'];
  const text=(zh,en)=>document.body.dataset.uiLang==='en'?en:zh;

  function getAuthErrorText(){
    if(authErrorType==='popup')return text('登录窗口被浏览器拦截，请允许本站弹出窗口后重试。你也可以先返回学习。','Allow pop-ups for this site and try again, or return to learning.');
    if(authErrorType==='timeout')return text('账户服务响应超时。可以返回学习，不会删除本机学习记录。','The account service timed out. You can return to learning; local progress is preserved.');
    if(authErrorType==='login')return text('登录未完成。若 Authing 提示验证码错误，请检查验证码类型、接收账号及最新一条验证码；该校验由 Authing 完成。','Sign-in was not completed. If Authing rejects a code, check the code type, recipient and latest code. Codes are verified by Authing.');
    if(authErrorType==='logout')return text('退出登录失败，请稍后重试。','Sign-out failed. Please try again.');
    return text('无法连接账户服务，请检查网络后重试。','Could not connect to the account service. Check your connection and try again.');
  }

  function setPanel(panelId){
    authPanels.forEach(id=>byId(id)?.classList.toggle('hidden',id!==panelId));
  }

  function getClaims(){
    return Object.assign({},authLoginState?.parsedIdToken||{},authUserInfo||{});
  }

  function getIdentity(){
    const claims=getClaims();
    const email=claims.email||'';
    const phone=claims.phone_number||claims.phone||claims.mobile||'';
    const name=claims.name||claims.nickname||claims.preferred_username||claims.username||email||phone||text('学习者','Learner');
    const initial=String(name).trim().charAt(0).toUpperCase()||'A';
    return {name:String(name),email:String(email),phone:String(phone),initial};
  }

  function ensureProfileCard(){
    if(byId('authProfileCard'))return;
    const grid=document.querySelector('#profile .profile-grid');
    if(!grid)return;
    const card=document.createElement('article');
    card.className='card auth-profile-card';
    card.id='authProfileCard';
    card.innerHTML='<div class="auth-profile-head"><div class="large-avatar auth-user-data" id="authProfileAvatar">A</div><div><h3 id="authProfileTitle">账户与登录</h3><div class="auth-state" id="authProfileStatus">未登录</div></div></div><p class="sub" id="authProfileDescription">账号登录已接入；当前 Demo 的学习进度仍保存在本机。</p><div class="auth-actions"><button class="secondary" id="authProfileAction" type="button">登录 / 注册</button></div>';
    const themeCard=grid.querySelector('.theme-card');
    grid.insertBefore(card,themeCard||null);
    byId('authProfileAction').addEventListener('click',openAccountModal);
  }

  function renderAuthUI(){
    ensureProfileCard();
    const signedIn=authStatus==='signed-in';
    const identity=getIdentity();
    if(authModal){
      authModal.removeAttribute('aria-labelledby');
      authModal.setAttribute('aria-label',text('账户','Account'));
    }
    const accountLabel=byId('accountLabel');
    const accountAvatar=byId('accountAvatar');
    if(accountLabel)accountLabel.textContent=signedIn?identity.name:text('登录','Sign in');
    if(accountAvatar)accountAvatar.textContent=signedIn?identity.initial:'A';
    byId('accountButton')?.setAttribute('aria-label',signedIn?text('管理账户','Manage account'):text('打开账户','Open account'));

    if(authStatus==='loading')setPanel('authLoading');
    else if(authStatus==='signed-in')setPanel('authSignedIn');
    else if(authStatus==='error')setPanel('authError');
    else setPanel('authSignedOut');

    if(signedIn){
      byId('authModalAvatar').textContent=identity.initial;
      byId('authUserName').textContent=identity.name;
      byId('authUserEmail').textContent=identity.email||text('未提供','Not provided');
      byId('authUserPhone').textContent=identity.phone||text('未提供','Not provided');
      byId('authSyncNote').classList.remove('hidden');
    }

    const profileAvatar=byId('authProfileAvatar');
    const profileTitle=byId('authProfileTitle');
    const profileStatus=byId('authProfileStatus');
    const profileDescription=byId('authProfileDescription');
    const profileAction=byId('authProfileAction');
    if(profileAvatar)profileAvatar.textContent=signedIn?identity.initial:'A';
    if(profileTitle)profileTitle.textContent=text('账户与登录','Account & sign-in');
    if(profileStatus){
      profileStatus.textContent=signedIn?text('已连接 Authing','Authing connected'):text('未登录','Not signed in');
      profileStatus.classList.toggle('signed-in',signedIn);
    }
    if(profileDescription)profileDescription.textContent=signedIn
      ?text('账户已连接。当前 Demo 尚未开启云端学习进度同步。','Account connected. Cloud progress sync is not enabled in this demo yet.')
      :text('账号登录已接入；当前 Demo 的学习进度仍保存在本机。','Account sign-in is connected. Learning progress is still stored on this device in this demo.');
    if(profileAction)profileAction.textContent=signedIn?text('管理账户','Manage account'):text('登录 / 注册','Sign in / Register');
    if(authStatus==='error'&&byId('authErrorMessage'))byId('authErrorMessage').textContent=getAuthErrorText();
    const publicIdentity={signedIn,name:signedIn?identity.name:'Alex',initial:signedIn?identity.initial:'A'};
    window.qingheUserIdentity=publicIdentity;
    const signature=JSON.stringify(publicIdentity);
    if(signature!==lastIdentitySignature){lastIdentitySignature=signature;document.dispatchEvent(new CustomEvent('qinghe:identitychange',{detail:publicIdentity}))}
  }

  function openAccountModal(){
    renderAuthUI();
    if(typeof window.openManagedModal==='function')window.openManagedModal(authModal);
    else authModal?.classList.add('show');
  }

  function closeAccountModal(){
    if(typeof window.closeManagedModal==='function')window.closeManagedModal(authModal);
    else authModal?.classList.remove('show');
  }

  async function loadUserInfo(){
    try{return await deadline(authingClient.getUserInfo(),5000)}catch(error){return null}
  }

  // 网络慢时 getLoginState 可能超时（SDK 内部警告"登录态获取超时"），
  // 重试一次再下结论，避免已登录用户被误显示为未登录
  async function getLoginStateWithRetry(){
    try{
      const first=await authingClient.getLoginState();
      if(first)return first;
    }catch(error){console.warn('[qinghe-auth] getLoginState first attempt failed:',error&&error.message)}
    try{
      const second=await authingClient.getLoginState();
      return second||null;
    }catch(error){
      console.warn('[qinghe-auth] getLoginState retry failed:',error&&error.message);
      return null;
    }
  }

  async function initAuthing(){
    if(popupPending)return;
    const current=++operation;
    authStatus='loading';
    authErrorType='connection';
    renderAuthUI();
    try{
      if(!window.AuthingFactory?.Authing)throw new Error('SDK unavailable');
      authingClient=authingClient||new window.AuthingFactory.Authing(AUTHING_CONFIG);
      if(authingClient.isRedirectCallback()){
        byId('authCallbackBanner')?.classList.remove('hidden');
        const state=await deadline(authingClient.handleRedirectCallback());
        if(current!==operation)return;
        authLoginState=state;
        const info=await loadUserInfo();
        if(current!==operation)return;
        authUserInfo=info;
        authStatus=authLoginState?'signed-in':'signed-out';
        cleanCallbackUrl();
        byId('authCallbackBanner')?.classList.add('hidden');
      }else{
        const state=await deadline(getLoginStateWithRetry());
        if(current!==operation)return;
        authLoginState=state;
        if(state){const info=await loadUserInfo();if(current!==operation)return;authUserInfo=info;}
        authStatus=authLoginState?'signed-in':'signed-out';
      }
    }catch(error){
      if(current!==operation)return;
      byId('authCallbackBanner')?.classList.add('hidden');
      authStatus='error';
      authErrorType=error?.message==='AUTH_TIMEOUT'?'timeout':'connection';
      cleanCallbackUrl();
    }
    renderAuthUI();
  }

  async function startAuthingLogin(){
    if(popupPending)return;
    const current=++operation;
    try{
      if(!window.AuthingFactory?.Authing)throw new Error('SDK unavailable');
      authingClient=authingClient||new window.AuthingFactory.Authing(AUTHING_CONFIG);
      // 在点击事件内预开窗口，避免 SDK 生成 PKCE 后失去用户手势而被拦截。
      loginPopup=window.open('about:blank','authing-spa-login-window','popup,width=500,height=720');
      if(!loginPopup){authErrorType='popup';authStatus='error';renderAuthUI();return;}
      popupPending=true;
      authStatus='loading';
      renderAuthUI();
      const state=await deadline(authingClient.loginWithPopup({
        redirectUri:AUTHING_CONFIG.redirectUri,
        forced:false
      }),180000);
      if(current!==operation)return;
      if(state){
        authLoginState=state;
        const info=await loadUserInfo();
        if(current!==operation)return;
        authUserInfo=info;
      }
      authStatus=authLoginState?'signed-in':'signed-out';
      renderAuthUI();
    }catch(error){
      if(current!==operation)return;
      authStatus='error';
      authErrorType=error?.message==='AUTH_TIMEOUT'?'timeout':'login';
      renderAuthUI();
    }finally{
      if(loginPopup&&!loginPopup.closed)loginPopup.close();
      loginPopup=null;
      popupPending=false;
    }
  }

  async function logoutAuthing(){
    try{
      if(!authingClient)await initAuthing();
      await authingClient.logoutWithRedirect({redirectUri:AUTHING_CONFIG.redirectUri});
    }catch(error){
      authStatus='error';
      authErrorType='logout';
      renderAuthUI();
    }
  }

  window.openAccountModal=openAccountModal;
  window.closeAccountModal=cancelAuthingLogin;
  window.initAuthing=initAuthing;
  window.startAuthingLogin=startAuthingLogin;
  window.logoutAuthing=logoutAuthing;
  window.cancelAuthingLogin=cancelAuthingLogin;

  authModal?.addEventListener('click',event=>{if(event.target===authModal)cancelAuthingLogin()});
  document.addEventListener('keydown',event=>{if(event.key==='Escape'&&(authModal?.classList.contains('show')||!byId('authCallbackBanner')?.classList.contains('hidden')))cancelAuthingLogin()});
  document.addEventListener('qinghe:languagechange',renderAuthUI);
  ensureProfileCard();
  initAuthing();
})();

