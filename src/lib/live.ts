import { useEffect, useState } from 'react';
import type { NewsItem } from '../types';

type LiveNews={syncedAt:string;mode?:string;note?:string;items:NewsItem[]};
function useJsonFeed<T>(path:string,initial:T){const [data,setData]=useState<T>(initial);const [loading,setLoading]=useState(true);const [error,setError]=useState('');useEffect(()=>{let alive=true;fetch(`${import.meta.env.BASE_URL}${path}?ts=${Date.now()}`,{cache:'no-store'}).then(r=>{if(!r.ok)throw new Error('Feed unavailable');return r.json()}).then(j=>alive&&setData(j)).catch(e=>alive&&setError(e.message||'Feed unavailable')).finally(()=>alive&&setLoading(false));return()=>{alive=false}},[path]);return {data,loading,error}}
export function useLiveNews(){return useJsonFeed<LiveNews>('data/live-news.json',{syncedAt:'',items:[]})}
export function useReviewQueue(){return useJsonFeed<LiveNews>('data/review-queue.json',{syncedAt:'',items:[]})}

export type KevItem={cveID:string;vendorProject:string;product:string;vulnerabilityName:string;dateAdded:string;shortDescription:string;requiredAction:string;dueDate:string;knownRansomwareCampaignUse?:string;notes?:string};
export function useKev(){return useJsonFeed<{syncedAt:string;catalogVersion:string;count:number;vulnerabilities:KevItem[]}>('data/kev.json',{syncedAt:'',catalogVersion:'',count:0,vulnerabilities:[]})}

export type NvdItem={id:string;published:string;lastModified:string;description:string;score?:number;severity?:string;url:string};
export function useNvd(){return useJsonFeed<{syncedAt:string;items:NvdItem[]}>('data/nvd.json',{syncedAt:'',items:[]})}

import { fetchSupabasePublishedPosts, getBrowserPublishedPosts } from './cms';
export function useCmsPosts(){
  const [items,setItems]=useState<NewsItem[]>(()=>getBrowserPublishedPosts());const [loading,setLoading]=useState(Boolean(import.meta.env.VITE_SUPABASE_URL));
  useEffect(()=>{let alive=true;fetchSupabasePublishedPosts().then(rows=>{if(alive&&rows.length)setItems(prev=>{const map=new Map<string,NewsItem>();rows.forEach(x=>map.set(x.id,x));prev.forEach(x=>{if(!map.has(x.id))map.set(x.id,x)});return [...map.values()]})}).finally(()=>alive&&setLoading(false));return()=>{alive=false}},[]);
  return {items,loading};
}
