"""
My Tutor Flow — AI Agent API
FastAPI backend that runs AI pipelines for the React frontend.
Run: uvicorn main:app --reload --port 8000
"""

import os
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from dotenv import load_dotenv

from pipelines.progress_report import generate_progress_comments

load_dotenv()

app = FastAPI(title="My Tutor Flow Agent API", version="1.0.0")

# CORS — allow requests from the React dev server and production domain
allowed_origins = os.getenv(
    "ALLOWED_ORIGINS",
    "http://localhost:5173,http://localhost:3000"
).split(",")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[o.strip() for o in allowed_origins],
    allow_credentials=True,
    allow_methods=["GET", "POST"],
    allow_headers=["Content-Type", "Authorization"],
)


# --- Request/Response Models ---

class SubjectMark(BaseModel):
    name: str
    marks: dict[str, str]   # { "Report Mark": "78", "Cycle Test": "82" }
    average: str             # "78.3"


class ProgressReportRequest(BaseModel):
    name: str
    grade: str
    school: str = ""
    term: str               # e.g. "2nd Term"
    subjects: list[SubjectMark]


class ProgressReportResponse(BaseModel):
    comments: str
    iterations: int
    approved: bool


# --- Routes ---

@app.get("/health")
def health():
    return {"status": "ok", "service": "my-tutor-flow-agents"}


@app.post("/api/generate-progress-comments", response_model=ProgressReportResponse)
async def generate_comments(req: ProgressReportRequest):
    """
    Generate AI-written progress report comments for a student.
    Accepts student profile + marks from Firebase (passed by React frontend).
    Runs a draft → review → revise loop and returns polished comments.
    """
    if not req.subjects:
        raise HTTPException(
            status_code=400,
            detail="At least one subject with marks is required to generate comments."
        )

    try:
        student_data = {
            "name": req.name,
            "grade": req.grade,
            "school": req.school,
            "term": req.term,
            "subjects": [s.model_dump() for s in req.subjects],
        }

        result = generate_progress_comments(student_data, max_iterations=3)
        return ProgressReportResponse(**result)

    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Pipeline failed: {str(e)}"
        )
