// HL7 FHIR R4 Standard Clinical Data Exporter for MedTwin AI

export function downloadFHIRClinicalRecord(profile, filename = 'MedTwin_FHIR_Clinical_Record.json') {
  const p = profile?.personalInfo || {}
  const v = profile?.vitals || {}
  const voice = profile?.voiceScanResult || {}
  const wound = profile?.woundScanResult || {}
  const med = profile?.medicineScanResult || {}

  const fhirBundle = {
    resourceType: 'Bundle',
    type: 'document',
    timestamp: new Date().toISOString(),
    identifier: {
      system: 'urn:ietf:rfc:3986',
      value: `urn:uuid:${profile?.twinId || 'TWIN-88412-US'}`
    },
    entry: [
      // 1. FHIR Patient Resource
      {
        resource: {
          resourceType: 'Patient',
          id: profile?.twinId || 'TWIN-88412-US',
          active: true,
          name: [
            {
              use: 'official',
              text: p.fullName || 'Alex Morgan',
              family: (p.fullName || 'Morgan').split(' ').pop(),
              given: [(p.fullName || 'Alex').split(' ')[0]]
            }
          ],
          gender: (p.gender || 'male').toLowerCase(),
          extension: [
            {
              url: 'http://hl7.org/fhir/StructureDefinition/patient-bloodGroup',
              valueString: p.bloodGroup || 'O+'
            }
          ],
          address: [
            {
              text: p.location || 'San Francisco, CA, USA',
              country: p.country || 'United States'
            }
          ]
        }
      },
      // 2. FHIR Vital Signs Observation
      {
        resource: {
          resourceType: 'Observation',
          status: 'final',
          category: [
            {
              coding: [
                {
                  system: 'http://terminology.hl7.org/CodeSystem/observation-category',
                  code: 'vital-signs',
                  display: 'Vital Signs'
                }
              ]
            }
          ],
          code: {
            text: 'Physiological Vital Signs Bundle'
          },
          component: [
            {
              code: { text: 'Heart Rate' },
              valueQuantity: { value: v.heartRate || 76, unit: 'BPM', code: '/min' }
            },
            {
              code: { text: 'Systolic Blood Pressure' },
              valueQuantity: { value: v.systolic || 118, unit: 'mmHg', code: 'mm[Hg]' }
            },
            {
              code: { text: 'Diastolic Blood Pressure' },
              valueQuantity: { value: v.diastolic || 78, unit: 'mmHg', code: 'mm[Hg]' }
            },
            {
              code: { text: 'Blood Oxygen SpO2' },
              valueQuantity: { value: v.spo2 || 98, unit: '%', code: '%' }
            },
            {
              code: { text: 'Fasting Blood Glucose' },
              valueQuantity: { value: v.glucose || 98, unit: 'mg/dL', code: 'mg/dL' }
            }
          ]
        }
      },
      // 3. FHIR Voice Acoustic Diagnostic Report
      {
        resource: {
          resourceType: 'DiagnosticReport',
          status: 'final',
          code: { text: '30s Voice Biomarker Acoustic Cardiac Telemetry' },
          conclusion: voice.verdict || 'No acoustic biomarkers of acute myocardial ischemia detected.',
          extension: [
            { url: 'http://medtwin.ai/fhir/cardiacRisk', valueDecimal: voice.cardiacRiskProb || 12 },
            { url: 'http://medtwin.ai/fhir/vocalJitter', valueString: voice.vocalJitter || '0.38%' }
          ]
        }
      },
      // 4. FHIR Medication Statement
      {
        resource: {
          resourceType: 'MedicationStatement',
          status: 'active',
          medicationCodeableConcept: {
            text: med.name || 'Warfarin Sodium 5mg'
          },
          dosage: [
            {
              text: med.whenToTake?.exactTime || '8:00 PM Bedtime',
              timing: { repeat: { frequency: 1, period: 1, periodUnit: 'd' } }
            }
          ]
        }
      }
    ]
  }

  const jsonString = JSON.stringify(fhirBundle, null, 2)
  const blob = new Blob([jsonString], { type: 'application/json' })
  const url = URL.createObjectURL(blob)

  const a = document.createElement('a')
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}
