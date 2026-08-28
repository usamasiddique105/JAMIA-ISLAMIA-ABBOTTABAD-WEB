import { 
  Fatwa, 
  OnlineQuestion, 
  ExamResult, 
  Department, 
  FacultyMember, 
  PublicationBook, 
  MediaItem, 
  NewsItem, 
  DonationRecord, 
  SiteSettings, 
  PrayerTimes,
  ClassBooking 
} from '../types';

export const INITIAL_PRAYER_TIMES: PrayerTimes = {
  fajr: '04:15 AM',
  sunrise: '05:40 AM',
  dhuhr: '12:20 PM',
  asr: '05:15 PM',
  maghrib: '07:05 PM',
  isha: '08:45 PM',
  jummah: '01:30 PM',
  location: 'Abbottabad, KP, Pakistan'
};

export const INITIAL_SITE_SETTINGS: SiteSettings = {
  jamiaNameUrdu: 'جامعہ اسلامیہ ایبٹ آباد',
  jamiaNameEnglish: 'Jamia Islamia Abbottabad',
  jamiaNameArabic: 'الجامعة الإسلامية أبت أباد',
  tagline: {
    ur: 'مرکز علوم اسلامیہ و دار الافتاء، ایبٹ آباد، پاکستان',
    en: 'Center for Classical Islamic Sciences & Darul Ifta, Abbottabad, Pakistan',
    ar: 'مركز العلوم الإسلامية ودار الإفتاء، أبت أباد، باكستان'
  },
  phonePrimary: '03489002496',
  phoneSecondary: '0992-381401',
  email: 'info@jamia-islamia-abbottabad.pages.dev',
  whatsappNumber: '03489002496',
  notificationEmail: 'jamiaislamia2003@gmail.com',
  notificationWhatsApp: '03489002496',
  enableEmailNotifications: true,
  enableWhatsAppNotifications: true,
  address: 'جامعہ اسلامیہ، مری روڈ، کالا پل، ایبٹ آباد، خیبر پختونخوا، پاکستان',
  city: 'Abbottabad',
  registrationNumber: '1454/5/5183',
  affiliationNumber: '08-04-09345',
  visitorCount: 1428590,
  heroAnnouncement: {
    ur: 'سالانہ داخلے برائے سال ۲۰۲۶ء جاری ہیں - دار الافتاء و درس نظامی میں آن لائن رجسٹریشن فعال ہے',
    en: 'Annual Admissions 2026 Open - Online Registration Active for Dars-e-Nizami & Darul Ifta',
    ar: 'باب القبول والتسجيل مفتوح للعام الدراسي ۲۰۲۶م في كليتي دار الإفتاء والدرس النظامي'
  },
  bankDetails: {
    meezanBank: {
      title: 'USAMA',
      accountNo: '00300115179559',
      iban: 'PK70MEZN0000300115179559',
      branch: 'MEEZAN DIGITAL CENTRE',
      swift: 'MEZNPKKA'
    },
    bankIslami: {
      title: 'Jamia Islamia Abbottabad Welfare',
      accountNo: '',
      iban: ''
    },
    hbl: {
      title: 'Jamia Islamia Abbottabad Education Trust',
      accountNo: '',
      iban: ''
    },
    easyPaisa: {
      title: 'USAMA',
      number: '03489002496'
    },
    jazzCash: {
      title: '',
      number: ''
    }
  }
};

export const INITIAL_FATWAS: Fatwa[] = [];

export const INITIAL_ONLINE_QUESTIONS: OnlineQuestion[] = [];

export const INITIAL_EXAM_RESULTS: ExamResult[] = [];

export const INITIAL_DEPARTMENTS: Department[] = [
  {
    id: 'dept-1',
    name: {
      ur: 'تخصص فی الافتاء (دار الافتاء)',
      en: 'Faculty of Ifta & Specialized Jurisprudence',
      ar: 'قسم التخصص في الإفتاء والفقه الإسلامي'
    },
    code: 'IFTA-01',
    description: {
      ur: 'جدید اور قدیم فقہی مسائل، رسم المفتی اور آن لائن فتویٰ نویسی میں دو سالہ اعلیٰ تحقیقی و تخصصی نصاب۔',
      en: '2-Year Postgraduate specialization program in Islamic Law, Fatwa Research, and Contemporary Financial/Social Jurisprudence.',
      ar: 'برنامج الماجستير العالي المتخصص في أصول الإفتاء والقضايا المعاصرة وصياغة الفتاوى الشرعية.'
    },
    duration: '2 Years (Post-Dars-e-Nizami)',
    headOfDept: 'حضرت مولانا مفتی رشید احمد صاحب',
    totalStudents: 15,
    curriculum: ['رسم المفتی و القواعد الفقهية', 'فقه النوازل والمستجدات المعاصرة', 'کتب الفتاوى المعتمدة', 'البحث والرسالة العلمية'],
    eligibility: 'Shahadat-ul-Alimiyyah (Dars-e-Nizami Masters Equivalent) with 70%+ Marks'
  },
  {
    id: 'dept-2',
    name: {
      ur: 'شعبہ درس نظامی (شہادۃ العالمیہ)',
      en: 'Faculty of Dars-e-Nizami (Classical Islamic Studies)',
      ar: 'كلية العلوم الإسلامية والعربية (الدرس النظامي)'
    },
    code: 'DN-02',
    description: {
      ur: '۸ سالہ جامع نصاب جس میں تفسير، حدیث، فقہ، منطق، بلاغت اور عربی ادب کی کلاسیکی کتب کی تعلیم دی جاتی ہے۔',
      en: '8-Year Comprehensive Traditional Degree covering Quranic Exegesis, Hadith Sciences, Fiqh, Arabic Grammar, Rhetoric, and Logic.',
      ar: 'برنامج نظامي يمتد لـ ٨ سنوات يشمل علوم القرآن والحديث والفقه واللغة العربية والبلاغة.'
    },
    duration: '8 Years (Aammah to Alimiyyah)',
    headOfDept: 'حضرت مولانا فضل الرحمان صاحب',
    totalStudents: 200,
    curriculum: ['صحاح ستة (دورہ حدیث)', 'تفسیر ابن کثیر و بیضاوی', 'الهداية و نور الانوار', 'شرح جامی و البلاغة الواضحة'],
    eligibility: 'Matriculation or Sanavia Aammah Entry Test'
  },
  {
    id: 'dept-3',
    name: {
      ur: 'شعبہ تجوید و تحفیظ القرآن الکریم',
      en: 'Department of Quranic Memorization & Tajweed',
      ar: 'قسم تحفيظ القرآن الكريم والتجويد'
    },
    code: 'HIFZ-03',
    description: {
      ur: 'قرآن مجید کا باقاعدہ حفظ، مع تجوید، حسنِ قرأت اور روزمرہ مسنون دعاؤں کی تربیت۔',
      en: 'Rigorous Quran memorization program integrated with Tajweed phonetics, daily adkar, and character building.',
      ar: 'إتقان حفظ القرآن الكريم كاملاً مع تطبيق أحكام التجويد ورسم المصحف.'
    },
    duration: '3 Years Average',
    headOfDept: 'مولانا مفتی اسامہ صدیقی صاحب',
    totalStudents: 100,
    curriculum: ['حفظ القرآن الکریم', 'قواعد التجوید', 'الأدعية المأثورة'],
    eligibility: 'Age 8+ and Primary Nazira Proficiency'
  }
];

export const INITIAL_FACULTY: FacultyMember[] = [
  {
    id: 'fac-1',
    name: {
      ur: 'حضرت مولانا مفتی عبد الملک صاحب (دامت برکاتہم)',
      en: 'Hazrat Maulana Mufti Abdul Malik Sahib',
      ar: 'فضيلة الشيخ المفتي عبد الملك (حفظه الله)'
    },
    designation: {
      ur: 'مہتمم و شیخ الحدیث، جامعہ اسلامیہ ایبٹ آباد',
      en: 'Principal & Head Sheikh-ul-Hadith',
      ar: 'مدير الجامعة وشيخ الحديث'
    },
    department: 'Dars-e-Nizami & Administration',
    specialization: 'Hadith Sciences, Fiqh & University Administration',
    qualification: 'Shahadat-ul-Alimiyyah (Darul Uloom Deoband / Karachi), Takhassus Fil Ifta',
    photoUrl: 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&q=80&w=400',
    experienceYears: 38,
    bio: 'Renowned Islamic scholar of Khyber Pakhtunkhwa, author of multiple Fiqh treatises, and leading patron of Islamic education in the Hazara region for over 3 decades.'
  },
  {
    id: 'fac-2',
    name: {
      ur: 'حضرت مولانا مفتی سعید الرحمن صاحب',
      en: 'Hazrat Maulana Mufti Saeed-ur-Rahman Sahib',
      ar: 'فضيلة المفتي سعيد الرحمن'
    },
    designation: {
      ur: 'رئیس دار الافتاء و استادِ حدیث',
      en: 'Head of Darul Ifta & Professor of Hadith',
      ar: 'رئيس دار الإفتاء وأستاذ الحديث'
    },
    department: 'Takhassus Fil Ifta',
    specialization: 'Comparative Fiqh, Islamic Economics & Fatwa Writing',
    qualification: 'Takhassus Fil Ifta (Jamia Binoria / Karachi), M.Phil Islamic Studies',
    photoUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=400',
    experienceYears: 26,
    bio: 'Author of over 12,000 verified Fatwas, expert in Islamic commercial law, inheritance, and contemporary socio-legal issues.'
  },
  {
    id: 'fac-3',
    name: {
      ur: 'قاری حافظ ضیاء الحق صاحب',
      en: 'Qari Hafiz Zia-ul-Haq Sahib',
      ar: 'القارئ الحافظ ضياء الحق'
    },
    designation: {
      ur: 'رئيس شعبہ تجوید و قراءات',
      en: 'Head of Tajweed & Qira’at Department',
      ar: 'رئيس قسم التجويد والقراءات'
    },
    department: 'Tajweed & Hifz',
    specialization: 'Qira’at Ashara, Tajweed Phonetics & Quran Studies',
    qualification: 'Shahadat-ul-Qira’at (Madinah Al-Munawwarah Sanad)',
    photoUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=400',
    experienceYears: 22,
    bio: 'Gold medalist Qari with unbroken sanad extending back to the Holy Prophet ﷺ.'
  }
];

export const INITIAL_BOOKS: PublicationBook[] = [];

export const INITIAL_MEDIA: MediaItem[] = [];

export const INITIAL_NEWS: NewsItem[] = [];

export const INITIAL_DONATIONS: DonationRecord[] = [];

export const INITIAL_CLASS_BOOKINGS: ClassBooking[] = [];
