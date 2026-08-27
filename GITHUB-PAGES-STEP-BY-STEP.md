# NexVibe — GitHub Pages Live Setup

## 1. Create repository
Create a GitHub repository named `nexvibe-digital-hub` (or any name you prefer).

## 2. Upload the project
Extract the ZIP. Upload **the contents inside `nexvibe-react-v5/`** to the repository root.
The root should show `package.json`, `src`, `public`, `.github`, `scripts`, and `supabase`.

## 3. Enable Pages
Repository → **Settings → Pages → Build and deployment → Source: GitHub Actions**.

## 4. Run deployment
Open **Actions → Deploy NexVibe to GitHub Pages**. It also runs automatically after a push to `main`.
When green, open the Pages URL shown by GitHub.

## 5. Start official cyber-feed sync
Open **Actions → Update official cyber feeds → Run workflow**.
It is scheduled approximately every 30 minutes. The feed job writes source-linked official data into `public/data/`. The Pages workflow listens for the feed workflow to finish and rebuilds the site.

## 6. Optional: make phone/desktop admin shared with Supabase
Create a free Supabase project and run `supabase/migrations/001_nexvibe_schema.sql` in SQL Editor.
Then add these GitHub repository **Actions Variables**:

- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`

Do not use the Supabase service-role key in the frontend.

Register your owner account on the site, verify it, then assign `administrator` in Supabase SQL/backend. Do not hardcode an admin password.

## 7. Contact details already configured
- nexvibe.digital@gmail.com
- TikTok @nexvibeofficial
- NexVibe Facebook page link supplied by the owner

## 8. Custom domain later
When you buy `nexvibe.lk`, set it in GitHub Pages → Custom domain and update DNS. Then set the build base path to `/` and update `public/sitemap.xml` if needed.
