/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * HealthGuard AI - Secure Offline Preventive Wellness Assistant Component
 */

import React, { useState, useRef, useEffect } from "react";
import { Message, DashboardState } from "../types";
import { translations } from "../data/localization";
import { Bot, User, Send, HelpCircle, ShieldCheck } from "lucide-react";

interface AICoachChatProps {
  language: "en" | "bn";
  state: DashboardState;
}

/**
 * Highly structured Expert Recommendation Engine
 * Analyzes raw biometrics, stroke risk weights, and depressive classifications locally.
 */
function getOfflineResponse(inputText: string, language: "en" | "bn", state: DashboardState): string {
  const query = inputText.toLowerCase();
  const isEn = language === "en";

  // Category 6: Emergency Check First
  if (
    query.includes("pain") ||
    query.includes("chest") ||
    query.includes("breath") ||
    query.includes("heart attack") ||
    query.includes("stroke") ||
    query.includes("dizzy") ||
    query.includes("emergency") ||
    query.includes("crisis") ||
    query.includes("মর") ||
    query.includes("ব্যথা") ||
    query.includes("বুক") ||
    query.includes("ধড়ফড়") ||
    query.includes("শ্বাস") ||
    query.includes("জরুরি") ||
    query.includes("স্ট্রোক")
  ) {
    if (isEn) {
      return `⚠️ **URGENT HEALTH WARNING & EMERGENCY CLINICAL GUIDELINE**
If you or someone near you is experiencing severe pressure/weight on the chest, radiating upper-body pain, sudden shortness of breath, complete loss of motor balance, or a severe mental health crisis, please bypass this digital prototype immediately.

1. **Call Emergency Services**: 
   - **999** (General Bangladesh Emergency Dispatch)
2. **Action Plan**:
   - Sit upright, loosen any tight garments, stay calm, and seek direct clinical human evaluation immediately.
   - Do not rely on any algorithmic assistant under potential cardiovascular or medical emergencies.`;
    } else {
      return `⚠️ **জরুরি স্বাস্থ্য সতর্কতা এবং ক্লিনিকাল গাইডলাইন**
আপনি অথবা আপনার নিকটবর্তী কেউ যদি বুকে প্রচণ্ড চাপ বা ব্যথা, গুরুতর শ্বাসকষ্ট, হঠাৎ শরীরের যেকোনো পাশ অবশ হয়ে যাওয়া অথবা তীব্র মানসিক সংকটে থাকেন, তবে এই সাধারণ এআই সহকারীর উত্তরের অপেক্ষায় না থেকে অবিলম্বে দ্রুততম জরুরি সেবা গ্রহণ করুন।

১. **জরুরি হেল্পলাইনে কল করুন**:
   - **৯৯৯** (বাংলাদেশ জাতীয় জরুরি সেবা)
২. **তাত্ক্ষণিক পদক্ষেপ**:
   - শান্ত হয়ে সোজা হয়ে বসুন, আপনার গায়ের টাইট কাপড় ঢিলে করে দিন এবং অবিলম্বে কোনো হাসপাতাল বা চিকিৎসকের মুখোমুখি সেবা লাভ করুন।
   - যেকোনো প্রকার কার্ডিয়াক বা মেটাবলিক বিপজ্জনক উপসর্গ দেখা দিলে এআই দ্বারা রোগ নির্ণয় করার চেষ্টা পরিহার করুন।`;
    }
  }

  // Category 1: Sleep & Insomnia
  if (
    query.includes("sleep") ||
    query.includes("insomnia") ||
    query.includes("night") ||
    query.includes("bed") ||
    query.includes("wake") ||
    query.includes("sleeping") ||
    query.includes("tired") ||
    query.includes("ঘুম") ||
    query.includes("নিদ্রা") ||
    query.includes("ঘুমানো") ||
    query.includes("ক্লান্ত")
  ) {
    if (isEn) {
      return `🛌 **Offline Coach: Sleep Hygiene & Circadian Signaling**

Quality sleep is the fundamental engine behind metabolic clearance, insulin re-coupling, and stress hormone reduction.

- **Strict Buffer Protocol**: Keep electronic screens (phones, tablets, and laptops) away for **at least 60 minutes** before bedtime.
- **Cool & Dark Environment**: Dim room lights completely and keep room temperature steady to aid slow-wave sleep.
- **Vagal Reset**: Practice the 4-7-8 breathing technique in bed to relax the autonomic nervous system.
${state.mentalResults ? `- *Your Health Indicators*: I detected your Depressive Load (PHQ-9) score is **${state.mentalResults.phq9.score}/27** (Severity: ${state.mentalResults.phq9.severity}). Elevated stress blocks melatonin synthesis—prioritize 10 minutes of screen-free reading before bed!` : ""}`;
    } else {
      return `🛌 **অফলাইন কোচ: ঘুমের বিজ্ঞান এবং শরীর পুনর্গঠন**

একটি গভীর ও সুনির্দিষ্ট সময়ের ঘুম শরীর ও ধমনীর সতেজতা, সুষম মেটাবলিজম এবং মানসিক ক্লান্তি হ্রাসের প্রধান চাবিকাঠি।

- **ডিজিটাল কার্ফিউ**: রাত ঘুমানোর অন্তত **১ ঘণ্টা পূর্বে** মোবাইল ফোন, ল্যাপটপ বা যেকোনো ধরনের নীল আলোর স্ক্রিন বন্ধ করে দিন।
- **উপযুক্ত পরিবেশ**: শোবার ঘর সম্পূর্ণ অন্ধকার রাখুন এবং যেকোনো প্রকার কৃত্রিম কৃত্রিম আলো বা বাড়তি কোলাহল বর্জন করুন।
- **শ্বাস-প্রশ্বাসের ব্যায়াম**: বিছানায় যাওয়ার পর ৪-৭-৮ নিয়মে কয়েক মিনিট বুক ভরে শ্বাস নিন, যা আপনার হার্ট রেট শান্ত করতে সাহায্য করবে।
${state.mentalResults ? `- *আপনার মানসিক রেকর্ড*: আপনার অবসাদ স্ক্রিনিং (PHQ-9) স্কোর হল **${state.mentalResults.phq9.score}/২৭** (তীব্রতা: ${state.mentalResults.phq9.severityBengali})। অতিরিক্ত চাপ ঘুমের বিঘ্ন ঘটায়—ঘুমানোর আগে ১০ মিনিট ধ্যান করুন!` : ""}`;
    }
  }

  // Category 2: Exercise & Fitness
  if (
    query.includes("exercise") ||
    query.includes("workout") ||
    query.includes("cardio") ||
    query.includes("walk") ||
    query.includes("run") ||
    query.includes("gym") ||
    query.includes("fitness") ||
    query.includes("active") ||
    query.includes("ব্যায়াম") ||
    query.includes("হাঁটা") ||
    query.includes("দৌড়") ||
    query.includes("সাইকেল") ||
    query.includes("জিম") ||
    query.includes("সকাল")
  ) {
    const defaultEx = state.physical?.exercise ?? 0;
    if (isEn) {
      return `🏋️ **Offline Coach: Aerobic Energy & Muscle Glycogen Cleansing**

Frequent activity improves systemic insulin sensitivity, cleans metabolic lipids, and regulates arterial walls.

- **Aerobic Standards**: Target **150 minutes per week** of moderate physical activity (e.g., brisk walking, swimming, cycling, or jogging).
- **Physical Resistance**: Include twice-weekly strength drills to preserve and expand active glycogen repositories.
- **Your Specific Diagnostics**:
  - *Current Habit*: You exercise **${defaultEx} days/week**.
  ${defaultEx < 3 ? "- *Action Point*: Let's scale this up safely! Try inserting just 15 minutes of uninterrupted rapid walking today." : "- *Excellent*: You are consistently matching essential cardiopulmonary guidelines. Maintain this active discipline!"}`;
    } else {
      return `🏋️ **অফলাইন কোচ: শারীরিক ব্যায়াম এবং হৃদযন্ত্রের যত্ন**

নিয়মিত মাঝারি ব্যায়াম একটি অত্যন্ত শক্তিশালী প্রাকৃতিক টনিক—যা রক্তে শর্করা কমায় এবং রক্তের স্বাভাবিক পাম্পিং প্রক্রিয়া ধরে রাখতে সাহায্য করে।

- **কার্ডিও লক্ষ্য**: সপ্তাহে অন্তত **১৫০ মিনিট** মাঝারি ধরনের ব্যায়াম (যেমন দ্রুত হাঁটা, হালকা দৌড়ানো বা সাইকেল চালানো) করার অভ্যাস বজায় রাখুন।
- **পেশী সতেজতা**: পেশীর কর্মক্ষমতা অক্ষুণ্ণ রাখতে সপ্তাহে ২ দিন ফ্রিল্যান্স পুশআপ বা হালকা ভারোত্তলন জ্যামিতিক কসরত করতে পারেন।
- **আপনার পরিমাপের বিশ্লেষণ**:
  - *বর্তমান রুটিন*: আপনি সপ্তাহে **${defaultEx} দিন** ব্যায়াম করেন বলে নথিবদ্ধ করেছেন।
  ${defaultEx < 3 ? "- *পরামর্শ*: আজ থেকেই শুরু করুন! সকালে বা বিকেলে অন্তত ১৫ মিনিট টানা হাঁটাহাঁটি করুন।" : "- *চমৎকার*: আপনি নিয়মিত কার্ডিও কসরত সম্পন্ন করছেন! এভাবে জীবনযাত্রার শৃঙ্খলা বজায় রাখুন।"}`;
    }
  }

  // Category 3: Diet, Nutrition, Food, Sugar, Weight, Cholesterol, Diabetes
  if (
    query.includes("food") ||
    query.includes("diet") ||
    query.includes("nutrition") ||
    query.includes("sugar") ||
    query.includes("diabetic") ||
    query.includes("diabetes") ||
    query.includes("cholesterol") ||
    query.includes("glycemic") ||
    query.includes("eat") ||
    query.includes("weight") ||
    query.includes("fat") ||
    query.includes("keto") ||
    query.includes("rice") ||
    query.includes("carbs") ||
    query.includes("খাবার") ||
    query.includes("খাদ্য") ||
    query.includes("ডায়েট") ||
    query.includes("কোলেস্টেরল") ||
    query.includes("চিনি") ||
    query.includes("ডায়াবেটিস") ||
    query.includes("ওজন") ||
    query.includes("মেদ") ||
    query.includes("ভাত")
  ) {
    const age = state.physical?.age ?? "--";
    const height = state.physical?.height ?? "--";
    const weight = state.physical?.weight ?? "--";
    const bmi = state.physicalResults?.bmi ? state.physicalResults.bmi.toFixed(1) : "--";
    const glucose = state.physical?.glucose ?? "--";
    const chol = state.physical?.cholesterol ?? "--";
    const diabetRisk = state.physicalResults?.diabetes.probability ?? 0;

    if (isEn) {
      return `🥗 **Offline Coach: Low-Glycemic Architecture & Cardiac Lipids**

Nutrition represents your first line of defense against liver steatosis and cardiovascular plaque deposits.

- **Complex Fibers**: Choose unpolished grains, lentils, whole oats, and fiber-heavy spinach over simple white flour or bakery sugars.
- **Monounsaturated Lipids**: Prefer premium mustard seed oil, extra virgin olive oil, nuts, and avocados. Completely reject trans-fats and rancid seed oils.
- **Personalized Biometric Analysis**:
  - *Demographics*: Age **${age}** | Weight **${weight} kg** | Height **${height} cm** | BMI **${bmi}**
  - *Fasting Glucose*: **${glucose} mmol/L** (Diabetes risk probability calculated at **${diabetRisk}%**)
  - *Total Cholesterol*: **${chol} mg/dL**
  - *Coaching Directive*: Fiber slows down insulin spikes. Try filling half your lunch and dinner plate with fresh leafy greens!`;
    } else {
      return `🥗 **অফলাইন কোচ: সুষম পুষ্টি এবং বিপাকীয় নিয়ন্ত্রণ**

আপনার পুষ্টির সিদ্ধান্ত মূলত আপনার রক্তে ইনসুলিনের কার্যকারিতা এবং রক্তনালীতে চর্বি জমে যাওয়া প্রতিরোধে অবদান রাখে।

- **শর্করা নিয়ন্ত্রণ**: প্যাকেটজাত ফাস্টফুড, চিনিযুক্ত কোমল পানীয় এবং সাদা ময়দার তৈরি খাবার পরিহার করে লাল চাল ও আঁশযুক্ত লাল আটা বেছে নিন।
- **স্বাস্থ্যকর চর্বি**: ডালডা বা রিফাইনড তেল এড়িয়ে চলুন। এর বিপরীতে বাদাম ও খাঁটি সরিষা বা অলিভ অয়েলের মতো সুষম চর্বি ব্যবহার করুন।
- **আপনার মাপজোখ ভিত্তিক বিশ্লেষণ**:
  - *পরিমাপ*: বয়স **${age} বছর** | ওজন **${weight} কেজি** | উচ্চতা **${height} সেমি** | বিএমআই (BMI) **${bmi}**
  - *রক্তে শর্করা*: **${glucose} mmol/L** (ডায়াবেটিস সম্ভাব্য ঝুঁকি **${diabetRisk}%**)
  - *কোলেস্টেরল*: **${chol} মিগ্রা/ডেসিলিটার**
  - *পরামর্শ*: রক্তের চিনি ও ক্ষতিকর লিটু চর্বি নিয়ন্ত্রণে রাখতে ডিনার ও লাঞ্চের অর্ধেক জুড়ে সবুজ শাকসবজি এবং সালাদ রাখার অভ্যাস করুন!`;
    }
  }

  // Category 4: BP & Blood Pressure & Hypertension
  if (
    query.includes("bp") ||
    query.includes("blood pressure") ||
    query.includes("hypertension") ||
    query.includes("systolic") ||
    query.includes("diastolic") ||
    query.includes("pressure") ||
    query.includes("salt") ||
    query.includes("sodium") ||
    query.includes("রক্তচাপ") ||
    query.includes("প্রেশার") ||
    query.includes("লবণ") ||
    query.includes("উচ্চ রক্তচাপ")
  ) {
    const sys = state.physical?.systolic ?? "--";
    const dia = state.physical?.diastolic ?? "--";
    const bpRisk = state.physicalResults?.hypertension.probability ?? 0;

    if (isEn) {
      return `🩺 **Offline Coach: Vascular Elasticity & Restricting Sodium**

Steady blood pressure preserves microcapillary structures in your cardiovascular system, brain, and filtration nephrons.

- **Sodium Management**: Keep daily sodium under **2,000 mg** (roughly one level teaspoon of salt). Avoid adding dry salt to meals.
- **Potassium Rich DASH Foods**: Increase intake of bananas, dry-roasted almonds, and steamed spinach to naturally dilate blood vessel muscles.
- **Autonomic Resetting**: Integrate regular 10-minute relaxation intervals to offset cognitive or sensory overload.
- **Your Registered Biometrics**:
  - *Blood Pressure*: **${sys}/${dia} mmHg**
  - *Hypertension risk estimation*: **${bpRisk}%**
  - *Directive*: If your chronic readings regularly print over 130/80 mmHg, keep a daily pressure log and share it with a certified family physician. Keep physical salt low!`;
    } else {
      return `🩺 **অফলাইন কোচ: রক্তচাপ ও ধমনীর সুস্থতা নিয়ন্ত্রণ**

সুস্থ ধমনী আপনার হৃদযন্ত্র, মস্তিষ্ক এবং কিডনির সূক্ষ্ম রক্তনালীগুলোকে সুরক্ষিত রাখতে সবচেয়ে বড় ভূমিকা পালন করে।

- **কাঁচা লবণ বর্জন**: দৈনিক লবণ গ্রহণের পরিমাণ **১ চা চামচ** (২,০০০ মিগ্রা) এর নিচে রাখুন। খাবারে বাড়তি লবণ ছিটানো সম্পূর্ণ বন্ধ করুন!
- **পটাশিয়াম জাতীয় খাবার**: রক্তনালীকে নমনীয় রাখতে কলা, সবুজ শাক এবং মাঝারি পরিমাণে পানি ও তাজা মৌসুমি ফল খাওয়ার অভ্যাস করুন।
- **আপনার রক্তচাপ বিশ্লেষণ**:
  - *রক্তচাপ*: **${sys}/${dia} মিমি পারদ**
  - *উচ্চ রক্তচাপের আনুমানিক সম্ভাবনা*: **${bpRisk}%**
  - *পরামর্শ*: যদি ঘরের মাপে আপনার প্রেশার নিয়মিত ১৩৫/৮৫ এর ওপরে প্রদর্শন করে, তবে দৈনিক ৩ বার প্রেশার ট্র্যাকিং কাগজে লিখে আপনার ডাক্তারের সাথে শেয়ার করুন।`;
    }
  }

  // Category 5: Stress, Anxiety, Depression, Mental wellness
  if (
    query.includes("stress") ||
    query.includes("anxiety") ||
    query.includes("depressed") ||
    query.includes("depression") ||
    query.includes("sad") ||
    query.includes("mental") ||
    query.includes("phq") ||
    query.includes("gad") ||
    query.includes("pss") ||
    query.includes("tension") ||
    query.includes("মানসিক") ||
    query.includes("দুশ্চিন্তা") ||
    query.includes("হতাশা") ||
    query.includes("মন খারাপ") ||
    query.includes("উদ্বেগ") ||
    query.includes("টেনশন") ||
    query.includes("কান্ন")
  ) {
    const phqScore = state.mentalResults?.phq9.score ?? "--";
    const phqSev = state.mentalResults?.phq9.severity ?? "Not Assessed";
    const phqSevBn = state.mentalResults?.phq9.severityBengali ?? "পরিমাপ করা হয়নি";
    const gadScore = state.mentalResults?.gad7.score ?? "--";
    const gadSev = state.mentalResults?.gad7.severity ?? "Not Assessed";
    const gadSevBn = state.mentalResults?.gad7.severityBengali ?? "পরিমাপ করা হয়নি";
    const pssScore = state.mentalResults?.pss.score ?? "--";

    if (isEn) {
      return `🧠 **Offline Coach: Cortisol Regulation & Somatic Grounding**

Mental tension activates the sympathetic nervous system, boosting raw cortisol, heart rate, and internal blood glucose.

- **Vagus Nerve Restoration**: Practice **Box Breathing**: Inhale fully for 4s, hold retain for 4s, slowly empty the lungs for 4s, hold completely empty for 4s. Complete 5 consecutive rounds.
- **Sensory Boundaries**: Establish a 30-minute quiet session each afternoon without screens or audio.
- **Your Internal Mental Screening**:
  - *Symptom Screen (PHQ-9)*: **${phqScore}/27** (Depression Severity: ${phqSev})
  - *Anxiety Indicator (GAD-7)*: **${gadScore}/21** (Anxiety Severity: ${gadSev})
  - *Stress Burden (PSS)*: **${pssScore}/40**
  - *Coaching Guideline*: If GAD-7 or PHQ-9 results are categorized as Moderate or Severe, please connect with a real clinical counselor. Seeking empathetic psychological therapy is a proactive health investment!`;
    } else {
      return `🧠 **অফলাইন কোচ: মানসিক দুশ্চিন্তা এবং স্নায়ুতন্ত্রের প্রশান্তি**

মানসিক চাপ ও ক্লান্তি সরাসরি শরীরে কর্টিসল হরমোন বৃদ্ধি করে, যা হৃদযন্ত্রের ওপর ক্ষতিকর প্রভাব ফেলে ও ব্লাড প্রেশার বৃদ্ধি করে।

- **বক্স ব্রিদিং পদ্ধতি**: সোজা হয়ে বসে ৪ সেকেন্ড নাক দিয়ে শ্বাস নিন, ৪ সেকেন্ড শ্বাস ধরে রাখুন, ৪ সেকেন্ড ধরে ধীরে ধীরে বাতাস মুখ দিয়ে ছাড়ুন এবং ৪ সেকেন্ড থমকে থাকুন। এভাবে ৫ বার অনুশীলন করুন।
- **স্ক্রিন ডিটক্স**: দিনে অন্তত ১ ঘণ্টা মোবাইল থেকে দূরে থাকুন, পরিবারের সাথে কথা বলুন এবং নিজের শখের কাজ করুন।
- **আপনার মানসিক স্বাস্থ্য ডেটা**:
  - *অনূদিত অবসাদ মাত্রা (PHQ-9)*: **${phqScore}/২৭** (তীব্রতা: ${phqSevBn})
  - *অনূদিত উদ্বেগ মাত্রা (GAD-7)*: **${gadScore}/২১** (তীব্রতা: ${gadSevBn})
  - *স্ট্রেস সূচক (PSS/মানসিক চাপ)*: **${pssScore}/৪০**
  - *পরামর্শ*: যদি আপনার স্কোর মাঝারি বা তীব্র ক্যাটাগরিতে থাকে, তবে নির্দ্বিধায় একজন সার্টিফাইড সাইকোথেরাপিস্ট বা ফ্যামিলি কোচের পরামর্শ নিন। আপনি একা নন!`;
    }
  }

  // Category 7: Health Score / Greetings / Overview
  if (
    query.includes("score") ||
    query.includes("healthguard") ||
    query.includes("guard") ||
    query.includes("status") ||
    query.includes("hi") ||
    query.includes("hello") ||
    query.includes("hey") ||
    query.includes("coach") ||
    query.includes("সহকারী") ||
    query.includes("হ্যালো") ||
    query.includes("হাই") ||
    query.includes("কেমন") ||
    query.includes("স্কোর") ||
    query.includes("পয়েন্ট") ||
    query.includes("রিপোর্ট") ||
    query.includes("তুমি কে") ||
    query.includes("who are you")
  ) {
    if (isEn) {
      return `✨ **Secure Offline HealthGuard AI Coach Activated!**

Since this coaching console operates 100% within your client browser space, **no internet or Google Gemini API key prompts are required to communicate.** Your diagnostic answers and clinical weights remain completely private, secure, and offline on your device.

- **Current Overall Guard Score**: **${state.healthScore}/100**
${state.physical ? `- **Physical Baseline**: Registered biometric values indicate age **${state.physical.age}**, height **${state.physical.height} cm**, BP **${state.physical.systolic}/${state.physical.diastolic} mmHg**.` : "- **Physical Baseline**: No clinical biometrics saved yet! Click on *Physical Risk Form* tab to save your vital blood pressure and fasting glucose parameters."}
${state.mentalScores ? `- **Mental Screenings**: Your depressive (PHQ-9) and anxiety (GAD-7) screening tools are updated.` : "- **Mental Screenings**: No clinical mental evaluations saved yet. Go to *Mental Wellness Form* next to screen your current stress triggers!"}

**Tell me which area you are focusing on today:**
*- Sleep Hygiene & Insomnia*
*- Exercise Routine & Aerobic cardio*
*- Diabetes & Low Glycemic Nutrition*
*- Blood Pressure & Sodium Limits*
*- Stress Reduction & Mental Mindset*`;
    } else {
      return `✨ **নিরাপদ অফলাইন হেলথগার্ড এআই কোচ সক্রীয় আছে!**

এই চ্যাট সহকারীটি সম্পূর্ণ আপনার ডিভাইসের নিজস্ব ব্রাউজার মেমোরিতে নিরাপদে চলছে। **এজন্য কোনো ইন্টারনেট সংযোগ বা গুগল জেমিনি এপিআই কি (API Key) এর প্রয়োজন নেই।** আপনার পরিমাপকৃত স্বাস্থ্য স্কোর এবং উত্তরসমূহ শতভাগ ব্যক্তিগত এবং সুরক্ষিত থাকবে।

- **বর্তমান সামগ্রিক হেলথগার্ড স্কোর**: **${state.healthScore}/১০০**
${state.physical ? `- **শারীরিক রেকর্ড**: বয়স **${state.physical.age} বছর**, উচ্চতা **${state.physical.height} সেমি**, রক্তচাপ **${state.physical.systolic}/${state.physical.diastolic} মিমি পারদ** নথিবদ্ধ করা আছে।` : "- **শারীরিক রেকর্ড**: কোনো শারীরিক ডেটা এখনও দেওয়া হয়নি! উপরে বামে *Physical Risk Form* পরিমাপ পূরণ করে আপনার রক্তচাপ ও ব্লাড সুগার দিন।"}
${state.mentalScores ? `- **মানসিক স্ক্রিনিং**: আপনার অবসাদ (PHQ-9) ও উদ্বেগ (GAD-7) স্ক্রিনিং সফলভাবে সম্পূর্ণ হয়েছে।` : "- **মানসিক স্ক্রিনিং**: মানসিক প্রশ্নোত্তরের স্কোর সেট করা নেই। আজই *Mental Wellness Form* এ গিয়ে আপনার পিএইচকিউ-৯ পরিমাপ করে নিন!"}

**আজ আপনি কোন বিষয়ে সাহায্য চান?**
*- ঘুমের মান ও মেলাটোনিন বিজ্ঞান*
*- ব্যায়াম রুটিন ও প্রতিদিনের কার্ডিও*
*- ডায়াবেটিস নিয়ন্ত্রণ ও শর্করা বর্জিত খাদ্য*
*- উচ্চ রক্তচাপ ও খাবারে প্রেশার কমানো*
*- মানসিক প্রশান্তি ও মেডিটেশন রুটিন*`;
    }
  }

  // Fallback Standard
  if (isEn) {
    return `💡 **Offline Personal Assistant Response**

I am answering in offline privacy mode to guard your data security. Regarding your concern for **"${inputText}"**:

- **Metabolic Baseline**: Restrict simple sugary calories, consume clean fibers, and hydrate steadily.
- **Micro-Activity**: Try breaking long sitting stretches by walking for 2 minutes every hour.
- **Cardiac Shield**: Drop processed trans-fats and excessive raw salts.
- **Mental Stillness**: Try practicing 5 minutes of deep belly breathing twice daily.

*Our offline calculated overall wellness evaluation index is **${state.healthScore}/100**.*`;
  } else {
    return `💡 **অফলাইন অ্যাসিস্ট্যান্ট হেলথ কেয়ার রিভিউ**

আপনার গোপনীয়তা রক্ষার স্বার্থে আমি ইন্টারনেট বা এপিআই ব্যতীত সম্পূর্ণ অফলাইন মোডে সুরক্ষিত উত্তর দিচ্ছি। আপনার জিজ্ঞাসা **"${inputText}"** সম্পর্কে কিছু মৌলিক পরামর্শ:

- **মেটাবলিক ছন্দ**: সরল চিনি পরিহার করুন, ফাইবারযুক্ত সুষম খাবার খান এবং পর্যাপ্ত বিশুদ্ধ পানি পান করুন।
- **শারীরিক কসরত**: টানা বসে না থেকে প্রতি ঘণ্টায় অন্তত ২ মিনিটের জন্য দাঁড়িয়ে আলতো স্ট্রেচিং করুন।
- **হৃদপিণ্ডের সুরক্ষা**: অতিরিক্ত কাঁচা লবণ বর্জন এবং তেলে ভাজা ফাস্টফুড এড়িয়ে চলুন।
- **মানসিক প্রশান্তি**: দৈনিক ২ বার ৫ মিনিট করে গভীর শ্বাস নেওয়ার অভ্যাস করুন।

*আমাদের অফলাইন স্ক্রিনে আপনার সামগ্রিক স্বাস্থ্য সূচক হল **${state.healthScore}/১০০**।*`;
  }
}

// Helper component to render simple offline markdown beautifully
function FormattedMessage({ text, isUser }: { text: string; isUser: boolean }) {
  return (
    <div className="space-y-1">
      {text.split("\n").map((line, lineIdx) => {
        const isBullet = line.trim().startsWith("- ") || line.trim().startsWith("* ");
        const content = isBullet ? line.trim().replace(/^[-*]\s+/, "") : line;

        // Matches **bold** or *italic*
        const regex = /(\*\*.*?\*\*|\*.*?\*)/g;
        const pieces = content.split(regex);
        const parts = pieces.map((piece, pieceIdx) => {
          if (piece.startsWith("**") && piece.endsWith("**")) {
            return (
              <strong
                key={pieceIdx}
                className={
                  isUser
                    ? "font-extrabold text-white"
                    : "font-extrabold text-slate-900 dark:text-white"
                }
              >
                {piece.slice(2, -2)}
              </strong>
            );
          } else if (piece.startsWith("*") && piece.endsWith("*")) {
            return (
              <span
                key={pieceIdx}
                className={
                  isUser
                    ? "italic font-medium text-white underline decoration-dashed"
                    : "italic font-semibold text-slate-800 dark:text-slate-200"
                }
              >
                {piece.slice(1, -1)}
              </span>
            );
          }
          return piece;
        });

        if (isBullet) {
          return (
            <div key={lineIdx} className="flex gap-2 ml-1 items-start">
              <span className={isUser ? "text-white select-none shrink-0" : "text-blue-500 dark:text-blue-400 select-none shrink-0"}>
                •
              </span>
              <span className="flex-1">{parts}</span>
            </div>
          );
        }

        return (
          <div
            key={lineIdx}
            className={line.trim() === "" ? "h-2" : "min-h-[1.1rem]"}
          >
            {parts}
          </div>
        );
      })}
    </div>
  );
}

export default function AICoachChat({ language, state }: AICoachChatProps) {
  const t = translations[language];

  const chatContainerRef = useRef<HTMLDivElement>(null);
  const [messages, setMessages] = useState<Message[]>([
    {
      sender: "bot",
      text: t.coachIntro,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    },
  ]);
  const [inputText, setInputText] = useState("");
  const [loading, setLoading] = useState(false);

  // Sync initial bot message on language toggle
  useEffect(() => {
    setMessages((prev) => {
      if (prev.length === 1 && prev[0].sender === "bot") {
        return [
          {
            sender: "bot",
            text: t.coachIntro,
            timestamp: prev[0].timestamp,
          },
        ];
      }
      return prev;
    });
  }, [language]);

  // Auto scroll to bottom of chat
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages, loading]);

  const sendMessage = async (textToSend: string) => {
    if (!textToSend.trim() || loading) return;

    const timestamp = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    const userMsg: Message = { sender: "user", text: textToSend, timestamp };

    setMessages((prev) => [...prev, userMsg]);
    setInputText("");
    setLoading(true);

    // Simulate standard prompt processing delay (700ms) for high-quality professional feeling
    setTimeout(() => {
      const responseText = getOfflineResponse(textToSend, language, state);
      setMessages((prev) => [
        ...prev,
        {
          sender: "bot",
          text: responseText,
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        },
      ]);
      setLoading(false);
    }, 700);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(inputText);
  };

  return (
    <div className="flex flex-col h-[600px] bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-xl overflow-hidden shadow-sm" id="chatbot-panel-wrapper">
      {/* Bot Chat Header */}
      <div className="bg-blue-600 p-4 text-white flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-white/15 rounded-lg border border-white/10">
            <Bot className="w-5 h-5 text-blue-100 animate-pulse" />
          </div>
          <div>
            <h3 className="font-bold text-sm tracking-wide">{t.coachTitle}</h3>
            <p className="text-[10px] text-blue-100/80 font-medium leading-normal">{t.coachSubtitle}</p>
          </div>
        </div>
        <div className="text-[10px] bg-emerald-500 text-white font-bold px-2.5 py-1 rounded-full border border-emerald-400 flex items-center gap-1">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>{language === "en" ? "SECURE OFFLINE AI" : "সুরক্ষিত অফলাইন এআই"}</span>
        </div>
      </div>

      {/* Messages Window */}
      <div
        ref={chatContainerRef}
        className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50 dark:bg-slate-950/20"
        id="chat-scroll-viewport"
      >
        {messages.map((msg, i) => (
          <div key={i} className={`flex gap-3 max-w-[85%] ${msg.sender === "user" ? "ml-auto flex-row-reverse" : "mr-auto"}`}>
            <div className={`p-2 rounded-lg self-start ${msg.sender === "user" ? "bg-blue-600 text-white" : "bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 text-slate-850 dark:text-slate-250 shadow-xs"}`}>
              {msg.sender === "user" ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4 text-blue-500" />}
            </div>
            <div className="space-y-1">
              <div
                className={`p-3 rounded-2xl text-xs leading-relaxed ${
                  msg.sender === "user"
                    ? "bg-blue-600 text-white rounded-tr-none"
                    : "bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 text-slate-800 dark:text-slate-200 rounded-tl-none shadow-xs"
                }`}
              >
                <FormattedMessage text={msg.text} isUser={msg.sender === "user"} />
              </div>
              <span className={`text-[9px] text-slate-400 block px-1 ${msg.sender === "user" ? "text-right" : "text-left"}`}>
                {msg.timestamp}
              </span>
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex gap-3 max-w-[80%] mr-auto items-center">
            <div className="p-2 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
              <Bot className="w-4 h-4 text-blue-500" />
            </div>
            <div className="flex space-x-1.5 p-3 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800">
              <span className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
              <span className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
              <span className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
            </div>
          </div>
        )}
      </div>

      {/* Suggested Quick buttons */}
      <div className="p-3 border-t border-slate-100 dark:border-slate-800/80 bg-white dark:bg-slate-900 space-y-2">
        <div className="text-[9px] uppercase font-bold tracking-widest text-slate-400 flex items-center gap-1">
          <HelpCircle className="w-3.5 h-3.5 text-blue-500" />
          {t.quickQueries.title}
        </div>
        <div className="flex flex-wrap gap-1.5">
          {[1, 2, 3, 4].map((idx) => {
            const queryKey = idx as 1 | 2 | 3 | 4;
            const queryText = t.quickQueries[queryKey];
            return (
              <button
                type="button"
                id={`btn-quick-query-${idx}`}
                key={idx}
                onClick={() => sendMessage(queryText)}
                className="text-[10px] py-1.5 px-2.5 rounded-full border border-blue-100 dark:border-slate-800 bg-blue-500/5 hover:bg-blue-500/10 text-blue-600 dark:text-blue-400 font-medium transition cursor-pointer"
              >
                {queryText}
              </button>
            );
          })}
        </div>
      </div>

      {/* Input Submit form */}
      <form onSubmit={handleSubmit} className="p-3 border-t border-slate-150 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 flex gap-2">
        <input
          type="text"
          id="chat-input-text-field"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder={t.placeholder}
          className="flex-1 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-3 py-2 text-xs text-slate-900 dark:text-white focus:outline-blue-500 disabled:opacity-75"
          disabled={loading}
          required
        />
        <button
          type="submit"
          id="btn-chat-send"
          disabled={loading || !inputText.trim()}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition cursor-pointer disabled:opacity-50 flex items-center justify-center shrink-0"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
}
