from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from extractor import extract_text
from tailor import tailor_resume

app = FastAPI(title="Resume Tailor API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # tighten this after deployment
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def health_check():
    return {"status": "ok", "message": "Resume Tailor API is running"}

@app.post("/tailor")
async def tailor(
    resume: UploadFile = File(...),
    jd: UploadFile = File(...)
):
    # Validate file types
    allowed = {".pdf", ".docx", ".txt"}
    for f in [resume, jd]:
        ext = "." + f.filename.split(".")[-1].lower()
        if ext not in allowed:
            raise HTTPException(status_code=400, detail=f"Unsupported file type: {f.filename}")

    # Read file bytes
    resume_bytes = await resume.read()
    jd_bytes = await jd.read()

    # Extract text
    try:
        resume_text = extract_text(resume.filename, resume_bytes)
        jd_text = extract_text(jd.filename, jd_bytes)
    except Exception as e:
        raise HTTPException(status_code=422, detail=f"Text extraction failed: {str(e)}")

    if not resume_text or not jd_text:
        raise HTTPException(status_code=422, detail="Could not extract text from one or both files")

    # Call Claude
    try:
        result = tailor_resume(resume_text, jd_text)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Claude API error: {str(e)}")

    return result