"use client"
import { useState, useEffect } from "react"

const LOCKED = "alsafatraders7@gmail.com"

export default function FullAdmin(){
  const [ok,setOk]=useState(false)
  const [email,setEmail]=useState("")
  const [pass,setPass]=useState("")
  const [tab,setTab]=useState("dashboard")
  const [showForgot,setShowForgot]=useState(false)
  const [otp,setOtp]=useState("")
  const [otpIn,setOtpIn]=useState("")
  const [newP,setNewP]=useState("")
  
  // Dummy data for now - Supabase ke bina bhi Dashboard chalega
  const [views,setViews]=useState(187)
  const [products,setProducts]=useState<any[]>([])

  useEffect(()=>{
    const isOk = localStorage.getItem("safa_ok")==="1"
    if(isOk) setOk(true)
    const v = Number(localStorage.getItem("safa_views")||"187")
    setViews(v+1); localStorage.setItem("safa_views",String(v+1))
    const saved = localStorage.getItem("safa_products")
    if(saved) setProducts(JSON.parse(saved))
  },[])

  const login=()=>{
    const savedPass = localStorage.getItem("safa_pass") || "alsafa123"
    if(email.toLowerCase().trim() !== LOCKED){
      alert("Email: "+LOCKED+" hi likhna hai"); return
    }
    if(pass !== savedPass && pass !== "Faizan8048"){
      alert("Password: alsafa123 ya Faizan8048"); return
    }
    localStorage.setItem("safa_ok","1")
    setOk(true)
  }

  const sendOTP=()=>{
    const code = Math.floor(100000+Math.random()*900000).toString()
    setOtp(code)
