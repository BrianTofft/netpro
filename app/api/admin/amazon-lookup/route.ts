import { NextRequest, NextResponse } from 'next/server'

function isAuthorized(req: NextRequest) {
  const pw = req.headers.get('x-admin-password')
  return pw === process.env.ADMIN_PASSWORD
}

const EUR_TO_DKK = 7.46

function extractText(html: string, pattern: RegExp): string | null {
  const m = html.match(pattern)
  return m ? m[1].replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim() : null
}

export async function GET(req: NextRequest) {
  if (!isAuthorized(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { searchParams } = new URL(req.url)
  const asin = searchParams.get('asin')?.trim().toUpperCase()
  if (!asin || !/^[A-Z0-9]{10}$/.test(asin)) {
    return NextResponse.json({ error: 'Ugyldigt ASIN-format' }, { status: 400 })
  }

  const url = `https://www.amazon.de/dp/${asin}`

  let html: string
  try {
    const res = await fetch(url, {
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
        'Accept-Language': 'de-DE,de;q=0.9,en;q=0.8',
        Accept:
          'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8',
        'Cache-Control': 'no-cache',
        Pragma: 'no-cache',
      },
      // 10 sekunder timeout
      signal: AbortSignal.timeout(10_000),
    })

    if (res.status === 404) {
      return NextResponse.json({ error: 'Produkt ikke fundet på Amazon.de' }, { status: 404 })
    }
    if (!res.ok) {
      return NextResponse.json(
        { error: `Amazon svarede med statuskode ${res.status}` },
        { status: 502 }
      )
    }
    html = await res.text()
  } catch {
    return NextResponse.json({ error: 'Kunne ikke forbinde til Amazon.de' }, { status: 502 })
  }

  // CAPTCHA-tjek
  if (html.includes('Type the characters you see in this image') || html.includes('captcha')) {
    return NextResponse.json(
      { error: 'Amazon viser CAPTCHA — prøv igen om lidt' },
      { status: 429 }
    )
  }

  // --- Titel ---
  const title = extractText(html, /id="productTitle"[^>]*>([\s\S]*?)<\/span>/)

  // --- Brand ---
  const brand =
    extractText(html, /id="bylineInfo"[^>]*>[\s\S]*?(?:Visit the |Besøg )?([\w\s\-\.&]+?)(?:\s+[Ss]tore| Brand| Mærke)/) ??
    extractText(html, /"brand"\s*:\s*"([^"]+)"/) ??
    'Bosch Professional'

  // --- Model (fra titel) ---
  const modelMatch = title?.match(/\b(G[A-Z]{2,3}(?:\s[\dA-Z][\w\-V]*){1,3})\b/)
  const model = modelMatch ? modelMatch[1] : null

  // --- Billede (højeste opløsning fra JSON data embeddet i siden) ---
  const hiResMatch = html.match(/"hiRes"\s*:\s*"(https:\/\/[^"]+)"/)
  const largeMatch = html.match(/"large"\s*:\s*"(https:\/\/m\.media-amazon\.com\/images\/[^"]+)"/)
  const landingMatch = html.match(/id="landingImage"[^>]+src="([^"]+)"/)
  const imageUrl = hiResMatch?.[1] ?? largeMatch?.[1] ?? landingMatch?.[1] ?? null

  // --- Pris (EUR → DKK) ---
  let price: number | null = null
  let originalPrice: number | null = null

  // Prøv JSON-LD først
  const jsonLdMatch = html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/)
  if (jsonLdMatch) {
    try {
      const jsonLd = JSON.parse(jsonLdMatch[1])
      const offers = jsonLd?.offers ?? jsonLd?.Offers
      const priceVal = offers?.price ?? offers?.lowPrice
      if (priceVal) {
        price = Math.round(parseFloat(priceVal) * EUR_TO_DKK)
      }
    } catch {
      // ignorer parse-fejl
    }
  }

  // Fallback: scrape a-price-whole / a-price-fraction
  if (!price) {
    const wholeMatch = html.match(/class="a-price-whole"[^>]*>\s*([\d.,]+)/)
    const fracMatch = html.match(/class="a-price-fraction"[^>]*>\s*(\d{2})/)
    if (wholeMatch) {
      const whole = wholeMatch[1].replace(/\./g, '').replace(',', '')
      const frac = fracMatch ? fracMatch[1] : '00'
      const eur = parseFloat(`${whole}.${frac}`)
      if (!isNaN(eur)) price = Math.round(eur * EUR_TO_DKK)
    }
  }

  // Vejledende pris (stregpris)
  const strikeMatch = html.match(/class="a-text-strike"[^>]*>\s*[\s\S]*?([\d.,]+)\s*€/)
  if (strikeMatch) {
    const eur = parseFloat(strikeMatch[1].replace('.', '').replace(',', '.'))
    if (!isNaN(eur)) originalPrice = Math.round(eur * EUR_TO_DKK)
  }

  // --- Features / beskrivelse ---
  const features: string[] = []
  const bulletBlock = html.match(/id="feature-bullets"[\s\S]*?<ul[\s\S]*?>([\s\S]*?)<\/ul>/)
  if (bulletBlock) {
    const liMatches = [...bulletBlock[1].matchAll(/<span[^>]*class="[^"]*a-list-item[^"]*"[^>]*>([\s\S]*?)<\/span>/g)]
    for (const m of liMatches) {
      const text = m[1].replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim()
      if (text.length > 5) features.push(text)
    }
  }
  const description = features.length > 0 ? features.join('\n') : null

  return NextResponse.json({
    asin,
    title: title ?? '',
    brand: brand.trim(),
    model,
    price,
    original_price: originalPrice,
    image_url: imageUrl,
    description,
    features,
  })
}
