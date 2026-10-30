import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
const cors = { 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type', 'Access-Control-Allow-Methods': 'POST, OPTIONS', 'Cache-Control': 'no-store' };
const json = (data: unknown, status=200) => new Response(JSON.stringify(data),{status,headers:{...cors,'Content-Type':'application/json'}});
const digest = async (s:string) => Array.from(new Uint8Array(await crypto.subtle.digest('SHA-256',new TextEncoder().encode(s)))).map(x=>x.toString(16).padStart(2,'0')).join('');
Deno.serve(async req => {
 if(req.method==='OPTIONS') return new Response(null,{headers:cors});
 if(req.method!=='POST') return json({error:'Method not allowed'},405);
 try {
  const body=await req.json(); const db=createClient(Deno.env.get('SUPABASE_URL')!,Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!);
  if(body.action==='lookup') {
   const lookupToken = typeof body.lookupToken === 'string' ? 'T-' + body.lookupToken.trim().slice(2).toLowerCase() : '';
   if(typeof body.lookupToken!=='string'||!/^t-[0-9a-f]{48}$/i.test(body.lookupToken.trim())) return json({error:'Not found'},404);
   const {data,error}=await db.from('orders').select('order_number,status,created_at').eq('lookup_hash',await digest(lookupToken)).maybeSingle();
   if(error) throw error; return data?json({order:data}):json({error:'Not found'},404);
  }
  const clean=(v:unknown,max:number)=>typeof v==='string'?v.trim().slice(0,max):'';
  const name=clean(body.name,80), contact=clean(body.contact,254), address=clean(body.address,500);
  if(!name||!contact||!address||!Array.isArray(body.items)||body.items.length<1||body.items.length>30||!body.turnstileToken) return json({error:'Invalid request'},400);
  const secret=Deno.env.get('TURNSTILE_SECRET_KEY'); if(!secret) throw Error('Missing verification configuration');
  const verification=new URLSearchParams({secret,response:String(body.turnstileToken)}); const ip=req.headers.get('cf-connecting-ip');if(ip)verification.set('remoteip',ip);
  const verified=await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify',{method:'POST',body:verification}).then(r=>r.json()); if(!verified.success)return json({error:'Verification failed'},400);
  const requestItems=body.items.map((x:any)=>({id:String(x.id),quantity:Number(x.quantity)}));
  if(requestItems.some((x:any)=>!Number.isInteger(x.quantity)||x.quantity<1||x.quantity>50)||new Set(requestItems.map((x:any)=>x.id)).size!==requestItems.length)return json({error:'Invalid items'},400);
  const {data:products,error:productError}=await db.from('souvenirs').select('id,name,price,in_stock').in('id',requestItems.map((x:any)=>x.id));if(productError)throw productError;
  if(!products||products.length!==requestItems.length||products.some((p:any)=>!p.in_stock||!Number.isFinite(Number(p.price))||Number(p.price)<0))return json({error:'Some items are unavailable'},400);
  const items=requestItems.map((x:any)=>{const p=products.find((v:any)=>String(v.id)===x.id)!;return {id:p.id,name:p.name,price:Number(p.price),quantity:x.quantity}});const total=items.reduce((s:number,x:any)=>s+Math.round(x.price*100)*x.quantity,0)/100;
  const bytes=crypto.getRandomValues(new Uint8Array(24)); const lookupToken='T-'+Array.from(bytes).map(x=>x.toString(16).padStart(2,'0')).join('');
  const {data,error}=await db.from('orders').insert({customer_name:name,contact_info:contact,shipping_address:address,items,total_amount:total,status:'pending',lookup_hash:await digest(lookupToken)}).select('order_number,status,created_at').single();if(error)throw error;
  return json({order:{...data,customer_name:name,contact_info:contact,items,total_amount:total},lookupToken});
 } catch(error){console.error('Order request failed',error);return json({error:'Request failed'},500)}
});
