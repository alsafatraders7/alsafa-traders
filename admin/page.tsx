export default function Admin() {
  return (
    <div className="min-h-screen bg-[#070707] text-white p-6">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold mb-2">Admin Panel <span style={{color:'#D4AF37'}}>AL SAFA</span></h1>
        <p className="text-gray-400 mb-6">Black Golden Edition - Product Control</p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-[#111] border border-[#D4AF37]/30 p-6 rounded-xl">
            <h3 className="text-[#D4AF37] font-bold">Total Products</h3>
            <p className="text-2xl mt-2">0</p>
          </div>
          <div className="bg-[#111] border border-[#D4AF37]/30 p-6 rounded-xl">
            <h3 className="text-[#D4AF37] font-bold">Orders</h3>
            <p className="text-2xl mt-2">0</p>
          </div>
          <div className="bg-[#D4AF37] text-black p-6 rounded-xl font-bold">
            + Add New Product
          </div>
        </div>

        <div className="mt-8 bg-[#111] border border-[#D4AF37]/20 p-6 rounded-xl">
          <p className="text-center text-gray-500">Supabase connect karke products yahan ayenge</p>
        </div>
      </div>
    </div>
  );
}
