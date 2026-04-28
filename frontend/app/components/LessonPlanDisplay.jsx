"use client"

export default function LessonPlanDisplay({ data, onBack }) {
  const { topic, teacher_input, lesson_plan } = data

  const Stage = ({ title, teacher, learners, assessment, color }) => (
    <div className={`border-l-4 ${color} bg-white rounded-lg shadow-sm mb-4 overflow-hidden`}>
      <div className="bg-blue-900 px-4 py-2">
        <h3 className="text-white font-bold text-sm">{title}</h3>
      </div>
      <div className="grid grid-cols-3 divide-x divide-gray-200">
        <div className="p-3">
          <p className="text-xs font-bold text-blue-900 mb-1">Teacher's Activities</p>
          <p className="text-xs text-gray-700 leading-relaxed">{teacher}</p>
        </div>
        <div className="p-3">
          <p className="text-xs font-bold text-blue-900 mb-1">Learners' Activities</p>
          <p className="text-xs text-gray-700 leading-relaxed">{learners}</p>
        </div>
        <div className="p-3">
          <p className="text-xs font-bold text-blue-900 mb-1">Assessment Criteria</p>
          <p className="text-xs text-gray-700 leading-relaxed">{assessment}</p>
        </div>
      </div>
    </div>
  )

  return (
    <div className="bg-gray-50 rounded-xl p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-blue-900">Generated Lesson Plan</h2>
        <button onClick={onBack}
          className="text-sm text-blue-700 border border-blue-300 px-4 py-1 rounded-lg hover:bg-blue-50">
          ← Back to Form
        </button>
      </div>

      {/* Page 1 — Header Info */}
      <div className="bg-white rounded-lg shadow-sm p-5 mb-6 border border-blue-100">
        <h3 className="text-sm font-bold text-blue-900 border-b pb-2 mb-3 uppercase tracking-wide">
          Lesson Header (Page 1)
        </h3>
        <div className="grid grid-cols-3 gap-3 text-xs">
          <div><span className="font-semibold text-blue-800">Name of Teacher:</span><br />{teacher_input.name_of_teacher}</div>
          <div><span className="font-semibold text-blue-800">Class:</span><br />{teacher_input.class_}</div>
          <div><span className="font-semibold text-blue-800">Date:</span><br />{teacher_input.date_}</div>
          <div><span className="font-semibold text-blue-800">Duration:</span><br />{teacher_input.duration} minutes</div>
          <div><span className="font-semibold text-blue-800">No. of Learners:</span><br />{teacher_input.no_of_learners}</div>
          <div><span className="font-semibold text-blue-800">Time:</span><br />{teacher_input.time_}</div>
          <div><span className="font-semibold text-blue-800">Topic:</span><br />{topic.topic_name}</div>
          <div className="col-span-2"><span className="font-semibold text-blue-800">Sub-Topic:</span><br />{topic.sub_topic}</div>
          <div className="col-span-3"><span className="font-semibold text-blue-800">General Competences:</span><br />{topic.general_competences}</div>
          <div className="col-span-3"><span className="font-semibold text-blue-800">Specific Competences:</span><br />{topic.specific_competences}</div>
          <div className="col-span-3"><span className="font-semibold text-blue-800">Lesson Goal:</span><br />{topic.lesson_goal}</div>
          <div className="col-span-3"><span className="font-semibold text-blue-800">Rationale:</span><br />{topic.rationale}</div>
          <div className="col-span-3"><span className="font-semibold text-blue-800">Prior Knowledge:</span><br />{topic.prior_knowledge}</div>
          <div className="col-span-3"><span className="font-semibold text-blue-800">References:</span><br />{topic.references_}</div>
          <div><span className="font-semibold text-blue-800">Natural Environment:</span><br />{teacher_input.natural_environment}</div>
          <div><span className="font-semibold text-blue-800">Artificial Environment:</span><br />{teacher_input.artificial_environment}</div>
          <div><span className="font-semibold text-blue-800">Technological Environment:</span><br />{teacher_input.technological_environment}</div>
          <div className="col-span-3"><span className="font-semibold text-blue-800">Teaching Materials:</span><br />{teacher_input.teaching_materials}</div>
          <div className="col-span-3"><span className="font-semibold text-blue-800">Expected Standard:</span><br />{topic.expected_standard}</div>
        </div>
      </div>

      {/* Page 2 — Lesson Progression */}
      <h3 className="text-sm font-bold text-blue-900 uppercase tracking-wide mb-3">
        Lesson Progression (Page 2)
      </h3>
      <div className="grid grid-cols-3 bg-blue-900 text-white text-xs font-bold px-4 py-2 rounded-t-lg mb-1">
        <div>Stages</div>
        <div>Teacher's Activities</div>
        <div>Learners' Activities / Assessment</div>
      </div>

      <Stage title="INTRODUCTION" color="border-teal-500"
        teacher={lesson_plan.intro_teacher}
        learners={lesson_plan.intro_learners}
        assessment={lesson_plan.intro_assessment} />
      <Stage title="LESSON DEVELOPMENT" color="border-blue-500"
        teacher={lesson_plan.development_teacher}
        learners={lesson_plan.development_learners}
        assessment={lesson_plan.development_assessment} />
      <Stage title="EXERCISE / ASSESSMENT" color="border-orange-500"
        teacher={lesson_plan.exercise_teacher}
        learners={lesson_plan.exercise_learners}
        assessment={lesson_plan.exercise_assessment} />
      <Stage title="HOME WORK" color="border-purple-500"
        teacher={lesson_plan.homework_teacher}
        learners={lesson_plan.homework_learners}
        assessment={lesson_plan.homework_assessment} />
      <Stage title="CONCLUSION" color="border-green-500"
        teacher={lesson_plan.conclusion_teacher}
        learners={lesson_plan.conclusion_learners}
        assessment={lesson_plan.conclusion_assessment} />

      {/* Lesson Evaluation */}
      <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-200 mt-4">
        <p className="text-xs font-bold text-blue-900 mb-2">LESSON EVALUATION:</p>
        <p className="text-xs text-gray-600 italic">{lesson_plan.lesson_evaluation}</p>
      </div>
    </div>
  )
}