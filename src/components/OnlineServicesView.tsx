import React, { useState, useEffect } from 'react';
import { useThemeLanguage } from '../context/ThemeLanguageContext';
import { StorageService } from '../services/storage';
import { NotificationService } from '../services/notificationService';
import { ClassBooking } from '../types';
import headerLogoCalligraphy from '../assets/images/jamia_logo_calligraphy_transparent.png';
import { JAMIA_HEADER_LOGO_DATA_URI } from '../assets/logoBase64';
import { DonationView } from './DonationView';
import { 
  BookOpen, 
  GraduationCap, 
  Send, 
  Zap,
  Globe, 
  ShieldCheck, 
  Book, 
  Sparkles, 
  CheckCircle2, 
  Clock, 
  CreditCard, 
  Calendar, 
  UserCheck, 
  HelpCircle, 
  MessageSquare,
  ChevronDown,
  ChevronUp,
  Award,
  Video,
  PhoneCall,
  Info,
  Shield,
  Star,
  Heart,
  Copy,
  Check,
  Building2,
  Wallet,
  Smartphone,
  MessageCircle,
  FileText,
  Building,
  CheckCheck
} from 'lucide-react';

interface OnlineServicesViewProps {
  activeSubTab?: string;
  onSelectSubTab?: (subTab: string) => void;
  onOpenFatwaModal?: () => void;
  setCurrentTab?: (tab: string) => void;
}

export const OnlineServicesView: React.FC<OnlineServicesViewProps> = ({
  activeSubTab = 'online-quran',
  onSelectSubTab,
  onOpenFatwaModal,
  setCurrentTab
}) => {
  const { t, language } = useThemeLanguage();

  // Helper to resolve primary tab from incoming activeSubTab
  const getInitialPrimaryTab = (tab: string) => {
    if (tab === 'online-trial' || tab === 'online-admission') return 'online-trial';
    if (tab === 'online-dars-nizami' || tab === 'online-arabic' || tab === 'online-fiqh' || tab === 'online-tafseer' || tab === 'online-hadith') {
      return 'online-dars-nizami';
    }
    return 'online-quran';
  };

  const [primaryTab, setPrimaryTab] = useState<string>(() => getInitialPrimaryTab(activeSubTab));
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const handleCopy = (text: string, key: string) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2500);
  };
  
  // Sub-course selection under Dars-e-Nizami
  const [darsSubCourse, setDarsSubCourse] = useState<string>(() => {
    if (['online-arabic', 'online-fiqh', 'online-tafseer', 'online-hadith'].includes(activeSubTab)) {
      return activeSubTab;
    }
    return 'all';
  });

  // Quran sub-filter (Tajweed vs Hifz)
  const [quranFilter, setQuranFilter] = useState<'all' | 'tajweed' | 'hifz'>('all');

  useEffect(() => {
    if (activeSubTab) {
      setPrimaryTab(getInitialPrimaryTab(activeSubTab));
      if (['online-arabic', 'online-fiqh', 'online-tafseer', 'online-hadith'].includes(activeSubTab)) {
        setDarsSubCourse(activeSubTab);
      }
    }
  }, [activeSubTab]);

  // Forms
  const [admissionForm, setAdmissionForm] = useState({
    studentName: '',
    guardianName: '',
    age: '',
    country: 'پاکستان (Pakistan)',
    phone: '',
    email: '',
    course: 'آن لائن قرآن کریم (تجوید و حفظ)',
    preferredTime: 'شام (Evening)',
  });

  const [trialForm, setTrialForm] = useState({
    name: '',
    country: '',
    phone: '',
    course: 'آن لائن قرآن کریم (تجوید و حفظ)',
    whatsapp: ''
  });

  const [admissionSubmitted, setAdmissionSubmitted] = useState(false);
  const [submittedAdmissionBooking, setSubmittedAdmissionBooking] = useState<ClassBooking | null>(null);
  const [admissionWhatsappUrl, setAdmissionWhatsappUrl] = useState('');

  const [trialSubmitted, setTrialSubmitted] = useState(false);
  const [submittedTrialBooking, setSubmittedTrialBooking] = useState<ClassBooking | null>(null);
  const [trialWhatsappUrl, setTrialWhatsappUrl] = useState('');

  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const handlePrimaryTabChange = (tabId: string) => {
    if (tabId === 'online-taawun' && setCurrentTab) {
      setCurrentTab('donations');
      return;
    }
    setPrimaryTab(tabId);
    if (onSelectSubTab) {
      onSelectSubTab(tabId);
    }
  };

  const handleAdmissionSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Save to Admin Portal Storage
    const newBooking: ClassBooking = {
      id: `book-adm-${Date.now()}`,
      bookingType: 'Admission',
      studentName: admissionForm.studentName.trim(),
      guardianName: admissionForm.guardianName.trim(),
      age: admissionForm.age,
      country: admissionForm.country,
      phone: admissionForm.phone,
      whatsapp: admissionForm.phone,
      email: admissionForm.email,
      course: admissionForm.course,
      preferredTime: admissionForm.preferredTime,
      date: new Date().toISOString().split('T')[0],
      status: 'Pending',
      adminNotes: 'نئے آن لائن داخلہ فارم کے ذریعے موصول ہوا ہے۔'
    };
    StorageService.addClassBooking(newBooking);
    setSubmittedAdmissionBooking(newBooking);

    try {
      const res = await NotificationService.sendAdmissionNotification(newBooking);
      setAdmissionWhatsappUrl(res.whatsappUrl);
    } catch (err) {
      console.error('Admission notification error:', err);
    }

    setAdmissionSubmitted(true);
  };

  const handleTrialSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Save to Admin Portal Storage
    const newTrial: ClassBooking = {
      id: `book-trial-${Date.now()}`,
      bookingType: 'Trial',
      studentName: trialForm.name.trim(),
      country: trialForm.country || 'پاکستان (Pakistan)',
      phone: trialForm.phone || trialForm.whatsapp,
      whatsapp: trialForm.whatsapp || trialForm.phone,
      course: trialForm.course,
      date: new Date().toISOString().split('T')[0],
      status: 'Pending',
      adminNotes: '۳ روزہ مفت ٹرائل کلاس کے لیے نئی بکنگ موصول ہوئی ہے۔'
    };
    StorageService.addClassBooking(newTrial);
    setSubmittedTrialBooking(newTrial);

    try {
      const res = await NotificationService.sendTrialBookingNotification(newTrial);
      setTrialWhatsappUrl(res.whatsappUrl);
    } catch (err) {
      console.error('Trial notification error:', err);
    }

    setTrialSubmitted(true);
  };

  const isAr = language === 'ar';
  const isEn = language === 'en';
  const fontClass = isAr ? 'font-arabic' : isEn ? 'font-sans' : 'font-urdu';

  // 3 Primary Menu Sections (Quran, Dars-e-Nizami, Free Trial)
  const primaryTabsList = [
    { 
      id: 'online-quran', 
      label: isAr ? 'القرآن الكريم عبر الإنترنت (تجويد وحفظ)' : isEn ? 'Online Quran (Tajweed & Hifz)' : 'آن لائن قرآن کریم (تجوید و حفظ)', 
      icon: BookOpen,
      badge: isAr ? 'شائع' : isEn ? 'Popular' : 'پاپولر',
      desc: isAr ? 'ناظرة، تجويد، حفظ وأدعية مأثورة' : isEn ? 'Nazra, Tajweed, Hifz & Masnoon Duas' : 'ناظرہ، تجوید، حفظ اور مسنون دعائیں'
    },
    { 
      id: 'online-dars-nizami', 
      label: isAr ? 'الدرس النظامي عبر الإنترنت' : isEn ? 'Online Dars-e-Nizami' : 'درسِ نظامی آن لائن', 
      icon: GraduationCap,
      badge: isAr ? 'دورة شاملة' : isEn ? 'Full Course' : 'جامع کورس',
      desc: isAr ? 'النحو، الصرف، الفقه، التفسير والحديث الشريف' : isEn ? 'Grammar, Fiqh, Tafseer & Hadith' : 'نحو، صرف، فقہ، تفسیر و حدیث شریف'
    },
    { 
      id: 'online-trial', 
      label: isAr ? 'حصة تجريبية مجانية' : isEn ? 'Free Trial Class' : 'مفت آزمائشی کلاس', 
      icon: Zap,
      badge: isAr ? '٣ أيام مجاناً' : isEn ? '3 Days Free' : '۳ دن مفت',
      desc: isAr ? 'احصل على حصة تجريبية مجانية لمدة 3 أيام' : isEn ? 'Get a 3-day free trial class' : '3 دن کی مفت ٹرائل کلاس حاصل کریں'
    },
  ];

  // Dars-e-Nizami Sub-Courses
  const darsSubCoursesList = [
    { id: 'all', label: isAr ? 'جميع المواد / الملخص' : isEn ? 'All Subjects / Summary' : 'تمام مضامین / خلاصہ', icon: Sparkles },
    { id: 'online-arabic', label: isAr ? 'دورة اللغة العربية' : isEn ? 'Arabic Language Course' : 'عربی زبان کورس', icon: Globe },
    { id: 'online-fiqh', label: isAr ? 'الفقه والعلوم الإسلامية' : isEn ? 'Fiqh & Islamic Law' : 'فقہ و اسلامیات', icon: ShieldCheck },
    { id: 'online-tafseer', label: isAr ? 'تفسير القرآن الكريم' : isEn ? 'Quran Tafseer' : 'تفسیر القرآن', icon: Sparkles },
    { id: 'online-hadith', label: isAr ? 'الحديث الشريف وأصوله' : isEn ? 'Hadith Studies' : 'حدیث شریف', icon: Book },
  ];

  const onlineFaqs = [
    {
      q: isAr 
        ? 'ما هي المنصات المستخدمة للدروس عبر الإنترنت؟' 
        : isEn 
        ? 'Which platforms are used for online classes?' 
        : 'آن لائن کلاسز کس پلیٹ فارم کے ذریعے لی جاتی ہیں؟',
      a: isAr 
        ? 'تُعقد الفصول عبر Zoom و Google Meet و Microsoft Teams و WhatsApp بشكل فردي (1-on-1) أو في مجموعات تفاعلية مباشرة.' 
        : isEn 
        ? 'Classes are conducted 1-on-1 and in interactive live groups via Zoom, Google Meet, Microsoft Teams, and WhatsApp.' 
        : 'آن لائن کلاسز Zoom، Google Meet، Microsoft Teams اور WhatsApp کے ذریعے 1-on-1 اور گروپ لائیو کلاسز میں دی جاتی ہیں۔'
    },
    {
      q: isAr 
        ? 'هل هناك مرونة في المواعيد لمختلف المناطق الزمنية والطلاب المغتربين؟' 
        : isEn 
        ? 'Is there schedule flexibility for different time zones (Pakistan & Overseas)?' 
        : 'کیا مختلف ٹائم زون (پاکستان و اوورسیز) کے طلبہ کے لیے وقت میں لچک ہے؟',
      a: isAr 
        ? 'نعم! يتم ضبط المواعيد بمرونة تامة لتناسب التوقيت المحلي لطلابنا في باكستان، والخليج، وأوروبا، وأمريكا، وكندا، وأستراليا.' 
        : isEn 
        ? 'Yes! Schedules are flexibly adjusted to match the local times of students in Pakistan, the Gulf, UK, US, Canada, Europe, and Australia.' 
        : 'جی ہاں! پاکستان، سعودیہ، امارات، قطر، عمان، برطانیہ، امریکہ، کینیڈا، آسٹریلیا اور یورپ کے طلبہ کے مقامی وقت کے مطابق کلاس کا فلیکسیبل ٹائم ایڈجسٹ کیا جاتا ہے۔'
    },
    {
      q: isAr 
        ? 'كيف يمكن الحصول على حصة تجريبية مجانية؟' 
        : isEn 
        ? 'How can I get a Free Trial Class?' 
        : 'مفت آزمائشی کلاس (Free Trial Class) کیسے حاصل کی جائے؟',
      a: isAr 
        ? 'يمكنك ملء نموذج "الحصة التجريبية المجانية" بكتابة اسمك ورقم الواتساب لبدء 3 أيام تجريبية مجانية بالكامل.' 
        : isEn 
        ? 'Simply enter your name and WhatsApp number in the "Free Trial Class" form to start 3 completely free trial days.' 
        : 'آپ "مفت آزمائشی کلاس" والے فارم میں نام اور واٹس ایپ نمبر درج کر کے ۳ دن کی بلا معاوضہ ٹرائل کلاس شروع کر سکتے ہیں۔'
    },
    {
      q: isAr 
        ? 'هل توجد معلمات متخصصات للطالبات والأطفال؟' 
        : isEn 
        ? 'Are certified female teachers available for female students?' 
        : 'کیا طالبات کے لیے معلمات (Female Teachers) میسر ہیں؟',
      a: isAr 
        ? 'نعم، لدينا نخبة من المعلمات المؤهلات والحافظات المعتمدات لتعليم الأخوات والفتيات وفق الضوابط الشرعية التامة.' 
        : isEn 
        ? 'Yes, experienced and certified female teachers are specially available for female students and girls with full Islamic modesty.' 
        : 'جی ہاں، طالبات اور بچیوں کے لیے مکمل شرعی پردے کے ساتھ تجربہ کار و سند یافتہ معلمات کا خاص انتظام موجود ہے۔'
    },
  ];

  return (
    <div className={`space-y-8 ${isEn ? 'text-left' : 'text-right'}`} dir={isEn ? 'ltr' : 'rtl'}>
      
      {/* Hidden SEO Keywords Block */}
      <div className="sr-only">
        <h2>آن لائن قرآن تجوید و حفظ - درسِ نظامی آن لائن - جامعہ اسلامیہ ایبٹ آباد</h2>
        <p>Online Quran Classes with Tajweed and Hifz, Online Dars-e-Nizami, Arabic Language, Fiqh, Tafseer, Hadith Course.</p>
      </div>

      {/* 1. TOP HEADER BANNER STRIP (عین سکرین شاٹ کے مطابق روایتی اسلامی پٹی مع بارڈر، پس منظر اور تحریر) */}
      <div 
        className="w-full border-y-[3px] border-[#B89B72] dark:border-amber-800 px-3.5 sm:px-8 py-4 sm:py-5 mb-2 shadow-sm relative overflow-hidden flex flex-col md:flex-row items-start md:items-center justify-between gap-4 sm:gap-6"
        style={{
          backgroundColor: '#EBE3D5',
          backgroundImage: `
            radial-gradient(ellipse at center, rgba(245, 239, 230, 0.85) 0%, rgba(232, 222, 207, 0.95) 100%),
            url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23997A4D' fill-opacity='0.12' fill-rule='evenodd'%3E%3Cpath d='M30 0l30 30-30 30L0 30 30 0zm0 7.5L7.5 30 30 52.5 52.5 30 30 7.5zM30 15l15 15-15 15-15-15 15-15zm0 5.25L20.25 30 30 39.75 39.75 30 30 20.25z'/%3E%3C/g%3E%3C/svg%3E")
          `,
          backgroundRepeat: 'repeat'
        }}
      >
        {/* Subtle decorative inner borders */}
        <div className="absolute inset-x-0 top-0.5 h-[1px] bg-[#997A4D]/40"></div>
        <div className="absolute inset-x-0 bottom-0.5 h-[1px] bg-[#997A4D]/40"></div>

        {/* Title area */}
        <div className="flex items-start gap-3 sm:gap-3.5 relative z-10 max-w-3xl w-full md:w-auto">
          <div className="w-2 sm:w-2.5 h-10 sm:h-12 bg-[#52341D] rounded-xs shrink-0 shadow-xs mt-1"></div>
          <div className="space-y-0.5 w-full">
            <span className={`text-xs sm:text-sm font-bold text-[#6D472B] dark:text-amber-200 ${fontClass} block`}>
              {isAr ? 'أكاديمية الجامعة الإسلامية' : isEn ? 'Jamia Islamia Online Academy' : 'جامعہ اسلامیہ اکیڈمی'}
            </span>
            <h1 className={`text-xl sm:text-3xl lg:text-[34px] font-black text-[#3E2514] dark:text-amber-100 tracking-wide ${fontClass} leading-snug sm:leading-tight`} style={{ color: '#3E2514' }}>
              {isAr ? 'الخدمات القرآنية والتعليمية عبر الإنترنت' : isEn ? 'Online Quranic & Academic Services' : 'آن لائن تعلیمی و قرآنی خدمات'}
            </h1>
            <p className={`text-xs sm:text-sm ${fontClass} leading-relaxed pt-0.5`} style={{ color: '#52341D' }}>
              {isAr 
                ? 'دروس حية ومباشرة عبر الإنترنت في التجويد والحفظ واللغة العربية والفقه والتفسير والحديث الشريف للمسلمين في شتى بقاع العالم.' 
                : isEn 
                ? 'Live 1-on-1 and group online classes in Tajweed, Hifz, Arabic Language, Fiqh, Tafseer, and Hadith for Muslims worldwide.' 
                : 'پاکستان اور دنیا بھر کے مسلم بھائیوں، بہنوں اور بچوں کے لیے لائیو آن لائن کلاسز برائے تجوید، حفظ، عربی زبان، فقہ، تفسیر اور حدیث شریف۔'}
            </p>
          </div>
        </div>

        {/* Jamia Calligraphy Logo */}
        <div className="shrink-0 relative z-10 self-center md:self-center flex items-center justify-center w-full md:w-auto md:mr-auto md:ml-8 lg:ml-16 py-1">
          <img 
            src={JAMIA_HEADER_LOGO_DATA_URI || headerLogoCalligraphy} 
            alt="الجامعة الإسلامية ايبت آباد" 
            className="h-12 sm:h-16 md:h-20 lg:h-24 w-auto max-w-[220px] sm:max-w-[340px] md:max-w-[400px] object-contain transition-all"
            style={{
              filter: 'sepia(0.6) hue-rotate(330deg) saturate(1.8) contrast(1.2)'
            }}
            onError={(e) => {
              const target = e.currentTarget;
              target.src = JAMIA_HEADER_LOGO_DATA_URI || '/jamia_logo_calligraphy_transparent.png';
            }}
          />
        </div>
      </div>

      {/* 3 CORE ACADEMIC TABS (آن لائن قرآن، درسِ نظامی، مفت آزمائشی کلاس) */}
      <div className="bg-[#F8F4EC] dark:bg-slate-900 border-2 border-[#B88A3B] rounded-2xl p-2.5 sm:p-4 shadow-md">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4">
          {primaryTabsList.map((tab) => {
            const IconComponent = tab.icon;
            const isSelected = primaryTab === tab.id;

            return (
              <button
                key={tab.id}
                onClick={() => handlePrimaryTabChange(tab.id)}
                className={`p-4 rounded-xl transition-all ${isEn ? 'text-left' : 'text-right'} border cursor-pointer relative flex flex-col justify-between group ${
                  isSelected
                    ? 'bg-[#5C4632] text-[#F8F4EC] border-[#B88A3B] shadow-lg ring-2 ring-[#B88A3B]/50'
                    : 'bg-white dark:bg-slate-800 text-stone-800 dark:text-stone-200 border-stone-200 dark:border-slate-700 hover:border-[#B88A3B]'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-2.5">
                    <div className={`p-2 rounded-lg ${isSelected ? 'bg-[#B88A3B] text-slate-950' : 'bg-[#5C4632]/10 dark:bg-slate-700 text-[#5C4632] dark:text-amber-300'}`}>
                      <IconComponent className="w-5 h-5" />
                    </div>
                    <span className={`text-[11px] ${fontClass} font-bold px-2.5 py-0.5 rounded-full border ${
                      isSelected 
                        ? 'bg-[#B88A3B]/30 text-[#B88A3B] border-[#B88A3B]/50' 
                        : 'bg-stone-100 dark:bg-slate-700 text-stone-600 dark:text-stone-300 border-stone-300 dark:border-slate-600'
                    }`}>
                      {tab.badge}
                    </span>
                  </div>
                  
                  <h3 className={`text-base sm:text-lg font-bold ${fontClass} leading-snug ${isSelected ? 'text-[#B88A3B]' : 'text-stone-900 dark:text-stone-100'}`}>
                    {tab.label}
                  </h3>
                  <p className={`text-xs mt-1.5 ${fontClass} leading-relaxed ${isSelected ? 'text-stone-200' : 'text-stone-600 dark:text-stone-400'}`}>
                    {tab.desc}
                  </p>
                </div>

                <div className={`mt-3.5 pt-2 border-t ${isSelected ? 'border-[#B88A3B]/30' : 'border-stone-100 dark:border-slate-700'} ${isEn ? 'text-right' : 'text-left'}`}>
                  <span className={`text-xs ${fontClass} font-bold inline-flex items-center gap-1.5 ${isSelected ? 'text-[#B88A3B]' : 'text-[#5C4632] dark:text-amber-300'}`}>
                    <span>{isAr ? 'عرض التفاصيل والبدء' : isEn ? 'View Details & Start' : 'تفصیلات دیکھیں اور شروع کریں'}</span>
                    <span>{isEn ? '→' : '←'}</span>
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* DYNAMIC VIEW BASED ON SELECTED PRIMARY TAB */}

      {/* SECTION 1: آن لائن قرآن کریم (تجوید و حفظ) */}
      {primaryTab === 'online-quran' && (
        <div className="space-y-6">
          <div className="bg-white dark:bg-slate-800 border-2 border-[#B88A3B]/50 rounded-2xl p-6 shadow-md space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-stone-200 dark:border-slate-700 pb-4">
              <div>
                <div className="flex items-center gap-2">
                  <BookOpen className="w-6 h-6 text-[#B88A3B]" />
                  <h2 className={`text-2xl font-bold ${fontClass} text-[#5C4632] dark:text-amber-300`}>
                    {isAr ? 'القرآن الكريم عبر الإنترنت (تجويد وحفظ)' : isEn ? 'Online Quran (Tajweed & Hifz)' : 'آن لائن قرآن کریم (تجوید و حفظ)'}
                  </h2>
                </div>
                <p className={`text-sm ${fontClass} text-stone-600 dark:text-stone-300 mt-1`}>
                  {isAr 
                    ? 'برامج شاملة في تلاوة الناظرة ومخارج الحروف وقواعد التجويد وحفظ القرآن الكريم' 
                    : isEn 
                    ? 'Comprehensive programs in Nazra recitation, phonetic Makharij, Tajweed rules, and Holy Quran memorization.' 
                    : 'ناظرہ قرآن، مخارج و تجوید اور حفظ القرآن کریم کے خصوصی شعبہ جات کا اکٹھا خلاصہ'}
                </p>
              </div>

              {/* Sub-Filter Switcher */}
              <div className={`flex items-center gap-1.5 bg-[#F8F4EC] dark:bg-slate-900 p-1 rounded-xl border border-[#B88A3B]/40 ${fontClass} text-xs`}>
                <button
                  onClick={() => setQuranFilter('all')}
                  className={`px-3 py-1.5 rounded-lg font-bold cursor-pointer transition-colors ${quranFilter === 'all' ? 'bg-[#5C4632] text-white shadow-xs' : 'text-stone-700 dark:text-stone-300 hover:text-[#B88A3B]'}`}
                >
                  {isAr ? 'جميع البرامج' : isEn ? 'All Programs' : 'تمام قرآن پروگرامز'}
                </button>
                <button
                  onClick={() => setQuranFilter('tajweed')}
                  className={`px-3 py-1.5 rounded-lg font-bold cursor-pointer transition-colors ${quranFilter === 'tajweed' ? 'bg-[#5C4632] text-white shadow-xs' : 'text-stone-700 dark:text-stone-300 hover:text-[#B88A3B]'}`}
                >
                  {isAr ? 'التجويد والقراءة' : isEn ? 'Tajweed & Nazra' : 'آن لائن تجوید'}
                </button>
                <button
                  onClick={() => setQuranFilter('hifz')}
                  className={`px-3 py-1.5 rounded-lg font-bold cursor-pointer transition-colors ${quranFilter === 'hifz' ? 'bg-[#5C4632] text-white shadow-xs' : 'text-stone-700 dark:text-stone-300 hover:text-[#B88A3B]'}`}
                >
                  {isAr ? 'تحفيظ القرآن' : isEn ? 'Quran Memorization' : 'حفظ القرآن'}
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Tajweed Card */}
              {(quranFilter === 'all' || quranFilter === 'tajweed') && (
                <div className="bg-[#F8F4EC] dark:bg-slate-900 border-2 border-[#B88A3B]/60 rounded-xl p-5 space-y-4 relative overflow-hidden">
                  <div className="flex items-center justify-between">
                    <span className={`px-2.5 py-0.5 bg-[#B88A3B] text-slate-950 text-xs font-bold ${fontClass} rounded-full`}>
                      {isAr ? 'المستوى الأول: التأسيس والتجويد' : isEn ? 'Level 1: Foundation & Tajweed' : 'لیول ۱: بنیادی و پیشرفته'}
                    </span>
                    <BookOpen className="w-5 h-5 text-[#B88A3B]" />
                  </div>

                  <h3 className={`text-xl font-bold ${fontClass} text-[#5C4632] dark:text-amber-300`}>
                    {isAr ? 'تلاوة القرآن الكريم بالتجويد' : isEn ? 'Holy Quran with Tajweed' : 'آن لائن قرآن کریم مع تجوید'}
                  </h3>

                  <p className={`text-sm ${fontClass} text-stone-700 dark:text-stone-300 leading-relaxed`}>
                    {isAr 
                      ? 'القاعدة النورانية، والمخارج الصحيحة للحروف، وقواعد التجويد، والصلاة والسنن والأذكار اليومية مع تدريب فردي مباشر.' 
                      : isEn 
                      ? 'Noorani Qaida, accurate phonetic articulation, Tajweed principles, translated Salah, and daily Masnoon supplications with live 1-on-1 coaching.' 
                      : 'نورانی قاعدہ، صحیح مخارج الاداء، قواعد تجوید، نماز مع ترجمہ اور مسنون دعاؤں کے ساتھ ناظرہ قرآن کریم کی لائیو 1-on-1 مشق۔'}
                  </p>

                  <ul className={`space-y-2 text-xs ${fontClass} text-stone-800 dark:text-stone-200`}>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-[#B88A3B] shrink-0" />
                      <span>{isAr ? 'القاعدة النورانية وأصول القراءة السليمة' : isEn ? 'Noorani Qaida & foundational reading rules' : 'نورانی قاعدہ اور تجوید کے ابتدائی اصول'}</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-[#B88A3B] shrink-0" />
                      <span>{isAr ? 'مخارج الحروف والترتيل المتقن' : isEn ? 'Accurate phonetic articulation & melodic Tarteel' : 'حروف کے درست مخارج اور ترتیل کے ساتھ تلاوت'}</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-[#B88A3B] shrink-0" />
                      <span>{isAr ? 'الأدعية المأثورة وكيفية الصلاة المسنونة' : isEn ? 'Daily Masnoon supplications and authentic Salah method' : 'روزمرہ مسنون دعائیں اور نماز مسنون کا طریقہ'}</span>
                    </li>
                  </ul>

                  <div className="pt-2 flex gap-2">
                    <button 
                      onClick={() => handlePrimaryTabChange('online-trial')}
                      className={`w-full py-2 bg-[#5C4632] hover:bg-[#433324] text-[#F8F4EC] text-xs ${fontClass} font-bold rounded-lg transition-colors border border-[#B88A3B] cursor-pointer`}
                    >
                      {isAr ? 'التحق بدورة التجويد الآن' : isEn ? 'Enroll in Tajweed Course' : 'تجوید کلاس میں داخلہ لیں'}
                    </button>
                  </div>
                </div>
              )}

              {/* Hifz Card */}
              {(quranFilter === 'all' || quranFilter === 'hifz') && (
                <div className="bg-[#F8F4EC] dark:bg-slate-900 border-2 border-[#B88A3B]/60 rounded-xl p-5 space-y-4 relative overflow-hidden">
                  <div className="flex items-center justify-between">
                    <span className={`px-2.5 py-0.5 bg-[#5C4632] text-[#F8F4EC] text-xs font-bold ${fontClass} rounded-full border border-[#B88A3B]`}>
                      {isAr ? 'المستوى الثاني: حفظ القرآن كاملاً' : isEn ? 'Level 2: Quran Memorization' : 'لیول ۲: حفظ مکمل'}
                    </span>
                    <Award className="w-5 h-5 text-[#B88A3B]" />
                  </div>

                  <h3 className={`text-xl font-bold ${fontClass} text-[#5C4632] dark:text-amber-300`}>
                    {isAr ? 'برنامج تحفيظ القرآن الكريم' : isEn ? 'Quran Memorization (Hifz) Program' : 'حفظ القرآن پروگرام'}
                  </h3>

                  <p className={`text-sm ${fontClass} text-stone-700 dark:text-stone-300 leading-relaxed`}>
                    {isAr 
                      ? 'حفظ القرآن كاملاً، وحفظ السور الفاضلة (يس، الملك، الواقعة، الكهف)، مع منهجية متقنة للمراجعة والتثبيت اليومي.' 
                      : isEn 
                      ? 'Full Quran memorization or selected chapters (Surah Yaseen, Al-Mulk, Al-Waqiah, Al-Kahf) with a rigorous daily revision (Manzil) system.' 
                      : 'مکمل حفظِ قرآن، منتخب سورتوں کا حفظ (سورۃ یٰس، المُلک، واقعہ، الکہف)، اور سابقہ منزلوں (دہرائی) کا مضبوط نظام۔'}
                  </p>

                  <ul className={`space-y-2 text-xs ${fontClass} text-stone-800 dark:text-stone-200`}>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-[#B88A3B] shrink-0" />
                      <span>{isAr ? 'تسميع يومي للسبق الجديد والمراجعة الفردية' : isEn ? 'Daily new lesson, recent revision, and individual review' : 'روزانہ نیا سبق، سبقی اور منزل کا انفرادی جائزہ'}</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-[#B88A3B] shrink-0" />
                      <span>{isAr ? 'إشراف مباشر من قراء وحفاظ معتمدين ومجازين' : isEn ? 'Live supervision by certified Qaris and Huffaz' : 'تجربہ کار قراء اور حفاظ کرام کی لائیو نگرانی'}</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-[#B88A3B] shrink-0" />
                      <span>{isAr ? 'شهادة إتمام حفظ رسمية ومعتمدة عند التخرج' : isEn ? 'Official certified Quran Hifz certificate upon completion' : 'تکمیل پر باقاعدہ تصدیق شدہ حفظِ قرآن کی سند'}</span>
                    </li>
                  </ul>

                  <div className="pt-2 flex gap-2">
                    <button 
                      onClick={() => handlePrimaryTabChange('online-trial')}
                      className={`w-full py-2 bg-[#B88A3B] hover:bg-[#a17831] text-slate-950 text-xs ${fontClass} font-bold rounded-lg transition-colors cursor-pointer`}
                    >
                      {isAr ? 'التحق ببرنامج الحفظ' : isEn ? 'Enroll in Hifz Program' : 'حفظ پروگرام میں داخلہ لیں'}
                    </button>
                  </div>
                </div>
              )}

            </div>
          </div>
        </div>
      )}

      {/* SECTION 2: درسِ نظامی آن لائن (GATHERING SUB-COURSES) */}
      {primaryTab === 'online-dars-nizami' && (
        <div className="space-y-6">
          <div className="bg-white dark:bg-slate-800 border-2 border-[#B88A3B]/50 rounded-2xl p-6 shadow-md space-y-6">
            
            <div className="border-b border-stone-200 dark:border-slate-700 pb-4 space-y-3">
              <div className="flex items-center gap-2">
                <GraduationCap className="w-7 h-7 text-[#B88A3B]" />
                <h2 className={`text-2xl sm:text-3xl font-bold ${fontClass} text-[#5C4632] dark:text-amber-300`}>
                  {isAr ? 'الدرس النظامي عبر الإنترنت (الأكاديمية العالمية)' : isEn ? 'Online Dars-e-Nizami (Global Academy)' : 'درسِ نظامی آن لائن (عالمی اکیڈمی)'}
                </h2>
              </div>
              <p className={`text-sm ${fontClass} text-stone-600 dark:text-stone-300`}>
                {isAr 
                  ? 'منصة معتمدة لتدريس العلوم الشرعية وفق منهاج وفاق المدارس العربية بباكستان: اللغة العربية، والفقه، والتفسير، والحديث الشريف.' 
                  : isEn 
                  ? 'An authentic platform providing classical Islamic scholarship according to Wifaqul Madaris Pakistan curriculum: Arabic, Fiqh, Tafseer, and Hadith.' 
                  : 'وفاق المدارس العربیہ پاکستان کے نصاب کے مطابق آن لائن عالمی درسِ نظامی، عربی زبان، فقہ، تفسیر اور حدیث شریف کا معتبر پلیٹ فارم۔'}
              </p>

              {/* NESTED SUB-COURSE BAR FOR DARS-E-NIZAMI */}
              <div className="pt-2">
                <span className={`text-xs ${fontClass} font-bold text-[#B88A3B] block mb-2`}>
                  {isAr ? 'اختر المادة الدراسية:' : isEn ? 'Select Dars-e-Nizami Subject:' : 'درسِ نظامی کے ذیلی مضامین کا انتخاب کریں:'}
                </span>
                <div className="flex flex-wrap gap-2">
                  {darsSubCoursesList.map((sub) => {
                    const SubIcon = sub.icon;
                    const isSelected = darsSubCourse === sub.id;

                    return (
                      <button
                        key={sub.id}
                        onClick={() => setDarsSubCourse(sub.id)}
                        className={`px-3.5 py-2 rounded-xl text-xs ${fontClass} font-bold flex items-center gap-1.5 transition-all cursor-pointer border ${
                          isSelected
                            ? 'bg-[#5C4632] text-[#F8F4EC] border-[#B88A3B] shadow-sm'
                            : 'bg-[#F8F4EC] dark:bg-slate-900 text-stone-800 dark:text-stone-200 border-stone-300 dark:border-slate-700 hover:border-[#B88A3B]'
                        }`}
                      >
                        <SubIcon className="w-3.5 h-3.5 text-[#B88A3B]" />
                        <span>{sub.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* DARS E NIZAMI CARDS GRID */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* 1. Arabic Language */}
              {(darsSubCourse === 'all' || darsSubCourse === 'online-arabic') && (
                <div className="bg-[#F8F4EC] dark:bg-slate-900 border-2 border-[#B88A3B]/60 rounded-xl p-5 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className={`px-2.5 py-0.5 bg-[#B88A3B] text-slate-950 text-xs font-bold ${fontClass} rounded-full`}>
                      {isAr ? 'المادة ١' : isEn ? 'Subject 1' : 'مضمون ۱'}
                    </span>
                    <Globe className="w-5 h-5 text-[#B88A3B]" />
                  </div>
                  <h3 className={`text-lg font-bold ${fontClass} text-[#5C4632] dark:text-amber-300`}>
                    {isAr ? 'دورة اللغة العربية (النحو والصرف والمحادثة)' : isEn ? 'Arabic Language & Grammar Course' : 'عربی زبان کورس (اللغة العربية)'}
                  </h3>
                  <p className={`text-xs ${fontClass} text-stone-700 dark:text-stone-300 leading-relaxed`}>
                    {isAr 
                      ? 'قواعد النحو والصرف، والمحادثة العربية المعاصرة، وإتقان لسان القرآن الكريم وكلاسيكيات الأدب العربي.' 
                      : isEn 
                      ? 'Comprehensive study of Arabic grammar (Nahw & Sarf), modern conversation (Muhadatha), and Quranic Arabic.' 
                      : 'عربی گرائمر (نحو و صرف)، عربی بول چال (المحادثة العربية) اور لسان القرآن کریم میں مہارت حاصل کرنے کا جامع کورس۔'}
                  </p>
                  <ul className={`space-y-1.5 text-xs ${fontClass} text-stone-800 dark:text-stone-200`}>
                    <li className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-[#B88A3B]" /> {isAr ? 'تطبيقات عملية في النحو والصرف' : isEn ? 'Applied Nahw & Sarf practice' : 'قواعد النحو والصرف کی عملی مشق'}</li>
                    <li className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-[#B88A3B]" /> {isAr ? 'المحادثة العربية والتعبيرات اليومية' : isEn ? 'Arabic conversation & daily idioms' : 'عربی بول چال اور روزمرہ تعبیرات'}</li>
                  </ul>
                  <button onClick={() => handlePrimaryTabChange('online-trial')} className={`w-full mt-2 py-1.5 bg-[#5C4632] text-white text-xs ${fontClass} font-bold rounded-lg hover:bg-[#433324] cursor-pointer`}>
                    {isAr ? 'التسجيل في مادة العربية' : isEn ? 'Enroll in Arabic Course' : 'اس مضمون میں داخلہ لیں'}
                  </button>
                </div>
              )}

              {/* 2. Fiqh & Islamic Studies */}
              {(darsSubCourse === 'all' || darsSubCourse === 'online-fiqh') && (
                <div className="bg-[#F8F4EC] dark:bg-slate-900 border-2 border-[#B88A3B]/60 rounded-xl p-5 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className={`px-2.5 py-0.5 bg-[#5C4632] text-white text-xs font-bold ${fontClass} rounded-full border border-[#B88A3B]`}>
                      {isAr ? 'المادة ٢' : isEn ? 'Subject 2' : 'مضمون ۲'}
                    </span>
                    <ShieldCheck className="w-5 h-5 text-[#B88A3B]" />
                  </div>
                  <h3 className={`text-lg font-bold ${fontClass} text-[#5C4632] dark:text-amber-300`}>
                    {isAr ? 'الفقه الإسلامي والمعاملات المالية' : isEn ? 'Fiqh & Islamic Jurisprudence' : 'فقہ و اسلامیات (Fiqh & Islamic Law)'}
                  </h3>
                  <p className={`text-xs ${fontClass} text-stone-700 dark:text-stone-300 leading-relaxed`}>
                    {isAr 
                      ? 'دراسة متون الفقه (مختصر القدوري، كنز الدقائق، الهداية) في الطهارة، والصلاة، والزكاة، والمعاملات المالية المعاصرة.' 
                      : isEn 
                      ? 'Study of authentic classical Fiqh texts (Qudoori, Kanz al-Daqaiq, Al-Hidayah) covering worship, commercial transactions, and modern rulings.' 
                      : 'کتبِ فقہ (قدوری، کنز الدقائق، الہدایۃ) کی روشنی میں طہارت، نماز، زکوۃ، روزہ، تجارت اور جدید درپیش فقہی مسائل کی تدریس۔'}
                  </p>
                  <ul className={`space-y-1.5 text-xs ${fontClass} text-stone-800 dark:text-stone-200`}>
                    <li className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-[#B88A3B]" /> {isAr ? 'أحكام العبادات والمعاملات والفرائض' : isEn ? 'Worship, transactions & estate distribution' : 'عبادات، معاملات اور فرائض الشریعہ'}</li>
                    <li className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-[#B88A3B]" /> {isAr ? 'فهم المسائل الاقتصادية والمالية المعاصرة' : isEn ? 'Modern financial & commercial rulings' : 'جدید معاشی و تجارتی احکام کی فہم'}</li>
                  </ul>
                  <button onClick={() => handlePrimaryTabChange('online-trial')} className={`w-full mt-2 py-1.5 bg-[#5C4632] text-white text-xs ${fontClass} font-bold rounded-lg hover:bg-[#433324] cursor-pointer`}>
                    {isAr ? 'التسجيل في مادة الفقه' : isEn ? 'Enroll in Fiqh Course' : 'اس مضمون میں داخلہ لیں'}
                  </button>
                </div>
              )}

              {/* 3. Tafseer */}
              {(darsSubCourse === 'all' || darsSubCourse === 'online-tafseer') && (
                <div className="bg-[#F8F4EC] dark:bg-slate-900 border-2 border-[#B88A3B]/60 rounded-xl p-5 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className={`px-2.5 py-0.5 bg-[#B88A3B] text-slate-950 text-xs font-bold ${fontClass} rounded-full`}>
                      {isAr ? 'المادة ٣' : isEn ? 'Subject 3' : 'مضمون ۳'}
                    </span>
                    <Sparkles className="w-5 h-5 text-[#B88A3B]" />
                  </div>
                  <h3 className={`text-lg font-bold ${fontClass} text-[#5C4632] dark:text-amber-300`}>
                    {isAr ? 'تفسير القرآن الكريم وأصوله' : isEn ? 'Quran Tafseer & Exegesis' : 'تفسیر القرآن کریم (Tafseer)'}
                  </h3>
                  <p className={`text-xs ${fontClass} text-stone-700 dark:text-stone-300 leading-relaxed`}>
                    {isAr 
                      ? 'ترجمة القرآن، وربط الآيات، وأسباب النزول، وأصول التفسير مع دراسة أمهات كتب التفاسير المعتمدة.' 
                      : isEn 
                      ? 'In-depth translation, thematic flow of verses, reasons of revelation (Asbab al-Nuzul), and classical Tafseer studies.' 
                      : 'ترجمہ قرآن، ربطِ آیات، اسبابِ نزول، اصولِ تفسیر اور معتبر تفاسیر (تفسیر عثمانی، معارف القرآن) کے ساتھ بامحاورہ باقاعدہ فہم۔'}
                  </p>
                  <ul className={`space-y-1.5 text-xs ${fontClass} text-stone-800 dark:text-stone-200`}>
                    <li className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-[#B88A3B]" /> {isAr ? 'ترجمة سياقية دقيقة لآيات التنزيل' : isEn ? 'Accurate verse-by-verse translation' : 'لفظی و بامحاورہ سلیس ترجمہ'}</li>
                    <li className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-[#B88A3B]" /> {isAr ? 'بيان مقاصد السور والموضوعات القرآنية' : isEn ? 'Themes and core objectives of Surahs' : 'تفسیر اور مضامینِ قرآن کی تشریح'}</li>
                  </ul>
                  <button onClick={() => handlePrimaryTabChange('online-trial')} className={`w-full mt-2 py-1.5 bg-[#5C4632] text-white text-xs ${fontClass} font-bold rounded-lg hover:bg-[#433324] cursor-pointer`}>
                    {isAr ? 'التسجيل في مادة التفسير' : isEn ? 'Enroll in Tafseer Course' : 'اس مضمون میں داخلہ لیں'}
                  </button>
                </div>
              )}

              {/* 4. Hadith */}
              {(darsSubCourse === 'all' || darsSubCourse === 'online-hadith') && (
                <div className="bg-[#F8F4EC] dark:bg-slate-900 border-2 border-[#B88A3B]/60 rounded-xl p-5 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className={`px-2.5 py-0.5 bg-[#5C4632] text-white text-xs font-bold ${fontClass} rounded-full border border-[#B88A3B]`}>
                      {isAr ? 'المادة ٤' : isEn ? 'Subject 4' : 'مضمون ۴'}
                    </span>
                    <Book className="w-5 h-5 text-[#B88A3B]" />
                  </div>
                  <h3 className={`text-lg font-bold ${fontClass} text-[#5C4632] dark:text-amber-300`}>
                    {isAr ? 'الحديث الشريف وأصول الحديث' : isEn ? 'Hadith Studies & Methodology' : 'حدیث شریف و اصولِ حدیث (Hadith)'}
                  </h3>
                  <p className={`text-xs ${fontClass} text-stone-700 dark:text-stone-300 leading-relaxed`}>
                    {isAr 
                      ? 'دراسة مشكاة المصابيح، والكتب الستة الصحاح، ومصطلح الحديث وأصول الرواية والدراية.' 
                      : isEn 
                      ? 'Study of Mishkat al-Masabih, Sahih Sittah (Bukhari, Muslim, Tirmidhi), and Mustalah al-Hadith (Hadith sciences).' 
                      : 'مشکوۃ المصابیح، صحاح ستہ (بخاری، مسلم، ترمذی) اور اصولِ حدیث کا مطالعہ۔'}
                  </p>
                  <ul className={`space-y-1.5 text-xs ${fontClass} text-stone-800 dark:text-stone-200`}>
                    <li className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-[#B88A3B]" /> {isAr ? 'ترجمة وشرح الأحاديث النبوية الشريفة' : isEn ? 'Translation and commentary of prophetic Hadiths' : 'احادیث مبارکہ کا ترجمہ و تشریح'}</li>
                    <li className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-[#B88A3B]" /> {isAr ? 'علم مصطلح الحديث وقواعد التوثيق' : isEn ? 'Principles of Hadith authenticity & transmitters' : 'مصطلح الحديث اور علم الرواية'}</li>
                  </ul>
                  <button onClick={() => handlePrimaryTabChange('online-trial')} className={`w-full mt-2 py-1.5 bg-[#5C4632] text-white text-xs ${fontClass} font-bold rounded-lg hover:bg-[#433324] cursor-pointer`}>
                    {isAr ? 'التسجيل في مادة الحديث' : isEn ? 'Enroll in Hadith Course' : 'اس مضمون میں داخلہ لیں'}
                  </button>
                </div>
              )}

            </div>

            {/* MANDATORY NOTICES BOX */}
            <div className={`bg-[#5C4632]/10 dark:bg-slate-900 border border-[#B88A3B]/40 rounded-xl p-4 text-xs ${fontClass} space-y-1`}>
              <div className="flex items-center gap-2 text-[#5C4632] dark:text-amber-300 font-bold">
                <Info className="w-4 h-4 text-[#B88A3B]" />
                <span>{isAr ? 'إشعار أكاديمي هام:' : isEn ? 'Academic Information Notice:' : 'تعلیمی معلومات کا نوٹس:'}</span>
              </div>
              <p className="text-stone-700 dark:text-stone-300 font-bold">
                {isAr 
                  ? 'سيتم تزويد الطالب بجدول الفصول وبيانات الأساتذة المباشرين والتفاصيل الإدارية بعد تأكيد التسجيل.' 
                  : isEn 
                  ? 'Detailed schedule, verified instructors, and administrative guidelines will be coordinated directly upon registration.' 
                  : 'یہ معلومات (اساتذہ، کورس فیس، اور کلاس شیڈول) بعد میں جامعہ کی اصل معلومات کے ساتھ شامل کی جائیں گی۔'}
              </p>
            </div>

          </div>
        </div>
      )}

      {/* SECTION 3: طریقہ تعاون و بنک اکاؤنٹس */}
      {primaryTab === 'online-taawun' && (
        <DonationView setCurrentTab={setCurrentTab} />
      )}

      {/* SECTION 4: آن لائن داخلہ فارم */}
      {primaryTab === 'online-admission' && (
        <div className="bg-white dark:bg-slate-800 border-2 border-[#B88A3B]/50 rounded-2xl p-6 shadow-md space-y-6">
          <div className="border-b border-stone-200 dark:border-slate-700 pb-4">
            <div className="flex items-center gap-2">
              <Send className="w-6 h-6 text-[#B88A3B]" />
              <h2 className={`text-2xl font-bold ${fontClass} text-[#5C4632] dark:text-amber-300`}>
                {isAr ? 'استمارة القبول الإلكتروني' : isEn ? 'Online Admission Form' : 'آن لائن داخلہ فارم (Online Admission Form)'}
              </h2>
            </div>
            <p className={`text-xs ${fontClass} text-stone-600 dark:text-stone-300 mt-1`}>
              {isAr ? 'يرجى ملء النموذج أدناه للتسجيل في أكاديمية الجامعة الإسلامية الإلكترونية:' : isEn ? 'Please fill out the form below for regular enrollment in Jamia Islamia Online Academy:' : 'آن لائن اکاڈمی میں باقاعدہ داخلہ کے لیے ذیل میں فارم پر کریں:'}
            </p>
          </div>

          {admissionSubmitted ? (
            <div className={`bg-emerald-50 dark:bg-emerald-950/40 border-2 border-emerald-500 rounded-2xl p-6 sm:p-8 text-center space-y-4 ${fontClass} shadow-sm max-w-2xl mx-auto`}>
              <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-900/60 rounded-full flex items-center justify-center mx-auto border-2 border-emerald-600">
                <CheckCircle2 className="w-10 h-10 text-emerald-600 dark:text-emerald-300" />
              </div>
              <h3 className="text-2xl font-bold text-emerald-900 dark:text-emerald-200">
                {isAr ? 'تم استلام طلب التسجيل بنجاح!' : isEn ? 'Admission Application Submitted Successfully!' : 'داخلہ درخواست کامیابی سے موصول ہو گئی ہے!'}
              </h3>
              <p className="text-sm text-stone-600 dark:text-stone-300 max-w-md mx-auto leading-relaxed">
                {isAr 
                  ? 'سيتواصل معك فريق إدارة الأكاديمية عبر الواتساب أو الهاتف لتحديد جدول الحصص.' 
                  : isEn 
                  ? 'Our academic coordinator will contact you shortly via WhatsApp or phone with your class schedule.' 
                  : 'جامعہ اسلامیہ آن لائن اکیڈمی کا ایڈمن جلد ہی آپ سے واٹس ایپ یا فون پر رابطہ کر کے کلاس شیڈول فراہم کرے گا۔'}
              </p>

              {submittedAdmissionBooking && (
                <div className={`bg-white dark:bg-slate-900 border border-emerald-200 dark:border-slate-700 rounded-xl p-3.5 text-xs ${isEn ? 'text-left' : 'text-right'} space-y-1.5 max-w-md mx-auto shadow-xs`}>
                  <div className="flex justify-between items-center text-[11px] pb-1 border-b border-stone-100 dark:border-slate-800">
                    <span className="text-stone-500">{isAr ? 'رقم التسجيل:' : isEn ? 'Registration ID:' : 'رجسٹریشن آئی ڈی:'}</span>
                    <span className="font-mono font-bold text-emerald-700 dark:text-emerald-400">{submittedAdmissionBooking.id}</span>
                  </div>
                  <div><span className="font-bold text-stone-700 dark:text-stone-300">{isAr ? 'اسم الطالب:' : isEn ? 'Student Name:' : 'طالب علم:'}</span> {submittedAdmissionBooking.studentName}</div>
                  <div><span className="font-bold text-stone-700 dark:text-stone-300">{isAr ? 'الدورة:' : isEn ? 'Course:' : 'کورس:'}</span> {submittedAdmissionBooking.course}</div>
                  <div><span className="font-bold text-stone-700 dark:text-stone-300">{isAr ? 'الهاتف:' : isEn ? 'Phone:' : 'رابطہ:'}</span> {submittedAdmissionBooking.phone}</div>
                </div>
              )}

              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
                {admissionWhatsappUrl && (
                  <a
                    href={admissionWhatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full sm:w-auto px-5 py-2.5 bg-[#25D366] hover:bg-[#20ba5a] text-white text-xs sm:text-sm font-bold rounded-xl shadow-sm flex items-center justify-center gap-2 transition-transform hover:scale-[1.02]"
                  >
                    <MessageCircle className="w-4 h-4" />
                    <span>{isAr ? 'إرسال نسخة عبر الواتساب' : isEn ? 'Send Copy via WhatsApp' : 'واٹس ایپ پر فوری نقل بھیجیں'}</span>
                  </a>
                )}

                <button
                  onClick={() => {
                    setAdmissionSubmitted(false);
                    setSubmittedAdmissionBooking(null);
                    setAdmissionWhatsappUrl('');
                    setAdmissionForm({
                      studentName: '',
                      guardianName: '',
                      age: '',
                      country: 'پاکستان (Pakistan)',
                      phone: '',
                      email: '',
                      course: 'آن لائن قرآن کریم (تجوید و حفظ)',
                      preferredTime: 'شام (Evening)',
                    });
                  }}
                  className="w-full sm:w-auto px-5 py-2.5 bg-[#5C4632] hover:bg-[#4a3828] text-white text-xs sm:text-sm font-bold rounded-xl shadow-sm transition-colors cursor-pointer"
                >
                  {isAr ? 'ملء نموذج جديد' : isEn ? 'Submit Another Form' : 'نیا فارم پر کریں'}
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleAdmissionSubmit} className={`space-y-4 ${fontClass} text-xs sm:text-sm`}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-stone-800 dark:text-stone-200 font-bold mb-1">
                    {isAr ? 'اسم الطالب / الطالبة *' : isEn ? 'Student Full Name *' : 'طالب علم / طالبہ کا نام *'}
                  </label>
                  <input
                    type="text"
                    required
                    value={admissionForm.studentName}
                    onChange={(e) => setAdmissionForm({ ...admissionForm, studentName: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-lg border border-stone-300 dark:border-slate-600 bg-stone-50 dark:bg-slate-900 text-stone-900 dark:text-stone-100 focus:outline-none focus:border-[#B88A3B]"
                    placeholder={isAr ? 'أدخل الاسم هنا' : isEn ? 'Enter student name' : 'نام درج کریں'}
                  />
                </div>

                <div>
                  <label className="block text-stone-800 dark:text-stone-200 font-bold mb-1">
                    {isAr ? 'اسم ولي الأمر / الوالد *' : isEn ? 'Guardian / Father Name *' : 'سرپرست کا نام *'}
                  </label>
                  <input
                    type="text"
                    required
                    value={admissionForm.guardianName}
                    onChange={(e) => setAdmissionForm({ ...admissionForm, guardianName: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-lg border border-stone-300 dark:border-slate-600 bg-stone-50 dark:bg-slate-900 text-stone-900 dark:text-stone-100 focus:outline-none focus:border-[#B88A3B]"
                    placeholder={isAr ? 'اسم ولي الأمر' : isEn ? 'Enter guardian name' : 'والد / سرپرست کا نام'}
                  />
                </div>

                <div>
                  <label className="block text-stone-800 dark:text-stone-200 font-bold mb-1">
                    {isAr ? 'العمر (بالسنوات) *' : isEn ? 'Age (Years) *' : 'عمر (سال) *'}
                  </label>
                  <input
                    type="number"
                    required
                    value={admissionForm.age}
                    onChange={(e) => setAdmissionForm({ ...admissionForm, age: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-lg border border-stone-300 dark:border-slate-600 bg-stone-50 dark:bg-slate-900 text-stone-900 dark:text-stone-100 focus:outline-none focus:border-[#B88A3B]"
                    placeholder={isAr ? 'مثال: 12 أو 25' : isEn ? 'e.g. 12 or 25' : 'مثلاً 12 یا 25'}
                  />
                </div>

                <div>
                  <label className="block text-stone-800 dark:text-stone-200 font-bold mb-1">
                    {isAr ? 'الدولة / المدينة الحالية *' : isEn ? 'Current Country / City *' : 'موجودہ ملک / شہر *'}
                  </label>
                  <input
                    type="text"
                    required
                    value={admissionForm.country}
                    onChange={(e) => setAdmissionForm({ ...admissionForm, country: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-lg border border-stone-300 dark:border-slate-600 bg-stone-50 dark:bg-slate-900 text-stone-900 dark:text-stone-100 focus:outline-none focus:border-[#B88A3B]"
                    placeholder={isAr ? 'باكستان، السعودية، الإمارات، المملكة المتحدة' : isEn ? 'Pakistan, Saudi Arabia, UK, USA, etc.' : 'پاکستان، سعودی عرب، یوکے وغیرہ'}
                  />
                </div>

                <div>
                  <label className="block text-stone-800 dark:text-stone-200 font-bold mb-1">
                    {isAr ? 'رقم الواتساب / الهاتف *' : isEn ? 'WhatsApp / Phone Number *' : 'واٹس ایپ / فون نمبر *'}
                  </label>
                  <input
                    type="tel"
                    required
                    value={admissionForm.phone}
                    onChange={(e) => setAdmissionForm({ ...admissionForm, phone: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-lg border border-stone-300 dark:border-slate-600 bg-stone-50 dark:bg-slate-900 text-stone-900 dark:text-stone-100 focus:outline-none focus:border-[#B88A3B]"
                    placeholder="+92 348 9002496"
                    dir="ltr"
                  />
                </div>

                <div>
                  <label className="block text-stone-800 dark:text-stone-200 font-bold mb-1">
                    {isAr ? 'اختر الدورة *' : isEn ? 'Select Desired Course *' : 'کورس کا انتخاب *'}
                  </label>
                  <select
                    value={admissionForm.course}
                    onChange={(e) => setAdmissionForm({ ...admissionForm, course: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-lg border border-stone-300 dark:border-slate-600 bg-stone-50 dark:bg-slate-900 text-stone-900 dark:text-stone-100 focus:outline-none focus:border-[#B88A3B]"
                  >
                    <option value="آن لائن قرآن کریم (تجوید و حفظ)">{isAr ? 'القرآن الكريم (تجويد وحفظ)' : isEn ? 'Online Quran (Tajweed & Hifz)' : 'آن لائن قرآن کریم (تجوید و حفظ)'}</option>
                    <option value="درسِ نظامی آن لائن (مکمل)">{isAr ? 'الدرس النظامي الكامل' : isEn ? 'Full Dars-e-Nizami Course' : 'درسِ نظامی آن لائن (مکمل)'}</option>
                    <option value="عربی زبان کورس">{isAr ? 'دورة اللغة العربية' : isEn ? 'Arabic Language Course' : 'عربی زبان کورس'}</option>
                    <option value="فقہ و اسلامیات">{isAr ? 'الفقه والعلوم الإسلامية' : isEn ? 'Fiqh & Islamic Studies' : 'فقہ و اسلامیات'}</option>
                    <option value="تفسیر القرآن">{isAr ? 'تفسير القرآن الكريم' : isEn ? 'Quran Tafseer Course' : 'تفسیر القرآن'}</option>
                    <option value="حدیث شریف">{isAr ? 'الحديث الشريف وأصوله' : isEn ? 'Hadith Studies Course' : 'حدیث شریف'}</option>
                  </select>
                </div>
              </div>

              <button
                type="submit"
                className={`w-full py-3 bg-[#5C4632] hover:bg-[#433324] text-white font-bold text-sm rounded-xl transition-all shadow-md border border-[#B88A3B] cursor-pointer ${fontClass}`}
              >
                {isAr ? 'إرسال طلب القبول الآن' : isEn ? 'Submit Admission Application' : 'داخلہ فارم جمع کروائیں'}
              </button>
            </form>
          )}
        </div>
      )}

      {/* SECTION 5: مفت آزمائشی کلاس */}
      {primaryTab === 'online-trial' && (
        <div className="bg-white dark:bg-slate-800 border-2 border-[#B88A3B]/50 rounded-2xl p-6 shadow-md space-y-6">
          <div className="border-b border-stone-200 dark:border-slate-700 pb-4">
            <div className="flex items-center gap-2">
              <Zap className="w-6 h-6 text-[#B88A3B]" />
              <h2 className={`text-2xl font-bold ${fontClass} text-[#5C4632] dark:text-amber-300`}>
                {isAr ? 'حصة تجريبية مجانية لمدة ٣ أيام' : isEn ? '3-Day Free Trial Class' : '۳ دن کی مفت آزمائشی کلاس (Free 3-Day Trial Class)'}
              </h2>
            </div>
            <p className={`text-xs ${fontClass} text-stone-600 dark:text-stone-300 mt-1`}>
              {isAr ? 'احجز 3 أيام مجانية كاملة لتجربة الدروس المباشرة والتأكد من الجودة:' : isEn ? 'Experience our live classes with 3 days of completely free trial sessions:' : 'اطمینان کے لیے ۳ دن کی مکمل بلا معاوضہ کلاس حاصل کریں:'}
            </p>
          </div>

          {trialSubmitted ? (
            <div className={`bg-emerald-50 dark:bg-emerald-950/40 border-2 border-emerald-500 rounded-2xl p-6 sm:p-8 text-center space-y-4 ${fontClass} shadow-sm max-w-2xl mx-auto`}>
              <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-900/60 rounded-full flex items-center justify-center mx-auto border-2 border-emerald-600">
                <CheckCircle2 className="w-10 h-10 text-emerald-600 dark:text-emerald-300" />
              </div>
              <h3 className="text-2xl font-bold text-emerald-900 dark:text-emerald-200">
                {isAr ? 'تم تسجيل حجز الحصة التجريبية بنجاح!' : isEn ? 'Free Trial Class Booked Successfully!' : 'مفت ٹرائل کلاس کے لیے آپ کا اندراج ہو گیا ہے!'}
              </h3>
              <p className="text-sm text-stone-600 dark:text-stone-300 max-w-md mx-auto leading-relaxed">
                {isAr 
                  ? 'سيتواصل معك المعلم عبر الواتساب لإرسال رابط الزوم وموعد الحصة التجريبية.' 
                  : isEn 
                  ? 'Our qualified instructor will contact you via WhatsApp with the live meeting link and scheduled time.' 
                  : 'ہمارا استاد / نمائندہ آپ کے واٹس ایپ پر مفت آزمائشی کلاس کے شیڈول اور لنک کے ساتھ رابطہ کرے گا۔'}
              </p>

              {submittedTrialBooking && (
                <div className={`bg-white dark:bg-slate-900 border border-emerald-200 dark:border-slate-700 rounded-xl p-3.5 text-xs ${isEn ? 'text-left' : 'text-right'} space-y-1.5 max-w-md mx-auto shadow-xs`}>
                  <div className="flex justify-between items-center text-[11px] pb-1 border-b border-stone-100 dark:border-slate-800">
                    <span className="text-stone-500">{isAr ? 'رقم حجز التجربة:' : isEn ? 'Trial Booking ID:' : 'ٹرائل بکنگ آئی ڈی:'}</span>
                    <span className="font-mono font-bold text-emerald-700 dark:text-emerald-400">{submittedTrialBooking.id}</span>
                  </div>
                  <div><span className="font-bold text-stone-700 dark:text-stone-300">{isAr ? 'الاسم:' : isEn ? 'Student:' : 'طالب علم:'}</span> {submittedTrialBooking.studentName}</div>
                  <div><span className="font-bold text-stone-700 dark:text-stone-300">{isAr ? 'الدورة:' : isEn ? 'Course:' : 'کورس:'}</span> {submittedTrialBooking.course}</div>
                  <div><span className="font-bold text-stone-700 dark:text-stone-300">{isAr ? 'الواتساب:' : isEn ? 'WhatsApp:' : 'واٹس ایپ:'}</span> {submittedTrialBooking.phone}</div>
                </div>
              )}

              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
                {trialWhatsappUrl && (
                  <a
                    href={trialWhatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full sm:w-auto px-5 py-2.5 bg-[#25D366] hover:bg-[#20ba5a] text-white text-xs sm:text-sm font-bold rounded-xl shadow-sm flex items-center justify-center gap-2 transition-transform hover:scale-[1.02]"
                  >
                    <MessageCircle className="w-4 h-4" />
                    <span>{isAr ? 'تأكيد الحجز عبر الواتساب' : isEn ? 'Confirm via WhatsApp' : 'واٹس ایپ پر تصدیق کریں'}</span>
                  </a>
                )}

                <button
                  onClick={() => {
                    setTrialSubmitted(false);
                    setSubmittedTrialBooking(null);
                    setTrialWhatsappUrl('');
                    setTrialForm({
                      name: '',
                      country: '',
                      phone: '',
                      course: 'آن لائن قرآن کریم (تجوید و حفظ)',
                      whatsapp: ''
                    });
                  }}
                  className="w-full sm:w-auto px-5 py-2.5 bg-[#5C4632] hover:bg-[#4a3828] text-white text-xs sm:text-sm font-bold rounded-xl shadow-sm transition-colors cursor-pointer"
                >
                  {isAr ? 'ملء نموذج جديد' : isEn ? 'Submit Another Form' : 'نیا فارم پر کریں'}
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleTrialSubmit} className={`space-y-4 ${fontClass} text-xs sm:text-sm`}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-stone-800 dark:text-stone-200 font-bold mb-1">
                    {isAr ? 'الاسم الكريم *' : isEn ? 'Your Name *' : 'نام *'}
                  </label>
                  <input
                    type="text"
                    required
                    value={trialForm.name}
                    onChange={(e) => setTrialForm({ ...trialForm, name: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-lg border border-stone-300 dark:border-slate-600 bg-stone-50 dark:bg-slate-900 text-stone-900 dark:text-stone-100 focus:outline-none focus:border-[#B88A3B]"
                    placeholder={isAr ? 'أدخل اسمك الكريم' : isEn ? 'Enter your full name' : 'اپنا نام درج کریں'}
                  />
                </div>

                <div>
                  <label className="block text-stone-800 dark:text-stone-200 font-bold mb-1">
                    {isAr ? 'الدولة / المدينة *' : isEn ? 'Country / City *' : 'ملک *'}
                  </label>
                  <input
                    type="text"
                    required
                    value={trialForm.country}
                    onChange={(e) => setTrialForm({ ...trialForm, country: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-lg border border-stone-300 dark:border-slate-600 bg-stone-50 dark:bg-slate-900 text-stone-900 dark:text-stone-100 focus:outline-none focus:border-[#B88A3B]"
                    placeholder={isAr ? 'مثال: باكستان أو السعودية' : isEn ? 'e.g. Pakistan, Saudi Arabia, USA' : 'مثلاً پاکستان یا سعودی عرب'}
                  />
                </div>

                <div>
                  <label className="block text-stone-800 dark:text-stone-200 font-bold mb-1">
                    {isAr ? 'رقم الواتساب *' : isEn ? 'WhatsApp Number *' : 'واٹس ایپ نمبر *'}
                  </label>
                  <input
                    type="tel"
                    required
                    value={trialForm.whatsapp}
                    onChange={(e) => setTrialForm({ ...trialForm, whatsapp: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-lg border border-stone-300 dark:border-slate-600 bg-stone-50 dark:bg-slate-900 text-stone-900 dark:text-stone-100 focus:outline-none focus:border-[#B88A3B]"
                    placeholder="+92 348 9002496"
                    dir="ltr"
                  />
                </div>

                <div>
                  <label className="block text-stone-800 dark:text-stone-200 font-bold mb-1">
                    {isAr ? 'الدورة المطلوبة *' : isEn ? 'Desired Course *' : 'مطلوبہ کورس *'}
                  </label>
                  <select
                    value={trialForm.course}
                    onChange={(e) => setTrialForm({ ...trialForm, course: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-lg border border-stone-300 dark:border-slate-600 bg-stone-50 dark:bg-slate-900 text-stone-900 dark:text-stone-100 focus:outline-none focus:border-[#B88A3B]"
                  >
                    <option value="آن لائن قرآن کریم (تجوید و حفظ)">{isAr ? 'القرآن الكريم (تجويد وحفظ)' : isEn ? 'Online Quran (Tajweed & Hifz)' : 'آن لائن قرآن کریم (تجوید و حفظ)'}</option>
                    <option value="درسِ نظامی آن لائن">{isAr ? 'الدرس النظامي عبر الإنترنت' : isEn ? 'Online Dars-e-Nizami' : 'درسِ نظامی آن لائن'}</option>
                  </select>
                </div>
              </div>

              <button
                type="submit"
                className={`w-full py-3 bg-[#B88A3B] hover:bg-[#a17831] text-slate-950 font-black text-sm rounded-xl transition-all shadow-md cursor-pointer ${fontClass}`}
              >
                {isAr ? 'ابدأ الحصة التجريبية المجانية' : isEn ? 'Start 3-Day Free Trial' : 'مفت ٹرائل کلاس کا آغاز کریں'}
              </button>
            </form>
          )}
        </div>
      )}

      {/* FUTURE READY INTEGRATION BADGES */}
      <div className={`bg-[#5C4632] text-[#F8F4EC] rounded-2xl p-6 border-2 border-[#B88A3B] shadow-md space-y-3 ${fontClass}`}>
        <h3 className="text-lg font-bold text-[#B88A3B] flex items-center gap-2">
          <Video className="w-5 h-5 text-[#B88A3B]" />
          <span>{isAr ? 'المنصات التفاعلية والتقنية المعتمدة' : isEn ? 'Live Classroom & Interactive Systems' : 'آن لائن تدریسی و آن لائن پیمنٹ پلیٹ فارمز (Live System Features)'}</span>
        </h3>
        <p className="text-xs text-stone-300">
          {isAr 
            ? 'تُجرى كافة الدروس عبر منصات اتصال تفاعلية آمنة وعالية الوضوح لدعم الطلاب في كل مكان:' 
            : isEn 
            ? 'All live classes are conducted via secure, high-definition interactive video platforms:' 
            : 'تمام لائیو آن لائن کلاسز سیکیور ویڈیو پلیٹ فارمز کے ذریعے لی جاتی ہیں اور تمام تر فیچرز آن لائن ریڈی ہیں:'}
        </p>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 pt-2 text-center text-xs font-bold">
          <div className="bg-white/10 p-2.5 rounded-xl border border-white/20">Zoom Meetings</div>
          <div className="bg-white/10 p-2.5 rounded-xl border border-white/20">Google Meet</div>
          <div className="bg-white/10 p-2.5 rounded-xl border border-white/20">MS Teams</div>
          <div className="bg-white/10 p-2.5 rounded-xl border border-white/20">WhatsApp Call</div>
          <div className="bg-white/10 p-2.5 rounded-xl border border-white/20">{isAr ? 'قبول فوري' : isEn ? 'Online Admission' : 'Online Admission'}</div>
          <div className="bg-white/10 p-2.5 rounded-xl border border-white/20">{isAr ? 'تبرع ودفع آمن' : isEn ? 'Online Payment' : 'Online Payment'}</div>
        </div>
      </div>

      {/* FREQUENTLY ASKED QUESTIONS */}
      <div className={`bg-white dark:bg-slate-800 border-2 border-[#B88A3B]/50 rounded-2xl p-6 shadow-md space-y-4 ${fontClass}`}>
        <h3 className="text-xl font-bold text-[#5C4632] dark:text-amber-300 flex items-center gap-2">
          <HelpCircle className="w-5 h-5 text-[#B88A3B]" />
          <span>{isAr ? 'الأسئلة الشائعة حول الأكاديمية' : isEn ? 'Frequently Asked Questions (FAQs)' : 'اکثر پوچھے جانے والے سوالات (FAQs)'}</span>
        </h3>

        <div className="space-y-3">
          {onlineFaqs.map((faq, index) => (
            <div key={index} className="border border-stone-200 dark:border-slate-700 rounded-xl overflow-hidden">
              <button
                onClick={() => setOpenFaq(openFaq === index ? null : index)}
                className={`w-full ${isEn ? 'text-left' : 'text-right'} p-3.5 bg-[#F8F4EC] dark:bg-slate-900 hover:bg-[#5C4632]/10 flex items-center justify-between font-bold text-xs sm:text-sm text-stone-800 dark:text-stone-200 cursor-pointer`}
              >
                <span>{faq.q}</span>
                {openFaq === index ? <ChevronUp className="w-4 h-4 text-[#B88A3B]" /> : <ChevronDown className="w-4 h-4 text-[#B88A3B]" />}
              </button>
              {openFaq === index && (
                <div className={`p-4 bg-white dark:bg-slate-800 text-xs text-stone-600 dark:text-stone-300 leading-relaxed border-t border-stone-200 dark:border-slate-700 ${isEn ? 'text-left' : 'text-right'}`}>
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
