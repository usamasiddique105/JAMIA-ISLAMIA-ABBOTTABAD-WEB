import React, { useState, useEffect } from 'react';
import { useThemeLanguage } from '../context/ThemeLanguageContext';
import { StorageService } from '../services/storage';
import { NewsItem } from '../types';
import { Bell, Calendar, Sparkles } from 'lucide-react';

export const NewsEventsView: React.FC = () => {
  const { language } = useThemeLanguage();
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
      title: "ختمِ بخاری شریف و سالانہ دستارِ فضیلت کانفرنس ۲۰۲۶ء",
      category: "تقریبات",
      date: "۱۵ شعبان ۱۴۴۸ھ",
      desc: "جامعہ اسلامیہ ایبٹ آباد میں سالانہ ختمِ بخاری شریف کی بابرکت تقریب منعقد ہوئی۔ ملک بھر کے ممتاز شیوخ الحدیث و اکابر علماء نے شرکت فرما کر طلبہ کی دستار بندی کی۔"
    },
    {
      id: "news-fallback-2",
      title: "شعبہ تحفیظ و تجوید میں نئے تعلیمی سال کے داخلے جاری",
      category: "داخلہ نوٹس",
      date: "۱۰ شعبان ۱۴۴۸ھ",
      desc: "جامعہ کے شعبہ تحفیظ القرآن اور تجوید للرجال و النساء میں نئے داخلے شروع ہو چکے ہیں۔ آن لائن رجسٹریشن اور تعارف فارم پورٹل پر دستیاب ہے۔"
    },
    {
      id: "news-fallback-3",
      title: "ماہنامہ 'الجامعہ' ایبٹ آباد کا جدید شمارہ شائع ہو گیا",
      category: "مطبوعات",
      date: "۰۵ شعبان ۱۴۴۸ھ",
      desc: "اکابرینِ دیوبند کے تحقیقی مضامین، جديد فتاویٰ اور دینی و سیاسی حالات پر مشتمل علمی مجلے کا تازہ شمارہ پی ڈی ایف ڈاؤن لوڈ کے لیے دستیاب ہے۔"
    }
  ];

  const fallbackAnnouncements = [
    {
      id: "ann-fallback-1",
      title: "امتحاناتِ سالانہ وفاق المدارس العربیہ کی تاریخ کا اعلان",
      category: "اعلانِ اہم",
      date: "۰۱ شعبان ۱۴۴۸ھ",
      desc: "تمام طلبہ کرام کو مطلع کیا جاتا ہے کہ امتحانی رول نمبر سلپ پورٹل سے ڈاؤن لوڈ کریں۔ بوگس سندات کی آن لائن تصدیق کی سہولت بھی میسر ہے۔"
    },
    {
      id: "ann-fallback-2",
      title: "عالمی آن لائن قرآن اکیڈمی برائے بیرونِ ملک مقیم مسلمان",
      category: "خدمات",
      date: "۲۵ رجب ۱۴۴۸ھ",
      desc: "امریکہ، برطانیہ، کینیڈا اور خلیجی ممالک کے مسلمان بھائیوں اور بچوں کے لیے زوم (Zoom) پر انفرادی تجوید و حفظ قرآن کلاسز۔"
    },
    {
      id: "ann-fallback-3",
      title: "تعطیلاتِ رمضان المبارک و دؤرہ تدریب المعلمین سیمینار",
      category: "نوٹس",
      date: "۲۰ رجب ۱۴۴۸ھ",
      desc: "اساتذہ کرام اور فضلاء کے لیے ۵ روزه خصوصي تربیتی ورکشاپ، مناہجِ تدریس اور جديد دور کے چیلنجز پر علمی نشستیں۔"
    }
  ];

  // Map dynamic news from storage
  const newsFromDb = storedNews.filter(n => n.category === 'News' || n.category === 'Event').map(n => ({
    id: n.id,
    title: n.title?.ur || n.title?.en || '',
    category: n.category === 'Event' ? 'تقریبات' : 'تازہ خبر',
    date: n.date,
    desc: n.content?.ur || n.content?.en || ''
  }));

  const announcementsFromDb = storedNews.filter(n => n.category === 'Announcement' || n.category === 'Admission').map(n => ({
    id: n.id,
    title: n.title?.ur || n.title?.en || '',
    category: n.category === 'Admission' ? 'داخلہ نوٹس' : 'اعلانِ اہم',
    date: n.date,
    desc: n.content?.ur || n.content?.en || ''
  }));

  const currentNewsList = newsFromDb.length > 0 ? newsFromDb : fallbackNews;
  const currentAnnouncementsList = announcementsFromDb.length > 0 ? announcementsFromDb : fallbackAnnouncements;

  return (
    <div className="max-w-7xl mx-auto space-y-8 font-urdu text-right" dir="rtl">
      
      {/* Banner */}
      <div className="bg-[#3D2914] text-[#F8F4EC] rounded-3xl p-6 sm:p-8 border-2 border-[#B88A3B] shadow-xl relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 pointer-events-none bg-[radial-gradient(#B88A3B_1px,transparent_1px)] [background-size:16px_16px]"></div>
        
        <div className="relative z-10 max-w-3xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#2A1A0C] text-[#B88A3B] text-xs font-bold border border-[#B88A3B]/40">
            <Bell className="w-4 h-4 stroke-[1.75]" />
            <span>خبریں، اعلانات و علمی تقریبات</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-black text-[#F8F4EC] leading-snug">
            خبریں، نوٹس بورڈ و اہم اعلانات پورٹل
          </h1>

          <p className="text-xs sm:text-sm text-stone-300 leading-relaxed max-w-2xl">
            جامعہ اسلامیہ ایبٹ آباد کے سالانہ داخلوں، امتحانی شیڈول، ختمِ بخاری شریف، مجلہ "الجامعہ" اور دیگر علمی سیمینارز سے متعلق تازہ ترین مستند معلومات۔
          </p>
        </div>
      </div>

      {/* Tab Navigation Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-stone-200 dark:border-slate-800 pb-4">
        <div className="flex items-center gap-2 text-[#5C4632] dark:text-amber-300 font-black text-xl">
          <Sparkles className="w-5 h-5 text-[#B88A3B] stroke-[1.75]" />
          <span>تازہ ترین علمی و انتظامی اعلانات</span>
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
            تازہ ترین خبریں
          </button>
          <button
            onClick={() => setActiveTab('announcements')}
            className={`px-4 py-2 rounded-xl transition-all cursor-pointer ${
              activeTab === 'announcements'
                ? 'bg-[#5C4632] text-[#F8F4EC] shadow-xs'
                : 'text-stone-700 dark:text-stone-300 hover:text-[#B88A3B]'
            }`}
          >
            جامعہ کے اعلانات
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
                  {item.category}
                </span>
                <span className="text-stone-500 flex items-center gap-1 font-sans text-xs">
                  <Calendar className="w-3.5 h-3.5 stroke-[1.75]" />
                  <span>{item.date}</span>
                </span>
              </div>

              <h2 className="text-base sm:text-lg font-black text-[#5C4632] dark:text-amber-300 leading-snug">
                {item.title}
              </h2>

              <p className="text-xs text-stone-600 dark:text-stone-300 leading-relaxed">
                {item.desc}
              </p>
            </div>

            <div className="pt-3 border-t border-stone-100 dark:border-slate-800 flex items-center justify-between">
              <span className="text-xs font-bold text-[#B88A3B] flex items-center gap-1 cursor-pointer hover:underline">
                <span>تفصیل</span>
                <span>⟨</span>
              </span>
              <span className="text-[10px] text-stone-400">جامعہ میڈیا سیل</span>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
};
