import React, { useState, useEffect } from 'react';
import { FacultyMember } from '../types';
import { StorageService } from '../services/storage';
import { useThemeLanguage } from '../context/ThemeLanguageContext';
import { Users } from 'lucide-react';

export const FacultyView: React.FC = () => {
  const { language } = useThemeLanguage();
  const isEn = language === 'en';
  const isAr = language === 'ar';

  const fontClass = isAr ? 'font-arabic' : isEn ? 'font-sans' : 'font-urdu';

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
    <div className={`space-y-8 ${fontClass} ${isEn ? 'text-left' : 'text-right'}`} dir={isEn ? 'ltr' : 'rtl'}>
      
      {/* Banner */}
      <div className="bg-gradient-to-r from-emerald-950 via-emerald-900 to-slate-900 text-amber-100 rounded-3xl p-8 shadow-xl border border-[#B88A3B]">
        <div className="max-w-3xl space-y-4">
          <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#B88A3B]/20 text-amber-300 text-xs font-semibold border border-[#B88A3B]/40 ${fontClass}`}>
            <Users className="w-4 h-4 text-[#B88A3B]" />
            <span>
              {isAr 
                ? 'الشيوخ والأساتذة الكرام والمفتون' 
                : isEn 
                ? 'Distinguished Scholars, Faculty & Muftis' 
                : 'شیوخ، اساتذہ کرام و مفتیان'}
            </span>
          </div>

          <h1 className={`text-2xl sm:text-4xl font-black ${fontClass} text-[#B88A3B]`}>
            {isAr 
              ? 'أساتذتنا وشيوخنا الأفاضل' 
              : isEn 
              ? 'Our Respected Faculty & Scholars' 
              : 'ہمارے معزز شیوخ و اساتذہ کرام'}
          </h1>

          <p className={`text-xs sm:text-sm text-[#E6C280] font-bold leading-relaxed ${fontClass} max-w-2xl`}>
            {isAr 
              ? 'يضم كادر التدريس في الجامعة الإسلامية بأيبت آباد أكثر من ۱۲۰ من كبار شيوخ الحديث والمفتين الأعلام والقراء المتقنين.' 
              : isEn 
              ? 'Jamia Islamia Abbottabad is blessed with over 120 senior Hadith scholars, accredited Muftis, and master Qaris dedicated to academic and spiritual instruction.' 
              : 'جامعہ اسلامیہ ایبٹ آباد میں ۱۲۰ سے زائد جلیل القدر شیوخِ حدیث، مفتیانِ عظام اور قراء کرام تدریسی خدمات سرانجام دے رہے ہیں۔'}
          </p>
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {faculty.map(member => {
          const memberName = member.name[language] || member.name.ur;
          const memberDesig = member.designation[language] || member.designation.ur;

          return (
            <div 
              key={member.id}
              className="bg-white dark:bg-slate-900 p-6 rounded-3xl border-2 border-[#B88A3B]/30 dark:border-slate-800 shadow-sm hover:shadow-md transition-all text-center space-y-4"
            >
              <img 
                src={member.photoUrl} 
                alt={memberName}
                loading="lazy"
                decoding="async"
                className="w-28 h-28 rounded-full object-cover border-4 border-[#B88A3B] shadow-md mx-auto" 
              />

              <div className="space-y-1">
                <h2 className={`text-lg font-bold text-stone-900 dark:text-stone-100 ${fontClass}`}>
                  {memberName}
                </h2>
                <div className={`text-xs font-bold text-[#5C4632] dark:text-amber-400 ${fontClass}`}>
                  {memberDesig}
                </div>
                <div className="text-[11px] text-stone-600 dark:text-stone-400 font-mono">
                  {member.qualification}
                </div>
              </div>

              {member.bio && (
                <p className={`text-xs text-stone-600 dark:text-stone-400 ${fontClass} leading-relaxed border-t border-stone-100 dark:border-slate-800 pt-3`}>
                  {member.bio}
                </p>
              )}

              <div className={`bg-[#F8F4EC] dark:bg-slate-800 p-2 rounded-xl text-xs font-mono text-[#5C4632] dark:text-amber-400 font-bold border border-[#B88A3B]/30`}>
                {isAr 
                  ? `الخبرة التدريسية: أكثر من ${member.experienceYears} عاماً` 
                  : isEn 
                  ? `Teaching Experience: ${member.experienceYears}+ Years` 
                  : `تدریسی تجربہ: ${member.experienceYears}+ سال`}
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
};

