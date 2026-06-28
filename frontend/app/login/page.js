"use client"
import { useState } from "react"
import { useRouter } from "next/navigation"

export default function Login() {
  const router = useRouter()
  const [showAuth, setShowAuth] = useState(false)
  const [isRegister, setIsRegister] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [form, setForm] = useState({ name: "", department: "", password: "" })

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async () => {
    if (!form.name || !form.password) {
      setError("Please fill in all required fields")
      return
    }
    if (isRegister && !form.department) {
      setError("Please enter your department")
      return
    }
    setError("")
    setLoading(true)

    try {
      const endpoint = isRegister ? "/register" : "/login"
      const body = isRegister
        ? { name: form.name, department: form.department, password: form.password }
        : { name: form.name, password: form.password }

      const res = await fetch(`http://127.0.0.1:8000${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body)
      })

      const data = await res.json()
      if (!res.ok) throw new Error(data.detail || "Something went wrong")

      localStorage.setItem("token", data.token)
      localStorage.setItem("user", JSON.stringify(data.user))
      router.push("/")
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  // ── LANDING PAGE ──────────────────────────────────────────────────────────
  if (!showAuth) {
    return (
      <main className="min-h-screen bg-blue-900">

        {/* Hero Section */}
        <div className="flex flex-col items-center justify-center min-h-screen px-6 text-center">
          <div className="max-w-2xl">

            {/* Logo / Title */}
            <div className="mb-8">
              <h1 className="text-4xl font-bold text-white tracking-widest uppercase mb-3">
                LESSON PLANNER
              </h1>
              <div className="h-1 w-24 bg-blue-400 mx-auto rounded"></div>
            </div>

            {/* Tagline */}
            <p className="text-xl text-blue-100 mb-4 leading-relaxed">
              AI-Powered Lesson Planning for Zambian Secondary School Mathematics Teachers
            </p>
            <p className="text-blue-200 text-sm mb-12 leading-relaxed">
              Generate complete, official lesson plans aligned to the ECZ Mathematics I Syllabus
              in seconds. Save time. Teach better.
            </p>

            {/* Feature cards */}
            <div className="grid grid-cols-3 gap-4 mb-12">
              <div className="bg-blue-800 rounded-xl p-4">
                <p className="text-2xl mb-2">📚</p>
                <p className="text-white font-semibold text-sm mb-1">ECZ Aligned</p>
                <p className="text-blue-300 text-xs">Built on the official Mathematics I Syllabus</p>
              </div>
              <div className="bg-blue-800 rounded-xl p-4">
                <p className="text-2xl mb-2">⚡</p>
                <p className="text-white font-semibold text-sm mb-1">Instant Plans</p>
                <p className="text-blue-300 text-xs">Full 2-page lesson plan in under 30 seconds</p>
              </div>
              <div className="bg-blue-800 rounded-xl p-4">
                <p className="text-2xl mb-2">📄</p>
                <p className="text-white font-semibold text-sm mb-1">PDF Export</p>
                <p className="text-blue-300 text-xs">Download the official Zambian template format</p>
              </div>
            </div>

            {/* Buttons */}
            <div className="flex gap-4 justify-center">
              <button
                onClick={() => { setShowAuth(true); setIsRegister(false) }}
                className="bg-white text-blue-900 font-bold px-8 py-3 rounded-lg hover:bg-blue-50 transition-colors text-sm"
              >
                Login
              </button>
              <button
                onClick={() => { setShowAuth(true); setIsRegister(true) }}
                className="bg-blue-500 text-white font-bold px-8 py-3 rounded-lg hover:bg-blue-400 transition-colors text-sm"
              >
                Get Started — Register
              </button>
            </div>

            <p className="text-blue-400 text-xs mt-8">
              Copperbelt University — Final Year Project 2025/2026
            </p>
          </div>
        </div>

      </main>
    )
  }

  // ── LOGIN / REGISTER FORM ─────────────────────────────────────────────────
  return (
    <main className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-md">

        <div className="text-center mb-8">
          <button
            onClick={() => setShowAuth(false)}
            className="text-blue-600 text-sm mb-4 hover:underline"
          >
            ← Back to Home
          </button>
          <h1 className="text-2xl font-bold text-blue-900 tracking-widest uppercase">
            LESSON PLANNER
          </h1>
          <p className="text-gray-500 text-sm mt-2">
            Zambian Secondary School Mathematics
          </p>
        </div>

        <div className="flex mb-6 border border-gray-200 rounded-lg overflow-hidden">
          <button
            onClick={() => { setIsRegister(false); setError("") }}
            className={`flex-1 py-2 text-sm font-semibold transition-colors ${
              !isRegister ? "bg-blue-900 text-white" : "bg-white text-gray-600 hover:bg-gray-50"
            }`}
          >
            Login
          </button>
          <button
            onClick={() => { setIsRegister(true); setError("") }}
            className={`flex-1 py-2 text-sm font-semibold transition-colors ${
              isRegister ? "bg-blue-900 text-white" : "bg-white text-gray-600 hover:bg-gray-50"
            }`}
          >
            Register
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-blue-900 mb-1">
              Full Name
            </label>
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="e.g. Mrs Banda"
              className="w-full border border-gray-300 rounded-lg px-4 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {isRegister && (
            <div>
              <label className="block text-sm font-semibold text-blue-900 mb-1">
                Department
              </label>
              <input
                name="department"
                value={form.department}
                onChange={handleChange}
                placeholder="e.g. Mathematics Department"
                className="w-full border border-gray-300 rounded-lg px-4 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          )}

          <div>
            <label className="block text-sm font-semibold text-blue-900 mb-1">
              Password
            </label>
            <input
              name="password"
              type="password"
              value={form.password}
              onChange={handleChange}
              placeholder="Enter your password"
              className="w-full border border-gray-300 rounded-lg px-4 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {error && (
            <p className="text-red-600 text-sm font-semibold">{error}</p>
          )}

          <button
            onClick={handleSubmit}
            disabled={loading}
            className="w-full bg-blue-900 text-white font-bold py-3 rounded-lg hover:bg-blue-800 disabled:bg-gray-400 transition-colors"
          >
            {loading ? "Please wait..." : isRegister ? "Create Account" : "Login"}
          </button>
        </div>

        <p className="text-center text-xs text-gray-400 mt-6">
          AI-Powered Lesson Planner — CBU Final Year Project 2025/2026
        </p>
      </div>
    </main>
  )
}