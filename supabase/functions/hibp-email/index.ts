// Future paid adapter only. Keep disabled until the owner has a paid HIBP API subscription,
// secure ownership verification, server-side secret, rate limiting and privacy review.
import { serve } from 'https://deno.land/std@0.224.0/http/server.ts';
serve(()=>Response.json({enabled:false,message:'Paid HIBP email API adapter is disabled. Use the free user-confirmed external check flow.'},{status:501}));
