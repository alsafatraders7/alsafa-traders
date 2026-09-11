export default function Home() {
  return (
    <main className="min-h-screen bg-[#FFFBEB] text-[#2D2D2D]">
      {/* HEADER - Dark Green */}
      <header className="bg-[#1B4332] text-white py-4 px-6 flex justify-between items-center shadow-md sticky top-0 z-50">
        <h1 className="text-xl font-bold tracking-[0.15em]">AL SAFA TRADERS</h1>
        <div className="flex items-center gap-4">
          <span className="hidden md:block text-[#D4A574] text-sm">Free Delivery Worldwide</span>
          <button className="bg-[#8FA998] hover:bg-[#7A9B8A] text-white px-6 py-2 rounded-full font-bold text-sm">Cart (0)</button>
        </div>
      </header>

      {/* HERO - Cream Background */}
      <section className="bg-[#FFFBEB] text-center py-20 px-6">
        <span className="bg-[#1B4332] text-[#FFFBEB] px-4 py-1 rounded-full text-xs font-bold tracking-[0.2em]">ALSAFATRADE.PK</span>
        <h2 className="text-5xl md:text-6xl font-extrabold mt-6 mb-4 text-[#1B4332] leading-tight">Everyday Kitchen<br/>Essentials</h2>
        <p className="text-[#5C5C5C] max-w-xl mx-auto text-lg">Curated for Pakistani homes worldwide. Premium quality, timeless design.</p>
      </section>

      {/* PRODUCT CARDS - White */}
      <section className="px-6 max-w-6xl mx-auto pb-20">
        <div className="grid md:grid-cols-3 gap-8">
          {/* Card 1 */}
          <div className="bg-white rounded-2xl shadow-sm border border-[#F0E6D3] overflow-hidden group">
            <div className="h-48 bg-[#F5F0E8] relative">
              <span className="absolute top-3 left-3 bg-[#FF6B35] text-white text-xs font-bold px-3 py-1 rounded-full">SALE</span>
            </div>
            <div className="p-6">
              <h3 className="font-bold text-[#2D2D2D] text-lg">Wooden Spice Rack</h3>
              <p className="text-[#8A8A8A] text-sm mt-1">Premium Sheesham Wood</p>
              <div className="flex justify-between items-center mt-4">
                <span className="font-bold text-[#1B4332] text-xl">Rs. 2,499</span>
                <button className="bg-[#8FA998] hover:bg-[#1B4332] text-white px-5 py-2 rounded-full text-sm font-bold transition-colors">Add to Cart</button>
              </div>
            </div>
          </div>

          {/* Card 2 */}
          <div className="bg-white rounded-2xl shadow-sm border border-[#F0E6D3] overflow-hidden">
            <div className="h-48 bg-[#F5F0E8] relative">
              <span className="absolute top-3 left-3 bg-[#1B4332] text-white text-xs font-bold px-3 py-1 rounded-full">NEW</span>
            </div>
            <div className="p-6">
              <h3 className="font-bold text-[#2D2D2D] text-lg">Storage Jars Set</h3>
              <p className="text-[#8A8A8A] text-sm mt-1">Air-Tight Glass Set of 3</p>
              <div className="flex justify-between items-center mt-4">
                <span className="font-bold text-[#1B4332] text-xl">Rs. 1,899</span>
                <button className="bg-[#8FA998] hover:bg-[#1B4332] text-white px-5 py-2 rounded-full text-sm font-bold transition-colors">Add to Cart</button>
              </div>
            </div>
          </div>

          {/* Card 3 */}
          <div class
