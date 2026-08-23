import React, { useState, useEffect } from 'react';
import { StorageService } from '../services/storage';
import { useThemeLanguage } from '../context/ThemeLanguageContext';
import { X, Search, BookOpen, GraduationCap, Bell, Users, ChevronRight } from 'lucide-react';

interface GlobalSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (tab: string) => void;
}

export const GlobalSearchModal: React.FC<GlobalSearchModalProps> = ({ isOpen, onClose, onNavigate }) => {
  const { t } = useThemeLanguage();
  const [query, setQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');

  // 300ms Debounce for search performance
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(query);
    }, 300);
    return () => clearTimeout(timer);
  }, [query]);

  if (!isOpen) return null;

  const q = debouncedQuery.toLowerCase().trim();

  const fatwas = StorageService.getFatwas().filter(f => 
    !q || f.title.ur.toLowerCase().includes(q) || f.fatwaNumber.toLowerCase().includes(q) || f.question.ur.toLowerCase().includes(q)
  ).slice(0, 4);

  const books = StorageService.getBooks().filter(b => 
    !q || b.title.ur.toLowerCase().includes(q) || b.author.toLowerCase().includes(q)
  ).slice(0, 3);

  return (
    <div className="fixed inset-0 z-[9999] flex items-start justify-center pt-16 p-4 bg-slate-950/80 backdrop-blur-xs font-sans">
      <div className="bg-[#FAF7F0] dark:bg-slate-900 text-stone-900 dark:text-stone-100 rounded-xs max-w-2xl w-full border border-[#D5C7B2] dark:border-slate-800 shadow-2xl overflow-hidden flex flex-col max-h-[80vh]">
        
        {/* Search Header with Islamic geometric pattern */}
        <div 
          className="bg-[#3C2E21] text-white px-5 py-3.5 flex items-center justify-between border-b-2 border-[#B88A3B]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='24' height='24' viewBox='0 0 24 24' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23B88A3B' fill-opacity='0.15'%3E%3Cpath d='M12 0l12 12-12 12L0 12 12 0zm0 3.5L3.5 12 12 20.5 20.5 12 12 3.5z'/%3E%3C/g%3E%3C/svg%3E")`
          }}
        >
          <div className="flex items-center gap-2.5 flex-1 mr-3">
            <Search className="w-5 h-5 text-[#B88A3B] shrink-0" />
            <input 
              type="text" 
              autoFocus
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="فتاویٰ، کتب یا خبریں تلاش کریں..."
              className="w-full bg-transparent text-white placeholder-amber-200/60 text-sm sm:text-base focus:outline-none font-urdu font-bold"
            />
          </div>
          <button 
            onClick={onClose} 
            className="p-1 rounded-xs bg-black/25 hover:bg-black/40 text-amber-200 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5 text-[#B88A3B]" />
          </button>
        </div>

        {/* Search Results list */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-5 bg-[#FAF7F0] dark:bg-slate-900">
          
          {/* Fatwas */}
          {fatwas.length > 0 && (
            <div className="space-y-2">
              <div className="text-xs font-bold text-[#5C4632] dark:text-amber-300 font-urdu flex items-center gap-1.5 border-b border-[#EADFCF] dark:border-slate-800 pb-1.5">
                <BookOpen className="w-4 h-4 text-[#B88A3B]" />
                <span>فتاویٰ جات (Fatwas)</span>
              </div>
              <div className="space-y-2">
                {fatwas.map(f => (
                  <div 
                    key={f.id}
                    onClick={() => { onNavigate('fatwas'); onClose(); }}
                    className="p-3 rounded-xs bg-white dark:bg-slate-800 border border-[#D5C7B2] dark:border-slate-700 hover:bg-[#EFE8DA] dark:hover:bg-slate-700/80 cursor-pointer transition-colors flex items-center justify-between shadow-2xs"
                  >
                    <div>
                      <div className="text-xs font-mono text-[#8C6D37] dark:text-amber-300 font-bold">{f.fatwaNumber}</div>
                      <div className="text-sm font-bold font-urdu text-[#2B1B0E] dark:text-stone-100">{f.title.ur}</div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-[#B88A3B]" />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Books */}
          {books.length > 0 && (
            <div className="space-y-2">
              <div className="text-xs font-bold text-[#5C4632] dark:text-amber-300 font-urdu flex items-center gap-1.5 border-b border-[#EADFCF] dark:border-slate-800 pb-1.5">
                <BookOpen className="w-4 h-4 text-[#B88A3B]" />
                <span>کتب و مطبوعات (Digital Books)</span>
              </div>
              <div className="space-y-2">
                {books.map(b => (
                  <div 
                    key={b.id}
                    onClick={() => { onNavigate('library'); onClose(); }}
                    className="p-3 rounded-xs bg-white dark:bg-slate-800 border border-[#D5C7B2] dark:border-slate-700 hover:bg-[#EFE8DA] dark:hover:bg-slate-700/80 cursor-pointer transition-colors flex items-center justify-between shadow-2xs"
                  >
                    <div>
                      <div className="text-xs font-urdu font-bold text-[#2B1B0E] dark:text-stone-100">{b.title.ur}</div>
                      <div className="text-[11px] text-stone-500 dark:text-stone-400">{b.author}</div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-[#B88A3B]" />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Quick Trail / Demo Keywords */}
          {!query && (
            <div className="p-4 bg-white dark:bg-slate-800/80 rounded-xs border border-[#D5C7B2] dark:border-slate-700 space-y-2.5">
              <div className="text-xs font-bold text-stone-700 dark:text-stone-300 font-urdu">
                مقبول تلاش (Popular Search Trails):
              </div>
              <div className="flex flex-wrap gap-2">
                {['نماز', 'زکوٰۃ', 'نکاح', 'روزہ', 'تفسیر', 'حدیث'].map((kw) => (
                  <button
                    key={kw}
                    type="button"
                    onClick={() => setQuery(kw)}
                    className="px-2.5 py-1 text-xs bg-[#FAF7F0] hover:bg-[#EFE8DA] dark:bg-slate-700 text-[#5C4632] dark:text-amber-300 rounded-xs border border-[#D5C7B2] dark:border-slate-600 font-urdu font-bold transition-colors cursor-pointer"
                  >
                    {kw}
                  </button>
                ))}
              </div>
            </div>
          )}

        </div>

      </div>
    </div>
  );
};
