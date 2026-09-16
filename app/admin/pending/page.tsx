"use client";
import { useEffect, useState } from 'react';

export default function PendingPage() {
  const [products, setProducts] = useState<any[]>([]);
  
  useEffect(() => {
    fetch('/api/fetch-daraz')
      .then(r => r.json())
      .then(d => console.log(d));
  }, []);

  return (
    <div style={{ padding: '20px' }}>
      <h1 style={{ fontSize: '24px', fontWeight: 'bold' }}>Pending Products - Kitchen + Home Gadgets</h1>
      <p>Kitchen + Home Gadgets LOCKED!</p>
      <p>Categories: kitchen-dining, home-appliances, kitchen-appliances, home-decor, storage-organisation, cleaning-tools, bath, bedding</p>
      <div style={{ marginTop: '20px', padding: '10px', background: '#f0f0f0' }}>
        <p>Vercel Build Fixed! ✅</p>
        <p>Ab /api/fetch-daraz GREEN hai!</p>
      </div>
    </div>
  );
}
