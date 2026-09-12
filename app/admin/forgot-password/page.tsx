"use client";
import { useState } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function ForgotPassword(){
  const [email,setEmail]=useState("");
  const [sent,setSent]=useState(false);

  const send = async ()=>{
    if(!email) return alert("Email likho!");
    const {error} = await supabase.auth.resetPasswordForEmail(email.trim(), {
      redirectTo: "https://www.alsafatraders.pk/admin"
    });
    if(error) alert(error.message);
    else setSent(true);
  };

  return (
    <div className="min-h-screen flex items-center justify-center" style={{background:"#E8F5E9"}}>
      <div className="bg-white p-8 rounded-2xl shadow-xl w-[400px] border-t-4" style={{borderColor:"#1A3C34"}}>
        <h2 className="font-bold text-2xl mb-2" style={{color:"#1A3C34"}}>Forgot Password?</h2>
        <p className="text-sm text-gray-500 mb-6">Reset link email pe ayega</p>

        {!sent? (
          <>
            <label className="text-sm font-bold">Email</label>
            <input value={email} onChange={e=>setEmail(e.target.value)} placeholder="alsafatraders7@gmail.com" className="w-full border p-3 rounded-lg mb-4 mt-1"/>
            <button onClick={send} className="w-full py-3 rounded-lg text-white font-bold" style={{background:"#1A3C34"}}>Send Reset Link</button>
          </>
        ) : (
          <div className="bg-green-50 p-4 rounded-lg text-center border border-green-200">
            <p className="font-bold text-green-700">✅ Email bhej diya!</p>
            <p className="text-sm mt-2">{email} pe check karo — Spam me bhi dekho</p>
          </div>
        )}

        <a href="/admin" className="block text-center mt-6 text-sm text-blue-600 underline">Back to Log In</a>
      </div>
    </div>
  );
}
