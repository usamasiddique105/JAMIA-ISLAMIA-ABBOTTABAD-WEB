import React from 'react';
import { AlertTriangle, CheckCircle2, Languages, Loader2, Sparkles, RefreshCw } from 'lucide-react';

interface FatwaTranslationBannerProps {
  isAiTranslated?: boolean;
  isApproved?: boolean;
  isTranslating?: boolean;
  showingOriginal?: boolean;
  onToggleOriginal?: () => void;
  onRefreshTranslation?: () => void;
  className?: string;
}

export const FatwaTranslationBanner: React.FC<FatwaTranslationBannerProps> = ({
  isAiTranslated = false,
  isApproved = false,
  isTranslating = false,
  showingOriginal = false,
  onToggleOriginal,
  onRefreshTranslation,
  className = '',
}) => {
  if (isTranslating) {
    return (
      <div 
        id="fatwa-translation-loading"
        className={`bg-amber-50 dark:bg-amber-950/40 border-2 border-amber-300 dark:border-amber-700/60 rounded-xl p-3.5 sm:p-4 text-amber-900 dark:text-amber-100 flex flex-wrap items-center justify-between gap-3 font-sans text-xs sm:text-sm shadow-xs ${className}`}
        dir="ltr"
      >
        <div className="flex items-center gap-2.5">
          <Loader2 className="w-5 h-5 text-amber-600 dark:text-amber-400 animate-spin shrink-0" />
          <div>
            <span className="font-bold flex items-center gap-1.5 text-amber-800 dark:text-amber-200">
              <Sparkles className="w-4 h-4 text-amber-500" />
              Translating Sharia Ruling into English...
            </span>
            <p className="text-[11px] sm:text-xs text-amber-700 dark:text-amber-300/80 mt-0.5">
              Generating clear, scholarly English translation with jurisprudence terms via Gemini AI.
            </p>
          </div>
        </div>
      </div>
    );
  }

  // If approved by admin
  if (isApproved) {
    return (
      <div 
        id="fatwa-translation-approved"
        className={`bg-emerald-50 dark:bg-emerald-950/40 border-2 border-emerald-400/80 dark:border-emerald-700/60 rounded-xl p-3.5 sm:p-4 text-emerald-950 dark:text-emerald-100 font-sans text-xs sm:text-sm shadow-xs ${className}`}
        dir="ltr"
      >
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-start gap-2.5">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
            <div>
              <div className="font-bold text-emerald-900 dark:text-emerald-200 flex items-center gap-1.5 text-sm">
                <span>✓ Reviewed and Approved Translation</span>
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 bg-emerald-200 dark:bg-emerald-900/80 text-emerald-800 dark:text-emerald-200 rounded-full">
                  Official Sharia Review
                </span>
              </div>
              <p className="text-[11px] sm:text-xs text-emerald-700 dark:text-emerald-300 mt-0.5">
                This English translation has been reviewed and verified by Darul Ifta Jamia Islamia Abbottabad.
              </p>
            </div>
          </div>

          {onToggleOriginal && (
            <button
              type="button"
              onClick={onToggleOriginal}
              className="shrink-0 px-3.5 py-1.5 rounded-lg bg-white dark:bg-emerald-900 hover:bg-emerald-100 dark:hover:bg-emerald-800 text-emerald-900 dark:text-emerald-100 font-semibold border border-emerald-300 dark:border-emerald-700 text-xs flex items-center gap-1.5 transition-colors cursor-pointer shadow-2xs"
            >
              <Languages className="w-3.5 h-3.5" />
              <span>{showingOriginal ? 'View English Translation' : 'View Original Urdu/Arabic Text'}</span>
            </button>
          )}
        </div>
      </div>
    );
  }

  // If automated translation (pending approval)
  if (isAiTranslated) {
    return (
      <div 
        id="fatwa-translation-automated-warning"
        className={`bg-amber-50 dark:bg-amber-950/40 border-2 border-amber-400 dark:border-amber-600/80 rounded-xl p-3.5 sm:p-4 text-amber-950 dark:text-amber-100 font-sans text-xs sm:text-sm shadow-xs ${className}`}
        dir="ltr"
      >
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-start gap-2.5">
            <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <p className="font-semibold text-amber-950 dark:text-amber-100 leading-relaxed text-xs sm:text-[13px]">
                ⚠️ This is an automated translation for reference purposes only. The original Urdu/Arabic text is the authoritative and official version of this Fatwa. In case of any discrepancy, the original text prevails.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
            {onRefreshTranslation && (
              <button
                type="button"
                onClick={onRefreshTranslation}
                title="Re-translate with AI"
                className="p-1.5 rounded-lg bg-white dark:bg-amber-900 hover:bg-amber-100 dark:hover:bg-amber-800 text-amber-900 dark:text-amber-100 border border-amber-300 dark:border-amber-700 text-xs transition-colors cursor-pointer"
              >
                <RefreshCw className="w-3.5 h-3.5" />
              </button>
            )}
            {onToggleOriginal && (
              <button
                type="button"
                onClick={onToggleOriginal}
                className="px-3.5 py-1.5 rounded-lg bg-[#5C4632] hover:bg-[#483625] text-amber-100 font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
              >
                <Languages className="w-3.5 h-3.5 text-amber-300" />
                <span>{showingOriginal ? 'View English Translation' : 'View Original Urdu/Arabic Text'}</span>
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Default when English is provided manually or default
  return null;
};
