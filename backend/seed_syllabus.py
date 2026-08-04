import sqlite3

conn = sqlite3.connect("lesson_planner.db")
cursor = conn.cursor()

# Insert Mathematics I Syllabus
cursor.execute("""
    INSERT INTO syllabus (subject, grade, version, year)
    VALUES (?, ?, ?, ?)
""", ("Mathematics I", "Form 1", "Competence-Based Curriculum", "2023"))
syllabus_id = cursor.lastrowid

# Insert Term 1 Module
cursor.execute("""
    INSERT INTO term_module (syllabus_id, term_number, term_name)
    VALUES (?, ?, ?)
""", (syllabus_id, 1, "Term 1"))
term1_id = cursor.lastrowid

# ─────────────────────────────────────────────
# TOPIC 1: NUMBERS — SUBTOPIC 1
# ─────────────────────────────────────────────
cursor.execute("""
    INSERT INTO topic (
        module_id, topic_name, sub_topic,
        general_competences, specific_competences,
        lesson_goal, rationale, prior_knowledge,
        references_, expected_standard
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
""", (
    term1_id,
    "Numbers",
    "Classification of Numbers",
    "Analytical Thinking, Communication, Problem Solving, Collaboration, Financial Literacy, Digital Literacy, Creativity",
    "Apply classification of numbers in real life situations",
    "Learners will be able to classify numbers into natural numbers, whole numbers, integers, rational numbers, irrational numbers, prime numbers, composite numbers, even and odd numbers, and find factors, multiples, HCF and LCM and apply these in real life situations",
    "Understanding number classification is a fundamental concept in mathematics that helps learners understand different types of numbers and their properties. Finding factors, multiples, HCF and LCM enables learners to solve real life problems such as organising resources, scheduling and planning",
    "Learners have prior knowledge of counting numbers, basic arithmetic operations (addition, subtraction, multiplication, division), and simple number patterns from primary school",
    "Ministry of Education (2023) Mathematics I Syllabus Form 1-4. Curriculum Development Centre, Lusaka. Ministry of Education (2025) Mathematics I Teaching Module Form 1 Term 1. Curriculum Development Centre, Lusaka",
    "Numbers applied in real life situations consistently"
))

# ─────────────────────────────────────────────
# TOPIC 1: NUMBERS — SUBTOPIC 2
# ─────────────────────────────────────────────
cursor.execute("""
    INSERT INTO topic (
        module_id, topic_name, sub_topic,
        general_competences, specific_competences,
        lesson_goal, rationale, prior_knowledge,
        references_, expected_standard
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
""", (
    term1_id,
    "Numbers",
    "Combined Operations on Real Numbers",
    "Analytical Thinking, Communication, Problem Solving, Collaboration, Financial Literacy, Digital Literacy, Creativity",
    "Apply combined operations on real numbers in real life situations",
    "Learners will be able to correctly apply the order of operations (PEDMAS — Parentheses, Exponents, Division, Multiplication, Addition, Subtraction) to solve combined operations on real numbers in real life situations such as budgeting and calculating costs in Kwacha",
    "Understanding combined operations is crucial for solving real world problems including budgeting, calculating costs at the market, and making informed financial decisions. The correct order of operations ensures consistent and accurate results in mathematical calculations",
    "Learners have prior knowledge of basic arithmetic operations (addition, subtraction, multiplication, division) on whole numbers and simple fractions from primary school mathematics",
    "Ministry of Education (2023) Mathematics I Syllabus Form 1-4. Curriculum Development Centre, Lusaka. Ministry of Education (2025) Mathematics I Teaching Module Form 1 Term 1. Curriculum Development Centre, Lusaka",
    "Combined operations on real numbers applied in everyday life situations correctly"
))

# ─────────────────────────────────────────────
# TOPIC 2: INTEGERS
# ─────────────────────────────────────────────
cursor.execute("""
    INSERT INTO topic (
        module_id, topic_name, sub_topic,
        general_competences, specific_competences,
        lesson_goal, rationale, prior_knowledge,
        references_, expected_standard
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
""", (
    term1_id,
    "Integers",
    "The Four Operations on Integers",
    "Critical Thinking, Analytical Thinking, Creativity and Innovation, Problem Solving, Digital Literacy, Collaboration, Communication",
    "Use integers in real life situations",
    "Learners will be able to perform the four basic operations (addition, subtraction, multiplication and division) on integers and apply them to real life situations such as calculating temperature changes, managing mobile money account balances, tracking profit and loss, and measuring altitude above and below sea level",
    "Integers are the building blocks of mathematics. Mastering integer operations is key to understanding essential mathematical concepts and lays the groundwork for tackling more complex topics. Integer operations apply directly to real world situations in Zambia such as calculating profit and loss at a market stall, mobile money transactions on ZANACO or MTN, and temperature changes between seasons",
    "Learners have prior knowledge of natural numbers, whole numbers, basic arithmetic operations, and the concept of negative numbers as introduced in the classification of numbers subtopic",
    "Ministry of Education (2023) Mathematics I Syllabus Form 1-4. Curriculum Development Centre, Lusaka. Ministry of Education (2025) Mathematics I Teaching Module Form 1 Term 1. Curriculum Development Centre, Lusaka",
    "Integers used in real life correctly"
))

# ─────────────────────────────────────────────
# TOPIC 3: APPROXIMATIONS AND ESTIMATIONS — SUBTOPIC 1
# ─────────────────────────────────────────────
cursor.execute("""
    INSERT INTO topic (
        module_id, topic_name, sub_topic,
        general_competences, specific_competences,
        lesson_goal, rationale, prior_knowledge,
        references_, expected_standard
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
""", (
    term1_id,
    "Approximations and Estimations",
    "Approximations",
    "Problem Solving, Analytical Thinking, Collaboration, Communication, Digital Literacy, Financial Literacy",
    "Use approximation to make informed decisions in real life",
    "Learners will be able to round off numbers to a required degree of accuracy including decimal places and significant figures, express very large and very small numbers in scientific notation, and use approximations to simplify calculations and make informed decisions in real life contexts such as construction, medicine and finance",
    "Approximations and significant figures are critical skills used in everyday life to simplify complex measurements and ensure precision. Scientific notation is essential for expressing very large and very small numbers used in science, technology and commerce. These skills support informed decision making in areas such as construction, medicine, finance and engineering in Zambia",
    "Learners have prior knowledge of place value, rounding of whole numbers and decimals to the nearest ten, hundred or decimal place, and basic operations on real numbers",
    "Ministry of Education (2023) Mathematics I Syllabus Form 1-4. Curriculum Development Centre, Lusaka. Ministry of Education (2025) Mathematics I Teaching Module Form 1 Term 1. Curriculum Development Centre, Lusaka",
    "Approximations used to make informed decisions in real life appropriately"
))

# ─────────────────────────────────────────────
# TOPIC 3: APPROXIMATIONS AND ESTIMATIONS — SUBTOPIC 2
# ─────────────────────────────────────────────
cursor.execute("""
    INSERT INTO topic (
        module_id, topic_name, sub_topic,
        general_competences, specific_competences,
        lesson_goal, rationale, prior_knowledge,
        references_, expected_standard
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
""", (
    term1_id,
    "Approximations and Estimations",
    "Estimations",
    "Problem Solving, Analytical Thinking, Collaboration, Communication, Digital Literacy, Financial Literacy",
    "Use estimation to make informed decisions in real life",
    "Learners will be able to estimate measures and compare them with actual measurements, calculate absolute error, relative error, percentage error and tolerance, and use these to evaluate the accuracy of measurements and make informed decisions in real life situations such as buying mealie meal, building construction and medical dosage",
    "Estimations are essential in simplifying complex problems and making quick decisions. Understanding absolute error, relative error, percentage error and tolerance is vital in fields such as engineering, manufacturing, science and commerce in Zambia where precise measurements and acceptable limits of variation are critical",
    "Learners have prior knowledge of rounding of numbers, significant figures, scientific notation, basic arithmetic operations, fractions, decimals and percentages",
    "Ministry of Education (2023) Mathematics I Syllabus Form 1-4. Curriculum Development Centre, Lusaka. Ministry of Education (2025) Mathematics I Teaching Module Form 1 Term 1. Curriculum Development Centre, Lusaka",
    "Estimations used to make informed decisions in real life correctly"
))

# ─────────────────────────────────────────────
# TOPIC 4: SETS
# ─────────────────────────────────────────────
cursor.execute("""
    INSERT INTO topic (
        module_id, topic_name, sub_topic,
        general_competences, specific_competences,
        lesson_goal, rationale, prior_knowledge,
        references_, expected_standard
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
""", (
    term1_id,
    "Sets",
    "Operations on Sets",
    "Communication, Creativity, Innovation, Collaboration, Critical Thinking, Digital Literacy, Problem Solving",
    "Apply set operations in real life context",
    "Learners will be able to create and represent sets using listing (roster form), set builder notation, number line and Venn diagrams, and perform and interpret set operations including union, intersection, complement and set difference on up to three sets in real life contexts such as survey analysis, library cataloguing and event planning",
    "Knowledge of sets is of great importance in developing a sense of order, organisation and logical thinking. Set operations are widely applied in everyday life in Zambia including organising groups of learners, analysing survey results, managing school timetables and categorising information. Venn diagrams provide a powerful visual tool for representing and solving real life problems",
    "Learners have prior knowledge of classification and grouping of objects, basic number properties, listing of numbers in sequences or groups, and simple logical thinking from primary school and earlier Form 1 topics",
    "Ministry of Education (2023) Mathematics I Syllabus Form 1-4. Curriculum Development Centre, Lusaka. Ministry of Education (2025) Mathematics I Teaching Module Form 1 Term 1. Curriculum Development Centre, Lusaka",
    "Set operations as applied in real life context correctly"
))

conn.commit()
conn.close()
print("✅ ECZ Mathematics I Term 1 syllabus seeded successfully!")
print("")
print("Topics loaded:")
print("  1. Numbers — Classification of Numbers")
print("  2. Numbers — Combined Operations on Real Numbers")
print("  3. Integers — The Four Operations on Integers")
print("  4. Approximations and Estimations — Approximations")
print("  5. Approximations and Estimations — Estimations")
print("  6. Sets — Operations on Sets")