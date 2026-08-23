import React, { useState, useMemo } from 'react';
import { MASNOON_DUAS_DATA, MasnoonDuaItem } from '../data/masnoonDuasData';
import { Search, Sparkles, Copy, Check, BookOpen, Heart, Repeat, Share2, Volume2, ShieldCheck } from 'lucide-react';
import { useThemeLanguage } from '../context/ThemeLanguageContext';
import { getLanguageFontClass, getLocalizedText } from '../utils/translationHelper';

interface MasnoonDuasViewProps {
  onOpenFatwaModal?: () => void;
}

export const MasnoonDuasView: React.FC<MasnoonDuasViewProps> = ({ onOpenFatwaModal }) => {
  const { language, t } = useThemeLanguage();
  const fontClass = getLanguageFontClass(language);
  const headingFontClass = getLanguageFontClass(language, true);

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [counters, setCounters] = useState<Record<string, number>>({});

  const handleIncrementCounter = (id: string, maxCount = 1) => {
    setCounters(prev => {
      const current = prev[id] || 0;
      const next = current + 1;
      return { ...prev, [id]: next > maxCount ? 0 : next };
    });
  };

  const handleCopyDua = (item: MasnoonDuaItem) => {
    const title = getLocalizedText(item.titleUrdu, language);
    const trans = getLocalizedText(item.urduTranslation, language);
    const inst = language === 'ar' ? 'دار الإفتاء بالجامعة الإسلامية أبت أباد' : language === 'en' ? 'Darul Ifta Jamia Islamia Abbottabad' : 'دار الافتاء جامعہ اسلامیہ ایبٹ آباد';
    const text = `${title}\n\n${item.arabicText}\n\n${language === 'ar' ? 'الترجمة:' : language === 'en' ? 'Translation:' : 'ترجمہ:'} ${trans}\n\n${language === 'ar' ? 'المصدر:' : language === 'en' ? 'Source:' : 'حوالہ:'} ${item.reference}\n(${inst})`;
    navigator.clipboard.writeText(text);
    setCopiedId(item.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const filteredDuas = useMemo(() => {
    return MASNOON_DUAS_DATA.filter((item) => {
      // Category filter
      if (selectedCategory !== 'all' && item.category !== selectedCategory) {
        return false;
      }
      // Search term
      if (searchTerm.trim()) {
        const term = searchTerm.toLowerCase().trim();
        const matchTitle = item.titleUrdu.toLowerCase().includes(term);
        const matchArabic = item.arabicText.toLowerCase().includes(term);
        const matchUrdu = item.urduTranslation.toLowerCase().includes(term);
        const matchRef = item.reference.toLowerCase().includes(term);
        const matchBenefit = item.benefit ? item.benefit.toLowerCase().includes(term) : false;
        if (!matchTitle && !matchArabic && !matchUrdu && !matchRef && !matchBenefit) {
          return false;
        }
      }
      return true;
    });
  }, [searchTerm, selectedCategory]);

  return (
    <div className={`w-full space-y-6 ${fontClass}`} dir={language === 'en' ? 'ltr' : 'rtl'}>
      {/* Introduction Banner */}
      <div className="bg-gradient-to-r from-[#FAF6EE] to-[#F5EFE0] dark:from-slate-900 dark:to-slate-800 border border-[#D9CBB6] dark:border-slate-800 rounded-xl p-5 sm:p-7 shadow-xs">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className={`space-y-2 text-center ${language === 'en' ? 'md:text-left' : 'md:text-right'}`}>
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#5C4632] text-amber-100 rounded-full text-xs font-bold font-sans">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>
                {language === 'ar'
                  ? 'حصن المسلم • أدعية وأذكار اليوم والليلة'
                  : language === 'en'
                  ? 'Fortress of the Believer • Daily Invocations & Adhkar'
                  : 'حصن المسلم • روزمرہ کی مسنون دعائیں و اذکار'}
              </span>
            </div>
            <h2 className={`text-2xl sm:text-3xl font-black text-[#5C4632] dark:text-[#E0B266] ${headingFontClass}`}>
              {language === 'ar'
                ? 'الأدعية المأثورة والمسنونة الصحيحة مع التخريج والترجمة'
                : language === 'en'
                ? 'Authentic Masnoon Duas with Translation & Hadith Sources'
                : 'مستند مسنون و معروف دعائیں مع سلیس ترجمہ و حوالہ'}
            </h2>
            <p className="text-stone-700 dark:text-stone-300 text-sm sm:text-base leading-relaxed max-w-3xl">
              {language === 'ar'
                ? 'قال رسول الله ﷺ: «الدُّعَاءُ هُوَ الْعِبَادَةُ» (رواه الترمذي وقال: حديث حسن صحيح).'
                : language === 'en'
                ? 'The Messenger of Allah (ﷺ) said: "Supplication (Dua) is the essence of worship." (Jami at-Tirmidhi)'
                : 'اللہ کے رسول ﷺ کا ارشادِ گرامی ہے: «الدُّعَاءُ هُوَ الْعِبَادَةُ» (دعا ہی اصل عبادت ہے)۔ اور ایک حدیث میں فرمایا: «الدُّعَاءُ مُخُّ الْعِبَادَةِ» (دعا عبادت کا مغز ہے)۔'}
            </p>
          </div>

          <div className="shrink-0 flex items-center gap-2">
            <span className="text-xs bg-[#5C4632]/10 dark:bg-amber-950/40 text-[#5C4632] dark:text-amber-200 border border-[#5C4632]/20 px-3 py-1.5 rounded-lg font-bold">
              {language === 'ar' ? `عدد الأدعية: ${MASNOON_DUAS_DATA.length}` : language === 'en' ? `Total Duas: ${MASNOON_DUAS_DATA.length}` : `تعداد دعائیں: ${MASNOON_DUAS_DATA.length}`}
            </span>
          </div>
        </div>
      </div>

      {/* Filter Tabs & Search */}
      <div className="bg-white dark:bg-slate-900 border border-[#D9CBB6] dark:border-slate-800 rounded-xl p-4 sm:p-6 space-y-4 shadow-xs">
        <div className="relative">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder={
              language === 'ar'
                ? 'ابحث باسم الدعاء، الكلمات، أو الفضيلة (سفر، طعام، نوم، استغفار)...'
                : language === 'en'
                ? 'Search by dua title, keywords, or benefit (travel, food, sleep, forgiveness)...'
                : 'دعا کا عنوان، عربی الفاظ، ترجمہ یا فضیلت سے تلاش کریں (مثلاً: سفر، کھانا، بستر، استغفار، صبح)...'
            }
            className={`w-full ${language === 'en' ? 'pl-10 pr-4' : 'pr-10 pl-4'} py-2.5 text-sm sm:text-base bg-[#FCFAF6] dark:bg-slate-800 border border-[#D2C2A7] dark:border-slate-700 rounded-lg text-stone-900 dark:text-stone-100 placeholder-stone-400 focus:outline-none focus:border-[#5C4632] ${fontClass}`}
          />
          <Search className={`w-5 h-5 text-stone-400 absolute ${language === 'en' ? 'left-3' : 'right-3'} top-1/2 -translate-y-1/2`} />
        </div>

        {/* Category Selector Chips */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs sm:text-sm">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-3.5 py-2 rounded-lg font-bold shrink-0 transition-colors cursor-pointer ${
              selectedCategory === 'all'
                ? 'bg-[#5C4632] text-amber-100 shadow-xs'
                : 'bg-stone-100 dark:bg-slate-800 text-stone-700 dark:text-stone-300 hover:bg-stone-200'
            }`}
          >
            {language === 'ar' ? `جميع الأدعية (${MASNOON_DUAS_DATA.length})` : language === 'en' ? `All Duas (${MASNOON_DUAS_DATA.length})` : `تمام دعائیں (${MASNOON_DUAS_DATA.length})`}
          </button>
          <button
            onClick={() => setSelectedCategory('daily')}
            className={`px-3.5 py-2 rounded-lg font-bold shrink-0 transition-colors cursor-pointer ${
              selectedCategory === 'daily'
                ? 'bg-[#5C4632] text-amber-100 shadow-xs'
                : 'bg-stone-100 dark:bg-slate-800 text-stone-700 dark:text-stone-300 hover:bg-stone-200'
            }`}
          >
            {language === 'ar' ? 'أدعية اليوم والليلة' : language === 'en' ? 'Daily Duas' : 'روزمرہ کی دعائیں'}
          </button>
          <button
            onClick={() => setSelectedCategory('morning_evening')}
            className={`px-3.5 py-2 rounded-lg font-bold shrink-0 transition-colors cursor-pointer ${
              selectedCategory === 'morning_evening'
                ? 'bg-[#5C4632] text-amber-100 shadow-xs'
                : 'bg-stone-100 dark:bg-slate-800 text-stone-700 dark:text-stone-300 hover:bg-stone-200'
            }`}
          >
            {language === 'ar' ? 'أذكار الصباح والمساء' : language === 'en' ? 'Morning & Evening' : 'صبح و شام کے اذکار'}
          </button>
          <button
            onClick={() => setSelectedCategory('protection')}
            className={`px-3.5 py-2 rounded-lg font-bold shrink-0 transition-colors cursor-pointer ${
              selectedCategory === 'protection'
                ? 'bg-[#5C4632] text-amber-100 shadow-xs'
                : 'bg-stone-100 dark:bg-slate-800 text-stone-700 dark:text-stone-300 hover:bg-stone-200'
            }`}
          >
            {language === 'ar' ? 'أدعية الحفظ والتحصين' : language === 'en' ? 'Protection & Refuge' : 'حفاظت و پناہ کی دعائیں'}
          </button>
          <button
            onClick={() => setSelectedCategory('prayer')}
            className={`px-3.5 py-2 rounded-lg font-bold shrink-0 transition-colors cursor-pointer ${
              selectedCategory === 'prayer'
                ? 'bg-[#5C4632] text-amber-100 shadow-xs'
                : 'bg-stone-100 dark:bg-slate-800 text-stone-700 dark:text-stone-300 hover:bg-stone-200'
            }`}
          >
            {language === 'ar' ? 'أذكار المسجد والصلاة' : language === 'en' ? 'Mosque & Salah' : 'مسجد و نماز کے اذکار'}
          </button>
          <button
            onClick={() => setSelectedCategory('travel')}
            className={`px-3.5 py-2 rounded-lg font-bold shrink-0 transition-colors cursor-pointer ${
              selectedCategory === 'travel'
                ? 'bg-[#5C4632] text-amber-100 shadow-xs'
                : 'bg-stone-100 dark:bg-slate-800 text-stone-700 dark:text-stone-300 hover:bg-stone-200'
            }`}
          >
            {language === 'ar' ? 'أدعية السفر' : language === 'en' ? 'Travel Duas' : 'سفر کی دعائیں'}
          </button>
          <button
            onClick={() => setSelectedCategory('illness')}
            className={`px-3.5 py-2 rounded-lg font-bold shrink-0 transition-colors cursor-pointer ${
              selectedCategory === 'illness'
                ? 'bg-[#5C4632] text-amber-100 shadow-xs'
                : 'bg-stone-100 dark:bg-slate-800 text-stone-700 dark:text-stone-300 hover:bg-stone-200'
            }`}
          >
            {language === 'ar' ? 'أدعية الشفاء وعيادة المريض' : language === 'en' ? 'Sickness & Healing' : 'عیادت و شفاء کی دعائیں'}
          </button>
          <button
            onClick={() => setSelectedCategory('rizq')}
            className={`px-3.5 py-2 rounded-lg font-bold shrink-0 transition-colors cursor-pointer ${
              selectedCategory === 'rizq'
                ? 'bg-[#5C4632] text-amber-100 shadow-xs'
                : 'bg-stone-100 dark:bg-slate-800 text-stone-700 dark:text-stone-300 hover:bg-stone-200'
            }`}
          >
            {language === 'ar' ? 'تفريج الكرب وسداد الدين' : language === 'en' ? 'Relief & Barakah' : 'غم و قرض سے نجات و برکت'}
          </button>
        </div>
      </div>

      {/* Dua Cards List */}
      <div className="space-y-5">
        {filteredDuas.length === 0 ? (
          <div className="py-16 text-center bg-white dark:bg-slate-900 rounded-xl border border-stone-200 dark:border-slate-800 p-8 space-y-3">
            <Sparkles className="w-12 h-12 text-stone-300 mx-auto" />
            <h3 className={`text-lg font-bold text-stone-800 dark:text-stone-200 ${headingFontClass}`}>
              {language === 'ar' ? 'لم يتم العثور على أدعية مطابقة' : language === 'en' ? 'No Matching Duas Found' : 'کوئی مسنون دعا تلاش کے مطابق نہیں ملی'}
            </h3>
            <p className="text-sm text-stone-500">
              {language === 'ar' ? 'يرجى البحث بكلمات أخرى أو عرض جميع الأدعية.' : language === 'en' ? 'Please search with other keywords or select All Duas.' : 'براہ کرم کوئی دوسرا لفظ تلاش کریں یا تمام دعائیں منتخب کریں۔'}
            </p>
          </div>
        ) : (
          filteredDuas.map((item, index) => {
            const currentCount = counters[item.id] || 0;
            const repeatLimit = item.repeatCount || 1;

            return (
              <div
                key={item.id}
                className="bg-white dark:bg-slate-900 border border-[#E0D4C3] dark:border-slate-800 rounded-xl p-5 sm:p-7 shadow-xs hover:border-[#5C4632] transition-all space-y-4"
              >
                {/* Header: Title, Category & Actions */}
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#EADFCF] dark:border-slate-800 pb-3">
                  <div className="flex items-center gap-2">
                    <span className="w-7 h-7 rounded-full bg-[#5C4632] text-amber-200 flex items-center justify-center font-bold text-xs font-mono">
                      {index + 1}
                    </span>
                    <h3 className={`text-lg sm:text-xl font-bold text-[#5C4632] dark:text-[#E0B266] ${headingFontClass}`}>
                      {getLocalizedText(item.titleUrdu, language)}
                    </h3>
                  </div>

                  <div className="flex items-center gap-2">
                    {item.repeatCount && (
                      <button
                        onClick={() => handleIncrementCounter(item.id, item.repeatCount)}
                        className={`px-3 py-1 rounded-lg text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-all ${
                          currentCount >= repeatLimit
                            ? 'bg-emerald-600 text-white animate-pulse'
                            : 'bg-amber-100 dark:bg-amber-950/60 text-amber-900 dark:text-amber-200 hover:bg-amber-200'
                        }`}
                        title="Tasbeeh Counter"
                      >
                        <Repeat className="w-3.5 h-3.5" />
                        <span>{language === 'ar' ? `التكرار: ${currentCount} / ${repeatLimit} مرة` : language === 'en' ? `Repeat: ${currentCount} / ${repeatLimit}x` : `تکرار: ${currentCount} / ${repeatLimit} مرتبہ`}</span>
                        {currentCount >= repeatLimit && <Check className="w-3.5 h-3.5" />}
                      </button>
                    )}

                    <button
                      onClick={() => handleCopyDua(item)}
                      className="px-3 py-1 bg-stone-100 dark:bg-slate-800 hover:bg-stone-200 text-stone-700 dark:text-stone-300 text-xs font-bold rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer"
                      title="Copy dua"
                    >
                      {copiedId === item.id ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-600" />
                          <span className="text-emerald-700 dark:text-emerald-400">
                            {language === 'ar' ? 'تم النسخ' : language === 'en' ? 'Copied' : 'کاپی ہو گئی'}
                          </span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          <span>{language === 'ar' ? 'نسخ' : language === 'en' ? 'Copy' : 'کاپی'}</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>

                {/* Arabic Text with full Tashkeel */}
                <div className="bg-[#FAF6EE] dark:bg-slate-800/80 rounded-xl p-4 sm:p-6 border border-[#EADFCF] dark:border-slate-700 text-center">
                  <p
                    className="text-xl sm:text-2xl md:text-3xl text-stone-900 dark:text-stone-100 font-bold leading-[2.2] sm:leading-[2.4] font-arabic"
                  >
                    {item.arabicText}
                  </p>
                </div>

                {/* Translation */}
                <div className="space-y-1.5 px-2">
                  <div className="text-xs font-bold text-stone-500 dark:text-stone-400">
                    {language === 'ar' ? 'الترجمة والمعنى:' : language === 'en' ? 'Translation:' : 'سلیس اردو ترجمہ:'}
                  </div>
                  <p className={`text-base sm:text-lg md:text-[18px] text-stone-800 dark:text-stone-200 leading-[2.3] text-justify ${fontClass}`}>
                    {getLocalizedText(item.urduTranslation, language)}
                  </p>
                </div>

                {/* Benefit / Fadheelat */}
                {item.benefit && (
                  <div className="bg-[#F4EFE6] dark:bg-slate-800/50 rounded-lg p-3 text-xs sm:text-sm text-stone-700 dark:text-stone-300 leading-relaxed border border-[#E0D4C3] dark:border-slate-700 flex items-start gap-2">
                    <Sparkles className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-[#5C4632] dark:text-amber-300">
                        {language === 'ar' ? 'الفضل والبركة: ' : language === 'en' ? 'Virtue & Benefit: ' : 'فضیلت و برکت: '}
                      </strong>
                      <span>{getLocalizedText(item.benefit, language)}</span>
                    </div>
                  </div>
                )}

                {/* Hadith Reference */}
                <div className="pt-2 flex flex-wrap items-center justify-between gap-2 text-xs text-stone-500 border-t border-stone-100 dark:border-slate-800">
                  <div>
                    <span className="font-bold text-stone-700 dark:text-stone-300">
                      {language === 'ar' ? 'التخريج والمصدر: ' : language === 'en' ? 'Hadith Source: ' : 'حوالہ و تخریج: '}
                    </span>
                    <span className="font-sans font-medium">{item.reference}</span>
                  </div>
                  <div>
                    <span className="text-[#5C4632] dark:text-amber-400 font-bold">
                      {language === 'ar' ? 'دار الإفتاء بالجامعة الإسلامية أبت أباد' : language === 'en' ? 'Darul Ifta Jamia Islamia Abbottabad' : 'دار الافتاء جامعہ اسلامیہ ایبٹ آباد'}
                    </span>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

