import { supabase } from './supabase';

const BOOKMARK_KEY='nexvibe-bookmarks-v1';
const PROGRESS_KEY='nexvibe-learning-progress-v1';

type Bookmark={item_type:string;item_id:string;created_at?:string};
type ProgressRow={roadmap_id:string;step_id:string;completed:boolean;updated_at?:string};

function readLocal<T>(key:string,fallback:T):T{
  try{return JSON.parse(localStorage.getItem(key)||'') as T}catch{return fallback}
}
function writeLocal<T>(key:string,value:T){localStorage.setItem(key,JSON.stringify(value))}

export async function currentUser(){
  if(!supabase)return null;
  const {data}=await supabase.auth.getUser();
  return data.user||null;
}

export async function listBookmarks():Promise<Bookmark[]>{
  const user=await currentUser();
  if(user&&supabase){
    const {data,error}=await supabase.from('bookmarks').select('item_type,item_id,created_at').eq('user_id',user.id).order('created_at',{ascending:false});
    if(!error)return data||[];
  }
  return readLocal<Bookmark[]>(BOOKMARK_KEY,[]);
}

export async function isBookmarked(itemType:string,itemId:string){
  const rows=await listBookmarks();
  return rows.some(x=>x.item_type===itemType&&x.item_id===itemId);
}

export async function toggleBookmark(itemType:string,itemId:string){
  const user=await currentUser();
  if(user&&supabase){
    const {data}=await supabase.from('bookmarks').select('item_id').eq('user_id',user.id).eq('item_type',itemType).eq('item_id',itemId).maybeSingle();
    if(data){
      const {error}=await supabase.from('bookmarks').delete().eq('user_id',user.id).eq('item_type',itemType).eq('item_id',itemId);
      return {saved:false,error:error?.message||''};
    }
    const {error}=await supabase.from('bookmarks').insert({user_id:user.id,item_type:itemType,item_id:itemId});
    return {saved:!error,error:error?.message||''};
  }
  const rows=readLocal<Bookmark[]>(BOOKMARK_KEY,[]);
  const exists=rows.some(x=>x.item_type===itemType&&x.item_id===itemId);
  const next=exists?rows.filter(x=>!(x.item_type===itemType&&x.item_id===itemId)):[{item_type:itemType,item_id:itemId,created_at:new Date().toISOString()},...rows];
  writeLocal(BOOKMARK_KEY,next);
  return {saved:!exists,error:''};
}

export async function listProgress(roadmapId?:string):Promise<ProgressRow[]>{
  const user=await currentUser();
  if(user&&supabase){
    let q=supabase.from('learning_progress').select('roadmap_id,step_id,completed,updated_at').eq('user_id',user.id);
    if(roadmapId)q=q.eq('roadmap_id',roadmapId);
    const {data,error}=await q;
    if(!error)return data||[];
  }
  const rows=readLocal<ProgressRow[]>(PROGRESS_KEY,[]);
  return roadmapId?rows.filter(x=>x.roadmap_id===roadmapId):rows;
}

export async function setProgress(roadmapId:string,stepId:string,completed:boolean){
  const user=await currentUser();
  if(user&&supabase){
    const {error}=await supabase.from('learning_progress').upsert({user_id:user.id,roadmap_id:roadmapId,step_id:stepId,completed,updated_at:new Date().toISOString()},{onConflict:'user_id,roadmap_id,step_id'});
    return {ok:!error,error:error?.message||''};
  }
  const rows=readLocal<ProgressRow[]>(PROGRESS_KEY,[]);
  const key=(x:ProgressRow)=>x.roadmap_id===roadmapId&&x.step_id===stepId;
  const next=rows.some(key)?rows.map(x=>key(x)?{...x,completed,updated_at:new Date().toISOString()}:x):[...rows,{roadmap_id:roadmapId,step_id:stepId,completed,updated_at:new Date().toISOString()}];
  writeLocal(PROGRESS_KEY,next);
  return {ok:true,error:''};
}

export async function getProfile(){
  const user=await currentUser();
  if(!user||!supabase)return {user:null,profile:null};
  const {data}=await supabase.from('profiles').select('*').eq('id',user.id).maybeSingle();
  return {user,profile:data||null};
}

export async function updateProfile(values:{display_name?:string;language?:string;notification_preferences?:Record<string,unknown>}){
  const user=await currentUser();
  if(!user||!supabase)return {ok:false,error:'Sign in required'};
  const {error}=await supabase.from('profiles').update({...values,updated_at:new Date().toISOString()}).eq('id',user.id);
  return {ok:!error,error:error?.message||''};
}
