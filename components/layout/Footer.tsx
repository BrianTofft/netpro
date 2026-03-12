import Link from 'next/link'
import Image from 'next/image'
import { CATEGORIES } from '@/lib/categories'

export default function Footer() {
  return (
    <footer className="bg-[#1C3A6E] text-blue-200 mt-16">
      <div className="max-w-7xl mx-auto px-4 py-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {/* Brand */}
        <div>
          <div className="mb-4 inline-block bg-white rounded-lg px-3 py-2">
            <Image
              src="/logo.png"
              alt="Netpro"
              height={36}
              width={150}
              className="object-contain"
            />
          </div>
          <p className="text-sm leading-relaxed mb-4">
            Professionelt Bosch-værktøj til danske fagfolk. Konkurrencedygtige priser via Amazon.de med dansk support.
          </p>
          <div className="text-sm space-y-1">
            <div>📍 Industrivej 21, 4000 Roskilde</div>
            <div>📞 <a href="tel:+4552400088" className="hover:text-white transition-colors">+45 52 40 00 88</a></div>
            <div>✉️ <a href="mailto:info@netpro.dk" className="hover:text-white transition-colors">info@netpro.dk</a></div>
          </div>
        </div>

        {/* Kategorier */}
        <div>
          <h3 className="text-white font-semibold mb-4">Kategorier</h3>
          <ul className="space-y-2 text-sm">
            {CATEGORIES.slice(0, 7).map((cat) => (
              <li key={cat.slug}>
                <Link href={`/${cat.slug}`} className="hover:text-white transition-colors">
                  {cat.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Info */}
        <div>
          <h3 className="text-white font-semibold mb-4">Information</h3>
          <ul className="space-y-2 text-sm">
            <li><Link href="/nyheder" className="hover:text-white transition-colors">Nyheder</Link></li>
            <li><Link href="/tilbud" className="hover:text-white transition-colors">Tilbud</Link></li>
            <li><Link href="/om-os" className="hover:text-white transition-colors">Om os</Link></li>
            <li><Link href="/kontakt" className="hover:text-white transition-colors">Kontakt</Link></li>
            <li><Link href="/fragt-levering" className="hover:text-white transition-colors">Fragt & levering</Link></li>
            <li><Link href="/garanti" className="hover:text-white transition-colors">Garanti</Link></li>
            <li><Link href="/returret" className="hover:text-white transition-colors">Returret</Link></li>
          </ul>
        </div>

        {/* Amazon info */}
        <div>
          <h3 className="text-white font-semibold mb-4">Fordele</h3>
          <ul className="space-y-3 text-sm">
            <li className="flex items-start gap-2">
              <span className="text-[#E3000B] mt-0.5">✓</span>
              <span>Minimum 3 års garanti på alt Bosch Professional</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-[#E3000B] mt-0.5">✓</span>
              <span>Gratis fragt 1–2 hverdage</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-[#E3000B] mt-0.5">✓</span>
              <span>Priser under danske forhandlere</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-[#E3000B] mt-0.5">✓</span>
              <span>Bosch PRO360 registrering inkluderet</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-[#E3000B] mt-0.5">✓</span>
              <span>Leveret via Amazon.de</span>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-white/10 py-4 px-4 max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-blue-300">
        <span>© {new Date().getFullYear()} NETPRO. Alle rettigheder forbeholdes.</span>
        <div className="flex gap-4">
          <Link href="/privatlivspolitik" className="hover:text-white transition-colors">Privatlivspolitik</Link>
          <Link href="/handelsbetingelser" className="hover:text-white transition-colors">Handelsbetingelser</Link>
          <Link href="/cookies" className="hover:text-white transition-colors">Cookies</Link>
        </div>
      </div>
    </footer>
  )
}
