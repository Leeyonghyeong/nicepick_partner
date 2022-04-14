export interface LargeCategory {
  id: string
  categoryName: string
  mainImg: string
  menuImg: string
  selectImg: string
  smallCategory: SmallCategory[]
}

export interface SmallCategory {
  id: string
  categoryName: string
}
