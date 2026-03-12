const STEPS = [
  {
    number: '1',
    icon: '🔍',
    title: 'Find dit værktøj',
    description: 'Gennemse vores udvalg af Bosch Professional-produkter sorteret i kategorier. Sammenlign priser og spec.',
  },
  {
    number: '2',
    icon: '🛒',
    title: 'Klik "Køb på Amazon"',
    description: 'Du viderestilles direkte til Amazon.de — verdens mest betroede webshop. Ingen konto hos os nødvendig.',
  },
  {
    number: '3',
    icon: '📦',
    title: 'Modtag din ordre',
    description: 'Amazon leverer 1–2 hverdage til din dør. Alle Bosch Professional-produkter inkluderer minimum 3 års garanti.',
  },
]

export default function HowItWorks() {
  return (
    <section className="py-14 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-10">
          <h2 className="text-2xl font-bold text-[#1A1A1A] mb-2">Sådan virker det</h2>
          <p className="text-[#6B6B6B]">Tre enkle trin — ingen registrering, ingen skjulte gebyrer</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative">
          {/* Forbindelseslinje — kun desktop */}
          <div className="hidden md:block absolute top-10 left-1/3 right-1/3 h-0.5 bg-gradient-to-r from-[#1C3A6E]/20 via-[#1C3A6E]/40 to-[#1C3A6E]/20" />

          {STEPS.map((step) => (
            <div key={step.number} className="relative flex flex-col items-center text-center p-6">
              {/* Trin-nummer */}
              <div className="w-14 h-14 rounded-full bg-[#1C3A6E] text-white flex items-center justify-center text-2xl font-bold mb-4 shadow-lg relative z-10">
                {step.number}
              </div>
              <div className="text-3xl mb-3">{step.icon}</div>
              <h3 className="font-bold text-[#1A1A1A] mb-2">{step.title}</h3>
              <p className="text-sm text-[#6B6B6B] leading-relaxed">{step.description}</p>
            </div>
          ))}
        </div>

        {/* Affiliate-transparens boks */}
        <div className="mt-10 bg-[#F5F9FF] border border-[#D0DFF5] rounded-2xl p-6 flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <div className="text-3xl flex-shrink-0">💡</div>
          <div>
            <div className="font-semibold text-[#1C3A6E] mb-1">Gratis og uforpligtende</div>
            <p className="text-sm text-[#4B5563] leading-relaxed">
              NETPRO er et gratis prissammenligningssite for Bosch Professional-produkter. Vi tjener en lille kommission
              fra Amazon.de når du køber via vores links — det koster dig ingenting ekstra. Prisen er altid den samme
              som hvis du selv gik direkte til Amazon.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
