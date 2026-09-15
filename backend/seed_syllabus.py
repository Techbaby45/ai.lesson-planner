import sqlite3

conn = sqlite3.connect("lesson_planner.db")
cursor = conn.cursor()

# ─────────────────────────────────────────────
# SYLLABUS
# ─────────────────────────────────────────────
cursor.execute("""
    INSERT INTO syllabus (subject, grade, version, year)
    VALUES (?, ?, ?, ?)
""", ("Mathematics I", "Form 1", "Competence-Based Curriculum", "2023"))
syllabus_id = cursor.lastrowid

# ─────────────────────────────────────────────
# TERM MODULES
# ─────────────────────────────────────────────
cursor.execute("""
    INSERT INTO term_module (syllabus_id, term_number, term_name)
    VALUES (?, ?, ?)
""", (syllabus_id, 1, "Term 1"))
term1_id = cursor.lastrowid

cursor.execute("""
    INSERT INTO term_module (syllabus_id, term_number, term_name)
    VALUES (?, ?, ?)
""", (syllabus_id, 2, "Term 2"))
term2_id = cursor.lastrowid

cursor.execute("""
    INSERT INTO term_module (syllabus_id, term_number, term_name)
    VALUES (?, ?, ?)
""", (syllabus_id, 3, "Term 3"))
term3_id = cursor.lastrowid

# ─────────────────────────────────────────────
# TERM 1 TOPICS
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
    "Learners will be able to correctly apply the order of operations (PEDMAS) to solve combined operations on real numbers in real life situations such as budgeting and calculating costs in Kwacha",
    "Understanding combined operations is crucial for solving real world problems including budgeting, calculating costs at the market, and making informed financial decisions in Zambia",
    "Learners have prior knowledge of basic arithmetic operations on whole numbers and simple fractions from primary school mathematics",
    "Ministry of Education (2023) Mathematics I Syllabus Form 1-4. Curriculum Development Centre, Lusaka. Ministry of Education (2025) Mathematics I Teaching Module Form 1 Term 1. Curriculum Development Centre, Lusaka",
    "Combined operations on real numbers applied in everyday life situations correctly"
))

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
    "Learners will be able to perform the four basic operations on integers and apply them to real life situations such as calculating temperature changes, managing mobile money account balances, tracking profit and loss, and measuring altitude",
    "Integers are the building blocks of mathematics. Integer operations apply directly to real world situations in Zambia such as calculating profit and loss at a market stall, mobile money transactions on ZANACO or MTN, and temperature changes between seasons",
    "Learners have prior knowledge of natural numbers, whole numbers, basic arithmetic operations, and the concept of negative numbers from the classification of numbers subtopic",
    "Ministry of Education (2023) Mathematics I Syllabus Form 1-4. Curriculum Development Centre, Lusaka. Ministry of Education (2025) Mathematics I Teaching Module Form 1 Term 1. Curriculum Development Centre, Lusaka",
    "Integers used in real life correctly"
))

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
    "Learners will be able to round off numbers to a required degree of accuracy including decimal places and significant figures, express very large and very small numbers in scientific notation, and use approximations to simplify calculations and make informed decisions in real life contexts",
    "Approximations and significant figures are critical skills used in everyday life to simplify complex measurements. Scientific notation is essential for expressing very large and very small numbers used in science, technology and commerce in Zambia",
    "Learners have prior knowledge of place value, rounding of whole numbers and decimals, and basic operations on real numbers",
    "Ministry of Education (2023) Mathematics I Syllabus Form 1-4. Curriculum Development Centre, Lusaka. Ministry of Education (2025) Mathematics I Teaching Module Form 1 Term 1. Curriculum Development Centre, Lusaka",
    "Approximations used to make informed decisions in real life appropriately"
))

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
    "Learners will be able to estimate measures and compare them with actual measurements, calculate absolute error, relative error, percentage error and tolerance, and use these to evaluate the accuracy of measurements and make informed decisions in real life situations",
    "Estimations are essential in simplifying complex problems and making quick decisions. Understanding absolute error, relative error, percentage error and tolerance is vital in fields such as engineering, manufacturing, science and commerce in Zambia",
    "Learners have prior knowledge of rounding of numbers, significant figures, scientific notation, basic arithmetic operations, fractions, decimals and percentages",
    "Ministry of Education (2023) Mathematics I Syllabus Form 1-4. Curriculum Development Centre, Lusaka. Ministry of Education (2025) Mathematics I Teaching Module Form 1 Term 1. Curriculum Development Centre, Lusaka",
    "Estimations used to make informed decisions in real life correctly"
))

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
    "Learners will be able to create and represent sets using listing, set builder notation, number line and Venn diagrams, and perform and interpret set operations including union, intersection, complement and set difference on up to three sets in real life contexts",
    "Knowledge of sets is of great importance in developing a sense of order, organisation and logical thinking. Set operations are widely applied in everyday life in Zambia including organising groups of learners, analysing survey results and managing school timetables",
    "Learners have prior knowledge of classification and grouping of objects, basic number properties, and simple logical thinking from primary school and earlier Form 1 topics",
    "Ministry of Education (2023) Mathematics I Syllabus Form 1-4. Curriculum Development Centre, Lusaka. Ministry of Education (2025) Mathematics I Teaching Module Form 1 Term 1. Curriculum Development Centre, Lusaka",
    "Set operations as applied in real life context correctly"
))

# ─────────────────────────────────────────────
# TERM 2 TOPICS
# ─────────────────────────────────────────────

cursor.execute("""
    INSERT INTO topic (
        module_id, topic_name, sub_topic,
        general_competences, specific_competences,
        lesson_goal, rationale, prior_knowledge,
        references_, expected_standard
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
""", (
    term2_id,
    "Algebra",
    "Algebraic Expressions",
    "Analytical Thinking, Problem Solving, Creativity, Critical Thinking, Collaboration, Financial Literacy, Digital Literacy",
    "Apply algebraic expressions in real life",
    "Learners will be able to explore and formulate algebraic expressions from everyday life activities, distinguish coefficients and variables, group like and unlike terms, simplify algebraic expressions using the four basic operations, and evaluate algebraic expressions by substituting numerical values",
    "Algebraic expressions allow learners to describe and solve real life problems where values can change, such as planning a budget, tracking time, or working out costs. Learning to represent unknown quantities using letters trains the brain to break complex problems into manageable steps, a skill valuable in everyday decision making from budgeting to business planning in Zambia",
    "Learners have prior knowledge of the four basic arithmetic operations, order of operations, and classification of numbers from Term 1 topics on Numbers and Integers",
    "Ministry of Education (2023) Mathematics I Syllabus Form 1-4. Curriculum Development Centre, Lusaka. Ministry of Education (2025) Mathematics I Teaching Module Form 1 Term 2. Curriculum Development Centre, Lusaka",
    "Algebraic expressions applied in a variety of real-life situations"
))

cursor.execute("""
    INSERT INTO topic (
        module_id, topic_name, sub_topic,
        general_competences, specific_competences,
        lesson_goal, rationale, prior_knowledge,
        references_, expected_standard
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
""", (
    term2_id,
    "Matrices",
    "Operations on Matrices",
    "Analytical Thinking, Creativity and Innovation, Problem Solving, Digital Literacy, Collaboration, Communication",
    "Apply Matrices to real life situations",
    "Learners will be able to formulate matrices from real life situations such as payrolls, shop records and distribution of resources, identify the order of a matrix, transpose matrices, explore various types of matrices and their properties, and carry out addition, subtraction, and scalar and matrix multiplication on matrices up to 2x2",
    "Matrices allow data from real life situations such as sales records, test scores or resource distribution to be organised and manipulated in a structured way. Operations on matrices are essential in both theoretical mathematics and practical applications such as business inventory tracking and budget planning relevant to a Zambian context",
    "Learners have prior knowledge of algebraic expressions, basic arithmetic operations, and organising data into rows and columns from earlier topics",
    "Ministry of Education (2023) Mathematics I Syllabus Form 1-4. Curriculum Development Centre, Lusaka. Ministry of Education (2025) Mathematics I Teaching Module Form 1 Term 2. Curriculum Development Centre, Lusaka",
    "Matrices applied to real life situations correctly"
))

cursor.execute("""
    INSERT INTO topic (
        module_id, topic_name, sub_topic,
        general_competences, specific_competences,
        lesson_goal, rationale, prior_knowledge,
        references_, expected_standard
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
""", (
    term2_id,
    "Angles",
    "Angles Associated with Straight Lines",
    "Critical Thinking, Problem Solving, Analytical Thinking, Collaboration, Communication, Digital Literacy",
    "Use angles associated with straight lines in everyday life",
    "Learners will be able to explore the relationship between angles and straight lines, distinguish angles associated with parallel lines including corresponding, alternate, vertically opposite and straight line angles, and use angles associated with straight lines to solve practical problems",
    "Angles are present throughout daily life from the corners of a book to the design of buildings and roads. Understanding how angles formed by straight lines behave helps learners gain insights that apply directly to construction, navigation, and design in the Zambian context",
    "Learners have prior knowledge of basic geometric shapes and the use of a ruler and protractor from earlier mathematics topics",
    "Ministry of Education (2023) Mathematics I Syllabus Form 1-4. Curriculum Development Centre, Lusaka. Ministry of Education (2025) Mathematics I Teaching Module Form 1 Term 2. Curriculum Development Centre, Lusaka",
    "Angles associated with straight lines used in everyday life correctly"
))

cursor.execute("""
    INSERT INTO topic (
        module_id, topic_name, sub_topic,
        general_competences, specific_competences,
        lesson_goal, rationale, prior_knowledge,
        references_, expected_standard
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
""", (
    term2_id,
    "Angles",
    "Angle of Elevation and Depression",
    "Critical Thinking, Problem Solving, Analytical Thinking, Collaboration, Communication, Digital Literacy",
    "Use Angle of Elevation and Depression in everyday life",
    "Learners will be able to explore and distinguish angles of elevation and depression using real life situations, and find the angle of depression and elevation in practical problems",
    "Angles of elevation and depression are used to solve real world problems such as judging the height of a building, the distance to an object, or the position of an aircraft, making this a practical skill with direct application to surveying, construction and everyday observation in Zambia",
    "Learners have prior knowledge of angles associated with straight lines and parallel lines from the previous sub-topic",
    "Ministry of Education (2023) Mathematics I Syllabus Form 1-4. Curriculum Development Centre, Lusaka. Ministry of Education (2025) Mathematics I Teaching Module Form 1 Term 2. Curriculum Development Centre, Lusaka",
    "Angle of Elevation and Depression used in everyday life correctly"
))

# ─────────────────────────────────────────────
# TERM 3 TOPICS
# ─────────────────────────────────────────────

cursor.execute("""
    INSERT INTO topic (
        module_id, topic_name, sub_topic,
        general_competences, specific_competences,
        lesson_goal, rationale, prior_knowledge,
        references_, expected_standard
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
""", (
    term3_id,
    "Trigonometry",
    "Trigonometric Ratios",
    "Analytical Thinking, Problem Solving, Critical Thinking, Collaboration, Communication, Digital Literacy",
    "Apply trigonometric ratios in real life situations",
    "Learners will be able to identify the sides of a right-angled triangle (opposite, adjacent, hypotenuse), define and apply the three trigonometric ratios (sine, cosine, tangent), use a calculator or trigonometric tables to find ratios and angles, and solve real life problems involving heights and distances using trigonometric ratios",
    "Trigonometric ratios are essential tools for solving problems involving right-angled triangles. They are widely applied in Zambia in fields such as construction, surveying, navigation and engineering where calculating heights, distances and angles without direct measurement is necessary",
    "Learners have prior knowledge of angles associated with straight lines, angle of elevation and depression, and basic properties of triangles from Term 2 Angles topics",
    "Ministry of Education (2023) Mathematics I Syllabus Form 1-4. Curriculum Development Centre, Lusaka",
    "Trigonometric ratios applied in real life situations correctly"
))

cursor.execute("""
    INSERT INTO topic (
        module_id, topic_name, sub_topic,
        general_competences, specific_competences,
        lesson_goal, rationale, prior_knowledge,
        references_, expected_standard
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
""", (
    term3_id,
    "Statistics",
    "Data Collection and Presentation",
    "Analytical Thinking, Communication, Problem Solving, Collaboration, Digital Literacy, Financial Literacy",
    "Collect, organise and present data in real life situations",
    "Learners will be able to collect data from real life situations using various methods such as observation, questionnaires and experiments, organise data using frequency tables and tally charts, and present data using pictograms, bar charts, line graphs and pie charts in real life contexts",
    "Data collection and presentation skills are fundamental in modern society. In Zambia, these skills are applied in areas such as health surveys, agricultural production records, school attendance monitoring, and business sales tracking. Being able to read and interpret data presentations is a critical life skill for informed decision making",
    "Learners have prior knowledge of basic arithmetic operations, fractions, percentages, and algebraic expressions from previous terms",
    "Ministry of Education (2023) Mathematics I Syllabus Form 1-4. Curriculum Development Centre, Lusaka",
    "Data collected, organised and presented in real life situations correctly"
))

cursor.execute("""
    INSERT INTO topic (
        module_id, topic_name, sub_topic,
        general_competences, specific_competences,
        lesson_goal, rationale, prior_knowledge,
        references_, expected_standard
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
""", (
    term3_id,
    "Statistics",
    "Measures of Central Tendency",
    "Analytical Thinking, Communication, Problem Solving, Collaboration, Digital Literacy, Financial Literacy",
    "Use measures of central tendency in real life situations",
    "Learners will be able to calculate the mean, median and mode of ungrouped data from real life situations, interpret these measures in context, and determine the most appropriate measure for a given set of data",
    "Measures of central tendency allow learners to summarise large amounts of data into a single representative value. In Zambia, these measures are used in everyday contexts such as calculating average market prices, school test score averages, average rainfall figures, and typical household income levels, making them highly practical and relevant",
    "Learners have prior knowledge of data collection and presentation, frequency tables, basic arithmetic operations and fractions from the previous sub-topic and earlier terms",
    "Ministry of Education (2023) Mathematics I Syllabus Form 1-4. Curriculum Development Centre, Lusaka",
    "Measures of central tendency used in real life situations correctly"
))



conn.commit()
conn.close()

print("ECZ Mathematics I syllabus seeded successfully!")
print("")
print("Term 1 topics:")
print("  1. Numbers - Classification of Numbers")
print("  2. Numbers - Combined Operations on Real Numbers")
print("  3. Integers - The Four Operations on Integers")
print("  4. Approximations and Estimations - Approximations")
print("  5. Approximations and Estimations - Estimations")
print("  6. Sets - Operations on Sets")
print("")
print("Term 2 topics:")
print("  7. Algebra - Algebraic Expressions")
print("  8. Matrices - Operations on Matrices")
print("  9. Angles - Angles Associated with Straight Lines")
print("  10. Angles - Angle of Elevation and Depression")
print("")
print("Term 3 topics:")
print("  11. Trigonometry - Trigonometric Ratios")
print("  12. Statistics - Data Collection and Presentation")
print("  13. Statistics - Measures of Central Tendency")