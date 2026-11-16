
import { useState } from 'react'
import {
  Plus,
  Search,
  Pin,
  FileText,
  Clock,
  Trash2,
} from 'lucide-react'

function NotesPage({ notes, onNewNote, onTogglePin, onDeleteNote }) {
  const [search, setSearch] = useState('')

  const filteredNotes = notes.filter((note) =>
    `${note.title} ${note.subject} ${note.category}`
      .toLowerCase()
      .includes(search.toLowerCase())
  )

  return (
    <section>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h3 className="text-xl font-semibold">My Notes</h3>
          <p className="mt-1 text-sm text-gray-500">
            Manage all your study notes
          </p>
        </div>

        <button
          onClick={onNewNote}
          className="flex items-center gap-2 rounded-xl bg-violet-600 px-4 py-3 text-sm hover:bg-violet-500"
        >
          <Plus size={18} />
          Create Note
        </button>
      </div>

      <div className="mb-6 flex items-center gap-3 rounded-xl border border-white/10 bg-[#151421] px-4 py-3">
        <Search size={19} className="text-gray-500" />

        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search notes..."
          className="w-full bg-transparent text-sm text-white outline-none placeholder:text-gray-500"
        />
      </div>

      <div className="space-y-3">
        {filteredNotes.length > 0 ? (
          filteredNotes.map((note) => (
            <div
              key={note.title}
              className="flex items-center justify-between gap-4 rounded-2xl border border-white/10 bg-[#151421] p-5"
            >
              <div className="flex items-start gap-4">
                <div className="rounded-xl bg-violet-500/10 p-3 text-violet-400">
                  <FileText size={21} />
                </div>

                <div>
                  <div className="mb-2 flex items-center gap-2">
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

              <div className="flex items-center gap-2">
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

                <button
                  onClick={() => onDeleteNote(note.title)}
                  title="Delete note"
                  className="rounded-lg p-2 text-gray-500 transition hover:bg-red-500/10 hover:text-red-400"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          ))
        ) : (
          <p className="rounded-xl border border-white/10 bg-[#151421] p-6 text-center text-sm text-gray-500">
            No notes found.
          </p>
        )}
      </div>
    </section>
  )
}

export default NotesPage
