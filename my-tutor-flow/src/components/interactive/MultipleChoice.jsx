import { useState } from 'react'

export default function MultipleChoice({
  question,
  options = [],
  correct,
  onAnswer,
  disabled = false,
  savedAnswer = null,
}) {
  const [selected, setSelected] = useState(savedAnswer)
  const answered = selected !== null && selected !== undefined

  const handleClick = (index) => {
    if (answered || disabled) return
    setSelected(index)
    if (typeof onAnswer === 'function') {
      onAnswer(index === correct)
    }
  }

  const getButtonClass = (index) => {
    const base = 'text-left w-full px-4 py-3 rounded-xl border-2 font-medium text-sm transition-all duration-200 flex items-start gap-3'
    const showResult = answered || disabled
    if (!showResult) {
      return `${base} bg-white dark:bg-slate-700 border-slate-200 dark:border-slate-600 text-slate-700 dark:text-slate-200 hover:border-violet-400 hover:bg-violet-50 dark:hover:bg-violet-900/30 hover:shadow-sm`
    }
    if (index === correct) {
      return `${base} bg-green-50 dark:bg-green-900/30 border-green-400 text-green-800 dark:text-green-300`
    }
    if (index === selected && index !== correct) {
      return `${base} bg-red-50 dark:bg-red-900/30 border-red-400 text-red-800 dark:text-red-300`
    }
    return `${base} bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-400 opacity-60`
  }

  const renderIcon = (index) => {
    const showResult = answered || disabled
    if (!showResult) {
      return (
        <span className="w-6 h-6 rounded-full bg-slate-100 text-slate-500 flex items-center justify-center text-xs font-bold flex-shrink-0">
          {String.fromCharCode(65 + index)}
        </span>
      )
    }
    if (index === correct) {
      return (
        <span className="w-6 h-6 rounded-full bg-green-500 text-white flex items-center justify-center text-xs font-bold flex-shrink-0">
          ✓
        </span>
      )
    }
    if (index === selected && index !== correct) {
      return (
        <span className="w-6 h-6 rounded-full bg-red-500 text-white flex items-center justify-center text-xs font-bold flex-shrink-0">
          ✗
        </span>
      )
    }
    return (
      <span className="w-6 h-6 rounded-full bg-slate-200 text-slate-400 flex items-center justify-center text-xs font-bold flex-shrink-0">
        {String.fromCharCode(65 + index)}
      </span>
    )
  }

  const isCorrect = answered && selected === correct
  const showFeedback = answered && !disabled

  return (
    <div className="mb-6">
      <div className="bg-slate-50 dark:bg-slate-800 border-l-4 border-violet-500 rounded-r-lg px-4 py-3 mb-4">
        <p className="text-sm font-semibold text-slate-800 dark:text-slate-100">{question}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {options.map((option, index) => (
          <button
            key={index}
            type="button"
            onClick={() => handleClick(index)}
            disabled={answered || disabled}
            className={getButtonClass(index)}
          >
            {renderIcon(index)}
            <span className="flex-1">{option}</span>
          </button>
        ))}
      </div>

      {showFeedback && (
        <div
          className={`mt-3 px-4 py-3 rounded-lg text-sm font-medium ${
            isCorrect
              ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 border border-green-200 dark:border-green-700'
              : 'bg-amber-50 dark:bg-amber-900/20 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-700'
          }`}
        >
          {isCorrect
            ? 'Correct! +1 ⭐'
            : `Not quite — the answer was "${options[correct]}".`}
        </div>
      )}

      {disabled && !showFeedback && (
        <div className="mt-3 px-4 py-2 rounded-lg text-xs text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
          Review mode — the correct answer is highlighted in green.
        </div>
      )}
    </div>
  )
}
