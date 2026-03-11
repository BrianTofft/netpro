import type { Metadata } from 'next'
import { getNewProducts } from '@/lib/products'
import ProductGrid from '@/components/product/ProductGrid'

export const metadata: Metadata = {
  title: 'Nyheder',
  description: 'De nyeste Bosch Professional produkter hos NETPRO.',
}

export const revalidate = 3600

export default async function NyhederPage() {
  const products = await getNewProducts()

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-[#1A1A1A] mb-2">Nyheder</h1>
      <p className="text-[#6B6B6B] mb-8">De seneste tilkomne Bosch Professional produkter</p>
      <ProductGrid products={products} emptyMessage="Ingen nyheder endnu — tjek igen snart." />
    </div>
  )
}
