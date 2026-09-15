export function getShopLink(link: string) {
  return link || "#"
}
export function getShopText() {
  return "Buy on Daraz"
}
export function getPrice(p: any) {
  return {
    current: p?.price_discounted || p?.price || 1499,
    original: p?.price_original || 2200
  }
}
export function getImages(p: any) {
  const arr: any[] = []
  if (p?.image_url) arr.push(p.image_url)
  if (p?.image_url2) arr.push(p.image_url2)
  if (p?.image_url3) arr.push(p.image_url3)
  if (p?.image_url4) arr.push(p.image_url4)
  return arr.slice(0, 4)
}
