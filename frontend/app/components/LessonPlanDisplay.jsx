"use client"
import { exportLessonPlanPDF } from "../utils/exportPDF"
import { useState, useCallback, useEffect } from "react"
import { savePlanOffline } from "../utils/offlineStore"

// ── All sub-components defined OUTSIDE main function to prevent cursor loss ──

const EditField = ({ label, fieldKey, value, onUpdate }) => (
  <div>
    <p className="text-xs font-bold text-blue-900 mb-1">{label}</p>
    <input
      value={value}
      onChange={e => onUpdate(fieldKey, e.target.value)}
      className="w-full border border-gray-300 rounded px-2 py-1 text-xs text-gray-900 focus:outline-none focus:ring-1 focus:ring-blue-400"
    />
  </div>
)

const ReadField = ({ label, value }) => (
  <div>
    <p className="text-xs font-bold text-blue-900 mb-1">{label}</p>
    <p className="text-xs text-gray-900 bg-gray-50 rounded px-2 py-1 border border-gray-200">{value}</p>
  </div>
)

const StageRow = ({ title, teacherKey, learnersKey, assessmentKey, planFields, updatePlan }) => (
  <div className="border border-gray-300 mb-0">
    <div className="bg-blue-900 px-3 py-1">
      <p className="text-white text-xs font-bold">{title}</p>
    </div>
    <div className="grid grid-cols-3 divide-x divide-gray-300">
      <div className="p-2">
        <textarea
          value={planFields[teacherKey]}
          onChange={e => updatePlan(teacherKey, e.target.value)}
          rows={10}
          className="w-full text-xs text-gray-900 border-0 focus:outline-none resize-none bg-transparent"
        />
      </div>
      <div className="p-2">
        <textarea
          value={planFields[learnersKey]}
          onChange={e => updatePlan(learnersKey, e.target.value)}
          rows={10}
          className="w-full text-xs text-gray-900 border-0 focus:outline-none resize-none bg-transparent"
        />
      </div>
      <div className="p-2">
        <textarea
          value={planFields[assessmentKey]}
          onChange={e => updatePlan(assessmentKey, e.target.value)}
          rows={10}
          className="w-full text-xs text-gray-900 border-0 focus:outline-none resize-none bg-transparent"
        />
      </div>
    </div>
  </div>
)

// ── Main component ──

export default function LessonPlanDisplay({ data, onBack }) {
  const { topic, teacher_input, lesson_plan } = data

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

  const [planFields, setPlanFields] = useState({
    intro_teacher: lesson_plan.intro_teacher || "",
    intro_learners: lesson_plan.intro_learners || "",
    intro_assessment: lesson_plan.intro_assessment || "",
    development_teacher: lesson_plan.development_teacher || "",
    development_learners: lesson_plan.development_learners || "",
    development_assessment: lesson_plan.development_assessment || "",
    exercise_teacher: lesson_plan.exercise_teacher || "",
    exercise_learners: lesson_plan.exercise_learners || "",
    exercise_assessment: lesson_plan.exercise_assessment || "",
    homework_teacher: lesson_plan.homework_teacher || "",
    homework_learners: lesson_plan.homework_learners || "",
    homework_assessment: lesson_plan.homework_assessment || "",
    conclusion_teacher: lesson_plan.conclusion_teacher || "",
    conclusion_learners: lesson_plan.conclusion_learners || "",
    conclusion_assessment: lesson_plan.conclusion_assessment || "",
    lesson_evaluation: lesson_plan.lesson_evaluation || "",
  })

  const [savedOffline, setSavedOffline] = useState(false)

  // Auto save to IndexedDB when plan is first displayed
  useEffect(() => {
    savePlanOffline(data)
      .then(() => {
        setSavedOffline(true)
        console.log("Plan saved offline successfully")
      })
      .catch(err => console.error("Failed to save plan offline:", err))
  }, [])

  const updateTeacher = useCallback((key, value) => {
    setTeacherFields(prev => ({ ...prev, [key]: value }))
  }, [])

  const updatePlan = useCallback((key, value) => {
    setPlanFields(prev => ({ ...prev, [key]: value }))
  }, [])

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
        <div className="flex items-center gap-3">
          {savedOffline && (
            <span className="text-xs text-green-600 font-semibold">
              ✓ Saved offline
            </span>
          )}
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

      {/* PAGE 1 — Header */}
      <div className="bg-white rounded-lg shadow-sm p-5 mb-6 border border-blue-100">
        <div className="text-center mb-4 border-b border-gray-200 pb-3">
          <p className="font-bold text-blue-900 text-sm">Mathematics Department</p>
          <p className="font-bold text-blue-900 text-sm">Lesson Plan</p>
        </div>

        <div className="grid grid-cols-3 gap-3 mb-4">
          <EditField label="Name of Teacher" fieldKey="name_of_teacher" value={teacherFields.name_of_teacher} onUpdate={updateTeacher} />
          <EditField label="Date" fieldKey="date_" value={teacherFields.date_} onUpdate={updateTeacher} />
          <EditField label="Duration" fieldKey="duration" value={teacherFields.duration} onUpdate={updateTeacher} />
          <EditField label="Class" fieldKey="class_" value={teacherFields.class_} onUpdate={updateTeacher} />
          <EditField label="Time" fieldKey="time_" value={teacherFields.time_} onUpdate={updateTeacher} />
          <EditField label="No. of Learners" fieldKey="no_of_learners" value={String(teacherFields.no_of_learners)} onUpdate={updateTeacher} />
          <div>
            <p className="text-xs font-bold text-blue-900 mb-1">Subject</p>
            <input value="Mathematics I" readOnly className="w-full border border-gray-200 rounded px-2 py-1 text-xs text-gray-500 bg-gray-50" />
          </div>
          <div>
            <p className="text-xs font-bold text-blue-900 mb-1">Topic</p>
            <input value={topic.topic_name} readOnly className="w-full border border-gray-200 rounded px-2 py-1 text-xs text-gray-500 bg-gray-50" />
          </div>
          <div>
            <p className="text-xs font-bold text-blue-900 mb-1">Sub-Topic</p>
            <input value={topic.sub_topic} readOnly className="w-full border border-gray-200 rounded px-2 py-1 text-xs text-gray-500 bg-gray-50" />
          </div>
        </div>

        <div className="space-y-2 mb-4">
          <ReadField label="General Competences" value={topic.general_competences} />
          <ReadField label="Specific Competences" value={topic.specific_competences} />
          <ReadField label="Lesson Goal" value={topic.lesson_goal} />
          <ReadField label="Rationale" value={topic.rationale} />
          <ReadField label="Prior Knowledge" value={topic.prior_knowledge} />
          <ReadField label="References" value={topic.references_} />
        </div>

        <div className="grid grid-cols-3 gap-3 mb-4">
          <EditField label="Natural Environment" fieldKey="natural_environment" value={teacherFields.natural_environment} onUpdate={updateTeacher} />
          <EditField label="Artificial Environment" fieldKey="artificial_environment" value={teacherFields.artificial_environment} onUpdate={updateTeacher} />
          <EditField label="Technological Environment" fieldKey="technological_environment" value={teacherFields.technological_environment} onUpdate={updateTeacher} />
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
          <ReadField label="Expected Standard" value={topic.expected_standard} />
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
          teacherKey="intro_teacher" learnersKey="intro_learners" assessmentKey="intro_assessment"
          planFields={planFields} updatePlan={updatePlan} />
        <StageRow title="LESSON DEVELOPMENT"
          teacherKey="development_teacher" learnersKey="development_learners" assessmentKey="development_assessment"
          planFields={planFields} updatePlan={updatePlan} />
        <StageRow title="EXERCISE / ASSESSMENT"
          teacherKey="exercise_teacher" learnersKey="exercise_learners" assessmentKey="exercise_assessment"
          planFields={planFields} updatePlan={updatePlan} />
        <StageRow title="HOME WORK"
          teacherKey="homework_teacher" learnersKey="homework_learners" assessmentKey="homework_assessment"
          planFields={planFields} updatePlan={updatePlan} />
        <StageRow title="CONCLUSION"
          teacherKey="conclusion_teacher" learnersKey="conclusion_learners" assessmentKey="conclusion_assessment"
          planFields={planFields} updatePlan={updatePlan} />
      </div>

      {/* Lesson Evaluation */}
      <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-200">
        <p className="text-xs font-bold text-blue-900 mb-2">LESSON EVALUATION:</p>
        <textarea
          value={planFields.lesson_evaluation}
          onChange={e => updatePlan("lesson_evaluation", e.target.value)}
          rows={6}
          placeholder="Teacher fills this in after the lesson..."
          className="w-full border border-gray-200 rounded px-2 py-1 text-xs text-gray-900 focus:outline-none focus:ring-1 focus:ring-blue-400 resize-none"
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