import Link from 'next/link'
import { CATEGORIES } from '@/lib/categories'

export default function Hero() {
  return (
    <section className="text-white overflow-hidden relative">
      {/* Baggrundsbillede */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: "url('/hero-bg.jpg')" }}
      />
      {/* Mørkt overlay */}
      <div className="absolute inset-0 bg-[#0d1f3c]/75" />

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

          {/* Højre — kategori-grid (alle 11) */}
          <div className="hidden lg:grid grid-cols-3 gap-3">
            {CATEGORIES.map((cat) => (
              <Link
                key={cat.slug}
                href={`/${cat.slug}`}
                className="bg-black/40 hover:bg-black/55 backdrop-blur-sm border border-white/20 hover:border-white/40 rounded-xl p-4 flex flex-col items-center gap-2 text-center transition-all group"
              >
                <span className="text-3xl">{cat.icon}</span>
                <span className="text-xs font-medium text-white/80 group-hover:text-white leading-tight">
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
