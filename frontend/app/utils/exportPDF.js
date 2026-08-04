import jsPDF from "jspdf"

function cleanText(text) {
  return String(text || "")
    .replace(/&/g, "and")
    .replace(/</g, "less than")
    .replace(/>/g, "greater than")
    .replace(/\u2019/g, "'")
    .replace(/\u2018/g, "'")
    .replace(/\u201C/g, '"')
    .replace(/\u201D/g, '"')
    .replace(/\u2013/g, "-")
    .replace(/\u2014/g, "-")
    .replace(/\u2022/g, "*")
    .replace(/\u00D7/g, "x")
    .replace(/\u00F7/g, "/")
    .replace(/\u2260/g, "not equal to")
    .replace(/\u2264/g, "<=")
    .replace(/\u2265/g, ">=")
    .replace(/\u2282/g, "subset of")
    .replace(/\u2283/g, "superset of")
    .replace(/\u2229/g, "intersection")
    .replace(/\u222A/g, "union")
    .replace(/\u2205/g, "empty set")
    .replace(/\u221A/g, "sqrt")
    .replace(/\u03C0/g, "pi")
    .replace(/\u00B2/g, "^2")
    .replace(/\u00B3/g, "^3")
    .replace(/[^\x00-\x7F]/g, " ")
}

export async function exportLessonPlanPDF(topic, teacherFields, planFields) {
  const pdf = new jsPDF("p", "mm", "a4")
  const pageWidth = 210
  const pageHeight = 297
  const margin = 10
  const contentWidth = pageWidth - margin * 2

  const DARK_BLUE = [31, 56, 100]
  const MID_BLUE  = [46, 95, 163]
  const BLACK     = [0, 0, 0]
  const LIGHT     = [240, 244, 250]
  const WHITE     = [255, 255, 255]

  let y = margin

  function setFont(size, style = "normal", color = BLACK) {
    pdf.setFontSize(size)
    pdf.setFont("helvetica", style)
    pdf.setTextColor(...color)
  }

  function drawRect(x, yPos, w, h, fill) {
    pdf.setFillColor(...fill)
    pdf.rect(x, yPos, w, h, "F")
  }

  function drawLine(yPos) {
    pdf.setDrawColor(...MID_BLUE)
    pdf.setLineWidth(0.3)
    pdf.line(margin, yPos, pageWidth - margin, yPos)
  }

  function checkPage(needed = 15) {
    if (y + needed > pageHeight - margin) {
      pdf.addPage()
      y = margin
    }
  }

  function wrap(text, maxW) {
    return pdf.splitTextToSize(cleanText(text), maxW)
  }

  function printLabelValue(label, value, maxW) {
    checkPage(12)
    setFont(7, "bold", DARK_BLUE)
    pdf.text(cleanText(label) + ":", margin, y)
    y += 4
    setFont(7.5, "normal", BLACK)
    const lines = wrap(value, maxW)
    lines.forEach(line => {
      checkPage(6)
      pdf.text(line, margin + 2, y)
      y += 4.5
    })
    y += 2
  }

  // ─────────────────────────────────────────────
  // PAGE 1 — Header
  // ─────────────────────────────────────────────
  drawRect(margin, y, contentWidth, 22, DARK_BLUE)
  setFont(11, "bold", WHITE)
  pdf.text("MATHEMATICS DEPARTMENT", pageWidth / 2, y + 8, { align: "center" })
  setFont(9, "normal", WHITE)
  pdf.text("LESSON PLAN", pageWidth / 2, y + 16, { align: "center" })
  y += 26

  const halfW  = contentWidth / 2 - 2
  const leftX  = margin + 1
  const rightX = margin + contentWidth / 2 + 3

  const infoRows = [
    ["NAME OF TEACHER", teacherFields.name_of_teacher, "DATE", teacherFields.date_],
    ["CLASS", teacherFields.class_, "DURATION", String(teacherFields.duration) + " minutes"],
    ["TIME", teacherFields.time_, "NO. OF LEARNERS", String(teacherFields.no_of_learners)],
    ["SUBJECT", "Mathematics I", "TOPIC", topic.topic_name],
  ]

  infoRows.forEach(([l1, v1, l2, v2]) => {
    checkPage(8)
    setFont(7, "bold", DARK_BLUE)
    pdf.text(l1 + ":", leftX, y)
    setFont(8, "normal", BLACK)
    const v1Lines = wrap(v1, halfW - 30)
    pdf.text(v1Lines, leftX + 32, y)

    setFont(7, "bold", DARK_BLUE)
    pdf.text(l2 + ":", rightX, y)
    setFont(8, "normal", BLACK)
    const v2Lines = wrap(v2, halfW - 26)
    pdf.text(v2Lines, rightX + 24, y)

    y += Math.max(v1Lines.length, v2Lines.length) * 4.5 + 1
  })

  checkPage(10)
  setFont(7, "bold", DARK_BLUE)
  pdf.text("SUB-TOPIC:", leftX, y)
  setFont(8, "normal", BLACK)
  const subLines = wrap(topic.sub_topic, contentWidth - 26)
  pdf.text(subLines, leftX + 24, y)
  y += subLines.length * 4.5 + 3

  drawLine(y); y += 4

  printLabelValue("GENERAL COMPETENCES", topic.general_competences, contentWidth - 4)
  printLabelValue("SPECIFIC COMPETENCES", topic.specific_competences, contentWidth - 4)
  printLabelValue("LESSON GOAL", topic.lesson_goal, contentWidth - 4)
  printLabelValue("RATIONALE", topic.rationale, contentWidth - 4)
  printLabelValue("PRIOR KNOWLEDGE", topic.prior_knowledge, contentWidth - 4)
  printLabelValue("REFERENCES", topic.references_, contentWidth - 4)

  drawLine(y); y += 4

  checkPage(20)
  setFont(7, "bold", DARK_BLUE)
  pdf.text("LEARNING ENVIRONMENT:", margin, y)
  y += 5

  const envRows = [
    ["Natural Environment", teacherFields.natural_environment],
    ["Artificial Environment", teacherFields.artificial_environment],
    ["Technological Environment", teacherFields.technological_environment],
  ]
  envRows.forEach(([label, value]) => {
    checkPage(8)
    setFont(7, "bold", DARK_BLUE)
    pdf.text(cleanText(label) + ":", margin + 4, y)
    setFont(7.5, "normal", BLACK)
    const lines = wrap(value, contentWidth - 55)
    pdf.text(lines, margin + 55, y)
    y += lines.length * 4.5 + 1
  })
  y += 2

  printLabelValue("TEACHING AND LEARNING MATERIALS / RESOURCES", teacherFields.teaching_materials, contentWidth - 4)
  printLabelValue("EXPECTED STANDARD", topic.expected_standard, contentWidth - 4)

  // ─────────────────────────────────────────────
  // PAGE 2 — Lesson Progression
  // ─────────────────────────────────────────────
  pdf.addPage()
  y = margin

  drawRect(margin, y, contentWidth, 10, DARK_BLUE)
  setFont(9, "bold", WHITE)
  pdf.text("LESSON PROGRESSION", pageWidth / 2, y + 7, { align: "center" })
  y += 14

  const stageW    = 30
  const teacherW  = (contentWidth - stageW) / 3
  const learnersW = teacherW
  const assessW   = contentWidth - stageW - teacherW - learnersW

  const stageX    = margin
  const teacherX  = margin + stageW
  const learnersX = teacherX + teacherW
  const assessX   = learnersX + learnersW

  function drawColumnHeaders() {
    drawRect(margin, y, contentWidth, 9, MID_BLUE)
    setFont(7, "bold", WHITE)
    pdf.text("STAGES",               stageX + 2,                    y + 6)
    pdf.text("TEACHER'S ACTIVITIES", teacherX  + teacherW  / 2,     y + 6, { align: "center" })
    pdf.text("LEARNERS' ACTIVITIES", learnersX + learnersW / 2,     y + 6, { align: "center" })
    pdf.text("ASSESSMENT CRITERIA",  assessX   + assessW   / 2,     y + 6, { align: "center" })
    y += 11
  }

  drawColumnHeaders()

  function drawStage(stageName, teacherText, learnersText, assessText) {
    const tLines = wrap(teacherText,  teacherW  - 4)
    const lLines = wrap(learnersText, learnersW - 4)
    const aLines = wrap(assessText,   assessW   - 4)

    const lineH  = 4.2
    const padTop = 4
    const padBot = 3
    const totalLines = Math.max(tLines.length, lLines.length, aLines.length)

    let offset = 0
    let firstChunk = true

    while (offset < totalLines) {
      const spaceLeft = pageHeight - margin - y - padTop - padBot
      const linesPerPage = Math.max(1, Math.floor(spaceLeft / lineH))
      const remaining = totalLines - offset
      const chunkSize = Math.min(linesPerPage, remaining)

      if (chunkSize <= 0 || spaceLeft < lineH + padTop + padBot) {
        pdf.addPage()
        y = margin
        drawColumnHeaders()
        continue
      }

      const tChunk = tLines.slice(offset, offset + chunkSize)
      const lChunk = lLines.slice(offset, offset + chunkSize)
      const aChunk = aLines.slice(offset, offset + chunkSize)
      const rowH   = chunkSize * lineH + padTop + padBot

      // Stage label
      drawRect(stageX, y, stageW, rowH, LIGHT)
      setFont(6.5, "bold", DARK_BLUE)
      const stageLabel = firstChunk ? cleanText(stageName) : cleanText(stageName) + " (cont.)"
      const stageLines = pdf.splitTextToSize(stageLabel, stageW - 4)
      stageLines.forEach((sl, i) => {
        pdf.text(sl, stageX + 2, y + padTop + i * 4)
      })

      // Borders
      pdf.setDrawColor(...MID_BLUE)
      pdf.setLineWidth(0.2)
      pdf.rect(stageX, y, contentWidth, rowH)
      pdf.line(teacherX,  y, teacherX,  y + rowH)
      pdf.line(learnersX, y, learnersX, y + rowH)
      pdf.line(assessX,   y, assessX,   y + rowH)

      // Text
      setFont(7.5, "normal", BLACK)
      tChunk.forEach((line, i) => pdf.text(line, teacherX  + 2, y + padTop + i * lineH))
      lChunk.forEach((line, i) => pdf.text(line, learnersX + 2, y + padTop + i * lineH))
      aChunk.forEach((line, i) => pdf.text(line, assessX   + 2, y + padTop + i * lineH))

      y += rowH
      offset += chunkSize
      firstChunk = false
    }
  }

  drawStage("INTRODUCTION",        planFields.intro_teacher,       planFields.intro_learners,       planFields.intro_assessment)
  drawStage("LESSON DEVELOPMENT",  planFields.development_teacher, planFields.development_learners, planFields.development_assessment)
  drawStage("EXERCISE/ASSESSMENT", planFields.exercise_teacher,    planFields.exercise_learners,    planFields.exercise_assessment)
  drawStage("HOME WORK",           planFields.homework_teacher,    planFields.homework_learners,    planFields.homework_assessment)
  drawStage("CONCLUSION",          planFields.conclusion_teacher,  planFields.conclusion_learners,  planFields.conclusion_assessment)

  y += 6
  checkPage(20)
  setFont(8, "bold", DARK_BLUE)
  pdf.text("LESSON EVALUATION:", margin, y)
  y += 5

  if (planFields.lesson_evaluation && planFields.lesson_evaluation.trim() !== "") {
    setFont(7.5, "normal", BLACK)
    const evalLines = wrap(planFields.lesson_evaluation, contentWidth - 4)
    evalLines.forEach(line => {
      checkPage(6)
      pdf.text(line, margin + 2, y)
      y += 4.5
    })
  }
  y += 4

  pdf.setDrawColor(180, 180, 180)
  pdf.setLineWidth(0.2)
  for (let i = 0; i < 6; i++) {
    checkPage(8)
    pdf.setLineDashPattern([1, 2], 0)
    pdf.line(margin, y, pageWidth - margin, y)
    y += 8
  }
  pdf.setLineDashPattern([], 0)

  const fileName = `LessonPlan_${cleanText(topic.topic_name)}_${cleanText(teacherFields.class_)}_${cleanText(teacherFields.date_)}`
    .replace(/\s+/g, "_").replace(/[^a-zA-Z0-9_.-]/g, "") + ".pdf"
  pdf.save(fileName)
}