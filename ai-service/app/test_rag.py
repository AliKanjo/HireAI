import json
from rag_assistant import generate_rag_response

sample_jobs = [
    {
        "id": 1,
        "title": "Senior Java Developer",
        "companyName": "TechNova Dynamics",
        "requiredSkills": ["Java", "Spring Boot", "MySQL"],
        "minYearsExp": 4.0,
        "description": "Building high throughput microservices."
    }
]

sample_candidates = [
    {
        "id": 101,
        "candidateName": "Ahmed",
        "headline": "Senior Java Developer | 5 Yrs Exp",
        "cvSkills": ["Java", "Spring Boot", "MySQL", "Docker"],
        "cvExperienceYears": 5.0,
        "cvFileName": "Ahmed_Java_CV.pdf",
        "aiAnalysis": {"overallMatch": 94}
    },
    {
        "id": 102,
        "candidateName": "Ali",
        "headline": "Java & React Specialist | 4 Yrs Exp",
        "cvSkills": ["Java", "React", "PostgreSQL"],
        "cvExperienceYears": 4.0,
        "cvFileName": "Ali_Software_CV.pdf",
        "aiAnalysis": {"overallMatch": 89}
    },
    {
        "id": 103,
        "candidateName": "John",
        "headline": "Backend Engineer | 3 Yrs Exp",
        "cvSkills": ["Java", "Microservices", "Redis"],
        "cvExperienceYears": 3.0,
        "cvFileName": "John_Developer_CV.pdf",
        "aiAnalysis": {"overallMatch": 84}
    }
]

def test_rag_assistant():
    question = "Who are the best candidates for the Senior Java Developer position?"
    print(f"--- Question: '{question}' ---")
    
    response = generate_rag_response(question, sample_jobs, sample_candidates)
    
    print("\nRAG Grounded Answer:")
    print(response["answer"].encode('ascii', errors='replace').decode())
    
    print("\nSource References:")
    for src in response["sources"]:
        print(f"  [Source: {src}]")

    assert "Ahmed" in response["answer"]
    assert "94% Match" in response["answer"]
    assert len(response["sources"]) > 0
    print("\n[OK] RAG RECRUITMENT ASSISTANT TEST PASSED SUCCESSFULLY!")

if __name__ == "__main__":
    test_rag_assistant()
