import { Fatwa } from '../types';
import { StorageService } from './storage';

// In-flight promise cache to avoid duplicate API calls
const inFlightTranslations = new Map<string, Promise<Fatwa>>();

export const isEnglishTranslationMissingOrFallback = (fatwa: Fatwa): boolean => {
  const enAnswer = fatwa.answer?.en?.trim() || '';
  const urAnswer = fatwa.answer?.ur?.trim() || '';
  
  // Missing if empty or exact duplicate of Urdu text
  if (!enAnswer) return true;
  if (enAnswer === urAnswer) return true;
  
  // If english answer is too short compared to urdu while urdu has real text
  if (urAnswer.length > 50 && enAnswer.length < 15 && !fatwa.title?.en) {
    return true;
  }

  return false;
};

export const translateFatwaServerSide = async (
  titleUr: string,
  questionUr: string,
  answerUr: string
): Promise<{ titleEn: string; questionEn: string; answerEn: string }> => {
  const response = await fetch('/api/translate-fatwa', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      fatwaId: 'custom-translate',
      titleUr: titleUr || '',
      questionUr: questionUr || '',
      answerUr: answerUr || '',
    }),
  });

  if (!response.ok) {
    const errData = await response.json().catch(() => ({}));
    throw new Error(errData.error || `Translation request failed with status ${response.status}`);
  }

  const result = await response.json();
  if (!result.success || !result.data) {
    throw new Error(result.error || 'Failed to obtain translation from Gemini API.');
  }

  return {
    titleEn: result.data.titleEn,
    questionEn: result.data.questionEn,
    answerEn: result.data.answerEn,
  };
};

export const translateFatwaWithGemini = async (fatwa: Fatwa): Promise<{ titleEn: string; questionEn: string; answerEn: string }> => {
  return translateFatwaServerSide(
    fatwa.title?.ur || '',
    fatwa.question?.ur || '',
    fatwa.answer?.ur || ''
  );
};

export const getOrTranslateFatwaEnglish = async (
  fatwa: Fatwa,
  forceRefresh = false
): Promise<Fatwa> => {
  // If already translated and not forcing refresh, return immediately
  if (!forceRefresh && !isEnglishTranslationMissingOrFallback(fatwa)) {
    return fatwa;
  }

  // Deduplicate concurrent translation requests for the same fatwa
  if (inFlightTranslations.has(fatwa.id)) {
    return inFlightTranslations.get(fatwa.id)!;
  }

  const translationPromise = (async () => {
    try {
      const translated = await translateFatwaWithGemini(fatwa);

      const updatedFatwa: Fatwa = {
        ...fatwa,
        title: {
          ...fatwa.title,
          en: translated.titleEn || fatwa.title?.en || fatwa.title?.ur,
        },
        question: {
          ...fatwa.question,
          en: translated.questionEn || fatwa.question?.en || fatwa.question?.ur,
        },
        answer: {
          ...fatwa.answer,
          en: translated.answerEn || fatwa.answer?.en || fatwa.answer?.ur,
        },
        isAiTranslatedEn: Boolean(translated.answerEn && translated.answerEn !== fatwa.answer?.ur),
        isTranslationApproved: fatwa.isTranslationApproved || false,
        aiTranslatedEnAt: new Date().toISOString(),
      };

      // Save/cache into database & local storage
      StorageService.updateFatwa(updatedFatwa);
      return updatedFatwa;
    } catch (err) {
      console.warn(`Translation notice for fatwa ${fatwa.id}:`, err);
      // Return the current fatwa safely without throwing
      return fatwa;
    } finally {
      inFlightTranslations.delete(fatwa.id);
    }
  })();

  inFlightTranslations.set(fatwa.id, translationPromise);
  return translationPromise;
};

export const approveFatwaTranslation = (fatwaId: string, approvedBy = 'دارالافتاء جامعہ اسلامیہ'): Fatwa | null => {
  const fatwas = StorageService.getFatwas();
  const target = fatwas.find(f => f.id === fatwaId);
  if (!target) return null;

  const updated: Fatwa = {
    ...target,
    isTranslationApproved: true,
    translationApprovedBy: approvedBy,
  };

  StorageService.updateFatwa(updated);
  return updated;
};

export const revokeFatwaTranslationApproval = (fatwaId: string): Fatwa | null => {
  const fatwas = StorageService.getFatwas();
  const target = fatwas.find(f => f.id === fatwaId);
  if (!target) return null;

  const updated: Fatwa = {
    ...target,
    isTranslationApproved: false,
    translationApprovedBy: undefined,
  };

  StorageService.updateFatwa(updated);
  return updated;
};
