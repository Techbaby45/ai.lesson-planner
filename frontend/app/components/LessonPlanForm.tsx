'use client';

import { useState, useEffect } from 'react';

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8000';

interface Term {
  module_id: number;
  term_number: number;
  term_name: string;
}

interface Topic {
  topic_id: number;
  topic_name: string;
  sub_topic: string;
}

interface TopicDetail extends Topic {
  general_competences: string;
  specific_competences: string;
  lesson_goal: string;
  rationale: string;
  prior_knowledge: string;
  references: string;
  expected_standard: string;
}

export default function LessonPlanForm({ 
  onPlanGenerated, 
  onBack 
}: { 
  onPlanGenerated: (plan: any) => void;
  onBack: () => void;
}) {
  const [terms, setTerms] = useState<Term[]>([]);
  const [topics, setTopics] = useState<Topic[]>([]);
  const [selectedTerm, setSelectedTerm] = useState<number | null>(null);
  const [selectedTopic, setSelectedTopic] = useState<number | null>(null);
  const [topicDetail, setTopicDetail] = useState<TopicDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);

  const [formData, setFormData] = useState({
    teacher_name: '',
    class_name: '',
    date_of_lesson: new Date().toISOString().split('T')[0],
    duration: 45,
    no_of_learners: 35,
    learning_environment: 'classroom',
    teaching_materials: 'textbook,whiteboard,chalk'
  });

  // Fetch terms on mount
  useEffect(() => {
    fetchTerms();
  }, []);

  // Fetch topics when term is selected
  useEffect(() => {
    if (selectedTerm) {
      fetchTopics(selectedTerm);
    }
  }, [selectedTerm]);

  // Fetch topic details when topic is selected
  useEffect(() => {
    if (selectedTopic) {
      fetchTopicDetail(selectedTopic);
    }
  }, [selectedTopic]);

  const fetchTerms = async () => {
    try {
      const response = await fetch(`${BACKEND_URL}/api/terms`);
      const data = await response.json();
      setTerms(data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching terms:', error);
      setLoading(false);
    }
  };

  const fetchTopics = async (termId: number) => {
    try {
      const response = await fetch(`${BACKEND_URL}/api/topics/${termId}`);
      const data = await response.json();
      setTopics(data);
      setSelectedTopic(null);
      setTopicDetail(null);
    } catch (error) {
      console.error('Error fetching topics:', error);
    }
  };

  const fetchTopicDetail = async (topicId: number) => {
    try {
      const response = await fetch(`${BACKEND_URL}/api/topic/${topicId}`);
      const data = await response.json();
      setTopicDetail(data);
    } catch (error) {
      console.error('Error fetching topic detail:', error);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name.includes('duration') || name.includes('no_of_learners') ? parseInt(value) : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedTopic) {
      alert('Please select a topic');
      return;
    }

    setGenerating(true);

    try {
      // Step 1: Save teacher input
      const inputResponse = await fetch(`${BACKEND_URL}/api/save-teacher-input`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topic_id: selectedTopic,
          name_of_teacher: formData.teacher_name,
          class_name: formData.class_name,
          date_of_lesson: formData.date_of_lesson,
          duration: formData.duration,
          no_of_learners: formData.no_of_learners,
          learning_environment: formData.learning_environment,
          teaching_materials: formData.teaching_materials
        })
      });

      const inputData = await inputResponse.json();
      
      if (!inputData.input_id) {
        throw new Error('Failed to save teacher input');
      }

      // Step 2: Generate lesson plan
      const planResponse = await fetch(`${BACKEND_URL}/api/generate-lesson-plan/${inputData.input_id}`, {
        method: 'POST'
      });

      const planData = await planResponse.json();

      if (planData.status === 'success') {
        onPlanGenerated({
          plan_id: planData.plan_id,
          input_id: planData.input_id,
          topic_detail: topicDetail,
          form_data: formData,
          lesson_plan: planData.lesson_plan
        });
      } else {
        alert('Error: ' + planData.message);
      }
    } catch (error) {
      console.error('Error generating lesson plan:', error);
      alert('Failed to generate lesson plan. Make sure your backend is running and Gemini API key is configured.');
    } finally {
      setGenerating(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-lg">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4">
      <div className="max-w-3xl mx-auto">
        <button
          onClick={onBack}
          className="mb-6 text-blue-600 hover:text-blue-800 font-semibold"
        >
          ← Back to Home
        </button>

        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">
            Create a Lesson Plan
          </h1>

          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* Step 1: Select Term */}
            <div className="border-b pb-6">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">Step 1: Select Term</h2>
              <select
                value={selectedTerm || ''}
                onChange={(e) => setSelectedTerm(parseInt(e.target.value))}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Choose a Term...</option>
                {terms.map(term => (
                  <option key={term.module_id} value={term.module_id}>
                    {term.term_name}
                  </option>
                ))}
              </select>
            </div>

            {/* Step 2: Select Topic */}
            {selectedTerm && (
              <div className="border-b pb-6">
                <h2 className="text-lg font-semibold text-gray-800 mb-4">Step 2: Select Topic</h2>
                <select
                  value={selectedTopic || ''}
                  onChange={(e) => setSelectedTopic(parseInt(e.target.value))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Choose a Topic...</option>
                  {topics.map(topic => (
                    <option key={topic.topic_id} value={topic.topic_id}>
                      {topic.topic_name} - {topic.sub_topic}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Display Topic Details */}
            {topicDetail && (
              <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded mb-6">
                <h3 className="font-bold text-gray-900 mb-2">{topicDetail.topic_name}</h3>
                <p className="text-sm text-gray-700"><strong>Sub-topic:</strong> {topicDetail.sub_topic}</p>
                <p className="text-sm text-gray-700 mt-2"><strong>Lesson Goal:</strong> {topicDetail.lesson_goal}</p>
                <p className="text-sm text-gray-700 mt-2"><strong>Specific Competences:</strong> {topicDetail.specific_competences}</p>
              </div>
            )}

            {/* Step 3: Teacher Information */}
            {selectedTopic && (
              <div className="border-b pb-6">
                <h2 className="text-lg font-semibold text-gray-800 mb-4">Step 3: Teacher Information</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Your Name
                    </label>
                    <input
                      type="text"
                      name="teacher_name"
                      value={formData.teacher_name}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Class (e.g., 1A, 1B)
                    </label>
                    <input
                      type="text"
                      name="class_name"
                      value={formData.class_name}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Date of Lesson
                    </label>
                    <input
                      type="date"
                      name="date_of_lesson"
                      value={formData.date_of_lesson}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Duration (minutes)
                    </label>
                    <input
                      type="number"
                      name="duration"
                      value={formData.duration}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Number of Learners
                    </label>
                    <input
                      type="number"
                      name="no_of_learners"
                      value={formData.no_of_learners}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Learning Environment
                    </label>
                    <select
                      name="learning_environment"
                      value={formData.learning_environment}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="classroom">Classroom</option>
                      <option value="online">Online</option>
                      <option value="hybrid">Hybrid</option>
                    </select>
                  </div>
                </div>

                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Available Teaching Materials (comma-separated)
                  </label>
                  <textarea
                    name="teaching_materials"
                    value={formData.teaching_materials}
                    onChange={handleInputChange}
                    rows={2}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="e.g., textbook, whiteboard, projector, calculator"
                  />
                </div>
              </div>
            )}

            {/* Submit Button */}
            {selectedTopic && (
              <button
                type="submit"
                disabled={generating}
                className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-bold py-3 px-4 rounded-lg transition"
              >
                {generating ? 'Generating Lesson Plan...' : 'Generate Lesson Plan with AI'}
              </button>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}
