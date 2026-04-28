"use client"
import { useState } from "react"
import TopicSelector from "./TopicSelector"

export default function LessonForm({ onPlanGenerated }) {
  const [selectedTopic, setSelectedTopic] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [form, setForm] = useState({
    name_of_teacher: "",
    class_: "",
    time_: "",
    date_: "",
    duration: "70",
    no_of_learners: "",
    natural_environment: "Classroom",
    artificial_environment: "Chalkboard",
    technological_environment: "None",
    teaching_materials: "Mathematics Pupils Book 1, Chalk, Exercise books"
  })

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async () => {
    if (!selectedTopic) { setError("Please select a topic first"); return }
    if (!form.name_of_teacher || !form.class_ || !form.no_of_learners) {
      setError("Please fill in Name of Teacher, Class, and Number of Learners")
      return
    }
    setError("")
    setLoading(true)
    try {
      const response = await fetch("http://127.0.0.1:8000/generate-plan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          topic_id: selectedTopic.topic_id,
          ...form,
          no_of_learners: parseInt(form.no_of_learners)
        })
      })
      const data = await response.json()
      if (!response.ok) throw new Error(data.detail || "Generation failed")
      onPlanGenerated(data)
    } catch (err) {
      setError("Error: " + err.message)
    } finally {
      setLoading(false)
    }
  }

  const Field = ({ label, name, type = "text", placeholder = "" }) => (
    <div>
      <label className="block text-sm font-semibold text-blue-900 mb-1">{label}</label>
      <input
        type={type}
        name={name}
        value={form[name]}
        onChange={handleChange}
        placeholder={placeholder}
        className="w-full border border-gray-300 rounded-lg px-4 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
    </div>
  )

  return (
    <div className="bg-white rounded-xl shadow-md p-6 space-y-6">
      <div className="border-b border-blue-100 pb-4">
        <h2 className="text-lg font-bold text-blue-900">Step 1: Select Topic</h2>
        <TopicSelector onTopicSelect={setSelectedTopic} />
      </div>

      <div>
        <h2 className="text-lg font-bold text-blue-900 mb-4">Step 2: Describe Your Classroom</h2>
        <div className="grid grid-cols-2 gap-4">
          <Field label="Name of Teacher" name="name_of_teacher" placeholder="e.g. Mrs Banda" />
          <Field label="Class" name="class_" placeholder="e.g. 1A" />
          <Field label="Time" name="time_" placeholder="e.g. 07:30" />
          <Field label="Date" name="date_" type="date" />
          <Field label="Duration (minutes)" name="duration" placeholder="e.g. 70" />
          <Field label="Number of Learners" name="no_of_learners" type="number" placeholder="e.g. 45" />
        </div>

        <div className="mt-4 space-y-3">
          <div>
            <label className="block text-sm font-semibold text-blue-900 mb-1">Natural Environment</label>
            <input name="natural_environment" value={form.natural_environment} onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          <div>
            <label className="block text-sm font-semibold text-blue-900 mb-1">Artificial Environment</label>
            <input name="artificial_environment" value={form.artificial_environment} onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          <div>
            <label className="block text-sm font-semibold text-blue-900 mb-1">Technological Environment</label>
            <input name="technological_environment" value={form.technological_environment} onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          <div>
            <label className="block text-sm font-semibold text-blue-900 mb-1">Teaching and Learning Materials</label>
            <textarea name="teaching_materials" value={form.teaching_materials} onChange={handleChange} rows={2}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
        </div>
      </div>

      {error && <p className="text-red-600 text-sm font-semibold">{error}</p>}

      <button
        onClick={handleSubmit}
        disabled={loading}
        className="w-full bg-blue-900 text-white font-bold py-3 rounded-lg hover:bg-blue-800 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
      >
        {loading ? "Generating your lesson plan... please wait" : "GENERATE LESSON PLAN"}
      </button>
    </div>
  )
}