import { useEffect, useState } from 'react';
import type { NewsItem } from '../types';

type LiveNews={syncedAt:string;mode?:string;note?:string;items:NewsItem[]};
export function useLiveNews(){
  const [data,setData]=useState<LiveNews>({syncedAt:'',items:[]});
  const [loading,setLoading]=useState(true);
  const [error,setError]=useState('');
  useEffect(()=>{
    let alive=true;
    fetch(`${import.meta.env.BASE_URL}data/live-news.json?ts=${Date.now()}`,{cache:'no-store'})
      .then(r=>{if(!r.ok) throw new Error('Live feed unavailable');return r.json()})
      .then(j=>{if(alive)setData(j)})
      .catch(e=>{if(alive)setError(e.message||'Live feed unavailable')})
      .finally(()=>{if(alive)setLoading(false)});
    return()=>{alive=false};
  },[]);
  return {data,loading,error};
}

export type KevItem={cveID:string;vendorProject:string;product:string;vulnerabilityName:string;dateAdded:string;shortDescription:string;requiredAction:string;dueDate:string;knownRansomwareCampaignUse?:string;notes?:string};
export function useKev(){
  const [data,setData]=useState<{syncedAt:string;catalogVersion:string;count:number;vulnerabilities:KevItem[]}>({syncedAt:'',catalogVersion:'',count:0,vulnerabilities:[]});
  const [loading,setLoading]=useState(true);const [error,setError]=useState('');
  useEffect(()=>{fetch(`${import.meta.env.BASE_URL}data/kev.json?ts=${Date.now()}`,{cache:'no-store'}).then(r=>r.json()).then(setData).catch(e=>setError(e.message)).finally(()=>setLoading(false))},[]);
  return {data,loading,error};
}

export type NvdItem={id:string;published:string;lastModified:string;description:string;score?:number;severity?:string;url:string};
export function useNvd(){
  const [data,setData]=useState<{syncedAt:string;items:NvdItem[]}>({syncedAt:'',items:[]});
  const [loading,setLoading]=useState(true);const [error,setError]=useState('');
  useEffect(()=>{fetch(`${import.meta.env.BASE_URL}data/nvd.json?ts=${Date.now()}`,{cache:'no-store'}).then(r=>r.json()).then(setData).catch(e=>setError(e.message)).finally(()=>setLoading(false))},[]);
  return {data,loading,error};
}

import { fetchSupabasePublishedPosts, getBrowserPublishedPosts } from './cms';
export function useCmsPosts(){
  const [items,setItems]=useState<NewsItem[]>(()=>getBrowserPublishedPosts());
  const [loading,setLoading]=useState(Boolean(import.meta.env.VITE_SUPABASE_URL));
  useEffect(()=>{let alive=true;fetchSupabasePublishedPosts().then(rows=>{if(alive&&rows.length)setItems(prev=>{const map=new Map<string,NewsItem>();rows.forEach(x=>map.set(x.id,x));prev.forEach(x=>{if(!map.has(x.id))map.set(x.id,x)});return [...map.values()]})}).finally(()=>alive&&setLoading(false));return()=>{alive=false}},[]);
  return {items,loading};
}
