import React, { useState, useEffect, useRef } from 'react';
import { useThemeLanguage } from '../context/ThemeLanguageContext';
import headerLogoCalligraphy from '../assets/images/jamia_logo_calligraphy_transparent.png';
import { JAMIA_HEADER_LOGO_DATA_URI } from '../assets/logoBase64';
import { getHijriAndGregorianDate } from '../utils/hijriDate';
import { 
  BookOpen, 
  Search, 
  Sparkles, 
  ChevronDown, 
  ChevronUp,
  ChevronLeft,
  Menu, 
  X, 
  Moon, 
  Sun, 
  Globe, 
  Clock, 
  ShieldAlert,
  Heart,
  Calendar,
  Building2,
  Phone,
  Mail,
  ShieldCheck,
  UserCheck,
  Target,
  Landmark,
  GraduationCap,
  HelpCircle,
  BookMarked,
  Bookmark,
  FileText,
  PhoneCall,
  Send,
  Zap,
  Facebook,
  Youtube,
  MessageSquare
} from 'lucide-react';

interface NavbarProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
  onOpenSearch: () => void;
  onOpenFatwaModal: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  setCurrentTab,
  onOpenSearch,
  onOpenFatwaModal,
}) => {
  const { language, setLanguage, t, darkMode, setDarkMode } = useThemeLanguage();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const [activeSubDropdown, setActiveSubDropdown] = useState<string | null>(null);
  const [showLangMenu, setShowLangMenu] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [expandedMobileItem, setExpandedMobileItem] = useState<string | null>(null);
  const [expandedMobileSubItem, setExpandedMobileSubItem] = useState<string | null>(null);
  const headerRef = useRef<HTMLElement>(null);
  const langDropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click or tap
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent | TouchEvent) => {
      const target = event.target as Node;
      if (headerRef.current && !headerRef.current.contains(target)) {
        setOpenMenuId(null);
        setShowLangMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('touchstart', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, []);

  // Close open dropdown whenever tab changes
  useEffect(() => {
    setOpenMenuId(null);
    setExpandedMobileItem(null);
    setExpandedMobileSubItem(null);
  }, [currentTab]);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 25) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
      setOpenMenuId(null);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Today's date formatted (Hijri & Gregorian dynamically calculated)
  const todayDates = getHijriAndGregorianDate(new Date(), language);
  const gregorianDate = todayDates.gregorianFull;

  const navItems = [
    { 
      id: 'about', 
      label: language === 'ur' ? 'تعارفِ جامعہ' : language === 'ar' ? 'عن الجامعة' : 'About Jamia',
      children: [
        { 
          id: 'about-overview', 
          label: language === 'ur' ? 'تعارفِ جامعہ' : language === 'ar' ? 'نبذة عن الجامعة' : 'About Jamia', 
          desc: language === 'ur' ? 'جامعہ کی تاریخ، امتیازات اور خدمات کا اجمالی جائزہ' : language === 'ar' ? 'تاريخ الجامعة وميزاتها ورسالتها' : 'History and mission of Jamia Islamia',
          icon: Bookmark,
          tab: 'about-overview' 
        },
        { 
          id: 'about-founder', 
          label: language === 'ur' ? 'بانیِ جامعہ و اکابرین' : language === 'ar' ? 'مؤسس الجامعة وكبار العلماء' : 'Founder & Luminaries', 
          desc: language === 'ur' ? 'حضرت شیخ الحدیث مولانا فضل مولیٰؒ و اکابرینِ جامعہ' : language === 'ar' ? 'سماحة الشيخ فضل مولى رحمه الله والعلماء الأجلاء' : 'Hazrat Maulana Fazl-e-Maula (RA)',
          icon: UserCheck,
          tab: 'about-founder' 
        },
        { 
          id: 'about-objectives', 
          label: language === 'ur' ? 'اغراض و مقاصد' : language === 'ar' ? 'الأهداف والغايات' : 'Objectives', 
          desc: language === 'ur' ? 'علومِ شرعیہ کی اشاعت، افتاء اور اصلاحِ معاشرہ' : language === 'ar' ? 'نشر العلوم الشرعية، الإفتاء وإصلاح المجتمع' : 'Islamic teachings and societal reform',
          icon: Target,
          tab: 'about-objectives' 
        },
        { 
          id: 'about-administration', 
          label: language === 'ur' ? 'نظم و نسق و شوریٰ' : language === 'ar' ? 'مجلس الإدارة والشورى' : 'Administration', 
          desc: language === 'ur' ? 'مجلسِ شوریٰ اور تعلیمی انتظامی ڈھانچہ' : language === 'ar' ? 'مجلس الشورى والهيكل الإداري والتعليمي' : 'Governing body and educational leadership',
          icon: Building2,
          tab: 'about-administration' 
        },
        { 
          id: 'about-rules', 
          label: language === 'ur' ? 'ضروری ہدایات و قواعد' : language === 'ar' ? 'القواعد والتعليمات' : 'Rules & Guidelines', 
          desc: language === 'ur' ? 'طلبہ کرام کے لیے تعلیمی و تربیتی ضوابط' : language === 'ar' ? 'الضوابط والتعليمات العامة للطلاب' : 'Academic and behavioral guidelines',
          icon: ShieldCheck,
          tab: 'about-rules' 
        },
        { 
          id: 'about-expenses', 
          label: language === 'ur' ? 'مصارف و فنڈز' : language === 'ar' ? 'المصارف والأوقاف' : 'Expenses & Boarding', 
          desc: language === 'ur' ? 'طلبا کی مفت تعلیم، طعام، قیام اور شعبہ جات فنڈز' : language === 'ar' ? 'التعليم المجاني، الإطعام، السكن وصناديق الأقسام' : 'Free education, food, and boarding funds',
          icon: Landmark,
          tab: 'about-expenses' 
        },
        { 
          id: 'departments', 
          label: language === 'ur' ? 'نظامِ تعلیم و شعبہ جات' : language === 'ar' ? 'النظام الأكاديمي والأقسام' : 'Academic System',
          desc: language === 'ur' ? 'درسِ نظامی، تخصص فی الافتاء، تجوید و تحفیظ' : language === 'ar' ? 'درس نظامي، التخصص في الإفتاء، التجويد والتحفيظ' : 'Dars-e-Nizami, Fatwa, Hifz',
          icon: GraduationCap,
          tab: 'departments',
          subChildren: [
            { 
              id: 'dep-dars', 
              label: language === 'ur' ? 'شعبہ درسِ نظامی' : language === 'ar' ? 'كلية الشريعة والدرس النظامي' : 'Dars-e-Nizami Faculty', 
              desc: language === 'ur' ? '۸ سالہ عالم فاضل ڈگری کورس' : language === 'ar' ? 'برنامج العالم والشهادة العالمية ٨ سنوات' : '8-Year Alim Fazil Degree Course', 
              tab: 'departments' 
            },
            { 
              id: 'dep-ifta', 
              label: language === 'ur' ? 'شعبہ تخصص فی الافتاء' : language === 'ar' ? 'قسم التخصص في الإفتاء' : 'Specialization in Fatwa', 
              desc: language === 'ur' ? 'مفتی کورس و تدریب فی الافتاء' : language === 'ar' ? 'دورة المفتي والتدريب على الإفتاء الشرعي' : 'Mufti Course & Training in Ifta', 
              tab: 'departments' 
            },
            { 
              id: 'dep-tajweed', 
              label: language === 'ur' ? 'شعبہ تجوید و تحفیظ' : language === 'ar' ? 'قسم التجويد وتحفيظ القرآن' : 'Tajweed & Hifz Division', 
              desc: language === 'ur' ? 'حفظِ قرآن کریم اور سبعہ قراءات' : language === 'ar' ? 'حفظ القرآن الكريم والقراءات السبع' : 'Hifz of Holy Quran & Qira’at', 
              tab: 'departments' 
            },
            { 
              id: 'dep-online', 
              label: language === 'ur' ? 'آن لائن شعبہ تدریس' : language === 'ar' ? 'التعليم والتدريس الإلكتروني' : 'Online Academy', 
              desc: language === 'ur' ? 'تجوید، عربی اور دراسات اسلامیہ آن لائن' : language === 'ar' ? 'التجويد، اللغة العربية والدراسات الإسلامية عن بعد' : 'Tajweed, Arabic & Islamic studies online', 
              tab: 'online-services' 
            },
          ]
        },
      ]
    },
    { 
      id: 'fatwas', 
      label: language === 'ur' ? 'دار الافتاء' : language === 'ar' ? 'دار الإفتاء' : 'Darul Ifta',
      children: [
        { 
          id: 'fatwa-new', 
          label: language === 'ur' ? 'آن لائن فتویٰ پوچھیں' : language === 'ar' ? 'طلب فتوى شرعية' : 'Ask Online Fatwa', 
          desc: language === 'ur' ? 'دار الافتاء سے اپنے سوالات کا شرعی جواب حاصل کریں' : language === 'ar' ? 'الحصول على الإجابة والفتوى المعتمدة من المفتين' : 'Submit questions to Muftis for authentic rulings',
          icon: HelpCircle,
          isModal: true,
          tab: 'fatwa-new' 
        },
        { 
          id: 'fatwa-archive', 
          label: language === 'ur' ? 'نئے سوالات' : language === 'ar' ? 'الأسئلة الجديدة' : 'New Questions', 
          desc: language === 'ur' ? 'عبادات، معاملات اور عقائد کے مستند شرعی جوابات' : language === 'ar' ? 'إجابات وفتاوى معتمدة في العبادات والمعاملات والعقائد' : 'Search rulings on Islamic law and daily issues',
          icon: BookOpen,
          tab: 'fatwas' 
        },
        { 
          id: 'fatwa-names', 
          label: language === 'ur' ? 'اسلامی نام ڈائریکٹری' : language === 'ar' ? 'دليل الأسماء الإسلامية' : 'Islamic Names Directory', 
          desc: language === 'ur' ? 'بچوں کے خوبصورت اور بابرکت اسلامی نام اور معانی' : language === 'ar' ? 'أسماء إسلامية مباركة ومعانيها الطيبة للأبناء والبنات' : 'Authentic Islamic baby names and meanings',
          icon: BookMarked,
          tab: 'fatwa-names' 
        },
        { 
          id: 'fatwa-duas', 
          label: language === 'ur' ? 'مسنون و معروف دعائیں' : language === 'ar' ? 'الأدعية المأثورة والأذكار' : 'Masnoon Duas & Azkar', 
          desc: language === 'ur' ? 'روزمرہ مسنون دعائیں، اذکار اور اورادِ مبارکہ' : language === 'ar' ? 'الأدعية النبوية اليومية وأذكار الصباح والمساء والأوراد' : 'Daily prophetic supplications and morning/evening azkar',
          icon: Sparkles,
          tab: 'fatwa-duas' 
        },
      ]
    },
    { 
      id: 'library', 
      label: language === 'ur' ? 'نشر و اشاعت' : language === 'ar' ? 'النشر والمطبوعات' : 'Publications',
      children: [
        { 
          id: 'sub-journal', 
          label: language === 'ur' ? 'ماہنامہ "الجامعہ" ایبٹ آباد' : language === 'ar' ? 'مجلة "الجامعة" الشهرية بأبت آباد' : 'Monthly Journal Al-Jamia', 
          desc: language === 'ur' ? 'جامعہ کا سرکاری دینی و علمی مجلہ پی ڈی ایف' : language === 'ar' ? 'المجلة العلمية والدينية الرسمية للجامعة بصيغة PDF' : 'Official monthly research magazine in PDF',
          icon: BookOpen,
          tab: 'library' 
        },
        { 
          id: 'sub-books', 
          label: language === 'ur' ? 'کتب و رسائل لائبریری' : language === 'ar' ? 'مكتبة الكتب والرسائل العلمية' : 'Books & Research Library', 
          desc: language === 'ur' ? 'علماءِ جامعہ کی تصانیف اور درسی کتب پی ڈی ایف' : language === 'ar' ? 'مؤلفات علماء الجامعة والكتب الدراسية بصيغة PDF' : 'PDF library of Islamic books and scholarly works',
          icon: FileText,
          tab: 'library' 
        },
      ]
    },
    { 
      id: 'online-services', 
      label: language === 'ur' ? 'آن لائن خدمات' : language === 'ar' ? 'الخدمات الإلكترونية' : 'Online Services',
      children: [
        { 
          id: 'online-quran-dars', 
          label: language === 'ur' ? 'آن لائن قرآن کریم و درسِ نظامی' : language === 'ar' ? 'أكاديمية القرآن الكريم والدرس النظامي' : 'Online Quran & Dars-e-Nizami', 
          desc: language === 'ur' ? 'ناظرہ، تجوید، حفظ اور مکمل درسِ نظامی آن لائن' : language === 'ar' ? 'القرآن الكريم والعلوم الإسلامية والدرس النظامي عبر الإنترنت' : 'Online Quran recitation, Tajweed, Hifz & Dars-e-Nizami',
          icon: BookOpen,
          tab: 'online-services' 
        },
        { 
          id: 'online-taawun', 
          label: language === 'ur' ? 'طریقہ تعاون' : language === 'ar' ? 'طريقة التعاون' : 'Donation & Contribution', 
          desc: language === 'ur' ? 'زکوٰۃ، صدقات اور عطیات کے لیے بنک اکاؤنٹس کی مکمل تفصیل' : language === 'ar' ? 'الحسابات البنكية للتبرعات والزكاة والصدقات' : 'Official bank accounts and guidance for donations and Zakat',
          icon: Heart,
          tab: 'donations' 
        },
        { 
          id: 'online-contact', 
          label: language === 'ur' ? 'رابطہ و معلومات' : language === 'ar' ? 'الاتصال والاستفسار' : 'Contact & Inquiries', 
          desc: language === 'ur' ? 'پتہ، فون نمبرز اور آن لائن میسج' : language === 'ar' ? 'العنوان، أرقام الهواتف والتواصل المباشر' : 'Address, phones and online inquiry',
          icon: PhoneCall,
          tab: 'contact' 
        }
      ]
    }
  ];

  return (
    <header ref={headerRef} className="sticky top-0 z-[100] w-full font-sans shadow-md">
      {/* 1. TOP INFORMATION BAR (گہرا چاکلیٹی/کالا پس منظر اور سفید تحریر) */}
      <div 
        className="w-full text-white px-3 sm:px-6 lg:px-8 select-none border-b border-stone-800 relative z-50 py-1 sm:py-1.5" 
        style={{ backgroundColor: '#242424', color: '#ffffff' }}
        dir="rtl"
      >
        <div className="max-w-[1400px] mx-auto flex items-center justify-between gap-2 sm:gap-3 w-full min-h-[30px] sm:min-h-[32px] relative z-50">
          
          {/* RIGHT SIDE (RTL): Hijri & Gregorian Date */}
          <div className="flex items-center gap-1 font-bold whitespace-nowrap shrink-0 text-white text-[10px] xs:text-xs sm:text-sm md:text-base leading-none py-0.5">
            {language === 'ar' ? (
              <span className="text-[11px] xs:text-xs sm:text-base md:text-lg inline-flex items-center gap-1 leading-none" style={{ fontFamily: "'Amiri', 'Noto Naskh Arabic', serif" }}>
                <span className="text-amber-200 font-semibold">{todayDates.hijriFull}</span>
                <span className="hidden xs:inline opacity-60">•</span>
                <span className="hidden xs:inline opacity-90">{todayDates.gregorianFull}</span>
              </span>
            ) : language === 'en' ? (
              <span className="font-sans text-[10px] xs:text-xs sm:text-sm md:text-base inline-flex items-center gap-1.5 leading-none font-semibold">
                <span className="text-amber-200 font-bold">{todayDates.hijriFull}</span>
                <span className="hidden xs:inline opacity-60">•</span>
                <span className="hidden xs:inline opacity-90">{todayDates.gregorianFull}</span>
              </span>
            ) : (
              <span className="font-urdu text-[11px] xs:text-xs sm:text-base md:text-lg inline-flex items-center gap-0.5 leading-none">
                <span className="text-amber-200 font-semibold">{todayDates.hijriDay} {todayDates.hijriMonth} {todayDates.hijriYear}ھ</span>
                <span className="hidden xs:inline opacity-60 mx-1">•</span>
                <span className="hidden xs:inline opacity-90">{todayDates.gregorianFull}</span>
              </span>
            )}
          </div>

          {/* CENTER: Bismillah Calligraphy (Visible on tablet/desktop, hidden on small mobile) */}
          <div className="hidden sm:flex items-center justify-center text-center px-1 flex-1 min-w-0">
            <span 
              className="font-bold text-sm sm:text-base md:text-lg text-white tracking-wide whitespace-nowrap select-none overflow-hidden text-ellipsis"
              style={{ fontFamily: "'Amiri', 'Noto Naskh Arabic', 'Traditional Arabic', serif" }}
            >
              بِسْمِ اللّٰهِ الرَّحْمٰنِ الرَّحِيْمِ
            </span>
          </div>

          {/* LEFT SIDE (RTL): Language Selector, Login & Theme Toggle */}
          <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0 relative z-50" dir="ltr">
            {/* Language Selector Dropdown */}
            <div className="relative z-50">
              <button 
                onClick={() => setShowLangMenu(!showLangMenu)}
                className="h-6 sm:h-7 flex items-center gap-1 bg-[#6B5138] hover:bg-[#5A432D] text-white px-2 sm:px-3 rounded border border-[#85674B] text-[11px] xs:text-xs sm:text-sm font-bold transition-all cursor-pointer shadow-xs active:scale-95"
                title="زبان تبدیل کریں / Select Language"
                style={{ fontFamily: "'Noto Naskh Arabic', 'Amiri', sans-serif" }}
              >
                <Globe className="w-3 h-3 text-amber-200 shrink-0" />
                <span className="text-white font-medium">{language === 'ur' ? 'اردو' : language === 'ar' ? 'العربية' : 'English'}</span>
                {showLangMenu ? (
                  <ChevronUp className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-white shrink-0" />
                ) : (
                  <ChevronDown className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-white shrink-0" />
                )}
              </button>

              {/* Language Dropdown Menu */}
              {showLangMenu && (
                <>
                  {/* Backdrop for easy closing */}
                  <div 
                    className="fixed inset-0 z-40 bg-transparent" 
                    onClick={() => setShowLangMenu(false)}
                  />
                  <div className="absolute left-0 top-full mt-1.5 bg-[#6B5138] border border-[#85674B] rounded-md shadow-2xl z-[100] text-xs sm:text-sm w-28 sm:w-32 overflow-hidden text-white divide-y divide-[#543E29] animate-in fade-in zoom-in-95 duration-150">
                    <button 
                      onClick={() => { setLanguage('ur'); setShowLangMenu(false); }} 
                      className={`w-full text-right px-3 py-2 font-bold transition-colors flex items-center justify-between cursor-pointer ${language === 'ur' ? 'bg-[#503A26] text-amber-200' : 'hover:bg-[#5A432D] text-white'}`}
                      style={{ fontFamily: "'Jameel Noori Nastaleeq', 'Noto Nastaliq Urdu', serif" }}
                    >
                      <span className="text-base leading-none">اردو</span>
                      {language === 'ur' && <span className="text-amber-300 text-xs">✓</span>}
                    </button>
                    <button 
                      onClick={() => { setLanguage('ar'); setShowLangMenu(false); }} 
                      className={`w-full text-right px-3 py-2 font-bold transition-colors flex items-center justify-between cursor-pointer ${language === 'ar' ? 'bg-[#503A26] text-amber-200' : 'hover:bg-[#5A432D] text-white'}`}
                      style={{ fontFamily: "'Amiri', 'Noto Naskh Arabic', serif" }}
                    >
                      <span className="text-base leading-none">العربية</span>
                      {language === 'ar' && <span className="text-amber-300 text-xs">✓</span>}
                    </button>
                    <button 
                      onClick={() => { setLanguage('en'); setShowLangMenu(false); }} 
                      className={`w-full text-left px-3 py-2 font-semibold transition-colors flex items-center justify-between cursor-pointer font-sans ${language === 'en' ? 'bg-[#503A26] text-amber-200' : 'hover:bg-[#5A432D] text-white'}`}
                    >
                      <span className="text-sm leading-none">English</span>
                      {language === 'en' && <span className="text-amber-300 text-xs">✓</span>}
                    </button>
                  </div>
                </>
              )}
            </div>

            {/* Login Button */}
            <button 
              onClick={() => setCurrentTab('results')} 
              className="h-6 sm:h-7 flex items-center gap-1 text-white hover:text-amber-200 px-2 sm:px-2.5 rounded border border-[#85674B]/70 sm:border-transparent text-[11px] xs:text-xs sm:text-sm font-bold transition-all cursor-pointer bg-[#6B5138]/60 hover:bg-[#6B5138] sm:bg-transparent active:scale-95"
              title={language === 'ar' ? 'تسجيل الدخول ونتائج الامتحانات' : language === 'en' ? 'Portal Login & Results' : 'آن لائن رزلٹ و پورٹل لاگ ان'}
            >
              <span className="text-white hover:text-amber-200">
                {language === 'ar' ? 'تسجيل الدخول' : language === 'en' ? 'Login' : 'لاگ ان'}
              </span>
            </button>

            {/* Dark/Light Mode Toggle */}
            <button 
              onClick={() => setDarkMode(!darkMode)}
              className="h-6 w-6 sm:h-7 sm:w-7 flex items-center justify-center rounded border border-[#85674B]/70 sm:border-transparent text-amber-200 hover:text-white bg-[#6B5138]/60 hover:bg-[#6B5138] sm:bg-transparent transition-all cursor-pointer shrink-0 active:scale-95"
              title="Toggle theme"
              aria-label="Toggle dark/light mode"
            >
              {darkMode ? <Sun className="w-3.5 h-3.5" /> : <Moon className="w-3.5 h-3.5" />}
            </button>
          </div>

        </div>
      </div>

      {/* 2. WHITE HEADER BAR WITH LOGO, NAVIGATION MENU & SEARCH BOX / MOBILE HAMBURGER */}
      <div className="bg-white/95 dark:bg-slate-950/95 backdrop-blur-md border-b border-stone-200 dark:border-slate-800 px-3 sm:px-6 py-2 sm:py-2.5">
        <div className="max-w-[1400px] mx-auto flex items-center justify-between gap-2 sm:gap-4" dir={language === 'en' ? 'ltr' : 'rtl'}>
          
          {/* RIGHT: Prominent Logo + Vertical Divider */}
          <div className="flex items-center shrink-0">
            <div 
              onClick={() => {
                setCurrentTab('home');
                setOpenMenuId(null);
                setMobileMenuOpen(false);
              }}
              className="cursor-pointer group transition-transform hover:scale-102 active:scale-98 shrink-0 py-0.5"
              title="جامعہ اسلامیہ ایبٹ آباد - صفحہ اول"
            >
              <img 
                src={JAMIA_HEADER_LOGO_DATA_URI || headerLogoCalligraphy} 
                alt="جامعہ اسلامیہ ایبٹ آباد" 
                className="h-[32px] xs:h-[38px] sm:h-[48px] md:h-[58px] lg:h-[64px] w-auto max-w-full object-contain dark:brightness-0 dark:invert dark:opacity-90"
                loading="eager"
                decoding="sync"
                onError={(e) => {
                  const target = e.currentTarget;
                  if (!target.dataset.tried) {
                    target.dataset.tried = '1';
                    target.src = JAMIA_HEADER_LOGO_DATA_URI;
                  } else if (target.dataset.tried === '1') {
                    target.dataset.tried = '2';
                    target.src = '/jamia_logo_calligraphy_transparent.png';
                  } else if (target.dataset.tried === '2') {
                    target.dataset.tried = '3';
                    target.src = '/jamia_header_logo.png';
                  }
                }}
              />
            </div>

            {/* Vertical Divider after Logo */}
            <span className="hidden md:block h-8 md:h-9 xl:h-10 w-[1px] bg-stone-300 dark:bg-stone-700 mx-1.5 md:mx-2.5 lg:mx-3 xl:mx-4 shrink-0" />
          </div>

          {/* DESKTOP / LAPTOP NAVIGATION MENU (STAYS VISIBLE ON LAPTOP ZOOM AND MEDIUM+ SCREENS) */}
          <div className="hidden md:flex flex-1 items-center justify-between gap-1.5 md:gap-2 lg:gap-4 min-w-0">
            
            {/* Navigation Menu with Jameel Noori Nastaleeq Font & Vertical Dividers */}
            <nav className="w-full" onMouseLeave={() => setOpenMenuId(null)}>
              <ul className="flex items-center justify-center gap-0 w-full flex-nowrap">
                
                {navItems.map((item, index) => {
                  const isSelected = currentTab === item.id || 
                    (item.id === 'about' && (currentTab === 'about' || currentTab.startsWith('about-') || currentTab === 'departments' || currentTab.startsWith('dep-'))) ||
                    (item.id === 'fatwas' && (currentTab === 'fatwas' || currentTab.startsWith('fatwa-'))) ||
                    (item.id === 'library' && (currentTab === 'library' || currentTab === 'media')) ||
                    (item.id === 'online-services' && (currentTab === 'online-services' || currentTab.startsWith('online-') || currentTab === 'results' || currentTab === 'news')) ||
                    (item.id === 'contact' && (currentTab === 'contact' || currentTab === 'donations'));
                  const hasDropdown = !!item.children;
                  const isOpen = openMenuId === item.id;

                  return (
                    <li key={item.id} className="relative group py-1 flex items-center shrink-0">
                      {/* Vertical Divider between items */}
                      {index > 0 && (
                        <span className="h-5 md:h-6 lg:h-7 w-[1px] bg-stone-300 dark:bg-stone-700 mx-1 md:mx-1.5 lg:mx-2 xl:mx-3 shrink-0" />
                      )}

                      <button
                        onClick={() => {
                          setOpenMenuId(null);
                          if ((item as any).isModal) {
                            onOpenFatwaModal();
                          } else {
                            setCurrentTab(item.id);
                          }
                        }}
                        className={`px-1.5 md:px-2 lg:px-2.5 xl:px-3.5 py-1 md:py-1.5 transition-all flex items-center gap-0.5 md:gap-1 lg:gap-1.5 cursor-pointer whitespace-nowrap rounded-t-md border-t-2 ${
                          isSelected || isOpen
                            ? 'bg-[#3C2E21] text-white border-t-[#B88A3B] shadow-sm' 
                            : 'border-t-transparent text-[#361F0D] dark:text-stone-100 group-hover:bg-[#3C2E21] group-hover:text-white group-hover:border-t-[#B88A3B]'
                        }`}
                      >
                        <span className="text-xs sm:text-sm md:text-[15px] lg:text-lg xl:text-xl 2xl:text-2xl font-bold leading-normal transition-colors">
                          {item.label}
                        </span>
                        <ChevronLeft className="w-2.5 h-2.5 md:w-3 md:h-3 lg:w-3.5 lg:h-3.5 transition-all shrink-0 group-hover:-translate-x-0.5" />
                      </button>

                      {/* Rich Dropdown Menu */}
                      {hasDropdown && (
                        <div 
                          className={`absolute ${index >= 3 ? 'left-auto right-0 origin-top-right' : 'right-0 origin-top'} top-full transition-all duration-300 w-64 md:w-72 xl:w-80 z-50 pt-0 ${
                            isOpen 
                              ? 'opacity-100 visible pointer-events-auto translate-y-0 scale-y-100' 
                              : 'opacity-0 invisible pointer-events-none -translate-y-4 scale-y-90 group-hover:opacity-100 group-hover:visible group-hover:pointer-events-auto group-hover:translate-y-0 group-hover:scale-y-100'
                          }`}
                        >
                          <div className="bg-[#3C2E21] border border-[#2A1F15] border-t-0 rounded-b-md shadow-2xl divide-y divide-[#4D3C2D] overflow-hidden text-white font-urdu">
                            {item.children?.map((child: any) => {
                              return (
                                <div key={child.id} className="relative group/sub">
                                  <button
                                    onClick={() => {
                                      setOpenMenuId(null);
                                      if (child.isModal) {
                                        onOpenFatwaModal();
                                      }
                                      if (child.tab) {
                                        setCurrentTab(child.tab);
                                      }
                                    }}
                                    className="relative w-full text-right px-3.5 md:px-4 py-2.5 md:py-3 bg-[#3C2E21] hover:bg-[#2A1D13] active:bg-[#20150D] transition-colors flex items-center justify-between gap-2 cursor-pointer text-white group/item overflow-hidden"
                                  >
                                    <div className="flex-1 min-w-0 flex items-center justify-between z-10">
                                      <span className="text-base md:text-lg xl:text-xl font-bold text-white group-hover/item:text-[#F3E5AB] transition-colors leading-[1.9] tracking-wide">
                                        {child.label}
                                      </span>
                                      {child.subChildren && <ChevronDown className="w-3.5 h-3.5 -rotate-90 text-amber-200 shrink-0 mr-1" />}
                                    </div>
                                    
                                    {/* Soft Golden Amber underline expanding smoothly from center to left & right on hover */}
                                    <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-[1.5px] bg-[#D4AF37] shadow-[0_0_6px_rgba(212,175,55,0.35)] transition-all duration-600 ease-out group-hover/item:w-full" />
                                  </button>

                                  {/* Secondary Flyout Sub-menu */}
                                  {child.subChildren && (
                                    <div className={`absolute ${index >= 3 ? 'left-auto right-full' : 'right-full'} top-0 opacity-0 invisible pointer-events-none translate-x-4 -translate-y-2 scale-95 origin-top-right group-hover/sub:opacity-100 group-hover/sub:visible group-hover/sub:pointer-events-auto group-hover/sub:translate-x-0 group-hover/sub:translate-y-0 group-hover/sub:scale-100 transition-all duration-500 ease-in-out w-56 md:w-64 bg-[#3C2E21] border border-[#2A1F15] rounded-md shadow-2xl divide-y divide-[#4D3C2D] overflow-hidden`}>
                                      {child.subChildren.map((sub: any) => (
                                        <button
                                          key={sub.id}
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            setOpenMenuId(null);
                                            setCurrentTab(sub.tab);
                                          }}
                                          className="relative w-full text-right px-3.5 py-2.5 md:py-3 text-base md:text-lg font-bold bg-[#3C2E21] hover:bg-[#2A1D13] text-white hover:text-[#F3E5AB] transition-colors flex items-center justify-between cursor-pointer group/subitem overflow-hidden"
                                        >
                                          <span className="leading-[1.9] text-white group-hover/subitem:text-[#F3E5AB] z-10">{sub.label}</span>
                                          
                                          {/* Soft Golden Amber underline expanding smoothly from center to left & right on hover */}
                                          <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-[1.5px] bg-[#D4AF37] shadow-[0_0_6px_rgba(212,175,55,0.35)] transition-all duration-600 ease-out group-hover/subitem:w-full" />
                                        </button>
                                      ))}
                                    </div>
                                  )}
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      )}
                    </li>
                  );
                })}
              </ul>
            </nav>

            {/* Search Box + Vertical Divider (Laptop/Desktop) */}
            <div className="flex items-center shrink-0 gap-1.5 md:gap-2.5 xl:gap-4">
              {/* Vertical Divider before search box */}
              <span className="h-5 md:h-6 lg:h-7 w-[1px] bg-stone-300 dark:bg-stone-700 shrink-0" />

              <div 
                onClick={onOpenSearch}
                className="relative flex items-center cursor-pointer group bg-[#F6F2EA] dark:bg-slate-800 border border-[#E5DEC9] dark:border-slate-700 hover:border-[#B88A3B] rounded-md px-2 md:px-2.5 lg:px-3 py-1 md:py-1.5 w-24 md:w-28 lg:w-36 xl:w-48 justify-between transition-all shadow-2xs gap-1"
              >
                <span className="text-stone-600 dark:text-stone-300 text-xs md:text-sm xl:text-base font-bold font-urdu select-none">
                  {language === 'ar' ? 'ابحث هنا...' : language === 'en' ? 'Search...' : 'تلاش کریں'}
                </span>
                <Search className="w-3.5 h-3.5 md:w-4 md:h-4 text-stone-500 dark:text-stone-400 group-hover:text-[#B88A3B] transition-colors shrink-0" />
              </div>
            </div>

          </div>

          {/* MOBILE CONTROLS: UNIFIED SEARCH & HAMBURGER MENU BUTTONS */}
          <div className="md:hidden flex items-center gap-2 shrink-0">
            {/* Mobile Search Button */}
            <button
              onClick={onOpenSearch}
              className="h-8.5 w-8.5 xs:h-9 xs:w-9 flex items-center justify-center rounded-md bg-[#3C2E21] hover:bg-[#2C2016] text-amber-200 border border-[#B88A3B]/50 hover:border-[#B88A3B] shadow-xs transition-all cursor-pointer active:scale-95"
              title={language === 'ar' ? 'بحث' : language === 'en' ? 'Search' : 'تلاش کریں'}
              aria-label="Search"
            >
              <Search className="w-4.5 h-4.5 text-amber-200" />
            </button>

            {/* Mobile Hamburger Toggle Button (☰) */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="h-8.5 xs:h-9 flex items-center gap-1.5 px-2.5 xs:px-3 bg-[#3C2E21] hover:bg-[#2C2016] text-white border border-[#B88A3B]/50 hover:border-[#B88A3B] rounded-md font-urdu font-bold text-xs xs:text-sm shadow-xs transition-all cursor-pointer active:scale-95"
              title={language === 'ar' ? 'فتح القائمة' : language === 'en' ? 'Open Menu' : 'مینو کھولیں'}
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? (
                <X className="w-4.5 h-4.5 text-amber-200" />
              ) : (
                <Menu className="w-4.5 h-4.5 text-amber-200" />
              )}
              <span className="text-white leading-none">
                {mobileMenuOpen 
                  ? (language === 'ar' ? 'إغلاق' : language === 'en' ? 'Close' : 'بند کریں') 
                  : (language === 'ar' ? 'القائمة' : language === 'en' ? 'Menu' : 'مینو')}
              </span>
            </button>
          </div>

        </div>
      </div>

      {/* 5. MOBILE NAVIGATION DRAWER */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#FAF7F2] dark:bg-slate-900 border-t-2 border-[#B88A3B] p-3 space-y-2.5 font-urdu shadow-2xl animate-in slide-in-from-top duration-300" dir={language === 'en' ? 'ltr' : 'rtl'}>
          
          {/* Nav Items */}
          <div className="grid grid-cols-1 gap-2">
            {navItems.map((item) => {
              const isExpanded = expandedMobileItem === item.id;
              const isCurrent = currentTab === item.id || (item.id === 'online-services' && (currentTab.startsWith('online-') || currentTab === 'results' || currentTab === 'news')) || (item.id === 'contact' && (currentTab === 'contact' || currentTab === 'donations'));

              return (
                <div key={item.id} className="space-y-1">
                  <button
                    onClick={() => {
                      if (item.children) {
                        setExpandedMobileItem(prev => prev === item.id ? null : item.id);
                      } else {
                        if ((item as any).isModal) {
                          onOpenFatwaModal();
                        } else {
                          setCurrentTab(item.id);
                        }
                        setMobileMenuOpen(false);
                      }
                    }}
                    className={`w-full text-right px-4 py-2.5 rounded-lg font-bold text-sm sm:text-base transition-colors border flex items-center justify-between cursor-pointer shadow-xs ${
                      isCurrent || isExpanded
                        ? 'bg-[#3C2E21] text-white border-[#B88A3B]'
                        : 'bg-white dark:bg-slate-800 text-stone-800 dark:text-stone-200 border-stone-200 dark:border-slate-700 hover:bg-[#3C2E21] hover:text-white'
                    }`}
                  >
                    <span className="text-base sm:text-lg">{item.label}</span>
                    {item.children && (
                      isExpanded ? (
                        <ChevronUp className="w-4 h-4 text-amber-200" />
                      ) : (
                        <ChevronDown className="w-4 h-4 text-stone-400" />
                      )
                    )}
                  </button>

                  {/* Mobile Sub-Items (Shown ONLY when clicked) */}
                  {item.children && isExpanded && (
                    <div className="mr-3 pl-2 pr-2 border-r-2 border-[#B88A3B] space-y-1 my-1.5 bg-stone-50/80 dark:bg-slate-900/80 rounded-l-md py-1">
                      {item.children.map((child: any) => {
                        const isSubExpanded = expandedMobileSubItem === child.id;

                        return (
                          <div key={child.id} className="space-y-1">
                            <button
                              onClick={() => {
                                if (child.subChildren) {
                                  setExpandedMobileSubItem(prev => prev === child.id ? null : child.id);
                                } else {
                                  if (child.isModal) {
                                    onOpenFatwaModal();
                                  }
                                  if (child.tab) {
                                    setCurrentTab(child.tab);
                                  }
                                  setMobileMenuOpen(false);
                                }
                              }}
                              className="w-full text-right px-3 py-2 text-sm font-bold text-slate-800 dark:text-slate-200 hover:text-[#B88A3B] flex items-center justify-between cursor-pointer rounded hover:bg-stone-200/50 dark:hover:bg-slate-800"
                            >
                              <span>• {child.label}</span>
                              {child.subChildren && (
                                isSubExpanded ? (
                                  <ChevronUp className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
                                ) : (
                                  <ChevronDown className="w-3.5 h-3.5 text-stone-400" />
                                )
                              )}
                            </button>

                            {/* Sub-Sub Items (Only shown when that sub-item is clicked) */}
                            {child.subChildren && isSubExpanded && (
                              <div className="mr-3 pr-2 border-r-2 border-[#B88A3B]/40 space-y-1 py-1">
                                {child.subChildren.map((sub: any) => (
                                  <button
                                    key={sub.id}
                                    onClick={() => {
                                      setCurrentTab(sub.tab);
                                      setMobileMenuOpen(false);
                                    }}
                                    className="w-full text-right px-3 py-1.5 text-xs sm:text-sm text-slate-700 dark:text-slate-300 hover:text-[#B88A3B] cursor-pointer rounded hover:bg-amber-100/40 dark:hover:bg-slate-800"
                                  >
                                    ▫ {sub.label}
                                  </button>
                                ))}
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

        </div>
      )}

    </header>
  );
};
