import React, { useState, useEffect } from 'react';
import { Department } from '../../types';
import { StorageService } from '../../services/storage';
import { useThemeLanguage } from '../../context/ThemeLanguageContext';
import { Pagination } from './Pagination';
import { 
  GraduationCap, 
  Plus, 
  Trash2, 
  Edit3, 
  Search, 
  Users, 
  X, 
  Save 
} from 'lucide-react';

interface DepartmentsManagementProps {
  onUpdate?: () => void;
}

export const DepartmentsManagement: React.FC<DepartmentsManagementProps> = ({
  onUpdate
}) => {
  const { language } = useThemeLanguage();
  const [departments, setDepartments] = useState<Department[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 6;

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingDept, setEditingDept] = useState<Department | null>(null);

  // Form State
  const [nameUr, setNameUr] = useState('');
  const [nameEn, setNameEn] = useState('');
  const [nameAr, setNameAr] = useState('');
  const [code, setCode] = useState('');
  const [duration, setDuration] = useState('8 سالہ مکمل کورس');
  const [headOfDept, setHeadOfDept] = useState('شیخ الحدیث مولانا مفتی عبد اللہ');
  const [totalStudents, setTotalStudents] = useState<number>(250);
  const [descriptionUr, setDescriptionUr] = useState('');
  const [descriptionEn, setDescriptionEn] = useState('');
  const [descriptionAr, setDescriptionAr] = useState('');
  const [eligibility, setEligibility] = useState('حفظِ قرآن یا مڈل / میٹرک پاس');

  const loadData = () => {
    setDepartments(StorageService.getDepartments());
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
    setEditingDept(null);
    setNameUr('');
    setNameEn('');
    setNameAr('');
    setCode(`DEPT-${Math.floor(100 + Math.random() * 900)}`);
    setDuration('8 سالہ مکمل کورس');
    setHeadOfDept('شیخ الحدیث مولانا مفتی عبد اللہ');
    setTotalStudents(150);
    setDescriptionUr('');
    setDescriptionEn('');
    setDescriptionAr('');
    setEligibility('حفظِ قرآن یا مڈل / میٹرک پاس');
    setIsModalOpen(true);
  };

  const handleOpenEdit = (dept: Department) => {
    setEditingDept(dept);
    setNameUr(dept.name?.ur || '');
    setNameEn(dept.name?.en || '');
    setNameAr(dept.name?.ar || '');
    setCode(dept.code || dept.id);
    setDuration(dept.duration || '');
    setHeadOfDept(dept.headOfDept || '');
    setTotalStudents(dept.totalStudents || 100);
    setDescriptionUr(dept.description?.ur || '');
    setDescriptionEn(dept.description?.en || '');
    setDescriptionAr(dept.description?.ar || '');
    setEligibility(dept.eligibility || '');
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nameUr.trim()) {
      alert('براہ کرم شعبہ کا نام درج فرمائیں۔');
      return;
    }

    const deptData: Department = {
      id: editingDept ? editingDept.id : `dept-${Date.now()}`,
      code: code.trim() || `DEPT-${Date.now()}`,
      name: {
        ur: nameUr.trim(),
        en: nameEn.trim() || nameUr.trim(),
        ar: nameAr.trim() || nameUr.trim()
      },
      duration: duration.trim(),
      headOfDept: headOfDept.trim(),
      totalStudents: Number(totalStudents) || 50,
      description: {
        ur: descriptionUr.trim(),
        en: descriptionEn.trim() || descriptionUr.trim(),
        ar: descriptionAr.trim() || descriptionUr.trim()
      },
      curriculum: editingDept?.curriculum || ['قرآن و ترجمہ', 'حدیث شریف', 'فقہ و اصول فقہ', 'عربی ادب و نحو وصرف'],
      eligibility: eligibility.trim() || 'اہلیت کے مطابق'
    };

    if (editingDept) {
      StorageService.updateDepartment(deptData);
    } else {
      StorageService.addDepartment(deptData);
    }

    setIsModalOpen(false);
    loadData();
    if (onUpdate) onUpdate();
  };

  const handleDelete = (id: string) => {
    if (window.confirm('کیا آپ واقعی اس تعلیمی شعبے کو حذف کرنا چاہتے ہیں؟')) {
      StorageService.deleteDepartment(id);
      loadData();
      if (onUpdate) onUpdate();
    }
  };

  const filteredDepts = departments.filter(d => {
    const nameUrStr = d.name?.ur || '';
    const nameEnStr = d.name?.en || '';
    const codeStr = d.code || '';
    return nameUrStr.toLowerCase().includes(searchTerm.toLowerCase()) ||
      nameEnStr.toLowerCase().includes(searchTerm.toLowerCase()) ||
      codeStr.toLowerCase().includes(searchTerm.toLowerCase());
  });

  const paginatedDepts = filteredDepts.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  return (
    <div className="space-y-6 font-urdu text-right" dir="rtl">
      
      {/* Header Controls */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white dark:bg-slate-900 p-4 sm:p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="space-y-1">
          <h2 className="text-xl font-black text-[#5C4632] dark:text-amber-300 flex items-center gap-2">
            <GraduationCap className="w-5 h-5 text-[#B88A3B]" />
            <span>شعبہ جات و کلیات منیجمنٹ (Academic Departments)</span>
          </h2>
          <p className="text-xs text-slate-500">
            درسِ نظامی، تخصص فی الفقہ، حفظ و تجوید، اور عصری علوم کے تمام تعلیمی شعبے منظم کریں۔
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="px-4 py-2.5 bg-[#5C4632] hover:bg-[#433123] text-amber-300 font-bold text-xs rounded-xl border border-[#B88A3B] shadow-sm flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap"
        >
          <Plus className="w-4 h-4" />
          <span>نیا شعبہ شامل کریں</span>
        </button>
      </div>

      {/* Filter Bar */}
      <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="relative">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
            placeholder="شعبہ کا نام یا کوڈ تلاش کریں..."
            className="w-full pl-4 pr-10 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:border-[#B88A3B]"
          />
          <Search className="w-4 h-4 text-slate-400 absolute right-3 top-2.5" />
        </div>
      </div>

      {/* Departments Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {paginatedDepts.map((d) => (
          <div
            key={d.id}
            className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm space-y-4 flex flex-col justify-between hover:border-[#B88A3B]/60 transition-all"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2.5">
                <span className="px-2.5 py-0.5 rounded-md bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 text-[11px] font-mono font-bold">
                  {d.code || d.id}
                </span>
                <span className="text-xs text-slate-500 flex items-center gap-1 font-sans">
                  <Users className="w-3.5 h-3.5 text-[#B88A3B]" />
                  <span>{d.totalStudents || 0} طلبہ</span>
                </span>
              </div>

              <div>
                <h3 className="font-black text-base text-[#5C4632] dark:text-amber-300">
                  {d.name.ur}
                </h3>
                <p className="text-xs text-slate-500 font-sans mt-0.5">
                  {d.name.en}
                </p>
              </div>

              <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-2 leading-relaxed">
                {d.description.ur}
              </p>

              <div className="p-2.5 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700 text-[11px] space-y-1">
                <div className="flex items-center justify-between text-slate-600 dark:text-slate-300">
                  <span className="text-[#B88A3B] font-bold">مدتِ تعلیم:</span>
                  <span>{d.duration}</span>
                </div>
                {d.headOfDept && (
                  <div className="flex items-center justify-between text-slate-600 dark:text-slate-300">
                    <span className="text-[#B88A3B] font-bold">نگرانِ شعبہ:</span>
                    <span>{d.headOfDept}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-between border-t border-slate-100 dark:border-slate-800 pt-3 gap-2">
              <button
                onClick={() => handleOpenEdit(d)}
                className="flex-1 py-1.5 px-3 rounded-lg bg-amber-50 dark:bg-amber-950/40 hover:bg-amber-100 text-amber-800 dark:text-amber-300 text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>ترمیم</span>
              </button>
              <button
                onClick={() => handleDelete(d.id)}
                className="p-1.5 rounded-lg bg-red-50 dark:bg-red-950/40 hover:bg-red-100 text-red-700 dark:text-red-300 transition-colors cursor-pointer"
                title="حذف کریں"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>

          </div>
        ))}
      </div>

      {filteredDepts.length === 0 && (
        <div className="text-center py-12 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 text-slate-500 text-sm">
          کوئی شعبہ نہیں ملا۔
        </div>
      )}

      {/* Pagination */}
      <Pagination
        currentPage={currentPage}
        totalItems={filteredDepts.length}
        pageSize={pageSize}
        onPageChange={setCurrentPage}
      />

      {/* Add / Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white dark:bg-slate-900 rounded-3xl border-2 border-[#B88A3B]/40 max-w-2xl w-full p-6 sm:p-8 space-y-5 shadow-2xl my-8">
            
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
              <h3 className="text-lg font-black text-[#5C4632] dark:text-amber-300 flex items-center gap-2">
                <GraduationCap className="w-5 h-5 text-[#B88A3B]" />
                <span>{editingDept ? 'شعبہ کے کوائف میں ترمیم' : 'نیا تعلیمی شعبہ شامل کریں'}</span>
              </h3>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-600 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    نام شعبہ (اردو) *
                  </label>
                  <input
                    type="text"
                    required
                    value={nameUr}
                    onChange={(e) => setNameUr(e.target.value)}
                    placeholder="شعبہ درسِ نظامی (عالم کورس)"
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:outline-none focus:border-[#B88A3B]"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    نام شعبہ (English)
                  </label>
                  <input
                    type="text"
                    value={nameEn}
                    onChange={(e) => setNameEn(e.target.value)}
                    placeholder="Department of Dars-e-Nizami"
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-sans focus:outline-none focus:border-[#B88A3B]"
                    dir="ltr"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    نام شعبہ (عربی)
                  </label>
                  <input
                    type="text"
                    value={nameAr}
                    onChange={(e) => setNameAr(e.target.value)}
                    placeholder="قسم الدرس النظامي"
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:outline-none focus:border-[#B88A3B]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    کوڈ (Code) *
                  </label>
                  <input
                    type="text"
                    required
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    placeholder="DEPT-DN"
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-mono focus:outline-none focus:border-[#B88A3B]"
                    dir="ltr"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    مدتِ تعلیم
                  </label>
                  <input
                    type="text"
                    value={duration}
                    onChange={(e) => setDuration(e.target.value)}
                    placeholder="8 سالہ مکمل کورس"
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:outline-none focus:border-[#B88A3B]"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    تعداد طلبہ (کل طلبہ)
                  </label>
                  <input
                    type="number"
                    value={totalStudents}
                    onChange={(e) => setTotalStudents(Number(e.target.value))}
                    min={0}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-mono focus:outline-none focus:border-[#B88A3B]"
                    dir="ltr"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    نگرانِ شعبہ
                  </label>
                  <input
                    type="text"
                    value={headOfDept}
                    onChange={(e) => setHeadOfDept(e.target.value)}
                    placeholder="مولانا مفتی عبد الرحمن"
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:outline-none focus:border-[#B88A3B]"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    شرائط اہلیت و داخلہ
                  </label>
                  <input
                    type="text"
                    value={eligibility}
                    onChange={(e) => setEligibility(e.target.value)}
                    placeholder="حفظِ قرآن یا مڈل / میٹرک پاس"
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:outline-none focus:border-[#B88A3B]"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  تفصیلی تعارف و نصاب (اردو)
                </label>
                <textarea
                  rows={3}
                  value={descriptionUr}
                  onChange={(e) => setDescriptionUr(e.target.value)}
                  placeholder="شعبہ کے اغراض و مقاصد، نصابِ تعلیم اور اہم خصوصیات..."
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
