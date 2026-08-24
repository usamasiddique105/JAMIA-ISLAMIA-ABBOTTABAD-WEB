import React, { useState, useEffect } from 'react';
import { PublicationBook } from '../types';
import { StorageService } from '../services/storage';
import { useThemeLanguage } from '../context/ThemeLanguageContext';
import { getLocalizedText } from '../utils/translationHelper';
import headerLogoCalligraphy from '../assets/images/jamia_logo_calligraphy_transparent.png';
import { JAMIA_HEADER_LOGO_DATA_URI } from '../assets/logoBase64';
import { 
  BookOpen, 
  Download, 
  Search, 
  FileText, 
  BookMarked,
  Sparkles,
  ChevronLeft,
  GraduationCap,
  Landmark,
  ShieldCheck,
  Building2,
  Target,
  UserCheck
} from 'lucide-react';

interface LibraryViewProps {
  activeTabId?: string;
  onSelectTab?: (tabId: string) => void;
}

export const LibraryView: React.FC<LibraryViewProps> = ({ onSelectTab }) => {
  const { language } = useThemeLanguage();

  const [books, setBooks] = useState<PublicationBook[]>([]);
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(searchQuery);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  useEffect(() => {
    const loadBooks = () => setBooks(StorageService.getBooks());
    loadBooks();
    window.addEventListener('storage', loadBooks);
    window.addEventListener('jamia_db_updated', loadBooks);
    return () => {
      window.removeEventListener('storage', loadBooks);
      window.removeEventListener('jamia_db_updated', loadBooks);
    };
  }, []);

  const categories = [
    { id: 'all', labelUrdu: 'تمام کتب و مطبوعات', labelArabic: 'جميع الكتب والمطبوعات', labelEnglish: 'All Books' },
    { id: 'arabic', labelUrdu: 'عربی کتابیں', labelArabic: 'الكتب العربية', labelEnglish: 'Arabic Books' },
    { id: 'urdu', labelUrdu: 'اردو مطبوعات و فتاویٰ', labelArabic: 'المطبوعات والفتاوى بالأردية', labelEnglish: 'Urdu Publications' },
    { id: 'magazine', labelUrdu: 'ماہنامہ "الجامعہ"', labelArabic: 'مجلة "الجامعة"', labelEnglish: 'Monthly Magazine' },
  ];

  // Informational Links Sidebar (معلوماتی لنکس)
  const infoLinks = [
    { id: 'about-overview', labelUrdu: 'تعارفِ جامعہ', labelArabic: 'نبذة عن الجامعة', labelEnglish: 'About Jamia', tab: 'about-overview' },
    { id: 'about-founder', labelUrdu: 'حضرت بانی رحمہ اللہ', labelArabic: 'الشيخ المؤسس رحمه الله', labelEnglish: 'Founder', tab: 'about-founder' },
    { id: 'about-purpose', labelUrdu: 'جامعہ کے اغراض و مقاصد', labelArabic: 'أهداف الجامعة ورسالتها', labelEnglish: 'Objectives', tab: 'about-purpose' },
    { id: 'about-administration', labelUrdu: 'جامعہ کا نظم و نسق', labelArabic: 'الإدارة والهيكل التنظيمي', labelEnglish: 'Administration', tab: 'about-administration' },
    { id: 'departments', labelUrdu: 'جامعہ کا نظامِ تعلیم', labelArabic: 'نظام التعليم بالجامعة', labelEnglish: 'Education System', tab: 'departments' },
    { id: 'about-rules', labelUrdu: 'ضروری ہدایات اور قواعد و ضوابط', labelArabic: 'الضوابط والتعليمات', labelEnglish: 'Rules & Guidelines', tab: 'about-rules' },
    { id: 'library', labelUrdu: 'مطبوعہ کتب، رسائل و مقالات', labelArabic: 'الكتب والرسائل المطبوعة', labelEnglish: 'Publications & Articles', tab: 'library' },
    { id: 'about-departments', labelUrdu: 'جامعہ کی شاخیں و شعبہ جات', labelArabic: 'شعب وأقسام الجامعة', labelEnglish: 'Departments', tab: 'about-departments' },
    { id: 'about-expenses', labelUrdu: 'جامعہ کے مصارف', labelArabic: 'مصارف وأوقاف الجامعة', labelEnglish: 'Expenses & Funds', tab: 'about-expenses' },
  ];

  const filteredBooks = books.filter(b => {
    if (activeCategory === 'arabic') {
      const isArabic = b.category === 'Arabic Literature' || b.category === 'Hadith' || b.category === 'Tafseer';
      if (!isArabic) return false;
    } else if (activeCategory === 'magazine') {
      if (b.category !== 'Monthly Magazine') return false;
    }
    const q = debouncedQuery.toLowerCase().trim();
    if (!q) return true;
    return (
      b.title.ur.toLowerCase().includes(q) ||
      b.author.toLowerCase().includes(q) ||
      b.description.toLowerCase().includes(q)
    );
  });

  return (
    <div className="w-full max-w-7xl mx-auto py-2 sm:py-4 px-2 sm:px-4 font-urdu" dir={language === 'en' ? 'ltr' : 'rtl'}>
      
      {/* 1. TOP HEADER BANNER STRIP (عین سکرین شاٹ کے مطابق روایتی پٹی مع کتابیں عنوان اور جامعہ خطاطی) */}
      <div 
        className="w-full border-y-2 border-[#C9B9A2] dark:border-slate-800 px-4 sm:px-8 py-3 sm:py-3.5 mb-6 shadow-xs relative overflow-hidden flex flex-row items-center justify-between"
        style={{
          backgroundColor: '#F5EFE6',
          backgroundImage: `
            radial-gradient(circle at 50% 50%, rgba(255, 255, 255, 0.70) 0%, rgba(237, 227, 212, 0.90) 100%),
            url("data:image/svg+xml,%3Csvg width='52' height='52' viewBox='0 0 52 52' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23A37A3E' fill-opacity='0.10' fill-rule='evenodd'%3E%3Cpath d='M26 0l26 26-26 26L0 26 26 0zm0 6.5L6.5 26 26 45.5 45.5 26 26 6.5zM26 13l13 13-13 13-13-13 13-13zm0 4.5L17.5 26 26 34.5 34.5 26 26 17.5z'/%3E%3C/g%3E%3C/svg%3E")
          `,
          backgroundRepeat: 'repeat'
        }}
      >
        {/* Subtle decorative edge lines */}
        <div className="absolute inset-x-0 top-0 h-[1.5px] bg-gradient-to-r from-transparent via-[#B88A3B]/60 to-transparent"></div>
        <div className="absolute inset-x-0 bottom-0 h-[1.5px] bg-gradient-to-r from-transparent via-[#B88A3B]/60 to-transparent"></div>

        {/* Main Title on the right (دائیں جانب عنوان: کتابیں) */}
        <div className="flex items-center gap-3.5 relative z-10">
          <div className="w-2.5 sm:w-3 h-8 sm:h-9 bg-[#8C6239] rounded-xs shrink-0 shadow-xs"></div>
          <h1 className="text-2xl sm:text-3xl lg:text-[34px] font-black text-[#2B1B0E] dark:text-amber-100 tracking-wide font-urdu leading-tight">
            {language === 'ur' ? 'کتابیں' : language === 'ar' ? 'الكتب والمصنفات' : 'Books & Publications'}
          </h1>
        </div>

        {/* Institutional Calligraphy Logo on the left (بائیں جانب جامعہ کی خطاطی) */}
        <div className="shrink-0 relative z-10 flex items-center">
          <img 
            src={JAMIA_HEADER_LOGO_DATA_URI || headerLogoCalligraphy} 
            alt="الجامعة الإسلامية ايبت آباد" 
            className="h-9 sm:h-11 md:h-12 w-auto object-contain transition-all dark:brightness-0 dark:invert dark:opacity-90"
            onError={(e) => {
              const target = e.currentTarget;
              target.src = JAMIA_HEADER_LOGO_DATA_URI || '/jamia_logo_calligraphy_transparent.png';
            }}
          />
        </div>
      </div>

      {/* 2. MAIN 2-COLUMN LAYOUT (دائیں طرف سائیڈبار اور بائیں طرف کتب کی لسٹ عین سکرین شاٹ کے مطابق) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* RIGHT COLUMN (in RTL): SIDEBAR WIDGETS (مزید کتابیں اور معلوماتی لنکس) */}
        <aside className="order-2 lg:order-1 lg:col-span-4 xl:col-span-4 w-full space-y-5">
          
          {/* WIDGET 1: مزید کتابیں (More Books Categories) */}
          <div className="bg-[#FAF7F0] dark:bg-slate-900 border border-[#D5C7B2] dark:border-slate-800 rounded-xs shadow-xs overflow-hidden">
            <div 
              className="bg-[#3C2E21] text-white px-4 py-3 flex items-center gap-2.5 border-b-2 border-[#B88A3B]"
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg width='24' height='24' viewBox='0 0 24 24' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23B88A3B' fill-opacity='0.15'%3E%3Cpath d='M12 0l12 12-12 12L0 12 12 0zm0 3.5L3.5 12 12 20.5 20.5 12 12 3.5z'/%3E%3C/g%3E%3C/svg%3E")`
              }}
            >
              <FileText className="w-5 h-5 text-[#B88A3B]" />
              <h2 className="text-lg sm:text-xl font-bold font-urdu tracking-wide">
                {language === 'ur' ? 'مزید کتابیں' : language === 'ar' ? 'المزيد من الكتب' : 'More Books'}
              </h2>
            </div>

            <ul className="divide-y divide-[#EADFCF] dark:divide-slate-800/80">
              {categories.map((cat) => {
                const isActive = activeCategory === cat.id;
                return (
                  <li key={cat.id}>
                    <button
                      onClick={() => setActiveCategory(cat.id)}
                      className={`w-full text-right px-4 py-2.5 sm:py-3 flex items-center justify-between gap-3 transition-all cursor-pointer group ${
                        isActive 
                          ? 'bg-[#5C4632] text-white font-black shadow-inner border-r-4 border-[#B88A3B]' 
                          : 'text-[#361F0D] dark:text-stone-200 hover:bg-[#EFE8DA] dark:hover:bg-slate-800/60 font-semibold'
                      }`}
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <span className={`text-xs ${isActive ? 'text-[#B88A3B]' : 'text-[#8C6D37]'}`}>
                          ◈
                        </span>
                        <span className="text-base sm:text-lg font-urdu truncate">
                          {language === 'ur' ? cat.labelUrdu : language === 'ar' ? cat.labelArabic : cat.labelEnglish}
                        </span>
                      </div>
                      <ChevronLeft className={`w-4 h-4 shrink-0 transition-transform ${
                        isActive ? 'text-[#B88A3B] -translate-x-1' : 'text-stone-400 group-hover:text-stone-700 dark:group-hover:text-stone-300'
                      }`} />
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>

          {/* WIDGET 2: معلوماتی لنکس (Informational Links) */}
          <div className="bg-[#FAF7F0] dark:bg-slate-900 border border-[#D5C7B2] dark:border-slate-800 rounded-xs shadow-xs overflow-hidden">
            <div 
              className="bg-[#3C2E21] text-white px-4 py-3 flex items-center justify-between border-b-2 border-[#B88A3B]"
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg width='24' height='24' viewBox='0 0 24 24' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23B88A3B' fill-opacity='0.15'%3E%3Cpath d='M12 0l12 12-12 12L0 12 12 0zm0 3.5L3.5 12 12 20.5 20.5 12 12 3.5z'/%3E%3C/g%3E%3C/svg%3E")`
              }}
            >
              <div className="flex items-center gap-2.5">
                <FileText className="w-5 h-5 text-[#B88A3B]" />
                <h2 className="text-lg sm:text-xl font-bold font-urdu tracking-wide">
                  {language === 'ur' ? 'معلوماتی لنکس' : language === 'ar' ? 'روابط معلوماتية' : 'Informational Links'}
                </h2>
              </div>
              <span className="text-[#B88A3B] text-xs px-2 py-0.5 bg-black/25 rounded-xs font-mono">
                {infoLinks.length}
              </span>
            </div>

            <ul className="divide-y divide-[#EADFCF] dark:divide-slate-800/80">
              {infoLinks.map((link) => (
                <li key={link.id}>
                  <button
                    onClick={() => onSelectTab && onSelectTab(link.tab)}
                    className="w-full text-right px-4 py-2.5 sm:py-3 flex items-center justify-between gap-3 text-[#361F0D] dark:text-stone-200 hover:bg-[#EFE8DA] dark:hover:bg-slate-800/60 font-semibold transition-all cursor-pointer group"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <span className="text-xs text-[#8C6D37]">◈</span>
                      <span className="text-base sm:text-lg font-urdu truncate">
                        {language === 'ur' ? link.labelUrdu : language === 'ar' ? link.labelArabic : link.labelEnglish}
                      </span>
                    </div>
                    <ChevronLeft className="w-4 h-4 shrink-0 text-stone-400 group-hover:text-stone-700 dark:group-hover:text-stone-300 transition-transform group-hover:-translate-x-1" />
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* WIDGET 3: Search Box (عین اسی ڈیزائن میں) */}
          <div className="bg-[#FAF7F0] dark:bg-slate-900 border border-[#D5C7B2] dark:border-slate-800 rounded-xs shadow-xs overflow-hidden">
            <div 
              className="bg-[#3C2E21] text-white px-4 py-3 flex items-center gap-2.5 border-b-2 border-[#B88A3B]"
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg width='24' height='24' viewBox='0 0 24 24' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23B88A3B' fill-opacity='0.15'%3E%3Cpath d='M12 0l12 12-12 12L0 12 12 0zm0 3.5L3.5 12 12 20.5 20.5 12 12 3.5z'/%3E%3C/g%3E%3C/svg%3E")`
              }}
            >
              <Search className="w-5 h-5 text-[#B88A3B]" />
              <h2 className="text-lg sm:text-xl font-bold font-urdu tracking-wide">
                {language === 'ur' ? 'کتاب تلاش کریں' : language === 'ar' ? 'بحث في الكتب' : 'Search Book'}
              </h2>
            </div>
            <div className="p-4 space-y-3">
              <div className="relative">
                <input 
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={language === 'ur' ? 'عنوان یا مصنف کا نام لکھیں...' : language === 'ar' ? 'اكتب اسم الكتاب أو المؤلف...' : 'Enter book title or author...'}
                  className="w-full pr-4 pl-9 py-2.5 text-sm bg-white dark:bg-slate-800 border border-[#D2C2A7] dark:border-slate-700 rounded-xs focus:outline-none focus:border-[#B88A3B] text-right font-urdu text-stone-900 dark:text-stone-100 placeholder-stone-400"
                />
                <Search className="w-4 h-4 text-[#B88A3B] absolute left-3 top-3.5" />
              </div>
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="w-full py-1.5 text-xs text-stone-600 hover:text-stone-900 dark:text-stone-400 dark:hover:text-stone-200 underline font-urdu"
                >
                  {language === 'ur' ? 'تلاش ختم کریں' : 'مسح البحث'}
                </button>
              )}
            </div>
          </div>

        </aside>

        {/* LEFT COLUMN (in RTL): BOOKS LIST CARDS (عین سکرین شاٹ کے مطابق ہوریزونٹل مستطیل کارڈ مع کور امیج دائیں جانب اور بٹن بائیں جانب) */}
        <main className="order-1 lg:order-2 lg:col-span-8 xl:col-span-8 w-full space-y-5">
          
          {books.length === 0 ? (
            /* EMPTY STATE: جب ابھی کوئی کتاب اپلوڈ نہ ہوئی ہو */
            <div 
              className="p-8 sm:p-12 text-center rounded-xs border-2 border-dashed border-[#D5C7B2] dark:border-slate-800 space-y-4"
              style={{
                backgroundColor: '#FAF7F0',
                backgroundImage: `url("data:image/svg+xml,%3Csvg width='52' height='52' viewBox='0 0 52 52' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23A37A3E' fill-opacity='0.05'%3E%3Cpath d='M26 0l26 26-26 26L0 26 26 0zm0 6.5L6.5 26 26 45.5 45.5 26 26 6.5z'/%3E%3C/g%3E%3C/svg%3E")`
              }}
            >
              <div className="w-16 h-16 bg-[#F0E6D2] dark:bg-slate-800 text-[#5C4632] dark:text-amber-300 rounded-full flex items-center justify-center mx-auto border border-[#B88A3B]">
                <BookOpen className="w-8 h-8" />
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-[#3C2E21] dark:text-amber-100 font-urdu leading-relaxed">
                فی الحال کوئی کتاب، رسالہ یا مطبوعہ شائع نہیں کیا گیا
              </h3>
              <p className="text-sm sm:text-base text-stone-600 dark:text-stone-300 max-w-lg mx-auto font-urdu leading-relaxed">
                جامعہ کی تصانیف، کتب اور رسائل ایڈمن پینل سے اپلوڈ ہونے کے بعد بالکل اوپر دی گئی سکرین شاٹ کی ترتیب اور خوبصورت ڈیزائن کے مطابق یہاں خودکار طریقے سے ظاہر ہوں گی۔
              </p>
            </div>
          ) : filteredBooks.length === 0 ? (
            <div className="p-8 text-center bg-[#FAF7F0] dark:bg-slate-900 rounded-xs border border-[#D5C7B2] dark:border-slate-800 font-urdu text-stone-600">
              تلاش کے مطابق کوئی کتاب یا رسالہ نہیں ملا۔
            </div>
          ) : (
            /* POPULATED STATE: جب کتابیں اپلوڈ ہوں تو عین سکرین شاٹ والی خوبصورت ڈیزائن اور ترتیب */
            <div className="space-y-5">
              {filteredBooks.map((book) => (
                <div 
                  key={book.id}
                  className="rounded-xs border border-[#D5C7B2] dark:border-slate-800 shadow-xs hover:shadow-md transition-all overflow-hidden p-4 sm:p-5 flex flex-col justify-between"
                  style={{
                    backgroundColor: '#FAF7F0',
                    backgroundImage: `
                      radial-gradient(circle at 50% 50%, rgba(255, 255, 255, 0.70) 0%, rgba(250, 247, 240, 0.95) 100%),
                      url("data:image/svg+xml,%3Csvg width='52' height='52' viewBox='0 0 52 52' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23A37A3E' fill-opacity='0.08'%3E%3Cpath d='M26 0l26 26-26 26L0 26 26 0zm0 6.5L6.5 26 26 45.5 45.5 26 26 6.5zM26 13l13 13-13 13-13-13 13-13zm0 4.5L17.5 26 26 34.5 34.5 26 26 17.5z'/%3E%3C/g%3E%3C/svg%3E")
                    `
                  }}
                >
                  {/* Top Content: Text on left and Cover on right (in RTL) */}
                  <div className="flex flex-col-reverse sm:flex-row items-start justify-between gap-4">
                    
                    {/* Text Details */}
                    <div className="flex-1 space-y-2 text-right">
                      <h3 className="text-base sm:text-lg lg:text-xl font-bold text-[#2B1B0E] dark:text-amber-100 font-urdu leading-relaxed">
                        {getLocalizedText(book.title, language)}
                        {book.author && (
                          <span className="text-sm font-normal text-stone-600 dark:text-stone-300 mr-1.5">
                            : {getLocalizedText(book.description, language) || `جامعہ کے شیوخ کی تصنیف کردہ مبارک کتاب۔`}
                          </span>
                        )}
                      </h3>
                      {!book.author && book.description && (
                        <p className="text-sm sm:text-base text-stone-700 dark:text-stone-300 font-urdu leading-relaxed">
                          {getLocalizedText(book.description, language)}
                        </p>
                      )}
                    </div>

                    {/* Book Cover Image (دائیں طرف کتاب کا ٹائٹل کور) */}
                    {book.coverImage && (
                      <div className="shrink-0 self-center sm:self-start">
                        <img 
                          src={book.coverImage} 
                          alt={getLocalizedText(book.title, language)} 
                          className="w-24 sm:w-28 md:w-32 h-auto max-h-44 object-cover rounded-xs border border-[#C9B9A2] shadow-xs bg-white"
                          loading="lazy"
                        />
                      </div>
                    )}
                  </div>

                  {/* Bottom Bar: Download Button on Left (in RTL) */}
                  <div className="mt-4 pt-3 border-t border-[#EADFCF] dark:border-slate-800/80 flex items-center justify-between">
                    <span className="text-xs text-stone-500 font-mono">
                      {book.fileSize ? `${book.fileSize}` : ''} {book.publishYear ? `• ${book.publishYear}` : ''}
                    </span>

                    <a
                      href={book.fileUrl || '#'}
                      onClick={(e) => {
                        if (!book.fileUrl || book.fileUrl === '#') {
                          e.preventDefault();
                          alert('ڈاؤن لوڈ لنک فی الحال دستیاب نہیں ہے۔');
                        }
                      }}
                      className="px-4 py-1.5 bg-[#3C2E21] hover:bg-[#5C4632] text-white text-xs sm:text-sm font-bold rounded-xs transition-colors flex items-center gap-2 cursor-pointer font-urdu shadow-xs"
                    >
                      <Download className="w-3.5 h-3.5 text-[#B88A3B]" />
                      <span>ڈاؤن لوڈ</span>
                    </a>
                  </div>

                </div>
              ))}
            </div>
          )}

        </main>

      </div>

    </div>
  );
};

