# WARP.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

## Core Commands

All commands are intended to be run from the project root unless otherwise specified.

### Environment setup
- Copy the example env file and add your keys:
  - On any OS (in a terminal at project root):
    - Copy `.env.example` to `.env` and set at least `GEMINI_API_KEY`.
- The backend reads env from the project root via `backend/src/config/env.js`.
- The frontend can be pointed at a non-default backend via `NEXT_PUBLIC_API_URL`.

### Install dependencies
- Backend:
  - `cd backend`
  - `npm install`
- Frontend:
  - `cd frontend`
  - `npm install`

### Run the backend API server
- Development (with `nodemon` auto‑reload):
  - `cd backend`
  - `npm run dev`
  - Default port: `http://localhost:5000`
- Production-style run (no auto‑reload):
  - `cd backend`
  - `npm start`

### Run the frontend (Next.js)
- Development server:
  - `cd frontend`
  - `npm run dev`
  - Default URL: `http://localhost:3000`
- Production build + start:
  - `cd frontend`
  - `npm run build`
  - `npm start`

### Linting
- Frontend (Next.js lint):
  - `cd frontend`
  - `npm run lint`
- There are currently no lint or test scripts defined for the backend.

### Tests
- There are no explicit test scripts defined in `backend/package.json` or `frontend/package.json`.
- If you add tests (e.g., Jest/Vitest/Playwright), also add the corresponding `test`/`test:e2e` scripts and update this file with commands for running the whole suite and a single test file.

## High-Level Architecture

This project is a small full-stack prototype for clinical triage, split into a Node/Express backend and a Next.js 14 frontend.

### Backend (Node.js + Express)

Location: `backend/src`

Key modules and flow:
- **Entry point – `server.js`**
  - Creates an Express app, enables CORS and JSON parsing.
  - Mounts API routes under `/api` via `./routes/triageRoutes`.
  - Exposes a simple health check at `GET /` returning a plain text status.
  - Binds to `config.PORT` (default 5000) and logs the current `NODE_ENV`.

- **Configuration – `config/env.js`**
  - Loads environment variables from the project root `.env` using `dotenv`.
  - Exports core config:
    - `PORT` (default `5000`)
    - `GEMINI_API_KEY`
    - `WANDB_API_KEY` (not used directly yet but reserved)
    - `NODE_ENV` (default `'development'`).

- **Routing – `routes/triageRoutes.js`**
  - Defines `POST /api/triage` as the main triage endpoint.
  - Request pipeline for this route:
    1. `safetyCheck` middleware (rule‑based triage short‑circuit).
    2. `handleTriage` controller (AI‑driven assessment when safe).

- **Safety layer – `middleware/safetyCheck.js`**
  - Simple rule-based pre-filter that inspects the `symptoms` string.
  - Maintains a small list of `CRITICAL_KEYWORDS` (e.g. “chest pain”, “stroke”, “suicide”).
  - If any critical keyword is detected:
    - Logs a `[SAFETY BLOCK]` message with the matched keyword.
    - Immediately returns a **HIGH risk** JSON response with:
      - `riskLevel: 'HIGH'`
      - `confidence: 1.0`
      - `reasoning` describing the keyword-based safety override
      - `action` with an instruction to call emergency services
      - `isSafe: false`
      - `source: 'Rule-Engine'`
    - In this case the AI model is **not** invoked.
  - If no critical match is found, the request continues on to the controller.

- **Controller – `controllers/triageController.js`**
  - `handleTriage(req, res)` is the main controller for `POST /api/triage` once the safety check passes.
  - Extracts `symptoms`, `duration`, `severity`, `age`, `history` from `req.body`.
  - Calls `analyzeTriage` from `services/geminiService` to run the AI reasoning.
  - Calls `logEvent` from `services/wandbService` to emit a structured log summarizing:
    - Input characteristics (symptom length, reported severity, etc.).
    - Output characteristics (AI risk level, reasoning length).
  - On success, responds with:
    - `{ success: true, data: aiResult, source: 'Gemini-Pro' }`.
  - On error, logs the error and returns a 500 with a generic fallback message.

- **AI integration – `services/geminiService.js`**
  - Uses `@google/generative-ai` and `GEMINI_API_KEY` to instantiate a `GoogleGenerativeAI` client and a `gemini-pro` model instance.
  - `analyzeTriage(data)` constructs a detailed prompt from the triage data, instructing the model to:
    - Output only JSON with fields: `riskLevel`, `reasoning`, `recommendedAction`.
    - Avoid making diagnoses and err on the side of caution.
    - Optionally return `"Unknown"` for non-medical or nonsense inputs.
  - After calling `model.generateContent(prompt)` it:
    - Reads `response.text()`.
    - Strips surrounding ```json / ``` markdown fences if present.
    - Parses the result as JSON and returns it to the caller.
  - Any model or parsing error is logged and rethrown as a generic “AI Reasoning Failed” error.

- **Observability / logging – `services/wandbService.js`**
  - Simulates a Weights & Biases style logging layer for this Node prototype.
  - `logEvent(data)` builds a structured log entry:
    - Adds a `_timestamp` ISO string and static `project: 'ClinIQ-Triage'`.
    - Merges in the provided `data` payload.
  - Logs to stdout using the `WANDB_LOG:` prefix so logs can be easily grepped or piped to external tooling.

Overall backend request lifecycle:
1. Client sends `POST /api/triage` with triage payload.
2. `safetyCheck` inspects the text for critical patterns and may short-circuit with a HIGH risk response.
3. If safe, `handleTriage` calls Gemini via `analyzeTriage` for a structured risk assessment.
4. Result is logged via `logEvent` and returned in a `{ success, data }` envelope.

### Frontend (Next.js 14 App Router)

Location: `frontend`

High-level structure:
- `app/layout.tsx`
  - Global layout and metadata for the app.
  - Uses the Inter font and wraps all pages.
- `app/page.tsx`
  - The single main page/UI for the prototype.
  - Renders:
    - Header with app branding.
    - `Disclaimer` component for the medical disclaimer.
    - `TriageForm` as the primary interaction surface.
    - Footer with a demonstration-only notice.

- `components/Disclaimer.tsx`
  - Static banner styled with Tailwind, emphasizing that ClinIQ:
    - Is informational only.
    - Does **not** diagnose conditions.
    - Should not be used in emergencies (users should call emergency services).

- `components/TriageForm.tsx`
  - Marked as a client component (`'use client'`).
  - Holds `formData` state conforming to `TriageData` from `lib/api.ts`:
    - `symptoms`, `duration`, `severity`, `age`, optional `history`.
  - Provides controlled inputs for these fields, including a 1–10 slider for severity.
  - On submit:
    - Prevents default form behavior.
    - Resets previous result and error state.
    - Calls `analyzeSymptoms(formData)` from `lib/api.ts`.
    - Shows a loading state while awaiting the response.
    - On success, stores `res.data` and passes it to `RiskResult`.
    - On failure, displays a simple error banner.

- `components/RiskResult.tsx`
  - Presentation component for a triage result object (`TriageResponse['data']`).
  - Maps `riskLevel` to a color theme and icon; supports different casings.
  - Displays:
    - The risk level headline.
    - The model’s `reasoning` text.
    - The recommended action, falling back from `recommendedAction` to `action` to support responses from the safety rule engine.
    - An "Analysis Source" line based on `result.source` (defaults to `'AI System'`).

- `lib/api.ts`
  - Defines TypeScript interfaces for the triage payload and response:
    - `TriageData` (matching the backend’s expected fields).
    - `TriageResponse` (wrapping the backend’s `{ success, data, error }` structure).
  - Sets `API_URL` from `process.env.NEXT_PUBLIC_API_URL` (falls back to `http://localhost:5000`).
  - `analyzeSymptoms(data)`:
    - Sends a `POST` request to `${API_URL}/api/triage` with JSON body.
    - Returns the parsed JSON response from the backend.
    - On network error, returns a `{ success: false, error: 'Network error...' }` object instead of throwing.

Overall frontend–backend interaction:
1. User fills in the triage form and submits.
2. Frontend calls `analyzeSymptoms` which targets the backend `/api/triage` endpoint.
3. Backend either short-circuits with a rule-based HIGH‑risk response or calls Gemini.
4. Frontend displays the resulting risk assessment, reasoning, and recommended action using `RiskResult`, while always showing the disclaimer at the top of the page.

## Notes for Future Changes

- If you add automated tests, linters, or formatters for either the frontend or backend, prefer wiring them up as `npm` scripts in the relevant `package.json` files and update the **Core Commands** section accordingly.
- The `WANDB_LOG:` prefix and the structured AI result format (`riskLevel`, `reasoning`, `recommendedAction`) are important integration points; preserve or explicitly migrate them if you refactor logging or model responses.