/* Learning-map organization and evidence labels. No score is presented as mastery. */
(function(root){
'use strict';
const unitOrder={economics:['micro','macro','trade'],finance:['income','spending','saving','credit','investing','risk']};
const unitNames={micro:'Microeconomics',macro:'Macroeconomics',trade:'International Economics',income:'Earning income',spending:'Spending',saving:'Saving',credit:'Managing credit',investing:'Investing',risk:'Managing risk'};
const shared={economics:['econ-practice','econ-collection','econ-standards','nc-standards'],finance:['finance-practice','finance-test','finance-start','finance-standards','nc-standards']};
function groups(skills,track){return (unitOrder[track]||[]).map(id=>({id,name:unitNames[id],skills:skills.filter(skill=>skill.topic===id)})).filter(group=>group.skills.length);}
function displayState(skill){return {review:{key:'needs-review',label:'Needs review'},check:{key:'needs-review',label:'Needs review'},building:{key:'developing',label:'Developing'},positive:{key:'strong',label:'Strong recent evidence'},unseen:{key:'not-started',label:'Not started'}}[skill.state]||{key:'not-started',label:'Not started'};}
function relatedResources(skill,track,catalog){const ids=[skill.resource,...(shared[track]||[])],allowed=new Map(catalog.filter(item=>item.track===track||item.track==='both').map(item=>[item.id,item]));return [...new Set(ids)].map(id=>allowed.get(id)).filter(Boolean).slice(0,5);}
function hasDiagnostic(completions,track,attempt,history=[]){return Boolean(completions?.[track]||(attempt?.submitted&&attempt.mode==='diagnostic'&&(attempt.track===track||attempt.track==='all'))||history.some(item=>item?.mode==='diagnostic'&&(item.track===track||item.track==='all')));}
const api={unitOrder,unitNames,groups,displayState,relatedResources,hasDiagnostic};
if(typeof module!=='undefined'&&module.exports)module.exports=api;else root.LearningMapModel=api;
})(typeof window!=='undefined'?window:globalThis);
