import { StorageService } from './storage';
import { SiteVisitorLog } from '../types';

// Map common timezones to countries as a fast fallback
const TIMEZONE_TO_COUNTRY_MAP: Record<string, { country: string; countryCode: string }> = {
  'Asia/Karachi': { country: 'پاکستان (Pakistan)', countryCode: 'PK' },
  'Asia/Riyadh': { country: 'سعودی عرب (Saudi Arabia)', countryCode: 'SA' },
  'Asia/Dubai': { country: 'متحدہ عرب امارات (UAE)', countryCode: 'AE' },
  'Asia/Kolkata': { country: 'بھارت (India)', countryCode: 'IN' },
  'Asia/Dhaka': { country: 'بنگلہ دیش (Bangladesh)', countryCode: 'BD' },
  'Europe/London': { country: 'برطانیہ (United Kingdom)', countryCode: 'GB' },
  'America/New_York': { country: 'امریکہ (USA)', countryCode: 'US' },
  'America/Chicago': { country: 'امریکہ (USA)', countryCode: 'US' },
  'America/Los_Angeles': { country: 'امریکہ (USA)', countryCode: 'US' },
  'America/Toronto': { country: 'کینیڈا (Canada)', countryCode: 'CA' },
  'Australia/Sydney': { country: 'آسٹریلیا (Australia)', countryCode: 'AU' },
  'Europe/Berlin': { country: 'جرمنی (Germany)', countryCode: 'DE' },
  'Europe/Paris': { country: 'فرانس (France)', countryCode: 'FR' },
  'Europe/Istanbul': { country: 'ترکیہ (Turkey)', countryCode: 'TR' },
  'Asia/Qatar': { country: 'قطر (Qatar)', countryCode: 'QA' },
  'Asia/Kuwait': { country: 'کویت (Kuwait)', countryCode: 'KW' },
  'Asia/Muscat': { country: 'عمان (Oman)', countryCode: 'OM' },
  'Asia/Bahrain': { country: 'بحرین (Bahrain)', countryCode: 'BH' },
};

function getCountryNameByCode(code: string): string {
  const c = code.toUpperCase();
  const map: Record<string, string> = {
    PK: 'پاکستان (Pakistan)',
    SA: 'سعودی عرب (Saudi Arabia)',
    AE: 'متحدہ عرب امارات (UAE)',
    GB: 'برطانیہ (United Kingdom)',
    US: 'امریکہ (USA)',
    CA: 'کینیڈا (Canada)',
    AU: 'آسٹریلیا (Australia)',
    IN: 'بھارت (India)',
    BD: 'بنگلہ دیش (Bangladesh)',
    TR: 'ترکیہ (Turkey)',
    QA: 'قطر (Qatar)',
    KW: 'کویت (Kuwait)',
    OM: 'عمان (Oman)',
    BH: 'بحرین (Bahrain)',
    DE: 'جرمنی (Germany)',
    FR: 'فرانس (France)',
    MY: 'ملائیشیا (Malaysia)',
    ZA: 'جنوبی افریقہ (South Africa)'
  };
  return map[c] || c;
}

function detectDevice(): { deviceType: 'Mobile' | 'Tablet' | 'Desktop'; browser: string; os: string } {
  const ua = navigator.userAgent;

  // Device Type
  let deviceType: 'Mobile' | 'Tablet' | 'Desktop' = 'Desktop';
  if (/(tablet|ipad|playbook|silk)|(android(?!.*mobi))/i.test(ua)) {
    deviceType = 'Tablet';
  } else if (/Mobile|Android|iP(hone|od)|IEMobile|BlackBerry|Kindle|Silk-Accelerated|(hpw|web)OS|Opera M(obi|ini)/.test(ua)) {
    deviceType = 'Mobile';
  }

  // OS
  let os = 'Unknown OS';
  if (/Windows/i.test(ua)) os = 'Windows';
  else if (/Android/i.test(ua)) os = 'Android';
  else if (/iPhone|iPad|iPod/i.test(ua)) os = 'iOS';
  else if (/Macintosh|Mac OS X/i.test(ua)) os = 'macOS';
  else if (/Linux/i.test(ua)) os = 'Linux';

  // Browser
  let browser = 'Unknown Browser';
  if (/Edg\//i.test(ua)) browser = 'Microsoft Edge';
  else if (/SamsungBrowser/i.test(ua)) browser = 'Samsung Internet';
  else if (/Chrome\//i.test(ua)) browser = 'Google Chrome';
  else if (/Safari\//i.test(ua) && !/Chrome\//i.test(ua)) browser = 'Apple Safari';
  else if (/Firefox\//i.test(ua)) browser = 'Mozilla Firefox';
  else if (/Opera|OPR\//i.test(ua)) browser = 'Opera';

  return { deviceType, browser, os };
}

function getOrCreateSessionId(): string {
  let sid = sessionStorage.getItem('jia_visitor_sid');
  if (!sid) {
    sid = `sess_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
    sessionStorage.setItem('jia_visitor_sid', sid);
  }
  return sid;
}

// Track visited page with debounce and Geo-lookup
let lastLoggedPath = '';
let isTracking = false;

export async function trackSiteVisit(pagePath: string = 'home'): Promise<void> {
  // Avoid duplicate tracking of the exact same path within 30 seconds
  const nowTime = Date.now();
  const lastTimeKey = `jia_track_${pagePath}`;
  const lastTime = Number(sessionStorage.getItem(lastTimeKey) || '0');
  
  if (nowTime - lastTime < 30000 && lastLoggedPath === pagePath) {
    return;
  }
  
  if (isTracking) return;
  isTracking = true;

  try {
    sessionStorage.setItem(lastTimeKey, String(nowTime));
    lastLoggedPath = pagePath;

    const { deviceType, browser, os } = detectDevice();
    const sessionId = getOrCreateSessionId();

    // Default location from timezone
    let country = 'پاکستان (Pakistan)';
    let countryCode = 'PK';
    let city = '';
    let clientIp = '';

    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
    if (tz && TIMEZONE_TO_COUNTRY_MAP[tz]) {
      country = TIMEZONE_TO_COUNTRY_MAP[tz].country;
      countryCode = TIMEZONE_TO_COUNTRY_MAP[tz].countryCode;
    }

    // Attempt real geo-lookup via quick fetch with timeout
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 2000);
      
      const res = await fetch('https://ipapi.co/json/', { 
        signal: controller.signal,
        headers: { 'Accept': 'application/json' }
      });
      clearTimeout(timeoutId);

      if (res.ok) {
        const geoData = await res.json();
        if (geoData.country_code) {
          countryCode = geoData.country_code;
          country = getCountryNameByCode(geoData.country_code) || geoData.country_name || country;
        }
        if (geoData.city) {
          city = geoData.city;
        }
        if (geoData.ip) {
          clientIp = geoData.ip;
        }
      }
    } catch {
      // Graceful fallback to timezone-based detection
    }

    const now = new Date();
    const dateStr = now.toISOString().split('T')[0];
    const timeStr = now.toTimeString().split(' ')[0];

    // Detect referrer
    let ref = document.referrer;
    let referrerType = 'براہِ راست (Direct)';
    if (ref) {
      if (ref.includes('google')) referrerType = 'گوگل سرچ (Google)';
      else if (ref.includes('facebook') || ref.includes('fb.com')) referrerType = 'فیس بک (Facebook)';
      else if (ref.includes('whatsapp') || ref.includes('wa.me')) referrerType = 'واٹس ایپ (WhatsApp)';
      else if (ref.includes('twitter') || ref.includes('x.com')) referrerType = 'ٹوئٹر / X';
      else referrerType = ref.replace(/https?:\/\//, '').split('/')[0];
    }

    const visitorLog: SiteVisitorLog = {
      id: `vis_${nowTime}_${Math.random().toString(36).substring(2, 7)}`,
      timestamp: now.toISOString(),
      date: dateStr,
      time: timeStr,
      page: pagePath,
      referrer: referrerType,
      country,
      countryCode,
      city: city || undefined,
      deviceType,
      browser,
      os,
      ip: clientIp || undefined,
      sessionId,
      language: navigator.language
    };

    StorageService.addVisitor(visitorLog);
  } catch (err) {
    console.warn('Notice in visitor tracking:', err);
  } finally {
    isTracking = false;
  }
}
