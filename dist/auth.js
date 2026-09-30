// 青禾中文账户接入：Authing OIDC + PKCE（浏览器端不保存应用密钥）
(function(){
  'use strict';

  // 回调地址跟随当前访问域名，发布到任何网址都无需改代码；
  // 只需在 Authing 控制台的登录/登出回调白名单中加入对应网址。
  const FALLBACK_REDIRECT='https://qinghe-chinese-demo.zxy794393457.chatgpt.site/';
  const CURRENT_REDIRECT=(location.protocol==='https:'||location.protocol==='http:')
    ?location.origin+location.pathname
    :FALLBACK_REDIRECT;

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

  const byId=id=>document.getElementById(id);
  const authModal=byId('accountModal');
  const authPanels=['authLoading','authSignedOut','authSignedIn','authError'];
  const text=(zh,en)=>document.body.dataset.uiLang==='en'?en:zh;

  function getAuthErrorText(){
    if(authErrorType==='login')return text('未能打开登录页，请稍后重试。','Could not open the sign-in page. Please try again.');
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
  }

  function openAccountModal(){
    renderAuthUI();
    authModal?.classList.add('show');
  }

  function closeAccountModal(){
    authModal?.classList.remove('show');
  }

  async function loadUserInfo(){
    try{authUserInfo=await authingClient.getUserInfo()}catch(error){authUserInfo=null}
  }

  async function initAuthing(){
    authStatus='loading';
    authErrorType='connection';
    renderAuthUI();
    try{
      if(!window.AuthingFactory?.Authing)throw new Error('SDK unavailable');
      authingClient=authingClient||new window.AuthingFactory.Authing(AUTHING_CONFIG);
      if(authingClient.isRedirectCallback()){
        byId('authCallbackBanner')?.classList.remove('hidden');
        authLoginState=await authingClient.handleRedirectCallback();
        await loadUserInfo();
        authStatus=authLoginState?'signed-in':'signed-out';
        history.replaceState({},document.title,location.pathname||'/');
        byId('authCallbackBanner')?.classList.add('hidden');
      }else{
        authLoginState=await authingClient.getLoginState();
        if(authLoginState)await loadUserInfo();
        authStatus=authLoginState?'signed-in':'signed-out';
      }
    }catch(error){
      console.error('[qinghe-auth] init failed:',error);
      byId('authCallbackBanner')?.classList.add('hidden');
      authStatus='error';
      authErrorType='connection';
    }
    renderAuthUI();
  }

  async function startAuthingLogin(){
    try{
      if(!authingClient)await initAuthing();
      if(!authingClient||authStatus==='error')return;
      authStatus='loading';
      renderAuthUI();
      await authingClient.loginWithRedirect({
        redirectUri:AUTHING_CONFIG.redirectUri,
        originalUri:AUTHING_CONFIG.redirectUri,
        forced:false
      });
    }catch(error){
      authStatus='error';
      authErrorType='login';
      renderAuthUI();
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
  window.closeAccountModal=closeAccountModal;
  window.initAuthing=initAuthing;
  window.startAuthingLogin=startAuthingLogin;
  window.logoutAuthing=logoutAuthing;

  authModal?.addEventListener('click',event=>{if(event.target===authModal)closeAccountModal()});
  document.addEventListener('keydown',event=>{if(event.key==='Escape')closeAccountModal()});
  document.addEventListener('qinghe:languagechange',renderAuthUI);
  ensureProfileCard();
  initAuthing();
})();
