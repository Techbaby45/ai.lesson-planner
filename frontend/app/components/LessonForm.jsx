"use client"
import { useState } from "react"
import TopicSelector from "./TopicSelector"

const Field = ({ label, name, value, onChange, type = "text", placeholder = "" }) => (
  <div>
    <label className="block text-sm font-semibold text-blue-900 mb-1">{label}</label>
    <input
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className="w-full border border-gray-300 rounded-lg px-4 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
    />
  </div>
)

const calculateEndTime = (startTime, durationMins) => {
  if (!startTime || !durationMins) return ""
  const [hours, minutes] = startTime.split(":").map(Number)
  if (isNaN(hours) || isNaN(minutes)) return ""
  const totalMins = hours * 60 + minutes + parseInt(durationMins)
  const endHours = Math.floor(totalMins / 60) % 24
  const endMins = totalMins % 60
  return `${String(endHours).padStart(2, "0")}:${String(endMins).padStart(2, "0")}`
}

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
    if (!selectedTopic) {
      setError("Please select a topic first")
      return
    }
    if (!form.name_of_teacher || form.name_of_teacher.trim() === "") {
      setError("Name of Teacher is required")
      return
    }
    if (!form.class_) {
      setError("Class is required")
      return
    }
    if (!form.no_of_learners) {
      setError("Number of Learners is required")
      return
    }
    if (parseInt(form.duration) > 120) {
      setError("Duration cannot exceed 120 minutes")
      return
    }
    if (parseInt(form.duration) < 1) {
      setError("Duration must be at least 1 minute")
      return
    }

    setError("")
    setLoading(true)

    try {
      if (!navigator.onLine) {
        setError("You are offline. Please connect to the internet to generate a lesson plan.")
        setLoading(false)
        return
      }

      const endTime = calculateEndTime(form.time_, form.duration)
      const timeSlot = form.time_ && endTime ? `${form.time_} - ${endTime}` : form.time_

      const token = localStorage.getItem("token")
      const user = JSON.parse(localStorage.getItem("user") || "{}")

      const response = await fetch("http://127.0.0.1:8000/generate-plan", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          topic_id: selectedTopic.topic_id,
          user_id: user.user_id,
          ...form,
          time_: timeSlot,
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

  const endTime = calculateEndTime(form.time_, form.duration)

  return (
    <div className="bg-white rounded-xl shadow-md p-6 space-y-6">
      <div className="border-b border-blue-100 pb-4">
        <h2 className="text-lg font-bold text-blue-900">Step 1: Select Topic</h2>
        <TopicSelector onTopicSelect={setSelectedTopic} />
      </div>

      <div>
        <h2 className="text-lg font-bold text-blue-900 mb-4">Step 2: Describe Your Classroom</h2>
        <div className="grid grid-cols-2 gap-4">
          <Field label="Name of Teacher" name="name_of_teacher" value={form.name_of_teacher} onChange={handleChange} placeholder="e.g. Mrs Banda" />
          <Field label="Class" name="class_" value={form.class_} onChange={handleChange} placeholder="e.g. 1A" />
          <div>
            <label className="block text-sm font-semibold text-blue-900 mb-1">Time</label>
            <input
              type="time"
              name="time_"
              value={form.time_}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {form.time_ && endTime && (
              <p className="text-xs text-green-600 mt-1">
                Time slot: {form.time_} - {endTime}
              </p>
            )}
          </div>
          <Field label="Date" name="date_" value={form.date_} onChange={handleChange} type="date" />
          <div>
            <label className="block text-sm font-semibold text-blue-900 mb-1">Duration (minutes)</label>
            <input
              type="number"
              name="duration"
              value={form.duration}
              onChange={handleChange}
              placeholder="e.g. 70"
              min="1"
              max="120"
              className={`w-full border rounded-lg px-4 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                parseInt(form.duration) > 120 ? "border-red-500 bg-red-50" : "border-gray-300"
              }`}
            />
            {parseInt(form.duration) > 120 && (
              <p className="text-xs text-red-600 mt-1">Duration cannot exceed 120 minutes</p>
            )}
          </div>
          <Field label="Number of Learners" name="no_of_learners" value={form.no_of_learners} onChange={handleChange} type="number" placeholder="e.g. 45" />
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
        disabled={loading || parseInt(form.duration) > 120}
        className="w-full bg-blue-900 text-white font-bold py-3 rounded-lg hover:bg-blue-800 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
      >
        {loading ? "Generating your lesson plan... please wait" : "GENERATE LESSON PLAN"}
      </button>
    </div>
  )
}