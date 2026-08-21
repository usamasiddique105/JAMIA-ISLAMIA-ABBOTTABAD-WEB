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
  ClassBooking 
} from '../types';
import { IDatabaseService, DB_COLLECTIONS } from './dbInterface';
import { LocalStorageAdapter, STORAGE_KEYS } from './localStorageAdapter';
import { FirestoreAdapter } from './firestoreAdapter';
import { isFirebaseConfigured } from './firebaseConfig';

// Active adapter dynamically selects Cloud Firestore when configured, falling back seamlessly to LocalStorage
const currentAdapter: IDatabaseService = isFirebaseConfigured()
  ? new FirestoreAdapter()
  : new LocalStorageAdapter();

export const StorageService = {
  // Collection & Storage Keys Metadata
  collections: DB_COLLECTIONS,
  storageKeys: STORAGE_KEYS,
  isCloudReady: isFirebaseConfigured,

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

  // Faculty
  getFaculty: (): FacultyMember[] => currentAdapter.getFaculty() as FacultyMember[],
  saveFaculty: (data: FacultyMember[]): void => { currentAdapter.saveFaculty(data); },

  // Books / Publications
  getBooks: (): PublicationBook[] => currentAdapter.getBooks() as PublicationBook[],
  saveBooks: (data: PublicationBook[]): void => { currentAdapter.saveBooks(data); },
  addBook: (book: PublicationBook): void => { currentAdapter.addBook(book); },

  // Media (Audio, Video, Photo)
  getMedia: (): MediaItem[] => currentAdapter.getMedia() as MediaItem[],
  saveMedia: (data: MediaItem[]): void => { currentAdapter.saveMedia(data); },
  addMedia: (media: MediaItem): void => { currentAdapter.addMedia(media); },

  // News & Announcements
  getNews: (): NewsItem[] => currentAdapter.getNews() as NewsItem[],
  saveNews: (data: NewsItem[]): void => { currentAdapter.saveNews(data); },
  addNews: (news: NewsItem): void => { currentAdapter.addNews(news); },

  // Donations
  getDonations: (): DonationRecord[] => currentAdapter.getDonations() as DonationRecord[],
  saveDonations: (data: DonationRecord[]): void => { currentAdapter.saveDonations(data); },
  addDonation: (don: DonationRecord): void => { currentAdapter.addDonation(don); },

  // Site Settings
  getSiteSettings: (): SiteSettings => currentAdapter.getSiteSettings() as SiteSettings,
  saveSiteSettings: (data: SiteSettings): void => { currentAdapter.saveSiteSettings(data); },

  // Reset to Defaults
  resetAll: (): void => { currentAdapter.resetAll(); }
};
