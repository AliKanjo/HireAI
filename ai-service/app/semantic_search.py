import re
from typing import Dict, Any, List

try:
    from .cv_parser import SKILL_CATALOG, ALL_SKILLS, format_skill_name
    from .matcher import normalize_skill
except ImportError:
    from cv_parser import SKILL_CATALOG, ALL_SKILLS, format_skill_name
    from matcher import normalize_skill

def parse_natural_search_query(query: str) -> Dict[str, Any]:
    """
    Parses natural language recruiter queries like:
    'Find Java backend developers with at least 2 years of experience'
    Returns extracted target skills, experience threshold, and domain focus.
    """
    lowered = query.lower()
    
    # 1. Extract experience threshold (e.g. 2+ years, at least 3 yrs, 5 years)
    exp_match = re.search(r'(?:at least|min|more than|>|=|>=)?\s*(\d+(?:\.\d+)?)\+?\s*(?:years|yrs)', lowered)
    min_exp = float(exp_match.group(1)) if exp_match else 0.0

    # 2. Extract requested skills from query
    target_skills = []
    for skill in ALL_SKILLS:
        pattern = r'(?<!\w)' + re.escape(skill) + r'(?!\w)'
        if re.search(pattern, lowered):
            formatted = format_skill_name(skill)
            if formatted not in target_skills:
                target_skills.append(formatted)

    # 3. Detect Domain Focus (backend, frontend, full-stack, devops, data, mobile)
    domain = "General Software Engineering"
    if "backend" in lowered or "server" in lowered:
        domain = "Backend Engineering"
    elif "frontend" in lowered or "ui" in lowered or "client" in lowered:
        domain = "Frontend Engineering"
    elif "full" in lowered and "stack" in lowered:
        domain = "Full-Stack Engineering"
    elif "devops" in lowered or "cloud" in lowered or "infrastructure" in lowered:
        domain = "DevOps & Cloud"
    elif "ai" in lowered or "machine learning" in lowered or "data" in lowered:
        domain = "AI & Data Science"

    return {
        "raw_query": query,
        "target_skills": target_skills,
        "min_years_experience": min_exp,
        "domain": domain
    }

def perform_semantic_cv_search(query: str, candidates: List[Dict[str, Any]]) -> Dict[str, Any]:
    """
    Executes semantic natural language search over candidate CV pool, computing relevance scores (0-100%).
    """
    intent = parse_natural_search_query(query)
    target_skills_norm = set(normalize_skill(s) for s in intent["target_skills"])
    req_exp = intent["min_years_experience"]
    
    results = []
    
    for cand in candidates:
        cand_skills_raw = cand.get("cvSkills") or cand.get("skills") or []
        cand_skills_norm = set(normalize_skill(s) for s in cand_skills_raw)
        cand_exp = float(cand.get("cvExperienceYears") or cand.get("yearsOfExperience") or cand.get("estimated_years_experience", 2.0))
        cand_name = cand.get("candidateName") or cand.get("name", "Applicant")
        
        # Calculate Skill Relevance Score
        if target_skills_norm:
            matched_skills_norm = target_skills_norm.intersection(cand_skills_norm)
            skill_score = (len(matched_skills_norm) / len(target_skills_norm)) * 100.0
        else:
            full_text = f"{cand_name} {cand.get('headline', '')} {' '.join(cand_skills_raw)}".lower()
            query_words = [w for w in query.lower().split() if len(w) > 2 and w not in ["find", "with", "than", "more", "years", "experience", "developer", "developers", "engineer"]]
            if query_words:
                matches = sum(1 for w in query_words if w in full_text)
                skill_score = (matches / len(query_words)) * 100.0
            else:
                skill_score = 80.0

        # Calculate Experience Relevance Score
        if req_exp > 0:
            if cand_exp >= req_exp:
                exp_score = min(100.0, 90.0 + (cand_exp - req_exp) * 3.0)
            else:
                exp_score = max(20.0, 100.0 - (req_exp - cand_exp) * 30.0)
        else:
            exp_score = 90.0

        relevance_score = round(skill_score * 0.70 + exp_score * 0.30, 1)
        relevance_score = min(99.0, max(25.0, relevance_score))

        matched_skills_formatted = [s.title() for s in cand_skills_raw if normalize_skill(s) in target_skills_norm]
        
        if matched_skills_formatted and cand_exp >= req_exp:
            match_reason = f"High relevance: verified background in {', '.join(matched_skills_formatted[:3])} with ~{cand_exp:g} yrs experience."
        elif matched_skills_formatted:
            match_reason = f"Skill match: proficient in {', '.join(matched_skills_formatted[:3])} (~{cand_exp:g} yrs exp)."
        elif cand_exp >= req_exp and req_exp > 0:
            match_reason = f"Experience match: meets ~{cand_exp:g} yrs threshold for target domain."
        else:
            match_reason = f"Partial relevance: general alignment with candidate skills."

        cand_record = dict(cand)
        cand_record["relevanceScore"] = relevance_score
        cand_record["searchMatchReason"] = match_reason
        cand_record["matchedQuerySkills"] = matched_skills_formatted

        results.append(cand_record)

    sorted_results = sorted(results, key=lambda r: r["relevanceScore"], reverse=True)

    return {
        "query": query,
        "extracted_intent": intent,
        "results": sorted_results
    }
