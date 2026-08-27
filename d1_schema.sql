-- ==============================================================================
-- Cloudflare D1 SQL Schema for Jamia Islamia Abbottabad Official Portal
-- Database Engine: SQLite / Cloudflare D1
-- ==============================================================================

-- 1. Fatwas Table (Darul Ifta Islamic Rulings)
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

-- 2. Online Inquirer Questions Table
CREATE TABLE IF NOT EXISTS online_questions (
  id TEXT PRIMARY KEY,
  trackingNumber TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
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

-- 3. Online Class Bookings & Admissions Table
CREATE TABLE IF NOT EXISTS class_bookings (
  id TEXT PRIMARY KEY,
  trackingNumber TEXT NOT NULL UNIQUE,
  studentName TEXT NOT NULL,
  fatherName TEXT NOT NULL,
  age INTEGER NOT NULL,
  gender TEXT NOT NULL,
  contactNumber TEXT NOT NULL,
  email TEXT NOT NULL,
  whatsappNumber TEXT NOT NULL,
  city TEXT NOT NULL,
  country TEXT NOT NULL,
  selectedCourse TEXT NOT NULL,
  preferredTime TEXT NOT NULL,
  preferredTeacherGender TEXT NOT NULL,
  priorEducation TEXT,
  notes TEXT,
  status TEXT NOT NULL DEFAULT 'Pending',
  submittedAt TEXT NOT NULL
);

-- 4. Examination Results Table
CREATE TABLE IF NOT EXISTS exam_results (
  id TEXT PRIMARY KEY,
  rollNumber TEXT NOT NULL UNIQUE,
  studentName TEXT NOT NULL,
  fatherName TEXT NOT NULL,
  department TEXT NOT NULL,
  className TEXT NOT NULL,
  examSession TEXT NOT NULL,
  totalMarks INTEGER NOT NULL,
  obtainedMarks INTEGER NOT NULL,
  percentage REAL NOT NULL,
  grade TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'Pass',
  position TEXT,
  declaredDate TEXT NOT NULL
);

-- 5. Academic Departments Table
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

-- 6. Faculty Members Table
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

-- 7. Books & Publications Table
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

-- 8. Media Gallery Table (Audio, Video, Photo)
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

-- 9. News & Announcements Table
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

-- 10. Donations & Zakat Records Table
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
  receiptNumber TEXT NOT NULL,
  date TEXT NOT NULL,
  notes TEXT
);

-- 11. Site Global Settings Table
CREATE TABLE IF NOT EXISTS site_settings (
  id TEXT PRIMARY KEY,
  data_json TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

-- 12. Site Real Visitors Analytics Table
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

-- 13. Secure Admin Users Table (PBKDF2 Password Hash + Salt)
CREATE TABLE IF NOT EXISTS admin_users (
  id TEXT PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  password_salt TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'superadmin',
  created_at TEXT NOT NULL,
  last_login TEXT
);

-- 14. Active Admin Secure Sessions Table (HttpOnly / Bearer)
CREATE TABLE IF NOT EXISTS admin_sessions (
  token TEXT PRIMARY KEY,
  email TEXT NOT NULL,
  expires_at TEXT NOT NULL,
  created_at TEXT NOT NULL,
  ip TEXT,
  user_agent TEXT
);

-- Indexes for lightning-fast queries
CREATE INDEX IF NOT EXISTS idx_fatwas_cat ON fatwas(category);
CREATE INDEX IF NOT EXISTS idx_fatwas_num ON fatwas(fatwaNumber);
CREATE INDEX IF NOT EXISTS idx_questions_tracking ON online_questions(trackingNumber);
CREATE INDEX IF NOT EXISTS idx_bookings_tracking ON class_bookings(trackingNumber);
CREATE INDEX IF NOT EXISTS idx_results_roll ON exam_results(rollNumber);
CREATE INDEX IF NOT EXISTS idx_sessions_email ON admin_sessions(email);
