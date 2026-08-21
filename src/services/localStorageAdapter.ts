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
import { 
  INITIAL_FATWAS, 
  INITIAL_ONLINE_QUESTIONS, 
  INITIAL_EXAM_RESULTS, 
  INITIAL_DEPARTMENTS, 
  INITIAL_FACULTY, 
  INITIAL_BOOKS, 
  INITIAL_MEDIA, 
  INITIAL_NEWS, 
  INITIAL_DONATIONS, 
  INITIAL_SITE_SETTINGS,
  INITIAL_CLASS_BOOKINGS 
} from '../data/initialData';
import { IDatabaseService } from './dbInterface';

export const STORAGE_KEYS = {
  FATWAS: 'jia_fatwas_v2',
  QUESTIONS: 'jia_questions_v2',
  BOOKINGS: 'jia_class_bookings_v1',
  RESULTS: 'jia_exam_results_v1',
  DEPARTMENTS: 'jia_departments_v3',
  FACULTY: 'jia_faculty_v1',
  BOOKS: 'jia_books_v2',
  MEDIA: 'jia_media_v2',
  NEWS: 'jia_news_v1',
  DONATIONS: 'jia_donations_v1',
  SETTINGS: 'jia_settings_v3',
};

function getItem<T>(key: string, defaultValue: T): T {
  try {
    const data = localStorage.getItem(key);
    if (!data) return defaultValue;
    const parsed = JSON.parse(data) as T;
    if (Array.isArray(parsed) && parsed.length === 0 && Array.isArray(defaultValue) && defaultValue.length > 0) {
      return defaultValue;
    }
    return parsed;
  } catch (e) {
    console.error(`Error reading ${key} from localStorage:`, e);
    return defaultValue;
  }
}

function setItem<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.error(`Error saving ${key} to localStorage:`, e);
  }
}

export class LocalStorageAdapter implements IDatabaseService {
  // Fatwas
  getFatwas(): Fatwa[] {
    return getItem(STORAGE_KEYS.FATWAS, INITIAL_FATWAS);
  }
  saveFatwas(data: Fatwa[]): void {
    setItem(STORAGE_KEYS.FATWAS, data);
  }
  addFatwa(fatwa: Fatwa): void {
    const list = this.getFatwas();
    this.saveFatwas([fatwa, ...list]);
  }
  updateFatwa(fatwa: Fatwa): void {
    const list = this.getFatwas();
    const updated = list.map(item => item.id === fatwa.id ? fatwa : item);
    this.saveFatwas(updated);
  }
  deleteFatwa(id: string): void {
    const list = this.getFatwas();
    this.saveFatwas(list.filter(item => item.id !== id));
  }

  // Online Questions
  getQuestions(): OnlineQuestion[] {
    return getItem(STORAGE_KEYS.QUESTIONS, INITIAL_ONLINE_QUESTIONS);
  }
  saveQuestions(data: OnlineQuestion[]): void {
    setItem(STORAGE_KEYS.QUESTIONS, data);
  }
  addQuestion(question: OnlineQuestion): void {
    const list = this.getQuestions();
    this.saveQuestions([question, ...list]);
  }
  updateQuestion(question: OnlineQuestion): void {
    const list = this.getQuestions();
    const updated = list.map(item => item.id === question.id ? question : item);
    this.saveQuestions(updated);
  }

  // Online Class Bookings & Admissions
  getClassBookings(): ClassBooking[] {
    return getItem(STORAGE_KEYS.BOOKINGS, INITIAL_CLASS_BOOKINGS);
  }
  saveClassBookings(data: ClassBooking[]): void {
    setItem(STORAGE_KEYS.BOOKINGS, data);
  }
  addClassBooking(booking: ClassBooking): void {
    const list = this.getClassBookings();
    this.saveClassBookings([booking, ...list]);
  }
  updateClassBooking(booking: ClassBooking): void {
    const list = this.getClassBookings();
    const updated = list.map(item => item.id === booking.id ? booking : item);
    this.saveClassBookings(updated);
  }
  deleteClassBooking(id: string): void {
    const list = this.getClassBookings();
    this.saveClassBookings(list.filter(item => item.id !== id));
  }

  // Exam Results
  getExamResults(): ExamResult[] {
    return getItem(STORAGE_KEYS.RESULTS, INITIAL_EXAM_RESULTS);
  }
  saveExamResults(data: ExamResult[]): void {
    setItem(STORAGE_KEYS.RESULTS, data);
  }
  addExamResult(result: ExamResult): void {
    const list = this.getExamResults();
    this.saveExamResults([result, ...list]);
  }
  updateExamResult(result: ExamResult): void {
    const list = this.getExamResults();
    const updated = list.map(item => item.id === result.id ? result : item);
    this.saveExamResults(updated);
  }
  deleteExamResult(id: string): void {
    const list = this.getExamResults();
    this.saveExamResults(list.filter(item => item.id !== id));
  }

  // Departments
  getDepartments(): Department[] {
    return getItem(STORAGE_KEYS.DEPARTMENTS, INITIAL_DEPARTMENTS);
  }
  saveDepartments(data: Department[]): void {
    setItem(STORAGE_KEYS.DEPARTMENTS, data);
  }

  // Faculty
  getFaculty(): FacultyMember[] {
    return getItem(STORAGE_KEYS.FACULTY, INITIAL_FACULTY);
  }
  saveFaculty(data: FacultyMember[]): void {
    setItem(STORAGE_KEYS.FACULTY, data);
  }

  // Books / Publications
  getBooks(): PublicationBook[] {
    return getItem(STORAGE_KEYS.BOOKS, INITIAL_BOOKS);
  }
  saveBooks(data: PublicationBook[]): void {
    setItem(STORAGE_KEYS.BOOKS, data);
  }
  addBook(book: PublicationBook): void {
    const list = this.getBooks();
    this.saveBooks([book, ...list]);
  }

  // Media
  getMedia(): MediaItem[] {
    return getItem(STORAGE_KEYS.MEDIA, INITIAL_MEDIA);
  }
  saveMedia(data: MediaItem[]): void {
    setItem(STORAGE_KEYS.MEDIA, data);
  }
  addMedia(media: MediaItem): void {
    const list = this.getMedia();
    this.saveMedia([media, ...list]);
  }

  // News & Announcements
  getNews(): NewsItem[] {
    return getItem(STORAGE_KEYS.NEWS, INITIAL_NEWS);
  }
  saveNews(data: NewsItem[]): void {
    setItem(STORAGE_KEYS.NEWS, data);
  }
  addNews(news: NewsItem): void {
    const list = this.getNews();
    this.saveNews([news, ...list]);
  }

  // Donations
  getDonations(): DonationRecord[] {
    return getItem(STORAGE_KEYS.DONATIONS, INITIAL_DONATIONS);
  }
  saveDonations(data: DonationRecord[]): void {
    setItem(STORAGE_KEYS.DONATIONS, data);
  }
  addDonation(don: DonationRecord): void {
    const list = this.getDonations();
    this.saveDonations([don, ...list]);
  }

  // Site Settings
  getSiteSettings(): SiteSettings {
    return getItem(STORAGE_KEYS.SETTINGS, INITIAL_SITE_SETTINGS);
  }
  saveSiteSettings(data: SiteSettings): void {
    setItem(STORAGE_KEYS.SETTINGS, data);
  }

  // Reset to Defaults
  resetAll(): void {
    localStorage.removeItem(STORAGE_KEYS.FATWAS);
    localStorage.removeItem(STORAGE_KEYS.QUESTIONS);
    localStorage.removeItem(STORAGE_KEYS.RESULTS);
    localStorage.removeItem(STORAGE_KEYS.DEPARTMENTS);
    localStorage.removeItem(STORAGE_KEYS.FACULTY);
    localStorage.removeItem(STORAGE_KEYS.BOOKS);
    localStorage.removeItem(STORAGE_KEYS.MEDIA);
    localStorage.removeItem(STORAGE_KEYS.NEWS);
    localStorage.removeItem(STORAGE_KEYS.DONATIONS);
    localStorage.removeItem(STORAGE_KEYS.SETTINGS);
  }
}
