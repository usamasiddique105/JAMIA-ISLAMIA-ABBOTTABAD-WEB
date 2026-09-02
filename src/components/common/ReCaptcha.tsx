import React, { useEffect, useRef, useState } from 'react';
import { ShieldCheck, RefreshCw, AlertCircle } from 'lucide-react';
import { useThemeLanguage } from '../../context/ThemeLanguageContext';

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
    turnstile?: {
      render: (
        container: HTMLElement | string,
        parameters: {
          sitekey: string;
          theme?: 'light' | 'dark' | 'auto';
          size?: 'normal' | 'compact' | 'flexible';
          callback?: (token: string) => void;
          'expired-callback'?: () => void;
          'error-callback'?: () => void;
        }
      ) => string;
      reset: (widgetId?: string) => void;
    };
    onJamiaRecaptchaLoad?: () => void;
    onJamiaTurnstileLoad?: () => void;
  }
}

interface ReCaptchaProps {
  onChange: (token: string | null) => void;
  className?: string;
  theme?: 'light' | 'dark';
}

// Official Google reCAPTCHA v2 standard test site key
const DEFAULT_GOOGLE_RECAPTCHA_TEST_KEY = '6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI';

export const ReCaptcha: React.FC<ReCaptchaProps> = ({
  onChange,
  className = '',
  theme = 'light',
}) => {
  const { language, darkMode } = useThemeLanguage();
  const containerRef = useRef<HTMLDivElement | null>(null);
  const widgetIdRef = useRef<number | string | null>(null);

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [loadError, setLoadError] = useState<boolean>(false);
  const [reloadCounter, setReloadCounter] = useState<number>(0);

  // Determine active provider & site key
  const turnstileSiteKey = import.meta.env.VITE_TURNSTILE_SITE_KEY;
  const recaptchaSiteKey = import.meta.env.VITE_RECAPTCHA_SITE_KEY || DEFAULT_GOOGLE_RECAPTCHA_TEST_KEY;
  const isTurnstile = Boolean(turnstileSiteKey);
  const activeSiteKey = isTurnstile ? turnstileSiteKey : recaptchaSiteKey;

  const currentTheme: 'light' | 'dark' = darkMode ? 'dark' : (theme === 'dark' ? 'dark' : 'light');

  useEffect(() => {
    let isMounted = true;
    let timeoutId: NodeJS.Timeout;
    setIsLoading(true);
    setLoadError(false);

    if (isTurnstile) {
      // Cloudflare Turnstile flow
      const renderTurnstile = () => {
        if (!isMounted || !containerRef.current || !window.turnstile?.render) return;
        try {
          containerRef.current.innerHTML = '';
          const id = window.turnstile.render(containerRef.current, {
            sitekey: String(turnstileSiteKey),
            theme: currentTheme,
            callback: (token: string) => {
              if (isMounted) onChange(token);
            },
            'expired-callback': () => {
              if (isMounted) onChange(null);
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
          console.warn('Turnstile render issue:', err);
          if (isMounted) setIsLoading(false);
        }
      };

      if (window.turnstile && typeof window.turnstile.render === 'function') {
        renderTurnstile();
        return () => { isMounted = false; };
      }

      window.onJamiaTurnstileLoad = () => {
        if (isMounted) renderTurnstile();
      };

      const TURNSTILE_SCRIPT_ID = 'cloudflare-turnstile-script';
      let scriptTag = document.getElementById(TURNSTILE_SCRIPT_ID) as HTMLScriptElement | null;
      if (!scriptTag) {
        scriptTag = document.createElement('script');
        scriptTag.id = TURNSTILE_SCRIPT_ID;
        scriptTag.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js?onload=onJamiaTurnstileLoad&render=explicit';
        scriptTag.async = true;
        scriptTag.defer = true;
        scriptTag.onerror = () => {
          if (isMounted) {
            setLoadError(true);
            setIsLoading(false);
          }
        };
        document.head.appendChild(scriptTag);
      } else {
        renderTurnstile();
      }
    } else {
      // Google reCAPTCHA v2 flow
      const renderRecaptcha = () => {
        if (!isMounted || !containerRef.current || !window.grecaptcha?.render) return;
        try {
          containerRef.current.innerHTML = '';
          const id = window.grecaptcha.render(containerRef.current, {
            sitekey: String(recaptchaSiteKey),
            theme: currentTheme,
            callback: (token: string) => {
              if (isMounted) onChange(token);
            },
            'expired-callback': () => {
              if (isMounted) onChange(null);
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
          if (isMounted) setIsLoading(false);
        }
      };

      if (window.grecaptcha && typeof window.grecaptcha.render === 'function') {
        window.grecaptcha.ready(renderRecaptcha);
        return () => { isMounted = false; };
      }

      window.onJamiaRecaptchaLoad = () => {
        if (isMounted && window.grecaptcha) {
          window.grecaptcha.ready(renderRecaptcha);
        }
      };

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
      } else {
        if (window.grecaptcha?.ready) {
          window.grecaptcha.ready(renderRecaptcha);
        }
      }
    }

    timeoutId = setTimeout(() => {
      if (isMounted && !widgetIdRef.current && (!window.grecaptcha || !containerRef.current?.hasChildNodes())) {
        setIsLoading(false);
        setLoadError(true);
      }
    }, 7000);

    return () => {
      isMounted = false;
      clearTimeout(timeoutId);
    };
  }, [activeSiteKey, isTurnstile, currentTheme, language, onChange, reloadCounter]);

  const handleRetry = () => {
    setReloadCounter(prev => prev + 1);
    onChange(null);
  };

  return (
    <div className={`my-2 ${className}`} dir="ltr">
      <div 
        ref={containerRef} 
        className="min-h-[78px] flex items-center justify-start overflow-hidden rounded-md"
      />

      {isLoading && !loadError && (
        <div className="flex items-center gap-2.5 p-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80 text-slate-600 dark:text-slate-300 text-xs w-full max-w-sm">
          <RefreshCw className="w-4 h-4 animate-spin text-[#4285F4]" />
          <span className="font-sans">
            {isTurnstile ? 'Loading Cloudflare Turnstile security verification...' : 'Loading Google reCAPTCHA security verification...'}
          </span>
        </div>
      )}

      {loadError && (
        <div className="p-3.5 rounded-xl border border-rose-300 dark:border-rose-700 bg-rose-50/80 dark:bg-slate-800 text-slate-800 dark:text-slate-100 space-y-2.5 max-w-sm shadow-xs text-right" dir="rtl">
          <div className="flex items-center gap-2 text-xs font-bold text-rose-900 dark:text-rose-300">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
            <span>روبوٹ تصدیق لوڈ نہیں ہو سکی</span>
          </div>
          <p className="text-[11px] text-stone-600 dark:text-stone-300 leading-normal">
            براہ کرم انٹرنیٹ کنکشن یا ایڈ بلاکر چیک فرما کر دوبارہ کوشش کریں۔
          </p>
          <div className="pt-1">
            <button
              type="button"
              onClick={handleRetry}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#5C4632] hover:bg-[#4A3828] text-amber-100 text-xs font-bold rounded-lg transition-colors cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>دوبارہ لوڈ کریں (Retry)</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

