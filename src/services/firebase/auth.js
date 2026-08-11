import { auth } from '../../firebase/config'
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut as fbSignOut,
  sendPasswordResetEmail,
  onAuthStateChanged,
  updateProfile,
  GoogleAuthProvider,
  signInWithPopup
} from 'firebase/auth'
import { createUserProfile } from './database'

function ensureAuth(){
  if(!auth){
    throw new Error('Firebase Authentication is not configured. Check your Firebase environment variables.')
  }
}

export async function signInWithGoogle(){
  ensureAuth()
  const provider = new GoogleAuthProvider()
  const res = await signInWithPopup(auth, provider)
  const user = res.user
  try{
    await createUserProfile(user.uid, {
      fullName: user.displayName || 'User',
      email: user.email,
      photoURL: user.photoURL || null,
      updatedAt: new Date().toISOString()
    })
  }catch(profileError){
    console.warn('Firestore profile setup failed for Google user:', profileError)
  }
  return { user }
}

export async function signUp(email, password, fullName){
  ensureAuth()
  const userCred = await createUserWithEmailAndPassword(auth, email, password)
  const user = userCred.user
  try{
    await updateProfile(user, { displayName: fullName })
    await createUserProfile(user.uid, { fullName, email, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() })
  }catch(profileError){
    console.error('Firestore profile creation failed after auth:', profileError)
    const error = new Error('Authentication succeeded, but the user profile could not be saved to Firestore. Check Firestore Security Rules.')
    error.code = profileError.code || 'permission-denied'
    throw error
  }
  return { user }
}

export async function signIn(email, password){
  ensureAuth()
  try{
    const userCred = await signInWithEmailAndPassword(auth, email, password)
    return { user: userCred.user }
  }catch(err){
    throw err
  }
}

export async function signOut(){
  ensureAuth()
  return await fbSignOut(auth)
}

export async function resetPassword(email){
  ensureAuth()
  return await sendPasswordResetEmail(auth, email)
}

export function onAuthChange(callback){
  ensureAuth()
  return onAuthStateChanged(auth, callback)
}
