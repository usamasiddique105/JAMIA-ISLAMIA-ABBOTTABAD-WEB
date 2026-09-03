import React, { useState, useEffect } from 'react';
import { CmsThemeSettings } from '../../../types';
import { cmsApiService } from '../../../services/cmsApiService';
import { 
  Sliders, 
  Save, 
  CheckCircle, 
  AlertCircle, 
  Loader2, 
  Image as ImageIcon, 
  Phone, 
  Mail, 
  MapPin, 
  Globe, 
  Share2, 
  ShieldCheck, 
  Info,
  Layers,
  Sparkles
} from 'lucide-react';
import { JAMIA_HEADER_LOGO_DATA_URI } from '../../../assets/logoBase64';

export const CmsHeaderFooterManager: React.FC = () => {
  const [theme, setTheme] = useState<CmsThemeSettings | null>(null);
  const [activeTab, setActiveTab] = useState<'header' | 'footer' | 'topbar'>('header');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [successMsg, setSuccessMsg] = useState<string>('');
  const [errorMsg, setErrorMsg] = useState<string>('');

  // Top Bar fields
  const [topBarPhone, setTopBarPhone] = useState<string>('+92 992 381234');
  const [topBarIftaPhone, setTopBarIftaPhone] = useState<string>('+92 300 1234567');
  const [topBarEmail, setTopBarEmail] = useState<string>('info@jamiaislamia.edu.pk');
  const [topBarTimingsUr, setTopBarTimingsUr] = useState<string>('اوقاتِ کار: صبح ۸:۰۰ تا دوپہر ۲:۰۰');
  const [topBarTimingsEn, setTopBarTimingsEn] = useState<string>('Office: 08:00 AM – 02:00 PM');
  const [showTopBar, setShowTopBar] = useState<boolean>(true);

  // Header fields
  const [siteTitleUr, setSiteTitleUr] = useState<string>('جامعہ اسلامیہ ایبٹ آباد');
  const [siteTitleEn, setSiteTitleEn] = useState<string>('Jamia Islamia Abbottabad');
  const [siteTitleAr, setSiteTitleAr] = useState<string>('الجامعة الإسلامية أبيت آباد');
  const [taglineUr, setTaglineUr] = useState<string>('الحاق: وفاق المدارس العربیہ پاکستان | بنیاد: ۱۹۵۱ء');
  const [taglineEn, setTaglineEn] = useState<string>('Affiliated with Wifaqul Madaris Pakistan | Est. 1951');
  const [logoUrl, setLogoUrl] = useState<string>(JAMIA_HEADER_LOGO_DATA_URI);
  const [headerStyle, setHeaderStyle] = useState<'standard' | 'compact' | 'centered'>('standard');
  const [showSearch, setShowSearch] = useState<boolean>(true);

  // Social Links
  const [facebookUrl, setFacebookUrl] = useState<string>('https://facebook.com/jamiaislamiaabbottabad');
  const [youtubeUrl, setYoutubeUrl] = useState<string>('https://youtube.com/@jamiaislamiaabbottabad');
  const [whatsappUrl, setWhatsappUrl] = useState<string>('https://wa.me/923001234567');
  const [twitterUrl, setTwitterUrl] = useState<string>('https://twitter.com/jamiaabbottabad');

  // Footer fields
  const [footerAboutUr, setFooterAboutUr] = useState<string>('جامعہ اسلامیہ ایبٹ آباد خیبر پختونخوا کا قدیم و مستند دینی و تعلیمی ادارہ ہے جو وفاق المدارس العربیہ پاکستان سے الحاق شدہ ہے۔');
  const [footerAboutEn, setFooterAboutEn] = useState<string>('Jamia Islamia Abbottabad is a premier Islamic university in Khyber Pakhtunkhwa, affiliated with Wifaqul Madaris.');
  const [addressUr, setAddressUr] = useState<string>('مری روڈ، نزد سپلائی، ایبٹ آباد، خیبر پختونخوا، پاکستان');
  const [addressEn, setAddressEn] = useState<string>('Murree Road, Near Supply, Abbottabad, KP, Pakistan');
  const [copyrightUr, setCopyrightUr] = useState<string>('© ۲۰۲۶ جامعہ اسلامیہ ایبٹ آباد۔ جملہ حقوق محفوظ ہیں۔');
  const [copyrightEn, setCopyrightEn] = useState<string>('© 2026 Jamia Islamia Abbottabad. All Rights Reserved.');
  const [footerLayout, setFooterLayout] = useState<'4col' | '3col' | 'minimal' | 'four_columns' | 'three_columns'>('4col');

  // Load Settings
  const loadThemeSettings = async () => {
    setIsLoading(true);
    setErrorMsg('');
    try {
      const data = await cmsApiService.getTheme();
      setTheme(data);
      if (data.header) {
        setSiteTitleUr(data.header.siteTitle?.ur || 'جامعہ اسلامیہ ایبٹ آباد');
        setSiteTitleEn(data.header.siteTitle?.en || 'Jamia Islamia Abbottabad');
        setSiteTitleAr(data.header.siteTitle?.ar || 'الجامعة الإسلامية أبيت آباد');
        setTaglineUr(data.header.tagline?.ur || '');
        setTaglineEn(data.header.tagline?.en || '');
        setLogoUrl(data.header.logoUrl || JAMIA_HEADER_LOGO_DATA_URI);
        setHeaderStyle(data.header.style || 'standard');
        setShowSearch(data.header.showSearch !== false);
        setShowTopBar(data.header.showTopBar !== false);
      }
      if (data.footer) {
        setFooterAboutUr(data.footer.aboutText?.ur || '');
        setFooterAboutEn(data.footer.aboutText?.en || '');
        setAddressUr(data.footer.address?.ur || '');
        setAddressEn(data.footer.address?.en || '');
        setCopyrightUr(data.footer.copyright?.ur || '');
        setCopyrightEn(data.footer.copyright?.en || '');
        setFooterLayout(data.footer.layoutStyle || '4col');
      }
      if (data.socialLinks) {
        setFacebookUrl(data.socialLinks.facebook || '');
        setYoutubeUrl(data.socialLinks.youtube || '');
        setWhatsappUrl(data.socialLinks.whatsapp || '');
        setTwitterUrl(data.socialLinks.twitter || '');
      }
    } catch (err: any) {
      setErrorMsg(err?.message || 'ترتیبات لوڈ کرنے میں خرابی۔');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadThemeSettings();
  }, []);

  const handleSave = async () => {
    setIsSaving(true);
    setErrorMsg('');
    setSuccessMsg('');

    const updatedTheme: Partial<CmsThemeSettings> = {
      ...(theme || {}),
      header: {
        logoUrl: logoUrl.trim() || JAMIA_HEADER_LOGO_DATA_URI,
        siteTitle: { ur: siteTitleUr.trim(), ar: siteTitleAr.trim(), en: siteTitleEn.trim() },
        tagline: { ur: taglineUr.trim(), ar: taglineUr.trim(), en: taglineEn.trim() },
        showTopBar,
        showSearch,
        style: headerStyle
      },
      footer: {
        aboutText: { ur: footerAboutUr.trim(), ar: footerAboutUr.trim(), en: footerAboutEn.trim() },
        address: { ur: addressUr.trim(), ar: addressUr.trim(), en: addressEn.trim() },
        copyright: { ur: copyrightUr.trim(), ar: copyrightUr.trim(), en: copyrightEn.trim() },
        layoutStyle: footerLayout
      },
      socialLinks: {
        facebook: facebookUrl.trim(),
        youtube: youtubeUrl.trim(),
        whatsapp: whatsappUrl.trim(),
        twitter: twitterUrl.trim()
      },
      updatedAt: new Date().toISOString()
    };

    try {
      const res = await cmsApiService.saveTheme(updatedTheme);
      if (res && res.success) {
        setSuccessMsg('ہیڈر، فوٹر اور سوشل روابط کی ترتیبات کامیابی سے محفوظ ہو گئیں!');
        // Log revision for header/footer settings
        cmsApiService.createRevision({
          entityType: 'theme',
          entityId: 'header_footer',
          action: 'update',
          dataJson: JSON.stringify(updatedTheme),
          author: 'Admin',
          revisionNote: 'ہیڈر، فوٹر اور سوشل لنکس کی ترتیبات محفوظ کی گئیں'
        }).catch(() => {});
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
              <Sliders className="w-5 h-5" />
            </div>
            <h2 className="text-xl font-black text-stone-900 dark:text-white">
              ہیڈر، فوٹر اور ادارہ جاتی معلومات (Header & Footer Setup)
            </h2>
          </div>
          <p className="text-xs text-stone-500 dark:text-stone-400">
            لوگو، ادارہ جاتی عنوان، ٹیگ لائن، رابطہ فون نمبرز، پتے اور کاپی رائٹ کی مستقل ترتیبات۔
          </p>
        </div>

        <button
          onClick={handleSave}
          disabled={isSaving}
          className="px-6 py-2.5 bg-[#5C4632] hover:bg-[#433123] text-amber-300 font-bold text-xs rounded-xl shadow-md border border-[#B88A3B] flex items-center gap-2 cursor-pointer transition-all disabled:opacity-60"
        >
          {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          <span>تبدیلیاں محفوظ کریں (Save All)</span>
        </button>
      </div>

      {/* Notice */}
      <div className="p-3.5 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-800/60 text-amber-900 dark:text-amber-300 text-xs flex items-center gap-2.5">
        <ShieldCheck className="w-4 h-4 text-[#B88A3B] flex-shrink-0" />
        <span>
          <strong>لوگو و برانڈنگ تحفظ:</strong> جامعہ کا تصدیق شدہ آفیشل مہر والا لوگو بائی ڈیفالٹ سیٹ ہے۔ آپ ضرورت پڑنے پر متبادل امیج URL بھی متعین کر سکتے ہیں۔
        </span>
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

      {/* Tabs Switcher */}
      <div className="flex rounded-2xl bg-stone-100 dark:bg-slate-800 p-1.5 border border-stone-200 dark:border-slate-700">
        <button
          type="button"
          onClick={() => setActiveTab('header')}
          className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'header'
              ? 'bg-[#5C4632] text-amber-300 shadow-sm border border-[#B88A3B]'
              : 'text-stone-600 dark:text-stone-300 hover:text-stone-900'
          }`}
        >
          مرکزی ہیڈر و برانڈنگ (Header & Logo)
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('topbar')}
          className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'topbar'
              ? 'bg-[#5C4632] text-amber-300 shadow-sm border border-[#B88A3B]'
              : 'text-stone-600 dark:text-stone-300 hover:text-stone-900'
          }`}
        >
          ٹاپ بار و سوشل لنکس (Top Bar & Social)
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('footer')}
          className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'footer'
              ? 'bg-[#5C4632] text-amber-300 shadow-sm border border-[#B88A3B]'
              : 'text-stone-600 dark:text-stone-300 hover:text-stone-900'
          }`}
        >
          فوٹر و کاپی رائٹ (Footer & Contacts)
        </button>
      </div>

      {isLoading ? (
        <div className="py-20 flex flex-col items-center justify-center gap-3 text-stone-400">
          <Loader2 className="w-8 h-8 animate-spin text-[#B88A3B]" />
          <span className="text-xs">لوڈ ہو رہا ہے...</span>
        </div>
      ) : activeTab === 'header' ? (
        /* HEADER TAB */
        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-stone-200 dark:border-slate-800 shadow-sm space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Logo Preview & Input */}
            <div className="md:col-span-1 p-5 rounded-2xl bg-stone-50 dark:bg-slate-800/80 border border-stone-200 dark:border-slate-700 text-center space-y-3">
              <label className="block font-bold text-xs text-stone-700 dark:text-stone-300">
                جامعہ کا آفیشل لوگو (Header Logo)
              </label>
              
              <div className="w-24 h-24 mx-auto rounded-full bg-[#5C4632] p-2 border-2 border-[#B88A3B] shadow-md flex items-center justify-center overflow-hidden">
                <img
                  src={logoUrl || JAMIA_HEADER_LOGO_DATA_URI}
                  alt="Jamia Logo"
                  className="w-full h-full object-contain"
                />
              </div>

              <input
                type="text"
                value={logoUrl}
                onChange={(e) => setLogoUrl(e.target.value)}
                placeholder="Data URI یا Image URL"
                className="w-full px-3 py-1.5 rounded-xl border border-stone-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-[10px] font-mono text-stone-900 dark:text-white"
                dir="ltr"
              />

              <button
                type="button"
                onClick={() => setLogoUrl(JAMIA_HEADER_LOGO_DATA_URI)}
                className="text-[11px] text-[#B88A3B] hover:underline font-bold cursor-pointer block mx-auto"
              >
                آفیشل ڈیفالٹ مہر پر ری سیٹ کریں ↺
              </button>
            </div>

            {/* Titles & Taglines in 3 Languages */}
            <div className="md:col-span-2 space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-stone-700 dark:text-stone-300 mb-1">
                    ادارہ جاتی عنوان (اردو) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={siteTitleUr}
                    onChange={(e) => setSiteTitleUr(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-stone-300 dark:border-slate-700 bg-stone-50 dark:bg-slate-800 text-stone-900 dark:text-white font-bold"
                  />
                </div>
                <div>
                  <label className="block font-bold text-stone-700 dark:text-stone-300 mb-1">
                    Institution Title (English)
                  </label>
                  <input
                    type="text"
                    value={siteTitleEn}
                    onChange={(e) => setSiteTitleEn(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-stone-300 dark:border-slate-700 bg-stone-50 dark:bg-slate-800 text-stone-900 dark:text-white font-sans"
                    dir="ltr"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-stone-700 dark:text-stone-300 mb-1">
                  اسم المؤسسة (عربی)
                </label>
                <input
                  type="text"
                  value={siteTitleAr}
                  onChange={(e) => setSiteTitleAr(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-stone-300 dark:border-slate-700 bg-stone-50 dark:bg-slate-800 text-stone-900 dark:text-white font-bold"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-stone-700 dark:text-stone-300 mb-1">
                    ٹیگ لائن / الحاق (اردو)
                  </label>
                  <input
                    type="text"
                    value={taglineUr}
                    onChange={(e) => setTaglineUr(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-stone-300 dark:border-slate-700 bg-stone-50 dark:bg-slate-800 text-stone-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block font-bold text-stone-700 dark:text-stone-300 mb-1">
                    Tagline (English)
                  </label>
                  <input
                    type="text"
                    value={taglineEn}
                    onChange={(e) => setTaglineEn(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-stone-300 dark:border-slate-700 bg-stone-50 dark:bg-slate-800 text-stone-900 dark:text-white font-sans"
                    dir="ltr"
                  />
                </div>
              </div>

              <div className="pt-2 border-t border-stone-200 dark:border-slate-800 flex items-center justify-between">
                <label className="flex items-center gap-2 cursor-pointer font-bold text-stone-700 dark:text-stone-300">
                  <input
                    type="checkbox"
                    checked={showSearch}
                    onChange={(e) => setShowSearch(e.target.checked)}
                    className="rounded text-[#B88A3B]"
                  />
                  <span>ہیڈر میں سرچ بار دکھائیں (Show Search Bar)</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer font-bold text-stone-700 dark:text-stone-300">
                  <input
                    type="checkbox"
                    checked={showTopBar}
                    onChange={(e) => setShowTopBar(e.target.checked)}
                    className="rounded text-[#B88A3B]"
                  />
                  <span>ٹاپ بار فعال کریں (Show Top Bar)</span>
                </label>
              </div>

            </div>

          </div>
        </div>
      ) : activeTab === 'topbar' ? (
        /* TOP BAR TAB */
        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-stone-200 dark:border-slate-800 shadow-sm space-y-6 text-xs">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block font-bold text-stone-700 dark:text-stone-300 mb-1">
                مرکزی دفتری فون نمبر (Main Office Phone)
              </label>
              <div className="flex items-center rounded-xl border border-stone-300 dark:border-slate-700 bg-stone-50 dark:bg-slate-800 overflow-hidden" dir="ltr">
                <span className="px-3 py-2 text-stone-400"><Phone className="w-4 h-4" /></span>
                <input
                  type="text"
                  value={topBarPhone}
                  onChange={(e) => setTopBarPhone(e.target.value)}
                  className="flex-1 px-2 py-2 bg-transparent text-stone-900 dark:text-white font-mono focus:outline-hidden"
                />
              </div>
            </div>

            <div>
              <label className="block font-bold text-stone-700 dark:text-stone-300 mb-1">
                دار الافتاء ہاٹ لائن (Darul Ifta Hotline)
              </label>
              <div className="flex items-center rounded-xl border border-stone-300 dark:border-slate-700 bg-stone-50 dark:bg-slate-800 overflow-hidden" dir="ltr">
                <span className="px-3 py-2 text-amber-500"><Phone className="w-4 h-4" /></span>
                <input
                  type="text"
                  value={topBarIftaPhone}
                  onChange={(e) => setTopBarIftaPhone(e.target.value)}
                  className="flex-1 px-2 py-2 bg-transparent text-stone-900 dark:text-white font-mono focus:outline-hidden"
                />
              </div>
            </div>

            <div>
              <label className="block font-bold text-stone-700 dark:text-stone-300 mb-1">
                رسمی ای میل ایڈریس (Official Email)
              </label>
              <div className="flex items-center rounded-xl border border-stone-300 dark:border-slate-700 bg-stone-50 dark:bg-slate-800 overflow-hidden" dir="ltr">
                <span className="px-3 py-2 text-stone-400"><Mail className="w-4 h-4" /></span>
                <input
                  type="email"
                  value={topBarEmail}
                  onChange={(e) => setTopBarEmail(e.target.value)}
                  className="flex-1 px-2 py-2 bg-transparent text-stone-900 dark:text-white font-mono focus:outline-hidden"
                />
              </div>
            </div>

            <div>
              <label className="block font-bold text-stone-700 dark:text-stone-300 mb-1">
                دفتری اوقات (Urdu Timings)
              </label>
              <input
                type="text"
                value={topBarTimingsUr}
                onChange={(e) => setTopBarTimingsUr(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-stone-300 dark:border-slate-700 bg-stone-50 dark:bg-slate-800 text-stone-900 dark:text-white"
              />
            </div>
          </div>

          {/* Social Links Sub-section */}
          <div className="pt-4 border-t border-stone-200 dark:border-slate-800 space-y-3">
            <h3 className="font-bold text-sm text-stone-900 dark:text-white flex items-center gap-1.5">
              <Share2 className="w-4 h-4 text-[#B88A3B]" />
              <span>جامعہ کے آفیشل سوشل میڈیا روابط (Official Social Media Links)</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block font-bold text-stone-600 dark:text-stone-300 mb-1">فیس بک پیج URL</label>
                <input
                  type="text"
                  value={facebookUrl}
                  onChange={(e) => setFacebookUrl(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-stone-300 dark:border-slate-700 bg-stone-50 dark:bg-slate-800 text-stone-900 dark:text-white font-mono"
                  dir="ltr"
                />
              </div>

              <div>
                <label className="block font-bold text-stone-600 dark:text-stone-300 mb-1">یوٹیوب چینل URL</label>
                <input
                  type="text"
                  value={youtubeUrl}
                  onChange={(e) => setYoutubeUrl(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-stone-300 dark:border-slate-700 bg-stone-50 dark:bg-slate-800 text-stone-900 dark:text-white font-mono"
                  dir="ltr"
                />
              </div>

              <div>
                <label className="block font-bold text-stone-600 dark:text-stone-300 mb-1">واٹس ایپ چینل / ہیلپ لائن</label>
                <input
                  type="text"
                  value={whatsappUrl}
                  onChange={(e) => setWhatsappUrl(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-stone-300 dark:border-slate-700 bg-stone-50 dark:bg-slate-800 text-stone-900 dark:text-white font-mono"
                  dir="ltr"
                />
              </div>

              <div>
                <label className="block font-bold text-stone-600 dark:text-stone-300 mb-1">ٹوئٹر / X اکاؤنٹ</label>
                <input
                  type="text"
                  value={twitterUrl}
                  onChange={(e) => setTwitterUrl(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-stone-300 dark:border-slate-700 bg-stone-50 dark:bg-slate-800 text-stone-900 dark:text-white font-mono"
                  dir="ltr"
                />
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* FOOTER TAB */
        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-stone-200 dark:border-slate-800 shadow-sm space-y-4 text-xs">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block font-bold text-stone-700 dark:text-stone-300 mb-1">
                فوٹر تعارفی پیراگراف (Urdu About)
              </label>
              <textarea
                rows={3}
                value={footerAboutUr}
                onChange={(e) => setFooterAboutUr(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-stone-300 dark:border-slate-700 bg-stone-50 dark:bg-slate-800 text-stone-900 dark:text-white"
              />
            </div>

            <div>
              <label className="block font-bold text-stone-700 dark:text-stone-300 mb-1">
                Footer About (English)
              </label>
              <textarea
                rows={3}
                value={footerAboutEn}
                onChange={(e) => setFooterAboutEn(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-stone-300 dark:border-slate-700 bg-stone-50 dark:bg-slate-800 text-stone-900 dark:text-white font-sans"
                dir="ltr"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block font-bold text-stone-700 dark:text-stone-300 mb-1">
                جامعہ کا جغرافیائی پتہ (Urdu Address)
              </label>
              <input
                type="text"
                value={addressUr}
                onChange={(e) => setAddressUr(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-stone-300 dark:border-slate-700 bg-stone-50 dark:bg-slate-800 text-stone-900 dark:text-white"
              />
            </div>

            <div>
              <label className="block font-bold text-stone-700 dark:text-stone-300 mb-1">
                Physical Address (English)
              </label>
              <input
                type="text"
                value={addressEn}
                onChange={(e) => setAddressEn(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-stone-300 dark:border-slate-700 bg-stone-50 dark:bg-slate-800 text-stone-900 dark:text-white font-sans"
                dir="ltr"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block font-bold text-stone-700 dark:text-stone-300 mb-1">
                کاپی رائٹ متن (Urdu Copyright)
              </label>
              <input
                type="text"
                value={copyrightUr}
                onChange={(e) => setCopyrightUr(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-stone-300 dark:border-slate-700 bg-stone-50 dark:bg-slate-800 text-stone-900 dark:text-white"
              />
            </div>

            <div>
              <label className="block font-bold text-stone-700 dark:text-stone-300 mb-1">
                Copyright Text (English)
              </label>
              <input
                type="text"
                value={copyrightEn}
                onChange={(e) => setCopyrightEn(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-stone-300 dark:border-slate-700 bg-stone-50 dark:bg-slate-800 text-stone-900 dark:text-white font-sans"
                dir="ltr"
              />
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
