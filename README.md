# Resume Tailor

An AI-powered web app that tailors your resume to a specific job description and outputs ATS-optimised LaTeX ready to compile on Overleaf.

## Live Demo
🔗 [resume-tailor-omega-rosy.vercel.app](https://resume-tailor-omega-rosy.vercel.app/)

## How It Works
1. Upload your master resume (PDF or DOCX)
2. Upload the job description (PDF, DOCX or TXT)
3. Click Generate — Claude analyses both documents
4. Copy the tailored LaTeX output into Overleaf and compile

## What It Does
- Extracts text from PDF and DOCX files server-side
- Sends both documents to Claude (Anthropic) with a strict prompt
- Rewrites and reorders resume bullets to mirror JD terminology
- Never fabricates or exaggerates experience
- Returns a gap analysis of JD requirements not found in your resume

## Tech Stack
| Layer | Technology |
|---|---|
| Frontend | React, Vite |
| Backend | Python, FastAPI |
| AI | Anthropic Claude API |
| PDF Parsing | PyMuPDF |
| DOCX Parsing | python-docx |
| Frontend Hosting | Vercel |
| Backend Hosting | Railway |

## Project Structure
```
resume_maker/
├── frontend/          # React + Vite app
│   └── src/
│       └── App.jsx    # Main UI component
└── backend/           # FastAPI app
    ├── main.py        # API routes
    ├── extractor.py   # PDF/DOCX text extraction
    ├── tailor.py      # Claude API + prompt engineering
    └── requirements.txt
```

## Local Development

### Backend
```bash
cd backend
python -m venv venv
venv\Scripts\activate        # Windows
pip install -r requirements.txt
# Create .env with ANTHROPIC_API_KEY=your_key
uvicorn main:app --reload
```

### Frontend
```bash
cd frontend
npm install
npm run dev
```

## Environment Variables
| Variable | Where | Description |
|---|---|---|
| `ANTHROPIC_API_KEY` | Railway (backend) | Anthropic API key |