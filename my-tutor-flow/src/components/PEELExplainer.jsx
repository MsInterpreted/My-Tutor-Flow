export default function PEELExplainer() {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden mb-8 page-break">
      {/* Header */}
      <div className="bg-gradient-to-r from-violet-700 to-purple-700 text-white px-8 py-6">
        <h2 className="text-2xl font-display font-black">Understanding the P.E.E.L. Method</h2>
        <p className="text-violet-200 mt-1 text-sm">A structured approach to answering comprehension questions</p>
      </div>

      <div className="p-8">
        {/* What is PEEL */}
        <div className="bg-violet-50 rounded-xl p-5 mb-6 border border-violet-100">
          <h3 className="font-bold text-violet-800 mb-2">What is P.E.E.L.?</h3>
          <p className="text-slate-700 text-sm leading-relaxed">
            P.E.E.L. is a method for writing strong, well-supported answers to comprehension questions.
            Instead of giving a short, one-word answer, P.E.E.L. helps you build a complete, thoughtful
            response — just like a writer or thinker would. Each letter stands for a step in your answer.
          </p>
        </div>

        {/* The four steps */}
        <h3 className="font-display font-bold text-slate-800 mb-4 text-lg">The Four Steps</h3>
        <div className="space-y-4 mb-8">
          {[
            {
              letter: 'P', label: 'POINT', color: 'bg-red-500', light: 'bg-red-50 border-red-200',
              text: 'State your main idea clearly. This directly answers the question. Think of it as your topic sentence.',
              example: '"The main character shows great courage throughout the story."',
              starters: ['The main idea is...', 'The text is about...', 'I believe that...', 'The author shows that...'],
            },
            {
              letter: 'E', label: 'EVIDENCE', color: 'bg-amber-500', light: 'bg-amber-50 border-amber-200',
              text: 'Support your point with evidence from the text. This could be a direct quote, a specific detail, or a fact mentioned by the author.',
              example: '"The text states: \'She ran into the burning building without hesitating.\'"',
              starters: ['The text says...', 'According to the text...', 'The author writes...', 'For example, in the text...', 'Evidence of this is...'],
            },
            {
              letter: 'E', label: 'EXPLAIN', color: 'bg-green-500', light: 'bg-green-50 border-green-200',
              text: 'Explain HOW and WHY your evidence supports your point. This is where your thinking and analysis comes in — don\'t just quote, explain what the quote MEANS.',
              example: '"This shows that she values others\' lives above her own safety, which is the definition of true courage."',
              starters: ['This shows that...', 'This tells us...', 'This is important because...', 'This means...', 'This suggests that...', 'The author uses this to show...'],
            },
            {
              letter: 'L', label: 'LINK', color: 'bg-blue-500', light: 'bg-blue-50 border-blue-200',
              text: 'Link back to the question, to a bigger idea, or to your own experience. This shows you have thought about the deeper meaning of the text.',
              example: '"This connects to the theme of sacrifice, which is central to the story\'s message."',
              starters: ['This connects to...', 'This links to...', 'Overall, the text teaches us...', 'This is important because in real life...', 'This reminds us that...'],
            },
          ].map(({ letter, label, color, light, text, example, starters }) => (
            <div key={label} className={`rounded-xl p-5 border ${light}`}>
              <div className="flex items-start gap-4">
                <div className={`${color} text-white font-black text-xl w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0`}>
                  {letter}
                </div>
                <div className="flex-1">
                  <h4 className="font-bold text-slate-800 mb-1">{label}</h4>
                  <p className="text-sm text-slate-600 mb-3">{text}</p>
                  <div className="bg-white rounded-lg p-3 border border-slate-200 text-sm italic text-slate-700 mb-3">
                    {example}
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-slate-500 mb-1">HELPFUL SENTENCE STARTERS:</p>
                    <div className="flex flex-wrap gap-2">
                      {starters.map(s => (
                        <span key={s} className="bg-white text-xs px-2 py-1 rounded border border-slate-200 text-slate-600">{s}</span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Full example */}
        <div className="border-2 border-violet-200 rounded-xl overflow-hidden mb-6">
          <div className="bg-violet-700 text-white px-5 py-3">
            <h3 className="font-bold">A Full P.E.E.L. Example</h3>
            <p className="text-xs text-violet-200">Question: How do we know the character is brave?</p>
          </div>
          <div className="divide-y divide-slate-100">
            {[
              { letter: 'P', color: 'peel-p', label: 'Point', text: 'The character shows bravery throughout the story.' },
              { letter: 'E', color: 'peel-e1', label: 'Evidence', text: 'The text states: "She walked into the cave alone, even though her hands were shaking."' },
              { letter: 'E', color: 'peel-e2', label: 'Explain', text: 'This tells us she acted despite being afraid, which is the truest form of courage — doing the right thing even when it is difficult.' },
              { letter: 'L', color: 'peel-l', label: 'Link', text: 'This connects to the main theme of the story: that real strength comes not from the absence of fear, but from facing it.' },
            ].map(({ letter, color, label, text }) => (
              <div key={label} className={`${color} p-4 flex gap-3`}>
                <span className="font-black text-sm w-5 flex-shrink-0">{letter}</span>
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider opacity-70">{label}: </span>
                  <span className="text-sm">{text}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Reminder */}
        <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
          <h4 className="font-bold text-slate-700 mb-2">Remember:</h4>
          <ul className="text-sm text-slate-600 space-y-1">
            <li>• Every question in this book asks you to use P.E.E.L.</li>
            <li>• Use the scaffold boxes provided — they guide you through each step.</li>
            <li>• Fill in every section: P, E, E, and L.</li>
            <li>• Your evidence must come from the TEXT, not just your opinion.</li>
            <li>• The Explain step is the most important — this is where YOUR thinking shows.</li>
          </ul>
        </div>
      </div>
    </div>
  )
}
