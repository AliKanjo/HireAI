import json
from ranker import rank_job_candidates

sample_job = {
    "title": "Senior Full-Stack Engineer",
    "required_skills": ["React", "Java", "Spring Boot", "MySQL"],
    "preferred_skills": ["AWS", "Docker"],
    "min_years_experience": 4.0
}

sample_candidates = [
    {
        "id": 101,
        "candidateName": "Sarah Chen",
        "cvSkills": ["React", "Java", "Spring Boot", "MySQL", "Docker", "TypeScript"],
        "cvExperienceYears": 5.5,
        "cvEducation": "B.S. in Computer Science"
    },
    {
        "id": 102,
        "candidateName": "Ali Al-Mansoor",
        "cvSkills": ["Java", "Spring Boot", "MySQL"],
        "cvExperienceYears": 4.0,
        "cvEducation": "Bachelor of Software Engineering"
    },
    {
        "id": 103,
        "candidateName": "John Miller",
        "cvSkills": ["React", "JavaScript", "HTML", "CSS"],
        "cvExperienceYears": 2.0,
        "cvEducation": "Diploma"
    }
]

def test_ranker():
    print("--- Testing Candidate Ranking Engine ---")
    ranked = rank_job_candidates(sample_candidates, sample_job)
    
    for r in ranked:
        print(f"{r['badge']} - {r['candidateName']} ({r['aiAnalysis']['overall_match']}% Match)")
        print(f"   Reason: {r['rankReason']}\n")

    assert ranked[0]["candidateName"] == "Sarah Chen"
    assert ranked[0]["rank"] == 1
    assert "Rank #1" in ranked[0]["badge"]
    print("[OK] CANDIDATE RANKING ENGINE TEST PASSED SUCCESSFULLY!")

if __name__ == "__main__":
    test_ranker()
