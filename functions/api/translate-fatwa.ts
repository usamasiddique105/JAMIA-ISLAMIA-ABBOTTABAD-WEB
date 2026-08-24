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
    const apiKey = context.env.GEMINI_API_KEY;
    if (!apiKey) {
      return new Response(
        JSON.stringify({ success: false, error: 'GEMINI_API_KEY is not configured in Cloudflare environment.' }),
        { status: 500, headers }
      );
    }

    const body = (await context.request.json()) as {
      fatwaId?: string;
      titleUr?: string;
      questionUr?: string;
      answerUr?: string;
    };

    const { titleUr = '', questionUr = '', answerUr = '' } = body;

    const prompt = `You are a professional Islamic scholar and English translator for Darul Ifta, Jamia Islamia Abbottabad.
Translate the following Urdu Fatwa (Question & Answer) into clear, dignified, academic English.
Maintain authentic Islamic terminology where appropriate (e.g., Nikah, Talaq, Wudu, Salah, Halal, Haram, Shariah, Iddah, Zakat).

Urdu Input:
Title: ${titleUr}
Question: ${questionUr}
Answer: ${answerUr}

Return ONLY a valid JSON object without markdown fences, with these exact keys:
{
  "titleEn": "...",
  "questionEn": "...",
  "answerEn": "..."
}`;

    const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`;

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

    if (!geminiRes.ok) {
      const errTxt = await geminiRes.text();
      return new Response(
        JSON.stringify({ success: false, error: `Gemini API Error: ${errTxt}` }),
        { status: 502, headers }
      );
    }

    const geminiData = (await geminiRes.json()) as {
      candidates?: Array<{ content?: { parts?: Array<{ text?: string }> } }>;
    };

    const rawText = geminiData.candidates?.[0]?.content?.parts?.[0]?.text?.trim() || '{}';
    const parsed = JSON.parse(rawText);

    return new Response(
      JSON.stringify({
        success: true,
        data: {
          titleEn: parsed.titleEn || '',
          questionEn: parsed.questionEn || '',
          answerEn: parsed.answerEn || '',
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

