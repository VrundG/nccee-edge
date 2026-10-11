'use strict';
(()=>{
 const publicHost='vrundg.github.io';
 const apiOrigin='https://nccee-edge.lebronbron99.chatgpt.site';
 const storageKey='nccee-edge-session';
 const nativeFetch=window.fetch.bind(window);
 const usesRemoteApi=location.hostname===publicHost;
 const session=()=>{try{return sessionStorage.getItem(storageKey)||'';}catch{return '';}};
 const setSessionToken=token=>{try{if(token)sessionStorage.setItem(storageKey,token);else sessionStorage.removeItem(storageKey);}catch{}};
 window.NCCEEEdgeAPI={usesRemoteApi,setSessionToken,clearSessionToken:()=>setSessionToken('')};
 if(!usesRemoteApi)return;
 window.fetch=(input,options={})=>{
  const raw=typeof input==='string'?input:input instanceof URL?input.href:input.url;
  const target=new URL(raw,location.href);
  if(target.origin!==location.origin||!target.pathname.startsWith('/api/'))return nativeFetch(input,options);
  const headers=new Headers(input instanceof Request?input.headers:undefined);
  new Headers(options.headers||{}).forEach((value,key)=>headers.set(key,value));
  const token=session();if(token)headers.set('Authorization',`Bearer ${token}`);
  return nativeFetch(apiOrigin+target.pathname+target.search,{...options,headers,credentials:'omit'});
 };
})();
