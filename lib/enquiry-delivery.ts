import {enquirySchema} from './enquiry';
import type {z} from 'zod';

export function deliveryConfigured(){
 return ['RESEND_API_KEY','ENQUIRY_FROM_EMAIL','TWILIO_ACCOUNT_SID','TWILIO_AUTH_TOKEN','TWILIO_WHATSAPP_FROM','TWILIO_CONTENT_SID'].every(key=>Boolean(process.env[key])) && process.env.TWILIO_WHATSAPP_FROM!=='whatsapp:+919841145873';
}
type Result={status:'accepted'|'failed'|'unknown';id?:string};
export async function deliverEnquiry(id:string,data:z.infer<typeof enquirySchema>){
 const text=`New SP Builders website enquiry\n\nName: ${data.name}\nEmail: ${data.email}\nPhone: ${data.phone}\nProject: ${data.projectType}\n\n${data.message}\n\nReference: ${id}`;
 async function send(url:string,init:RequestInit,idField:string):Promise<Result>{
  try {const response=await fetch(url,{...init,signal:AbortSignal.timeout(12000)});if(!response.ok)return {status:'failed'};const body=await response.json();return typeof body[idField]==='string'?{status:'accepted',id:body[idField]}:{status:'unknown'};}catch{return {status:'unknown'};}
 }
 const email=send('https://api.resend.com/emails',{method:'POST',headers:{Authorization:`Bearer ${process.env.RESEND_API_KEY}`,'Content-Type':'application/json','Idempotency-Key':`enquiry-${id}`},body:JSON.stringify({from:process.env.ENQUIRY_FROM_EMAIL,to:['spbuilders2003@gmail.com'],reply_to:data.email,subject:`Website enquiry: ${data.projectType}`,text})},'id');
 const variables=Object.fromEntries([data.name,data.email,data.phone,data.projectType,data.message].map((value,index)=>[String(index+1),value.replace(/\s+/g,' ').trim()]));
 const whatsapp=send(`https://api.twilio.com/2010-04-01/Accounts/${process.env.TWILIO_ACCOUNT_SID}/Messages.json`,{method:'POST',headers:{Authorization:`Basic ${Buffer.from(`${process.env.TWILIO_ACCOUNT_SID}:${process.env.TWILIO_AUTH_TOKEN}`).toString('base64')}`,'Content-Type':'application/x-www-form-urlencoded'},body:new URLSearchParams({From:process.env.TWILIO_WHATSAPP_FROM!,To:'whatsapp:+919841145873',ContentSid:process.env.TWILIO_CONTENT_SID!,ContentVariables:JSON.stringify(variables)})},'sid');
 const results=await Promise.all([email,whatsapp]);return {email:results[0],whatsapp:results[1]};
}
