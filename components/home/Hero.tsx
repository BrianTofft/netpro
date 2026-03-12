import Link from 'next/link'
import { CATEGORIES } from '@/lib/categories'

export default function Hero() {
  return (
    <section className="bg-gradient-to-br from-[#1C3A6E] via-[#2A4E8C] to-[#132D5E] text-white overflow-hidden relative">
      {/* Baggrundsgløde */}
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#E3000B] rounded-full blur-3xl transform translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-white rounded-full blur-3xl transform -translate-x-1/2 translate-y-1/2" />
      </div>

      <div className="max-w-7xl mx-auto px-4 py-16 relative">
        <div className="grid lg:grid-cols-2 gap-12 items-center">

          {/* Venstre — tekst */}
          <div>
            <div className="inline-flex items-center gap-2 bg-white/10 rounded-full px-4 py-1.5 text-sm mb-6">
              <span className="w-2 h-2 bg-[#E3000B] rounded-full animate-pulse" />
              Danmarks bedste priser på Bosch Professional
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-5xl font-bold leading-tight mb-5">
              Professionelt<br />
              <span className="text-[#E3000B]">Bosch-værktøj</span><br />
              til fagfolk
            </h1>

            <p className="text-lg text-blue-100 mb-4 leading-relaxed">
              Vi samler de bedste Bosch Professional-priser fra Amazon.de — altid under danske forhandlere. Du handler direkte hos Amazon og får den samme garanti og sikkerhed.
            </p>

            <p className="text-sm text-blue-200 mb-8">
              ✓ Gratis at bruge &nbsp;·&nbsp; ✓ Ingen konto nødvendig &nbsp;·&nbsp; ✓ Min. 3 års Bosch-garanti
            </p>

            <div className="flex flex-wrap gap-4 mb-10">
              <Link
                href="/bore-skruemaskiner"
                className="bg-[#E3000B] hover:bg-[#C5000A] text-white font-bold px-6 py-3 rounded-lg transition-colors"
              >
                Se alle produkter
              </Link>
              <Link
                href="/tilbud"
                className="bg-white/10 hover:bg-white/20 text-white font-semibold px-6 py-3 rounded-lg transition-colors border border-white/20"
              >
                Aktuelle tilbud →
              </Link>
            </div>

            {/* Stats */}
            <div className="flex flex-wrap gap-8 text-sm">
              {[
                { val: '3+ år', label: 'Bosch garanti' },
                { val: '1–2', label: 'Dages levering' },
                { val: 'Spar op til', label: '30% vs. DK-priser' },
                { val: '100%', label: 'Gratis service' },
              ].map((s) => (
                <div key={s.label}>
                  <div className="font-bold text-xl text-[#FFB300]">{s.val}</div>
                  <div className="text-blue-200 text-xs">{s.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Højre — kategori-grid */}
          <div className="hidden lg:grid grid-cols-3 gap-3">
            {CATEGORIES.slice(0, 9).map((cat) => (
              <Link
                key={cat.slug}
                href={`/${cat.slug}`}
                className="bg-white/10 hover:bg-white/20 border border-white/10 hover:border-white/30 rounded-xl p-4 flex flex-col items-center gap-2 text-center transition-all group"
              >
                <span className="text-3xl">{cat.icon}</span>
                <span className="text-xs font-medium text-blue-100 group-hover:text-white leading-tight">
                  {cat.name}
                </span>
              </Link>
            ))}
          </div>

        </div>
      </div>
    </section>
  )
}
