import { getArticles } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET() {
  const baseUrl = 'https://noticiaspro.com';
  const articles = await getArticles({ limit: 50, orderBy: 'published_at' });

  const items = articles
    .map(
      (article) => `
    <item>
      <title><![CDATA[${article.title}]]></title>
      <link>${baseUrl}/noticia/${article.slug}</link>
      <guid>${baseUrl}/noticia/${article.slug}</guid>
      <pubDate>${new Date(article.publishedAt).toUTCString()}</pubDate>
      <description><![CDATA[${article.summary}]]></description>
      <category>${article.category}</category>
      <author>${article.author.name}</author>
      <enclosure url="${article.image}" type="image/jpeg" />
    </item>`
    )
    .join('');

  const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>NoticiasPro — Últimas noticias</title>
    <link>${baseUrl}</link>
    <description>Tu periódico digital de referencia. Última hora, deportes, fútbol, tecnología, IA, economía y más.</description>
    <language>es-ES</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${baseUrl}/feed.xml" rel="self" type="application/rss+xml" />
    ${items}
  </channel>
</rss>`;

  return new Response(rss, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, s-maxage=3600',
    },
  });
}
