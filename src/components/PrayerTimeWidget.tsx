import React, { useState, useEffect } from 'react';
import { useThemeLanguage } from '../context/ThemeLanguageContext';
import { INITIAL_PRAYER_TIMES } from '../data/initialData';
import { Clock, MapPin, Calendar, Sparkles } from 'lucide-react';

// Converts Urdu digits for institutional aesthetic
const toUrduDigits = (numStr: string | number) => {
  const urduNumbers = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];
  return String(numStr).replace(/[0-9]/g, (w) => urduNumbers[parseInt(w)]);
};

// Computes accurate Hijri Date from Gregorian Date
const getFormattedHijriDate = (date: Date) => {
  try {
    const formatter = new Intl.DateTimeFormat('ar-SA-u-ca-islamic-umalqura', {
      day: 'numeric',
      month: 'numeric',
      year: 'numeric'
    });
    const parts = formatter.formatToParts(date);
    let day = parts.find(p => p.type === 'day')?.value || '22';
    let monthIndex = parseInt(parts.find(p => p.type === 'month')?.value || '2') - 1;
    let year = parts.find(p => p.type === 'year')?.value || '1448';

    const hijriMonthsUrdu = [
      'محرم الحرام', 'صفر المظفر', 'ربیع الاول', 'ربیع الثانی',
      'جمادی الاولیٰ', 'جمادی الثانیہ', 'رجب المرجب', 'شعبان المعظم',
      'رمضان المبارک', 'شوال المکرم', 'ذو القعدۃ', 'ذو الحجۃ'
    ];

    const monthName = hijriMonthsUrdu[monthIndex % 12] || 'صفر المظفر';
    return `${toUrduDigits(day)} ${monthName} ${toUrduDigits(year)}ھ`;
  } catch (e) {
    return '۲۲ صفر المظفر ۱۴۴۸ھ';
  }
};

export const PrayerTimeWidget: React.FC = () => {
  const { t, language } = useThemeLanguage();
  const [now, setNow] = useState(new Date());

  // Real-time clock interval
  useEffect(() => {
    const timer = setInterval(() => {
      setNow(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const timeString = now.toLocaleTimeString('ur-PK', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true });
  const gregorianFormatted = now.toLocaleDateString('ur-PK', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
  const hijriFormatted = getFormattedHijriDate(now);

  // Parse time to minutes for active prayer detection
  const currentMinutes = now.getHours() * 60 + now.getMinutes();
  const isFriday = now.getDay() === 5;

  // Convert prayer times to minutes
  const fajrMin = 4 * 60 + 15;
  const sunriseMin = 5 * 60 + 35;
  const dhuhrMin = 12 * 60 + 20;
  const asrMin = 17 * 60 + 10;
  const maghribMin = 19 * 60 + 15;
  const ishaMin = 20 * 60 + 45;

  let activePrayer = 'fajr';
  if (currentMinutes >= fajrMin && currentMinutes < sunriseMin) activePrayer = 'fajr';
  else if (currentMinutes >= sunriseMin && currentMinutes < dhuhrMin) activePrayer = 'sunrise';
  else if (currentMinutes >= dhuhrMin && currentMinutes < asrMin) activePrayer = isFriday ? 'jummah' : 'dhuhr';
  else if (currentMinutes >= asrMin && currentMinutes < maghribMin) activePrayer = 'asr';
  else if (currentMinutes >= maghribMin && currentMinutes < ishaMin) activePrayer = 'maghrib';
  else activePrayer = 'isha';

  const prayers = [
    { id: 'fajr', name: 'الفجر', time: INITIAL_PRAYER_TIMES.fajr, active: activePrayer === 'fajr' },
    { id: 'sunrise', name: 'الشروق', time: INITIAL_PRAYER_TIMES.sunrise, active: activePrayer === 'sunrise' },
    { id: 'dhuhr', name: isFriday ? 'الجمعة' : 'الظهر', time: isFriday ? INITIAL_PRAYER_TIMES.jummah : INITIAL_PRAYER_TIMES.dhuhr, active: activePrayer === 'dhuhr' || activePrayer === 'jummah' },
    { id: 'asr', name: 'العصر', time: INITIAL_PRAYER_TIMES.asr, active: activePrayer === 'asr' },
    { id: 'maghrib', name: 'المغرب', time: INITIAL_PRAYER_TIMES.maghrib, active: activePrayer === 'maghrib' },
    { id: 'isha', name: 'العشاء', time: INITIAL_PRAYER_TIMES.isha, active: activePrayer === 'isha' },
  ];

  return (
    <div className="bg-[#5C4632] text-[#F8F4EC] rounded-2xl p-4 sm:p-5 shadow-lg border-2 border-[#B88A3B] relative overflow-hidden bg-islamic-pattern font-sans">
      
      {/* Header Info with Real-time Clock */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#B88A3B]/40 pb-3 mb-4" dir="rtl">
        
        {/* Title & Location */}
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-[#1F1F1F] text-[#B88A3B] border border-[#B88A3B]/40 shadow-xs shrink-0">
            <Clock className="w-5 h-5 animate-pulse text-[#B88A3B]" />
          </div>
          <div>
            <h3 className="text-sm sm:text-base font-bold text-[#B88A3B] font-urdu flex items-center gap-2">
              <span>اوقاتِ نماز جامعہ اسلامیہ ایبٹ آباد</span>
              <span className="text-[10px] px-2 py-0.5 rounded-md bg-[#25D366]/20 text-[#25D366] border border-[#25D366]/30 font-sans font-normal">
                ● Live Real-Time
              </span>
            </h3>
            <p className="text-[11px] text-stone-300 font-urdu flex items-center gap-1 mt-0.5">
              <MapPin className="w-3 h-3 text-[#B88A3B]" />
              <span>ایبٹ آباد شہر و مضافات (حنفی فقه)</span>
            </p>
          </div>
        </div>

        {/* Real-time Digital Clock & Dates Badge */}
        <div className="flex flex-wrap items-center gap-2" dir="rtl">
          {/* Live Clock Display */}
          <div className="bg-[#1F1F1F] px-3 py-1.5 rounded-xl border border-[#B88A3B]/50 text-xs sm:text-sm font-mono font-bold text-amber-300 flex items-center gap-1.5 shadow-inner">
            <Sparkles className="w-3.5 h-3.5 text-[#B88A3B]" />
            <span>{timeString}</span>
          </div>

          {/* Hijri & Gregorian Dates */}
          <div className="bg-[#1F1F1F] px-3 py-1 rounded-xl border border-[#B88A3B]/40 text-xs font-semibold text-[#B88A3B] flex items-center gap-1.5 font-urdu">
            <Calendar className="w-3.5 h-3.5 text-[#B88A3B]" />
            <span>{hijriFormatted}</span>
            <span className="text-stone-500">•</span>
            <span className="text-stone-300 text-[11px]">{gregorianFormatted}</span>
          </div>
        </div>

      </div>

      {/* Grid of Prayer Times */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5" dir="rtl">
        {prayers.map((item) => {
          const isActive = !!item.active;
          return (
            <div 
              key={item.id}
              className={`p-3 rounded-xl border text-center transition-all duration-300 relative ${
                isActive 
                  ? 'bg-[#B88A3B] text-[#2B2B2B] border-[#B88A3B] shadow-lg font-bold scale-105 ring-2 ring-amber-300' 
                  : 'bg-[#1F1F1F]/80 text-[#F8F4EC] border-stone-700 hover:border-[#B88A3B]'
              }`}
            >
              {isActive && (
                <span className="absolute -top-2 right-1/2 translate-x-1/2 bg-[#2B2B2B] text-amber-300 text-[9px] px-2 py-0.2 rounded-full border border-amber-300 font-urdu whitespace-nowrap">
                  موجودہ وقت
                </span>
              )}
              <div className={`text-xs font-urdu font-extrabold ${isActive ? 'text-[#2B2B2B]' : 'text-[#B88A3B]'}`}>
                {item.name}
              </div>
              <div className={`text-xs sm:text-sm font-mono mt-1 ${isActive ? 'font-black text-[#2B2B2B]' : 'text-stone-200'}`}>
                {item.time}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
