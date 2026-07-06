import { createClient } from "npm:@supabase/supabase-js@2.58.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

interface SourceRow {
  id: string;
  name: string;
  url: string;
  type: string;
  category: string | null;
  priority: number;
  is_active: boolean;
  language: string;
  config: Record<string, unknown>;
  articles_fetched: number;
  errors_count: number;
}

interface RawArticle {
  title: string;
  content: string;
  url: string;
  image: string;
  published_at: string;
}

// Cache for API keys loaded from settings table
let settingsCache: Record<string, string> | null = null;

async function loadSettings(supabase: ReturnType<typeof createClient>): Promise<Record<string, string>> {
  if (settingsCache) return settingsCache;
  const { data } = await supabase.from("settings").select("key, value");
  settingsCache = Object.fromEntries((data || []).map((r: { key: string; value: string }) => [r.key, r.value]));
  return settingsCache;
}

async function getApiKey(
  supabase: ReturnType<typeof createClient>,
  envKey: string,
  configKey: string,
  config: Record<string, unknown>
): Promise<string | null> {
  if (config[configKey] as string) return config[configKey] as string;
  const settings = await loadSettings(supabase);
  return settings[envKey] || null;
}

function hashTitle(title: string): string {
  const normalized = title.toLowerCase().trim().replace(/\s+/g, " ");
  let hash = 0;
  for (let i = 0; i < normalized.length; i++) {
    const char = normalized.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return Math.abs(hash).toString(36);
}

// ============================================================
// RSS PARSER
// ============================================================

function parseRSS(xml: string): RawArticle[] {
  const articles: RawArticle[] = [];
  const itemRegex = /<item[\s\S]*?<\/item>/gi;
  const items = xml.match(itemRegex) || [];

  for (const item of items) {
    const getTag = (tag: string): string => {
      const match = item.match(new RegExp(`<${tag}[^>]*>([\\s\\S]*?)</${tag}>`, "i"));
      return match ? match[1].trim().replace(/<!\[CDATA\[|\]\]>/g, "") : "";
    };

    const title = getTag("title");
    const link = getTag("link");
    const description = getTag("description");
    const pubDate = getTag("pubDate");

    let image = "";
    const mediaMatch = item.match(/<media:content[^>]*url="([^"]+)"[^>]*>/i);
    if (mediaMatch) image = mediaMatch[1];
    if (!image) {
      const enclosureMatch = item.match(/<enclosure[^>]*url="([^"]+)"[^>]*>/i);
      if (enclosureMatch) image = enclosureMatch[1];
    }
    if (!image) {
      const contentMatch = description.match(/<img[^>]*src="([^"]+)"/i);
      if (contentMatch) image = contentMatch[1];
    }

    const textContent = description.replace(/<[^>]+>/g, "").trim();

    if (title && link) {
      articles.push({
        title,
        content: textContent,
        url: link,
        image,
        published_at: pubDate ? new Date(pubDate).toISOString() : new Date().toISOString(),
      });
    }
  }

  return articles;
}

// ============================================================
// FETCHERS - each accepts apiKey as parameter
// ============================================================

async function fetchRSS(url: string): Promise<RawArticle[]> {
  const response = await fetch(url, {
    headers: { "User-Agent": "NoticiasPro/1.0" },
    signal: AbortSignal.timeout(10000),
  });
  if (!response.ok) throw new Error(`RSS fetch failed: ${response.status}`);
  const xml = await response.text();
  return parseRSS(xml);
}

async function fetchNewsAPI(url: string, config: Record<string, unknown>, apiKey: string): Promise<RawArticle[]> {
  if (!apiKey) throw new Error("NewsAPI key not configured");
  const params = new URLSearchParams({
    apiKey,
    country: (config.country as string) || "es",
    pageSize: "50",
  });
  const response = await fetch(`${url}?${params}`, { signal: AbortSignal.timeout(10000) });
  if (!response.ok) throw new Error(`NewsAPI fetch failed: ${response.status}`);
  const data = await response.json();
  return (data.articles || []).map((a: Record<string, unknown>) => ({
    title: a.title as string,
    content: (a.description as string) || "",
    url: a.url as string,
    image: (a.urlToImage as string) || "",
    published_at: (a.publishedAt as string) || new Date().toISOString(),
  }));
}

async function fetchGNews(url: string, config: Record<string, unknown>, apiKey: string): Promise<RawArticle[]> {
  if (!apiKey) throw new Error("GNews key not configured");
  const params = new URLSearchParams({
    apikey: apiKey,
    country: (config.country as string) || "es",
    max: "50",
  });
  const response = await fetch(`${url}?${params}`, { signal: AbortSignal.timeout(10000) });
  if (!response.ok) throw new Error(`GNews fetch failed: ${response.status}`);
  const data = await response.json();
  return (data.articles || []).map((a: Record<string, unknown>) => ({
    title: a.title as string,
    content: (a.description as string) || "",
    url: a.url as string,
    image: (a.image as string) || "",
    published_at: (a.publishedAt as string) || new Date().toISOString(),
  }));
}

async function fetchTheNewsAPI(url: string, config: Record<string, unknown>, apiKey: string): Promise<RawArticle[]> {
  if (!apiKey) throw new Error("TheNewsAPI key not configured");
  const params = new URLSearchParams({
    api_token: apiKey,
    language: (config.language as string) || "es",
    limit: "50",
  });
  const response = await fetch(`${url}?${params}`, { signal: AbortSignal.timeout(10000) });
  if (!response.ok) throw new Error(`TheNewsAPI fetch failed: ${response.status}`);
  const data = await response.json();
  return (data.data || []).map((a: Record<string, unknown>) => ({
    title: a.title as string,
    content: (a.description as string) || "",
    url: a.url as string,
    image: (a.image as string) || "",
    published_at: (a.published_at as string) || new Date().toISOString(),
  }));
}

async function fetchMediastack(url: string, config: Record<string, unknown>, apiKey: string): Promise<RawArticle[]> {
  if (!apiKey) throw new Error("Mediastack key not configured");
  const params = new URLSearchParams({
    access_key: apiKey,
    countries: (config.countries as string) || "es",
    limit: "50",
  });
  const response = await fetch(`${url}?${params}`, { signal: AbortSignal.timeout(10000) });
  if (!response.ok) throw new Error(`Mediastack fetch failed: ${response.status}`);
  const data = await response.json();
  return (data.data || []).map((a: Record<string, unknown>) => ({
    title: a.title as string,
    content: (a.description as string) || "",
    url: a.url as string,
    image: (a.image as string) || "",
    published_at: (a.published_at as string) || new Date().toISOString(),
  }));
}

async function fetchCurrents(url: string, config: Record<string, unknown>, apiKey: string): Promise<RawArticle[]> {
  if (!apiKey) throw new Error("Currents API key not configured");
  const params = new URLSearchParams({
    api_key: apiKey,
    language: (config.language as string) || "es",
  });
  const response = await fetch(`${url}?${params}`, { signal: AbortSignal.timeout(10000) });
  if (!response.ok) throw new Error(`Currents fetch failed: ${response.status}`);
  const data = await response.json();
  return (data.news || []).map((a: Record<string, unknown>) => ({
    title: a.title as string,
    content: (a.description as string) || "",
    url: a.url as string,
    image: (a.image as string) || "",
    published_at: (a.published as string) || new Date().toISOString(),
  }));
}

async function fetchGuardian(url: string, config: Record<string, unknown>, apiKey: string): Promise<RawArticle[]> {
  if (!apiKey) throw new Error("Guardian key not configured");
  const params = new URLSearchParams({
    "api-key": apiKey,
    "show-fields": "thumbnail,trailText",
    "page-size": "50",
  });
  const response = await fetch(`${url}/search?${params}`, { signal: AbortSignal.timeout(10000) });
  if (!response.ok) throw new Error(`Guardian fetch failed: ${response.status}`);
  const data = await response.json();
  return (data.response?.results || []).map((a: Record<string, unknown>) => ({
    title: a.webTitle as string,
    content: ((a.fields as Record<string, unknown>)?.trailText as string) || "",
    url: a.webUrl as string,
    image: ((a.fields as Record<string, unknown>)?.thumbnail as string) || "",
    published_at: (a.webPublicationDate as string) || new Date().toISOString(),
  }));
}

async function fetchNYT(url: string, config: Record<string, unknown>, apiKey: string): Promise<RawArticle[]> {
  if (!apiKey) throw new Error("NYT key not configured");
  const params = new URLSearchParams({ "api-key": apiKey });
  const response = await fetch(`${url}?${params}`, { signal: AbortSignal.timeout(10000) });
  if (!response.ok) throw new Error(`NYT fetch failed: ${response.status}`);
  const data = await response.json();
  return (data.results || []).map((a: Record<string, unknown>) => ({
    title: a.title as string,
    content: (a.abstract as string) || "",
    url: a.url as string,
    image: ((a.multimedia as Array<Record<string, unknown>>)?.[0]?.url as string) || "",
    published_at: (a.published_date as string) || new Date().toISOString(),
  }));
}

async function fetchBingNews(url: string, config: Record<string, unknown>, apiKey: string): Promise<RawArticle[]> {
  if (!apiKey) throw new Error("Bing News key not configured");
  const params = new URLSearchParams({
    q: (config.query as string) || "noticias",
    mkt: (config.mkt as string) || "es-ES",
    count: "50",
  });
  const response = await fetch(`${url}?${params}`, {
    headers: { "Ocp-Apim-Subscription-Key": apiKey },
    signal: AbortSignal.timeout(10000),
  });
  if (!response.ok) throw new Error(`Bing News fetch failed: ${response.status}`);
  const data = await response.json();
  return (data.value || []).map((a: Record<string, unknown>) => ({
    title: a.name as string,
    content: (a.description as string) || "",
    url: a.url as string,
    image: ((a.image as Record<string, unknown>)?.contentUrl as string) || "",
    published_at: (a.datePublished as string) || new Date().toISOString(),
  }));
}

async function fetchFromSource(source: SourceRow, supabase: ReturnType<typeof createClient>): Promise<RawArticle[]> {
  switch (source.type) {
    case "rss":
      return fetchRSS(source.url);
    case "newsapi":
      return fetchNewsAPI(source.url, source.config, await getApiKey(supabase, "NEWSAPI_KEY", "apiKey", source.config));
    case "gnews":
      return fetchGNews(source.url, source.config, await getApiKey(supabase, "GNEWS_KEY", "apiKey", source.config));
    case "thenewsapi":
      return fetchTheNewsAPI(source.url, source.config, await getApiKey(supabase, "THENEWSAPI_KEY", "api_token", source.config));
    case "mediastack":
      return fetchMediastack(source.url, source.config, await getApiKey(supabase, "MEDIASTACK_KEY", "access_key", source.config));
    case "currents":
      return fetchCurrents(source.url, source.config, await getApiKey(supabase, "CURRENTS_KEY", "api_key", source.config));
    case "guardian":
      return fetchGuardian(source.url, source.config, await getApiKey(supabase, "GUARDIAN_KEY", "api-key", source.config));
    case "nyt":
      return fetchNYT(source.url, source.config, await getApiKey(supabase, "NYT_KEY", "api-key", source.config));
    case "bing":
      return fetchBingNews(source.url, source.config, await getApiKey(supabase, "BING_NEWS_KEY", "apiKey", source.config));
    case "google":
      return fetchRSS(source.url);
    case "custom":
      return fetchRSS(source.url);
    default:
      throw new Error(`Unknown source type: ${source.type}`);
  }
}

// ============================================================
// BATCH PROCESSING
// ============================================================

async function processSource(
  source: SourceRow,
  supabase: ReturnType<typeof createClient>
): Promise<{ source: string; fetched: number; duplicates: number; error?: string }> {
  try {
    const articles = await fetchFromSource(source, supabase);
    let fetched = 0;
    let duplicates = 0;

    const hashes = articles.map((a) => hashTitle(a.title));

    const { data: existingRaw } = await supabase
      .from("raw_articles")
      .select("title_hash")
      .in("title_hash", hashes);
    const existingRawSet = new Set((existingRaw || []).map((r: { title_hash: string }) => r.title_hash));

    const { data: existingPub } = await supabase
      .from("articles")
      .select("source_title_hash")
      .in("source_title_hash", hashes);
    const existingPubSet = new Set((existingPub || []).map((r: { source_title_hash: string }) => r.source_title_hash));

    const toInsert: Array<Record<string, unknown>> = [];
    for (const article of articles) {
      const titleHash = hashTitle(article.title);
      if (existingRawSet.has(titleHash) || existingPubSet.has(titleHash)) {
        duplicates++;
        continue;
      }
      toInsert.push({
        source_id: source.id,
        title: article.title,
        content: article.content,
        url: article.url,
        image: article.image,
        published_at: article.published_at,
        fetched_at: new Date().toISOString(),
        status: "pending",
        title_hash: titleHash,
      });
    }

    if (toInsert.length > 0) {
      const { error: insertError } = await supabase.from("raw_articles").insert(toInsert);
      if (insertError) {
        console.error(`Error inserting articles from ${source.name}: ${insertError.message}`);
      } else {
        fetched = toInsert.length;
      }
    }

    await supabase
      .from("sources")
      .update({
        last_fetched_at: new Date().toISOString(),
        articles_fetched: source.articles_fetched + fetched,
        updated_at: new Date().toISOString(),
      })
      .eq("id", source.id);

    return { source: source.name, fetched, duplicates };
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : String(err);

    await supabase.from("fetch_errors").insert({
      source_id: source.id,
      type: "fetch_error",
      message: errorMessage,
      severity: "error",
    });

    await supabase
      .from("sources")
      .update({
        errors_count: source.errors_count + 1,
        updated_at: new Date().toISOString(),
      })
      .eq("id", source.id);

    return { source: source.name, fetched: 0, duplicates: 0, error: errorMessage };
  }
}

// ============================================================
// MAIN HANDLER
// ============================================================

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    const { data: sources, error: sourcesError } = await supabase
      .from("sources")
      .select("*")
      .eq("is_active", true)
      .order("priority", { ascending: false });

    if (sourcesError) throw sourcesError;

    let totalFetched = 0;
    let totalDuplicates = 0;
    let totalErrors = 0;
    const results: Array<{ source: string; fetched: number; duplicates: number; error?: string }> = [];

    const BATCH_SIZE = 8;
    const sourceList = (sources || []) as SourceRow[];

    for (let i = 0; i < sourceList.length; i += BATCH_SIZE) {
      const batch = sourceList.slice(i, i + BATCH_SIZE);
      const batchResults = await Promise.all(
        batch.map((source) => processSource(source, supabase))
      );

      for (const result of batchResults) {
        results.push(result);
        totalFetched += result.fetched;
        totalDuplicates += result.duplicates;
        if (result.error) totalErrors++;
      }
    }

    return new Response(
      JSON.stringify({
        success: true,
        sourcesProcessed: (sources || []).length,
        totalFetched,
        totalDuplicates,
        totalErrors,
        results,
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (err) {
    return new Response(
      JSON.stringify({ error: err instanceof Error ? err.message : String(err) }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
