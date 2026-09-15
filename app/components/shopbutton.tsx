"use client"
import { getShopLink, getShopText } from "@/lib/shop"

export default function ShopButton({ link }: { link: string }) {
  return (
    <a href={getShopLink(link)} target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()} className="block text-center bg-[#FFD814] hover:bg-[#F7CA00] py-2.5 rounded-full text-[12px] font-black text-black">
      {getShopText()}
    </a>
  )
}
