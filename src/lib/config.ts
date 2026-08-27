const githubAssetRoot = 'https://raw.githubusercontent.com/Nexvibedigital/nexvibe-digital-hub/main/public/assets/';

export const siteConfig = {
  name: 'NexVibe',
  productName: 'NexVibe Cyber & Digital Hub',
  tagline: 'Learn. Investigate. Secure. Build.',
  secondaryTagline: 'Everything Next in AI, Tech, Cybersecurity & Digital Growth.',
  email: 'nexvibe.digital@gmail.com',
  tiktok: 'https://www.tiktok.com/@nexvibeofficial?_r=1&_t=ZS-99ED95q9JNQ',
  facebook: 'https://www.facebook.com/share/1E26Tj3bmD/?mibextid=wwXIfr',
  logo: `${githubAssetRoot}nexvibe-logo.png?v=20260827-2`,
  heroDesktop: `${githubAssetRoot}hero-desktop.webp?v=20260827-2`,
  heroMobile: `${githubAssetRoot}hero-mobile.webp?v=20260827-2`,
  brandWide: `${githubAssetRoot}brand-wide.webp?v=20260827-2`,
} as const;

export const featureFlags = {
  HIBP_EMAIL_API_ENABLED: import.meta.env.VITE_HIBP_EMAIL_API_ENABLED === 'true',
  VIRUSTOTAL_API_ENABLED: import.meta.env.VITE_VIRUSTOTAL_API_ENABLED === 'true',
  GOOGLE_WEB_RISK_ENABLED: import.meta.env.VITE_GOOGLE_WEB_RISK_ENABLED === 'true',
  N8N_ENABLED: import.meta.env.VITE_N8N_ENABLED === 'true',
  AI_ANALYSIS_ENABLED: import.meta.env.VITE_AI_ANALYSIS_ENABLED === 'true',
  PAYMENTS_ENABLED: import.meta.env.VITE_PAYMENTS_ENABLED === 'true',
  SUPABASE_ENABLED: Boolean(import.meta.env.VITE_SUPABASE_URL && import.meta.env.VITE_SUPABASE_ANON_KEY),
};

export const officialSources = [
  {name:'Sri Lanka CERT', url:'https://www.cert.gov.lk/alert', description:'Official Sri Lanka cybersecurity alerts and advisories.'},
  {name:'CISA Alerts & Advisories', url:'https://www.cisa.gov/news-events/cybersecurity-advisories', description:'Official U.S. CISA alerts, advisories and ICS notices.'},
  {name:'CISA KEV Catalog', url:'https://www.cisa.gov/known-exploited-vulnerabilities-catalog', description:'Known Exploited Vulnerabilities catalog.'},
  {name:'NIST NVD', url:'https://nvd.nist.gov/', description:'National Vulnerability Database and CVE information.'},
  {name:'Have I Been Pwned', url:'https://haveibeenpwned.com/', description:'Official breach-notification service and Pwned Passwords lookup.'},
  {name:'OWASP', url:'https://owasp.org/', description:'Open web application security resources and standards.'},
  {name:'Apple Security Releases', url:'https://support.apple.com/en-us/100100', description:'Official Apple security release information.'},
  {name:'Microsoft Security Response Center', url:'https://msrc.microsoft.com/', description:'Official Microsoft security guidance and update information.'},
] as const;
