/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { PhysicalData, PhysicalRecordResult, RiskPrediction, MentalScreeningData, MentalRecordResult, ScreeningResult } from "../types";

export function calculateBMI(heightCm: number, weightKg: number): number {
  if (!heightCm || heightCm <= 0) return 0;
  const heightM = heightCm / 100;
  return Number((weightKg / (heightM * heightM)).toFixed(1));
}

/**
 * Calculates physical scores using logistics formulas and generates SHAP indicators
 */
export function evaluatePhysicalRisks(data: PhysicalData): PhysicalRecordResult {
  const bmi = calculateBMI(data.height, data.weight);
  const glucoseMgdl = data.glucose * 18.0;

  // --- 1. Diabetes Risk Prediction ---
  // Baseline logit (corresponds to base population risk of ~8%)
  let dbLogit = -2.5;
  dbLogit += (data.age - 35) * 0.035; // older is higher risk
  if (bmi > 24.9) dbLogit += (bmi - 24.9) * 0.18; // strong BMI factor
  if (glucoseMgdl > 99) dbLogit += (glucoseMgdl - 99) * 0.045; // glucose level coupling
  if (data.cholesterol > 200) dbLogit += (data.cholesterol - 200) * 0.01;
  if (data.familyHistory) dbLogit += 1.1; // genetic risk modifier
  dbLogit -= data.exercise * 0.15; // exercise reduces risk
  if (data.smoking === "current") dbLogit += 0.4;

  const dbProb = Math.min(99, Math.max(1, Math.round((1 / (1 + Math.exp(-dbLogit))) * 100)));
  
  // Custom SHAP contributions
  const dbShap: { feature: string; impact: number }[] = [];
  let dbTotalImpact = 0;
  if (bmi > 24.9) {
    const imp = Math.round((bmi - 24.9) * 1.8) + 12;
    dbShap.push({ feature: "Excess Body Mass (BMI)", impact: imp });
    dbTotalImpact += imp;
  }
  if (glucoseMgdl > 99) {
    const imp = Math.round((glucoseMgdl - 99) * 0.45) + 15;
    dbShap.push({ feature: "Fasting Blood Glucose", impact: imp });
    dbTotalImpact += imp;
  }
  if (data.familyHistory) {
    dbShap.push({ feature: "Genetic Predisposition", impact: 24 });
    dbTotalImpact += 24;
  }
  if (data.age > 45) {
    const imp = Math.round((data.age - 45) * 0.6) + 8;
    dbShap.push({ feature: "Age Factor", impact: imp });
    dbTotalImpact += imp;
  }
  if (data.exercise > 0) {
    // negative impact displays as a preventive factor
    dbShap.push({ feature: "Active Exercise Frequency", impact: -(data.exercise * 4) });
  }
  if (data.smoking === "current") {
    dbShap.push({ feature: "Tobacco Consumption", impact: 10 });
    dbTotalImpact += 10;
  }
  
  // Base population risk placeholder if no parameters elevated
  if (dbShap.length === 0 || dbTotalImpact <= 0) {
    dbShap.push({ feature: "Baseline Population Intercept", impact: 8 });
  }

  // --- 2. Heart Disease Risk Prediction ---
  let hdLogit = -3.0; // low baseline risk
  hdLogit += (data.age - 40) * 0.045;
  if (data.systolic > 120) hdLogit += (data.systolic - 120) * 0.035;
  if (data.cholesterol > 190) hdLogit += (data.cholesterol - 190) * 0.015;
  if (data.smoking === "current") hdLogit += 0.9;
  if (data.smoking === "former") hdLogit += 0.3;
  if (data.familyHistory) hdLogit += 0.6;
  hdLogit -= data.exercise * 0.12;
  if (bmi > 25) hdLogit += (bmi - 25) * 0.06;
  if (data.gender === "male") hdLogit += 0.4; // Gender clinical factor

  const hdProb = Math.min(99, Math.max(1, Math.round((1 / (1 + Math.exp(-hdLogit))) * 100)));

  const hdShap: { feature: string; impact: number }[] = [];
  let hdTotalImpact = 0;
  if (data.systolic > 125) {
    const imp = Math.round((data.systolic - 120) * 0.4) + 12;
    hdShap.push({ feature: "Vascular Blood Pressure", impact: imp });
    hdTotalImpact += imp;
  }
  if (data.cholesterol > 200) {
    const imp = Math.round((data.cholesterol - 180) * 0.15) + 8;
    hdShap.push({ feature: "Serum Cholesterol Levels", impact: imp });
    hdTotalImpact += imp;
  }
  if (data.smoking === "current") {
    hdShap.push({ feature: "Active Smoking Status", impact: 22 });
    hdTotalImpact += 22;
  }
  if (data.familyHistory) {
    hdShap.push({ feature: "Cardiovascular Heredity", impact: 14 });
    hdTotalImpact += 14;
  }
  if (data.exercise > 0) {
    hdShap.push({ feature: "Aerobic Heart Exercise Days", impact: -(data.exercise * 3) });
  }
  if (data.gender === "male") {
    hdShap.push({ feature: "Gender Risk Weight", impact: 10 });
    hdTotalImpact += 10;
  }

  if (hdShap.length === 0 || hdTotalImpact <= 0) {
    hdShap.push({ feature: "Baseline Population Intercept", impact: 5 });
  }

  // --- 3. Hypertension Risk Prediction ---
  let htLogit = -2.2;
  htLogit += (data.age - 35) * 0.04;
  if (data.systolic > 120 || data.diastolic > 80) {
    const sysDiff = Math.max(0, data.systolic - 120);
    const diaDiff = Math.max(0, data.diastolic - 80);
    htLogit += (sysDiff * 0.08) + (diaDiff * 0.09);
  }
  if (bmi > 25) htLogit += (bmi - 25) * 0.12;
  if (data.smoking === "current") htLogit += 0.5;
  htLogit -= data.exercise * 0.14;

  const htProb = Math.min(99, Math.max(1, Math.round((1 / (1 + Math.exp(-htLogit))) * 100)));

  const htShap: { feature: string; impact: number }[] = [];
  let htTotalImpact = 0;
  if (data.systolic > 120 || data.diastolic > 80) {
    const imp = Math.min(45, Math.round(((data.systolic - 120) * 0.6) + ((data.diastolic - 80) * 0.7) + 15));
    htShap.push({ feature: "Systolic/Diastolic BP Metrics", impact: imp });
    htTotalImpact += imp;
  }
  if (bmi > 25) {
    const imp = Math.round((bmi - 25) * 1.5) + 10;
    htShap.push({ feature: "Obesity/BMI Attributions", impact: imp });
    htTotalImpact += imp;
  }
  if (data.smoking === "current") {
    htShap.push({ feature: "Nicotine Vasoconstriction", impact: 15 });
    htTotalImpact += 15;
  }
  if (data.exercise > 0) {
    htShap.push({ feature: "Cardioprotective Exercise Habits", impact: -(data.exercise * 4) });
  }

  if (htShap.length === 0 || htTotalImpact <= 0) {
    htShap.push({ feature: "Baseline Population Intercept", impact: 10 });
  }

  // Categories helper
  const getCategory = (prob: number): "Low" | "Medium" | "High" => {
    if (prob < 25) return "Low";
    if (prob < 60) return "Medium";
    return "High";
  };

  const getExplanation = (type: "db" | "hd" | "ht", category: "Low" | "Medium" | "High", prob: number) => {
    if (type === "db") {
      if (category === "Low") return "Your blood glucose, body mass index, and physical habits are in healthy parameters. Keep a balanced nutrition intake.";
      if (category === "Medium") return "Moderate warning indicators found. Check elevated BMI, genetic family background, and avoid simple refined sugars to prevent insulin resistance development.";
      return "Critical elevated indicators! Elevated fasting blood glucose coupled with high metabolic weights. We suggest a professional fasting blood panel check, carb control, and light aerobic cardio.";
    } else if (type === "hd") {
      if (category === "Low") return "Cardiac risk is within optimal bounds. Healthy blood pressure ranges indicate minimal vascular inflammation markers.";
      if (category === "Medium") return "Intermediate cardiovascular warning signs. Contributing indicators include elevated systemic blood pressures and serum cholesterol levels.";
      return "Substantial cardiac burden risk detected! Driven by elevated blood pressure numbers, smoking habits, or family history of cardiac failure. Seek a resting ECG or professional consult.";
    } else {
      if (category === "Low") return "Your resting blood pressure is regular, showing optimal arterial compliance and flexible vasculature.";
      if (category === "Medium") return "Pre-hypertension stages detected. High sodium sensitivity risk is coupled with sedentary work hours. Hydrate and control processed food consumption.";
      return "Severe cardiovascular pressure strain observed! Blood pressure matches Grade 1 or 2 Hypertension criteria. Decrease sodium intake immediately, monitor BP daily, and check with a clinician.";
    }
  };

  const dbCat = getCategory(dbProb);
  const hdCat = getCategory(hdProb);
  const htCat = getCategory(htProb);

  return {
    diabetes: {
      probability: dbProb,
      category: dbCat,
      explanation: getExplanation("db", dbCat, dbProb),
      shapValue: dbShap,
    },
    heartDisease: {
      probability: hdProb,
      category: hdCat,
      explanation: getExplanation("hd", hdCat, hdProb),
      shapValue: hdShap,
    },
    hypertension: {
      probability: htProb,
      category: htCat,
      explanation: getExplanation("ht", htCat, htProb),
      shapValue: htShap,
    },
    bmi,
  };
}

/**
 * Calculates mental scores based on PHQ-9, GAD-7, and PSS-10 scales
 */
export function evaluateMentalScores(data: MentalScreeningData): MentalRecordResult {
  // PHQ-9 calculation (Depression)
  const phq9Score = data.phq9.reduce((a, b) => a + b, 0);
  let phq9Severity: ScreeningResult["severity"] = "Minimal";
  let phq9SevBen: ScreeningResult["severityBengali"] = "ন্যূনতম";
  let phq9Color = "text-green-500 bg-green-50 border-green-200";
  let phq9Recs: string[] = ["Maintain regular relaxation routines.", "Ensure 7-8 hours of healthy sleep", "Take part in routine community interaction."];

  if (phq9Score >= 5 && phq9Score <= 9) {
    phq9Severity = "Mild";
    phq9SevBen = "মৃদু";
    phq9Color = "text-yellow-600 bg-yellow-50 border-yellow-200";
    phq9Recs = ["Implement standard cognitive-behavioral self-help templates.", "Integrate 20 mins of outdoor sunshine walks.", "Limit screen exposure 1 hr before bedtime."];
  } else if (phq9Score >= 10 && phq9Score <= 14) {
    phq9Severity = "Moderate";
    phq9SevBen = "মাঝারি";
    phq9Color = "text-orange-600 bg-orange-50 border-orange-200";
    phq9Recs = ["Practice mindfulness breathing exercises twice daily.", "Consider contacting a qualified wellness counselor.", "Establish regular physical and emotional gratitude logging."];
  } else if (phq9Score >= 15) {
    phq9Severity = "Severe";
    phq9SevBen = "তীব্র";
    phq9Color = "text-red-600 bg-red-50 border-red-200";
    phq9Recs = [
      "Schedule a clinical evaluation with a medical physician or mental specialist.",
      "Inform safe family members of your emotional scores and seek dynamic community support.",
      "Access professional local helpline contact resources (e.g. Call 333 or mental health networks)."
    ];
  }

  // GAD-7 calculation (Anxiety)
  const gad7Score = data.gad7.reduce((a, b) => a + b, 0);
  let gad7Severity: ScreeningResult["severity"] = "Minimal";
  let gad7SevBen: ScreeningResult["severityBengali"] = "ন্যূনতম";
  let gad7Color = "text-green-500 bg-green-50 border-green-200";
  let gad7Recs: string[] = ["Practice deep box-breathing to balance vagal active tones.", "Limit consumption of processed stimulants and nervous system caffeine."];

  if (gad7Score >= 5 && gad7Score <= 9) {
    gad7Severity = "Mild";
    gad7SevBen = "মৃদু";
    gad7Color = "text-yellow-600 bg-yellow-50 border-yellow-200";
    gad7Recs = ["Limit active social media inputs.", "Incorporate progressive somatic muscle relaxation at morning intervals."];
  } else if (gad7Score >= 10 && gad7Score <= 14) {
    gad7Severity = "Moderate";
    gad7SevBen = "মাঝারি";
    gad7Color = "text-orange-600 bg-orange-50 border-orange-200";
    gad7Recs = ["Structure writing out specific worries on paper, then perform logical mitigation.", "Engage in moderate active cardio exercise to release nervous adrenaline."];
  } else if (gad7Score >= 15) {
    gad7Severity = "Severe";
    gad7SevBen = "তীব্র";
    gad7Color = "text-red-600 bg-red-50 border-red-200";
    gad7Recs = [
      "Seek advice from clinical counselor professionals immediately.",
      "Use guided anxiety therapeutic breathing styles (such as 4-7-8 method) under advisor care.",
      "Ensure an active, safe anchor system with trusted friends or supervisors."
    ];
  }

  // PSS-10 calculation (Stress)
  // For PSS: Q4, Q5, Q7, Q8 are reversed. (Indices 3, 4, 6, 7)
  const pssScore = data.pss.reduce((total, val, idx) => {
    if ([3, 4, 6, 7].includes(idx)) {
      return total + (4 - val); // reversed
    }
    return total + val;
  }, 0);

  let pssSeverity: ScreeningResult["severity"] = "Minimal";
  let pssSevBen: ScreeningResult["severityBengali"] = "ন্যূনতম";
  let pssColor = "text-green-500 bg-green-50 border-green-200";
  let pssRecs: string[] = ["Engage in dynamic focus activities.", "Review professional workloads and allocate structured leisure."];

  if (pssScore >= 14 && pssScore <= 26) {
    pssSeverity = "Moderate";
    pssSevBen = "মাঝারি";
    pssColor = "text-yellow-600 bg-yellow-50 border-yellow-200";
    pssRecs = ["Adopt strict stress scheduling controls.", "Utilize dynamic task delegation. Focus on one activity at a time.", "Incorporate herbal green teas or calming auditory assets."];
  } else if (pssScore >= 27) {
    pssSeverity = "Severe";
    pssSevBen = "তীব্র";
    pssColor = "text-red-600 bg-red-50 border-red-200";
    pssRecs = [
      "Radically rebalance routine active obligations.",
      "Discuss clinical mental fatigue and stress prevention with a physician.",
      "Incorporate guided biofeedback and stress relaxation procedures."
    ];
  }

  return {
    phq9: { score: phq9Score, maxScore: 27, severity: phq9Severity, severityBengali: phq9SevBen, color: phq9Color, recommendations: phq9Recs },
    gad7: { score: gad7Score, maxScore: 21, severity: gad7Severity, severityBengali: gad7SevBen, color: gad7Color, recommendations: gad7Recs },
    pss: { score: pssScore, maxScore: 40, severity: pssSeverity, severityBengali: pssSevBen, color: pssColor, recommendations: pssRecs },
  };
}

/**
 * Calculates a composite health score out of 100
 */
export function calculateCombinedGuardScore(
  phys: PhysicalRecordResult | null,
  ment: MentalRecordResult | null
): { score: number; interpretation: "excellent" | "good" | "moderate" | "high" } {
  if (!phys && !ment) {
    return { score: 100, interpretation: "excellent" }; // default healthy base
  }

  let dbPenalty = 0;
  let hdPenalty = 0;
  let htPenalty = 0;
  let bmiPenalty = 0;

  if (phys) {
    dbPenalty = phys.diabetes.probability * 0.25; // max 25 penalty
    hdPenalty = phys.heartDisease.probability * 0.35; // max 35 penalty
    htPenalty = phys.hypertension.probability * 0.20; // max 20 penalty
    if (phys.bmi > 29.9 || phys.bmi < 18.5) {
      bmiPenalty = 8;
    }
  }

  let phqPenalty = 0;
  let gadPenalty = 0;
  let pssPenalty = 0;

  if (ment) {
    phqPenalty = (ment.phq9.score / 27) * 20; // max 20 penalty
    gadPenalty = (ment.gad7.score / 21) * 15; // max 15 penalty
    pssPenalty = (ment.pss.score / 40) * 15; // max 15 penalty
  }

  const totalDeductions = dbPenalty + hdPenalty + htPenalty + bmiPenalty + phqPenalty + gadPenalty + pssPenalty;
  const rawScore = 100 - totalDeductions;
  const finalScore = Math.max(5, Math.min(100, Math.round(rawScore)));

  let interpretation: "excellent" | "good" | "moderate" | "high" = "excellent";
  if (finalScore >= 80) interpretation = "excellent";
  else if (finalScore >= 65) interpretation = "good";
  else if (finalScore >= 45) interpretation = "moderate";
  else interpretation = "high";

  return { score: finalScore, interpretation };
}
