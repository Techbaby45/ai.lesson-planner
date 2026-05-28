"use client"
import { useState } from "react"
import LessonForm from "./components/LessonForm"
import LessonPlanDisplay from "./components/LessonPlanDisplay"

export default function Home() {
  const [generatedPlan, setGeneratedPlan] = useState(null)

  return (
    <main className="min-h-screen bg-gray-100">
      <div className="bg-blue-900 text-white py-4 px-6 shadow-md">
       <h1 className="text-xl font-bold text-center tracking-widest uppercase">
  LESSON PLANNER
</h1>
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