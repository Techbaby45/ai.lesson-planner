"use client"
import { useEffect, useState } from "react"

export default function TopicSelector({ onTopicSelect }) {
  const [topics, setTopics] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedTerm, setSelectedTerm] = useState("")
  const [selectedTopic, setSelectedTopic] = useState(null)

  useEffect(() => {
    fetch("http://127.0.0.1:8000/topics")
      .then(res => res.json())
      .then(data => {
        setTopics(data.topics)
        setLoading(false)
      })
      .catch(err => {
        console.error("Failed to load topics:", err)
        setLoading(false)
      })
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

  if (loading) return <p className="text-gray-500">Loading topics...</p>

  return (
    <div className="space-y-4">
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

      {selectedTopic && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-2">
          <p className="text-xs font-semibold text-blue-800 mb-1">Auto-populated from ECZ Syllabus:</p>
          <p className="text-xs text-blue-700"><span className="font-semibold">Lesson Goal:</span> {selectedTopic.lesson_goal}</p>
          <p className="text-xs text-blue-700 mt-1"><span className="font-semibold">Prior Knowledge:</span> {selectedTopic.prior_knowledge}</p>
        </div>
      )}
    </div>
  )
}