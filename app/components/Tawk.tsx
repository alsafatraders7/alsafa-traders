'use client'
import { useEffect } from 'react'

export default function Tawk() {
  useEffect(() => {
    // @ts-ignore
    var Tawk_API = (window as any).Tawk_API || {};
    // @ts-ignore
    var Tawk_LoadStart = new Date();
    (function(){
      var s1=document.createElement("script") as any;
      var s0=document.getElementsByTagName("script")[0];
      s1.async=true;
      s1.src='https://embed.tawk.to/68ba7c43af3730192aed0d68/1j66g4j1g';
      s1.charset='UTF-8';
      s1.setAttribute('crossorigin','*');
      s0.parentNode.insertBefore(s1,s0);
    })();
  }, [])
  return null
}
