// Client-side & Live AI Engine Client

const COMMON_SKILLS = [
  "python", "javascript", "typescript", "react", "react.js", "vue", "angular", "node.js", "nodejs",
  "express", "fastapi", "flask", "django", "java", "spring boot", "c#", ".net", "php", "laravel",
  "sql", "mysql", "postgresql", "mongodb", "redis", "docker", "kubernetes", "aws", "azure", "gcp",
  "git", "ci/cd", "rest api", "graphql", "html", "css", "tailwind css", "figma", "agile", "scrum",
  "linux", "microservices", "unit testing", "machine learning", "pytorch", "tensorflow", "pandas"
];

export function parseCVText(rawText) {
  const lowered = rawText.toLowerCase();
  
  // Extract email
  const emailMatch = rawText.match(/[\w.-]+@[\w.-]+\.\w+/);
  const email = emailMatch ? emailMatch[0] : "";

  // Extract phone
  const phoneMatch = rawText.match(/(\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/);
  const phone = phoneMatch ? phoneMatch[0] : "";

  // Extract name
  const lines = rawText.split('\n').map(l => l.trim()).filter(Boolean);
  let name = lines[0] || "Candidate";
  if (name.length > 50 || name.includes("@") || name.toLowerCase().includes("resume")) {
    name = "Candidate Applicant";
  }

  // Extract skills
  const extractedSkills = [];
  COMMON_SKILLS.forEach(skill => {
    const regex = new RegExp(`\\b${skill.replace('.', '\\.')}\\b`, 'i');
    if (regex.test(lowered)) {
      let formatted = skill.charAt(0).toUpperCase() + skill.slice(1);
      if (["aws", "gcp", "sql", "html", "css", "ci/cd", "rest api", "php"].includes(skill)) {
        formatted = skill.toUpperCase();
      } else if (["node.js", "nodejs", "react.js", "fastapi", "spring boot"].includes(skill)) {
        formatted = skill.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
      }
      extractedSkills.push(formatted);
    }
  });

  // Extract Experience
  const expMatch = lowered.match(/(\d+(?:\.\d+)?)\+?\s*(?:years|yrs)\s+(?:of\s+)?experience/i);
  const yearsExp = expMatch ? parseFloat(expMatch[1]) : 3.0;

  // Extract Education
  let education = "Technical Degree / Relevant Certification";
  if (lowered.includes("master") || lowered.includes("m.s")) {
    education = "Master's in Computer Science / Engineering";
  } else if (lowered.includes("bachelor") || lowered.includes("b.s") || lowered.includes("b.sc")) {
    education = "Bachelor's in Computer Science / Engineering";
  } else if (lowered.includes("bootcamp")) {
    education = "Full-Stack Software Bootcamp Certificate";
  }

  return {
    name,
    email,
    phone,
    yearsOfExperience: yearsExp,
    skills: Array.from(new Set(extractedSkills)),
    education,
    rawText
  };
}

export function computeAIMatch(candidateParsed, job) {
  const candSkills = new Set((candidateParsed.skills || []).map(s => s.toLowerCase()));
  const required = (job.requiredSkills || []).map(s => s.toLowerCase());
  const preferred = (job.preferredSkills || []).map(s => s.toLowerCase());

  // 1. Skills Match
  let matchedReq = 0;
  required.forEach(s => {
    if (candSkills.has(s)) matchedReq++;
  });
  const reqRatio = required.length > 0 ? (matchedReq / required.length) : 1;

  let matchedPref = 0;
  preferred.forEach(s => {
    if (candSkills.has(s)) matchedPref++;
  });
  const prefRatio = preferred.length > 0 ? (matchedPref / preferred.length) : 1;

  const skillsScore = Math.min(100, Math.max(25, Math.round((reqRatio * 75 + prefRatio * 25))));

  // 2. Experience Match
  const candExp = candidateParsed.yearsOfExperience || 2.0;
  const minExp = job.minYearsExp || 3.0;
  let expScore = 80;
  if (candExp >= minExp) {
    expScore = Math.min(100, Math.round(88 + (candExp - minExp) * 3));
  } else {
    expScore = Math.max(35, Math.round(100 - (minExp - candExp) * 22));
  }

  // 3. Education Match
  let eduScore = 85;
  if (candidateParsed.education && (candidateParsed.education.includes("Master") || candidateParsed.education.includes("Bachelor"))) {
    eduScore = 92;
  }

  // 4. Requirements Match
  const requirementsScore = Math.round(skillsScore * 0.6 + expScore * 0.4);

  // 5. Overall Match Score
  const overallMatch = Math.round(
    skillsScore * 0.40 +
    expScore * 0.30 +
    eduScore * 0.15 +
    requirementsScore * 0.15
  );

  // Identify Strengths & Gaps
  const matchedList = (job.requiredSkills || []).filter(s => candSkills.has(s.toLowerCase()));
  const missingList = (job.requiredSkills || []).filter(s => !candSkills.has(s.toLowerCase()));

  const strengths = [];
  if (matchedList.length > 0) {
    strengths.push(`Direct demonstrated capability with core requirements: ${matchedList.join(', ')}.`);
  }
  if (candExp >= minExp) {
    strengths.push(`Meets or exceeds seniority requirement (~${candExp} yrs vs ${minExp} yrs benchmark).`);
  }
  if (eduScore >= 90) {
    strengths.push(`Strong academic or formal degree background in related field.`);
  }

  const gaps = [];
  if (missingList.length > 0) {
    gaps.push(`Missing explicit mention of required skill(s): ${missingList.join(', ')}.`);
  }
  if (candExp < minExp) {
    gaps.push(`Experience level (~${candExp} yrs) is under the target expectation (${minExp} yrs).`);
  }

  let summaryExplanation = "";
  if (overallMatch >= 85) {
    summaryExplanation = `Exceptional candidate profile for the ${job.title} vacancy. The applicant demonstrates high proficiency in ${matchedList.slice(0, 3).join(', ')} and matches the team's engineering criteria.`;
  } else if (overallMatch >= 70) {
    summaryExplanation = `Good potential match (${overallMatch}%). The candidate possesses solid foundation in ${matchedList.join(', ')}, though further assessment is suggested for ${missingList.join(', ') || 'seniority'}.`;
  } else {
    summaryExplanation = `Moderate to low alignment (${overallMatch}%). Significant divergence in required skills (${missingList.join(', ')}) or seniority level.`;
  }

  const generatedQuestions = generateTailoredQuestions(candidateParsed, job, missingList);

  return {
    overallMatch,
    skillsMatch: skillsScore,
    experienceMatch: expScore,
    educationMatch: eduScore,
    requirementsMatch: requirementsScore,
    summaryExplanation,
    strengths,
    gaps,
    matchedSkills: matchedList,
    missingSkills: missingList,
    generatedQuestions
  };
}

function generateTailoredQuestions(candidate, job, missingSkills) {
  const questions = [];
  const skills = candidate.skills || [];

  if (skills.some(s => /react/i.test(s))) {
    questions.push({
      category: "Technical (Frontend)",
      question: "You listed React in your stack. How do you approach state normalization, memoization (useMemo/useCallback), and avoiding redundant re-renders in heavy interactive views?",
      evalFocus: "Assesses frontend rendering mechanics and performance profiling."
    });
  }

  if (skills.some(s => /spring|java/i.test(s))) {
    questions.push({
      category: "Technical (Enterprise Backend)",
      question: "In Java/Spring Boot, how do you manage distributed transactions or message idempotency when processing high-volume asynchronous jobs?",
      evalFocus: "Checks microservices consistency, saga patterns, and JPA/Hibernate query tuning."
    });
  } else if (skills.some(s => /python|fastapi/i.test(s))) {
    questions.push({
      category: "Technical (Backend & AI)",
      question: "How do you handle asynchronous event loops and prevent blocking I/O when processing heavy file extractions in FastAPI?",
      evalFocus: "Evaluates async Python concurrency, background tasks, and thread pool executor knowledge."
    });
  }

  questions.push({
    category: "System Design",
    question: `How would you architect the database schema and caching strategy to support fast candidate ranking and full-text CV search for the ${job.title} role?`,
    evalFocus: "Tests relational schema indexing, search indexes, and caching layers."
  });

  if (missingSkills && missingSkills.length > 0) {
    questions.push({
      category: "Adaptability & Skill Gap",
      question: `Our vacancy uses ${missingSkills[0]}, which was not prominent in your CV. How do you rapidly get up to speed with new frameworks in a production environment?`,
      evalFocus: "Assesses fast onboarding capacity and engineering curiosity."
    });
  }

  return questions;
}
