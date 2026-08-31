import React, { useState, useEffect } from 'react';
import { FacultyMember, Department } from '../../types';
import { StorageService } from '../../services/storage';
import { useThemeLanguage } from '../../context/ThemeLanguageContext';
import { Pagination } from './Pagination';
import { 
  Users, 
  Plus, 
  Trash2, 
  Edit3, 
  Search, 
  X, 
  Save 
} from 'lucide-react';

interface FacultyManagementProps {
  onUpdate?: () => void;
}

export const FacultyManagement: React.FC<FacultyManagementProps> = ({
  onUpdate
}) => {
  const { language } = useThemeLanguage();
  const [faculty, setFaculty] = useState<FacultyMember[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 8;

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMember, setEditingMember] = useState<FacultyMember | null>(null);

  // Form State
  const [nameUr, setNameUr] = useState('');
  const [nameEn, setNameEn] = useState('');
  const [nameAr, setNameAr] = useState('');
  const [designationUr, setDesignationUr] = useState('استاذ الحدیث والفقه');
  const [designationEn, setDesignationEn] = useState('Professor of Hadith & Fiqh');
  const [designationAr, setDesignationAr] = useState('أستاذ الحديث والفقه');
  const [department, setDepartment] = useState('');
  const [qualification, setQualification] = useState('شہادۃ العالمیہ (وفاق المدارس)');
  const [specialization, setSpecialization] = useState('تخصص فی الفقہ والافتاء');
  const [photoUrl, setPhotoUrl] = useState('');
  const [experienceYears, setExperienceYears] = useState<number>(10);
  const [bio, setBio] = useState('');

  const loadData = () => {
    setFaculty(StorageService.getFaculty());
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
    setEditingMember(null);
    setNameUr('');
    setNameEn('');
    setNameAr('');
    setDesignationUr('استاذ الحدیث والفقه');
    setDesignationEn('Professor of Hadith & Fiqh');
    setDesignationAr('أستاذ الحديث والفقه');
    setDepartment(departments[0]?.name?.ur || 'شعبہ درسِ نظامی');
    setQualification('شہادۃ العالمیہ (وفاق المدارس)');
    setSpecialization('تخصص فی الفقہ والافتاء');
    setPhotoUrl('');
    setExperienceYears(10);
    setBio('');
    setIsModalOpen(true);
  };

  const handleOpenEdit = (member: FacultyMember) => {
    setEditingMember(member);
    setNameUr(member.name?.ur || '');
    setNameEn(member.name?.en || '');
    setNameAr(member.name?.ar || '');
    setDesignationUr(member.designation?.ur || '');
    setDesignationEn(member.designation?.en || '');
    setDesignationAr(member.designation?.ar || '');
    setDepartment(member.department || departments[0]?.name?.ur || 'شعبہ درسِ نظامی');
    setQualification(member.qualification || '');
    setSpecialization(member.specialization || '');
    setPhotoUrl(member.photoUrl || '');
    setExperienceYears(member.experienceYears || 5);
    setBio(member.bio || '');
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nameUr.trim()) {
      alert('براہ کرم استاد محترم کا نام درج فرمائیں۔');
      return;
    }

    const memberData: FacultyMember = {
      id: editingMember ? editingMember.id : `fac-${Date.now()}`,
      name: {
        ur: nameUr.trim(),
        en: nameEn.trim() || nameUr.trim(),
        ar: nameAr.trim() || nameUr.trim()
      },
      designation: {
        ur: designationUr.trim(),
        en: designationEn.trim() || designationUr.trim(),
        ar: designationAr.trim() || designationUr.trim()
      },
      department: department || 'شعبہ درسِ نظامی',
      qualification: qualification.trim(),
      specialization: specialization.trim(),
      photoUrl: photoUrl.trim() || 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=400&q=80',
      experienceYears: Number(experienceYears) || 0,
      bio: bio.trim() || undefined
    };

    if (editingMember) {
      StorageService.updateFaculty(memberData);
    } else {
      StorageService.addFaculty(memberData);
    }

    setIsModalOpen(false);
    loadData();
    if (onUpdate) onUpdate();
  };

  const handleDelete = (id: string) => {
    if (window.confirm('کیا آپ واقعی اس استاد محترم کا ریکارڈ حذف کرنا چاہتے ہیں؟')) {
      StorageService.deleteFaculty(id);
      loadData();
      if (onUpdate) onUpdate();
    }
  };

  const filteredFaculty = faculty.filter(f => {
    const nameUrStr = f.name?.ur || '';
    const qualStr = f.qualification || '';
    const matchesSearch = 
      nameUrStr.toLowerCase().includes(searchTerm.toLowerCase()) ||
      qualStr.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDept = departmentFilter === 'all' || f.department === departmentFilter;
    return matchesSearch && matchesDept;
  });

  const paginatedFaculty = filteredFaculty.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  return (
    <div className="space-y-6 font-urdu text-right" dir="rtl">
      
      {/* Header Controls */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white dark:bg-slate-900 p-4 sm:p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="space-y-1">
          <h2 className="text-xl font-black text-[#5C4632] dark:text-amber-300 flex items-center gap-2">
            <Users className="w-5 h-5 text-[#B88A3B]" />
            <span>اساتذہ و فیکلٹی منیجمنٹ</span>
          </h2>
          <p className="text-xs text-slate-500">
            جامعہ اسلامیہ ایبٹ آباد کے محترم اساتذہ کرام اور مفتیان عظام کے پروفائلز شامل و ترمیم کریں۔
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="px-4 py-2.5 bg-[#5C4632] hover:bg-[#433123] text-amber-300 font-bold text-xs rounded-xl border border-[#B88A3B] shadow-sm flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap"
        >
          <Plus className="w-4 h-4" />
          <span>نیا استاد / مفتی شامل کریں</span>
        </button>
      </div>

      {/* Filter Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="relative sm:col-span-2">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
            placeholder="استاد کا نام یا تعلیمی قابلیت تلاش کریں..."
            className="w-full pl-4 pr-10 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:border-[#B88A3B]"
          />
          <Search className="w-4 h-4 text-slate-400 absolute right-3 top-2.5" />
        </div>

        <div>
          <select
            value={departmentFilter}
            onChange={(e) => { setDepartmentFilter(e.target.value); setCurrentPage(1); }}
            className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:border-[#B88A3B]"
          >
            <option value="all">تمام شعبہ جات (All Departments)</option>
            {departments.map(d => (
              <option key={d.id} value={d.name.ur}>{d.name.ur}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Faculty Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {paginatedFaculty.map((f) => (
          <div 
            key={f.id}
            className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm space-y-3 flex flex-col justify-between hover:border-[#B88A3B]/60 transition-all"
          >
            <div className="space-y-3 text-center">
              <div className="w-16 h-16 rounded-full mx-auto bg-amber-100 dark:bg-slate-800 text-[#5C4632] dark:text-amber-400 border-2 border-[#B88A3B] flex items-center justify-center font-bold text-xl overflow-hidden shadow-inner">
                {f.photoUrl ? (
                  <img src={f.photoUrl} alt={f.name.ur} className="w-full h-full object-cover" />
                ) : (
                  f.name.ur.charAt(0)
                )}
              </div>

              <div>
                <h3 className="font-black text-sm text-[#5C4632] dark:text-amber-300">
                  {f.name.ur}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 font-sans mt-0.5">
                  {f.designation.ur}
                </p>
              </div>

              <div className="p-2 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700 text-[11px] space-y-1 text-right">
                <div className="text-slate-600 dark:text-slate-300">
                  <span className="text-[#B88A3B] font-bold">شعبہ: </span>
                  {f.department}
                </div>
                {f.qualification && (
                  <div className="text-slate-600 dark:text-slate-300">
                    <span className="text-[#B88A3B] font-bold">قابلیت: </span>
                    {f.qualification}
                  </div>
                )}
                {f.specialization && (
                  <div className="text-slate-600 dark:text-slate-300">
                    <span className="text-[#B88A3B] font-bold">تخصص: </span>
                    {f.specialization}
                  </div>
                )}
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-between border-t border-slate-100 dark:border-slate-800 pt-3 gap-2">
              <button
                onClick={() => handleOpenEdit(f)}
                className="flex-1 py-1.5 px-3 rounded-lg bg-amber-50 dark:bg-amber-950/40 hover:bg-amber-100 text-amber-800 dark:text-amber-300 text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>ترمیم</span>
              </button>
              <button
                onClick={() => handleDelete(f.id)}
                className="p-1.5 rounded-lg bg-red-50 dark:bg-red-950/40 hover:bg-red-100 text-red-700 dark:text-red-300 transition-colors cursor-pointer"
                title="حذف کریں"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {filteredFaculty.length === 0 && (
        <div className="text-center py-12 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 text-slate-500 text-sm">
          کوئی استاد یا فیکلٹی ممبر نہیں ملا۔
        </div>
      )}

      {/* Pagination */}
      <Pagination
        currentPage={currentPage}
        totalItems={filteredFaculty.length}
        pageSize={pageSize}
        onPageChange={setCurrentPage}
      />

      {/* Add / Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[9999] bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 overflow-y-auto" dir="rtl">
          <div className="bg-white dark:bg-slate-900 rounded-3xl border-2 border-[#B88A3B]/40 max-w-2xl w-full p-5 sm:p-8 space-y-5 shadow-2xl my-auto max-h-[calc(100vh-2rem)] overflow-y-auto">
            
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
              <h3 className="text-lg font-black text-[#5C4632] dark:text-amber-300 flex items-center gap-2">
                <Users className="w-5 h-5 text-[#B88A3B]" />
                <span>{editingMember ? 'استاد محترم کے کوائف میں ترمیم' : 'نیا استاد / مفتی شامل کریں'}</span>
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
                    نام (اردو) *
                  </label>
                  <input
                    type="text"
                    required
                    value={nameUr}
                    onChange={(e) => setNameUr(e.target.value)}
                    placeholder="مولانا مفتی عبد الرحمن"
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:outline-none focus:border-[#B88A3B]"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    نام (English)
                  </label>
                  <input
                    type="text"
                    value={nameEn}
                    onChange={(e) => setNameEn(e.target.value)}
                    placeholder="Mufti Abdul Rehman"
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-sans focus:outline-none focus:border-[#B88A3B]"
                    dir="ltr"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    نام (عربی)
                  </label>
                  <input
                    type="text"
                    value={nameAr}
                    onChange={(e) => setNameAr(e.target.value)}
                    placeholder="الشيخ المفتي عبد الرحمن"
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:outline-none focus:border-[#B88A3B]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    عہدہ / منصب (اردو) *
                  </label>
                  <input
                    type="text"
                    required
                    value={designationUr}
                    onChange={(e) => setDesignationUr(e.target.value)}
                    placeholder="استاذ الحدیث / صدر مفتی"
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:outline-none focus:border-[#B88A3B]"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    متعلقہ شعبہ *
                  </label>
                  <input
                    type="text"
                    required
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                    placeholder="شعبہ درسِ نظامی یا شعبہ تخصص"
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:outline-none focus:border-[#B88A3B]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    تعلیمی اسناد و قابلیت
                  </label>
                  <input
                    type="text"
                    value={qualification}
                    onChange={(e) => setQualification(e.target.value)}
                    placeholder="شہادۃ العالمیہ، ایم فل اسلامیات"
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:outline-none focus:border-[#B88A3B]"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    تخصص / شعبہ مہارت
                  </label>
                  <input
                    type="text"
                    value={specialization}
                    onChange={(e) => setSpecialization(e.target.value)}
                    placeholder="تخصص فی الفقہ، قراءات عشرہ"
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:outline-none focus:border-[#B88A3B]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    تصویر کا لنک (Photo URL - اختیاری)
                  </label>
                  <input
                    type="url"
                    value={photoUrl}
                    onChange={(e) => setPhotoUrl(e.target.value)}
                    placeholder="https://..."
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-mono focus:outline-none focus:border-[#B88A3B]"
                    dir="ltr"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    تدریسی تجربہ (سال)
                  </label>
                  <input
                    type="number"
                    value={experienceYears}
                    onChange={(e) => setExperienceYears(Number(e.target.value))}
                    min={1}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-mono focus:outline-none focus:border-[#B88A3B]"
                    dir="ltr"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  مختصر تعارف و علمی خدمات (Bio - اختیاری)
                </label>
                <textarea
                  rows={3}
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  placeholder="استاد محترم کے علمی و تدریسی سفر کا مختصر خلاصہ..."
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
