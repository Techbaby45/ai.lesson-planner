def build_lesson_plan_prompt(topic_data: dict, teacher_input: dict) -> str:
    """
    Builds a structured prompt for the AI using the official
    Zambian lesson plan format from the ECZ Mathematics I syllabus
    (Form 1, Term 1 Teaching Module methodology).
    """

    # Zambian real-life example bank — the model selects and adapts
    # whichever of these are most relevant to the specific topic,
    # rather than using all of them in every lesson.
    zambian_examples = """
- Mobile money transactions (ZANACO, MTN Money, Airtel Money) — deposits, withdrawals, balances
- Market prices in Kwacha (tomatoes, mealie meal, charcoal, fish at places like Soweto Market, Kamwala Market)
- Kuomboka ceremony — dates, distances, counting canoes/paddlers, ceremonial numbers
- Distances and travel between Zambian towns (Lusaka, Ndola, Mongu, Livingstone, Kitwe)
- Heroes Stadium, Levy Mwanawasa Stadium — capacity, attendance figures, sections
- Bottletops, stones, or seeds used as counters for group activities
- Manila paper and number cards for group/pair activities
- Mealie meal bags (25kg, 50kg) for weight, ratio, and estimation examples
- School contexts: class register numbers, exam marks, textbook counts, football team scores
- Farming contexts: bags of maize harvested, cattle counted in a kraal, land measured in hectares
"""

    prompt = f"""
You are an expert Zambian secondary school Mathematics teacher and lesson planner,
trained in the ECZ Mathematics I Teaching Module methodology for Form 1, Term 1.

Generate a complete lesson plan following the EXACT official Zambian secondary school
lesson plan format used by schools like Luanshya Girls Secondary School, and the
learner-centred approach prescribed by the ECZ Teaching Module.

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

ZAMBIAN REAL-LIFE EXAMPLE BANK
Choose and adapt whichever examples below are genuinely relevant to this specific
topic and sub-topic. Do not force irrelevant examples in — pick 2-4 that fit naturally.
{zambian_examples}

ECZ LEARNER-CENTRED METHODOLOGY — MANDATORY RULES

1. HOOK (Introduction stage):
   Open with a provocative, curiosity-driving question or short real-life scenario
   tied to the topic, drawn from or inspired by the example bank above. Learners
   should want to find out the answer before being taught anything.

2. LEARNER-CENTRED ACTIVITIES:
   Learners must discover concepts through activity, not just teacher explanation.
   Explicitly use pair work, group work, brainstorming, individual tasks, or
   presentations to the class — vary these across the Introduction, Development,
   and Exercise stages rather than repeating the same structure in every stage.

3. REAL MATHEMATICAL CONTENT:
   Every teacher-facing field (intro_teacher, development_teacher, exercise_teacher,
   homework_teacher) must contain actual worked mathematical examples with real
   numbers — not vague descriptions like "give learners some examples". Show the
   actual numbers, expressions, or problems.

4. SPECIFIC QUESTIONS AND EXPECTED RESPONSES:
   Wherever the teacher asks a question, write the question exactly as the teacher
   would say it, and state the expected learner response or answer directly
   afterward. Do not just say "the teacher asks questions" — write the questions.

5. MATERIALS DISCIPLINE:
   Only reference teaching materials from what the teacher listed above
   (chalkboard, manila paper, number cards, counters/bottletops, rulers,
   calculators if available, etc.). Do not invent materials the teacher did not
   list or that are not commonly available in a Zambian classroom.

6. HOMEWORK FORMAT:
   homework_teacher must include AT LEAST 3 specific questions, numbered and
   written EXACTLY as the teacher would write them on the chalkboard for learners
   to copy — complete, self-contained questions with real numbers, not
   descriptions of questions.

7. LANGUAGE LEVEL:
   Use clear, simple English appropriate for Form 1 Zambian learners (roughly
   ages 12-14). Avoid overly technical or academic phrasing; explain mathematical
   terms in plain language the first time they are used.

8. ASSESSMENT CRITERIA:
   Assessment fields should reflect ECZ's focus on accuracy, creativity,
   communication, and relevance to real life — not just "checking answers".

IMPORTANT RULES:
1. All activities MUST use only the resources available (listed above)
2. Activities must be appropriate for the class size given
3. Follow the standard Zambian lesson plan progression format exactly
4. Keep activities practical and relevant to Zambian learners
5. Each section should be detailed enough for the teacher to follow without
   needing to invent content themselves

Generate ONLY a JSON response with this exact structure (no other text):
{{
    "intro_teacher": "What the teacher does in the Introduction stage (5-10 minutes). MUST open with the Hook (a specific question or scenario). Include the exact question(s) asked and expected learner responses.",
    "intro_learners": "What learners do during Introduction. Include specific expected responses or activities (e.g. pair discussion, brainstorming).",
    "intro_assessment": "How the teacher assesses understanding during Introduction, focused on engagement and prior knowledge activation.",
    "development_teacher": "What the teacher does in Lesson Development (main teaching, 20-25 minutes). Step-by-step explanation of the new content WITH worked numerical examples using real numbers.",
    "development_learners": "What learners do during Lesson Development. Specify pair work, group work, or individual tasks, with the actual activity/problem given to them.",
    "development_assessment": "How the teacher assesses understanding during Lesson Development, focused on accuracy and communication.",
    "exercise_teacher": "What the teacher does during Exercise/Assessment stage (10-15 minutes). Include specific numbered questions with real numbers written exactly as given to learners.",
    "exercise_learners": "What learners do during Exercise. Include the specific problems they work on and how (individually, in pairs, presenting to class).",
    "exercise_assessment": "How the teacher marks or checks the exercise work, and what accuracy/creativity/communication criteria are used.",
    "homework_teacher": "AT LEAST 3 numbered homework questions written exactly as the teacher would write them on the chalkboard, using real numbers relevant to the topic.",
    "homework_learners": "What learners do for homework and how they should present their answers.",
    "homework_assessment": "How homework will be checked or marked in the next lesson.",
    "conclusion_teacher": "What the teacher does to conclude the lesson (3-5 minutes). Include a summary of key points and a closing question to check retention.",
    "conclusion_learners": "How learners participate in the conclusion (e.g. summarising in own words, quick recap activity).",
    "conclusion_assessment": "Final check of understanding at end of lesson, tied to the lesson goal.",
    "lesson_evaluation": "Space for teacher to write after the lesson: what went well, what to improve, learner participation notes."
}}
"""
    return prompt







