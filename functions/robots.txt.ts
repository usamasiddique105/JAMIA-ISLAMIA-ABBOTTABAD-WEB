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
        headers.set('Content-Type', 'text/plain; charset=utf-8');
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

  const robotsTxt = `User-agent: *
Allow: /

Sitemap: https://jamia-islamia-abbottabad.pages.dev/sitemap.xml
Sitemap: https://jamia-islamia-abbottabad.pages.dev/sitemap-darulifta.xml
Sitemap: https://jamia-islamia-abbottabad.pages.dev/sitemap-quran.xml
Sitemap: https://jamia-islamia-abbottabad.pages.dev/sitemap-dars-nizami.xml
Sitemap: https://jamia-islamia-abbottabad.pages.dev/sitemap-results.xml
Sitemap: https://jamia-islamia-abbottabad.pages.dev/sitemap-donations.xml
`;

  return new Response(robotsTxt.trim(), {
    status: 200,
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Access-Control-Allow-Origin': '*',
      'Cache-Control': 'public, max-age=0, must-revalidate',
    },
  });
};
