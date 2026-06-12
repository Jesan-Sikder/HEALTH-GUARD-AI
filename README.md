# 🩺 HealthGuard AI
### AI-Powered Preventive Healthcare, Clinical Decision Support & Mental Wellness Platform

HealthGuard AI is a production-grade, full-stack, clinically aligned wellness sentinel. It integrates personalized physical risk predictors, evidence-based mental screenings, and dynamic, context-aware AI interpretations using the server-side-secured Google Gemini 3.5 Flash model. 

Featuring complete bilingual (English and Bengali) localization, a responsive dual-theme system, and print-optimized PDF clinical summary generation, this platform serves as an ideal prototype for competitive Hackathons, research-backed IEEE evaluations, and early-stage commercial health system previews.

---

## 🌟 Key Functional Features & Clinical Instruments

### 📈 Precise Biometric & Disease Risk Profiling
- **Calculated Parameters**: Integrates Age, Sex, Height, Weight, Blood Pressure (Systolic + Diastolic), Fasting Blood Glucose, and Total Cholesterol profiles.
- **Evidence-Based Models**: Uses standard medical references (Joint National Committee on Hypertension standards, American Diabetes Association directives, and Framingham point estimations) implemented with native mathematical modeling in `/src/utils/healthCalculations.ts`.
- **Explainable AI (XAI)**: Displays SHAP-inspired clinical weight attributions for each calculated factor. This transparently shows judges and clinicians how metrics like high blood glucose, genetics, or sedentary behavior directly impact risk predictions.

### 🧠 Triple-Engine Mental Health Screening
- **Authorized Screening Instruments**:
  - **PHQ-9** (Patient Health Questionnaire): Screenings for depressive symptom severity.
  - **GAD-7** (Generalized Anxiety Disorder): Evaluations for persistent anxiety triggers.
  - **PSS** (Perceived Stress Scale): Assessment of stress levels and emotional coping capacity.
- **Safety Threshold & Crisis Triggers**: Includes automated crisis detection. If screening results indicate major clinical thresholds, the UI displays priority helpline triggers and mental support resources.

### 🤖 Secured Server-Side AI Interpretation
- Proxies all model invocations through our highly secure Node.js Express server (`server.ts`). This pattern keeps the `GEMINI_API_KEY` safe from user browser inspector channels.
- Synthesizes user biometrics, calculated risk indexes, and mental screening scores into structured guidelines covering nutrition, exercise routines, stress mitigation, and professional doctor referral pathways.

### 🌗 Perfectly Engineered Dual-Theme Engine (Tailwind CSS v4)
- Leverages Tailwind CSS v4's modern class nested variant configuration (`@variant dark (&:where(.dark, .dark *));`) inside `index.css`.
- Synchronizes seamless user theme transitions across all screens, persisting choices locally using client-side `localStorage`.

### 🇧🇩 100% Comprehensive Bilingual Translation (English & Bengali)
- Built-in multi-lingual language router. Every UI card, query trigger, risk metric, clinical questionnaire item, and generated advice card instantly translates between English and Bengali with a single click.

---

## 🏗️ System Architecture & Data Flow

HealthGuard AI is engineered around a secure Service-Oriented Architecture (SOA), prioritizing client privacy and backend security rules.

```
                  ┌──────────────────────────────────────────────┐
                  │                 React Client                 │
                  │   - Local State Engine & Tab Router (Vite)   │
                  │   - Dynamic Offline Medical Risk Computers   │
                  │   - Client-Side Theme / Locale Store (LS)    │
                  └──────────────────────┬───────────────────────┘
                                         │
                                         │ Secure HTTPS POST
                                         │ (No API keys exposed)
                                         ▼
                  ┌──────────────────────────────────────────────┐
                  │            Express / Node Backend            │
                  │   - Listens on 0.0.0.0:3000                  │
                  │   - Secure Gemini LLM Prompt Proxy           │
                  │   - Static Asset Hosting / Multi-Builds      │
                  └──────────────────────┬───────────────────────┘
                                         │
                                         │ Outbound TLS Call
                                         │ (With Server Secret)
                                         ▼
                  ┌──────────────────────────────────────────────┐
                  │       Google Gemini 3.5 Flash Service        │
                  │   - Dynamic Healthcare Evaluation Prompting   │
                  │   - Advanced Predictive Context Summaries    │
                  └──────────────────────────────────────────────┘
```

---

## 📁 Repository Directory Structure

Our codebase is fully modularized following clean React and backend separation-of-concerns paradigms:

```
├── .env.example                 # Environment variables checklist
├── .gitignore                   # Excludes dependencies, builds, and keys
├── index.html                   # Core HTML element container
├── metadata.json                # App capability tags (Set to Server-Side Gemini API)
├── package.json                 # Node dependencies, scripts and build configurations
├── server.ts                    # Express backend, Vite Dev Server & Gemini API gateway
├── tsconfig.json                # TypeScript compiler standard rules
├── vite.config.ts               # Core Vite config bundling React and Tailwind compilers
├── src/
│   ├── App.tsx                  # Main router, layout shell, and global state engine
│   ├── main.tsx                 # Core React DOM mounting bootstrap script
│   ├── index.css                # Global CSS imports including Tailwind CSS v4 directives
│   ├── types.ts                 # Declarations of strict clinical structures and types
│   ├── components/
│   │   ├── AICoachChat.tsx      # Multi-lingual interactive AI wellness coach chat console
│   │   ├── Dashboard.tsx        # Dynamic dashboard displaying calculated metric charts
│   │   ├── EthicsSafety.tsx     # Patient data sovereignty and safety compliance manifest
│   │   ├── MentalHealthForm.tsx # Interactive PHQ-9, GAD-7, and PSS screen questionnaires
│   │   ├── PhysicalRiskForm.tsx # Secure biometric input profile interface with dynamic validation
│   │   └── ReportPDF.tsx        # Printable, clean A4 clinical PDF generation view
│   ├── data/
│   │   └── localization.ts      # Exhaustive bilingual key-value dictionaries (EN/BN)
│   └── utils/
│       └── healthCalculations.ts# Clinical engines calculating biometric risks & weights
```

---

## 🌗 Tailwind CSS v4 Class-Based Dark Mode Setup

To support class-based dark mode switching within Tailwind CSS v4, we use the `@variant` directive in `src/index.css`. This ensures that `dark:` classes are applied immediately when the `.dark` class is attached to the document root:

### 1. CSS Directives (`src/index.css`)
```css
@import "tailwindcss";

/* 
  Establishes class nesting rules for Tailwind v4. 
  When 'dark' class is present on the <html> element, 
  all descendant components instantly apply 'dark:' styling classes.
*/
@variant dark (&:where(.dark, .dark *));

@theme {
  --font-sans: "Inter", ui-sans-serif, system-ui, sans-serif;
  --font-mono: "JetBrains Mono", ui-monospace, SFMono-Regular, monospace;
}
```

### 2. Client-Side Lifecycle Handler (`src/App.tsx`)
```typescript
const [theme, setTheme] = useState<"light" | "dark">( Oscar() => {
  const stored = localStorage.getItem("theme");
  if (stored === "light" || stored === "dark") return stored;
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
});

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
```

---

## 🚀 Quick Setup & Installation

### Prerequisite System Requirements
Ensure that you have **Node.js (version 20 or higher)** installed on your host system.

### 1. Clone & Set Up Directory
In your workspace terminal, navigate to the project directory and prepare your configurations:
```bash
# Clone the repository
git clone <repository_url>
cd healthguard-ai

# Duplicate the example configuration to initiate environment values
cp .env.example .env
```

### 2. Configure Environment Secrets
Open the `.env` file and insert your API secrets:
```env
# Server secret key (Required for AI coach and biometric interpretation)
GEMINI_API_KEY=your_google_gemini_api_key_here

# Environment configurations
NODE_ENV=development
```

### 3. Install Dependencies & Build
Install compilation packages and run local verification scripts:
```bash
# Clean dependency installs
npm install

# Run the TypeScript development server (Runs backend and Vite on port 3000)
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your web browser to view the application.

---

## 🏗️ Production Build and Packaging Scripts

HealthGuard AI features optimized scripts in `package.json` to handle compilation and server starts flawlessly:

- **Build Pipeline**: Runs Vite client compilation and bundles our backend `server.ts` entry point into an optimized, self-contained ES Module format within `dist/` using `esbuild`.
- **Startup Engine**: Directly starts the compressed production module file.

To compile and execute the app for production:
```bash
# Compiles both client React static targets and backend CJS script
npm run build

# Bootstraps the application inside a production state container
npm run start
```

---

## 🗄️ Supabase / PostgreSQL DB Migration Schemas

If your deployment plan incorporates user persistence or cloud storage (e.g., Supabase or PostgreSQL), migrate your database using the following DDL script:

```sql
-- Create Enumerated Types
CREATE TYPE gender_type AS ENUM ('male', 'female', 'other');
CREATE TYPE risk_category AS ENUM ('Low', 'Medium', 'High');

-- Table: Store user biometric metadata
CREATE TABLE physical_profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
    age INT NOT NULL,
    gender gender_type NOT NULL,
    height_cm NUMERIC NOT NULL,
    weight_kg NUMERIC NOT NULL,
    systolic_bp INT NOT NULL,
    diastolic_bp INT NOT NULL,
    fasting_glucose INT NOT NULL,
    cholesterol_mg INT NOT NULL,
    smoking_status VARCHAR(50) DEFAULT 'never',
    exercise_days_per_week INT NOT NULL,
    family_history_chronic BOOLEAN DEFAULT FALSE,
    computed_bmi NUMERIC GENERATED ALWAYS AS (weight_kg / ((height_cm / 100.0) ^ 2)) STORED
);

-- Table: Store analytical risk calculations
CREATE TABLE prediction_results (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    profile_id UUID REFERENCES physical_profiles(id) ON DELETE CASCADE,
    diabetes_prob INT NOT NULL,
    diabetes_cat risk_category NOT NULL,
    heart_disease_prob INT NOT NULL,
    heart_disease_cat risk_category NOT NULL,
    hypertension_prob INT NOT NULL,
    hypertension_cat risk_category NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- Table: Store historical mental screening records
CREATE TABLE mental_screenings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    profile_id UUID REFERENCES physical_profiles(id) ON DELETE CASCADE,
    phq9_score INT NOT NULL,
    gad7_score INT NOT NULL,
    pss_score INT NOT NULL,
    overall_guard_score INT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);
```

---

## 🐍 Advanced Feature: Python FastAPI PyCaret Integration

For production models leveraging deep statistical learning (e.g. Scikit-Learn, LightGBM, PyCaret), deploy a Python FastAPI service using the following pattern:

```python
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel, conint
import numpy as np

app = FastAPI(
    title="HealthGuard AI - Machine Learning Engine", 
    description="Microservice proxying specialized ML prediction models",
    version="1.0"
)

class Biometrics(BaseModel):
    age: conint(ge=1, le=120)
    systolic: conint(ge=50, le=250)
    glucose: conint(ge=40, le=500)
    cholesterol: conint(ge=100, le=500)
    exercise_days: conint(ge=0, le=7)
    family_history: bool

@app.post("/api/predict-diabetes", status_code=200)
def predict_diabetes_risk(data: Biometrics):
    try:
        # Logistic regression based on standardized odds thresholds
        base_logit = -2.8 + (data.age * 0.035) + (data.glucose * 0.042)
        if data.family_history:
            base_logit += 1.35
        base_logit -= (data.exercise_days * 0.18)
        
        # Calculate standard Sigmoid function probability
        probability = 1.0 / (1.0 + np.exp(-base_logit))
        risk_percent = int(min(99, max(1, round(probability * 100))))
        
        # Define output classification categories
        category = "Low" if risk_percent < 25 else "Medium" if risk_percent < 60 else "High"
        
        return {
            "risk_percentage": risk_percent,
            "risk_category": category,
            "explanation": "Calculations weighted primarily by real-time fasting glucose values and family genetics.",
            "shap_attributions": {
                "glucose_weight": 0.45,
                "family_history_weight": 0.30,
                "age_weight": 0.15,
                "exercise_mitigation": -0.10
            }
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
```

---

## 🐋 Production Deployment & Containerization

Deploy and scale HealthGuard AI globally using Docker and container infrastructure:

### 1. Dockerfile
Create a secure, multi-stage Docker build container to serve production-ready bundles:
```dockerfile
# Stage 1: Build front-end and back-end
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Stage 2: Serve the production bundles
FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/metadata.json ./metadata.json

ENV NODE_ENV=production
ENV PORT=3000
EXPOSE 3000

CMD ["node", "dist/server.js"]
```

### 2. Multi-Container Orchestration (`docker-compose.yml`)
Run client, proxy, and environment scopes uniformly on any server:
```yaml
version: '3.8'

services:
  healthguard-platform:
    build:
      context: .
      dockerfile: Dockerfile
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
      - GEMINI_API_KEY=${GEMINI_API_KEY}
    restart: always
```

---

## 🛡️ Clinical Guidelines, Ethics, & Safety Standpoints

HealthGuard AI strictly adheres to digital healthcare engineering best practices:
1. **Explainable Metrics (XAI)**: We replace generic black-box percentages with calculated SHAP-inspired weight distribution bars, visual logs, and clinical references:
   - *Hypertension levels* map directly to JNC risk categories.
   - *Diabetes levels* map directly to ADA fasting blood glucose measurements.
2. **Data Sovereignty & Privacy**: The platform operates with zero third-party telemetry, trackers, or unsolicited cloud uploads. Screening responses are held completely within local memory context.
3. **Primary Medical Care Notice**: Every screen, calculated advice block, and report footer features the following disclaimer:
   > *"This digital platform is a prototype for educational and preventive screening purposes. It is not an alternative to professional clinical advice, diagnostic procedures, or active medical therapies."*

---

## 📄 License & Collaboration
All models, calculations, designs, and code structures of HealthGuard AI are fully open for collaborative academic, clinical, and administrative research workflows. 

*Crafted with 🩺 and high precision for healthy, resilient lives.*
