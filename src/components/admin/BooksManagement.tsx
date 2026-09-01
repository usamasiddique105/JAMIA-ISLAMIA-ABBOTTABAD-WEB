import React, { useState, useEffect } from 'react';
import { PublicationBook } from '../../types';
import { StorageService } from '../../services/storage';
import { useThemeLanguage } from '../../context/ThemeLanguageContext';
import { Pagination } from './Pagination';
import { 
  BookOpen, 
  Plus, 
  Trash2, 
  Edit3, 
  Search, 
  FileText, 
  User, 
  X, 
  Save 
} from 'lucide-react';

interface BooksManagementProps {
  onUpdate?: () => void;
}

export const BooksManagement: React.FC<BooksManagementProps> = ({
  onUpdate
}) => {
  const { language } = useThemeLanguage();
  const [books, setBooks] = useState<PublicationBook[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 8;

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBook, setEditingBook] = useState<PublicationBook | null>(null);

  // Form State
  const [titleUr, setTitleUr] = useState('');
  const [titleEn, setTitleEn] = useState('');
  const [titleAr, setTitleAr] = useState('');
  const [author, setAuthor] = useState('مولانا مفتی عبد الرحمن عثمانی');
  const [category, setCategory] = useState<PublicationBook['category']>('Fiqh');
  const [publishYear, setPublishYear] = useState('1445ھ / 2024ء');
  const [fileSize, setFileSize] = useState('12.5 MB');
  const [fileUrl, setFileUrl] = useState('');
  const [coverImage, setCoverImage] = useState('');
  const [description, setDescription] = useState('');

  const loadData = () => {
    setBooks(StorageService.getBooks());
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
    setEditingBook(null);
    setTitleUr('');
    setTitleEn('');
    setTitleAr('');
    setAuthor('مولانا مفتی عبد الرحمن عثمانی');
    setCategory('Fiqh');
    setPublishYear('1445ھ / 2024ء');
    setFileSize('10.2 MB');
    setFileUrl('');
    setCoverImage('');
    setDescription('');
    setIsModalOpen(true);
  };

  const handleOpenEdit = (book: PublicationBook) => {
    setEditingBook(book);
    setTitleUr(book.title.ur || '');
    setTitleEn(book.title.en || '');
    setTitleAr(book.title.ar || '');
    setAuthor(book.author || '');
    setCategory(book.category || 'Fiqh');
    setPublishYear(book.publishYear || '1445ھ');
    setFileSize(book.fileSize || '5 MB');
    setFileUrl(book.fileUrl || '');
    setCoverImage(book.coverImage || '');
    setDescription(book.description || '');
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!titleUr.trim()) {
      alert('براہ کرم کتاب کا نام درج فرمائیں۔');
      return;
    }

    const bookData: PublicationBook = {
      id: editingBook ? editingBook.id : `book-${Date.now()}`,
      title: {
        ur: titleUr.trim(),
        en: titleEn.trim() || titleUr.trim(),
        ar: titleAr.trim() || titleUr.trim()
      },
      author: author.trim() || 'جامعہ اسلامیہ ایبٹ آباد',
      category,
      publishYear: publishYear.trim() || '1445ھ',
      fileSize: fileSize.trim() || '8.5 MB',
      fileUrl: fileUrl.trim() || '#',
      coverImage: coverImage.trim() || 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=400&q=80',
      description: description.trim(),
      downloadsCount: editingBook ? editingBook.downloadsCount : 0
    };

    try {
      if (editingBook) {
        await StorageService.updateBook(bookData);
      } else {
        await StorageService.addBook(bookData);
      }
    } catch (err: any) {
      alert('کتاب/مقالہ سرور پر محفوظ کرنے میں خرابی پیش آئی: ' + (err?.message || 'نامعلوم خرابی') + '\nڈیٹا کلاؤڈ ڈیٹا بیس میں محفوظ نہیں ہو سکا، براہ کرم دوبارہ کوشش کریں۔');
      return;
    }

    setIsModalOpen(false);
    loadData();
    if (onUpdate) onUpdate();
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('کیا آپ واقعی اس کتاب یا مقالے کو حذف کرنا چاہتے ہیں؟')) {
      try {
        await StorageService.deleteBook(id);
      } catch (err: any) {
        alert('کتاب حذف کرنے میں سرور پر خرابی پیش آئی: ' + (err?.message || 'نامعلوم خرابی'));
        return;
      }
      loadData();
      if (onUpdate) onUpdate();
    }
  };

  const filteredBooks = books.filter(b => {
    const titleUrStr = b.title?.ur || '';
    const authorStr = b.author || '';
    const matchesSearch = 
      titleUrStr.toLowerCase().includes(searchTerm.toLowerCase()) ||
      authorStr.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCat = categoryFilter === 'all' || b.category === categoryFilter;
    return matchesSearch && matchesCat;
  });

  const paginatedBooks = filteredBooks.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  return (
    <div className="space-y-6 font-urdu text-right" dir="rtl">
      
      {/* Header Controls */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white dark:bg-slate-900 p-4 sm:p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="space-y-1">
          <h2 className="text-xl font-black text-[#5C4632] dark:text-amber-300 flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-[#B88A3B]" />
            <span>کتب خانہ و مطبوعات منیجمنٹ (Digital Publications Library)</span>
          </h2>
          <p className="text-xs text-slate-500">
            جامعہ اسلامیہ ایبٹ آباد کی کتب، فتاویٰ مجلدات، اور ماہنامہ جرائد اپ لوڈ و مینیج کریں۔
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="px-4 py-2.5 bg-[#5C4632] hover:bg-[#433123] text-amber-300 font-bold text-xs rounded-xl border border-[#B88A3B] shadow-sm flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap"
        >
          <Plus className="w-4 h-4" />
          <span>نئی کتاب / رسالہ شامل کریں</span>
        </button>
      </div>

      {/* Filter Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="relative sm:col-span-2">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
            placeholder="کتاب کا عنوان یا مصنف کا نام تلاش کریں..."
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
            <option value="all">تمام زمرہ جات (All Categories)</option>
            <option value="Fiqh">فقہ و فتاویٰ</option>
            <option value="Hadith">علوم الحدیث</option>
            <option value="Tafseer">علوم القرآن و تفسیر</option>
            <option value="Arabic Literature">ادب عربی و کتب لغت</option>
            <option value="Fatwa Collection">مجموعہ فتاویٰ</option>
            <option value="Monthly Magazine">ماہنامہ مجلہ</option>
            <option value="Research Paper">تحقیقی مقالہ</option>
          </select>
        </div>
      </div>

      {/* Books Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {paginatedBooks.map((b) => (
          <div
            key={b.id}
            className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-4 shadow-sm space-y-3 flex flex-col justify-between hover:border-[#B88A3B]/60 transition-all"
          >
            <div className="space-y-3">
              <div className="h-40 rounded-xl bg-slate-100 dark:bg-slate-800 overflow-hidden border border-slate-200 dark:border-slate-700 relative">
                {b.coverImage ? (
                  <img src={b.coverImage} alt={b.title.ur} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-slate-400">
                    <BookOpen className="w-12 h-12" />
                  </div>
                )}
                <span className="absolute top-2 right-2 px-2 py-0.5 rounded-md bg-black/75 text-amber-300 text-[10px] font-bold">
                  {b.category}
                </span>
              </div>

              <div>
                <h3 className="font-black text-sm text-[#5C4632] dark:text-amber-300 line-clamp-2">
                  {b.title.ur}
                </h3>
                <p className="text-xs text-slate-500 mt-1 flex items-center gap-1">
                  <User className="w-3 h-3 text-[#B88A3B]" />
                  <span>{b.author}</span>
                </p>
              </div>

              <div className="flex items-center justify-between text-[11px] text-slate-500 font-mono" dir="ltr">
                <span>{b.fileSize || 'PDF'}</span>
                <span>{b.publishYear}</span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-between border-t border-slate-100 dark:border-slate-800 pt-3 gap-2">
              <button
                onClick={() => handleOpenEdit(b)}
                className="flex-1 py-1.5 px-3 rounded-lg bg-amber-50 dark:bg-amber-950/40 hover:bg-amber-100 text-amber-800 dark:text-amber-300 text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>ترمیم</span>
              </button>
              <button
                onClick={() => handleDelete(b.id)}
                className="p-1.5 rounded-lg bg-red-50 dark:bg-red-950/40 hover:bg-red-100 text-red-700 dark:text-red-300 transition-colors cursor-pointer"
                title="حذف کریں"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {filteredBooks.length === 0 && (
        <div className="text-center py-12 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 text-slate-500 text-sm">
          کوئی کتاب نہیں ملی۔
        </div>
      )}

      {/* Pagination */}
      <Pagination
        currentPage={currentPage}
        totalItems={filteredBooks.length}
        pageSize={pageSize}
        onPageChange={setCurrentPage}
      />

      {/* Add / Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[9999] bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 overflow-y-auto" dir="rtl">
          <div className="bg-white dark:bg-slate-900 rounded-3xl border-2 border-[#B88A3B]/40 max-w-2xl w-full p-5 sm:p-8 space-y-5 shadow-2xl my-auto max-h-[calc(100vh-2rem)] overflow-y-auto">
            
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
              <h3 className="text-lg font-black text-[#5C4632] dark:text-amber-300 flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-[#B88A3B]" />
                <span>{editingBook ? 'کتاب کے کوائف میں ترمیم' : 'نئی کتاب یا مجلہ شامل کریں'}</span>
              </h3>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-600 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  کتاب کا نام (اردو) *
                </label>
                <input
                  type="text"
                  required
                  value={titleUr}
                  onChange={(e) => setTitleUr(e.target.value)}
                  placeholder="فتاویٰ دارالافتاء جامعہ اسلامیہ - جلد اول"
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:outline-none focus:border-[#B88A3B]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    مصنف / مرتب *
                  </label>
                  <input
                    type="text"
                    required
                    value={author}
                    onChange={(e) => setAuthor(e.target.value)}
                    placeholder="مفتی عبد الرحمن عثمانی"
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:outline-none focus:border-[#B88A3B]"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    زمرہ (Category) *
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:outline-none focus:border-[#B88A3B]"
                  >
                    <option value="Fiqh">فقہ و فتاویٰ</option>
                    <option value="Hadith">علوم الحدیث</option>
                    <option value="Tafseer">علوم القرآن و تفسیر</option>
                    <option value="Arabic Literature">ادب عربی و کتب لغت</option>
                    <option value="Fatwa Collection">مجموعہ فتاویٰ</option>
                    <option value="Monthly Magazine">ماہنامہ مجلہ</option>
                    <option value="Research Paper">تحقیقی مقالہ</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    سال اشاعت
                  </label>
                  <input
                    type="text"
                    value={publishYear}
                    onChange={(e) => setPublishYear(e.target.value)}
                    placeholder="1445ھ / 2024ء"
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:outline-none focus:border-[#B88A3B]"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    فائل سائز (File Size)
                  </label>
                  <input
                    type="text"
                    value={fileSize}
                    onChange={(e) => setFileSize(e.target.value)}
                    placeholder="12.5 MB"
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-mono focus:outline-none focus:border-[#B88A3B]"
                    dir="ltr"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    ڈاؤن لوڈ یا پی ڈی ایف لنک (PDF URL)
                  </label>
                  <input
                    type="url"
                    value={fileUrl}
                    onChange={(e) => setFileUrl(e.target.value)}
                    placeholder="https://..."
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-mono focus:outline-none focus:border-[#B88A3B]"
                    dir="ltr"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    سرورق تصویر کا لنک (Cover Image URL)
                  </label>
                  <input
                    type="url"
                    value={coverImage}
                    onChange={(e) => setCoverImage(e.target.value)}
                    placeholder="https://..."
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-mono focus:outline-none focus:border-[#B88A3B]"
                    dir="ltr"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  مختصر تعارف / خلاصہ
                </label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="کتاب کے اہم ابواب اور موضوعات کا تعارف..."
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:outline-none focus:border-[#B88A3B]"
                ></textarea>
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
