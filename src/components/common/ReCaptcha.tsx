import React, { useState, useEffect } from 'react';
import { ShieldCheck, RefreshCw, Check } from 'lucide-react';
import { useThemeLanguage } from '../../context/ThemeLanguageContext';

interface ReCaptchaProps {
  onChange: (token: string | null) => void;
  className?: string;
  theme?: 'light' | 'dark';
}

export const ReCaptcha: React.FC<ReCaptchaProps> = ({
  onChange,
  className = '',
  theme = 'light'
}) => {
  const { language } = useThemeLanguage();
  const [isChecked, setIsChecked] = useState<boolean>(false);
  const [isVerifying, setIsVerifying] = useState<boolean>(false);

  const getLabel = () => {
    if (language === 'ur') return 'میں روبوٹ نہیں ہوں';
    if (language === 'ar') return 'أنا لست برنامج روبوت';
    return "I'm not a robot";
  };

  const getPrivacyLabel = () => {
    if (language === 'ur') return 'رازداری - شرائط';
    if (language === 'ar') return 'الخصوصية - البنود';
    return 'Privacy - Terms';
  };

  const handleCheckboxClick = () => {
    if (isChecked || isVerifying) return;

    setIsVerifying(true);
    // Simulate reCAPTCHA security verification challenge
    setTimeout(() => {
      const token = `recaptcha_token_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
      setIsVerifying(false);
      setIsChecked(true);
      onChange(token);
    }, 900);
  };

  const handleReset = () => {
    setIsChecked(false);
    setIsVerifying(false);
    onChange(null);
  };

  return (
    <div 
      className={`inline-flex items-center justify-between gap-4 p-2.5 sm:p-3 rounded-lg border border-slate-300 dark:border-slate-700 bg-[#FAFAFA] dark:bg-slate-800 text-slate-800 dark:text-slate-100 select-none shadow-xs max-w-sm w-full ${className}`}
      dir="ltr"
    >
      {/* Checkbox Area */}
      <div 
        onClick={handleCheckboxClick}
        className="flex items-center gap-3 cursor-pointer py-1"
        role="button"
        tabIndex={0}
        aria-label="Google reCAPTCHA verification"
      >
        <div 
          className={`w-7 h-7 rounded border flex items-center justify-center transition-all ${
            isChecked 
              ? 'bg-emerald-600 border-emerald-600 text-white' 
              : isVerifying 
              ? 'bg-amber-50 border-amber-500 text-amber-600' 
              : 'bg-white dark:bg-slate-900 border-slate-400 dark:border-slate-600 hover:border-slate-500'
          }`}
        >
          {isChecked ? (
            <Check className="w-5 h-5 stroke-[3]" />
          ) : isVerifying ? (
            <RefreshCw className="w-4 h-4 animate-spin text-amber-600" />
          ) : null}
        </div>

        <span className={`text-xs font-semibold ${language === 'ur' ? 'font-urdu text-sm' : language === 'ar' ? 'font-arabic text-sm' : 'font-sans'}`}>
          {getLabel()}
        </span>
      </div>

      {/* Google reCAPTCHA Badge */}
      <div className="flex flex-col items-center justify-center pl-2 border-l border-slate-200 dark:border-slate-700 text-center shrink-0">
        <div className="flex items-center gap-1 text-[10px] text-slate-500 dark:text-slate-400 font-sans leading-none">
          <ShieldCheck className="w-3.5 h-3.5 text-[#4285F4]" />
          <span className="font-bold text-[#4285F4]">reCAPTCHA</span>
        </div>
        <div className="text-[9px] text-slate-400 dark:text-slate-500 font-sans mt-0.5">
          <span>{getPrivacyLabel()}</span>
        </div>
      </div>
    </div>
  );
};
