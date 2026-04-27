import { useState, useEffect } from 'react'
import { Link, useParams, useNavigate } from 'react-router-dom'
import { doc, setDoc } from 'firebase/firestore'
import { db } from '../firebase.js'
import { useAuth } from '../contexts/AuthContext.jsx'
import { FREE_ASSESSMENTS, MARKERS, MARKER_TO_BOOKS } from '../data/freeAssessments.js'
import { allBooks } from '../data/index.js'

// ── Question component ──────────────────────────────────────────────────────
function Question({ q, index, selected, onSelect, revealed }) {
  return (
    <div className="mb-6">
      <p className="font-semibold text-slate-800 dark:text-slate-100 mb-3 leading-relaxed">
        <span className="text-slate-400 mr-2">Q{index + 1}.</span>{q.text}
      </p>
      <div className="space-y-2">
        {q.options.map((opt, i) => {
          let cls = 'w-full text-left px-4 py-3 rounded-xl border text-sm font-medium transition-all '
          if (!revealed) {
            cls += selected === i
              ? 'border-violet-400 bg-violet-50 dark:bg-violet-900/30 text-violet-800 dark:text-violet-200'
              : 'border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-200 hover:border-violet-300 hover:bg-violet-50 dark:hover:bg-violet-900/20'
          } else {
            if (i === q.correct) cls += 'border-green-400 bg-green-50 dark:bg-green-900/30 text-green-800 dark:text-green-300'
            else if (selected === i) cls += 'border-red-300 bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-300'
            else cls += 'border-slate-100 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-400'
          }
          return (
            <button key={i} onClick={() => !revealed && onSelect(i)} className={cls}>
              <span className="font-bold mr-2 text-slate-400">{String.fromCharCode(65 + i)}.</span>
              {opt}
              {revealed && i === q.correct && <span className="ml-2 text-green-600">✓</span>}
              {revealed && selected === i && i !== q.correct && <span className="ml-2 text-red-500">✗</span>}
            </button>
          )
        })}
      </div>
    </div>
  )
}

// ── Lesson step ─────────────────────────────────────────────────────────────
function LessonStep({ lesson, onComplete, levelColor }) {
  const [answers, setAnswers] = useState({})
  const [revealed, setRevealed] = useState(false)

  const allAnswered = lesson.questions.every(q => answers[q.id] !== undefined)

  function submit() {
    setRevealed(true)
  }

  function next() {
    const results = lesson.questions.map(q => ({
      questionId: q.id,
      marker: q.marker,
      correct: answers[q.id] === q.correct,
    }))
    onComplete(results)
  }

  const score = revealed
    ? lesson.questions.filter(q => answers[q.id] === q.correct).length
    : null

  return (
    <div>
      <div className="flex items-center gap-3 mb-5">
        <span className="text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full text-white" style={{ backgroundColor: levelColor }}>
          {lesson.subject}
        </span>
        <h2 className="font-display font-bold text-slate-800">{lesson.title}</h2>
      </div>

      {lesson.intro && (
        <p className="text-slate-500 text-sm mb-5 italic">{lesson.intro}</p>
      )}

      {lesson.passage && (
        <div className="bg-slate-50 dark:bg-slate-800 border-l-4 rounded-r-xl p-5 mb-6 text-sm text-slate-700 dark:text-slate-200 leading-relaxed" style={{ borderColor: levelColor }}>
          <p className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Read this passage</p>
          {lesson.passage}
        </div>
      )}

      {lesson.questions.map((q, i) => (
        <Question
          key={q.id}
          q={q}
          index={i}
          selected={answers[q.id]}
          onSelect={val => setAnswers(prev => ({ ...prev, [q.id]: val }))}
          revealed={revealed}
        />
      ))}

      {!revealed ? (
        <button
          onClick={submit}
          disabled={!allAnswered}
          className="w-full py-3 rounded-xl font-bold text-white transition-colors disabled:opacity-40"
          style={{ backgroundColor: levelColor }}
        >
          {allAnswered ? 'Check My Answers' : 'Answer all questions to continue'}
        </button>
      ) : (
        <div className="mt-2">
          <div className="flex items-center justify-between bg-slate-50 dark:bg-slate-800 rounded-xl px-4 py-3 mb-4">
            <span className="text-sm text-slate-600 dark:text-slate-300 font-medium">
              You got <strong>{score} of {lesson.questions.length}</strong> correct
            </span>
            <div className="flex gap-1">
              {lesson.questions.map(q => (
                <span key={q.id} className={`w-3 h-3 rounded-full ${answers[q.id] === q.correct ? 'bg-green-400' : 'bg-red-400'}`} />
              ))}
            </div>
          </div>
          <button
            onClick={next}
            className="w-full py-3 rounded-xl font-bold text-white transition-colors"
            style={{ backgroundColor: levelColor }}
          >
            Continue →
          </button>
        </div>
      )}
    </div>
  )
}

// ── Results screen ───────────────────────────────────────────────────────────
function ResultsScreen({ assessment, allResults, guestName }) {
  const { user, profile } = useAuth()
  const navigate = useNavigate()

  const totalQ = allResults.length
  const totalCorrect = allResults.filter(r => r.correct).length
  const pct = Math.round((totalCorrect / totalQ) * 100)

  const weakMarkers = [...new Set(allResults.filter(r => !r.correct).map(r => r.marker))]
  const strongMarkers = [...new Set(allResults.filter(r => r.correct).map(r => r.marker))]

  // Books recommended based on weak markers
  const recommendedBookIds = [...new Set(weakMarkers.flatMap(m => MARKER_TO_BOOKS[m] || []))]
  const recommendedBooks = recommendedBookIds.map(id => allBooks.find(b => b.id === id)).filter(Boolean)

  const name = profile?.displayName || guestName || 'Your child'

  const scoreLabel = pct >= 80 ? { text: 'Excellent', color: 'text-green-600', bg: 'bg-green-50', border: 'border-green-200' }
    : pct >= 55 ? { text: 'Good', color: 'text-amber-600', bg: 'bg-amber-50', border: 'border-amber-200' }
    : { text: 'Needs Support', color: 'text-red-600', bg: 'bg-red-50', border: 'border-red-200' }

  return (
    <div className="space-y-6">
      {/* Score hero */}
      <div className={`rounded-2xl border-2 p-6 text-center ${scoreLabel.bg} ${scoreLabel.border}`}>
        <p className="text-5xl font-display font-black mb-1" style={{ color: assessment.color }}>{pct}%</p>
        <p className={`text-lg font-bold ${scoreLabel.color}`}>{scoreLabel.text}</p>
        <p className="text-slate-600 text-sm mt-1">{totalCorrect} of {totalQ} questions correct · {assessment.level} Level</p>
      </div>

      {/* Strength / weakness breakdown */}
      <div className="grid sm:grid-cols-2 gap-4">
        {strongMarkers.length > 0 && (
          <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-700 rounded-xl p-4">
            <p className="text-xs font-bold uppercase tracking-wider text-green-700 dark:text-green-400 mb-2">✓ Strengths</p>
            <ul className="space-y-1">
              {strongMarkers.map(m => (
                <li key={m} className="text-sm text-green-800 dark:text-green-300 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-green-400 flex-shrink-0" />
                  {MARKERS[m]}
                </li>
              ))}
            </ul>
          </div>
        )}
        {weakMarkers.length > 0 && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700 rounded-xl p-4">
            <p className="text-xs font-bold uppercase tracking-wider text-red-700 dark:text-red-400 mb-2">⚠ Needs Focus</p>
            <ul className="space-y-1">
              {weakMarkers.map(m => (
                <li key={m} className="text-sm text-red-800 dark:text-red-300 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-red-400 flex-shrink-0" />
                  {MARKERS[m]}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Recommended books CTA */}
      {weakMarkers.length > 0 && (
        <div className="bg-gradient-to-br from-violet-600 to-violet-800 text-white rounded-2xl p-6">
          <p className="text-xs font-bold uppercase tracking-wider text-violet-200 mb-2">Targeted Practice Available</p>
          <h3 className="font-display font-bold text-xl mb-1">
            {name} needs focused work on {weakMarkers.length} area{weakMarkers.length > 1 ? 's' : ''}
          </h3>
          <p className="text-violet-200 text-sm mb-4">
            These premium books are designed to directly address the gaps identified in this assessment:
          </p>
          <div className="space-y-2 mb-5">
            {recommendedBooks.map(book => (
              <div key={book.id} className="flex items-center gap-3 bg-white/10 rounded-xl px-4 py-2">
                <span className="text-xl">{book.id.includes('phonics') ? '🔤' : book.id.includes('language') ? '✍️' : '📖'}</span>
                <div>
                  <p className="font-semibold text-sm">{book.title}</p>
                  <p className="text-xs text-violet-200">{book.level} · {book.units?.length} units</p>
                </div>
              </div>
            ))}
          </div>
          <Link
            to="/pricing"
            className="block text-center bg-white text-violet-800 font-bold py-3 rounded-xl hover:bg-violet-50 transition-colors"
          >
            Unlock All Books — from R179/month →
          </Link>
          {!user && (
            <Link to="/signup" className="block text-center text-violet-200 text-sm mt-3 hover:text-white">
              Create a free account to save this report
            </Link>
          )}
        </div>
      )}

      {pct === 100 && (
        <div className="bg-gradient-to-br from-amber-500 to-amber-600 text-white rounded-2xl p-6 text-center">
          <p className="text-3xl mb-2">🏆</p>
          <h3 className="font-display font-bold text-xl mb-1">Perfect Score!</h3>
          <p className="text-amber-100 text-sm mb-4">
            {name} has mastered the {assessment.level} level. Ready for the next challenge?
          </p>
          <Link to="/assess" className="block bg-white text-amber-700 font-bold py-3 rounded-xl hover:bg-amber-50 transition-colors">
            Try the Next Level →
          </Link>
        </div>
      )}

      {/* Try another level */}
      <div className="flex gap-3">
        <Link to="/assess" className="flex-1 text-center border border-slate-200 dark:border-slate-600 text-slate-600 dark:text-slate-300 font-semibold py-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 text-sm">
          ← Try Another Level
        </Link>
        <Link to="/books" className="flex-1 text-center border border-violet-200 dark:border-violet-700 text-violet-700 dark:text-violet-400 font-semibold py-3 rounded-xl hover:bg-violet-50 dark:hover:bg-violet-900/30 text-sm">
          Browse Free Books →
        </Link>
      </div>
    </div>
  )
}

// ── Main viewer ──────────────────────────────────────────────────────────────
export default function FreeAssessmentViewer() {
  const { level } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()

  const assessment = FREE_ASSESSMENTS.find(a => a.id === level)
  // Check if lead data was pre-captured on the assessment landing page
  const savedLead = (() => { try { return JSON.parse(sessionStorage.getItem('mtf_lead') || 'null') } catch { return null } })()

  const [step, setStep] = useState(savedLead ? 1 : 0) // skip entry if email already captured
  const [guestName, setGuestName] = useState(savedLead?.childName || savedLead?.name || '')
  const [guestEmail, setGuestEmail] = useState(savedLead?.email || '')
  const [guestGrade, setGuestGrade] = useState('')
  const [guestOutcome, setGuestOutcome] = useState('')
  const [nameInput, setNameInput] = useState('')
  const [nameError, setNameError] = useState('')
  const [emailInput, setEmailInput] = useState('')
  const [emailError, setEmailError] = useState('')
  const [gradeInput, setGradeInput] = useState('')
  const [outcomeInput, setOutcomeInput] = useState('')
  const [allResults, setAllResults] = useState([])

  useEffect(() => { window.scrollTo(0, 0) }, [step])

  // Must be here (not inside a conditional) — Rules of Hooks
  useEffect(() => {
    if (step > totalSteps && allResults.length > 0) {
      saveToFirestore(guestName, guestEmail, guestGrade, guestOutcome, allResults)
    }
  }, [step]) // eslint-disable-line react-hooks/exhaustive-deps

  if (!assessment) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-2xl mb-4">Assessment not found</p>
          <Link to="/assess" className="text-violet-700 underline">Back to Assessments</Link>
        </div>
      </div>
    )
  }

  const totalSteps = assessment.lessons.length
  const isResults = step > totalSteps

  function handleLessonComplete(results) {
    setAllResults(prev => [...prev, ...results])
    setStep(s => s + 1)
  }

  async function saveToFirestore(name, email, grade, outcome, results) {
    const uid = user?.uid || `guest_${Date.now()}`
    const weakMarkers = [...new Set(results.filter(r => !r.correct).map(r => r.marker))]
    const strongMarkers = [...new Set(results.filter(r => r.correct).map(r => r.marker))]
    const resolvedEmail = user?.email || email
    const resolvedName = user?.displayName || name
    try {
      await setDoc(doc(db, 'assessments', `${uid}_${assessment.id}`), {
        uid,
        displayName: resolvedName,
        email: resolvedEmail,
        grade: grade || null,
        desiredOutcome: outcome || null,
        level: assessment.id,
        completedAt: new Date().toISOString(),
        score: { correct: results.filter(r => r.correct).length, total: results.length },
        weakMarkers,
        strongMarkers,
        responses: Object.fromEntries(results.map(r => [r.questionId, r.correct])),
        isGuest: !user,
      }, { merge: true })
    } catch { /* fail silently */ }

    // Fire results email if we have an address
    if (resolvedEmail) {
      try {
        await fetch('/api/send-assessment-email', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: resolvedEmail,
            name: resolvedName,
            level: assessment.level,
            score: { correct: results.filter(r => r.correct).length, total: results.length },
            weakMarkers,
            strongMarkers,
          }),
        })
      } catch { /* fail silently — email is best-effort */ }
      sessionStorage.removeItem('mtf_lead')
    }
  }

  // Entry step (skip if logged in)
  if (step === 0) {
    if (user) { setStep(1); return null }

    const OUTCOMES = [
      'Improve reading comprehension',
      'Build phonics & spelling confidence',
      'Strengthen grammar & writing',
      'Prepare for an exam or assessment',
      'General English enrichment',
      'Identify specific learning gaps',
    ]

    function handleStart() {
      setEmailError('')
      setNameError('')
      let valid = true
      if (!emailInput.trim() || !/\S+@\S+\.\S+/.test(emailInput)) {
        setEmailError('Please enter a valid email address.')
        valid = false
      }
      if (!nameInput.trim()) {
        setNameError("Please enter the child's name.")
        valid = false
      }
      if (!valid) return
      setGuestName(nameInput)
      setGuestEmail(emailInput)
      setGuestGrade(gradeInput)
      setGuestOutcome(outcomeInput)
      setStep(1)
    }

    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex items-center justify-center px-4 py-10">
        <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-8 max-w-md w-full shadow-sm">
          <div className="text-4xl mb-3 text-center">{assessment.icon}</div>
          <h2 className="font-display font-bold text-2xl text-slate-800 dark:text-slate-100 text-center mb-1">{assessment.level} Assessment</h2>
          <p className="text-slate-500 dark:text-slate-400 text-sm text-center mb-6">{assessment.tagline}</p>

          <div className="space-y-4">
            {/* Email — required */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-200 mb-1">
                Parent / Guardian Email <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                value={emailInput}
                onChange={e => { setEmailInput(e.target.value); setEmailError('') }}
                placeholder="e.g. parent@email.com"
                className={`w-full border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-violet-300 dark:bg-slate-700 dark:text-slate-100 ${emailError ? 'border-red-400' : 'border-slate-200 dark:border-slate-600'}`}
              />
              {emailError && <p className="text-red-500 text-xs mt-1">{emailError}</p>}
              <p className="text-xs text-slate-400 mt-1">Your report will be saved under this address.</p>
            </div>

            {/* Child's name — required */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-200 mb-1">
                Child's Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={nameInput}
                onChange={e => { setNameInput(e.target.value); setNameError('') }}
                placeholder="e.g. Sarah"
                maxLength={40}
                className={`w-full border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-violet-300 dark:bg-slate-700 dark:text-slate-100 ${nameError ? 'border-red-400' : 'border-slate-200 dark:border-slate-600'}`}
              />
              {nameError && <p className="text-red-500 text-xs mt-1">{nameError}</p>}
            </div>

            {/* Grade */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-200 mb-1">Grade / Year</label>
              <select
                value={gradeInput}
                onChange={e => setGradeInput(e.target.value)}
                className="w-full border border-slate-200 dark:border-slate-600 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-violet-300 bg-white dark:bg-slate-700 dark:text-slate-100"
              >
                <option value="">Select a grade…</option>
                {['Grade 1','Grade 2','Grade 3','Grade 4','Grade 5','Grade 6','Grade 7','Grade 8','Grade 9','Grade 10','Grade 11','Grade 12','Other'].map(g => (
                  <option key={g} value={g}>{g}</option>
                ))}
              </select>
            </div>

            {/* Desired outcome */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-200 mb-1">What would you like to focus on?</label>
              <select
                value={outcomeInput}
                onChange={e => setOutcomeInput(e.target.value)}
                className="w-full border border-slate-200 dark:border-slate-600 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-violet-300 bg-white dark:bg-slate-700 dark:text-slate-100"
              >
                <option value="">Select an outcome…</option>
                {OUTCOMES.map(o => <option key={o} value={o}>{o}</option>)}
              </select>
            </div>
          </div>

          <button
            onClick={handleStart}
            className="w-full py-3 rounded-xl font-bold text-white transition-colors mt-6"
            style={{ backgroundColor: assessment.color }}
          >
            Start Assessment →
          </button>
          <p className="text-xs text-slate-400 text-center mt-3">9 questions · ~5 minutes · free, no payment needed</p>
        </div>
      </div>
    )
  }

  // Results
  if (step > totalSteps) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
        <nav className="bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 px-4 py-3 flex items-center gap-3 sticky top-0 z-10">
          <Link to="/assess" className="text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 text-sm">← Assessments</Link>
          <span className="text-slate-300 dark:text-slate-600">|</span>
          <span className="font-semibold text-slate-700 dark:text-slate-200 text-sm">Your Results — {assessment.level}</span>
        </nav>
        <div className="max-w-2xl mx-auto px-4 py-10">
          <ResultsScreen assessment={assessment} allResults={allResults} guestName={guestName} guestEmail={guestEmail} />
        </div>
      </div>
    )
  }

  // Active lesson
  const lessonIndex = step - 1
  const lesson = assessment.lessons[lessonIndex]

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      <nav className="bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 px-4 py-3 flex items-center justify-between sticky top-0 z-10">
        <Link to="/assess" className="text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 text-sm">← Assessments</Link>
        <div className="flex items-center gap-2">
          {assessment.lessons.map((_, i) => (
            <div
              key={i}
              className="h-2 rounded-full transition-all"
              style={{
                width: i < lessonIndex ? '24px' : i === lessonIndex ? '32px' : '8px',
                backgroundColor: i <= lessonIndex ? assessment.color : '#e2e8f0',
              }}
            />
          ))}
        </div>
        <span className="text-xs text-slate-400 font-semibold">{lessonIndex + 1} / {totalSteps}</span>
      </nav>

      <div className="max-w-2xl mx-auto px-4 py-10">
        <LessonStep
          key={lesson.id}
          lesson={lesson}
          levelColor={assessment.color}
          onComplete={handleLessonComplete}
        />
      </div>
    </div>
  )
}
