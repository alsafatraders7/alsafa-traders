"use client"
import { useState } from "react"

export default function Home() {
  const [search, setSearch] = useState("")

  return (
    <div className="min-h-screen bg-[#E8F5E9]">
      <div className="bg-[#E8F5E9] text-[11px] text-center py-2 tracking-widest text-[#1A3C34] font-bold">
        LAUNCH - NEW ARRIVALS - FREE DELIVERY OVER RS.2000 - 16K+ HAPPY CUSTOMERS
      </div>

      <header className="bg-[#1A3C34] p-3 flex items-center gap-3">
        <div className="bg-[#FFC107] w-10 h-10 rounded-full flex items-center justify-center font-black">AS</div>
        <div className="text-white font-black leading-none">Al Safa<br/>Traders.pk</div>
        <div className="flex-1 bg-white rounded-full px-4 py-2.5 flex items-center gap-2 ml-2">
          <input value={search} onChange={(e)=>setSearch(e.target.value)} placeholder="Search chopper, storage," className="w-full outline-none text-sm" />
        </div>
      </header>

      <main className="p-4">
        <div className="bg-white/80 inline-block px-4 py-1 rounded-full text-[11px] font-bold mb-4">
          2.5M+ HOME COOKS | 155K+ 5 STAR REVIEWS
        </div>

        <h1 className="text-[28px] font-black text-[#1A3C34]">Welcome to Safa traders</h1>

        <h2 className="text-[38px] font-black text-[#1A3C34] leading-[0.95] mt-2">
          Everyday Kitchen<br/>Essentials for Smart Homes
        </h2>

        <p className="text-[#1A3C34]/80 mt-4 text-[16px] max-w-[600px]">
          Ghar ke kaam asan banayen! Premium quality choppers, strainers, storage & organizers - jo har kitchen me chahiye. 16K+ gharon me trusted, rozana khana banana ab aur easy.
        </p>

        <div className="flex gap-3 mt-6">
          <button className="bg-[#1A3C34] text-white px-6 py-3 rounded-full font-bold text-sm">Shop New Arrivals</button>
          <button className="bg-white px-6 py-3 rounded-full font-bold text-sm">Shop Best Sellers</button>
        </div>

        <div className="mt-10 bg-white rounded-[20px] p-10 text-center">
          <p className="font-bold text-[#1A3C34]">Products yahan show honge</p>
          <p className="text-sm text-gray-500 mt-2">Admin se product add karo</p>
        </div>
      </main>

      <footer className="mt-10 bg-white p-6 text-center">
        <a href="https://www.tiktok.com/@alsafatraders.pk" target="_blank" className="text-xs font-bold underline">TikTok @alsafatraders.pk</a>
      </footer>
    </div>
  )
}
