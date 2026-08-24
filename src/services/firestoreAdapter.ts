import { 
  collection, 
  doc, 
  setDoc, 
  deleteDoc, 
  onSnapshot, 
  getDocs, 
  writeBatch,
  Unsubscribe
} from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
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
import { IDatabaseService, DB_COLLECTIONS } from './dbInterface';
import { STORAGE_KEYS } from './localStorageAdapter';
import { db, auth, handleFirestoreError, OperationType } from './firebaseConfig';

/**
 * Remove undefined values from nested objects before sending to Firestore
 */
function sanitizeForFirestore<T>(data: T): T {
  if (data === null || data === undefined) {
    return data;
  }
  if (Array.isArray(data)) {
    return data.map(item => sanitizeForFirestore(item)) as unknown as T;
  }
  if (typeof data === 'object') {
    const cleanObj: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(data)) {
      if (value !== undefined) {
        cleanObj[key] = sanitizeForFirestore(value);
      }
    }
    return cleanObj as T;
  }
  return data;
}

function getLocalItem<T>(key: string, defaultValue: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (raw === null || raw === undefined) return defaultValue;
    const parsed = JSON.parse(raw) as T;
    return parsed;
  } catch (e) {
    console.error(`Error reading ${key} from local fallback:`, e);
    return defaultValue;
  }
}

function setLocalItem<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.error(`Error saving ${key} to local fallback:`, e);
  }
}

export class FirestoreAdapter implements IDatabaseService {
  // In-memory reactive state synchronized with Firestore
  private fatwas: Fatwa[] = getLocalItem(STORAGE_KEYS.FATWAS, INITIAL_FATWAS);
  private questions: OnlineQuestion[] = getLocalItem(STORAGE_KEYS.QUESTIONS, INITIAL_ONLINE_QUESTIONS);
  private bookings: ClassBooking[] = getLocalItem(STORAGE_KEYS.BOOKINGS, INITIAL_CLASS_BOOKINGS);
  private results: ExamResult[] = getLocalItem(STORAGE_KEYS.RESULTS, INITIAL_EXAM_RESULTS);
  private departments: Department[] = getLocalItem(STORAGE_KEYS.DEPARTMENTS, INITIAL_DEPARTMENTS);
  private faculty: FacultyMember[] = getLocalItem(STORAGE_KEYS.FACULTY, INITIAL_FACULTY);
  private books: PublicationBook[] = getLocalItem(STORAGE_KEYS.BOOKS, INITIAL_BOOKS);
  private media: MediaItem[] = getLocalItem(STORAGE_KEYS.MEDIA, INITIAL_MEDIA);
  private news: NewsItem[] = getLocalItem(STORAGE_KEYS.NEWS, INITIAL_NEWS);
  private donations: DonationRecord[] = getLocalItem(STORAGE_KEYS.DONATIONS, INITIAL_DONATIONS);
  private settings: SiteSettings = getLocalItem(STORAGE_KEYS.SETTINGS, INITIAL_SITE_SETTINGS);

  private isInitialized = false;
  private adminUnsubscribers: Unsubscribe[] = [];

  constructor() {
    this.initRealtimeListeners();
  }

  private notifyUpdate(collectionName: string) {
    // Notify storage listeners across tabs and components
    window.dispatchEvent(new Event('storage'));
    window.dispatchEvent(new CustomEvent('jamia_db_updated', { detail: { collection: collectionName } }));
  }

  private initRealtimeListeners() {
    if (this.isInitialized) return;
    this.isInitialized = true;

    // 1. Fatwas
    this.subscribeCollection<Fatwa>(
      DB_COLLECTIONS.FATWAS,
      STORAGE_KEYS.FATWAS,
      INITIAL_FATWAS,
      (items) => { this.fatwas = items; }
    );

    // 2. Questions / Istifta
    this.subscribeCollection<OnlineQuestion>(
      DB_COLLECTIONS.QUESTIONS,
      STORAGE_KEYS.QUESTIONS,
      INITIAL_ONLINE_QUESTIONS,
      (items) => { this.questions = items; }
    );

    // 3. Class Bookings & Admissions
    this.subscribeCollection<ClassBooking>(
      DB_COLLECTIONS.BOOKINGS,
      STORAGE_KEYS.BOOKINGS,
      INITIAL_CLASS_BOOKINGS,
      (items) => { this.bookings = items; }
    );

    // 4. Results
    this.subscribeCollection<ExamResult>(
      DB_COLLECTIONS.RESULTS,
      STORAGE_KEYS.RESULTS,
      INITIAL_EXAM_RESULTS,
      (items) => { this.results = items; }
    );

    // 5. Departments
    this.subscribeCollection<Department>(
      DB_COLLECTIONS.DEPARTMENTS,
      STORAGE_KEYS.DEPARTMENTS,
      INITIAL_DEPARTMENTS,
      (items) => { this.departments = items; }
    );

    // 6. Faculty
    this.subscribeCollection<FacultyMember>(
      DB_COLLECTIONS.FACULTY,
      STORAGE_KEYS.FACULTY,
      INITIAL_FACULTY,
      (items) => { this.faculty = items; }
    );

    // 7. Books
    this.subscribeCollection<PublicationBook>(
      DB_COLLECTIONS.BOOKS,
      STORAGE_KEYS.BOOKS,
      INITIAL_BOOKS,
      (items) => { this.books = items; }
    );

    // 8. Media
    this.subscribeCollection<MediaItem>(
      DB_COLLECTIONS.MEDIA,
      STORAGE_KEYS.MEDIA,
      INITIAL_MEDIA,
      (items) => { this.media = items; }
    );

    // 9. News
    this.subscribeCollection<NewsItem>(
      DB_COLLECTIONS.NEWS,
      STORAGE_KEYS.NEWS,
      INITIAL_NEWS,
      (items) => { this.news = items; }
    );

    // 10. Donations
    this.subscribeCollection<DonationRecord>(
      DB_COLLECTIONS.DONATIONS,
      STORAGE_KEYS.DONATIONS,
      INITIAL_DONATIONS,
      (items) => { this.donations = items; }
    );

    // 11. Site Settings (Single document 'general')
    try {
      const settingsDocRef = doc(db, DB_COLLECTIONS.SETTINGS, 'general');
      onSnapshot(settingsDocRef, (snapshot) => {
        if (snapshot.exists()) {
          const data = snapshot.data() as SiteSettings;
          this.settings = data;
          setLocalItem(STORAGE_KEYS.SETTINGS, data);
          this.notifyUpdate(DB_COLLECTIONS.SETTINGS);
        } else {
          // Seed initial site settings
          this.saveSiteSettings(this.settings);
        }
      }, (error) => {
        if (error.code !== 'permission-denied') {
          console.warn('Site settings snapshot offline notice:', error.message);
        }
      });
    } catch (e) {
      console.warn('Error setting up settings listener:', e);
    }
  }

  private subscribeCollection<T extends { id: string }>(
    colName: string,
    storageKey: string,
    initialData: T[],
    setter: (items: T[]) => void
  ): Unsubscribe | null {
    try {
      const colRef = collection(db, colName);
      const unsub = onSnapshot(colRef, (snapshot) => {
        if (snapshot.empty) {
          // If Firestore collection is empty, seed it with current in-memory / local data
          const currentData = getLocalItem<T[]>(storageKey, initialData);
          if (currentData && currentData.length > 0) {
            this.seedCollection(colName, currentData);
          }
          return;
        }

        const items: T[] = [];
        snapshot.forEach((docSnap) => {
          items.push(docSnap.data() as T);
        });

        setter(items);
        setLocalItem(storageKey, items);
        this.notifyUpdate(colName);
      }, (error) => {
        if (error.code === 'permission-denied') {
          console.warn(`Firestore permission notice for ${colName} (requires admin authentication).`);
        } else {
          console.warn(`Realtime snapshot listener note (${colName}):`, error.message);
        }
      });
      return unsub;
    } catch (e) {
      console.warn(`Error connecting realtime listener for ${colName}:`, e);
      return null;
    }
  }

  private async seedCollection<T extends { id: string }>(colName: string, items: T[]) {
    try {
      const batch = writeBatch(db);
      for (const item of items) {
        if (!item.id) continue;
        const docRef = doc(db, colName, item.id);
        batch.set(docRef, sanitizeForFirestore(item), { merge: true });
      }
      await batch.commit();
      console.log(`Seeded ${items.length} records into Firestore collection: ${colName}`);
    } catch (e) {
      console.warn(`Notice on seeding ${colName}:`, e);
    }
  }

  // --- Fatwas ---
  getFatwas(): Fatwa[] {
    return this.fatwas;
  }
  async saveFatwas(data: Fatwa[]): Promise<void> {
    this.fatwas = data;
    setLocalItem(STORAGE_KEYS.FATWAS, data);
    this.notifyUpdate(DB_COLLECTIONS.FATWAS);
    await this.seedCollection(DB_COLLECTIONS.FATWAS, data);
  }
  async addFatwa(fatwa: Fatwa): Promise<void> {
    this.fatwas = [fatwa, ...this.fatwas.filter(f => f.id !== fatwa.id)];
    setLocalItem(STORAGE_KEYS.FATWAS, this.fatwas);
    this.notifyUpdate(DB_COLLECTIONS.FATWAS);

    try {
      const docRef = doc(db, DB_COLLECTIONS.FATWAS, fatwa.id);
      await setDoc(docRef, sanitizeForFirestore(fatwa), { merge: true });
    } catch (error) {
      console.warn(`Notice saving fatwa ${fatwa.id} to cloud Firestore:`, error);
    }
  }
  async updateFatwa(fatwa: Fatwa): Promise<void> {
    this.fatwas = this.fatwas.map(f => f.id === fatwa.id ? fatwa : f);
    setLocalItem(STORAGE_KEYS.FATWAS, this.fatwas);
    this.notifyUpdate(DB_COLLECTIONS.FATWAS);

    try {
      const docRef = doc(db, DB_COLLECTIONS.FATWAS, fatwa.id);
      await setDoc(docRef, sanitizeForFirestore(fatwa), { merge: true });
    } catch (error) {
      console.warn(`Notice updating fatwa ${fatwa.id} in cloud Firestore:`, error);
    }
  }
  async deleteFatwa(id: string): Promise<void> {
    this.fatwas = this.fatwas.filter(f => f.id !== id);
    setLocalItem(STORAGE_KEYS.FATWAS, this.fatwas);
    this.notifyUpdate(DB_COLLECTIONS.FATWAS);

    try {
      const docRef = doc(db, DB_COLLECTIONS.FATWAS, id);
      await deleteDoc(docRef);
    } catch (error) {
      console.warn(`Notice deleting fatwa ${id} in cloud Firestore:`, error);
    }
  }

  // --- Questions ---
  getQuestions(): OnlineQuestion[] {
    return this.questions;
  }
  async saveQuestions(data: OnlineQuestion[]): Promise<void> {
    this.questions = data;
    setLocalItem(STORAGE_KEYS.QUESTIONS, data);
    this.notifyUpdate(DB_COLLECTIONS.QUESTIONS);
    await this.seedCollection(DB_COLLECTIONS.QUESTIONS, data);
  }
  async addQuestion(question: OnlineQuestion): Promise<void> {
    this.questions = [question, ...this.questions.filter(q => q.id !== question.id)];
    setLocalItem(STORAGE_KEYS.QUESTIONS, this.questions);
    this.notifyUpdate(DB_COLLECTIONS.QUESTIONS);

    try {
      const docRef = doc(db, DB_COLLECTIONS.QUESTIONS, question.id);
      await setDoc(docRef, sanitizeForFirestore(question), { merge: true });
    } catch (error) {
      console.warn(`Notice saving question ${question.id} to cloud Firestore:`, error);
    }
  }
  async updateQuestion(question: OnlineQuestion): Promise<void> {
    this.questions = this.questions.map(q => q.id === question.id ? question : q);
    setLocalItem(STORAGE_KEYS.QUESTIONS, this.questions);
    this.notifyUpdate(DB_COLLECTIONS.QUESTIONS);

    try {
      const docRef = doc(db, DB_COLLECTIONS.QUESTIONS, question.id);
      await setDoc(docRef, sanitizeForFirestore(question), { merge: true });
    } catch (error) {
      console.warn(`Notice updating question ${question.id} in cloud Firestore:`, error);
    }
  }

  // --- Bookings ---
  getClassBookings(): ClassBooking[] {
    return this.bookings;
  }
  async saveClassBookings(data: ClassBooking[]): Promise<void> {
    this.bookings = data;
    setLocalItem(STORAGE_KEYS.BOOKINGS, data);
    this.notifyUpdate(DB_COLLECTIONS.BOOKINGS);
    await this.seedCollection(DB_COLLECTIONS.BOOKINGS, data);
  }
  async addClassBooking(booking: ClassBooking): Promise<void> {
    this.bookings = [booking, ...this.bookings.filter(b => b.id !== booking.id)];
    setLocalItem(STORAGE_KEYS.BOOKINGS, this.bookings);
    this.notifyUpdate(DB_COLLECTIONS.BOOKINGS);

    try {
      const docRef = doc(db, DB_COLLECTIONS.BOOKINGS, booking.id);
      await setDoc(docRef, sanitizeForFirestore(booking), { merge: true });
    } catch (error) {
      console.warn(`Notice saving booking ${booking.id} to cloud Firestore:`, error);
    }
  }
  async updateClassBooking(booking: ClassBooking): Promise<void> {
    this.bookings = this.bookings.map(b => b.id === booking.id ? booking : b);
    setLocalItem(STORAGE_KEYS.BOOKINGS, this.bookings);
    this.notifyUpdate(DB_COLLECTIONS.BOOKINGS);

    try {
      const docRef = doc(db, DB_COLLECTIONS.BOOKINGS, booking.id);
      await setDoc(docRef, sanitizeForFirestore(booking), { merge: true });
    } catch (error) {
      console.warn(`Notice updating booking ${booking.id} in cloud Firestore:`, error);
    }
  }
  async deleteClassBooking(id: string): Promise<void> {
    this.bookings = this.bookings.filter(b => b.id !== id);
    setLocalItem(STORAGE_KEYS.BOOKINGS, this.bookings);
    this.notifyUpdate(DB_COLLECTIONS.BOOKINGS);

    try {
      const docRef = doc(db, DB_COLLECTIONS.BOOKINGS, id);
      await deleteDoc(docRef);
    } catch (error) {
      console.warn(`Notice deleting booking ${id} in cloud Firestore:`, error);
    }
  }

  // --- Exam Results ---
  getExamResults(): ExamResult[] {
    return this.results;
  }
  async saveExamResults(data: ExamResult[]): Promise<void> {
    this.results = data;
    setLocalItem(STORAGE_KEYS.RESULTS, data);
    this.notifyUpdate(DB_COLLECTIONS.RESULTS);
    await this.seedCollection(DB_COLLECTIONS.RESULTS, data);
  }
  async addExamResult(result: ExamResult): Promise<void> {
    this.results = [result, ...this.results.filter(r => r.id !== result.id)];
    setLocalItem(STORAGE_KEYS.RESULTS, this.results);
    this.notifyUpdate(DB_COLLECTIONS.RESULTS);

    try {
      const docRef = doc(db, DB_COLLECTIONS.RESULTS, result.id);
      await setDoc(docRef, sanitizeForFirestore(result), { merge: true });
    } catch (error) {
      console.warn(`Notice saving exam result ${result.id} to cloud Firestore:`, error);
    }
  }
  async updateExamResult(result: ExamResult): Promise<void> {
    this.results = this.results.map(r => r.id === result.id ? result : r);
    setLocalItem(STORAGE_KEYS.RESULTS, this.results);
    this.notifyUpdate(DB_COLLECTIONS.RESULTS);

    try {
      const docRef = doc(db, DB_COLLECTIONS.RESULTS, result.id);
      await setDoc(docRef, sanitizeForFirestore(result), { merge: true });
    } catch (error) {
      console.warn(`Notice updating exam result ${result.id} in cloud Firestore:`, error);
    }
  }
  async deleteExamResult(id: string): Promise<void> {
    this.results = this.results.filter(r => r.id !== id);
    setLocalItem(STORAGE_KEYS.RESULTS, this.results);
    this.notifyUpdate(DB_COLLECTIONS.RESULTS);

    try {
      const docRef = doc(db, DB_COLLECTIONS.RESULTS, id);
      await deleteDoc(docRef);
    } catch (error) {
      console.warn(`Notice deleting exam result ${id} in cloud Firestore:`, error);
    }
  }

  // --- Departments ---
  getDepartments(): Department[] {
    return this.departments;
  }
  async saveDepartments(data: Department[]): Promise<void> {
    this.departments = data;
    setLocalItem(STORAGE_KEYS.DEPARTMENTS, data);
    this.notifyUpdate(DB_COLLECTIONS.DEPARTMENTS);
    await this.seedCollection(DB_COLLECTIONS.DEPARTMENTS, data);
  }

  // --- Faculty ---
  getFaculty(): FacultyMember[] {
    return this.faculty;
  }
  async saveFaculty(data: FacultyMember[]): Promise<void> {
    this.faculty = data;
    setLocalItem(STORAGE_KEYS.FACULTY, data);
    this.notifyUpdate(DB_COLLECTIONS.FACULTY);
    await this.seedCollection(DB_COLLECTIONS.FACULTY, data);
  }

  // --- Books ---
  getBooks(): PublicationBook[] {
    return this.books;
  }
  async saveBooks(data: PublicationBook[]): Promise<void> {
    this.books = data;
    setLocalItem(STORAGE_KEYS.BOOKS, data);
    this.notifyUpdate(DB_COLLECTIONS.BOOKS);
    await this.seedCollection(DB_COLLECTIONS.BOOKS, data);
  }
  async addBook(book: PublicationBook): Promise<void> {
    this.books = [book, ...this.books.filter(b => b.id !== book.id)];
    setLocalItem(STORAGE_KEYS.BOOKS, this.books);
    this.notifyUpdate(DB_COLLECTIONS.BOOKS);

    try {
      const docRef = doc(db, DB_COLLECTIONS.BOOKS, book.id);
      await setDoc(docRef, sanitizeForFirestore(book), { merge: true });
    } catch (error) {
      console.warn(`Notice saving book ${book.id} to cloud Firestore:`, error);
    }
  }

  // --- Media ---
  getMedia(): MediaItem[] {
    return this.media;
  }
  async saveMedia(data: MediaItem[]): Promise<void> {
    this.media = data;
    setLocalItem(STORAGE_KEYS.MEDIA, data);
    this.notifyUpdate(DB_COLLECTIONS.MEDIA);
    await this.seedCollection(DB_COLLECTIONS.MEDIA, data);
  }
  async addMedia(mediaItem: MediaItem): Promise<void> {
    this.media = [mediaItem, ...this.media.filter(m => m.id !== mediaItem.id)];
    setLocalItem(STORAGE_KEYS.MEDIA, this.media);
    this.notifyUpdate(DB_COLLECTIONS.MEDIA);

    try {
      const docRef = doc(db, DB_COLLECTIONS.MEDIA, mediaItem.id);
      await setDoc(docRef, sanitizeForFirestore(mediaItem), { merge: true });
    } catch (error) {
      console.warn(`Notice saving media item ${mediaItem.id} to cloud Firestore:`, error);
    }
  }

  // --- News ---
  getNews(): NewsItem[] {
    return this.news;
  }
  async saveNews(data: NewsItem[]): Promise<void> {
    this.news = data;
    setLocalItem(STORAGE_KEYS.NEWS, data);
    this.notifyUpdate(DB_COLLECTIONS.NEWS);
    await this.seedCollection(DB_COLLECTIONS.NEWS, data);
  }
  async addNews(newsItem: NewsItem): Promise<void> {
    this.news = [newsItem, ...this.news.filter(n => n.id !== newsItem.id)];
    setLocalItem(STORAGE_KEYS.NEWS, this.news);
    this.notifyUpdate(DB_COLLECTIONS.NEWS);

    try {
      const docRef = doc(db, DB_COLLECTIONS.NEWS, newsItem.id);
      await setDoc(docRef, sanitizeForFirestore(newsItem), { merge: true });
    } catch (error) {
      console.warn(`Notice saving news ${newsItem.id} to cloud Firestore:`, error);
    }
  }

  // --- Donations ---
  getDonations(): DonationRecord[] {
    return this.donations;
  }
  async saveDonations(data: DonationRecord[]): Promise<void> {
    this.donations = data;
    setLocalItem(STORAGE_KEYS.DONATIONS, data);
    this.notifyUpdate(DB_COLLECTIONS.DONATIONS);
    await this.seedCollection(DB_COLLECTIONS.DONATIONS, data);
  }
  async addDonation(don: DonationRecord): Promise<void> {
    this.donations = [don, ...this.donations.filter(d => d.id !== don.id)];
    setLocalItem(STORAGE_KEYS.DONATIONS, this.donations);
    this.notifyUpdate(DB_COLLECTIONS.DONATIONS);

    try {
      const docRef = doc(db, DB_COLLECTIONS.DONATIONS, don.id);
      await setDoc(docRef, sanitizeForFirestore(don), { merge: true });
    } catch (error) {
      console.warn(`Notice saving donation ${don.id} to cloud Firestore:`, error);
    }
  }

  // --- Site Settings ---
  getSiteSettings(): SiteSettings {
    return this.settings;
  }
  async saveSiteSettings(data: SiteSettings): Promise<void> {
    this.settings = data;
    setLocalItem(STORAGE_KEYS.SETTINGS, data);
    this.notifyUpdate(DB_COLLECTIONS.SETTINGS);

    try {
      const docRef = doc(db, DB_COLLECTIONS.SETTINGS, 'general');
      await setDoc(docRef, sanitizeForFirestore(data), { merge: true });
    } catch (error) {
      console.warn(`Notice saving site settings to cloud Firestore:`, error);
    }
  }

  // --- Reset to Defaults ---
  async resetAll(): Promise<void> {
    this.fatwas = INITIAL_FATWAS;
    this.questions = INITIAL_ONLINE_QUESTIONS;
    this.bookings = INITIAL_CLASS_BOOKINGS;
    this.results = INITIAL_EXAM_RESULTS;
    this.departments = INITIAL_DEPARTMENTS;
    this.faculty = INITIAL_FACULTY;
    this.books = INITIAL_BOOKS;
    this.media = INITIAL_MEDIA;
    this.news = INITIAL_NEWS;
    this.donations = INITIAL_DONATIONS;
    this.settings = INITIAL_SITE_SETTINGS;

    localStorage.removeItem(STORAGE_KEYS.FATWAS);
    localStorage.removeItem(STORAGE_KEYS.QUESTIONS);
    localStorage.removeItem(STORAGE_KEYS.BOOKINGS);
    localStorage.removeItem(STORAGE_KEYS.RESULTS);
    localStorage.removeItem(STORAGE_KEYS.DEPARTMENTS);
    localStorage.removeItem(STORAGE_KEYS.FACULTY);
    localStorage.removeItem(STORAGE_KEYS.BOOKS);
    localStorage.removeItem(STORAGE_KEYS.MEDIA);
    localStorage.removeItem(STORAGE_KEYS.NEWS);
    localStorage.removeItem(STORAGE_KEYS.DONATIONS);
    localStorage.removeItem(STORAGE_KEYS.SETTINGS);

    // Re-seed to Firestore
    await this.seedCollection(DB_COLLECTIONS.FATWAS, INITIAL_FATWAS);
    await this.seedCollection(DB_COLLECTIONS.QUESTIONS, INITIAL_ONLINE_QUESTIONS);
    await this.seedCollection(DB_COLLECTIONS.BOOKINGS, INITIAL_CLASS_BOOKINGS);
    await this.seedCollection(DB_COLLECTIONS.RESULTS, INITIAL_EXAM_RESULTS);
    await this.seedCollection(DB_COLLECTIONS.DEPARTMENTS, INITIAL_DEPARTMENTS);
    await this.seedCollection(DB_COLLECTIONS.FACULTY, INITIAL_FACULTY);
    await this.seedCollection(DB_COLLECTIONS.BOOKS, INITIAL_BOOKS);
    await this.seedCollection(DB_COLLECTIONS.MEDIA, INITIAL_MEDIA);
    await this.seedCollection(DB_COLLECTIONS.NEWS, INITIAL_NEWS);
    await this.seedCollection(DB_COLLECTIONS.DONATIONS, INITIAL_DONATIONS);
    await this.saveSiteSettings(INITIAL_SITE_SETTINGS);

    this.notifyUpdate('all');
  }
}
