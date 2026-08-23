import { Language, LocalizedString } from '../types';

// Comprehensive Islamic & Institutional Dictionary for Full & Accurate Translations
const DICTIONARY: {
  ar: Record<string, string>;
  en: Record<string, string>;
} = {
  ar: {
    // Categories & Sections
    'ایمانیات و عقائد': 'العقائد والإيمانيات',
    'نماز و طہارت': 'الطهارة والصلاة',
    'روزہ و اعتکاف': 'الصيام والاعتكاف',
    'زکوٰۃ و صدقات': 'الزكاة والصدقات',
    'حج و عمرہ': 'الحج والعمرة',
    'نکاح و طلاق': 'النكاح والطلاق',
    'بیوع و معاملات': 'المعاملات المالية والبيوع',
    'متفرقات': 'فتاوى متفرقة',
    'اسلامی نام ڈائریکٹری': 'دليل الأسماء الإسلامية',
    'مسنون و معروف دعائیں': 'الأدعية المأثورة والمسنونة',
    'نئے سوالات': 'أحدث الأسئلة والفتاوى',
    'فتاویٰ آرکائیو': 'أرشيف الفتاوى الشرعية',
    'آن لائن فتویٰ': 'طلب فتوى إلكترونية',
    'آن لائن فتویٰ پوچھیں': 'إرسال سؤال شرعي',
    'مفتیانِ دار الافتاء جامعہ اسلامیہ ایبٹ آباد': 'مفتو دار الإفتاء بالجامعة الإسلامية أبت أباد',
    'دار الافتاء جامعہ اسلامیہ ایبٹ آباد': 'دار الإفتاء بالجامعة الإسلامية أبت أباد',
    'مستند علمائے کرام اور مفتیانِ کرام کے زیرِ نگرانی': 'تحت إشراف كبار العلماء والمفتين المعتمدين',
    'الحاق: وفاق المدارس العربیہ پاکستان': 'التبعية: وفاق المدارس العربية باكستان',
    'سوال': 'السؤال',
    'الجواب': 'الجواب',
    'جواب': 'الجواب الشرعي',
    'فتویٰ نمبر': 'رقم الفتوى',
    'تاریخ': 'التاريخ',
    'شعبہ': 'القسم',
    'سائل': 'السائل',
    'مفتی': 'المفتي',
    'تلاش': 'البحث',
    'مطلوبہ لفظ': 'الكلمة المفتاحية',
    'شعبہ منتخب کریں': 'اختر القسم الشرعي',
    'باب منتخب کریں': 'اختر الباب',
    'ضمنی منتخب کریں': 'اختر الفرع',
    'کتاب الطہارۃ': 'كتاب الطهارة',
    'کتاب الصلاۃ': 'كتاب الصلاة',
    'کتاب الزکاۃ': 'كتاب الزكاة',
    'کتاب الصوم': 'كتاب الصيام',
    'کتاب النکاح': 'كتاب النكاح',
    'کتاب البیوع': 'كتاب البيوع والمعاملات',
    'احکامِ وضو': 'أحكام الوضوء',
    'احکامِ امامت': 'أحكام الإمامة والجماعة',
    'بیعِ ادھار': 'البيع الآجل والتقسيط',
    'سونے چاندی کے احکام': 'أحكام الذهب والفضة',
    'تمام فتاویٰ': 'جميع الفتاوى',
    'مکمل فتویٰ پڑھیں': 'قراءة الفتوى كاملة',
    'مفید علمی و اصلاحی کتابیں': 'كتب علمية ودعوية قيمة',
    'قرآن و سنت نبویہ کی تعلیمات کا علمبردار': 'منار لتعليم القرآن والسنة النبوية',
    'جامعہ کا تعارف ایک نظر میں': 'نبذة تعريفية شاملة عن الجامعة',
    'تعارف، علمی و علاقائی خدمات': 'التعريف والخدمات العلمية والاجتماعية',
    'برائے معلومات': 'للاستفسارات والمعلومات',
    'آپ کے مسائل اور ان کا حل': 'حل المسائل الشرعية والاستشارات',
    'منتخب اسلامی و قرآنی نام بمع معانی و تفصیلات': 'الأسماء الإسلامية والقرآنية المختارة مع معانيها ودلالاتها',
    'دلیل الأسماء الإسلامية • مستند اسلامی ناموں کی ڈائریکٹری': 'دليل الأسماء الإسلامية • مرجع الأسماء الشرعية المعتمدة',
    'مستند مسنون و معروف دعائیں مع سلیس ترجمہ و حوالہ': 'الأدعية المأثورة والمسنونة الصحيحة مع الترجمة والتخريج',
    'حصن المسلم • روزمرہ کی مسنون دعائیں و اذکار': 'حصن المسلم • أدعية وأذكار اليوم والليلة',
    'نام کی شرعی تحقیق کروائیں': 'طلب تحقيق شرعي لاسم',
    'تمام نام': 'جميع الأسماء',
    'لڑکوں کے نام': 'أسماء البنين والذكور',
    'لڑکیوں کے نام': 'أسماء البنات والإناث',
    'انبیائے کرام علیہم السلام': 'الأنبياء والرسل عليهم السلام',
    'صحابہ کرام رضی اللہ عنہم': 'الصحابة الكرام رضي الله عنهم',
    'امہات المؤمنین و صحابیات': 'أمهات المؤمنين والصحابيات',
    'قرآنی نام و صفات': 'الأسماء والصفات القرآنية',
    'معنی و مفہوم:': 'المعنى والدلالة:',
    'نسبت:': 'النسبة والفضل:',
    'روزمرہ کی دعائیں': 'أدعية اليوم والليلة',
    'صبح و شام کے اذکار': 'أذكار الصباح والمساء',
    'حفاظت و پناہ کی دعائیں': 'أدعية الحفظ والتحصين',
    'مسجد و نماز کے اذکار': 'أذكار المسجد والصلاة',
    'سفر کی دعائیں': 'أدعية السفر والترحال',
    'عیادت و شفاء کی دعائیں': 'أدعية عيادة المريض والشفاء',
    'غم و قرض سے نجات و برکت': 'أدعية تفريج الهم وسداد الدين',
    'تعداد دعائیں:': 'عدد الأدعية:',
    'سلیس اردو ترجمہ:': 'الترجمة والمعنى:',
    'فضیلت و برکت:': 'الفضل والبركة:',
    'حوالہ و تخریج:': 'التخريج والمصدر:',
    'میاں بیوی کا ہبہ سے رجوع کرنے کا حکم': 'حكم رجوع أحد الزوجين في الهبة بعد الطلاق',
    'زبان کا پھسلنا اس بات کی علامت ہے کہ بندے نے خطاء کا ارتکاب کیا ہے؟': 'هل سبق اللسان علامة على ارتكاب الخطأ؟',
    'امام صاحب کے انتقال پر جنازہ کی نماز کے وقت مسجد میں امامت کس نے کروانی تھی؟': 'من الأحق بالإمامة في المسجد عند وفاة الإمام الراتب؟',
    'پھلوں کے پکنے سے قبل انکی فروخت کے بعد اگر غیر اختیاری طور پر پھل ضائع ہوں تو اس کا نقصان کس پر ہوگا؟': 'على من يقع ضمان تلف الثمار قبل بدو صلاحها؟',
    'معاہدگی قیمت سے زیادہ پر سونے کی خریداری کا حکم': 'حكم شراء الذهب بسعر أعلى مع تأجيل الدفع',
    'این جی اوز کے اعلانات کے ذریعے حاصل ہونے والی رقوم سے مساجد یا دینی مدارس میں تعمیراتی کام کروانا': 'استخدام أموال المنظمات غير الحكومية في بناء المساجد والمدارس',
    'لوگوں کو دھوکے میں مبتلا کرنے اور نقصان پہنچانے کے لیے غلط بیانی کرنا اور جھوٹ بولنا': 'حرمة الغش والتدليس والكذب للإضرار بالآخرين',
    'پیکٹ والی چیز کو ترازو کے بغیر وزن کیے بغیر اندازے سے بیچنا': 'بيع السلع المعبأة جزافاً دون وزن دقيق',
    'ضرورت کے وقت نائٹ گلاس پہننے کا شرعی حکم': 'حكم استخدام النظارات الليلية للحاجة',
    'دستی گھڑی کے وقت اور اوقاتِ نماز کے تعین کا حکم': 'الاعتماد على الساعات اليدوية في تحديد أوقات الصلاة',
    'نکاح کے الفاظ میں سے کسی لفظ کے غلط تلفظ کا نکاح پر اثر': 'أثر اللحن أو الخطأ اللفظي في صيغة الإيجاب والقبول في النكاح',
    'قرضداروں کی رقم پر ان کے اجازت کے بغیر صدقہ کرنا اور اس پر ثواب کی امید رکھنا': 'الصدقة من مال المدين دون إذنه واحتساب الأجر',
    'ایک شخص کے قرض پر دوسرے سے مطالبہ کرنا کیا صحیح ہے؟': 'مطالبة غير المدين بسداد الدين بدون كفالة شرعية',
    'سود کے لیے دی جانے والی رقم سے نفع حاصل کرنے کا طریقہ': 'كيفية التخلص من الفوائد الربوية والتوبة منها',
    'معاملات کے دوران کسی بات پر قسم کھانے کی شرعی حیثیت': 'حكم الحلف والأيمان في المعاملات التجارية',
  },
  en: {
    // Categories & Sections
    'ایمانیات و عقائد': 'Beliefs & Creed (Aqeedah)',
    'نماز و طہارت': 'Purification & Prayer (Salah)',
    'روزہ و اعتکاف': 'Fasting & Itikaf (Sawm)',
    'زکوٰۃ و صدقات': 'Zakat & Charity',
    'حج و عمرہ': 'Hajj & Umrah Pilgrimage',
    'نکاح و طلاق': 'Marriage & Divorce (Nikah & Talaq)',
    'بیوع و معاملات': 'Trade & Islamic Finance',
    'متفرقات': 'General & Miscellaneous Fiqh',
    'اسلامی نام ڈائریکٹری': 'Islamic Names Directory',
    'مسنون و معروف دعائیں': 'Authentic Masnoon Duas',
    'نئے سوالات': 'Recent Inquiries & Fatwas',
    'فتاویٰ آرکائیو': 'Searchable Fatwa Archive',
    'آن لائن فتویٰ': 'Ask Online Fatwa',
    'آن لائن فتویٰ پوچھیں': 'Submit an Online Fatwa',
    'مفتیانِ دار الافتاء جامعہ اسلامیہ ایبٹ آباد': 'Muftis of Darul Ifta Jamia Islamia Abbottabad',
    'دار الافتاء جامعہ اسلامیہ ایبٹ آباد': 'Darul Ifta Jamia Islamia Abbottabad',
    'مستند علمائے کرام اور مفتیانِ کرام کے زیرِ نگرانی': 'Under the Supervision of Qualified Muftis & Islamic Scholars',
    'الحاق: وفاق المدارس العربیہ پاکستان': 'Affiliation: Wifaqul Madaris Al-Arabia Pakistan',
    'سوال': 'Question',
    'الجواب': 'Islamic Ruling (Answer)',
    'جواب': 'Answer',
    'فتویٰ نمبر': 'Fatwa Record No',
    'تاریخ': 'Date',
    'شعبہ': 'Category',
    'سائل': 'Inquirer',
    'مفتی': 'Mufti',
    'تلاش': 'Search',
    'مطلوبہ لفظ': 'Keywords',
    'شعبہ منتخب کریں': 'Select Category',
    'باب منتخب کریں': 'Select Chapter',
    'ضمنی منتخب کریں': 'Select Sub-topic',
    'کتاب الطہارۃ': 'Book of Purification',
    'کتاب الصلاۃ': 'Book of Prayer',
    'کتاب الزکاۃ': 'Book of Zakat',
    'کتاب الصوم': 'Book of Fasting',
    'کتاب النکاح': 'Book of Marriage',
    'کتاب البیوع': 'Book of Transactions',
    'احکامِ وضو': 'Rulings of Wudu',
    'احکامِ امامت': 'Rulings of Leading Prayer',
    'بیعِ ادھار': 'Credit & Deferred Sales',
    'سونے چاندی کے احکام': 'Gold & Silver Rulings',
    'تمام فتاویٰ': 'All Fatwas',
    'مکمل فتویٰ پڑھیں': 'Read Full Fatwa',
    'مفید علمی و اصلاحی کتابیں': 'Beneficial Islamic Publications & Books',
    'قرآن و سنت نبویہ کی تعلیمات کا علمبردار': 'Advancing Quran & Sunnah Education',
    'جامعہ کا تعارف ایک نظر میں': 'Comprehensive Overview of Jamia',
    'تعارف، علمی و علاقائی خدمات': 'Biography, Academic & Regional Services',
    'برائے معلومات': 'Contact & Information',
    'آپ کے مسائل اور ان کا حل': 'Solutions to Shariah Questions',
    'منتخب اسلامی و قرآنی نام بمع معانی و تفصیلات': 'Curated Islamic & Quranic Names with Meanings & Context',
    'دلیل الأسماء الإسلامية • مستند اسلامی ناموں کی ڈائریکٹری': 'Islamic Names Directory • Authentic Reference Guide',
    'مستند مسنون و معروف دعائیں مع سلیس ترجمہ و حوالہ': 'Authentic Masnoon Duas with Translation & Hadith Sources',
    'حصن المسلم • روزمرہ کی مسنون دعائیں و اذکار': 'Fortress of the Believer • Daily Invocations & Adhkar',
    'نام کی شرعی تحقیق کروائیں': 'Inquire About a Name',
    'تمام نام': 'All Names',
    'لڑکوں کے نام': 'Boys Names',
    'لڑکیوں کے نام': 'Girls Names',
    'انبیائے کرام علیہم السلام': 'Prophets (Peace Be Upon Them)',
    'صحابہ کرام رضی اللہ عنہم': 'Sahabah (Companions)',
    'امہات المؤمنین و صحابیات': 'Mothers of Believers & Female Companions',
    'قرآنی نام و صفات': 'Quranic Names & Attributes',
    'معنی و مفہوم:': 'Meaning & Significance:',
    'نسبت:': 'Significance / Reference:',
    'روزمرہ کی دعائیں': 'Daily Duas',
    'صبح و شام کے اذکار': 'Morning & Evening Adhkar',
    'حفاظت و پناہ کی دعائیں': 'Duas for Protection & Refuge',
    'مسجد و نماز کے اذکار': 'Duas for Mosque & Prayer',
    'سفر کی دعائیں': 'Duas for Travel',
    'عیادت و شفاء کی دعائیں': 'Duas for Sickness & Healing',
    'غم و قرض سے نجات و برکت': 'Duas for Relief from Grief & Debt',
    'تعداد دعائیں:': 'Total Duas:',
    'سلیس اردو ترجمہ:': 'Translation:',
    'فضیلت و برکت:': 'Virtue & Benefit:',
    'حوالہ و تخریج:': 'Hadith Source:',
    'میاں بیوی کا ہبہ سے رجوع کرنے کا حکم': 'Ruling on Revoking a Gift Between Spouses After Divorce',
    'زبان کا پھسلنا اس بات کی علامت ہے کہ بندے نے خطاء کا ارتکاب کیا ہے؟': 'Is a slip of the tongue a sign that a person has committed an error?',
    'امام صاحب کے انتقال پر جنازہ کی نماز کے وقت مسجد میں امامت کس نے کروانی تھی؟': 'Who has the primary right to lead daily prayers when the regular Imam passes away?',
    'پھلوں کے پکنے سے قبل انکی فروخت کے بعد اگر غیر اختیاری طور پر پھل ضائع ہوں تو اس کا نقصان کس پر ہوگا؟': 'Who bears the loss if unripened fruits sold on trees are destroyed by natural causes?',
    'معاہدگی قیمت سے زیادہ پر سونے کی خریداری کا حکم': 'Ruling on purchasing gold at higher than agreed spot prices on deferred payment',
    'این جی اوز کے اعلانات کے ذریعے حاصل ہونے والی رقوم سے مساجد یا دینی مدارس میں تعمیراتی کام کروانا': 'Using funds obtained through NGO grants for mosque and madrasa construction',
    'لوگوں کو دھوکے میں مبتلا کرنے اور نقصان پہنچانے کے لیے غلط بیانی کرنا اور جھوٹ بولنا': 'The severe prohibition of deceit, fraud, and deceptive statements in trade',
    'پیکٹ والی چیز کو ترازو کے بغیر وزن کیے بغیر اندازے سے بیچنا': 'Selling packaged goods by estimation without accurate weighing',
    'ضرورت کے وقت نائٹ گلاس پہننے کا شرعی حکم': 'Ruling on wearing night vision goggles or protective night glasses when necessary',
    'دستی گھڑی کے وقت اور اوقاتِ نماز کے تعین کا حکم': 'Relying on digital and wrist watches for determining accurate prayer times',
    'نکاح کے الفاظ میں سے کسی لفظ کے غلط تلفظ کا نکاح پر اثر': 'Impact of minor mispronunciation of Nikah contract formula words on the marriage',
    'قرضداروں کی رقم پر ان کے اجازت کے بغیر صدقہ کرنا اور اس پر ثواب کی امید رکھنا': 'Giving charity from debtor funds without permission and expecting reward',
    'ایک شخص کے قرض پر دوسرے سے مطالبہ کرنا کیا صحیح ہے؟': 'Demanding debt repayment from a third party without formal guarantee (Kafalah)',
    'سود کے لیے دی جانے والی رقم سے نفع حاصل کرنے کا طریقہ': 'Rulings regarding interest earnings and disposing of illicit usury gains',
    'معاملات کے دوران کسی بات پر قسم کھانے کی شرعی حیثیت': 'The Shariah status and guidelines on taking oaths in business dealings',
  }
};

/**
 * Universal content localization helper.
 * If input has dedicated `en` or `ar` translations, it returns them directly.
 * If `en` or `ar` is not available, it checks the dictionary for known terms.
 * If not in dictionary, it returns original content cleanly without mangling.
 */
export function getLocalizedText(
  value: LocalizedString | string | undefined | null,
  lang: Language,
  fallbackToUrdu = true
): string {
  if (!value) return '';

  if (typeof value === 'object') {
    if (lang === 'ur') {
      return value.ur || value.ar || value.en || '';
    }
    if (lang === 'ar') {
      if (value.ar && value.ar.trim() !== '') {
        return value.ar;
      }
      const urKey = (value.ur || '').trim();
      if (DICTIONARY.ar[urKey]) {
        return DICTIONARY.ar[urKey];
      }
      return fallbackToUrdu ? (value.ur || '') : '';
    }
    if (lang === 'en') {
      if (value.en && value.en.trim() !== '') {
        return value.en;
      }
      const urKey = (value.ur || '').trim();
      if (DICTIONARY.en[urKey]) {
        return DICTIONARY.en[urKey];
      }
      return fallbackToUrdu ? (value.ur || '') : '';
    }
    return value.ur || '';
  }

  // If passed a simple string
  const str = String(value).trim();
  if (lang === 'ur') return str;
  if (lang === 'ar') return DICTIONARY.ar[str] || str;
  if (lang === 'en') return DICTIONARY.en[str] || str;
  return str;
}

/**
 * Returns the standard typographic class for the active language.
 * Urdu -> font-urdu (Mehr Nastaliq / Jameel Noori)
 * Arabic -> font-arabic (Amiri / Noto Naskh)
 * English -> font-english-body / font-sans (Inter / Playfair)
 */
export function getLanguageFontClass(lang: Language, isHeading = false): string {
  if (lang === 'ur') {
    return 'font-urdu';
  }
  if (lang === 'ar') {
    return 'font-arabic';
  }
  return isHeading ? 'font-english-heading font-serif' : 'font-english-body font-sans';
}

/**
 * Helper to get localized category name with proper translation and font
 */
export function getLocalizedCategory(category: string, lang: Language): string {
  if (!category) return '';
  const trimmed = category.trim();
  if (lang === 'ur') return trimmed;
  if (lang === 'ar') return DICTIONARY.ar[trimmed] || trimmed;
  if (lang === 'en') return DICTIONARY.en[trimmed] || trimmed;
  return trimmed;
}
