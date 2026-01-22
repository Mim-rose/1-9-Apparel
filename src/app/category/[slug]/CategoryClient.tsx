'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { Product } from '@/types/product'
import ProductCard from '@/components/ProductCard'
import SearchBar from '@/components/SearchBar'
import FilterBar from '@/components/FilterBar'
import Link from 'next/link'

export default function CategoryClient({ slug }: { slug: string }) {
  const categoryNames: { [key: string]: string } = {
    tshirt: 'T-Shirts',
    hoodie: 'Hoodies',
    jogger: 'Joggers',
  }

  const [search, setSearch] = useState('')
  const [sort, setSort] = useState('newest')
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchProducts()
  }, [search, sort])

  const fetchProducts = async () => {
    setLoading(true)
    try {
      let query = supabase.from('products').select('*').eq('category', slug)

      if (search) query = query.ilike('title', `%${search}%`)
      if (sort === 'price_asc') query = query.order('price', { ascending: true })
      else if (sort === 'price_desc') query = query.order('price', { ascending: false })
      else query = query.order('created_at', { ascending: false })

      const { data, error } = await query
      if (error) throw error
      setProducts(data || [])
    } catch (err) {
      console.error('Error fetching products:', err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Breadcrumb */}
        <div className="flex items-center space-x-2 text-sm text-gray-600 mb-8">
          <Link href="/" className="hover:text-blue-600">Home</Link>
          <span>/</span>
          <span className="text-gray-900 font-medium">{categoryNames[slug]}</span>
        </div>

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            {categoryNames[slug]}
          </h1>
          <p className="text-gray-600">{products.length} products available</p>
        </div>

        {/* Filters */}
        <div className="space-y-6 mb-8">
          <SearchBar value={search} onChange={setSearch} />
          <FilterBar
            category={slug}
            onCategoryChange={() => {}}
            sort={sort}
            onSortChange={setSort}
          />
        </div>

        {/* Products Grid */}
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : products.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <p className="text-gray-500 text-lg">No products found in this category</p>
          </div>
        )}
      </div>
    </div>
  )
}