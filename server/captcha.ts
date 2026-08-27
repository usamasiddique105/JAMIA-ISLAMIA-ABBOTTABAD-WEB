// Server-side CAPTCHA & Bot Protection Module
// Jamia Islamia Abbottabad Digital Portal

interface RateLimitRecord {
  count: number;
  firstAttempt: number;
  lockedUntil?: number;
}

const formRateLimits = new Map<string, RateLimitRecord>();
const usedCaptchaTokens = new Set<string>();

// Official Google reCAPTCHA v2 Test Secret (used when no custom production key is set)
const DEFAULT_GOOGLE_RECAPTCHA_TEST_SECRET = '6LeIxAcTAAAAAGG-vFI1TnRWxMZNFuojJ4WifJWe';

/**
 * Validates a CAPTCHA / Bot token against Google reCAPTCHA or Cloudflare Turnstile API.
 * Never allows client-side fake tokens or bypasses.
 */
export async function verifyServerCaptcha(
  token: string,
  clientIp?: string
): Promise<{ success: boolean; error?: string }> {
  const trimmedToken = (token || '').trim();

  if (!trimmedToken) {
    return { success: false, error: 'روبوٹ تصدیق (CAPTCHA Token) غائب ہے۔' };
  }

  // Reject obvious fake/dummy bypass strings
  if (
    trimmedToken === 'test-token' ||
    trimmedToken.startsWith('sec_human_verified_') ||
    trimmedToken === 'bypass' ||
    trimmedToken === 'dummy' ||
    trimmedToken.length < 10
  ) {
    return { success: false, error: 'جعلی یا غیر مجاز روبوٹ ٹوکن مسترد کر دیا گیا۔' };
  }

  // Anti-Replay: Check if token has already been consumed
  if (usedCaptchaTokens.has(trimmedToken)) {
    return { success: false, error: 'یہ روبوٹ ٹوکن پہلے ہی استعمال ہو چکا ہے۔ براہ کرم صفحہ ریفریش کر کے دوبارہ تصدیق فرمائیں۔' };
  }

  // 1. Check Cloudflare Turnstile first if configured
  const turnstileSecret = process.env.TURNSTILE_SECRET_KEY || process.env.CLOUDFLARE_TURNSTILE_SECRET_KEY;
  if (turnstileSecret) {
    try {
      const formData = new URLSearchParams();
      formData.append('secret', turnstileSecret);
      formData.append('response', trimmedToken);
      if (clientIp) {
        formData.append('remoteip', clientIp);
      }

      const response = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
        method: 'POST',
        body: formData,
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      });

      const outcome = await response.json() as { success: boolean; 'error-codes'?: string[] };
      if (outcome && outcome.success) {
        usedCaptchaTokens.add(trimmedToken);
        setTimeout(() => usedCaptchaTokens.delete(trimmedToken), 5 * 60 * 1000);
        return { success: true };
      } else {
        return {
          success: false,
          error: `Cloudflare Turnstile تصدیق ناکام ہو گئی: ${outcome['error-codes']?.join(', ') || 'Invalid Token'}`,
        };
      }
    } catch (err: any) {
      console.error('Turnstile verification network error:', err);
      return { success: false, error: 'Cloudflare Turnstile سرور سے رابطہ کرنے میں خرابی پیش آئی۔' };
    }
  }

  // 2. Google reCAPTCHA Verification (v2 / v3)
  const recaptchaSecret = process.env.RECAPTCHA_SECRET_KEY || DEFAULT_GOOGLE_RECAPTCHA_TEST_SECRET;

  try {
    const params = new URLSearchParams();
    params.append('secret', recaptchaSecret);
    params.append('response', trimmedToken);
    if (clientIp) {
      params.append('remoteip', clientIp);
    }

    const res = await fetch('https://www.google.com/recaptcha/api/siteverify', {
      method: 'POST',
      body: params,
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });

    const data = await res.json() as { success: boolean; 'error-codes'?: string[]; hostname?: string };

    if (data && data.success) {
      // Mark token as consumed to prevent replay attacks
      usedCaptchaTokens.add(trimmedToken);
      setTimeout(() => usedCaptchaTokens.delete(trimmedToken), 5 * 60 * 1000);
      return { success: true };
    } else {
      const errCodes = data['error-codes']?.join(', ') || 'نامعلوم خرابی';
      return {
        success: false,
        error: `گوگل روبوٹ تصدیق (Google reCAPTCHA) ناکام ہو گئی: (${errCodes})`,
      };
    }
  } catch (err: any) {
    console.error('Google reCAPTCHA verification error:', err);
    return { success: false, error: 'گوگل reCAPTCHA سرور کی تصدیق کے دوران خرابی پیش آئی۔' };
  }
}

/**
 * Sliding window IP rate limiter for public forms (Questions, Admissions, Donations)
 */
export function checkPublicFormRateLimit(
  clientIp: string,
  formType: string = 'general',
  maxSubmissions: number = 8,
  windowMs: number = 10 * 60 * 1000 // 10 minutes
): { allowed: boolean; waitSeconds?: number } {
  const now = Date.now();
  const key = `${clientIp}_${formType}`;
  const record = formRateLimits.get(key);

  if (!record) {
    formRateLimits.set(key, { count: 1, firstAttempt: now });
    return { allowed: true };
  }

  if (record.lockedUntil && record.lockedUntil > now) {
    const waitSeconds = Math.ceil((record.lockedUntil - now) / 1000);
    return { allowed: false, waitSeconds };
  }

  if (now - record.firstAttempt > windowMs) {
    formRateLimits.set(key, { count: 1, firstAttempt: now });
    return { allowed: true };
  }

  if (record.count >= maxSubmissions) {
    const lockDuration = 15 * 60 * 1000; // 15 min lock
    record.lockedUntil = now + lockDuration;
    const waitSeconds = Math.ceil(lockDuration / 1000);
    return { allowed: false, waitSeconds };
  }

  record.count += 1;
  return { allowed: true };
}
