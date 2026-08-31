interface PagesContext<T = Record<string, any>> {
  request: Request;
  env: T;
  next: () => Promise<Response>;
}

interface Env {
  GEMINI_API_KEY?: string;
}

export const onRequestPost = async (context: PagesContext<Env>): Promise<Response> => {
  const headers = {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  };

  try {
    let apiKey = context.env.GEMINI_API_KEY || (context.env as any).GEMINI_KEY || (context.env as any).GOOGLE_API_KEY || (context.env as any).VITE_GEMINI_API_KEY;

    const body = (await context.request.json().catch(() => ({}))) as {
      fatwaId?: string;
      contentType?: string;
      titleUr?: string;
      questionUr?: string;
      answerUr?: string;
      contentUr?: string;
      geminiApiKey?: string;
    };

    const { 
      fatwaId = null,
      contentType = 'fatwa',
      titleUr = '', 
      questionUr = '', 
      answerUr = '',
      contentUr = '',
      geminiApiKey = ''
    } = body;

    if (!apiKey && geminiApiKey) {
      apiKey = geminiApiKey.trim();
    }

    const isArticle = contentType === 'article' || Boolean(contentUr && !answerUr);
    const effectiveContent = isArticle ? (contentUr || answerUr) : answerUr;

    if (!titleUr && !questionUr && !effectiveContent) {
      return new Response(
        JSON.stringify({ success: false, error: 'ترجمہ کے لیے اردو متن درکار ہے۔' }),
        { status: 400, headers }
      );
    }

    if (!apiKey) {
      return new Response(
        JSON.stringify({
          success: false,
          error: 'Cloudflare Pages میں GEMINI_API_KEY ترتیب نہیں دیا گیا۔ برائے مہربانی Cloudflare Pages Settings -> Environment Variables میں GEMINI_API_KEY شامل فرمائیں، یا ایڈمن سیٹنگز میں Gemini API Key درج کریں۔',
        }),
        { status: 500, headers }
      );
    }

    const prompt = isArticle
      ? `You are an expert Islamic scholar and scholarly translator for Darul Ifta Jamia Islamia Abbottabad.
Translate the following Islamic Article / News from Urdu into clear, formal, academic English AND authentic classical Islamic Arabic.
System Directive: یہ ایک اسلامی فتویٰ/مضمون کا متن ہے۔ اسے واضح، رسمی اور مکمل درست [انگریزی/عربی] میں ترجمہ کریں۔ فقہی اصطلاحات (حلال، حرام، مکروہ، واجب وغیرہ) کا مفہوم ہرگز تبدیل نہ کریں، نہ کوئی نیا مفہوم شامل کریں۔

Urdu Input:
Title: ${titleUr || 'N/A'}
Content: ${effectiveContent || 'N/A'}

Return ONLY a valid JSON object without markdown fences:
{
  "titleEn": "...",
  "contentEn": "...",
  "titleAr": "...",
  "contentAr": "..."
}`
      : `You are an expert Islamic jurist and scholarly translator for Darul Ifta Jamia Islamia Abbottabad.
Translate the following Islamic Fatwa (Sharia ruling) from Urdu into clear, dignified English AND authentic classical Islamic Arabic.
Accurately convey Hanafi jurisprudence terms (e.g., Nikah, Talaq, Wudu, Ghusl, Salah, Halal, Haram, Wajib, Makruh, Sunnah, Khuntha, Iddah, Zakat, Sadaqah).
System Directive: یہ ایک اسلامی فتویٰ/مضمون کا متن ہے۔ اسے واضح، رسمی اور مکمل درست [انگریزی/عربی] میں ترجمہ کریں۔ فقہی اصطلاحات (حلال، حرام، مکروہ، واجب وغیرہ) کا مفہوم ہرگز تبدیل نہ کریں، نہ کوئی نیا مفہوم شامل کریں۔

Urdu Input:
Title: ${titleUr || 'N/A'}
Question: ${questionUr || 'N/A'}
Answer: ${effectiveContent || 'N/A'}

Return ONLY a valid JSON object without markdown fences:
{
  "titleEn": "...",
  "questionEn": "...",
  "answerEn": "...",
  "titleAr": "...",
  "questionAr": "...",
  "answerAr": "..."
}`;

    const models = [
      'gemini-2.5-flash',
      'gemini-flash-latest',
      'gemini-3.1-flash-lite',
      'gemini-3.1-pro-preview',
    ];

    let lastErr = '';
    let parsed: { titleEn?: string; questionEn?: string; answerEn?: string } | null = null;

    for (const model of models) {
      try {
        const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
        const geminiRes = await fetch(geminiUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }],
            generationConfig: {
              responseMimeType: 'application/json',
              temperature: 0.2,
            },
          }),
        });

        if (geminiRes.ok) {
          const geminiData = (await geminiRes.json()) as any;
          const rawText = geminiData.candidates?.[0]?.content?.parts?.[0]?.text?.trim() || '';
          if (rawText) {
            const cleanJson = rawText.replace(/^```json\s*/i, '').replace(/```\s*$/, '').trim();
            parsed = JSON.parse(cleanJson);
            if (parsed) break;
          }
        } else {
          lastErr = await geminiRes.text();
        }
      } catch (err: any) {
        lastErr = err?.message || String(err);
      }
    }

    if (!parsed) {
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: `Gemini API سے رابطہ میں مسئلہ پیش آیا: ${lastErr || 'No response generated'}` 
        }),
        { status: 502, headers }
      );
    }

    return new Response(
      JSON.stringify({
        success: true,
        data: {
          id: fatwaId,
          titleEn: parsed.titleEn || titleUr,
          questionEn: parsed.questionEn || questionUr,
          answerEn: parsed.answerEn || parsed.contentEn || effectiveContent,
          contentEn: parsed.contentEn || parsed.answerEn || effectiveContent,
          titleAr: parsed.titleAr || titleUr,
          questionAr: parsed.questionAr || questionUr,
          answerAr: parsed.answerAr || parsed.contentAr || effectiveContent,
          contentAr: parsed.contentAr || parsed.answerAr || effectiveContent,
          translatedAt: new Date().toISOString(),
        },
      }),
      { status: 200, headers }
    );
  } catch (error: any) {
    return new Response(
      JSON.stringify({ success: false, error: error?.message || 'Server error' }),
      { status: 500, headers }
    );
  }
};

export const onRequestOptions = async (): Promise<Response> => {
  return new Response(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
};

