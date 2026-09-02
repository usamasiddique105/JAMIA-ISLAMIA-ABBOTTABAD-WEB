import { 
  CmsPage, 
  CmsMenu, 
  CmsSection, 
  CmsThemeSettings, 
  CmsSeoSettings, 
  CmsMedia,
  CmsAdminUser 
} from '../types';
import { JAMIA_HEADER_LOGO_DATA_URI } from '../assets/logoBase64';

export const INITIAL_CMS_PAGES: CmsPage[] = [
  {
    id: 'page-about',
    slug: 'about-jamia',
    title: {
      ur: 'جامعہ اسلامیہ ایبٹ آباد — تعارف، تاریخ و امتیازات',
      en: 'About Jamia Islamia Abbottabad — History & Highlights',
      ar: 'عن الجامعة الإسلامية أبيت آباد — التاريخ والمميزات'
    },
    excerpt: {
      ur: 'جامعہ اسلامیہ ایبٹ آباد کا قیام ۱۹۵۱ء میں عمل میں آیا، جو کہ خیبر پختونخوا کا مایہ ناز دینی و تعلیمی ادارہ ہے۔',
      en: 'Established in 1951, Jamia Islamia Abbottabad is a premier Islamic seminary affiliated with Wifaqul Madaris.',
      ar: 'تأسست الجامعة الإسلامية بأبيت آباد عام ١٩٥١م، وهي منارة علمية ودينية بارزة في باكستان.'
    },
    content: {
      ur: `### تعارف و پس منظر
جامعہ اسلامیہ ایبٹ آباد خیبر پختونخوا کی سرسبز و شاداب وادی ایبٹ آباد میں مری روڈ پر واقع ایک عظیم دینی، تعلیمی و تحقیقی ادارہ ہے۔ اس کا قیام ۱۹۵۱ء (۱۳۷۰ھ) میں حضرت مولانا فضل مولیٰ رحمہ اللہ اور ان کے رفقاء کے ہاتھوں عمل میں آیا۔

### الحاق و نصابِ تعلیم
جامعہ وفاق المدارس العربیہ پاکستان کا مستند الحاق شدہ ادارہ ہے۔ یہاں درجہ ابتدائیہ (ناظرہ و حفظ قرآن کریم) سے لے کر دورۂ حدیث شریف (شہادت العالمیہ / ایم اے اسلامیات مساوی) اور تخصص فی الفقہ والافتاء (پی ایچ ڈی مساوی) تک مکمل مفت دینی تعلیم دی جاتی ہے۔

### اہم شعبہ جات
۱. **شعبہ حفظ و تجوید**: معیاری قراء کی زیرِ نگرانی حفظِ قرآن مع حسنِ قراءت۔
۲. **شعبہ درسِ نظامی**: کتبِ فقہ، اصول، حدیث، تفسیر اور عربی ادب کی مکمل تدریس۔
۳. **دار الافتاء**: شریعتِ مطہرہ کی روشنی میں عوام الناس کے فقہی مسائل کے مدلل فتاویٰ کا اجرا۔
۴. **عالمی آن لائن اکیڈمی**: دنیا بھر کے مسلمانوں کے لیے آن لائن قرآنی و شرعی کورسز۔`,
      en: `### Introduction & Background
Jamia Islamia Abbottabad is a renowned Islamic university and research center situated on Murree Road, Abbottabad, Pakistan. Established in 1951 by Hazrat Maulana Fazl-e-Maula (RA) and esteemed contemporary scholars.

### Academic Accreditation
Affiliated with Wifaqul Madaris Al-Arabia Pakistan, offering complete traditional curriculum from basic Quranic Nazira/Hifz to Shahadat-ul-Aalamiyyah (M.A Islamic Studies equivalent) and Takhassus fil Fiqh (Mufti specialization).

### Core Pillars
1. **Quran & Tajweed Institute**: Comprehensive memorization and tajweed under qualified Qaris.
2. **Dars-e-Nizami Faculty**: In-depth classical texts of Fiqh, Hadith, Tafseer and Arabic Literature.
3. **Darul Ifta**: Verified Islamic verdicts on contemporary and classical jurisprudence issues.
4. **Global Online Academy**: Remote live distance learning for international students.`,
      ar: `### نبذة تاريخية
تأسست الجامعة الإسلامية أبيت آباد عام ١٩٥١م على يد الشيخ الجليل فضل مولى رحمه الله، وتعتبر من أقدم وأبرز الصروح العلمية الإسلامية في باكستان.

### الاعتماد والمناهج
الجامعة معتمدة رسمياً من وفاق المدارس العربية بباكستان، وتقدم المناهج الإسلامية الكاملة من تحفيظ القرآن الكريم وتجويده حتى شهادة العالمية (ماجستير) والتخصص في الفقه والإفتاء.

### الأقسام الرئيسية
١. **شعبة التحفيظ والتجويد**: إتقان القرآن الكريم بأعلى معايير التجويد.
٢. **كلية الشريعة والدرس النظامي**: دراسة أصول الفقه، الحديث النبوي، التفسير والأدب العربي.
٣. **دار الإفتاء الشرعية**: إصدار الفتاوى الشرعية الموثقة لأبناء الأمة الإسلامية.`
    },
    featuredImage: 'https://images.unsplash.com/photo-1584551246679-0daf3d275d0f?auto=format&fit=crop&w=1200&q=80',
    status: 'published',
    visibility: 'public',
    seoTitle: {
      ur: 'تعارفِ جامعہ اسلامیہ ایبٹ آباد | تاریخ، قیام اور امتیازات',
      en: 'About Jamia Islamia Abbottabad | History & Academic Programs',
      ar: 'عن الجامعة الإسلامية أبيت آباد | التاريخ والبرامج'
    },
    seoDescription: {
      ur: 'جامعہ اسلامیہ ایبٹ آباد کا تفصیلی تعارف، تاریخ، بانیان، مقاصد اور اہم تعلیمی و تربیتی شعبہ جات۔',
      en: 'Detailed overview, history, vision, and faculties of Jamia Islamia Abbottabad Pakistan.',
      ar: 'تعرف على تاريخ ورسالة وأقسام الجامعة الإسلامية أبيت آباد بباكستان.'
    },
    author: 'جامعہ انتظامیہ',
    template: 'default',
    orderIndex: 1,
    createdAt: '2026-01-01T00:00:00.000Z',
    updatedAt: '2026-08-30T10:00:00.000Z'
  },
  {
    id: 'page-darul-ifta',
    slug: 'darul-ifta-guidelines',
    title: {
      ur: 'دار الافتاء — طریقہ کار اور رہنمائے فتویٰ نویسی',
      en: 'Darul Ifta — Sharia Ruling Guidelines & Procedures',
      ar: 'دار الإفتاء — ضوابط الفتوى ومنهجية العمل'
    },
    excerpt: {
      ur: 'دار الافتاء جامعہ اسلامیہ ایبٹ آباد کے تحت فقہی سوالات پوچھنے اور فتاویٰ جاری کرنے کا باضابطہ طریقہ کار۔',
      en: 'Official rules and procedures for asking fatwas and obtaining authentic sharia rulings.',
      ar: 'الضوابط الرسمية لاستفتاء علماء دار الإفتاء بالجامعة الإسلامية.'
    },
    content: {
      ur: `### دار الافتاء کا تاریخی پس منظر
جامعہ اسلامیہ ایبٹ آباد کا دار الافتاء قیامِ جامعہ سے ہی شریعتِ مطہرہ اور فقہِ حنفی کی روشنی میں امتِ مسلمہ کی رہنمائی میں مصروفِ عمل ہے۔ یہاں اب تک ۴۵ ہزار سے زائد فتاویٰ جاری کیے جا چکے ہیں۔

### فتویٰ پوچھنے کے شرعی اصول
۱. سوال واضح، دو ٹوک اور مکمل سچائی پر مبنی ہو۔
۲. خاندانی یا مالیاتی تنازعات میں دونوں فریقین کے بیانات یا فریقِ ثانی کے موقف کا ذکر لازمی ہے۔
۳. عدالتی معاملات اور زیرِ سماعت مقدمات میں ذاتی نوعیت کے سوالات پر احتیاط سے جواب دیا جاتا ہے۔
۴. فتویٰ جاری ہونے کے بعد اس پر باقاعدہ فتویٰ نمبر، دار الافتاء کی مہر اور مفتیانِ کرام کے دستخط ہوتے ہیں۔`,
      en: `### Sharia Governance & History
Darul Ifta Jamia Islamia Abbottabad has been actively guiding the Muslim Ummah since the inception of the Jamia, having issued over 45,000 verified rulings.

### Guidelines for Submitting Questions
1. Questions should be clear, factual, and strictly honest.
2. In family and financial disputes, pertinent details from both perspectives must be provided.
3. Every official fatwa bears a unique tracking number, institutional seal, and senior Muftis signatures.`,
      ar: `### منهجية دار الإفتاء
تلتزم دار الإفتاء بالجامعة الإسلامية أبيت آباد بالكتاب والسنة وإجماع الأمة على المذهب الحنفي المعتمد، وقد أصدرت أكثر من ٤٥ ألف فتوى شرعية موثقة.

### ضوابط طرح الأسئلة
١. أن يكون السؤال واضحاً ومصاغاً بأسلوب دقيق وصادق.
٢. في النزاعات المالية والأسرية، يجب بيان تفاصيل النزاع بدقة.
٣. جميع الفتاوى الرسمية تصدر برقم تسلسلي وختم دار الإفتاء المعتمد.`
    },
    featuredImage: 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=1200&q=80',
    status: 'published',
    visibility: 'public',
    seoTitle: {
      ur: 'رہنمائے دار الافتاء | جامعہ اسلامیہ ایبٹ آباد',
      en: 'Darul Ifta Guidelines | Jamia Islamia Abbottabad',
      ar: 'إرشادات دار الإفتاء | الجامعة الإسلامية'
    },
    seoDescription: {
      ur: 'آن لائن فتویٰ حاصل کرنے اور شرعی سوالات ارسال کرنے کے اصول و ضوابط۔',
      en: 'Guidelines and criteria for obtaining authentic Islamic legal rulings.',
      ar: 'ضوابط الحصول على الفتاوى الشرعية وإرسال الأسئلة الفقهية.'
    },
    author: 'دار الافتاء',
    template: 'default',
    orderIndex: 2,
    createdAt: '2026-01-10T00:00:00.000Z',
    updatedAt: '2026-08-30T10:00:00.000Z'
  },
  {
    id: 'page-admissions',
    slug: 'admission-rules',
    title: {
      ur: 'شرائط و قواعدِ داخلہ جامعہ اسلامیہ ایبٹ آباد',
      en: 'Admission Rules & Academic Criteria',
      ar: 'شروط وضوابط القبول والتسجيل'
    },
    excerpt: {
      ur: 'شعبہ حفظ و درسِ نظامی میں نئے تعلیمی سال کے داخلہ جات کے اصول و ضوابط اور داخلہ فارم۔',
      en: 'Rules and eligibility criteria for new admissions in Hifz and Dars-e-Nizami programs.',
      ar: 'شروط وإجراءات القبول السنوي في تحفيظ القرآن الكريم والعلوم الشرعية.'
    },
    content: {
      ur: `### داخلہ کے عام قواعد
جامعہ میں داخلہ ہر سال ماہِ شوال المکرم میں شروع ہوتا ہے۔ تمام مراحل میں داخلہ تحریری و زبانی امتحان کی بنیاد پر میرٹ پر دیا جاتا ہے۔

### درکار کاغذات
۱. طالب علم کا اصل شناختی کارڈ / ب فارم مع ۲ عدد فوٹو کاپی۔
۲. والد یا سرپرست کا قومی شناختی کارڈ۔
۳. گزشتہ تعلیمی ادارے کا تعلیمی سرٹیفکیٹ و اخلاقی سند۔
۴. ۴ عدد پاسپورٹ سائز تصاویر (سفید بیک گراؤنڈ)۔

### رہائش و طعام
جامعہ میں مستحق اور بیرونی طلبہ کے لیے مفت رہائش، معیاری طعام اور طبی سہولیات کی فراہمی کا مکمل انتظام موجود ہے۔`,
      en: `### Admission Overview
Admissions commence annually in the Islamic month of Shawwal based on merit and evaluation exams.

### Required Documentation
1. Student Birth Certificate / CNIC (B-Form) with 2 photocopies.
2. Father / Guardian CNIC photocopy.
3. Character and academic certificate from previous institution.
4. 4 passport-size photographs.

### Boarding & Food
Full residential lodging, halal nutritious food, and primary health facilities are provided complimentary for eligible boarding students.`,
      ar: `### إجراءات القبول والتسجيل
يبدأ التسجيل السنوي في شهر شوال المبارك، ويتم القبول بناءً على اختبارات الكفاءة والمقابلة الشخصية.

### المستندات المطلوبة
١. شهادة ميلاد الطالب أو بطاقة الهوية مع نسختين.
٢. صورة بطاقة هوية ولي الأمر.
٣. الشهادة العلمية السابقة وشهادة حسن السيرة.
٤. ٤ صور شخصية حديثة.

### السكن والإعاشة
توفر الجامعة السكن المجاني والإعاشة الكاملة للطلاب المغتربين والمستحقين.`
    },
    featuredImage: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&w=1200&q=80',
    status: 'published',
    visibility: 'public',
    seoTitle: {
      ur: 'شرائط و قواعدِ داخلہ | جامعہ اسلامیہ ایبٹ آباد',
      en: 'Admissions & Eligibility Criteria | Jamia Islamia',
      ar: 'شروط القبول والتسجيل | الجامعة الإسلامية'
    },
    seoDescription: {
      ur: 'جامعہ اسلامیہ میں داخلہ کے لیے درکار اسناد، شرائط، مفت ہاسٹل و طعام کی تفصیلات۔',
      en: 'Complete criteria and documents required for admissions at Jamia Islamia Abbottabad.',
      ar: 'شروط الالتحاق بالبرامج العلمية والتحفيظ والسكن الداخلي بالجامعة الإسلامية.'
    },
    author: 'شعبہ تعلیمات',
    template: 'default',
    orderIndex: 3,
    createdAt: '2026-02-01T00:00:00.000Z',
    updatedAt: '2026-08-30T10:00:00.000Z'
  },
  {
    id: 'page-zakat-rules',
    slug: 'zakat-calculation-rules',
    title: {
      ur: 'زکوٰۃ و صدقات — شرعی احکام، نصاب اور مصارف',
      en: 'Zakat & Sadaqah — Sharia Rules, Nisab & Deserving Recipients',
      ar: 'الزكاة والصدقات — الأحكام الشرعية، النصاب والمصارف'
    },
    excerpt: {
      ur: 'زکوٰۃ کا شرعی نصاب، حساب لگانے کا طریقہ اور جامعہ کے نادار طلبہ کی کفالت میں زکوٰۃ کا مصرف۔',
      en: 'Islamic guidelines on calculating Zakat, gold/silver nisab, and spending on deserving religious students.',
      ar: 'الأحكام الشرعية لحساب الزكاة ومصارفها الشرعية في كفالة طلاب العلوم الإسلامية.'
    },
    content: {
      ur: `### زکوٰۃ کی فرضیت اور نصاب
زکوٰۃ اسلام کے بنیادی ارکان میں سے ایک ہے۔ ہر صاحبِ نصاب مسلمان پر سال گزرنے کے بعد اپنے مال کا چالیسواں حصہ (2.5%) بطورِ زکوٰۃ ادا کرنا فرض ہے۔

- **سونے کا نصاب**: ساڑھے سات تولہ (87.48 گرام)
- **چاندی کا نصاب**: ساڑھے باون تولہ (612.36 گرام)

### جامعہ میں زکوٰۃ کا شرعی مصرف
جامعہ اسلامیہ ایبٹ آباد میں سینکڑوں غریب، یتیم اور مستحق طلبہ علومِ دینیہ کی تحصیل میں مشغول ہیں۔ آپ کی دی گئی زکوٰۃ شرعی اصولوں کے تحت ان کے قیام، طعام، کتب اور علاج پر خرچ کی جاتی ہے۔`,
      en: `### Obligation of Zakat & Nisab
Zakat is one of the five pillars of Islam, obligating 2.5% on wealth that exceeds Nisab for a lunar year.

- **Gold Nisab**: 7.5 Tolas (87.48 grams)
- **Silver Nisab**: 52.5 Tolas (612.36 grams)

### Spending on Religious Students
Hundreds of deserving students and orphans study at Jamia Islamia Abbottabad. Your Zakat ensures their boarding, nutritious meals, books, and essential healthcare in strict accordance with Sharia law.`,
      ar: `### فرضية الزكاة ونصابها
الزكاة ركن ركين من أركان الإسلام، وتجب بنسبة ٢.٥٪ على المال إذا بلغ النصاب وحال عليه الحول الهجري.

- **نصاب الذهب**: ٨٧.٤٨ غراماً.
- **نصاب الفضة**: ٦١٢.٣٦ غراماً.

### مصارف الزكاة في الجامعة
ينتسب للجامعة مئات الطلاب الفقراء والأيتام المتفرغين لطلب العلم الشرعي، وتصرف الزكاة عليهم شرعاً لتوفير السكن والغذاء والرعاية الصحية.`
    },
    featuredImage: 'https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?auto=format&fit=crop&w=1200&q=80',
    status: 'published',
    visibility: 'public',
    seoTitle: {
      ur: 'شرعی احکام زکوٰۃ و صدقات | جامعہ اسلامیہ ایبٹ آباد',
      en: 'Zakat Rules & Islamic Guidelines | Jamia Islamia',
      ar: 'أحكام الزكاة والصدقات | الجامعة الإسلامية'
    },
    seoDescription: {
      ur: 'سونے چاندی اور نقدی کا نصابِ زکوٰۃ اور جامعہ کے دینی طلبہ کی کفالت۔',
      en: 'Learn how to calculate Zakat and donate toward sponsoring religious knowledge students.',
      ar: 'دليل حساب الزكاة ونصيب الذهب والفضة وكفالة طلاب العلم الشرعي.'
    },
    author: 'دار الافتاء',
    template: 'default',
    orderIndex: 4,
    createdAt: '2026-03-01T00:00:00.000Z',
    updatedAt: '2026-08-30T10:00:00.000Z'
  }
];

export const INITIAL_CMS_MENUS: CmsMenu[] = [
  {
    id: 'menu-header-main',
    location: 'header_main',
    name: 'مرکزی ہیڈر مینیو (Main Navigation)',
    updatedAt: '2026-08-30T10:00:00.000Z',
    items: [
      {
        id: 'menu-home',
        title: { ur: 'صفحہ اول', en: 'Home', ar: 'الرئيسية' },
        url: '#home',
        tabId: 'home',
        isEnabled: true,
        orderIndex: 1
      },
      {
        id: 'menu-about',
        title: { ur: 'تعارفِ جامعہ', en: 'About Jamia', ar: 'عن الجامعة' },
        url: '#about',
        tabId: 'about',
        isEnabled: true,
        orderIndex: 2,
        children: [
          {
            id: 'menu-about-overview',
            title: { ur: 'تعارفِ جامعہ', en: 'About Jamia', ar: 'نبذة عن الجامعة' },
            url: '#about-overview',
            tabId: 'about-overview',
            description: { ur: 'جامعہ کی تاریخ اور خدمات کا اجمالی جائزہ', en: 'History and mission of Jamia Islamia', ar: 'تاريخ الجامعة ورسالتها' },
            isEnabled: true,
            orderIndex: 1
          },
          {
            id: 'menu-about-founder',
            title: { ur: 'بانیِ جامعہ و اکابرین', en: 'Founder & Luminaries', ar: 'مؤسس الجامعة' },
            url: '#about-founder',
            tabId: 'about-founder',
            description: { ur: 'حضرت مولانا فضل مولیٰؒ و اکابرینِ جامعہ', en: 'Hazrat Maulana Fazl-e-Maula (RA)', ar: 'سماحة الشيخ فضل مولى رحمه الله' },
            isEnabled: true,
            orderIndex: 2
          },
          {
            id: 'menu-about-objectives',
            title: { ur: 'اغراض و مقاصد', en: 'Objectives', ar: 'الأهداف والغايات' },
            url: '#about-objectives',
            tabId: 'about-objectives',
            description: { ur: 'علومِ شرعیہ کی اشاعت و اصلاحِ معاشرہ', en: 'Islamic teachings and societal reform', ar: 'نشر العلوم الشرعية والإصلاح' },
            isEnabled: true,
            orderIndex: 3
          }
        ]
      },
      {
        id: 'menu-departments',
        title: { ur: 'شعبہ جات', en: 'Departments', ar: 'الأقسام التعليمية' },
        url: '#departments',
        tabId: 'departments',
        isEnabled: true,
        orderIndex: 3
      },
      {
        id: 'menu-faculty',
        title: { ur: 'اساتذہ کرام', en: 'Faculty', ar: 'الهيئة التدريسية' },
        url: '#faculty',
        tabId: 'faculty',
        isEnabled: true,
        orderIndex: 4
      },
      {
        id: 'menu-fatwas',
        title: { ur: 'دار الافتاء', en: 'Darul Ifta', ar: 'دار الإفتاء' },
        url: '#fatwas',
        tabId: 'fatwas',
        isEnabled: true,
        orderIndex: 5,
        children: [
          {
            id: 'menu-fatwas-archive',
            title: { ur: 'فتاویٰ آرکائیو (45,000+)', en: 'Fatwa Archive', ar: 'أرشيف الفتاوى' },
            url: '#fatwas',
            tabId: 'fatwas',
            isEnabled: true,
            orderIndex: 1
          },
          {
            id: 'menu-fatwas-ask',
            title: { ur: 'آن لائن فتویٰ پوچھیں', en: 'Ask Online Fatwa', ar: 'طلب فتوى شرعية' },
            url: '#ask-scholar',
            tabId: 'ask-scholar',
            isEnabled: true,
            orderIndex: 2
          },
          {
            id: 'menu-fatwas-duas',
            title: { ur: 'مسنون دعائیں و اذکار', en: 'Masnoon Duas', ar: 'الأدعية المأثورة' },
            url: '#fatwa-duas',
            tabId: 'fatwa-duas',
            isEnabled: true,
            orderIndex: 3
          },
          {
            id: 'menu-fatwas-names',
            title: { ur: 'اسلامی نام ڈائریکٹری', en: 'Islamic Names', ar: 'دليل الأسماء الإسلامية' },
            url: '#fatwa-names',
            tabId: 'fatwa-names',
            isEnabled: true,
            orderIndex: 4
          }
        ]
      },
      {
        id: 'menu-results',
        title: { ur: 'نتائج امتحانات', en: 'Exam Results', ar: 'النتائج الامتحانية' },
        url: '#results',
        tabId: 'results',
        isEnabled: true,
        orderIndex: 6
      },
      {
        id: 'menu-library',
        title: { ur: 'کتب خانہ', en: 'Library', ar: 'المكتبة الرقمية' },
        url: '#library',
        tabId: 'library',
        isEnabled: true,
        orderIndex: 7
      },
      {
        id: 'menu-online-services',
        title: { ur: 'آن لائن اکیڈمی', en: 'Online Academy', ar: 'التعليم الإلكتروني' },
        url: '#online-services',
        tabId: 'online-services',
        isEnabled: true,
        orderIndex: 8
      },
      {
        id: 'menu-donations',
        title: { ur: 'عطیات و زکوٰۃ', en: 'Donations & Zakat', ar: 'التبرعات والزكاة' },
        url: '#donations',
        tabId: 'donations',
        isEnabled: true,
        orderIndex: 9
      },
      {
        id: 'menu-contact',
        title: { ur: 'رابطہ', en: 'Contact Us', ar: 'اتصل بنا' },
        url: '#contact',
        tabId: 'contact',
        isEnabled: true,
        orderIndex: 10
      }
    ]
  },
  {
    id: 'menu-footer-quick',
    location: 'footer_quick',
    name: 'فوٹر کے اہم لنکس (Footer Quick Links)',
    updatedAt: '2026-08-30T10:00:00.000Z',
    items: [
      {
        id: 'fq-about',
        title: { ur: 'تعارفِ جامعہ و تاریخ', en: 'About Jamia', ar: 'عن الجامعة' },
        url: '#about',
        tabId: 'about',
        isEnabled: true,
        orderIndex: 1
      },
      {
        id: 'fq-darul-ifta',
        title: { ur: 'آن لائن دار الافتاء', en: 'Online Darul Ifta', ar: 'دار الإفتاء الإلكتروني' },
        url: '#fatwas',
        tabId: 'fatwas',
        isEnabled: true,
        orderIndex: 2
      },
      {
        id: 'fq-results',
        title: { ur: 'سالانہ امتحانی نتائج', en: 'Exam Results', ar: 'النتائج الامتحانية' },
        url: '#results',
        tabId: 'results',
        isEnabled: true,
        orderIndex: 3
      },
      {
        id: 'fq-library',
        title: { ur: 'ڈیجیٹل کتب خانہ و مطبوعات', en: 'Digital Library', ar: 'المكتبة والمطبوعات' },
        url: '#library',
        tabId: 'library',
        isEnabled: true,
        orderIndex: 4
      },
      {
        id: 'fq-donations',
        title: { ur: 'تعاون و عطیات فنڈز', en: 'Donations & Funds', ar: 'حسابات التبرعات' },
        url: '#donations',
        tabId: 'donations',
        isEnabled: true,
        orderIndex: 5
      }
    ]
  }
];

export const INITIAL_CMS_SECTIONS: CmsSection[] = [
  {
    id: 'sec-hero',
    sectionKey: 'hero',
    name: { ur: 'مرکزی ہیرو سیکشن', en: 'Main Hero Section', ar: 'القسم الرئيسي' },
    isEnabled: true,
    orderIndex: 1,
    title: {
      ur: 'الجامعة الإسلامية ایبت آباد، پاکستان',
      en: 'Jamia Islamia Abbottabad, Pakistan',
      ar: 'الجامعة الإسلامية أبيت آباد، باكستان'
    },
    subtitle: {
      ur: 'منارۂ علم و عمل | الحاق: وفاق المدارس العربیہ پاکستان | قیام: ۱۹۵۱ء',
      en: 'Beacon of Knowledge & Action | Affiliated with Wifaqul Madaris | Est. 1951',
      ar: 'منارة العلم والعمل | معتمدة من وفاق المدارس العربية | تأسست عام ١٩٥١م'
    },
    content: {
      ur: 'علومِ شرعیہ، حفظِ قرآن مجید، افتاء و تحقیق اور آن لائن اسلامی کورسز کا تاریخی و باوقار مرکز',
      en: 'A premier institutional center for traditional Islamic disciplines, Quranic memorization, Darul Ifta, and modern distance learning.',
      ar: 'مركز رائد للعلوم الشرعية، تحفيظ القرآن الكريم، دار الإفتاء والتعليم الإلكتروني.'
    },
    imageUrl: 'https://images.unsplash.com/photo-1584551246679-0daf3d275d0f?auto=format&fit=crop&w=1200&q=80',
    buttonText: { ur: 'آن لائن فتویٰ پوچھیں', en: 'Ask Fatwa Online', ar: 'طلب فتوى شرعية' },
    buttonUrl: '#fatwas',
    bgColor: 'bg-warm-cream',
    updatedAt: '2026-08-30T10:00:00.000Z'
  },
  {
    id: 'sec-portals',
    sectionKey: 'portals',
    name: { ur: '۸ مرکزی معلوماتی پورٹلز (Quick Portals)', en: '8 Core Access Portals', ar: 'البوابات الرئيسية' },
    isEnabled: true,
    orderIndex: 2,
    title: {
      ur: 'جامعہ کے مرکزی آن لائن پورٹلز',
      en: 'Core Institutional Portals',
      ar: 'البوابات الإلكترونية الرئيسية'
    },
    subtitle: {
      ur: 'فتاویٰ، امتحانی نتائج، کتب خانہ، داخلہ اور تعلیمی خدمات تک فوری رسائی',
      en: 'Instant access to Darul Ifta, Results, Library, Admissions and Academics',
      ar: 'وصول فوري لدار الإفتاء، النتائج، المكتبة والتسجيل'
    },
    updatedAt: '2026-08-30T10:00:00.000Z'
  },
  {
    id: 'sec-fatwas',
    sectionKey: 'fatwas',
    name: { ur: 'دار الافتاء و فتاویٰ آرکائیو', en: 'Darul Ifta Section', ar: 'قسم دار الإفتاء' },
    isEnabled: true,
    orderIndex: 3,
    title: {
      ur: 'آن لائن دار الافتاء و شرعی رہنمائی',
      en: 'Online Darul Ifta & Sharia Guidance',
      ar: 'دار الإفتاء الإلكتروني والإرشاد الشرعي'
    },
    subtitle: {
      ur: '۴۵ ہزار سے زائد مستند فتاویٰ کا آن لائن ذخیرہ',
      en: 'Searchable archive of 45,000+ authentic legal rulings',
      ar: 'أرشيف يضم أكثر من ٤٥ ألف فتوى شرعية معتمدة'
    },
    buttonText: { ur: 'تمام فتاویٰ تلاش کریں', en: 'Search All Fatwas', ar: 'تصفح جميع الفتاوى' },
    buttonUrl: '#fatwas',
    updatedAt: '2026-08-30T10:00:00.000Z'
  },
  {
    id: 'sec-online-academy',
    sectionKey: 'online_academy',
    name: { ur: 'عالمی آن لائن اکیڈمی سیکشن', en: 'Global Online Academy', ar: 'أكاديمية التعليم عن بعد' },
    isEnabled: true,
    orderIndex: 4,
    title: {
      ur: 'جامعہ گلوبل آن لائن اکیڈمی',
      en: 'Jamia Global Online Academy',
      ar: 'أكاديمية الجامعة للتعليم الإلكتروني'
    },
    subtitle: {
      ur: 'گھر بیٹھے ناظرہ، حفظِ قرآن اور درسِ نظامی کی بین الاقوامی کلاسز',
      en: 'Worldwide Live Classes for Quran Recitation, Tajweed, and Islamic Studies',
      ar: 'دروس مباشرة لتحفيظ القرآن والتجويد والعلوم الشرعية لجميع أنحاء العالم'
    },
    buttonText: { ur: '۳ روزہ مفت ٹرائل بک کریں', en: 'Book 3-Day Free Trial', ar: 'احجز تجربة مجانية ٣ أيام' },
    buttonUrl: '#online-services',
    updatedAt: '2026-08-30T10:00:00.000Z'
  },
  {
    id: 'sec-results',
    sectionKey: 'results',
    name: { ur: 'سالانہ امتحانی نتائج سیکشن', en: 'Examination Results', ar: 'قسم النتائج الامتحانية' },
    isEnabled: true,
    orderIndex: 5,
    title: {
      ur: 'سالانہ امتحانی نتائج و رول نمبر پورٹل',
      en: 'Annual Examination Results Portal',
      ar: 'بوابة النتائج الامتحانية والتحقق'
    },
    subtitle: {
      ur: 'رول نمبر درج کر کے سالانہ اور ششماہی نتائج فوری دیکھیں',
      en: 'Instant student grades and transcript verification by Roll Number',
      ar: 'الاستعلام الفوري عن نتائج الامتحانات برقم الجلوس'
    },
    buttonText: { ur: 'رزلٹ تلاش کریں', en: 'Check Result', ar: 'استعلم عن النتيجة' },
    buttonUrl: '#results',
    updatedAt: '2026-08-30T10:00:00.000Z'
  },
  {
    id: 'sec-donations',
    sectionKey: 'donations',
    name: { ur: 'عطیات، زکوٰۃ و صدقات سیکشن', en: 'Donations & Sadaqah', ar: 'قسم التبرعات والزكاة' },
    isEnabled: true,
    orderIndex: 6,
    title: {
      ur: 'جامعہ کے طلبہ کی کفالت و تعمیراتی فنڈ',
      en: 'Student Sponsorship & Campus Building Fund',
      ar: 'كفالة طلاب العلم وصندوق إعمار الجامعة'
    },
    subtitle: {
      ur: '۳۵۰۰ سے زائد طلبہ و طالبات کے لیے آپ کا تعاون صدقہ جاریہ ہے',
      en: 'Your generous contribution supports 3,500+ deserving students',
      ar: 'صدقتك الجارية تسهم في تعليم ورعاية أكثر من ٣٥٠٠ طالب وطالبة'
    },
    buttonText: { ur: 'بینک اکاؤنٹس تفصیلات', en: 'Bank Account Details', ar: 'تفاصيل الحسابات البنكية' },
    buttonUrl: '#donations',
    updatedAt: '2026-08-30T10:00:00.000Z'
  }
];

export const INITIAL_CMS_THEME_SETTINGS: CmsThemeSettings = {
  id: 'theme-default',
  logoUrl: JAMIA_HEADER_LOGO_DATA_URI,
  primaryColor: '#5C4632',      // Deep Bronze / Traditional Wood
  secondaryColor: '#B88A3B',    // Islamic Gold Accent
  accentColor: '#10B981',       // Emerald Green
  backgroundColor: '#F8F4EC',   // Traditional Warm Cream
  fontUrdu: 'Jameel Noori Nastaleeq, Noto Nastaliq Urdu, Gulzar, serif',
  fontArabic: 'Amiri, Noto Naskh Arabic, serif',
  fontEnglish: 'Playfair Display, Inter, sans-serif',
  borderRadius: '2xl',
  headerStyle: 'standard',
  footerStyle: 'four_columns',
  updatedAt: '2026-08-30T10:00:00.000Z'
};

export const INITIAL_CMS_SEO_SETTINGS: CmsSeoSettings = {
  id: 'seo-default',
  siteTitle: {
    ur: 'الجامعة الإسلامية ایبت آباد | آن لائن فتاویٰ، دینی تعلیم، امتحانی نتائج و زکوۃ',
    en: 'Jamia Islamia Abbottabad | Online Fatwa, Islamic Courses & Exam Results',
    ar: 'الجامعة الإسلامية أبيت آباد | الفتاوى الإلكترونية، العلوم الإسلامية والنتائج'
  },
  metaDescription: {
    ur: 'الجامعة الإسلامية ایبت آباد (پاکستان) کی رسمی ویب سائٹ۔ آن لائن فتاویٰ، حفظ و ناظرہ قرآن مجید، درس نظامی، امتحانی نتائج اور آن لائن اسلامی کورسز۔',
    en: 'Official Portal of Jamia Islamia Abbottabad, Pakistan (Est. 1951). Online Darul Ifta, Online Quran Academy, Dars-e-Nizami, Exam Results and Islamic Distance Learning.',
    ar: 'الموقع الرسمي للجامعة الإسلامية بأبيت آباد (باكستان). الفتاوى الشرعية الإلكترونية، تحفيظ القرآن، دراسة العلوم الإسلامية، والنتائج الامتحانية.'
  },
  keywords: 'الجامعة الإسلامية ایبت آباد, Jamia Islamia Abbottabad, دار الافتاء ایبت آباد, آن لائن فتاویٰ, امتحانی نتائج, آن لائن داخلہ مدرسہ, عطیات و زکوۃ, online quran academy, learn quran online, dars e nizami online, islamic university pakistan, abbottabad madrasa',
  ogTitle: {
    ur: 'الجامعة الإسلامية ایبت آباد — مرکز علومِ اسلامیہ و دار الافتاء',
    en: 'Jamia Islamia Abbottabad — Islamic Education & Research Centre',
    ar: 'الجامعة الإسلامية أبيت آباد — صرح العلوم الشرعية ودار الإفتاء'
  },
  ogDescription: {
    ur: 'آن لائن فتاویٰ، امتحانی نتائج، کتب خانہ اور دینی تعلیمات کا مرکزی پورٹل۔',
    en: 'Official gateway for authentic fatwas, exam results, digital library and Islamic courses.',
    ar: 'البوابة الرسمية للفتاوى الشرعية والنتائج والمكتبة الإسلامية الرقمية.'
  },
  ogImage: 'https://images.unsplash.com/photo-1584551246679-0daf3d275d0f?auto=format&fit=crop&w=1200&q=80',
  googleVerification: 'google-site-verification-jamia-islamia-abbottabad',
  canonicalBase: 'https://jamia-islamia-abbottabad.pages.dev',
  robotsTxt: `User-agent: *
Allow: /
Disallow: /api/admin
Disallow: /api/auth
Sitemap: https://jamia-islamia-abbottabad.pages.dev/sitemap.xml`,
  sitemapEnabled: true,
  updatedAt: '2026-08-30T10:00:00.000Z'
};

export const INITIAL_CMS_MEDIA: CmsMedia[] = [
  {
    id: 'media-logo-calligraphy',
    title: 'لوگو طغریٰ خطِ ثلث (Calligraphy Logo)',
    filename: 'jamia_logo_calligraphy.png',
    fileType: 'image',
    mimeType: 'image/png',
    fileSize: 45200,
    url: JAMIA_HEADER_LOGO_DATA_URI,
    thumbnailUrl: JAMIA_HEADER_LOGO_DATA_URI,
    altText: 'جامعہ اسلامیہ ایبٹ آباد خطِ ثلث لوگو',
    caption: 'آفیشل طغریٰ لوگو',
    createdAt: '2026-01-01T00:00:00.000Z'
  },
  {
    id: 'media-campus-banner',
    title: 'کیمپس عمارت و مسجد (Campus Architecture)',
    filename: 'jamia_campus_hero.jpg',
    fileType: 'image',
    mimeType: 'image/jpeg',
    fileSize: 320400,
    url: 'https://images.unsplash.com/photo-1584551246679-0daf3d275d0f?auto=format&fit=crop&w=1200&q=80',
    thumbnailUrl: 'https://images.unsplash.com/photo-1584551246679-0daf3d275d0f?auto=format&fit=crop&w=400&q=80',
    altText: 'جامعہ اسلامیہ ایبٹ آباد عمارت و مرکزی ہال',
    caption: 'مرکزی کیمپس مری روڈ ایبٹ آباد',
    createdAt: '2026-01-01T00:00:00.000Z'
  },
  {
    id: 'media-quran-academy',
    title: 'قرآن اکیڈمی و تجوید کلاس (Quran Academy)',
    filename: 'quran_academy_class.jpg',
    fileType: 'image',
    mimeType: 'image/jpeg',
    fileSize: 285100,
    url: 'https://images.unsplash.com/photo-1609599006353-e629aaabfeae?auto=format&fit=crop&w=1200&q=80',
    thumbnailUrl: 'https://images.unsplash.com/photo-1609599006353-e629aaabfeae?auto=format&fit=crop&w=400&q=80',
    altText: 'قرآن کریم تجوید و حفظ کلاس',
    caption: 'شعبہ حفظ و تجوید القرآن',
    createdAt: '2026-01-01T00:00:00.000Z'
  },
  {
    id: 'media-library-books',
    title: 'ڈیجیٹل کتب خانہ (Digital Library)',
    filename: 'islamic_library_books.jpg',
    fileType: 'image',
    mimeType: 'image/jpeg',
    fileSize: 310500,
    url: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=1200&q=80',
    thumbnailUrl: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=400&q=80',
    altText: 'کتبِ فقہ، حدیث و تفسیر',
    caption: 'مرکزی مکتبہ جامعہ اسلامیہ',
    createdAt: '2026-01-01T00:00:00.000Z'
  }
];

export const INITIAL_CMS_USERS: CmsAdminUser[] = [
  {
    id: 'usr-superadmin-1',
    email: 'jamiaislamia2003@gmail.com',
    username: 'jamiaislamia',
    fullName: 'مرکزی ایڈمنسٹریٹر (Super Admin)',
    role: 'superadmin',
    isActive: true,
    phone: '+92 348 9002496',
    createdAt: '2026-01-01T00:00:00.000Z'
  },
  {
    id: 'usr-darul-ifta-mufti',
    email: 'mufti@jamiaislamia.edu.pk',
    username: 'mufti_office',
    fullName: 'مفتی دار الافتاء (Chief Mufti)',
    role: 'admin',
    isActive: true,
    phone: '+92 992 381486',
    createdAt: '2026-02-01T00:00:00.000Z'
  },
  {
    id: 'usr-editor-content',
    email: 'editor@jamiaislamia.edu.pk',
    username: 'news_editor',
    fullName: 'محرر کتب و خبریں (Content Editor)',
    role: 'editor',
    isActive: true,
    createdAt: '2026-03-01T00:00:00.000Z'
  }
];
