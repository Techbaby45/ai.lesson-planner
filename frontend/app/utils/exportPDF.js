import jsPDF from "jspdf"
import html2canvas from "html2canvas"

export async function exportLessonPlanPDF(topic, teacherFields, planFields) {
  const pdf = new jsPDF("p", "mm", "a4")
  const pageWidth = 210
  const pageHeight = 297
  const margin = 10
  const contentWidth = pageWidth - margin * 2

  // ── COLOURS ──────────────────────────────────────────────────────────────
  const DARK_BLUE = [31, 56, 100]
  const MID_BLUE  = [46, 95, 163]
  const BLACK     = [0, 0, 0]
  const GRAY      = [100, 100, 100]
  const LIGHT     = [240, 244, 250]

  let y = margin  // current y position on page

  // ── HELPERS ───────────────────────────────────────────────────────────────
  function setFont(size, style = "normal", color = BLACK) {
    pdf.setFontSize(size)
    pdf.setFont("helvetica", style)
    pdf.setTextColor(...color)
  }

  function drawRect(x, yPos, w, h, fill) {
    pdf.setFillColor(...fill)
    pdf.rect(x, yPos, w, h, "F")
  }

  function line(yPos) {
    pdf.setDrawColor(...MID_BLUE)
    pdf.setLineWidth(0.3)
    pdf.line(margin, yPos, pageWidth - margin, yPos)
  }

  function fieldRow(label, value, x, yPos, w) {
    setFont(7, "bold", DARK_BLUE)
    pdf.text(label + ":", x, yPos)
    setFont(8, "normal", BLACK)
    const lines = pdf.splitTextToSize(String(value || ""), w - 2)
    pdf.text(lines, x, yPos + 4)
    return yPos + 4 + lines.length * 4
  }

  function labelValue(label, value, yPos, fullWidth = false) {
    setFont(7, "bold", DARK_BLUE)
    pdf.text(label + ":", margin, yPos)
    setFont(8, "normal", BLACK)
    const maxW = fullWidth ? contentWidth : contentWidth - 2
    const lines = pdf.splitTextToSize(String(value || ""), maxW)
    pdf.text(lines, margin, yPos + 4)
    return yPos + 4 + lines.length * 4.5 + 2
  }

  function checkPage(needed = 20) {
    if (y + needed > pageHeight - margin) {
      pdf.addPage()
      y = margin
    }
  }

  // ══════════════════════════════════════════════════════════════════════════
  // PAGE 1
  // ══════════════════════════════════════════════════════════════════════════

  // School header
  drawRect(margin, y, contentWidth, 22, DARK_BLUE)
  setFont(11, "bold", [255, 255, 255])
  pdf.text("MATHEMATICS DEPARTMENT", pageWidth / 2, y + 7, { align: "center" })
  setFont(9, "bold", [255, 255, 255])
  pdf.text("LESSON PLAN", pageWidth / 2, y + 14, { align: "center" })
  y += 26

  // Top 3-column row: Name/Class/Time | Date/Duration/Learners
  const col = contentWidth / 2
  setFont(7, "bold", DARK_BLUE)
  drawRect(margin, y, contentWidth, 4, LIGHT)
  y += 5

  // Left column
  const leftX  = margin + 1
  const rightX = margin + col + 2

  setFont(7, "bold", DARK_BLUE)
  pdf.text("NAME OF TEACHER:", leftX, y)
  setFont(8, "normal", BLACK)
  pdf.text(String(teacherFields.name_of_teacher || ""), leftX + 30, y)

  pdf.text("DATE:", rightX, y, { align: "left"})
  setFont(8, "normal", BLACK)
  pdf.text(String(teacherFields.date_ || ""), rightX + 12, y)
  y += 5

  setFont(7, "bold", DARK_BLUE)
  pdf.text("CLASS:", leftX, y)
  setFont(8, "normal", BLACK)
  pdf.text(String(teacherFields.class_ || ""), leftX + 14, y)

  setFont(7, "bold", DARK_BLUE)
  pdf.text("DURATION:", rightX, y)
  setFont(8, "normal", BLACK)
  pdf.text(String(teacherFields.duration || "") + " minutes", rightX + 20, y)
  y += 5

  setFont(7, "bold", DARK_BLUE)
  pdf.text("TIME:", leftX, y)
  setFont(8, "normal", BLACK)
  pdf.text(String(teacherFields.time_ || ""), leftX + 12, y)

  setFont(7, "bold", DARK_BLUE)
  pdf.text("NO. OF LEARNERS:", rightX, y)
  setFont(8, "normal", BLACK)
  pdf.text(String(teacherFields.no_of_learners || ""), rightX + 34, y)
  y += 5

  setFont(7, "bold", DARK_BLUE)
  pdf.text("SUBJECT:", leftX, y)
  setFont(8, "normal", BLACK)
  pdf.text("Mathematics I", leftX + 18, y)
  y += 5

  setFont(7, "bold", DARK_BLUE)
  pdf.text("TOPIC:", leftX, y)
  setFont(8, "normal", BLACK)
  pdf.text(String(topic.topic_name || ""), leftX + 14, y)

  setFont(7, "bold", DARK_BLUE)
  pdf.text("SUB-TOPIC:", rightX, y)
  setFont(8, "normal", BLACK)
  const subLines = pdf.splitTextToSize(String(topic.sub_topic || ""), col - 24)
  pdf.text(subLines, rightX + 22, y)
  y += subLines.length * 4.5 + 3

  line(y); y += 4

  // General Competences
  setFont(7, "bold", DARK_BLUE)
  pdf.text("GENERAL COMPETENCES:", margin, y)
  setFont(7.5, "normal", BLACK)
  const gcLines = pdf.splitTextToSize(String(topic.general_competences || ""), contentWidth - 48)
  pdf.text(gcLines, margin + 46, y)
  y += Math.max(gcLines.length * 4, 5) + 2

  // Specific Competences
  y = labelValue("SPECIFIC COMPETENCES", topic.specific_competences, y, true)

  // Lesson Goal
  y = labelValue("LESSON GOAL", topic.lesson_goal, y, true)

  // Rationale
  y = labelValue("RATIONALE", topic.rationale, y, true)

  // Prior Knowledge
  y = labelValue("PRIOR KNOWLEDGE", topic.prior_knowledge, y, true)

  // References
  y = labelValue("REFERENCES", topic.references_, y, true)

  line(y); y += 4

  // Learning Environment
  setFont(7, "bold", DARK_BLUE)
  pdf.text("LEARNING ENVIRONMENT:", margin, y)
  y += 5
  setFont(7, "bold", DARK_BLUE)
  pdf.text("Natural Environment:", margin + 4, y)
  setFont(7.5, "normal", BLACK)
  pdf.text(String(teacherFields.natural_environment || ""), margin + 38, y)
  y += 5
  setFont(7, "bold", DARK_BLUE)
  pdf.text("Artificial Environment:", margin + 4, y)
  setFont(7.5, "normal", BLACK)
  pdf.text(String(teacherFields.artificial_environment || ""), margin + 40, y)
  y += 5
  setFont(7, "bold", DARK_BLUE)
  pdf.text("Technological Environment:", margin + 4, y)
  setFont(7.5, "normal", BLACK)
  pdf.text(String(teacherFields.technological_environment || ""), margin + 52, y)
  y += 6

  // Teaching Materials
  setFont(7, "bold", DARK_BLUE)
  pdf.text("TEACHING AND LEARNING MATERIALS / RESOURCES:", margin, y)
  y += 4
  setFont(7.5, "normal", BLACK)
  const matLines = pdf.splitTextToSize(String(teacherFields.teaching_materials || ""), contentWidth - 4)
  matLines.forEach(l => {
    checkPage()
    pdf.text("• " + l, margin + 4, y)
    y += 4.5
  })
  y += 2

  // Expected Standard
  y = labelValue("EXPECTED STANDARD", topic.expected_standard, y, true)

  // ══════════════════════════════════════════════════════════════════════════
  // PAGE 2 — Lesson Progression
  // ══════════════════════════════════════════════════════════════════════════
  pdf.addPage()
  y = margin

  // Page 2 header
  drawRect(margin, y, contentWidth, 10, DARK_BLUE)
  setFont(9, "bold", [255, 255, 255])
  pdf.text("LESSON PROGRESSION", pageWidth / 2, y + 7, { align: "center" })
  y += 14

  // Column headers
  const col1W = 35
  const col2W = (contentWidth - col1W) / 3
  const col3W = col2W
  const col4W = contentWidth - col1W - col2W - col3W

  drawRect(margin, y, contentWidth, 8, MID_BLUE)
  setFont(7, "bold", [255, 255, 255])
  pdf.text("STAGES",            margin + 2,             y + 5.5)
  pdf.text("TEACHER'S",         margin + col1W + col2W/2, y + 4, { align: "center" })
  pdf.text("ACTIVITIES",        margin + col1W + col2W/2, y + 8, { align: "center" })
  pdf.text("LEARNERS'",         margin + col1W + col2W + col3W/2, y + 4, { align: "center" })
  pdf.text("ACTIVITIES",        margin + col1W + col2W + col3W/2, y + 8, { align: "center" })
  pdf.text("ASSESSMENT",        margin + col1W + col2W + col3W + col4W/2, y + 4, { align: "center" })
  pdf.text("CRITERIA",          margin + col1W + col2W + col3W + col4W/2, y + 8, { align: "center" })
  y += 10

  // Stage renderer
  function drawStage(stageName, teacherText, learnersText, assessText) {
    const x1 = margin
    const x2 = margin + col1W
    const x3 = margin + col1W + col2W
    const x4 = margin + col1W + col2W + col3W

    const tLines = pdf.splitTextToSize(String(teacherText  || ""), col2W - 3)
    const lLines = pdf.splitTextToSize(String(learnersText || ""), col3W - 3)
    const aLines = pdf.splitTextToSize(String(assessText   || ""), col4W - 3)
    const maxLines = Math.max(tLines.length, lLines.length, aLines.length, 3)
    const rowH = maxLines * 4 + 6

    checkPage(rowH + 4)

    // Stage label background
    drawRect(x1, y, col1W, rowH, LIGHT)
    setFont(7, "bold", DARK_BLUE)
    // Centre stage name vertically
    pdf.text(stageName, x1 + 2, y + rowH/2 + 2)

    // Column borders
    pdf.setDrawColor(...MID_BLUE)
    pdf.setLineWidth(0.2)
    pdf.rect(x1, y, contentWidth, rowH)
    pdf.line(x2, y, x2, y + rowH)
    pdf.line(x3, y, x3, y + rowH)
    pdf.line(x4, y, x4, y + rowH)

    // Text
    setFont(7.5, "normal", BLACK)
    pdf.text(tLines, x2 + 2, y + 4)
    pdf.text(lLines, x3 + 2, y + 4)
    pdf.text(aLines, x4 + 2, y + 4)

    y += rowH
  }

  drawStage("INTRODUCTION",       planFields.intro_teacher,       planFields.intro_learners,       planFields.intro_assessment)
  drawStage("LESSON\nDEVELOPMENT",planFields.development_teacher, planFields.development_learners, planFields.development_assessment)
  drawStage("EXERCISE /\nASSESSMENT", planFields.exercise_teacher, planFields.exercise_learners,  planFields.exercise_assessment)
  drawStage("HOME WORK",          planFields.homework_teacher,    planFields.homework_learners,    planFields.homework_assessment)
  drawStage("CONCLUSION",         planFields.conclusion_teacher,  planFields.conclusion_learners,  planFields.conclusion_assessment)

  y += 6

  // Lesson Evaluation
  checkPage(40)
  setFont(8, "bold", DARK_BLUE)
  pdf.text("LESSON EVALUATION:", margin, y)
  y += 5
  setFont(7.5, "normal", BLACK)
  const evalLines = pdf.splitTextToSize(String(planFields.lesson_evaluation || ""), contentWidth)
  pdf.text(evalLines, margin, y)
  y += evalLines.length * 4.5 + 4

  // Dotted lines for teacher notes
  pdf.setDrawColor(180, 180, 180)
  pdf.setLineWidth(0.2)
  for (let i = 0; i < 5; i++) {
    checkPage(8)
    pdf.setLineDashPattern([1, 2], 0)
    pdf.line(margin, y, pageWidth - margin, y)
    y += 8
  }
  pdf.setLineDashPattern([], 0)

  // Save the file
  const fileName = `LessonPlan_${topic.topic_name}_${teacherFields.class_}_${teacherFields.date_}.pdf`
    .replace(/\s+/g, "_").replace(/[^a-zA-Z0-9_.-]/g, "")
  pdf.save(fileName)
}