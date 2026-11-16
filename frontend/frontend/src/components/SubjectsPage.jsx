
import { BookOpen, Plus, FileText } from 'lucide-react'

const subjects = [
  { name: 'Computer Science', count: 10, color: 'text-violet-400', bg: 'bg-violet-500/10' },
  { name: 'Mathematics', count: 6, color: 'text-blue-400', bg: 'bg-blue-500/10' },
  { name: 'Database Management', count: 5, color: 'text-pink-400', bg: 'bg-pink-500/10' },
  { name: 'General Studies', count: 3, color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
]

function SubjectsPage() {
  return (
    <section>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h3 className="text-xl font-semibold">Subjects</h3>
          <p className="mt-1 text-sm text-gray-500">
            Manage your study subjects
          </p>
        </div>

        <button className="flex items-center gap-2 rounded-xl bg-violet-600 px-4 py-3 text-sm hover:bg-violet-500">
          <Plus size={18} />
          Add Subject
        </button>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {subjects.map((subject) => (
          <div
            key={subject.name}
            className="rounded-2xl border border-white/10 bg-[#151421] p-5 transition hover:border-violet-500/40"
          >
            <div className="mb-5 flex items-center justify-between">
              <div className={`rounded-xl p-3 ${subject.bg} ${subject.color}`}>
                <BookOpen size={22} />
              </div>

              <span className="text-xs text-gray-500">
                {subject.count} notes
              </span>
            </div>

            <h4 className="font-semibold">{subject.name}</h4>

            <p className="mt-2 flex items-center gap-2 text-xs text-gray-500">
              <FileText size={14} />
              {subject.count} notes in this subject
            </p>
          </div>
        ))}
      </div>
    </section>
  )
}

export default SubjectsPage
