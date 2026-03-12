const REASONS = [
  {
    icon: '💰',
    title: 'Op til 30% billigere',
    description: 'Danske forhandlere tager ofte 20–30% mere for det samme Bosch Professional-produkt. Vi viser dig Amazon.de-prisen.',
  },
  {
    icon: '🛡️',
    title: 'Samme garanti',
    description: 'Bosch Professional leveres med minimum 3 års garanti uanset om du køber i Danmark eller via Amazon.de.',
  },
  {
    icon: '⚡',
    title: 'Hurtig levering',
    description: 'Amazon Prime leverer de fleste varer 1–2 hverdage — direkte til adressen du angiver ved checkout.',
  },
  {
    icon: '🔧',
    title: 'Kun Bosch Professional',
    description: 'Vi fokuserer udelukkende på Bosch Professional-serien — det blå mærke til fagfolk. Ingen forvirring med Bosch hvidevarer.',
  },
  {
    icon: '📋',
    title: 'Bosch PRO360',
    description: 'Alle produkter kan registreres i Bosch PRO360 for ekstra garantifordele — uanset om de er købt via Amazon.',
  },
  {
    icon: '🇩🇰',
    title: 'Dansk support',
    description: 'Har du spørgsmål? Vi hjælper på dansk. Amazon.de har desuden dansk kundeservice for returneringer.',
  },
]

export default function WhyNetpro() {
  return (
    <section className="py-14 bg-[#F5F5F5]">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-10">
          <h2 className="text-2xl font-bold text-[#1A1A1A] mb-2">Hvorfor handle via NETPRO?</h2>
          <p className="text-[#6B6B6B]">Vi gør det nemt at finde det rigtige Bosch Professional-produkt til den bedste pris</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {REASONS.map((r) => (
            <div
              key={r.title}
              className="bg-white rounded-xl p-6 border border-[#E0E0E0] hover:border-[#1C3A6E] hover:shadow-md transition-all"
            >
              <div className="text-3xl mb-3">{r.icon}</div>
              <h3 className="font-bold text-[#1C3A6E] mb-2">{r.title}</h3>
              <p className="text-sm text-[#6B6B6B] leading-relaxed">{r.description}</p>
            </div>
          ))}
        </div>

        {/* Bosch Professional badge */}
        <div className="mt-10 bg-[#1C3A6E] rounded-2xl p-8 text-white text-center">
          <div className="text-4xl mb-3">🔵</div>
          <h3 className="text-xl font-bold mb-2">Bosch Professional — det blå mærke til fagfolk</h3>
          <p className="text-blue-200 text-sm max-w-2xl mx-auto leading-relaxed">
            Bosch Professional er designet og testet til professionel brug — hårdere, hurtigere og mere holdbar end
            consumer-serien. Brugt af tømrere, elektrikere, VVS'ere og andre fagfolk verden over.
          </p>
        </div>
      </div>
    </section>
  )
}
