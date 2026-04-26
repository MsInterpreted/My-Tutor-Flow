import { useState, useEffect } from 'react'
import { useProgress } from '../../contexts/StudentProgressContext.jsx'
import { useAuth } from '../../contexts/AuthContext.jsx'
import { doc, getDoc } from 'firebase/firestore'
import { db } from '../../firebase.js'

const tierBadge = {
  literal: 'bg-slate-200 text-slate-700',
  inferential: 'bg-violet-200 text-violet-800',
  evaluative: 'bg-amber-200 text-amber-800',
}

const tierLabel = {
  literal: 'Literal',
  inferential: 'Inferential',
  evaluative: 'Evaluative',
}

const sections = [
  {
    key: 'P',
    label: 'P — Point',
    hint: 'State your main idea.',
    bg: 'bg-red-50 dark:bg-red-900/20',
    border: 'border-red-400',
    labelColor: 'text-red-700 dark:text-red-400',
  },
  {
    key: 'E',
    label: 'E — Evidence',
    hint: 'Quote or reference the text.',
    bg: 'bg-amber-50 dark:bg-amber-900/20',
    border: 'border-amber-400',
    labelColor: 'text-amber-700 dark:text-amber-400',
  },
  {
    key: 'E2',
    label: 'E — Explain',
    hint: 'Explain how the evidence supports your point.',
    bg: 'bg-green-50 dark:bg-green-900/20',
    border: 'border-green-400',
    labelColor: 'text-green-700 dark:text-green-400',
  },
  {
    key: 'L',
    label: 'L — Link',
    hint: 'Connect back to the question.',
    bg: 'bg-blue-50 dark:bg-blue-900/20',
    border: 'border-blue-400',
    labelColor: 'text-blue-700 dark:text-blue-400',
  },
]

export default function PEELWritingBox({
  question,
  scaffold = { P: '', E: '', E2: '', L: '' },
  bookId,
  unitId,
  questionIndex,
  tier = 'literal',
}) {
  const { savePEELResponse, getPEELResponse } = useProgress()
  const { user } = useAuth()
  const saved = getPEELResponse(bookId, unitId, questionIndex)
  const [values, setValues] = useState({
    P: saved.P || '',
    E: saved.E || '',
    E2: saved.E2 || '',
    L: saved.L || '',
  })
  const [showSaved, setShowSaved] = useState(false)
  const [teacherFeedback, setTeacherFeedback] = useState(null)

  useEffect(() => {
    if (!user) return
    const peelKey = `${unitId}-${questionIndex}`
    const docId = `${user.uid}_${bookId}_${peelKey}`
    getDoc(doc(db, 'feedback', docId)).then(snap => {
      if (snap.exists()) setTeacherFeedback(snap.data())
    }).catch(() => {})
  }, [user, bookId, unitId, questionIndex])

  useEffect(() => {
    const next = getPEELResponse(bookId, unitId, questionIndex)
    setValues({
      P: next.P || '',
      E: next.E || '',
      E2: next.E2 || '',
      L: next.L || '',
    })
    setShowSaved(
      Boolean(next.P || next.E || next.E2 || next.L)
    )
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [bookId, unitId, questionIndex])

  const handleChange = (field, value) => {
    setValues(prev => ({ ...prev, [field]: value }))
    setShowSaved(false)
  }

  const handleSave = () => {
    sections.forEach(({ key }) => {
      savePEELResponse(bookId, unitId, questionIndex, key, values[key])
    })
    setShowSaved(true)
  }

  const handleClear = () => {
    const blank = { P: '', E: '', E2: '', L: '' }
    setValues(blank)
    sections.forEach(({ key }) => {
      savePEELResponse(bookId, unitId, questionIndex, key, '')
    })
    setShowSaved(false)
  }

  return (
    <div className="mb-6 border border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden bg-white dark:bg-slate-800">
      {/* Header */}
      <div className="bg-slate-50 dark:bg-slate-700/50 px-5 py-3 border-b border-slate-200 dark:border-slate-700">
        <div className="flex items-center gap-2 mb-1">
          <span
            className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
              tierBadge[tier] || tierBadge.literal
            }`}
          >
            {tierLabel[tier] || tier}
          </span>
          <span className="text-xs text-slate-400">P.E.E.L. Response</span>
          {showSaved && (
            <span className="ml-auto text-xs font-semibold text-green-600 flex items-center gap-1">
              ✓ Saved
            </span>
          )}
        </div>
        <p className="font-semibold text-slate-800 dark:text-slate-100 text-sm">{question}</p>
      </div>

      {/* Sections */}
      <div className="divide-y divide-slate-100 dark:divide-slate-700">
        {sections.map(({ key, label, hint, bg, border, labelColor }) => (
          <div key={key} className={`${bg} border-l-4 ${border} p-4`}>
            <div className="flex items-center justify-between mb-2">
              <span className={`text-xs font-bold uppercase tracking-wider ${labelColor}`}>
                {label}
              </span>
              <span className="text-xs text-slate-500 dark:text-slate-400 italic">{hint}</span>
            </div>
            <textarea
              value={values[key]}
              onChange={(e) => handleChange(key, e.target.value)}
              placeholder={scaffold[key] || ''}
              rows={3}
              className={`w-full min-h-[80px] p-3 rounded-lg ${bg} border-0 resize-y text-sm text-slate-800 dark:text-slate-100 placeholder:text-slate-400 placeholder:italic focus:outline-none focus:ring-2 focus:ring-violet-300`}
            />
          </div>
        ))}
      </div>

      {/* Teacher feedback */}
      {teacherFeedback?.comment && (
        <div className="bg-violet-50 dark:bg-violet-900/20 border-t-2 border-violet-300 dark:border-violet-700 px-5 py-4">
          <p className="text-xs font-bold uppercase tracking-wider text-violet-600 dark:text-violet-400 mb-1">
            📝 Teacher's Feedback
            {teacherFeedback.teacherName && <span className="font-normal normal-case ml-1">— {teacherFeedback.teacherName}</span>}
          </p>
          <p className="text-sm text-violet-900 dark:text-violet-200 leading-relaxed">{teacherFeedback.comment}</p>
          {teacherFeedback.updatedAt && (
            <p className="text-xs text-violet-400 mt-1">{new Date(teacherFeedback.updatedAt).toLocaleDateString()}</p>
          )}
        </div>
      )}

      {/* Actions */}
      <div className="bg-slate-50 dark:bg-slate-700/50 px-5 py-3 border-t border-slate-200 dark:border-slate-700 flex items-center gap-3">
        <button
          type="button"
          onClick={handleSave}
          className="bg-violet-600 hover:bg-violet-700 text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors"
        >
          Save Response
        </button>
        <button
          type="button"
          onClick={handleClear}
          className="bg-white dark:bg-slate-700 hover:bg-slate-100 dark:hover:bg-slate-600 text-slate-600 dark:text-slate-300 text-sm font-semibold px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-600 transition-colors"
        >
          Clear
        </button>
        {showSaved && (
          <span className="text-xs text-green-600 font-medium ml-auto">
            Your response is saved
          </span>
        )}
      </div>
    </div>
  )
}
