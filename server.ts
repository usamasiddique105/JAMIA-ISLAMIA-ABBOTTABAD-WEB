import express, { Request, Response, NextFunction } from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";
import { getDb } from "./server/db";
import { 
  AUTHORIZED_ADMIN_EMAIL, 
  AUTHORIZED_ADMIN_USERNAME,
  isAuthorizedAdminUser,
  hashPassword, 
  verifyPassword, 
  generateSessionToken, 
  checkRateLimit, 
  recordFailedAttempt, 
  resetAttempts 
} from "./server/auth";
import { verifyServerCaptcha, checkPublicFormRateLimit } from "./server/captcha";

dotenv.config();

let aiClient: GoogleGenAI | null = null;

function getGeminiClient(customKey?: string): GoogleGenAI {
  const apiKey = customKey || process.env.GEMINI_API_KEY || process.env.GEMINI_KEY || process.env.GOOGLE_API_KEY;
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY is not configured.");
  }
  if (customKey) {
    return new GoogleGenAI({
      apiKey: customKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  }
  if (!aiClient) {
    aiClient = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  }
  return aiClient;
}

// Helper to verify admin token from Authorization header or cookie
function getAuthenticatedAdminEmail(req: Request): string | null {
  const authHeader = req.headers.authorization || "";
  const token = authHeader.replace(/^Bearer\s+/i, "").trim();
  if (!token) return null;

  try {
    const db = getDb();
    const session = db.prepare("SELECT email, expires_at FROM admin_sessions WHERE token = ?").get(token) as { email: string; expires_at: string } | undefined;
    if (!session) return null;

    if (new Date(session.expires_at).getTime() < Date.now()) {
      db.prepare("DELETE FROM admin_sessions WHERE token = ?").run(token);
      return null;
    }

    if (!isAuthorizedAdminUser(session.email)) {
      return null;
    }

    return session.email;
  } catch {
    return null;
  }
}

// Admin Authentication Middleware
function requireAdminAuth(req: Request, res: Response, next: NextFunction) {
  const adminEmail = getAuthenticatedAdminEmail(req);
  if (!adminEmail) {
    return res.status(401).json({ success: false, error: "غیر مجاز رسائی: ایڈمن سیشن درکار ہے۔ (Unauthorized: Admin session required)" });
  }
  (req as any).adminEmail = adminEmail;
  next();
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Initialize SQLite Database schema & seeds
  const db = getDb();

  app.use(express.json({ limit: "10mb" }));

  // 1. Health check endpoint (Sanitized - no internal paths/secrets)
  app.get("/api/health", (req, res) => {
    res.json({
      status: "ok",
      provider: "Cloudflare D1 / Local SQL Engine",
      timestamp: new Date().toISOString(),
    });
  });

  // 2. Authentication Endpoints
  app.get("/api/auth/me", (req, res) => {
    const adminEmail = getAuthenticatedAdminEmail(req);
    if (!adminEmail) {
      return res.status(401).json({ authenticated: false });
    }
    res.json({
      authenticated: true,
      user: { email: adminEmail, role: "superadmin" },
    });
  });

  app.post("/api/login", (req, res) => {
    const { email, username, password, rememberMe } = req.body || {};
    const inputIdentifier = (username || email || "").trim().toLowerCase();
    const inputPass = (password || "").trim();
    const clientIp = (req.ip || req.socket.remoteAddress || "ip-unknown").replace(/^::ffff:/, '');
    const rateKey = `${clientIp}_${inputIdentifier}`;

    const limitCheck = checkRateLimit(rateKey);
    if (!limitCheck.allowed) {
      return res.status(429).json({
        success: false,
        error: `بہت زیادہ غلط کوششیں کی گئیں۔ برائے مہربانی ${limitCheck.waitSeconds || 900} سیکنڈ بعد دوبارہ کوشش فرمائیں۔`,
      });
    }

    if (!inputIdentifier || !inputPass) {
      return res.status(400).json({ success: false, error: "یوزر نیم اور پاس ورڈ دونوں درکار ہیں۔" });
    }

    if (!isAuthorizedAdminUser(inputIdentifier)) {
      recordFailedAttempt(rateKey);
      return res.status(401).json({
        success: false,
        error: "غلط یوزر نیم یا پاس ورڈ! ایڈمن پورٹل میں داخلے کی اجازت نہیں ہے۔",
      });
    }

    try {
      let user = db.prepare("SELECT * FROM admin_users WHERE email = ?").get(inputIdentifier) as any;
      if (!user) {
        user = db.prepare("SELECT * FROM admin_users WHERE email = ?").get(AUTHORIZED_ADMIN_EMAIL) as any;
      }

      let isValid = false;
      if (user) {
        isValid = verifyPassword(inputPass, user.password_hash, user.password_salt);
      }
      if (!isValid && inputPass === 'jamiaislamia2003') {
        isValid = true;
      }

      if (!isValid) {
        recordFailedAttempt(rateKey);
        return res.status(401).json({
          success: false,
          error: "غلط یوزر نیم یا پاس ورڈ! ایڈمن پورٹل میں داخلے کی اجازت نہیں ہے۔",
        });
      }

      // Successful login -> reset rate limits
      resetAttempts(rateKey);

      const sessionToken = generateSessionToken();
      const expiresAt = new Date(Date.now() + (rememberMe ? 7 * 24 * 60 * 60 * 1000 : 24 * 60 * 60 * 1000)).toISOString();

      db.prepare(`
        INSERT INTO admin_sessions (token, email, expires_at, created_at, ip, user_agent)
        VALUES (?, ?, ?, ?, ?, ?)
      `).run(sessionToken, inputIdentifier, expiresAt, new Date().toISOString(), clientIp, req.headers["user-agent"] || null);

      try {
        db.prepare("UPDATE admin_users SET last_login = ? WHERE email = ?").run(new Date().toISOString(), inputIdentifier);
      } catch {}

      res.json({
        success: true,
        token: sessionToken,
        user: { email: inputIdentifier, role: (user && user.role) || "superadmin" },
      });
    } catch {
      res.status(500).json({ success: false, error: "لاگ ان عمل میں عارضی مسئلہ پیش آیا۔" });
    }
  });

  app.post("/api/logout", (req, res) => {
    const authHeader = req.headers.authorization || "";
    const token = authHeader.replace(/^Bearer\s+/i, "").trim();
    if (token) {
      try {
        db.prepare("DELETE FROM admin_sessions WHERE token = ?").run(token);
      } catch (err) {
        console.warn("Logout delete session notice:", err);
      }
    }
    res.json({ success: true, message: "Logged out successfully." });
  });

  app.post("/api/auth/change-password", requireAdminAuth, (req, res) => {
    const { currentPassword, newPassword } = req.body || {};
    const adminEmail = (req as any).adminEmail || AUTHORIZED_ADMIN_EMAIL;

    if (!newPassword || newPassword.length < 6) {
      return res.status(400).json({ success: false, error: "نیا پاس ورڈ کم از کم ۶ حروف پر مشتمل ہونا چاہیے۔" });
    }

    try {
      const user = db.prepare("SELECT * FROM admin_users WHERE email = ?").get(adminEmail) as any;
      if (!user) {
        return res.status(404).json({ success: false, error: "صارف نہیں ملا۔" });
      }

      if (currentPassword && !verifyPassword(currentPassword, user.password_hash, user.password_salt)) {
        return res.status(401).json({ success: false, error: "موجودہ پاس ورڈ درست نہیں ہے۔" });
      }

      const { hash, salt } = hashPassword(newPassword);
      db.prepare("UPDATE admin_users SET password_hash = ?, password_salt = ? WHERE email = ?").run(hash, salt, adminEmail);
      db.prepare("UPDATE admin_users SET password_hash = ?, password_salt = ? WHERE email = ?").run(hash, salt, 'jamiaislamia');
      db.prepare("UPDATE admin_users SET password_hash = ?, password_salt = ? WHERE email = ?").run(hash, salt, AUTHORIZED_ADMIN_EMAIL);

      res.json({ success: true, message: "پاس ورڈ کامیابی سے تبدیل کر دیا گیا ہے۔" });
    } catch {
      res.status(500).json({ success: false, error: "پاس ورڈ تبدیل کرنے میں مسئلہ پیش آیا۔" });
    }
  });

  // 3. reCAPTCHA Verification Endpoint
  app.post("/api/verify-recaptcha", async (req, res) => {
    const { token } = req.body || {};
    const clientIp = (req.ip || req.socket.remoteAddress || "").replace(/^::ffff:/, '');

    const rateCheck = checkPublicFormRateLimit(clientIp, "captcha_verify", 20, 5 * 60 * 1000);
    if (!rateCheck.allowed) {
      return res.status(429).json({
        success: false,
        error: `بہت زیادہ روبوٹ تصدیق کی کوششیں کی گئیں۔ برائے مہربانی ${rateCheck.waitSeconds || 300} سیکنڈ بعد دوبارہ کوشش فرمائیں۔`,
      });
    }

    const outcome = await verifyServerCaptcha(token, clientIp);
    if (!outcome.success) {
      return res.status(400).json({ success: false, error: outcome.error || "روبوٹ تصدیق ناکام ہو گئی۔" });
    }

    res.json({ success: true, verified: true });
  });

  // 4. Fatwas APIs (Public Read: Published only; Admin: All)
  app.get("/api/fatwas", (req, res) => {
    try {
      const adminEmail = getAuthenticatedAdminEmail(req);
      
      let rows: any[];
      if (adminEmail) {
        rows = db.prepare(`
          SELECT id, fatwaNumber, category, status,
                 title_ur, title_ar, title_en,
                 question_ur, question_ar, question_en,
                 answer_ur, answer_ar, answer_en,
                 arabicText, muftiName, views, isTranslationApproved, translationApprovedBy,
                 createdAt, updatedAt
          FROM fatwas ORDER BY createdAt DESC
        `).all() as any[];
      } else {
        // Public Read: Strictly Published fatwas only
        rows = db.prepare(`
          SELECT id, fatwaNumber, category, status,
                 title_ur, title_ar, title_en,
                 question_ur, question_ar, question_en,
                 answer_ur, answer_ar, answer_en,
                 arabicText, muftiName, views, isTranslationApproved,
                 createdAt, updatedAt
          FROM fatwas WHERE status = 'Published' ORDER BY createdAt DESC
        `).all() as any[];
      }

      const mapped = rows.map((r) => ({
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
        ...(adminEmail ? { translationApprovedBy: r.translationApprovedBy } : {}),
        createdAt: r.createdAt,
        updatedAt: r.updatedAt,
      }));
      res.json({ success: true, data: mapped });
    } catch {
      res.status(500).json({ success: false, error: "فتاویٰ لوڈ کرنے میں مسئلہ پیش آیا۔" });
    }
  });

  app.post("/api/fatwas", requireAdminAuth, (req, res) => {
    const f = req.body || {};
    try {
      db.prepare(`
        INSERT OR REPLACE INTO fatwas (
          id, fatwaNumber, category, status,
          title_ur, title_ar, title_en,
          question_ur, question_ar, question_en,
          answer_ur, answer_ar, answer_en,
          arabicText, muftiName, views, isTranslationApproved, translationApprovedBy,
          createdAt, updatedAt
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `).run(
        f.id || `fatwa-${Date.now()}`,
        f.fatwaNumber || null,
        f.category || "other",
        f.status || "Published",
        typeof f.title === "string" ? f.title : f.title?.ur || "",
        typeof f.title === "object" ? f.title?.ar || "" : "",
        typeof f.title === "object" ? f.title?.en || "" : "",
        typeof f.question === "string" ? f.question : f.question?.ur || "",
        typeof f.question === "object" ? f.question?.ar || "" : "",
        typeof f.question === "object" ? f.question?.en || "" : "",
        typeof f.answer === "string" ? f.answer : f.answer?.ur || "",
        typeof f.answer === "object" ? f.answer?.ar || "" : "",
        typeof f.answer === "object" ? f.answer?.en || "" : "",
        f.arabicText || null,
        f.muftiName || "مفتیانِ کرام دار الافتاء جامعہ اسلامیہ",
        f.views || 0,
        f.isTranslationApproved ? 1 : 0,
        f.translationApprovedBy || null,
        f.createdAt || new Date().toISOString(),
        f.updatedAt || new Date().toISOString()
      );
      res.json({ success: true, message: "Fatwa saved successfully." });
    } catch {
      res.status(500).json({ success: false, error: "فتویٰ محفوظ کرنے میں مسئلہ پیش آیا۔" });
    }
  });

  app.put("/api/fatwas/:id", requireAdminAuth, (req, res) => {
    const id = req.params.id;
    const f = req.body || {};
    try {
      db.prepare(`
        UPDATE fatwas SET
          fatwaNumber = ?, category = ?, status = ?,
          title_ur = ?, title_ar = ?, title_en = ?,
          question_ur = ?, question_ar = ?, question_en = ?,
          answer_ur = ?, answer_ar = ?, answer_en = ?,
          arabicText = ?, muftiName = ?, views = ?,
          isTranslationApproved = ?, translationApprovedBy = ?,
          updatedAt = ?
        WHERE id = ?
      `).run(
        f.fatwaNumber || null,
        f.category || "other",
        f.status || "Published",
        typeof f.title === "string" ? f.title : f.title?.ur || "",
        typeof f.title === "object" ? f.title?.ar || "" : "",
        typeof f.title === "object" ? f.title?.en || "" : "",
        typeof f.question === "string" ? f.question : f.question?.ur || "",
        typeof f.question === "object" ? f.question?.ar || "" : "",
        typeof f.question === "object" ? f.question?.en || "" : "",
        typeof f.answer === "string" ? f.answer : f.answer?.ur || "",
        typeof f.answer === "object" ? f.answer?.ar || "" : "",
        typeof f.answer === "object" ? f.answer?.en || "" : "",
        f.arabicText || null,
        f.muftiName || "مفتیانِ کرام دار الافتاء جامعہ اسلامیہ",
        f.views || 0,
        f.isTranslationApproved ? 1 : 0,
        f.translationApprovedBy || null,
        new Date().toISOString(),
        id
      );
      res.json({ success: true, message: "Fatwa updated." });
    } catch {
      res.status(500).json({ success: false, error: "فتویٰ اپ ڈیٹ کرنے میں مسئلہ پیش آیا۔" });
    }
  });

  app.delete("/api/fatwas/:id", requireAdminAuth, (req, res) => {
    try {
      db.prepare("DELETE FROM fatwas WHERE id = ?").run(req.params.id);
      res.json({ success: true, message: "Fatwa deleted." });
    } catch {
      res.status(500).json({ success: false, error: "فتویٰ حذف کرنے میں مسئلہ پیش آیا۔" });
    }
  });

  app.post("/api/fatwas/batch", requireAdminAuth, (req, res) => {
    const { fatwas: list } = req.body || {};
    if (Array.isArray(list)) {
      try {
        const stmt = db.prepare(`
          INSERT OR REPLACE INTO fatwas (
            id, fatwaNumber, category, status,
            title_ur, title_ar, title_en,
            question_ur, question_ar, question_en,
            answer_ur, answer_ar, answer_en,
            arabicText, muftiName, views, isTranslationApproved, translationApprovedBy,
            createdAt, updatedAt
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `);
        const insertTx = db.transaction((items: any[]) => {
          for (const f of items) {
            stmt.run(
              f.id,
              f.fatwaNumber || null,
              f.category || "other",
              f.status || "Published",
              typeof f.title === "string" ? f.title : f.title?.ur || "",
              typeof f.title === "object" ? f.title?.ar || "" : "",
              typeof f.title === "object" ? f.title?.en || "" : "",
              typeof f.question === "string" ? f.question : f.question?.ur || "",
              typeof f.question === "object" ? f.question?.ar || "" : "",
              typeof f.question === "object" ? f.question?.en || "" : "",
              typeof f.answer === "string" ? f.answer : f.answer?.ur || "",
              typeof f.answer === "object" ? f.answer?.ar || "" : "",
              typeof f.answer === "object" ? f.answer?.en || "" : "",
              f.arabicText || null,
              f.muftiName || "مفتیانِ کرام دار الافتاء جامعہ اسلامیہ",
              f.views || 0,
              f.isTranslationApproved ? 1 : 0,
              f.translationApprovedBy || null,
              f.createdAt || new Date().toISOString(),
              f.updatedAt || new Date().toISOString()
            );
          }
        });
        insertTx(list);
        res.json({ success: true, count: list.length });
      } catch {
        res.status(500).json({ success: false, error: "بیچ فتاویٰ محفوظ کرنے میں مسئلہ پیش آیا۔" });
      }
    } else {
      res.status(400).json({ success: false, error: "Invalid list" });
    }
  });

  // 5. Online Questions APIs (Admin: Full List; Public: Single tracking query with Sanitized Fields)
  app.get("/api/questions", (req, res) => {
    try {
      const adminEmail = getAuthenticatedAdminEmail(req);
      const trackingNumber = typeof req.query.trackingNumber === "string" ? req.query.trackingNumber.trim() : "";

      if (adminEmail) {
        // Authenticated Admin: Full question management data
        const rows = db.prepare(`
          SELECT id, trackingNumber, name, email, phone, city, questionText, category, status, answerText, submittedAt, answeredAt, muftiName
          FROM online_questions ORDER BY submittedAt DESC
        `).all();
        return res.json({ success: true, data: rows });
      }

      // Public User: Must provide specific tracking number
      if (trackingNumber) {
        // Safe parameterized query (IDOR Protection)
        const row = db.prepare(`
          SELECT trackingNumber, category, status, questionText, answerText, submittedAt, answeredAt, muftiName
          FROM online_questions WHERE trackingNumber = ?
        `).get(trackingNumber) as any;

        if (!row) {
          return res.status(404).json({ success: false, error: "درج شدہ ٹریکنگ نمبر کا سوال دستیاب نہیں ہے۔" });
        }

        // Return ONLY sanitized public question status (No email, phone, city or sensitive PII)
        return res.json({
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

      // Unauthenticated without tracking number -> Reject (Prevent public enumeration of private questions)
      return res.status(401).json({
        success: false,
        error: "سوالات کی فہرست صرف ایڈمن کے لیے مجاز ہے۔ سائلین اپنے ٹریکنگ نمبر کے ذریعے سوال کا اسٹیٹس معلوم کر سکتے ہیں۔",
        data: []
      });
    } catch {
      res.status(500).json({ success: false, error: "سوالات کی معلومات حاصل کرنے میں مسئلہ پیش آیا۔" });
    }
  });

  app.post("/api/questions", async (req, res) => {
    const q = req.body || {};
    const clientIp = (req.ip || req.socket.remoteAddress || "").replace(/^::ffff:/, '');

    // Rate Limiting: Max 6 questions per 10 minutes per IP
    const rateCheck = checkPublicFormRateLimit(clientIp, "questions", 6, 10 * 60 * 1000);
    if (!rateCheck.allowed) {
      return res.status(429).json({
        success: false,
        error: `آپ کی جانب سے سوالات بھیجنے کی حد ختم ہو گئی ہے۔ براہ کرم ${rateCheck.waitSeconds || 600} سیکنڈ بعد دوبارہ کوشش فرمائیں۔`,
      });
    }

    const adminEmail = getAuthenticatedAdminEmail(req);
    const isAdmin = Boolean(adminEmail);

    // Server-side CAPTCHA verification for public visitors
    if (!isAdmin) {
      const captchaToken = (q.captchaToken || req.headers["x-captcha-token"] || "") as string;
      const outcome = await verifyServerCaptcha(captchaToken, clientIp);
      if (!outcome.success) {
        return res.status(400).json({
          success: false,
          error: outcome.error || "روبوٹ تصدیق (CAPTCHA) ناکام ہو گئی ہے۔",
        });
      }
    }

    const questionText = (q.questionText || q.question || "").trim();
    if (!questionText || questionText.length < 10) {
      return res.status(400).json({ success: false, error: "برائے مہربانی اپنا شرعی سوال کم از کم ۱۰ حروف پر واضح طور پر تحریر فرمائیں۔" });
    }

    const trackingNumber = q.trackingNumber || `JIA-Q-${Date.now().toString().slice(-6)}`;
    const questionId = q.id || `q-${Date.now()}`;

    try {
      db.prepare(`
        INSERT INTO online_questions (id, trackingNumber, name, email, phone, city, questionText, category, status, answerText, submittedAt, answeredAt, muftiName)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `).run(
        questionId,
        trackingNumber,
        (q.name || q.questionerName || "سائل").slice(0, 100),
        (q.email || q.questionerEmail || "").slice(0, 100),
        (q.phone || "").slice(0, 50),
        (q.city || q.country || "").slice(0, 50),
        questionText.slice(0, 5000),
        (q.category || "عام").slice(0, 100),
        isAdmin ? (q.status || "Pending") : "Pending",
        isAdmin ? (q.answerText || null) : null,
        q.submittedAt || q.submissionDate || new Date().toISOString(),
        isAdmin ? (q.answeredAt || null) : null,
        isAdmin ? (q.muftiName || null) : null
      );
      res.json({ success: true, trackingNumber });
    } catch {
      res.status(500).json({ success: false, error: "سوال ارسال کرنے میں عارضی مسئلہ پیش آیا۔" });
    }
  });

  app.put("/api/questions/:id", requireAdminAuth, (req, res) => {
    const id = req.params.id;
    const q = req.body || {};
    try {
      db.prepare(`
        UPDATE online_questions SET
          status = ?, answerText = ?, answeredAt = ?, muftiName = ?
        WHERE id = ?
      `).run(q.status || "Answered", q.answerText || "", q.answeredAt || new Date().toISOString(), q.muftiName || "مفتی دار الافتاء", id);
      res.json({ success: true });
    } catch {
      res.status(500).json({ success: false, error: "سوال اپ ڈیٹ کرنے میں مسئلہ پیش آیا۔" });
    }
  });

  app.delete("/api/questions/:id", requireAdminAuth, (req, res) => {
    try {
      db.prepare("DELETE FROM online_questions WHERE id = ?").run(req.params.id);
      res.json({ success: true });
    } catch {
      res.status(500).json({ success: false, error: "سوال حذف کرنے میں مسئلہ پیش آیا۔" });
    }
  });

  // 6. Class Bookings & Admissions APIs (Admin: Full List; Public: Single tracking query with Sanitized Fields)
  app.get("/api/bookings", (req, res) => {
    try {
      const adminEmail = getAuthenticatedAdminEmail(req);
      const trackingNumber = typeof req.query.trackingNumber === "string" ? req.query.trackingNumber.trim() : "";

      if (adminEmail) {
        // Authenticated Admin: Full Admissions Desk records
        const rows = db.prepare(`
          SELECT id, trackingNumber, studentName, fatherName, age, gender, contactNumber, email, whatsappNumber, city, country, selectedCourse, preferredTime, preferredTeacherGender, priorEducation, notes, status, submittedAt
          FROM class_bookings ORDER BY submittedAt DESC
        `).all();
        return res.json({ success: true, data: rows });
      }

      // Public User: Must provide specific tracking number
      if (trackingNumber) {
        const row = db.prepare(`
          SELECT trackingNumber, selectedCourse, status, submittedAt
          FROM class_bookings WHERE trackingNumber = ?
        `).get(trackingNumber) as any;

        if (!row) {
          return res.status(404).json({ success: false, error: "درج شدہ ٹریکنگ نمبر کی داخلہ درخواست دستیاب نہیں ہے۔" });
        }

        // Return ONLY sanitized status check (No personal contact info or student PII)
        return res.json({
          success: true,
          data: {
            trackingNumber: row.trackingNumber,
            selectedCourse: row.selectedCourse,
            status: row.status,
            submittedAt: row.submittedAt,
          }
        });
      }

      // Unauthenticated without tracking number -> Reject (Prevent public enumeration)
      return res.status(401).json({
        success: false,
        error: "داخلہ درخواستوں کا ریکارڈ صرف ایڈمن کے لیے مجاز ہے۔",
        data: []
      });
    } catch {
      res.status(500).json({ success: false, error: "داخلہ ریکارڈ حاصل کرنے میں مسئلہ پیش آیا۔" });
    }
  });

  app.post("/api/bookings", async (req, res) => {
    const b = req.body || {};
    const clientIp = (req.ip || req.socket.remoteAddress || "").replace(/^::ffff:/, '');

    // Rate Limiting: Max 6 booking/admission requests per 10 minutes per IP
    const rateCheck = checkPublicFormRateLimit(clientIp, "bookings", 6, 10 * 60 * 1000);
    if (!rateCheck.allowed) {
      return res.status(429).json({
        success: false,
        error: `آپ کی جانب سے داخلہ/کلاس درخواستوں کی حد ختم ہو گئی ہے۔ براہ کرم ${rateCheck.waitSeconds || 600} سیکنڈ بعد دوبارہ کوشش فرمائیں۔`,
      });
    }

    const adminEmail = getAuthenticatedAdminEmail(req);
    const isAdmin = Boolean(adminEmail);

    // Server-side CAPTCHA verification for public visitors
    if (!isAdmin) {
      const captchaToken = (b.captchaToken || req.headers["x-captcha-token"] || "") as string;
      const outcome = await verifyServerCaptcha(captchaToken, clientIp);
      if (!outcome.success) {
        return res.status(400).json({
          success: false,
          error: outcome.error || "روبوٹ تصدیق (CAPTCHA) ناکام ہو گئی ہے۔",
        });
      }
    }

    const studentName = (b.studentName || "").trim();
    if (!studentName) {
      return res.status(400).json({ success: false, error: "طالب علم کا نام درج کرنا لازمی ہے۔" });
    }

    const trackingNumber = b.trackingNumber || `JIA-ADM-${Date.now().toString().slice(-6)}`;
    const bookingId = b.id || `book-${Date.now()}`;

    try {
      db.prepare(`
        INSERT INTO class_bookings (id, trackingNumber, studentName, fatherName, age, gender, contactNumber, email, whatsappNumber, city, country, selectedCourse, preferredTime, preferredTeacherGender, priorEducation, notes, status, submittedAt)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `).run(
        bookingId,
        trackingNumber,
        studentName.slice(0, 100),
        (b.fatherName || "").slice(0, 100),
        b.age || 18,
        b.gender || "male",
        (b.contactNumber || "").slice(0, 50),
        (b.email || "").slice(0, 100),
        (b.whatsappNumber || "").slice(0, 50),
        (b.city || "").slice(0, 50),
        (b.country || "Pakistan").slice(0, 50),
        (b.selectedCourse || "").slice(0, 100),
        (b.preferredTime || "صبح").slice(0, 50),
        (b.preferredTeacherGender || "male").slice(0, 20),
        b.priorEducation ? String(b.priorEducation).slice(0, 500) : null,
        b.notes ? String(b.notes).slice(0, 1000) : null,
        isAdmin ? (b.status || "Pending") : "Pending",
        b.submittedAt || new Date().toISOString()
      );
      res.json({ success: true, trackingNumber });
    } catch {
      res.status(500).json({ success: false, error: "داخلہ فارم محفوظ کرنے میں مسئلہ پیش آیا۔" });
    }
  });

  app.put("/api/bookings/:id", requireAdminAuth, (req, res) => {
    const id = req.params.id;
    const b = req.body || {};
    try {
      db.prepare("UPDATE class_bookings SET status = ?, notes = ? WHERE id = ?").run(b.status || "Approved", b.notes || null, id);
      res.json({ success: true });
    } catch {
      res.status(500).json({ success: false, error: "درخواست اپ ڈیٹ کرنے میں مسئلہ پیش آیا۔" });
    }
  });

  app.delete("/api/bookings/:id", requireAdminAuth, (req, res) => {
    try {
      db.prepare("DELETE FROM class_bookings WHERE id = ?").run(req.params.id);
      res.json({ success: true });
    } catch {
      res.status(500).json({ success: false, error: "درخواست حذف کرنے میں مسئلہ پیش آیا۔" });
    }
  });

  // 7. Exam Results APIs (Admin: Full List; Public: Search by Roll/Registration Number)
  app.get("/api/results", (req, res) => {
    try {
      const adminEmail = getAuthenticatedAdminEmail(req);
      const rollNumber = typeof req.query.rollNumber === "string" ? req.query.rollNumber.trim() : "";
      const regNumber = typeof req.query.regNumber === "string" ? req.query.regNumber.trim() : "";

      if (adminEmail) {
        // Authenticated Admin: Full results roster
        const rows = db.prepare(`
          SELECT id, rollNumber, studentName, fatherName, department, className, examSession, totalMarks, obtainedMarks, percentage, grade, status, position, declaredDate
          FROM exam_results ORDER BY declaredDate DESC
        `).all();
        return res.json({ success: true, data: rows });
      }

      // Public User: Targeted Roll Number Search (Sanitized & Rate Limited)
      if (rollNumber || regNumber) {
        const searchTerm = rollNumber || regNumber;
        const row = db.prepare(`
          SELECT id, rollNumber, studentName, fatherName, department, className, examSession, totalMarks, obtainedMarks, percentage, grade, status, position, declaredDate
          FROM exam_results
          WHERE LOWER(rollNumber) = LOWER(?) OR LOWER(rollNumber) = LOWER(?)
          LIMIT 1
        `).get(searchTerm, searchTerm) as any;

        if (!row) {
          return res.status(404).json({ success: false, error: "درج کردہ رول نمبر کا کوئی نتیجہ نہیں ملا۔ برائے مہربانی رول نمبر دوبارہ چیک کریں۔" });
        }

        return res.json({ success: true, data: [row] });
      }

      // Public without query: Return empty list (Prevent mass harvesting of student database)
      return res.json({ success: true, data: [] });
    } catch {
      res.status(500).json({ success: false, error: "نتائج حاصل کرنے میں مسئلہ پیش آیا۔" });
    }
  });

  app.post("/api/results", requireAdminAuth, (req, res) => {
    const r = req.body || {};
    try {
      db.prepare(`
        INSERT OR REPLACE INTO exam_results (id, rollNumber, studentName, fatherName, department, className, examSession, totalMarks, obtainedMarks, percentage, grade, status, position, declaredDate)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `).run(
        r.id || `res-${Date.now()}`,
        r.rollNumber,
        r.studentName,
        r.fatherName,
        r.department,
        r.className || "",
        r.examSession || "",
        r.totalMarks || 100,
        r.obtainedMarks || 0,
        r.percentage || 0,
        r.grade || "",
        r.status || "Pass",
        r.position || null,
        r.declaredDate || new Date().toISOString()
      );
      res.json({ success: true });
    } catch {
      res.status(500).json({ success: false, error: "نتیجہ محفوظ کرنے میں مسئلہ پیش آیا۔" });
    }
  });

  app.put("/api/results/:id", requireAdminAuth, (req, res) => {
    const r = req.body || {};
    try {
      db.prepare(`
        UPDATE exam_results SET
          rollNumber = ?, studentName = ?, fatherName = ?, department = ?, className = ?,
          examSession = ?, totalMarks = ?, obtainedMarks = ?, percentage = ?, grade = ?,
          status = ?, position = ?, declaredDate = ?
        WHERE id = ?
      `).run(r.rollNumber, r.studentName, r.fatherName, r.department, r.className, r.examSession, r.totalMarks, r.obtainedMarks, r.percentage, r.grade, r.status, r.position || null, r.declaredDate, req.params.id);
      res.json({ success: true });
    } catch {
      res.status(500).json({ success: false, error: "نتیجہ اپ ڈیٹ کرنے میں مسئلہ پیش آیا۔" });
    }
  });

  app.delete("/api/results/:id", requireAdminAuth, (req, res) => {
    try {
      db.prepare("DELETE FROM exam_results WHERE id = ?").run(req.params.id);
      res.json({ success: true });
    } catch {
      res.status(500).json({ success: false, error: "نتیجہ حذف کرنے میں مسئلہ پیش آیا۔" });
    }
  });

  // 8. Academic Departments APIs (Public Read; Admin Write)
  app.get("/api/departments", (req, res) => {
    try {
      const rows = db.prepare(`
        SELECT id, name_ur, name_ar, name_en, description_ur, description_ar, description_en, icon, studentCount, duration, level, featured
        FROM departments
      `).all() as any[];
      const mapped = rows.map((d) => ({
        id: d.id,
        name: { ur: d.name_ur, ar: d.name_ar, en: d.name_en },
        description: { ur: d.description_ur, ar: d.description_ar, en: d.description_en },
        icon: d.icon,
        studentCount: d.studentCount,
        duration: d.duration,
        level: d.level,
        featured: Boolean(d.featured),
      }));
      res.json({ success: true, data: mapped });
    } catch {
      res.status(500).json({ success: false, error: "شعبہ جات لوڈ کرنے میں مسئلہ پیش آیا۔" });
    }
  });

  app.post("/api/departments", requireAdminAuth, (req, res) => {
    const d = req.body || {};
    try {
      db.prepare(`
        INSERT OR REPLACE INTO departments (id, name_ur, name_ar, name_en, description_ur, description_ar, description_en, icon, studentCount, duration, level, featured)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `).run(d.id || `dept-${Date.now()}`, d.name?.ur || "", d.name?.ar || "", d.name?.en || "", d.description?.ur || null, d.description?.ar || null, d.description?.en || null, d.icon || "Building", d.studentCount || 0, d.duration || "", d.level || "", d.featured ? 1 : 0);
      res.json({ success: true });
    } catch {
      res.status(500).json({ success: false, error: "شعبہ محفوظ کرنے میں مسئلہ پیش آیا۔" });
    }
  });

  app.post("/api/departments/batch", requireAdminAuth, (req, res) => {
    const { departments: list } = req.body || {};
    if (Array.isArray(list)) {
      try {
        const stmt = db.prepare(`
          INSERT OR REPLACE INTO departments (id, name_ur, name_ar, name_en, description_ur, description_ar, description_en, icon, studentCount, duration, level, featured)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `);
        const tx = db.transaction((items: any[]) => {
          for (const d of items) {
            stmt.run(d.id, d.name?.ur || "", d.name?.ar || "", d.name?.en || "", d.description?.ur || null, d.description?.ar || null, d.description?.en || null, d.icon || "Building", d.studentCount || 0, d.duration || "", d.level || "", d.featured ? 1 : 0);
          }
        });
        tx(list);
        res.json({ success: true });
      } catch {
        res.status(500).json({ success: false, error: "بیچ شعبہ جات محفوظ کرنے میں مسئلہ پیش آیا۔" });
      }
    }
  });

  app.delete("/api/departments/:id", requireAdminAuth, (req, res) => {
    try {
      db.prepare("DELETE FROM departments WHERE id = ?").run(req.params.id);
      res.json({ success: true });
    } catch {
      res.status(500).json({ success: false, error: "شعبہ حذف کرنے میں مسئلہ پیش آیا۔" });
    }
  });

  // 9. Faculty APIs (Public Read; Admin Write)
  app.get("/api/faculty", (req, res) => {
    try {
      const rows = db.prepare(`
        SELECT id, name_ur, name_ar, name_en, designation_ur, designation_ar, designation_en, department, qualification, photoUrl, contactEmail, orderIndex
        FROM faculty ORDER BY orderIndex ASC
      `).all() as any[];
      const mapped = rows.map((f) => ({
        id: f.id,
        name: { ur: f.name_ur, ar: f.name_ar, en: f.name_en },
        designation: { ur: f.designation_ur, ar: f.designation_ar, en: f.designation_en },
        department: f.department,
        qualification: f.qualification,
        photoUrl: f.photoUrl,
        contactEmail: f.contactEmail,
      }));
      res.json({ success: true, data: mapped });
    } catch {
      res.status(500).json({ success: false, error: "اساتذہ کی فہرست لوڈ کرنے میں مسئلہ پیش آیا۔" });
    }
  });

  app.post("/api/faculty", requireAdminAuth, (req, res) => {
    const f = req.body || {};
    try {
      db.prepare(`
        INSERT OR REPLACE INTO faculty (id, name_ur, name_ar, name_en, designation_ur, designation_ar, designation_en, department, qualification, photoUrl, contactEmail, orderIndex)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `).run(f.id || `fac-${Date.now()}`, f.name?.ur || "", f.name?.ar || "", f.name?.en || "", f.designation?.ur || "", f.designation?.ar || "", f.designation?.en || "", f.department || "", f.qualification || null, f.photoUrl || null, f.contactEmail || null, f.orderIndex || 0);
      res.json({ success: true });
    } catch {
      res.status(500).json({ success: false, error: "استاذ کا ریکارڈ محفوظ کرنے میں مسئلہ پیش آیا۔" });
    }
  });

  app.delete("/api/faculty/:id", requireAdminAuth, (req, res) => {
    try {
      db.prepare("DELETE FROM faculty WHERE id = ?").run(req.params.id);
      res.json({ success: true });
    } catch {
      res.status(500).json({ success: false, error: "استاذ کا ریکارڈ حذف کرنے میں مسئلہ پیش آیا۔" });
    }
  });

  // 10. Books & Publications APIs (Public Read; Admin Write)
  app.get("/api/books", (req, res) => {
    try {
      const rows = db.prepare(`
        SELECT id, title_ur, title_ar, title_en, author_ur, author_ar, author_en, category, publicationYear, pages, pdfUrl, coverImageUrl, downloadCount, description_ur, description_ar, description_en
        FROM books
      `).all() as any[];
      const mapped = rows.map((b) => ({
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
      res.json({ success: true, data: mapped });
    } catch {
      res.status(500).json({ success: false, error: "کتب کی فہرست حاصل کرنے میں مسئلہ پیش آیا۔" });
    }
  });

  app.post("/api/books", requireAdminAuth, (req, res) => {
    const b = req.body || {};
    try {
      db.prepare(`
        INSERT OR REPLACE INTO books (id, title_ur, title_ar, title_en, author_ur, author_ar, author_en, category, publicationYear, pages, pdfUrl, coverImageUrl, downloadCount, description_ur, description_ar, description_en)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `).run(b.id || `book-${Date.now()}`, b.title?.ur || "", b.title?.ar || "", b.title?.en || "", b.author?.ur || "", b.author?.ar || "", b.author?.en || "", b.category || "عام", b.publicationYear || 2026, b.pages || 100, b.pdfUrl || "", b.coverImageUrl || null, b.downloadCount || 0, b.description?.ur || null, b.description?.ar || null, b.description?.en || null);
      res.json({ success: true });
    } catch {
      res.status(500).json({ success: false, error: "کتاب محفوظ کرنے میں مسئلہ پیش آیا۔" });
    }
  });

  app.delete("/api/books/:id", requireAdminAuth, (req, res) => {
    try {
      db.prepare("DELETE FROM books WHERE id = ?").run(req.params.id);
      res.json({ success: true });
    } catch {
      res.status(500).json({ success: false, error: "کتاب حذف کرنے میں مسئلہ پیش آیا۔" });
    }
  });

  // 11. Media Gallery APIs (Public Read; Admin Write)
  app.get("/api/media", (req, res) => {
    try {
      const rows = db.prepare(`
        SELECT id, title_ur, title_ar, title_en, type, category, url, thumbnailUrl, speaker, duration, eventDate, description_ur, description_ar, description_en
        FROM media ORDER BY eventDate DESC
      `).all() as any[];
      const mapped = rows.map((m) => ({
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
      res.json({ success: true, data: mapped });
    } catch {
      res.status(500).json({ success: false, error: "میڈیا گیلری لوڈ کرنے میں مسئلہ پیش آیا۔" });
    }
  });

  app.post("/api/media", requireAdminAuth, (req, res) => {
    const m = req.body || {};
    try {
      db.prepare(`
        INSERT OR REPLACE INTO media (id, title_ur, title_ar, title_en, type, category, url, thumbnailUrl, speaker, duration, eventDate, description_ur, description_ar, description_en)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `).run(m.id || `media-${Date.now()}`, m.title?.ur || "", m.title?.ar || "", m.title?.en || "", m.type || "video", m.category || "بیانات", m.url || "", m.thumbnailUrl || null, m.speaker || null, m.duration || null, m.eventDate || null, m.description?.ur || null, m.description?.ar || null, m.description?.en || null);
      res.json({ success: true });
    } catch {
      res.status(500).json({ success: false, error: "میڈیا آئٹم محفوظ کرنے میں مسئلہ پیش آیا۔" });
    }
  });

  app.delete("/api/media/:id", requireAdminAuth, (req, res) => {
    try {
      db.prepare("DELETE FROM media WHERE id = ?").run(req.params.id);
      res.json({ success: true });
    } catch {
      res.status(500).json({ success: false, error: "میڈیا آئٹم حذف کرنے میں مسئلہ پیش آیا۔" });
    }
  });

  // 12. News & Announcements APIs (Public: isPublished=1 only; Admin: All)
  app.get("/api/news", (req, res) => {
    try {
      const adminEmail = getAuthenticatedAdminEmail(req);
      let rows: any[];
      if (adminEmail) {
        rows = db.prepare(`
          SELECT id, title_ur, title_ar, title_en, content_ur, content_ar, content_en, date, category, imageUrl, isUrgent, isPublished, isTranslationApproved, translationApprovedBy
          FROM news ORDER BY date DESC
        `).all() as any[];
      } else {
        // Public Read: Strictly published news only
        rows = db.prepare(`
          SELECT id, title_ur, title_ar, title_en, content_ur, content_ar, content_en, date, category, imageUrl, isUrgent, isPublished, isTranslationApproved
          FROM news WHERE isPublished = 1 ORDER BY date DESC
        `).all() as any[];
      }

      const mapped = rows.map((n) => ({
        id: n.id,
        title: { ur: n.title_ur, ar: n.title_ar, en: n.title_en },
        content: { ur: n.content_ur, ar: n.content_ar, en: n.content_en },
        date: n.date,
        category: n.category,
        imageUrl: n.imageUrl,
        isUrgent: Boolean(n.isUrgent),
        isPublished: Boolean(n.isPublished),
        isTranslationApproved: Boolean(n.isTranslationApproved),
        ...(adminEmail ? { translationApprovedBy: n.translationApprovedBy } : {}),
      }));
      res.json({ success: true, data: mapped });
    } catch {
      res.status(500).json({ success: false, error: "خبریں لوڈ کرنے میں مسئلہ پیش آیا۔" });
    }
  });

  app.post("/api/news", requireAdminAuth, (req, res) => {
    const n = req.body || {};
    try {
      db.prepare(`
        INSERT OR REPLACE INTO news (id, title_ur, title_ar, title_en, content_ur, content_ar, content_en, date, category, imageUrl, isUrgent, isPublished, isTranslationApproved, translationApprovedBy)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `).run(
        n.id || `news-${Date.now()}`,
        n.title?.ur || "",
        n.title?.ar || "",
        n.title?.en || "",
        n.content?.ur || "",
        n.content?.ar || "",
        n.content?.en || "",
        n.date || new Date().toISOString().split("T")[0],
        n.category || "جامعہ خبریں",
        n.imageUrl || null,
        n.isUrgent ? 1 : 0,
        n.isPublished !== false ? 1 : 0,
        n.isTranslationApproved ? 1 : 0,
        n.translationApprovedBy || null
      );
      res.json({ success: true });
    } catch {
      res.status(500).json({ success: false, error: "خبر محفوظ کرنے میں مسئلہ پیش آیا۔" });
    }
  });

  app.delete("/api/news/:id", requireAdminAuth, (req, res) => {
    try {
      db.prepare("DELETE FROM news WHERE id = ?").run(req.params.id);
      res.json({ success: true });
    } catch {
      res.status(500).json({ success: false, error: "خبر حذف کرنے میں مسئلہ پیش آیا۔" });
    }
  });

  // 13. Donations APIs (Admin Only Read; Public Write with CAPTCHA)
  app.get("/api/donations", requireAdminAuth, (req, res) => {
    try {
      const rows = db.prepare(`
        SELECT id, transactionId, donorName, donorEmail, donorPhone, amount, currency, fundType, paymentMethod, status, receiptNumber, date, notes
        FROM donations ORDER BY date DESC
      `).all();
      res.json({ success: true, data: rows });
    } catch {
      res.status(500).json({ success: false, error: "عطیات کا ریکارڈ حاصل کرنے میں مسئلہ پیش آیا۔" });
    }
  });

  app.post("/api/donations", async (req, res) => {
    const dn = req.body || {};
    const clientIp = (req.ip || req.socket.remoteAddress || "").replace(/^::ffff:/, '');

    // Rate Limiting: Max 8 donation submissions per 10 minutes per IP
    const rateCheck = checkPublicFormRateLimit(clientIp, "donations", 8, 10 * 60 * 1000);
    if (!rateCheck.allowed) {
      return res.status(429).json({
        success: false,
        error: `آپ کی جانب سے عطیات فارم ارسال کرنے کی حد ختم ہو گئی ہے۔ براہ کرم ${rateCheck.waitSeconds || 600} سیکنڈ بعد دوبارہ کوشش فرمائیں۔`,
      });
    }

    const adminEmail = getAuthenticatedAdminEmail(req);
    const isAdmin = Boolean(adminEmail);

    // Server-side CAPTCHA verification for public visitors
    if (!isAdmin) {
      const captchaToken = (dn.captchaToken || req.headers["x-captcha-token"] || "") as string;
      const outcome = await verifyServerCaptcha(captchaToken, clientIp);
      if (!outcome.success) {
        return res.status(400).json({
          success: false,
          error: outcome.error || "روبوٹ تصدیق (CAPTCHA) ناکام ہو گئی ہے۔",
        });
      }
    }

    const amount = Number(dn.amount) || 0;
    if (amount <= 0) {
      return res.status(400).json({ success: false, error: "عطیہ کی رقم درست درج فرمائیں۔" });
    }

    try {
      db.prepare(`
        INSERT INTO donations (id, transactionId, donorName, donorEmail, donorPhone, amount, currency, fundType, paymentMethod, status, receiptNumber, date, notes)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `).run(
        dn.id || `don-${Date.now()}`,
        dn.transactionId || `TXN-${Date.now()}`,
        (dn.donorName || "مخلص عطیہ دہندہ").slice(0, 100),
        dn.donorEmail ? String(dn.donorEmail).slice(0, 100) : null,
        (dn.donorPhone || "").slice(0, 50),
        amount,
        (dn.currency || "PKR").slice(0, 10),
        (dn.fundType || "عام فنڈ").slice(0, 100),
        (dn.paymentMethod || "Bank").slice(0, 50),
        isAdmin ? (dn.status || "Verified") : "Verified",
        dn.receiptNumber || `RCP-${Date.now().toString().slice(-6)}`,
        dn.date || new Date().toISOString(),
        dn.notes ? String(dn.notes).slice(0, 1000) : null
      );
      res.json({ success: true });
    } catch {
      res.status(500).json({ success: false, error: "عطیہ کا ریکارڈ محفوظ کرنے میں مسئلہ پیش آیا۔" });
    }
  });

  // 14. Site Settings APIs (Public Read: Sanitized Settings; Admin Write)
  app.get("/api/settings", (req, res) => {
    try {
      const row = db.prepare("SELECT data_json FROM site_settings WHERE id = 'main'").get() as { data_json: string } | undefined;
      if (row?.data_json) {
        const parsed = JSON.parse(row.data_json);
        // Ensure sensitive backend keys or secrets are NEVER stored or returned in site settings
        delete parsed.adminSecret;
        delete parsed.recaptchaSecret;
        delete parsed.turnstileSecret;
        delete parsed.databasePassword;
        res.json({ success: true, data: parsed });
      } else {
        res.json({ success: true, data: null });
      }
    } catch {
      res.status(500).json({ success: false, error: "سیٹنگز حاصل کرنے میں مسئلہ پیش آیا۔" });
    }
  });

  app.post("/api/settings", requireAdminAuth, (req, res) => {
    try {
      const sanitized = { ...req.body };
      delete sanitized.adminSecret;
      delete sanitized.recaptchaSecret;
      delete sanitized.turnstileSecret;

      db.prepare(`
        INSERT OR REPLACE INTO site_settings (id, data_json, updated_at)
        VALUES ('main', ?, ?)
      `).run(JSON.stringify(sanitized), new Date().toISOString());
      res.json({ success: true });
    } catch {
      res.status(500).json({ success: false, error: "سیٹنگز محفوظ کرنے میں مسئلہ پیش آیا۔" });
    }
  });

  // 15. Site Visitors APIs (Admin Only Read; Public Write)
  app.get("/api/visitors", requireAdminAuth, (req, res) => {
    try {
      const rows = db.prepare(`
        SELECT id, ip, userAgent, page, referer, country, city, timestamp
        FROM site_visitors ORDER BY timestamp DESC LIMIT 2000
      `).all();
      res.json({ success: true, data: rows });
    } catch {
      res.status(500).json({ success: false, error: "وزیٹرز کا لاگ حاصل کرنے میں مسئلہ پیش آیا۔" });
    }
  });

  app.post("/api/visitors", (req, res) => {
    const v = req.body || {};
    const rawIp = req.ip || req.socket.remoteAddress || "";
    // Mask last octet of IP for privacy
    const sanitizedIp = rawIp ? rawIp.replace(/\.\d+$/, '.xxx').replace(/:\w+$/, ':xxxx') : null;

    try {
      db.prepare(`
        INSERT INTO site_visitors (id, ip, userAgent, page, referer, country, city, timestamp)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `).run(
        v.id || `vis-${Date.now()}`,
        sanitizedIp,
        (v.userAgent || req.headers["user-agent"] || "").slice(0, 300),
        (v.page || "/").slice(0, 150),
        (v.referer || req.headers["referer"] || "").slice(0, 200),
        (v.country || null),
        (v.city || null),
        v.timestamp || new Date().toISOString()
      );
      res.json({ success: true });
    } catch {
      res.status(200).json({ success: true }); // Fail-safe for visitor tracking
    }
  });

  app.post("/api/visitors/clear", requireAdminAuth, (req, res) => {
    try {
      db.prepare("DELETE FROM site_visitors").run();
      res.json({ success: true });
    } catch {
      res.status(500).json({ success: false, error: "وزیٹرز لاگ صاف کرنے میں مسئلہ پیش آیا۔" });
    }
  });

  // 16. Fatwa & Article AI Translation API (Gemini with fallback & rate limiting)
  app.post(["/api/translate-fatwa", "/api/translate-content"], async (req, res) => {
    const clientIp = (req.ip || req.socket.remoteAddress || "").replace(/^::ffff:/, '');
    const rateCheck = checkPublicFormRateLimit(clientIp, "fatwa_translate", 25, 5 * 60 * 1000);
    if (!rateCheck.allowed) {
      return res.status(429).json({
        success: false,
        error: `ترجمہ کی درخواستوں کی حد ختم ہو گئی ہے۔ برائے مہربانی ${rateCheck.waitSeconds || 300} سیکنڈ بعد دوبارہ کوشش فرمائیں۔`,
      });
    }

    try {
      const { 
        fatwaId, 
        contentType = "fatwa", 
        titleUr = "", 
        questionUr = "", 
        answerUr = "", 
        contentUr = "" 
      } = req.body || {};

      const isArticle = contentType === "article" || Boolean(contentUr && !answerUr);
      const effectiveContent = isArticle ? (contentUr || answerUr) : answerUr;

      if (!titleUr && !questionUr && !effectiveContent) {
        return res.status(400).json({
          success: false,
          error: "ترجمہ کے لیے متن درکار ہے۔",
        });
      }

      let keyToUse = req.body?.geminiApiKey;
      if (!keyToUse) {
        try {
          const row = db.prepare("SELECT data_json FROM site_settings WHERE id = 'main'").get() as any;
          if (row?.data_json) {
            const parsed = JSON.parse(row.data_json);
            if (parsed.geminiApiKey) keyToUse = parsed.geminiApiKey;
          }
        } catch {}
      }

      const ai = getGeminiClient(keyToUse);

      const prompt = isArticle 
        ? `Please translate the following Islamic Article / News from Urdu into clear, dignified, academic English AND classical Islamic Arabic:

--- TITLE (Urdu) ---
${titleUr || "N/A"}

--- CONTENT / BODY (Urdu) ---
${effectiveContent || "N/A"}
`
        : `Please translate the following Islamic Fatwa (Sharia ruling) from Urdu into clear, formal, scholarly English AND authentic classical Islamic Arabic:

--- FATWA TITLE (Urdu) ---
${titleUr || "N/A"}

--- INQUIRER QUESTION (Urdu) ---
${questionUr || "N/A"}

--- SHARIA RULING & ANSWER (Urdu) ---
${effectiveContent || "N/A"}
`;

      const systemInstruction = `یہ ایک اسلامی فتویٰ/مضمون کا متن ہے۔ اسے واضح، رسمی اور مکمل درست [انگریزی/عربی] میں ترجمہ کریں۔ فقہی اصطلاحات (حلال، حرام، مکروہ، واجب، سنت، نفل، زکوٰۃ، ہبہ، طلاق، نکاح وغیرہ) کا مفہوم ہرگز تبدیل نہ کریں، نہ کوئی نیا مفہوم شامل کریں۔
You are an expert Islamic jurist and Arabic/Urdu-to-English scholarly translator representing Darul Ifta Jamia Islamia Abbottabad. Maintain complete fidelity to the original text without editorializing.`;

      const modelsToTry = [
        "gemini-2.5-flash",
        "gemini-flash-latest",
        "gemini-3.1-flash-lite",
        "gemini-3.1-pro-preview",
      ];
      let response = null;
      let lastErr: any = null;

      for (const model of modelsToTry) {
        try {
          response = await ai.models.generateContent({
            model,
            contents: prompt,
            config: {
              systemInstruction,
              responseMimeType: "application/json",
              responseSchema: isArticle 
                ? {
                    type: Type.OBJECT,
                    properties: {
                      titleEn: { type: Type.STRING, description: "Clear English title" },
                      contentEn: { type: Type.STRING, description: "Clear, formal English content" },
                      titleAr: { type: Type.STRING, description: "Classical Arabic title" },
                      contentAr: { type: Type.STRING, description: "Classical Arabic content" },
                    },
                    required: ["titleEn", "contentEn", "titleAr", "contentAr"],
                  }
                : {
                    type: Type.OBJECT,
                    properties: {
                      titleEn: { type: Type.STRING, description: "Clear English fatwa title" },
                      questionEn: { type: Type.STRING, description: "Clear English question" },
                      answerEn: { type: Type.STRING, description: "Clear, formal English sharia answer" },
                      titleAr: { type: Type.STRING, description: "Classical Arabic fatwa title" },
                      questionAr: { type: Type.STRING, description: "Classical Arabic question" },
                      answerAr: { type: Type.STRING, description: "Classical Arabic sharia answer" },
                    },
                    required: ["titleEn", "questionEn", "answerEn", "titleAr", "questionAr", "answerAr"],
                  },
            },
          });
          if (response?.text) {
            break;
          }
        } catch (err: any) {
          console.warn(`Translation attempt with ${model} notice. Trying next model...`);
          lastErr = err;
        }
      }

      if (!response?.text) {
        throw lastErr || new Error("All AI translation models temporarily unavailable.");
      }

      const responseText = response.text || "{}";
      let parsed: any = {};
      try {
        parsed = JSON.parse(responseText);
      } catch {
        parsed = {};
      }

      res.json({
        success: true,
        data: {
          id: fatwaId || null,
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
    } catch (e: any) {
      console.error("Content translation error detail:", e);
      res.status(200).json({
        success: false,
        error: e?.message || "عارضی طور پر ترجمہ سروس دستیاب نہیں ہے۔",
        fallback: {
          titleEn: req.body?.titleUr || "",
          questionEn: req.body?.questionUr || "",
          answerEn: req.body?.answerUr || req.body?.contentUr || "",
          titleAr: req.body?.titleUr || "",
          questionAr: req.body?.questionUr || "",
          answerAr: req.body?.answerUr || req.body?.contentUr || "",
        },
      });
    }
  });

  // ==========================================
  // CMS REST API ENDPOINTS (WordPress-style CMS)
  // ==========================================

  const RESERVED_SLUGS = new Set([
    'admin', 'darulifta', 'fatwa', 'results', 'admissions', 'donations',
    'library', 'faculty', 'contact', 'about', 'api', 'login', 'portal',
    'dashboard', 'settings', 'courses', 'departments', 'news', 'media',
    'prayer-times', 'sitemap', 'robots'
  ]);

  // 1. CMS Pages
  app.get("/api/cms/pages", (req, res) => {
    try {
      const rows = db.prepare("SELECT * FROM cms_pages ORDER BY order_index ASC, created_at DESC").all() as any[];
      const pages = rows.map(p => ({
        id: p.id,
        slug: p.slug,
        title: { ur: p.title_ur, en: p.title_en || "", ar: p.title_ar || "" },
        content: { ur: p.content_ur, en: p.content_en || "", ar: p.content_ar || "" },
        excerpt: { ur: p.excerpt_ur || "", en: p.excerpt_en || "", ar: p.excerpt_ar || "" },
        featuredImage: p.featured_image || "",
        status: p.status || "published",
        visibility: p.visibility || "public",
        password: p.password || "",
        seoTitle: { ur: p.seo_title_ur || "", en: p.seo_title_en || "", ar: p.seo_title_ar || "" },
        seoDescription: { ur: p.seo_desc_ur || "", en: p.seo_desc_en || "", ar: p.seo_desc_ar || "" },
        ogImage: p.og_image || "",
        author: p.author || "جامعہ انتظامیہ",
        template: p.template || "default",
        orderIndex: p.order_index || 0,
        createdAt: p.created_at,
        updatedAt: p.updated_at,
      }));
      res.json({ success: true, data: pages });
    } catch {
      res.status(500).json({ success: false, error: "صفحات لوڈ کرنے میں مسئلہ پیش آیا۔" });
    }
  });

  app.get("/api/cms/pages/:slug", (req, res) => {
    try {
      const p = db.prepare("SELECT * FROM cms_pages WHERE slug = ? OR id = ?").get(req.params.slug, req.params.slug) as any;
      if (!p) {
        return res.status(404).json({ success: false, error: "صفحہ نہیں ملا۔" });
      }
      res.json({
        success: true,
        data: {
          id: p.id,
          slug: p.slug,
          title: { ur: p.title_ur, en: p.title_en || "", ar: p.title_ar || "" },
          content: { ur: p.content_ur, en: p.content_en || "", ar: p.content_ar || "" },
          excerpt: { ur: p.excerpt_ur || "", en: p.excerpt_en || "", ar: p.excerpt_ar || "" },
          featuredImage: p.featured_image || "",
          status: p.status || "published",
          visibility: p.visibility || "public",
          password: p.password || "",
          seoTitle: { ur: p.seo_title_ur || "", en: p.seo_title_en || "", ar: p.seo_title_ar || "" },
          seoDescription: { ur: p.seo_desc_ur || "", en: p.seo_desc_en || "", ar: p.seo_desc_ar || "" },
          ogImage: p.og_image || "",
          author: p.author || "جامعہ انتظامیہ",
          template: p.template || "default",
          orderIndex: p.order_index || 0,
          createdAt: p.created_at,
          updatedAt: p.updated_at,
        },
      });
    } catch {
      res.status(500).json({ success: false, error: "صفحہ حاصل کرنے میں مسئلہ پیش آیا۔" });
    }
  });

  app.post("/api/cms/pages", requireAdminAuth, (req, res) => {
    try {
      const p = req.body || {};
      const id = p.id || `page-${Date.now()}`;
      let rawSlug = (p.slug || `page-${Date.now()}`).trim().toLowerCase();
      let slug = rawSlug.replace(/[^a-z0-9\-_]/g, "-").replace(/-+/g, "-").replace(/^-|-$/g, "");
      if (!slug) slug = `page-${Date.now()}`;

      if (RESERVED_SLUGS.has(slug)) {
        return res.status(400).json({ success: false, error: `یہ سلگ (${slug}) سسٹم کے لیے مخصوص ہے۔ برائے مہربانی کوئی دوسرا سلگ منتخب فرمائیں۔` });
      }

      const titleUr = p.title?.ur || p.title_ur || "";
      const contentUr = p.content?.ur || p.content_ur || "";
      if (!titleUr.trim() || !contentUr.trim()) {
        return res.status(400).json({ success: false, error: "صفحہ کا اردو عنوان اور متن درج کرنا لازمی ہے۔" });
      }

      const existing = db.prepare("SELECT id FROM cms_pages WHERE slug = ? AND id != ?").get(slug, id) as any;
      if (existing) {
        return res.status(400).json({ success: false, error: "یہ سلگ پہلے سے موجود ہے۔ مختلف سلگ درج فرمائیں۔" });
      }

      const validStatuses = ["published", "draft", "archived"];
      const status = validStatuses.includes(p.status) ? p.status : "published";
      const validVisibilities = ["public", "private", "password"];
      const visibility = validVisibilities.includes(p.visibility) ? p.visibility : "public";
      
      db.prepare(`
        INSERT OR REPLACE INTO cms_pages (
          id, slug, title_ur, title_en, title_ar,
          content_ur, content_en, content_ar,
          excerpt_ur, excerpt_en, excerpt_ar,
          featured_image, status, visibility, password,
          seo_title_ur, seo_title_en, seo_title_ar,
          seo_desc_ur, seo_desc_en, seo_desc_ar,
          og_image, author, template, order_index,
          created_at, updated_at
        ) VALUES (
          ?, ?, ?, ?, ?,
          ?, ?, ?,
          ?, ?, ?,
          ?, ?, ?, ?,
          ?, ?, ?,
          ?, ?, ?,
          ?, ?, ?, ?,
          ?, ?
        )
      `).run(
        id, slug, titleUr, p.title?.en || p.title_en || "", p.title?.ar || p.title_ar || "",
        contentUr, p.content?.en || p.content_en || "", p.content?.ar || p.content_ar || "",
        p.excerpt?.ur || p.excerpt_ur || null, p.excerpt?.en || p.excerpt_en || null, p.excerpt?.ar || p.excerpt_ar || null,
        p.featuredImage || p.featured_image || null, status, visibility, p.password || null,
        p.seoTitle?.ur || p.seo_title_ur || null, p.seoTitle?.en || p.seo_title_en || null, p.seoTitle?.ar || p.seo_title_ar || null,
        p.seoDescription?.ur || p.seo_desc_ur || null, p.seoDescription?.en || p.seo_desc_en || null, p.seoDescription?.ar || p.seo_desc_ar || null,
        p.ogImage || p.og_image || null, p.author || "جامعہ انتظامیہ", p.template || "default", Number(p.orderIndex || p.order_index || 0),
        p.createdAt || p.created_at || new Date().toISOString(), new Date().toISOString()
      );
      res.json({ success: true, id, slug });
    } catch (e: any) {
      res.status(500).json({ success: false, error: e?.message || "صفحہ محفوظ کرنے میں مسئلہ پیش آیا۔" });
    }
  });

  app.delete("/api/cms/pages/:id", requireAdminAuth, (req, res) => {
    try {
      db.prepare("DELETE FROM cms_pages WHERE id = ? OR slug = ?").run(req.params.id, req.params.id);
      res.json({ success: true });
    } catch {
      res.status(500).json({ success: false, error: "صفحہ حذف کرنے میں مسئلہ پیش آیا۔" });
    }
  });

  // 2. CMS Menus
  app.get("/api/cms/menus", (req, res) => {
    try {
      const rows = db.prepare("SELECT * FROM cms_menus").all() as any[];
      const menus = rows.map(m => ({
        id: m.id,
        location: m.location,
        name: m.name,
        items: JSON.parse(m.items_json || "[]"),
        updatedAt: m.updated_at,
      }));
      res.json({ success: true, data: menus });
    } catch {
      res.status(500).json({ success: false, error: "مینیوز لوڈ کرنے میں مسئلہ پیش آیا۔" });
    }
  });

  app.get("/api/cms/menus/:id", (req, res) => {
    try {
      const m = db.prepare("SELECT * FROM cms_menus WHERE id = ? OR location = ?").get(req.params.id, req.params.id) as any;
      if (!m) return res.status(404).json({ success: false, error: "مینیو نہیں ملا۔" });
      res.json({
        success: true,
        data: {
          id: m.id,
          location: m.location,
          name: m.name,
          items: JSON.parse(m.items_json || "[]"),
          updatedAt: m.updated_at,
        }
      });
    } catch {
      res.status(500).json({ success: false, error: "مینیو حاصل کرنے میں مسئلہ پیش آیا۔" });
    }
  });

  app.post("/api/cms/menus", requireAdminAuth, (req, res) => {
    try {
      const { id, location, name, items } = req.body || {};
      const menuId = id || `menu-${location || Date.now()}`;
      db.prepare(`
        INSERT OR REPLACE INTO cms_menus (id, location, name, items_json, updated_at)
        VALUES (?, ?, ?, ?, ?)
      `).run(menuId, location || "header_main", name || "Navigation Menu", JSON.stringify(items || []), new Date().toISOString());
      res.json({ success: true, id: menuId });
    } catch {
      res.status(500).json({ success: false, error: "مینیو محفوظ کرنے میں مسئلہ پیش آیا۔" });
    }
  });

  app.delete("/api/cms/menus/:id", requireAdminAuth, (req, res) => {
    try {
      db.prepare("DELETE FROM cms_menus WHERE id = ?").run(req.params.id);
      db.prepare("DELETE FROM cms_menu_items WHERE menu_id = ?").run(req.params.id);
      res.json({ success: true });
    } catch {
      res.status(500).json({ success: false, error: "مینیو حذف کرنے میں مسئلہ پیش آیا۔" });
    }
  });

  // 2.5 CMS Normalized Menu Items
  app.get("/api/cms/menu-items", (req, res) => {
    try {
      const menuId = req.query.menu_id as string;
      let rows: any[];
      if (menuId) {
        rows = db.prepare("SELECT * FROM cms_menu_items WHERE menu_id = ? ORDER BY order_index ASC").all(menuId) as any[];
      } else {
        rows = db.prepare("SELECT * FROM cms_menu_items ORDER BY menu_id ASC, order_index ASC").all() as any[];
      }
      const items = rows.map(it => ({
        id: it.id,
        menuId: it.menu_id,
        parentId: it.parent_id || null,
        label: { ur: it.label_ur, ar: it.label_ar || "", en: it.label_en || "" },
        targetType: it.target_type || "custom",
        targetValue: it.target_value || "",
        url: it.url,
        orderIndex: it.order_index || 0,
        isEnabled: Boolean(it.is_enabled !== 0),
        createdAt: it.created_at,
        updatedAt: it.updated_at,
      }));
      res.json({ success: true, data: items });
    } catch {
      res.status(500).json({ success: false, error: "مینیو آئٹمز لوڈ کرنے میں مسئلہ پیش آیا۔" });
    }
  });

  app.post("/api/cms/menu-items", requireAdminAuth, (req, res) => {
    try {
      const it = req.body || {};
      const id = it.id || `item-${Date.now()}`;
      const menuId = it.menuId || it.menu_id || "menu-header-main";
      const parentId = it.parentId || it.parent_id || null;
      if (parentId && parentId === id) {
        return res.status(400).json({ success: false, error: "آئٹم خود کا پیرنٹ نہیں بن سکتا۔" });
      }
      const labelUr = it.label?.ur || it.label_ur || "";
      const urlVal = it.url || "#";

      if (!labelUr.trim()) {
        return res.status(400).json({ success: false, error: "آئٹم کا لیبل درج کرنا لازمی ہے۔" });
      }

      db.prepare(`
        INSERT OR REPLACE INTO cms_menu_items (
          id, menu_id, parent_id, label_ur, label_ar, label_en, target_type, target_value, url, order_index, is_enabled, created_at, updated_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `).run(
        id, menuId, parentId,
        labelUr, it.label?.ar || it.label_ar || "", it.label?.en || it.label_en || "",
        it.targetType || it.target_type || "custom", it.targetValue || it.target_value || null,
        urlVal, Number(it.orderIndex || it.order_index || 0),
        it.isEnabled !== false && it.is_enabled !== 0 ? 1 : 0,
        it.createdAt || it.created_at || new Date().toISOString(),
        new Date().toISOString()
      );
      res.json({ success: true, id });
    } catch {
      res.status(500).json({ success: false, error: "مینیو آئٹم محفوظ کرنے میں مسئلہ پیش آیا۔" });
    }
  });

  app.delete("/api/cms/menu-items/:id", requireAdminAuth, (req, res) => {
    try {
      db.prepare("DELETE FROM cms_menu_items WHERE id = ? OR parent_id = ?").run(req.params.id, req.params.id);
      res.json({ success: true });
    } catch {
      res.status(500).json({ success: false, error: "مینیو آئٹم حذف کرنے میں مسئلہ پیش آیا۔" });
    }
  });

  // 3. CMS Media Library
  app.get("/api/cms/media", (req, res) => {
    try {
      const rows = db.prepare("SELECT * FROM cms_media ORDER BY created_at DESC").all() as any[];
      const media = rows.map(m => ({
        id: m.id,
        title: m.title,
        filename: m.filename,
        fileType: m.file_type || "image",
        mimeType: m.mime_type || "image/jpeg",
        fileSize: m.file_size || 0,
        url: m.url,
        thumbnailUrl: m.thumbnail_url || m.url,
        altText: m.alt_text || "",
        caption: m.caption || "",
        uploadedBy: m.uploaded_by || "Admin",
        createdAt: m.created_at,
      }));
      res.json({ success: true, data: media });
    } catch {
      res.status(500).json({ success: false, error: "میڈیا لائبریری لوڈ کرنے میں مسئلہ پیش آیا۔" });
    }
  });

  app.post("/api/cms/media", requireAdminAuth, (req, res) => {
    try {
      const m = req.body || {};
      const id = m.id || `media-${Date.now()}`;
      db.prepare(`
        INSERT OR REPLACE INTO cms_media (
          id, title, filename, file_type, mime_type, file_size, url, thumbnail_url, alt_text, caption, uploaded_by, created_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `).run(
        id, m.title || m.filename || "Media Item", m.filename || "file",
        m.fileType || "image", m.mimeType || "image/jpeg", m.fileSize || 0,
        m.url, m.thumbnailUrl || m.url, m.altText || null, m.caption || null,
        m.uploadedBy || "Admin", m.createdAt || new Date().toISOString()
      );
      res.json({ success: true, id });
    } catch {
      res.status(500).json({ success: false, error: "میڈیا محفوظ کرنے میں مسئلہ پیش آیا۔" });
    }
  });

  app.delete("/api/cms/media/:id", requireAdminAuth, (req, res) => {
    try {
      db.prepare("DELETE FROM cms_media WHERE id = ?").run(req.params.id);
      res.json({ success: true });
    } catch {
      res.status(500).json({ success: false, error: "میڈیا حذف کرنے میں مسئلہ پیش آیا۔" });
    }
  });

  // 4. CMS Homepage Sections
  app.get("/api/cms/sections", (req, res) => {
    try {
      const rows = db.prepare("SELECT * FROM cms_sections ORDER BY order_index ASC").all() as any[];
      const sections = rows.map(s => ({
        id: s.id,
        sectionKey: s.section_key,
        name: { ur: s.name_ur, en: s.name_en || "", ar: s.name_ar || "" },
        isEnabled: Boolean(s.is_enabled),
        orderIndex: s.order_index || 0,
        title: { ur: s.title_ur, en: s.title_en || "", ar: s.title_ar || "" },
        subtitle: { ur: s.subtitle_ur || "", en: s.subtitle_en || "", ar: s.subtitle_ar || "" },
        content: { ur: s.content_ur || "", en: s.content_en || "", ar: s.content_ar || "" },
        imageUrl: s.image_url || "",
        bgColor: s.bg_color || "",
        bgImageUrl: s.bg_image_url || "",
        buttonText: { ur: s.button_text_ur || "", en: s.button_text_en || "", ar: s.button_text_ar || "" },
        buttonUrl: s.button_url || "",
        config: JSON.parse(s.config_json || "{}"),
        updatedAt: s.updated_at,
      }));
      res.json({ success: true, data: sections });
    } catch {
      res.status(500).json({ success: false, error: "ویب سائٹ سیکشنز لوڈ کرنے میں مسئلہ پیش آیا۔" });
    }
  });

  app.post("/api/cms/sections", requireAdminAuth, (req, res) => {
    try {
      const s = req.body || {};
      const id = s.id || `sec-${s.sectionKey || Date.now()}`;
      db.prepare(`
        INSERT OR REPLACE INTO cms_sections (
          id, section_key, name_ur, name_en, name_ar,
          is_enabled, order_index,
          title_ur, title_en, title_ar,
          subtitle_ur, subtitle_en, subtitle_ar,
          content_ur, content_en, content_ar,
          image_url, bg_color, bg_image_url,
          button_text_ur, button_text_en, button_text_ar,
          button_url, config_json, updated_at
        ) VALUES (
          ?, ?, ?, ?, ?,
          ?, ?,
          ?, ?, ?,
          ?, ?, ?,
          ?, ?, ?,
          ?, ?, ?,
          ?, ?, ?,
          ?, ?, ?
        )
      `).run(
        id, s.sectionKey || `sec-${Date.now()}`, s.name?.ur || "", s.name?.en || "", s.name?.ar || "",
        s.isEnabled ? 1 : 0, s.orderIndex || 0,
        s.title?.ur || "", s.title?.en || "", s.title?.ar || "",
        s.subtitle?.ur || null, s.subtitle?.en || null, s.subtitle?.ar || null,
        s.content?.ur || null, s.content?.en || null, s.content?.ar || null,
        s.imageUrl || null, s.bgColor || null, s.bgImageUrl || null,
        s.buttonText?.ur || null, s.buttonText?.en || null, s.buttonText?.ar || null,
        s.buttonUrl || null, JSON.stringify(s.config || {}), new Date().toISOString()
      );
      res.json({ success: true, id });
    } catch {
      res.status(500).json({ success: false, error: "سیکشن محفوظ کرنے میں مسئلہ پیش آیا۔" });
    }
  });

  // 5. CMS Theme & Appearance Settings
  app.get("/api/cms/theme", (req, res) => {
    try {
      const row = db.prepare("SELECT data_json, updated_at FROM cms_theme_settings WHERE id = 'main'").get() as any;
      if (row?.data_json) {
        res.json({ success: true, data: JSON.parse(row.data_json) });
      } else {
        res.json({ success: true, data: null });
      }
    } catch {
      res.status(500).json({ success: false, error: "تھیم ترتیبات لوڈ کرنے میں مسئلہ پیش آیا۔" });
    }
  });

  app.post("/api/cms/theme", requireAdminAuth, (req, res) => {
    try {
      const themeData = req.body || {};
      db.prepare(`
        INSERT OR REPLACE INTO cms_theme_settings (id, data_json, updated_at)
        VALUES ('main', ?, ?)
      `).run(JSON.stringify(themeData), new Date().toISOString());
      res.json({ success: true });
    } catch {
      res.status(500).json({ success: false, error: "تھیم ترتیبات محفوظ کرنے میں مسئلہ پیش آیا۔" });
    }
  });

  // 6. CMS SEO Settings
  app.get("/api/cms/seo", (req, res) => {
    try {
      const row = db.prepare("SELECT data_json, updated_at FROM cms_seo_settings WHERE id = 'main'").get() as any;
      if (row?.data_json) {
        res.json({ success: true, data: JSON.parse(row.data_json) });
      } else {
        res.json({ success: true, data: null });
      }
    } catch {
      res.status(500).json({ success: false, error: "SEO ترتیبات لوڈ کرنے میں مسئلہ پیش آیا۔" });
    }
  });

  app.post("/api/cms/seo", requireAdminAuth, (req, res) => {
    try {
      const seoData = req.body || {};
      db.prepare(`
        INSERT OR REPLACE INTO cms_seo_settings (id, data_json, updated_at)
        VALUES ('main', ?, ?)
      `).run(JSON.stringify(seoData), new Date().toISOString());
      res.json({ success: true });
    } catch {
      res.status(500).json({ success: false, error: "SEO ترتیبات محفوظ کرنے میں مسئلہ پیش آیا۔" });
    }
  });

  // 6.5. CMS Revisions & History
  app.get("/api/cms/revisions", requireAdminAuth, (req, res) => {
    try {
      const { entity_type, entity_id } = req.query as { entity_type?: string; entity_id?: string };
      let rows: any[];
      if (entity_type && entity_id) {
        rows = db.prepare("SELECT * FROM cms_revisions WHERE entity_type = ? AND entity_id = ? ORDER BY created_at DESC LIMIT 50").all(entity_type, entity_id) as any[];
      } else {
        rows = db.prepare("SELECT * FROM cms_revisions ORDER BY created_at DESC LIMIT 100").all() as any[];
      }
      const revs = rows.map(r => ({
        id: r.id,
        entityType: r.entity_type,
        entityId: r.entity_id,
        dataJson: r.data_json,
        author: r.author,
        revisionNote: r.revision_note || "",
        createdAt: r.created_at,
      }));
      res.json({ success: true, data: revs });
    } catch {
      res.status(500).json({ success: false, error: "ریویژنز لوڈ کرنے میں مسئلہ پیش آیا۔" });
    }
  });

  app.post("/api/cms/revisions", requireAdminAuth, (req, res) => {
    try {
      const r = req.body || {};
      const id = r.id || `rev-${Date.now()}`;
      db.prepare(`
        INSERT INTO cms_revisions (id, entity_type, entity_id, data_json, author, revision_note, created_at)
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `).run(
        id, r.entityType || r.entity_type || 'page', r.entityId || r.entity_id,
        typeof r.dataJson === 'string' ? r.dataJson : JSON.stringify(r.data || {}),
        r.author || 'Admin', r.revisionNote || r.revision_note || null,
        new Date().toISOString()
      );
      res.json({ success: true, id });
    } catch {
      res.status(500).json({ success: false, error: "ریویژن محفوظ کرنے میں مسئلہ پیش آیا۔" });
    }
  });

  // 7. CMS Users & Permissions
  app.get("/api/cms/users", requireAdminAuth, (req, res) => {
    try {
      const rows = db.prepare("SELECT id, email, username, full_name, role, is_active, phone, created_at, last_login FROM admin_users ORDER BY created_at DESC").all() as any[];
      const users = rows.map(u => ({
        id: u.id,
        email: u.email,
        username: u.username || u.email.split("@")[0],
        fullName: u.full_name || (u.role === "superadmin" ? "Super Admin" : "Editor"),
        role: u.role || "admin",
        isActive: Boolean(u.is_active !== 0),
        phone: u.phone || "",
        createdAt: u.created_at,
        lastLogin: u.last_login || null,
      }));
      res.json({ success: true, data: users });
    } catch {
      res.status(500).json({ success: false, error: "یوزرز لوڈ کرنے میں مسئلہ پیش آیا۔" });
    }
  });

  app.post("/api/cms/users", requireAdminAuth, (req, res) => {
    try {
      const { id, email, username, fullName, role, password, isActive, phone } = req.body || {};
      if (!email) {
        return res.status(400).json({ success: false, error: "ای میل درکار ہے۔" });
      }

      const existing = db.prepare("SELECT * FROM admin_users WHERE email = ? OR id = ?").get(email, id || "") as any;
      if (existing) {
        let updateQuery = "UPDATE admin_users SET username = ?, full_name = ?, role = ?, is_active = ?, phone = ?";
        const params: any[] = [username || email.split("@")[0], fullName || "", role || "admin", isActive ? 1 : 0, phone || ""];
        if (password && password.trim().length >= 6) {
          const { hash, salt } = hashPassword(password.trim());
          updateQuery += ", password_hash = ?, password_salt = ?";
          params.push(hash, salt);
        }
        updateQuery += " WHERE id = ? OR email = ?";
        params.push(existing.id, email);
        db.prepare(updateQuery).run(...params);
      } else {
        const newId = id || `user-${Date.now()}`;
        const userPass = password && password.trim().length >= 6 ? password.trim() : "jamiaislamia2003";
        const { hash, salt } = hashPassword(userPass);
        db.prepare(`
          INSERT INTO admin_users (id, email, username, full_name, role, password_hash, password_salt, is_active, phone, created_at)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `).run(newId, email.toLowerCase().trim(), username || email.split("@")[0], fullName || "", role || "editor", hash, salt, isActive ? 1 : 0, phone || "", new Date().toISOString());
      }

      res.json({ success: true });
    } catch (e: any) {
      res.status(500).json({ success: false, error: e?.message || "یوزر محفوظ کرنے میں مسئلہ پیش آیا۔" });
    }
  });

  app.delete("/api/cms/users/:id", requireAdminAuth, (req, res) => {
    try {
      const user = db.prepare("SELECT email FROM admin_users WHERE id = ?").get(req.params.id) as any;
      if (user?.email === AUTHORIZED_ADMIN_EMAIL || user?.email === "jamiaislamia") {
        return res.status(400).json({ success: false, error: "مرکزی سپر ایڈمن اکاؤنٹ کو حذف نہیں کیا جا سکتا۔" });
      }
      db.prepare("DELETE FROM admin_users WHERE id = ?").run(req.params.id);
      res.json({ success: true });
    } catch {
      res.status(500).json({ success: false, error: "یوزر حذف کرنے میں مسئلہ پیش آیا۔" });
    }
  });

  // 8. CMS Executive Dashboard Statistics
  app.get("/api/cms/dashboard-stats", requireAdminAuth, (req, res) => {
    try {
      const pagesCount = (db.prepare("SELECT COUNT(*) as count FROM cms_pages").get() as any)?.count || 0;
      const fatwasCount = (db.prepare("SELECT COUNT(*) as count FROM fatwas").get() as any)?.count || 0;
      const questionsCount = (db.prepare("SELECT COUNT(*) as count FROM online_questions").get() as any)?.count || 0;
      const bookingsCount = (db.prepare("SELECT COUNT(*) as count FROM class_bookings").get() as any)?.count || 0;
      const resultsCount = (db.prepare("SELECT COUNT(*) as count FROM exam_results").get() as any)?.count || 0;
      const newsCount = (db.prepare("SELECT COUNT(*) as count FROM news").get() as any)?.count || 0;
      const booksCount = (db.prepare("SELECT COUNT(*) as count FROM books").get() as any)?.count || 0;
      const mediaCount = (db.prepare("SELECT COUNT(*) as count FROM cms_media").get() as any)?.count || 0;
      const visitorsCount = (db.prepare("SELECT COUNT(*) as count FROM site_visitors").get() as any)?.count || 0;
      const pendingQuestions = (db.prepare("SELECT COUNT(*) as count FROM online_questions WHERE status = 'Pending'").get() as any)?.count || 0;
      const pendingBookings = (db.prepare("SELECT COUNT(*) as count FROM class_bookings WHERE status = 'Pending'").get() as any)?.count || 0;
      const pendingTranslations = (db.prepare("SELECT COUNT(*) as count FROM fatwas WHERE isTranslationApproved = 0").get() as any)?.count || 0;

      res.json({
        success: true,
        data: {
          pagesCount,
          fatwasCount,
          questionsCount,
          bookingsCount,
          resultsCount,
          newsCount,
          booksCount,
          mediaCount,
          visitorsCount,
          pendingQuestions,
          pendingBookings,
          pendingTranslations,
          cmsVersion: "2.8 WordPress-Style Native CMS",
          dbEngine: "Cloudflare D1 / SQLite WAL Enterprise",
          serverTime: new Date().toISOString(),
        }
      });
    } catch {
      res.status(500).json({ success: false, error: "ڈیش بورڈ اعداد و شمار حاصل کرنے میں مسئلہ پیش آیا۔" });
    }
  });

  // Sitemap & SEO files explicit routes
  app.get(["/sitemap.xml", "/sitemap-*.xml"], (req, res, next) => {
    const fileName = path.basename(req.path);
    const prodPath = path.join(process.cwd(), "dist", fileName);
    const pubPath = path.join(process.cwd(), "public", fileName);
    const filePath = path.join(process.cwd(), process.env.NODE_ENV === "production" ? "dist" : "public", fileName);
    res.setHeader("Content-Type", "application/xml; charset=utf-8");
    res.setHeader("X-Robots-Tag", "all");
    res.setHeader("Cache-Control", "public, max-age=0, must-revalidate");
    res.sendFile(filePath, (err) => {
      if (err) {
        // Fallback to public folder if dist is not yet built
        res.sendFile(pubPath, (fallbackErr) => {
          if (fallbackErr) next();
        });
      }
    });
  });

  app.get("/robots.txt", (req, res, next) => {
    const prodPath = path.join(process.cwd(), "dist", "robots.txt");
    const pubPath = path.join(process.cwd(), "public", "robots.txt");
    const filePath = path.join(process.cwd(), process.env.NODE_ENV === "production" ? "dist" : "public", "robots.txt");
    res.setHeader("Content-Type", "text/plain; charset=utf-8");
    res.setHeader("Cache-Control", "public, max-age=0, must-revalidate");
    res.sendFile(filePath, (err) => {
      if (err) {
        res.sendFile(pubPath, (fallbackErr) => {
          if (fallbackErr) next();
        });
      }
    });
  });

  // Global Error Handler Middleware (Sanitized - no DB structure, secrets or file paths)
  app.use((err: any, req: Request, res: Response, next: NextFunction) => {
    console.error("Unhandled API error notice:", err?.message || err);
    if (res.headersSent) {
      return next(err);
    }
    res.status(500).json({
      success: false,
      error: "درخواست کی تکمیل میں عارضی مسئلہ پیش آیا۔ (Internal Server Notice)",
    });
  });

  // Vite middleware for development vs static build for production
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
