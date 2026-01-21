import Link from 'next/link'

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center px-4">
      <div className="text-center">
        <h1 className="text-5xl font-bold text-gray-900 mb-4">
          1 & 9 Apparel Creator
        </h1>
        <p className="text-xl text-gray-600 mb-8">
          Dynamic Product Filter System
        </p>
        <Link
          href="/products"
          className="inline-block bg-blue-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-blue-700 transition-colors shadow-lg"
        >
          View Products →
        </Link>
      </div>
    </div>
  )
}