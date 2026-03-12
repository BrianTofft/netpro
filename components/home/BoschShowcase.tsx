import Image from 'next/image'
import Link from 'next/link'

// Erstat src-stier med egne billeder fra Bosch Professional Media Portal:
// https://mediaportal.bosch-professional.com/
// Læg billederne i /public/images/ og opdater src nedenfor

const PANELS = [
  {
    src: '/images/bosch-bore-skrue.jpg',
    alt: 'Fagmand bruger Bosch Professional boremaskine',
    label: 'Bore- & skruemaskiner',
    href: '/bore-skruemaskiner',
    gradient: 'from-[#1C3A6E] to-[#0a1f3e]',
  },
  {
    src: '/images/bosch-save.jpg',
    alt: 'Bosch Professional sav i brug',
    label: 'Saveteknik',
    href: '/savevaerktoj',
    gradient: 'from-[#2d1a0a] to-[#1a0a00]',
  },
  {
    src: '/images/bosch-maaling.jpg',
    alt: 'Bosch Professional måleværktøj',
    label: 'Måleværktøj',
    href: '/maalevaerktoj',
    gradient: 'from-[#1a2d1a] to-[#0a1a0a]',
  },
]

export default function BoschShowcase() {
  return (
    <section className="py-14 bg-[#1A1A1A]">
      <div className="max-w-7xl mx-auto px-4">

        {/* Overskrift */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 bg-white/10 rounded-full px-4 py-1.5 text-sm text-white/70 mb-4">
            <span className="w-2 h-2 bg-[#E3000B] rounded-full" />
            Bosch Professional Partner
          </div>
          <h2 className="text-3xl font-bold text-white mb-3">
            Professionelt værktøj til enhver opgave
          </h2>
          <p className="text-white/60 max-w-xl mx-auto text-sm leading-relaxed">
            Det blå mærke. Bygget til fagfolk der kræver mere — mere kraft, mere præcision og mere holdbarhed end consumer-serien.
          </p>
        </div>

        {/* Billed-panels */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
          {PANELS.map((panel) => (
            <Link
              key={panel.href}
              href={panel.href}
              className="group relative overflow-hidden rounded-2xl aspect-[4/3] block"
            >
              {/* Forsøg at vise billede — fallback til gradient hvis det ikke findes */}
              <div className={`absolute inset-0 bg-gradient-to-br ${panel.gradient}`} />
              <Image
                src={panel.src}
                alt={panel.alt}
                fill
                className="object-cover opacity-80 group-hover:opacity-90 group-hover:scale-105 transition-all duration-500"
                onError={() => {}} // Ignorér fejl — gradient vises i stedet
              />
              {/* Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
              {/* Label */}
              <div className="absolute bottom-0 left-0 right-0 p-5">
                <span className="text-white font-bold text-lg">{panel.label}</span>
                <div className="mt-1 text-white/70 text-xs flex items-center gap-1">
                  Se produkter
                  <svg className="w-3 h-3 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
              {/* Rød accent-stripe øverst */}
              <div className="absolute top-0 left-0 right-0 h-1 bg-[#E3000B] opacity-0 group-hover:opacity-100 transition-opacity" />
            </Link>
          ))}
        </div>

        {/* Bundlinje — Bosch partner badge */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6 border-t border-white/10 pt-8">
          <div className="flex items-center gap-4">
            <div className="bg-white rounded-xl px-4 py-2">
              <Image
                src="/logo.png"
                alt="Netpro — Bosch Professional Partner"
                width={120}
                height={30}
                className="object-contain"
              />
            </div>
            <div className="text-white/60 text-sm">
              Officiel Bosch Professional Partner
            </div>
          </div>
          <div className="flex gap-6 text-sm text-white/50">
            <span>✓ Min. 3 års garanti</span>
            <span>✓ Gratis fragt 1–2 dage</span>
            <span>✓ Amazon.de sikkerhed</span>
          </div>
        </div>

      </div>
    </section>
  )
}
