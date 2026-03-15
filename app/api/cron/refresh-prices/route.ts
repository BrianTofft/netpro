import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase-admin'
import { buildAffiliateUrl } from '@/lib/amazon-pa-api'

const PRICE_ALERT_THRESHOLD = 5 // DKK
const EUR_TO_DKK = 7.46

// Skraber pris direkte fra Amazon.de produktside (ingen PA API nødvendig)
async function scrapePrice(asin: string): Promise<number | null> {
  try {
    const res = await fetch(`https://www.amazon.de/dp/${asin}`, {
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
        'Accept-Language': 'de-DE,de;q=0.9,en;q=0.8',
        Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'Cache-Control': 'no-cache',
      },
      signal: AbortSignal.timeout(10_000),
    })

    if (!res.ok) return null
    const html = await res.text()

    if (html.includes('captcha') || html.includes('Type the characters')) return null

    // Forsøg 1: JSON-LD strukturerede data
    const jsonLdMatch = html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/)
    if (jsonLdMatch) {
      try {
        const jsonLd = JSON.parse(jsonLdMatch[1])
        const offers = jsonLd?.offers ?? jsonLd?.Offers
        const priceVal = offers?.price ?? offers?.lowPrice
        if (priceVal) return Math.round(parseFloat(priceVal) * EUR_TO_DKK)
      } catch { /* ignorer */ }
    }

    // Forsøg 2: HTML pris-elementer
    const wholeMatch = html.match(/class="a-price-whole"[^>]*>\s*([\d.,]+)/)
    const fracMatch = html.match(/class="a-price-fraction"[^>]*>\s*(\d{2})/)
    if (wholeMatch) {
      const whole = wholeMatch[1].replace(/\./g, '').replace(',', '')
      const frac = fracMatch ? fracMatch[1] : '00'
      const eur = parseFloat(`${whole}.${frac}`)
      if (!isNaN(eur)) return Math.round(eur * EUR_TO_DKK)
    }

    return null
  } catch {
    return null
  }
}

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
    .select('id, asin, title, price')
    .or(`cached_at.is.null,cached_at.lt.${cutoff}`)
    .limit(100)

  if (!staleProducts?.length) {
    return NextResponse.json({ message: 'Ingen produkter at opdatere' })
  }

  const alertedProducts: { title: string; asin: string; oldPrice: number; newPrice: number }[] = []
  let updatedCount = 0

  for (const product of staleProducts) {
    // Lille pause mellem requests for ikke at trigge Amazon rate-limit
    await new Promise((r) => setTimeout(r, 1500))

    const newPrice = await scrapePrice(product.asin)
    if (newPrice === null) continue

    const oldPrice: number | null = product.price ?? null
    const priceChanged =
      oldPrice !== null && Math.abs(newPrice - oldPrice) > PRICE_ALERT_THRESHOLD

    await supabase
      .from('products')
      .update({
        price: newPrice,
        amazon_url: buildAffiliateUrl(product.asin),
        cached_at: new Date().toISOString(),
        ...(priceChanged && {
          price_alert: true,
          price_changed_at: new Date().toISOString(),
          previous_price: oldPrice,
        }),
      })
      .eq('id', product.id)

    updatedCount++

    if (priceChanged && oldPrice !== null) {
      alertedProducts.push({ title: product.title, asin: product.asin, oldPrice, newPrice })
    }
  }

  // Send én samlet email til admin hvis der er prisændringer
  if (alertedProducts.length > 0) {
    await sendPriceAlertEmail(alertedProducts)
  }

  return NextResponse.json({ updated: updatedCount, alerts: alertedProducts.length })
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
