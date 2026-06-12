/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { DashboardState } from "../types";
import { translations } from "../data/localization";
import { Printer, Calendar, ShieldAlert, BadgeCheck } from "lucide-react";

interface ReportPDFProps {
  language: "en" | "bn";
  state: DashboardState;
}

export default function ReportPDF({ language, state }: ReportPDFProps) {
  const t = translations[language];

  const handlePrint = () => {
    window.print();
  };

  const hasData = state.physicalResults || state.mentalResults;

  return (
    <div className="space-y-4" id="pdf-interactive-report">
      <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-xl p-5 shadow-sm max-w-3xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h3 className="font-bold text-slate-900 dark:text-white text-sm">{t.pdfTitle}</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{t.pdfDesc}</p>
        </div>
        <button
          onClick={handlePrint}
          id="btn-print-summary-pdf"
          disabled={!hasData}
          className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white text-xs font-bold rounded-lg cursor-pointer flex items-center gap-2 shadow-xs transition"
        >
          <Printer className="w-4 h-4" />
          {t.printBtn}
        </button>
      </div>

      {/* Printable Sheet View - Styled specially for prints */}
      {hasData ? (
        <div
          className="bg-white dark:bg-slate-900 border border-slate-350 dark:border-slate-800 p-8 rounded-xl max-w-3xl mx-auto space-y-6 text-slate-800 dark:text-slate-200 relative printable-document-sheet shadow-md"
          id="print-preview-sheet"
        >
          {/* Header */}
          <div className="flex justify-between items-start border-b-2 border-blue-600 pb-4">
            <div>
              <h1 className="text-2xl font-black text-blue-600 dark:text-blue-400 uppercase tracking-wider">{t.title}</h1>
              <p className="text-[10px] text-slate-500 dark:text-slate-400 font-bold mt-0.5 uppercase tracking-widest">{t.tagline}</p>
            </div>
            <div className="text-right">
              <span className="text-[10px] bg-blue-50 text-blue-600 font-black px-2.5 py-1 rounded border border-blue-200">
                OFFICIAL REPORT
              </span>
              <p className="text-[9px] text-slate-400 font-mono mt-2 flex items-center justify-end gap-1">
                <Calendar className="w-3 h-3" />
                {new Date().toLocaleDateString(language === "bn" ? "bn-BD" : "en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
            </div>
          </div>

          {/* User Parameters */}
          {state.physical && (
            <div className="bg-slate-50 dark:bg-slate-950 p-4 rounded-lg border border-slate-200/80 dark:border-slate-800 space-y-2.5">
              <span className="text-[9px] font-mono uppercase tracking-widest font-black text-blue-500">{language === "bn" ? "ব্যবহারকারী পরিচিতি ও মেজারমেন্টস" : "User Biometric Profile"}</span>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                <div>
                  <span className="text-slate-400 block text-[10px]">{t.age}:</span>
                  <span className="font-bold text-slate-900 dark:text-slate-100">{state.physical.age} {language === "bn" ? "বছর" : "Years"}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">{t.gender}:</span>
                  <span className="font-bold text-slate-900 dark:text-slate-100 capitalize">{state.physical.gender}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">{t.bmi} (BMI):</span>
                  <span className="font-bold text-slate-900 dark:text-slate-100">{state.physicalResults?.bmi} kg/m²</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">{language === "bn" ? "রক্তচাপ" : "Blood Pressure"}:</span>
                  <span className="font-bold text-slate-900 dark:text-slate-100">{state.physical.systolic}/{state.physical.diastolic} mmHg</span>
                </div>
              </div>
            </div>
          )}

          {/* Score dials */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="border border-slate-200 dark:border-slate-800 p-4 rounded-lg space-y-2">
              <span className="text-[9px] font-mono tracking-wider font-extrabold text-blue-500 block uppercase">
                {t.overallHealthGuardScore}
              </span>
              <div className="flex items-center gap-3">
                <span className="text-4xl font-black text-blue-600 dark:text-blue-400">{state.healthScore}</span>
                <span className="text-xs text-slate-400">/ 100</span>
                <span className="text-[10px] px-2.5 py-1 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold uppercase rounded border border-emerald-500/20">
                  {state.healthScore >= 80
                    ? t.scoreInterpretation.excellent
                    : state.healthScore >= 65
                    ? t.scoreInterpretation.good
                    : state.healthScore >= 45
                    ? t.scoreInterpretation.moderate
                    : t.scoreInterpretation.high}
                </span>
              </div>
            </div>

            <div className="border border-slate-200 dark:border-slate-800 p-4 rounded-lg space-y-1 bg-slate-50 dark:bg-slate-950 flex flex-col justify-center">
              <span className="text-[9px] uppercase font-bold tracking-widest text-slate-400 block">Report Origin</span>
              <span className="text-xs font-semibold text-slate-800 dark:text-slate-200">Local Safe Biometric Sandbox</span>
              <span className="text-[9px] text-slate-400 font-mono">ID: e017aba5-d142-4098-9529-6333bec8b8cc</span>
            </div>
          </div>

          {/* Risk Summaries */}
          {state.physicalResults && (
            <div className="space-y-4">
              <h3 className="text-xs uppercase tracking-widest font-black text-slate-400 border-b border-slate-200 dark:border-slate-800 pb-1.5 pt-2">
                {language === "bn" ? "শারীরিক রোগের ঝুঁকি সূচক" : "Chronic Disease Risk Indices"}
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="border border-slate-100 dark:border-slate-800 p-3 rounded-lg">
                  <span className="text-[10px] text-slate-400 block">{t.diabetesRisk}</span>
                  <span className="text-md font-extrabold text-slate-800 dark:text-slate-100">{state.physicalResults.diabetes.probability}%</span>
                  <span className="text-[9px] bg-slate-100 dark:bg-slate-800 text-slate-500 block px-1.5 py-0.5 rounded uppercase mt-2 w-fit font-bold">
                    {state.physicalResults.diabetes.category}
                  </span>
                </div>
                <div className="border border-slate-100 dark:border-slate-800 p-3 rounded-lg">
                  <span className="text-[10px] text-slate-400 block">{t.heartDiseaseRisk}</span>
                  <span className="text-md font-extrabold text-slate-800 dark:text-slate-100">{state.physicalResults.heartDisease.probability}%</span>
                  <span className="text-[9px] bg-slate-100 dark:bg-slate-800 text-slate-500 block px-1.5 py-0.5 rounded uppercase mt-2 w-fit font-bold">
                    {state.physicalResults.heartDisease.category}
                  </span>
                </div>
                <div className="border border-slate-100 dark:border-slate-800 p-3 rounded-lg">
                  <span className="text-[10px] text-slate-400 block">{t.hypertensionRisk}</span>
                  <span className="text-md font-extrabold text-slate-800 dark:text-slate-100">{state.physicalResults.hypertension.probability}%</span>
                  <span className="text-[9px] bg-slate-100 dark:bg-slate-800 text-slate-500 block px-1.5 py-0.5 rounded uppercase mt-2 w-fit font-bold">
                    {state.physicalResults.hypertension.category}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Mental Summaries */}
          {state.mentalResults && (
            <div className="space-y-4">
              <h3 className="text-xs uppercase tracking-widest font-black text-slate-400 border-b border-slate-200 dark:border-slate-800 pb-1.5">
                {language === "bn" ? "মানসিক স্বাস্থ্য স্ক্রীনিং ফলাফল" : "Mental Health Screenings"}
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="border border-slate-100 dark:border-slate-800 p-3 rounded-lg">
                  <span className="text-[10px] text-slate-400 block">Depression (PHQ-9)</span>
                  <span className="text-md font-extrabold text-slate-800 dark:text-slate-100">{state.mentalResults.phq9.score} / 27</span>
                  <span className="text-[9px] bg-slate-100 dark:bg-slate-800 text-slate-500 block px-1.5 py-0.5 rounded uppercase mt-2 w-fit font-bold">
                    {language === "bn" ? state.mentalResults.phq9.severityBengali : state.mentalResults.phq9.severity}
                  </span>
                </div>
                <div className="border border-slate-100 dark:border-slate-800 p-3 rounded-lg">
                  <span className="text-[10px] text-slate-400 block">Anxiety (GAD-7)</span>
                  <span className="text-md font-extrabold text-slate-800 dark:text-slate-100">{state.mentalResults.gad7.score} / 21</span>
                  <span className="text-[9px] bg-slate-100 dark:bg-slate-800 text-slate-500 block px-1.5 py-0.5 rounded uppercase mt-2 w-fit font-bold">
                    {language === "bn" ? state.mentalResults.gad7.severityBengali : state.mentalResults.gad7.severity}
                  </span>
                </div>
                <div className="border border-slate-100 dark:border-slate-800 p-3 rounded-lg">
                  <span className="text-[10px] text-slate-400 block">Stress (PSS-10)</span>
                  <span className="text-md font-extrabold text-slate-800 dark:text-slate-100">{state.mentalResults.pss.score} / 40</span>
                  <span className="text-[9px] bg-slate-100 dark:bg-slate-800 text-slate-500 block px-1.5 py-0.5 rounded uppercase mt-2 w-fit font-bold">
                    {language === "bn" ? state.mentalResults.pss.severityBengali : state.mentalResults.pss.severity}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* AI Interpretation Logs */}
          {state.aiInterpretation && (
            <div className="space-y-3 bg-blue-50/20 dark:bg-blue-950/20 p-5 rounded-lg border border-blue-100/50 dark:border-blue-950/60 break-inside-avoid">
              <span className="text-[10px] uppercase font-bold tracking-widest text-blue-500 block">
                {t.interpretationTitle}
              </span>
              <p className="text-xs leading-relaxed text-slate-700 dark:text-slate-350 whitespace-pre-wrap">
                {state.aiInterpretation}
              </p>
            </div>
          )}

          {/* Recommendations checklist */}
          <div className="space-y-3 pt-2 break-inside-avoid">
            <span className="text-xs uppercase tracking-widest font-black text-slate-400 border-b border-slate-200 dark:border-slate-800 pb-1.5 block">
              {t.activeRecommendations}
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs text-slate-600 dark:text-slate-400">
              <div className="space-y-2">
                <span className="font-bold text-blue-500 uppercase text-[10px] tracking-wider block">Nutrition & Dietary</span>
                <ul className="space-y-1 list-disc list-inside">
                  <li>{language === "bn" ? "কম কার্বোহাইড্রেট এবং পর্যাপ্ত মেথি ও সুষম শাকসবজি খান।" : "Prioritize low-glycemic carbs, dietary fiber, and leafy greens."}</li>
                  <li>{language === "bn" ? "অতিরিক্ত প্রসেসড লবণ এবং সোডিয়াম গ্রহণ কমিয়ে দিন।" : "Moderate sodium and processed food triggers to reduce vascular load."}</li>
                </ul>
              </div>
              <div className="space-y-2">
                <span className="font-bold text-blue-500 uppercase text-[10px] tracking-wider block">Physical & Mental Wellness</span>
                <ul className="space-y-1 list-disc list-inside">
                  <li>{language === "bn" ? "সপ্তাহে কমপক্ষে ৪ দিন ৩০ মিনিট অ্যারোবিক কার্ডিও করুন।" : "Incorporate weekly active cardio routines (at least 150 minutes)."}</li>
                  <li>{language === "bn" ? "ঘুমানোর পূর্বে মোবাইল বা টেলিভিশন স্ক্রিন বন্ধ রাখুন।" : "Maintain deep sleep hygiene controls and diaphragmatic meditation."}</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Ethics Disclaimer */}
          <div className="pt-6 border-t border-slate-200 dark:border-slate-800 text-[10px] leading-relaxed text-slate-400 flex items-start gap-3 break-inside-avoid">
            <ShieldAlert className="w-5 h-5 text-blue-500 shrink-0" />
            <div>
              <span className="font-black text-slate-500 block uppercase tracking-wider">PREVENTIVE EDUCATIONAL STATEMENT</span>
              {t.disclaimerText} This digital document is dynamically simulated inside browser memory and is stored locally in client space. It does not replace active clinical diagnostic testing, pharmacological prescriptions, or primary physician therapies.
              <div>ID verification sum: e017aba5-d142-4098-9529-6333bec8b8cc</div>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-slate-50 dark:bg-blue-950/20 border border-slate-100 dark:border-slate-800 text-slate-400 dark:text-slate-500 text-xs text-center py-10 rounded-xl">
          {t.needMoreData}
        </div>
      )}
    </div>
  );
}
