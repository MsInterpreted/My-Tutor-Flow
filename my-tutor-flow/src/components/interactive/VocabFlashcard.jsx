import { useState, useMemo } from 'react'

function findSentenceContaining(passage, word) {
  if (!passage || !word) return ''
  const sentences = String(passage).split(/(?<=[.!?])\s+/)
  const lowerWord = word.toLowerCase()
  const match = sentences.find(s => s.toLowerCase().includes(lowerWord))
  return match || `"${word}" — try finding this word in the text.`
}

function highlightWord(sentence, word) {
  if (!sentence || !word) return sentence
  const regex = new RegExp(`(${word.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'ig')
  const parts = sentence.split(regex)
  return parts.map((part, i) =>
    part.toLowerCase() === word.toLowerCase() ? (
      <mark key={i} className="bg-yellow-200 text-slate-900 px-1 rounded">
        {part}
      </mark>
    ) : (
      <span key={i}>{part}</span>
    )
  )
}

export default function VocabFlashcard({ words = [], passage = '' }) {
  const [index, setIndex] = useState(0)
  const [flipped, setFlipped] = useState(false)

  const cards = useMemo(
    () =>
      words.map(word => ({
        word,
        context: findSentenceContaining(passage, word),
      })),
    [words, passage]
  )

  if (cards.length === 0) {
    return null
  }

  const current = cards[index]

  const goTo = (i) => {
    setFlipped(false)
    setIndex((i + cards.length) % cards.length)
  }

  return (
    <div className="mb-6">
      <div className="flex items-center justify-between mb-3">
        <h4 className="text-sm font-bold text-slate-700 uppercase tracking-wider">
          Vocabulary Flashcards
        </h4>
        <span className="text-xs text-slate-500">
          Card {index + 1} of {cards.length}
        </span>
      </div>

      {/* Card with flip */}
      <div
        className="relative w-full min-h-[200px] cursor-pointer select-none"
        style={{ perspective: '1000px' }}
        onClick={() => setFlipped(f => !f)}
      >
        <div
          className="relative w-full min-h-[200px] transition-transform duration-500"
          style={{
            transformStyle: 'preserve-3d',
            transform: flipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
          }}
        >
          {/* Front */}
          <div
            className="absolute inset-0 bg-white rounded-2xl shadow-lg border border-slate-200 flex flex-col items-center justify-center p-6 min-h-[200px]"
            style={{ backfaceVisibility: 'hidden', WebkitBackfaceVisibility: 'hidden' }}
          >
            <p className="text-xs text-slate-400 uppercase tracking-widest mb-3">
              Word
            </p>
            <h3 className="text-3xl md:text-4xl font-display font-bold text-violet-700 text-center">
              {current.word}
            </h3>
            <p className="text-xs text-slate-400 mt-6">Tap to flip →</p>
          </div>

          {/* Back */}
          <div
            className="absolute inset-0 bg-violet-50 rounded-2xl shadow-lg border border-violet-200 flex flex-col items-center justify-center p-6 min-h-[200px]"
            style={{
              backfaceVisibility: 'hidden',
              WebkitBackfaceVisibility: 'hidden',
              transform: 'rotateY(180deg)',
            }}
          >
            <p className="text-xs text-violet-500 uppercase tracking-widest mb-3">
              In context
            </p>
            <p className="text-sm md:text-base text-slate-800 text-center leading-relaxed italic">
              "{highlightWord(current.context, current.word)}"
            </p>
            <p className="text-xs text-slate-500 mt-4">flip back ←</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between mt-4">
        <button
          type="button"
          onClick={(e) => { e.stopPropagation(); goTo(index - 1) }}
          className="px-4 py-2 text-sm font-semibold text-slate-600 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
        >
          ← Prev
        </button>

        <div className="flex gap-2">
          {cards.map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={(e) => { e.stopPropagation(); goTo(i) }}
              className={`w-2.5 h-2.5 rounded-full transition-colors ${
                i === index ? 'bg-violet-600' : 'bg-slate-300 hover:bg-slate-400'
              }`}
              aria-label={`Go to card ${i + 1}`}
            />
          ))}
        </div>

        <button
          type="button"
          onClick={(e) => { e.stopPropagation(); goTo(index + 1) }}
          className="px-4 py-2 text-sm font-semibold text-slate-600 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
        >
          Next →
        </button>
      </div>
    </div>
  )
}
