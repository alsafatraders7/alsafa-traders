import Link from 'next/link'
export default function Home(){
  return (
    <main style={{fontFamily:'system-ui',padding:'20px',maxWidth:'600px',margin:'0 auto'}}>
      <div style={{background:'#0f3d2e',color:'white',padding:'30px',borderRadius:'20px',textAlign:'center'}}>
        <h1 style={{fontSize:'32px',fontWeight:'bold'}}>AL SAFA TRADERS.PK</h1>
        <p>Daraz Best Deals - Dubai Based</p>
        <p style={{marginTop:'10px',fontSize:'14px'}}>Website LIVE hai! ✅</p>
      </div>
      <div style={{marginTop:'20px',display:'grid',gridTemplateColumns:'1fr 1fr',gap:'15px'}}>
        <div style={{border:'1px solid #ddd',borderRadius:'15px',padding:'15px',textAlign:'center'}}>
          <img src="https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=300" style={{width:'100%',borderRadius:'10px'}} />
          <h3>TWS Earbuds M10</h3><b>Rs. 2499</b><br/>
          <a href="https://www.daraz.pk" target="_blank" style={{background:'#f85606',color:'white',padding:'8px 15px',borderRadius:'20px',display:'inline-block',marginTop:'10px',textDecoration:'none'}}>Buy on Daraz</a>
        </div>
        <div style={{border:'1px solid #ddd',borderRadius:'15px',padding:'15px',textAlign:'center'}}>
          <img src="https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=300" style={{width:'100%',borderRadius:'10px'}} />
          <h3>Smart Watch</h3><b>Rs. 3499</b><br/>
          <a href="https://www.daraz.pk" target="_blank" style={{background:'#f85606',color:'white',padding:'8px 15px',borderRadius:'20px',display:'inline-block',marginTop:'10px',textDecoration:'none'}}>Buy on Daraz</a>
        </div>
      </div>
    </main>
  )
}
