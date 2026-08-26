interface PagesContext<T = Record<string, any>> {
  request: Request;
  env: T;
  next: () => Promise<Response>;
}

interface Env {
  ASSETS?: {
    fetch: (request: Request | string) => Promise<Response>;
  };
}

export const onRequestGet = async (context: PagesContext<Env>): Promise<Response> => {
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
      // fallback below
    }
  }

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml">
  
  <!-- Annual Examination Results Portal -->
  <url>
    <loc>https://jamia-islamia-abbottabad.pages.dev/?tab=results</loc>
    <lastmod>2026-08-23</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
    <xhtml:link rel="alternate" hreflang="ur" href="https://jamia-islamia-abbottabad.pages.dev/?tab=results" />
    <xhtml:link rel="alternate" hreflang="en" href="https://jamia-islamia-abbottabad.pages.dev/?tab=results&amp;lang=en" />
    <xhtml:link rel="alternate" hreflang="ar" href="https://jamia-islamia-abbottabad.pages.dev/?tab=results&amp;lang=ar" />
  </url>

  <!-- Roll Number Examination Verification -->
  <url>
    <loc>https://jamia-islamia-abbottabad.pages.dev/?tab=results</loc>
    <lastmod>2026-08-23</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.9</priority>
  </url>

  <!-- Wifaqul Madaris Certificate Verification -->
  <url>
    <loc>https://jamia-islamia-abbottabad.pages.dev/?tab=results</loc>
    <lastmod>2026-08-23</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>

</urlset>`;

  return new Response(xml.trim(), {
    status: 200,
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'X-Robots-Tag': 'all',
      'Access-Control-Allow-Origin': '*',
      'Cache-Control': 'public, max-age=0, must-revalidate',
    },
  });
};
