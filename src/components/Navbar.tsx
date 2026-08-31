import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
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
  const [hoveredMenuId, setHoveredMenuId] = useState<string | null>(null);
  const [hoveredSubId, setHoveredSubId] = useState<string | null>(null);
  const [activeSubDropdown, setActiveSubDropdown] = useState<string | null>(null);
  const [showLangMenu, setShowLangMenu] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [expandedMobileItem, setExpandedMobileItem] = useState<string | null>(null);
  const [expandedMobileSubItem, setExpandedMobileSubItem] = useState<string | null>(null);
  const headerRef = useRef<HTMLElement>(null);
  const langDropdownRef = useRef<HTMLDivElement>(null);
  const closeTimeoutRef = useRef<NodeJS.Timeout | null>(null);

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
          id: 'online-taawun', 
          label: language === 'ur' ? 'طریقہ تعاون' : language === 'ar' ? 'طريقة التعاون' : 'Donation & Contribution', 
          desc: language === 'ur' ? 'زکوٰۃ، صدقات اور عطیات کے لیے بنک اکاؤنٹس کی مکمل تفصیل' : language === 'ar' ? 'الحسابات البنكية للتبرعات والزكاة والصدقات' : 'Official bank accounts and guidance for donations and Zakat',
          icon: Heart,
          tab: 'donations' 
        },
        { 
          id: 'online-quran-dars', 
          label: language === 'ur' ? 'آن لائن قرآن کریم و درسِ نظامی' : language === 'ar' ? 'أكاديمية القرآن الكريم والدرس النظامي' : 'Online Quran & Dars-e-Nizami', 
          desc: language === 'ur' ? 'ناظرہ، تجوید، حفظ اور مکمل درسِ نظامی آن لائن' : language === 'ar' ? 'القرآن الكريم والعلوم الإسلامية والدرس النظامي عبر الإنترنت' : 'Online Quran recitation, Tajweed, Hifz & Dars-e-Nizami',
          icon: BookOpen,
          tab: 'online-services',
          subChildren: [
            { 
              id: 'sub-online-quran', 
              label: language === 'ur' ? 'آن لائن قرآن اکیڈمی' : language === 'ar' ? 'أكاديمية القرآن الكريم' : 'Online Quran Academy', 
              tab: 'online-quran' 
            },
            { 
              id: 'sub-online-dars', 
              label: language === 'ur' ? 'آن لائن درسِ نظامی' : language === 'ar' ? 'الدرس النظامي عبر الإنترنت' : 'Online Dars-e-Nizami', 
              tab: 'online-dars-nizami' 
            },
            { 
              id: 'sub-ask-scholar', 
              label: language === 'ur' ? 'Ask a Scholar (انگریزی سوال)' : language === 'ar' ? 'اسأل المفتي (بالإنكليزية)' : 'Ask a Scholar (English)', 
              tab: 'ask-scholar' 
            },
          ]
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
                      onClick={() => { 
                        setLanguage('ur'); 
                        setShowLangMenu(false); 
                        const newUrl = currentTab === 'home' ? '/' : `/?tab=${currentTab}`;
                        window.history.pushState(null, '', newUrl);
                      }} 
                      className={`w-full text-right px-3 py-2 font-bold transition-colors flex items-center justify-between cursor-pointer ${language === 'ur' ? 'bg-[#503A26] text-amber-200' : 'hover:bg-[#5A432D] text-white'}`}
                      style={{ fontFamily: "'Jameel Noori Nastaleeq', 'Noto Nastaliq Urdu', serif" }}
                    >
                      <span className="text-base leading-none">اردو</span>
                      {language === 'ur' && <span className="text-amber-300 text-xs">✓</span>}
                    </button>
                    <button 
                      onClick={() => { 
                        setLanguage('ar'); 
                        setShowLangMenu(false); 
                        const newUrl = currentTab === 'home' ? '/ar' : `/ar/${currentTab}`;
                        window.history.pushState(null, '', newUrl);
                      }} 
                      className={`w-full text-right px-3 py-2 font-bold transition-colors flex items-center justify-between cursor-pointer ${language === 'ar' ? 'bg-[#503A26] text-amber-200' : 'hover:bg-[#5A432D] text-white'}`}
                      style={{ fontFamily: "'Amiri', 'Noto Naskh Arabic', serif" }}
                    >
                      <span className="text-base leading-none">العربية</span>
                      {language === 'ar' && <span className="text-amber-300 text-xs">✓</span>}
                    </button>
                    <button 
                      onClick={() => { 
                        setLanguage('en'); 
                        setShowLangMenu(false); 
                        const newUrl = currentTab === 'home' ? '/en' : `/en/${currentTab}`;
                        window.history.pushState(null, '', newUrl);
                      }} 
                      className={`w-full text-left px-3 py-2 font-semibold transition-colors flex items-center justify-between cursor-pointer font-sans ${language === 'en' ? 'bg-[#503A26] text-amber-200' : 'hover:bg-[#5A432D] text-white'}`}
                    >
                      <span className="text-sm leading-none">English</span>
                      {language === 'en' && <span className="text-amber-300 text-xs">✓</span>}
                    </button>
                  </div>
                </>
              )}
            </div>

            {/* Login Button (Hidden on Mobile) */}
            <button 
              onClick={() => setCurrentTab('results')} 
              className="hidden sm:flex h-6 sm:h-7 items-center gap-1 text-white hover:text-amber-200 px-2 sm:px-2.5 rounded border border-[#85674B]/70 sm:border-transparent text-[11px] xs:text-xs sm:text-sm font-bold transition-all cursor-pointer bg-[#6B5138]/60 hover:bg-[#6B5138] sm:bg-transparent active:scale-95"
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
              title={darkMode ? (language === 'ur' ? 'دن کا موڈ (Light Mode)' : language === 'ar' ? 'الوضع النهاري' : 'Switch to Light Mode') : (language === 'ur' ? 'رات کا موڈ (Dark Mode)' : language === 'ar' ? 'الوضع الليلي' : 'Switch to Dark Mode')}
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
            <nav 
              className="w-full" 
              onMouseLeave={() => {
                closeTimeoutRef.current = setTimeout(() => {
                  setHoveredMenuId(null);
                  setHoveredSubId(null);
                }, 140);
              }}
            >
              <ul className="flex items-center justify-center gap-0 w-full flex-nowrap">
                
                {navItems.map((item, index) => {
                  const isSelected = currentTab === item.id || 
                    (item.id === 'about' && (currentTab === 'about' || currentTab.startsWith('about-') || currentTab === 'departments' || currentTab.startsWith('dep-'))) ||
                    (item.id === 'fatwas' && (currentTab === 'fatwas' || currentTab.startsWith('fatwa-'))) ||
                    (item.id === 'library' && (currentTab === 'library' || currentTab === 'media')) ||
                    (item.id === 'online-services' && (currentTab === 'online-services' || currentTab.startsWith('online-') || currentTab === 'results' || currentTab === 'news' || currentTab === 'donations')) ||
                    (item.id === 'contact' && currentTab === 'contact');
                  const hasDropdown = !!item.children;
                  const isDropdownOpen = (hoveredMenuId === item.id) || (openMenuId === item.id);

                  return (
                    <li 
                      key={item.id} 
                      className="relative py-1 flex items-center shrink-0"
                      onMouseEnter={() => {
                        if (closeTimeoutRef.current) clearTimeout(closeTimeoutRef.current);
                        if (hasDropdown) {
                          setHoveredMenuId(item.id);
                        } else {
                          setHoveredMenuId(null);
                        }
                      }}
                    >
                      {/* Vertical Divider between items */}
                      {index > 0 && (
                        <span className="h-5 md:h-6 lg:h-7 w-[1px] bg-stone-300 dark:bg-stone-700 mx-1 md:mx-1.5 lg:mx-2 xl:mx-3 shrink-0" />
                      )}

                      <button
                        onClick={() => {
                          if (hasDropdown) {
                            setOpenMenuId(prev => prev === item.id ? null : item.id);
                          } else {
                            setOpenMenuId(null);
                            setHoveredMenuId(null);
                            if ((item as any).isModal) {
                              onOpenFatwaModal();
                            } else {
                              setCurrentTab(item.id);
                            }
                          }
                        }}
                        className={`px-1.5 md:px-2 lg:px-2.5 xl:px-3.5 py-1 md:py-1.5 transition-all duration-200 flex items-center gap-0.5 md:gap-1 lg:gap-1.5 cursor-pointer whitespace-nowrap rounded-t-md border-t-2 select-none ${
                          isSelected || isDropdownOpen
                            ? 'bg-[#3C2E21] text-white border-t-[#B88A3B] shadow-sm' 
                            : 'border-t-transparent text-[#361F0D] dark:text-stone-100 hover:bg-[#3C2E21] hover:text-white hover:border-t-[#B88A3B]'
                        }`}
                      >
                        <span className="text-xs sm:text-sm md:text-[15px] lg:text-lg xl:text-xl 2xl:text-2xl font-bold leading-normal transition-colors">
                          {item.label}
                        </span>
                        {hasDropdown ? (
                          <ChevronDown 
                            className={`w-2.5 h-2.5 md:w-3 md:h-3 lg:w-3.5 lg:h-3.5 transition-transform duration-300 shrink-0 text-amber-300/80 ${
                              isDropdownOpen ? 'rotate-180 text-amber-200' : 'rotate-0'
                            }`} 
                          />
                        ) : (
                          <ChevronLeft className="w-2.5 h-2.5 md:w-3 md:h-3 lg:w-3.5 lg:h-3.5 transition-transform duration-200 shrink-0 opacity-60 group-hover:-translate-x-0.5" />
                        )}
                      </button>

                      {/* Refined Smooth Animated Dropdown Menu */}
                      {hasDropdown && (
                        <AnimatePresence>
                          {isDropdownOpen && (
                            <motion.div
                              initial={{ opacity: 0, y: -10, scaleY: 0.96, filter: 'blur(2px)' }}
                              animate={{ opacity: 1, y: 0, scaleY: 1, filter: 'blur(0px)' }}
                              exit={{ opacity: 0, y: -8, scaleY: 0.97, filter: 'blur(1.5px)' }}
                              transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
                              className={`absolute ${index >= 3 ? 'left-auto right-0 origin-top-right' : 'right-0 origin-top'} top-full pt-1.5 w-64 md:w-72 xl:w-80 z-50`}
                              onMouseEnter={() => {
                                if (closeTimeoutRef.current) clearTimeout(closeTimeoutRef.current);
                              }}
                              onMouseLeave={() => {
                                setHoveredMenuId(null);
                                setHoveredSubId(null);
                              }}
                            >
                              <div className="relative bg-[#3C2E21] border border-[#543E29] rounded-xl shadow-[0_18px_45px_-6px_rgba(25,18,12,0.6)] overflow-visible text-white font-urdu">
                                
                                {/* Top Pointer Arrow Anchor pointing to button */}
                                <div 
                                  className={`w-3.5 h-3.5 bg-[#3C2E21] border-t border-r border-[#543E29] rotate-[-45deg] absolute -top-[7px] ${
                                    index >= 3 ? 'right-8' : 'right-6'
                                  } z-10 shadow-xs`} 
                                />

                                {/* Elegant Top Golden Line Accent */}
                                <div className="h-[2.5px] bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent w-full rounded-t-xl relative z-10" />

                                <div className="divide-y divide-[#4D3C2D]/70 rounded-b-xl overflow-hidden">
                                  {item.children?.map((child: any) => {
                                    const isSubMenuOpen = hoveredSubId === child.id;

                                    return (
                                      <div 
                                        key={child.id} 
                                        className="relative"
                                        onMouseEnter={() => {
                                          if (child.subChildren) setHoveredSubId(child.id);
                                        }}
                                        onMouseLeave={() => {
                                          if (child.subChildren) setHoveredSubId(null);
                                        }}
                                      >
                                        <button
                                          onClick={() => {
                                            setOpenMenuId(null);
                                            setHoveredMenuId(null);
                                            setHoveredSubId(null);
                                            if (child.isModal) {
                                              onOpenFatwaModal();
                                            }
                                            if (child.tab) {
                                              setCurrentTab(child.tab);
                                            }
                                          }}
                                          className="group/item relative w-full text-right px-4 md:px-4.5 py-3 md:py-3.5 bg-[#3C2E21] hover:bg-[#2E2116] active:bg-[#20150D] transition-colors duration-200 flex items-center justify-between gap-2.5 cursor-pointer text-white overflow-hidden select-none"
                                        >
                                          <div className="flex-1 min-w-0 flex items-center justify-between z-10">
                                            <span className="text-base md:text-lg xl:text-xl font-bold text-white group-hover/item:text-[#F8E7B9] transition-colors duration-200 leading-[2.0] tracking-wide">
                                              {child.label}
                                            </span>
                                            {child.subChildren ? (
                                              <ChevronLeft className="w-3.5 h-3.5 text-amber-300/80 group-hover/item:text-amber-200 group-hover/item:-translate-x-1 transition-all duration-200 shrink-0 mr-1" />
                                            ) : (
                                              <span className="w-1.5 h-1.5 rounded-full bg-amber-400/40 opacity-0 group-hover/item:opacity-100 transition-opacity duration-200 shrink-0" />
                                            )}
                                          </div>
                                          
                                          {/* Soft Golden Amber underline expanding smoothly from center on hover */}
                                          <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-[1.5px] bg-[#D4AF37] shadow-[0_0_6px_rgba(212,175,55,0.35)] transition-all duration-400 ease-out group-hover/item:w-full" />
                                        </button>

                                        {/* Secondary Flyout Sub-menu with smooth motion animation */}
                                        {child.subChildren && (
                                          <AnimatePresence>
                                            {isSubMenuOpen && (
                                              <motion.div 
                                                initial={{ opacity: 0, x: 8, scale: 0.97 }}
                                                animate={{ opacity: 1, x: 0, scale: 1 }}
                                                exit={{ opacity: 0, x: 8, scale: 0.97 }}
                                                transition={{ duration: 0.24, ease: [0.16, 1, 0.3, 1] }}
                                                className={`absolute ${index >= 3 ? 'left-auto right-full' : 'right-full'} top-0 w-56 md:w-64 bg-[#3C2E21] border border-[#543E29] rounded-xl shadow-[0_16px_40px_-6px_rgba(25,18,12,0.65)] divide-y divide-[#4D3C2D]/70 overflow-hidden z-50`}
                                              >
                                                {/* Top Golden Accent Line for Flyout */}
                                                <div className="h-[2px] bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent w-full" />

                                                {child.subChildren.map((sub: any) => (
                                                  <button
                                                    key={sub.id}
                                                    onClick={(e) => {
                                                      e.stopPropagation();
                                                      setOpenMenuId(null);
                                                      setHoveredMenuId(null);
                                                      setHoveredSubId(null);
                                                      setCurrentTab(sub.tab);
                                                    }}
                                                    className="group/subitem relative w-full text-right px-4 py-2.5 md:py-3 text-base md:text-lg font-bold bg-[#3C2E21] hover:bg-[#2E2116] text-white hover:text-[#F8E7B9] transition-colors duration-200 flex items-center justify-between cursor-pointer overflow-hidden select-none"
                                                  >
                                                    <span className="leading-[1.9] text-white group-hover/subitem:text-[#F8E7B9] transition-colors duration-200 z-10">{sub.label}</span>
                                                    
                                                    {/* Soft Golden Amber underline */}
                                                    <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-[1.5px] bg-[#D4AF37] shadow-[0_0_6px_rgba(212,175,55,0.35)] transition-all duration-400 ease-out group-hover/subitem:w-full" />
                                                  </button>
                                                ))}
                                              </motion.div>
                                            )}
                                          </AnimatePresence>
                                        )}
                                      </div>
                                    );
                                  })}
                                </div>
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
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

          {/* MOBILE CONTROLS: CLEAR, ENHANCED HAMBURGER MENU BUTTON */}
          <div className="md:hidden flex items-center shrink-0">
            {/* Mobile Hamburger Toggle Button (☰) */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="h-9.5 xs:h-10 min-w-[88px] xs:min-w-[98px] flex items-center justify-center gap-2 px-3.5 xs:px-4 bg-[#3C2E21] hover:bg-[#2C2016] active:bg-[#20150D] text-white border-1.5 border-[#B88A3B]/80 hover:border-[#B88A3B] rounded-lg shadow-sm transition-all cursor-pointer active:scale-95 select-none"
              title={language === 'ar' ? 'فتح القائمة' : language === 'en' ? 'Open Menu' : 'مینو کھولیں'}
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? (
                <X className="w-5 h-5 text-amber-300 shrink-0 stroke-[2.5]" />
              ) : (
                <Menu className="w-5 h-5 text-amber-300 shrink-0 stroke-[2.5]" />
              )}
              <span className={`text-white font-bold text-sm xs:text-[15px] leading-none pt-0.5 ${language === 'en' ? 'font-sans' : 'font-urdu'}`}>
                {mobileMenuOpen 
                  ? (language === 'ar' ? 'إغلاق' : language === 'en' ? 'Close' : 'بند کریں') 
                  : (language === 'ar' ? 'القائمة' : language === 'en' ? 'Menu' : 'مینو')}
              </span>
            </button>
          </div>

        </div>
      </div>

      {/* 5. MOBILE NAVIGATION DRAWER WITH SMOOTH ACCORDION MOTION */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
            className="md:hidden bg-[#FAF7F2] dark:bg-slate-900 border-t-2 border-[#B88A3B] p-3 font-urdu shadow-2xl overflow-hidden" 
            dir={language === 'en' ? 'ltr' : 'rtl'}
          >
            
            {/* Nav Items */}
            <div className="grid grid-cols-1 gap-2">
              {navItems.map((item) => {
                const isExpanded = expandedMobileItem === item.id;
                const isCurrent = currentTab === item.id || (item.id === 'online-services' && (currentTab.startsWith('online-') || currentTab === 'results' || currentTab === 'news' || currentTab === 'donations')) || (item.id === 'contact' && currentTab === 'contact');

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
                      className={`w-full text-right px-4 py-2.5 rounded-xl font-bold text-sm sm:text-base transition-all duration-200 border flex items-center justify-between cursor-pointer shadow-xs select-none ${
                        isCurrent || isExpanded
                          ? 'bg-[#3C2E21] text-white border-[#B88A3B]'
                          : 'bg-white dark:bg-slate-800 text-stone-800 dark:text-stone-200 border-stone-200 dark:border-slate-700 hover:bg-[#3C2E21] hover:text-white'
                      }`}
                    >
                      <span className="text-base sm:text-lg leading-normal">{item.label}</span>
                      {item.children && (
                        <ChevronDown 
                          className={`w-4 h-4 transition-transform duration-300 ${
                            isExpanded ? 'rotate-180 text-amber-200' : 'text-stone-400'
                          }`} 
                        />
                      )}
                    </button>

                    {/* Mobile Sub-Items Accordion with Smooth Animation */}
                    <AnimatePresence>
                      {item.children && isExpanded && (
                        <motion.div 
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.26, ease: [0.16, 1, 0.3, 1] }}
                          className="mr-2 pl-2 pr-2 border-r-2 border-[#B88A3B] space-y-1.5 my-1.5 bg-stone-100/90 dark:bg-slate-850/90 rounded-l-xl py-2 overflow-hidden"
                        >
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
                                  className="w-full text-right px-3.5 py-2 text-sm font-bold text-slate-850 dark:text-slate-200 hover:text-[#B88A3B] flex items-center justify-between cursor-pointer rounded-lg hover:bg-stone-200/60 dark:hover:bg-slate-800 transition-colors"
                                >
                                  <span className="leading-[1.8]">• {child.label}</span>
                                  {child.subChildren && (
                                    <ChevronDown 
                                      className={`w-3.5 h-3.5 transition-transform duration-200 ${
                                        isSubExpanded ? 'rotate-180 text-amber-600 dark:text-amber-400' : 'text-stone-400'
                                      }`} 
                                    />
                                  )}
                                </button>

                                {/* Sub-Sub Items Accordion with Smooth Animation */}
                                <AnimatePresence>
                                  {child.subChildren && isSubExpanded && (
                                    <motion.div 
                                      initial={{ opacity: 0, height: 0 }}
                                      animate={{ opacity: 1, height: 'auto' }}
                                      exit={{ opacity: 0, height: 0 }}
                                      transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
                                      className="mr-3 pr-2.5 border-r-2 border-[#B88A3B]/40 space-y-1 py-1 overflow-hidden"
                                    >
                                      {child.subChildren.map((sub: any) => (
                                        <button
                                          key={sub.id}
                                          onClick={() => {
                                            setCurrentTab(sub.tab);
                                            setMobileMenuOpen(false);
                                          }}
                                          className="w-full text-right px-3 py-1.5 text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-300 hover:text-[#B88A3B] cursor-pointer rounded-md hover:bg-amber-100/50 dark:hover:bg-slate-800 transition-colors"
                                        >
                                          ▫ {sub.label}
                                        </button>
                                      ))}
                                    </motion.div>
                                  )}
                                </AnimatePresence>
                              </div>
                            );
                          })}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}
            </div>

          </motion.div>
        )}
      </AnimatePresence>

    </header>
  );
};
