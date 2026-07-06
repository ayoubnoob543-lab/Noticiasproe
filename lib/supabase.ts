import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Supabase environment variables are not set. The app will not be able to read from the database.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: false,
  },
});

export type ArticleRow = {
  id: string;
  slug: string;
  title: string;
  subtitle: string | null;
  summary: string | null;
  content: string | null;
  excerpt: string | null;
  meta_description: string | null;
  image: string | null;
  image_alt: string | null;
  category_id: string | null;
  category_slug: string;
  subcategory_slug: string | null;
  tags: string[];
  author_id: string | null;
  published_at: string;
  updated_at: string | null;
  reading_time: number;
  views: number;
  comments_count: number;
  shares: number;
  is_breaking: boolean;
  is_featured: boolean;
  is_trending: boolean;
  status: string;
  source_id: string | null;
  source_url: string | null;
  ai_rewritten: boolean;
  original_language: string | null;
  created_at: string;
};

export type AuthorRow = {
  id: string;
  name: string;
  avatar: string | null;
  bio: string | null;
  role: string | null;
  created_at: string;
};

export type SourceRow = {
  id: string;
  name: string;
  url: string;
  type: string;
  category: string | null;
  priority: number;
  is_active: boolean;
  language: string;
  last_fetched_at: string | null;
  fetch_interval_seconds: number;
  articles_fetched: number;
  errors_count: number;
  config: Record<string, unknown>;
  created_at: string;
  updated_at: string;
};

export type CategoryRow = {
  id: string;
  slug: string;
  name: string;
  description: string | null;
  color: string | null;
  icon: string | null;
  parent_id: string | null;
  priority: number;
  created_at: string;
};

export type CommentRow = {
  id: string;
  article_id: string;
  author_name: string;
  author_avatar: string | null;
  content: string;
  likes: number;
  parent_id: string | null;
  is_approved: boolean;
  created_at: string;
};

export type TeamRow = {
  id: string;
  name: string;
  short_name: string | null;
  slug: string;
  league: string | null;
  logo: string | null;
  colors: string | null;
  stadium: string | null;
  manager: string | null;
  position: number | null;
  played: number | null;
  won: number | null;
  drawn: number | null;
  lost: number | null;
  points: number | null;
  created_at: string;
};

export type MatchRow = {
  id: string;
  home_team: string;
  away_team: string;
  home_score: number | null;
  away_score: number | null;
  date: string;
  status: string;
  competition: string | null;
  venue: string | null;
  created_at: string;
};

export type FetchErrorRow = {
  id: string;
  source_id: string | null;
  type: string;
  message: string;
  severity: string;
  is_resolved: boolean;
  timestamp: string;
  resolved_at: string | null;
};
