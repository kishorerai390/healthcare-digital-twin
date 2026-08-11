import { db, storage } from '../../firebase/config'
import { doc, setDoc, getDoc, updateDoc, collection, addDoc, query, where, getDocs, orderBy, serverTimestamp } from 'firebase/firestore'
import { ref as storageRef, uploadBytesResumable, getDownloadURL } from 'firebase/storage'

function ensureFirestore(){
  if(!db){
    throw new Error('Firebase Firestore is not configured. Check your Firebase environment variables.')
  }
}

function ensureStorage(){
  if(!storage){
    throw new Error('Firebase Storage is not configured. Check your Firebase environment variables.')
  }
}

function friendlyError(err){
  console.error(err)
  return new Error(err.message || 'An error occurred with Firebase')
}

export async function createUserProfile(uid, profile){
  ensureFirestore()
  try{
    const ref = doc(db, 'users', uid)
    await setDoc(ref, profile, { merge: true })
    return true
  }catch(e){
    throw friendlyError(e)
  }
}

export async function getUserProfile(uid){
  ensureFirestore()
  try{
    const ref = doc(db, 'users', uid)
    const snap = await getDoc(ref)
    if(!snap.exists()) return null
    return snap.data()
  }catch(e){
    throw friendlyError(e)
  }
}
 
export async function updateUserProfile(uid, updates){
  ensureFirestore()
  try{
    const ref = doc(db, 'users', uid)
    await updateDoc(ref, {...updates, updatedAt: serverTimestamp()})
    return true
  }catch(e){
    // if document doesn't exist, create it
    try{
      await setDoc(doc(db,'users',uid), {...updates, updatedAt: serverTimestamp()}, { merge: true })
      return true
    }catch(err){
      throw friendlyError(err)
    }
  }
}

export async function saveHealthProfile(uid, data){
  ensureFirestore()
  try{
    const ref = doc(db, 'users', uid, 'healthProfile', 'latest')
    const snapshot = await getDoc(ref)
    if(snapshot.exists()){
      await updateDoc(ref, { ...data, updatedAt: serverTimestamp() })
    } else {
      await setDoc(ref, { ...data, createdAt: serverTimestamp(), updatedAt: serverTimestamp() }, { merge: true })
    }
    return true
  }catch(e){
    throw friendlyError(e)
  }
}

export async function getHealthProfile(uid){
  ensureFirestore()
  try{
    const ref = doc(db, 'users', uid, 'healthProfile', 'latest')
    const snap = await getDoc(ref)
    return snap.exists() ? snap.data() : null
  }catch(e){
    throw friendlyError(e)
  }
}

export async function saveLifestyleData(uid, data){
  ensureFirestore()
  try{
    const ref = doc(db, 'users', uid, 'lifestyle', 'latest')
    await setDoc(ref, {...data, updatedAt: serverTimestamp()}, { merge: true })
    return true
  }catch(e){ throw friendlyError(e) }
}
export async function getLifestyleData(uid){
  ensureFirestore()
  try{
    const ref = doc(db, 'users', uid, 'lifestyle', 'latest')
    const snap = await getDoc(ref)
    return snap.exists() ? snap.data() : null
  }catch(e){ throw friendlyError(e) }
}

export async function saveMedicalData(uid, data){
  ensureFirestore()
  try{
    const ref = doc(db, 'users', uid, 'medicalData', 'latest')
    await setDoc(ref, {...data, updatedAt: serverTimestamp()}, { merge: true })
    return true
  }catch(e){ throw friendlyError(e) }
}
export async function getMedicalData(uid){
  ensureFirestore()
  try{
    const ref = doc(db, 'users', uid, 'medicalData', 'latest')
    const snap = await getDoc(ref)
    return snap.exists() ? snap.data() : null
  }catch(e){ throw friendlyError(e) }
}

export async function saveWearableData(uid, data){
  ensureFirestore()
  try{
    const ref = collection(db, 'users', uid, 'wearableData')
    const payload = {...data, recordedAt: serverTimestamp()}
    await addDoc(ref, payload)
    return true
  }catch(e){ throw friendlyError(e) }
}
export async function getWearableData(uid, limit = 50){
  ensureFirestore()
  try{
    const q = query(collection(db, 'users', uid, 'wearableData'), orderBy('recordedAt','desc'))
    const snaps = await getDocs(q)
    return snaps.docs.map(d=> ({ id: d.id, ...d.data() }))
  }catch(e){ throw friendlyError(e) }
}

export async function savePrediction(uid, payload){
  ensureFirestore()
  try{
    const ref = collection(db, 'users', uid, 'predictions')
    const docRef = await addDoc(ref, {...payload, createdAt: serverTimestamp()})
    return { id: docRef.id }
  }catch(e){ throw friendlyError(e) }
}
export async function getPredictions(uid){
  ensureFirestore()
  try{
    const snaps = await getDocs(collection(db, 'users', uid, 'predictions'))
    return snaps.docs.map(d=> ({ id: d.id, ...d.data() }))
  }catch(e){ throw friendlyError(e) }
}

export async function saveSimulation(uid, payload){
  ensureFirestore()
  try{
    const ref = collection(db, 'users', uid, 'simulations')
    const docRef = await addDoc(ref, {...payload, createdAt: serverTimestamp()})
    return { id: docRef.id }
  }catch(e){ throw friendlyError(e) }
}
export async function getSimulations(uid){
  ensureFirestore()
  try{
    const snaps = await getDocs(collection(db, 'users', uid, 'simulations'))
    return snaps.docs.map(d=> ({ id: d.id, ...d.data() }))
  }catch(e){ throw friendlyError(e) }
}

export async function saveRecommendation(uid, payload){
  ensureFirestore()
  try{
    const ref = collection(db, 'users', uid, 'recommendations')
    const docRef = await addDoc(ref, {...payload, createdAt: serverTimestamp(), completed: false})
    return { id: docRef.id }
  }catch(e){ throw friendlyError(e) }
}
export async function getRecommendations(uid){
  ensureFirestore()
  try{
    const snaps = await getDocs(collection(db, 'users', uid, 'recommendations'))
    return snaps.docs.map(d=> ({ id: d.id, ...d.data() }))
  }catch(e){ throw friendlyError(e) }
}

export async function uploadReport(uid, file){
  ensureStorage()
  ensureFirestore()
  try{
    const path = `users/${uid}/reports/${Date.now()}_${file.name}`
    const sref = storageRef(storage, path)
    const uploadTask = uploadBytesResumable(sref, file)

    return new Promise((resolve,reject)=>{
      uploadTask.on('state_changed', null, (err)=> reject(friendlyError(err)), async ()=>{
        const url = await getDownloadURL(uploadTask.snapshot.ref)
        const ref = collection(db, 'users', uid, 'reports')
        const docRef = await addDoc(ref, { name: file.name, size: file.size, contentType: file.type, url, createdAt: serverTimestamp() })
        resolve({ id: docRef.id, url })
      })
    })
  }catch(e){ throw friendlyError(e) }
}

export default {
  createUserProfile, getUserProfile, updateUserProfile,
  saveHealthProfile, getHealthProfile,
  saveLifestyleData, getLifestyleData, saveMedicalData, getMedicalData,
  saveWearableData, getWearableData, savePrediction, getPredictions,
  saveSimulation, getSimulations, saveRecommendation, getRecommendations,
  uploadReport
}
