def build_lesson_plan_prompt(topic_data: dict, teacher_input: dict) -> str:
    """
    Builds a structured prompt for Gemini using the official
    Zambian lesson plan format from the ECZ Mathematics I syllabus.
    """
    prompt = f"""
You are an expert Zambian secondary school Mathematics teacher and lesson planner.
Generate a complete lesson plan following the EXACT official Zambian secondary school
lesson plan format used by schools like Luanshya Girls Secondary School.

SYLLABUS INFORMATION (from ECZ Mathematics I):
- Topic: {topic_data['topic_name']}
- Sub-Topic: {topic_data['sub_topic']}
- General Competences: {topic_data['general_competences']}
- Specific Competences: {topic_data['specific_competences']}
- Lesson Goal: {topic_data['lesson_goal']}
- Prior Knowledge: {topic_data['prior_knowledge']}

CLASSROOM CONTEXT (entered by teacher):
- Name of Teacher: {teacher_input['name_of_teacher']}
- Class: {teacher_input['class_']}
- Duration: {teacher_input['duration']} minutes
- Number of Learners: {teacher_input['no_of_learners']}
- Natural Environment: {teacher_input['natural_environment']}
- Artificial Environment: {teacher_input['artificial_environment']}
- Technological Environment: {teacher_input['technological_environment']}
- Teaching and Learning Materials: {teacher_input['teaching_materials']}

IMPORTANT RULES:
1. All activities MUST use only the resources available (listed above)
2. Activities must be appropriate for the class size given
3. Follow the standard Zambian lesson plan progression format exactly
4. Keep activities practical and relevant to Zambian learners
5. Each section should be detailed enough for the teacher to follow

Generate ONLY a JSON response with this exact structure (no other text):
{{
    "intro_teacher": "What the teacher does in the Introduction stage (5-10 minutes). Include specific questions to ask or activities to do.",
    "intro_learners": "What learners do during Introduction. Include specific expected responses or activities.",
    "intro_assessment": "How the teacher assesses understanding during Introduction.",
    "development_teacher": "What the teacher does in Lesson Development (main teaching, 20-25 minutes). Include step by step explanation of the new content.",
    "development_learners": "What learners do during Lesson Development. Include activities, exercises, or group work.",
    "development_assessment": "How the teacher assesses understanding during Lesson Development.",
    "exercise_teacher": "What the teacher does during Exercise/Assessment stage (10-15 minutes). Include specific questions or tasks to give learners.",
    "exercise_learners": "What learners do during Exercise. Include specific problems or tasks they work on.",
    "exercise_assessment": "How the teacher marks or checks the exercise work.",
    "homework_teacher": "What homework the teacher sets. Include specific questions from the textbook or teacher-created questions.",
    "homework_learners": "What learners do for homework.",
    "homework_assessment": "How homework will be checked in the next lesson.",
    "conclusion_teacher": "What the teacher does to conclude the lesson (3-5 minutes). Include summary and key points.",
    "conclusion_learners": "How learners participate in the conclusion. Include any summary activity.",
    "conclusion_assessment": "Final check of understanding at end of lesson.",
    "lesson_evaluation": "Space for teacher to write after the lesson: what went well, what to improve, learner participation notes."
}}
"""
    return prompt