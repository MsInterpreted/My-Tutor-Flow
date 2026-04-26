import { useEffect, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { doc, updateDoc, arrayUnion } from 'firebase/firestore'
import { db } from '../firebase.js'
import { useAuth } from '../contexts/AuthContext.jsx'

export default function CheckoutSuccess() {
  const [searchParams] = useSearchParams()
  const { user, profile } = useAuth()
  const [status, setStatus] = useState('verifying') // verifying | done | error
  const [detail, setDetail] = useState(null)

  useEffect(() => {
    const sessionId = searchParams.get('session_id')
    const method = searchParams.get('method')

    if (method === 'payfast') {
      // PayFast success — server ITN already fires; just update client-side optimistically
      activate({ planId: null, bookId: null, source: 'payfast' })
      return
    }

    if (sessionId) {
      verifyStripe(sessionId)
    } else {
      setStatus('error')
    }
  }, [])

  async function verifyStripe(sessionId) {
    try {
      const res = await fetch(`/api/verify-stripe-session?session_id=${sessionId}`)
      const data = await res.json()
      if (data.paid) {
        await activate(data)
      } else {
        setStatus('error')
      }
    } catch {
      setStatus('error')
    }
  }

  async function activate({ planId, bookId }) {
    if (!user) { setStatus('done'); return }
    try {
      const ref = doc(db, 'users', user.uid)
      if (planId === 'monthly' || planId === 'annual') {
        await updateDoc(ref, { subscription: 'premium' })
        setDetail({ type: 'plan', label: planId === 'annual' ? 'Annual All-Access' : 'Monthly All-Access' })
      } else if (bookId && bookId !== '') {
        await updateDoc(ref, { purchasedBooks: arrayUnion(bookId) })
        setDetail({ type: 'book', label: bookId.replace(/-/g, ' ') })
      }
      setStatus('done')
    } catch {
      setStatus('done') // still show success — webhook will fix Firestore
    }
  }

  if (status === 'verifying') {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-violet-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-slate-600 font-medium">Confirming your payment…</p>
        </div>
      </div>
    )
  }

  if (status === 'error') {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex items-center justify-center px-4">
        <div className="bg-white dark:bg-slate-800 rounded-2xl border border-red-200 dark:border-red-800 p-8 max-w-md w-full text-center">
          <div className="text-5xl mb-4">⚠️</div>
          <h1 className="text-xl font-bold text-slate-800 mb-2">We couldn't verify your payment</h1>
          <p className="text-slate-500 text-sm mb-6">Your payment may have still gone through. Please contact us and we'll sort it out.</p>
          <a href="mailto:hello@mytutorflow.com?subject=Payment%20Verification%20Issue"
            className="block w-full bg-violet-700 text-white font-bold py-3 rounded-xl hover:bg-violet-800 mb-3">
            Contact Support
          </a>
          <Link to="/pricing" className="text-sm text-slate-500 hover:underline">Back to Pricing</Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex items-center justify-center px-4">
      <div className="bg-white dark:bg-slate-800 rounded-2xl border border-green-200 dark:border-green-800 p-8 max-w-md w-full text-center shadow-sm">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h1 className="text-2xl font-display font-black text-slate-800 dark:text-slate-100 mb-2">Payment successful!</h1>
        {detail?.type === 'plan' ? (
          <p className="text-slate-500 dark:text-slate-400 mb-6">Your <strong>{detail.label}</strong> subscription is now active. All 9 books are unlocked.</p>
        ) : detail?.type === 'book' ? (
          <p className="text-slate-500 dark:text-slate-400 mb-6">You now own <strong className="capitalize">{detail.label}</strong>. Happy learning!</p>
        ) : (
          <p className="text-slate-500 dark:text-slate-400 mb-6">Your access has been activated. Start learning now!</p>
        )}
        <Link to="/books" className="block w-full bg-violet-700 text-white font-bold py-3 rounded-xl hover:bg-violet-800 mb-3 transition-colors">
          Start Reading →
        </Link>
        <Link to="/dashboard" className="text-sm text-violet-600 hover:underline">View My Dashboard</Link>
      </div>
    </div>
  )
}
