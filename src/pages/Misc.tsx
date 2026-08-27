import { useState } from 'react';
import { ExternalLink, Send } from 'lucide-react';
import { PageHero } from '../components/Common';
import { siteConfig } from '../lib/config';

export function Resources(){const resources=[
  ['OWASP Web Security Testing Guide','https://owasp.org/www-project-web-security-testing-guide/','Web security testing methodology and defensive learning material.'],
  ['CISA Cybersecurity Resources','https://www.cisa.gov/resources-tools','Official U.S. cybersecurity resources, guides and tools.'],
  ['NIST Cybersecurity Framework','https://www.nist.gov/cyberframework','Risk-management framework and related guidance.'],
  ['Microsoft Learn Security','https://learn.microsoft.com/training/browse/?products=security','Free security learning modules and paths.'],
  ['Cisco Networking Academy','https://www.netacad.com/','Networking and cybersecurity learning programmes.'],
  ['Google Safety Center','https://safety.google/','Consumer safety, privacy and account-security guidance.']
];return <><PageHero eyebrow="Free Resources" title="Official guides and learning resources" lead="NexVibe links to original organisations and providers instead of mirroring protected material."/><section className="nv-section-compact"><div className="nv-container nv-grid-3">{resources.map(([n,u,d])=><article className="nv-card nv-directory-card" key={n}><span className="nv-chip">Official resource</span><h3>{n}</h3><p>{d}</p><div className="nv-card-footer"><a className="nv-button" href={u} target="_blank" rel="noreferrer">Open <ExternalLink size={14}/></a></div></article>)}</div></section></>}

export function Events(){
  const calendars=[
    ['OWASP Events','https://owasp.org/events/','Official OWASP conferences, chapters and application-security events.'],
    ['SANS Webcasts','https://www.sans.org/webcasts/','Official SANS security webcasts and training events.'],
    ['BSides Community','https://bsides.org/','Community security conferences; verify each local event on its official page.'],
    ['Hack The Box Events','https://www.hackthebox.com/events','Official Hack The Box event listings and competitions.']
  ];
  return <><PageHero eyebrow="Events" title="Webinars, CTFs & cyber learning events" lead="Only verified event links should be published. NexVibe points to official calendars and keeps dated event cards admin-reviewed."/><section className="nv-section-compact"><div className="nv-container"><div className="nv-grid-2">{calendars.map(([n,u,d])=><article className="nv-card nv-directory-card" key={n}><span className="nv-chip">Official calendar</span><h3>{n}</h3><p>{d}</p><div className="nv-card-footer"><a className="nv-button" href={u} target="_blank" rel="noreferrer">Browse official events <ExternalLink size={14}/></a></div></article>)}</div><div className="nv-card" style={{padding:20,marginTop:18}}><strong>NexVibe event publishing rule</strong><p className="nv-muted">Dates, times and registration links are not invented. Add individual events only after checking the official organiser page.</p></div></div></section></>;
}

export function Submit(){const [type,setType]=useState('Tool');const [url,setUrl]=useState('');const [desc,setDesc]=useState('');return <><PageHero eyebrow="Community Submission" title="Suggest a verified resource" lead="Submissions should remain pending until admin approval and must include a source URL and responsible-use confirmation."/><section className="nv-section-compact"><form className="nv-container nv-card nv-form" style={{padding:22,maxWidth:760}} onSubmit={e=>{e.preventDefault();location.href=`mailto:${siteConfig.email}?subject=${encodeURIComponent(`NexVibe submission: ${type}`)}&body=${encodeURIComponent(`Source URL: ${url}\n\nDescription: ${desc}\n\nI confirm this submission is intended for lawful/responsible use and I have permission to share the linked material.`)}`}}><div className="nv-field"><label>Type</label><select className="nv-input" value={type} onChange={e=>setType(e.target.value)}><option>Tool</option><option>GitHub repository</option><option>Course</option><option>Coupon</option><option>Resource</option><option>Event</option></select></div><div className="nv-field"><label>Official source URL</label><input className="nv-input" type="url" value={url} onChange={e=>setUrl(e.target.value)} required/></div><div className="nv-field"><label>Description</label><textarea className="nv-input" value={desc} onChange={e=>setDesc(e.target.value)} required/></div><label className="nv-checkitem"><input type="checkbox" required/><span>I agree to responsible use and confirm I have permission to share this source link.</span></label><button className="nv-button nv-button-primary" type="submit"><Send size={16}/>Submit for review by email</button></form></section></>}

export function Placeholder({title,lead}:{title:string;lead:string}){return <><PageHero eyebrow="NexVibe" title={title} lead={lead}/><section className="nv-section-compact"><div className="nv-container nv-card" style={{padding:24}}><p className="nv-muted">The route is included and ready for Supabase-backed data when the free backend is connected. The current static deployment does not fabricate content or results.</p></div></section></>}
