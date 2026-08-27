export type NewsItem = {
  id: string;
  title: string;
  summary: string;
  source: string;
  sourceUrl: string;
  publishedAt: string;
  category: string;
  official?: boolean;
  image?: string;
  content?: string[];
  tags?: string[];
  language?: 'en'|'si';
};

export type DirectoryItem = {
  id: string;
  name: string;
  description: string;
  category: string;
  officialUrl: string;
  githubUrl?: string;
  pricing: 'Free'|'Freemium'|'Paid';
  difficulty: 'Beginner'|'Intermediate'|'Advanced';
  classification: 'Defensive'|'Dual-use'|'Lab-only';
  platforms: string[];
  accountRequired?: boolean;
  lastVerified: string;
};

export type CourseItem = {
  id: string;
  provider: string;
  title: string;
  officialUrl: string;
  level: string;
  language: string;
  duration: string;
  pricing: 'Free'|'Paid'|'Freemium';
  certificate: string;
  lastVerified: string;
};

export type EventItem = {
  id: string;
  title: string;
  organiser: string;
  officialUrl: string;
  mode: string;
  date: string;
  description: string;
  verified: boolean;
};

export type AdminPost = NewsItem & { status: 'draft'|'published'; featured?: boolean };
