import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { collection, addDoc, serverTimestamp } from 'firebase/firestore'
import { db } from '../firebase.js'
import { FREE_ASSESSMENTS, MARKERS } from '../data/freeAssessments.js'
import { useAuth } from '../contexts/AuthContext.jsx'
import ThemeToggle from '../components/ThemeToggle.jsx'

const WHAT_WE_MEASURE = [
  { icon: '🔤', label: 'Phonics & Word-Building', desc: 'Blends, syllables, spelling rules, prefixes & roots' },
  { icon: '✍️', label: 'Language Skills', desc: 'Grammar, vocabulary, sentence structure & style' },
  { icon: '📖', label: 'Comprehension', desc: 'Literal recall, inference, main idea & critical thinking' },
]

const HOW_IT_WORKS = [
  { step: '1', text: 'Choose a level — Beginner, Intermediate or Pre-Advanced' },
  { step: '2', text: '9 questions across phonics, language and comprehension' },
  { step: '3', text: 'Get an instant report showing strengths and areas to focus on' },
  { step: '4', text: 'See the exact books that target each gap — unlock them with a subscription' },
]

function LeadCaptureModal({ assessment, onClose }) {
  const navigate = useNavigate()
  const [form, setForm] = useState({ name: '', email: '', childName: '' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(e) {
    e.preventDefault()
    if (!form.name.trim() || !form.email.trim()) return setError('Please enter your name and email.')
    setLoading(true)
    try {
      const email = form.email.trim().toLowerCase()
      const name = form.name.trim()
      const childName = form.childName.trim() || null
      await addDoc(collection(db, 'leads'), {
        name,
        email,
        childName,
        level: assessment.level,
        levelId: assessment.id,
        source: 'free_assessment',
        createdAt: serverTimestamp(),
      })
      // Bridge to viewer so it skips its own entry form
      sessionStorage.setItem('mtf_lead', JSON.stringify({ name, email, childName }))
      navigate(`/assess/${assessment.id}`)
    } catch {
      setError('Something went wrong. Please try again.')
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-black/60 backdrop-blur-sm" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl w-full max-w-md p-8 relative">
        <button onClick={onClose} className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 text-xl leading-none">✕</button>

        <div className="text-center mb-6">
          <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-3xl mx-auto mb-4" style={{ backgroundColor: assessment.color + '22' }}>
            {assessment.icon}
          </div>
          <h2 className="text-xl font-display font-black text-slate-800 dark:text-slate-100">Almost there!</h2>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
            Enter your details to unlock the <strong>{assessment.level}</strong> assessment — free, no credit card needed.
          </p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-3 text-sm mb-4">{error}</div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">Your name <span className="text-red-400">*</span></label>
            <input
              type="text"
              value={form.name}
              onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
              required
              placeholder="e.g. Sarah"
              className="w-full border border-slate-200 dark:border-slate-600 rounded-xl px-4 py-3 text-sm bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-violet-400"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">Email address <span className="text-red-400">*</span></label>
            <input
              type="email"
              value={form.email}
              onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
              required
              placeholder="your@email.com"
              className="w-full border border-slate-200 dark:border-slate-600 rounded-xl px-4 py-3 text-sm bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-violet-400"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
              Child's name <span className="text-slate-400 font-normal">(optional)</span>
            </label>
            <input
              type="text"
              value={form.childName}
              onChange={e => setForm(f => ({ ...f, childName: e.target.value }))}
              placeholder="e.g. Aiden"
              className="w-full border border-slate-200 dark:border-slate-600 rounded-xl px-4 py-3 text-sm bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-violet-400"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full text-white font-bold py-3 rounded-xl transition-colors disabled:opacity-50 hover:opacity-90"
            style={{ backgroundColor: assessment.color }}
          >
            {loading ? 'Starting…' : `Start ${assessment.level} Assessment →`}
          </button>
        </form>

        <p className="text-center text-xs text-slate-400 dark:text-slate-500 mt-4">
          We'll only send you helpful updates about My Tutor Flow. No spam, ever.
        </p>
      </div>
    </div>
  )
}

export default function FreeAssessmentPage() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [activeAssessment, setActiveAssessment] = useState(null)

  function handleStartAssessment(assessment) {
    if (user) {
      navigate(`/assess/${assessment.id}`)
    } else {
      setActiveAssessment(assessment)
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      {activeAssessment && <LeadCaptureModal assessment={activeAssessment} onClose={() => setActiveAssessment(null)} />}
      {/* Nav */}
      <nav className="bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 px-4 py-3 flex items-center gap-4 sticky top-0 z-10">
        <Link to="/" className="text-violet-700 font-bold text-lg font-display">My Tutor Flow</Link>
        <div className="ml-auto flex items-center gap-3">
          {user
            ? <Link to="/books" className="text-sm text-violet-700 font-semibold hover:underline">My Books →</Link>
            : <>
                <Link to="/login" className="text-sm text-slate-600 dark:text-slate-300 hover:text-violet-700 font-medium">Sign In</Link>
                <Link to="/signup" className="text-sm bg-violet-700 text-white px-4 py-2 rounded-xl font-semibold hover:bg-violet-800">Start Free</Link>
              </>
          }
          <ThemeToggle />
        </div>
      </nav>

      {/* Hero */}
      <div className="bg-gradient-to-br from-slate-900 via-violet-950 to-slate-900 text-white">
        <div className="max-w-4xl mx-auto px-4 py-20 text-center">
          <span className="inline-block bg-violet-500/20 text-violet-300 text-xs font-bold uppercase tracking-widest px-4 py-2 rounded-full mb-6 border border-violet-500/30">
            Free Diagnostic Assessment
          </span>
          <h1 className="text-4xl sm:text-5xl font-display font-black mb-5 leading-tight">
            Find out exactly where<br />
            <span className="text-violet-400">your child needs support</span>
          </h1>
          <p className="text-slate-300 text-lg mb-8 max-w-2xl mx-auto leading-relaxed">
            In just 5 minutes, our diagnostic booklets identify specific learning gaps across phonics, language and comprehension — then show you the targeted practice that will close them.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <a href="#levels" className="bg-violet-600 hover:bg-violet-500 text-white font-bold px-8 py-4 rounded-xl transition-colors text-base">
              Start Free Assessment →
            </a>
            <Link to="/pricing" className="bg-white/10 hover:bg-white/20 text-white font-semibold px-8 py-4 rounded-xl transition-colors text-base border border-white/20">
              View All Books
            </Link>
          </div>
          <p className="text-slate-500 text-xs mt-4">No account required · Takes 5 minutes · Instant results</p>
        </div>
      </div>

      {/* What we measure */}
      <div className="bg-white dark:bg-slate-800 border-b border-slate-100 dark:border-slate-700 py-14">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-center text-2xl font-display font-black text-slate-800 dark:text-slate-100 mb-2">What the assessment measures</h2>
          <p className="text-center text-slate-500 dark:text-slate-400 text-sm mb-10">Every question is tagged to a specific learning marker — so you get precise insights, not just a score.</p>
          <div className="grid sm:grid-cols-3 gap-6">
            {WHAT_WE_MEASURE.map(({ icon, label, desc }) => (
              <div key={label} className="text-center p-6 rounded-2xl bg-slate-50 dark:bg-slate-700/50 border border-slate-100 dark:border-slate-700">
                <div className="text-4xl mb-3">{icon}</div>
                <h3 className="font-bold text-slate-800 dark:text-slate-100 mb-1">{label}</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* How it works */}
      <div className="py-14 bg-slate-50 dark:bg-slate-900">
        <div className="max-w-3xl mx-auto px-4">
          <h2 className="text-center text-2xl font-display font-black text-slate-800 dark:text-slate-100 mb-10">How it works</h2>
          <div className="space-y-4">
            {HOW_IT_WORKS.map(({ step, text }) => (
              <div key={step} className="flex items-center gap-4 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 px-5 py-4 shadow-sm">
                <div className="w-9 h-9 rounded-full bg-violet-700 text-white font-black flex items-center justify-center flex-shrink-0 text-sm">
                  {step}
                </div>
                <p className="text-slate-700 dark:text-slate-200 font-medium">{text}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Level cards */}
      <div id="levels" className="py-16 bg-white dark:bg-slate-800">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-center text-2xl font-display font-black text-slate-800 dark:text-slate-100 mb-2">Choose your level</h2>
          <p className="text-center text-slate-500 dark:text-slate-400 text-sm mb-10">Not sure which level? Start with Beginner — the report will tell you if a higher level is more appropriate.</p>
          <div className="grid sm:grid-cols-3 gap-6">
            {FREE_ASSESSMENTS.map(a => (
              <div key={a.id} className="bg-white dark:bg-slate-700 rounded-2xl border-2 border-slate-100 dark:border-slate-600 overflow-hidden shadow-sm hover:shadow-lg transition-all hover:-translate-y-1 flex flex-col">
                <div className="h-28 flex items-center justify-center" style={{ background: `linear-gradient(135deg, ${a.color}, ${a.color}cc)` }}>
                  <div className="text-center text-white">
                    <div className="text-5xl mb-1">{a.icon}</div>
                  </div>
                </div>
                <div className="p-5 flex flex-col flex-1">
                  <h3 className="font-display font-black text-slate-800 dark:text-slate-100 text-lg mb-1">{a.level}</h3>
                  <p className="text-slate-500 dark:text-slate-300 text-xs mb-4 flex-1">{a.tagline}</p>
                  <div className="space-y-1 mb-5">
                    {a.lessons.map(l => (
                      <div key={l.id} className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-300">
                        <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ backgroundColor: a.color }} />
                        {l.subject} · 3 questions
                      </div>
                    ))}
                  </div>
                  <button
                    onClick={() => handleStartAssessment(a)}
                    className="w-full text-center font-bold py-3 rounded-xl text-white transition-colors hover:opacity-90"
                    style={{ backgroundColor: a.color }}
                  >
                    Start {a.level} →
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Sample report teaser */}
      <div className="bg-slate-900 text-white py-16">
        <div className="max-w-3xl mx-auto px-4">
          <div className="text-center mb-10">
            <h2 className="text-2xl font-display font-black mb-2">What your report looks like</h2>
            <p className="text-slate-400 text-sm">After completing the assessment you'll see this — specific, actionable insights.</p>
          </div>
          <div className="bg-slate-800 rounded-2xl p-6 border border-slate-700">
            <div className="flex items-center justify-between mb-5">
              <div>
                <p className="font-bold text-lg">Assessment Report · Intermediate</p>
                <p className="text-slate-400 text-xs">6 of 9 correct · 67%</p>
              </div>
              <div className="text-4xl font-display font-black text-amber-400">67%</div>
            </div>
            <div className="grid sm:grid-cols-2 gap-4 mb-5">
              <div className="bg-green-900/40 border border-green-700/40 rounded-xl p-4">
                <p className="text-xs font-bold text-green-400 uppercase tracking-wider mb-2">✓ Strengths</p>
                <ul className="space-y-1 text-sm text-green-200">
                  <li>· Syllable Awareness</li>
                  <li>· Literal Recall</li>
                  <li>· Grammar & Agreement</li>
                </ul>
              </div>
              <div className="bg-red-900/30 border border-red-700/40 rounded-xl p-4">
                <p className="text-xs font-bold text-red-400 uppercase tracking-wider mb-2">⚠ Needs Focus</p>
                <ul className="space-y-1 text-sm text-red-200">
                  <li>· Inference & Reading Between the Lines</li>
                  <li>· Vocabulary & Word Choice</li>
                  <li>· Main Idea & Summarising</li>
                </ul>
              </div>
            </div>
            <div className="bg-violet-700 rounded-xl p-4 text-center">
              <p className="font-bold mb-1">2 books recommended to close these gaps</p>
              <p className="text-violet-200 text-xs">Unlock them from R179/month</p>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom CTA */}
      <div className="bg-violet-700 py-14 text-white text-center px-4">
        <h2 className="text-3xl font-display font-black mb-3">Ready to find the gaps?</h2>
        <p className="text-violet-200 mb-7 text-sm max-w-md mx-auto">It's free, takes 5 minutes, and gives you more useful information than a report card.</p>
        <a href="#levels" className="inline-block bg-white text-violet-800 font-bold px-10 py-4 rounded-xl hover:bg-violet-50 transition-colors text-base">
          Start Free Assessment →
        </a>
      </div>
    </div>
  )
}
