import { 
  Fatwa, 
  OnlineQuestion, 
  ExamResult, 
  Department, 
  FacultyMember, 
  PublicationBook, 
  MediaItem, 
  NewsItem, 
  DonationRecord, 
  SiteSettings,
  ClassBooking,
  SiteVisitorLog
} from '../types';

/**
 * Standard collection identifiers for Cloud Firestore & Database storage
 */
export const DB_COLLECTIONS = {
  FATWAS: 'fatwas',
  QUESTIONS: 'online_questions',
  RESULTS: 'exam_results',
  DEPARTMENTS: 'departments',
  FACULTY: 'faculty',
  BOOKS: 'books',
  MEDIA: 'media',
  NEWS: 'news',
  DONATIONS: 'donations',
  BOOKINGS: 'class_bookings',
  SETTINGS: 'site_settings',
  VISITORS: 'site_visitors'
} as const;

/**
 * Generic unified database service contract for Jamia Islamia Abbottabad Portal.
 * Enables zero-downtime switching between browser localStorage and Cloud Firestore.
 */
export interface IDatabaseService {
  // Fatwas
  getFatwas(): Fatwa[] | Promise<Fatwa[]>;
  saveFatwas(data: Fatwa[]): void | Promise<void>;
  addFatwa(fatwa: Fatwa): void | Promise<void>;
  updateFatwa(fatwa: Fatwa): void | Promise<void>;
  deleteFatwa(id: string): void | Promise<void>;

  // Online Questions
  getQuestions(): OnlineQuestion[] | Promise<OnlineQuestion[]>;
  saveQuestions(data: OnlineQuestion[]): void | Promise<void>;
  addQuestion(question: OnlineQuestion): void | Promise<void>;
  updateQuestion(question: OnlineQuestion): void | Promise<void>;

  // Online Class Bookings & Admissions
  getClassBookings(): ClassBooking[] | Promise<ClassBooking[]>;
  saveClassBookings(data: ClassBooking[]): void | Promise<void>;
  addClassBooking(booking: ClassBooking): void | Promise<void>;
  updateClassBooking(booking: ClassBooking): void | Promise<void>;
  deleteClassBooking(id: string): void | Promise<void>;

  // Exam Results
  getExamResults(): ExamResult[] | Promise<ExamResult[]>;
  saveExamResults(data: ExamResult[]): void | Promise<void>;
  addExamResult(result: ExamResult): void | Promise<void>;
  updateExamResult(result: ExamResult): void | Promise<void>;
  deleteExamResult(id: string): void | Promise<void>;

  // Departments
  getDepartments(): Department[] | Promise<Department[]>;
  saveDepartments(data: Department[]): void | Promise<void>;

  // Faculty
  getFaculty(): FacultyMember[] | Promise<FacultyMember[]>;
  saveFaculty(data: FacultyMember[]): void | Promise<void>;

  // Books / Publications
  getBooks(): PublicationBook[] | Promise<PublicationBook[]>;
  saveBooks(data: PublicationBook[]): void | Promise<void>;
  addBook(book: PublicationBook): void | Promise<void>;

  // Media
  getMedia(): MediaItem[] | Promise<MediaItem[]>;
  saveMedia(data: MediaItem[]): void | Promise<void>;
  addMedia(media: MediaItem): void | Promise<void>;

  // News & Announcements
  getNews(): NewsItem[] | Promise<NewsItem[]>;
  saveNews(data: NewsItem[]): void | Promise<void>;
  addNews(news: NewsItem): void | Promise<void>;

  // Donations
  getDonations(): DonationRecord[] | Promise<DonationRecord[]>;
  saveDonations(data: DonationRecord[]): void | Promise<void>;
  addDonation(don: DonationRecord): void | Promise<void>;

  // Site Settings
  getSiteSettings(): SiteSettings | Promise<SiteSettings>;
  saveSiteSettings(data: SiteSettings): void | Promise<void>;

  // Real Site Visitors Logs & Analytics
  getVisitors(): SiteVisitorLog[] | Promise<SiteVisitorLog[]>;
  addVisitor(log: SiteVisitorLog): void | Promise<void>;
  clearVisitors(): void | Promise<void>;

  // Reset to Defaults
  resetAll(): void | Promise<void>;
}
