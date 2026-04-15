"""
SEED DATA SCRIPT
This script populates the database with REAL data from:
- Official Zambian Mathematics I Syllabus (Form 1)
- Mathematics I Teaching Module for Form 1: Term 1
All data is extracted directly from the attached official documents.
"""

import sqlite3
from database import DB_PATH, init_db

def seed_database():
    """Populate the database with official Form 1 topics and their data"""
    
    # Initialize database first
    init_db()
    
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    
    # STEP 1: Insert the Syllabus
    cursor.execute("""
        INSERT INTO syllabus (subject, grade, version, year)
        VALUES (?, ?, ?, ?)
    """, ("Mathematics I", "Form 1", "2024", 2024))
    
    syllabus_id = cursor.lastrowid
    
    # STEP 2: Insert Term 1 Module
    cursor.execute("""
        INSERT INTO term_module (syllabus_id, term_number, term_name)
        VALUES (?, ?, ?)
    """, (syllabus_id, 1, "Term 1"))
    
    module_id = cursor.lastrowid
    
    # STEP 3: Insert all 4 FORM 1 TOPICS (from official syllabus + teaching module)
    
    topics_data = [
        {
            "topic_name": "Numbers",
            "sub_topic": "Classification of Numbers and Combined Operations",
            "general_competences": "Analytical Thinking, Communication, Problem Solving, Collaboration, Financial Literacy, Digital literacy, Creativity",
            "specific_competences": "Apply classification of numbers in real life situations; Apply combined operations on real numbers in real life situations",
            "lesson_goal": "Understand the classification of numbers (natural, whole, integers, prime, composite, rational, irrational) and apply combined operations on real numbers in real-world scenarios such as budgeting, calculating costs, and managing finances.",
            "rationale": "Numbers are the foundation of mathematics and play an important role in our daily lives. They are used to quantify, measure, and make comparisons in different aspects of our day-to-day life situations. Understanding numbers helps us make informed decisions, solve problems and understand the world around us.",
            "prior_knowledge": "Basic counting, simple arithmetic operations, understanding of positive and negative numbers",
            "references": "Mathematics I Teaching Module Form 1: Term 1, Pages 10-23; Zambia Mathematics I Syllabus",
            "expected_standard": "Numbers applied in real life situations consistently; Combined operations on real numbers applied in everyday life situations correctly"
        },
        {
            "topic_name": "Integers",
            "sub_topic": "The Four Operations on Integers",
            "general_competences": "Critical thinking, Analytical Thinking, Creativity and Innovation, problem solving, digital literacy, collaboration and Communication",
            "specific_competences": "Use integers in real life situations involving addition, subtraction, multiplication, and division",
            "lesson_goal": "Master the four basic operations (addition, subtraction, multiplication, and division) on integers and apply them to real-world scenarios such as temperature changes, financial transactions, and altitude measurements.",
            "rationale": "Integers are the building blocks of mathematics. Mastering integers is key to understanding essential math operations like addition, subtraction, multiplication, and division, which lay the groundwork for tackling more complex concepts. Operations on integers can be useful in areas such as calculating temperatures, managing finances, and measuring changes in various contexts.",
            "prior_knowledge": "Understanding of positive and negative numbers, basic arithmetic operations",
            "references": "Mathematics I Teaching Module Form 1: Term 1, Pages 24-41; Zambia Mathematics I Syllabus",
            "expected_standard": "Integers and their operations applied in real-life contexts accurately and consistently"
        },
        {
            "topic_name": "Approximation and Estimation",
            "sub_topic": "Approximations and Estimations",
            "general_competences": "Problem Solving, Analytical Thinking, Communication, Critical thinking",
            "specific_competences": "Apply approximation and estimation techniques in real-world problem solving",
            "lesson_goal": "Understand and apply approximation and estimation techniques to solve problems in real-life situations such as rounding numbers, estimating quantities, and making reasonable predictions.",
            "rationale": "Approximation and estimation are practical skills used in everyday life to make quick calculations and decisions. These techniques help learners develop number sense and the ability to judge whether answers are reasonable without relying solely on exact calculations.",
            "prior_knowledge": "Understanding of place value, rounding to nearest 10, 100, and 1000",
            "references": "Mathematics I Teaching Module Form 1: Term 1, Pages 42-63; Zambia Mathematics I Syllabus",
            "expected_standard": "Approximation and estimation techniques applied appropriately in practical situations"
        },
        {
            "topic_name": "Sets",
            "sub_topic": "Operations on Sets",
            "general_competences": "Analytical Thinking, Problem Solving, Communication, Logical Reasoning, Creativity",
            "specific_competences": "Apply set notation and operations (union, intersection, complement) in real-world situations",
            "lesson_goal": "Understand set notation, represent sets using different methods, and apply set operations (union, intersection, complement, difference) to solve real-world classification and grouping problems.",
            "rationale": "Sets provide a fundamental way to organize, classify, and group objects or numbers based on common properties. This is essential for logical thinking and serves as a foundation for more advanced mathematical concepts. Set theory is used in practical situations such as data classification, survey analysis, and categorization of information.",
            "prior_knowledge": "Understanding of classification, properties of numbers, basic logical reasoning",
            "references": "Mathematics I Teaching Module Form 1: Term 1, Pages 64-79; Zambia Mathematics I Syllabus",
            "expected_standard": "Set operations applied correctly in organizing and solving real-world grouping and classification problems"
        }
    ]
    
    # Insert each topic
    for topic_data in topics_data:
        cursor.execute("""
            INSERT INTO topic 
            (module_id, topic_name, sub_topic, general_competences, specific_competences, 
             lesson_goal, rationale, prior_knowledge, references, expected_standard)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        """, (
            module_id,
            topic_data["topic_name"],
            topic_data["sub_topic"],
            topic_data["general_competences"],
            topic_data["specific_competences"],
            topic_data["lesson_goal"],
            topic_data["rationale"],
            topic_data["prior_knowledge"],
            topic_data["references"],
            topic_data["expected_standard"]
        ))
    
    conn.commit()
    conn.close()
    
    print("✓ Database seeded successfully!")
    print("✓ Inserted: 1 Syllabus (Mathematics I Form 1)")
    print("✓ Inserted: 1 Term Module (Term 1)")
    print("✓ Inserted: 4 Topics with official pedagogical data")
    print("\nTopics loaded:")
    print("  1. Numbers")
    print("  2. Integers")
    print("  3. Approximation and Estimation")
    print("  4. Sets")

if __name__ == "__main__":
    seed_database()
