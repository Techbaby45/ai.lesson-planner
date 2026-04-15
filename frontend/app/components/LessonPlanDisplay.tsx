'use client';

import { useState } from 'react';
import { exportToPDF } from '../utils/pdfExport';

interface LessonPlanDisplayProps {
  plan: any;
  onBack: () => void;
}

export default function LessonPlanDisplay({ plan, onBack }: LessonPlanDisplayProps) {
  const [editingSection, setEditingSection] = useState<string | null>(null);
  const [editedContent, setEditedContent] = useState('');
  const [isExporting, setIsExporting] = useState(false);

  const handleEditSection = (section: string, content: string) => {
    setEditingSection(section);
    setEditedContent(content);
  };

  const handleSaveEdit = () => {
    // In a real app, this would save to the database
    setEditingSection(null);
  };

  const handleExportPDF = async () => {
    setIsExporting(true);
    try {
      await exportToPDF(plan);
    } catch (error) {
      console.error('Error exporting PDF:', error);
      alert('Failed to export PDF');
    } finally {
      setIsExporting(false);
    }
  };

  const Section = ({ title, data }: { title: string; data: any }) => (
    <div className="bg-white rounded-lg shadow p-6 mb-4">
      <h3 className="text-xl font-bold text-gray-900 mb-4">{title}</h3>
      
      <div className="space-y-3">
        {Object.entries(data).map(([key, value]) => (
          <div key={key} className="border-l-4 border-blue-500 pl-4">
            <h4 className="font-semibold text-gray-800 capitalize">
              {key.replace(/_/g, ' ')}
            </h4>
            <p className="text-gray-700 mt-1 whitespace-pre-wrap">
              {String(value)}
            </p>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <button
            onClick={onBack}
            className="text-blue-600 hover:text-blue-800 font-semibold"
          >
            ← Back to Form
          </button>
          <button
            onClick={handleExportPDF}
            disabled={isExporting}
            className="bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white font-bold py-2 px-6 rounded-lg transition"
          >
            {isExporting ? 'Exporting...' : 'Download as PDF'}
          </button>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-8 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div>
              <h2 className="text-sm font-semibold text-gray-600 mb-1">TOPIC</h2>
              <p className="text-2xl font-bold text-gray-900">
                {plan.topic_detail.topic_name}
              </p>
              <p className="text-gray-600 mt-1">{plan.topic_detail.sub_topic}</p>
            </div>
            
            <div className="bg-blue-50 rounded-lg p-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-gray-600 font-semibold">Teacher</p>
                  <p className="text-gray-900">{plan.form_data.teacher_name}</p>
                </div>
                <div>
                  <p className="text-gray-600 font-semibold">Class</p>
                  <p className="text-gray-900">{plan.form_data.class_name}</p>
                </div>
                <div>
                  <p className="text-gray-600 font-semibold">Date</p>
                  <p className="text-gray-900">{plan.form_data.date_of_lesson}</p>
                </div>
                <div>
                  <p className="text-gray-600 font-semibold">Duration</p>
                  <p className="text-gray-900">{plan.form_data.duration} min</p>
                </div>
                <div>
                  <p className="text-gray-600 font-semibold">Learners</p>
                  <p className="text-gray-900">{plan.form_data.no_of_learners}</p>
                </div>
                <div>
                  <p className="text-gray-600 font-semibold">Environment</p>
                  <p className="text-gray-900 capitalize">{plan.form_data.learning_environment}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-indigo-50 border-l-4 border-indigo-500 p-4 rounded mb-6">
            <h3 className="font-bold text-gray-900 mb-2">Lesson Goal</h3>
            <p className="text-gray-700">{plan.topic_detail.lesson_goal}</p>
            
            <h3 className="font-bold text-gray-900 mt-3 mb-1">Specific Competences</h3>
            <p className="text-gray-700 text-sm">{plan.topic_detail.specific_competences}</p>
          </div>
        </div>

        {/* Lesson Plan Sections */}
        <div className="space-y-6">
          <Section 
            title="1. Introduction" 
            data={plan.lesson_plan.introduction}
          />
          
          <Section 
            title="2. Lesson Development" 
            data={plan.lesson_plan.development}
          />
          
          <Section 
            title="3. Exercise & Assessment" 
            data={plan.lesson_plan.exercise}
          />
          
          <Section 
            title="4. Homework" 
            data={plan.lesson_plan.homework}
          />
          
          <Section 
            title="5. Conclusion" 
            data={plan.lesson_plan.conclusion}
          />

          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Lesson Evaluation</h3>
            <div className="text-gray-700 whitespace-pre-wrap">
              {plan.lesson_plan.evaluation}
            </div>
          </div>
        </div>

        <div className="flex gap-4 mt-8">
          <button
            onClick={onBack}
            className="flex-1 bg-gray-600 hover:bg-gray-700 text-white font-bold py-3 px-4 rounded-lg transition"
          >
            Create Another Plan
          </button>
          <button
            onClick={handleExportPDF}
            disabled={isExporting}
            className="flex-1 bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white font-bold py-3 px-4 rounded-lg transition"
          >
            {isExporting ? 'Exporting...' : 'Download as PDF'}
          </button>
        </div>
      </div>
    </div>
  );
}
