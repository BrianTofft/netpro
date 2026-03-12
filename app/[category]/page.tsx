import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import Link from 'next/link'
import { getCategoryBySlug } from '@/lib/categories'
import {
  getProductsByCategory,
  getProductsByCategories,
  getCategoryIdBySlug,
  getCategoryIdsBySlugs,
  getProductCountsByCategories,
} from '@/lib/products'
import ProductGrid from '@/components/product/ProductGrid'

interface Props {
  params: Promise<{ category: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { category: slug } = await params
  const cat = getCategoryBySlug(slug)
  if (!cat) return {}
  return {
    title: cat.name,
    description: `Køb ${cat.name} fra Bosch Professional hos NETPRO. Gratis fragt og min. 3 års garanti.`,
  }
}

export default async function CategoryPage({ params }: Props) {
  const { category: slug } = await params
  const cat = getCategoryBySlug(slug)
  if (!cat) notFound()

  const subSlugs = cat.subs?.map((s) => s.slug) ?? []

  // Hent IDs for denne kategori og alle underkategorier parallelt
  const [categoryId, subSlugToId] = await Promise.all([
    getCategoryIdBySlug(slug),
    getCategoryIdsBySlugs(subSlugs),
  ])

  const subIds = Object.values(subSlugToId)

  // Hent produkttæller for underkategorier
  const subCounts = subIds.length > 0
    ? await getProductCountsByCategories(subIds)
    : {}

  // Vis produkter fra denne kategori + alle underkategorier
  const allCategoryIds = [
    ...(categoryId ? [categoryId] : []),
    ...subIds,
  ]
  const products = allCategoryIds.length > 0
    ? await getProductsByCategories(allCategoryIds)
    : []

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <nav className="text-sm text-[#6B6B6B] mb-6 flex items-center gap-2">
        <Link href="/" className="hover:text-[#1C3A6E]">Forside</Link>
        <span>/</span>
        <span className="text-[#1A1A1A] font-medium">{cat.name}</span>
      </nav>

      <div className="flex flex-col lg:flex-row gap-8">

        {/* Underkategori-sidebar med produkttæller */}
        {cat.subs && cat.subs.length > 0 && (
          <aside className="lg:w-56 shrink-0">
            <div className="bg-white border border-[#E0E0E0] rounded-xl overflow-hidden">
              <div className="bg-[#1C3A6E] text-white font-semibold px-4 py-3 text-sm">
                Underkategorier
              </div>
              <div className="divide-y divide-[#E0E0E0]">
                {cat.subs.map((sub) => {
                  const subId = subSlugToId[sub.slug]
                  const count = subId ? (subCounts[subId] ?? 0) : 0
                  return (
                    <Link
                      key={sub.slug}
                      href={`/${cat.slug}/${sub.slug}`}
                      className="flex items-center justify-between px-4 py-2.5 text-sm hover:bg-[#EEF2FA] hover:text-[#1C3A6E] transition-colors"
                    >
                      <span>{sub.name}</span>
                      {count > 0 && (
                        <span className="bg-[#1C3A6E] text-white text-xs font-bold px-2 py-0.5 rounded-full min-w-[22px] text-center">
                          {count}
                        </span>
                      )}
                    </Link>
                  )
                })}
              </div>
            </div>
          </aside>
        )}

        {/* Produkter */}
        <div className="flex-1">
          <h1 className="text-3xl font-bold text-[#1A1A1A] mb-2">
            {cat.icon} {cat.name}
          </h1>
          <p className="text-[#6B6B6B] mb-6">
            {products.length} {products.length === 1 ? 'produkt' : 'produkter'}
          </p>

          <ProductGrid
            products={products}
            emptyMessage={`Ingen produkter i ${cat.name} endnu. Vi opdaterer løbende sortimentet.`}
          />
        </div>
      </div>
    </div>
  )
}
