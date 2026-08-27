# NexVibe Cyber & Digital Hub — React + Vite Advanced Build

Premium, mobile-first, free-first NexVibe platform built for GitHub Pages and future Supabase integration.

## Brand & contact details included

- Brand: **NexVibe**
- Tagline: **Learn. Investigate. Secure. Build.**
- Secondary tagline: **Everything Next in AI, Tech, Cybersecurity & Digital Growth.**
- Email: **nexvibe.digital@gmail.com**
- TikTok: **https://www.tiktok.com/@nexvibeofficial**
- Facebook: **https://www.facebook.com/share/1E26Tj3bmD/**

The uploaded NexVibe logo is used as supplied. The uploaded desktop/mobile hero artwork is used as responsive brand imagery.

---

## What is included

### Public platform

- Home
- Global Search
- News & Intelligence
- Cyber Alerts
- Official Sources directory
- CVE + CISA Known Exploited Vulnerabilities explorer
- OSINT directory
- Cyber tools directory
- GitHub directory
- Learning Centre
- Roadmaps
- Courses
- Coupons / Deals
- Resources
- Events
- NexVibe Digital Safety Centre
- Services
- Community
- Contact
- About
- Saved / Profile placeholders for account expansion
- Privacy / Terms / Responsible Use / Affiliate Disclosure

### Digital Safety Centre

- **Password Exposure Checker**
  - Browser-local SHA-1 hashing
  - HIBP Pwned Passwords k-anonymity range lookup
  - Raw password is never sent to NexVibe
  - Local strength meter
  - Common-pattern warning
  - PDF report
- **Free Email Safety Assessment**
  - No fake automatic breach lookup
  - Opens official HIBP website separately
  - Email stays in page memory only
  - Masked report display
  - User-confirmed breach results
  - Personal action plan
  - PDF report
- **Suspicious URL Analyser**
  - Local warning-sign checks
  - Does not automatically open/fetch the destination
  - Punycode, HTTP, IP, subdomain, encoding, shortener and suspicious-keyword checks
- **QR Code Safety Scanner**
  - Camera/photo upload
  - Local QR decoding
  - Extracted content preview
  - Local URL analysis
  - Confirmation before opening
- **File Hash Generator**
  - Local SHA-256
  - Local SHA-1 with legacy warning
  - Local MD5 with strong legacy/insecure warning
  - VirusTotal hash-search link
- **Basic Domain Safety Check**
  - Static UI + protected Supabase Edge Function scaffold
  - Kept disabled on static hosting because client-side protected SSRF-safe fetching is not appropriate
- **Security Checklist Generator**
- **Local branded PDF reports**

### Live / near-live cyber data

GitHub Actions runs a public-source sync every 30 minutes and writes JSON into `public/data/`.

Sources currently wired into the sync script:

- CISA Cybersecurity Advisories RSS
- CISA Known Exploited Vulnerabilities JSON
- NIST NVD API 2.0
- Sri Lanka CERT Alerts page
- Center for Internet Security advisories feed

**Important:** External official-feed cards are displayed as an external official stream and link to the original source. They are **not** automatically published as NexVibe editorial articles.

The admin workflow follows:

**Import → Deduplicate → Save as Draft → Admin Review → Publish**

### Admin / Content Studio

- Overview stats
- Create/edit/delete local posts
- Draft / Published state
- English / Sinhala field
- Cover image field
- Official-feed import as **draft only**
- Tool preview
- Media preview
- Contact settings preview
- JSON export/import
- Sticky mobile save action
- iPhone-friendly layout
- Local admin demo for static testing
- Supabase-ready authentication and RLS migration
- Shared Supabase post publishing: when configured, editors/admins can save published posts from phone or desktop and public News/Search/Home reads them across devices

---

# 1. Run locally on a computer

You need Node.js 20+ (Node 22 recommended).

```bash
npm install
npm run dev
```

Then open the local URL shown by Vite.

---

# 2. Publish FREE with GitHub Pages — step by step

## A. Create the GitHub repository

1. Sign in to GitHub.
2. Tap/click **New repository**.
3. Repository name example:
   `nexvibe-digital-hub`
4. Set it to **Public** if you want GitHub Actions/Pages to be simplest on a free account.
5. Create the repository.

## B. Upload this project

Upload **all files inside `nexvibe-react-v5`** to the repository root.

The root must contain files such as:

```text
package.json
vite.config.ts
src/
public/
.github/
scripts/
supabase/
```

Do **not** upload only the ZIP file.

## C. Enable GitHub Pages using Actions

1. Open the repository.
2. Go to **Settings**.
3. Open **Pages**.
4. Under **Build and deployment**, choose **GitHub Actions**.
5. Go back to the **Actions** tab.
6. The workflow `Deploy NexVibe to GitHub Pages` should run automatically after the push/upload.
7. When it completes, GitHub shows the live Pages URL.

Expected URL format:

```text
https://YOUR-USERNAME.github.io/nexvibe-digital-hub/
```

## D. Confirm the official feed automation

Open:

**Actions → Update official cyber feeds**

You can click **Run workflow** once manually.

After that, the scheduled job runs around every 30 minutes. When data changes it commits refreshed JSON. The Pages deployment workflow also listens for completion of the feed workflow, so the latest cached official data is rebuilt into the live site.

This gives you **near-live**, free, static-hosting-compatible official cyber data. Static GitHub Pages cannot provide true second-by-second server streaming.

---

# 3. Posting from the phone

## Current static mode

Open:

```text
/login
```

If Supabase is not configured, choose **Open local Admin Demo**.

You can create posts and export JSON from the browser. This local demo is good for testing, but localStorage does not sync between iPhone and desktop.

## Best free production mode — Supabase

For real multi-device admin publishing:

1. Create a free Supabase project.
2. Open **SQL Editor**.
3. Run:
   `supabase/migrations/001_nexvibe_schema.sql`
4. Copy your project URL and **anon/public** key.
5. In GitHub repository:
   **Settings → Secrets and variables → Actions → Variables**
   or update the deployment workflow/environment as preferred.
6. Configure:

```env
VITE_SUPABASE_URL=https://YOURPROJECT.supabase.co
VITE_SUPABASE_ANON_KEY=YOUR_PUBLIC_ANON_KEY
```

Never put the **service-role** key in the browser or GitHub Pages frontend.

7. Create your account through `/register`.
8. Verify the owner account.
9. Assign the first `administrator` role securely from the Supabase SQL editor/backend — never hardcode an admin password in the website.

The included schema has RLS policies for profiles, roles, published content, user bookmarks, submissions and admin/editor access.

> The frontend already detects whether Supabase is configured. **Post CRUD is wired to Supabase** for editor/admin accounts; tools, repositories, courses, coupons, resources, events and media have database/RLS structures ready for the next management modules without changing the public design system.

---

# 4. Free-first feature flags

`.env.example` includes:

```env
VITE_HIBP_EMAIL_API_ENABLED=false
VITE_VIRUSTOTAL_API_ENABLED=false
VITE_GOOGLE_WEB_RISK_ENABLED=false
VITE_N8N_ENABLED=false
VITE_AI_ANALYSIS_ENABLED=false
VITE_PAYMENTS_ENABLED=false
```

The website builds and remains useful while all of these are false.

---

# 5. Custom domain later

When you buy `nexvibe.lk` or another domain:

1. Add the domain under **GitHub → Repository → Settings → Pages → Custom domain**.
2. Add the DNS records GitHub shows you at your domain provider.
3. Enable **Enforce HTTPS** after DNS is active.
4. For a custom root domain, build with:

```env
VITE_BASE_PATH=/
```

5. Update `public/sitemap.xml` with the final real domain if it changes.
6. If using the provided GitHub Pages `404.html` SPA fallback on a custom root domain, set `pathSegmentsToKeep = 0` in `public/404.html`.

For a normal project URL such as `username.github.io/nexvibe-digital-hub/`, keep it at `1`.

---

# 6. Official source policy

Do not copy entire advisories into NexVibe automatically.

Recommended publishing model:

- Display source-linked official feed cards automatically in the **external live stream**.
- If you want a NexVibe article:
  1. import the feed item as draft,
  2. open the official advisory,
  3. verify the facts,
  4. write a short original summary,
  5. add “What users should do” and/or “What administrators should do”,
  6. publish only after review.

Do not fabricate:

- CVE severity
- exploitation status
- dates
- prices
- coupons
- event dates
- GitHub stars/forks
- breach records
- security guarantees

---

# 7. Lovable preview note

The project is designed from the NexVibe visual direction, supplied official logo, hero artwork and the detailed platform specification. If you want a pixel-by-pixel match to a Lovable preview, compare the live GitHub deployment side-by-side with Lovable and adjust the Tailwind/CSS tokens in `src/index.css`.

---

# 8. Important security notes

- Never store raw passwords.
- Never log password-check contents.
- Do not automatically open QR or suspicious URL destinations.
- Do not run arbitrary domain requests from the browser and call them “safe”.
- Do not deploy `domain-check` without reviewing SSRF protections.
- Do not put private reports in public storage.
- Do not make sensitive report pages cacheable.
- Validate and sanitise rich-text content before connecting a WYSIWYG editor to Supabase.
- Use RLS as the real admin boundary — not only frontend route guards.

---

## Project structure

```text
nexvibe-react-v5/
├── .github/workflows/
│   ├── deploy-pages.yml
│   └── update-live-data.yml
├── public/
│   ├── assets/
│   ├── data/
│   ├── 404.html
│   ├── manifest.webmanifest
│   ├── offline.html
│   ├── robots.txt
│   ├── sitemap.xml
│   └── sw.js
├── scripts/
│   └── update-live-data.mjs
├── src/
│   ├── components/
│   ├── context/
│   ├── data/
│   ├── lib/
│   ├── pages/
│   ├── App.tsx
│   ├── index.css
│   ├── main.tsx
│   └── types.ts
├── supabase/
│   ├── functions/
│   └── migrations/
├── .env.example
├── package.json
├── tailwind.config.js
├── tsconfig*.json
└── vite.config.ts
```

