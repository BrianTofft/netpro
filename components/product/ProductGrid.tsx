import type { Product } from '@/lib/database.types'
import ProductCard from './ProductCard'

interface Props {
  products: Product[]
  emptyMessage?: string
}

export default function ProductGrid({ products, emptyMessage = 'Ingen produkter fundet.' }: Props) {
  if (products.length === 0) {
    return (
      <div className="text-center py-16 text-[#6B6B6B]">
        <div className="text-4xl mb-3">🔍</div>
        <p>{emptyMessage}</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  )
}
