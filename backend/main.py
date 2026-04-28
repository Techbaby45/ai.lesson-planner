from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import sqlite3
import os
import json
import google.generativeai as genai
from dotenv import load_dotenv
from prompt_builder import build_lesson_plan_prompt

load_dotenv()
genai.configure(api_key=os.getenv("GEMINI_API_KEY"))

app = FastAPI(title="AI Lesson Planner API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

def get_db():
    conn = sqlite3.connect("lesson_planner.db")
    conn.row_factory = sqlite3.Row
    return conn

# Input model — matches exactly what the teacher fills on Page 1
class LessonRequest(BaseModel):
    topic_id: int
    name_of_teacher: str
    class_: str
    time_: str
    date_: str
    duration: str
    no_of_learners: int
    natural_environment: str
    artificial_environment: str
    technological_environment: str
    teaching_materials: str

@app.get("/")
def root():
    return {"message": "AI Lesson Planner API is running"}

@app.get("/topics")
def get_topics():
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute("""
        SELECT t.*, tm.term_name, tm.term_number
        FROM topic t
        JOIN term_module tm ON t.module_id = tm.module_id
        ORDER BY tm.term_number, t.topic_id
    """)
    topics = cursor.fetchall()
    conn.close()
    return {"topics": [dict(t) for t in topics]}

@app.get("/topics/{topic_id}")
def get_topic(topic_id: int):
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM topic WHERE topic_id = ?", (topic_id,))
    topic = cursor.fetchone()
    conn.close()
    if not topic:
        raise HTTPException(status_code=404, detail="Topic not found")
    return dict(topic)

@app.post("/generate-plan")
def generate_plan(request: LessonRequest):
    # Step 1: Get topic from database
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM topic WHERE topic_id = ?", (request.topic_id,))
    topic = cursor.fetchone()

    if not topic:
        conn.close()
        raise HTTPException(status_code=404, detail="Topic not found")

    topic_data = dict(topic)

    # Step 2: Build the prompt
    teacher_input = {
        "name_of_teacher": request.name_of_teacher,
        "class_": request.class_,
        "time_": request.time_,
        "date_": request.date_,
        "duration": request.duration,
        "no_of_learners": request.no_of_learners,
        "natural_environment": request.natural_environment,
        "artificial_environment": request.artificial_environment,
        "technological_environment": request.technological_environment,
        "teaching_materials": request.teaching_materials,
    }

    prompt = build_lesson_plan_prompt(topic_data, teacher_input)

    # Step 3: Call Gemini API
    try:
        model = genai.GenerativeModel("gemini-2.5-flash")
        response = model.generate_content(prompt)
        raw_text = response.text.strip()

        # Clean the response (remove markdown code blocks if present)
        if raw_text.startswith("```"):
            raw_text = raw_text.split("```")[1]
            if raw_text.startswith("json"):
                raw_text = raw_text[4:]
        raw_text = raw_text.strip()

        lesson_plan_data = json.loads(raw_text)

    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"AI generation failed: {str(e)}"
        )

    # Step 4: Save teacher input to database
    cursor.execute("""
        INSERT INTO teacher_input (
            topic_id, name_of_teacher, class_, time_, date_,
            duration, no_of_learners, natural_environment,
            artificial_environment, technological_environment,
            teaching_materials
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    """, (
        request.topic_id,
        request.name_of_teacher, request.class_,
        request.time_, request.date_, request.duration,
        request.no_of_learners, request.natural_environment,
        request.artificial_environment, request.technological_environment,
        request.teaching_materials
    ))
    input_id = cursor.lastrowid

    # Step 5: Save lesson plan to database
    cursor.execute("""
        INSERT INTO lesson_plan (
            input_id, intro_teacher, intro_learners, intro_assessment,
            development_teacher, development_learners, development_assessment,
            exercise_teacher, exercise_learners, exercise_assessment,
            homework_teacher, homework_learners, homework_assessment,
            conclusion_teacher, conclusion_learners, conclusion_assessment,
            lesson_evaluation
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    """, (
        input_id,
        lesson_plan_data.get("intro_teacher", ""),
        lesson_plan_data.get("intro_learners", ""),
        lesson_plan_data.get("intro_assessment", ""),
        lesson_plan_data.get("development_teacher", ""),
        lesson_plan_data.get("development_learners", ""),
        lesson_plan_data.get("development_assessment", ""),
        lesson_plan_data.get("exercise_teacher", ""),
        lesson_plan_data.get("exercise_learners", ""),
        lesson_plan_data.get("exercise_assessment", ""),
        lesson_plan_data.get("homework_teacher", ""),
        lesson_plan_data.get("homework_learners", ""),
        lesson_plan_data.get("homework_assessment", ""),
        lesson_plan_data.get("conclusion_teacher", ""),
        lesson_plan_data.get("conclusion_learners", ""),
        lesson_plan_data.get("conclusion_assessment", ""),
        lesson_plan_data.get("lesson_evaluation", "")
    ))

    conn.commit()
    conn.close()

    # Step 6: Return everything the frontend needs
    return {
        "success": True,
        "input_id": input_id,
        "topic": topic_data,
        "teacher_input": teacher_input,
        "lesson_plan": lesson_plan_data
    }

@app.get("/saved-plans")
def get_saved_plans():
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute("""
        SELECT lp.plan_id, lp.created_at,
               ti.name_of_teacher, ti.class_, ti.date_,
               t.topic_name, t.sub_topic
        FROM lesson_plan lp
        JOIN teacher_input ti ON lp.input_id = ti.input_id
        JOIN topic t ON ti.topic_id = t.topic_id
        ORDER BY lp.created_at DESC
    """)
    plans = cursor.fetchall()
    conn.close()
    return {"saved_plans": [dict(p) for p in plans]}