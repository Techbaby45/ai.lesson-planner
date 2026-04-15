'use client';

import { useState, useEffect } from 'react';
import LessonPlanForm from './components/LessonPlanForm';
import LessonPlanDisplay from './components/LessonPlanDisplay';

export default function Home() {
  const [currentPage, setCurrentPage] = useState('home');
  const [generatedPlan, setGeneratedPlan] = useState(null);
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {currentPage === 'home' && (
        <HomePage onStartClick={() => setCurrentPage('form')} />
      )}
      {currentPage === 'form' && (
        <LessonPlanForm 
          onPlanGenerated={(plan) => {
            setGeneratedPlan(plan);
            setCurrentPage('display');
          }}
          onBack={() => setCurrentPage('home')}
        />
      )}
      {currentPage === 'display' && generatedPlan && (
        <LessonPlanDisplay 
          plan={generatedPlan}
          onBack={() => setCurrentPage('form')}
        />
      )}
    </div>
  );
}

function HomePage({ onStartClick }: { onStartClick: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4 py-12">
      <div className="max-w-2xl text-center">
        <h1 className="text-5xl font-bold text-gray-900 mb-4">
          AI Lesson Planner
        </h1>
        <p className="text-xl text-gray-600 mb-6">
          Generate comprehensive lesson plans in 2 minutes instead of 60 minutes
        </p>
        <p className="text-gray-700 mb-8">
          Powered by Google Gemini AI and the official Zambian Mathematics Syllabus
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 my-12">
          <FeatureCard 
            icon="⚡" 
            title="Fast" 
            description="Generate lesson plans in seconds"
          />
          <FeatureCard 
            icon="📚" 
            title="Official" 
            description="Based on Zambian mathematics curriculum"
          />
          <FeatureCard 
            icon="🤖" 
            title="AI Powered" 
            description="Smart lesson planning with Gemini"
          />
        </div>
        
        <button
          onClick={onStartClick}
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-lg text-lg transition"
        >
          Start Creating Lesson Plan
        </button>
      </div>
    </div>
  );
}

function FeatureCard({ icon, title, description }: { icon: string; title: string; description: string }) {
  return (
    <div className="bg-white rounded-lg p-6 shadow-md">
      <div className="text-4xl mb-3">{icon}</div>
      <h3 className="text-lg font-bold text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  );
}
