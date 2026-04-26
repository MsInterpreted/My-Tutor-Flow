import { Link } from 'react-router-dom'

function starsForPct(pct) {
  if (pct >= 80) return 3
  if (pct >= 60) return 2
  return 1
}

function StarRow({ filled, total = 3 }) {
  return (
    <div className="flex gap-1" aria-label={`${filled} out of ${total} stars`}>
      {Array.from({ length: total }).map((_, i) => (
        <span
          key={i}
          className={`text-2xl ${i < filled ? '' : 'opacity-25 grayscale'}`}
        >
          ⭐
        </span>
      ))}
    </div>
  )
}

export default function QuizSummary({
  bookId,
  bookTitle,
  unitScores = [],
  onClose,
}) {
  const totalEarned = unitScores.reduce((sum, u) => sum + (u.score || 0), 0)
  const totalPossible = unitScores.reduce((sum, u) => sum + (u.total || 0), 0)
  const pct = totalPossible > 0 ? Math.round((totalEarned / totalPossible) * 100) : 0
  const stars = starsForPct(pct)
  const perfect = pct === 100

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm">
      <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-br from-violet-600 to-violet-800 text-white px-6 py-5">
          <p className="text-xs uppercase tracking-widest opacity-80">{bookTitle}</p>
          <h2 className="font-display font-bold text-2xl mt-1">Unit Quiz Results</h2>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-6 py-5">
          {perfect && (
            <div className="text-center mb-5">
              <div className="text-5xl mb-2">🎉</div>
              <p className="text-lg font-bold text-green-700">Perfect score!</p>
            </div>
          )}

          {unitScores.length === 0 ? (
            <p className="text-slate-500 text-sm text-center py-8">
              No quizzes completed yet.
            </p>
          ) : (
            <div className="space-y-3 mb-5">
              {unitScores.map((u) => {
                const unitPct = u.total > 0 ? Math.round((u.score / u.total) * 100) : 0
                return (
                  <div key={u.unitId} className="bg-slate-50 border border-slate-200 rounded-xl p-3">
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-sm font-semibold text-slate-800 truncate pr-3">
                        {u.unitId}. {u.title}
                      </p>
                      <span className="text-xs font-bold text-slate-600 whitespace-nowrap">
                        {u.score}/{u.total} {unitPct === 100 && '⭐'}
                      </span>
                    </div>
                    <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-green-500 transition-all duration-500"
                        style={{ width: `${unitPct}%` }}
                      />
                    </div>
                  </div>
                )
              })}
            </div>
          )}

          {/* Overall */}
          <div className="bg-violet-50 border border-violet-200 rounded-xl p-4 flex items-center justify-between">
            <div>
              <p className="text-xs text-violet-600 uppercase tracking-wider font-bold">
                Overall Score
              </p>
              <p className="text-3xl font-display font-bold text-violet-800 mt-1">
                {pct}%
              </p>
              <p className="text-xs text-slate-500 mt-0.5">
                {totalEarned} of {totalPossible} correct
              </p>
            </div>
            <StarRow filled={stars} />
          </div>
        </div>

        {/* Footer */}
        <div className="bg-slate-50 border-t border-slate-200 px-6 py-4 flex items-center gap-3 justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-sm font-semibold text-slate-600 bg-white border border-slate-200 rounded-lg hover:bg-slate-100 transition-colors"
          >
            Close
          </button>
          <Link
            to="/books"
            onClick={onClose}
            className="px-4 py-2 text-sm font-semibold text-white bg-violet-600 hover:bg-violet-700 rounded-lg transition-colors"
          >
            Back to Books
          </Link>
        </div>
      </div>
    </div>
  )
}
