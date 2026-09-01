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
import { IDatabaseService, DB_COLLECTIONS } from './dbInterface';
import { CloudApiAdapter, D1_STORAGE_KEYS } from './cloudApiAdapter';

// Primary Cloudflare D1 & SQL API adapter
const cloudAdapter = new CloudApiAdapter();
const currentAdapter: IDatabaseService = cloudAdapter;

export const StorageService = {
  // Collection & Storage Keys Metadata
  collections: DB_COLLECTIONS,
  storageKeys: D1_STORAGE_KEYS,
  isCloudReady: () => true,

  // Fatwas
  getFatwas: (): Fatwa[] => currentAdapter.getFatwas() as Fatwa[],
  saveFatwas: (data: Fatwa[]): Promise<void> => Promise.resolve(currentAdapter.saveFatwas(data)),
  addFatwa: (fatwa: Fatwa): Promise<void> => Promise.resolve(currentAdapter.addFatwa(fatwa)),
  updateFatwa: (fatwa: Fatwa): Promise<void> => Promise.resolve(currentAdapter.updateFatwa(fatwa)),
  deleteFatwa: (id: string): Promise<void> => Promise.resolve(currentAdapter.deleteFatwa(id)),

  // Online Questions
  getQuestions: (): OnlineQuestion[] => currentAdapter.getQuestions() as OnlineQuestion[],
  saveQuestions: (data: OnlineQuestion[]): Promise<void> => Promise.resolve(currentAdapter.saveQuestions(data)),
  addQuestion: (question: OnlineQuestion, captchaToken?: string): Promise<string | void> => Promise.resolve(currentAdapter.addQuestion(question, captchaToken)),
  updateQuestion: (question: OnlineQuestion): Promise<void> => Promise.resolve(currentAdapter.updateQuestion(question)),

  // Online Class Bookings & Admissions
  getClassBookings: (): ClassBooking[] => currentAdapter.getClassBookings() as ClassBooking[],
  saveClassBookings: (data: ClassBooking[]): Promise<void> => Promise.resolve(currentAdapter.saveClassBookings(data)),
  addClassBooking: (booking: ClassBooking, captchaToken?: string): Promise<string | void> => Promise.resolve(currentAdapter.addClassBooking(booking, captchaToken)),
  updateClassBooking: (booking: ClassBooking): Promise<void> => Promise.resolve(currentAdapter.updateClassBooking(booking)),
  deleteClassBooking: (id: string): Promise<void> => Promise.resolve(currentAdapter.deleteClassBooking(id)),

  // Exam Results
  getExamResults: (): ExamResult[] => currentAdapter.getExamResults() as ExamResult[],
  saveExamResults: (data: ExamResult[]): Promise<void> => Promise.resolve(currentAdapter.saveExamResults(data)),
  addExamResult: (result: ExamResult): Promise<void> => Promise.resolve(currentAdapter.addExamResult(result)),
  updateExamResult: (result: ExamResult): Promise<void> => Promise.resolve(currentAdapter.updateExamResult(result)),
  deleteExamResult: (id: string): Promise<void> => Promise.resolve(currentAdapter.deleteExamResult(id)),

  // Departments
  getDepartments: (): Department[] => currentAdapter.getDepartments() as Department[],
  saveDepartments: (data: Department[]): Promise<void> => Promise.resolve(currentAdapter.saveDepartments(data)),
  addDepartment: (dept: Department): Promise<void> => Promise.resolve(currentAdapter.addDepartment(dept)),
  updateDepartment: (dept: Department): Promise<void> => Promise.resolve(currentAdapter.updateDepartment(dept)),
  deleteDepartment: (id: string): Promise<void> => Promise.resolve(currentAdapter.deleteDepartment(id)),

  // Faculty
  getFaculty: (): FacultyMember[] => currentAdapter.getFaculty() as FacultyMember[],
  saveFaculty: (data: FacultyMember[]): Promise<void> => Promise.resolve(currentAdapter.saveFaculty(data)),
  addFaculty: (faculty: FacultyMember): Promise<void> => Promise.resolve(currentAdapter.addFaculty(faculty)),
  updateFaculty: (faculty: FacultyMember): Promise<void> => Promise.resolve(currentAdapter.updateFaculty(faculty)),
  deleteFaculty: (id: string): Promise<void> => Promise.resolve(currentAdapter.deleteFaculty(id)),

  // Books / Publications
  getBooks: (): PublicationBook[] => currentAdapter.getBooks() as PublicationBook[],
  saveBooks: (data: PublicationBook[]): Promise<void> => Promise.resolve(currentAdapter.saveBooks(data)),
  addBook: (book: PublicationBook): Promise<void> => Promise.resolve(currentAdapter.addBook(book)),
  updateBook: (book: PublicationBook): Promise<void> => Promise.resolve(currentAdapter.updateBook(book)),
  deleteBook: (id: string): Promise<void> => Promise.resolve(currentAdapter.deleteBook(id)),

  // Media (Audio, Video, Photo)
  getMedia: (): MediaItem[] => currentAdapter.getMedia() as MediaItem[],
  saveMedia: (data: MediaItem[]): Promise<void> => Promise.resolve(currentAdapter.saveMedia(data)),
  addMedia: (media: MediaItem): Promise<void> => Promise.resolve(currentAdapter.addMedia(media)),
  updateMedia: (media: MediaItem): Promise<void> => Promise.resolve(currentAdapter.updateMedia(media)),
  deleteMedia: (id: string): Promise<void> => Promise.resolve(currentAdapter.deleteMedia(id)),

  // News & Announcements
  getNews: (): NewsItem[] => currentAdapter.getNews() as NewsItem[],
  saveNews: (data: NewsItem[]): Promise<void> => Promise.resolve(currentAdapter.saveNews(data)),
  addNews: (news: NewsItem): Promise<void> => Promise.resolve(currentAdapter.addNews(news)),
  updateNews: (news: NewsItem): Promise<void> => Promise.resolve(currentAdapter.updateNews(news)),
  deleteNews: (id: string): Promise<void> => Promise.resolve(currentAdapter.deleteNews(id)),

  // Donations
  getDonations: (): DonationRecord[] => currentAdapter.getDonations() as DonationRecord[],
  saveDonations: (data: DonationRecord[]): Promise<void> => Promise.resolve(currentAdapter.saveDonations(data)),
  addDonation: (don: DonationRecord, captchaToken?: string): Promise<void> => Promise.resolve(currentAdapter.addDonation(don, captchaToken)),

  // Site Settings
  getSiteSettings: (): SiteSettings => currentAdapter.getSiteSettings() as SiteSettings,
  saveSiteSettings: (data: SiteSettings): Promise<void> => Promise.resolve(currentAdapter.saveSiteSettings(data)),

  // Real Site Visitors Logs & Analytics
  getVisitors: (): SiteVisitorLog[] => (currentAdapter.getVisitors?.() as SiteVisitorLog[]) || [],
  addVisitor: (log: SiteVisitorLog): Promise<void> => Promise.resolve(currentAdapter.addVisitor?.(log)),
  clearVisitors: (): Promise<void> => Promise.resolve(currentAdapter.clearVisitors?.()),

  // Cloudflare D1 Sync
  syncFromCloud: (): Promise<void> => cloudAdapter.syncFromCloud(),

  // Reset to Defaults
  resetAll: (): Promise<void> => Promise.resolve(currentAdapter.resetAll())
};
