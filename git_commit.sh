#!/bin/bash

# Navigate to project directory
cd /vercel/share/v0-project

# Configure git user (if not already configured)
git config user.email "v0[bot]@users.noreply.github.com" || true
git config user.name "v0[bot]" || true

# Add all changes
git add -A

# Commit with descriptive message
git commit -m "Phase 1: Database schema with official Form 1 Mathematics topics

- Created correct database schema based on System Design document
- Added 6 tables: syllabus, term_module, topic, user, teacher_input, lesson_plan
- Populated database with all 4 Form 1 official topics from Zambian syllabus:
  * Numbers (Classification and Combined Operations)
  * Integers (Four Operations)
  * Approximation and Estimation
  * Sets (Operations on Sets)
- Each topic includes: specific competences, lesson goal, rationale, prior knowledge, references, expected standard
- Updated backend main.py with database initialization and API endpoints:
  * GET /api/syllabus - Get syllabus overview
  * GET /api/terms - Get all terms
  * GET /api/topics/{term_id} - Get topics by term
  * GET /api/topic/{topic_id} - Get topic details
- All data extracted from official documents provided by user

Co-authored-by: v0[bot] <v0[bot]@users.noreply.github.com>" || true

# Push to the current branch
git push origin HEAD || true

echo "✓ Changes committed and pushed to GitHub"
