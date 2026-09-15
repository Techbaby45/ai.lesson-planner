"use client"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import LessonForm from "../components/LessonForm"
import LessonPlanDisplay from "../components/LessonPlanDisplay"

export default function Main() {
  const router = useRouter()
  const [generatedPlan, setGeneratedPlan] = useState(null)
  const [user, setUser] = useState(null)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    const stored = localStorage.getItem("user")
    const token = localStorage.getItem("token")
    if (!stored || !token) {
      window.location.href = "/login"
      return
    }
    setUser(JSON.parse(stored))

    const savedPlan = sessionStorage.getItem("currentPlan")
    if (savedPlan) {
      try {
        setGeneratedPlan(JSON.parse(savedPlan))
      } catch (e) {
        sessionStorage.removeItem("currentPlan")
      }
    }
    setReady(true)
  }, [])

  const handlePlanGenerated = (plan) => {
    sessionStorage.setItem("currentPlan", JSON.stringify(plan))
    setGeneratedPlan(plan)
  }

  const handleBack = () => {
    sessionStorage.removeItem("currentPlan")
    setGeneratedPlan(null)
  }

  const handleLogout = () => {
    localStorage.removeItem("token")
    localStorage.removeItem("user")
    sessionStorage.removeItem("currentPlan")
    window.location.href = "/login"
  }

  if (!ready) {
    return (
      <main className="min-h-screen bg-gray-100 flex items-center justify-center">
        <p className="text-gray-400 text-sm">Loading...</p>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-gray-100">
      <div className="bg-blue-900 text-white py-4 px-6 shadow-md">
        <div className="max-w-5xl mx-auto flex justify-between items-center">
          <h1 className="text-xl font-bold tracking-widest uppercase">
            LESSON PLANNER
          </h1>
          <div className="flex items-center gap-4">
            <span className="text-blue-200 text-sm">
              👤 {user?.name}
            </span>
            <a href="/saved-plans"
              className="text-sm border border-blue-300 text-blue-100 px-4 py-1 rounded-lg hover:bg-blue-800">
              📋 Saved Plans
            </a>
            <button
              onClick={handleLogout}
              className="text-sm border border-red-300 text-red-200 px-4 py-1 rounded-lg hover:bg-red-800">
              Logout
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto p-6">
        {!generatedPlan ? (
          <LessonForm onPlanGenerated={handlePlanGenerated} />
        ) : (
          <LessonPlanDisplay
            data={generatedPlan}
            onBack={handleBack}
          />
        )}
      </div>
    </main>
  )
}