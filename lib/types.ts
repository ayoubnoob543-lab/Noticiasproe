export type Category = {
  id: string;
  slug: string;
  name: string;
  description: string;
  color: string;
  icon?: string;
  parentId?: string | null;
};

export type Author = {
  id: string;
  name: string;
  avatar: string;
  bio: string;
  role: string;
};

export type Article = {
  id: string;
  slug: string;
  title: string;
  subtitle: string;
  summary: string;
  content: string;
  excerpt: string;
  metaDescription: string;
  image: string;
  imageAlt: string;
  category: string;
  categorySlug: string;
  subcategory?: string;
  tags: string[];
  author: Author;
  publishedAt: string;
  updatedAt?: string;
  readingTime: number;
  views: number;
  comments: number;
  shares: number;
  isBreaking: boolean;
  isFeatured: boolean;
  isTrending: boolean;
  source: string;
  sourceUrl: string;
  relatedIds?: string[];
};

export type Source = {
  id: string;
  name: string;
  url: string;
  type: 'rss' | 'newsapi' | 'gnews' | 'thenewsapi' | 'mediastack' | 'currents' | 'guardian' | 'nyt' | 'bing' | 'google' | 'custom';
  category: string;
  priority: number;
  isActive: boolean;
  lastFetched: string;
  articlesFetched: number;
  errors: number;
  language: string;
};

export type Comment = {
  id: string;
  articleId: string;
  author: string;
  avatar: string;
  content: string;
  createdAt: string;
  likes: number;
  replies?: Comment[];
};

export type Team = {
  id: string;
  name: string;
  shortName: string;
  slug: string;
  league: string;
  logo: string;
  colors: string;
  stadium: string;
  manager: string;
  position?: number;
  played?: number;
  won?: number;
  drawn?: number;
  lost?: number;
  points?: number;
};

export type Match = {
  id: string;
  homeTeam: string;
  awayTeam: string;
  homeScore?: number;
  awayScore?: number;
  date: string;
  status: 'scheduled' | 'live' | 'finished';
  competition: string;
  venue: string;
};

export type NewsletterSubscriber = {
  id: string;
  email: string;
  subscribedAt: string;
  preferences: string[];
};
