import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase-admin'
import { getProductsFromAmazon, buildAffiliateUrl } from '@/lib/amazon-pa-api'

// Køres dagligt via Vercel Cron (se vercel.json)
export async function GET(req: NextRequest) {
  const authHeader = req.headers.get('authorization')
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const supabase = createAdminClient()

  // Hent alle ASINs der ikke er opdateret inden for 24 timer
  const cutoff = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()
  const { data: staleProducts } = await supabase
    .from('products')
    .select('asin, category_id')
    .or(`cached_at.is.null,cached_at.lt.${cutoff}`)
    .limit(100)

  if (!staleProducts?.length) {
    return NextResponse.json({ message: 'Ingen produkter at opdatere' })
  }

  const asins = staleProducts.map((p) => p.asin)

  try {
    const updated = await getProductsFromAmazon(asins)

    for (const p of updated) {
      await supabase
        .from('products')
        .update({
          price: p.price,
          original_price: p.originalPrice,
          image_url: p.imageUrl,
          rating: p.rating,
          review_count: p.reviewCount,
          amazon_url: buildAffiliateUrl(p.asin),
          cached_at: new Date().toISOString(),
        })
        .eq('asin', p.asin)
    }

    return NextResponse.json({ updated: updated.length })
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Ukendt fejl'
    return NextResponse.json({ error: msg }, { status: 500 })
  }
}
