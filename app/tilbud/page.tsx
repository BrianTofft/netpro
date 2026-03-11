import type { Metadata } from 'next'
import { getSaleProducts } from '@/lib/products'
import ProductGrid from '@/components/product/ProductGrid'

export const metadata: Metadata = {
  title: 'Tilbud',
  description: 'Aktuelle tilbud på Bosch Professional værktøj hos NETPRO.',
}

export const revalidate = 3600

export default async function TilbudPage() {
  const products = await getSaleProducts()

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="bg-gradient-to-r from-[#003DA5] to-[#0048C8] text-white rounded-2xl p-8 mb-8">
        <h1 className="text-3xl font-bold mb-2">Aktuelle tilbud</h1>
        <p className="text-blue-200">Spar på professionelt Bosch-udstyr — begrænset tid</p>
      </div>
      <ProductGrid products={products} emptyMessage="Ingen aktuelle tilbud. Tjek snart igen." />
    </div>
  )
}
