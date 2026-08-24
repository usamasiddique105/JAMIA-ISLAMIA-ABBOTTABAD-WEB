export interface MasnoonDuaItem {
  id: string;
  titleUrdu: string;
  titleArabic?: string;
  category: 'daily' | 'morning_evening' | 'prayer' | 'protection' | 'illness' | 'forgiveness' | 'travel' | 'rizq';
  arabicText: string;
  urduTranslation: string;
  englishTranslation?: string;
  reference: string;
  benefit?: string;
  repeatCount?: number;
}

export const MASNOON_DUAS_DATA: MasnoonDuaItem[] = [
  // 1. Daily life
  {
    id: 'dua-1',
    titleUrdu: 'سوتے وقت کی مسنون دعا',
    titleArabic: 'دعاء النوم',
    category: 'daily',
    arabicText: 'بِاسْمِكَ رَبِّي وَضَعْتُ جَنْبِي، وَبِكَ أَرْفَعُهُ، فَإِنْ أَمْسَكْتَ نَفْسِي فَارْحَمْهَا، وَإِنْ أَرْسَلْتَهَا فَاحْفَظْهَا بِمَا تَحْفَظُ بِهِ عِبَادَكَ الصَّالِحِينَ۔',
    urduTranslation: 'اے میرے رب! تیرے ہی نام کے ساتھ میں نے اپنا پہلو (بستر پر) رکھا اور تیرے ہی سہارے میں اسے اٹھاؤں گا، اگر تو میری جان روک لے تو اس پر رحم فرما اور اگر تو اسے چھوڑ دے تو اس کی اسی طرح حفاظت فرما جس طرح تو اپنے نیک بندوں کی حفاظت فرماتا ہے۔',
    englishTranslation: 'In Your name my Lord, I lie down and in Your name I rise. If You should take my soul then have mercy upon it, and if You should return my soul then protect it in the manner You protect Your righteous slaves.',
    reference: 'صحیح البخاری: 6320، صحیح مسلم: 2714',
    benefit: 'رات کو سوتے وقت تمام آفات و شیطانی وسوسوں سے امن اور حفاظت کا ذریعہ۔'
  },
  {
    id: 'dua-2',
    titleUrdu: 'نیند سے بیدار ہونے کی دعا',
    titleArabic: 'دعاء الاستيقاظ من النوم',
    category: 'daily',
    arabicText: 'الْحَمْدُ لِلّٰهِ الَّذِي أَحْيَانَا بَعْدَ مَا أَمَاتَنَا وَإِلَيْهِ النُّشُورُ۔',
    urduTranslation: 'تمام تعریفیں اللہ کے لیے ہیں جس نے ہمیں مارنے (سلانے) کے بعد زندہ کیا اور اسی کی طرف (سب کو) دوبارہ اٹھ کر جانا ہے۔',
    englishTranslation: 'All praise is for Allah who gave us life after having taken it from us, and unto Him is the resurrection.',
    reference: 'صحیح البخاری: 6312، صحیح مسلم: 2711',
    benefit: 'صبح بیدار ہوتے ہی اللہ کی توحید اور شکر گزاری کا آغاز۔'
  },
  {
    id: 'dua-3',
    titleUrdu: 'بیت الخلاء (واش روم) جانے سے پہلے کی دعا',
    titleArabic: 'دعاء دخول الخلاء',
    category: 'daily',
    arabicText: 'اللّٰهُمَّ إِنِّي أَعُوذُ بِكَ مِنَ الْخُبُثِ وَالْخَبَائِثِ۔',
    urduTranslation: 'اے اللہ! میں خبیث جنات (نر) اور خبیث جنات (مادہ) یعنی تمام گندگیوں اور شیطانی اثرات سے تیری پناہ مانگتا ہوں۔',
    englishTranslation: 'O Allah, I seek refuge in You from the wicked male and female devils.',
    reference: 'صحیح البخاری: 142، صحیح مسلم: 375',
    benefit: 'شیاطین کی نظروں اور ناپاکی کے اثرات سے حجاب اور حفاظت۔'
  },
  {
    id: 'dua-4',
    titleUrdu: 'بیت الخلاء سے نکلنے کے بعد کی دعا',
    titleArabic: 'دعاء الخروج من الخلاء',
    category: 'daily',
    arabicText: 'غُفْرَانَكَ، الْحَمْدُ لِلّٰهِ الَّذِي أَذْهَبَ عَنِّي الْأَذَى وَعَافَانِي۔',
    urduTranslation: 'اے اللہ! میں تیری بخشش کا طلبگار ہوں۔ تمام تعریفیں اللہ تعالیٰ کے لیے ہیں جس نے مجھ سے تکلیف دہ چیز دور فرمائی اور مجھے عافیت عطا فرمائی۔',
    englishTranslation: 'I seek Your forgiveness. All praise is to Allah who removed hardship from me and granted me relief.',
    reference: 'سنن الترمذی: 7، سنن ابن ماجہ: 301',
    benefit: 'جسمانی راحت و صحت کی نعمت پر شکر گزاری۔'
  },
  {
    id: 'dua-5',
    titleUrdu: 'کھانا شروع کرنے کی دعا',
    titleArabic: 'دعاء قبل الطعام',
    category: 'daily',
    arabicText: 'بِسْمِ اللّٰهِ وَعَلَى بَرَكَةِ اللّٰهِ۔',
    urduTranslation: 'اللہ کے نام سے اور اللہ کی برکت کے ساتھ میں کھانا شروع کرتا ہوں۔',
    englishTranslation: 'In the name of Allah and upon the blessings of Allah.',
    reference: 'المستدرك للحاکم: 7084، سنن ابوداؤد: 3767',
    benefit: 'کھانے میں شیطانی شرکت ختم ہوتی ہے اور رزق میں برکت نازل ہوتی ہے۔'
  },
  {
    id: 'dua-6',
    titleUrdu: 'کھانے سے فراغت کے بعد کی دعا',
    titleArabic: 'دعاء بعد الفراغ من الطعام',
    category: 'daily',
    arabicText: 'الْحَمْدُ لِلّٰهِ الَّذِي أَطْعَمَنَا وَسَقَانَا وَجَعَلَنَا مِنَ الْمُسْلِمِينَ۔',
    urduTranslation: 'تمام تعریفیں اللہ کے لیے ہیں جس نے ہمیں کھلایا، پلایا اور ہمیں مسلمانوں میں سے بنایا۔',
    englishTranslation: 'All praise belongs to Allah who fed us and gave us drink and made us among Muslims.',
    reference: 'سنن الترمذی: 3457، سنن ابوداؤد: 3850',
    benefit: 'پچھلے تمام گناہوں کی معافی اور رزق میں برکت کا پروانہ۔'
  },
  {
    id: 'dua-7',
    titleUrdu: 'گھر سے باہر نکلتے وقت کی دعا',
    titleArabic: 'دعاء الخروج من المنزل',
    category: 'protection',
    arabicText: 'بِسْمِ اللّٰهِ تَوَكَّلْتُ عَلَى اللّٰهِ، وَلَا حَوْلَ وَلَا قُوَّةَ إِلَّا بِاللّٰهِ۔',
    urduTranslation: 'اللہ کے نام کے ساتھ، میں نے اللہ ہی پر بھروسہ کیا، اور گناہوں سے بچنے اور نیکی کرنے کی طاقت صرف اللہ ہی کی توفیق سے ہے۔',
    englishTranslation: 'In the name of Allah, I trust in Allah; there is no power and no strength except with Allah.',
    reference: 'سنن الترمذی: 3426، سنن ابوداؤد: 5095',
    benefit: 'فرشتہ کہتا ہے: تجھے کفایت کی گئی، تجھے بچا لیا گیا اور شیطان اس سے دور بھاگ جاتا ہے۔'
  },
  {
    id: 'dua-8',
    titleUrdu: 'مسجد میں داخل ہونے کی دعا',
    titleArabic: 'دعاء دخول المسجد',
    category: 'prayer',
    arabicText: 'اللّٰهُمَّ افْتَحْ لِي أَبْوَابَ رَحْمَتِكَ۔',
    urduTranslation: 'اے اللہ! میرے لیے اپنی رحمت کے تمام دروازے کھول دے۔',
    englishTranslation: 'O Allah, open for me the doors of Your mercy.',
    reference: 'صحیح مسلم: 713',
    benefit: 'مسجد میں داخل ہوتے وقت اللہ تعالیٰ کی خاص رحمتوں کا نزول۔'
  },
  {
    id: 'dua-9',
    titleUrdu: 'مسجد سے نکلتے وقت کی دعا',
    titleArabic: 'دعاء الخروج من المسجد',
    category: 'prayer',
    arabicText: 'اللّٰهُمَّ إِنِّي أَسْأَلُكَ مِنْ فَضْلِكَ وَرَحْمَتِكَ۔',
    urduTranslation: 'اے اللہ! میں تجھ سے تیرے فضل اور تیری رحمت کا سوال کرتا ہوں۔',
    englishTranslation: 'O Allah, I ask You from Your favor and Your mercy.',
    reference: 'صحیح مسلم: 713',
    benefit: 'دنیاوی مشاغل اور رزقِ حلال کی تلاش میں اللہ کے فضل کا ساتھ۔'
  },

  // 2. Morning & Evening Azkar (صبح و شام کے اذکار)
  {
    id: 'dua-10',
    titleUrdu: 'سید الاستغفار (تمام استغفاروں کا سردار)',
    titleArabic: 'سيد الاستغفار',
    category: 'morning_evening',
    arabicText: 'اللّٰهُمَّ أَنْتَ رَبِّي لَا إِلٰهَ إِلَّا أَنْتَ، خَلَقْتَنِي وَأَنَا عَبْدُكَ، وَأَنَا عَلَى عَهْدِكَ وَوَعْدِكَ مَا اسْتَطَعْتُ، أَعُوذُ بِكَ مِنْ شَرِّ مَا صَنَعْتُ، أَبُوءُ لَكَ بِنِعْمَتِكَ عَلَيَّ، وَأَبُوءُ بِذَنْبِي فَاغْفِرْ لِي فَإِنَّهُ لَا يَغْفِرُ الذُّنُوبَ إِلَّا أَنْتَ۔',
    urduTranslation: 'اے اللہ! تو ہی میرا پروردگار ہے، تیرے سوا کوئی معبود نہیں، تو نے ہی مجھے پیدا کیا اور میں تیرا بندہ ہوں اور میں اپنی استطاعت کے مطابق تیرے عہد اور وعدے پر قائم ہوں۔ میں اپنے کیے کے شر سے تیری پناہ مانگتا ہوں، اپنے اوپر تیری نعمتوں کا اعتراف کرتا ہوں اور اپنے گناہوں کا اقرار کرتا ہوں، پس مجھے بخش دے کیونکہ تیرے سوا کوئی گناہوں کو معاف نہیں کر سکتا۔',
    englishTranslation: 'O Allah, You are my Lord, there is no deity but You. You created me and I am Your servant, and I uphold Your covenant and promise as best I can. I seek refuge in You from the evil of what I have done. I acknowledge Your favors upon me and I confess my sins, so forgive me, for none forgives sins except You.',
    reference: 'صحیح البخاری: 6306',
    benefit: 'نبی کریم ﷺ نے فرمایا: جو شخص یقین کے ساتھ صبح اسے پڑھے اور شام سے پہلے وفات پا جائے یا شام کو پڑھے اور صبح سے پہلے وفات پا جائے تو وہ جنتی ہے۔',
    repeatCount: 1
  },
  {
    id: 'dua-11',
    titleUrdu: 'ہر قسم کے اچانک نقصان اور زہر و جادو سے حفاظت کی دعا',
    titleArabic: 'دعاء الحماية والوقاية',
    category: 'protection',
    arabicText: 'بِسْمِ اللّٰهِ الَّذِي لَا يَضُرُّ مَعَ اسْمِهِ شَيْءٌ فِي الْأَرْضِ وَلَا فِي السَّمَاءِ وَهُوَ السَّمِيعُ الْعَلِيمُ۔',
    urduTranslation: 'اللہ کے نام سے، جس کے نام کی برکت سے زمین اور آسمان میں کوئی چیز نقصان نہیں پہنچا سکتی اور وہی سب کچھ سننے والا اور جاننے والا ہے۔',
    englishTranslation: 'In the name of Allah, with whose name nothing on earth or in heaven can cause harm, and He is the All-Hearing, the All-Knowing.',
    reference: 'سنن الترمذی: 3388، سنن ابوداؤد: 5088',
    benefit: 'جو شخص صبح اور شام ۳ مرتبہ یہ کلمات پڑھے اسے کوئی چیز نقصان نہیں پہنچا سکتی۔',
    repeatCount: 3
  },
  {
    id: 'dua-12',
    titleUrdu: 'غم، پریشانی، قرض اور بے بسی سے نجات کی دعا',
    titleArabic: 'دعاء تفريج الهم والغم وقضاء الدين',
    category: 'rizq',
    arabicText: 'اللّٰهُمَّ إِنِّي أَعُوذُ بِكَ مِنَ الْهَمِّ وَالْحَزَنِ، وَأَعُوذُ بِكَ مِنَ الْعَجْزِ وَالْكَسَلِ، وَأَعُوذُ بِكَ مِنَ الْجُبْنِ وَالْبُخْلِ، وَأَعُوذُ بِكَ مِنْ غَلَبَةِ الدَّيْنِ وَقَهْرِ الرِّجَالِ۔',
    urduTranslation: 'اے اللہ! میں فکر اور غم سے تیری پناہ مانگتا ہوں، عاجزی اور سستی سے تیری پناہ مانگتا ہوں، بزدلی اور کنجوسی سے تیری پناہ مانگتا ہوں، اور قرض کے غلبے اور لوگوں کے دباؤ و تسلط سے تیری پناہ مانگتا ہوں۔',
    englishTranslation: 'O Allah, I seek refuge in You from grief and sadness, from weakness and laziness, from cowardice and stinginess, from being overcome by debt and oppressed by men.',
    reference: 'صحیح البخاری: 2893، سنن ابوداؤد: 1555',
    benefit: 'فکر و پریشانیوں کا یقینی علاج اور پہاڑ جیسا قرض بھی آسانی سے ادا ہونے کا ذریعہ۔'
  },
  {
    id: 'dua-13',
    titleUrdu: 'سفر پر روانہ ہوتے وقت کی مسنون دعا',
    titleArabic: 'دعاء السفر',
    category: 'travel',
    arabicText: 'سُبْحَانَ الَّذِي سَخَّرَ لَنَا هٰذَا وَمَا كُنَّا لَهُ مُقْرِنِينَ، وَإِنَّا إِلَى رَبِّنَا لَمُنْقَلِبُونَ۔ اللّٰهُمَّ إِنَّا نَسْأَلُكَ فِي سَفَرِنَا هٰذَا الْبِرَّ وَالتَّقْوَى، وَمِنَ الْعَمَلِ مَا تَرْضَى۔',
    urduTranslation: 'پاک ہے وہ ذات جس نے اس (سواری) کو ہمارے قابو میں کر دیا حالانکہ ہم اسے قابو میں لانے والے نہ تھے، اور بے شک ہم اپنے رب ہی کی طرف لوٹ کر جانے والے ہیں۔ اے اللہ! ہم اپنے اس سفر میں تجھ سے نیکی اور پرہیزگاری کا اور ایسے عمل کا سوال کرتے ہیں جس سے تو راضی ہو۔',
    englishTranslation: 'Glory unto Him who has subjected this to us, for we could never have achieved it by ourselves. And indeed, to our Lord we will return. O Allah, we ask You in this journey of ours for righteousness and piety, and for deeds that please You.',
    reference: 'صحیح مسلم: 1342',
    benefit: 'سفر کے دوران حادثات اور ناخوشگوار حالات سے امان۔'
  },
  {
    id: 'dua-14',
    titleUrdu: 'مریض کی عیادت اور شفا کی دعا',
    titleArabic: 'دعاء عيادة المريض والشفاء',
    category: 'illness',
    arabicText: 'أَسْأَلُ اللّٰهَ الْعَظِيمَ، رَبَّ الْعَرْشِ الْعَظِيمِ، أَنْ يَشْفِيَكَ۔',
    urduTranslation: 'میں عظمت والے اللہ سے، جو عرشِ عظیم کا مالک ہے، سوال کرتا ہوں کہ وہ تجھے (بیماری سے) شفا عطا فرمائے۔',
    englishTranslation: 'I ask Almighty Allah, Lord of the Magnificent Throne, to grant you cure.',
    reference: 'سنن الترمذی: 2083، سنن ابوداؤد: 3106',
    benefit: 'رسول اللہ ﷺ نے فرمایا: جو شخص کسی ایسے مریض کی عیادت کرے جس کی موت کا وقت نہ آیا ہو اور ۷ مرتبہ یہ دعا پڑھے تو اللہ تعالیٰ اسے ضرور شفا عطا فرماتے ہیں۔',
    repeatCount: 7
  },
  {
    id: 'dua-15',
    titleUrdu: 'آئینہ دیکھنے کی مسنون دعا',
    titleArabic: 'دعاء النظر في المرآة',
    category: 'daily',
    arabicText: 'اللّٰهُمَّ أَنْتَ حَسَّنْتَ خَلْقِي فَحَسِّنْ خُلُقِي۔',
    urduTranslation: 'اے اللہ! جس طرح تو نے میری صورت و تخلیق کو خوبصورت بنایا ہے، اسی طرح میرے اخلاق و کردار کو بھی بہترین اور خوبصورت بنا دے۔',
    englishTranslation: 'O Allah, just as You have made my physical appearance beautiful, so make my character and manners beautiful.',
    reference: 'مسند احمد: 24392، شعب الإيمان للبيهقي: 8003',
    benefit: 'حسنِ سیرت اور عمدہ اخلاق کی توفیق۔'
  }
];
