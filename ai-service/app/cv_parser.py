import io
import re
import os
from typing import Dict, Any, List, Optional
try:
    import pypdf
except ImportError:
    pypdf = None

# Comprehensive skill catalog by category
SKILL_CATALOG = {
    "languages": [
        "python", "javascript", "typescript", "java", "c#", "c++", "php", "ruby", "go", "golang",
        "swift", "kotlin", "rust", "scala", "sql", "html", "css", "html5", "css3", "bash", "shell"
    ],
    "frameworks": [
        "react", "react.js", "reactjs", "vue", "vue.js", "angular", "node.js", "nodejs", "express",
        "express.js", "fastapi", "flask", "django", "spring", "spring boot", ".net", "dotnet",
        "asp.net", "laravel", "symfony", "ruby on rails", "rails", "next.js", "nuxt", "tailwind",
        "tailwind css", "bootstrap", "graphql", "rest api", "microservices"
    ],
    "databases": [
        "sql", "mysql", "postgresql", "postgres", "mongodb", "redis", "elasticsearch", "sqlite",
        "oracle", "sql server", "dynamodb", "cassandra", "mariadb", "firebase"
    ],
    "cloud_devops": [
        "aws", "azure", "gcp", "google cloud", "docker", "kubernetes", "k8s", "git", "github",
        "gitlab", "ci/cd", "jenkins", "terraform", "ansible", "linux", "unix", "nginx", "apache"
    ],
    "tools_methodologies": [
        "agile", "scrum", "jira", "confluence", "figma", "unit testing", "jest", "pytest",
        "junit", "cypress", "selenium", "machine learning", "pytorch", "tensorflow", "pandas",
        "numpy", "scikit-learn", "data analysis"
    ]
}

# Flatten catalog for easy lookup
ALL_SKILLS = []
SKILL_TO_CATEGORY = {}
for category, skills in SKILL_CATALOG.items():
    for skill in skills:
        ALL_SKILLS.append(skill)
        SKILL_TO_CATEGORY[skill] = category

def format_skill_name(skill: str) -> str:
    """Formats skill string nicely for presentation."""
    skill_lower = skill.lower()
    custom_casing = {
        "aws": "AWS",
        "gcp": "GCP",
        "sql": "SQL",
        "html": "HTML",
        "css": "CSS",
        "ci/cd": "CI/CD",
        "rest api": "REST API",
        "php": "PHP",
        "node.js": "Node.js",
        "nodejs": "Node.js",
        "react.js": "React",
        "reactjs": "React",
        "vue.js": "Vue.js",
        "fastapi": "FastAPI",
        "spring boot": "Spring Boot",
        "postgresql": "PostgreSQL",
        "postgres": "PostgreSQL",
        "mongodb": "MongoDB",
        "c#": "C#",
        "c++": "C++",
        ".net": ".NET",
        "dotnet": ".NET",
        "next.js": "Next.js",
        "javascript": "JavaScript",
        "typescript": "TypeScript",
        "graphql": "GraphQL"
    }
    if skill_lower in custom_casing:
        return custom_casing[skill_lower]
    return skill.title()

def extract_text_from_pdf_bytes(file_bytes: bytes) -> str:
    """Extract raw text content from uploaded PDF byte stream."""
    text = ""
    if pypdf:
        try:
            reader = pypdf.PdfReader(io.BytesIO(file_bytes))
            for page in reader.pages:
                extracted = page.extract_text()
                if extracted:
                    text += extracted + "\n"
        except Exception as e:
            text = f"Error reading PDF: {str(e)}"
    
    if not text.strip():
        try:
            text = file_bytes.decode('utf-8', errors='ignore')
        except Exception:
            text = "Unable to parse PDF content stream."
            
    return text.strip()

def parse_cv_content(raw_text: str) -> Dict[str, Any]:
    """Parse structured candidate details from raw CV text."""
    lowered_text = raw_text.lower()
    lines = [line.strip() for line in raw_text.split('\n') if line.strip()]
    
    # 1. Candidate Name
    name = "Candidate Applicant"
    if lines:
        possible_name = lines[0]
        if len(possible_name) <= 50 and not re.search(r'[@:]|resume|curriculum|cv|page', possible_name.lower()):
            name = possible_name
        elif len(lines) > 1 and len(lines[1]) <= 50 and not re.search(r'[@:]|resume|curriculum|cv', lines[1].lower()):
            name = lines[1]

    # 2. Email Address
    email_match = re.search(r'[\w\.-]+@[\w\.-]+\.\w+', raw_text)
    email = email_match.group(0) if email_match else ""

    # 3. Phone Number
    phone_match = re.search(r'(\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}', raw_text)
    phone = phone_match.group(0) if phone_match else ""

    # 4. Social Links (LinkedIn, GitHub)
    linkedin_match = re.search(r'(?:https?://)?(?:www\.)?linkedin\.com/in/[\w-]+', lowered_text)
    linkedin = linkedin_match.group(0) if linkedin_match else ""
    
    github_match = re.search(r'(?:https?://)?(?:www\.)?github\.com/[\w-]+', lowered_text)
    github = github_match.group(0) if github_match else ""

    # 5. Extract Skills & Group by Category
    extracted_skills = set()
    skills_by_category = {cat: [] for cat in SKILL_CATALOG.keys()}
    
    for skill in ALL_SKILLS:
        # Match boundary sensitive pattern
        pattern = r'(?<!\w)' + re.escape(skill) + r'(?!\w)'
        if re.search(pattern, lowered_text):
            formatted = format_skill_name(skill)
            extracted_skills.add(formatted)
            cat = SKILL_TO_CATEGORY[skill]
            if formatted not in skills_by_category[cat]:
                skills_by_category[cat].append(formatted)

    skills_list = sorted(list(extracted_skills))

    # 6. Extract Experience & Total Years
    years_match = re.findall(r'(\d+(?:\.\d+)?)\+?\s*(?:years|yrs)\s+(?:of\s+)?experience', lowered_text)
    if years_match:
        estimated_years = max([float(y) for y in years_match])
    else:
        # Check date range patterns e.g. 2018 - 2023 or 2019 - Present
        date_ranges = re.findall(r'(20\d\d|19\d\d)\s*[-–to]+\s*(20\d\d|present|current)', lowered_text)
        total_yrs = 0
        current_year = 2026
        for start, end in date_ranges:
            start_yr = int(start)
            end_yr = current_year if end in ["present", "current"] else int(end)
            diff = max(1, end_yr - start_yr)
            total_yrs += diff
        estimated_years = float(total_yrs) if total_yrs > 0 else 3.0

    # 7. Extract Education
    education_entries = []
    edu_keywords = {
        "master": "Master of Science / Engineering",
        "m.s": "Master of Science",
        "m.sc": "Master of Science",
        "bachelor": "Bachelor of Science / Engineering",
        "b.s": "Bachelor of Science",
        "b.sc": "Bachelor of Science",
        "b.tech": "Bachelor of Technology",
        "phd": "Ph.D. in Computer Science / Engineering",
        "doctorate": "Doctorate",
        "diploma": "Technical Diploma",
        "bootcamp": "Full-Stack Software Engineering Bootcamp"
    }
    for key, title in edu_keywords.items():
        if key in lowered_text:
            if title not in education_entries:
                education_entries.append(title)
    if not education_entries:
        education_entries.append("Bachelor of Science in Computer Science / Related Field")

    # 8. Extract Summary
    summary = ""
    summary_match = re.search(r'(?:summary|profile|about me|objective)[:\s\n]+([^\n]+(?:\n[^\n]+){1,3})', raw_text, re.IGNORECASE)
    if summary_match:
        summary = summary_match.group(1).strip()
    else:
        summary = f"Passionate software engineer with ~{estimated_years:g} years of experience specializing in {', '.join(skills_list[:4]) if skills_list else 'software development'}."

    # 9. Extract Work Experience Timeline
    experience_list = []
    exp_sections = re.split(r'\n(?=[A-Z][a-zA-Z\s]{2,30}\s*(?:[-–|]\s*|at\s+))', raw_text)
    for sec in exp_sections[:4]:
        sec_clean = sec.strip()
        if len(sec_clean) > 20 and not any(h in sec_clean.lower() for h in ["education", "skills", "certifications"]):
            first_line = sec_clean.split('\n')[0]
            experience_list.append({
                "title": first_line,
                "description": sec_clean[:200] + "..." if len(sec_clean) > 200 else sec_clean
            })

    return {
        "name": name,
        "email": email,
        "phone": phone,
        "linkedin": linkedin,
        "github": github,
        "summary": summary,
        "estimated_years_experience": estimated_years,
        "skills": skills_list,
        "skills_by_category": skills_by_category,
        "education": education_entries,
        "experience": experience_list,
        "raw_text_preview": raw_text[:400] + "..." if len(raw_text) > 400 else raw_text
    }
