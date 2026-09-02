export type Language = 'ur' | 'en' | 'ar';

export type FatwaCategory = 
  | 'Tahara & Cleansing'
  | 'Namaz & Prayer'
  | 'Zakat & Charity'
  | 'Roza & Fasting'
  | 'Nikah & Talaq'
  | 'Business & Trade'
  | 'Modern Issues & Tech'
  | 'Social & Ethics'
  | 'General Fiqh'
  | 'ایمانیات و عقائد'
  | 'نماز و طہارت'
  | 'روزہ و اعتکاف'
  | 'زکوٰۃ و صدقات'
  | 'حج و عمرہ'
  | 'نکاح و طلاق'
  | 'بیوع و معاملات'
  | 'متفرقات'
  | string;

export type FatwaStatus = 'Published' | 'Draft' | 'Under Review' | 'Private Reply';

export interface LocalizedString {
  ur: string;
  en: string;
  ar: string;
}

export interface Fatwa {
  id: string;
  fatwaNumber: string;
  title: LocalizedString;
  question: LocalizedString;
  questionerName?: string;
  questionerEmail?: string;
  category: FatwaCategory;
  answer: LocalizedString;
  arabicText?: string; // Quranic verses or Hadith dalail
  date: string;
  muftiName: string;
  status: FatwaStatus;
  isFeatured?: boolean;
  views: number;
  isAiTranslatedEn?: boolean;
  isTranslationApproved?: boolean;
  aiTranslatedEnAt?: string;
  translationApprovedBy?: string;
}

export interface OnlineQuestion {
  id: string;
  trackingNumber?: string;
  questionerName: string;
  questionerEmail: string;
  phone?: string;
  country?: string;
  city?: string;
  language?: string;
  category: FatwaCategory;
  subject: string;
  question: string;
  submissionDate: string;
  isAnswered: boolean;
  reply?: string;
  isPublishedToArchive?: boolean;
}

export type BookingType = 'Trial' | 'Admission' | 'General';
export type BookingStatus = 'Pending' | 'Contacted' | 'Confirmed' | 'Completed' | 'Cancelled';

export interface ClassBooking {
  id: string;
  trackingNumber?: string;
  bookingType: BookingType;
  studentName: string;
  guardianName?: string;
  age?: string;
  country: string;
  phone: string;
  whatsapp?: string;
  email?: string;
  course: string;
  preferredTime?: string;
  date: string;
  status: BookingStatus;
  adminNotes?: string;
  replyMessage?: string;
  replyDate?: string;
}

export interface ExamSubject {
  name: string;
  totalMarks: number;
  obtainedMarks: number;
}

export interface ExamResult {
  id: string;
  rollNumber: string;
  registrationNumber: string;
  studentName: string;
  fatherName: string;
  department: string;
  academicYear: string;
  examType: 'Annual' | 'Mid-term' | 'Supplementary';
  subjects: ExamSubject[];
  totalMarks: number;
  obtainedMarks: number;
  percentage: number;
  grade: string; // Mumtaz, Jayyid Jiddan, Jayyid, Maqbool
  division: string;
  status: 'Pass' | 'Fail' | 'Distinction';
  remarks?: string;
}

export interface Department {
  id: string;
  name: LocalizedString;
  code: string;
  description: LocalizedString;
  duration: string;
  headOfDept: string;
  totalStudents: number;
  curriculum: string[];
  eligibility: string;
}

export interface FacultyMember {
  id: string;
  name: LocalizedString;
  designation: LocalizedString;
  department: string;
  specialization: string;
  qualification: string;
  photoUrl: string;
  experienceYears: number;
  bio?: string;
}

export interface PublicationBook {
  id: string;
  title: LocalizedString;
  author: string;
  category: 'Fiqh' | 'Hadith' | 'Tafseer' | 'Arabic Literature' | 'Fatwa Collection' | 'Monthly Magazine' | 'Research Paper';
  description: string;
  coverImage: string;
  fileUrl: string;
  fileSize: string;
  publishYear: string;
  downloadsCount: number;
}

export interface MediaItem {
  id: string;
  title: LocalizedString;
  type: 'audio' | 'video' | 'photo';
  category: 'Khutbah' | 'Lecture' | 'Event' | 'Campus' | 'Ceremony';
  url: string;
  speaker?: string;
  date: string;
  thumbnail?: string;
  description?: string;
}

export interface NewsItem {
  id: string;
  title: LocalizedString;
  content: LocalizedString;
  date: string;
  category: 'News' | 'Announcement' | 'Event' | 'Admission';
  imageUrl?: string;
  isPinned?: boolean;
  isTranslationApproved?: boolean;
  translationApprovedBy?: string;
  isAiTranslated?: boolean;
}

export type FundType = 
  | 'Zakat'
  | 'Sadaqah'
  | 'Lillah'
  | 'Student Sponsorship'
  | 'Building Fund'
  | 'Library Fund'
  | 'Masjid Fund';

export interface DonationRecord {
  id: string;
  donorName: string;
  donorEmail: string;
  donorPhone: string;
  fundType: FundType;
  amount: number;
  currency: 'PKR' | 'USD' | 'EUR' | 'GBP';
  paymentMethod: 'Bank Transfer' | 'EasyPaisa' | 'JazzCash' | 'Credit Card';
  transactionRef: string;
  date: string;
  status: 'Verified' | 'Pending';
}

export interface PrayerTimes {
  fajr: string;
  sunrise: string;
  dhuhr: string;
  asr: string;
  maghrib: string;
  isha: string;
  jummah: string;
  location: string;
}

export interface SiteVisitorLog {
  id: string;
  timestamp: string; // ISO string
  date: string; // YYYY-MM-DD
  time: string; // HH:mm:ss
  page: string;
  referrer: string;
  country: string;
  countryCode: string;
  city?: string;
  deviceType: 'Mobile' | 'Tablet' | 'Desktop';
  browser: string;
  os: string;
  ip?: string;
  sessionId: string;
  language?: string;
}

export interface SiteSettings {
  jamiaNameUrdu: string;
  jamiaNameEnglish: string;
  jamiaNameArabic: string;
  tagline: LocalizedString;
  phonePrimary: string;
  phoneSecondary: string;
  email: string;
  whatsappNumber: string;
  notificationEmail?: string;
  notificationWhatsApp?: string;
  webhookUrl?: string;
  enableEmailNotifications?: boolean;
  enableWhatsAppNotifications?: boolean;
  geminiApiKey?: string;
  address: string;
  city: string;
  registrationNumber?: string;
  affiliationNumber?: string;
  visitorCount: number;
  heroAnnouncement: LocalizedString;
  bankDetails: {
    meezanBank: { title: string; accountNo: string; iban: string; branch?: string; swift?: string };
    bankIslami: { title: string; accountNo: string; iban: string };
    hbl: { title: string; accountNo: string; iban: string };
    easyPaisa: { title: string; number: string };
    jazzCash: { title: string; number: string };
  };
  socialLinks?: {
    facebook?: string;
    youtube?: string;
    whatsapp?: string;
    telegram?: string;
    twitter?: string;
    instagram?: string;
  };
  headerSettings?: {
    showTopBar?: boolean;
    topBarAnnouncement?: LocalizedString;
    stickyHeader?: boolean;
    showLanguageSwitcher?: boolean;
    showSearchModal?: boolean;
    showDarkModeToggle?: boolean;
    showFatwaButton?: boolean;
  };
  footerSettings?: {
    showAboutColumn?: boolean;
    showQuickLinks?: boolean;
    showAcademicLinks?: boolean;
    showContactColumn?: boolean;
    showPrayerTimes?: boolean;
    customCopyrightUrdu?: string;
    customCopyrightEnglish?: string;
    customCopyrightArabic?: string;
  };
}

// ==========================================
// CMS NATIVE TYPES (WordPress Style Website Management)
// ==========================================

export type CmsPageStatus = 'published' | 'draft' | 'archived';
export type CmsPageVisibility = 'public' | 'private' | 'password_protected';

export interface CmsPage {
  id: string;
  slug: string;
  title: LocalizedString;
  content: LocalizedString;
  excerpt?: LocalizedString;
  featuredImage?: string;
  status: CmsPageStatus;
  visibility: CmsPageVisibility;
  password?: string;
  seoTitle?: LocalizedString;
  seoDescription?: LocalizedString;
  ogImage?: string;
  author?: string;
  template?: 'default' | 'full_width' | 'contact' | 'landing';
  orderIndex?: number;
  createdAt: string;
  updatedAt: string;
}

export interface CmsMenuItem {
  id: string;
  title: LocalizedString;
  url: string;
  tabId?: string;
  pageId?: string;
  target?: '_self' | '_blank';
  icon?: string;
  description?: LocalizedString;
  isEnabled: boolean;
  orderIndex: number;
  parentId?: string | null;
  children?: CmsMenuItem[];
}

export interface CmsMenu {
  id: string;
  location: 'header_main' | 'top_bar' | 'footer_quick' | 'footer_academics' | 'footer_sharia';
  name: string;
  items: CmsMenuItem[];
  updatedAt: string;
}

export interface CmsMedia {
  id: string;
  title: string;
  filename: string;
  fileType: 'image' | 'document' | 'audio' | 'video';
  mimeType: string;
  fileSize: number; // in bytes
  url: string;
  thumbnailUrl?: string;
  altText?: string;
  caption?: string;
  uploadedBy?: string;
  uploadedAt?: string;
  createdAt: string;
}

export interface CmsSection {
  id: string;
  sectionKey: string;
  name: LocalizedString;
  isEnabled: boolean;
  orderIndex: number;
  title: LocalizedString;
  subtitle?: LocalizedString;
  content?: LocalizedString;
  imageUrl?: string;
  bgColor?: string;
  backgroundColor?: string;
  bgImageUrl?: string;
  backgroundImage?: string;
  buttonText?: LocalizedString;
  buttonUrl?: string;
  customCss?: string;
  config?: Record<string, any>;
  settings?: Record<string, any>;
  updatedAt: string;
}

export interface CmsThemeSettings {
  id: string;
  logoUrl?: string;
  darkLogoUrl?: string;
  faviconUrl?: string;
  primaryColor?: string;
  secondaryColor?: string;
  accentColor?: string;
  backgroundColor?: string;
  colors?: {
    primary?: string;
    secondary?: string;
    accent?: string;
    background?: string;
    surface?: string;
    text?: string;
    textMuted?: string;
    border?: string;
  };
  fontUrdu?: string;
  fontArabic?: string;
  fontEnglish?: string;
  borderRadius?: 'none' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | 'full';
  headerStyle?: 'standard' | 'compact' | 'centered';
  footerStyle?: 'four_columns' | 'three_columns' | 'minimal';
  customCss?: string;
  headerScripts?: string;
  header?: {
    logoUrl?: string;
    siteTitle?: LocalizedString;
    tagline?: LocalizedString;
    showTopBar?: boolean;
    showSearch?: boolean;
    style?: 'standard' | 'compact' | 'centered';
  };
  footer?: {
    aboutText?: LocalizedString;
    address?: LocalizedString;
    copyright?: LocalizedString;
    layoutStyle?: '4col' | '3col' | 'minimal' | 'four_columns' | 'three_columns';
  };
  socialLinks?: {
    facebook?: string;
    youtube?: string;
    whatsapp?: string;
    twitter?: string;
    instagram?: string;
    telegram?: string;
  };
  updatedAt: string;
}

export interface CmsSeoSettings {
  id: string;
  siteTitle?: LocalizedString;
  metaDescription?: LocalizedString;
  defaultMetaTitle?: LocalizedString;
  defaultMetaDescription?: LocalizedString;
  keywords?: string;
  ogTitle?: LocalizedString;
  ogDescription?: LocalizedString;
  ogImage?: string;
  googleVerification?: string;
  googleSiteVerification?: string;
  bingVerification?: string;
  bingSiteVerification?: string;
  canonicalBase?: string;
  canonicalBaseUrl?: string;
  robotsTxt?: string;
  sitemapEnabled?: boolean;
  updatedAt: string;
}

export type CmsUserRole = 'superadmin' | 'admin' | 'editor' | 'content_manager';

export interface CmsAdminUser {
  id: string;
  email: string;
  username: string;
  fullName: string;
  role: CmsUserRole;
  isActive: boolean;
  avatarUrl?: string;
  phone?: string;
  createdAt: string;
  lastLogin?: string;
}

export interface CmsRevision {
  id: string;
  entityType: 'page' | 'section' | 'menu' | 'theme' | 'seo';
  entityId: string;
  dataJson: string;
  author: string;
  revisionNote?: string;
  createdAt: string;
}

export interface CmsMenuItemRow {
  id: string;
  menuId: string;
  parentId?: string | null;
  label: LocalizedString;
  targetType: 'page' | 'url' | 'tab' | 'custom';
  targetValue?: string;
  url: string;
  orderIndex: number;
  isEnabled: boolean;
  createdAt: string;
  updatedAt: string;
}


