# Design System Specification — Jamia Islamia Abbottabad

## 1. Palette & Color System

| Token Name | Hex Code | Purpose / Usage |
| :--- | :--- | :--- |
| `bg-warm-cream` | `#F8F4EC` | Primary background canvas, card background in light mode |
| `bg-bronze-dark` | `#5C4632` | Header background, primary buttons, footer, navigation bar |
| `text-gold-accent` | `#B88A3B` | Borders, badge icons, highlights, active menu states, seal outer border |
| `text-charcoal` | `#2B2B2B` | Primary body text in light mode |
| `bg-[#433324]` | `#433324` | Hover state for bronze buttons |
| `bg-[#a17831]` | `#a17831` | Hover state for gold buttons |
| `dark:bg-slate-900` | `#0F172A` | Primary background canvas in dark mode |
| `dark:bg-slate-950` | `#020617` | Card background in dark mode |

---

## 2. Typography Rules

### Font Families
- **Urdu (`.font-urdu`)**:
  - CSS Fallback: `'Jameel Noori Nastaleeq', 'Noto Nastaliq Urdu', 'Gulzar', serif`
  - Default Line Height: `leading-[2.0]` to `leading-[2.2]`
- **Arabic (`.font-arabic`)**:
  - CSS Fallback: `'Amiri', 'Noto Naskh Arabic', 'IBM Plex Sans Arabic', serif`
  - Default Line Height: `leading-[1.85]`
- **English Title (`.font-serif-title`)**:
  - CSS Fallback: `'Playfair Display', 'Merriweather', serif`
- **English Body (`.font-inter`)**:
  - CSS Fallback: `'Inter', 'Source Sans 3', sans-serif`

---

## 3. Modular Scale & Proportions

| Element | Urdu/Arabic Size | English Size | Line Height |
| :--- | :--- | :--- | :--- |
| **Hero Title** | `32px - 38px` | `24px - 28px` | `leading-[1.5]` |
| **Section Title** | `26px - 30px` | `20px - 24px` | `leading-[1.6]` |
| **Card Title** | `18px - 22px` | `16px - 18px` | `leading-[1.5]` |
| **Nav Menu** | `18px - 20px` | `14px - 16px` | `leading-none` |
| **Body Text** | `15px - 17px` | `14px - 16px` | `leading-[1.8]` |
| **Button Text** | `14px - 16px` | `13px - 15px` | `leading-none` |

---

## 4. Spacing & Radius Rules
- **Container Radius**: `rounded-2xl` (`16px`) for cards; `rounded-3xl` (`24px`) for primary hero banner.
- **Inner Corner Nesting Rule**: `Inner Radius = Outer Radius - Padding`.
- **Card Padding**: `p-5` to `p-6` (`20px - 24px`).
- **Button Padding**: Horizontal padding = `2x` Vertical padding (e.g. `px-5 py-2.5`).
- **Section Gap**: `space-y-8` to `space-y-12` (`32px - 48px`).

---

## 5. Branding & Logo Guidelines
- **Emblem (JamiaSealLogo)**:
  - Circular double-ring with outer dashed geometric gold border (`#B88A3B`).
  - Inner cream/slate medallion.
  - Central Quran/Book badge icon inside a bronze circle.
  - Urdu typography: "جامعہ اسلامیہ" + "ایبٹ آباد".
  - Monospaced badge: "EST. 1951 PAKISTAN".
