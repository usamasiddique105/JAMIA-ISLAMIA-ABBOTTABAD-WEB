import React, { useState, useEffect } from 'react';
import { CmsPage, CmsPageStatus, CmsPageVisibility } from '../../../types';
import { cmsApiService } from '../../../services/cmsApiService';
import { 
  FileText, 
  Plus, 
  Search, 
  Edit3, 
  Trash2, 
  Eye, 
  Globe, 
  Save, 
  X, 
  CheckCircle, 
  AlertCircle, 
  Loader2, 
  Clock, 
  Lock, 
  Layers, 
  Sparkles, 
  ArrowRight,
  ExternalLink,
  Image as ImageIcon,
  History,
  FileCode,
  Layout
} from 'lucide-react';

interface CmsPagesManagerProps {
  onSelectMediaPicker?: (onSelect: (url: string) => void) => void;
}

export const CmsPagesManager: React.FC<CmsPagesManagerProps> = () => {
  const [pages, setPages] = useState<CmsPage[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [errorMsg, setErrorMsg] = useState<string>('');
  const [successMsg, setSuccessMsg] = useState<string>('');

  // Filters & Search
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<'all' | CmsPageStatus>('all');
  const [visibilityFilter, setVisibilityFilter] = useState<'all' | CmsPageVisibility>('all');

  // Editor Modal State
  const [isEditorOpen, setIsEditorOpen] = useState<boolean>(false);
  const [editingPageId, setEditingPageId] = useState<string | null>(null);
  const [editorLang, setEditorLang] = useState<'ur' | 'ar' | 'en'>('ur');
  const [isPreviewActive, setIsPreviewActive] = useState<boolean>(false);
  const [isSaving, setIsSaving] = useState<boolean>(false);

  // Form Fields
  const [slug, setSlug] = useState<string>('');
  const [titleUr, setTitleUr] = useState<string>('');
  const [titleAr, setTitleAr] = useState<string>('');
  const [titleEn, setTitleEn] = useState<string>('');
  
  const [excerptUr, setExcerptUr] = useState<string>('');
  const [excerptAr, setExcerptAr] = useState<string>('');
  const [excerptEn, setExcerptEn] = useState<string>('');

  const [contentUr, setContentUr] = useState<string>('');
  const [contentAr, setContentAr] = useState<string>('');
  const [contentEn, setContentEn] = useState<string>('');

  const [featuredImage, setFeaturedImage] = useState<string>('');
  const [status, setStatus] = useState<CmsPageStatus>('published');
  const [visibility, setVisibility] = useState<CmsPageVisibility>('public');
  const [password, setPassword] = useState<string>('');
  const [template, setTemplate] = useState<'default' | 'full_width' | 'contact' | 'landing'>('default');
  const [orderIndex, setOrderIndex] = useState<number>(0);
  const [author, setAuthor] = useState<string>('جامعہ انتظامیہ');

  // SEO Fields
  const [seoTitleUr, setSeoTitleUr] = useState<string>('');
  const [seoTitleAr, setSeoTitleAr] = useState<string>('');
  const [seoTitleEn, setSeoTitleEn] = useState<string>('');
  const [seoDescUr, setSeoDescUr] = useState<string>('');
  const [seoDescAr, setSeoDescAr] = useState<string>('');
  const [seoDescEn, setSeoDescEn] = useState<string>('');
  const [ogImage, setOgImage] = useState<string>('');

  // Delete Confirmation Modal
  const [deletingPage, setDeletingPage] = useState<CmsPage | null>(null);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);

  // Load pages from backend
  const loadPages = async () => {
    setIsLoading(true);
    setErrorMsg('');
    try {
      const data = await cmsApiService.getPages();
      setPages(data);
    } catch (err: any) {
      setErrorMsg(err?.message || 'صفحات لوڈ کرنے میں خرابی پیش آئی۔');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadPages();
  }, []);

  const openNewPageEditor = () => {
    setEditingPageId(null);
    setSlug('');
    setTitleUr('');
    setTitleAr('');
    setTitleEn('');
    setExcerptUr('');
    setExcerptAr('');
    setExcerptEn('');
    setContentUr('');
    setContentAr('');
    setContentEn('');
    setFeaturedImage('');
    setStatus('published');
    setVisibility('public');
    setPassword('');
    setTemplate('default');
    setOrderIndex(pages.length + 1);
    setAuthor('جامعہ انتظامیہ');
    setSeoTitleUr('');
    setSeoTitleAr('');
    setSeoTitleEn('');
    setSeoDescUr('');
    setSeoDescAr('');
    setSeoDescEn('');
    setOgImage('');
    setEditorLang('ur');
    setIsPreviewActive(false);
    setIsEditorOpen(true);
  };

  const openEditPage = (page: CmsPage) => {
    setEditingPageId(page.id);
    setSlug(page.slug);
    setTitleUr(page.title.ur || '');
    setTitleAr(page.title.ar || '');
    setTitleEn(page.title.en || '');
    setExcerptUr(page.excerpt?.ur || '');
    setExcerptAr(page.excerpt?.ar || '');
    setExcerptEn(page.excerpt?.en || '');
    setContentUr(page.content.ur || '');
    setContentAr(page.content.ar || '');
    setContentEn(page.content.en || '');
    setFeaturedImage(page.featuredImage || '');
    setStatus(page.status);
    setVisibility(page.visibility);
    setPassword(page.password || '');
    setTemplate(page.template || 'default');
    setOrderIndex(page.orderIndex ?? 0);
    setAuthor(page.author || 'جامعہ انتظامیہ');
    setSeoTitleUr(page.seoTitle?.ur || '');
    setSeoTitleAr(page.seoTitle?.ar || '');
    setSeoTitleEn(page.seoTitle?.en || '');
    setSeoDescUr(page.seoDescription?.ur || '');
    setSeoDescAr(page.seoDescription?.ar || '');
    setSeoDescEn(page.seoDescription?.en || '');
    setOgImage(page.ogImage || '');
    setEditorLang('ur');
    setIsPreviewActive(false);
    setIsEditorOpen(true);
  };

  // Helper to generate slug from title
  const handleAutoSlug = () => {
    const raw = (titleEn || titleUr).trim();
    if (!raw) return;
    const generated = raw
      .toLowerCase()
      .replace(/[^a-z0-9\u0600-\u06FF\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .slice(0, 80);
    setSlug(generated);
  };

  const handleSavePage = async (publishStatus?: CmsPageStatus) => {
    if (!titleUr.trim() && !titleEn.trim()) {
      setErrorMsg('صفحہ کا اردو یا انگریزی عنوان درج کرنا لازمی ہے۔');
      return;
    }

    const finalSlug = (slug || titleEn || titleUr)
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9\u0600-\u06FF\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .slice(0, 80) || `page-${Date.now()}`;

    const effectiveStatus = publishStatus || status;

    setIsSaving(true);
    setErrorMsg('');
    setSuccessMsg('');

    const pagePayload: Partial<CmsPage> = {
      id: editingPageId || `page-${Date.now()}`,
      slug: finalSlug,
      title: {
        ur: titleUr.trim(),
        ar: titleAr.trim() || titleUr.trim(),
        en: titleEn.trim() || titleUr.trim()
      },
      excerpt: {
        ur: excerptUr.trim(),
        ar: excerptAr.trim(),
        en: excerptEn.trim()
      },
      content: {
        ur: contentUr.trim(),
        ar: contentAr.trim(),
        en: contentEn.trim()
      },
      featuredImage: featuredImage.trim() || undefined,
      status: effectiveStatus,
      visibility,
      password: visibility === 'password_protected' ? password : undefined,
      template,
      orderIndex: Number(orderIndex) || 0,
      author: author.trim() || 'جامعہ انتظامیہ',
      seoTitle: {
        ur: seoTitleUr.trim() || titleUr.trim(),
        ar: seoTitleAr.trim() || titleAr.trim(),
        en: seoTitleEn.trim() || titleEn.trim()
      },
      seoDescription: {
        ur: seoDescUr.trim() || excerptUr.trim(),
        ar: seoDescAr.trim() || excerptAr.trim(),
        en: seoDescEn.trim() || excerptEn.trim()
      },
      ogImage: ogImage.trim() || featuredImage.trim() || undefined,
      updatedAt: new Date().toISOString()
    };

    try {
      const res = await cmsApiService.savePage(pagePayload);
      if (res && res.success) {
        // Automatically log revision history record
        const pageId = res.id || editingPageId || pagePayload.id || '';
        if (pageId) {
          cmsApiService.createRevision({
            entityType: 'page',
            entityId: pageId,
            dataJson: JSON.stringify(pagePayload),
            revisionNote: editingPageId ? `صفحہ تدوین شدہ (${effectiveStatus})` : `نیا صفحہ تخلیق شدہ (${effectiveStatus})`,
            author: author.trim() || 'جامعہ ایڈمن'
          }).catch(() => {});
        }

        setSuccessMsg(editingPageId ? 'صفحہ کامیابی سے اپ ڈیٹ ہو گیا!' : 'نیا صفحہ کامیابی سے شامل ہو گیا!');
        setIsEditorOpen(false);
        await loadPages();
        setTimeout(() => setSuccessMsg(''), 4000);
      } else {
        setErrorMsg(res?.error || 'صفحہ محفوظ کرنے میں خرابی پیش آئی۔');
      }
    } catch (err: any) {
      setErrorMsg(err?.message || 'صفحہ محفوظ کرنے میں خرابی پیش آئی۔');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeletePage = async () => {
    if (!deletingPage) return;
    setIsDeleting(true);
    try {
      const res = await cmsApiService.deletePage(deletingPage.id);
      if (res && res.success) {
        setSuccessMsg(`صفحہ "${deletingPage.title.ur || deletingPage.slug}" حذف ہو گیا۔`);
        setDeletingPage(null);
        await loadPages();
        setTimeout(() => setSuccessMsg(''), 4000);
      } else {
        setErrorMsg(res?.error || 'صفحہ حذف کرنے میں خرابی پیش آئی۔');
      }
    } catch (err: any) {
      setErrorMsg(err?.message || 'صفحہ حذف کرنے میں خرابی پیش آئی۔');
    } finally {
      setIsDeleting(false);
    }
  };

  // Filtered pages list
  const filteredPages = pages.filter(p => {
    if (statusFilter !== 'all' && p.status !== statusFilter) return false;
    if (visibilityFilter !== 'all' && p.visibility !== visibilityFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchUr = p.title.ur?.toLowerCase().includes(q);
      const matchEn = p.title.en?.toLowerCase().includes(q);
      const matchAr = p.title.ar?.toLowerCase().includes(q);
      const matchSlug = p.slug?.toLowerCase().includes(q);
      if (!matchUr && !matchEn && !matchAr && !matchSlug) return false;
    }
    return true;
  });

  return (
    <div className="space-y-6 font-urdu" dir="rtl">
      {/* Top Header Card */}
      <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-stone-200 dark:border-slate-800 shadow-sm flex flex-wrap items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300">
              <FileText className="w-5 h-5" />
            </div>
            <h2 className="text-xl font-black text-stone-900 dark:text-white">
              صفحات کا انتظام (Pages Management)
            </h2>
            <span className="px-2.5 py-0.5 rounded-full bg-amber-500/10 text-amber-700 dark:text-amber-300 text-xs font-bold border border-amber-500/20 font-sans">
              {pages.length} Pages
            </span>
          </div>
          <p className="text-xs text-stone-500 dark:text-stone-400">
            جامعہ کی ویب سائٹ کے مستقل معلوماتی صفحات (تعارف، داخلہ رہنمائی، قوانین وغیرہ) کا تینوں زبانوں میں مکمل نظم و ضبط۔
          </p>
        </div>

        <button
          onClick={openNewPageEditor}
          className="px-5 py-2.5 bg-[#5C4632] hover:bg-[#433123] text-amber-300 font-bold text-xs rounded-xl shadow-md border border-[#B88A3B] flex items-center gap-2 cursor-pointer transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>نیا صفحہ شامل کریں (Add New Page)</span>
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

      {/* Search & Filters Bar */}
      <div className="bg-stone-50 dark:bg-slate-900/60 p-4 rounded-2xl border border-stone-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3">
        <div className="flex-1 min-w-[240px] relative">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="صفحہ کے عنوان یا یو آر ایل (Slug) سے تلاش کریں..."
            className="w-full pl-4 pr-10 py-2 rounded-xl border border-stone-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-stone-900 dark:text-white text-xs focus:outline-hidden focus:border-[#B88A3B]"
          />
          <Search className="w-4 h-4 text-stone-400 absolute right-3 top-2.5" />
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as any)}
            className="px-3 py-2 rounded-xl border border-stone-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-stone-800 dark:text-stone-200 text-xs font-bold focus:outline-hidden"
          >
            <option value="all">تمام اسٹیٹس (All Statuses)</option>
            <option value="published">شائع شدہ (Published)</option>
            <option value="draft">ڈرافٹ (Draft)</option>
            <option value="archived">آرکائیو (Archived)</option>
          </select>

          <select
            value={visibilityFilter}
            onChange={(e) => setVisibilityFilter(e.target.value as any)}
            className="px-3 py-2 rounded-xl border border-stone-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-stone-800 dark:text-stone-200 text-xs font-bold focus:outline-hidden"
          >
            <option value="all">تمام رسائی (All Visibility)</option>
            <option value="public">عوامی (Public)</option>
            <option value="private">خفیہ/نجی (Private)</option>
            <option value="password">پاس ورڈ محفوظ (Password)</option>
          </select>

          {(searchQuery || statusFilter !== 'all' || visibilityFilter !== 'all') && (
            <button
              onClick={() => {
                setSearchQuery('');
                setStatusFilter('all');
                setVisibilityFilter('all');
              }}
              className="px-3 py-2 text-xs text-stone-500 hover:text-stone-900 dark:hover:text-white font-bold cursor-pointer"
            >
              فلٹرز ری سیٹ کریں ✕
            </button>
          )}
        </div>
      </div>

      {/* Pages Table */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-stone-200 dark:border-slate-800 shadow-sm overflow-hidden">
        {isLoading ? (
          <div className="py-20 flex flex-col items-center justify-center gap-3 text-stone-400">
            <Loader2 className="w-8 h-8 animate-spin text-[#B88A3B]" />
            <span className="text-xs font-bold">صفحات کا ریکارڈ لوڈ ہو رہا ہے...</span>
          </div>
        ) : filteredPages.length === 0 ? (
          <div className="py-16 text-center text-stone-400 space-y-2">
            <FileText className="w-10 h-10 mx-auto opacity-40 text-[#B88A3B]" />
            <p className="text-sm font-bold text-stone-700 dark:text-stone-300">کوئی صفحہ نہیں ملا۔</p>
            <p className="text-xs text-stone-400">نیا صفحہ شامل کرنے کے لیے اوپر دیے گئے بٹن پر کلک کریں۔</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-right text-xs">
              <thead className="bg-stone-100 dark:bg-slate-800/80 text-stone-700 dark:text-stone-300 font-bold border-b border-stone-200 dark:border-slate-800">
                <tr>
                  <th className="p-3.5 w-12 text-center">ترتیب</th>
                  <th className="p-3.5">عنوانِ صفحہ (Title)</th>
                  <th className="p-3.5">یو آر ایل / سلگ (Slug)</th>
                  <th className="p-3.5 text-center">اسٹیٹس</th>
                  <th className="p-3.5 text-center">رسائی</th>
                  <th className="p-3.5">ٹیمپلیٹ</th>
                  <th className="p-3.5">آخری ترمیم</th>
                  <th className="p-3.5 text-center w-28">اقدامات</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100 dark:divide-slate-800">
                {filteredPages.map((page) => (
                  <tr key={page.id} className="hover:bg-stone-50/70 dark:hover:bg-slate-800/40 transition-colors">
                    <td className="p-3.5 text-center font-mono text-stone-400 font-bold">
                      {page.orderIndex ?? 0}
                    </td>
                    <td className="p-3.5">
                      <div className="space-y-0.5">
                        <span className="font-black text-sm text-stone-900 dark:text-white block hover:text-[#B88A3B] transition-colors cursor-pointer" onClick={() => openEditPage(page)}>
                          {page.title.ur || page.title.en || 'بے عنوان'}
                        </span>
                        {page.title.en && (
                          <span className="text-[11px] text-stone-500 font-sans block" dir="ltr">
                            {page.title.en}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="p-3.5">
                      <span className="font-mono text-[11px] px-2 py-0.5 rounded-md bg-stone-100 dark:bg-slate-800 text-stone-700 dark:text-stone-300 border border-stone-200 dark:border-slate-700" dir="ltr">
                        /{page.slug}
                      </span>
                    </td>
                    <td className="p-3.5 text-center">
                      <span className={`inline-block px-2.5 py-1 rounded-full text-[10px] font-bold ${
                        page.status === 'published' 
                          ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800' 
                          : 'bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-800'
                      }`}>
                        {page.status === 'published' ? 'شائع شدہ' : 'ڈرافٹ'}
                      </span>
                    </td>
                    <td className="p-3.5 text-center">
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold ${
                        page.visibility === 'public'
                          ? 'text-stone-600 dark:text-stone-400'
                          : page.visibility === 'password_protected'
                          ? 'bg-purple-100 dark:bg-purple-950 text-purple-800 dark:text-purple-300'
                          : 'bg-stone-200 dark:bg-slate-700 text-stone-800 dark:text-stone-200'
                      }`}>
                        {page.visibility === 'password_protected' && <Lock className="w-3 h-3" />}
                        <span>{page.visibility === 'public' ? 'عوامی' : page.visibility === 'password_protected' ? 'پاس ورڈ' : 'خفیہ'}</span>
                      </span>
                    </td>
                    <td className="p-3.5">
                      <span className="text-[11px] text-stone-600 dark:text-stone-400 font-sans">
                        {page.template === 'full_width' ? 'Full Width' : page.template === 'contact' ? 'Contact Form' : page.template === 'landing' ? 'Landing Page' : 'Default'}
                      </span>
                    </td>
                    <td className="p-3.5 font-mono text-[11px] text-stone-500" dir="ltr">
                      {page.updatedAt ? new Date(page.updatedAt).toLocaleDateString() : '—'}
                    </td>
                    <td className="p-3.5 text-center">
                      <div className="flex items-center justify-center gap-1.5">
                        <button
                          onClick={() => openEditPage(page)}
                          className="p-1.5 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950/50 rounded-lg transition-colors cursor-pointer"
                          title="ترمیم کریں (Edit)"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setDeletingPage(page)}
                          className="p-1.5 text-red-600 hover:bg-red-50 dark:hover:bg-red-950/50 rounded-lg transition-colors cursor-pointer"
                          title="حذف کریں (Delete)"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Page Editor Modal */}
      {isEditorOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
          <div className="bg-white dark:bg-slate-900 w-full max-w-5xl rounded-3xl border border-stone-200 dark:border-slate-800 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            
            {/* Modal Header */}
            <div className="bg-stone-900 text-white px-6 py-4 flex items-center justify-between border-b border-stone-800">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-[#5C4632] flex items-center justify-center text-amber-300 border border-[#B88A3B]">
                  <Edit3 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-base text-white">
                    {editingPageId ? 'صفحہ میں ترمیم (Edit Page)' : 'نیا صفحہ تحریر کریں (Add New Page)'}
                  </h3>
                  <p className="text-[11px] text-stone-400 font-sans">
                    Jamia Islamia Abbottabad — Professional Multi-Lingual Page Editor
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setIsEditorOpen(false)}
                  className="p-2 text-stone-400 hover:text-white rounded-xl hover:bg-stone-800 transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Modal Body: Editor Grid */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              
              {/* Language Switcher Bar */}
              <div className="flex items-center justify-between border-b border-stone-200 dark:border-slate-800 pb-3">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-stone-500">زبان منتخب کریں:</span>
                  {(['ur', 'ar', 'en'] as const).map((lang) => (
                    <button
                      key={lang}
                      type="button"
                      onClick={() => setEditorLang(lang)}
                      className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                        editorLang === lang
                          ? 'bg-[#5C4632] text-amber-300 shadow-sm border border-[#B88A3B]'
                          : 'bg-stone-100 dark:bg-slate-800 text-stone-700 dark:text-stone-300 hover:bg-stone-200'
                      }`}
                    >
                      {lang === 'ur' ? 'اردو (Urdu)' : lang === 'ar' ? 'العربية (Arabic)' : 'English'}
                    </button>
                  ))}
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setIsPreviewActive(!isPreviewActive)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                      isPreviewActive
                        ? 'bg-blue-600 text-white shadow-sm'
                        : 'bg-stone-100 dark:bg-slate-800 text-stone-700 dark:text-stone-300 hover:bg-stone-200'
                    }`}
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>{isPreviewActive ? 'ایڈیٹر موڈ' : 'پیش نظارہ (Preview)'}</span>
                  </button>
                </div>
              </div>

              {/* Main 2-Column Content Layout: Left Content, Right Settings */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                
                {/* Left Column: Title & Content (8 Cols) */}
                <div className="lg:col-span-8 space-y-4">
                  
                  {/* Title Field */}
                  <div>
                    <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-1.5">
                      صفحہ کا عنوان ({editorLang === 'ur' ? 'اردو' : editorLang === 'ar' ? 'العربية' : 'English'}) <span className="text-red-500">*</span>
                    </label>
                    {editorLang === 'ur' && (
                      <input
                        type="text"
                        value={titleUr}
                        onChange={(e) => setTitleUr(e.target.value)}
                        placeholder="مثلاً: جامعہ اسلامیہ ایبٹ آباد کا تعارف و تاریخ"
                        className="w-full px-4 py-2.5 rounded-xl border border-stone-300 dark:border-slate-700 bg-stone-50 dark:bg-slate-800 text-stone-900 dark:text-white text-sm font-bold focus:outline-hidden focus:border-[#B88A3B]"
                        dir="rtl"
                      />
                    )}
                    {editorLang === 'ar' && (
                      <input
                        type="text"
                        value={titleAr}
                        onChange={(e) => setTitleAr(e.target.value)}
                        placeholder="مثال: نبذة عن الجامعة الإسلامية أبيت آباد"
                        className="w-full px-4 py-2.5 rounded-xl border border-stone-300 dark:border-slate-700 bg-stone-50 dark:bg-slate-800 text-stone-900 dark:text-white text-sm font-bold focus:outline-hidden focus:border-[#B88A3B]"
                        dir="rtl"
                      />
                    )}
                    {editorLang === 'en' && (
                      <input
                        type="text"
                        value={titleEn}
                        onChange={(e) => setTitleEn(e.target.value)}
                        placeholder="e.g. About Jamia Islamia Abbottabad — History & Highlights"
                        className="w-full px-4 py-2.5 rounded-xl border border-stone-300 dark:border-slate-700 bg-stone-50 dark:bg-slate-800 text-stone-900 dark:text-white text-sm font-sans focus:outline-hidden focus:border-[#B88A3B]"
                        dir="ltr"
                      />
                    )}
                  </div>

                  {/* Permalink / Slug Field */}
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="text-xs font-bold text-stone-700 dark:text-stone-300">
                        مستقل لنک (Permalink / Slug)
                      </label>
                      <button
                        type="button"
                        onClick={handleAutoSlug}
                        className="text-[11px] text-[#B88A3B] hover:underline font-bold cursor-pointer"
                      >
                        عنوان سے خودکار بنائیں ⚡
                      </button>
                    </div>
                    <div className="flex items-center rounded-xl border border-stone-300 dark:border-slate-700 bg-stone-50 dark:bg-slate-800 overflow-hidden text-xs" dir="ltr">
                      <span className="px-3 py-2 bg-stone-200 dark:bg-slate-700 text-stone-600 dark:text-stone-300 font-mono">
                        https://jamiaislamia.edu.pk/
                      </span>
                      <input
                        type="text"
                        value={slug}
                        onChange={(e) => setSlug(e.target.value)}
                        placeholder="about-jamia"
                        className="flex-1 px-3 py-2 bg-transparent text-stone-900 dark:text-white font-mono focus:outline-hidden"
                      />
                    </div>
                  </div>

                  {/* Excerpt Field */}
                  <div>
                    <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-1.5">
                      مختصر خلاصہ (Excerpt / Short Summary)
                    </label>
                    {editorLang === 'ur' && (
                      <textarea
                        rows={2}
                        value={excerptUr}
                        onChange={(e) => setExcerptUr(e.target.value)}
                        placeholder="صفحہ کا دو سطری مختصر تعارف جو سرچ رزلٹس اور کارڈز میں نظر آئے گا..."
                        className="w-full px-4 py-2.5 rounded-xl border border-stone-300 dark:border-slate-700 bg-stone-50 dark:bg-slate-800 text-stone-900 dark:text-white text-xs focus:outline-hidden focus:border-[#B88A3B]"
                        dir="rtl"
                      />
                    )}
                    {editorLang === 'ar' && (
                      <textarea
                        rows={2}
                        value={excerptAr}
                        onChange={(e) => setExcerptAr(e.target.value)}
                        placeholder="موجز قصير عن محتوى هذه الصفحة..."
                        className="w-full px-4 py-2.5 rounded-xl border border-stone-300 dark:border-slate-700 bg-stone-50 dark:bg-slate-800 text-stone-900 dark:text-white text-xs focus:outline-hidden focus:border-[#B88A3B]"
                        dir="rtl"
                      />
                    )}
                    {editorLang === 'en' && (
                      <textarea
                        rows={2}
                        value={excerptEn}
                        onChange={(e) => setExcerptEn(e.target.value)}
                        placeholder="Short summary of this page for search results and previews..."
                        className="w-full px-4 py-2.5 rounded-xl border border-stone-300 dark:border-slate-700 bg-stone-50 dark:bg-slate-800 text-stone-900 dark:text-white text-xs font-sans focus:outline-hidden focus:border-[#B88A3B]"
                        dir="ltr"
                      />
                    )}
                  </div>

                  {/* Main Content Area */}
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="text-xs font-bold text-stone-700 dark:text-stone-300">
                        صفحہ کا تفصیلی متن (Page Content / Body)
                      </label>
                      <span className="text-[11px] text-stone-400">
                        Markdown فارمیٹنگ کی مکمل سہولت موجود ہے۔
                      </span>
                    </div>

                    {isPreviewActive ? (
                      <div className="p-5 rounded-xl border border-stone-300 dark:border-slate-700 bg-stone-50 dark:bg-slate-950 min-h-[320px] text-stone-900 dark:text-stone-100 text-sm leading-loose whitespace-pre-wrap">
                        {editorLang === 'ur' ? (contentUr || 'اردو میں کوئی متن درج نہیں کیا گیا۔') : editorLang === 'ar' ? (contentAr || 'لا يوجد محتوى عربي.') : (contentEn || 'No English content entered.')}
                      </div>
                    ) : (
                      <>
                        {editorLang === 'ur' && (
                          <textarea
                            rows={12}
                            value={contentUr}
                            onChange={(e) => setContentUr(e.target.value)}
                            placeholder="جامعہ اسلامیہ کے بارے میں تفصیلی مواد، سرخیاں (###) اور پیراگراف درج کریں..."
                            className="w-full p-4 rounded-xl border border-stone-300 dark:border-slate-700 bg-stone-50 dark:bg-slate-800 text-stone-900 dark:text-white text-sm focus:outline-hidden focus:border-[#B88A3B] leading-loose font-urdu"
                            dir="rtl"
                          />
                        )}
                        {editorLang === 'ar' && (
                          <textarea
                            rows={12}
                            value={contentAr}
                            onChange={(e) => setContentAr(e.target.value)}
                            placeholder="اكتب المحتوى الكامل باللغة العربية مع العناوين والفقرات..."
                            className="w-full p-4 rounded-xl border border-stone-300 dark:border-slate-700 bg-stone-50 dark:bg-slate-800 text-stone-900 dark:text-white text-sm focus:outline-hidden focus:border-[#B88A3B] leading-relaxed font-arabic"
                            dir="rtl"
                          />
                        )}
                        {editorLang === 'en' && (
                          <textarea
                            rows={12}
                            value={contentEn}
                            onChange={(e) => setContentEn(e.target.value)}
                            placeholder="Write complete English content with Markdown headings (###) and paragraphs..."
                            className="w-full p-4 rounded-xl border border-stone-300 dark:border-slate-700 bg-stone-50 dark:bg-slate-800 text-stone-900 dark:text-white text-sm font-sans focus:outline-hidden focus:border-[#B88A3B] leading-relaxed"
                            dir="ltr"
                          />
                        )}
                      </>
                    )}
                  </div>
                </div>

                {/* Right Column: Page Attributes & SEO (4 Cols) */}
                <div className="lg:col-span-4 space-y-4">
                  
                  {/* Publish Box */}
                  <div className="p-4 rounded-2xl bg-stone-50 dark:bg-slate-800/80 border border-stone-200 dark:border-slate-700 space-y-3">
                    <h4 className="font-bold text-xs text-stone-900 dark:text-white flex items-center gap-1.5 border-b border-stone-200 dark:border-slate-700 pb-2">
                      <Clock className="w-3.5 h-3.5 text-[#B88A3B]" />
                      <span>اشاعت و اسٹیٹس (Publish Status)</span>
                    </h4>

                    <div className="space-y-2">
                      <div>
                        <label className="block text-[11px] font-bold text-stone-600 dark:text-stone-300 mb-1">
                          حالت (Status)
                        </label>
                        <select
                          value={status}
                          onChange={(e) => setStatus(e.target.value as any)}
                          className="w-full px-3 py-2 rounded-xl border border-stone-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-bold text-stone-800 dark:text-stone-200"
                        >
                          <option value="published">شائع شدہ (Published)</option>
                          <option value="draft">ڈرافٹ / مسودہ (Draft)</option>
                          <option value="archived">آرکائیو (Archived)</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-[11px] font-bold text-stone-600 dark:text-stone-300 mb-1">
                          رسائی (Visibility)
                        </label>
                        <select
                          value={visibility}
                          onChange={(e) => setVisibility(e.target.value as any)}
                          className="w-full px-3 py-2 rounded-xl border border-stone-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-bold text-stone-800 dark:text-stone-200"
                        >
                          <option value="public">عوامی (Public - سب کے لیے)</option>
                          <option value="private">صرف ایڈمن (Private)</option>
                          <option value="password_protected">پاس ورڈ محفوظ (Password Protected)</option>
                        </select>
                      </div>

                      {visibility === 'password_protected' && (
                        <div>
                          <label className="block text-[11px] font-bold text-stone-600 dark:text-stone-300 mb-1">
                            صفحہ پاس ورڈ (Page Password)
                          </label>
                          <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="پاس ورڈ درج کریں"
                            className="w-full px-3 py-2 rounded-xl border border-stone-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs text-stone-900 dark:text-white font-sans"
                            dir="ltr"
                          />
                        </div>
                      )}

                      <div>
                        <label className="block text-[11px] font-bold text-stone-600 dark:text-stone-300 mb-1">
                          ٹیمپلیٹ (Page Template)
                        </label>
                        <select
                          value={template}
                          onChange={(e) => setTemplate(e.target.value as any)}
                          className="w-full px-3 py-2 rounded-xl border border-stone-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-bold text-stone-800 dark:text-stone-200"
                        >
                          <option value="default">معیاری ٹیمپلیٹ (Default Layout)</option>
                          <option value="full_width">فل چوڑائی (Full Width Layout)</option>
                          <option value="contact">رابطہ فارم کے ساتھ (Contact Form)</option>
                          <option value="landing">خصوصی لینڈنگ پیج (Landing Page)</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-[11px] font-bold text-stone-600 dark:text-stone-300 mb-1">
                          ترتیب کا نمبر (Order Index)
                        </label>
                        <input
                          type="number"
                          value={orderIndex}
                          onChange={(e) => setOrderIndex(Number(e.target.value))}
                          className="w-full px-3 py-2 rounded-xl border border-stone-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs text-stone-900 dark:text-white font-mono"
                          dir="ltr"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Featured Image Box */}
                  <div className="p-4 rounded-2xl bg-stone-50 dark:bg-slate-800/80 border border-stone-200 dark:border-slate-700 space-y-3">
                    <h4 className="font-bold text-xs text-stone-900 dark:text-white flex items-center gap-1.5 border-b border-stone-200 dark:border-slate-700 pb-2">
                      <ImageIcon className="w-3.5 h-3.5 text-[#B88A3B]" />
                      <span>نمایاں تصویر (Featured Image)</span>
                    </h4>

                    <div className="space-y-2">
                      <input
                        type="text"
                        value={featuredImage}
                        onChange={(e) => setFeaturedImage(e.target.value)}
                        placeholder="https://images.unsplash.com/..."
                        className="w-full px-3 py-2 rounded-xl border border-stone-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-mono text-stone-900 dark:text-white"
                        dir="ltr"
                      />
                      {featuredImage && (
                        <div className="relative rounded-xl overflow-hidden border border-stone-300 dark:border-slate-700 h-28 bg-stone-200">
                          <img
                            src={featuredImage}
                            alt="Featured"
                            className="w-full h-full object-cover"
                            onError={(e) => { (e.target as any).src = 'https://images.unsplash.com/photo-1584551246679-0daf3d275d0f?auto=format&fit=crop&w=600&q=80'; }}
                          />
                          <button
                            type="button"
                            onClick={() => setFeaturedImage('')}
                            className="absolute top-2 left-2 p-1 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* SEO Box */}
                  <div className="p-4 rounded-2xl bg-stone-50 dark:bg-slate-800/80 border border-stone-200 dark:border-slate-700 space-y-3">
                    <h4 className="font-bold text-xs text-stone-900 dark:text-white flex items-center gap-1.5 border-b border-stone-200 dark:border-slate-700 pb-2">
                      <Globe className="w-3.5 h-3.5 text-[#B88A3B]" />
                      <span>ایس ای او ترتیبات (SEO Meta)</span>
                    </h4>

                    <div className="space-y-2">
                      <div>
                        <label className="block text-[11px] font-bold text-stone-600 dark:text-stone-300 mb-1">
                          SEO عنوان ({editorLang.toUpperCase()})
                        </label>
                        <input
                          type="text"
                          value={editorLang === 'ur' ? seoTitleUr : editorLang === 'ar' ? seoTitleAr : seoTitleEn}
                          onChange={(e) => {
                            if (editorLang === 'ur') setSeoTitleUr(e.target.value);
                            else if (editorLang === 'ar') setSeoTitleAr(e.target.value);
                            else setSeoTitleEn(e.target.value);
                          }}
                          placeholder="گوگل سرچ کے لیے عنوان..."
                          className="w-full px-3 py-2 rounded-xl border border-stone-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs text-stone-900 dark:text-white"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-bold text-stone-600 dark:text-stone-300 mb-1">
                          میٹا ڈسکرپشن (Meta Description)
                        </label>
                        <textarea
                          rows={2}
                          value={editorLang === 'ur' ? seoDescUr : editorLang === 'ar' ? seoDescAr : seoDescEn}
                          onChange={(e) => {
                            if (editorLang === 'ur') setSeoDescUr(e.target.value);
                            else if (editorLang === 'ar') setSeoDescAr(e.target.value);
                            else setSeoDescEn(e.target.value);
                          }}
                          placeholder="سرچ رزلٹس میں دکھائی دینے والی تفصیل..."
                          className="w-full px-3 py-2 rounded-xl border border-stone-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs text-stone-900 dark:text-white"
                        />
                      </div>
                    </div>
                  </div>

                </div>

              </div>

            </div>

            {/* Modal Footer Controls */}
            <div className="bg-stone-100 dark:bg-slate-800/90 px-6 py-4 border-t border-stone-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3">
              <button
                type="button"
                onClick={() => setIsEditorOpen(false)}
                className="px-4 py-2 rounded-xl border border-stone-300 dark:border-slate-700 text-stone-700 dark:text-stone-300 hover:bg-stone-200 dark:hover:bg-slate-700 text-xs font-bold transition-all cursor-pointer"
              >
                منسوخ کریں (Cancel)
              </button>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  disabled={isSaving}
                  onClick={() => handleSavePage('draft')}
                  className="px-4 py-2 rounded-xl border border-amber-400/50 bg-amber-500/10 text-amber-800 dark:text-amber-300 hover:bg-amber-500/20 text-xs font-bold transition-all cursor-pointer disabled:opacity-60"
                >
                  بطور ڈرافٹ محفوظ کریں (Save Draft)
                </button>

                <button
                  type="button"
                  disabled={isSaving}
                  onClick={() => handleSavePage('published')}
                  className="px-6 py-2 bg-[#5C4632] hover:bg-[#433123] text-amber-300 font-bold text-xs rounded-xl shadow-md border border-[#B88A3B] flex items-center gap-2 cursor-pointer transition-all disabled:opacity-60"
                >
                  {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                  <span>شائع / محفوظ کریں (Publish Page)</span>
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deletingPage && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 max-w-md w-full rounded-3xl p-6 border border-red-300 dark:border-red-900/60 shadow-2xl space-y-4 text-right">
            <div className="w-12 h-12 rounded-2xl bg-red-100 dark:bg-red-950/80 text-red-600 flex items-center justify-center mx-auto">
              <Trash2 className="w-6 h-6" />
            </div>
            
            <div className="text-center space-y-1">
              <h3 className="text-base font-black text-stone-900 dark:text-white">
                کیا آپ واقعی یہ صفحہ حذف کرنا چاہتے ہیں؟
              </h3>
              <p className="text-xs text-stone-500 dark:text-stone-400">
                صفحہ: <strong>"{deletingPage.title.ur || deletingPage.slug}"</strong>
              </p>
              <p className="text-[11px] text-red-600 font-bold mt-2">
                یہ عمل واپس نہیں لیا جا سکتا۔
              </p>
            </div>

            <div className="flex items-center gap-2 pt-2">
              <button
                type="button"
                onClick={() => setDeletingPage(null)}
                className="flex-1 py-2.5 rounded-xl border border-stone-300 dark:border-slate-700 text-stone-700 dark:text-stone-300 font-bold text-xs hover:bg-stone-100 transition-colors"
              >
                منسوخ کریں
              </button>
              <button
                type="button"
                disabled={isDeleting}
                onClick={handleDeletePage}
                className="flex-1 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs shadow-md transition-colors flex items-center justify-center gap-1.5 disabled:opacity-60"
              >
                {isDeleting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                <span>ہاں، حذف کریں</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
