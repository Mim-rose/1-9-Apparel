'use client'

interface FilterBarProps {
  category: string
  onCategoryChange: (category: string) => void
  sort: string
  onSortChange: (sort: string) => void
}

export default function FilterBar({ 
  category, 
  onCategoryChange, 
  sort, 
  onSortChange 
}: FilterBarProps) {
  return (
    <div className="flex flex-col sm:flex-row gap-4">
      {/* Category Filter */}
      <div className="flex-1">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Category
        </label>
        <select
          value={category}
          onChange={(e) => onCategoryChange(e.target.value)}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none bg-white"
        >
          <option value="all">All Categories</option>
          <option value="tshirt">T-Shirts</option>
          <option value="hoodie">Hoodies</option>
          <option value="jogger">Joggers</option>
        </select>
      </div>

      {/* Sort Filter */}
      <div className="flex-1">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Sort By
        </label>
        <select
          value={sort}
          onChange={(e) => onSortChange(e.target.value)}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none bg-white"
        >
          <option value="newest">Newest First</option>
          <option value="price_asc">Price: Low → High</option>
          <option value="price_desc">Price: High → Low</option>
        </select>
      </div>
    </div>
  )
}