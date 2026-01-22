import Link from 'next/link'

interface CategoryCardProps {
  title: string
  slug: string
  description: string
  
  itemCount: number
}

export default function CategoryCard({ 
  title, 
  slug, 
  description, 
   
  itemCount 
}: CategoryCardProps) {
  return (
    <Link href={`/category/${slug}`}>
      <div className="group relative overflow-hidden rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 cursor-pointer">
        {/* Image */}
        <div className="relative h-80 bg-gray-100">
          
          {/* Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>
        </div>

        {/* Content */}
        <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
          <h3 className="text-2xl font-bold mb-2">{title}</h3>
          <p className="text-sm text-gray-200 mb-3">{description}</p>
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">{itemCount} Products</span>
            <span className="text-sm font-medium group-hover:translate-x-2 transition-transform">
              Shop Now →
            </span>
          </div>
        </div>
      </div>
    </Link>
  )
}