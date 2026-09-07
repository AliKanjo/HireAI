import json
from cv_parser import parse_cv_content
from matcher import compute_cv_job_match

sample_cv_text = """
SARAH CHEN
Senior Software Engineer
Email: sarah.chen@devmail.io | Phone: +1 (555) 019-2834
LinkedIn: linkedin.com/in/sarahchen | GitHub: github.com/sarahchen

SUMMARY
Experienced Full-Stack Software Engineer with 5.5 years of experience developing enterprise microservices in Java, Spring Boot, React, and MySQL. Skilled in Docker, Kubernetes, and REST API design.

SKILLS
Programming: Java, JavaScript, TypeScript, Python, SQL, HTML, CSS
Frameworks: Spring Boot, React, Node.js, Express, FastAPI
Databases: MySQL, PostgreSQL, Redis
Cloud & Tools: Docker, Kubernetes, Git, CI/CD, Agile, Scrum

EXPERIENCE
Senior Backend Engineer at Tech Corp (2021 - Present)
- Architected RESTful microservices processing 5M+ daily requests using Java 17 and Spring Boot.
- Built interactive dashboard UI components in React and TypeScript.

Full Stack Developer at Cloud Solutions (2018 - 2021)
- Developed scalable web applications using Node.js, React, and PostgreSQL.

EDUCATION
Bachelor of Science in Computer Science, State University (2018)
"""

job_requirements = {
    "title": "Senior Full-Stack Developer",
    "required_skills": ["Java", "Spring Boot", "React", "MySQL", "AWS"],
    "preferred_skills": ["TypeScript", "Docker", "Kubernetes"],
    "min_years_experience": 4.0,
    "min_education": "Bachelor"
}

def test_ai_core():
    print("--- 1. Testing CV AI Analysis ---")
    parsed_cv = parse_cv_content(sample_cv_text)
    print(json.dumps(parsed_cv, indent=2))
    
    print("\n--- 2. Testing CV <-> Job Matching ---")
    match_result = compute_cv_job_match(parsed_cv, job_requirements)
    print(json.dumps(match_result, indent=2))
    
    assert parsed_cv["name"] == "SARAH CHEN"
    assert parsed_cv["email"] == "sarah.chen@devmail.io"
    assert "Java" in parsed_cv["skills"]
    assert "Spring Boot" in parsed_cv["skills"]
    assert "React" in parsed_cv["skills"]
    assert parsed_cv["estimated_years_experience"] >= 5.0
    
    assert match_result["overall_match"] > 70.0
    assert len(match_result["strengths"]) > 0
    assert len(match_result["gaps"]) > 0
    print("\n[OK] CORE AI TEST PASSED SUCCESSFULLY!")

if __name__ == "__main__":
    test_ai_core()
