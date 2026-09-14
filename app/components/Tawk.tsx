'use client';
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
      s1.src='https://embed.tawk.to/6aa6f4216146c234460109b8/1k2e2j8o3';
      s1.charset='UTF-8';
      s1.setAttribute('crossorigin','*');
      s0.parentNode.insertBefore(s1,s0);
    })();
  }, []);
  return null
}
