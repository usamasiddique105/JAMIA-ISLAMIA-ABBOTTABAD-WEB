import React, { useState } from 'react';
import { SiteSettings } from '../../types';
import { 
  Building2, 
  Phone, 
  Mail, 
  MapPin, 
  Bell, 
  Sparkles, 
  CreditCard, 
  Key, 
  Database, 
  Save, 
  RotateCcw, 
  Download, 
  Upload,
  CheckCircle2,
  AlertCircle,
  Globe2,
  Lock,
  Smartphone,
  Server,
  Layers,
  HelpCircle,
  FileCode,
  ShieldCheck,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

interface WordPressSettingsManagerProps {
  settings: SiteSettings | null;
  setSettings: React.Dispatch<React.SetStateAction<SiteSettings | null>>;
  onSave: (e: React.FormEvent) => void;
  onReset: () => void;
  currentUser: { email?: string; role?: string } | null;
  currentPasswordInput: string;
  setCurrentPasswordInput: (val: string) => void;
  newPasswordInput: string;
  setNewPasswordInput: (val: string) => void;
  settingsResetSuccess: string;
  setSettingsResetSuccess: (val: string) => void;
  settingsResetError: string;
  setSettingsResetError: (val: string) => void;
  onChangePassword: () => Promise<void>;
  onExportBackup: () => void;
  onImportBackup: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

type SettingsSection = 
  | 'general' 
  | 'contact' 
  | 'notifications' 
  | 'gemini' 
  | 'banking' 
  | 'security' 
  | 'backup' 
  | 'seo';

export const WordPressSettingsManager: React.FC<WordPressSettingsManagerProps> = ({
  settings,
  setSettings,
  onSave,
  onReset,
  currentUser,
  currentPasswordInput,
  setCurrentPasswordInput,
  newPasswordInput,
  setNewPasswordInput,
  settingsResetSuccess,
  setSettingsResetSuccess,
  settingsResetError,
  setSettingsResetError,
  onChangePassword,
  onExportBackup,
  onImportBackup,
}) => {
  const [activeSection, setActiveSection] = useState<SettingsSection>('general');
  const [saveToast, setSaveToast] = useState(false);

  const navItems = [
    { id: 'general', label: 'عمومی ترتیبات (General)', icon: Building2, desc: 'جامعہ کے نام اور الحاق کی تفصیلات' },
    { id: 'contact', label: 'رابطہ و پتہ (Contact & Address)', icon: MapPin, desc: 'فون نمبرز، واٹس ایپ اور مرکزی پتہ' },
    { id: 'notifications', label: 'الرٹس و نوٹیفکیشن (Notifications)', icon: Bell, desc: 'فتاویٰ اور داخلہ کے خودکار الرٹس' },
    { id: 'gemini', label: 'گوگل AI ترجمہ (Gemini AI)', icon: Sparkles, desc: 'کلاؤڈ اے آئی خودکار ترجمہ سیٹنگز' },
    { id: 'banking', label: 'بینک اکاؤنٹس و فنڈز (Bank & Accounts)', icon: CreditCard, desc: 'میزان بینک، ایزی پیسہ، جاز کیش' },
    { id: 'security', label: 'سیکیورٹی و پاس ورڈ (Security)', icon: Key, desc: 'ایڈمن پاس ورڈ اور پورٹل سیکیورٹی' },
    { id: 'seo', label: 'سرچ انجن و میٹا (SEO & Webmaster)', icon: Globe2, desc: 'سائٹ میپ، گوگل سرچ کونسل و تصدیق' },
    { id: 'backup', label: 'بیک اپ اور بحالی (Backup & Tools)', icon: Database, desc: 'مکمل ڈیٹا ایکسپورٹ و امپورٹ' },
  ];

  const handleFormSubmit = (e: React.FormEvent) => {
    onSave(e);
    setSaveToast(true);
    setTimeout(() => setSaveToast(false), 4000);
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-3xl border border-stone-200 dark:border-slate-800 shadow-xl overflow-hidden font-urdu">
      
      {/* WordPress-style Admin Bar / Header */}
      <div className="bg-stone-900 text-stone-100 px-6 py-4 border-b border-stone-800 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-500 to-[#5C4632] flex items-center justify-center text-white shadow-md">
            <Layers className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base sm:text-lg font-black text-white font-urdu">
                ویب سائٹ ترتیبات و کنٹرول (WordPress Style Settings)
              </h2>
              <span className="px-2 py-0.5 rounded-md bg-amber-500/20 text-amber-300 text-[10px] font-sans font-bold border border-amber-500/30">
                v2.6 WP-CMS
              </span>
            </div>
            <p className="text-[11px] text-stone-400 font-sans">
              Jamia Islamia Abbottabad — Central CMS Options & Configuration
            </p>
          </div>
        </div>

        {/* Quick Save Action */}
        <div className="flex items-center gap-2">
          {saveToast && (
            <span className="flex items-center gap-1.5 text-xs text-emerald-400 font-bold bg-emerald-950/80 px-3 py-1.5 rounded-lg border border-emerald-700 animate-pulse">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>سیٹنگز کامیابی سے محفوظ ہوگئیں!</span>
            </span>
          )}
          <button
            type="button"
            onClick={handleFormSubmit}
            className="px-5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl shadow-md flex items-center gap-2 cursor-pointer transition-all border border-emerald-400"
          >
            <Save className="w-4 h-4" />
            <span>محفوظ کریں (Save All Changes)</span>
          </button>
        </div>
      </div>

      {/* Main Grid: Left Navigation Sub-Menu + Right Content Settings */}
      <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[650px]">
        
        {/* WordPress Side Navigation Sub-Tabs */}
        <div className="lg:col-span-4 xl:col-span-3 bg-stone-50 dark:bg-slate-950/70 p-4 border-b lg:border-b-0 lg:border-l border-stone-200 dark:border-slate-800 space-y-1.5">
          <div className="px-3 py-2 text-[11px] font-bold text-stone-500 dark:text-stone-400 uppercase tracking-wider font-sans">
            سیٹنگز مینیو (Settings Menu)
          </div>

          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeSection === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setActiveSection(item.id as SettingsSection)}
                className={`w-full text-right p-3 rounded-2xl transition-all flex items-center justify-between group cursor-pointer ${
                  isActive
                    ? 'bg-[#5C4632] text-amber-200 shadow-md border border-[#B88A3B]'
                    : 'text-stone-700 dark:text-stone-300 hover:bg-stone-200/70 dark:hover:bg-slate-800/60'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-xl transition-colors ${
                    isActive 
                      ? 'bg-amber-500/20 text-amber-300' 
                      : 'bg-stone-200/80 dark:bg-slate-800 text-stone-600 dark:text-stone-400 group-hover:text-[#B88A3B]'
                  }`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-bold font-urdu leading-tight">
                      {item.label}
                    </div>
                    <div className={`text-[10px] truncate max-w-[170px] ${
                      isActive ? 'text-amber-100/70' : 'text-stone-500 dark:text-stone-400'
                    }`}>
                      {item.desc}
                    </div>
                  </div>
                </div>
                <ChevronLeft className={`w-4 h-4 transition-transform ${
                  isActive ? 'text-amber-300 -translate-x-1' : 'text-stone-400 group-hover:-translate-x-1'
                }`} />
              </button>
            );
          })}

          {/* Quick System Info Box */}
          <div className="mt-8 p-4 rounded-2xl bg-amber-500/10 dark:bg-slate-900 border border-amber-300/40 dark:border-slate-800 space-y-2 text-xs">
            <div className="flex items-center gap-2 font-bold text-[#5C4632] dark:text-amber-300">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>کلاؤڈ فلیئر سرور اسٹیٹس</span>
            </div>
            <div className="text-[11px] text-stone-600 dark:text-stone-400 space-y-1 font-mono">
              <div>DB Engine: <span className="text-emerald-600 font-bold">Cloudflare D1 SQL</span></div>
              <div>Static Assets: <span className="text-blue-600 font-bold">Cloudflare CDN</span></div>
              <div>Auth: <span className="text-purple-600 font-bold">PBKDF2 SHA-256</span></div>
            </div>
          </div>
        </div>

        {/* Right Settings Form Content Area */}
        <div className="lg:col-span-8 xl:col-span-9 p-6 sm:p-8 space-y-6">
          <form onSubmit={handleFormSubmit} className="space-y-6">

            {/* 1. GENERAL SETTINGS */}
            {activeSection === 'general' && (
              <div className="space-y-6 animate-fadeIn">
                <div className="border-b border-stone-200 dark:border-slate-800 pb-4">
                  <h3 className="text-lg font-black text-[#5C4632] dark:text-amber-300 flex items-center gap-2">
                    <Building2 className="w-5 h-5 text-[#B88A3B]" />
                    <span>جامعہ کا نام اور ادارہ جاتی معلومات (General Institution Settings)</span>
                  </h3>
                  <p className="text-xs text-stone-500 dark:text-stone-400 mt-1">
                    یہ معلومات ویب سائٹ کے ہیڈر، فوٹر، امتحانی اسناد اور فتاویٰ کے پرنٹس پر دکھائی دیں گی۔
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                  <div>
                    <label className="block font-bold mb-1.5 text-stone-800 dark:text-stone-200">
                      جامعہ کا نام (اردو میں) *
                    </label>
                    <input 
                      type="text" 
                      value={settings?.jamiaNameUrdu || ''} 
                      onChange={(e) => setSettings(prev => ({...prev, jamiaNameUrdu: e.target.value}))} 
                      className="w-full p-2.5 border rounded-xl bg-white dark:bg-slate-950 border-stone-300 dark:border-slate-700 font-urdu focus:ring-2 focus:ring-[#B88A3B] outline-none" 
                    />
                  </div>
                  <div>
                    <label className="block font-bold mb-1.5 text-stone-800 dark:text-stone-200">
                      جامعہ کا نام (English) *
                    </label>
                    <input 
                      type="text" 
                      value={settings?.jamiaNameEnglish || ''} 
                      onChange={(e) => setSettings(prev => ({...prev, jamiaNameEnglish: e.target.value}))} 
                      className="w-full p-2.5 border rounded-xl bg-white dark:bg-slate-950 border-stone-300 dark:border-slate-700 font-sans focus:ring-2 focus:ring-[#B88A3B] outline-none" 
                    />
                  </div>
                  <div>
                    <label className="block font-bold mb-1.5 text-stone-800 dark:text-stone-200">
                      جامعہ کا نام (عربی میں) *
                    </label>
                    <input 
                      type="text" 
                      value={settings?.jamiaNameArabic || ''} 
                      onChange={(e) => setSettings(prev => ({...prev, jamiaNameArabic: e.target.value}))} 
                      className="w-full p-2.5 border rounded-xl bg-white dark:bg-slate-950 border-stone-300 dark:border-slate-700 font-arabic focus:ring-2 focus:ring-[#B88A3B] outline-none" 
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div>
                    <label className="block font-bold mb-1.5 text-stone-800 dark:text-stone-200">
                      رجسٹریشن نمبر (Government Registration No)
                    </label>
                    <input 
                      type="text" 
                      value={settings?.registrationNumber || '1454/5/5183'} 
                      onChange={(e) => setSettings(prev => ({...prev, registrationNumber: e.target.value}))} 
                      placeholder="1454/5/5183" 
                      className="w-full p-2.5 border rounded-xl font-mono bg-white dark:bg-slate-950 border-stone-300 dark:border-slate-700 focus:ring-2 focus:ring-[#B88A3B] outline-none" 
                    />
                  </div>
                  <div>
                    <label className="block font-bold mb-1.5 text-stone-800 dark:text-stone-200">
                      الحاق نمبر وفاق المدارس (Affiliation No)
                    </label>
                    <input 
                      type="text" 
                      value={settings?.affiliationNumber || '08-04-09345'} 
                      onChange={(e) => setSettings(prev => ({...prev, affiliationNumber: e.target.value}))} 
                      placeholder="08-04-09345" 
                      className="w-full p-2.5 border rounded-xl font-mono bg-white dark:bg-slate-950 border-stone-300 dark:border-slate-700 focus:ring-2 focus:ring-[#B88A3B] outline-none" 
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-bold mb-1.5 text-stone-800 dark:text-stone-200 text-xs">
                    جامعہ کا نعرہ / سلوگن (Tagline)
                  </label>
                  <input 
                    type="text" 
                    value={settings?.tagline?.ur || 'دین و دنیا کی جامع تعلیم و تربیت کا عظیم اسلامی مرکز'} 
                    onChange={(e) => setSettings(prev => ({
                      ...prev, 
                      tagline: { ...(prev?.tagline || { ur: '', ar: '', en: '' }), ur: e.target.value } 
                    }))} 
                    className="w-full p-2.5 text-xs border rounded-xl bg-white dark:bg-slate-950 border-stone-300 dark:border-slate-700 font-urdu focus:ring-2 focus:ring-[#B88A3B] outline-none" 
                  />
                </div>
              </div>
            )}

            {/* 2. CONTACT & ADDRESS */}
            {activeSection === 'contact' && (
              <div className="space-y-6 animate-fadeIn">
                <div className="border-b border-stone-200 dark:border-slate-800 pb-4">
                  <h3 className="text-lg font-black text-[#5C4632] dark:text-amber-300 flex items-center gap-2">
                    <MapPin className="w-5 h-5 text-emerald-600" />
                    <span>رابطہ معلومات و مرکزی پتہ (Contact Details & Address)</span>
                  </h3>
                  <p className="text-xs text-stone-500 dark:text-stone-400 mt-1">
                    یہاں سے آپ ہیلپ لائن فون نمبر، واٹس ایپ اور مرکزی کیمپس کا پتہ تبدیل کر سکتے ہیں۔
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                  <div>
                    <label className="block font-bold mb-1.5 text-stone-800 dark:text-stone-200 flex items-center gap-1.5">
                      <Phone className="w-3.5 h-3.5 text-emerald-600" />
                      <span>فون نمبر (موبائل / لینڈ لائن)</span>
                    </label>
                    <input 
                      type="text" 
                      value={settings?.phonePrimary || ''} 
                      onChange={(e) => setSettings(prev => ({...prev, phonePrimary: e.target.value}))} 
                      placeholder="+92 992 381234"
                      className="w-full p-2.5 border rounded-xl font-mono bg-white dark:bg-slate-950 border-stone-300 dark:border-slate-700 focus:ring-2 focus:ring-emerald-500 outline-none" 
                    />
                  </div>
                  <div>
                    <label className="block font-bold mb-1.5 text-stone-800 dark:text-stone-200 flex items-center gap-1.5">
                      <Smartphone className="w-3.5 h-3.5 text-emerald-600" />
                      <span>واٹس ایپ نمبر (رسیدیں و فتاویٰ)</span>
                    </label>
                    <input 
                      type="text" 
                      value={settings?.whatsappNumber || ''} 
                      onChange={(e) => setSettings(prev => ({...prev, whatsappNumber: e.target.value}))} 
                      placeholder="+923489002496" 
                      className="w-full p-2.5 border rounded-xl font-mono bg-white dark:bg-slate-950 border-stone-300 dark:border-slate-700 focus:ring-2 focus:ring-emerald-500 outline-none" 
                    />
                  </div>
                  <div>
                    <label className="block font-bold mb-1.5 text-stone-800 dark:text-stone-200 flex items-center gap-1.5">
                      <Mail className="w-3.5 h-3.5 text-emerald-600" />
                      <span>ای میل ایڈریس (Official Email)</span>
                    </label>
                    <input 
                      type="email" 
                      value={settings?.email || ''} 
                      onChange={(e) => setSettings(prev => ({...prev, email: e.target.value}))} 
                      placeholder="info@jamiaislamia.edu.pk"
                      className="w-full p-2.5 border rounded-xl font-mono bg-white dark:bg-slate-950 border-stone-300 dark:border-slate-700 focus:ring-2 focus:ring-emerald-500 outline-none" 
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                  <div className="sm:col-span-2">
                    <label className="block font-bold mb-1.5 text-stone-800 dark:text-stone-200">
                      مرکزی پتہ (Detailed Campus Address)
                    </label>
                    <input 
                      type="text" 
                      value={settings?.address || ''} 
                      onChange={(e) => setSettings(prev => ({...prev, address: e.target.value}))} 
                      placeholder="جامعہ اسلامیہ، مانسہرہ روڈ، ایبٹ آباد، خیبر پختونخوا، پاکستان"
                      className="w-full p-2.5 text-xs border rounded-xl bg-white dark:bg-slate-950 border-stone-300 dark:border-slate-700 font-urdu focus:ring-2 focus:ring-emerald-500 outline-none" 
                    />
                  </div>
                  <div>
                    <label className="block font-bold mb-1.5 text-stone-800 dark:text-stone-200">
                      شہر / ضلع (City)
                    </label>
                    <input 
                      type="text" 
                      value={settings?.city || 'ایبٹ آباد'} 
                      onChange={(e) => setSettings(prev => ({...prev, city: e.target.value}))} 
                      placeholder="ایبٹ آباد"
                      className="w-full p-2.5 text-xs border rounded-xl bg-white dark:bg-slate-950 border-stone-300 dark:border-slate-700 font-urdu focus:ring-2 focus:ring-emerald-500 outline-none" 
                    />
                  </div>
                </div>
              </div>
            )}

            {/* 3. NOTIFICATIONS & ALERTS */}
            {activeSection === 'notifications' && (
              <div className="space-y-6 animate-fadeIn">
                <div className="border-b border-stone-200 dark:border-slate-800 pb-4 flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-black text-[#5C4632] dark:text-amber-300 flex items-center gap-2">
                      <Bell className="w-5 h-5 text-amber-500" />
                      <span>مربوط الرٹس و نوٹیفکیشن سسٹم (Automated Notifications)</span>
                    </h3>
                    <p className="text-xs text-stone-500 dark:text-stone-400 mt-1">
                      جب کوئی سائل سوال پوچھے، داخلہ فارم پر کرے یا کلاس بک کرے تو فوری خودکار الرٹ ارسال ہوں۔
                    </p>
                  </div>
                  <span className="text-[11px] px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 font-sans font-bold border border-emerald-300 dark:border-emerald-800">
                    Live Cloud Alerting
                  </span>
                </div>

                <div className="p-5 bg-emerald-50/50 dark:bg-slate-950/60 rounded-2xl border border-emerald-200 dark:border-slate-800 space-y-4 text-xs">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block font-bold mb-1 text-stone-800 dark:text-stone-200">
                        ایڈمن نوٹیفکیشن ای میل (Alerts Email) *
                      </label>
                      <input 
                        type="email" 
                        value={settings?.notificationEmail || ''} 
                        onChange={(e) => setSettings(prev => ({...prev, notificationEmail: e.target.value}))} 
                        placeholder="usamasiddique105@gmail.com" 
                        className="w-full p-2.5 border rounded-xl font-mono bg-white dark:bg-slate-900 border-stone-300 dark:border-slate-700 focus:outline-none focus:border-emerald-600" 
                      />
                      <span className="text-[10px] text-stone-500 mt-1 block">تمام فتاویٰ و داخلہ فارمز کی کاپی اس ای میل پر ارسال ہوگی۔</span>
                    </div>

                    <div>
                      <label className="block font-bold mb-1 text-stone-800 dark:text-stone-200">
                        ایڈمن واٹس ایپ نمبر (Admin WhatsApp Number) *
                      </label>
                      <input 
                        type="text" 
                        value={settings?.notificationWhatsApp || ''} 
                        onChange={(e) => setSettings(prev => ({...prev, notificationWhatsApp: e.target.value}))} 
                        placeholder="923489002496" 
                        className="w-full p-2.5 border rounded-xl font-mono bg-white dark:bg-slate-900 border-stone-300 dark:border-slate-700 focus:outline-none focus:border-emerald-600" 
                      />
                      <span className="text-[10px] text-stone-500 mt-1 block">سائلین کے ساتھ ون کلک فوری واٹس ایپ ربط کے لیے۔</span>
                    </div>
                  </div>

                  <div>
                    <label className="block font-bold mb-1 text-stone-800 dark:text-stone-200">
                      اختیاری کلاؤڈ فلیئر ورکر / کسٹم ویب ہک یو آر ایل (Custom Webhook URL)
                    </label>
                    <input 
                      type="url" 
                      value={settings?.webhookUrl || ''} 
                      onChange={(e) => setSettings(prev => ({...prev, webhookUrl: e.target.value}))} 
                      placeholder="https://my-worker.myname.workers.dev (اختیاری)" 
                      className="w-full p-2.5 border rounded-xl font-mono bg-white dark:bg-slate-900 border-stone-300 dark:border-slate-700 focus:outline-none focus:border-emerald-600" 
                    />
                  </div>

                  <div className="flex flex-wrap items-center gap-6 pt-2 border-t border-emerald-200/60 dark:border-slate-800">
                    <label className="inline-flex items-center gap-2 cursor-pointer">
                      <input 
                        type="checkbox" 
                        checked={settings?.enableEmailNotifications !== false} 
                        onChange={(e) => setSettings(prev => ({...prev, enableEmailNotifications: e.target.checked}))} 
                        className="rounded text-emerald-600 w-4 h-4 accent-emerald-600"
                      />
                      <span className="font-bold text-stone-700 dark:text-stone-200">ای میل الرٹس فعال رکھیں</span>
                    </label>

                    <label className="inline-flex items-center gap-2 cursor-pointer">
                      <input 
                        type="checkbox" 
                        checked={settings?.enableWhatsAppNotifications !== false} 
                        onChange={(e) => setSettings(prev => ({...prev, enableWhatsAppNotifications: e.target.checked}))} 
                        className="rounded text-emerald-600 w-4 h-4 accent-emerald-600"
                      />
                      <span className="font-bold text-stone-700 dark:text-stone-200">واٹس ایپ نوٹیفکیشن لنکس فعال رکھیں</span>
                    </label>
                  </div>
                </div>
              </div>
            )}

            {/* 4. GEMINI AI TRANSLATION */}
            {activeSection === 'gemini' && (
              <div className="space-y-6 animate-fadeIn">
                <div className="border-b border-stone-200 dark:border-slate-800 pb-4 flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-black text-[#5C4632] dark:text-amber-300 flex items-center gap-2">
                      <Sparkles className="w-5 h-5 text-purple-600" />
                      <span>گوگل جیمینائی اے آئی خودکار ترجمہ سیٹنگز (Gemini AI API)</span>
                    </h3>
                    <p className="text-xs text-stone-500 dark:text-stone-400 mt-1">
                      فتاویٰ اور مضامین کا اردو سے انگریزی و عربی میں خودکار اور درست ترجمہ کریں۔
                    </p>
                  </div>
                  <span className="text-[11px] px-3 py-1 rounded-full bg-purple-100 text-purple-900 dark:bg-purple-950 dark:text-purple-300 font-sans font-bold border border-purple-300 dark:border-purple-800">
                    AI Auto-Translate
                  </span>
                </div>

                <div className="p-5 bg-purple-50/40 dark:bg-slate-950/60 rounded-2xl border border-purple-200 dark:border-slate-800 space-y-4 text-xs">
                  <div>
                    <label className="block font-bold mb-1.5 text-stone-800 dark:text-stone-200">
                      گوگل جیمینائی اے آئی کی (Google Gemini API Key)
                    </label>
                    <input 
                      type="password" 
                      value={settings?.geminiApiKey || ''} 
                      onChange={(e) => setSettings(prev => ({...prev, geminiApiKey: e.target.value}))} 
                      placeholder="AIzaSy..." 
                      className="w-full p-2.5 border rounded-xl font-mono bg-white dark:bg-slate-900 border-stone-300 dark:border-slate-700 focus:outline-none focus:border-purple-600" 
                    />
                    <div className="text-[11px] text-stone-500 dark:text-stone-400 mt-2 space-y-1">
                      <p>• اگر آپ نے Cloudflare Pages میں GEMINI_API_KEY شامل کیا ہے تو وہ خودکار طور پر استعمال ہوگی۔</p>
                      <p>• متبادل طور پر آپ اپنی Google AI Studio سے حاصل کردہ مفت Key براہ راست یہاں درج کر سکتے ہیں۔</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* 5. BANKING & DONATIONS */}
            {activeSection === 'banking' && (
              <div className="space-y-6 animate-fadeIn">
                <div className="border-b border-stone-200 dark:border-slate-800 pb-4">
                  <h3 className="text-lg font-black text-[#5C4632] dark:text-amber-300 flex items-center gap-2">
                    <CreditCard className="w-5 h-5 text-emerald-700" />
                    <span>بینک و آن لائن اکاؤنٹس تفصیلات (عطیات و زکوٰۃ کے لیے)</span>
                  </h3>
                  <p className="text-xs text-stone-500 dark:text-stone-400 mt-1">
                    یہ تفصیلات ویب سائٹ کے "آن لائن عطیات و فنڈز" پیج پر تمام معاونین کو نظر آئیں گی۔
                  </p>
                </div>

                {/* Meezan Bank */}
                <div className="p-5 bg-amber-50/50 dark:bg-slate-950/60 rounded-2xl border border-amber-200 dark:border-slate-800 space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="font-bold text-sm text-emerald-900 dark:text-emerald-300 font-urdu flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-emerald-600"></div>
                      <span>میزان بینک اکاؤنٹ (Meezan Bank Limited)</span>
                    </h4>
                    <span className="text-[10px] text-stone-500 font-sans font-bold">Primary Islamic Bank</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 text-xs">
                    <div>
                      <label className="block font-bold mb-1">اکاؤنٹ ٹائٹل (Account Title)</label>
                      <input 
                        type="text" 
                        value={settings?.bankDetails?.meezanBank?.title || ''} 
                        onChange={(e) => setSettings(prev => ({
                          ...prev, 
                          bankDetails: {
                            ...(prev?.bankDetails || {}), 
                            meezanBank: { ...(prev?.bankDetails?.meezanBank || {} as any), title: e.target.value }
                          } as any
                        }))} 
                        placeholder="JAMIA ISLAMIA ABBOTTABAD"
                        className="w-full p-2.5 border rounded-xl bg-white dark:bg-slate-900 border-stone-300 dark:border-slate-700" 
                      />
                    </div>
                    <div>
                      <label className="block font-bold mb-1">اکاؤنٹ نمبر (Account No)</label>
                      <input 
                        type="text" 
                        value={settings?.bankDetails?.meezanBank?.accountNo || ''} 
                        onChange={(e) => setSettings(prev => ({
                          ...prev, 
                          bankDetails: {
                            ...(prev?.bankDetails || {}), 
                            meezanBank: { ...(prev?.bankDetails?.meezanBank || {} as any), accountNo: e.target.value }
                          } as any
                        }))} 
                        placeholder="01020104859201"
                        className="w-full p-2.5 border rounded-xl font-mono bg-white dark:bg-slate-900 border-stone-300 dark:border-slate-700" 
                      />
                    </div>
                    <div>
                      <label className="block font-bold mb-1">آئی بی اے این (IBAN Number)</label>
                      <input 
                        type="text" 
                        value={settings?.bankDetails?.meezanBank?.iban || ''} 
                        onChange={(e) => setSettings(prev => ({
                          ...prev, 
                          bankDetails: {
                            ...(prev?.bankDetails || {}), 
                            meezanBank: { ...(prev?.bankDetails?.meezanBank || {} as any), iban: e.target.value }
                          } as any
                        }))} 
                        placeholder="PK36MEZN0001020104859201"
                        className="w-full p-2.5 border rounded-xl font-mono bg-white dark:bg-slate-900 border-stone-300 dark:border-slate-700" 
                      />
                    </div>
                    <div>
                      <label className="block font-bold mb-1">برانچ کا نام (Branch Name)</label>
                      <input 
                        type="text" 
                        value={settings?.bankDetails?.meezanBank?.branch || ''} 
                        onChange={(e) => setSettings(prev => ({
                          ...prev, 
                          bankDetails: {
                            ...(prev?.bankDetails || {}), 
                            meezanBank: { ...(prev?.bankDetails?.meezanBank || {} as any), branch: e.target.value }
                          } as any
                        }))} 
                        placeholder="Mansehra Road Branch Abbottabad"
                        className="w-full p-2.5 border rounded-xl bg-white dark:bg-slate-900 border-stone-300 dark:border-slate-700" 
                      />
                    </div>
                    <div>
                      <label className="block font-bold mb-1">سوئفٹ کوڈ (Swift Code - بیرون ملک کے لیے)</label>
                      <input 
                        type="text" 
                        value={settings?.bankDetails?.meezanBank?.swift || ''} 
                        onChange={(e) => setSettings(prev => ({
                          ...prev, 
                          bankDetails: {
                            ...(prev?.bankDetails || {}), 
                            meezanBank: { ...(prev?.bankDetails?.meezanBank || {} as any), swift: e.target.value }
                          } as any
                        }))} 
                        placeholder="MEZNPKKA"
                        className="w-full p-2.5 border rounded-xl font-mono bg-white dark:bg-slate-900 border-stone-300 dark:border-slate-700" 
                      />
                    </div>
                  </div>
                </div>

                {/* Easypaisa & JazzCash */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  {/* Easypaisa */}
                  <div className="p-5 bg-emerald-50/50 dark:bg-slate-950/60 rounded-2xl border border-emerald-200 dark:border-slate-800 space-y-3">
                    <h4 className="font-bold text-sm text-emerald-900 dark:text-emerald-300 font-urdu">ایزی پیسہ اکاؤنٹ (Easypaisa)</h4>
                    <div>
                      <label className="block font-bold mb-1">اکاؤنٹ ٹائٹل (Title)</label>
                      <input 
                        type="text" 
                        value={settings?.bankDetails?.easyPaisa?.title || ''} 
                        onChange={(e) => setSettings(prev => ({
                          ...prev, 
                          bankDetails: {
                            ...(prev?.bankDetails || {}), 
                            easyPaisa: { ...(prev?.bankDetails?.easyPaisa || {} as any), title: e.target.value }
                          } as any
                        }))} 
                        placeholder="Jamia Islamia"
                        className="w-full p-2.5 border rounded-xl bg-white dark:bg-slate-900 border-stone-300 dark:border-slate-700" 
                      />
                    </div>
                    <div>
                      <label className="block font-bold mb-1">ایزی پیسہ موبائل نمبر</label>
                      <input 
                        type="text" 
                        value={settings?.bankDetails?.easyPaisa?.number || ''} 
                        onChange={(e) => setSettings(prev => ({
                          ...prev, 
                          bankDetails: {
                            ...(prev?.bankDetails || {}), 
                            easyPaisa: { ...(prev?.bankDetails?.easyPaisa || {} as any), number: e.target.value }
                          } as any
                        }))} 
                        placeholder="03489002496"
                        className="w-full p-2.5 border rounded-xl font-mono bg-white dark:bg-slate-900 border-stone-300 dark:border-slate-700" 
                      />
                    </div>
                  </div>

                  {/* JazzCash */}
                  <div className="p-5 bg-amber-50/50 dark:bg-slate-950/60 rounded-2xl border border-amber-200 dark:border-slate-800 space-y-3">
                    <h4 className="font-bold text-sm text-amber-900 dark:text-amber-300 font-urdu">جاز کیش اکاؤنٹ (JazzCash)</h4>
                    <div>
                      <label className="block font-bold mb-1">اکاؤنٹ ٹائٹل (Title)</label>
                      <input 
                        type="text" 
                        value={settings?.bankDetails?.jazzCash?.title || ''} 
                        onChange={(e) => setSettings(prev => ({
                          ...prev, 
                          bankDetails: {
                            ...(prev?.bankDetails || {}), 
                            jazzCash: { ...(prev?.bankDetails?.jazzCash || {} as any), title: e.target.value }
                          } as any
                        }))} 
                        placeholder="Jamia Islamia"
                        className="w-full p-2.5 border rounded-xl bg-white dark:bg-slate-900 border-stone-300 dark:border-slate-700" 
                      />
                    </div>
                    <div>
                      <label className="block font-bold mb-1">جاز کیش موبائل نمبر</label>
                      <input 
                        type="text" 
                        value={settings?.bankDetails?.jazzCash?.number || ''} 
                        onChange={(e) => setSettings(prev => ({
                          ...prev, 
                          bankDetails: {
                            ...(prev?.bankDetails || {}), 
                            jazzCash: { ...(prev?.bankDetails?.jazzCash || {} as any), number: e.target.value }
                          } as any
                        }))} 
                        placeholder="03489002496"
                        className="w-full p-2.5 border rounded-xl font-mono bg-white dark:bg-slate-900 border-stone-300 dark:border-slate-700" 
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* 6. SECURITY & PASSWORD */}
            {activeSection === 'security' && (
              <div className="space-y-6 animate-fadeIn">
                <div className="border-b border-stone-200 dark:border-slate-800 pb-4">
                  <h3 className="text-lg font-black text-[#5C4632] dark:text-amber-300 flex items-center gap-2">
                    <Key className="w-5 h-5 text-amber-600" />
                    <span>ایڈمن سیکیورٹی و پاس ورڈ تبدیلی (Admin Security & Password)</span>
                  </h3>
                  <p className="text-xs text-stone-500 dark:text-stone-400 mt-1">
                    ایڈمن اکاؤنٹ کا خفیہ پاس ورڈ تبدیل کریں۔ سیکیورٹی کو یقینی بنانے کے لیے مضبوط پاس ورڈ استعمال کریں۔
                  </p>
                </div>

                <div className="p-6 bg-stone-50 dark:bg-slate-950/60 rounded-3xl border border-stone-200 dark:border-slate-800 space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="text-xs text-stone-600 dark:text-stone-300">
                      موجودہ فعال یوزر نیم: <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400">{currentUser?.email || 'jamiaislamia'}</span>
                    </div>
                    <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 font-mono font-bold">
                      PBKDF2 Secured
                    </span>
                  </div>

                  {settingsResetSuccess && (
                    <div className="p-3 rounded-xl bg-emerald-100 dark:bg-emerald-950 border border-emerald-300 dark:border-emerald-800 text-emerald-900 dark:text-emerald-200 text-xs font-bold text-center">
                      {settingsResetSuccess}
                    </div>
                  )}

                  {settingsResetError && (
                    <div className="p-3 rounded-xl bg-red-100 dark:bg-red-950 border border-red-300 dark:border-red-800 text-red-900 dark:text-red-200 text-xs font-bold text-center">
                      {settingsResetError}
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
                    <div>
                      <label className="block text-xs font-bold mb-1 text-stone-700 dark:text-stone-300">موجودہ پاس ورڈ</label>
                      <input
                        type="password"
                        placeholder="Current Password"
                        value={currentPasswordInput}
                        onChange={(e) => setCurrentPasswordInput(e.target.value)}
                        className="w-full p-2.5 text-xs bg-white dark:bg-slate-900 border border-stone-300 dark:border-slate-700 rounded-xl"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold mb-1 text-stone-700 dark:text-stone-300">نیا پاس ورڈ</label>
                      <input
                        type="password"
                        placeholder="New Password (کم از کم ۶ حروف)"
                        value={newPasswordInput}
                        onChange={(e) => setNewPasswordInput(e.target.value)}
                        className="w-full p-2.5 text-xs bg-white dark:bg-slate-900 border border-stone-300 dark:border-slate-700 rounded-xl"
                      />
                    </div>
                  </div>

                  <div className="pt-2 flex justify-end">
                    <button
                      type="button"
                      onClick={onChangePassword}
                      className="px-6 py-2.5 bg-[#5C4632] hover:bg-[#433123] text-amber-300 text-xs font-bold rounded-xl border border-[#B88A3B] transition-all flex items-center gap-2 cursor-pointer shadow-sm"
                    >
                      <Key className="w-4 h-4" />
                      <span>پاس ورڈ تبدیل کریں (Update Password)</span>
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* 7. SEO & WEBMASTER */}
            {activeSection === 'seo' && (
              <div className="space-y-6 animate-fadeIn">
                <div className="border-b border-stone-200 dark:border-slate-800 pb-4">
                  <h3 className="text-lg font-black text-[#5C4632] dark:text-amber-300 flex items-center gap-2">
                    <Globe2 className="w-5 h-5 text-blue-600" />
                    <span>سرچ انجن، گوگل سائٹ میپ و ویب ماسٹر (Google Search Console & SEO)</span>
                  </h3>
                  <p className="text-xs text-stone-500 dark:text-stone-400 mt-1">
                    گوگل سرچ کونسل (Google Search Console) میں سائٹ کی فوری اور درست انڈیکسنگ کے لیے مکمل رہنمائی۔
                  </p>
                </div>

                <div className="space-y-4 text-xs">
                  <div className="p-5 rounded-2xl bg-blue-50/50 dark:bg-slate-950/60 border border-blue-200 dark:border-slate-800 space-y-3">
                    <h4 className="font-bold text-sm text-blue-950 dark:text-blue-300 flex items-center gap-2">
                      <FileCode className="w-4 h-4 text-blue-600" />
                      <span>سائٹ میپ لنکس (Sitemap URLs)</span>
                    </h4>
                    <p className="text-stone-600 dark:text-stone-300">
                      آپ کی ویب سائٹ کا خودکار XML سائٹ میپ تیار ہے۔ گوگل سرچ کونسل میں صرف درج ذیل داخل کریں:
                    </p>
                    <div className="bg-white dark:bg-slate-900 p-3 rounded-xl border border-stone-200 dark:border-slate-800 font-mono font-bold text-emerald-600 text-xs flex items-center justify-between">
                      <span>sitemap.xml</span>
                      <a href="/sitemap.xml" target="_blank" rel="noreferrer" className="text-blue-600 hover:underline text-[11px] font-sans">
                        لائیو سائٹ میپ دیکھیں ↗
                      </a>
                    </div>
                  </div>

                  <div className="p-5 rounded-2xl bg-amber-50/50 dark:bg-slate-950/60 border border-amber-200 dark:border-slate-800 space-y-2">
                    <h4 className="font-bold text-sm text-[#5C4632] dark:text-amber-300 flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 text-amber-600" />
                      <span>گوگل سرچ کونسل "Couldn't Fetch" مسئلہ کا فوری حل:</span>
                    </h4>
                    <ul className="list-disc list-inside space-y-1.5 text-stone-700 dark:text-stone-300 text-[11px] leading-relaxed">
                      <li>
                        <strong>کلاؤڈ فلیئر باٹ فائٹ موڈ (Bot Fight Mode):</strong> اگر آپ نے Cloudflare Dashboard میں "Bot Fight Mode" آن کیا ہوا ہے تو وہ گوگل کے کرالر (Googlebot) کو سائٹ میپ پڑھنے سے روک دیتا ہے۔ Cloudflare ➔ Security ➔ Bots میں جا کر اسے آف کریں یا Googlebot کو بائی پاس کریں۔
                      </li>
                      <li>
                        <strong>صرف <code className="bg-amber-100 px-1 py-0.5 rounded font-mono">sitemap.xml</code> درج کریں:</strong> سرچ کونسل کے خانے میں پورا ڈومین نام دوبارہ نہ لکھیں بلکہ صرف <code className="font-mono">sitemap.xml</code> لکھ کر Submit کریں۔
                      </li>
                      <li>
                        <strong>URL Inspection ٹول:</strong> Search Console میں سب سے اوپر اپنی مین ویب سائٹ کا لنک لکھ کر "Test Live URL" کریں تاکہ گوگل فوری کیشے بنا لے۔
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            )}

            {/* 8. BACKUP & RESTORE */}
            {activeSection === 'backup' && (
              <div className="space-y-6 animate-fadeIn">
                <div className="border-b border-stone-200 dark:border-slate-800 pb-4">
                  <h3 className="text-lg font-black text-[#5C4632] dark:text-amber-300 flex items-center gap-2">
                    <Database className="w-5 h-5 text-[#B88A3B]" />
                    <span>جامعہ اسلامیہ ڈیٹا بیس کا مکمل بیک اپ اور بحالی (Backup & Restore)</span>
                  </h3>
                  <p className="text-xs text-stone-500 dark:text-stone-400 mt-1">
                    تمام فتاویٰ، سائلین کے سوالات، داخلہ فارمز، نتائج، کتب، اور سیٹنگز کی سنگل محفوظ فائل ڈاؤن لوڈ یا بحال کریں۔
                  </p>
                </div>

                <div className="p-6 bg-stone-50 dark:bg-slate-950/60 rounded-3xl border border-stone-200 dark:border-slate-800 space-y-4">
                  <p className="text-xs text-stone-600 dark:text-stone-300">
                    یہاں سے آپ سنگل کلک پر تمام ڈیٹا کی مکمل JSON بیک اپ فائل محفوظ کر سکتے ہیں یا کسی بھی وقت اپلوڈ کر کے ڈیٹا واپس بحال کر سکتے ہیں:
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
                    {/* Export Button */}
                    <button
                      type="button"
                      onClick={onExportBackup}
                      className="p-4 bg-white dark:bg-slate-900 hover:bg-amber-50 dark:hover:bg-slate-800 border-2 border-dashed border-amber-300 dark:border-slate-700 rounded-2xl text-xs font-bold text-[#5C4632] dark:text-amber-300 flex items-center justify-center gap-2.5 transition-all shadow-sm cursor-pointer"
                    >
                      <Download className="w-5 h-5 text-emerald-600" />
                      <span>مکمل ڈیٹا بیک اپ ڈاؤن لوڈ کریں (Export Backup)</span>
                    </button>

                    {/* Import/Restore Button */}
                    <label className="p-4 bg-white dark:bg-slate-900 hover:bg-blue-50 dark:hover:bg-slate-800 border-2 border-dashed border-blue-300 dark:border-slate-700 rounded-2xl text-xs font-bold text-[#5C4632] dark:text-blue-300 flex items-center justify-center gap-2.5 transition-all shadow-sm cursor-pointer">
                      <Upload className="w-5 h-5 text-blue-600" />
                      <span>بیک اپ فائل اپلوڈ و بحال کریں (Restore Backup)</span>
                      <input
                        type="file"
                        accept=".json"
                        onChange={onImportBackup}
                        className="hidden"
                      />
                    </label>
                  </div>
                </div>

                <div className="pt-4 border-t border-stone-200 dark:border-slate-800 flex items-center justify-between">
                  <button 
                    type="button" 
                    onClick={onReset} 
                    className="px-4 py-2.5 bg-stone-200 dark:bg-slate-800 hover:bg-red-100 dark:hover:bg-red-950 text-stone-700 dark:text-stone-300 hover:text-red-700 dark:hover:text-red-300 text-xs rounded-xl font-bold transition-colors cursor-pointer"
                  >
                    ڈیفالٹ سیٹنگز پر ری سیٹ کریں (Reset All to Defaults)
                  </button>
                </div>
              </div>
            )}

            {/* Bottom Form Actions Bar */}
            <div className="pt-6 border-t border-stone-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-4">
              <div className="text-[11px] text-stone-500 font-sans">
                Jamia Islamia Abbottabad — Settings will take effect immediately.
              </div>

              <div className="flex items-center gap-3">
                <button
                  type="submit"
                  className="px-8 py-3 bg-emerald-800 hover:bg-emerald-700 text-amber-200 font-bold text-xs rounded-xl shadow-lg flex items-center gap-2 cursor-pointer transition-all border border-emerald-600"
                >
                  <Save className="w-4 h-4" />
                  <span>تمام تبدیلیاں محفوظ کریں (Save All Settings)</span>
                </button>
              </div>
            </div>

          </form>
        </div>

      </div>
    </div>
  );
};
