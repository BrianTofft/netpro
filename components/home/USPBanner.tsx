const USPS = [
  { icon: '🚚', label: 'Gratis fragt', sub: '1–2 hverdage' },
  { icon: '🛡️', label: 'Min. 3 års garanti', sub: 'Bosch Professional' },
  { icon: '💰', label: 'Bedste priser', sub: 'Under danske forhandlere' },
  { icon: '📦', label: 'Fra Amazon.de', sub: 'Tryg handel' },
]

export default function USPBanner() {
  return (
    <div className="border-b border-[#E0E0E0] bg-white">
      <div className="max-w-7xl mx-auto px-4 py-4 grid grid-cols-2 lg:grid-cols-4 gap-4">
        {USPS.map((usp) => (
          <div key={usp.label} className="flex items-center gap-3">
            <span className="text-2xl">{usp.icon}</span>
            <div>
              <div className="font-semibold text-sm text-[#1A1A1A]">{usp.label}</div>
              <div className="text-xs text-[#6B6B6B]">{usp.sub}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
