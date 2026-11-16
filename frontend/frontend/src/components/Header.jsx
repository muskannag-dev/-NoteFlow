
import { Bell, Plus } from 'lucide-react'

function Header({ activePage, onNewNote })  {
  return (
    <header className="mb-9 flex flex-wrap items-center justify-between gap-4">
      <div>
        <p className="mb-1 text-sm text-gray-400">
          Sunday, November 15, 2026
        </p>

        <h2 className="text-2xl font-bold md:text-3xl">
          {activePage === 'Dashboard' ? 'Welcome back!' : activePage}
        </h2>

        <p className="mt-2 text-sm text-gray-500">
          Here's what's happening with your learning space.
        </p>
      </div>

      <div className="flex items-center gap-3">
        <button
          onClick={onNewNote}
          className="flex items-center gap-2 rounded-xl bg-violet-600 px-4 py-3 text-sm font-medium hover:bg-violet-500"
        >
          <Plus size={18} />
          New Note
        </button>
      </div>
    </header>
  )
}

export default Header
