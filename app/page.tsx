"use client"
import { useState, useEffect } from "react"
import { supabase } from "@/lib/supabaseClient"
import Link from "next/link"

type Product = {
  id: number
  name: string
  image_url: string
  images?: string[]
  price: number
  price_original: number
  price_discounted: number
  affiliate_link: string
  rating: number
  reviews_count: number
  live_views: number
  stock: number
  category: string
}

function ReviewsBox({ productId }: { productId: number }) {
  const [reviews, setReviews] = useState<any[]>([])
  const [name, setName] = useState("")
  const [rating, setRating] = useState(5)
  const [comment, setComment] = useState("")
  const [loading, setLoading] = useState(false)

  const loadReviews = async () => {
    const { data } = await supabase.from("reviews").select("*").eq("product_id", productId).order("created_at", { ascending: false })
    if (data) setReviews(data)
  }
  useEffect(() => { loadReviews() }, [productId])

  const submitReview = async () => {
    if (!name ||!comment) return alert("Naam aur Review likhna zaroori hai")
    setLoading(true)
    const { error } = await supabase.from("reviews").insert({ product_id: productId, customer_name: name, rating, comment })
    setLoading(false)
    if (!error)
