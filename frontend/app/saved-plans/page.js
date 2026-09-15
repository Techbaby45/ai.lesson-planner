"use client"
import { useEffect, useState } from "react"
import Link from "next/link"
import LessonPlanDisplay from "../components/LessonPlanDisplay"
import { loadPlansOffline, loadSinglePlanOffline } from "../utils/offlineStore"

export default function SavedPlans() {
  const [plans, setPlans] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [selectedPlan, setSelectedPlan] = useState(null)
  const [loadingPlan, setLoadingPlan] = useState(false)
  const [isOffline, setIsOffline] = useState(false)

  useEffect(() => {
    const token = localStorage.getItem("token")
    if (!token) {
      window.location.href = "/login"
      return
    }

    const loadPlans = async () => {
      if (navigator.onLine) {
        try {
          const res = await fetch("http://127.0.0.1:8000/saved-plans", {
            headers: { "Authorization": `Bearer ${token}` }
          })
          const data = await res.json()
          setPlans(data.saved_plans || [])
          setIsOffline(false)
          setLoading(false)
          return
        } catch (err) {
          console.log("Online fetch failed, falling back to offline")
        }
      }

      try {
        const offlinePlans = await loadPlansOffline()
        setPlans(offlinePlans)
        setIsOffline(true)
        setLoading(false)
      } catch (err) {
        setError("Could not load saved plans.")
        setLoading(false)
      }
    }

    loadPlans()
  }, [])

  const openPlan = async (plan) => {
    setLoadingPlan(true)
    try {
      if (isOffline || plan.topic) {
        setSelectedPlan(plan)
        setLoadingPlan(false)
        return
      }

      const token = localStorage.getItem("token")
      const res = await fetch(`http://127.0.0.1:8000/saved-plans/${plan.plan_id}`, {
        headers: { "Authorization": `Bearer ${token}` }
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.detail || "Could not load plan")
      setSelectedPlan(data)
    } catch (err) {
      try {
        const offlinePlan = await loadSinglePlanOffline(plan.plan_id)
        if (offlinePlan) {
          setSelectedPlan(offlinePlan)
        } else {
          setError("Could not open plan: " + err.message)
        }
      } catch {
        setError("Could not open plan offline either.")
      }
    } finally {
      setLoadingPlan(false)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem("token")
    localStorage.removeItem("user")
    sessionStorage.removeItem("currentPlan")
    window.location.href = "/login"
  }

  const goToMain = () => {
    sessionStorage.removeItem("currentPlan")
    window.location.href = "/main"
  }

  if (selectedPlan) {
    return (
      <main className="min-h-screen bg-gray-100">
        <div className="bg-blue-900 text-white py-4 px-6 shadow-md">
          <div className="max-w-5xl mx-auto flex justify-between items-center">
            <h1 className="text-xl font-bold tracking-widest uppercase">LESSON PLANNER</h1>
            <button
              onClick={() => setSelectedPlan(null)}
              className="text-sm border border-blue-300 text-blue-100 px-4 py-1 rounded-lg hover:bg-blue-800"
            >
              ← Back to Saved Plans
            </button>
          </div>
        </div>
        <div className="max-w-5xl mx-auto p-6">
          <LessonPlanDisplay
            data={selectedPlan}
            onBack={() => setSelectedPlan(null)}
          />
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-gray-100">
      <div className="bg-blue-900 text-white py-4 px-6 shadow-md">
        <div className="max-w-5xl mx-auto flex justify-between items-center">
          <h1 className="text-xl font-bold tracking-widest uppercase">LESSON PLANNER</h1>
          <div className="flex items-center gap-3">
            <button
              onClick={goToMain}
              className="text-sm border border-blue-300 text-blue-100 px-4 py-1 rounded-lg hover:bg-blue-800">
              ← Back to Main
            </button>
            <button
              onClick={handleLogout}
              className="text-sm border border-red-300 text-red-200 px-4 py-1 rounded-lg hover:bg-red-800">
              Logout
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-blue-900">My Saved Lesson Plans</h2>
          <button
            onClick={goToMain}
            className="text-sm bg-blue-900 text-white px-4 py-2 rounded-lg hover:bg-blue-800">
            + New Plan
          </button>
        </div>

        {isOffline && (
          <div className="bg-yellow-50 border border-yellow-300 rounded-lg p-3 mb-4 text-yellow-800 text-sm">
            📴 You are offline. Showing plans saved on this device.
          </div>
        )}

        {loading && (
          <p className="text-gray-500 text-center py-8">Loading your saved plans...</p>
        )}

        {loadingPlan && (
          <p className="text-gray-500 text-center py-8">Opening plan...</p>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700 text-sm">
            {error}
          </div>
        )}

        {!loading && !error && plans.length === 0 && (
          <div className="bg-white rounded-xl shadow-sm p-8 text-center">
            <p className="text-gray-500 text-lg mb-2">No saved plans yet</p>
            <p className="text-gray-400 text-sm">
              {isOffline
                ? "No plans saved on this device yet. Generate a plan while online first."
                : "Generate your first lesson plan to see it here"}
            </p>
            <button
              onClick={goToMain}
              className="inline-block mt-4 bg-blue-900 text-white px-6 py-2 rounded-lg hover:bg-blue-800 text-sm">
              Generate a Plan
            </button>
          </div>
        )}

        {!loading && plans.length > 0 && (
          <div className="space-y-3">
            {plans.map((plan) => (
              <div key={plan.plan_id || plan.saved_at}
                className="bg-white rounded-xl shadow-sm p-4 border border-gray-100 hover:border-blue-200 transition-colors">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-bold text-blue-900 text-sm">{plan.topic_name}</p>
                    <p className="text-gray-600 text-xs mt-1">{plan.sub_topic}</p>
                    <div className="flex gap-4 mt-2">
                      <span className="text-xs text-gray-500">👤 {plan.name_of_teacher}</span>
                      <span className="text-xs text-gray-500">🏫 Class {plan.class_}</span>
                      <span className="text-xs text-gray-500">📅 {plan.date_}</span>
                    </div>
                  </div>
                  <div className="text-right flex flex-col items-end gap-2">
                    <span className="text-xs text-gray-400">
                      {new Date(plan.created_at || plan.saved_at).toLocaleDateString()}
                    </span>
                    {isOffline && (
                      <span className="text-xs text-yellow-600 font-semibold">📴 Offline</span>
                    )}
                    <button
                      onClick={() => openPlan(plan)}
                      className="text-xs bg-blue-900 text-white px-3 py-1 rounded-lg hover:bg-blue-800"
                    >
                      Open and Edit
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  )
}