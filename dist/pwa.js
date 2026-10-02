let deferredInstallPrompt=null;
function updateConnectionNotice(){let notice=document.getElementById('offlineNotice');if(!navigator.onLine){if(!notice){notice=document.createElement('div');notice.id='offlineNotice';notice.className='offline-notice';notice.setAttribute('role','status');document.body.appendChild(notice)}notice.textContent=typeof ui==='function'?ui('当前离线 · 已缓存课程仍可学习','Offline · cached lessons remain available'):'当前离线 · 已缓存课程仍可学习'}else notice?.remove()}
function updateInstallButton(){const button=document.getElementById('installAppButton');if(button)button.textContent=typeof ui==='function'?ui('安装应用','Install app'):'安装应用'}
function ensureInstallButton(){if(document.getElementById('installAppButton'))return;const actions=document.querySelector('.top-actions');if(!actions)return;const button=document.createElement('button');button.id='installAppButton';button.type='button';button.className='secondary pwa-install';button.onclick=installQingheApp;actions.insertBefore(button,actions.firstChild);updateInstallButton()}
async function installQingheApp(){if(!deferredInstallPrompt)return;deferredInstallPrompt.prompt();await deferredInstallPrompt.userChoice;deferredInstallPrompt=null;document.getElementById('installAppButton')?.remove()}
window.addEventListener('beforeinstallprompt',event=>{event.preventDefault();deferredInstallPrompt=event;ensureInstallButton()});
window.addEventListener('appinstalled',()=>{deferredInstallPrompt=null;document.getElementById('installAppButton')?.remove()});
window.addEventListener('online',updateConnectionNotice);window.addEventListener('offline',updateConnectionNotice);document.addEventListener('qinghe:languagechange',()=>{updateConnectionNotice();updateInstallButton()});
updateConnectionNotice();
if('serviceWorker'in navigator)window.addEventListener('load',()=>navigator.serviceWorker.register('./sw.js?v=18').catch(()=>{}));
