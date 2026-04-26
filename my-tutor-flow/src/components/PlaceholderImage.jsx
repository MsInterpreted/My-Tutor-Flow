export default function PlaceholderImage({ src, prompt, color = '#7C3AED', alt = 'Illustration' }) {
  if (src) {
    return (
      <div className="rounded-xl overflow-hidden my-4 shadow-sm bg-slate-100">
        <img
          src={src}
          alt={alt}
          className="w-full h-auto block"
          onError={e => {
            e.currentTarget.style.display = 'none'
            e.currentTarget.nextSibling.style.display = 'flex'
          }}
        />
        <div className="hidden flex-col items-center justify-center text-center p-6 bg-slate-50" style={{ minHeight: '180px' }}>
          <div className="text-4xl mb-3">🖼️</div>
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Image failed to load</p>
          <p className="text-xs text-slate-300 font-mono">{src}</p>
        </div>
      </div>
    )
  }

  return (
    <div
      className="rounded-xl border-2 border-dashed border-slate-200 bg-slate-50 flex flex-col items-center justify-center text-center p-6 my-4"
      style={{ minHeight: '180px' }}
    >
      <div className="text-4xl mb-3">🎨</div>
      <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Illustration Placeholder</p>
      <p className="text-xs text-slate-400 max-w-xs leading-relaxed italic">"{prompt}"</p>
    </div>
  )
}
