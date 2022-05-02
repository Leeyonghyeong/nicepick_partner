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
