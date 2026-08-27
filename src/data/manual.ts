import type { CourseItem, DirectoryItem, NewsItem } from '../types';

const A=(name:string)=>`${import.meta.env.BASE_URL}assets/${name}`;

export const manualPosts:NewsItem[] = [
  {
    id:'sri-lanka-cert-copilot-cosnitch',
    title:'Sri Lanka CERT flags Microsoft Copilot Personal one-click data-exfiltration flaw',
    summary:'Sri Lanka CERT published a high-severity alert for CVE-2026-24301 affecting Microsoft Copilot Personal and points users to Microsoft’s security fix.',
    source:'Sri Lanka CERT',
    sourceUrl:'https://www.cert.gov.lk/alerts/CERT-NCSOC-0249.htm',
    publishedAt:'2026-08-19',
    category:'Sri Lanka Cyber Alert', official:true,
    image:A('hero-desktop.webp'),
    tags:['Sri Lanka CERT','Microsoft','Copilot','CVE-2026-24301'],
    content:[
      'Sri Lanka CERT published an alert for a high-severity issue in Microsoft Copilot Personal. The advisory says a specially crafted URL could trigger unauthorised prompts in an authenticated Copilot session and potentially expose information from connected services.',
      'The advisory states Microsoft released fixes on 18 August 2026 and that, at the time of disclosure, there was no evidence of active exploitation in the wild.',
      'What users should do: keep Microsoft services and browsers updated, review connected applications, avoid unexpected links, and monitor account activity.',
      'NexVibe note: this summary links back to the official Sri Lanka CERT source. Always verify technical details and remediation steps with the vendor and CERT advisory.'
    ]
  },
  {
    id:'sri-lanka-cert-sharepoint-august-2026',
    title:'Sri Lanka CERT warns of multiple actively exploited SharePoint Server vulnerabilities',
    summary:'The official advisory covers authentication bypass, remote code execution and actively exploited SharePoint Server issues, with patching and hardening guidance.',
    source:'Sri Lanka CERT',
    sourceUrl:'https://www.cert.gov.lk/alerts/CERT-NCSOC-0248.htm',
    publishedAt:'2026-08-13',
    category:'Sri Lanka Cyber Alert', official:true,
    image:A('brand-wide.webp'),
    tags:['Sri Lanka CERT','SharePoint','CISA KEV'],
    content:[
      'Sri Lanka CERT published a critical alert covering several on-premises Microsoft SharePoint Server vulnerabilities. The advisory describes risks including authentication bypass, remote code execution, information disclosure and ransomware deployment.',
      'The alert recommends applying the latest vendor updates, reducing unnecessary internet exposure, protecting SharePoint Central Administration, enabling monitoring and validating patch status by build number.',
      'Administrators of previously exposed and unpatched servers should follow the official compromise-assessment guidance and Microsoft remediation references linked by Sri Lanka CERT.'
    ]
  },
  {
    id:'nexvibe-password-k-anonymity',
    title:'How NexVibe checks password exposure without sending your full password',
    summary:'A privacy-focused explanation of the HIBP Pwned Passwords k-anonymity method used by the Digital Safety Centre.',
    source:'NexVibe', sourceUrl:'/digital-safety/password-check', publishedAt:'2026-08-27', category:'Digital Safety',
    image:A('hero-mobile.webp'), tags:['passwords','privacy','HIBP'],
    content:[
      'The Password Exposure Checker hashes your password locally with SHA-1, sends only the first five hash characters to the Pwned Passwords service, and compares the returned suffixes locally in your browser.',
      'The raw password is not sent to NexVibe. It is also cleared from page state after the lookup. No password check can prove an account is safe, so use unique credentials and multi-factor authentication.'
    ]
  }
];

export const toolDirectory:DirectoryItem[] = [
  {id:'cyberchef',name:'CyberChef',description:'Browser-based data transformation, decoding, hashing and analysis toolkit from GCHQ.',category:'Analysis',officialUrl:'https://gchq.github.io/CyberChef/',githubUrl:'https://github.com/gchq/CyberChef',pricing:'Free',difficulty:'Beginner',classification:'Defensive',platforms:['Web'],lastVerified:'2026-08-27'},
  {id:'wireshark',name:'Wireshark',description:'Network protocol analyser for troubleshooting, learning and defensive packet analysis.',category:'Network Analysis',officialUrl:'https://www.wireshark.org/',githubUrl:'https://gitlab.com/wireshark/wireshark',pricing:'Free',difficulty:'Intermediate',classification:'Dual-use',platforms:['Windows','macOS','Linux'],lastVerified:'2026-08-27'},
  {id:'keepassxc',name:'KeePassXC',description:'Open-source offline password manager for securely storing unique credentials.',category:'Privacy',officialUrl:'https://keepassxc.org/',githubUrl:'https://github.com/keepassxreboot/keepassxc',pricing:'Free',difficulty:'Beginner',classification:'Defensive',platforms:['Windows','macOS','Linux'],lastVerified:'2026-08-27'},
  {id:'spiderfoot',name:'SpiderFoot',description:'OSINT automation framework for public-data research and attack-surface awareness.',category:'OSINT',officialUrl:'https://www.spiderfoot.net/',githubUrl:'https://github.com/smicallef/spiderfoot',pricing:'Free',difficulty:'Intermediate',classification:'Dual-use',platforms:['Web','Desktop'],lastVerified:'2026-08-27'},
  {id:'maltego-ce',name:'Maltego Community Edition',description:'Visual link-analysis platform for public-data research and entity relationships.',category:'OSINT',officialUrl:'https://www.maltego.com/',pricing:'Freemium',difficulty:'Intermediate',classification:'Dual-use',platforms:['Windows','macOS','Linux'],accountRequired:true,lastVerified:'2026-08-27'},
  {id:'autopsy',name:'Autopsy',description:'Digital forensics platform for analysing disks, files and investigation artefacts.',category:'Digital Forensics',officialUrl:'https://www.autopsy.com/',githubUrl:'https://github.com/sleuthkit/autopsy',pricing:'Free',difficulty:'Intermediate',classification:'Defensive',platforms:['Windows','Linux'],lastVerified:'2026-08-27'},
  {id:'owasp-zap',name:'OWASP ZAP',description:'Web application security testing proxy for authorised learning, lab and defensive assessment.',category:'Web Security',officialUrl:'https://www.zaproxy.org/',githubUrl:'https://github.com/zaproxy/zaproxy',pricing:'Free',difficulty:'Intermediate',classification:'Dual-use',platforms:['Windows','macOS','Linux'],lastVerified:'2026-08-27'},
  {id:'virustotal',name:'VirusTotal',description:'Multi-engine file, URL and hash reputation service. Public access has usage limits.',category:'Threat Intelligence',officialUrl:'https://www.virustotal.com/',pricing:'Freemium',difficulty:'Beginner',classification:'Defensive',platforms:['Web'],accountRequired:false,lastVerified:'2026-08-27'},
  {id:'shodan',name:'Shodan',description:'Search engine for internet-connected services. Use only for lawful research and authorised environments.',category:'OSINT',officialUrl:'https://www.shodan.io/',pricing:'Freemium',difficulty:'Intermediate',classification:'Dual-use',platforms:['Web'],accountRequired:true,lastVerified:'2026-08-27'},
  {id:'securityheaders',name:'Security Headers',description:'Public website header review tool that helps identify missing defensive HTTP headers.',category:'Web Security',officialUrl:'https://securityheaders.com/',pricing:'Free',difficulty:'Beginner',classification:'Defensive',platforms:['Web'],lastVerified:'2026-08-27'},
  {id:'urlscan',name:'urlscan.io',description:'Public URL and website analysis service. Avoid submitting private or confidential URLs.',category:'Threat Intelligence',officialUrl:'https://urlscan.io/',pricing:'Freemium',difficulty:'Beginner',classification:'Defensive',platforms:['Web'],lastVerified:'2026-08-27'},
  {id:'exiftool',name:'ExifTool',description:'Metadata reading and writing utility useful for digital-forensics and media verification workflows.',category:'Metadata',officialUrl:'https://exiftool.org/',pricing:'Free',difficulty:'Intermediate',classification:'Defensive',platforms:['Windows','macOS','Linux'],lastVerified:'2026-08-27'},
];

export const courses:CourseItem[] = [
  {id:'cisco-intro-cyber',provider:'Cisco Networking Academy',title:'Introduction to Cybersecurity',officialUrl:'https://www.netacad.com/',level:'Beginner',language:'English',duration:'Provider-defined',pricing:'Free',certificate:'Provider terms apply',lastVerified:'2026-08-27'},
  {id:'ms-learn-security',provider:'Microsoft Learn',title:'Security learning paths',officialUrl:'https://learn.microsoft.com/training/browse/?products=security',level:'Beginner–Advanced',language:'English',duration:'Self-paced',pricing:'Free',certificate:'Learning achievements vary',lastVerified:'2026-08-27'},
  {id:'google-cyber',provider:'Google / Coursera',title:'Google Cybersecurity Professional Certificate',officialUrl:'https://www.coursera.org/professional-certificates/google-cybersecurity',level:'Beginner',language:'English',duration:'Provider-defined',pricing:'Paid',certificate:'Yes',lastVerified:'2026-08-27'},
  {id:'tryhackme',provider:'TryHackMe',title:'Cyber Security learning paths',officialUrl:'https://tryhackme.com/',level:'Beginner–Advanced',language:'English',duration:'Self-paced',pricing:'Freemium',certificate:'Platform-dependent',lastVerified:'2026-08-27'},
  {id:'htb-academy',provider:'Hack The Box Academy',title:'Cybersecurity skill paths',officialUrl:'https://academy.hackthebox.com/',level:'Beginner–Advanced',language:'English',duration:'Self-paced',pricing:'Freemium',certificate:'Platform-dependent',lastVerified:'2026-08-27'},
];

export const roadmaps = [
  {id:'beginner',title:'Complete Beginner',steps:['Digital safety basics','Computer & networking fundamentals','Linux basics','Python basics','Web fundamentals','Intro cyber labs','Build a learning portfolio']},
  {id:'soc',title:'SOC Analyst',steps:['Networking and logs','Windows & Linux telemetry','SIEM fundamentals','Detection concepts','Incident triage','Threat intelligence','Blue-team labs']},
  {id:'osint',title:'OSINT Investigator',steps:['Research ethics','Search strategy','Source verification','Metadata and archives','Geolocation basics','Entity mapping','Reporting and evidence notes']},
  {id:'websec',title:'Web Security',steps:['HTTP and browser basics','HTML/CSS/JS fundamentals','Authentication and sessions','OWASP Top 10','Proxy tools in labs','Secure coding awareness','Responsible disclosure basics']},
  {id:'cloud',title:'Cloud Security',steps:['Cloud shared responsibility','IAM fundamentals','Network controls','Logging and monitoring','Secrets management','Configuration review','Incident response']},
  {id:'ai-security',title:'AI Security',steps:['AI system basics','Prompt injection concepts','Data privacy','Model supply chain','Access controls','Monitoring','Secure evaluation']},
];
