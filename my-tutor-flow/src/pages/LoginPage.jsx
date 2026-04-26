import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext.jsx'

export default function LoginPage() {
  const { login, loginWithGoogle } = useAuth()
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleLogin(e) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await login(email, password)
      navigate('/books')
    } catch {
      setError('Incorrect email or password. Please try again.')
    }
    setLoading(false)
  }

  async function handleGoogle() {
    setError('')
    try {
      await loginWithGoogle()
      navigate('/books')
    } catch {
      setError('Google sign-in failed. Please try again.')
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-900 via-purple-800 to-indigo-900 flex items-center justify-center px-4">
      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl w-full max-w-md p-8">
        <div className="text-center mb-8">
          <div className="text-4xl mb-3">📚</div>
          <h1 className="text-2xl font-display font-black text-slate-800 dark:text-slate-100">Welcome back</h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Sign in to My Tutor Flow</p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-3 text-sm mb-4">{error}</div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">Email address</label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              className="w-full border border-slate-200 dark:border-slate-600 rounded-xl px-4 py-3 text-sm bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-violet-400"
              placeholder="your@email.com"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              className="w-full border border-slate-200 dark:border-slate-600 rounded-xl px-4 py-3 text-sm bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-violet-400"
              placeholder="••••••••"
            />
          </div>
          <div className="text-right">
            <Link to="/forgot-password" className="text-xs text-violet-600 hover:underline">Forgot password?</Link>
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-violet-700 text-white font-bold py-3 rounded-xl hover:bg-violet-800 transition-colors disabled:opacity-50"
          >
            {loading ? 'Signing in…' : 'Sign In'}
          </button>
        </form>

        <div className="flex items-center gap-3 my-5">
          <div className="flex-1 h-px bg-slate-200" />
          <span className="text-xs text-slate-400">or</span>
          <div className="flex-1 h-px bg-slate-200" />
        </div>

        <button
          onClick={handleGoogle}
          className="w-full border border-slate-200 text-slate-700 font-semibold py-3 rounded-xl hover:bg-slate-50 transition-colors flex items-center justify-center gap-3"
        >
          <svg className="w-5 h-5" viewBox="0 0 48 48"><path fill="#FFC107" d="M43.6 20H24v8h11.3C33.7 33.1 29.3 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3 0 5.8 1.1 7.9 3l5.7-5.7C34 6.5 29.3 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20c11 0 20-9 20-20 0-1.3-.1-2.7-.4-4z"/><path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.5 16 19 13 24 13c3 0 5.8 1.1 7.9 3l5.7-5.7C34 6.5 29.3 4 24 4 16.3 4 9.7 8.3 6.3 14.7z"/><path fill="#4CAF50" d="M24 44c5.2 0 9.9-1.9 13.4-5.1l-6.2-5.2C29.3 35.3 26.8 36 24 36c-5.2 0-9.6-2.9-11.3-7.1l-6.6 5.1C9.6 39.6 16.3 44 24 44z"/><path fill="#1976D2" d="M43.6 20H24v8h11.3c-.9 2.5-2.5 4.6-4.7 6l6.2 5.2C40.7 35.6 44 30.2 44 24c0-1.3-.1-2.7-.4-4z"/></svg>
          Continue with Google
        </button>

        <p className="text-center text-sm text-slate-500 mt-6">
          Don't have an account?{' '}
          <Link to="/signup" className="text-violet-700 font-semibold hover:underline">Sign up free</Link>
        </p>
      </div>
    </div>
  )
}
