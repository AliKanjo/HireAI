import os
import json
from typing import Dict, Any, List

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
    candidate_skills = set(s.lower() for s in cv_data.get("skills", []))
    required_skills = set(s.lower() for s in job_data.get("required_skills", []))
    preferred_skills = set(s.lower() for s in job_data.get("preferred_skills", []))
    
    # 1. Skills Match Calculation
    if required_skills:
        matched_required = candidate_skills.intersection(required_skills)
        req_ratio = len(matched_required) / len(required_skills)
    else:
        matched_required = candidate_skills
        req_ratio = 1.0

    if preferred_skills:
        matched_pref = candidate_skills.intersection(preferred_skills)
        pref_ratio = len(matched_pref) / len(preferred_skills)
    else:
        matched_pref = set()
        pref_ratio = 1.0

    skills_score = round((req_ratio * 0.75 + pref_ratio * 0.25) * 100, 1)
    skills_score = min(100.0, max(20.0, skills_score))

    # 2. Experience Match Calculation
    cand_exp = float(cv_data.get("estimated_years_experience", 2.0))
    job_min_exp = float(job_data.get("min_years_experience", 3.0))

    if cand_exp >= job_min_exp:
        exp_score = min(100.0, 90.0 + (cand_exp - job_min_exp) * 3)
    else:
        exp_score = max(35.0, 100.0 - (job_min_exp - cand_exp) * 20.0)
    exp_score = round(exp_score, 1)

    # 3. Education Match Calculation
    cand_edu = [e.lower() for e in cv_data.get("education", [])]
    job_min_edu = job_data.get("min_education", "bachelor").lower()

    if any(job_min_edu in e for e in cand_edu) or "computer science" in cand_edu:
        edu_score = 92.0
    elif cand_edu:
        edu_score = 80.0
    else:
        edu_score = 70.0

    # 4. Requirements & General Criteria Match
    req_score = round((skills_score * 0.6 + exp_score * 0.4), 1)

    # 5. Overall Weighted Match Score
    # Weights: Skills (40%), Experience (30%), Education (15%), Requirements (15%)
    overall_score = round(
        (skills_score * 0.40) +
        (exp_score * 0.30) +
        (edu_score * 0.15) +
        (req_score * 0.15),
        1
    )

    # Identify Strengths and Missing Requirements / Gaps
    matched_skills_list = [s.title() for s in matched_required.union(matched_pref)]
    missing_skills = [s.title() for s in required_skills.difference(candidate_skills)]
    
    strengths = []
    if matched_skills_list:
        strengths.append(f"Demonstrates relevant proficiency in {', '.join(matched_skills_list[:4])}.")
    if cand_exp >= job_min_exp:
        strengths.append(f"Meets seniority benchmark with ~{cand_exp:g} years of industry experience.")
    if edu_score >= 85:
        strengths.append("Possesses relevant academic foundation in computer science or technical discipline.")

    gaps = []
    if missing_skills:
        gaps.append(f"Does not demonstrate explicit experience with: {', '.join(missing_skills[:3])}.")
    if cand_exp < job_min_exp:
        gaps.append(f"Slightly below target experience threshold ({cand_exp:g} yrs vs {job_min_exp:g} yrs required).")

    # Generate Natural Language Synthesis
    matched_str = ', '.join(matched_skills_list[:3]) if matched_skills_list else "core fundamentals"
    missing_str = ', '.join(missing_skills[:2]) if missing_skills else "none"

    if overall_score >= 80:
        summary_explanation = (
            f"Strong fit for the role with an overall match of {overall_score}%. "
            f"The candidate has demonstrated hands-on background with {matched_str}. "
            f"{'Identified growth areas include: ' + missing_str + '.' if missing_skills else 'Candidate fulfills all primary technical criteria.'}"
        )
    elif overall_score >= 60:
        summary_explanation = (
            f"Moderate alignment with {overall_score}% overall compatibility. "
            f"Possesses solid experience in {matched_str}, but lacks critical required exposure to {missing_str}."
        )
    else:
        summary_explanation = (
            f"Low alignment ({overall_score}% match). The candidate profile does not sufficiently match the primary requirements for this role."
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
