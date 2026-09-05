-- ============================================================================
-- Jamia Islamia Abbottabad - CMS Engine Tables (WordPress-Style CMS Foundation)
-- Migration: 0001_cms_tables.sql
-- ============================================================================

PRAGMA foreign_keys = ON;

CREATE TABLE IF NOT EXISTS cms_pages (
  id              TEXT PRIMARY KEY,
  slug            TEXT NOT NULL UNIQUE,
  title_ur        TEXT NOT NULL,
  title_en        TEXT,
  title_ar        TEXT,
  content_ur      TEXT NOT NULL,
  content_en      TEXT,
  content_ar      TEXT,
  excerpt_ur      TEXT,
  excerpt_en      TEXT,
  excerpt_ar      TEXT,
  featured_image  TEXT,
  status          TEXT NOT NULL DEFAULT 'published',
  visibility      TEXT NOT NULL DEFAULT 'public',
  password        TEXT,
  seo_title_ur    TEXT,
  seo_title_en    TEXT,
  seo_title_ar    TEXT,
  seo_desc_ur     TEXT,
  seo_desc_en     TEXT,
  seo_desc_ar     TEXT,
  og_image        TEXT,
  author          TEXT DEFAULT 'جامعہ انتظامیہ',
  template        TEXT DEFAULT 'default',
  order_index     INTEGER DEFAULT 0,
  created_at      TEXT NOT NULL,
  updated_at      TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_cms_pages_slug   ON cms_pages(slug);
CREATE INDEX IF NOT EXISTS idx_cms_pages_status ON cms_pages(status);
CREATE INDEX IF NOT EXISTS idx_cms_pages_order  ON cms_pages(order_index);

CREATE TABLE IF NOT EXISTS cms_menus (
  id          TEXT PRIMARY KEY,
  location    TEXT NOT NULL,
  name        TEXT NOT NULL DEFAULT 'Navigation Menu',
  items_json  TEXT DEFAULT '[]',
  updated_at  TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_cms_menus_location ON cms_menus(location);

CREATE TABLE IF NOT EXISTS cms_menu_items (
  id            TEXT PRIMARY KEY,
  menu_id       TEXT NOT NULL,
  parent_id     TEXT,
  label_ur      TEXT NOT NULL,
  label_ar      TEXT,
  label_en      TEXT,
  target_type   TEXT DEFAULT 'custom',
  target_value  TEXT,
  url           TEXT NOT NULL DEFAULT '#',
  order_index   INTEGER DEFAULT 0,
  is_enabled    INTEGER NOT NULL DEFAULT 1,
  created_at    TEXT NOT NULL,
  updated_at    TEXT NOT NULL,
  FOREIGN KEY (menu_id)   REFERENCES cms_menus(id)      ON DELETE CASCADE,
  FOREIGN KEY (parent_id) REFERENCES cms_menu_items(id) ON DELETE SET NULL
);

CREATE INDEX IF NOT EXISTS idx_cms_menu_items_menu   ON cms_menu_items(menu_id);
CREATE INDEX IF NOT EXISTS idx_cms_menu_items_parent ON cms_menu_items(parent_id);
CREATE INDEX IF NOT EXISTS idx_cms_menu_items_order  ON cms_menu_items(menu_id, order_index);

CREATE TABLE IF NOT EXISTS cms_media (
  id             TEXT PRIMARY KEY,
  title          TEXT NOT NULL,
  filename       TEXT NOT NULL,
  file_type      TEXT DEFAULT 'image',
  mime_type      TEXT DEFAULT 'image/jpeg',
  file_size      INTEGER DEFAULT 0,
  url            TEXT NOT NULL,
  thumbnail_url  TEXT,
  alt_text       TEXT,
  caption        TEXT,
  uploaded_by    TEXT DEFAULT 'Admin',
  created_at     TEXT NOT NULL,
  updated_at     TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_cms_media_type    ON cms_media(file_type);
CREATE INDEX IF NOT EXISTS idx_cms_media_created ON cms_media(created_at);

CREATE TABLE IF NOT EXISTS cms_sections (
  id               TEXT PRIMARY KEY,
  section_key      TEXT NOT NULL UNIQUE,
  name_ur          TEXT NOT NULL,
  name_en          TEXT,
  name_ar          TEXT,
  is_enabled       INTEGER NOT NULL DEFAULT 1,
  order_index      INTEGER DEFAULT 0,
  title_ur         TEXT NOT NULL,
  title_en         TEXT,
  title_ar         TEXT,
  subtitle_ur      TEXT,
  subtitle_en      TEXT,
  subtitle_ar      TEXT,
  content_ur       TEXT,
  content_en       TEXT,
  content_ar       TEXT,
  image_url        TEXT,
  bg_color         TEXT,
  bg_image_url     TEXT,
  button_text_ur   TEXT,
  button_text_en   TEXT,
  button_text_ar   TEXT,
  button_url       TEXT,
  config_json      TEXT DEFAULT '{}',
  updated_at       TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_cms_sections_key   ON cms_sections(section_key);
CREATE INDEX IF NOT EXISTS idx_cms_sections_order ON cms_sections(order_index);

CREATE TABLE IF NOT EXISTS cms_theme_settings (
  id          TEXT PRIMARY KEY DEFAULT 'main',
  data_json   TEXT NOT NULL DEFAULT '{}',
  updated_at  TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS cms_seo_settings (
  id          TEXT PRIMARY KEY DEFAULT 'main',
  data_json   TEXT NOT NULL DEFAULT '{}',
  updated_at  TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS cms_revisions (
  id              TEXT PRIMARY KEY,
  entity_type     TEXT NOT NULL,
  entity_id       TEXT NOT NULL,
  action          TEXT DEFAULT 'update',
  data_json       TEXT NOT NULL,
  previous_state  TEXT,
  author          TEXT DEFAULT 'Admin',
  revision_note   TEXT,
  created_at      TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_cms_revisions_entity  ON cms_revisions(entity_type, entity_id);
CREATE INDEX IF NOT EXISTS idx_cms_revisions_created ON cms_revisions(created_at);

INSERT OR IGNORE INTO cms_theme_settings (id, data_json, updated_at)
VALUES ('main', '{}', CURRENT_TIMESTAMP);

INSERT OR IGNORE INTO cms_seo_settings (id, data_json, updated_at)
VALUES ('main', '{}', CURRENT_TIMESTAMP);

INSERT OR IGNORE INTO cms_menus (id, location, name, items_json, updated_at)
VALUES ('menu-header-main', 'header_main', 'Main Navigation', '[]', CURRENT_TIMESTAMP);
