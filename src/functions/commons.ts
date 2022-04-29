export const dateFormat = (date: string) => {
  const formatDate = new Date(date)

  const year = formatDate.getFullYear()
  const month =
    formatDate.getMonth() + 1 < 10
      ? '0' + (formatDate.getMonth() + 1)
      : formatDate.getMonth() + 1
  const day =
    formatDate.getDate() < 10
      ? '0' + formatDate.getDate()
      : formatDate.getDate()

  return `${year}.${month}.${day}`
}

export const calcOriginPrice = (price: number, sale: number) => {
  const calcSale = 1 - sale / 100

  const originPrice = price / calcSale

  return originPrice.toLocaleString()
}
