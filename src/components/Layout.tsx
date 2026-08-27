import { useEffect, useState } from 'react';
import { NavLink, Outlet, useLocation } from 'react-router-dom';
import { BookOpen, ChevronDown, Facebook, Home, Menu, Music2, Search, ShieldCheck, Star, X, Mail, ExternalLink } from 'lucide-react';
import { siteConfig } from '../lib/config';
import { useLanguage } from '../context/LanguageContext';

const navClass=({isActive}:{isActive:boolean})=>`nv-navlink ${isActive?'active':''}`;

export default function Layout(){
  const [open,setOpen]=useState(false);
  const loc=useLocation();
  const {language,setLanguage,t}=useLanguage();
  useEffect(()=>setOpen(false),[loc.pathname]);
  useEffect(()=>{
    // Temporarily remove old service-worker/cache state while the GitHub Pages build is stabilised.
    // This prevents stale cached asset paths from hiding newly deployed brand images.
    if('serviceWorker' in navigator){
      navigator.serviceWorker.getRegistrations().then(regs=>regs.forEach(reg=>reg.unregister())).catch(()=>{});
    }
    if('caches' in window){
      caches.keys().then(keys=>Promise.all(keys.filter(k=>k.startsWith('nexvibe-')).map(k=>caches.delete(k)))).catch(()=>{});
    }
  },[]);
  return <>
    <header className="nv-header">
      <div className="nv-container nv-header-inner">
        <NavLink to="/" className="nv-brand" aria-label="NexVibe home">
          <img src={siteConfig.logo} alt="NexVibe official logo" width={46} height={46}/>
          <span><strong>NexVibe</strong><small>Cyber & Digital Hub</small></span>
        </NavLink>
        <nav className="nv-desktop-nav" aria-label="Primary navigation">
          <NavLink to="/" className={navClass}>{t('home')}</NavLink>
          <div className="nv-mega-wrap">
            <button className="nv-navbutton" type="button">{t('explore')} <ChevronDown size={15}/></button>
            <div className="nv-mega">
              <div><span className="nv-mega-label">News & Intelligence</span><NavLink to="/news">Cyber News</NavLink><NavLink to="/cyber-alerts">Cyber Alerts</NavLink><NavLink to="/cve">CVE & CISA KEV</NavLink><NavLink to="/official-sources">Official Sources</NavLink></div>
              <div><span className="nv-mega-label">Directories</span><NavLink to="/tools">Cyber Tools</NavLink><NavLink to="/osint">OSINT Directory</NavLink><NavLink to="/github">GitHub Directory</NavLink><NavLink to="/resources">Free Resources</NavLink></div>
              <div><span className="nv-mega-label">Learning</span><NavLink to="/learn">Learning Centre</NavLink><NavLink to="/roadmaps">Roadmaps</NavLink><NavLink to="/courses">Courses</NavLink><NavLink to="/events">Events</NavLink></div>
            </div>
          </div>
          <NavLink to="/digital-safety" className={navClass}>{t('safety')}</NavLink>
          <NavLink to="/learn" className={navClass}>{t('learn')}</NavLink>
          <NavLink to="/coupons" className={navClass}>{t('deals')}</NavLink>
          <NavLink to="/community" className={navClass}>{t('community')}</NavLink>
          <NavLink to="/search" className={navClass}>{t('search')}</NavLink>
          <NavLink to="/login" className={navClass}>{t('signIn')}</NavLink>
        </nav>
        <div className="nv-header-actions">
          <button className="nv-button" style={{padding:'.55rem .7rem'}} onClick={()=>setLanguage(language==='en'?'si':'en')} title="Switch language"><span>{language==='en'?'සිං':'EN'}</span></button>
          <button className="nv-button nv-menu-button" style={{padding:'.55rem .65rem'}} aria-label="Open menu" aria-expanded={open} onClick={()=>setOpen(v=>!v)}>{open?<X size={20}/>:<Menu size={20}/>}</button>
        </div>
      </div>
      <nav className={`nv-mobile-menu ${open?'open':''}`} aria-label="Mobile menu">
        <NavLink to="/news">Cyber News & Alerts</NavLink>
        <NavLink to="/tools">Tools Directory</NavLink>
        <NavLink to="/osint">OSINT Directory</NavLink>
        <NavLink to="/github">GitHub Directory</NavLink>
        <NavLink to="/learn">Learning Centre</NavLink>
        <NavLink to="/courses">Courses</NavLink>
        <NavLink to="/coupons">Coupons & Deals</NavLink>
        <NavLink to="/events">Events</NavLink>
        <NavLink to="/services">Services</NavLink>
        <NavLink to="/contact">Contact</NavLink>
        <NavLink to="/admin">Admin</NavLink>
      </nav>
    </header>

    <main><Outlet/></main>

    <footer className="nv-footer">
      <div className="nv-container nv-footer-grid">
        <div>
          <img className="nv-footer-logo" src={siteConfig.logo} alt="NexVibe official logo"/>
          <h3 style={{marginBottom:'.25rem'}}>NexVibe</h3>
          <p className="nv-muted" style={{maxWidth:360,marginTop:0}}>{siteConfig.tagline}<br/>{siteConfig.secondaryTagline}</p>
          <div className="nv-social-row">
            <a className="nv-social-link" href={siteConfig.facebook} target="_blank" rel="noreferrer" aria-label="NexVibe Facebook"><Facebook size={19}/></a>
            <a className="nv-social-link" href={siteConfig.tiktok} target="_blank" rel="noreferrer" aria-label="NexVibe TikTok"><Music2 size={19}/></a>
            <a className="nv-social-link" href={`mailto:${siteConfig.email}`} aria-label="Email NexVibe"><Mail size={19}/></a>
          </div>
        </div>
        <div><h4>Explore</h4><NavLink to="/news">News</NavLink><NavLink to="/tools">Tools</NavLink><NavLink to="/learn">Learn</NavLink><NavLink to="/digital-safety">Digital Safety</NavLink><NavLink to="/official-sources">Official Sources</NavLink></div>
        <div><h4>NexVibe</h4><NavLink to="/services">Services</NavLink><NavLink to="/community">Community</NavLink><NavLink to="/about">About</NavLink><NavLink to="/contact">Contact</NavLink><NavLink to="/admin">Admin</NavLink></div>
        <div><h4>Policies</h4><NavLink to="/privacy">Privacy</NavLink><NavLink to="/terms">Terms</NavLink><NavLink to="/responsible-use">Responsible Use</NavLink><NavLink to="/affiliate-disclosure">Affiliate Disclosure</NavLink><a href="https://www.cert.gov.lk/" target="_blank" rel="noreferrer">Sri Lanka CERT <ExternalLink size={13} style={{display:'inline'}}/></a></div>
      </div>
      <div className="nv-container nv-footer-bottom"><span>© 2026 NexVibe. All rights reserved.</span><span>{siteConfig.email}</span></div>
    </footer>

    <nav className="nv-mobile-bottom" aria-label="Bottom navigation">
      <NavLink to="/" className={({isActive})=>isActive?'active':''}><Home/>{t('home')}</NavLink>
      <NavLink to="/search" className={({isActive})=>isActive?'active':''}><Search/>{t('search')}</NavLink>
      <NavLink to="/digital-safety" className={({isActive})=>isActive?'active':''}><ShieldCheck/>{t('safety')}</NavLink>
      <NavLink to="/saved" className={({isActive})=>isActive?'active':''}><Star/>{t('saved')}</NavLink>
      <button onClick={()=>setOpen(v=>!v)} style={{border:0,background:'transparent',color:'#8093ab',fontSize:'.68rem',display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',gap:2}}><Menu size={18}/>{t('menu')}</button>
    </nav>
  </>
}
