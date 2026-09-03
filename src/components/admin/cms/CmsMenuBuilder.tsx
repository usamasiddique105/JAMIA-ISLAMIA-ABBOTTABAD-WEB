import React, { useState, useEffect } from 'react';
import { CmsMenu, CmsMenuItem, CmsPage } from '../../../types';
import { cmsApiService } from '../../../services/cmsApiService';
import { 
  Menu as MenuIcon, 
  Plus, 
  Trash2, 
  Edit3, 
  ChevronUp, 
  ChevronDown, 
  Save, 
  CheckCircle, 
  AlertCircle, 
  Loader2, 
  ExternalLink, 
  CornerDownLeft, 
  Globe, 
  Link as LinkIcon, 
  Eye, 
  EyeOff, 
  Layers,
  ArrowRight,
  Sparkles,
  Info
} from 'lucide-react';

export const CmsMenuBuilder: React.FC = () => {
  const [menus, setMenus] = useState<CmsMenu[]>([]);
  const [pages, setPages] = useState<CmsPage[]>([]);
  const [selectedMenuId, setSelectedMenuId] = useState<string>('menu-header-main');
  const [currentItems, setCurrentItems] = useState<CmsMenuItem[]>([]);
  
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [successMsg, setSuccessMsg] = useState<string>('');
  const [errorMsg, setErrorMsg] = useState<string>('');

  // Item Editor Modal State
  const [isItemModalOpen, setIsItemModalOpen] = useState<boolean>(false);
  const [editingItemId, setEditingItemId] = useState<string | null>(null);
  const [itemLabelUr, setItemLabelUr] = useState<string>('');
  const [itemLabelAr, setItemLabelAr] = useState<string>('');
  const [itemLabelEn, setItemLabelEn] = useState<string>('');
  const [itemLinkType, setItemLinkType] = useState<'page' | 'tab' | 'custom'>('custom');
  const [itemSelectedPage, setItemSelectedPage] = useState<string>('');
  const [itemSelectedTab, setItemSelectedTab] = useState<string>('fatwas');
  const [itemCustomUrl, setItemCustomUrl] = useState<string>('#');
  const [itemParentId, setItemParentId] = useState<string>('');
  const [itemTarget, setItemTarget] = useState<'_self' | '_blank'>('_self');
  const [itemIsEnabled, setItemIsEnabled] = useState<boolean>(true);

  // New Menu Creation Modal State
  const [isNewMenuModalOpen, setIsNewMenuModalOpen] = useState<boolean>(false);
  const [newMenuName, setNewMenuName] = useState<string>('');
  const [newMenuLocation, setNewMenuLocation] = useState<'header_main' | 'top_bar' | 'footer_quick' | 'footer_academics' | 'footer_sharia'>('header_main');

  const BUILTIN_TABS = [
    { id: 'fatwas', labelUr: 'دارالافتاء و فتاویٰ آرکائیو', labelEn: 'Darul Ifta & Fatwas' },
    { id: 'admissions', labelUr: 'آن لائن داخلہ و کلاس بکنگ', labelEn: 'Online Admission & Class' },
    { id: 'exam-results', labelUr: 'امتحانی نتائج پورٹل', labelEn: 'Exam Results' },
    { id: 'library', labelUr: 'ڈیجیٹل کتب خانہ و رسالہ', labelEn: 'Digital Library' },
    { id: 'departments', labelUr: 'تعلیمی شعبہ جات', labelEn: 'Departments' },
    { id: 'faculty', labelUr: 'شیوخ و اساتذہ کرام', labelEn: 'Faculty Members' },
    { id: 'donations', labelUr: 'آن لائن عطیات و زکوٰۃ', labelEn: 'Donations & Zakat' },
    { id: 'news', labelUr: 'خبریں و اعلانات', labelEn: 'News & Events' },
    { id: 'contact', labelUr: 'رابطہ و نقشہ', labelEn: 'Contact & Map' },
  ];

  // Load Menus and Pages from backend
  const loadData = async () => {
    setIsLoading(true);
    setErrorMsg('');
    try {
      const [fetchedMenus, fetchedPages] = await Promise.all([
        cmsApiService.getMenus(),
        cmsApiService.getPages()
      ]);
      setMenus(fetchedMenus);
      setPages(fetchedPages);

      // Select initial menu
      const current = fetchedMenus.find(m => m.id === selectedMenuId) || fetchedMenus[0];
      if (current) {
        setSelectedMenuId(current.id);
        setCurrentItems(current.items || []);
      }
    } catch (err: any) {
      setErrorMsg(err?.message || 'مینیوز لوڈ کرنے میں خرابی پیش آئی۔');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // When selected menu changes
  const handleSelectMenu = (menuId: string) => {
    setSelectedMenuId(menuId);
    const m = menus.find(x => x.id === menuId);
    if (m) {
      setCurrentItems(m.items || []);
    }
  };

  // Add Item to current menu
  const openAddItemModal = (parentId?: string) => {
    setEditingItemId(null);
    setItemLabelUr('');
    setItemLabelAr('');
    setItemLabelEn('');
    setItemLinkType('page');
    setItemSelectedPage(pages[0]?.slug || '');
    setItemSelectedTab('fatwas');
    setItemCustomUrl('#');
    setItemParentId(parentId || '');
    setItemTarget('_self');
    setItemIsEnabled(true);
    setIsItemModalOpen(true);
  };

  const openEditItemModal = (item: CmsMenuItem) => {
    setEditingItemId(item.id);
    setItemLabelUr(item.title.ur || '');
    setItemLabelAr(item.title.ar || '');
    setItemLabelEn(item.title.en || '');
    
    if (item.pageId) {
      setItemLinkType('page');
      setItemSelectedPage(item.pageId);
    } else if (item.tabId) {
      setItemLinkType('tab');
      setItemSelectedTab(item.tabId);
    } else {
      setItemLinkType('custom');
      setItemCustomUrl(item.url || '#');
    }

    setItemParentId(item.parentId || '');
    setItemTarget(item.target || '_self');
    setItemIsEnabled(item.isEnabled !== false);
    setIsItemModalOpen(true);
  };

  const handleSaveItem = () => {
    if (!itemLabelUr.trim() && !itemLabelEn.trim()) {
      alert('آئٹم کا کم از کم ایک عنوان (اردو یا انگریزی) درج کریں۔');
      return;
    }

    let resolvedUrl = itemCustomUrl;
    let pageId: string | undefined = undefined;
    let tabId: string | undefined = undefined;

    if (itemLinkType === 'page') {
      resolvedUrl = `/${itemSelectedPage}`;
      pageId = itemSelectedPage;
    } else if (itemLinkType === 'tab') {
      resolvedUrl = `#tab-${itemSelectedTab}`;
      tabId = itemSelectedTab;
    }

    const newItem: CmsMenuItem = {
      id: editingItemId || `item-${Date.now()}`,
      title: {
        ur: itemLabelUr.trim() || itemLabelEn.trim(),
        ar: itemLabelAr.trim() || itemLabelUr.trim(),
        en: itemLabelEn.trim() || itemLabelUr.trim()
      },
      url: resolvedUrl,
      pageId,
      tabId,
      target: itemTarget,
      isEnabled: itemIsEnabled,
      orderIndex: editingItemId ? (currentItems.find(x => x.id === editingItemId)?.orderIndex ?? currentItems.length) : currentItems.length + 1,
      parentId: itemParentId ? itemParentId : null
    };

    if (editingItemId) {
      setCurrentItems(prev => prev.map(it => it.id === editingItemId ? { ...it, ...newItem } : it));
    } else {
      setCurrentItems(prev => [...prev, newItem]);
    }

    setIsItemModalOpen(false);
  };

  const handleDeleteItem = (itemId: string) => {
    if (confirm('کیا آپ واقعی یہ مینیو آئٹم اور اس کے ذیلی آئٹمز حذف کرنا چاہتے ہیں؟')) {
      setCurrentItems(prev => prev.filter(it => it.id !== itemId && it.parentId !== itemId));
    }
  };

  const handleMoveItem = (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= currentItems.length) return;

    const newArr = [...currentItems];
    const temp = newArr[index];
    newArr[index] = newArr[targetIndex];
    newArr[targetIndex] = temp;

    // Update order indices
    const updated = newArr.map((it, idx) => ({ ...it, orderIndex: idx + 1 }));
    setCurrentItems(updated);
  };

  const handleToggleItem = (itemId: string) => {
    setCurrentItems(prev => prev.map(it => it.id === itemId ? { ...it, isEnabled: !it.isEnabled } : it));
  };

  const handleSaveMenuToServer = async () => {
    const currentMenu = menus.find(m => m.id === selectedMenuId);
    if (!currentMenu) return;

    setIsSaving(true);
    setErrorMsg('');
    setSuccessMsg('');

    const payload: Partial<CmsMenu> = {
      id: currentMenu.id,
      location: currentMenu.location,
      name: currentMenu.name,
      items: currentItems,
      updatedAt: new Date().toISOString()
    };

    try {
      const res = await cmsApiService.saveMenu(payload);
      if (res && res.success) {
        setSuccessMsg(`مینیو "${currentMenu.name}" کامیابی سے محفوظ ہو گیا!`);
        // Update local state
        setMenus(prev => prev.map(m => m.id === currentMenu.id ? { ...m, items: currentItems } : m));
        // Log revision for menu
        cmsApiService.createRevision({
          entityType: 'menu',
          entityId: currentMenu.id,
          action: 'update',
          dataJson: JSON.stringify(payload),
          author: 'Admin',
          revisionNote: `مینیو "${currentMenu.name}" محفوظ کیا گیا`
        }).catch(() => {});
        setTimeout(() => setSuccessMsg(''), 4000);
      } else {
        setErrorMsg(res?.error || 'مینیو محفوظ کرنے میں مسئلہ پیش آیا۔');
      }
    } catch (err: any) {
      setErrorMsg(err?.message || 'مینیو محفوظ کرنے میں مسئلہ پیش آیا۔');
    } finally {
      setIsSaving(false);
    }
  };

  const handleCreateNewMenu = async () => {
    if (!newMenuName.trim()) {
      alert('مینیو کا نام درج فرمائیں۔');
      return;
    }

    const newId = `menu-${newMenuLocation}-${Date.now()}`;
    const newMenuObj: CmsMenu = {
      id: newId,
      location: newMenuLocation,
      name: newMenuName.trim(),
      items: [],
      updatedAt: new Date().toISOString()
    };

    try {
      const res = await cmsApiService.saveMenu(newMenuObj);
      if (res && res.success) {
        setMenus(prev => [...prev, newMenuObj]);
        setSelectedMenuId(newId);
        setCurrentItems([]);
        setIsNewMenuModalOpen(false);
        setNewMenuName('');
        // Log revision
        cmsApiService.createRevision({
          entityType: 'menu',
          entityId: newId,
          action: 'create',
          dataJson: JSON.stringify(newMenuObj),
          author: 'Admin',
          revisionNote: `نیا مینیو "${newMenuObj.name}" بنایا گیا`
        }).catch(() => {});
        setSuccessMsg(`نیا مینیو "${newMenuObj.name}" کامیابی سے بن گیا۔`);
        setTimeout(() => setSuccessMsg(''), 4000);
      }
    } catch (err: any) {
      alert('مینیو بنانے میں خرابی: ' + err?.message);
    }
  };

  const activeMenu = menus.find(m => m.id === selectedMenuId) || menus[0];

  return (
    <div className="space-y-6 font-urdu" dir="rtl">
      {/* Top Header Card */}
      <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-stone-200 dark:border-slate-800 shadow-sm flex flex-wrap items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300">
              <MenuIcon className="w-5 h-5" />
            </div>
            <h2 className="text-xl font-black text-stone-900 dark:text-white">
              مینیو بلڈر (WordPress Style Menu Builder)
            </h2>
            <span className="px-2.5 py-0.5 rounded-full bg-amber-500/10 text-amber-700 dark:text-amber-300 text-xs font-bold border border-amber-500/20 font-sans">
              Navigation Hierarchy
            </span>
          </div>
          <p className="text-xs text-stone-500 dark:text-stone-400">
            ہیڈر، فوٹر اور ٹاپ بار کے تمام مینیوز، ڈراپ ڈاؤن لسٹس اور کسٹم روابط کی مکمل درجہ بندی۔
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsNewMenuModalOpen(true)}
            className="px-4 py-2.5 bg-stone-100 dark:bg-slate-800 hover:bg-stone-200 dark:hover:bg-slate-700 text-stone-800 dark:text-stone-200 font-bold text-xs rounded-xl border border-stone-300 dark:border-slate-700 flex items-center gap-2 cursor-pointer transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>نیا مینیو بنائیں</span>
          </button>
          
          <button
            onClick={handleSaveMenuToServer}
            disabled={isSaving}
            className="px-5 py-2.5 bg-[#5C4632] hover:bg-[#433123] text-amber-300 font-bold text-xs rounded-xl shadow-md border border-[#B88A3B] flex items-center gap-2 cursor-pointer transition-all disabled:opacity-60"
          >
            {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            <span>مینیو محفوظ کریں (Save Menu)</span>
          </button>
        </div>
      </div>

      {/* Notice Banner */}
      <div className="p-3.5 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-800/60 text-amber-900 dark:text-amber-300 text-xs flex items-center gap-2.5">
        <Info className="w-4 h-4 text-[#B88A3B] flex-shrink-0" />
        <span>
          <strong>نوٹ:</strong> فیز ۳ میں مینیو مینجمنٹ صرف ایڈمن کنٹرول اور ڈیٹا بیس میں محفوظ کرنے کے لیے ہے۔ پبلک ویب سائٹ کا لائیو نیویگیشن بار بعد کے فیز میں اس سے منسلک ہوگا۔
        </span>
      </div>

      {/* Notifications */}
      {successMsg && (
        <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-300 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 text-xs font-bold flex items-center gap-2 shadow-xs">
          <CheckCircle className="w-4 h-4 text-emerald-600 flex-shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {errorMsg && (
        <div className="p-4 rounded-xl bg-red-50 dark:bg-red-950/60 border border-red-300 dark:border-red-800 text-red-800 dark:text-red-300 text-xs font-bold flex items-center gap-2 shadow-xs">
          <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Main Grid: Menu Selector & Items Tree */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left 4 Cols: Menu Selection & Quick Add Items */}
        <div className="lg:col-span-4 space-y-4">
          
          {/* Menu Selector Card */}
          <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-stone-200 dark:border-slate-800 shadow-sm space-y-3">
            <label className="block text-xs font-bold text-stone-700 dark:text-stone-300">
              ترمیم کے لیے مینیو منتخب کریں (Select Menu):
            </label>
            <select
              value={selectedMenuId}
              onChange={(e) => handleSelectMenu(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl border border-stone-300 dark:border-slate-700 bg-stone-50 dark:bg-slate-800 text-xs font-bold text-stone-900 dark:text-white focus:outline-hidden"
            >
              {menus.map(m => (
                <option key={m.id} value={m.id}>
                  {m.name} ({m.location})
                </option>
              ))}
            </select>

            <div className="pt-2 border-t border-stone-100 dark:border-slate-800 text-[11px] text-stone-500">
              مقام: <span className="font-mono font-bold text-stone-700 dark:text-stone-300">{activeMenu?.location}</span>
            </div>
          </div>

          {/* Quick Add Elements Card */}
          <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-stone-200 dark:border-slate-800 shadow-sm space-y-3">
            <h3 className="font-bold text-xs text-stone-900 dark:text-white flex items-center gap-1.5 border-b border-stone-100 dark:border-slate-800 pb-2">
              <Plus className="w-3.5 h-3.5 text-[#B88A3B]" />
              <span>مینیو میں آئٹم شامل کریں (Add Menu Item)</span>
            </h3>

            <button
              type="button"
              onClick={() => openAddItemModal()}
              className="w-full py-2.5 px-4 bg-[#5C4632] hover:bg-[#433123] text-amber-300 rounded-xl text-xs font-bold border border-[#B88A3B] shadow-xs flex items-center justify-center gap-2 cursor-pointer transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>نیا آئٹم کسٹمائز کریں (Custom Item)</span>
            </button>
          </div>

        </div>

        {/* Right 8 Cols: Menu Items Structure & Ordering Tree */}
        <div className="lg:col-span-8">
          <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-stone-200 dark:border-slate-800 shadow-sm space-y-4">
            
            <div className="flex items-center justify-between border-b border-stone-100 dark:border-slate-800 pb-3">
              <div>
                <h3 className="font-bold text-sm text-stone-900 dark:text-white">
                  مینیو کا ڈھانچہ: {activeMenu?.name}
                </h3>
                <p className="text-[11px] text-stone-400">
                  درجہ بندی اور ترتیب اوپر نیچے کرنے کے لیے تیر کے نشانات کا استعمال فرمائیں۔
                </p>
              </div>

              <span className="text-xs font-mono font-bold px-2.5 py-1 rounded-full bg-stone-100 dark:bg-slate-800 text-stone-600 dark:text-stone-300">
                {currentItems.length} Items
              </span>
            </div>

            {isLoading ? (
              <div className="py-16 flex flex-col items-center justify-center gap-3 text-stone-400">
                <Loader2 className="w-6 h-6 animate-spin text-[#B88A3B]" />
                <span className="text-xs">مینیو لوڈ ہو رہا ہے...</span>
              </div>
            ) : currentItems.length === 0 ? (
              <div className="py-16 text-center text-stone-400 space-y-2">
                <Layers className="w-10 h-10 mx-auto opacity-30 text-[#B88A3B]" />
                <p className="text-xs font-bold">اس مینیو میں کوئی آئٹم شامل نہیں ہے۔</p>
                <p className="text-[11px]">بائیں جانب سے آئٹمز شامل کریں۔</p>
              </div>
            ) : (
              <div className="space-y-2">
                {currentItems.map((item, index) => {
                  const isChild = Boolean(item.parentId);
                  return (
                    <div
                      key={item.id}
                      className={`p-3.5 rounded-xl border transition-all flex flex-wrap items-center justify-between gap-3 ${
                        isChild 
                          ? 'mr-8 bg-amber-50/40 dark:bg-amber-950/20 border-amber-200 dark:border-amber-900/40' 
                          : 'bg-stone-50 dark:bg-slate-800/70 border-stone-200 dark:border-slate-700'
                      } ${!item.isEnabled ? 'opacity-50' : ''}`}
                    >
                      <div className="flex items-center gap-3">
                        {isChild && (
                          <CornerDownLeft className="w-4 h-4 text-[#B88A3B] opacity-70" />
                        )}
                        <div className="space-y-0.5">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-xs text-stone-900 dark:text-white">
                              {item.title.ur || item.title.en}
                            </span>
                            {item.title.en && item.title.ur && (
                              <span className="text-[10px] text-stone-500 font-sans" dir="ltr">
                                ({item.title.en})
                              </span>
                            )}
                            {isChild && (
                              <span className="px-1.5 py-0.2 rounded bg-amber-200/60 dark:bg-amber-900/60 text-amber-900 dark:text-amber-200 text-[9px] font-bold">
                                ذیلی (Sub-item)
                              </span>
                            )}
                          </div>
                          <div className="flex items-center gap-2 text-[11px] text-stone-500">
                            <span className="font-mono" dir="ltr">{item.url}</span>
                            {item.target === '_blank' && <ExternalLink className="w-3 h-3 text-stone-400" />}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => handleMoveItem(index, 'up')}
                          disabled={index === 0}
                          className="p-1.5 rounded-lg bg-white dark:bg-slate-900 border border-stone-200 dark:border-slate-700 text-stone-600 dark:text-stone-300 hover:text-stone-900 disabled:opacity-30 cursor-pointer"
                          title="اوپر کریں (Move Up)"
                        >
                          <ChevronUp className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleMoveItem(index, 'down')}
                          disabled={index === currentItems.length - 1}
                          className="p-1.5 rounded-lg bg-white dark:bg-slate-900 border border-stone-200 dark:border-slate-700 text-stone-600 dark:text-stone-300 hover:text-stone-900 disabled:opacity-30 cursor-pointer"
                          title="نیچے کریں (Move Down)"
                        >
                          <ChevronDown className="w-3.5 h-3.5" />
                        </button>

                        <button
                          type="button"
                          onClick={() => handleToggleItem(item.id)}
                          className="p-1.5 rounded-lg bg-white dark:bg-slate-900 border border-stone-200 dark:border-slate-700 text-stone-600 dark:text-stone-300 hover:text-stone-900 cursor-pointer"
                          title={item.isEnabled ? 'غیر فعال کریں' : 'فعال کریں'}
                        >
                          {item.isEnabled ? <Eye className="w-3.5 h-3.5 text-emerald-600" /> : <EyeOff className="w-3.5 h-3.5 text-stone-400" />}
                        </button>

                        <button
                          type="button"
                          onClick={() => openEditItemModal(item)}
                          className="p-1.5 rounded-lg bg-white dark:bg-slate-900 border border-stone-200 dark:border-slate-700 text-blue-600 hover:bg-blue-50 cursor-pointer"
                          title="ترمیم کریں (Edit)"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>

                        <button
                          type="button"
                          onClick={() => handleDeleteItem(item.id)}
                          className="p-1.5 rounded-lg bg-white dark:bg-slate-900 border border-stone-200 dark:border-slate-700 text-red-600 hover:bg-red-50 cursor-pointer"
                          title="حذف کریں (Delete)"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

          </div>
        </div>

      </div>

      {/* Add / Edit Item Modal */}
      {isItemModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 max-w-lg w-full rounded-3xl p-6 border border-stone-200 dark:border-slate-800 shadow-2xl space-y-4">
            
            <div className="flex items-center justify-between border-b border-stone-100 dark:border-slate-800 pb-3">
              <h3 className="font-bold text-sm text-stone-900 dark:text-white">
                {editingItemId ? 'مینیو آئٹم میں ترمیم' : 'نیا مینیو آئٹم شامل کریں'}
              </h3>
              <button
                type="button"
                onClick={() => setIsItemModalOpen(false)}
                className="text-stone-400 hover:text-stone-600"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-stone-700 dark:text-stone-300 mb-1">
                  عنوان (اردو) <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={itemLabelUr}
                  onChange={(e) => setItemLabelUr(e.target.value)}
                  placeholder="مثلاً: تعارفِ جامعہ"
                  className="w-full px-3 py-2 rounded-xl border border-stone-300 dark:border-slate-700 bg-stone-50 dark:bg-slate-800 text-stone-900 dark:text-white font-bold"
                  dir="rtl"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-stone-700 dark:text-stone-300 mb-1">
                    العنوان (عربی)
                  </label>
                  <input
                    type="text"
                    value={itemLabelAr}
                    onChange={(e) => setItemLabelAr(e.target.value)}
                    placeholder="مثال: عن الجامعة"
                    className="w-full px-3 py-2 rounded-xl border border-stone-300 dark:border-slate-700 bg-stone-50 dark:bg-slate-800 text-stone-900 dark:text-white"
                    dir="rtl"
                  />
                </div>
                <div>
                  <label className="block font-bold text-stone-700 dark:text-stone-300 mb-1">
                    Title (English)
                  </label>
                  <input
                    type="text"
                    value={itemLabelEn}
                    onChange={(e) => setItemLabelEn(e.target.value)}
                    placeholder="e.g. About Jamia"
                    className="w-full px-3 py-2 rounded-xl border border-stone-300 dark:border-slate-700 bg-stone-50 dark:bg-slate-800 text-stone-900 dark:text-white font-sans"
                    dir="ltr"
                  />
                </div>
              </div>

              {/* Link Type Selector */}
              <div>
                <label className="block font-bold text-stone-700 dark:text-stone-300 mb-1">
                  روابط کی قسم (Link Type)
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setItemLinkType('page')}
                    className={`py-2 px-2 rounded-xl font-bold transition-all ${
                      itemLinkType === 'page'
                        ? 'bg-[#5C4632] text-amber-300 border border-[#B88A3B]'
                        : 'bg-stone-100 dark:bg-slate-800 text-stone-700 dark:text-stone-300'
                    }`}
                  >
                    مستقل صفحہ
                  </button>
                  <button
                    type="button"
                    onClick={() => setItemLinkType('tab')}
                    className={`py-2 px-2 rounded-xl font-bold transition-all ${
                      itemLinkType === 'tab'
                        ? 'bg-[#5C4632] text-amber-300 border border-[#B88A3B]'
                        : 'bg-stone-100 dark:bg-slate-800 text-stone-700 dark:text-stone-300'
                    }`}
                  >
                    سیکشن / پورٹل
                  </button>
                  <button
                    type="button"
                    onClick={() => setItemLinkType('custom')}
                    className={`py-2 px-2 rounded-xl font-bold transition-all ${
                      itemLinkType === 'custom'
                        ? 'bg-[#5C4632] text-amber-300 border border-[#B88A3B]'
                        : 'bg-stone-100 dark:bg-slate-800 text-stone-700 dark:text-stone-300'
                    }`}
                  >
                    کسٹم URL
                  </button>
                </div>
              </div>

              {itemLinkType === 'page' && (
                <div>
                  <label className="block font-bold text-stone-700 dark:text-stone-300 mb-1">
                    صفحہ منتخب کریں
                  </label>
                  <select
                    value={itemSelectedPage}
                    onChange={(e) => setItemSelectedPage(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-stone-300 dark:border-slate-700 bg-stone-50 dark:bg-slate-800 text-stone-900 dark:text-white font-bold"
                  >
                    {pages.map(p => (
                      <option key={p.id} value={p.slug}>
                        {p.title.ur || p.slug} (/{p.slug})
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {itemLinkType === 'tab' && (
                <div>
                  <label className="block font-bold text-stone-700 dark:text-stone-300 mb-1">
                    ویب پورٹل سیکشن منتخب کریں
                  </label>
                  <select
                    value={itemSelectedTab}
                    onChange={(e) => setItemSelectedTab(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-stone-300 dark:border-slate-700 bg-stone-50 dark:bg-slate-800 text-stone-900 dark:text-white font-bold"
                  >
                    {BUILTIN_TABS.map(t => (
                      <option key={t.id} value={t.id}>
                        {t.labelUr} ({t.labelEn})
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {itemLinkType === 'custom' && (
                <div>
                  <label className="block font-bold text-stone-700 dark:text-stone-300 mb-1">
                    کسٹم یو آر ایل (Custom URL)
                  </label>
                  <input
                    type="text"
                    value={itemCustomUrl}
                    onChange={(e) => setItemCustomUrl(e.target.value)}
                    placeholder="https://... یا #"
                    className="w-full px-3 py-2 rounded-xl border border-stone-300 dark:border-slate-700 bg-stone-50 dark:bg-slate-800 text-stone-900 dark:text-white font-mono"
                    dir="ltr"
                  />
                </div>
              )}

              <div>
                <label className="block font-bold text-stone-700 dark:text-stone-300 mb-1">
                  پیرنٹ مینیو آئٹم (Parent Item - ڈراپ ڈاؤن بنانے کے لیے)
                </label>
                <select
                  value={itemParentId}
                  onChange={(e) => setItemParentId(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-stone-300 dark:border-slate-700 bg-stone-50 dark:bg-slate-800 text-stone-900 dark:text-white"
                >
                  <option value="">کوئی پیرنٹ نہیں (مرکزی آئٹم)</option>
                  {currentItems.filter(it => !it.parentId && it.id !== editingItemId).map(it => (
                    <option key={it.id} value={it.id}>
                      {it.title.ur || it.title.en}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex items-center justify-between pt-2">
                <label className="flex items-center gap-2 cursor-pointer font-bold text-stone-700 dark:text-stone-300">
                  <input
                    type="checkbox"
                    checked={itemTarget === '_blank'}
                    onChange={(e) => setItemTarget(e.target.checked ? '_blank' : '_self')}
                    className="rounded text-[#B88A3B]"
                  />
                  <span>نئے ٹیب میں کھولیں (Open in New Tab)</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer font-bold text-stone-700 dark:text-stone-300">
                  <input
                    type="checkbox"
                    checked={itemIsEnabled}
                    onChange={(e) => setItemIsEnabled(e.target.checked)}
                    className="rounded text-[#B88A3B]"
                  />
                  <span>فعال (Enabled)</span>
                </label>
              </div>

            </div>

            <div className="flex items-center gap-2 pt-3 border-t border-stone-100 dark:border-slate-800">
              <button
                type="button"
                onClick={() => setIsItemModalOpen(false)}
                className="flex-1 py-2 rounded-xl border border-stone-300 dark:border-slate-700 text-stone-700 dark:text-stone-300 font-bold text-xs"
              >
                منسوخ کریں
              </button>
              <button
                type="button"
                onClick={handleSaveItem}
                className="flex-1 py-2 rounded-xl bg-[#5C4632] text-amber-300 font-bold text-xs shadow-md border border-[#B88A3B]"
              >
                {editingItemId ? 'تبدیلی محفوظ کریں' : 'آئٹم شامل کریں'}
              </button>
            </div>

          </div>
        </div>
      )}

      {/* Create New Menu Modal */}
      {isNewMenuModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 max-w-md w-full rounded-3xl p-6 border border-stone-200 dark:border-slate-800 shadow-2xl space-y-4">
            <h3 className="font-bold text-sm text-stone-900 dark:text-white border-b border-stone-100 dark:border-slate-800 pb-2">
              نیا مینیو شامل کریں
            </h3>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-stone-700 dark:text-stone-300 mb-1">
                  مینیو کا نام (Menu Name)
                </label>
                <input
                  type="text"
                  value={newMenuName}
                  onChange={(e) => setNewMenuName(e.target.value)}
                  placeholder="مثلاً: مرکزی نیویگیشن مینیو"
                  className="w-full px-3 py-2 rounded-xl border border-stone-300 dark:border-slate-700 bg-stone-50 dark:bg-slate-800 text-stone-900 dark:text-white font-bold"
                />
              </div>

              <div>
                <label className="block font-bold text-stone-700 dark:text-stone-300 mb-1">
                  مقام (Theme Location)
                </label>
                <select
                  value={newMenuLocation}
                  onChange={(e) => setNewMenuLocation(e.target.value as any)}
                  className="w-full px-3 py-2 rounded-xl border border-stone-300 dark:border-slate-700 bg-stone-50 dark:bg-slate-800 text-stone-900 dark:text-white"
                >
                  <option value="header_main">مرکزی ہیڈر (Header Main Menu)</option>
                  <option value="top_bar">ٹاپ بار (Top Bar Secondary)</option>
                  <option value="footer_quick">فوٹر کوئیک لنکس (Footer Quick Links)</option>
                  <option value="footer_academics">فوٹر تعلیمی لنکس (Footer Academics)</option>
                  <option value="footer_sharia">فوٹر شرعی و فتاویٰ لنکس (Footer Sharia)</option>
                </select>
              </div>
            </div>

            <div className="flex items-center gap-2 pt-3 border-t border-stone-100 dark:border-slate-800">
              <button
                type="button"
                onClick={() => setIsNewMenuModalOpen(false)}
                className="flex-1 py-2 rounded-xl border border-stone-300 dark:border-slate-700 text-stone-700 dark:text-stone-300 font-bold text-xs"
              >
                منسوخ کریں
              </button>
              <button
                type="button"
                onClick={handleCreateNewMenu}
                className="flex-1 py-2 rounded-xl bg-[#5C4632] text-amber-300 font-bold text-xs shadow-md border border-[#B88A3B]"
              >
                مینیو بنائیں
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
