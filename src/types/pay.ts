export interface PayCategory {
  categoryName: string
  payProduct: PayProduct[]
}

export interface PayProduct {
  id: string
  productName: string
  productImg: string
  productMobileImg: string
  productNoti: string
  payTermPrice: PayTermPrice[]
  selectTermPrice: PayTermPrice
  payType: string
  payProductId: string
}

export interface PayTermPrice {
  id: string
  term: number
  price: number
  sale: number
  payProductId: string
  payProductName: string
  payCategoryName: string
}

export interface PayStatus {
  id: string
  payDate: string
  status: number
  receiptUrl: string
  payTermPrice: PayTermPrice
}

export interface CurrentProduct {
  id: string
  expire: string
  productName: string
  categoryName: string
  payStatus: PayStatus
  createAt: string
}
