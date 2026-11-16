
import { useState } from 'react'
import { X } from 'lucide-react'

function AddNoteModal({ onClose, onAddNote }) {
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [subject, setSubject] = useState('')
  const [category, setCategory] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()

    if (!title.trim() || !content.trim()) return

    onAddNote({
      title,
      content,
      subject,
      category,
      date: 'Just now',
      color: 'bg-violet-500/15 text-violet-300',
      pinned: false,
    })

    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
      <div className="w-full max-w-lg rounded-2xl border border-white/10 bg-[#151421] p-6">

        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-xl font-semibold">Create New Note</h2>

          <button onClick={onClose} className="text-gray-400 hover:text-white">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">

          <input
            type="text"
            placeholder="Note title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full rounded-xl border border-white/10 bg-[#0c0b14] p-3 text-sm outline-none focus:border-violet-500"
            required
          />

          <textarea
            placeholder="Write your note..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={5}
            className="w-full resize-none rounded-xl border border-white/10 bg-[#0c0b14] p-3 text-sm outline-none focus:border-violet-500"
            required
          />

          <input
            type="text"
            placeholder="Subject"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            className="w-full rounded-xl border border-white/10 bg-[#0c0b14] p-3 text-sm outline-none focus:border-violet-500"
          />

          <input
            type="text"
            placeholder="Category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full rounded-xl border border-white/10 bg-[#0c0b14] p-3 text-sm outline-none focus:border-violet-500"
          />

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-white/10 px-4 py-2 text-sm text-gray-300 hover:bg-white/5"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="rounded-xl bg-violet-600 px-5 py-2 text-sm font-medium hover:bg-violet-500"
            >
              Create Note
            </button>
          </div>

        </form>
      </div>
    </div>
  )
}

export default AddNoteModal
