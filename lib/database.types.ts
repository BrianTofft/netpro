export interface Database {
  public: {
    Tables: {
      categories: {
        Row: {
          id: string
          slug: string
          name: string
          parent_id: string | null
          sort_order: number
          created_at: string
        }
        Insert: Omit<Database['public']['Tables']['categories']['Row'], 'id' | 'created_at'>
        Update: Partial<Database['public']['Tables']['categories']['Insert']>
      }
      products: {
        Row: {
          id: string
          asin: string
          title: string
          description: string | null
          price: number | null
          original_price: number | null
          image_url: string | null
          images: string[] | null
          amazon_url: string
          category_id: string | null
          brand: string | null
          model: string | null
          features: string[] | null
          is_featured: boolean
          is_new: boolean
          is_on_sale: boolean
          rating: number | null
          review_count: number | null
          cached_at: string | null
          created_at: string
        }
        Insert: Omit<Database['public']['Tables']['products']['Row'], 'id' | 'created_at'>
        Update: Partial<Database['public']['Tables']['products']['Insert']>
      }
    }
    Views: Record<string, unknown>
    Functions: Record<string, unknown>
  }
}

export type Category = Database['public']['Tables']['categories']['Row']
export type Product = Database['public']['Tables']['products']['Row']
