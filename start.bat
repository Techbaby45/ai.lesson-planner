@echo off
echo Starting AI Lesson Planner...
echo.

:: Start Backend
echo Starting Backend...
start "Backend" cmd /k "cd /d %USERPROFILE%\ai.lesson-planner\backend && venv\Scripts\activate && uvicorn main:app --reload"

:: Wait 3 seconds for backend to start
timeout /t 3 /nobreak > nul

:: Start Frontend
echo Starting Frontend...
start "Frontend" cmd /k "cd /d %USERPROFILE%\ai.lesson-planner\frontend && npm run dev"

echo.
echo Both servers are starting...
echo Backend will be at http://127.0.0.1:8000
echo Frontend will be at http://localhost:3000
echo.
pause