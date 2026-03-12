import Hero from '@/components/home/Hero'
import USPBanner from '@/components/home/USPBanner'
import FeaturedProducts from '@/components/home/FeaturedProducts'
import HowItWorks from '@/components/home/HowItWorks'
import WhyNetpro from '@/components/home/WhyNetpro'
import Testimonials from '@/components/home/Testimonials'
import { getFeaturedProducts, getNewProducts, getSaleProducts } from '@/lib/products'

export const revalidate = 60

export default async function HomePage() {
  const [featured, newProducts, saleProducts] = await Promise.all([
    getFeaturedProducts(),
    getNewProducts(),
    getSaleProducts(),
  ])

  // Undgå dubletter — vis ikke udvalgte produkter der allerede vises under tilbud
  const saleIds = new Set(saleProducts.map((p) => p.id))
  const featuredOnly = featured.filter((p) => !saleIds.has(p.id))

  return (
    <>
      <Hero />
      <USPBanner />

      {/* Aktuelle tilbud — vises øverst hvis der er tilbudsprodukter */}
      {saleProducts.length > 0 && (
        <div className="bg-red-50 border-y border-red-100 py-2">
          <FeaturedProducts
            products={saleProducts}
            title="🔥 Aktuelle tilbud"
            subtitle="Begrænsede tilbud på professionelt Bosch-udstyr"
            viewAllHref="/tilbud"
          />
        </div>
      )}

      {/* Udvalgte produkter — kun dem der ikke allerede vises under tilbud */}
      {featuredOnly.length > 0 && (
        <FeaturedProducts
          products={featuredOnly}
          title="Udvalgte produkter"
          subtitle="Håndplukkede Bosch Professional favoritter"
          viewAllHref="/bore-skruemaskiner"
        />
      )}

      {/* Nyheder */}
      {newProducts.length > 0 && (
        <FeaturedProducts
          products={newProducts}
          title="Nyheder"
          subtitle="De seneste tilkomne produkter"
          viewAllHref="/nyheder"
        />
      )}

      <HowItWorks />
      <WhyNetpro />
      <Testimonials />
    </>
  )
}
