// lib/supabase.ts
import { createClient } from '@supabase/supabase-js'
import { Product } from '@/types/product'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

interface FilterOptions {
  search: string
  category: string
  sort: string
}

export async function fetchFilteredProducts({ search, category, sort }: FilterOptions): Promise<Product[]> {
  let query = supabase.from('products').select('*')

  // Search filter
  if (search) {
    query = query.ilike('title', `%${search}%`)
  }

  // Category filter
  if (category && category !== 'all') {
    query = query.eq('category', category)
  }

  // Sorting
  if (sort === 'price_asc') {
    query = query.order('price', { ascending: true })
  } else if (sort === 'price_desc') {
    query = query.order('price', { ascending: false })
  } else {
    query = query.order('created_at', { ascending: false }) // newest first
  }

  const { data, error } = await query

  if (error) {
    console.error('Supabase fetch error:', error)
    return []
  }

  return data as Product[]
}