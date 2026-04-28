import sqlite3

conn = sqlite3.connect("lesson_planner.db")
cursor = conn.cursor()

# Drop old tables if they exist
cursor.execute("DROP TABLE IF EXISTS topics")
cursor.execute("DROP TABLE IF EXISTS lesson_plans")
cursor.execute("DROP TABLE IF EXISTS teacher_inputs")

# Create syllabus table
cursor.execute("""
CREATE TABLE IF NOT EXISTS syllabus (
    syllabus_id INTEGER PRIMARY KEY AUTOINCREMENT,
    subject TEXT NOT NULL,
    grade TEXT NOT NULL,
    version TEXT,
    year TEXT
)
""")

# Create term_module table
cursor.execute("""
CREATE TABLE IF NOT EXISTS term_module (
    module_id INTEGER PRIMARY KEY AUTOINCREMENT,
    syllabus_id INTEGER,
    term_number INTEGER NOT NULL,
    term_name TEXT NOT NULL,
    FOREIGN KEY (syllabus_id) REFERENCES syllabus(syllabus_id)
)
""")

# Create topic table with all real lesson plan fields
cursor.execute("""
CREATE TABLE IF NOT EXISTS topic (
    topic_id INTEGER PRIMARY KEY AUTOINCREMENT,
    module_id INTEGER,
    topic_name TEXT NOT NULL,
    sub_topic TEXT,
    general_competences TEXT,
    specific_competences TEXT,
    lesson_goal TEXT,
    rationale TEXT,
    prior_knowledge TEXT,
    references_ TEXT,
    expected_standard TEXT,
    FOREIGN KEY (module_id) REFERENCES term_module(module_id)
)
""")

# Create user table
cursor.execute("""
CREATE TABLE IF NOT EXISTS user (
    user_id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    school TEXT,
    preferences TEXT
)
""")

# Create teacher_input table with all real Page 1 fields
cursor.execute("""
CREATE TABLE IF NOT EXISTS teacher_input (
    input_id INTEGER PRIMARY KEY AUTOINCREMENT,
    topic_id INTEGER,
    user_id INTEGER,
    name_of_teacher TEXT,
    class_ TEXT,
    time_ TEXT,
    date_ TEXT,
    duration TEXT,
    no_of_learners INTEGER,
    natural_environment TEXT,
    artificial_environment TEXT,
    technological_environment TEXT,
    teaching_materials TEXT,
    FOREIGN KEY (topic_id) REFERENCES topic(topic_id),
    FOREIGN KEY (user_id) REFERENCES user(user_id)
)
""")

# Create lesson_plan table with all 5 stages x 3 columns
cursor.execute("""
CREATE TABLE IF NOT EXISTS lesson_plan (
    plan_id INTEGER PRIMARY KEY AUTOINCREMENT,
    input_id INTEGER,
    intro_teacher TEXT,
    intro_learners TEXT,
    intro_assessment TEXT,
    development_teacher TEXT,
    development_learners TEXT,
    development_assessment TEXT,
    exercise_teacher TEXT,
    exercise_learners TEXT,
    exercise_assessment TEXT,
    homework_teacher TEXT,
    homework_learners TEXT,
    homework_assessment TEXT,
    conclusion_teacher TEXT,
    conclusion_learners TEXT,
    conclusion_assessment TEXT,
    lesson_evaluation TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (input_id) REFERENCES teacher_input(input_id)
)
""")

conn.commit()
conn.close()
print("Database reset and all tables created successfully!")