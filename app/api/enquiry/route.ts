import {NextRequest,NextResponse} from 'next/server';
import {createHmac,randomUUID} from 'node:crypto';
import {deliverEnquiry,deliveryConfigured} from '@/lib/enquiry-delivery';
import {enquirySchema} from '@/lib/enquiry';
export const runtime='nodejs';
export async function POST(request:NextRequest){
 const origin=request.headers.get('origin');
 let sameOrigin=false;
 try{const parsedOrigin=new URL(origin||'');sameOrigin=['http:','https:'].includes(parsedOrigin.protocol)&&parsedOrigin.host===request.headers.get('host')}catch{/* Reject absent or malformed origins. */}
 if(!sameOrigin)return NextResponse.json({error:'Invalid request origin.'},{status:403});
 if(!request.headers.get('content-type')?.includes('application/json'))return NextResponse.json({error:'Expected JSON.'},{status:415});
 if(Number(request.headers.get('content-length')||0)>20000)return NextResponse.json({error:'Enquiry is too large.'},{status:413});
 let input:unknown;try{const raw=await request.text();if(raw.length>20000)return NextResponse.json({error:'Enquiry is too large.'},{status:413});input=JSON.parse(raw)}catch{return NextResponse.json({error:'Invalid enquiry.'},{status:400})}
 const parsed=enquirySchema.safeParse(input);if(!parsed.success)return NextResponse.json({error:'Please check your name, email, phone, message and consent.'},{status:400});
 const url=process.env.SUPABASE_URL,key=process.env.SUPABASE_SERVICE_ROLE_KEY,secret=process.env.CONTACT_RATE_LIMIT_SECRET;
 if(!url||!key||!secret||secret.length<32||!deliveryConfigured())return NextResponse.json({error:'Online enquiries are not available yet. Please call +91 98411 45873 or email spbuilders2003@gmail.com.'},{status:503});
 const ip=request.headers.get('x-vercel-forwarded-for')?.split(',')[0]?.trim()||'local';
 const rateKey=createHmac('sha256',secret).update(ip).digest('hex');
 try{const headers={'apikey':key,'Authorization':`Bearer ${key}`,'Content-Type':'application/json'};
 const limit=await fetch(`${url}/rest/v1/rpc/allow_enquiry`,{method:'POST',headers,body:JSON.stringify({client_key:rateKey}),signal:AbortSignal.timeout(8000)});
 if(!limit.ok)throw new Error('Rate limit unavailable');if(await limit.json()!==true)return NextResponse.json({error:'Too many enquiries. Please try again in an hour, or call us.'},{status:429});
 const {name,email,phone,projectType,message}=parsed.data; const id=randomUUID();
 const saved=await fetch(`${url}/rest/v1/enquiries`,{method:'POST',headers,body:JSON.stringify({id,name,email,phone,project_type:projectType,message,consent:true}),signal:AbortSignal.timeout(8000)});
  if(!saved.ok)throw new Error('Storage unavailable');
 const delivery=await deliverEnquiry(id,parsed.data);
 try{const audit=await fetch(`${url}/rest/v1/enquiries?id=eq.${id}`,{method:'PATCH',headers,body:JSON.stringify({email_status:delivery.email.status,whatsapp_status:delivery.whatsapp.status,email_provider_id:delivery.email.id||null,whatsapp_provider_id:delivery.whatsapp.id||null}),signal:AbortSignal.timeout(8000)});if(!audit.ok)console.error('Enquiry delivery audit failed',id);}catch{console.error('Enquiry delivery audit unavailable',id);}
 const accepted=delivery.email.status==='accepted'&&delivery.whatsapp.status==='accepted';
 return NextResponse.json({ok:true,reference:id,message:accepted?'Thank you. Your enquiry has been saved and submitted for email and WhatsApp delivery.':'Your enquiry has been saved, but we could not confirm both notifications. Please call +91 98411 45873 if urgent. Do not resubmit.'},{status:accepted?201:202});
 }catch{return NextResponse.json({error:'We could not save your enquiry. Please call +91 98411 45873 or email spbuilders2003@gmail.com.'},{status:503})}
}


