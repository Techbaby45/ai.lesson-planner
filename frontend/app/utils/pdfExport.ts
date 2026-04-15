import html2pdf from 'html2pdf.js';

export async function exportToPDF(plan: any) {
  // Create HTML content for PDF
  const htmlContent = `
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        * {
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        }
        body {
          margin: 20px;
          line-height: 1.6;
        }
        .header {
          text-align: center;
          margin-bottom: 30px;
          border-bottom: 3px solid #2563eb;
          padding-bottom: 15px;
        }
        .header h1 {
          margin: 0;
          color: #1f2937;
          font-size: 24px;
        }
        .header p {
          margin: 5px 0;
          color: #6b7280;
        }
        .info-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 10px;
          margin-bottom: 20px;
          page-break-inside: avoid;
        }
        .info-item {
          background: #f3f4f6;
          padding: 10px;
          border-radius: 5px;
        }
        .info-item strong {
          display: block;
          color: #1f2937;
          margin-bottom: 3px;
        }
        .info-item span {
          color: #4b5563;
          font-size: 14px;
        }
        .competences-box {
          background: #ede9fe;
          border-left: 4px solid #6366f1;
          padding: 15px;
          margin-bottom: 20px;
          page-break-inside: avoid;
        }
        .competences-box h3 {
          margin-top: 0;
          color: #4f46e5;
        }
        .section {
          margin-bottom: 25px;
          page-break-inside: avoid;
        }
        .section h2 {
          background: #2563eb;
          color: white;
          padding: 10px 15px;
          margin-top: 0;
          border-radius: 5px;
          font-size: 16px;
        }
        .section-content {
          background: #f9fafb;
          padding: 15px;
          border: 1px solid #e5e7eb;
          border-radius: 5px;
        }
        .activity {
          margin-bottom: 12px;
          padding: 10px;
          background: white;
          border-left: 3px solid #3b82f6;
          page-break-inside: avoid;
        }
        .activity-title {
          font-weight: bold;
          color: #1f2937;
          margin-bottom: 5px;
          text-transform: capitalize;
        }
        .activity-content {
          color: #4b5563;
          font-size: 13px;
          white-space: pre-wrap;
          word-wrap: break-word;
        }
        .evaluation {
          background: #f0fdf4;
          border-left: 4px solid #16a34a;
          padding: 15px;
          margin-bottom: 20px;
          page-break-inside: avoid;
        }
        .evaluation h2 {
          color: #15803d;
          margin-top: 0;
        }
        .footer {
          margin-top: 30px;
          padding-top: 20px;
          border-top: 2px solid #e5e7eb;
          text-align: center;
          color: #9ca3af;
          font-size: 12px;
        }
        @media print {
          body { margin: 0; }
          .page-break { page-break-after: always; }
        }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>${plan.topic_detail.topic_name}</h1>
        <p><strong>Sub-topic:</strong> ${plan.topic_detail.sub_topic}</p>
      </div>

      <div class="info-grid">
        <div class="info-item">
          <strong>Teacher</strong>
          <span>${plan.form_data.teacher_name}</span>
        </div>
        <div class="info-item">
          <strong>Class</strong>
          <span>${plan.form_data.class_name}</span>
        </div>
        <div class="info-item">
          <strong>Date</strong>
          <span>${plan.form_data.date_of_lesson}</span>
        </div>
        <div class="info-item">
          <strong>Duration</strong>
          <span>${plan.form_data.duration} minutes</span>
        </div>
        <div class="info-item">
          <strong>Number of Learners</strong>
          <span>${plan.form_data.no_of_learners}</span>
        </div>
        <div class="info-item">
          <strong>Learning Environment</strong>
          <span>${plan.form_data.learning_environment}</span>
        </div>
        <div class="info-item">
          <strong>Teaching Materials</strong>
          <span>${plan.form_data.teaching_materials}</span>
        </div>
      </div>

      <div class="competences-box">
        <h3>Lesson Goal</h3>
        <p>${plan.topic_detail.lesson_goal}</p>
        <h3>Specific Competences</h3>
        <p>${plan.topic_detail.specific_competences}</p>
      </div>

      <!-- Introduction Section -->
      <div class="section">
        <h2>1. INTRODUCTION</h2>
        <div class="section-content">
          ${renderActivitySection(plan.lesson_plan.introduction)}
        </div>
      </div>

      <!-- Lesson Development Section -->
      <div class="section">
        <h2>2. LESSON DEVELOPMENT</h2>
        <div class="section-content">
          ${renderActivitySection(plan.lesson_plan.development)}
        </div>
      </div>

      <!-- Exercise & Assessment Section -->
      <div class="section">
        <h2>3. EXERCISE & ASSESSMENT</h2>
        <div class="section-content">
          ${renderActivitySection(plan.lesson_plan.exercise)}
        </div>
      </div>

      <!-- Homework Section -->
      <div class="section">
        <h2>4. HOMEWORK</h2>
        <div class="section-content">
          ${renderActivitySection(plan.lesson_plan.homework)}
        </div>
      </div>

      <!-- Conclusion Section -->
      <div class="section">
        <h2>5. CONCLUSION</h2>
        <div class="section-content">
          ${renderActivitySection(plan.lesson_plan.conclusion)}
        </div>
      </div>

      <!-- Lesson Evaluation -->
      <div class="evaluation">
        <h2>LESSON EVALUATION</h2>
        <div class="activity-content">${plan.lesson_plan.evaluation}</div>
      </div>

      <div class="footer">
        <p>Generated by AI Lesson Planner | Based on Zambian Mathematics Curriculum</p>
        <p>Generated on ${new Date().toLocaleDateString()}</p>
      </div>
    </body>
    </html>
  `;

  const opt = {
    margin: 10,
    filename: `lesson-plan-${plan.topic_detail.topic_name.replace(/\s+/g, '-')}-${new Date().getTime()}.pdf`,
    image: { type: 'jpeg', quality: 0.98 },
    html2canvas: { scale: 2 },
    jsPDF: { orientation: 'portrait', unit: 'mm', format: 'a4' }
  };

  html2pdf().set(opt).from(htmlContent).save();
}

function renderActivitySection(activities: any): string {
  let html = '';
  for (const [key, value] of Object.entries(activities)) {
    html += `
      <div class="activity">
        <div class="activity-title">${String(key).replace(/_/g, ' ')}</div>
        <div class="activity-content">${String(value)}</div>
      </div>
    `;
  }
  return html;
}
