import { useState } from 'react'
import PlaceholderImage from './PlaceholderImage.jsx'
import { useProgress } from '../contexts/StudentProgressContext.jsx'
import VocabFlashcard from './interactive/VocabFlashcard.jsx'
import MultipleChoice from './interactive/MultipleChoice.jsx'
import PEELWritingBox from './interactive/PEELWritingBox.jsx'

const tierLabel = { literal: 'Literal', inferential: 'Inferential', evaluative: 'Evaluative / Critical' }
const tierColor = { literal: 'bg-green-100 text-green-700', inferential: 'bg-amber-100 text-amber-700', evaluative: 'bg-rose-100 text-rose-700' }

function PEELQuestion({ q, index }) {
  return (
    <div className="mb-6 border border-slate-200 rounded-xl overflow-hidden">
      {/* Question header */}
      <div className="bg-slate-50 px-5 py-3 border-b border-slate-200 flex items-start gap-3">
        <span className="bg-violet-700 text-white text-xs font-bold w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0">{index + 1}</span>
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${tierColor[q.tier] || 'bg-slate-100 text-slate-600'}`}>
              {tierLabel[q.tier] || q.tier}
            </span>
            <span className="text-xs text-slate-400">P.E.E.L. Response</span>
          </div>
          <p className="font-semibold text-slate-800 text-sm">{q.question}</p>
        </div>
      </div>

      {/* PEEL scaffold */}
      <div className="divide-y divide-slate-100">
        {[
          { key: 'P', label: 'POINT', cls: 'peel-p', hint: 'State your main idea to answer the question.' },
          { key: 'E', label: 'EVIDENCE', cls: 'peel-e1', hint: 'Quote or reference the text.' },
          { key: 'E2', label: 'EXPLAIN', cls: 'peel-e2', hint: 'Explain HOW the evidence supports your point.' },
          { key: 'L', label: 'LINK', cls: 'peel-l', hint: 'Connect back to the question or a bigger idea.' },
        ].map(({ key, label, cls, hint }) => (
          <div key={key} className={`${cls} p-4`}>
            <div className="flex items-start gap-3">
              <span className="font-black text-sm w-4 flex-shrink-0">{key === 'E2' ? 'E' : key}</span>
              <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-bold uppercase tracking-wider opacity-70">{label}</span>
                  <span className="text-xs opacity-50">{hint}</span>
                </div>
                {/* Scaffold hint */}
                {q.scaffold?.[key] && (
                  <p className="text-xs italic text-slate-500 mb-2">{q.scaffold[key]}</p>
                )}
                {/* Writing lines */}
                <div className="space-y-2">
                  {[1, 2, 3].map(n => (
                    <div key={n} className="h-6 border-b border-slate-300 bg-white/50 rounded" />
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default function ComprehensionUnit({ unit, color, bookId }) {
  const { saveQuizScore, getQuizScore, studentName } = useProgress()
  const [quizAnswers, setQuizAnswers] = useState({}) // key: questionIndex, value: selectedOptionIndex

  return (
    <div className="page-break bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden mb-8">
      {/* Unit header */}
      <div className="px-8 py-5 text-white flex items-center gap-4" style={{ background: color }}>
        <div className="bg-white/20 text-white font-black text-lg w-10 h-10 rounded-full flex items-center justify-center">
          {unit.id}
        </div>
        <div>
          <p className="text-xs opacity-70 uppercase tracking-widest">Comprehension Unit</p>
          <h2 className="text-xl font-display font-bold">{unit.title}</h2>
        </div>
      </div>

      <div className="p-8">
        {/* Illustration placeholder */}
        <PlaceholderImage src={unit.image} prompt={unit.imagePrompt} color={color} alt={`Illustration for ${unit.title}`} />

        {/* Vocabulary */}
        {unit.vocabulary?.length > 0 && (
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-6">
            <p className="text-xs font-bold text-amber-700 uppercase tracking-wider mb-2">Vocabulary to Know</p>
            <div className="flex flex-wrap gap-2">
              {unit.vocabulary.map(word => (
                <span key={word} className="bg-white border border-amber-200 text-amber-800 text-sm font-semibold px-3 py-1 rounded-lg">{word}</span>
              ))}
            </div>
          </div>
        )}

        {/* Vocabulary Flashcards */}
        {unit.vocabulary?.length > 0 && unit.passage && (
          <div className="mb-6">
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">Vocabulary Flashcards</p>
            <VocabFlashcard words={unit.vocabulary} passage={unit.passage} />
          </div>
        )}

        {/* Passage */}
        <div className="bg-slate-50 rounded-xl p-6 mb-6 border border-slate-100">
          <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">Read carefully</p>
          <div className="text-slate-800 leading-relaxed text-sm whitespace-pre-line font-body">
            {unit.passage}
          </div>
        </div>

        {/* Auto-generated Multiple Choice Quiz */}
        {unit.peelQuestions?.length > 0 && (() => {
          // Auto-generate simple MCQ from the first peelQuestion (literal tier)
          const literalQ = unit.peelQuestions.find(q => q.tier === 'literal') || unit.peelQuestions[0]
          // Build 4 options: the scaffold P starter as the "correct" concept + 3 plausible wrong options
          // Use vocabulary words to build wrong options
          const vocabOptions = unit.vocabulary || []
          const savedScore = getQuizScore(bookId, unit.id)

          return (
            <div className="mb-6">
              <div className="flex items-center gap-2 mb-3">
                <span className="bg-violet-600 text-white text-xs font-bold px-2 py-1 rounded-lg">QUIZ</span>
                <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Check Your Understanding</p>
                {savedScore && <span className="ml-auto text-xs text-green-600 font-semibold">Score: {savedScore.score}/{savedScore.total} ⭐</span>}
              </div>
              <div className="space-y-4">
                {unit.peelQuestions.map((pq, qi) => {
                  // Generate 4 options from the question - use the literal answer from scaffold P
                  // and three wrong options based on vocabulary or generic distractors
                  const correctAnswer = pq.scaffold.P.replace(/\.\.\.|___+/g, '').trim()
                  const wrong1 = vocabOptions[0] ? `The passage is mainly about ${vocabOptions[0]}` : 'The text does not say'
                  const wrong2 = vocabOptions[1] ? `According to the text, ${vocabOptions[1]} is most important` : 'None of the above'
                  const wrong3 = 'The author does not give enough information'
                  const options = [correctAnswer.slice(0, 80), wrong1.slice(0, 80), wrong2.slice(0, 80), wrong3.slice(0, 80)]
                  const correct = 0 // first option is always correct

                  return (
                    <MultipleChoice
                      key={qi}
                      question={pq.question}
                      options={options}
                      correct={correct}
                      onAnswer={(isCorrect) => {
                        const newAnswers = { ...quizAnswers, [qi]: isCorrect ? correct : 1 }
                        setQuizAnswers(newAnswers)
                        const scores = Object.values(newAnswers)
                        saveQuizScore(bookId, unit.id, scores.filter(Boolean).length, unit.peelQuestions.length)
                      }}
                      disabled={quizAnswers[qi] !== undefined}
                      savedAnswer={quizAnswers[qi] ?? null}
                    />
                  )
                })}
              </div>
            </div>
          )
        })()}

        {/* PEEL reminder banner */}
        <div className="bg-violet-700 text-white rounded-xl px-5 py-3 mb-6 flex items-center gap-3">
          <div className="flex gap-1">
            {['P','E','E','L'].map((l, i) => (
              <span key={i} className="font-black text-lg">{l}</span>
            ))}
          </div>
          <p className="text-sm">Answer each question using the <strong>P.E.E.L. method</strong>. Fill in every section.</p>
        </div>

        {/* Questions */}
        <h3 className="font-display font-bold text-slate-800 mb-4">Comprehension Questions</h3>
        {unit.peelQuestions?.length > 0 && (
          <div className="space-y-6">
            <div className="flex items-center gap-2 mb-2">
              <span className="bg-rose-600 text-white text-xs font-bold px-2 py-1 rounded-lg">PEEL</span>
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Write Your Response</p>
            </div>
            {unit.peelQuestions.map((pq, qi) => (
              <PEELWritingBox
                key={qi}
                question={pq.question}
                scaffold={pq.scaffold}
                bookId={bookId}
                unitId={unit.id}
                questionIndex={qi}
                tier={pq.tier}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
