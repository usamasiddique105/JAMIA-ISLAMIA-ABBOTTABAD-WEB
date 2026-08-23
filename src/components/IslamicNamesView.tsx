import React, { useState, useMemo } from 'react';
import { ISLAMIC_NAMES_DATA, IslamicNameItem } from '../data/islamicNamesData';
import { Search, User, Sparkles, Copy, Check, HelpCircle, BookMarked, Filter, Heart } from 'lucide-react';
import { useThemeLanguage } from '../context/ThemeLanguageContext';
import { getLanguageFontClass, getLocalizedText, getLocalizedCategory } from '../utils/translationHelper';

interface IslamicNamesViewProps {
  onOpenFatwaModal?: () => void;
}

const URDU_ALPHABET = [
  'تمام', 'ا', 'ب', 'ت', 'ث', 'ج', 'ح', 'خ', 'د', 'ذ', 'ر', 'ز', 'س', 'ش', 'ص', 'ض', 'ط', 'ظ', 'ع', 'غ', 'ف', 'ق', 'ک', 'گ', 'ل', 'م', 'ن', 'و', 'ہ', 'ی'
];

export const IslamicNamesView: React.FC<IslamicNamesViewProps> = ({ onOpenFatwaModal }) => {
  const { language, t } = useThemeLanguage();
  const fontClass = getLanguageFontClass(language);
  const headingFontClass = getLanguageFontClass(language, true);

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGender, setSelectedGender] = useState<'all' | 'boy' | 'girl'>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedLetter, setSelectedLetter] = useState<string>('تمام');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleCopyName = (item: IslamicNameItem) => {
    const text = `${item.nameArabic} (${item.nameUrdu} / ${item.nameEnglish}) - ${item.meaningUrdu} ${item.significance ? `[${item.significance}]` : ''}`;
    navigator.clipboard.writeText(text);
    setCopiedId(item.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const filteredNames = useMemo(() => {
    return ISLAMIC_NAMES_DATA.filter((item) => {
      // Gender filter
      if (selectedGender !== 'all' && item.gender !== selectedGender) {
        return false;
      }
      // Category filter
      if (selectedCategory !== 'all' && item.category !== selectedCategory) {
        return false;
      }
      // Letter filter
      if (selectedLetter !== 'تمام') {
        if (!item.nameUrdu.startsWith(selectedLetter) && item.firstLetter !== selectedLetter) {
          return false;
        }
      }
      // Search term
      if (searchTerm.trim()) {
        const term = searchTerm.toLowerCase().trim();
        const matchUrdu = item.nameUrdu.toLowerCase().includes(term);
        const matchArabic = item.nameArabic.toLowerCase().includes(term);
        const matchEng = item.nameEnglish.toLowerCase().includes(term);
        const matchMeaning = item.meaningUrdu.toLowerCase().includes(term);
        const matchSignificance = item.significance ? item.significance.toLowerCase().includes(term) : false;
        if (!matchUrdu && !matchArabic && !matchEng && !matchMeaning && !matchSignificance) {
          return false;
        }
      }
      return true;
    });
  }, [searchTerm, selectedGender, selectedCategory, selectedLetter]);

  return (
    <div className={`w-full space-y-6 ${fontClass}`} dir={language === 'en' ? 'ltr' : 'rtl'}>
      {/* Title & Introduction Banner */}
      <div className="bg-gradient-to-r from-[#FAF6EE] to-[#F5EFE0] dark:from-slate-900 dark:to-slate-800 border border-[#D9CBB6] dark:border-slate-800 rounded-xl p-5 sm:p-7 shadow-xs">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className={`space-y-2 text-center ${language === 'en' ? 'md:text-left' : 'md:text-right'}`}>
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#5C4632] text-amber-100 rounded-full text-xs font-bold font-sans">
              <BookMarked className="w-3.5 h-3.5 text-amber-300" />
              <span>
                {language === 'ar'
                  ? 'دليل الأسماء الإسلامية • مرجع الأسماء الشرعية المعتمدة'
                  : language === 'en'
                  ? 'Islamic Names Directory • Authentic Reference Guide'
                  : 'دلیل الأسماء الإسلامية • مستند اسلامی ناموں کی ڈائریکٹری'}
              </span>
            </div>
            <h2 className={`text-2xl sm:text-3xl font-black text-[#5C4632] dark:text-[#E0B266] ${headingFontClass}`}>
              {language === 'ar'
                ? 'منتخب الأسماء الإسلامية والقرآنية مع المعاني والدلالات'
                : language === 'en'
                ? 'Curated Islamic & Quranic Names with Meanings'
                : 'منتخب اسلامی و قرآنی نام بمع معانی و تفصیلات'}
            </h2>
            <p className="text-stone-700 dark:text-stone-300 text-sm sm:text-base leading-relaxed max-w-3xl">
              {language === 'ar'
                ? 'قال النبي ﷺ: «إِنَّكُمْ تُدْعَوْنَ يَوْمَ الْقِيَامَةِ بِأَسْمَائِكُمْ وَأَسْمَاءِ آبَائِكُمْ فَأَحْسِنُوا أَسْمَاءَكُمْ» (رواه أبو داود).'
                : language === 'en'
                ? 'The Messenger of Allah (ﷺ) said: "You will be called on the Day of Resurrection by your names and the names of your fathers, so have good names." (Abu Dawud)'
                : 'نبی کریم ﷺ کا ارشاد گرامی ہے: «إِنَّكُمْ تُدْعَوْنَ يَوْمَ الْقِيَامَةِ بِأَسْمَائِكُمْ وَأَسْمَاءِ آبَائِكُمْ فَأَحْسِنُوا أَسْمَاءَكُمْ» (قیامت کے دن تمہیں تمہارے اور تمہارے آباء کے ناموں سے پکارا جائے گا، لہٰذا اپنے بچوں کے اچھے اور بابرکت نام رکھو)۔'}
            </p>
          </div>

          {onOpenFatwaModal && (
            <button
              onClick={onOpenFatwaModal}
              className="shrink-0 px-4 py-2.5 bg-[#5C4632] hover:bg-[#483625] text-amber-100 rounded-lg text-sm font-bold flex items-center gap-2 shadow-xs transition-colors cursor-pointer"
            >
              <HelpCircle className="w-4 h-4 text-amber-300" />
              <span>
                {language === 'ar'
                  ? 'طلب تحقيق شرعي لاسم'
                  : language === 'en'
                  ? 'Inquire About a Name'
                  : 'نام کی شرعی تحقیق کروائیں'}
              </span>
            </button>
          )}
        </div>
      </div>

      {/* Filters Section */}
      <div className="bg-white dark:bg-slate-900 border border-[#D9CBB6] dark:border-slate-800 rounded-xl p-4 sm:p-6 space-y-4 shadow-xs">
        {/* Search Bar & Gender Toggle */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
          {/* Search Box */}
          <div className="md:col-span-6 relative">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder={
                language === 'ar'
                  ? 'ابحث بالاسم العربي، الإنجليزي أو المعنى...'
                  : language === 'en'
                  ? 'Search by name, Arabic, English or meaning...'
                  : 'نام، عربی تلفظ یا معنی سے تلاش کریں (مثلاً: محمد، فاطمہ، نور، حیا)...'
              }
              className={`w-full ${language === 'en' ? 'pl-10 pr-4' : 'pr-10 pl-4'} py-2.5 text-sm sm:text-base bg-[#FCFAF6] dark:bg-slate-800 border border-[#D2C2A7] dark:border-slate-700 rounded-lg text-stone-900 dark:text-stone-100 placeholder-stone-400 focus:outline-none focus:border-[#5C4632] ${fontClass}`}
            />
            <Search className={`w-5 h-5 text-stone-400 absolute ${language === 'en' ? 'left-3' : 'right-3'} top-1/2 -translate-y-1/2`} />
          </div>

          {/* Gender Buttons */}
          <div className={`md:col-span-6 flex items-center ${language === 'en' ? 'justify-start sm:justify-end' : 'justify-start sm:justify-end'} gap-1.5 overflow-x-auto pb-1 sm:pb-0`}>
            <button
              onClick={() => setSelectedGender('all')}
              className={`px-3.5 py-2 rounded-lg text-xs sm:text-sm font-bold transition-colors cursor-pointer shrink-0 ${
                selectedGender === 'all'
                  ? 'bg-[#5C4632] text-amber-100 shadow-xs'
                  : 'bg-stone-100 dark:bg-slate-800 text-stone-700 dark:text-stone-300 hover:bg-stone-200'
              }`}
            >
              {language === 'ar' ? `جميع الأسماء (${ISLAMIC_NAMES_DATA.length})` : language === 'en' ? `All Names (${ISLAMIC_NAMES_DATA.length})` : `تمام نام (${ISLAMIC_NAMES_DATA.length})`}
            </button>
            <button
              onClick={() => setSelectedGender('boy')}
              className={`px-3.5 py-2 rounded-lg text-xs sm:text-sm font-bold transition-colors cursor-pointer shrink-0 ${
                selectedGender === 'boy'
                  ? 'bg-[#1E3A8A] text-white shadow-xs'
                  : 'bg-blue-50 dark:bg-blue-950/40 text-blue-800 dark:text-blue-300 hover:bg-blue-100'
              }`}
            >
              👦 {language === 'ar' ? `أسماء البنين (${ISLAMIC_NAMES_DATA.filter(n => n.gender === 'boy').length})` : language === 'en' ? `Boys Names (${ISLAMIC_NAMES_DATA.filter(n => n.gender === 'boy').length})` : `لڑکوں کے نام (${ISLAMIC_NAMES_DATA.filter(n => n.gender === 'boy').length})`}
            </button>
            <button
              onClick={() => setSelectedGender('girl')}
              className={`px-3.5 py-2 rounded-lg text-xs sm:text-sm font-bold transition-colors cursor-pointer shrink-0 ${
                selectedGender === 'girl'
                  ? 'bg-[#9D174D] text-white shadow-xs'
                  : 'bg-pink-50 dark:bg-pink-950/40 text-pink-800 dark:text-pink-300 hover:bg-pink-100'
              }`}
            >
              👧 {language === 'ar' ? `أسماء البنات (${ISLAMIC_NAMES_DATA.filter(n => n.gender === 'girl').length})` : language === 'en' ? `Girls Names (${ISLAMIC_NAMES_DATA.filter(n => n.gender === 'girl').length})` : `لڑکیوں کے نام (${ISLAMIC_NAMES_DATA.filter(n => n.gender === 'girl').length})`}
            </button>
          </div>
        </div>

        {/* Category Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 border-t border-[#EAE0D0] dark:border-slate-800 pt-3 text-xs sm:text-sm">
          <span className="text-stone-500 dark:text-stone-400 font-bold shrink-0 mx-1">
            {language === 'ar' ? 'القسم:' : language === 'en' ? 'Category:' : 'زمرہ:'}
          </span>
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-3 py-1 rounded-md shrink-0 cursor-pointer font-bold transition-colors ${
              selectedCategory === 'all' ? 'bg-[#5C4632] text-amber-100' : 'bg-stone-100 dark:bg-slate-800 text-stone-700 dark:text-stone-300 hover:bg-stone-200'
            }`}
          >
            {language === 'ar' ? 'الكل' : language === 'en' ? 'All' : 'تمام زمرہ جات'}
          </button>
          <button
            onClick={() => setSelectedCategory('prophet')}
            className={`px-3 py-1 rounded-md shrink-0 cursor-pointer font-bold transition-colors ${
              selectedCategory === 'prophet' ? 'bg-[#5C4632] text-amber-100' : 'bg-stone-100 dark:bg-slate-800 text-stone-700 dark:text-stone-300 hover:bg-stone-200'
            }`}
          >
            {language === 'ar' ? 'الأنبياء والرسل' : language === 'en' ? 'Prophets' : 'انبیائے کرام علیہم السلام'}
          </button>
          <button
            onClick={() => setSelectedCategory('sahabi')}
            className={`px-3 py-1 rounded-md shrink-0 cursor-pointer font-bold transition-colors ${
              selectedCategory === 'sahabi' ? 'bg-[#5C4632] text-amber-100' : 'bg-stone-100 dark:bg-slate-800 text-stone-700 dark:text-stone-300 hover:bg-stone-200'
            }`}
          >
            {language === 'ar' ? 'الصحابة الكرام' : language === 'en' ? 'Sahabah' : 'صحابہ کرام رضی اللہ عنہم'}
          </button>
          <button
            onClick={() => setSelectedCategory('sahabiyyah')}
            className={`px-3 py-1 rounded-md shrink-0 cursor-pointer font-bold transition-colors ${
              selectedCategory === 'sahabiyyah' ? 'bg-[#5C4632] text-amber-100' : 'bg-stone-100 dark:bg-slate-800 text-stone-700 dark:text-stone-300 hover:bg-stone-200'
            }`}
          >
            {language === 'ar' ? 'أمهات المؤمنين والصحابيات' : language === 'en' ? 'Female Companions' : 'امہات المؤمنین و صحابیات'}
          </button>
          <button
            onClick={() => setSelectedCategory('quranic')}
            className={`px-3 py-1 rounded-md shrink-0 cursor-pointer font-bold transition-colors ${
              selectedCategory === 'quranic' ? 'bg-[#5C4632] text-amber-100' : 'bg-stone-100 dark:bg-slate-800 text-stone-700 dark:text-stone-300 hover:bg-stone-200'
            }`}
          >
            {language === 'ar' ? 'الأسماء القرآنية' : language === 'en' ? 'Quranic Names' : 'قرآنی نام و صفات'}
          </button>
        </div>

        {/* Alphabetical Letters Bar */}
        <div className="flex items-center gap-1 overflow-x-auto pb-1 border-t border-[#EAE0D0] dark:border-slate-800 pt-3">
          <span className="text-stone-500 dark:text-stone-400 text-xs font-bold shrink-0 mx-1">
            {language === 'ar' ? 'الحروف:' : language === 'en' ? 'Alphabet:' : 'حروفِ تہجی:'}
          </span>
          {URDU_ALPHABET.map((char) => (
            <button
              key={char}
              onClick={() => setSelectedLetter(char)}
              className={`px-2.5 py-1 rounded text-xs sm:text-sm font-bold shrink-0 transition-colors cursor-pointer ${
                selectedLetter === char
                  ? 'bg-[#5C4632] text-amber-200 shadow-2xs font-black'
                  : 'bg-stone-50 dark:bg-slate-800 hover:bg-stone-200 text-stone-700 dark:text-stone-300 border border-stone-200 dark:border-slate-700'
              }`}
            >
              {char === 'تمام' && language === 'en' ? 'All' : char === 'تمام' && language === 'ar' ? 'الكل' : char}
            </button>
          ))}
        </div>
      </div>

      {/* Results Count */}
      <div className="flex items-center justify-between text-xs sm:text-sm text-stone-600 dark:text-stone-400 px-1">
        <span>
          {language === 'ar' ? 'عدد الأسماء المعروضة: ' : language === 'en' ? 'Displayed Names: ' : 'دکھائے جانے والے نام: '}
          <strong className="text-[#5C4632] dark:text-amber-300 font-mono">{filteredNames.length}</strong>
        </span>
        {(searchTerm || selectedGender !== 'all' || selectedCategory !== 'all' || selectedLetter !== 'تمام') && (
          <button
            onClick={() => {
              setSearchTerm('');
              setSelectedGender('all');
              setSelectedCategory('all');
              setSelectedLetter('تمام');
            }}
            className="text-xs text-amber-800 dark:text-amber-400 hover:underline cursor-pointer"
          >
            {language === 'ar' ? 'إعادة ضبط الفلاتر ✕' : language === 'en' ? 'Reset Filters ✕' : 'تمام فلٹرز ختم کریں ✕'}
          </button>
        )}
      </div>

      {/* Names Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
        {filteredNames.length === 0 ? (
          <div className="col-span-full py-16 text-center bg-white dark:bg-slate-900 rounded-xl border border-stone-200 dark:border-slate-800 p-8 space-y-3">
            <BookMarked className="w-12 h-12 text-stone-300 mx-auto" />
            <h3 className={`text-lg font-bold text-stone-800 dark:text-stone-200 ${headingFontClass}`}>
              {language === 'ar' ? 'لم يتم العثور على اسم مطابق' : language === 'en' ? 'No Matching Names Found' : 'کوئی نام تلاش کے مطابق نہیں ملا'}
            </h3>
            <p className="text-sm text-stone-500 max-w-md mx-auto">
              {language === 'ar'
                ? 'إذا كنت ترغب في الاستفسار عن حكم اسم معين ومعناه الشرعي، يمكنك إرسال سؤالك إلى دار الإفتاء.'
                : language === 'en'
                ? 'If you wish to verify the Islamic ruling or exact meaning of a specific name, feel free to submit a question to Darul Ifta.'
                : 'اگر آپ کسی خاص نام کی شرعی حیثیت اور معنی دار الافتاء کے مفتیان کرام سے معلوم کرنا چاہتے ہیں تو سوال ارسال کریں۔'}
            </p>
            {onOpenFatwaModal && (
              <button
                onClick={onOpenFatwaModal}
                className="mt-2 px-4 py-2 bg-[#5C4632] text-amber-100 rounded-lg text-sm font-bold inline-flex items-center gap-2 cursor-pointer"
              >
                <span>{language === 'ar' ? 'سؤال دار الإفتاء' : language === 'en' ? 'Ask Darul Ifta' : 'دار الافتاء سے سوال پوچھیں'}</span>
              </button>
            )}
          </div>
        ) : (
          filteredNames.map((item) => (
            <div
              key={item.id}
              className="bg-white dark:bg-slate-900 border border-[#E0D4C3] dark:border-slate-800 rounded-xl p-4 sm:p-5 shadow-2xs hover:shadow-md transition-all hover:border-[#5C4632] group flex flex-col justify-between"
            >
              <div className="space-y-3">
                {/* Card Header: Arabic name & Gender badge */}
                <div className="flex items-start justify-between gap-2 border-b border-stone-100 dark:border-slate-800 pb-2.5">
                  <div>
                    <h3 
                      className="text-2xl sm:text-3xl font-bold text-[#5C4632] dark:text-[#E0B266] leading-tight font-arabic"
                    >
                      {item.nameArabic}
                    </h3>
                    <div className="flex items-center gap-2 mt-0.5 text-xs text-stone-500">
                      <span className="font-bold text-stone-800 dark:text-stone-200">{item.nameUrdu}</span>
                      <span>•</span>
                      <span className="font-sans font-medium text-stone-600 dark:text-stone-400">{item.nameEnglish}</span>
                    </div>
                  </div>

                  <span
                    className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold shrink-0 ${
                      item.gender === 'boy'
                        ? 'bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300 border border-blue-200 dark:border-blue-800'
                        : 'bg-pink-50 text-pink-700 dark:bg-pink-950/60 dark:text-pink-300 border border-pink-200 dark:border-pink-800'
                    }`}
                  >
                    {item.gender === 'boy' 
                      ? (language === 'ar' ? 'ذكر' : language === 'en' ? 'Boy' : 'لڑکا')
                      : (language === 'ar' ? 'أنثى' : language === 'en' ? 'Girl' : 'لڑکی')}
                  </span>
                </div>

                {/* Meaning */}
                <div className="space-y-1">
                  <div className="text-xs font-bold text-stone-500 dark:text-stone-400">
                    {language === 'ar' ? 'المعنى والدلالة:' : language === 'en' ? 'Meaning & Concept:' : 'معنی و مفہوم:'}
                  </div>
                  <p className={`text-sm sm:text-base text-stone-800 dark:text-stone-200 leading-relaxed font-semibold ${fontClass}`}>
                    {getLocalizedText(item.meaningUrdu, language)}
                  </p>
                </div>

                {/* Significance / Islamic Note */}
                {item.significance && (
                  <div className="bg-[#FAF6EE] dark:bg-slate-800/80 rounded-lg p-2.5 text-xs text-stone-700 dark:text-stone-300 leading-relaxed border border-[#EADFCF] dark:border-slate-700">
                    <span className="font-bold text-[#5C4632] dark:text-amber-300 mx-1">
                      {language === 'ar' ? 'النسبة:' : language === 'en' ? 'Context:' : 'نسبت:'}
                    </span>
                    <span>{getLocalizedText(item.significance, language)}</span>
                  </div>
                )}
              </div>

              {/* Bottom Actions */}
              <div className="pt-3 mt-3 border-t border-stone-100 dark:border-slate-800 flex items-center justify-between">
                <span className="text-[11px] text-stone-400">
                  {item.category === 'prophet' && (language === 'ar' ? '✨ الأنبياء' : language === 'en' ? '✨ Prophets' : '✨ انبیائے کرام')}
                  {item.category === 'sahabi' && (language === 'ar' ? '⭐ الصحابة' : language === 'en' ? '⭐ Sahabah' : '⭐ صحابہ کرام')}
                  {item.category === 'sahabiyyah' && (language === 'ar' ? '🌸 الصحابيات' : language === 'en' ? '🌸 Female Sahabah' : '🌸 صحابیات و امہات')}
                  {item.category === 'quranic' && (language === 'ar' ? '📖 أسماء قرآنية' : language === 'en' ? '📖 Quranic Names' : '📖 قرآنی اسماء')}
                  {item.category === 'general' && (language === 'ar' ? '🌿 أسماء إسلامية' : language === 'en' ? '🌿 Islamic Names' : '🌿 اسلامی اسماء')}
                </span>

                <button
                  onClick={() => handleCopyName(item)}
                  className="px-2.5 py-1 text-xs bg-stone-100 dark:bg-slate-800 hover:bg-stone-200 text-stone-700 dark:text-stone-300 rounded flex items-center gap-1 transition-colors cursor-pointer"
                  title="Copy details"
                >
                  {copiedId === item.id ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                      <span className="text-emerald-700 dark:text-emerald-400 font-bold">
                        {language === 'ar' ? 'تم النسخ' : language === 'en' ? 'Copied' : 'کاپی ہو گیا'}
                      </span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5 text-stone-500" />
                      <span>{language === 'ar' ? 'نسخ' : language === 'en' ? 'Copy' : 'کاپی'}</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

