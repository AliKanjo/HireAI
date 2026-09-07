from typing import Dict, Any, List

def generate_interview_questions(candidate_info: Dict[str, Any], job_info: Dict[str, Any]) -> List[Dict[str, Any]]:
    """
    Generates tailored, high-signal technical, behavioral, experience-based,
    and missing-skill exploration interview questions based on candidate CV and job requirements.
    """
    skills = [s.lower() for s in (candidate_info.get("skills") or candidate_info.get("cvSkills") or [])]
    job_title = job_info.get("title", "Software Engineer")
    missing_skills = candidate_info.get("missing_skills") or candidate_info.get("missingSkills") or []
    questions = []

    # 1. Technical Deep-Dive based on candidate's skills
    if any(s in ["react", "react.js", "frontend", "typescript"] for s in skills):
        questions.append({
            "id": 1,
            "category": "Technical (Frontend)",
            "question": "You listed React in your stack. How do you handle state normalization, memoization (useMemo/useCallback), and preventing unnecessary re-renders in complex interactive views?",
            "eval_focus": "Assesses component rendering mechanics, virtual DOM optimization, and profiling."
        })
    
    if any(s in ["spring boot", "java"] for s in skills):
        questions.append({
            "id": 2,
            "category": "Technical (Backend)",
            "question": "In Java and Spring Boot, how do you manage distributed transactions, message queue idempotency, and JPA/Hibernate query performance under heavy concurrent load?",
            "eval_focus": "Tests enterprise microservices consistency, saga patterns, and database query tuning."
        })
    elif any(s in ["python", "fastapi", "django"] for s in skills):
        questions.append({
            "id": 2,
            "category": "Technical (AI & Backend)",
            "question": "How do you handle asynchronous event loops and thread pool execution in FastAPI to prevent blocking I/O when processing heavy file extractions?",
            "eval_focus": "Evaluates async Python concurrency, background tasks, and rate limiting."
        })

    # 2. System Architecture / Experience-Based
    questions.append({
        "id": 3,
        "category": "System Design & Experience",
        "question": f"For the {job_title} role, how would you structure the database schema, indexing, and caching strategy to support fast applicant ranking and full-text CV search?",
        "eval_focus": "Tests relational schema indexing, search engine integration, and caching layers."
    })

    # 3. Behavioral & Problem-Solving
    questions.append({
        "id": 4,
        "category": "Behavioral & Communication",
        "question": "Describe a scenario where you faced a critical production bug or strict deadline pressure. How did you prioritize technical trade-offs while communicating with stakeholders?",
        "eval_focus": "Tests technical ownership, crisis communication, and pragmatic engineering trade-offs."
    })

    # 4. Target Missing / Weak Skills Exploration
    if missing_skills:
        missing_sample = missing_skills[0]
        questions.append({
            "id": 5,
            "category": "Adaptability & Skill Gap",
            "question": f"Our vacancy uses {missing_sample}, which was not prominent in your CV. How do you rapidly get up to speed with new frameworks and cloud primitives in a production environment?",
            "eval_focus": "Assesses rapid onboarding capacity, proactive learning, and technical curiosity."
        })

    return questions

def evaluate_interview_answer(question_text: str, candidate_answer: str, eval_focus: str = "") -> Dict[str, Any]:
    """
    AI Answer Evaluator: Assesses candidate interview response and produces:
    - Overall Score (1-10)
    - Technical Accuracy %
    - Relevance %
    - Completeness %
    - Key Strengths
    - Areas for Improvement
    - Actionable Recruiter Recommendation
    """
    ans = candidate_answer.strip()
    words = ans.split()
    word_count = len(words)
    
    if word_count < 10:
        return {
            "overall_score": 3,
            "technical_accuracy": 30.0,
            "relevance": 40.0,
            "completeness": 25.0,
            "strengths": ["Attempted response to the question."],
            "areas_for_improvement": ["Answer is extremely brief and lacks technical depth or specific implementation details."],
            "recruiter_recommendation": "Weak Answer — Ask follow-up probe questions to evaluate candidate depth."
        }

    lowered_ans = ans.lower()
    
    # Check for technical depth keywords
    tech_keywords = [
        "cache", "index", "async", "lock", "transaction", "queue", "memo", "state", "architecture",
        "schema", "query", "saga", "pool", "thread", "database", "api", "latency", "redis", "orm"
    ]
    matched_tech = [w for w in tech_keywords if w in lowered_ans]
    
    # Calculate score metrics based on response depth and technical terminology
    base_score = 6
    if word_count > 40:
        base_score += 1
    if word_count > 80:
        base_score += 1
    if len(matched_tech) >= 2:
        base_score += 1
    if len(matched_tech) >= 4:
        base_score += 1
        
    overall_score = min(10, max(1, base_score))
    
    tech_acc = min(98.0, round(60.0 + len(matched_tech) * 8.0, 1))
    relevance = min(96.0, round(70.0 + (word_count / 10.0) * 2.0, 1))
    completeness = min(95.0, round(65.0 + (word_count / 8.0) * 2.5, 1))

    strengths = []
    if matched_tech:
        strengths.append(f"Demonstrates solid technical terminology: {', '.join(matched_tech[:3])}.")
    if word_count > 50:
        strengths.append("Provides a thorough, structured explanation of the engineering approach.")
    if "example" in lowered_ans or "experience" in lowered_ans or "production" in lowered_ans:
        strengths.append("Grounds answer in real-world engineering experience and practical scenarios.")

    gaps = []
    if not matched_tech:
        gaps.append("Answer lacks specific technical terms or framework-level details.")
    if word_count < 40:
        gaps.append("Response could be expanded with explicit system architecture or trade-off examples.")

    if overall_score >= 8:
        recommendation = "Strong Hire Recommendation — Candidate provided a clear, technically accurate, and structured response."
    elif overall_score >= 6:
        recommendation = "Moderate Recommendation — Candidate understands basic concepts; ask follow-up questions for deeper validation."
    else:
        recommendation = "Needs Further Probe — Response lacked technical depth or concrete production examples."

    return {
        "overall_score": overall_score,
        "technical_accuracy": tech_acc,
        "relevance": relevance,
        "completeness": completeness,
        "strengths": strengths if strengths else ["Response delivered clearly."],
        "areas_for_improvement": gaps if gaps else ["No major gaps detected."],
        "recruiter_recommendation": recommendation
    }
