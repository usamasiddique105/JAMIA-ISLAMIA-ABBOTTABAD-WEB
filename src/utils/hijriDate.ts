/**
 * Islamic (Hijri) and Gregorian Date Formatter
 * Synchronized with user specification:
 * Today = 18 August 2026 & 5 Rabi' al-Awwal 1448 AH (5 ربیع الاول 1448ھ)
 * Automatically advances daily without manual intervention.
 */

const HIJRI_MONTHS = {
  ur: [
    'محرم الحرام',
    'صفر المظفر',
    'ربیع الاول',
    'ربیع الثانی',
    'جمادی الاولیٰ',
    'جمادی الثانیہ',
    'رجب المرجب',
    'شعبان المعظم',
    'رمضان المبارک',
    'شوال المکرم',
    'ذوالقعدہ',
    'ذوالحجہ'
  ],
  ar: [
    'محرم',
    'صفر',
    'ربيع الأول',
    'ربيع الثاني',
    'جمادى الأولى',
    'جمادى الثانية',
    'رجب',
    'شعبان',
    'رمضان',
    'شوال',
    'ذو القعدة',
    'ذو الحجة'
  ],
  en: [
    'Muharram',
    'Safar',
    "Rabi' al-Awwal",
    "Rabi' al-Thani",
    'Jumada al-Awwal',
    'Jumada al-Thani',
    'Rajab',
    "Sha'ban",
    'Ramadan',
    'Shawwal',
    "Dhu al-Qi'dah",
    'Dhu al-Hijjah'
  ]
};

const GREGORIAN_MONTHS = {
  ur: [
    'جنوری', 'فروری', 'مارچ', 'اپریل', 'مئی', 'جون',
    'جولائی', 'اگست', 'ستمبر', 'اکتوبر', 'نومبر', 'دسمبر'
  ],
  ar: [
    'يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو',
    'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'
  ],
  en: [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ]
};

export interface FormattedDateResult {
  hijriDay: string;
  hijriMonth: string;
  hijriYear: string;
  hijriFull: string;
  gregorianDay: string;
  gregorianMonth: string;
  gregorianYear: string;
  gregorianFull: string;
  displayCombined: string;
}

export function getHijriAndGregorianDate(
  date: Date = new Date(),
  lang: 'ur' | 'ar' | 'en' = 'ur'
): FormattedDateResult {
  const gYear = date.getFullYear();
  const gMonthIdx = date.getMonth();
  const gDay = date.getDate();

  // Anchor: 19 August 2026 corresponds strictly to 19 August 2026 and 5 Rabi' al-Awwal 1448
  const anchorDate = new Date(2026, 7, 19);
  const curMidnight = new Date(gYear, gMonthIdx, gDay);
  const diffDays = Math.round(
    (curMidnight.getTime() - anchorDate.getTime()) / (1000 * 60 * 60 * 24)
  );

  const monthLengths = [30, 29, 30, 29, 30, 29, 30, 29, 30, 29, 30, 29];

  let hYear = 1448;
  let hMonthIdx = 2; // Rabi' al-Awwal (0-indexed)
  let hDay = 5 + diffDays;

  while (hDay > monthLengths[hMonthIdx]) {
    hDay -= monthLengths[hMonthIdx];
    hMonthIdx++;
    if (hMonthIdx >= 12) {
      hMonthIdx = 0;
      hYear++;
    }
  }

  while (hDay < 1) {
    hMonthIdx--;
    if (hMonthIdx < 0) {
      hMonthIdx = 11;
      hYear--;
    }
    hDay += monthLengths[hMonthIdx];
  }

  // Calculate calibrated Gregorian date (anchored at 19 August 2026)
  const calibratedGregorian = new Date(2026, 7, 19 + diffDays);
  const calGYear = calibratedGregorian.getFullYear();
  const calGMonthIdx = calibratedGregorian.getMonth();
  const calGDay = calibratedGregorian.getDate();

  const toArabicNums = (val: number | string) => {
    const arDigits = ['٠', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩'];
    return String(val).replace(/[0-9]/g, (d) => arDigits[parseInt(d, 10)]);
  };

  const hMonthName = HIJRI_MONTHS[lang][hMonthIdx];
  const gMonthName = GREGORIAN_MONTHS[lang][calGMonthIdx];

  if (lang === 'ar') {
    const hD = toArabicNums(hDay);
    const hY = toArabicNums(hYear);
    const gD = toArabicNums(calGDay);
    const gY = toArabicNums(calGYear);
    return {
      hijriDay: hD,
      hijriMonth: hMonthName,
      hijriYear: hY,
      hijriFull: `${hD} ${hMonthName} ${hY}هـ`,
      gregorianDay: gD,
      gregorianMonth: gMonthName,
      gregorianYear: gY,
      gregorianFull: `${gD} ${gMonthName} ${gY}م`,
      displayCombined: `${hD} ${hMonthName} ${hY}هـ • ${gD} ${gMonthName} ${gY}م`
    };
  }

  if (lang === 'en') {
    return {
      hijriDay: String(hDay),
      hijriMonth: hMonthName,
      hijriYear: String(hYear),
      hijriFull: `${hDay} ${hMonthName} ${hYear} AH`,
      gregorianDay: String(calGDay),
      gregorianMonth: gMonthName,
      gregorianYear: String(calGYear),
      gregorianFull: `${calGDay} ${gMonthName} ${calGYear}`,
      displayCombined: `${hDay} ${hMonthName} ${hYear} AH • ${calGDay} ${gMonthName} ${calGYear}`
    };
  }

  // Urdu (default)
  return {
    hijriDay: String(hDay),
    hijriMonth: hMonthName,
    hijriYear: String(hYear),
    hijriFull: `${hDay} ${hMonthName} ${hYear}ھ`,
    gregorianDay: String(calGDay),
    gregorianMonth: gMonthName,
    gregorianYear: String(calGYear),
    gregorianFull: `${calGDay} ${gMonthName} ${calGYear}ء`,
    displayCombined: `${hDay} ${hMonthName} ${hYear}ھ • ${calGDay} ${gMonthName} ${calGYear}ء`
  };
}
