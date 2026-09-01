import React, { useState, useEffect } from 'react';
import { 
  Fatwa, 
  OnlineQuestion, 
  ExamResult, 
  PublicationBook, 
  MediaItem, 
  NewsItem, 
  DonationRecord, 
  SiteSettings, 
  FacultyMember, 
  Department, 
  FatwaCategory, 
  ClassBooking, 
  BookingStatus, 
  SiteVisitorLog 
} from '../../types';
import { StorageService } from '../../services/storage';
import { getAdminToken, setAdminToken, removeAdminToken, apiFetch } from '../../services/cloudApiAdapter';
import { getOrTranslateFatwaEnglish, translateFatwaServerSide } from '../../services/fatwaTranslationService';
import { useThemeLanguage } from '../../context/ThemeLanguageContext';
import { Pagination } from './Pagination';
import { FacultyManagement } from './FacultyManagement';
import { DepartmentsManagement } from './DepartmentsManagement';
import { NewsManagement } from './NewsManagement';
import { BooksManagement } from './BooksManagement';
import { TranslationsManagement } from './TranslationsManagement';
import { 
  ShieldAlert, 
  Plus, 
  Trash2, 
  Edit3, 
  CheckCircle, 
  MessageSquare, 
  BookOpen, 
  GraduationCap, 
  Bell, 
  Users, 
  Heart, 
  Settings, 
  Save, 
  RotateCcw,
  Printer,
  Sparkles,
  Search,
  Lock,
  LogOut,
  Key,
  Eye,
  EyeOff,
  Phone,
  Mail,
  Globe,
  Calendar,
  Clock,
  Send,
  ExternalLink,
  Filter,
  MessageCircle,
  Zap,
  Loader2,
  Activity,
  Smartphone,
  Monitor,
  BarChart3,
  RefreshCw,
  MapPin,
  TrendingUp,
  Compass,
  Radio,
  Download,
  Upload,
  Database,
  ArrowRight,
  Building,
  UserCheck,
  X
} from 'lucide-react';

const AUTHORIZED_ADMIN_EMAIL = 'jamiaislamia2003@gmail.com';

interface AdminUser {
  email: string;
  role?: string;
}

export const AdminDashboard: React.FC = () => {
  const { t, language } = useThemeLanguage();

  // Authentication State with Cloudflare D1 & Secure Session API
  const [currentUser, setCurrentUser] = useState<AdminUser | null>(null);
  const [isAuthLoading, setIsAuthLoading] = useState<boolean>(true);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState('');
  const [loginSuccessMessage, setLoginSuccessMessage] = useState('');
  const [rememberMe, setRememberMe] = useState(true);

  // Password Change & Reset via Cloudflare Backend
  const [isForgotModalOpen, setIsForgotModalOpen] = useState<boolean>(false);
  const [forgotEmailInput, setForgotEmailInput] = useState<string>('');
  const [newPasswordInput, setNewPasswordInput] = useState<string>('');
  const [currentPasswordInput, setCurrentPasswordInput] = useState<string>('');
  const [forgotError, setForgotError] = useState<string>('');
  const [forgotSuccess, setForgotSuccess] = useState<string>('');
  const [isSendingReset, setIsSendingReset] = useState<boolean>(false);
  const [settingsResetSuccess, setSettingsResetSuccess] = useState<string>('');
  const [settingsResetError, setSettingsResetError] = useState<string>('');

  const [activeTab, setActiveTab] = useState<'overview' | 'bookings' | 'questions' | 'fatwas' | 'translations' | 'results' | 'news' | 'books' | 'faculty' | 'departments' | 'donations' | 'settings' | 'visitors'>('overview');

  // State
  const [fatwas, setFatwas] = useState<Fatwa[]>([]);
  const [questions, setQuestions] = useState<OnlineQuestion[]>([]);
  const [bookings, setBookings] = useState<ClassBooking[]>([]);
  const [results, setResults] = useState<ExamResult[]>([]);
  const [news, setNews] = useState<NewsItem[]>([]);
  const [books, setBooks] = useState<PublicationBook[]>([]);
  const [faculty, setFaculty] = useState<FacultyMember[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [donations, setDonations] = useState<DonationRecord[]>([]);
  const [settings, setSettings] = useState<SiteSettings>(StorageService.getSiteSettings());
  const [visitors, setVisitors] = useState<SiteVisitorLog[]>([]);

  // Pagination & Filter States
  const [fatwaSearch, setFatwaSearch] = useState('');
  const [fatwaCatFilter, setFatwaCatFilter] = useState('all');
  const [fatwaCurrentPage, setFatwaCurrentPage] = useState(1);
  const fatwaPageSize = 10;

  const [questionSearch, setQuestionSearch] = useState('');
  const [questionStatusFilter, setQuestionStatusFilter] = useState('all');
  const [questionCurrentPage, setQuestionCurrentPage] = useState(1);
  const questionPageSize = 8;

  const [bookingCurrentPage, setBookingCurrentPage] = useState(1);
  const bookingPageSize = 8;

  const [resultSearch, setResultSearch] = useState('');
  const [resultCurrentPage, setResultCurrentPage] = useState(1);
  const resultPageSize = 10;

  const [donationCurrentPage, setDonationCurrentPage] = useState(1);
  const donationPageSize = 10;

  const [visitorCurrentPage, setVisitorCurrentPage] = useState(1);
  const visitorPageSize = 15;

  // Visitors Analytics Filters
  const [visitorTimeFilter, setVisitorTimeFilter] = useState<'daily' | 'weekly' | 'monthly' | 'all'>('daily');
  const [visitorSearch, setVisitorSearch] = useState('');
  const [visitorCountryFilter, setVisitorCountryFilter] = useState('all');

  // Form Modals / Creators
  const [showAddFatwa, setShowAddFatwa] = useState(false);
  const [editingFatwa, setEditingFatwa] = useState<Fatwa | null>(null);
  const [showAddResult, setShowAddResult] = useState(false);
  const [selectedQuestion, setSelectedQuestion] = useState<OnlineQuestion | null>(null);
  
  // Booking Management State
  const [selectedBooking, setSelectedBooking] = useState<ClassBooking | null>(null);
  const [bookingReplyText, setBookingReplyText] = useState('');
  const [bookingAdminNotes, setBookingAdminNotes] = useState('');
  const [bookingNewStatus, setBookingNewStatus] = useState<BookingStatus>('Contacted');
  const [bookingSearch, setBookingSearch] = useState('');
  const [bookingStatusFilter, setBookingStatusFilter] = useState<string>('all');

  // New Fatwa Form
  const [newFatwaNum, setNewFatwaNum] = useState('');
  const [newFatwaDate, setNewFatwaDate] = useState(new Date().toISOString().split('T')[0]);
  const [newFatwaTitleUr, setNewFatwaTitleUr] = useState('');
  const [newFatwaTitleEn, setNewFatwaTitleEn] = useState('');
  const [newFatwaTitleAr, setNewFatwaTitleAr] = useState('');
  const [newFatwaQuestionUr, setNewFatwaQuestionUr] = useState('');
  const [newFatwaQuestionEn, setNewFatwaQuestionEn] = useState('');
  const [newFatwaQuestionAr, setNewFatwaQuestionAr] = useState('');
  const [newFatwaAnswerUr, setNewFatwaAnswerUr] = useState('');
  const [newFatwaAnswerEn, setNewFatwaAnswerEn] = useState('');
  const [newFatwaAnswerAr, setNewFatwaAnswerAr] = useState('');
  const [newFatwaArabic, setNewFatwaArabic] = useState('');
  const [newFatwaCat, setNewFatwaCat] = useState<FatwaCategory>('General Fiqh');
  const [newFatwaMufti, setNewFatwaMufti] = useState('جامعہ اسلامیہ ایبٹ آباد');
  const [newFatwaIsApproved, setNewFatwaIsApproved] = useState(false);
  const [translatingFatwaId, setTranslatingFatwaId] = useState<string | null>(null);
  const [isGeneratingTranslation, setIsGeneratingTranslation] = useState(false);

  // Answer Question Modal state
  const [replyText, setReplyText] = useState('');
  const [publishToArchive, setPublishToArchive] = useState(true);

  // New Exam Result state
  const [newRoll, setNewRoll] = useState('');
  const [newReg, setNewReg] = useState('');
  const [newStudentName, setNewStudentName] = useState('');
  const [newFatherName, setNewFatherName] = useState('');
  const [newDept, setNewDept] = useState('شعبہ درس نظامی');
  const [newObtainedMarks, setNewObtainedMarks] = useState<number>(450);

  // Check Cloudflare D1 session token on mount
  useEffect(() => {
    const token = getAdminToken();
    if (!token) {
      setIsAuthLoading(false);
      setIsAuthenticated(false);
      return;
    }

    apiFetch('/api/auth/me')
      .then((res) => {
        if (
          res && 
          res.authenticated && 
          res.user && 
          res.user.email?.toLowerCase() === 'jamiaislamia'
        ) {
          setCurrentUser(res.user);
          setIsAuthenticated(true);
        } else {
          removeAdminToken();
          setCurrentUser(null);
          setIsAuthenticated(false);
        }
      })
      .catch(() => {
        removeAdminToken();
        setCurrentUser(null);
        setIsAuthenticated(false);
      })
      .finally(() => {
        setIsAuthLoading(false);
      });
  }, []);

  const refreshData = () => {
    setFatwas(StorageService.getFatwas());
    setQuestions(StorageService.getQuestions());
    setBookings(StorageService.getClassBookings());
    setResults(StorageService.getExamResults());
    setNews(StorageService.getNews());
    setBooks(StorageService.getBooks());
    setFaculty(StorageService.getFaculty());
    setDepartments(StorageService.getDepartments());
    setDonations(StorageService.getDonations());
    setSettings(StorageService.getSiteSettings());
    setVisitors(StorageService.getVisitors());
  };

  useEffect(() => {
    refreshData();
    window.addEventListener('storage', refreshData);
    window.addEventListener('jamia_db_updated', refreshData);
    return () => {
      window.removeEventListener('storage', refreshData);
      window.removeEventListener('jamia_db_updated', refreshData);
    };
  }, []);

  // Booking Handlers
  const handleOpenBookingReply = (booking: ClassBooking) => {
    setSelectedBooking(booking);
    setBookingNewStatus(booking.status === 'Pending' ? 'Contacted' : booking.status);
    setBookingAdminNotes(booking.adminNotes || '');
    setBookingReplyText(
      booking.replyMessage || 
      `السلام علیکم ${booking.studentName} صاحب! جامعہ اسلامیہ ایبٹ آباد میں ${booking.course} کے لیے آپ کی درخواست وصول ہوئی۔ کلاس ٹائم اور زوم لنک کے حوالے سے ہم آپ سے رابطہ کر رہے ہیں۔`
    );
  };

  const handleSaveBookingReply = async (openWhatsApp: boolean = false) => {
    if (!selectedBooking) return;

    const updatedBooking: ClassBooking = {
      ...selectedBooking,
      status: bookingNewStatus,
      adminNotes: bookingAdminNotes.trim() || undefined,
      replyMessage: bookingReplyText.trim() || undefined,
      replyDate: new Date().toISOString().split('T')[0],
    };

    try {
      await StorageService.updateClassBooking(updatedBooking);
    } catch (err: any) {
      alert('داخلہ درخواست کی کیفیت محفوظ کرنے میں سرور پر خرابی پیش آئی: ' + (err?.message || 'نامعلوم خرابی') + '\nڈیٹا کلاؤڈ ڈیٹا بیس میں محفوظ نہیں ہو سکا۔');
      return;
    }

    refreshData();

    if (openWhatsApp) {
      const rawPhone = (selectedBooking.whatsapp || selectedBooking.phone).replace(/[^0-9]/g, '');
      const cleanPhone = rawPhone.startsWith('0') ? '92' + rawPhone.slice(1) : rawPhone;
      const encodedMsg = encodeURIComponent(bookingReplyText);
      window.open(`https://wa.me/${cleanPhone}?text=${encodedMsg}`, '_blank');
    }

    setSelectedBooking(null);
    setBookingReplyText('');
    setBookingAdminNotes('');
  };

  const handleQuickStatusChange = async (bookingId: string, status: BookingStatus) => {
    const booking = bookings.find(b => b.id === bookingId);
    if (!booking) return;
    try {
      await StorageService.updateClassBooking({
        ...booking,
        status
      });
    } catch (err: any) {
      alert('کیفیت تبدیل کرنے میں سرور پر خرابی پیش آئی: ' + (err?.message || 'نامعلوم خرابی'));
      return;
    }
    refreshData();
  };

  const handleDeleteBooking = async (bookingId: string) => {
    if (window.confirm('کیا آپ واقعی اس داخلہ/کلاس بکنگ کو حذف کرنا چاہتے ہیں؟')) {
      try {
        await StorageService.deleteClassBooking(bookingId);
      } catch (err: any) {
        alert('داخلہ درخواست حذف کرنے میں سرور پر خرابی پیش آئی: ' + (err?.message || 'نامعلوم خرابی'));
        return;
      }
      refreshData();
    }
  };

  // Fatwa Management Handlers
  const handleOpenAddFatwa = () => {
    setEditingFatwa(null);
    setNewFatwaNum(`JIA-IFTA-2026-${Math.floor(1000 + Math.random() * 9000)}`);
    setNewFatwaDate(new Date().toISOString().split('T')[0]);
    setNewFatwaTitleUr('');
    setNewFatwaTitleEn('');
    setNewFatwaTitleAr('');
    setNewFatwaQuestionUr('');
    setNewFatwaQuestionEn('');
    setNewFatwaQuestionAr('');
    setNewFatwaAnswerUr('');
    setNewFatwaAnswerEn('');
    setNewFatwaAnswerAr('');
    setNewFatwaArabic('');
    setNewFatwaCat('General Fiqh');
    setNewFatwaMufti('جامعہ اسلامیہ ایبٹ آباد');
    setNewFatwaIsApproved(false);
    setShowAddFatwa(true);
  };

  const handleOpenEditFatwa = (f: Fatwa) => {
    setEditingFatwa(f);
    setNewFatwaNum(f.fatwaNumber || '');
    setNewFatwaDate(f.date || new Date().toISOString().split('T')[0]);
    setNewFatwaTitleUr(f.title?.ur || f.title?.en || '');
    setNewFatwaTitleEn(f.title?.en || '');
    setNewFatwaTitleAr(f.title?.ar || '');
    setNewFatwaQuestionUr(f.question?.ur || f.question?.en || '');
    setNewFatwaQuestionEn(f.question?.en || '');
    setNewFatwaQuestionAr(f.question?.ar || '');
    setNewFatwaAnswerUr(f.answer?.ur || f.answer?.en || '');
    setNewFatwaAnswerEn(f.answer?.en || '');
    setNewFatwaAnswerAr(f.answer?.ar || '');
    setNewFatwaArabic(f.arabicText || '');
    setNewFatwaCat(f.category || 'General Fiqh');
    setNewFatwaMufti(f.muftiName || 'جامعہ اسلامیہ ایبٹ آباد');
    setNewFatwaIsApproved(Boolean(f.isTranslationApproved));
    setShowAddFatwa(true);
  };

  const handleApproveTranslation = async (f: Fatwa) => {
    const updated: Fatwa = {
      ...f,
      isTranslationApproved: true,
      translationApprovedBy: currentUser?.email || AUTHORIZED_ADMIN_EMAIL,
    };
    try {
      await StorageService.updateFatwa(updated);
    } catch (err: any) {
      alert('ترجمہ تصدیق کرنے میں سرور پر خرابی پیش آئی: ' + (err?.message || 'نامعلوم خرابی'));
      return;
    }
    refreshData();
  };

  const handleGenerateTranslationForFatwa = async (f: Fatwa) => {
    setTranslatingFatwaId(f.id);
    try {
      await getOrTranslateFatwaEnglish(f, true);
      refreshData();
    } catch (e) {
      console.error(e);
      alert('ترجمہ حاصل کرنے میں مسئلہ پیش آیا۔');
    } finally {
      setTranslatingFatwaId(null);
    }
  };

  const handleAutoTranslateInModal = async () => {
    if (!newFatwaTitleUr || !newFatwaAnswerUr) {
      alert('براہ کرم پہلے اردو عنوان اور جواب درج فرمائیں۔');
      return;
    }
    setIsGeneratingTranslation(true);
    try {
      const res = await translateFatwaServerSide(newFatwaTitleUr, newFatwaQuestionUr, newFatwaAnswerUr);
      setNewFatwaTitleEn(res.titleEn);
      setNewFatwaQuestionEn(res.questionEn);
      setNewFatwaAnswerEn(res.answerEn);
      if (res.titleAr) setNewFatwaTitleAr(res.titleAr);
      if (res.questionAr) setNewFatwaQuestionAr(res.questionAr);
      if (res.answerAr) setNewFatwaAnswerAr(res.answerAr);
      // STRICT RULE: Do not auto-approve AI translations. Keep as pending review draft unless explicitly checked.
      setNewFatwaIsApproved(false);
    } catch (e: any) {
      console.error(e);
      const msg = e?.message || 'AI ترجمہ سروس سے رابطہ نہیں ہو سکا۔';
      alert(msg.startsWith('AI ترجمہ') || msg.startsWith('Cloudflare') || msg.startsWith('Gemini') ? msg : `AI ترجمہ سروس: ${msg}`);
    } finally {
      setIsGeneratingTranslation(false);
    }
  };

  const handleCreateFatwa = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFatwaTitleUr || !newFatwaAnswerUr) return;

    const hasTranslation = Boolean(newFatwaTitleEn || newFatwaAnswerEn || newFatwaTitleAr || newFatwaAnswerAr);

    try {
      if (editingFatwa) {
        // Update existing fatwa
        const updatedF: Fatwa = {
          ...editingFatwa,
          fatwaNumber: newFatwaNum || editingFatwa.fatwaNumber,
          date: newFatwaDate || editingFatwa.date || new Date().toISOString().split('T')[0],
          title: { 
            ur: newFatwaTitleUr, 
            en: newFatwaTitleEn || editingFatwa.title?.en || newFatwaTitleUr, 
            ar: newFatwaTitleAr || editingFatwa.title?.ar || newFatwaTitleUr 
          },
          question: { 
            ur: newFatwaQuestionUr || 'سوال', 
            en: newFatwaQuestionEn || editingFatwa.question?.en || newFatwaQuestionUr, 
            ar: newFatwaQuestionAr || editingFatwa.question?.ar || newFatwaQuestionUr 
          },
          category: newFatwaCat,
          answer: { 
            ur: newFatwaAnswerUr, 
            en: newFatwaAnswerEn || editingFatwa.answer?.en || newFatwaAnswerUr, 
            ar: newFatwaAnswerAr || editingFatwa.answer?.ar || newFatwaAnswerUr 
          },
          arabicText: newFatwaArabic || undefined,
          muftiName: newFatwaMufti || editingFatwa.muftiName || 'جامعہ اسلامیہ ایبٹ آباد',
          isAiTranslatedEn: hasTranslation ? true : editingFatwa.isAiTranslatedEn,
          isTranslationApproved: Boolean(newFatwaIsApproved),
          translationApprovedBy: newFatwaIsApproved ? (currentUser?.email || AUTHORIZED_ADMIN_EMAIL) : undefined,
        };

        await StorageService.updateFatwa(updatedF);
      } else {
        // Add new fatwa
        const newF: Fatwa = {
          id: `fatwa-${Date.now()}`,
          fatwaNumber: newFatwaNum || `JIA-IFTA-2026-${Math.floor(1000 + Math.random() * 9000)}`,
          title: { 
            ur: newFatwaTitleUr, 
            en: newFatwaTitleEn || newFatwaTitleUr, 
            ar: newFatwaTitleAr || newFatwaTitleUr 
          },
          question: { 
            ur: newFatwaQuestionUr || 'سوال', 
            en: newFatwaQuestionEn || newFatwaQuestionUr, 
            ar: newFatwaQuestionAr || newFatwaQuestionUr 
          },
          category: newFatwaCat,
          answer: { 
            ur: newFatwaAnswerUr, 
            en: newFatwaAnswerEn || newFatwaAnswerUr, 
            ar: newFatwaAnswerAr || newFatwaAnswerUr 
          },
          arabicText: newFatwaArabic || undefined,
          date: newFatwaDate || new Date().toISOString().split('T')[0],
          muftiName: newFatwaMufti || 'جامعہ اسلامیہ ایبٹ آباد',
          status: 'Published',
          views: 1,
          isAiTranslatedEn: hasTranslation,
          isTranslationApproved: Boolean(newFatwaIsApproved),
          translationApprovedBy: newFatwaIsApproved ? (currentUser?.email || AUTHORIZED_ADMIN_EMAIL) : undefined,
        };

        await StorageService.addFatwa(newF);
      }
    } catch (err: any) {
      alert('فتویٰ سرور پر محفوظ کرنے میں خرابی پیش آئی: ' + (err?.message || 'نامعلوم خرابی') + '\nڈیٹا کلاؤڈ ڈیٹا بیس میں محفوظ نہیں ہو سکا، براہ کرم دوبارہ کوشش کریں۔');
      return;
    }

    setEditingFatwa(null);
    setShowAddFatwa(false);
    refreshData();
  };

  // Answer Online Question
  const handleAnswerQuestion = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedQuestion || !replyText) return;

    const updatedQ: OnlineQuestion = {
      ...selectedQuestion,
      isAnswered: true,
      reply: replyText,
      isPublishedToArchive: publishToArchive
    };

    try {
      await StorageService.updateQuestion(updatedQ);

      if (publishToArchive) {
        const pubFatwa: Fatwa = {
          id: `fatwa-q-${selectedQuestion.id}`,
          fatwaNumber: `JIA-IFTA-2026-${Math.floor(1000 + Math.random() * 9000)}`,
          title: { ur: selectedQuestion.subject, en: selectedQuestion.subject, ar: selectedQuestion.subject },
          question: { ur: selectedQuestion.question, en: selectedQuestion.question, ar: selectedQuestion.question },
          questionerName: selectedQuestion.questionerName,
          category: selectedQuestion.category,
          answer: { ur: replyText, en: replyText, ar: replyText },
          date: new Date().toISOString().split('T')[0],
          muftiName: 'جامعہ اسلامیہ ایبٹ آباد',
          status: 'Published',
          views: 1
        };
        await StorageService.addFatwa(pubFatwa);
      }
    } catch (err: any) {
      alert('سوال کا جواب سرور پر محفوظ کرنے میں خرابی پیش آئی: ' + (err?.message || 'نامعلوم خرابی') + '\nڈیٹا کلاؤڈ ڈیٹا بیس میں محفوظ نہیں ہو سکا۔');
      return;
    }

    setSelectedQuestion(null);
    setReplyText('');
    refreshData();
  };

  // Create Exam Result
  const handleCreateResult = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRoll || !newStudentName) return;

    const total = 500;
    const obtained = Number(newObtainedMarks) || 400;
    const pct = Math.round((obtained / total) * 100);

    const newR: ExamResult = {
      id: `res-${Date.now()}`,
      rollNumber: newRoll,
      registrationNumber: newReg || `JIA-REG-2026-${Math.floor(100 + Math.random() * 900)}`,
      studentName: newStudentName,
      fatherName: newFatherName || 'عبد اللہ',
      department: newDept,
      academicYear: '2025-2026',
      examType: 'Annual',
      subjects: [
        { name: 'القرآن والتفسير', totalMarks: 100, obtainedMarks: Math.round(obtained * 0.2) },
        { name: 'الحديث الشريف', totalMarks: 100, obtainedMarks: Math.round(obtained * 0.2) },
        { name: 'الفقه والأصول', totalMarks: 100, obtainedMarks: Math.round(obtained * 0.2) },
        { name: 'اللغة العربية والإنشاء', totalMarks: 100, obtainedMarks: Math.round(obtained * 0.2) },
        { name: 'التجويد والتاريخ', totalMarks: 100, obtainedMarks: Math.round(obtained * 0.2) },
      ],
      totalMarks: total,
      obtainedMarks: obtained,
      percentage: pct,
      grade: pct >= 85 ? 'ممتاز' : pct >= 70 ? 'جید جداً' : 'جید',
      division: 'First Division',
      status: pct >= 50 ? 'Pass' : 'Fail',
      remarks: 'کامیاب طالب علم'
    };

    try {
      await StorageService.addExamResult(newR);
    } catch (err: any) {
      alert('امتحانی نتیجہ سرور پر محفوظ کرنے میں خرابی پیش آئی: ' + (err?.message || 'نامعلوم خرابی') + '\nڈیٹا کلاؤڈ ڈیٹا بیس میں محفوظ نہیں ہو سکا۔');
      return;
    }

    setShowAddResult(false);
    refreshData();
  };

  // Save Site Settings
  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await StorageService.saveSiteSettings(settings);
      alert('جامعہ اسلامیہ ایبٹ آباد کی ویب سائٹ سیٹنگز محفوظ ہو گئیں!');
    } catch (err: any) {
      alert('سیٹنگز محفوظ کرنے میں خرابی پیش آئی: ' + (err?.message || 'نامعلوم خرابی') + '\nڈیٹا کلاؤڈ ڈیٹا بیس میں محفوظ نہیں ہو سکا۔');
    }
  };

  // Full Database Backup Export (JSON)
  const handleExportFullBackup = () => {
    try {
      const backupData = {
        meta: {
          organization: 'جامعہ اسلامیہ ایبٹ آباد (Jamia Islamia Abbottabad)',
          portal: 'https://jamia-islamia-abbottabad.pages.dev',
          exportDate: new Date().toISOString(),
          version: '2026.1'
        },
        fatwas: StorageService.getFatwas(),
        questions: StorageService.getQuestions(),
        classBookings: StorageService.getClassBookings(),
        examResults: StorageService.getExamResults(),
        departments: StorageService.getDepartments(),
        faculty: StorageService.getFaculty(),
        books: StorageService.getBooks(),
        media: StorageService.getMedia(),
        news: StorageService.getNews(),
        donations: StorageService.getDonations(),
        settings: StorageService.getSiteSettings(),
        visitors: StorageService.getVisitors()
      };

      const jsonStr = JSON.stringify(backupData, null, 2);
      const blob = new Blob([jsonStr], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `Jamia_Islamia_Abbottabad_Full_Backup_${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (err: any) {
      alert('بیک اپ ایکسپورٹ کرنے میں خرابی: ' + (err?.message || 'نامعلوم'));
    }
  };

  // Full Database Backup Restore (JSON)
  const handleImportFullBackup = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (event) => {
      try {
        const content = event.target?.result as string;
        const data = JSON.parse(content);

        if (!data || typeof data !== 'object') {
          alert('منتخب کردہ بیک اپ فائل کا فارمیٹ درست نہیں ہے۔');
          return;
        }

        if (confirm('کیا آپ واقعی یہ بیک اپ بحال کرنا چاہتے ہیں؟ اس سے موجودہ ڈیٹا فائل کے ڈیٹا کے ساتھ اپڈیٹ ہو جائے گا۔')) {
          if (Array.isArray(data.fatwas)) await StorageService.saveFatwas(data.fatwas);
          if (Array.isArray(data.questions)) await StorageService.saveQuestions(data.questions);
          if (Array.isArray(data.classBookings)) await StorageService.saveClassBookings(data.classBookings);
          if (Array.isArray(data.examResults)) await StorageService.saveExamResults(data.examResults);
          if (Array.isArray(data.departments)) await StorageService.saveDepartments(data.departments);
          if (Array.isArray(data.faculty)) await StorageService.saveFaculty(data.faculty);
          if (Array.isArray(data.books)) await StorageService.saveBooks(data.books);
          if (Array.isArray(data.media)) await StorageService.saveMedia(data.media);
          if (Array.isArray(data.news)) await StorageService.saveNews(data.news);
          if (Array.isArray(data.donations)) await StorageService.saveDonations(data.donations);
          if (data.settings && typeof data.settings === 'object') await StorageService.saveSiteSettings(data.settings);

          refreshData();
          alert('بیک اپ کامیابی کے ساتھ بحال (Restore) ہو گیا!');
        }
      } catch (err: any) {
        alert('بیک اپ بحال کرنے میں خرابی: ' + (err?.message || 'نامعلوم'));
      }
    };
    reader.readAsText(file);
    // Reset file input
    e.target.value = '';
  };

  const handleResetData = async () => {
    if (confirm('کیا آپ تمام ڈیٹا کو ابتدائی حالت میں ری سیٹ کرنا چاہتے ہیں؟')) {
      try {
        await StorageService.resetAll();
        refreshData();
      } catch (err: any) {
        alert('ڈیٹا ری سیٹ کرنے میں خرابی پیش آئی: ' + (err?.message || 'نامعلوم خرابی'));
      }
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    setLoginSuccessMessage('');
    setIsAuthLoading(true);

    const inputUser = loginEmail.trim();
    const inputPass = loginPassword.trim();

    if (!inputUser || !inputPass) {
      setLoginError('براہ کرم یوزر نیم اور پاس ورڈ دونوں درج فرمائیں۔');
      setIsAuthLoading(false);
      return;
    }

    if (inputUser.toLowerCase() !== 'jamiaislamia') {
      setLoginError('غلط یوزر نیم یا پاس ورڈ! ایڈمن پورٹل میں داخلے کی اجازت نہیں ہے۔');
      setIsAuthLoading(false);
      return;
    }

    try {
      const res = await apiFetch('/api/login', {
        method: 'POST',
        body: JSON.stringify({
          username: inputUser,
          email: inputUser,
          password: inputPass,
          rememberMe,
        }),
      });

      if (res && res.success && res.token && res.user) {
        setAdminToken(res.token, inputUser, rememberMe);
        setCurrentUser(res.user);
        setIsAuthenticated(true);
        setLoginPassword('');
        setLoginSuccessMessage('کامیابی کے ساتھ لاگ ان ہو گیا۔');
      } else {
        throw new Error(res?.error || 'غلط یوزر نیم یا پاس ورڈ! ایڈمن پورٹل میں داخلے کی اجازت نہیں ہے۔');
      }
    } catch (err: any) {
      console.error('Login error:', err);
      setLoginError(err?.message || 'غلط یوزر نیم یا پاس ورڈ! ایڈمن پورٹل میں داخلے کی اجازت نہیں ہے۔');
      setIsAuthenticated(false);
      setCurrentUser(null);
    } finally {
      setIsAuthLoading(false);
    }
  };

  const handleForgotPassword = () => {
    setLoginError('');
    setLoginSuccessMessage('');
    setForgotError('');
    setForgotSuccess('');
    setForgotEmailInput(loginEmail.trim() || '');
    setIsForgotModalOpen(true);
  };

  const handleSendResetEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    setForgotError('');
    setForgotSuccess('');
    const inputIdentifier = forgotEmailInput.trim();

    if (!inputIdentifier) {
      setForgotError('براہ کرم اپنا یوزر نیم درج فرمائیں۔');
      return;
    }

    if (inputIdentifier.toLowerCase() !== 'jamiaislamia') {
      setForgotError('صرف مجاز ایڈمن اکاؤنٹ کے لیے پاس ورڈ بحالی کی درخواست ممکن ہے۔');
      return;
    }

    setIsSendingReset(true);
    try {
      setForgotSuccess(`سیکیورٹی نوٹس: ایڈمن پاس ورڈ تبدیل کرنے کے لیے کنٹرول پینل کی سیکیورٹی تصدیق درکار ہے۔`);
    } catch (err: any) {
      setForgotError('پاس ورڈ ری سیٹ میں خرابی: ' + (err?.message || 'نامعلوم'));
    } finally {
      setIsSendingReset(false);
    }
  };

  const handleLogout = async () => {
    try {
      await apiFetch('/api/logout', { method: 'POST' });
    } catch (e) {
      console.warn('SignOut error:', e);
    }
    removeAdminToken();
    setCurrentUser(null);
    setIsAuthenticated(false);
    setLoginPassword('');
  };

  // If not authenticated, show exclusive Admin Login Gate
  if (!isAuthenticated) {
    return (
      <div className="max-w-md mx-auto my-12 p-6 sm:p-8 bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border-2 border-[#B88A3B]/40 font-urdu text-right" dir="rtl">
        {/* Forgot Password Modal View */}
        {isForgotModalOpen ? (
          <div className="space-y-5">
            <div className="text-center space-y-2 mb-4">
              <div className="w-14 h-14 mx-auto rounded-2xl bg-amber-100 dark:bg-amber-950 text-[#5C4632] dark:text-amber-300 flex items-center justify-center border border-[#B88A3B]/50 shadow-inner">
                <Mail className="w-7 h-7 text-[#B88A3B]" />
              </div>
              <h2 className="text-xl font-black text-[#5C4632] dark:text-amber-300">
                پاس ورڈ ری سیٹ (Forgot Password)
              </h2>
              <p className="text-xs text-stone-600 dark:text-stone-400">
                پاس ورڈ کی بحالی کا عمل صرف مجاز ایڈمنسٹریٹر کے لیے ہے
              </p>
            </div>

            {forgotSuccess && (
              <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-300 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 text-xs font-bold text-center leading-relaxed">
                {forgotSuccess}
              </div>
            )}

            {forgotError && (
              <div className="p-3 rounded-xl bg-red-50 dark:bg-red-950/60 border border-red-300 dark:border-red-800 text-red-700 dark:text-red-300 text-xs font-bold text-center">
                {forgotError}
              </div>
            )}

            <form onSubmit={handleSendResetEmail} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-1.5">
                  یوزر نیم (Username)
                </label>
                <input
                  type="text"
                  required
                  value={forgotEmailInput}
                  onChange={(e) => setForgotEmailInput(e.target.value)}
                  placeholder="یوزر نیم درج کریں"
                  className="w-full px-4 py-2.5 rounded-xl border border-stone-300 dark:border-slate-700 bg-stone-50 dark:bg-slate-800 text-stone-900 dark:text-white text-sm font-sans focus:outline-hidden focus:border-[#B88A3B]"
                  dir="ltr"
                  autoComplete="username"
                />
                <p className="text-[10px] text-stone-500 dark:text-stone-400 mt-1">
                  نوٹ: پاس ورڈ ری سیٹ کرنے کے لیے درست ایڈمن یوزر نیم درج کریں۔
                </p>
              </div>

              <button
                type="submit"
                disabled={isSendingReset}
                className="w-full py-3 bg-[#5C4632] hover:bg-[#433123] text-amber-300 font-bold rounded-xl border border-[#B88A3B] shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer text-xs disabled:opacity-70"
              >
                {isSendingReset ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Send className="w-4 h-4" />
                )}
                <span>{isSendingReset ? 'تصدیق جاری ہے...' : 'پاس ورڈ ری سیٹ کی درخواست بھیجیں'}</span>
              </button>
            </form>

            <div className="pt-3 border-t border-stone-200 dark:border-slate-800 text-center">
              <button
                type="button"
                onClick={() => {
                  setIsForgotModalOpen(false);
                  setForgotError('');
                  setForgotSuccess('');
                }}
                className="text-xs text-stone-600 dark:text-stone-300 hover:text-stone-900 dark:hover:text-white font-bold flex items-center justify-center gap-1.5 mx-auto cursor-pointer"
              >
                <ArrowRight className="w-3.5 h-3.5" />
                <span>واپس ایڈمن لاگ ان پر جائیں</span>
              </button>
            </div>
          </div>
        ) : (
          <div>
            <div className="text-center space-y-3 mb-6">
              <div className="w-16 h-16 mx-auto rounded-2xl bg-[#5C4632] text-amber-300 flex items-center justify-center border-2 border-[#B88A3B] shadow-inner">
                <Lock className="w-8 h-8" />
              </div>
              <h2 className="text-2xl font-black text-[#5C4632] dark:text-amber-300">
                ایڈمن لاگ ان پورٹل
              </h2>
              <p className="text-xs text-stone-600 dark:text-stone-400">
                جامعہ اسلامیہ ایبٹ آباد - صرف مجاز ایڈمنسٹریٹر کے لیے
              </p>
            </div>

            {loginSuccessMessage && (
              <div className="mb-5 p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-300 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 text-xs font-bold text-center">
                {loginSuccessMessage}
              </div>
            )}

            {loginError && (
              <div className="mb-5 p-3 rounded-xl bg-red-50 dark:bg-red-950/60 border border-red-300 dark:border-red-800 text-red-700 dark:text-red-300 text-xs font-bold text-center">
                {loginError}
              </div>
            )}

            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-1.5">
                  یوزر نیم (Username)
                </label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    placeholder="یوزر نیم درج کریں"
                    className="w-full px-4 py-2.5 rounded-xl border border-stone-300 dark:border-slate-700 bg-stone-50 dark:bg-slate-800 text-stone-900 dark:text-white text-sm font-sans focus:outline-hidden focus:border-[#B88A3B]"
                    dir="ltr"
                    autoComplete="username"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-1.5">
                  پاس ورڈ (Password)
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    placeholder="پاس ورڈ درج کریں"
                    className="w-full px-4 py-2.5 rounded-xl border border-stone-300 dark:border-slate-700 bg-stone-50 dark:bg-slate-800 text-stone-900 dark:text-white text-sm font-sans focus:outline-hidden focus:border-[#B88A3B] pr-10"
                    dir="ltr"
                    autoComplete="current-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute left-3 top-2.5 text-stone-400 hover:text-stone-600 dark:hover:text-stone-200 cursor-pointer"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between pt-1">
                <label className="flex items-center gap-2 text-xs text-stone-600 dark:text-stone-400 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="rounded text-[#B88A3B] focus:ring-[#B88A3B]"
                  />
                  <span>مجھے لاگ ان رکھیں</span>
                </label>

                <button
                  type="button"
                  onClick={handleForgotPassword}
                  className="text-xs text-[#B88A3B] hover:underline font-bold cursor-pointer"
                >
                  پاس ورڈ بھول گئے؟
                </button>
              </div>

              <button
                type="submit"
                disabled={isAuthLoading}
                className="w-full py-3.5 bg-[#5C4632] hover:bg-[#433123] text-amber-300 font-bold rounded-xl border border-[#B88A3B] shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer mt-4 text-sm disabled:opacity-70"
              >
                {isAuthLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Key className="w-4 h-4" />
                )}
                <span>{isAuthLoading ? 'تصدیق جاری ہے...' : 'ایڈمن پورٹل لاگ ان کریں (Sign In)'}</span>
              </button>
            </form>

            <div className="mt-6 pt-4 border-t border-stone-200 dark:border-slate-800 text-center space-y-1">
              <p className="text-[11px] font-bold text-[#5C4632] dark:text-amber-300">
                سیکورٹی وارننگ: ایڈمن پورٹل انکرپشن اور سخت سیکیورٹی سے محفوظ ہے۔
              </p>
              <p className="text-[10px] text-stone-500 dark:text-stone-400">
                صرف تصدیق شدہ مجاز یوزر نیم اور پاس ورڈ سے ہی رسائی ممکن ہے۔
              </p>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-8 font-sans">
      
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-amber-600 via-emerald-950 to-slate-900 text-amber-100 rounded-3xl p-6 sm:p-8 shadow-xl border border-amber-400/50 flex flex-wrap justify-between items-center gap-4">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 text-xs font-bold border border-amber-400/40">
            <ShieldAlert className="w-4 h-4" />
            <span>ایڈمن سی ایم ایس کنٹرول پینل</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black font-urdu text-white">
            مدیر پورٹل - جامعہ اسلامیہ ایبٹ آباد
          </h1>
          <p className="text-xs text-amber-200/90 font-urdu">
            فتاویٰ، آن لائن سوالات، نتائجِ امتحانات، خبریں، اور سیٹنگز بغیر کوڈنگ کے تبدیل کریں۔
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button 
            onClick={handleResetData}
            className="px-3.5 py-2 bg-red-950/80 hover:bg-red-900 text-red-200 font-bold text-xs rounded-xl border border-red-800 flex items-center gap-1.5 transition-colors font-urdu cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" />
            <span>ڈیٹا ری سیٹ (Reset)</span>
          </button>
          <button 
            onClick={handleLogout}
            className="px-3.5 py-2 bg-amber-500/20 hover:bg-amber-500/30 text-amber-200 font-bold text-xs rounded-xl border border-amber-400/50 flex items-center gap-1.5 transition-colors font-urdu cursor-pointer"
            title="لاگ آؤٹ کریں"
          >
            <LogOut className="w-4 h-4" />
            <span>لاگ آؤٹ (Logout)</span>
          </button>
        </div>
      </div>

      {/* Admin Navigation Tabs */}
      <div className="bg-white dark:bg-slate-900 p-3 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-center gap-2 overflow-x-auto">
        {[
          { id: 'overview', label: 'مجموعی جائزہ', icon: ShieldAlert },
          { id: 'visitors', label: `ناظرین و زائرین (${visitors.length})`, icon: Activity, badgeColor: 'bg-emerald-600' },
          { id: 'bookings', label: `کلاس بکنگ و داخلہ جات (${bookings.filter(b => b.status === 'Pending').length})`, icon: GraduationCap, badgeColor: bookings.filter(b => b.status === 'Pending').length > 0 ? 'bg-amber-600' : undefined },
          { id: 'questions', label: `آن لائن سوالات (${questions.filter(q => !q.isAnswered).length})`, icon: MessageSquare },
          { id: 'fatwas', label: `فتاویٰ جات (${fatwas.length})`, icon: BookOpen },
          { id: 'translations', label: `زیرِ التواء تراجم (${fatwas.filter(f => !f.isTranslationApproved).length})`, icon: Globe, badgeColor: 'bg-amber-600' },
          { id: 'results', label: `امتحانی نتائج (${results.length})`, icon: GraduationCap },
          { id: 'news', label: 'خبریں و اعلانات', icon: Bell },
          { id: 'donations', label: 'عطیات کا ریکارڈ', icon: Heart },
          { id: 'settings', label: 'ویب سائٹ سیٹنگز', icon: Settings }
        ].map(t => {
          const Icon = t.icon;
          const isSelected = activeTab === t.id;
          return (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id as any)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all font-urdu ${
                isSelected 
                  ? 'bg-amber-500 text-slate-950 shadow-md' 
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{t.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab 1: Overview */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-7 gap-4">
            <div 
              onClick={() => setActiveTab('visitors')}
              className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-emerald-300 dark:border-emerald-900/60 shadow-sm space-y-2 cursor-pointer hover:border-emerald-500 transition-colors"
            >
              <div className="text-xs text-emerald-700 dark:text-emerald-400 font-urdu flex items-center justify-between font-bold">
                <span>آج کے حقیقی زائرین:</span>
                <span className="flex h-2 w-2 relative">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
              </div>
              <div className="text-2xl font-mono font-bold text-emerald-600 flex items-center justify-between">
                <span>{visitors.filter(v => v.date === new Date().toISOString().split('T')[0]).length}</span>
                <span className="text-[11px] font-sans font-normal px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300">کل {visitors.length}</span>
              </div>
            </div>

            <div 
              onClick={() => setActiveTab('translations')}
              className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-amber-300 dark:border-amber-900/60 shadow-sm space-y-2 cursor-pointer hover:border-amber-500 transition-colors"
            >
              <div className="text-xs text-amber-700 dark:text-amber-400 font-urdu flex items-center justify-between font-bold">
                <span>زیرِ التواء تراجم:</span>
                <Globe className="w-3.5 h-3.5 text-amber-500" />
              </div>
              <div className="text-2xl font-mono font-bold text-amber-600 flex items-center justify-between">
                <span>{fatwas.filter(f => !f.isTranslationApproved).length}</span>
                <span className="text-[11px] font-sans font-normal px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300">ڈرافٹ</span>
              </div>
            </div>

            <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-2">
              <div className="text-xs text-slate-500 font-urdu">نئی کلاس بکنگ / داخلے:</div>
              <div className="text-2xl font-mono font-bold text-amber-600 flex items-center justify-between">
                <span>{bookings.filter(b => b.status === 'Pending').length}</span>
                <span className="text-xs font-sans font-normal px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300">کل {bookings.length}</span>
              </div>
            </div>

            <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-2">
              <div className="text-xs text-slate-500 font-urdu">غیر جواب دہ سوالات:</div>
              <div className="text-2xl font-mono font-bold text-amber-600">{questions.filter(q => !q.isAnswered).length}</div>
            </div>

            <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-2">
              <div className="text-xs text-slate-500 font-urdu">کل شائع شدہ فتاویٰ:</div>
              <div className="text-2xl font-mono font-bold text-emerald-600">{fatwas.length}</div>
            </div>

            <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-2">
              <div className="text-xs text-slate-500 font-urdu">امتحانی ریکارڈز:</div>
              <div className="text-2xl font-mono font-bold text-blue-600">{results.length}</div>
            </div>

            <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-2">
              <div className="text-xs text-slate-500 font-urdu">کل موصول شدہ عطیات:</div>
              <div className="text-2xl font-mono font-bold text-emerald-700">{donations.length}</div>
            </div>
          </div>

          {/* Pending Class Bookings Alert Block */}
          <div className="bg-gradient-to-l from-amber-50 to-orange-50/60 dark:from-slate-900 dark:to-slate-900 p-6 rounded-2xl border border-amber-300/80 dark:border-slate-800 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-amber-950 dark:text-amber-300 font-urdu text-base flex items-center gap-2">
                <GraduationCap className="w-5 h-5 text-amber-600" />
                <span>نئی موصول شدہ کلاس بکنگز و داخلہ فارم (New Class Bookings & Admissions)</span>
              </h3>
              <button 
                onClick={() => setActiveTab('bookings')}
                className="text-xs font-bold text-amber-800 dark:text-amber-300 hover:underline font-urdu"
              >
                تمام بکنگز دیکھیں ({bookings.length}) ←
              </button>
            </div>

            {bookings.filter(b => b.status === 'Pending').length === 0 ? (
              <p className="text-xs text-slate-500 font-urdu">زیر التواء کوئی نئی کلاس بکنگ موجود نہیں ہے۔ تمام درخواستوں پر عمل ہو چکا ہے۔</p>
            ) : (
              <div className="space-y-3">
                {bookings.filter(b => b.status === 'Pending').slice(0, 4).map(b => {
                  const rawPhone = (b.whatsapp || b.phone).replace(/[^0-9]/g, '');
                  const cleanPhone = rawPhone.startsWith('0') ? '92' + rawPhone.slice(1) : rawPhone;
                  const defaultMsg = encodeURIComponent(`السلام علیکم ${b.studentName} صاحب! جامعہ اسلامیہ ایبٹ آباد میں آن لائن کورس (${b.course}) کے لیے آپ کی درخواست وصول ہوئی ہے۔ کیا ہم کلاس ٹائم اور زوم لنک فائنل کر سکتے ہیں؟`);
                  
                  return (
                    <div key={b.id} className="p-4 bg-white dark:bg-slate-800 rounded-xl border border-amber-200 dark:border-slate-700 flex flex-wrap items-center justify-between gap-4 text-xs font-urdu shadow-xs">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-sm text-slate-900 dark:text-white">{b.studentName}</span>
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${b.bookingType === 'Trial' ? 'bg-orange-100 text-orange-800 dark:bg-orange-950 dark:text-orange-300' : 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'}`}>
                            {b.bookingType === 'Trial' ? '۳ روزہ مفت ٹرائل' : 'باقاعدہ داخلہ فارم'}
                          </span>
                          <span className="text-stone-500 text-[11px]">• {b.country}</span>
                        </div>
                        <div className="text-slate-600 dark:text-slate-300">
                          <strong>کورس: </strong>{b.course} {b.preferredTime ? `• وقت: ${b.preferredTime}` : ''}
                        </div>
                        <div className="text-stone-500 text-[11px] flex items-center gap-3">
                          <span>فون/واٹس ایپ: <span dir="ltr" className="font-sans font-bold">{b.phone}</span></span>
                          {b.guardianName && <span>سرپرست: {b.guardianName}</span>}
                          <span>تاریخ: {b.date}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <a
                          href={`https://wa.me/${cleanPhone}?text=${defaultMsg}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-3 py-2 bg-[#25D366] hover:bg-[#20ba5a] text-white font-bold rounded-lg flex items-center gap-1.5 shadow-xs transition-colors"
                          title="طالب علم سے واٹس ایپ پر فوری رابطہ کریں"
                        >
                          <MessageCircle className="w-4 h-4" />
                          <span>واٹس ایپ جواب</span>
                        </a>
                        <button 
                          onClick={() => handleOpenBookingReply(b)}
                          className="px-3.5 py-2 bg-[#5C4632] hover:bg-[#433123] text-amber-200 font-bold rounded-lg shadow-xs transition-colors"
                        >
                          جواب و تفصیلات
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Pending Questions Alert */}
          <div className="bg-amber-50 dark:bg-slate-900 p-6 rounded-2xl border border-amber-300 dark:border-slate-800 space-y-4">
            <h3 className="font-bold text-amber-900 dark:text-amber-300 font-urdu text-base">
              منتظر آن لائن فتویٰ سوالات (Awaiting Answers)
            </h3>
            {questions.filter(q => !q.isAnswered).length === 0 ? (
              <p className="text-xs text-slate-500 font-urdu">تمام آن لائن سوالات کے جوابات دیئے جا چکے ہیں۔</p>
            ) : (
              <div className="space-y-3">
                {questions.filter(q => !q.isAnswered).map(q => (
                  <div key={q.id} className="p-4 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 flex flex-wrap items-center justify-between gap-4 text-xs font-urdu">
                    <div>
                      <div className="font-bold text-slate-900 dark:text-slate-100">{q.subject}</div>
                      <div className="text-slate-500 mt-0.5">سائل: {q.questionerName} ({q.questionerEmail}) • {q.submissionDate}</div>
                    </div>
                    <button 
                      onClick={() => setSelectedQuestion(q)}
                      className="px-4 py-2 bg-emerald-800 hover:bg-emerald-900 text-amber-200 font-bold rounded-lg shadow-xs"
                    >
                      جواب دیں (Answer)
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Tab: Class Bookings & Admissions Manager */}
      {activeTab === 'bookings' && (
        <div className="bg-white dark:bg-slate-900 p-5 sm:p-7 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-6 font-urdu">
          {/* Header & Filter Stats */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-5">
            <div>
              <h2 className="text-xl font-black text-[#5C4632] dark:text-amber-300 flex items-center gap-2">
                <GraduationCap className="w-6 h-6 text-[#B88A3B]" />
                <span>آن لائن کلاس بکنگز و داخلہ فارم ریکارڈز</span>
              </h2>
              <p className="text-xs text-stone-500 dark:text-stone-400 mt-1">
                آن لائن قرآن کریم، عربی زبان، اور درسِ نظامی کے ٹرائل و داخلہ کے خواہشمند طلبہ کی فہرست اور جوابات
              </p>
            </div>

            {/* Quick Status Badges Filter */}
            <div className="flex flex-wrap gap-1.5">
              {[
                { id: 'all', label: `تمام (${bookings.length})` },
                { id: 'Pending', label: `زیر التواء (${bookings.filter(b => b.status === 'Pending').length})`, color: 'bg-amber-100 text-amber-900 border-amber-300' },
                { id: 'Contacted', label: `رابطہ شدہ (${bookings.filter(b => b.status === 'Contacted').length})`, color: 'bg-blue-100 text-blue-900 border-blue-300' },
                { id: 'Confirmed', label: `کنفرم شدہ (${bookings.filter(b => b.status === 'Confirmed').length})`, color: 'bg-emerald-100 text-emerald-900 border-emerald-300' },
                { id: 'Completed', label: `مکمل (${bookings.filter(b => b.status === 'Completed').length})`, color: 'bg-stone-100 text-stone-800 border-stone-300' },
              ].map(f => (
                <button
                  key={f.id}
                  onClick={() => setBookingStatusFilter(f.id)}
                  className={`px-3 py-1 rounded-lg text-xs font-bold transition-all border ${
                    bookingStatusFilter === f.id 
                      ? 'bg-[#5C4632] text-amber-300 border-[#B88A3B] shadow-xs' 
                      : 'bg-stone-50 dark:bg-slate-800 text-stone-600 dark:text-stone-300 border-stone-200 dark:border-slate-700 hover:bg-stone-100'
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>

          {/* Search Bar */}
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <input
                type="text"
                value={bookingSearch}
                onChange={(e) => setBookingSearch(e.target.value)}
                placeholder="طالب علم کا نام، ملک، کورس، یا واٹس ایپ نمبر سے تلاش کریں..."
                className="w-full pl-4 pr-10 py-2.5 rounded-xl border border-stone-300 dark:border-slate-700 bg-stone-50 dark:bg-slate-800 text-stone-900 dark:text-white text-xs font-sans focus:outline-hidden focus:border-[#B88A3B]"
              />
              <Search className="w-4 h-4 absolute right-3.5 top-3 text-stone-400" />
            </div>
            {bookingSearch && (
              <button 
                onClick={() => setBookingSearch('')}
                className="px-3 py-2 bg-stone-200 dark:bg-slate-800 text-stone-700 dark:text-stone-300 rounded-xl text-xs font-bold"
              >
                تلاش ختم کریں
              </button>
            )}
          </div>

          {/* Bookings List */}
          <div className="space-y-4">
            {bookings
              .filter(b => {
                if (bookingStatusFilter !== 'all' && b.status !== bookingStatusFilter) return false;
                if (!bookingSearch) return true;
                const s = bookingSearch.toLowerCase();
                return (
                  b.studentName.toLowerCase().includes(s) ||
                  (b.guardianName && b.guardianName.toLowerCase().includes(s)) ||
                  b.country.toLowerCase().includes(s) ||
                  b.course.toLowerCase().includes(s) ||
                  b.phone.includes(s) ||
                  (b.whatsapp && b.whatsapp.includes(s)) ||
                  (b.email && b.email.toLowerCase().includes(s))
                );
              })
              .map(b => {
                const rawPhone = (b.whatsapp || b.phone).replace(/[^0-9]/g, '');
                const cleanPhone = rawPhone.startsWith('0') ? '92' + rawPhone.slice(1) : rawPhone;
                const defaultMsg = encodeURIComponent(
                  b.replyMessage || 
                  `السلام علیکم ${b.studentName} صاحب! جامعہ اسلامیہ ایبٹ آباد میں آن لائن کورس (${b.course}) کے لیے آپ کی درخواست وصول ہوئی ہے۔ کیا ہم کلاس ٹائم اور زوم لنک فائنل کر سکتے ہیں؟`
                );

                const getStatusBadge = (status: BookingStatus) => {
                  switch (status) {
                    case 'Pending':
                      return <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-100 text-amber-900 border border-amber-300">زیر التواء (Pending)</span>;
                    case 'Contacted':
                      return <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-blue-100 text-blue-900 border border-blue-300">رابطہ شدہ (Contacted)</span>;
                    case 'Confirmed':
                      return <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-900 border border-emerald-300">کلاس کنفرم (Confirmed)</span>;
                    case 'Completed':
                      return <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-stone-100 text-stone-900 border border-stone-300">مکمل (Completed)</span>;
                    case 'Cancelled':
                      return <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-red-100 text-red-900 border border-red-300">منسوخ (Cancelled)</span>;
                    default:
                      return null;
                  }
                };

                return (
                  <div 
                    key={b.id} 
                    className="p-5 rounded-2xl border border-stone-200 dark:border-slate-800 bg-stone-50/50 dark:bg-slate-800/40 hover:border-[#B88A3B]/60 transition-all space-y-3.5 shadow-xs"
                  >
                    {/* Top Row: Title, Badges, Date */}
                    <div className="flex flex-wrap items-center justify-between gap-3 border-b border-stone-200/80 dark:border-slate-700/60 pb-3">
                      <div className="flex flex-wrap items-center gap-2.5">
                        <span className="text-base font-black text-[#5C4632] dark:text-amber-200">
                          {b.studentName}
                        </span>
                        <span className={`px-2.5 py-0.5 rounded-md text-[10px] font-bold ${
                          b.bookingType === 'Trial' 
                            ? 'bg-orange-600 text-white' 
                            : 'bg-[#5C4632] text-amber-300'
                        }`}>
                          {b.bookingType === 'Trial' ? '۳ روزہ مفت ٹرائل' : 'آن لائن داخلہ فارم'}
                        </span>
                        {getStatusBadge(b.status)}
                      </div>

                      <div className="flex items-center gap-3 text-xs text-stone-500 dark:text-stone-400">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5" />
                          <span>{b.date}</span>
                        </span>
                        {/* Quick Status Dropdown */}
                        <select
                          value={b.status}
                          onChange={(e) => handleQuickStatusChange(b.id, e.target.value as BookingStatus)}
                          className="px-2 py-1 rounded-lg border border-stone-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-[11px] font-bold text-stone-800 dark:text-stone-200"
                        >
                          <option value="Pending">زیر التواء</option>
                          <option value="Contacted">رابطہ ہو گیا</option>
                          <option value="Confirmed">کلاس کنفرم</option>
                          <option value="Completed">مکمل</option>
                          <option value="Cancelled">منسوخ</option>
                        </select>
                      </div>
                    </div>

                    {/* Middle Grid: Details */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 text-xs text-stone-700 dark:text-stone-300 bg-white dark:bg-slate-800/80 p-3.5 rounded-xl border border-stone-200/80 dark:border-slate-700/60">
                      <div>
                        <span className="text-stone-400 text-[11px] block">منتخب کورس:</span>
                        <strong className="text-slate-900 dark:text-white font-bold">{b.course}</strong>
                      </div>
                      <div>
                        <span className="text-stone-400 text-[11px] block">ملک / علاقہ:</span>
                        <strong className="text-slate-900 dark:text-white">{b.country}</strong>
                      </div>
                      <div>
                        <span className="text-stone-400 text-[11px] block">پسندیدہ وقت / عمر:</span>
                        <span>{b.preferredTime || 'شام / حسبِ سہولت'} {b.age ? `(عمر: ${b.age} سال)` : ''}</span>
                      </div>
                      <div>
                        <span className="text-stone-400 text-[11px] block">رابطہ نمبر / واٹس ایپ:</span>
                        <span dir="ltr" className="font-sans font-bold text-[#5C4632] dark:text-amber-300">{b.phone || b.whatsapp}</span>
                        {b.guardianName && <span className="block text-[10px] text-stone-500">سرپرست: {b.guardianName}</span>}
                      </div>
                    </div>

                    {/* Admin Notes / Saved Reply Display */}
                    {(b.adminNotes || b.replyMessage) && (
                      <div className="space-y-1.5 text-xs bg-amber-50/70 dark:bg-slate-900/80 p-3 rounded-xl border border-amber-200/80 dark:border-slate-700">
                        {b.adminNotes && (
                          <div className="text-stone-700 dark:text-stone-300">
                            <strong className="text-amber-900 dark:text-amber-300">ایڈمن نوٹ: </strong>
                            <span>{b.adminNotes}</span>
                          </div>
                        )}
                        {b.replyMessage && (
                          <div className="text-emerald-900 dark:text-emerald-300 pt-1 border-t border-amber-200/60 dark:border-slate-800">
                            <strong>ارسال کردہ جواب ({b.replyDate || b.date}): </strong>
                            <span>{b.replyMessage}</span>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Action Buttons */}
                    <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
                      <div className="flex items-center gap-2">
                        {/* 1-Click WhatsApp Direct Reply */}
                        <a
                          href={`https://wa.me/${cleanPhone}?text=${defaultMsg}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-3.5 py-2 bg-[#25D366] hover:bg-[#20ba5a] text-white font-bold rounded-xl flex items-center gap-1.5 text-xs shadow-xs transition-transform hover:scale-[1.02]"
                          title="طالب علم کے ساتھ واٹس ایپ پر چیٹ شروع کریں"
                        >
                          <MessageCircle className="w-4 h-4" />
                          <span>واٹس ایپ پر فوری جواب دیں</span>
                        </a>

                        {/* Open Reply & Note Modal */}
                        <button
                          onClick={() => handleOpenBookingReply(b)}
                          className="px-3.5 py-2 bg-[#5C4632] hover:bg-[#433123] text-amber-200 font-bold rounded-xl text-xs border border-[#B88A3B] shadow-xs flex items-center gap-1.5 transition-colors"
                        >
                          <Send className="w-3.5 h-3.5" />
                          <span>جواب لکھیں / اسٹیٹس تبدیل کریں</span>
                        </button>
                      </div>

                      <button
                        onClick={() => handleDeleteBooking(b.id)}
                        className="px-3 py-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-950/40 rounded-xl text-xs font-bold flex items-center gap-1 transition-colors"
                        title="اس بکنگ ریکارڈ کو حذف کریں"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>حذف</span>
                      </button>
                    </div>
                  </div>
                );
              })}

            {bookings.length === 0 && (
              <div className="text-center py-12 bg-stone-50 dark:bg-slate-800/40 rounded-2xl border border-dashed border-stone-300 dark:border-slate-700">
                <GraduationCap className="w-12 h-12 mx-auto text-stone-400 mb-2" />
                <p className="text-sm font-bold text-stone-600 dark:text-stone-300">کوئی کلاس بکنگ یا داخلہ درخواست موجود نہیں ہے۔</p>
                <p className="text-xs text-stone-400 mt-1">جب کوئی سائل ویب سائٹ سے داخلہ فارم یا ۳ روزہ مفت ٹرائل فل کرے گا، تو وہ یہاں ظاہر ہو جائے گا۔</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Booking Reply & Status Modal */}
      {selectedBooking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xs font-urdu" dir="rtl">
          <div className="bg-white dark:bg-slate-900 p-6 sm:p-7 rounded-3xl max-w-xl w-full border-2 border-[#B88A3B]/60 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-stone-200 dark:border-slate-800 pb-3">
              <div>
                <h3 className="font-black text-lg text-[#5C4632] dark:text-amber-300">
                  طالب علم کو جواب و کلاس شیڈول
                </h3>
                <p className="text-xs text-stone-500 dark:text-stone-400">
                  {selectedBooking.studentName} ({selectedBooking.country}) • {selectedBooking.course}
                </p>
              </div>
              <button
                onClick={() => setSelectedBooking(null)}
                className="p-1.5 text-stone-400 hover:text-stone-600 dark:hover:text-stone-200 text-lg font-bold"
              >
                ✕
              </button>
            </div>

            {/* Quick Summary Card */}
            <div className="bg-stone-50 dark:bg-slate-800 p-3.5 rounded-2xl border border-stone-200 dark:border-slate-700 text-xs space-y-1">
              <div className="flex justify-between">
                <span className="text-stone-500">کورس:</span>
                <strong>{selectedBooking.course}</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-stone-500">فون / واٹس ایپ:</span>
                <span dir="ltr" className="font-bold text-[#5C4632] dark:text-amber-300">{selectedBooking.whatsapp || selectedBooking.phone}</span>
              </div>
              {selectedBooking.preferredTime && (
                <div className="flex justify-between">
                  <span className="text-stone-500">پسندیدہ وقت:</span>
                  <span>{selectedBooking.preferredTime}</span>
                </div>
              )}
            </div>

            {/* Status Selection */}
            <div>
              <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-1.5">
                کلاس / داخلہ اسٹیٹس (Status):
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {[
                  { id: 'Pending', label: 'زیر التواء' },
                  { id: 'Contacted', label: 'رابطہ ہو گیا' },
                  { id: 'Confirmed', label: 'کلاس کنفرم' },
                  { id: 'Completed', label: 'مکمل' },
                ].map(s => (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => setBookingNewStatus(s.id as BookingStatus)}
                    className={`py-2 rounded-xl text-xs font-bold border transition-all ${
                      bookingNewStatus === s.id
                        ? 'bg-[#5C4632] text-amber-300 border-[#B88A3B] shadow-xs'
                        : 'bg-stone-100 dark:bg-slate-800 text-stone-700 dark:text-stone-300 border-transparent hover:bg-stone-200'
                    }`}
                  >
                    {s.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Pre-filled Message Templates */}
            <div>
              <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-1">
                تیار شدہ پیغامات (Quick Templates):
              </label>
              <div className="flex flex-wrap gap-1.5">
                <button
                  type="button"
                  onClick={() => {
                    setBookingReplyText(
                      `السلام علیکم ${selectedBooking.studentName} صاحب! جامعہ اسلامیہ ایبٹ آباد میں ۳ روزہ مفت ٹرائل کلاس کے لیے آپ کی رجسٹریشن مکمل ہو گئی ہے۔ استاد کے ساتھ آپ کی پہلی کلاس کا وقت مقرر کیا جا رہا ہے۔ کیا آپ زوم / گوگل میٹ پر دستیاب ہیں؟`
                    );
                    setBookingNewStatus('Contacted');
                  }}
                  className="px-2.5 py-1 bg-amber-100 hover:bg-amber-200 text-amber-900 rounded-lg text-[11px] font-bold"
                >
                  ۳ روزہ فری ٹرائل خیر مقدم
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setBookingReplyText(
                      `السلام علیکم ورحمۃ اللہ! جامعہ اسلامیہ ایبٹ آباد میں آپ کے کورس (${selectedBooking.course}) کی کلاس کنفرم ہو گئی ہے۔ کلاس کا زوم لنک اور ٹائم ٹیبل یہ ہے: https://zoom.us/j/jia-online-class • وقت: روزانہ شام 7:00 بجے۔`
                    );
                    setBookingNewStatus('Confirmed');
                  }}
                  className="px-2.5 py-1 bg-emerald-100 hover:bg-emerald-200 text-emerald-900 rounded-lg text-[11px] font-bold"
                >
                  کلاس کنفرمیشن و زوم لنک
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setBookingReplyText(
                      `السلام علیکم! جامعہ اسلامیہ ایبٹ آباد میں آن لائن داخلہ فارم کی وصولی کی تصدیق کی جاتی ہے۔ آپ کی فیس اور تعلیمی شیڈول کی تفصیلات جلد ارسال کی جائیں گی۔`
                    );
                    setBookingNewStatus('Contacted');
                  }}
                  className="px-2.5 py-1 bg-blue-100 hover:bg-blue-200 text-blue-900 rounded-lg text-[11px] font-bold"
                >
                  باقاعدہ داخلہ تصدیق
                </button>
              </div>
            </div>

            {/* Reply Text Message Area */}
            <div>
              <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-1">
                طالب علم کے لیے جواب (Reply Message):
              </label>
              <textarea
                rows={4}
                value={bookingReplyText}
                onChange={(e) => setBookingReplyText(e.target.value)}
                placeholder="طالب علم کے لیے جوابی پیغام درج کریں..."
                className="w-full p-3 text-xs rounded-xl border border-stone-300 dark:border-slate-700 bg-stone-50 dark:bg-slate-800 text-stone-900 dark:text-white font-sans focus:outline-hidden focus:border-[#B88A3B]"
              ></textarea>
            </div>

            {/* Internal Admin Note */}
            <div>
              <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-1">
                ایڈمن کا اندرونی نوٹ (Internal Note - اختیاری):
              </label>
              <input
                type="text"
                value={bookingAdminNotes}
                onChange={(e) => setBookingAdminNotes(e.target.value)}
                placeholder="مثلاً: قاری صاحب کو کلاس سونپ دی گئی ہے / فیمیل معلمہ کا انتظام ہو گیا۔"
                className="w-full px-3 py-2 text-xs rounded-xl border border-stone-300 dark:border-slate-700 bg-stone-50 dark:bg-slate-800 text-stone-900 dark:text-white font-urdu focus:outline-hidden focus:border-[#B88A3B]"
              />
            </div>

            {/* Footer Buttons */}
            <div className="flex flex-wrap justify-between items-center gap-3 pt-3 border-t border-stone-200 dark:border-slate-800">
              <button
                type="button"
                onClick={() => setSelectedBooking(null)}
                className="px-4 py-2 bg-stone-200 hover:bg-stone-300 dark:bg-slate-800 text-stone-800 dark:text-stone-300 rounded-xl text-xs font-bold"
              >
                منسوخ
              </button>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleSaveBookingReply(false)}
                  className="px-4 py-2.5 bg-[#5C4632] hover:bg-[#433123] text-amber-200 rounded-xl text-xs font-bold border border-[#B88A3B] shadow-sm"
                >
                  صرف محفوظ کریں
                </button>
                <button
                  type="button"
                  onClick={() => handleSaveBookingReply(true)}
                  className="px-4 py-2.5 bg-[#25D366] hover:bg-[#20ba5a] text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-md"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>محفوظ کریں اور واٹس ایپ پر بھیجیں</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Online Questions Manager */}
      {activeTab === 'questions' && (
        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <h2 className="text-lg font-bold font-urdu text-slate-900 dark:text-slate-100">
            سائلین کے موصول شدہ آن لائن سوالات
          </h2>

          <div className="space-y-3">
            {questions.map(q => (
              <div key={q.id} className="p-5 rounded-xl border border-slate-200 dark:border-slate-800 space-y-2 text-xs font-urdu">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900 dark:text-slate-100 text-sm">{q.subject}</span>
                  <span className={`px-2 py-0.5 rounded font-bold ${q.isAnswered ? 'bg-emerald-100 text-emerald-900' : 'bg-amber-100 text-amber-900'}`}>
                    {q.isAnswered ? 'جواب دے دیا گیا' : 'غیر جواب دہ'}
                  </span>
                </div>

                <div className="text-slate-600 dark:text-slate-400 bg-slate-50 dark:bg-slate-800/60 p-3 rounded-lg">
                  <strong>سوال: </strong>{q.question}
                </div>

                {q.isAnswered && (
                  <div className="text-emerald-900 dark:text-emerald-300 bg-emerald-50 dark:bg-slate-800 p-3 rounded-lg">
                    <strong>شرعی جواب: </strong>{q.reply}
                  </div>
                )}

                <div className="pt-2 flex justify-between items-center text-slate-500">
                  <span>سائل: {q.questionerName} ({q.questionerEmail})</span>
                  {!q.isAnswered && (
                    <button 
                      onClick={() => setSelectedQuestion(q)}
                      className="px-4 py-1.5 bg-emerald-800 text-amber-200 font-bold rounded-lg"
                    >
                      جواب دیں
                    </button>
                  )}
                </div>
              </div>
            ))}

            {questions.length === 0 && (
              <div className="text-center py-12 bg-stone-50 dark:bg-slate-800/40 rounded-2xl border border-dashed border-stone-300 dark:border-slate-700">
                <MessageSquare className="w-12 h-12 mx-auto text-stone-400 mb-2" />
                <p className="text-sm font-bold text-stone-600 dark:text-stone-300">کوئی آن لائن سوال موجود نہیں ہے۔</p>
                <p className="text-xs text-stone-400 mt-1">جب کوئی سائل فتویٰ فارم جمع کرے گا تو وہ یہاں دکھائی دے گا۔</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Answer Modal */}
      {selectedQuestion && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xs">
          <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl max-w-xl w-full border border-amber-300 space-y-4 font-urdu">
            <h3 className="font-bold text-lg text-emerald-950 dark:text-emerald-100">
              سوال کا جواب دیں: {selectedQuestion.subject}
            </h3>

            <div className="p-3 bg-slate-100 dark:bg-slate-800 rounded-lg text-xs text-slate-700 dark:text-slate-300">
              {selectedQuestion.question}
            </div>

            <form onSubmit={handleAnswerQuestion} className="space-y-4">
              <div>
                <label className="block text-xs font-bold mb-1">مفتی کا شرعی جواب تحریر کریں *</label>
                <textarea 
                  rows={5}
                  required
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  placeholder="الجواب باسم ملہم الصواب:&#10;&#10;صورتِ مسؤلہ میں..."
                  className="w-full p-3 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
                ></textarea>
              </div>

              <div className="flex items-center gap-2 text-xs">
                <input 
                  type="checkbox"
                  id="pub"
                  checked={publishToArchive}
                  onChange={(e) => setPublishToArchive(e.target.checked)}
                />
                <label htmlFor="pub">اس جواب کو پبلک فتاویٰ آرکائیو میں بھی شائع کریں</label>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button 
                  type="button" 
                  onClick={() => setSelectedQuestion(null)}
                  className="px-4 py-2 bg-slate-200 text-slate-800 rounded-lg text-xs font-bold"
                >
                  منسوخ
                </button>
                <button 
                  type="submit"
                  className="px-6 py-2 bg-emerald-800 text-amber-200 rounded-lg text-xs font-bold"
                >
                  جواب بھیجیں (Send Answer)
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Tab 3: Fatwas Manager */}
      {activeTab === 'fatwas' && (
        <div className="space-y-4 font-urdu">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">فتاویٰ جات مینیجر</h2>
            <button 
              onClick={handleOpenAddFatwa}
              className="px-4 py-2 bg-emerald-800 hover:bg-emerald-900 text-amber-200 font-bold text-xs rounded-xl flex items-center gap-1.5 shadow-xs"
            >
              <Plus className="w-4 h-4" />
              <span>نیا فتویٰ شائع کریں</span>
            </button>
          </div>

          <div className="grid grid-cols-1 gap-3">
            {fatwas.map(f => (
              <div key={f.id} className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs shadow-xs hover:border-[#B88A3B]/40 transition-colors">
                <div className="space-y-1.5 max-w-2xl">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-mono font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded text-[11px]">{f.fatwaNumber}</span>
                    {f.category && (
                      <span className="text-[10px] bg-stone-100 dark:bg-slate-800 text-stone-600 dark:text-stone-300 px-2 py-0.5 rounded">
                        {f.category}
                      </span>
                    )}

                    {/* Translation Status Badge */}
                    {f.isTranslationApproved ? (
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800 flex items-center gap-1">
                        <CheckCircle className="w-3 h-3" />
                        <span>English ترجمہ تصدیق شدہ</span>
                      </span>
                    ) : f.isAiTranslatedEn ? (
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 dark:bg-amber-950/80 text-amber-800 dark:text-amber-300 border border-amber-300 dark:border-amber-800 flex items-center gap-1">
                        <Sparkles className="w-3 h-3 text-amber-600" />
                        <span>خودکار AI ترجمہ (زیرِ جائزہ)</span>
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 rounded text-[10px] text-stone-500 bg-stone-100 dark:bg-slate-800">
                        انگریزی ترجمہ نہیں
                      </span>
                    )}
                  </div>
                  <div className="font-bold text-sm text-slate-900 dark:text-slate-100 mt-0.5">{f.title.ur || f.title.en}</div>
                  {f.title?.en && f.title?.en !== f.title?.ur && (
                    <div className="text-[11px] text-stone-500 font-sans italic" dir="ltr">{f.title.en}</div>
                  )}
                  {f.question?.ur && (
                    <p className="text-[11px] text-stone-500 line-clamp-1">
                      {f.question.ur}
                    </p>
                  )}
                </div>

                <div className="flex flex-wrap items-center gap-1.5">
                  {/* Approve Translation 1-click button if AI translated and not approved */}
                  {f.isAiTranslatedEn && !f.isTranslationApproved && (
                    <button
                      onClick={() => handleApproveTranslation(f)}
                      className="px-2.5 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded-lg flex items-center gap-1 text-[11px] shadow-2xs transition-colors"
                      title="اس خودکار انگریزی ترجمہ کی توثیق کریں (Approve Translation)"
                    >
                      <CheckCircle className="w-3.5 h-3.5" />
                      <span>ترجمہ تصدیق کریں</span>
                    </button>
                  )}

                  {/* On-demand Gemini Translate button */}
                  <button
                    onClick={() => handleGenerateTranslationForFatwa(f)}
                    disabled={translatingFatwaId === f.id}
                    className="px-2.5 py-1.5 bg-purple-50 hover:bg-purple-100 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 font-bold rounded-lg flex items-center gap-1 text-[11px] border border-purple-200 dark:border-purple-800 transition-colors disabled:opacity-50"
                    title="Gemini AI سے انگریزی ترجمہ تیار کریں"
                  >
                    {translatingFatwaId === f.id ? (
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    ) : (
                      <Sparkles className="w-3.5 h-3.5 text-purple-600" />
                    )}
                    <span>{f.isAiTranslatedEn ? 'دوبارہ ترجمہ' : 'AI انگریزی ترجمہ'}</span>
                  </button>

                  <button 
                    onClick={() => handleOpenEditFatwa(f)}
                    className="px-3 py-1.5 bg-blue-50 hover:bg-blue-100 dark:bg-blue-950/60 dark:hover:bg-blue-900/60 text-blue-700 dark:text-blue-300 font-bold rounded-lg flex items-center gap-1.5 transition-colors"
                    title="اس فتویٰ میں ترمیم کریں (Edit Fatwa)"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                    <span>ترمیم</span>
                  </button>

                  <button 
                    onClick={async () => {
                      if (window.confirm(`کیا آپ واقعی فتویٰ نمبر ${f.fatwaNumber} کو حذف کرنا چاہتے ہیں؟`)) {
                        try {
                          await StorageService.deleteFatwa(f.id);
                          refreshData();
                        } catch (err: any) {
                          alert('فتویٰ حذف کرنے میں سرور پر خرابی پیش آئی: ' + (err?.message || 'نامعلوم خرابی'));
                        }
                      }
                    }}
                    className="px-3 py-1.5 text-red-600 hover:bg-red-50 dark:hover:bg-red-950/60 font-bold rounded-lg flex items-center gap-1.5 transition-colors"
                    title="اس فتویٰ کو حذف کریں (Delete Fatwa)"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>حذف</span>
                  </button>
                </div>
              </div>
            ))}

            {fatwas.length === 0 && (
              <div className="text-center py-10 bg-stone-50 dark:bg-slate-800/40 rounded-2xl border border-dashed border-stone-300 dark:border-slate-700">
                <BookOpen className="w-10 h-10 mx-auto text-stone-400 mb-2" />
                <p className="text-sm font-bold text-stone-600 dark:text-stone-300">کوئی فتویٰ موجود نہیں ہے۔</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Add / Edit Fatwa Modal */}
      {showAddFatwa && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-3 sm:p-6 bg-slate-950/80 backdrop-blur-xs font-urdu overflow-y-auto" dir="rtl">
          <div className="bg-white dark:bg-slate-900 p-5 sm:p-6 rounded-2xl max-w-2xl w-full border border-amber-300 dark:border-amber-700 shadow-2xl space-y-4 my-auto max-h-[calc(100vh-2rem)] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-stone-200 dark:border-slate-800 pb-3">
              <h3 className="font-bold text-lg text-emerald-950 dark:text-emerald-100 flex items-center gap-2">
                {editingFatwa ? (
                  <>
                    <Edit3 className="w-5 h-5 text-blue-600" />
                    <span>فتویٰ میں ترمیم کریں (Edit Fatwa)</span>
                  </>
                ) : (
                  <>
                    <Plus className="w-5 h-5 text-emerald-600" />
                    <span>نیا فتویٰ شامل کریں (Add New Fatwa)</span>
                  </>
                )}
              </h3>
              <button 
                type="button" 
                onClick={() => { setShowAddFatwa(false); setEditingFatwa(null); }}
                className="text-stone-400 hover:text-stone-600 dark:hover:text-stone-200 text-lg font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateFatwa} className="space-y-3 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block font-bold mb-1 text-stone-700 dark:text-stone-300">فتویٰ نمبر</label>
                  <input 
                    type="text" 
                    value={newFatwaNum}
                    onChange={(e) => setNewFatwaNum(e.target.value)}
                    className="w-full p-2.5 border border-stone-300 dark:border-slate-700 rounded-xl bg-slate-50 dark:bg-slate-800 text-stone-900 dark:text-white font-mono"
                  />
                </div>
                <div>
                  <label className="block font-bold mb-1 text-stone-700 dark:text-stone-300">تاریخِ اشاعت (Publication Date)</label>
                  <input 
                    type="date" 
                    value={newFatwaDate}
                    onChange={(e) => setNewFatwaDate(e.target.value)}
                    className="w-full p-2.5 border border-stone-300 dark:border-slate-700 rounded-xl bg-slate-50 dark:bg-slate-800 text-stone-900 dark:text-white font-sans"
                  />
                </div>
                <div>
                  <label className="block font-bold mb-1 text-stone-700 dark:text-stone-300">زمرہ (Category)</label>
                  <select 
                    value={newFatwaCat} 
                    onChange={(e) => setNewFatwaCat(e.target.value as any)}
                    className="w-full p-2.5 border border-stone-300 dark:border-slate-700 rounded-xl bg-slate-50 dark:bg-slate-800 text-stone-900 dark:text-white"
                  >
                    <option value="General Fiqh">General Fiqh (عام مسائل فقہی)</option>
                    <option value="Business & Trade">Business & Trade (خرید و فروخت و معاملات)</option>
                    <option value="Namaz & Prayer">Namaz & Prayer (نماز و عبادات)</option>
                    <option value="Zakat & Charity">Zakat & Charity (زکوٰۃ و صدقات)</option>
                    <option value="Nikah & Talaq">Nikah & Talaq (نکاح و طلاق)</option>
                    <option value="Modern Issues & Tech">Modern Issues & Tech (جدید مسائل و ٹیکنالوجی)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold mb-1 text-stone-700 dark:text-stone-300">عنوانِ فتویٰ *</label>
                <input 
                  type="text" 
                  required
                  placeholder="مثلاً: سونے چاندی کی زکوٰۃ کا شرعی حکم..."
                  value={newFatwaTitleUr}
                  onChange={(e) => setNewFatwaTitleUr(e.target.value)}
                  className="w-full p-2.5 border border-stone-300 dark:border-slate-700 rounded-xl bg-slate-50 dark:bg-slate-800 text-stone-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block font-bold mb-1 text-stone-700 dark:text-stone-300">سوال (استفتاء)</label>
                <textarea 
                  rows={3}
                  value={newFatwaQuestionUr}
                  onChange={(e) => setNewFatwaQuestionUr(e.target.value)}
                  placeholder="سائل کا سوال درج کریں..."
                  className="w-full p-2.5 border border-stone-300 dark:border-slate-700 rounded-xl bg-slate-50 dark:bg-slate-800 text-stone-900 dark:text-white"
                ></textarea>
              </div>

              <div>
                <label className="block font-bold mb-1 text-stone-700 dark:text-stone-300">شرعی جواب (الجواب باسم ملہم الصواب) *</label>
                <textarea 
                  rows={5}
                  required
                  value={newFatwaAnswerUr}
                  onChange={(e) => setNewFatwaAnswerUr(e.target.value)}
                  placeholder="الجواب باسم ملہم الصواب:&#10;&#10;صورتِ مسؤلہ میں..."
                  className="w-full p-2.5 border border-stone-300 dark:border-slate-700 rounded-xl bg-slate-50 dark:bg-slate-800 text-stone-900 dark:text-white font-urdu"
                ></textarea>
              </div>

              <div>
                <label className="block font-bold mb-1 text-stone-700 dark:text-stone-300">حوالہ جات و دلائل (والدلیل علی ذلک / عربی عبارات و مآخذ)</label>
                <textarea 
                  rows={3}
                  value={newFatwaArabic}
                  onChange={(e) => setNewFatwaArabic(e.target.value)}
                  placeholder="والدلیل علی ذلک:&#10;قال الله تعالى...&#10;وفي الدر المختار مع رد المحتار..."
                  className="w-full p-2.5 border border-stone-300 dark:border-slate-700 rounded-xl bg-slate-50 dark:bg-slate-800 text-stone-900 dark:text-white font-arabic"
                ></textarea>
              </div>

              {/* AI Auto Translation Section (English & Arabic) */}
              <div className="pt-3 border-t border-dashed border-stone-300 dark:border-slate-700 space-y-4 bg-amber-50/40 dark:bg-slate-800/40 p-3.5 rounded-xl">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-stone-800 dark:text-amber-300 text-xs flex items-center gap-1.5">
                    <Globe className="w-4 h-4 text-[#B88A3B]" />
                    <span>انگریزی و عربی ترجمہ (English & Arabic Translation - Gemini AI)</span>
                  </span>
                  <button
                    type="button"
                    onClick={handleAutoTranslateInModal}
                    disabled={isGeneratingTranslation}
                    className="px-3 py-1.5 bg-purple-700 hover:bg-purple-800 text-white rounded-lg text-[11px] font-bold flex items-center gap-1.5 disabled:opacity-50 transition-colors shadow-xs"
                  >
                    {isGeneratingTranslation ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5" />}
                    <span>Gemini AI سے ترجمہ جنریٹ کریں (English + Arabic)</span>
                  </button>
                </div>

                {/* English Section */}
                <div className="space-y-2.5 p-2.5 bg-white/70 dark:bg-slate-900/60 rounded-lg border border-stone-200 dark:border-slate-700">
                  <div className="font-bold text-[11px] text-purple-900 dark:text-purple-300 flex items-center gap-1">
                    <span>🇬🇧 انگریزی ترجمہ (English Translation)</span>
                  </div>
                  <div>
                    <label className="block font-bold mb-1 text-stone-700 dark:text-stone-300">English Title</label>
                    <input
                      type="text"
                      dir="ltr"
                      value={newFatwaTitleEn}
                      onChange={(e) => setNewFatwaTitleEn(e.target.value)}
                      placeholder="Ruling regarding..."
                      className="w-full p-2 border border-stone-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-stone-900 dark:text-white font-sans text-xs"
                    />
                  </div>

                  <div>
                    <label className="block font-bold mb-1 text-stone-700 dark:text-stone-300">English Question</label>
                    <textarea
                      rows={2}
                      dir="ltr"
                      value={newFatwaQuestionEn}
                      onChange={(e) => setNewFatwaQuestionEn(e.target.value)}
                      placeholder="Question in English..."
                      className="w-full p-2 border border-stone-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-stone-900 dark:text-white font-sans text-xs"
                    ></textarea>
                  </div>

                  <div>
                    <label className="block font-bold mb-1 text-stone-700 dark:text-stone-300">English Answer</label>
                    <textarea
                      rows={3}
                      dir="ltr"
                      value={newFatwaAnswerEn}
                      onChange={(e) => setNewFatwaAnswerEn(e.target.value)}
                      placeholder="In the Name of Allah, the Most Gracious, the Most Merciful..."
                      className="w-full p-2 border border-stone-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-stone-900 dark:text-white font-sans text-xs"
                    ></textarea>
                  </div>
                </div>

                {/* Arabic Section */}
                <div className="space-y-2.5 p-2.5 bg-white/70 dark:bg-slate-900/60 rounded-lg border border-stone-200 dark:border-slate-700" dir="rtl">
                  <div className="font-bold text-[11px] text-emerald-900 dark:text-emerald-300 flex items-center gap-1">
                    <span>🇸🇦 الترجمة العربية (Arabic Translation)</span>
                  </div>
                  <div>
                    <label className="block font-bold mb-1 text-stone-700 dark:text-stone-300">عنوان الفتوى (Arabic Title)</label>
                    <input
                      type="text"
                      dir="rtl"
                      value={newFatwaTitleAr}
                      onChange={(e) => setNewFatwaTitleAr(e.target.value)}
                      placeholder="حكم بخصوص..."
                      className="w-full p-2 border border-stone-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-stone-900 dark:text-white font-arabic text-xs"
                    />
                  </div>

                  <div>
                    <label className="block font-bold mb-1 text-stone-700 dark:text-stone-300">نص السؤال بالعربية (Arabic Question)</label>
                    <textarea
                      rows={2}
                      dir="rtl"
                      value={newFatwaQuestionAr}
                      onChange={(e) => setNewFatwaQuestionAr(e.target.value)}
                      placeholder="نص السؤال بالعربية..."
                      className="w-full p-2 border border-stone-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-stone-900 dark:text-white font-arabic text-xs"
                    ></textarea>
                  </div>

                  <div>
                    <label className="block font-bold mb-1 text-stone-700 dark:text-stone-300">نص الجواب والفتوى بالعربية (Arabic Answer)</label>
                    <textarea
                      rows={3}
                      dir="rtl"
                      value={newFatwaAnswerAr}
                      onChange={(e) => setNewFatwaAnswerAr(e.target.value)}
                      placeholder="بسم الله الرحمن الرحيم، الجواب حامداً ومصلياً..."
                      className="w-full p-2 border border-stone-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-stone-900 dark:text-white font-arabic text-xs"
                    ></textarea>
                  </div>
                </div>

                <div className="flex items-center gap-2 pt-1">
                  <input
                    type="checkbox"
                    id="approve_en"
                    checked={newFatwaIsApproved}
                    onChange={(e) => setNewFatwaIsApproved(e.target.checked)}
                    className="w-4 h-4 accent-emerald-700 rounded"
                  />
                  <label htmlFor="approve_en" className="font-bold text-stone-800 dark:text-stone-200 cursor-pointer">
                    اس ترجمہ (انگریزی وعربی) کو دارالافتاء سے تصدیق شدہ (Verified & Approved) نشان زد کریں
                  </label>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-stone-200 dark:border-slate-800">
                <button 
                  type="button" 
                  onClick={() => { setShowAddFatwa(false); setEditingFatwa(null); }} 
                  className="px-4 py-2 bg-slate-200 dark:bg-slate-800 text-slate-800 dark:text-slate-200 rounded-xl font-bold hover:bg-slate-300 transition-colors"
                >
                  منسوخ
                </button>
                <button 
                  type="submit" 
                  className="px-6 py-2 bg-emerald-800 hover:bg-emerald-900 text-amber-200 rounded-xl font-bold shadow-xs transition-colors"
                >
                  {editingFatwa ? 'تبدیلیاں محفوظ کریں (Save Changes)' : 'شائع کریں (Publish Fatwa)'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Tab 4: Results Manager */}
      {activeTab === 'results' && (
        <div className="space-y-4 font-urdu">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">امتحانی نتائج مینیجر</h2>
            <button 
              onClick={() => setShowAddResult(true)}
              className="px-4 py-2 bg-emerald-800 text-amber-200 font-bold text-xs rounded-xl flex items-center gap-1"
            >
              <Plus className="w-4 h-4" />
              <span>نیا امتحانی نتیجہ اپلوڈ کریں</span>
            </button>
          </div>

          <div className="space-y-2">
            {results.map(r => (
              <div key={r.id} className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs">
                <div>
                  <span className="font-mono font-bold text-emerald-700">{r.rollNumber}</span>
                  <div className="font-bold text-slate-900 dark:text-slate-100">{r.studentName} ({r.department})</div>
                </div>
                <div className="font-mono font-bold text-amber-600">{r.percentage}% - {r.grade}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Add Result Modal */}
      {showAddResult && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-3 sm:p-6 bg-slate-950/80 backdrop-blur-xs font-urdu overflow-y-auto" dir="rtl">
          <div className="bg-white dark:bg-slate-900 p-5 sm:p-6 rounded-2xl max-w-xl w-full border border-amber-300 dark:border-slate-700 shadow-2xl space-y-4 my-auto max-h-[calc(100vh-2rem)] overflow-y-auto">
            <h3 className="font-bold text-lg text-emerald-950 dark:text-emerald-100">امتحانی نتیجہ شامل کریں</h3>

            <form onSubmit={handleCreateResult} className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold mb-1">رول نمبر *</label>
                  <input type="text" required value={newRoll} onChange={(e) => setNewRoll(e.target.value)} placeholder="2026-8804" className="w-full p-2 border rounded font-mono" />
                </div>
                <div>
                  <label className="block font-bold mb-1">طالب علم کا نام *</label>
                  <input type="text" required value={newStudentName} onChange={(e) => setNewStudentName(e.target.value)} className="w-full p-2 border rounded" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold mb-1">والد کا نام</label>
                  <input type="text" value={newFatherName} onChange={(e) => setNewFatherName(e.target.value)} className="w-full p-2 border rounded" />
                </div>
                <div>
                  <label className="block font-bold mb-1">حاصل کردہ کل نمبر (از ۵۰۰)</label>
                  <input type="number" value={newObtainedMarks} onChange={(e) => setNewObtainedMarks(Number(e.target.value))} className="w-full p-2 border rounded font-mono" />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button type="button" onClick={() => setShowAddResult(false)} className="px-4 py-2 bg-slate-200 rounded">منسوخ</button>
                <button type="submit" className="px-6 py-2 bg-emerald-800 text-amber-200 rounded font-bold">محفوظ کریں</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Tab: Departments Management */}
      {activeTab === 'departments' && (
        <DepartmentsManagement onUpdate={refreshData} />
      )}

      {/* Tab: Faculty Management */}
      {activeTab === 'faculty' && (
        <FacultyManagement onUpdate={refreshData} />
      )}

      {/* Tab: News Management */}
      {activeTab === 'news' && (
        <NewsManagement onUpdate={refreshData} />
      )}

      {/* Tab: Books Management */}
      {activeTab === 'books' && (
        <BooksManagement onUpdate={refreshData} />
      )}

      {/* Tab: Pending Translations Management */}
      {activeTab === 'translations' && (
        <TranslationsManagement 
          fatwas={fatwas} 
          news={news} 
          onRefreshData={refreshData} 
        />
      )}

      {/* Tab 5: Site Settings */}
      {activeTab === 'settings' && (
        <form onSubmit={handleSaveSettings} className="bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-6 font-urdu">
          <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">ویب سائٹ سیٹنگز و رابطہ معلومات</h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div>
              <label className="block font-bold mb-1">جامعہ کا نام (اردو)</label>
              <input type="text" value={settings?.jamiaNameUrdu || ''} onChange={(e) => setSettings(prev => ({...prev, jamiaNameUrdu: e.target.value}))} className="w-full p-2 border rounded" />
            </div>
            <div>
              <label className="block font-bold mb-1">جامعہ کا نام (English)</label>
              <input type="text" value={settings?.jamiaNameEnglish || ''} onChange={(e) => setSettings(prev => ({...prev, jamiaNameEnglish: e.target.value}))} className="w-full p-2 border rounded font-sans" />
            </div>
            <div>
              <label className="block font-bold mb-1">جامعہ کا نام (عربی)</label>
              <input type="text" value={settings?.jamiaNameArabic || ''} onChange={(e) => setSettings(prev => ({...prev, jamiaNameArabic: e.target.value}))} className="w-full p-2 border rounded font-arabic" />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div>
              <label className="block font-bold mb-1">فون نمبر (موبائل)</label>
              <input type="text" value={settings?.phonePrimary || ''} onChange={(e) => setSettings(prev => ({...prev, phonePrimary: e.target.value}))} className="w-full p-2 border rounded font-mono" />
            </div>
            <div>
              <label className="block font-bold mb-1">واٹس ایپ نمبر (رسیدیں وصول کرنے کے لیے)</label>
              <input type="text" value={settings?.whatsappNumber || ''} onChange={(e) => setSettings(prev => ({...prev, whatsappNumber: e.target.value}))} placeholder="+923000000000" className="w-full p-2 border rounded font-mono" />
            </div>
            <div>
              <label className="block font-bold mb-1">ای میل ایڈریس</label>
              <input type="email" value={settings?.email || ''} onChange={(e) => setSettings(prev => ({...prev, email: e.target.value}))} className="w-full p-2 border rounded font-mono" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold mb-1">مرکزی پتہ (Address)</label>
            <input type="text" value={settings?.address || ''} onChange={(e) => setSettings(prev => ({...prev, address: e.target.value}))} className="w-full p-2 text-xs border rounded" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block font-bold mb-1">رجسٹریشن نمبر (Registration No)</label>
              <input 
                type="text" 
                value={settings?.registrationNumber || '1454/5/5183'} 
                onChange={(e) => setSettings(prev => ({...prev, registrationNumber: e.target.value}))} 
                placeholder="1454/5/5183" 
                className="w-full p-2 border rounded font-mono" 
              />
            </div>
            <div>
              <label className="block font-bold mb-1">الحاق نمبر وفاق المدارس (Affiliation No)</label>
              <input 
                type="text" 
                value={settings?.affiliationNumber || '08-04-09345'} 
                onChange={(e) => setSettings(prev => ({...prev, affiliationNumber: e.target.value}))} 
                placeholder="08-04-09345" 
                className="w-full p-2 border rounded font-mono" 
              />
            </div>
          </div>

          {/* Notifications & Admin Alerts Settings */}
          <div className="pt-4 border-t border-slate-200 dark:border-slate-800 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-[#5C4632] dark:text-amber-300 font-urdu">
                مربوط الرٹس و نوٹیفکیشن سسٹم (فتاویٰ، داخلہ و آن لائن اکیڈمی)
              </h3>
              <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 font-sans font-bold">
                Cloudflare Ready
              </span>
            </div>
            <p className="text-xs text-stone-600 dark:text-stone-300">
              جب کوئی سائل فتویٰ پوچھے، آن لائن داخلہ فارم پر کرے یا ۳ روزہ ٹرائل کلاس کے لیے درخواست دے تو خودکار نوٹیفکیشن درج ذیل ای میل اور واٹس ایپ پر ارسال ہوں گے:
            </p>

            <div className="p-4 bg-emerald-50/40 dark:bg-slate-800/40 rounded-2xl border border-emerald-200 dark:border-slate-700 space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold mb-1 text-stone-800 dark:text-stone-200">
                    ایڈمن نوٹیفکیشن ای میل (Alerts Email) *
                  </label>
                  <input 
                    type="email" 
                    value={settings?.notificationEmail || ''} 
                    onChange={(e) => setSettings(prev => ({...prev, notificationEmail: e.target.value}))} 
                    placeholder="usamasiddique105@gmail.com" 
                    className="w-full p-2.5 border rounded-lg font-mono bg-white dark:bg-slate-900 focus:outline-none focus:border-emerald-600" 
                  />
                  <span className="text-[10px] text-stone-500">اس ای میل پر تمام فتاویٰ و داخلہ فارمز کی فوری نقل بذریعہ ای میل موصول ہوگی۔</span>
                </div>

                <div>
                  <label className="block font-bold mb-1 text-stone-800 dark:text-stone-200">
                    ایڈمن واٹس ایپ نمبر (Admin WhatsApp Number) *
                  </label>
                  <input 
                    type="text" 
                    value={settings?.notificationWhatsApp || ''} 
                    onChange={(e) => setSettings(prev => ({...prev, notificationWhatsApp: e.target.value}))} 
                    placeholder="03489002496 یا 923489002496" 
                    className="w-full p-2.5 border rounded-lg font-mono bg-white dark:bg-slate-900 focus:outline-none focus:border-emerald-600" 
                  />
                  <span className="text-[10px] text-stone-500">فارم جمع ہوتے ہی سائل اور ایڈمن کے لیے ون کلک واٹس ایپ لنک تیار ہوگا۔</span>
                </div>
              </div>

              <div>
                <label className="block font-bold mb-1 text-stone-800 dark:text-stone-200">
                  اختیاری کلاؤڈ فلیئر ورکر / کسٹم ویب ہک یو آر ایل (Custom Webhook / Cloudflare Worker URL)
                </label>
                <input 
                  type="url" 
                  value={settings?.webhookUrl || ''} 
                  onChange={(e) => setSettings(prev => ({...prev, webhookUrl: e.target.value}))} 
                  placeholder="https://my-worker.myname.workers.dev (اختیاری)" 
                  className="w-full p-2.5 border rounded-lg font-mono bg-white dark:bg-slate-900 focus:outline-none focus:border-emerald-600" 
                />
              </div>

              <div className="flex flex-wrap items-center gap-6 pt-1">
                <label className="inline-flex items-center gap-2 cursor-pointer">
                  <input 
                    type="checkbox" 
                    checked={settings?.enableEmailNotifications !== false} 
                    onChange={(e) => setSettings(prev => ({...prev, enableEmailNotifications: e.target.checked}))} 
                    className="rounded text-emerald-600 w-4 h-4"
                  />
                  <span className="font-bold text-stone-700 dark:text-stone-200">ای میل الرٹس فعال رکھیں</span>
                </label>

                <label className="inline-flex items-center gap-2 cursor-pointer">
                  <input 
                    type="checkbox" 
                    checked={settings?.enableWhatsAppNotifications !== false} 
                    onChange={(e) => setSettings(prev => ({...prev, enableWhatsAppNotifications: e.target.checked}))} 
                    className="rounded text-emerald-600 w-4 h-4"
                  />
                  <span className="font-bold text-stone-700 dark:text-stone-200">واٹس ایپ نوٹیفکیشن لنکس فعال رکھیں</span>
                </label>
              </div>
            </div>
          </div>

          {/* Gemini AI Translation Settings */}
          <div className="pt-4 border-t border-slate-200 dark:border-slate-800 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-[#5C4632] dark:text-amber-300 font-urdu flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                <span>گوگل جیمینائی اے آئی خودکار ترجمہ سیٹنگز (Gemini AI Translation Settings)</span>
              </h3>
              <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300 font-sans font-bold">
                Auto Translation
              </span>
            </div>
            <p className="text-xs text-stone-600 dark:text-stone-300">
              فتاویٰ اور مضامین کے انگریزی و عربی میں خودکار ترجمہ کے لیے اپنی مفت Google Gemini API Key یہاں درج کریں (یا Cloudflare Pages Settings میں GEMINI_API_KEY شامل کریں):
            </p>

            <div className="p-4 bg-purple-50/40 dark:bg-slate-800/40 rounded-2xl border border-purple-200 dark:border-slate-700 space-y-3 text-xs">
              <div>
                <label className="block font-bold mb-1 text-stone-800 dark:text-stone-200">
                  گوگل جیمینائی اے آئی کی (Google Gemini API Key)
                </label>
                <input 
                  type="password" 
                  value={settings?.geminiApiKey || ''} 
                  onChange={(e) => setSettings(prev => ({...prev, geminiApiKey: e.target.value}))} 
                  placeholder="AIzaSy..." 
                  className="w-full p-2.5 border rounded-lg font-mono bg-white dark:bg-slate-900 focus:outline-none focus:border-purple-600" 
                />
                <span className="text-[10px] text-stone-500 mt-1 block">
                  اگر آپ نے Cloudflare Pages میں GEMINI_API_KEY شامل نہیں کیا، تو آپ اپنی Google AI Studio کی مفت Key یہاں درج کر کے نیچے "تبدیلیاں محفوظ کریں" پر کلک کر سکتے ہیں۔
                </span>
              </div>
            </div>
          </div>

          {/* Bank Accounts Section in Admin */}
          <div className="pt-4 border-t border-slate-200 dark:border-slate-800 space-y-4">
            <h3 className="text-base font-bold text-[#5C4632] dark:text-amber-300 font-urdu">
              بینک و آن لائن اکاؤنٹس تفصیلات (عطیات کے لیے)
            </h3>

            {/* Meezan Bank Settings */}
            <div className="p-4 bg-amber-50/50 dark:bg-slate-800/50 rounded-2xl border border-amber-200 dark:border-slate-700 space-y-3">
              <h4 className="font-bold text-sm text-emerald-900 dark:text-emerald-300 font-urdu">میزان بینک (Meezan Bank)</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 text-xs">
                <div>
                  <label className="block font-bold mb-1">اکاؤنٹ ٹائٹل (Title)</label>
                  <input 
                    type="text" 
                    value={settings?.bankDetails?.meezanBank?.title || ''} 
                    onChange={(e) => setSettings(prev => ({
                      ...prev, 
                      bankDetails: {
                        ...(prev?.bankDetails || {}), 
                        meezanBank: { ...(prev?.bankDetails?.meezanBank || {} as any), title: e.target.value }
                      } as any
                    }))} 
                    className="w-full p-2 border rounded bg-white dark:bg-slate-900" 
                  />
                </div>
                <div>
                  <label className="block font-bold mb-1">اکاؤنٹ نمبر (Account No)</label>
                  <input 
                    type="text" 
                    value={settings?.bankDetails?.meezanBank?.accountNo || ''} 
                    onChange={(e) => setSettings(prev => ({
                      ...prev, 
                      bankDetails: {
                        ...(prev?.bankDetails || {}), 
                        meezanBank: { ...(prev?.bankDetails?.meezanBank || {} as any), accountNo: e.target.value }
                      } as any
                    }))} 
                    placeholder="01020104859201"
                    className="w-full p-2 border rounded font-mono bg-white dark:bg-slate-900" 
                  />
                </div>
                <div>
                  <label className="block font-bold mb-1">آئی بی اے این (IBAN)</label>
                  <input 
                    type="text" 
                    value={settings?.bankDetails?.meezanBank?.iban || ''} 
                    onChange={(e) => setSettings(prev => ({
                      ...prev, 
                      bankDetails: {
                        ...(prev?.bankDetails || {}), 
                        meezanBank: { ...(prev?.bankDetails?.meezanBank || {} as any), iban: e.target.value }
                      } as any
                    }))} 
                    placeholder="PK36MEZN0001020104859201"
                    className="w-full p-2 border rounded font-mono bg-white dark:bg-slate-900" 
                  />
                </div>
                <div>
                  <label className="block font-bold mb-1">برانچ نام (Branch Name)</label>
                  <input 
                    type="text" 
                    value={settings?.bankDetails?.meezanBank?.branch || ''} 
                    onChange={(e) => setSettings(prev => ({
                      ...prev, 
                      bankDetails: {
                        ...(prev?.bankDetails || {}), 
                        meezanBank: { ...(prev?.bankDetails?.meezanBank || {} as any), branch: e.target.value }
                      } as any
                    }))} 
                    placeholder="Abbottabad Branch"
                    className="w-full p-2 border rounded bg-white dark:bg-slate-900" 
                  />
                </div>
                <div>
                  <label className="block font-bold mb-1">سوئفٹ کوڈ (Swift Code - optional)</label>
                  <input 
                    type="text" 
                    value={settings?.bankDetails?.meezanBank?.swift || ''} 
                    onChange={(e) => setSettings(prev => ({
                      ...prev, 
                      bankDetails: {
                        ...(prev?.bankDetails || {}), 
                        meezanBank: { ...(prev?.bankDetails?.meezanBank || {} as any), swift: e.target.value }
                      } as any
                    }))} 
                    placeholder="MEZNPKKA"
                    className="w-full p-2 border rounded font-mono bg-white dark:bg-slate-900" 
                  />
                </div>
              </div>
            </div>

            {/* Easypaisa & JazzCash Settings */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              {/* Easypaisa */}
              <div className="p-4 bg-emerald-50/50 dark:bg-slate-800/50 rounded-2xl border border-emerald-200 dark:border-slate-700 space-y-3">
                <h4 className="font-bold text-sm text-emerald-900 dark:text-emerald-300 font-urdu">ایزی پیسہ (Easypaisa)</h4>
                <div>
                  <label className="block font-bold mb-1">اکاؤنٹ ٹائٹل (Title)</label>
                  <input 
                    type="text" 
                    value={settings?.bankDetails?.easyPaisa?.title || ''} 
                    onChange={(e) => setSettings(prev => ({
                      ...prev, 
                      bankDetails: {
                        ...(prev?.bankDetails || {}), 
                        easyPaisa: { ...(prev?.bankDetails?.easyPaisa || {} as any), title: e.target.value }
                      } as any
                    }))} 
                    className="w-full p-2 border rounded bg-white dark:bg-slate-900" 
                  />
                </div>
                <div>
                  <label className="block font-bold mb-1">ایزی پیسہ نمبر (Mobile Number)</label>
                  <input 
                    type="text" 
                    value={settings?.bankDetails?.easyPaisa?.number || ''} 
                    onChange={(e) => setSettings(prev => ({
                      ...prev, 
                      bankDetails: {
                        ...(prev?.bankDetails || {}), 
                        easyPaisa: { ...(prev?.bankDetails?.easyPaisa || {} as any), number: e.target.value }
                      } as any
                    }))} 
                    placeholder="03000000000"
                    className="w-full p-2 border rounded font-mono bg-white dark:bg-slate-900" 
                  />
                </div>
              </div>

              {/* JazzCash */}
              <div className="p-4 bg-amber-50/50 dark:bg-slate-800/50 rounded-2xl border border-amber-200 dark:border-slate-700 space-y-3">
                <h4 className="font-bold text-sm text-amber-900 dark:text-amber-300 font-urdu">جاز کیش (JazzCash)</h4>
                <div>
                  <label className="block font-bold mb-1">اکاؤنٹ ٹائٹل (Title)</label>
                  <input 
                    type="text" 
                    value={settings?.bankDetails?.jazzCash?.title || ''} 
                    onChange={(e) => setSettings(prev => ({
                      ...prev, 
                      bankDetails: {
                        ...(prev?.bankDetails || {}), 
                        jazzCash: { ...(prev?.bankDetails?.jazzCash || {} as any), title: e.target.value }
                      } as any
                    }))} 
                    className="w-full p-2 border rounded bg-white dark:bg-slate-900" 
                  />
                </div>
                <div>
                  <label className="block font-bold mb-1">جاز کیش نمبر (Mobile Number)</label>
                  <input 
                    type="text" 
                    value={settings?.bankDetails?.jazzCash?.number || ''} 
                    onChange={(e) => setSettings(prev => ({
                      ...prev, 
                      bankDetails: {
                        ...(prev?.bankDetails || {}), 
                        jazzCash: { ...(prev?.bankDetails?.jazzCash || {} as any), number: e.target.value }
                      } as any
                    }))} 
                    placeholder="03000000000"
                    className="w-full p-2 border rounded font-mono bg-white dark:bg-slate-900" 
                  />
                </div>
              </div>
            </div>

            {/* Firebase Auth Admin Account Card */}
            <div className="p-5 bg-amber-50/60 dark:bg-slate-800/80 rounded-2xl border-2 border-amber-300 dark:border-amber-700/60 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Key className="w-5 h-5 text-[#B88A3B]" />
                  <h4 className="font-bold text-sm text-[#5C4632] dark:text-amber-300 font-urdu">
                    ایڈمن سیکیورٹی و پاس ورڈ تبدیلی (Admin Security & Password)
                  </h4>
                </div>
                <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-900 dark:bg-emerald-950 dark:text-emerald-300 font-bold">
                  Cloudflare D1 Auth
                </span>
              </div>

              <p className="text-xs text-stone-600 dark:text-stone-300">
                ایڈمن پورٹل اب مکمل طور پر کلاؤڈ فلیئر D1 ڈیٹا بیس اور PBKDF2 اینکرپشن سے محفوظ ہے۔ آپ اپنے لاگ ان شدہ اکاؤنٹ ({currentUser?.email || 'admin'}) کا پاس ورڈ تبدیل کر سکتے ہیں:
              </p>

              {settingsResetSuccess && (
                <div className="p-3 rounded-xl bg-emerald-100 dark:bg-emerald-950 border border-emerald-300 dark:border-emerald-800 text-emerald-900 dark:text-emerald-200 text-xs font-bold text-center">
                  {settingsResetSuccess}
                </div>
              )}

              {settingsResetError && (
                <div className="p-3 rounded-xl bg-red-100 dark:bg-red-950 border border-red-300 dark:border-red-800 text-red-900 dark:text-red-200 text-xs font-bold text-center">
                  {settingsResetError}
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                <input
                  type="password"
                  placeholder="موجودہ پاس ورڈ (Current Password)"
                  value={currentPasswordInput}
                  onChange={(e) => setCurrentPasswordInput(e.target.value)}
                  className="px-3.5 py-2 text-xs bg-white dark:bg-slate-900 border border-stone-300 dark:border-slate-700 rounded-xl"
                />
                <input
                  type="password"
                  placeholder="نیا پاس ورڈ (New Password)"
                  value={newPasswordInput}
                  onChange={(e) => setNewPasswordInput(e.target.value)}
                  className="px-3.5 py-2 text-xs bg-white dark:bg-slate-900 border border-stone-300 dark:border-slate-700 rounded-xl"
                />
              </div>

              <div className="flex items-center justify-between gap-4 pt-1">
                <div className="text-xs text-stone-600 dark:text-stone-400">
                  موجودہ لاگ ان اکاؤنٹ: <span className="font-mono font-bold text-stone-800 dark:text-stone-200">{currentUser?.email || 'admin@jamiaislamia.edu.pk'}</span>
                </div>
                <button
                  type="button"
                  onClick={async () => {
                    setSettingsResetError('');
                    setSettingsResetSuccess('');
                    if (!newPasswordInput || newPasswordInput.length < 6) {
                      setSettingsResetError('نیا پاس ورڈ کم از کم ۶ حروف پر مشتمل ہونا چاہیے۔');
                      return;
                    }
                    try {
                      const res = await apiFetch('/api/auth/change-password', {
                        method: 'POST',
                        body: JSON.stringify({
                          currentPassword: currentPasswordInput,
                          newPassword: newPasswordInput,
                        }),
                      });
                      if (res && res.success) {
                        setSettingsResetSuccess('پاس ورڈ کامیابی سے تبدیل کر دیا گیا ہے۔');
                        setCurrentPasswordInput('');
                        setNewPasswordInput('');
                      } else {
                        setSettingsResetError(res?.error || 'پاس ورڈ تبدیل کرنے میں خرابی پیش آئی۔');
                      }
                    } catch (err: any) {
                      setSettingsResetError('خرابی: ' + (err?.message || 'نامعلوم'));
                    }
                  }}
                  className="px-5 py-2.5 bg-[#5C4632] hover:bg-[#433123] text-amber-300 text-xs font-bold rounded-xl border border-[#B88A3B] transition-all flex items-center gap-2 cursor-pointer shadow-xs"
                >
                  <Key className="w-3.5 h-3.5" />
                  <span>پاس ورڈ تبدیل کریں (Update Password)</span>
                </button>
              </div>
            </div>

            {/* Complete Data Backup & Restore (کلاؤڈ فلیئر و مکمل ڈیٹا بیک اپ) */}
            <div className="p-5 bg-stone-100/70 dark:bg-slate-800/60 rounded-2xl border border-stone-300 dark:border-slate-700 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Database className="w-5 h-5 text-[#B88A3B]" />
                  <h4 className="font-bold text-sm text-[#5C4632] dark:text-amber-300 font-urdu">
                    جامعہ اسلامیہ ڈیٹا بیس کا مکمل بیک اپ اور بحالی (Backup & Restore)
                  </h4>
                </div>
                <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-900 dark:bg-amber-950 dark:text-amber-300 font-bold">
                  محفوظ ڈیٹا فائل (JSON)
                </span>
              </div>
              
              <p className="text-xs text-stone-600 dark:text-stone-300">
                یہاں سے آپ تمام فتاویٰ، سائلین کے سوالات، داخلہ فارمز، امتحانی نتائج، کتب، خبریں، عطیات اور سیٹنگز پر مشتمل مکمل ڈیٹا کی سنگل فائل ڈاؤن لوڈ کر سکتے ہیں اور بوقت ضرورت ایک کلک میں بحال (Restore) کر سکتے ہیں:
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                {/* Export Button */}
                <button
                  type="button"
                  onClick={handleExportFullBackup}
                  className="p-3 bg-white dark:bg-slate-900 hover:bg-amber-50 dark:hover:bg-slate-800 border border-amber-300 dark:border-slate-700 rounded-xl text-xs font-bold text-[#5C4632] dark:text-amber-300 flex items-center justify-center gap-2 transition-all shadow-sm cursor-pointer"
                >
                  <Download className="w-4 h-4 text-emerald-600" />
                  <span>تمام ڈیٹا کا بیک اپ ڈاؤن لوڈ کریں (Download Backup)</span>
                </button>

                {/* Import/Restore Button */}
                <label className="p-3 bg-white dark:bg-slate-900 hover:bg-blue-50 dark:hover:bg-slate-800 border border-blue-300 dark:border-slate-700 rounded-xl text-xs font-bold text-[#5C4632] dark:text-blue-300 flex items-center justify-center gap-2 transition-all shadow-sm cursor-pointer">
                  <Upload className="w-4 h-4 text-blue-600" />
                  <span>بیک اپ فائل اپلوڈ و بحال کریں (Restore Backup)</span>
                  <input
                    type="file"
                    accept=".json"
                    onChange={handleImportFullBackup}
                    className="hidden"
                  />
                </label>
              </div>
            </div>

          </div>

          <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
            <button 
              type="button" 
              onClick={handleResetData} 
              className="px-4 py-2 bg-stone-200 dark:bg-slate-800 hover:bg-red-100 dark:hover:bg-red-950 text-stone-700 dark:text-stone-300 hover:text-red-700 dark:hover:text-red-300 text-xs rounded-xl font-bold transition-colors"
            >
              ابتدائی ڈیٹا پر ری سیٹ کریں (Reset to Defaults)
            </button>
            <button type="submit" className="px-6 py-2.5 bg-emerald-800 hover:bg-emerald-900 text-amber-200 font-bold text-xs rounded-xl shadow-md flex items-center gap-2 cursor-pointer transition-all">
              <Save className="w-4 h-4" />
              <span>سیٹنگز محفوظ کریں (Save Settings)</span>
            </button>
          </div>
        </form>
      )}

      {/* Donations Log */}
      {activeTab === 'donations' && (
        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-4 font-urdu">
          <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">عطیات کا ریکارڈ</h2>

          <div className="space-y-2">
            {donations.map(d => (
              <div key={d.id} className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 flex justify-between items-center text-xs">
                <div>
                  <div className="font-bold text-slate-900 dark:text-slate-100">{d.donorName} ({d.fundType})</div>
                  <div className="text-slate-500 font-mono">{d.date} • {d.paymentMethod}</div>
                </div>
                <div className="font-mono font-bold text-emerald-800 dark:text-emerald-400 text-sm">
                  {d.currency} {d.amount.toLocaleString()}
                </div>
              </div>
            ))}

            {donations.length === 0 && (
              <div className="text-center py-12 bg-stone-50 dark:bg-slate-800/40 rounded-2xl border border-dashed border-stone-300 dark:border-slate-700">
                <Heart className="w-12 h-12 mx-auto text-stone-400 mb-2" />
                <p className="text-sm font-bold text-stone-600 dark:text-stone-300">کوئی عطیہ ریکارڈ موجود نہیں ہے۔</p>
                <p className="text-xs text-stone-400 mt-1">جب کوئی عطیہ دہندہ رسید یا فارم جمع کرے گا تو وہ یہاں دکھائی دے گا۔</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Tab: Real Site Visitors & Traffic Analytics (ناظرین و زائرین کی حقیقی تفصیلات) */}
      {activeTab === 'visitors' && (() => {
        const todayStr = new Date().toISOString().split('T')[0];
        const sevenDaysAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
        const thirtyDaysAgo = Date.now() - 30 * 24 * 60 * 60 * 1000;

        const getPageNameUrdu = (pageKey: string) => {
          const map: Record<string, string> = {
            'home': 'صفحہ اول (Homepage)',
            'fatwa-archive': 'دارالافتاء و فتاویٰ آرکائیو',
            'fatwas': 'دارالافتاء و فتاویٰ آرکائیو',
            'online-services': 'آن لائن داخلہ و کلاس بکنگ',
            'online-admission': 'آن لائن داخلہ و کلاس بکنگ',
            'exam-results': 'امتحانی نتائج پورٹل',
            'results': 'امتحانی نتائج پورٹل',
            'library': 'ڈیجیٹل کتب خانہ و رسالہ',
            'books': 'ڈیجیٹل کتب خانہ و رسالہ',
            'departments': 'تعلیمی شعبہ جات',
            'faculty': 'شیوخ و اساتذہ کرام',
            'about': 'تعارف جامعہ اسلامیہ',
            'donations': 'آن لائن عطیات و زکوٰۃ',
            'news': 'خبریں و اعلانات',
            'contact': 'رابطہ و نقشہ'
          };
          return map[pageKey] || pageKey;
        };

        const getCountryFlagEmoji = (code?: string) => {
          if (!code) return '🌐';
          const c = code.toUpperCase();
          const flags: Record<string, string> = {
            PK: '🇵🇰',
            SA: '🇸🇦',
            AE: '🇦🇪',
            GB: '🇬🇧',
            US: '🇺🇸',
            CA: '🇨🇦',
            IN: '🇮🇳',
            BD: '🇧🇩',
            TR: '🇹🇷',
            QA: '🇶🇦',
            KW: '🇰🇼',
            OM: '🇴🇲',
            BH: '🇧🇭',
            DE: '🇩🇪',
            FR: '🇫🇷',
            AU: '🇦🇺',
            MY: '🇲🇾',
            ZA: '🇿🇦'
          };
          return flags[c] || '🌐';
        };

        // Time Filtered
        let timeFiltered = visitors;
        if (visitorTimeFilter === 'daily') {
          timeFiltered = visitors.filter(v => v.date === todayStr);
        } else if (visitorTimeFilter === 'weekly') {
          timeFiltered = visitors.filter(v => new Date(v.timestamp).getTime() >= sevenDaysAgo);
        } else if (visitorTimeFilter === 'monthly') {
          timeFiltered = visitors.filter(v => new Date(v.timestamp).getTime() >= thirtyDaysAgo);
        }

        // Search & Country Filtered
        const filteredVisitors = timeFiltered.filter(v => {
          if (visitorCountryFilter !== 'all' && v.country !== visitorCountryFilter && v.countryCode !== visitorCountryFilter) {
            return false;
          }
          if (visitorSearch.trim()) {
            const q = visitorSearch.toLowerCase();
            const match = 
              (v.country && v.country.toLowerCase().includes(q)) ||
              (v.city && v.city.toLowerCase().includes(q)) ||
              (v.page && v.page.toLowerCase().includes(q)) ||
              (v.deviceType && v.deviceType.toLowerCase().includes(q)) ||
              (v.browser && v.browser.toLowerCase().includes(q)) ||
              (v.os && v.os.toLowerCase().includes(q)) ||
              (v.date && v.date.includes(q)) ||
              (v.referrer && v.referrer.toLowerCase().includes(q));
            if (!match) return false;
          }
          return true;
        });

        // Aggregations
        const todayCount = visitors.filter(v => v.date === todayStr).length;
        const weekCount = visitors.filter(v => new Date(v.timestamp).getTime() >= sevenDaysAgo).length;
        const monthCount = visitors.filter(v => new Date(v.timestamp).getTime() >= thirtyDaysAgo).length;
        const totalCount = visitors.length;

        const uniqueSessions = new Set(timeFiltered.map(v => v.sessionId)).size;
        
        // Country counts
        const countryMap: Record<string, { count: number; flag: string; countryCode: string }> = {};
        timeFiltered.forEach(v => {
          const name = v.country || 'پاکستان (Pakistan)';
          if (!countryMap[name]) {
            countryMap[name] = { count: 0, flag: getCountryFlagEmoji(v.countryCode), countryCode: v.countryCode || 'PK' };
          }
          countryMap[name].count += 1;
        });
        const countryList = Object.entries(countryMap).sort((a, b) => b[1].count - a[1].count);

        // Device counts
        const mobileCount = timeFiltered.filter(v => v.deviceType === 'Mobile').length;
        const desktopCount = timeFiltered.filter(v => v.deviceType === 'Desktop').length;
        const tabletCount = timeFiltered.filter(v => v.deviceType === 'Tablet').length;
        const mobilePct = timeFiltered.length > 0 ? Math.round((mobileCount / timeFiltered.length) * 100) : 0;
        const desktopPct = timeFiltered.length > 0 ? Math.round((desktopCount / timeFiltered.length) * 100) : 0;

        // Top pages
        const pageMap: Record<string, number> = {};
        timeFiltered.forEach(v => {
          const p = v.page || 'home';
          pageMap[p] = (pageMap[p] || 0) + 1;
        });
        const pageList = Object.entries(pageMap).sort((a, b) => b[1] - a[1]);

        return (
          <div className="space-y-6 font-urdu">
            {/* Header with Live Signal & Actions */}
            <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-wrap items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-3">
                  <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                    <Activity className="w-6 h-6 text-emerald-600 animate-pulse" />
                    <span>حقیقی ناظرین و زائرین اینالیٹکس (Real-Time Website Visitors)</span>
                  </h2>
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
                    <span>لائیو ریکارڈنگ چالو ہے</span>
                  </span>
                </div>
                <p className="text-xs text-slate-500">
                  جامعہ اسلامیہ کی ویب سائٹ پر آنے والے حقیقی افراد، ممالک، شہر، ڈیوائس اور دیکھے گئے صفحات کی شفاف فہرست
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => refreshData()}
                  className="px-4 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 rounded-xl text-xs font-bold flex items-center gap-2 transition-colors"
                  title="تازہ ترین ناظرین کا ریکارڈ لائیں"
                >
                  <RefreshCw className="w-4 h-4 text-emerald-600" />
                  <span>تازہ ریکارڈ دیکھیں</span>
                </button>
                {visitors.length > 0 && (
                  <button
                    onClick={async () => {
                      if (window.confirm('کیا آپ تمام ناظرین کا لاگ صاف کرنا چاہتے ہیں؟')) {
                        try {
                          await StorageService.clearVisitors();
                          refreshData();
                        } catch (err: any) {
                          alert('لاگ صاف کرنے میں سرور پر خرابی پیش آئی: ' + (err?.message || 'نامعلوم خرابی'));
                        }
                      }
                    }}
                    className="px-3 py-2 bg-red-50 dark:bg-red-950/40 text-red-700 dark:text-red-300 hover:bg-red-100 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors"
                    title="لاگز صاف کریں"
                  >
                    <Trash2 className="w-4 h-4" />
                    <span>لاگ خالی کریں</span>
                  </button>
                )}
              </div>
            </div>

            {/* Time Filter Tabs: Daily (یومیہ), Weekly (ہفتہ وار), Monthly (ماہانہ), All (کل) */}
            <div className="bg-stone-50 dark:bg-slate-800/60 p-2 rounded-2xl border border-stone-200 dark:border-slate-700 grid grid-cols-2 sm:grid-cols-4 gap-2">
              <button
                onClick={() => setVisitorTimeFilter('daily')}
                className={`py-3 px-4 rounded-xl text-xs font-bold transition-all flex flex-col items-center gap-1 ${
                  visitorTimeFilter === 'daily'
                    ? 'bg-emerald-700 text-white shadow-md'
                    : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:bg-emerald-50 dark:hover:bg-slate-800'
                }`}
              >
                <div className="flex items-center gap-1.5">
                  <Calendar className="w-4 h-4" />
                  <span>آج کے زائرین (یومیہ - Daily)</span>
                </div>
                <span className="font-mono text-base font-black">
                  {todayCount} <span className="text-[10px] font-normal opacity-80">افراد</span>
                </span>
              </button>

              <button
                onClick={() => setVisitorTimeFilter('weekly')}
                className={`py-3 px-4 rounded-xl text-xs font-bold transition-all flex flex-col items-center gap-1 ${
                  visitorTimeFilter === 'weekly'
                    ? 'bg-emerald-700 text-white shadow-md'
                    : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:bg-emerald-50 dark:hover:bg-slate-800'
                }`}
              >
                <div className="flex items-center gap-1.5">
                  <TrendingUp className="w-4 h-4" />
                  <span>گزشتہ 7 دن (ہفتہ وار - Weekly)</span>
                </div>
                <span className="font-mono text-base font-black">
                  {weekCount} <span className="text-[10px] font-normal opacity-80">افراد</span>
                </span>
              </button>

              <button
                onClick={() => setVisitorTimeFilter('monthly')}
                className={`py-3 px-4 rounded-xl text-xs font-bold transition-all flex flex-col items-center gap-1 ${
                  visitorTimeFilter === 'monthly'
                    ? 'bg-emerald-700 text-white shadow-md'
                    : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:bg-emerald-50 dark:hover:bg-slate-800'
                }`}
              >
                <div className="flex items-center gap-1.5">
                  <BarChart3 className="w-4 h-4" />
                  <span>گزشتہ 30 دن (ماہانہ - Monthly)</span>
                </div>
                <span className="font-mono text-base font-black">
                  {monthCount} <span className="text-[10px] font-normal opacity-80">افراد</span>
                </span>
              </button>

              <button
                onClick={() => setVisitorTimeFilter('all')}
                className={`py-3 px-4 rounded-xl text-xs font-bold transition-all flex flex-col items-center gap-1 ${
                  visitorTimeFilter === 'all'
                    ? 'bg-emerald-700 text-white shadow-md'
                    : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:bg-emerald-50 dark:hover:bg-slate-800'
                }`}
              >
                <div className="flex items-center gap-1.5">
                  <Globe className="w-4 h-4" />
                  <span>تمام ریکارڈز (All Time)</span>
                </div>
                <span className="font-mono text-base font-black">
                  {totalCount} <span className="text-[10px] font-normal opacity-80">کل اندراج</span>
                </span>
              </button>
            </div>

            {/* 4 Summary Metric Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-2">
                <div className="text-xs text-slate-500 font-urdu flex items-center justify-between">
                  <span>منتخب مدت کے کل زائرین:</span>
                  <Activity className="w-4 h-4 text-emerald-600" />
                </div>
                <div className="text-3xl font-mono font-bold text-emerald-700 dark:text-emerald-400">
                  {timeFiltered.length}
                </div>
                <div className="text-[11px] text-slate-500">
                  {visitorTimeFilter === 'daily' && 'آج 24 گھنٹوں کے دوران کل مناظر'}
                  {visitorTimeFilter === 'weekly' && 'پچھلے 7 دنوں کے دوران کل وزٹس'}
                  {visitorTimeFilter === 'monthly' && 'پچھلے 30 دنوں کے دوران کل وزٹس'}
                  {visitorTimeFilter === 'all' && 'ویب سائٹ کے آغاز سے اب تک'}
                </div>
              </div>

              <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-2">
                <div className="text-xs text-slate-500 font-urdu flex items-center justify-between">
                  <span>منفرد زائرین (Unique Sessions):</span>
                  <Users className="w-4 h-4 text-blue-600" />
                </div>
                <div className="text-3xl font-mono font-bold text-blue-600">
                  {uniqueSessions}
                </div>
                <div className="text-[11px] text-slate-500">
                  مختلف افراد جنہوں نے ویب سائٹ کھولی
                </div>
              </div>

              <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-2">
                <div className="text-xs text-slate-500 font-urdu flex items-center justify-between">
                  <span>فعال ممالک (Active Countries):</span>
                  <Globe className="w-4 h-4 text-amber-600" />
                </div>
                <div className="text-3xl font-mono font-bold text-amber-600">
                  {countryList.length}
                </div>
                <div className="text-[11px] text-slate-500 truncate">
                  {countryList.slice(0, 3).map(c => `${c[1].flag} ${c[0].split(' ')[0]}`).join(' ، ') || 'پاکستان'}
                </div>
              </div>

              <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-2">
                <div className="text-xs text-slate-500 font-urdu flex items-center justify-between">
                  <span>موبائل بمقابلہ کمپیوٹر:</span>
                  <Smartphone className="w-4 h-4 text-purple-600" />
                </div>
                <div className="flex items-center gap-3">
                  <div>
                    <span className="text-2xl font-mono font-bold text-purple-700 dark:text-purple-400">{mobilePct}%</span>
                    <span className="text-[11px] text-slate-500 block">موبائل ({mobileCount})</span>
                  </div>
                  <div className="border-r border-slate-200 dark:border-slate-700 h-8"></div>
                  <div>
                    <span className="text-2xl font-mono font-bold text-slate-700 dark:text-slate-300">{desktopPct}%</span>
                    <span className="text-[11px] text-slate-500 block">کمپیوٹر ({desktopCount})</span>
                  </div>
                </div>
              </div>
            </div>

            {/* 2-Column Analytics: Countries & Top Sections */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Countries Breakdown */}
              <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2 text-sm">
                    <MapPin className="w-4 h-4 text-emerald-600" />
                    <span>ممالک کی بنیاد پر ناظرین (Visitors by Country)</span>
                  </h3>
                  {visitorCountryFilter !== 'all' && (
                    <button
                      onClick={() => setVisitorCountryFilter('all')}
                      className="text-[11px] text-emerald-600 hover:underline"
                    >
                      تمام ممالک دکھائیں ✕
                    </button>
                  )}
                </div>

                <div className="space-y-2.5">
                  {countryList.map(([countryName, info]) => {
                    const pct = timeFiltered.length > 0 ? Math.round((info.count / timeFiltered.length) * 100) : 0;
                    const isSelected = visitorCountryFilter === countryName;
                    return (
                      <div
                        key={countryName}
                        onClick={() => setVisitorCountryFilter(isSelected ? 'all' : countryName)}
                        className={`p-3 rounded-xl border transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-500'
                            : 'border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50'
                        }`}
                      >
                        <div className="flex items-center justify-between text-xs mb-1.5">
                          <div className="flex items-center gap-2 font-bold text-slate-800 dark:text-slate-200">
                            <span className="text-base">{info.flag}</span>
                            <span>{countryName}</span>
                          </div>
                          <div className="flex items-center gap-2 font-mono">
                            <span className="font-bold text-slate-900 dark:text-slate-100">{info.count}</span>
                            <span className="text-slate-500 text-[11px]">({pct}%)</span>
                          </div>
                        </div>
                        <div className="w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
                          <div
                            className="bg-emerald-600 h-full rounded-full transition-all duration-500"
                            style={{ width: `${pct}%` }}
                          ></div>
                        </div>
                      </div>
                    );
                  })}

                  {countryList.length === 0 && (
                    <div className="text-center py-6 text-xs text-slate-400">
                      اس مدت میں کوئی ریکارڈ نہیں ملا۔
                    </div>
                  )}
                </div>
              </div>

              {/* Top Visited Sections Breakdown */}
              <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2 text-sm">
                    <Compass className="w-4 h-4 text-amber-600" />
                    <span>سب سے زیادہ دیکھے جانے والے شعبے (Top Visited Pages)</span>
                  </h3>
                </div>

                <div className="space-y-2.5">
                  {pageList.map(([pageKey, count]) => {
                    const pct = timeFiltered.length > 0 ? Math.round((count / timeFiltered.length) * 100) : 0;
                    return (
                      <div key={pageKey} className="p-3 rounded-xl border border-slate-100 dark:border-slate-800">
                        <div className="flex items-center justify-between text-xs mb-1.5">
                          <div className="flex items-center gap-2 font-bold text-slate-800 dark:text-slate-200">
                            <BookOpen className="w-3.5 h-3.5 text-amber-600" />
                            <span>{getPageNameUrdu(pageKey)}</span>
                            <span className="font-mono text-[10px] text-slate-400">#{pageKey}</span>
                          </div>
                          <div className="flex items-center gap-2 font-mono">
                            <span className="font-bold text-amber-700 dark:text-amber-400">{count}</span>
                            <span className="text-slate-500 text-[11px]">({pct}%)</span>
                          </div>
                        </div>
                        <div className="w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
                          <div
                            className="bg-amber-500 h-full rounded-full transition-all duration-500"
                            style={{ width: `${pct}%` }}
                          ></div>
                        </div>
                      </div>
                    );
                  })}

                  {pageList.length === 0 && (
                    <div className="text-center py-6 text-xs text-slate-400">
                      اس مدت میں کوئی ریکارڈ نہیں ملا۔
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Real Visitors Detailed Logs Table */}
            <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <h3 className="font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2 text-base">
                    <Users className="w-5 h-5 text-emerald-600" />
                    <span>حقیقی ناظرین کی مکمل فہرست (Live Visitor Records)</span>
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    کل دکھائے جا رہے ہیں: <span className="font-bold font-mono text-emerald-700 dark:text-emerald-400">{filteredVisitors.length}</span> ریکارڈز
                  </p>
                </div>

                {/* Search and Filters Bar */}
                <div className="flex flex-wrap items-center gap-2">
                  <div className="relative">
                    <Search className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="text"
                      value={visitorSearch}
                      onChange={(e) => setVisitorSearch(e.target.value)}
                      placeholder="ملک، شہر، ڈیوائس یا صفحہ تلاش کریں..."
                      className="pr-9 pl-3 py-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs w-64 focus:outline-none focus:border-emerald-500"
                    />
                  </div>

                  <select
                    value={visitorCountryFilter}
                    onChange={(e) => setVisitorCountryFilter(e.target.value)}
                    className="py-1.5 px-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-urdu focus:outline-none"
                  >
                    <option value="all">تمام ممالک (All Countries)</option>
                    {countryList.map(([cName]) => (
                      <option key={cName} value={cName}>{cName}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Table Container */}
              <div className="overflow-x-auto rounded-xl border border-slate-100 dark:border-slate-800">
                <table className="w-full text-right text-xs">
                  <thead className="bg-stone-50 dark:bg-slate-800/80 text-slate-600 dark:text-slate-300 font-bold border-b border-slate-200 dark:border-slate-700">
                    <tr>
                      <th className="p-3 w-12 text-center">#</th>
                      <th className="p-3">وقت و تاریخ</th>
                      <th className="p-3">ملک و علاقہ</th>
                      <th className="p-3">دیکھا گیا صفحہ / شعبہ</th>
                      <th className="p-3">ڈیوائس و براؤزر</th>
                      <th className="p-3">آمد کا ذریعہ (Referrer)</th>
                      <th className="p-3">سیشن کوڈ</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                    {filteredVisitors.map((vis, idx) => {
                      const flag = getCountryFlagEmoji(vis.countryCode);
                      return (
                        <tr key={vis.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors">
                          <td className="p-3 text-center font-mono text-slate-400">{idx + 1}</td>
                          <td className="p-3">
                            <div className="font-bold text-slate-800 dark:text-slate-200 font-mono" dir="ltr">
                              {vis.time || vis.timestamp.split('T')[1]?.substring(0, 8)}
                            </div>
                            <div className="text-[11px] text-slate-500 font-mono" dir="ltr">
                              {vis.date}
                            </div>
                          </td>
                          <td className="p-3">
                            <div className="flex items-center gap-1.5 font-bold text-slate-900 dark:text-slate-100">
                              <span className="text-base">{flag}</span>
                              <span>{vis.country || 'پاکستان (Pakistan)'}</span>
                            </div>
                            {vis.city && (
                              <div className="text-[11px] text-slate-500 mr-5">
                                شہر: {vis.city}
                              </div>
                            )}
                          </td>
                          <td className="p-3">
                            <span className="inline-block px-2.5 py-1 rounded-lg bg-amber-50 dark:bg-amber-950/40 text-amber-900 dark:text-amber-300 font-bold border border-amber-200 dark:border-amber-900/50">
                              {getPageNameUrdu(vis.page)}
                            </span>
                          </td>
                          <td className="p-3">
                            <div className="flex items-center gap-1.5 text-slate-800 dark:text-slate-200">
                              {vis.deviceType === 'Mobile' ? (
                                <Smartphone className="w-3.5 h-3.5 text-purple-600" />
                              ) : vis.deviceType === 'Tablet' ? (
                                <Smartphone className="w-3.5 h-3.5 text-blue-600" />
                              ) : (
                                <Monitor className="w-3.5 h-3.5 text-slate-600" />
                              )}
                              <span className="font-bold">{vis.deviceType}</span>
                              <span className="text-slate-400">• {vis.os}</span>
                            </div>
                            <div className="text-[11px] text-slate-500">
                              {vis.browser}
                            </div>
                          </td>
                          <td className="p-3">
                            <span className="text-slate-600 dark:text-slate-400 font-sans text-[11px]">
                              {vis.referrer || 'براہِ راست (Direct)'}
                            </span>
                          </td>
                          <td className="p-3 font-mono text-[10px] text-slate-400" dir="ltr">
                            {vis.sessionId ? vis.sessionId.substring(0, 14) + '...' : vis.id.substring(0, 10)}
                          </td>
                        </tr>
                      );
                    })}

                    {filteredVisitors.length === 0 && (
                      <tr>
                        <td colSpan={7} className="p-8 text-center text-slate-400">
                          <Activity className="w-8 h-8 mx-auto text-stone-300 dark:text-slate-700 mb-2" />
                          <p className="text-xs font-bold text-slate-600 dark:text-slate-400">اس فلٹر کے مطابق فی الحال کوئی ریکارڈ موجود نہیں ہے۔</p>
                          <p className="text-[11px] text-slate-400 mt-1">جیسے ہی کوئی ناظر ویب سائٹ کے مختلف صفحات وزٹ کرے گا، وہ فوراً یہاں درج ہو جائے گا۔</p>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        );
      })()}

    </div>
  );
};
