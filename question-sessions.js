'use strict';
async function startQuestionSession(input){
 const response=await fetch('/api/question-sessions',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(input)}),data=await response.json();
 if(!response.ok)throw new Error(data.error||'The question set could not be started.');
 return data;
}
async function revealQuestionSessionAnswer(sessionId,index){
 const response=await fetch(`/api/question-sessions/${encodeURIComponent(sessionId)}/reveal`,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({index})}),data=await response.json();
 if(!response.ok)throw new Error(data.error||'The answer could not be revealed.');
 return data;
}
