import sqlite3

conn = sqlite3.connect("lesson_planner.db")
cursor = conn.cursor()
cursor.execute("""
  CREATE TABLE IF NOT EXISTS topics (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    topic_name TEXT NOT NULL,
    learning_outcomes TEXT NOT NULL,
    form_level TEXT NOT NULL
  )
""")
conn.commit()
conn.close()
print("Database created!")

