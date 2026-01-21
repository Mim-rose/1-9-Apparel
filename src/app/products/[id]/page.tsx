import { supabase } from '@/lib/supabase'
import { Product } from '@/types/product'
import Link from 'next/link'
import { notFound } from 'next/navigation'

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params

  // Fetch single product
  const { data: product, error } = await supabase
    .from('products')
    .select('*')
    .eq('id', id)
    .single()

  if (error || !product) {
    notFound()
  }

  const formattedDate = new Date(product.created_at).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Back Button */}
        <Link
          href="/products"
          className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-8"
        >
          <svg
            className="w-5 h-5 mr-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
          Back to Products
        </Link>

        {/* Product Card */}
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="mb-4">
            <span className="inline-block bg-blue-100 text-blue-800 text-sm font-semibold px-4 py-2 rounded-full">
              {product.category}
            </span>
          </div>

          <h1 className="text-4xl font-bold text-gray-900 mb-6">
            {product.title}
          </h1>

          <div className="space-y-6">
            <div>
              <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-2">
                Price
              </h2>
              <p className="text-5xl font-bold text-gray-900">
                ${product.price.toFixed(2)}
              </p>
            </div>

            <div>
              <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-2">
                Category
              </h2>
              <p className="text-xl text-gray-700 capitalize">
                {product.category}
              </p>
            </div>

            <div>
              <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-2">
                Added On
              </h2>
              <p className="text-xl text-gray-700">{formattedDate}</p>
            </div>

            <div>
              <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-2">
                Product ID
              </h2>
              <p className="text-sm text-gray-500 font-mono break-all">
                {product.id}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}