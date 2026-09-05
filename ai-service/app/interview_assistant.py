from typing import Dict, Any, List

def generate_interview_questions(candidate_info: Dict[str, Any], job_info: Dict[str, Any]) -> List[Dict[str, Any]]:
    """
    Generates tailored, high-signal technical, architectural, and behavioral
    interview questions based on candidate CV profile and job requirements.
    """
    skills = candidate_info.get("skills", [])
    job_title = job_info.get("title", "Software Engineer")
    questions = []

    # 1. Technical Deep-Dive based on candidate's claimed skills
    if any(s.lower() in ["react", "react.js", "frontend"] for s in skills):
        questions.append({
            "category": "Technical (Frontend)",
            "question": "You listed React as a core skill. How would you design and manage global state, side-effects, and performance optimization (such as memoization and virtualized lists) in a high-traffic dashboard application?",
            "eval_focus": "Evaluates component lifecycle knowledge, state management architecture, and DOM rendering optimizations."
        })
    
    if any(s.lower() in ["spring boot", "java"] for s in skills):
        questions.append({
            "category": "Technical (Backend)",
            "question": "You mentioned experience with Java & Spring Boot. How would you design a resilient REST API with distributed transactions or asynchronous event queues for processing batch CV applications?",
            "eval_focus": "Tests enterprise microservices architecture, dependency injection, and data consistency patterns."
        })
    elif any(s.lower() in ["laravel", "php"] for s in skills):
        questions.append({
            "category": "Technical (Backend)",
            "question": "You have experience with Laravel & PHP. How do you handle database query optimization (eager loading vs N+1 queries) and background job processing with queues under heavy concurrent load?",
            "eval_focus": "Tests ORM performance awareness, caching strategies with Redis, and queue workers."
        })
    elif any(s.lower() in ["python", "fastapi", "django"] for s in skills):
        questions.append({
            "category": "Technical (AI & Backend)",
            "question": "Given your experience with Python, how would you structure an asynchronous FastAPI service to handle computationally heavy document parsing and LLM API rate limiting concurrently?",
            "eval_focus": "Evaluates async I/O mastery, concurrency control, and API error resilience."
        })

    # 2. Architecture & Database Design Question
    questions.append({
        "category": "System Architecture",
        "question": f"For our {job_title} vacancy, how would you design the data model and indexing strategy to allow sub-second full-text filtering over millions of candidate profiles and CV attachments?",
        "eval_focus": "Evaluates schema design, database partitioning, and trade-offs between relational DBs vs search engines (Elastic/OpenSearch)."
    })

    # 3. Behavioral & Problem-Solving
    questions.append({
        "category": "Behavioral & Delivery",
        "question": "Can you describe a challenging bug or performance bottleneck you encountered in production in your previous role, and how you diagnosed and permanently resolved it?",
        "eval_focus": "Tests problem-solving approach, observability/logging techniques, and post-mortem mindset."
    })

    # 4. Gaps / Edge verification
    missing_skills = candidate_info.get("missing_skills", [])
    if missing_skills:
        missing_sample = missing_skills[0]
        questions.append({
            "category": "Domain Adaptability",
            "question": f"Our tech stack relies on {missing_sample}, which was not explicitly highlighted in your CV. How do you approach quickly onboarding and achieving production fluency with new frameworks or cloud primitives?",
            "eval_focus": "Assesses learning agility, proactive upskilling, and technical adaptability."
        })

    return questions
