const TESTIMONIALS = [
  {
    name: 'Thomas B.',
    company: 'TBM Tømrer',
    rating: 5,
    text: 'Bestilte en GSR 18V-55 og fik den næste dag. Prisen var 400 kr. under hvad jeg plejer at betale. Svært at slå!',
  },
  {
    name: 'Morten H.',
    company: 'MH El-teknik',
    rating: 5,
    text: 'Fantastisk service. Bosch Professional med min. 3 års garanti til den pris — det er lige sagen for en elektriker som mig.',
  },
  {
    name: 'Søren P.',
    company: 'Privat håndværker',
    rating: 5,
    text: 'Meget imponeret over leveringstiden og prisen. PRO360-registreringen var nem og giver ekstra tryghed.',
  },
  {
    name: 'Lars N.',
    company: 'VVS Nilsson',
    rating: 4,
    text: 'God hjemmeside, nemt at finde de rigtige produkter. Har købt 3 gange nu — aldrig en fejl.',
  },
]

export default function Testimonials() {
  return (
    <section className="bg-[#F5F5F5] py-12">
      <div className="max-w-7xl mx-auto px-4">
        <h2 className="text-2xl font-bold text-[#1A1A1A] mb-2 text-center">Hvad siger vores kunder?</h2>
        <p className="text-[#6B6B6B] text-center mb-8">Over 500 tilfredse fagfolk handler hos NETPRO</p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {TESTIMONIALS.map((t, i) => (
            <div key={i} className="bg-white rounded-xl p-5 border border-[#E0E0E0] shadow-sm">
              <div className="flex text-[#FFB300] text-sm mb-3">
                {'★'.repeat(t.rating)}{'☆'.repeat(5 - t.rating)}
              </div>
              <p className="text-sm text-[#2D2D2D] leading-relaxed mb-4 italic">"{t.text}"</p>
              <div>
                <div className="font-semibold text-sm text-[#1A1A1A]">{t.name}</div>
                <div className="text-xs text-[#6B6B6B]">{t.company}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
