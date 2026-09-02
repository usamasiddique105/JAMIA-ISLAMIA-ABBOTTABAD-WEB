import React, { useState, useEffect } from 'react';
import { CmsThemeSettings } from '../../../types';
import { cmsApiService } from '../../../services/cmsApiService';
import { 
  Palette, 
  Save, 
  RotateCcw, 
  CheckCircle, 
  AlertCircle, 
  Loader2, 
  Code, 
  Eye, 
  Sparkles, 
  Type, 
  ShieldCheck 
} from 'lucide-react';
import { INITIAL_CMS_THEME_SETTINGS } from '../../../data/initialCmsData';

export const CmsAppearanceManager: React.FC = () => {
  const [theme, setTheme] = useState<CmsThemeSettings>(INITIAL_CMS_THEME_SETTINGS);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [successMsg, setSuccessMsg] = useState<string>('');
  const [errorMsg, setErrorMsg] = useState<string>('');

  // Local Editable States
  const [primaryColor, setPrimaryColor] = useState<string>('#5C4632');
  const [secondaryColor, setSecondaryColor] = useState<string>('#B88A3B');
  const [accentColor, setAccentColor] = useState<string>('#D97706');
  const [bgColor, setBgColor] = useState<string>('#F8F4EC');
  const [borderRadius, setBorderRadius] = useState<'none' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | 'full'>('xl');
  const [customCss, setCustomCss] = useState<string>('');
  const [headerScripts, setHeaderScripts] = useState<string>('');

  const loadTheme = async () => {
    setIsLoading(true);
    setErrorMsg('');
    try {
      const data = await cmsApiService.getTheme();
      setTheme(data);
      if (data) {
        setPrimaryColor(data.primaryColor || '#5C4632');
        setSecondaryColor(data.secondaryColor || '#B88A3B');
        setAccentColor(data.accentColor || '#D97706');
        setBgColor(data.backgroundColor || '#F8F4EC');
      }
      setBorderRadius(data.borderRadius || 'xl');
      setCustomCss(data.customCss || '');
    } catch (err: any) {
      setErrorMsg(err?.message || 'تھیم ترتیبات لوڈ کرنے میں مسئلہ پیش آیا۔');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadTheme();
  }, []);

  const handleResetDefaults = () => {
    if (confirm('کیا آپ واقعی تمام رنگ اور ظاہری ترتیبات ڈیفالٹ ادارہ جاتی ویلیوز پر ری سیٹ کرنا چاہتے ہیں؟')) {
      setPrimaryColor(INITIAL_CMS_THEME_SETTINGS.primaryColor);
      setSecondaryColor(INITIAL_CMS_THEME_SETTINGS.secondaryColor);
      setAccentColor(INITIAL_CMS_THEME_SETTINGS.accentColor);
      setBgColor(INITIAL_CMS_THEME_SETTINGS.backgroundColor);
      setBorderRadius(INITIAL_CMS_THEME_SETTINGS.borderRadius || 'xl');
      setCustomCss('');
      setHeaderScripts('');
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    setErrorMsg('');
    setSuccessMsg('');

    const payload: Partial<CmsThemeSettings> = {
      ...theme,
      primaryColor,
      secondaryColor,
      accentColor,
      backgroundColor: bgColor,
      borderRadius,
      customCss,
      updatedAt: new Date().toISOString()
    };

    try {
      const res = await cmsApiService.saveTheme(payload);
      if (res && res.success) {
        setSuccessMsg('ظاہری شکل و صورت اور تھیم ترتیبات کامیابی سے محفوظ ہو گئیں!');
        setTimeout(() => setSuccessMsg(''), 4000);
      } else {
        setErrorMsg(res?.error || 'محفوظ کرنے میں خرابی پیش آئی۔');
      }
    } catch (err: any) {
      setErrorMsg(err?.message || 'خرابی پیش آئی۔');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6 font-urdu" dir="rtl">
      {/* Top Header Card */}
      <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-stone-200 dark:border-slate-800 shadow-sm flex flex-wrap items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300">
              <Palette className="w-5 h-5" />
            </div>
            <h2 className="text-xl font-black text-stone-900 dark:text-white">
              ظاہری شکل و صورت اور تھیم ترتیبات (Theme & Appearance)
            </h2>
          </div>
          <p className="text-xs text-stone-500 dark:text-stone-400">
            ادارہ جاتی کلر پیلیٹ، ریڈیس، کسٹم CSS اور اسکرپٹس کا مستند نظم و نسق۔
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleResetDefaults}
            className="px-4 py-2.5 bg-stone-100 dark:bg-slate-800 hover:bg-stone-200 text-stone-700 dark:text-stone-300 font-bold text-xs rounded-xl border border-stone-300 dark:border-slate-700 flex items-center gap-1.5 cursor-pointer transition-all"
          >
            <RotateCcw className="w-4 h-4" />
            <span>ڈیفالٹ پر ری سیٹ</span>
          </button>

          <button
            onClick={handleSave}
            disabled={isSaving}
            className="px-6 py-2.5 bg-[#5C4632] hover:bg-[#433123] text-amber-300 font-bold text-xs rounded-xl shadow-md border border-[#B88A3B] flex items-center gap-2 cursor-pointer transition-all disabled:opacity-60"
          >
            {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            <span>تھیم محفوظ کریں (Save Theme)</span>
          </button>
        </div>
      </div>

      {/* Notifications */}
      {successMsg && (
        <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-300 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 text-xs font-bold flex items-center gap-2 shadow-xs">
          <CheckCircle className="w-4 h-4 text-emerald-600 flex-shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {errorMsg && (
        <div className="p-4 rounded-xl bg-red-50 dark:bg-red-950/60 border border-red-300 dark:border-red-800 text-red-800 dark:text-red-300 text-xs font-bold flex items-center gap-2 shadow-xs">
          <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Color Palette Grid */}
      <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-stone-200 dark:border-slate-800 shadow-sm space-y-4">
        <h3 className="font-bold text-sm text-stone-900 dark:text-white flex items-center gap-2 border-b border-stone-100 dark:border-slate-800 pb-3">
          <Palette className="w-4 h-4 text-[#B88A3B]" />
          <span>ادارہ جاتی رنگوں کا پیلیٹ (Institutional Color Tokens)</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
          {/* Primary Color */}
          <div className="p-4 rounded-2xl bg-stone-50 dark:bg-slate-800/70 border border-stone-200 dark:border-slate-700 space-y-2">
            <label className="block font-bold text-stone-700 dark:text-stone-300">
              بنیادی لکڑی و برونز (Primary Bronze)
            </label>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={primaryColor}
                onChange={(e) => setPrimaryColor(e.target.value)}
                className="w-10 h-10 rounded-xl cursor-pointer border border-stone-300 shadow-xs"
              />
              <input
                type="text"
                value={primaryColor}
                onChange={(e) => setPrimaryColor(e.target.value)}
                className="flex-1 px-3 py-2 rounded-xl border border-stone-300 dark:border-slate-700 bg-white dark:bg-slate-900 font-mono text-xs font-bold text-stone-900 dark:text-white"
                dir="ltr"
              />
            </div>
            <div className="h-6 rounded-lg shadow-xs" style={{ backgroundColor: primaryColor }} />
          </div>

          {/* Secondary Gold */}
          <div className="p-4 rounded-2xl bg-stone-50 dark:bg-slate-800/70 border border-stone-200 dark:border-slate-700 space-y-2">
            <label className="block font-bold text-stone-700 dark:text-stone-300">
              اسلامی گولڈن ایکسینٹ (Islamic Gold)
            </label>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={secondaryColor}
                onChange={(e) => setSecondaryColor(e.target.value)}
                className="w-10 h-10 rounded-xl cursor-pointer border border-stone-300 shadow-xs"
              />
              <input
                type="text"
                value={secondaryColor}
                onChange={(e) => setSecondaryColor(e.target.value)}
                className="flex-1 px-3 py-2 rounded-xl border border-stone-300 dark:border-slate-700 bg-white dark:bg-slate-900 font-mono text-xs font-bold text-stone-900 dark:text-white"
                dir="ltr"
              />
            </div>
            <div className="h-6 rounded-lg shadow-xs" style={{ backgroundColor: secondaryColor }} />
          </div>

          {/* Accent Color */}
          <div className="p-4 rounded-2xl bg-stone-50 dark:bg-slate-800/70 border border-stone-200 dark:border-slate-700 space-y-2">
            <label className="block font-bold text-stone-700 dark:text-stone-300">
              توجہ کا رنگ (Accent Highlight)
            </label>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={accentColor}
                onChange={(e) => setAccentColor(e.target.value)}
                className="w-10 h-10 rounded-xl cursor-pointer border border-stone-300 shadow-xs"
              />
              <input
                type="text"
                value={accentColor}
                onChange={(e) => setAccentColor(e.target.value)}
                className="flex-1 px-3 py-2 rounded-xl border border-stone-300 dark:border-slate-700 bg-white dark:bg-slate-900 font-mono text-xs font-bold text-stone-900 dark:text-white"
                dir="ltr"
              />
            </div>
            <div className="h-6 rounded-lg shadow-xs" style={{ backgroundColor: accentColor }} />
          </div>

          {/* Warm Background */}
          <div className="p-4 rounded-2xl bg-stone-50 dark:bg-slate-800/70 border border-stone-200 dark:border-slate-700 space-y-2">
            <label className="block font-bold text-stone-700 dark:text-stone-300">
              پس منظر کریم (Warm Cream)
            </label>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={bgColor}
                onChange={(e) => setBgColor(e.target.value)}
                className="w-10 h-10 rounded-xl cursor-pointer border border-stone-300 shadow-xs"
              />
              <input
                type="text"
                value={bgColor}
                onChange={(e) => setBgColor(e.target.value)}
                className="flex-1 px-3 py-2 rounded-xl border border-stone-300 dark:border-slate-700 bg-white dark:bg-slate-900 font-mono text-xs font-bold text-stone-900 dark:text-white"
                dir="ltr"
              />
            </div>
            <div className="h-6 rounded-lg shadow-xs border border-stone-200" style={{ backgroundColor: bgColor }} />
          </div>
        </div>
      </div>

      {/* Typography Preview */}
      <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-stone-200 dark:border-slate-800 shadow-sm space-y-4">
        <h3 className="font-bold text-sm text-stone-900 dark:text-white flex items-center gap-2 border-b border-stone-100 dark:border-slate-800 pb-3">
          <Type className="w-4 h-4 text-[#B88A3B]" />
          <span>ادارہ جاتی فونٹ و ٹائپوگرافی کا جائزہ (Typography Stack)</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          <div className="p-4 rounded-2xl bg-stone-50 dark:bg-slate-800/80 border border-stone-200 dark:border-slate-700 space-y-2">
            <span className="font-bold text-stone-500 block">اردو خطاطی (Jameel Noori Nastaleeq):</span>
            <p className="text-sm font-urdu leading-loose text-stone-900 dark:text-white">
              جامعہ اسلامیہ ایبٹ آباد — دینی و عصری علوم کا ایک عظیم مرکز
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-stone-50 dark:bg-slate-800/80 border border-stone-200 dark:border-slate-700 space-y-2">
            <span className="font-bold text-stone-500 block">العربية (Amiri / Naskh):</span>
            <p className="text-sm font-arabic leading-relaxed text-stone-900 dark:text-white">
              الجامعة الإسلامية أبيت آباد — صرح علمي عريق لخدمة الشريعة الغراء
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-stone-50 dark:bg-slate-800/80 border border-stone-200 dark:border-slate-700 space-y-2">
            <span className="font-bold text-stone-500 block">English (Playfair & Inter):</span>
            <p className="text-sm font-serif text-stone-900 dark:text-white" dir="ltr">
              Jamia Islamia Abbottabad — Traditional Islamic University
            </p>
          </div>
        </div>
      </div>

      {/* Custom CSS Code Editor */}
      <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-stone-200 dark:border-slate-800 shadow-sm space-y-4">
        <h3 className="font-bold text-sm text-stone-900 dark:text-white flex items-center gap-2 border-b border-stone-100 dark:border-slate-800 pb-3">
          <Code className="w-4 h-4 text-[#B88A3B]" />
          <span>کسٹم سی ایس ایس (Custom CSS Code Editor)</span>
        </h3>

        <div className="space-y-2 text-xs">
          <p className="text-stone-500 dark:text-stone-400">
            ایڈوانس اسٹائلنگ اور کلاسز کو اوور رائیڈ کرنے کے لیے اپنا درست CSS کوڈ درج فرمائیں۔
          </p>
          <textarea
            rows={6}
            value={customCss}
            onChange={(e) => setCustomCss(e.target.value)}
            placeholder="/* Add custom CSS rules here */
.custom-hero-banner {
  box-shadow: 0 10px 30px rgba(92, 70, 50, 0.15);
}"
            className="w-full p-4 rounded-2xl border border-stone-300 dark:border-slate-700 bg-stone-950 text-emerald-400 font-mono text-xs leading-relaxed focus:outline-hidden"
            dir="ltr"
          />
        </div>
      </div>

    </div>
  );
};
