
function StatsCard({ label, value, icon: Icon, color, bg }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-[#151421] p-5">
      <div className="mb-5 flex items-center justify-between">
        <p className="text-sm text-gray-400">{label}</p>

        <div className={`rounded-xl p-2.5 ${bg} ${color}`}>
          <Icon size={20} />
        </div>
      </div>

      <h3 className="text-3xl font-bold">{value}</h3>
    </div>
  )
}

export default StatsCard
