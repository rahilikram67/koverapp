export const HARRODS_QUEUE = "HARRODS_QUEUE"

export interface HarrodsCategory {
  name: string
  url: string
}

export interface SubProductBody {
  productId: string
  brand: string
  name: string
  source: string
}

export interface HarrodsProduct extends SubProductBody {
  variant: string
  price: string
  description: string
  categories: string[]
  underwriterClassId: string
}
