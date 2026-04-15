# QUICK START - AI LESSON PLANNER

**Get the system running in 5 minutes**

## Step 1: Get Your Gemini API Key (2 minutes)

1. Open [Google AI Studio](https://aistudio.google.com/app/apikey)
2. Click **"Create API Key"**
3. Click **"Create API key in new project"**
4. **Copy the API key** (you'll need it next)

## Step 2: Start the Backend (1 minute)

```bash
# Navigate to backend folder
cd backend

# Install Python dependencies (first time only)
pip install -r requirements.txt

# Set your API key (Linux/Mac)
export GEMINI_API_KEY="paste-your-api-key-here"

# On Windows, use:
set GEMINI_API_KEY=paste-your-api-key-here

# Start the backend server
python -m uvicorn main:app --reload --port 8000
```

**You should see:**
```
INFO:     Uvicorn running on http://127.0.0.1:8000
Database initialized and seeded!
```

✅ **Backend is ready!**

## Step 3: Start the Frontend (1 minute)

Open a **NEW terminal window** and:

```bash
# Navigate to frontend folder
cd frontend

# Install Node.js dependencies (first time only)
npm install

# Create environment file
echo "NEXT_PUBLIC_BACKEND_URL=http://localhost:8000" > .env.local

# Start the frontend server
npm run dev
```

**You should see:**
```
> Ready in 2.3s
> Local: http://localhost:3000
```

✅ **Frontend is ready!**

## Step 4: Open in Browser (30 seconds)

Open your web browser and go to:

**http://localhost:3000**

You should see the **AI Lesson Planner Home Page**

## Step 5: Create Your First Lesson Plan (1 minute)

1. Click **"Start Creating Lesson Plan"**
2. Select **"Term 1"**
3. Select any of the 4 topics (Numbers, Integers, Approximation, Sets)
4. Fill in your teacher information:
   - Your name
   - Class (e.g., 1A)
   - Date
   - Duration (45 minutes)
   - Number of learners (35)
   - Materials (textbook, whiteboard)
5. Click **"Generate Lesson Plan with AI"**
6. Wait 10-15 seconds for Gemini to generate the plan
7. Review the plan
8. Click **"Download as PDF"** to save it

## Done! 🎉

Your system is now running and generating lesson plans!

---

## Troubleshooting

### Backend won't start: `ModuleNotFoundError`
```bash
pip install -r requirements.txt
```

### Frontend won't connect to backend
- Make sure backend is running on port 8000
- Check `.env.local` file has the correct URL

### Gemini says invalid API key
- Double-check your API key is correct
- Make sure you set it with the right command

### Still having issues?
See **COMPLETE_SETUP_GUIDE.md** for detailed troubleshooting

---

## What's Next?

- **Add more topics:** Edit `backend/seed_data.py` and add your topics
- **Customize the form:** Edit `frontend/app/components/LessonPlanForm.tsx`
- **Change colors:** Edit styling in the component files
- **Deploy to production:** Use Vercel for frontend, any Python host for backend

---

**Questions?** Check the COMPLETE_SETUP_GUIDE.md file for detailed documentation.
