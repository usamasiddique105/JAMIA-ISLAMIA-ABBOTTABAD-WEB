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
const currentAdapter: IDatabaseService = new CloudApiAdapter();

export const StorageService = {
  // Collection & Storage Keys Metadata
  collections: DB_COLLECTIONS,
  storageKeys: D1_STORAGE_KEYS,
  isCloudReady: () => true,

  // Fatwas
  getFatwas: (): Fatwa[] => currentAdapter.getFatwas() as Fatwa[],
  saveFatwas: (data: Fatwa[]): void => { currentAdapter.saveFatwas(data); },
  addFatwa: (fatwa: Fatwa): void => { currentAdapter.addFatwa(fatwa); },
  updateFatwa: (fatwa: Fatwa): void => { currentAdapter.updateFatwa(fatwa); },
  deleteFatwa: (id: string): void => { currentAdapter.deleteFatwa(id); },

  // Online Questions
  getQuestions: (): OnlineQuestion[] => currentAdapter.getQuestions() as OnlineQuestion[],
  saveQuestions: (data: OnlineQuestion[]): void => { currentAdapter.saveQuestions(data); },
  addQuestion: (question: OnlineQuestion): void => { currentAdapter.addQuestion(question); },
  updateQuestion: (question: OnlineQuestion): void => { currentAdapter.updateQuestion(question); },

  // Online Class Bookings & Admissions
  getClassBookings: (): ClassBooking[] => currentAdapter.getClassBookings() as ClassBooking[],
  saveClassBookings: (data: ClassBooking[]): void => { currentAdapter.saveClassBookings(data); },
  addClassBooking: (booking: ClassBooking): void => { currentAdapter.addClassBooking(booking); },
  updateClassBooking: (booking: ClassBooking): void => { currentAdapter.updateClassBooking(booking); },
  deleteClassBooking: (id: string): void => { currentAdapter.deleteClassBooking(id); },

  // Exam Results
  getExamResults: (): ExamResult[] => currentAdapter.getExamResults() as ExamResult[],
  saveExamResults: (data: ExamResult[]): void => { currentAdapter.saveExamResults(data); },
  addExamResult: (result: ExamResult): void => { currentAdapter.addExamResult(result); },
  updateExamResult: (result: ExamResult): void => { currentAdapter.updateExamResult(result); },
  deleteExamResult: (id: string): void => { currentAdapter.deleteExamResult(id); },

  // Departments
  getDepartments: (): Department[] => currentAdapter.getDepartments() as Department[],
  saveDepartments: (data: Department[]): void => { currentAdapter.saveDepartments(data); },
  addDepartment: (dept: Department): void => { currentAdapter.addDepartment(dept); },
  updateDepartment: (dept: Department): void => { currentAdapter.updateDepartment(dept); },
  deleteDepartment: (id: string): void => { currentAdapter.deleteDepartment(id); },

  // Faculty
  getFaculty: (): FacultyMember[] => currentAdapter.getFaculty() as FacultyMember[],
  saveFaculty: (data: FacultyMember[]): void => { currentAdapter.saveFaculty(data); },
  addFaculty: (faculty: FacultyMember): void => { currentAdapter.addFaculty(faculty); },
  updateFaculty: (faculty: FacultyMember): void => { currentAdapter.updateFaculty(faculty); },
  deleteFaculty: (id: string): void => { currentAdapter.deleteFaculty(id); },

  // Books / Publications
  getBooks: (): PublicationBook[] => currentAdapter.getBooks() as PublicationBook[],
  saveBooks: (data: PublicationBook[]): void => { currentAdapter.saveBooks(data); },
  addBook: (book: PublicationBook): void => { currentAdapter.addBook(book); },
  updateBook: (book: PublicationBook): void => { currentAdapter.updateBook(book); },
  deleteBook: (id: string): void => { currentAdapter.deleteBook(id); },

  // Media (Audio, Video, Photo)
  getMedia: (): MediaItem[] => currentAdapter.getMedia() as MediaItem[],
  saveMedia: (data: MediaItem[]): void => { currentAdapter.saveMedia(data); },
  addMedia: (media: MediaItem): void => { currentAdapter.addMedia(media); },
  updateMedia: (media: MediaItem): void => { currentAdapter.updateMedia(media); },
  deleteMedia: (id: string): void => { currentAdapter.deleteMedia(id); },

  // News & Announcements
  getNews: (): NewsItem[] => currentAdapter.getNews() as NewsItem[],
  saveNews: (data: NewsItem[]): void => { currentAdapter.saveNews(data); },
  addNews: (news: NewsItem): void => { currentAdapter.addNews(news); },
  updateNews: (news: NewsItem): void => { currentAdapter.updateNews(news); },
  deleteNews: (id: string): void => { currentAdapter.deleteNews(id); },

  // Donations
  getDonations: (): DonationRecord[] => currentAdapter.getDonations() as DonationRecord[],
  saveDonations: (data: DonationRecord[]): void => { currentAdapter.saveDonations(data); },
  addDonation: (don: DonationRecord): void => { currentAdapter.addDonation(don); },

  // Site Settings
  getSiteSettings: (): SiteSettings => currentAdapter.getSiteSettings() as SiteSettings,
  saveSiteSettings: (data: SiteSettings): void => { currentAdapter.saveSiteSettings(data); },

  // Real Site Visitors Logs & Analytics
  getVisitors: (): SiteVisitorLog[] => (currentAdapter.getVisitors?.() as SiteVisitorLog[]) || [],
  addVisitor: (log: SiteVisitorLog): void => { currentAdapter.addVisitor?.(log); },
  clearVisitors: (): void => { currentAdapter.clearVisitors?.(); },

  // Reset to Defaults
  resetAll: (): void => { currentAdapter.resetAll(); }
};
