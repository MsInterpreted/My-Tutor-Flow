import { seriesConfig, levelConfig } from '../data/index.js'

export default function BookCover({ book }) {
  const config = seriesConfig[book.series] || {}
  const lc = levelConfig[book.level] || {}

  return (
    <div className="page-break bg-white rounded-2xl shadow overflow-hidden mb-8 print-full" style={{ minHeight: '400px' }}>
      {/* Main cover */}
      <div
        className="relative flex flex-col items-center justify-center text-white text-center px-8 py-16"
        style={{ background: `linear-gradient(145deg, ${book.color} 0%, ${book.color}99 60%, #1e1b4b 100%)`, minHeight: '340px' }}
      >
        {/* Background pattern */}
        <div className="absolute inset-0 opacity-10 overflow-hidden pointer-events-none">
          {[...Array(12)].map((_, i) => (
            <div
              key={i}
              className="absolute rounded-full border-2 border-white"
              style={{
                width: `${60 + i * 40}px`, height: `${60 + i * 40}px`,
                top: `${Math.sin(i) * 30 + 40}%`, left: `${(i * 83) % 100}%`,
                transform: 'translate(-50%, -50%)',
              }}
            />
          ))}
        </div>

        <div className="relative z-10">
          {/* Publisher badge */}
          <div className="inline-block bg-white/20 backdrop-blur px-4 py-1 rounded-full mb-6 text-center">
            <p className="text-xs font-bold tracking-widest uppercase">My Tutor Flow</p>
            <p className="text-xs opacity-70">powered by TD Learning Academy</p>
          </div>

          {/* Series icon */}
          <div className="text-6xl mb-4">{config.icon}</div>

          {/* Level badge */}
          <div className="inline-block bg-white/20 text-sm font-bold px-4 py-1 rounded-full mb-4">
            {book.level} Level
          </div>

          {/* Title */}
          <h1 className="text-3xl md:text-4xl font-display font-black leading-tight mb-2">
            {book.title}
          </h1>
          <p className="text-lg opacity-80 mb-6">{book.subtitle}</p>

          {/* Description */}
          <p className="text-sm opacity-70 max-w-md mx-auto">{book.description}</p>
        </div>
      </div>

      {/* Cover footer */}
      <div className="px-8 py-4 bg-white flex items-center justify-between border-t border-slate-100">
        <div className="text-sm text-slate-500">
          <span className="font-semibold text-slate-700">{config.name} Series</span>
          <span className="mx-2">·</span>
          {book.units?.length || 0} Units
        </div>
        <div className={`text-xs font-semibold px-3 py-1 rounded-full ${lc.badge}`}>
          {book.level}
        </div>
      </div>
    </div>
  )
}
