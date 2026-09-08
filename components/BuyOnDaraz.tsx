"use client"

type Props = {
  darazUrl: string
  productId: string
  title: string
}

export default function BuyOnDaraz({ darazUrl, productId, title }: Props) {
  const handleClick = async () => {
    // Track click in Supabase for ORIGINAL account
    try {
      await fetch("/api/track-click", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId, title }),
      })
    } catch (e) {
      console.log("Tracking error", e)
    }
    // Open Daraz with your affiliate tag
    window.open(darazUrl, "_blank")
  }

  return (
    <button
      onClick={handleClick}
      className="w-full bg-[#f85606] hover:bg-[#e04e05] text-white font-bold py-3 px-4 rounded-lg flex items-center justify-center gap-2 transition"
    >
      🛒 Buy on Daraz - Pakistan
    </button>
  )
}
