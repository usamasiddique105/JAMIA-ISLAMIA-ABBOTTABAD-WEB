import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { useThemeLanguage } from '../context/ThemeLanguageContext';
import { cmsApiService } from '../services/cmsApiService';
import { CmsPage } from '../types';
import { 
  FileText, 
  Calendar, 
  User, 
  ArrowLeft, 
  ArrowRight, 
  Share2, 
  Printer, 
  Bookmark, 
  Home, 
  Sparkles,
  ShieldCheck,
  AlertCircle,
  ExternalLink,
  Lock,
  KeyRound
} from 'lucide-react';
import ReactMarkdown from 'react-markdown';

interface CmsPageViewProps {
  slug: string;
  onNavigate: (tab: string) => void;
}

export const CmsPageView: React.FC<CmsPageViewProps> = ({ slug, onNavigate }) => {
  const { language, dir, t } = useThemeLanguage();
  const [page, setPage] = useState<CmsPage | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [passwordInput, setPasswordInput] = useState('');
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [passwordError, setPasswordError] = useState('');

  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    setError(null);
    setIsUnlocked(false);
    setPasswordInput('');
    setPasswordError('');

    cmsApiService.getPage(slug)
      .then((data) => {
        if (!isMounted) return;
        if (data && (data.status === 'published' || !data.status) && data.visibility !== 'private') {
          setPage(data);
        } else {
          setError('صفحہ دستیاب نہیں ہے یا ابھی شائع نہیں ہوا ہے۔');
        }
      })
      .catch((err) => {
        if (!isMounted) return;
        setError(err?.message || 'صفحہ لوڈ کرنے میں مسئلہ پیش آیا۔');
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [slug]);

  const handleShare = () => {
    if (navigator.share && page) {
      const title = page.title?.[language] || page.title?.ur || page.title?.en || '';
      navigator.share({
        title: `${title} | جامعہ اسلامیہ ایبٹ آباد`,
        url: window.location.href,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  if (loading) {
    return (
      <div className="w-full max-w-5xl mx-auto py-12 px-4 space-y-6 animate-pulse">
        <div className="h-6 w-48 bg-stone-200 dark:bg-slate-800 rounded-lg" />
        <div className="h-10 w-3/4 bg-stone-300 dark:bg-slate-700 rounded-xl" />
        <div className="h-64 w-full bg-stone-200 dark:bg-slate-800 rounded-2xl" />
        <div className="space-y-3">
          <div className="h-4 w-full bg-stone-200 dark:bg-slate-800 rounded" />
          <div className="h-4 w-5/6 bg-stone-200 dark:bg-slate-800 rounded" />
          <div className="h-4 w-4/6 bg-stone-200 dark:bg-slate-800 rounded" />
        </div>
      </div>
    );
  }

  if (error || !page) {
    return (
      <div className="w-full max-w-3xl mx-auto my-12 p-8 bg-white dark:bg-slate-900 border-2 border-stone-200 dark:border-slate-800 rounded-3xl shadow-lg text-center space-y-5">
        <div className="w-16 h-16 mx-auto rounded-full bg-amber-100 dark:bg-amber-950/50 flex items-center justify-center text-[#B88A3B]">
          <AlertCircle className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-bold font-urdu text-stone-900 dark:text-stone-100">
          {language === 'ar' ? 'الصفحة غير موجودة' : language === 'en' ? 'Page Not Found' : 'مطلوبہ صفحہ دستیاب نہیں ہے'}
        </h2>
        <p className="text-sm font-urdu text-stone-600 dark:text-stone-400">
          {error || (language === 'ar' ? 'عذراً، الصفحة المطلوبة غير متاحة حالياً.' : language === 'en' ? 'The requested page is currently unavailable or under review.' : 'معذرت، مطلوبہ صفحہ کا لنک تبدیل ہو چکا ہے یا صفحہ ابھی اشاعت کے مراحل میں ہے۔')}
        </p>
        <div className="pt-4">
          <button
            onClick={() => onNavigate('home')}
            className="inline-flex items-center gap-2 px-6 py-2.5 bg-[#5C4632] hover:bg-[#4A3222] text-amber-300 font-bold rounded-xl shadow-md transition-all font-urdu cursor-pointer"
          >
            <Home className="w-4 h-4" />
            <span>{language === 'ar' ? 'العودة للرئيسية' : language === 'en' ? 'Back to Homepage' : 'صفحہ اول پر واپس جائیں'}</span>
          </button>
        </div>
      </div>
    );
  }

  // Password Protection Gate
  if (page.visibility === 'password_protected' && !isUnlocked && page.password) {
    const handleUnlock = (e: React.FormEvent) => {
      e.preventDefault();
      if (passwordInput === page.password) {
        setIsUnlocked(true);
        setPasswordError('');
      } else {
        setPasswordError(language === 'ar' ? 'كلمة المرور غير صحيحة' : language === 'en' ? 'Incorrect password' : 'غلط پاس ورڈ۔ دوبارہ کوشش کریں۔');
      }
    };

    return (
      <div className="w-full max-w-md mx-auto my-12 p-8 bg-white dark:bg-slate-900 border-2 border-stone-200 dark:border-slate-800 rounded-3xl shadow-lg text-center space-y-5" dir={dir}>
        <div className="w-16 h-16 mx-auto rounded-full bg-amber-100 dark:bg-amber-950/50 flex items-center justify-center text-[#B88A3B]">
          <Lock className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-bold font-urdu text-stone-900 dark:text-stone-100">
          {language === 'ar' ? 'هذه الصفحة محمية بكلمة مرور' : language === 'en' ? 'This Page is Password Protected' : 'یہ صفحہ پاس ورڈ سے محفوظ ہے'}
        </h2>
        <p className="text-xs font-urdu text-stone-600 dark:text-stone-400">
          {language === 'ar' ? 'يرجى إدخال كلمة المرور لعرض محتوى الصفحة.' : language === 'en' ? 'Please enter the access password to view this content.' : 'مطلوبہ مواد دیکھنے کے لیے پاس ورڈ درج کریں۔'}
        </p>

        <form onSubmit={handleUnlock} className="space-y-4 pt-2">
          <div>
            <input
              type="password"
              value={passwordInput}
              onChange={(e) => setPasswordInput(e.target.value)}
              placeholder={language === 'ar' ? 'كلمة المرور...' : language === 'en' ? 'Password...' : 'پاس ورڈ درج کریں...'}
              className="w-full px-4 py-2.5 rounded-xl border border-stone-300 dark:border-slate-700 bg-stone-50 dark:bg-slate-800 text-stone-900 dark:text-white text-center text-sm font-urdu focus:outline-none focus:ring-2 focus:ring-[#B88A3B]"
              autoFocus
            />
            {passwordError && (
              <p className="text-xs text-rose-500 font-urdu mt-1.5">{passwordError}</p>
            )}
          </div>
          <div className="flex items-center justify-center gap-2">
            <button
              type="submit"
              className="px-6 py-2 bg-[#5C4632] hover:bg-[#4A3222] text-amber-300 font-bold text-xs rounded-xl shadow-md transition-all font-urdu cursor-pointer flex items-center gap-2"
            >
              <KeyRound className="w-3.5 h-3.5" />
              <span>{language === 'ar' ? 'فتح المحتوى' : language === 'en' ? 'Unlock Page' : 'صفحہ کھولیں'}</span>
            </button>
            <button
              type="button"
              onClick={() => onNavigate('home')}
              className="px-4 py-2 bg-stone-100 dark:bg-slate-800 hover:bg-stone-200 text-stone-700 dark:text-stone-300 text-xs font-bold rounded-xl transition-all font-urdu cursor-pointer"
            >
              <span>{language === 'ar' ? 'إلغاء' : language === 'en' ? 'Cancel' : 'منسوخ'}</span>
            </button>
          </div>
        </form>
      </div>
    );
  }

  const pageTitle = page.title?.[language] || page.title?.ur || page.title?.en || page.title?.ar || 'صفحہ';
  const pageContent = page.content?.[language] || page.content?.ur || page.content?.en || page.content?.ar || '';
  const pageExcerpt = page.excerpt?.[language] || page.excerpt?.ur || page.excerpt?.en || page.excerpt?.ar || '';
  const dateFormatted = page.updatedAt ? new Date(page.updatedAt).toLocaleDateString(language === 'ur' ? 'ur-PK' : language === 'ar' ? 'ar-SA' : 'en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : '';

  return (
    <article 
      className="w-full max-w-5xl mx-auto space-y-8 pb-12"
      dir={dir}
    >
      {/* Breadcrumb Navigation */}
      <nav className="flex items-center gap-2 text-xs text-stone-500 dark:text-stone-400 font-urdu py-2 border-b border-stone-200 dark:border-slate-800">
        <button 
          onClick={() => onNavigate('home')} 
          className="hover:text-[#B88A3B] transition-colors flex items-center gap-1 cursor-pointer"
        >
          <Home className="w-3.5 h-3.5" />
          <span>{language === 'ar' ? 'الرئيسية' : language === 'en' ? 'Home' : 'صفحہ اول'}</span>
        </button>
        <span>/</span>
        <span className="text-[#B88A3B] font-bold truncate max-w-xs">{pageTitle}</span>
      </nav>

      {/* Page Header */}
      <header className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-xs font-urdu text-stone-500 dark:text-stone-400">
            <span className="inline-flex items-center gap-1 bg-amber-50 dark:bg-amber-950/40 text-[#B88A3B] px-2.5 py-1 rounded-md border border-[#B88A3B]/30 font-bold">
              <Sparkles className="w-3 h-3" />
              <span>{language === 'ar' ? 'صفحة رسمية' : language === 'en' ? 'Official Page' : 'جامعہ معلوماتی صفحہ'}</span>
            </span>
            {dateFormatted && (
              <span className="flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5" />
                <span>{dateFormatted}</span>
              </span>
            )}
            {page.author && (
              <span className="flex items-center gap-1">
                <User className="w-3.5 h-3.5" />
                <span>{page.author}</span>
              </span>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2">
            <button
              onClick={handleShare}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-stone-100 dark:bg-slate-800 hover:bg-amber-50 dark:hover:bg-slate-700 text-stone-700 dark:text-stone-300 rounded-lg text-xs font-bold transition-all border border-stone-200 dark:border-slate-700 cursor-pointer"
              title="شیئر کریں"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>{copied ? (language === 'ur' ? 'کاپی ہو گیا!' : 'Copied!') : (language === 'ur' ? 'شیئر' : 'Share')}</span>
            </button>
            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-stone-100 dark:bg-slate-800 hover:bg-amber-50 dark:hover:bg-slate-700 text-stone-700 dark:text-stone-300 rounded-lg text-xs font-bold transition-all border border-stone-200 dark:border-slate-700 cursor-pointer"
              title="پرنٹ کریں"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>{language === 'ur' ? 'پرنٹ' : 'Print'}</span>
            </button>
          </div>
        </div>

        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black font-urdu text-[#5C4632] dark:text-amber-400 tracking-tight leading-relaxed">
          {pageTitle}
        </h1>

        {pageExcerpt && (
          <p className="text-base sm:text-lg font-urdu text-stone-600 dark:text-stone-300 bg-amber-50/50 dark:bg-slate-850 p-4 rounded-xl border-r-4 border-[#B88A3B] leading-loose">
            {pageExcerpt}
          </p>
        )}
      </header>

      {/* Featured Image if present */}
      {page.featuredImage && (
        <div className="w-full overflow-hidden rounded-2xl border border-stone-200 dark:border-slate-800 shadow-md">
          <img 
            src={page.featuredImage} 
            alt={pageTitle}
            className="w-full max-h-[450px] object-cover"
            referrerPolicy="no-referrer"
          />
        </div>
      )}

      {/* Page Content Body */}
      <div className="bg-white dark:bg-slate-900 p-6 sm:p-10 rounded-2xl border border-stone-200 dark:border-slate-800 shadow-sm space-y-6">
        <div className="prose prose-stone dark:prose-invert max-w-none font-urdu leading-loose text-base sm:text-lg text-stone-800 dark:text-stone-200">
          <ReactMarkdown>
            {pageContent}
          </ReactMarkdown>
        </div>
      </div>

      {/* Institutional Footer Seal */}
      <div className="p-6 bg-gradient-to-r from-amber-50 via-stone-50 to-amber-50 dark:from-slate-900 dark:via-slate-850 dark:to-slate-900 rounded-2xl border border-[#B88A3B]/30 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-start">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-[#5C4632] text-amber-300 flex items-center justify-center shrink-0">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-sm font-bold font-urdu text-[#5C4632] dark:text-amber-300">
              الجامعۃ الاسلامیۃ ایبٹ آباد، خیبر پختونخوا، پاکستان
            </h4>
            <p className="text-xs text-stone-500 dark:text-stone-400 font-urdu">
              معتمد و مصدقہ برائے عامہ وخاصہ | قیام: ۱۹۵۱ء
            </p>
          </div>
        </div>
        <button
          onClick={() => onNavigate('contact')}
          className="px-4 py-2 bg-[#5C4632] hover:bg-[#4A3222] text-amber-300 text-xs font-bold rounded-xl transition-all font-urdu cursor-pointer shrink-0"
        >
          {language === 'ar' ? 'تواصل معنا' : language === 'en' ? 'Contact Jamia' : 'جامعہ سے رابطہ کریں'}
        </button>
      </div>
    </article>
  );
};
