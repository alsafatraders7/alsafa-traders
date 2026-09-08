import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-[#070707] text-white">
      <section className="max-w-7xl mx-auto px-4 py-16 text-center">
        <div className="inline-block border border-[#D4AF37]/30 rounded-full px-4 py-1 text-xs text-[#D4AF37] mb-4">ORIGINAL STORE PAKISTAN</div>
        <h1 className="text-4xl font-bold mb-3">AL SAFA <span style={{color:'#D4AF37'}}>TRADERS</span></h1>
        <p className="text-gray-400 mb-8">Smart Shopping, Better Living — Black & Golden Royal Collection</p>
        <div className="flex gap-3 justify-center">
          <Link href="/admin" className="px-6 py-3 rounded-full font-bold" style={{background:'#D4AF37', color:'#000'}}>Go to Admin Panel</Link>
          <a href="https://alsafatraders.pk" className="border border-[#D4AF37] text-[#D4AF37] px-6 py-3 rounded-full">Visit Old Site</a>
        </div>
      </section>
      <div className="max-w-7xl mx-auto px-4 pb-20 grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-[#111] border border-[#D4AF37]/20 p-4 rounded-xl">Product 1 - Golden Edition</div>
        <div className="bg-[#111] border border-[#D4AF37]/20 p-4 rounded-xl">Product 2 - Royal Black</div>
        <div className="bg-[#111] border border-[#D4AF37]/20 p-4 rounded-xl">Product 3 - Premium</div>
        <div className="bg-[#111] border border-[#D4AF37]/20 p-4 rounded-xl">Product 4 - Original</div>
      </div>
    </div>
  );
}
