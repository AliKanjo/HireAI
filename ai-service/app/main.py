import os
from typing import Dict, Any, List, Optional
from fastapi import FastAPI, File, UploadFile, Form, HTTPException, Body
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import json

from .cv_parser import extract_text_from_pdf_bytes, parse_cv_content
from .matcher import compute_cv_job_match
from .ranker import rank_job_candidates
from .semantic_search import perform_semantic_cv_search
from .rag_assistant import generate_rag_response
from .interview_assistant import generate_interview_questions, evaluate_interview_answer
from .recruitment_insights import compute_recruitment_insights

app = FastAPI(
    title="HireAI AI & CV Matching Microservice",
    description="Microservice providing complete AI suite: CV parsing, candidate matching, ranking, semantic search, RAG Assistant, Interview Assistant, and Recruitment Insights.",
    version="1.5.0"
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

class RankRequest(BaseModel):
    job_data: Dict[str, Any]
    candidates: List[Dict[str, Any]]

class SearchRequest(BaseModel):
    query: str
    candidates: List[Dict[str, Any]]

class RAGRequest(BaseModel):
    question: str
    jobs: List[Dict[str, Any]] = []
    candidates: List[Dict[str, Any]] = []
    hr_documents: Optional[List[Dict[str, Any]]] = None

class InterviewGenRequest(BaseModel):
    candidate_info: Dict[str, Any]
    job_info: Dict[str, Any]

class AnswerEvalRequest(BaseModel):
    question_text: str
    candidate_answer: str
    eval_focus: Optional[str] = ""

class InsightsRequest(BaseModel):
    jobs: List[Dict[str, Any]] = []
    applications: List[Dict[str, Any]] = []

@app.get("/health")
def health_check():
    return {"status": "ok", "service": "HireAI AI Engine", "version": "1.5.0"}

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

@app.post("/api/ai/rank-candidates")
async def rank_candidates_endpoint(payload: RankRequest):
    """
    Ranks all applicants for a job based on overall AI match scores,
    assigning badges (#1, #2, #3...) and rank explanations.
    """
    try:
        ranked = rank_job_candidates(payload.candidates, payload.job_data)
        return {"ranked_candidates": ranked}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Candidate ranking failed: {str(e)}")

@app.post("/api/ai/semantic-search")
async def semantic_search_endpoint(payload: SearchRequest):
    """
    Natural-language candidate search engine over candidate CV pool.
    Parses intent (skills, min exp years, domain) and returns candidates sorted by relevance score.
    """
    try:
        results = perform_semantic_cv_search(payload.query, payload.candidates)
        return results
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Semantic CV search failed: {str(e)}")

@app.post("/api/ai/rag-assistant")
async def rag_assistant_endpoint(payload: RAGRequest):
    """
    RAG Recruitment Assistant: Converts recruitment context (CVs, Jobs, HR docs) into vectors,
    retrieves grounded context snippets, and synthesizes an answer with grounded source citations.
    """
    try:
        results = generate_rag_response(payload.question, payload.jobs, payload.candidates, payload.hr_documents)
        return results
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"RAG Assistant execution failed: {str(e)}")

@app.post("/api/ai/insights")
async def insights_endpoint(payload: InsightsRequest):
    """
    AI Recruitment Insights Engine: Detects skill gaps, recruitment bottlenecks,
    funnel drop-offs, and generates natural language executive insights.
    """
    try:
        results = compute_recruitment_insights(payload.jobs, payload.applications)
        return results
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Recruitment insights computation failed: {str(e)}")

@app.get("/api/ai/insights")
async def get_insights_endpoint():
    """Fallback GET insights endpoint with sample data."""
    try:
        return compute_recruitment_insights([], [])
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Get insights failed: {str(e)}")

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
    """Generate contextual interview questions tailored to vacancy criteria & candidate CV."""
    try:
        questions = generate_interview_questions(payload.candidate_info, payload.job_info)
        return {"questions": questions}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Interview question generation failed: {str(e)}")

@app.post("/api/ai/evaluate-answer")
async def evaluate_answer_endpoint(payload: AnswerEvalRequest):
    """
    AI Answer Evaluator: Assesses candidate interview response and produces 1-10 overall score,
    technical accuracy, strengths, areas for improvement, and actionable recruiter recommendation.
    """
    try:
        evaluation = evaluate_interview_answer(payload.question_text, payload.candidate_answer, payload.eval_focus)
        return evaluation
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Answer evaluation failed: {str(e)}")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)
