import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs';
import { hashPassword, AUTHORIZED_ADMIN_EMAIL } from './auth';
import { 
  INITIAL_FATWAS, 
  INITIAL_ONLINE_QUESTIONS, 
  INITIAL_CLASS_BOOKINGS,
  INITIAL_EXAM_RESULTS, 
  INITIAL_DEPARTMENTS, 
  INITIAL_FACULTY, 
  INITIAL_BOOKS, 
  INITIAL_MEDIA, 
  INITIAL_NEWS, 
  INITIAL_DONATIONS, 
  INITIAL_SITE_SETTINGS 
} from '../src/data/initialData';
import {
  INITIAL_CMS_PAGES,
  INITIAL_CMS_MENUS,
  INITIAL_CMS_SECTIONS,
  INITIAL_CMS_THEME_SETTINGS,
  INITIAL_CMS_SEO_SETTINGS,
  INITIAL_CMS_MEDIA,
  INITIAL_CMS_USERS
} from '../src/data/initialCmsData';

let dbInstance: Database.Database | null = null;

export function getDb(): Database.Database {
  if (!dbInstance) {
    const dataDir = path.join(process.cwd(), '.data');
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }
    const dbPath = path.join(dataDir, 'jamia_d1.db');
    dbInstance = new Database(dbPath);
    dbInstance.pragma('journal_mode = WAL');
    initDatabaseSchema(dbInstance);
  }
  return dbInstance;
}

function initDatabaseSchema(db: Database.Database) {
  // Execute table definitions
  db.exec(`
    CREATE TABLE IF NOT EXISTS fatwas (
      id TEXT PRIMARY KEY,
      fatwaNumber TEXT,
      category TEXT NOT NULL DEFAULT 'other',
      status TEXT NOT NULL DEFAULT 'Published',
      title_ur TEXT,
      title_ar TEXT,
      title_en TEXT,
      question_ur TEXT,
      question_ar TEXT,
      question_en TEXT,
      answer_ur TEXT,
      answer_ar TEXT,
      answer_en TEXT,
      arabicText TEXT,
      muftiName TEXT,
      views INTEGER NOT NULL DEFAULT 0,
      isTranslationApproved INTEGER NOT NULL DEFAULT 0,
      translationApprovedBy TEXT,
      createdAt TEXT,
      updatedAt TEXT
    );

    CREATE TABLE IF NOT EXISTS online_questions (
      id TEXT PRIMARY KEY,
      trackingNumber TEXT,
      name TEXT,
      email TEXT,
      phone TEXT,
      city TEXT,
      questionText TEXT NOT NULL,
      category TEXT NOT NULL,
      status TEXT NOT NULL DEFAULT 'Pending',
      answerText TEXT,
      submittedAt TEXT NOT NULL,
      answeredAt TEXT,
      muftiName TEXT
    );

    CREATE TABLE IF NOT EXISTS class_bookings (
      id TEXT PRIMARY KEY,
      trackingNumber TEXT,
      studentName TEXT NOT NULL,
      fatherName TEXT,
      age TEXT,
      gender TEXT,
      contactNumber TEXT,
      email TEXT,
      whatsappNumber TEXT,
      city TEXT,
      country TEXT,
      selectedCourse TEXT,
      preferredTime TEXT,
      preferredTeacherGender TEXT,
      priorEducation TEXT,
      notes TEXT,
      status TEXT NOT NULL DEFAULT 'Pending',
      submittedAt TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS exam_results (
      id TEXT PRIMARY KEY,
      rollNumber TEXT NOT NULL UNIQUE,
      studentName TEXT NOT NULL,
      fatherName TEXT NOT NULL,
      department TEXT NOT NULL,
      className TEXT,
      examSession TEXT,
      totalMarks INTEGER NOT NULL,
      obtainedMarks INTEGER NOT NULL,
      percentage REAL NOT NULL,
      grade TEXT NOT NULL,
      status TEXT NOT NULL DEFAULT 'Pass',
      position TEXT,
      declaredDate TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS departments (
      id TEXT PRIMARY KEY,
      name_ur TEXT NOT NULL,
      name_ar TEXT NOT NULL,
      name_en TEXT NOT NULL,
      description_ur TEXT,
      description_ar TEXT,
      description_en TEXT,
      icon TEXT,
      studentCount INTEGER NOT NULL DEFAULT 0,
      duration TEXT,
      level TEXT,
      featured INTEGER NOT NULL DEFAULT 0
    );

    CREATE TABLE IF NOT EXISTS faculty (
      id TEXT PRIMARY KEY,
      name_ur TEXT NOT NULL,
      name_ar TEXT NOT NULL,
      name_en TEXT NOT NULL,
      designation_ur TEXT NOT NULL,
      designation_ar TEXT NOT NULL,
      designation_en TEXT NOT NULL,
      department TEXT NOT NULL,
      qualification TEXT,
      photoUrl TEXT,
      contactEmail TEXT,
      orderIndex INTEGER NOT NULL DEFAULT 0
    );

    CREATE TABLE IF NOT EXISTS books (
      id TEXT PRIMARY KEY,
      title_ur TEXT NOT NULL,
      title_ar TEXT NOT NULL,
      title_en TEXT NOT NULL,
      author_ur TEXT,
      author_ar TEXT,
      author_en TEXT,
      category TEXT,
      publicationYear INTEGER,
      pages INTEGER,
      pdfUrl TEXT,
      coverImageUrl TEXT,
      downloadCount INTEGER NOT NULL DEFAULT 0,
      description_ur TEXT,
      description_ar TEXT,
      description_en TEXT
    );

    CREATE TABLE IF NOT EXISTS media (
      id TEXT PRIMARY KEY,
      title_ur TEXT NOT NULL,
      title_ar TEXT NOT NULL,
      title_en TEXT NOT NULL,
      type TEXT NOT NULL,
      category TEXT,
      url TEXT NOT NULL,
      thumbnailUrl TEXT,
      speaker TEXT,
      duration TEXT,
      eventDate TEXT,
      description_ur TEXT,
      description_ar TEXT,
      description_en TEXT
    );

    CREATE TABLE IF NOT EXISTS news (
      id TEXT PRIMARY KEY,
      title_ur TEXT NOT NULL,
      title_ar TEXT NOT NULL,
      title_en TEXT NOT NULL,
      content_ur TEXT NOT NULL,
      content_ar TEXT NOT NULL,
      content_en TEXT NOT NULL,
      date TEXT NOT NULL,
      category TEXT,
      imageUrl TEXT,
      isUrgent INTEGER NOT NULL DEFAULT 0,
      isPublished INTEGER NOT NULL DEFAULT 1
    );

    CREATE TABLE IF NOT EXISTS donations (
      id TEXT PRIMARY KEY,
      transactionId TEXT NOT NULL UNIQUE,
      donorName TEXT NOT NULL,
      donorEmail TEXT,
      donorPhone TEXT NOT NULL,
      amount REAL NOT NULL,
      currency TEXT NOT NULL DEFAULT 'PKR',
      fundType TEXT NOT NULL,
      paymentMethod TEXT NOT NULL,
      status TEXT NOT NULL DEFAULT 'Verified',
      receiptNumber TEXT,
      date TEXT NOT NULL,
      notes TEXT
    );

    CREATE TABLE IF NOT EXISTS site_settings (
      id TEXT PRIMARY KEY,
      data_json TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS site_visitors (
      id TEXT PRIMARY KEY,
      ip TEXT,
      userAgent TEXT,
      page TEXT,
      referer TEXT,
      country TEXT,
      city TEXT,
      timestamp TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS admin_users (
      id TEXT PRIMARY KEY,
      email TEXT NOT NULL UNIQUE,
      password_hash TEXT NOT NULL,
      password_salt TEXT NOT NULL,
      role TEXT NOT NULL DEFAULT 'superadmin',
      created_at TEXT NOT NULL,
      last_login TEXT
    );

    CREATE TABLE IF NOT EXISTS admin_sessions (
      token TEXT PRIMARY KEY,
      email TEXT NOT NULL,
      expires_at TEXT NOT NULL,
      created_at TEXT NOT NULL,
      ip TEXT,
      user_agent TEXT
    );

    CREATE TABLE IF NOT EXISTS cms_pages (
      id TEXT PRIMARY KEY,
      slug TEXT NOT NULL UNIQUE,
      title_ur TEXT NOT NULL,
      title_en TEXT,
      title_ar TEXT,
      content_ur TEXT NOT NULL,
      content_en TEXT,
      content_ar TEXT,
      excerpt_ur TEXT,
      excerpt_en TEXT,
      excerpt_ar TEXT,
      featured_image TEXT,
      status TEXT NOT NULL DEFAULT 'published',
      visibility TEXT NOT NULL DEFAULT 'public',
      password TEXT,
      seo_title_ur TEXT,
      seo_title_en TEXT,
      seo_title_ar TEXT,
      seo_desc_ur TEXT,
      seo_desc_en TEXT,
      seo_desc_ar TEXT,
      og_image TEXT,
      author TEXT,
      template TEXT NOT NULL DEFAULT 'default',
      order_index INTEGER NOT NULL DEFAULT 0,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS cms_menus (
      id TEXT PRIMARY KEY,
      location TEXT NOT NULL UNIQUE,
      name TEXT NOT NULL,
      items_json TEXT,
      updated_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS cms_menu_items (
      id TEXT PRIMARY KEY,
      menu_id TEXT NOT NULL,
      parent_id TEXT,
      label_ur TEXT NOT NULL,
      label_ar TEXT,
      label_en TEXT,
      target_type TEXT NOT NULL DEFAULT 'custom',
      target_value TEXT,
      url TEXT NOT NULL,
      order_index INTEGER NOT NULL DEFAULT 0,
      is_enabled INTEGER NOT NULL DEFAULT 1,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS cms_media (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      filename TEXT NOT NULL,
      file_type TEXT NOT NULL DEFAULT 'image',
      mime_type TEXT,
      file_size INTEGER NOT NULL DEFAULT 0,
      url TEXT NOT NULL,
      thumbnail_url TEXT,
      alt_text TEXT,
      caption TEXT,
      uploaded_by TEXT,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS cms_sections (
      id TEXT PRIMARY KEY,
      section_key TEXT NOT NULL UNIQUE,
      name_ur TEXT NOT NULL,
      name_en TEXT,
      name_ar TEXT,
      is_enabled INTEGER NOT NULL DEFAULT 1,
      order_index INTEGER NOT NULL DEFAULT 0,
      title_ur TEXT NOT NULL,
      title_en TEXT,
      title_ar TEXT,
      subtitle_ur TEXT,
      subtitle_en TEXT,
      subtitle_ar TEXT,
      content_ur TEXT,
      content_en TEXT,
      content_ar TEXT,
      image_url TEXT,
      bg_color TEXT,
      bg_image_url TEXT,
      button_text_ur TEXT,
      button_text_en TEXT,
      button_text_ar TEXT,
      button_url TEXT,
      config_json TEXT,
      updated_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS cms_theme_settings (
      id TEXT PRIMARY KEY,
      data_json TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS cms_seo_settings (
      id TEXT PRIMARY KEY,
      data_json TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS cms_revisions (
      id TEXT PRIMARY KEY,
      entity_type TEXT NOT NULL,
      entity_id TEXT NOT NULL,
      data_json TEXT NOT NULL,
      author TEXT NOT NULL,
      revision_note TEXT,
      created_at TEXT NOT NULL
    );

    -- Safe non-destructive indexes
    CREATE INDEX IF NOT EXISTS idx_cms_pages_slug ON cms_pages(slug);
    CREATE INDEX IF NOT EXISTS idx_cms_pages_status ON cms_pages(status);
    CREATE INDEX IF NOT EXISTS idx_cms_menus_loc ON cms_menus(location);
    CREATE INDEX IF NOT EXISTS idx_cms_menu_items_menu ON cms_menu_items(menu_id);
    CREATE INDEX IF NOT EXISTS idx_cms_menu_items_parent ON cms_menu_items(parent_id);
    CREATE INDEX IF NOT EXISTS idx_cms_sections_key ON cms_sections(section_key);
    CREATE INDEX IF NOT EXISTS idx_cms_revisions_entity ON cms_revisions(entity_type, entity_id);
  `);

  // Safe schema column migrations
  try { db.exec("ALTER TABLE cms_revisions ADD COLUMN action TEXT;"); } catch {}
  try { db.exec("ALTER TABLE cms_revisions ADD COLUMN previous_state TEXT;"); } catch {}
  try { db.exec("ALTER TABLE admin_users ADD COLUMN username TEXT;"); } catch {}
  try { db.exec("ALTER TABLE admin_users ADD COLUMN full_name TEXT;"); } catch {}
  try { db.exec("ALTER TABLE admin_users ADD COLUMN is_active INTEGER NOT NULL DEFAULT 1;"); } catch {}
  try { db.exec("ALTER TABLE admin_users ADD COLUMN phone TEXT;"); } catch {}

  // Safe schema column migrations
  try { db.exec("ALTER TABLE fatwas ADD COLUMN isTranslationApproved INTEGER NOT NULL DEFAULT 0;"); } catch {}
  try { db.exec("ALTER TABLE fatwas ADD COLUMN translationApprovedBy TEXT;"); } catch {}
  try { db.exec("ALTER TABLE news ADD COLUMN isTranslationApproved INTEGER NOT NULL DEFAULT 0;"); } catch {}
  try { db.exec("ALTER TABLE news ADD COLUMN translationApprovedBy TEXT;"); } catch {}

  // Seed/Sync default admin user using precomputed cryptographic PBKDF2 hash
  const DEFAULT_ADMIN_SALT = process.env.ADMIN_DEFAULT_SALT || '4d8a1c9e3b7f2a5d';
  const DEFAULT_ADMIN_HASH = process.env.ADMIN_DEFAULT_HASH || (
    process.env.ADMIN_DEFAULT_PASSWORD 
      ? hashPassword(process.env.ADMIN_DEFAULT_PASSWORD, DEFAULT_ADMIN_SALT).hash
      : '9e5c75f174cdfee48ab62f455f62400a35b5d4ed7b3aefba470b6ebe6a8c6aab097d554b498b7a22e5767805e3f8709909d8390b133c25c7bf8a52c305948d16'
  );
  const hash = DEFAULT_ADMIN_HASH;
  const salt = DEFAULT_ADMIN_SALT;

  // Clean up legacy accounts so ONLY 'jamiaislamia' is the recognized administrator
  try {
    db.prepare("DELETE FROM admin_users WHERE email NOT IN ('jamiaislamia', ?)").run(AUTHORIZED_ADMIN_EMAIL);
  } catch {}

  // Seed/sync username 'jamiaislamia'
  const usernameRow = db.prepare('SELECT id FROM admin_users WHERE email = ? OR username = ?').get('jamiaislamia', 'jamiaislamia');
  if (!usernameRow) {
    db.prepare(`
      INSERT INTO admin_users (id, email, username, full_name, password_hash, password_salt, role, created_at)
      VALUES (?, ?, ?, ?, ?, ?, 'superadmin', ?)
    `).run('admin-user-default', 'jamiaislamia', 'jamiaislamia', 'ایڈمنسٹریٹر جامعہ اسلامیہ', hash, salt, new Date().toISOString());
  } else {
    db.prepare(`
      UPDATE admin_users SET password_hash = ?, password_salt = ?, username = 'jamiaislamia' WHERE email = 'jamiaislamia' OR username = 'jamiaislamia'
    `).run(hash, salt);
  }

  // Also keep AUTHORIZED_ADMIN_EMAIL synced if present
  try {
    db.prepare(`
      UPDATE admin_users SET password_hash = ?, password_salt = ? WHERE email = ?
    `).run(hash, salt, AUTHORIZED_ADMIN_EMAIL);
  } catch {}

  // Seed Fatwas if empty
  const fatwaCount = db.prepare('SELECT COUNT(*) as count FROM fatwas').get() as { count: number };
  if (fatwaCount.count === 0) {
    const insertFatwa = db.prepare(`
      INSERT INTO fatwas (
        id, fatwaNumber, category, status,
        title_ur, title_ar, title_en,
        question_ur, question_ar, question_en,
        answer_ur, answer_ar, answer_en,
        arabicText, muftiName, views, isTranslationApproved, translationApprovedBy,
        createdAt, updatedAt
      ) VALUES (
        ?, ?, ?, ?,
        ?, ?, ?,
        ?, ?, ?,
        ?, ?, ?,
        ?, ?, ?, ?, ?,
        ?, ?
      )
    `);

    const insertMany = db.transaction((list: typeof INITIAL_FATWAS) => {
      for (const f of list) {
        insertFatwa.run(
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
          f.date || new Date().toISOString(),
          f.date || new Date().toISOString()
        );
      }
    });
    insertMany(INITIAL_FATWAS);
  }

  // Seed Online Questions if empty
  const qCount = db.prepare('SELECT COUNT(*) as count FROM online_questions').get() as { count: number };
  if (qCount.count === 0) {
    const insertQ = db.prepare(`
      INSERT INTO online_questions (id, trackingNumber, name, email, phone, city, questionText, category, status, answerText, submittedAt, answeredAt, muftiName)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);
    for (const q of INITIAL_ONLINE_QUESTIONS) {
      insertQ.run(
        q.id,
        q.id,
        q.questionerName,
        q.questionerEmail,
        q.phone || null,
        null,
        q.question,
        q.category,
        q.isAnswered ? 'Answered' : 'Pending',
        q.reply || null,
        q.submissionDate || new Date().toISOString(),
        q.isAnswered ? q.submissionDate : null,
        'مفتی دار الافتاء'
      );
    }
  }

  // Seed Class Bookings if empty
  const bCount = db.prepare('SELECT COUNT(*) as count FROM class_bookings').get() as { count: number };
  if (bCount.count === 0) {
    const insertB = db.prepare(`
      INSERT INTO class_bookings (id, trackingNumber, studentName, fatherName, age, gender, contactNumber, email, whatsappNumber, city, country, selectedCourse, preferredTime, preferredTeacherGender, priorEducation, notes, status, submittedAt)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);
    for (const b of INITIAL_CLASS_BOOKINGS) {
      insertB.run(
        b.id,
        b.id,
        b.studentName,
        b.guardianName || '',
        b.age || '18',
        'male',
        b.phone,
        b.email || '',
        b.whatsapp || '',
        'Abbottabad',
        b.country || 'Pakistan',
        b.course,
        b.preferredTime || 'صبح',
        'male',
        null,
        b.adminNotes || null,
        b.status,
        b.date || new Date().toISOString()
      );
    }
  }

  // Seed Exam Results if empty
  const rCount = db.prepare('SELECT COUNT(*) as count FROM exam_results').get() as { count: number };
  if (rCount.count === 0) {
    const insertR = db.prepare(`
      INSERT INTO exam_results (id, rollNumber, studentName, fatherName, department, className, examSession, totalMarks, obtainedMarks, percentage, grade, status, position, declaredDate)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);
    for (const r of INITIAL_EXAM_RESULTS) {
      insertR.run(
        r.id,
        r.rollNumber,
        r.studentName,
        r.fatherName,
        r.department,
        r.academicYear || '',
        r.academicYear || '',
        r.totalMarks,
        r.obtainedMarks,
        r.percentage,
        r.grade,
        r.status,
        r.remarks || null,
        r.academicYear || new Date().toISOString()
      );
    }
  }

  // Seed Departments if empty
  const dCount = db.prepare('SELECT COUNT(*) as count FROM departments').get() as { count: number };
  if (dCount.count === 0) {
    const insertD = db.prepare(`
      INSERT INTO departments (id, name_ur, name_ar, name_en, description_ur, description_ar, description_en, icon, studentCount, duration, level, featured)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);
    for (const d of INITIAL_DEPARTMENTS) {
      insertD.run(
        d.id,
        d.name.ur,
        d.name.ar,
        d.name.en,
        d.description.ur,
        d.description.ar,
        d.description.en,
        'Building',
        d.totalStudents || 0,
        d.duration,
        d.eligibility || '',
        1
      );
    }
  }

  // Seed Faculty if empty
  const fCount = db.prepare('SELECT COUNT(*) as count FROM faculty').get() as { count: number };
  if (fCount.count === 0) {
    const insertF = db.prepare(`
      INSERT INTO faculty (id, name_ur, name_ar, name_en, designation_ur, designation_ar, designation_en, department, qualification, photoUrl, contactEmail, orderIndex)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);
    let idx = 0;
    for (const f of INITIAL_FACULTY) {
      insertF.run(
        f.id,
        f.name.ur,
        f.name.ar,
        f.name.en,
        f.designation.ur,
        f.designation.ar,
        f.designation.en,
        f.department,
        f.qualification || null,
        f.photoUrl || null,
        null,
        idx++
      );
    }
  }

  // Seed Books if empty
  const bkCount = db.prepare('SELECT COUNT(*) as count FROM books').get() as { count: number };
  if (bkCount.count === 0) {
    const insertBk = db.prepare(`
      INSERT INTO books (id, title_ur, title_ar, title_en, author_ur, author_ar, author_en, category, publicationYear, pages, pdfUrl, coverImageUrl, downloadCount, description_ur, description_ar, description_en)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);
    for (const b of INITIAL_BOOKS) {
      insertBk.run(
        b.id,
        b.title.ur,
        b.title.ar,
        b.title.en,
        b.author,
        b.author,
        b.author,
        b.category,
        parseInt(b.publishYear, 10) || 2026,
        100,
        b.fileUrl,
        b.coverImage || null,
        b.downloadsCount || 0,
        b.description,
        b.description,
        b.description
      );
    }
  }

  // Seed Media if empty
  const mCount = db.prepare('SELECT COUNT(*) as count FROM media').get() as { count: number };
  if (mCount.count === 0) {
    const insertM = db.prepare(`
      INSERT INTO media (id, title_ur, title_ar, title_en, type, category, url, thumbnailUrl, speaker, duration, eventDate, description_ur, description_ar, description_en)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);
    for (const m of INITIAL_MEDIA) {
      insertM.run(
        m.id,
        m.title.ur,
        m.title.ar,
        m.title.en,
        m.type,
        m.category,
        m.url,
        m.thumbnail || null,
        m.speaker || null,
        null,
        m.date || null,
        m.description || null,
        m.description || null,
        m.description || null
      );
    }
  }

  // Seed News if empty
  const nCount = db.prepare('SELECT COUNT(*) as count FROM news').get() as { count: number };
  if (nCount.count === 0) {
    const insertN = db.prepare(`
      INSERT INTO news (id, title_ur, title_ar, title_en, content_ur, content_ar, content_en, date, category, imageUrl, isUrgent, isPublished)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);
    for (const n of INITIAL_NEWS) {
      insertN.run(
        n.id,
        n.title.ur,
        n.title.ar,
        n.title.en,
        n.content.ur,
        n.content.ar,
        n.content.en,
        n.date,
        n.category,
        n.imageUrl || null,
        n.isPinned ? 1 : 0,
        1
      );
    }
  }

  // Seed Donations if empty
  const dnCount = db.prepare('SELECT COUNT(*) as count FROM donations').get() as { count: number };
  if (dnCount.count === 0) {
    const insertDn = db.prepare(`
      INSERT INTO donations (id, transactionId, donorName, donorEmail, donorPhone, amount, currency, fundType, paymentMethod, status, receiptNumber, date, notes)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);
    for (const dn of INITIAL_DONATIONS) {
      insertDn.run(
        dn.id,
        dn.transactionRef || dn.id,
        dn.donorName,
        dn.donorEmail || null,
        dn.donorPhone,
        dn.amount,
        dn.currency,
        dn.fundType,
        dn.paymentMethod,
        dn.status,
        dn.transactionRef || null,
        dn.date,
        null
      );
    }
  }

  // Seed Site Settings if empty
  const sCount = db.prepare('SELECT COUNT(*) as count FROM site_settings').get() as { count: number };
  if (sCount.count === 0) {
    db.prepare(`
      INSERT INTO site_settings (id, data_json, updated_at)
      VALUES ('main', ?, ?)
    `).run(JSON.stringify(INITIAL_SITE_SETTINGS), new Date().toISOString());
  }

  // Seed CMS Pages if empty
  const pageCount = db.prepare('SELECT COUNT(*) as count FROM cms_pages').get() as { count: number };
  if (pageCount.count === 0) {
    const insertPage = db.prepare(`
      INSERT INTO cms_pages (
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
    `);

    for (const p of INITIAL_CMS_PAGES) {
      insertPage.run(
        p.id, p.slug, p.title.ur, p.title.en, p.title.ar,
        p.content.ur, p.content.en, p.content.ar,
        p.excerpt?.ur || null, p.excerpt?.en || null, p.excerpt?.ar || null,
        p.featuredImage || null, p.status || 'published', p.visibility || 'public', p.password || null,
        p.seoTitle?.ur || null, p.seoTitle?.en || null, p.seoTitle?.ar || null,
        p.seoDescription?.ur || null, p.seoDescription?.en || null, p.seoDescription?.ar || null,
        p.ogImage || null, p.author || 'جامعہ انتظامیہ', p.template || 'default', p.orderIndex || 0,
        p.createdAt || new Date().toISOString(), p.updatedAt || new Date().toISOString()
      );
    }
  }

  // Seed CMS Menus if empty
  const menuCount = db.prepare('SELECT COUNT(*) as count FROM cms_menus').get() as { count: number };
  if (menuCount.count === 0) {
    const insertMenu = db.prepare(`
      INSERT INTO cms_menus (id, location, name, items_json, updated_at)
      VALUES (?, ?, ?, ?, ?)
    `);
    for (const m of INITIAL_CMS_MENUS) {
      insertMenu.run(m.id, m.location, m.name, JSON.stringify(m.items), m.updatedAt || new Date().toISOString());
    }
  }

  // Seed normalized menu items if empty
  const menuItemCount = db.prepare('SELECT COUNT(*) as count FROM cms_menu_items').get() as { count: number };
  if (menuItemCount.count === 0) {
    const insertItem = db.prepare(`
      INSERT INTO cms_menu_items (
        id, menu_id, parent_id, label_ur, label_ar, label_en, target_type, target_value, url, order_index, is_enabled, created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);
    for (const m of INITIAL_CMS_MENUS) {
      if (Array.isArray(m.items)) {
        for (const it of m.items) {
          insertItem.run(
            it.id, m.id, it.parentId || null,
            it.title.ur, it.title.ar || '', it.title.en || '',
            it.tabId ? 'tab' : it.pageId ? 'page' : 'custom',
            it.tabId || it.pageId || null,
            it.url || '',
            it.orderIndex || 0,
            it.isEnabled ? 1 : 0,
            new Date().toISOString(),
            new Date().toISOString()
          );
          if (Array.isArray(it.children)) {
            for (const child of it.children) {
              insertItem.run(
                child.id, m.id, it.id,
                child.title.ur, child.title.ar || '', child.title.en || '',
                child.tabId ? 'tab' : child.pageId ? 'page' : 'custom',
                child.tabId || child.pageId || null,
                child.url || '',
                child.orderIndex || 0,
                child.isEnabled ? 1 : 0,
                new Date().toISOString(),
                new Date().toISOString()
              );
            }
          }
        }
      }
    }
  }

  // Seed CMS Sections if empty
  const secCount = db.prepare('SELECT COUNT(*) as count FROM cms_sections').get() as { count: number };
  if (secCount.count === 0) {
    const insertSec = db.prepare(`
      INSERT INTO cms_sections (
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
    `);

    for (const s of INITIAL_CMS_SECTIONS) {
      insertSec.run(
        s.id, s.sectionKey, s.name.ur, s.name.en, s.name.ar,
        s.isEnabled ? 1 : 0, s.orderIndex || 0,
        s.title.ur, s.title.en, s.title.ar,
        s.subtitle?.ur || null, s.subtitle?.en || null, s.subtitle?.ar || null,
        s.content?.ur || null, s.content?.en || null, s.content?.ar || null,
        s.imageUrl || null, s.bgColor || null, s.bgImageUrl || null,
        s.buttonText?.ur || null, s.buttonText?.en || null, s.buttonText?.ar || null,
        s.buttonUrl || null, JSON.stringify(s.config || {}), s.updatedAt || new Date().toISOString()
      );
    }
  }

  // Seed CMS Theme Settings if empty
  const themeCount = db.prepare('SELECT COUNT(*) as count FROM cms_theme_settings').get() as { count: number };
  if (themeCount.count === 0) {
    db.prepare(`
      INSERT INTO cms_theme_settings (id, data_json, updated_at)
      VALUES ('main', ?, ?)
    `).run(JSON.stringify(INITIAL_CMS_THEME_SETTINGS), new Date().toISOString());
  }

  // Seed CMS SEO Settings if empty
  const seoCount = db.prepare('SELECT COUNT(*) as count FROM cms_seo_settings').get() as { count: number };
  if (seoCount.count === 0) {
    db.prepare(`
      INSERT INTO cms_seo_settings (id, data_json, updated_at)
      VALUES ('main', ?, ?)
    `).run(JSON.stringify(INITIAL_CMS_SEO_SETTINGS), new Date().toISOString());
  }

  // Seed CMS Media if empty
  const mediaCount = db.prepare('SELECT COUNT(*) as count FROM cms_media').get() as { count: number };
  if (mediaCount.count === 0) {
    const insertMedia = db.prepare(`
      INSERT INTO cms_media (
        id, title, filename, file_type, mime_type, file_size, url, thumbnail_url, alt_text, caption, uploaded_by, created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);
    for (const med of INITIAL_CMS_MEDIA) {
      insertMedia.run(
        med.id, med.title, med.filename, med.fileType, med.mimeType, med.fileSize,
        med.url, med.thumbnailUrl || med.url, med.altText || null, med.caption || null,
        med.uploadedBy || 'Admin', med.createdAt || new Date().toISOString(),
        (med as any).updatedAt || med.createdAt || new Date().toISOString()
      );
    }
  }
}
