import { useProgress } from '../../contexts/StudentProgressContext.jsx'

export default function ProgressBar({ bookId, totalUnits = 0, color = '#7C3AED' }) {
  const { getBookProgress } = useProgress()
  const book = getBookProgress(bookId)
  const viewed = book.unitsViewed ? book.unitsViewed.length : 0
  const pct = totalUnits > 0 ? Math.round((viewed / totalUnits) * 100) : 0

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-1">
        <span className="text-xs font-medium text-slate-600 dark:text-slate-400">
          {viewed} of {totalUnits} units
        </span>
        <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">{pct}%</span>
      </div>
      <div className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-500"
          style={{ width: `${pct}%`, backgroundColor: color }}
        />
      </div>
    </div>
  )
}
