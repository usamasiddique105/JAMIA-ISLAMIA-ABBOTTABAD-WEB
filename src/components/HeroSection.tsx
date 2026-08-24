import React from 'react';
import { motion } from 'motion/react';
import { useThemeLanguage } from '../context/ThemeLanguageContext';
import { getHijriAndGregorianDate } from '../utils/hijriDate';
import { 
  BookOpen, 
  Bell, 
  GraduationCap, 
  FileText, 
  Sparkles, 
  Clock, 
  BookMarked, 
  UserCheck, 
  Compass, 
  Scale,
  HelpCircle,
  Heart,
  Phone,
  Calendar,
  ChevronLeft,
  ChevronRight,
  Library,
  Award,
  Video,
  HeartHandshake
} from 'lucide-react';

import jamiaExactUserPhoto from '../assets/images/jamia_exact_user_photo_1786535223106.jpg';
import jamiaCircularSeal from '../assets/images/jamia_circular_seal_1786534710259.jpg';
import headerLogoCalligraphy from '../assets/images/jamia_logo_calligraphy_transparent.png';

interface HeroSectionProps {
  setCurrentTab: (tab: string) => void;
  onOpenFatwaModal?: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  setCurrentTab,
  onOpenFatwaModal
}) => {
  const { t, language } = useThemeLanguage();

  // Dynamic Date Formatting (Auto-updated)
  const now = new Date();
  const gregorianStr = now.toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' });
  
  // Hijri Date Calculation
  let hijriStr = "";
  try {
    const formatter = new Intl.DateTimeFormat('ur-PK-u-ca-islamic-umalqura', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
    hijriStr = formatter.format(now);
  } catch (e) {
    hijriStr = "۱۶ محرم الحرام ۱۴۴۸ھ";
  }
  if (!hijriStr || hijriStr.includes('NaN')) {
    hijriStr = "۱۶ محرم الحرام ۱۴۴۸ھ";
  }

  // Prayer Timings Summary (Auto-adjusted by month for Abbottabad)
  const month = now.getMonth();
  const fajrTime = (month >= 4 && month <= 7) ? "04:15 AM" : (month >= 10 || month <= 1) ? "05:30 AM" : "04:45 AM";
  const sunriseTime = (month >= 4 && month <= 7) ? "05:35 AM" : (month >= 10 || month <= 1) ? "06:45 AM" : "06:05 AM";
  const zawalTime = "12:12 PM";
  const dhuhrTime = "12:20 PM";
  const asrTime = (month >= 4 && month <= 7) ? "05:15 PM" : (month >= 10 || month <= 1) ? "03:45 PM" : "04:30 PM";
  const sunsetTime = (month >= 4 && month <= 7) ? "07:05 PM" : (month >= 10 || month <= 1) ? "05:15 PM" : "06:20 PM";
  const maghribTime = (month >= 4 && month <= 7) ? "07:10 PM" : (month >= 10 || month <= 1) ? "05:20 PM" : "06:25 PM";
  const ishaTime = (month >= 4 && month <= 7) ? "08:45 PM" : (month >= 10 || month <= 1) ? "07:00 PM" : "08:00 PM";
  const jummahTime = "01:30 PM";

  // Daily Rotated Duas and Names based on day of year
  const startOfYear = new Date(now.getFullYear(), 0, 0);
  const dayOfYear = Math.floor((now.getTime() - startOfYear.getTime()) / (1000 * 60 * 60 * 24));

  const dailyDuas = [
    { 
      title: "دعائے صبح و شام",
      arabic: "اَللّٰهُمَّ بِكَ اَصْبَحْنَا وَبِكَ اَمْسَيْنَا وَبِكَ نَحْيٰى وَبِكَ نَمُوْتُ",
      urdu: "اے اللہ! تیرے ہی نام سے ہم صبح اور شام کرتے ہیں۔" 
    },
    { 
      title: "جامع مسنون دعا",
      arabic: "رَبَّنَا اٰتِنَا فِی الدُّنْیَا حَسَنَةً وَّفِی الْاٰخِرَةِ حَسَنَةً وَّقِنَا عَذَابَ النَّارِ",
      urdu: "اے ہمارے رب! ہمیں دنیا اور آخرت میں بھلائی دے۔" 
    },
    { 
      title: "دعا برائے علم نافع",
      arabic: "اَللّٰهُمَّ اِنِّیْ اَسْاَلُكَ عِلْمًا نَّافِعًا وَّرِزْقًا طَيِّبًا وَّعَمَلًا مَُّتَقَبَّلًا",
      urdu: "اے اللہ! میں تجھ سے علم نافع اور پاکیزہ رزق کی التجا کرتا ہوں۔" 
    }
  ];

  const dailyNames = [
    { 
      name: "حسّان (Hassan)", 
      type: "لڑکوں کا نام", 
      meaning: "بہترین، خوبصورت، مشہور صحابیِ رسولؐ" 
    },
    { 
      name: "عائشہ (Ayesha)", 
      type: "لڑکیوں کا نام", 
      meaning: "خوش حال زندگی گزارنے والی، ام المؤمنینؓ" 
    },
    { 
      name: "ذی الشان (Zeeshan)", 
      type: "لڑکوں کا نام", 
      meaning: "صاحبِ شان و شوکت، باوقار" 
    },
    { 
      name: "فاطمہ (Fatima)", 
      type: "لڑکیوں کا نام", 
      meaning: "پرہیزگار، جگر گوشہِ رسول سیدہ فاطمہ الزہراؓ" 
    }
  ];

  const todayDua = dailyDuas[dayOfYear % dailyDuas.length];
  const todayName = dailyNames[dayOfYear % dailyNames.length];

  // 6 Primary Quick Access Tiles
  const primaryTiles = [
    {
      id: 'darulifta',
      title: 'دار الافتاء',
      subtitle: 'شرعی مسائل کے جوابات، آن لائن سوالات و فتاویٰ آرکائیو',
      icon: Scale,
      action: () => setCurrentTab('fatwas'),
    },
    {
      id: 'online-services',
      title: 'آن لائن خدمات',
      subtitle: 'قرآن کریم تجوید و حفظ، درسِ نظامی عالم کورسز',
      icon: GraduationCap,
      action: () => setCurrentTab('online-services'),
    },
    {
      id: 'donations',
      title: 'طریقہ تعاون و عطیات',
      subtitle: 'جامعہ کے لیے زکوٰۃ، صدقات اور بنک اکاؤنٹس کی تفصیل',
      icon: Heart,
      action: () => setCurrentTab('donations'),
    },
    {
      id: 'library',
      title: 'کتب خانہ و مطبوعات',
      subtitle: 'فتاویٰ جات، دینی کتب و ماہنامہ "الجامعہ" پی ڈی ایف',
      icon: BookMarked,
      action: () => setCurrentTab('library'),
    },
    {
      id: 'news',
      title: 'خبریں و اعلانات',
      subtitle: 'جامعہ کی علمی سرگرمیاں، داخلہ نٹس و تقریبات',
      icon: Bell,
      action: () => setCurrentTab('news'),
    },
    {
      id: 'online-admission',
      title: 'آن لائن داخلہ فارم',
      subtitle: 'رجسٹریشن فارم اور ۳-دن مفت آزمائشی کلاس',
      icon: UserCheck,
      action: () => setCurrentTab('online-services'),
    }
  ];

  // Tabs state for Home Page News & Announcements Section
  const [newsTab, setNewsTab] = React.useState<'news' | 'announcements'>('news');
  // Tabs state for Home Page Darul Ifta Section
  const [fatwaTab, setFatwaTab] = React.useState<'new' | 'featured'>('new');

  const latestNews = [
    {
      id: 1,
      title: "ختمِ بخاری شریف و سالانہ دستارِ فضیلت کانفرنس ۲۰۲۶ء",
      category: "تقریبات",
      date: "۱۵ شعبان ۱۴۴۸ھ",
      desc: "جامعہ اسلامیہ ایبٹ آباد میں سالانہ ختمِ بخاری شریف کی بابرکت تقریب منعقد ہوئی۔ ملک بھر کے ممتاز شیوخ الحدیث و علماء کی شرکت۔"
    },
    {
      id: 2,
      title: "شعبہ تحفیظ و تجوید میں نئے تعلیمی سال کے داخلے جاری",
      category: "داخلہ نوٹس",
      date: "۱۰ شعبان ۱۴۴۸ھ",
      desc: "جامعہ کے شعبہ تحفیظ القرآن اور تجوید للرجال و النساء میں داخلے شروع ہو چکے ہیں۔ آن لائن رجسٹریشن کی سہولت دستیاب ہے۔"
    },
    {
      id: 3,
      title: "ماہنامہ 'الجامعہ' ایبٹ آباد کا جدید شمارہ شائع ہو گیا",
      category: "مطبوعات",
      date: "۰۵ شعبان ۱۴۴۸ھ",
      desc: "اکابرینِ دیوبند کے مضامین، جديد فتاویٰ اور دینی و سیاسی حالات پر مشتمل علمی مجلے کا تازہ شمارہ پی ڈی ایف میں دستیاب ہے۔"
    }
  ];

  const announcements = [
    {
      id: 1,
      title: "امتحاناتِ سالانہ وفاق المدارس العربیہ کی تاریخ کا اعلان",
      category: "اعلانِ اہم",
      date: "۰۱ شعبان ۱۴۴۸ھ",
      desc: "تمام طلبہ کرام کو مطلع کیا جاتا ہے کہ امتحانی رول نمبر سلپ پورٹل سے ڈاؤن لوڈ کریں۔ بوگس سندات کی آن لائن تصدیق دستیاب ہے۔"
    },
    {
      id: 2,
      title: "عالمی آن لائن قرآن اکیڈمی برائے بیرونِ ملک مقیم مسلمان",
      category: "خدمات",
      date: "۲۵ رجب ۱۴۴۸ھ",
      desc: "امریکہ، برطانیہ، کینیڈا اور خلیجی ممالک کے مسلمان بھائیوں کے لیے زوم (Zoom) پر انفرادی قرآن و حفظ کلاسز۔"
    },
    {
      id: 3,
      title: "تعطیلاتِ رمضان المبارک و دؤرہ تدریب المعلمین سیمینار",
      category: "نوٹس",
      date: "۲۰ رجب ۱۴۴۸ھ",
      desc: "اساتذہ کرام کے لیے ۵ روزه خصوصي تربیتی ورکشاپ اور جدید طریقہِ تدریس کا طریقہ کار۔"
    }
  ];

  const newFatwas = [
    {
      id: 1,
      fatwaNo: "۱۴۴۸/۴۵۱",
      date: "۱۰ اگست ۲۰۲۶ء",
      title: "آن لائن بینکنگ، کیش بیک اور ڈیجیٹل ڈسکاؤنٹ کا شرعی حکم",
      category: "معاملات",
      question: "کیا آن لائن ایپس پر خریداری کرتے وقت ملنے والا کیش بیک یا ڈسکاؤنٹ شرعاً سود کے زمرے میں آتا ہے؟"
    },
    {
      id: 2,
      fatwaNo: "۱۴۴۸/۴۴۸",
      date: "۰۸ اگست ۲۰۲۶ء",
      title: "زکوۃ کی رقم سے نادار طلبہ کی تعلیمی و طعام کفالت",
      category: "عبادات",
      question: "کیا مستحق زکوۃ طلبہ کرام کی رہائش، خوراک اور کتب کے لیے زکوۃ کی رقم استعمال کی جا سکتی ہے؟"
    },
    {
      id: 3,
      fatwaNo: "۱۴۴۸/۴۴۲",
      date: "۰۵ اگست ۲۰۲۶ء",
      title: "مصنوعی ذہانت (AI) کے ذریعے تصاویر کی شرعی حیثیت",
      category: "جدید مسائل",
      question: "کمپیوٹر یا ای آئی سافٹ ویئر سے بننے والی غیر ذی روح یا ذی روح تصاویر کا شرعی حکم کیا ہے؟"
    }
  ];

  const featuredFatwas = [
    {
      id: 4,
      fatwaNo: "۱۴۴۷/۸۹۲",
      date: "۲۰ جولائی ۲۰۲۶ء",
      title: "کرپٹو کرنسی (Bitcoin) کی خریدو فروخت اور شرعی موقف",
      category: "معاملات",
      question: "ڈیجیٹل کرنسیوں اور بٹ کوائن کی تجارت کا اسلامی فقہ اور اکابر علماء کی روشنی میں حکم۔"
    },
    {
      id: 5,
      fatwaNo: "۱۴۴۷/۷۱۰",
      date: "۱۵ جولائی ۲۰۲۶ء",
      title: "نماز میں خشوع و خضوع کے طریقے اور وسوسوں کا علاج",
      category: "نماز و اذکار",
      question: "نماز کے دوران غیر ارادی خیالات و وساوس سے بچنے کے لیے مسنون و فقہی تدابیر۔"
    },
    {
      id: 6,
      fatwaNo: "۱۴۴۷/۶۳۰",
      date: "۱۰ جولائی ۲۰۲۶ء",
      title: "وراشت میں بیٹیوں اور بہنوں کے حقوق کی شرعی اہمیت",
      category: "میراث",
      question: "میراث کی تقسیم میں خواتین کے حقوق غصب کرنے کی حرمت اور جدید شرعی ضوابط۔"
    }
  ];

  // Hero Banner Slider State & Slides Data
  const [currentSlide, setCurrentSlide] = React.useState(0);

  const heroSlides = [
    {
      id: 1,
      image: jamiaExactUserPhoto,
      title: 'جامعہ اسلامیہ ایبٹ آباد',
      subtitle: 'Jamia Islamia Abbottabad, Pakistan',
      desc: 'مرکز علومِ اسلامیہ، دار الافتاء و ریسرچ گاہ (قائم شدہ ۱۹۵۱ء — وفاق المدارس العربیہ)',
      tag: 'مرکزی تعلیمی و دینی کیمپس'
    },
    {
      id: 2,
      image: jamiaExactUserPhoto,
      title: 'جامع مسجد و تعلیمی بلاک',
      subtitle: 'Central Mosque & Academic Block',
      desc: 'اصلاح و تزکیہ، تحفیظ القرآن اور دورہ حدیث شریف (شہادت العالمیہ) کا تاریخی و روحانی مرکز',
      tag: 'درسِ نظامی و تحفیظ القرآن'
    },
    {
      id: 3,
      image: jamiaExactUserPhoto,
      title: 'آن لائن دار الافتاء و مکتبہ',
      subtitle: 'Online Darul Ifta & Digital Library',
      desc: '۴۵ ہزار سے زائد جدید و قدیم فتاویٰ جات، فقہی ابحاث اور دینی و علمی کتب کا آن لائن خزانہ',
      tag: 'آن لائن شرعی خدمات'
    }
  ];

  React.useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [heroSlides.length]);

  return (
    <div className="space-y-16 sm:space-y-20 lg:space-y-24 font-urdu text-stone-900 dark:text-stone-100" dir="rtl">
      
      {/* 1. HERO BANNER: MOBILE (FULL-WIDTH CAMPUS PHOTO DIRECTLY AT TOP) & DESKTOP (PRESERVED WITH SEAL) */}
      {/* Mobile Banner: Photo directly at top without circular seal */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.96, y: -10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.75, ease: [0.25, 0.1, 0.25, 1] }}
        className="sm:hidden -mt-4 -mx-4 border-b border-stone-300 dark:border-slate-800 shadow-sm overflow-hidden bg-[#F8F5EE] dark:bg-[#0F172A] select-none"
      >
        <div className="w-full relative h-[130px] xs:h-[155px] overflow-hidden bg-[#F8F5EE] dark:bg-[#0F172A]">
          <img 
            src={jamiaExactUserPhoto} 
            alt="جامعہ اسلامیہ ایبٹ آباد کیمپس" 
            loading="eager"
            decoding="async"
            fetchPriority="high"
            className="w-full h-full object-cover object-center"
            onError={(e) => {
              const target = e.currentTarget;
              if (!target.dataset.tried) {
                target.dataset.tried = '1';
                target.src = '/jamia_banner.jpg';
              }
            }}
          />
        </div>
      </motion.div>

      {/* Desktop & Tablet Banner: Full Width Campus Photo without Circular Seal with refined subtle gold side accents */}
      <motion.div 
        initial={{ opacity: 0, y: -15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
        className="hidden sm:block -mt-6 lg:-mt-8 -mx-6 lg:-mx-8 relative sm:h-[150px] md:h-[165px] border-b border-stone-300/80 dark:border-slate-800 shadow-md overflow-hidden bg-[#F8F5EE] dark:bg-[#0F172A] select-none"
      >
        {/* Subtle geometric gold background accents for wide screens on left and right */}
        <div className="absolute inset-y-0 right-0 w-32 md:w-48 bg-gradient-to-l from-[#B88A3B]/10 via-[#B88A3B]/5 to-transparent pointer-events-none flex items-center justify-end pr-4 opacity-75">
          <svg className="w-20 h-20 text-[#B88A3B]/20" viewBox="0 0 100 100" fill="none">
            <circle cx="50" cy="50" r="44" stroke="currentColor" strokeWidth="1.5" strokeDasharray="3 3" />
            <rect x="25" y="25" width="50" height="50" rx="4" stroke="currentColor" strokeWidth="1.5" transform="rotate(45 50 50)" />
            <rect x="25" y="25" width="50" height="50" rx="4" stroke="currentColor" strokeWidth="1.5" />
          </svg>
        </div>
        <div className="absolute inset-y-0 left-0 w-32 md:w-48 bg-gradient-to-r from-[#B88A3B]/10 via-[#B88A3B]/5 to-transparent pointer-events-none flex items-center justify-start pl-4 opacity-75">
          <svg className="w-20 h-20 text-[#B88A3B]/20" viewBox="0 0 100 100" fill="none">
            <circle cx="50" cy="50" r="44" stroke="currentColor" strokeWidth="1.5" strokeDasharray="3 3" />
            <rect x="25" y="25" width="50" height="50" rx="4" stroke="currentColor" strokeWidth="1.5" transform="rotate(45 50 50)" />
            <rect x="25" y="25" width="50" height="50" rx="4" stroke="currentColor" strokeWidth="1.5" />
          </svg>
        </div>

        {/* Centered Exact Uploaded Photo across full header */}
        <motion.img 
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.85, ease: [0.25, 0.1, 0.25, 1] }}
          src={jamiaExactUserPhoto} 
          alt="جامعہ اسلامیہ ایبٹ آباد" 
          loading="eager"
          decoding="async"
          fetchPriority="high"
          className="relative z-10 w-full h-full object-contain mx-auto"
          onError={(e) => {
            const target = e.currentTarget;
            if (!target.dataset.tried) {
              target.dataset.tried = '1';
              target.src = '/jamia_banner.jpg';
            }
          }}
        />
      </motion.div>

      {/* Subtle decorative Islamic divider between Hero Banner and Service Cards on desktop */}
      <div className="hidden sm:flex items-center justify-center gap-3 -my-8 sm:-my-10 md:-my-12 select-none opacity-85">
        <div className="h-[1px] w-24 md:w-36 bg-gradient-to-r from-transparent via-[#B88A3B]/40 to-[#B88A3B]/70" />
        <div className="flex items-center gap-1.5 text-[#B88A3B]">
          <div className="w-1.5 h-1.5 rotate-45 bg-[#B88A3B]/60" />
          <svg className="w-5 h-5 text-[#B88A3B]" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2L14.5 8.5L21 9.5L16 14L17.5 20.5L12 17L6.5 20.5L8 14L3 9.5L9.5 8.5L12 2Z" opacity="0.8" />
          </svg>
          <div className="w-1.5 h-1.5 rotate-45 bg-[#B88A3B]/60" />
        </div>
        <div className="h-[1px] w-24 md:w-36 bg-gradient-to-l from-transparent via-[#B88A3B]/40 to-[#B88A3B]/70" />
      </div>

      {/* 2. EXACT 6 PORTAL TILES: 2 per row on mobile screens (grid-cols-2), 3 per row on tablet/desktop (sm:grid-cols-3) */}
      <div 
        className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 xs:gap-3 sm:gap-4 md:gap-5 lg:gap-6"
      >
        {/* Tile 1: بانیِ جامعہ و اکابرین */}
        <motion.div 
          initial={{ opacity: 0, x: -40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.85, ease: [0.25, 0.1, 0.25, 1] }}
          onClick={() => setCurrentTab('about')}
          className="relative w-full min-h-[96px] xs:min-h-[104px] sm:min-h-[132px] sm:h-34 md:h-38 lg:h-40 rounded-xl sm:rounded-xl md:rounded-2xl bg-gradient-to-br from-[#FFFFFF] via-[#FDFBF7] to-[#F5EEDD] dark:from-[#151D2A] dark:via-[#151D2A] dark:to-[#151D2A] border border-[#B88A3B]/45 sm:border-[#B88A3B]/55 hover:border-[#966E28] dark:border-amber-700/40 dark:hover:border-[#B88A3B] shadow-[0_3px_12px_rgba(184,138,59,0.1),0_1px_3px_rgba(0,0,0,0.04),inset_0_1px_1px_rgba(255,255,255,0.9)] sm:shadow-[0_5px_16px_rgba(184,138,59,0.12),inset_0_1px_1px_rgba(255,255,255,0.9),inset_0_-1px_2px_rgba(184,138,59,0.1)] hover:shadow-[0_12px_28px_rgba(184,138,59,0.25),0_4px_10px_rgba(0,0,0,0.06)] dark:shadow-[0_4px_14px_rgba(0,0,0,0.4)] dark:hover:shadow-[0_8px_24px_rgba(184,138,59,0.25)] hover:-translate-y-1 hover:scale-[1.01] transition-all duration-500 ease-out cursor-pointer group overflow-hidden flex items-center justify-between py-1 xs:py-1.5 sm:py-0 select-none"
          dir="ltr"
        >
          {/* Smooth Left-to-Right Golden Spread Wave on Hover & Touch */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#F7ECCF] via-[#EED8A1] to-[#DFC27F] dark:from-[#2B3A52] dark:via-[#222E42] dark:to-[#192333] origin-left scale-x-0 group-hover:scale-x-100 group-active:scale-x-100 transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] pointer-events-none z-0 opacity-95" />

          {/* Subtle top and bottom gold accent lines */}
          <div className="absolute top-0 inset-x-0 h-[2px] sm:h-[2.5px] bg-gradient-to-r from-transparent via-[#D4AF37]/65 to-transparent group-hover:via-[#B88A3B] transition-all duration-500 pointer-events-none z-10" />
          <div className="absolute bottom-0 inset-x-0 h-[1px] sm:h-[1.5px] bg-gradient-to-r from-transparent via-[#D4AF37]/35 to-transparent group-hover:via-[#B88A3B]/80 transition-all duration-500 pointer-events-none z-10" />

          {/* Left Cream Curved Arc Container with Dark Icon */}
          <div className="relative z-10 w-12 xs:w-13 sm:w-26 md:w-30 lg:w-34 shrink-0 self-stretch bg-gradient-to-br from-[#F7ECCF] via-[#EED8A1] to-[#DFC27F] dark:from-[#243044] dark:to-[#1E283A] group-hover:from-[#F3E2B6] group-hover:to-[#D4AF37] dark:group-hover:from-[#2D3C55] dark:group-hover:to-[#243044] rounded-r-[38px] xs:rounded-r-[46px] sm:rounded-r-[75px] md:rounded-r-[90px] lg:rounded-r-[100px] flex items-center justify-center border-r border-[#DEC998] sm:border-[#CBAA67] dark:border-amber-700/50 group-hover:border-[#B88A3B]/80 shadow-inner transition-all duration-500 ease-out">
            {/* Scholar Pen / Ornate Calligraphy Emblem SVG */}
            <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-6.5 h-6.5 xs:w-7 xs:h-7 sm:w-13 sm:h-13 md:w-15 md:h-15 lg:w-16 lg:h-16 text-[#241F1A] dark:text-amber-300 drop-shadow-[0_1px_1px_rgba(255,255,255,0.4)] transition-transform duration-500 group-hover:scale-105">
              <path d="M32 6L28 22H36L32 6Z" fill="currentColor" />
              <path d="M32 22V32M32 32L31 34H33L32 32Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              <path d="M22 36C22 34 26 33 32 33C38 33 42 34 42 36C42 40 37 42 32 42C27 42 22 40 22 36Z" fill="currentColor" />
              <path d="M16 45C18 42 24 41 32 41C40 41 46 42 48 45C49 48 44 52 32 52C20 52 15 48 16 45Z" fill="currentColor" opacity="0.9" />
              <path d="M12 52C15 49 22 48 32 48C42 48 49 49 52 52C54 56 46 59 32 59C18 59 10 56 12 52Z" fill="currentColor" opacity="0.75" />
              <circle cx="32" cy="18" r="1.5" fill="#F5EDD6" className="dark:fill-[#1E293B]" />
            </svg>
          </div>

          {/* Right Text Block */}
          <div className="relative z-10 grow pl-0.5 xs:pl-1 pr-1 xs:pr-2 sm:pr-4 md:pr-6 lg:pr-7 py-0.5 sm:py-1.5 md:py-2 space-y-0 sm:space-y-0.5 min-w-0 flex flex-col justify-center" dir={language === 'en' ? 'ltr' : 'rtl'}>
            <h3 className={`text-center text-[13.5px] xs:text-[15px] sm:text-lg md:text-xl lg:text-[23px] font-bold text-[#1A1612] dark:text-white group-hover:text-[#5C4632] dark:group-hover:text-amber-300 transition-colors whitespace-nowrap ${language === 'en' ? 'font-sans leading-tight' : 'font-urdu leading-[2.1] pt-0.5 sm:pt-1'}`}>
              {language === 'ar' ? 'مؤسس الجامعة' : language === 'en' ? 'Founder & Elders' : 'بانیِ جامعہ'}
            </h3>
            <p className={`text-right w-full text-[10.5px] xs:text-[12px] sm:text-sm md:text-[15px] lg:text-[16.5px] text-[#363028] dark:text-slate-300 whitespace-nowrap overflow-visible font-medium ${language === 'en' ? 'font-sans leading-snug' : 'font-urdu leading-[1.8]'}`}>
              {language === 'ar' ? 'التعريف والخدمات' : language === 'en' ? 'Founder & Services' : 'تعارف و خدمات'}
            </p>
          </div>
        </motion.div>

        {/* Tile 2: تعارفِ جامعہ اسلامیہ */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.92, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.85, ease: [0.25, 0.1, 0.25, 1] }}
          onClick={() => setCurrentTab('about')}
          className="relative w-full min-h-[96px] xs:min-h-[104px] sm:min-h-[132px] sm:h-34 md:h-38 lg:h-40 rounded-xl sm:rounded-xl md:rounded-2xl bg-gradient-to-br from-[#FFFFFF] via-[#FDFBF7] to-[#F5EEDD] dark:from-[#151D2A] dark:via-[#151D2A] dark:to-[#151D2A] border border-[#B88A3B]/45 sm:border-[#B88A3B]/55 hover:border-[#966E28] dark:border-amber-700/40 dark:hover:border-[#B88A3B] shadow-[0_3px_12px_rgba(184,138,59,0.1),0_1px_3px_rgba(0,0,0,0.04),inset_0_1px_1px_rgba(255,255,255,0.9)] sm:shadow-[0_5px_16px_rgba(184,138,59,0.12),inset_0_1px_1px_rgba(255,255,255,0.9),inset_0_-1px_2px_rgba(184,138,59,0.1)] hover:shadow-[0_12px_28px_rgba(184,138,59,0.25),0_4px_10px_rgba(0,0,0,0.06)] dark:shadow-[0_4px_14px_rgba(0,0,0,0.4)] dark:hover:shadow-[0_8px_24px_rgba(184,138,59,0.25)] hover:-translate-y-1 hover:scale-[1.01] transition-all duration-500 ease-out cursor-pointer group overflow-hidden flex items-center justify-between py-1 xs:py-1.5 sm:py-0 select-none"
          dir="ltr"
        >
          {/* Smooth Left-to-Right Golden Spread Wave on Hover & Touch */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#F7ECCF] via-[#EED8A1] to-[#DFC27F] dark:from-[#2B3A52] dark:via-[#222E42] dark:to-[#192333] origin-left scale-x-0 group-hover:scale-x-100 group-active:scale-x-100 transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] pointer-events-none z-0 opacity-95" />

          {/* Subtle top and bottom gold accent lines */}
          <div className="absolute top-0 inset-x-0 h-[2px] sm:h-[2.5px] bg-gradient-to-r from-transparent via-[#D4AF37]/65 to-transparent group-hover:via-[#B88A3B] transition-all duration-500 pointer-events-none z-10" />
          <div className="absolute bottom-0 inset-x-0 h-[1px] sm:h-[1.5px] bg-gradient-to-r from-transparent via-[#D4AF37]/35 to-transparent group-hover:via-[#B88A3B]/80 transition-all duration-500 pointer-events-none z-10" />

          <div className="relative z-10 w-12 xs:w-13 sm:w-26 md:w-30 lg:w-34 shrink-0 self-stretch bg-gradient-to-br from-[#F7ECCF] via-[#EED8A1] to-[#DFC27F] dark:from-[#243044] dark:to-[#1E283A] group-hover:from-[#F3E2B6] group-hover:to-[#D4AF37] dark:group-hover:from-[#2D3C55] dark:group-hover:to-[#243044] rounded-r-[38px] xs:rounded-r-[46px] sm:rounded-r-[75px] md:rounded-r-[90px] lg:rounded-r-[100px] flex items-center justify-center border-r border-[#DEC998] sm:border-[#CBAA67] dark:border-amber-700/50 group-hover:border-[#B88A3B]/80 shadow-inner transition-all duration-500 ease-out">
            {/* Islamic 8-Point Geometric Rosette Medallion SVG */}
            <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-6.5 h-6.5 xs:w-7 xs:h-7 sm:w-13 sm:h-13 md:w-15 md:h-15 lg:w-16 lg:h-16 text-[#241F1A] dark:text-amber-300 drop-shadow-[0_1px_1px_rgba(255,255,255,0.4)] transition-transform duration-500 group-hover:scale-105">
              <g fill="currentColor">
                <rect x="18" y="18" width="28" height="28" rx="2" transform="rotate(0 32 32)" />
                <rect x="18" y="18" width="28" height="28" rx="2" transform="rotate(45 32 32)" />
              </g>
              <g fill="#F5EDD6" className="dark:fill-[#1E293B]">
                <rect x="22" y="22" width="20" height="20" rx="1.5" transform="rotate(0 32 32)" />
                <rect x="22" y="22" width="20" height="20" rx="1.5" transform="rotate(45 32 32)" />
              </g>
              <g fill="currentColor">
                <circle cx="32" cy="32" r="5" />
                <circle cx="32" cy="24" r="2" />
                <circle cx="32" cy="40" r="2" />
                <circle cx="24" cy="32" r="2" />
                <circle cx="40" cy="32" r="2" />
                <circle cx="26.34" cy="26.34" r="1.5" />
                <circle cx="37.66" cy="37.66" r="1.5" />
                <circle cx="26.34" cy="37.66" r="1.5" />
                <circle cx="37.66" cy="26.34" r="1.5" />
              </g>
              <circle cx="32" cy="32" r="2" fill="#F5EDD6" className="dark:fill-[#1E293B]" />
            </svg>
          </div>

          <div className="relative z-10 grow pl-0.5 xs:pl-1 pr-1 xs:pr-2 sm:pr-4 md:pr-6 lg:pr-7 py-0.5 sm:py-1.5 md:py-2 space-y-0 sm:space-y-0.5 min-w-0 flex flex-col justify-center" dir={language === 'en' ? 'ltr' : 'rtl'}>
            <h3 className={`text-center text-[13.5px] xs:text-[15px] sm:text-lg md:text-xl lg:text-[23px] font-bold text-[#1A1612] dark:text-white group-hover:text-[#5C4632] dark:group-hover:text-amber-300 transition-colors whitespace-nowrap ${language === 'en' ? 'font-sans leading-tight' : 'font-urdu leading-[2.1] pt-0.5 sm:pt-1'}`}>
              {language === 'ar' ? 'التعريف بالجامعة' : language === 'en' ? 'About Jamia' : 'تعارفِ جامعہ اسلامیہ'}
            </h3>
            <p className={`text-right w-full text-[10.5px] xs:text-[12px] sm:text-sm md:text-[15px] lg:text-[16.5px] text-[#363028] dark:text-slate-300 whitespace-nowrap overflow-visible font-medium ${language === 'en' ? 'font-sans leading-snug' : 'font-urdu leading-[1.8]'}`}>
              {language === 'ar' ? 'نبذة عن الجامعة' : language === 'en' ? 'Jamia at a Glance' : 'جامعہ کا مختصر تعارف'}
            </p>
          </div>
        </motion.div>

        {/* Tile 3: دار الافتاء */}
        <motion.div 
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.85, ease: [0.25, 0.1, 0.25, 1] }}
          onClick={() => onOpenFatwaModal ? onOpenFatwaModal() : setCurrentTab('fatwa-new')}
          className="relative w-full min-h-[96px] xs:min-h-[104px] sm:min-h-[132px] sm:h-34 md:h-38 lg:h-40 rounded-xl sm:rounded-xl md:rounded-2xl bg-gradient-to-br from-[#FFFFFF] via-[#FDFBF7] to-[#F5EEDD] dark:from-[#151D2A] dark:via-[#151D2A] dark:to-[#151D2A] border border-[#B88A3B]/45 sm:border-[#B88A3B]/55 hover:border-[#966E28] dark:border-amber-700/40 dark:hover:border-[#B88A3B] shadow-[0_3px_12px_rgba(184,138,59,0.1),0_1px_3px_rgba(0,0,0,0.04),inset_0_1px_1px_rgba(255,255,255,0.9)] sm:shadow-[0_5px_16px_rgba(184,138,59,0.12),inset_0_1px_1px_rgba(255,255,255,0.9),inset_0_-1px_2px_rgba(184,138,59,0.1)] hover:shadow-[0_12px_28px_rgba(184,138,59,0.25),0_4px_10px_rgba(0,0,0,0.06)] dark:shadow-[0_4px_14px_rgba(0,0,0,0.4)] dark:hover:shadow-[0_8px_24px_rgba(184,138,59,0.25)] hover:-translate-y-1 hover:scale-[1.01] transition-all duration-500 ease-out cursor-pointer group overflow-hidden flex items-center justify-between py-1 xs:py-1.5 sm:py-0 select-none"
          dir="ltr"
        >
          {/* Smooth Left-to-Right Golden Spread Wave on Hover & Touch */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#F7ECCF] via-[#EED8A1] to-[#DFC27F] dark:from-[#2B3A52] dark:via-[#222E42] dark:to-[#192333] origin-left scale-x-0 group-hover:scale-x-100 group-active:scale-x-100 transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] pointer-events-none z-0 opacity-95" />

          {/* Subtle top and bottom gold accent lines */}
          <div className="absolute top-0 inset-x-0 h-[2px] sm:h-[2.5px] bg-gradient-to-r from-transparent via-[#D4AF37]/65 to-transparent group-hover:via-[#B88A3B] transition-all duration-500 pointer-events-none z-10" />
          <div className="absolute bottom-0 inset-x-0 h-[1px] sm:h-[1.5px] bg-gradient-to-r from-transparent via-[#D4AF37]/35 to-transparent group-hover:via-[#B88A3B]/80 transition-all duration-500 pointer-events-none z-10" />

          <div className="relative z-10 w-12 xs:w-13 sm:w-26 md:w-30 lg:w-34 shrink-0 self-stretch bg-gradient-to-br from-[#F7ECCF] via-[#EED8A1] to-[#DFC27F] dark:from-[#243044] dark:to-[#1E283A] group-hover:from-[#F3E2B6] group-hover:to-[#D4AF37] dark:group-hover:from-[#2D3C55] dark:group-hover:to-[#243044] rounded-r-[38px] xs:rounded-r-[46px] sm:rounded-r-[75px] md:rounded-r-[90px] lg:rounded-r-[100px] flex items-center justify-center border-r border-[#DEC998] sm:border-[#CBAA67] dark:border-amber-700/50 group-hover:border-[#B88A3B]/80 shadow-inner transition-all duration-500 ease-out">
            {/* 3 Isometric Stacked Books SVG */}
            <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-6.5 h-6.5 xs:w-7 xs:h-7 sm:w-13 sm:h-13 md:w-15 md:h-15 lg:w-16 lg:h-16 text-[#241F1A] dark:text-amber-300 drop-shadow-[0_1px_1px_rgba(255,255,255,0.4)] transition-transform duration-500 group-hover:scale-105">
              <path d="M16 20L32 14L48 20L32 26L16 20Z" fill="currentColor" />
              <path d="M16 20V24L32 30L48 24V20L32 26L16 20Z" fill="#F5EDD6" className="dark:fill-[#1E293B]" stroke="currentColor" strokeWidth="1.5" />
              <path d="M16 24V27L32 33L48 27V24L32 30L16 24Z" fill="currentColor" />
              <path d="M16 32V36L32 42L48 36V32L32 38L16 32Z" fill="#F5EDD6" className="dark:fill-[#1E293B]" stroke="currentColor" strokeWidth="1.5" />
              <path d="M16 36V39L32 45L48 39V36L32 42L16 36Z" fill="currentColor" />
              <path d="M16 44V48L32 54L48 48V44L32 50L16 44Z" fill="#F5EDD6" className="dark:fill-[#1E293B]" stroke="currentColor" strokeWidth="1.5" />
              <path d="M16 48V51L32 57L48 51V48L32 54L16 48Z" fill="currentColor" />
            </svg>
          </div>

          <div className="relative z-10 grow pl-0.5 xs:pl-1 pr-0 xs:pr-1 sm:pr-3 md:pr-5 py-0.5 sm:py-1.5 md:py-2 space-y-0 sm:space-y-0.5 min-w-0 flex flex-col justify-center" dir={language === 'en' ? 'ltr' : 'rtl'}>
            <h3 className={`text-center text-[13.5px] xs:text-[15px] sm:text-lg md:text-xl lg:text-[23px] font-bold text-[#1A1612] dark:text-white group-hover:text-[#5C4632] dark:group-hover:text-amber-300 transition-colors whitespace-nowrap ${language === 'en' ? 'font-sans leading-tight' : 'font-urdu leading-[2.1] pt-0.5 sm:pt-1'}`}>
              {language === 'ar' ? 'دار الإفتاء' : language === 'en' ? 'Darul Ifta' : 'دار الافتاء'}
            </h3>
            <p className={`text-right w-full pr-0 text-[10.5px] xs:text-[12px] sm:text-sm md:text-[15px] lg:text-[16.5px] text-[#363028] dark:text-slate-300 whitespace-nowrap overflow-visible font-medium ${language === 'en' ? 'font-sans leading-snug' : 'font-urdu leading-[1.8]'}`}>
              {language === 'ar' ? 'حل المسائل والفتاوى' : language === 'en' ? 'Answers to Inquiries' : 'آپ کے مسائل کا شرعی حل'}
            </p>
          </div>
        </motion.div>

        {/* Tile 4: جرائد و رسائل */}
        <motion.div 
          initial={{ opacity: 0, x: -40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.85, ease: [0.25, 0.1, 0.25, 1], delay: 0.08 }}
          onClick={() => setCurrentTab('library')}
          className="relative w-full min-h-[96px] xs:min-h-[104px] sm:min-h-[132px] sm:h-34 md:h-38 lg:h-40 rounded-xl sm:rounded-xl md:rounded-2xl bg-gradient-to-br from-[#FFFFFF] via-[#FDFBF7] to-[#F5EEDD] dark:from-[#151D2A] dark:via-[#151D2A] dark:to-[#151D2A] border border-[#B88A3B]/45 sm:border-[#B88A3B]/55 hover:border-[#966E28] dark:border-amber-700/40 dark:hover:border-[#B88A3B] shadow-[0_3px_12px_rgba(184,138,59,0.1),0_1px_3px_rgba(0,0,0,0.04),inset_0_1px_1px_rgba(255,255,255,0.9)] sm:shadow-[0_5px_16px_rgba(184,138,59,0.12),inset_0_1px_1px_rgba(255,255,255,0.9),inset_0_-1px_2px_rgba(184,138,59,0.1)] hover:shadow-[0_12px_28px_rgba(184,138,59,0.25),0_4px_10px_rgba(0,0,0,0.06)] dark:shadow-[0_4px_14px_rgba(0,0,0,0.4)] dark:hover:shadow-[0_8px_24px_rgba(184,138,59,0.25)] hover:-translate-y-1 hover:scale-[1.01] transition-all duration-500 ease-out cursor-pointer group overflow-hidden flex items-center justify-between py-1 xs:py-1.5 sm:py-0 select-none"
          dir="ltr"
        >
          {/* Smooth Left-to-Right Golden Spread Wave on Hover & Touch */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#F7ECCF] via-[#EED8A1] to-[#DFC27F] dark:from-[#2B3A52] dark:via-[#222E42] dark:to-[#192333] origin-left scale-x-0 group-hover:scale-x-100 group-active:scale-x-100 transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] pointer-events-none z-0 opacity-95" />

          {/* Subtle top and bottom gold accent lines */}
          <div className="absolute top-0 inset-x-0 h-[2px] sm:h-[2.5px] bg-gradient-to-r from-transparent via-[#D4AF37]/65 to-transparent group-hover:via-[#B88A3B] transition-all duration-500 pointer-events-none z-10" />
          <div className="absolute bottom-0 inset-x-0 h-[1px] sm:h-[1.5px] bg-gradient-to-r from-transparent via-[#D4AF37]/35 to-transparent group-hover:via-[#B88A3B]/80 transition-all duration-500 pointer-events-none z-10" />

          <div className="relative z-10 w-12 xs:w-13 sm:w-26 md:w-30 lg:w-34 shrink-0 self-stretch bg-gradient-to-br from-[#F7ECCF] via-[#EED8A1] to-[#DFC27F] dark:from-[#243044] dark:to-[#1E283A] group-hover:from-[#F3E2B6] group-hover:to-[#D4AF37] dark:group-hover:from-[#2D3C55] dark:group-hover:to-[#243044] rounded-r-[38px] xs:rounded-r-[46px] sm:rounded-r-[75px] md:rounded-r-[90px] lg:rounded-r-[100px] flex items-center justify-center border-r border-[#DEC998] sm:border-[#CBAA67] dark:border-amber-700/50 group-hover:border-[#B88A3B]/80 shadow-inner transition-all duration-500 ease-out">
            {/* Mosque Minaret + Open Quran Sun Rays SVG */}
            <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-6.5 h-6.5 xs:w-7 xs:h-7 sm:w-13 sm:h-13 md:w-15 md:h-15 lg:w-16 lg:h-16 text-[#241F1A] dark:text-amber-300 drop-shadow-[0_1px_1px_rgba(255,255,255,0.4)] transition-transform duration-500 group-hover:scale-105">
              <path d="M22 8L20 16H24L22 8Z" fill="currentColor" />
              <rect x="19" y="16" width="6" height="4" fill="currentColor" />
              <rect x="20" y="20" width="4" height="18" fill="currentColor" stroke="currentColor" strokeWidth="0.5" />
              <rect x="18" y="26" width="8" height="2" fill="currentColor" />
              <path d="M28 32L38 24M32 35L44 30M34 38L48 38" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              <path d="M24 44C28 42 34 43 38 45C42 43 48 42 52 44V52C48 50 42 51 38 53C34 51 28 50 24 52V44Z" fill="currentColor" />
              <path d="M38 45V53" stroke="#F5EDD6" className="dark:stroke-[#1E293B]" strokeWidth="1.5" />
              <path d="M30 54L38 48L46 54L38 60L30 54Z" fill="currentColor" opacity="0.85" />
            </svg>
          </div>

          <div className="relative z-10 grow pl-0.5 xs:pl-1 pr-1 xs:pr-2 sm:pr-4 md:pr-6 lg:pr-7 py-0.5 sm:py-1.5 md:py-2 space-y-0 sm:space-y-0.5 min-w-0 flex flex-col justify-center" dir={language === 'en' ? 'ltr' : 'rtl'}>
            <h3 className={`text-center text-[13.5px] xs:text-[15px] sm:text-lg md:text-xl lg:text-[23px] font-bold text-[#1A1612] dark:text-white group-hover:text-[#5C4632] dark:group-hover:text-amber-300 transition-colors whitespace-nowrap ${language === 'en' ? 'font-sans leading-tight' : 'font-urdu leading-[2.1] pt-0.5 sm:pt-1'}`}>
              {language === 'ar' ? 'جرائد ومجلات' : language === 'en' ? 'Journals & Magazines' : 'جرائد و رسائل'}
            </h3>
            <p className={`text-right w-full text-[10.5px] xs:text-[12px] sm:text-sm md:text-[15px] lg:text-[16.5px] text-[#363028] dark:text-slate-300 whitespace-nowrap overflow-visible font-medium ${language === 'en' ? 'font-sans leading-snug' : 'font-urdu leading-[1.8]'}`}>
              {language === 'ar' ? 'المجلات والبحوث' : language === 'en' ? 'Journals & Articles' : 'علمی و دعوتی رسائل'}
            </p>
          </div>
        </motion.div>

        {/* Tile 5: کتابیں */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.92, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.85, ease: [0.25, 0.1, 0.25, 1], delay: 0.08 }}
          onClick={() => setCurrentTab('library')}
          className="relative w-full min-h-[96px] xs:min-h-[104px] sm:min-h-[132px] sm:h-34 md:h-38 lg:h-40 rounded-xl sm:rounded-xl md:rounded-2xl bg-gradient-to-br from-[#FFFFFF] via-[#FDFBF7] to-[#F5EEDD] dark:from-[#151D2A] dark:via-[#151D2A] dark:to-[#151D2A] border border-[#B88A3B]/45 sm:border-[#B88A3B]/55 hover:border-[#966E28] dark:border-amber-700/40 dark:hover:border-[#B88A3B] shadow-[0_3px_12px_rgba(184,138,59,0.1),0_1px_3px_rgba(0,0,0,0.04),inset_0_1px_1px_rgba(255,255,255,0.9)] sm:shadow-[0_5px_16px_rgba(184,138,59,0.12),inset_0_1px_1px_rgba(255,255,255,0.9),inset_0_-1px_2px_rgba(184,138,59,0.1)] hover:shadow-[0_12px_28px_rgba(184,138,59,0.25),0_4px_10px_rgba(0,0,0,0.06)] dark:shadow-[0_4px_14px_rgba(0,0,0,0.4)] dark:hover:shadow-[0_8px_24px_rgba(184,138,59,0.25)] hover:-translate-y-1 hover:scale-[1.01] transition-all duration-500 ease-out cursor-pointer group overflow-hidden flex items-center justify-between py-1 xs:py-1.5 sm:py-0 select-none"
          dir="ltr"
        >
          {/* Smooth Left-to-Right Golden Spread Wave on Hover & Touch */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#F7ECCF] via-[#EED8A1] to-[#DFC27F] dark:from-[#2B3A52] dark:via-[#222E42] dark:to-[#192333] origin-left scale-x-0 group-hover:scale-x-100 group-active:scale-x-100 transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] pointer-events-none z-0 opacity-95" />

          {/* Subtle top and bottom gold accent lines */}
          <div className="absolute top-0 inset-x-0 h-[2px] sm:h-[2.5px] bg-gradient-to-r from-transparent via-[#D4AF37]/65 to-transparent group-hover:via-[#B88A3B] transition-all duration-500 pointer-events-none z-10" />
          <div className="absolute bottom-0 inset-x-0 h-[1px] sm:h-[1.5px] bg-gradient-to-r from-transparent via-[#D4AF37]/35 to-transparent group-hover:via-[#B88A3B]/80 transition-all duration-500 pointer-events-none z-10" />

          <div className="relative z-10 w-12 xs:w-13 sm:w-26 md:w-30 lg:w-34 shrink-0 self-stretch bg-gradient-to-br from-[#F7ECCF] via-[#EED8A1] to-[#DFC27F] dark:from-[#243044] dark:to-[#1E283A] group-hover:from-[#F3E2B6] group-hover:to-[#D4AF37] dark:group-hover:from-[#2D3C55] dark:group-hover:to-[#243044] rounded-r-[38px] xs:rounded-r-[46px] sm:rounded-r-[75px] md:rounded-r-[90px] lg:rounded-r-[100px] flex items-center justify-center border-r border-[#DEC998] sm:border-[#CBAA67] dark:border-amber-700/50 group-hover:border-[#B88A3B]/80 shadow-inner transition-all duration-500 ease-out">
            {/* Library Bookshelf Standing Vertical Books SVG */}
            <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-6.5 h-6.5 xs:w-7 xs:h-7 sm:w-13 sm:h-13 md:w-15 md:h-15 lg:w-16 lg:h-16 text-[#241F1A] dark:text-amber-300 drop-shadow-[0_1px_1px_rgba(255,255,255,0.4)] transition-transform duration-500 group-hover:scale-105">
              <rect x="12" y="52" width="40" height="3" fill="currentColor" />
              <rect x="16" y="20" width="6" height="30" rx="1" fill="currentColor" />
              <rect x="17.5" y="24" width="3" height="2" fill="#F5EDD6" className="dark:fill-[#1E293B]" />
              <rect x="17.5" y="42" width="3" height="2" fill="#F5EDD6" className="dark:fill-[#1E293B]" />
              <rect x="24" y="23" width="7" height="27" rx="1" fill="currentColor" />
              <rect x="25.5" y="27" width="4" height="2" fill="#F5EDD6" className="dark:fill-[#1E293B]" />
              <rect x="25.5" y="43" width="4" height="2" fill="#F5EDD6" className="dark:fill-[#1E293B]" />
              <rect x="33" y="18" width="6" height="32" rx="1" fill="currentColor" />
              <rect x="34.5" y="22" width="3" height="2" fill="#F5EDD6" className="dark:fill-[#1E293B]" />
              <rect x="34.5" y="44" width="3" height="2" fill="#F5EDD6" className="dark:fill-[#1E293B]" />
              <g transform="rotate(18 42 50)">
                <rect x="39" y="20" width="7" height="30" rx="1" fill="currentColor" />
                <rect x="40.5" y="24" width="4" height="2" fill="#F5EDD6" className="dark:fill-[#1E293B]" />
                <rect x="40.5" y="42" width="4" height="2" fill="#F5EDD6" className="dark:fill-[#1E293B]" />
              </g>
            </svg>
          </div>

          <div className="relative z-10 grow pl-0.5 xs:pl-1 pr-1 xs:pr-2 sm:pr-4 md:pr-6 lg:pr-7 py-0.5 sm:py-1.5 md:py-2 space-y-0 sm:space-y-0.5 min-w-0 flex flex-col justify-center" dir={language === 'en' ? 'ltr' : 'rtl'}>
            <h3 className={`text-center text-[13.5px] xs:text-[15px] sm:text-lg md:text-xl lg:text-[23px] font-bold text-[#1A1612] dark:text-white group-hover:text-[#5C4632] dark:group-hover:text-amber-300 transition-colors whitespace-nowrap ${language === 'en' ? 'font-sans leading-tight' : 'font-urdu leading-[2.1] pt-0.5 sm:pt-1'}`}>
              {language === 'ar' ? 'الكتب والمؤلفات' : language === 'en' ? 'Books & Publications' : 'کتابیں'}
            </h3>
            <p className={`text-right w-full text-[10.5px] xs:text-[12px] sm:text-sm md:text-[15px] lg:text-[16.5px] text-[#363028] dark:text-slate-300 whitespace-nowrap overflow-visible font-medium ${language === 'en' ? 'font-sans leading-snug' : 'font-urdu leading-[1.8]'}`}>
              {language === 'ar' ? 'مؤلفات علمية وإصلاحية' : language === 'en' ? 'Islamic Publications' : 'مفید علمی و اصلاحی کتب'}
            </p>
          </div>
        </motion.div>

        {/* Tile 6: رابطہ */}
        <motion.div 
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.85, ease: [0.25, 0.1, 0.25, 1], delay: 0.08 }}
          onClick={() => setCurrentTab('contact')}
          className="relative w-full min-h-[96px] xs:min-h-[104px] sm:min-h-[132px] sm:h-34 md:h-38 lg:h-40 rounded-xl sm:rounded-xl md:rounded-2xl bg-gradient-to-br from-[#FFFFFF] via-[#FDFBF7] to-[#F5EEDD] dark:from-[#151D2A] dark:via-[#151D2A] dark:to-[#151D2A] border border-[#B88A3B]/45 sm:border-[#B88A3B]/55 hover:border-[#966E28] dark:border-amber-700/40 dark:hover:border-[#B88A3B] shadow-[0_3px_12px_rgba(184,138,59,0.1),0_1px_3px_rgba(0,0,0,0.04),inset_0_1px_1px_rgba(255,255,255,0.9)] sm:shadow-[0_5px_16px_rgba(184,138,59,0.12),inset_0_1px_1px_rgba(255,255,255,0.9),inset_0_-1px_2px_rgba(184,138,59,0.1)] hover:shadow-[0_12px_28px_rgba(184,138,59,0.25),0_4px_10px_rgba(0,0,0,0.06)] dark:shadow-[0_4px_14px_rgba(0,0,0,0.4)] dark:hover:shadow-[0_8px_24px_rgba(184,138,59,0.25)] hover:-translate-y-1 hover:scale-[1.01] transition-all duration-500 ease-out cursor-pointer group overflow-hidden flex items-center justify-between py-1 xs:py-1.5 sm:py-0 select-none"
          dir="ltr"
        >
          {/* Smooth Left-to-Right Golden Spread Wave on Hover & Touch */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#F7ECCF] via-[#EED8A1] to-[#DFC27F] dark:from-[#2B3A52] dark:via-[#222E42] dark:to-[#192333] origin-left scale-x-0 group-hover:scale-x-100 group-active:scale-x-100 transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] pointer-events-none z-0 opacity-95" />

          {/* Subtle top and bottom gold accent lines */}
          <div className="absolute top-0 inset-x-0 h-[2px] sm:h-[2.5px] bg-gradient-to-r from-transparent via-[#D4AF37]/65 to-transparent group-hover:via-[#B88A3B] transition-all duration-500 pointer-events-none z-10" />
          <div className="absolute bottom-0 inset-x-0 h-[1px] sm:h-[1.5px] bg-gradient-to-r from-transparent via-[#D4AF37]/35 to-transparent group-hover:via-[#B88A3B]/80 transition-all duration-500 pointer-events-none z-10" />

          <div className="relative z-10 w-12 xs:w-13 sm:w-26 md:w-30 lg:w-34 shrink-0 self-stretch bg-gradient-to-br from-[#F7ECCF] via-[#EED8A1] to-[#DFC27F] dark:from-[#243044] dark:to-[#1E283A] group-hover:from-[#F3E2B6] group-hover:to-[#D4AF37] dark:group-hover:from-[#2D3C55] dark:group-hover:to-[#243044] rounded-r-[38px] xs:rounded-r-[46px] sm:rounded-r-[75px] md:rounded-r-[90px] lg:rounded-r-[100px] flex items-center justify-center border-r border-[#DEC998] sm:border-[#CBAA67] dark:border-amber-700/50 group-hover:border-[#B88A3B]/80 shadow-inner transition-all duration-500 ease-out">
            {/* Clipboard Notepad with Pen SVG */}
            <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-6.5 h-6.5 xs:w-7 xs:h-7 sm:w-13 sm:h-13 md:w-15 md:h-15 lg:w-16 lg:h-16 text-[#241F1A] dark:text-amber-300 drop-shadow-[0_1px_1px_rgba(255,255,255,0.4)] transition-transform duration-500 group-hover:scale-105">
              <rect x="16" y="16" width="28" height="36" rx="2.5" fill="currentColor" />
              <rect x="22" y="11" width="16" height="8" rx="2" fill="currentColor" />
              <circle cx="30" cy="15" r="2" fill="#F5EDD6" className="dark:fill-[#1E293B]" />
              <rect x="19" y="20" width="22" height="28" rx="1" fill="#F5EDD6" className="dark:fill-[#1E293B]" />
              <rect x="22" y="25" width="4" height="4" rx="0.5" fill="currentColor" />
              <rect x="28" y="26" width="10" height="2" fill="currentColor" />
              <rect x="22" y="32" width="4" height="4" rx="0.5" fill="currentColor" />
              <rect x="28" y="33" width="10" height="2" fill="currentColor" />
              <rect x="22" y="39" width="4" height="4" rx="0.5" fill="currentColor" />
              <rect x="28" y="40" width="10" height="2" fill="currentColor" />
              <g transform="rotate(-35 44 38)">
                <rect x="42" y="18" width="5" height="24" rx="1" fill="currentColor" />
                <path d="M42 42L44.5 48L47 42H42Z" fill="currentColor" />
                <circle cx="44.5" cy="48" r="0.8" fill="#F5EDD6" className="dark:fill-[#1E293B]" />
              </g>
            </svg>
          </div>

          <div className="relative z-10 grow pl-0.5 xs:pl-1 pr-1 xs:pr-2 sm:pr-4 md:pr-6 lg:pr-7 py-0.5 sm:py-1.5 md:py-2 space-y-0 sm:space-y-0.5 min-w-0 flex flex-col justify-center" dir={language === 'en' ? 'ltr' : 'rtl'}>
            <h3 className={`text-center text-[13.5px] xs:text-[15px] sm:text-lg md:text-xl lg:text-[23px] font-bold text-[#1A1612] dark:text-white group-hover:text-[#5C4632] dark:group-hover:text-amber-300 transition-colors whitespace-nowrap ${language === 'en' ? 'font-sans leading-tight' : 'font-urdu leading-[2.1] pt-0.5 sm:pt-1'}`}>
              {language === 'ar' ? 'الاتصال والاستفسار' : language === 'en' ? 'Contact Us' : 'رابطہ'}
            </h3>
            <p className={`text-right w-full text-[10.5px] xs:text-[12px] sm:text-sm md:text-[15px] lg:text-[16.5px] text-[#363028] dark:text-slate-300 whitespace-nowrap overflow-visible font-medium ${language === 'en' ? 'font-sans leading-snug' : 'font-urdu leading-[1.8]'}`}>
              {language === 'ar' ? 'للمعلومات والتواصل' : language === 'en' ? 'Information & Inquiry' : 'معلومات و رابطہ'}
            </p>
          </div>
        </motion.div>
      </div>

      {/* 3. SCROLL-TRIGGERED 3 LOWER SECTIONS: FADE-LEFT, FADE-UP, AND FADE-RIGHT */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 lg:gap-8 font-urdu" dir="rtl">
        
        {/* Column 1 (Left Card): مطبوعات و کتب (comes from Left / Fade-Left) */}
        <motion.div 
          initial={{ opacity: 0, x: -60, y: 20 }}
          whileInView={{ opacity: 1, x: 0, y: 0 }}
          viewport={{ once: true, amount: 0.15 }}
          transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
          className="w-full bg-white dark:bg-slate-900 rounded-lg border border-stone-300 dark:border-slate-800 shadow-xs overflow-hidden flex flex-col justify-between"
        >
          {/* Dark Wood Header Bar */}
          <div className="bg-[#5C4632] dark:bg-[#382B1E] text-white px-5 py-3.5 flex items-center justify-between border-b border-[#4A3727] dark:border-slate-800">
            <div className="flex items-center gap-2.5">
              <BookMarked className="w-5 h-5 text-[#B88A3B]" />
              <h3 className="text-xl sm:text-2xl font-bold font-urdu text-[#F8F4EC]">
                {language === 'ar' ? 'مطبوعات وكتب الجامعة' : language === 'en' ? 'Jamia Publications' : 'مطبوعات و کتب جامعہ'}
              </h3>
            </div>
            <span className="text-xs font-semibold text-[#B88A3B] bg-[#453424] px-2.5 py-0.5 rounded border border-[#6B533E]">
              {language === 'ar' ? 'المكتبة الرقمية' : language === 'en' ? 'Directory' : 'آن لائن ڈائریکٹری'}
            </span>
          </div>

          <div className="p-4 sm:p-5 space-y-4 flex flex-col justify-between grow">
            <div className="space-y-2.5 text-xs font-semibold">
              <div 
                onClick={() => setCurrentTab('library')}
                className="p-3 rounded-md bg-[#F8F6F0] dark:bg-slate-800 border border-stone-200 dark:border-slate-700 hover:border-[#B88A3B] transition-all cursor-pointer flex items-center justify-between gap-2 group"
              >
                <div className="min-w-0">
                  <div className="text-stone-900 dark:text-stone-100 font-bold text-sm leading-snug group-hover:text-[#B88A3B] transition-colors">
                    {language === 'ar' ? 'فتاوى الجامعة الإسلامية (المجلد الأول)' : language === 'en' ? 'Jamia Fatwas (Vol 1)' : 'فتاویٰ جامعہ اسلامیہ (جلد اول)'}
                  </div>
                  <div className="text-stone-600 dark:text-stone-400 font-normal text-xs mt-0.5">
                    {language === 'ar' ? 'مجموعة الفتاوى الشرعية والمسائل الفقهية' : language === 'en' ? 'Collection of Islamic rulings' : 'مجموعہ فتاویٰ شرعیہ و مسائل فقہ'}
                  </div>
                </div>
                <span className="bg-[#5C4632] text-white px-2 py-0.5 rounded text-[11px] font-semibold shrink-0">PDF</span>
              </div>

              <div 
                onClick={() => setCurrentTab('library')}
                className="p-3 rounded-md bg-[#F8F6F0] dark:bg-slate-800 border border-stone-200 dark:border-slate-700 hover:border-[#B88A3B] transition-all cursor-pointer flex items-center justify-between gap-2 group"
              >
                <div className="min-w-0">
                  <div className="text-stone-900 dark:text-stone-100 font-bold text-sm leading-snug group-hover:text-[#B88A3B] transition-colors">
                    {language === 'ar' ? 'مجلة "الجامعة" الشهرية - أحدث عدد' : language === 'en' ? 'Monthly "Al-Jamia" Latest Issue' : 'ماہنامہ "الجامعہ" تازہ شمارہ'}
                  </div>
                  <div className="text-stone-600 dark:text-stone-400 font-normal text-xs mt-0.5">
                    {language === 'ar' ? 'مجلة علمية دينية وبحثية محكمة' : language === 'en' ? 'Academic, religious & research journal' : 'علمی، دینی و تحقیقی مجلہ'}
                  </div>
                </div>
                <span className="bg-[#B88A3B] text-white px-2 py-0.5 rounded text-[11px] font-semibold shrink-0">
                  {language === 'ar' ? 'جديد' : language === 'en' ? 'New' : 'جدید'}
                </span>
              </div>

              <div 
                onClick={() => setCurrentTab('library')}
                className="p-3 rounded-md bg-[#F8F6F0] dark:bg-slate-800 border border-stone-200 dark:border-slate-700 hover:border-[#B88A3B] transition-all cursor-pointer flex items-center justify-between gap-2 group"
              >
                <div className="min-w-0">
                  <div className="text-stone-900 dark:text-stone-100 font-bold text-sm leading-snug group-hover:text-[#B88A3B] transition-colors">
                    {language === 'ar' ? 'رسائل وفتاوى العقيدة الإسلامية' : language === 'en' ? 'Treatises on Islamic Creed' : 'رسائل و فتاویٰ عقائد'}
                  </div>
                  <div className="text-stone-600 dark:text-stone-400 font-normal text-xs mt-0.5">
                    {language === 'ar' ? 'مقالات وأبحاث أئمة أهل السنة والجماعة' : language === 'en' ? 'Ahlus Sunnah scholars articles' : 'اہل سنت والجماعت اکابر مضامین'}
                  </div>
                </div>
                <span className="bg-[#5C4632] text-white px-2 py-0.5 rounded text-[11px] font-semibold shrink-0">
                  {language === 'ar' ? 'قراءة' : language === 'en' ? 'Read' : 'مطالعہ'}
                </span>
              </div>

              <div 
                onClick={() => setCurrentTab('library')}
                className="p-3 rounded-md bg-[#F8F6F0] dark:bg-slate-800 border border-stone-200 dark:border-slate-700 hover:border-[#B88A3B] transition-all cursor-pointer flex items-center justify-between gap-2 group"
              >
                <div className="min-w-0">
                  <div className="text-stone-900 dark:text-stone-100 font-bold text-sm leading-snug group-hover:text-[#B88A3B] transition-colors">
                    {language === 'ar' ? 'دروس الحديث ورسائل التجويد' : language === 'en' ? 'Hadith Lessons & Tajweed Rules' : 'دروس الحدیث و تجوید رسائل'}
                  </div>
                  <div className="text-stone-600 dark:text-stone-400 font-normal text-xs mt-0.5">
                    {language === 'ar' ? 'دليل تجويد القرآن والقراءة الصحيحة' : language === 'en' ? 'Quran Tajweed guide' : 'تجوید القرآن و ناظرہ گائیڈ'}
                  </div>
                </div>
                <span className="bg-[#5C4632] text-white px-2 py-0.5 rounded text-[11px] font-semibold shrink-0">
                  {language === 'ar' ? 'تحميل' : language === 'en' ? 'Download' : 'ڈاؤن لوڈ'}
                </span>
              </div>
            </div>

            <button 
              onClick={() => setCurrentTab('library')}
              className="w-full py-2.5 rounded bg-[#5C4632] hover:bg-[#4A3727] text-white font-bold text-sm transition-colors cursor-pointer shadow-xs mt-2"
            >
              {language === 'ar' ? 'عرض المكتبة والمطبوعات ◀' : language === 'en' ? 'View Library & Publications ◀' : 'کتب خانہ و مطبوعات دیکھیے ◀'}
            </button>
          </div>
        </motion.div>

        {/* Column 2 (Center Card): نماز کے اوقات (comes from Bottom / Fade-Up) */}
        <motion.div 
          initial={{ opacity: 0, y: 60, scale: 0.96 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true, amount: 0.15 }}
          transition={{ duration: 0.8, delay: 0.1, ease: [0.25, 0.1, 0.25, 1] }}
          className="w-full bg-white dark:bg-slate-900 rounded-lg border border-stone-300 dark:border-slate-800 shadow-xs overflow-hidden flex flex-col justify-between"
        >
          {/* Dark Wood Header Bar with Title */}
          <div className="bg-[#5C4632] dark:bg-[#382B1E] text-white px-5 py-3.5 flex items-center justify-between border-b border-[#4A3727] dark:border-slate-800">
            <div className="flex items-center gap-2.5">
              <Clock className="w-5 h-5 text-[#B88A3B]" />
              <h3 className="text-xl sm:text-2xl font-bold font-urdu text-[#F8F4EC]">
                {language === 'ar' ? 'مواقيت الصلاة' : language === 'en' ? 'Prayer Timings' : 'نماز کے اوقات'}
              </h3>
            </div>
            <span className="text-xs font-semibold text-[#B88A3B] bg-[#453424] px-2.5 py-0.5 rounded border border-[#6B533E]">
              {language === 'ar' ? 'أبت آباد' : language === 'en' ? 'Abbottabad' : 'ایبٹ آباد'}
            </span>
          </div>

          <div className="p-4 sm:p-5 space-y-4 flex flex-col justify-between grow">
            {/* Header Subtitle Line */}
            <div className="text-center font-urdu text-sm sm:text-base text-stone-800 dark:text-stone-200 border-b border-stone-200 dark:border-slate-800 pb-2.5">
              {getHijriAndGregorianDate(new Date(), language).displayCombined} • {language === 'ar' ? 'مواقيت الصلاة في أبت آباد' : language === 'en' ? 'Prayer times in Abbottabad' : 'ایبٹ آباد میں نماز کے اوقات'}
            </div>

            {/* 3x2 Prayer Timings Grid */}
            <div className="grid grid-cols-2 gap-2.5 sm:gap-3 text-stone-900 dark:text-stone-100 font-urdu">
              {/* Box 1: Fajr */}
              <div className="bg-white dark:bg-slate-800 border border-stone-300 dark:border-slate-700 rounded px-3 py-2 flex items-center justify-between shadow-2xs">
                <span className="font-mono text-sm font-semibold text-stone-700 dark:text-stone-300">{fajrTime}</span>
                <div className="flex items-center gap-1.5">
                  <span className="text-sm font-bold text-stone-800 dark:text-stone-100">
                    {language === 'ar' ? 'الفجر' : language === 'en' ? 'Fajr' : 'فجر'}
                  </span>
                  <span className="text-base">🌙</span>
                </div>
              </div>

              {/* Box 2: Sunrise */}
              <div className="bg-white dark:bg-slate-800 border border-stone-300 dark:border-slate-700 rounded px-3 py-2 flex items-center justify-between shadow-2xs">
                <span className="font-mono text-sm font-semibold text-stone-700 dark:text-stone-300">{sunriseTime}</span>
                <div className="flex items-center gap-1.5">
                  <span className="text-sm font-bold text-stone-800 dark:text-stone-100">
                    {language === 'ar' ? 'الشروق' : language === 'en' ? 'Sunrise' : 'طلوع'}
                  </span>
                  <span className="text-base">🌅</span>
                </div>
              </div>

              {/* Box 3: Zawal */}
              <div className="bg-white dark:bg-slate-800 border border-stone-300 dark:border-slate-700 rounded px-3 py-2 flex items-center justify-between shadow-2xs">
                <span className="font-mono text-sm font-semibold text-stone-700 dark:text-stone-300">{zawalTime}</span>
                <div className="flex items-center gap-1.5">
                  <span className="text-sm font-bold text-stone-800 dark:text-stone-100">
                    {language === 'ar' ? 'الزوال' : language === 'en' ? 'Zawal' : 'زوال'}
                  </span>
                  <span className="text-base">☀️</span>
                </div>
              </div>

              {/* Box 4: Asr */}
              <div className="bg-white dark:bg-slate-800 border border-stone-300 dark:border-slate-700 rounded px-3 py-2 flex items-center justify-between shadow-2xs">
                <span className="font-mono text-sm font-semibold text-stone-700 dark:text-stone-300">{asrTime}</span>
                <div className="flex items-center gap-1.5">
                  <span className="text-sm font-bold text-stone-800 dark:text-stone-100">
                    {language === 'ar' ? 'العصر' : language === 'en' ? 'Asr' : 'عصر'}
                  </span>
                  <span className="text-base">☀️</span>
                </div>
              </div>

              {/* Box 5: Sunset */}
              <div className="bg-white dark:bg-slate-800 border border-stone-300 dark:border-slate-700 rounded px-3 py-2 flex items-center justify-between shadow-2xs">
                <span className="font-mono text-sm font-semibold text-stone-700 dark:text-stone-300">{sunsetTime}</span>
                <div className="flex items-center gap-1.5">
                  <span className="text-sm font-bold text-stone-800 dark:text-stone-100">
                    {language === 'ar' ? 'الغروب' : language === 'en' ? 'Sunset' : 'غروب'}
                  </span>
                  <span className="text-base">🌅</span>
                </div>
              </div>

              {/* Box 6: Isha */}
              <div className="bg-white dark:bg-slate-800 border border-stone-300 dark:border-slate-700 rounded px-3 py-2 flex items-center justify-between shadow-2xs">
                <span className="font-mono text-sm font-semibold text-stone-700 dark:text-stone-300">{ishaTime}</span>
                <div className="flex items-center gap-1.5">
                  <span className="text-sm font-bold text-stone-800 dark:text-stone-100">
                    {language === 'ar' ? 'العشاء' : language === 'en' ? 'Isha' : 'عشاء'}
                  </span>
                  <span className="text-base">🌙</span>
                </div>
              </div>
            </div>

            <div className="text-center text-xs font-semibold text-stone-600 dark:text-stone-400 pt-2 border-t border-stone-200 dark:border-slate-800">
              {language === 'ar' ? 'مواقيت صلاة الجماعة بالجامع الكبير بالحرم الرئيسي' : language === 'en' ? 'Congregational prayer times at Main Campus Jamia Mosque' : 'اوقاتِ باجماعت جامعہ مسجد مرکزی کیمپس ایبٹ آباد'}
            </div>
          </div>
        </motion.div>

        {/* Column 3 (Right Card): مسنون دعائیں و اسلامی نام (comes from Right / Fade-Right) */}
        <motion.div 
          initial={{ opacity: 0, x: 60, y: 20 }}
          whileInView={{ opacity: 1, x: 0, y: 0 }}
          viewport={{ once: true, amount: 0.15 }}
          transition={{ duration: 0.8, delay: 0.15, ease: [0.25, 0.1, 0.25, 1] }}
          className="w-full bg-white dark:bg-slate-900 rounded-lg border border-stone-300 dark:border-slate-800 shadow-xs overflow-hidden flex flex-col justify-between"
        >
          {/* Dark Wood Header Bar */}
          <div className="bg-[#5C4632] dark:bg-[#382B1E] text-white px-5 py-3.5 flex items-center justify-between border-b border-[#4A3727] dark:border-slate-800">
            <div className="flex items-center gap-2.5">
              <Compass className="w-5 h-5 text-[#B88A3B]" />
              <h3 className="text-xl sm:text-2xl font-bold font-urdu text-[#F8F4EC]">
                {language === 'ar' ? 'الأدعية المأثورة والأسماء الإسلامية' : language === 'en' ? 'Prayers & Islamic Names' : 'مسنون دعائیں و اسلامی نام'}
              </h3>
            </div>
            <span className="text-xs font-semibold text-[#B88A3B] bg-[#453424] px-2.5 py-0.5 rounded border border-[#6B533E]">
              {language === 'ar' ? 'الأذكار والأسماء' : language === 'en' ? 'Azkar & Names' : 'اذکار و اسماء'}
            </span>
          </div>

          <div className="p-4 sm:p-5 space-y-4 flex flex-col justify-between grow">
            <div className="space-y-2.5 text-xs font-semibold">
              <div 
                onClick={() => setCurrentTab('fatwa-duas')}
                className="p-3 rounded-md bg-[#F8F6F0] dark:bg-slate-800 border border-stone-200 dark:border-slate-700 hover:border-[#B88A3B] transition-all cursor-pointer flex items-center justify-between gap-2 group"
              >
                <div className="min-w-0">
                  <div className="text-stone-900 dark:text-stone-100 font-bold text-sm leading-snug group-hover:text-[#B88A3B] transition-colors">
                    {language === 'ar' ? 'أذكار الصباح والمساء المأثورة' : language === 'en' ? 'Morning & Evening Azkar' : 'صبح و شام کے مسنون اذکار'}
                  </div>
                  <div className="text-stone-600 dark:text-stone-400 font-normal text-xs mt-0.5">
                    {language === 'ar' ? 'الحفظ والبركة والأدعية النبوية' : language === 'en' ? 'Protection, blessings and sunnah prayers' : 'حفاظت، برکت اور مسنون دعائیں'}
                  </div>
                </div>
                <span className="bg-[#5C4632] text-white px-2 py-0.5 rounded text-[11px] font-semibold shrink-0">
                  {language === 'ar' ? 'عرض' : language === 'en' ? 'View' : 'دیکھیے'}
                </span>
              </div>

              <div 
                onClick={() => setCurrentTab('fatwa-duas')}
                className="p-3 rounded-md bg-[#F8F6F0] dark:bg-slate-800 border border-stone-200 dark:border-slate-700 hover:border-[#B88A3B] transition-all cursor-pointer flex items-center justify-between gap-2 group"
              >
                <div className="min-w-0">
                  <div className="text-stone-900 dark:text-stone-100 font-bold text-sm leading-snug group-hover:text-[#B88A3B] transition-colors">
                    {language === 'ar' ? 'الأدعية المأثورة بعد الصلوات المفروضة' : language === 'en' ? 'Supplications After Daily Prayers' : 'نماز کے بعد کی مسنون دعائیں'}
                  </div>
                  <div className="text-stone-600 dark:text-stone-400 font-normal text-xs mt-0.5">
                    {language === 'ar' ? 'الاستغفار، آية الكرسي والتسبيح' : language === 'en' ? 'Istighfar, Ayat al-Kursi, and Azkar' : 'استغفار، آیت الکرسی، اور اذکار'}
                  </div>
                </div>
                <span className="bg-[#5C4632] text-white px-2 py-0.5 rounded text-[11px] font-semibold shrink-0">
                  {language === 'ar' ? 'عرض' : language === 'en' ? 'View' : 'دیکھیے'}
                </span>
              </div>

              <div 
                onClick={() => setCurrentTab('fatwa-names')}
                className="p-3 rounded-md bg-[#F8F6F0] dark:bg-slate-800 border border-stone-200 dark:border-slate-700 hover:border-[#B88A3B] transition-all cursor-pointer flex items-center justify-between gap-2 group"
              >
                <div className="min-w-0">
                  <div className="text-stone-900 dark:text-stone-100 font-bold text-sm leading-snug group-hover:text-[#B88A3B] transition-colors">
                    {language === 'ar' ? 'الأسماء الإسلامية المختارة (للذكور)' : language === 'en' ? 'Selected Islamic Names (Boys)' : 'منتخب اسلامی نام (لڑکوں کے)'}
                  </div>
                  <div className="text-stone-600 dark:text-stone-400 font-normal text-xs mt-0.5">
                    {language === 'ar' ? 'أسماء الأنبياء والصحابة والمعاني الحسنة' : language === 'en' ? 'Prophets, Sahabah and noble meanings' : 'انبیاء، صحابہ کرام اور با معنی نام'}
                  </div>
                </div>
                <span className="bg-[#B88A3B] text-white px-2 py-0.5 rounded text-[11px] font-semibold shrink-0">
                  {language === 'ar' ? 'الدليل' : language === 'en' ? 'Directory' : 'ڈائریکٹری'}
                </span>
              </div>

              <div 
                onClick={() => setCurrentTab('fatwa-names')}
                className="p-3 rounded-md bg-[#F8F6F0] dark:bg-slate-800 border border-stone-200 dark:border-slate-700 hover:border-[#B88A3B] transition-all cursor-pointer flex items-center justify-between gap-2 group"
              >
                <div className="min-w-0">
                  <div className="text-stone-900 dark:text-stone-100 font-bold text-sm leading-snug group-hover:text-[#B88A3B] transition-colors">
                    {language === 'ar' ? 'الأسماء الإسلامية المختارة (للإناث)' : language === 'en' ? 'Selected Islamic Names (Girls)' : 'منتخب اسلامی نام (لڑکیوں کے)'}
                  </div>
                  <div className="text-stone-600 dark:text-stone-400 font-normal text-xs mt-0.5">
                    {language === 'ar' ? 'أسماء الصحابيات والمؤمنات الصالحات' : language === 'en' ? 'Sahabiyat and pious women names' : 'صحابیات اور نیک خواتین کے نام'}
                  </div>
                </div>
                <span className="bg-[#B88A3B] text-white px-2 py-0.5 rounded text-[11px] font-semibold shrink-0">
                  {language === 'ar' ? 'الدليل' : language === 'en' ? 'Directory' : 'ڈائریکٹری'}
                </span>
              </div>
            </div>

            <button 
              onClick={() => setCurrentTab('fatwa-duas')}
              className="w-full py-2.5 rounded bg-[#5C4632] hover:bg-[#4A3727] text-white font-bold text-sm transition-colors cursor-pointer shadow-xs mt-2"
            >
              {language === 'ar' ? 'عرض الأدعية والأذكار ◀' : language === 'en' ? 'Explore Supplications & Azkar ◀' : 'دعائیں و اذکار دیکھیے ◀'}
            </button>
          </div>
        </motion.div>

      </div>

    </div>
  );
};
