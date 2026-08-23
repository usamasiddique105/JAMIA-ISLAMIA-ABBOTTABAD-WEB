import React, { useState, useEffect } from 'react';
import { Fatwa } from '../types';
import { StorageService } from '../services/storage';
import { useThemeLanguage } from '../context/ThemeLanguageContext';
import { getLocalizedText, getLocalizedCategory, getLanguageFontClass } from '../utils/translationHelper';
import { getOrTranslateFatwaEnglish, isEnglishTranslationMissingOrFallback } from '../services/fatwaTranslationService';
import { FatwaTranslationBanner } from './FatwaTranslationBanner';
import { Search, HelpCircle, ChevronLeft, ArrowRight, Printer, Copy, Check, BookOpen, BookMarked, Sparkles } from 'lucide-react';
import { JAMIA_HEADER_LOGO_DATA_URI } from '../assets/logoBase64';
import { DARUL_IFTA_WHITE_LOGO_DATA_URI } from '../assets/darulIftaLogoBase64';
import headerLogoCalligraphy from '../assets/images/jamia_logo_calligraphy_transparent.png';
import darulIftaCleanWhite from '../assets/images/darulifta_clean_white.png';
import { IslamicNamesView } from './IslamicNamesView';
import { MasnoonDuasView } from './MasnoonDuasView';

interface FatwaSectionProps {
  activeTabId?: string;
  onSelectTab?: (tabId: string) => void;
  onOpenFatwaModal: () => void;
}

// Helper function to smartly format text into structured, distinct paragraphs
const formatParagraphs = (rawText: string, isAnswer = false): string[] => {
  if (!rawText) return [];
  let text = rawText.trim();
  
  if (isAnswer) {
    text = text.replace(/^(الْجَوَابُ\s*بِاسْمِ\s*مُلْهِمِ\s*الصَّوَابْ|الجواب\s*باسم\s*ملہم\s*الصواب|الجواب\s*باسم\s*ملهم\s*الصواب|الجواب\s*باسم\s*ملھم\s*الصواب|الجواب\s*وباللہ\s*التوفیق|الجواب\s*وباللہ\s*التوفیق:)[\s:،-]*\n*/iu, '').trim();
  }

  // Recognize paragraph breaks after sentence terminators (۔ / . / ! / ؟) followed by standard paragraph markers
  const starters = [
    'صورتِ\\s*مسئولہ\\s*میں',
    'صورتِ\\s*مسئولہ\\s*کا\\s*حکم\\s*یہ\\s*ہے',
    'واضح\\s*رہے\\s*کہ',
    'واضح\\s*رہےکہ',
    'لہٰذا',
    'لہذا',
    'حاصل\\s*یہ\\s*کہ',
    'خلاصہ\\s*یہ\\s*کہ',
    'خلاصہ\\s*کلام\\s*یہ\\s*کہ',
    'تنبیہ\\s*:',
    'تنبیہ\\s*؛',
    'فائدہ\\s*:',
    'نوٹ\\s*:',
    'البتہ',
    'نیز\\s*یہ\\s*بھی\\s*واضح\\s*رہے',
    'جہاں\\s*تک\\s*تعلق\\s*ہے'
  ];

  let formatted = text;
  starters.forEach(starter => {
    const regex = new RegExp(`([۔.!?؟])\\s*(${starter})`, 'gu');
    formatted = formatted.replace(regex, '$1\n\n$2');
  });

  return formatted
    .split(/\n+/)
    .map(p => p.trim())
    .filter(p => p.length > 0);
};

const formatUrduParagraphs = formatParagraphs;

// Helper function to clean text, extract Katabahu, and remove existing Wallahu Ta'ala phrases
const cleanEndingPhrases = (str: string) => {
  return str
    .replace(/(?:فقط\s*)?(?:والله|واللہ)\s*(?:تعالى|تعالیٰ|تعالی)\s*(?:اعلم|أعلم)\s*(?:بالصواب|بالصّواب)?[\s۔.!]*/gu, '')
    .trim();
};

// Helper function to parse Arabic reference text, clean quotations, and extract Katabahu
const parseArabicReference = (rawRef: string, answerText?: string) => {
  let text = (rawRef || '')
    .replace(/^(وَالدَّلِيلُ عَلَى ذَلِكَ|والدلیل علی ذالک|والدلیل علیٰ ذالک|والدليل على ذلك)[\s:،-]*\n*/iu, '')
    .trim();

  let katabahu: string | null = null;
  
  // Match standalone signature like كتبه : ... or کتبہ : ... or کتبہٗ : ... or حررہ : ...
  // MUST NOT match مكتبه / مکتبہ (publishers like مكتبه رحمانيه)
  const katabahuRegex = /(?<![\p{L}\p{M}])(?:كتبه|کتبہ|كتبہ|کتبه|كتبہٗ|کتبہٗ|حررہ|حرره)\s*[:：]?\s*([^\n«»]+)/gu;
  
  // First check in reference text
  const matches = [...text.matchAll(katabahuRegex)];
  if (matches.length > 0) {
    const lastMatch = matches[matches.length - 1];
    katabahu = lastMatch[0].trim();
    text = text.replace(lastMatch[0], '').trim();
    text = text.replace(/\s*«\s*»\s*$/g, '').trim();
    text = text.replace(/[\s«»]+$/g, '').trim();
  } else if (answerText) {
    // If not in arabicText, check if author wrote کتبہ at the end of answerText
    const ansMatches = [...answerText.matchAll(katabahuRegex)];
    if (ansMatches.length > 0) {
      katabahu = ansMatches[ansMatches.length - 1][0].trim();
    }
  }

  // Clean any redundant "واللہ تعالی اعلم بالصواب" from reference text so it's not repeated
  text = cleanEndingPhrases(text);

  const paragraphs = text
    .split(/\n+/)
    .map(p => p.trim())
    .filter(p => p.length > 0);

  return { paragraphs, katabahu };
};

export const FatwaSection: React.FC<FatwaSectionProps> = ({
  activeTabId,
  onSelectTab,
  onOpenFatwaModal,
}) => {
  const { language, dir, t } = useThemeLanguage();
  const fontClass = getLanguageFontClass(language);
  const headingFontClass = getLanguageFontClass(language, true);

  const getInitialSubTab = (tabId?: string): 'fatwas' | 'names' | 'duas' => {
    if (tabId === 'fatwa-names') return 'names';
    if (tabId === 'fatwa-duas') return 'duas';
    return 'fatwas';
  };

  const [currentSubTab, setCurrentSubTab] = useState<'fatwas' | 'names' | 'duas'>(() => getInitialSubTab(activeTabId));
  const [fatwas, setFatwas] = useState<Fatwa[]>([]);
  const [selectedFatwa, setSelectedFatwa] = useState<Fatwa | null>(null);
  const [copied, setCopied] = useState(false);
  const [isTranslating, setIsTranslating] = useState(false);
  const [showingOriginal, setShowingOriginal] = useState(false);

  // Automated translation when viewing a single fatwa in English
  useEffect(() => {
    if (!selectedFatwa || language !== 'en' || showingOriginal) return;

    if (isEnglishTranslationMissingOrFallback(selectedFatwa)) {
      setIsTranslating(true);
      getOrTranslateFatwaEnglish(selectedFatwa)
        .then(updated => {
          setSelectedFatwa(updated);
        })
        .catch(err => {
          console.warn('Gemini translation notice:', err);
        })
        .finally(() => {
          setIsTranslating(false);
        });
    }
  }, [selectedFatwa?.id, language, showingOriginal]);

  // Sync with activeTabId when prop changes
  useEffect(() => {
    if (activeTabId === 'fatwa-names') {
      setCurrentSubTab('names');
      setSelectedFatwa(null);
    } else if (activeTabId === 'fatwa-duas') {
      setCurrentSubTab('duas');
      setSelectedFatwa(null);
    } else if (activeTabId === 'fatwas' || activeTabId === 'fatwa-archive') {
      setCurrentSubTab('fatwas');
    }
  }, [activeTabId]);

  const handleTabSwitch = (tab: 'fatwas' | 'names' | 'duas') => {
    setCurrentSubTab(tab);
    setSelectedFatwa(null);
    if (onSelectTab) {
      if (tab === 'names') onSelectTab('fatwa-names');
      else if (tab === 'duas') onSelectTab('fatwa-duas');
      else onSelectTab('fatwas');
    }
  };

  // Search filter states
  const [keyword, setKeyword] = useState('');
  const [fatwaNo, setFatwaNo] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedChapter, setSelectedChapter] = useState('');
  const [selectedSubChapter, setSelectedSubChapter] = useState('');

  // Applied search filter state
  const [appliedFilter, setAppliedFilter] = useState({
    keyword: '',
    fatwaNo: '',
    category: '',
    chapter: '',
    subChapter: '',
  });

  const loadFatwas = () => {
    const list = StorageService.getFatwas().filter(f => f.status === 'Published');
    setFatwas(list);
  };

  useEffect(() => {
    loadFatwas();
    const handleUpdate = () => loadFatwas();
    window.addEventListener('storage', handleUpdate);
    window.addEventListener('jamia_db_updated', handleUpdate);
    return () => {
      window.removeEventListener('storage', handleUpdate);
      window.removeEventListener('jamia_db_updated', handleUpdate);
    };
  }, []);

  const handleSearchSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setAppliedFilter({
      keyword,
      fatwaNo,
      category: selectedCategory,
      chapter: selectedChapter,
      subChapter: selectedSubChapter,
    });
    // Return to list view if a new search is submitted
    setSelectedFatwa(null);
  };

  const handlePrint = () => {
    window.print();
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const filteredFatwas = fatwas.filter(f => {
    const qKey = appliedFilter.keyword.toLowerCase().trim();
    const qNo = appliedFilter.fatwaNo.toLowerCase().trim();
    const qCat = appliedFilter.category.trim();

    if (qNo && !f.fatwaNumber.toLowerCase().includes(qNo)) {
      return false;
    }

    if (qCat && f.category !== qCat) {
      return false;
    }

    if (qKey) {
      const matchTitleUr = f.title.ur?.toLowerCase().includes(qKey);
      const matchTitleEn = f.title.en?.toLowerCase().includes(qKey);
      const matchTitleAr = f.title.ar?.toLowerCase().includes(qKey);
      const matchQuestionUr = f.question.ur?.toLowerCase().includes(qKey);
      const matchAnswerUr = f.answer.ur?.toLowerCase().includes(qKey);
      const matchFatwaNo = f.fatwaNumber.toLowerCase().includes(qKey);
      if (!matchTitleUr && !matchTitleEn && !matchTitleAr && !matchQuestionUr && !matchAnswerUr && !matchFatwaNo) {
        return false;
      }
    }

    return true;
  });

  // Numerals helper
  const toDisplayNumeral = (num: number): string => {
    if (language === 'en') return num.toString();
    const arabicDigits = ['٠', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩'];
    const urduDigits = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];
    const digits = language === 'ar' ? arabicDigits : urduDigits;
    return num.toString().split('').map(d => digits[parseInt(d, 10)] || d).join('');
  };

  return (
    <div className={`w-full bg-white dark:bg-slate-950 py-2 sm:py-4 ${fontClass}`} dir={dir}>
      
      {/* 1. Official Institutional Fatwa Header Box (Featuring User's Exact Calligraphy Logo Banner Centered) */}
      <div className="w-full mb-3.5 sm:mb-6 no-print">
        <div 
          className="relative rounded-xl border-y-[3px] border-[#B89B72] dark:border-amber-800 px-4 sm:px-8 py-4 sm:py-6 overflow-hidden flex flex-col md:flex-row items-center justify-between gap-3 sm:gap-6 shadow-sm min-h-[100px] sm:min-h-[125px]"
          style={{
            backgroundColor: '#EBE3D5',
            backgroundImage: `
              radial-gradient(ellipse at center, rgba(245, 239, 230, 0.85) 0%, rgba(232, 222, 207, 0.95) 100%),
              url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23997A4D' fill-opacity='0.12' fill-rule='evenodd'%3E%3Cpath d='M30 0l30 30-30 30L0 30 30 0zm0 7.5L7.5 30 30 52.5 52.5 30 30 7.5zM30 15l15 15-15 15-15-15 15-15zm0 5.25L20.25 30 30 39.75 39.75 30 30 20.25z'/%3E%3C/g%3E%3C/svg%3E")
            `,
            backgroundRepeat: 'repeat'
          }}
          dir={dir}
        >
          {/* Subtle decorative inner borders */}
          <div className="absolute inset-x-0 top-0.5 h-[1px] bg-[#997A4D]/40"></div>
          <div className="absolute inset-x-0 bottom-0.5 h-[1px] bg-[#997A4D]/40"></div>

          {/* Side: Heading & Subtitle */}
          <div className="relative z-10 shrink-0">
            <span className={`text-xs sm:text-sm font-bold text-[#6D472B] dark:text-amber-200 block ${fontClass}`}>
              {language === 'ar' 
                ? 'دار الإفتاء بالجامعة الإسلامية أبت أباد' 
                : language === 'en'
                ? 'Darul Ifta Jamia Islamia Abbottabad'
                : 'دار الافتاء جامعہ اسلامیہ ایبٹ آباد'}
            </span>
            <h1 className={`text-lg sm:text-xl md:text-[23px] font-black text-[#3E2514] dark:text-amber-100 tracking-wide leading-snug ${headingFontClass}`} style={{ color: '#3E2514' }}>
              {language === 'ar'
                ? 'تحت إشراف كبار العلماء والمفتين المعتمدين'
                : language === 'en'
                ? 'Under the Supervision of Qualified Islamic Scholars'
                : 'مستند علمائے کرام اور مفتیانِ کرام کے زیرِ نگرانی'}
            </h1>
          </div>

          {/* Left/Center Area: Calligraphy Banner Logo "دارالافتاء الجامعة الاسلامية ايبت آباد" */}
          <div className="relative z-10 flex items-center justify-center select-none py-1 flex-1 w-full md:w-auto">
            <img 
              src={DARUL_IFTA_WHITE_LOGO_DATA_URI || darulIftaCleanWhite} 
              alt="دارالافتاء الجامعة الاسلامية ايبت آباد" 
              className="h-12 sm:h-16 md:h-18 lg:h-20 w-auto max-w-[320px] sm:max-w-[440px] md:max-w-[540px] lg:max-w-[600px] object-contain transition-all"
              style={{
                filter: 'invert(1) brightness(0.24) sepia(0.8) hue-rotate(340deg) contrast(1.15)'
              }}
              onError={(e) => {
                const target = e.currentTarget;
                if (!target.dataset.tried) {
                  target.dataset.tried = '1';
                  target.src = '/darulifta_user_banner_white.png';
                } else if (target.dataset.tried === '1') {
                  target.dataset.tried = '2';
                  target.src = '/darulifta_clean_white.png';
                }
              }}
            />
          </div>
        </div>
      </div>

      {/* 2. Section Navigation Tabs Bar (نئے سوالات، اسلامی نام ڈائریکٹری، مسنون دعائیں) */}
      <div className="w-full mb-5 no-print">
        <div className="flex items-center justify-start gap-2 overflow-x-auto pb-1 border-b-2 border-[#D9CBB6] dark:border-slate-800">
          <button
            onClick={() => handleTabSwitch('fatwas')}
            className={`px-4 sm:px-6 py-2.5 rounded-t-lg font-bold text-sm sm:text-base flex items-center gap-2 transition-all cursor-pointer shrink-0 ${
              currentSubTab === 'fatwas'
                ? 'bg-[#5C4632] text-amber-100 shadow-xs border-t-2 border-r-2 border-l-2 border-[#5C4632] -mb-[2px]'
                : 'bg-stone-100 dark:bg-slate-800 text-stone-700 dark:text-stone-300 hover:bg-stone-200 dark:hover:bg-slate-700'
            }`}
          >
            <BookOpen className="w-4 h-4 text-amber-300" />
            <span>{language === 'ar' ? 'أحدث الفتاوى والأرشيف' : language === 'en' ? 'Recent Fatwas & Archive' : 'نئے سوالات و فتاویٰ آرکائیو'}</span>
          </button>

          <button
            onClick={() => handleTabSwitch('names')}
            className={`px-4 sm:px-6 py-2.5 rounded-t-lg font-bold text-sm sm:text-base flex items-center gap-2 transition-all cursor-pointer shrink-0 ${
              currentSubTab === 'names'
                ? 'bg-[#5C4632] text-amber-100 shadow-xs border-t-2 border-r-2 border-l-2 border-[#5C4632] -mb-[2px]'
                : 'bg-stone-100 dark:bg-slate-800 text-stone-700 dark:text-stone-300 hover:bg-stone-200 dark:hover:bg-slate-700'
            }`}
          >
            <BookMarked className="w-4 h-4 text-amber-300" />
            <span>{language === 'ar' ? 'دليل الأسماء الإسلامية' : language === 'en' ? 'Islamic Names Directory' : 'اسلامی نام ڈائریکٹری'}</span>
          </button>

          <button
            onClick={() => handleTabSwitch('duas')}
            className={`px-4 sm:px-6 py-2.5 rounded-t-lg font-bold text-sm sm:text-base flex items-center gap-2 transition-all cursor-pointer shrink-0 ${
              currentSubTab === 'duas'
                ? 'bg-[#5C4632] text-amber-100 shadow-xs border-t-2 border-r-2 border-l-2 border-[#5C4632] -mb-[2px]'
                : 'bg-stone-100 dark:bg-slate-800 text-stone-700 dark:text-stone-300 hover:bg-stone-200 dark:hover:bg-slate-700'
            }`}
          >
            <Sparkles className="w-4 h-4 text-amber-300" />
            <span>{language === 'ar' ? 'الأدعية المأثورة والمسنونة' : language === 'en' ? 'Authentic Masnoon Duas' : 'مسنون و معروف دعائیں'}</span>
          </button>
        </div>
      </div>

      {/* 3. Conditional Sub-Views */}
      {currentSubTab === 'names' && (
        <IslamicNamesView onOpenFatwaModal={onOpenFatwaModal} />
      )}

      {currentSubTab === 'duas' && (
        <MasnoonDuasView onOpenFatwaModal={onOpenFatwaModal} />
      )}

      {currentSubTab === 'fatwas' && (
        /* 4. Two-Column Body Grid (Sidebar on Right, Questions / Fatwa Detail on Left in RTL) */
        <div className="w-full">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 lg:gap-6 items-start w-full">
            
            {/* Sidebar (Search & Ask Fatwa) */}
            <div className="lg:col-span-3 xl:col-span-3 space-y-4 order-2 lg:order-1 no-print">
              
              {/* Box 1: Search Form (عین نشر و اشاعت والے ڈیزائن میں) */}
              <div className="bg-[#FAF7F0] dark:bg-slate-900 border border-[#D5C7B2] dark:border-slate-800 rounded-xs shadow-xs overflow-hidden">
                
                {/* Header with Islamic geometric pattern */}
                <div 
                  className="bg-[#3C2E21] text-white px-4 py-3 flex items-center justify-start gap-2.5 border-b-2 border-[#B88A3B]"
                  style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg width='24' height='24' viewBox='0 0 24 24' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23B88A3B' fill-opacity='0.15'%3E%3Cpath d='M12 0l12 12-12 12L0 12 12 0zm0 3.5L3.5 12 12 20.5 20.5 12 12 3.5z'/%3E%3C/g%3E%3C/svg%3E")`
                  }}
                >
                  <Search className="w-5 h-5 text-[#B88A3B]" />
                  <h2 className={`text-lg sm:text-xl font-bold font-urdu tracking-wide ${headingFontClass}`}>
                    {t('search')}
                  </h2>
                </div>

                {/* Form Controls */}
                <form onSubmit={handleSearchSubmit} className="p-4 space-y-3 bg-[#FAF7F0] dark:bg-slate-900/60">
                  
                  {/* Keyword */}
                  <div>
                    <input
                      type="text"
                      value={keyword}
                      onChange={(e) => setKeyword(e.target.value)}
                      placeholder={language === 'ar' ? 'الكلمة المفتاحية...' : language === 'en' ? 'Keyword...' : 'مطلوبہ لفظ...'}
                      className={`w-full px-3 py-2 text-sm bg-white dark:bg-slate-800 border border-[#D2C2A7] dark:border-slate-700 rounded-xs text-stone-900 dark:text-stone-100 placeholder-stone-400 focus:outline-none focus:border-[#B88A3B] ${fontClass}`}
                    />
                  </div>

                  {/* Fatwa Number */}
                  <div>
                    <input
                      type="text"
                      value={fatwaNo}
                      onChange={(e) => setFatwaNo(e.target.value)}
                      placeholder={language === 'ar' ? 'رقم الفتوى...' : language === 'en' ? 'Fatwa No...' : 'فتویٰ نمبر...'}
                      className={`w-full px-3 py-2 text-sm bg-white dark:bg-slate-800 border border-[#D2C2A7] dark:border-slate-700 rounded-xs text-stone-900 dark:text-stone-100 placeholder-stone-400 focus:outline-none focus:border-[#B88A3B] ${fontClass}`}
                    />
                  </div>

                  {/* Category Selection */}
                  <div>
                    <select
                      value={selectedCategory}
                      onChange={(e) => setSelectedCategory(e.target.value)}
                      className={`w-full px-3 py-2 text-sm bg-white dark:bg-slate-800 border border-[#D2C2A7] dark:border-slate-700 rounded-xs text-stone-700 dark:text-stone-300 focus:outline-none focus:border-[#B88A3B] cursor-pointer ${fontClass}`}
                    >
                      <option value="">{language === 'ar' ? 'اختر القسم الشرعي' : language === 'en' ? 'Select Category' : 'شعبہ منتخب کریں'}</option>
                      <option value="ایمانیات و عقائد">{getLocalizedCategory('ایمانیات و عقائد', language)}</option>
                      <option value="نماز و طہارت">{getLocalizedCategory('نماز و طہارت', language)}</option>
                      <option value="روزہ و اعتکاف">{getLocalizedCategory('روزہ و اعتکاف', language)}</option>
                      <option value="زکوٰۃ و صدقات">{getLocalizedCategory('زکوٰۃ و صدقات', language)}</option>
                      <option value="حج و عمرہ">{getLocalizedCategory('حج و عمرہ', language)}</option>
                      <option value="نکاح و طلاق">{getLocalizedCategory('نکاح و طلاق', language)}</option>
                      <option value="بیوع و معاملات">{getLocalizedCategory('بیوع و معاملات', language)}</option>
                      <option value="متفرقات">{getLocalizedCategory('متفرقات', language)}</option>
                    </select>
                  </div>

                  {/* Chapter Selection */}
                  <div>
                    <select
                      value={selectedChapter}
                      onChange={(e) => setSelectedChapter(e.target.value)}
                      className={`w-full px-3 py-2 text-sm bg-white dark:bg-slate-800 border border-[#D2C2A7] dark:border-slate-700 rounded-xs text-stone-700 dark:text-stone-300 focus:outline-none focus:border-[#B88A3B] cursor-pointer ${fontClass}`}
                    >
                      <option value="">{language === 'ar' ? 'اختر الباب' : language === 'en' ? 'Select Chapter' : 'باب منتخب کریں'}</option>
                      <option value="کتاب الطہارۃ">{language === 'ar' ? 'كتاب الطهارة' : language === 'en' ? 'Book of Purification' : 'کتاب الطہارۃ'}</option>
                      <option value="کتاب الصلاۃ">{language === 'ar' ? 'كتاب الصلاة' : language === 'en' ? 'Book of Prayer' : 'کتاب الصلاۃ'}</option>
                      <option value="کتاب الزکاۃ">{language === 'ar' ? 'كتاب الزكاة' : language === 'en' ? 'Book of Zakat' : 'کتاب الزکاۃ'}</option>
                      <option value="کتاب الصوم">{language === 'ar' ? 'كتاب الصيام' : language === 'en' ? 'Book of Fasting' : 'کتاب الصوم'}</option>
                      <option value="کتاب النکاح">{language === 'ar' ? 'كتاب النكاح' : language === 'en' ? 'Book of Marriage' : 'کتاب النکاح'}</option>
                      <option value="کتاب البیوع">{language === 'ar' ? 'كتاب البيوع والمعاملات' : language === 'en' ? 'Book of Transactions' : 'کتاب البیوع'}</option>
                    </select>
                  </div>

                  {/* Sub-Chapter Selection */}
                  <div>
                    <select
                      value={selectedSubChapter}
                      onChange={(e) => setSelectedSubChapter(e.target.value)}
                      className={`w-full px-3 py-2 text-sm bg-white dark:bg-slate-800 border border-[#D2C2A7] dark:border-slate-700 rounded-xs text-stone-700 dark:text-stone-300 focus:outline-none focus:border-[#B88A3B] cursor-pointer ${fontClass}`}
                    >
                      <option value="">{language === 'ar' ? 'اختر الفرع' : language === 'en' ? 'Select Sub-topic' : 'ضمنی منتخب کریں'}</option>
                      <option value="احکامِ وضو">{language === 'ar' ? 'أحكام الوضوء' : language === 'en' ? 'Rulings of Wudu' : 'احکامِ وضو'}</option>
                      <option value="احکامِ امامت">{language === 'ar' ? 'أحكام الإمامة والجماعة' : language === 'en' ? 'Rulings of Leading Prayer' : 'احکامِ امامت'}</option>
                      <option value="بیعِ ادھار">{language === 'ar' ? 'البيع الآجل والتقسيط' : language === 'en' ? 'Credit & Deferred Sales' : 'بیعِ ادھار'}</option>
                      <option value="سونے چاندی کے احکام">{language === 'ar' ? 'أحكام الذهب والفضة' : language === 'en' ? 'Gold & Silver Rulings' : 'سونے چاندی کے احکام'}</option>
                    </select>
                  </div>

                  {/* Search Button */}
                  <div className="pt-1">
                    <button
                      type="submit"
                      className={`w-full py-2.5 px-4 bg-[#5C4632] hover:bg-[#483625] text-amber-100 font-bold text-sm rounded-xs transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-xs border border-[#B88A3B]/40 ${fontClass}`}
                    >
                      <Search className="w-4 h-4 text-[#B88A3B]" />
                      <span>{t('search')}</span>
                    </button>
                  </div>

                </form>
              </div>

              {/* Box 2: Ask Question / Submission (عین نشر و اشاعت والے ڈیزائن میں) */}
              <div className="bg-[#FAF7F0] dark:bg-slate-900 border border-[#D5C7B2] dark:border-slate-800 rounded-xs shadow-xs overflow-hidden">
                
                {/* Header with Islamic geometric pattern */}
                <div 
                  className="bg-[#3C2E21] text-white px-4 py-3 flex items-center justify-start gap-2.5 border-b-2 border-[#B88A3B]"
                  style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg width='24' height='24' viewBox='0 0 24 24' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23B88A3B' fill-opacity='0.15'%3E%3Cpath d='M12 0l12 12-12 12L0 12 12 0zm0 3.5L3.5 12 12 20.5 20.5 12 12 3.5z'/%3E%3C/g%3E%3C/svg%3E")`
                  }}
                >
                  <HelpCircle className="w-5 h-5 text-[#B88A3B]" />
                  <h2 className={`text-lg sm:text-xl font-bold font-urdu tracking-wide ${headingFontClass}`}>
                    {language === 'ar' ? 'طلب فتوى شرعية' : language === 'en' ? 'Ask a Question' : 'سوال پوچھیں'}
                  </h2>
                </div>

                {/* Body */}
                <div className="p-4 space-y-3 bg-[#FAF7F0] dark:bg-slate-900/60">
                  <p className={`text-xs sm:text-sm text-stone-700 dark:text-stone-300 leading-relaxed text-justify ${fontClass}`}>
                    {language === 'ar'
                      ? 'إذا لم تجد جواباً لمسألتك في هذا الأرشيف، يمكنك إرسال سؤالك مباشرة إلى دار الإفتاء بالجامعة الإسلامية.'
                      : language === 'en'
                      ? 'If you cannot find an answer to your query in this database, you may submit your question directly to Darul Ifta.'
                      : 'اگر آپ کے مطلوبہ سوال کا جواب اس ڈیٹا بیس میں نہ ملے تو آپ دار الافتاء سے براہِ راست سوال پوچھ سکتے ہیں۔'}
                  </p>

                  <div className="pt-2">
                    <button
                      type="button"
                      onClick={onOpenFatwaModal}
                      className={`w-full py-2.5 px-4 bg-[#5C4632] hover:bg-[#483625] text-amber-100 font-bold text-sm rounded-xs transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-xs border border-[#B88A3B]/40 ${fontClass}`}
                    >
                      <span>{language === 'ar' ? 'إرسال سؤال للفتوى' : language === 'en' ? 'Submit Question' : 'سوال پوچھیں'}</span>
                      <ChevronLeft className={`w-4 h-4 text-[#B88A3B] ${language === 'en' ? 'rotate-180' : ''}`} />
                    </button>
                  </div>
                </div>

              </div>

            </div>

            {/* Main Content: Either Ruled List of Questions OR Full Fatwa Detail View */}
            <div className="lg:col-span-9 xl:col-span-9 order-1 lg:order-2 w-full">
              
              {/* VIEW A: Single Fatwa Detail View */}
              {selectedFatwa ? (
                <div className="bg-white dark:bg-slate-900 rounded-lg p-2 sm:p-5 md:p-6 lg:p-7 space-y-5 sm:space-y-6 w-full">
                  
                  {/* Translation Notice Banner for English */}
                  {language === 'en' && (
                    <div className="no-print">
                      <FatwaTranslationBanner
                        isAiTranslated={selectedFatwa.isAiTranslatedEn || !selectedFatwa.isTranslationApproved}
                        isApproved={selectedFatwa.isTranslationApproved}
                        isTranslating={isTranslating}
                        showingOriginal={showingOriginal}
                        onToggleOriginal={() => setShowingOriginal(!showingOriginal)}
                        onRefreshTranslation={async () => {
                          if (!selectedFatwa) return;
                          setIsTranslating(true);
                          try {
                            const updated = await getOrTranslateFatwaEnglish(selectedFatwa, true);
                            setSelectedFatwa(updated);
                          } finally {
                            setIsTranslating(false);
                          }
                        }}
                      />
                    </div>
                  )}

                  {/* Fatwa Title with classical dividers */}
                  <div className="text-center py-2 space-y-2 border-b border-[#EADFCF] dark:border-slate-800">
                    <div className="text-xs text-stone-400 select-none">❖ ❖ ❖</div>
                    <h1 className={`text-xl sm:text-2xl font-black text-[#8C3A27] dark:text-[#E0B266] leading-relaxed ${showingOriginal ? 'font-urdu' : headingFontClass}`}>
                      {showingOriginal 
                        ? (selectedFatwa.title.ur || selectedFatwa.title.en) 
                        : getLocalizedText(selectedFatwa.title, language)}
                    </h1>
                    <div className="text-xs text-stone-400 select-none">❖ ❖ ❖</div>
                  </div>

                  {/* 3. Question Section */}
                  <div className="space-y-3">
                    <div className="w-full bg-[#FAF6EE] dark:bg-slate-800 px-4 sm:px-6 py-2.5 rounded-lg">
                      <span className={`font-black text-lg sm:text-xl md:text-2xl text-[#5C4632] dark:text-amber-200 leading-none ${showingOriginal ? 'font-urdu' : headingFontClass}`}>
                        {showingOriginal ? 'ســوال' : (language === 'ar' ? 'الســؤال' : language === 'en' ? 'Question' : 'ســوال')}
                      </span>
                    </div>
                    <div 
                      className={`px-2 sm:px-3 py-1 space-y-4 text-stone-900 dark:text-stone-100 text-base sm:text-lg md:text-[19px] leading-relaxed text-justify ${showingOriginal ? 'font-urdu' : fontClass}`}
                      dir={showingOriginal ? 'rtl' : dir}
                    >
                      {formatParagraphs(
                        showingOriginal 
                          ? (selectedFatwa.question.ur || selectedFatwa.question.en)
                          : getLocalizedText(selectedFatwa.question, language)
                      ).map((para, idx) => (
                        <p key={idx} className="leading-relaxed text-justify indent-6 sm:indent-8">
                          {para}
                        </p>
                      ))}
                    </div>
                  </div>

                  {/* 4. Answer Section */}
                  <div className="space-y-4 pt-2">
                    <div className="w-full bg-[#FAF6EE] dark:bg-slate-800 px-4 sm:px-6 py-2.5 rounded-lg flex items-center justify-center text-center">
                      <span 
                        className="font-black text-lg sm:text-xl md:text-2xl text-[#5C4632] dark:text-amber-200 leading-none text-center inline-block mx-auto font-arabic"
                      >
                        الْجَوَابُ بِاسْمِ مُلْهِمِ الصَّوَابْ
                      </span>
                    </div>
                    
                    <div 
                      className={`px-2 sm:px-3 py-1 space-y-4 text-stone-900 dark:text-stone-100 text-base sm:text-lg md:text-[19px] leading-relaxed text-justify ${showingOriginal ? 'font-urdu' : fontClass}`}
                      dir={showingOriginal ? 'rtl' : dir}
                    >
                      
                      {/* Rendered in distinct, well-spaced paragraphs with first-line indent */}
                      {formatParagraphs(
                        showingOriginal
                          ? (selectedFatwa.answer.ur || selectedFatwa.answer.en)
                          : getLocalizedText(selectedFatwa.answer, language), 
                        true
                      ).map((para, idx) => (
                        <p key={idx} className="leading-relaxed text-justify indent-6 sm:indent-8">
                          {para}
                        </p>
                      ))}

                      {/* Extract Katabahu and References cleanly */}
                      {(() => {
                        const { paragraphs, katabahu } = parseArabicReference(selectedFatwa.arabicText || '', selectedFatwa.answer.ur);
                        return (
                          <div className="pt-2 space-y-2.5">
                            {/* References / Dalail (if paragraphs exist) */}
                            {paragraphs.length > 0 && (
                              <>
                                <div className="w-full bg-[#FAF6EE] dark:bg-slate-800 px-4 sm:px-6 py-2.5 rounded-lg">
                                  <span 
                                    className="font-black text-lg sm:text-xl md:text-2xl text-[#5C4632] dark:text-amber-200 leading-none font-arabic"
                                  >
                                    وَالدَّلِيلُ عَلَى ذَلِكَ
                                  </span>
                                </div>
                                
                                <div 
                                  className="px-2 sm:px-3 pt-1 pb-0 font-arabic space-y-2 text-base sm:text-lg md:text-[19px] leading-[2.3] text-justify text-stone-800 dark:text-stone-200"
                                  dir="rtl"
                                >
                                  {paragraphs.map((arabicPara, aIdx) => (
                                    <p key={aIdx} className="leading-[2.3] font-arabic text-justify indent-6 sm:indent-8">
                                      {arabicPara}
                                    </p>
                                  ))}
                                </div>
                              </>
                            )}

                            {/* Concluding Row */}
                            <div className="pt-2 relative flex flex-col sm:flex-row items-center justify-center font-arabic min-h-[36px]">
                              <div className="text-center font-bold text-stone-800 dark:text-stone-200 text-base sm:text-lg md:text-[19px] leading-[2.0]">
                                {showingOriginal ? 'فقط والله تعالی اعلم بالصواب' : (language === 'ar' ? 'فقط والله تعالى أعلم بالصواب' : language === 'en' ? 'And Allah Almighty knows best' : 'فقط والله تعالی اعلم بالصواب')}
                              </div>
                              {katabahu && (
                                <div className="sm:absolute sm:left-0 text-left font-bold text-stone-800 dark:text-stone-200 text-base sm:text-lg md:text-[19px] leading-[2.0] pt-1 sm:pt-0">
                                  <span>{katabahu}</span>
                                </div>
                              )}
                            </div>
                          </div>
                        );
                      })()}

                    </div>
                  </div>

                  {/* 5. Bottom Metadata */}
                  <div className={`pt-4 border-t border-[#EADFCF] dark:border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs sm:text-sm text-stone-600 dark:text-stone-400 ${fontClass}`}>
                    <div>
                      <span>{language === 'ar' ? 'رقم الفتوى: ' : language === 'en' ? 'Fatwa No: ' : 'فتویٰ نمبر: '}</span>
                      <strong className="font-mono text-stone-800 dark:text-stone-200 dir-ltr inline-block">{selectedFatwa.fatwaNumber || selectedFatwa.id}</strong>
                    </div>
                    <div>
                      <span>{language === 'ar' ? 'دار الإفتاء: ' : language === 'en' ? 'Darul Ifta: ' : 'دار الافتاء: '}</span>
                      <strong className="text-[#5C4632] dark:text-amber-300">{language === 'ar' ? 'الجامعة الإسلامية أبت أباد' : language === 'en' ? 'Jamia Islamia Abbottabad' : 'جامعہ اسلامیہ ایبٹ آباد'}</strong>
                    </div>
                    <div>
                      <span>{language === 'ar' ? 'تاريخ الصدور: ' : language === 'en' ? 'Issue Date: ' : 'تاریخِ اجراء: '}</span>
                      <span>{selectedFatwa.date || '۱۹ اگست ۲۰۲۶ء'}</span>
                    </div>
                  </div>

                  {/* Bottom Actions & Navigation Bar */}
                  <div className="pt-4 border-t border-[#EADFCF] dark:border-slate-800 flex flex-wrap items-center justify-between gap-3 no-print">
                    <button
                      onClick={() => setSelectedFatwa(null)}
                      className={`py-2 px-5 bg-[#5C4632] hover:bg-[#483625] text-amber-100 text-sm font-bold rounded transition-colors cursor-pointer shadow-2xs inline-flex items-center gap-1.5 ${fontClass}`}
                    >
                      <ArrowRight className={`w-4 h-4 ${language === 'en' ? 'rotate-180' : ''}`} />
                      <span>{language === 'ar' ? 'العودة إلى قائمة الفتاوى' : language === 'en' ? 'Back to All Questions' : 'واپس تمام سوالات کی فہرست پر جائیں'}</span>
                    </button>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={handlePrint}
                        className={`px-3.5 py-1.5 bg-[#F4EFE6] dark:bg-slate-800 hover:bg-[#EAE0D0] text-[#5C4632] dark:text-amber-200 text-xs sm:text-sm font-bold rounded border border-[#D9CBB6] dark:border-slate-700 flex items-center gap-1.5 cursor-pointer transition-colors ${fontClass}`}
                      >
                        <Printer className="w-3.5 h-3.5" />
                        <span>{t('print')}</span>
                      </button>
                      <button
                        onClick={handleCopy}
                        className={`px-3.5 py-1.5 bg-[#F4EFE6] dark:bg-slate-800 hover:bg-[#EAE0D0] text-[#5C4632] dark:text-amber-200 text-xs sm:text-sm font-bold rounded border border-[#D9CBB6] dark:border-slate-700 flex items-center gap-1.5 cursor-pointer transition-colors ${fontClass}`}
                      >
                        {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                        <span>{copied ? (language === 'en' ? 'Copied' : language === 'ar' ? 'تم النسخ' : 'کاپی ہو گیا') : (language === 'en' ? 'Copy Link' : language === 'ar' ? 'نسخ الرابط' : 'لنک')}</span>
                      </button>
                    </div>
                  </div>

                </div>
              ) : (
                /* VIEW B: Ruled List of Questions */
                <div className="bg-white dark:bg-slate-900 border border-[#D9CBB6] dark:border-slate-800 rounded-lg p-5 sm:p-7 shadow-xs space-y-4">
                  
                  {/* Section Header */}
                  <div className="pb-3 border-b border-[#D5C6AC] dark:border-slate-800">
                    <h2 className={`text-2xl sm:text-3xl font-black text-[#5C4632] dark:text-[#E0B266] ${headingFontClass}`}>
                      {language === 'ar' ? 'أحدث الأسئلة والفتاوى' : language === 'en' ? 'Recent Questions & Inquiries' : 'نئے سوالات'}
                    </h2>
                  </div>

                  {/* Question Rows List */}
                  <div className="divide-y divide-[#EADFCF] dark:divide-slate-800">
                    {filteredFatwas.length === 0 ? (
                      <div className="py-12 text-center space-y-2">
                        <p className={`text-stone-600 dark:text-stone-400 text-base ${fontClass}`}>
                          {language === 'ar' ? 'لم يتم العثور على فتاوى مطابقة للبحث.' : language === 'en' ? 'No matching questions or fatwas found.' : 'مطلوبہ تلاش کے مطابق کوئی سوال یا فتویٰ نہیں ملا۔'}
                        </p>
                        <button
                          onClick={() => {
                            setKeyword('');
                            setFatwaNo('');
                            setSelectedCategory('');
                            setSelectedChapter('');
                            setSelectedSubChapter('');
                            setAppliedFilter({ keyword: '', fatwaNo: '', category: '', chapter: '', subChapter: '' });
                          }}
                          className={`text-xs text-[#5C4632] dark:text-amber-400 underline cursor-pointer ${fontClass}`}
                        >
                          {language === 'ar' ? 'عرض جميع الأسئلة' : language === 'en' ? 'Reset search & show all' : 'تمام سوالات دوبارہ دکھائیں'}
                        </button>
                      </div>
                    ) : (
                      filteredFatwas.map((fatwa, index) => (
                        <div
                          key={fatwa.id}
                          onClick={() => {
                            setSelectedFatwa(fatwa);
                            window.scrollTo({ top: 120, behavior: 'smooth' });
                          }}
                          className="py-3 sm:py-3.5 px-2 hover:bg-[#FAF6EE] dark:hover:bg-slate-800/60 rounded transition-colors cursor-pointer group flex items-baseline gap-3"
                        >
                          {/* Numbering badge [1] */}
                          <span className="text-[#8C6226] dark:text-amber-400 font-bold font-mono text-sm sm:text-base shrink-0 select-none">
                            [{toDisplayNumeral(index + 1)}]
                          </span>

                          {/* Question Title */}
                          <h3 className={`text-stone-800 dark:text-stone-200 group-hover:text-[#5C4632] dark:group-hover:text-[#E0B266] text-base sm:text-lg leading-relaxed font-semibold transition-colors flex-1 ${fontClass}`}>
                            {getLocalizedText(fatwa.title, language)}
                          </h3>
                        </div>
                      ))
                    )}
                  </div>

                </div>
              )}

            </div>

          </div>
        </div>
      )}

    </div>
  );
};
