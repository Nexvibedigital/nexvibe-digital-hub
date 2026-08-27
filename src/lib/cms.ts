import type { AdminPost, NewsItem } from '../types';
import { supabase } from './supabase';
import { getLocalPublishedPosts } from './localPosts';

function stripHtml(input=''){
  const d=document.createElement('div'); d.innerHTML=input; return d.textContent||'';
}
function rowToPost(row:any):AdminPost{
  const plain=stripHtml(row.body_html||'');
  return {
    id: row.slug,
    title: row.title,
    summary: row.summary||'',
    source: row.source_name||'NexVibe',
    sourceUrl: row.source_url||'',
    publishedAt: (row.published_at||row.scheduled_at||row.created_at||'').slice(0,10),
    category: row.category_label||'NexVibe',
    official: !!row.is_official_source,
    image: row.cover_image_url||`${import.meta.env.BASE_URL}assets/hero-desktop.webp`,
    tags: row.tags||[],
    content: plain ? plain.split(/\n\s*\n/).filter(Boolean) : [],
    language: row.language||'en',
    country: row.country||'',
    verificationStatus: row.source_verification_status||'unverified',
    sourceVerifiedAt: row.source_verified_at||undefined,
    scheduledAt: row.scheduled_at||undefined,
    status: row.status||'draft',
    featured: !!row.featured,
  };
}
export async function fetchSupabasePublishedPosts():Promise<NewsItem[]>{
  if(!supabase)return [];
  const now=new Date().toISOString();
  const {data,error}=await supabase.from('posts').select('*')
    .or(`status.eq.published,and(status.eq.scheduled,scheduled_at.lte.${now})`)
    .order('published_at',{ascending:false,nullsFirst:false}).limit(120);
  if(error){console.warn('NexVibe Supabase public posts:',error.message);return []}
  return (data||[]).map(rowToPost);
}
export async function fetchSupabaseAdminPosts():Promise<AdminPost[]>{
  if(!supabase)return [];
  const {data,error}=await supabase.from('posts').select('*').order('updated_at',{ascending:false}).limit(250);
  if(error){console.warn('NexVibe Supabase admin posts:',error.message);return []}
  return (data||[]).map(rowToPost);
}
function postToRow(p:AdminPost){
  const scheduled=p.status==='scheduled' ? (p.scheduledAt||null) : null;
  return {
    slug:p.id,
    title:p.title,
    summary:p.summary||'',
    body_html:(p.content||[]).join('\n\n'),
    language:p.language||'en',
    status:p.status,
    category_label:p.category||'NexVibe',
    tags:p.tags||[],
    cover_image_url:p.image||null,
    source_name:p.source||'NexVibe',
    source_url:p.sourceUrl||null,
    is_official_source:!!p.official,
    featured:!!p.featured,
    country:p.country||null,
    source_verification_status:p.verificationStatus||'unverified',
    source_verified_at:p.verificationStatus==='verified'?(p.sourceVerifiedAt||new Date().toISOString()):null,
    scheduled_at:scheduled,
    published_at:p.status==='published'?(p.publishedAt?`${p.publishedAt}T00:00:00Z`:new Date().toISOString()):null,
    updated_at:new Date().toISOString(),
  };
}
export async function upsertSupabasePost(p:AdminPost){
  if(!supabase)return {ok:false,error:'Supabase not configured'};
  const {error}=await supabase.from('posts').upsert(postToRow(p),{onConflict:'slug'});
  return error?{ok:false,error:error.message}:{ok:true,error:''};
}
export async function deleteSupabasePost(slug:string){
  if(!supabase)return {ok:false,error:'Supabase not configured'};
  const {error}=await supabase.from('posts').delete().eq('slug',slug);
  return error?{ok:false,error:error.message}:{ok:true,error:''};
}
export function getBrowserPublishedPosts(){return getLocalPublishedPosts() as NewsItem[]}
