import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase-admin'
import { getProductsFromAmazon, buildAffiliateUrl } from '@/lib/amazon-pa-api'

const PRICE_ALERT_THRESHOLD = 5 // DKK

// Køres dagligt via Vercel Cron (se vercel.json)
export async function GET(req: NextRequest) {
  const authHeader = req.headers.get('authorization')
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const supabase = createAdminClient()

  // Hent alle produkter der ikke er opdateret inden for 24 timer
  const cutoff = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()
  const { data: staleProducts } = await supabase
    .from('products')
    .select('*')
    .or(`cached_at.is.null,cached_at.lt.${cutoff}`)
    .limit(100)

  if (!staleProducts?.length) {
    return NextResponse.json({ message: 'Ingen produkter at opdatere' })
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const asins = (staleProducts as any[]).map((p) => p.asin as string)

  try {
    const updated = await getProductsFromAmazon(asins)

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const alertedProducts: { title: string; asin: string; oldPrice: number; newPrice: number }[] = []

    for (const p of updated) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const existing = (staleProducts as any[]).find((s) => s.asin === p.asin)
      const oldPrice: number | null = existing?.price ?? null
      const newPrice = p.price

      const priceChanged =
        oldPrice !== null &&
        newPrice !== null &&
        Math.abs(newPrice - oldPrice) > PRICE_ALERT_THRESHOLD

      await supabase
        .from('products')
        .update({
          price: newPrice,
          original_price: p.originalPrice,
          image_url: p.imageUrl,
          rating: p.rating,
          review_count: p.reviewCount,
          amazon_url: buildAffiliateUrl(p.asin),
          cached_at: new Date().toISOString(),
          ...(priceChanged && {
            price_alert: true,
            price_changed_at: new Date().toISOString(),
            previous_price: oldPrice,
          }),
        })
        .eq('asin', p.asin)

      if (priceChanged && oldPrice !== null && newPrice !== null) {
        alertedProducts.push({
          title: existing?.title ?? p.asin,
          asin: p.asin,
          oldPrice,
          newPrice,
        })
      }
    }

    // Send én samlet email til admin hvis der er prisændringer
    if (alertedProducts.length > 0) {
      await sendPriceAlertEmail(alertedProducts)
    }

    return NextResponse.json({ updated: updated.length, alerts: alertedProducts.length })
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Ukendt fejl'
    return NextResponse.json({ error: msg }, { status: 500 })
  }
}

async function sendPriceAlertEmail(
  products: { title: string; asin: string; oldPrice: number; newPrice: number }[]
) {
  const resendKey = process.env.RESEND_API_KEY
  const adminEmail = process.env.ADMIN_NOTIFY_EMAIL
  if (!resendKey || !adminEmail) return

  const rows = products
    .map((p) => {
      const diff = p.newPrice - p.oldPrice
      const sign = diff > 0 ? '+' : ''
      const arrow = diff > 0 ? '↑' : '↓'
      const color = diff > 0 ? '#dc2626' : '#16a34a'
      return `
        <tr>
          <td style="padding:10px 12px;border-bottom:1px solid #f0f0f0;font-size:13px;color:#1a1a1a;">${p.title}</td>
          <td style="padding:10px 12px;border-bottom:1px solid #f0f0f0;font-size:12px;color:#666;font-family:monospace;">${p.asin}</td>
          <td style="padding:10px 12px;border-bottom:1px solid #f0f0f0;font-size:13px;text-align:right;">${p.oldPrice.toLocaleString('da-DK')} kr.</td>
          <td style="padding:10px 12px;border-bottom:1px solid #f0f0f0;font-size:13px;text-align:right;font-weight:600;">${p.newPrice.toLocaleString('da-DK')} kr.</td>
          <td style="padding:10px 12px;border-bottom:1px solid #f0f0f0;font-size:13px;text-align:right;color:${color};font-weight:600;">${arrow} ${sign}${diff.toLocaleString('da-DK')} kr.</td>
        </tr>`
    })
    .join('')

  const html = `
    <div style="font-family:sans-serif;max-width:680px;margin:0 auto;padding:32px 24px;background:#f8f8f8;">
      <div style="background:#1C3A6E;border-radius:10px 10px 0 0;padding:24px 28px;">
        <h1 style="color:#fff;margin:0;font-size:20px;">⚠️ Prisændringer på Netpro</h1>
        <p style="color:#a8c0e8;margin:6px 0 0;font-size:14px;">${products.length} produkt${products.length !== 1 ? 'er' : ''} har ændret pris med mere end ${PRICE_ALERT_THRESHOLD} kr.</p>
      </div>
      <div style="background:#fff;border-radius:0 0 10px 10px;padding:24px 28px;box-shadow:0 2px 8px rgba(0,0,0,0.06);">
        <table style="width:100%;border-collapse:collapse;">
          <thead>
            <tr style="background:#f5f7fa;">
              <th style="padding:10px 12px;text-align:left;font-size:12px;color:#666;font-weight:600;">Produkt</th>
              <th style="padding:10px 12px;text-align:left;font-size:12px;color:#666;font-weight:600;">ASIN</th>
              <th style="padding:10px 12px;text-align:right;font-size:12px;color:#666;font-weight:600;">Gammel pris</th>
              <th style="padding:10px 12px;text-align:right;font-size:12px;color:#666;font-weight:600;">Ny pris</th>
              <th style="padding:10px 12px;text-align:right;font-size:12px;color:#666;font-weight:600;">Ændring</th>
            </tr>
          </thead>
          <tbody>${rows}</tbody>
        </table>
        <div style="margin-top:24px;padding-top:20px;border-top:1px solid #f0f0f0;text-align:center;">
          <a href="https://netpro.vercel.app/admin" style="display:inline-block;background:#1C3A6E;color:#fff;padding:12px 28px;border-radius:8px;text-decoration:none;font-size:14px;font-weight:600;">
            Gå til Admin →
          </a>
        </div>
      </div>
      <p style="text-align:center;color:#aaa;font-size:11px;margin-top:16px;">Netpro · Automatisk prisovervågning</p>
    </div>`

  await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${resendKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: 'Netpro <noreply@netpro.dk>',
      to: [adminEmail],
      subject: `⚠️ ${products.length} prisændring${products.length !== 1 ? 'er' : ''} på Netpro`,
      html,
    }),
  })
}
