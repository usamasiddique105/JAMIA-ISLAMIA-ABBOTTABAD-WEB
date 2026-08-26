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

  const sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml">
  
  <!-- Home Page -->
  <url>
    <loc>https://jamia-islamia-abbottabad.pages.dev/</loc>
    <lastmod>2026-08-25</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
    <xhtml:link rel="alternate" hreflang="ur" href="https://jamia-islamia-abbottabad.pages.dev/?lang=ur" />
    <xhtml:link rel="alternate" hreflang="en" href="https://jamia-islamia-abbottabad.pages.dev/?lang=en" />
    <xhtml:link rel="alternate" hreflang="ar" href="https://jamia-islamia-abbottabad.pages.dev/?lang=ar" />
  </url>

  <!-- Darul Ifta and Fatwa Portal -->
  <url>
    <loc>https://jamia-islamia-abbottabad.pages.dev/?tab=fatwa</loc>
    <lastmod>2026-08-25</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.95</priority>
    <xhtml:link rel="alternate" hreflang="ur" href="https://jamia-islamia-abbottabad.pages.dev/?tab=fatwa" />
    <xhtml:link rel="alternate" hreflang="en" href="https://jamia-islamia-abbottabad.pages.dev/?tab=fatwa&amp;lang=en" />
    <xhtml:link rel="alternate" hreflang="ar" href="https://jamia-islamia-abbottabad.pages.dev/?tab=fatwa&amp;lang=ar" />
  </url>

  <!-- Online Fatwa Submission -->
  <url>
    <loc>https://jamia-islamia-abbottabad.pages.dev/?tab=fatwa-ask</loc>
    <lastmod>2026-08-25</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.90</priority>
  </url>

  <!-- Masnoon Duas and Azkar -->
  <url>
    <loc>https://jamia-islamia-abbottabad.pages.dev/?tab=fatwa-duas</loc>
    <lastmod>2026-08-25</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.85</priority>
  </url>

  <!-- Islamic Names Directory -->
  <url>
    <loc>https://jamia-islamia-abbottabad.pages.dev/?tab=fatwa-names</loc>
    <lastmod>2026-08-25</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.85</priority>
  </url>

  <!-- Digital Library and Publications -->
  <url>
    <loc>https://jamia-islamia-abbottabad.pages.dev/?tab=library</loc>
    <lastmod>2026-08-25</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.90</priority>
  </url>

  <!-- Examination Results Checker -->
  <url>
    <loc>https://jamia-islamia-abbottabad.pages.dev/?tab=results</loc>
    <lastmod>2026-08-25</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.90</priority>
  </url>

  <!-- Online Admissions and Academic Departments -->
  <url>
    <loc>https://jamia-islamia-abbottabad.pages.dev/?tab=admissions</loc>
    <lastmod>2026-08-25</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.90</priority>
  </url>

  <!-- Online Dars-e-Nizami and Quran Academy -->
  <url>
    <loc>https://jamia-islamia-abbottabad.pages.dev/?tab=dars-nizami</loc>
    <lastmod>2026-08-25</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.90</priority>
  </url>

  <!-- Online Donations and Zakat Portal -->
  <url>
    <loc>https://jamia-islamia-abbottabad.pages.dev/?tab=donations</loc>
    <lastmod>2026-08-25</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.90</priority>
  </url>

  <!-- About Jamia Islamia Abbottabad -->
  <url>
    <loc>https://jamia-islamia-abbottabad.pages.dev/?tab=about</loc>
    <lastmod>2026-08-25</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.85</priority>
  </url>

  <!-- Contact and Location -->
  <url>
    <loc>https://jamia-islamia-abbottabad.pages.dev/?tab=contact</loc>
    <lastmod>2026-08-25</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.80</priority>
  </url>

</urlset>`;

  return new Response(sitemapXml.trim(), {
    status: 200,
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'X-Robots-Tag': 'all',
      'Access-Control-Allow-Origin': '*',
      'Cache-Control': 'public, max-age=0, must-revalidate',
    },
  });
};
