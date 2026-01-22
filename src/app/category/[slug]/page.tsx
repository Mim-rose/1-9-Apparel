import { notFound } from 'next/navigation'
import CategoryClient from './CategoryClient'

// 1. Make the function 'async'
// 2. Update the type to 'Promise'
export default async function CategoryPage({ 
  params 
}: { 
  params: Promise<{ slug: string }> 
}) {
  
  // 3. 'await' the params before destructuring
  const { slug } = await params

  const validCategories = ['tshirt', 'hoodie', 'jogger']
  
  if (!validCategories.includes(slug)) {
    notFound()
  }

  return <CategoryClient slug={slug} />
}