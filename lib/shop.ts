export function getShopLink(link: string) { return link || "#" }
export function getShopText() { return "Buy on Daraz" }
export function getPrice(p: any) {
  const current = Number(p?.price_discounted ?? p?.price ?? 1499)
  const original = Number(p?.price_original ?? p?.original_price ?? 2200)
  const cur = Math.min(current, original)
  const org = Math.max(current, original)
  const finalCurrent = current <= original ? current : cur
  const finalOriginal = original >= current ? original : org
  const discount = finalOriginal > finalCurrent ? Math.round(((finalOriginal - finalCurrent) / finalOriginal) * 100) : 0
  return { current: finalCurrent, original: finalOriginal, discount }
}
export function getImages(p: any) {
  const arr: any[] = []
  if (p?.image_url) arr.push(p.image_url)
  if (p?.image_url2) arr.push(p.image_url2)
  if (p?.image_url3) arr.push(p.image_url3)
  if (p?.image_url4) arr.push(p.image_url4)
  return arr.slice(0, 4)
}
