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
  Layers, 
  Bookmark, 
  ChevronLeft,
  Award,
  HelpCircle,
  PhoneCall,
  HeartHandshake
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
      labelUrdu: 'حضرت بانیِ جامعہ رحمہ اللہ و اکابرین',
      labelArabic: 'مؤسس الجامعة وكبار العلماء',
      labelEnglish: 'Founder & Luminaries',
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
        return language === 'ur' ? 'حضرت بانیِ جامعہ رحمہ اللہ' : language === 'ar' ? 'مؤسس الجامعة رحمه الله' : 'Founder of the Jamia';
      case 'objectives':
        return language === 'ur' ? 'جامعہ کے اغراض و مقاصد' : language === 'ar' ? 'أهداف الجامعة وغاياتها' : 'Aims & Objectives';
      case 'administration':
        return language === 'ur' ? 'جامعہ کا نظم و نسق' : language === 'ar' ? 'إدارة الجامعة ومجلس الشورى' : 'Administration & Governance';
      case 'rules':
        return language === 'ur' ? 'ضروری ہدایات اور قواعد و ضوابط' : language === 'ar' ? 'التعليمات والقواعد والضوابط' : 'Rules & Guidelines';
      case 'departments':
        return language === 'ur' ? 'جامعہ کا نظامِ تعلیم' : language === 'ar' ? 'نظام التعليم والمناهج' : 'Academic & Education System';
      case 'expenses':
        return language === 'ur' ? 'جامعہ کے مصارف' : language === 'ar' ? 'مصارف الجامعة وأموال التبرعات' : 'Jamia Expenses & Funds';
      case 'overview':
      default:
        return language === 'ur' ? 'تعارفِ جامعہ' : language === 'ar' ? 'نبذة تعريفية عن الجامعة' : 'About Jamia Islamia';
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto py-2 sm:py-4 px-2 sm:px-4 font-urdu" dir={language === 'en' ? 'ltr' : 'rtl'}>
      
      {/* 1. TOP HEADER BANNER STRIP (عین تصویر کے مطابق روایتی اسلامی جیومیٹرک پیٹرن اور براؤن بارڈر کے ساتھ) */}
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

        {/* Main Title on the right (دائیں طرف تعارف جامعہ مع خوبصورت بار) */}
        <div className="flex items-center gap-3.5 relative z-10">
          <div className="w-2.5 sm:w-3 h-8 sm:h-9 bg-[#8C6239] rounded-xs shrink-0 shadow-xs"></div>
          <h1 className="text-2xl sm:text-3xl lg:text-[34px] font-black text-[#2B1B0E] dark:text-amber-100 tracking-wide font-urdu leading-tight">
            {getCurrentTitle()}
          </h1>
        </div>

        {/* Institutional Calligraphy Logo on the left (بغیر کسی سفید پس منظر کے خالص شفاف بلینڈنگ) */}
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
        
        {/* RIGHT COLUMN (in RTL): معلوماتی لنکس SIDEBAR WIDGET (موبائل پر نیچے اور ڈیسک ٹاپ پر سائیڈ میں) */}
        <aside className="order-2 lg:order-1 lg:col-span-4 xl:col-span-4 w-full space-y-5">
          
          {/* Main Informational Links Box */}
          <div className="bg-[#FAF7F0] dark:bg-slate-900 border border-[#D5C7B2] dark:border-slate-800 rounded-xs shadow-xs overflow-hidden">
            
            {/* Sidebar Header Bar */}
            <div className="bg-[#3C2E21] text-white px-4 py-3 flex items-center justify-between border-b-2 border-[#B88A3B]">
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

            {/* Sidebar Links List */}
            <ul className="divide-y divide-[#EADFCF] dark:divide-slate-800/80">
              {infoLinks.map((link) => {
                const isActive = currentSection === link.id;
                const IconComponent = link.icon;

                return (
                  <li key={link.id}>
                    <button
                      onClick={() => handleLinkClick(link.id, link.tabTarget)}
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
                          {language === 'ur' ? link.labelUrdu : language === 'ar' ? link.labelArabic : link.labelEnglish}
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

          {/* Quick Action Side Cards */}
          <div className="bg-[#FAF7F0] dark:bg-slate-900 border border-[#D5C7B2] dark:border-slate-800 p-4 rounded-xs shadow-xs space-y-3">
            <div className="flex items-center gap-2 text-[#3C2E21] dark:text-amber-300 font-bold border-b border-[#EADFCF] dark:border-slate-800 pb-2">
              <BookOpen className="w-5 h-5 text-[#B88A3B]" />
              <h3 className="text-base sm:text-lg font-urdu">
                {language === 'ur' ? 'دار الافتاء و آن لائن خدمات' : language === 'ar' ? 'دار الإفتاء والخدمات' : 'Online Services'}
              </h3>
            </div>
            <p className="text-sm sm:text-base text-stone-700 dark:text-stone-300 leading-[2.1] text-justify font-urdu">
              {language === 'ur' 
                ? 'اپنے شرعی و فقہی سوالات کے جوابات حاصل کرنے یا کتب و فتاویٰ کا مطالعہ کرنے کے لیے آن لائن پورٹل پر رجوع کریں۔' 
                : 'تفضل بزيارة البوابة الإلكترونية للحصول على الفتاوى الشرعية والاطلاع على المطبوعات.'}
            </p>
            <div className="pt-1 flex flex-col gap-2">
              <button
                onClick={() => onSelectTab && onSelectTab('fatwas')}
                className="w-full py-2 px-3 bg-[#3C2E21] hover:bg-[#5C4632] text-white text-sm sm:text-base font-bold rounded-xs transition-colors flex items-center justify-center gap-2 cursor-pointer font-urdu"
              >
                <span>{language === 'ur' ? 'آن لائن فتویٰ پوچھیں' : 'طلب فتوى شرعية'}</span>
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={() => onSelectTab && onSelectTab('library')}
                className="w-full py-2 px-3 bg-white dark:bg-slate-800 border border-[#B88A3B] text-[#3C2E21] dark:text-amber-200 hover:bg-[#F5EFE6] text-sm sm:text-base font-bold rounded-xs transition-colors flex items-center justify-center gap-2 cursor-pointer font-urdu"
              >
                <span>{language === 'ur' ? 'جامعہ کی مطبوعات و کتب' : 'مطبوعات الجامعة'}</span>
                <ChevronLeft className="w-4 h-4" />
              </button>
            </div>
          </div>

        </aside>

        {/* LEFT COLUMN (in RTL): MAIN CONTENT CANVAS (موبائل پر اوپر اور ڈیسک ٹاپ پر سائیڈ میں) */}
        <main className="order-1 lg:order-2 lg:col-span-8 xl:col-span-8 w-full">
          <div className="bg-white dark:bg-slate-900 border border-[#D5C7B2] dark:border-slate-800 rounded-xs p-5 sm:p-8 lg:p-10 shadow-xs space-y-6">
            
            {/* Centered Box Title (جس طرح تصویر میں بکس کے اندر عنوان ہے) */}
            <div className="text-center pb-2">
              <div className="inline-block border border-[#C5B59E] dark:border-slate-700 bg-[#FAF7F0] dark:bg-slate-800/80 px-8 sm:px-12 py-2 sm:py-2.5 rounded-xs shadow-xs">
                <h2 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-[#3C2E21] dark:text-amber-100 font-urdu tracking-wide">
                  {getCurrentTitle()}
                </h2>
              </div>
            </div>

            {/* Content Body based on Active Section */}
            <div className="pt-2">

              {/* ========================================= */}
              {/* 1. بانیِ جامعہ */}
              {/* ========================================= */}
              {currentSection === 'founder' && (
                <div className="space-y-6 font-urdu">
                  <div className="space-y-2 text-center sm:text-right border-b border-[#EADFCF] dark:border-slate-800 pb-4">
                    <h3 className="text-2xl sm:text-3xl font-black text-[#5C4632] dark:text-amber-200 leading-snug">
                      حضرت شیخ الحدیث مولانا فضل مولیٰ رحمہ اللہ
                    </h3>
                    <p className="text-base sm:text-lg text-[#B88A3B] dark:text-amber-400 font-bold">
                      (بانی و سرپرستِ اعلیٰ جامعہ اسلامیہ ایبٹ آباد — مدفون: مقبرۃ المعلیٰ، مکہ مکرمہ)
                    </p>
                  </div>

                  <p className="text-base sm:text-lg lg:text-xl text-stone-800 dark:text-stone-200 leading-[2.4] sm:leading-[2.6] text-justify">
                    جامعہ اسلامیہ ایبٹ آباد کی بنیاد حضرت شیخ الحدیث مولانا فضل مولیٰ رحمہ اللہ نے خالص دینی جذبے، اخلاص اور خدمتِ اسلام کے عظیم مقصد کے تحت رکھی۔ آپ نے اپنی پوری زندگی قرآن و سنت کی تعلیم، اصلاحِ معاشرہ اور دینی علوم کی اشاعت میں صرف کی۔
                  </p>

                  <div className="bg-[#FAF7F0] dark:bg-slate-800/50 p-5 border-r-4 border-[#B88A3B] rounded-xs space-y-3">
                    <h4 className="text-lg sm:text-xl font-bold text-[#3C2E21] dark:text-amber-200">
                      اکابرین و اساتذۂ کرام کا فیضان:
                    </h4>
                    <p className="text-base sm:text-lg text-stone-800 dark:text-stone-200 leading-[2.3] text-justify">
                      جامعہ اسلامیہ کو اکابر علمائے دیوبند، خصوصاً شیخ العرب والعجم حضرت مولانا سید حسین احمد مدنیؒ اور دیگر مشائخِ عظام کی خصوصی دعاؤں اور سرپرستی کا شرف حاصل رہا ہے۔
                    </p>
                  </div>

                  <div className="pt-4 border-t border-[#EADFCF] dark:border-slate-800 space-y-2">
                    <span className="text-base font-bold text-[#5C4632] dark:text-amber-300 block">
                      موجودہ مہتمم و سرپرست:
                    </span>
                    <h4 className="text-xl sm:text-2xl font-black text-[#3C2E21] dark:text-emerald-300">
                      حضرت مولانا مفتی رشید احمد صاحب دامت برکاتہم
                    </h4>
                  </div>
                </div>
              )}

              {/* ========================================= */}
              {/* 2. جامعہ کے اغراض و مقاصد */}
              {/* ========================================= */}
              {currentSection === 'objectives' && (
                <div className="space-y-6 font-urdu">
                  <p className="text-base sm:text-lg lg:text-xl text-stone-800 dark:text-stone-200 leading-[2.4] sm:leading-[2.6] text-justify">
                    جامعہ اسلامیہ ایبٹ آباد کا بنیادی مقصد ایسے علماء، فضلاء اور داعیانِ اسلام تیار کرنا ہے جو علم کے ساتھ تقویٰ، اخلاص، للہیت، حسنِ اخلاق اور خدمتِ دین کے جذبے سے آراستہ ہوں۔
                  </p>

                  <ul className="space-y-4 pt-1 text-base sm:text-lg lg:text-xl text-stone-800 dark:text-stone-200 leading-[2.3] sm:leading-[2.5]">
                    <li className="flex items-start gap-3">
                      <span className="text-[#B88A3B] text-xl font-black shrink-0 leading-none mt-1.5">•</span>
                      <span className="text-justify">جامعہ کا اہم مقصد ایسے علماء، واعظین، مفتیانِ کرام اور اسلامی مفکرین تیار کرنا ہے جو علومِ نبوت کے حامل اور ہر قسم کے تعصبات سے پاک ہوں۔</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-[#B88A3B] text-xl font-black shrink-0 leading-none mt-1.5">•</span>
                      <span className="text-justify">دوسری جامعات، مدارس اور علمی و تحقیقی اداروں کے ساتھ ہمدردی، تعاون اور حسنِ تعلق قائم رکھنا اور دینی و تعلیمی میدان میں ان سے تعاون کرنا۔</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-[#B88A3B] text-xl font-black shrink-0 leading-none mt-1.5">•</span>
                      <span className="text-justify">نئی نسل کو مذہب سے قریب کرنا اور دینی عقائد و اسلامی آداب و ثقافت سے روشناس کرانا۔</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-[#B88A3B] text-xl font-black shrink-0 leading-none mt-1.5">•</span>
                      <span className="text-justify">مسلمان عوام کی اصلاح و رہنمائی اور باطل عقائد، الحاد و لادینیت اور گمراہ کن نظریات کا علمی، تحقیقی اور فکری انداز میں سدِ باب کرنا۔</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-[#B88A3B] text-xl font-black shrink-0 leading-none mt-1.5">•</span>
                      <span className="text-justify">عربی اور اردو زبان میں دینی کتب، مقالات اور فتاویٰ کی اشاعت کے ذریعے امت مسلمہ کی رہنمائی کا فریضہ انجام دینا۔</span>
                    </li>
                  </ul>
                </div>
              )}

              {/* ========================================= */}
              {/* 3. جامعہ کا نظم و نسق */}
              {/* ========================================= */}
              {currentSection === 'administration' && (
                <div className="space-y-6 font-urdu">
                  <p className="text-base sm:text-lg lg:text-xl text-stone-800 dark:text-stone-200 leading-[2.4] sm:leading-[2.6] text-justify">
                    جامعہ کا انتظام ایک منظم اور باقاعدہ نظام کے تحت چلایا جاتا ہے۔ تمام تعلیمی، انتظامی اور مالی معاملات شریعت کے اصولوں، دیانت داری، شفافیت اور باہمی مشاورت کے مطابق انجام دیے جاتے ہیں۔
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                    <div className="bg-[#FAF7F0] dark:bg-slate-800/60 p-4 border border-[#D5C7B2] dark:border-slate-700 rounded-xs space-y-2">
                      <div className="flex items-center gap-2 text-[#3C2E21] dark:text-amber-300 font-bold">
                        <Building2 className="w-5 h-5 text-[#B88A3B]" />
                        <h4 className="text-lg font-urdu">مجلسِ شوریٰ و سرپرستی</h4>
                      </div>
                      <p className="text-sm sm:text-base text-stone-700 dark:text-stone-300 leading-[2.1] text-justify">
                        جامعہ کی پالیسی سازی، اہم تعلیمی اور انتظامی فیصلوں کے لیے جید علمائے کرام پر مشتمل باقاعدہ مجلسِ شوریٰ رہنمائی فراہم کرتی ہے۔
                      </p>
                    </div>

                    <div className="bg-[#FAF7F0] dark:bg-slate-800/60 p-4 border border-[#D5C7B2] dark:border-slate-700 rounded-xs space-y-2">
                      <div className="flex items-center gap-2 text-[#3C2E21] dark:text-amber-300 font-bold">
                        <ShieldCheck className="w-5 h-5 text-[#B88A3B]" />
                        <h4 className="text-lg font-urdu">تعلیمی و انتظامی نگران</h4>
                      </div>
                      <p className="text-sm sm:text-base text-stone-700 dark:text-stone-300 leading-[2.1] text-justify">
                        ناظمِ تعلیمات، ناظمِ دارالاقامہ اور شعبہ جاتی نگران اساتذہ طلبہ کی تدریس، تربیت اور اخلاقی نگرانی کی ہمہ وقت ذمہ داری نبھاتے ہیں۔
                      </p>
                    </div>
                  </div>

                  <p className="text-base sm:text-lg text-stone-800 dark:text-stone-200 leading-[2.3] text-justify">
                    جامعہ کے تمام اساتذہ اور عملہ تقویٰ، للہیت اور خلوص کے جذبے سے اپنی خدمات انجام دیتے ہیں تاکہ ایک مثالی اسلامی علمی ماحول قائم رہے۔
                  </p>
                </div>
              )}

              {/* ========================================= */}
              {/* 4. ضروری ہدایات اور قواعد و ضوابط */}
              {/* ========================================= */}
              {currentSection === 'rules' && (
                <div className="space-y-6 font-urdu">
                  <p className="text-base sm:text-lg lg:text-xl text-stone-800 dark:text-stone-200 leading-[2.4] sm:leading-[2.6] text-justify">
                    جامعہ اسلامیہ ایبٹ آباد میں داخل تمام طلبہ کرام کے لیے درج ذیل شرعی و انتظامی قواعد و ضوابط کی پابندی لازمی ہے:
                  </p>

                  <ul className="space-y-4 pt-1 text-base sm:text-lg lg:text-xl text-stone-800 dark:text-stone-200 leading-[2.3] sm:leading-[2.5]">
                    <li className="flex items-start gap-3">
                      <span className="text-[#B88A3B] text-xl font-black shrink-0 leading-none mt-1.5">•</span>
                      <span className="text-justify">پنجگانہ نمازوں کی باجماعت ادائیگی اور مسنون آداب و اخلاق کی پابندی ہر طالب علم کے لیے لازمی ہے۔</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-[#B88A3B] text-xl font-black shrink-0 leading-none mt-1.5">•</span>
                      <span className="text-justify">تعلیمی اوقات (اوقاتِ تدریس، مطالعہ اور تکرار) میں مکمل حاضری اور وقت کی پابندی ضروری ہے۔</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-[#B88A3B] text-xl font-black shrink-0 leading-none mt-1.5">•</span>
                      <span className="text-justify">دارالاقامہ (ہاسٹل) میں قیام کے دوران جامعہ کے مقررہ اوقاتِ آرام و طعام کی پاسداری کی جائے۔</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-[#B88A3B] text-xl font-black shrink-0 leading-none mt-1.5">•</span>
                      <span className="text-justify">غیر شرعی لباس، لایعنی مصروفیات اور سیاسی و فروعی تنازعات میں شمولیت کی قطعی اجازت نہیں ہے۔</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-[#B88A3B] text-xl font-black shrink-0 leading-none mt-1.5">•</span>
                      <span className="text-justify">کسی بھی قسم کی چھٹی کے لیے ناظمِ تعلیمات سے تحریری منظوری حاصل کرنا لازمی ہے۔</span>
                    </li>
                  </ul>
                </div>
              )}

              {/* ========================================= */}
              {/* 5. جامعہ کا نظامِ تعلیم و شعبہ جات */}
              {/* ========================================= */}
              {currentSection === 'departments' && (
                <div className="space-y-6 font-urdu">
                  <p className="text-base sm:text-lg lg:text-xl text-stone-800 dark:text-stone-200 leading-[2.4] sm:leading-[2.6] text-justify">
                    جامعہ اسلامیہ ایبٹ آباد وفاق المدارس العربیہ پاکستان سے باقاعدہ الحاق شدہ ہے، اور یہاں درجہ ابتدائیہ سے لے کر دورۂ حدیث شریف اور تخصص تک مکمل تعلیم دی جاتی ہے۔
                  </p>

                  <div className="space-y-3">
                    <div className="p-4 bg-[#FAF7F0] dark:bg-slate-800/60 border-r-4 border-[#B88A3B] rounded-xs">
                      <h4 className="text-lg font-bold text-[#3C2E21] dark:text-amber-200 mb-1">
                        ۱. شعبہ درسِ نظامی (عالم و فاضل کورس)
                      </h4>
                      <p className="text-sm sm:text-base text-stone-700 dark:text-stone-300 leading-[2.2]">
                        قرآن، حدیث، فقہ، اصولِ فقہ، عربی ادب، منطق و فلسفہ اور عقائد کی مستند تدریس۔
                      </p>
                    </div>

                    <div className="p-4 bg-[#FAF7F0] dark:bg-slate-800/60 border-r-4 border-[#B88A3B] rounded-xs">
                      <h4 className="text-lg font-bold text-[#3C2E21] dark:text-amber-200 mb-1">
                        ۲. شعبہ تخصص فی الافتاء (مفتی کورس)
                      </h4>
                      <p className="text-sm sm:text-base text-stone-700 dark:text-stone-300 leading-[2.2]">
                        جدید فقہی مسائل، فتاویٰ نویسی اور تدریب فی الافتاء کی اعلیٰ سطحی تربیت۔
                      </p>
                    </div>

                    <div className="p-4 bg-[#FAF7F0] dark:bg-slate-800/60 border-r-4 border-[#B88A3B] rounded-xs">
                      <h4 className="text-lg font-bold text-[#3C2E21] dark:text-amber-200 mb-1">
                        ۳. شعبہ حفظ و تجوید القرآن
                      </h4>
                      <p className="text-sm sm:text-base text-stone-700 dark:text-stone-300 leading-[2.2]">
                        صحیح مخارج، حسنِ قرات اور قراءاتِ سبعہ و عشرہ کے ساتھ مکمل حفظِ کلام اللہ۔
                      </p>
                    </div>
                  </div>

                  <div className="pt-2 text-center">
                    <button
                      onClick={() => onSelectTab && onSelectTab('departments')}
                      className="px-6 py-2.5 bg-[#3C2E21] hover:bg-[#5C4632] text-white font-bold rounded-xs transition-colors inline-flex items-center gap-2 cursor-pointer font-urdu text-base sm:text-lg"
                    >
                      <span>تمام شعبہ جات کی مکمل تفصیلات دیکھیں</span>
                      <ChevronLeft className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              )}

              {/* ========================================= */}
              {/* 6. جامعہ کے مصارف و فنڈز */}
              {/* ========================================= */}
              {currentSection === 'expenses' && (
                <div className="space-y-6 font-urdu">
                  <div className="bg-[#FAF7F0] dark:bg-slate-800/60 p-4 border border-[#D5C7B2] dark:border-slate-700 rounded-xs space-y-2">
                    <h4 className="text-xl font-bold text-[#5C4632] dark:text-amber-300">
                      جامعہ ایک خالص غیر سرکاری دینی ادارہ ہے
                    </h4>
                    <p className="text-base sm:text-lg text-stone-800 dark:text-stone-200 leading-[2.3] text-justify">
                      اس کی کوئی مستقل جاگیر نہیں اور نہ ہی حکومت سے کوئی مالی امداد وصول کی جاتی ہے۔ تمام اخراجات اللہ تعالیٰ کے فضل و کرم سے اہلِ خیر کے عطیات، صدقات اور زکوٰۃ سے پورے ہوتے ہیں۔
                    </p>
                  </div>

                  <ul className="space-y-4 pt-1 text-base sm:text-lg lg:text-xl text-stone-800 dark:text-stone-200 leading-[2.3] sm:leading-[2.5]">
                    <li className="flex items-start gap-3">
                      <span className="text-[#B88A3B] text-xl font-black shrink-0 leading-none mt-1.5">•</span>
                      <span className="text-justify">طلبہ کے لیے مفت تعلیم، رہائش، طعام اور کتب کی فراہمی۔</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-[#B88A3B] text-xl font-black shrink-0 leading-none mt-1.5">•</span>
                      <span className="text-justify">اساتذہ و ملازمین کے مشاہرات اور بنیادی ضروریات کی کفالت۔</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-[#B88A3B] text-xl font-black shrink-0 leading-none mt-1.5">•</span>
                      <span className="text-justify">جامعہ کی عمارات کی تعمیر، توسیع، بجلی، پانی اور صفائی کے اخراجات۔</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-[#B88A3B] text-xl font-black shrink-0 leading-none mt-1.5">•</span>
                      <span className="text-justify">جامعہ میں مستقل حسابات کا شعبہ موجود ہے جہاں آمدن اور خرچ کا مکمل ریکارڈ محفوظ رکھا جاتا ہے۔</span>
                    </li>
                  </ul>

                  <div className="p-4 bg-amber-50/80 dark:bg-amber-950/30 border-r-4 border-[#B88A3B] text-stone-800 dark:text-stone-200 font-bold text-base sm:text-lg leading-[2.3]">
                    جامعہ کی خدمت صدقۂ جاریہ ہے، لہٰذا صرف حلال اور پاکیزہ مال سے اپنے عطیات و زکوٰۃ جمع کروائیں۔
                  </div>
                </div>
              )}

              {/* ========================================= */}
              {/* 7. تعارف جامعہ (Overview) */}
              {/* ========================================= */}
              {currentSection === 'overview' && (
                <div className="space-y-6 font-urdu">
                  <p className="text-base sm:text-lg lg:text-xl text-stone-800 dark:text-stone-200 leading-[2.4] sm:leading-[2.6] text-justify">
                    جامعہ اسلامیہ ایبٹ آباد پاکستان ایک ممتاز دینی، علمی اور تحقیقی ادارہ ہے جو گزشتہ کئی دہائیوں سے قرآن و سنت کی تعلیم، دینی علوم کی اشاعت، اصلاحِ معاشرہ اور امت مسلمہ کی رہنمائی کا عظیم فریضہ انجام دے رہا ہے۔
                  </p>

                  <div className="space-y-4 text-base sm:text-lg lg:text-xl text-stone-800 dark:text-stone-200 leading-[2.3] sm:leading-[2.5]">
                    <p className="text-justify">
                      جامعہ میں درسِ نظامی (شہادتِ عالمیہ ایم اے عربی و اسلامیات کے مساوی)، شعبہ حفظ و تجوید، اور تخصص فی الافتاء سمیت مختلف تعلیمی و تربیتی شعبہ جات قائم ہیں۔
                    </p>
                    <p className="text-justify">
                      جامعہ کا بنیادی مشن یہ ہے کہ یہاں سے فارغ التحصیل ہونے والے طلبہ علومِ شرعیہ میں پختگی کے ساتھ ساتھ اخلاقِ حسنہ، تقویٰ، للہیت اور باطل نظریات کے رد کی مکمل صلاحیت رکھتے ہوں۔
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

