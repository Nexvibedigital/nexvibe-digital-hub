-- NexVibe Cyber & Digital Hub — free-tier Supabase schema
-- Run this in a new Supabase project. Never expose the service-role key to the browser.

create extension if not exists pgcrypto;

create type public.app_role as enum ('registered_user','editor','administrator');
create type public.content_status as enum ('draft','published','scheduled','archived');

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text,
  avatar_url text,
  language text not null default 'en' check (language in ('en','si','ta')),
  notification_preferences jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create table public.user_roles (
  user_id uuid not null references auth.users(id) on delete cascade,
  role public.app_role not null default 'registered_user',
  primary key(user_id, role)
);
create table public.categories (id uuid primary key default gen_random_uuid(), name text not null, slug text unique not null, kind text not null default 'post', created_at timestamptz not null default now());
create table public.posts (
  id uuid primary key default gen_random_uuid(), slug text unique not null, title text not null, summary text, body_html text,
  language text not null default 'en' check(language in('en','si','ta')), status public.content_status not null default 'draft',
  category_label text, category_id uuid references public.categories(id) on delete set null, tags text[] not null default '{}', cover_image_url text, cover_mobile_url text,
  source_name text, source_url text, is_official_source boolean not null default false, what_users_should_do text, what_admins_should_do text,
  author_id uuid references auth.users(id) on delete set null, featured boolean not null default false, published_at timestamptz, scheduled_at timestamptz,
  created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);
create table public.tools (
  id uuid primary key default gen_random_uuid(), name text not null, slug text unique not null, description text not null, category text not null,
  official_url text not null, github_url text, pricing text not null check(pricing in('Free','Freemium','Paid')), account_required boolean default false,
  platforms text[] not null default '{}', difficulty text, safety_classification text check(safety_classification in('Defensive','Dual-use','Lab-only')),
  legal_use_guidance text, last_verified_at timestamptz, status public.content_status not null default 'draft', created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);
create table public.repositories (
  id uuid primary key default gen_random_uuid(), name text not null, owner text, description text, official_github_url text not null, language text, licence text,
  difficulty text, category text, documentation_url text, safety_label text, last_verified_at timestamptz, status public.content_status not null default 'draft', created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);
create table public.courses (
  id uuid primary key default gen_random_uuid(), provider text not null, title text not null, official_url text not null, cover_image_url text, level text, language text,
  duration text, pricing text check(pricing in('Free','Freemium','Paid')), certificate text, verified_price text, coupon_code text, coupon_expiry timestamptz,
  last_verified_at timestamptz, status public.content_status not null default 'draft', created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);
create table public.coupons (
  id uuid primary key default gen_random_uuid(), provider text not null, title text not null, official_url text not null, code text, verified_price text, expiry timestamptz,
  last_verified_at timestamptz, status public.content_status not null default 'draft', created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);
create table public.resources (id uuid primary key default gen_random_uuid(), title text not null, description text, official_url text not null, category text, status public.content_status not null default 'draft', created_at timestamptz default now(), updated_at timestamptz default now());
create table public.events (id uuid primary key default gen_random_uuid(), title text not null, organiser text, official_url text not null, event_at timestamptz, mode text, description text, status public.content_status not null default 'draft', created_at timestamptz default now(), updated_at timestamptz default now());
create table public.media_assets (id uuid primary key default gen_random_uuid(), owner_id uuid references auth.users(id) on delete set null, storage_path text not null, alt_text text, caption text, focal_x numeric, focal_y numeric, created_at timestamptz default now());
create table public.bookmarks (user_id uuid references auth.users(id) on delete cascade, item_type text not null, item_id text not null, created_at timestamptz default now(), primary key(user_id,item_type,item_id));
create table public.learning_progress (user_id uuid references auth.users(id) on delete cascade, roadmap_id text not null, step_id text not null, completed boolean not null default false, updated_at timestamptz default now(), primary key(user_id,roadmap_id,step_id));
create table public.submissions (id uuid primary key default gen_random_uuid(), user_id uuid references auth.users(id) on delete set null, type text not null, source_url text not null, description text, responsible_use_confirmed boolean not null default false, permission_confirmed boolean not null default false, status text not null default 'pending', created_at timestamptz default now());
create table public.link_reports (id uuid primary key default gen_random_uuid(), user_id uuid references auth.users(id) on delete set null, item_type text not null, item_id text not null, reason text, status text not null default 'pending', created_at timestamptz default now());
create table public.newsletter_subscribers (id uuid primary key default gen_random_uuid(), email text unique not null, consented_at timestamptz not null default now(), unsubscribed_at timestamptz);
create table public.contact_messages (id uuid primary key default gen_random_uuid(), user_id uuid references auth.users(id) on delete set null, name text, email text, message text not null, created_at timestamptz default now());
create table public.site_settings (key text primary key, value jsonb not null default '{}'::jsonb, updated_at timestamptz default now());
create table public.audit_logs (id bigint generated always as identity primary key, actor_id uuid references auth.users(id) on delete set null, action text not null, entity_type text, entity_id text, metadata jsonb not null default '{}'::jsonb, created_at timestamptz default now());

create or replace function public.has_role(required_role public.app_role)
returns boolean language sql stable security definer set search_path=public as $$
  select exists(select 1 from public.user_roles ur where ur.user_id=auth.uid() and ur.role=required_role)
$$;
create or replace function public.can_edit_content()
returns boolean language sql stable security definer set search_path=public as $$
  select public.has_role('editor') or public.has_role('administrator')
$$;

alter table public.profiles enable row level security; alter table public.user_roles enable row level security; alter table public.categories enable row level security;
alter table public.posts enable row level security; alter table public.tools enable row level security; alter table public.repositories enable row level security;
alter table public.courses enable row level security; alter table public.coupons enable row level security; alter table public.resources enable row level security; alter table public.events enable row level security;
alter table public.media_assets enable row level security; alter table public.bookmarks enable row level security; alter table public.learning_progress enable row level security;
alter table public.submissions enable row level security; alter table public.link_reports enable row level security; alter table public.newsletter_subscribers enable row level security;
alter table public.contact_messages enable row level security; alter table public.site_settings enable row level security; alter table public.audit_logs enable row level security;

create policy profiles_self_select on public.profiles for select using(id=auth.uid() or public.can_edit_content());
create policy profiles_self_update on public.profiles for update using(id=auth.uid()) with check(id=auth.uid());
create policy roles_admin_all on public.user_roles for all using(public.has_role('administrator')) with check(public.has_role('administrator'));
create policy roles_self_read on public.user_roles for select using(user_id=auth.uid());

create policy categories_public_read on public.categories for select using(true);
create policy categories_editor_manage on public.categories for all using(public.can_edit_content()) with check(public.can_edit_content());
create policy posts_public_read on public.posts for select using(status='published' and (published_at is null or published_at<=now()));
create policy posts_editor_manage on public.posts for all using(public.can_edit_content()) with check(public.can_edit_content());
create policy tools_public_read on public.tools for select using(status='published'); create policy tools_editor_manage on public.tools for all using(public.can_edit_content()) with check(public.can_edit_content());
create policy repos_public_read on public.repositories for select using(status='published'); create policy repos_editor_manage on public.repositories for all using(public.can_edit_content()) with check(public.can_edit_content());
create policy courses_public_read on public.courses for select using(status='published'); create policy courses_editor_manage on public.courses for all using(public.can_edit_content()) with check(public.can_edit_content());
create policy coupons_public_read on public.coupons for select using(status='published'); create policy coupons_editor_manage on public.coupons for all using(public.can_edit_content()) with check(public.can_edit_content());
create policy resources_public_read on public.resources for select using(status='published'); create policy resources_editor_manage on public.resources for all using(public.can_edit_content()) with check(public.can_edit_content());
create policy events_public_read on public.events for select using(status='published'); create policy events_editor_manage on public.events for all using(public.can_edit_content()) with check(public.can_edit_content());

create policy bookmarks_self_all on public.bookmarks for all using(user_id=auth.uid()) with check(user_id=auth.uid());
create policy progress_self_all on public.learning_progress for all using(user_id=auth.uid()) with check(user_id=auth.uid());
create policy submissions_insert on public.submissions for insert with check(user_id=auth.uid() or user_id is null);
create policy submissions_self_read on public.submissions for select using(user_id=auth.uid() or public.can_edit_content());
create policy submissions_editor_manage on public.submissions for update using(public.can_edit_content()) with check(public.can_edit_content());
create policy link_reports_insert on public.link_reports for insert with check(user_id=auth.uid() or user_id is null);
create policy link_reports_editor_read on public.link_reports for select using(public.can_edit_content() or user_id=auth.uid());
create policy media_editor_manage on public.media_assets for all using(public.can_edit_content()) with check(public.can_edit_content());
create policy settings_public_read on public.site_settings for select using(key in ('contact','social_links','public_features'));
create policy settings_admin_manage on public.site_settings for all using(public.has_role('administrator')) with check(public.has_role('administrator'));
create policy contacts_insert on public.contact_messages for insert with check(true); create policy contacts_editor_read on public.contact_messages for select using(public.can_edit_content());
create policy newsletter_insert on public.newsletter_subscribers for insert with check(true); create policy newsletter_editor_read on public.newsletter_subscribers for select using(public.can_edit_content());
create policy audit_admin_read on public.audit_logs for select using(public.has_role('administrator'));

-- Create public media bucket manually or via Dashboard, then apply storage policies appropriate to your project.
-- Do NOT assign an administrator role from frontend code. After verifying the owner's user account,
-- assign the first administrator securely in the SQL editor / backend console.
