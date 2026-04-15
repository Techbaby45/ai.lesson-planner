"""
GEMINI INTEGRATION FOR LESSON PLAN GENERATION
This module handles all AI-powered lesson plan generation using Google's Gemini API
"""

import google.generativeai as genai
import os
from database import get_db_connection

# Configure Gemini API
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
if GEMINI_API_KEY:
    genai.configure(api_key=GEMINI_API_KEY)

def generate_lesson_plan(input_id: int) -> dict:
    """
    Generate a complete lesson plan using Gemini API
    
    INPUT:
    - input_id: The teacher's input record from the form
    
    OUTPUT:
    - Dictionary with all sections of the lesson plan
    """
    
    # Get teacher input from database
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM teacher_input WHERE input_id = ?", (input_id,))
    teacher_input = cursor.fetchone()
    
    if not teacher_input:
        return {"error": "Teacher input not found"}
    
    # Get topic details
    cursor.execute("SELECT * FROM topic WHERE topic_id = ?", (teacher_input["topic_id"],))
    topic = cursor.fetchone()
    conn.close()
    
    if not topic:
        return {"error": "Topic not found"}
    
    # Build the prompt for Gemini
    prompt = build_lesson_plan_prompt(topic, teacher_input)
    
    # Call Gemini API
    try:
        model = genai.GenerativeModel('gemini-pro')
        response = model.generate_content(prompt)
        
        # Parse the response
        lesson_plan_data = parse_gemini_response(response.text)
        
        return lesson_plan_data
    
    except Exception as e:
        return {"error": f"Failed to generate lesson plan: {str(e)}"}

def build_lesson_plan_prompt(topic: dict, teacher_input: dict) -> str:
    """
    Build a detailed prompt for Gemini to generate a lesson plan
    
    This prompt tells Gemini exactly what structure and content we need
    """
    
    prompt = f"""
You are an expert Mathematics teacher in Zambia creating a detailed lesson plan.

TOPIC: {topic['topic_name']}
SUB-TOPIC: {topic['sub_topic']}

OFFICIAL COMPETENCES:
- Specific Competences: {topic['specific_competences']}
- General Competences: {topic['general_competences']}

LESSON GOAL: {topic['lesson_goal']}

RATIONALE: {topic['rationale']}

PRIOR KNOWLEDGE: {topic['prior_knowledge']}

EXPECTED STANDARD: {topic['expected_standard']}

TEACHER CONTEXT:
- Teacher Name: {teacher_input['name_of_teacher']}
- Class: {teacher_input['class']}
- Number of Learners: {teacher_input['no_of_learners']}
- Date: {teacher_input['date_of_lesson']}
- Duration: {teacher_input['duration']} minutes
- Available Teaching Materials: {teacher_input['teaching_materials']}
- Learning Environment: {teacher_input['learning_environment']}

Please create a DETAILED lesson plan following this exact structure:

---

SECTION 1: INTRODUCTION (Recommended: 5-7 minutes)
Teacher Activities: (What the teacher does)
Learner Activities: (What students do)
Assessment: (How you assess understanding)

---

SECTION 2: LESSON DEVELOPMENT (Recommended: 20-25 minutes)
Teacher Activities: (What the teacher does - use examples, demonstrations, guided practice)
Learner Activities: (What students do - practice, discuss, explore)
Assessment: (Formative assessment - observation, questions)

---

SECTION 3: EXERCISE/ASSESSMENT (Recommended: 10-15 minutes)
Teacher Activities: (What the teacher does - facilitate practice)
Learner Activities: (What students do - solve problems, answer questions)
Assessment: (Check for mastery)

---

SECTION 4: HOMEWORK (Recommended: 2-3 minutes to explain)
Teacher Activities: (Explain homework)
Learner Activities: (What students do at home)
Assessment: (How it will be marked)

---

SECTION 5: CONCLUSION (Recommended: 2-3 minutes)
Teacher Activities: (Summarize key points)
Learner Activities: (Reflect on learning)
Assessment: (Quick recap)

---

LESSON EVALUATION:
- What went well?
- What challenges did learners face?
- What would you do differently next time?
- How did learners meet the learning objectives?

---

IMPORTANT REQUIREMENTS:
1. Use ONLY the materials available: {teacher_input['teaching_materials']}
2. Keep in mind the learning environment: {teacher_input['learning_environment']}
3. All activities must be age-appropriate for Form 1 students
4. Include real-world connections to Zambian context where possible
5. Activities must fit within {teacher_input['duration']} minutes total
6. Ensure all 4 competences are addressed
7. Make content practical and engaging

Create the lesson plan now, following the structure above exactly.
"""
    
    return prompt

def parse_gemini_response(response_text: str) -> dict:
    """
    Parse Gemini's response and structure it into lesson plan sections
    
    This extracts the different sections and returns them as a dictionary
    """
    
    # Initialize sections
    sections = {
        "introduction_teacher_activities": "",
        "introduction_learner_activities": "",
        "introduction_assessment": "",
        "development_teacher_activities": "",
        "development_learner_activities": "",
        "development_assessment": "",
        "exercise_teacher_activities": "",
        "exercise_learner_activities": "",
        "exercise_assessment": "",
        "homework_teacher_activities": "",
        "homework_learner_activities": "",
        "homework_assessment": "",
        "conclusion_teacher_activities": "",
        "conclusion_learner_activities": "",
        "conclusion_assessment": "",
        "lesson_evaluation": ""
    }
    
    # For now, we'll return the full response as the lesson evaluation
    # In a production system, you would parse the response more carefully
    sections["lesson_evaluation"] = response_text
    
    # Try to extract specific sections (simple parsing)
    lines = response_text.split('\n')
    
    current_section = None
    current_content = []
    
    for line in lines:
        line = line.strip()
        
        # Detect section headers
        if "INTRODUCTION" in line.upper():
            if current_section:
                sections[current_section] = '\n'.join(current_content).strip()
            current_section = "introduction_teacher_activities"
            current_content = []
        elif "LESSON DEVELOPMENT" in line.upper():
            if current_section:
                sections[current_section] = '\n'.join(current_content).strip()
            current_section = "development_teacher_activities"
            current_content = []
        elif "EXERCISE" in line.upper() and "ASSESSMENT" in line.upper():
            if current_section:
                sections[current_section] = '\n'.join(current_content).strip()
            current_section = "exercise_teacher_activities"
            current_content = []
        elif "HOMEWORK" in line.upper():
            if current_section:
                sections[current_section] = '\n'.join(current_content).strip()
            current_section = "homework_teacher_activities"
            current_content = []
        elif "CONCLUSION" in line.upper():
            if current_section:
                sections[current_section] = '\n'.join(current_content).strip()
            current_section = "conclusion_teacher_activities"
            current_content = []
        elif "LESSON EVALUATION" in line.upper():
            if current_section:
                sections[current_section] = '\n'.join(current_content).strip()
            current_section = "lesson_evaluation"
            current_content = []
        else:
            current_content.append(line)
    
    # Save last section
    if current_section:
        sections[current_section] = '\n'.join(current_content).strip()
    
    return sections

def save_lesson_plan(input_id: int, lesson_plan_data: dict) -> int:
    """
    Save the generated lesson plan to the database
    
    Returns the plan_id
    """
    
    conn = get_db_connection()
    cursor = conn.cursor()
    
    cursor.execute("""
        INSERT INTO lesson_plan (
            input_id,
            introduction_teacher_activities,
            introduction_learner_activities,
            introduction_assessment,
            development_teacher_activities,
            development_learner_activities,
            development_assessment,
            exercise_teacher_activities,
            exercise_learner_activities,
            exercise_assessment,
            homework_teacher_activities,
            homework_learner_activities,
            homework_assessment,
            conclusion_teacher_activities,
            conclusion_learner_activities,
            conclusion_assessment,
            lesson_evaluation
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    """, (
        input_id,
        lesson_plan_data.get("introduction_teacher_activities", ""),
        lesson_plan_data.get("introduction_learner_activities", ""),
        lesson_plan_data.get("introduction_assessment", ""),
        lesson_plan_data.get("development_teacher_activities", ""),
        lesson_plan_data.get("development_learner_activities", ""),
        lesson_plan_data.get("development_assessment", ""),
        lesson_plan_data.get("exercise_teacher_activities", ""),
        lesson_plan_data.get("exercise_learner_activities", ""),
        lesson_plan_data.get("exercise_assessment", ""),
        lesson_plan_data.get("homework_teacher_activities", ""),
        lesson_plan_data.get("homework_learner_activities", ""),
        lesson_plan_data.get("homework_assessment", ""),
        lesson_plan_data.get("conclusion_teacher_activities", ""),
        lesson_plan_data.get("conclusion_learner_activities", ""),
        lesson_plan_data.get("conclusion_assessment", ""),
        lesson_plan_data.get("lesson_evaluation", "")
    ))
    
    conn.commit()
    plan_id = cursor.lastrowid
    conn.close()
    
    return plan_id
