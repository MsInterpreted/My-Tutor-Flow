import { Link } from 'react-router-dom'

export default function UpgradePrompt({ bookTitle }) {
  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4 py-16">
      <div className="bg-white dark:bg-slate-800 rounded-2xl border-2 border-violet-200 dark:border-violet-700 p-8 max-w-md w-full text-center shadow-sm">
        <div className="w-16 h-16 bg-violet-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-violet-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
        </div>
        <h2 className="text-xl font-display font-black text-slate-800 dark:text-slate-100 mb-2">Unlock {bookTitle}</h2>
        <p className="text-slate-500 dark:text-slate-400 text-sm mb-6">
          Get full access to all 9 books with a subscription, or buy this book once and own it forever.
        </p>
        <Link to="/pricing" className="block w-full bg-violet-700 text-white font-bold py-3 rounded-xl hover:bg-violet-800 mb-3 transition-colors">
          View Pricing →
        </Link>
        <Link to="/books" className="text-sm text-slate-500 hover:underline">Back to Books</Link>
      </div>
    </div>
  )
}
