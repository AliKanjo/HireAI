import os
from typing import Dict, Any, List, Optional
from fastapi import FastAPI, File, UploadFile, Form, HTTPException, Body
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import json

from .cv_parser import extract_text_from_pdf_bytes, parse_cv_content
from .matcher import compute_cv_job_match
from .interview_assistant import generate_interview_questions

app = FastAPI(
    title="HireAI AI & CV Matching Microservice",
    description="Microservice providing CV parsing, LLM-enhanced candidate matching, and intelligent interview question synthesis.",
    version="1.0.0"
)

# Enable CORS for React frontend and Laravel backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class JobRequirements(BaseModel):
    title: str
    required_skills: List[str] = []
    preferred_skills: List[str] = []
    min_years_experience: float = 2.0
    min_education: str = "Bachelor"
    description: Optional[str] = ""

class MatchRequest(BaseModel):
    cv_data: Dict[str, Any]
    job_data: JobRequirements

class InterviewGenRequest(BaseModel):
    candidate_info: Dict[str, Any]
    job_info: Dict[str, Any]

@app.get("/health")
def health_check():
    return {"status": "ok", "service": "HireAI AI Engine", "version": "1.0.0"}

@app.post("/api/ai/parse-cv")
async def parse_cv_endpoint(file: UploadFile = File(...)):
    """Upload and extract structured profile data from a CV file (PDF/Text)."""
    try:
        content = await file.read()
        raw_text = extract_text_from_pdf_bytes(content)
        parsed = parse_cv_content(raw_text)
        return {
            "filename": file.filename,
            "parsed_cv": parsed
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to parse CV: {str(e)}")

@app.post("/api/ai/match-cv")
async def match_cv_endpoint(payload: MatchRequest):
    """Compute multidimensional match scores between candidate CV and job requirements."""
    try:
        results = compute_cv_job_match(payload.cv_data, payload.job_data.model_dump())
        return results
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Match evaluation failed: {str(e)}")

@app.post("/api/ai/analyze-cv-file")
async def analyze_cv_file_endpoint(
    file: UploadFile = File(...),
    job_json: str = Form(...)
):
    """One-stop endpoint: Ingests CV PDF, parses data, runs matching against job JSON, and returns full analysis."""
    try:
        content = await file.read()
        raw_text = extract_text_from_pdf_bytes(content)
        parsed_cv = parse_cv_content(raw_text)
        
        job_data = json.loads(job_json)
        match_result = compute_cv_job_match(parsed_cv, job_data)
        
        # Also pre-generate questions
        questions = generate_interview_questions({**parsed_cv, **match_result}, job_data)
        
        return {
            "parsed_cv": parsed_cv,
            "match_analysis": match_result,
            "generated_questions": questions
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Analysis pipeline error: {str(e)}")

@app.post("/api/ai/generate-questions")
async def generate_questions_endpoint(payload: InterviewGenRequest):
    """Generate contextual interview questions for a shortlisted candidate."""
    try:
        questions = generate_interview_questions(payload.candidate_info, payload.job_info)
        return {"questions": questions}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Interview question generation failed: {str(e)}")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)
