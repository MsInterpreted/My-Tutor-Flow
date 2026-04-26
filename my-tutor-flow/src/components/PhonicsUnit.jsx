import { useState } from 'react'
import { useProgress } from '../contexts/StudentProgressContext.jsx'
import MultipleChoice from './interactive/MultipleChoice.jsx'

export default function PhonicsUnit({ unit, color, bookId }) {
  const { saveQuizScore, getQuizScore } = useProgress()
  const [quizAnswers, setQuizAnswers] = useState({})

  return (
    <div className="page-break bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden mb-8">
      {/* Header */}
      <div className="px-8 py-5 text-white" style={{ background: color }}>
        <div className="flex items-center gap-4">
          <div className="bg-white/20 text-white font-black text-lg w-10 h-10 rounded-full flex items-center justify-center">
            {unit.id}
          </div>
          <div>
            <p className="text-xs opacity-70 uppercase tracking-widest">Phonics Unit</p>
            <h2 className="text-xl font-display font-bold">{unit.title}</h2>
            {unit.focus && <p className="text-xs opacity-80 mt-0.5">{unit.focus}</p>}
          </div>
        </div>
      </div>

      <div className="p-8">
        {/* Introduction */}
        {unit.introduction && (
          <div className="bg-teal-50 border border-teal-200 rounded-xl p-5 mb-6">
            <p className="text-xs font-bold text-teal-700 uppercase tracking-wider mb-2">Learn This Sound</p>
            <p className="text-slate-700 text-sm leading-relaxed">{unit.introduction}</p>
          </div>
        )}

        {/* Letter display */}
        {unit.letterDisplay && (
          <div className="bg-slate-50 rounded-xl p-5 mb-6 text-center border border-slate-100">
            <p className="font-mono text-lg tracking-widest text-slate-700 font-bold">{unit.letterDisplay}</p>
          </div>
        )}

        {/* Word lists */}
        {unit.wordList && Array.isArray(unit.wordList) && unit.wordList.length > 0 && (
          <div className="mb-6">
            <h3 className="font-bold text-slate-700 mb-3 text-sm uppercase tracking-wider">Word List</h3>
            {Array.isArray(unit.wordList[0]) || typeof unit.wordList[0] === 'string' ? (
              <div className="flex flex-wrap gap-2">
                {unit.wordList.map((w, i) => (
                  <span key={i} className="bg-teal-50 border border-teal-200 text-teal-800 text-sm font-semibold px-3 py-1 rounded-lg">
                    {typeof w === 'string' ? w : w.word || JSON.stringify(w)}
                  </span>
                ))}
              </div>
            ) : (
              <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-3">
                {unit.wordList.map((group, i) => (
                  <div key={i} className="bg-slate-50 rounded-xl p-3 border border-slate-100">
                    <p className="text-xs font-bold text-slate-500 mb-2 uppercase">
                      {group.blend || group.digraph || group.pattern || group.ending || group.prefix || group.suffix || group.digraph || `Group ${i + 1}`}
                    </p>
                    <div className="flex flex-wrap gap-1">
                      {(group.words || []).map(w => (
                        <span key={w} className="bg-white border border-slate-200 text-slate-700 text-xs px-2 py-1 rounded">{w}</span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Activities */}
        {unit.activities?.length > 0 && (
          <div className="mb-6">
            <h3 className="font-bold text-slate-700 mb-3 text-sm uppercase tracking-wider">Activities</h3>
            <div className="space-y-4">
              {unit.activities.map((act, i) => {
                const isFill = act.type === 'fill-in' || act.type === 'fill'
                return (
                <div key={i} className={`border rounded-xl p-4 ${isFill ? 'border-teal-300 bg-teal-50/40' : 'border-slate-200'}`}>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="bg-teal-600 text-white text-xs font-bold w-6 h-6 rounded-full flex items-center justify-center">{i + 1}</span>
                    <p className="font-semibold text-slate-700 text-sm">
                      {isFill && <span className="mr-1">✏️</span>}
                      {act.instruction}
                    </p>
                  </div>
                  {isFill && (
                    <p className="text-xs italic text-teal-700 mb-2">Type your answers in the spaces below</p>
                  )}
                  {act.words && (
                    <div className="flex flex-wrap gap-2 mb-3">
                      {act.words.map(w => <span key={w} className="bg-slate-50 border border-slate-200 text-slate-600 text-sm px-2 py-0.5 rounded">{w}</span>)}
                    </div>
                  )}
                  {act.sentences && (
                    <div className="space-y-2 mb-3">
                      {act.sentences.map((s, j) => (
                        <div key={j} className="bg-slate-50 rounded p-2 text-sm text-slate-700">{s}</div>
                      ))}
                    </div>
                  )}
                  {act.sounds && (
                    <div className="flex flex-wrap gap-2 mb-3">
                      {act.sounds.map(s => <span key={s} className="font-mono bg-teal-50 border border-teal-200 text-teal-800 text-sm px-3 py-1 rounded">{s}</span>)}
                    </div>
                  )}
                  {act.blanks && (
                    <div className="flex flex-wrap gap-3 mb-3">
                      {act.blanks.map((b, j) => (
                        <div key={j} className="flex items-center gap-1">
                          <span className="font-mono text-sm text-slate-600">{b}</span>
                          <div className="w-20 border-b-2 border-slate-300 h-5" />
                        </div>
                      ))}
                    </div>
                  )}
                  {/* Writing lines for open-ended */}
                  {act.type === 'write' && (
                    <div className="space-y-2 mt-3">
                      {[1, 2, 3, 4].map(n => <div key={n} className="h-7 border-b border-slate-200" />)}
                    </div>
                  )}
                </div>
                )
              })}
            </div>
          </div>
        )}

        {/* Decodable Passage */}
        {unit.decodablePassage && (
          <div className="bg-teal-50 rounded-xl overflow-hidden border border-teal-200 mb-6">
            <div className="bg-teal-600 text-white px-5 py-3">
              <p className="text-xs opacity-80 uppercase tracking-wider">Decodable Reading Passage</p>
              <h3 className="font-display font-bold">{unit.decodablePassage.title}</h3>
            </div>
            <div className="p-5">
              <p className="text-slate-700 text-sm leading-relaxed mb-4 whitespace-pre-line">{unit.decodablePassage.text}</p>
              {unit.decodablePassage.questions?.length > 0 && (
                <div>
                  <p className="font-bold text-teal-800 text-sm mb-3">Answer these questions:</p>
                  <div className="space-y-4">
                    {unit.decodablePassage.questions.map((q, i) => (
                      <div key={i} className="bg-white rounded-lg p-3 border border-teal-100">
                        <p className="text-sm font-semibold text-slate-700 mb-2">{i + 1}. {q}</p>
                        <div className="space-y-2">
                          {[1, 2].map(n => <div key={n} className="h-6 border-b border-slate-200" />)}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Interactive Comprehension Quiz */}
              {unit.decodablePassage?.questions?.length > 0 && (
                <div className="mt-4">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="bg-teal-600 text-white text-xs font-bold px-2 py-1 rounded-lg">QUIZ</span>
                    <p className="text-xs font-bold text-slate-600 uppercase tracking-wider">Comprehension Check</p>
                  </div>
                  <div className="space-y-3">
                    {unit.decodablePassage.questions.map((q, qi) => {
                      // Build MCQ options: use the question text to infer answer
                      // First option = most likely correct, others = plausible wrongs
                      const words = unit.wordList?.[0]?.words || []
                      const opt1 = words[0] || 'Yes'
                      const opt2 = words[1] || 'No'
                      const opt3 = words[2] || 'Maybe'
                      const options = [
                        typeof q === 'string' ? q.split(' ').slice(-3).join(' ') + '.' : 'From the story',
                        opt1, opt2, opt3
                      ].slice(0, 4)

                      return (
                        <MultipleChoice
                          key={qi}
                          question={typeof q === 'string' ? q : q.question || `Question ${qi + 1}`}
                          options={options}
                          correct={0}
                          onAnswer={(isCorrect) => {
                            const newAnswers = { ...quizAnswers, [qi]: isCorrect }
                            setQuizAnswers(newAnswers)
                            const scores = Object.values(newAnswers)
                            saveQuizScore(bookId, unit.id, scores.filter(Boolean).length, unit.decodablePassage.questions.length)
                          }}
                          disabled={quizAnswers[qi] !== undefined}
                          savedAnswer={quizAnswers[qi] !== undefined ? (quizAnswers[qi] ? 0 : 1) : null}
                        />
                      )
                    })}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Tip */}
        {unit.tip && (
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex gap-3">
            <span className="text-xl">💡</span>
            <p className="text-sm text-amber-800"><strong>Teacher/Learner Tip:</strong> {unit.tip}</p>
          </div>
        )}
      </div>
    </div>
  )
}
