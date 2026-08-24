import React, { useEffect } from 'react';
import { useThemeLanguage } from '../context/ThemeLanguageContext';

interface SEOHeadProps {
  currentTab: string;
}

interface SEOData {
  titleUr: string;
  titleEn: string;
  titleAr: string;
  descUr: string;
  descEn: string;
  descAr: string;
  keywords: string;
  breadcrumbs: { name: string; item: string }[];
}

const TAB_SEO_MAP: Record<string, SEOData> = {
  home: {
    titleUr: 'الجامعة الإسلامية ایبت آباد | آن لائن فتاویٰ، دینی تعلیم، امتحانی نتائج و زکوۃ',
    titleEn: 'Jamia Islamia Abbottabad | Online Fatwa, Islamic Courses & Exam Results',
    titleAr: 'الجامعة الإسلامية أبيت آباد | الفتاوى الإلكترونية، العلوم الإسلامية والنتائج',
    descUr: 'الجامعة الإسلامية ایبت آباد (مری روڈ، پاکستان) کی رسمی ویب سائٹ۔ آن لائن فتاویٰ، حفظ و ناظرہ قرآن مجید، درس نظامی، امتحانی نتائج اور آن لائن اسلامی کورسز۔',
    descEn: 'Official Portal of Jamia Islamia Abbottabad, Pakistan (Est. 1951). Online Darul Ifta, Online Quran Academy, Dars-e-Nizami, Exam Results and Islamic Distance Learning.',
    descAr: 'الموقع الرسمي للجامعة الإسلامية بأبيت آباد (باكستان). الفتاوى الشرعية الإلكترونية، تحفيظ القرآن، دراسة العلوم الإسلامية، والنتائج الامتحانية.',
    keywords: 'الجامعة الإسلامية ایبت آباد, Jamia Islamia Abbottabad, دار الافتاء ایبت آباد, آن لائن فتاویٰ, امتحانی نتائج, آن لائن داخلہ مدرسہ, عطیات و زکوۃ, online quran academy, learn quran online, dars e nizami online, islamic university pakistan, abbottabad madrasa',
    breadcrumbs: [
      { name: 'صفحہ اول (Home)', item: 'https://jamia-islamia-abbottabad.pages.dev/' }
    ]
  },
  fatwas: {
    titleUr: 'آن لائن دار الافتاء و فتاویٰ آرکائیو | الجامعة الإسلامية ایبت آباد',
    titleEn: 'Online Darul Ifta & Fatwa Archive (45,000+ Rulings) | Jamia Islamia Abbottabad',
    titleAr: 'دار الإفتاء الإلكتروني وأرشيف الفتاوى الشرعية | الجامعة الإسلامية أبيت آباد',
    descUr: 'جامعہ اسلامیہ ایبٹ آباد کا آن لائن دار الافتاء۔ 45 ہزار سے زائد مستند شرعی فتاویٰ کا تلاش کے قابل آرکائیو اور اپنا شرعی سوال آن لائن پوچھیں۔',
    descEn: 'Search 45,000+ authentic Islamic rulings and fatwas from Darul Ifta Jamia Islamia Abbottabad. Submit your sharia questions online.',
    descAr: 'تصفح أكثر من 45,000 فتوى شرعية معتمدة من دار الإفتاء بالجامعة الإسلامية أبيت آباد وأرسل سؤالك الشرعي إلكترونياً.',
    keywords: 'آن لائن فتاویٰ, دار الافتاء ایبت آباد, Fatwa Online Pakistan, Online Fatwa Search, Darul Ifta Abbottabad, Ask Fatwa Online, فتاویٰ جامعہ اسلامیہ, Sharia Law Rulings',
    breadcrumbs: [
      { name: 'صفحہ اول', item: 'https://jamia-islamia-abbottabad.pages.dev/#home' },
      { name: 'دار الافتاء و فتاویٰ (Darul Ifta)', item: 'https://jamia-islamia-abbottabad.pages.dev/#fatwas' }
    ]
  },
  'fatwa-duas': {
    titleUr: 'مسنون و معروف دعائیں اور اذکار | الجامعة الإسلامية ایبت آباد',
    titleEn: 'Daily Masnoon Duas & Morning Evening Azkar | Jamia Islamia Abbottabad',
    titleAr: 'الأدعية المأثورة والأذكار اليومية | الجامعة الإسلامية أبيت آباد',
    descUr: 'صبح و شام کے مسنون اذکار، نماز کے بعد کی دعائیں اور تمام مسنون دعاؤں کا مستند اسلامی مجموعہ جامعہ اسلامیہ ایبٹ آباد۔',
    descEn: 'Collection of authentic daily Masnoon Duas, morning and evening Azkar, and prayers from Jamia Islamia Abbottabad.',
    descAr: 'مجموعة الأدعية المأثورة، أذكار الصباح والمساء، وأدعية الصلاة من الجامعة الإسلامية أبيت آباد.',
    keywords: 'مسنون دعائیں, اذکار صبح و شام, Daily Masnoon Duas, Islamic Prayers, Morning Evening Azkar, مسنون اذکار',
    breadcrumbs: [
      { name: 'صفحہ اول', item: 'https://jamia-islamia-abbottabad.pages.dev/#home' },
      { name: 'دار الافتاء', item: 'https://jamia-islamia-abbottabad.pages.dev/#fatwas' },
      { name: 'مسنون دعائیں', item: 'https://jamia-islamia-abbottabad.pages.dev/#fatwa-duas' }
    ]
  },
  'fatwa-names': {
    titleUr: 'منتخب اسلامی نام ڈائریکٹری | با معنی لڑکوں اور لڑکیوں کے نام',
    titleEn: 'Islamic Names Directory with Meanings (Boys & Girls) | Jamia Islamia Abbottabad',
    titleAr: 'دليل الأسماء الإسلامية ومعانيها للأولاد والبنات | الجامعة الإسلامية',
    descUr: 'انبیاء، صحابہ اور صحابیات کے مبارک ناموں پر مشتمل منتخب اسلامی ناموں کی ڈائریکٹری مع خوبصورت معانی۔',
    descEn: 'Authentic Directory of Muslim Baby Boy and Girl Names with meanings curated by Jamia Islamia Abbottabad scholars.',
    descAr: 'دليل الأسماء الإسلامية المعتمدة للأولاد والبنات مع معانيها اللغوية من علماء الجامعة الإسلامية.',
    keywords: 'منتخب اسلامی نام, Muslim Baby Names, Islamic Names with Meanings, Boys Names Urdu, Girls Names Arabic, اسلامی نام ڈائریکٹری',
    breadcrumbs: [
      { name: 'صفحہ اول', item: 'https://jamia-islamia-abbottabad.pages.dev/#home' },
      { name: 'دار الافتاء', item: 'https://jamia-islamia-abbottabad.pages.dev/#fatwas' },
      { name: 'اسلامی نام', item: 'https://jamia-islamia-abbottabad.pages.dev/#fatwa-names' }
    ]
  },
  results: {
    titleUr: 'سالانہ امتحانی نتائج پورٹل و رول نمبر چیکر | الجامعة الإسلامية ایبت آباد',
    titleEn: 'Examination Results Portal & Roll Number Verification | Jamia Islamia Abbottabad',
    titleAr: 'بوابة النتائج الامتحانية والتحقق من الشهادات | الجامعة الإسلامية أبيت آباد',
    descUr: 'جامعہ اسلامیہ ایبٹ آباد کے سالانہ امتحانی نتائج رول نمبر اور شناختی معلومات کے ذریعے آن لائن تلاش کریں۔ ڈگری اور سرٹیفکیٹ تصدیق پورٹل۔',
    descEn: 'Check Jamia Islamia Abbottabad annual examination results online by roll number. Verify student certificates and transcripts instantly.',
    descAr: 'استعلم عن نتائج الامتحانات السنوية لطلاب الجامعة الإسلامية أبيت آباد ورقم الجلوس وتحقق من الشهادات الدراسية.',
    keywords: 'امتحانی نتائج, رول نمبر رزلٹ, Jamia Islamia Exam Results, Wifaqul Madaris Result, Result Verification Abbottabad, رزلٹ پورٹل',
    breadcrumbs: [
      { name: 'صفحہ اول', item: 'https://jamia-islamia-abbottabad.pages.dev/#home' },
      { name: 'امتحانی نتائج (Results)', item: 'https://jamia-islamia-abbottabad.pages.dev/#results' }
    ]
  },
  'online-quran': {
    titleUr: 'آن لائن قرآنی تعلیم و تجوید اکیڈمی | الجامعة الإسلامية ایبت آباد',
    titleEn: 'Online Quran Academy & Tajweed Classes | Jamia Islamia Abbottabad',
    titleAr: 'أكاديمية التعليم القرآني والتجويد أونلاين | الجامعة الإسلامية',
    descUr: 'جامعہ اسلامیہ ایبٹ آباد کی عالمی آن لائن قرآن اکیڈمی۔ تجوید، حفظ اور ناظرہ قرآن کریم کی عالمی معیار پر آن لائن کلاسز اور ماہر قراء کی زیرِ نگرانی تعلیم۔',
    descEn: 'Online Quran Academy by Jamia Islamia Abbottabad. Learn Tajweed, Hifz, and Nazira Quran globally with certified Qaris and flexible schedules.',
    descAr: 'أكاديمية تحفيظ وتجويد القرآن الكريم إلكترونياً من الجامعة الإسلامية بأبيت آباد مع قراء متخصصين وجدول مرن.',
    keywords: 'آن لائن قرآنی تعلیم, online quran academy, learn quran online, tajweed classes online, hifz quran online, online quran teacher, تجوید و ناظرہ قرآن',
    breadcrumbs: [
      { name: 'صفحہ اول', item: 'https://jamia-islamia-abbottabad.pages.dev/#home' },
      { name: 'آن لائن قرآنی تعلیم (Online Quran)', item: 'https://jamia-islamia-abbottabad.pages.dev/#online-quran' }
    ]
  },
  'online-dars-nizami': {
    titleUr: 'آن لائن درسِ نظامی، تفسیر و فقہ پورٹل | الجامعة الإسلامية ایبت آباد',
    titleEn: 'Online Dars-e-Nizami, Tafseer & Fiqh Academy | Jamia Islamia Abbottabad',
    titleAr: 'الدرس النظامي والتفسير والفقه عبر الإنترنت | الجامعة الإسلامية',
    descUr: 'جامعہ اسلامیہ ایبٹ آباد کا آن لائن درسِ نظامی و تفسیر القرآن پورٹل۔ عالم/عالمہ کورس، فقہ، ترجمہ و تفسیرِ قرآن، اور عربی گرامر کی آن لائن تدریس۔',
    descEn: 'Online Dars-e-Nizami & Tafseer program by Jamia Islamia Abbottabad. Complete Alim/Alimah course, Fiqh, Tafseer, and Arabic language distance learning.',
    descAr: 'برنامج دراسة العلوم الشرعية والدرس النظامي والتفسير أونلاين من الجامعة الإسلامية بأبيت آباد.',
    keywords: 'آن لائن درس نظامی, online dars e nizami, tafseer course online, alim course online, fiqh online, arabic grammar online, تفسیر القرآن آن لائن',
    breadcrumbs: [
      { name: 'صفحہ اول', item: 'https://jamia-islamia-abbottabad.pages.dev/#home' },
      { name: 'آن لائن درسِ نظامی و تفسیر', item: 'https://jamia-islamia-abbottabad.pages.dev/#online-dars-nizami' }
    ]
  },
  'online-services': {
    titleUr: 'آن لائن دینی تعلیم و کورسز | قرآن اکیڈمی، درس نظامی و عربی گرامر',
    titleEn: 'Online Islamic Education & Quran Academy | Jamia Distance Learning',
    titleAr: 'التعليم الإسلامي الإلكتروني وأكاديمية القرآن الكريم | الجامعة الإسلامية',
    descUr: 'دنیا بھر سے آن لائن قرآن مجید ناظرہ و حفظ، تجوید، آن لائن درس نظامی (عالم و عالمہ کورس) اور عربی زبان و گرامر کے لیے رجسٹریشن کریں۔',
    descEn: 'Enroll in Online Quran Academy, Tajweed & Hifz, Dars-e-Nizami Alim/Alimah courses, and Arabic Language programs from home.',
    descAr: 'التحق بأكاديمية القرآن الكريم أونلاين، تحفيظ وتجويد، دراسة العلوم الشرعية ودورة اللغة العربية من أي مكان في العالم.',
    keywords: 'online quran classes, online dars e nizami, online quran academy, learn arabic online, quran course online pakistan, alim course online, tajweed classes, آن لائن دینی تعلیم, آن لائن قرآن اکیڈمی',
    breadcrumbs: [
      { name: 'صفحہ اول', item: 'https://jamia-islamia-abbottabad.pages.dev/#home' },
      { name: 'آن لائن تعلیمی خدمات (Online Courses)', item: 'https://jamia-islamia-abbottabad.pages.dev/#online-services' }
    ]
  },
  library: {
    titleUr: 'دیجیٹل لائبریری، ماہنامہ الجامعہ و مطبوعات | الجامعة الإسلامية ایبت آباد',
    titleEn: 'Digital Publications Library & Monthly Journal "Al-Jamia" | Jamia Islamia Abbottabad',
    titleAr: 'المكتبة الرقمية والمجلة الشهرية "الجامعة" | الجامعة الإسلامية أبيت آباد',
    descUr: 'جامعہ اسلامیہ کی دیجیٹل لائبریری سے اسلامی کتب، علمی مقالات، تحریری فتاویٰ اور ماہنامہ "الجامعہ" مفت پی ڈی ایف ڈاؤن لوڈ کریں۔',
    descEn: 'Download free PDF Islamic books, research papers, fatwas, and monthly magazine "Al-Jamia" from Jamia Islamia Abbottabad Digital Library.',
    descAr: 'تحميل الكتب الإسلامية الرقمية، الأبحاث العلمية، ومجلة "الجامعة" الشهرية مجاناً بصيغة PDF.',
    keywords: 'اسلامی کتب پی ڈی ایف, ماہنامہ الجامعہ, Islamic Books PDF, Free Quran Tajweed Books, Research Papers PDF, دیجیٹل لائبریری ایبٹ آباد',
    breadcrumbs: [
      { name: 'صفحہ اول', item: 'https://jamia-islamia-abbottabad.pages.dev/#home' },
      { name: 'دیجیٹل لائبریری (Library)', item: 'https://jamia-islamia-abbottabad.pages.dev/#library' }
    ]
  },
  donations: {
    titleUr: 'آن لائن عطیات، زکوۃ و صدقات پورٹل (کفالت طلبہ) | الجامعة الإسلامية ایبت آباد',
    titleEn: 'Online Donations, Zakat & Student Sponsorship Portal | Jamia Islamia Abbottabad',
    titleAr: 'بوابة التبرعات الإلكترونية، الزكاة والصدقات (كفالة الطلاب) | الجامعة الإسلامية',
    descUr: 'جامعہ اسلامیہ ایبٹ آباد کے مستحق اور یتیم طلبہ کی کفالت، تعلیمی اخراجات اور تعمیری منصوبوں کے لیے آن لائن زکوۃ، صدقات اور عطیات جمع کروائیں۔',
    descEn: 'Donate online Zakat, Sadaqah, and student sponsorships to Jamia Islamia Abbottabad via Bank Transfer, JazzCash, EasyPaisa, or Credit Card.',
    descAr: 'ادفع زكاتك وصدقاتك إلكترونياً لدعم طلاب العلم الأيتام والمحتاجين بالجامعة الإسلامية أبيت آباد عبر وسائل الدفع الآمنة.',
    keywords: 'آن لائن زکوۃ, عطیات پورٹل, Online Zakat Pakistan, Donate to Madrasa, Sponsor Quran Student, JazzCash Zakat, EasyPaisa Donation, Bank Transfer Jamia',
    breadcrumbs: [
      { name: 'صفحہ اول', item: 'https://jamia-islamia-abbottabad.pages.dev/#home' },
      { name: 'عطیات و زکوۃ (Donations)', item: 'https://jamia-islamia-abbottabad.pages.dev/#donations' }
    ]
  },
  about: {
    titleUr: 'جامعہ کے بارے میں — تاریخ، بانیان و تعارف | الجامعة الإسلامية ایبت آباد',
    titleEn: 'About Jamia Islamia Abbottabad — History, Founders & Heritage (Est. 1951)',
    titleAr: 'عن الجامعة الإسلامية أبيت آباد — التاريخ والمؤسسون والتراث (تأسست ١٩٥١م)',
    descUr: 'جامعہ اسلامیہ ایبٹ آباد کی تاریخ، ۱۹۵۱ء سے دینی تعلیمی خدمات کا سفر، بانیانِ جامعہ، تعلیمی مقاصد اور تنظیمی ڈھانچہ۔',
    descEn: 'Learn about the rich history of Jamia Islamia Abbottabad since 1951, its esteemed founders, academic vision, and Islamic educational contributions in Pakistan.',
    descAr: 'تعرف على تاريخ الجامعة الإسلامية أبيت آباد منذ عام ١٩٥١م، رؤيتها التعليمية، وأبرز علمائها ومؤسسيها.',
    keywords: 'تاریخ جامعہ اسلامیہ, Abbottabad Madrasa History, Established 1951 Abbottabad, Wifaqul Madaris Institutions, بانیان جامعہ اسلامیہ',
    breadcrumbs: [
      { name: 'صفحہ اول', item: 'https://jamia-islamia-abbottabad.pages.dev/#home' },
      { name: 'جامعہ کا تعارف (About Us)', item: 'https://jamia-islamia-abbottabad.pages.dev/#about' }
    ]
  },
  contact: {
    titleUr: 'رابطہ و سوالات — نقشہ، فون اور پتہ | الجامعة الإسلامية ایبت آباد',
    titleEn: 'Contact Us, Campus Map & FAQs | Jamia Islamia Abbottabad',
    titleAr: 'اتصل بنا والعنوان والأسئلة الشائعة | الجامعة الإسلامية أبيت آباد',
    descUr: 'جامعہ اسلامیہ ایبٹ آباد مری روڈ خیبر پختونخوا کا لوکیشن نقشہ، رابطہ نمبر، واٹس ایپ ہیلپ لائن اور عمومی سوالات کے جوابات۔',
    descEn: 'Get in touch with Jamia Islamia Abbottabad. Murree Road location map, phone numbers, WhatsApp helpline (+92 348 9002496), and FAQs.',
    descAr: 'تواصل مع الجامعة الإسلامية أبيت آباد. موقعنا على الخريطة، أرقام الهاتف، واتساب والمساعدة الفورية.',
    keywords: 'رابطہ جامعہ اسلامیہ, Jamia Abbottabad Address, Murree Road Abbottabad Location, Phone Number Jamia, WhatsApp Helpline 03489002496',
    breadcrumbs: [
      { name: 'صفحہ اول', item: 'https://jamia-islamia-abbottabad.pages.dev/#home' },
      { name: 'رابطہ کریں (Contact Us)', item: 'https://jamia-islamia-abbottabad.pages.dev/#contact' }
    ]
  }
};

export const SEOHead: React.FC<SEOHeadProps> = ({ currentTab }) => {
  const { language } = useThemeLanguage();

  useEffect(() => {
    // Determine active key (support subtabs like 'online-quran' -> 'online-services')
    let key = currentTab;
    if (!TAB_SEO_MAP[key]) {
      if (key.startsWith('fatwa')) key = 'fatwas';
      else if (key.startsWith('online')) key = 'online-services';
      else if (key.startsWith('about')) key = 'about';
      else key = 'home';
    }

    const data = TAB_SEO_MAP[key] || TAB_SEO_MAP.home;

    // Pick language specific title and description
    let activeTitle = data.titleUr;
    let activeDesc = data.descUr;

    if (language === 'en') {
      activeTitle = data.titleEn;
      activeDesc = data.descEn;
    } else if (language === 'ar') {
      activeTitle = data.titleAr;
      activeDesc = data.descAr;
    }

    // Update document title
    document.title = activeTitle;

    // Helper to update or create meta tags
    const updateMeta = (selector: string, attrName: string, attrVal: string, content: string) => {
      let element = document.querySelector(selector) as HTMLMetaElement | null;
      if (!element) {
        element = document.createElement('meta');
        element.setAttribute(attrName, attrVal);
        document.head.appendChild(element);
      }
      element.setAttribute('content', content);
    };

    updateMeta('meta[name="description"]', 'name', 'description', activeDesc);
    updateMeta('meta[name="keywords"]', 'name', 'keywords', data.keywords);
    updateMeta('meta[property="og:title"]', 'property', 'og:title', activeTitle);
    updateMeta('meta[property="og:description"]', 'property', 'og:description', activeDesc);
    updateMeta('meta[property="og:url"]', 'property', 'og:url', `https://jamia-islamia-abbottabad.pages.dev/#${currentTab}`);
    updateMeta('meta[name="twitter:title"]', 'name', 'twitter:title', activeTitle);
    updateMeta('meta[name="twitter:description"]', 'name', 'twitter:description', activeDesc);

    // Canonical link update
    let canonical = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.setAttribute('rel', 'canonical');
      document.head.appendChild(canonical);
    }
    canonical.setAttribute('href', `https://jamia-islamia-abbottabad.pages.dev/#${currentTab}`);

    // Update JSON-LD Breadcrumb Schema dynamically
    let breadcrumbScript = document.getElementById('json-ld-breadcrumb') as HTMLScriptElement | null;
    if (!breadcrumbScript) {
      breadcrumbScript = document.createElement('script');
      breadcrumbScript.id = 'json-ld-breadcrumb';
      breadcrumbScript.type = 'application/ld+json';
      document.head.appendChild(breadcrumbScript);
    }

    const breadcrumbSchema = {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      'itemListElement': data.breadcrumbs.map((bc, index) => ({
        '@type': 'ListItem',
        'position': index + 1,
        'name': bc.name,
        'item': bc.item
      }))
    };

    breadcrumbScript.textContent = JSON.stringify(breadcrumbSchema);

    // Inject FAQPage schema when on contact/faq or fatwa tab
    if (key === 'contact' || key === 'faq' || key === 'fatwas') {
      let faqScript = document.getElementById('json-ld-faq') as HTMLScriptElement | null;
      if (!faqScript) {
        faqScript = document.createElement('script');
        faqScript.id = 'json-ld-faq';
        faqScript.type = 'application/ld+json';
        document.head.appendChild(faqScript);
      }

      const faqSchema = {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        'mainEntity': [
          {
            '@type': 'Question',
            'name': 'جامعہ اسلامیہ ایبٹ آباد سے آن لائن فتویٰ کیسے حاصل کریں؟ How to get Online Fatwa?',
            'acceptedAnswer': {
              '@type': 'Answer',
              'text': 'آپ جامعہ کی ویب سائٹ پر آن لائن دار الافتاء پورٹل کے ذریعے اپنا شرعی سوال جمع کروا سکتے ہیں۔ جامعہ کے مستند مفتیان کرام سوال کا شرعی جائزہ لے کر تفصیلی فتویٰ جاری کرتے ہیں۔'
            }
          },
          {
            '@type': 'Question',
            'name': 'آن لائن قرآن اکیڈمی اور تجوید کلاسز میں کیسے داخلہ لیں؟ How to enroll in Online Quran Academy?',
            'acceptedAnswer': {
              '@type': 'Answer',
              'text': 'آن لائن خدمات پورٹل پر جا کر اپنا مطلوبہ کورس (حفظ، ناظرہ، تجوید، یا درس نظامی) منتخب کریں اور آن لائن داخلہ فارم پر کریں۔ تمام کلاسز زوم اور آن لائن سیشنز کے ذریعے منعقد کی جاتی ہیں۔'
            }
          },
          {
            '@type': 'Question',
            'name': 'جامعہ اسلامیہ ایبٹ آباد کس بورڈ سے الحاق شدہ ہے؟ Which board is Jamia affiliated with?',
            'acceptedAnswer': {
              '@type': 'Answer',
              'text': 'جامعہ اسلامیہ ایبٹ آباد وفاق المدارس العربیہ پاکستان سے الحاق شدہ ہے اور اس کی سند عالمی سطح پر تسلیم شدہ ہے۔'
            }
          },
          {
            '@type': 'Question',
            'name': 'جامعہ میں زکوۃ اور عطیات کی ادائیگی کا کیا طریقہ ہے؟ How to donate Zakat online?',
            'acceptedAnswer': {
              '@type': 'Answer',
              'text': 'آپ بینک ٹرانسفر، ایزی پیسہ، یا جیز کیش کے ذریعے براہ راست جامعہ کے حساب میں عطیات اور زکوۃ بھیج کر یتیم و مستحق طلبہ کی تعلیمی کفالت کر سکتے ہیں۔'
            }
          }
        ]
      };
      faqScript.textContent = JSON.stringify(faqSchema);
    }

  }, [currentTab, language]);

  return null;
};
