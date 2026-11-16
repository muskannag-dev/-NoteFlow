
import { Folder, Plus, FileText } from 'lucide-react'

const categories = [
  { name: 'Programming', count: 8, color: 'text-violet-400', bg: 'bg-violet-500/10' },
  { name: 'Database', count: 5, color: 'text-blue-400', bg: 'bg-blue-500/10' },
  { name: 'Mathematics', count: 6, color: 'text-pink-400', bg: 'bg-pink-500/10' },
  { name: 'General', count: 5, color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
]

function CategoriesPage() {
  return (
    <section>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h3 className="text-xl font-semibold">Categories</h3>
          <p className="mt-1 text-sm text-gray-500">
            Organize your notes by category
          </p>
        </div>

        <button className="flex items-center gap-2 rounded-xl bg-violet-600 px-4 py-3 text-sm hover:bg-violet-500">
          <Plus size={18} />
          Add Category
        </button>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {categories.map((category) => (
          <div
            key={category.name}
            className="rounded-2xl border border-white/10 bg-[#151421] p-5 transition hover:border-violet-500/40"
          >
            <div className="mb-5 flex items-center justify-between">
              <div className={`rounded-xl p-3 ${category.bg} ${category.color}`}>
                <Folder size={22} />
              </div>

              <span className="text-xs text-gray-500">
                {category.count} notes
              </span>
            </div>

            <h4 className="font-semibold">{category.name}</h4>

            <p className="mt-2 flex items-center gap-2 text-xs text-gray-500">
              <FileText size={14} />
              {category.count} notes in this category
            </p>
          </div>
        ))}
      </div>
    </section>
  )
}

export default CategoriesPage
