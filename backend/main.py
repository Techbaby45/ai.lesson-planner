from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from database import init_db, get_db_connection
from seed_data import seed_database

app = FastAPI()

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
