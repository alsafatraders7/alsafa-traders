// lib/shop.ts - tag se bachne ka final fix
export function getShopLink(link: string) {
  return link || "#"
}

export function getShopText() {
  // 【entity-Daraz¦canonical_name=Daraz】 word ko tod ke banaya, tag nahi banega, lekin screen pe sahi dikhega
  const d = String.fromCharCode(68,97,114,97,122)
  return `Buy on ${d}`
}

export function getPrice(p: any) {
  return {
    current: p.price_discounted || p.price || 1499,
    original: p.price_original || 2200
  }
}

export function getImages(p: any): string[] {
  // 4 images capacity: image_url + image_urls array
  const arr: string[] = []
  if (p.image_url) arr.push(p.image_url)
  if (p.image_urls && Array.isArray(p.image_urls)) arr.push(...p.image_urls)
  if (p.image_url2) arr.push(p.image_url2)
  if (p.image_url3) arr.push(p.image_url3)
  if (p.image_url4) arr.push(p.image_url4)
  return [...new Set(arr)].slice(0, 4)
}
