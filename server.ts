/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";
import { createServer as createViteServer } from "vite";

// Load environment configurations
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

app.use(express.json());

// Initialize server-side Gemini client
const apiKey = process.env.GEMINI_API_KEY;
let ai: GoogleGenAI | null = null;

if (apiKey) {
  ai = new GoogleGenAI({
    apiKey: apiKey,
    httpOptions: {
      headers: {
        "User-Agent": "aistudio-build",
      },
    },
  });
} else {
  console.warn("⚠️ Warning: GEMINI_API_KEY is not defined. AI interpretations will run in mock backup mode.");
}

// ---------------- USER API ROUTES ----------------

// Route: AI Health Interpreter
app.post("/api/interpret-health", async (req, res) => {
  const { biometrics, risks, mental, language, overallScore } = req.body;
  const isBengali = language === "bn";

  if (!biometrics || !risks) {
    return res.status(400).json({ error: "Invalid health payload" });
  }

  // Backup fallback if API key is failing or missing
  if (!ai) {
    const backupEn = `### Combined Medical Summary (Backup Generator)
Your overall Guard Score of **${overallScore}/100** suggests a stable state with minor warnings:
- **Diabetes Risk (${risks.diabetes.probability}%)**: ${risks.diabetes.explanation}
- **Cardiac Burden (${risks.heartDisease.probability}%)**: ${risks.heartDisease.explanation}
- **Hypertension Strain (${risks.hypertension.probability}%)**: ${risks.hypertension.explanation}
- **Mental Wellness**: Minimal emotional stresses.

*Recommendation*: Increase water intake, consume low-glycemic greens, and maintain regular physical exercises.
*Disclaimer*: This is an educational synthesis. Consult professional physicians for official biological treatments.`;

    const backupBn = `### সম্মিলিত মেডিকেল সারসংক্ষেপ (ব্যাকআপ রিভিউ)
আপনার হেলথগার্ড স্কোর হল **${overallScore}/100**, যা মাঝারি ঝুঁকির মাত্রা নির্দেশ করে:
- **ডায়াবেটিস ঝুঁকি (${risks.diabetes.probability}%)**: ${risks.diabetes.explanation}
- **হৃদরোগের সম্ভাবনা (${risks.heartDisease.probability}%)**: ${risks.heartDisease.explanation}
- **উচ্চ রক্তচাপের চাপ (${risks.hypertension.probability}%)**: ${risks.hypertension.explanation}
- **মানসিক স্বাস্থ্য**: মানসিক শান্ত পরিবেশ বজায় রাখা জরুরি।

*প্রতিরোধমূলক পরামর্শ*: নিয়মিত পানি পানের অভ্যাস গড়ে তুলুন, সুষম শাকসবজি খান এবং প্রতিদিন হালকা ব্যায়াম করুন।
*সতর্কতা*: এটি একটি সাধারণ এআই পর্যালোচনা। ডাক্তারী রোগনির্ণয় বা প্রেসক্রিপশনের বিকল্প নয়।`;

    return res.json({ response: isBengali ? backupBn : backupEn });
  }

  try {
    const prompt = `
Analyze the following preventive healthcare assessment and generate a highly personalized, educational, non-diagnostic synthesis of what these combined risks mean for their physical and mental health.

Biometrics Data:
- Age: ${biometrics.age} Years, Gender: ${biometrics.gender}
- Height: ${biometrics.height} cm, Weight: ${biometrics.weight} kg
- Blood Pressure: ${biometrics.systolic}/${biometrics.diastolic} mmHg
- Fasting Glucose: ${biometrics.glucose} mg/dL, Cholesterol: ${biometrics.cholesterol} mg/dL
- Smoking: ${biometrics.smoking}, Active Exercise: ${biometrics.exercise} days/week
- Genetic History of Chronic Disease: ${biometrics.familyHistory ? "Yes" : "No"}

AI Predictive Models Output:
- Diabetes Probability: ${risks.diabetes.probability}% (${risks.diabetes.category} Category)
- Heart Disease Probability: ${risks.heartDisease.probability}% (${risks.heartDisease.category} Category)
- Hypertension Probability: ${risks.hypertension.probability}% (${risks.hypertension.category} Category)

Mental Health Assessments:
- PHQ-9 Depression Indicator: ${mental ? mental.phq9.score : "Not Assessed"} / 27 (${mental ? mental.phq9.severity : "None"})
- GAD-7 Anxiety Indicator: ${mental ? mental.gad7.score : "Not Assessed"} / 21 (${mental ? mental.gad7.severity : "None"})
- PSS Stress Index: ${mental ? mental.pss.score : "Not Assessed"} / 40 (${mental ? mental.pss.severity : "None"})

Overall HealthGuard Score: ${overallScore}/100

INSTRUCTIONS FOR GENERATION:
1. Translate raw scores into an integrated biological story. For example, explain how stress indices (PSS) coupling with blood pressure can worsen hypertensive load, or how sedentary habits amplify insulin resistance (Diabetes risk).
2. NEVER use definitive diagnostic jargon or make physical diagnoses (e.g., do NOT write "You have clinical heart disease" or "You have clinical major depressive disorder"). Instead, write educationally (e.g., "Your metrics suggest vascular strain or physiological load").
3. Divide the advice into easy-to-read sections:
   - "Primary Biological Couplings" (explaining how these biometrics interact)
   - "Custom Dietary Adjustments" (such as low glycemic food, low sodium, healthy fats)
   - "Somatic & Physical Prescriptions" (cardio exercises, stress reduction, meditation templates)
4. Wrap with a localized clinical warning at the absolute bottom.
5. Provide the output strictly in the requested language: ${isBengali ? "BENGALI (বাংলা)" : "ENGLISH"}. Do not mix both. Make the text highly professional, comforting, and authoritative.
`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        temperature: 0.3,
      }
    });

    res.json({ response: response.text });
  } catch (error: any) {
    console.error("Gemini API error during interpretation:", error);
    res.status(500).json({ error: "Failed to generate interpretation", details: error.message });
  }
});

// Route: AI Wellness Coach Chat
app.post("/api/coach-chat", async (req, res) => {
  const { message, history, language } = req.body;
  const isBengali = language === "bn";

  if (!message) {
    return res.status(400).json({ error: "Message content cannot be empty" });
  }

  // Backup fallback if API key is missing
  if (!ai) {
    const backupEn = `I am currently running in offline backup mode. Regarding your concern for "${message}":
- **Exercise**: Engage in progressive cardiovascular cardio (such as light jogging, swimming, or brisk walking).
- **Diet**: Keep refined simple sugars low, prioritize plant proteins, and consume raw prebiotic fibres.
- **Sleep**: Maintain solid sleep hygiene—regular bedtime, offline bedroom rules, and darkness.
- **Mental Stress**: Engage in diaphragmatic breathing meditations. 

*Disclaimers*: I am not a physician. Seek primary medical consultation for actual symptoms.`;

    const backupBn = `আমি বর্তমানে অফলাইন ব্যাকআপ সহকারী হিসেবে উত্তর দিচ্ছি। আপনার জিজ্ঞাসা "${message}" সম্পর্কে কিছু প্রতিরোধমূলক নির্দেশনা:
- **ব্যায়াম**: নিয়মিত মাঝারি অ্যারোবিক ব্যায়াম (যেমন দ্রুত হাঁটা, সাঁতার কাটা বা হালকা সাইকেল চালানো) হার্টের জন্য সহায়ক।
- **খাদ্যাভ্যাস**: চিনি এবং প্রক্রিয়াজাত খাবার এড়িয়ে চলুন, পর্যাপ্ত ফাইবার যুক্ত শাকসবজি এবং পানি পান করুন।
- **ঘুম**: প্রতিদিন রাতে ঘুমানোর ১ ঘণ্টা আগে আপনার মোবাইল বা স্ক্রিন অফ করে দিন।
- **মানসিক শান্তি**: দৈনিক ১০ মিনিট দীর্ঘ শ্বাস-প্রশ্বাসের ব্যায়াম অনুশীলন করুন।

*সতর্কতা*: আমি কোনো পেশাদার ডাক্তার নই; সুনির্দিষ্ট শারীরিক উপসর্গে অবশ্যই চিকিৎসকের সহায়তা নিন।`;

    return res.json({ text: isBengali ? backupBn : backupEn });
  }

  try {
    const systemInstruction = `
You are a senior clinical Preventive Wellness and Lifestyle Coach. You specialize in longevity science, stress reduction, cardiovascular physical templates, low-glycemic foods, and sleep hygiene.

CRITICAL PRINCIPLES:
1. Always stay in character as a preventive coach. Never roleplay as a practicing cardiologist, prescribing doctor, or clinical psychiatrist.
2. Provide practical educational suggestions (e.g., low-sodium recipes, diaphragmatic meditation, 4-7-8 breathing patterns, safe metabolic weights).
3. If the user presents symptoms matching heavy distress, self-harm, or severe clinical chest pains, immediately print a noticeable crisis notice suggesting they call local lifelines (e.g. Bangladesh Govt National Helpline '333', National Mental Health Hotline '16263' or international emergency care) immediately.
4. Output your response strictly in the requested language: ${isBengali ? "Bengali (বাংলা)" : "English"}. Do not use english mixed sentences unless technical biometrics abbreviations (like BMI or BP) are more natural. Use beautiful, comfortable formatting.
`;

    // Map history to Gemini API format if present
    const geminiHistory = (history || []).map((msg: any) => ({
      role: msg.sender === "user" ? "user" : "model",
      parts: [{ text: msg.text }],
    }));

    // Generate response using chat context or standard content generations
    const chat = ai.chats.create({
      model: "gemini-3.5-flash",
      history: geminiHistory,
      config: {
        systemInstruction,
        temperature: 0.7,
      },
    });

    const result = await chat.sendMessage({ message });
    res.json({ text: result.text });
  } catch (error: any) {
    console.error("Gemini API error during wellness coaching:", error);
    res.status(500).json({ error: "Failed to communicate with coach model", details: error.message });
  }
});

// Serve Vite middleware in development or build assets in production
if (process.env.NODE_ENV !== "production") {
  const vite = await createViteServer({
    server: { middlewareMode: true },
    appType: "spa",
  });
  app.use(vite.middlewares);
} else {
  const distPath = path.join(process.cwd(), "dist");
  app.use(express.static(distPath));
  // Serve single page app routing
  app.get("*", (req, res) => {
    res.sendFile(path.join(distPath, "index.html"));
  });
}

// Bind to host 0.0.0.0 as required by sandboxed container
app.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 HealthGuard AI Full-Stack Server listening on http://localhost:${PORT}`);
});
