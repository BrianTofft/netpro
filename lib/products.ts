import { createAdminClient } from './supabase-admin'
import type { Product } from './database.types'

export async function getFeaturedProducts(): Promise<Product[]> {
  const supabase = createAdminClient()
  const { data } = await supabase
    .from('products')
    .select('*')
    .eq('is_featured', true)
    .order('created_at', { ascending: false })
    .limit(8)
  return data ?? []
}

export async function getNewProducts(): Promise<Product[]> {
  const supabase = createAdminClient()
  const { data } = await supabase
    .from('products')
    .select('*')
    .eq('is_new', true)
    .order('created_at', { ascending: false })
    .limit(8)
  return data ?? []
}

export async function getSaleProducts(): Promise<Product[]> {
  const supabase = createAdminClient()
  const { data } = await supabase
    .from('products')
    .select('*')
    .eq('is_on_sale', true)
    .order('created_at', { ascending: false })
    .limit(8)
  return data ?? []
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
  return data ?? []
}

export async function getProductByAsin(asin: string): Promise<Product | null> {
  const supabase = createAdminClient()
  const { data } = await supabase
    .from('products')
    .select('*')
    .eq('asin', asin)
    .single()
  return data ?? null
}

export async function searchProducts(query: string): Promise<Product[]> {
  const supabase = createAdminClient()
  const { data } = await supabase
    .from('products')
    .select('*')
    .or(`title.ilike.%${query}%,description.ilike.%${query}%,brand.ilike.%${query}%,model.ilike.%${query}%`)
    .order('is_featured', { ascending: false })
    .limit(24)
  return data ?? []
}

export async function getCategoryIdBySlug(slug: string): Promise<string | null> {
  const supabase = createAdminClient()
  const { data } = await supabase
    .from('categories')
    .select('*')
    .eq('slug', slug)
    .single()
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (data as any)?.id ?? null
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
