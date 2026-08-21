import React, { useState, useEffect } from 'react';
import { Department } from '../types';
import { StorageService } from '../services/storage';
import { useThemeLanguage } from '../context/ThemeLanguageContext';
import { GraduationCap, BookOpen, Clock, Users, CheckCircle, FileText } from 'lucide-react';

export const AcademicDepartmentsView: React.FC = () => {
  const { t, language } = useThemeLanguage();
  const [departments, setDepartments] = useState<Department[]>([]);

  useEffect(() => {
    const loadDepartments = () => {
      const allDeps = StorageService.getDepartments();
      // Filter out female campus card (dept-4)
      const maleDeps = allDeps.filter(d => 
        d.id !== 'dept-4' && 
        !d.name.ur.includes('طالبات') && 
        !d.name.ur.includes('بنات')
      );
      setDepartments(maleDeps);
    };
    loadDepartments();
    window.addEventListener('storage', loadDepartments);
    window.addEventListener('jamia_db_updated', loadDepartments);
    return () => {
      window.removeEventListener('storage', loadDepartments);
      window.removeEventListener('jamia_db_updated', loadDepartments);
    };
  }, []);

  const getUrduDuration = (dur: string) => {
    if (!dur) return 'دورانیہ: --';
    if (dur.includes('8')) return 'دورانیہ: 8 سال';
    if (dur.includes('2')) return 'دورانیہ: 2 سال';
    if (dur.includes('3')) return 'دورانیہ: 3 سال';
    if (dur.includes('6')) return 'دورانیہ: 6 سال';
    if (dur.startsWith('دورانیہ:')) return dur;
    return `دورانیہ: ${dur}`;
  };

  return (
    <div className="space-y-8 font-sans text-right" dir="rtl">
      
      {/* Banner */}
      <div className="bg-gradient-to-r from-emerald-950 via-emerald-900 to-slate-900 text-amber-100 rounded-3xl p-6 sm:p-8 shadow-xl border-2 border-[#B88A3B] relative overflow-hidden">
        <div className="max-w-3xl space-y-3 relative z-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#B88A3B]/20 text-amber-300 text-xs font-bold border border-[#B88A3B]/40 font-urdu">
            <GraduationCap className="w-4 h-4 text-[#B88A3B]" />
            <span>جامعہ اسلامیہ ایبٹ آباد — شعبہ جات و نصابِ تعلیم</span>
          </div>

          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black font-urdu text-[#B88A3B] leading-tight">
            تعلیمی شعبہ جات و تخصص
          </h1>

          <p className="text-sm sm:text-base text-[#E6C280] font-bold leading-relaxed font-urdu max-w-2xl">
            جامعہ اسلامیہ ایبٹ آباد میں وفاق المدارس العربیہ پاکستان کے مسلمہ نصاب اور اعلیٰ تخصصی شعبہ جات کی تدریس۔
          </p>
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {departments.map(dept => (
          <div 
            key={dept.id}
            className="bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-3xl border-2 border-[#B88A3B]/40 dark:border-slate-800 shadow-md hover:shadow-lg transition-all space-y-5 flex flex-col justify-between"
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between text-xs font-urdu">
                <span className="bg-[#5C4632] text-[#F8F4EC] px-3 py-1 rounded-lg text-xs font-mono font-bold border border-[#B88A3B]/40">
                  {dept.code}
                </span>
                <span className="text-[#5C4632] dark:text-amber-300 bg-[#F8F4EC] dark:bg-slate-800 px-3.5 py-1 rounded-xl border border-[#B88A3B]/40 flex items-center gap-1.5 font-urdu font-bold text-xs sm:text-sm">
                  <Clock className="w-4 h-4 text-[#B88A3B]" />
                  <span>{getUrduDuration(dept.duration)}</span>
                </span>
              </div>

              <h2 className="text-xl sm:text-2xl font-bold text-stone-900 dark:text-amber-300 font-urdu leading-snug">
                {dept.name.ur}
              </h2>

              <p className="text-xs sm:text-sm text-stone-700 dark:text-stone-300 font-urdu leading-relaxed">
                {dept.description.ur}
              </p>

              <div className="pt-2 border-t border-stone-100 dark:border-slate-800">
                <div className="text-xs sm:text-sm font-bold text-[#5C4632] dark:text-amber-300 font-urdu mb-2 flex items-center gap-1.5">
                  <BookOpen className="w-4 h-4 text-[#B88A3B]" />
                  <span>مرکزی مضامین / کتب:</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {dept.curriculum.map((item, idx) => (
                    <span 
                      key={idx} 
                      className="bg-[#F8F4EC] dark:bg-slate-800 text-stone-900 dark:text-stone-100 text-xs sm:text-sm font-arabic font-bold px-3 py-1.5 rounded-xl border border-[#B88A3B]/50 shadow-2xs hover:border-[#B88A3B] transition-colors tracking-wide"
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-stone-200 dark:border-slate-800 flex items-center justify-between text-xs sm:text-sm text-stone-700 dark:text-stone-300 font-urdu">
              <div>
                نگران: <strong className="text-stone-900 dark:text-stone-100 font-bold">{dept.headOfDept}</strong>
              </div>
              <div className="font-urdu text-[#5C4632] dark:text-amber-300 font-extrabold bg-[#B88A3B]/15 px-3.5 py-1.5 rounded-xl border border-[#B88A3B]/40 text-xs sm:text-sm">
                کل تعداد: {dept.totalStudents} طلباء
              </div>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
};

