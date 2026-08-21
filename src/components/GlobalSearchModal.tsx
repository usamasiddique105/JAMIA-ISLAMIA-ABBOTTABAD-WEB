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
      <div className="bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 rounded-2xl max-w-2xl w-full border border-amber-300 dark:border-slate-800 shadow-2xl overflow-hidden flex flex-col max-h-[80vh]">
        
        {/* Search Header */}
        <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center gap-3 bg-slate-50 dark:bg-slate-800">
          <Search className="w-5 h-5 text-emerald-600" />
          <input 
            type="text" 
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="فتاویٰ، کتب یا خبریں تلاش کریں..."
            className="flex-1 bg-transparent text-sm focus:outline-none font-urdu font-bold text-slate-900 dark:text-slate-100"
          />
          <button onClick={onClose} className="p-1 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700">
            <X className="w-5 h-5 text-slate-500" />
          </button>
        </div>

        {/* Search Results list */}
        <div className="p-6 overflow-y-auto space-y-6">
          
          {/* Fatwas */}
          {fatwas.length > 0 && (
            <div className="space-y-2">
              <div className="text-xs font-bold text-emerald-800 dark:text-emerald-400 font-urdu flex items-center gap-1.5 border-b border-slate-100 dark:border-slate-800 pb-1">
                <BookOpen className="w-4 h-4 text-emerald-600" />
                <span>فتاویٰ جات (Fatwas)</span>
              </div>
              <div className="space-y-2">
                {fatwas.map(f => (
                  <div 
                    key={f.id}
                    onClick={() => { onNavigate('fatwas'); onClose(); }}
                    className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 hover:bg-emerald-50 dark:hover:bg-slate-800 cursor-pointer transition-colors flex items-center justify-between"
                  >
                    <div>
                      <div className="text-xs font-mono text-emerald-700 font-bold">{f.fatwaNumber}</div>
                      <div className="text-sm font-bold font-urdu text-slate-900 dark:text-slate-100">{f.title.ur}</div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-slate-400" />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Books */}
          {books.length > 0 && (
            <div className="space-y-2">
              <div className="text-xs font-bold text-slate-700 dark:text-slate-300 font-urdu flex items-center gap-1.5 border-b border-slate-100 dark:border-slate-800 pb-1">
                <BookOpen className="w-4 h-4 text-slate-600" />
                <span>کتب و مطبوعات (Digital Books)</span>
              </div>
              <div className="space-y-2">
                {books.map(b => (
                  <div 
                    key={b.id}
                    onClick={() => { onNavigate('library'); onClose(); }}
                    className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer transition-colors flex items-center justify-between"
                  >
                    <div>
                      <div className="text-xs font-urdu font-bold text-slate-900 dark:text-slate-100">{b.title.ur}</div>
                      <div className="text-[11px] text-slate-500">{b.author}</div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-slate-400" />
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>

      </div>
    </div>
  );
};
