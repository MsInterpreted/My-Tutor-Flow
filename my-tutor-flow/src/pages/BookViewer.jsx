import { useParams, Link } from 'react-router-dom'
import { useRef, useEffect } from 'react'
import { allBooks } from '../data/index.js'
import BookCover from '../components/BookCover.jsx'
import PEELExplainer from '../components/PEELExplainer.jsx'
import ComprehensionUnit from '../components/ComprehensionUnit.jsx'
import PhonicsUnit from '../components/PhonicsUnit.jsx'
import LanguageUnit from '../components/LanguageUnit.jsx'
import { useProgress } from '../contexts/StudentProgressContext.jsx'
import ProgressBar from '../components/interactive/ProgressBar.jsx'
import UpgradePrompt from '../components/UpgradePrompt.jsx'
import { useAuth } from '../contexts/AuthContext.jsx'
import ThemeToggle from '../components/ThemeToggle.jsx'

export default function BookViewer() {
  const { bookId } = useParams()
  const printRef = useRef()
  const book = allBooks.find(b => b.id === bookId)
  const { markUnitViewed, getBookProgress, studentName } = useProgress()
  const { hasAccessToBook } = useAuth()

  const hasFullAccess = hasAccessToBook(bookId)

  useEffect(() => {
    if (!book) return
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const unitId = parseInt(entry.target.dataset.unitId)
            if (unitId) markUnitViewed(book.id, unitId)
          }
        })
      },
      { threshold: 0.5 }
    )
    const unitEls = document.querySelectorAll('[data-unit-id]')
    unitEls.forEach(el => observer.observe(el))
    return () => observer.disconnect()
  }, [book, markUnitViewed])

  if (!book) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex items-center justify-center">
        <div className="text-center">
          <p className="text-2xl mb-4 text-slate-800 dark:text-slate-100">Book not found</p>
          <Link to="/books" className="text-violet-700 underline">Back to Books</Link>
        </div>
      </div>
    )
  }

  const handlePrint = () => window.print()

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-900">
      {/* Sticky nav */}
      <nav className="no-print bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 px-4 py-3 flex items-center justify-between sticky top-0 z-20 shadow-sm">
        <div className="flex items-center gap-3">
          <Link to="/books" className="text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition-colors">
            ← Books
          </Link>
          <Link to="/dashboard" className="text-slate-400 hover:text-violet-600 text-xs transition-colors">
            Dashboard
          </Link>
          <Link to="/pricing" className="text-slate-400 hover:text-violet-600 text-xs transition-colors">
            Pricing
          </Link>
          <span className="text-slate-200 dark:text-slate-600">|</span>
          <h1 className="font-display font-bold text-slate-800 dark:text-slate-100 text-sm">
            {book.title} — <span style={{ color: book.color }}>{book.level}</span>
          </h1>
        </div>
        <div className="flex items-center gap-2">
          {studentName && (
            <span className="text-xs bg-violet-100 dark:bg-violet-900/40 text-violet-700 dark:text-violet-400 px-2 py-1 rounded-full font-semibold hidden sm:block">
              👤 {studentName}
            </span>
          )}
          <span className="text-xs text-slate-400 hidden sm:block">{book.units?.length} units</span>
          <ProgressBar bookId={book.id} totalUnits={book.units?.length || 0} color={book.color} />
          <ThemeToggle />
          <button
            onClick={handlePrint}
            className="flex items-center gap-2 bg-violet-700 text-white text-sm font-semibold px-4 py-2 rounded-xl hover:bg-violet-800 transition-colors"
          >
            <span>🖨</span> Print / PDF
          </button>
        </div>
      </nav>

      {/* Table of Contents */}
      <div className="no-print max-w-4xl mx-auto px-4 py-4">
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-4 mb-4">
          <h2 className="font-bold text-slate-700 dark:text-slate-200 mb-3 text-sm uppercase tracking-wider">Contents</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
            {book.units?.map(unit => (
              <a
                key={unit.id}
                href={`#unit-${unit.id}`}
                className="text-xs text-slate-600 dark:text-slate-300 hover:text-violet-700 dark:hover:text-violet-400 hover:bg-violet-50 dark:hover:bg-violet-900/30 px-2 py-1.5 rounded-lg transition-colors truncate"
                style={{ borderLeft: `3px solid ${book.color}` }}
              >
                {unit.id}. {unit.title}
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* Book content */}
      <div ref={printRef} className="max-w-4xl mx-auto px-4 pb-16 print-full">
        {/* Cover */}
        <BookCover book={book} />

        {/* PEEL explainer for comprehension books */}
        {book.series === 'comprehension' && <PEELExplainer />}

        {/* Units */}
        {!hasFullAccess ? (
          <UpgradePrompt bookTitle={book.title} />
        ) : (
          <>
            {book.units?.map(unit => (
              <div key={unit.id} id={`unit-${unit.id}`} data-unit-id={unit.id}>
                {book.series === 'comprehension' && (
                  <ComprehensionUnit unit={unit} color={book.color} bookId={book.id} />
                )}
                {book.series === 'phonics' && (
                  <PhonicsUnit unit={unit} color={book.color} bookId={book.id} />
                )}
                {book.series === 'language' && (
                  <LanguageUnit unit={unit} color={book.color} bookId={book.id} />
                )}
              </div>
            ))}
          </>
        )}
      </div>
    </div>
  )
}
