/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { DashboardState, PhysicalData, PhysicalRecordResult, MentalScreeningData, MentalRecordResult, SelectedLanguage } from "./types";
import { translations } from "./data/localization";
import { calculateCombinedGuardScore } from "./utils/healthCalculations";

// Components
import Dashboard from "./components/Dashboard";
import PhysicalRiskForm from "./components/PhysicalRiskForm";
import MentalHealthForm from "./components/MentalHealthForm";
import AICoachChat from "./components/AICoachChat";
import EthicsSafety from "./components/EthicsSafety";
import ReportPDF from "./components/ReportPDF";

// Icons
import { HeartPulse, Activity, Brain, Sparkles, MessageCircle, ShieldAlert, FileText, Languages, Menu, X, CheckSquare, Sun, Moon } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

type ActiveView = "dashboard" | "physical" | "mental" | "coach" | "report" | "ethics";

export default function App() {
  const [language, setLanguage] = useState<SelectedLanguage>("en");
  const [activeView, setActiveView] = useState<ActiveView>("dashboard");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const [theme, setTheme] = useState<"light" | "dark">(() => {
    const stored = localStorage.getItem("theme");
    if (stored === "light" || stored === "dark") return stored;
    return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  });

  // Apply root documentElement theme class and persist to client-side localStorage
  useEffect(() => {
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  };

  const [state, setState] = useState<DashboardState>({
    physical: null,
    physicalResults: null,
    mentalScores: null,
    mentalResults: null,
    healthScore: 100,
    aiInterpretation: null,
  });

  const [interpreting, setInterpreting] = useState(false);

  // Re-calculate composite health score when physical or mental records change
  useEffect(() => {
    if (state.physicalResults || state.mentalResults) {
      const combined = calculateCombinedGuardScore(state.physicalResults, state.mentalResults);
      setState((prev) => ({
        ...prev,
        healthScore: combined.score,
      }));
    }
  }, [state.physicalResults, state.mentalResults]);

  const t = translations[language];

  const handlePhysicalUpdate = (formData: PhysicalData, evaluation: PhysicalRecordResult) => {
    setState((prev) => ({
      ...prev,
      physical: formData,
      physicalResults: evaluation,
      // reset stale AI summaries when inputs alter to preserve consistency
      aiInterpretation: null,
    }));
  };

  const handleMentalUpdate = (scores: MentalScreeningData, results: MentalRecordResult) => {
    setState((prev) => ({
      ...prev,
      mentalScores: scores,
      mentalResults: results,
      aiInterpretation: null,
    }));
  };

  const handleRunAIInterpretation = async () => {
    if (!state.physicalResults) return;
    setInterpreting(true);

    try {
      const response = await fetch("/api/interpret-health", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          biometrics: state.physical,
          risks: state.physicalResults,
          mental: state.mentalResults,
          language,
          overallScore: state.healthScore,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to consult physical interpretation endpoint");
      }

      const data = await response.json();
      setState((prev) => ({
        ...prev,
        aiInterpretation: data.response,
      }));
    } catch (error) {
      console.error(error);
      const errText = language === "bn"
        ? "⚠️ দুঃখিত, আমরা এই মুহূর্তে এআই ইন্টারপ্রিটেশনের সাথে যোগাযোগ করতে পারছি না।"
        : "⚠️ Apologies, we cannot connect with the server AI interpreter at this moment. Please verify your internet connection or active secrets settings.";
      setState((prev) => ({
        ...prev,
        aiInterpretation: errText,
      }));
    } finally {
      setInterpreting(false);
    }
  };

  const toggleLanguage = () => {
    setLanguage((prev) => (prev === "en" ? "bn" : "en"));
  };

  const switchTab = (view: ActiveView) => {
    setActiveView(view);
    setMobileMenuOpen(false);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col font-sans" id="application-layout-root">
      {/* Upper Navigation Rail */}
      <header className="sticky top-0 z-50 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800" id="global-navbar">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            {/* Title / Logo */}
            <div className="flex items-center gap-2 cursor-pointer select-none" onClick={() => switchTab("dashboard")}>
              <div className="p-2 bg-blue-600 rounded-lg text-white">
                <HeartPulse className="w-5 h-5" />
              </div>
              <div>
                <span className="font-black text-md text-slate-900 dark:text-white uppercase tracking-wider block">
                  {t.title}
                </span>
                <span className="text-[9px] text-slate-400 font-bold uppercase tracking-widest block leading-none">
                  IEEE INNOVATION LABS
                </span>
              </div>
            </div>

            {/* Language switch + nav block */}
            <div className="hidden md:flex items-center space-x-1.5">
              <button
                type="button"
                id="btn-nav-dashboard"
                onClick={() => switchTab("dashboard")}
                className={`px-3 py-2 rounded-lg text-xs font-semibold tracking-wide transition cursor-pointer ${
                  activeView === "dashboard"
                    ? "bg-blue-50 dark:bg-blue-950/20 text-blue-600 dark:text-blue-400"
                    : "text-slate-600 dark:text-slate-400 hover:text-slate-800"
                }`}
              >
                {t.navDashboard}
              </button>
              <button
                type="button"
                id="btn-nav-physical"
                onClick={() => switchTab("physical")}
                className={`px-3 py-2 rounded-lg text-xs font-semibold tracking-wide transition cursor-pointer ${
                  activeView === "physical"
                    ? "bg-blue-50 dark:bg-blue-950/20 text-blue-600 dark:text-blue-400"
                    : "text-slate-600 dark:text-slate-400 hover:text-slate-800"
                }`}
              >
                {t.navPhysical}
              </button>
              <button
                type="button"
                id="btn-nav-mental"
                onClick={() => switchTab("mental")}
                className={`px-3 py-2 rounded-lg text-xs font-semibold tracking-wide transition cursor-pointer ${
                  activeView === "mental"
                    ? "bg-blue-50 dark:bg-blue-950/20 text-blue-600 dark:text-blue-400"
                    : "text-slate-600 dark:text-slate-400 hover:text-slate-800"
                }`}
              >
                {t.navMental}
              </button>
              <button
                type="button"
                id="btn-nav-coach"
                onClick={() => switchTab("coach")}
                className={`px-3 py-2 rounded-lg text-xs font-semibold tracking-wide transition cursor-pointer ${
                  activeView === "coach"
                    ? "bg-blue-50 dark:bg-blue-950/20 text-blue-600 dark:text-blue-400"
                    : "text-slate-600 dark:text-slate-400 hover:text-slate-800"
                }`}
              >
                {t.navCoach}
              </button>
              <button
                type="button"
                id="btn-nav-report"
                onClick={() => switchTab("report")}
                className={`px-3 py-2 rounded-lg text-xs font-semibold tracking-wide transition cursor-pointer ${
                  activeView === "report"
                    ? "bg-blue-50 dark:bg-blue-950/20 text-blue-600 dark:text-blue-400"
                    : "text-slate-600 dark:text-slate-400 hover:text-slate-800"
                }`}
              >
                Report PDF
              </button>
              <button
                type="button"
                id="btn-nav-ethics"
                onClick={() => switchTab("ethics")}
                className={`px-3 py-2 rounded-lg text-xs font-semibold tracking-wide transition cursor-pointer ${
                  activeView === "ethics"
                    ? "bg-blue-50 dark:bg-blue-950/20 text-blue-600 dark:text-blue-400"
                    : "text-slate-600 dark:text-slate-400 hover:text-slate-800"
                }`}
              >
                {t.navEthics}
              </button>
            </div>

            {/* Secondary toolbar buttons */}
            <div className="flex items-center gap-2">
              {/* Language Switch */}
              <button
                type="button"
                id="btn-lang-toggle"
                onClick={toggleLanguage}
                className="p-2 border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 rounded-lg text-slate-700 dark:text-slate-300 transition hover:bg-slate-50 flex items-center gap-1 cursor-pointer"
              >
                <Languages className="w-4 h-4 text-blue-500" />
                <span className="text-[11px] font-bold tracking-wide uppercase">
                  {language === "en" ? "বাংলা" : "ENG"}
                </span>
              </button>

              {/* Theme Switch */}
              <button
                type="button"
                id="btn-theme-toggle"
                onClick={toggleTheme}
                className="p-2 border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 rounded-lg text-slate-700 dark:text-slate-300 transition hover:bg-slate-50 flex items-center gap-1.5 cursor-pointer"
                title={theme === "light" ? "Switch to Dark Mode" : "Switch to Light Mode"}
              >
                {theme === "light" ? (
                  <>
                    <Moon className="w-4 h-4 text-blue-500" />
                    <span className="text-[11px] font-bold tracking-wide uppercase">
                      {language === "en" ? "Dark" : "ডার্ক"}
                    </span>
                  </>
                ) : (
                  <>
                    <Sun className="w-4 h-4 text-amber-500" />
                    <span className="text-[11px] font-bold tracking-wide uppercase">
                      {language === "en" ? "Light" : "লাইট"}
                    </span>
                  </>
                )}
              </button>

              {/* Mobile menu trigger */}
              <button
                type="button"
                id="btn-mobile-menu"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 md:hidden text-slate-705 cursor-pointer"
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile dropdown */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-white dark:bg-slate-900 border-t border-slate-200/80 dark:border-slate-800 p-2 space-y-1 block" id="mobile-menu-block">
            <button
              onClick={() => switchTab("dashboard")}
              className="w-full text-left py-2.5 px-3 rounded-lg text-xs font-semibold block bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
            >
              {t.navDashboard}
            </button>
            <button
              onClick={() => switchTab("physical")}
              className="w-full text-left py-2.5 px-3 rounded-lg text-xs font-semibold block text-slate-750"
            >
              {t.navPhysical}
            </button>
            <button
              onClick={() => switchTab("mental")}
              className="w-full text-left py-2.5 px-3 rounded-lg text-xs font-semibold block text-slate-750"
            >
              {t.navMental}
            </button>
            <button
              onClick={() => switchTab("coach")}
              className="w-full text-left py-2.5 px-3 rounded-lg text-xs font-semibold block text-slate-750"
            >
              {t.navCoach}
            </button>
            <button
              onClick={() => switchTab("report")}
              className="w-full text-left py-2.5 px-3 rounded-lg text-xs font-semibold block text-slate-750"
            >
              Report PDF
            </button>
            <button
              onClick={() => switchTab("ethics")}
              className="w-full text-left py-2.5 px-3 rounded-lg text-xs font-semibold block text-slate-750"
            >
              {t.navEthics}
            </button>

            {/* Mobile Theme Toggle */}
            <button
              onClick={() => {
                toggleTheme();
                setMobileMenuOpen(false);
              }}
              className="w-full text-left py-2.5 px-3 rounded-lg text-xs font-semibold flex items-center gap-2 border-t border-slate-100 dark:border-slate-850 pt-3 text-slate-600 dark:text-slate-400"
            >
              {theme === "light" ? (
                <>
                  <Moon className="w-4 h-4 text-blue-500" />
                  <span>{language === "en" ? "Dark Mode" : "ডার্ক মোড সক্রিয় করুন"}</span>
                </>
              ) : (
                <>
                  <Sun className="w-4 h-4 text-amber-500" />
                  <span>{language === "en" ? "Light Mode" : "লাইট মোড সক্রিয় করুন"}</span>
                </>
              )}
            </button>
          </div>
        )}
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8" id="primary-main-viewport">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeView}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.15 }}
          >
            {activeView === "dashboard" && (
              <Dashboard
                language={language}
                state={state}
                onRunInterpretation={handleRunAIInterpretation}
                interpreting={interpreting}
              />
            )}
            {activeView === "physical" && (
              <PhysicalRiskForm
                language={language}
                onUpdate={handlePhysicalUpdate}
                currentData={state.physical}
              />
            )}
            {activeView === "mental" && (
              <MentalHealthForm
                language={language}
                onUpdate={handleMentalUpdate}
                currentData={state.mentalScores}
              />
            )}
            {activeView === "coach" && <AICoachChat language={language} state={state} />}
            {activeView === "report" && <ReportPDF language={language} state={state} />}
            {activeView === "ethics" && <EthicsSafety language={language} />}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Print styles override to prevent headers and side widgets showing when exporting standard sheet */}
      <style>{`
        @media print {
          body {
            background-color: white !important;
            color: black !important;
          }
          header, #global-navbar, button, form, #chatbot-panel-wrapper, #ethics-section-container {
            display: none !important;
          }
          #primary-main-viewport {
            padding: 0 !important;
            margin: 0 !important;
          }
          #print-preview-sheet, .printable-document-sheet {
            border: none !important;
            box-shadow: none !important;
            padding: 0 !important;
            margin: 0 !important;
            width: 100% !important;
            max-width: 100% !important;
          }
          #pdf-interactive-report > div:first-child {
            display: none !important;
          }
        }
      `}</style>

      {/* Global Footer */}
      <footer className="bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 py-6" id="global-footer">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center text-xs text-slate-400 gap-3">
          <div className="font-semibold">{t.title} © 2026. All medical sovereignty preserved.</div>
          <div className="flex gap-4 font-bold text-slate-500">
            <span>IEEE HEALTHCARE DEMO</span>
            <span>-</span>
            <span>EXPLAINABLE AI ENGINE</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
