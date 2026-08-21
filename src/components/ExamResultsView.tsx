import React, { useState } from 'react';
import { ExamResult } from '../types';
import { StorageService } from '../services/storage';
import { useThemeLanguage } from '../context/ThemeLanguageContext';
import { 
  GraduationCap, 
  Search, 
  Award, 
  Printer, 
  CheckCircle2, 
  AlertCircle, 
  ShieldCheck, 
  User, 
  FileSpreadsheet,
  Building
} from 'lucide-react';

export const ExamResultsView: React.FC = () => {
  const { t, language } = useThemeLanguage();
  const [rollNumber, setRollNumber] = useState('');
  const [searchResult, setSearchResult] = useState<ExamResult | null>(null);
  const [errorMsg, setErrorMsg] = useState('');
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setHasSearched(true);

    const term = rollNumber.trim();
    if (!term) {
      setErrorMsg('برائے مہربانی اپنا رول نمبر درج کریں۔');
      setSearchResult(null);
      return;
    }

    const allResults = StorageService.getExamResults();
    const found = allResults.find(r => 
      r.rollNumber.toLowerCase() === term.toLowerCase() ||
      r.registrationNumber.toLowerCase() === term.toLowerCase() ||
      r.studentName.toLowerCase().includes(term.toLowerCase())
    );

    if (found) {
      setSearchResult(found);
    } else {
      setSearchResult(null);
      setErrorMsg('درج کردہ رول نمبر کا کوئی نتیجہ نہیں ملا۔ برائے مہربانی رول نمبر دوبارہ چیک کریں۔');
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-8 font-sans">
      
      {/* Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-emerald-950 to-slate-900 text-amber-100 rounded-3xl p-8 shadow-xl border border-emerald-800 relative overflow-hidden no-print">
        <div className="max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-800/80 text-amber-300 text-xs font-semibold border border-emerald-600">
            <GraduationCap className="w-4 h-4" />
            <span>مجلسِ امتحانات - جامعہ اسلامیہ ایبٹ آباد</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-black font-urdu text-amber-300">
            آن لائن نتائجِ امتحانات پورٹل (Examination Results Portal)
          </h1>

          <p className="text-xs sm:text-sm text-emerald-200/90 leading-relaxed font-urdu max-w-2xl">
            شعبہ درس نظامی، تخصص فی الافتاء اور تحفیظ القرآن کے سالانہ امتحانات کے تصدیق شدہ نتائج اور آفیشل مارک شیٹ ڈاؤن لوڈ اور پرنٹ کریں۔
          </p>
        </div>
      </div>

      {/* Lookup Card */}
      <div className="bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-md max-w-2xl mx-auto no-print space-y-4">
        <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100 font-urdu text-center">
          نتیجہ معلوم کرنے کے لیے رول نمبر درج کریں
        </h2>

        <form onSubmit={handleSearch} className="space-y-3">
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute right-3 top-3.5" />
              <input 
                type="text"
                value={rollNumber}
                onChange={(e) => setRollNumber(e.target.value)}
                placeholder="مثلاً: 2026-8801 یا 2026-8802..."
                className="w-full pr-10 pl-4 py-3 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl focus:outline-none focus:border-emerald-500 font-mono font-bold text-slate-900 dark:text-slate-100"
              />
            </div>
            <button 
              type="submit"
              className="px-6 py-3 bg-emerald-800 hover:bg-emerald-900 text-amber-200 font-bold text-xs rounded-xl shadow-md transition-colors font-urdu flex items-center gap-1.5"
            >
              <Search className="w-4 h-4" />
              <span>نتیجہ دیکھیں</span>
            </button>
          </div>

          {/* Quick Demo Roll Numbers */}
          <div className="flex items-center justify-center gap-2 text-xs text-slate-500">
            <span>آزمائشی رول نمبرز:</span>
            {['2026-8801', '2026-8802', '2026-8803'].map(num => (
              <button 
                key={num}
                type="button"
                onClick={() => { setRollNumber(num); }}
                className="px-2 py-0.5 rounded bg-amber-100 dark:bg-slate-800 text-emerald-900 dark:text-amber-300 font-mono font-bold hover:underline"
              >
                {num}
              </button>
            ))}
          </div>
        </form>

        {errorMsg && (
          <div className="p-4 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900 rounded-xl text-red-700 dark:text-red-300 text-xs font-urdu flex items-center gap-2">
            <AlertCircle className="w-5 h-5 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}
      </div>

      {/* Official Mark Sheet Result Card */}
      {searchResult && (
        <div className="bg-white dark:bg-slate-900 p-6 sm:p-10 rounded-2xl border-2 border-emerald-800/40 shadow-xl max-w-3xl mx-auto space-y-6 font-sans relative overflow-hidden">
          
          {/* Watermark Logo */}
          <div className="absolute right-1/2 top-1/2 -translate-y-1/2 translate-x-1/2 opacity-5 pointer-events-none">
            <GraduationCap className="w-96 h-96 text-emerald-900" />
          </div>

          {/* Header */}
          <div className="text-center border-b-2 border-emerald-800/30 pb-6 space-y-2">
            <div className="text-xs font-arabic text-emerald-800 dark:text-emerald-400 tracking-widest font-bold">
              مجلسُ الإمتحاناتِ العَالِيَةِ
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-emerald-950 dark:text-emerald-100 font-urdu">
              جامعہ اسلامیہ ایبٹ آباد، پاکستان
            </h2>
            <p className="text-xs text-amber-800 dark:text-amber-400 font-bold uppercase tracking-wider">
              آفیشل سند و کشف الدرجات (Official Marksheet - {searchResult.academicYear})
            </p>
          </div>

          {/* Student Bio Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-slate-50 dark:bg-slate-800/60 p-5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs">
            <div>
              <span className="text-slate-500 font-medium">اسمِ الطالب (اسم طالب علم):</span>
              <div className="text-sm font-bold text-slate-900 dark:text-slate-100 font-urdu mt-0.5">{searchResult.studentName}</div>
            </div>

            <div>
              <span className="text-slate-500 font-medium">اسمُ والدِه (والد کا نام):</span>
              <div className="text-sm font-bold text-slate-900 dark:text-slate-100 font-urdu mt-0.5">{searchResult.fatherName}</div>
            </div>

            <div>
              <span className="text-slate-500 font-medium">رقمُ الجلوس (رول نمبر):</span>
              <div className="text-sm font-mono font-bold text-emerald-800 dark:text-emerald-400 mt-0.5">{searchResult.rollNumber}</div>
            </div>

            <div>
              <span className="text-slate-500 font-medium">رقمُ التسجيل (رجسٹریشن نمبر):</span>
              <div className="text-sm font-mono font-bold text-slate-800 dark:text-slate-200 mt-0.5">{searchResult.registrationNumber}</div>
            </div>

            <div className="col-span-full">
              <span className="text-slate-500 font-medium">القسم/الكليّة (شعبہ تعلیمی):</span>
              <div className="text-sm font-bold text-emerald-900 dark:text-emerald-300 font-urdu mt-0.5">{searchResult.department}</div>
            </div>
          </div>

          {/* Subjects Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-right border-collapse">
              <thead>
                <tr className="bg-emerald-950 text-amber-200">
                  <th className="p-3 border border-emerald-800 rounded-tr-lg">مضمون / پرچہ (Subject)</th>
                  <th className="p-3 border border-emerald-800 text-center w-24">کل نمبر (Total)</th>
                  <th className="p-3 border border-emerald-800 text-center w-28 rounded-tl-lg">حاصل کردہ نمبر (Obtained)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                {searchResult.subjects.map((subj, idx) => (
                  <tr key={idx} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                    <td className="p-3 border border-slate-200 dark:border-slate-800 font-urdu font-medium text-slate-900 dark:text-slate-100">
                      {subj.name}
                    </td>
                    <td className="p-3 border border-slate-200 dark:border-slate-800 text-center font-mono font-bold text-slate-600 dark:text-slate-400">
                      {subj.totalMarks}
                    </td>
                    <td className="p-3 border border-slate-200 dark:border-slate-800 text-center font-mono font-bold text-emerald-700 dark:text-emerald-400">
                      {subj.obtainedMarks}
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr className="bg-amber-50 dark:bg-slate-800/90 font-bold">
                  <td className="p-3 border border-slate-200 dark:border-slate-800 font-urdu text-amber-900 dark:text-amber-300">
                    مجموعی حاصل کردہ نمبر (Grand Total)
                  </td>
                  <td className="p-3 border border-slate-200 dark:border-slate-800 text-center font-mono text-amber-900 dark:text-amber-300">
                    {searchResult.totalMarks}
                  </td>
                  <td className="p-3 border border-slate-200 dark:border-slate-800 text-center font-mono text-emerald-800 dark:text-emerald-300 text-sm">
                    {searchResult.obtainedMarks}
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>

          {/* Grade & Final Status Banner */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-emerald-900 text-amber-100 p-5 rounded-xl border border-emerald-700 text-center">
            <div>
              <div className="text-[11px] text-emerald-300 font-medium">فیصد (Percentage)</div>
              <div className="text-xl font-mono font-bold text-amber-300">{searchResult.percentage}%</div>
            </div>

            <div>
              <div className="text-[11px] text-emerald-300 font-medium">تقدیر/درجہ (Grade)</div>
              <div className="text-lg font-bold font-urdu text-white">{searchResult.grade}</div>
            </div>

            <div>
              <div className="text-[11px] text-emerald-300 font-medium">نتیجہ (Status)</div>
              <div className="text-lg font-extrabold uppercase text-amber-300">{searchResult.status}</div>
            </div>
          </div>

          {searchResult.remarks && (
            <div className="text-xs font-urdu text-slate-600 dark:text-slate-400 bg-slate-50 dark:bg-slate-800 p-3 rounded-lg border border-slate-200 dark:border-slate-700">
              <strong className="text-emerald-800 dark:text-emerald-400">ریمارکس/ملاحظات: </strong>
              {searchResult.remarks}
            </div>
          )}

          {/* Action Footer */}
          <div className="pt-4 flex justify-between items-center no-print">
            <div className="text-xs text-slate-500 font-mono">
              تصدیق شدہ ناظمِ امتحانات - جامعہ اسلامیہ ایبٹ آباد
            </div>
            <button 
              onClick={handlePrint}
              className="px-5 py-2.5 bg-emerald-800 hover:bg-emerald-900 text-amber-200 font-bold text-xs rounded-xl shadow-md flex items-center gap-2 transition-colors"
            >
              <Printer className="w-4 h-4" />
              <span>مارک شیٹ پرنٹ کریں (Print Result)</span>
            </button>
          </div>

        </div>
      )}

    </div>
  );
};
