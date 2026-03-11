import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase-admin'
import { getProductsFromAmazon, buildAffiliateUrl } from '@/lib/amazon-pa-api'

// Beskyt med en simpel API-nøgle
function isAuthorized(req: NextRequest) {
  const key = req.headers.get('x-api-key')
  return key === process.env.SYNC_API_KEY
}

export async function POST(req: NextRequest) {
  if (!isAuthorized(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { asins, category_id } = await req.json() as { asins: string[]; category_id: string }

  if (!asins?.length) {
    return NextResponse.json({ error: 'asins er påkrævet' }, { status: 400 })
  }

  try {
    const amazonProducts = await getProductsFromAmazon(asins)
    const supabase = createAdminClient()

    const rows = amazonProducts.map((p) => ({
      asin: p.asin,
      title: p.title,
      description: p.description,
      price: p.price,
      original_price: p.originalPrice,
      image_url: p.imageUrl,
      images: p.images,
      amazon_url: buildAffiliateUrl(p.asin),
      category_id,
      brand: p.brand,
      features: p.features,
      rating: p.rating,
      review_count: p.reviewCount,
      cached_at: new Date().toISOString(),
    }))

    const { error } = await supabase
      .from('products')
      .upsert(rows, { onConflict: 'asin' })

    if (error) throw error

    return NextResponse.json({ synced: rows.length })
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Ukendt fejl'
    return NextResponse.json({ error: msg }, { status: 500 })
  }
}
