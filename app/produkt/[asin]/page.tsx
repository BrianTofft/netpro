import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { getProductByAsin, formatPrice, calcDiscount } from '@/lib/products'

interface Props {
  params: Promise<{ asin: string }>
}

export const revalidate = 21600 // 6 timer

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { asin } = await params
  const product = await getProductByAsin(asin)
  if (!product) return {}
  return {
    title: product.title,
    description: product.description ?? `Køb ${product.title} hos NETPRO. Gratis fragt og min. 3 års garanti.`,
    openGraph: {
      images: product.image_url ? [product.image_url] : [],
    },
  }
}

export default async function ProductPage({ params }: Props) {
  const { asin } = await params
  const product = await getProductByAsin(asin)
  if (!product) notFound()

  const discount = calcDiscount(product.price, product.original_price)

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <nav className="text-sm text-[#6B6B6B] mb-6 flex items-center gap-2">
        <Link href="/" className="hover:text-[#003DA5]">Forside</Link>
        <span>/</span>
        <span className="text-[#1A1A1A] font-medium line-clamp-1">{product.title}</span>
      </nav>

      <div className="grid lg:grid-cols-2 gap-12">
        {/* Image */}
        <div className="bg-[#F5F5F5] rounded-2xl overflow-hidden aspect-square relative">
          {product.image_url ? (
            <Image
              src={product.image_url}
              alt={product.title}
              fill
              className="object-contain p-8"
              sizes="(max-width: 1024px) 100vw, 50vw"
              priority
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center text-6xl text-gray-300">🔧</div>
          )}
          {discount && (
            <div className="absolute top-4 left-4 bg-red-500 text-white text-sm font-bold px-3 py-1 rounded-full">
              -{discount}%
            </div>
          )}
          {product.is_new && (
            <div className="absolute top-4 right-4 bg-[#2D8C4E] text-white text-sm font-bold px-3 py-1 rounded-full">
              NY
            </div>
          )}
        </div>

        {/* Details */}
        <div>
          {product.brand && (
            <div className="text-sm text-[#6B6B6B] uppercase tracking-widest mb-2">{product.brand}</div>
          )}
          <h1 className="text-2xl lg:text-3xl font-bold text-[#1A1A1A] mb-4 leading-tight">
            {product.title}
          </h1>

          {product.model && (
            <div className="text-sm text-[#6B6B6B] mb-4">Model: <span className="font-medium text-[#1A1A1A]">{product.model}</span></div>
          )}

          {/* Rating */}
          {product.rating && (
            <div className="flex items-center gap-2 mb-5">
              <div className="flex text-[#FFB300]">
                {'★'.repeat(Math.round(product.rating))}
                {'☆'.repeat(5 - Math.round(product.rating))}
              </div>
              <span className="font-semibold">{product.rating}</span>
              {product.review_count && (
                <span className="text-sm text-[#6B6B6B]">({product.review_count.toLocaleString('da')} anmeldelser)</span>
              )}
            </div>
          )}

          {/* Price */}
          <div className="bg-[#F5F5F5] rounded-xl p-5 mb-6">
            <div className="flex items-baseline gap-3 mb-1">
              <span className="text-4xl font-bold text-[#1A1A1A]">{formatPrice(product.price)}</span>
              {product.original_price && product.original_price > (product.price ?? 0) && (
                <span className="text-xl text-[#6B6B6B] line-through">{formatPrice(product.original_price)}</span>
              )}
            </div>
            <div className="text-xs text-[#6B6B6B] mb-1">inkl. moms</div>
            {discount && (
              <div className="text-sm text-red-600 font-medium">Du sparer {formatPrice((product.original_price ?? 0) - (product.price ?? 0))}</div>
            )}
            <div className="mt-3 text-xs text-[#6B6B6B]">
              ✓ Gratis fragt 1–2 hverdage &nbsp;·&nbsp; ✓ Min. 3 års garanti
            </div>
          </div>

          {/* CTA */}
          <a
            href={product.amazon_url}
            target="_blank"
            rel="noopener noreferrer sponsored"
            className="flex items-center justify-center gap-3 w-full bg-[#FFB300] hover:bg-[#E6A000] text-[#1A1A1A] font-bold text-lg py-4 rounded-xl transition-colors mb-3"
          >
            <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zm4.536 14.4c-.192.128-.496.064-.72-.128-2.016-1.664-4.544-2.048-7.52-1.12-.288.064-.576-.096-.64-.384-.064-.288.096-.576.384-.64 3.264-1.024 6.08-.576 8.32 1.28.24.192.288.544.08.736l.096.256zm1.216-2.784c-.24.16-.624.08-.864-.16-2.304-1.92-5.824-2.464-8.544-1.344-.352.128-.72-.064-.848-.384-.128-.352.064-.72.384-.848 3.104-1.28 7.008-.672 9.664 1.536.288.208.32.624.128.88l.08.32zm.096-2.88c-2.752-1.76-7.296-1.92-9.92-1.056-.416.128-.864-.096-.992-.512-.128-.416.096-.864.512-.992 3.04-.992 8.064-.8 11.232 1.216.384.24.48.736.24 1.12-.24.352-.736.448-1.072.224z"/>
            </svg>
            Køb på Amazon.de
          </a>

          <p className="text-center text-xs text-[#6B6B6B]">
            Du viderestilles til Amazon.de for at gennemføre købet
          </p>

          {/* Features */}
          {product.features && product.features.length > 0 && (
            <div className="mt-8">
              <h2 className="font-bold text-lg mb-3">Produktegenskaber</h2>
              <ul className="space-y-2">
                {product.features.map((f, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm">
                    <span className="text-[#003DA5] mt-0.5 shrink-0">✓</span>
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>

      {/* Description */}
      {product.description && (
        <div className="mt-12 border-t border-[#E0E0E0] pt-8">
          <h2 className="text-xl font-bold mb-4">Produktbeskrivelse</h2>
          <p className="text-[#2D2D2D] leading-relaxed whitespace-pre-line">{product.description}</p>
        </div>
      )}
    </div>
  )
}
