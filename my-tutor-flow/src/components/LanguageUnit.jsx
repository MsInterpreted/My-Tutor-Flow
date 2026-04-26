import { useState } from 'react'
import { useProgress } from '../contexts/StudentProgressContext.jsx'
import FillBlank from './interactive/FillBlank.jsx'
import MultipleChoice from './interactive/MultipleChoice.jsx'

export default function LanguageUnit({ unit, color, bookId }) {
  const { saveFillResponse, getFillResponse } = useProgress()

  return (
    <div className="page-break bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden mb-8">
      {/* Header */}
      <div className="px-8 py-5 text-white" style={{ background: color }}>
        <div className="flex items-center gap-4">
          <div className="bg-white/20 text-white font-black text-lg w-10 h-10 rounded-full flex items-center justify-center">{unit.id}</div>
          <div>
            <p className="text-xs opacity-70 uppercase tracking-widest">Language Skills Unit</p>
            <h2 className="text-xl font-display font-bold">{unit.title}</h2>
            {unit.focus && <p className="text-xs opacity-80 mt-0.5">{unit.focus}</p>}
          </div>
        </div>
      </div>

      <div className="p-8">
        {/* Grammar Rule box */}
        {unit.grammarRule && (
          <div className="bg-blue-700 text-white rounded-xl p-4 mb-6 flex gap-3 items-start">
            <span className="text-xl">📌</span>
            <div>
              <p className="text-xs font-bold uppercase tracking-wider opacity-80 mb-1">Grammar Rule</p>
              <p className="font-semibold">{unit.grammarRule}</p>
            </div>
          </div>
        )}

        {/* Explanation */}
        {unit.explanation && (
          <div className="bg-blue-50 border border-blue-100 rounded-xl p-5 mb-6">
            <p className="text-xs font-bold text-blue-700 uppercase tracking-wider mb-2">Understanding</p>
            <p className="text-slate-700 text-sm leading-relaxed">{unit.explanation}</p>
          </div>
        )}

        {/* Examples */}
        {unit.examples?.length > 0 && (
          <div className="bg-slate-50 rounded-xl p-5 mb-6 border border-slate-100">
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">Examples</p>
            <div className="space-y-2">
              {unit.examples.map((ex, i) => (
                <div key={i} className="flex items-start gap-2">
                  <span className="text-blue-500 font-bold text-sm mt-0.5">→</span>
                  <p className="text-sm text-slate-700">{ex}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Grammar Check Quiz */}
        {unit.examples?.length >= 2 && (
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-3">
              <span className="bg-blue-600 text-white text-xs font-bold px-2 py-1 rounded-lg">QUIZ</span>
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Grammar Check</p>
            </div>
            <MultipleChoice
              question={`Which sentence uses ${unit.focus || 'this grammar rule'} correctly?`}
              options={[
                unit.examples[0],
                unit.examples[1],
                unit.examples[0]?.replace(/\b(is|are|was|were|has|have)\b/, m => m === 'is' ? 'are' : 'is') || 'None of the above',
                'Both sentences are correct'
              ].map(s => typeof s === 'string' ? s.slice(0, 100) : 'Option')}
              correct={0}
              onAnswer={() => {}}
              disabled={false}
              savedAnswer={null}
            />
          </div>
        )}

        {/* Rules table (if present) */}
        {unit.rules?.length > 0 && !unit.rules[0]?.when && (
          <div className="mb-6">
            <h3 className="font-bold text-slate-700 mb-3 text-sm uppercase tracking-wider">Rules</h3>
            <div className="space-y-3">
              {unit.rules.map((r, i) => (
                <div key={i} className="border border-slate-200 rounded-xl p-4">
                  <p className="font-bold text-slate-700 text-sm mb-2">{r.rule || r.tense || `Rule ${i+1}`}</p>
                  {r.examples && (
                    <div className="flex flex-wrap gap-2">
                      {r.examples.map(ex => <span key={ex} className="bg-blue-50 text-blue-700 text-xs px-3 py-1 rounded-lg font-mono">{ex}</span>)}
                    </div>
                  )}
                  {r.form && <p className="text-sm text-slate-600 mt-1"><strong>Form:</strong> {r.form}</p>}
                  {r.use && <p className="text-sm text-slate-500 mt-0.5"><strong>Use:</strong> {r.use}</p>}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Activities */}
        {unit.activities?.length > 0 && (
          <div className="mb-6">
            <h3 className="font-bold text-slate-700 mb-3 text-sm uppercase tracking-wider">Activities</h3>
            <div className="space-y-5">
              {unit.activities.map((act, i) => (
                <div key={i} className="border border-slate-200 rounded-xl overflow-hidden">
                  <div className="bg-slate-50 px-4 py-3 border-b border-slate-200 flex items-center gap-2">
                    <span className="bg-blue-600 text-white text-xs font-bold w-6 h-6 rounded-full flex items-center justify-center">{i + 1}</span>
                    <p className="font-semibold text-slate-700 text-sm">{act.instruction}</p>
                  </div>
                  <div className="p-4">
                    {act.sentences && /fill|blank|complete|missing/i.test(act.instruction || '') ? (
                      <FillBlank
                        sentences={act.sentences.map(s => s.includes('___') ? s : s + ' ___')}
                        answers={act.sentences.map(s => {
                          // Extract expected answer from parenthetical hints like "(ran)" or bold words
                          const match = s.match(/\(([^)]+)\)/)
                          return match ? [match[1]] : ['']
                        })}
                        bookId={bookId}
                        unitId={unit.id}
                        onComplete={(score, total) => saveFillResponse(bookId, unit.id, 0, `${score}/${total}`)}
                      />
                    ) : act.sentences && (
                      <div className="space-y-3">
                        {act.sentences.map((s, j) => (
                          <div key={j}>
                            <p className="text-sm text-slate-700 mb-1">{s}</p>
                            <div className="space-y-1">
                              {[1, 2].map(n => <div key={n} className="h-6 border-b border-slate-200" />)}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                    {act.words && (
                      <div className="flex flex-wrap gap-2 mb-3">
                        {act.words.map(w => <span key={typeof w === 'string' ? w : JSON.stringify(w)} className="bg-slate-50 border border-slate-200 text-slate-600 text-sm px-2 py-0.5 rounded">{typeof w === 'string' ? w : JSON.stringify(w)}</span>)}
                      </div>
                    )}
                    {act.topics && (
                      <div className="flex flex-wrap gap-2 mb-3">
                        {act.topics.map(t => <span key={t} className="bg-blue-50 border border-blue-200 text-blue-700 text-sm px-3 py-1 rounded-lg">{t}</span>)}
                      </div>
                    )}
                    {act.content && act.content !== '' && (
                      <div className="bg-slate-50 rounded-lg p-3 text-sm text-slate-700 italic mb-3">{act.content}</div>
                    )}
                    {(act.type === 'write' || act.type === 'write-TS' || act.type === 'write-full') && (
                      <div className="space-y-2 mt-3">
                        {[1, 2, 3, 4, 5, 6].map(n => <div key={n} className="h-7 border-b border-slate-200" />)}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tip */}
        {unit.tip && (
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex gap-3">
            <span className="text-xl">💡</span>
            <p className="text-sm text-amber-800"><strong>Tip:</strong> {unit.tip}</p>
          </div>
        )}
      </div>
    </div>
  )
}
