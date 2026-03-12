import { createAdminClient } from './supabase-admin'
import type { Product } from './database.types'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function cast<T>(data: any): T {
  return data as T
}

export async function getFeaturedProducts(): Promise<Product[]> {
  const supabase = createAdminClient()
  const { data } = await supabase
    .from('products')
    .select('*')
    .eq('is_featured', true)
    .order('created_at', { ascending: false })
    .limit(8)
  return cast<Product[]>(data ?? [])
}

export async function getNewProducts(): Promise<Product[]> {
  const supabase = createAdminClient()
  const { data } = await supabase
    .from('products')
    .select('*')
    .eq('is_new', true)
    .order('created_at', { ascending: false })
    .limit(8)
  return cast<Product[]>(data ?? [])
}

export async function getSaleProducts(): Promise<Product[]> {
  const supabase = createAdminClient()
  const { data } = await supabase
    .from('products')
    .select('*')
    .eq('is_on_sale', true)
    .order('created_at', { ascending: false })
    .limit(8)
  return cast<Product[]>(data ?? [])
}

export async function getProductsByCategory(
  categoryId: string,
  limit = 24
): Promise<Product[]> {
  const supabase = createAdminClient()
  const { data } = await supabase
    .from('products')
    .select('*')
    .eq('category_id', categoryId)
    .order('is_featured', { ascending: false })
    .order('created_at', { ascending: false })
    .limit(limit)
  return cast<Product[]>(data ?? [])
}

export async function getProductByAsin(asin: string): Promise<Product | null> {
  const supabase = createAdminClient()
  const { data } = await supabase
    .from('products')
    .select('*')
    .eq('asin', asin)
    .single()
  return cast<Product | null>(data ?? null)
}

export async function searchProducts(query: string): Promise<Product[]> {
  const supabase = createAdminClient()
  const { data } = await supabase
    .from('products')
    .select('*')
    .or(`title.ilike.%${query}%,description.ilike.%${query}%,brand.ilike.%${query}%,model.ilike.%${query}%`)
    .order('is_featured', { ascending: false })
    .limit(24)
  return cast<Product[]>(data ?? [])
}

export async function getCategoryIdBySlug(slug: string): Promise<string | null> {
  const supabase = createAdminClient()
  const { data } = await supabase
    .from('categories')
    .select('*')
    .eq('slug', slug)
    .single()
  return cast<{ id: string } | null>(data)?.id ?? null
}

// Returnerer { slug → id } for en liste af slugs
export async function getCategoryIdsBySlugs(slugs: string[]): Promise<Record<string, string>> {
  if (slugs.length === 0) return {}
  const supabase = createAdminClient()
  const { data } = await supabase
    .from('categories')
    .select('id, slug')
    .in('slug', slugs)
  const map: Record<string, string> = {}
  cast<{ id: string; slug: string }[]>(data ?? []).forEach((c) => { map[c.slug] = c.id })
  return map
}

// Returnerer { categoryId → antal produkter }
export async function getProductCountsByCategories(categoryIds: string[]): Promise<Record<string, number>> {
  if (categoryIds.length === 0) return {}
  const supabase = createAdminClient()
  const { data } = await supabase
    .from('products')
    .select('category_id')
    .in('category_id', categoryIds)
  const counts: Record<string, number> = {}
  categoryIds.forEach((id) => { counts[id] = 0 })
  cast<{ category_id: string | null }[]>(data ?? []).forEach((p) => {
    if (p.category_id) counts[p.category_id] = (counts[p.category_id] ?? 0) + 1
  })
  return counts
}

// Henter produkter fra ALLE angivne kategorier (til hoved-kategoriside)
export async function getProductsByCategories(categoryIds: string[], limit = 48): Promise<Product[]> {
  if (categoryIds.length === 0) return []
  const supabase = createAdminClient()
  const { data } = await supabase
    .from('products')
    .select('*')
    .in('category_id', categoryIds)
    .order('is_featured', { ascending: false })
    .order('created_at', { ascending: false })
    .limit(limit)
  return cast<Product[]>(data ?? [])
}

export function formatPrice(price: number | null): string {
  if (price === null) return 'Se pris'
  return new Intl.NumberFormat('da-DK', {
    style: 'currency',
    currency: 'DKK',
    maximumFractionDigits: 0,
  }).format(price)
}

export function calcDiscount(price: number | null, originalPrice: number | null): number | null {
  if (!price || !originalPrice || originalPrice <= price) return null
  return Math.round(((originalPrice - price) / originalPrice) * 100)
}
