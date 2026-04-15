# AI LESSON PLANNER - COMPLETE SETUP & USER GUIDE

**Project Status:** Ready for Testing & Submission
**Last Updated:** 2024
**For:** Secondary School Form 1 Mathematics (Zambian Curriculum)

---

## TABLE OF CONTENTS
1. [What This System Does](#what-this-system-does)
2. [System Architecture](#system-architecture)
3. [Quick Start](#quick-start)
4. [Installation & Setup](#installation--setup)
5. [Running the Application](#running-the-application)
6. [How to Use](#how-to-use)
7. [Database Schema](#database-schema)
8. [API Endpoints](#api-endpoints)
9. [Troubleshooting](#troubleshooting)

---

## What This System Does

The **AI Lesson Planner** is an intelligent system that helps mathematics teachers in Zambia create comprehensive lesson plans in just 2 minutes instead of 60+ minutes.

**Key Features:**
- ✅ Official Zambian Mathematics Form 1 Curriculum Data
- ✅ AI-Powered Lesson Plan Generation (using Google Gemini)
- ✅ Teacher Input Form for Context
- ✅ Complete Lesson Plan with 5 Sections
- ✅ PDF Export for Printing
- ✅ Customizable Content

**What Gets Generated:**
1. **Introduction** (Teacher & Learner Activities, Assessment)
2. **Lesson Development** (Teaching strategies, practice activities)
3. **Exercise & Assessment** (Practice problems, mastery checks)
4. **Homework** (Assignments with assessment plan)
5. **Conclusion** (Summary, reflection)
6. **Lesson Evaluation** (Self-assessment for teacher)

---

## System Architecture

```
┌─────────────────────────────────────────────────────┐
│         FRONTEND (Next.js React)                    │
│  - Home Page                                        │
│  - Lesson Plan Form (Teacher Input)                 │
│  - Lesson Plan Display                              │
│  - PDF Export                                       │
└──────────────┬──────────────────────────────────────┘
               │
               │ HTTP Requests
               ▼
┌─────────────────────────────────────────────────────┐
│         BACKEND (Python FastAPI)                    │
│  - Database Connection                              │
│  - API Endpoints                                    │
│  - Gemini AI Integration                            │
│  - Lesson Plan Generation Logic                     │
└──────────────┬──────────────────────────────────────┘
               │
               │ SQL Queries
               ▼
┌─────────────────────────────────────────────────────┐
│         DATABASE (SQLite)                           │
│  - Syllabus Data                                    │
│  - Topics (Form 1)                                  │
│  - Teacher Inputs                                   │
│  - Generated Lesson Plans                           │
└─────────────────────────────────────────────────────┘
```

---

## Quick Start

### Prerequisites
- Python 3.9+
- Node.js 18+
- Google Gemini API Key (free)
- Git

### Get Your Gemini API Key (2 minutes)
1. Go to [Google AI Studio](https://aistudio.google.com/app/apikey)
2. Click "Create API Key"
3. Copy your API key
4. **KEEP THIS SECRET - don't share with anyone**

### Installation

```bash
# Clone the repository (or use your existing project)
cd ai-lesson-planner

# Set up Backend
cd backend
pip install -r requirements.txt

# Set up Frontend
cd ../frontend
npm install

# Add your Gemini API Key
# Create a .env.local file in the backend folder with:
# GEMINI_API_KEY=your_api_key_here
```

---

## Running the Application

### Step 1: Start the Backend

```bash
cd backend
export GEMINI_API_KEY="your-api-key-here"  # Linux/Mac
# or on Windows:
set GEMINI_API_KEY=your-api-key-here

# Run the backend
python -m uvicorn main:app --reload --port 8000
```

You should see:
```
INFO:     Uvicorn running on http://127.0.0.1:8000
Database initialized and seeded!
```

### Step 2: Start the Frontend

```bash
cd frontend

# Create .env.local file
echo "NEXT_PUBLIC_BACKEND_URL=http://localhost:8000" > .env.local

# Run the frontend
npm run dev
```

You should see:
```
> Ready in 2.3s
> Local: http://localhost:3000
```

### Step 3: Open in Browser

Visit: **http://localhost:3000**

---

## How to Use

### User Journey

**1. Home Page**
- See what the system does
- Click "Start Creating Lesson Plan"

**2. Lesson Plan Form**
- **Step 1:** Select Term (Only Term 1 available now)
- **Step 2:** Select Topic (4 topics available)
- **Step 3:** Fill in Teacher Information
  - Your name
  - Class (e.g., 1A)
  - Date of lesson
  - Duration (minutes)
  - Number of learners
  - Learning environment (Classroom/Online)
  - Available materials (textbook, whiteboard, etc.)
- **Step 4:** Click "Generate Lesson Plan with AI"

**3. Generated Lesson Plan**
- Review all 5 sections
- Read the AI-generated activities
- Edit if needed (click on any section)
- Download as PDF
- Create another plan

**4. PDF Download**
- Save to your computer
- Print and use in class
- Share with other teachers

---

## Database Schema

### 1. **syllabus**
Stores the official Mathematics I Syllabus

| Field | Type | Description |
|-------|------|-------------|
| syllabus_id | INTEGER | Primary Key |
| subject | TEXT | "Mathematics I" |
| grade | TEXT | "Form 1" |
| version | TEXT | "2024" |
| year | INTEGER | Year created |

### 2. **term_module**
Organizes topics by term (Term 1, 2, 3)

| Field | Type | Description |
|-------|------|-------------|
| module_id | INTEGER | Primary Key |
| syllabus_id | INTEGER | Foreign Key |
| term_number | INTEGER | 1, 2, or 3 |
| term_name | TEXT | "Term 1" |

### 3. **topic**
The actual topics with pedagogical details

| Field | Type | Description |
|-------|------|-------------|
| topic_id | INTEGER | Primary Key |
| module_id | INTEGER | Foreign Key to term_module |
| topic_name | TEXT | e.g., "Numbers" |
| sub_topic | TEXT | e.g., "Classification of Numbers" |
| general_competences | TEXT | From Zambian curriculum |
| specific_competences | TEXT | From Zambian curriculum |
| lesson_goal | TEXT | What students should learn |
| rationale | TEXT | Why this topic matters |
| prior_knowledge | TEXT | What students should know before |
| references | TEXT | Page numbers from module |
| expected_standard | TEXT | Expected outcomes |

### 4. **teacher_input**
Stores what the teacher fills in the form

| Field | Type | Description |
|-------|------|-------------|
| input_id | INTEGER | Primary Key |
| topic_id | INTEGER | Foreign Key to topic |
| name_of_teacher | TEXT | Teacher's name |
| class | TEXT | e.g., "1A" |
| date_of_lesson | DATE | Lesson date |
| duration | INTEGER | Minutes |
| no_of_learners | INTEGER | Student count |
| learning_environment | TEXT | classroom/online |
| teaching_materials | TEXT | Available resources |

### 5. **lesson_plan**
The generated lesson plan

| Field | Type | Description |
|-------|------|-------------|
| plan_id | INTEGER | Primary Key |
| input_id | INTEGER | Foreign Key (unique) |
| introduction_teacher_activities | TEXT | Generated |
| introduction_learner_activities | TEXT | Generated |
| introduction_assessment | TEXT | Generated |
| development_teacher_activities | TEXT | Generated |
| ... (continues for all sections) | | |
| lesson_evaluation | TEXT | Generated |

---

## API Endpoints

### GET Endpoints (Read Data)

**1. Get Syllabus**
```
GET /api/syllabus
Returns: Syllabus overview
```

**2. Get All Terms**
```
GET /api/terms
Returns: [{module_id, term_number, term_name}, ...]
```

**3. Get Topics for a Term**
```
GET /api/topics/{term_id}
Returns: [{topic_id, topic_name, sub_topic}, ...]
```

**4. Get Full Topic Details**
```
GET /api/topic/{topic_id}
Returns: Complete topic with competences, goals, rationale, etc.
```

**5. Get Saved Lesson Plan**
```
GET /api/lesson-plan/{plan_id}
Returns: Full lesson plan with all sections and teacher info
```

### POST Endpoints (Create Data)

**1. Save Teacher Input**
```
POST /api/save-teacher-input
Body: {
  "topic_id": 1,
  "name_of_teacher": "John Doe",
  "class_name": "1A",
  "date_of_lesson": "2024-01-15",
  "duration": 45,
  "no_of_learners": 35,
  "learning_environment": "classroom",
  "teaching_materials": "textbook, whiteboard"
}
Returns: {input_id, status, message}
```

**2. Generate Lesson Plan**
```
POST /api/generate-lesson-plan/{input_id}
Returns: {
  status: "success",
  plan_id: 1,
  input_id: 1,
  lesson_plan: {all sections}
}
```

---

## Troubleshooting

### Issue: Backend won't start

**Error:** `ModuleNotFoundError: No module named 'fastapi'`

**Solution:**
```bash
pip install -r requirements.txt
```

### Issue: Frontend can't connect to backend

**Error:** `fetch failed` or `ConnectionRefused`

**Solution:**
1. Make sure backend is running on port 8000
2. Check `.env.local` in frontend folder has correct URL:
   ```
   NEXT_PUBLIC_BACKEND_URL=http://localhost:8000
   ```
3. Restart both servers

### Issue: Gemini API returns error

**Error:** `API key invalid` or `quota exceeded`

**Solution:**
1. Check your API key is correct
2. Visit [Google AI Studio](https://aistudio.google.com/app/apikey) to verify
3. Ensure your API key is in the backend `.env` file
4. Note: Free tier has rate limits (60 requests/minute)

### Issue: No topics showing up

**Error:** Dropdown is empty

**Solution:**
1. Backend database might not be seeded
2. Check backend logs for initialization message
3. Restart backend - it auto-seeds on startup
4. Delete `backend/lesson_planner.db` and restart

### Issue: PDF export not working

**Error:** PDF doesn't download

**Solution:**
1. Check browser console for errors
2. Ensure `html2pdf.js` is installed:
   ```bash
   npm install html2pdf.js
   ```
3. Try exporting again

---

## File Structure

```
ai-lesson-planner/
├── backend/
│   ├── main.py                    # FastAPI app + API endpoints
│   ├── database.py                # Database schema
│   ├── seed_data.py              # Populate Form 1 topics
│   ├── gemini_integration.py      # AI lesson plan generation
│   ├── requirements.txt           # Python dependencies
│   └── lesson_planner.db          # SQLite database (auto-created)
│
├── frontend/
│   ├── app/
│   │   ├── page.tsx               # Home page
│   │   ├── components/
│   │   │   ├── LessonPlanForm.tsx # Form component
│   │   │   └── LessonPlanDisplay.tsx  # Display component
│   │   └── utils/
│   │       └── pdfExport.ts       # PDF generation
│   ├── package.json
│   ├── next.config.js
│   └── .env.local                 # Gemini API key
│
├── README.md
├── COMPLETE_SETUP_GUIDE.md        # This file
└── .gitignore
```

---

## Data Sources

All official data comes from:
1. **Zambian Mathematics Syllabus (Forms 1-4)** - Official curriculum
2. **Mathematics Module for Form 1 - Term 1** - Teaching guide
3. **System Design Document** - Project architecture

**Topics Implemented (Form 1 - Term 1):**
1. Numbers (Classification & Combined Operations)
2. Integers (Four Operations)
3. Approximation & Estimation
4. Sets (Operations on Sets)

---

## Next Steps (Future Enhancement)

To add more topics/terms:

1. Extract data from your syllabus documents
2. Update `backend/seed_data.py` with new topics
3. Restart backend
4. New topics will appear in frontend dropdown

Example format:
```python
{
    "topic_name": "Topic Name",
    "sub_topic": "Sub-topic",
    "general_competences": "...",
    "specific_competences": "...",
    "lesson_goal": "...",
    "rationale": "...",
    "prior_knowledge": "...",
    "references": "Page numbers",
    "expected_standard": "..."
}
```

---

## Support & Debugging

If something doesn't work:

1. **Check the console logs** - Both browser (F12) and terminal
2. **Verify all services are running** - Backend and Frontend
3. **Clear browser cache** - Ctrl+Shift+Delete
4. **Restart everything** - Stop and restart both servers
5. **Check file permissions** - Database file should be readable/writable

---

## Submission Checklist

- [x] Database with official Form 1 topics
- [x] Backend API endpoints
- [x] Gemini AI integration
- [x] Frontend form interface
- [x] Lesson plan display
- [x] PDF export
- [x] GitHub repository
- [x] Documentation

---

**Ready for testing and submission!** 

For questions about setup, see the troubleshooting section or check the code comments.
