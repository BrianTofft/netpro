import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import Link from 'next/link'
import { getCategoryBySlug } from '@/lib/categories'
import { getProductsByCategory, getCategoryIdBySlug } from '@/lib/products'
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

  const categoryId = await getCategoryIdBySlug(slug)
  const products = categoryId ? await getProductsByCategory(categoryId) : []

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <nav className="text-sm text-[#6B6B6B] mb-6 flex items-center gap-2">
        <Link href="/" className="hover:text-[#003DA5]">Forside</Link>
        <span>/</span>
        <span className="text-[#1A1A1A] font-medium">{cat.name}</span>
      </nav>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Subcategory sidebar */}
        {cat.subs && cat.subs.length > 0 && (
          <aside className="lg:w-56 shrink-0">
            <div className="bg-white border border-[#E0E0E0] rounded-xl overflow-hidden">
              <div className="bg-[#003DA5] text-white font-semibold px-4 py-3 text-sm">
                Underkategorier
              </div>
              <div className="divide-y divide-[#E0E0E0]">
                {cat.subs.map((sub) => (
                  <Link
                    key={sub.slug}
                    href={`/${cat.slug}/${sub.slug}`}
                    className="block px-4 py-2.5 text-sm hover:bg-[#E8F0FE] hover:text-[#003DA5] transition-colors"
                  >
                    {sub.name}
                  </Link>
                ))}
              </div>
            </div>
          </aside>
        )}

        {/* Main content */}
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
