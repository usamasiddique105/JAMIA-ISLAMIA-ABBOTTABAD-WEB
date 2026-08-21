import React from 'react';
import { motion } from 'motion/react';
import { useThemeLanguage } from '../context/ThemeLanguageContext';
import { ChevronUp, ChevronLeft, Lock } from 'lucide-react';
import headerLogoCalligraphy from '../assets/images/jamia_logo_calligraphy_transparent.png';
import { JAMIA_HEADER_LOGO_DATA_URI } from '../assets/logoBase64';

interface FooterProps {
  setCurrentTab: (tab: string) => void;
  onOpenFatwaModal: () => void;
}

export const Footer: React.FC<FooterProps> = ({ setCurrentTab, onOpenFatwaModal }) => {
  const { language } = useThemeLanguage();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer 
      className="text-[#E0D8C7] relative overflow-hidden font-urdu border-t-2 border-[#38261A]"
      style={{
        backgroundColor: '#1E1611',
        backgroundImage: `
          radial-gradient(circle at 50% 50%, rgba(54, 40, 28, 0.45) 0%, rgba(20, 14, 10, 0.95) 100%),
          url("data:image/svg+xml,%3Csvg width='80' height='80' viewBox='0 0 80 80' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23B89B72' fill-opacity='0.055' fill-rule='evenodd'%3E%3Cpath d='M0 40L40 0l40 40-40 40L0 40zm40-28.284L11.716 40 40 68.284 68.284 40 40 11.716zM40 20L20 40l20 20 20-20-20-20zm0 8.485L28.485 40 40 51.515 51.515 40 40 28.485z'/%3E%3Ccircle cx='40' cy='40' r='4'/%3E%3Cpath d='M0 0l20 20L0 40V0zm80 0L60 20l20 20V0zM0 80l20-20L0 40v40zm80 0L60 60l20-20v40z'/%3E%3C/g%3E%3C/svg%3E")
        `,
        backgroundRepeat: 'repeat'
      }}
    >
      <div className="max-w-[1350px] mx-auto px-6 py-12 relative z-10">
        
        {/* 3-Column Grid matching reference image layout */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10 pb-10 border-b border-[#3D2B1E]" dir={language === 'en' ? 'ltr' : 'rtl'}>
          
          {/* Column 1: ویب سائٹ کا نقشہ */}
          <motion.div 
            initial={{ opacity: 0, y: 35 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.15 }}
            transition={{ duration: 0.75, delay: 0.08, ease: [0.25, 0.1, 0.25, 1] }}
            className="space-y-4"
          >
            <h3 className="text-xl sm:text-2xl font-bold font-urdu text-white border-b border-[#3D2B1E] pb-2">
              {language === 'ar' ? 'خريطة الموقع' : language === 'en' ? 'Site Navigation' : 'ویب سائٹ کا نقشہ'}
            </h3>
            <ul className="space-y-2.5 text-sm sm:text-base font-urdu text-[#D1C7B3]">
              <li>
                <button 
                  onClick={() => { setCurrentTab('home'); scrollToTop(); }}
                  className="hover:text-white transition-colors flex items-center gap-2 cursor-pointer group"
                >
                  <ChevronLeft className="w-4 h-4 text-[#D1C7B3] group-hover:text-white transition-colors shrink-0" />
                  <span>{language === 'ar' ? 'الصفحة الرئيسية' : language === 'en' ? 'Home' : 'صفحہ اول'}</span>
                </button>
              </li>
              <li>
                <button 
                  onClick={() => { setCurrentTab('about'); scrollToTop(); }}
                  className="hover:text-white transition-colors flex items-center gap-2 cursor-pointer group"
                >
                  <ChevronLeft className="w-4 h-4 text-[#D1C7B3] group-hover:text-white transition-colors shrink-0" />
                  <span>{language === 'ar' ? 'عن الجامعة' : language === 'en' ? 'About Us' : 'تعارف'}</span>
                </button>
              </li>
              <li>
                <button 
                  onClick={() => { setCurrentTab('fatwas'); scrollToTop(); }}
                  className="hover:text-white transition-colors flex items-center gap-2 cursor-pointer group"
                >
                  <ChevronLeft className="w-4 h-4 text-[#D1C7B3] group-hover:text-white transition-colors shrink-0" />
                  <span>{language === 'ar' ? 'دار الإفتاء' : language === 'en' ? 'Darul Ifta' : 'دار الافتاء'}</span>
                </button>
              </li>
              <li>
                <button 
                  onClick={() => { setCurrentTab('library'); scrollToTop(); }}
                  className="hover:text-white transition-colors flex items-center gap-2 cursor-pointer group"
                >
                  <ChevronLeft className="w-4 h-4 text-[#D1C7B3] group-hover:text-white transition-colors shrink-0" />
                  <span>{language === 'ar' ? 'المكتبة والكتب' : language === 'en' ? 'Books Library' : 'کتابیں'}</span>
                </button>
              </li>
              <li>
                <button 
                  onClick={() => { setCurrentTab('fatwa-names'); scrollToTop(); }}
                  className="hover:text-white transition-colors flex items-center gap-2 cursor-pointer group"
                >
                  <ChevronLeft className="w-4 h-4 text-[#D1C7B3] group-hover:text-white transition-colors shrink-0" />
                  <span>{language === 'ar' ? 'الأسماء الإسلامية' : language === 'en' ? 'Islamic Names' : 'اسلامی نام'}</span>
                </button>
              </li>
            </ul>
          </motion.div>

          {/* Column 3: شعبہ جات (موبائل سکرین پر پوشیدہ تاکہ زیادہ جگہ نہ لے) */}
          <motion.div 
            initial={{ opacity: 0, y: 35 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.15 }}
            transition={{ duration: 0.75, delay: 0.16, ease: [0.25, 0.1, 0.25, 1] }}
            className="hidden sm:block space-y-4"
          >
            <h3 className="text-xl sm:text-2xl font-bold font-urdu text-white border-b border-[#3D2B1E] pb-2">
              {language === 'ar' ? 'الأقسام والخدمات' : language === 'en' ? 'Departments & Portals' : 'شعبہ جات'}
            </h3>
            <ul className="space-y-2.5 text-sm sm:text-base font-urdu text-[#D1C7B3]">
              <li>
                <button 
                  onClick={onOpenFatwaModal}
                  className="hover:text-white transition-colors flex items-center gap-2 cursor-pointer group"
                >
                  <ChevronLeft className="w-4 h-4 text-[#D1C7B3] group-hover:text-white transition-colors shrink-0" />
                  <span>{language === 'ar' ? 'استفتاء شرعي (اسأل مسألة)' : language === 'en' ? 'Ask a Fatwa' : 'مسئلہ پوچھیں'}</span>
                </button>
              </li>
              <li>
                <button 
                  onClick={onOpenFatwaModal}
                  className="hover:text-white transition-colors flex items-center gap-2 cursor-pointer group"
                >
                  <ChevronLeft className="w-4 h-4 text-[#D1C7B3] group-hover:text-white transition-colors shrink-0" />
                  <span>{language === 'ar' ? 'تفسير الرؤى والأحلام' : language === 'en' ? 'Dream Interpretation' : 'خواب کی تعبیر معلوم کریں'}</span>
                </button>
              </li>
              <li>
                <button 
                  onClick={() => { setCurrentTab('fatwa-duas'); scrollToTop(); }}
                  className="hover:text-white transition-colors flex items-center gap-2 cursor-pointer group"
                >
                  <ChevronLeft className="w-4 h-4 text-[#D1C7B3] group-hover:text-white transition-colors shrink-0" />
                  <span>{language === 'ar' ? 'الأدعية المأثورة' : language === 'en' ? 'Masnoon Duas' : 'مسنون و ماثور دعائیں'}</span>
                </button>
              </li>
              <li>
                <button 
                  onClick={() => { setCurrentTab('home'); scrollToTop(); }}
                  className="hover:text-white transition-colors flex items-center gap-2 cursor-pointer group"
                >
                  <ChevronLeft className="w-4 h-4 text-[#D1C7B3] group-hover:text-white transition-colors shrink-0" />
                  <span>{language === 'ar' ? 'مواقيت الصلاة' : language === 'en' ? 'Prayer Times' : 'نماز کے اوقات'}</span>
                </button>
              </li>
              <li>
                <button 
                  onClick={() => { setCurrentTab('contact'); scrollToTop(); }}
                  className="hover:text-white transition-colors flex items-center gap-2 cursor-pointer group"
                >
                  <ChevronLeft className="w-4 h-4 text-[#D1C7B3] group-hover:text-white transition-colors shrink-0" />
                  <span>{language === 'ar' ? 'الاتصال بنا' : language === 'en' ? 'Contact' : 'رابطہ'}</span>
                </button>
              </li>
              <li>
                <button 
                  onClick={() => { setCurrentTab('donations'); scrollToTop(); }}
                  className="hover:text-white transition-colors flex items-center gap-2 cursor-pointer group"
                >
                  <ChevronLeft className="w-4 h-4 text-[#D1C7B3] group-hover:text-white transition-colors shrink-0" />
                  <span>{language === 'ar' ? 'بوابة التبرعات' : language === 'en' ? 'Online Donations' : 'طریقہ تعاون'}</span>
                </button>
              </li>
            </ul>
          </motion.div>

          {/* Column 4 (Far Left in RTL): Calligraphy Header & Contact Info */}
          <motion.div 
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.15 }}
            transition={{ duration: 0.75, delay: 0.22, ease: [0.25, 0.1, 0.25, 1] }}
            className="space-y-4 text-[#D1C7B3]"
          >
            {/* Calligraphic Logo / Header matching screenshot */}
            <div className="text-right">
              <img 
                src={JAMIA_HEADER_LOGO_DATA_URI || headerLogoCalligraphy} 
                alt="جامعہ اسلامیہ ایبٹ آباد" 
                className="h-10 sm:h-12 w-auto max-w-full object-contain brightness-0 invert opacity-90 ml-auto"
                onError={(e) => {
                  const target = e.currentTarget;
                  target.src = JAMIA_HEADER_LOGO_DATA_URI || '/jamia_logo_calligraphy_transparent.png';
                }}
              />
              <div className="text-xs font-urdu text-[#B8A68A] font-semibold tracking-wide mt-1 text-right">
                خیبر پختونخوا، پاکستان
              </div>
            </div>

            <div className="space-y-2 text-sm sm:text-base font-mono text-[#D1C7B3] pt-2 text-right">
              <div>P.O. Box : 22010. Abbottabad, Pakistan</div>
              <div dir="ltr" className="text-right">+923489002496</div>
              <div>JamiaIslamaiAbottabad.com</div>
            </div>

            {/* Admin Portal Access (Discreet Admin Login Button) */}
            <div className="pt-2 text-right">
              <button
                onClick={() => {
                  setCurrentTab('admin');
                  scrollToTop();
                }}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#38261A]/80 hover:bg-[#5C4632] border border-[#5C4632] hover:border-[#B88A3B] text-[#D1C7B3] hover:text-white transition-all text-xs font-urdu shadow-sm cursor-pointer"
                title="ایڈمن پورٹل لاگ ان"
              >
                <Lock className="w-3.5 h-3.5 text-[#B88A3B]" />
                <span>{language === 'ar' ? 'بوابة المشرف' : language === 'en' ? 'Admin Portal' : 'ایڈمن پورٹل'}</span>
              </button>
            </div>
          </motion.div>

        </div>

        {/* Bottom Bar: Back to top button on Left, Donation Link in Center */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.15 }}
          transition={{ duration: 0.75, delay: 0.25, ease: [0.25, 0.1, 0.25, 1] }}
          className="pt-8 flex items-center justify-between relative" 
          dir={language === 'en' ? 'ltr' : 'rtl'}
        >
          {/* Center Donation Link replacing plain name */}
          <div className="w-full text-center font-urdu text-sm sm:text-base md:text-lg text-[#E5DCB8] px-12 sm:px-0 leading-relaxed">
            {language === 'ar' 
              ? 'للتعاون مع الجامعة في الصدقات والتبرعات وأموال الزكاة وبناء المرافق ' 
              : language === 'en' 
              ? 'For donations, Zakat, Sadaqah, and development funds for Jamia ' 
              : 'جامعہ سے صدقات، خیرات، عطیات اور زکوٰۃ وغیرہ کی مد میں تعاون کے لیے '}
            <button 
              onClick={() => { setCurrentTab('donations'); scrollToTop(); }}
              className="text-[#E0B266] hover:text-white underline font-bold cursor-pointer transition-colors mx-1"
            >
              {language === 'ar' ? 'اضغط هنا.' : language === 'en' ? 'click here.' : 'یہاں پر کلک کریں۔'}
            </button>
          </div>

          {/* Left Corner Scroll-to-Top Button */}
          <button 
            onClick={scrollToTop}
            title={language === 'ar' ? 'إلى الأعلى' : language === 'en' ? 'Back to top' : 'اوپر جائیں'}
            className="absolute left-0 top-6 w-11 h-11 bg-[#5C4632] hover:bg-[#72573F] text-white flex items-center justify-center rounded-sm transition-colors cursor-pointer shadow-md border border-[#7D5F44]"
          >
            <ChevronUp className="w-6 h-6" />
          </button>
        </motion.div>

      </div>
    </footer>
  );
};

