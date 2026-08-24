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
  phoneSecondary: '03489002496',
  email: 'usamasiddique105@gmail.com',
  whatsappNumber: '03489002496',
  notificationEmail: 'usamasiddique105@gmail.com',
  notificationWhatsApp: '03489002496',
  enableEmailNotifications: true,
  enableWhatsAppNotifications: true,
  address: 'جامعہ اسلامیہ، مری روڈ، کالا پل، ایبٹ آباد، خیبر پختونخوا، پاکستان',
  city: 'Abbottabad',
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

export const INITIAL_FATWAS: Fatwa[] = [
  {
    id: 'fatwa-1001',
    fatwaNumber: '1001',
    title: {
      ur: 'میاں بیوی کا ہبہ سے رجوع کرنے کا حکم',
      en: 'Ruling on Revoking a Gift Between Spouses After Divorce',
      ar: 'حكم رجوع أحد الزوجين في الهبة بعد الطلاق'
    },
    question: {
      ur: 'کیا فرماتے ہیں مفتیانِ کرام کہ شوہر نے اپنی بیوی کو تین تولہ سونا بطور تحفہ کے دیا، بعد ازاں شوہر نے بیوی کو طلاق دی، کیا اب وہ مذکورہ سونا کے واپس لینے کا حق رکھتا ہے یا نہیں؟',
      en: 'What is the ruling regarding a husband who gifted three tolas of gold to his wife during marriage, and later divorced her? Does he have the right to revoke this gift and reclaim the gold?',
      ar: 'ما قولكم في رجل وهب زوجته ثلاثة تولات من الذهب حال قيام الزوجية، ثم طلقها بعد ذلك، فهل يملك حق الرجوع في تلك الهبة واسترداد الذهب أم لا؟'
    },
    questionerName: 'سائل',
    questionerEmail: 'questioner@example.com',
    category: 'نکاح و طلاق',
    answer: {
      ur: 'الجواب باسم ملہم الصواب: واضح رہے کہ ہبہ پر جب موہوب لہ (جس کے لیے ہبہ کیا گیا ہو) قبضہ کر لے، تو اس میں رجوع کرنا مکروہ ہے، تاہم اگر ہبہ قریبی رشتہ دار کے لیے ہو، یا رجوع کے موانع (جیسے میاں بیوی کے درمیان ہبہ ہونا وغیرہ) پائے جائیں، تو پھر رجوع کرنا شرعاً جائز نہیں ہوتا۔ صورتِ مسئولہ میں اگر واقعی شوہر نے بیوی کو نکاح کی حالت میں مذکورہ سونا بطور تحفہ دیا تھا اور بیوی نے اس پر قبضہ بھی کر لیا تھا، تو بعد از قبضہ کے شوہر اس ہبہ سے رجوع کا حق نہیں رکھتا، خواہ بیوی اس کے نکاح میں ہو یا نکاح سے نکل چکی ہو۔ فقط واللہ تعالی اعلم بالصواب۔',
      en: 'In Islamic jurisprudence (Hanafi Fiqh), once a gift (Hibah) is delivered and possessed between spouses during marriage, it becomes irrevocable by virtue of the spousal relationship (Mani\' min ar-Ruju\'). Subsequent divorce does not revoke this prohibition. Therefore, since the husband gifted and handed over the gold to his wife during marriage, he has no legal right in Shariah to revoke the gift or demand the gold back after divorce.',
      ar: 'الجواب باسم ملهم الصواب: من القواعد المقررة في الفقه الحنفي أن الهبة إذا تمت وقبضها الموهوب له، وكانت بين الزوجين حال قيام الزوجية، فإنه يمتنع الرجوع فيها شرعاً، ولا يسقط هذا المانع بوقوع الطلاق بعد ذلك. وعليه؛ فإذا كان الزوج قد وهب الذهب لزوجته في حال النكاح وسلّمه إليها، فلا يحق له الرجوع في هذه الهبة ولا استرداد الذهب بعد الطلاق. فقط والله تعالى أعلم بالصواب.'
    },
    arabicText: 'وفي الفتاوى الهندية: الرجوع في الهبة مكروه في الأحوال كلها ويصح، كذا في التاتارخانية... أما العوارض المانعة من الرجوع فأنواع: (ومنها الزوجية) سواء كان أحد الزوجين مسلما أو كافرا، كذا في الاختيار شرح المختار. وإذا وهب أحد الزوجين لصاحبه لا يرجع في الهبة، وإن انقطع النكاح بينهما. (الفتاوى الهندية: 4/385)\n\nكتبه: اسامہ صدیقی',
    date: '۱۹ اگست ۲۰۲۶ء',
    muftiName: 'مفتیانِ دار الافتاء جامعہ اسلامیہ ایبٹ آباد',
    status: 'Published',
    isFeatured: true,
    views: 1890
  },
  {
    id: 'fatwa-1',
    fatwaNumber: '1448-01-101',
    title: {
      ur: 'زبان کا پھسلنا اس بات کی علامت ہے کہ بندے نے خطاء کا ارتکاب کیا ہے؟',
      en: 'Is a slip of the tongue a sign that a person has committed an error?',
      ar: 'هل سبق اللسان علامة على ارتكاب الخطأ؟'
    },
    question: {
      ur: 'کیا فرماتے ہیں مفتیانِ کرام کہ گفتگو کے دوران اگر انسان کی زبان سے غیر ارادی طور پر کوئی نا مناسب لفظ نکل جائے تو کیا اس پر گرفت ہوگی یا یہ معاف ہے؟',
      en: 'What is the ruling if an inappropriate word slips unintentionally from a person during conversation?',
      ar: 'ما حكم سبق اللسان بكلمة غير مقصودة في أثناء الحديث؟'
    },
    questionerName: 'محمد عثمان',
    questionerEmail: 'usman@example.com',
    category: 'متفرقات',
    answer: {
      ur: 'الجواب وباللہ التوفیق: غیر ارادی طور پر زبان کا پھسلنا (سبقِ لسانی) خطا اور نسیان کے قبیل سے ہے جس پر شریعتِ مطہرہ میں کوئی مواخذہ اور گناہ نہیں ہے۔ حدیث مبارک میں ہے: "إن الله تجاوز عن أمتي الخطأ والنسيان وما استكرهوا عليه"۔ تاہم انسان کو چاہیے کہ استغفار کرے اور آئندہ محتاط گفتگو کی عادت ڈالے۔ واللہ اعلم بالصواب۔',
      en: 'An unintentional slip of the tongue without intent is forgiven in Shariah. However, one should seek forgiveness and practice caution in speech.',
      ar: 'الجواب وبالله التوفيق: سبق اللسان من غير قصد معفو عنه في الشرع لقوله ﷺ: "إن الله تجاوز عن أمتي الخطأ والنسيان وما استكرهوا عليه". والله أعلم.'
    },
    arabicText: 'إن الله تجاوز عن أمتي الخطأ والنسيان وما استكرهوا عليه (سنن ابن ماجه)',
    date: '۱۹ اگست ۲۰۲۶ء',
    muftiName: 'مفتیانِ دار الافتاء جامعہ اسلامیہ ایبٹ آباد',
    status: 'Published',
    isFeatured: true,
    views: 1420
  },
  {
    id: 'fatwa-2',
    fatwaNumber: '1448-01-102',
    title: {
      ur: 'امام صاحب کے انتقال پر جنازہ کی نماز کے وقت مسجد میں امامت کس نے کروانی تھی؟',
      en: 'Who has the primary right to lead daily prayers when the regular Imam passes away?',
      ar: 'من الأحق بالإمامة في المسجد عند وفاة الإمام الراتب؟'
    },
    question: {
      ur: 'اگر مسجد کے مستقل امام صاحب کا انتقال ہو جائے تو جنازہ کی نماز کے دوران یا بعد میں مسجد کے باقاعدہ نائب امام امامت کروائیں گے یا کوئی بھی مقتدی؟',
      en: 'If the permanent Imam of a mosque passes away, who has the rightful priority to lead?',
      ar: 'إذا توفي إمام المسجد الراتب، فمن الأحق بالتقدم للصلاة؟'
    },
    questionerName: 'عبد الرحمٰن خان',
    questionerEmail: 'rehman@example.com',
    category: 'نماز و طہارت',
    answer: {
      ur: 'الجواب وباللہ التوفیق: مسجد کے امامِ راتب کے بعد امامت کا حق نائب امام یا انتظامیہ کے مقرر کردہ معتمد شخص کا ہوتا ہے جو احکامِ نماز اور قرات میں سب سے زیادہ ماہر اور باشرع ہو۔ واللہ اعلم بالصواب۔',
      en: 'The deputy Imam or the person appointed by the administration who is most knowledgeable in Islamic rulings has the right to lead.',
      ar: 'الأحق بالإمامة هو نائب الإمام أو من تعينه إدارة المسجد ممن هو أعلم بالسنة وأقرأ لكتاب الله.'
    },
    date: '۱۹ اگست ۲۰۲۶ء',
    muftiName: 'مفتیانِ دار الافتاء جامعہ اسلامیہ ایبٹ آباد',
    status: 'Published',
    isFeatured: true,
    views: 980
  },
  {
    id: 'fatwa-3',
    fatwaNumber: '1448-01-103',
    title: {
      ur: 'پھلوں کے پکنے سے قبل انکی فروخت کے بعد اگر غیر اختیاری طور پر پھل ضائع ہوں تو اس کا نقصان کس پر ہوگا؟',
      en: 'Who bears the loss if unripened fruits sold on trees are destroyed by natural causes?',
      ar: 'على من يقع ضمان تلف الثمار قبل بدو صلاحها؟'
    },
    question: {
      ur: 'باغات کے پھل پکنے سے قبل فروخت کیے گئے تھے، بعد میں آندھی یا ژالہ باری سے پھل گر گئے، یہ نقصان خریدار کا ہوگا یا فروخت کنندہ کا؟',
      en: 'If unripened fruit is sold on trees and later ruined by hail or storm, who bears the liability?',
      ar: 'ما حكم بيع الثمار قبل بدو صلاحها وضمان الجائحة؟'
    },
    questionerName: 'حاجی غلام رسول',
    questionerEmail: 'rasool@example.com',
    category: 'بیوع و معاملات',
    answer: {
      ur: 'الجواب وباللہ التوفیق: پھل کے پکنے اور کارآمد ہونے سے قبل اس کی علی الاطلاق بیع درست نہیں، اگر بیع فاسد کی بنیاد پر ہوئی اور قدرتی آفت (جائحہ) سے پھل ضائع ہوئے تو نقصان مالک (فروخت کنندہ) پر ہوگا کیونکہ بیع تام نہیں ہوئی تھی۔ واللہ اعلم بالصواب۔',
      en: 'Selling fruit before it ripens and becomes beneficial is impermissible in Shariah. If natural disaster occurs before delivery, the seller bears the loss.',
      ar: 'نهى النبي ﷺ عن بيع الثمار حتى يبدو صلاحها، وإن تلفت بجائحة سقط الثمن عن المشتري وضمانها على البائع.'
    },
    date: '۱۸ اگست ۲۰۲۶ء',
    muftiName: 'مفتیانِ دار الافتاء جامعہ اسلامیہ ایبٹ آباد',
    status: 'Published',
    isFeatured: true,
    views: 1250
  },
  {
    id: 'fatwa-4',
    fatwaNumber: '1448-01-104',
    title: {
      ur: 'معاہدگی قیمت سے زیادہ پر سونے کی خریداری کا حکم',
      en: 'Ruling on purchasing gold at higher than agreed spot prices on deferred payment',
      ar: 'حكم شراء الذهب بسعر أعلى مع تأجيل الدفع'
    },
    question: {
      ur: 'کیا سونے کو نقد کی بجائے ادھار یا قسطوں پر زیادہ قیمت میں خریدنا جائز ہے؟',
      en: 'Is it permissible to buy gold on installments or credit with an increased price?',
      ar: 'هل يجوز شراء الذهب بالتقسيط بزيادة في السعر؟'
    },
    questionerName: 'طارق محمود',
    questionerEmail: 'tariq@example.com',
    category: 'بیوع و معاملات',
    answer: {
      ur: 'الجواب وباللہ التوفیق: سونا کرنسی اور اموالِ ربویہ میں سے ہے، اس لیے سونے کی خرید و فروخت میں نقد دست بدست (یداً بید) قبضہ ہونا اور مجلس میں ادائیگی ضروری ہے، ادھار یا قسطوں پر زائد قیمت کے ساتھ سونا خریدنا بیع ربوی ہونے کی وجہ سے شرعاً ناجائز اور حرام ہے۔ واللہ اعلم بالصواب۔',
      en: 'Gold must be exchanged hand-to-hand on spot. Purchasing gold on credit or installments with price markup is impermissible (Riba).',
      ar: 'لا يجوز شراء الذهب بالتقسيط أو الدين، بل يشترط التقابض الفوري يداً بيد في مجلس العقد.'
    },
    date: '۱۸ اگست ۲۰۲۶ء',
    muftiName: 'مفتیانِ دار الافتاء جامعہ اسلامیہ ایبٹ آباد',
    status: 'Published',
    isFeatured: false,
    views: 890
  },
  {
    id: 'fatwa-5',
    fatwaNumber: '1448-01-105',
    title: {
      ur: 'این جی اوز کے اعلانات کے ذریعے حاصل ہونے والی رقوم سے مساجد یا دینی مدارس میں تعمیراتی کام کروانا',
      en: 'Using funds obtained through NGO grants for mosque and madrasa construction',
      ar: 'استخدام أموال المنظمات غير الحكومية في بناء المساجد والمدارس'
    },
    question: {
      ur: 'کیا غیر سرکاری تنظیموں (این جی اوز) کی فنڈنگ سے مسجد یا مدرسہ کی تعمیر کروانا جائز ہے؟',
      en: 'Can grants and donations from NGOs be utilized for constructing mosques and religious institutions?',
      ar: 'هل يجوز الاستفادة من منح المنظمات في إعمار المساجد والمدارس الدينية؟'
    },
    questionerName: 'قاری خلیل احمد',
    questionerEmail: 'khalil@example.com',
    category: 'زکوٰۃ و صدقات',
    answer: {
      ur: 'الجواب وباللہ التوفیق: اگر این جی او کی آمدن کا ذریعہ حلال ہو اور ان کے فنڈز کے ساتھ کوئی خلافِ شرع شرط یا دینی مقاصد پر اثر انداز ہونے والا ایجنڈا وابستہ نہ ہو تو ایسی رقوم مساجد و مدارس کی تعمیر میں لگانا جائز ہے۔ مشتبہ یا غیر شرعی شرائط والی تنظیموں کے فنڈز سے احتراز لازم ہے۔ واللہ اعلم بالصواب۔',
      en: 'If the funds are from lawful sources with no un-Islamic conditions attached, they may be used for mosque and madrasa construction.',
      ar: 'يجوز ذلك إذا كانت مصادر التمويل مباحة ولم تشترط المنظمة أي شرط يخالف الشريعة الإسلامية.'
    },
    date: '۱۷ اگست ۲۰۲۶ء',
    muftiName: 'مفتیانِ دار الافتاء جامعہ اسلامیہ ایبٹ آباد',
    status: 'Published',
    isFeatured: false,
    views: 1120
  },
  {
    id: 'fatwa-6',
    fatwaNumber: '1448-01-106',
    title: {
      ur: 'لوگوں کو دھوکے میں مبتلا کرنے اور نقصان پہنچانے کے لیے غلط بیانی کرنا اور جھوٹ بولنا',
      en: 'The severe prohibition of deceit, fraud, and deceptive statements in trade',
      ar: 'حرمة الغش والتدليس والكذب للإضرار بالآخرين'
    },
    question: {
      ur: 'کاروبار یا نجی معاملات میں جھوٹ بول کر یا عیب چھپا کر مال بیچنا شرعاً کیسا ہے؟',
      en: 'What is the Islamic ruling on concealing defects and deceiving buyers in business transactions?',
      ar: 'ما حكم كتمان عيوب السلعة والكذب في التجارة؟'
    },
    questionerName: 'عبد اللہ بٹ',
    questionerEmail: 'butt@example.com',
    category: 'بیوع و معاملات',
    answer: {
      ur: 'الجواب وباللہ التوفیق: جھوٹ بولنا اور خریدار کو دھوکہ دینا سخت حرام اور کبیرہ گناہ ہے۔ رسول اللہ صلی اللہ علیہ وسلم نے فرمایا: "من غشنا فلیس منا" (جس نے دھوکہ دیا وہ ہم میں سے نہیں)۔ عیب دار چیز کا عیب واضح کرنا واجب ہے۔ واللہ اعلم بالصواب۔',
      en: 'Deception and lying to buyers is strictly forbidden and a major sin. The Prophet ﷺ said: "He who deceives us is not of us."',
      ar: 'الغش والكذب في البيع من كبائر المحرمات، لقول النبي ﷺ: "من غشنا فليس منا"، ويجب بيان العيب.'
    },
    date: '۱۷ اگست ۲۰۲۶ء',
    muftiName: 'مفتیانِ دار الافتاء جامعہ اسلامیہ ایبٹ آباد',
    status: 'Published',
    isFeatured: false,
    views: 1540
  },
  {
    id: 'fatwa-7',
    fatwaNumber: '1448-01-107',
    title: {
      ur: 'پیکٹ والی چیز کو ترازو کے بغیر وزن کیے بغیر اندازے سے بیچنا',
      en: 'Selling packaged goods by estimation without accurate weighing',
      ar: 'بيع السلع المعبأة جزافاً دون وزن دقيق'
    },
    question: {
      ur: 'جو اشیاء پیکٹ میں آتی ہیں مگر ان پر وزن متعین نہیں ہوتا، ان کو بغیر تولے اندازے سے بیچنا کیسا ہے؟',
      en: 'What is the ruling on selling packaged items by rough estimate without exact weight measurement?',
      ar: 'ما حكم بيع المواد المعبأة جزافاً دون معرفة الوزن؟'
    },
    questionerName: 'محمد جاوید',
    questionerEmail: 'javed@example.com',
    category: 'بیوع و معاملات',
    answer: {
      ur: 'الجواب وباللہ التوفیق: اگر پیکٹ یا چیز سامنے موجود ہو اور بیع جزاف (اندازے پر بیع) کے اصولوں کے تحت دونوں فریقین باہمی رضامندی سے مجموعی قیمت طے کر لیں اور اس میں کوئی نزاع کا اندیشہ نہ ہو تو جائز ہے، ورنہ وزن کی جانے والی اشیاء کو تول کر بیچنا ہی شریعت کا تقاضا ہے۔ واللہ اعلم بالصواب۔',
      en: 'Selling by viewing and mutual agreement as a lot (Juzāf) is permissible if both parties agree and there is no ambiguity.',
      ar: 'بيع الجزاف جائز إذا كانت السلعة مرئية ومعلومة بالعادة ولا تؤدي إلى الغرر والمنازعة.'
    },
    date: '۱۶ اگست ۲۰۲۶ء',
    muftiName: 'مفتیانِ دار الافتاء جامعہ اسلامیہ ایبٹ آباد',
    status: 'Published',
    isFeatured: false,
    views: 740
  },
  {
    id: 'fatwa-8',
    fatwaNumber: '1448-01-108',
    title: {
      ur: 'ضرورت کے وقت نائٹ گلاس پہننے کا شرعی حکم',
      en: 'Ruling on wearing night vision goggles or protective night glasses when necessary',
      ar: 'حكم استخدام النظارات الليلية للحاجة'
    },
    question: {
      ur: 'کیا رات کو ڈرائیونگ یا حفاظت کے پیشِ نظر نائٹ ویژن یا اینٹی گلیئر عینک کا استعمال شرعاً جائز ہے؟',
      en: 'Is it permissible in Shariah to use anti-glare or night vision glasses for driving safety?',
      ar: 'هل يجوز لبس النظارات الواقية من الإشعاع ليلاً للقيادة؟'
    },
    questionerName: 'سہیل اختر',
    questionerEmail: 'suhail@example.com',
    category: 'متفرقات',
    answer: {
      ur: 'الجواب وباللہ التوفیق: رات کو آنکھوں کی حفاظت، واضح بینائی اور حادثات سے بچاؤ کے لیے نائٹ گلاسز یا اینٹی گلیئر شیشے پہننا بلا شبہ جائز اور مباح ہے۔ واللہ اعلم بالصواب۔',
      en: 'Using protective or anti-glare night glasses for road safety and visual clarity is completely permissible.',
      ar: 'يجوز استعمال نظارات القيادة الليلية لغرض السلامة وحماية العين من الأذى.'
    },
    date: '۱۶ اگست ۲۰۲۶ء',
    muftiName: 'مفتیانِ دار الافتاء جامعہ اسلامیہ ایبٹ آباد',
    status: 'Published',
    isFeatured: false,
    views: 620
  },
  {
    id: 'fatwa-9',
    fatwaNumber: '1448-01-109',
    title: {
      ur: 'دستی گھڑی کے وقت اور اوقاتِ نماز کے تعین کا حکم',
      en: 'Relying on digital and wrist watches for determining accurate prayer times',
      ar: 'الاعتماد على الساعات اليدوية في تحديد أوقات الصلاة'
    },
    question: {
      ur: 'اگر کوئی شخص گھڑی دیکھ کر نماز ادا کرے تو کیا یہ نماز کے شرعی وقت کا معتبر ذریعہ ہے؟',
      en: 'Is relying on calibrated clocks and watches sufficient for determining prayer times?',
      ar: 'هل يصح الاعتماد على التوقيت بالساعات لتحديد دخول وقت الصلاة؟'
    },
    questionerName: 'بلال سعید',
    questionerEmail: 'bilal@example.com',
    category: 'نماز و طہارت',
    answer: {
      ur: 'الجواب وباللہ التوفیق: مستند اور معتبر نقشہ اوقاتِ صلوٰۃ کے مطابق گھڑی کے وقت پر اعتماد کر کے نماز پڑھنا بالکل درست اور شرعاً معتبر ہے۔ واللہ اعلم بالصواب۔',
      en: 'Relying on accurate watches calibrated with authentic prayer schedules is fully valid in Shariah.',
      ar: 'يصح الاعتماد على الساعات المنضبطة وفق الجداول الفلكية المعتمدة شرعاً.'
    },
    date: '۱۵ اگست ۲۰۲۶ء',
    muftiName: 'مفتیانِ دار الافتاء جامعہ اسلامیہ ایبٹ آباد',
    status: 'Published',
    isFeatured: false,
    views: 890
  },
  {
    id: 'fatwa-10',
    fatwaNumber: '1448-01-110',
    title: {
      ur: 'نکاح کے الفاظ میں سے کسی لفظ کے غلط تلفظ کا نکاح پر اثر',
      en: 'Impact of minor mispronunciation of Nikah contract formula words on the marriage',
      ar: 'أثر اللحن أو الخطأ اللفظي في صيغة الإيجاب والقبول في النكاح'
    },
    question: {
      ur: 'ایجاب و قبول کے وقت اگر کسی فریق نے عربی یا اردو کے لفظ کا تلفظ تھوڑا غلط ادا کیا تو کیا نکاح منعقد ہو جاتا ہے؟',
      en: 'If a party slightly mispronounces a word during the offer and acceptance, is the Nikah valid?',
      ar: 'هل ينعقد النكاح إذا لحن العاقد في نطق الإيجاب والقبول؟'
    },
    questionerName: 'وقاص علی',
    questionerEmail: 'waqas@example.com',
    category: 'نکاح و طلاق',
    answer: {
      ur: 'الجواب وباللہ التوفیق: اگر غلط تلفظ سے معنی اس حد تک تبدیل نہ ہو جائے کہ انکار یا فساد لازم آئے، اور عرف و قرائن سے ایجاب و قبول کا مفہوم واضح ہو تو نکاح شرعاً منعقد ہو جاتا ہے۔ واللہ اعلم بالصواب۔',
      en: 'If the intention and customary meaning of acceptance remains clear without corrupting the essence, the Nikah is valid.',
      ar: 'ينعقد النكاح ما دام القصد معلوماً واللحن لا يغير المعنى الأساسي للإيجاب والقبول.'
    },
    date: '۱۵ اگست ۲۰۲۶ء',
    muftiName: 'مفتیانِ دار الافتاء جامعہ اسلامیہ ایبٹ آباد',
    status: 'Published',
    isFeatured: false,
    views: 1670
  },
  {
    id: 'fatwa-11',
    fatwaNumber: '1448-01-111',
    title: {
      ur: 'قرضداروں کی رقم پر ان کے اجازت کے بغیر صدقہ کرنا اور اس پر ثواب کی امید رکھنا',
      en: 'Giving charity from debtor funds without permission and expecting reward',
      ar: 'الصدقة من مال المدين دون إذنه واحتساب الأجر'
    },
    question: {
      ur: 'کسی شخص پر میرا قرض تھا جو واپس نہیں ملا، کیا میں اس کے نام سے وہ رقم صدقہ کر سکتا ہوں؟',
      en: 'If someone owes me money and does not return it, can I donate that amount as charity on their behalf?',
      ar: 'هل يجوز للدائن التصدق بمبلغ الدين نيابة عن المدين دون إذنه؟'
    },
    questionerName: 'شعیب اکرم',
    questionerEmail: 'shoaib@example.com',
    category: 'زکوٰۃ و صدقات',
    answer: {
      ur: 'الجواب وباللہ التوفیق: اگر مقروض سے رقم ملنے کی امید بالکل ختم ہو جائے اور دائن اسے معاف کر دے یا اپنے مال سے صدقہ کر کے ثواب مقروض کو بخشے تو جائز ہے، لیکن مقروض کی اجازت کے بغیر اس کی ملکیت میں تصرف نہیں کیا جا سکتا۔ واللہ اعلم بالصواب۔',
      en: 'You can forgive the debt as charity on yourself. Direct disposition without authorization requires clear intention of waiver.',
      ar: 'الأولى أن يسقط الدين عنه بنية الصدقة وله أجر ذلك، ولا يتصرف في ذمة الغير دون إذنه.'
    },
    date: '۱۴ اگست ۲۰۲۶ء',
    muftiName: 'مفتیانِ دار الافتاء جامعہ اسلامیہ ایبٹ آباد',
    status: 'Published',
    isFeatured: false,
    views: 940
  },
  {
    id: 'fatwa-12',
    fatwaNumber: '1448-01-112',
    title: {
      ur: 'ایک شخص کے قرض پر دوسرے سے مطالبہ کرنا کیا صحیح ہے؟',
      en: 'Demanding debt repayment from a third party without formal guarantee (Kafalah)',
      ar: 'مطالبة غير المدين بسداد الدين بدون كفالة شرعية'
    },
    question: {
      ur: 'اگر کسی شخص نے مجھ سے قرض لیا تو کیا میں اس کے بھائی یا والد سے قرض کا مطالبہ کر سکتا ہوں جب کہ انہوں نے ضمانت نہ دی ہو؟',
      en: 'Can a creditor demand payment from the debtor’s brother or father if they did not sign as guarantor?',
      ar: 'هل يحق للدائن مطالبة أقارب المدين إذا لم يكونوا كفلاء؟'
    },
    questionerName: 'ارشد محمود',
    questionerEmail: 'arshad@example.com',
    category: 'بیوع و معاملات',
    answer: {
      ur: 'الجواب وباللہ التوفیق: قرآن کریم کا اصول ہے: "ولا تزر وازرة وزر أخرى"۔ جب تک کسی دوسرے شخص نے شرعی ضمانت (کفالت) نہ لی ہو، اس سے قرض کی ادائیگی کا زبردستی مطالبہ کرنا جائز نہیں ہے۔ واللہ اعلم بالصواب۔',
      en: 'Unless someone has voluntarily undertaken the debt as a legal guarantor (Kafil), you cannot demand payment from relatives.',
      ar: 'لا يجوز مطالبة غير المدين إلا إذا كان كفيلاً ضامناً للدين شرعاً.'
    },
    date: '۱۴ اگست ۲۰۲۶ء',
    muftiName: 'مفتیانِ دار الافتاء جامعہ اسلامیہ ایبٹ آباد',
    status: 'Published',
    isFeatured: false,
    views: 1180
  },
  {
    id: 'fatwa-13',
    fatwaNumber: '1448-01-113',
    title: {
      ur: 'سود کے لیے دی جانے والی رقم سے نفع حاصل کرنے کا طریقہ',
      en: 'Rulings regarding interest earnings and disposing of illicit usury gains',
      ar: 'كيفية التخلص من الفوائد الربوية والتوبة منها'
    },
    question: {
      ur: 'بینک اکاؤنٹ سے ملنے والے سودی منافع کا کیا کیا جائے؟',
      en: 'What should be done with interest profits received in conventional bank accounts?',
      ar: 'ماذا يصنع بالفوائد الربوية الناشئة في الحسابات البنكية؟'
    },
    questionerName: 'کاشف محمود',
    questionerEmail: 'kashif@example.com',
    category: 'بیوع و معاملات',
    answer: {
      ur: 'الجواب وباللہ التوفیق: سودی رقم کو اپنے ذاتی استعمال یا اہل و عیال پر خرچ کرنا حرام ہے۔ اس رقم کو بلا نیتِ ثواب فقراء و مساکین یا مستحقین کو صدقہ کر کے اپنے اکاؤنٹ کو پاک کرنا واجب ہے۔ واللہ اعلم بالصواب۔',
      en: 'Interest cannot be consumed for personal use. It must be disposed of by giving it to the poor without expecting spiritual reward.',
      ar: 'يجب التخلص من الفائدة الربوية بصرفها في وجوه الخير والفقراء تخلصاً دون نية الأجر.'
    },
    date: '۱۳ اگست ۲۰۲۶ء',
    muftiName: 'مفتیانِ دار الافتاء جامعہ اسلامیہ ایبٹ آباد',
    status: 'Published',
    isFeatured: false,
    views: 2150
  },
  {
    id: 'fatwa-14',
    fatwaNumber: '1448-01-114',
    title: {
      ur: 'معاملات کے دوران کسی بات پر قسم کھانے کی شرعی حیثیت',
      en: 'The Shariah status and guidelines on taking oaths in business dealings',
      ar: 'حكم الحلف والأيمان في المعاملات التجارية'
    },
    question: {
      ur: 'سامان فروخت کرتے وقت سچ یا جھوٹ پر کثرت سے قسمیں کھانے کا کیا حکم ہے؟',
      en: 'What is the ruling on taking frequent oaths when selling merchandise?',
      ar: 'ما حكم كثرة الحلف في البيع والشراء؟'
    },
    questionerName: 'حامد علی',
    questionerEmail: 'hamid@example.com',
    category: 'بیوع و معاملات',
    answer: {
      ur: 'الجواب وباللہ التوفیق: جھوٹی قسم کھانا سخت گناہِ کبیرہ (یمینِ غموس) ہے۔ اور سچی قسم بھی بلا ضرورت تجارت میں کثرت سے کھانا مکروہ ہے کیونکہ یہ برکت کو مٹا دیتی ہے۔ حدیث میں ہے: "الحلف منفقة للسلعة ممحقة للبركة"۔ واللہ اعلم بالصواب۔',
      en: 'Swearing false oaths is a major sin. Even true oaths should be avoided in commerce as they eradicate blessings.',
      ar: 'اليمين الكاذبة كبيرة، وكثرة الحلف الصادق في التجارة مكروهة تمحق البركة.'
    },
    date: '۱۳ اگست ۲۰۲۶ء',
    muftiName: 'مفتیانِ دار الافتاء جامعہ اسلامیہ ایبٹ آباد',
    status: 'Published',
    isFeatured: false,
    views: 820
  },
  {
    id: 'fatwa-15',
    fatwaNumber: '1448-01-115',
    title: {
      ur: 'صرف نیت کے اظہار کا شرعی حکم',
      en: 'Ruling on verbal articulation versus silent intention in acts of worship',
      ar: 'حكم التلفظ بالنية في العبادات'
    },
    question: {
      ur: 'کیا نماز اور روزے میں زبان سے نیت کے الفاظ ادا کرنا فرض ہے یا دل کا ارادہ کافی ہے؟',
      en: 'Is verbal expression of intention obligatory in prayer and fasting or is heart intention sufficient?',
      ar: 'هل يشترط التلفظ بالنية باللسان أم يكفي قصد القلب؟'
    },
    questionerName: 'زبیر احمد',
    questionerEmail: 'zubair@example.com',
    category: 'نماز و طہارت',
    answer: {
      ur: 'الجواب وباللہ التوفیق: نیت کا اصل محل دل ہے، دل میں ارادہ اور جاننا کہ میں کون سی نماز پڑھ رہا ہوں فرض ہے۔ زبان سے آہستہ ادا کر لینا مستحسن ہے تاکہ دل کے ارادے کی تائید ہو جائے، لیکن زبان سے نہ کہنا نماز کی صحت کو متاثر نہیں کرتا۔ واللہ اعلم بالصواب۔',
      en: 'The place of intention is the heart. Having firm awareness in the heart is obligatory; verbal articulation is recommended for focus.',
      ar: 'محل النية القلب وهو الفرض، والتلفظ بها باللسان مستحب لاستحضار العزم.'
    },
    date: '۱۲ اگست ۲۰۲۶ء',
    muftiName: 'مفتیانِ دار الافتاء جامعہ اسلامیہ ایبٹ آباد',
    status: 'Published',
    isFeatured: false,
    views: 1350
  },
  {
    id: 'fatwa-16',
    fatwaNumber: '1448-01-116',
    title: {
      ur: 'صدقہ فطر کی ادائیگی کس وقت واجب ہوتی ہے اور تاخیر کا کیا حکم ہے؟',
      en: 'When does Sadaqat-ul-Fitr become due and the ruling on delaying payment',
      ar: 'وقت وجوب صدقة الفطر وحكم تأخيرها'
    },
    question: {
      ur: 'صدقۃ الفطر عید کی نماز سے قبل ادا کرنا چاہیے یا بعد میں بھی ادا کیا جا سکتا ہے؟',
      en: 'Should Sadaqat-ul-Fitr be paid prior to Eid prayer or can it be paid after?',
      ar: 'متى تجب زكاة الفطر وهل يصح إخراجها بعد صلاة العيد؟'
    },
    questionerName: 'نعمان فاروق',
    questionerEmail: 'noman@example.com',
    category: 'زکوٰۃ و صدقات',
    answer: {
      ur: 'الجواب وباللہ التوفیق: صدقۃ الفطر عید الفطر کی صبح صادق ہوتے ہی واجب ہو جاتا ہے اور سنت یہ ہے کہ نمازِ عید کے لیے جانے سے پہلے ادا کر دیا جائے تاکہ غرباء عید کی خوشیوں میں شریک ہو سکیں۔ نماز کے بعد ادا کرنے سے بھی ساقط نہیں ہوتا بلکہ ادا کرنا ضروری رہتا ہے۔ واللہ اعلم بالصواب۔',
      en: 'Sadaqat-ul-Fitr is due on Eid morning and recommended before Eid prayer. Delaying does not waive the obligation.',
      ar: 'تجب صدقة الفطر بطلوع فجر يوم العيد، والسنة إخراجها قبل الصلاة، ولا تسقط بالتأخير بل تبقى في الذمة.'
    },
    date: '۱۲ اگست ۲۰۲۶ء',
    muftiName: 'مفتیانِ دار الافتاء جامعہ اسلامیہ ایبٹ آباد',
    status: 'Published',
    isFeatured: false,
    views: 1890
  },
  {
    id: 'fatwa-17',
    fatwaNumber: '1448-01-117',
    title: {
      ur: 'بیوی کے علاج کے اخراجات شوہر کے ذمہ ہیں یا بیوی خود برداشت کرے؟ ایک تفصیلی شرعی جائزہ',
      en: 'Detailed Shariah analysis on medical expenses of the wife and husband’s maintenance duty',
      ar: 'حكم نفقة علاج الزوجة هل هي على الزوج أم على مالها الخاص'
    },
    question: {
      ur: 'بیوی کی بیماری کی صورت میں ڈاکٹر، ادویات اور ہسپتال کے اخراجات شرعاً شوہر پر واجب ہیں یا نہیں؟',
      en: 'Is the husband religiously obligated to cover the medical and hospital bills of his wife?',
      ar: 'هل تلزم الزوج تكاليف علاج زوجته وأدويتها في الفقه الإسلامي؟'
    },
    questionerName: 'سلمان رشید',
    questionerEmail: 'salman@example.com',
    category: 'نکاح و طلاق',
    answer: {
      ur: 'الجواب وباللہ التوفیق: جمہور علمائے عصر اور موجودہ معتمد فتاویٰ کے مطابق معروف اور حسنِ معاشرت کا تقاضا ہے کہ شوہر اپنی وسعت کے مطابق بیوی کے علاج معالجے کے جملہ اخراجات برداشت کرے، کیونکہ یہ نفقہ اور حسنِ سلوک کا لازمی حصہ ہے۔ واللہ اعلم بالصواب۔',
      en: 'According to contemporary scholars, the husband is obligated according to his financial means to provide medical care for his wife.',
      ar: 'الراجح في الفتوى المعاصرة وجوب نفقة علاج الزوجة وأدويتها على الزوج بحسب طاقته بالمعروف.'
    },
    date: '۱۱ اگست ۲۰۲۶ء',
    muftiName: 'مفتیانِ دار الافتاء جامعہ اسلامیہ ایبٹ آباد',
    status: 'Published',
    isFeatured: true,
    views: 3100
  },
  {
    id: 'fatwa-18',
    fatwaNumber: '1448-01-118',
    title: {
      ur: 'POS مشین کے ذریعے لین دین کرنے کا شرعی حکم اور اس پر کٹوتی',
      en: 'Shariah ruling on POS card swipe machines and bank merchant service charges',
      ar: 'حكم البيع عبر أجهزة نقاط البيع (POS) ورسوم الخدمة البنكية'
    },
    question: {
      ur: 'دکانوں پر کارڈ مشین (POS) کے ذریعے خریداری پر جو بینک فیس یا فیصد کٹتا ہے کیا وہ جائز ہے؟',
      en: 'Is it permissible for merchants to use POS machines and accept transaction service fees?',
      ar: 'ما حكم التعامل بأجهزة الدفع الإلكتروني والرسوم المقتطعة للبنك؟'
    },
    questionerName: 'یاسر حبیب',
    questionerEmail: 'yasir@example.com',
    category: 'بیوع و معاملات',
    answer: {
      ur: 'الجواب وباللہ التوفیق: پی او ایس مشین سروس چارجز بینک کی الیکٹرانک خدمات اور نیٹ ورک کی اجرت کی مد میں ہوتے ہیں، اس لیے ان مشینوں کا استعمال اور بینک کا سروس چارجز لینا شرعاً جائز ہے۔ واللہ اعلم بالصواب۔',
      en: 'POS machine fees are considered valid service fees for technology and payment processing infrastructure.',
      ar: 'رسوم خدمة نقاط البيع جائزة شرعاً لأنها أجر مقابل خدمات تقنية ومعالجة مصرفية.'
    },
    date: '۱۱ اگست ۲۰۲۶ء',
    muftiName: 'مفتیانِ دار الافتاء جامعہ اسلامیہ ایبٹ آباد',
    status: 'Published',
    isFeatured: false,
    views: 1470
  },
  {
    id: 'fatwa-19',
    fatwaNumber: '1448-01-119',
    title: {
      ur: 'شادی بیاہ اور دیگر تقریبات میں لاؤڈ اسپیکر پر گانے بجانے کا گناہ اور شرعی حکم',
      en: 'Prohibition of loud music and disturbing neighbors during wedding ceremonies',
      ar: 'حرمة الغناء والمعازف ومكبرات الصوت في الأعراس والمناسبات'
    },
    question: {
      ur: 'شادیوں میں لاؤڈ اسپیکر پر رات گئے تک میوزک چلانے کا کیا حکم ہے؟',
      en: 'What is the Islamic ruling on playing loud music and disturbing neighbors during weddings?',
      ar: 'ما حكم تشغيل المعازف والغناء بمكبرات الصوت وإيذاء الجيران في الأفراح؟'
    },
    questionerName: 'شاکر اللہ',
    questionerEmail: 'shakir@example.com',
    category: 'متفرقات',
    answer: {
      ur: 'الجواب وباللہ التوفیق: گانے بجانے کے ساتھ ساتھ لاؤڈ اسپیکر پر محلے والوں، بیماروں اور نمازیوں کو تکلیف پہنچانا دوہرا گناہ ہے۔ شریعت میں ایذائے مسلم حرام ہے، لہٰذا اس قبیح فعل سے مکمل اجتناب لازم ہے۔ واللہ اعلم بالصواب۔',
      en: 'Playing un-Islamic music and causing distress to neighbors and patients with loudspeakers is strictly forbidden.',
      ar: 'إيذاء الناس بالمعازف والصخب حرام شرعاً لما فيه من معصية وإضرار بالمسلمين.'
    },
    date: '۱۰ اگست ۲۰۲۶ء',
    muftiName: 'مفتیانِ دار الافتاء جامعہ اسلامیہ ایبٹ آباد',
    status: 'Published',
    isFeatured: false,
    views: 2450
  },
  {
    id: 'fatwa-20',
    fatwaNumber: '1448-01-120',
    title: {
      ur: 'موبائل ایپ پر قرآن مجید کی تلاوت کا طریقہ اور باوضو ہونا',
      en: 'Reciting Quran from mobile phone application and requirement of Wudu',
      ar: 'حكم قراءة القرآن من تطبيقات الهواتف الذكية واشتراط الطهارة'
    },
    question: {
      ur: 'کیا موبائل اسکرین پر قرآن مجید دیکھ کر پڑھنے کے لیے باوضو ہونا شرط ہے؟',
      en: 'Is Wudu required to touch the mobile screen when reading Quran from an app?',
      ar: 'هل يشترط الوضوء لمس شاشة الهاتف عند قراءة القرآن الكريم؟'
    },
    questionerName: 'عمران خان',
    questionerEmail: 'imran@example.com',
    category: 'نماز و طہارت',
    answer: {
      ur: 'الجواب وباللہ التوفیق: موبائل فون بذاتِ خود مصحف نہیں ہے، لہٰذا بغیر وضو کے موبائل کو ہاتھ لگانا جائز ہے، تاہم جس اسکرین پر قرآنی آیات نمایاں ہوں اس حصے کو بلا وضو چھونے سے پرہیز بہتر ہے، البتہ زبانی تلاوت کے لیے وضو شرط نہیں مگر باوضو ہونا مستحب اور افضل ہے۔ واللہ اعلم بالصواب۔',
      en: 'Touching the mobile device without Wudu is permissible. However, touching the exact screen text directly without Wudu is discouraged; having Wudu is superior.',
      ar: 'الهاتف ليس بمصحف، فيجوز لمسه بغير وضوء، والأفضل التطهر لقراءة القرآن الكريم تعظيماً لكلام الله.'
    },
    date: '۱۰ اگست ۲۰۲۶ء',
    muftiName: 'مفتیانِ دار الافتاء جامعہ اسلامیہ ایبٹ آباد',
    status: 'Published',
    isFeatured: true,
    views: 3890
  },
  {
    id: 'fatwa-21',
    fatwaNumber: '1448-01-121',
    title: {
      ur: 'ہومیوپیتھک ادویات کا استعمال کا شرعی حکم',
      en: 'Shariah ruling on using homeopathic medicines containing alcohol spirits',
      ar: 'حكم التداوي بالأدوية المثلية (الهوميوباثي) المشتملة على الكحول'
    },
    question: {
      ur: 'کیا ایسی ہومیوپیتھک دوائیں جن میں الکوحل اسپرٹ ہوتا ہے علاج کی نیت سے استعمال کرنا جائز ہے؟',
      en: 'Is it permissible to consume homeopathic medicines preserved in synthetic alcohol spirits?',
      ar: 'هل يجوز استخدام أدوية الهوميوباثي التي تحتوي على الكحول التخليقي؟'
    },
    questionerName: 'ڈاکٹر فرہاد',
    questionerEmail: 'farhad@example.com',
    category: 'متفرقات',
    answer: {
      ur: 'الجواب وباللہ التوفیق: اگر الکوحل کھجور یا انگور کی شراب سے نہ بنی ہو بلکہ سنتھیٹک یا دیگر حلال اجزاء سے بنی ہو اور بطورِ نشہ نہیں بلکہ بطورِ دوا اور محلل استعمال ہو تو علاج کے لیے اس کا استعمال جائز ہے۔ واللہ اعلم بالصواب۔',
      en: 'Non-khamr synthetic alcohol used in minimal quantities as medicine solvent for healing purposes is permissible in Shariah.',
      ar: 'الكحول غير الخمرية إذا استعملت كمذيب في الأدوية للتداوي بنسبة يسيرة تجوز شرعاً للحاجة.'
    },
    date: '۰۹ اگست ۲۰۲۶ء',
    muftiName: 'مفتیانِ دار الافتاء جامعہ اسلامیہ ایبٹ آباد',
    status: 'Published',
    isFeatured: false,
    views: 1150
  },
  {
    id: 'fatwa-22',
    fatwaNumber: '1448-01-122',
    title: {
      ur: 'قسطوں پر اشیاء کی خرید و فروخت کا شرعی طریقہ اور اس پر منافع کا تعین',
      en: 'Shariah conditions for installment sales and profit margin determination',
      ar: 'الضوابط الشرعية للبيع بالتقسيط وتحديد نسبة الربح'
    },
    question: {
      ur: 'کیا نقد کی بنسبت قسطوں پر زائد قیمت لے کر سامان بیچنا جائز ہے؟',
      en: 'Is it permissible to sell goods on installments for a higher price than cash price?',
      ar: 'هل يجوز بيع السلعة بالتقسيط بثمن أعلى من الثمن النقدي؟'
    },
    questionerName: 'محمد ثاقب',
    questionerEmail: 'saqib@example.com',
    category: 'بیوع و معاملات',
    answer: {
      ur: 'الجواب وباللہ التوفیق: قسطوں پر نقد سے زیادہ قیمت طے کر کے سامان بیچنا جائز ہے، بشرطیکہ عقد کے وقت قسطوں کی مقدار، ادائیگی کی مدت اور حتمی مجموعی قیمت طے کر لی جائے اور بعد میں تاخیر کی صورت میں کوئی جرمانہ یا زائد رقم شرط نہ کی جائے۔ واللہ اعلم بالصواب۔',
      en: 'Selling on installments with a higher price is permissible if total price and timeline are finalized at the inception of the contract without late penalties.',
      ar: 'يجوز البيع بالتقسيط بزيادة على ثمن النقد بشرط الجزم بالثمن والأجل في العقد دون اشتراط غرامات تأخير.'
    },
    date: '۰۹ اگست ۲۰۲۶ء',
    muftiName: 'مفتیانِ دار الافتاء جامعہ اسلامیہ ایبٹ آباد',
    status: 'Published',
    isFeatured: true,
    views: 2980
  }
];

export const INITIAL_ONLINE_QUESTIONS: OnlineQuestion[] = [];

export const INITIAL_EXAM_RESULTS: ExamResult[] = [
  {
    id: 'res-101',
    rollNumber: '2026-8801',
    registrationNumber: 'JIA-REG-2022-441',
    studentName: 'حافظ محمد اسامہ خان',
    fatherName: 'عبد الرشید خان',
    department: 'تخصص فی الافتاء (Master in Islamic Jurisprudence & Fatwa)',
    academicYear: '2025-2026',
    examType: 'Annual',
    subjects: [
      { name: 'فقه النوازل والمستجدات (Modern Fiqh Issues)', totalMarks: 100, obtainedMarks: 94 },
      { name: 'رسم المفتی وقواعد الافتاء (Fatwa Methodology)', totalMarks: 100, obtainedMarks: 92 },
      { name: 'دراسة الفتاوى الفقهية (Fatwa Studies)', totalMarks: 100, obtainedMarks: 96 },
      { name: 'البحث العلمي والرسالة (Research Thesis)', totalMarks: 100, obtainedMarks: 95 }
    ],
    totalMarks: 400,
    obtainedMarks: 377,
    percentage: 94.25,
    grade: 'ممتاز (Distinction)',
    division: 'First Division with Honors',
    status: 'Distinction',
    remarks: 'ماشاء اللہ عالی القدر کارکردگی - جامعہ اسلامیہ ایبٹ آباد میں فرسٹ پوزیشن'
  },
  {
    id: 'res-102',
    rollNumber: '2026-8802',
    registrationNumber: 'JIA-REG-2021-389',
    studentName: 'سید عبد اللہ شاہ',
    fatherName: 'سید طاہر شاہ',
    department: 'شعبہ درس نظامی - عالمیہ (M.A. Islamic Studies)',
    academicYear: '2025-2026',
    examType: 'Annual',
    subjects: [
      { name: 'صحیح البخاری (Sahih Bukhari)', totalMarks: 100, obtainedMarks: 88 },
      { name: 'صحیح مسلم (Sahih Muslim)', totalMarks: 100, obtainedMarks: 86 },
      { name: 'سنن ابی داؤد (Sunan Abi Dawood)', totalMarks: 100, obtainedMarks: 85 },
      { name: 'جامع الترمذی (Jami at-Tirmidhi)', totalMarks: 100, obtainedMarks: 90 },
      { name: 'تفسیر بیضاوی (Tafseer Baidawi)', totalMarks: 100, obtainedMarks: 82 }
    ],
    totalMarks: 500,
    obtainedMarks: 431,
    percentage: 86.2,
    grade: 'جید جداً (Very Good)',
    division: 'First Division',
    status: 'Pass',
    remarks: 'کامیاب دورہ حدیث شریف'
  },
  {
    id: 'res-103',
    rollNumber: '2026-8803',
    registrationNumber: 'JIA-REG-2023-102',
    studentName: 'محمد احمد عباسی',
    fatherName: 'محمد فاروق عباسی',
    department: 'شعبہ تحفیظ القرآن الکریم (Hifz Division)',
    academicYear: '2025-2026',
    examType: 'Annual',
    subjects: [
      { name: 'حفظ القرآن الکریم (Full Quran Recitation)', totalMarks: 100, obtainedMarks: 98 },
      { name: 'التجويد والقراءات (Tajweed Rules)', totalMarks: 100, obtainedMarks: 95 }
    ],
    totalMarks: 200,
    obtainedMarks: 193,
    percentage: 96.5,
    grade: 'ممتاز (Distinction)',
    division: 'First Division',
    status: 'Distinction',
    remarks: 'مکمل حفظ القرآن بسند متصل'
  }
];

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

export const INITIAL_NEWS: NewsItem[] = [
  {
    id: 'news-1',
    title: {
      ur: 'سالانہ داخلے ۲۰۲۶ء - شعبہ درس نظامی اور تحفیظ القرآن کا شڈول جاری',
      en: 'Annual Admissions 2026 Schedule Announced for All Faculties',
      ar: 'إعلان جدول القبول والتسجيل للعام الدراسي الجديد ٢٠٢٦م'
    },
    content: {
      ur: 'جامعہ اسلامیہ ایبٹ آباد میں سال تعلیمی ۲۰۲۶ء کے لیے درس نظامی، تخصص فی الافتاء، اور حفظ القرآن کے شعبہ جات میں آن لائن اور بالمشافہ داخلے شروع ہو چکے ہیں۔ خواہشمند طلبہ ویب سائٹ سے فارم ڈاؤن لوڈ کریں۔',
      en: 'Admissions are officially open for academic year 2026 in Dars-e-Nizami, Takhassus Fil Ifta, and Hifz Divisions. Download admission forms online or register directly through the website portal.',
      ar: 'يعلن مكتب القبول بجامعة أبت أباد الإسلامية عن فتح باب التسجيل للعام الدراسي ٢٠٢٦م في التخصصات الشرعية وتحفيظ القرآن الكريم.'
    },
    date: '2026-07-20',
    category: 'Admission',
    isPinned: true,
    imageUrl: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&q=80&w=600'
  },
  {
    id: 'news-2',
    title: {
      ur: 'آن لائن فتویٰ سسٹم کی جدید تجدید اور موبائل پورٹل کا افتتاح',
      en: 'Launch of Upgraded Online Fatwa Portal & Search Archive',
      ar: 'افتتاح البوابة الإلكترونية الحديثة للفتوى والبحث الفقهي'
    },
    content: {
      ur: 'دنیا بھر سے سائلین کی سہولت کے لیے دار الافتاء جامعہ اسلامیہ ایبٹ آباد کا آن لائن فتویٰ سسٹم مکمل طور پر جدید ٹیکنالوجی پر منتقل کر دیا گیا ہے جس سے سائلین فوری جواب حاصل کر سکتے ہیں۔',
      en: 'Darul Ifta Abbottabad has upgraded its online Fatwa delivery architecture, allowing seekers worldwide to submit questions and access searchable Fiqh rulings instantly.',
      ar: 'تم تطوير قسم دار الإفتاء بالجامعة لتسهيل إرسال الاستفتائات واستعراض الأرشيف الفقهي للزوار عالمياً.'
    },
    date: '2026-07-15',
    category: 'News',
    isPinned: false,
    imageUrl: 'https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&q=80&w=600'
  }
];

export const INITIAL_DONATIONS: DonationRecord[] = [];

export const INITIAL_CLASS_BOOKINGS: ClassBooking[] = [];

