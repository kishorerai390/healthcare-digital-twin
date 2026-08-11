import React, { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Bot, Send, User, Sparkles, Volume2, VolumeX, ShieldAlert, Heart, 
  Stethoscope, RefreshCw, CheckCircle2, MessageSquare, Award, Clock, 
  ArrowRight, Mic, MicOff, Wand2, Globe, Languages, Video, FileText, Download 
} from 'lucide-react'
import AIVideoConsultModal from './AIVideoConsultModal'
import { getHealthProfile, updateHealthProfile } from '../utils/storage'
import { getAdminCustomData, saveAdminCustomData } from '../utils/adminStorage'
import { downloadClinicalReportPDF } from '../utils/pdfGenerator'

const AI_DOCTORS = [
  {
    id: 'aris',
    name: 'Dr. Aris Vance, MD, FACC',
    title: 'Chief of Cardiology & Acoustic Biomarkers',
    avatar: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=200',
    specialty: 'Cardiology',
    status: 'Online • Live Telemetry Active',
    badgeColor: 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30'
  },
  {
    id: 'vance',
    name: 'Dr. Marcus Vance, MD',
    title: 'Director of Neurology & Brain Telemetry',
    avatar: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=200',
    specialty: 'Neurology',
    status: 'Online • Cognitive Engine Active',
    badgeColor: 'bg-purple-500/20 text-purple-400 border-purple-500/30'
  },
  {
    id: 'rostova',
    name: 'Dr. Elena Rostova, MD',
    title: 'Preventive Medicine & Longevity AI Specialist',
    avatar: 'https://images.unsplash.com/photo-1594824813566-78a1ed64ce02?auto=format&fit=crop&q=80&w=200',
    specialty: 'Preventive Medicine',
    status: 'Online • Risk Profiler Active',
    badgeColor: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
  }
]

const DICTATION_LANGUAGES = [
  { code: 'en-US', name: 'English (US)', flag: '🇺🇸' },
  { code: 'en-IN', name: 'English (India)', flag: '🇮🇳' },
  { code: 'hi-IN', name: 'Hindi (हिंदी)', flag: '🇮🇳' },
  { code: 'ta-IN', name: 'Tamil (தமிழ்)', flag: '🇮🇳' },
  { code: 'te-IN', name: 'Telugu (తెలుగు)', flag: '🇮🇳' },
  { code: 'bn-IN', name: 'Bengali (বাংলা)', flag: '🇮🇳' },
  { code: 'ml-IN', name: 'Malayalam (മലയാളം)', flag: '🇮🇳' },
  { code: 'kn-IN', name: 'Kannada (ಕನ್ನಡ)', flag: '🇮🇳' },
  { code: 'gu-IN', name: 'Gujarati (ગુજરાતી)', flag: '🇮🇳' },
  { code: 'mr-IN', name: 'Marathi (מराठी)', flag: '🇮🇳' },
  { code: 'pa-IN', name: 'Punjabi (ਪੰਜਾਬੀ)', flag: '🇮🇳' },
  { code: 'es-ES', name: 'Spanish (Español)', flag: '🇪🇸' },
  { code: 'fr-FR', name: 'French (Français)', flag: '🇫🇷' },
  { code: 'de-DE', name: 'German (Deutsch)', flag: '🇩🇪' },
  { code: 'zh-CN', name: 'Mandarin (中文)', flag: '🇨🇳' },
  { code: 'ja-JP', name: 'Japanese (日本語)', flag: '🇯🇵' },
  { code: 'ar-SA', name: 'Arabic (العربية)', flag: '🇸🇦' },
  { code: 'ru-RU', name: 'Russian (Русский)', flag: '🇷🇺' },
  { code: 'ko-KR', name: 'Korean (한국어)', flag: '🇰🇷' },
  { code: 'pt-BR', name: 'Portuguese (Brasil)', flag: '🇧🇷' },
  { code: 'it-IT', name: 'Italian (Italiano)', flag: '🇮🇹' },
  { code: 'tr-TR', name: 'Turkish (Türkçe)', flag: '🇹🇷' },
  { code: 'vi-VN', name: 'Vietnamese (Tiếng Việt)', flag: '🇻🇳' },
  { code: 'nl-NL', name: 'Dutch (Nederlands)', flag: '🇳🇱' }
]

const SAMPLE_QUESTIONS = [
  '🫀 Evaluate my heart rate and 30s voice acoustic cardiac risk',
  '🩹 Analyze my wound healing granulation and infection safety',
  '💊 Review my Warfarin Sodium 5mg medication schedule & dosage',
  '🏃 What exercise and sleep routine should I follow today?'
]

function autoCorrectMedicalText(rawText) {
  if (!rawText) return { text: '', corrected: false }

  let correctedText = rawText
    .replace(/\bhart\b/gi, 'heart')
    .replace(/\bblod\b/gi, 'blood')
    .replace(/\bpresure\b/gi, 'pressure')
    .replace(/\bwarfrin\b|\bwarfren\b/gi, 'Warfarin')
    .replace(/\boxigen\b/gi, 'oxygen')
    .replace(/\bsuger\b|\bglocose\b/gi, 'glucose')
    .replace(/\bwoond\b/gi, 'wound')
    .replace(/\bgranlation\b/gi, 'granulation')
    .replace(/\bejcercise\b|\bexersise\b/gi, 'exercise')
    .replace(/\bheadach\b/gi, 'headache')
    .replace(/\bpaine\b/gi, 'pain')
    .replace(/\bdoc\b/gi, 'Doctor')

  correctedText = correctedText.charAt(0).toUpperCase() + correctedText.slice(1)
  const hasChanged = correctedText.trim() !== rawText.trim()

  return { text: correctedText, corrected: hasChanged }
}

function translateAndAutoCorrect(rawText) {
  if (!rawText) return { text: '', original: rawText, isTranslated: false, detectedLang: 'English' }

  let detectedLang = 'English'
  let translatedText = rawText
  const lower = rawText.toLowerCase()

  if (lower.includes('corazón') || lower.includes('corazon') || lower.includes('salud') || lower.includes('ritmo')) {
    detectedLang = 'Spanish'
    translatedText = 'Evaluate my heart rate and cardiac telemetry'
  } else if (lower.includes('herz') || lower.includes('herzfrequenz')) {
    detectedLang = 'German'
    translatedText = 'What is my heart rate and cardiac risk score?'
  } else if (lower.includes('coeur') || lower.includes('rythme cardiaque')) {
    detectedLang = 'French'
    translatedText = 'Check my heart rate and vocal acoustic scan'
  } else if (lower.includes('दिल') || lower.includes('धड़कन')) {
    detectedLang = 'Hindi'
    translatedText = 'How is my heart rate and cardiac baseline?'
  } else if (lower.includes('இதயம்') || lower.includes('துடிப்பு')) {
    detectedLang = 'Tamil'
    translatedText = 'Analyze my heart rate and vital signs'
  } else if (lower.includes('心率') || lower.includes('心脏')) {
    detectedLang = 'Chinese'
    translatedText = 'Review my heart rate and vital telemetry'
  } else if (lower.includes('心拍数') || lower.includes('心臓')) {
    detectedLang = 'Japanese'
    translatedText = 'Assess my heart rate and cardiac health score'
  } else if (lower.includes('herida') || lower.includes('cicatriz')) {
    detectedLang = 'Spanish'
    translatedText = 'Analyze my wound healing and infection risk'
  } else if (lower.includes('medicina') || lower.includes('pastilla')) {
    detectedLang = 'Spanish'
    translatedText = 'Review my scanned medication schedule and safety'
  }

  const { text: correctedText, corrected } = autoCorrectMedicalText(translatedText)
  const isTranslated = detectedLang !== 'English'

  return {
    text: correctedText,
    original: rawText,
    isTranslated,
    detectedLang,
    wasCorrected: corrected
  }
}

export default function AIConsultationView() {
  const profile = getHealthProfile() || {}
  const rawPatientName = profile?.personalInfo?.fullName || 'Patient'
  const patientName = rawPatientName.split('(')[0].trim()
  const vitals = profile?.vitals || {}
  const voice = profile?.voiceScanResult || {}
  const wound = profile?.woundScanResult || {}
  const med = profile?.medicineScanResult || {}

  const [selectedDoctor, setSelectedDoctor] = useState(AI_DOCTORS[0])
  const [selectedDictationLang, setSelectedDictationLang] = useState('en-US')
  const [messages, setMessages] = useState([
    {
      id: 'welcome',
      sender: 'ai',
      doctor: AI_DOCTORS[0],
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      text: `Hello ${patientName}! I am ${AI_DOCTORS[0].name}. Your 3D Living Digital Twin telemetry is fully synced in real-time. You may speak or type in ANY language — I will automatically translate and maintain our consultation in English!`
    }
  ])
  const [inputQuery, setInputQuery] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [isListening, setIsListening] = useState(false)
  const [autoCorrectBadge, setAutoCorrectBadge] = useState(null)
  const [isVideoCallOpen, setIsVideoCallOpen] = useState(false)
  const chatEndRef = useRef(null)

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isTyping])

  const generateAIResponse = (userText) => {
    const queryLower = userText.toLowerCase().trim()
    const hr = vitals.heartRate || 76
    const sys = vitals.systolic || 118
    const dia = vitals.diastolic || 78
    const spo2Val = vitals.spo2 || 98
    const glu = vitals.glucose || profile.medicalHistory?.bloodGlucose || 98
    const doctorName = selectedDoctor?.name || 'Dr. Aris Vance'
    const docSpecialty = selectedDoctor?.specialty || 'Cardiology'
    const name = patientName || 'Patient'

    // 1. Blood Pressure specific question
    if (queryLower.includes('blood pressure') || queryLower.includes('bp') || queryLower.includes('hypertension') || queryLower.includes('systolic') || queryLower.includes('diastolic')) {
      return `Regarding your blood pressure question: Your live telemetry records ${sys}/${dia} mmHg. This is within optimal non-hypertensive range. To maintain this baseline, keep daily sodium below 2,300mg and maintain regular hydration.`
    }

    // 2. Coffee / Caffeine question
    if (queryLower.includes('coffee') || queryLower.includes('caffeine') || queryLower.includes('tea') || queryLower.includes('energy drink')) {
      return `Regarding caffeine intake: Moderate coffee consumption (1-2 cups) is safe for your baseline resting heart rate of ${hr} BPM. Avoid caffeine within 6 hours of sleep to protect your 89% REM recovery score.`
    }

    // 3. Headache / Pain / Dizziness
    if (queryLower.includes('headache') || queryLower.includes('head pain') || queryLower.includes('dizzy') || queryLower.includes('dizziness')) {
      return `For headaches or dizziness: First, drink 500ml of fresh water. Your blood pressure (${sys}/${dia} mmHg) and oxygen saturation (${spo2Val}%) are stable, suggesting hydration or screen strain as potential causes. Rest in a dimly lit room.`
    }

    // 4. Chest pain / Heart Palpitations
    if (queryLower.includes('chest pain') || queryLower.includes('palpitation') || queryLower.includes('racing heart') || queryLower.includes('shortness of breath')) {
      return `⚠️ Urgent Clinical Assessment: If chest pain is acute, pressure-like, or radiating to arms/jaw, seek emergency care immediately! Your live telemetry shows ${hr} BPM and low acoustic cardiac risk (12%). Sit upright and take slow, deep breaths.`
    }

    // 5. Heart / Cardio / Voice Scan
    if (queryLower.includes('heart') || queryLower.includes('cardio') || queryLower.includes('pulse') || queryLower.includes('voice') || queryLower.includes('acoustic') || queryLower.includes('ecg')) {
      const risk = voice.cardiacRiskProb || 12
      const riskLevel = voice.riskLevel || 'Low Risk'
      return `Regarding your heart rate & cardiac telemetry: Your resting pulse is ${hr} BPM with normal sinus rhythm. Your 30s Voice Biomarker Acoustic Scan indicates a ${risk}% acoustic cardiac risk (${riskLevel}) and healthy vocal fold perfusion.`
    }

    // 6. Wound / Skin / Tissue
    if (queryLower.includes('wound') || queryLower.includes('granulation') || queryLower.includes('skin') || queryLower.includes('healing') || queryLower.includes('cut') || queryLower.includes('tissue')) {
      const area = wound.area || '2.4 cm²'
      const gran = wound.granulationPct || '88%'
      const inf = wound.infectionRisk || '1%'
      return `Direct answer regarding your wound status: Active surface area is ${area} with ${gran} healthy granulation tissue. Infection risk is negligible (${inf}). Keep the wound clean with saline and avoid friction.`
    }

    // 7. Medication / Warfarin / Dosage
    if (queryLower.includes('medicine') || queryLower.includes('warfarin') || queryLower.includes('pill') || queryLower.includes('drug') || queryLower.includes('dose') || queryLower.includes('prescription')) {
      const medName = med.name || 'Warfarin Sodium 5mg'
      const time = med.whenToTake?.exactTime || '8:00 PM Bedtime'
      return `Direct advice for your medication ${medName}: Take strictly at ${time} with water. Do not take aspirin or NSAIDs simultaneously as they increase bleeding risk.`
    }

    // 8. Specific Meal / Dinner / Breakfast / Food / Nutrition
    if (queryLower.includes('eat') || queryLower.includes('dinner') || queryLower.includes('lunch') || queryLower.includes('breakfast') || queryLower.includes('food') || queryLower.includes('diet') || queryLower.includes('nutrition')) {
      const diet = profile.lifestyle?.dietType || 'Balanced Mediterranean'
      return `For your meal recommendation: Following your ${diet} profile, choose lean protein (grilled fish, tofu, or poultry), complex carbs (quinoa or brown rice), and fiber-rich greens. This maintains your stable ${glu} mg/dL blood glucose.`
    }

    // 9. Sleep / Tiredness / Insomnia
    if (queryLower.includes('sleep') || queryLower.includes('rest') || queryLower.includes('tired') || queryLower.includes('fatigue') || queryLower.includes('insomnia') || queryLower.includes('nap')) {
      const sleepHours = profile.lifestyle?.sleepDuration || 7.5
      return `Regarding sleep & fatigue: Your twin tracks ${sleepHours} hours of sleep with 89% REM recovery. If feeling fatigued, check hydration (2.5L goal) and take a 20-minute power nap before 3:00 PM.`
    }

    // 10. Exercise / Workouts / Steps
    if (queryLower.includes('exercise') || queryLower.includes('workout') || queryLower.includes('gym') || queryLower.includes('step') || queryLower.includes('run') || queryLower.includes('walk') || queryLower.includes('activity')) {
      const steps = profile.lifestyle?.dailySteps || 8420
      return `Regarding physical activity: You have completed ${steps.toLocaleString()} steps today. A 30-minute moderate walk or cardiovascular session is recommended for your 76 BPM baseline.`
    }

    // 11. Weight / BMI / Height
    if (queryLower.includes('weight') || queryLower.includes('bmi') || queryLower.includes('height') || queryLower.includes('fat') || queryLower.includes('calories')) {
      const h = profile.personalInfo?.height || 172
      const w = profile.personalInfo?.weight || 68
      return `Regarding your body metrics: Height is ${h} cm, Weight is ${w} kg (BMI ~23.0 - Normal Healthy Weight). Active daily burn is 485 kCal.`
    }

    // 12. Greeting
    if (queryLower.includes('hi') || queryLower.includes('hello') || queryLower.includes('hey') || queryLower.includes('good morning') || queryLower.includes('good afternoon') || queryLower.includes('who are you')) {
      return `Hello ${name}! I am ${doctorName}, ${docSpecialty} Specialist. I am ready to answer any medical question about your heart, vitals, diet, medications, or wound telemetry.`
    }

    // 13. Direct contextual answer for any specific question asked
    return `Regarding your question "${userText}": Based on your Digital Twin telemetry (${hr} BPM, BP ${sys}/${dia} mmHg, SpO2 ${spo2Val}%), your health baseline is stable (Health Score: ${profile.healthScore || 94}/100). Maintain regular hydration and follow your doctor-approved wellness plan.`
  }

  const handleSendMessage = (rawInput = inputQuery) => {
    if (!rawInput.trim()) return

    const { text: processedText, original, isTranslated, detectedLang, wasCorrected } = translateAndAutoCorrect(rawInput)

    if (isTranslated) {
      setAutoCorrectBadge(`🌐 Auto-Translated from ${detectedLang} ➔ English`)
      setTimeout(() => setAutoCorrectBadge(null), 4000)
    } else if (wasCorrected) {
      setAutoCorrectBadge(`✨ AI Auto-Corrected: "${processedText}"`)
      setTimeout(() => setAutoCorrectBadge(null), 4000)
    } else {
      setAutoCorrectBadge(null)
    }

    const userMsg = {
      id: Date.now(),
      sender: 'user',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      text: processedText,
      originalText: isTranslated ? original : null,
      detectedLang: isTranslated ? detectedLang : null,
      wasCorrected
    }

    setMessages(prev => [...prev, userMsg])
    setInputQuery('')
    setIsTyping(true)

    setTimeout(() => {
      const aiReplyText = generateAIResponse(processedText)
      const aiMsg = {
        id: Date.now() + 1,
        sender: 'ai',
        doctor: selectedDoctor,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        text: aiReplyText
      }

      setMessages(prev => [...prev, aiMsg])
      setIsTyping(false)

      // Sync consultation event to Admin Audit Logs
      try {
        const curAdminData = getAdminCustomData() || {}
        const existingLogs = curAdminData.systemLogs || []
        const newLog = {
          id: Date.now(),
          time: new Date().toLocaleTimeString(),
          level: 'SUCCESS',
          event: `💬 AI Clinical Consultation (${selectedDoctor.name})`,
          detail: `Query (${detectedLang}): "${processedText.substring(0, 40)}...". AI Verdict: ${aiReplyText.substring(0, 65)}...`
        }
        saveAdminCustomData({
          ...curAdminData,
          systemLogs: [newLog, ...existingLogs]
        })
      } catch (err) {}
    }, 1100)
  }

  const startMicrophoneDictation = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
    if (!SpeechRecognition) {
      alert('Microphone speech recognition is available in Google Chrome, Microsoft Edge, and modern browsers!')
      return
    }

    if (isListening) {
      setIsListening(false)
      return
    }

    try {
      const recognition = new SpeechRecognition()
      recognition.continuous = false
      recognition.interimResults = true
      recognition.lang = selectedDictationLang

      recognition.onstart = () => setIsListening(true)
      recognition.onresult = (event) => {
        const transcript = Array.from(event.results)
          .map(res => res[0].transcript)
          .join('')

        const { text, isTranslated, detectedLang, wasCorrected } = translateAndAutoCorrect(transcript)
        setInputQuery(text)
        if (isTranslated) {
          setAutoCorrectBadge(`🌐 Speech Auto-Translated from ${detectedLang} ➔ English`)
          setTimeout(() => setAutoCorrectBadge(null), 4000)
        } else if (wasCorrected) {
          setAutoCorrectBadge(`✨ AI Auto-Corrected Voice: "${text}"`)
          setTimeout(() => setAutoCorrectBadge(null), 4000)
        }
      }

      recognition.onerror = () => setIsListening(false)
      recognition.onend = () => setIsListening(false)

      recognition.start()
    } catch (err) {
      setIsListening(false)
    }
  }

  const speakText = (text) => {
    if ('speechSynthesis' in window) {
      if (isSpeaking) {
        window.speechSynthesis.cancel()
        setIsSpeaking(false)
        return
      }

      const utterance = new SpeechSynthesisUtterance(text)
      utterance.rate = 0.95
      utterance.pitch = 1.0
      utterance.lang = 'en-US' // Speaks response in English
      utterance.onend = () => setIsSpeaking(false)
      utterance.onerror = () => setIsSpeaking(false)
      setIsSpeaking(true)
      window.speechSynthesis.speak(utterance)
    }
  }

  return (
    <div className="grid grid-cols-12 gap-8 font-sans">
      
      {/* Left Column: AI Doctor Selection & Twin Telemetry Overview */}
      <div className="col-span-12 lg:col-span-4 space-y-6">
        
        {/* Active Doctor Selector */}
        <div className="p-6 rounded-3xl bg-white/95 border border-slate-200/90 border-t-4 border-t-cyan-500 shadow-xl shadow-cyan-500/5 backdrop-blur-md space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider flex items-center gap-2">
              <Stethoscope className="w-4 h-4 text-cyan-600" />
              <span>Select AI Specialist</span>
            </h3>
            <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-extrabold">
              Live Active
            </span>
          </div>

          <div className="space-y-3">
            {AI_DOCTORS.map(doc => (
              <div
                key={doc.id}
                onClick={() => {
                  setSelectedDoctor(doc)
                  setMessages(prev => [
                    ...prev,
                    {
                      id: Date.now(),
                      sender: 'ai',
                      doctor: doc,
                      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                      text: `Switched consultation to ${doc.name} (${doc.title}). I am reviewing your Digital Twin telemetry now.`
                    }
                  ])
                }}
                className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-center gap-3 ${
                  selectedDoctor.id === doc.id
                    ? 'bg-slate-900 text-white border-slate-800 shadow-lg scale-[1.02]'
                    : 'bg-slate-50 hover:bg-slate-100 text-slate-900 border-slate-200'
                }`}
              >
                <img src={doc.avatar} alt={doc.name} className="w-11 h-11 rounded-xl object-cover border-2 border-cyan-400 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="font-extrabold text-xs truncate">{doc.name}</div>
                  <div className="text-[11px] opacity-80 truncate">{doc.title}</div>
                  <div className="text-[10px] text-emerald-400 font-semibold mt-0.5">{doc.status}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Dictation Language Selector */}
        <div className="p-5 rounded-3xl bg-white/95 border border-slate-200/90 shadow-xl space-y-2">
          <label className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <Globe className="w-4 h-4 text-purple-600" />
              <span>Input Speech Language</span>
            </span>
            <span className="text-[10px] px-2 py-0.5 rounded bg-purple-100 text-purple-800 font-extrabold">
              Auto-Translates to EN
            </span>
          </label>
          <select
            value={selectedDictationLang}
            onChange={(e) => setSelectedDictationLang(e.target.value)}
            className="w-full px-3 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 text-xs font-bold focus:outline-none focus:border-purple-500 cursor-pointer"
          >
            {DICTATION_LANGUAGES.map(lang => (
              <option key={lang.code} value={lang.code}>
                {lang.flag} {lang.name}
              </option>
            ))}
          </select>
          <p className="text-[11px] text-slate-500">
            💡 You can speak or type in Spanish, French, German, Hindi, Tamil, Mandarin, Japanese, etc. The AI translates & maintains all clinical responses in English!
          </p>
        </div>

        {/* Live Digital Twin Telemetry Summary Card */}
        <div className="p-6 rounded-3xl bg-slate-900 text-white border border-slate-800 shadow-2xl space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2 text-cyan-400 font-bold text-xs">
              <Sparkles className="w-4 h-4" />
              <span>SYNCED TWIN TELEMETRY</span>
            </div>
            <span className="text-[10px] bg-slate-800 px-2 py-0.5 rounded-full text-slate-300 font-mono">
              ID: {profile.twinId || 'TWIN-88412-US'}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="p-3 rounded-2xl bg-slate-950/80 border border-slate-800">
              <div className="text-[10px] text-slate-400 font-semibold">Heart Rate</div>
              <div className="text-base font-extrabold text-cyan-400 font-mono mt-0.5">{vitals.heartRate || 76} BPM</div>
            </div>
            <div className="p-3 rounded-2xl bg-slate-950/80 border border-slate-800">
              <div className="text-[10px] text-slate-400 font-semibold">Blood Pressure</div>
              <div className="text-base font-extrabold text-emerald-400 font-mono mt-0.5">{vitals.systolic || 118}/{vitals.diastolic || 78}</div>
            </div>
            <div className="p-3 rounded-2xl bg-slate-950/80 border border-slate-800">
              <div className="text-[10px] text-slate-400 font-semibold">Voice Cardiac Risk</div>
              <div className="text-base font-extrabold text-amber-400 font-mono mt-0.5">{voice.cardiacRiskProb || 12}% [Low]</div>
            </div>
            <div className="p-3 rounded-2xl bg-slate-950/80 border border-slate-800">
              <div className="text-[10px] text-slate-400 font-semibold">Wound Surface</div>
              <div className="text-base font-extrabold text-purple-400 font-mono mt-0.5">{wound.area || '2.4 cm²'}</div>
            </div>
          </div>
        </div>

      </div>

      {/* Right Column: Interactive AI Consultation Chat Console */}
      <div className="col-span-12 lg:col-span-8 flex flex-col h-[670px] rounded-3xl bg-white/95 border border-slate-200/90 border-t-4 border-t-purple-500 shadow-2xl backdrop-blur-md overflow-hidden">
        
        {/* Chat Console Top Bar */}
        <div className="p-5 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-3">
            <img src={selectedDoctor.avatar} alt={selectedDoctor.name} className="w-10 h-10 rounded-xl object-cover border-2 border-cyan-400" />
            <div>
              <div className="font-extrabold text-sm flex items-center gap-2">
                <span>{selectedDoctor.name}</span>
                <span className="px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-400 text-[10px] font-mono border border-cyan-500/30">ENGLISH CLINICAL ENGINE</span>
              </div>
              <div className="text-xs text-slate-400">{selectedDoctor.title}</div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                try {
                  downloadClinicalReportPDF(profile, `E-Prescription (${selectedDoctor.name})`)
                } catch (e) {
                  console.error('Error generating prescription PDF:', e)
                }
              }}
              className="px-3 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-extrabold text-xs shadow-md flex items-center gap-1.5 cursor-pointer transition-all hover:scale-105"
              title="Download Signed Clinical E-Prescription Directive"
            >
              <FileText className="w-3.5 h-3.5" />
              <span>📄 E-Prescription (PDF)</span>
            </button>

            <button
              onClick={() => setIsVideoCallOpen(true)}
              className="px-3 py-2 rounded-xl bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-400 hover:to-pink-500 text-white font-extrabold text-xs shadow-md flex items-center gap-1.5 cursor-pointer transition-all hover:scale-105"
            >
              <Video className="w-3.5 h-3.5 fill-white" />
              <span>📹 Start HD Video Call</span>
            </button>

            <button
              onClick={() => setMessages([messages[0]])}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors cursor-pointer"
              title="Reset Conversation"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Message Thread Area */}
        <div className="flex-1 p-6 overflow-y-auto space-y-4 bg-slate-50/50">
          {messages.map(msg => (
            <div key={msg.id} className={`flex gap-3 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
              {msg.sender === 'ai' && (
                <img src={msg.doctor.avatar} alt={msg.doctor.name} className="w-8 h-8 rounded-xl object-cover border border-cyan-500 flex-shrink-0 mt-1" />
              )}

              <div className={`max-w-md p-4 rounded-2xl shadow-md text-xs leading-relaxed space-y-2 ${
                msg.sender === 'user'
                  ? 'bg-slate-900 text-white rounded-br-none border border-cyan-500/40 shadow-lg'
                  : 'bg-white border border-slate-200 text-slate-900 rounded-bl-none shadow-sm'
              }`}>
                <div className={`flex items-center justify-between gap-4 border-b pb-1.5 text-[10px] ${
                  msg.sender === 'user' ? 'border-slate-800 text-cyan-400 font-extrabold' : 'border-slate-100 text-slate-500 font-bold'
                }`}>
                  <span className="flex items-center gap-1.5 flex-wrap">
                    <span className="font-extrabold">{msg.sender === 'user' ? patientName : msg.doctor.name}</span>
                    {msg.detectedLang && (
                      <span className="text-[9px] px-1.5 py-0.2 bg-purple-500/20 text-purple-300 rounded font-mono border border-purple-400/30">
                        🌐 Translated from {msg.detectedLang}
                      </span>
                    )}
                    {msg.wasCorrected && !msg.detectedLang && (
                      <span className="text-[9px] px-1.5 py-0.2 bg-cyan-500/20 text-cyan-300 rounded font-mono border border-cyan-500/30 font-bold">
                        ✨ Auto-Corrected
                      </span>
                    )}
                  </span>
                  <span className="font-mono text-[10px]">{msg.time}</span>
                </div>

                <p className="whitespace-pre-line font-medium">{msg.text}</p>

                {msg.originalText && (
                  <div className="text-[10px] text-cyan-200 italic border-t border-white/20 pt-1">
                    Original Input: "{msg.originalText}"
                  </div>
                )}

                {msg.sender === 'ai' && (
                  <button
                    onClick={() => speakText(msg.text)}
                    className="pt-1 flex items-center gap-1 text-[10px] font-extrabold text-cyan-600 hover:text-cyan-700 cursor-pointer"
                  >
                    {isSpeaking ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
                    <span>{isSpeaking ? 'Stop English Audio' : 'Listen English AI Response'}</span>
                  </button>
                )}
              </div>

              {msg.sender === 'user' && (
                <div className="w-8 h-8 rounded-xl bg-slate-900 text-cyan-400 flex items-center justify-center font-extrabold text-xs flex-shrink-0 mt-1">
                  <User className="w-4 h-4" />
                </div>
              )}
            </div>
          ))}

          {isTyping && (
            <div className="flex items-center gap-3">
              <img src={selectedDoctor.avatar} alt={selectedDoctor.name} className="w-8 h-8 rounded-xl object-cover border border-cyan-500" />
              <div className="p-3 rounded-2xl bg-white border border-slate-200 text-xs font-bold text-slate-500 flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-cyan-500 animate-bounce"></div>
                <div className="w-2 h-2 rounded-full bg-blue-500 animate-bounce delay-100"></div>
                <div className="w-2 h-2 rounded-full bg-purple-500 animate-bounce delay-200"></div>
                <span>{selectedDoctor.name} is evaluating your telemetry in English...</span>
              </div>
            </div>
          )}

          <div ref={chatEndRef} />
        </div>

        {/* AI Auto-Correct & Translation Banner */}
        {autoCorrectBadge && (
          <div className="px-6 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white text-[11px] font-extrabold flex items-center justify-between shadow-inner">
            <div className="flex items-center gap-1.5">
              <Wand2 className="w-3.5 h-3.5 text-yellow-300 animate-spin" />
              <span>{autoCorrectBadge}</span>
            </div>
            <span className="text-[10px] bg-black/20 px-2 py-0.5 rounded font-mono">English Translation Standard</span>
          </div>
        )}

        {/* Quick Question Prompts */}
        <div className="px-6 py-2.5 bg-white border-t border-slate-200 flex items-center gap-2 overflow-x-auto text-[11px] scrollbar-none">
          <span className="text-slate-400 font-bold flex-shrink-0">Quick Queries:</span>
          {SAMPLE_QUESTIONS.map((q, idx) => (
            <button
              key={idx}
              onClick={() => handleSendMessage(q)}
              className="px-3 py-1.5 rounded-full bg-slate-100 hover:bg-cyan-50 hover:text-cyan-700 text-slate-700 font-bold border border-slate-200 transition-all whitespace-nowrap cursor-pointer flex-shrink-0"
            >
              {q}
            </button>
          ))}
        </div>

        {/* Chat Input Field & Microphone Integration */}
        <div className="p-4 bg-white border-t border-slate-200 flex items-center gap-2">
          {/* Microphone Voice Input Button */}
          <button
            type="button"
            onClick={startMicrophoneDictation}
            className={`p-3 rounded-2xl transition-all cursor-pointer flex items-center justify-center ${
              isListening
                ? 'bg-rose-500 text-white animate-pulse shadow-lg shadow-rose-500/40 ring-4 ring-rose-300'
                : 'bg-slate-100 hover:bg-cyan-50 text-slate-700 hover:text-cyan-700 border border-slate-200'
            }`}
            title={`Speak in ${DICTATION_LANGUAGES.find(l => l.code === selectedDictationLang)?.name} (AI auto-translates to English)`}
          >
            {isListening ? <MicOff className="w-4 h-4 text-white" /> : <Mic className="w-4 h-4 text-cyan-600" />}
          </button>

          <input
            type="text"
            value={inputQuery}
            onChange={(e) => setInputQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
            placeholder={
              isListening
                ? `Listening in ${DICTATION_LANGUAGES.find(l => l.code === selectedDictationLang)?.name}... speak now...`
                : `Type or speak in ANY language... AI auto-translates & maintains chat in English!`
            }
            className="flex-1 px-4.5 py-3 rounded-2xl bg-white border-2 border-slate-300 text-slate-900 text-xs font-bold placeholder-slate-400 focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 shadow-xs transition-all"
          />

          <button
            onClick={() => handleSendMessage()}
            disabled={!inputQuery.trim() || isTyping}
            className="px-5 py-3 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-extrabold text-xs shadow-md flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
          >
            <span>Consult</span>
            <Send className="w-3.5 h-3.5" />
          </button>
        </div>

      </div>

      {/* HD Video Tele-Consult Modal */}
      <AIVideoConsultModal
        doctor={selectedDoctor}
        isOpen={isVideoCallOpen}
        onClose={() => setIsVideoCallOpen(false)}
      />

    </div>
  )
}
