
import {
  LayoutDashboard,
  FileText,
  Folder,
  BookOpen,
  Sparkles,
  GraduationCap,
} from 'lucide-react'

const navigation = [
  { name: 'Dashboard', icon: LayoutDashboard },
  { name: 'My Notes', icon: FileText },
  { name: 'Categories', icon: Folder },
  { name: 'Subjects', icon: BookOpen },
]

function Sidebar({ activePage, setActivePage }) {
  return (
    <aside className="w-full border-b border-white/10 bg-[#11101c] p-5 md:min-h-screen md:w-64 md:border-b-0 md:border-r">

      <div className="mb-10 flex items-center gap-3">
        <div className="rounded-xl bg-violet-600 p-2.5">
          <GraduationCap size={23} />
        </div>

        <div>
          <h1 className="text-xl font-bold tracking-wide">NoteFlow</h1>
          <p className="text-xs text-gray-500">Your learning space</p>
        </div>
      </div>

      <p className="mb-4 text-xs font-semibold uppercase tracking-widest text-gray-500">
        Workspace
      </p>

      <nav className="space-y-2">
        {navigation.map((item) => {
          const Icon = item.icon

          return (
            <button
              key={item.name}
              onClick={() => setActivePage(item.name)}
              className={`flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm transition ${
                activePage === item.name
                  ? 'bg-violet-600 text-white shadow-lg shadow-violet-900/30'
                  : 'text-gray-400 hover:bg-white/5 hover:text-white'
              }`}
            >
              <Icon size={19} />
              {item.name}
            </button>
          )
        })}
      </nav>

      <div className="mt-10 rounded-2xl border border-violet-500/20 bg-violet-500/10 p-4">
        <Sparkles className="mb-3 text-violet-400" size={21} />
        <h3 className="mb-1 text-sm font-semibold">Keep learning!</h3>
        <p className="text-xs leading-5 text-gray-400">
          Organize your knowledge, one note at a time.
        </p>
      </div>

      <div className="mt-8 flex items-center gap-3 border-t border-white/10 pt-5">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-linear-to-br from-violet-500 to-indigo-600 font-bold">
          M
        </div>

        <div>
          <p className="text-sm font-medium">My Account</p>
          <p className="text-xs text-gray-500">Student</p>
        </div>
      </div>

    </aside>
  )
}

export default Sidebar
