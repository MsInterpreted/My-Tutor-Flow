import { useState, useMemo } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useProgress } from '../contexts/StudentProgressContext.jsx'
import { allBooks, seriesConfig } from '../data/index.js'
import ProgressBar from '../components/interactive/ProgressBar.jsx'
import ThemeToggle from '../components/ThemeToggle.jsx'

function StarRow({ filled, total = 3, size = 'text-base' }) {
  return (
    <div className="flex gap-0.5" aria-label={`${filled} of ${total} stars`}>
      {Array.from({ length: total }).map((_, i) => (
        <span key={i} className={`${size} ${i < filled ? '' : 'opacity-25 grayscale'}`}>⭐</span>
      ))}
    </div>
  )
}

function StatCard({ icon, label, value, color }) {
  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-5 shadow-sm">
      <div
        className="w-10 h-10 rounded-xl flex items-center justify-center text-xl mb-3"
        style={{ backgroundColor: color }}
      >
        {icon}
      </div>
      <p className="text-3xl font-display font-bold text-slate-800 dark:text-slate-100">{value}</p>
      <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 uppercase tracking-wider font-semibold">
        {label}
      </p>
    </div>
  )
}

function NameEntryCard({ onSubmit }) {
  const [name, setName] = useState('')
  const handleSubmit = (e) => {
    e.preventDefault()
    const trimmed = name.trim()
    if (trimmed) onSubmit(trimmed)
  }
  return (
    <div className="bg-gradient-to-br from-violet-600 to-violet-800 text-white rounded-2xl p-8 shadow-lg">
      <p className="text-4xl mb-3">👋</p>
      <h2 className="font-display font-bold text-2xl mb-2">Welcome!</h2>
      <p className="text-sm text-violet-100 mb-5">
        What's your name? We'll keep track of your progress.
      </p>
      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Your name"
          className="flex-1 px-4 py-3 rounded-xl text-slate-800 bg-white outline-none focus:ring-4 focus:ring-violet-300"
          maxLength={40}
        />
        <button
          type="submit"
          disabled={!name.trim()}
          className="bg-white text-violet-700 font-semibold px-5 py-3 rounded-xl hover:bg-violet-50 transition-colors disabled:opacity-50"
        >
          Start Learning →
        </button>
      </form>
    </div>
  )
}

function BookCard({ book, progress }) {
  const totalUnits = book.units?.length || 0
  const unitsViewed = progress.unitsViewed?.length || 0
  const scores = progress.quizScores || {}
  const totals = progress.quizTotals || {}
  const unitIds = Object.keys(scores)
  let pct = null
  if (unitIds.length > 0) {
    const earned = unitIds.reduce((s, k) => s + (scores[k] || 0), 0)
    const possible = unitIds.reduce((s, k) => s + (totals[k] || 0), 0)
    pct = possible > 0 ? Math.round((earned / possible) * 100) : null
  }
  const series = seriesConfig[book.series]

  return (
    <Link
      to={`/books/${book.id}`}
      className="group bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 overflow-hidden shadow-sm hover:shadow-lg hover:-translate-y-0.5 transition-all flex flex-col"
    >
      <div
        className="px-5 py-4 text-white"
        style={{ backgroundColor: book.color }}
      >
        <div className="flex items-center justify-between mb-2">
          <span className="text-2xl">{series?.icon || '📘'}</span>
          <span className="text-xs font-bold bg-white/20 px-2 py-0.5 rounded-full">
            {book.level}
          </span>
        </div>
        <h3 className="font-display font-bold text-base leading-tight">
          {book.title}
        </h3>
        <p className="text-xs opacity-80 mt-0.5">{book.subtitle}</p>
      </div>
      <div className="p-4 flex-1 flex flex-col gap-3">
        <ProgressBar bookId={book.id} totalUnits={totalUnits} color={book.color} />

        <div className="flex items-center justify-between">
          <div>
            {pct !== null ? (
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Quiz avg <span className="font-bold text-slate-700 dark:text-slate-200">{pct}%</span>
              </p>
            ) : (
              <p className="text-xs text-slate-400">No quizzes yet</p>
            )}
          </div>
          <StarRow filled={progress.stars || 0} size="text-sm" />
        </div>

        {progress.completed && (
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs font-semibold text-green-700 dark:text-green-400 bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-700 rounded-lg px-2 py-1">
              ✓ Completed
            </span>
            <Link
              to={`/certificate/${book.id}`}
              onClick={e => e.stopPropagation()}
              className="text-xs font-semibold text-violet-700 dark:text-violet-400 bg-violet-50 dark:bg-violet-900/30 border border-violet-200 dark:border-violet-700 rounded-lg px-2 py-1 hover:bg-violet-100 dark:hover:bg-violet-900/50 transition-colors"
            >
              🏅 Get Certificate
            </Link>
          </div>
        )}
      </div>
    </Link>
  )
}

function AchievementBadge({ emoji, label, condition, earned }) {
  return (
    <div
      className={`bg-white dark:bg-slate-800 border rounded-xl p-4 text-center transition-opacity ${
        earned
          ? 'border-violet-300 dark:border-violet-600 opacity-100 shadow-sm'
          : 'border-slate-200 dark:border-slate-700 opacity-40'
      }`}
    >
      <div className="text-3xl mb-2">{emoji}</div>
      <p className="text-sm font-bold text-slate-800 dark:text-slate-100">{label}</p>
      <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{condition}</p>
    </div>
  )
}

export default function StudentDashboard() {
  const {
    studentName,
    streak,
    setStudentName,
    getAllBookProgress,
    getBookProgress,
    getTotalStars,
    clearProgress,
  } = useProgress()

  const allProgress = getAllBookProgress()
  const totalStars = getTotalStars()

  const booksStarted = useMemo(
    () =>
      Object.values(allProgress).filter(
        b => b.unitsViewed && b.unitsViewed.length > 0
      ).length,
    [allProgress]
  )
  const booksCompleted = useMemo(
    () => Object.values(allProgress).filter(b => b.completed).length,
    [allProgress]
  )

  const recentBooks = useMemo(() => {
    return allBooks
      .map(book => ({
        book,
        progress: allProgress[book.id],
      }))
      .filter(x => x.progress && x.progress.lastVisited)
      .sort(
        (a, b) =>
          new Date(b.progress.lastVisited).getTime() -
          new Date(a.progress.lastVisited).getTime()
      )
      .slice(0, 5)
  }, [allProgress])

  // Achievement logic
  const hasAnyQuiz = Object.values(allProgress).some(
    b => b.quizScores && Object.keys(b.quizScores).length > 0
  )
  const hasAnyBookCompleted = booksCompleted > 0
  const comprehensionBookIds = allBooks
    .filter(b => b.series === 'comprehension')
    .map(b => b.id)
  const allComprehensionDone = comprehensionBookIds.every(
    id => allProgress[id]?.completed
  )
  const phonicsBookIds = allBooks.filter(b => b.series === 'phonics').map(b => b.id)
  const phonicsMaster = phonicsBookIds.every(id => allProgress[id]?.completed)
  const languageBookIds = allBooks.filter(b => b.series === 'language').map(b => b.id)
  const languagePro = languageBookIds.every(id => allProgress[id]?.completed)

  const handleReset = () => {
    if (window.confirm('Reset all your progress? This cannot be undone.')) {
      clearProgress()
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      {/* Top nav */}
      <nav className="bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 px-4 py-3 flex items-center justify-between sticky top-0 z-20 shadow-sm">
        <Link to="/" className="font-display font-bold text-slate-800 dark:text-slate-100">
          ← Home
        </Link>
        <h1 className="text-sm font-bold text-slate-600 dark:text-slate-300 uppercase tracking-wider">
          Student Dashboard
        </h1>
        <div className="flex items-center gap-3">
          <Link
            to="/books"
            className="text-sm font-semibold text-violet-700 dark:text-violet-400 hover:text-violet-900"
          >
            All Books →
          </Link>
          <ThemeToggle />
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-4 py-8 space-y-10">
        {/* 1. Student Header */}
        <section>
          {!studentName ? (
            <NameEntryCard onSubmit={setStudentName} />
          ) : (
            <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="font-display font-bold text-2xl text-slate-800 dark:text-slate-100">
                  Welcome back, {studentName}! 👋
                </h2>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                  Keep going — you're doing great.
                </p>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-center">
                  <p className="text-2xl font-display font-bold text-amber-500">
                    {totalStars} ⭐
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                    Total Stars
                  </p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-display font-bold text-orange-500">
                    {streak || 0} 🔥
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                    Day Streak
                  </p>
                </div>
              </div>
            </div>
          )}
        </section>

        {/* 2. Overall Progress */}
        {studentName && (
          <section>
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">
              Your Progress
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <StatCard
                icon="⭐"
                label="Total Stars"
                value={totalStars}
                color="#FEF3C7"
              />
              <StatCard
                icon="📚"
                label="Books Started"
                value={booksStarted}
                color="#EDE9FE"
              />
              <StatCard
                icon="🏆"
                label="Books Completed"
                value={booksCompleted}
                color="#DCFCE7"
              />
            </div>
          </section>
        )}

        {/* 3. Book Grid */}
        <section>
          <h3 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-3">
            Your Books
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {allBooks.map(book => (
              <BookCard
                key={book.id}
                book={book}
                progress={getBookProgress(book.id)}
              />
            ))}
          </div>
        </section>

        {/* 4. Recent Activity */}
        {recentBooks.length > 0 && (
          <section>
            <h3 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-3">
              Recent Activity
            </h3>
            <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 divide-y divide-slate-100 dark:divide-slate-700 overflow-hidden">
              {recentBooks.map(({ book, progress }) => {
                const date = new Date(progress.lastVisited)
                const dateStr = date.toLocaleDateString(undefined, {
                  month: 'short',
                  day: 'numeric',
                })
                return (
                  <Link
                    key={book.id}
                    to={`/books/${book.id}`}
                    className="flex items-center gap-4 px-4 py-3 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors"
                  >
                    <div
                      className="w-10 h-10 rounded-lg flex items-center justify-center text-lg flex-shrink-0"
                      style={{ backgroundColor: book.lightColor || '#EDE9FE' }}
                    >
                      {seriesConfig[book.series]?.icon || '📘'}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-slate-800 dark:text-slate-100 truncate">
                        {book.title}
                      </p>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        {progress.unitsViewed?.length || 0} units completed
                      </p>
                    </div>
                    <span className="text-xs text-slate-400">{dateStr}</span>
                  </Link>
                )
              })}
            </div>
          </section>
        )}

        {/* 5. Achievement Badges */}
        <section>
          <h3 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-3">
            Achievements
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
            <AchievementBadge
              emoji="🌟"
              label="First Quiz"
              condition="Complete any quiz"
              earned={hasAnyQuiz}
            />
            <AchievementBadge
              emoji="📚"
              label="First Book"
              condition="Finish any book"
              earned={hasAnyBookCompleted}
            />
            <AchievementBadge
              emoji="🏆"
              label="All Comprehension"
              condition="Finish all 3 PEEL books"
              earned={allComprehensionDone}
            />
            <AchievementBadge
              emoji="🔬"
              label="Phonics Master"
              condition="Finish all 3 phonics books"
              earned={phonicsMaster}
            />
            <AchievementBadge
              emoji="✍️"
              label="Language Pro"
              condition="Finish all 3 language books"
              earned={languagePro}
            />
          </div>
        </section>

        {/* 6. Reset */}
        <section className="pt-4 text-center">
          <button
            type="button"
            onClick={handleReset}
            className="text-xs text-slate-400 hover:text-red-600 underline transition-colors"
          >
            Reset Progress
          </button>
        </section>
      </div>
    </div>
  )
}
