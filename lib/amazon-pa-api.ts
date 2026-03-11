/**
 * Amazon Product Advertising API 5.0 wrapper
 *
 * Kræver følgende miljøvariabler:
 *   AMAZON_ACCESS_KEY     — AWS Access Key ID
 *   AMAZON_SECRET_KEY     — AWS Secret Access Key
 *   AMAZON_ASSOCIATE_TAG  — Dit Amazon Associates tag (fx "netpro-21")
 *   AMAZON_MARKETPLACE    — www.amazon.de
 *
 * Installation: npm install paapi5-nodejs
 *
 * Amazon Associates oprettelse: https://affiliate-program.amazon.de
 * PA API adgang aktiveres automatisk når Associates-kontoen har 3+ godkendte salg.
 */

export interface AmazonProduct {
  asin: string
  title: string
  description: string | null
  price: number | null
  originalPrice: number | null
  imageUrl: string | null
  images: string[]
  amazonUrl: string
  brand: string | null
  features: string[]
  rating: number | null
  reviewCount: number | null
}

// Placeholder: implementeres når PA API credentials er klar
// Skift denne funktion ud med rigtig PA API kald

export async function getProductsFromAmazon(asins: string[]): Promise<AmazonProduct[]> {
  if (!process.env.AMAZON_ACCESS_KEY) {
    console.warn('Amazon PA API ikke konfigureret — returnerer tom liste')
    return []
  }

  // TODO: implementer med paapi5-nodejs
  // const DefaultApi = require('paapi5-nodejs')
  // ...
  throw new Error('Amazon PA API integration ikke implementeret endnu')
}

export async function searchAmazon(keywords: string): Promise<AmazonProduct[]> {
  if (!process.env.AMAZON_ACCESS_KEY) {
    console.warn('Amazon PA API ikke konfigureret — returnerer tom liste')
    return []
  }

  throw new Error('Amazon PA API integration ikke implementeret endnu')
}

/**
 * Hjælpefunktion: konverterer Amazon-pris (i cent) til DKK
 * Kursveksling: opdater EUR_TO_DKK løbende eller brug en valuta-API
 */
export function convertEurToDkk(eurCents: number): number {
  const EUR_TO_DKK = 7.46
  return Math.round((eurCents / 100) * EUR_TO_DKK)
}

/**
 * Bygger affiliate-link med Associate Tag
 */
export function buildAffiliateUrl(asin: string): string {
  const tag = process.env.AMAZON_ASSOCIATE_TAG ?? 'netpro-21'
  return `https://www.amazon.de/dp/${asin}?tag=${tag}`
}
