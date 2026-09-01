import React, { useState, useEffect } from 'react';
import { NewsItem } from '../../types';
import { StorageService } from '../../services/storage';
import { useThemeLanguage } from '../../context/ThemeLanguageContext';
import { Pagination } from './Pagination';
import { 
  Bell, 
  Plus, 
  Trash2, 
  Edit3, 
  Search, 
  Pin, 
  X, 
  Save 
} from 'lucide-react';

interface NewsManagementProps {
  onUpdate?: () => void;
}

export const NewsManagement: React.FC<NewsManagementProps> = ({
  onUpdate
}) => {
  const { language } = useThemeLanguage();
  const [news, setNews] = useState<NewsItem[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 6;

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingNews, setEditingNews] = useState<NewsItem | null>(null);

  // Form State
  const [titleUr, setTitleUr] = useState('');
  const [titleEn, setTitleEn] = useState('');
  const [titleAr, setTitleAr] = useState('');
  const [contentUr, setContentUr] = useState('');
  const [contentEn, setContentEn] = useState('');
  const [contentAr, setContentAr] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [category, setCategory] = useState<'News' | 'Announcement' | 'Event' | 'Admission'>('News');
  const [isPinned, setIsPinned] = useState(false);

  const loadData = () => {
    setNews(StorageService.getNews());
  };

  useEffect(() => {
    loadData();
    window.addEventListener('storage', loadData);
    window.addEventListener('jamia_db_updated', loadData);
    return () => {
      window.removeEventListener('storage', loadData);
      window.removeEventListener('jamia_db_updated', loadData);
    };
  }, []);

  const handleOpenAdd = () => {
    setEditingNews(null);
    setTitleUr('');
    setTitleEn('');
    setTitleAr('');
    setContentUr('');
    setContentEn('');
    setContentAr('');
    setDate(new Date().toISOString().split('T')[0]);
    setCategory('News');
    setIsPinned(false);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (item: NewsItem) => {
    setEditingNews(item);
    setTitleUr(item.title?.ur || '');
    setTitleEn(item.title?.en || '');
    setTitleAr(item.title?.ar || '');
    setContentUr(item.content?.ur || '');
    setContentEn(item.content?.en || '');
    setContentAr(item.content?.ar || '');
    setDate(item.date || new Date().toISOString().split('T')[0]);
    setCategory(item.category || 'News');
    setIsPinned(!!item.isPinned);
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!titleUr.trim() || !contentUr.trim()) {
      alert('براہ کرم خبر کا عنوان اور متن درج فرمائیں۔');
      return;
    }

    const newsData: NewsItem = {
      id: editingNews ? editingNews.id : `news-${Date.now()}`,
      title: {
        ur: titleUr.trim(),
        en: titleEn.trim() || titleUr.trim(),
        ar: titleAr.trim() || titleUr.trim()
      },
      content: {
        ur: contentUr.trim(),
        en: contentEn.trim() || contentUr.trim(),
        ar: contentAr.trim() || contentUr.trim()
      },
      date,
      category,
      isPinned
    };

    try {
      if (editingNews) {
        await StorageService.updateNews(newsData);
      } else {
        await StorageService.addNews(newsData);
      }
    } catch (err: any) {
      alert('خبر/اعلان سرور پر محفوظ کرنے میں خرابی پیش آئی: ' + (err?.message || 'نامعلوم خرابی') + '\nڈیٹا کلاؤڈ ڈیٹا بیس میں محفوظ نہیں ہو سکا، براہ کرم دوبارہ کوشش کریں۔');
      return;
    }

    setIsModalOpen(false);
    loadData();
    if (onUpdate) onUpdate();
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('کیا آپ واقعی اس خبر/اعلان کو حذف کرنا چاہتے ہیں؟')) {
      try {
        await StorageService.deleteNews(id);
      } catch (err: any) {
        alert('خبر حذف کرنے میں سرور پر خرابی پیش آئی: ' + (err?.message || 'نامعلوم خرابی'));
        return;
      }
      loadData();
      if (onUpdate) onUpdate();
    }
  };

  const handleTogglePin = async (item: NewsItem) => {
    try {
      await StorageService.updateNews({
        ...item,
        isPinned: !item.isPinned
      });
    } catch (err: any) {
      alert('خبر کی حالت تبدیل کرنے میں سرور پر خرابی پیش آئی: ' + (err?.message || 'نامعلوم خرابی'));
      return;
    }
    loadData();
    if (onUpdate) onUpdate();
  };

  const filteredNews = news.filter(n => {
    const titleUrStr = n.title?.ur || '';
    const contentUrStr = n.content?.ur || '';
    const matchesSearch = 
      titleUrStr.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contentUrStr.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || n.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const paginatedNews = filteredNews.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  return (
    <div className="space-y-6 font-urdu text-right" dir="rtl">
      
      {/* Header Controls */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white dark:bg-slate-900 p-4 sm:p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="space-y-1">
          <h2 className="text-xl font-black text-[#5C4632] dark:text-amber-300 flex items-center gap-2">
            <Bell className="w-5 h-5 text-[#B88A3B]" />
            <span>خبریں، اعلانات و تقریبات منیجمنٹ</span>
          </h2>
          <p className="text-xs text-slate-500">
            جامعہ کی تازہ ترین خبریں، داخلہ نوٹس اور اعلانات شامل و تبدیل کریں۔
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="px-4 py-2.5 bg-[#5C4632] hover:bg-[#433123] text-amber-300 font-bold text-xs rounded-xl border border-[#B88A3B] shadow-sm flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap"
        >
          <Plus className="w-4 h-4" />
          <span>نئی خبر یا اعلان شائع کریں</span>
        </button>
      </div>

      {/* Filter Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="relative sm:col-span-2">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
            placeholder="خبر کا عنوان یا تفصیل تلاش کریں..."
            className="w-full pl-4 pr-10 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:border-[#B88A3B]"
          />
          <Search className="w-4 h-4 text-slate-400 absolute right-3 top-2.5" />
        </div>

        <div>
          <select
            value={categoryFilter}
            onChange={(e) => { setCategoryFilter(e.target.value); setCurrentPage(1); }}
            className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:border-[#B88A3B]"
          >
            <option value="all">تمام کیٹیگریز (All Categories)</option>
            <option value="News">خبریں (News)</option>
            <option value="Announcement">اہم اعلان (Announcement)</option>
            <option value="Admission">داخلہ نوٹس (Admission)</option>
            <option value="Event">تقریب (Event)</option>
          </select>
        </div>
      </div>

      {/* News Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {paginatedNews.map((item) => (
          <div
            key={item.id}
            className={`bg-white dark:bg-slate-900 rounded-2xl border p-5 shadow-sm space-y-3 flex flex-col justify-between transition-all ${
              item.isPinned
                ? 'border-amber-400/80 bg-amber-50/20 dark:bg-amber-950/20 shadow-amber-500/10'
                : 'border-slate-200 dark:border-slate-800 hover:border-[#B88A3B]/60'
            }`}
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2.5">
                <span className={`px-2.5 py-0.5 rounded-md text-[11px] font-bold ${
                  item.category === 'Admission' ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300' :
                  item.category === 'Announcement' ? 'bg-red-100 text-red-800 dark:bg-red-950/60 dark:text-red-300' :
                  'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300'
                }`}>
                  {item.category === 'Admission' ? 'داخلہ نوٹس' :
                   item.category === 'Announcement' ? 'اہم اعلان' :
                   item.category === 'Event' ? 'تقریب' : 'جامعہ کی خبر'}
                </span>

                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-500 font-mono" dir="ltr">{item.date}</span>
                  <button
                    onClick={() => handleTogglePin(item)}
                    className={`p-1 rounded-md transition-colors cursor-pointer ${
                      item.isPinned 
                        ? 'bg-amber-500 text-white' 
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-400 hover:text-slate-600'
                    }`}
                    title={item.isPinned ? 'پن ہٹائیں' : 'اوپر پن کریں'}
                  >
                    <Pin className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              <h3 className="font-black text-sm text-[#5C4632] dark:text-amber-300 line-clamp-2">
                {item.title.ur}
              </h3>

              <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-3 leading-relaxed">
                {item.content.ur}
              </p>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-between border-t border-slate-100 dark:border-slate-800 pt-3 gap-2">
              <button
                onClick={() => handleOpenEdit(item)}
                className="flex-1 py-1.5 px-3 rounded-lg bg-amber-50 dark:bg-amber-950/40 hover:bg-amber-100 text-amber-800 dark:text-amber-300 text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>ترمیم</span>
              </button>
              <button
                onClick={() => handleDelete(item.id)}
                className="p-1.5 rounded-lg bg-red-50 dark:bg-red-950/40 hover:bg-red-100 text-red-700 dark:text-red-300 transition-colors cursor-pointer"
                title="حذف کریں"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {filteredNews.length === 0 && (
        <div className="text-center py-12 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 text-slate-500 text-sm">
          کوئی خبر یا اعلان نہیں ملا۔
        </div>
      )}

      {/* Pagination */}
      <Pagination
        currentPage={currentPage}
        totalItems={filteredNews.length}
        pageSize={pageSize}
        onPageChange={setCurrentPage}
      />

      {/* Add / Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[9999] bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 overflow-y-auto" dir="rtl">
          <div className="bg-white dark:bg-slate-900 rounded-3xl border-2 border-[#B88A3B]/40 max-w-2xl w-full p-5 sm:p-8 space-y-5 shadow-2xl my-auto max-h-[calc(100vh-2rem)] overflow-y-auto">
            
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
              <h3 className="text-lg font-black text-[#5C4632] dark:text-amber-300 flex items-center gap-2">
                <Bell className="w-5 h-5 text-[#B88A3B]" />
                <span>{editingNews ? 'خبر یا اعلان میں ترمیم' : 'نئی خبر یا اعلان شائع کریں'}</span>
              </h3>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-600 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    کیٹیگری (Category) *
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:outline-none focus:border-[#B88A3B]"
                  >
                    <option value="News">جامعہ کی خبر (News)</option>
                    <option value="Announcement">اہم اعلان (Announcement)</option>
                    <option value="Admission">داخلہ نوٹس (Admission)</option>
                    <option value="Event">تقریب (Event)</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    تاریخ اشاعت (Date) *
                  </label>
                  <input
                    type="date"
                    required
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-mono focus:outline-none focus:border-[#B88A3B]"
                    dir="ltr"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  عنوان (اردو) *
                </label>
                <input
                  type="text"
                  required
                  value={titleUr}
                  onChange={(e) => setTitleUr(e.target.value)}
                  placeholder="سالانہ امتحانات اور تعطیلات کا شیڈول جاری..."
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:outline-none focus:border-[#B88A3B]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    عنوان (English - اختیاری)
                  </label>
                  <input
                    type="text"
                    value={titleEn}
                    onChange={(e) => setTitleEn(e.target.value)}
                    placeholder="Annual Examination Schedule Announced"
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-sans focus:outline-none focus:border-[#B88A3B]"
                    dir="ltr"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    عنوان (عربی - اختیاری)
                  </label>
                  <input
                    type="text"
                    value={titleAr}
                    onChange={(e) => setTitleAr(e.target.value)}
                    placeholder="إعلان جدول الامتحانات السنوية"
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:outline-none focus:border-[#B88A3B]"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  مکمل تفصیل و متن (اردو) *
                </label>
                <textarea
                  rows={4}
                  required
                  value={contentUr}
                  onChange={(e) => setContentUr(e.target.value)}
                  placeholder="خبر یا اعلان کی مکمل تفصیلات یہاں درج فرمائیں..."
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:outline-none focus:border-[#B88A3B]"
                ></textarea>
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="pinNews"
                  checked={isPinned}
                  onChange={(e) => setIsPinned(e.target.checked)}
                  className="rounded text-[#B88A3B] focus:ring-[#B88A3B]"
                />
                <label htmlFor="pinNews" className="font-bold text-slate-700 dark:text-slate-300 cursor-pointer">
                  اس خبر کو ہوم پیج اور پورٹل پر سب سے اوپر پن کریں (Pin to Top)
                </label>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-200 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold hover:bg-slate-200 transition-colors cursor-pointer"
                >
                  منسوخ کریں
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 rounded-xl bg-[#5C4632] hover:bg-[#433123] text-amber-300 font-bold border border-[#B88A3B] shadow-md flex items-center gap-2 cursor-pointer transition-all"
                >
                  <Save className="w-4 h-4" />
                  <span>محفوظ کریں</span>
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
};
