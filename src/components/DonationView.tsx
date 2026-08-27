import React, { useState, useEffect } from 'react';
import { FundType, DonationRecord, SiteSettings } from '../types';
import { StorageService } from '../services/storage';
import { useThemeLanguage } from '../context/ThemeLanguageContext';
import { ReCaptcha } from './common/ReCaptcha';
import headerLogoCalligraphy from '../assets/images/jamia_logo_calligraphy_transparent.png';
import { JAMIA_HEADER_LOGO_DATA_URI } from '../assets/logoBase64';
import { 
  Heart, 
  Building2, 
  CreditCard, 
  Calculator, 
  Copy, 
  CheckCircle2, 
  ShieldCheck, 
  Sparkles,
  MessageCircle,
  FileText,
  BadgeCheck,
  Building,
  Smartphone,
  Wallet,
  Check,
  ChevronLeft,
  ChevronRight,
  BookOpen,
  GraduationCap,
  Users,
  Send,
  PhoneCall,
  ExternalLink,
  ArrowRight
} from 'lucide-react';

interface DonationViewProps {
  setCurrentTab?: (tab: string) => void;
}

export const DonationView: React.FC<DonationViewProps> = ({ setCurrentTab }) => {
  const { t, language } = useThemeLanguage();

  const [settings, setSettings] = useState<SiteSettings>(StorageService.getSiteSettings());
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  // Zakat Calculator state
  const [showZakatCalc, setShowZakatCalc] = useState<boolean>(false);
  const [calcGoldValue, setCalcGoldValue] = useState<number>(0);
  const [calcSilverValue, setCalcSilverValue] = useState<number>(0);
  const [calcCash, setCalcCash] = useState<number>(0);
  const [calcDebts, setCalcDebts] = useState<number>(0);

  // Online Donation / Receipt Notification Form
  const [showDirectForm, setShowDirectForm] = useState<boolean>(false);
  const [purpose, setPurpose] = useState<string>('زکوٰۃ');
  const [donorName, setDonorName] = useState<string>('');
  const [donorEmail, setDonorEmail] = useState<string>('');
  const [donorPhone, setDonorPhone] = useState<string>('');
  const [amount, setAmount] = useState<number>(5000);
  const [customAmount, setCustomAmount] = useState<string>('');
  const [paymentMethod, setPaymentMethod] = useState<'Bank Transfer' | 'EasyPaisa'>('Bank Transfer');
  const [submittedReceipt, setSubmittedReceipt] = useState<DonationRecord | null>(null);
  const [captchaToken, setCaptchaToken] = useState<string | null>(null);

  useEffect(() => {
    setSettings(StorageService.getSiteSettings());
  }, []);

  const totalZakatableAssets = (calcGoldValue || 0) + (calcSilverValue || 0) + (calcCash || 0) - (calcDebts || 0);
  const calculatedZakat = totalZakatableAssets > 0 ? Math.round(totalZakatableAssets * 0.025) : 0;

  const handleCopy = (text: string, key: string) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2500);
  };

  const handleDonateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const finalAmount = customAmount ? Number(customAmount) : amount;
    if (!donorName || !finalAmount || finalAmount <= 0) return;
    if (!captchaToken) {
      alert('براہ کرم روبوٹ نہ ہونے کی تصدیق (reCAPTCHA) مکمل فرمائیں۔');
      return;
    }

    const record: DonationRecord = {
      id: `don-${Date.now()}`,
      donorName,
      donorEmail: donorEmail || 'donor@jamiaabbottabad.edu.pk',
      donorPhone: donorPhone || '',
      fundType: (purpose === 'زکوٰۃ' ? 'Zakat' : purpose === 'صدقات' ? 'Sadaqah' : 'Lillah') as FundType,
      amount: finalAmount,
      currency: 'PKR',
      paymentMethod,
      transactionRef: `JIA-PAY-${Math.floor(10000000 + Math.random() * 90000000)}`,
      date: new Date().toISOString().split('T')[0],
      status: 'Verified'
    };

    StorageService.addDonation(record, captchaToken);
    setSubmittedReceipt(record);
  };

  const navigateTo = (tab: string) => {
    if (setCurrentTab) {
      setCurrentTab(tab);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const whatsappNo = '03489002496';
  const whatsappUrl = `https://wa.me/923489002496?text=${encodeURIComponent('السلام علیکم ورحمۃ اللہ، میں جامعہ اسلامیہ ایبٹ آباد کے ساتھ تعاون کرنا چاہتا ہوں / بینک رسید ارسال کر رہا ہوں۔')}`;

  return (
    <div className="w-full space-y-6 font-sans select-text" dir="rtl">
      
      {/* 1. TOP CLASSICAL HEADER BANNER (Centered Elegant Layout) */}
      <div 
        className="w-full rounded-2xl border border-[#D5C29E] dark:border-[#5C4632] px-4 py-4 sm:py-5 sm:px-8 shadow-xs flex flex-col items-center justify-center text-center transition-colors gap-2"
        style={{
          backgroundColor: '#F5EFE0',
          backgroundImage: `
            radial-gradient(circle at 50% 50%, rgba(213, 194, 158, 0.25) 0%, rgba(245, 239, 224, 0.95) 100%),
            url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23B89B72' fill-opacity='0.08' fill-rule='evenodd'%3E%3Cpath d='M30 30L0 0h60L30 30zm0 0L0 60h60L30 30z'/%3E%3C/g%3E%3C/svg%3E")
          `,
          backgroundRepeat: 'repeat'
        }}
      >
        {/* 1. Top Heading: طریقہ تعاون */}
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-black font-urdu text-[#3D2817] dark:text-[#3D2817] tracking-normal leading-tight">
          طریقہ تعاون
        </h1>

        {/* 2. Middle: Calligraphy Logo */}
        <div className="flex items-center justify-center my-0.5">
          <img 
            src={JAMIA_HEADER_LOGO_DATA_URI || headerLogoCalligraphy} 
            alt="الجامعۃ الاسلامیۃ ایبٹ آباد" 
            className="h-10 sm:h-12 md:h-14 w-auto object-contain max-w-[200px] sm:max-w-[260px] opacity-90 drop-shadow-xs"
            onError={(e) => {
              const target = e.currentTarget;
              target.src = JAMIA_HEADER_LOGO_DATA_URI || '/jamia_logo_calligraphy_transparent.png';
            }}
          />
        </div>

        {/* 3. Below Logo: Subtitle */}
        <p className="text-xs sm:text-sm font-urdu text-[#7A5835] font-semibold leading-relaxed">
          جامعہ اسلامیہ ایبٹ آباد - شعبہ زکوٰۃ، صدقات و عطیات
        </p>
      </div>

      {/* 2. MAIN 2-COLUMN LAYOUT (Content on Right, Sidebar on Left matching Screenshot) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
        
        {/* RIGHT COLUMN (Main Content: Statement + Bank Tables ~ 70% width) */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* Institutional Statement Box */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-stone-200 dark:border-slate-800 p-5 sm:p-8 shadow-xs space-y-4 text-stone-800 dark:text-stone-200">
            
            <div className="font-urdu text-sm sm:text-base md:text-lg leading-[2.2] text-stone-800 dark:text-stone-200 space-y-3.5 text-right sm:text-justify">
              <p>
                جامعہ ایک مرکزی دینی تعلیمی ادارہ ہے۔ اس کی کوئی مستقل آمدنی نہیں، نہ ہی حکومت کی جانب سے کوئی مالی امداد حاصل کی جاتی ہے، بلکہ تمام تر امور محض اللہ تعالیٰ کی توفیق اور اہلِ خیر و مخلص حضرات کے مالی تعاون سے انجام پاتے ہیں۔
              </p>
              <p>
                جامعہ میں مختلف دینی و تعلیمی شعبہ جات قائم ہیں جن میں کثیر تعداد میں طلبہ کرام زیرِ تعلیم ہیں۔ ان کے قیام، طعام، علاج معالجہ، کتب اور دیگر تمام تر تعلیمی ضروریات کا انتظام اہلِ خیر حضرات کے تعاون، زکوٰۃ، صدقات اور عطیات کے ذریعے کیا جاتا ہے۔
              </p>
              <p>
                جامعہ کے جملہ شعبہ جات کے تعلیمی و تدریسی اخراجات، اساتذہ کرام کے مشاہرات، نادار و مستحق طلبہ کی کفالت، اور تعمیراتی و ترقیاتی کاموں کے لیے تمام رقوم صرف کی جاتی ہیں۔
              </p>
              <p className="font-bold text-[#5C4632] dark:text-[#E0B266]">
                اہلِ خیر حضرات سے گزارش ہے کہ جامعہ کے ساتھ زکوٰۃ، صدقات اور عطیات کی مد میں بھرپور تعاون فرمائیں۔ بینک میں رقم جمع کروانے کے بعد واٹس ایپ یا فون پر مطلع فرما کر رسید ضرور حاصل کریں۔
              </p>
              <p className="text-stone-700 dark:text-stone-300 font-semibold pt-1">
                بینک اکاؤنٹس میں رقم جمع کروانے کی باضابطہ تفصیل مندرجہ ذیل ہے:
              </p>
            </div>

            {/* QUICK ACTION BUTTONS (WhatsApp, Calculator, Online Notification) */}
            <div className="pt-3 flex flex-wrap items-center gap-3 border-t border-stone-100 dark:border-slate-800">
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 bg-[#25D366] hover:bg-[#20ba5a] text-white font-bold text-xs sm:text-sm rounded-xl transition-all shadow-xs flex items-center gap-2 font-urdu cursor-pointer"
              >
                <MessageCircle className="w-4 h-4 fill-white" />
                <span>واٹس ایپ پر رسید / رابطہ بھیجیں (0348-9002496)</span>
              </a>

              <button
                onClick={() => setShowZakatCalc(!showZakatCalc)}
                className="px-4 py-2 bg-[#5C4632] hover:bg-[#433123] text-amber-200 font-bold text-xs sm:text-sm rounded-xl transition-all shadow-xs flex items-center gap-2 font-urdu cursor-pointer"
              >
                <Calculator className="w-4 h-4 text-amber-300" />
                <span>{showZakatCalc ? 'زکوٰۃ کیلکولیٹر بند کریں' : 'آسان شرعی زکوٰۃ کیلکولیٹر'}</span>
              </button>

              <button
                onClick={() => setShowDirectForm(!showDirectForm)}
                className="px-4 py-2 bg-stone-100 hover:bg-stone-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-stone-800 dark:text-stone-200 font-bold text-xs sm:text-sm rounded-xl transition-all border border-stone-300 dark:border-slate-700 flex items-center gap-2 font-urdu cursor-pointer"
              >
                <FileText className="w-4 h-4 text-[#B88A3B]" />
                <span>آن لائن اطلاع فارم</span>
              </button>
            </div>

          </div>

          {/* COLLAPSIBLE ZAKAT CALCULATOR */}
          {showZakatCalc && (
            <div className="bg-[#FDFBF7] dark:bg-slate-900 p-6 rounded-2xl border-2 border-[#B88A3B]/40 shadow-sm space-y-4 animate-fadeIn">
              <div className="flex items-center justify-between border-b border-stone-200 dark:border-slate-800 pb-3">
                <div className="flex items-center gap-2 text-[#5C4632] dark:text-[#E0B266] font-bold text-base sm:text-lg font-urdu">
                  <Calculator className="w-5 h-5 text-[#B88A3B]" />
                  <span>آسان شرعی زکوٰۃ کیلکولیٹر (شرعی نصاب: ۲.۵٪)</span>
                </div>
                <button 
                  onClick={() => setShowZakatCalc(false)}
                  className="text-xs text-stone-500 hover:text-stone-800 font-urdu cursor-pointer"
                >
                  ✕ بند کریں
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                <div>
                  <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-1 font-urdu">
                    سونے کی کل مالیت (PKR)
                  </label>
                  <input 
                    type="number"
                    value={calcGoldValue || ''}
                    onChange={(e) => setCalcGoldValue(Number(e.target.value))}
                    placeholder="0"
                    className="w-full px-3 py-2 text-xs rounded-xl border border-stone-300 dark:border-slate-700 bg-white dark:bg-slate-800 font-mono font-bold"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-1 font-urdu">
                    چاندی کی کل مالیت (PKR)
                  </label>
                  <input 
                    type="number"
                    value={calcSilverValue || ''}
                    onChange={(e) => setCalcSilverValue(Number(e.target.value))}
                    placeholder="0"
                    className="w-full px-3 py-2 text-xs rounded-xl border border-stone-300 dark:border-slate-700 bg-white dark:bg-slate-800 font-mono font-bold"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-1 font-urdu">
                    نقد رقم و بینک بیلنس (PKR)
                  </label>
                  <input 
                    type="number"
                    value={calcCash || ''}
                    onChange={(e) => setCalcCash(Number(e.target.value))}
                    placeholder="0"
                    className="w-full px-3 py-2 text-xs rounded-xl border border-stone-300 dark:border-slate-700 bg-white dark:bg-slate-800 font-mono font-bold"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-1 font-urdu">
                    منہا واجب الادا قرضے (PKR)
                  </label>
                  <input 
                    type="number"
                    value={calcDebts || ''}
                    onChange={(e) => setCalcDebts(Number(e.target.value))}
                    placeholder="0"
                    className="w-full px-3 py-2 text-xs rounded-xl border border-stone-300 dark:border-slate-700 bg-white dark:bg-slate-800 font-mono font-bold"
                  />
                </div>
              </div>

              <div className="bg-[#5C4632] text-[#F8F4EC] p-4 rounded-xl flex flex-wrap items-center justify-between gap-4 font-urdu">
                <div>
                  <div className="text-xs text-amber-200">کل قابلِ زکوٰۃ اثاثہ جات:</div>
                  <div className="text-base font-bold font-mono">Rs. {totalZakatableAssets > 0 ? totalZakatableAssets.toLocaleString() : 0}</div>
                </div>
                <div>
                  <div className="text-xs text-amber-300 font-bold">واجب الادا زکوٰۃ (2.5%):</div>
                  <div className="text-xl sm:text-2xl font-black text-amber-300 font-mono">Rs. {calculatedZakat.toLocaleString()}</div>
                </div>
              </div>
            </div>
          )}

          {/* COLLAPSIBLE ONLINE NOTIFICATION FORM */}
          {showDirectForm && (
            <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border-2 border-stone-300 dark:border-slate-700 shadow-sm space-y-4 animate-fadeIn">
              <div className="flex items-center justify-between border-b border-stone-200 dark:border-slate-800 pb-3">
                <div className="flex items-center gap-2 text-[#5C4632] dark:text-[#E0B266] font-bold text-base font-urdu">
                  <FileText className="w-5 h-5 text-[#B88A3B]" />
                  <span>آن لائن عطیہ / ادائیگی اطلاع فارم</span>
                </div>
                <button 
                  onClick={() => setShowDirectForm(false)}
                  className="text-xs text-stone-500 hover:text-stone-800 font-urdu cursor-pointer"
                >
                  ✕ بند کریں
                </button>
              </div>

              {submittedReceipt ? (
                <div className="bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-300 dark:border-emerald-800 p-5 rounded-xl text-center space-y-3 font-urdu">
                  <CheckCircle2 className="w-10 h-10 text-emerald-600 dark:text-emerald-400 mx-auto" />
                  <h4 className="text-lg font-bold text-emerald-900 dark:text-emerald-200">جزاکم اللہ خیراً! آپ کی اطلاع موصول ہو گئی ہے۔</h4>
                  <p className="text-xs text-emerald-800 dark:text-emerald-300">
                    ٹرانزیکشن ریفرنس: <span className="font-mono font-bold">{submittedReceipt.transactionRef}</span>
                  </p>
                  <button
                    onClick={() => setSubmittedReceipt(null)}
                    className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold font-urdu cursor-pointer"
                  >
                    نیا فارم بھریں
                  </button>
                </div>
              ) : (
                <form onSubmit={handleDonateSubmit} className="space-y-3 font-urdu">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-1">
                        تعاون کی مد (Purpose)
                      </label>
                      <select 
                        value={purpose}
                        onChange={(e) => setPurpose(e.target.value)}
                        className="w-full px-3 py-2 text-xs rounded-xl border border-stone-300 dark:border-slate-700 bg-white dark:bg-slate-800 font-urdu"
                      >
                        <option value="زکوٰۃ">زکوٰۃ (Zakat)</option>
                        <option value="صدقات">صدقات (Sadaqat)</option>
                        <option value="عام عطیات">عام عطیات (Lillah)</option>
                        <option value="تعمیرات">تعمیرات (Construction)</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-1">
                        معاون کا نام (Donor Name)
                      </label>
                      <input 
                        type="text"
                        required
                        value={donorName}
                        onChange={(e) => setDonorName(e.target.value)}
                        placeholder="محترم معاون کا نام"
                        className="w-full px-3 py-2 text-xs rounded-xl border border-stone-300 dark:border-slate-700 bg-white dark:bg-slate-800 font-urdu"
                      >
                      </input>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-1">
                        رقم (PKR Amount)
                      </label>
                      <input 
                        type="number"
                        required
                        value={amount}
                        onChange={(e) => setAmount(Number(e.target.value))}
                        placeholder="5000"
                        className="w-full px-3 py-2 text-xs rounded-xl border border-stone-300 dark:border-slate-700 bg-white dark:bg-slate-800 font-mono"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-1">
                        فون / واٹس ایپ نمبر
                      </label>
                      <input 
                        type="text"
                        value={donorPhone}
                        onChange={(e) => setDonorPhone(e.target.value)}
                        placeholder="03001234567"
                        className="w-full px-3 py-2 text-xs rounded-xl border border-stone-300 dark:border-slate-700 bg-white dark:bg-slate-800 font-sans"
                        dir="ltr"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-1">
                        ادائیگی کا ذریعہ
                      </label>
                      <select 
                        value={paymentMethod}
                        onChange={(e) => setPaymentMethod(e.target.value as any)}
                        className="w-full px-3 py-2 text-xs rounded-xl border border-stone-300 dark:border-slate-700 bg-white dark:bg-slate-800 font-urdu"
                      >
                        <option value="Bank Transfer">میزان بینک (Meezan Bank)</option>
                        <option value="EasyPaisa">ایزی پیسہ (EasyPaisa)</option>
                      </select>
                    </div>
                  </div>

                  {/* Google reCAPTCHA */}
                  <div className="pt-1 flex justify-center">
                    <ReCaptcha onChange={setCaptchaToken} />
                  </div>

                  <button
                    type="submit"
                    disabled={!captchaToken}
                    className={`w-full py-2.5 text-amber-200 font-bold text-xs sm:text-sm rounded-xl transition-all shadow-xs flex items-center justify-center gap-2 mt-2 ${
                      !captchaToken 
                        ? 'bg-stone-400 dark:bg-slate-700 text-stone-200 cursor-not-allowed opacity-70' 
                        : 'bg-[#5C4632] hover:bg-[#433123] cursor-pointer'
                    }`}
                  >
                    <Send className="w-4 h-4" />
                    <span>ادائیگی کی اطلاع درج کریں (Submit Receipt)</span>
                  </button>
                </form>
              )}
            </div>
          )}

          {/* 3. CLASSICAL BANK ACCOUNT TABLES (Matching Screenshot Layout) */}
          <div className="space-y-6">
            
            {/* BANK 1: MEEZAN BANK LIMITED TABLE */}
            <div className="bg-white dark:bg-slate-900 rounded-xl border-2 border-stone-300 dark:border-slate-700 shadow-sm overflow-hidden">
              {/* Bank Logo / Header Banner */}
              <div className="bg-stone-50 dark:bg-slate-800/80 p-4 border-b border-stone-300 dark:border-slate-700 flex flex-col items-center justify-center space-y-1">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-full bg-[#006838] text-white flex items-center justify-center font-bold text-xs shadow-xs">
                    MB
                  </div>
                  <span className="text-xl sm:text-2xl font-black text-[#006838] dark:text-[#25D366] tracking-tight font-serif">
                    Meezan Bank
                  </span>
                </div>
                <div className="text-[11px] text-stone-500 dark:text-stone-400 font-serif italic tracking-wide">
                  The Premier Islamic Bank
                </div>
              </div>

              {/* 2-Column Clean Classical Grid Table */}
              <div className="divide-y divide-stone-200 dark:divide-slate-800 text-xs sm:text-sm">
                
                {/* Row 1: Title */}
                <div className="grid grid-cols-12 items-center hover:bg-stone-50/70 dark:hover:bg-slate-800/50 transition-colors">
                  <div className="col-span-4 sm:col-span-3 px-4 py-3 bg-stone-100/70 dark:bg-slate-800 font-bold text-stone-700 dark:text-stone-300 text-left border-l border-stone-200 dark:border-slate-700 font-serif">
                    Title
                  </div>
                  <div className="col-span-8 sm:col-span-9 px-4 py-3 font-mono font-bold text-stone-900 dark:text-stone-100 flex items-center justify-between">
                    <span>USAMA</span>
                    <span className="text-[11px] font-urdu text-stone-500 dark:text-stone-400 font-normal">اکاؤنٹ ٹائٹل</span>
                  </div>
                </div>

                {/* Row 2: Account No */}
                <div className="grid grid-cols-12 items-center hover:bg-stone-50/70 dark:hover:bg-slate-800/50 transition-colors">
                  <div className="col-span-4 sm:col-span-3 px-4 py-3 bg-stone-100/70 dark:bg-slate-800 font-bold text-stone-700 dark:text-stone-300 text-left border-l border-stone-200 dark:border-slate-700 font-serif">
                    Account No
                  </div>
                  <div className="col-span-8 sm:col-span-9 px-4 py-3 font-mono font-bold text-stone-900 dark:text-stone-100 flex items-center justify-between">
                    <span className="text-base sm:text-lg tracking-wider text-[#006838] dark:text-[#25D366]">
                      00300115179559
                    </span>
                    <button
                      onClick={() => handleCopy('00300115179559', 'meezan_acc')}
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-stone-100 dark:bg-slate-800 hover:bg-stone-200 text-stone-700 dark:text-stone-200 text-xs font-urdu border border-stone-300 dark:border-slate-700 cursor-pointer"
                    >
                      {copiedKey === 'meezan_acc' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5 text-stone-500" />}
                      <span>{copiedKey === 'meezan_acc' ? 'کاپی ہو گیا' : 'کاپی کریں'}</span>
                    </button>
                  </div>
                </div>

                {/* Row 3: IBAN */}
                <div className="grid grid-cols-12 items-center hover:bg-stone-50/70 dark:hover:bg-slate-800/50 transition-colors">
                  <div className="col-span-4 sm:col-span-3 px-4 py-3 bg-stone-100/70 dark:bg-slate-800 font-bold text-stone-700 dark:text-stone-300 text-left border-l border-stone-200 dark:border-slate-700 font-serif">
                    IBAN
                  </div>
                  <div className="col-span-8 sm:col-span-9 px-4 py-3 font-mono font-bold text-stone-900 dark:text-stone-100 flex items-center justify-between flex-wrap gap-2">
                    <span className="text-xs sm:text-sm tracking-wide text-stone-800 dark:text-stone-200">
                      PK70 MEZN 0000 3001 1517 9559
                    </span>
                    <button
                      onClick={() => handleCopy('PK70MEZN0000300115179559', 'meezan_iban')}
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-stone-100 dark:bg-slate-800 hover:bg-stone-200 text-stone-700 dark:text-stone-200 text-xs font-urdu border border-stone-300 dark:border-slate-700 cursor-pointer"
                    >
                      {copiedKey === 'meezan_iban' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5 text-stone-500" />}
                      <span>{copiedKey === 'meezan_iban' ? 'کاپی ہو گیا' : 'کاپی کریں'}</span>
                    </button>
                  </div>
                </div>

                {/* Row 4: Branch Name */}
                <div className="grid grid-cols-12 items-center hover:bg-stone-50/70 dark:hover:bg-slate-800/50 transition-colors">
                  <div className="col-span-4 sm:col-span-3 px-4 py-3 bg-stone-100/70 dark:bg-slate-800 font-bold text-stone-700 dark:text-stone-300 text-left border-l border-stone-200 dark:border-slate-700 font-serif">
                    Branch Name
                  </div>
                  <div className="col-span-8 sm:col-span-9 px-4 py-3 font-sans font-semibold text-stone-800 dark:text-stone-200">
                    MEEZAN DIGITAL CENTRE (میزان ڈیجیٹل سینٹر)
                  </div>
                </div>

                {/* Row 5: Branch Code */}
                <div className="grid grid-cols-12 items-center hover:bg-stone-50/70 dark:hover:bg-slate-800/50 transition-colors">
                  <div className="col-span-4 sm:col-span-3 px-4 py-3 bg-stone-100/70 dark:bg-slate-800 font-bold text-stone-700 dark:text-stone-300 text-left border-l border-stone-200 dark:border-slate-700 font-serif">
                    Branch Code
                  </div>
                  <div className="col-span-8 sm:col-span-9 px-4 py-3 font-mono font-bold text-stone-900 dark:text-stone-100">
                    0030
                  </div>
                </div>

                {/* Row 6: Swift Code */}
                <div className="grid grid-cols-12 items-center hover:bg-stone-50/70 dark:hover:bg-slate-800/50 transition-colors">
                  <div className="col-span-4 sm:col-span-3 px-4 py-3 bg-stone-100/70 dark:bg-slate-800 font-bold text-stone-700 dark:text-stone-300 text-left border-l border-stone-200 dark:border-slate-700 font-serif">
                    Swift Code
                  </div>
                  <div className="col-span-8 sm:col-span-9 px-4 py-3 font-mono font-bold text-stone-900 dark:text-stone-100">
                    MEZNPKKA
                  </div>
                </div>

              </div>
            </div>

            {/* MOBILE ACCOUNT TABLE: EASYPAISA */}
            <div className="bg-white dark:bg-slate-900 rounded-xl border-2 border-stone-300 dark:border-slate-700 shadow-sm overflow-hidden">
              {/* Header */}
              <div className="bg-stone-50 dark:bg-slate-800/80 p-4 border-b border-stone-300 dark:border-slate-700 flex flex-col items-center justify-center space-y-1">
                <div className="flex items-center gap-2">
                  <div className="px-3.5 py-1 rounded bg-[#00AA4F] text-white font-bold text-xs tracking-wide">
                    EasyPaisa
                  </div>
                </div>
                <div className="text-[11px] text-stone-500 dark:text-stone-400 font-urdu pt-0.5">
                  ایزی پیسہ موبائل والٹ اکاؤنٹ برائے فوری زکوٰۃ و عطیات
                </div>
              </div>

              {/* 2-Column Table */}
              <div className="divide-y divide-stone-200 dark:divide-slate-800 text-xs sm:text-sm">
                
                {/* Row 1: Platform */}
                <div className="grid grid-cols-12 items-center hover:bg-stone-50/70 dark:hover:bg-slate-800/50 transition-colors">
                  <div className="col-span-4 sm:col-span-3 px-4 py-3 bg-stone-100/70 dark:bg-slate-800 font-bold text-stone-700 dark:text-stone-300 text-left border-l border-stone-200 dark:border-slate-700 font-serif">
                    Platform
                  </div>
                  <div className="col-span-8 sm:col-span-9 px-4 py-3 font-sans font-bold text-stone-800 dark:text-stone-200">
                    EasyPaisa (ایزی پیسہ)
                  </div>
                </div>

                {/* Row 2: Account Title */}
                <div className="grid grid-cols-12 items-center hover:bg-stone-50/70 dark:hover:bg-slate-800/50 transition-colors">
                  <div className="col-span-4 sm:col-span-3 px-4 py-3 bg-stone-100/70 dark:bg-slate-800 font-bold text-stone-700 dark:text-stone-300 text-left border-l border-stone-200 dark:border-slate-700 font-serif">
                    Title
                  </div>
                  <div className="col-span-8 sm:col-span-9 px-4 py-3 font-mono font-bold text-stone-900 dark:text-stone-100 flex items-center justify-between">
                    <span>USAMA</span>
                    <span className="text-[11px] font-urdu text-stone-500 dark:text-stone-400">نام صاحبِ اکاؤنٹ</span>
                  </div>
                </div>

                {/* Row 3: Mobile Account Number */}
                <div className="grid grid-cols-12 items-center hover:bg-stone-50/70 dark:hover:bg-slate-800/50 transition-colors">
                  <div className="col-span-4 sm:col-span-3 px-4 py-3 bg-stone-100/70 dark:bg-slate-800 font-bold text-stone-700 dark:text-stone-300 text-left border-l border-stone-200 dark:border-slate-700 font-serif">
                    Mobile No
                  </div>
                  <div className="col-span-8 sm:col-span-9 px-4 py-3 font-mono font-bold text-stone-900 dark:text-stone-100 flex items-center justify-between">
                    <span className="text-base sm:text-lg tracking-wider text-[#00AA4F] dark:text-[#25D366]">
                      0348-9002496
                    </span>
                    <button
                      onClick={() => handleCopy('03489002496', 'mobile_num')}
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-stone-100 dark:bg-slate-800 hover:bg-stone-200 text-stone-700 dark:text-stone-200 text-xs font-urdu border border-stone-300 dark:border-slate-700 cursor-pointer"
                    >
                      {copiedKey === 'mobile_num' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5 text-stone-500" />}
                      <span>{copiedKey === 'mobile_num' ? 'کاپی ہو گیا' : 'کاپی کریں'}</span>
                    </button>
                  </div>
                </div>

              </div>
            </div>

          </div>

          {/* Bottom Confirmation Notice */}
          <div className="bg-[#FAF8F3] dark:bg-slate-800/60 p-4 rounded-xl border border-[#D5C29E] dark:border-slate-700 text-stone-700 dark:text-stone-300 font-urdu text-xs sm:text-sm leading-relaxed text-center">
            برائے کرم بینک ٹرانسفر یا موبائل اکاؤنٹ میں ادائیگی کے بعد سلپ یا ٹرانزیکشن کی تفصیل ہمارے واٹس ایپ نمبر <span className="font-mono font-bold text-[#5C4632] dark:text-amber-300 dir-ltr inline-block">0348-9002496</span> پر ضرور ارسال فرما دیں۔
          </div>

        </div>

        {/* LEFT COLUMN (Classical Seminary Sidebar: متعلقہ لنکس / Related Links ~ 30% width) */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* Related Links Widget (Matching Screenshot Box) */}
          <div className="bg-white dark:bg-slate-900 rounded-xl border-2 border-[#D5C29E] dark:border-slate-700 shadow-xs overflow-hidden">
            
            {/* Header Box */}
            <div className="bg-[#5C4632] text-amber-200 px-4 py-3 flex items-center justify-between border-b border-[#7A5835]">
              <div className="flex items-center gap-2 font-urdu font-bold text-base sm:text-lg">
                <BookOpen className="w-4 h-4 text-amber-300" />
                <span>متعلقہ لنکس</span>
              </div>
              <span className="text-[11px] text-amber-200/80 font-serif">Jamia Links</span>
            </div>

            {/* List of Links */}
            <div className="divide-y divide-stone-100 dark:divide-slate-800 text-xs sm:text-sm font-urdu font-semibold">
              {[
                { label: 'تعارف جامعہ اسلامیہ', tab: 'about' },
                { label: 'اکابرین و اساتذہ کرام', tab: 'faculty' },
                { label: 'جامعہ کے اغراض و مقاصد', tab: 'about-goals' },
                { label: 'جامعہ کا نظامِ تعلیم', tab: 'departments' },
                { label: 'ضروری ہدایات برائے طلبہ', tab: 'departments' },
                { label: 'مطلوب کتب / رسائل و مقالات', tab: 'library' },
                { label: 'جامعہ کی شاخیں اور شعبہ جات', tab: 'departments' },
                { label: 'جامعہ کی تعلیمی و تدریسی خدمات', tab: 'online-services' },
                { label: 'دارالافتاء و فتاویٰ جات', tab: 'fatwas' },
                { label: 'رابطہ دفتر جامعہ و اوقات', tab: 'contact' },
              ].map((item, idx) => (
                <button
                  key={idx}
                  onClick={() => navigateTo(item.tab)}
                  className="w-full px-4 py-2.5 flex items-center justify-between text-stone-700 dark:text-stone-300 hover:bg-[#F5EFE0] dark:hover:bg-slate-800 hover:text-[#5C4632] dark:hover:text-amber-300 transition-colors text-right cursor-pointer group"
                >
                  <span className="flex items-center gap-2">
                    <span className="text-[#B88A3B] text-xs">●</span>
                    <span>{item.label}</span>
                  </span>
                  <ChevronLeft className="w-3.5 h-3.5 text-stone-400 group-hover:text-[#5C4632] group-hover:-translate-x-0.5 transition-all" />
                </button>
              ))}
            </div>

          </div>

          {/* Secondary Classical Card: Publications / Islamic Names / Contact */}
          <div 
            className="rounded-xl border border-[#D5C29E] dark:border-slate-700 p-5 space-y-3 text-stone-800 dark:text-stone-200 shadow-xs"
            style={{
              backgroundColor: '#FAF6EE'
            }}
          >
            <div className="font-urdu font-bold text-sm text-[#5C4632] dark:text-[#5C4632] border-b border-[#D5C29E] pb-2 flex items-center justify-between">
              <span>شعبہ نشر و اشاعت و کتب</span>
              <FileText className="w-4 h-4 text-[#B88A3B]" />
            </div>
            <p className="font-urdu text-xs leading-relaxed text-stone-600 dark:text-stone-700">
              جامعہ کے زیرِ اہتمام شائع ہونے والی کتب، مجلہ اور تعلیمی مقالات آن لائن کتب خانے میں مفت مطالعہ کے لیے دستیاب ہیں۔
            </p>
            <button
              onClick={() => navigateTo('library')}
              className="w-full py-2 bg-[#5C4632] hover:bg-[#433123] text-amber-200 rounded-lg text-xs font-bold font-urdu transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <span>ڈیجیٹل کتب خانہ دیکھیں</span>
              <ChevronLeft className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Contact Box */}
          <div className="bg-white dark:bg-slate-900 rounded-xl border border-stone-200 dark:border-slate-700 p-5 space-y-2.5 shadow-xs font-urdu">
            <div className="font-bold text-xs sm:text-sm text-stone-800 dark:text-stone-200 flex items-center gap-2">
              <PhoneCall className="w-4 h-4 text-[#B88A3B]" />
              <span>براہِ راست رابطہ دفترِ مالیات</span>
            </div>
            <div className="text-xs font-mono text-stone-600 dark:text-stone-400 space-y-1 text-right" dir="ltr">
              <div>Phone: +92 348 9002496</div>
              <div>Email: info@jamiaabbottabad.edu.pk</div>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};
