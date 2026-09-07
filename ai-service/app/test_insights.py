import json
from recruitment_insights import compute_recruitment_insights

sample_jobs = [
    {
        "id": 1,
        "title": "Senior Full-Stack Engineer",
        "requiredSkills": ["React", "Java", "Spring Boot", "MySQL", "Docker", "AWS"]
    },
    {
        "id": 2,
        "title": "AI & Python Backend Engineer",
        "requiredSkills": ["Python", "FastAPI", "Docker", "Kubernetes", "Redis"]
    }
]

sample_applications = [
    {
        "id": 101,
        "jobId": 1,
        "candidateName": "Sarah Chen",
        "status": "Shortlisted",
        "cvSkills": ["React", "Java", "Spring Boot", "MySQL"],
        "aiAnalysis": {"overallMatch": 94, "missingSkills": ["Docker", "AWS"]}
    },
    {
        "id": 102,
        "jobId": 1,
        "candidateName": "Ali Al-Mansoor",
        "status": "Under Review",
        "cvSkills": ["Java", "Spring Boot"],
        "aiAnalysis": {"overallMatch": 82, "missingSkills": ["React", "Docker", "AWS"]}
    },
    {
        "id": 103,
        "jobId": 2,
        "candidateName": "John Miller",
        "status": "Rejected",
        "cvSkills": ["Python", "Flask"],
        "aiAnalysis": {"overallMatch": 65, "missingSkills": ["Docker", "Kubernetes", "Redis"]}
    }
]

def test_insights():
    print("--- Testing AI Recruitment Insights Engine ---")
    insights_res = compute_recruitment_insights(sample_jobs, sample_applications)
    print(json.dumps(insights_res, indent=2))

    assert insights_res["total_jobs"] == 2
    assert insights_res["total_applications"] == 3
    assert insights_res["average_match_score"] > 70.0
    assert "Docker" in insights_res["top_missing_skills"]
    assert len(insights_res["insights"]) >= 3
    print("\n[OK] AI RECRUITMENT INSIGHTS TEST PASSED SUCCESSFULLY!")

if __name__ == "__main__":
    test_insights()
