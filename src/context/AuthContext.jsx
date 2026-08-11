import React, { createContext, useContext, useEffect, useState } from 'react'
import { auth, isFirebaseConfigValid } from '../firebase/config'
import { onAuthStateChanged } from 'firebase/auth'
import * as fbAuth from '../services/firebase/auth'
import * as db from '../services/firebase/database'

const AuthContext = createContext()

export function useAuth(){ return useContext(AuthContext) }

export function AuthProvider({ children }){
  const [currentUser, setCurrentUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [userProfile, setUserProfile] = useState(null)
  const [healthProfile, setHealthProfile] = useState(null)
  const [lifestyleProfile, setLifestyleProfile] = useState(null)

  const loadProfiles = async (user) => {
    if(!user) return { profileData: null, healthData: null, lifestyleData: null }
    try{
      const [profileData, healthData, lifestyleData] = await Promise.all([
        db.getUserProfile(user.uid),
        db.getHealthProfile(user.uid),
        db.getLifestyleData(user.uid)
      ])
      setUserProfile(profileData)
      setHealthProfile(healthData)
      setLifestyleProfile(lifestyleData)
      return { profileData, healthData, lifestyleData }
    }catch(e){
      console.warn('Failed to load firebase profiles:', e)
      setUserProfile(null)
      setHealthProfile(null)
      setLifestyleProfile(null)
      return { profileData: null, healthData: null, lifestyleData: null }
    }
  }

  useEffect(()=>{
    if(!isFirebaseConfigValid || !auth){
      setLoading(false)
      return
    }

    let isMounted = true
    const timer = setTimeout(() => {
      if(isMounted) setLoading(false)
    }, 1500)

    const unsub = onAuthStateChanged(auth, async (user)=>{
      try{
        setCurrentUser(user)
        if(user){
          await loadProfiles(user)
        } else if(!currentUser?.isGuest){
          setUserProfile(null)
          setHealthProfile(null)
          setLifestyleProfile(null)
        }
      }catch(e){
        console.warn('onAuthStateChanged load profile error:', e)
      }finally{
        if(isMounted) setLoading(false)
        clearTimeout(timer)
      }
    })

    return ()=>{
      isMounted = false
      clearTimeout(timer)
      unsub()
    }
  }, [])

  const signup = async (email, password, fullName)=>{
    const res = await fbAuth.signUp(email, password, fullName)
    if(res.user){
      setCurrentUser(res.user)
      const { healthData } = await loadProfiles(res.user)
      return { ...res, healthProfile: healthData }
    }
    return res
  }

  const signin = async (email, password)=>{
    const res = await fbAuth.signIn(email, password)
    if(res.user){
      setCurrentUser(res.user)
      const { healthData } = await loadProfiles(res.user)
      return { ...res, healthProfile: healthData }
    }
    return res
  }

  const guestLogin = ()=>{
    const demoUser = { uid: 'demo-guest', displayName: 'Guest User', email: 'guest@demo.local', isGuest: true }
    const demoHealth = { age: 34, gender: 'female', height: 168, weight: 62, heartRate: 72, bloodPressure: '118/78', recovery_progress: 92, risk_score: 'low' }
    setCurrentUser(demoUser)
    setUserProfile({ fullName: 'Guest User', email: 'guest@demo.local' })
    setHealthProfile(demoHealth)
    setLoading(false)
    return { user: demoUser, healthProfile: demoHealth }
  }

  const loginWithCustomUser = (email, fullName)=>{
    const rawName = fullName || (email ? email.split('@')[0] : 'Patient User')
    const formattedName = rawName.charAt(0).toUpperCase() + rawName.slice(1)
    const userObj = {
      uid: 'user-' + Date.now(),
      displayName: formattedName,
      email: email || 'user@medtwin.local',
      isGuest: false
    }
    const healthObj = {
      personalInfo: {
        fullName: formattedName,
        email: email || '',
        age: 32,
        gender: 'Male',
        height: '172',
        weight: '68',
        bloodGroup: 'O+',
        location: 'San Francisco, CA'
      }
    }
    setCurrentUser(userObj)
    setUserProfile({ fullName: formattedName, email })
    setHealthProfile(healthObj)
    setLoading(false)
    return { user: userObj, healthProfile: healthObj }
  }

  const signout = async ()=>{
    if(currentUser?.isGuest){
      setCurrentUser(null)
      setUserProfile(null)
      setHealthProfile(null)
      setLifestyleProfile(null)
      return
    }
    await fbAuth.signOut()
    setCurrentUser(null)
    setUserProfile(null)
    setHealthProfile(null)
    setLifestyleProfile(null)
  }

  const resetPassword = async (email)=> fbAuth.resetPassword(email)

  const refreshProfiles = async ()=>{
    if(currentUser && !currentUser.isGuest){
      await loadProfiles(currentUser)
    }
  }

  const signinWithGoogle = async ()=>{
    const res = await fbAuth.signInWithGoogle()
    if(res.user){
      setCurrentUser(res.user)
      const { healthData } = await loadProfiles(res.user)
      return { ...res, healthProfile: healthData }
    }
    return res
  }

  const value = {
    currentUser,
    userProfile,
    healthProfile,
    lifestyleProfile,
    loading,
    signup,
    signin,
    guestLogin,
    loginWithCustomUser,
    signinWithGoogle,
    signout,
    resetPassword,
    refreshProfiles,
    setHealthProfile,
    setLifestyleProfile
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
