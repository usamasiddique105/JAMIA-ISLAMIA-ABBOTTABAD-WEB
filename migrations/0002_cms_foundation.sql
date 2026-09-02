-- ==============================================================================
-- Cloudflare D1 Migration: 0002_cms_foundation.sql
-- Description: Non-destructive, idempotent migration for CMS database tables
-- ==============================================================================

-- 1. CMS Pages Table
CREATE TABLE IF NOT EXISTS cms_pages (
  id TEXT PRIMARY KEY,
  slug TEXT NOT NULL UNIQUE,
  title_ur TEXT NOT NULL,
  title_ar TEXT,
  title_en TEXT,
  content_ur TEXT NOT NULL,
  content_ar TEXT,
  content_en TEXT,
  excerpt_ur TEXT,
  excerpt_ar TEXT,
  excerpt_en TEXT,
  featured_image TEXT,
  status TEXT NOT NULL DEFAULT 'published',
  visibility TEXT NOT NULL DEFAULT 'public',
  password TEXT,
  seo_title_ur TEXT,
  seo_title_ar TEXT,
  seo_title_en TEXT,
  seo_desc_ur TEXT,
  seo_desc_ar TEXT,
  seo_desc_en TEXT,
  og_image TEXT,
  author TEXT,
  template TEXT NOT NULL DEFAULT 'default',
  order_index INTEGER NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

-- 2. CMS Menus Table
CREATE TABLE IF NOT EXISTS cms_menus (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  location TEXT NOT NULL UNIQUE,
  items_json TEXT,
  updated_at TEXT NOT NULL
);

-- 3. CMS Normalized Menu Items Table (Supports multi-level nested dropdowns)
CREATE TABLE IF NOT EXISTS cms_menu_items (
  id TEXT PRIMARY KEY,
  menu_id TEXT NOT NULL,
  parent_id TEXT,
  label_ur TEXT NOT NULL,
  label_ar TEXT,
  label_en TEXT,
  target_type TEXT NOT NULL DEFAULT 'custom',
  target_value TEXT,
  url TEXT NOT NULL,
  order_index INTEGER NOT NULL DEFAULT 0,
  is_enabled INTEGER NOT NULL DEFAULT 1,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

-- 4. CMS Media Library Metadata Table
CREATE TABLE IF NOT EXISTS cms_media (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  filename TEXT NOT NULL,
  file_type TEXT NOT NULL DEFAULT 'image',
  mime_type TEXT,
  file_size INTEGER NOT NULL DEFAULT 0,
  url TEXT NOT NULL,
  thumbnail_url TEXT,
  alt_text TEXT,
  caption TEXT,
  uploaded_by TEXT,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

-- 5. CMS Homepage & Landing Sections Table
CREATE TABLE IF NOT EXISTS cms_sections (
  id TEXT PRIMARY KEY,
  section_key TEXT NOT NULL UNIQUE,
  name_ur TEXT NOT NULL,
  name_ar TEXT,
  name_en TEXT,
  is_enabled INTEGER NOT NULL DEFAULT 1,
  order_index INTEGER NOT NULL DEFAULT 0,
  title_ur TEXT NOT NULL,
  title_ar TEXT,
  title_en TEXT,
  subtitle_ur TEXT,
  subtitle_ar TEXT,
  subtitle_en TEXT,
  content_ur TEXT,
  content_ar TEXT,
  content_en TEXT,
  image_url TEXT,
  bg_color TEXT,
  bg_image_url TEXT,
  button_text_ur TEXT,
  button_text_ar TEXT,
  button_text_en TEXT,
  button_url TEXT,
  config_json TEXT,
  updated_at TEXT NOT NULL
);

-- 6. CMS Theme & Appearance Settings Table
CREATE TABLE IF NOT EXISTS cms_theme_settings (
  id TEXT PRIMARY KEY,
  data_json TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

-- 7. CMS SEO & Meta Settings Table
CREATE TABLE IF NOT EXISTS cms_seo_settings (
  id TEXT PRIMARY KEY,
  data_json TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

-- 8. CMS Content Versioning & Revisions Table
CREATE TABLE IF NOT EXISTS cms_revisions (
  id TEXT PRIMARY KEY,
  entity_type TEXT NOT NULL,
  entity_id TEXT NOT NULL,
  data_json TEXT NOT NULL,
  author TEXT NOT NULL,
  revision_note TEXT,
  created_at TEXT NOT NULL
);

-- Safe non-destructive indexes
CREATE INDEX IF NOT EXISTS idx_cms_pages_slug ON cms_pages(slug);
CREATE INDEX IF NOT EXISTS idx_cms_pages_status ON cms_pages(status);
CREATE INDEX IF NOT EXISTS idx_cms_menus_loc ON cms_menus(location);
CREATE INDEX IF NOT EXISTS idx_cms_menu_items_menu ON cms_menu_items(menu_id);
CREATE INDEX IF NOT EXISTS idx_cms_menu_items_parent ON cms_menu_items(parent_id);
CREATE INDEX IF NOT EXISTS idx_cms_sections_key ON cms_sections(section_key);
CREATE INDEX IF NOT EXISTS idx_cms_revisions_entity ON cms_revisions(entity_type, entity_id);
