import { Link } from 'react-router-dom'
import { allBooks, seriesConfig, levelConfig } from '../data/index.js'
import { useProgress } from '../contexts/StudentProgressContext.jsx'
import { useAuth } from '../contexts/AuthContext.jsx'
import ProgressBar from '../components/interactive/ProgressBar.jsx'
import ThemeToggle from '../components/ThemeToggle.jsx'

export default function BookList() {
  const series = Object.keys(seriesConfig)
  const { studentName } = useProgress()
  const { user, profile, logout, hasAccessToBook, isTeacher } = useAuth()

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      {/* Nav */}
      <nav className="bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 px-4 py-3 flex items-center gap-4 no-print sticky top-0 z-10">
        <Link to="/" className="text-violet-700 font-bold text-lg font-display">My Tutor Flow</Link>
        <span className="text-slate-300 dark:text-slate-600">|</span>
        <span className="text-slate-500 dark:text-slate-400 text-sm">All Books</span>
        <div className="ml-auto flex items-center gap-4">
          <Link to="/pricing" className="text-sm text-slate-500 hover:text-violet-700 transition-colors">Pricing</Link>
          {isTeacher
            ? <Link to="/teacher" className="text-sm text-violet-700 font-semibold hover:underline">Teacher Dashboard →</Link>
            : <Link to="/dashboard" className="text-sm text-violet-700 font-semibold hover:underline">My Dashboard →</Link>
          }
          {user && (
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-500 dark:text-slate-400 hidden sm:block">{profile?.displayName || user.email}</span>
              <button onClick={logout} className="text-xs text-slate-400 hover:text-red-500 transition-colors">Sign out</button>
            </div>
          )}
          <ThemeToggle />
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-4 py-10">
        {studentName && (
          <div className="bg-violet-50 dark:bg-violet-900/30 border border-violet-100 dark:border-violet-800 rounded-xl px-4 py-3 mb-6 flex items-center justify-between">
            <span className="text-violet-800 dark:text-violet-200 text-sm font-medium">👋 Welcome back, <strong>{studentName}</strong>!</span>
            <Link to="/dashboard" className="text-xs text-violet-600 hover:underline">View my progress →</Link>
          </div>
        )}
        <h1 className="text-3xl font-display font-black text-slate-800 dark:text-slate-100 mb-2">All Books</h1>
        <p className="text-slate-500 dark:text-slate-400 mb-10">Select a book to view, read, and print.</p>

        {series.map(seriesKey => {
          const config = seriesConfig[seriesKey]
          const books = allBooks.filter(b => b.series === seriesKey)
          return (
            <div key={seriesKey} className="mb-12">
              <div className="flex items-center gap-3 mb-5">
                <div className="text-2xl">{config.icon}</div>
                <div>
                  <h2 className="text-xl font-display font-bold text-slate-800 dark:text-slate-100">{config.name}</h2>
                  <p className="text-sm text-slate-500 dark:text-slate-400">{config.description}</p>
                </div>
              </div>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {books.map(book => {
                  const lc = levelConfig[book.level] || {}
                  const locked = !hasAccessToBook(book.id)
                  return (
                    <Link
                      key={book.id}
                      to={`/books/${book.id}`}
                      className="bg-white dark:bg-slate-800 rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all border border-slate-100 dark:border-slate-700 hover:-translate-y-1 group"
                    >
                      {/* Cover strip */}
                      <div className="h-32 flex items-center justify-center relative" style={{ background: `linear-gradient(135deg, ${book.color}, ${book.color}cc)` }}>
                        <div className="text-center text-white px-4">
                          <div className="text-4xl mb-1">{config.icon}</div>
                          <div className="text-xs font-semibold opacity-80 uppercase tracking-wider">My Tutor Flow</div>
                        </div>
                        {locked && (
                          <div className="absolute top-2 right-2 bg-black/40 text-white rounded-full w-7 h-7 flex items-center justify-center">
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                            </svg>
                          </div>
                        )}
                      </div>
                      {/* Info */}
                      <div className="p-5">
                        <span className={`text-xs font-semibold px-3 py-1 rounded-full ${lc.badge}`}>
                          {book.level}
                        </span>
                        <h3 className="font-display font-bold text-slate-800 dark:text-slate-100 mt-3 mb-1 group-hover:text-violet-700 dark:group-hover:text-violet-400 transition-colors">
                          {book.title}
                        </h3>
                        <p className="text-sm text-slate-500 dark:text-slate-400 mb-3">{book.description}</p>
                        <ProgressBar bookId={book.id} totalUnits={book.units?.length} color={book.color} />
                        <div className="text-xs text-slate-400 dark:text-slate-500 mt-2">
                          {book.units?.length || 0} units
                        </div>
                      </div>
                    </Link>
                  )
                })}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
