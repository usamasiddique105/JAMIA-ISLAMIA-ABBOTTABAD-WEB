export interface IslamicNameItem {
  id: string;
  nameUrdu: string;
  nameArabic: string;
  nameEnglish: string;
  meaningUrdu: string;
  gender: 'boy' | 'girl';
  category: 'prophet' | 'sahabi' | 'sahabiyyah' | 'quranic' | 'general';
  firstLetter: string;
  significance?: string;
}

export const ISLAMIC_NAMES_DATA: IslamicNameItem[] = [
  // Boys Names - Prophets & Sahabah
  {
    id: 'name-1',
    nameUrdu: 'محمد',
    nameArabic: 'مُحَمَّد',
    nameEnglish: 'Muhammad',
    meaningUrdu: 'جس کی کثرت سے تعریف و توصیف کی گئی ہو، لائقِ ستائش',
    gender: 'boy',
    category: 'prophet',
    firstLetter: 'م',
    significance: 'سرورِ کائنات، خاتم النبیین حضرت محمد مصطفیٰ ﷺ کا مبارک اسمِ گرامی'
  },
  {
    id: 'name-2',
    nameUrdu: 'احمد',
    nameArabic: 'أَحْمَد',
    nameEnglish: 'Ahmad',
    meaningUrdu: 'سب سے زیادہ تعریف کرنے والا، لائقِ تحسین',
    gender: 'boy',
    category: 'prophet',
    firstLetter: 'ا',
    significance: 'نبی کریم ﷺ کا مبارک آسمانی نام جس کی خوشخبری کتبِ سماویہ میں دی گئی'
  },
  {
    id: 'name-3',
    nameUrdu: 'ابوبکر',
    nameArabic: 'أَبُو بَكْر',
    nameEnglish: 'Abu Bakr',
    meaningUrdu: 'پہل کرنے والا، بلند حوصلہ',
    gender: 'boy',
    category: 'sahabi',
    firstLetter: 'ا',
    significance: 'خلیفہ اول، یارِ غار سیدنا ابوبکر صدیق رضی اللہ عنہ'
  },
  {
    id: 'name-4',
    nameUrdu: 'عمر',
    nameArabic: 'عُمَر',
    nameEnglish: 'Umar',
    meaningUrdu: 'لمبی عمر پانے والا، آبادکار، پختہ عزم والا',
    gender: 'boy',
    category: 'sahabi',
    firstLetter: 'ع',
    significance: 'خلیفہ دوم، امیر المؤمنین فاروقِ اعظم سیدنا عمر بن خطاب رضی اللہ عنہ'
  },
  {
    id: 'name-5',
    nameUrdu: 'عثمان',
    nameArabic: 'عُثْمَان',
    nameEnglish: 'Usman',
    meaningUrdu: 'خوبصورت پرندہ، بلند رتبہ، حیا والا',
    gender: 'boy',
    category: 'sahabi',
    firstLetter: 'ع',
    significance: 'خلیفہ سوم، ذوالنورین سیدنا عثمان غنی رضی اللہ عنہ'
  },
  {
    id: 'name-6',
    nameUrdu: 'علی',
    nameArabic: 'عَلِيّ',
    nameEnglish: 'Ali',
    meaningUrdu: 'بلند مرتبہ، اعلیٰ، عظمت والا',
    gender: 'boy',
    category: 'sahabi',
    firstLetter: 'ع',
    significance: 'خلیفہ چہارم، حیدرِ کرار سیدنا علی المرتضیٰ رضی اللہ عنہ'
  },
  {
    id: 'name-7',
    nameUrdu: 'حسن',
    nameArabic: 'حَسَن',
    nameEnglish: 'Hasan',
    meaningUrdu: 'خوبصورت، نیک سیرت، عمدہ کردار والا',
    gender: 'boy',
    category: 'sahabi',
    firstLetter: 'ح',
    significance: 'نواسہ رسول ﷺ، سید شباب اہل الجنہ سیدنا حسن رضی اللہ عنہ'
  },
  {
    id: 'name-8',
    nameUrdu: 'حسین',
    nameArabic: 'حُسَيْن',
    nameEnglish: 'Husain',
    meaningUrdu: 'انتہائی حسین، پیارا، نیک خصلت والا',
    gender: 'boy',
    category: 'sahabi',
    firstLetter: 'ح',
    significance: 'نواسہ رسول ﷺ، سید الشہداء سیدنا حسین رضی اللہ عنہ'
  },
  {
    id: 'name-9',
    nameUrdu: 'ابراہیم',
    nameArabic: 'إِبْرَاهِيم',
    nameEnglish: 'Ibrahim',
    meaningUrdu: 'مہربان باپ، اقوام کا رہنما',
    gender: 'boy',
    category: 'prophet',
    firstLetter: 'ا',
    significance: 'خلیل اللہ، جد الانبیاء حضرت ابراہیم علیہ السلام'
  },
  {
    id: 'name-10',
    nameUrdu: 'اسماعیل',
    nameArabic: 'إِسْمَاعِيل',
    nameEnglish: 'Ismail',
    meaningUrdu: 'اللہ کا فرمانبردار، دعا سننے والا',
    gender: 'boy',
    category: 'prophet',
    firstLetter: 'ا',
    significance: 'ذبیح اللہ حضرت اسماعیل علیہ السلام'
  },
  {
    id: 'name-11',
    nameUrdu: 'یوسف',
    nameArabic: 'يُوسُف',
    nameEnglish: 'Yusuf',
    meaningUrdu: 'اضافہ کرنے والا، بے پناہ حسن و جمال والا',
    gender: 'boy',
    category: 'prophet',
    firstLetter: 'ی',
    significance: 'حضرت یوسف علیہ السلام، صاحبِ حسن و سیرت'
  },
  {
    id: 'name-12',
    nameUrdu: 'خالد',
    nameArabic: 'خَالِد',
    nameEnglish: 'Khalid',
    meaningUrdu: 'ہمیشہ رہنے والا، پائیدار، شجاع',
    gender: 'boy',
    category: 'sahabi',
    firstLetter: 'خ',
    significance: 'سیف اللہ سیدنا خالد بن ولید رضی اللہ عنہ'
  },
  {
    id: 'name-13',
    nameUrdu: 'طلحہ',
    nameArabic: 'طَلْحَة',
    nameEnglish: 'Talha',
    meaningUrdu: 'سایہ دار درخت، شاداب پودا، کشادہ دل',
    gender: 'boy',
    category: 'sahabi',
    firstLetter: 'ط',
    significance: 'عشرہ مبشرہ میں شامل جلیل القدر صحابی سیدنا طلحہ بن عبید اللہ رضی اللہ عنہ'
  },
  {
    id: 'name-14',
    nameUrdu: 'زبیر',
    nameArabic: 'زُبَيْر',
    nameEnglish: 'Zubair',
    meaningUrdu: 'مضبوط، دانشمند، بہادر و نڈر',
    gender: 'boy',
    category: 'sahabi',
    firstLetter: 'ز',
    significance: 'حواریِ رسول ﷺ سیدنا زبیر بن عوام رضی اللہ عنہ'
  },
  {
    id: 'name-15',
    nameUrdu: 'سعد',
    nameArabic: 'سَعْد',
    nameEnglish: 'Saad',
    meaningUrdu: 'خوش بخت، مبارک، نیک نصیب',
    gender: 'boy',
    category: 'sahabi',
    firstLetter: 'س',
    significance: 'فاتح ایران، فاتح قادسیہ سیدنا سعد بن ابی وقاص رضی اللہ عنہ'
  },
  {
    id: 'name-16',
    nameUrdu: 'بلال',
    nameArabic: 'بِلَال',
    nameEnglish: 'Bilal',
    meaningUrdu: 'پانی کی نمی، تروتازگی، فتح و کامرانی',
    gender: 'boy',
    category: 'sahabi',
    firstLetter: 'ب',
    significance: 'موذنِ رسول ﷺ سیدنا بلال حبشی رضی اللہ عنہ'
  },
  {
    id: 'name-17',
    nameUrdu: 'حمزہ',
    nameArabic: 'حَمْزَة',
    nameEnglish: 'Hamza',
    meaningUrdu: 'شیر، بہادر، غیرت مند اور مضبوط',
    gender: 'boy',
    category: 'sahabi',
    firstLetter: 'ح',
    significance: 'اسد اللہ و اسد رسولہ، سید الشہداء حضرت حمزہ بن عبد المطلب رضی اللہ عنہ'
  },
  {
    id: 'name-18',
    nameUrdu: 'عبد اللہ',
    nameArabic: 'عَبْدُ الله',
    nameEnglish: 'Abdullah',
    meaningUrdu: 'اللہ کا بندہ، محبوب ترین نام',
    gender: 'boy',
    category: 'quranic',
    firstLetter: 'ع',
    significance: 'حدیثِ نبوی میں اللہ تعالیٰ کو سب سے محبوب ترین نام'
  },
  {
    id: 'name-19',
    nameUrdu: 'عبد الرحمٰن',
    nameArabic: 'عَبْدُ الرَّحْمٰن',
    nameEnglish: 'Abdur Rahman',
    meaningUrdu: 'نہایت مہربان ذات (اللہ) کا بندہ',
    gender: 'boy',
    category: 'quranic',
    firstLetter: 'ع',
    significance: 'حدیثِ نبوی کے مطابق اللہ تعالیٰ کا نہایت پسندیدہ نام'
  },
  {
    id: 'name-20',
    nameUrdu: 'انس',
    nameArabic: 'أَنَس',
    nameEnglish: 'Anas',
    meaningUrdu: 'محبت کرنے والا، انسیت پیدا کرنے والا، خوش مزاج',
    gender: 'boy',
    category: 'sahabi',
    firstLetter: 'ا',
    significance: 'خادمِ خاص رسول اللہ ﷺ سیدنا انس بن مالک رضی اللہ عنہ'
  },
  {
    id: 'name-21',
    nameUrdu: 'طارق',
    nameArabic: 'طَارِق',
    nameEnglish: 'Tariq',
    meaningUrdu: 'صبح کا روشن ستارہ، رات کو آنے والا، فاتح',
    gender: 'boy',
    category: 'quranic',
    firstLetter: 'ط',
    significance: 'قرآن کریم کی سورۃ الطارق کا عنوان اور فاتح اندلس طارق بن زیاد'
  },
  {
    id: 'name-22',
    nameUrdu: 'حذیفہ',
    nameArabic: 'حُذَيْفَة',
    nameEnglish: 'Huzaifa',
    meaningUrdu: 'سمجھدار، گناہوں سے پاکیزہ، دانشمند',
    gender: 'boy',
    category: 'sahabi',
    firstLetter: 'ح',
    significance: 'رازدارِ رسول ﷺ سیدنا حذیفہ بن یمان رضی اللہ عنہ'
  },
  {
    id: 'name-23',
    nameUrdu: 'معاذ',
    nameArabic: 'مُعَاذ',
    nameEnglish: 'Muaz',
    meaningUrdu: 'اللہ کی پناہ میں دیا گیا، محفوظ و مامون',
    gender: 'boy',
    category: 'sahabi',
    firstLetter: 'م',
    significance: 'حلال و حرام کے سب سے بڑے عالم صحابی سیدنا معاذ بن جبل رضی اللہ عنہ'
  },
  {
    id: 'name-24',
    nameUrdu: 'ریان',
    nameArabic: 'رَيَّان',
    nameEnglish: 'Rayan',
    meaningUrdu: 'سیراب، ترو تازہ، جنت کا ایک خاص دروازہ',
    gender: 'boy',
    category: 'general',
    firstLetter: 'ر',
    significance: 'جنت کا وہ خاص دروازہ جس سے صرف روزہ دار داخل ہوں گے'
  },
  {
    id: 'name-25',
    nameUrdu: 'زید',
    nameArabic: 'زَيْد',
    nameEnglish: 'Zaid',
    meaningUrdu: 'زیادتی، برکت، ترقی، فضل پانے والا',
    gender: 'boy',
    category: 'sahabi',
    firstLetter: 'ز',
    significance: 'جلیل القدر صحابی جن کا مبارک نام قرآن مجید میں صراحتاً مذکور ہے (سیدنا زید بن حارثہؓ)'
  },

  // Girls Names - Sahabiyyat & Islamic
  {
    id: 'name-51',
    nameUrdu: 'فاطمہ',
    nameArabic: 'فَاطِمَة',
    nameEnglish: 'Fatimah',
    meaningUrdu: 'برائیوں اور آگ سے بچانے والی، پاک دامن',
    gender: 'girl',
    category: 'sahabiyyah',
    firstLetter: 'ف',
    significance: 'سیدہ نساء اہل الجنہ، حضور اکرم ﷺ کی پیاری صاحبزادی حضرت فاطمۃ الزہراء رضی اللہ عنہا'
  },
  {
    id: 'name-52',
    nameUrdu: 'عائشہ',
    nameArabic: 'عَائِشَة',
    nameEnglish: 'Ayesha',
    meaningUrdu: 'خوشحال زندگی گزارنے والی، زندہ دل، راحت پانے والی',
    gender: 'girl',
    category: 'sahabiyyah',
    firstLetter: 'ع',
    significance: 'ام المؤمنین، فقیہہ امت، صدیقہ بنت صدیق حضرت عائشہ رضی اللہ عنہا'
  },
  {
    id: 'name-53',
    nameUrdu: 'خدیجہ',
    nameArabic: 'خَدِيجَة',
    nameEnglish: 'Khadijah',
    meaningUrdu: 'پاکیزہ، وقت سے پہلے فہم پانے والی، طاہرہ',
    gender: 'girl',
    category: 'sahabiyyah',
    firstLetter: 'خ',
    significance: 'خاتونِ اول، ام المؤمنین سیدہ خدیجۃ الکبریٰ رضی اللہ عنہا'
  },
  {
    id: 'name-54',
    nameUrdu: 'مریم',
    nameArabic: 'مَرْيَم',
    nameEnglish: 'Maryam',
    meaningUrdu: 'عبادت گزار، پاک دامن، اللہ کے لیے وقف',
    gender: 'girl',
    category: 'quranic',
    firstLetter: 'م',
    significance: 'سیدہ مریم علیہا السلام، جن کے نام پر قرآن مجید میں پوری سورت موجود ہے'
  },
  {
    id: 'name-55',
    nameUrdu: 'زینب',
    nameArabic: 'زَيْنَب',
    nameEnglish: 'Zainab',
    meaningUrdu: 'خوشبودار و خوبصورت پھول، باپ کی زینت',
    gender: 'girl',
    category: 'sahabiyyah',
    firstLetter: 'ز',
    significance: 'حضور ﷺ کی بڑی صاحبزادی اور امہات المؤمنین میں سے ایک'
  },
  {
    id: 'name-56',
    nameUrdu: 'حفصہ',
    nameArabic: 'حَفْصَة',
    nameEnglish: 'Hafsa',
    meaningUrdu: 'شیرنی کی بچی، بہادر، حفاظت کرنے والی',
    gender: 'girl',
    category: 'sahabiyyah',
    firstLetter: 'ح',
    significance: 'ام المؤمنین حضرت حفصہ بنت عمر بن خطاب رضی اللہ عنہما'
  },
  {
    id: 'name-57',
    nameUrdu: 'اسماء',
    nameArabic: 'أَسْمَاء',
    nameEnglish: 'Asma',
    meaningUrdu: 'بلند رتبہ، عالی مرتبت، صفات کی حامل',
    gender: 'girl',
    category: 'sahabiyyah',
    firstLetter: 'ا',
    significance: 'ذات النطاقین سیدہ اسماء بنت ابی بکر رضی اللہ عنہما'
  },
  {
    id: 'name-58',
    nameUrdu: 'سیدہ',
    nameArabic: 'سَيِّدَة',
    nameEnglish: 'Sayyidah',
    meaningUrdu: 'سردار، معزز، بلند مرتبہ خاتون',
    gender: 'girl',
    category: 'general',
    firstLetter: 'س',
    significance: 'شریف اور برگزیدہ خواتین کے لیے مستعمل معزز لقب'
  },
  {
    id: 'name-59',
    nameUrdu: 'حلیمہ',
    nameArabic: 'حَلِيمَة',
    nameEnglish: 'Halima',
    meaningUrdu: 'بردبار، صابرہ، تحمل اور نرم مزاج والی',
    gender: 'girl',
    category: 'sahabiyyah',
    firstLetter: 'ح',
    significance: 'رضاعی والدہ رسول اللہ ﷺ سیدہ حلیمہ سعدیہ رضی اللہ عنہا'
  },
  {
    id: 'name-60',
    nameUrdu: 'میمونہ',
    nameArabic: 'مَيْمُونَة',
    nameEnglish: 'Maimoona',
    meaningUrdu: 'بابرکت، سعادت مند، نیک نصیب',
    gender: 'girl',
    category: 'sahabiyyah',
    firstLetter: 'م',
    significance: 'ام المؤمنین سیدہ میمونہ بنت حارث رضی اللہ عنہا'
  },
  {
    id: 'name-61',
    nameUrdu: 'ام کلثوم',
    nameArabic: 'أُمّ كُلْثُوم',
    nameEnglish: 'Umm Kulthum',
    meaningUrdu: 'گول اور خوبصورت چہرے والی، صاحبِ جمال',
    gender: 'girl',
    category: 'sahabiyyah',
    firstLetter: 'ا',
    significance: 'حضور ﷺ کی پیاری صاحبزادی اور زوجہ حضرت عثمان رضی اللہ عنہ'
  },
  {
    id: 'name-62',
    nameUrdu: 'رقیہ',
    nameArabic: 'رُقَيَّة',
    nameEnglish: 'Ruqayyah',
    meaningUrdu: 'ترقی پانے والی، بلندی حاصل کرنے والی، نازک و لطیف',
    gender: 'girl',
    category: 'sahabiyyah',
    firstLetter: 'ر',
    significance: 'حضور ﷺ کی پیاری صاحبزادی اور زوجہ حضرت عثمان رضی اللہ عنہ'
  },
  {
    id: 'name-63',
    nameUrdu: 'آمنہ',
    nameArabic: 'آمِنَة',
    nameEnglish: 'Aaminah',
    meaningUrdu: 'امان دینے والی، اطمینان اور سکون والی، قابلِ اعتماد',
    gender: 'girl',
    category: 'quranic',
    firstLetter: 'آ',
    significance: 'والدہ ماجدہ رسول اللہ ﷺ سیدہ آمنہ رضی اللہ عنہا'
  },
  {
    id: 'name-64',
    nameUrdu: 'سمیہ',
    nameArabic: 'سُمَيَّة',
    nameEnglish: 'Sumayyah',
    meaningUrdu: 'بلند رتبہ، اعلیٰ مقام والی، معزز',
    gender: 'girl',
    category: 'sahabiyyah',
    firstLetter: 'س',
    significance: 'اسلام کی پہلی شہید خاتون سیدہ سمیہ رضی اللہ عنہا'
  },
  {
    id: 'name-65',
    nameUrdu: 'طاہرہ',
    nameArabic: 'طَاهِرَة',
    nameEnglish: 'Tahirah',
    meaningUrdu: 'پاکیزہ، گناہوں سے مبرا، پاک دامن',
    gender: 'girl',
    category: 'general',
    firstLetter: 'ط',
    significance: 'سیدہ خدیجۃ الکبریٰ رضی اللہ عنہا کا مبارک لقب'
  },
  {
    id: 'name-66',
    nameUrdu: 'خنساء',
    nameArabic: 'خَنْسَاء',
    nameEnglish: 'Khansa',
    meaningUrdu: 'خوبصورت ناک والی، ہرنی کی طرح چست، عظیم صابرہ شاعرہ',
    gender: 'girl',
    category: 'sahabiyyah',
    firstLetter: 'خ',
    significance: 'عظیم مجاہدہ صحابیہ جن کے چاروں بیٹوں نے جنگِ قادسیہ میں جامِ شہادت نوش کیا'
  },
  {
    id: 'name-67',
    nameUrdu: 'جویرہ',
    nameArabic: 'جُوَيْرِيَة',
    nameEnglish: 'Juwairiyah',
    meaningUrdu: 'چھوٹی کلی، گلاب کا پھول، نازک اور پرکشش',
    gender: 'girl',
    category: 'sahabiyyah',
    firstLetter: 'ج',
    significance: 'ام المؤمنین سیدہ جویریہ بنت حارث رضی اللہ عنہا'
  },
  {
    id: 'name-68',
    nameUrdu: 'صفیہ',
    nameArabic: 'صَفِيَّة',
    nameEnglish: 'Safiyyah',
    meaningUrdu: 'مخلص دوست، خالص، بے عیب اور برگزیدہ',
    gender: 'girl',
    category: 'sahabiyyah',
    firstLetter: 'ص',
    significance: 'ام المؤمنین حضرت صفیہ اور پھوپھی رسول اللہ ﷺ حضرت صفیہ بنت عبد المطلب رضی اللہ عنہما'
  },
  {
    id: 'name-69',
    nameUrdu: 'نور',
    nameArabic: 'نُور',
    nameEnglish: 'Noor',
    meaningUrdu: 'روشنی، اجالا، چمک، ہدایت کا نور',
    gender: 'girl',
    category: 'quranic',
    firstLetter: 'ن',
    significance: 'قرآن مجید کی مبارک سورۃ النور اور اسمائے حسنیٰ میں سے'
  },
  {
    id: 'name-70',
    nameUrdu: 'عروہ',
    nameArabic: 'عُرْوَة',
    nameEnglish: 'Urwah',
    meaningUrdu: 'مضبوط سہارا، پختہ کڑا، لائقِ اعتماد تعلق',
    gender: 'girl',
    category: 'quranic',
    firstLetter: 'ع',
    significance: 'قرآنی اصطلاح "العروة الوثقیٰ" (مضبوط کڑا)'
  }
];
