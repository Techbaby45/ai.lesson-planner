import sqlite3
import os

# Get the database path - store in backend directory
DB_PATH = os.path.join(os.path.dirname(__file__), "lesson_planner.db")

def init_db():
    """Initialize the database with all required tables based on System Design document"""
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    
    # TABLE 1: Syllabus - the official Zambian Mathematics I Syllabus
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS syllabus (
            syllabus_id INTEGER PRIMARY KEY AUTOINCREMENT,
            subject TEXT NOT NULL,
            grade TEXT NOT NULL,
            version TEXT NOT NULL,
            year INTEGER NOT NULL
        )
    """)
    
    # TABLE 2: Term Module - organizes topics by term (Term 1, 2, 3)
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS term_module (
            module_id INTEGER PRIMARY KEY AUTOINCREMENT,
            syllabus_id INTEGER NOT NULL,
            term_number INTEGER NOT NULL,
            term_name TEXT NOT NULL,
            FOREIGN KEY (syllabus_id) REFERENCES syllabus(syllabus_id)
        )
    """)
    
    # TABLE 3: Topic - each topic with full pedagogical detail
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS topic (
            topic_id INTEGER PRIMARY KEY AUTOINCREMENT,
            module_id INTEGER NOT NULL,
            topic_name TEXT NOT NULL,
            sub_topic TEXT,
            general_competences TEXT,
            specific_competences TEXT NOT NULL,
            lesson_goal TEXT NOT NULL,
            rationale TEXT,
            prior_knowledge TEXT,
            references TEXT,
            expected_standard TEXT,
            FOREIGN KEY (module_id) REFERENCES term_module(module_id)
        )
    """)
    
    # TABLE 4: User - teacher information
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS user (
            user_id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            school TEXT,
            email TEXT UNIQUE,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    """)
    
    # TABLE 5: Teacher Input - what the teacher enters on the form
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS teacher_input (
            input_id INTEGER PRIMARY KEY AUTOINCREMENT,
            topic_id INTEGER NOT NULL,
            user_id INTEGER,
            name_of_teacher TEXT NOT NULL,
            class TEXT NOT NULL,
            date_of_lesson DATE NOT NULL,
            duration INTEGER NOT NULL,
            no_of_learners INTEGER NOT NULL,
            learning_environment TEXT,
            teaching_materials TEXT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (topic_id) REFERENCES topic(topic_id),
            FOREIGN KEY (user_id) REFERENCES user(user_id)
        )
    """)
    
    # TABLE 6: Lesson Plan - the complete generated lesson plan
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS lesson_plan (
            plan_id INTEGER PRIMARY KEY AUTOINCREMENT,
            input_id INTEGER NOT NULL UNIQUE,
            introduction_teacher_activities TEXT,
            introduction_learner_activities TEXT,
            introduction_assessment TEXT,
            development_teacher_activities TEXT,
            development_learner_activities TEXT,
            development_assessment TEXT,
            exercise_teacher_activities TEXT,
            exercise_learner_activities TEXT,
            exercise_assessment TEXT,
            homework_teacher_activities TEXT,
            homework_learner_activities TEXT,
            homework_assessment TEXT,
            conclusion_teacher_activities TEXT,
            conclusion_learner_activities TEXT,
            conclusion_assessment TEXT,
            lesson_evaluation TEXT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (input_id) REFERENCES teacher_input(input_id)
        )
    """)
    
    conn.commit()
    conn.close()
    print("Database tables created successfully!")

def get_db_connection():
    """Get a database connection"""
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row  # This allows us to access columns by name
    return conn

if __name__ == "__main__":
    init_db()

