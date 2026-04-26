import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { collection, getDocs, query, where, doc, updateDoc, arrayUnion, arrayRemove, setDoc } from 'firebase/firestore'
import { db } from '../firebase.js'
import { useAuth } from '../contexts/AuthContext.jsx'
import { allBooks, seriesConfig } from '../data/index.js'
import { MARKERS, FREE_ASSESSMENTS } from '../data/freeAssessments.js'
import ThemeToggle from '../components/ThemeToggle.jsx'

function StatPill({ label, value, color = 'bg-slate-100 text-slate-700' }) {
  return (
    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${color}`}>
      {label}: {value}
    </span>
  )
}

function BookAccessToggle({ bookId, hasAccess, onToggle, disabled }) {
  const book = allBooks.find(b => b.id === bookId)
  if (!book) return null
  return (
    <button
      onClick={() => onToggle(bookId, hasAccess)}
      disabled={disabled}
      title={hasAccess ? 'Click to revoke access' : 'Click to grant access'}
      className={`text-xs px-2 py-1 rounded-lg border font-medium transition-colors disabled:opacity-40 ${
        hasAccess
          ? 'bg-green-50 dark:bg-green-900/20 border-green-300 dark:border-green-700 text-green-700 dark:text-green-400 hover:bg-red-50 hover:border-red-300 hover:text-red-600'
          : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-600 text-slate-400 hover:bg-green-50 hover:border-green-300 hover:text-green-700'
      }`}
    >
      {hasAccess ? '✓' : '+'} {book.title.split('—')[1]?.trim() || book.title}
    </button>
  )
}

function PEELFeedbackRow({ peelKey, resp, studentUid, bookId, teacherName, teacherUid }) {
  const [comment, setComment] = useState('')
  const [saved, setSaved] = useState(false)
  const [saving, setSaving] = useState(false)
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    const docId = `${studentUid}_${bookId}_${peelKey}`
    import('firebase/firestore').then(({ doc: firestoreDoc, getDoc }) => {
      getDoc(firestoreDoc(db, 'feedback', docId)).then(snap => {
        if (snap.exists()) { setComment(snap.data().comment || ''); setSaved(true) }
        setLoaded(true)
      })
    })
  }, [studentUid, bookId, peelKey])

  async function saveFeedback() {
    setSaving(true)
    const docId = `${studentUid}_${bookId}_${peelKey}`
    await setDoc(doc(db, 'feedback', docId), {
      studentUid, bookId, peelKey, comment,
      teacherName, teacherUid,
      updatedAt: new Date().toISOString(),
    }, { merge: true })
    setSaved(true)
    setSaving(false)
  }

  return (
    <div className="mb-3 text-xs text-slate-600 dark:text-slate-300 border-l-2 border-violet-200 dark:border-violet-700 pl-3">
      <p className="text-slate-400 mb-1">Unit {peelKey.split('-')[0]}, Q{parseInt(peelKey.split('-')[1]) + 1}</p>
      {resp.P && <p><span className="font-bold text-violet-600">P:</span> {resp.P}</p>}
      {resp.E && <p><span className="font-bold text-violet-600">E:</span> {resp.E}</p>}
      {resp.E2 && <p><span className="font-bold text-violet-600">E:</span> {resp.E2}</p>}
      {resp.L && <p><span className="font-bold text-violet-600">L:</span> {resp.L}</p>}
      {loaded && (
        <div className="mt-2 bg-violet-50 dark:bg-violet-900/20 rounded-lg p-2 border border-violet-100 dark:border-violet-800">
          <p className="text-xs font-bold text-violet-600 dark:text-violet-400 mb-1">📝 Your Feedback</p>
          <textarea
            value={comment}
            onChange={e => { setComment(e.target.value); setSaved(false) }}
            placeholder="Leave feedback for this student…"
            rows={2}
            className="w-full text-xs border border-violet-200 dark:border-violet-700 rounded-lg p-2 resize-none focus:outline-none focus:ring-1 focus:ring-violet-400 bg-white dark:bg-slate-700 dark:text-slate-100"
          />
          <div className="flex items-center gap-2 mt-1">
            <button
              onClick={saveFeedback}
              disabled={saving || !comment.trim()}
              className="text-xs bg-violet-600 text-white font-semibold px-3 py-1 rounded-lg hover:bg-violet-700 disabled:opacity-40 transition-colors"
            >
              {saving ? 'Saving…' : 'Save Feedback'}
            </button>
            {saved && <span className="text-xs text-green-600 font-medium">✓ Saved — student can see this</span>}
          </div>
        </div>
      )}
    </div>
  )
}

function StudentRow({ student, progress, onToggleBook, toggling, teacherProfile }) {
  const [expanded, setExpanded] = useState(false)
  const books = progress?.books || {}

  const booksStarted = Object.values(books).filter(b => b.unitsViewed?.length > 0).length
  const booksCompleted = Object.values(books).filter(b => b.completed).length
  const totalStars = Object.values(books).reduce((s, b) => s + (b.stars || 0), 0)

  const lastActive = progress?.updatedAt
    ? new Date(progress.updatedAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })
    : 'Never'

  const purchasedBooks = student.purchasedBooks || []
  const hasSub = student.subscription === 'premium' || student.subscription === 'institution'

  return (
    <div className="border border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden">
      {/* Student header row */}
      <button
        className="w-full text-left px-5 py-4 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700/50 flex items-center gap-4 transition-colors"
        onClick={() => setExpanded(e => !e)}
      >
        <div className="w-9 h-9 rounded-full bg-violet-100 dark:bg-violet-900/40 text-violet-700 dark:text-violet-400 font-bold flex items-center justify-center text-sm flex-shrink-0">
          {(student.displayName || student.email || '?')[0].toUpperCase()}
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-slate-800 dark:text-slate-100 truncate">{student.displayName || '—'}</p>
          <p className="text-xs text-slate-400 truncate">{student.email}</p>
        </div>
        <div className="hidden sm:flex items-center gap-2 flex-shrink-0">
          <StatPill label="Started" value={booksStarted} />
          <StatPill label="Done" value={booksCompleted} color="bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400" />
          <StatPill label="⭐" value={totalStars} color="bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400" />
          <span className="text-xs text-slate-400 ml-2">{lastActive}</span>
        </div>
        <span className="text-slate-300 dark:text-slate-600 ml-2">{expanded ? '▲' : '▼'}</span>
      </button>

      {/* Expanded detail */}
      {expanded && (
        <div className="border-t border-slate-100 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 px-5 py-4 space-y-5">

          {/* Subscription badge */}
          <div className="flex items-center gap-2 flex-wrap">
            <span className={`text-xs font-bold px-2 py-1 rounded-full ${
              hasSub ? 'bg-violet-100 text-violet-700' : 'bg-slate-100 text-slate-500'
            }`}>
              {hasSub ? '✓ Subscribed' : 'Free plan'}
            </span>
            {student.isUnder13 && <span className="text-xs bg-blue-50 text-blue-600 font-semibold px-2 py-1 rounded-full">Under 13</span>}
          </div>

          {/* Book progress grid */}
          <div>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Book Progress</p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              {allBooks.map(book => {
                const bp = books[book.id]
                const viewed = bp?.unitsViewed?.length || 0
                const total = book.units?.length || 0
                const pct = total > 0 ? Math.round((viewed / total) * 100) : 0
                const series = seriesConfig[book.series]
                return (
                  <div key={book.id} className="bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg p-3">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-base">{series?.icon}</span>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-semibold text-slate-700 dark:text-slate-200 truncate">{book.title.split('—')[1]?.trim() || book.title}</p>
                        <p className="text-xs text-slate-400">{book.level}</p>
                      </div>
                      {bp?.completed && <span className="text-green-600 text-xs font-bold">✓</span>}
                    </div>
                    {/* Progress bar */}
                    <div className="h-1.5 bg-slate-100 dark:bg-slate-600 rounded-full overflow-hidden mb-1">
                      <div className="h-full rounded-full transition-all" style={{ width: `${pct}%`, backgroundColor: book.color }} />
                    </div>
                    <div className="flex justify-between text-xs text-slate-400 dark:text-slate-500">
                      <span>{viewed}/{total} units</span>
                      {bp?.stars > 0 && <span>{'⭐'.repeat(bp.stars)}</span>}
                    </div>
                    {/* PEEL responses preview */}
                    {bp?.peelResponses && Object.keys(bp.peelResponses).length > 0 && (
                      <p className="text-xs text-violet-600 mt-1 font-medium">
                        {Object.keys(bp.peelResponses).length} PEEL response{Object.keys(bp.peelResponses).length !== 1 ? 's' : ''}
                      </p>
                    )}
                  </div>
                )
              })}
            </div>
          </div>

          {/* Book access management (only for non-subscribers) */}
          {!hasSub && (
            <div>
              <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Manually Grant Book Access</p>
              <div className="flex flex-wrap gap-2">
                {allBooks.filter(b => b.id !== 'comprehension-beginner').map(book => (
                  <BookAccessToggle
                    key={book.id}
                    bookId={book.id}
                    hasAccess={purchasedBooks.includes(book.id)}
                    onToggle={onToggleBook}
                    disabled={toggling === student.uid}
                  />
                ))}
              </div>
              <p className="text-xs text-slate-400 mt-2">Comprehension Beginner is always free.</p>
            </div>
          )}

          {/* PEEL response viewer with feedback */}
          {Object.values(books).some(b => b.peelResponses && Object.keys(b.peelResponses).length > 0) && (
            <div>
              <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">PEEL Responses & Feedback</p>
              <div className="space-y-2">
                {allBooks.map(book => {
                  const bp = books[book.id]
                  if (!bp?.peelResponses || Object.keys(bp.peelResponses).length === 0) return null
                  return (
                    <div key={book.id} className="bg-white dark:bg-slate-700 border border-violet-100 dark:border-violet-800 rounded-lg p-3">
                      <p className="text-xs font-bold text-violet-700 dark:text-violet-400 mb-2">{book.title.split('—')[1]?.trim() || book.title}</p>
                      {Object.entries(bp.peelResponses).map(([key, resp]) => (
                        <PEELFeedbackRow
                          key={key}
                          peelKey={key}
                          resp={resp}
                          studentUid={student.uid}
                          bookId={book.id}
                          teacherName={teacherProfile?.displayName || 'Teacher'}
                          teacherUid={teacherProfile?.uid}
                        />
                      ))}
                    </div>
                  )
                })}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

function AssessmentsTab() {
  const [assessments, setAssessments] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getDocs(collection(db, 'assessments')).then(snap => {
      const list = snap.docs.map(d => d.data()).sort((a, b) => b.completedAt?.localeCompare(a.completedAt))
      setAssessments(list)
      setLoading(false)
    }).catch(() => setLoading(false))
  }, [])

  const levelInfo = Object.fromEntries(FREE_ASSESSMENTS.map(a => [a.id, a]))

  if (loading) return <div className="py-16 text-center"><div className="w-8 h-8 border-4 border-violet-600 border-t-transparent rounded-full animate-spin mx-auto" /></div>

  if (assessments.length === 0) return (
    <div className="text-center py-16 text-slate-400">
      <p className="text-4xl mb-3">📋</p>
      <p className="font-semibold">No assessments completed yet.</p>
      <p className="text-sm mt-1">Share the <Link to="/assess" className="text-violet-600 underline">/assess</Link> page with students to get started.</p>
    </div>
  )

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-3 gap-4 mb-6">
        {FREE_ASSESSMENTS.map(a => {
          const count = assessments.filter(x => x.level === a.id).length
          return (
            <div key={a.id} className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-4 text-center">
              <p className="text-2xl font-display font-black" style={{ color: a.color }}>{count}</p>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-semibold mt-0.5">{a.level}</p>
            </div>
          )
        })}
      </div>

      {assessments.map((a, idx) => {
        const info = levelInfo[a.level]
        const pct = a.score?.total > 0 ? Math.round((a.score.correct / a.score.total) * 100) : 0
        const scoreColor = pct >= 80 ? 'text-green-600' : pct >= 55 ? 'text-amber-600' : 'text-red-600'
        return (
          <div key={idx} className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden">
            <div className="px-5 py-4 flex items-center gap-4">
              <div className="w-9 h-9 rounded-full flex items-center justify-center text-lg flex-shrink-0" style={{ backgroundColor: info?.color + '22' }}>
                {info?.icon || '📋'}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-slate-800 dark:text-slate-100">{a.displayName || 'Anonymous'}</p>
                <p className="text-xs text-slate-400 truncate">{a.email || 'No email'}</p>
                <p className="text-xs text-slate-400">
                  {info?.level}
                  {a.grade && <> · {a.grade}</>}
                  {' · '}{a.completedAt ? new Date(a.completedAt).toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' }) : '—'}
                  {a.isGuest && <span className="ml-2 bg-slate-100 text-slate-500 text-xs px-1.5 py-0.5 rounded">Guest</span>}
                </p>
                {a.desiredOutcome && <p className="text-xs text-violet-600 font-medium mt-0.5">🎯 {a.desiredOutcome}</p>}
              </div>
              <div className="text-right flex-shrink-0">
                <p className={`text-xl font-display font-black ${scoreColor}`}>{pct}%</p>
                <p className="text-xs text-slate-400">{a.score?.correct}/{a.score?.total} correct</p>
              </div>
            </div>
            {(a.weakMarkers?.length > 0) && (
              <div className="px-5 pb-4 flex flex-wrap gap-2">
                {a.weakMarkers.map(m => (
                  <span key={m} className="text-xs bg-red-50 border border-red-200 text-red-700 font-medium px-2 py-0.5 rounded-full">
                    ⚠ {MARKERS[m]}
                  </span>
                ))}
                {a.strongMarkers?.map(m => (
                  <span key={m} className="text-xs bg-green-50 border border-green-200 text-green-700 font-medium px-2 py-0.5 rounded-full">
                    ✓ {MARKERS[m]}
                  </span>
                ))}
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}

export default function TeacherDashboard() {
  const { profile, isTeacher } = useAuth()
  const navigate = useNavigate()
  const [tab, setTab] = useState('students')
  const [students, setStudents] = useState([])
  const [progressMap, setProgressMap] = useState({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [toggling, setToggling] = useState('')
  const [search, setSearch] = useState('')

  useEffect(() => {
    if (!isTeacher) { navigate('/dashboard'); return }
    loadStudents()
  }, [isTeacher])

  async function loadStudents() {
    setLoading(true)
    setError('')
    try {
      const q = query(collection(db, 'users'), where('role', '==', 'student'))
      const snap = await getDocs(q)
      const list = snap.docs.map(d => d.data())
      setStudents(list)

      // Load all progress docs in parallel
      const progressDocs = await Promise.all(
        list.map(s => getDocs(query(collection(db, 'progress'), where('uid', '==', s.uid))).then(r => r.docs[0]?.data()))
      )
      const map = {}
      list.forEach((s, i) => { if (progressDocs[i]) map[s.uid] = progressDocs[i] })
      setProgressMap(map)
    } catch (err) {
      setError('Could not load students. Make sure you have Firestore access.')
      console.error(err)
    }
    setLoading(false)
  }

  async function toggleBookAccess(studentUid, bookId, currentlyHasAccess) {
    setToggling(studentUid)
    try {
      const ref = doc(db, 'users', studentUid)
      if (currentlyHasAccess) {
        await updateDoc(ref, { purchasedBooks: arrayRemove(bookId) })
      } else {
        await updateDoc(ref, { purchasedBooks: arrayUnion(bookId) })
      }
      setStudents(prev => prev.map(s => {
        if (s.uid !== studentUid) return s
        const books = s.purchasedBooks || []
        return {
          ...s,
          purchasedBooks: currentlyHasAccess
            ? books.filter(b => b !== bookId)
            : [...books, bookId]
        }
      }))
    } catch {
      alert('Failed to update book access.')
    }
    setToggling('')
  }

  const filtered = students.filter(s => {
    if (!search) return true
    const q = search.toLowerCase()
    return s.displayName?.toLowerCase().includes(q) || s.email?.toLowerCase().includes(q)
  })

  const totalStudents = students.length
  const activeStudents = students.filter(s => progressMap[s.uid]?.updatedAt).length
  const subscribed = students.filter(s => s.subscription === 'premium' || s.subscription === 'institution').length

  if (!isTeacher) return null

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      <nav className="bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 px-4 py-3 flex items-center gap-4 sticky top-0 z-10">
        <Link to="/" className="text-violet-700 font-bold text-lg font-display">My Tutor Flow</Link>
        <span className="text-slate-300 dark:text-slate-600">|</span>
        <span className="text-slate-600 dark:text-slate-300 text-sm font-semibold">Teacher Dashboard</span>
        <div className="ml-auto flex items-center gap-3">
          <Link to="/books" className="text-sm text-slate-500 dark:text-slate-400 hover:text-violet-700 transition-colors">Books</Link>
          <span className="text-xs bg-violet-100 dark:bg-violet-900/40 text-violet-700 dark:text-violet-400 font-bold px-2 py-1 rounded-full">
            {profile?.displayName || 'Teacher'}
          </span>
          <ThemeToggle />
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-4 py-10 space-y-8">

        {/* Tabs */}
        <div className="flex gap-1 bg-slate-100 dark:bg-slate-700 rounded-xl p-1 w-fit">
          {[['students', '👩‍🎓 Students'], ['assessments', '📋 Assessments']].map(([key, label]) => (
            <button key={key} onClick={() => setTab(key)}
              className={`px-5 py-2 rounded-lg text-sm font-semibold transition-colors ${tab === key ? 'bg-white dark:bg-slate-600 text-violet-700 dark:text-violet-300 shadow-sm' : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'}`}>
              {label}
            </button>
          ))}
        </div>

        {tab === 'assessments' && <AssessmentsTab />}
        {tab === 'students' && <>

        {/* Stats row */}
        <div className="grid grid-cols-3 gap-4">
          {[
            { label: 'Total Students', value: totalStudents, color: 'text-violet-700 dark:text-violet-400', bg: 'bg-violet-50 dark:bg-violet-900/20' },
            { label: 'Active Students', value: activeStudents, color: 'text-green-700 dark:text-green-400', bg: 'bg-green-50 dark:bg-green-900/20' },
            { label: 'Subscribed', value: subscribed, color: 'text-amber-700 dark:text-amber-400', bg: 'bg-amber-50 dark:bg-amber-900/20' },
          ].map(({ label, value, color, bg }) => (
            <div key={label} className={`${bg} rounded-2xl p-5 border border-white dark:border-slate-700 shadow-sm text-center`}>
              <p className={`text-3xl font-display font-black ${color}`}>{value}</p>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 uppercase tracking-wider font-semibold">{label}</p>
            </div>
          ))}
        </div>

        {/* Header + search */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <h2 className="text-xl font-display font-bold text-slate-800 dark:text-slate-100">Students</h2>
          <div className="flex items-center gap-3">
            <input
              type="search"
              placeholder="Search by name or email…"
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="border border-slate-200 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-100 rounded-xl px-4 py-2 text-sm w-64 focus:outline-none focus:ring-2 focus:ring-violet-300"
            />
            <button onClick={loadStudents} className="text-sm text-violet-700 hover:underline font-semibold">Refresh</button>
          </div>
        </div>

        {error && <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl px-4 py-3">{error}</div>}

        {loading ? (
          <div className="text-center py-16">
            <div className="w-10 h-10 border-4 border-violet-600 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
            <p className="text-slate-500 text-sm">Loading students…</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-16 text-slate-400">
            <p className="text-4xl mb-3">👩‍🎓</p>
            <p className="font-semibold">{search ? 'No students match your search.' : 'No students yet.'}</p>
            <p className="text-sm mt-1">Students appear here once they create an account.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {filtered.map(student => (
              <StudentRow
                key={student.uid}
                student={student}
                progress={progressMap[student.uid]}
                onToggleBook={(bookId, hasAccess) => toggleBookAccess(student.uid, bookId, hasAccess)}
                toggling={toggling}
                teacherProfile={profile}
              />
            ))}
          </div>
        )}

        {/* Export hint */}
        {!loading && filtered.length > 0 && (
          <div className="bg-slate-100 dark:bg-slate-800 rounded-xl px-4 py-3 text-xs text-slate-500 dark:text-slate-400 flex items-center justify-between">
            <span>Showing {filtered.length} of {totalStudents} students</span>
            <button
              onClick={() => exportCSV(filtered, progressMap)}
              className="text-violet-700 font-semibold hover:underline"
            >
              Export CSV →
            </button>
          </div>
        )}
        </>}
      </div>
    </div>
  )
}

function exportCSV(students, progressMap) {
  const rows = [['Name', 'Email', 'Subscription', 'Books Started', 'Books Completed', 'Total Stars', 'Last Active']]
  students.forEach(s => {
    const p = progressMap[s.uid]
    const books = p?.books || {}
    const started = Object.values(books).filter(b => b.unitsViewed?.length > 0).length
    const completed = Object.values(books).filter(b => b.completed).length
    const stars = Object.values(books).reduce((acc, b) => acc + (b.stars || 0), 0)
    const last = p?.updatedAt ? new Date(p.updatedAt).toLocaleDateString() : 'Never'
    rows.push([s.displayName || '', s.email || '', s.subscription || 'free', started, completed, stars, last])
  })
  const csv = rows.map(r => r.map(v => `"${v}"`).join(',')).join('\n')
  const blob = new Blob([csv], { type: 'text/csv' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url; a.download = 'students.csv'; a.click()
  URL.revokeObjectURL(url)
}
