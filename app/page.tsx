import Hero from '@/components/home/Hero'
import USPBanner from '@/components/home/USPBanner'
import BoschShowcase from '@/components/home/BoschShowcase'
import FeaturedProducts from '@/components/home/FeaturedProducts'
import HowItWorks from '@/components/home/HowItWorks'
import WhyNetpro from '@/components/home/WhyNetpro'
import Testimonials from '@/components/home/Testimonials'
import { getNewProducts, getSaleProducts } from '@/lib/products'

export const revalidate = 60

export default async function HomePage() {
  const [newProducts, saleProducts] = await Promise.all([
    getNewProducts(),
    getSaleProducts(),
  ])

  return (
    <>
      <Hero />
      <USPBanner />
      <BoschShowcase />

      {/* Aktuelle tilbud */}
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
