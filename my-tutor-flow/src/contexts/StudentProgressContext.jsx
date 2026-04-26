import { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react'
import { doc, getDoc, setDoc } from 'firebase/firestore'
import { db } from '../firebase.js'
import { useAuth } from './AuthContext.jsx'

const STORAGE_KEY = 'tdla_progress_v1'

const defaultBook = () => ({
  unitsViewed: [],
  quizScores: {},
  quizTotals: {},
  peelResponses: {},
  fillResponses: {},
  completed: false,
  stars: 0,
  lastVisited: null,
})

const defaultState = () => ({
  studentName: '',
  books: {},
  totalStars: 0,
  streak: 0,
  lastActiveDate: '',
})

const loadFromStorage = () => {
  if (typeof window === 'undefined') return defaultState()
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (!raw) return defaultState()
    const parsed = JSON.parse(raw)
    return { ...defaultState(), ...parsed, books: parsed.books || {} }
  } catch {
    return defaultState()
  }
}

const saveToStorage = (state) => {
  if (typeof window === 'undefined') return
  try { window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state)) } catch { }
}

const todayISO = () => new Date().toISOString().slice(0, 10)

const calcStars = (bookProgress, totalUnits) => {
  const viewed = bookProgress.unitsViewed || []
  const scores = bookProgress.quizScores || {}
  const totals = bookProgress.quizTotals || {}
  const unitIds = Object.keys(scores)
  if (unitIds.length === 0) return 1
  let earned = 0; let possible = 0
  unitIds.forEach(id => { earned += scores[id] || 0; possible += totals[id] || 0 })
  const pct = possible > 0 ? (earned / possible) * 100 : 0
  const allViewed = totalUnits ? viewed.length >= totalUnits : true
  if (allViewed && pct >= 80) return 3
  if (pct >= 60) return 2
  return 1
}

const computeTotalStars = (books) => Object.values(books).reduce((s, b) => s + (b.stars || 0), 0)

const updateStreak = (state) => {
  const today = todayISO()
  if (state.lastActiveDate === today) return state
  const yesterday = new Date(); yesterday.setDate(yesterday.getDate() - 1)
  const yesterdayISO = yesterday.toISOString().slice(0, 10)
  let streak = state.streak || 0
  streak = state.lastActiveDate === yesterdayISO ? streak + 1 : 1
  return { ...state, streak, lastActiveDate: today }
}

const ProgressContext = createContext(null)

export function StudentProgressProvider({ children }) {
  const [state, setState] = useState(() => loadFromStorage())
  const [cloudLoaded, setCloudLoaded] = useState(false)
  const { user } = useAuth()
  const saveTimerRef = useRef(null)

  // Load from Firestore when user logs in
  useEffect(() => {
    if (!user) { setCloudLoaded(false); return }
    getDoc(doc(db, 'progress', user.uid)).then(snap => {
      if (snap.exists()) {
        const cloudData = snap.data()
        setState(prev => ({
          ...prev,
          ...cloudData,
          books: { ...prev.books, ...cloudData.books },
          studentName: cloudData.studentName || prev.studentName,
        }))
      }
      setCloudLoaded(true)
    }).catch(() => setCloudLoaded(true))
  }, [user])

  // Save to localStorage always; debounce Firestore saves
  useEffect(() => {
    saveToStorage(state)
    if (!user || !cloudLoaded) return
    if (saveTimerRef.current) clearTimeout(saveTimerRef.current)
    saveTimerRef.current = setTimeout(() => {
      setDoc(doc(db, 'progress', user.uid), {
        ...state,
        uid: user.uid,
        email: user.email,
        displayName: user.displayName || state.studentName,
        updatedAt: new Date().toISOString(),
      }, { merge: true }).catch(() => { })
    }, 1500)
    return () => clearTimeout(saveTimerRef.current)
  }, [state, user, cloudLoaded])

  const setStudentName = useCallback((name) => {
    setState(prev => updateStreak({ ...prev, studentName: name }))
  }, [])

  const getBookProgress = useCallback((bookId) => state.books[bookId] || defaultBook(), [state])

  const touchBook = (prev, bookId, updater) => {
    const existing = prev.books[bookId] || defaultBook()
    const updated = updater(existing)
    updated.lastVisited = new Date().toISOString()
    const books = { ...prev.books, [bookId]: updated }
    return updateStreak({ ...prev, books, totalStars: computeTotalStars(books) })
  }

  const markUnitViewed = useCallback((bookId, unitId) => {
    setState(prev => touchBook(prev, bookId, (book) => {
      const unitsViewed = book.unitsViewed.includes(unitId) ? book.unitsViewed : [...book.unitsViewed, unitId]
      return { ...book, unitsViewed }
    }))
  }, [])

  const saveQuizScore = useCallback((bookId, unitId, score, total) => {
    setState(prev => touchBook(prev, bookId, (book) => {
      const quizScores = { ...book.quizScores, [unitId]: score }
      const quizTotals = { ...book.quizTotals, [unitId]: total }
      const next = { ...book, quizScores, quizTotals }
      next.stars = calcStars(next)
      return next
    }))
  }, [])

  const savePEELResponse = useCallback((bookId, unitId, questionIndex, field, value) => {
    setState(prev => touchBook(prev, bookId, (book) => {
      const key = `${unitId}-${questionIndex}`
      const existing = book.peelResponses[key] || { P: '', E: '', E2: '', L: '' }
      return { ...book, peelResponses: { ...book.peelResponses, [key]: { ...existing, [field]: value } } }
    }))
  }, [])

  const saveFillResponse = useCallback((bookId, unitId, sentenceIndex, value) => {
    setState(prev => touchBook(prev, bookId, (book) => {
      return { ...book, fillResponses: { ...book.fillResponses, [`${unitId}-${sentenceIndex}`]: value } }
    }))
  }, [])

  const getPEELResponse = useCallback((bookId, unitId, questionIndex) => {
    const key = `${unitId}-${questionIndex}`
    return (state.books[bookId]?.peelResponses?.[key]) || { P: '', E: '', E2: '', L: '' }
  }, [state])

  const getFillResponse = useCallback((bookId, unitId, sentenceIndex) => {
    return state.books[bookId]?.fillResponses?.[`${unitId}-${sentenceIndex}`] || ''
  }, [state])

  const getQuizScore = useCallback((bookId, unitId) => {
    const book = state.books[bookId]
    if (!book) return null
    const score = book.quizScores?.[unitId]
    const total = book.quizTotals?.[unitId]
    if (score === undefined || total === undefined) return null
    return { score, total }
  }, [state])

  const completeBook = useCallback((bookId, stars) => {
    setState(prev => touchBook(prev, bookId, (book) => {
      return { ...book, completed: true, stars: stars !== undefined ? stars : calcStars(book) }
    }))
  }, [])

  const getTotalStars = useCallback(() => computeTotalStars(state.books), [state])
  const getAllBookProgress = useCallback(() => state.books, [state])

  const clearProgress = useCallback(() => {
    if (typeof window !== 'undefined') window.localStorage.removeItem(STORAGE_KEY)
    setState(defaultState())
  }, [])

  return (
    <ProgressContext.Provider value={{
      studentName: state.studentName, streak: state.streak,
      setStudentName, getBookProgress, markUnitViewed, saveQuizScore,
      savePEELResponse, saveFillResponse, getPEELResponse, getFillResponse,
      getQuizScore, completeBook, getTotalStars, getAllBookProgress, clearProgress,
    }}>
      {children}
    </ProgressContext.Provider>
  )
}

export function useProgress() {
  const ctx = useContext(ProgressContext)
  if (!ctx) throw new Error('useProgress must be used within a StudentProgressProvider')
  return ctx
}

export default StudentProgressProvider
