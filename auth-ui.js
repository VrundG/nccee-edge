'use strict';
let studentAccount=null,studentRegions=[],sessionCount=0,authRecoveryCode='',regionalReachAccess=false,regionalReachData=null,regionalReachBusy=false,regionalReachError='',authMode='login',authBusy=false,authMessage='';

function renderAccountLink(){
 const link=document.getElementById('student-account-link');if(!link)return;
 link.textContent=studentAccount?(studentAccount.region?`@${studentAccount.username}`:'Add your region'):'Sign in or create account';
 link.classList.toggle('signed-in',Boolean(studentAccount));
 link.classList.toggle('needs-region',Boolean(studentAccount&&!studentAccount.region));
 if(['account','regional-reach','editorial-review'].includes(currentRoute()))link.setAttribute('aria-current','page');else link.removeAttribute('aria-current');
}

async function loadStudentSession(){
 try{const response=await fetch('/api/auth/session',{cache:'no-store'}),data=await response.json();studentAccount=response.ok?data.student:null;studentRegions=response.ok&&Array.isArray(data.regions)?data.regions:[];sessionCount=response.ok?Number(data.sessionCount||0):0;regionalReachAccess=Boolean(response.ok&&data.canViewRegionalReach);if(response.status===401)window.NCCEEEdgeAPI?.clearSessionToken();}
 catch{studentAccount=null;studentRegions=[];sessionCount=0;regionalReachAccess=false;}
 renderAccountLink();
}

function regionOptions(selected=''){return `<option value="">Choose your region</option>${studentRegions.map(region=>`<option value="${esc(region)}" ${selected===region?'selected':''}>${esc(region)}</option>`).join('')}`;}

function authForm(){
 const registering=authMode==='register',recovering=authMode==='recover';
 return `<div class="auth-tabs" role="group" aria-label="Student account action"><button type="button" data-auth-mode="login" class="${!registering&&!recovering?'active':''}" aria-pressed="${!registering&&!recovering}">Sign in</button><button type="button" data-auth-mode="register" class="${registering?'active':''}" aria-pressed="${registering}">Create account</button></div><form id="student-auth-form" class="auth-form" data-mode="${authMode}"><div class="field"><label for="student-username">Username</label><input id="student-username" name="username" autocomplete="username" autocapitalize="none" spellcheck="false" pattern="[A-Za-z][A-Za-z0-9_]{2,31}" minlength="3" maxlength="32" required aria-describedby="username-help"><p id="username-help" class="field-help">3–32 letters, numbers, or underscores; begin with a letter.</p></div>${recovering?`<div class="field"><label for="student-recovery">Recovery code</label><input id="student-recovery" name="recoveryCode" autocomplete="off" maxlength="39" required><p class="field-help">Enter the one-time code saved when the account was created.</p></div><div class="field"><label for="student-password">New passphrase</label><input id="student-password" name="password" type="password" autocomplete="new-password" minlength="15" maxlength="128" required></div><div class="field"><label for="student-password-confirm">Confirm new passphrase</label><input id="student-password-confirm" name="passwordConfirm" type="password" autocomplete="new-password" minlength="15" maxlength="128" required></div>`:`<div class="field"><label for="student-password">${registering?'Create a passphrase':'Passphrase'}</label><input id="student-password" name="password" type="password" autocomplete="${registering?'new-password':'current-password'}" minlength="15" maxlength="128" required aria-describedby="password-help"><p id="password-help" class="field-help">Use at least 15 characters. A short sentence is easier to remember.</p></div>${registering?`<div class="field"><label for="student-region">Your region</label><select id="student-region" name="region" required aria-describedby="region-help">${regionOptions()}</select><p id="region-help" class="field-help">This broad region helps measure whether preparation reaches students across North Carolina. It is not shown publicly.</p></div><div class="field"><label for="student-password-confirm">Confirm passphrase</label><input id="student-password-confirm" name="passwordConfirm" type="password" autocomplete="new-password" minlength="15" maxlength="128" required></div>`:''}`}${authMessage?`<p class="auth-message" role="alert">${esc(authMessage)}</p>`:''}<button class="pill blue auth-submit" type="submit" ${authBusy?'disabled':''}>${authBusy?'Please wait…':recovering?'Recover account':registering?'Create my account':'Sign in'}</button>${!registering&&!recovering?'<button class="plain-button recovery-link" type="button" data-auth-mode="recover">Use a recovery code</button>':recovering?'<button class="plain-button recovery-link" type="button" data-auth-mode="login">Back to sign in</button>':''}</form>`;
}

function currentProgressSummary(){
 const diagnostics=Object.values(diagnosticCompletions||{}).filter(Boolean).length;
 return {resources:sheet.size,results:practiceHistory.length,diagnostics,active:Boolean(practiceAttempt)};
}

function profilePicture(){
 const initial=esc(studentAccount.username.slice(0,1).toUpperCase());
 const image=studentAccount.profileImage?`<img src="${esc(studentAccount.profileImage)}" alt="Profile picture for @${esc(studentAccount.username)}">`:initial;
 return `<div class="account-identity${studentAccount.profileImage?' has-picture':''}">${image}</div><div class="profile-picture-actions"><button class="pill outline profile-picture-button" type="button" data-auth-action="choose-avatar">${studentAccount.profileImage?'Change picture':'Add profile picture'}</button><input id="profile-picture-input" type="file" accept="image/jpeg,image/png,image/webp" hidden>${studentAccount.profileImage?'<button class="plain-button" type="button" data-auth-action="remove-avatar">Remove picture</button>':''}<p class="field-help">JPG, PNG, or WebP. Your photo is resized before it is saved.</p></div>`;
}

function recoveryCodePanel(){return authRecoveryCode?`<section class="recovery-code-card" role="status"><p class="eyebrow">SAVE THIS ONE-TIME RECOVERY CODE</p><h3>${esc(authRecoveryCode)}</h3><p>Store it somewhere private. NCCEE Edge cannot display this code again, and using it to reset the passphrase invalidates it.</p><div class="toolbar"><button class="pill blue" data-auth-action="copy-recovery">Copy code</button><button class="pill outline" data-auth-action="download-recovery">Download code</button><button class="plain-button" data-auth-action="dismiss-recovery">I saved it</button></div></section>`:'';}
function accountTools(management=false){return `<div class="account-tools"><details><summary>Recovery and security</summary><form id="recovery-code-form" class="auth-form compact"><p>${studentAccount.recoveryReady?'Creating a new code replaces the previous one.':'Create a one-time code in case you forget your passphrase.'}</p><div class="field"><label for="recovery-current-password">Current passphrase</label><input id="recovery-current-password" name="currentPassword" type="password" autocomplete="current-password" minlength="15" maxlength="128" required></div><button class="pill outline" type="submit">${studentAccount.recoveryReady?'Replace recovery code':'Create recovery code'}</button></form></details><details><summary>Signed-in sessions</summary><p>${sessionCount} active ${sessionCount===1?'session':'sessions'} for this account.</p><button class="pill outline" data-auth-action="logout-others" ${sessionCount<=1?'disabled':''}>Sign out other sessions</button></details><details><summary>Export my data</summary><p>Download account details, saved progress, diagnostic completion records, and question reports as JSON. Passwords and session tokens are excluded.</p><button class="pill outline" data-auth-action="export">Download my data</button></details>${management?'':`<details class="danger-zone"><summary>Delete my account</summary><p>This permanently deletes the account, saved progress, diagnostics, reports, and active sessions.</p><form id="delete-account-form" class="auth-form compact"><div class="field"><label for="delete-username">Type your username</label><input id="delete-username" name="username" autocomplete="off" required></div><div class="field"><label for="delete-password">Current passphrase</label><input id="delete-password" name="password" type="password" autocomplete="current-password" required></div><button class="pill danger" type="submit">Permanently delete account</button></form></details>`}</div>`;}

function accountPage(){
 if(studentAccount?.role==='management')return `${header('Management Account','This account opens NCCEE Edge reporting and does not appear in student participation totals.')}${recoveryCodePanel()}<div class="account-layout"><section class="account-card signed-in-card"><p class="eyebrow">MANAGEMENT ACCESS</p>${profilePicture()}<h3>@${esc(studentAccount.username)}</h3><p>Regional analytics and the editorial review queue are available only while this management account is signed in.</p>${authMessage?`<p class="auth-message" role="alert">${esc(authMessage)}</p>`:''}<div class="toolbar"><a class="pill blue admin-dashboard-link" href="#regional-reach">Open Regional Reach →</a><a class="pill outline admin-dashboard-link" href="#editorial-review">Review reported questions →</a></div><button class="plain-button account-logout" type="button" data-auth-action="logout" ${authBusy?'disabled':''}>Sign out</button></section><aside class="account-note"><h3>Protected operations</h3><ul><li>Statewide and regional participation totals</li><li>Economics and Personal Finance diagnostic activity</li><li>Reported-question review with documented decisions</li></ul>${accountTools(true)}</aside></div>`;
 if(studentAccount)return `${header('Your student account','Use the same NCCEE Edge username to return to your diagnostics, study sheet, learning maps, and practice history.')}${recoveryCodePanel()}<div class="account-layout"><section class="account-card signed-in-card"><p class="eyebrow">SIGNED IN</p>${profilePicture()}<h3>@${esc(studentAccount.username)}</h3><p>Your progress is stored separately from every other student account.</p><form id="student-region-form" class="region-form ${studentAccount.region?'':'region-required'}"><div class="field"><label for="account-region">${studentAccount.region?'Your region':'Add your region to finish setup'}</label><select id="account-region" name="region" required>${regionOptions(studentAccount.region||'')}</select><p class="field-help">We use this broad region to measure where students are using diagnostics and preparation resources. Your region is not shown publicly.</p></div>${authMessage?`<p class="auth-message" role="alert">${esc(authMessage)}</p>`:''}<button class="pill ${studentAccount.region?'outline':'blue'}" type="submit" ${authBusy?'disabled':''}>${authBusy?'Saving…':studentAccount.region?'Update region':'Save my region'}</button></form><button class="plain-button account-logout" type="button" data-auth-action="logout" ${authBusy?'disabled':''}>Sign out</button></section><aside class="account-note"><h3>What stays with this account</h3><ul><li>Completed diagnostics and learning-map access</li><li>Your current practice set and recent results</li><li>Study-sheet topics and review checkmarks</li><li>Your selected region for aggregate reach reporting</li></ul>${regionalReachAccess?'<a class="pill blue admin-dashboard-link" href="#regional-reach">Open Regional Reach →</a>':''}${accountTools(false)}</aside></div>`;
 const saved=currentProgressSummary(),hasSaved=saved.resources||saved.results||saved.diagnostics||saved.active;
 const savedNotice=hasSaved?`<div class="account-transfer"><strong>Your work is ready to move.</strong><p>Creating an account will attach ${saved.resources} saved ${saved.resources===1?'resource':'resources'}, ${saved.results} completed ${saved.results===1?'result':'results'}${saved.diagnostics?`, and ${saved.diagnostics} completed ${saved.diagnostics===1?'diagnostic':'diagnostics'}`:''} to it.</p></div>`:'';
 return `${header('Welcome to NCCEE Edge','Sign in before choosing a challenge so your diagnostic, learning map, and study plan stay together.')}<div class="account-entry-layout"><section class="account-card">${savedNotice}${authForm()}</section><aside class="account-welcome"><div class="account-welcome-photo"><img src="assets/nccee-competition-team.jpg" width="1800" height="1350" alt="Five participants in business attire stand together at an NCCEE competition event"></div><div class="account-welcome-copy"><p class="eyebrow">YOUR PREPARATION STARTS HERE</p><h3>One account. A clear path forward.</h3><ol><li>Choose Economics or Personal Finance.</li><li>Take the diagnostic to find your starting point.</li><li>Use your learning map to practice the skills that need attention.</li></ol>${regionalReachAccess?'<a class="pill outline admin-dashboard-link" href="#regional-reach">Open Regional Reach →</a>':''}<p class="fine">NCCEE Edge does not collect an email address. Choose a memorable passphrase and keep it secure.</p></div></aside></div>`;
}

function regionalMetric(label,value){return `<div><dt>${value}</dt><dd>${label}</dd></div>`;}
function regionalReachPage(){
 if(!regionalReachAccess)return `${header('Regional Reach','This aggregate NCCEE Edge report is restricted to authorized project administrators.')}<div class="empty"><h3>Administrator access required</h3><p>Student accounts and individual activity are not exposed here.</p><a href="#account">Return to your account →</a></div>`;
 if(regionalReachError)return `${header('Regional Reach','Measure whether competition preparation is reaching students across North Carolina.')}<div class="notice"><h3>The report could not be loaded</h3><p>${esc(regionalReachError)}</p><button class="pill outline" data-regional-reach="retry">Try again</button></div>`;
 if(!regionalReachData)return `${header('Regional Reach','Measure whether competition preparation is reaching students across North Carolina.')}<p role="status">Loading aggregate regional activity…</p>`;
 const data=regionalReachData,max=Math.max(1,...data.regions.map(region=>region.registrations)),updated=new Date(data.generatedAt).toLocaleString();
 return `${header('Regional Reach','Measure whether competition preparation is reaching students across North Carolina.')}<section class="reach-summary" aria-label="Statewide totals"><p class="eyebrow">CURRENT REACH</p><dl>${regionalMetric('student accounts',data.totals.registrations)}${regionalMetric('active learners',data.totals.activeLearners)}${regionalMetric('diagnostic learners',data.totals.diagnosticLearners)}${regionalMetric('study planners',data.totals.studyPlanners)}</dl><p class="fine">Updated ${esc(updated)}. Counts are aggregate and do not reveal usernames or individual answers.</p></section><section class="reach-regions"><div class="reach-heading"><div><h3>Reach by region</h3><p>Every region in the BFF/NCCEE partnership plan remains visible, including regions with zero current users.</p></div><div class="reach-key"><span>Accounts</span><span>Active</span><span>Diagnostics</span></div></div><div class="reach-grid">${data.regions.map(region=>`<article class="reach-card"><div class="reach-card-head"><h4>${esc(region.region)}</h4><strong>${region.registrations}</strong></div><div class="reach-bar" aria-hidden="true"><span style="width:${Math.round(region.registrations/max*100)}%"></span></div><dl>${regionalMetric('Active learners',region.activeLearners)}${regionalMetric('Diagnostic learners',region.diagnosticLearners)}${regionalMetric('Study planners',region.studyPlanners)}</dl><p class="fine">${region.economicsDiagnostics} economics · ${region.financeDiagnostics} personal finance diagnostics</p></article>`).join('')}</div></section><details class="reach-method"><summary>How these counts work</summary><p><strong>Student accounts</strong> counts registrations with that region. <strong>Active learners</strong> have saved progress. <strong>Diagnostic learners</strong> completed at least one challenge diagnostic. <strong>Study planners</strong> saved at least one resource to a study sheet.</p><p>“Other responses” combines students outside North Carolina, students who prefer not to answer, and older accounts that have not added a region. Current other responses: ${data.other.registrations}.</p></details><p><a href="#account">← Back to your account</a></p>`;
}

async function loadRegionalReach(force=false){
 if(!regionalReachAccess||regionalReachBusy||regionalReachData&&!force||regionalReachError&&!force)return;
 regionalReachBusy=true;regionalReachError='';if(force)regionalReachData=null;
 try{const response=await fetch('/api/regional-reach',{cache:'no-store'}),data=await response.json();if(!response.ok)throw new Error(data.error||'Regional reporting is unavailable.');regionalReachData=data;}
 catch(error){regionalReachError=error.message;}
 finally{regionalReachBusy=false;if(currentRoute()==='regional-reach')render();}
}

async function prepareIdentityChange(){
 if(progressGeneration>progressSavedGeneration||progressPending){await saveProgress();if(progressGeneration>progressSavedGeneration||progressPending)throw new Error('Your current progress has not finished saving. Retry the save before switching accounts.');}
}

async function changeStudentAccount(path,body){
 await prepareIdentityChange();
 const response=await fetch(`/api/auth/${path}`,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(body)}),data=await response.json();
 if(!response.ok)throw new Error(data.error||'The account request could not be completed.');
 if(data.sessionToken)window.NCCEEEdgeAPI?.setSessionToken(data.sessionToken);
 studentAccount=data.student||null;sessionCount=studentAccount?1:0;regionalReachAccess=Boolean(data.canViewRegionalReach);authMessage='';resetProgressState();renderAccountLink();await loadStudentSession();await loadProgress();return data;
}

async function resizeProfilePicture(file){
 if(!['image/jpeg','image/png','image/webp'].includes(file.type)||file.size>8*1024*1024)throw new Error('Choose a JPG, PNG, or WebP image under 8 MB.');
 const source=await new Promise((resolve,reject)=>{const image=new Image(),reader=new FileReader();reader.onerror=()=>reject(new Error('The image could not be read.'));reader.onload=()=>{image.onerror=()=>reject(new Error('The image could not be opened.'));image.onload=()=>resolve(image);image.src=reader.result;};reader.readAsDataURL(file);});
 const canvas=document.createElement('canvas'),size=256,scale=Math.max(size/source.naturalWidth,size/source.naturalHeight),width=size/scale,height=size/scale,left=(source.naturalWidth-width)/2,top=(source.naturalHeight-height)/2;canvas.width=size;canvas.height=size;canvas.getContext('2d').drawImage(source,left,top,width,height,0,0,size,size);return canvas.toDataURL('image/jpeg',.82);
}

async function saveProfilePicture(profileImage){
 const response=await fetch('/api/auth/avatar',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({profileImage})}),data=await response.json();if(!response.ok)throw new Error(data.error||'Could not save your profile picture.');studentAccount=data.student;renderAccountLink();
}

document.addEventListener('change',async event=>{
 if(event.target.id!=='profile-picture-input'||authBusy)return;const file=event.target.files?.[0];if(!file)return;authBusy=true;authMessage='';
 try{await saveProfilePicture(await resizeProfilePicture(file));notify('Profile picture saved.');}
 catch(error){authMessage=error.message;}
 finally{authBusy=false;if(currentRoute()==='account')render();}
});

document.addEventListener('click',async event=>{
 const reachAction=event.target.closest('[data-regional-reach]');if(reachAction){regionalReachError='';loadRegionalReach(true);return;}
 const modeButton=event.target.closest('[data-auth-mode]');
 if(modeButton){authMode=['register','recover'].includes(modeButton.dataset.authMode)?modeButton.dataset.authMode:'login';authMessage='';render();document.getElementById('student-username')?.focus();return;}
 const action=event.target.closest('[data-auth-action]');if(!action||authBusy)return;
 if(action.dataset.authAction==='choose-avatar'){document.getElementById('profile-picture-input')?.click();return;}
 if(action.dataset.authAction==='remove-avatar'){authBusy=true;authMessage='';try{await saveProfilePicture(null);notify('Profile picture removed.');}catch(error){authMessage=error.message;}finally{authBusy=false;if(currentRoute()==='account')render();}return;}
 if(action.dataset.authAction==='copy-recovery'){try{await navigator.clipboard.writeText(authRecoveryCode);notify('Recovery code copied.');}catch{notify('Copy is unavailable. Use Download code instead.');}return;}
 if(action.dataset.authAction==='download-recovery'){download('NCCEE-Edge-recovery-code.txt',`NCCEE Edge recovery code for @${studentAccount.username}\n\n${authRecoveryCode}\n\nStore this code privately. It can be used once to reset the account passphrase.`);notify('Recovery code downloaded.');return;}
 if(action.dataset.authAction==='dismiss-recovery'){authRecoveryCode='';render();return;}
 if(action.dataset.authAction==='logout-others'){authBusy=true;try{const response=await fetch('/api/auth/logout-others',{method:'POST',headers:{'Content-Type':'application/json'},body:'{}'}),data=await response.json();if(!response.ok)throw new Error(data.error||'Other sessions could not be signed out.');sessionCount=1;notify('Other sessions signed out.');}catch(error){authMessage=error.message;}finally{authBusy=false;render();}return;}
 if(action.dataset.authAction==='export'){authBusy=true;try{const response=await fetch('/api/account/export',{cache:'no-store'}),data=await response.json();if(!response.ok)throw new Error(data.error||'Your data could not be exported.');download(`NCCEE-Edge-${studentAccount.username}-data.json`,JSON.stringify(data,null,2));notify('Account data downloaded.');}catch(error){authMessage=error.message;}finally{authBusy=false;render();}return;}
 if(action.dataset.authAction!=='logout')return;
 authBusy=true;authMessage='';render();
 try{await prepareIdentityChange();const response=await fetch('/api/auth/logout',{method:'POST'}),data=await response.json();if(!response.ok)throw new Error(data.error||'Could not sign out.');window.NCCEEEdgeAPI?.clearSessionToken();studentAccount=null;sessionCount=0;authRecoveryCode='';regionalReachData=null;resetProgressState();await loadStudentSession();await loadProgress();notify('Signed out of the account.');}
 catch(error){authMessage=error.message;render();}
 finally{authBusy=false;if(currentRoute()==='account')render();}
});

document.addEventListener('submit',async event=>{
 const form=event.target;if(form.id!=='student-auth-form'||authBusy)return;event.preventDefault();
 const fields=new FormData(form),username=String(fields.get('username')||''),password=String(fields.get('password')||''),registering=form.dataset.mode==='register',recovering=form.dataset.mode==='recover';
 if((registering||recovering)&&password!==String(fields.get('passwordConfirm')||'')){authMessage='The passphrases do not match.';render();document.getElementById('student-password-confirm')?.focus();return;}
 authBusy=true;authMessage='';render();
 try{const path=recovering?'recover':registering?'register':'login',body=recovering?{username,recoveryCode:String(fields.get('recoveryCode')||''),newPassword:password}:{username,password,...(registering?{region:String(fields.get('region')||'')}:{})},result=await changeStudentAccount(path,body);authRecoveryCode=result.recoveryCode||'';notify(recovering?'Account recovered. Create and save a new recovery code.':registering?(result.progressMigrated?'Account created. Your existing progress moved with you.':'Student account created.'):(result.canViewRegionalReach?'Management access confirmed.':'Signed in to your student account.'));location.hash=(authRecoveryCode||recovering)?'account':result.canViewRegionalReach?'regional-reach':'overview';render(true);}
 catch(error){authMessage=error.message;render();document.querySelector('.auth-message')?.focus?.();}
 finally{authBusy=false;if(currentRoute()==='account')render();}
});

document.addEventListener('submit',async event=>{
 const form=event.target;if(!['recovery-code-form','delete-account-form'].includes(form.id)||authBusy)return;event.preventDefault();authBusy=true;authMessage='';
 try{const values=new FormData(form);if(form.id==='recovery-code-form'){const response=await fetch('/api/auth/recovery-code',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({currentPassword:String(values.get('currentPassword')||'')})}),data=await response.json();if(!response.ok)throw new Error(data.error||'A recovery code could not be created.');studentAccount=data.student;authRecoveryCode=data.recoveryCode;notify('New recovery code created. Save it now.');render();return;}
  const response=await fetch('/api/account/delete',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({username:String(values.get('username')||''),password:String(values.get('password')||'')})}),data=await response.json();if(!response.ok)throw new Error(data.error||'The account could not be deleted.');window.NCCEEEdgeAPI?.clearSessionToken();studentAccount=null;sessionCount=0;resetProgressState();await loadStudentSession();await loadProgress();location.hash='account';notify('Account and saved data deleted.');}
 catch(error){authMessage=error.message;render();}
 finally{authBusy=false;if(currentRoute()==='account')render();}
});

document.addEventListener('submit',async event=>{
 const form=event.target;if(form.id!=='student-region-form'||authBusy)return;event.preventDefault();
 const region=String(new FormData(form).get('region')||'');authBusy=true;authMessage='';render();
 try{const response=await fetch('/api/auth/region',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({region})}),data=await response.json();if(!response.ok)throw new Error(data.error||'Could not save your region.');studentAccount=data.student;renderAccountLink();notify('Your region is saved.');}
 catch(error){authMessage=error.message;}
 finally{authBusy=false;if(currentRoute()==='account')render();}
});
