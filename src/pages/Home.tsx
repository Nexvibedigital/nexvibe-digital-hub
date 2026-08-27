import { useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AlertTriangle, BookOpen, ExternalLink, FileKey2, Globe2, GraduationCap, KeyRound, Link2, Newspaper, QrCode, Search, ShieldCheck, Sparkles, Wrench } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { siteConfig, officialSources } from '../lib/config';
import { useLiveNews, useCmsPosts } from '../lib/live';
import { courses, manualPosts, roadmaps, toolDirectory } from '../data/manual';
import { SectionHead } from '../components/Common';

function NewsCard({item}:{item:any}){
  const internal=item.source==='NexVibe';
  return <article className="nv-card nv-card-hover nv-news-card">
    <div className="nv-news-image"><img src={item.image||siteConfig.heroDesktop} alt="" loading="lazy"/></div>
    <div className="nv-news-body">
      <div className="nv-meta"><span className="nv-chip">{item.category}</span><span>{item.source}</span><span>{String(item.publishedAt||'').slice(0,10)}</span></div>
      <h3>{item.title}</h3><p className="nv-muted" style={{margin:0}}>{item.summary}</p>
      <div className="nv-card-footer"><span className={item.official?'nv-live-badge':'nv-muted'}>{item.official?'Official source':'NexVibe editorial'}</span>{internal?<Link to={`/news/${item.id}`} className="nv-button">Read</Link>:<a className="nv-button" href={item.sourceUrl} target="_blank" rel="noreferrer">Open <ExternalLink size={14}/></a>}</div>
    </div>
  </article>
}

export default function Home(){
  const {t}=useLanguage(); const navigate=useNavigate(); const [q,setQ]=useState(''); const {data,loading,error}=useLiveNews(); const {items:cmsPosts}=useCmsPosts();
  const latest=useMemo(()=>[...(data.items||[]),...cmsPosts,...manualPosts.filter(p=>p.source==='NexVibe')].filter((x,i,a)=>a.findIndex(y=>y.id===x.id&&y.source===x.source)===i).slice(0,6),[data.items,cmsPosts]);
  return <>
    <section className="nv-hero"><div className="nv-container nv-hero-grid">
      <div>
        <span className="nv-eyebrow"><Sparkles size={15}/>{t('heroEyebrow')}</span>
        <h1 className="nv-title">{t('heroTitleA')}<br/><span className="nv-gradient-text">{t('heroTitleB')}</span></h1>
        <p>{t('heroBody')}</p>
        <form className="nv-searchbar" onSubmit={e=>{e.preventDefault();navigate(`/search?q=${encodeURIComponent(q)}`)}}>
          <input value={q} onChange={e=>setQ(e.target.value)} placeholder={t('searchPlaceholder')} aria-label="Global search"/>
          <button className="nv-button nv-button-primary" type="submit"><Search size={18}/>Search</button>
        </form>
        <div className="nv-hero-actions"><Link className="nv-button nv-button-primary" to="/digital-safety"><ShieldCheck size={18}/>{t('openSafety')}</Link><Link className="nv-button" to="/news"><Newspaper size={18}/>{t('browseNews')}</Link></div>
        <div className="nv-hero-mini">
          <div className="nv-mini-stat"><strong>Official-source feeds</strong><span>CISA • CERT.LK • NVD • KEV</span></div>
          <div className="nv-mini-stat"><strong>Free-first safety</strong><span>No paid API required for core tools</span></div>
          <div className="nv-mini-stat"><strong>Mobile admin ready</strong><span>iPhone • Android • desktop</span></div>
          <div className="nv-mini-stat"><strong>EN + සිං</strong><span>Tamil-ready structure</span></div>
        </div>
      </div>
      <div className="nv-hero-visual">
        <picture><source media="(max-width: 720px)" srcSet={siteConfig.heroMobile}/><img src={siteConfig.heroDesktop} alt="NexVibe futuristic AI, technology and digital growth hero" width="1402" height="1122" fetchPriority="high"/></picture>
        <div className="nv-hero-strip"><strong>AI • Tech • Cybersecurity • OSINT • Digital Growth</strong><br/><span className="nv-muted">Responsive desktop/mobile artwork using your NexVibe brand assets.</span></div>
      </div>
    </div></section>

    <section className="nv-section-compact"><div className="nv-container"><SectionHead eyebrow="Quick actions" title="Useful tools, not an empty homepage" lead="Fast access to the checks and directories people are likely to need first."/>
      <div className="nv-quick-grid">
        <Link to="/digital-safety/password-check" className="nv-card nv-card-hover nv-quick-card"><KeyRound/><h3>Password Exposure</h3><p>k-anonymity lookup; full password stays out of NexVibe.</p></Link>
        <Link to="/digital-safety/url-check" className="nv-card nv-card-hover nv-quick-card"><Link2/><h3>Suspicious URL</h3><p>Local red-flag analysis without opening the destination.</p></Link>
        <Link to="/digital-safety/qr-check" className="nv-card nv-card-hover nv-quick-card"><QrCode/><h3>QR Safety Scan</h3><p>Camera/photo upload, local decode, confirmation before opening.</p></Link>
        <Link to="/digital-safety/email-safety" className="nv-card nv-card-hover nv-quick-card"><ShieldCheck/><h3>Email Safety</h3><p>Free assessment plus official HIBP manual-check flow.</p></Link>
        <Link to="/osint" className="nv-card nv-card-hover nv-quick-card"><Globe2/><h3>OSINT Directory</h3><p>Curated public research tools with legal-use guidance.</p></Link>
        <Link to="/cyber-alerts" className="nv-card nv-card-hover nv-quick-card"><AlertTriangle/><h3>Cyber Alerts</h3><p>Official-source updates and NexVibe-reviewed awareness posts.</p></Link>
      </div>
    </div></section>

    <section className="nv-section"><div className="nv-container"><SectionHead eyebrow="Official live feed" title="Latest cyber alerts" lead={data.syncedAt?`Feed synced ${new Date(data.syncedAt).toLocaleString()}. Official feed items open the original source.`:'Official-source sync initializes after deployment.'} action={<Link to="/news" className="nv-button">View all</Link>}/>
      {loading?<div className="nv-card" style={{padding:24}}>Loading official feed…</div>:error?<div className="nv-card" style={{padding:24}}>Live feed unavailable right now. Manual NexVibe content remains available.</div>:<div className="nv-grid-3">{latest.slice(0,3).map((item:any)=><NewsCard key={item.id} item={item}/>)}</div>}
    </div></section>

    <section className="nv-section"><div className="nv-container"><SectionHead eyebrow="Trending directories" title="Tools for learners, defenders and researchers" lead="Only official project/vendor links are used. Dual-use tools are clearly labelled and NexVibe does not execute attacks for users." action={<Link className="nv-button" to="/tools">All tools</Link>}/>
      <div className="nv-grid-4">{toolDirectory.slice(0,4).map(x=><article key={x.id} className="nv-card nv-card-hover nv-directory-card"><span className="nv-chip">{x.category}</span><h3>{x.name}</h3><p>{x.description}</p><div className="nv-card-footer"><span className="nv-chip">{x.classification}</span><a className="nv-button" href={x.officialUrl} target="_blank" rel="noreferrer">Official <ExternalLink size={14}/></a></div></article>)}</div>
    </div></section>

    <section className="nv-section"><div className="nv-container nv-grid-2">
      <div className="nv-card" style={{overflow:'hidden'}}><img src={siteConfig.brandWide} alt="NexVibe ideas, tips, trends and everything next" loading="lazy" style={{display:'block',width:'100%',aspectRatio:'1942/809',objectFit:'cover'}}/><div style={{padding:20}}><span className="nv-eyebrow">NexVibe identity</span><h2 className="nv-title" style={{fontSize:'2rem',margin:'.5rem 0'}}>Ideas. Tips. Trends. Everything Next.</h2><p className="nv-muted">Your official brand art stays intact and is used as a premium visual section instead of being redrawn.</p></div></div>
      <div><SectionHead eyebrow="Learning roadmap" title="From beginner to practical skill" lead="Structured paths for cybersecurity, OSINT, web security, SOC, cloud and AI security."/><div className="nv-grid-2">{roadmaps.slice(0,4).map(r=><Link key={r.id} to={`/roadmaps#${r.id}`} className="nv-card nv-card-hover" style={{padding:18}}><BookOpen size={23} color="var(--cyan)"/><h3>{r.title}</h3><p className="nv-muted">{r.steps.slice(0,3).join(' → ')}…</p></Link>)}</div></div>
    </div></section>

    <section className="nv-section"><div className="nv-container"><SectionHead eyebrow="Courses & free resources" title="Learn from verified providers" lead="No scraping, no invented discounts. Course pricing and coupons are shown only when manually verified." action={<Link className="nv-button" to="/courses"><GraduationCap size={16}/>Courses</Link>}/><div className="nv-grid-3">{courses.slice(0,3).map(c=><article key={c.id} className="nv-card nv-list-card"><span className="nv-chip">{c.pricing}</span><h3>{c.title}</h3><p>{c.provider} • {c.level}</p><div className="nv-card-footer"><span className="nv-muted">Verified {c.lastVerified}</span><a className="nv-button" href={c.officialUrl} target="_blank" rel="noreferrer">Official <ExternalLink size={14}/></a></div></article>)}</div></div></section>

    <section className="nv-section"><div className="nv-container"><SectionHead eyebrow="Bound to official websites" title="Trust the primary source" lead="NexVibe summaries should always lead back to authoritative advisories, vendor security pages or official learning providers."/><div className="nv-grid-4">{officialSources.slice(0,8).map(s=><a key={s.name} href={s.url} target="_blank" rel="noreferrer" className="nv-card nv-card-hover nv-official-source"><Wrench size={21}/><span><strong>{s.name}</strong><span>{s.description}</span></span></a>)}</div></div></section>

    <section className="nv-section"><div className="nv-container nv-grid-2"><div className="nv-card" style={{padding:24}}><span className="nv-eyebrow">Community</span><h2 className="nv-title" style={{fontSize:'2.3rem',margin:'.5rem 0'}}>Follow NexVibe and stay inspired</h2><p className="nv-muted">Daily ideas, cyber awareness, AI tools, tech tips and digital growth content.</p><div className="nv-hero-actions"><a className="nv-button nv-button-primary" href={siteConfig.facebook} target="_blank" rel="noreferrer">Facebook <ExternalLink size={15}/></a><a className="nv-button" href={siteConfig.tiktok} target="_blank" rel="noreferrer">TikTok <ExternalLink size={15}/></a></div></div><div className="nv-card" style={{padding:24}}><span className="nv-eyebrow">Responsible use</span><h3>Defensive, lawful and transparent</h3><p className="nv-muted">NexVibe never labels a person, password, file or URL completely safe. Security tools are informational checks and should be combined with official guidance and manual verification.</p><Link className="nv-button" to="/responsible-use">Read responsible-use policy</Link></div></div></section>
  </>
}
