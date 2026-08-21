import React, { useState, useEffect } from 'react';
import { FacultyMember } from '../types';
import { StorageService } from '../services/storage';
import { useThemeLanguage } from '../context/ThemeLanguageContext';
import { Users, Award, BookOpen, ShieldCheck } from 'lucide-react';

export const FacultyView: React.FC = () => {
  const { t, language } = useThemeLanguage();
  const [faculty, setFaculty] = useState<FacultyMember[]>([]);

  useEffect(() => {
    const loadFaculty = () => setFaculty(StorageService.getFaculty());
    loadFaculty();
    window.addEventListener('storage', loadFaculty);
    window.addEventListener('jamia_db_updated', loadFaculty);
    return () => {
      window.removeEventListener('storage', loadFaculty);
      window.removeEventListener('jamia_db_updated', loadFaculty);
    };
  }, []);

  return (
    <div className="space-y-8 font-sans">
      
      {/* Banner */}
      <div className="bg-gradient-to-r from-emerald-950 via-emerald-900 to-slate-900 text-amber-100 rounded-3xl p-8 shadow-xl border border-emerald-800">
        <div className="max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-800/80 text-amber-300 text-xs font-semibold border border-emerald-600">
            <Users className="w-4 h-4" />
            <span>شیوخ، اساتذہ کرام و مفتیان</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-black font-urdu text-amber-300">
            ہمارے معزز شیوخ و اساتذہ کرام
          </h1>

          <p className="text-xs sm:text-sm text-emerald-200/90 leading-relaxed font-urdu max-w-2xl">
            جامعہ اسلامیہ ایبٹ آباد میں ۱۲۰ سے زائد جلیل القدر شیوخِ حدیث، مفتیانِ عظام اور قراء کرام تدریسی خدمات سرانجام دے رہے ہیں۔
          </p>
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {faculty.map(member => (
          <div 
            key={member.id}
            className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-all text-center space-y-4"
          >
            <img 
              src={member.photoUrl} 
              alt={member.name.ur}
              loading="lazy"
              decoding="async"
              className="w-28 h-28 rounded-full object-cover border-4 border-amber-400 shadow-md mx-auto" 
            />

            <div className="space-y-1">
              <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100 font-urdu">
                {member.name.ur}
              </h2>
              <div className="text-xs font-bold text-amber-800 dark:text-amber-400 font-urdu">
                {member.designation.ur}
              </div>
              <div className="text-[11px] text-slate-500 font-mono">
                {member.qualification}
              </div>
            </div>

            {member.bio && (
              <p className="text-xs text-slate-600 dark:text-slate-400 font-urdu leading-relaxed border-t border-slate-100 dark:border-slate-800 pt-3">
                {member.bio}
              </p>
            )}

            <div className="bg-slate-50 dark:bg-slate-800 p-2 rounded-xl text-xs font-mono text-emerald-800 dark:text-emerald-400 font-bold">
              تدریسی تجربہ: {member.experienceYears}+ سال
            </div>
          </div>
        ))}
      </div>

    </div>
  );
};
