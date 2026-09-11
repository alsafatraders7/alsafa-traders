"use client"
import { useState } from "react"

export default function Page(){
  const [ok,setOk] = useState(false)
  const [e,setE] = useState("")
  const [p,setP] = useState("")

  const login=()=>{
    if(e==="alsafatraders7@gmail.com" && (p==="alsafa123" || p==="Faizan8048")){
      setOk(true)
      localStorage.setItem("safa_ok","1")
    } else {
      alert("Email: alsafatraders7@gmail.com\nPass: alsafa123")
    }
  }

  if(!ok){
    return (
      <div style={{background:"black",minHeight:"100vh",display:"flex",justifyContent:"center",alignItems:"center"}}>
        <div style={{background:"white",padding:30,borderRadius:20,width:350}}>
          <h2 style={{fontWeight:900}}>Al Safa Admin</h2>
          <input value={e} onChange={ev=>setE(ev.target.value)} placeholder="alsafatraders7@gmail.com" style={{width:"100%",padding:12,border:"1px solid #ccc",borderRadius:10,marginTop:20}}/>
          <input value={p} onChange={ev=>setP(ev.target.value)} type="password" placeholder="alsafa123" style={{width:"100%",padding:12,border:"1px solid #ccc",borderRadius:10,marginTop:10}}/>
          <button onClick={login} style={{width:"100%",background:"black",color:"white",padding:14,borderRadius:100,marginTop:15,fontWeight:900}}>LOGIN</button>
        </div>
      </div>
    )
  }

  return <div style={{padding:30}}><h1 style={{fontWeight:900,fontSize:24}}>Login Ho Gaya! ✅</h1><p style={{marginTop:10}}>Ab bolo - Main pura Product wala Final Code isi me daal dun!</p><button onClick={()=>{localStorage.clear(); setOk(false)}} style={{marginTop:20,background:"red",color:"white",padding:"10px 20px",borderRadius:20}}>Logout</button></div>
}
