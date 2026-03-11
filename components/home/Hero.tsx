import Link from 'next/link'

export default function Hero() {
  return (
    <section className="bg-gradient-to-br from-[#1C3A6E] via-[#2A4E8C] to-[#132D5E] text-white overflow-hidden relative">
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#E3000B] rounded-full blur-3xl transform translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-white rounded-full blur-3xl transform -translate-x-1/2 translate-y-1/2" />
      </div>

      <div className="max-w-7xl mx-auto px-4 py-20 relative">
        <div className="max-w-2xl">
          <div className="inline-flex items-center gap-2 bg-white/10 rounded-full px-4 py-1.5 text-sm mb-6">
            <span className="w-2 h-2 bg-[#E3000B] rounded-full animate-pulse" />
            Bosch Professional — Officiel forhandler
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight mb-6">
            Professionelt
            <span className="text-[#E3000B] block">Bosch-værktøj</span>
            til fagfolk
          </h1>

          <p className="text-lg text-blue-200 mb-8 leading-relaxed">
            Handl Bosch Professional til priser under danske forhandlere. Gratis fragt, minimum 3 års garanti og lynhurtig levering fra Amazon.de.
          </p>

          <div className="flex flex-wrap gap-4 mb-10">
            <Link
              href="/bore-skruemaskiner"
              className="bg-[#E3000B] hover:bg-[#C5000A] text-[#1A1A1A] font-bold px-6 py-3 rounded-lg transition-colors"
            >
              Se alle produkter
            </Link>
            <Link
              href="/tilbud"
              className="bg-white/10 hover:bg-white/20 text-white font-semibold px-6 py-3 rounded-lg transition-colors border border-white/20"
            >
              Aktuelle tilbud
            </Link>
          </div>

          {/* Stats */}
          <div className="flex flex-wrap gap-8 text-sm">
            <div>
              <div className="font-bold text-2xl text-[#E3000B]">3+</div>
              <div className="text-blue-200">Års garanti</div>
            </div>
            <div>
              <div className="font-bold text-2xl text-[#E3000B]">1-2</div>
              <div className="text-blue-200">Dages levering</div>
            </div>
            <div>
              <div className="font-bold text-2xl text-[#E3000B]">500+</div>
              <div className="text-blue-200">Produkter</div>
            </div>
            <div>
              <div className="font-bold text-2xl text-[#E3000B]">4.8★</div>
              <div className="text-blue-200">Kundeanmeldelser</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
