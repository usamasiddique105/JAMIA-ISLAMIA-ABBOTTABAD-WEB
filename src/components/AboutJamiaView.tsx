import React from 'react';
import { useThemeLanguage } from '../context/ThemeLanguageContext';
import headerLogoCalligraphy from '../assets/images/jamia_logo_calligraphy_transparent.png';
import { JAMIA_HEADER_LOGO_DATA_URI } from '../assets/logoBase64';
import { 
  BookOpen, 
  FileText, 
  Building2, 
  Target, 
  UserCheck, 
  ShieldCheck, 
  GraduationCap, 
  Landmark, 
  ChevronLeft,
  ChevronRight,
  Bookmark
} from 'lucide-react';

interface AboutJamiaViewProps {
  activeTabId?: string;
  onSelectTab?: (tabId: string) => void;
}

export const AboutJamiaView: React.FC<AboutJamiaViewProps> = ({
  activeTabId = 'about-overview',
  onSelectTab,
}) => {
  const { language } = useThemeLanguage();
  const isEn = language === 'en';
  const isAr = language === 'ar';

  // Typography helpers based on active language
  const textFontClass = isAr ? 'font-arabic' : isEn ? 'font-sans' : 'font-urdu';
  const headingFontClass = isAr ? 'font-arabic' : isEn ? 'font-sans' : 'font-urdu';
  const lineSpacingClass = isAr ? 'leading-[2.1]' : isEn ? 'leading-relaxed' : 'leading-[2.5]';

  // Mapping tab IDs to sections
  const getSectionFromTabId = (tabId: string): string => {
    if (tabId === 'about-founder') return 'founder';
    if (tabId === 'about-purpose' || tabId === 'about-objectives') return 'objectives';
    if (tabId === 'about-administration') return 'administration';
    if (tabId === 'about-rules') return 'rules';
    if (tabId === 'about-expenses') return 'expenses';
    if (tabId === 'about-departments') return 'departments';
    if (tabId === 'about-overview' || tabId === 'about') return 'overview';
    return 'overview';
  };

  const currentSection = getSectionFromTabId(activeTabId);

  const handleLinkClick = (sectionId: string, tabTarget?: string) => {
    if (onSelectTab) {
      if (tabTarget) {
        onSelectTab(tabTarget);
      } else {
        onSelectTab(`about-${sectionId}`);
      }
    }
  };

  // Informational Links List (معلوماتی لنکس)
  const infoLinks = [
    {
      id: 'overview',
      tabTarget: 'about-overview',
      labelUrdu: 'تعارفِ جامعہ',
      labelArabic: 'تعريف بالجامعة',
      labelEnglish: 'About Jamia',
      icon: Bookmark
    },
    {
      id: 'founder',
      tabTarget: 'about-founder',
      labelUrdu: 'حضرت بانیِ جامعہ رحمہ اللہ',
      labelArabic: 'مؤسس الجامعة رحمه الله',
      labelEnglish: 'Founder of Jamia',
      icon: UserCheck
    },
    {
      id: 'objectives',
      tabTarget: 'about-objectives',
      labelUrdu: 'جامعہ کے اغراض و مقاصد',
      labelArabic: 'أهداف الجامعة وغاياتها',
      labelEnglish: 'Aims & Objectives',
      icon: Target
    },
    {
      id: 'administration',
      tabTarget: 'about-administration',
      labelUrdu: 'جامعہ کا نظم و نسق و شوریٰ',
      labelArabic: 'إدارة الجامعة ومجلس الشورى',
      labelEnglish: 'Administration & Shura',
      icon: Building2
    },
    {
      id: 'rules',
      tabTarget: 'about-rules',
      labelUrdu: 'ضروری ہدایات اور قواعد و ضوابط',
      labelArabic: 'التعليمات والإرشادات العامة',
      labelEnglish: 'Rules & Guidelines',
      icon: ShieldCheck
    },
    {
      id: 'departments',
      tabTarget: 'about-departments',
      labelUrdu: 'جامعہ کا نظامِ تعلیم و شعبہ جات',
      labelArabic: 'نظام التعليم والأقسام العلمية',
      labelEnglish: 'Education System & Depts',
      icon: GraduationCap
    },
    {
      id: 'expenses',
      tabTarget: 'about-expenses',
      labelUrdu: 'جامعہ کے مصارف و فنڈز',
      labelArabic: 'مصارف الجامعة والأوقاف',
      labelEnglish: 'Expenses & Funds',
      icon: Landmark
    }
  ];

  // Get current title according to section
  const getCurrentTitle = () => {
    switch (currentSection) {
      case 'founder':
        return isAr ? 'مؤسس الجامعة رحمه الله' : isEn ? 'Founder of the Jamia' : 'حضرت بانیِ جامعہ رحمہ اللہ';
      case 'objectives':
        return isAr ? 'أهداف الجامعة وغاياتها' : isEn ? 'Aims & Objectives' : 'جامعہ کے اغراض و مقاصد';
      case 'administration':
        return isAr ? 'إدارة الجامعة ومجلس الشورى' : isEn ? 'Administration & Governance' : 'جامعہ کا نظم و نسق';
      case 'rules':
        return isAr ? 'التعليمات والقواعد والضوابط' : isEn ? 'Rules & Guidelines' : 'ضروری ہدایات اور قواعد و ضوابط';
      case 'departments':
        return isAr ? 'نظام التعليم والأقسام العلمية' : isEn ? 'Academic & Education System' : 'جامعہ کا نظامِ تعلیم';
      case 'expenses':
        return isAr ? 'مصارف الجامعة وأموال التبرعات' : isEn ? 'Jamia Expenses & Funds' : 'جامعہ کے مصارف';
      case 'overview':
      default:
        return isAr ? 'نبذة تعريفية عن الجامعة' : isEn ? 'About Jamia Islamia' : 'تعارفِ جامعہ';
    }
  };

  const ArrowIcon = isEn ? ChevronRight : ChevronLeft;

  return (
    <div className={`w-full max-w-7xl mx-auto py-2 sm:py-4 px-2 sm:px-4 ${textFontClass}`} dir={isEn ? 'ltr' : 'rtl'}>
      
      {/* 1. TOP HEADER BANNER STRIP */}
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

        {/* Main Title */}
        <div className="flex items-center gap-3.5 relative z-10">
          <div className="w-2.5 sm:w-3 h-8 sm:h-9 bg-[#8C6239] rounded-xs shrink-0 shadow-xs"></div>
          <h1 className={`text-2xl sm:text-3xl lg:text-[34px] font-black text-[#2B1B0E] dark:text-amber-100 tracking-wide ${headingFontClass} leading-tight`}>
            {getCurrentTitle()}
          </h1>
        </div>

        {/* Institutional Calligraphy Logo */}
        <div className="shrink-0 relative z-10 flex items-center">
          <img 
            src={JAMIA_HEADER_LOGO_DATA_URI || headerLogoCalligraphy} 
            alt="الجامعة الإسلامية ايبت آباد" 
            className="h-10 sm:h-12 md:h-14 w-auto object-contain transition-all dark:brightness-0 dark:invert dark:opacity-90"
            onError={(e) => {
              const target = e.currentTarget;
              target.src = JAMIA_HEADER_LOGO_DATA_URI || '/jamia_logo_calligraphy_transparent.png';
            }}
          />
        </div>
      </div>

      {/* 2. MAIN 2-COLUMN INSTITUTIONAL LAYOUT */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* SIDEBAR WIDGET */}
        <aside className="order-2 lg:order-1 lg:col-span-4 xl:col-span-4 w-full space-y-5">
          
          {/* Main Informational Links Box */}
          <div className="bg-[#FAF7F0] dark:bg-slate-900 border border-[#D5C7B2] dark:border-slate-800 rounded-xs shadow-xs overflow-hidden">
            
            {/* Sidebar Header Bar */}
            <div 
              className="bg-[#3C2E21] text-white px-4 py-3 flex items-center justify-between border-b-2 border-[#B88A3B]"
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg width='24' height='24' viewBox='0 0 24 24' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23B88A3B' fill-opacity='0.15'%3E%3Cpath d='M12 0l12 12-12 12L0 12 12 0zm0 3.5L3.5 12 12 20.5 20.5 12 12 3.5z'/%3E%3C/g%3E%3C/svg%3E")`
              }}
            >
              <div className="flex items-center gap-2.5">
                <FileText className="w-5 h-5 text-[#B88A3B]" />
                <h2 className={`text-lg sm:text-xl font-bold ${headingFontClass} tracking-wide`}>
                  {isAr ? 'روابط معلوماتية' : isEn ? 'Informational Links' : 'معلوماتی لنکس'}
                </h2>
              </div>
              <span className="text-[#B88A3B] text-xs px-2 py-0.5 bg-black/25 rounded-xs font-mono">
                {infoLinks.length}
              </span>
            </div>

            {/* Sidebar Links List */}
            <ul className="divide-y divide-[#EADFCF] dark:divide-slate-800/80">
              {infoLinks.map((link) => {
                const isActive = currentSection === link.id;

                return (
                  <li key={link.id}>
                    <button
                      onClick={() => handleLinkClick(link.id, link.tabTarget)}
                      className={`w-full ${isEn ? 'text-left' : 'text-right'} px-4 py-2.5 sm:py-3 flex items-center justify-between gap-3 transition-all cursor-pointer group ${
                        isActive 
                          ? `bg-[#5C4632] text-white font-black shadow-inner ${isEn ? 'border-l-4' : 'border-r-4'} border-[#B88A3B]` 
                          : 'text-[#361F0D] dark:text-stone-200 hover:bg-[#EFE8DA] dark:hover:bg-slate-800/60 font-semibold'
                      }`}
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <span className={`text-xs ${isActive ? 'text-[#B88A3B]' : 'text-[#8C6D37]'}`}>
                          ◈
                        </span>
                        <span className={`text-base sm:text-lg ${textFontClass} truncate`}>
                          {isAr ? link.labelArabic : isEn ? link.labelEnglish : link.labelUrdu}
                        </span>
                      </div>
                      
                      <ArrowIcon className={`w-4 h-4 shrink-0 transition-transform ${
                        isActive ? 'text-[#B88A3B]' : 'text-stone-400 group-hover:text-stone-700 dark:group-hover:text-stone-300'
                      }`} />
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>

          {/* Quick Action Side Cards */}
          <div className="bg-[#FAF7F0] dark:bg-slate-900 border border-[#D5C7B2] dark:border-slate-800 rounded-xs shadow-xs overflow-hidden">
            <div 
              className="bg-[#3C2E21] text-white px-4 py-3 flex items-center gap-2.5 border-b-2 border-[#B88A3B]"
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg width='24' height='24' viewBox='0 0 24 24' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23B88A3B' fill-opacity='0.15'%3E%3Cpath d='M12 0l12 12-12 12L0 12 12 0zm0 3.5L3.5 12 12 20.5 20.5 12 12 3.5z'/%3E%3C/g%3E%3C/svg%3E")`
              }}
            >
              <BookOpen className="w-5 h-5 text-[#B88A3B]" />
              <h3 className={`text-lg sm:text-xl font-bold ${headingFontClass} tracking-wide`}>
                {isAr ? 'دار الإفتاء والخدمات الإلكترونية' : isEn ? 'Darul Ifta & Online Services' : 'دار الافتاء و آن لائن خدمات'}
              </h3>
            </div>
            <div className="p-4 space-y-3">
              <p className={`text-sm sm:text-base text-stone-700 dark:text-stone-300 ${lineSpacingClass} text-justify ${textFontClass}`}>
                {isAr 
                  ? 'تفضل بزيارة البوابة الإلكترونية للحصول على الفتاوى الشرعية والاطلاع على المطبوعات والكتب الإسلامية المعتمدة.' 
                  : isEn 
                  ? 'Visit the online portal to request authoritative Shariah verdicts (Fatwas) or browse our digital library.'
                  : 'اپنے شرعی و فقہی سوالات کے جوابات حاصل کرنے یا کتب و فتاویٰ کا مطالعہ کرنے کے لیے آن لائن پورٹل پر رجوع کریں۔'}
              </p>
              <div className="pt-1 flex flex-col gap-2">
                <button
                  onClick={() => onSelectTab && onSelectTab('fatwas')}
                  className={`w-full py-2.5 px-3 bg-[#3C2E21] hover:bg-[#5C4632] text-amber-100 text-sm sm:text-base font-bold rounded-xs transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-xs border border-[#B88A3B]/40 ${textFontClass}`}
                >
                  <span>{isAr ? 'طلب فتوى شرعية' : isEn ? 'Ask a Fatwa Online' : 'آن لائن فتویٰ پوچھیں'}</span>
                  <ArrowIcon className="w-4 h-4 text-[#B88A3B]" />
                </button>
                <button
                  onClick={() => onSelectTab && onSelectTab('library')}
                  className={`w-full py-2.5 px-3 bg-white dark:bg-slate-800 border border-[#B88A3B] text-[#3C2E21] dark:text-amber-200 hover:bg-[#F5EFE6] text-sm sm:text-base font-bold rounded-xs transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-xs ${textFontClass}`}
                >
                  <span>{isAr ? 'مطبوعات الجامعة وكتبها' : isEn ? 'Publications & Library' : 'جامعہ کی مطبوعات و کتب'}</span>
                  <ArrowIcon className="w-4 h-4 text-[#B88A3B]" />
                </button>
              </div>
            </div>
          </div>

        </aside>

        {/* MAIN CONTENT CANVAS */}
        <main className="order-1 lg:order-2 lg:col-span-8 xl:col-span-8 w-full">
          <div className="bg-white dark:bg-slate-900 rounded-xs p-4 sm:p-7 lg:p-8 space-y-6">
            
            {/* Box Title stretched horizontally across full width */}
            <div className="w-full pb-2">
              <div className="w-full text-center border border-[#C5B59E] dark:border-slate-700 bg-[#FAF7F0] dark:bg-slate-800/80 py-2 sm:py-2.5 px-4 rounded-xs shadow-xs">
                <h2 className={`text-xl sm:text-2xl lg:text-3xl font-extrabold text-[#3C2E21] dark:text-amber-100 ${headingFontClass} tracking-wide`}>
                  {getCurrentTitle()}
                </h2>
              </div>
            </div>

            {/* Content Body based on Active Section */}
            <div className="pt-2">

              {/* ========================================= */}
              {/* 1. بانیِ جامعہ (Founder) */}
              {/* ========================================= */}
              {currentSection === 'founder' && (
                <div className={`space-y-6 ${textFontClass}`}>
                  <div className={`space-y-2 text-center ${isEn ? 'sm:text-left' : 'sm:text-right'} border-b border-[#EADFCF] dark:border-slate-800 pb-4`}>
                    <h3 className={`text-2xl sm:text-3xl font-black text-[#5C4632] dark:text-amber-200 leading-snug ${headingFontClass}`}>
                      {isAr 
                        ? 'فضيلة الشيخ المحدث مولانا فضل مولى رحمه الله' 
                        : isEn 
                        ? 'Shaykh-ul-Hadith Mawlana Fazl-e-Mowla (Rahimahullah)' 
                        : 'حضرت شیخ الحدیث مولانا فضل مولیٰ رحمہ اللہ'}
                    </h3>
                    <p className="text-base sm:text-lg text-[#B88A3B] dark:text-amber-400 font-bold">
                      {isAr 
                        ? '(مؤسس الجامعة الإسلامية ومرشدها الأول — المدفون في مقبرة المعلاة بمكة المكرمة)' 
                        : isEn 
                        ? '(Founder & Supreme Patron of Jamia Islamia — Laid to rest in Jannat al-Mu\'alla, Makkah)' 
                        : '(بانی و سرپرستِ اعلیٰ جامعہ اسلامیہ ایبٹ آباد — مدفون: مقبرۃ المعلیٰ، مکہ مکرمہ)'}
                    </p>
                  </div>

                  <p className={`text-base sm:text-lg lg:text-xl text-stone-800 dark:text-stone-200 ${lineSpacingClass} text-justify`}>
                    {isAr 
                      ? 'أسس فضيلة الشيخ المحدث مولانا فضل مولى رحمه الله الجامعة الإسلامية بأيبت آباد بدافع الإخلاص وخدمة الدين الحنيف ونشر تعاليم الإسلام الأصيلة. وقد كرّس حياته المباركة لتعليم كتاب الله وسنة نبيه ﷺ، وتزكية المجتمع، وإعداد أجيال من العلماء والفقهاء.'
                      : isEn 
                      ? 'Jamia Islamia Abbottabad was founded by the venerable Shaykh-ul-Hadith Mawlana Fazl-e-Mowla (RA) with deep sincerity and devotion to the service of Islam. He dedicated his entire noble life to the teaching of the Quran and Sunnah, social reformation, and the dissemination of authentic Islamic sciences.'
                      : 'جامعہ اسلامیہ ایبٹ آباد کی بنیاد حضرت شیخ الحدیث مولانا فضل مولیٰ رحمہ اللہ نے خالص دینی جذبے، اخلاص اور خدمتِ اسلام کے عظیم مقصد کے تحت رکھی۔ آپ نے اپنی پوری زندگی قرآن و سنت کی تعلیم، اصلاحِ معاشرہ اور دینی علوم کی اشاعت میں صرف کی۔'}
                  </p>

                  <div className="pt-4 border-t border-[#EADFCF] dark:border-slate-800 space-y-2">
                    <span className="text-base font-bold text-[#5C4632] dark:text-amber-300 block">
                      {isAr ? 'الرئيس والمهتم الحالي للجامعة:' : isEn ? 'Current Principal & Patron:' : 'موجودہ مہتمم و سرپرست:'}
                    </span>
                    <h4 className={`text-xl sm:text-2xl font-black text-[#3C2E21] dark:text-emerald-300 ${headingFontClass}`}>
                      {isAr ? 'فضيلة الشيخ المفتي رشيد أحمد حفظه الله ورعاه' : isEn ? 'Hadhrat Mawlana Mufti Rasheed Ahmad (Damat Barakatuhum)' : 'حضرت مولانا مفتی رشید احمد صاحب دامت برکاتہم'}
                    </h4>
                  </div>
                </div>
              )}

              {/* ========================================= */}
              {/* 2. جامعہ کے اغراض و مقاصد (Objectives) */}
              {/* ========================================= */}
              {currentSection === 'objectives' && (
                <div className={`space-y-6 ${textFontClass}`}>
                  <p className={`text-base sm:text-lg lg:text-xl text-stone-800 dark:text-stone-200 ${lineSpacingClass} text-justify`}>
                    {isAr 
                      ? 'يتمثل الهدف الجوهري للجامعة الإسلامية بأيبت آباد في إعداد وتخريج علماء ومفتين ودعاة متميزين يجمعون بين الرسوخ العلمي والتقوى والإخلاص وحسن الخلق وروح التضحية لخدمة الدين الحنيف.'
                      : isEn 
                      ? 'The foundational objective of Jamia Islamia Abbottabad is to cultivate competent Islamic scholars, jurists, and preachers who embody profound academic grounding alongside piety, sincerity, exemplary character, and commitment to the Ummah.'
                      : 'جامعہ اسلامیہ ایبٹ آباد کا بنیادی مقصد ایسے علماء، فضلاء اور داعیانِ اسلام تیار کرنا ہے جو علم کے ساتھ تقویٰ، اخلاص، للہیت، حسنِ اخلاق اور خدمتِ دین کے جذبے سے آراستہ ہوں۔'}
                  </p>

                  <ul className={`space-y-4 pt-1 text-base sm:text-lg lg:text-xl text-stone-800 dark:text-stone-200 ${lineSpacingClass}`}>
                    <li className="flex items-start gap-3">
                      <span className="text-[#B88A3B] text-xl font-black shrink-0 leading-none mt-1.5">•</span>
                      <span className="text-justify">
                        {isAr 
                          ? 'إعداد علماء ومفتين وخطباء وباحثين متسلحين بعلوم النبوة، سالمين من التعصبات الحزبية والفكرية الضيقة.'
                          : isEn 
                          ? 'Preparing erudite scholars, orators, muftis, and Islamic researchers grounded in prophetic knowledge and free from partisan prejudices.'
                          : 'جامعہ کا اہم مقصد ایسے علماء، واعظین، مفتیانِ کرام اور اسلامی مفکرین تیار کرنا ہے جو علومِ نبوت کے حامل اور ہر قسم کے تعصبات سے پاک ہوں۔'}
                      </span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-[#B88A3B] text-xl font-black shrink-0 leading-none mt-1.5">•</span>
                      <span className="text-justify">
                        {isAr 
                          ? 'تعزيز التعاون الأكاديمي والروابط الأخوية مع سائر الجامعات والمعاهد الإسلامية والمؤسسات البحثية لخدمة التعليم الشرعي.'
                          : isEn 
                          ? 'Fostering academic cooperation, mutual goodwill, and institutional ties with universities and seminaries globally.'
                          : 'دوسری جامعات، مدارس اور علمی و تحقیقی اداروں کے ساتھ ہمدردی، تعاون اور حسنِ تعلق قائم رکھنا اور دینی و تعلیمی میدان میں ان سے تعاون کرنا۔'}
                      </span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-[#B88A3B] text-xl font-black shrink-0 leading-none mt-1.5">•</span>
                      <span className="text-justify">
                        {isAr 
                          ? 'ربط الأجيال الصاعدة بالدين الحنيف، وترسيخ العقيدة الصحيحة والآداب والأخلاق النبوية السامية في نفوسهم.'
                          : isEn 
                          ? 'Connecting upcoming generations to their faith, sound creed, and prophetic morals in a modern world.'
                          : 'نئی نسل کو مذہب سے قریب کرنا اور دینی عقائد و اسلامی آداب و ثقافت سے روشناس کرانا۔'}
                      </span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-[#B88A3B] text-xl font-black shrink-0 leading-none mt-1.5">•</span>
                      <span className="text-justify">
                        {isAr 
                          ? 'إرشاد المجتمع المسلم والتصدي العلمي والفكري للشبهات المعاصرة والإلحاد والأفكار المنحرفة بالحكمة والبرهان.'
                          : isEn 
                          ? 'Guiding the Muslim community and academically refuting modern doubts, atheism, and deviant ideologies with wisdom and evidence.'
                          : 'مسلمان عوام کی اصلاح و رہنمائی اور باطل عقائد، الحاد و لادینیت اور گمراہ کن نظریات کا علمی، تحقیقی اور فکری انداز میں سدِ باب کرنا۔'}
                      </span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-[#B88A3B] text-xl font-black shrink-0 leading-none mt-1.5">•</span>
                      <span className="text-justify">
                        {isAr 
                          ? 'نشر الكتب والبحوث الفقهية والمجلات العلمية والفتاوى الشرعية باللغتين العربية والأردية لإفادة المسلمين وتوجيههم.'
                          : isEn 
                          ? 'Publishing authoritative books, research papers, and legal verdicts (Fatwas) in Arabic and Urdu for the guidance of the Ummah.'
                          : 'عربی اور اردو زبان میں دینی کتب، مقالات اور فتاویٰ کی اشاعت کے ذریعے امت مسلمہ کی رہنمائی کا فریضہ انجام دینا۔'}
                      </span>
                    </li>
                  </ul>
                </div>
              )}

              {/* ========================================= */}
              {/* 3. جامعہ کا نظم و نسق (Administration) */}
              {/* ========================================= */}
              {currentSection === 'administration' && (
                <div className={`space-y-6 ${textFontClass}`}>
                  <p className={`text-base sm:text-lg lg:text-xl text-stone-800 dark:text-stone-200 ${lineSpacingClass} text-justify`}>
                    {isAr 
                      ? 'تُدار الجامعة الإسلامية وفق منظومة إدارية دقيقة ومحكمة، حيث تُدار كافة الشؤون التعليمية والإدارية والمالية وفق الأحكام والضوابط الشرعية، مع الالتزام بالأمانة والشفافية التامة ومبدأ الشورى.'
                      : isEn 
                      ? 'The Jamia operates under a meticulous and systematic administrative structure. All academic, administrative, and financial activities are conducted in strict adherence to Shariah principles, integrity, transparency, and mutual consultation (Shura).'
                      : 'جامعہ کا انتظام ایک منظم اور باقاعدہ نظام کے تحت چلایا جاتا ہے۔ تمام تعلیمی، انتظامی اور مالی معاملات شریعت کے اصولوں، دیانت داری، شفافیت اور باہمی مشاورت کے مطابق انجام دیے جاتے ہیں۔'}
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                    <div className="bg-[#FAF7F0] dark:bg-slate-800/60 p-4 border border-[#D5C7B2] dark:border-slate-700 rounded-xs space-y-2">
                      <div className="flex items-center gap-2 text-[#3C2E21] dark:text-amber-300 font-bold">
                        <Building2 className="w-5 h-5 text-[#B88A3B]" />
                        <h4 className={`text-lg ${headingFontClass}`}>
                          {isAr ? 'مجلس الشورى والرعاية العليا' : isEn ? 'Shura Council & Advisory Board' : 'مجلسِ شوریٰ و سرپرستی'}
                        </h4>
                      </div>
                      <p className={`text-sm sm:text-base text-stone-700 dark:text-stone-300 ${lineSpacingClass} text-justify`}>
                        {isAr 
                          ? 'يتولى رسم السياسات العامة واتخاذ القرارات التعليمية والتطويرية الكبرى مجلس شورى يضم نخبة من كبار العلماء والمشايخ.'
                          : isEn 
                          ? 'Policy-making and major academic decisions are governed by a council of senior Islamic scholars and educationalists.'
                          : 'جامعہ کی پالیسی سازی، اہم تعلیمی اور انتظامی فیصلوں کے لیے جید علمائے کرام پر مشتمل باقاعدہ مجلسِ شوریٰ رہنمائی فراہم کرتی ہے۔'}
                      </p>
                    </div>

                    <div className="bg-[#FAF7F0] dark:bg-slate-800/60 p-4 border border-[#D5C7B2] dark:border-slate-700 rounded-xs space-y-2">
                      <div className="flex items-center gap-2 text-[#3C2E21] dark:text-amber-300 font-bold">
                        <ShieldCheck className="w-5 h-5 text-[#B88A3B]" />
                        <h4 className={`text-lg ${headingFontClass}`}>
                          {isAr ? 'الإشراف الأكاديمي والتربوي' : isEn ? 'Academic & Supervisory Staff' : 'تعلیمی و انتظامی نگران'}
                        </h4>
                      </div>
                      <p className={`text-sm sm:text-base text-stone-700 dark:text-stone-300 ${lineSpacingClass} text-justify`}>
                        {isAr 
                          ? 'يسهر ناظر التعليمات، وناظر السكن الداخلي، ورؤساء الأقسام العلمية على رعاية الطلاب وتدريسهم وتربيتهم على مدار الساعة.'
                          : isEn 
                          ? 'The Director of Education, Dormitory Warden, and Department Heads actively oversee the academic progress and moral discipline of all students.'
                          : 'ناظمِ تعلیمات، ناظمِ دارالاقامہ اور شعبہ جاتی نگران اساتذہ طلبہ کی تدریس، تربیت اور اخلاقی نگرانی کی ہمہ وقت ذمہ داری نبھاتے ہیں۔'}
                      </p>
                    </div>
                  </div>

                  <p className={`text-base sm:text-lg text-stone-800 dark:text-stone-200 ${lineSpacingClass} text-justify`}>
                    {isAr 
                      ? 'يؤدي جميع الأساتذة والموظفين واجباتهم بدافع التقوى والإخلاص والتفاني، مما يوفر بيئة تعليمية وإيمانية مثالية لطلاب العلم الشريف.'
                      : isEn 
                      ? 'All faculty members and staff perform their responsibilities with piety, sincerity, and diligence to foster an ideal environment for sacred knowledge.'
                      : 'جامعہ کے تمام اساتذہ اور عملہ تقویٰ، للہیت اور خلوص کے جذبے سے اپنی خدمات انجام دیتے ہیں تاکہ ایک مثالی اسلامی علمی ماحول قائم رہے۔'}
                  </p>
                </div>
              )}

              {/* ========================================= */}
              {/* 4. ضروری ہدایات اور قواعد و ضوابط (Rules) */}
              {/* ========================================= */}
              {currentSection === 'rules' && (
                <div className={`space-y-6 ${textFontClass}`}>
                  <p className={`text-base sm:text-lg lg:text-xl text-stone-800 dark:text-stone-200 ${lineSpacingClass} text-justify`}>
                    {isAr 
                      ? 'يتعين على جميع الطلاب المنتظمين بالجامعة الإسلامية الالتزام التام بالضوابط الشرعية واللوائح والتعليمات التنظيمية الآتية:'
                      : isEn 
                      ? 'All students enrolled at Jamia Islamia Abbottabad are required to strictly observe the following Shariah principles and institutional regulations:'
                      : 'جامعہ اسلامیہ ایبٹ آباد میں داخل تمام طلبہ کرام کے لیے درج ذیل شرعی و انتظامی قواعد و ضوابط کی پابندی لازمی ہے:'}
                  </p>

                  <ul className={`space-y-4 pt-1 text-base sm:text-lg lg:text-xl text-stone-800 dark:text-stone-200 ${lineSpacingClass}`}>
                    <li className="flex items-start gap-3">
                      <span className="text-[#B88A3B] text-xl font-black shrink-0 leading-none mt-1.5">•</span>
                      <span className="text-justify">
                        {isAr 
                          ? 'المحافظة التامة على أداء الصلوات الخمس جماعة في المسجد، والالتزام بالهدي النبوي الشريف والأخلاق الكريمة.'
                          : isEn 
                          ? 'Punctual attendance for all five daily prayers in congregation and maintaining Sunnah etiquette.'
                          : 'پنجگانہ نمازوں کی باجماعت ادائیگی اور مسنون آداب و اخلاق کی پابندی ہر طالب علم کے لیے لازمی ہے۔'}
                      </span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-[#B88A3B] text-xl font-black shrink-0 leading-none mt-1.5">•</span>
                      <span className="text-justify">
                        {isAr 
                          ? 'الالتزام بالحضور التام والمواظبة على أوقات الدروس، وحلقات المذاكرة الجماعية والمطالعة المقررة.'
                          : isEn 
                          ? 'Full attendance and strict punctuality across all classes, study groups (Takraar), and library sessions.'
                          : 'تعلیمی اوقات (اوقاتِ تدریس، مطالعہ اور تکرار) میں مکمل حاضری اور وقت کی پابندی ضروری ہے۔'}
                      </span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-[#B88A3B] text-xl font-black shrink-0 leading-none mt-1.5">•</span>
                      <span className="text-justify">
                        {isAr 
                          ? 'احترام لوائح السكن الداخلي (المهجع) ومراعاة أوقات النوم والراحة وتناول الوجبات الغذائية المحددة.'
                          : isEn 
                          ? 'Compliance with hostel regulations including scheduled rest, lights-out, and dining timings.'
                          : 'دارالاقامہ (ہاسٹل) میں قیام کے دوران جامعہ کے مقررہ اوقاتِ آرام و طعام کی پاسداری کی جائے۔'}
                      </span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-[#B88A3B] text-xl font-black shrink-0 leading-none mt-1.5">•</span>
                      <span className="text-justify">
                        {isAr 
                          ? 'يُمنع منعاً باتاً ارتداء ما يخالف الزي الشرعي أو الانشغال بالملهيات، أو الانخراط في الخلافات السياسية والحزبية.'
                          : isEn 
                          ? 'Strict prohibition of un-Islamic attire, idle pursuits, or participation in political or factional controversies.'
                          : 'غیر شرعی لباس، لایعنی مصروفیات اور سیاسی و فروعی تنازعات میں شمولیت کی قطعی اجازت نہیں ہے۔'}
                      </span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-[#B88A3B] text-xl font-black shrink-0 leading-none mt-1.5">•</span>
                      <span className="text-justify">
                        {isAr 
                          ? 'لا يُسمح بأي إجازة أو مغادرة لحرم الجامعة إلا بالحصول على إذن خطي مسبق من ناظر التعليمات.'
                          : isEn 
                          ? 'Any leave of absence from campus requires prior written authorization from the Director of Education.'
                          : 'کسی بھی قسم کی چھٹی کے لیے ناظمِ تعلیمات سے تحریری منظوری حاصل کرنا لازمی ہے۔'}
                      </span>
                    </li>
                  </ul>
                </div>
              )}

              {/* ========================================= */}
              {/* 5. جامعہ کا نظامِ تعلیم و شعبہ جات (Departments) */}
              {/* ========================================= */}
              {currentSection === 'departments' && (
                <div className={`space-y-6 ${textFontClass}`}>
                  <p className={`text-base sm:text-lg lg:text-xl text-stone-800 dark:text-stone-200 ${lineSpacingClass} text-justify`}>
                    {isAr 
                      ? 'ترتبط الجامعة الإسلامية بأيبت آباد رسمياً بـ "وفاق المدارس العربية بباكستان" (رقم الإلحاق: 08-04-09345، رقم التسجيل: 1454/5/5183)، وتقدم برامج دراسية متكاملة تمتد من المرحلة الابتدائية مروراً بدورة الحديث الشريف وانتهاءً بأقسام التخصص العالي.'
                      : isEn 
                      ? 'Jamia Islamia Abbottabad is officially affiliated with Wifaqul Madaris Al-Arabia Pakistan (Affiliation No: 08-04-09345, Registration No: 1454/5/5183), offering a comprehensive curriculum from foundational levels to Dawrah Hadith and Postgraduate Specializations.'
                      : 'جامعہ اسلامیہ ایبٹ آباد وفاق المدارس العربیہ پاکستان سے باقاعدہ الحاق شدہ ہے (الحاق نمبر: 08-04-09345، رجسٹریشن نمبر: 1454/5/5183)، اور یہاں درجہ ابتدائیہ سے لے کر دورۂ حدیث شریف اور تخصص تک مکمل تعلیم دی جاتی ہے۔'}
                  </p>

                  <div className="space-y-3">
                    <div className={`p-4 bg-[#FAF7F0] dark:bg-slate-800/60 ${isEn ? 'border-l-4' : 'border-r-4'} border-[#B88A3B] rounded-xs`}>
                      <h4 className={`text-lg font-bold text-[#3C2E21] dark:text-amber-200 mb-1 ${headingFontClass}`}>
                        {isAr ? '١. قسم درس نظامي (برنامج العالمية في العلوم الإسلامية والعربية)' : isEn ? '1. Dars-e-Nizami (Shahadat-ul-Alimiyyah Degree)' : '۱. شعبہ درسِ نظامی (عالم و فاضل کورس)'}
                      </h4>
                      <p className={`text-sm sm:text-base text-stone-700 dark:text-stone-300 ${lineSpacingClass}`}>
                        {isAr 
                          ? 'تدريس متقن للقرآن الكريم، والحديث النبوي الشريف، والفقه الحنفي، وأصول الفقه، والأدب العربي، والمنطق، والعقيدة الإسلامية.'
                          : isEn 
                          ? 'In-depth study of Quran, Hadith collections, Fiqh, Usul al-Fiqh, Arabic Literature, Logic, and Islamic Theology.'
                          : 'قرآن، حدیث، فقہ، اصولِ فقہ، عربی ادب، منطق و فلسفہ اور عقائد کی مستند تدریس۔'}
                      </p>
                    </div>

                    <div className={`p-4 bg-[#FAF7F0] dark:bg-slate-800/60 ${isEn ? 'border-l-4' : 'border-r-4'} border-[#B88A3B] rounded-xs`}>
                      <h4 className={`text-lg font-bold text-[#3C2E21] dark:text-amber-200 mb-1 ${headingFontClass}`}>
                        {isAr ? '٢. قسم التخصص في الإفتاء والبحوث الفقهية' : isEn ? '2. Department of Specialization in Ifta (Mufti Course)' : '۲. شعبہ تخصص فی الافتاء (مفتی کورس)'}
                      </h4>
                      <p className={`text-sm sm:text-base text-stone-700 dark:text-stone-300 ${lineSpacingClass}`}>
                        {isAr 
                          ? 'تدريب علمي متقدم على معالجة النوازل والقضايا الفقهية المعاصرة، وصياغة الفتاوى الشرعية، ودراسة أصول الإفتاء ورسم المفتي.'
                          : isEn 
                          ? 'Advanced post-graduate research on contemporary legal questions, jurisprudential methodology, and formal Fatwa drafting.'
                          : 'جدید فقہی مسائل، فتاویٰ نویسی اور تدریب فی الافتاء کی اعلیٰ سطحی تربیت۔'}
                      </p>
                    </div>

                    <div className={`p-4 bg-[#FAF7F0] dark:bg-slate-800/60 ${isEn ? 'border-l-4' : 'border-r-4'} border-[#B88A3B] rounded-xs`}>
                      <h4 className={`text-lg font-bold text-[#3C2E21] dark:text-amber-200 mb-1 ${headingFontClass}`}>
                        {isAr ? '٣. قسم تحفيظ القرآن الكريم والتجويد والقراءات' : isEn ? '3. Department of Hifz & Tajweed al-Quran' : '۳. شعبہ حفظ و تجوید القرآن'}
                      </h4>
                      <p className={`text-sm sm:text-base text-stone-700 dark:text-stone-300 ${lineSpacingClass}`}>
                        {isAr 
                          ? 'إتقان حفظ كتاب الله تعالى كاملاً مع ضبط المخارج، وتطبيق أحكام التجويد، ودراسة القراءات السبع والعشر.'
                          : isEn 
                          ? 'Complete memorization of the Holy Quran with precise articulation, Tajweed disciplines, and the Qira\'at variants.'
                          : 'صحیح مخارج، حسنِ قرات اور قراءاتِ سبعہ و عشرہ کے ساتھ مکمل حفظِ کلام اللہ۔'}
                      </p>
                    </div>
                  </div>

                  <div className="pt-2 text-center">
                    <button
                      onClick={() => onSelectTab && onSelectTab('departments')}
                      className={`px-6 py-2.5 bg-[#3C2E21] hover:bg-[#5C4632] text-white font-bold rounded-xs transition-colors inline-flex items-center gap-2 cursor-pointer ${textFontClass} text-base sm:text-lg`}
                    >
                      <span>{isAr ? 'استعراض التفاصيل الكاملة لجميع الأقسام العلمية' : isEn ? 'View Complete Details of All Departments' : 'تمام شعبہ جات کی مکمل تفصیلات دیکھیں'}</span>
                      <ArrowIcon className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              )}

              {/* ========================================= */}
              {/* 6. جامعہ کے مصارف و فنڈز (Expenses) */}
              {/* ========================================= */}
              {currentSection === 'expenses' && (
                <div className={`space-y-6 ${textFontClass}`}>
                  <div className="bg-[#FAF7F0] dark:bg-slate-800/60 p-4 border border-[#D5C7B2] dark:border-slate-700 rounded-xs space-y-2">
                    <h4 className={`text-xl font-bold text-[#5C4632] dark:text-amber-300 ${headingFontClass}`}>
                      {isAr ? 'الجامعة مؤسسة دينية تعليمية مستقلة' : isEn ? 'An Independent Charitable Islamic Institution' : 'جامعہ ایک خالص غیر سرکاری دینی ادارہ ہے'}
                    </h4>
                    <p className={`text-base sm:text-lg text-stone-800 dark:text-stone-200 ${lineSpacingClass} text-justify`}>
                      {isAr 
                        ? 'لا تملك الجامعة أوقافاً تجارية ولا تتلقى أي دعم مالي من جهات حكومية، وإنما تُغطى كافة نفقاتها بفضل الله تعالى وتوفيقه، ثم عبر تبرعات وزكوات وصدقات أهل الخير والإحسان.'
                        : isEn 
                        ? 'The Jamia maintains no commercial properties nor does it receive any government funding. All educational and operational expenses are supported by the grace of Allah Almighty through voluntary contributions, Sadaqat, and Zakat.'
                        : 'اس کی کوئی مستقل جاگیر نہیں اور نہ ہی حکومت سے کوئی مالی امداد وصول کی جاتی ہے۔ تمام اخراجات اللہ تعالیٰ کے فضل و کرم سے اہلِ خیر کے عطیات، صدقات اور زکوٰۃ سے پورے ہوتے ہیں۔'}
                    </p>
                  </div>

                  <ul className={`space-y-4 pt-1 text-base sm:text-lg lg:text-xl text-stone-800 dark:text-stone-200 ${lineSpacingClass}`}>
                    <li className="flex items-start gap-3">
                      <span className="text-[#B88A3B] text-xl font-black shrink-0 leading-none mt-1.5">•</span>
                      <span className="text-justify">
                        {isAr 
                          ? 'توفير التعليم المجاني، والإقامة الكاملة، والوجبات الغذائية، والكتب المنهجية للطلاب.'
                          : isEn 
                          ? 'Providing free education, boarding, nutritious dining, and study books for all enrolled students.'
                          : 'طلبہ کے لیے مفت تعلیم، رہائش، طعام اور کتب کی فراہمی۔'}
                      </span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-[#B88A3B] text-xl font-black shrink-0 leading-none mt-1.5">•</span>
                      <span className="text-justify">
                        {isAr 
                          ? 'صرف رواتب الأساتذة الكرام والموظفين وتوفير الرعاية والاحتياجات الأساسية لهم.'
                          : isEn 
                          ? 'Monthly stipends and welfare provisions for respected teachers and administrative staff.'
                          : 'اساتذہ و ملازمین کے مشاہرات اور بنیادی ضروریات کی کفالت۔'}
                      </span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-[#B88A3B] text-xl font-black shrink-0 leading-none mt-1.5">•</span>
                      <span className="text-justify">
                        {isAr 
                          ? 'نفقات تشغيل وصيانة مباني الجامعة، ومشاريع التوسعة، وفواتير الكهرباء والمياه والنظافة.'
                          : isEn 
                          ? 'Campus maintenance, construction projects, water, electricity, and sanitation utilities.'
                          : 'جامعہ کی عمارات کی تعمیر، توسیع، بجلی، پانی اور صفائی کے اخراجات۔'}
                      </span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-[#B88A3B] text-xl font-black shrink-0 leading-none mt-1.5">•</span>
                      <span className="text-justify">
                        {isAr 
                          ? 'وجود قسم حسابات ومراجعة مالية متخصصة يحتفظ بسجلات دقيقة ومفصلة لجميع الإيرادات والمصروفات.'
                          : isEn 
                          ? 'A specialized accounting department maintaining complete, audited documentation of all income and expenses.'
                          : 'جامعہ میں مستقل حسابات کا شعبہ موجود ہے جہاں آمدن اور خرچ کا مکمل ریکارڈ محفوظ رکھا جاتا ہے۔'}
                      </span>
                    </li>
                  </ul>

                  <div className={`p-4 bg-amber-50/80 dark:bg-amber-950/30 ${isEn ? 'border-l-4' : 'border-r-4'} border-[#B88A3B] text-stone-800 dark:text-stone-200 font-bold text-base sm:text-lg ${lineSpacingClass}`}>
                    {isAr 
                      ? 'الإنفاق على طلاب العلم ودعم الجامعة صدقة جارية مباركة، فنرجو التبرع من الأموال الحلال الطيبة زكاةً وصدقة.'
                      : isEn 
                      ? 'Supporting sacred knowledge and the Jamia is an enduring charity (Sadaqah Jariyah); donors are urged to contribute from pure, halal earnings.'
                      : 'جامعہ کی خدمت صدقۂ جاریہ ہے، لہٰذا صرف حلال اور پاکیزہ مال سے اپنے عطیات و زکوٰۃ جمع کروائیں۔'}
                  </div>
                </div>
              )}

              {/* ========================================= */}
              {/* 7. تعارف جامعہ (Overview) */}
              {/* ========================================= */}
              {currentSection === 'overview' && (
                <div className={`space-y-6 ${textFontClass}`}>
                  <p className={`text-base sm:text-lg lg:text-xl text-stone-800 dark:text-stone-200 ${lineSpacingClass} text-justify`}>
                    {isAr 
                      ? 'تُعدّ الجامعة الإسلامية بأيبت آباد (باكستان) منارة دينية وعلمية وبحثية رائدة، تضطلع منذ عقود مديدة بأداء رسالتها السامية في تعليم القرآن الكريم والسنة النبوية الشريفة، ونشر العلوم الشرعية الأصيلة، وإصلاح المجتمع، وقيادة الأمة الإسلامية نحو الرشاد.'
                      : isEn 
                      ? 'Jamia Islamia Abbottabad, Pakistan, is a renowned center of Islamic scholarship and research, dedicated for decades to teaching the Quran and Sunnah, disseminating authentic Islamic sciences, social reformation, and guiding the Muslim Ummah.'
                      : 'جامعہ اسلامیہ ایبٹ آباد پاکستان ایک ممتاز دینی، علمی اور تحقیقی ادارہ ہے جو گزشتہ کئی دہائیوں سے قرآن و سنت کی تعلیم، دینی علوم کی اشاعت، اصلاحِ معاشرہ اور امت مسلمہ کی رہنمائی کا عظیم فریضہ انجام دے رہا ہے۔'}
                  </p>

                  <div className={`space-y-4 text-base sm:text-lg lg:text-xl text-stone-800 dark:text-stone-200 ${lineSpacingClass}`}>
                    <p className="text-justify">
                      {isAr 
                        ? 'تضم الجامعة أقساماً تعليمية وتربوية متكاملة، تشمل: قسم درس نظامي (الشهادة العالمية المعادلة لشهادة الماجستير في العلوم الإسلامية واللغة العربية)، وقسم تحفيظ القرآن الكريم وتجويده، وقسم التخصص في الفقه والإفتاء والبحوث العلمية.'
                        : isEn 
                        ? 'The institution houses comprehensive educational wings, including the traditional Dars-e-Nizami program (Shahadat-ul-Alimiyyah, recognized as equivalent to an M.A. in Arabic & Islamic Studies), the Department of Quranic Memorization & Tajweed, and the Advanced Specialization in Islamic Jurisprudence & Ifta.'
                        : 'جامعہ میں درسِ نظامی (شہادتِ عالمیہ ایم اے عربی و اسلامیات کے مساوی)، شعبہ حفظ و تجوید، اور تخصص فی الافتاء سمیت مختلف تعلیمی و تربیتی شعبہ جات قائم ہیں۔'}
                    </p>
                    <p className="text-justify">
                      {isAr 
                        ? 'تتمثل رسالة الجامعة الأساسية في إعداد علماء ودعاة راسخين في العلوم الشرعية، يجمعون بين التقوى والورع ومحاسن الأخلاق، مع امتلاك الكفاءة العلمية والفكرية العالية لتوجيه الأمة وتفنيد الشبهات والأفكار المنحرفة.'
                        : isEn 
                        ? 'The primary mission of the Jamia is to nurture graduates who combine depth in sacred Islamic knowledge with piety, exemplary morals, and intellectual competence to address contemporary questions and serve humanity.'
                        : 'جامعہ کا بنیادی مشن یہ ہے کہ یہاں سے فارغ التحصیل ہونے والے طلبہ علومِ شرعیہ میں پختگی کے ساتھ ساتھ اخلاقِ حسنہ، تقویٰ، للہیت اور باطل نظریات کے رد کی مکمل صلاحیت رکھتے ہوں۔'}
                    </p>
                  </div>
                </div>
              )}

            </div>

          </div>
        </main>

      </div>

    </div>
  );
};


