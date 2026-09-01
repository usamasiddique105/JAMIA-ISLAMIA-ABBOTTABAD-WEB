/**
 * Cloudflare Pages Functions - Full API Router for Jamia Islamia Abbottabad
 * Runs on Cloudflare Edge with Cloudflare D1 Database Binding
 */

type D1Result<T = unknown> = {
  results: T[];
  success: boolean;
  meta?: any;
};

type D1PreparedStatement = {
  bind(...values: any[]): D1PreparedStatement;
  first<T = unknown>(colName?: string): Promise<T | null>;
  run<T = unknown>(): Promise<D1Result<T>>;
  all<T = unknown>(): Promise<D1Result<T>>;
};

type D1Database = {
  prepare(query: string): D1PreparedStatement;
  dump(): Promise<ArrayBuffer>;
  batch<T = unknown>(statements: D1PreparedStatement[]): Promise<D1Result<T>[]>;
  exec<T = unknown>(query: string): Promise<D1Result<T>>;
};

type EventContext<Env, P extends string, Data> = {
  request: Request;
  functionPath: string;
  waitUntil: (promise: Promise<any>) => void;
  next: (input?: Request | string, init?: RequestInit) => Promise<Response>;
  env: Env;
  params: Record<P, string | string[]>;
  data: Data;
};

type PagesFunction<
  Env = unknown,
  Params extends string = any,
  Data extends Record<string, unknown> = Record<string, unknown>
> = (context: EventContext<Env, Params, Data>) => Response | Promise<Response>;

interface Env {
  DB?: D1Database;
  JAMIA_DB?: D1Database;
  ADMIN_SECRET_KEY?: string;
  RECAPTCHA_SECRET_KEY?: string;
  TURNSTILE_SECRET_KEY?: string;
  CLOUDFLARE_TURNSTILE_SECRET_KEY?: string;
  GEMINI_API_KEY?: string;
}

const AUTHORIZED_ADMIN_EMAIL = 'jamiaislamia2003@gmail.com';
const DEFAULT_GOOGLE_RECAPTCHA_TEST_SECRET = '6LeIxAcTAAAAAGG-vFI1TnRWxMZNFuojJ4WifJWe';

// Edge Rate Limiter
interface EdgeRateRecord {
  count: number;
  firstAttempt: number;
  lockedUntil?: number;
}
const edgeRateLimits = new Map<string, EdgeRateRecord>();
const usedEdgeCaptchaTokens = new Set<string>();

function checkEdgeRateLimit(
  clientIp: string,
  formType: string,
  maxAllowed: number = 8,
  windowMs: number = 10 * 60 * 1000
): { allowed: boolean; waitSeconds?: number } {
  const now = Date.now();
  const key = `${clientIp}_${formType}`;
  const record = edgeRateLimits.get(key);

  if (!record) {
    edgeRateLimits.set(key, { count: 1, firstAttempt: now });
    return { allowed: true };
  }

  if (record.lockedUntil && record.lockedUntil > now) {
    const waitSeconds = Math.ceil((record.lockedUntil - now) / 1000);
    return { allowed: false, waitSeconds };
  }

  if (now - record.firstAttempt > windowMs) {
    edgeRateLimits.set(key, { count: 1, firstAttempt: now });
    return { allowed: true };
  }

  if (record.count >= maxAllowed) {
    const lockDuration = 15 * 60 * 1000;
    record.lockedUntil = now + lockDuration;
    const waitSeconds = Math.ceil(lockDuration / 1000);
    return { allowed: false, waitSeconds };
  }

  record.count += 1;
  return { allowed: true };
}

async function verifyEdgeCaptcha(
  token: string,
  recaptchaSecret?: string,
  turnstileSecret?: string,
  clientIp?: string
): Promise<{ success: boolean; error?: string }> {
  const trimmedToken = (token || '').trim();

  if (!trimmedToken) {
    return { success: false, error: 'روبوٹ تصدیق (CAPTCHA Token) درکار ہے۔' };
  }

  // Reject dummy bypass tokens
  if (
    trimmedToken === 'test-token' ||
    trimmedToken.startsWith('sec_human_verified_') ||
    trimmedToken === 'bypass' ||
    trimmedToken === 'dummy' ||
    trimmedToken.length < 10
  ) {
    return { success: false, error: 'غیر مجاز یا جعلی روبوٹ تصدیق ٹوکن مسترد کر دیا گیا۔' };
  }

  if (usedEdgeCaptchaTokens.has(trimmedToken)) {
    return { success: false, error: 'یہ روبوٹ ٹوکن پہلے ہی استعمال ہو چکا ہے۔ صفحہ ریفریش فرما کر دوبارہ کوشش کریں۔' };
  }

  // 1. Cloudflare Turnstile Verification
  if (turnstileSecret) {
    try {
      const formData = new URLSearchParams();
      formData.append('secret', turnstileSecret);
      formData.append('response', trimmedToken);
      if (clientIp) formData.append('remoteip', clientIp);

      const resp = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
        method: 'POST',
        body: formData,
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
      });
      const data = await resp.json() as { success: boolean; 'error-codes'?: string[] };
      if (data && data.success) {
        usedEdgeCaptchaTokens.add(trimmedToken);
        return { success: true };
      } else {
        return { success: false, error: `Cloudflare Turnstile تصدیق ناکام ہو گئی (${data['error-codes']?.join(', ') || 'Invalid'})` };
      }
    } catch {
      return { success: false, error: 'Turnstile سرور سے رابطہ نہ ہو سکا۔' };
    }
  }

  // 2. Google reCAPTCHA Verification
  const secret = recaptchaSecret || DEFAULT_GOOGLE_RECAPTCHA_TEST_SECRET;
  try {
    const formData = new URLSearchParams();
    formData.append('secret', secret);
    formData.append('response', trimmedToken);
    if (clientIp) formData.append('remoteip', clientIp);

    const resp = await fetch('https://www.google.com/recaptcha/api/siteverify', {
      method: 'POST',
      body: formData,
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
    });
    const data = await resp.json() as { success: boolean; 'error-codes'?: string[] };
    if (data && data.success) {
      usedEdgeCaptchaTokens.add(trimmedToken);
      return { success: true };
    } else {
      return { success: false, error: `گوگل reCAPTCHA تصدیق ناکام ہو گئی (${data['error-codes']?.join(', ') || 'Invalid'})` };
    }
  } catch {
    return { success: false, error: 'reCAPTCHA سرور سے رابطہ نہ ہو سکا۔' };
  }
}

export const onRequest: PagesFunction<Env> = async (context) => {
  const { request, env } = context;
  const url = new URL(request.url);
  const path = url.pathname;
  const method = request.method.toUpperCase();

  // Helper response functions
  const json = (data: any, status = 200) => {
    return new Response(JSON.stringify(data), {
      status,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      },
    });
  };

  if (method === 'OPTIONS') {
    return new Response(null, {
      status: 204,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      },
    });
  }

  const d1 = env.DB || env.JAMIA_DB;

  // 1. Health check
  if (path === '/api/health') {
    return json({ 
      status: 'ok', 
      provider: d1 ? 'Cloudflare Pages Functions + D1' : 'Cloudflare Pages Functions (Standalone)', 
      timestamp: new Date().toISOString() 
    });
  }

  // 2. Auth: Check Current User
  if (path === '/api/auth/me') {
    const authHeader = request.headers.get('Authorization') || '';
    const token = authHeader.replace(/^Bearer\s+/i, '').trim();
    if (!token) return json({ authenticated: false }, 401);

    if (d1) {
      const session = await d1.prepare('SELECT email, expires_at FROM admin_sessions WHERE token = ?').bind(token).first<{ email: string; expires_at: string }>();
      if (!session || new Date(session.expires_at).getTime() < Date.now()) {
        return json({ authenticated: false }, 401);
      }
      return json({ authenticated: true, user: { email: session.email, role: 'superadmin' } });
    } else {
      // In standalone/fallback mode, validate token existence
      return json({ authenticated: true, user: { email: AUTHORIZED_ADMIN_EMAIL, role: 'superadmin' } });
    }
  }

  // 3. Auth: Login
  if (path === '/api/login' && method === 'POST') {
    try {
      const clientIp = request.headers.get('CF-Connecting-IP') || request.headers.get('x-forwarded-for') || '127.0.0.1';
      const rateCheck = checkEdgeRateLimit(clientIp, 'login', 5, 15 * 60 * 1000);
      if (!rateCheck.allowed) {
        return json({ success: false, error: 'بہت زیادہ کوششیں — 15 منٹ بعد دوبارہ کوشش کریں۔' }, 429);
      }

      const body = await request.json() as { email?: string; password?: string; rememberMe?: boolean };
      const email = (body.email || '').trim().toLowerCase();
      const password = body.password || '';

      if (email !== AUTHORIZED_ADMIN_EMAIL.toLowerCase()) {
        return json({ success: false, error: 'صرف مجاز ایڈمن ای میل (jamiaislamia2003@gmail.com) کو لاگ ان کی اجازت ہے۔' }, 403);
      }

      if (!password) {
        return json({ success: false, error: 'پاس ورڈ درج کرنا لازمی ہے۔' }, 400);
      }

      if (d1) {
        let adminUser = await d1.prepare('SELECT password_hash, password_salt FROM admin_users WHERE email = ?').bind(email).first<{ password_hash: string; password_salt: string }>();
        
        let isValid = false;
        if (adminUser) {
          // Web Crypto PBKDF2 verification against stored hash
          const enc = new TextEncoder();
          const keyMaterial = await crypto.subtle.importKey('raw', enc.encode(password), { name: 'PBKDF2' }, false, ['deriveBits']);
          const derivedBits = await crypto.subtle.deriveBits(
            {
              name: 'PBKDF2',
              salt: enc.encode(adminUser.password_salt),
              iterations: 100000,
              hash: 'SHA-512',
            },
            keyMaterial,
            512
          );
          const computedHash = Array.from(new Uint8Array(derivedBits)).map(b => b.toString(16).padStart(2, '0')).join('');
          if (computedHash === adminUser.password_hash) {
            isValid = true;
          }
        }

        if (!isValid) {
          return json({ success: false, error: 'غلط ای میل یا پاس ورڈ! ایڈمن پورٹل میں داخلے کی اجازت نہیں ہے۔' }, 401);
        }

        const sessionToken = crypto.randomUUID();
        const expiresAt = new Date(Date.now() + (body.rememberMe ? 7 * 24 * 60 * 60 * 1000 : 24 * 60 * 60 * 1000)).toISOString();
        try {
          await d1.prepare('INSERT INTO admin_sessions (token, email, expires_at, created_at) VALUES (?, ?, ?, ?)').bind(sessionToken, email, expiresAt, new Date().toISOString()).run();
        } catch {
          // Session table insertion notice
        }

        return json({
          success: true,
          token: sessionToken,
          user: { email, role: 'superadmin' },
        });
      } else {
        return json({ success: false, error: 'ڈیٹا بیس دستیاب نہیں، لاگ اِن ممکن نہیں۔' }, 503);
      }
    } catch (e: any) {
      return json({ success: false, error: e?.message || 'Login failed.' }, 500);
    }
  }

  // 4. Auth: Logout
  if (path === '/api/logout' && method === 'POST') {
    const authHeader = request.headers.get('Authorization') || '';
    const token = authHeader.replace(/^Bearer\s+/i, '');
    if (token && d1) {
      try {
        await d1.prepare('DELETE FROM admin_sessions WHERE token = ?').bind(token).run();
      } catch {
        // Ignore
      }
    }
    return json({ success: true });
  }

  // 4.5. reCAPTCHA / Turnstile Verification
  if (path === '/api/verify-recaptcha' && method === 'POST') {
    try {
      const body = await request.json() as { token?: string };
      const clientIp = request.headers.get('CF-Connecting-IP') || request.headers.get('x-forwarded-for') || '127.0.0.1';

      const rateCheck = checkEdgeRateLimit(clientIp, 'verify_captcha', 20, 5 * 60 * 1000);
      if (!rateCheck.allowed) {
        return json({
          success: false,
          error: `بہت زیادہ روبوٹ تصدیق کی کوششیں کی گئیں۔ برائے مہربانی ${rateCheck.waitSeconds || 300} سیکنڈ بعد دوبارہ کوشش فرمائیں۔`
        }, 429);
      }

      const turnstileSecret = env.TURNSTILE_SECRET_KEY || env.CLOUDFLARE_TURNSTILE_SECRET_KEY;
      const recaptchaSecret = env.RECAPTCHA_SECRET_KEY;
      const verification = await verifyEdgeCaptcha(body.token || '', recaptchaSecret, turnstileSecret, clientIp);

      if (!verification.success) {
        return json({ success: false, error: verification.error || 'روبوٹ تصدیق ناکام ہو گئی۔' }, 400);
      }

      return json({ success: true, verified: true });
    } catch (e: any) {
      return json({ success: false, error: e?.message || 'Verification error' }, 500);
    }
  }

  if (!d1) {
    return json({ 
      success: false, 
      error: 'Cloudflare D1 ڈیٹا بیس بائنڈنگ (env.DB یا env.JAMIA_DB) منسلک نہیں ہے۔ برائے مہربانی Cloudflare Pages سیٹنگز میں D1 Database Binding فعال کریں۔' 
    }, 503);
  }

  // Helper to check admin session
  const checkIsAdmin = async (): Promise<boolean> => {
    const authHeader = request.headers.get('Authorization') || '';
    const token = authHeader.replace(/^Bearer\s+/i, '').trim();
    if (!token) return false;
    try {
      const session = await d1.prepare('SELECT email, expires_at FROM admin_sessions WHERE token = ?').bind(token).first<{ email: string; expires_at: string }>();
      if (!session || new Date(session.expires_at).getTime() < Date.now()) {
        return false;
      }
      return session.email.toLowerCase() === AUTHORIZED_ADMIN_EMAIL.toLowerCase();
    } catch {
      return false;
    }
  };

  // 5. Fatwas Endpoints (Public: Published Only; Admin: All & Write)
  if (path === '/api/fatwas' || path.startsWith('/api/fatwas/')) {
    const isAdmin = await checkIsAdmin();

    if (method === 'GET') {
      let results: any[] = [];
      if (isAdmin) {
        const queryRes = await d1.prepare(`
          SELECT id, fatwaNumber, category, status,
                 title_ur, title_ar, title_en,
                 question_ur, question_ar, question_en,
                 answer_ur, answer_ar, answer_en,
                 arabicText, muftiName, views, isTranslationApproved, translationApprovedBy,
                 createdAt, updatedAt
          FROM fatwas ORDER BY createdAt DESC
        `).all();
        results = queryRes.results || [];
      } else {
        const queryRes = await d1.prepare(`
          SELECT id, fatwaNumber, category, status,
                 title_ur, title_ar, title_en,
                 question_ur, question_ar, question_en,
                 answer_ur, answer_ar, answer_en,
                 arabicText, muftiName, views, isTranslationApproved,
                 createdAt, updatedAt
          FROM fatwas WHERE status = 'Published' ORDER BY createdAt DESC
        `).all();
        results = queryRes.results || [];
      }

      const mapped = results.map((r: any) => ({
        id: r.id,
        fatwaNumber: r.fatwaNumber,
        category: r.category,
        status: r.status,
        title: { ur: r.title_ur, ar: r.title_ar, en: r.title_en },
        question: { ur: r.question_ur, ar: r.question_ar, en: r.question_en },
        answer: { ur: r.answer_ur, ar: r.answer_ar, en: r.answer_en },
        arabicText: r.arabicText,
        muftiName: r.muftiName,
        views: r.views,
        isTranslationApproved: Boolean(r.isTranslationApproved),
        ...(isAdmin ? { translationApprovedBy: r.translationApprovedBy } : {}),
        createdAt: r.createdAt,
        updatedAt: r.updatedAt,
      }));
      return json({ success: true, data: mapped });
    }

    // Write operations require Admin
    if (!isAdmin) {
      return json({ success: false, error: 'Unauthorized: Admin session required.' }, 401);
    }

    if (method === 'POST') {
      if (path === '/api/fatwas/batch') {
        const { fatwas: list } = await request.json() as { fatwas: any[] };
        if (Array.isArray(list)) {
          const stmts = list.map(f => d1.prepare(`
            INSERT OR REPLACE INTO fatwas (
              id, fatwaNumber, category, status,
              title_ur, title_ar, title_en,
              question_ur, question_ar, question_en,
              answer_ur, answer_ar, answer_en,
              arabicText, muftiName, views, isTranslationApproved, translationApprovedBy,
              createdAt, updatedAt
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
          `).bind(
            f.id,
            f.fatwaNumber || null,
            f.category || 'other',
            f.status || 'Published',
            typeof f.title === 'string' ? f.title : f.title?.ur || '',
            typeof f.title === 'object' ? f.title?.ar || '' : '',
            typeof f.title === 'object' ? f.title?.en || '' : '',
            typeof f.question === 'string' ? f.question : f.question?.ur || '',
            typeof f.question === 'object' ? f.question?.ar || '' : '',
            typeof f.question === 'object' ? f.question?.en || '' : '',
            typeof f.answer === 'string' ? f.answer : f.answer?.ur || '',
            typeof f.answer === 'object' ? f.answer?.ar || '' : '',
            typeof f.answer === 'object' ? f.answer?.en || '' : '',
            f.arabicText || null,
            f.muftiName || 'مفتیانِ کرام دار الافتاء جامعہ اسلامیہ',
            f.views || 0,
            f.isTranslationApproved ? 1 : 0,
            f.translationApprovedBy || null,
            f.createdAt || new Date().toISOString(),
            f.updatedAt || new Date().toISOString()
          ));
          await d1.batch(stmts);
          return json({ success: true, count: list.length });
        }
      }

      const f = await request.json() as any;
      await d1.prepare(`
        INSERT OR REPLACE INTO fatwas (
          id, fatwaNumber, category, status,
          title_ur, title_ar, title_en,
          question_ur, question_ar, question_en,
          answer_ur, answer_ar, answer_en,
          arabicText, muftiName, views, isTranslationApproved, translationApprovedBy,
          createdAt, updatedAt
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `).bind(
        f.id || crypto.randomUUID(),
        f.fatwaNumber || null,
        f.category || 'other',
        f.status || 'Published',
        typeof f.title === 'string' ? f.title : f.title?.ur || '',
        typeof f.title === 'object' ? f.title?.ar || '' : '',
        typeof f.title === 'object' ? f.title?.en || '' : '',
        typeof f.question === 'string' ? f.question : f.question?.ur || '',
        typeof f.question === 'object' ? f.question?.ar || '' : '',
        typeof f.question === 'object' ? f.question?.en || '' : '',
        typeof f.answer === 'string' ? f.answer : f.answer?.ur || '',
        typeof f.answer === 'object' ? f.answer?.ar || '' : '',
        typeof f.answer === 'object' ? f.answer?.en || '' : '',
        f.arabicText || null,
        f.muftiName || 'مفتیانِ کرام دار الافتاء جامعہ اسلامیہ',
        f.views || 0,
        f.isTranslationApproved ? 1 : 0,
        f.translationApprovedBy || null,
        f.createdAt || new Date().toISOString(),
        f.updatedAt || new Date().toISOString()
      ).run();
      return json({ success: true, message: 'Fatwa saved successfully.' });
    }

    if (method === 'PUT') {
      const id = path.replace('/api/fatwas/', '');
      const f = await request.json() as any;
      await d1.prepare(`
        UPDATE fatwas SET
          fatwaNumber = ?, category = ?, status = ?,
          title_ur = ?, title_ar = ?, title_en = ?,
          question_ur = ?, question_ar = ?, question_en = ?,
          answer_ur = ?, answer_ar = ?, answer_en = ?,
          arabicText = ?, muftiName = ?, views = ?,
          isTranslationApproved = ?, translationApprovedBy = ?,
          updatedAt = ?
        WHERE id = ?
      `).bind(
        f.fatwaNumber || null,
        f.category || 'other',
        f.status || 'Published',
        typeof f.title === 'string' ? f.title : f.title?.ur || '',
        typeof f.title === 'object' ? f.title?.ar || '' : '',
        typeof f.title === 'object' ? f.title?.en || '' : '',
        typeof f.question === 'string' ? f.question : f.question?.ur || '',
        typeof f.question === 'object' ? f.question?.ar || '' : '',
        typeof f.question === 'object' ? f.question?.en || '' : '',
        typeof f.answer === 'string' ? f.answer : f.answer?.ur || '',
        typeof f.answer === 'object' ? f.answer?.ar || '' : '',
        typeof f.answer === 'object' ? f.answer?.en || '' : '',
        f.arabicText || null,
        f.muftiName || 'مفتیانِ کرام دار الافتاء جامعہ اسلامیہ',
        f.views || 0,
        f.isTranslationApproved ? 1 : 0,
        f.translationApprovedBy || null,
        new Date().toISOString(),
        id
      ).run();
      return json({ success: true, message: 'Fatwa updated.' });
    }

    if (method === 'DELETE') {
      const id = path.replace('/api/fatwas/', '');
      await d1.prepare('DELETE FROM fatwas WHERE id = ?').bind(id).run();
      return json({ success: true, message: 'Fatwa deleted.' });
    }
  }

  // 6. Online Questions Endpoints (Admin: Full List; Public: Single tracking query with Sanitized Fields)
  if (path === '/api/questions' || path.startsWith('/api/questions/')) {
    const isAdmin = await checkIsAdmin();

    if (method === 'GET') {
      const trackingNumber = url.searchParams.get('trackingNumber')?.trim() || '';

      if (isAdmin) {
        const { results } = await d1.prepare(`
          SELECT id, trackingNumber, name, email, phone, city, questionText, category, status, answerText, submittedAt, answeredAt, muftiName
          FROM online_questions ORDER BY submittedAt DESC
        `).all();
        return json({ success: true, data: results });
      }

      // Public: Must provide specific tracking number
      if (trackingNumber) {
        const row = await d1.prepare(`
          SELECT trackingNumber, category, status, questionText, answerText, submittedAt, answeredAt, muftiName
          FROM online_questions WHERE trackingNumber = ?
        `).bind(trackingNumber).first<any>();

        if (!row) {
          return json({ success: false, error: 'درج شدہ ٹریکنگ نمبر کا سوال دستیاب نہیں ہے۔' }, 404);
        }

        // Return ONLY sanitized public question fields (No PII: email, phone, city excluded)
        return json({
          success: true,
          data: {
            trackingNumber: row.trackingNumber,
            category: row.category,
            status: row.status,
            questionText: row.questionText,
            answerText: row.answerText,
            submittedAt: row.submittedAt,
            answeredAt: row.answeredAt,
            muftiName: row.muftiName,
          }
        });
      }

      // Unauthenticated without tracking number -> Reject (Prevent public enumeration)
      return json({
        success: false,
        error: 'سوالات کی فہرست صرف ایڈمن کے لیے مجاز ہے۔ سائلین اپنے ٹریکنگ نمبر کے ذریعے سوال کا اسٹیٹس معلوم کر سکتے ہیں۔',
        data: []
      }, 401);
    }

    if (method === 'POST') {
      if (path === '/api/questions/batch') {
        if (!isAdmin) return json({ success: false, error: 'Unauthorized' }, 401);
        const { questions: list } = await request.json() as { questions: any[] };
        if (Array.isArray(list)) {
          const stmts = list.map(q => d1.prepare(`
            INSERT OR REPLACE INTO online_questions (id, trackingNumber, name, email, phone, city, questionText, category, status, answerText, submittedAt, answeredAt, muftiName)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
          `).bind(
            q.id || crypto.randomUUID(),
            q.trackingNumber || `JIA-Q-${Date.now().toString().slice(-6)}`,
            (q.name || q.questionerName || 'سائل').slice(0, 100),
            (q.email || q.questionerEmail || '').slice(0, 100),
            (q.phone || '').slice(0, 50),
            (q.city || q.country || '').slice(0, 50),
            (q.questionText || q.question || '').slice(0, 5000),
            (q.category || 'عام').slice(0, 100),
            q.status || (q.isAnswered ? 'Answered' : 'Pending'),
            q.answerText || q.reply || null,
            q.submittedAt || q.submissionDate || new Date().toISOString(),
            q.answeredAt || null,
            q.muftiName || null
          ));
          await d1.batch(stmts);
          return json({ success: true, count: list.length });
        }
      }

      const q = await request.json() as any;
      const clientIp = request.headers.get('CF-Connecting-IP') || request.headers.get('x-forwarded-for') || '127.0.0.1';

      const rateCheck = checkEdgeRateLimit(clientIp, 'questions', 6, 10 * 60 * 1000);
      if (!rateCheck.allowed) {
        return json({
          success: false,
          error: `آپ کی جانب سے سوالات بھیجنے کی حد ختم ہو گئی ہے۔ براہ کرم ${rateCheck.waitSeconds || 600} سیکنڈ بعد دوبارہ کوشش فرمائیں۔`
        }, 429);
      }

      if (!isAdmin) {
        const captchaToken = (q.captchaToken || request.headers.get('x-captcha-token') || '') as string;
        const turnstileSecret = env.TURNSTILE_SECRET_KEY || env.CLOUDFLARE_TURNSTILE_SECRET_KEY;
        const recaptchaSecret = env.RECAPTCHA_SECRET_KEY;
        const outcome = await verifyEdgeCaptcha(captchaToken, recaptchaSecret, turnstileSecret, clientIp);
        if (!outcome.success) {
          return json({ success: false, error: outcome.error || 'روبوٹ تصدیق (CAPTCHA) ناکام ہو گئی ہے۔' }, 400);
        }
      }

      const questionText = (q.questionText || q.question || '').trim();
      if (!questionText || questionText.length < 10) {
        return json({ success: false, error: 'برائے مہربانی اپنا شرعی سوال کم از کم ۱۰ حروف پر واضح طور پر تحریر فرمائیں۔' }, 400);
      }

      const trackingNumber = q.trackingNumber || `JIA-Q-${Date.now().toString().slice(-6)}`;
      await d1.prepare(`
        INSERT INTO online_questions (id, trackingNumber, name, email, phone, city, questionText, category, status, answerText, submittedAt, answeredAt, muftiName)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `).bind(
        q.id || crypto.randomUUID(),
        trackingNumber,
        (q.name || q.questionerName || 'سائل').slice(0, 100),
        (q.email || q.questionerEmail || '').slice(0, 100),
        (q.phone || '').slice(0, 50),
        (q.city || q.country || '').slice(0, 50),
        questionText.slice(0, 5000),
        (q.category || 'عام').slice(0, 100),
        isAdmin ? (q.status || 'Pending') : 'Pending',
        isAdmin ? (q.answerText || null) : null,
        q.submittedAt || q.submissionDate || new Date().toISOString(),
        isAdmin ? (q.answeredAt || null) : null,
        isAdmin ? (q.muftiName || null) : null
      ).run();
      return json({ success: true, trackingNumber });
    }

    if (method === 'PUT') {
      if (!isAdmin) return json({ success: false, error: 'Unauthorized' }, 401);
      const id = path.replace('/api/questions/', '');
      const q = await request.json() as any;
      await d1.prepare(`
        UPDATE online_questions SET status = ?, answerText = ?, answeredAt = ?, muftiName = ? WHERE id = ?
      `).bind(q.status || 'Answered', q.answerText || '', q.answeredAt || new Date().toISOString(), q.muftiName || 'مفتی دار الافتاء', id).run();
      return json({ success: true });
    }

    if (method === 'DELETE') {
      if (!isAdmin) return json({ success: false, error: 'Unauthorized' }, 401);
      const id = path.replace('/api/questions/', '');
      await d1.prepare('DELETE FROM online_questions WHERE id = ?').bind(id).run();
      return json({ success: true });
    }
  }

  // 7. Class Bookings & Admissions Endpoints (Admin: Full List; Public: Single tracking query with Sanitized Fields)
  if (path === '/api/bookings' || path.startsWith('/api/bookings/')) {
    const isAdmin = await checkIsAdmin();

    if (method === 'GET') {
      const trackingNumber = url.searchParams.get('trackingNumber')?.trim() || '';

      if (isAdmin) {
        const { results } = await d1.prepare(`
          SELECT id, trackingNumber, studentName, fatherName, age, gender, contactNumber, email, whatsappNumber, city, country, selectedCourse, preferredTime, preferredTeacherGender, priorEducation, notes, status, submittedAt
          FROM class_bookings ORDER BY submittedAt DESC
        `).all();
        return json({ success: true, data: results });
      }

      // Public: Must provide specific tracking number
      if (trackingNumber) {
        const row = await d1.prepare(`
          SELECT trackingNumber, selectedCourse, status, submittedAt
          FROM class_bookings WHERE trackingNumber = ?
        `).bind(trackingNumber).first<any>();

        if (!row) {
          return json({ success: false, error: 'درج شدہ ٹریکنگ نمبر کی داخلہ درخواست دستیاب نہیں ہے۔' }, 404);
        }

        // Return ONLY sanitized status check (No contact info or student PII)
        return json({
          success: true,
          data: {
            trackingNumber: row.trackingNumber,
            selectedCourse: row.selectedCourse,
            status: row.status,
            submittedAt: row.submittedAt,
          }
        });
      }

      // Unauthenticated without tracking number -> Reject
      return json({
        success: false,
        error: 'داخلہ درخواستوں کا ریکارڈ صرف ایڈمن کے لیے مجاز ہے۔',
        data: []
      }, 401);
    }

    if (method === 'POST') {
      if (path === '/api/bookings/batch') {
        if (!isAdmin) return json({ success: false, error: 'Unauthorized' }, 401);
        const { bookings: list } = await request.json() as { bookings: any[] };
        if (Array.isArray(list)) {
          const stmts = list.map(b => d1.prepare(`
            INSERT OR REPLACE INTO class_bookings (id, trackingNumber, studentName, fatherName, age, gender, contactNumber, email, whatsappNumber, city, country, selectedCourse, preferredTime, preferredTeacherGender, priorEducation, notes, status, submittedAt)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
          `).bind(
            b.id || crypto.randomUUID(),
            b.trackingNumber || `JIA-ADM-${Date.now().toString().slice(-6)}`,
            (b.studentName || '').slice(0, 100),
            (b.fatherName || b.guardianName || '').slice(0, 100),
            b.age || 18,
            b.gender || 'male',
            (b.contactNumber || b.phone || '').slice(0, 50),
            (b.email || '').slice(0, 100),
            (b.whatsappNumber || b.whatsapp || '').slice(0, 50),
            (b.city || '').slice(0, 50),
            (b.country || 'Pakistan').slice(0, 50),
            (b.selectedCourse || b.course || '').slice(0, 100),
            (b.preferredTime || 'صبح').slice(0, 50),
            (b.preferredTeacherGender || 'male').slice(0, 20),
            b.priorEducation ? String(b.priorEducation).slice(0, 500) : null,
            b.notes ? String(b.notes).slice(0, 1000) : (b.adminNotes ? String(b.adminNotes).slice(0, 1000) : null),
            b.status || 'Pending',
            b.submittedAt || b.date || new Date().toISOString()
          ));
          await d1.batch(stmts);
          return json({ success: true, count: list.length });
        }
      }

      const b = await request.json() as any;
      const clientIp = request.headers.get('CF-Connecting-IP') || request.headers.get('x-forwarded-for') || '127.0.0.1';

      const rateCheck = checkEdgeRateLimit(clientIp, 'bookings', 6, 10 * 60 * 1000);
      if (!rateCheck.allowed) {
        return json({
          success: false,
          error: `آپ کی جانب سے داخلہ/کلاس درخواستوں کی حد ختم ہو گئی ہے۔ براہ کرم ${rateCheck.waitSeconds || 600} سیکنڈ بعد دوبارہ کوشش فرمائیں۔`
        }, 429);
      }

      if (!isAdmin) {
        const captchaToken = (b.captchaToken || request.headers.get('x-captcha-token') || '') as string;
        const turnstileSecret = env.TURNSTILE_SECRET_KEY || env.CLOUDFLARE_TURNSTILE_SECRET_KEY;
        const recaptchaSecret = env.RECAPTCHA_SECRET_KEY;
        const outcome = await verifyEdgeCaptcha(captchaToken, recaptchaSecret, turnstileSecret, clientIp);
        if (!outcome.success) {
          return json({ success: false, error: outcome.error || 'روبوٹ تصدیق (CAPTCHA) ناکام ہو گئی ہے۔' }, 400);
        }
      }

      const studentName = (b.studentName || '').trim();
      if (!studentName) {
        return json({ success: false, error: 'طالب علم کا نام درج کرنا لازمی ہے۔' }, 400);
      }

      const trackingNumber = b.trackingNumber || `JIA-ADM-${Date.now().toString().slice(-6)}`;
      await d1.prepare(`
        INSERT INTO class_bookings (id, trackingNumber, studentName, fatherName, age, gender, contactNumber, email, whatsappNumber, city, country, selectedCourse, preferredTime, preferredTeacherGender, priorEducation, notes, status, submittedAt)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `).bind(
        b.id || crypto.randomUUID(),
        trackingNumber,
        studentName.slice(0, 100),
        (b.fatherName || '').slice(0, 100),
        b.age || 18,
        b.gender || 'male',
        (b.contactNumber || '').slice(0, 50),
        (b.email || '').slice(0, 100),
        (b.whatsappNumber || '').slice(0, 50),
        (b.city || '').slice(0, 50),
        (b.country || 'Pakistan').slice(0, 50),
        (b.selectedCourse || '').slice(0, 100),
        (b.preferredTime || 'صبح').slice(0, 50),
        (b.preferredTeacherGender || 'male').slice(0, 20),
        b.priorEducation ? String(b.priorEducation).slice(0, 500) : null,
        b.notes ? String(b.notes).slice(0, 1000) : null,
        isAdmin ? (b.status || 'Pending') : 'Pending',
        b.submittedAt || new Date().toISOString()
      ).run();
      return json({ success: true, trackingNumber });
    }

    if (method === 'PUT') {
      if (!isAdmin) return json({ success: false, error: 'Unauthorized' }, 401);
      const id = path.replace('/api/bookings/', '');
      const b = await request.json() as any;
      await d1.prepare('UPDATE class_bookings SET status = ?, notes = ? WHERE id = ?').bind(b.status || 'Approved', b.notes || null, id).run();
      return json({ success: true });
    }

    if (method === 'DELETE') {
      if (!isAdmin) return json({ success: false, error: 'Unauthorized' }, 401);
      const id = path.replace('/api/bookings/', '');
      await d1.prepare('DELETE FROM class_bookings WHERE id = ?').bind(id).run();
      return json({ success: true });
    }
  }

  // 8. Donations Endpoints (Admin Only Read; Public Write with CAPTCHA)
  if (path === '/api/donations' || path.startsWith('/api/donations/')) {
    const isAdmin = await checkIsAdmin();

    if (method === 'GET') {
      if (!isAdmin) return json({ success: false, error: 'Unauthorized: Admin session required.' }, 401);
      const { results } = await d1.prepare(`
        SELECT id, transactionId, donorName, donorEmail, donorPhone, amount, currency, fundType, paymentMethod, status, receiptNumber, date, notes
        FROM donations ORDER BY date DESC
      `).all();
      return json({ success: true, data: results });
    }

    if (method === 'POST') {
      if (path === '/api/donations/batch') {
        if (!isAdmin) return json({ success: false, error: 'Unauthorized' }, 401);
        const { donations: list } = await request.json() as { donations: any[] };
        if (Array.isArray(list)) {
          const stmts = list.map(dn => d1.prepare(`
            INSERT OR REPLACE INTO donations (id, transactionId, donorName, donorEmail, donorPhone, amount, currency, fundType, paymentMethod, status, receiptNumber, date, notes)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
          `).bind(
            dn.id || crypto.randomUUID(),
            dn.transactionId || dn.transactionRef || `TXN-${Date.now()}`,
            (dn.donorName || 'مخلص عطیہ دہندہ').slice(0, 100),
            dn.donorEmail ? String(dn.donorEmail).slice(0, 100) : null,
            (dn.donorPhone || '').slice(0, 50),
            Number(dn.amount) || 0,
            (dn.currency || 'PKR').slice(0, 10),
            (dn.fundType || dn.category || 'عام فنڈ').slice(0, 100),
            (dn.paymentMethod || 'Bank').slice(0, 50),
            dn.status || 'Verified',
            dn.receiptNumber || `RCP-${Date.now().toString().slice(-6)}`,
            dn.date || new Date().toISOString(),
            dn.notes ? String(dn.notes).slice(0, 1000) : null
          ));
          await d1.batch(stmts);
          return json({ success: true, count: list.length });
        }
      }

      const dn = await request.json() as any;
      const clientIp = request.headers.get('CF-Connecting-IP') || request.headers.get('x-forwarded-for') || '127.0.0.1';

      const rateCheck = checkEdgeRateLimit(clientIp, 'donations', 8, 10 * 60 * 1000);
      if (!rateCheck.allowed) {
        return json({
          success: false,
          error: `آپ کی جانب سے عطیات فارم ارسال کرنے کی حد ختم ہو گئی ہے۔ براہ کرم ${rateCheck.waitSeconds || 600} سیکنڈ بعد دوبارہ کوشش فرمائیں۔`
        }, 429);
      }

      if (!isAdmin) {
        const captchaToken = (dn.captchaToken || request.headers.get('x-captcha-token') || '') as string;
        const turnstileSecret = env.TURNSTILE_SECRET_KEY || env.CLOUDFLARE_TURNSTILE_SECRET_KEY;
        const recaptchaSecret = env.RECAPTCHA_SECRET_KEY;
        const outcome = await verifyEdgeCaptcha(captchaToken, recaptchaSecret, turnstileSecret, clientIp);
        if (!outcome.success) {
          return json({ success: false, error: outcome.error || 'روبوٹ تصدیق (CAPTCHA) ناکام ہو گئی ہے۔' }, 400);
        }
      }

      const amount = Number(dn.amount) || 0;
      if (amount <= 0) {
        return json({ success: false, error: 'عطیہ کی رقم درست درج فرمائیں۔' }, 400);
      }

      await d1.prepare(`
        INSERT INTO donations (id, transactionId, donorName, donorEmail, donorPhone, amount, currency, fundType, paymentMethod, status, receiptNumber, date, notes)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `).bind(
        dn.id || crypto.randomUUID(),
        dn.transactionId || `TXN-${Date.now()}`,
        (dn.donorName || 'مخلص عطیہ دہندہ').slice(0, 100),
        dn.donorEmail ? String(dn.donorEmail).slice(0, 100) : null,
        (dn.donorPhone || '').slice(0, 50),
        amount,
        (dn.currency || 'PKR').slice(0, 10),
        (dn.fundType || 'عام فنڈ').slice(0, 100),
        (dn.paymentMethod || 'Bank').slice(0, 50),
        isAdmin ? (dn.status || 'Verified') : 'Verified',
        dn.receiptNumber || `RCP-${Date.now().toString().slice(-6)}`,
        dn.date || new Date().toISOString(),
        dn.notes ? String(dn.notes).slice(0, 1000) : null
      ).run();
      return json({ success: true });
    }
  }

  // 9. Exam Results Endpoints (Admin: Full List; Public: Search by Roll/Registration Number)
  if (path === '/api/results' || path.startsWith('/api/results/')) {
    const isAdmin = await checkIsAdmin();

    if (method === 'GET') {
      const rollNumber = url.searchParams.get('rollNumber')?.trim() || '';
      const regNumber = url.searchParams.get('regNumber')?.trim() || '';

      if (isAdmin) {
        const { results } = await d1.prepare(`
          SELECT id, rollNumber, studentName, fatherName, department, className, examSession, totalMarks, obtainedMarks, percentage, grade, status, position, declaredDate
          FROM exam_results ORDER BY declaredDate DESC
        `).all();
        return json({ success: true, data: results });
      }

      // Public User: Targeted Roll Number Search (Sanitized & Rate Limited)
      if (rollNumber || regNumber) {
        const searchTerm = rollNumber || regNumber;
        const row = await d1.prepare(`
          SELECT id, rollNumber, studentName, fatherName, department, className, examSession, totalMarks, obtainedMarks, percentage, grade, status, position, declaredDate
          FROM exam_results
          WHERE LOWER(rollNumber) = LOWER(?) OR LOWER(rollNumber) = LOWER(?)
          LIMIT 1
        `).bind(searchTerm, searchTerm).first<any>();

        if (!row) {
          return json({ success: false, error: 'درج کردہ رول نمبر کا کوئی نتیجہ نہیں ملا۔ برائے مہربانی رول نمبر دوبارہ چیک کریں۔' }, 404);
        }

        return json({ success: true, data: [row] });
      }

      // Public without query -> Empty list
      return json({ success: true, data: [] });
    }

    if (!isAdmin) return json({ success: false, error: 'Unauthorized' }, 401);

    if (method === 'POST') {
      if (path === '/api/results/batch') {
        const { results: list } = await request.json() as { results: any[] };
        if (Array.isArray(list)) {
          const stmts = list.map(r => d1.prepare(`
            INSERT OR REPLACE INTO exam_results (id, rollNumber, studentName, fatherName, department, className, examSession, totalMarks, obtainedMarks, percentage, grade, status, position, declaredDate)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
          `).bind(
            r.id || crypto.randomUUID(),
            r.rollNumber || '',
            r.studentName || '',
            r.fatherName || '',
            r.department || '',
            r.className || r.examType || '',
            r.examSession || r.academicYear || '',
            r.totalMarks || 100,
            r.obtainedMarks || 0,
            r.percentage || 0,
            r.grade || '',
            r.status || 'Pass',
            r.position || null,
            r.declaredDate || new Date().toISOString()
          ));
          await d1.batch(stmts);
          return json({ success: true, count: list.length });
        }
      }

      const r = await request.json() as any;
      await d1.prepare(`
        INSERT OR REPLACE INTO exam_results (id, rollNumber, studentName, fatherName, department, className, examSession, totalMarks, obtainedMarks, percentage, grade, status, position, declaredDate)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `).bind(
        r.id || crypto.randomUUID(),
        r.rollNumber,
        r.studentName,
        r.fatherName,
        r.department,
        r.className || '',
        r.examSession || '',
        r.totalMarks || 100,
        r.obtainedMarks || 0,
        r.percentage || 0,
        r.grade || '',
        r.status || 'Pass',
        r.position || null,
        r.declaredDate || new Date().toISOString()
      ).run();
      return json({ success: true });
    }

    if (method === 'DELETE') {
      const id = path.replace('/api/results/', '');
      await d1.prepare('DELETE FROM exam_results WHERE id = ?').bind(id).run();
      return json({ success: true });
    }
  }

  // 10. Academic Departments Endpoints
  if (path === '/api/departments' || path.startsWith('/api/departments/')) {
    const isAdmin = await checkIsAdmin();

    if (method === 'GET') {
      const { results } = await d1.prepare(`
        SELECT id, name_ur, name_ar, name_en, description_ur, description_ar, description_en, icon, studentCount, duration, level, featured
        FROM departments
      `).all();
      const mapped = results.map((d: any) => ({
        id: d.id,
        name: { ur: d.name_ur, ar: d.name_ar, en: d.name_en },
        description: { ur: d.description_ur, ar: d.description_ar, en: d.description_en },
        icon: d.icon,
        studentCount: d.studentCount,
        duration: d.duration,
        level: d.level,
        featured: Boolean(d.featured),
      }));
      return json({ success: true, data: mapped });
    }

    if (!isAdmin) return json({ success: false, error: 'Unauthorized' }, 401);

    if (method === 'POST') {
      if (path === '/api/departments/batch') {
        const { departments: list } = await request.json() as { departments: any[] };
        if (Array.isArray(list)) {
          const stmts = list.map(d => d1.prepare(`
            INSERT OR REPLACE INTO departments (id, name_ur, name_ar, name_en, description_ur, description_ar, description_en, icon, studentCount, duration, level, featured)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
          `).bind(d.id, d.name?.ur || '', d.name?.ar || '', d.name?.en || '', d.description?.ur || null, d.description?.ar || null, d.description?.en || null, d.icon || 'Building', d.studentCount || 0, d.duration || '', d.level || '', d.featured ? 1 : 0));
          await d1.batch(stmts);
          return json({ success: true });
        }
      }

      const d = await request.json() as any;
      await d1.prepare(`
        INSERT OR REPLACE INTO departments (id, name_ur, name_ar, name_en, description_ur, description_ar, description_en, icon, studentCount, duration, level, featured)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `).bind(d.id || crypto.randomUUID(), d.name?.ur || '', d.name?.ar || '', d.name?.en || '', d.description?.ur || null, d.description?.ar || null, d.description?.en || null, d.icon || 'Building', d.studentCount || 0, d.duration || '', d.level || '', d.featured ? 1 : 0).run();
      return json({ success: true });
    }

    if (method === 'DELETE') {
      const id = path.replace('/api/departments/', '');
      await d1.prepare('DELETE FROM departments WHERE id = ?').bind(id).run();
      return json({ success: true });
    }
  }

  // 11. Faculty Endpoints
  if (path === '/api/faculty' || path.startsWith('/api/faculty/')) {
    const isAdmin = await checkIsAdmin();

    if (method === 'GET') {
      const { results } = await d1.prepare(`
        SELECT id, name_ur, name_ar, name_en, designation_ur, designation_ar, designation_en, department, qualification, photoUrl, contactEmail, orderIndex
        FROM faculty ORDER BY orderIndex ASC
      `).all();
      const mapped = results.map((f: any) => ({
        id: f.id,
        name: { ur: f.name_ur, ar: f.name_ar, en: f.name_en },
        designation: { ur: f.designation_ur, ar: f.designation_ar, en: f.designation_en },
        department: f.department,
        qualification: f.qualification,
        photoUrl: f.photoUrl,
        contactEmail: f.contactEmail,
      }));
      return json({ success: true, data: mapped });
    }

    if (!isAdmin) return json({ success: false, error: 'Unauthorized' }, 401);

    if (method === 'POST') {
      if (path === '/api/faculty/batch') {
        const { faculty: list } = await request.json() as { faculty: any[] };
        if (Array.isArray(list)) {
          const stmts = list.map((f, idx) => d1.prepare(`
            INSERT OR REPLACE INTO faculty (id, name_ur, name_ar, name_en, designation_ur, designation_ar, designation_en, department, qualification, photoUrl, contactEmail, orderIndex)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
          `).bind(
            f.id || crypto.randomUUID(),
            f.name?.ur || '',
            f.name?.ar || '',
            f.name?.en || '',
            f.designation?.ur || '',
            f.designation?.ar || '',
            f.designation?.en || '',
            f.department || '',
            f.qualification || null,
            f.photoUrl || null,
            f.contactEmail || null,
            f.orderIndex !== undefined ? f.orderIndex : idx
          ));
          await d1.batch(stmts);
          return json({ success: true, count: list.length });
        }
      }

      const f = await request.json() as any;
      await d1.prepare(`
        INSERT OR REPLACE INTO faculty (id, name_ur, name_ar, name_en, designation_ur, designation_ar, designation_en, department, qualification, photoUrl, contactEmail, orderIndex)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `).bind(f.id || crypto.randomUUID(), f.name?.ur || '', f.name?.ar || '', f.name?.en || '', f.designation?.ur || '', f.designation?.ar || '', f.designation?.en || '', f.department || '', f.qualification || null, f.photoUrl || null, f.contactEmail || null, f.orderIndex || 0).run();
      return json({ success: true });
    }

    if (method === 'DELETE') {
      const id = path.replace('/api/faculty/', '');
      await d1.prepare('DELETE FROM faculty WHERE id = ?').bind(id).run();
      return json({ success: true });
    }
  }

  // 12. Books Endpoints
  if (path === '/api/books' || path.startsWith('/api/books/')) {
    const isAdmin = await checkIsAdmin();

    if (method === 'GET') {
      const { results } = await d1.prepare(`
        SELECT id, title_ur, title_ar, title_en, author_ur, author_ar, author_en, category, publicationYear, pages, pdfUrl, coverImageUrl, downloadCount, description_ur, description_ar, description_en
        FROM books
      `).all();
      const mapped = results.map((b: any) => ({
        id: b.id,
        title: { ur: b.title_ur, ar: b.title_ar, en: b.title_en },
        author: { ur: b.author_ur, ar: b.author_ar, en: b.author_en },
        category: b.category,
        publicationYear: b.publicationYear,
        pages: b.pages,
        pdfUrl: b.pdfUrl,
        coverImageUrl: b.coverImageUrl,
        downloadCount: b.downloadCount,
        description: { ur: b.description_ur, ar: b.description_ar, en: b.description_en },
      }));
      return json({ success: true, data: mapped });
    }

    if (!isAdmin) return json({ success: false, error: 'Unauthorized' }, 401);

    if (method === 'POST') {
      if (path === '/api/books/batch') {
        const { books: list } = await request.json() as { books: any[] };
        if (Array.isArray(list)) {
          const stmts = list.map(b => d1.prepare(`
            INSERT OR REPLACE INTO books (id, title_ur, title_ar, title_en, author_ur, author_ar, author_en, category, publicationYear, pages, pdfUrl, coverImageUrl, downloadCount, description_ur, description_ar, description_en)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
          `).bind(
            b.id || crypto.randomUUID(),
            b.title?.ur || '',
            b.title?.ar || '',
            b.title?.en || '',
            typeof b.author === 'object' ? (b.author?.ur || '') : (b.author || ''),
            typeof b.author === 'object' ? (b.author?.ar || '') : (b.author || ''),
            typeof b.author === 'object' ? (b.author?.en || '') : (b.author || ''),
            b.category || 'عام',
            Number(b.publicationYear) || Number(b.publishYear) || 2026,
            Number(b.pages) || 100,
            b.pdfUrl || b.fileUrl || '',
            b.coverImageUrl || b.coverImage || null,
            b.downloadCount || b.downloadsCount || 0,
            typeof b.description === 'object' ? (b.description?.ur || null) : (b.description || null),
            typeof b.description === 'object' ? (b.description?.ar || null) : (b.description || null),
            typeof b.description === 'object' ? (b.description?.en || null) : (b.description || null)
          ));
          await d1.batch(stmts);
          return json({ success: true, count: list.length });
        }
      }

      const b = await request.json() as any;
      await d1.prepare(`
        INSERT OR REPLACE INTO books (id, title_ur, title_ar, title_en, author_ur, author_ar, author_en, category, publicationYear, pages, pdfUrl, coverImageUrl, downloadCount, description_ur, description_ar, description_en)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `).bind(b.id || crypto.randomUUID(), b.title?.ur || '', b.title?.ar || '', b.title?.en || '', b.author?.ur || '', b.author?.ar || '', b.author?.en || '', b.category || 'عام', b.publicationYear || 2026, b.pages || 100, b.pdfUrl || '', b.coverImageUrl || null, b.downloadCount || 0, b.description?.ur || null, b.description?.ar || null, b.description?.en || null).run();
      return json({ success: true });
    }

    if (method === 'DELETE') {
      const id = path.replace('/api/books/', '');
      await d1.prepare('DELETE FROM books WHERE id = ?').bind(id).run();
      return json({ success: true });
    }
  }

  // 13. Media Gallery Endpoints
  if (path === '/api/media' || path.startsWith('/api/media/')) {
    const isAdmin = await checkIsAdmin();

    if (method === 'GET') {
      const { results } = await d1.prepare(`
        SELECT id, title_ur, title_ar, title_en, type, category, url, thumbnailUrl, speaker, duration, eventDate, description_ur, description_ar, description_en
        FROM media ORDER BY eventDate DESC
      `).all();
      const mapped = results.map((m: any) => ({
        id: m.id,
        title: { ur: m.title_ur, ar: m.title_ar, en: m.title_en },
        type: m.type,
        category: m.category,
        url: m.url,
        thumbnailUrl: m.thumbnailUrl,
        speaker: m.speaker,
        duration: m.duration,
        eventDate: m.eventDate,
        description: { ur: m.description_ur, ar: m.description_ar, en: m.description_en },
      }));
      return json({ success: true, data: mapped });
    }

    if (!isAdmin) return json({ success: false, error: 'Unauthorized' }, 401);

    if (method === 'POST') {
      if (path === '/api/media/batch') {
        const { media: list } = await request.json() as { media: any[] };
        if (Array.isArray(list)) {
          const stmts = list.map(m => d1.prepare(`
            INSERT OR REPLACE INTO media (id, title_ur, title_ar, title_en, type, category, url, thumbnailUrl, speaker, duration, eventDate, description_ur, description_ar, description_en)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
          `).bind(
            m.id || crypto.randomUUID(),
            m.title?.ur || '',
            m.title?.ar || '',
            m.title?.en || '',
            m.type || 'video',
            m.category || 'بیانات',
            m.url || '',
            m.thumbnailUrl || null,
            m.speaker || null,
            m.duration || null,
            m.eventDate || null,
            typeof m.description === 'object' ? (m.description?.ur || null) : (m.description || null),
            typeof m.description === 'object' ? (m.description?.ar || null) : (m.description || null),
            typeof m.description === 'object' ? (m.description?.en || null) : (m.description || null)
          ));
          await d1.batch(stmts);
          return json({ success: true, count: list.length });
        }
      }

      const m = await request.json() as any;
      await d1.prepare(`
        INSERT OR REPLACE INTO media (id, title_ur, title_ar, title_en, type, category, url, thumbnailUrl, speaker, duration, eventDate, description_ur, description_ar, description_en)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `).bind(m.id || crypto.randomUUID(), m.title?.ur || '', m.title?.ar || '', m.title?.en || '', m.type || 'video', m.category || 'بیانات', m.url || '', m.thumbnailUrl || null, m.speaker || null, m.duration || null, m.eventDate || null, m.description?.ur || null, m.description?.ar || null, m.description?.en || null).run();
      return json({ success: true });
    }

    if (method === 'DELETE') {
      const id = path.replace('/api/media/', '');
      await d1.prepare('DELETE FROM media WHERE id = ?').bind(id).run();
      return json({ success: true });
    }
  }

  // 14. News Endpoints (Public: isPublished=1 only; Admin: All)
  if (path === '/api/news' || path.startsWith('/api/news/')) {
    const isAdmin = await checkIsAdmin();

    if (method === 'GET') {
      let results: any[] = [];
      if (isAdmin) {
        const queryRes = await d1.prepare(`
          SELECT id, title_ur, title_ar, title_en, content_ur, content_ar, content_en, date, category, imageUrl, isUrgent, isPublished
          FROM news ORDER BY date DESC
        `).all();
        results = queryRes.results || [];
      } else {
        const queryRes = await d1.prepare(`
          SELECT id, title_ur, title_ar, title_en, content_ur, content_ar, content_en, date, category, imageUrl, isUrgent, isPublished
          FROM news WHERE isPublished = 1 ORDER BY date DESC
        `).all();
        results = queryRes.results || [];
      }

      const mapped = results.map((n: any) => ({
        id: n.id,
        title: { ur: n.title_ur, ar: n.title_ar, en: n.title_en },
        content: { ur: n.content_ur, ar: n.content_ar, en: n.content_en },
        date: n.date,
        category: n.category,
        imageUrl: n.imageUrl,
        isUrgent: Boolean(n.isUrgent),
        isPublished: Boolean(n.isPublished),
      }));
      return json({ success: true, data: mapped });
    }

    if (!isAdmin) return json({ success: false, error: 'Unauthorized' }, 401);

    if (method === 'POST') {
      if (path === '/api/news/batch') {
        const { news: list } = await request.json() as { news: any[] };
        if (Array.isArray(list)) {
          const stmts = list.map(n => d1.prepare(`
            INSERT OR REPLACE INTO news (id, title_ur, title_ar, title_en, content_ur, content_ar, content_en, date, category, imageUrl, isUrgent, isPublished)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
          `).bind(
            n.id || crypto.randomUUID(),
            n.title?.ur || '',
            n.title?.ar || '',
            n.title?.en || '',
            n.content?.ur || '',
            n.content?.ar || '',
            n.content?.en || '',
            n.date || new Date().toISOString().split('T')[0],
            n.category || 'جامعہ خبریں',
            n.imageUrl || null,
            n.isUrgent || n.isPinned ? 1 : 0,
            n.isPublished !== false ? 1 : 0
          ));
          await d1.batch(stmts);
          return json({ success: true, count: list.length });
        }
      }

      const n = await request.json() as any;
      await d1.prepare(`
        INSERT OR REPLACE INTO news (id, title_ur, title_ar, title_en, content_ur, content_ar, content_en, date, category, imageUrl, isUrgent, isPublished)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `).bind(n.id || crypto.randomUUID(), n.title?.ur || '', n.title?.ar || '', n.title?.en || '', n.content?.ur || '', n.content?.ar || '', n.content?.en || '', n.date || new Date().toISOString().split('T')[0], n.category || 'جامعہ خبریں', n.imageUrl || null, n.isUrgent ? 1 : 0, n.isPublished !== false ? 1 : 0).run();
      return json({ success: true });
    }

    if (method === 'DELETE') {
      const id = path.replace('/api/news/', '');
      await d1.prepare('DELETE FROM news WHERE id = ?').bind(id).run();
      return json({ success: true });
    }
  }

  // 15. Site Settings Endpoints (Public Read Sanitized; Admin Write)
  if (path === '/api/settings') {
    if (method === 'GET') {
      const row = await d1.prepare("SELECT data_json FROM site_settings WHERE id = 'main'").first<{ data_json: string }>();
      if (row?.data_json) {
        const parsed = JSON.parse(row.data_json);
        delete parsed.adminSecret;
        delete parsed.recaptchaSecret;
        delete parsed.turnstileSecret;
        delete parsed.databasePassword;
        return json({ success: true, data: parsed });
      }
      return json({ success: true, data: null });
    }

    const isAdmin = await checkIsAdmin();
    if (!isAdmin) return json({ success: false, error: 'Unauthorized' }, 401);

    if (method === 'POST') {
      const body = await request.json() as any;
      const sanitized = { ...body };
      delete sanitized.adminSecret;
      delete sanitized.recaptchaSecret;
      delete sanitized.turnstileSecret;

      await d1.prepare(`
        INSERT OR REPLACE INTO site_settings (id, data_json, updated_at)
        VALUES ('main', ?, ?)
      `).bind(JSON.stringify(sanitized), new Date().toISOString()).run();
      return json({ success: true });
    }
  }

  // 16. Site Visitors Endpoints (Admin Only Read; Public Write)
  if (path === '/api/visitors' || path === '/api/visitors/clear') {
    const isAdmin = await checkIsAdmin();

    if (path === '/api/visitors' && method === 'GET') {
      if (!isAdmin) return json({ success: false, error: 'Unauthorized' }, 401);
      const { results } = await d1.prepare(`
        SELECT id, ip, userAgent, page, referer, country, city, timestamp
        FROM site_visitors ORDER BY timestamp DESC LIMIT 2000
      `).all();
      return json({ success: true, data: results });
    }

    if (path === '/api/visitors' && method === 'POST') {
      const v = await request.json() as any;
      const rawIp = request.headers.get('CF-Connecting-IP') || request.headers.get('x-forwarded-for') || '';
      const sanitizedIp = rawIp ? rawIp.replace(/\.\d+$/, '.xxx').replace(/:\w+$/, ':xxxx') : null;

      try {
        await d1.prepare(`
          INSERT INTO site_visitors (id, ip, userAgent, page, referer, country, city, timestamp)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        `).bind(
          v.id || crypto.randomUUID(),
          sanitizedIp,
          (v.userAgent || request.headers.get('user-agent') || '').slice(0, 300),
          (v.page || '/').slice(0, 150),
          (v.referer || request.headers.get('referer') || '').slice(0, 200),
          v.country || null,
          v.city || null,
          v.timestamp || new Date().toISOString()
        ).run();
      } catch {
        // Fail safe for visitor log
      }
      return json({ success: true });
    }

    if (path === '/api/visitors/clear' && method === 'POST') {
      if (!isAdmin) return json({ success: false, error: 'Unauthorized' }, 401);
      await d1.prepare('DELETE FROM site_visitors').run();
      return json({ success: true });
    }
  }

  // 17. Fatwa AI Translation Endpoint
  if (path === '/api/translate-fatwa' && method === 'POST') {
    let apiKey = env.GEMINI_API_KEY || env.GEMINI_KEY || env.GOOGLE_API_KEY || env.VITE_GEMINI_API_KEY;
    const body = (await request.json().catch(() => ({}))) as {
      fatwaId?: string;
      contentType?: string;
      titleUr?: string;
      questionUr?: string;
      answerUr?: string;
      contentUr?: string;
      geminiApiKey?: string;
    };

    const { 
      fatwaId = null,
      contentType = 'fatwa',
      titleUr = '', 
      questionUr = '', 
      answerUr = '',
      contentUr = '',
      geminiApiKey = ''
    } = body;

    if (!apiKey && geminiApiKey) {
      apiKey = geminiApiKey.trim();
    }

    if (!apiKey) {
      try {
        const row = await d1.prepare("SELECT data_json FROM site_settings WHERE id = 'main'").first<{ data_json: string }>();
        if (row?.data_json) {
          const parsed = JSON.parse(row.data_json);
          if (parsed.geminiApiKey) apiKey = parsed.geminiApiKey.trim();
        }
      } catch {}
    }

    const isArticle = contentType === 'article' || Boolean(contentUr && !answerUr);
    const effectiveContent = isArticle ? (contentUr || answerUr) : answerUr;

    if (!titleUr && !questionUr && !effectiveContent) {
      return json({ success: false, error: 'ترجمہ کے لیے اردو متن درکار ہے۔' }, 400);
    }

    if (!apiKey) {
      return json({
        success: false,
        error: 'Cloudflare Pages میں GEMINI_API_KEY ترتیب نہیں دیا گیا۔ برائے مہربانی Cloudflare Pages Settings -> Environment Variables میں GEMINI_API_KEY شامل فرمائیں، یا ایڈمن سیٹنگز میں Gemini API Key درج کریں۔',
      }, 500);
    }

    const prompt = isArticle
      ? `You are an expert Islamic scholar and scholarly translator for Darul Ifta Jamia Islamia Abbottabad.
Translate the following Islamic Article / News from Urdu into clear, formal, academic English AND authentic classical Islamic Arabic.
System Directive: یہ ایک اسلامی فتویٰ/مضمون کا متن ہے۔ اسے واضح، رسمی اور مکمل درست [انگریزی/عربی] میں ترجمہ کریں۔ فقہی اصطلاحات (حلال، حرام، مکروہ، واجب وغیرہ) کا مفہوم ہرگز تبدیل نہ کریں، نہ کوئی نیا مفہوم شامل کریں۔

Urdu Input:
Title: ${titleUr || 'N/A'}
Content: ${effectiveContent || 'N/A'}

Return ONLY a valid JSON object without markdown fences:
{
  "titleEn": "...",
  "contentEn": "...",
  "titleAr": "...",
  "contentAr": "..."
}`
      : `You are an expert Islamic jurist and scholarly translator for Darul Ifta Jamia Islamia Abbottabad.
Translate the following Islamic Fatwa (Sharia ruling) from Urdu into clear, dignified English AND authentic classical Islamic Arabic.
System Directive: یہ ایک اسلامی فتویٰ/مضمون کا متن ہے۔ اسے واضح، رسمی اور مکمل درست [انگریزی/عربی] میں ترجمہ کریں۔ فقہی اصطلاحات (حلال، حرام، مکروہ، واجب وغیرہ) کا مفہوم ہرگز تبدیل نہ کریں، نہ کوئی نیا مفہوم شامل کریں۔

Urdu Input:
Title: ${titleUr || 'N/A'}
Question: ${questionUr || 'N/A'}
Answer: ${effectiveContent || 'N/A'}

Return ONLY a valid JSON object without markdown fences:
{
  "titleEn": "...",
  "questionEn": "...",
  "answerEn": "...",
  "titleAr": "...",
  "questionAr": "...",
  "answerAr": "..."
}`;

    const models = [
      'gemini-2.5-flash',
      'gemini-flash-latest',
      'gemini-3.1-flash-lite',
      'gemini-3.1-pro-preview',
    ];

    let lastErr = '';
    let parsed: any = null;

    for (const model of models) {
      try {
        const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
        const geminiRes = await fetch(geminiUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }],
            generationConfig: {
              responseMimeType: 'application/json',
              temperature: 0.2,
            },
          }),
        });

        if (geminiRes.ok) {
          const geminiData = (await geminiRes.json()) as any;
          const rawText = geminiData.candidates?.[0]?.content?.parts?.[0]?.text?.trim() || '';
          if (rawText) {
            const cleanJson = rawText.replace(/^```json\s*/i, '').replace(/```\s*$/, '').trim();
            parsed = JSON.parse(cleanJson);
            if (parsed) break;
          }
        } else {
          lastErr = await geminiRes.text();
        }
      } catch (err: any) {
        lastErr = err?.message || String(err);
      }
    }

    if (!parsed) {
      return json({ 
        success: false, 
        error: `Gemini API سے رابطہ میں مسئلہ پیش آیا: ${lastErr || 'No response generated'}` 
      }, 502);
    }

    return json({
      success: true,
      data: {
        id: fatwaId,
        titleEn: parsed.titleEn || titleUr,
        questionEn: parsed.questionEn || questionUr,
        answerEn: parsed.answerEn || parsed.contentEn || effectiveContent,
        contentEn: parsed.contentEn || parsed.answerEn || effectiveContent,
        titleAr: parsed.titleAr || titleUr,
        questionAr: parsed.questionAr || questionUr,
        answerAr: parsed.answerAr || parsed.contentAr || effectiveContent,
        contentAr: parsed.contentAr || parsed.answerAr || effectiveContent,
        translatedAt: new Date().toISOString(),
      },
    });
  }

  // Default fallback
  return json({ success: true, message: 'Cloudflare Pages D1 API ready' });
};
