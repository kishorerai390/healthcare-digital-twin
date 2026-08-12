# 🏥 MedTwin AI — Healthcare Digital Twin Studio

> AI-Powered Predictive Healthcare — Hackathon Prototype

---

## 🎥 Demo Video

[![Watch the Demo](https://img.youtube.com/vi/6EI3lnEVlb4/maxresdefault.jpg)](https://youtu.be/6EI3lnEVlb4)

▶️ **[Watch on YouTube](https://youtu.be/6EI3lnEVlb4)**

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
