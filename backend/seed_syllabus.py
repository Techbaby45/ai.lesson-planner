import sqlite3

conn = sqlite3.connect("lesson_planner.db")
cursor = conn.cursor()

# Insert the Mathematics I syllabus
cursor.execute("""
INSERT INTO syllabus (subject, grade, version, year)
VALUES ('Mathematics I', 'Form 1', 'ECZ 2013', '2025/2026')
""")
syllabus_id = cursor.lastrowid

# Insert Term 1 module
cursor.execute("""
INSERT INTO term_module (syllabus_id, term_number, term_name)
VALUES (?, 1, 'Term 1')
""", (syllabus_id,))
term1_id = cursor.lastrowid

# Insert Term 2 module
cursor.execute("""
INSERT INTO term_module (syllabus_id, term_number, term_name)
VALUES (?, 2, 'Term 2')
""", (syllabus_id,))
term2_id = cursor.lastrowid

# Insert Term 3 module
cursor.execute("""
INSERT INTO term_module (syllabus_id, term_number, term_name)
VALUES (?, 3, 'Term 3')
""", (syllabus_id,))
term3_id = cursor.lastrowid

# Insert placeholder topics for Term 1
# NOTE: Replace these with real data from your actual syllabus when you get it
term1_topics = [
    {
        "topic_name": "Sets",
        "sub_topic": "Introduction to Sets and Set Notation",
        "general_competences": "Critical thinking, Collaboration, Creativity and Innovation, Communication",
        "specific_competences": "1. Define a set using curly braces notation. 2. List and identify elements of a given set. 3. Use set notation correctly in mathematical expressions.",
        "lesson_goal": "By the end of the lesson learners should be able to define sets and use set notation correctly.",
        "rationale": "Sets provide the foundation for understanding mathematical relationships and are used across all areas of mathematics.",
        "prior_knowledge": "Learners can identify and group objects by common properties from primary school mathematics.",
        "references_": "Mathematics Pupils Book 1, CDC Zambia. Mathematics Teachers Guide Form 1, ECZ.",
        "expected_standard": "Learners can correctly define a set, list its elements using curly braces, and identify whether an object belongs to a given set."
    },
    {
        "topic_name": "Sets",
        "sub_topic": "Types of Sets",
        "general_competences": "Critical thinking, Collaboration, Creativity and Innovation, Communication",
        "specific_competences": "1. Identify and distinguish between finite and infinite sets. 2. Define and give examples of empty sets and universal sets. 3. Identify subsets and equal sets.",
        "lesson_goal": "By the end of the lesson learners should be able to identify and classify different types of sets.",
        "rationale": "Understanding types of sets develops classification skills and logical thinking essential for advanced mathematics.",
        "prior_knowledge": "Learners can define a set and list its elements using set notation.",
        "references_": "Mathematics Pupils Book 1, CDC Zambia. Mathematics Teachers Guide Form 1, ECZ.",
        "expected_standard": "Learners can correctly identify finite, infinite, empty, universal, and equal sets with examples."
    },
    {
        "topic_name": "Real Numbers",
        "sub_topic": "Number Classification",
        "general_competences": "Critical thinking, Collaboration, Creativity and Innovation, Communication",
        "specific_competences": "1. Classify numbers as natural, whole, integers, rational and irrational. 2. Place numbers correctly on the real number line. 3. Compare and order real numbers.",
        "lesson_goal": "By the end of the lesson learners should be able to classify and order real numbers on the number line.",
        "rationale": "Understanding number classification builds the foundation for all arithmetic and algebraic operations in secondary school mathematics.",
        "prior_knowledge": "Learners can count, read, and write whole numbers and simple fractions from primary school.",
        "references_": "Mathematics Pupils Book 1, CDC Zambia. Mathematics Teachers Guide Form 1, ECZ.",
        "expected_standard": "Learners can correctly classify any given number and place it on the number line."
    },
    {
        "topic_name": "Fractions",
        "sub_topic": "Operations with Fractions",
        "general_competences": "Critical thinking, Collaboration, Creativity and Innovation, Communication",
        "specific_competences": "1. Add and subtract fractions with like and unlike denominators. 2. Multiply and divide fractions. 3. Convert between improper fractions and mixed numbers.",
        "lesson_goal": "By the end of the lesson learners should be able to perform all four operations with fractions.",
        "rationale": "Fractions are used in everyday life including cooking, measurements, and sharing. Mastery of fraction operations is essential for algebra.",
        "prior_knowledge": "Learners can identify numerator and denominator and understand the concept of equal parts from primary school.",
        "references_": "Mathematics Pupils Book 1, CDC Zambia. Mathematics Teachers Guide Form 1, ECZ.",
        "expected_standard": "Learners can correctly add, subtract, multiply and divide fractions including mixed numbers."
    },
    {
        "topic_name": "Ratios and Proportions",
        "sub_topic": "Expressing and Applying Ratios",
        "general_competences": "Critical thinking, Collaboration, Creativity and Innovation, Communication",
        "specific_competences": "1. Express ratios in their simplest form. 2. Divide quantities in given ratios. 3. Solve real-life problems involving direct proportion.",
        "lesson_goal": "By the end of the lesson learners should be able to express ratios in simplest form and solve proportion problems.",
        "rationale": "Ratios and proportions are used in real life contexts such as mixing, sharing, maps and scale drawings relevant to Zambian learners.",
        "prior_knowledge": "Learners understand fractions and can simplify fractions using HCF.",
        "references_": "Mathematics Pupils Book 1, CDC Zambia. Mathematics Teachers Guide Form 1, ECZ.",
        "expected_standard": "Learners can simplify ratios and solve direct proportion problems in real-life contexts."
    },
]

for topic in term1_topics:
    cursor.execute("""
    INSERT INTO topic (
        module_id, topic_name, sub_topic,
        general_competences, specific_competences,
        lesson_goal, rationale, prior_knowledge,
        references_, expected_standard
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    """, (
        term1_id,
        topic["topic_name"], topic["sub_topic"],
        topic["general_competences"], topic["specific_competences"],
        topic["lesson_goal"], topic["rationale"], topic["prior_knowledge"],
        topic["references_"], topic["expected_standard"]
    ))

conn.commit()
conn.close()
print("Syllabus data added successfully!")
print(f"Syllabus ID: {syllabus_id}")
print(f"Term 1 Module ID: {term1_id}")
print(f"Topics added: {len(term1_topics)}")