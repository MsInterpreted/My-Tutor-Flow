import { useParams, Link } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext.jsx'
import { useProgress } from '../contexts/StudentProgressContext.jsx'
import { allBooks, seriesConfig } from '../data/index.js'

const STAR_LABELS = { 1: 'Good effort', 2: 'Well done', 3: 'Outstanding' }

export default function CertificatePage() {
  const { bookId } = useParams()
  const { profile } = useAuth()
  const { getBookProgress, studentName } = useProgress()

  const book = allBooks.find(b => b.id === bookId)
  const progress = getBookProgress(bookId)
  const name = profile?.displayName || studentName || 'Student'
  const series = book ? seriesConfig[book.series] : null
  const stars = progress?.stars || 1
  const dateStr = progress?.lastVisited
    ? new Date(progress.lastVisited).toLocaleDateString('en-ZA', { day: 'numeric', month: 'long', year: 'numeric' })
    : new Date().toLocaleDateString('en-ZA', { day: 'numeric', month: 'long', year: 'numeric' })

  if (!book) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-xl mb-4">Book not found.</p>
          <Link to="/dashboard" className="text-violet-700 underline">Back to Dashboard</Link>
        </div>
      </div>
    )
  }

  return (
    <>
      {/* Print styles */}
      <style>{`
        @page { size: A4 landscape; margin: 0; }
        @media print {
          .no-print { display: none !important; }
          body { margin: 0; }
          .cert-page { width: 297mm; height: 210mm; page-break-after: avoid; }
        }
      `}</style>

      {/* Nav — hidden on print */}
      <div className="no-print bg-white border-b border-slate-200 px-4 py-3 flex items-center justify-between">
        <Link to="/dashboard" className="text-slate-500 hover:text-slate-800 text-sm">← Back to Dashboard</Link>
        <button
          onClick={() => window.print()}
          className="bg-violet-700 text-white font-bold px-6 py-2 rounded-xl hover:bg-violet-800 transition-colors text-sm flex items-center gap-2"
        >
          🖨 Print / Save as PDF
        </button>
      </div>

      {/* Certificate */}
      <div className="cert-page min-h-screen bg-white flex items-center justify-center p-8"
           style={{ fontFamily: 'Georgia, serif' }}>
        <div className="w-full max-w-4xl relative" style={{
          border: `12px solid ${book.color}`,
          boxShadow: `0 0 0 4px white, 0 0 0 8px ${book.color}33`,
          padding: '48px 64px',
          background: 'white',
        }}>

          {/* Corner ornaments */}
          {['top-2 left-2', 'top-2 right-2', 'bottom-2 left-2', 'bottom-2 right-2'].map(pos => (
            <div key={pos} className={`absolute ${pos} w-8 h-8`} style={{ color: book.color, opacity: 0.4, fontSize: 28 }}>✦</div>
          ))}

          {/* Header */}
          <div className="text-center mb-6">
            <div className="flex items-center justify-center gap-3 mb-2">
              <div className="text-3xl">{series?.icon}</div>
              <div>
                <p className="text-xs font-bold uppercase tracking-widest" style={{ color: book.color }}>
                  My Tutor Flow
                </p>
                <p className="text-xs text-slate-400 tracking-wider">powered by TD Learning Academy</p>
              </div>
            </div>
            <div className="flex items-center gap-3 justify-center mt-3">
              <div className="h-px flex-1" style={{ backgroundColor: book.color, opacity: 0.3 }} />
              <p className="text-xs uppercase tracking-[0.3em] text-slate-500 font-semibold">Certificate of Completion</p>
              <div className="h-px flex-1" style={{ backgroundColor: book.color, opacity: 0.3 }} />
            </div>
          </div>

          {/* Main content */}
          <div className="text-center mb-8">
            <p className="text-slate-500 text-sm mb-3 tracking-wide">This is to certify that</p>
            <h1 className="font-black mb-3 leading-tight" style={{
              fontSize: 'clamp(2rem, 5vw, 3.5rem)',
              color: book.color,
              textShadow: `1px 1px 0 ${book.color}22`,
            }}>
              {name}
            </h1>
            <p className="text-slate-500 text-sm mb-4 tracking-wide">has successfully completed</p>
            <h2 className="text-2xl font-bold text-slate-800 mb-2">{book.title}</h2>
            <p className="text-slate-500 text-sm mb-5">
              {book.level} · {book.series.charAt(0).toUpperCase() + book.series.slice(1)} Series · {book.units?.length} units
            </p>

            {/* Stars */}
            <div className="flex items-center justify-center gap-2 mb-2">
              {Array.from({ length: 3 }).map((_, i) => (
                <span key={i} style={{ fontSize: 28, opacity: i < stars ? 1 : 0.2 }}>⭐</span>
              ))}
            </div>
            <p className="text-sm font-semibold" style={{ color: book.color }}>{STAR_LABELS[stars]}</p>
          </div>

          {/* Footer */}
          <div className="flex items-end justify-between mt-6 pt-4" style={{ borderTop: `1px solid ${book.color}33` }}>
            <div className="text-center">
              <div className="w-40 border-b border-slate-400 mb-1" />
              <p className="text-xs text-slate-400">Teacher / Parent Signature</p>
            </div>
            <div className="text-center">
              <p className="text-sm font-bold text-slate-700">{dateStr}</p>
              <p className="text-xs text-slate-400 mt-0.5">Date of completion</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 rounded-full border-4 flex items-center justify-center" style={{ borderColor: book.color }}>
                <span style={{ fontSize: 28 }}>{series?.icon}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
