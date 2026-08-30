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
    const apiKey = context.env.GEMINI_API_KEY || (context.env as any).GEMINI_KEY || (context.env as any).GOOGLE_API_KEY || (context.env as any).VITE_GEMINI_API_KEY;

    const body = (await context.request.json().catch(() => ({}))) as {
      fatwaId?: string;
      titleUr?: string;
      questionUr?: string;
      answerUr?: string;
    };

    const { titleUr = '', questionUr = '', answerUr = '' } = body;

    if (!titleUr && !questionUr && !answerUr) {
      return new Response(
        JSON.stringify({ success: false, error: 'ترجمہ کے لیے اردو متن درکار ہے۔' }),
        { status: 400, headers }
      );
    }

    if (!apiKey) {
      return new Response(
        JSON.stringify({
          success: false,
          error: 'Cloudflare Pages میں GEMINI_API_KEY ترتیب نہیں دیا گیا۔ برائے مہربانی Cloudflare Pages Settings -> Environment Variables میں GEMINI_API_KEY کی قدر شامل فرمائیں۔',
        }),
        { status: 500, headers }
      );
    }

    const prompt = `You are a certified Islamic scholar and English translator for Darul Ifta, Jamia Islamia Abbottabad.
Translate the following Urdu Fatwa (Islamic Legal Verdict) into clear, dignified, academic English.
Accurately convey Hanafi jurisprudence terms (e.g., Nikah, Talaq, Wudu, Ghusl, Salah, Halal, Haram, Wajib, Makruh, Sunnah, Khuntha, Iddah, Zakat, Sadaqah).

Urdu Input:
Title: ${titleUr || 'N/A'}
Question: ${questionUr || 'N/A'}
Answer: ${answerUr || 'N/A'}

Return ONLY a valid JSON object without markdown fences, with these exact keys:
{
  "titleEn": "...",
  "questionEn": "...",
  "answerEn": "..."
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
          titleEn: parsed.titleEn || titleUr,
          questionEn: parsed.questionEn || questionUr,
          answerEn: parsed.answerEn || answerUr,
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

