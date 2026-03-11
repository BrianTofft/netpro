import Link from 'next/link'
import { CATEGORIES } from '@/lib/categories'

export default function CategoryGrid() {
  return (
    <section className="max-w-7xl mx-auto px-4 py-12">
      <h2 className="text-2xl font-bold text-[#1A1A1A] mb-2">Produktkategorier</h2>
      <p className="text-[#6B6B6B] mb-6">Bosch Professional til alle fagområder</p>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-3">
        {CATEGORIES.map((cat) => (
          <Link
            key={cat.slug}
            href={`/${cat.slug}`}
            className="flex flex-col items-center gap-2 p-4 bg-white border border-[#E0E0E0] rounded-xl hover:border-[#1C3A6E] hover:bg-[#EEF2FA] transition-all group text-center"
          >
            <span className="text-3xl">{cat.icon}</span>
            <span className="text-xs font-medium text-[#1A1A1A] group-hover:text-[#1C3A6E] leading-tight">
              {cat.name}
            </span>
          </Link>
        ))}
      </div>
    </section>
  )
}
