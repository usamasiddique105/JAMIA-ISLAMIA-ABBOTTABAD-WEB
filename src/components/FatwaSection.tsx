import React, { useState, useEffect } from 'react';
import { Fatwa } from '../types';
import { StorageService } from '../services/storage';
import { Search, HelpCircle, ChevronLeft, ArrowRight, Printer, Share2, Copy, Check } from 'lucide-react';
import { JAMIA_HEADER_LOGO_DATA_URI } from '../assets/logoBase64';
import { DARUL_IFTA_WHITE_LOGO_DATA_URI } from '../assets/darulIftaLogoBase64';
import headerLogoCalligraphy from '../assets/images/jamia_logo_calligraphy_transparent.png';
import darulIftaCleanWhite from '../assets/images/darulifta_clean_white.png';

interface FatwaSectionProps {
  activeTabId?: string;
  onSelectTab?: (tabId: string) => void;
  onOpenFatwaModal: () => void;
}

// Helper function to smartly format Urdu text into structured, distinct paragraphs
const formatUrduParagraphs = (rawText: string, isAnswer = false): string[] => {
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
  onOpenFatwaModal,
}) => {
  const [fatwas, setFatwas] = useState<Fatwa[]>([]);
  const [selectedFatwa, setSelectedFatwa] = useState<Fatwa | null>(null);
  const [copied, setCopied] = useState(false);

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
      const matchTitle = f.title.ur.toLowerCase().includes(qKey);
      const matchQuestion = f.question.ur.toLowerCase().includes(qKey);
      const matchAnswer = f.answer.ur.toLowerCase().includes(qKey);
      const matchFatwaNo = f.fatwaNumber.toLowerCase().includes(qKey);
      if (!matchTitle && !matchQuestion && !matchAnswer && !matchFatwaNo) {
        return false;
      }
    }

    return true;
  });

  // Arabic numerals helper
  const toUrduNumeral = (num: number): string => {
    const urduDigits = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];
    return num.toString().split('').map(d => urduDigits[parseInt(d, 10)] || d).join('');
  };

  return (
    <div className="w-full bg-white dark:bg-slate-950 py-2 sm:py-4 font-urdu text-right" dir="rtl">
      
      {/* 1. Official Institutional Fatwa Header Box (Featuring User's Exact Calligraphy Logo Banner) */}
      <div className="w-full mb-3 sm:mb-6 no-print">
        <div className="relative bg-[#3D2919] text-white rounded-lg px-3 sm:px-6 py-2 sm:py-5 md:py-6 overflow-hidden flex items-center justify-center min-h-[56px] sm:min-h-[90px] md:min-h-[110px]" dir="rtl">
          {/* Subtle Background Motif */}
          <div className="absolute inset-0 opacity-5 pointer-events-none bg-[radial-gradient(#FFFFFF_1px,transparent_1px)] [background-size:16px_16px]" />

          {/* User's Exact Single Continuous Calligraphy Banner: "دارالافتاء الجامعة الاسلامية ايبت آباد" */}
          <div className="relative z-10 flex items-center justify-center text-center select-none w-full py-0.5 sm:py-1">
            <img 
              src={DARUL_IFTA_WHITE_LOGO_DATA_URI || darulIftaCleanWhite} 
              alt="دارالافتاء الجامعة الاسلامية ايبت آباد" 
              className="w-full max-w-2xl sm:max-w-3xl h-auto max-h-11 sm:max-h-20 md:max-h-24 object-contain mx-auto select-none drop-shadow-md"
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

      {/* 2. Two-Column Body Grid (Sidebar on Right, Questions / Fatwa Detail on Left in RTL) */}
      <div className="w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 lg:gap-6 items-start w-full">
          
          {/* Right Sidebar (تلاش & سوال پوچھیں) - Sleek & Compact Width (On mobile placed below content) */}
          <div className="lg:col-span-3 xl:col-span-3 space-y-4 order-2 lg:order-1 no-print">
            
            {/* Box 1: تلاش (Search Form) */}
            <div className="bg-white dark:bg-slate-900 border border-[#D9CBB6] dark:border-slate-800 rounded-lg shadow-xs overflow-hidden">
              
              {/* Header */}
              <div className="bg-[#5C4632] text-amber-100 px-4 py-2.5 flex items-center justify-start gap-2 border-b border-[#4A3725]">
                <Search className="w-4 h-4 text-amber-200" />
                <h2 className="text-base font-bold font-urdu">
                  تلاش
                </h2>
              </div>

              {/* Form Controls */}
              <form onSubmit={handleSearchSubmit} className="p-4 space-y-3 bg-[#FCFAF6] dark:bg-slate-900/60">
                
                {/* مطلوبہ لفظ */}
                <div>
                  <input
                    type="text"
                    value={keyword}
                    onChange={(e) => setKeyword(e.target.value)}
                    placeholder="مطلوبہ لفظ"
                    className="w-full px-3 py-2 text-sm bg-white dark:bg-slate-800 border border-[#D2C2A7] dark:border-slate-700 rounded text-stone-900 dark:text-stone-100 placeholder-stone-400 font-urdu focus:outline-none focus:border-[#5C4632]"
                  />
                </div>

                {/* فتویٰ نمبر */}
                <div>
                  <input
                    type="text"
                    value={fatwaNo}
                    onChange={(e) => setFatwaNo(e.target.value)}
                    placeholder="فتویٰ نمبر"
                    className="w-full px-3 py-2 text-sm bg-white dark:bg-slate-800 border border-[#D2C2A7] dark:border-slate-700 rounded text-stone-900 dark:text-stone-100 placeholder-stone-400 font-urdu focus:outline-none focus:border-[#5C4632]"
                  />
                </div>

                {/* شعبہ منتخب کریں */}
                <div>
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="w-full px-3 py-2 text-sm bg-white dark:bg-slate-800 border border-[#D2C2A7] dark:border-slate-700 rounded text-stone-700 dark:text-stone-300 font-urdu focus:outline-none focus:border-[#5C4632] cursor-pointer"
                  >
                    <option value="">شعبہ منتخب کریں</option>
                    <option value="ایمانیات و عقائد">ایمانیات و عقائد</option>
                    <option value="نماز و طہارت">نماز و طہارت</option>
                    <option value="روزہ و اعتکاف">روزہ و اعتکاف</option>
                    <option value="زکوٰۃ و صدقات">زکوٰۃ و صدقات</option>
                    <option value="حج و عمرہ">حج و عمرہ</option>
                    <option value="نکاح و طلاق">نکاح و طلاق</option>
                    <option value="بیوع و معاملات">بیوع و معاملات</option>
                    <option value="متفرقات">متفرقات</option>
                  </select>
                </div>

                {/* باب منتخب کریں */}
                <div>
                  <select
                    value={selectedChapter}
                    onChange={(e) => setSelectedChapter(e.target.value)}
                    className="w-full px-3 py-2 text-sm bg-white dark:bg-slate-800 border border-[#D2C2A7] dark:border-slate-700 rounded text-stone-700 dark:text-stone-300 font-urdu focus:outline-none focus:border-[#5C4632] cursor-pointer"
                  >
                    <option value="">باب منتخب کریں</option>
                    <option value="کتاب الطہارۃ">کتاب الطہارۃ</option>
                    <option value="کتاب الصلاۃ">کتاب الصلاۃ</option>
                    <option value="کتاب الزکاۃ">کتاب الزکاۃ</option>
                    <option value="کتاب الصوم">کتاب الصوم</option>
                    <option value="کتاب النکاح">کتاب النکاح</option>
                    <option value="کتاب البیوع">کتاب البیوع</option>
                  </select>
                </div>

                {/* ضمنی منتخب کریں */}
                <div>
                  <select
                    value={selectedSubChapter}
                    onChange={(e) => setSelectedSubChapter(e.target.value)}
                    className="w-full px-3 py-2 text-sm bg-white dark:bg-slate-800 border border-[#D2C2A7] dark:border-slate-700 rounded text-stone-700 dark:text-stone-300 font-urdu focus:outline-none focus:border-[#5C4632] cursor-pointer"
                  >
                    <option value="">ضمنی منتخب کریں</option>
                    <option value="احکامِ وضو">احکامِ وضو</option>
                    <option value="احکامِ امامت">احکامِ امامت</option>
                    <option value="بیعِ ادھار">بیعِ ادھار</option>
                    <option value="سونے چاندی کے احکام">سونے چاندی کے احکام</option>
                  </select>
                </div>

                {/* تلاش کریں Button */}
                <div className="pt-1">
                  <button
                    type="submit"
                    className="w-full py-2 px-4 bg-[#5C4632] hover:bg-[#483625] text-amber-100 font-bold text-sm rounded transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-2xs"
                  >
                    <Search className="w-4 h-4" />
                    <span>تلاش کریں</span>
                  </button>
                </div>

              </form>
            </div>

            {/* Box 2: سوال پوچھیں (Ask Question Box) */}
            <div className="bg-white dark:bg-slate-900 border border-[#D9CBB6] dark:border-slate-800 rounded-lg shadow-xs overflow-hidden">
              
              {/* Header */}
              <div className="bg-[#5C4632] text-amber-100 px-4 py-2.5 flex items-center justify-start gap-2 border-b border-[#4A3725]">
                <HelpCircle className="w-4 h-4 text-amber-200" />
                <h2 className="text-base font-bold font-urdu">
                  سوال پوچھیں
                </h2>
              </div>

              {/* Body */}
              <div className="p-4 space-y-3 bg-[#FCFAF6] dark:bg-slate-900/60">
                <p className="text-xs sm:text-sm text-stone-700 dark:text-stone-300 leading-relaxed font-urdu text-justify">
                  اگر آپ کے مطلوبہ سوال کا جواب اس ڈیٹا بیس میں نہ ملے تو آپ دار الافتاء سے براہِ راست سوال پوچھ سکتے ہیں۔ سوال ارسال کرنے کے بعد کچھ دیر انتظار کریں، سوالات کی کثرت کی وجہ سے جواب جاری ہونے میں کم از کم چند دن کا وقت لگ سکتا ہے۔
                </p>

                <div className="pt-2">
                  <button
                    type="button"
                    onClick={onOpenFatwaModal}
                    className="w-full py-2 px-4 bg-[#5C4632] hover:bg-[#483625] text-amber-100 font-bold text-sm rounded transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-2xs"
                  >
                    <span>سوال پوچھیں</span>
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                </div>
              </div>

            </div>

          </div>

          {/* Left Main Content: Either Ruled List of Questions OR Full Fatwa Detail View (Order-1 on mobile) */}
          <div className="lg:col-span-9 xl:col-span-9 order-1 lg:order-2 w-full">
            
            {/* VIEW A: Single Fatwa Detail View (Matching User's Screenshot Exactly) */}
            {selectedFatwa ? (
              <div className="bg-white dark:bg-slate-900 rounded-lg p-2 sm:p-5 md:p-6 lg:p-7 space-y-5 sm:space-y-6 w-full">
                
                {/* Fatwa Title with classical dividers */}
                <div className="text-center py-2 space-y-2 border-b border-[#EADFCF] dark:border-slate-800">
                  <div className="text-xs text-stone-400 select-none">❖ ❖ ❖</div>
                  <h1 className="text-xl sm:text-2xl font-black text-[#8C3A27] dark:text-[#E0B266] font-urdu leading-relaxed">
                    {selectedFatwa.title.ur}
                  </h1>
                  <div className="text-xs text-stone-400 select-none">❖ ❖ ❖</div>
                </div>

                {/* 3. سوال (Question Section with Elongated Card & Plain Clean Background) */}
                <div className="space-y-3">
                  <div className="w-full bg-[#FAF6EE] dark:bg-slate-800 px-4 sm:px-6 py-2.5 rounded-lg">
                    <span className="font-black text-lg sm:text-xl md:text-2xl text-[#5C4632] dark:text-amber-200 font-urdu leading-none">
                      ســوال
                    </span>
                  </div>
                  <div className="px-2 sm:px-3 py-1 space-y-4 text-stone-900 dark:text-stone-100 text-base sm:text-lg md:text-[19px] leading-[2.5] font-urdu text-justify">
                    {formatUrduParagraphs(selectedFatwa.question.ur).map((para, idx) => (
                      <p key={idx} className="leading-[2.5] text-justify indent-6 sm:indent-8">
                        {para}
                      </p>
                    ))}
                  </div>
                </div>

                {/* 4. جواب (Answer Section with Elongated Arabic Card & Plain Clean Background) */}
                <div className="space-y-4 pt-2">
                  <div className="w-full bg-[#FAF6EE] dark:bg-slate-800 px-4 sm:px-6 py-2.5 rounded-lg flex items-center justify-center text-center">
                    <span 
                      className="font-black text-lg sm:text-xl md:text-2xl text-[#5C4632] dark:text-amber-200 leading-none text-center inline-block mx-auto"
                      style={{ fontFamily: "'Amiri', 'Traditional Arabic', 'Noto Naskh Arabic', serif" }}
                    >
                      الْجَوَابُ بِاسْمِ مُلْهِمِ الصَّوَابْ
                    </span>
                  </div>
                  
                  <div className="px-2 sm:px-3 py-1 space-y-4 text-stone-900 dark:text-stone-100 text-base sm:text-lg md:text-[19px] leading-[2.5] font-urdu text-justify">
                    
                    {/* Rendered in distinct, well-spaced paragraphs with first-line indent */}
                    {formatUrduParagraphs(selectedFatwa.answer.ur, true).map((para, idx) => (
                      <p key={idx} className="leading-[2.5] text-justify indent-6 sm:indent-8">
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

                          {/* Concluding Row: 'فقط واللہ تعالیٰ اعلم بالصواب' in Center and 'کتبہ: [نام]' on Opposite Far Left Corner */}
                          <div className="pt-2 relative flex flex-col sm:flex-row items-center justify-center font-arabic min-h-[36px]">
                            <div className="text-center font-bold text-stone-800 dark:text-stone-200 text-base sm:text-lg md:text-[19px] leading-[2.0]">
                              فقط والله تعالی اعلم بالصواب
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

                {/* 5. Bottom Metadata & Mufti Stamp (Matching Screenshot) */}
                <div className="pt-4 border-t border-[#EADFCF] dark:border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs sm:text-sm text-stone-600 dark:text-stone-400 font-urdu">
                  <div>
                    <span>فتویٰ نمبر: </span>
                    <strong className="font-mono text-stone-800 dark:text-stone-200 dir-ltr inline-block">{selectedFatwa.fatwaNumber || selectedFatwa.id}</strong>
                  </div>
                  <div>
                    <span>دار الافتاء: </span>
                    <strong className="text-[#5C4632] dark:text-amber-300">جامعہ اسلامیہ ایبٹ آباد</strong>
                  </div>
                  <div>
                    <span>تاریخِ اجراء: </span>
                    <span>{selectedFatwa.date || '۱۹ اگست ۲۰۲۶ء'}</span>
                  </div>
                </div>

                {/* Bottom Actions & Navigation Bar */}
                <div className="pt-4 border-t border-[#EADFCF] dark:border-slate-800 flex flex-wrap items-center justify-between gap-3 no-print">
                  <button
                    onClick={() => setSelectedFatwa(null)}
                    className="py-2 px-5 bg-[#5C4632] hover:bg-[#483625] text-amber-100 text-sm font-bold rounded transition-colors cursor-pointer shadow-2xs font-urdu inline-flex items-center gap-1.5"
                  >
                    <ArrowRight className="w-4 h-4" />
                    <span>واپس تمام سوالات کی فہرست پر جائیں</span>
                  </button>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={handlePrint}
                      className="px-3.5 py-1.5 bg-[#F4EFE6] dark:bg-slate-800 hover:bg-[#EAE0D0] text-[#5C4632] dark:text-amber-200 text-xs sm:text-sm font-bold rounded border border-[#D9CBB6] dark:border-slate-700 flex items-center gap-1.5 cursor-pointer transition-colors"
                    >
                      <Printer className="w-3.5 h-3.5" />
                      <span>پرنٹ</span>
                    </button>
                    <button
                      onClick={handleCopy}
                      className="px-3.5 py-1.5 bg-[#F4EFE6] dark:bg-slate-800 hover:bg-[#EAE0D0] text-[#5C4632] dark:text-amber-200 text-xs sm:text-sm font-bold rounded border border-[#D9CBB6] dark:border-slate-700 flex items-center gap-1.5 cursor-pointer transition-colors"
                    >
                      {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copied ? 'کاپی ہو گیا' : 'لنک'}</span>
                    </button>
                  </div>
                </div>

              </div>
            ) : (
              /* VIEW B: Ruled List of Questions */
              <div className="bg-white dark:bg-slate-900 border border-[#D9CBB6] dark:border-slate-800 rounded-lg p-5 sm:p-7 shadow-xs space-y-4">
                
                {/* Section Header */}
                <div className="pb-3 border-b border-[#D5C6AC] dark:border-slate-800">
                  <h2 className="text-2xl sm:text-3xl font-black text-[#5C4632] dark:text-[#E0B266] font-urdu">
                    نئے سوالات
                  </h2>
                </div>

                {/* Question Rows List */}
                <div className="divide-y divide-[#EADFCF] dark:divide-slate-800">
                  {filteredFatwas.length === 0 ? (
                    <div className="py-12 text-center space-y-2">
                      <p className="text-stone-600 dark:text-stone-400 font-urdu text-base">
                        مطلوبہ تلاش کے مطابق کوئی سوال یا فتویٰ نہیں ملا۔
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
                        className="text-xs text-[#5C4632] dark:text-amber-400 underline font-urdu cursor-pointer"
                      >
                        تمام سوالات دوبارہ دکھائیں
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
                          [{toUrduNumeral(index + 1)}]
                        </span>

                        {/* Question Title */}
                        <h3 className="text-stone-800 dark:text-stone-200 group-hover:text-[#5C4632] dark:group-hover:text-[#E0B266] font-urdu text-base sm:text-lg leading-relaxed font-semibold transition-colors flex-1">
                          {fatwa.title.ur}
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

    </div>
  );
};
