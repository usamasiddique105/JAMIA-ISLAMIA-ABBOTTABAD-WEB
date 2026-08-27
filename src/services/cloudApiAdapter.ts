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

export const D1_STORAGE_KEYS = {
  FATWAS: 'jia_d1_fatwas_v1',
  QUESTIONS: 'jia_d1_questions_v1',
  BOOKINGS: 'jia_d1_bookings_v1',
  RESULTS: 'jia_d1_results_v1',
  DEPARTMENTS: 'jia_d1_departments_v1',
  FACULTY: 'jia_d1_faculty_v1',
  BOOKS: 'jia_d1_books_v1',
  MEDIA: 'jia_d1_media_v1',
  NEWS: 'jia_d1_news_v1',
  DONATIONS: 'jia_d1_donations_v1',
  SETTINGS: 'jia_d1_settings_v1',
  VISITORS: 'jia_d1_visitors_v1',
  ADMIN_TOKEN: 'jia_d1_admin_token',
  ADMIN_EMAIL: 'jia_d1_admin_email',
};

function getLocal<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

function setLocal<T>(key: string, data: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (err) {
    console.warn(`LocalStorage write error for ${key}:`, err);
  }
}

export function getAdminToken(): string | null {
  try {
    return localStorage.getItem(D1_STORAGE_KEYS.ADMIN_TOKEN) || sessionStorage.getItem(D1_STORAGE_KEYS.ADMIN_TOKEN);
  } catch {
    return null;
  }
}

export function setAdminToken(token: string, email: string = 'jamiaislamia2003@gmail.com', remember: boolean = true): void {
  try {
    if (remember) {
      localStorage.setItem(D1_STORAGE_KEYS.ADMIN_TOKEN, token);
      localStorage.setItem(D1_STORAGE_KEYS.ADMIN_EMAIL, email);
    } else {
      sessionStorage.setItem(D1_STORAGE_KEYS.ADMIN_TOKEN, token);
      sessionStorage.setItem(D1_STORAGE_KEYS.ADMIN_EMAIL, email);
    }
  } catch (err) {
    console.error('Error saving admin token:', err);
  }
}

export function removeAdminToken(): void {
  try {
    localStorage.removeItem(D1_STORAGE_KEYS.ADMIN_TOKEN);
    localStorage.removeItem(D1_STORAGE_KEYS.ADMIN_EMAIL);
    sessionStorage.removeItem(D1_STORAGE_KEYS.ADMIN_TOKEN);
    sessionStorage.removeItem(D1_STORAGE_KEYS.ADMIN_EMAIL);
  } catch (err) {
    console.error('Error clearing admin token:', err);
  }
}

export async function apiFetch(endpoint: string, options: RequestInit = {}): Promise<any> {
  const token = getAdminToken();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string> || {}),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  try {
    const res = await fetch(endpoint, {
      ...options,
      headers,
      credentials: 'include', // Include HttpOnly cookies
    });

    const data = await res.json();
    return data;
  } catch (err) {
    console.warn(`Cloudflare API call failed for ${endpoint}:`, err);
    return null;
  }
}

/**
 * Cloudflare D1 / Pages Functions Database Adapter
 * Provides local-first instant cache + asynchronous Cloudflare SQL/D1 persistence
 */
export class CloudApiAdapter implements IDatabaseService {
  private syncInitialized: boolean = false;

  constructor() {
    this.initSync();
  }

  private async initSync() {
    if (this.syncInitialized || typeof window === 'undefined') return;
    this.syncInitialized = true;

    // Fetch initial datasets in background from Cloudflare D1 API
    try {
      const [fatwasRes, questionsRes, bookingsRes, resultsRes, newsRes, booksRes, facultyRes, deptRes, settingsRes] = await Promise.allSettled([
        apiFetch('/api/fatwas'),
        apiFetch('/api/questions'),
        apiFetch('/api/bookings'),
        apiFetch('/api/results'),
        apiFetch('/api/news'),
        apiFetch('/api/books'),
        apiFetch('/api/faculty'),
        apiFetch('/api/departments'),
        apiFetch('/api/settings'),
      ]);

      if (fatwasRes.status === 'fulfilled' && fatwasRes.value?.data) {
        setLocal(D1_STORAGE_KEYS.FATWAS, fatwasRes.value.data);
      }
      if (questionsRes.status === 'fulfilled' && questionsRes.value?.data) {
        setLocal(D1_STORAGE_KEYS.QUESTIONS, questionsRes.value.data);
      }
      if (bookingsRes.status === 'fulfilled' && bookingsRes.value?.data) {
        setLocal(D1_STORAGE_KEYS.BOOKINGS, bookingsRes.value.data);
      }
      if (resultsRes.status === 'fulfilled' && resultsRes.value?.data) {
        setLocal(D1_STORAGE_KEYS.RESULTS, resultsRes.value.data);
      }
      if (newsRes.status === 'fulfilled' && newsRes.value?.data) {
        setLocal(D1_STORAGE_KEYS.NEWS, newsRes.value.data);
      }
      if (booksRes.status === 'fulfilled' && booksRes.value?.data) {
        setLocal(D1_STORAGE_KEYS.BOOKS, booksRes.value.data);
      }
      if (facultyRes.status === 'fulfilled' && facultyRes.value?.data) {
        setLocal(D1_STORAGE_KEYS.FACULTY, facultyRes.value.data);
      }
      if (deptRes.status === 'fulfilled' && deptRes.value?.data) {
        setLocal(D1_STORAGE_KEYS.DEPARTMENTS, deptRes.value.data);
      }
      if (settingsRes.status === 'fulfilled' && settingsRes.value?.data) {
        setLocal(D1_STORAGE_KEYS.SETTINGS, settingsRes.value.data);
      }
    } catch (err) {
      console.warn('Background D1 sync notice:', err);
    }
  }

  // Fatwas
  getFatwas(): Fatwa[] {
    return getLocal<Fatwa[]>(D1_STORAGE_KEYS.FATWAS, INITIAL_FATWAS);
  }

  saveFatwas(data: Fatwa[]): void {
    setLocal(D1_STORAGE_KEYS.FATWAS, data);
    apiFetch('/api/fatwas/batch', {
      method: 'POST',
      body: JSON.stringify({ fatwas: data }),
    });
  }

  addFatwa(fatwa: Fatwa): void {
    const list = this.getFatwas();
    const updated = [fatwa, ...list];
    setLocal(D1_STORAGE_KEYS.FATWAS, updated);
    apiFetch('/api/fatwas', {
      method: 'POST',
      body: JSON.stringify(fatwa),
    });
  }

  updateFatwa(fatwa: Fatwa): void {
    const list = this.getFatwas();
    const updated = list.map(item => item.id === fatwa.id ? fatwa : item);
    setLocal(D1_STORAGE_KEYS.FATWAS, updated);
    apiFetch(`/api/fatwas/${encodeURIComponent(fatwa.id)}`, {
      method: 'PUT',
      body: JSON.stringify(fatwa),
    });
  }

  deleteFatwa(id: string): void {
    const list = this.getFatwas();
    const updated = list.filter(item => item.id !== id);
    setLocal(D1_STORAGE_KEYS.FATWAS, updated);
    apiFetch(`/api/fatwas/${encodeURIComponent(id)}`, {
      method: 'DELETE',
    });
  }

  // Online Questions
  getQuestions(): OnlineQuestion[] {
    return getLocal<OnlineQuestion[]>(D1_STORAGE_KEYS.QUESTIONS, INITIAL_ONLINE_QUESTIONS);
  }

  saveQuestions(data: OnlineQuestion[]): void {
    setLocal(D1_STORAGE_KEYS.QUESTIONS, data);
  }

  addQuestion(question: OnlineQuestion): void {
    const list = this.getQuestions();
    setLocal(D1_STORAGE_KEYS.QUESTIONS, [question, ...list]);
    apiFetch('/api/questions', {
      method: 'POST',
      body: JSON.stringify(question),
    });
  }

  updateQuestion(question: OnlineQuestion): void {
    const list = this.getQuestions();
    const updated = list.map(item => item.id === question.id ? question : item);
    setLocal(D1_STORAGE_KEYS.QUESTIONS, updated);
    apiFetch(`/api/questions/${encodeURIComponent(question.id)}`, {
      method: 'PUT',
      body: JSON.stringify(question),
    });
  }

  // Online Class Bookings
  getClassBookings(): ClassBooking[] {
    return getLocal<ClassBooking[]>(D1_STORAGE_KEYS.BOOKINGS, INITIAL_CLASS_BOOKINGS);
  }

  saveClassBookings(data: ClassBooking[]): void {
    setLocal(D1_STORAGE_KEYS.BOOKINGS, data);
  }

  addClassBooking(booking: ClassBooking): void {
    const list = this.getClassBookings();
    setLocal(D1_STORAGE_KEYS.BOOKINGS, [booking, ...list]);
    apiFetch('/api/bookings', {
      method: 'POST',
      body: JSON.stringify(booking),
    });
  }

  updateClassBooking(booking: ClassBooking): void {
    const list = this.getClassBookings();
    const updated = list.map(item => item.id === booking.id ? booking : item);
    setLocal(D1_STORAGE_KEYS.BOOKINGS, updated);
    apiFetch(`/api/bookings/${encodeURIComponent(booking.id)}`, {
      method: 'PUT',
      body: JSON.stringify(booking),
    });
  }

  deleteClassBooking(id: string): void {
    const list = this.getClassBookings();
    const updated = list.filter(item => item.id !== id);
    setLocal(D1_STORAGE_KEYS.BOOKINGS, updated);
    apiFetch(`/api/bookings/${encodeURIComponent(id)}`, {
      method: 'DELETE',
    });
  }

  // Exam Results
  getExamResults(): ExamResult[] {
    return getLocal<ExamResult[]>(D1_STORAGE_KEYS.RESULTS, INITIAL_EXAM_RESULTS);
  }

  saveExamResults(data: ExamResult[]): void {
    setLocal(D1_STORAGE_KEYS.RESULTS, data);
  }

  addExamResult(result: ExamResult): void {
    const list = this.getExamResults();
    setLocal(D1_STORAGE_KEYS.RESULTS, [result, ...list]);
    apiFetch('/api/results', {
      method: 'POST',
      body: JSON.stringify(result),
    });
  }

  updateExamResult(result: ExamResult): void {
    const list = this.getExamResults();
    const updated = list.map(item => item.id === result.id ? result : item);
    setLocal(D1_STORAGE_KEYS.RESULTS, updated);
    apiFetch(`/api/results/${encodeURIComponent(result.id)}`, {
      method: 'PUT',
      body: JSON.stringify(result),
    });
  }

  deleteExamResult(id: string): void {
    const list = this.getExamResults();
    const updated = list.filter(item => item.id !== id);
    setLocal(D1_STORAGE_KEYS.RESULTS, updated);
    apiFetch(`/api/results/${encodeURIComponent(id)}`, {
      method: 'DELETE',
    });
  }

  // Departments
  getDepartments(): Department[] {
    return getLocal<Department[]>(D1_STORAGE_KEYS.DEPARTMENTS, INITIAL_DEPARTMENTS);
  }

  saveDepartments(data: Department[]): void {
    setLocal(D1_STORAGE_KEYS.DEPARTMENTS, data);
    apiFetch('/api/departments/batch', {
      method: 'POST',
      body: JSON.stringify({ departments: data }),
    });
  }

  addDepartment(dept: Department): void {
    const list = this.getDepartments();
    setLocal(D1_STORAGE_KEYS.DEPARTMENTS, [...list, dept]);
    apiFetch('/api/departments', {
      method: 'POST',
      body: JSON.stringify(dept),
    });
  }

  updateDepartment(dept: Department): void {
    const list = this.getDepartments();
    const updated = list.map(item => item.id === dept.id ? dept : item);
    setLocal(D1_STORAGE_KEYS.DEPARTMENTS, updated);
    apiFetch(`/api/departments/${encodeURIComponent(dept.id)}`, {
      method: 'PUT',
      body: JSON.stringify(dept),
    });
  }

  deleteDepartment(id: string): void {
    const list = this.getDepartments();
    const updated = list.filter(item => item.id !== id);
    setLocal(D1_STORAGE_KEYS.DEPARTMENTS, updated);
    apiFetch(`/api/departments/${encodeURIComponent(id)}`, {
      method: 'DELETE',
    });
  }

  // Faculty
  getFaculty(): FacultyMember[] {
    return getLocal<FacultyMember[]>(D1_STORAGE_KEYS.FACULTY, INITIAL_FACULTY);
  }

  saveFaculty(data: FacultyMember[]): void {
    setLocal(D1_STORAGE_KEYS.FACULTY, data);
    apiFetch('/api/faculty/batch', {
      method: 'POST',
      body: JSON.stringify({ faculty: data }),
    });
  }

  addFaculty(faculty: FacultyMember): void {
    const list = this.getFaculty();
    setLocal(D1_STORAGE_KEYS.FACULTY, [...list, faculty]);
    apiFetch('/api/faculty', {
      method: 'POST',
      body: JSON.stringify(faculty),
    });
  }

  updateFaculty(faculty: FacultyMember): void {
    const list = this.getFaculty();
    const updated = list.map(item => item.id === faculty.id ? faculty : item);
    setLocal(D1_STORAGE_KEYS.FACULTY, updated);
    apiFetch(`/api/faculty/${encodeURIComponent(faculty.id)}`, {
      method: 'PUT',
      body: JSON.stringify(faculty),
    });
  }

  deleteFaculty(id: string): void {
    const list = this.getFaculty();
    const updated = list.filter(item => item.id !== id);
    setLocal(D1_STORAGE_KEYS.FACULTY, updated);
    apiFetch(`/api/faculty/${encodeURIComponent(id)}`, {
      method: 'DELETE',
    });
  }

  // Books
  getBooks(): PublicationBook[] {
    return getLocal<PublicationBook[]>(D1_STORAGE_KEYS.BOOKS, INITIAL_BOOKS);
  }

  saveBooks(data: PublicationBook[]): void {
    setLocal(D1_STORAGE_KEYS.BOOKS, data);
    apiFetch('/api/books/batch', {
      method: 'POST',
      body: JSON.stringify({ books: data }),
    });
  }

  addBook(book: PublicationBook): void {
    const list = this.getBooks();
    setLocal(D1_STORAGE_KEYS.BOOKS, [book, ...list]);
    apiFetch('/api/books', {
      method: 'POST',
      body: JSON.stringify(book),
    });
  }

  updateBook(book: PublicationBook): void {
    const list = this.getBooks();
    const updated = list.map(item => item.id === book.id ? book : item);
    setLocal(D1_STORAGE_KEYS.BOOKS, updated);
    apiFetch(`/api/books/${encodeURIComponent(book.id)}`, {
      method: 'PUT',
      body: JSON.stringify(book),
    });
  }

  deleteBook(id: string): void {
    const list = this.getBooks();
    const updated = list.filter(item => item.id !== id);
    setLocal(D1_STORAGE_KEYS.BOOKS, updated);
    apiFetch(`/api/books/${encodeURIComponent(id)}`, {
      method: 'DELETE',
    });
  }

  // Media
  getMedia(): MediaItem[] {
    return getLocal<MediaItem[]>(D1_STORAGE_KEYS.MEDIA, INITIAL_MEDIA);
  }

  saveMedia(data: MediaItem[]): void {
    setLocal(D1_STORAGE_KEYS.MEDIA, data);
    apiFetch('/api/media/batch', {
      method: 'POST',
      body: JSON.stringify({ media: data }),
    });
  }

  addMedia(media: MediaItem): void {
    const list = this.getMedia();
    setLocal(D1_STORAGE_KEYS.MEDIA, [media, ...list]);
    apiFetch('/api/media', {
      method: 'POST',
      body: JSON.stringify(media),
    });
  }

  updateMedia(media: MediaItem): void {
    const list = this.getMedia();
    const updated = list.map(item => item.id === media.id ? media : item);
    setLocal(D1_STORAGE_KEYS.MEDIA, updated);
    apiFetch(`/api/media/${encodeURIComponent(media.id)}`, {
      method: 'PUT',
      body: JSON.stringify(media),
    });
  }

  deleteMedia(id: string): void {
    const list = this.getMedia();
    const updated = list.filter(item => item.id !== id);
    setLocal(D1_STORAGE_KEYS.MEDIA, updated);
    apiFetch(`/api/media/${encodeURIComponent(id)}`, {
      method: 'DELETE',
    });
  }

  // News
  getNews(): NewsItem[] {
    return getLocal<NewsItem[]>(D1_STORAGE_KEYS.NEWS, INITIAL_NEWS);
  }

  saveNews(data: NewsItem[]): void {
    setLocal(D1_STORAGE_KEYS.NEWS, data);
    apiFetch('/api/news/batch', {
      method: 'POST',
      body: JSON.stringify({ news: data }),
    });
  }

  addNews(news: NewsItem): void {
    const list = this.getNews();
    setLocal(D1_STORAGE_KEYS.NEWS, [news, ...list]);
    apiFetch('/api/news', {
      method: 'POST',
      body: JSON.stringify(news),
    });
  }

  updateNews(news: NewsItem): void {
    const list = this.getNews();
    const updated = list.map(item => item.id === news.id ? news : item);
    setLocal(D1_STORAGE_KEYS.NEWS, updated);
    apiFetch(`/api/news/${encodeURIComponent(news.id)}`, {
      method: 'PUT',
      body: JSON.stringify(news),
    });
  }

  deleteNews(id: string): void {
    const list = this.getNews();
    const updated = list.filter(item => item.id !== id);
    setLocal(D1_STORAGE_KEYS.NEWS, updated);
    apiFetch(`/api/news/${encodeURIComponent(id)}`, {
      method: 'DELETE',
    });
  }

  // Donations
  getDonations(): DonationRecord[] {
    return getLocal<DonationRecord[]>(D1_STORAGE_KEYS.DONATIONS, INITIAL_DONATIONS);
  }

  saveDonations(data: DonationRecord[]): void {
    setLocal(D1_STORAGE_KEYS.DONATIONS, data);
  }

  addDonation(don: DonationRecord): void {
    const list = this.getDonations();
    setLocal(D1_STORAGE_KEYS.DONATIONS, [don, ...list]);
    apiFetch('/api/donations', {
      method: 'POST',
      body: JSON.stringify(don),
    });
  }

  // Site Settings
  getSiteSettings(): SiteSettings {
    return getLocal<SiteSettings>(D1_STORAGE_KEYS.SETTINGS, INITIAL_SITE_SETTINGS);
  }

  saveSiteSettings(data: SiteSettings): void {
    setLocal(D1_STORAGE_KEYS.SETTINGS, data);
    apiFetch('/api/settings', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  // Real Site Visitors Logs
  getVisitors(): SiteVisitorLog[] {
    return getLocal<SiteVisitorLog[]>(D1_STORAGE_KEYS.VISITORS, []);
  }

  addVisitor(log: SiteVisitorLog): void {
    const list = this.getVisitors();
    const updated = [log, ...list].slice(0, 2000);
    setLocal(D1_STORAGE_KEYS.VISITORS, updated);
    apiFetch('/api/visitors', {
      method: 'POST',
      body: JSON.stringify(log),
    });
  }

  clearVisitors(): void {
    localStorage.removeItem(D1_STORAGE_KEYS.VISITORS);
    apiFetch('/api/visitors/clear', {
      method: 'POST',
    });
  }

  resetAll(): void {
    Object.values(D1_STORAGE_KEYS).forEach(key => {
      localStorage.removeItem(key);
      sessionStorage.removeItem(key);
    });
    apiFetch('/api/system/reset', {
      method: 'POST',
    });
  }
}
