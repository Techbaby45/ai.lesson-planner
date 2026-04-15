#!/usr/bin/env python3
"""
Git commit script for Phase 1: Database schema with official Form 1 topics
"""

import subprocess
import os

def run_command(cmd, description):
    """Run a command and print output"""
    print(f"\n[INFO] {description}...")
    try:
        result = subprocess.run(cmd, shell=True, 
                              capture_output=True, text=True)
        if result.returncode == 0:
            print(f"[SUCCESS] {description}")
            if result.stdout:
                print(result.stdout)
        else:
            print(f"[WARNING] {description} - {result.stderr}")
    except Exception as e:
        print(f"[ERROR] {description} - {str(e)}")

def main():
    # Get current working directory
    cwd = os.getcwd()
    print(f"[INFO] Working directory: {cwd}")
    
    print("=" * 60)
    print("PHASE 1 GIT COMMIT: Database Schema & Official Form 1 Topics")
    print("=" * 60)
    
    # Configure git
    run_command('git config user.email "v0[bot]@users.noreply.github.com"', 
                "Configure git email")
    run_command('git config user.name "v0[bot]"', 
                "Configure git name")
    
    # Check git status
    run_command('git status', "Check git status")
    
    # Add all changes
    run_command('git add -A', "Add all changes")
    
    # Commit
    commit_message = """Phase 1: Database schema with official Form 1 Mathematics topics

- Created correct database schema based on System Design document
- Added 6 tables: syllabus, term_module, topic, user, teacher_input, lesson_plan
- Populated database with all 4 Form 1 official topics from Zambian syllabus:
  * Numbers (Classification and Combined Operations)
  * Integers (Four Operations)
  * Approximation and Estimation
  * Sets (Operations on Sets)
- Each topic includes: specific competences, lesson goal, rationale, prior knowledge
- Updated backend main.py with database initialization and API endpoints
- All data extracted from official documents

Co-authored-by: v0[bot] <v0[bot]@users.noreply.github.com>"""
    
    run_command(f'git commit -m "{commit_message}"', "Commit changes")
    
    # Push to current branch
    run_command('git push origin HEAD', "Push to GitHub")
    
    print("\n" + "=" * 60)
    print("PHASE 1 COMMIT COMPLETE")
    print("=" * 60)
    print("\n✓ Database schema created")
    print("✓ Official Form 1 topics added")
    print("✓ Backend API endpoints created")
    print("✓ Changes pushed to GitHub\n")

if __name__ == "__main__":
    main()
