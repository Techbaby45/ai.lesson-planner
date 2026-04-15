from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from datetime import datetime
from database import init_db, get_db_connection
from seed_data import seed_database
from gemini_integration import generate_lesson_plan, save_lesson_plan

app = FastAPI()

# Data models for requests
class TeacherInputRequest(BaseModel):
    topic_id: int
    name_of_teacher: str
    class_name: str
    date_of_lesson: str  # YYYY-MM-DD format
    duration: int  # in minutes
    no_of_learners: int
    learning_environment: str  # e.g., "classroom", "online"
    teaching_materials: str  # comma-separated list of materials

# Enable CORS for frontend communication
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize database on startup
@app.on_event("startup")
async def startup_event():
    init_db()
    seed_database()
    print("Database initialized and seeded!")

@app.get("/")
def read_root():
    return {"message": "AI Lesson Planner backend is running!"}

# API ENDPOINTS

@app.get("/api/syllabus")
def get_syllabus():
    """Get the Mathematics I Syllabus overview"""
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM syllabus")
    syllabus = cursor.fetchone()
    conn.close()
    
    if syllabus:
        return {
            "syllabus_id": syllabus["syllabus_id"],
            "subject": syllabus["subject"],
            "grade": syllabus["grade"],
            "version": syllabus["version"],
            "year": syllabus["year"]
        }
    return {"error": "Syllabus not found"}

@app.get("/api/terms")
def get_terms():
    """Get all available terms"""
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM term_module ORDER BY term_number")
    terms = cursor.fetchall()
    conn.close()
    
    return [
        {
            "module_id": term["module_id"],
            "term_number": term["term_number"],
            "term_name": term["term_name"]
        }
        for term in terms
    ]

@app.get("/api/topics/{term_id}")
def get_topics_by_term(term_id: int):
    """Get all topics for a specific term"""
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("""
        SELECT * FROM topic 
        WHERE module_id = ? 
        ORDER BY topic_id
    """, (term_id,))
    topics = cursor.fetchall()
    conn.close()
    
    return [
        {
            "topic_id": topic["topic_id"],
            "topic_name": topic["topic_name"],
            "sub_topic": topic["sub_topic"]
        }
        for topic in topics
    ]

@app.get("/api/topic/{topic_id}")
def get_topic_detail(topic_id: int):
    """Get full details of a specific topic"""
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM topic WHERE topic_id = ?", (topic_id,))
    topic = cursor.fetchone()
    conn.close()
    
    if topic:
        return {
            "topic_id": topic["topic_id"],
            "topic_name": topic["topic_name"],
            "sub_topic": topic["sub_topic"],
            "general_competences": topic["general_competences"],
            "specific_competences": topic["specific_competences"],
            "lesson_goal": topic["lesson_goal"],
            "rationale": topic["rationale"],
            "prior_knowledge": topic["prior_knowledge"],
            "references": topic["references"],
            "expected_standard": topic["expected_standard"]
        }
    return {"error": "Topic not found"}

# LESSON PLAN GENERATION ENDPOINTS

@app.post("/api/save-teacher-input")
def save_teacher_input(request: TeacherInputRequest):
    """Save teacher's form inputs and create a record"""
    conn = get_db_connection()
    cursor = conn.cursor()
    
    cursor.execute("""
        INSERT INTO teacher_input (
            topic_id,
            name_of_teacher,
            class,
            date_of_lesson,
            duration,
            no_of_learners,
            learning_environment,
            teaching_materials
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    """, (
        request.topic_id,
        request.name_of_teacher,
        request.class_name,
        request.date_of_lesson,
        request.duration,
        request.no_of_learners,
        request.learning_environment,
        request.teaching_materials
    ))
    
    conn.commit()
    input_id = cursor.lastrowid
    conn.close()
    
    return {
        "input_id": input_id,
        "status": "Teacher input saved successfully",
        "message": "Ready to generate lesson plan"
    }

@app.post("/api/generate-lesson-plan/{input_id}")
def api_generate_lesson_plan(input_id: int):
    """Generate a lesson plan using Gemini AI"""
    try:
        # Generate the lesson plan
        lesson_plan_data = generate_lesson_plan(input_id)
        
        if "error" in lesson_plan_data:
            return {
                "status": "error",
                "message": lesson_plan_data["error"]
            }
        
        # Save to database
        plan_id = save_lesson_plan(input_id, lesson_plan_data)
        
        return {
            "status": "success",
            "plan_id": plan_id,
            "input_id": input_id,
            "lesson_plan": lesson_plan_data
        }
    
    except Exception as e:
        return {
            "status": "error",
            "message": f"Failed to generate lesson plan: {str(e)}"
        }

@app.get("/api/lesson-plan/{plan_id}")
def get_lesson_plan(plan_id: int):
    """Retrieve a saved lesson plan"""
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM lesson_plan WHERE plan_id = ?", (plan_id,))
    plan = cursor.fetchone()
    
    if plan:
        # Get teacher input details too
        cursor.execute("SELECT * FROM teacher_input WHERE input_id = ?", (plan["input_id"],))
        teacher_input = cursor.fetchone()
        
        # Get topic details
        cursor.execute("SELECT * FROM topic WHERE topic_id = ?", (teacher_input["topic_id"],))
        topic = cursor.fetchone()
        
        conn.close()
        
        return {
            "plan_id": plan["plan_id"],
            "teacher_info": {
                "name": teacher_input["name_of_teacher"],
                "class": teacher_input["class"],
                "date": teacher_input["date_of_lesson"],
                "duration": teacher_input["duration"],
                "no_of_learners": teacher_input["no_of_learners"],
                "learning_environment": teacher_input["learning_environment"],
                "teaching_materials": teacher_input["teaching_materials"]
            },
            "topic_info": {
                "topic_name": topic["topic_name"],
                "sub_topic": topic["sub_topic"],
                "specific_competences": topic["specific_competences"],
                "lesson_goal": topic["lesson_goal"]
            },
            "lesson_plan": {
                "introduction": {
                    "teacher_activities": plan["introduction_teacher_activities"],
                    "learner_activities": plan["introduction_learner_activities"],
                    "assessment": plan["introduction_assessment"]
                },
                "development": {
                    "teacher_activities": plan["development_teacher_activities"],
                    "learner_activities": plan["development_learner_activities"],
                    "assessment": plan["development_assessment"]
                },
                "exercise": {
                    "teacher_activities": plan["exercise_teacher_activities"],
                    "learner_activities": plan["exercise_learner_activities"],
                    "assessment": plan["exercise_assessment"]
                },
                "homework": {
                    "teacher_activities": plan["homework_teacher_activities"],
                    "learner_activities": plan["homework_learner_activities"],
                    "assessment": plan["homework_assessment"]
                },
                "conclusion": {
                    "teacher_activities": plan["conclusion_teacher_activities"],
                    "learner_activities": plan["conclusion_learner_activities"],
                    "assessment": plan["conclusion_assessment"]
                },
                "evaluation": plan["lesson_evaluation"]
            }
        }
    
    conn.close()
    return {"error": "Lesson plan not found"}
