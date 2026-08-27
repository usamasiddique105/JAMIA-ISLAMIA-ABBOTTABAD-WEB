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
  `);

  // Seed/Sync default admin user strictly with authorized password 'islamia2003'
  const adminRow = db.prepare('SELECT id FROM admin_users WHERE email = ?').get(AUTHORIZED_ADMIN_EMAIL);
  const { hash, salt } = hashPassword('islamia2003');
  if (!adminRow) {
    db.prepare(`
      INSERT INTO admin_users (id, email, password_hash, password_salt, role, created_at)
      VALUES (?, ?, ?, ?, 'superadmin', ?)
    `).run('admin-default', AUTHORIZED_ADMIN_EMAIL, hash, salt, new Date().toISOString());
  } else {
    // Ensure active password hash matches 'islamia2003'
    db.prepare(`
      UPDATE admin_users SET password_hash = ?, password_salt = ? WHERE email = ?
    `).run(hash, salt, AUTHORIZED_ADMIN_EMAIL);
  }

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
}
