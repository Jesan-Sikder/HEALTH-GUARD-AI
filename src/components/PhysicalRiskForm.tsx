/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { PhysicalData, PhysicalRecordResult } from "../types";
import { evaluatePhysicalRisks } from "../utils/healthCalculations";
import { translations } from "../data/localization";
import { Activity, Dumbbell, Flame, Sparkles, User, FileText, HelpCircle } from "lucide-react";
import { motion } from "motion/react";

interface PhysicalRiskFormProps {
  language: "en" | "bn";
  onUpdate: (data: PhysicalData, results: PhysicalRecordResult) => void;
  currentData: PhysicalData | null;
}

const SAMPLE_NORMAL: PhysicalData = {
  age: 32,
  gender: "female",
  height: 165,
  weight: 58,
  systolic: 118,
  diastolic: 76,
  glucose: 4.9,
  cholesterol: 175,
  smoking: "never",
  exercise: 4,
  familyHistory: false,
};

const SAMPLE_ELEVATED: PhysicalData = {
  age: 56,
  gender: "male",
  height: 174,
  weight: 89,
  systolic: 146,
  diastolic: 92,
  glucose: 7.9,
  cholesterol: 245,
  smoking: "current",
  exercise: 1,
  familyHistory: true,
};

export default function PhysicalRiskForm({ language, onUpdate, currentData }: PhysicalRiskFormProps) {
  const t = translations[language];

  const [formData, setFormData] = useState<PhysicalData>(
    currentData || {
      age: 40,
      gender: "male",
      height: 170,
      weight: 70,
      systolic: 120,
      diastolic: 80,
      glucose: 5.3,
      cholesterol: 190,
      smoking: "never",
      exercise: 3,
      familyHistory: false,
    }
  );

  const [results, setResults] = useState<PhysicalRecordResult | null>(null);
  const [loading, setLoading] = useState(false);

  // Sync with currentData if updated from parents
  useEffect(() => {
    if (currentData) {
      setFormData(currentData);
      const r = evaluatePhysicalRisks(currentData);
      setResults(r);
    }
  }, [currentData]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    let finalValue: any = value;

    if (type === "number") {
      finalValue = Number(value);
    } else if (value === "true") {
      finalValue = true;
    } else if (value === "false") {
      finalValue = false;
    }

    setFormData((prev) => ({
      ...prev,
      [name]: finalValue,
    }));
  };

  const calculateAndSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setLoading(true);

    setTimeout(() => {
      const evaluation = evaluatePhysicalRisks(formData);
      setResults(evaluation);
      onUpdate(formData, evaluation);
      setLoading(false);
    }, 600);
  };

  const loadSample = (sample: PhysicalData) => {
    setFormData(sample);
    const evaluation = evaluatePhysicalRisks(sample);
    setResults(evaluation);
    onUpdate(sample, evaluation);
  };

  const bmi = (formData.weight / ((formData.height / 100) * (formData.height / 100))).toFixed(1);

  const [showBpHolder, setShowBpHolder] = useState(false);
  const [showGlucoseHolder, setShowGlucoseHolder] = useState(false);
  const [showCholHolder, setShowCholHolder] = useState(false);

  const quickSetBP = (sys: number, dia: number) => {
    setFormData((prev) => ({
      ...prev,
      systolic: sys,
      diastolic: dia,
    }));
    setShowBpHolder(false);
  };

  const quickSetGlucose = (gl: number) => {
    setFormData((prev) => ({
      ...prev,
      glucose: gl,
    }));
    setShowGlucoseHolder(false);
  };

  const quickSetChol = (ch: number) => {
    setFormData((prev) => ({
      ...prev,
      cholesterol: ch,
    }));
    setShowCholHolder(false);
  };

  return (
    <div className="space-y-6" id="physical-screening-box">
      {/* Demo Controls */}
      <div className="bg-slate-50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-700/60 p-4 rounded-xl space-y-3">
        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
          <Sparkles className="w-4 h-4 text-emerald-500" />
          {t.sampleDataNotice}
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <button
            type="button"
            id="load-normal-btn"
            onClick={() => loadSample(SAMPLE_NORMAL)}
            className="w-full text-left py-2.5 px-4 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/15 border border-emerald-500/20 text-emerald-700 dark:text-emerald-400 font-medium transition text-sm flex items-center justify-between"
          >
            <span>{t.loadSampleNormal}</span>
            <span className="text-[10px] bg-emerald-500/20 dark:bg-emerald-500/30 px-2 py-0.5 rounded uppercase font-bold tracking-wider">
              {t.lowRisk}
            </span>
          </button>
          <button
            type="button"
            id="load-elevated-btn"
            onClick={() => loadSample(SAMPLE_ELEVATED)}
            className="w-full text-left py-2.5 px-4 rounded-lg bg-rose-500/10 hover:bg-rose-500/15 border border-rose-500/20 text-rose-700 dark:text-rose-400 font-medium transition text-sm flex items-center justify-between"
          >
            <span>{t.loadSampleElevated}</span>
            <span className="text-[10px] bg-rose-500/20 dark:bg-rose-500/30 px-2 py-0.5 rounded uppercase font-bold tracking-wider">
              {t.highRisk}
            </span>
          </button>
        </div>
      </div>

      <form onSubmit={calculateAndSubmit} className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-xl p-6 shadow-sm space-y-6">
        <div className="space-y-1 border-b border-slate-100 dark:border-slate-800 pb-4">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Activity className="w-5 h-5 text-blue-500" />
            {t.physicalFormTitle}
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">{t.physicalFormDesc}</p>
        </div>

        {/* Dynamic lifestyle estimation alert info banner */}
        <div className="bg-blue-500/5 dark:bg-blue-500/10 border border-blue-200/50 dark:border-blue-900/40 p-3 rounded-lg flex gap-2.5 items-start">
          <span className="text-base text-blue-500 mt-0.5">💡</span>
          <div className="space-y-1">
            <h4 className="text-xs font-bold text-blue-800 dark:text-blue-300">
              {language === "bn" ? "অজানা পরিমাপের জন্য লাইফস্টাইল এস্টিমেটর" : "Lifestyle Estimators for Missing Measurements"}
            </h4>
            <p className="text-[11px] text-slate-600 dark:text-slate-300 leading-normal">
              {language === "bn" 
                ? "আপনার যদি সাম্প্রতিক ল্যাব টেস্টের রিপোর্ট না থাকে, তবে চিন্তার কিছু নেই! রক্তচাপ, ব্লাড সুগার বা কোলেস্টেরল ইনপুটের ঠিক পাশে থাকা প্রশ্ন চিহ্নে ক্লিক করে আপনার সাধারণ শারীরিক অবস্থা বাছাই করুন। সিস্টেম আপনার জন্য বিশ্বস্ত ক্লিনিকাল রেফারেন্স বা গড় আনুমানিক মান সেট করে দেবে।"
                : "No recent laboratory report on hand? Don't worry! Click the question mark link next to any measurement field. Select your general daily feeling or lifestyle state, and the system will automatically populate a standard clinical estimate."}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* Age */}
          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-slate-400" />
              {t.age}
            </label>
            <input
              type="number"
              name="age"
              id="input-age"
              min="15"
              max="110"
              value={formData.age}
              onChange={handleInputChange}
              className="w-full rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950 p-2 text-sm text-slate-900 dark:text-white focus:outline-blue-500"
              required
            />
          </div>

          {/* Gender */}
          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">{t.gender}</label>
            <select
              name="gender"
              id="select-gender"
              value={formData.gender}
              onChange={handleInputChange}
              className="w-full rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950 p-2 text-sm text-slate-900 dark:text-white focus:outline-blue-500"
            >
              <option value="male">{t.male}</option>
              <option value="female">{t.female}</option>
              <option value="other">{t.other}</option>
            </select>
          </div>

          {/* Genetic History */}
          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">{t.familyHistory}</label>
            <select
              name="familyHistory"
              id="select-fam-history"
              value={String(formData.familyHistory)}
              onChange={handleInputChange}
              className="w-full rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950 p-2 text-sm text-slate-900 dark:text-white focus:outline-blue-500"
            >
              <option value="false">{t.no}</option>
              <option value="true">{t.yes}</option>
            </select>
          </div>

          {/* Height */}
          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">{t.height}</label>
            <input
              type="number"
              name="height"
              id="input-height"
              min="100"
              max="250"
              value={formData.height}
              onChange={handleInputChange}
              className="w-full rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950 p-2 text-sm text-slate-900 dark:text-white focus:outline-blue-500"
              required
            />
          </div>

          {/* Weight */}
          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">{t.weight}</label>
            <input
              type="number"
              name="weight"
              id="input-weight"
              min="30"
              max="250"
              value={formData.weight}
              onChange={handleInputChange}
              className="w-full rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950 p-2 text-sm text-slate-900 dark:text-white focus:outline-blue-500"
              required
            />
          </div>

          {/* BMI indicator */}
          <div className="space-y-1 bg-blue-50/30 dark:bg-blue-950/20 px-3 py-1.5 rounded-lg border border-blue-100/40 dark:border-blue-950/40 flex flex-col justify-center">
            <span className="text-[10px] uppercase font-bold tracking-widest text-blue-500">{t.bmi}</span>
            <span className="text-lg font-extrabold text-blue-600 dark:text-blue-400">
              {bmi} <span className="text-xs font-medium text-slate-500">kg/m²</span>
            </span>
            <span className="text-[10px] text-slate-400 leading-tight block">{t.bmiExplanation}</span>
          </div>

          {/* Systolic */}
          <div className="space-y-1">
            <div className="flex justify-between items-center">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">{t.systolicBP}</label>
              <button
                type="button"
                onClick={() => setShowBpHolder(!showBpHolder)}
                className="text-[10px] text-blue-600 dark:text-blue-400 font-semibold hover:underline flex items-center gap-0.5 cursor-pointer ml-auto"
                id="btn-bp-help-toggle"
              >
                <HelpCircle className="w-3 h-3 text-blue-500" />
                {language === "bn" ? "রক্তচাপ জানেন না?" : "Don't know BP?"}
              </button>
            </div>
            <input
              type="number"
              name="systolic"
              id="input-systolic"
              min="80"
              max="220"
              value={formData.systolic}
              onChange={handleInputChange}
              className="w-full rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950 p-2 text-sm text-slate-900 dark:text-white focus:outline-blue-500"
              required
            />
          </div>

          {/* Diastolic */}
          <div className="space-y-1">
            <div className="flex justify-between items-center">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">{t.diastolicBP}</label>
              <button
                type="button"
                onClick={() => setShowBpHolder(!showBpHolder)}
                className="text-[10px] text-blue-600 dark:text-blue-400 font-semibold hover:underline flex items-center gap-0.5 cursor-pointer ml-auto sm:hidden"
              >
                <HelpCircle className="w-3 h-3 text-blue-500" />
                {language === "bn" ? "জানেন না?" : "Don't know?"}
              </button>
            </div>
            <input
              type="number"
              name="diastolic"
              id="input-diastolic"
              min="40"
              max="130"
              value={formData.diastolic}
              onChange={handleInputChange}
              className="w-full rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950 p-2 text-sm text-slate-900 dark:text-white focus:outline-blue-500"
              required
            />
          </div>

          {/* Blood Pressure lifestyle estimation well */}
          {showBpHolder && (
            <div className="col-span-1 md:col-span-3 bg-slate-50 dark:bg-slate-950 p-3 rounded-lg border border-blue-200/40 dark:border-blue-900/40 space-y-2 animate-fadeIn" id="bp-estimation-selector-box">
              <div className="text-[11px] font-bold text-blue-600 dark:text-blue-400 flex justify-between items-center">
                <span>{language === "bn" ? "রক্তচাপ অনুমান ভিত্তিক সাহায্যকারী" : "Blood Pressure Lifestyle Estimator"}</span>
                <button type="button" onClick={() => setShowBpHolder(false)} className="text-slate-400 hover:text-slate-600 text-xs font-bold">×</button>
              </div>
              <p className="text-[10px] text-slate-500 dark:text-slate-400 leading-tight">
                {language === "bn" 
                  ? "আপনার সাধারণ অনুভূতির সাথে মেলে এমন সাধারণ অবস্থা নিচে থেকে বেছে নিন। এটি আপনার সিস্টোলিক এবং ডায়াস্টোলিক রক্তের প্রেশার সেট করবে:" 
                  : "Select a general description reflecting your typical somatic feeling to apply baseline reference figures:"}
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-1">
                <button
                  type="button"
                  id="bp-est-optimal"
                  onClick={() => quickSetBP(118, 76)}
                  className="p-2 border border-slate-200 dark:border-slate-800 hover:border-blue-500 dark:hover:border-blue-500 bg-white dark:bg-slate-900 hover:bg-blue-500/5 rounded-lg text-left text-xs transition cursor-pointer"
                >
                  <div className="font-bold text-slate-800 dark:text-slate-200 text-[11px]">{language === "bn" ? "১১৮/৭৬ (স্বাভাবিক)" : "118 / 76 (Optimal)"}</div>
                  <div className="text-[9px] text-slate-400 leading-tight">{language === "bn" ? "শারীরিকভাবে সতেজ ও কম উদ্বেগপূর্ণ জীবন" : "No heart flutter, energetic, calm resting state."}</div>
                </button>
                <button
                  type="button"
                  id="bp-est-pre"
                  onClick={() => quickSetBP(130, 84)}
                  className="p-2 border border-slate-200 dark:border-slate-800 hover:border-blue-500 dark:hover:border-blue-500 bg-white dark:bg-slate-900 hover:bg-blue-500/5 rounded-lg text-left text-xs transition cursor-pointer"
                >
                  <div className="font-bold text-slate-800 dark:text-slate-200 text-[11px]">{language === "bn" ? "১৩০/৮৪ (বর্ডারলাইন)" : "130 / 84 (Pre-HTN)"}</div>
                  <div className="text-[9px] text-slate-400 leading-tight">{language === "bn" ? "অনিয়মিত ঘুম, মৃদু ক্লান্তি বা কাজের চাপ বেশি" : "Occasional stress, heavy screens, light sleep."}</div>
                </button>
                <button
                  type="button"
                  id="bp-est-high"
                  onClick={() => quickSetBP(145, 92)}
                  className="p-2 border border-slate-200 dark:border-slate-800 hover:border-blue-500 dark:hover:border-blue-500 bg-white dark:bg-slate-900 hover:bg-blue-500/5 rounded-lg text-left text-xs transition cursor-pointer"
                >
                  <div className="font-bold text-slate-800 dark:text-slate-200 text-[11px]">{language === "bn" ? "১৪৫/৯২ (উচ্চ রক্তচাপ)" : "145 / 92 (Elevated)"}</div>
                  <div className="text-[9px] text-slate-400 leading-tight">{language === "bn" ? "মাঝেমধ্যে মাথাব্যথা, হাই প্রেশারের পারিবারিক ইতিহাস" : "Frequent tension, family history, mild headaches."}</div>
                </button>
              </div>
            </div>
          )}

          {/* Glucose */}
          <div className="space-y-1">
            <div className="flex justify-between items-center">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">{t.glucose}</label>
              <button
                type="button"
                onClick={() => setShowGlucoseHolder(!showGlucoseHolder)}
                className="text-[10px] text-blue-600 dark:text-blue-400 font-semibold hover:underline flex items-center gap-0.5 cursor-pointer ml-auto"
                id="btn-glucose-help-toggle"
              >
                <HelpCircle className="w-3 h-3 text-blue-500" />
                {language === "bn" ? "সুগার জানেন না?" : "Don't know Sugar?"}
              </button>
            </div>
            <input
              type="number"
              name="glucose"
              id="input-glucose"
              min="2.5"
              max="25"
              step="0.1"
              value={formData.glucose}
              onChange={handleInputChange}
              className="w-full rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950 p-2 text-sm text-slate-900 dark:text-white focus:outline-blue-500"
              required
            />
          </div>

          {/* Glucose lifestyle estimation well */}
          {showGlucoseHolder && (
            <div className="col-span-1 md:col-span-3 bg-slate-50 dark:bg-slate-950 p-3 rounded-lg border border-blue-200/40 dark:border-blue-900/40 space-y-2 animate-fadeIn" id="glucose-estimation-selector-box">
              <div className="text-[11px] font-bold text-blue-600 dark:text-blue-400 flex justify-between items-center">
                <span>{language === "bn" ? "খালি পেটে রক্তের শর্করা অনুমানক" : "Fasting Blood Glucose Lifestyle Estimator"}</span>
                <button type="button" onClick={() => setShowGlucoseHolder(false)} className="text-slate-400 hover:text-slate-600 text-xs font-bold">×</button>
              </div>
              <p className="text-[10px] text-slate-500 dark:text-slate-400 leading-tight">
                {language === "bn" 
                  ? "আপনার সাম্প্রতিক খাদ্যাভ্যাস ও লক্ষণ অনুযায়ী শর্করার পরিমাণ (mmol/L) পূরণ করুন:" 
                  : "Select a general description mirroring your metabolic markers to apply a baseline glucose reference (mmol/L):"}
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-1">
                <button
                  type="button"
                  id="glucose-est-normal"
                  onClick={() => quickSetGlucose(5.0)}
                  className="p-2 border border-slate-200 dark:border-slate-800 hover:border-blue-500 dark:hover:border-blue-500 bg-white dark:bg-slate-900 hover:bg-blue-500/5 rounded-lg text-left text-xs transition cursor-pointer"
                >
                  <div className="font-bold text-slate-800 dark:text-slate-200 text-[11px]">{language === "bn" ? "৫.০ mmol/L (স্বাভাবিক)" : "5.0 mmol/L (Healthy)"}</div>
                  <div className="text-[9px] text-slate-400 leading-tight">{language === "bn" ? "বংশগত ডায়াবেটিস নেই, মিষ্টি খাবার পরিহারকারী" : "Stable carb burning, active lifestyle, no symptoms."}</div>
                </button>
                <button
                  type="button"
                  id="glucose-est-pre"
                  onClick={() => quickSetGlucose(6.1)}
                  className="p-2 border border-slate-200 dark:border-slate-800 hover:border-blue-500 dark:hover:border-blue-500 bg-white dark:bg-slate-900 hover:bg-blue-500/5 rounded-lg text-left text-xs transition cursor-pointer"
                >
                  <div className="font-bold text-slate-800 dark:text-slate-200 text-[11px]">{language === "bn" ? "৬.১ mmol/L (বর্ডারলাইন)" : "6.1 mmol/L (Borderline)"}</div>
                  <div className="text-[9px] text-slate-400 leading-tight">{language === "bn" ? "অতিরিক্ত মিষ্টি খাওয়ার প্রবণতা, মেদ বৃদ্ধি" : "Excess belly fat, sweet cravings, higher carbs."}</div>
                </button>
                <button
                  type="button"
                  id="glucose-est-diab"
                  onClick={() => quickSetGlucose(7.8)}
                  className="p-2 border border-slate-200 dark:border-slate-800 hover:border-blue-500 dark:hover:border-blue-500 bg-white dark:bg-slate-900 hover:bg-blue-500/5 rounded-lg text-left text-xs transition cursor-pointer"
                >
                  <div className="font-bold text-slate-800 dark:text-slate-200 text-[11px]">{language === "bn" ? "৭.৮ mmol/L (ডায়াবেটিস)" : "7.8 mmol/L (Elevated)"}</div>
                  <div className="text-[9px] text-slate-400 leading-tight">{language === "bn" ? "ঘন ঘন মুখ শুকানো, ডায়াবেটিসের পারিবারিক ইতিহাস" : "Dry mouth symptoms, high family history risk."}</div>
                </button>
              </div>
            </div>
          )}

          {/* Cholesterol */}
          <div className="space-y-1">
            <div className="flex justify-between items-center">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">{t.cholesterol}</label>
              <button
                type="button"
                onClick={() => setShowCholHolder(!showCholHolder)}
                className="text-[10px] text-blue-600 dark:text-blue-400 font-semibold hover:underline flex items-center gap-0.5 cursor-pointer ml-auto"
                id="btn-chol-help-toggle"
              >
                <HelpCircle className="w-3 h-3 text-blue-500" />
                {language === "bn" ? "কোলেস্টেরল জানেন না?" : "Don't know Fats?"}
              </button>
            </div>
            <input
              type="number"
              name="cholesterol"
              id="input-cholesterol"
              min="100"
              max="450"
              value={formData.cholesterol}
              onChange={handleInputChange}
              className="w-full rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950 p-2 text-sm text-slate-900 dark:text-white focus:outline-blue-500"
              required
            />
          </div>

          {/* Cholesterol lifestyle estimation well */}
          {showCholHolder && (
            <div className="col-span-1 md:col-span-3 bg-slate-50 dark:bg-slate-950 p-3 rounded-lg border border-blue-200/40 dark:border-blue-900/40 space-y-2 animate-fadeIn" id="chol-estimation-selector-box">
              <div className="text-[11px] font-bold text-blue-600 dark:text-blue-400 flex justify-between items-center">
                <span>{language === "bn" ? "কোলেস্টেরল অনুমান ভিত্তিক সাহায্যকারী" : "Serum Cholesterol Lifestyle Estimator"}</span>
                <button type="button" onClick={() => setShowCholHolder(false)} className="text-slate-400 hover:text-slate-600 text-xs font-bold">×</button>
              </div>
              <p className="text-[10px] text-slate-500 dark:text-slate-400 leading-tight">
                {language === "bn" 
                  ? "আপনার তেল-চর্বি খাবারের সাধারণ অভ্যাস অনুযায়ী কোলেস্টেরল (mg/dL) অনুমান করুন:" 
                  : "Estimate your serum cholesterol (mg/dL) based on your lipid diet and weight profile:"}
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-1 font-sans">
                <button
                  type="button"
                  id="chol-est-ideal"
                  onClick={() => quickSetChol(175)}
                  className="p-2 border border-slate-200 dark:border-slate-800 hover:border-blue-500 dark:hover:border-blue-500 bg-white dark:bg-slate-900 hover:bg-blue-500/5 rounded-lg text-left text-xs transition cursor-pointer"
                >
                  <div className="font-bold text-slate-800 dark:text-slate-200 text-[11px]">{language === "bn" ? "১৭৫ mg/dL (স্বাভাবিক)" : "175 mg/dL (Optimal)"}</div>
                  <div className="text-[9px] text-slate-400 leading-tight">{language === "bn" ? "সুষম তেল, শাকসবজি বা মাছ খাওয়ার নিয়মিত অভ্যাস" : "Mostly plant-based, light oils, regular exercise."}</div>
                </button>
                <button
                  type="button"
                  id="chol-est-borderline"
                  onClick={() => quickSetChol(210)}
                  className="p-2 border border-slate-200 dark:border-slate-800 hover:border-blue-500 dark:hover:border-blue-500 bg-white dark:bg-slate-900 hover:bg-blue-500/5 rounded-lg text-left text-xs transition cursor-pointer"
                >
                  <div className="font-bold text-slate-800 dark:text-slate-200 text-[11px]">{language === "bn" ? "২১০ mg/dL (বর্ডারলাইন)" : "210 mg/dL (Borderline)"}</div>
                  <div className="text-[9px] text-slate-400 leading-tight">{language === "bn" ? "মাঝেমধ্যে তেল-ভাজা পোড়া বা ফাস্টফুড খাওয়া" : "Occasional processed lipids, paratha, or fast foods."}</div>
                </button>
                <button
                  type="button"
                  id="chol-est-high"
                  onClick={() => quickSetChol(255)}
                  className="p-2 border border-slate-200 dark:border-slate-800 hover:border-blue-500 dark:hover:border-blue-500 bg-white dark:bg-slate-900 hover:bg-blue-500/5 rounded-lg text-left text-xs transition cursor-pointer"
                >
                  <div className="font-bold text-slate-800 dark:text-slate-200 text-[11px]">{language === "bn" ? "২৫৫ mg/dL (উচ্চ)" : "255 mg/dL (Elevated)"}</div>
                  <div className="text-[9px] text-slate-400 leading-tight">{language === "bn" ? "অলস দিনযাপন এবং চর্বি সমৃদ্ধ মসলাদার খাবার" : "Frequent red meats, deep-fried habits, low activity."}</div>
                </button>
              </div>
            </div>
          )}

          {/* Smoking */}
          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1">
              <Flame className="w-3.5 h-3.5 text-orange-500 animate-pulse" />
              {t.smoking}
            </label>
            <select
              name="smoking"
              id="select-smoking"
              value={formData.smoking}
              onChange={handleInputChange}
              className="w-full rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950 p-2 text-sm text-slate-900 dark:text-white focus:outline-blue-500"
            >
              <option value="never">{t.neverSmoked}</option>
              <option value="former">{t.formerSmoker}</option>
              <option value="current">{t.currentSmoker}</option>
            </select>
          </div>

          {/* Exercise */}
          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1">
              <Dumbbell className="w-3.5 h-3.5 text-emerald-500" />
              {t.exercise}
            </label>
            <input
              type="number"
              name="exercise"
              id="input-exercise"
              min="0"
              max="7"
              value={formData.exercise}
              onChange={handleInputChange}
              className="w-full rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950 p-2 text-sm text-slate-900 dark:text-white focus:outline-blue-500"
              required
            />
          </div>
        </div>

        <div className="flex justify-end pt-2 border-t border-slate-100 dark:border-slate-800">
          <button
            type="submit"
            id="btn-evaluate-biometrics"
            disabled={loading}
            className="px-6 py-3 rounded-lg text-white font-medium text-sm transition tracking-wider flex items-center gap-2 cursor-pointer bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 shadow shadow-blue-600/30 disabled:opacity-50"
          >
            {loading ? t.predicting : t.runAssessment}
          </button>
        </div>
      </form>

      {/* Renders locally generated Machine Learning outcomes / SHAP details for wow factor */}
      {results && (
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-slate-50 dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-100 rounded-xl p-6 space-y-6"
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4 gap-2">
            <div>
              <h3 className="text-md uppercase font-bold text-slate-700 dark:text-slate-300 tracking-wider flex items-center gap-2">
                <FileText className="w-5 h-5 text-blue-500 dark:text-blue-400" />
                {t.mlHeader}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{t.howWeightsCalculated}</p>
            </div>
            <div className="text-xs text-blue-600 dark:text-blue-400 bg-blue-500/5 dark:bg-blue-500/10 px-2.5 py-1.5 rounded-lg border border-blue-500/15 dark:border-blue-500/20 font-bold self-start sm:self-center">
              SHAP EXPLAINER L1 ON
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Diabetes Risk Box */}
            <div className="bg-white dark:bg-slate-950 p-4 rounded-lg border border-slate-200 dark:border-slate-800/85 shadow-sm">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">{t.diabetesRisk}</span>
                <span
                  className={`text-xs px-2 py-0.5 rounded uppercase font-bold ${
                    results.diabetes.category === "High"
                      ? "text-rose-600 dark:text-rose-400 bg-rose-500/10"
                      : results.diabetes.category === "Medium"
                      ? "text-yellow-600 dark:text-yellow-400 bg-yellow-500/10"
                      : "text-emerald-600 dark:text-emerald-400 bg-emerald-500/10"
                  }`}
                >
                  {results.diabetes.category === "High" ? t.highRisk : results.diabetes.category === "Medium" ? t.medRisk : t.lowRisk}
                </span>
              </div>
              <div className="mt-3 flex items-baseline gap-1">
                <span className="text-3xl font-extrabold text-slate-900 dark:text-white">{results.diabetes.probability}%</span>
                <span className="text-[10px] text-slate-400 dark:text-slate-500 font-mono">risk coefficient</span>
              </div>

              {/* Mini SHAP plotter */}
              <div className="mt-5 space-y-3">
                <span className="text-[10px] uppercase font-bold tracking-wider text-blue-650 dark:text-blue-400 block pb-1 border-b border-slate-200 dark:border-slate-800/60">
                  {t.shapTitle}
                </span>
                {results.diabetes.shapValue?.map((v, i) => (
                  <div key={i} className="space-y-1">
                    <div className="flex justify-between text-[10px] text-slate-500 dark:text-slate-400">
                      <span>{v.feature}</span>
                      <span className={v.impact > 0 ? "text-rose-600 dark:text-rose-400 font-mono" : "text-emerald-600 dark:text-emerald-400 font-mono"}>
                        {v.impact > 0 ? `+${v.impact}%` : `${v.impact}%`}
                      </span>
                    </div>
                    <div className="h-1.5 bg-slate-100 dark:bg-slate-900 rounded-full overflow-hidden flex">
                      {v.impact > 0 ? (
                        <div className="h-full bg-rose-500" style={{ width: `${Math.min(100, v.impact * 2)}%` }} />
                      ) : (
                        <div className="h-full bg-emerald-400" style={{ width: `${Math.min(100, Math.abs(v.impact) * 2)}%` }} />
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Heart Disease Box */}
            <div className="bg-white dark:bg-slate-950 p-4 rounded-lg border border-slate-200 dark:border-slate-800/85 shadow-sm">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">{t.heartDiseaseRisk}</span>
                <span
                  className={`text-xs px-2 py-0.5 rounded uppercase font-bold ${
                    results.heartDisease.category === "High"
                      ? "text-rose-600 dark:text-rose-400 bg-rose-500/10"
                      : results.heartDisease.category === "Medium"
                      ? "text-yellow-600 dark:text-yellow-400 bg-yellow-500/10"
                      : "text-emerald-600 dark:text-emerald-400 bg-emerald-500/10"
                  }`}
                >
                  {results.heartDisease.category === "High" ? t.highRisk : results.heartDisease.category === "Medium" ? t.medRisk : t.lowRisk}
                </span>
              </div>
              <div className="mt-3 flex items-baseline gap-1">
                <span className="text-3xl font-extrabold text-slate-900 dark:text-white">{results.heartDisease.probability}%</span>
                <span className="text-[10px] text-slate-400 dark:text-slate-500 font-mono">risk coefficient</span>
              </div>

              {/* Mini SHAP plotter */}
              <div className="mt-5 space-y-3">
                <span className="text-[10px] uppercase font-bold tracking-wider text-blue-650 dark:text-blue-400 block pb-1 border-b border-slate-200 dark:border-slate-800/60">
                  {t.shapTitle}
                </span>
                {results.heartDisease.shapValue?.map((v, i) => (
                  <div key={i} className="space-y-1">
                    <div className="flex justify-between text-[10px] text-slate-500 dark:text-slate-400">
                      <span>{v.feature}</span>
                      <span className={v.impact > 0 ? "text-rose-600 dark:text-rose-400 font-mono" : "text-emerald-600 dark:text-emerald-400 font-mono"}>
                        {v.impact > 0 ? `+${v.impact}%` : `${v.impact}%`}
                      </span>
                    </div>
                    <div className="h-1.5 bg-slate-100 dark:bg-slate-900 rounded-full overflow-hidden flex">
                      {v.impact > 0 ? (
                        <div className="h-full bg-rose-500" style={{ width: `${Math.min(100, v.impact * 2)}%` }} />
                      ) : (
                        <div className="h-full bg-emerald-400" style={{ width: `${Math.min(100, Math.abs(v.impact) * 2)}%` }} />
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Hypertension Risk Box */}
            <div className="bg-white dark:bg-slate-950 p-4 rounded-lg border border-slate-200 dark:border-slate-800/85 shadow-sm">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">{t.hypertensionRisk}</span>
                <span
                  className={`text-xs px-2 py-0.5 rounded uppercase font-bold ${
                    results.hypertension.category === "High"
                      ? "text-rose-600 dark:text-rose-400 bg-rose-500/10"
                      : results.hypertension.category === "Medium"
                      ? "text-yellow-600 dark:text-yellow-400 bg-yellow-500/10"
                      : "text-emerald-600 dark:text-emerald-400 bg-emerald-500/10"
                  }`}
                >
                  {results.hypertension.category === "High" ? t.highRisk : results.hypertension.category === "Medium" ? t.medRisk : t.lowRisk}
                </span>
              </div>
              <div className="mt-3 flex items-baseline gap-1">
                <span className="text-3xl font-extrabold text-slate-900 dark:text-white">{results.hypertension.probability}%</span>
                <span className="text-[10px] text-slate-400 dark:text-slate-500 font-mono">risk coefficient</span>
              </div>

              {/* Mini SHAP plotter */}
              <div className="mt-5 space-y-3">
                <span className="text-[10px] uppercase font-bold tracking-wider text-blue-650 dark:text-blue-400 block pb-1 border-b border-slate-200 dark:border-slate-800/60">
                  {t.shapTitle}
                </span>
                {results.hypertension.shapValue?.map((v, i) => (
                  <div key={i} className="space-y-1">
                    <div className="flex justify-between text-[10px] text-slate-500 dark:text-slate-400">
                      <span>{v.feature}</span>
                      <span className={v.impact > 0 ? "text-rose-600 dark:text-rose-400 font-mono" : "text-emerald-600 dark:text-emerald-400 font-mono"}>
                        {v.impact > 0 ? `+${v.impact}%` : `${v.impact}%`}
                      </span>
                    </div>
                    <div className="h-1.5 bg-slate-100 dark:bg-slate-900 rounded-full overflow-hidden flex">
                      {v.impact > 0 ? (
                        <div className="h-full bg-rose-500" style={{ width: `${Math.min(100, v.impact * 2)}%` }} />
                      ) : (
                        <div className="h-full bg-emerald-400" style={{ width: `${Math.min(100, Math.abs(v.impact) * 2)}%` }} />
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}
