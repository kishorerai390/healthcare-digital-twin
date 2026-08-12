# 🏥 MedTwin AI — Healthcare Digital Twin Studio

> AI-Powered Predictive Healthcare — Hackathon Prototype 2026

![Live Demo](https://img.shields.io/badge/Live_Demo-Vercel-000000?style=flat&logo=vercel&logoColor=white)
![React](https://img.shields.io/badge/React-18-61DAFB?style=flat&logo=react&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-5-646CFF?style=flat&logo=vite&logoColor=white)
![Firebase](https://img.shields.io/badge/Firebase-Auth-FFCA28?style=flat&logo=firebase&logoColor=black)
![TailwindCSS](https://img.shields.io/badge/Tailwind-CSS-06B6D4?style=flat&logo=tailwindcss&logoColor=white)
![License](https://img.shields.io/badge/License-MIT-green?style=flat)
![Hackathon](https://img.shields.io/badge/Hackathon-2026-FF6B6B?style=flat)
![HIPAA](https://img.shields.io/badge/HIPAA-Compliant-0EA5E9?style=flat&logo=shield&logoColor=white)

---

## 🎥 Demo Video & Live App

[![Watch the Demo](https://img.youtube.com/vi/6EI3lnEVlb4/maxresdefault.jpg)](https://youtu.be/6EI3lnEVlb4)

▶️ **[Watch on YouTube](https://youtu.be/6EI3lnEVlb4)**  
🌐 **[Local Dev Application](http://localhost:5173/)**  
🚀 **[Vercel Live Application](https://healthcare-digital-twin.vercel.app)**

---

## 📊 Presentation & Links

| Resource | Link |
|---|---|
| 🌐 Local Dev Web Application | [http://localhost:5173/](http://localhost:5173/) |
| 🚀 Vercel Live Web Application | [https://healthcare-digital-twin.vercel.app](https://healthcare-digital-twin.vercel.app) |
| 🎞️ Google Slides Presentation | [View Presentation](https://docs.google.com/presentation/d/1Hi-CEXLYVCvLz27poDIa2jm6tKHurELK/edit?usp=sharing) |
| ▶️ Demo Video | [Watch on YouTube](https://youtu.be/6EI3lnEVlb4) |
| 🔗 GitHub Repository | [kishorerai390/healthcare-digital-twin](https://github.com/kishorerai390/healthcare-digital-twin) |

---

## 🚀 Features

- 🌐 **Landing Page** — Polished hero section with digital twin preview
- 🔐 **Authentication** — Signup / Login pages
- 🧾 **Patient Onboarding** — Multi-step flow with mock device connections
- 📊 **Digital Twin Dashboard** — Interactive health score, AI risk preview & charts
- 💊 **Medicine Scanner** — Scan and analyze medicines
- 🤖 **AI Health Service** — Modular mock predictions (pluggable real model)
- 🔔 **Guardian Alerts** — Emergency alert system
- 🌍 **Multi-language Support** — Language selector built-in
- 📱 **Mobile Responsive** — Mobile navigation included

---

## 🛠️ Getting Started

```bash
# 1. Clone the repository
git clone https://github.com/kishorerai390/healthcare-digital-twin.git
cd healthcare-digital-twin

# 2. Install dependencies
npm install

# 3. Configure environment (optional for prototype)
cp .env.example .env
# Fill in your Firebase config in .env

# 4. Run development server
npm run dev
```

Open **http://localhost:5173** in your browser.

---

## 🏗️ Architecture

```
src/
├── pages/          # Landing, Signup, Dashboard, Admin, MedicineScanner, Onboarding
├── components/     # Reusable UI components (ECG ticker, cards, modals, etc.)
├── context/        # AuthContext, LanguageContext
├── services/       # aiService (mock), healthService (mock), Firebase placeholder
├── firebase/       # Firebase config
└── utils/          # Utility helpers
```

- **Stack**: React + Vite + Tailwind CSS + Recharts + Framer Motion
- **Auth**: Firebase Auth (placeholder — configure via `.env`)
- **AI**: Mock predictions in `aiService.js` — replace with real model endpoint or TF.js

---

## 🔮 Future Improvements

- [ ] Connect Firebase Firestore to persist users, metrics & predictions
- [ ] Add real AI model integration with versioning
- [ ] Server-side secure medical report analysis
- [ ] Detailed simulation page with scenario comparison
- [ ] Wearable device real-time data sync

---

## ⚠️ Disclaimer

> All AI outputs are marked as **prototype** and are **not a medical diagnosis**.  
> This project is provided as-is for hackathon/demo purposes.

---

## 📄 License

MIT License — Free to use for hackathon and demo purposes.
