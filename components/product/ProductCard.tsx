import Link from 'next/link'
import Image from 'next/image'
import type { Product } from '@/lib/database.types'
import { formatPrice, calcDiscount } from '@/lib/products'

interface Props {
  product: Product
}

export default function ProductCard({ product }: Props) {
  const discount = calcDiscount(product.price, product.original_price)

  return (
    <div className="bg-white rounded-xl border border-[#E0E0E0] hover:border-[#1C3A6E] hover:shadow-lg transition-all group flex flex-col">
      {/* Image */}
      <Link href={`/produkt/${product.asin}`} className="relative block aspect-square overflow-hidden rounded-t-xl bg-[#F5F5F5]">
        {product.image_url ? (
          <Image
            src={product.image_url}
            alt={product.title}
            fill
            className="object-contain p-4 group-hover:scale-105 transition-transform duration-300"
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-4xl text-gray-300">
            🔧
          </div>
        )}

        {/* Badges */}
        <div className="absolute top-2 left-2 flex flex-col gap-1">
          {discount && (
            <span className="bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded">
              -{discount}%
            </span>
          )}
          {product.is_new && (
            <span className="bg-[#2D8C4E] text-white text-xs font-bold px-2 py-0.5 rounded">
              NY
            </span>
          )}
        </div>
      </Link>

      {/* Content */}
      <div className="p-4 flex flex-col flex-1">
        {product.brand && (
          <div className="text-xs text-[#6B6B6B] uppercase tracking-wide mb-1">{product.brand}</div>
        )}
        <Link href={`/produkt/${product.asin}`} className="font-medium text-sm leading-snug hover:text-[#1C3A6E] transition-colors line-clamp-2 mb-2 flex-1">
          {product.title}
        </Link>

        {product.rating && (
          <div className="flex items-center gap-1 mb-2">
            <div className="flex text-[#E3000B] text-xs">
              {'★'.repeat(Math.round(product.rating))}
              {'☆'.repeat(5 - Math.round(product.rating))}
            </div>
            {product.review_count && (
              <span className="text-xs text-[#6B6B6B]">({product.review_count})</span>
            )}
          </div>
        )}

        {/* Price */}
        <div className="flex items-center gap-2 mb-3">
          <span className="font-bold text-lg text-[#1A1A1A]">
            {formatPrice(product.price)}
          </span>
          {product.original_price && product.original_price > (product.price ?? 0) && (
            <span className="text-sm text-[#6B6B6B] line-through">
              {formatPrice(product.original_price)}
            </span>
          )}
        </div>

        {/* CTA */}
        <a
          href={product.amazon_url}
          target="_blank"
          rel="noopener noreferrer sponsored"
          className="block w-full text-center bg-[#FFB300] hover:bg-[#E6A000] text-[#1A1A1A] font-bold text-sm py-2.5 rounded-lg transition-colors"
        >
          Køb på Amazon
        </a>
      </div>
    </div>
  )
}
