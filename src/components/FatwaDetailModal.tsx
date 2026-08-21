import React, { useState } from 'react';
import { Fatwa } from '../types';
import { useThemeLanguage } from '../context/ThemeLanguageContext';
import { X, Printer, Share2, Copy, Check, BookOpen, Tag, Calendar, ShieldCheck } from 'lucide-react';

interface FatwaDetailModalProps {
  fatwa: Fatwa | null;
  onClose: () => void;
}

// Helper function to smartly format Urdu text into structured, distinct paragraphs
const formatUrduParagraphs = (rawText: string, isAnswer = false): string[] => {
  if (!rawText) return [];
  let text = rawText.trim();
  
  if (isAnswer) {
    text = text.replace(/^(الْجَوَابُ\s*بِاسْمِ\s*مُلْهِمِ\s*الصَّوَابْ|الجواب\s*باسم\s*ملہم\s*الصواب|الجواب\s*باسم\s*ملهم\s*الصواب|الجواب\s*باسم\s*ملھم\s*الصواب|الجواب\s*وباللہ\s*التوفیق|الجواب\s*وباللہ\s*التوفیق:)[\s:،-]*\n*/iu, '').trim();
  }

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

export const FatwaDetailModal: React.FC<FatwaDetailModalProps> = ({ fatwa, onClose }) => {
  const { language, t } = useThemeLanguage();
  const [copied, setCopied] = useState(false);

  if (!fatwa) return null;

  const handlePrint = () => {
    window.print();
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-2 sm:p-4 bg-slate-950/80 backdrop-blur-xs overflow-y-auto" dir="rtl">
      <div className="bg-[#FCFAF6] dark:bg-slate-900 text-stone-900 dark:text-stone-100 rounded-2xl max-w-4xl w-full border-2 border-[#D5C29E] dark:border-slate-800 shadow-2xl overflow-hidden my-4 max-h-[92vh] flex flex-col font-urdu">
        
        {/* Top Control Bar (No Print) */}
        <div className="bg-[#3D2817] dark:bg-slate-950 text-amber-100 p-3 px-5 flex items-center justify-between border-b border-[#B88A3B]/40 no-print">
          <div className="flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-[#E0B266]" />
            <span className="font-bold text-xs sm:text-sm font-urdu">
              دار الافتاء - فتویٰ ریکارڈ نمبر: <strong className="font-mono text-[#E0B266] dir-ltr inline-block">{fatwa.fatwaNumber}</strong>
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button 
              onClick={handlePrint}
              className="p-1.5 rounded-lg bg-[#5C4632] hover:bg-[#6D533C] text-amber-200 text-xs flex items-center gap-1.5 px-3 border border-[#B88A3B]/40 transition-colors cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>پرنٹ کریں</span>
            </button>
            <button 
              onClick={handleCopyLink}
              className="p-1.5 rounded-lg bg-[#5C4632] hover:bg-[#6D533C] text-amber-200 text-xs flex items-center gap-1.5 px-3 border border-[#B88A3B]/40 transition-colors cursor-pointer"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'کاپی ہو گیا' : 'لنک کاپی'}</span>
            </button>
            <button 
              onClick={onClose}
              className="p-1.5 rounded-lg bg-[#2A1B0E] hover:bg-[#3D2817] text-amber-200 cursor-pointer"
              title="بند کریں"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Official Fatwa Document Body */}
        <div className="p-4 sm:p-8 space-y-6 overflow-y-auto flex-1 bg-[#FCFAF6] dark:bg-slate-900">
          
          {/* 1. Classical Darul Ifta Institutional Banner (Matching Screenshot) */}
          <div className="relative bg-[#2D1C10] text-[#E0B266] rounded-xl p-4 sm:p-6 text-center overflow-hidden">
            {/* Background Islamic Watermark Motif */}
            <div className="absolute inset-0 opacity-10 pointer-events-none flex items-center justify-center font-arabic text-6xl font-black">
              جامعة اسلامية
            </div>
            
            <div className="relative z-10 flex flex-col items-center justify-center space-y-1 sm:space-y-2">
              <div className="text-2xl sm:text-4xl font-black font-arabic text-amber-100 tracking-wide drop-shadow-xs">
                دَارُ الإِفْتَاءِ
              </div>
              <div className="text-lg sm:text-2xl font-bold font-arabic text-[#E0B266]">
                جَامِعَةُ الإِسْلَامِيَّةِ أَيَبْتْ آبَادْ - بَاكِسْتَان
              </div>
              <div className="text-xs sm:text-sm font-urdu text-amber-200/80">
                مرکز علومِ اسلامیہ و دار الافتاء والارشاد (المعروف بدار الافتاء ایبٹ آباد)
              </div>
            </div>
          </div>

          {/* 2. Classical Title Box */}
          <div className="bg-white dark:bg-slate-800/90 rounded-xl p-4 sm:p-5 text-center">
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-black text-[#3D2817] dark:text-[#E0B266] font-urdu leading-snug">
              {fatwa.title.ur}
            </h1>
            {language === 'en' && fatwa.title.en && (
              <p className="text-xs sm:text-sm text-stone-500 dark:text-stone-400 mt-1 italic font-sans">{fatwa.title.en}</p>
            )}
          </div>

          {/* 3. Question (سوال) Section */}
          <div className="space-y-3">
            <div className="w-full bg-[#FAF6EE] dark:bg-slate-800 px-4 sm:px-6 py-2.5 rounded-lg flex items-center justify-between">
              <span className="font-black text-lg sm:text-xl md:text-2xl text-[#5C4632] dark:text-amber-200 font-urdu leading-none">
                ســوال
              </span>
              {fatwa.questionerName && (
                <span className="text-xs text-stone-500 dark:text-stone-400">
                  (سائل: {fatwa.questionerName})
                </span>
              )}
            </div>
            <div className="px-2 sm:px-3 py-1 space-y-4 text-stone-900 dark:text-stone-100 text-base sm:text-lg md:text-[19px] leading-[2.5] font-urdu text-justify">
              {formatUrduParagraphs(fatwa.question.ur).map((para, idx) => (
                <p key={idx} className="leading-[2.5] text-justify indent-6 sm:indent-8">
                  {para}
                </p>
              ))}
            </div>
          </div>

          {/* 4. Answer (جواب) Section */}
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
              
              {/* Main Ruling Body Rendered in Distinct Paragraphs with first-line indent */}
              {formatUrduParagraphs(fatwa.answer.ur, true).map((para, idx) => (
                <p key={idx} className="leading-[2.5] text-justify indent-6 sm:indent-8">
                  {para}
                </p>
              ))}

              {/* Extract Katabahu and References cleanly */}
              {(() => {
                const { paragraphs, katabahu } = parseArabicReference(fatwa.arabicText || '', fatwa.answer.ur);
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

              {language === 'en' && fatwa.answer.en && (
                <div className="pt-3 border-t border-stone-200 dark:border-slate-700 text-xs text-stone-600 dark:text-stone-400 leading-relaxed font-sans" dir="ltr">
                  <strong className="text-emerald-800 dark:text-emerald-400">English Summary: </strong>
                  {fatwa.answer.en}
                </div>
              )}
            </div>
          </div>

          {/* 5. Bottom Metadata Strip & Categories (Matching Screenshot Layout) */}
          <div className="bg-white dark:bg-slate-800/80 rounded-xl p-4 border border-[#D5C29E] dark:border-slate-700 shadow-2xs space-y-3 text-xs sm:text-sm">
            <div className="flex flex-wrap items-center justify-between gap-3 text-stone-700 dark:text-stone-300 font-urdu border-b border-stone-200 dark:border-slate-700 pb-3">
              <div>
                <strong>دار الافتاء:</strong> <span>جامعہ اسلامیہ ایبٹ آباد</span>
              </div>
              <div>
                <strong>فتویٰ نمبر:</strong> <span className="font-mono font-bold text-[#5C4632] dark:text-[#E0B266]">{fatwa.fatwaNumber || fatwa.id}</span>
              </div>
              <div>
                <strong>تاریخِ فتویٰ:</strong> <span>{fatwa.date}</span>
              </div>
            </div>

            {/* Category Tags */}
            <div className="flex flex-wrap items-center gap-2 pt-1">
              <span className="text-stone-500 font-bold text-xs flex items-center gap-1">
                <Tag className="w-3.5 h-3.5 text-[#B88A3B]" />
                متعلقہ ابواب:
              </span>
              <span className="px-3 py-1 rounded-md bg-[#FAF7F0] dark:bg-slate-700 text-stone-800 dark:text-stone-200 border border-[#D5C29E] dark:border-slate-600 text-xs font-urdu">
                {fatwa.category}
              </span>
              {fatwa.category === 'نماز' || fatwa.category === 'Worship & Prayer' ? (
                <>
                  <span className="px-3 py-1 rounded-md bg-[#FAF7F0] dark:bg-slate-700 text-stone-800 dark:text-stone-200 border border-[#D5C29E] dark:border-slate-600 text-xs font-urdu">
                    نماز کی جماعت
                  </span>
                  <span className="px-3 py-1 rounded-md bg-[#FAF7F0] dark:bg-slate-700 text-stone-800 dark:text-stone-200 border border-[#D5C29E] dark:border-slate-600 text-xs font-urdu">
                    جماعت کا شرعی حکم
                  </span>
                </>
              ) : null}
            </div>
          </div>

          {/* 6. Action Button Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-2 no-print">
            <div className="text-xs text-stone-500 font-mono">
              کل مشاہدات: {fatwa.views} views
            </div>
            <div className="flex items-center gap-2">
              <button 
                onClick={handlePrint}
                className="px-4 py-2 bg-[#5C4632] hover:bg-[#4A3828] text-amber-100 rounded-lg text-xs font-bold font-urdu flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>پرنٹ کریں (Print)</span>
              </button>
              <button 
                onClick={onClose}
                className="px-4 py-2 bg-stone-200 dark:bg-slate-700 hover:bg-stone-300 dark:hover:bg-slate-600 text-stone-800 dark:text-stone-200 rounded-lg text-xs font-bold font-urdu transition-colors cursor-pointer"
              >
                بند کریں
              </button>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};

