import React, { useState, useEffect } from 'react';
import { Department } from '../types';
import { StorageService } from '../services/storage';
import { useThemeLanguage } from '../context/ThemeLanguageContext';
import { GraduationCap, BookOpen, Clock, Users } from 'lucide-react';

export const AcademicDepartmentsView: React.FC = () => {
  const { language } = useThemeLanguage();
  const isEn = language === 'en';
  const isAr = language === 'ar';

  const fontClass = isAr ? 'font-arabic' : isEn ? 'font-sans' : 'font-urdu';

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

  const getLocalizedDuration = (dur: string) => {
    if (!dur) return isAr ? 'المدة: --' : isEn ? 'Duration: --' : 'دورانیہ: --';
    const numMatch = dur.match(/\d+/);
    const years = numMatch ? numMatch[0] : '8';

    if (isAr) {
      return `المدة: ${years} سنوات`;
    }
    if (isEn) {
      return `Duration: ${years} Years`;
    }
    return `دورانیہ: ${years} سال`;
  };

  const getLocalizedCurriculumItem = (item: string) => {
    if (isEn) {
      if (item.includes('قرآن')) return 'Holy Quran';
      if (item.includes('صحیح البخاری')) return 'Sahih al-Bukhari';
      if (item.includes('صحیح مسلم')) return 'Sahih Muslim';
      if (item.includes('ہدایہ')) return 'Al-Hidayah (Fiqh)';
      if (item.includes('تفسیر')) return 'Quranic Exegesis (Tafsir)';
      if (item.includes('تجوید')) return 'Tajweed & Qiraat';
      if (item.includes('فتاویٰ')) return 'Fatwa Formulation';
      if (item.includes('اصول')) return 'Usul al-Fiqh';
    }
    return item;
  };

  return (
    <div className={`space-y-8 ${fontClass} ${isEn ? 'text-left' : 'text-right'}`} dir={isEn ? 'ltr' : 'rtl'}>
      
      {/* Banner */}
      <div className="bg-gradient-to-r from-emerald-950 via-emerald-900 to-slate-900 text-amber-100 rounded-3xl p-6 sm:p-8 shadow-xl border-2 border-[#B88A3B] relative overflow-hidden">
        <div className="max-w-3xl space-y-3 relative z-10">
          <div className={`inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#B88A3B]/20 text-amber-300 text-xs font-bold border border-[#B88A3B]/40 ${fontClass}`}>
            <GraduationCap className="w-4 h-4 text-[#B88A3B]" />
            <span>
              {isAr 
                ? 'الجامعة الإسلامية بأيبت آباد — الأقسام والمناهج العلمية' 
                : isEn 
                ? 'Jamia Islamia Abbottabad — Academic Departments & Curriculum' 
                : 'جامعہ اسلامیہ ایبٹ آباد — شعبہ جات و نصابِ تعلیم'}
            </span>
          </div>

          <h1 className={`text-2xl sm:text-3xl lg:text-4xl font-black ${fontClass} text-[#B88A3B] leading-tight`}>
            {isAr 
              ? 'الأقسام العلمية والتخصصات العالية' 
              : isEn 
              ? 'Academic Departments & Specializations' 
              : 'تعلیمی شعبہ جات و تخصص'}
          </h1>

          <p className={`text-sm sm:text-base text-[#E6C280] font-bold leading-relaxed ${fontClass} max-w-2xl`}>
            {isAr 
              ? 'تدريس المناهج المعتمدة لوفاق المدارس العربية بباكستان وأقسام الدراسات التخصصية العليا في الفقه والحديث والتجويد.' 
              : isEn 
              ? 'Instruction under the standardized curriculum of Wifaqul Madaris Al-Arabia Pakistan and advanced postgraduate specializations.' 
              : 'جامعہ اسلامیہ ایبٹ آباد میں وفاق المدارس العربیہ پاکستان کے مسلمہ نصاب اور اعلیٰ تخصصی شعبہ جات کی تدریس۔'}
          </p>
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {departments.map(dept => {
          const deptName = dept.name[language] || dept.name.ur;
          const deptDesc = dept.description[language] || dept.description.ur;

          return (
            <div 
              key={dept.id}
              className="bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-3xl border-2 border-[#B88A3B]/40 dark:border-slate-800 shadow-md hover:shadow-lg transition-all space-y-5 flex flex-col justify-between"
            >
              <div className="space-y-4">
                <div className={`flex items-center justify-between text-xs ${fontClass}`}>
                  <span className="bg-[#5C4632] text-[#F8F4EC] px-3 py-1 rounded-lg text-xs font-mono font-bold border border-[#B88A3B]/40">
                    {dept.code}
                  </span>
                  <span className="text-[#5C4632] dark:text-amber-300 bg-[#F8F4EC] dark:bg-slate-800 px-3.5 py-1 rounded-xl border border-[#B88A3B]/40 flex items-center gap-1.5 font-bold text-xs sm:text-sm">
                    <Clock className="w-4 h-4 text-[#B88A3B]" />
                    <span>{getLocalizedDuration(dept.duration)}</span>
                  </span>
                </div>

                <h2 className={`text-xl sm:text-2xl font-bold text-stone-900 dark:text-amber-300 ${fontClass} leading-snug`}>
                  {deptName}
                </h2>

                <p className={`text-xs sm:text-sm text-stone-700 dark:text-stone-300 ${fontClass} leading-relaxed`}>
                  {deptDesc}
                </p>

                <div className="pt-2 border-t border-stone-100 dark:border-slate-800">
                  <div className={`text-xs sm:text-sm font-bold text-[#5C4632] dark:text-amber-300 ${fontClass} mb-2 flex items-center gap-1.5`}>
                    <BookOpen className="w-4 h-4 text-[#B88A3B]" />
                    <span>
                      {isAr ? 'أهم الكتب والمقررات:' : isEn ? 'Core Curriculum & Texts:' : 'مرکزی مضامین / کتب:'}
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {dept.curriculum.map((item, idx) => (
                      <span 
                        key={idx} 
                        className={`bg-[#F8F4EC] dark:bg-slate-800 text-stone-900 dark:text-stone-100 text-xs sm:text-sm ${isEn ? 'font-sans' : 'font-arabic'} font-bold px-3 py-1.5 rounded-xl border border-[#B88A3B]/50 shadow-2xs hover:border-[#B88A3B] transition-colors tracking-wide`}
                      >
                        {getLocalizedCurriculumItem(item)}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className={`pt-4 border-t border-stone-200 dark:border-slate-800 flex items-center justify-between text-xs sm:text-sm text-stone-700 dark:text-stone-300 ${fontClass}`}>
                <div>
                  {isAr ? 'المشرف:' : isEn ? 'Head:' : 'نگران:'}{' '}
                  <strong className="text-stone-900 dark:text-stone-100 font-bold">{dept.headOfDept}</strong>
                </div>
                <div className={`text-[#5C4632] dark:text-amber-300 font-extrabold bg-[#B88A3B]/15 px-3.5 py-1.5 rounded-xl border border-[#B88A3B]/40 text-xs sm:text-sm ${fontClass}`}>
                  {isAr 
                    ? `إجمالي الطلاب: ${dept.totalStudents}` 
                    : isEn 
                    ? `Total Students: ${dept.totalStudents}` 
                    : `کل تعداد: ${dept.totalStudents} طلباء`}
                </div>
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
};


