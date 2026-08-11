# MedTwin AI — Healthcare Digital Twin (Prototype)

This repository is a hackathon-ready prototype for "Healthcare Digital Twin – AI-Powered Predictive Healthcare".

Features implemented in this prototype:
- Landing page with polished hero and digital twin preview
- Authentication pages (signup / login) — prototype behavior
- Multi-step patient onboarding with mock device connections
- Main Digital Twin Dashboard with interactive visual, health score, cards, and AI risk preview
- Modular AI service (mock predictions) and health service
- Firebase service placeholder (use .env to configure)
- Tailwind CSS, Framer Motion (dependency prepared), Recharts included for charts

Getting started
1. Copy .env.example to .env and fill your Firebase config (optional for prototype).
2. Run:
   npm install
   npm run dev
3. Open http://localhost:5173

Notes & Architecture
- The project uses React + Vite + Tailwind.
- services/ contains firebase.js (placeholder), aiService.js (mock), healthService.js (mock data).
- To integrate a real AI model, replace aiService.predict with a call to your model endpoint or a TF.js model.
- All AI outputs are marked as prototype and not a medical diagnosis.

Future improvements
- Connect Firebase Auth and Firestore to persist users, metrics, predictions, and reports.
- Add file upload and server-side AI analysis (secure processing of medical reports).
- Replace mock AI with a dedicated model and add versioning for prediction models.
- Add more detailed simulation page, charts, and scenario comparison.

License
This project is provided as-is for hackathon/demo purposes.
