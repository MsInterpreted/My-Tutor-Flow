import { Link } from 'react-router-dom'
import { seriesConfig } from '../data/index.js'
import { useAuth } from '../contexts/AuthContext.jsx'

const levels = ['Beginner', 'Intermediate', 'Pre-Advanced']

export default function HomePage() {
  const { user } = useAuth()
  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-900 via-purple-800 to-indigo-900">
      {/* Header */}
      <header className="text-white text-center py-16 px-4">
        <div className="inline-block bg-white/10 backdrop-blur rounded-2xl px-6 py-2 mb-6 text-center">
          <p className="text-sm font-bold tracking-widest uppercase text-violet-200">My Tutor Flow</p>
          <p className="text-xs text-violet-300 opacity-75">powered by TD Learning Academy</p>
        </div>
        <h1 className="text-5xl md:text-6xl font-display font-black text-white mb-4 leading-tight">
          My Tutor Flow
        </h1>
        <p className="text-xl text-violet-200 max-w-2xl mx-auto mb-8">
          A complete English literacy programme — Phonics, Comprehension & Language Skills — at three levels, powered by the <strong className="text-white">P.E.E.L. method</strong>.
        </p>
        <div className="flex gap-4 justify-center flex-wrap">
          {user ? (
            <>
              <Link to="/books" className="inline-block bg-white text-violet-900 font-bold text-lg px-10 py-4 rounded-2xl hover:bg-violet-50 transition-all shadow-xl hover:shadow-2xl transform hover:-translate-y-1">
                Browse All Books →
              </Link>
              <Link to="/dashboard" className="inline-block border-2 border-white text-white font-bold text-lg px-8 py-4 rounded-2xl hover:bg-white/10 transition-all">
                My Dashboard
              </Link>
            </>
          ) : (
            <>
              <Link to="/signup" className="inline-block bg-white text-violet-900 font-bold text-lg px-10 py-4 rounded-2xl hover:bg-violet-50 transition-all shadow-xl hover:shadow-2xl transform hover:-translate-y-1">
                Start Free →
              </Link>
              <Link to="/login" className="inline-block border-2 border-white text-white font-bold text-lg px-8 py-4 rounded-2xl hover:bg-white/10 transition-all">
                Sign In
              </Link>
            </>
          )}
        </div>
        <div className="flex justify-center gap-8 pb-8 pt-10 text-white/80 text-xs text-center">
          {[
            { icon: '✏️', label: 'Interactive\nExercises' },
            { icon: '🧠', label: 'Quizzes &\nFeedback' },
            { icon: '📝', label: 'PEEL Writing\nBoxes' },
            { icon: '⭐', label: 'Progress\nTracking' },
          ].map(f => (
            <div key={f.label}>
              <div className="text-2xl mb-1">{f.icon}</div>
              <div className="whitespace-pre-line">{f.label}</div>
            </div>
          ))}
        </div>
      </header>

      {/* Series Cards */}
      <section className="max-w-5xl mx-auto px-4 pb-16">
        <div className="grid md:grid-cols-3 gap-6">
          {Object.entries(seriesConfig).map(([key, config]) => (
            <div key={key} className="bg-white/10 backdrop-blur rounded-2xl p-6 text-white border border-white/20">
              <div className="text-4xl mb-3">{config.icon}</div>
              <h2 className="text-xl font-display font-bold mb-2">{config.name}</h2>
              <p className="text-sm text-violet-200 mb-4">{config.description}</p>
              <div className="flex flex-wrap gap-2">
                {levels.map(level => (
                  <span key={level} className="text-xs bg-white/20 px-3 py-1 rounded-full">{level}</span>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* PEEL highlight */}
        <div className="mt-8 bg-white/10 backdrop-blur rounded-2xl p-8 border border-white/20 text-white">
          <h2 className="text-2xl font-display font-bold text-center mb-6">What is P.E.E.L.?</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { letter: 'P', label: 'Point', desc: 'State your main idea clearly', color: 'bg-red-500' },
              { letter: 'E', label: 'Evidence', desc: 'Quote or reference the text', color: 'bg-amber-500' },
              { letter: 'E', label: 'Explain', desc: 'Analyse how the evidence supports your point', color: 'bg-green-500' },
              { letter: 'L', label: 'Link', desc: 'Connect back to the question or a bigger idea', color: 'bg-blue-500' },
            ].map(({ letter, label, desc, color }) => (
              <div key={label} className="text-center">
                <div className={`${color} text-white text-3xl font-black w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3`}>
                  {letter}
                </div>
                <h3 className="font-bold text-lg mb-1">{label}</h3>
                <p className="text-xs text-violet-200">{desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Free assessment CTA */}
        <div className="mt-8 bg-gradient-to-r from-slate-900/80 to-violet-900/80 backdrop-blur rounded-2xl p-8 border border-white/20 text-white flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-violet-300 mb-2 block">Free · No Account Needed</span>
            <h2 className="text-2xl font-display font-bold mb-1">Not sure where to start?</h2>
            <p className="text-violet-200 text-sm max-w-sm">
              Take a free 5-minute diagnostic assessment. We'll identify exactly which skills need attention and show you the right books to fix them.
            </p>
          </div>
          <Link to="/assess" className="whitespace-nowrap bg-white text-violet-900 font-bold px-7 py-4 rounded-xl hover:bg-violet-50 transition-colors shadow-lg flex-shrink-0">
            Free Assessment →
          </Link>
        </div>

        {/* Level guide */}
        <div className="mt-6 grid md:grid-cols-3 gap-4">
          {[
            { level: 'Beginner', desc: 'Basic sounds, CVC words, simple sentences, and introductory grammar. Perfect for early-stage English learners.', color: 'bg-emerald-500' },
            { level: 'Intermediate', desc: 'Blends, digraphs, compound sentences, PEEL comprehension, and extended vocabulary.', color: 'bg-amber-500' },
            { level: 'Pre-Advanced', desc: 'Complex texts, analytical writing, advanced phonics patterns, and academic vocabulary.', color: 'bg-rose-500' },
          ].map(({ level, desc, color }) => (
            <div key={level} className="bg-white/10 backdrop-blur rounded-xl p-5 border border-white/20">
              <div className="flex items-center gap-2 mb-2">
                <div className={`${color} w-3 h-3 rounded-full`} />
                <h3 className="font-bold text-white">{level}</h3>
              </div>
              <p className="text-xs text-violet-200">{desc}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
