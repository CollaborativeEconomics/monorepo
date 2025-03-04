import type { Category } from '@cfce/database'

export function sortCategories(list:Category[]){
  const categories = list.map(it=>{ 
      return {id:it.id, name:it.title}
  }).sort((item1, item2) => {
    if (item1.name.toLowerCase() < item2.name.toLowerCase()) { return -1 }
    if (item1.name.toLowerCase() > item2.name.toLowerCase()) { return 1 }
    return 0
  })
  return categories
}
