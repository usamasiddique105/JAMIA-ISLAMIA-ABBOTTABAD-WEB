import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

let aiClient: GoogleGenAI | null = null;

function getGeminiClient(): GoogleGenAI {
  if (!aiClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error("GEMINI_API_KEY is not configured.");
    }
    aiClient = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  }
  return aiClient;
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: "5mb" }));

  // Health check endpoint
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", timestamp: new Date().toISOString() });
  });

  // Fatwa AI Translation API with intelligent model fallback (Gemini 3.7 Flash -> Gemini 2.5 Flash -> Gemini 2.5 Flash Lite)
  app.post("/api/translate-fatwa", async (req, res) => {
    try {
      const { fatwaId, titleUr, questionUr, answerUr } = req.body;

      if (!titleUr && !questionUr && !answerUr) {
        return res.status(400).json({
          success: false,
          error: "Missing fatwa text to translate (title, question, or answer).",
        });
      }

      const ai = getGeminiClient();

      const prompt = `Please translate the following Islamic Fatwa (Sharia ruling) from Urdu into clear, formal, scholarly, and strictly accurate English:

--- FATWA TITLE (Urdu) ---
${titleUr || 'N/A'}

--- INQUIRER QUESTION (Urdu) ---
${questionUr || 'N/A'}

--- SHARIA RULING & ANSWER (Urdu) ---
${answerUr || 'N/A'}
`;

      const systemInstruction = `یہ ایک اسلامی فتویٰ (شرعی حکم) کا متن ہے۔ اسے واضح، رسمی اور مکمل طور پر درست انگریزی میں ترجمہ کریں۔ فقہی اصطلاحات (جیسے حلال، حرام، مکروہ، واجب، سنت، زکوٰۃ، ہبہ، طلاق، نکاح وغیرہ) کو اصل عربی/اردو لفظ کے ساتھ بریکٹ میں انگریزی وضاحت دیں (مثلاً 'Makruh (disliked but not forbidden)', 'Wajib (obligatory)', 'Fard (mandatory)', 'Sunnah (prophetic tradition)', 'Hibah (gift)', 'Zakat (obligatory alms)'). حکم کا مفہوم ہرگز تبدیل نہ کریں، نہ ہی کوئی نیا مفہوم شامل کریں۔
You are an expert Islamic jurist and Arabic/Urdu-to-English scholarly translator representing Darul Ifta Jamia Islamia Abbottabad. Maintain complete fidelity to the original text without editorializing.`;

      const modelsToTry = [
        "gemini-3.7-flash",
        "gemini-3.6-flash",
        "gemini-flash-latest",
        "gemini-3.5-flash-lite",
        "gemini-3.1-flash-lite"
      ];
      let response = null;
      let lastErr: any = null;

      for (const model of modelsToTry) {
        try {
          response = await ai.models.generateContent({
            model,
            contents: prompt,
            config: {
              systemInstruction,
              responseMimeType: "application/json",
              responseSchema: {
                type: Type.OBJECT,
                properties: {
                  titleEn: {
                    type: Type.STRING,
                    description: "Clear, formal, and accurate English translation of the fatwa title",
                  },
                  questionEn: {
                    type: Type.STRING,
                    description: "Clear, formal, and accurate English translation of the inquirer's question",
                  },
                  answerEn: {
                    type: Type.STRING,
                    description: "Clear, formal, and strictly accurate English translation of the Sharia ruling and answer, preserving all jurisprudence terms with parenthetical explanations",
                  },
                },
                required: ["titleEn", "questionEn", "answerEn"],
              },
            },
          });
          if (response?.text) {
            break;
          }
        } catch (err: any) {
          console.warn(`Translation attempt with ${model} notice (${err?.message || err}). Trying next model...`);
          lastErr = err;
        }
      }

      if (!response?.text) {
        throw lastErr || new Error("All AI translation models temporarily unavailable.");
      }

      const responseText = response.text || "{}";
      let parsed: { titleEn?: string; questionEn?: string; answerEn?: string } = {};
      try {
        parsed = JSON.parse(responseText);
      } catch (parseErr) {
        console.error("Error parsing Gemini JSON response:", parseErr, responseText);
        parsed = {
          titleEn: titleUr,
          questionEn: questionUr,
          answerEn: responseText,
        };
      }

      res.json({
        success: true,
        data: {
          fatwaId: fatwaId || null,
          titleEn: parsed.titleEn || titleUr,
          questionEn: parsed.questionEn || questionUr,
          answerEn: parsed.answerEn || answerUr,
          translatedAt: new Date().toISOString(),
        },
      });
    } catch (error: any) {
      console.warn("Fatwa translation API notice:", error?.message || error);
      res.status(200).json({
        success: false,
        error: error?.message || "Temporary translation unavailability.",
        fallback: {
          titleEn: req.body?.titleUr || '',
          questionEn: req.body?.questionUr || '',
          answerEn: req.body?.answerUr || '',
        }
      });
    }
  });

  // Sitemap & SEO files explicit routes
  app.get(["/sitemap.xml", "/sitemap-*.xml"], (req, res, next) => {
    const fileName = req.path.replace(/^\/+/, '');
    const filePath = path.join(process.cwd(), process.env.NODE_ENV === "production" ? "dist" : "public", fileName);
    res.setHeader("Content-Type", "application/xml; charset=utf-8");
    res.setHeader("X-Robots-Tag", "all");
    res.sendFile(filePath, (err) => {
      if (err) next();
    });
  });

  app.get("/robots.txt", (req, res, next) => {
    const filePath = path.join(process.cwd(), process.env.NODE_ENV === "production" ? "dist" : "public", "robots.txt");
    res.setHeader("Content-Type", "text/plain; charset=utf-8");
    res.sendFile(filePath, (err) => {
      if (err) next();
    });
  });

  // Vite middleware for development vs static build for production
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
