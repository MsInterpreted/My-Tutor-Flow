import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext.jsx'

export default function SignupPage() {
  const { signup, loginWithGoogle } = useAuth()
  const navigate = useNavigate()
  const [step, setStep] = useState(1)
  const [form, setForm] = useState({
    displayName: '', email: '', password: '', confirmPassword: '',
    isUnder13: false, parentEmail: '', agreeTerms: false
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  function set(field, value) { setForm(f => ({ ...f, [field]: value })) }

  function nextStep(e) {
    e.preventDefault()
    setError('')
    if (!form.displayName.trim()) return setError('Please enter your name.')
    if (form.isUnder13 && !form.parentEmail.trim()) return setError('A parent email is required for students under 13.')
    setStep(2)
  }

  async function handleSignup(e) {
    e.preventDefault()
    setError('')
    if (form.password.length < 6) return setError('Password must be at least 6 characters.')
    if (form.password !== form.confirmPassword) return setError('Passwords do not match.')
    if (!form.agreeTerms) return setError('Please agree to the terms to continue.')
    setLoading(true)
    try {
      await signup({
        email: form.email,
        password: form.password,
        displayName: form.displayName,
        isUnder13: form.isUnder13,
        parentEmail: form.parentEmail
      })
      navigate('/books')
    } catch (err) {
      if (err.code === 'auth/email-already-in-use') setError('This email is already registered. Try signing in.')
      else setError('Something went wrong. Please try again.')
    }
    setLoading(false)
  }

  async function handleGoogle() {
    try {
      await loginWithGoogle()
      navigate('/books')
    } catch {
      setError('Google sign-in failed. Please try again.')
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-900 via-purple-800 to-indigo-900 flex items-center justify-center px-4 py-12">
      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl w-full max-w-md p-8">
        <div className="text-center mb-6">
          <div className="text-4xl mb-3">🌟</div>
          <h1 className="text-2xl font-display font-black text-slate-800 dark:text-slate-100">Create your account</h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Start with a free book — no card needed</p>
        </div>

        {/* Step indicator */}
        <div className="flex items-center gap-2 mb-6">
          {[1, 2].map(n => (
            <div key={n} className="flex-1">
              <div className={`h-1.5 rounded-full transition-colors ${step >= n ? 'bg-violet-600' : 'bg-slate-200 dark:bg-slate-600'}`} />
            </div>
          ))}
        </div>

        {error && (
          <div className="bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-700 text-red-700 dark:text-red-300 rounded-xl px-4 py-3 text-sm mb-4">{error}</div>
        )}

        {step === 1 && (
          <form onSubmit={nextStep} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">Student's name</label>
              <input
                type="text"
                value={form.displayName}
                onChange={e => set('displayName', e.target.value)}
                required
                className="w-full border border-slate-200 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-100 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-violet-400"
                placeholder="e.g. Leila"
              />
            </div>

            <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-700 rounded-xl p-4">
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.isUnder13}
                  onChange={e => set('isUnder13', e.target.checked)}
                  className="mt-0.5 accent-violet-600"
                />
                <span className="text-sm text-amber-800 dark:text-amber-300">
                  <strong>This student is under 13 years old</strong>
                  <span className="block text-xs mt-0.5 text-amber-700 dark:text-amber-400">A parent email is required for children under 13 (COPPA/POPIA)</span>
                </span>
              </label>
            </div>

            {form.isUnder13 && (
              <div>
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">Parent / Guardian email</label>
                <input
                  type="email"
                  value={form.parentEmail}
                  onChange={e => set('parentEmail', e.target.value)}
                  className="w-full border border-slate-200 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-100 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-violet-400"
                  placeholder="parent@email.com"
                />
                <p className="text-xs text-slate-400 mt-1">A confirmation email will be sent to the parent.</p>
              </div>
            )}

            <button
              type="submit"
              className="w-full bg-violet-700 text-white font-bold py-3 rounded-xl hover:bg-violet-800 transition-colors"
            >
              Continue →
            </button>

            <div className="flex items-center gap-3 my-1">
              <div className="flex-1 h-px bg-slate-200 dark:bg-slate-600" />
              <span className="text-xs text-slate-400">or</span>
              <div className="flex-1 h-px bg-slate-200 dark:bg-slate-600" />
            </div>

            <button
              type="button"
              onClick={handleGoogle}
              className="w-full border border-slate-200 dark:border-slate-600 text-slate-700 dark:text-slate-200 font-semibold py-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors flex items-center justify-center gap-3"
            >
              <svg className="w-5 h-5" viewBox="0 0 48 48"><path fill="#FFC107" d="M43.6 20H24v8h11.3C33.7 33.1 29.3 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3 0 5.8 1.1 7.9 3l5.7-5.7C34 6.5 29.3 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20c11 0 20-9 20-20 0-1.3-.1-2.7-.4-4z"/><path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.5 16 19 13 24 13c3 0 5.8 1.1 7.9 3l5.7-5.7C34 6.5 29.3 4 24 4 16.3 4 9.7 8.3 6.3 14.7z"/><path fill="#4CAF50" d="M24 44c5.2 0 9.9-1.9 13.4-5.1l-6.2-5.2C29.3 35.3 26.8 36 24 36c-5.2 0-9.6-2.9-11.3-7.1l-6.6 5.1C9.6 39.6 16.3 44 24 44z"/><path fill="#1976D2" d="M43.6 20H24v8h11.3c-.9 2.5-2.5 4.6-4.7 6l6.2 5.2C40.7 35.6 44 30.2 44 24c0-1.3-.1-2.7-.4-4z"/></svg>
              Sign up with Google
            </button>
          </form>
        )}

        {step === 2 && (
          <form onSubmit={handleSignup} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">Email address</label>
              <input
                type="email"
                value={form.email}
                onChange={e => set('email', e.target.value)}
                required
                className="w-full border border-slate-200 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-100 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-violet-400"
                placeholder="your@email.com"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">Password</label>
              <input
                type="password"
                value={form.password}
                onChange={e => set('password', e.target.value)}
                required
                className="w-full border border-slate-200 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-100 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-violet-400"
                placeholder="At least 6 characters"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">Confirm password</label>
              <input
                type="password"
                value={form.confirmPassword}
                onChange={e => set('confirmPassword', e.target.value)}
                required
                className="w-full border border-slate-200 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-100 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-violet-400"
                placeholder="••••••••"
              />
            </div>
            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={form.agreeTerms}
                onChange={e => set('agreeTerms', e.target.checked)}
                className="mt-0.5 accent-violet-600"
              />
              <span className="text-xs text-slate-600 dark:text-slate-300">
                I agree to the <a href="/terms" className="text-violet-600 underline">Terms of Service</a> and <a href="/privacy" className="text-violet-600 underline">Privacy Policy</a>
              </span>
            </label>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="flex-1 border border-slate-200 dark:border-slate-600 text-slate-600 dark:text-slate-300 font-semibold py-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700"
              >
                ← Back
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 bg-violet-700 text-white font-bold py-3 rounded-xl hover:bg-violet-800 transition-colors disabled:opacity-50"
              >
                {loading ? 'Creating…' : 'Create Account'}
              </button>
            </div>
          </form>
        )}

        <p className="text-center text-sm text-slate-500 dark:text-slate-400 mt-6">
          Already have an account?{' '}
          <Link to="/login" className="text-violet-700 dark:text-violet-400 font-semibold hover:underline">Sign in</Link>
        </p>
      </div>
    </div>
  )
}
