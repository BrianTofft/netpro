import Link from 'next/link'
import type { Product } from '@/lib/database.types'
import ProductCard from '@/components/product/ProductCard'

interface Props {
  products: Product[]
  title: string
  subtitle?: string
  viewAllHref?: string
}

export default function FeaturedProducts({ products, title, subtitle, viewAllHref }: Props) {
  if (products.length === 0) return null

  return (
    <section className="max-w-7xl mx-auto px-4 py-10">
      <div className="flex items-end justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-[#1A1A1A]">{title}</h2>
          {subtitle && <p className="text-[#6B6B6B] mt-1">{subtitle}</p>}
        </div>
        {viewAllHref && (
          <Link
            href={viewAllHref}
            className="text-[#003DA5] hover:text-[#002880] text-sm font-medium flex items-center gap-1"
          >
            Se alle
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        )}
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {products.slice(0, 8).map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  )
}
