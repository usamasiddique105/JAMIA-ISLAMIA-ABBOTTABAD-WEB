import React, { createContext, useContext, useState, useEffect } from 'react';
import { Language } from '../types';

interface ThemeLanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  darkMode: boolean;
  setDarkMode: (val: boolean) => void;
  dir: 'rtl' | 'ltr';
  t: (key: string) => string;
}

const translations: Record<Language, Record<string, string>> = {
  ur: {
    home: 'صفحہ اول',
    about: 'عن الجامعہ (تعارف)',
    history: 'تاریخ و قیام',
    vision: 'نصب العین و مقاصد',
    principalMsg: 'پیغام مہتمم',
    darulIfta: 'دار الافتاء',
    submitFatwa: 'آن لائن فتویٰ پوچھیں',
    fatwaArchive: 'فتاویٰ آرکائیو',
    academics: 'شعبہ جات و تعلیم',
    departments: 'تعلیمی شعبہ جات',
    faculty: 'اساتذہ کرام و مفتیان',
    admissions: 'شرائطِ داخلہ',
    library: 'کتب خانہ و مطبوعات',
    books: 'کتب و مضامین',
    magazine: 'ماہنامہ "الجامعہ"',
    media: 'آڈیو، ویڈیو و گیلری',
    khutbahs: 'خطباتِ جمعہ',
    lectures: 'بیانات و دسروس',
    gallery: 'تصویری گیلری',
    results: 'نتائج امتحانات',
    news: 'خبریں و اعلانات',
    donations: 'عطیات و صدقات',
    zakat: 'زکوۃ و صدقات',
    buildingFund: 'تعمیراتی فنڈ',
    studentSponsor: 'کفالتِ طلبہ',
    contact: 'رابطہ کریں',
    faq: 'سوالات و جوابات (FAQ)',
    adminPortal: 'ایڈمن کنٹرول پینل',
    searchPlaceholder: 'فتاویٰ، کتابیں، خبریں یا رول نمبر تلاش کریں...',
    prayerTimes: 'اوقاتِ نماز (ایبٹ آباد)',
    hijriDate: '۲۵ صفر ۱۴۴۸ھ',
    nextPrayer: 'اگلی نماز',
    whatsapp: 'واتس اب رابطہ',
    visitorCount: 'کل زائرین کی تعداد',
    copyright: '© ۲۰۲۶ جامعہ اسلامیہ ایبٹ آباد، پاکستان۔ جملہ حقوق بحق جامعہ محفوظ ہیں۔',
    quickLinks: 'اہمی لنکس',
    phoneLabel: 'فون نمبرز',
    emailLabel: 'ای میل',
    addressLabel: 'پتہ',
    readMore: 'مزید پڑھیں',
    downloadPdf: 'PDF ڈاؤن لوڈ کریں',
    print: 'پرنٹ کریں',
    askQuestion: 'اپنا سوال ارسال کریں',
    viewAll: 'تمام دیکھیں',
    totalStudents: '۳,۵۰۰+ طلبہ و طالبات',
    totalFaculty: '۱۲۰+ شیوخ و اساتذہ',
    totalFatwas: '۴۵,۰۰۰+ جاری شدہ فتاویٰ',
    yearsExcellence: '۷۵+ سالہ تعلیمی خدمات',
    searchTitle: 'جامعہ گلوبل سرچ پورٹل',
    search: 'تلاش کریں',
    searchKeyword: 'مطلوبہ لفظ',
    fatwaNo: 'فتویٰ نمبر',
    selectCategory: 'شعبہ منتخب کریں',
    selectChapter: 'باب منتخب کریں',
    selectSubChapter: 'ضمنی منتخب کریں',
    askQuestionTitle: 'طلب فتویٰ شرعیہ',
    submitQuestionBtn: 'سوال پوچھیں',
    backToList: 'واپس تمام فتاویٰ کی فہرست پر جائیں',
    copiedText: 'کاپی ہو گیا',
    copyLinkText: 'لنک کاپی کریں',
    viewsLabel: 'کل مشاہدات',
    evidenceLabel: 'وَالدَّلِيلُ عَلَى ذَلِكَ',
    answerHeader: 'الْجَوَابُ بِاسْمِ مُلْهِمِ الصَّوَابْ',
    questionHeader: 'ســوال',
    conclusionText: 'فقط والله تعالی اعلم بالصواب',
  },
  en: {
    home: 'Home',
    about: 'About Jamia',
    history: 'History & Genesis',
    vision: 'Vision & Mission',
    principalMsg: "Principal's Message",
    darulIfta: 'Darul Ifta',
    submitFatwa: 'Ask Online Fatwa',
    fatwaArchive: 'Fatwa Archive',
    academics: 'Academics',
    departments: 'Academic Departments',
    faculty: 'Scholars & Faculty',
    admissions: 'Admission Info',
    library: 'Digital Library',
    books: 'Books & Articles',
    magazine: 'Monthly Magazine',
    media: 'Audio, Video & Gallery',
    khutbahs: 'Friday Khutbahs',
    lectures: 'Lectures & Discourses',
    gallery: 'Photo Gallery',
    results: 'Exam Results Portal',
    news: 'News & Events',
    donations: 'Donations & Funds',
    zakat: 'Zakat & Sadaqah',
    buildingFund: 'Building Fund',
    studentSponsor: 'Student Sponsorship',
    contact: 'Contact Us',
    faq: 'FAQs',
    adminPortal: 'Admin CMS Portal',
    searchPlaceholder: 'Search fatwas, books, news, or roll numbers...',
    prayerTimes: 'Prayer Times (Abbottabad)',
    hijriDate: '25 Safar 1448 AH',
    nextPrayer: 'Next Prayer',
    whatsapp: 'WhatsApp Support',
    visitorCount: 'Total Visitors Count',
    copyright: '© 2026 Jamia Islamia Abbottabad, Pakistan. All Rights Reserved.',
    quickLinks: 'Quick Links',
    phoneLabel: 'Phone',
    emailLabel: 'Email',
    addressLabel: 'Address',
    readMore: 'Read More',
    downloadPdf: 'Download PDF',
    print: 'Print Document',
    askQuestion: 'Submit Your Question',
    viewAll: 'View All',
    totalStudents: '3,500+ Enrolled Students',
    totalFaculty: '120+ Renowned Scholars',
    totalFatwas: '45,000+ Verified Fatwas',
    yearsExcellence: '75+ Years of Service',
    searchTitle: 'Jamia Global Search Portal',
    search: 'Search',
    searchKeyword: 'Keywords',
    fatwaNo: 'Fatwa Record No',
    selectCategory: 'Select Category',
    selectChapter: 'Select Chapter',
    selectSubChapter: 'Select Sub-topic',
    askQuestionTitle: 'Ask a Question',
    submitQuestionBtn: 'Submit Question',
    backToList: 'Back to All Fatwas',
    copiedText: 'Copied',
    copyLinkText: 'Copy Link',
    viewsLabel: 'Total Views',
    evidenceLabel: 'Evidence & References',
    answerHeader: 'Answer in the Name of Allah',
    questionHeader: 'Question',
    conclusionText: 'And Allah Almighty knows best',
  },
  ar: {
    home: 'الرئيسية',
    about: 'عن الجامعة',
    history: 'تاريخ الجامعة',
    vision: 'الرؤية والرسالة',
    principalMsg: 'كلمة مدير الجامعة',
    darulIfta: 'دار الإفتاء',
    submitFatwa: 'إرسال فتوى إلكترونية',
    fatwaArchive: 'أرشيف الفتاوى',
    academics: 'الكليات والأقسام',
    departments: 'الأقسام الأكاديمية',
    faculty: 'أعضاء الهيئة التدريسية',
    admissions: 'دليل القبول',
    library: 'المكتبة الرقمية',
    books: 'الكتب والمقالات',
    magazine: 'مجلة "الجامعة"',
    media: 'المكتبة الصوتية والمرئية',
    khutbahs: 'خطب الجمعة',
    lectures: 'المحاضرات والدروس',
    gallery: 'معرض الصور',
    results: 'نتائج الامتحانات',
    news: 'الأخبار والفعاليات',
    donations: 'التبرعات والأوقاف',
    zakat: 'الزكاة والصدقات',
    buildingFund: 'صندوق الإعمار',
    studentSponsor: 'كفالة طالب علم',
    contact: 'اتصل بنا',
    faq: 'الأسئلة الشائعة',
    adminPortal: 'لوحة التحكم والإدارة',
    searchPlaceholder: 'ابحث عن الفتاوى، الكتب، الأخبار أو أرقام الجلوس...',
    prayerTimes: 'مواقيت الصلاة (أبت أباد)',
    hijriDate: '٢٥ صفر ١٤٤٨ هـ',
    nextPrayer: 'الصلاة القادمة',
    whatsapp: 'تواصل عبر واتساب',
    visitorCount: 'إجمالي عدد الزوار',
    copyright: '© ٢٠٢٦ الجامعة الإسلامية أبت أباد، باكستان. جميع الحقوق محفوظة.',
    quickLinks: 'روابط سريعة',
    phoneLabel: 'الهاتف',
    emailLabel: 'البريد الإلكتروني',
    addressLabel: 'العنوان',
    readMore: 'اقرأ المزيد',
    downloadPdf: 'تحميل ملف PDF',
    print: 'طباعة',
    askQuestion: 'أرسل سؤالك الشرعي',
    viewAll: 'عرض الكل',
    totalStudents: '٣,٥٠٠+ طالب وطالبة',
    totalFaculty: '١٢٠+ من كبار العلماء',
    totalFatwas: '٤٥,٠٠٠+ فتوى شرعية',
    yearsExcellence: '٧٥+ عاماً في خدمة العلم',
    searchTitle: 'البحث الشامل في موقع الجامعة',
    search: 'بحث',
    searchKeyword: 'الكلمة المفتاحية',
    fatwaNo: 'رقم الفتوى',
    selectCategory: 'اختر القسم الشرعي',
    selectChapter: 'اختر الباب',
    selectSubChapter: 'اختر الفرع',
    askQuestionTitle: 'طلب فتوى شرعية',
    submitQuestionBtn: 'إرسال سؤال للفتوى',
    backToList: 'العودة إلى قائمة الفتاوى',
    copiedText: 'تم النسخ',
    copyLinkText: 'نسخ الرابط',
    viewsLabel: 'إجمالي المشاهدات',
    evidenceLabel: 'وَالدَّلِيلُ عَلَى ذَلِكَ',
    answerHeader: 'الْجَوَابُ بِاسْمِ مُلْهِمِ الصَّوَابْ',
    questionHeader: 'الســؤال',
    conclusionText: 'فقط والله تعالى أعلم بالصواب',
  }
};

const detectDefaultLanguage = (): Language => {
  try {
    // 1. Check browser languages
    const browserLangs = (typeof navigator !== 'undefined' && navigator.languages && navigator.languages.length > 0)
      ? navigator.languages
      : (typeof navigator !== 'undefined' ? [navigator.language || ''] : ['ur']);
    
    for (const l of browserLangs) {
      const code = (l || '').toLowerCase();
      if (code.startsWith('ur') || code.startsWith('pa') || code.startsWith('sd') || code.startsWith('ps') || code.startsWith('ks') || code.startsWith('hi') || code.startsWith('bn')) {
        return 'ur';
      }
      if (code.startsWith('ar')) {
        return 'ar';
      }
    }

    // 2. Check user timezone
    if (typeof Intl !== 'undefined' && Intl.DateTimeFormat) {
      const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone || '';
      const tzLower = timeZone.toLowerCase();

      // South Asia (Pakistan, India, Bangladesh, Afghanistan) -> Urdu
      const southAsiaZones = [
        'karachi', 'islamabad', 'lahore', 'kolkata', 'calcutta', 'dhaka', 'kabul', 'kathmandu', 'thimphu', 'colombo', 'pk', 'in', 'bd', 'af'
      ];
      if (southAsiaZones.some(z => tzLower.includes(z))) {
        return 'ur';
      }

      // Middle East & Arab countries (Saudi, UAE, Qatar, Kuwait, Egypt, etc.) -> Arabic
      const arabZones = [
        'riyadh', 'dubai', 'qatar', 'kuwait', 'bahrain', 'muscat', 'amman', 'beirut', 'damascus', 
        'baghdad', 'cairo', 'tripoli', 'tunis', 'algiers', 'casablanca', 'khartoum', 'jerusalem', 
        'gaza', 'hebron', 'aden', 'sanaa', 'mecca', 'medina', 'jeddah', 'sharjah', 'abu_dhabi'
      ];
      if (arabZones.some(z => tzLower.includes(z))) {
        return 'ar';
      }
    }

    // Default for Western/Europe/America and all other international regions -> English
    return 'en';
  } catch (e) {
    return 'ur';
  }
};

const ThemeLanguageContext = createContext<ThemeLanguageContextType | undefined>(undefined);

export const ThemeLanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>(() => {
    if (typeof window !== 'undefined') {
      const savedLang = localStorage.getItem('jia_lang') as Language;
      if (savedLang && ['ur', 'en', 'ar'].includes(savedLang)) {
        return savedLang;
      }
      return detectDefaultLanguage();
    }
    return 'ur';
  });

  const [darkMode, setDarkMode] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('jia_dark') === 'true';
    }
    return false;
  });

  useEffect(() => {
    const savedLang = localStorage.getItem('jia_lang') as Language;
    if (!savedLang || !['ur', 'en', 'ar'].includes(savedLang)) {
      const detected = detectDefaultLanguage();
      setLanguage(detected);
      localStorage.setItem('jia_lang', detected);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('jia_lang', language);
    document.documentElement.dir = language === 'en' ? 'ltr' : 'rtl';
    document.documentElement.lang = language;
  }, [language]);

  useEffect(() => {
    localStorage.setItem('jia_dark', String(darkMode));
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  const dir = language === 'en' ? 'ltr' : 'rtl';

  const t = (key: string): string => {
    return translations[language]?.[key] || translations['en']?.[key] || key;
  };

  return (
    <ThemeLanguageContext.Provider value={{ language, setLanguage, darkMode, setDarkMode, dir, t }}>
      {children}
    </ThemeLanguageContext.Provider>
  );
};

export const useThemeLanguage = () => {
  const ctx = useContext(ThemeLanguageContext);
  if (!ctx) throw new Error('useThemeLanguage must be used within ThemeLanguageProvider');
  return ctx;
};
