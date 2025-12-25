# ClinIQ 🏥
### Clinical Intelligence for Smarter Triage

ClinIQ is an AI-powered clinical decision-support tool designed to assist healthcare providers in prioritizing patients based on symptom severity. It utilizes **Google Gemini** for reasoning and **Weights & Biases** for evaluation tracking.

⚠️ **DISCLAIMER: This system is a prototype and must NOT be used for real medical diagnosis. Always keep a human in the loop.**

---

## 🏗️ Architecture

- **Frontend**: Next.js 14 (App Router), TypeScript, Tailwind CSS
- **Backend**: Node.js, Express.js
- **AI Engine**: Google Gemini Pro via Generative AI SDK
- **Observability**: Weights & Biases (Simulated/Ready-to-integrate)

---

## 🚀 Getting Started

### 1. Prerequisites
- Node.js (v18+)
- npm or yarn
- Valid Google Gemini API Key

### 2. Installation

1.  **Clone/Open the project**
2.  **Environment Setup**
    *   Copy `.env.example` to `.env` in the root directory.
    *   `cp .env.example .env` (or rename it manually)
    *   Add your **GEMINI_API_KEY**.

3.  **Install Dependencies**

    **Backend:**
    ```bash
    cd backend
    npm install
    ```

    **Frontend:**
    ```bash
    cd ../frontend
    npm install
    ```

### 3. Running the Application

**Step 1: Start the Backend**
Open a terminal in the `backend` folder:
```bash
npm run dev
```
> Server will start on `http://localhost:5000`

**Step 2: Start the Frontend**
Open a new terminal in the `frontend` folder:
```bash
npm run dev
```
> App will run on `http://localhost:3000`

---

## 🧪 How It Works

1.  **Input:** User enters symptoms (e.g., "Sharp chest pain", "Mild fever").
2.  **Safety Layer:** A rule-based engine checks for immediate critical keywords (e.g., "heart attack", "can't breathe") *before* calling the AI.
3.  **AI Analysis:** If safe, Gemini analyzes the clinical presentation to assign a risk level (Low/Medium/High) and provides reasoning.
4.  **Logging:** Requests are logged for later evaluation (simulating MLOps flows).
5.  **Output:** The risk level and recommended action are displayed to the user.

---

## 🔒 Safety Features

- **Rule-Based Override**: Keywords like "suicide" or "stroke" trigger an immediate high-risk alert without waiting for AI.
- **Strict Prompting**: The AI is instructed to never diagnose and always err on the side of caution.
- **Explicit Disclaimers**: UI prominently displays that this is not a substitute for professional medical advice.

---

## 📂 Project Structure

```
ClinIQ/
├── backend/            # Express API
│   ├── src/
│   │   ├── services/   # Gemini & W&B logic
│   │   ├── middleware/ # Safety checks
│   │   ├── controllers/# Request handling
│   │   └── routes/     # API endpoints
├── frontend/           # Next.js App
│   ├── app/            # Pages & Layouts
│   ├── components/     # UI Components
│   └── lib/            # API Clients
└── .env                # Secrets
```
