/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { MentalScreeningData, ScreeningResult, MentalRecordResult } from "../types";
import { evaluateMentalScores } from "../utils/healthCalculations";
import { translations, PHQ9_QUESTIONS, GAD7_QUESTIONS, PSS_QUESTIONS } from "../data/localization";
import { Brain, Sparkles, ShieldCheck, HelpCircle, CheckCircle, AlertTriangle } from "lucide-react";
import { motion } from "motion/react";

interface MentalHealthFormProps {
  language: "en" | "bn";
  onUpdate: (data: MentalScreeningData, results: MentalRecordResult) => void;
  currentData: MentalScreeningData | null;
}

type ActiveTab = "phq9" | "gad7" | "pss";

export default function MentalHealthForm({ language, onUpdate, currentData }: MentalHealthFormProps) {
  const t = translations[language];

  const [activeTab, setActiveTab] = useState<ActiveTab>("phq9");
  
  const [phq9Answers, setPhq9Answers] = useState<number[]>(currentData?.phq9 || Array(9).fill(0));
  const [gad7Answers, setGad7Answers] = useState<number[]>(currentData?.gad7 || Array(7).fill(0));
  const [pssAnswers, setPssAnswers] = useState<number[]>(currentData?.pss || Array(10).fill(0));

  const [results, setResults] = useState<MentalRecordResult | null>(null);
  const [evaluating, setEvaluating] = useState(false);

  const handlePhqSelect = (qIdx: number, val: number) => {
    const updated = [...phq9Answers];
    updated[qIdx] = val;
    setPhq9Answers(updated);
  };

  const handleGadSelect = (qIdx: number, val: number) => {
    const updated = [...gad7Answers];
    updated[qIdx] = val;
    setGad7Answers(updated);
  };

  const handlePssSelect = (qIdx: number, val: number) => {
    const updated = [...pssAnswers];
    updated[qIdx] = val;
    setPssAnswers(updated);
  };

  const calculateAndSend = () => {
    setEvaluating(true);
    setTimeout(() => {
      const payload: MentalScreeningData = {
        phq9: phq9Answers,
        gad7: gad7Answers,
        pss: pssAnswers,
      };
      const evalResult = evaluateMentalScores(payload);
      setResults(evalResult);
      onUpdate(payload, evalResult);
      setEvaluating(false);
    }, 500);
  };

  // Severity indicator checking
  const isSevereDetected = results && (results.phq9.severity === "Severe" || results.gad7.severity === "Severe");

  return (
    <div className="space-y-6" id="mental-screening-main-container">
      {/* Questionnaire Navigation Header */}
      <div className="flex flex-wrap p-1 gap-1 bg-slate-100 dark:bg-slate-900 rounded-lg max-w-xl">
        <button
          type="button"
          id="btn-tab-phq9"
          onClick={() => setActiveTab("phq9")}
          className={`flex-1 py-2 px-3 text-xs font-semibold rounded-md transition text-center ${
            activeTab === "phq9"
              ? "bg-white dark:bg-slate-800 text-blue-600 dark:text-blue-400 shadow-sm"
              : "text-slate-600 dark:text-slate-400 hover:text-slate-800"
          }`}
        >
          PHQ-9 (Depression)
        </button>
        <button
          type="button"
          id="btn-tab-gad7"
          onClick={() => setActiveTab("gad7")}
          className={`flex-1 py-2 px-3 text-xs font-semibold rounded-md transition text-center ${
            activeTab === "gad7"
              ? "bg-white dark:bg-slate-800 text-blue-600 dark:text-blue-400 shadow-sm"
              : "text-slate-600 dark:text-slate-400 hover:text-slate-800"
          }`}
        >
          GAD-7 (Anxiety)
        </button>
        <button
          type="button"
          id="btn-tab-pss"
          onClick={() => setActiveTab("pss")}
          className={`flex-1 py-2 px-3 text-xs font-semibold rounded-md transition text-center ${
            activeTab === "pss"
              ? "bg-white dark:bg-slate-800 text-blue-600 dark:text-blue-400 shadow-sm"
              : "text-slate-600 dark:text-slate-400 hover:text-slate-800"
          }`}
        >
          PSS-10 (Stress Scale)
        </button>
      </div>

      <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-xl p-6 shadow-sm space-y-6">
        <div className="border-b border-slate-100 dark:border-slate-800 pb-4 space-y-1">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Brain className="w-5 h-5 text-blue-500 animate-pulse" />
            {t.mentalTitle}
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">{t.mentalDesc}</p>
        </div>

        {/* PHQ-9 Screener UI */}
        {activeTab === "phq9" && (
          <div className="space-y-6" id="phq9-questions-list">
            <div className="bg-slate-50 dark:bg-slate-950/40 p-3 rounded-lg border border-slate-200/40 dark:border-slate-800/60 flex items-center gap-2 text-xs font-semibold text-slate-600 dark:text-slate-300">
              <HelpCircle className="w-4 h-4 text-blue-500" />
              {t.phqQuestionHeader}
            </div>

            <div className="space-y-4">
              {PHQ9_QUESTIONS.map((q, idx) => (
                <div key={q.id} className="p-4 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50/20 dark:bg-slate-950/20 space-y-3">
                  <div className="text-sm font-medium text-slate-800 dark:text-slate-200">
                    <span className="font-mono text-blue-500 font-bold mr-1.5">{idx + 1}.</span>
                    {language === "bn" ? q.bn : q.en}
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {[0, 1, 2, 3].map((val) => (
                      <button
                        type="button"
                        id={`btn-phq-q-${idx}-${val}`}
                        key={val}
                        onClick={() => handlePhqSelect(idx, val)}
                        className={`py-2 px-3 rounded-lg border text-xs font-medium transition text-center ${
                          phq9Answers[idx] === val
                            ? "bg-blue-600 border-blue-600 text-white shadow-sm"
                            : "border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 bg-white dark:bg-slate-950 hover:bg-slate-50"
                        }`}
                      >
                        {t.frequencyOpts[val as 0 | 1 | 2 | 3]}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* GAD-7 Screener UI */}
        {activeTab === "gad7" && (
          <div className="space-y-6" id="gad7-questions-list">
            <div className="bg-slate-50 dark:bg-slate-950/40 p-3 rounded-lg border border-slate-200/40 dark:border-slate-800/60 flex items-center gap-2 text-xs font-semibold text-slate-600 dark:text-slate-300">
              <HelpCircle className="w-4 h-4 text-blue-500" />
              {t.gadQuestionHeader}
            </div>

            <div className="space-y-4">
              {GAD7_QUESTIONS.map((q, idx) => (
                <div key={q.id} className="p-4 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50/20 dark:bg-slate-950/20 space-y-3">
                  <div className="text-sm font-medium text-slate-800 dark:text-slate-200">
                    <span className="font-mono text-blue-500 font-bold mr-1.5">{idx + 1}.</span>
                    {language === "bn" ? q.bn : q.en}
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {[0, 1, 2, 3].map((val) => (
                      <button
                        type="button"
                        id={`btn-gad-q-${idx}-${val}`}
                        key={val}
                        onClick={() => handleGadSelect(idx, val)}
                        className={`py-2 px-3 rounded-lg border text-xs font-medium transition text-center ${
                          gad7Answers[idx] === val
                            ? "bg-blue-600 border-blue-600 text-white shadow-sm"
                            : "border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 bg-white dark:bg-slate-950 hover:bg-slate-50"
                        }`}
                      >
                        {t.frequencyOpts[val as 0 | 1 | 2 | 3]}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* PSS-10 Screener UI */}
        {activeTab === "pss" && (
          <div className="space-y-6" id="pss-questions-list">
            <div className="bg-slate-50 dark:bg-slate-950/40 p-3 rounded-lg border border-slate-200/40 dark:border-slate-800/60 flex items-center gap-2 text-xs font-semibold text-slate-600 dark:text-slate-300">
              <HelpCircle className="w-4 h-4 text-blue-500" />
              {t.pssQuestionHeader}
            </div>

            <div className="space-y-4">
              {PSS_QUESTIONS.map((q, idx) => (
                <div key={q.id} className="p-4 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50/20 dark:bg-slate-950/20 space-y-3">
                  <div className="text-sm font-medium text-slate-800 dark:text-slate-200">
                    <span className="font-mono text-blue-500 font-bold mr-1.5">{idx + 1}.</span>
                    {language === "bn" ? q.bn : q.en}
                    {q.reversed && <span className="ml-2 text-[10px] text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded uppercase font-mono">{language === "bn" ? "উল্টো গণনা" : "Reversed Item"}</span>}
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-5 gap-1.5">
                    {[0, 1, 2, 3, 4].map((val) => (
                      <button
                        type="button"
                        id={`btn-pss-q-${idx}-${val}`}
                        key={val}
                        onClick={() => handlePssSelect(idx, val)}
                        className={`py-2 px-1 text-[10px] sm:text-xs font-medium rounded-lg border transition text-center ${
                          pssAnswers[idx] === val
                            ? "bg-blue-600 border-blue-600 text-white shadow-sm"
                            : "border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 bg-white dark:bg-slate-950 hover:bg-slate-50"
                        }`}
                      >
                        {t.pssOpts[val as 0 | 1 | 2 | 3 | 4]}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="flex justify-end pt-2 border-t border-slate-100 dark:border-slate-800">
          <button
            type="button"
            id="btn-evaluate-mental-wellness"
            onClick={calculateAndSend}
            disabled={evaluating}
            className="px-6 py-3 rounded-lg text-white font-medium text-sm transition tracking-wider flex items-center gap-2 cursor-pointer bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 shadow shadow-blue-600/30 disabled:opacity-50"
          >
            {evaluating ? t.evaluating : t.submitMental}
          </button>
        </div>
      </div>

      {/* Renders clinically designed results block */}
      {results && (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-5"
          id="mental-results-block"
        >
          {/* PHQ-9 Status */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-xl p-5 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs uppercase tracking-widest font-bold text-slate-400">PHQ-9 Depression</span>
              <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase ${results.phq9.color.split(" ")[0]} ${results.phq9.color.split(" ")[1]}`}>
                {language === "bn" ? results.phq9.severityBengali : results.phq9.severity}
              </span>
            </div>
            <div className="flex items-baseline gap-1">
              <span className="text-4xl font-extrabold text-slate-900 dark:text-white">{results.phq9.score}</span>
              <span className="text-xs text-slate-400">/ 27</span>
            </div>
            <div className="space-y-1.5 pt-2 border-t border-slate-50 dark:border-slate-800/40">
              <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block">{t.recommendationsLabel}</span>
              <ul className="space-y-1 text-xs text-slate-600 dark:text-slate-400 list-disc list-inside">
                {results.phq9.recommendations.map((rec, i) => (
                  <li key={i}>{rec}</li>
                ))}
              </ul>
            </div>
          </div>

          {/* GAD-7 Status */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-xl p-5 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs uppercase tracking-widest font-bold text-slate-400">GAD-7 Anxiety</span>
              <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase ${results.gad7.color.split(" ")[0]} ${results.gad7.color.split(" ")[1]}`}>
                {language === "bn" ? results.gad7.severityBengali : results.gad7.severity}
              </span>
            </div>
            <div className="flex items-baseline gap-1">
              <span className="text-4xl font-extrabold text-slate-900 dark:text-white">{results.gad7.score}</span>
              <span className="text-xs text-slate-400">/ 21</span>
            </div>
            <div className="space-y-1.5 pt-2 border-t border-slate-50 dark:border-slate-800/40">
              <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block">{t.recommendationsLabel}</span>
              <ul className="space-y-1 text-xs text-slate-600 dark:text-slate-400 list-disc list-inside">
                {results.gad7.recommendations.map((rec, i) => (
                  <li key={i}>{rec}</li>
                ))}
              </ul>
            </div>
          </div>

          {/* PSS Stress Status */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-xl p-5 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs uppercase tracking-widest font-bold text-slate-400">PSS-10 Stress</span>
              <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase ${results.pss.color.split(" ")[0]} ${results.pss.color.split(" ")[1]}`}>
                {language === "bn" ? results.pss.severityBengali : results.pss.severity}
              </span>
            </div>
            <div className="flex items-baseline gap-1">
              <span className="text-4xl font-extrabold text-slate-900 dark:text-white">{results.pss.score}</span>
              <span className="text-xs text-slate-400">/ 40</span>
            </div>
            <div className="space-y-1.5 pt-2 border-t border-slate-50 dark:border-slate-800/40">
              <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block">{t.recommendationsLabel}</span>
              <ul className="space-y-1 text-xs text-slate-600 dark:text-slate-400 list-disc list-inside">
                {results.pss.recommendations.map((rec, i) => (
                  <li key={i}>{rec}</li>
                ))}
              </ul>
            </div>
          </div>
        </motion.div>
      )}

      {/* Critical clinical severity safety popup */}
      {isSevereDetected && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-rose-50 border border-rose-200 rounded-xl p-5 text-rose-800 space-y-3 shadow-lg flex items-start gap-4"
          id="critical-clinical-safety-alert"
        >
          <AlertTriangle className="w-8 h-8 text-rose-600 shrink-0 mt-0.5 animate-bounce" />
          <div className="space-y-1.5">
            <h4 className="text-sm font-black uppercase tracking-wider text-rose-900">{t.severeAlert}</h4>
            <p className="text-xs leading-relaxed font-semibold">{t.severeDetails}</p>
            <div className="grid grid-cols-1 gap-3 text-[11px] font-bold mt-3">
              <div className="bg-white/80 p-2 rounded border border-rose-200 text-center text-rose-800">
                {language === "bn" 
                  ? "দয়া করে অবিলম্বে আপনার নিকটস্থ কোনো বড় হাসপাতাল বা মানসিক রোগ বিশেষজ্ঞ চিকিৎসকের সহায়তা গ্রহণ করুন।" 
                  : "Please contact your nearest hospital, emergency medical services, or registered clinical counselor immediately."}
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}
