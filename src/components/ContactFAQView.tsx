import React, { useState } from 'react';
import { useThemeLanguage } from '../context/ThemeLanguageContext';
import { 
  Phone, 
  Mail, 
  MapPin, 
  Send, 
  HelpCircle, 
  ChevronDown, 
  CheckCircle2, 
  MessageSquare,
  Clock,
  Map,
  ExternalLink,
  Navigation
} from 'lucide-react';

export const ContactFAQView: React.FC = () => {
  const { t } = useThemeLanguage();

  const [contactName, setContactName] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [sent, setSent] = useState(false);

  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const faqs = [
    {
      q: 'جامعہ اسلامیہ ایبٹ آباد میں داخلہ کا کیا طریقہ کار ہے؟',
      a: 'سالانہ داخلے شعبان المعظم اور شوال المکرم کے مہینوں میں ہوتے ہیں۔ طالب علم آن لائن فارم پر کر سکتے ہیں یا جامعہ کے دفترِ تعلیمات ایبٹ آباد میں بالمشافہ آ کر رجسٹریشن کروا سکتے ہیں۔'
    },
    {
      q: 'آن لائن فتویٰ کتنے دنوں میں موصول ہوتا ہے؟',
      a: 'دار الافتاء کے مفتیانِ کرام معمول کے مطابق ۲۴ سے ۴۸ گھنٹوں میں آن لائن فتویٰ کا جائزہ لے کر ای میل پر اور فتاویٰ پورٹل پر جواب ارسال کر دیتے ہیں۔'
    },
    {
      q: 'کیا جامعہ کی اسناد وفاق المدارس العربیہ سے منظور شدہ ہیں؟',
      a: 'جی ہاں، جامعہ اسلامیہ ایبٹ آباد وفاق المدارس العربیہ پاکستان سے الحاق شدہ ہے اور اس کی تمام اسناد اعلیٰ تعلیم کمیشن (HEC) سے ایم اے اور بی اے کے مساوی تسلیم شدہ ہیں۔'
    },
    {
      q: 'کیا جامعہ میں زکوۃ اور عطیات کی رسید ملتی ہے؟',
      a: 'جی ہاں، جامعہ کا اکاؤنٹنگ سسٹم کمپیوٹرائزڈ ہے اور ہر عطیہ یا زکوۃ پر فوری آفیشل وصولی رسید جاری کی جاتی ہے۔'
    }
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSent(true);
    setTimeout(() => {
      setSent(false);
      setContactName('');
      setContactEmail('');
      setSubject('');
      setMessage('');
    }, 4000);
  };

  return (
    <div className="space-y-10 font-sans text-right" dir="rtl">
      
      {/* Page Title & Hero Banner */}
      <div className="bg-gradient-to-br from-[#5C4632] via-[#4A3727] to-[#2C1F15] text-[#F8F4EC] rounded-3xl p-6 sm:p-10 shadow-xl border border-[#B88A3B]/40 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-64 h-64 bg-[#B88A3B]/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="relative z-10 max-w-3xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#B88A3B]/20 text-[#B88A3B] text-xs font-bold border border-[#B88A3B]/40">
            <MessageSquare className="w-4 h-4 text-[#B88A3B]" />
            <span className="font-urdu">رابطہ پورٹل</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-black font-urdu text-[#B88A3B] tracking-wide">
            رابطہ
          </h1>

          <p className="text-xs sm:text-sm text-[#F8F4EC]/90 leading-relaxed font-urdu max-w-2xl">
            جامعہ اسلامیہ ایبٹ آباد کے شعبہ انتظامیہ، تعلیمات، دار الافتاء اور مالیات سے رابطہ کے لیے درج ذیل معلومات استعمال کریں۔
          </p>
        </div>
      </div>

      {/* Grid: Contact Info & Form */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Contact Info Column */}
        <div className="space-y-6">
          <div className="bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
            
            <div className="border-b border-slate-200 dark:border-slate-800 pb-3">
              <h2 className="text-xl font-bold text-[#5C4632] dark:text-[#B88A3B] font-urdu">
                جامعہ اسلامیہ ایبٹ آباد کے رابطے
              </h2>
            </div>

            <div className="space-y-4 text-xs font-urdu">
              
              {/* Address */}
              <a 
                href="https://share.google/MQ6lwGzNpDfLePTkv" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-start gap-3 p-4 bg-[#F8F4EC] dark:bg-slate-800/80 hover:bg-[#F0EAE0] dark:hover:bg-slate-800 rounded-2xl border border-[#B88A3B]/30 shadow-xs transition-colors group cursor-pointer"
              >
                <MapPin className="w-5 h-5 text-[#B88A3B] shrink-0 mt-0.5 group-hover:scale-110 transition-transform" />
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <strong className="text-[#5C4632] dark:text-amber-300 block font-urdu text-sm font-bold">مرکزی پتہ:</strong>
                    <span className="text-[10px] bg-[#B88A3B]/20 text-[#5C4632] dark:text-amber-200 px-2 py-0.5 rounded-md font-sans">Google Map ↗</span>
                  </div>
                  <p className="text-slate-800 dark:text-slate-200 font-urdu leading-relaxed text-xs sm:text-sm font-bold">
                    جامعہ اسلامیہ، مری روڈ، کالا پل، ایبٹ آباد، خیبر پختونخوا، پاکستان
                  </p>
                </div>
              </a>

              {/* Telephone */}
              <div className="flex items-start gap-3 p-4 bg-[#F8F4EC] dark:bg-slate-800/80 rounded-2xl border border-[#B88A3B]/30 shadow-xs">
                <Phone className="w-5 h-5 text-[#B88A3B] shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <strong className="text-[#5C4632] dark:text-amber-300 block font-urdu text-sm font-bold">فون نمبر:</strong>
                  <div>
                    <a 
                      href="tel:03489002496" 
                      className="text-slate-900 dark:text-slate-100 hover:text-[#B88A3B] font-mono text-base font-extrabold dir-ltr inline-block tracking-wider transition-colors"
                    >
                      03489002496
                    </a>
                  </div>
                </div>
              </div>

              {/* Email */}
              <div className="flex items-start gap-3 p-4 bg-[#F8F4EC] dark:bg-slate-800/80 rounded-2xl border border-[#B88A3B]/30 shadow-xs">
                <Mail className="w-5 h-5 text-[#B88A3B] shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <strong className="text-[#5C4632] dark:text-amber-300 block font-urdu text-sm font-bold">ای میل:</strong>
                  <div className="text-slate-700 dark:text-slate-300 font-mono text-xs font-bold">
                    Coming Soon
                  </div>
                </div>
              </div>

            </div>

            {/* Office Hours */}
            <div className="bg-[#5C4632] text-[#F8F4EC] p-5 rounded-2xl border border-[#B88A3B] space-y-3 font-urdu shadow-sm">
              <div className="flex items-center gap-2 border-b border-[#B88A3B]/40 pb-2">
                <Clock className="w-4 h-4 text-[#B88A3B]" />
                <h3 className="font-bold text-sm text-[#B88A3B]">اوقاتِ کار (Office Hours):</h3>
              </div>
              
              <ul className="space-y-2 text-xs text-amber-100/90 leading-relaxed font-semibold">
                <li className="flex justify-between border-b border-[#B88A3B]/20 pb-1.5">
                  <span>پیر تا جمعرات:</span>
                  <span className="font-bold text-[#B88A3B]">8:00 صبح تا 5:00 شام</span>
                </li>
                <li className="flex justify-between border-b border-[#B88A3B]/20 pb-1.5">
                  <span>جمعہ:</span>
                  <span className="font-bold text-[#B88A3B]">8:00 صبح تا 12:00 دوپہر</span>
                </li>
                <li className="flex justify-between border-b border-[#B88A3B]/20 pb-1.5">
                  <span>ہفتہ:</span>
                  <span className="font-bold text-[#B88A3B]">8:00 صبح تا 2:00 دوپہر</span>
                </li>
                <li className="flex justify-between text-amber-300 font-bold pt-0.5">
                  <span>اتوار:</span>
                  <span className="text-red-300">تعطیل</span>
                </li>
              </ul>
            </div>

          </div>

          {/* Google Map Location Section */}
          <div className="bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Map className="w-5 h-5 text-[#B88A3B]" />
                <h3 className="font-bold text-base text-[#5C4632] dark:text-[#B88A3B] font-urdu">
                  گوگل میپ لوکیشن (Google Map Location)
                </h3>
              </div>
              <a
                href="https://share.google/MQ6lwGzNpDfLePTkv"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#5C4632] hover:bg-[#4A3727] text-[#F8F4EC] text-xs font-urdu font-bold transition-all shadow-xs"
              >
                <Navigation className="w-3.5 h-3.5 text-[#B88A3B]" />
                <span>گوگل میپ پر کھولیں</span>
                <ExternalLink className="w-3 h-3 opacity-80" />
              </a>
            </div>

            <div className="space-y-3 font-urdu">
              {/* Responsive Google Maps Iframe */}
              <div className="w-full h-64 sm:h-72 rounded-2xl overflow-hidden border border-[#B88A3B]/30 shadow-inner bg-slate-100 dark:bg-slate-800 relative">
                <iframe
                  title="جامعہ اسلامیہ ایبٹ آباد لوکیشن"
                  src="https://maps.google.com/maps?q=Jamia+Islamia+Abbottabad,+Murree+Road,+Kala+Pul,+Abbottabad&t=&z=15&ie=UTF8&iwloc=&output=embed"
                  className="w-full h-full border-0"
                  loading="lazy"
                  allowFullScreen
                  referrerPolicy="no-referrer-when-downgrade"
                ></iframe>
              </div>

              {/* Direct Location Link Info */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-3.5 bg-[#F8F4EC] dark:bg-slate-800/80 rounded-2xl border border-[#B88A3B]/30">
                <div className="flex items-center gap-2 text-right">
                  <MapPin className="w-4 h-4 text-[#B88A3B] shrink-0" />
                  <span className="text-xs font-urdu text-slate-800 dark:text-slate-200">
                    جامعہ اسلامیہ، مری روڈ، کالا پل، ایبٹ آباد
                  </span>
                </div>
                <a
                  href="https://share.google/MQ6lwGzNpDfLePTkv"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs font-mono font-bold text-[#5C4632] dark:text-[#B88A3B] hover:underline flex items-center gap-1 shrink-0 dir-ltr"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>https://share.google/MQ6lwGzNpDfLePTkv</span>
                </a>
              </div>
            </div>
          </div>

        </div>

        {/* Contact Form Column */}
        <div className="bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
          
          <div className="border-b border-slate-200 dark:border-slate-800 pb-3">
            <h2 className="text-xl font-bold text-[#5C4632] dark:text-[#B88A3B] font-urdu">
              پیغام ارسال کریں (Send Message)
            </h2>
            <p className="text-xs text-slate-500 font-urdu mt-1">
              اپنا سوال، پیغام یا استفسار تحریر کریں۔ انتظامیہ جلد آپ سے رابطہ کرے گی۔
            </p>
          </div>

          {sent ? (
            <div className="p-6 bg-emerald-50 dark:bg-emerald-950/80 border-2 border-emerald-500 rounded-2xl text-center space-y-2">
              <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto" />
              <div className="font-bold text-emerald-900 dark:text-emerald-100 font-urdu text-sm">
                آپ کا پیغام موصول ہو گیا ہے! ہم جلد رابطہ کریں گے۔
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4 text-xs font-sans">
              <div>
                <label className="block font-bold text-[#5C4632] dark:text-amber-300 font-urdu mb-1">
                  نام *
                </label>
                <input 
                  type="text" 
                  required
                  value={contactName}
                  onChange={(e) => setContactName(e.target.value)}
                  placeholder="اپنا نام درج کریں..."
                  className="w-full px-3 py-2.5 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-urdu focus:outline-none focus:border-[#B88A3B]"
                />
              </div>

              <div>
                <label className="block font-bold text-[#5C4632] dark:text-amber-300 font-urdu mb-1">
                  ای میل *
                </label>
                <input 
                  type="email" 
                  required
                  value={contactEmail}
                  onChange={(e) => setContactEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full px-3 py-2.5 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-mono focus:outline-none focus:border-[#B88A3B]"
                />
              </div>

              <div>
                <label className="block font-bold text-[#5C4632] dark:text-amber-300 font-urdu mb-1">
                  عنوان
                </label>
                <input 
                  type="text" 
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="موضوع..."
                  className="w-full px-3 py-2.5 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-urdu focus:outline-none focus:border-[#B88A3B]"
                />
              </div>

              <div>
                <label className="block font-bold text-[#5C4632] dark:text-amber-300 font-urdu mb-1">
                  تفصیلی پیغام *
                </label>
                <textarea 
                  rows={5}
                  required
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="اپنا پیغام تحریر کریں..."
                  className="w-full px-3 py-2.5 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-urdu focus:outline-none focus:border-[#B88A3B]"
                ></textarea>
              </div>

              <button 
                type="submit"
                className="w-full py-3 bg-[#5C4632] hover:bg-[#4A3727] text-amber-200 font-bold text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-2 font-urdu border border-[#B88A3B]/40"
              >
                <Send className="w-4 h-4 text-[#B88A3B]" />
                <span>پیغام روانہ کریں</span>
              </button>
            </form>
          )}
        </div>

      </div>

      {/* FAQs Section */}
      <div className="bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <div className="flex items-center gap-2 text-[#5C4632] dark:text-[#B88A3B] font-bold text-lg font-urdu border-b border-slate-200 dark:border-slate-800 pb-3">
          <HelpCircle className="w-5 h-5 text-[#B88A3B]" />
          <span>عام طور پر پوچھے جانے والے سوالات (FAQs)</span>
        </div>

        <div className="space-y-3 pt-2">
          {faqs.map((faq, idx) => {
            const isOpen = openFaq === idx;
            return (
              <div 
                key={idx}
                className="border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden"
              >
                <button 
                  onClick={() => setOpenFaq(isOpen ? null : idx)}
                  className="w-full p-4 text-right font-bold text-sm text-slate-900 dark:text-slate-100 font-urdu bg-[#F8F4EC] dark:bg-slate-800/60 flex items-center justify-between"
                >
                  <span>{faq.q}</span>
                  <ChevronDown className={`w-4 h-4 text-[#B88A3B] transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                </button>

                {isOpen && (
                  <div className="p-4 text-xs text-slate-700 dark:text-slate-300 font-urdu leading-relaxed bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
};
