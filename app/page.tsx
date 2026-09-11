export default function Home(){
return(
<main style={{minHeight:"100vh", background:"#FFFBEB"}}>
<header style={{background:"#1B4332", color:"white", padding:"16px 24px", display:"flex", justifyContent:"space-between", alignItems:"center"}}>
<h1 style={{fontWeight:"900", letterSpacing:"3px"}}>AL SAFA TRADERS</h1>
<button style={{background:"#8FA998", color:"white", padding:"8px 20px", borderRadius:"999px", fontWeight:"700"}}>Cart (0)</button>
</header>
<section style={{textAlign:"center", padding:"80px 20px"}}>
<h2 style={{fontSize:"48px", fontWeight:"800", color:"#1B4332"}}>Everyday Kitchen Essentials</h2>
<p style={{color:"#666", marginTop:"10px"}}>Curated for Pakistani homes worldwide.</p>
</section>
<div style={{display:"grid", gridTemplateColumns:"repeat(auto-fit, minmax(250px, 1fr))", gap:"20px", maxWidth:"1100px", margin:"0 auto", padding:"0 24px 80px"}}>
<div style={{background:"white", borderRadius:"16px", padding:"20px", border:"1px solid #eee"}}><h3>Wooden Spice Rack</h3><div style={{background:"#FF6B35", color:"white", display:"inline-block", padding:"2px 8px", borderRadius:"10px", fontSize:"11px", marginTop:"8px"}}>SALE</div><br/><button style={{marginTop:"12px", background:"#8FA998", color:"white", padding:"8px 16px", borderRadius:"20px", border:"none"}}>Add to Cart</button></div>
<div style={{background:"white", borderRadius:"16px", padding:"20px", border:"1px solid #eee"}}><h3>Storage Jars Set</h3><button style={{marginTop:"12px", background:"#8FA998", color:"white", padding:"8px 16px", borderRadius:"20px", border:"none"}}>Add to Cart</button></div>
<div style={{background:"white", borderRadius:"16px", padding:"20px", border:"1px solid #eee"}}><h3>Kitchen Organizer</h3><button style={{marginTop:"12px", background:"#8FA998", color:"white", padding:"8px 16px", borderRadius:"20px", border:"none"}}>Add to Cart</button></div>
</div>
</main>
)
}
