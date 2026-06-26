"use client"
import { useState } from "react"
import LessonForm from "./components/LessonForm"
import LessonPlanDisplay from "./components/LessonPlanDisplay"

export default function Home() {
  const [generatedPlan, setGeneratedPlan] = useState(null)

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