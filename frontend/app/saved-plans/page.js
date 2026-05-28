"use client"
import { useEffect, useState } from "react"
import Link from "next/link"

export default function SavedPlans() {
  const [plans, setPlans] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    fetch("http://127.0.0.1:8000/saved-plans")
      .then(res => res.json())
      .then(data => {
        setPlans(data.saved_plans)
        setLoading(false)
      })
      .catch(() => {
        setError("Could not load saved plans. Make sure the backend is running.")
        setLoading(false)
      })
  }, [])

  return (
    <main className="min-h-screen bg-gray-100">
     <div className="bg-blue-900 text-white py-4 px-6 shadow-md">
  <div className="max-w-5xl mx-auto flex justify-between items-center">
    <h1 className="text-xl font-bold tracking-widest uppercase">
      LESSON PLANNER
    </h1>
    <a href="/saved-plans"
      className="text-sm border border-blue-300 text-blue-100 px-4 py-1 rounded-lg hover:bg-blue-800">
      📋 Saved Plans
    </a>
  </div>
</div>

      <div className="max-w-4xl mx-auto p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-blue-900">Saved Lesson Plans</h2>
          <Link href="/"
            className="text-sm bg-blue-900 text-white px-4 py-2 rounded-lg hover:bg-blue-800">
            + New Plan
          </Link>
        </div>

        {loading && (
          <p className="text-gray-500 text-center py-8">Loading saved plans...</p>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700 text-sm">
            {error}
          </div>
        )}

        {!loading && !error && plans.length === 0 && (
          <div className="bg-white rounded-xl shadow-sm p-8 text-center">
            <p className="text-gray-500 text-lg mb-2">No saved plans yet</p>
            <p className="text-gray-400 text-sm">Generate your first lesson plan to see it here</p>
            <Link href="/"
              className="inline-block mt-4 bg-blue-900 text-white px-6 py-2 rounded-lg hover:bg-blue-800 text-sm">
              Generate a Plan
            </Link>
          </div>
        )}

        {!loading && plans.length > 0 && (
          <div className="space-y-3">
            {plans.map((plan) => (
              <div key={plan.plan_id}
                className="bg-white rounded-xl shadow-sm p-4 border border-gray-100 hover:border-blue-200 transition-colors">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-bold text-blue-900 text-sm">{plan.topic_name}</p>
                    <p className="text-gray-600 text-xs mt-1">{plan.sub_topic}</p>
                    <div className="flex gap-4 mt-2">
                      <span className="text-xs text-gray-500">
                        👤 {plan.name_of_teacher}
                      </span>
                      <span className="text-xs text-gray-500">
                        🏫 Class {plan.class_}
                      </span>
                      <span className="text-xs text-gray-500">
                        📅 {plan.date_}
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-xs text-gray-400">
                      {new Date(plan.created_at).toLocaleDateString()}
                    </span>
                    <p className="text-xs text-blue-600 mt-1 font-semibold">
                      Plan #{plan.plan_id}
                    </p>
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