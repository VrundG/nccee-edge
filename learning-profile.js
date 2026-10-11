/* Transparent study signals, not a validated proficiency or competition predictor. */
(function(root){
'use strict';
const bank=typeof module!=='undefined'&&module.exports?require('./practice-bank.js'):root.PracticeBank;
const resources={micro:'production',macro:'business-cycle',trade:'exchange',income:'earning',spending:'spending',saving:'saving',credit:'credit',investing:'investing',risk:'risk'};
const pilots=['forgone-pay','tradeoff','real-gdp','business-cycle','euros-to-dollars','exchange-change','gross-pay','compensation','budget','spending-choice','compound-saving','purchasing-power','compare-loans','collateral','diversification','total-return','deductible','fraud'];
const extra={'business-cycle':'Business-cycle patterns',compensation:'Total compensation','spending-choice':'Spending decisions','purchasing-power':'Purchasing power',collateral:'Secured loans',diversification:'Diversification',fraud:'Recognizing fraud'};
function skillId(q){return q.family||(/^pilot-\d{2}$/.test(q.id)?pilots[Number(q.id.slice(6))-1]:null);}
const skills=bank.families.map(f=>({id:f.id,label:f.label,topic:f.topic,resource:resources[f.topic]}));
for(const [id,label] of Object.entries(extra)){const q=bank.questions.find(q=>skillId(q)===id);skills.push({id,label,topic:q.topic,resource:resources[q.topic]});}
for(const s of skills)s.questionIds=bank.questions.filter(q=>skillId(q)===s.id).map(q=>q.id);
function skillsFor(track='all'){return skills.filter(s=>track==='all'||(['micro','macro','trade'].includes(s.topic)?'economics':'finance')===track);}
function diagnostic(seen=[],random=Math.random,track='all'){return bank.shuffle(skillsFor(track).map(s=>bank.sample(bank.questions.filter(q=>s.questionIds.includes(q.id)),1,seen,random)[0]),random);}
function analyze(history){
 const buckets=new Map(skills.map(s=>[s.id,[]])),seen=new Set();
 // History is newest first. Only the first response to each item version in the retained window counts.
 for(const attempt of [...history].reverse()){for(const q of attempt.questions||[]){const key=q.id+':'+q.version,id=skillId(q);if(!buckets.has(id)||seen.has(key)||!Number.isInteger(attempt.answers?.[q.id]))continue;seen.add(key);buckets.get(id).push({correct:attempt.answers[q.id]===q.answer,attemptId:attempt.id});}}
 return skills.map(s=>{const evidence=buckets.get(s.id),recent=evidence.slice(-5),prior=evidence.slice(-10,-5),correct=recent.filter(x=>x.correct).length,misses=recent.length-correct,sessions=new Set(evidence.map(x=>x.attemptId)).size,missSessions=new Set(evidence.filter(x=>!x.correct).map(x=>x.attemptId)).size;
 let state='unseen',label='Not checked yet';
 if(recent.length){state=misses?'check':'building';label=misses?'Check this concept':'Keep practicing';}
 if(recent.length>=3&&sessions>=2){if(misses>=2&&missSessions>=2&&correct/recent.length<.7){state='review';label='Review recommended';}else if(correct/recent.length>=.8){state='positive';label='Going well recently';}}
 let trend='';if(recent.length>=3&&prior.length>=3){const difference=correct/recent.length-prior.filter(x=>x.correct).length/prior.length;trend=difference>.15?'Improving on fresh questions':difference<-.15?'Recent results have dipped':'Recent results are similar';}
 return {...s,state,statusLabel:label,total:evidence.length,recentCount:recent.length,correct,misses,sessions,trend};
 });
}
function priorities(history){return analyze(history).filter(s=>['review','check'].includes(s.state)).sort((a,b)=>(a.state==='review'?0:1)-(b.state==='review'?0:1)||b.misses-a.misses);}
function review(skillIds,seen=[],random=Math.random,count=10){const wanted=new Set(skillIds);return bank.sample(bank.questions.filter(q=>wanted.has(skillId(q))),count,seen,random);}
const api={skills,skillsFor,skillId,diagnostic,analyze,priorities,review};if(typeof module!=='undefined'&&module.exports)module.exports=api;else root.LearningProfile=api;
})(typeof window!=='undefined'?window:globalThis);
