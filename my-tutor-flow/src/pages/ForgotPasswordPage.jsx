import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext.jsx'

export default function ForgotPasswordPage() {
  const { resetPassword } = useAuth()
  const [email, setEmail] = useState('')
  const [sent, setSent] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await resetPassword(email)
      setSent(true)
    } catch {
      setError('Could not find an account with that email. Please check and try again.')
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-900 via-purple-800 to-indigo-900 flex items-center justify-center px-4">
      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl w-full max-w-md p-8">
        {sent ? (
          <div className="text-center">
            <div className="text-5xl mb-4">📬</div>
            <h1 className="text-2xl font-display font-black text-slate-800 dark:text-slate-100 mb-2">Check your inbox</h1>
            <p className="text-slate-500 dark:text-slate-400 text-sm mb-6">
              We sent a password reset link to <strong>{email}</strong>. It may take a minute to arrive.
            </p>
            <Link
              to="/login"
              className="w-full inline-block bg-violet-700 text-white font-bold py-3 rounded-xl hover:bg-violet-800 transition-colors text-center"
            >
              Back to Sign In
            </Link>
          </div>
        ) : (
          <>
            <div className="text-center mb-8">
              <div className="text-4xl mb-3">🔑</div>
              <h1 className="text-2xl font-display font-black text-slate-800 dark:text-slate-100">Reset your password</h1>
              <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Enter your email and we'll send you a reset link</p>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-3 text-sm mb-4">{error}</div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">Email address</label>
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  required
                  className="w-full border border-slate-200 dark:border-slate-600 rounded-xl px-4 py-3 text-sm bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-violet-400"
                  placeholder="your@email.com"
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-violet-700 text-white font-bold py-3 rounded-xl hover:bg-violet-800 transition-colors disabled:opacity-50"
              >
                {loading ? 'Sending…' : 'Send Reset Link'}
              </button>
            </form>

            <p className="text-center text-sm text-slate-500 dark:text-slate-400 mt-6">
              Remember your password?{' '}
              <Link to="/login" className="text-violet-700 font-semibold hover:underline">Sign in</Link>
            </p>
          </>
        )}
      </div>
    </div>
  )
}
