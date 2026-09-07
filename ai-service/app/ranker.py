from typing import Dict, Any, List

try:
    from .matcher import compute_cv_job_match
except ImportError:
    from matcher import compute_cv_job_match

def rank_job_candidates(candidates: List[Dict[str, Any]], job_data: Dict[str, Any]) -> List[Dict[str, Any]]:
    """
    Ranks all applicants for a given job vacancy based on multidimensional AI match scores.
    Assigns numerical ranks (1, 2, 3...), badges (🥇, 🥈, 🥉), and natural language rank reasons
    explaining why a candidate ranked higher than others.
    """
    evaluated = []
    
    for candidate in candidates:
        cv_data = candidate.get("cv_data") or {
            "name": candidate.get("candidateName") or candidate.get("name", "Applicant"),
            "skills": candidate.get("cvSkills") or candidate.get("skills", []),
            "estimated_years_experience": candidate.get("cvExperienceYears") or candidate.get("yearsOfExperience", 3.0),
            "education": [candidate.get("cvEducation")] if isinstance(candidate.get("cvEducation"), str) else candidate.get("cvEducation", [])
        }
        
        match_result = candidate.get("aiAnalysis") or compute_cv_job_match(cv_data, job_data)
        
        overall = match_result.get("overallMatch") or match_result.get("overall_match", 70.0)
        skills_m = match_result.get("skillsMatch") or match_result.get("skills_match", 70.0)
        exp_m = match_result.get("experienceMatch") or match_result.get("experience_match", 70.0)
        
        evaluated.append({
            "original_record": candidate,
            "candidate_id": candidate.get("id") or candidate.get("candidateId"),
            "candidate_name": candidate.get("candidateName") or cv_data.get("name", "Applicant"),
            "headline": candidate.get("headline", ""),
            "overall_match": overall,
            "skills_match": skills_m,
            "experience_match": exp_m,
            "education_match": match_result.get("educationMatch") or match_result.get("education_match", 70.0),
            "match_analysis": match_result
        })

    sorted_candidates = sorted(
        evaluated,
        key=lambda c: (c["overall_match"], c["skills_match"], c["experience_match"]),
        reverse=True
    )

    ranked_list = []
    total = len(sorted_candidates)
    
    for idx, cand in enumerate(sorted_candidates):
        rank = idx + 1
        
        if rank == 1:
            badge = "Rank #1"
        elif rank == 2:
            badge = "Rank #2"
        elif rank == 3:
            badge = "Rank #3"
        else:
            badge = f"Rank #{rank}"

        if rank < total:
            diff = round(cand["overall_match"] - sorted_candidates[idx + 1]["overall_match"], 1)
            next_name = sorted_candidates[idx + 1]["candidate_name"]
            
            if diff > 0:
                rank_reason = (
                    f"Ranked #{rank} ahead of {next_name} (+{diff}% match advantage). "
                    f"Outperforms with {cand['skills_match']}% skill alignment and {cand['experience_match']}% experience score."
                )
            else:
                rank_reason = (
                    f"Ranked #{rank} tied on match score ({cand['overall_match']}%). "
                    f"Leads on technical skill coverage and requirements fit."
                )
        else:
            rank_reason = (
                f"Ranked #{rank} among applicant pool with {cand['overall_match']}% overall compatibility."
            )

        cand_record = dict(cand["original_record"])
        cand_record["rank"] = rank
        cand_record["badge"] = badge
        cand_record["rankReason"] = rank_reason
        cand_record["aiAnalysis"] = cand["match_analysis"]

        ranked_list.append(cand_record)

    return ranked_list
