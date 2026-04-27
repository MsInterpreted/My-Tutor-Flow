import { createContext, useContext, useEffect, useState } from 'react'
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
  updateProfile,
  sendPasswordResetEmail
} from 'firebase/auth'
import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore'
import { auth, db, googleProvider } from '../firebase.js'

const AuthContext = createContext(null)
export const useAuth = () => useContext(AuthContext)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser)
      if (firebaseUser) {
        try {
          const snap = await getDoc(doc(db, 'users', firebaseUser.uid))
          setProfile(snap.exists() ? snap.data() : null)
        } catch {
          setProfile(null)
        }
      } else {
        setProfile(null)
      }
      setLoading(false)
    })
    return unsub
  }, [])

  async function signup({ email, password, displayName, isUnder13, parentEmail, role = 'student' }) {
    const cred = await createUserWithEmailAndPassword(auth, email, password)
    await updateProfile(cred.user, { displayName })
    const profileData = {
      uid: cred.user.uid,
      email,
      displayName,
      role,
      isUnder13: !!isUnder13,
      parentEmail: isUnder13 ? parentEmail : null,
      parentApproved: !isUnder13,
      subscription: 'free',
      purchasedBooks: [],
      createdAt: serverTimestamp(),
      lastActive: serverTimestamp()
    }
    await setDoc(doc(db, 'users', cred.user.uid), profileData)
    setProfile(profileData)
    return cred.user
  }

  async function loginWithGoogle() {
    const cred = await signInWithPopup(auth, googleProvider)
    const snap = await getDoc(doc(db, 'users', cred.user.uid))
    if (!snap.exists()) {
      const profileData = {
        uid: cred.user.uid,
        email: cred.user.email,
        displayName: cred.user.displayName,
        role: 'student',
        isUnder13: false,
        parentEmail: null,
        parentApproved: true,
        subscription: 'free',
        purchasedBooks: [],
        createdAt: serverTimestamp(),
        lastActive: serverTimestamp()
      }
      await setDoc(doc(db, 'users', cred.user.uid), profileData)
      setProfile(profileData)
    } else {
      setProfile(snap.data())
    }
    return cred.user
  }

  async function login(email, password) {
    const cred = await signInWithEmailAndPassword(auth, email, password)
    const snap = await getDoc(doc(db, 'users', cred.user.uid))
    if (snap.exists()) setProfile(snap.data())
    return cred.user
  }

  async function logout() {
    await signOut(auth)
    setProfile(null)
  }

  async function resetPassword(email) {
    await sendPasswordResetEmail(auth, email)
  }

  function hasAccessToBook(bookId) {
    if (!profile) return false
    if (profile.subscription === 'premium' || profile.subscription === 'institution' || profile.subscription === 'monthly' || profile.subscription === 'annual') return true
    if (profile.purchasedBooks?.includes(bookId)) return true
    return false
  }

  const isTeacher = profile?.role === 'teacher' || profile?.role === 'admin'

  return (
    <AuthContext.Provider value={{
      user, profile, loading,
      signup, login, loginWithGoogle, logout, resetPassword,
      hasAccessToBook, isTeacher
    }}>
      {!loading && children}
    </AuthContext.Provider>
  )
}
