import { 
  CmsPage, 
  CmsMenu, 
  CmsMenuItemRow, 
  CmsMedia, 
  CmsSection, 
  CmsThemeSettings, 
  CmsSeoSettings, 
  CmsRevision 
} from '../types';
import { apiFetch } from './cloudApiAdapter';
import { 
  INITIAL_CMS_PAGES, 
  INITIAL_CMS_MENUS, 
  INITIAL_CMS_SECTIONS, 
  INITIAL_CMS_THEME_SETTINGS, 
  INITIAL_CMS_SEO_SETTINGS, 
  INITIAL_CMS_MEDIA 
} from '../data/initialCmsData';

export const cmsApiService = {
  // 1. Pages API
  async getPages(): Promise<CmsPage[]> {
    try {
      const res = await apiFetch('/api/cms/pages');
      if (res && res.success && Array.isArray(res.data) && res.data.length > 0) {
        return res.data;
      }
      return INITIAL_CMS_PAGES;
    } catch (err) {
      console.warn('CMS Pages API fetch fallback to initial data:', err);
      return INITIAL_CMS_PAGES;
    }
  },

  async getPage(idOrSlug: string): Promise<CmsPage | null> {
    try {
      const res = await apiFetch(`/api/cms/pages/${encodeURIComponent(idOrSlug)}`);
      if (res && res.success && res.data) {
        return res.data;
      }
      const local = INITIAL_CMS_PAGES.find(p => p.id === idOrSlug || p.slug === idOrSlug);
      return local || null;
    } catch (err) {
      const local = INITIAL_CMS_PAGES.find(p => p.id === idOrSlug || p.slug === idOrSlug);
      return local || null;
    }
  },

  async savePage(page: Partial<CmsPage>): Promise<{ success: boolean; id?: string; slug?: string; error?: string }> {
    try {
      const res = await apiFetch('/api/cms/pages', {
        method: 'POST',
        body: JSON.stringify(page),
      });
      return res;
    } catch (err: any) {
      return { success: false, error: err?.message || 'صفحہ محفوظ کرنے میں خرابی پیش آئی۔' };
    }
  },

  async deletePage(id: string): Promise<{ success: boolean; error?: string }> {
    try {
      const res = await apiFetch(`/api/cms/pages/${encodeURIComponent(id)}`, {
        method: 'DELETE',
      });
      return res;
    } catch (err: any) {
      return { success: false, error: err?.message || 'صفحہ حذف کرنے میں خرابی پیش آئی۔' };
    }
  },

  // 2. Menus API
  async getMenus(): Promise<CmsMenu[]> {
    try {
      const res = await apiFetch('/api/cms/menus');
      if (res && res.success && Array.isArray(res.data) && res.data.length > 0) {
        return res.data;
      }
      return INITIAL_CMS_MENUS;
    } catch (err) {
      console.warn('CMS Menus API fetch fallback:', err);
      return INITIAL_CMS_MENUS;
    }
  },

  async getMenu(idOrLocation: string): Promise<CmsMenu | null> {
    try {
      const res = await apiFetch(`/api/cms/menus/${encodeURIComponent(idOrLocation)}`);
      if (res && res.success && res.data) {
        return res.data;
      }
      const local = INITIAL_CMS_MENUS.find(m => m.id === idOrLocation || m.location === idOrLocation);
      return local || null;
    } catch {
      const local = INITIAL_CMS_MENUS.find(m => m.id === idOrLocation || m.location === idOrLocation);
      return local || null;
    }
  },

  async saveMenu(menu: Partial<CmsMenu>): Promise<{ success: boolean; id?: string; error?: string }> {
    try {
      const res = await apiFetch('/api/cms/menus', {
        method: 'POST',
        body: JSON.stringify(menu),
      });
      return res;
    } catch (err: any) {
      return { success: false, error: err?.message || 'مینیو محفوظ کرنے میں خرابی پیش آئی۔' };
    }
  },

  async deleteMenu(id: string): Promise<{ success: boolean; error?: string }> {
    try {
      const res = await apiFetch(`/api/cms/menus/${encodeURIComponent(id)}`, {
        method: 'DELETE',
      });
      return res;
    } catch (err: any) {
      return { success: false, error: err?.message || 'مینیو حذف کرنے میں خرابی پیش آئی۔' };
    }
  },

  // 2.5 Normalized Menu Items API
  async getMenuItems(menuId?: string): Promise<CmsMenuItemRow[]> {
    try {
      const url = menuId ? `/api/cms/menu-items?menu_id=${encodeURIComponent(menuId)}` : '/api/cms/menu-items';
      const res = await apiFetch(url);
      if (res && res.success && Array.isArray(res.data)) {
        return res.data;
      }
      return [];
    } catch (err) {
      console.warn('CMS Menu Items API fallback:', err);
      return [];
    }
  },

  async saveMenuItem(item: Partial<CmsMenuItemRow>): Promise<{ success: boolean; id?: string; error?: string }> {
    try {
      const res = await apiFetch('/api/cms/menu-items', {
        method: 'POST',
        body: JSON.stringify(item),
      });
      return res;
    } catch (err: any) {
      return { success: false, error: err?.message || 'مینیو آئٹم محفوظ کرنے میں خرابی پیش آئی۔' };
    }
  },

  async deleteMenuItem(id: string): Promise<{ success: boolean; error?: string }> {
    try {
      const res = await apiFetch(`/api/cms/menu-items/${encodeURIComponent(id)}`, {
        method: 'DELETE',
      });
      return res;
    } catch (err: any) {
      return { success: false, error: err?.message || 'مینیو آئٹم حذف کرنے میں خرابی پیش آئی۔' };
    }
  },

  // 3. Media Library API
  async getMedia(): Promise<CmsMedia[]> {
    try {
      const res = await apiFetch('/api/cms/media');
      if (res && res.success && Array.isArray(res.data) && res.data.length > 0) {
        return res.data;
      }
      return INITIAL_CMS_MEDIA;
    } catch (err) {
      console.warn('CMS Media API fallback:', err);
      return INITIAL_CMS_MEDIA;
    }
  },

  async saveMedia(mediaItem: Partial<CmsMedia>): Promise<{ success: boolean; id?: string; error?: string }> {
    try {
      const res = await apiFetch('/api/cms/media', {
        method: 'POST',
        body: JSON.stringify(mediaItem),
      });
      return res;
    } catch (err: any) {
      return { success: false, error: err?.message || 'میڈیا محفوظ کرنے میں خرابی پیش آئی۔' };
    }
  },

  async deleteMedia(id: string): Promise<{ success: boolean; error?: string }> {
    try {
      const res = await apiFetch(`/api/cms/media/${encodeURIComponent(id)}`, {
        method: 'DELETE',
      });
      return res;
    } catch (err: any) {
      return { success: false, error: err?.message || 'میڈیا حذف کرنے میں خرابی پیش آئی۔' };
    }
  },

  // 4. Sections API
  async getSections(): Promise<CmsSection[]> {
    try {
      const res = await apiFetch('/api/cms/sections');
      if (res && res.success && Array.isArray(res.data) && res.data.length > 0) {
        return res.data;
      }
      return INITIAL_CMS_SECTIONS;
    } catch (err) {
      console.warn('CMS Sections API fallback:', err);
      return INITIAL_CMS_SECTIONS;
    }
  },

  async saveSection(section: Partial<CmsSection>): Promise<{ success: boolean; id?: string; error?: string }> {
    try {
      const res = await apiFetch('/api/cms/sections', {
        method: 'POST',
        body: JSON.stringify(section),
      });
      return res;
    } catch (err: any) {
      return { success: false, error: err?.message || 'سیکشن محفوظ کرنے میں خرابی پیش آئی۔' };
    }
  },

  // 5. Theme Settings API
  async getTheme(): Promise<CmsThemeSettings> {
    try {
      const res = await apiFetch('/api/cms/theme');
      if (res && res.success && res.data) {
        return { ...INITIAL_CMS_THEME_SETTINGS, ...res.data };
      }
      return INITIAL_CMS_THEME_SETTINGS;
    } catch (err) {
      console.warn('CMS Theme API fallback:', err);
      return INITIAL_CMS_THEME_SETTINGS;
    }
  },

  async saveTheme(theme: Partial<CmsThemeSettings>): Promise<{ success: boolean; error?: string }> {
    try {
      const res = await apiFetch('/api/cms/theme', {
        method: 'POST',
        body: JSON.stringify(theme),
      });
      return res;
    } catch (err: any) {
      return { success: false, error: err?.message || 'تھیم ترتیبات محفوظ کرنے میں خرابی پیش آئی۔' };
    }
  },

  // 6. SEO Settings API
  async getSeo(): Promise<CmsSeoSettings> {
    try {
      const res = await apiFetch('/api/cms/seo');
      if (res && res.success && res.data) {
        return { ...INITIAL_CMS_SEO_SETTINGS, ...res.data };
      }
      return INITIAL_CMS_SEO_SETTINGS;
    } catch (err) {
      console.warn('CMS SEO API fallback:', err);
      return INITIAL_CMS_SEO_SETTINGS;
    }
  },

  async saveSeo(seo: Partial<CmsSeoSettings>): Promise<{ success: boolean; error?: string }> {
    try {
      const res = await apiFetch('/api/cms/seo', {
        method: 'POST',
        body: JSON.stringify(seo),
      });
      return res;
    } catch (err: any) {
      return { success: false, error: err?.message || 'SEO ترتیبات محفوظ کرنے میں خرابی پیش آئی۔' };
    }
  },

  // 7. Revisions API
  async getRevisions(entityType: string, entityId: string): Promise<CmsRevision[]> {
    try {
      const res = await apiFetch(`/api/cms/revisions?entity_type=${encodeURIComponent(entityType)}&entity_id=${encodeURIComponent(entityId)}`);
      if (res && res.success && Array.isArray(res.data)) {
        return res.data;
      }
      return [];
    } catch (err) {
      console.warn('CMS Revisions API fallback:', err);
      return [];
    }
  },

  async createRevision(revision: { entityType: string; entityId: string; dataJson: string; revisionNote?: string; author?: string }): Promise<{ success: boolean; error?: string }> {
    try {
      const res = await apiFetch('/api/cms/revisions', {
        method: 'POST',
        body: JSON.stringify(revision),
      });
      return res;
    } catch (err: any) {
      return { success: false, error: err?.message || 'ریویژن محفوظ کرنے میں خرابی پیش آئی۔' };
    }
  }
};
