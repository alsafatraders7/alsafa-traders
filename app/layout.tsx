import "./globals.css";

export const metadata = {
  title: "Al Safa Traders | Smart Shopping",
  description: "Pakistan Trusted Store",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-[#070707]">
        <header className="bg-[#070707] border-b border-[#D4AF37]/30 sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img src="/logo.png" alt="logo" className="w-11 h-11 rounded-full border-2 border-[#D4AF37]" />
              <div>
                <h1 className="text-white font-bold text-lg leading-none">AL SAFA <span style={{color:'#D4AF37'}}>TRADERS</span></h1>
                <p className="text-[10px]" style={{color:'#D4AF37'}}>SMART SHOPPING, BETTER LIVING</p>
              </div>
            </div>
            <a href="/admin" className="border px-3 py-1 rounded-full text-sm" style={{color:'#D4AF37', borderColor:'#D4AF37'}}>Admin</a>
          </div>
        </header>
        <main>{children}</main>
      </body>
    </html>
  );
}
