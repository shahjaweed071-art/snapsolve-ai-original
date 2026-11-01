import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI, Type } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

const app = express();

// Increase JSON payload limit for multi-screenshot base64 uploads up to 35MB
app.use(express.json({ limit: '35mb' }));
app.use(express.urlencoded({ extended: true, limit: '35mb' }));

// In-memory analysis cache to prevent duplicate Gemini API calls
const analysisCache = new Map();
const CACHE_TTL_MS = 10 * 60 * 1000; // 10 minutes

function getMultiCacheKey(images, language, note) {
  const signatures = images.map((img) => `${img.length}:${img.slice(0, 60)}:${img.slice(-60)}`).join('|');
  return `${images.length}imgs:${signatures}:${language}:${note || ''}`;
}

// Instantiate GoogleGenAI with environment key and User-Agent
function getGeminiClient() {
  const apiKey = process.env.GEMINI_API_KEY || '';
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'snapsolve-hostinger',
      },
    },
  });
}

// Health check endpoint
app.get('/api/health', (_req, res) => {
  const key = process.env.GEMINI_API_KEY || '';
  res.json({
    status: 'ok',
    environment: 'production',
    hasApiKey: Boolean(key && key.length > 5),
    cachedAnalyses: analysisCache.size,
    timestamp: new Date().toISOString(),
  });
});

// Analyze screenshots endpoint (supports 1 to 4 screenshots simultaneously)
app.post('/api/analyze', async (req, res) => {
  try {
    const { images, image, language = 'en', categoryHint, userNote } = req.body;

    // Collect screenshots (support both 'images' array and legacy 'image' string)
    const rawImages = Array.isArray(images) && images.length > 0
      ? images.slice(0, 4)
      : image
        ? [image]
        : [];

    if (rawImages.length === 0) {
      return res.status(400).json({ error: 'At least one screenshot image is required.' });
    }

    const apiKey = process.env.GEMINI_API_KEY || '';
    if (!apiKey) {
      return res.status(500).json({
        error: 'GEMINI_API_KEY is not configured on the Hostinger server. Please configure it in your Hostinger hPanel Environment Variables.',
      });
    }

    // Check in-memory cache
    const cacheKey = getMultiCacheKey(rawImages, language, userNote);
    const cached = analysisCache.get(cacheKey);
    if (cached && Date.now() - cached.timestamp < CACHE_TTL_MS) {
      return res.json({ success: true, data: cached.data, fromCache: true });
    }

    // Process all screenshots into inlineData parts
    const imageParts = rawImages.map((imgStr) => {
      let base64Data = imgStr;
      let actualMime = 'image/jpeg';

      if (imgStr.includes('base64,')) {
        const parts = imgStr.split('base64,');
        base64Data = parts[1];
        const match = parts[0].match(/:(.*?);/);
        if (match && match[1]) {
          actualMime = match[1];
        }
      } else if (imgStr.startsWith('data:')) {
        const commaIndex = imgStr.indexOf(',');
        if (commaIndex !== -1) {
          const rawContent = imgStr.slice(commaIndex + 1);
          base64Data = Buffer.from(decodeURIComponent(rawContent)).toString('base64');
        }
      }

      const supportedMimes = ['image/png', 'image/jpeg', 'image/webp', 'image/heic', 'image/heif'];
      if (!supportedMimes.includes(actualMime)) {
        actualMime = 'image/jpeg';
      }

      return {
        inlineData: {
          mimeType: actualMime,
          data: base64Data,
        },
      };
    });

    const languageNames = {
      en: 'English',
      ur: 'Urdu (اردو)',
      hi: 'Hindi (हिन्दी)',
    };
    const targetLang = languageNames[language] || 'English';

    const systemPrompt = `You are SnapSolve AI, an expert visual diagnostic troubleshooter for mobile apps, websites, banking systems, software, and devices.
You are analyzing ${imageParts.length} screenshot(s) uploaded together by the user.
Target output language: ${targetLang}. All explanations, steps, causes, and notes must be in natural, everyday ${targetLang}.

CORE REQUIREMENTS:
1. Examine ALL ${imageParts.length} screenshot(s) simultaneously. Never ignore any screenshot.
2. Analyze connections and sequence between the screenshots (e.g. initial action -> error dialog -> terminal stack trace -> system alert).
3. Identify the main overarching problem across all images.
4. Detect duplicate or related error messages and codes across images.
5. In 'combinedProblemExplanation', clearly explain how all screenshots connect and summarize the root issue.
6. Provide FOUR (4) relevant, practical solutions based on the combined evidence:
   - Solution 1: Immediate primary fix (quickest non-destructive action).
   - Solution 2: Cache, state, session, or application reset.
   - Solution 3: Network, configuration, permissions, or system settings adjustment.
   - Solution 4: Fallback recovery or escalation path.
   Each solution must have a clear title, strategy summary, and step-by-step instructions.
7. Separate confirmed facts (directly visible) from possible causes. Never make unsubstantiated claims.
8. Keep technical error codes and commands (e.g. U16, 502, TypeError) intact in exact format.
9. Return structured JSON matching the schema.`;

    const userPrompt = `Please analyze these ${imageParts.length} screenshot(s) together as a unified troubleshooting case.
Category Hint: ${categoryHint || 'Auto-detect'}
User Context / Notes: ${userNote || 'None provided'}
Requested Language: ${targetLang}

Correlate evidence across all images, write a combined problem explanation, and generate 4 targeted solutions.`;

    const textPart = { text: userPrompt };
    const ai = getGeminiClient();

    const response = await ai.models.generateContent({
      model: 'gemini-3.1-flash-lite',
      contents: {
        parts: [...imageParts, textPart],
      },
      config: {
        systemInstruction: systemPrompt,
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            errorTitle: {
              type: Type.STRING,
              description: `Concise title of the main detected issue across all screenshots in ${targetLang}`,
            },
            category: {
              type: Type.STRING,
              description: 'Category: Banking & Finance, Mobile App, Web & Cloud, Software & Code, Operating System & Hardware, Gaming, or General App',
            },
            severity: {
              type: Type.STRING,
              description: 'Severity level: low, medium, high, or critical',
            },
            confidenceScore: {
              type: Type.INTEGER,
              description: 'Confidence score from 0 to 100 based on all combined evidence',
            },
            detectedErrorText: {
              type: Type.STRING,
              description: 'Primary error codes or key messages extracted across the screenshots',
            },
            screenshotsAnalyzedCount: {
              type: Type.INTEGER,
              description: 'Total number of screenshots analyzed',
            },
            combinedProblemExplanation: {
              type: Type.STRING,
              description: `Comprehensive explanation connecting all screenshots and explaining why the problem occurred, in ${targetLang}`,
            },
            rootCause: {
              type: Type.STRING,
              description: `Underlying root cause in ${targetLang}`,
            },
            confirmedFacts: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: `List of confirmed facts directly seen in the screenshots, in ${targetLang}`,
            },
            possibleCauses: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: `Probable contributing factors based on the evidence, in ${targetLang}`,
            },
            quickFix: {
              type: Type.STRING,
              description: `Fastest 30-second fix in ${targetLang}`,
            },
            fourSolutions: {
              type: Type.ARRAY,
              description: 'Four relevant, practical solutions based on the combined evidence',
              items: {
                type: Type.OBJECT,
                properties: {
                  solutionNumber: { type: Type.INTEGER },
                  title: { type: Type.STRING, description: `Title of this solution in ${targetLang}` },
                  strategy: { type: Type.STRING, description: `Strategy summary in ${targetLang}` },
                  steps: {
                    type: Type.ARRAY,
                    items: {
                      type: Type.OBJECT,
                      properties: {
                        stepNumber: { type: Type.INTEGER },
                        title: { type: Type.STRING, description: `Step title in ${targetLang}` },
                        instruction: { type: Type.STRING, description: `Detailed instruction in ${targetLang}` },
                        commandOrPath: { type: Type.STRING, description: 'Optional command or path' },
                        isCaution: { type: Type.BOOLEAN, description: 'True if caution is needed' },
                      },
                      required: ['stepNumber', 'title', 'instruction'],
                    },
                  },
                  expectedOutcome: { type: Type.STRING, description: `Expected result in ${targetLang}` },
                },
                required: ['solutionNumber', 'title', 'strategy', 'steps'],
              },
            },
            steps: {
              type: Type.ARRAY,
              description: 'Step-by-step instructions for the primary recommended fix',
              items: {
                type: Type.OBJECT,
                properties: {
                  stepNumber: { type: Type.INTEGER },
                  title: { type: Type.STRING },
                  instruction: { type: Type.STRING },
                  commandOrPath: { type: Type.STRING },
                  isCaution: { type: Type.BOOLEAN },
                },
                required: ['stepNumber', 'title', 'instruction'],
              },
            },
            preventionTips: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: `Practical prevention tips in ${targetLang}`,
            },
            alternativeSolution: {
              type: Type.STRING,
              description: `Alternative fallback solution in ${targetLang}`,
            },
            technicalDetails: {
              type: Type.STRING,
              description: 'Technical context or protocol details',
            },
          },
          required: [
            'errorTitle',
            'category',
            'severity',
            'confidenceScore',
            'detectedErrorText',
            'combinedProblemExplanation',
            'rootCause',
            'quickFix',
            'fourSolutions',
            'steps',
            'preventionTips',
            'alternativeSolution',
          ],
        },
      },
    });

    let responseText = response.text || '';
    if (!responseText) {
      throw new Error('Empty response received from Gemini AI.');
    }

    responseText = responseText.trim();
    if (responseText.startsWith('```json')) {
      responseText = responseText.replace(/^```json\s*/, '').replace(/\s*```$/, '');
    } else if (responseText.startsWith('```')) {
      responseText = responseText.replace(/^```\s*/, '').replace(/\s*```$/, '');
    }

    const parsedData = JSON.parse(responseText);
    parsedData.screenshotsAnalyzedCount = imageParts.length;

    // Cache result
    if (analysisCache.size > 100) {
      const oldestKey = analysisCache.keys().next().value;
      if (oldestKey) analysisCache.delete(oldestKey);
    }
    analysisCache.set(cacheKey, { data: parsedData, timestamp: Date.now() });

    return res.json({ success: true, data: parsedData });
  } catch (error) {
    console.error('Error analyzing screenshots with Gemini:', error);
    return res.status(500).json({
      error: error.message || 'Failed to analyze screenshots. Please try again.',
    });
  }
});

// Follow-up AI chat endpoint
app.post('/api/chat', async (req, res) => {
  try {
    const { messages, analysisContext, language = 'en' } = req.body;

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return res.status(400).json({ error: 'Messages array is required.' });
    }

    const apiKey = process.env.GEMINI_API_KEY || '';
    if (!apiKey) {
      return res.status(500).json({
        error: 'GEMINI_API_KEY is not configured on the Hostinger server. Please check your Hostinger hPanel Environment Variables.',
      });
    }

    const languageNames = {
      en: 'English',
      ur: 'Urdu (اردو)',
      hi: 'Hindi (हिन्दी)',
    };
    const targetLang = languageNames[language] || 'English';

    const systemInstruction = `You are SnapSolve AI's interactive follow-up troubleshooting assistant.
The user uploaded error screenshots and received an initial multi-screenshot diagnostic report with 4 detailed solutions.
They are now asking follow-up questions.

Diagnosis Context:
${JSON.stringify(analysisContext || {}, null, 2)}

Instructions:
1. Respond helpfully and clearly in ${targetLang}.
2. Maintain conversation context and reference the diagnosed screenshots and solutions.
3. If user asks which solution to try or reports a failure, guide them to the next best step.
4. Keep technical error codes and commands unaltered.`;

    const ai = getGeminiClient();

    const contents = messages.map((m) => ({
      role: m.role === 'user' ? 'user' : 'model',
      parts: [{ text: m.content }],
    }));

    const response = await ai.models.generateContent({
      model: 'gemini-3.1-flash-lite',
      contents,
      config: {
        systemInstruction,
      },
    });

    return res.json({
      success: true,
      reply: response.text || 'I could not generate a reply. Please try again.',
    });
  } catch (error) {
    console.error('Error in follow-up chat with Gemini:', error);
    return res.status(500).json({
      error: error.message || 'Failed to generate chat response.',
    });
  }
});

// Serve static frontend files from 'dist'
const distPath = path.resolve(__dirname, 'dist');
app.use(express.static(distPath));

// Fallback to index.html for Single Page Application routing
app.get('*', (_req, res) => {
  res.sendFile(path.resolve(distPath, 'index.html'));
});

// Start Hostinger Node.js production server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`===============================================`);
  console.log(` SnapSolve AI Production Server is Running!`);
  console.log(` Hostinger Port: ${PORT}`);
  console.log(` Environment: ${process.env.NODE_ENV || 'production'}`);
  console.log(` Static Assets: ${distPath}`);
  console.log(`===============================================`);
});
