import json
from semantic_search import perform_semantic_cv_search

sample_candidates = [
    {
        "id": 101,
        "candidateName": "Sarah Chen",
        "headline": "Senior Full-Stack Architect | 5+ Yrs Java & React",
        "cvSkills": ["Java", "Spring Boot", "React", "MySQL", "REST API", "Docker"],
        "cvExperienceYears": 5.5
    },
    {
        "id": 102,
        "candidateName": "Ali Al-Mansoor",
        "headline": "Backend Engineer (Java / Spring)",
        "cvSkills": ["Java", "Spring Boot", "PostgreSQL", "Git"],
        "cvExperienceYears": 4.0
    },
    {
        "id": 103,
        "candidateName": "John Miller",
        "headline": "Junior Frontend Developer",
        "cvSkills": ["React", "JavaScript", "HTML", "CSS"],
        "cvExperienceYears": 1.5
    }
]

def test_semantic_search():
    query = "Find backend developers experienced with Java and Spring who have more than 2 years experience"
    print(f"--- Query: '{query}' ---")
    
    response = perform_semantic_cv_search(query, sample_candidates)
    
    print("\nExtracted Search Intent:")
    print(json.dumps(response["extracted_intent"], indent=2))
    
    print("\nSearch Results:")
    for res in response["results"]:
        print(f"• {res['candidateName']} — {res['relevanceScore']}% relevant")
        print(f"  Reason: {res['searchMatchReason']}\n")

    top = response["results"][0]
    assert top["candidateName"] in ["Sarah Chen", "Ali Al-Mansoor"]
    assert top["relevanceScore"] > 85.0
    print("[OK] SEMANTIC CV SEARCH ENGINE TEST PASSED SUCCESSFULLY!")

if __name__ == "__main__":
    test_semantic_search()
