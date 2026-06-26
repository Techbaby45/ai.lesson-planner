"use client"
import { exportLessonPlanPDF } from "../utils/exportPDF"
import { useState } from "react"

export default function LessonPlanDisplay({ data, onBack }) {
  const { topic, teacher_input, lesson_plan } = data

  // Page 1 editable fields — teacher info
  const [teacherFields, setTeacherFields] = useState({
    name_of_teacher: teacher_input.name_of_teacher,
    class_: teacher_input.class_,
    time_: teacher_input.time_,
    date_: teacher_input.date_,
    duration: teacher_input.duration,
    no_of_learners: teacher_input.no_of_learners,
    natural_environment: teacher_input.natural_environment,
    artificial_environment: teacher_input.artificial_environment,
    technological_environment: teacher_input.technological_environment,
    teaching_materials: teacher_input.teaching_materials,
  })

  // Page 2 editable fields — lesson progression
  const [planFields, setPlanFields] = useState({
    intro_teacher: lesson_plan.intro_teacher,
    intro_learners: lesson_plan.intro_learners,
    intro_assessment: lesson_plan.intro_assessment,
    development_teacher: lesson_plan.development_teacher,
    development_learners: lesson_plan.development_learners,
    development_assessment: lesson_plan.development_assessment,
    exercise_teacher: lesson_plan.exercise_teacher,
    exercise_learners: lesson_plan.exercise_learners,
    exercise_assessment: lesson_plan.exercise_assessment,
    homework_teacher: lesson_plan.homework_teacher,
    homework_learners: lesson_plan.homework_learners,
    homework_assessment: lesson_plan.homework_assessment,
    conclusion_teacher: lesson_plan.conclusion_teacher,
    conclusion_learners: lesson_plan.conclusion_learners,
    conclusion_assessment: lesson_plan.conclusion_assessment,
    lesson_evaluation: lesson_plan.lesson_evaluation,
  })

  const updateTeacher = (key, value) => {
    setTeacherFields(prev => ({ ...prev, [key]: value }))
  }

  const updatePlan = (key, value) => {
    setPlanFields(prev => ({ ...prev, [key]: value }))
  }

  // Editable single-line input
  const EditField = ({ label, value, onChange, span = 1 }) => (
    <div className={span === 2 ? "col-span-2" : span === 3 ? "col-span-3" : ""}>
      <p className="text-xs font-bold text-blue-900 mb-1">{label}</p>
      <input
        value={value}
        onChange={e => onChange(e.target.value)}
        className="w-full border border-gray-300 rounded px-2 py-1 text-xs text-gray-900 focus:outline-none focus:ring-1 focus:ring-blue-400"
      />
    </div>
  )

  // Editable multi-line textarea
  const EditArea = ({ label, value, onChange, rows = 4 }) => (
    <div>
      <p className="text-xs font-bold text-blue-900 mb-1">{label}</p>
      <textarea
        value={value}
        onChange={e => onChange(e.target.value)}
        rows={rows}
        className="w-full border border-gray-300 rounded px-2 py-1 text-xs text-gray-900 focus:outline-none focus:ring-1 focus:ring-blue-400 resize-y"
      />
    </div>
  )

  // One row of the lesson progression table
  const StageRow = ({ title, teacherKey, learnersKey, assessmentKey }) => (
    <div className="border border-gray-300 mb-0">
      <div className="bg-blue-900 px-3 py-1">
        <p className="text-white text-xs font-bold">{title}</p>
      </div>
      <div className="grid grid-cols-3 divide-x divide-gray-300">
        <div className="p-2">
          <textarea
            value={planFields[teacherKey]}
            onChange={e => updatePlan(teacherKey, e.target.value)}
            rows={8}
            className="w-full text-xs text-gray-900 border-0 focus:outline-none resize-y bg-transparent"
          />
        </div>
        <div className="p-2">
          <textarea
            value={planFields[learnersKey]}
            onChange={e => updatePlan(learnersKey, e.target.value)}
            rows={5}
            className="w-full text-xs text-gray-900 border-0 focus:outline-none resize-y bg-transparent"
          />
        </div>
        <div className="p-2">
          <textarea
            value={planFields[assessmentKey]}
            onChange={e => updatePlan(assessmentKey, e.target.value)}
            rows={5}
            className="w-full text-xs text-gray-900 border-0 focus:outline-none resize-y bg-transparent"
          />
        </div>
      </div>
    </div>
  )

  return (
    <div className="bg-gray-50 rounded-xl p-6">

      {/* Top buttons */}
      <div className="flex justify-between items-center mb-6">
        <button
          onClick={onBack}
          className="text-sm text-blue-700 border border-blue-300 px-4 py-2 rounded-lg hover:bg-blue-50"
        >
          ← Back to Form
        </button>
        <div className="flex gap-3">
          <button
            onClick={() => window.print()}
            className="text-sm bg-gray-700 text-white px-4 py-2 rounded-lg hover:bg-gray-600"
          >
            🖨 Print
          </button>
         <button
  className="text-sm bg-blue-900 text-white px-4 py-2 rounded-lg hover:bg-blue-800"
  onClick={() => exportLessonPlanPDF(topic, teacherFields, planFields)}
>
  📄 Export PDF
</button>
        </div>
      </div>

      {/* PAGE 1 — Header fields */}
      <div className="bg-white rounded-lg shadow-sm p-5 mb-6 border border-blue-100">
        <div className="text-center mb-4 border-b border-gray-200 pb-3">
          <p className="font-bold text-blue-900 text-sm uppercase tracking-widest">
            {topic.school_name || "Secondary School"}
          </p>
          <p className="font-bold text-blue-900 text-sm">Mathematics Department</p>
          <p className="font-bold text-blue-900 text-sm">Lesson Plan</p>
        </div>

        <div className="grid grid-cols-3 gap-3 mb-4">
          <EditField label="Name of Teacher" value={teacherFields.name_of_teacher} onChange={v => updateTeacher("name_of_teacher", v)} />
          <EditField label="Date" value={teacherFields.date_} onChange={v => updateTeacher("date_", v)} />
          <EditField label="Duration" value={teacherFields.duration} onChange={v => updateTeacher("duration", v)} />
          <EditField label="Class" value={teacherFields.class_} onChange={v => updateTeacher("class_", v)} />
          <EditField label="Time" value={teacherFields.time_} onChange={v => updateTeacher("time_", v)} />
          <EditField label="No. of Learners" value={String(teacherFields.no_of_learners)} onChange={v => updateTeacher("no_of_learners", v)} />
          <EditField label="Subject" value="Mathematics I" onChange={() => {}} />
          <EditField label="Topic" value={topic.topic_name} onChange={() => {}} />
          <EditField label="Sub-Topic" value={topic.sub_topic} onChange={() => {}} span={1} />
        </div>

        <div className="space-y-2 mb-4">
          <div>
            <p className="text-xs font-bold text-blue-900 mb-1">General Competences</p>
            <p className="text-xs text-gray-900 bg-gray-50 rounded px-2 py-1 border border-gray-200">{topic.general_competences}</p>
          </div>
          <div>
            <p className="text-xs font-bold text-blue-900 mb-1">Specific Competences</p>
            <p className="text-xs text-gray-900 bg-gray-50 rounded px-2 py-1 border border-gray-200">{topic.specific_competences}</p>
          </div>
          <div>
            <p className="text-xs font-bold text-blue-900 mb-1">Lesson Goal</p>
            <p className="text-xs text-gray-900 bg-gray-50 rounded px-2 py-1 border border-gray-200">{topic.lesson_goal}</p>
          </div>
          <div>
            <p className="text-xs font-bold text-blue-900 mb-1">Rationale</p>
            <p className="text-xs text-gray-900 bg-gray-50 rounded px-2 py-1 border border-gray-200">{topic.rationale}</p>
          </div>
          <div>
            <p className="text-xs font-bold text-blue-900 mb-1">Prior Knowledge</p>
            <p className="text-xs text-gray-900 bg-gray-50 rounded px-2 py-1 border border-gray-200">{topic.prior_knowledge}</p>
          </div>
          <div>
            <p className="text-xs font-bold text-blue-900 mb-1">References</p>
            <p className="text-xs text-gray-900 bg-gray-50 rounded px-2 py-1 border border-gray-200">{topic.references_}</p>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3 mb-4">
          <EditField label="Natural Environment" value={teacherFields.natural_environment} onChange={v => updateTeacher("natural_environment", v)} />
          <EditField label="Artificial Environment" value={teacherFields.artificial_environment} onChange={v => updateTeacher("artificial_environment", v)} />
          <EditField label="Technological Environment" value={teacherFields.technological_environment} onChange={v => updateTeacher("technological_environment", v)} />
        </div>

        <div>
          <p className="text-xs font-bold text-blue-900 mb-1">Teaching and Learning Materials / Resources</p>
          <input
            value={teacherFields.teaching_materials}
            onChange={e => updateTeacher("teaching_materials", e.target.value)}
            className="w-full border border-gray-300 rounded px-2 py-1 text-xs text-gray-900 focus:outline-none focus:ring-1 focus:ring-blue-400"
          />
        </div>

        <div className="mt-3">
          <p className="text-xs font-bold text-blue-900 mb-1">Expected Standard</p>
          <p className="text-xs text-gray-900 bg-gray-50 rounded px-2 py-1 border border-gray-200">{topic.expected_standard}</p>
        </div>
      </div>

      {/* PAGE 2 — Lesson Progression */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-300 mb-4">
        <div className="bg-blue-900 px-4 py-2 rounded-t-lg">
          <p className="text-white font-bold text-sm uppercase tracking-wide text-center">Lesson Progression</p>
        </div>
        <div className="grid grid-cols-3 divide-x divide-gray-300 bg-blue-100 border-b border-gray-300">
          <p className="text-xs font-bold text-blue-900 px-3 py-2">Stages</p>
          <p className="text-xs font-bold text-blue-900 px-3 py-2">Teacher's Activities</p>
          <p className="text-xs font-bold text-blue-900 px-3 py-2">Learners' Activities</p>
        </div>
        <StageRow title="INTRODUCTION"
          teacherKey="intro_teacher" learnersKey="intro_learners" assessmentKey="intro_assessment" />
        <StageRow title="LESSON DEVELOPMENT"
          teacherKey="development_teacher" learnersKey="development_learners" assessmentKey="development_assessment" />
        <StageRow title="EXERCISE / ASSESSMENT"
          teacherKey="exercise_teacher" learnersKey="exercise_learners" assessmentKey="exercise_assessment" />
        <StageRow title="HOME WORK"
          teacherKey="homework_teacher" learnersKey="homework_learners" assessmentKey="homework_assessment" />
        <StageRow title="CONCLUSION"
          teacherKey="conclusion_teacher" learnersKey="conclusion_learners" assessmentKey="conclusion_assessment" />
      </div>

      {/* Lesson Evaluation */}
      <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-200">
        <p className="text-xs font-bold text-blue-900 mb-2">LESSON EVALUATION:</p>
        <textarea
          value={planFields.lesson_evaluation}
          onChange={e => updatePlan("lesson_evaluation", e.target.value)}
          rows={10}
          className="w-full border border-gray-200 rounded px-2 py-1 text-xs text-gray-900 focus:outline-none focus:ring-1 focus:ring-blue-400 resize-y"
        />
        <div className="mt-3 space-y-3">
          <div className="h-6 border-b border-dotted border-gray-300"></div>
          <div className="h-6 border-b border-dotted border-gray-300"></div>
          <div className="h-6 border-b border-dotted border-gray-300"></div>
          <div className="h-6 border-b border-dotted border-gray-300"></div>
        </div>
      </div>

    </div>
  )
}