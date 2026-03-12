import Hero from '@/components/home/Hero'
import USPBanner from '@/components/home/USPBanner'
import CategoryGrid from '@/components/home/CategoryGrid'
import FeaturedProducts from '@/components/home/FeaturedProducts'
import HowItWorks from '@/components/home/HowItWorks'
import WhyNetpro from '@/components/home/WhyNetpro'
import Testimonials from '@/components/home/Testimonials'
import { getFeaturedProducts, getNewProducts, getSaleProducts } from '@/lib/products'

export const revalidate = 3600

export default async function HomePage() {
  const [featured, newProducts, saleProducts] = await Promise.all([
    getFeaturedProducts(),
    getNewProducts(),
    getSaleProducts(),
  ])

  return (
    <>
      <Hero />
      <USPBanner />
      <CategoryGrid />
      <FeaturedProducts
        products={featured}
        title="Udvalgte produkter"
        subtitle="Håndplukkede Bosch Professional favoritter"
        viewAllHref="/bore-skruemaskiner"
      />
      {newProducts.length > 0 && (
        <FeaturedProducts
          products={newProducts}
          title="Nyheder"
          subtitle="De seneste tilkomne produkter"
          viewAllHref="/nyheder"
        />
      )}
      {saleProducts.length > 0 && (
        <div className="bg-[#003DA5]/5 py-2 rounded-2xl mx-4">
          <FeaturedProducts
            products={saleProducts}
            title="Aktuelle tilbud"
            subtitle="Spar på professionelt Bosch-udstyr"
            viewAllHref="/tilbud"
          />
        </div>
      )}
      <HowItWorks />
      <WhyNetpro />
      <Testimonials />
    </>
  )
}
