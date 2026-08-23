import React, { useState } from 'react';
import { useThemeLanguage } from '../context/ThemeLanguageContext';
import { NotificationService } from '../services/notificationService';
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
  Navigation,
  MessageCircle
} from 'lucide-react';

export const ContactFAQView: React.FC = () => {
  const { language } = useThemeLanguage();
  const isEn = language === 'en';
  const isAr = language === 'ar';

  const fontClass = isAr ? 'font-arabic' : isEn ? 'font-sans' : 'font-urdu';

  const [contactName, setContactName] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [sent, setSent] = useState(false);
  const [whatsappUrl, setWhatsappUrl] = useState('');

  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const faqs = [
    {
      q: {
        ur: 'جامعہ اسلامیہ ایبٹ آباد میں داخلہ کا کیا طریقہ کار ہے؟',
        ar: 'ما هي إجراءات القبول والتسجيل في الجامعة الإسلامية بأيبت آباد؟',
        en: 'What is the admission procedure at Jamia Islamia Abbottabad?'
      },
      a: {
        ur: 'سالانہ داخلے شعبان المعظم اور شوال المکرم کے مہینوں میں ہوتے ہیں۔ طالب علم آن لائن فارم پر کر سکتے ہیں یا جامعہ کے دفترِ تعلیمات ایبٹ آباد میں بالمشافہ آ کر رجسٹریشن کروا سکتے ہیں۔',
        ar: 'تُجرى اختبارات القبول السنوية في شهري شعبان وشوال. يمكن للطلاب تقديم طلب التسجيل عبر الموقع الإلكتروني أو مراجعة إدارة التعليم والشؤون الأكاديمية بالجامعة شخصياً.',
        en: 'Annual admissions take place during the months of Shaban and Shawwal. Prospective students may submit an online application or visit the Academic Department office in Abbottabad in person.'
      }
    },
    {
      q: {
        ur: 'آن لائن فتویٰ کتنے دنوں میں موصول ہوتا ہے؟',
        ar: 'كم يستغرق استلام الفتوى عبر الموقع الإلكتروني؟',
        en: 'How long does it take to receive an online Fatwa response?'
      },
      a: {
        ur: 'دار الافتاء کے مفتیانِ کرام معمول کے مطابق ۲۴ سے ۴۸ گھنٹوں میں آن لائن فتویٰ کا جائزہ لے کر ای میل پر اور فتاویٰ پورٹل پر جواب ارسال کر دیتے ہیں۔',
        ar: 'يقوم أصحاب الفضيلة المفتون بدار الإفتاء بمراجعة الاستفتاءات الإلكترونية وصياغة الفتوى المعتمدة خلال ۲۴ إلى ٤٨ ساعة عادةً وإرسالها عبر البريد وبوابة الفتاوى.',
        en: 'Our accredited Muftis at Darul Ifta typically review, research, and dispatch official rulings within 24 to 48 hours via email and the online portal.'
      }
    },
    {
      q: {
        ur: 'کیا جامعہ کی اسناد وفاق المدارس العربیہ سے منظور شدہ ہیں؟',
        ar: 'هل شهادات الجامعة معتمدة من وفاق المدارس وهيئة التعليم العالي؟',
        en: 'Are Jamia certificates accredited by Wifaqul Madaris and HEC?'
      },
      a: {
        ur: 'جی ہاں، جامعہ اسلامیہ ایبٹ آباد وفاق المدارس العربیہ پاکستان سے الحاق شدہ ہے اور اس کی تمام اسناد اعلیٰ تعلیم کمیشن (HEC) سے ایم اے اور بی اے کے مساوی تسلیم شدہ ہیں۔',
        ar: 'نعم، الجامعة الإسلامية بأيبت آباد مسجلة رسمياً تحت مظلة وفاق المدارس العربية بباكستان، وجميع شهاداتها معترف بها ومعادلة لشهادات البكالوريوس والماجستير من هيئة التعليم العالي (HEC).',
        en: 'Yes, Jamia Islamia Abbottabad is officially affiliated with Wifaqul Madaris Al-Arabia Pakistan, and its certificates are formally recognized as equivalent to MA/BA degrees by the Higher Education Commission (HEC).'
      }
    },
    {
      q: {
        ur: 'کیا جامعہ میں زکوۃ اور عطیات کی رسید ملتی ہے؟',
        ar: 'هل يتم إصدار سندات قبض رسمية للزكاة والتبرعات؟',
        en: 'Does Jamia provide official receipts for Zakat and donations?'
      },
      a: {
        ur: 'جی ہاں، جامعہ کا اکاؤنٹنگ سسٹم کمپیوٹرائزڈ ہے اور ہر عطیہ یا زکوۃ پر فوری آفیشل وصولی رسید جاری کی جاتی ہے۔',
        ar: 'نعم، النظام المالي للجامعة محوسب وموثق بالكامل، ويتم إصدار إيصالات استلام رسمية ومختومة لجميع التبرعات وأموال الزكاة والصدقات فوراً.',
        en: 'Yes, Jamia maintains a fully computerized and audited accounting system; verified official receipts are generated and provided for all Zakat and general contributions.'
      }
    }
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await NotificationService.sendContactInquiryNotification({
        name: contactName,
        email: contactEmail,
        phone: phone || undefined,
        subject: subject || (isAr ? 'رسالة تواصل من الموقع' : isEn ? 'Website Contact Form Inquiry' : 'ویب سائٹ رابطہ فارم'),
        message
      });
      setWhatsappUrl(res.whatsappUrl);
    } catch (err) {
      console.error('Inquiry notification error:', err);
    }
    setSent(true);
  };

  return (
    <div className={`space-y-10 ${fontClass} ${isEn ? 'text-left' : 'text-right'}`} dir={isEn ? 'ltr' : 'rtl'}>
      
      {/* Page Title & Hero Banner */}
      <div className="bg-gradient-to-br from-[#5C4632] via-[#4A3727] to-[#2C1F15] text-[#F8F4EC] rounded-3xl p-6 sm:p-10 shadow-xl border border-[#B88A3B]/40 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-64 h-64 bg-[#B88A3B]/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="relative z-10 max-w-3xl space-y-3">
          <div className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#B88A3B]/20 text-[#B88A3B] text-xs font-bold border border-[#B88A3B]/40 ${fontClass}`}>
            <MessageSquare className="w-4 h-4 text-[#B88A3B]" />
            <span>
              {isAr ? 'بوابة التواصل والاستفسار' : isEn ? 'Contact Portal' : 'رابطہ پورٹل'}
            </span>
          </div>

          <h1 className={`text-3xl sm:text-4xl font-black ${fontClass} text-[#B88A3B] tracking-wide`}>
            {isAr ? 'اتصل بنا والتواصل المؤسسي' : isEn ? 'Contact Us' : 'رابطہ'}
          </h1>

          <p className={`text-xs sm:text-sm text-[#F8F4EC]/90 leading-relaxed ${fontClass} max-w-2xl`}>
            {isAr 
              ? 'للتواصل مع إدارة الجامعة، الشؤون التعليمية، دار الإفتاء، أو قسم التبرعات والمالية، يرجى الاستفادة من قنوات الاتصال أدناه.' 
              : isEn 
              ? 'Use the contact channels below to reach Jamia Islamia Abbottabad Administration, Academic Affairs, Darul Ifta, or Finance & Admissions.' 
              : 'جامعہ اسلامیہ ایبٹ آباد کے شعبہ انتظامیہ، تعلیمات، دار الافتاء اور مالیات سے رابطہ کے لیے درج ذیل معلومات استعمال کریں۔'}
          </p>
        </div>
      </div>

      {/* Grid: Contact Info & Form */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Contact Info Column */}
        <div className="space-y-6">
          <div className="bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
            
            <div className="border-b border-slate-200 dark:border-slate-800 pb-3">
              <h2 className={`text-xl font-bold text-[#5C4632] dark:text-[#B88A3B] ${fontClass}`}>
                {isAr ? 'معلومات التواصل المباشر' : isEn ? 'Institutional Contacts' : 'جامعہ اسلامیہ ایبٹ آباد کے رابطے'}
              </h2>
            </div>

            <div className={`space-y-4 text-xs ${fontClass}`}>
              
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
                    <strong className={`text-[#5C4632] dark:text-amber-300 block ${fontClass} text-sm font-bold`}>
                      {isAr ? 'الموقع والعنوان الرئيسي:' : isEn ? 'Campus Address:' : 'مرکزی پتہ:'}
                    </strong>
                    <span className="text-[10px] bg-[#B88A3B]/20 text-[#5C4632] dark:text-amber-200 px-2 py-0.5 rounded-md font-sans">Google Map ↗</span>
                  </div>
                  <p className={`text-slate-800 dark:text-slate-200 ${fontClass} leading-relaxed text-xs sm:text-sm font-bold`}>
                    {isAr 
                      ? 'الجامعة الإسلامية، طريق مري، كالا بل، أيبت آباد، خيبر بختونخوا، باكستان' 
                      : isEn 
                      ? 'Jamia Islamia, Murree Road, Kala Pul, Abbottabad, Khyber Pakhtunkhwa, Pakistan' 
                      : 'جامعہ اسلامیہ، مری روڈ، کالا پل، ایبٹ آباد، خیبر پختونخوا، پاکستان'}
                  </p>
                </div>
              </a>

              {/* Telephone */}
              <div className="flex items-start gap-3 p-4 bg-[#F8F4EC] dark:bg-slate-800/80 rounded-2xl border border-[#B88A3B]/30 shadow-xs">
                <Phone className="w-5 h-5 text-[#B88A3B] shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <strong className={`text-[#5C4632] dark:text-amber-300 block ${fontClass} text-sm font-bold`}>
                    {isAr ? 'رقم الهاتف / الواتساب:' : isEn ? 'Phone / WhatsApp:' : 'فون نمبر:'}
                  </strong>
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
                  <strong className={`text-[#5C4632] dark:text-amber-300 block ${fontClass} text-sm font-bold`}>
                    {isAr ? 'البريد الإلكتروني:' : isEn ? 'Email Address:' : 'ای میل:'}
                  </strong>
                  <div className="text-slate-700 dark:text-slate-300 font-mono text-xs font-bold">
                    Coming Soon
                  </div>
                </div>
              </div>

            </div>

            {/* Office Hours */}
            <div className={`bg-[#5C4632] text-[#F8F4EC] p-5 rounded-2xl border border-[#B88A3B] space-y-3 ${fontClass} shadow-sm`}>
              <div className="flex items-center gap-2 border-b border-[#B88A3B]/40 pb-2">
                <Clock className="w-4 h-4 text-[#B88A3B]" />
                <h3 className="font-bold text-sm text-[#B88A3B]">
                  {isAr ? 'أوقات الدوام الرسمي:' : isEn ? 'Office Hours:' : 'اوقاتِ کار (Office Hours):'}
                </h3>
              </div>
              
              <ul className="space-y-2 text-xs text-amber-100/90 leading-relaxed font-semibold">
                <li className="flex justify-between border-b border-[#B88A3B]/20 pb-1.5">
                  <span>{isAr ? 'من الإثنين إلى الخميس:' : isEn ? 'Monday – Thursday:' : 'پیر تا جمعرات:'}</span>
                  <span className="font-bold text-[#B88A3B]">
                    {isAr ? '٨:٠٠ ص - ٥:٠٠ م' : isEn ? '8:00 AM – 5:00 PM' : '8:00 صبح تا 5:00 شام'}
                  </span>
                </li>
                <li className="flex justify-between border-b border-[#B88A3B]/20 pb-1.5">
                  <span>{isAr ? 'الجمعة:' : isEn ? 'Friday:' : 'جمعہ:'}</span>
                  <span className="font-bold text-[#B88A3B]">
                    {isAr ? '٨:٠٠ ص - ١٢:٠٠ ظهراً' : isEn ? '8:00 AM – 12:00 PM' : '8:00 صبح تا 12:00 دوپہر'}
                  </span>
                </li>
                <li className="flex justify-between border-b border-[#B88A3B]/20 pb-1.5">
                  <span>{isAr ? 'السبت:' : isEn ? 'Saturday:' : 'ہفتہ:'}</span>
                  <span className="font-bold text-[#B88A3B]">
                    {isAr ? '٨:٠٠ ص - ٢:٠٠ م' : isEn ? '8:00 AM – 2:00 PM' : '8:00 صبح تا 2:00 دوپہر'}
                  </span>
                </li>
                <li className="flex justify-between text-amber-300 font-bold pt-0.5">
                  <span>{isAr ? 'الأحد:' : isEn ? 'Sunday:' : 'اتوار:'}</span>
                  <span className="text-red-300">{isAr ? 'عطلة أسبوعية' : isEn ? 'Closed' : 'تعطیل'}</span>
                </li>
              </ul>
            </div>

          </div>

          {/* Google Map Location Section */}
          <div className="bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Map className="w-5 h-5 text-[#B88A3B]" />
                <h3 className={`font-bold text-base text-[#5C4632] dark:text-[#B88A3B] ${fontClass}`}>
                  {isAr ? 'خريطة الموقع الجغرافي' : isEn ? 'Google Map Location' : 'گوگل میپ لوکیشن (Google Map Location)'}
                </h3>
              </div>
              <a
                href="https://share.google/MQ6lwGzNpDfLePTkv"
                target="_blank"
                rel="noopener noreferrer"
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#5C4632] hover:bg-[#4A3727] text-[#F8F4EC] text-xs ${fontClass} font-bold transition-all shadow-xs`}
              >
                <Navigation className="w-3.5 h-3.5 text-[#B88A3B]" />
                <span>{isAr ? 'فتح على الخريطة' : isEn ? 'Open in Google Maps' : 'گوگل میپ پر کھولیں'}</span>
                <ExternalLink className="w-3 h-3 opacity-80" />
              </a>
            </div>

            <div className={`space-y-3 ${fontClass}`}>
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
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-[#B88A3B] shrink-0" />
                  <span className={`text-xs ${fontClass} text-slate-800 dark:text-slate-200`}>
                    {isAr 
                      ? 'الجامعة الإسلامية، طريق مري، كالا بل، أيبت آباد' 
                      : isEn 
                      ? 'Jamia Islamia, Murree Road, Kala Pul, Abbottabad' 
                      : 'جامعہ اسلامیہ، مری روڈ، کالا پل، ایبٹ آباد'}
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
            <h2 className={`text-xl font-bold text-[#5C4632] dark:text-[#B88A3B] ${fontClass}`}>
              {isAr ? 'إرسال رسالة أو استفسار' : isEn ? 'Send Us a Message' : 'پیغام ارسال کریں (Send Message)'}
            </h2>
            <p className={`text-xs text-slate-500 ${fontClass} mt-1`}>
              {isAr 
                ? 'اكتب استفسارك أو رسالتك وسيقوم القسم المختص بالرد عليك قريباً.' 
                : isEn 
                ? 'Fill in your details below and our team will get in touch with you shortly.' 
                : 'اپنا سوال، پیغام یا استفسار تحریر کریں۔ انتظامیہ جلد آپ سے رابطہ کرے گی۔'}
            </p>
          </div>

          {sent ? (
            <div className={`p-6 bg-emerald-50 dark:bg-emerald-950/80 border-2 border-emerald-500 rounded-2xl text-center space-y-4 ${fontClass}`}>
              <div className="w-12 h-12 bg-emerald-100 dark:bg-emerald-900 rounded-full flex items-center justify-center mx-auto text-emerald-600">
                <CheckCircle2 className="w-7 h-7" />
              </div>
              <div className="font-bold text-emerald-900 dark:text-emerald-100 text-base">
                {isAr 
                  ? 'تم استلام رسالتكم بنجاح وجاري المتابعة!' 
                  : isEn 
                  ? 'Your message has been sent successfully!' 
                  : 'آپ کا پیغام جامعہ کی انتظامیہ کو موصول ہو گیا ہے!'}
              </div>
              <p className="text-xs text-stone-600 dark:text-stone-300">
                {isAr 
                  ? 'سنتواصل معكم في أقرب وقت عبر رقم الهاتف أو البريد الإلكتروني المدخل.' 
                  : isEn 
                  ? 'We will get in touch with you as soon as possible via phone or email.' 
                  : 'ہم جلد از جلد آپ کے فراہم کردہ فون یا ای میل پر رابطہ کریں گے۔'}
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-2.5 pt-2">
                {whatsappUrl && (
                  <a
                    href={whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full sm:w-auto px-4 py-2 bg-[#25D366] hover:bg-[#20ba5a] text-white text-xs font-bold rounded-xl shadow-sm flex items-center justify-center gap-2 transition-transform hover:scale-[1.02]"
                  >
                    <MessageCircle className="w-4 h-4" />
                    <span>{isAr ? 'إرسال نسخة عبر واتساب' : isEn ? 'Send Copy via WhatsApp' : 'واٹس ایپ پر نقل بھیجیں'}</span>
                  </a>
                )}
                <button
                  onClick={() => {
                    setSent(false);
                    setContactName('');
                    setContactEmail('');
                    setPhone('');
                    setSubject('');
                    setMessage('');
                    setWhatsappUrl('');
                  }}
                  className="w-full sm:w-auto px-4 py-2 bg-[#5C4632] hover:bg-[#4A3727] text-white text-xs font-bold rounded-xl shadow-sm cursor-pointer"
                >
                  {isAr ? 'إرسال رسالة جديدة' : isEn ? 'Send Another Message' : 'نیا پیغام'}
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4 text-xs font-sans">
              <div>
                <label className={`block font-bold text-[#5C4632] dark:text-amber-300 ${fontClass} mb-1`}>
                  {isAr ? 'الاسم الكريم *' : isEn ? 'Full Name *' : 'نام *'}
                </label>
                <input 
                  type="text" 
                  required
                  value={contactName}
                  onChange={(e) => setContactName(e.target.value)}
                  placeholder={isAr ? 'أدخل اسمك الكريم...' : isEn ? 'Enter your full name...' : 'اپنا نام درج کریں...'}
                  className={`w-full px-3 py-2.5 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 ${fontClass} focus:outline-none focus:border-[#B88A3B]`}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className={`block font-bold text-[#5C4632] dark:text-amber-300 ${fontClass} mb-1`}>
                    {isAr ? 'البريد الإلكتروني *' : isEn ? 'Email Address *' : 'ای میل *'}
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
                  <label className={`block font-bold text-[#5C4632] dark:text-amber-300 ${fontClass} mb-1`}>
                    {isAr ? 'رقم الهاتف / الواتساب' : isEn ? 'Phone / WhatsApp Number' : 'واٹس ایپ / موبائل نمبر'}
                  </label>
                  <input 
                    type="tel" 
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="03489002496"
                    dir="ltr"
                    className="w-full px-3 py-2.5 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-mono focus:outline-none focus:border-[#B88A3B]"
                  />
                </div>
              </div>

              <div>
                <label className={`block font-bold text-[#5C4632] dark:text-amber-300 ${fontClass} mb-1`}>
                  {isAr ? 'الموضوع' : isEn ? 'Subject' : 'عنوان'}
                </label>
                <input 
                  type="text" 
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder={isAr ? 'موضوع الرسالة...' : isEn ? 'Subject...' : 'موضوع...'}
                  className={`w-full px-3 py-2.5 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 ${fontClass} focus:outline-none focus:border-[#B88A3B]`}
                />
              </div>

              <div>
                <label className={`block font-bold text-[#5C4632] dark:text-amber-300 ${fontClass} mb-1`}>
                  {isAr ? 'نص الرسالة *' : isEn ? 'Your Message *' : 'تفصیلی پیغام *'}
                </label>
                <textarea 
                  rows={5}
                  required
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder={isAr ? 'اكتب تفاصيل رسالتك أو استفسارك...' : isEn ? 'Write your message or inquiry here...' : 'اپنا پیغام تحریر کریں...'}
                  className={`w-full px-3 py-2.5 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 ${fontClass} focus:outline-none focus:border-[#B88A3B]`}
                ></textarea>
              </div>

              <button 
                type="submit"
                className={`w-full py-3 bg-[#5C4632] hover:bg-[#4A3727] text-amber-200 font-bold text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-2 ${fontClass} border border-[#B88A3B]/40 cursor-pointer`}
              >
                <Send className="w-4 h-4 text-[#B88A3B]" />
                <span>{isAr ? 'إرسال الرسالة الآن' : isEn ? 'Send Message Now' : 'پیغام روانہ کریں'}</span>
              </button>
            </form>
          )}
        </div>

      </div>

      {/* FAQs Section */}
      <div className="bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <div className={`flex items-center gap-2 text-[#5C4632] dark:text-[#B88A3B] font-bold text-lg ${fontClass} border-b border-slate-200 dark:border-slate-800 pb-3`}>
          <HelpCircle className="w-5 h-5 text-[#B88A3B]" />
          <span>
            {isAr 
              ? 'الأسئلة الشائعة والأجوبة (FAQs)' 
              : isEn 
              ? 'Frequently Asked Questions (FAQs)' 
              : 'عام طور پر پوچھے جانے والے سوالات (FAQs)'}
          </span>
        </div>

        <div className="space-y-3 pt-2">
          {faqs.map((faq, idx) => {
            const isOpen = openFaq === idx;
            const questionText = faq.q[language] || faq.q.ur;
            const answerText = faq.a[language] || faq.a.ur;

            return (
              <div 
                key={idx}
                className="border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden"
              >
                <button 
                  onClick={() => setOpenFaq(isOpen ? null : idx)}
                  className={`w-full p-4 ${isEn ? 'text-left' : 'text-right'} font-bold text-sm text-slate-900 dark:text-slate-100 ${fontClass} bg-[#F8F4EC] dark:bg-slate-800/60 flex items-center justify-between cursor-pointer`}
                >
                  <span>{questionText}</span>
                  <ChevronDown className={`w-4 h-4 text-[#B88A3B] transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                </button>

                {isOpen && (
                  <div className={`p-4 text-xs text-slate-700 dark:text-slate-300 ${fontClass} leading-relaxed bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800`}>
                    {answerText}
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

