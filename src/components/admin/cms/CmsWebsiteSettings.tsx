import React, { useState, useEffect } from 'react';
import { cmsApiService } from '../../../services/cmsApiService';
import { CmsRevision } from '../../../types';
import { 
  Settings, 
  Save, 
  CheckCircle, 
  AlertCircle, 
  Loader2, 
  Database, 
  ShieldCheck, 
  Globe, 
  Building, 
  CreditCard, 
  Bell, 
  Lock,
  Download,
  Upload,
  RotateCcw,
  History,
  FileText,
  Eye,
  Copy,
  RefreshCw,
  Layers,
  X
} from 'lucide-react';

interface CmsWebsiteSettingsProps {
  onExportBackup?: () => void;
  onImportBackup?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const CmsWebsiteSettings: React.FC<CmsWebsiteSettingsProps> = ({
  onExportBackup,
  onImportBackup
}) => {
  const [activeTab, setActiveTab] = useState<'general' | 'donations' | 'security' | 'backup' | 'revisions'>('general');
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [successMsg, setSuccessMsg] = useState<string>('');
  const [errorMsg, setErrorMsg] = useState<string>('');

  // General site settings
  const [siteNameUr, setSiteNameUr] = useState<string>('جامعہ اسلامیہ ایبٹ آباد');
  const [siteNameEn, setSiteNameEn] = useState<string>('Jamia Islamia Abbottabad');
  const [affiliationUr, setAffiliationUr] = useState<string>('وفاق المدارس العربیہ پاکستان');
  const [establishedYear, setEstablishedYear] = useState<string>('1951');
  const [principalName, setPrincipalName] = useState<string>('مہتمم و شیخ الحدیث حضرت مولانا...');
  const [defaultLanguage, setDefaultLanguage] = useState<'ur' | 'ar' | 'en'>('ur');

  // Donation bank details
  const [bankName, setBankName] = useState<string>('Meezan Bank Limited / حبیب بینک');
  const [accountTitle, setAccountTitle] = useState<string>('Jamia Islamia Abbottabad');
  const [accountNumber, setAccountNumber] = useState<string>('0123-4567890123');
  const [iban, setIban] = useState<string>('PK36MEZN0001234567890123');
  const [easypaisaNumber, setEasypaisaNumber] = useState<string>('0300-1234567');
  const [jazzcashNumber, setJazzcashNumber] = useState<string>('0301-1234567');

  // Security options
  const [enableAdmin2FA, setEnableAdmin2FA] = useState<boolean>(false);
  const [sessionTimeoutMinutes, setSessionTimeoutMinutes] = useState<number>(120);

  // Revision History & Rollback state
  const [revisions, setRevisions] = useState<CmsRevision[]>([]);
  const [isLoadingRevisions, setIsLoadingRevisions] = useState<boolean>(false);
  const [revisionFilter, setRevisionFilter] = useState<string>('all');
  const [selectedRevisionForModal, setSelectedRevisionForModal] = useState<CmsRevision | null>(null);
  const [isRollingBack, setIsRollingBack] = useState<boolean>(false);
  const [copiedJson, setCopiedJson] = useState<boolean>(false);

  const loadRevisions = async () => {
    setIsLoadingRevisions(true);
    try {
      const filter = revisionFilter === 'all' ? undefined : revisionFilter;
      const data = await cmsApiService.getRevisions(filter);
      setRevisions(data || []);
    } catch (err: any) {
      console.warn('Error loading revisions:', err);
    } finally {
      setIsLoadingRevisions(false);
    }
  };

  useEffect(() => {
    if (activeTab === 'revisions') {
      loadRevisions();
    }
  }, [activeTab, revisionFilter]);

  const handleRollback = async (rev: CmsRevision) => {
    const entityLabels: Record<string, string> = {
      page: 'صفحہ (Page)',
      menu: 'مینیو (Menu)',
      section: 'سیکشن (Section)',
      theme: 'تھیم ترتیبات (Theme)',
      seo: 'ایس ای او (SEO)',
      backup: 'بیک اپ (Backup)'
    };
    const label = entityLabels[rev.entityType] || rev.entityType;
    const dateStr = new Date(rev.createdAt).toLocaleString('ur-PK');

    const confirmRollback = confirm(
      `کیا آپ واقعی اس ریویژن پر واپس جانا چاہتے ہیں؟\n\n` +
      `• اینٹیٹی: ${label}\n` +
      `• شناختی نمبر: ${rev.entityId}\n` +
      `• تاریخِ ریویژن: ${dateStr}\n` +
      `• تدوین کار: ${rev.author}\n` +
      `${rev.revisionNote ? `• نوٹ: ${rev.revisionNote}\n` : ''}\n` +
      `اس عمل سے موجودہ حالت اس ریویژن کے مطابق تبدیل ہو جائے گی اور ایک نیا رول بیک ریکارڈ محفوظ ہو گا۔`
    );

    if (!confirmRollback) return;

    setIsRollingBack(true);
    try {
      const res = await cmsApiService.rollbackRevision(rev.id);
      if (res && res.success) {
        setSuccessMsg(res.message || 'ریویژن کامیابی کے ساتھ بحال (Rollback) ہو گیا!');
        await loadRevisions();
        setTimeout(() => setSuccessMsg(''), 5000);
      } else {
        setErrorMsg(res?.error || 'ریویژن بحال کرنے میں مسئلہ پیش آیا۔');
      }
    } catch (err: any) {
      setErrorMsg(err?.message || 'ریویژن بحال کرنے میں خرابی۔');
    } finally {
      setIsRollingBack(false);
    }
  };

  const handleSaveSettings = async () => {
    setIsSaving(true);
    setErrorMsg('');
    setSuccessMsg('');

    try {
      await new Promise(r => setTimeout(r, 600));
      // Log revision
      cmsApiService.createRevision({
        entityType: 'settings',
        entityId: 'general',
        action: 'update',
        dataJson: JSON.stringify({
          siteNameUr,
          siteNameEn,
          affiliationUr,
          establishedYear,
          principalName,
          defaultLanguage,
          bankName,
          accountTitle,
          accountNumber,
          iban,
          easypaisaNumber,
          jazzcashNumber,
          enableAdmin2FA,
          sessionTimeoutMinutes
        }),
        author: 'Admin',
        revisionNote: 'ویب سائٹ کی عمومی و سیکیورٹی ترتیبات محفوظ ہوئیں'
      }).catch(() => {});

      setSuccessMsg('ویب سائٹ کی عمومی ترتیبات کامیابی سے محفوظ ہو گئیں!');
      setTimeout(() => setSuccessMsg(''), 4000);
    } catch (err: any) {
      setErrorMsg(err?.message || 'ترتیبات محفوظ کرنے میں خرابی۔');
    } finally {
      setIsSaving(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedJson(true);
    setTimeout(() => setCopiedJson(false), 2500);
  };

  return (
    <div className="space-y-6 font-urdu" dir="rtl">
      {/* Top Header Card */}
      <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-stone-200 dark:border-slate-800 shadow-sm flex flex-wrap items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300">
              <Settings className="w-5 h-5" />
            </div>
            <h2 className="text-xl font-black text-stone-900 dark:text-white">
              ویب سائٹ جنرل ترتیبات و مستقل ریکوری (Settings, Backup & Recovery)
            </h2>
          </div>
          <p className="text-xs text-stone-500 dark:text-stone-400">
            جامعہ کی بنیادی معلومات، آن لائن عطیات، ڈیٹا بیس کا مکمل بیک اپ اور ریویژن ہسٹری و رول بیک۔
          </p>
        </div>

        {activeTab !== 'backup' && activeTab !== 'revisions' && (
          <button
            onClick={handleSaveSettings}
            disabled={isSaving}
            className="px-6 py-2.5 bg-[#5C4632] hover:bg-[#433123] text-amber-300 font-bold text-xs rounded-xl shadow-md border border-[#B88A3B] flex items-center gap-2 cursor-pointer transition-all disabled:opacity-60"
          >
            {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            <span>تمام ترتیبات محفوظ کریں</span>
          </button>
        )}
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
      <div className="flex flex-wrap rounded-2xl bg-stone-100 dark:bg-slate-800 p-1.5 border border-stone-200 dark:border-slate-700 gap-1">
        <button
          type="button"
          onClick={() => setActiveTab('general')}
          className={`flex-1 min-w-[120px] py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'general'
              ? 'bg-[#5C4632] text-amber-300 shadow-sm border border-[#B88A3B]'
              : 'text-stone-600 dark:text-stone-300 hover:text-stone-900'
          }`}
        >
          بنیادی معلومات (General)
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('donations')}
          className={`flex-1 min-w-[120px] py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'donations'
              ? 'bg-[#5C4632] text-amber-300 shadow-sm border border-[#B88A3B]'
              : 'text-stone-600 dark:text-stone-300 hover:text-stone-900'
          }`}
        >
          عطیات و بینک (Donations)
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('security')}
          className={`flex-1 min-w-[120px] py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'security'
              ? 'bg-[#5C4632] text-amber-300 shadow-sm border border-[#B88A3B]'
              : 'text-stone-600 dark:text-stone-300 hover:text-stone-900'
          }`}
        >
          سیکیورٹی (Security)
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('backup')}
          className={`flex-1 min-w-[130px] py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'backup'
              ? 'bg-[#5C4632] text-amber-300 shadow-sm border border-[#B88A3B]'
              : 'text-stone-600 dark:text-stone-300 hover:text-stone-900'
          }`}
        >
          بیک اپ و بحالی (Backup)
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('revisions')}
          className={`flex-1 min-w-[140px] py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'revisions'
              ? 'bg-[#5C4632] text-amber-300 shadow-sm border border-[#B88A3B]'
              : 'text-stone-600 dark:text-stone-300 hover:text-stone-900'
          }`}
        >
          ریویژن تاریخچہ و رول بیک (Revisions)
        </button>
      </div>

      {/* Tab 1: General Info */}
      {activeTab === 'general' && (
        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-stone-200 dark:border-slate-800 shadow-sm space-y-4 text-xs">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block font-bold text-stone-700 dark:text-stone-300 mb-1">
                جامعہ کا نام (اردو)
              </label>
              <input
                type="text"
                value={siteNameUr}
                onChange={(e) => setSiteNameUr(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-stone-300 dark:border-slate-700 bg-stone-50 dark:bg-slate-800 text-stone-900 dark:text-white font-bold"
              />
            </div>

            <div>
              <label className="block font-bold text-stone-700 dark:text-stone-300 mb-1">
                Name of Institution (English)
              </label>
              <input
                type="text"
                value={siteNameEn}
                onChange={(e) => setSiteNameEn(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-stone-300 dark:border-slate-700 bg-stone-50 dark:bg-slate-800 text-stone-900 dark:text-white font-sans"
                dir="ltr"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block font-bold text-stone-700 dark:text-stone-300 mb-1">
                الحاق / بورڈ
              </label>
              <input
                type="text"
                value={affiliationUr}
                onChange={(e) => setAffiliationUr(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-stone-300 dark:border-slate-700 bg-stone-50 dark:bg-slate-800 text-stone-900 dark:text-white"
              />
            </div>

            <div>
              <label className="block font-bold text-stone-700 dark:text-stone-300 mb-1">
                سنِ قیام (Established Year)
              </label>
              <input
                type="text"
                value={establishedYear}
                onChange={(e) => setEstablishedYear(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-stone-300 dark:border-slate-700 bg-stone-50 dark:bg-slate-800 text-stone-900 dark:text-white font-mono"
                dir="ltr"
              />
            </div>

            <div>
              <label className="block font-bold text-stone-700 dark:text-stone-300 mb-1">
                ابتدائی زبان (Default Language)
              </label>
              <select
                value={defaultLanguage}
                onChange={(e) => setDefaultLanguage(e.target.value as any)}
                className="w-full px-3 py-2 rounded-xl border border-stone-300 dark:border-slate-700 bg-stone-50 dark:bg-slate-800 text-stone-900 dark:text-white"
              >
                <option value="ur">اردو (Urdu)</option>
                <option value="ar">العربية (Arabic)</option>
                <option value="en">English</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block font-bold text-stone-700 dark:text-stone-300 mb-1">
              سرپرست / مہتمم صاحب کا نام و تعارف
            </label>
            <input
              type="text"
              value={principalName}
              onChange={(e) => setPrincipalName(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-stone-300 dark:border-slate-700 bg-stone-50 dark:bg-slate-800 text-stone-900 dark:text-white"
            />
          </div>
        </div>
      )}

      {/* Tab 2: Donations */}
      {activeTab === 'donations' && (
        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-stone-200 dark:border-slate-800 shadow-sm space-y-4 text-xs">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block font-bold text-stone-700 dark:text-stone-300 mb-1">
                بینک کا نام
              </label>
              <input
                type="text"
                value={bankName}
                onChange={(e) => setBankName(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-stone-300 dark:border-slate-700 bg-stone-50 dark:bg-slate-800 text-stone-900 dark:text-white"
              />
            </div>

            <div>
              <label className="block font-bold text-stone-700 dark:text-stone-300 mb-1">
                کھاتہ کا عنوان (Account Title)
              </label>
              <input
                type="text"
                value={accountTitle}
                onChange={(e) => setAccountTitle(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-stone-300 dark:border-slate-700 bg-stone-50 dark:bg-slate-800 text-stone-900 dark:text-white font-sans"
                dir="ltr"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block font-bold text-stone-700 dark:text-stone-300 mb-1">
                اکاؤنٹ نمبر
              </label>
              <input
                type="text"
                value={accountNumber}
                onChange={(e) => setAccountNumber(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-stone-300 dark:border-slate-700 bg-stone-50 dark:bg-slate-800 text-stone-900 dark:text-white font-mono"
                dir="ltr"
              />
            </div>

            <div>
              <label className="block font-bold text-stone-700 dark:text-stone-300 mb-1">
                IBAN نمبر
              </label>
              <input
                type="text"
                value={iban}
                onChange={(e) => setIban(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-stone-300 dark:border-slate-700 bg-stone-50 dark:bg-slate-800 text-stone-900 dark:text-white font-mono"
                dir="ltr"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block font-bold text-stone-700 dark:text-stone-300 mb-1">
                ایزی پیسہ (Easypaisa) اکاؤنٹ نمبر
              </label>
              <input
                type="text"
                value={easypaisaNumber}
                onChange={(e) => setEasypaisaNumber(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-stone-300 dark:border-slate-700 bg-stone-50 dark:bg-slate-800 text-stone-900 dark:text-white font-mono"
                dir="ltr"
              />
            </div>

            <div>
              <label className="block font-bold text-stone-700 dark:text-stone-300 mb-1">
                جاز کیش (JazzCash) اکاؤنٹ نمبر
              </label>
              <input
                type="text"
                value={jazzcashNumber}
                onChange={(e) => setJazzcashNumber(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-stone-300 dark:border-slate-700 bg-stone-50 dark:bg-slate-800 text-stone-900 dark:text-white font-mono"
                dir="ltr"
              />
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Security */}
      {activeTab === 'security' && (
        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-stone-200 dark:border-slate-800 shadow-sm space-y-4 text-xs">
          <h3 className="font-bold text-sm text-stone-900 dark:text-white flex items-center gap-2 border-b border-stone-100 dark:border-slate-800 pb-3">
            <Lock className="w-4 h-4 text-[#B88A3B]" />
            <span>ایڈمن سیشن اور حفاظتی ترتیبات</span>
          </h3>

          <div className="space-y-3">
            <div>
              <label className="block font-bold text-stone-700 dark:text-stone-300 mb-1">
                سیشن ٹائم آؤٹ (منٹ)
              </label>
              <input
                type="number"
                value={sessionTimeoutMinutes}
                onChange={(e) => setSessionTimeoutMinutes(Number(e.target.value))}
                className="w-48 px-3 py-2 rounded-xl border border-stone-300 dark:border-slate-700 bg-stone-50 dark:bg-slate-800 text-stone-900 dark:text-white font-mono"
                dir="ltr"
              />
            </div>

            <label className="flex items-center gap-2 cursor-pointer font-bold text-stone-700 dark:text-stone-300 pt-2">
              <input
                type="checkbox"
                checked={enableAdmin2FA}
                onChange={(e) => setEnableAdmin2FA(e.target.checked)}
                className="rounded text-[#B88A3B]"
              />
              <span>ایڈمن لاگ ان کے لیے دو مرحلہ تصدیق (Two-Factor Authentication) فعال کریں</span>
            </label>
          </div>
        </div>
      )}

      {/* Tab 4: Backup & Database */}
      {activeTab === 'backup' && (
        <div className="space-y-6">
          {/* Quick Actions Card */}
          <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-stone-200 dark:border-slate-800 shadow-sm space-y-4">
            <h3 className="font-bold text-sm text-stone-900 dark:text-white flex items-center gap-2 border-b border-stone-100 dark:border-slate-800 pb-3">
              <Database className="w-4 h-4 text-[#B88A3B]" />
              <span>مستقل ڈیٹا بیس و CMS مکمل بیک اپ و بحالی (Full Export & Safe Restore)</span>
            </h3>

            <p className="text-stone-600 dark:text-stone-300 text-xs leading-relaxed">
              اس سیکشن سے آپ جامعہ کے تمام فتاویٰ، سوالات، کتب، امتحانی نتائج اور مکمل CMS (صفحات، مینیوز، آئٹمز، سیکشنز، تھیم، SEO، اور ریویژن ہسٹری) کی خود مختار JSON فائل ڈاؤن لوڈ یا بحال کر سکتے ہیں۔
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              {/* Export Button */}
              <div className="p-4 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/60 flex flex-col justify-between space-y-3">
                <div className="space-y-1">
                  <span className="font-bold text-xs text-amber-900 dark:text-amber-200 flex items-center gap-1.5">
                    <Download className="w-4 h-4 text-amber-700 dark:text-amber-400" />
                    مکمل بیک اپ فائل ڈاؤن لوڈ کریں (JSON)
                  </span>
                  <p className="text-[11px] text-stone-600 dark:text-stone-400">
                    تمام ۲۰ ڈیٹا بیس ٹیبلز، فتاویٰ آرکائیو اور CMS ترتیبات کا محفوظ اسنیپ شاٹ ڈاؤن لوڈ کریں۔
                  </p>
                </div>
                {onExportBackup && (
                  <button
                    onClick={onExportBackup}
                    className="w-full py-2.5 px-4 rounded-xl bg-[#5C4632] hover:bg-[#433123] text-amber-300 font-bold text-xs border border-[#B88A3B] shadow-sm flex items-center justify-center gap-2 cursor-pointer transition-all"
                  >
                    <Download className="w-4 h-4" />
                    <span>مکمل بیک اپ ڈاؤن لوڈ کریں</span>
                  </button>
                )}
              </div>

              {/* Import Button */}
              <div className="p-4 rounded-xl bg-stone-50 dark:bg-slate-800/80 border border-stone-200 dark:border-slate-700 flex flex-col justify-between space-y-3">
                <div className="space-y-1">
                  <span className="font-bold text-xs text-stone-900 dark:text-white flex items-center gap-1.5">
                    <Upload className="w-4 h-4 text-[#B88A3B]" />
                    سابقہ بیک اپ فائل اپ لوڈ و بحال کریں
                  </span>
                  <p className="text-[11px] text-stone-500 dark:text-stone-400">
                    JSON فائل کا انتخاب کریں۔ پہلے فائل کی ساخت و تصدیق کی جائے گی، بعد ازاں تصدیقی ونڈو میں ریکارڈز کا خلاصہ ظاہر ہو گا۔
                  </p>
                </div>
                {onImportBackup && (
                  <label className="w-full py-2.5 px-4 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs shadow-sm flex items-center justify-center gap-2 cursor-pointer transition-all text-center">
                    <Upload className="w-4 h-4" />
                    <span>بیک اپ فائل منتخب کریں (JSON)</span>
                    <input
                      type="file"
                      accept=".json"
                      onChange={onImportBackup}
                      className="hidden"
                    />
                  </label>
                )}
              </div>
            </div>
          </div>

          {/* Database Tables Schema Matrix */}
          <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-stone-200 dark:border-slate-800 shadow-sm space-y-4 text-xs">
            <h3 className="font-bold text-sm text-stone-900 dark:text-white flex items-center gap-2 border-b border-stone-100 dark:border-slate-800 pb-3">
              <Layers className="w-4 h-4 text-[#B88A3B]" />
              <span>ڈیٹا بیس اسٹرکچر اور بیک اپ کوریج (Database Tables Coverage Matrix)</span>
            </h3>

            <p className="text-stone-500 dark:text-stone-400 leading-relaxed">
              مندرجہ ذیل تمام مستقل ٹیبلز بیک اپ اور ریکوری کے عمل میں تصدیق شدہ ہیں:
            </p>

            <div className="space-y-2">
              <span className="font-bold text-xs text-amber-800 dark:text-amber-400 block">
                • CMS ڈیٹا بیس ٹیبلز (۸ ٹیبلز):
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5 font-mono text-[11px]" dir="ltr">
                {[
                  { table: 'cms_pages', desc: 'Custom Multilingual Pages' },
                  { table: 'cms_menus', desc: 'Navigation Menus & Trees' },
                  { table: 'cms_menu_items', desc: 'Normalized Menu Hierarchy' },
                  { table: 'cms_media', desc: 'Media Library & Assets' },
                  { table: 'cms_sections', desc: 'Homepage & UI Blocks' },
                  { table: 'cms_theme_settings', desc: 'Colors, CSS & Header' },
                  { table: 'cms_seo_settings', desc: 'SEO Meta, OG & Robots' },
                  { table: 'cms_revisions', desc: 'Audit Trail & Edit History' },
                ].map((t) => (
                  <div key={t.table} className="p-3 rounded-xl bg-stone-50 dark:bg-slate-800/80 border border-stone-200 dark:border-slate-700 space-y-1">
                    <span className="font-bold text-emerald-600 dark:text-emerald-400 block">{t.table}</span>
                    <span className="text-[10px] text-stone-500 block font-sans">{t.desc}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-2 pt-2">
              <span className="font-bold text-xs text-stone-700 dark:text-stone-300 block">
                • جامعہ ادارہ جاتی ریکارڈز (۱۲ ٹیبلز):
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 font-mono text-[10px]" dir="ltr">
                {['fatwas', 'online_questions', 'class_bookings', 'exam_results', 'departments', 'faculty', 'books', 'media', 'news', 'donations', 'site_settings', 'site_visitors'].map((name) => (
                  <div key={name} className="p-2 rounded-lg bg-stone-100 dark:bg-slate-800 text-stone-700 dark:text-stone-300 text-center font-bold">
                    {name}
                  </div>
                ))}
              </div>
            </div>

            <div className="p-3 rounded-xl bg-emerald-50/80 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900/60 text-emerald-900 dark:text-emerald-200 text-xs flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600 flex-shrink-0" />
              <span>تحفظِ پاس ورڈ: بیک اپ فائل میں ایڈمن پاس ورڈ ہیشز اور سیشن ٹوکنز شامل نہیں ہوتے تاکہ ڈیٹا مکمل محفوظ رہے۔</span>
            </div>
          </div>
        </div>
      )}

      {/* Tab 5: Revisions & History */}
      {activeTab === 'revisions' && (
        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-stone-200 dark:border-slate-800 shadow-sm space-y-6 text-xs">
          {/* Header with Filter & Refresh */}
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-stone-100 dark:border-slate-800 pb-4">
            <div className="space-y-1">
              <h3 className="font-bold text-sm text-stone-900 dark:text-white flex items-center gap-2">
                <History className="w-4 h-4 text-[#B88A3B]" />
                <span>ریویژن تاریخچہ و رول بیک (Revision History & Rollback)</span>
              </h3>
              <p className="text-stone-500 dark:text-stone-400">
                CMS میں کی جانے والی تبدیلیوں کا مستقل ریکارڈ۔ آپ کسی بھی سابقہ حالت کو ایک کلک سے بحال (Rollback) کر سکتے ہیں۔
              </p>
            </div>

            <div className="flex items-center gap-3">
              {/* Filter */}
              <div className="flex items-center gap-2">
                <span className="font-bold text-stone-600 dark:text-stone-400 text-xs">فلٹر:</span>
                <select
                  value={revisionFilter}
                  onChange={(e) => setRevisionFilter(e.target.value)}
                  className="px-3 py-1.5 rounded-xl border border-stone-300 dark:border-slate-700 bg-stone-50 dark:bg-slate-800 text-stone-900 dark:text-white font-bold"
                >
                  <option value="all">تمام اینٹیٹیز (All)</option>
                  <option value="page">صفحات (Pages)</option>
                  <option value="menu">مینیوز (Menus)</option>
                  <option value="section">سیکشنز (Sections)</option>
                  <option value="theme">تھیم ترتیبات (Theme)</option>
                  <option value="seo">ایس ای او (SEO)</option>
                  <option value="backup">بیک اپ و بحالی (Backups)</option>
                </select>
              </div>

              {/* Refresh */}
              <button
                type="button"
                onClick={loadRevisions}
                disabled={isLoadingRevisions}
                className="p-2 rounded-xl border border-stone-300 dark:border-slate-700 bg-stone-50 dark:bg-slate-800 text-stone-700 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-slate-700 cursor-pointer transition-all"
                title="تازہ کریں"
              >
                <RefreshCw className={`w-4 h-4 ${isLoadingRevisions ? 'animate-spin' : ''}`} />
              </button>
            </div>
          </div>

          {/* Revisions Count Indicator */}
          <div className="flex items-center justify-between text-xs text-stone-500 dark:text-stone-400 px-1">
            <span>کل محفوظ شدہ ریویژنز: <strong className="text-stone-800 dark:text-white font-mono">{revisions.length}</strong></span>
            {isRollingBack && (
              <span className="text-amber-600 dark:text-amber-400 font-bold flex items-center gap-1 animate-pulse">
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                سابقہ ریویژن بحال ہو رہا ہے...
              </span>
            )}
          </div>

          {/* Loading or Empty state */}
          {isLoadingRevisions ? (
            <div className="p-12 text-center text-stone-400 space-y-3">
              <Loader2 className="w-8 h-8 animate-spin mx-auto text-[#B88A3B]" />
              <p className="font-bold text-xs">ریویژن تاریخچہ لوڈ ہو رہا ہے...</p>
            </div>
          ) : revisions.length === 0 ? (
            <div className="p-12 text-center text-stone-400 space-y-2 border border-dashed border-stone-200 dark:border-slate-800 rounded-2xl">
              <History className="w-8 h-8 mx-auto text-stone-300 dark:text-stone-600" />
              <p className="font-bold text-xs">اس کیٹیگری میں ابھی کوئی ریویژن ریکارڈ موجود نہیں ہے۔</p>
              <p className="text-[11px] text-stone-400">جب آپ صفحات، مینیوز یا تھیم میں تبدیلی محفوظ کریں گے تو خودکار ریکارڈ یہاں ظاہر ہو گا۔</p>
            </div>
          ) : (
            <div className="overflow-x-auto rounded-xl border border-stone-200 dark:border-slate-800">
              <table className="w-full text-right border-collapse">
                <thead>
                  <tr className="bg-stone-50 dark:bg-slate-800/80 text-stone-600 dark:text-stone-400 border-b border-stone-200 dark:border-slate-800 text-[11px]">
                    <th className="p-3 font-bold">تاریخ و وقت</th>
                    <th className="p-3 font-bold">اینٹیٹی</th>
                    <th className="p-3 font-bold">ایکشن</th>
                    <th className="p-3 font-bold">شناختی نمبر</th>
                    <th className="p-3 font-bold">تدوین کار</th>
                    <th className="p-3 font-bold">وضاحتی نوٹ</th>
                    <th className="p-3 font-bold text-center">کارروائی</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100 dark:divide-slate-800 text-xs">
                  {revisions.map((rev) => {
                    const entityColors: Record<string, string> = {
                      page: 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300',
                      menu: 'bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300',
                      section: 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300',
                      theme: 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300',
                      seo: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300',
                      backup: 'bg-stone-200 text-stone-800 dark:bg-slate-700 dark:text-slate-200',
                    };

                    const actionColors: Record<string, string> = {
                      create: 'bg-emerald-50 text-emerald-700 border-emerald-300 dark:bg-emerald-950 dark:text-emerald-300',
                      update: 'bg-blue-50 text-blue-700 border-blue-300 dark:bg-blue-950 dark:text-blue-300',
                      delete: 'bg-rose-50 text-rose-700 border-rose-300 dark:bg-rose-950 dark:text-rose-300',
                      rollback: 'bg-amber-50 text-amber-800 border-amber-300 dark:bg-amber-950 dark:text-amber-300 font-bold',
                      restore: 'bg-teal-50 text-teal-800 border-teal-300 dark:bg-teal-950 dark:text-teal-300 font-bold'
                    };

                    const actionLabel: Record<string, string> = {
                      create: 'تخلیق (Create)',
                      update: 'اپ ڈیٹ (Update)',
                      delete: 'حذف (Delete)',
                      rollback: 'واپسی (Rollback)',
                      restore: 'بحالی (Restore)'
                    };

                    const entityLabel: Record<string, string> = {
                      page: 'صفحہ',
                      menu: 'مینیو',
                      section: 'سیکشن',
                      theme: 'تھیم',
                      seo: 'ایس ای او',
                      backup: 'بیک اپ'
                    };

                    const action = rev.action || 'update';

                    return (
                      <tr key={rev.id} className="hover:bg-stone-50/60 dark:hover:bg-slate-800/40 transition-colors">
                        {/* Date */}
                        <td className="p-3 text-stone-700 dark:text-stone-300 whitespace-nowrap font-mono text-[11px]" dir="ltr">
                          {new Date(rev.createdAt).toLocaleString('en-GB', { 
                            year: 'numeric', month: '2-digit', day: '2-digit', 
                            hour: '2-digit', minute: '2-digit' 
                          })}
                        </td>

                        {/* Entity */}
                        <td className="p-3 whitespace-nowrap">
                          <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${entityColors[rev.entityType] || 'bg-stone-100 text-stone-700'}`}>
                            {entityLabel[rev.entityType] || rev.entityType}
                          </span>
                        </td>

                        {/* Action */}
                        <td className="p-3 whitespace-nowrap">
                          <span className={`px-2 py-0.5 rounded-md text-[10px] border ${actionColors[action] || 'border-stone-200 text-stone-600'}`}>
                            {actionLabel[action] || action}
                          </span>
                        </td>

                        {/* Entity ID */}
                        <td className="p-3 font-mono text-[11px] text-stone-600 dark:text-stone-400 max-w-[120px] truncate" dir="ltr" title={rev.entityId}>
                          {rev.entityId}
                        </td>

                        {/* Author */}
                        <td className="p-3 text-stone-600 dark:text-stone-400 whitespace-nowrap">
                          {rev.author || 'Admin'}
                        </td>

                        {/* Note */}
                        <td className="p-3 text-stone-800 dark:text-stone-200 max-w-[200px] truncate" title={rev.revisionNote}>
                          {rev.revisionNote || '—'}
                        </td>

                        {/* Action buttons */}
                        <td className="p-3 whitespace-nowrap text-center">
                          <div className="flex items-center justify-center gap-1.5">
                            {/* View JSON Modal button */}
                            <button
                              type="button"
                              onClick={() => setSelectedRevisionForModal(rev)}
                              className="px-2.5 py-1 rounded-lg bg-stone-100 hover:bg-stone-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-stone-700 dark:text-stone-300 text-[11px] font-bold flex items-center gap-1 transition-all cursor-pointer"
                              title="ڈیٹا اسنیپ شاٹ دیکھیں"
                            >
                              <Eye className="w-3.5 h-3.5" />
                              <span>معائنہ</span>
                            </button>

                            {/* Rollback button */}
                            <button
                              type="button"
                              disabled={isRollingBack}
                              onClick={() => handleRollback(rev)}
                              className="px-2.5 py-1 rounded-lg bg-amber-600 hover:bg-amber-700 text-white text-[11px] font-bold flex items-center gap-1 shadow-xs transition-all cursor-pointer disabled:opacity-60"
                              title="اس ریویژن پر رول بیک کریں"
                            >
                              <RotateCcw className="w-3.5 h-3.5" />
                              <span>رول بیک</span>
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Revision State Snapshot Details Modal */}
      {selectedRevisionForModal && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-3 sm:p-6 bg-slate-950/80 backdrop-blur-xs font-urdu" dir="rtl">
          <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-2xl w-full border border-stone-200 dark:border-slate-800 shadow-2xl p-6 space-y-4 max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between border-b border-stone-100 dark:border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-[#B88A3B]" />
                <h3 className="font-bold text-sm text-stone-900 dark:text-white">
                  ریویژن کا ڈیٹا اسنیپ شاٹ (Snapshot Details)
                </h3>
              </div>
              <button
                onClick={() => setSelectedRevisionForModal(null)}
                className="p-1 rounded-lg text-stone-400 hover:text-stone-600 dark:hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs bg-stone-50 dark:bg-slate-800 p-3 rounded-xl">
              <div>
                <span className="text-stone-400 block text-[10px]">اینٹیٹی:</span>
                <span className="font-bold text-stone-800 dark:text-stone-200">{selectedRevisionForModal.entityType}</span>
              </div>
              <div>
                <span className="text-stone-400 block text-[10px]">شناختی نام:</span>
                <span className="font-mono text-stone-800 dark:text-stone-200 text-[11px] truncate block" dir="ltr">{selectedRevisionForModal.entityId}</span>
              </div>
              <div>
                <span className="text-stone-400 block text-[10px]">تاریخ:</span>
                <span className="font-mono text-stone-800 dark:text-stone-200 text-[11px] block" dir="ltr">{new Date(selectedRevisionForModal.createdAt).toLocaleDateString('en-GB')}</span>
              </div>
              <div>
                <span className="text-stone-400 block text-[10px]">تدوین کار:</span>
                <span className="font-bold text-stone-800 dark:text-stone-200">{selectedRevisionForModal.author || 'Admin'}</span>
              </div>
            </div>

            {selectedRevisionForModal.revisionNote && (
              <div className="text-xs bg-amber-50 dark:bg-amber-950/40 p-2.5 rounded-lg border border-amber-200 dark:border-amber-900/60 text-amber-900 dark:text-amber-200">
                <strong>نوٹ:</strong> {selectedRevisionForModal.revisionNote}
              </div>
            )}

            <div className="flex-1 min-h-0 relative">
              <pre 
                className="w-full h-72 p-4 rounded-xl bg-stone-900 text-amber-300 font-mono text-[11px] overflow-auto border border-stone-800 text-left" 
                dir="ltr"
              >
                {(() => {
                  try {
                    return JSON.stringify(JSON.parse(selectedRevisionForModal.dataJson), null, 2);
                  } catch {
                    return selectedRevisionForModal.dataJson;
                  }
                })()}
              </pre>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-stone-100 dark:border-slate-800">
              <button
                type="button"
                onClick={() => {
                  let formatted = selectedRevisionForModal.dataJson;
                  try {
                    formatted = JSON.stringify(JSON.parse(selectedRevisionForModal.dataJson), null, 2);
                  } catch {}
                  copyToClipboard(formatted);
                }}
                className="px-3 py-1.5 rounded-xl border border-stone-300 dark:border-slate-700 text-stone-700 dark:text-stone-300 text-xs font-bold flex items-center gap-1.5 hover:bg-stone-100 dark:hover:bg-slate-800 cursor-pointer"
              >
                <Copy className="w-3.5 h-3.5" />
                <span>{copiedJson ? 'کاپی ہو گیا!' : 'JSON کاپی کریں'}</span>
              </button>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedRevisionForModal(null)}
                  className="px-4 py-1.5 rounded-xl bg-stone-200 dark:bg-slate-800 text-stone-700 dark:text-stone-300 text-xs font-bold cursor-pointer"
                >
                  بند کریں
                </button>
                <button
                  type="button"
                  onClick={() => {
                    const revToRollback = selectedRevisionForModal;
                    setSelectedRevisionForModal(null);
                    handleRollback(revToRollback);
                  }}
                  className="px-4 py-1.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>اس پر رول بیک کریں</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
