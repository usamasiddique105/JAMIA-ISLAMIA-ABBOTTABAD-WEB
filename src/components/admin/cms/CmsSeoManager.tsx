import React, { useState, useEffect } from 'react';
import { CmsSeoSettings } from '../../../types';
import { cmsApiService } from '../../../services/cmsApiService';
import { 
  Globe, 
  Save, 
  CheckCircle, 
  AlertCircle, 
  Loader2, 
  Search, 
  Share2, 
  FileCode, 
  ShieldCheck,
  Sparkles,
  ExternalLink
} from 'lucide-react';
import { INITIAL_CMS_SEO_SETTINGS } from '../../../data/initialCmsData';

export const CmsSeoManager: React.FC = () => {
  const [seo, setSeo] = useState<CmsSeoSettings>(INITIAL_CMS_SEO_SETTINGS);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [successMsg, setSuccessMsg] = useState<string>('');
  const [errorMsg, setErrorMsg] = useState<string>('');

  // Form Fields
  const [metaTitleUr, setMetaTitleUr] = useState<string>('');
  const [metaTitleEn, setMetaTitleEn] = useState<string>('');
  const [metaTitleAr, setMetaTitleAr] = useState<string>('');

  const [metaDescUr, setMetaDescUr] = useState<string>('');
  const [metaDescEn, setMetaDescEn] = useState<string>('');
  const [metaDescAr, setMetaDescAr] = useState<string>('');

  const [keywords, setKeywords] = useState<string>('');
  const [ogImage, setOgImage] = useState<string>('');
  const [canonicalBase, setCanonicalBase] = useState<string>('https://jamiaislamia.edu.pk');
  const [googleVerification, setGoogleVerification] = useState<string>('');
  const [bingVerification, setBingVerification] = useState<string>('');
  const [robotsTxt, setRobotsTxt] = useState<string>('User-agent: *\nAllow: /\nDisallow: /admin\nSitemap: https://jamiaislamia.edu.pk/sitemap.xml');

  const loadSeo = async () => {
    setIsLoading(true);
    setErrorMsg('');
    try {
      const data = await cmsApiService.getSeo();
      setSeo(data);
      setMetaTitleUr(data.defaultMetaTitle?.ur || '');
      setMetaTitleEn(data.defaultMetaTitle?.en || '');
      setMetaTitleAr(data.defaultMetaTitle?.ar || '');

      setMetaDescUr(data.defaultMetaDescription?.ur || '');
      setMetaDescEn(data.defaultMetaDescription?.en || '');
      setMetaDescAr(data.defaultMetaDescription?.ar || '');

      setKeywords(data.keywords || '');
      setOgImage(data.ogImage || '');
      setCanonicalBase(data.canonicalBaseUrl || 'https://jamiaislamia.edu.pk');
      setGoogleVerification(data.googleSiteVerification || '');
      setBingVerification(data.bingSiteVerification || '');
      setRobotsTxt(data.robotsTxt || 'User-agent: *\nAllow: /\nDisallow: /admin\nSitemap: https://jamiaislamia.edu.pk/sitemap.xml');
    } catch (err: any) {
      setErrorMsg(err?.message || 'SEO ترتیبات لوڈ کرنے میں مسئلہ۔');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadSeo();
  }, []);

  const handleSave = async () => {
    setIsSaving(true);
    setErrorMsg('');
    setSuccessMsg('');

    const payload: Partial<CmsSeoSettings> = {
      defaultMetaTitle: { ur: metaTitleUr.trim(), ar: metaTitleAr.trim(), en: metaTitleEn.trim() },
      defaultMetaDescription: { ur: metaDescUr.trim(), ar: metaDescAr.trim(), en: metaDescEn.trim() },
      keywords: keywords.trim(),
      ogImage: ogImage.trim() || undefined,
      canonicalBaseUrl: canonicalBase.trim(),
      googleSiteVerification: googleVerification.trim() || undefined,
      bingSiteVerification: bingVerification.trim() || undefined,
      robotsTxt: robotsTxt.trim(),
      sitemapEnabled: true,
      updatedAt: new Date().toISOString()
    };

    try {
      const res = await cmsApiService.saveSeo(payload);
      if (res && res.success) {
        setSuccessMsg('عالمی SEO ترتیبات کامیابی سے محفوظ ہو گئیں!');
        setTimeout(() => setSuccessMsg(''), 4000);
      } else {
        setErrorMsg(res?.error || 'محفوظ کرنے میں مسئلہ پیش آیا۔');
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
              <Globe className="w-5 h-5" />
            </div>
            <h2 className="text-xl font-black text-stone-900 dark:text-white">
              سرچ انجن آپٹیمائزیشن (Global SEO & Meta Tags)
            </h2>
          </div>
          <p className="text-xs text-stone-500 dark:text-stone-400">
            گوگل، بنگ اور سرچ انجنز کے لیے عنوانات، میٹا ڈسکرپشن، اوپن گراف تصاویر اور تصدیقی ٹیگز۔
          </p>
        </div>

        <button
          onClick={handleSave}
          disabled={isSaving}
          className="px-6 py-2.5 bg-[#5C4632] hover:bg-[#433123] text-amber-300 font-bold text-xs rounded-xl shadow-md border border-[#B88A3B] flex items-center gap-2 cursor-pointer transition-all disabled:opacity-60"
        >
          {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          <span>SEO ترتیبات محفوظ کریں (Save SEO)</span>
        </button>
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

      {/* Main Form Body */}
      {isLoading ? (
        <div className="py-20 flex flex-col items-center justify-center gap-3 text-stone-400">
          <Loader2 className="w-8 h-8 animate-spin text-[#B88A3B]" />
          <span className="text-xs">لوڈ ہو رہا ہے...</span>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 text-xs">
          
          {/* Left Column: Titles & Descriptions */}
          <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-stone-200 dark:border-slate-800 shadow-sm space-y-4">
            <h3 className="font-bold text-sm text-stone-900 dark:text-white flex items-center gap-2 border-b border-stone-100 dark:border-slate-800 pb-3">
              <Search className="w-4 h-4 text-[#B88A3B]" />
              <span>ڈیفالٹ میٹا ٹائٹلز و ڈسکرپشن</span>
            </h3>

            <div>
              <label className="block font-bold text-stone-700 dark:text-stone-300 mb-1">
                ڈیفالٹ سرچ عنوان (اردو)
              </label>
              <input
                type="text"
                value={metaTitleUr}
                onChange={(e) => setMetaTitleUr(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-stone-300 dark:border-slate-700 bg-stone-50 dark:bg-slate-800 text-stone-900 dark:text-white font-bold"
              />
            </div>

            <div>
              <label className="block font-bold text-stone-700 dark:text-stone-300 mb-1">
                Default Meta Title (English)
              </label>
              <input
                type="text"
                value={metaTitleEn}
                onChange={(e) => setMetaTitleEn(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-stone-300 dark:border-slate-700 bg-stone-50 dark:bg-slate-800 text-stone-900 dark:text-white font-sans"
                dir="ltr"
              />
            </div>

            <div>
              <label className="block font-bold text-stone-700 dark:text-stone-300 mb-1">
                العنوان الافتراضي (عربی)
              </label>
              <input
                type="text"
                value={metaTitleAr}
                onChange={(e) => setMetaTitleAr(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-stone-300 dark:border-slate-700 bg-stone-50 dark:bg-slate-800 text-stone-900 dark:text-white font-bold"
              />
            </div>

            <div>
              <label className="block font-bold text-stone-700 dark:text-stone-300 mb-1">
                ڈیفالٹ میٹا ڈسکرپشن (اردو)
              </label>
              <textarea
                rows={3}
                value={metaDescUr}
                onChange={(e) => setMetaDescUr(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-stone-300 dark:border-slate-700 bg-stone-50 dark:bg-slate-800 text-stone-900 dark:text-white"
              />
            </div>

            <div>
              <label className="block font-bold text-stone-700 dark:text-stone-300 mb-1">
                Default Meta Description (English)
              </label>
              <textarea
                rows={3}
                value={metaDescEn}
                onChange={(e) => setMetaDescEn(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-stone-300 dark:border-slate-700 bg-stone-50 dark:bg-slate-800 text-stone-900 dark:text-white font-sans"
                dir="ltr"
              />
            </div>

            <div>
              <label className="block font-bold text-stone-700 dark:text-stone-300 mb-1">
                کلیدی الفاظ (Global Keywords - کوما سے الگ کریں)
              </label>
              <input
                type="text"
                value={keywords}
                onChange={(e) => setKeywords(e.target.value)}
                placeholder="جامعہ اسلامیہ ایبٹ آباد, دارالافتاء, فتاویٰ, وفاق المدارس..."
                className="w-full px-3 py-2 rounded-xl border border-stone-300 dark:border-slate-700 bg-stone-50 dark:bg-slate-800 text-stone-900 dark:text-white"
              />
            </div>
          </div>

          {/* Right Column: Webmaster Verification & Social OG */}
          <div className="space-y-6">
            
            {/* Open Graph & Canonical */}
            <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-stone-200 dark:border-slate-800 shadow-sm space-y-4">
              <h3 className="font-bold text-sm text-stone-900 dark:text-white flex items-center gap-2 border-b border-stone-100 dark:border-slate-800 pb-3">
                <Share2 className="w-4 h-4 text-[#B88A3B]" />
                <span>سوشل میڈیا پریویو (Open Graph Image & URL)</span>
              </h3>

              <div>
                <label className="block font-bold text-stone-700 dark:text-stone-300 mb-1">
                  Canonical Base URL
                </label>
                <input
                  type="text"
                  value={canonicalBase}
                  onChange={(e) => setCanonicalBase(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-stone-300 dark:border-slate-700 bg-stone-50 dark:bg-slate-800 text-stone-900 dark:text-white font-mono"
                  dir="ltr"
                />
              </div>

              <div>
                <label className="block font-bold text-stone-700 dark:text-stone-300 mb-1">
                  ڈیفالٹ اوپن گراف تصویر (OG Image URL)
                </label>
                <input
                  type="text"
                  value={ogImage}
                  onChange={(e) => setOgImage(e.target.value)}
                  placeholder="https://..."
                  className="w-full px-3 py-2 rounded-xl border border-stone-300 dark:border-slate-700 bg-stone-50 dark:bg-slate-800 text-stone-900 dark:text-white font-mono"
                  dir="ltr"
                />
              </div>
            </div>

            {/* Webmaster Verifications */}
            <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-stone-200 dark:border-slate-800 shadow-sm space-y-4">
              <h3 className="font-bold text-sm text-stone-900 dark:text-white flex items-center gap-2 border-b border-stone-100 dark:border-slate-800 pb-3">
                <ShieldCheck className="w-4 h-4 text-[#B88A3B]" />
                <span>ویب ماسٹر و تصدیقی ٹیگز (Search Console Verification)</span>
              </h3>

              <div>
                <label className="block font-bold text-stone-700 dark:text-stone-300 mb-1">
                  Google Search Console Verification Tag
                </label>
                <input
                  type="text"
                  value={googleVerification}
                  onChange={(e) => setGoogleVerification(e.target.value)}
                  placeholder="google-site-verification=..."
                  className="w-full px-3 py-2 rounded-xl border border-stone-300 dark:border-slate-700 bg-stone-50 dark:bg-slate-800 text-stone-900 dark:text-white font-mono"
                  dir="ltr"
                />
              </div>

              <div>
                <label className="block font-bold text-stone-700 dark:text-stone-300 mb-1">
                  Bing Webmaster Verification Tag
                </label>
                <input
                  type="text"
                  value={bingVerification}
                  onChange={(e) => setBingVerification(e.target.value)}
                  placeholder="msvalidate.01=..."
                  className="w-full px-3 py-2 rounded-xl border border-stone-300 dark:border-slate-700 bg-stone-50 dark:bg-slate-800 text-stone-900 dark:text-white font-mono"
                  dir="ltr"
                />
              </div>
            </div>

            {/* Robots.txt */}
            <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-stone-200 dark:border-slate-800 shadow-sm space-y-4">
              <h3 className="font-bold text-sm text-stone-900 dark:text-white flex items-center gap-2 border-b border-stone-100 dark:border-slate-800 pb-3">
                <FileCode className="w-4 h-4 text-[#B88A3B]" />
                <span>Robots.txt فائل کنفیگریشن</span>
              </h3>

              <textarea
                rows={4}
                value={robotsTxt}
                onChange={(e) => setRobotsTxt(e.target.value)}
                className="w-full p-3 rounded-xl border border-stone-300 dark:border-slate-700 bg-stone-950 text-amber-300 font-mono text-[11px] leading-relaxed"
                dir="ltr"
              />
            </div>

          </div>

        </div>
      )}

    </div>
  );
};
