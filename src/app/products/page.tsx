'use client'

import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { Product } from '@/types/product'
import ProductCard from '@/components/ProductCard'
import SearchBar from '@/components/SearchBar'
import FilterBar from '@/components/FilterBar'

export default function ProductsPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState(searchParams.get('search') || '')
  const [category, setCategory] = useState(searchParams.get('cat') || 'all')
  const [sort, setSort] = useState(searchParams.get('sort') || 'newest')

  // Fetch products from Supabase
  useEffect(() => {
    fetchProducts()
  }, [search, category, sort])

  // Update URL when filters change
  useEffect(() => {
    const params = new URLSearchParams()
    if (search) params.set('search', search)
    if (category !== 'all') params.set('cat', category)
    if (sort !== 'newest') params.set('sort', sort)
    
    const queryString = params.toString()
    router.push(`/products${queryString ? `?${queryString}` : ''}`)
  }, [search, category, sort, router])

  const fetchProducts = async () => {
    setLoading(true)
    
    try {
      let query = supabase.from('products').select('*')

      // Apply search filter
      if (search) {
        query = query.ilike('title', `%${search}%`)
      }

      // Apply category filter
      if (category && category !== 'all') {
        query = query.eq('category', category)
      }

      // Apply sorting
      if (sort === 'price_asc') {
        query = query.order('price', { ascending: true })
      } else if (sort === 'price_desc') {
        query = query.order('price', { ascending: false })
      } else {
        query = query.order('created_at', { ascending: false })
      }

      const { data, error } = await query

      if (error) throw error
      setProducts(data || [])
    } catch (error) {
      console.error('Error fetching products:', error)
      setProducts([])
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Products
          </h1>
          <p className="text-gray-600">
            Browse our collection of apparel
          </p>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="space-y-4">
            <SearchBar value={search} onChange={setSearch} />
            <FilterBar
              category={category}
              onCategoryChange={setCategory}
              sort={sort}
              onSortChange={setSort}
            />
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-6">
          <p className="text-gray-600">
            {loading ? (
              'Loading...'
            ) : (
              `Showing ${products.length} product${products.length !== 1 ? 's' : ''}`
            )}
          </p>
        </div>

        {/* Products Grid */}
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-gray-500 text-lg">No products found</p>
            <p className="text-gray-400 mt-2">Try adjusting your filters</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}