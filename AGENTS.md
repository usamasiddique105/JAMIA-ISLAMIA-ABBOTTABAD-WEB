# AGENTS.md — Jamia Islamia Abbottabad Portal

## Project Overview
This project is the official digital portal for **Jamia Islamia Abbottabad, Pakistan** (established in 1951, affiliated with Wifaqul Madaris Al-Arabia Pakistan). It is a comprehensive, multi-lingual (Urdu, Arabic, English) traditional Islamic seminary portal featuring an Online Darul Ifta, Fatwa Archive (45,000+ rulings), Examination Results Portal, Digital Publications Library, Campus Media Gallery, and Online Donations & Zakat system.

---

## Core Directives & Rules
1. **Maintain Aesthetic Identity**: Always preserve the traditional Islamic, high-contrast, premium institutional aesthetic. Never replace the golden-cream-wood color palette or traditional Islamic geometric motifs with generic modern SaaS aesthetics.
2. **Language & Typography Integrity**:
   - **Urdu (`html[lang="ur"]`)**: Uses `Jameel Noori Nastaleeq` -> `Noto Nastaliq Urdu` -> `Gulzar` with a default line-height of `2.2`.
   - **Arabic (`html[lang="ar"]`)**: Uses `Amiri` -> `Noto Naskh Arabic` -> `IBM Plex Sans Arabic` with a line-height of `1.85`.
   - **English (`html[lang="en"]`)**: Uses `Playfair Display` for headings and `Inter` / `Source Sans 3` for body copy.
   - Always honor `dir="rtl"` for Urdu/Arabic and `dir="ltr"` for English across all views and modals.
3. **Hero Section Proportions**: Keep the hero section compact, balanced, and elegant (compact circular seal logo, ~36-42px main heading on desktop, compact description and single-line action buttons) so that the 8 quick access portals remain immediately visible on standard screens.
4. **No Destructive Design Changes**: Do NOT change color codes, core layout structures, or completed components without explicit user authorization.
5. **Permanent Darul Ifta Logo**: The official Thuluth calligraphy banner logo for Darul Ifta (`DARUL_IFTA_WHITE_LOGO_DATA_URI` in `/src/assets/darulIftaLogoBase64.ts` - "دارالافتاء الجامعة الاسلامية ايبت آباد") is permanently finalized and embedded as a base64 asset. Do NOT replace, change, remove, or modify this logo or its banner under any circumstances.

---

## Color Palette Tokens
- **Background Cream**: `#F8F4EC` (`bg-warm-cream`)
- **Deep Bronze / Wood**: `#5C4632` (`bg-[#5C4632]`)
- **Islamic Gold / Accent**: `#B88A3B` (`text-[#B88A3B]`, `bg-[#B88A3B]`)
- **Dark Mode Slate**: `#0F172A` / `#020617`
- **Charcoal Text**: `#2B2B2B`

---

## Component Architecture
- `/src/context/ThemeLanguageContext.tsx`: Manages language state (`ur`, `ar`, `en`), dark mode toggle, and translation keys `t(key)`.
- `/src/components/Navbar.tsx`: Top Bar, Institutional Header, Navigation Menu with multi-level dropdowns, Language Switcher, Search Modal Trigger.
- `/src/components/HeroSection.tsx`: Compact Institutional Banner & 8 Quick Access Portals.
- `/src/components/FatwaSection.tsx` & `/src/components/FatwaDetailModal.tsx` & `/src/components/FatwaSubmissionModal.tsx`: Online Darul Ifta & Searchable Fatwa Archive.
- `/src/components/ExamResultsView.tsx`: Roll Number Exam Results & Certificate Checker.
- `/src/components/LibraryView.tsx`: Publications, PDFs, and Jamia Monthly Journal.
- `/src/components/DonationView.tsx`: Zakat, Sadaqah, and Infrastructure Donation Portal with Bank/Easypaisa/JazzCash details.
- `/src/components/Footer.tsx`: Institutional footer with map, links, contact, and copyright.
