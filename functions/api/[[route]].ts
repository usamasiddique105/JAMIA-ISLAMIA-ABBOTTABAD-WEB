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
}

const AUTHORIZED_ADMIN_EMAIL = 'jamiaislamia2003@gmail.com';

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
  if (!d1) {
    return json({ success: false, error: 'Cloudflare D1 database binding not configured.' }, 500);
  }

  // 1. Health check
  if (path === '/api/health') {
    return json({ status: 'ok', provider: 'Cloudflare Pages Functions + D1', timestamp: new Date().toISOString() });
  }

  // 2. Auth: Check Current User
  if (path === '/api/auth/me') {
    const authHeader = request.headers.get('Authorization') || '';
    const token = authHeader.replace(/^Bearer\s+/i, '');
    if (!token) return json({ authenticated: false }, 401);

    const session = await d1.prepare('SELECT email, expires_at FROM admin_sessions WHERE token = ?').bind(token).first<{ email: string; expires_at: string }>();
    if (!session || new Date(session.expires_at).getTime() < Date.now()) {
      return json({ authenticated: false }, 401);
    }
    return json({ authenticated: true, user: { email: session.email, role: 'superadmin' } });
  }

  // 3. Auth: Login
  if (path === '/api/login' && method === 'POST') {
    try {
      const body = await request.json() as { email?: string; password?: string; rememberMe?: boolean };
      const email = (body.email || '').trim().toLowerCase();
      const password = body.password || '';

      if (email !== AUTHORIZED_ADMIN_EMAIL.toLowerCase()) {
        return json({ success: false, error: 'صرف مجاز ایڈمن ای میل (jamiaislamia2003@gmail.com) کو لاگ ان کی اجازت ہے۔' }, 403);
      }

      const adminUser = await d1.prepare('SELECT password_hash, password_salt FROM admin_users WHERE email = ?').bind(email).first<{ password_hash: string; password_salt: string }>();
      if (!adminUser) {
        return json({ success: false, error: 'ایڈمن ریکارڈ دستیاب نہیں ہے۔' }, 404);
      }

      // Web Crypto PBKDF2 verification
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

      if (computedHash !== adminUser.password_hash) {
        return json({ success: false, error: 'غلط ای میل یا پاس ورڈ! ایڈمن پورٹل میں داخلے کی اجازت نہیں ہے۔' }, 401);
      }

      const sessionToken = crypto.randomUUID();
      const expiresAt = new Date(Date.now() + (body.rememberMe ? 7 * 24 * 60 * 60 * 1000 : 24 * 60 * 60 * 1000)).toISOString();
      await d1.prepare('INSERT INTO admin_sessions (token, email, expires_at, created_at) VALUES (?, ?, ?, ?)').bind(sessionToken, email, expiresAt, new Date().toISOString()).run();

      return json({
        success: true,
        token: sessionToken,
        user: { email, role: 'superadmin' },
      });
    } catch (e: any) {
      return json({ success: false, error: e?.message || 'Login failed.' }, 500);
    }
  }

  // 4. Auth: Logout
  if (path === '/api/logout' && method === 'POST') {
    const authHeader = request.headers.get('Authorization') || '';
    const token = authHeader.replace(/^Bearer\s+/i, '');
    if (token) {
      await d1.prepare('DELETE FROM admin_sessions WHERE token = ?').bind(token).run();
    }
    return json({ success: true });
  }

  // 5. Fatwas Endpoints
  if (path === '/api/fatwas') {
    if (method === 'GET') {
      const { results } = await d1.prepare('SELECT * FROM fatwas ORDER BY createdAt DESC').all();
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
        translationApprovedBy: r.translationApprovedBy,
        createdAt: r.createdAt,
        updatedAt: r.updatedAt,
      }));
      return json({ success: true, data: mapped });
    }

    if (method === 'POST') {
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
  }

  // 6. Online Questions Endpoints
  if (path === '/api/questions') {
    if (method === 'GET') {
      const { results } = await d1.prepare('SELECT * FROM online_questions ORDER BY submittedAt DESC').all();
      return json({ success: true, data: results });
    }
    if (method === 'POST') {
      const q = await request.json() as any;
      await d1.prepare(`
        INSERT INTO online_questions (id, trackingNumber, name, email, phone, city, questionText, category, status, answerText, submittedAt, answeredAt, muftiName)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `).bind(
        q.id || crypto.randomUUID(),
        q.trackingNumber,
        q.name,
        q.email,
        q.phone || null,
        q.city || null,
        q.questionText,
        q.category,
        q.status || 'Pending',
        q.answerText || null,
        q.submittedAt || new Date().toISOString(),
        q.answeredAt || null,
        q.muftiName || null
      ).run();
      return json({ success: true, trackingNumber: q.trackingNumber });
    }
  }

  // 7. Class Bookings Endpoints
  if (path === '/api/bookings') {
    if (method === 'GET') {
      const { results } = await d1.prepare('SELECT * FROM class_bookings ORDER BY submittedAt DESC').all();
      return json({ success: true, data: results });
    }
    if (method === 'POST') {
      const b = await request.json() as any;
      await d1.prepare(`
        INSERT INTO class_bookings (id, trackingNumber, studentName, fatherName, age, gender, contactNumber, email, whatsappNumber, city, country, selectedCourse, preferredTime, preferredTeacherGender, priorEducation, notes, status, submittedAt)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `).bind(
        b.id || crypto.randomUUID(),
        b.trackingNumber,
        b.studentName,
        b.fatherName,
        b.age,
        b.gender,
        b.contactNumber,
        b.email,
        b.whatsappNumber,
        b.city,
        b.country,
        b.selectedCourse,
        b.preferredTime,
        b.preferredTeacherGender,
        b.priorEducation || null,
        b.notes || null,
        b.status || 'Pending',
        b.submittedAt || new Date().toISOString()
      ).run();
      return json({ success: true, trackingNumber: b.trackingNumber });
    }
  }

  // Fallback for general collections (results, news, books, faculty, departments, media, settings, donations)
  return json({ success: true, message: 'Cloudflare Pages D1 API ready' });
};
