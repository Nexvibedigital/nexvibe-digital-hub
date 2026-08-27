import { useEffect, useMemo, useState } from 'react';
import { Download, FilePlus2, Image, LogOut, Newspaper, RefreshCw, Save, Settings, Trash2, Upload, Wrench, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { PageHero } from '../components/Common';
import { manualPosts, toolDirectory } from '../data/manual';
import { useLiveNews } from '../lib/live';
import { featureFlags, siteConfig } from '../lib/config';
import type { AdminPost, NewsItem } from '../types';
import { getLocalAdminPosts, saveLocalAdminPosts } from '../lib/localPosts';
import { deleteSupabasePost, fetchSupabaseAdminPosts, upsertSupabasePost } from '../lib/cms';
import { supabase } from '../lib/supabase';

function categoryFallback(category:string){
  const c=(category||'').toLowerCase();
  if(c.includes('ai')||c.includes('tech')) return siteConfig.heroDesktop;
  if(c.includes('osint')||c.includes('research')) return siteConfig.brandWide;
  if(c.includes('digital safety')||c.includes('security')||c.includes('cyber')) return siteConfig.heroMobile;
  if(c.includes('course')||c.includes('learn')||c.includes('event')) return siteConfig.brandWide;
  return siteConfig.heroDesktop;
}

const blank=():AdminPost=>({id:'',title:'',summary:'',source:'NexVibe',sourceUrl:'',publishedAt:new Date().toISOString().slice(0,10),category:'Cybersecurity News',official:false,image:'',tags:[],content:[''],language:'en',status:'draft',featured:false});
function slugify(s:string){return s.toLowerCase().trim().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'').slice(0,80)||`post-${Date.now()}`}

export default function Admin(){
  const nav=useNavigate();
  const {data:live}=useLiveNews();
  const [tab,setTab]=useState<'overview'|'posts'|'editor'|'imports'|'tools'|'media'|'settings'>('overview');
  const [posts,setPosts]=useState<AdminPost[]>(getLocalAdminPosts);
  const [draft,setDraft]=useState<AdminPost>(blank());
  const [msg,setMsg]=useState('');
  const [uploading,setUploading]=useState(false);

  useEffect(()=>{
    if(!featureFlags.SUPABASE_ENABLED){if(sessionStorage.getItem('nexvibe-admin-demo')!=='1')nav('/login');return;}
    let alive=true;
    (async()=>{
      const {data:{user}}=await supabase!.auth.getUser(); if(!alive)return;
      if(!user){nav('/login');return;}
      const {data:roles}=await supabase!.from('user_roles').select('role').eq('user_id',user.id);
      const allowed=(roles||[]).some((r:any)=>r.role==='editor'||r.role==='administrator');
      if(!allowed){setMsg('This account is signed in but does not have Editor or Administrator permission.');setTab('overview');return;}
      const remote=await fetchSupabaseAdminPosts(); if(alive&&remote.length)setPosts(remote);
    })();
    return()=>{alive=false};
  },[nav]);

  const combined=useMemo(()=>[...posts,...manualPosts.map(p=>({...p,status:'published' as const,featured:false}))],[posts]);
  function persist(next:AdminPost[]){setPosts(next);saveLocalAdminPosts(next)}
  function edit(p:AdminPost){setDraft({...p,content:[...(p.content||[''])]});setTab('editor');setMsg('')}

  async function uploadCover(file?:File){
    if(!file)return;
    if(!featureFlags.SUPABASE_ENABLED||!supabase){setMsg('Supabase Storage is required for direct image uploads.');return;}
    if(!file.type.startsWith('image/')){setMsg('Please choose an image file.');return;}
    if(file.size>8*1024*1024){setMsg('Image is too large. Maximum cover image size is 8 MB.');return;}
    setUploading(true);setMsg('Uploading cover image…');
    try{
      const rawExt=(file.name.split('.').pop()||'jpg').toLowerCase();
      const ext=['jpg','jpeg','png','webp','gif'].includes(rawExt)?rawExt:'jpg';
      const folder=new Date().toISOString().slice(0,10);
      const filename=`${slugify(draft.title||'nexvibe-post')}-${Date.now()}.${ext}`;
      const path=`${folder}/${filename}`;
      const {data,error}=await supabase.storage.from('post-images').upload(path,file,{cacheControl:'31536000',upsert:false,contentType:file.type});
      if(error)throw error;
      const {data:pub}=supabase.storage.from('post-images').getPublicUrl(data.path);
      setDraft(d=>({...d,image:pub.publicUrl}));
      setMsg('Cover image uploaded. It will be used only for this post.');
    }catch(err:any){setMsg(`Image upload failed: ${err?.message||'Unknown error'}`)}
    finally{setUploading(false)}
  }

  async function submit(e:React.FormEvent){
    e.preventDefault();
    const p={...draft,id:draft.id||slugify(draft.title),source:'NexVibe',image:draft.image||categoryFallback(draft.category)};
    const next=posts.some(x=>x.id===p.id)?posts.map(x=>x.id===p.id?p:x):[p,...posts];
    persist(next);setDraft(p);
    if(featureFlags.SUPABASE_ENABLED){const r=await upsertSupabasePost(p);setMsg(r.ok?'Saved to Supabase. Published posts are now shared across devices.':`Supabase save failed: ${r.error}`)}
    else setMsg('Saved locally in this browser. Connect Supabase for shared iPhone/desktop publishing.');
  }

  async function removePost(p:AdminPost){
    if(!confirm('Delete this post?'))return;
    if(featureFlags.SUPABASE_ENABLED){const r=await deleteSupabasePost(p.id);if(!r.ok){setMsg(`Supabase delete failed: ${r.error}`);return;}}
    persist(posts.filter(x=>x.id!==p.id));setMsg('Post deleted.');
  }

  function importLive(item:NewsItem){
    const p:AdminPost={...item,id:`draft-${item.source.toLowerCase().replace(/[^a-z]+/g,'-')}-${item.id}`,status:'draft',featured:false,content:[`Imported official-source item from ${item.source}. Review the source, write a NexVibe summary, add user/admin actions, and only then publish.`]};
    if(!posts.some(x=>x.id===p.id)){persist([p,...posts]);setMsg(`Imported “${p.title}” as DRAFT. It was not auto-published.`)}
  }

  function exportJson(){const blob=new Blob([JSON.stringify(posts,null,2)],{type:'application/json'});const a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download='nexvibe-posts-export.json';a.click();URL.revokeObjectURL(a.href)}
  function importJson(file?:File){if(!file)return;file.text().then(t=>{try{const arr=JSON.parse(t);if(!Array.isArray(arr))throw 0;persist(arr);setMsg(`Imported ${arr.length} posts into this browser.`)}catch{setMsg('Could not import JSON file.')}})}
  const stats={total:combined.length,published:combined.filter(p=>p.status==='published').length,drafts:posts.filter(p=>p.status==='draft').length,live:(live.items||[]).length};
  const coverPreview=draft.image||categoryFallback(draft.category);

  return <><PageHero eyebrow="Admin" title="NexVibe Content Studio" lead="Mobile-first admin with Supabase role-protected publishing and direct post-specific cover image uploads from phone or desktop."/>
    <section className="nv-section-compact"><div className="nv-container nv-admin-layout">
      <aside className="nv-card nv-admin-sidebar">{[
        ['overview','Overview',Newspaper],['posts','Posts',Newspaper],['editor','New / Edit',FilePlus2],['imports','Import Official Feed',RefreshCw],['tools','Tools',Wrench],['media','Media',Image],['settings','Settings',Settings]
      ].map(([id,label,Icon]:any)=><button key={id} className={tab===id?'active':''} onClick={()=>setTab(id)}><Icon size={17}/>{label}</button>)}<button onClick={()=>{sessionStorage.removeItem('nexvibe-admin-demo');supabase?.auth.signOut();nav('/')}}><LogOut size={17}/>Logout</button></aside>
      <div className="nv-admin-main">
        {msg&&<div className="nv-card" style={{padding:14,marginBottom:14}}>{msg}</div>}

        {tab==='overview'&&<><div className="nv-stats"><div className="nv-card nv-stat"><strong>{stats.total}</strong><span>Total editorial items</span></div><div className="nv-card nv-stat"><strong>{stats.published}</strong><span>Published</span></div><div className="nv-card nv-stat"><strong>{stats.drafts}</strong><span>Drafts</span></div><div className="nv-card nv-stat"><strong>{stats.live}</strong><span>Official-feed items</span></div></div><div className="nv-card" style={{padding:20,marginTop:16}}><h3>Publishing architecture</h3><p className="nv-muted">Supabase publishing is connected. Cover images can now be uploaded directly from iPhone, Android or desktop into the public post-images bucket. Each article keeps its own cover URL.</p><div className="nv-meta"><span className="nv-chip">Supabase: {featureFlags.SUPABASE_ENABLED?'Configured':'Not configured'}</span><span className="nv-chip">Post images: Enabled</span><span className="nv-chip">Max image: 8 MB</span></div></div></>}

        {tab==='posts'&&<div className="nv-admin-list">{combined.map(p=><article key={p.id} className="nv-card nv-admin-item"><img src={p.image||categoryFallback(p.category)} alt=""/><div><div className="nv-meta"><span className="nv-chip">{p.category}</span><span>{p.status}</span><span>{p.source}</span></div><h3 style={{margin:'.4rem 0'}}>{p.title}</h3><p className="nv-muted" style={{margin:0}}>{p.summary}</p></div><div className="nv-admin-actions">{p.source==='NexVibe'&&posts.some(x=>x.id===p.id)&&<><button className="nv-button" onClick={()=>edit(p as AdminPost)}>Edit</button><button className="nv-button nv-button-danger" onClick={()=>removePost(p as AdminPost)}><Trash2 size={14}/>Delete</button></>}</div></article>)}</div>}

        {tab==='editor'&&<form className="nv-card nv-form" style={{padding:20}} onSubmit={submit}>
          <div className="nv-form-grid">
            <div className="nv-field nv-span-2"><label>Title</label><input className="nv-input" value={draft.title} onChange={e=>setDraft(d=>({...d,title:e.target.value}))} required/></div>
            <div className="nv-field"><label>Category</label><input className="nv-input" value={draft.category} onChange={e=>setDraft(d=>({...d,category:e.target.value}))}/></div>
            <div className="nv-field"><label>Language</label><select className="nv-input" value={draft.language||'en'} onChange={e=>setDraft(d=>({...d,language:e.target.value as any}))}><option value="en">English</option><option value="si">Sinhala</option></select></div>
            <div className="nv-field"><label>Date</label><input className="nv-input" type="date" value={draft.publishedAt} onChange={e=>setDraft(d=>({...d,publishedAt:e.target.value}))}/></div>
            <div className="nv-field"><label>Status</label><select className="nv-input" value={draft.status} onChange={e=>setDraft(d=>({...d,status:e.target.value as any}))}><option value="draft">Draft</option><option value="published">Published</option></select></div>
            <div className="nv-field nv-span-2"><label>Summary</label><textarea className="nv-input" value={draft.summary} onChange={e=>setDraft(d=>({...d,summary:e.target.value}))}/></div>

            <div className="nv-field nv-span-2">
              <label>Post cover image</label>
              <div style={{display:'grid',gridTemplateColumns:'1fr auto',gap:10}}>
                <input className="nv-input" placeholder="Image URL — or upload from your phone" value={draft.image||''} onChange={e=>setDraft(d=>({...d,image:e.target.value}))}/>
                <label className={`nv-button nv-button-primary ${uploading?'disabled':''}`} style={{cursor:uploading?'wait':'pointer'}}><Upload size={16}/>{uploading?'Uploading…':'Upload image'}<input type="file" accept="image/jpeg,image/png,image/webp,image/gif" hidden disabled={uploading} onChange={e=>{uploadCover(e.target.files?.[0]);e.currentTarget.value=''}}/></label>
              </div>
              <p className="nv-muted" style={{margin:'.45rem 0'}}>Choose a different image for each post. JPG, PNG, WebP or GIF, maximum 8 MB. If you leave this empty, NexVibe uses a category-based fallback.</p>
              <div className="nv-card" style={{marginTop:10,overflow:'hidden',position:'relative'}}>
                <img src={coverPreview} alt="Cover preview" style={{display:'block',width:'100%',aspectRatio:'16/9',objectFit:'cover'}}/>
                {draft.image&&<button type="button" className="nv-button" onClick={()=>{setDraft(d=>({...d,image:''}));setMsg('Custom cover removed. Category fallback will be used when you save.')}} style={{position:'absolute',right:10,top:10}}><X size={15}/>Remove custom image</button>}
              </div>
            </div>

            <div className="nv-field nv-span-2"><label>Article body (paragraphs separated by blank line)</label><textarea className="nv-input" style={{minHeight:320}} value={(draft.content||[]).join('\n\n')} onChange={e=>setDraft(d=>({...d,content:e.target.value.split(/\n\s*\n/)}))}/></div>
            <div className="nv-field nv-span-2"><label>Source URL (for official or referenced source)</label><input className="nv-input" value={draft.sourceUrl||''} onChange={e=>setDraft(d=>({...d,sourceUrl:e.target.value}))}/></div>
          </div>
          <div className="nv-sticky-actions"><button type="button" className="nv-button" onClick={()=>setDraft(blank())}>New</button><button className="nv-button nv-button-primary" type="submit" disabled={uploading}><Save size={16}/>Save / Publish</button></div>
        </form>}

        {tab==='imports'&&<><div className="nv-card" style={{padding:18,marginBottom:14}}><h3>Official-feed workflow</h3><p className="nv-muted">Import → Deduplicate → Save as Draft → Admin Review → add a unique cover image → Publish. Imported content is never auto-published as a NexVibe article.</p></div><div className="nv-admin-list">{(live.items||[]).map(i=><article key={`${i.source}-${i.id}`} className="nv-card nv-list-card"><span className="nv-live-badge">Official external feed</span><h3>{i.title}</h3><p>{i.summary}</p><div className="nv-card-footer"><a className="nv-button" href={i.sourceUrl} target="_blank" rel="noreferrer">Verify source</a><button className="nv-button nv-button-primary" onClick={()=>importLive(i)}>Import as Draft</button></div></article>)}</div></>}

        {tab==='tools'&&<div className="nv-grid-2">{toolDirectory.slice(0,8).map(t=><article key={t.id} className="nv-card nv-list-card"><span className="nv-chip">{t.category}</span><h3>{t.name}</h3><p>{t.description}</p><div className="nv-meta"><span>{t.classification}</span><span>Verified {t.lastVerified}</span></div></article>)}</div>}

        {tab==='media'&&<><div className="nv-card" style={{padding:18,marginBottom:14}}><h3>Post image storage</h3><p className="nv-muted">Direct post-cover uploads now go to Supabase Storage bucket <strong>post-images</strong>. Public reading is enabled, while uploads/changes are restricted to Editor or Administrator accounts.</p></div><div className="nv-grid-3">{[{src:siteConfig.logo,n:'Official logo'},{src:siteConfig.heroDesktop,n:'Desktop hero fallback'},{src:siteConfig.heroMobile,n:'Cyber / safety fallback'},{src:siteConfig.brandWide,n:'OSINT / learning fallback'}].map(x=><div className="nv-card" key={x.n} style={{overflow:'hidden'}}><img src={x.src} alt={x.n} style={{display:'block',width:'100%',aspectRatio:'16/10',objectFit:'cover'}}/><div style={{padding:14}}><strong>{x.n}</strong></div></div>)}</div></>}

        {tab==='settings'&&<div className="nv-card" style={{padding:20}}><h3>Contact & feature settings</h3><p><strong>Email:</strong> {siteConfig.email}</p><p><strong>Facebook:</strong> configured</p><p><strong>TikTok:</strong> @nexvibeofficial</p><div className="nv-meta"><span className="nv-chip">Post image uploads: enabled</span><span className="nv-chip">HIBP email API: disabled</span><span className="nv-chip">VirusTotal API: disabled</span><span className="nv-chip">Google Web Risk: disabled</span><span className="nv-chip">Payments: disabled</span></div><div className="nv-report-actions"><button className="nv-button" onClick={exportJson}><Download size={15}/>Export posts JSON</button><label className="nv-button"><Upload size={15}/>Import posts JSON<input type="file" accept="application/json" hidden onChange={e=>importJson(e.target.files?.[0])}/></label></div></div>}
      </div>
    </div></section>
  </>
}
