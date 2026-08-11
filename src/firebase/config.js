// Firebase configuration and initialization
import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'
import { getStorage } from 'firebase/storage'

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
}

const requiredKeys = ['apiKey', 'authDomain', 'projectId', 'storageBucket', 'messagingSenderId', 'appId']
const missingKeys = requiredKeys.filter((key) => {
  const value = firebaseConfig[key]
  return !value || typeof value !== 'string' || value.length === 0 || value.startsWith('VITE_')
})

const isFirebaseConfigValid = missingKeys.length === 0

let app = null
let auth = null
let db = null
let storage = null
let firebaseError = null

if(isFirebaseConfigValid){
  try{
    app = initializeApp(firebaseConfig)
    auth = getAuth(app)
    db = getFirestore(app)
    storage = getStorage(app)
  }catch(error){
    firebaseError = error
    console.warn('Firebase initialization failed:', error)
  }
} else {
  firebaseError = new Error(`Firebase environment variables are missing or invalid: ${missingKeys.join(', ')}`)
  console.warn(`Firebase config is missing or invalid. Missing env vars: ${missingKeys.join(', ')}. Running in local-only mode.`)
}

export { auth, db, storage, firebaseConfig, isFirebaseConfigValid, firebaseError }
export default app
