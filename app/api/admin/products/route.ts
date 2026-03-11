import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase-admin'
import { buildAffiliateUrl } from '@/lib/amazon-pa-api'

function isAuthorized(req: NextRequest) {
  const pw = req.headers.get('x-admin-password')
  return pw === process.env.ADMIN_PASSWORD
}

// GET — hent alle produkter med kategori-navn
export async function GET(req: NextRequest) {
  if (!isAuthorized(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const supabase = createAdminClient()
  const { data, error } = await supabase
    .from('products')
    .select('*, categories(id, name, slug)')
    .order('created_at', { ascending: false })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}

// POST — opret eller opdater produkt (upsert på asin)
export async function POST(req: NextRequest) {
  if (!isAuthorized(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await req.json()
  const supabase = createAdminClient()

  const row = {
    asin: body.asin?.trim(),
    title: body.title?.trim(),
    description: body.description?.trim() || null,
    price: body.price ? Number(body.price) : null,
    original_price: body.original_price ? Number(body.original_price) : null,
    image_url: body.image_url?.trim() || null,
    amazon_url: buildAffiliateUrl(body.asin?.trim()),
    category_id: body.category_id || null,
    brand: body.brand?.trim() || null,
    model: body.model?.trim() || null,
    features: body.features || [],
    is_featured: body.is_featured ?? false,
    is_new: body.is_new ?? false,
    is_on_sale: body.is_on_sale ?? false,
    cached_at: new Date().toISOString(),
  }

  const { data, error } = await supabase
    .from('products')
    .upsert(row, { onConflict: 'asin' })
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}

// PATCH — opdater enkelt felt (fx is_featured toggle)
export async function PATCH(req: NextRequest) {
  if (!isAuthorized(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await req.json()
  const { id, ...fields } = body
  const supabase = createAdminClient()

  const { error } = await supabase.from('products').update(fields).eq('id', id)
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ ok: true })
}

// DELETE — slet produkt
export async function DELETE(req: NextRequest) {
  if (!isAuthorized(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { searchParams } = new URL(req.url)
  const id = searchParams.get('id')
  if (!id) return NextResponse.json({ error: 'id mangler' }, { status: 400 })

  const supabase = createAdminClient()
  const { error } = await supabase.from('products').delete().eq('id', id)
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ ok: true })
}
