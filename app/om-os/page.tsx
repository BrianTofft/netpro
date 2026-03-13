import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'

export const metadata: Metadata = {
  title: 'Om os — NETPRO',
  description: 'Lær mere om NETPRO — dit danske prisammenligningssite for Bosch Professional værktøj via Amazon.de.',
}

export default function OmOsPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12">

      {/* Breadcrumb */}
      <nav className="text-sm text-[#6B6B6B] mb-8 flex items-center gap-2">
        <Link href="/" className="hover:text-[#1C3A6E]">Forside</Link>
        <span>/</span>
        <span className="text-[#1A1A1A] font-medium">Om os</span>
      </nav>

      {/* Hero */}
      <div className="bg-[#1C3A6E] rounded-2xl p-8 md:p-12 mb-10 text-white">
        <div className="mb-6">
          <div className="inline-block bg-white rounded-xl px-4 py-2 mb-6">
            <Image
              src="/logo.png"
              alt="Netpro"
              width={140}
              height={36}
              className="object-contain"
            />
          </div>
        </div>
        <h1 className="text-3xl md:text-4xl font-bold mb-4">
          Professionelt Bosch-værktøj til danske fagfolk
        </h1>
        <p className="text-blue-200 text-lg leading-relaxed max-w-2xl">
          NETPRO er et dansk prisammenligningssite for Bosch Professional-produkter.
          Vi hjælper fagfolk med at finde det rigtige professionelle værktøj til de bedste priser — leveret direkte fra Amazon.de.
        </p>
      </div>

      {/* Main content */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
        <div className="bg-white border border-[#E0E0E0] rounded-2xl p-6">
          <div className="text-3xl mb-3">🎯</div>
          <h2 className="text-xl font-bold text-[#1A1A1A] mb-3">Hvad er NETPRO?</h2>
          <p className="text-[#4B5563] leading-relaxed text-sm">
            NETPRO er et gratis prissammenlignings- og produktoversigtssite dedikeret til Bosch Professional-serien.
            Vi er Amazon Netpartner (Amazon Affiliate) og tjener en lille kommission, når du køber via vores links —
            det koster dig absolut ingenting ekstra. Prisen er den samme som ved direkte køb på Amazon.de.
          </p>
        </div>

        <div className="bg-white border border-[#E0E0E0] rounded-2xl p-6">
          <div className="text-3xl mb-3">🔵</div>
          <h2 className="text-xl font-bold text-[#1A1A1A] mb-3">Bosch Professional — det blå mærke</h2>
          <p className="text-[#4B5563] leading-relaxed text-sm">
            Bosch Professional (det blå mærke) er fremstillet til fagfolk der kræver mere — mere kraft, mere præcision og mere holdbarhed.
            Produkterne leveres med minimum 3 års garanti og er bygget til daglig professionel brug.
          </p>
        </div>

        <div className="bg-white border border-[#E0E0E0] rounded-2xl p-6">
          <div className="text-3xl mb-3">🛒</div>
          <h2 className="text-xl font-bold text-[#1A1A1A] mb-3">Sådan fungerer det</h2>
          <p className="text-[#4B5563] leading-relaxed text-sm">
            Du finder produktet hos NETPRO og klikker "Køb på Amazon". Du viderestilles direkte til Amazon.de —
            verdens mest betroede webshop. Ingen konto hos os, ingen skjulte gebyrer.
            Amazon håndterer betaling, levering og eventuel retur.
          </p>
        </div>

        <div className="bg-white border border-[#E0E0E0] rounded-2xl p-6">
          <div className="text-3xl mb-3">🚚</div>
          <h2 className="text-xl font-bold text-[#1A1A1A] mb-3">Hurtig levering</h2>
          <p className="text-[#4B5563] leading-relaxed text-sm">
            Amazon.de leverer til din dør i Danmark på 1–2 hverdage. Gratis fragt på de fleste ordrer.
            Alle Bosch Professional-produkter inkluderer minimum 3 års garanti, og du handles med
            Amazons fulde køber­beskyttelse.
          </p>
        </div>
      </div>

      {/* USPs */}
      <div className="bg-[#F5F9FF] border border-[#D0DFF5] rounded-2xl p-6 md:p-8 mb-10">
        <h2 className="text-xl font-bold text-[#1C3A6E] mb-5">Hvorfor vælge NETPRO?</h2>
        <ul className="space-y-3">
          {[
            'Minimum 3 års garanti på alt Bosch Professional',
            'Gratis fragt — levering 1–2 hverdage',
            'Priser under typiske danske forhandlere',
            'Handel via Amazon.de — verdens mest betroede webshop',
            'Amazon Netpartner — certificeret affiliate',
            'Ingen konto eller registrering nødvendig',
          ].map((point) => (
            <li key={point} className="flex items-start gap-3 text-sm text-[#1A1A1A]">
              <span className="text-[#E3000B] font-bold mt-0.5">✓</span>
              <span>{point}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Contact */}
      <div className="bg-white border border-[#E0E0E0] rounded-2xl p-6 md:p-8 mb-10">
        <h2 className="text-xl font-bold text-[#1A1A1A] mb-5">Kontakt</h2>
        <div className="space-y-3 text-sm text-[#4B5563]">
          <div className="flex items-center gap-3">
            <span className="text-xl">📍</span>
            <span>Industrivej 21, 4000 Roskilde</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-xl">📞</span>
            <a href="tel:+4552400088" className="text-[#1C3A6E] hover:underline font-medium">
              +45 52 40 00 88
            </a>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-xl">✉️</span>
            <a href="mailto:info@netpro.dk" className="text-[#1C3A6E] hover:underline font-medium">
              info@netpro.dk
            </a>
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="text-center">
        <Link
          href="/"
          className="inline-flex items-center gap-2 bg-[#1C3A6E] text-white px-8 py-3 rounded-xl font-semibold hover:bg-[#15305d] transition-colors"
        >
          Se vores produkter
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </Link>
      </div>

    </div>
  )
}
