// Retire the legacy password endpoint after the new Auth/RLS admin is configured.
Deno.serve(req => new Response(JSON.stringify({error:'This endpoint has been retired.'}), {status:410,headers:{'Content-Type':'application/json','Access-Control-Allow-Origin':'*','Access-Control-Allow-Headers':'authorization, x-client-info, apikey, content-type'}}));
