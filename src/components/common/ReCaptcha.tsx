import React, { useEffect, useRef, useState } from 'react';
import { ShieldCheck, RefreshCw, AlertCircle } from 'lucide-react';
import { useThemeLanguage } from '../../context/ThemeLanguageContext';
import firebaseConfig from '../../../firebase-applet-config.json';

declare global {
  interface Window {
    grecaptcha?: {
      ready: (cb: () => void) => void;
      render: (
        container: HTMLElement | string,
        parameters: {
          sitekey: string;
          theme?: 'light' | 'dark';
          size?: 'normal' | 'compact';
          tabindex?: number;
          callback?: (token: string) => void;
          'expired-callback'?: () => void;
          'error-callback'?: () => void;
        }
      ) => number;
      reset: (widgetId?: number) => void;
      getResponse: (widgetId?: number) => string;
    };
    onJamiaRecaptchaLoad?: () => void;
  }
}

interface ReCaptchaProps {
  onChange: (token: string | null) => void;
  className?: string;
  theme?: 'light' | 'dark';
}

// Official Google reCAPTCHA v2 test site key (always passes and renders the official Google widget on all domains/localhost)
const DEFAULT_GOOGLE_RECAPTCHA_TEST_KEY = '6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI';

export const ReCaptcha: React.FC<ReCaptchaProps> = ({
  onChange,
  className = '',
  theme = 'light',
}) => {
  const { language, isDarkMode } = useThemeLanguage();
  const containerRef = useRef<HTMLDivElement | null>(null);
  const widgetIdRef = useRef<number | null>(null);

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [loadError, setLoadError] = useState<boolean>(false);
  const [fallbackAnswer, setFallbackAnswer] = useState<string>('');
  const [num1, setNum1] = useState<number>(() => Math.floor(Math.random() * 8) + 2);
  const [num2, setNum2] = useState<number>(() => Math.floor(Math.random() * 8) + 2);
  const [fallbackVerified, setFallbackVerified] = useState<boolean>(false);

  // Determine active site key
  const siteKey =
    import.meta.env.VITE_RECAPTCHA_SITE_KEY ||
    (firebaseConfig as Record<string, unknown>)?.recaptchaSiteKey ||
    DEFAULT_GOOGLE_RECAPTCHA_TEST_KEY;

  const currentTheme: 'light' | 'dark' = isDarkMode ? 'dark' : (theme === 'dark' ? 'dark' : 'light');

  useEffect(() => {
    let isMounted = true;
    let timeoutId: NodeJS.Timeout;

    const renderWidget = () => {
      if (!isMounted || !containerRef.current || !window.grecaptcha?.render) return;

      try {
        // Clear previous rendered widget if any
        containerRef.current.innerHTML = '';
        const id = window.grecaptcha.render(containerRef.current, {
          sitekey: String(siteKey),
          theme: currentTheme,
          callback: (token: string) => {
            if (isMounted) {
              onChange(token);
            }
          },
          'expired-callback': () => {
            if (isMounted) {
              onChange(null);
            }
          },
          'error-callback': () => {
            if (isMounted) {
              onChange(null);
              setLoadError(true);
            }
          },
        });
        widgetIdRef.current = id;
        setIsLoading(false);
      } catch (err) {
        console.warn('Google reCAPTCHA render issue:', err);
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    // If script is already loaded and ready
    if (window.grecaptcha && typeof window.grecaptcha.render === 'function') {
      window.grecaptcha.ready(renderWidget);
      return () => {
        isMounted = false;
      };
    }

    // Define global callback for Google API script
    window.onJamiaRecaptchaLoad = () => {
      if (isMounted && window.grecaptcha) {
        window.grecaptcha.ready(renderWidget);
      }
    };

    // Check if script tag is already in DOM
    const SCRIPT_ID = 'google-recaptcha-script';
    let scriptTag = document.getElementById(SCRIPT_ID) as HTMLScriptElement | null;

    if (!scriptTag) {
      const hlLang = language === 'ur' ? 'ur' : language === 'ar' ? 'ar' : 'en';
      scriptTag = document.createElement('script');
      scriptTag.id = SCRIPT_ID;
      scriptTag.src = `https://www.google.com/recaptcha/api.js?onload=onJamiaRecaptchaLoad&render=explicit&hl=${hlLang}`;
      scriptTag.async = true;
      scriptTag.defer = true;
      scriptTag.onerror = () => {
        if (isMounted) {
          setLoadError(true);
          setIsLoading(false);
        }
      };
      document.head.appendChild(scriptTag);
    }

    // Safety timeout in case of blocked network
    timeoutId = setTimeout(() => {
      if (isMounted && !widgetIdRef.current && (!window.grecaptcha || !containerRef.current?.hasChildNodes())) {
        setIsLoading(false);
        setLoadError(true);
      }
    }, 6000);

    return () => {
      isMounted = false;
      clearTimeout(timeoutId);
    };
  }, [siteKey, currentTheme, language, onChange]);

  const handleFallbackVerify = (e: React.FormEvent) => {
    e.preventDefault();
    const sum = num1 + num2;
    if (parseInt(fallbackAnswer.trim(), 10) === sum) {
      setFallbackVerified(true);
      const securityToken = `sec_human_verified_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;
      onChange(securityToken);
    } else {
      alert(language === 'ur' ? 'حساب کا جواب درست نہیں ہے، دوبارہ کوشش کریں۔' : 'Security answer incorrect. Please try again.');
      setNum1(Math.floor(Math.random() * 8) + 2);
      setNum2(Math.floor(Math.random() * 8) + 2);
      setFallbackAnswer('');
      onChange(null);
    }
  };

  return (
    <div className={`my-2 ${className}`} dir="ltr">
      {/* Official Google reCAPTCHA Render Target */}
      <div 
        ref={containerRef} 
        className="min-h-[78px] flex items-center justify-start overflow-hidden rounded-md"
      />

      {/* Loading state indicator while Google script loads */}
      {isLoading && !loadError && (
        <div className="flex items-center gap-2.5 p-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80 text-slate-600 dark:text-slate-300 text-xs w-full max-w-sm">
          <RefreshCw className="w-4 h-4 animate-spin text-[#4285F4]" />
          <span className="font-sans">Loading Google reCAPTCHA security verification...</span>
        </div>
      )}

      {/* Transparent Fallback Challenge if Google script is unreachable (e.g. offline/restricted sandbox) */}
      {loadError && !fallbackVerified && (
        <div className="p-3.5 rounded-xl border border-amber-300 dark:border-amber-700 bg-amber-50/80 dark:bg-slate-800 text-slate-800 dark:text-slate-100 space-y-2.5 max-w-sm shadow-xs text-right" dir="rtl">
          <div className="flex items-center gap-2 text-xs font-bold text-amber-900 dark:text-amber-300">
            <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>سیکیورٹی تصدیق (Anti-Spam Security Check)</span>
          </div>
          <p className="text-[11px] text-stone-600 dark:text-stone-300 leading-normal">
            اسپام روکنے کے لیے اس سوال کا جواب درج فرمائیں: <strong className="font-mono text-xs px-1.5 py-0.5 bg-white dark:bg-slate-900 rounded border border-amber-300">{num1} + {num2} = ؟</strong>
          </p>
          <div className="flex items-center gap-2 pt-1" dir="ltr">
            <input
              type="number"
              value={fallbackAnswer}
              onChange={(e) => setFallbackAnswer(e.target.value)}
              placeholder="جواب درج کریں"
              className="w-24 px-3 py-1.5 text-center text-sm font-bold bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:border-amber-500"
            />
            <button
              type="button"
              onClick={handleFallbackVerify}
              className="px-3.5 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold rounded-lg transition-colors cursor-pointer"
            >
              تصدیق کریں (Verify)
            </button>
          </div>
        </div>
      )}

      {loadError && fallbackVerified && (
        <div className="flex items-center gap-2 p-2.5 rounded-lg border border-emerald-300 bg-emerald-50 dark:bg-slate-800 text-emerald-800 dark:text-emerald-300 text-xs max-w-sm font-bold">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>سیکیورٹی تصدیق مکمل ہو گئی (Verified)</span>
        </div>
      )}
    </div>
  );
};
