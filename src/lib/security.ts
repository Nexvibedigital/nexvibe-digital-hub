export type UrlAnalysis = { score:number; label:string; tone:'low'|'warn'|'high'; findings:string[] };

export function analyseUrlLocal(raw:string):UrlAnalysis {
  const findings:string[]=[];
  let score=0;
  let u:URL;
  try { u = new URL(raw.includes('://') ? raw : `https://${raw}`); }
  catch { return {score:99,label:'Unable to verify',tone:'warn',findings:['The value is not a valid URL.']}; }
  if (u.protocol !== 'https:') { score+=2; findings.push('Uses HTTP instead of HTTPS.'); }
  if (/^\d{1,3}(\.\d{1,3}){3}$/.test(u.hostname)) { score+=2; findings.push('Uses a raw IP address instead of a normal domain.'); }
  if (u.hostname.includes('xn--')) { score+=2; findings.push('Punycode is present; visually similar domain names can be abused.'); }
  if (u.hostname.length > 45) { score+=1; findings.push('Hostname is unusually long.'); }
  if (u.hostname.split('.').length > 5) { score+=1; findings.push('Large number of subdomains.'); }
  if (/%[0-9a-f]{2}/i.test(raw)) { score+=1; findings.push('Encoded URL characters are present.'); }
  if (raw.includes('@')) { score+=2; findings.push('Contains @ syntax that can obscure the destination.'); }
  if (u.port && !['80','443'].includes(u.port)) { score+=1; findings.push(`Uses unusual port ${u.port}.`); }
  const shorteners=['bit.ly','tinyurl.com','t.co','cutt.ly','is.gd','rb.gy'];
  if (shorteners.includes(u.hostname.toLowerCase())) { score+=1; findings.push('URL shortener detected; expand it before trusting the destination.'); }
  if (/(login|verify|wallet|payment|invoice|bonus|gift|urgent|secure-account|reset-password)/i.test(u.pathname+u.search)) { score+=1; findings.push('Contains common social-engineering or account-action keywords.'); }
  const host=u.hostname.toLowerCase();
  const brands=['paypal','microsoft','apple','google','facebook','instagram','whatsapp','binance','bybit'];
  const brand=brands.find(b=>host.includes(b));
  if (brand && !host.endsWith(`${brand}.com`) && host !== brand) { score+=1; findings.push(`Hostname contains the brand-like term “${brand}”; verify the real official domain.`); }
  let label='Low number of visible warning signs'; let tone:'low'|'warn'|'high'='low';
  if(score>=5){label='Multiple suspicious indicators';tone='high'} else if(score>=2){label='Review carefully';tone='warn'}
  if(!findings.length) findings.push('No obvious warning signs were found by this local check. Reputation was not verified.');
  return {score,label,tone,findings};
}

export function passwordStrength(value:string){
  let score=0; const notes:string[]=[];
  if(value.length>=12) score++; else notes.push('Use at least 12 characters.');
  if(value.length>=16) score++;
  if(/[a-z]/.test(value)&&/[A-Z]/.test(value)) score++;
  if(/\d/.test(value)) score++;
  if(/[^A-Za-z0-9]/.test(value)) score++;
  if(/(password|qwerty|123456|letmein|admin|welcome)/i.test(value)){score=Math.max(0,score-2);notes.push('Avoid common password patterns or words.');}
  if(/(.)\1{2,}/.test(value)){score=Math.max(0,score-1);notes.push('Avoid repeated characters.');}
  const pct=Math.min(100,score*20); const label=pct>=80?'Strong':pct>=60?'Good':pct>=40?'Fair':'Weak';
  return {pct,label,notes};
}

export async function shaHex(algorithm:'SHA-256'|'SHA-1', input:ArrayBuffer|string){
  const data = typeof input === 'string' ? new TextEncoder().encode(input) : input;
  const digest = await crypto.subtle.digest(algorithm,data);
  return Array.from(new Uint8Array(digest)).map(b=>b.toString(16).padStart(2,'0')).join('').toUpperCase();
}

export function maskEmail(email:string){
  const [u,d]=email.split('@'); if(!u||!d) return '';
  const masked=u.length<=2?`${u[0]||'*'}*`:`${u.slice(0,2)}${'*'.repeat(Math.min(5,u.length-2))}`;
  return `${masked}@${d}`;
}
