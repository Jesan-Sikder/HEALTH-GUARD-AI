/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { DashboardState, SelectedLanguage } from "../types";
import { translations } from "../data/localization";
import { calculateCombinedGuardScore } from "../utils/healthCalculations";
import { HelpCircle, Star, BadgeCheck, Flame, Dumbbell, ShieldAlert, Sparkles, Brain, Activity, ArrowRight, HeartPulse } from "lucide-react";
import { motion } from "motion/react";

interface DashboardProps {
  language: "en" | "bn";
  state: DashboardState;
  onRunInterpretation: () => Promise<void>;
  interpreting: boolean;
}

export default function Dashboard({ language, state, onRunInterpretation, interpreting }: DashboardProps) {
  const t = translations[language];

  const hasPhysical = !!state.physicalResults;
  const hasMental = !!state.mentalResults;

  // Compute overall score dynamically based on state
  const guardCalc = calculateCombinedGuardScore(state.physicalResults, state.mentalResults);
  const guardScore = state.physicalResults || state.mentalResults ? guardCalc.score : null;
  const interpretationText = state.physicalResults || state.mentalResults ? guardCalc.interpretation : null;

  // Custom circular dial calculations for score display
  const radius = 60;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = guardScore !== null ? circumference - (guardScore / 100) * circumference : circumference;

  return (
    <div className="space-y-6" id="dashboard-bento-grid">
      {/* 1. Hero Welcomer and combined HealthGuard Score Meter */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-gradient-to-r from-blue-900 via-blue-950 to-slate-950 text-white rounded-2xl p-6 shadow-sm flex flex-col justify-between space-y-4">
          <div className="space-y-2">
            <div className="bg-blue-500/20 text-blue-300 border border-blue-500/20 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest w-fit">
              {t.latestAssessment}
            </div>
            <h2 className="text-2xl font-black leading-tight sm:text-3xl">
              {language === "bn" ? "আসসালামু আলাইকুম, স্বাগতম!" : "Dynamic Health Sentinel Active"}
            </h2>
            <p className="text-xs text-blue-200/80 max-w-xl leading-relaxed">
              {t.tagline}. {language === "bn" ? "আপনার সকল ডায়াগনস্টিক গতিবিধি লোকাল ডিভাইসেই থাকবে অন্য কোথাও পাঠানো হবে না।" : "Your biometrics and screeners remain secure on our client-side sandbox. Run comprehensive assessments below."}
            </p>
          </div>

          <div className="flex flex-wrap gap-4 text-xs font-bold pt-2 border-t border-blue-800/40">
            <span className="flex items-center gap-1.5 text-blue-300">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              Explainable AI (SHAP) Active
            </span>
            <span className="flex items-center gap-1.5 text-blue-300">
              <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" />
              Full Translation Service Ready
            </span>
          </div>
        </div>

        {/* HealthGuard Score Meter ring */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-6 shadow-sm flex flex-col items-center justify-center text-center space-y-4">
          <span className="text-xs uppercase font-bold tracking-widest text-slate-400 block">
            {t.overallHealthGuardScore}
          </span>

          {guardScore !== null ? (
            <div className="relative flex items-center justify-center">
              <svg className="w-36 h-36 transform -rotate-90">
                {/* Background Ring */}
                <circle
                  cx="72"
                  cy="72"
                  r={radius}
                  className="stroke-slate-100 dark:stroke-slate-800 fill-none"
                  strokeWidth="12"
                />
                {/* Active Ring */}
                <circle
                  cx="72"
                  cy="72"
                  r={radius}
                  stroke="url(#blue-grad)"
                  className="fill-none transition-all duration-1000 ease-out"
                  strokeWidth="12"
                  strokeDasharray={circumference}
                  strokeDashoffset={strokeDashoffset}
                  strokeLinecap="round"
                />
                <defs>
                  <linearGradient id="blue-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#2563eb" />
                    <stop offset="100%" stopColor="#3b82f6" />
                  </linearGradient>
                </defs>
              </svg>
              {/* Inner score */}
              <div className="absolute flex flex-col items-center">
                <span className="text-4xl font-black text-slate-900 dark:text-white">{guardScore}</span>
                <span className="text-[10px] text-slate-400 font-bold uppercase py-0.5 px-2 bg-slate-50 dark:bg-slate-950 border border-slate-200/40 dark:border-slate-800/60 rounded">
                  {interpretationText === "excellent"
                    ? t.scoreInterpretation.excellent
                    : interpretationText === "good"
                    ? t.scoreInterpretation.good
                    : interpretationText === "moderate"
                    ? t.scoreInterpretation.moderate
                    : t.scoreInterpretation.high}
                </span>
              </div>
            </div>
          ) : (
            <div className="py-8 text-xs text-slate-400 dark:text-slate-500 max-w-[200px] leading-relaxed select-none">
              {t.enterDataToCalculate}
            </div>
          )}
        </div>
      </div>

      {/* 2. Bento Grid of Indicators */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-slate-400">
          <Activity className="w-4 h-4 text-blue-500" />
          {t.summaryCardsTitle}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {/* Diabetes Card */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 p-5 rounded-xl shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-400 select-none">{t.diabetesRisk}</span>
              <span className="p-1.5 bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 rounded-lg">
                <HeartPulse className="w-4 h-4" />
              </span>
            </div>
            {state.physicalResults ? (
              <div className="space-y-1">
                <div className="flex items-baseline gap-1">
                  <span className="text-3xl font-extrabold text-slate-900 dark:text-white">{state.physicalResults.diabetes.probability}%</span>
                  <span className="text-[10px] text-slate-400">{t.riskScale}</span>
                </div>
                <div className="h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden block">
                  <div
                    className={`h-full rounded-full ${
                      state.physicalResults.diabetes.category === "High"
                        ? "bg-rose-500"
                        : state.physicalResults.diabetes.category === "Medium"
                        ? "bg-yellow-500"
                        : "bg-emerald-500"
                    }`}
                    style={{ width: `${state.physicalResults.diabetes.probability}%` }}
                  />
                </div>
                <span className="text-[9px] uppercase font-bold text-slate-400 block pt-1">
                  {language === "bn"
                    ? state.physicalResults.diabetes.category === "High"
                      ? t.highRisk
                      : state.physicalResults.diabetes.category === "Medium"
                      ? t.medRisk
                      : t.lowRisk
                    : state.physicalResults.diabetes.category}
                </span>
              </div>
            ) : (
              <div className="text-xs text-slate-400 select-none italic pt-2">{t.enterDataToCalculate}</div>
            )}
          </div>

          {/* Heart Disease Card */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 p-5 rounded-xl shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-400 select-none">{t.heartDiseaseRisk}</span>
              <span className="p-1.5 bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 rounded-lg">
                <HeartPulse className="w-4 h-4" />
              </span>
            </div>
            {state.physicalResults ? (
              <div className="space-y-1">
                <div className="flex items-baseline gap-1">
                  <span className="text-3xl font-extrabold text-slate-900 dark:text-white">{state.physicalResults.heartDisease.probability}%</span>
                  <span className="text-[10px] text-slate-400">{t.riskScale}</span>
                </div>
                <div className="h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden block">
                  <div
                    className={`h-full rounded-full ${
                      state.physicalResults.heartDisease.category === "High"
                        ? "bg-rose-500"
                        : state.physicalResults.heartDisease.category === "Medium"
                        ? "bg-yellow-500"
                        : "bg-emerald-500"
                    }`}
                    style={{ width: `${state.physicalResults.heartDisease.probability}%` }}
                  />
                </div>
                <span className="text-[9px] uppercase font-bold text-slate-400 block pt-1">
                  {language === "bn"
                    ? state.physicalResults.heartDisease.category === "High"
                      ? t.highRisk
                      : state.physicalResults.heartDisease.category === "Medium"
                      ? t.medRisk
                      : t.lowRisk
                    : state.physicalResults.heartDisease.category}
                </span>
              </div>
            ) : (
              <div className="text-xs text-slate-400 select-none italic pt-2">{t.enterDataToCalculate}</div>
            )}
          </div>

          {/* Hypertension Card */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 p-5 rounded-xl shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-400 select-none">{t.hypertensionRisk}</span>
              <span className="p-1.5 bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 rounded-lg">
                <HeartPulse className="w-4 h-4" />
              </span>
            </div>
            {state.physicalResults ? (
              <div className="space-y-1">
                <div className="flex items-baseline gap-1">
                  <span className="text-3xl font-extrabold text-slate-900 dark:text-white">{state.physicalResults.hypertension.probability}%</span>
                  <span className="text-[10px] text-slate-400">{t.riskScale}</span>
                </div>
                <div className="h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden block">
                  <div
                    className={`h-full rounded-full ${
                      state.physicalResults.hypertension.category === "High"
                        ? "bg-rose-500"
                        : state.physicalResults.hypertension.category === "Medium"
                        ? "bg-yellow-500"
                        : "bg-emerald-500"
                    }`}
                    style={{ width: `${state.physicalResults.hypertension.probability}%` }}
                  />
                </div>
                <span className="text-[9px] uppercase font-bold text-slate-400 block pt-1">
                  {language === "bn"
                    ? state.physicalResults.hypertension.category === "High"
                      ? t.highRisk
                      : state.physicalResults.hypertension.category === "Medium"
                      ? t.medRisk
                      : t.lowRisk
                    : state.physicalResults.hypertension.category}
                </span>
              </div>
            ) : (
              <div className="text-xs text-slate-400 select-none italic pt-2">{t.enterDataToCalculate}</div>
            )}
          </div>

          {/* Depression score (PHQ9) */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 p-5 rounded-xl shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-400 select-none">{t.depressionScore}</span>
              <span className="p-1.5 bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 rounded-lg">
                <Brain className="w-4 h-4" />
              </span>
            </div>
            {state.mentalResults ? (
              <div className="space-y-1">
                <div className="flex items-baseline gap-1">
                  <span className="text-3xl font-extrabold text-slate-900 dark:text-white">{state.mentalResults.phq9.score}</span>
                  <span className="text-xs text-slate-400">/ 27</span>
                </div>
                <div className="h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden block">
                  <div
                    className={`h-full rounded-full ${
                      state.mentalResults.phq9.severity === "Severe"
                        ? "bg-rose-500"
                        : state.mentalResults.phq9.severity === "Moderate"
                        ? "bg-orange-500"
                        : state.mentalResults.phq9.severity === "Mild"
                        ? "bg-yellow-500"
                        : "bg-emerald-500"
                    }`}
                    style={{ width: `${(state.mentalResults.phq9.score / 27) * 100}%` }}
                  />
                </div>
                <span className="text-[9px] uppercase font-bold text-slate-400 block pt-1">
                  {language === "bn" ? state.mentalResults.phq9.severityBengali : state.mentalResults.phq9.severity}
                </span>
              </div>
            ) : (
              <div className="text-xs text-slate-400 select-none italic pt-2">{t.enterDataToCalculate}</div>
            )}
          </div>

          {/* Anxiety score (GAD7) */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 p-5 rounded-xl shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-400 select-none">{t.anxietyScore}</span>
              <span className="p-1.5 bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 rounded-lg">
                <Brain className="w-4 h-4" />
              </span>
            </div>
            {state.mentalResults ? (
              <div className="space-y-1">
                <div className="flex items-baseline gap-1">
                  <span className="text-3xl font-extrabold text-slate-900 dark:text-white">{state.mentalResults.gad7.score}</span>
                  <span className="text-xs text-slate-400">/ 21</span>
                </div>
                <div className="h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden block">
                  <div
                    className={`h-full rounded-full ${
                      state.mentalResults.gad7.severity === "Severe"
                        ? "bg-rose-500"
                        : state.mentalResults.gad7.severity === "Moderate"
                        ? "bg-orange-500"
                        : state.mentalResults.gad7.severity === "Mild"
                        ? "bg-yellow-500"
                        : "bg-emerald-500"
                    }`}
                    style={{ width: `${(state.mentalResults.gad7.score / 21) * 100}%` }}
                  />
                </div>
                <span className="text-[9px] uppercase font-bold text-slate-400 block pt-1">
                  {language === "bn" ? state.mentalResults.gad7.severityBengali : state.mentalResults.gad7.severity}
                </span>
              </div>
            ) : (
              <div className="text-xs text-slate-400 select-none italic pt-2">{t.enterDataToCalculate}</div>
            )}
          </div>

          {/* Stress score (PSS) */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 p-5 rounded-xl shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-400 select-none">{t.stressScore}</span>
              <span className="p-1.5 bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 rounded-lg">
                <Brain className="w-4 h-4" />
              </span>
            </div>
            {state.mentalResults ? (
              <div className="space-y-1">
                <div className="flex items-baseline gap-1">
                  <span className="text-3xl font-extrabold text-slate-900 dark:text-white">{state.mentalResults.pss.score}</span>
                  <span className="text-xs text-slate-400">/ 40</span>
                </div>
                <div className="h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden block">
                  <div
                    className={`h-full rounded-full ${
                      state.mentalResults.pss.severity === "Severe"
                        ? "bg-rose-500"
                        : state.mentalResults.pss.severity === "Moderate"
                        ? "bg-orange-500"
                        : "bg-emerald-500"
                    }`}
                    style={{ width: `${(state.mentalResults.pss.score / 40) * 100}%` }}
                  />
                </div>
                <span className="text-[9px] uppercase font-bold text-slate-400 block pt-1">
                  {language === "bn" ? state.mentalResults.pss.severityBengali : state.mentalResults.pss.severity}
                </span>
              </div>
            ) : (
              <div className="text-xs text-slate-400 select-none italic pt-2">{t.enterDataToCalculate}</div>
            )}
          </div>
        </div>
      </div>

      {/* 3. AI Interpreter section with Gemini client synthesis */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-6">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-blue-500 animate-pulse" />
            <h3 className="font-extrabold text-slate-900 dark:text-white text-md">
              {t.interpreterTitle}
            </h3>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400">{t.interpreterSubtitle}. {t.howItWorks}</p>
        </div>

        {/* Trigger button */}
        <div className="flex border-b border-slate-100 dark:border-slate-800 pb-5">
          <button
            type="button"
            id="btn-trigger-ai-interpretation"
            onClick={onRunInterpretation}
            disabled={interpreting || !hasPhysical}
            className="w-full sm:w-auto px-6 py-3 cursor-pointer bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 shadow-sm text-white text-xs font-bold rounded-lg transition disabled:opacity-40 flex items-center justify-center gap-2"
          >
            {interpreting ? t.interpreting : t.explainBtn}
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* Output */}
        {state.aiInterpretation && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            <div className="bg-blue-50/20 dark:bg-blue-950/15 border border-blue-100/50 dark:border-blue-950/60 rounded-xl p-5 space-y-4">
              <div className="flex items-center justify-between border-b border-blue-100/30 dark:border-blue-950/30 pb-3">
                <span className="text-[11px] font-black uppercase tracking-widest text-blue-600 dark:text-blue-400">
                  {t.interpretationTitle}
                </span>
                <span className="text-[9px] font-bold py-0.5 px-2 bg-blue-500/10 text-blue-500 rounded border border-blue-500/20">
                  LIVE INTERPRETATION
                </span>
              </div>
              <p className="text-xs leading-relaxed text-slate-850 dark:text-slate-200 whitespace-pre-wrap select-text markdown-body">
                {state.aiInterpretation}
              </p>
            </div>

            {/* Disclaimer at bottom */}
            <div className="p-3.5 bg-slate-50 dark:bg-slate-950 border border-slate-250/50 dark:border-slate-800/60 rounded-lg text-[10px] text-slate-500 dark:text-slate-400 flex items-start gap-2.5">
              <ShieldAlert className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-slate-700 dark:text-slate-300 mr-1">{t.overallWellnessIndex} Disclaimer:</span>
                {t.disclaimerText}
              </div>
            </div>
          </motion.div>
        )}
      </div>

      {/* 4. Recommendations panel */}
      {hasPhysical && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 text-white space-y-4">
          <h3 className="font-bold text-sm tracking-wide flex items-center gap-2 text-slate-300">
            <BadgeCheck className="w-5 h-5 text-emerald-400" />
            {t.activeRecommendations}
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs pt-2">
            <div className="space-y-2 bg-slate-950 p-4 rounded-xl border border-slate-850">
              <span className="font-bold text-[10px] uppercase tracking-wider text-blue-400 flex items-center gap-1">
                <Flame className="w-3.5 h-3.5 text-orange-500" />
                Nutrition and Diet
              </span>
              <ul className="space-y-1.5 list-disc list-inside text-slate-300 leading-relaxed font-medium">
                <li>{language === "bn" ? "চিনিযুক্ত ও উচ্চ গ্লাইসেমিক শর্করার খাবার বা ময়দা জাতীয় খাদ্য এড়িয়ে চলুন।" : "Eliminate high glycemic loads and refined bakery goods."}</li>
                <li>{language === "bn" ? "প্রসেসড ফাস্টফুড এবং অতিরিক্ত ভাজা পোড়া খাওয়া নিয়ত কম রাখুন।" : "Limit deep-fried foods and prioritize high quality fibers."}</li>
                {state.physicalResults?.diabetes.category === "High" && (
                  <li className="text-yellow-400 font-bold">{language === "bn" ? "শর্করার পরিমাণ দৈনিক ২০ গ্রামের নিচে নামিয়ে ফেলুন।" : "Keep simple sugar intake below 15g per day."}</li>
                )}
              </ul>
            </div>

            <div className="space-y-2 bg-slate-950 p-4 rounded-xl border border-slate-850">
              <span className="font-bold text-[10px] uppercase tracking-wider text-blue-400 flex items-center gap-1">
                <Dumbbell className="w-3.5 h-3.5 text-blue-400" />
                Exercise Routine
              </span>
              <ul className="space-y-1.5 list-disc list-inside text-slate-300 leading-relaxed font-medium">
                <li>{language === "bn" ? "সপ্তাহে কমপক্ষে ৪ দিন ৩০ মিনিট ধরে অ্যারোবিক ঘাম ঝরানো কসরত করুন।" : "Conduct routine aerobic drills—at least 150 minutes per week."}</li>
                <li>{language === "bn" ? "অফিসে একটানা বসে না থেকে প্রতি ১ ঘণ্টায় ৫ মিনিট একটু হেঁটে আসুন।" : "Take a short active stroll every 60 minutes of desk work."}</li>
              </ul>
            </div>

            <div className="space-y-2 bg-slate-950 p-4 rounded-xl border border-slate-850">
              <span className="font-bold text-[10px] uppercase tracking-wider text-blue-400 flex items-center gap-1">
                <Brain className="w-3.5 h-3.5 text-rose-400 animate-pulse" />
                Sleep & Mental Wellness
              </span>
              <ul className="space-y-1.5 list-disc list-inside text-slate-300 leading-relaxed font-medium">
                <li>{language === "bn" ? "ঘুমানোর কমপক্ষে ১ ঘণ্টা পূর্বে ফোনের স্ক্রিন ব্যবহার করা পরিহার করুন।" : "Avoid mobile screens at least 60 minutes before bedtime."}</li>
                <li>{language === "bn" ? "দৈনিক ১০ মিনিট ডায়াফ্রামাটিক শ্বাসের ব্যায়াম করুন।" : "Practice diaphragmatic box-breathing to balance cardiac strain."}</li>
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
