import React, { useState, useEffect } from 'react';
import { useThemeLanguage } from '../context/ThemeLanguageContext';
import { StorageService } from '../services/storage';
import { ClassBooking } from '../types';
import headerLogoCalligraphy from '../assets/images/jamia_logo_calligraphy_transparent.png';
import { JAMIA_HEADER_LOGO_DATA_URI } from '../assets/logoBase64';
import { DonationView } from './DonationView';
import { 
  BookOpen, 
  GraduationCap, 
  Send, 
  Zap,
  Globe, 
  ShieldCheck, 
  Book, 
  Sparkles, 
  CheckCircle2, 
  Clock, 
  CreditCard, 
  Calendar, 
  UserCheck, 
  HelpCircle, 
  MessageSquare,
  ChevronDown,
  ChevronUp,
  Award,
  Video,
  PhoneCall,
  Info,
  Shield,
  Star,
  Heart,
  Copy,
  Check,
  Building2,
  Wallet,
  Smartphone,
  MessageCircle,
  FileText,
  Building,
  CheckCheck
} from 'lucide-react';

interface OnlineServicesViewProps {
  activeSubTab?: string;
  onSelectSubTab?: (subTab: string) => void;
  onOpenFatwaModal?: () => void;
  setCurrentTab?: (tab: string) => void;
}

export const OnlineServicesView: React.FC<OnlineServicesViewProps> = ({
  activeSubTab = 'online-quran',
  onSelectSubTab,
  onOpenFatwaModal,
  setCurrentTab
}) => {
  const { t, language } = useThemeLanguage();

  // Helper to resolve primary tab from incoming activeSubTab
  const getInitialPrimaryTab = (tab: string) => {
    if (tab === 'online-taawun' || tab === 'taawun' || tab === 'donations') return 'online-taawun';
    if (tab === 'online-admission') return 'online-admission';
    if (tab === 'online-trial') return 'online-trial';
    if (tab === 'online-dars-nizami' || tab === 'online-arabic' || tab === 'online-fiqh' || tab === 'online-tafseer' || tab === 'online-hadith') {
      return 'online-dars-nizami';
    }
    return 'online-quran';
  };

  const [primaryTab, setPrimaryTab] = useState<string>(() => getInitialPrimaryTab(activeSubTab));
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const handleCopy = (text: string, key: string) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2500);
  };
  
  // Sub-course selection under Dars-e-Nizami
  const [darsSubCourse, setDarsSubCourse] = useState<string>(() => {
    if (['online-arabic', 'online-fiqh', 'online-tafseer', 'online-hadith'].includes(activeSubTab)) {
      return activeSubTab;
    }
    return 'all';
  });

  // Quran sub-filter (Tajweed vs Hifz)
  const [quranFilter, setQuranFilter] = useState<'all' | 'tajweed' | 'hifz'>('all');

  useEffect(() => {
    if (activeSubTab) {
      setPrimaryTab(getInitialPrimaryTab(activeSubTab));
      if (['online-arabic', 'online-fiqh', 'online-tafseer', 'online-hadith'].includes(activeSubTab)) {
        setDarsSubCourse(activeSubTab);
      }
    }
  }, [activeSubTab]);

  // Forms
  const [admissionForm, setAdmissionForm] = useState({
    studentName: '',
    guardianName: '',
    age: '',
    country: 'پاکستان (Pakistan)',
    phone: '',
    email: '',
    course: 'آن لائن قرآن کریم (تجوید و حفظ)',
    preferredTime: 'شام (Evening)',
  });

  const [trialForm, setTrialForm] = useState({
    name: '',
    country: '',
    phone: '',
    course: 'آن لائن قرآن کریم (تجوید و حفظ)',
    whatsapp: ''
  });

  const [admissionSubmitted, setAdmissionSubmitted] = useState(false);
  const [trialSubmitted, setTrialSubmitted] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const handlePrimaryTabChange = (tabId: string) => {
    if (tabId === 'online-taawun' && setCurrentTab) {
      setCurrentTab('donations');
      return;
    }
    setPrimaryTab(tabId);
    if (onSelectSubTab) {
      onSelectSubTab(tabId);
    }
  };

  const handleAdmissionSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Save to Admin Portal Storage
    const newBooking: ClassBooking = {
      id: `book-adm-${Date.now()}`,
      bookingType: 'Admission',
      studentName: admissionForm.studentName.trim(),
      guardianName: admissionForm.guardianName.trim(),
      age: admissionForm.age,
      country: admissionForm.country,
      phone: admissionForm.phone,
      whatsapp: admissionForm.phone,
      email: admissionForm.email,
      course: admissionForm.course,
      preferredTime: admissionForm.preferredTime,
      date: new Date().toISOString().split('T')[0],
      status: 'Pending',
      adminNotes: 'نئے آن لائن داخلہ فارم کے ذریعے موصول ہوا ہے۔'
    };
    StorageService.addClassBooking(newBooking);

    setAdmissionSubmitted(true);
    setTimeout(() => {
      setAdmissionSubmitted(false);
      setAdmissionForm({
        studentName: '',
        guardianName: '',
        age: '',
        country: 'پاکستان (Pakistan)',
        phone: '',
        email: '',
        course: 'آن لائن قرآن کریم (تجوید و حفظ)',
        preferredTime: 'شام (Evening)',
      });
    }, 4000);
  };

  const handleTrialSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Save to Admin Portal Storage
    const newTrial: ClassBooking = {
      id: `book-trial-${Date.now()}`,
      bookingType: 'Trial',
      studentName: trialForm.name.trim(),
      country: trialForm.country || 'پاکستان (Pakistan)',
      phone: trialForm.phone || trialForm.whatsapp,
      whatsapp: trialForm.whatsapp || trialForm.phone,
      course: trialForm.course,
      date: new Date().toISOString().split('T')[0],
      status: 'Pending',
      adminNotes: '۳ روزہ مفت ٹرائل کلاس کے لیے نئی بکنگ موصول ہوئی ہے۔'
    };
    StorageService.addClassBooking(newTrial);

    setTrialSubmitted(true);
    setTimeout(() => {
      setTrialSubmitted(false);
      setTrialForm({
        name: '',
        country: '',
        phone: '',
        course: 'آن لائن قرآن کریم (تجوید و حفظ)',
        whatsapp: ''
      });
    }, 4000);
  };

  // 5 Primary Menu Sections required by guidelines & user request
  const primaryTabsList = [
    { 
      id: 'online-quran', 
      label: 'آن لائن قرآن کریم (تجوید و حفظ)', 
      icon: BookOpen,
      badge: 'پاپولر',
      desc: 'ناظرہ، تجوید، حفظ اور مسنون دعائیں'
    },
    { 
      id: 'online-dars-nizami', 
      label: 'درسِ نظامی آن لائن', 
      icon: GraduationCap,
      badge: 'جامع کورس',
      desc: 'نحو، صرف، فقہ، تفسیر و حدیث شریف'
    },
    { 
      id: 'online-taawun', 
      label: 'طریقہ تعاون', 
      icon: Heart,
      badge: 'زکوٰۃ و عطیات',
      desc: 'زکوٰۃ، صدقات اور عطیات کے بنک اکاؤنٹس'
    },
    { 
      id: 'online-admission', 
      label: 'آن لائن داخلہ فارم', 
      icon: Send,
      badge: 'اوپن',
      desc: 'طالب علم کی آسان اور آن لائن رجسٹریشن'
    },
    { 
      id: 'online-trial', 
      label: 'مفت آزمائشی کلاس', 
      icon: Zap,
      badge: '۳ دن مفت',
      desc: '3 دن کی مفت ٹرائل کلاس حاصل کریں'
    },
  ];

  // Dars-e-Nizami Sub-Courses
  const darsSubCoursesList = [
    { id: 'all', label: 'تمام مضامین / خلاصہ', icon: Sparkles },
    { id: 'online-arabic', label: 'عربی زبان کورس', icon: Globe },
    { id: 'online-fiqh', label: 'فقہ و اسلامیات', icon: ShieldCheck },
    { id: 'online-tafseer', label: 'تفسیر القرآن', icon: Sparkles },
    { id: 'online-hadith', label: 'حدیث شریف', icon: Book },
  ];

  const onlineFaqs = [
    {
      q: 'آن لائن کلاسز کس پلیٹ فارم کے ذریعے لی جاتی ہیں؟',
      a: 'آن لائن کلاسز Zoom، Google Meet، Microsoft Teams اور WhatsApp کے ذریعے 1-on-1 اور گروپ لائیو کلاسز میں دی جاتی ہیں۔'
    },
    {
      q: 'کیا مختلف ٹائم زون (پاکستان و اوورسیز) کے طلبہ کے لیے وقت میں لچک ہے؟',
      a: 'جی ہاں! پاکستان، سعودیہ، امارات، قطر، عمان، برطانیہ، امریکہ، کینیڈا، آسٹریلیا اور یورپ کے طلبہ کے مقامی وقت کے مطابق کلاس کا فلیکسیبل ٹائم ایڈجسٹ کیا جاتا ہے۔'
    },
    {
      q: 'مفت آزمائشی کلاس (Free Trial Class) کیسے حاصل کی جائے؟',
      a: 'آپ "مفت آزمائشی کلاس" والے فارم میں نام اور واٹس ایپ نمبر درج کر کے ۳ دن کی بلا معاوضہ ٹرائل کلاس شروع کر سکتے ہیں۔'
    },
    {
      q: 'کیا طالبات کے لیے معلمات (Female Teachers) میسر ہیں؟',
      a: 'جی ہاں، طالبات اور بچیوں کے لیے مکمل شرعی پردے کے ساتھ تجربہ کار و سند یافتہ معلمات کا خاص انتظام موجود ہے۔'
    },
  ];

  return (
    <div className="space-y-8 font-sans text-right" dir="rtl">
      
      {/* Hidden SEO Keywords Block */}
      <div className="sr-only">
        <h2>آن لائن قرآن تجوید و حفظ - درسِ نظامی آن لائن - جامعہ اسلامیہ ایبٹ آباد</h2>
        <p>Online Quran Classes with Tajweed and Hifz, Online Dars-e-Nizami, Arabic Language, Fiqh, Tafseer, Hadith Course.</p>
      </div>

      {/* 1. TOP HEADER BANNER STRIP (عین سکرین شاٹ کے مطابق روایتی اسلامی پٹی مع بارڈر، پس منظر اور تحریر) */}
      <div 
        className="w-full border-y-[3px] border-[#B89B72] dark:border-amber-800 px-3.5 sm:px-8 py-4 sm:py-5 mb-2 shadow-sm relative overflow-hidden flex flex-col md:flex-row items-start md:items-center justify-between gap-4 sm:gap-6"
        style={{
          backgroundColor: '#EBE3D5',
          backgroundImage: `
            radial-gradient(ellipse at center, rgba(245, 239, 230, 0.85) 0%, rgba(232, 222, 207, 0.95) 100%),
            url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23997A4D' fill-opacity='0.12' fill-rule='evenodd'%3E%3Cpath d='M30 0l30 30-30 30L0 30 30 0zm0 7.5L7.5 30 30 52.5 52.5 30 30 7.5zM30 15l15 15-15 15-15-15 15-15zm0 5.25L20.25 30 30 39.75 39.75 30 30 20.25z'/%3E%3C/g%3E%3C/svg%3E")
          `,
          backgroundRepeat: 'repeat'
        }}
      >
        {/* Subtle decorative inner borders */}
        <div className="absolute inset-x-0 top-0.5 h-[1px] bg-[#997A4D]/40"></div>
        <div className="absolute inset-x-0 bottom-0.5 h-[1px] bg-[#997A4D]/40"></div>

        {/* Right Side: Small title, big heading, and detailed text in rich deep bronze ink (#3E2514 / #52341D) */}
        <div className="flex items-start gap-3 sm:gap-3.5 relative z-10 max-w-3xl w-full md:w-auto">
          <div className="w-2 sm:w-2.5 h-10 sm:h-12 bg-[#52341D] rounded-xs shrink-0 shadow-xs mt-1"></div>
          <div className="space-y-0.5 w-full">
            <span className="text-xs sm:text-sm font-bold text-[#6D472B] dark:text-amber-200 font-urdu block">
              جامعہ اسلامیہ اکیڈمی
            </span>
            <h1 className="text-xl sm:text-3xl lg:text-[34px] font-black text-[#3E2514] dark:text-amber-100 tracking-wide font-urdu leading-snug sm:leading-tight" style={{ color: '#3E2514' }}>
              آن لائن تعلیمی و قرآنی خدمات
            </h1>
            <p className="text-xs sm:text-sm font-urdu leading-relaxed pt-0.5" style={{ color: '#52341D' }}>
              پاکستان اور دنیا بھر کے مسلم بھائیوں، بہنوں اور بچوں کے لیے لائیو آن لائن کلاسز برائے تجوید، حفظ، عربی زبان، فقہ، تفسیر اور حدیث شریف۔
            </p>
          </div>
        </div>

        {/* Left / Center-left Side: Jamia Calligraphy Logo */}
        <div className="shrink-0 relative z-10 self-center md:self-center flex items-center justify-center w-full md:w-auto md:mr-auto md:ml-8 lg:ml-16 py-1">
          <img 
            src={JAMIA_HEADER_LOGO_DATA_URI || headerLogoCalligraphy} 
            alt="الجامعة الإسلامية ايبت آباد" 
            className="h-12 sm:h-16 md:h-20 lg:h-24 w-auto max-w-[220px] sm:max-w-[340px] md:max-w-[400px] object-contain transition-all"
            style={{
              filter: 'sepia(0.6) hue-rotate(330deg) saturate(1.8) contrast(1.2)'
            }}
            onError={(e) => {
              const target = e.currentTarget;
              target.src = JAMIA_HEADER_LOGO_DATA_URI || '/jamia_logo_calligraphy_transparent.png';
            }}
          />
        </div>
      </div>

      {/* SIMPLIFIED 5 PRIMARY TAB ROW */}
      <div className="bg-[#F8F4EC] dark:bg-slate-900 border-2 border-[#B88A3B] rounded-2xl p-2 sm:p-3 shadow-md">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-2">
          {primaryTabsList.map((tab) => {
            const IconComponent = tab.icon;
            const isSelected = primaryTab === tab.id;

            return (
              <button
                key={tab.id}
                onClick={() => handlePrimaryTabChange(tab.id)}
                className={`p-3.5 rounded-xl transition-all text-right border cursor-pointer relative flex flex-col justify-between group ${
                  isSelected
                    ? 'bg-[#5C4632] text-[#F8F4EC] border-[#B88A3B] shadow-lg ring-2 ring-[#B88A3B]/50'
                    : 'bg-white dark:bg-slate-800 text-stone-800 dark:text-stone-200 border-stone-200 dark:border-slate-700 hover:border-[#B88A3B]'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <div className={`p-2 rounded-lg ${isSelected ? 'bg-[#B88A3B] text-slate-950' : 'bg-[#5C4632]/10 dark:bg-slate-700 text-[#5C4632] dark:text-amber-300'}`}>
                      <IconComponent className="w-5 h-5" />
                    </div>
                    <span className={`text-[10px] font-urdu font-bold px-2 py-0.5 rounded-full border ${
                      isSelected 
                        ? 'bg-[#B88A3B]/30 text-[#B88A3B] border-[#B88A3B]/50' 
                        : 'bg-stone-100 dark:bg-slate-700 text-stone-600 dark:text-stone-300 border-stone-300 dark:border-slate-600'
                    }`}>
                      {tab.badge}
                    </span>
                  </div>
                  
                  <h3 className={`text-base font-bold font-urdu leading-tight ${isSelected ? 'text-[#B88A3B]' : 'text-stone-900 dark:text-stone-100'}`}>
                    {tab.label}
                  </h3>
                  <p className={`text-xs mt-1 font-urdu line-clamp-1 ${isSelected ? 'text-stone-200' : 'text-stone-500 dark:text-stone-400'}`}>
                    {tab.desc}
                  </p>
                </div>

                <div className="mt-3 text-left">
                  <span className={`text-[11px] font-urdu font-bold inline-flex items-center gap-1 ${isSelected ? 'text-[#B88A3B]' : 'text-[#5C4632] dark:text-amber-300'}`}>
                    <span>تفصیلات دیکھیں</span>
                    <span>←</span>
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* DYNAMIC VIEW BASED ON SELECTED PRIMARY TAB */}

      {/* SECTION 1: آن لائن قرآن کریم (تجوید و حفظ) */}
      {primaryTab === 'online-quran' && (
        <div className="space-y-6">
          <div className="bg-white dark:bg-slate-800 border-2 border-[#B88A3B]/50 rounded-2xl p-6 shadow-md space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-stone-200 dark:border-slate-700 pb-4">
              <div>
                <div className="flex items-center gap-2">
                  <BookOpen className="w-6 h-6 text-[#B88A3B]" />
                  <h2 className="text-2xl font-bold font-urdu text-[#5C4632] dark:text-amber-300">
                    آن لائن قرآن کریم (تجوید و حفظ)
                  </h2>
                </div>
                <p className="text-sm font-urdu text-stone-600 dark:text-stone-300 mt-1">
                  ناظرہ قرآن، مخارج و تجوید اور حفظ القرآن کریم کے خصوصی شعبہ جات کا اکٹھا خلاصہ
                </p>
              </div>

              {/* Sub-Filter Switcher */}
              <div className="flex items-center gap-1.5 bg-[#F8F4EC] dark:bg-slate-900 p-1 rounded-xl border border-[#B88A3B]/40 font-urdu text-xs">
                <button
                  onClick={() => setQuranFilter('all')}
                  className={`px-3 py-1.5 rounded-lg font-bold cursor-pointer transition-colors ${quranFilter === 'all' ? 'bg-[#5C4632] text-white shadow-xs' : 'text-stone-700 dark:text-stone-300 hover:text-[#B88A3B]'}`}
                >
                  تمام قرآن پروگرامز
                </button>
                <button
                  onClick={() => setQuranFilter('tajweed')}
                  className={`px-3 py-1.5 rounded-lg font-bold cursor-pointer transition-colors ${quranFilter === 'tajweed' ? 'bg-[#5C4632] text-white shadow-xs' : 'text-stone-700 dark:text-stone-300 hover:text-[#B88A3B]'}`}
                >
                  آن لائن تجوید
                </button>
                <button
                  onClick={() => setQuranFilter('hifz')}
                  className={`px-3 py-1.5 rounded-lg font-bold cursor-pointer transition-colors ${quranFilter === 'hifz' ? 'bg-[#5C4632] text-white shadow-xs' : 'text-stone-700 dark:text-stone-300 hover:text-[#B88A3B]'}`}
                >
                  حفظ القرآن
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Tajweed Card */}
              {(quranFilter === 'all' || quranFilter === 'tajweed') && (
                <div className="bg-[#F8F4EC] dark:bg-slate-900 border-2 border-[#B88A3B]/60 rounded-xl p-5 space-y-4 relative overflow-hidden">
                  <div className="flex items-center justify-between">
                    <span className="px-2.5 py-0.5 bg-[#B88A3B] text-slate-950 text-xs font-bold font-urdu rounded-full">
                      لیول ۱: بنیادی و پیشرفته
                    </span>
                    <BookOpen className="w-5 h-5 text-[#B88A3B]" />
                  </div>

                  <h3 className="text-xl font-bold font-urdu text-[#5C4632] dark:text-amber-300">
                    آن لائن قرآن کریم مع تجوید
                  </h3>

                  <p className="text-sm font-urdu text-stone-700 dark:text-stone-300 leading-relaxed">
                    نورانی قاعدہ، صحیح مخارج الاداء، قواعد تجوید، نماز مع ترجمہ اور مسنون دعاؤں کے ساتھ ناظرہ قرآن کریم کی لائیو 1-on-1 مشق۔
                  </p>

                  <ul className="space-y-2 text-xs font-urdu text-stone-800 dark:text-stone-200">
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-[#B88A3B] shrink-0" />
                      <span>نورانی قاعدہ اور تجوید کے ابتدائی اصول</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-[#B88A3B] shrink-0" />
                      <span>حروف کے درست مخارج اور ترتیل کے ساتھ تلاوت</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-[#B88A3B] shrink-0" />
                      <span>روزمرہ مسنون دعائیں اور نماز مسنون کا طریقہ</span>
                    </li>
                  </ul>

                  <div className="pt-2 flex gap-2">
                    <button 
                      onClick={() => handlePrimaryTabChange('online-admission')}
                      className="w-full py-2 bg-[#5C4632] hover:bg-[#433324] text-[#F8F4EC] text-xs font-urdu font-bold rounded-lg transition-colors border border-[#B88A3B] cursor-pointer"
                    >
                      تجوید کلاس میں داخلہ لیں
                    </button>
                  </div>
                </div>
              )}

              {/* Hifz Card */}
              {(quranFilter === 'all' || quranFilter === 'hifz') && (
                <div className="bg-[#F8F4EC] dark:bg-slate-900 border-2 border-[#B88A3B]/60 rounded-xl p-5 space-y-4 relative overflow-hidden">
                  <div className="flex items-center justify-between">
                    <span className="px-2.5 py-0.5 bg-[#5C4632] text-[#F8F4EC] text-xs font-bold font-urdu rounded-full border border-[#B88A3B]">
                      لیول ۲: حفظ مکمل
                    </span>
                    <Award className="w-5 h-5 text-[#B88A3B]" />
                  </div>

                  <h3 className="text-xl font-bold font-urdu text-[#5C4632] dark:text-amber-300">
                    حفظ القرآن پروگرام
                  </h3>

                  <p className="text-sm font-urdu text-stone-700 dark:text-stone-300 leading-relaxed">
                    مکمل حفظِ قرآن، منتخب سورتوں کا حفظ (سورۃ یٰس، المُلک، واقعہ، الکہف)، اور سابقہ منزلوں (دہرائی) کا مضبوط نظام۔
                  </p>

                  <ul className="space-y-2 text-xs font-urdu text-stone-800 dark:text-stone-200">
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-[#B88A3B] shrink-0" />
                      <span>روزانہ نیا سبق، سبقی اور منزل کا انفرادی جائزہ</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-[#B88A3B] shrink-0" />
                      <span>تجربہ کار قراء اور حفاظ کرام کی لائیو نگرانی</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-[#B88A3B] shrink-0" />
                      <span>تکمیل پر باقاعدہ تصدیق شدہ حفظِ قرآن کی سند</span>
                    </li>
                  </ul>

                  <div className="pt-2 flex gap-2">
                    <button 
                      onClick={() => handlePrimaryTabChange('online-admission')}
                      className="w-full py-2 bg-[#B88A3B] hover:bg-[#a17831] text-slate-950 text-xs font-urdu font-bold rounded-lg transition-colors cursor-pointer"
                    >
                      حفظ پروگرام میں داخلہ لیں
                    </button>
                  </div>
                </div>
              )}

            </div>
          </div>
        </div>
      )}

      {/* SECTION 2: درسِ نظامی آن لائن (GATHERING SUB-COURSES) */}
      {primaryTab === 'online-dars-nizami' && (
        <div className="space-y-6">
          <div className="bg-white dark:bg-slate-800 border-2 border-[#B88A3B]/50 rounded-2xl p-6 shadow-md space-y-6">
            
            <div className="border-b border-stone-200 dark:border-slate-700 pb-4 space-y-3">
              <div className="flex items-center gap-2">
                <GraduationCap className="w-7 h-7 text-[#B88A3B]" />
                <h2 className="text-2xl sm:text-3xl font-bold font-urdu text-[#5C4632] dark:text-amber-300">
                  درسِ نظامی آن لائن (عالمی اکیڈمی)
                </h2>
              </div>
              <p className="text-sm font-urdu text-stone-600 dark:text-stone-300">
                وفاق المدارس العربیہ پاکستان کے نصاب کے مطابق آن لائن عالمی درسِ نظامی، عربی زبان، فقہ، تفسیر اور حدیث شریف کا معتبر پلیٹ فارم۔
              </p>

              {/* NESTED SUB-COURSE BAR FOR DARS-E-NIZAMI */}
              <div className="pt-2">
                <span className="text-xs font-urdu font-bold text-[#B88A3B] block mb-2">
                  درسِ نظامی کے ذیلی مضامین کا انتخاب کریں:
                </span>
                <div className="flex flex-wrap gap-2">
                  {darsSubCoursesList.map((sub) => {
                    const SubIcon = sub.icon;
                    const isSelected = darsSubCourse === sub.id;

                    return (
                      <button
                        key={sub.id}
                        onClick={() => setDarsSubCourse(sub.id)}
                        className={`px-3.5 py-2 rounded-xl text-xs font-urdu font-bold flex items-center gap-1.5 transition-all cursor-pointer border ${
                          isSelected
                            ? 'bg-[#5C4632] text-[#F8F4EC] border-[#B88A3B] shadow-sm'
                            : 'bg-[#F8F4EC] dark:bg-slate-900 text-stone-800 dark:text-stone-200 border-stone-300 dark:border-slate-700 hover:border-[#B88A3B]'
                        }`}
                      >
                        <SubIcon className="w-3.5 h-3.5 text-[#B88A3B]" />
                        <span>{sub.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* DARS E NIZAMI CARDS GRID */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* 1. Arabic Language */}
              {(darsSubCourse === 'all' || darsSubCourse === 'online-arabic') && (
                <div className="bg-[#F8F4EC] dark:bg-slate-900 border-2 border-[#B88A3B]/60 rounded-xl p-5 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="px-2.5 py-0.5 bg-[#B88A3B] text-slate-950 text-xs font-bold font-urdu rounded-full">
                      مضمون ۱
                    </span>
                    <Globe className="w-5 h-5 text-[#B88A3B]" />
                  </div>
                  <h3 className="text-lg font-bold font-urdu text-[#5C4632] dark:text-amber-300">
                    عربی زبان کورس (اللغة العربية)
                  </h3>
                  <p className="text-xs font-urdu text-stone-700 dark:text-stone-300 leading-relaxed">
                    عربی گرائمر (نحو و صرف)، عربی بول چال (المحادثة العربية) اور لسان القرآن کریم میں مہارت حاصل کرنے کا جامع کورس۔
                  </p>
                  <ul className="space-y-1.5 text-xs font-urdu text-stone-800 dark:text-stone-200">
                    <li className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-[#B88A3B]" /> قواعد النحو والصرف کی عملی مشق</li>
                    <li className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-[#B88A3B]" /> عربی بول چال اور روزمرہ تعبیرات</li>
                  </ul>
                  <button onClick={() => handlePrimaryTabChange('online-admission')} className="w-full mt-2 py-1.5 bg-[#5C4632] text-white text-xs font-urdu font-bold rounded-lg hover:bg-[#433324] cursor-pointer">
                    اس مضمون میں داخلہ لیں
                  </button>
                </div>
              )}

              {/* 2. Fiqh & Islamic Studies */}
              {(darsSubCourse === 'all' || darsSubCourse === 'online-fiqh') && (
                <div className="bg-[#F8F4EC] dark:bg-slate-900 border-2 border-[#B88A3B]/60 rounded-xl p-5 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="px-2.5 py-0.5 bg-[#5C4632] text-white text-xs font-bold font-urdu rounded-full border border-[#B88A3B]">
                      مضمون ۲
                    </span>
                    <ShieldCheck className="w-5 h-5 text-[#B88A3B]" />
                  </div>
                  <h3 className="text-lg font-bold font-urdu text-[#5C4632] dark:text-amber-300">
                    فقہ و اسلامیات (Fiqh & Islamic Law)
                  </h3>
                  <p className="text-xs font-urdu text-stone-700 dark:text-stone-300 leading-relaxed">
                    کتبِ فقہ (قدوری، کنز الدقائق، الہدایۃ) کی روشنی میں طہارت، نماز، زکوۃ، روزہ، تجارت اور جدید درپیش فقہی مسائل کی تدریس۔
                  </p>
                  <ul className="space-y-1.5 text-xs font-urdu text-stone-800 dark:text-stone-200">
                    <li className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-[#B88A3B]" /> عبادات، معاملات اور فرائض الشریعہ</li>
                    <li className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-[#B88A3B]" /> جدید معاشی و تجارتی احکام کی فہم</li>
                  </ul>
                  <button onClick={() => handlePrimaryTabChange('online-admission')} className="w-full mt-2 py-1.5 bg-[#5C4632] text-white text-xs font-urdu font-bold rounded-lg hover:bg-[#433324] cursor-pointer">
                    اس مضمون میں داخلہ لیں
                  </button>
                </div>
              )}

              {/* 3. Tafseer */}
              {(darsSubCourse === 'all' || darsSubCourse === 'online-tafseer') && (
                <div className="bg-[#F8F4EC] dark:bg-slate-900 border-2 border-[#B88A3B]/60 rounded-xl p-5 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="px-2.5 py-0.5 bg-[#B88A3B] text-slate-950 text-xs font-bold font-urdu rounded-full">
                      مضمون ۳
                    </span>
                    <Sparkles className="w-5 h-5 text-[#B88A3B]" />
                  </div>
                  <h3 className="text-lg font-bold font-urdu text-[#5C4632] dark:text-amber-300">
                    تفسیر القرآن کریم (Tafseer)
                  </h3>
                  <p className="text-xs font-urdu text-stone-700 dark:text-stone-300 leading-relaxed">
                    ترجمہ قرآن، ربطِ آیات، اسبابِ نزول، اصولِ تفسیر اور معتبر تفاسیر (تفسیر عثمانی، معارف القرآن) کے ساتھ بامحاورہ باقاعدہ فہم۔
                  </p>
                  <ul className="space-y-1.5 text-xs font-urdu text-stone-800 dark:text-stone-200">
                    <li className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-[#B88A3B]" /> لفظی و بامحاورہ سلیس ترجمہ</li>
                    <li className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-[#B88A3B]" /> تفسیر اور مضامینِ قرآن کی تشریح</li>
                  </ul>
                  <button onClick={() => handlePrimaryTabChange('online-admission')} className="w-full mt-2 py-1.5 bg-[#5C4632] text-white text-xs font-urdu font-bold rounded-lg hover:bg-[#433324] cursor-pointer">
                    اس مضمون میں داخلہ لیں
                  </button>
                </div>
              )}

              {/* 4. Hadith */}
              {(darsSubCourse === 'all' || darsSubCourse === 'online-hadith') && (
                <div className="bg-[#F8F4EC] dark:bg-slate-900 border-2 border-[#B88A3B]/60 rounded-xl p-5 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="px-2.5 py-0.5 bg-[#5C4632] text-white text-xs font-bold font-urdu rounded-full border border-[#B88A3B]">
                      مضمون ۴
                    </span>
                    <Book className="w-5 h-5 text-[#B88A3B]" />
                  </div>
                  <h3 className="text-lg font-bold font-urdu text-[#5C4632] dark:text-amber-300">
                    حدیث شریف و اصولِ حدیث (Hadith)
                  </h3>
                  <p className="text-xs font-urdu text-stone-700 dark:text-stone-300 leading-relaxed">
                    مشکوۃ المصابیح، صحاح ستہ (بخاری، مسلم، ترمذی) اور اصولِ حدیث کا مطالعہ۔
                  </p>
                  <ul className="space-y-1.5 text-xs font-urdu text-stone-800 dark:text-stone-200">
                    <li className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-[#B88A3B]" /> احادیث مبارکہ کا ترجمہ و تشریح</li>
                    <li className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-[#B88A3B]" /> مصطلح الحديث اور علم الرواية</li>
                  </ul>
                  <button onClick={() => handlePrimaryTabChange('online-admission')} className="w-full mt-2 py-1.5 bg-[#5C4632] text-white text-xs font-urdu font-bold rounded-lg hover:bg-[#433324] cursor-pointer">
                    اس مضمون میں داخلہ لیں
                  </button>
                </div>
              )}

            </div>

            {/* MANDATORY NOTICES BOX */}
            <div className="bg-[#5C4632]/10 dark:bg-slate-900 border border-[#B88A3B]/40 rounded-xl p-4 text-xs font-urdu space-y-1">
              <div className="flex items-center gap-2 text-[#5C4632] dark:text-amber-300 font-bold">
                <Info className="w-4 h-4 text-[#B88A3B]" />
                <span>تعلیمی معلومات کا نوٹس:</span>
              </div>
              <p className="text-stone-700 dark:text-stone-300 font-bold">
                یہ معلومات (اساتذہ، کورس فیس، اور کلاس شیڈول) بعد میں جامعہ کی اصل معلومات کے ساتھ شامل کی جائیں گی۔
              </p>
            </div>

          </div>
        </div>
      )}

      {/* SECTION 3: طریقہ تعاون و بنک اکاؤنٹس */}
      {primaryTab === 'online-taawun' && (
        <DonationView setCurrentTab={setCurrentTab} />
      )}

      {/* SECTION 4: آن لائن داخلہ فارم */}
      {primaryTab === 'online-admission' && (
        <div className="bg-white dark:bg-slate-800 border-2 border-[#B88A3B]/50 rounded-2xl p-6 shadow-md space-y-6">
          <div className="border-b border-stone-200 dark:border-slate-700 pb-4">
            <div className="flex items-center gap-2">
              <Send className="w-6 h-6 text-[#B88A3B]" />
              <h2 className="text-2xl font-bold font-urdu text-[#5C4632] dark:text-amber-300">
                آن لائن داخلہ فارم (Online Admission Form)
              </h2>
            </div>
            <p className="text-xs font-urdu text-stone-600 dark:text-stone-300 mt-1">
              آن لائن اکاڈمی میں باقاعدہ داخلہ کے لیے ذیل میں فارم پر کریں:
            </p>
          </div>

          {admissionSubmitted ? (
            <div className="bg-emerald-50 dark:bg-emerald-950/40 border-2 border-emerald-500 rounded-xl p-6 text-center space-y-3 font-urdu">
              <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto" />
              <h3 className="text-xl font-bold text-emerald-800 dark:text-emerald-200">
                داخلہ درخواست موصول ہو گئی ہے!
              </h3>
              <p className="text-sm text-emerald-700 dark:text-emerald-300">
                جامعہ کی آن لائن اکیڈمی کا ایڈمن جلد ہی آپ سے واٹس ایپ / فون نمبر پر رابطہ کرے گا۔
              </p>
            </div>
          ) : (
            <form onSubmit={handleAdmissionSubmit} className="space-y-4 font-urdu text-xs sm:text-sm">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-stone-800 dark:text-stone-200 font-bold mb-1">طالب علم / طالبہ کا نام *</label>
                  <input
                    type="text"
                    required
                    value={admissionForm.studentName}
                    onChange={(e) => setAdmissionForm({ ...admissionForm, studentName: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-lg border border-stone-300 dark:border-slate-600 bg-stone-50 dark:bg-slate-900 text-stone-900 dark:text-stone-100 focus:outline-none focus:border-[#B88A3B]"
                    placeholder="نام درج کریں"
                  />
                </div>

                <div>
                  <label className="block text-stone-800 dark:text-stone-200 font-bold mb-1">سرپرست کا نام *</label>
                  <input
                    type="text"
                    required
                    value={admissionForm.guardianName}
                    onChange={(e) => setAdmissionForm({ ...admissionForm, guardianName: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-lg border border-stone-300 dark:border-slate-600 bg-stone-50 dark:bg-slate-900 text-stone-900 dark:text-stone-100 focus:outline-none focus:border-[#B88A3B]"
                    placeholder="والد / سرپرست کا نام"
                  />
                </div>

                <div>
                  <label className="block text-stone-800 dark:text-stone-200 font-bold mb-1">عمر (سال) *</label>
                  <input
                    type="number"
                    required
                    value={admissionForm.age}
                    onChange={(e) => setAdmissionForm({ ...admissionForm, age: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-lg border border-stone-300 dark:border-slate-600 bg-stone-50 dark:bg-slate-900 text-stone-900 dark:text-stone-100 focus:outline-none focus:border-[#B88A3B]"
                    placeholder="مثلاً 12 یا 25"
                  />
                </div>

                <div>
                  <label className="block text-stone-800 dark:text-stone-200 font-bold mb-1">موجودہ ملک / شہر *</label>
                  <input
                    type="text"
                    required
                    value={admissionForm.country}
                    onChange={(e) => setAdmissionForm({ ...admissionForm, country: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-lg border border-stone-300 dark:border-slate-600 bg-stone-50 dark:bg-slate-900 text-stone-900 dark:text-stone-100 focus:outline-none focus:border-[#B88A3B]"
                    placeholder="پاکستان، سعودی عرب، یوکے وغیرہ"
                  />
                </div>

                <div>
                  <label className="block text-stone-800 dark:text-stone-200 font-bold mb-1">واٹس ایپ / فون نمبر *</label>
                  <input
                    type="tel"
                    required
                    value={admissionForm.phone}
                    onChange={(e) => setAdmissionForm({ ...admissionForm, phone: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-lg border border-stone-300 dark:border-slate-600 bg-stone-50 dark:bg-slate-900 text-stone-900 dark:text-stone-100 focus:outline-none focus:border-[#B88A3B]"
                    placeholder="+92 348 9002496"
                    dir="ltr"
                  />
                </div>

                <div>
                  <label className="block text-stone-800 dark:text-stone-200 font-bold mb-1">کورس کا انتخاب *</label>
                  <select
                    value={admissionForm.course}
                    onChange={(e) => setAdmissionForm({ ...admissionForm, course: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-lg border border-stone-300 dark:border-slate-600 bg-stone-50 dark:bg-slate-900 text-stone-900 dark:text-stone-100 focus:outline-none focus:border-[#B88A3B]"
                  >
                    <option value="آن لائن قرآن کریم (تجوید و حفظ)">آن لائن قرآن کریم (تجوید و حفظ)</option>
                    <option value="درسِ نظامی آن لائن (مکمل)">درسِ نظامی آن لائن (مکمل)</option>
                    <option value="عربی زبان کورس">عربی زبان کورس</option>
                    <option value="فقہ و اسلامیات">فقہ و اسلامیات</option>
                    <option value="تفسیر القرآن">تفسیر القرآن</option>
                    <option value="حدیث شریف">حدیث شریف</option>
                  </select>
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-[#5C4632] hover:bg-[#433324] text-white font-bold text-sm rounded-xl transition-all shadow-md border border-[#B88A3B] cursor-pointer"
              >
                داخلہ فارم جمع کروائیں
              </button>
            </form>
          )}
        </div>
      )}

      {/* SECTION 4: مفت آزمائشی کلاس */}
      {primaryTab === 'online-trial' && (
        <div className="bg-white dark:bg-slate-800 border-2 border-[#B88A3B]/50 rounded-2xl p-6 shadow-md space-y-6">
          <div className="border-b border-stone-200 dark:border-slate-700 pb-4">
            <div className="flex items-center gap-2">
              <Zap className="w-6 h-6 text-[#B88A3B]" />
              <h2 className="text-2xl font-bold font-urdu text-[#5C4632] dark:text-amber-300">
                ۳ دن کی مفت آزمائشی کلاس (Free 3-Day Trial Class)
              </h2>
            </div>
            <p className="text-xs font-urdu text-stone-600 dark:text-stone-300 mt-1">
              اطمینان کے لیے ۳ دن کی مکمل بلا معاوضہ کلاس حاصل کریں:
            </p>
          </div>

          {trialSubmitted ? (
            <div className="bg-emerald-50 dark:bg-emerald-950/40 border-2 border-emerald-500 rounded-xl p-6 text-center space-y-3 font-urdu">
              <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto" />
              <h3 className="text-xl font-bold text-emerald-800 dark:text-emerald-200">
                مفت ٹرائل کے لیے آپ کا اندراج ہو گیا ہے!
              </h3>
              <p className="text-sm text-emerald-700 dark:text-emerald-300">
                ہمارا نمائندہ واٹس ایپ پر مفت کلاس کے وقت کی تصدیق کے لیے رابطہ کرے گا۔
              </p>
            </div>
          ) : (
            <form onSubmit={handleTrialSubmit} className="space-y-4 font-urdu text-xs sm:text-sm">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-stone-800 dark:text-stone-200 font-bold mb-1">نام *</label>
                  <input
                    type="text"
                    required
                    value={trialForm.name}
                    onChange={(e) => setTrialForm({ ...trialForm, name: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-lg border border-stone-300 dark:border-slate-600 bg-stone-50 dark:bg-slate-900 text-stone-900 dark:text-stone-100 focus:outline-none focus:border-[#B88A3B]"
                    placeholder="اپنا نام درج کریں"
                  />
                </div>

                <div>
                  <label className="block text-stone-800 dark:text-stone-200 font-bold mb-1">ملک *</label>
                  <input
                    type="text"
                    required
                    value={trialForm.country}
                    onChange={(e) => setTrialForm({ ...trialForm, country: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-lg border border-stone-300 dark:border-slate-600 bg-stone-50 dark:bg-slate-900 text-stone-900 dark:text-stone-100 focus:outline-none focus:border-[#B88A3B]"
                    placeholder="مثلاً پاکستان یا سعودی عرب"
                  />
                </div>

                <div>
                  <label className="block text-stone-800 dark:text-stone-200 font-bold mb-1">واٹس ایپ نمبر *</label>
                  <input
                    type="tel"
                    required
                    value={trialForm.whatsapp}
                    onChange={(e) => setTrialForm({ ...trialForm, whatsapp: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-lg border border-stone-300 dark:border-slate-600 bg-stone-50 dark:bg-slate-900 text-stone-900 dark:text-stone-100 focus:outline-none focus:border-[#B88A3B]"
                    placeholder="+92 348 9002496"
                    dir="ltr"
                  />
                </div>

                <div>
                  <label className="block text-stone-800 dark:text-stone-200 font-bold mb-1">مطلوبہ کورس *</label>
                  <select
                    value={trialForm.course}
                    onChange={(e) => setTrialForm({ ...trialForm, course: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-lg border border-stone-300 dark:border-slate-600 bg-stone-50 dark:bg-slate-900 text-stone-900 dark:text-stone-100 focus:outline-none focus:border-[#B88A3B]"
                  >
                    <option value="آن لائن قرآن کریم (تجوید و حفظ)">آن لائن قرآن کریم (تجوید و حفظ)</option>
                    <option value="درسِ نظامی آن لائن">درسِ نظامی آن لائن</option>
                  </select>
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-[#B88A3B] hover:bg-[#a17831] text-slate-950 font-black text-sm rounded-xl transition-all shadow-md cursor-pointer"
              >
                مفت ٹرائل کلاس کا آغاز کریں
              </button>
            </form>
          )}
        </div>
      )}

      {/* FUTURE READY INTEGRATION BADGES */}
      <div className="bg-[#5C4632] text-[#F8F4EC] rounded-2xl p-6 border-2 border-[#B88A3B] shadow-md space-y-3 font-urdu">
        <h3 className="text-lg font-bold text-[#B88A3B] flex items-center gap-2">
          <Video className="w-5 h-5 text-[#B88A3B]" />
          <span>آن لائن تدریسی و آن لائن پیمنٹ پلیٹ فارمز (Live System Features)</span>
        </h3>
        <p className="text-xs text-stone-300">
          تمام لائیو آن لائن کلاسز سیکیور ویڈیو پلیٹ فارمز کے ذریعے لی جاتی ہیں اور تمام تر فیچرز آن لائن ریڈی ہیں:
        </p>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 pt-2 text-center text-xs font-bold">
          <div className="bg-white/10 p-2.5 rounded-xl border border-white/20">Zoom Meetings</div>
          <div className="bg-white/10 p-2.5 rounded-xl border border-white/20">Google Meet</div>
          <div className="bg-white/10 p-2.5 rounded-xl border border-white/20">MS Teams</div>
          <div className="bg-white/10 p-2.5 rounded-xl border border-white/20">WhatsApp Call</div>
          <div className="bg-white/10 p-2.5 rounded-xl border border-white/20">Online Admission</div>
          <div className="bg-white/10 p-2.5 rounded-xl border border-white/20">Online Payment</div>
        </div>
      </div>

      {/* FREQUENTLY ASKED QUESTIONS */}
      <div className="bg-white dark:bg-slate-800 border-2 border-[#B88A3B]/50 rounded-2xl p-6 shadow-md space-y-4 font-urdu">
        <h3 className="text-xl font-bold text-[#5C4632] dark:text-amber-300 flex items-center gap-2">
          <HelpCircle className="w-5 h-5 text-[#B88A3B]" />
          <span>اکثر پوچھے جانے والے سوالات (FAQs)</span>
        </h3>

        <div className="space-y-3">
          {onlineFaqs.map((faq, index) => (
            <div key={index} className="border border-stone-200 dark:border-slate-700 rounded-xl overflow-hidden">
              <button
                onClick={() => setOpenFaq(openFaq === index ? null : index)}
                className="w-full text-right p-3.5 bg-[#F8F4EC] dark:bg-slate-900 hover:bg-[#5C4632]/10 flex items-center justify-between font-bold text-xs sm:text-sm text-stone-800 dark:text-stone-200 cursor-pointer"
              >
                <span>{faq.q}</span>
                {openFaq === index ? <ChevronUp className="w-4 h-4 text-[#B88A3B]" /> : <ChevronDown className="w-4 h-4 text-[#B88A3B]" />}
              </button>
              {openFaq === index && (
                <div className="p-4 bg-white dark:bg-slate-800 text-xs text-stone-600 dark:text-stone-300 leading-relaxed border-t border-stone-200 dark:border-slate-700">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
