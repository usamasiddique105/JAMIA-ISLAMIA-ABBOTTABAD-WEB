import fs from 'fs';
import path from 'path';

// Setup minimal browser-like environment for SSR pre-rendering
if (typeof globalThis.window === 'undefined') {
  const localStorageMock = (() => {
    let store = {};
    return {
      getItem: (key) => store[key] || null,
      setItem: (key, value) => { store[key] = String(value); },
      removeItem: (key) => { delete store[key]; },
      clear: () => { store = {}; }
    };
  })();

  globalThis.localStorage = localStorageMock;
  global.localStorage = localStorageMock;

  globalThis.window = {
    location: {
      href: 'https://jamia-islamia-abbottabad.pages.dev/',
      origin: 'https://jamia-islamia-abbottabad.pages.dev',
      pathname: '/',
      search: '',
      hash: '',
    },
    localStorage: localStorageMock,
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => true,
    matchMedia: () => ({ matches: false, addListener: () => {}, removeListener: () => {} }),
    scrollTo: () => {},
  };
  global.window = globalThis.window;

  if (typeof globalThis.CustomEvent === 'undefined') {
    globalThis.CustomEvent = class CustomEvent {
      constructor(type, eventInitDict) {
        this.type = type;
        this.detail = eventInitDict?.detail;
      }
    };
    global.CustomEvent = globalThis.CustomEvent;
  }
  globalThis.document = {
    title: 'جامعہ اسلامیہ ایبٹ آباد',
    documentElement: {
      lang: 'ur',
      dir: 'rtl',
      classList: {
        add: () => {},
        remove: () => {},
        contains: () => false,
      },
      setAttribute: () => {},
      getAttribute: () => null,
    },
    head: {
      appendChild: () => {},
    },
    getElementById: () => null,
    querySelector: () => null,
    querySelectorAll: () => [],
    createElement: () => ({
      setAttribute: () => {},
      getAttribute: () => null,
      appendChild: () => {},
    }),
  };
  if (!globalThis.navigator) {
    Object.defineProperty(globalThis, 'navigator', {
      value: { userAgent: 'node' },
      configurable: true,
      writable: true,
    });
  }

  // Intercept relative fetch calls during SSR build to prevent unhandled URL parse error logs
  const originalFetch = globalThis.fetch;
  globalThis.fetch = async (input, init) => {
    if (typeof input === 'string' && input.startsWith('/')) {
      return new Response(JSON.stringify({ success: true, data: [] }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    }
    return originalFetch ? originalFetch(input, init) : Promise.reject(new Error('No fetch in SSR'));
  };
}

async function prerender() {
  console.log('[prerender] Starting static HTML pre-rendering...');

  const distPath = path.resolve(process.cwd(), 'dist');
  const templatePath = path.resolve(distPath, 'index.html');

  if (!fs.existsSync(templatePath)) {
    console.error('[prerender] dist/index.html not found! Build client first.');
    process.exit(1);
  }

  const template = fs.readFileSync(templatePath, 'utf-8');

  // Load server bundle
  const serverEntryPath = path.resolve(distPath, 'server/entry-server.js');
  if (!fs.existsSync(serverEntryPath)) {
    console.error(`[prerender] ${serverEntryPath} not found!`);
    process.exit(1);
  }

  // Import render function
  const { render } = await import(serverEntryPath);
  const appHtml = render();

  // Inject rendered HTML into <div id="root"></div>
  const finalHtml = template.replace(
    '<div id="root"></div>',
    `<div id="root">${appHtml}</div>`
  );

  fs.writeFileSync(templatePath, finalHtml, 'utf-8');
  console.log('[prerender] Successfully pre-rendered dist/index.html with full server-side markup!');

  // Cleanup temporary dist/server directory
  const serverDir = path.resolve(distPath, 'server');
  if (fs.existsSync(serverDir)) {
    fs.rmSync(serverDir, { recursive: true, force: true });
    console.log('[prerender] Cleaned up temporary server bundle directory.');
  }
}

prerender().catch((err) => {
  console.error('[prerender] Error during pre-rendering:', err);
  process.exit(1);
});
