from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import HTTPBearer
from pydantic import BaseModel
import sqlite3
import os
import json
import re
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

def clean_json_text(text):
    # Remove markdown code blocks
    if "```" in text:
        text = text.split("```")[1]
        if text.startswith("json"):
            text = text[4:]

    # Extract between first { and last }
    start = text.find("{")
    end = text.rfind("}") + 1
    if start == -1 or end == 0:
        raise Exception("No JSON found in AI response")
    text = text[start:end]

    # Parse character by character to fix control characters
    # only outside of string values
    result = []
    in_string = False
    escape_next = False

    for char in text:
        if escape_next:
            result.append(char)
            escape_next = False
            continue
        if char == '\\':
            escape_next = True
            result.append(char)
            continue
        if char == '"' and not escape_next:
            in_string = not in_string
            result.append(char)
            continue
        if in_string:
            # Inside a string — replace raw control characters safely
            if char == '\n':
                result.append('\\n')
            elif char == '\r':
                result.append('\\r')
            elif char == '\t':
                result.append('\\t')
            elif ord(char) < 32:
                result.append(' ')
            else:
                result.append(char)
        else:
            result.append(char)

    return ''.join(result)

class LessonRequest(BaseModel):
    topic_id: int
    user_id: int
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
def generate_plan(request: LessonRequest, current_user: dict = Depends(get_current_user)):
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
        raw_text = clean_json_text(raw_text)
        lesson_plan_data = json.loads(raw_text)

    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"AI generation failed: {str(e)}"
        )

    cursor.execute("""
        INSERT INTO teacher_input (
            topic_id, user_id, name_of_teacher, class_, time_, date_,
            duration, no_of_learners, natural_environment,
            artificial_environment, technological_environment,
            teaching_materials
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    """, (
        request.topic_id,
        current_user["user_id"],
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
        ""
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
def get_saved_plans(current_user: dict = Depends(get_current_user)):
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute("""
        SELECT lp.plan_id, lp.created_at,
               ti.name_of_teacher, ti.class_, ti.date_,
               t.topic_name, t.sub_topic
        FROM lesson_plan lp
        JOIN teacher_input ti ON lp.input_id = ti.input_id
        JOIN topic t ON ti.topic_id = t.topic_id
        WHERE ti.user_id = ?
        ORDER BY lp.created_at DESC
    """, (current_user["user_id"],))
    plans = cursor.fetchall()
    conn.close()
    return {"saved_plans": [dict(p) for p in plans]}

@app.get("/saved-plans/{plan_id}")
def get_saved_plan(plan_id: int, current_user: dict = Depends(get_current_user)):
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute("""
        SELECT lp.*, ti.name_of_teacher, ti.class_, ti.time_, ti.date_,
               ti.duration, ti.no_of_learners, ti.natural_environment,
               ti.artificial_environment, ti.technological_environment,
               ti.teaching_materials,
               t.topic_name, t.sub_topic, t.general_competences,
               t.specific_competences, t.lesson_goal, t.rationale,
               t.prior_knowledge, t.references_, t.expected_standard
        FROM lesson_plan lp
        JOIN teacher_input ti ON lp.input_id = ti.input_id
        JOIN topic t ON ti.topic_id = t.topic_id
        WHERE lp.plan_id = ? AND ti.user_id = ?
    """, (plan_id, current_user["user_id"]))
    row = cursor.fetchone()
    conn.close()
    if not row:
        raise HTTPException(status_code=404, detail="Plan not found")
    row = dict(row)
    return {
        "topic": {
            "topic_name": row["topic_name"],
            "sub_topic": row["sub_topic"],
            "general_competences": row["general_competences"],
            "specific_competences": row["specific_competences"],
            "lesson_goal": row["lesson_goal"],
            "rationale": row["rationale"],
            "prior_knowledge": row["prior_knowledge"],
            "references_": row["references_"],
            "expected_standard": row["expected_standard"],
        },
        "teacher_input": {
            "name_of_teacher": row["name_of_teacher"],
            "class_": row["class_"],
            "time_": row["time_"],
            "date_": row["date_"],
            "duration": row["duration"],
            "no_of_learners": row["no_of_learners"],
            "natural_environment": row["natural_environment"],
            "artificial_environment": row["artificial_environment"],
            "technological_environment": row["technological_environment"],
            "teaching_materials": row["teaching_materials"],
        },
        "lesson_plan": {
            "intro_teacher": row["intro_teacher"],
            "intro_learners": row["intro_learners"],
            "intro_assessment": row["intro_assessment"],
            "development_teacher": row["development_teacher"],
            "development_learners": row["development_learners"],
            "development_assessment": row["development_assessment"],
            "exercise_teacher": row["exercise_teacher"],
            "exercise_learners": row["exercise_learners"],
            "exercise_assessment": row["exercise_assessment"],
            "homework_teacher": row["homework_teacher"],
            "homework_learners": row["homework_learners"],
            "homework_assessment": row["homework_assessment"],
            "conclusion_teacher": row["conclusion_teacher"],
            "conclusion_learners": row["conclusion_learners"],
            "conclusion_assessment": row["conclusion_assessment"],
            "lesson_evaluation": row["lesson_evaluation"] or "",
        }
    }