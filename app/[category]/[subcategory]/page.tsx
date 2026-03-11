import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import Link from 'next/link'
import { getCategoryBySlug, getSubCategoryBySlug } from '@/lib/categories'
import { getProductsByCategory, getCategoryIdBySlug } from '@/lib/products'
import ProductGrid from '@/components/product/ProductGrid'

interface Props {
  params: Promise<{ category: string; subcategory: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { category, subcategory } = await params
  const sub = getSubCategoryBySlug(category, subcategory)
  if (!sub) return {}
  return {
    title: sub.name,
    description: `Køb ${sub.name} fra Bosch Professional hos NETPRO. Gratis fragt og min. 3 års garanti.`,
  }
}

export default async function SubCategoryPage({ params }: Props) {
  const { category: catSlug, subcategory: subSlug } = await params
  const cat = getCategoryBySlug(catSlug)
  const sub = getSubCategoryBySlug(catSlug, subSlug)
  if (!cat || !sub) notFound()

  const categoryId = await getCategoryIdBySlug(subSlug)
  const products = categoryId ? await getProductsByCategory(categoryId) : []

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <nav className="text-sm text-[#6B6B6B] mb-6 flex items-center gap-2">
        <Link href="/" className="hover:text-[#003DA5]">Forside</Link>
        <span>/</span>
        <Link href={`/${catSlug}`} className="hover:text-[#003DA5]">{cat.name}</Link>
        <span>/</span>
        <span className="text-[#1A1A1A] font-medium">{sub.name}</span>
      </nav>

      <h1 className="text-3xl font-bold text-[#1A1A1A] mb-2">{sub.name}</h1>
      <p className="text-[#6B6B6B] mb-6">
        {products.length} {products.length === 1 ? 'produkt' : 'produkter'}
      </p>

      <ProductGrid
        products={products}
        emptyMessage={`Ingen produkter i ${sub.name} endnu.`}
      />
    </div>
  )
}
