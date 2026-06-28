"use client"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import LessonForm from "./components/LessonForm"
import LessonPlanDisplay from "./components/LessonPlanDisplay"

export default function Home() {
  const router = useRouter()
  const [generatedPlan, setGeneratedPlan] = useState(null)
  const [user, setUser] = useState(null)
  const [checking, setChecking] = useState(true)

  useEffect(() => {
    const stored = localStorage.getItem("user")
    const token = localStorage.getItem("token")
    if (!stored || !token) {
      router.push("/login")
    } else {
      setUser(JSON.parse(stored))
      setChecking(false)
    }
  }, [])

  const handleLogout = () => {
    localStorage.removeItem("token")
    localStorage.removeItem("user")
    router.push("/login")
  }

  if (checking) {
    return (
      <main className="min-h-screen bg-gray-100 flex items-center justify-center">
        <p className="text-gray-500">Loading...</p>
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
          <LessonForm onPlanGenerated={setGeneratedPlan} />
        ) : (
          <LessonPlanDisplay
            data={generatedPlan}
            onBack={() => setGeneratedPlan(null)}
          />
        )}
      </div>
    </main>
  )
}
