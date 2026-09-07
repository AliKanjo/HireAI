import json
from interview_assistant import generate_interview_questions, evaluate_interview_answer

sample_candidate = {
    "name": "Sarah Chen",
    "skills": ["Java", "Spring Boot", "React", "MySQL"],
    "missing_skills": ["AWS"],
    "cvExperienceYears": 5.5
}

sample_job = {
    "title": "Senior Full-Stack Engineer",
    "required_skills": ["Java", "Spring Boot", "React", "AWS"]
}

def test_interview_ai():
    print("--- 1. Testing AI Question Generator ---")
    questions = generate_interview_questions(sample_candidate, sample_job)
    print(f"Generated {len(questions)} tailored questions:")
    for q in questions:
        print(f"• [{q['category']}] {q['question']}")

    assert len(questions) >= 3
    assert any("AWS" in q["question"] for q in questions)
    
    print("\n--- 2. Testing AI Answer Evaluator ---")
    sample_q = questions[0]["question"]
    sample_ans = "In Spring Boot microservices, I implement saga patterns for distributed transactions and use Redis caching alongside normalized MySQL indexes to optimize query throughput under heavy load."
    
    eval_res = evaluate_interview_answer(sample_q, sample_ans)
    print(json.dumps(eval_res, indent=2))
    
    assert eval_res["overall_score"] >= 8
    assert "Strong Hire" in eval_res["recruiter_recommendation"]
    print("\n[OK] AI INTERVIEW ASSISTANT & EVALUATOR TEST PASSED SUCCESSFULLY!")

if __name__ == "__main__":
    test_interview_ai()
