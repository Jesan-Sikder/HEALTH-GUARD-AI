/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface PhysicalData {
  age: number;
  gender: "male" | "female" | "other";
  height: number; // in cm
  weight: number; // in kg
  systolic: number; // mmHg
  diastolic: number; // mmHg
  glucose: number; // mmol/L
  cholesterol: number; // mg/dL
  smoking: "never" | "former" | "current";
  exercise: number; // days per week (0-7)
  familyHistory: boolean;
}

export interface RiskPrediction {
  probability: number; // percentage (0-100)
  category: "Low" | "Medium" | "High";
  explanation: string;
  shapValue?: { feature: string; impact: number }[]; // SHAP feature contributions
}

export interface PhysicalRecordResult {
  diabetes: RiskPrediction;
  heartDisease: RiskPrediction;
  hypertension: RiskPrediction;
  bmi: number;
}

export interface MentalScreeningData {
  phq9: number[]; // 9 questions (0-3 each)
  gad7: number[]; // 7 questions (0-3 each)
  pss: number[];  // 10 questions (0-4 each)
}

export interface ScreeningResult {
  score: number;
  maxScore: number;
  severity: "Minimal" | "Mild" | "Moderate" | "Severe";
  severityBengali: "ন্যূনতম" | "মৃদু" | "মাঝারি" | "তীব্র";
  color: string;
  recommendations: string[];
}

export interface MentalRecordResult {
  phq9: ScreeningResult;
  gad7: ScreeningResult;
  pss: ScreeningResult;
}

export interface Message {
  sender: "user" | "bot" | "system";
  text: string;
  timestamp: string;
}

export type SelectedLanguage = "en" | "bn";

export interface DashboardState {
  physical: PhysicalData | null;
  physicalResults: PhysicalRecordResult | null;
  mentalScores: MentalScreeningData | null;
  mentalResults: MentalRecordResult | null;
  healthScore: number; // 0 - 100
  aiInterpretation: string | null;
}
