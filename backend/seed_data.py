import sqlite3

topics = [
  ("Sets", "Define sets and set notation; identify types of sets; perform union and intersection", "Form 1"),
  ("Real Numbers", "Classify real numbers; perform operations with integers, fractions and decimals; apply BODMAS", "Form 1"),
  ("Fractions", "Add, subtract, multiply and divide fractions; convert between fractions and decimals", "Form 1"),
  ("Ratios and Proportions", "Express ratios in simplest form; solve proportion problems; apply to real-life contexts", "Form 1"),
  ("Percentages", "Convert between percentages, fractions and decimals; calculate percentage increase and decrease", "Form 1"),
  ("Introduction to Algebra", "Use letters to represent numbers; simplify expressions; solve simple linear equations", "Form 1"),
  ("Geometry - Angles", "Identify types of angles; measure with a protractor; apply angle properties of triangles", "Form 1"),
  ("Perimeter and Area", "Calculate perimeter and area of rectangles, triangles and circles", "Form 1"),
]

conn = sqlite3.connect("lesson_planner.db")
cursor = conn.cursor()
cursor.executemany(
  "INSERT INTO topics (topic_name, learning_outcomes, form_level) VALUES (?, ?, ?)",
  topics
)
conn.commit()
conn.close()
print(f"Added {len(topics)} topics!")