import io
import re
from typing import Dict, Any, List
try:
    import pypdf
except ImportError:
    pypdf = None

COMMON_SKILLS = [
    "python", "javascript", "typescript", "react", "react.js", "vue", "angular", "node.js", "nodejs",
    "express", "fastapi", "flask", "django", "java", "spring boot", "c#", ".net", "php", "laravel",
    "sql", "mysql", "postgresql", "mongodb", "redis", "docker", "kubernetes", "aws", "azure", "gcp",
    "git", "ci/cd", "rest api", "graphql", "html", "css", "tailwind css", "figma", "agile", "scrum",
    "linux", "microservices", "unit testing", "machine learning", "pytorch", "tensorflow", "pandas"
]

def extract_text_from_pdf_bytes(file_bytes: bytes) -> str:
    """Extract raw textual content from uploaded PDF byte stream."""
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
    else:
        # Fallback to UTF-8 decoding if plain text or pypdf not present
        try:
            text = file_bytes.decode('utf-8', errors='ignore')
        except Exception:
            text = "Unable to parse PDF stream."
    return text.strip()

def parse_cv_content(raw_text: str) -> Dict[str, Any]:
    """Parse structured candidate information from CV text."""
    # 1. Extract Email
    email_match = re.search(r'[\w\.-]+@[\w\.-]+\.\w+', raw_text)
    email = email_match.group(0) if email_match else ""

    # 2. Extract Phone Number
    phone_match = re.search(r'(\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}', raw_text)
    phone = phone_match.group(0) if phone_match else ""

    # 3. Extract Name (Heuristic: first non-empty line or capitalized line)
    lines = [line.strip() for line in raw_text.split('\n') if line.strip()]
    name = lines[0] if lines else "Applicant"
    if len(name) > 60 or "@" in name or "resume" in name.lower() or "curriculum" in name.lower():
        name = "Candidate"

    # 4. Extract Skills
    lowered_text = raw_text.lower()
    extracted_skills = []
    for skill in COMMON_SKILLS:
        # Match whole words or phrase
        pattern = r'(?<!\w)' + re.escape(skill) + r'(?!\w)'
        if re.search(pattern, lowered_text):
            # Normalize casing
            formatted_skill = skill.title()
            if skill in ["aws", "gcp", "sql", "html", "css", "ci/cd", "rest api", "php"]:
                formatted_skill = skill.upper()
            elif skill in ["node.js", "nodejs", "react.js", "vue", "angular", "fastapi", "spring boot"]:
                formatted_skill = skill
            extracted_skills.append(formatted_skill)

    # 5. Extract Experience & Years estimate
    years_match = re.findall(r'(\d+)\+?\s*(?:years|yrs)\s+(?:of\s+)?experience', lowered_text)
    estimated_years = max([int(y) for y in years_match]) if years_match else 2.5

    # 6. Extract Education keywords
    education_found = []
    edu_keywords = ["bachelor", "master", "phd", "b.sc", "b.tech", "m.sc", "computer science", "engineering", "diploma"]
    for keyword in edu_keywords:
        if keyword in lowered_text:
            education_found.append(keyword.title())

    return {
        "name": name,
        "email": email,
        "phone": phone,
        "estimated_years_experience": estimated_years,
        "skills": list(dict.fromkeys(extracted_skills)),
        "education": list(dict.fromkeys(education_found)),
        "raw_text_preview": raw_text[:300] + "..." if len(raw_text) > 300 else raw_text
    }
