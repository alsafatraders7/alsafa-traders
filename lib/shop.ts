export type Product = {
  id: string
  name: string
  price: number
  image_url: string
  category?: string
}

export const shopInfo = {
  name: "Al Safa Traders",
  phone: "923000000000",
  whatsapp: "923000000000",
}

export function getWhatsAppLink(product: Product) {
  const text = `Salam, I want to buy: ${product.name} - Rs ${product.price}`
  return `https://wa.me/${shopInfo.whatsapp}?text=${encodeURIComponent(text)}`
}

export function formatPrice(price: number) {
  return `Rs ${price.toLocaleString()}`
}

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
