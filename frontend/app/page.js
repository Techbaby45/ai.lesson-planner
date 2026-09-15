"use client"
import { useEffect } from "react"
import { useRouter } from "next/navigation"

export default function Home() {
  const router = useRouter()
  useEffect(() => {
    localStorage.removeItem("token")
    localStorage.removeItem("user")
    sessionStorage.removeItem("currentPlan")
    router.push("/login")
  }, [])
  return null
}