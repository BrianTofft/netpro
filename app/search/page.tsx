import type { Metadata } from 'next'
import Link from 'next/link'
import { searchProducts } from '@/lib/products'
import ProductGrid from '@/components/product/ProductGrid'

interface Props {
  searchParams: Promise<{ q?: string }>
}

export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  const { q } = await searchParams
  return {
    title: q ? `Søg: "${q}"` : 'Søg produkter',
  }
}

export default async function SearchPage({ searchParams }: Props) {
  const { q } = await searchParams
  const query = q?.trim() ?? ''
  const products = query.length >= 2 ? await searchProducts(query) : []

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <nav className="text-sm text-[#6B6B6B] mb-6 flex items-center gap-2">
        <Link href="/" className="hover:text-[#003DA5]">Forside</Link>
        <span>/</span>
        <span className="text-[#1A1A1A] font-medium">Søgning</span>
      </nav>

      {/* Search form */}
      <form method="get" action="/search" className="mb-8">
        <div className="flex gap-3 max-w-xl">
          <input
            type="search"
            name="q"
            defaultValue={query}
            placeholder="Søg efter produkt, model eller brand..."
            className="flex-1 border border-[#E0E0E0] rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-[#003DA5] focus:ring-2 focus:ring-[#003DA5]/20"
            autoFocus
          />
          <button
            type="submit"
            className="bg-[#003DA5] hover:bg-[#002880] text-white px-6 py-3 rounded-lg font-medium text-sm transition-colors"
          >
            Søg
          </button>
        </div>
      </form>

      {query.length >= 2 ? (
        <>
          <h1 className="text-2xl font-bold mb-2">Søgeresultater for &ldquo;{query}&rdquo;</h1>
          <p className="text-[#6B6B6B] mb-6">
            {products.length} {products.length === 1 ? 'resultat' : 'resultater'}
          </p>
          <ProductGrid products={products} emptyMessage={`Ingen produkter fundet for "${query}".`} />
        </>
      ) : (
        <div className="text-center py-16">
          <div className="text-5xl mb-4">🔍</div>
          <h1 className="text-xl font-semibold mb-2">Søg i vores sortiment</h1>
          <p className="text-[#6B6B6B]">Skriv mindst 2 tegn for at søge</p>
        </div>
      )}
    </div>
  )
}
