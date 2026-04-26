import { Link } from 'react-router-dom'

export default function CheckoutCancel() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex items-center justify-center px-4">
      <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-8 max-w-md w-full text-center shadow-sm">
        <div className="text-5xl mb-4">↩️</div>
        <h1 className="text-2xl font-display font-black text-slate-800 dark:text-slate-100 mb-2">Payment cancelled</h1>
        <p className="text-slate-500 dark:text-slate-400 mb-6 text-sm">No charge was made. You can go back and try again whenever you're ready.</p>
        <Link to="/pricing" className="block w-full bg-violet-700 text-white font-bold py-3 rounded-xl hover:bg-violet-800 mb-3 transition-colors">
          Back to Pricing
        </Link>
        <Link to="/books" className="text-sm text-slate-500 hover:underline">Browse free books</Link>
      </div>
    </div>
  )
}
