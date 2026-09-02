import React, { useState, useEffect } from 'react';
import { CmsMedia } from '../../../types';
import { cmsApiService } from '../../../services/cmsApiService';
import { 
  Image as ImageIcon, 
  Upload, 
  Search, 
  Trash2, 
  Copy, 
  Check, 
  ExternalLink, 
  FileText, 
  Film, 
  Music, 
  Grid, 
  List, 
  X, 
  Loader2, 
  CheckCircle, 
  AlertCircle, 
  Info,
  Link as LinkIcon,
  Plus
} from 'lucide-react';

interface CmsMediaLibraryProps {
  onSelectMedia?: (mediaUrl: string) => void;
  isPickerMode?: boolean;
}

export const CmsMediaLibrary: React.FC<CmsMediaLibraryProps> = ({ onSelectMedia, isPickerMode = false }) => {
  const [mediaList, setMediaList] = useState<CmsMedia[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [typeFilter, setTypeFilter] = useState<'all' | 'image' | 'document' | 'audio' | 'video'>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  
  const [selectedMedia, setSelectedMedia] = useState<CmsMedia | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string>('');
  const [errorMsg, setErrorMsg] = useState<string>('');

  // Upload / Register Media State
  const [isUploadModalOpen, setIsUploadModalOpen] = useState<boolean>(false);
  const [uploadMode, setUploadMode] = useState<'url' | 'file'>('url');
  const [newTitle, setNewTitle] = useState<string>('');
  const [newUrl, setNewUrl] = useState<string>('');
  const [newAltText, setNewAltText] = useState<string>('');
  const [newCaption, setNewCaption] = useState<string>('');
  const [newMimeType, setNewMimeType] = useState<string>('image/jpeg');
  const [isUploading, setIsUploading] = useState<boolean>(false);

  // Load Media from backend
  const loadMedia = async () => {
    setIsLoading(true);
    setErrorMsg('');
    try {
      const data = await cmsApiService.getMedia();
      setMediaList(data);
    } catch (err: any) {
      setErrorMsg(err?.message || 'میڈیا فائلز لوڈ کرنے میں مسئلہ پیش آیا۔');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadMedia();
  }, []);

  const handleCopyUrl = (url: string, id: string) => {
    navigator.clipboard.writeText(url);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2500);
  };

  const handleFileDrop = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setNewTitle(file.name.replace(/\.[^/.]+$/, ''));
    setNewMimeType(file.type || 'image/jpeg');

    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      setNewUrl(result);
    };
    reader.readAsDataURL(file);
  };

  const handleSaveMedia = async () => {
    if (!newUrl.trim()) {
      alert('فائل کا URL یا ڈیٹا داخل کریں۔');
      return;
    }

    setIsUploading(true);
    setErrorMsg('');

    const fileName = newUrl.startsWith('data:') 
      ? `${newTitle.trim().replace(/\s+/g, '-').toLowerCase() || 'upload'}.${newMimeType.split('/')[1] || 'jpg'}`
      : newUrl.split('/').pop() || 'media-asset';

    const payload: Partial<CmsMedia> = {
      id: `media-${Date.now()}`,
      title: newTitle.trim() || fileName,
      filename: fileName,
      url: newUrl.trim(),
      mimeType: newMimeType,
      fileSize: 1024 * 128, // approx size representation
      altText: newAltText.trim() || newTitle.trim(),
      caption: newCaption.trim() || undefined,
      uploadedAt: new Date().toISOString()
    };

    try {
      const res = await cmsApiService.saveMedia(payload);
      if (res && res.success) {
        setSuccessMsg('نیا میڈیا آئٹم کامیابی سے شامل ہو گیا!');
        setIsUploadModalOpen(false);
        setNewTitle('');
        setNewUrl('');
        setNewAltText('');
        setNewCaption('');
        await loadMedia();
        setTimeout(() => setSuccessMsg(''), 4000);
      } else {
        setErrorMsg(res?.error || 'میڈیا شامل کرنے میں خرابی پیش آئی۔');
      }
    } catch (err: any) {
      setErrorMsg(err?.message || 'خرابی پیش آئی۔');
    } finally {
      setIsUploading(false);
    }
  };

  const handleDeleteMedia = async (id: string) => {
    if (!confirm('کیا آپ واقعی یہ فائل حذف کرنا چاہتے ہیں؟')) return;
    try {
      const res = await cmsApiService.deleteMedia(id);
      if (res && res.success) {
        setMediaList(prev => prev.filter(m => m.id !== id));
        if (selectedMedia?.id === id) setSelectedMedia(null);
        setSuccessMsg('میڈیا فائل کامیابی سے حذف کر دی گئی۔');
        setTimeout(() => setSuccessMsg(''), 4000);
      }
    } catch (err: any) {
      alert('حذف کرنے میں خرابی: ' + err?.message);
    }
  };

  const filteredMedia = mediaList.filter(m => {
    if (typeFilter !== 'all') {
      if (typeFilter === 'image' && !m.mimeType?.startsWith('image/')) return false;
      if (typeFilter === 'document' && !m.mimeType?.includes('pdf') && !m.mimeType?.includes('document')) return false;
      if (typeFilter === 'audio' && !m.mimeType?.startsWith('audio/')) return false;
      if (typeFilter === 'video' && !m.mimeType?.startsWith('video/')) return false;
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = m.title?.toLowerCase().includes(q);
      const matchFile = m.filename?.toLowerCase().includes(q);
      const matchAlt = m.altText?.toLowerCase().includes(q);
      if (!matchTitle && !matchFile && !matchAlt) return false;
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
              <ImageIcon className="w-5 h-5" />
            </div>
            <h2 className="text-xl font-black text-stone-900 dark:text-white">
              میڈیا لائبریری (Media Library)
            </h2>
            <span className="px-2.5 py-0.5 rounded-full bg-amber-500/10 text-amber-700 dark:text-amber-300 text-xs font-bold border border-amber-500/20 font-sans">
              {mediaList.length} Files
            </span>
          </div>
          <p className="text-xs text-stone-500 dark:text-stone-400">
            تصاویر، دستاویزات، کتابوں کے سرورق اور جامعہ کے آفیشل لوگوز کا مرکزی ذخیرہ۔
          </p>
        </div>

        <button
          onClick={() => setIsUploadModalOpen(true)}
          className="px-5 py-2.5 bg-[#5C4632] hover:bg-[#433123] text-amber-300 font-bold text-xs rounded-xl shadow-md border border-[#B88A3B] flex items-center gap-2 cursor-pointer transition-all"
        >
          <Upload className="w-4 h-4" />
          <span>نیا میڈیا شامل کریں (Upload / Add Media)</span>
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

      {/* Search & Filter Bar */}
      <div className="bg-stone-50 dark:bg-slate-900/60 p-4 rounded-2xl border border-stone-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3">
        <div className="flex-1 min-w-[240px] relative">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="فائل کا نام یا تفصیل تلاش کریں..."
            className="w-full pl-4 pr-10 py-2 rounded-xl border border-stone-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-stone-900 dark:text-white text-xs focus:outline-hidden focus:border-[#B88A3B]"
          />
          <Search className="w-4 h-4 text-stone-400 absolute right-3 top-2.5" />
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value as any)}
            className="px-3 py-2 rounded-xl border border-stone-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-stone-800 dark:text-stone-200 text-xs font-bold focus:outline-hidden"
          >
            <option value="all">تمام فائلز (All Media Types)</option>
            <option value="image">تصاویر (Images)</option>
            <option value="document">دستاویزات / PDF</option>
            <option value="audio">آڈیو (Audio)</option>
            <option value="video">ویڈیو (Video)</option>
          </select>

          <div className="flex items-center rounded-xl border border-stone-300 dark:border-slate-700 bg-white dark:bg-slate-800 p-0.5">
            <button
              type="button"
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded-lg ${viewMode === 'grid' ? 'bg-[#5C4632] text-amber-300' : 'text-stone-500'}`}
              title="Grid View"
            >
              <Grid className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => setViewMode('list')}
              className={`p-1.5 rounded-lg ${viewMode === 'list' ? 'bg-[#5C4632] text-amber-300' : 'text-stone-500'}`}
              title="List View"
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Grid / List Display */}
      {isLoading ? (
        <div className="py-20 flex flex-col items-center justify-center gap-3 text-stone-400">
          <Loader2 className="w-8 h-8 animate-spin text-[#B88A3B]" />
          <span className="text-xs font-bold">میڈیا لائبریری لوڈ ہو رہی ہے...</span>
        </div>
      ) : filteredMedia.length === 0 ? (
        <div className="py-16 text-center text-stone-400 space-y-2 bg-white dark:bg-slate-900 rounded-2xl border border-stone-200 dark:border-slate-800">
          <ImageIcon className="w-10 h-10 mx-auto opacity-40 text-[#B88A3B]" />
          <p className="text-sm font-bold text-stone-700 dark:text-stone-300">کوئی میڈیا فائل نہیں ملی۔</p>
          <p className="text-xs text-stone-400">نئی فائل شامل کرنے کے لیے اوپر دیے گئے بٹن پر کلک کریں۔</p>
        </div>
      ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {filteredMedia.map((item) => {
            const isImg = item.mimeType?.startsWith('image/') || item.url?.match(/\.(jpeg|jpg|gif|png|webp|svg)/i);
            return (
              <div
                key={item.id}
                onClick={() => {
                  if (isPickerMode && onSelectMedia) {
                    onSelectMedia(item.url);
                  } else {
                    setSelectedMedia(item);
                  }
                }}
                className={`group relative rounded-2xl overflow-hidden border transition-all cursor-pointer bg-white dark:bg-slate-900 shadow-xs hover:shadow-md hover:border-[#B88A3B] ${
                  selectedMedia?.id === item.id ? 'ring-2 ring-[#B88A3B] border-[#B88A3B]' : 'border-stone-200 dark:border-slate-800'
                }`}
              >
                <div className="aspect-square bg-stone-100 dark:bg-slate-800 flex items-center justify-center overflow-hidden">
                  {isImg ? (
                    <img
                      src={item.url}
                      alt={item.altText || item.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      onError={(e) => { (e.target as any).src = 'https://images.unsplash.com/photo-1584551246679-0daf3d275d0f?auto=format&fit=crop&w=400&q=80'; }}
                    />
                  ) : item.mimeType?.includes('pdf') ? (
                    <FileText className="w-10 h-10 text-red-500 opacity-80" />
                  ) : (
                    <FileText className="w-10 h-10 text-stone-400" />
                  )}
                </div>

                <div className="p-2.5 bg-white dark:bg-slate-900 space-y-0.5">
                  <span className="block font-bold text-xs text-stone-900 dark:text-white truncate">
                    {item.title || item.filename}
                  </span>
                  <span className="block text-[10px] text-stone-400 font-mono truncate" dir="ltr">
                    {item.mimeType}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-stone-200 dark:border-slate-800 shadow-sm overflow-hidden">
          <table className="w-full text-right text-xs">
            <thead className="bg-stone-100 dark:bg-slate-800/80 text-stone-700 dark:text-stone-300 font-bold border-b border-stone-200 dark:border-slate-800">
              <tr>
                <th className="p-3.5 w-16 text-center">پیش نظارہ</th>
                <th className="p-3.5">عنوان / فائل کا نام</th>
                <th className="p-3.5">نوعیت (Type)</th>
                <th className="p-3.5">تاریخِ اندراج</th>
                <th className="p-3.5 text-center w-28">اقدامات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100 dark:divide-slate-800">
              {filteredMedia.map((item) => (
                <tr key={item.id} className="hover:bg-stone-50/70 dark:hover:bg-slate-800/40">
                  <td className="p-2 text-center">
                    <div className="w-10 h-10 rounded-lg overflow-hidden bg-stone-100 dark:bg-slate-800 mx-auto border border-stone-200 dark:border-slate-700 flex items-center justify-center">
                      {item.mimeType?.startsWith('image/') ? (
                        <img src={item.url} alt="" className="w-full h-full object-cover" />
                      ) : (
                        <FileText className="w-5 h-5 text-stone-400" />
                      )}
                    </div>
                  </td>
                  <td className="p-3.5">
                    <span className="font-bold text-stone-900 dark:text-white block cursor-pointer hover:text-[#B88A3B]" onClick={() => setSelectedMedia(item)}>
                      {item.title}
                    </span>
                    <span className="text-[10px] text-stone-400 font-mono" dir="ltr">
                      {item.filename}
                    </span>
                  </td>
                  <td className="p-3.5 font-mono text-stone-500 text-[11px]" dir="ltr">
                    {item.mimeType}
                  </td>
                  <td className="p-3.5 font-mono text-stone-500 text-[11px]" dir="ltr">
                    {item.uploadedAt ? new Date(item.uploadedAt).toLocaleDateString() : '—'}
                  </td>
                  <td className="p-3.5 text-center">
                    <div className="flex items-center justify-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => handleCopyUrl(item.url, item.id)}
                        className="p-1.5 rounded-lg text-stone-600 hover:bg-stone-100 dark:text-stone-300 cursor-pointer"
                        title="Copy URL"
                      >
                        {copiedId === item.id ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeleteMedia(item.id)}
                        className="p-1.5 rounded-lg text-red-600 hover:bg-red-50 cursor-pointer"
                        title="Delete"
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

      {/* Media Details Drawer / Modal */}
      {selectedMedia && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 max-w-2xl w-full rounded-3xl border border-stone-200 dark:border-slate-800 shadow-2xl overflow-hidden flex flex-col">
            
            <div className="bg-stone-900 text-white px-6 py-4 flex items-center justify-between border-b border-stone-800">
              <div className="flex items-center gap-2">
                <ImageIcon className="w-5 h-5 text-amber-300" />
                <h3 className="font-bold text-sm text-white">فائل کی تفصیلات (Media Details)</h3>
              </div>
              <button
                type="button"
                onClick={() => setSelectedMedia(null)}
                className="text-stone-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-stone-100 dark:bg-slate-800 rounded-2xl p-3 flex items-center justify-center border border-stone-200 dark:border-slate-700 min-h-[220px]">
                {selectedMedia.mimeType?.startsWith('image/') ? (
                  <img
                    src={selectedMedia.url}
                    alt={selectedMedia.altText || selectedMedia.title}
                    className="max-h-[260px] max-w-full object-contain rounded-xl"
                  />
                ) : (
                  <FileText className="w-16 h-16 text-stone-400" />
                )}
              </div>

              <div className="space-y-3 text-xs">
                <div>
                  <label className="block text-stone-500 dark:text-stone-400 font-bold mb-1">عنوان (Title):</label>
                  <span className="font-bold text-sm text-stone-900 dark:text-white block">
                    {selectedMedia.title}
                  </span>
                </div>

                <div>
                  <label className="block text-stone-500 dark:text-stone-400 font-bold mb-1">فائل کا نام (Filename):</label>
                  <span className="font-mono text-stone-700 dark:text-stone-300 text-[11px] block" dir="ltr">
                    {selectedMedia.filename}
                  </span>
                </div>

                <div>
                  <label className="block text-stone-500 dark:text-stone-400 font-bold mb-1">براہ راست یو آر ایل (Direct URL):</label>
                  <div className="flex items-center rounded-xl border border-stone-300 dark:border-slate-700 bg-stone-50 dark:bg-slate-800 overflow-hidden" dir="ltr">
                    <input
                      type="text"
                      readOnly
                      value={selectedMedia.url}
                      className="flex-1 px-3 py-1.5 bg-transparent font-mono text-[10px] text-stone-800 dark:text-stone-200 focus:outline-hidden"
                    />
                    <button
                      type="button"
                      onClick={() => handleCopyUrl(selectedMedia.url, selectedMedia.id)}
                      className="px-3 py-1.5 bg-[#5C4632] text-amber-300 font-bold text-[10px] hover:bg-[#433123] cursor-pointer flex items-center gap-1"
                    >
                      {copiedId === selectedMedia.id ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedId === selectedMedia.id ? 'کاپی ہو گیا' : 'Copy'}</span>
                    </button>
                  </div>
                </div>

                {selectedMedia.altText && (
                  <div>
                    <label className="block text-stone-500 dark:text-stone-400 font-bold mb-1">متبادل متن (Alt Text):</label>
                    <span className="text-stone-700 dark:text-stone-300 text-[11px] block">
                      {selectedMedia.altText}
                    </span>
                  </div>
                )}

                <div className="pt-3 border-t border-stone-200 dark:border-slate-800 flex items-center justify-between">
                  <button
                    type="button"
                    onClick={() => handleDeleteMedia(selectedMedia.id)}
                    className="px-3 py-1.5 rounded-xl text-red-600 hover:bg-red-50 dark:hover:bg-red-950/40 text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4" />
                    <span>حذف کریں (Delete File)</span>
                  </button>

                  <a
                    href={selectedMedia.url}
                    target="_blank"
                    rel="noreferrer"
                    className="px-3 py-1.5 rounded-xl bg-stone-100 dark:bg-slate-800 text-stone-700 dark:text-stone-300 hover:text-stone-900 text-xs font-bold flex items-center gap-1.5"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    <span>اوپن کریں</span>
                  </a>
                </div>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* Upload / Add Media Modal */}
      {isUploadModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 max-w-md w-full rounded-3xl p-6 border border-stone-200 dark:border-slate-800 shadow-2xl space-y-4">
            
            <div className="flex items-center justify-between border-b border-stone-100 dark:border-slate-800 pb-2">
              <h3 className="font-bold text-sm text-stone-900 dark:text-white flex items-center gap-1.5">
                <Upload className="w-4 h-4 text-[#B88A3B]" />
                <span>نیا میڈیا شامل کریں</span>
              </h3>
              <button
                type="button"
                onClick={() => setIsUploadModalOpen(false)}
                className="text-stone-400 hover:text-stone-600"
              >
                ✕
              </button>
            </div>

            <div className="flex rounded-xl bg-stone-100 dark:bg-slate-800 p-1">
              <button
                type="button"
                onClick={() => setUploadMode('url')}
                className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  uploadMode === 'url' ? 'bg-[#5C4632] text-amber-300 shadow-xs' : 'text-stone-600 dark:text-stone-300'
                }`}
              >
                انٹرنیٹ URL کے ذریعے
              </button>
              <button
                type="button"
                onClick={() => setUploadMode('file')}
                className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  uploadMode === 'file' ? 'bg-[#5C4632] text-amber-300 shadow-xs' : 'text-stone-600 dark:text-stone-300'
                }`}
              >
                کمپیوٹر سے فائل منتخب کریں
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-stone-700 dark:text-stone-300 mb-1">
                  میڈیا عنوان (Title) <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="مثلاً: جامعہ مسجد بیرونی منظر"
                  className="w-full px-3 py-2 rounded-xl border border-stone-300 dark:border-slate-700 bg-stone-50 dark:bg-slate-800 text-stone-900 dark:text-white"
                />
              </div>

              {uploadMode === 'url' ? (
                <div>
                  <label className="block font-bold text-stone-700 dark:text-stone-300 mb-1">
                    تصویر / فائل کا URL <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={newUrl}
                    onChange={(e) => setNewUrl(e.target.value)}
                    placeholder="https://images.unsplash.com/..."
                    className="w-full px-3 py-2 rounded-xl border border-stone-300 dark:border-slate-700 bg-stone-50 dark:bg-slate-800 text-stone-900 dark:text-white font-mono"
                    dir="ltr"
                  />
                </div>
              ) : (
                <div>
                  <label className="block font-bold text-stone-700 dark:text-stone-300 mb-1">
                    فائل منتخب کریں
                  </label>
                  <input
                    type="file"
                    accept="image/*,application/pdf"
                    onChange={handleFileDrop}
                    className="w-full text-xs text-stone-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-[#5C4632] file:text-amber-300 hover:file:bg-[#433123]"
                  />
                </div>
              )}

              <div>
                <label className="block font-bold text-stone-700 dark:text-stone-300 mb-1">
                  متبادل تفصیل (Alt Text - برائے ایس ای او)
                </label>
                <input
                  type="text"
                  value={newAltText}
                  onChange={(e) => setNewAltText(e.target.value)}
                  placeholder="سرچ انجنز کے لیے مختصر وضاحتی جملہ..."
                  className="w-full px-3 py-2 rounded-xl border border-stone-300 dark:border-slate-700 bg-stone-50 dark:bg-slate-800 text-stone-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block font-bold text-stone-700 dark:text-stone-300 mb-1">
                  MIME Type
                </label>
                <select
                  value={newMimeType}
                  onChange={(e) => setNewMimeType(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-stone-300 dark:border-slate-700 bg-stone-50 dark:bg-slate-800 text-stone-900 dark:text-white"
                >
                  <option value="image/jpeg">image/jpeg (JPG Image)</option>
                  <option value="image/png">image/png (PNG Image)</option>
                  <option value="image/webp">image/webp (WebP Modern)</option>
                  <option value="image/svg+xml">image/svg+xml (Vector Icon)</option>
                  <option value="application/pdf">application/pdf (PDF Document)</option>
                </select>
              </div>
            </div>

            <div className="flex items-center gap-2 pt-3 border-t border-stone-100 dark:border-slate-800">
              <button
                type="button"
                onClick={() => setIsUploadModalOpen(false)}
                className="flex-1 py-2 rounded-xl border border-stone-300 dark:border-slate-700 text-stone-700 dark:text-stone-300 font-bold text-xs"
              >
                منسوخ کریں
              </button>
              <button
                type="button"
                disabled={isUploading}
                onClick={handleSaveMedia}
                className="flex-1 py-2 rounded-xl bg-[#5C4632] text-amber-300 font-bold text-xs shadow-md border border-[#B88A3B] flex items-center justify-center gap-1.5 disabled:opacity-60"
              >
                {isUploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
                <span>محفوظ کریں (Add Media)</span>
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
