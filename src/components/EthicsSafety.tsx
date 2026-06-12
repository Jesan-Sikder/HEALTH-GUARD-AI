/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { translations } from "../data/localization";
import { ShieldCheck, HeartHandshake, Eye, Scale, HelpCircle } from "lucide-react";

interface EthicsSafetyProps {
  language: "en" | "bn";
}

export default function EthicsSafety({ language }: EthicsSafetyProps) {
  const t = translations[language];

  return (
    <div className="space-y-6" id="ethics-section-container">
      <div className="bg-slate-50 dark:bg-slate-900/40 border border-slate-200/60 dark:border-slate-800 rounded-xl p-6 text-center space-y-1.5 max-w-4xl mx-auto">
        <h2 className="text-2xl font-black text-slate-900 dark:text-white flex items-center justify-center gap-2">
          <ShieldCheck className="w-6 h-6 text-blue-500 animate-pulse" />
          {t.ethicsTitle}
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed">
          {t.ethicsSubtitle}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
        {/* Sovereignty */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-xl p-6 space-y-3 shadow-xs">
          <div className="p-3 bg-blue-500/10 rounded-lg w-fit text-blue-500">
            <Eye className="w-6 h-6" />
          </div>
          <h3 className="text-md font-bold text-slate-900 dark:text-white">{t.p1Title}</h3>
          <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
            {t.p1Desc}
          </p>
        </div>

        {/* Explainable AI */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-xl p-6 space-y-3 shadow-xs">
          <div className="p-3 bg-emerald-500/10 rounded-lg w-fit text-emerald-500">
            <Scale className="w-6 h-6" />
          </div>
          <h3 className="text-md font-bold text-slate-900 dark:text-white">{t.p2Title}</h3>
          <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
            {t.p2Desc}
          </p>
        </div>

        {/* Safety Guards */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-xl p-6 space-y-3 shadow-xs">
          <div className="p-3 bg-rose-500/10 rounded-lg w-fit text-rose-500">
            <HeartHandshake className="w-6 h-6" />
          </div>
          <h3 className="text-md font-bold text-slate-900 dark:text-white">{t.p3Title}</h3>
          <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
            {t.p3Desc}
          </p>
        </div>

        {/* Educational Scope */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-xl p-6 space-y-3 shadow-xs">
          <div className="p-3 bg-blue-500/10 rounded-lg w-fit text-blue-500">
            <HelpCircle className="w-6 h-6" />
          </div>
          <h3 className="text-md font-bold text-slate-900 dark:text-white">{t.p4Title}</h3>
          <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
            {t.p4Desc}
          </p>
        </div>
      </div>
    </div>
  );
}
