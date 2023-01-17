export const BEST_BUY_QUEUE = "BEST_BUY"

export interface BestBuyCategory {
  id: string
  name: string
}

export interface BestBuyQueryPayload {
  from: number
  to: number
  currentPage: number
  total: number
  totalPages: number
  queryTime: string
  totalTime: string
  partial: boolean
  canonicalUrl: string
  products: BestBuyProduct[]
}

export interface BestBuyProduct {
  name: string
  salePrice: number
  sku: number
  manufacturer: string
  shortDescription: null | string
  color: string
  releaseDate: null | string
  categoryPath: CategoryPath[]
}

export interface CategoryPath {
  id: string
  name: string
}
