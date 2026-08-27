import { useEffect, useState } from 'react';
import { Bookmark, BookmarkCheck } from 'lucide-react';
import { isBookmarked, toggleBookmark } from '../lib/account';

export default function BookmarkButton({itemType='news',itemId,compact=false}:{itemType?:string;itemId:string;compact?:boolean}){
  const [saved,setSaved]=useState(false); const [busy,setBusy]=useState(false);
  useEffect(()=>{let alive=true;isBookmarked(itemType,itemId).then(v=>alive&&setSaved(v));return()=>{alive=false}},[itemType,itemId]);
  async function toggle(){setBusy(true);const r=await toggleBookmark(itemType,itemId);setSaved(r.saved);setBusy(false)}
  return <button type="button" className={`nv-button ${saved?'nv-button-saved':''}`} aria-pressed={saved} title={saved?'Remove from saved':'Save for later'} onClick={toggle} disabled={busy}>{saved?<BookmarkCheck size={16}/>:<Bookmark size={16}/>} {!compact&&(saved?'Saved':'Save')}</button>
}
