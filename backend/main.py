from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import HTTPBearer
from pydantic import BaseModel
import sqlite3
import os
import json
from groq import Groq
from dotenv import load_dotenv
from prompt_builder import build_lesson_plan_prompt
from auth import hash_password, verify_password, create_token, get_current_user

load_dotenv()
client = Groq(api_key=os.getenv("GROQ_API_KEY"))

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

class RegisterRequest(BaseModel):
    name: str
    department: str
    password: str

class LoginRequest(BaseModel):
    name: str
    password: str

@app.get("/")
def root():
    return {"message": "AI Lesson Planner API is running"}

@app.post("/register")
def register(request: RegisterRequest):
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute("SELECT user_id FROM user WHERE name = ?", (request.name,))
    existing = cursor.fetchone()
    if existing:
        conn.close()
        raise HTTPException(status_code=400, detail="A user with this name already exists")
    password_hash = hash_password(request.password)
    cursor.execute("""
        INSERT INTO user (name, department, password_hash)
        VALUES (?, ?, ?)
    """, (request.name, request.department, password_hash))
    user_id = cursor.lastrowid
    conn.commit()
    conn.close()
    token = create_token(user_id, request.name)
    return {
        "success": True,
        "token": token,
        "user": {"user_id": user_id, "name": request.name, "department": request.department}
    }

@app.post("/login")
def login(request: LoginRequest):
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM user WHERE name = ?", (request.name,))
    user = cursor.fetchone()
    conn.close()
    if not user or not verify_password(request.password, user["password_hash"]):
        raise HTTPException(status_code=401, detail="Incorrect name or password")
    token = create_token(user["user_id"], user["name"])
    return {
        "success": True,
        "token": token,
        "user": {
            "user_id": user["user_id"],
            "name": user["name"],
            "department": user["department"]
        }
    }

@app.get("/me")
def get_me(current_user: dict = Depends(get_current_user)):
    return current_user

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
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM topic WHERE topic_id = ?", (request.topic_id,))
    topic = cursor.fetchone()

    if not topic:
        conn.close()
        raise HTTPException(status_code=404, detail="Topic not found")

    topic_data = dict(topic)

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

    try:
        response = client.chat.completions.create(
            model="llama-3.3-70b-versatile",
            messages=[{"role": "user", "content": prompt}],
            temperature=0.7,
        )
        raw_text = response.choices[0].message.content.strip()

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