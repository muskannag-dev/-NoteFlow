
import { FileText, Pin, Clock } from 'lucide-react'

function RecentNotes({ notes, onTogglePin }) {
  return (
    <section>
      <div className="mb-5 flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Recent Notes</h3>
          <p className="mt-1 text-sm text-gray-500">
            Your recently updated notes
          </p>
        </div>

        <button className="text-sm text-violet-400 hover:text-violet-300">
          View all
        </button>
      </div>

      <div className="space-y-3">
        {notes.map((note) => (
          <div
            key={note.title}
            className="group flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-white/10 bg-[#151421] p-5 transition hover:border-violet-500/40"
          >
            <div className="flex min-w-0 items-start gap-4">
              <div className="rounded-xl bg-violet-500/10 p-3 text-violet-400">
                <FileText size={21} />
              </div>

              <div className="min-w-0">
                <div className="mb-2 flex flex-wrap items-center gap-2">
                  <h4 className="font-semibold">{note.title}</h4>

                  {note.pinned && (
                    <Pin size={14} className="text-violet-400" />
                  )}
                </div>

                <p className="mb-3 text-xs text-gray-500">
                  {note.subject}
                </p>

                <div className="flex flex-wrap items-center gap-3">
                  <span className={`rounded-lg px-2.5 py-1 text-xs ${note.color}`}>
                    {note.category}
                  </span>

                  <span className="flex items-center gap-1 text-xs text-gray-500">
                    <Clock size={13} />
                    {note.date}
                  </span>
                </div>
              </div>
            </div>

            <button
              onClick={() => onTogglePin(note.title)}
              title={note.pinned ? 'Unpin note' : 'Pin note'}
              className={`rounded-lg p-2 transition ${
                note.pinned
                  ? 'bg-violet-500/10 text-violet-400'
                  : 'text-gray-500 hover:bg-white/5 hover:text-violet-400'
              }`}
            >
              <Pin size={18} />
            </button>
          </div>
        ))}
      </div>
    </section>
  )
}

export default RecentNotes
