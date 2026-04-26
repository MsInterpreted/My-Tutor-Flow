import { useState, useEffect } from 'react'
import { useProgress } from '../../contexts/StudentProgressContext.jsx'

export default function FillBlank({
  sentences = [],
  answers = [],
  bookId,
  unitId,
  onComplete,
}) {
  const { saveFillResponse, getFillResponse } = useProgress()
  const [values, setValues] = useState(() =>
    sentences.map((_, i) => getFillResponse(bookId, unitId, i) || '')
  )
  const [checked, setChecked] = useState(false)

  useEffect(() => {
    setValues(sentences.map((_, i) => getFillResponse(bookId, unitId, i) || ''))
    setChecked(false)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [bookId, unitId])

  const handleChange = (index, value) => {
    const next = [...values]
    next[index] = value
    setValues(next)
    saveFillResponse(bookId, unitId, index, value)
  }

  const isCorrect = (index) => {
    const acceptable = (answers[index] || []).map(a => String(a).trim().toLowerCase())
    return acceptable.includes((values[index] || '').trim().toLowerCase())
  }

  const score = values.reduce((acc, _, i) => acc + (isCorrect(i) ? 1 : 0), 0)
  const total = sentences.length
  const allCorrect = checked && score === total

  const handleCheck = () => {
    setChecked(true)
    if (typeof onComplete === 'function') {
      onComplete(score, total)
    }
  }

  const handleReset = () => {
    const blanks = sentences.map(() => '')
    setValues(blanks)
    sentences.forEach((_, i) => saveFillResponse(bookId, unitId, i, ''))
    setChecked(false)
  }

  const renderSentence = (sentence, index) => {
    const parts = sentence.split('___')
    const showResult = checked
    const correct = showResult && isCorrect(index)
    const wrong = showResult && !correct

    const inputClass = [
      'inline-block mx-1 px-2 pb-0.5 text-center font-semibold bg-transparent outline-none transition-colors',
      'border-b-2 min-w-[80px]',
      !showResult ? 'border-violet-400 text-slate-800 dark:text-slate-100 focus:border-violet-600' : '',
      correct ? 'border-green-500 text-green-700 dark:text-green-400 bg-green-50 dark:bg-green-900/20' : '',
      wrong ? 'border-red-500 text-red-700 dark:text-red-400 bg-red-50 dark:bg-red-900/20' : '',
    ].join(' ')

    return (
      <div key={index} className="mb-4 text-slate-800 dark:text-slate-100 text-base leading-relaxed">
        <div className="flex flex-wrap items-baseline">
          <span className="text-xs font-bold text-slate-400 mr-2">{index + 1}.</span>
          {parts.map((part, pi) => (
            <span key={pi} className="inline">
              <span>{part}</span>
              {pi < parts.length - 1 && (
                <input
                  type="text"
                  value={values[index] || ''}
                  onChange={(e) => handleChange(index, e.target.value)}
                  disabled={checked}
                  className={inputClass}
                  aria-label={`Blank ${index + 1}`}
                />
              )}
            </span>
          ))}
        </div>
        {wrong && (
          <p className="text-xs text-red-600 dark:text-red-400 mt-1 ml-6">
            Answer: <strong>{(answers[index] || [''])[0]}</strong>
          </p>
        )}
      </div>
    )
  }

  return (
    <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-5">
      <div className="mb-5">
        {sentences.map((s, i) => renderSentence(s, i))}
      </div>

      {!checked ? (
        <button
          type="button"
          onClick={handleCheck}
          className="w-full bg-violet-600 hover:bg-violet-700 text-white font-semibold py-3 rounded-xl transition-colors"
        >
          Check Answers
        </button>
      ) : (
        <div>
          <div
            className={`rounded-xl px-4 py-3 mb-3 font-medium text-sm ${
              allCorrect
                ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 border border-green-200 dark:border-green-700'
                : 'bg-amber-50 dark:bg-amber-900/20 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-700'
            }`}
          >
            You got <strong>{score}</strong> out of <strong>{total}</strong> correct
            {allCorrect && ' — perfect! ⭐'}
          </div>
          <button
            type="button"
            onClick={handleReset}
            className="w-full bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 font-semibold py-2.5 rounded-xl transition-colors"
          >
            Try Again
          </button>
        </div>
      )}
    </div>
  )
}
