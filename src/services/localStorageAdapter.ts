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
  FATWAS: 'jia_fatwas_v5',
  QUESTIONS: 'jia_questions_v3',
  BOOKINGS: 'jia_class_bookings_v2',
  RESULTS: 'jia_exam_results_v1',
  DEPARTMENTS: 'jia_departments_v4',
  FACULTY: 'jia_faculty_v1',
  BOOKS: 'jia_books_v3',
  MEDIA: 'jia_media_v2',
  NEWS: 'jia_news_v1',
  DONATIONS: 'jia_donations_v2',
  SETTINGS: 'jia_settings_v3',
  VISITORS: 'jia_visitors_v1',
};

function getItem<T>(key: string, defaultValue: T): T {
  try {
    const data = localStorage.getItem(key);
    if (data === null || data === undefined) return defaultValue;
    const parsed = JSON.parse(data) as T;
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
    return getItem<Fatwa[]>(STORAGE_KEYS.FATWAS, []);
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
  addDepartment(dept: Department): void {
    const list = this.getDepartments();
    this.saveDepartments([dept, ...list]);
  }
  updateDepartment(dept: Department): void {
    const list = this.getDepartments();
    this.saveDepartments(list.map(item => item.id === dept.id ? dept : item));
  }
  deleteDepartment(id: string): void {
    const list = this.getDepartments();
    this.saveDepartments(list.filter(item => item.id !== id));
  }

  // Faculty
  getFaculty(): FacultyMember[] {
    return getItem(STORAGE_KEYS.FACULTY, INITIAL_FACULTY);
  }
  saveFaculty(data: FacultyMember[]): void {
    setItem(STORAGE_KEYS.FACULTY, data);
  }
  addFaculty(faculty: FacultyMember): void {
    const list = this.getFaculty();
    this.saveFaculty([faculty, ...list]);
  }
  updateFaculty(faculty: FacultyMember): void {
    const list = this.getFaculty();
    this.saveFaculty(list.map(item => item.id === faculty.id ? faculty : item));
  }
  deleteFaculty(id: string): void {
    const list = this.getFaculty();
    this.saveFaculty(list.filter(item => item.id !== id));
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
  updateBook(book: PublicationBook): void {
    const list = this.getBooks();
    this.saveBooks(list.map(item => item.id === book.id ? book : item));
  }
  deleteBook(id: string): void {
    const list = this.getBooks();
    this.saveBooks(list.filter(item => item.id !== id));
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
  updateMedia(media: MediaItem): void {
    const list = this.getMedia();
    this.saveMedia(list.map(item => item.id === media.id ? media : item));
  }
  deleteMedia(id: string): void {
    const list = this.getMedia();
    this.saveMedia(list.filter(item => item.id !== id));
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
  updateNews(news: NewsItem): void {
    const list = this.getNews();
    this.saveNews(list.map(item => item.id === news.id ? news : item));
  }
  deleteNews(id: string): void {
    const list = this.getNews();
    this.saveNews(list.filter(item => item.id !== id));
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

  // Real Site Visitors Logs & Analytics
  getVisitors(): SiteVisitorLog[] {
    return getItem<SiteVisitorLog[]>(STORAGE_KEYS.VISITORS, []);
  }
  addVisitor(log: SiteVisitorLog): void {
    const list = this.getVisitors();
    // Keep maximum latest 2000 logs locally
    const updated = [log, ...list].slice(0, 2000);
    setItem(STORAGE_KEYS.VISITORS, updated);
  }
  clearVisitors(): void {
    localStorage.removeItem(STORAGE_KEYS.VISITORS);
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
    localStorage.removeItem(STORAGE_KEYS.VISITORS);
  }
}
