# SYNORA — AI Digital Healthcare Companion

SYNORA is an accessible, modern AI-powered digital healthcare platform designed for everyday wellness, instant voice-enabled consultations, comprehensive pediatric baby care guidance, and verified medicine information.

---

## 🌟 Key Features

- **🤖 SYNORA AI Health Assistant:**
  - Natural voice & text consultations in Bangla and English.
  - Built-in clinical symptom reasoning engine with home care protocols.
  - Automatic emergency triage and red-flag detection (direct integration with 999, 16263, and 911).

- **👶 Age-Specific Baby Care Hub:**
  - Structured guidance for infants and children (1 Month to 10 Years).
  - Feeding schedules, milestone trackers, immunization schedules, weather & environment management, and red flag warnings.
  - Multi-baby profile support.

- **💊 Verified Medicine Directory:**
  - Fast search by Brand or Generic name.
  - Indications, dosage administration, precautions, side effects, overdose warnings, and storage rules.

- **📊 SYNORA Wellness Score & Index:**
  - Dynamic algorithm evaluating BMI, Blood Pressure, sleep, hydration, and lifestyle habits.
  - Category breakdown with personalized recommendations and progress tracking.

- **🎨 Multi-Theme System:**
  - Light (Clean White), Dark (Midnight Navy), and Aurora (Cyber Neon) themes.
  - Bilingual support: Bengali (বাংলা) & English.

- **🛡️ Secure Administration Portal:**
  - Role-based access control restricted to authorized medical administrator emails.
  - Live CMS management for Health Tips, Baby Care stages, Medicine Directory, Rating Rules, and Inbox inquiries.

---

## 🚀 Tech Stack

- **Frontend:** React 18, Vite, React Router v6, Lucide Icons, Vanilla CSS Design System.
- **Backend:** Node.js, Express, REST API.
- **Voice & AI:** Web Speech API (Speech Recognition & Text-to-Speech), Clinical reasoning engine & Gemini API integration.
- **Data & Auth:** Firebase Authentication & Firestore security configuration.

---

## 🛠️ Getting Started

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment Variables
Copy `.env.example` to `.env` and fill in your Firebase and Gemini credentials (optional, works in offline clinical fallback mode as well):
```bash
cp .env.example .env
```

### 3. Run Locally
```bash
# Start backend server & frontend client simultaneously
npm run dev
```

- **Frontend:** `http://localhost:5173`
- **Backend API:** `http://localhost:5000`

---

## 👥 Core Development Team

- **Website Creator & Full-Stack AI Developer:** Sumon Parvez
- **Concept & Vision:** Nusrat Jahan Sumiya
- **UI/UX Designer:** Najmul Haque

---

## ⚖️ Medical Disclaimer
SYNORA is an informational wellness companion and does not replace a licensed medical diagnosis, clinical prescription, or physical physician consultation. In case of acute health emergencies, call 999 or 911 immediately.
