import React, { useState, useEffect } from 'react';
import { useThemeLanguage } from '../context/ThemeLanguageContext';
import { StorageService } from '../services/storage';
import { NewsItem } from '../types';
import { getLocalizedText } from '../utils/translationHelper';
import { Bell, Calendar, Sparkles } from 'lucide-react';

export const NewsEventsView: React.FC = () => {
  const { language, dir, t } = useThemeLanguage();
  const [activeTab, setActiveTab] = useState<'news' | 'announcements'>('news');
  const [storedNews, setStoredNews] = useState<NewsItem[]>([]);

  useEffect(() => {
    const loadNews = () => setStoredNews(StorageService.getNews());
    loadNews();
    window.addEventListener('storage', loadNews);
    window.addEventListener('jamia_db_updated', loadNews);
    return () => {
      window.removeEventListener('storage', loadNews);
      window.removeEventListener('jamia_db_updated', loadNews);
    };
  }, []);

  const fallbackNews = [
    {
      id: "news-fallback-1",
      title: {
        ur: "ختمِ بخاری شریف و سالانہ دستارِ فضیلت کانفرنس ۲۰۲۶ء",
        en: "Annual Khatm-e-Bukhari & Graduation Convocation 2026",
        ar: "حفل ختم صحيح البخاري الشريف وتكريم الخريجين لعام ۲۰۲۶م"
      },
      category: {
        ur: "تقریبات",
        en: "Events",
        ar: "الفعاليات"
      },
      date: "۱۵ شعبان ۱۴۴۸ھ",
      desc: {
        ur: "جامعہ اسلامیہ ایبٹ آباد میں سالانہ ختمِ بخاری شریف کی بابرکت تقریب منعقد ہوئی۔ ملک بھر کے ممتاز شیوخ الحدیث و اکابر علماء نے شرکت فرما کر طلبہ کی دستار بندی کی۔",
        en: "The blessed annual Khatm-e-Bukhari ceremony was held at Jamia Islamia Abbottabad, attended by eminent scholars and Shuyookh from across the country.",
        ar: "أقيمت في رحاب الجامعة الإسلامية أبت أباد المناسبة السنوية لختم صحيح البخاري وتتويج الخريجين بحضور كبار العلماء والشيوخ."
      }
    },
    {
      id: "news-fallback-2",
      title: {
        ur: "شعبہ تحفیظ و تجوید میں نئے تعلیمی سال کے داخلے جاری",
        en: "Admissions Open for Quran Memorization & Tajweed Department",
        ar: "بدء التسجيل والقبول في قسم تحفيظ القرآن الكريم والتجويد"
      },
      category: {
        ur: "داخلہ نوٹس",
        en: "Admissions",
        ar: "القبول والتسجيل"
      },
      date: "۱۰ شعبان ۱۴۴۸ھ",
      desc: {
        ur: "جامعہ کے شعبہ تحفیظ القرآن اور تجوید للرجال و النساء میں نئے داخلے شروع ہو چکے ہیں۔ آن لائن رجسٹریشن اور تعارف فارم پورٹل پر دستیاب ہے۔",
        en: "New admissions for Quran memorization and Tajweed for boys and girls have begun. Online forms are available on the portal.",
        ar: "تم فتح باب القبول في شعبة تحفيظ القرآن والتجويد للعام الدراسي الجديد، والتسجيل متاح عبر البوابة الإلكترونية."
      }
    },
    {
      id: "news-fallback-3",
      title: {
        ur: "ماہنامہ 'الجامعہ' ایبٹ آباد کا جدید شمارہ شائع ہو گیا",
        en: "New Edition of Monthly Journal 'Al-Jamia' Published",
        ar: "صدور العدد الجديد من المجلة الشهرية 'الجامعة'"
      },
      category: {
        ur: "مطبوعات",
        en: "Publications",
        ar: "المطبوعات"
      },
      date: "۰۵ شعبان ۱۴۴۸ھ",
      desc: {
        ur: "اکابرینِ دیوبند کے تحقیقی مضامین، جديد فتاویٰ اور دینی و سیاسی حالات پر مشتمل علمی مجلے کا تازہ شمارہ پی ڈی ایف ڈاؤن لوڈ کے لیے دستیاب ہے۔",
        en: "The latest issue featuring research articles, fatwas, and scholarly analyses is now available for digital PDF download.",
        ar: "صدر العدد الجديد من المجلة العلمية المشتملة على بحوث أكابر العلماء والفتاوى الشرعية بصيغة PDF."
      }
    }
  ];

  const fallbackAnnouncements = [
    {
      id: "ann-fallback-1",
      title: {
        ur: "امتحاناتِ سالانہ وفاق المدارس العربیہ کی تاریخ کا اعلان",
        en: "Announcement of Wifaqul Madaris Annual Examination Schedule",
        ar: "إعلان موعد الاختبارات السنوية لوفاق المدارس العربية"
      },
      category: {
        ur: "اعلانِ اہم",
        en: "Important Notice",
        ar: "إعلان هام"
      },
      date: "۰۱ شعبان ۱۴۴۸ھ",
      desc: {
        ur: "تمام طلبہ کرام کو مطلع کیا جاتا ہے کہ امتحانی رول نمبر سلپ پورٹل سے ڈاؤن لوڈ کریں۔ بوگس سندات کی آن لائن تصدیق کی سہولت بھی میسر ہے۔",
        en: "All students are informed to download their examination roll number slips from the portal. Online verification of certificates is available.",
        ar: "نهيب بجميع الطلاب والطالبات مراجعة البوابة لتحميل بطاقات الجلوس ومتابعة جدول الامتحانات السنوية."
      }
    },
    {
      id: "ann-fallback-2",
      title: {
        ur: "عالمی آن لائن قرآن اکیڈمی برائے بیرونِ ملک مقیم مسلمان",
        en: "Global Online Quran Academy for Overseas Muslims",
        ar: "أكاديمية القرآن الكريم العالمية عبر الإنترنت للمغتربين"
      },
      category: {
        ur: "خدمات",
        en: "Services",
        ar: "الخدمات"
      },
      date: "۲۵ رجب ۱۴۴۸ھ",
      desc: {
        ur: "امریکہ، برطانیہ، کینیڈا اور خلیجی ممالک کے مسلمان بھائیوں اور بچوں کے لیے زوم (Zoom) پر انفرادی تجوید و حفظ قرآن کلاسز۔",
        en: "One-on-one live Quran and Tajweed classes via Zoom for overseas Muslims in USA, UK, Canada, and Gulf countries.",
        ar: "فصول فردية لتعليم القرآن الكريم والتجويد عبر برنامج زوم للمسلمين في دول المهجر والخليج العربي."
      }
    },
    {
      id: "ann-fallback-3",
      title: {
        ur: "تعطیلاتِ رمضان المبارک و دؤرہ تدریب المعلمین سیمینار",
        en: "Ramadan Holidays & Teacher Training Seminar",
        ar: "عطلة شهر رمضان المبارك ودورة تدريب المعلمين والأساتذة"
      },
      category: {
        ur: "نوٹس",
        en: "Notice",
        ar: "تنويه"
      },
      date: "۲۰ رجب ۱۴۴۸ھ",
      desc: {
        ur: "اساتذہ کرام اور فضلاء کے لیے ۵ روزه خصوصي تربیتی ورکشاپ، مناہجِ تدریس اور جديد دور کے چیلنجز پر علمی نشستیں۔",
        en: "A 5-day special pedagogical workshop and training seminar for Islamic teachers and scholars addressing modern challenges.",
        ar: "ورشة تدريبية مكثفة لمدة خمسة أيام للأساتذة والمعلمين لتطوير المهارات التدريسية والمناهج التعليمية."
      }
    }
  ];

  // Map dynamic news from storage
  const newsFromDb = storedNews.filter(n => n.category === 'News' || n.category === 'Event').map(n => ({
    id: n.id,
    title: n.title,
    category: {
      ur: n.category === 'Event' ? 'تقریبات' : 'تازہ خبر',
      en: n.category === 'Event' ? 'Events' : 'Latest News',
      ar: n.category === 'Event' ? 'الفعاليات' : 'أخبار'
    },
    date: n.date,
    desc: n.content
  }));

  const announcementsFromDb = storedNews.filter(n => n.category === 'Announcement' || n.category === 'Admission').map(n => ({
    id: n.id,
    title: n.title,
    category: {
      ur: n.category === 'Admission' ? 'داخلہ نوٹس' : 'اعلانِ اہم',
      en: n.category === 'Admission' ? 'Admissions' : 'Announcement',
      ar: n.category === 'Admission' ? 'القبول' : 'إعلان هام'
    },
    date: n.date,
    desc: n.content
  }));

  const currentNewsList = newsFromDb.length > 0 ? newsFromDb : fallbackNews;
  const currentAnnouncementsList = announcementsFromDb.length > 0 ? announcementsFromDb : fallbackAnnouncements;

  const isUr = language === 'ur';
  const isAr = language === 'ar';
  const fontClass = isAr ? 'font-arabic' : isUr ? 'font-urdu' : 'font-sans';

  return (
    <div className={`max-w-7xl mx-auto space-y-8 ${fontClass}`} dir={dir}>
      
      {/* Banner */}
      <div className="bg-[#3D2914] text-[#F8F4EC] rounded-3xl p-6 sm:p-8 border-2 border-[#B88A3B] shadow-xl relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 pointer-events-none bg-[radial-gradient(#B88A3B_1px,transparent_1px)] [background-size:16px_16px]"></div>
        
        <div className="relative z-10 max-w-3xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#2A1A0C] text-[#B88A3B] text-xs font-bold border border-[#B88A3B]/40">
            <Bell className="w-4 h-4 stroke-[1.75]" />
            <span>{isAr ? 'الأخبار والإعلانات والفعاليات العلمية' : isUr ? 'خبریں، اعلانات و علمی تقریبات' : 'News, Announcements & Events'}</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-black text-[#F8F4EC] leading-snug">
            {isAr ? 'بوابة الأخبار واللوحة الإعلانية للجامعة' : isUr ? 'خبریں، نوٹس بورڈ و اہم اعلانات پورٹل' : 'News, Notice Board & Official Updates Portal'}
          </h1>

          <p className="text-xs sm:text-sm text-stone-300 leading-relaxed max-w-2xl">
            {isAr ? 'أحدث المعلومات المعتمدة حول القبول السنوي، جدول الاختبارات، حفل ختم البخاري، ومجلة الجامعة.' : isUr ? 'جامعہ اسلامیہ ایبٹ آباد کے سالانہ داخلوں، امتحانی شیڈول، ختمِ بخاری شریف، مجلہ "الجامعہ" اور دیگر علمی سیمینارز سے متعلق تازہ ترین مستند معلومات۔' : 'Latest authentic updates regarding annual admissions, exam schedules, Khatm-e-Bukhari ceremonies, and scholarly publications of Jamia Islamia Abbottabad.'}
          </p>
        </div>
      </div>

      {/* Tab Navigation Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-stone-200 dark:border-slate-800 pb-4">
        <div className="flex items-center gap-2 text-[#5C4632] dark:text-amber-300 font-black text-xl">
          <Sparkles className="w-5 h-5 text-[#B88A3B] stroke-[1.75]" />
          <span>{isAr ? 'أحدث الإعلانات العلمية والإدارية' : isUr ? 'تازہ ترین علمی و انتظامی اعلانات' : 'Latest Scholarly & Institutional Updates'}</span>
        </div>

        <div className="flex items-center gap-2 bg-[#F8F4EC] dark:bg-slate-800 p-1.5 rounded-2xl border border-[#B88A3B]/30 text-xs font-bold">
          <button
            onClick={() => setActiveTab('news')}
            className={`px-4 py-2 rounded-xl transition-all cursor-pointer ${
              activeTab === 'news'
                ? 'bg-[#5C4632] text-[#F8F4EC] shadow-xs'
                : 'text-stone-700 dark:text-stone-300 hover:text-[#B88A3B]'
            }`}
          >
            {isAr ? 'آخر الأخبار' : isUr ? 'تازہ ترین خبریں' : 'Latest News'}
          </button>
          <button
            onClick={() => setActiveTab('announcements')}
            className={`px-4 py-2 rounded-xl transition-all cursor-pointer ${
              activeTab === 'announcements'
                ? 'bg-[#5C4632] text-[#F8F4EC] shadow-xs'
                : 'text-stone-700 dark:text-stone-300 hover:text-[#B88A3B]'
            }`}
          >
            {isAr ? 'إعلانات الجامعة' : isUr ? 'جامعہ کے اعلانات' : 'Announcements'}
          </button>
        </div>
      </div>

      {/* 3-Column News/Announcements Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {(activeTab === 'news' ? currentNewsList : currentAnnouncementsList).map(item => (
          <div 
            key={item.id}
            className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-stone-200 dark:border-slate-800 shadow-xs hover:shadow-md hover:border-[#B88A3B]/40 transition-all flex flex-col justify-between space-y-4"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="bg-[#F8F4EC] dark:bg-slate-800 text-[#5C4632] dark:text-amber-300 font-bold px-3 py-0.5 rounded-full border border-[#B88A3B]/20">
                  {typeof item.category === 'object' ? getLocalizedText(item.category, language) : item.category}
                </span>
                <span className="text-stone-500 flex items-center gap-1 font-sans text-xs">
                  <Calendar className="w-3.5 h-3.5 stroke-[1.75]" />
                  <span>{item.date}</span>
                </span>
              </div>

              <h2 className="text-base sm:text-lg font-black text-[#5C4632] dark:text-amber-300 leading-snug">
                {getLocalizedText(item.title, language)}
              </h2>

              <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-300 leading-relaxed">
                {getLocalizedText(item.desc, language)}
              </p>
            </div>

            <div className="pt-3 border-t border-stone-100 dark:border-slate-800 flex items-center justify-between">
              <span className="text-xs font-bold text-[#B88A3B] flex items-center gap-1 cursor-pointer hover:underline">
                <span>{isAr ? 'التفاصيل' : isUr ? 'تفصیل' : 'Details'}</span>
                <span>{dir === 'rtl' ? '⟨' : '⟩'}</span>
              </span>
              <span className="text-[10px] text-stone-400">
                {isAr ? 'المركز الإعلامي' : isUr ? 'جامعہ میڈیا سیل' : 'Media Office'}
              </span>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
};
