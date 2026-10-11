(function(root,factory){
 const api=factory();
 if(typeof module==='object'&&module.exports)module.exports=api;
 else root.PracticeFlow=api;
})(typeof globalThis!=='undefined'?globalThis:this,function(){
 'use strict';
 function unansweredIndexes(questions,answers){
  const saved=answers&&typeof answers==='object'?answers:{};
  return (Array.isArray(questions)?questions:[]).reduce((missing,question,index)=>{
   if(!Number.isInteger(saved[question.id]))missing.push(index);
   return missing;
  },[]);
 }
 function answeredCount(questions,answers){return (Array.isArray(questions)?questions.length:0)-unansweredIndexes(questions,answers).length;}
 return {answeredCount,unansweredIndexes};
});
