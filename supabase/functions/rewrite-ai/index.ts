import { createClient } from "npm:@supabase/supabase-js@2.58.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

interface RawArticleRow {
  id: string;
  source_id: string;
  title: string;
  content: string;
  url: string;
  image: string;
  published_at: string;
  title_hash: string;
}

interface SourceRow {
  id: string;
  name: string;
  language: string;
}

interface CategoryRow {
  id: string;
  slug: string;
  name: string;
}

// Cache for settings
let settingsCache: Record<string, string> | null = null;

async function loadSettings(supabase: ReturnType<typeof createClient>): Promise<Record<string, string>> {
  if (settingsCache) return settingsCache;
  const { data } = await supabase.from("settings").select("key, value");
  settingsCache = Object.fromEntries((data || []).map((r: { key: string; value: string }) => [r.key, r.value]));
  return settingsCache;
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .slice(0, 80);
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

function detectCategory(title: string, content: string, categories: CategoryRow[]): string {
  const text = `${title} ${content}`.toLowerCase();
  const keywords: Record<string, string[]> = {
    "real-madrid": ["real madrid", "madrid", "bernabeu", "ancelotti", "vinicius", "bellingham"],
    "barcelona": ["barcelona", "fc barcelona", "camp nou", "xavi", "laporta", "lewandowski"],
    "atletico-madrid": ["atletico", "atletico de madrid", "metropolitano", "simeone", "griezmann"],
    "seleccion-espanola": ["seleccion espanola", "la roja", "de la fuente"],
    "laliga": ["laliga", "la liga", "ea sports", "primera division"],
    "premier-league": ["premier league", "premier", "manchester city", "liverpool", "arsenal", "chelsea"],
    "champions-league": ["champions league", "champions", "uefa champions"],
    "europa-league": ["europa league", "uefa europa"],
    "mercado-fichajes": ["fichaje", "fichajes", "mercado", "transfer", "traspaso"],
    "ia": ["inteligencia artificial", "openai", "gpt", "chatgpt", "gemini", "claude"],
    "apple": ["apple", "iphone", "ipad", "mac", "ios", "tim cook"],
    "android": ["android", "google pixel", "samsung galaxy", "xiaomi"],
    "tecnologia": ["tecnologia", "tech", "software", "hardware", "internet", "app"],
    "nba": ["nba", "baloncesto", "basketball", "lakers", "celtics", "warriors"],
    "tenis": ["tenis", "tennis", "atp", "wta", "grand slam", "nadal", "alcaraz"],
    "motogp": ["motogp", "moto gp", "motociclismo", "marquez", "bagnaia"],
    "formula-1": ["formula 1", "f1", "gran premio", "hamilton", "verstappen", "ferrari"],
    "economia": ["economia", "ibex", "bolsa", "mercados", "inflacion", "pib"],
    "negocios": ["negocios", "empresa", "startup", "financiacion", "inversion"],
    "salud": ["salud", "medicina", "hospital", "enfermedad", "tratamiento", "vacuna"],
    "ciencia": ["ciencia", "espacio", "telescopio", "investigacion", "universo", "nasa"],
    "viajes": ["viajes", "turismo", "vacaciones", "destino", "playa", "hotel"],
    "streaming": ["streaming", "netflix", "hbo", "disney+", "prime video"],
    "series": ["serie", "series", "temporada", "capitulo", "estreno"],
    "peliculas": ["pelicula", "peliculas", "cine", "taquilla"],
    "videojuegos": ["videojuego", "videojuegos", "gaming", "playstation", "xbox", "nintendo"],
    "internacional": ["internacional", "mundo", "cumbre", "lideres", "guerra", "acuerdo"],
    "espana": ["espana", "gobierno", "congreso", "moncloa", "sanchez"],
    "entretenimiento": ["entretenimiento", "celebridad", "famoso", "cine"],
  };

  const scores: Record<string, number> = {};
  for (const [cat, kws] of Object.entries(keywords)) {
    scores[cat] = 0;
    for (const kw of kws) {
      if (text.includes(kw)) scores[cat] += kw.split(" ").length;
    }
  }

  const sorted = Object.entries(scores).sort((a, b) => b[1] - a[1]);
  if (sorted[0][1] === 0) return "general";

  const exists = categories.find((c) => c.slug === sorted[0][0]);
  return exists ? sorted[0][0] : "general";
}

// ============================================================
// GEMINI AI REWRITING
// ============================================================

async function callGemini(
  apiKey: string,
  systemPrompt: string,
  userPrompt: string,
  temperature: number = 0.7
): Promise<string | null> {
  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          system_instruction: { parts: [{ text: systemPrompt }] },
          contents: [{ parts: [{ text: userPrompt }] }],
          generationConfig: {
            temperature,
            maxOutputTokens: 2000,
          },
        }),
        signal: AbortSignal.timeout(25000),
      }
    );

    if (!response.ok) {
      console.error(`Gemini API error: ${response.status}`);
      return null;
    }

    const data = await response.json();
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
    return text || null;
  } catch (err) {
    console.error("Gemini call failed:", err);
    return null;
  }
}

async function rewriteWithAI(
  title: string,
  content: string,
  category: string,
  geminiKey: string
): Promise<{
  title: string;
  subtitle: string;
  summary: string;
  content: string;
  excerpt: string;
  metaDescription: string;
  tags: string[];
  imageAlt: string;
  readingTime: number;
}> {
  if (geminiKey) {
    const systemPrompt = "Eres un periodista profesional español. Reescribe la siguiente noticia de forma original, manteniendo la información pero con un estilo propio. Devuelve SOLO un JSON válido (sin markdown, sin bloques de codigo) con estos campos: title, subtitle, summary, content (HTML con etiquetas <p> y <h2>), excerpt, metaDescription (max 160 caracteres), tags (array de 5 strings), imageAlt. El contenido debe estar en español.";
    const userPrompt = `Categoria: ${category}\n\nTitulo original: ${title}\n\nContenido original: ${content}`;

    const result = await callGemini(geminiKey, systemPrompt, userPrompt, 0.7);

    if (result) {
      // Extract JSON from the response (handle potential markdown wrapping)
      const jsonMatch = result.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        try {
          const parsed = JSON.parse(jsonMatch[0]);
          return {
            title: parsed.title || title,
            subtitle: parsed.subtitle || "",
            summary: parsed.summary || "",
            content: parsed.content || `<p>${content}</p>`,
            excerpt: parsed.excerpt || "",
            metaDescription: parsed.metaDescription || "",
            tags: parsed.tags || [],
            imageAlt: parsed.imageAlt || title,
            readingTime: Math.max(2, Math.ceil((parsed.content || content).length / 1000)),
          };
        } catch (e) {
          console.error("Failed to parse Gemini JSON:", e);
        }
      }
    }
  }

  // Template-based rewrite (fallback)
  const rewrittenTitle = title.length > 80 ? title.slice(0, 77) + "..." : title;
  const summary = content.slice(0, 200).replace(/<[^>]+>/g, "").trim() + "...";
  const excerpt = summary.slice(0, 150) + (summary.length > 150 ? "..." : "");
  const metaDescription = summary.slice(0, 157) + (summary.length > 157 ? "..." : "");

  const paragraphs = content
    .replace(/<[^>]+>/g, "")
    .split(/\n+/)
    .filter((p) => p.trim().length > 20)
    .slice(0, 5)
    .map((p) => `<p>${p.trim()}</p>`)
    .join("\n");

  const htmlContent = `<p>${summary}</p>\n${paragraphs}`;

  const words = title.toLowerCase().replace(/[^a-záéíóúñ\s]/g, "").split(/\s+/).filter((w) => w.length > 4);
  const tags = [...new Set(words)].slice(0, 5);

  return {
    title: rewrittenTitle,
    subtitle: summary.slice(0, 120),
    summary,
    content: htmlContent,
    excerpt,
    metaDescription,
    tags,
    imageAlt: title,
    readingTime: Math.max(2, Math.ceil(content.length / 1000)),
  };
}

async function translateToSpanish(text: string, sourceLang: string, geminiKey: string): Promise<string> {
  if (sourceLang === "es" || !sourceLang) return text;

  if (geminiKey) {
    const systemPrompt = "Traduce el siguiente texto al español. Devuelve solo la traduccion, sin explicaciones ni comentarios.";
    const result = await callGemini(geminiKey, systemPrompt, text, 0.3);
    if (result) return result.trim();
  }

  return text;
}

async function processRawArticle(
  raw: RawArticleRow,
  supabase: ReturnType<typeof createClient>,
  categories: CategoryRow[],
  authorId: string | null,
  geminiKey: string
): Promise<'published' | 'duplicate' | 'failed'> {
  await supabase
    .from("raw_articles")
    .update({ status: "processing" })
    .eq("id", raw.id);

  try {
    const { data: source } = await supabase
      .from("sources")
      .select("name, language")
      .eq("id", raw.source_id)
      .maybeSingle();

    const sourceLang = (source as SourceRow | null)?.language || "es";

    let title = raw.title;
    let content = raw.content;
    if (sourceLang !== "es") {
      title = await translateToSpanish(raw.title, sourceLang, geminiKey);
      content = await translateToSpanish(raw.content, sourceLang, geminiKey);
    }

    const categorySlug = detectCategory(title, content, categories);
    const category = categories.find((c) => c.slug === categorySlug);

    const rewritten = await rewriteWithAI(title, content, categorySlug, geminiKey);

    let slug = slugify(rewritten.title);
    let slugSuffix = 1;
    const { data: existingSlug } = await supabase
      .from("articles")
      .select("id")
      .eq("slug", slug)
      .maybeSingle();
    while (existingSlug) {
      slug = `${slugify(rewritten.title)}-${slugSuffix}`;
      slugSuffix++;
      const { data: check } = await supabase
        .from("articles")
        .select("id")
        .eq("slug", slug)
        .maybeSingle();
      if (!check) break;
    }

    const { error: insertError } = await supabase
      .from("articles")
      .insert({
        slug,
        title: rewritten.title,
        subtitle: rewritten.subtitle,
        summary: rewritten.summary,
        content: rewritten.content,
        excerpt: rewritten.excerpt,
        meta_description: rewritten.metaDescription,
        image: raw.image,
        image_alt: rewritten.imageAlt,
        category_id: category?.id || null,
        category_slug: categorySlug,
        tags: rewritten.tags,
        author_id: authorId,
        published_at: raw.published_at || new Date().toISOString(),
        reading_time: rewritten.readingTime,
        views: 0,
        comments_count: 0,
        shares: 0,
        is_breaking: false,
        is_featured: false,
        is_trending: false,
        status: "published",
        source_id: raw.source_id,
        source_url: raw.url,
        source_title_hash: raw.title_hash,
        ai_rewritten: true,
        original_language: sourceLang,
      });

    if (insertError) {
      if (insertError.code === "23505") {
        await supabase
          .from("raw_articles")
          .update({ status: "duplicate", processed_at: new Date().toISOString() })
          .eq("id", raw.id);
        return 'duplicate';
      }
      throw insertError;
    }

    await supabase
      .from("raw_articles")
      .update({ status: "published", processed_at: new Date().toISOString() })
      .eq("id", raw.id);
    return 'published';
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : String(err);

    await supabase
      .from("raw_articles")
      .update({
        status: "failed",
        processed_at: new Date().toISOString(),
        error_message: errorMessage,
      })
      .eq("id", raw.id);

    await supabase.from("fetch_errors").insert({
      source_id: raw.source_id,
      type: "processing_error",
      message: `Error processing article "${raw.title}": ${errorMessage}`,
      severity: "warning",
    });

    return 'failed';
  }
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    const settings = await loadSettings(supabase);
    const geminiKey = settings["GEMINI_API_KEY"] || "";

    const { data: categories } = await supabase
      .from("categories")
      .select("id, slug, name");

    const { data: rawArticles, error } = await supabase
      .from("raw_articles")
      .select("*")
      .eq("status", "pending")
      .order("fetched_at", { ascending: false })
      .limit(20);

    if (error) throw error;

    const { data: author } = await supabase
      .from("authors")
      .select("id")
      .limit(1)
      .maybeSingle();
    const authorId = (author as { id: string } | null)?.id || null;

    let published = 0;
    let duplicates = 0;
    let failed = 0;

    const BATCH_SIZE = 5;
    const articleList = (rawArticles || []) as RawArticleRow[];

    for (let i = 0; i < articleList.length; i += BATCH_SIZE) {
      const batch = articleList.slice(i, i + BATCH_SIZE);
      const results = await Promise.all(
        batch.map((raw) => processRawArticle(raw, supabase, (categories || []) as CategoryRow[], authorId, geminiKey))
      );

      for (const result of results) {
        if (result === 'published') published++;
        else if (result === 'duplicate') duplicates++;
        else failed++;
      }
    }

    return new Response(
      JSON.stringify({
        success: true,
        processed: articleList.length,
        published,
        duplicates,
        failed,
        aiPowered: !!geminiKey,
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
