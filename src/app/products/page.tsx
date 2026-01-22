'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { Product } from '@/types/product'
import ProductCard from '@/components/ProductCard'
import CategoryCard from '@/components/CategoryCard'
import Pagination from '@/components/Pagination'
import SearchBar from '@/components/SearchBar'
import FilterBar from '@/components/FilterBar'

export default function HomePage() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalProducts, setTotalProducts] = useState(0)

  // Filters
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('all')
  const [sort, setSort] = useState('newest')

  const ITEMS_PER_PAGE = 10

  // Fetch products with filters + pagination
  useEffect(() => {
    fetchProducts()
  }, [currentPage, search, category, sort])

  const fetchProducts = async () => {
    setLoading(true)
    try {
      const start = (currentPage - 1) * ITEMS_PER_PAGE
      const end = start + ITEMS_PER_PAGE - 1

      let query = supabase.from('products').select('*', { count: 'exact' })

      // Search filter
      if (search) {
        query = query.ilike('title', `%${search}%`)
      }

      // Category filter
      if (category !== 'all') {
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

      // Pagination
      query = query.range(start, end)

      const { data, count, error } = await query
      if (error) throw error

      setProducts(data || [])
      setTotalProducts(count || 0)
    } catch (error) {
      console.error('Error fetching products:', error)
    } finally {
      setLoading(false)
    }
  }

  const totalPages = Math.ceil(totalProducts / ITEMS_PER_PAGE)

  // Category data
  const categories = [
    {
      title: 'T-Shirts',
      slug: 'tshirt',
      description: 'Casual & Comfortable',
      imageUrl: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600&h=800&fit=crop',
      itemCount: 5,
    },
    {
      title: 'Hoodies',
      slug: 'hoodie',
      description: 'Warm & Stylish',
      imageUrl: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=600&h=800&fit=crop',
      itemCount: 5,
    },
    {
      title: 'Joggers',
      slug: 'jogger',
      description: 'Active & Trendy',
      imageUrl: 'https://images.unsplash.com/photo-1555689502-c4b22d76c56f?w=600&h=800&fit=crop',
      itemCount: 5,
    },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl font-bold mb-4">Welcome to 1&9 Apparel</h1>
          <p className="text-xl mb-8 text-blue-100">
            Discover the latest fashion trends and elevate your style
          </p>
          <button className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
            Shop Now
          </button>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Shop by Category</h2>
            <p className="text-gray-600 text-lg">Find your perfect style</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {categories.map((category) => (
              <CategoryCard key={category.slug} {...category} />
            ))}
          </div>
        </div>
      </section>

      {/* All Products Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h2 className="text-4xl font-bold text-gray-900 mb-2">All Products</h2>
              <p className="text-gray-600">
                Showing {products.length} of {totalProducts} products (Page {currentPage} of {totalPages})
              </p>
            </div>
          </div>

          {/* Filters */}
          <div className="space-y-6 mb-8">
            <SearchBar value={search} onChange={setSearch} />
            <FilterBar
              category={category}
              onCategoryChange={setCategory}
              sort={sort}
              onSortChange={setSort}
            />
          </div>

          {/* Product Grid */}
          {loading ? (
            <div className="flex justify-center items-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                {products.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={setCurrentPage}
                />
              )}
            </>
          )}
        </div>
      </section>

      {/* Footer CTA */}
      <section className="bg-gray-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to upgrade your wardrobe?</h2>
          <p className="text-gray-400 mb-8">Join thousands of satisfied customers</p>
          <button className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors">
            Start Shopping
          </button>
        </div>
      </section>
    </div>
  )
}