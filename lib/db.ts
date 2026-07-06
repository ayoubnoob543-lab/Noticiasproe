import { supabase } from './supabase';
import type {
  ArticleRow,
  AuthorRow,
  CategoryRow,
  CommentRow,
  SourceRow,
  TeamRow,
  MatchRow,
  FetchErrorRow,
} from './supabase';
import type { Article, Author, Category, Comment, Source, Team, Match } from './types';

// ============================================================
// Mappers: DB rows -> frontend types
// ============================================================

function mapAuthor(row: AuthorRow): Author {
  return {
    id: row.id,
    name: row.name,
    avatar: row.avatar || '',
    bio: row.bio || '',
    role: row.role || '',
  };
}

function mapArticle(
  row: ArticleRow,
  author?: Author,
  sourceName?: string
): Article {
  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    subtitle: row.subtitle || '',
    summary: row.summary || '',
    content: row.content || '',
    excerpt: row.excerpt || '',
    metaDescription: row.meta_description || '',
    image: row.image || '',
    imageAlt: row.image_alt || '',
    category: '', // filled by caller
    categorySlug: row.category_slug,
    subcategory: row.subcategory_slug || undefined,
    tags: row.tags || [],
    author: author || {
      id: row.author_id || '',
      name: '',
      avatar: '',
      bio: '',
      role: '',
    },
    publishedAt: row.published_at,
    updatedAt: row.updated_at || undefined,
    readingTime: row.reading_time,
    views: row.views,
    comments: row.comments_count,
    shares: row.shares,
    isBreaking: row.is_breaking,
    isFeatured: row.is_featured,
    isTrending: row.is_trending,
    source: sourceName || '',
    sourceUrl: row.source_url || '',
  };
}

function mapSource(row: SourceRow): Source {
  return {
    id: row.id,
    name: row.name,
    url: row.url,
    type: row.type as Source['type'],
    category: row.category || '',
    priority: row.priority,
    isActive: row.is_active,
    lastFetched: row.last_fetched_at || '',
    articlesFetched: row.articles_fetched,
    errors: row.errors_count,
    language: row.language,
  };
}

function mapCategory(row: CategoryRow): Category {
  return {
    id: row.id,
    slug: row.slug,
    name: row.name,
    description: row.description || '',
    color: row.color || '#3b82f6',
    icon: row.icon || undefined,
    parentId: row.parent_id,
  };
}

function mapComment(row: CommentRow): Comment {
  return {
    id: row.id,
    articleId: row.article_id,
    author: row.author_name,
    avatar: row.author_avatar || '',
    content: row.content,
    createdAt: row.created_at,
    likes: row.likes,
  };
}

function mapTeam(row: TeamRow): Team {
  return {
    id: row.id,
    name: row.name,
    shortName: row.short_name || '',
    slug: row.slug,
    league: row.league || '',
    logo: row.logo || '',
    colors: row.colors || '',
    stadium: row.stadium || '',
    manager: row.manager || '',
    position: row.position || undefined,
    played: row.played || undefined,
    won: row.won || undefined,
    drawn: row.drawn || undefined,
    lost: row.lost || undefined,
    points: row.points || undefined,
  };
}

function mapMatch(row: MatchRow): Match {
  return {
    id: row.id,
    homeTeam: row.home_team,
    awayTeam: row.away_team,
    homeScore: row.home_score || undefined,
    awayScore: row.away_score || undefined,
    date: row.date,
    status: row.status as Match['status'],
    competition: row.competition || '',
    venue: row.venue || '',
  };
}

// ============================================================
// Cache: simple in-memory cache with TTL to reduce DB calls
// ============================================================

const CACHE_TTL = 60_000; // 1 minute
const cache = new Map<string, { data: unknown; expires: number }>();

function getCached<T>(key: string): T | null {
  const entry = cache.get(key);
  if (entry && entry.expires > Date.now()) {
    return entry.data as T;
  }
  return null;
}

function setCached(key: string, data: unknown) {
  cache.set(key, { data, expires: Date.now() + CACHE_TTL });
}

// ============================================================
// Categories
// ============================================================

export async function getCategories(): Promise<Category[]> {
  const cached = getCached<Category[]>('categories');
  if (cached) return cached;

  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .order('priority', { ascending: false });

  if (error || !data) return [];

  const result = data.map(mapCategory);
  setCached('categories', result);
  return result;
}

export async function getCategoryBySlug(slug: string): Promise<Category | null> {
  const categories = await getCategories();
  return categories.find((c) => c.slug === slug) || null;
}

export async function getChildCategories(parentSlug: string): Promise<Category[]> {
  const categories = await getCategories();
  const parent = categories.find((c) => c.slug === parentSlug);
  if (!parent) return [];
  return categories.filter((c) => c.parentId === parent.id);
}

// ============================================================
// Authors
// ============================================================

export async function getAuthors(): Promise<Author[]> {
  const cached = getCached<Author[]>('authors');
  if (cached) return cached;

  const { data, error } = await supabase.from('authors').select('*');
  if (error || !data) return [];

  const result = data.map(mapAuthor);
  setCached('authors', result);
  return result;
}

// ============================================================
// Articles
// ============================================================

export async function getArticles(options: {
  limit?: number;
  categorySlug?: string;
  isBreaking?: boolean;
  isFeatured?: boolean;
  isTrending?: boolean;
  orderBy?: 'published_at' | 'views' | 'comments_count' | 'shares';
  offset?: number;
} = {}): Promise<Article[]> {
  const {
    limit = 25,
    categorySlug,
    isBreaking,
    isFeatured,
    isTrending,
    orderBy = 'published_at',
    offset = 0,
  } = options;

  let query = supabase
    .from('articles')
    .select('*, author:authors(*), source:sources(name)')
    .eq('status', 'published');

  if (categorySlug) {
    query = query.eq('category_slug', categorySlug);
  }
  if (isBreaking !== undefined) query = query.eq('is_breaking', isBreaking);
  if (isFeatured !== undefined) query = query.eq('is_featured', isFeatured);
  if (isTrending !== undefined) query = query.eq('is_trending', isTrending);

  query = query.order(orderBy, { ascending: false }).range(offset, offset + limit - 1);

  const { data, error } = await query;
  if (error || !data) return [];

  const categories = await getCategories();
  const catMap = new Map(categories.map((c) => [c.slug, c.name]));

  return data.map((row: ArticleRow & { author?: AuthorRow; source?: { name: string } | null }) =>
    mapArticle(
      row,
      row.author ? mapAuthor(row.author) : undefined,
      row.source?.name
    )
  ).map((article) => ({
    ...article,
    category: catMap.get(article.categorySlug) || article.categorySlug,
  }));
}

export async function getArticleBySlug(slug: string): Promise<Article | null> {
  const { data, error } = await supabase
    .from('articles')
    .select('*, author:authors(*), source:sources(name)')
    .eq('slug', slug)
    .eq('status', 'published')
    .maybeSingle();

  if (error || !data) return null;

  const categories = await getCategories();
  const catMap = new Map(categories.map((c) => [c.slug, c.name]));

  const article = mapArticle(
    data as ArticleRow & { author?: AuthorRow; source?: { name: string } | null },
    (data as { author?: AuthorRow }).author ? mapAuthor((data as { author?: AuthorRow }).author!) : undefined,
    (data as { source?: { name: string } | null }).source?.name
  );

  return {
    ...article,
    category: catMap.get(article.categorySlug) || article.categorySlug,
  };
}

export async function getArticleById(id: string): Promise<Article | null> {
  const { data, error } = await supabase
    .from('articles')
    .select('*, author:authors(*), source:sources(name)')
    .eq('id', id)
    .maybeSingle();

  if (error || !data) return null;

  const categories = await getCategories();
  const catMap = new Map(categories.map((c) => [c.slug, c.name]));

  const article = mapArticle(
    data as ArticleRow & { author?: AuthorRow; source?: { name: string } | null },
    (data as { author?: AuthorRow }).author ? mapAuthor((data as { author?: AuthorRow }).author!) : undefined,
    (data as { source?: { name: string } | null }).source?.name
  );

  return {
    ...article,
    category: catMap.get(article.categorySlug) || article.categorySlug,
  };
}

export async function getRelatedArticles(article: Article, limit = 4): Promise<Article[]> {
  const { data, error } = await supabase
    .from('articles')
    .select('*, author:authors(*), source:sources(name)')
    .eq('status', 'published')
    .eq('category_slug', article.categorySlug)
    .neq('id', article.id)
    .order('published_at', { ascending: false })
    .limit(limit);

  if (error || !data) return [];

  const categories = await getCategories();
  const catMap = new Map(categories.map((c) => [c.slug, c.name]));

  return data.map((row: ArticleRow & { author?: AuthorRow; source?: { name: string } | null }) => {
    const a = mapArticle(row, row.author ? mapAuthor(row.author) : undefined, row.source?.name);
    return { ...a, category: catMap.get(a.categorySlug) || a.categorySlug };
  });
}

export async function searchArticles(query: string): Promise<Article[]> {
  const { data, error } = await supabase
    .from('articles')
    .select('*, author:authors(*), source:sources(name)')
    .eq('status', 'published')
    .or(`title.ilike.%${query}%,summary.ilike.%${query}%`)
    .order('published_at', { ascending: false })
    .limit(50);

  if (error || !data) return [];

  const categories = await getCategories();
  const catMap = new Map(categories.map((c) => [c.slug, c.name]));

  return data.map((row: ArticleRow & { author?: AuthorRow; source?: { name: string } | null }) => {
    const a = mapArticle(row, row.author ? mapAuthor(row.author) : undefined, row.source?.name);
    return { ...a, category: catMap.get(a.categorySlug) || a.categorySlug };
  });
}

export async function incrementArticleViews(slug: string): Promise<void> {
  await supabase.rpc('increment_article_views', { article_slug: slug });
}

// ============================================================
// Comments
// ============================================================

export async function getCommentsByArticle(articleId: string): Promise<Comment[]> {
  const { data, error } = await supabase
    .from('comments')
    .select('*')
    .eq('article_id', articleId)
    .eq('is_approved', true)
    .order('created_at', { ascending: false });

  if (error || !data) return [];
  return data.map(mapComment);
}

export async function addComment(
  articleId: string,
  authorName: string,
  content: string
): Promise<Comment | null> {
  const { data, error } = await supabase
    .from('comments')
    .insert({
      article_id: articleId,
      author_name: authorName,
      author_avatar: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(authorName)}`,
      content,
      is_approved: true,
    })
    .select('*')
    .single();

  if (error || !data) return null;
  return mapComment(data as CommentRow);
}

// ============================================================
// Sources
// ============================================================

export async function getSources(): Promise<Source[]> {
  const { data, error } = await supabase
    .from('sources')
    .select('*')
    .order('priority', { ascending: false });

  if (error || !data) return [];
  return data.map(mapSource);
}

// ============================================================
// Teams & Matches
// ============================================================

export async function getTeams(): Promise<Team[]> {
  const cached = getCached<Team[]>('teams');
  if (cached) return cached;

  const { data, error } = await supabase
    .from('teams')
    .select('*')
    .order('points', { ascending: false });

  if (error || !data) return [];
  const result = data.map(mapTeam);
  setCached('teams', result);
  return result;
}

export async function getTeamBySlug(slug: string): Promise<Team | null> {
  const teams = await getTeams();
  return teams.find((t) => t.slug === slug) || null;
}

export async function getMatches(): Promise<Match[]> {
  const cached = getCached<Match[]>('matches');
  if (cached) return cached;

  const { data, error } = await supabase
    .from('matches')
    .select('*')
    .order('date', { ascending: true });

  if (error || !data) return [];
  const result = data.map(mapMatch);
  setCached('matches', result);
  return result;
}

// ============================================================
// Errors
// ============================================================

export async function getFetchErrors(): Promise<FetchErrorRow[]> {
  const { data, error } = await supabase
    .from('fetch_errors')
    .select('*, source:sources(name)')
    .order('timestamp', { ascending: false })
    .limit(50);

  if (error || !data) return [];
  return data as unknown as FetchErrorRow[];
}

// ============================================================
// Newsletter
// ============================================================

export async function subscribeNewsletter(email: string): Promise<boolean> {
  const { error } = await supabase
    .from('newsletter_subscribers')
    .insert({ email, is_active: true });

  return !error;
}
