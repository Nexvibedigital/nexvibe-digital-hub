import type { AdminPost } from '../types';
export const ADMIN_POSTS_KEY='nexvibe-admin-posts-v5';
export function getLocalAdminPosts():AdminPost[]{
  try{return JSON.parse(localStorage.getItem(ADMIN_POSTS_KEY)||'[]')}catch{return[]}
}
export function saveLocalAdminPosts(posts:AdminPost[]){localStorage.setItem(ADMIN_POSTS_KEY,JSON.stringify(posts))}
export function getLocalPublishedPosts(){return getLocalAdminPosts().filter(p=>p.status==='published')}
