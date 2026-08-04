# AI-Powered Lesson Planner
### CBU Final Year Project 2025/2026
**Student:** Mwaba Mambwe |
**SID:** 22106481  
**Supervisor:** Mrs Banda |
**School:** Copperbelt University

---

## Project Overview
An AI-powered web application that helps Zambian secondary school teachers generate complete, official lesson plans aligned to the CDC Zambia curriculum. Teachers can generate, edit, export and save lesson plans in seconds.

---

## Features
- AI-generated lesson plans using Groq (Llama 3.3 70B)
- CDC Zambia curriculum aligned topics (Mathematics I, Form 1, Term 1)
- Official Zambian lesson plan format with all 5 stages
- Editable lesson plan fields after generation
- PDF export in official Zambian template format
- Save and retrieve past lesson plans
- Teacher login and registration system (JWT authentication)
- Password strength validation
- Progressive Web App (PWA) with offline support
- Responsive design for desktop and mobile

---

## Tech Stack
### Backend
- Python 3.13
- FastAPI
- SQLite
- Groq API (llama-3.3-70b-versatile)
- python-jose (JWT authentication)
- passlib + bcrypt (password hashing)

### Frontend
- Next.js 14
- React 18
- Tailwind CSS v3
- jsPDF (PDF export)
- next-pwa (Progressive Web App)

---

## Project Structure