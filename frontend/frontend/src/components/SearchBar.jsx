import { Search } from 'lucide-react'

function SearchBar({ search, setSearch }) {
  return (
    <div className="mb-8 flex items-center gap-3 rounded-xl border border-white/10 bg-[#11101c] px-4 py-3">
      <Search size={20} className="text-gray-500" />

      <input
        type="text"
        placeholder="Search your notes..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full bg-transparent text-sm text-white outline-none placeholder:text-gray-500"
      />
    </div>
  )
}

export default SearchBar