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
  INITIAL_DEPARTMENTS, 
  INITIAL_FACULTY, 
  INITIAL_SITE_SETTINGS 
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

// Safe Local Cache Helpers (Read-Through & Offline Fallback ONLY)
function getLocal<T>(key: string, fallback: T): T {
  try {
    if (typeof window === 'undefined') return fallback;
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

function setLocal<T>(key: string, data: T): void {
  try {
    if (typeof window === 'undefined') return;
    localStorage.setItem(key, JSON.stringify(data));
  } catch (err) {
    console.warn(`LocalStorage write notice for ${key}:`, err);
  }
}

function notifyUpdate(): void {
  try {
    if (typeof window !== 'undefined' && typeof window.dispatchEvent === 'function') {
      if (typeof CustomEvent === 'function') {
        window.dispatchEvent(new CustomEvent('jamia_db_updated'));
      } else if (typeof document !== 'undefined' && typeof document.createEvent === 'function') {
        const event = document.createEvent('CustomEvent');
        event.initCustomEvent('jamia_db_updated', false, false, null);
        window.dispatchEvent(event);
      }
    }
  } catch (err) {
    // Non-blocking notification fallback
  }
}

export function getAdminToken(): string | null {
  try {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem(D1_STORAGE_KEYS.ADMIN_TOKEN) || sessionStorage.getItem(D1_STORAGE_KEYS.ADMIN_TOKEN);
  } catch {
    return null;
  }
}

export function setAdminToken(token: string, email: string = 'jamiaislamia2003@gmail.com', remember: boolean = true): void {
  try {
    if (typeof window === 'undefined') return;
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
    if (typeof window === 'undefined') return;
    localStorage.removeItem(D1_STORAGE_KEYS.ADMIN_TOKEN);
    localStorage.removeItem(D1_STORAGE_KEYS.ADMIN_EMAIL);
    sessionStorage.removeItem(D1_STORAGE_KEYS.ADMIN_TOKEN);
    sessionStorage.removeItem(D1_STORAGE_KEYS.ADMIN_EMAIL);
  } catch (err) {
    console.error('Error clearing admin token:', err);
  }
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
  token?: string;
  trackingNumber?: string;
  authenticated?: boolean;
  user?: any;
  [key: string]: any;
}

export async function apiFetch<T = any>(endpoint: string, options: RequestInit = {}): Promise<ApiResponse<T>> {
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
      credentials: 'include',
    });

    let data: any = {};
    try {
      data = await res.json();
    } catch {
      data = { success: res.ok };
    }

    if (!res.ok) {
      if (res.status === 401 && endpoint.startsWith('/api/')) {
        // Invalidate stale token if rejected
        if (!endpoint.includes('/api/login') && !endpoint.includes('/api/auth/me')) {
          console.warn('Session expired or unauthorized for:', endpoint);
        }
      }
      return {
        success: false,
        error: data.error || `سرور سے رابطہ ناکام رہا (${res.status})`,
        data: data.data,
      };
    }

    return {
      success: true,
      data: data.data !== undefined ? data.data : data,
      ...data,
    };
  } catch (err: any) {
    console.warn(`Cloudflare API request failed for ${endpoint}:`, err);
    return {
      success: false,
      error: err?.message || 'سرور سے رابطہ قائم نہ ہو سکا۔ برائے مہربانی انٹرنیٹ کنکشن چیک کریں۔',
    };
  }
}

/**
 * Cloudflare D1 Authoritative Database Service
 * - Cloudflare D1 SQL is the single source of truth
 * - Local storage operates strictly as an instant-load cache & offline fallback
 * - All mutations write to Cloudflare D1 first; local cache is only updated on server success
 */
export class CloudApiAdapter implements IDatabaseService {
  private syncInitialized: boolean = false;

  constructor() {
    this.initSync();
  }

  /**
   * Hydrates local memory cache with authoritative data from Cloudflare D1
   */
  public async initSync(): Promise<void> {
    if (this.syncInitialized || typeof window === 'undefined') return;
    this.syncInitialized = true;
    await this.syncFromCloud();
  }

  /**
   * Forces a fresh data pull from Cloudflare D1 for all collections
   */
  public async syncFromCloud(): Promise<void> {
    try {
      const [
        fatwasRes, 
        questionsRes, 
        bookingsRes, 
        resultsRes, 
        newsRes, 
        booksRes, 
        facultyRes, 
        deptRes, 
        mediaRes,
        settingsRes
      ] = await Promise.allSettled([
        apiFetch('/api/fatwas'),
        apiFetch('/api/questions'),
        apiFetch('/api/bookings'),
        apiFetch('/api/results'),
        apiFetch('/api/news'),
        apiFetch('/api/books'),
        apiFetch('/api/faculty'),
        apiFetch('/api/departments'),
        apiFetch('/api/media'),
        apiFetch('/api/settings'),
      ]);

      let changed = false;

      if (fatwasRes.status === 'fulfilled' && fatwasRes.value.success && Array.isArray(fatwasRes.value.data)) {
        setLocal(D1_STORAGE_KEYS.FATWAS, fatwasRes.value.data);
        changed = true;
      }
      if (questionsRes.status === 'fulfilled' && questionsRes.value.success && Array.isArray(questionsRes.value.data)) {
        setLocal(D1_STORAGE_KEYS.QUESTIONS, questionsRes.value.data);
        changed = true;
      }
      if (bookingsRes.status === 'fulfilled' && bookingsRes.value.success && Array.isArray(bookingsRes.value.data)) {
        setLocal(D1_STORAGE_KEYS.BOOKINGS, bookingsRes.value.data);
        changed = true;
      }
      if (resultsRes.status === 'fulfilled' && resultsRes.value.success && Array.isArray(resultsRes.value.data)) {
        setLocal(D1_STORAGE_KEYS.RESULTS, resultsRes.value.data);
        changed = true;
      }
      if (newsRes.status === 'fulfilled' && newsRes.value.success && Array.isArray(newsRes.value.data)) {
        setLocal(D1_STORAGE_KEYS.NEWS, newsRes.value.data);
        changed = true;
      }
      if (booksRes.status === 'fulfilled' && booksRes.value.success && Array.isArray(booksRes.value.data)) {
        setLocal(D1_STORAGE_KEYS.BOOKS, booksRes.value.data);
        changed = true;
      }
      if (facultyRes.status === 'fulfilled' && facultyRes.value.success && Array.isArray(facultyRes.value.data) && facultyRes.value.data.length > 0) {
        setLocal(D1_STORAGE_KEYS.FACULTY, facultyRes.value.data);
        changed = true;
      }
      if (deptRes.status === 'fulfilled' && deptRes.value.success && Array.isArray(deptRes.value.data) && deptRes.value.data.length > 0) {
        setLocal(D1_STORAGE_KEYS.DEPARTMENTS, deptRes.value.data);
        changed = true;
      }
      if (mediaRes.status === 'fulfilled' && mediaRes.value.success && Array.isArray(mediaRes.value.data)) {
        setLocal(D1_STORAGE_KEYS.MEDIA, mediaRes.value.data);
        changed = true;
      }
      if (settingsRes.status === 'fulfilled' && settingsRes.value.success && settingsRes.value.data && typeof settingsRes.value.data === 'object') {
        setLocal(D1_STORAGE_KEYS.SETTINGS, settingsRes.value.data);
        changed = true;
      }

      if (changed) {
        notifyUpdate();
      }
    } catch (err) {
      console.warn('Cloudflare D1 sync notice:', err);
    }
  }

  // ==========================================
  // 1. FATWAS (Authoritative D1 Operations)
  // ==========================================
  getFatwas(): Fatwa[] {
    return getLocal<Fatwa[]>(D1_STORAGE_KEYS.FATWAS, []);
  }

  async saveFatwas(data: Fatwa[]): Promise<void> {
    const res = await apiFetch('/api/fatwas/batch', {
      method: 'POST',
      body: JSON.stringify({ fatwas: data }),
    });
    if (!res.success) {
      throw new Error(res.error || 'D1 ڈیٹابیس میں فتاویٰ محفوظ نہیں ہو سکے۔');
    }
    setLocal(D1_STORAGE_KEYS.FATWAS, data);
    notifyUpdate();
  }

  async addFatwa(fatwa: Fatwa): Promise<void> {
    const res = await apiFetch('/api/fatwas', {
      method: 'POST',
      body: JSON.stringify(fatwa),
    });
    if (!res.success) {
      throw new Error(res.error || 'فتاویٰ ڈیٹابیس میں نیا فتویٰ شامل نہیں ہو سکا۔');
    }
    const list = this.getFatwas().filter(f => f.id !== fatwa.id);
    const updated = [fatwa, ...list];
    setLocal(D1_STORAGE_KEYS.FATWAS, updated);
    notifyUpdate();
  }

  async updateFatwa(fatwa: Fatwa): Promise<void> {
    const res = await apiFetch(`/api/fatwas/${encodeURIComponent(fatwa.id)}`, {
      method: 'PUT',
      body: JSON.stringify(fatwa),
    });
    if (!res.success) {
      throw new Error(res.error || 'فتویٰ اپ ڈیٹ کرنے کا عمل سرور پر ناکام رہا۔');
    }
    const list = this.getFatwas();
    const updated = list.map(item => item.id === fatwa.id ? fatwa : item);
    setLocal(D1_STORAGE_KEYS.FATWAS, updated);
    notifyUpdate();
  }

  async deleteFatwa(id: string): Promise<void> {
    const res = await apiFetch(`/api/fatwas/${encodeURIComponent(id)}`, {
      method: 'DELETE',
    });
    if (!res.success) {
      throw new Error(res.error || 'فتویٰ حذف کرنے کا عمل سرور پر ناکام رہا۔');
    }
    const list = this.getFatwas().filter(item => item.id !== id);
    setLocal(D1_STORAGE_KEYS.FATWAS, updatedList(list, id));
    notifyUpdate();
  }

  // ==========================================
  // 2. ONLINE QUESTIONS (Authoritative D1 Operations)
  // ==========================================
  getQuestions(): OnlineQuestion[] {
    return getLocal<OnlineQuestion[]>(D1_STORAGE_KEYS.QUESTIONS, []);
  }

  async saveQuestions(data: OnlineQuestion[]): Promise<void> {
    setLocal(D1_STORAGE_KEYS.QUESTIONS, data);
    notifyUpdate();
  }

  async addQuestion(question: OnlineQuestion, captchaToken?: string): Promise<string> {
    const res = await apiFetch<{ trackingNumber: string }>('/api/questions', {
      method: 'POST',
      body: JSON.stringify({
        ...question,
        captchaToken,
      }),
      headers: captchaToken ? { 'x-captcha-token': captchaToken } : {},
    });
    if (!res.success) {
      throw new Error(res.error || 'سوال ارسال کرنے کا عمل سرور پر ناکام رہا۔');
    }
    const tracking = res.trackingNumber || question.trackingNumber || `JIA-Q-${Date.now().toString().slice(-6)}`;
    const savedQ = { ...question, trackingNumber: tracking };
    const list = this.getQuestions().filter(q => q.id !== question.id);
    setLocal(D1_STORAGE_KEYS.QUESTIONS, [savedQ, ...list]);
    notifyUpdate();
    return tracking;
  }

  async updateQuestion(question: OnlineQuestion): Promise<void> {
    const res = await apiFetch(`/api/questions/${encodeURIComponent(question.id)}`, {
      method: 'PUT',
      body: JSON.stringify(question),
    });
    if (!res.success) {
      throw new Error(res.error || 'سوال کا جواب اپ ڈیٹ کرنے میں مسئلہ پیش آیا۔');
    }
    const list = this.getQuestions();
    const updated = list.map(item => item.id === question.id ? question : item);
    setLocal(D1_STORAGE_KEYS.QUESTIONS, updated);
    notifyUpdate();
  }

  // ==========================================
  // 3. CLASS BOOKINGS & ADMISSIONS (Authoritative D1 Operations)
  // ==========================================
  getClassBookings(): ClassBooking[] {
    return getLocal<ClassBooking[]>(D1_STORAGE_KEYS.BOOKINGS, []);
  }

  async saveClassBookings(data: ClassBooking[]): Promise<void> {
    setLocal(D1_STORAGE_KEYS.BOOKINGS, data);
    notifyUpdate();
  }

  async addClassBooking(booking: ClassBooking, captchaToken?: string): Promise<string> {
    const res = await apiFetch<{ trackingNumber: string }>('/api/bookings', {
      method: 'POST',
      body: JSON.stringify({
        ...booking,
        captchaToken,
      }),
      headers: captchaToken ? { 'x-captcha-token': captchaToken } : {},
    });
    if (!res.success) {
      throw new Error(res.error || 'داخلہ درخواست سرور پر محفوظ نہ ہو سکی۔');
    }
    const tracking = res.trackingNumber || booking.trackingNumber || `JIA-ADM-${Date.now().toString().slice(-6)}`;
    const savedB = { ...booking, trackingNumber: tracking };
    const list = this.getClassBookings().filter(b => b.id !== booking.id);
    setLocal(D1_STORAGE_KEYS.BOOKINGS, [savedB, ...list]);
    notifyUpdate();
    return tracking;
  }

  async updateClassBooking(booking: ClassBooking): Promise<void> {
    const res = await apiFetch(`/api/bookings/${encodeURIComponent(booking.id)}`, {
      method: 'PUT',
      body: JSON.stringify(booking),
    });
    if (!res.success) {
      throw new Error(res.error || 'داخلہ درخواست اپ ڈیٹ کرنے کا عمل ناکام رہا۔');
    }
    const list = this.getClassBookings();
    const updated = list.map(item => item.id === booking.id ? booking : item);
    setLocal(D1_STORAGE_KEYS.BOOKINGS, updated);
    notifyUpdate();
  }

  async deleteClassBooking(id: string): Promise<void> {
    const res = await apiFetch(`/api/bookings/${encodeURIComponent(id)}`, {
      method: 'DELETE',
    });
    if (!res.success) {
      throw new Error(res.error || 'داخلہ درخواست حذف کرنے کا عمل ناکام رہا۔');
    }
    const list = this.getClassBookings().filter(item => item.id !== id);
    setLocal(D1_STORAGE_KEYS.BOOKINGS, list);
    notifyUpdate();
  }

  // ==========================================
  // 4. EXAM RESULTS (Authoritative D1 Operations)
  // ==========================================
  getExamResults(): ExamResult[] {
    return getLocal<ExamResult[]>(D1_STORAGE_KEYS.RESULTS, []);
  }

  async saveExamResults(data: ExamResult[]): Promise<void> {
    setLocal(D1_STORAGE_KEYS.RESULTS, data);
    notifyUpdate();
  }

  async addExamResult(result: ExamResult): Promise<void> {
    const res = await apiFetch('/api/results', {
      method: 'POST',
      body: JSON.stringify(result),
    });
    if (!res.success) {
      throw new Error(res.error || 'امتحانی نتیجہ سرور پر محفوظ نہ ہو سکا۔');
    }
    const list = this.getExamResults().filter(r => r.id !== result.id && r.rollNumber !== result.rollNumber);
    setLocal(D1_STORAGE_KEYS.RESULTS, [result, ...list]);
    notifyUpdate();
  }

  async updateExamResult(result: ExamResult): Promise<void> {
    const res = await apiFetch(`/api/results/${encodeURIComponent(result.id)}`, {
      method: 'PUT',
      body: JSON.stringify(result),
    });
    if (!res.success) {
      throw new Error(res.error || 'امتحانی نتیجہ اپ ڈیٹ کرنے کا عمل ناکام رہا۔');
    }
    const list = this.getExamResults();
    const updated = list.map(item => item.id === result.id ? result : item);
    setLocal(D1_STORAGE_KEYS.RESULTS, updated);
    notifyUpdate();
  }

  async deleteExamResult(id: string): Promise<void> {
    const res = await apiFetch(`/api/results/${encodeURIComponent(id)}`, {
      method: 'DELETE',
    });
    if (!res.success) {
      throw new Error(res.error || 'امتحانی نتیجہ حذف کرنے کا عمل ناکام رہا۔');
    }
    const list = this.getExamResults().filter(item => item.id !== id);
    setLocal(D1_STORAGE_KEYS.RESULTS, list);
    notifyUpdate();
  }

  // ==========================================
  // 5. DEPARTMENTS (Authoritative D1 Operations)
  // ==========================================
  getDepartments(): Department[] {
    return getLocal<Department[]>(D1_STORAGE_KEYS.DEPARTMENTS, INITIAL_DEPARTMENTS);
  }

  async saveDepartments(data: Department[]): Promise<void> {
    const res = await apiFetch('/api/departments/batch', {
      method: 'POST',
      body: JSON.stringify({ departments: data }),
    });
    if (!res.success) {
      throw new Error(res.error || 'شعبہ جات سرور پر محفوظ نہ ہو سکے۔');
    }
    setLocal(D1_STORAGE_KEYS.DEPARTMENTS, data);
    notifyUpdate();
  }

  async addDepartment(dept: Department): Promise<void> {
    const res = await apiFetch('/api/departments', {
      method: 'POST',
      body: JSON.stringify(dept),
    });
    if (!res.success) {
      throw new Error(res.error || 'نیا شعبہ سرور پر محفوظ نہ ہو سکا۔');
    }
    const list = this.getDepartments().filter(d => d.id !== dept.id);
    setLocal(D1_STORAGE_KEYS.DEPARTMENTS, [...list, dept]);
    notifyUpdate();
  }

  async updateDepartment(dept: Department): Promise<void> {
    const res = await apiFetch('/api/departments', {
      method: 'POST',
      body: JSON.stringify(dept),
    });
    if (!res.success) {
      throw new Error(res.error || 'شعبہ اپ ڈیٹ کرنے کا عمل ناکام رہا۔');
    }
    const list = this.getDepartments();
    const updated = list.map(item => item.id === dept.id ? dept : item);
    setLocal(D1_STORAGE_KEYS.DEPARTMENTS, updated);
    notifyUpdate();
  }

  async deleteDepartment(id: string): Promise<void> {
    const res = await apiFetch(`/api/departments/${encodeURIComponent(id)}`, {
      method: 'DELETE',
    });
    if (!res.success) {
      throw new Error(res.error || 'شعبہ حذف کرنے کا عمل ناکام رہا۔');
    }
    const list = this.getDepartments().filter(item => item.id !== id);
    setLocal(D1_STORAGE_KEYS.DEPARTMENTS, list);
    notifyUpdate();
  }

  // ==========================================
  // 6. FACULTY (Authoritative D1 Operations)
  // ==========================================
  getFaculty(): FacultyMember[] {
    return getLocal<FacultyMember[]>(D1_STORAGE_KEYS.FACULTY, INITIAL_FACULTY);
  }

  async saveFaculty(data: FacultyMember[]): Promise<void> {
    const res = await apiFetch('/api/faculty/batch', {
      method: 'POST',
      body: JSON.stringify({ faculty: data }),
    });
    if (!res.success) {
      throw new Error(res.error || 'اساتذہ کی فہرست محفوظ نہ ہو سکی۔');
    }
    setLocal(D1_STORAGE_KEYS.FACULTY, data);
    notifyUpdate();
  }

  async addFaculty(faculty: FacultyMember): Promise<void> {
    const res = await apiFetch('/api/faculty', {
      method: 'POST',
      body: JSON.stringify(faculty),
    });
    if (!res.success) {
      throw new Error(res.error || 'استاذ کا ریکارڈ محفوظ نہ ہو سکا۔');
    }
    const list = this.getFaculty().filter(f => f.id !== faculty.id);
    setLocal(D1_STORAGE_KEYS.FACULTY, [...list, faculty]);
    notifyUpdate();
  }

  async updateFaculty(faculty: FacultyMember): Promise<void> {
    const res = await apiFetch('/api/faculty', {
      method: 'POST',
      body: JSON.stringify(faculty),
    });
    if (!res.success) {
      throw new Error(res.error || 'استاذ کا ریکارڈ اپ ڈیٹ نہ ہو سکا۔');
    }
    const list = this.getFaculty();
    const updated = list.map(item => item.id === faculty.id ? faculty : item);
    setLocal(D1_STORAGE_KEYS.FACULTY, updated);
    notifyUpdate();
  }

  async deleteFaculty(id: string): Promise<void> {
    const res = await apiFetch(`/api/faculty/${encodeURIComponent(id)}`, {
      method: 'DELETE',
    });
    if (!res.success) {
      throw new Error(res.error || 'استاذ کا ریکارڈ حذف نہ ہو سکا۔');
    }
    const list = this.getFaculty().filter(item => item.id !== id);
    setLocal(D1_STORAGE_KEYS.FACULTY, list);
    notifyUpdate();
  }

  // ==========================================
  // 7. BOOKS / PUBLICATIONS (Authoritative D1 Operations)
  // ==========================================
  getBooks(): PublicationBook[] {
    return getLocal<PublicationBook[]>(D1_STORAGE_KEYS.BOOKS, []);
  }

  async saveBooks(data: PublicationBook[]): Promise<void> {
    const res = await apiFetch('/api/books/batch', {
      method: 'POST',
      body: JSON.stringify({ books: data }),
    });
    if (!res.success) {
      throw new Error(res.error || 'کتب کا ریکارڈ سرور پر محفوظ نہ ہو سکا۔');
    }
    setLocal(D1_STORAGE_KEYS.BOOKS, data);
    notifyUpdate();
  }

  async addBook(book: PublicationBook): Promise<void> {
    const res = await apiFetch('/api/books', {
      method: 'POST',
      body: JSON.stringify(book),
    });
    if (!res.success) {
      throw new Error(res.error || 'کتاب سرور پر محفوظ نہ ہو سکی۔');
    }
    const list = this.getBooks().filter(b => b.id !== book.id);
    setLocal(D1_STORAGE_KEYS.BOOKS, [book, ...list]);
    notifyUpdate();
  }

  async updateBook(book: PublicationBook): Promise<void> {
    const res = await apiFetch('/api/books', {
      method: 'POST',
      body: JSON.stringify(book),
    });
    if (!res.success) {
      throw new Error(res.error || 'کتاب اپ ڈیٹ کرنے کا عمل ناکام رہا۔');
    }
    const list = this.getBooks();
    const updated = list.map(item => item.id === book.id ? book : item);
    setLocal(D1_STORAGE_KEYS.BOOKS, updated);
    notifyUpdate();
  }

  async deleteBook(id: string): Promise<void> {
    const res = await apiFetch(`/api/books/${encodeURIComponent(id)}`, {
      method: 'DELETE',
    });
    if (!res.success) {
      throw new Error(res.error || 'کتاب حذف کرنے کا عمل ناکام رہا۔');
    }
    const list = this.getBooks().filter(item => item.id !== id);
    setLocal(D1_STORAGE_KEYS.BOOKS, list);
    notifyUpdate();
  }

  // ==========================================
  // 8. MEDIA GALLERY (Authoritative D1 Operations)
  // ==========================================
  getMedia(): MediaItem[] {
    return getLocal<MediaItem[]>(D1_STORAGE_KEYS.MEDIA, []);
  }

  async saveMedia(data: MediaItem[]): Promise<void> {
    const res = await apiFetch('/api/media/batch', {
      method: 'POST',
      body: JSON.stringify({ media: data }),
    });
    if (!res.success) {
      throw new Error(res.error || 'میڈیا ریکارڈ سرور پر محفوظ نہ ہو سکا۔');
    }
    setLocal(D1_STORAGE_KEYS.MEDIA, data);
    notifyUpdate();
  }

  async addMedia(media: MediaItem): Promise<void> {
    const res = await apiFetch('/api/media', {
      method: 'POST',
      body: JSON.stringify(media),
    });
    if (!res.success) {
      throw new Error(res.error || 'میڈیا آئٹم سرور پر محفوظ نہ ہو سکا۔');
    }
    const list = this.getMedia().filter(m => m.id !== media.id);
    setLocal(D1_STORAGE_KEYS.MEDIA, [media, ...list]);
    notifyUpdate();
  }

  async updateMedia(media: MediaItem): Promise<void> {
    const res = await apiFetch('/api/media', {
      method: 'POST',
      body: JSON.stringify(media),
    });
    if (!res.success) {
      throw new Error(res.error || 'میڈیا آئٹم اپ ڈیٹ نہ ہو سکا۔');
    }
    const list = this.getMedia();
    const updated = list.map(item => item.id === media.id ? media : item);
    setLocal(D1_STORAGE_KEYS.MEDIA, updated);
    notifyUpdate();
  }

  async deleteMedia(id: string): Promise<void> {
    const res = await apiFetch(`/api/media/${encodeURIComponent(id)}`, {
      method: 'DELETE',
    });
    if (!res.success) {
      throw new Error(res.error || 'میڈیا آئٹم حذف نہ ہو سکا۔');
    }
    const list = this.getMedia().filter(item => item.id !== id);
    setLocal(D1_STORAGE_KEYS.MEDIA, list);
    notifyUpdate();
  }

  // ==========================================
  // 9. NEWS & ANNOUNCEMENTS (Authoritative D1 Operations)
  // ==========================================
  getNews(): NewsItem[] {
    return getLocal<NewsItem[]>(D1_STORAGE_KEYS.NEWS, []);
  }

  async saveNews(data: NewsItem[]): Promise<void> {
    const res = await apiFetch('/api/news/batch', {
      method: 'POST',
      body: JSON.stringify({ news: data }),
    });
    if (!res.success) {
      throw new Error(res.error || 'خبریں سرور پر محفوظ نہ ہو سکیں۔');
    }
    setLocal(D1_STORAGE_KEYS.NEWS, data);
    notifyUpdate();
  }

  async addNews(news: NewsItem): Promise<void> {
    const res = await apiFetch('/api/news', {
      method: 'POST',
      body: JSON.stringify(news),
    });
    if (!res.success) {
      throw new Error(res.error || 'خبر سرور پر محفوظ نہ ہو سکی۔');
    }
    const list = this.getNews().filter(n => n.id !== news.id);
    setLocal(D1_STORAGE_KEYS.NEWS, [news, ...list]);
    notifyUpdate();
  }

  async updateNews(news: NewsItem): Promise<void> {
    const res = await apiFetch('/api/news', {
      method: 'POST',
      body: JSON.stringify(news),
    });
    if (!res.success) {
      throw new Error(res.error || 'خبر اپ ڈیٹ کرنے کا عمل ناکام رہا۔');
    }
    const list = this.getNews();
    const updated = list.map(item => item.id === news.id ? news : item);
    setLocal(D1_STORAGE_KEYS.NEWS, updated);
    notifyUpdate();
  }

  async deleteNews(id: string): Promise<void> {
    const res = await apiFetch(`/api/news/${encodeURIComponent(id)}`, {
      method: 'DELETE',
    });
    if (!res.success) {
      throw new Error(res.error || 'خبر حذف کرنے کا عمل ناکام رہا۔');
    }
    const list = this.getNews().filter(item => item.id !== id);
    setLocal(D1_STORAGE_KEYS.NEWS, list);
    notifyUpdate();
  }

  // ==========================================
  // 10. DONATIONS (Authoritative D1 Operations)
  // ==========================================
  getDonations(): DonationRecord[] {
    return getLocal<DonationRecord[]>(D1_STORAGE_KEYS.DONATIONS, []);
  }

  async saveDonations(data: DonationRecord[]): Promise<void> {
    setLocal(D1_STORAGE_KEYS.DONATIONS, data);
    notifyUpdate();
  }

  async addDonation(don: DonationRecord, captchaToken?: string): Promise<void> {
    const res = await apiFetch('/api/donations', {
      method: 'POST',
      body: JSON.stringify({
        ...don,
        captchaToken,
      }),
      headers: captchaToken ? { 'x-captcha-token': captchaToken } : {},
    });
    if (!res.success) {
      throw new Error(res.error || 'عطیہ کا اندراج سرور پر محفوظ نہ ہو سکا۔');
    }
    const list = this.getDonations().filter(d => d.id !== don.id);
    setLocal(D1_STORAGE_KEYS.DONATIONS, [don, ...list]);
    notifyUpdate();
  }

  // ==========================================
  // 11. SITE SETTINGS (Authoritative D1 Operations)
  // ==========================================
  getSiteSettings(): SiteSettings {
    return getLocal<SiteSettings>(D1_STORAGE_KEYS.SETTINGS, INITIAL_SITE_SETTINGS);
  }

  async saveSiteSettings(data: SiteSettings): Promise<void> {
    const res = await apiFetch('/api/settings', {
      method: 'POST',
      body: JSON.stringify(data),
    });
    if (!res.success) {
      throw new Error(res.error || 'ویب سائٹ ترتیبات سرور پر محفوظ نہ ہو سکیں۔');
    }
    setLocal(D1_STORAGE_KEYS.SETTINGS, data);
    notifyUpdate();
  }

  // ==========================================
  // 12. SITE VISITORS ANALYTICS
  // ==========================================
  getVisitors(): SiteVisitorLog[] {
    return getLocal<SiteVisitorLog[]>(D1_STORAGE_KEYS.VISITORS, []);
  }

  async addVisitor(log: SiteVisitorLog): Promise<void> {
    const list = this.getVisitors().filter(v => v.id !== log.id);
    const updated = [log, ...list].slice(0, 2000);
    setLocal(D1_STORAGE_KEYS.VISITORS, updated);

    apiFetch('/api/visitors', {
      method: 'POST',
      body: JSON.stringify(log),
    }).catch(() => {});
  }

  async clearVisitors(): Promise<void> {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(D1_STORAGE_KEYS.VISITORS);
    }
    await apiFetch('/api/visitors/clear', {
      method: 'POST',
    });
    notifyUpdate();
  }

  async resetAll(): Promise<void> {
    if (typeof window !== 'undefined') {
      Object.values(D1_STORAGE_KEYS).forEach(key => {
        localStorage.removeItem(key);
        sessionStorage.removeItem(key);
      });
    }
    await apiFetch('/api/system/reset', {
      method: 'POST',
    });
    notifyUpdate();
  }
}

function updatedList<T extends { id: string }>(list: T[], removeId: string): T[] {
  return list.filter(item => item.id !== removeId);
}

