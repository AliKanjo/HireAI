import os
import json
from typing import Dict, Any, List, Set

def normalize_skill(skill: str) -> str:
    """Normalize skill variations for strict matching (e.g., 'React.js' -> 'react')."""
    s = skill.lower().strip()
    synonyms = {
        "react.js": "react",
        "reactjs": "react",
        "node.js": "node.js",
        "nodejs": "node.js",
        "vue.js": "vue",
        "vuejs": "vue",
        "spring boot": "spring boot",
        "spring": "spring boot",
        "postgres": "postgresql",
        "postgresql": "postgresql",
        "docker": "docker",
        "k8s": "kubernetes",
        "kubernetes": "kubernetes",
        "aws": "aws",
        "amazon web services": "aws",
        "gcp": "gcp",
        "google cloud": "gcp",
        "python3": "python",
        "golang": "go",
        "go": "go",
        "c#": "c#",
        ".net": ".net",
        "dotnet": ".net"
    }
    return synonyms.get(s, s)

def compute_cv_job_match(cv_data: Dict[str, Any], job_data: Dict[str, Any]) -> Dict[str, Any]:
    """
    Compares candidate CV data with job requirements to compute multidimensional match scores:
    - Overall Match %
    - Skills Match %
    - Experience Match %
    - Education Match %
    - Requirements Match %
    And generates detailed natural language feedback, strengths, and gap analysis.
    """
    raw_cand_skills = cv_data.get("skills", [])
    cand_skills = set(normalize_skill(s) for s in raw_cand_skills)

    raw_req_skills = job_data.get("required_skills", []) or job_data.get("requiredSkills", [])
    raw_pref_skills = job_data.get("preferred_skills", []) or job_data.get("preferredSkills", [])

    req_skills = set(normalize_skill(s) for s in raw_req_skills)
    pref_skills = set(normalize_skill(s) for s in raw_pref_skills)

    # 1. Skills Match Calculation
    if req_skills:
        matched_required = cand_skills.intersection(req_skills)
        req_ratio = len(matched_required) / len(req_skills)
    else:
        matched_required = cand_skills
        req_ratio = 1.0

    if pref_skills:
        matched_pref = cand_skills.intersection(pref_skills)
        pref_ratio = len(matched_pref) / len(pref_skills)
    else:
        matched_pref = set()
        pref_ratio = 1.0

    skills_score = round((req_ratio * 0.75 + pref_ratio * 0.25) * 100, 1)
    skills_score = min(100.0, max(25.0, skills_score))

    # 2. Experience Match Calculation
    cand_exp = float(cv_data.get("estimated_years_experience", cv_data.get("yearsOfExperience", 3.0)))
    job_min_exp = float(job_data.get("min_years_experience", job_data.get("minYearsExp", 3.0)))

    if cand_exp >= job_min_exp:
        exp_score = min(100.0, 90.0 + (cand_exp - job_min_exp) * 3)
    else:
        exp_score = max(35.0, 100.0 - (job_min_exp - cand_exp) * 22.0)
    exp_score = round(exp_score, 1)

    # 3. Education Match Calculation
    raw_cand_edu = cv_data.get("education", [])
    if isinstance(raw_cand_edu, str):
        cand_edu = [raw_cand_edu.lower()]
    else:
        cand_edu = [str(e).lower() for e in raw_cand_edu]
        
    job_min_edu = str(job_data.get("min_education", job_data.get("minEducation", "bachelor"))).lower()

    if any(job_min_edu in e for e in cand_edu) or any(t in " ".join(cand_edu) for t in ["bachelor", "master", "phd", "computer science"]):
        edu_score = 92.0
    elif cand_edu:
        edu_score = 82.0
    else:
        edu_score = 70.0

    # 4. Requirements & General Criteria Match
    req_score = round((skills_score * 0.6 + exp_score * 0.4), 1)

    # 5. Overall Weighted Match Score
    overall_score = round(
        (skills_score * 0.40) +
        (exp_score * 0.30) +
        (edu_score * 0.15) +
        (req_score * 0.15),
        1
    )

    # Identify Strengths and Missing Requirements / Gaps
    matched_skills_list = [s.title() for s in raw_req_skills if normalize_skill(s) in matched_required]
    missing_skills = [s.title() for s in raw_req_skills if normalize_skill(s) not in cand_skills]

    strengths = []
    if matched_skills_list:
        strengths.append(f"Demonstrates relevant technical proficiency in core requirements: {', '.join(matched_skills_list[:4])}.")
    if cand_exp >= job_min_exp:
        strengths.append(f"Meets seniority benchmark with ~{cand_exp:g} years of industry experience.")
    if edu_score >= 85:
        strengths.append("Possesses solid academic foundation in computer science or technical discipline.")

    gaps = []
    if missing_skills:
        gaps.append(f"Does not demonstrate explicit experience with required skill(s): {', '.join(missing_skills[:3])}.")
    if cand_exp < job_min_exp:
        gaps.append(f"Under target experience threshold (~{cand_exp:g} yrs vs {job_min_exp:g} yrs required).")

    # Generate Natural Language Synthesis
    matched_str = ', '.join(matched_skills_list[:3]) if matched_skills_list else "core engineering fundamentals"
    missing_str = ', '.join(missing_skills[:2]) if missing_skills else "none"

    if overall_score >= 85:
        summary_explanation = (
            f"Exceptional candidate fit for the {job_data.get('title', 'vacancy')} role with an overall match score of {overall_score}%. "
            f"The candidate has demonstrated strong proficiency in {matched_str}. "
            f"{'Growth areas include: ' + missing_str + '.' if missing_skills else 'Candidate fulfills all primary technical criteria.'}"
        )
    elif overall_score >= 70:
        summary_explanation = (
            f"Solid alignment with {overall_score}% overall compatibility. "
            f"Possesses hands-on background in {matched_str}, but lacks critical required exposure to {missing_str}."
        )
    else:
        summary_explanation = (
            f"Low alignment ({overall_score}% match). Candidate profile diverges significantly from required technical skills ({missing_str}) or experience level."
        )

    return {
        "overall_match": overall_score,
        "skills_match": skills_score,
        "experience_match": exp_score,
        "education_match": edu_score,
        "requirements_match": req_score,
        "summary_explanation": summary_explanation,
        "strengths": strengths,
        "gaps": gaps,
        "matched_skills": matched_skills_list,
        "missing_skills": missing_skills
    }
