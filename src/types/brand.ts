export interface Brand {
  id: string
  brandName: string
  brandLogoImg: string
  brandLogoImgkey: string
  brandImg: string
  brandImgKey: string
  webUrl: string
  brandPromotion: string
  brandPromotionIcon: string
  isPremium: boolean
  isUpdate: boolean
  largeCategoryName: string
  smallCategoryName: string
  brandIntroImg: BrandIntroImg[]
  brandStartCostImg: BrandStartCostImg[]
  brandMenuImg: BrandMenuImg[]
  brandInteriorImg: BrandInteriorImg[]
  brandYoutube: BrandYoutube[]
}

export interface BrandIntroImg {
  id: string
  introImgUrl: string
  introImgUrlKey: string
}

export interface BrandStartCostImg {
  id: string
  startCostImgUrl: string
  startCostImgUrlKey: string
}

export interface BrandMenuImg {
  id: string
  menuImgUrl: string
  menuImgUrlKey: string
  menuName?: string
  menuPrice?: number
}

export interface BrandInteriorImg {
  id: string
  interiorImgUrl: string
  interiorImgUrlKey: string
}

export interface BrandYoutube {
  id: string
  youtubeUrl: string
  youtubeId: string
}

export interface BrandChangeStatus {
  id: string
  year: number
  newShopCount: number
  terminationCount: number
  cancelCount: number
  changeCount: number
}

export interface BrandFranchiseStatus {
  id: string
  year: number
  location: string
  allCount: number
}

export interface BrandStartCost {
  id: string
  membershipFee: string
  educationFee: string
  deposit: string
  etcFee: string
  totalFee: string
  interiorFee: string
  startTotalPrice: string
}
