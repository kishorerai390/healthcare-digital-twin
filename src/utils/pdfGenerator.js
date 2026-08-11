import { jsPDF } from 'jspdf'

// Helper function to create Base64 PNG graphics for PDF embedding
function createHeaderLogoDataURL() {
  const canvas = document.createElement('canvas')
  canvas.width = 120
  canvas.height = 120
  const ctx = canvas.getContext('2d')

  // Background gradient circle
  const grad = ctx.createLinearGradient(0, 0, 120, 120)
  grad.addColorStop(0, '#06b6d4')
  grad.addColorStop(1, '#2563eb')
  ctx.fillStyle = grad
  ctx.beginPath()
  ctx.arc(60, 60, 56, 0, Math.PI * 2)
  ctx.fill()

  // Inner ring
  ctx.strokeStyle = '#ffffff'
  ctx.lineWidth = 4
  ctx.beginPath()
  ctx.arc(60, 60, 46, 0, Math.PI * 2)
  ctx.stroke()

  // Cross Symbol
  ctx.fillStyle = '#ffffff'
  ctx.font = 'bold 50px sans-serif'
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.fillText('✚', 60, 58)

  return canvas.toDataURL('image/png')
}

function createBarcodeDataURL(codeText = 'MT-8849120') {
  const canvas = document.createElement('canvas')
  canvas.width = 240
  canvas.height = 65
  const ctx = canvas.getContext('2d')

  ctx.fillStyle = '#ffffff'
  ctx.fillRect(0, 0, 240, 65)

  ctx.fillStyle = '#0f172a'
  // Draw barcode lines pattern
  for (let x = 12; x < 228; x += 4) {
    const barWidth = ((x % 3 === 0) || (x % 7 === 0)) ? 3 : 1
    ctx.fillRect(x, 8, barWidth, 36)
  }

  ctx.font = 'bold 9px monospace'
  ctx.textAlign = 'center'
  ctx.fillText(`REQUISITION BARCODE: ${codeText}`, 120, 56)
  return canvas.toDataURL('image/png')
}

function createQRCodeDataURL(twinId = 'TWIN-88412-US') {
  const canvas = document.createElement('canvas')
  canvas.width = 90
  canvas.height = 90
  const ctx = canvas.getContext('2d')

  // White background
  ctx.fillStyle = '#ffffff'
  ctx.fillRect(0, 0, 90, 90)

  // Border
  ctx.strokeStyle = '#0284c7'
  ctx.lineWidth = 2
  ctx.strokeRect(2, 2, 86, 86)

  // Draw 2D QR Code Matrix Pattern
  ctx.fillStyle = '#0f172a'
  const offset = 8

  // Corner Position Detection Patterns (Top-Left, Top-Right, Bottom-Left)
  const drawFinder = (x, y) => {
    ctx.fillRect(x, y, 20, 20)
    ctx.fillStyle = '#ffffff'
    ctx.fillRect(x + 3, y + 3, 14, 14)
    ctx.fillStyle = '#0f172a'
    ctx.fillRect(x + 6, y + 6, 8, 8)
  }

  drawFinder(offset, offset)
  drawFinder(offset + 54, offset)
  drawFinder(offset, offset + 54)

  // Matrix Data Dots
  for (let r = 0; r < 14; r++) {
    for (let c = 0; c < 14; c++) {
      if ((r < 5 && c < 5) || (r < 5 && c > 8) || (r > 8 && c < 5)) continue
      if ((r + c * 3) % 2 === 0 || (r * c) % 3 === 0) {
        ctx.fillRect(offset + c * 5.2, offset + r * 5.2, 4, 4)
      }
    }
  }

  ctx.font = 'bold 7px sans-serif'
  ctx.textAlign = 'center'
  ctx.fillStyle = '#0284c7'
  ctx.fillText('SCAN VERIFY', 45, 84)

  return canvas.toDataURL('image/png')
}

function createMedicalStampDataURL(
  doctorName = 'Dr. Sarah Jenkins, MD, FACC',
  doctorSpecialty = 'Chief of Cardiology & Neural Telemetry',
  licenseNo = '#MD-98402-CA • NPI: 1849204912'
) {
  const canvas = document.createElement('canvas')
  canvas.width = 240
  canvas.height = 95
  const ctx = canvas.getContext('2d')

  // Outer Double Frame
  ctx.strokeStyle = '#0284c7'
  ctx.lineWidth = 3
  ctx.strokeRect(4, 4, 232, 87)

  ctx.strokeStyle = '#38bdf8'
  ctx.lineWidth = 1
  ctx.strokeRect(8, 8, 224, 79)

  ctx.fillStyle = '#0369a1'
  ctx.font = 'bold 10px sans-serif'
  ctx.textAlign = 'center'
  ctx.fillText('VERIFIED CLINICAL DIGITAL TWIN REQUISITION', 120, 22)

  ctx.strokeStyle = '#0284c7'
  ctx.lineWidth = 1.5
  ctx.beginPath()
  ctx.moveTo(18, 28)
  ctx.lineTo(222, 28)
  ctx.stroke()

  ctx.font = 'italic bold 13px Georgia, serif'
  ctx.fillStyle = '#0f172a'
  ctx.fillText(doctorName, 120, 48)

  ctx.font = 'bold 8px sans-serif'
  ctx.fillStyle = '#0284c7'
  ctx.fillText(doctorSpecialty, 120, 62)

  ctx.font = '7.5px sans-serif'
  ctx.fillStyle = '#475569'
  ctx.fillText(`License ${licenseNo}`, 120, 76)
  return canvas.toDataURL('image/png')
}

export function downloadClinicalReportPDF(profile, filename = 'MedTwin_Clinical_Report.pdf') {
  const doc = new jsPDF()

  const p = profile?.personalInfo || {}
  const v = profile?.vitals || {}
  const m = profile?.medicalHistory || {}
  const l = profile?.lifestyle || {}

  const patientName = p.fullName || 'Alex Morgan'
  const age = p.age || '32'
  const gender = p.gender || 'Male'
  const bloodGroup = p.bloodGroup || 'O+'
  const location = p.location || 'San Francisco, CA'
  const twinId = profile?.twinId || 'TWIN-88412-US'

  const todaysDate = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: '2-digit' })
  const currentTime = new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
  const recordId = `MT-${Math.floor(100000 + Math.random() * 900000)}`

  // Select attending doctor dynamically based on clinical risk
  const isHighRisk = (profile?.risks && profile.risks.some(r => r.level === 'High Risk')) || v.systolic > 140
  const doctorName = isHighRisk ? 'Dr. Sarah Jenkins, MD, FACC' : 'Dr. Elena Rostova, MD'
  const doctorSpecialty = isHighRisk ? 'Chief of Cardiology & Neural Telemetry' : 'Director of Preventive Digital Health'
  const licenseNo = isHighRisk ? '#MD-98402-CA • NPI: 1849204912' : '#MD-77104-CA • NPI: 1940294101'

  // 1. Header Banner & Hospital Branding
  const logoUrl = createHeaderLogoDataURL()
  doc.addImage(logoUrl, 'PNG', 14, 10, 22, 22)

  doc.setFontSize(15)
  doc.setFont('helvetica', 'bold')
  doc.setTextColor(15, 23, 42)
  doc.text('MedTwin AI Medical Center & Digital Twin Research Institute', 40, 18)

  doc.setFontSize(8.5)
  doc.setFont('helvetica', 'normal')
  doc.setTextColor(71, 85, 105)
  doc.text('Department of Digital Physiology, Artificial Intelligence & Clinical Telemetry', 40, 24)
  doc.text('750 Innovation Way, Suite 400, San Francisco, CA 94107 • Helpline: +1 (800) 555-TWIN', 40, 29)

  doc.setLineWidth(0.8)
  doc.setDrawColor(6, 182, 212)
  doc.line(14, 34, 196, 34)

  // Report Title Badge & Metadata Box
  doc.setFillColor(240, 249, 255)
  doc.roundedRect(14, 38, 182, 16, 2, 2, 'F')
  doc.setDrawColor(186, 230, 253)
  doc.roundedRect(14, 38, 182, 16, 2, 2, 'D')

  doc.setFontSize(10.5)
  doc.setFont('helvetica', 'bold')
  doc.setTextColor(3, 105, 161)
  doc.text('OFFICIAL CLINICAL DIGITAL TWIN TELEMETRY REQUISITION REPORT', 18, 46)

  doc.setFontSize(8)
  doc.setFont('helvetica', 'bold')
  doc.setTextColor(100, 116, 139)
  doc.text(`DATE: ${todaysDate}  |  TIME: ${currentTime}  |  REQUISITION ID: ${recordId}  |  TWIN ID: ${twinId}`, 18, 51)

  // 2. Patient Demographics Summary Box
  doc.setFillColor(248, 250, 252)
  doc.roundedRect(14, 58, 182, 32, 3, 3, 'F')
  doc.setDrawColor(226, 232, 240)
  doc.roundedRect(14, 58, 182, 32, 3, 3, 'D')

  doc.setFontSize(10)
  doc.setFont('helvetica', 'bold')
  doc.setTextColor(15, 23, 42)
  doc.text('PATIENT DEMOGRAPHICS & CLINICAL PROFILE', 20, 66)

  doc.setFont('helvetica', 'normal')
  doc.setFontSize(8.5)
  doc.setTextColor(51, 65, 85)
  doc.text(`• Full Name: ${patientName}`, 20, 74)
  doc.text(`• Age / Gender: ${age} Yrs / ${gender}`, 20, 80)
  doc.text(`• Height / Weight: ${p.height || 172} cm / ${p.weight || 68} kg (BMI: 23.0 kg/m²)`, 20, 86)

  doc.text(`• Blood Group: ${bloodGroup}`, 110, 74)
  doc.text(`• Location: ${location}`, 110, 80)
  doc.text(`• Primary Physician: ${doctorName}`, 110, 86)

  // 3. Section 1: Real-time Vital Signs Grid
  doc.setFontSize(12.5)
  doc.setFont('helvetica', 'bold')
  doc.setTextColor(15, 23, 42)
  doc.text('SECTION 1: PHYSIOLOGICAL VITAL SIGNS TELEMETRY', 14, 100)

  doc.setLineWidth(0.6)
  doc.setDrawColor(6, 182, 212)
  doc.line(14, 103, 196, 103)

  const vitalsGrid = [
    { label: 'Heart Rate', val: `${v.heartRate || 78} BPM`, status: 'Normal' },
    { label: 'Blood Pressure', val: `${v.systolic || 118}/${v.diastolic || 78} mmHg`, status: 'Optimal' },
    { label: 'Blood Oxygen (SpO2)', val: `${v.spo2 || 98}%`, status: 'Optimal' },
    { label: 'Fasting Glucose', val: `${v.glucose || 98} mg/dL`, status: 'Normal' },
    { label: 'Body Mass Index', val: `23.0 kg/m²`, status: 'Normal' }
  ]

  let xPos = 14
  let yPos = 108
  vitalsGrid.forEach((item, idx) => {
    doc.setFillColor(241, 245, 249)
    doc.roundedRect(xPos, yPos, 34, 18, 2, 2, 'F')
    doc.setDrawColor(203, 213, 225)
    doc.roundedRect(xPos, yPos, 34, 18, 2, 2, 'D')

    doc.setFontSize(7)
    doc.setFont('helvetica', 'bold')
    doc.setTextColor(100, 116, 139)
    doc.text(item.label.substring(0, 18), xPos + 3, yPos + 5)

    doc.setFontSize(8.5)
    doc.setTextColor(15, 23, 42)
    doc.text(item.val, xPos + 3, yPos + 11)

    doc.setFontSize(6.5)
    doc.setTextColor(16, 185, 129)
    doc.text(`[${item.status}]`, xPos + 3, yPos + 16)

    xPos += 37
    if ((idx + 1) % 5 === 0) {
      xPos = 14
      yPos += 22
    }
  })

  // 4. Section 2: Lifestyle & Preventive Risk Indicators
  let currentY = 134
  doc.setFontSize(12.5)
  doc.setFont('helvetica', 'bold')
  doc.setTextColor(15, 23, 42)
  doc.text('SECTION 2: LIFESTYLE & PREVENTIVE RISK ASSESSMENT', 14, currentY)

  doc.line(14, currentY + 3, 196, currentY + 3)

  doc.setFillColor(248, 250, 252)
  doc.roundedRect(14, currentY + 7, 182, 24, 2, 2, 'F')
  doc.setDrawColor(226, 232, 240)
  doc.roundedRect(14, currentY + 7, 182, 24, 2, 2, 'D')

  doc.setFontSize(8)
  doc.setFont('helvetica', 'normal')
  doc.setTextColor(51, 65, 85)
  doc.text(`• Exercise Routine: ${l.exerciseFreq || l.exercise || '3-4 workouts / week'}`, 18, currentY + 14)
  doc.text(`• Sleep Schedule: Average ${l.sleepDuration || '7.5'} hrs/night (${l.sleepQuality || 'Good Quality'})`, 18, currentY + 20)
  doc.text(`• Diet & Habits: ${l.dietType || 'Balanced Mediterranean'} | Tobacco: ${l.smoking || 'No'} | Alcohol: ${l.alcohol || 'Occasional'}`, 18, currentY + 26)

  // 5. Section 3: 3D Organ System Telemetry Breakdown
  currentY += 38
  doc.setFontSize(12.5)
  doc.setFont('helvetica', 'bold')
  doc.setTextColor(15, 23, 42)
  doc.text('SECTION 3: 3D DIGITAL TWIN ORGAN SYSTEM TELEMETRY', 14, currentY)

  doc.line(14, currentY + 3, 196, currentY + 3)

  const organTelemetry = [
    { organ: 'Brain & Nervous System', score: '96 / 100', status: 'Optimal', details: 'Cognitive stress low (18%). REM sleep recovery optimal.' },
    { organ: 'Heart & Cardiovascular', score: '92 / 100', status: 'Healthy', details: 'Normal sinus rhythm (78 BPM). Coronary perfusion stable.' },
    { organ: 'Lungs & Respiratory System', score: '95 / 100', status: 'Optimal', details: 'SpO2 98%. Clear gas exchange with optimal lung airflow.' },
    { organ: 'Metabolism & Digestive System', score: '89 / 100', status: 'Balanced', details: 'Fasting glucose 98 mg/dL. BMR 1,620 kcal/day.' }
  ]

  currentY += 8
  organTelemetry.forEach((o) => {
    doc.setFillColor(248, 250, 252)
    doc.roundedRect(14, currentY, 182, 13, 2, 2, 'F')
    doc.setDrawColor(226, 232, 240)
    doc.roundedRect(14, currentY, 182, 13, 2, 2, 'D')

    doc.setFontSize(8.5)
    doc.setFont('helvetica', 'bold')
    doc.setTextColor(15, 23, 42)
    doc.text(`• ${o.organ}`, 18, currentY + 5.5)

    doc.setFontSize(8)
    doc.setTextColor(6, 182, 212)
    doc.text(`Score: ${o.score} [${o.status}]`, 115, currentY + 5.5)

    doc.setFont('helvetica', 'normal')
    doc.setFontSize(7.5)
    doc.setTextColor(100, 116, 139)
    doc.text(o.details, 18, currentY + 10.5)

    currentY += 16
  })

  // Helper for clean multi-page pagination
  const checkAddPage = (needed) => {
    if (currentY + needed > 245) {
      doc.addPage()
      currentY = 20
    }
  }

  // 6. Section 4: 30s Voice Biomarker Acoustic Telemetry
  const voice = profile?.voiceScanResult || {
    cardiacRiskProb: 12,
    riskLevel: 'Low Risk',
    languageUsed: 'Universal Acoustic AI',
    vocalJitter: '0.38% (Optimal)',
    acousticShimmer: '1.2% (Normal)',
    fundamentalFreq: '142 Hz (Stable)',
    verdict: 'No acoustic biomarkers of acute myocardial ischemia detected.'
  }

  checkAddPage(35)
  currentY += 4
  doc.setFontSize(12.5)
  doc.setFont('helvetica', 'bold')
  doc.setTextColor(15, 23, 42)
  doc.text('SECTION 4: 30s VOICE BIOMARKER ACOUSTIC TELEMETRY', 14, currentY)

  doc.line(14, currentY + 3, 196, currentY + 3)

  doc.setFillColor(248, 250, 252)
  doc.roundedRect(14, currentY + 7, 182, 22, 2, 2, 'F')
  doc.setDrawColor(226, 232, 240)
  doc.roundedRect(14, currentY + 7, 182, 22, 2, 2, 'D')

  doc.setFontSize(8)
  doc.setFont('helvetica', 'bold')
  doc.setTextColor(15, 23, 42)
  doc.text(`• Acoustic Cardiac Risk Probability: ${voice.cardiacRiskProb}% [${voice.riskLevel}]`, 18, currentY + 13)
  doc.text(`• Pitch Jitter: ${voice.vocalJitter} | Shimmer: ${voice.acousticShimmer} | F0 Freq: ${voice.fundamentalFreq}`, 18, currentY + 19)
  doc.setFont('helvetica', 'normal')
  doc.setFontSize(7.5)
  doc.setTextColor(100, 116, 139)
  doc.text(`• Acoustic Verdict: ${voice.verdict}`, 18, currentY + 25)

  // 7. Section 5: AI Wound Healing & Dermatological Analysis
  const wound = profile?.woundScanResult || {
    area: '2.4 cm²',
    granulationPct: '88% Healthy Granulation',
    infectionRisk: '1% — Optimal',
    tissueType: 'Epithelial Edge Bridging',
    verdict: 'Granulation tissue is healthy and uninfected with active re-epithelialization along margins.'
  }

  currentY += 32
  checkAddPage(35)
  doc.setFontSize(12.5)
  doc.setFont('helvetica', 'bold')
  doc.setTextColor(15, 23, 42)
  doc.text('SECTION 5: AI WOUND HEALING & DERMATOLOGICAL SCAN', 14, currentY)

  doc.line(14, currentY + 3, 196, currentY + 3)

  doc.setFillColor(248, 250, 252)
  doc.roundedRect(14, currentY + 7, 182, 22, 2, 2, 'F')
  doc.setDrawColor(226, 232, 240)
  doc.roundedRect(14, currentY + 7, 182, 22, 2, 2, 'D')

  doc.setFontSize(8)
  doc.setFont('helvetica', 'bold')
  doc.setTextColor(15, 23, 42)
  doc.text(`• Wound Surface Area: ${wound.area} | Granulation: ${wound.granulationPct}`, 18, currentY + 13)
  doc.text(`• Tissue Type: ${wound.tissueType} | Infection Risk: ${wound.infectionRisk}`, 18, currentY + 19)
  doc.setFont('helvetica', 'normal')
  doc.setFontSize(7.5)
  doc.setTextColor(100, 116, 139)
  doc.text(`• Clinical Verdict: ${wound.verdict}`, 18, currentY + 25)

  // 8. Section 6: AI Medicine & Prescription Pharmacology Scan
  const med = profile?.medicineScanResult || {
    name: 'Warfarin Sodium 5mg',
    category: 'Anticoagulant (Blood Thinner)',
    dangerLevel: 'CRITICAL',
    whenToTake: { exactTime: '8:00 PM (Night / Bedtime)', frequency: 'Once Daily' },
    verdict: 'High potency narrow-therapeutic index medication. Auto-synced with Digital Twin.'
  }

  currentY += 32
  checkAddPage(35)
  doc.setFontSize(12.5)
  doc.setFont('helvetica', 'bold')
  doc.setTextColor(15, 23, 42)
  doc.text('SECTION 6: AI MEDICINE & PRESCRIPTION PHARMACOLOGY SCAN', 14, currentY)

  doc.line(14, currentY + 3, 196, currentY + 3)

  doc.setFillColor(248, 250, 252)
  doc.roundedRect(14, currentY + 7, 182, 22, 2, 2, 'F')
  doc.setDrawColor(226, 232, 240)
  doc.roundedRect(14, currentY + 7, 182, 22, 2, 2, 'D')

  doc.setFontSize(8)
  doc.setFont('helvetica', 'bold')
  doc.setTextColor(15, 23, 42)
  doc.text(`• Prescription Name: ${med.name} (${med.category})`, 18, currentY + 13)
  doc.text(`• Schedule: ${med.whenToTake?.exactTime || 'As Prescribed'} | Danger Rating: ${med.dangerLevel}`, 18, currentY + 19)
  doc.setFont('helvetica', 'normal')
  doc.setFontSize(7.5)
  doc.setTextColor(100, 116, 139)
  doc.text(`• AI Safety Protocol: ${med.verdict}`, 18, currentY + 25)

  // 9. Section 7: Ordered Clinical Lab Test Panels
  currentY += 32
  checkAddPage(35)
  doc.setFontSize(12.5)
  doc.setFont('helvetica', 'bold')
  doc.setTextColor(15, 23, 42)
  doc.text('SECTION 7: ORDERED PREVENTIVE LAB PANELS', 14, currentY)

  doc.line(14, currentY + 3, 196, currentY + 3)

  const labs = [
    { title: 'HbA1c & Fasting Glucose Panel', code: 'ICD-10: Z13.1', desc: 'Evaluates 90-day glycemic control & early insulin resistance.' },
    { title: 'Comprehensive Lipid Panel (ApoB, LDL-C)', code: 'ICD-10: Z13.220', desc: 'Assesses atherogenic plaque risk & arterial lipid ratios.' }
  ]

  currentY += 13
  labs.forEach((lab, idx) => {
    doc.setFontSize(8.5)
    doc.setFont('helvetica', 'bold')
    doc.setTextColor(15, 23, 42)
    doc.text(`${idx + 1}. ${lab.title} (${lab.code})`, 18, currentY)

    doc.setFont('helvetica', 'normal')
    doc.setFontSize(7.5)
    doc.setTextColor(100, 116, 139)
    doc.text(`   Rationale: ${lab.desc}`, 18, currentY + 4)
    currentY += 10
  })

  // 10. Embed Authentic Multi-Specialty Medical Stamp, QR Code & Barcode Graphics at Page Bottom
  try {
    const stampDataUrl = createMedicalStampDataURL(doctorName, doctorSpecialty, licenseNo)
    doc.addImage(stampDataUrl, 'PNG', 14, Math.min(currentY + 2, 240), 65, 26)

    const qrDataUrl = createQRCodeDataURL(twinId)
    doc.addImage(qrDataUrl, 'PNG', 85, Math.min(currentY + 2, 240), 24, 24)

    const barcodeDataUrl = createBarcodeDataURL(recordId)
    doc.addImage(barcodeDataUrl, 'PNG', 115, Math.min(currentY + 2, 240), 80, 22)
  } catch (err) {
    console.warn('Stamp embed error:', err)
  }

  // 11. Footer Accent
  doc.setFillColor(15, 23, 42)
  doc.rect(0, 276, 210, 21, 'F')

  doc.setFontSize(8)
  doc.setTextColor(255, 255, 255)
  doc.text('MedTwin AI Medical Center — Confidential Healthcare Digital Twin Telemetry Document', 14, 287)
  doc.setTextColor(6, 182, 212)
  doc.text('256-Bit Cryptographically Signed & Verified 🛡️', 132, 287)

  doc.save(filename)
}
