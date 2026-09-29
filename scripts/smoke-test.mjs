import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
const base='http://127.0.0.1:3000';
const routes=['/','/about','/services','/process','/contact','/privacy','/projects','/projects/third-street-apartments','/projects/sri-anugrahas-anantaneni','/projects/vinayagapuram-villa','/projects/vetrivel-nagar-villa','/projects/first-main-road-residence','/projects/poombuhar-duplex','/robots.txt','/sitemap.xml'];
for(const route of routes){const r=await fetch(base+route);assert.equal(r.status,200,route);const html=await r.text();if(!route.endsWith('.xml')&&!route.endsWith('.txt')){assert.match(html,/<h1/,route);const assets=[...html.matchAll(/(?:src|srcSet)="([^"<>]+)"/g)].map(m=>m[1].replaceAll('&amp;','&')).filter(a=>a.startsWith('/images/'));for(const asset of new Set(assets)){assert.equal((await fetch(base+asset)).status,200,asset)}}}
assert.equal((await fetch(base+'/projects/unknown-project')).status,404);
const body={name:'Website test',email:'test@example.com',phone:'+91 9000000000',projectType:'Individual villa',message:'Local validation test only.',consent:true,website:''};
async function post(data,origin=base){return fetch(base+'/api/enquiry',{method:'POST',headers:{'Content-Type':'application/json',Origin:origin},body:JSON.stringify(data)})}
assert.equal((await post(body,'https://untrusted.example')).status,403);
assert.equal((await post({...body,email:'invalid'})).status,400);
assert.equal((await post({...body,consent:false})).status,400);
assert.equal((await post({...body,website:'spam'})).status,400);
assert.equal((await post({...body,message:'x'.repeat(21000)})).status,413);
// This local environment intentionally has no configured backend.
const unavailable=await post(body);assert.equal(unavailable.status,503);assert.match((await unavailable.json()).error,/not available yet/);
console.log('PASS: 15 routes, direct case-study URLs, referenced local images, 404, origin protection, validation, consent, honeypot, payload limit and honest unconfigured form response.');
