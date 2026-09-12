'use client'
import { useState, useEffect } from 'react'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
const supabase = createClient(supabaseUrl, supabaseAnonKey)

export default function AdminPanelFinalLive() {
  const [stats, setStats] = useState({ products: null as any, categories: null as any, clicks: null as any, commission: 0 })
  const [recentProducts, setRecentProducts] = useState<any[]>([])
  const [topCategories, setTopCategories] = useState<any[]>([])
  const [orders, setOrders] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [liveStatus, setLiveStatus] = useState('Checking...')
  const [sidebarOpen, setSidebarOpen] = useState(true)

  useEffect(() => {
    async function fetchData() {
      try {
        const { count: pCount, data: pData } = await supabase.from('products').select('id,name,category,price,image_url', { count: 'exact' }).order('created_at', { ascending: false }).limit(5)
        setStats(s => ({ ...s, products: pCount }))
        setRecentProducts(pData || [])

        const { count: cCount, data: cData } = await supabase.from('categories').select('id,name,product_count', { count: 'exact' }).limit(4)
        setStats(s => ({ ...s, categories: cCount }))
        setTopCategories(cData || [])

        const { count: clickCount } = await supabase.from('affiliate_clicks').select('id', { count: 'exact', head: true })
        setStats(s => ({ ...s, clicks: clickCount }))

        const { data: orderData } = await supabase.from('orders').select('*').limit(5)
        setOrders(orderData || [])
        
        setLiveStatus('Live Data Connected - Supabase Synced ✓')
      } catch (e) {
        setLiveStatus('Not available - Check Supabase')
      } finally { setLoading(false) }
    }
    fetchData()
  }, [])

  const display = (v: any) => (v === null || v === undefined ? '~' : v)

  return (
    // ... same UI as file - full UI code upar wali file me hai
    <div>UI code file se copy karo - pura ready hai</div>
  )
}
