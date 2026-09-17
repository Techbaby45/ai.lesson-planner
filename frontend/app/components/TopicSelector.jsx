"use client"
import { useEffect, useState } from "react"
import { saveTopicsOffline, loadTopicsOffline } from "../utils/offlineStore"

export default function TopicSelector({ onTopicSelect }) {
  const [topics, setTopics] = useState([])
  const [loading, setLoading] = useState(true)
  const [offline, setOffline] = useState(false)
  const [selectedTerm, setSelectedTerm] = useState("")
  const [selectedTopic, setSelectedTopic] = useState(null)

  useEffect(() => {
    async function loadTopics() {
      try {
        const res = await fetch("http://127.0.0.1:8000/topics")
        if (!res.ok) throw new Error("Server error")
        const data = await res.json()
        setTopics(data.topics)
        setOffline(false)
        await saveTopicsOffline(data.topics)
      } catch (err) {
        console.log("Backend unavailable, loading offline topics...")
        const offlineTopics = await loadTopicsOffline()
        if (offlineTopics.length > 0) {
          setTopics(offlineTopics)
          setOffline(true)
        }
      } finally {
        setLoading(false)
      }
    }
    loadTopics()
  }, [])

  const terms = [...new Set(topics.map(t => t.term_name))].sort()
  const filteredTopics = selectedTerm
    ? topics.filter(t => t.term_name === selectedTerm)
    : []

  const handleTopicChange = (e) => {
    const topic = topics.find(t => t.topic_id === parseInt(e.target.value))
    setSelectedTopic(topic)
    if (topic) onTopicSelect(topic)
  }

  if (loading) {
    return (
      <div className="flex items-center gap-2 text-gray-500 py-2">
        <div className="animate-spin h-4 w-4 border-2 border-blue-500 border-t-transparent rounded-full"></div>
        <p className="text-sm">Loading topics...</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {offline && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg px-3 py-2 flex items-center gap-2">
          <span className="text-yellow-600 text-sm">⚠️</span>
          <p className="text-yellow-700 text-xs">
            You are offline. Showing saved syllabus data. Plan generation requires internet.
          </p>
        </div>
      )}

      <div>
        <label className="block text-sm font-semibold text-blue-900 mb-1">
          Select Term
        </label>
        <select
          className="w-full border border-gray-300 rounded-lg px-4 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={selectedTerm}
          onChange={e => { setSelectedTerm(e.target.value); setSelectedTopic(null) }}
        >
          <option value="">-- Select a Term --</option>
          {terms.map(term => (
            <option key={term} value={term}>{term}</option>
          ))}
        </select>
      </div>

      {selectedTerm && (
        <div>
          <label className="block text-sm font-semibold text-blue-900 mb-1">
            Select Topic
          </label>
          <select
            className="w-full border border-gray-300 rounded-lg px-4 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            onChange={handleTopicChange}
            defaultValue=""
          >
            <option value="">-- Select a Topic --</option>
            {filteredTopics.map(topic => (
              <option key={topic.topic_id} value={topic.topic_id}>
                {topic.topic_name} — {topic.sub_topic}
              </option>
            ))}
          </select>
        </div>
      )}

    </div>
  )
}