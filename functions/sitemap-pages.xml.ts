interface PagesContext<T = Record<string, any>> {
  request: Request;
  env: T;
  next: () => Promise<Response>;
}

interface Env {
  ASSETS?: {
    fetch: (request: Request | string) => Promise<Response>;
  };
  DB?: any;
  JAMIA_DB?: any;
}

export const onRequestGet = async (context: PagesContext<Env>): Promise<Response> => {
  const d1 = context.env?.DB || context.env?.JAMIA_DB;

  // Attempt dynamic generation from Cloudflare D1 if available
  if (d1) {
    try {
      const { results } = await d1.prepare(
        "SELECT slug, updated_at FROM cms_pages WHERE status = 'published' AND visibility = 'public' ORDER BY order_index ASC"
      ).all();

      if (results && results.length > 0) {
        let urls = '';
        for (const row of results) {
          const lastmod = (row.updated_at || '2026-08-30').split('T')[0];
          urls += `  <url>
    <loc>https://jamia-islamia-abbottabad.pages.dev/#page-${row.slug}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.80</priority>
  </url>\n`;
        }

        const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <!-- Jamia Islamia Abbottabad - CMS Published Dynamic Pages -->
${urls}</urlset>`;

        return new Response(xml.trim(), {
          status: 200,
          headers: {
            'Content-Type': 'application/xml; charset=utf-8',
            'X-Robots-Tag': 'all',
            'Access-Control-Allow-Origin': '*',
            'Cache-Control': 'public, max-age=3600, must-revalidate',
          },
        });
      }
    } catch {
      // Fallback to static asset or default xml
    }
  }

  // Fallback to ASSETS fetch
  if (context.env?.ASSETS) {
    try {
      const assetRes = await context.env.ASSETS.fetch(context.request);
      if (assetRes.ok) {
        const headers = new Headers(assetRes.headers);
        headers.set('Content-Type', 'application/xml; charset=utf-8');
        headers.set('X-Robots-Tag', 'all');
        headers.set('Access-Control-Allow-Origin', '*');
        headers.set('Cache-Control', 'public, max-age=0, must-revalidate');
        return new Response(assetRes.body, {
          status: 200,
          headers,
        });
      }
    } catch {
      // Fallback below
    }
  }

  const defaultXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <!-- Jamia Islamia Abbottabad - CMS Published Dynamic Pages -->
  <url>
    <loc>https://jamia-islamia-abbottabad.pages.dev/#page-about-jamia</loc>
    <lastmod>2026-08-30</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.80</priority>
  </url>
  <url>
    <loc>https://jamia-islamia-abbottabad.pages.dev/#page-sharia-rules</loc>
    <lastmod>2026-08-30</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.80</priority>
  </url>
  <url>
    <loc>https://jamia-islamia-abbottabad.pages.dev/#page-admissions</loc>
    <lastmod>2026-08-30</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.80</priority>
  </url>
</urlset>`;

  return new Response(defaultXml.trim(), {
    status: 200,
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'X-Robots-Tag': 'all',
      'Access-Control-Allow-Origin': '*',
      'Cache-Control': 'public, max-age=0, must-revalidate',
    },
  });
};
