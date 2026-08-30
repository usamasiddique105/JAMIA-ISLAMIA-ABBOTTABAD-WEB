import React, { useState } from 'react';
import { Fatwa, NewsItem } from '../../types';
import { 
  generateDraftTranslationForFatwa, 
  generateDraftTranslationForNews,
  approveFatwaTranslation,
  revokeFatwaTranslationApproval,
  approveNewsTranslation,
  revokeNewsTranslationApproval,
  isEnglishTranslationMissingOrFallback,
  isArabicTranslationMissingOrFallback
} from '../../services/fatwaTranslationService';
import { 
  Globe, 
  CheckCircle, 
  Clock, 
  Sparkles, 
  Edit3, 
  Save, 
  X, 
  Search, 
  Filter, 
  AlertCircle, 
  RefreshCw, 
  ShieldCheck, 
  BookOpen, 
  FileText,
  ChevronDown,
  ChevronUp,
  Eye,
  Check
} from 'lucide-react';

interface TranslationsManagementProps {
  fatwas: Fatwa[];
  news: NewsItem[];
  onRefreshData: () => void;
}

export const TranslationsManagement: React.FC<TranslationsManagementProps> = ({
  fatwas,
  news,
  onRefreshData,
}) => {
  const [activeSection, setActiveSection] = useState<'fatwas-pending' | 'fatwas-approved' | 'news'>('fatwas-pending');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  
  // Loading state for AI translation generation
  const [translatingId, setTranslatingId] = useState<string | null>(null);
  const [actionSuccessMessage, setActionSuccessMessage] = useState<string | null>(null);
  const [actionErrorMessage, setActionErrorMessage] = useState<string | null>(null);

  // Edit modal / inline editing state
  const [editingFatwa, setEditingFatwa] = useState<Fatwa | null>(null);
  const [editingNews, setEditingNews] = useState<NewsItem | null>(null);
  const [approverName, setApproverName] = useState<string>('دارالافتاء جامعہ اسلامیہ');

  // Expanded card state
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const showSuccess = (msg: string) => {
    setActionSuccessMessage(msg);
    setActionErrorMessage(null);
    setTimeout(() => setActionSuccessMessage(null), 4000);
  };

  const showError = (msg: string) => {
    setActionErrorMessage(msg);
    setActionSuccessMessage(null);
    setTimeout(() => setActionErrorMessage(null), 5000);
  };

  // Filter fatwas
  const pendingFatwas = fatwas.filter(f => !f.isTranslationApproved);
  const approvedFatwas = fatwas.filter(f => !!f.isTranslationApproved);

  const filteredPendingFatwas = pendingFatwas.filter(f => {
    const matchesSearch = 
      (f.title?.ur || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (f.question?.ur || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (f.fatwaNumber || '').toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCat = selectedCategory === 'all' || f.category === selectedCategory;
    return matchesSearch && matchesCat;
  });

  const filteredApprovedFatwas = approvedFatwas.filter(f => {
    const matchesSearch = 
      (f.title?.ur || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (f.title?.en || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (f.title?.ar || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (f.fatwaNumber || '').toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCat = selectedCategory === 'all' || f.category === selectedCategory;
    return matchesSearch && matchesCat;
  });

  const filteredNews = news.filter(n => {
    return (n.title?.ur || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (n.title?.en || '').toLowerCase().includes(searchQuery.toLowerCase());
  });

  // Handle AI Translation Draft Generation for a Fatwa
  const handleGenerateFatwaDraft = async (fatwa: Fatwa) => {
    try {
      setTranslatingId(fatwa.id);
      setActionErrorMessage(null);
      await generateDraftTranslationForFatwa(fatwa);
      onRefreshData();
      showSuccess(`فتویٰ نمبر ${fatwa.fatwaNumber || fatwa.id} کا انگریزی اور عربی مسودہ (Draft) کامیابی سے تیار کر لیا گیا ہے۔`);
    } catch (err: any) {
      console.error('Translation error:', err);
      showError(err.message || 'ترجمہ کی تیاری کے دوران خرابی پیش آئی۔ براہِ کرم دوبارہ کوشش کریں۔');
    } finally {
      setTranslatingId(null);
    }
  };

  // Handle AI Translation Draft Generation for News
  const handleGenerateNewsDraft = async (item: NewsItem) => {
    try {
      setTranslatingId(item.id);
      setActionErrorMessage(null);
      await generateDraftTranslationForNews(item);
      onRefreshData();
      showSuccess(`خبر/مضمون کا انگریزی و عربی ترجمہ مسودہ تیار ہو گیا۔`);
    } catch (err: any) {
      console.error('Translation error:', err);
      showError(err.message || 'ترجمہ کی تیاری کے دوران خرابی پیش آئی۔');
    } finally {
      setTranslatingId(null);
    }
  };

  // Handle Direct Approval
  const handleApproveFatwa = (fatwa: Fatwa) => {
    approveFatwaTranslation(fatwa.id, approverName);
    onRefreshData();
    showSuccess(`فتویٰ نمبر ${fatwa.fatwaNumber} کا ترجمہ منظور کر کے پبلک ویب سائٹ کے لیے شائع کر دیا گیا ہے۔`);
  };

  const handleRevokeFatwa = (fatwa: Fatwa) => {
    revokeFatwaTranslationApproval(fatwa.id);
    onRefreshData();
    showSuccess(`فتویٰ کا ترجمہ غیر منظور کر دیا گیا (پبلک سائٹ پر اردو متن نظر آئے گا)۔`);
  };

  const handleApproveNews = (item: NewsItem) => {
    approveNewsTranslation(item.id, approverName);
    onRefreshData();
    showSuccess(`مضمون کا ترجمہ پبلک سائٹ پر منظور و شائع کر دیا گیا ہے۔`);
  };

  const handleRevokeNews = (item: NewsItem) => {
    revokeNewsTranslationApproval(item.id);
    onRefreshData();
    showSuccess(`مضمون کا ترجمہ غیر منظور کر دیا گیا۔`);
  };

  // Save edits from modal
  const handleSaveFatwaEdits = () => {
    if (!editingFatwa) return;
    approveFatwaTranslation(editingFatwa.id, approverName, editingFatwa);
    onRefreshData();
    setEditingFatwa(null);
    showSuccess(`ترمیم شدہ ترجمہ محفوظ اور منظور کر دیا گیا۔`);
  };

  const handleSaveNewsEdits = () => {
    if (!editingNews) return;
    approveNewsTranslation(editingNews.id, approverName, editingNews);
    onRefreshData();
    setEditingNews(null);
    showSuccess(`مضمون کا ترجمہ محفوظ اور منظور کر دیا گیا۔`);
  };

  return (
    <div className="space-y-6 text-slate-800 dark:text-slate-100 font-urdu" dir="rtl">
      
      {/* Header & Overview Card */}
      <div className="bg-gradient-to-r from-[#3C2E21] to-[#5A432D] text-white rounded-2xl p-5 sm:p-7 shadow-lg border border-[#B88A3B]/40 relative overflow-hidden">
        <div className="absolute -left-10 -bottom-10 w-48 h-48 bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />
        
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 relative z-10">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <Globe className="w-7 h-7 text-amber-300" />
              <h2 className="text-xl sm:text-2xl font-bold font-nastaliq text-amber-200">
                نظامِ منظوری و تصدیقِ تراجم (Fatwa & Article Translations)
              </h2>
            </div>
            <p className="text-stone-200 text-sm sm:text-base leading-relaxed max-w-3xl">
              شرعی احتیاط کے تقاضوں کے مطابق تمام خودکار تراجم پہلے ڈرافٹ کے طور پر یہاں درج ہوتے ہیں۔ مفتی یا مجاز عالم کے جائزہ اور منظوری کے بعد ہی وہ انگریزی و عربی ورژن میں عوام کے لیے ظاہر ہوتے ہیں۔
            </p>
          </div>

          <div className="flex items-center gap-3 bg-black/30 backdrop-blur-sm px-4 py-2.5 rounded-xl border border-amber-400/20 shrink-0">
            <div className="text-center px-2">
              <span className="block text-2xl font-bold text-amber-300">{pendingFatwas.length}</span>
              <span className="text-xs text-stone-300">زیرِ التواء فتاویٰ</span>
            </div>
            <div className="h-8 w-px bg-amber-400/30" />
            <div className="text-center px-2">
              <span className="block text-2xl font-bold text-emerald-400">{approvedFatwas.length}</span>
              <span className="text-xs text-stone-300">منظور شدہ فتاویٰ</span>
            </div>
          </div>
        </div>
      </div>

      {/* Notifications */}
      {actionSuccessMessage && (
        <div className="p-4 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-700 text-emerald-800 dark:text-emerald-200 rounded-xl flex items-center gap-3 animate-in fade-in">
          <CheckCircle className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0" />
          <span className="font-semibold text-sm sm:text-base">{actionSuccessMessage}</span>
        </div>
      )}

      {actionErrorMessage && (
        <div className="p-4 bg-rose-50 dark:bg-rose-950/40 border border-rose-300 dark:border-rose-700 text-rose-800 dark:text-rose-200 rounded-xl flex items-center gap-3 animate-in fade-in">
          <AlertCircle className="w-5 h-5 text-rose-600 dark:text-rose-400 shrink-0" />
          <span className="font-semibold text-sm sm:text-base">{actionErrorMessage}</span>
        </div>
      )}

      {/* Navigation Sub-Tabs & Filters */}
      <div className="bg-white dark:bg-slate-900 border border-stone-200 dark:border-slate-800 rounded-xl p-4 shadow-sm space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-stone-200 dark:border-slate-800 pb-3">
          
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveSection('fatwas-pending')}
              className={`px-4 py-2 rounded-lg font-bold text-sm sm:text-base transition-all flex items-center gap-2 cursor-pointer ${
                activeSection === 'fatwas-pending'
                  ? 'bg-[#3C2E21] text-white shadow-sm'
                  : 'bg-stone-100 dark:bg-slate-800 text-stone-700 dark:text-stone-300 hover:bg-stone-200'
              }`}
            >
              <Clock className="w-4 h-4 text-amber-400" />
              <span>زیرِ التواء فتاویٰ ({pendingFatwas.length})</span>
            </button>

            <button
              onClick={() => setActiveSection('fatwas-approved')}
              className={`px-4 py-2 rounded-lg font-bold text-sm sm:text-base transition-all flex items-center gap-2 cursor-pointer ${
                activeSection === 'fatwas-approved'
                  ? 'bg-[#3C2E21] text-white shadow-sm'
                  : 'bg-stone-100 dark:bg-slate-800 text-stone-700 dark:text-stone-300 hover:bg-stone-200'
              }`}
            >
              <CheckCircle className="w-4 h-4 text-emerald-400" />
              <span>منظور شدہ فتاویٰ ({approvedFatwas.length})</span>
            </button>

            <button
              onClick={() => setActiveSection('news')}
              className={`px-4 py-2 rounded-lg font-bold text-sm sm:text-base transition-all flex items-center gap-2 cursor-pointer ${
                activeSection === 'news'
                  ? 'bg-[#3C2E21] text-white shadow-sm'
                  : 'bg-stone-100 dark:bg-slate-800 text-stone-700 dark:text-stone-300 hover:bg-stone-200'
              }`}
            >
              <FileText className="w-4 h-4 text-sky-400" />
              <span>خبریں و مضامین ({news.length})</span>
            </button>
          </div>

          {/* Approver Name Setting */}
          <div className="flex items-center gap-2">
            <span className="text-xs sm:text-sm text-stone-500 font-semibold">منظور کنندہ کا نام:</span>
            <input 
              type="text"
              value={approverName}
              onChange={(e) => setApproverName(e.target.value)}
              className="px-3 py-1 bg-stone-50 dark:bg-slate-800 border border-stone-300 dark:border-slate-700 rounded-md text-xs sm:text-sm font-semibold"
              placeholder="مثلاً: مفتی صاحب / ادارہ"
            />
          </div>
        </div>

        {/* Search Bar */}
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 text-stone-400 absolute right-3.5 top-1/2 -translate-y-1/2" />
            <input 
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="عنوان، فتویٰ نمبر یا سوال سے تلاش کریں..."
              className="w-full pl-4 pr-10 py-2 bg-stone-50 dark:bg-slate-850 border border-stone-200 dark:border-slate-700 rounded-lg text-sm focus:outline-none focus:border-[#B88A3B]"
            />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery('')}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600 text-xs"
              >
                صاف کریں
              </button>
            )}
          </div>
        </div>
      </div>

      {/* SECTION 1: PENDING FATWAS LIST */}
      {activeSection === 'fatwas-pending' && (
        <div className="space-y-4">
          {filteredPendingFatwas.length === 0 ? (
            <div className="text-center py-12 bg-white dark:bg-slate-900 rounded-2xl border border-stone-200 dark:border-slate-800 p-6 space-y-3">
              <CheckCircle className="w-12 h-12 text-emerald-500 mx-auto" />
              <h3 className="text-lg font-bold">کوئی زیرِ التواء فتویٰ باقی نہیں ہے!</h3>
              <p className="text-stone-500 text-sm">تمام فتاویٰ کے تراجم منظور اور شائع ہو چکے ہیں۔</p>
            </div>
          ) : (
            filteredPendingFatwas.map((fatwa) => {
              const isMissingEn = isEnglishTranslationMissingOrFallback(fatwa);
              const isMissingAr = isArabicTranslationMissingOrFallback(fatwa);
              const isTranslating = translatingId === fatwa.id;
              const isExpanded = expandedId === fatwa.id;

              return (
                <div 
                  key={fatwa.id}
                  className="bg-white dark:bg-slate-900 border border-amber-200 dark:border-amber-900/40 rounded-2xl p-5 shadow-sm space-y-4 transition-all hover:border-amber-400"
                >
                  {/* Top Bar */}
                  <div className="flex flex-wrap items-center justify-between gap-3 border-b border-stone-100 dark:border-slate-800 pb-3">
                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-1 bg-amber-100 dark:bg-amber-900/40 text-amber-800 dark:text-amber-200 text-xs font-bold rounded-md">
                        فتویٰ نمبر: {fatwa.fatwaNumber || '—'}
                      </span>
                      <span className="px-2.5 py-1 bg-stone-100 dark:bg-slate-800 text-stone-700 dark:text-stone-300 text-xs font-semibold rounded-md">
                        {fatwa.category}
                      </span>
                      <span className="px-2.5 py-1 bg-rose-100 dark:bg-rose-950/50 text-rose-700 dark:text-rose-300 text-xs font-bold rounded-md flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        <span>منظوری درکار ہے (Draft)</span>
                      </span>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center gap-2">
                      {/* AI Draft Generator */}
                      <button
                        onClick={() => handleGenerateFatwaDraft(fatwa)}
                        disabled={isTranslating}
                        className="px-3.5 py-1.5 bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 text-white rounded-lg text-xs sm:text-sm font-bold flex items-center gap-1.5 transition-all cursor-pointer disabled:opacity-50 shadow-xs"
                      >
                        {isTranslating ? (
                          <>
                            <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                            <span>ترجمہ تیار ہو رہا ہے...</span>
                          </>
                        ) : (
                          <>
                            <Sparkles className="w-3.5 h-3.5 text-amber-200" />
                            <span>{isMissingEn ? 'AI مسودہ تیار کریں' : 'AI دوبارہ ترجمہ کریں'}</span>
                          </>
                        )}
                      </button>

                      {/* Edit Button */}
                      <button
                        onClick={() => setEditingFatwa(fatwa)}
                        className="px-3.5 py-1.5 bg-stone-100 dark:bg-slate-800 hover:bg-stone-200 text-stone-800 dark:text-stone-200 rounded-lg text-xs sm:text-sm font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                      >
                        <Edit3 className="w-3.5 h-3.5 text-stone-600 dark:text-stone-400" />
                        <span>ترمیم کریں</span>
                      </button>

                      {/* Direct Approve & Publish Button */}
                      {!isMissingEn && (
                        <button
                          onClick={() => handleApproveFatwa(fatwa)}
                          className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs sm:text-sm font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-xs"
                        >
                          <ShieldCheck className="w-4 h-4 text-emerald-200" />
                          <span>منظور و شائع کریں</span>
                        </button>
                      )}

                      {/* Expand / Collapse Button */}
                      <button
                        onClick={() => setExpandedId(isExpanded ? null : fatwa.id)}
                        className="p-1.5 text-stone-400 hover:text-stone-600 rounded-md cursor-pointer"
                        title={isExpanded ? 'کم کریں' : 'تفصیل دیکھیں'}
                      >
                        {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  {/* Urdu Title & Question Preview */}
                  <div className="space-y-1.5">
                    <h4 className="text-base sm:text-lg font-bold text-stone-900 dark:text-stone-100 font-nastaliq">
                      {fatwa.title?.ur || 'بغیر عنوان'}
                    </h4>
                    <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-300 line-clamp-2 leading-relaxed">
                      <span className="font-bold text-stone-800 dark:text-stone-200">سوال: </span>
                      {fatwa.question?.ur}
                    </p>
                  </div>

                  {/* Translation Status Badges */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 bg-stone-50 dark:bg-slate-850 p-3 rounded-xl border border-stone-200 dark:border-slate-800 text-xs">
                    {/* English Draft Status */}
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-stone-600 dark:text-stone-300">English (انگریزی ترجمہ):</span>
                      {isMissingEn ? (
                        <span className="text-rose-600 font-bold">ترجمہ موجود نہیں (Missing)</span>
                      ) : (
                        <span className="text-amber-600 font-bold flex items-center gap-1">
                          <span>ڈرافٹ موجود ہے (تصدیق درکار)</span>
                          <Check className="w-3.5 h-3.5" />
                        </span>
                      )}
                    </div>

                    {/* Arabic Draft Status */}
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-stone-600 dark:text-stone-300">العربية (عربی ترجمہ):</span>
                      {isMissingAr ? (
                        <span className="text-rose-600 font-bold">ترجمہ موجود نہیں (Missing)</span>
                      ) : (
                        <span className="text-amber-600 font-bold flex items-center gap-1">
                          <span>ڈرافٹ موجود ہے (تصدیق درکار)</span>
                          <Check className="w-3.5 h-3.5" />
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Expanded Detail Preview */}
                  {isExpanded && (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 pt-3 border-t border-stone-100 dark:border-slate-800">
                      {/* English Side */}
                      <div className="bg-white dark:bg-slate-900 p-3.5 rounded-xl border border-stone-200 dark:border-slate-700 space-y-2 text-left" dir="ltr">
                        <div className="flex items-center justify-between border-b border-stone-100 dark:border-slate-800 pb-1.5">
                          <span className="text-xs font-bold uppercase tracking-wider text-amber-700 dark:text-amber-400">English Draft</span>
                          <span className="text-[11px] text-stone-400">Not public yet</span>
                        </div>
                        <h5 className="font-bold text-sm text-slate-800 dark:text-slate-100">{fatwa.title?.en || 'No title yet'}</h5>
                        <p className="text-xs text-slate-600 dark:text-slate-300 whitespace-pre-wrap">{fatwa.answer?.en || 'No answer translation generated yet.'}</p>
                      </div>

                      {/* Arabic Side */}
                      <div className="bg-white dark:bg-slate-900 p-3.5 rounded-xl border border-stone-200 dark:border-slate-700 space-y-2 text-right" dir="rtl">
                        <div className="flex items-center justify-between border-b border-stone-100 dark:border-slate-800 pb-1.5">
                          <span className="text-xs font-bold text-amber-700 dark:text-amber-400">مسودة الترجمة العربية</span>
                          <span className="text-[11px] text-stone-400">غير معتمدة للعامة</span>
                        </div>
                        <h5 className="font-bold text-sm text-slate-800 dark:text-slate-100">{fatwa.title?.ar || 'لا يوجد عنوان'}</h5>
                        <p className="text-xs text-slate-600 dark:text-slate-300 whitespace-pre-wrap font-naskh">{fatwa.answer?.ar || 'لم يتم توليد الترجمة بعد.'}</p>
                      </div>
                    </div>
                  )}

                </div>
              );
            })
          )}
        </div>
      )}

      {/* SECTION 2: APPROVED FATWAS LIST */}
      {activeSection === 'fatwas-approved' && (
        <div className="space-y-4">
          {filteredApprovedFatwas.length === 0 ? (
            <div className="text-center py-12 bg-white dark:bg-slate-900 rounded-2xl border border-stone-200 dark:border-slate-800 p-6 space-y-3">
              <AlertCircle className="w-12 h-12 text-amber-500 mx-auto" />
              <h3 className="text-lg font-bold">کوئی منظور شدہ فتویٰ نہیں ملا</h3>
              <p className="text-stone-500 text-sm">زیرِ التواء فتاویٰ کے ٹیب سے ترجمہ تیار کر کے منظور کریں۔</p>
            </div>
          ) : (
            filteredApprovedFatwas.map((fatwa) => (
              <div 
                key={fatwa.id}
                className="bg-white dark:bg-slate-900 border border-emerald-200 dark:border-emerald-900/40 rounded-2xl p-5 shadow-sm space-y-3"
              >
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-stone-100 dark:border-slate-800 pb-3">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-1 bg-emerald-100 dark:bg-emerald-900/40 text-emerald-800 dark:text-emerald-200 text-xs font-bold rounded-md flex items-center gap-1">
                      <ShieldCheck className="w-3.5 h-3.5" />
                      <span>منظور شدہ و شائع</span>
                    </span>
                    <span className="px-2.5 py-1 bg-stone-100 dark:bg-slate-800 text-stone-700 dark:text-stone-300 text-xs font-semibold rounded-md">
                      فتویٰ نمبر: {fatwa.fatwaNumber}
                    </span>
                    {fatwa.translationApprovedBy && (
                      <span className="text-xs text-stone-500">
                        منظور کنندہ: <strong className="text-stone-700 dark:text-stone-300">{fatwa.translationApprovedBy}</strong>
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setEditingFatwa(fatwa)}
                      className="px-3 py-1 bg-stone-100 dark:bg-slate-800 hover:bg-stone-200 text-stone-700 dark:text-stone-300 rounded-md text-xs font-bold cursor-pointer"
                    >
                      ترمیم
                    </button>
                    <button
                      onClick={() => handleRevokeFatwa(fatwa)}
                      className="px-3 py-1 bg-rose-50 dark:bg-rose-950/40 hover:bg-rose-100 text-rose-700 dark:text-rose-300 rounded-md text-xs font-bold cursor-pointer"
                    >
                      منسوخ کریں
                    </button>
                  </div>
                </div>

                <div className="space-y-1">
                  <h4 className="text-base font-bold text-stone-900 dark:text-stone-100 font-nastaliq">{fatwa.title?.ur}</h4>
                  <p className="text-xs text-stone-500 font-sans" dir="ltr"><strong>EN:</strong> {fatwa.title?.en}</p>
                  <p className="text-xs text-stone-500 font-naskh"><strong>AR:</strong> {fatwa.title?.ar}</p>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* SECTION 3: NEWS & ARTICLES */}
      {activeSection === 'news' && (
        <div className="space-y-4">
          {filteredNews.map((item) => {
            const isTranslating = translatingId === item.id;

            return (
              <div 
                key={item.id}
                className="bg-white dark:bg-slate-900 border border-stone-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm space-y-3"
              >
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-stone-100 dark:border-slate-800 pb-3">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-1 bg-sky-100 dark:bg-sky-900/40 text-sky-800 dark:text-sky-200 text-xs font-bold rounded-md">
                      {item.category || 'خبر/مضمون'}
                    </span>
                    {item.isTranslationApproved ? (
                      <span className="px-2.5 py-1 bg-emerald-100 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 text-xs font-bold rounded-md">
                        ترجمہ منظور شدہ
                      </span>
                    ) : (
                      <span className="px-2.5 py-1 bg-amber-100 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 text-xs font-bold rounded-md">
                        غیر منظور شدہ (ڈرافٹ)
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleGenerateNewsDraft(item)}
                      disabled={isTranslating}
                      className="px-3.5 py-1.5 bg-gradient-to-r from-amber-600 to-amber-700 text-white rounded-lg text-xs font-bold flex items-center gap-1 cursor-pointer disabled:opacity-50"
                    >
                      {isTranslating ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5" />}
                      <span>AI ترجمہ</span>
                    </button>

                    <button
                      onClick={() => setEditingNews(item)}
                      className="px-3 py-1.5 bg-stone-100 dark:bg-slate-800 text-stone-700 dark:text-stone-300 rounded-lg text-xs font-bold cursor-pointer"
                    >
                      ترمیم
                    </button>

                    {!item.isTranslationApproved ? (
                      <button
                        onClick={() => handleApproveNews(item)}
                        className="px-3.5 py-1.5 bg-emerald-600 text-white rounded-lg text-xs font-bold cursor-pointer"
                      >
                        منظور کریں
                      </button>
                    ) : (
                      <button
                        onClick={() => handleRevokeNews(item)}
                        className="px-3 py-1.5 bg-rose-50 text-rose-700 rounded-lg text-xs font-bold cursor-pointer"
                      >
                        منسوخ کریں
                      </button>
                    )}
                  </div>
                </div>

                <div className="space-y-1">
                  <h4 className="text-base font-bold font-nastaliq">{item.title?.ur}</h4>
                  {item.title?.en && <p className="text-xs text-stone-500 font-sans" dir="ltr"><strong>EN:</strong> {item.title?.en}</p>}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* FATWA EDIT & APPROVAL MODAL */}
      {editingFatwa && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5 overflow-y-auto">
          <div className="bg-white dark:bg-slate-900 border border-stone-300 dark:border-slate-700 rounded-2xl w-full max-w-4xl p-5 sm:p-6 shadow-2xl space-y-5 my-8">
            
            <div className="flex items-center justify-between border-b border-stone-200 dark:border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Globe className="w-5 h-5 text-amber-500" />
                <h3 className="text-lg font-bold font-nastaliq">ترجمہ کی تصحیح و منظوری (فتویٰ نمبر: {editingFatwa.fatwaNumber})</h3>
              </div>
              <button 
                onClick={() => setEditingFatwa(null)}
                className="p-1 text-stone-400 hover:text-stone-700 rounded-md"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 max-h-[65vh] overflow-y-auto pr-1">
              {/* Urdu Source (Readonly Reference) */}
              <div className="bg-stone-50 dark:bg-slate-850 p-3.5 rounded-xl border border-stone-200 dark:border-slate-800 space-y-1.5">
                <span className="text-xs font-bold text-amber-700 dark:text-amber-400">اصل اردو عنوان و سوال:</span>
                <p className="font-bold text-sm font-nastaliq">{editingFatwa.title?.ur}</p>
                <p className="text-xs text-stone-600 dark:text-stone-300">{editingFatwa.question?.ur}</p>
              </div>

              {/* English Translation Fields */}
              <div className="space-y-3 bg-amber-50/40 dark:bg-amber-950/20 p-4 rounded-xl border border-amber-200 dark:border-amber-900/30" dir="ltr">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-amber-800 dark:text-amber-300">English Translation</span>
                  <span className="text-[11px] text-stone-500">Latin script</span>
                </div>
                
                <div>
                  <label className="block text-xs font-semibold text-stone-600 dark:text-stone-300 mb-1">English Title:</label>
                  <input 
                    type="text"
                    value={editingFatwa.title?.en || ''}
                    onChange={(e) => setEditingFatwa({
                      ...editingFatwa,
                      title: { ...editingFatwa.title, ur: editingFatwa.title?.ur || '', en: e.target.value }
                    })}
                    className="w-full px-3 py-2 bg-white dark:bg-slate-800 border border-stone-300 dark:border-slate-700 rounded-lg text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-600 dark:text-stone-300 mb-1">English Answer Body:</label>
                  <textarea 
                    rows={4}
                    value={editingFatwa.answer?.en || ''}
                    onChange={(e) => setEditingFatwa({
                      ...editingFatwa,
                      answer: { ...editingFatwa.answer, ur: editingFatwa.answer?.ur || '', en: e.target.value }
                    })}
                    className="w-full px-3 py-2 bg-white dark:bg-slate-800 border border-stone-300 dark:border-slate-700 rounded-lg text-sm"
                  />
                </div>
              </div>

              {/* Arabic Translation Fields */}
              <div className="space-y-3 bg-emerald-50/40 dark:bg-emerald-950/20 p-4 rounded-xl border border-emerald-200 dark:border-emerald-900/30" dir="rtl">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-emerald-800 dark:text-emerald-300">الترجمة العربية المعتمدة</span>
                  <span className="text-[11px] text-stone-500">النص العربي</span>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-600 dark:text-stone-300 mb-1">عنوان الفتوى (عربي):</label>
                  <input 
                    type="text"
                    value={editingFatwa.title?.ar || ''}
                    onChange={(e) => setEditingFatwa({
                      ...editingFatwa,
                      title: { ...editingFatwa.title, ur: editingFatwa.title?.ur || '', ar: e.target.value }
                    })}
                    className="w-full px-3 py-2 bg-white dark:bg-slate-800 border border-stone-300 dark:border-slate-700 rounded-lg text-sm font-naskh"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-600 dark:text-stone-300 mb-1">نص الجواب الشرعي (عربي):</label>
                  <textarea 
                    rows={4}
                    value={editingFatwa.answer?.ar || ''}
                    onChange={(e) => setEditingFatwa({
                      ...editingFatwa,
                      answer: { ...editingFatwa.answer, ur: editingFatwa.answer?.ur || '', ar: e.target.value }
                    })}
                    className="w-full px-3 py-2 bg-white dark:bg-slate-800 border border-stone-300 dark:border-slate-700 rounded-lg text-sm font-naskh"
                  />
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 border-t border-stone-200 dark:border-slate-800 pt-3">
              <button
                onClick={() => setEditingFatwa(null)}
                className="px-4 py-2 bg-stone-100 dark:bg-slate-800 text-stone-700 dark:text-stone-300 rounded-lg font-bold text-sm cursor-pointer"
              >
                منسوخ
              </button>
              <button
                onClick={handleSaveFatwaEdits}
                className="px-6 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-bold text-sm flex items-center gap-2 cursor-pointer shadow-md"
              >
                <Save className="w-4 h-4" />
                <span>محفوظ اور منظور کریں</span>
              </button>
            </div>

          </div>
        </div>
      )}

      {/* NEWS EDIT & APPROVAL MODAL */}
      {editingNews && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5 overflow-y-auto">
          <div className="bg-white dark:bg-slate-900 border border-stone-300 dark:border-slate-700 rounded-2xl w-full max-w-3xl p-5 sm:p-6 shadow-2xl space-y-4 my-8">
            <div className="flex items-center justify-between border-b border-stone-200 dark:border-slate-800 pb-3">
              <h3 className="text-lg font-bold font-nastaliq">مضمون/خبر کے ترجمہ کی تصدیق</h3>
              <button onClick={() => setEditingNews(null)} className="p-1 text-stone-400">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold mb-1">English Title:</label>
                <input 
                  type="text"
                  value={editingNews.title?.en || ''}
                  onChange={(e) => setEditingNews({
                    ...editingNews,
                    title: { ...editingNews.title, ur: editingNews.title?.ur || '', en: e.target.value }
                  })}
                  className="w-full px-3 py-2 bg-white dark:bg-slate-800 border rounded-lg text-sm"
                  dir="ltr"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold mb-1">English Content:</label>
                <textarea 
                  rows={4}
                  value={editingNews.content?.en || ''}
                  onChange={(e) => setEditingNews({
                    ...editingNews,
                    content: { ...editingNews.content, ur: editingNews.content?.ur || '', en: e.target.value }
                  })}
                  className="w-full px-3 py-2 bg-white dark:bg-slate-800 border rounded-lg text-sm"
                  dir="ltr"
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-3 border-t">
              <button onClick={() => setEditingNews(null)} className="px-4 py-2 bg-stone-100 rounded-lg text-sm">منسوخ</button>
              <button onClick={handleSaveNewsEdits} className="px-6 py-2 bg-emerald-600 text-white rounded-lg text-sm font-bold">محفوظ و منظور کریں</button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
