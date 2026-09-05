export const INITIAL_COMPANIES = [
  {
    id: 1,
    name: "TechNova Dynamics",
    logo: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=120&auto=format&fit=crop&q=80",
    industry: "Enterprise AI & Cloud",
    location: "San Francisco, CA / Remote",
    website: "https://technovadynamics.io",
    size: "250-500 employees"
  },
  {
    id: 2,
    name: "FinPulse Global",
    logo: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=120&auto=format&fit=crop&q=80",
    industry: "Fintech & Payments",
    location: "New York, NY / Hybrid",
    website: "https://finpulse.global",
    size: "500-1000 employees"
  }
];

export const INITIAL_JOBS = [
  {
    id: 1,
    companyId: 1,
    companyName: "TechNova Dynamics",
    companyLogo: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=120&auto=format&fit=crop&q=80",
    title: "Senior Full-Stack Engineer (React & Java/Spring)",
    department: "Core Engineering",
    location: "San Francisco, CA",
    workplaceType: "Hybrid",
    jobType: "Full-Time",
    experienceLevel: "Senior",
    minYearsExp: 4,
    minEducation: "Bachelor's Degree",
    salaryMin: 135000,
    salaryMax: 165000,
    currency: "USD",
    status: "active",
    postedDate: "2026-09-01",
    deadline: "2026-09-30",
    description: "We are seeking an experienced Senior Full-Stack Engineer to lead the architecture of our next-generation intelligent platform. You will build high-throughput microservices in Java/Spring Boot and craft reactive, glassmorphic interfaces in React.js.",
    requirements: "• 4+ years building production web applications.\n• Strong mastery of React.js, TypeScript, and state management.\n• Proficient in Java, Spring Boot, and RESTful API architecture.\n• Solid understanding of relational databases (MySQL / PostgreSQL).\n• Familiarity with Docker, CI/CD, and cloud environments (AWS/GCP).",
    requiredSkills: ["React", "Java", "Spring Boot", "MySQL", "REST API", "Git"],
    preferredSkills: ["AWS", "Docker", "TypeScript", "Tailwind CSS", "Microservices"],
    viewsCount: 420,
    applicationsCount: 24
  },
  {
    id: 2,
    companyId: 1,
    companyName: "TechNova Dynamics",
    companyLogo: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=120&auto=format&fit=crop&q=80",
    title: "AI & Python Backend Engineer",
    department: "AI & Data Solutions",
    location: "Remote",
    workplaceType: "Remote",
    jobType: "Full-Time",
    experienceLevel: "Mid",
    minYearsExp: 3,
    minEducation: "Bachelor's in Computer Science",
    salaryMin: 110000,
    salaryMax: 140000,
    currency: "USD",
    status: "active",
    postedDate: "2026-09-03",
    deadline: "2026-10-05",
    description: "Join our AI innovation pod to build high-performance microservices, document extraction engines, and LLM inference pipelines using FastAPI, Python, and vector databases.",
    requirements: "• 3+ years professional Python development.\n• Deep expertise in FastAPI or Django REST Framework.\n• Experience with LLM integrations, embeddings, and prompt engineering.\n• Strong SQL skills (PostgreSQL/MySQL) and Redis caching.",
    requiredSkills: ["Python", "FastAPI", "SQL", "Docker", "Git"],
    preferredSkills: ["PyTorch", "OpenAI API", "LangChain", "Redis", "Kubernetes"],
    viewsCount: 310,
    applicationsCount: 18
  },
  {
    id: 3,
    companyId: 2,
    companyName: "FinPulse Global",
    companyLogo: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=120&auto=format&fit=crop&q=80",
    title: "Senior Frontend Developer (React & UI/UX)",
    department: "Digital Product",
    location: "New York, NY",
    workplaceType: "Hybrid",
    jobType: "Full-Time",
    experienceLevel: "Senior",
    minYearsExp: 4,
    minEducation: "Bachelor's Degree",
    salaryMin: 125000,
    salaryMax: 155000,
    currency: "USD",
    status: "active",
    postedDate: "2026-08-28",
    deadline: "2026-09-25",
    description: "Looking for a creative and performance-oriented Frontend Engineer to shape the user experience of millions of fintech users. High emphasis on animations, responsive design, and component library design.",
    requirements: "• 4+ years of React experience.\n• Expert in Modern CSS / Tailwind, animations, and responsive layout.\n• Excellent grasp of Web Vitals, accessibility (a11y), and state management.",
    requiredSkills: ["React", "JavaScript", "TypeScript", "Tailwind CSS", "HTML", "CSS"],
    preferredSkills: ["Figma", "Next.js", "GraphQL", "Jest", "CI/CD"],
    viewsCount: 540,
    applicationsCount: 31
  }
];

export const INITIAL_APPLICATIONS = [
  {
    id: 101,
    jobId: 1,
    candidateId: 1,
    candidateName: "Sarah Chen",
    candidateEmail: "sarah.chen@devmail.io",
    candidatePhone: "+1 (415) 892-4411",
    candidateAvatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80",
    headline: "Senior Full-Stack Architect | 5+ Yrs Java & React",
    location: "San Francisco, CA",
    appliedDate: "2026-09-04",
    status: "Shortlisted",
    cvFileName: "Sarah_Chen_Senior_FullStack_CV.pdf",
    cvSkills: ["React", "Java", "Spring Boot", "MySQL", "REST API", "Git", "Docker", "TypeScript", "Tailwind CSS"],
    cvExperienceYears: 5.5,
    cvEducation: "B.S. in Computer Science, UC Berkeley",
    aiAnalysis: {
      overallMatch: 94.0,
      skillsMatch: 96.0,
      experienceMatch: 95.0,
      educationMatch: 92.0,
      requirementsMatch: 93.0,
      summaryExplanation: "Outstanding match for the Senior Full-Stack role. Sarah exceeds the 4-year experience requirement with 5.5 years in enterprise software, showcasing high proficiency in Java, Spring Boot, React, and MySQL. Fully aligned with technical demands.",
      strengths: [
        "Proven 5.5+ years building distributed Java/Spring Boot microservices.",
        "Advanced React & modern TypeScript front-end architecture mastery.",
        "Exceeds minimum education and seniority benchmarks with B.S. CS from UC Berkeley."
      ],
      gaps: [
        "Limited explicit mention of AWS infrastructure (primarily Docker/on-prem container experience)."
      ],
      generatedQuestions: [
        {
          category: "Technical (Full-Stack Architecture)",
          question: "You have extensive experience with Spring Boot and React. How do you design transaction boundaries and handle asynchronous state synchronization between the REST API and the client UI?",
          evalFocus: "Assesses distributed transactions, idempotency keys, and React query/cache invalidation strategies."
        },
        {
          category: "Performance & Scaling",
          question: "In your previous role at enterprise scale, what indexing and connection pooling optimizations did you apply to MySQL under high concurrent traffic?",
          evalFocus: "Checks query profiling, EXPLAIN plan execution, HikariCP pool tuning, and dead-lock prevention."
        },
        {
          category: "Behavioral & Leadership",
          question: "Describe a scenario where you had to push back on a product feature deadline to refactor critical technical debt in the backend. How did you align with stakeholders?",
          evalFocus: "Evaluates executive communication, risk management, and software craftsmanship."
        }
      ]
    },
    interview: {
      scheduledAt: "2026-09-08 14:00",
      duration: "45 min",
      meetingLink: "https://meet.google.com/hyr-ai-demo",
      interviewer: "David Miller (Lead Architect)"
    }
  },
  {
    id: 102,
    jobId: 1,
    candidateId: 2,
    candidateName: "Alexandre Moreau",
    candidateEmail: "alex.moreau@codelab.org",
    candidatePhone: "+1 (415) 309-1122",
    candidateAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&auto=format&fit=crop&q=80",
    headline: "Full-Stack Developer (Java, Spring, React, AWS)",
    location: "Oakland, CA",
    appliedDate: "2026-09-03",
    status: "Under Review",
    cvFileName: "Alex_Moreau_Resume_2026.pdf",
    cvSkills: ["Java", "Spring Boot", "React", "MySQL", "AWS", "Git", "REST API"],
    cvExperienceYears: 4.0,
    cvEducation: "B.Sc. Software Engineering",
    aiAnalysis: {
      overallMatch: 89.0,
      skillsMatch: 92.0,
      experienceMatch: 88.0,
      educationMatch: 90.0,
      requirementsMatch: 86.0,
      summaryExplanation: "Strong match (89%). Alexandre possesses solid production experience across the required core stack (Java, Spring Boot, React, MySQL) and brings valuable AWS cloud exposure.",
      strengths: [
        "Hands-on expertise across all 4 mandatory tech stack items.",
        "Demonstrated AWS cloud deployment and lambda/S3 integration.",
        "Meets the 4-year experience threshold."
      ],
      gaps: [
        "Less emphasis on modern CSS component libraries or micro-frontend architectures."
      ],
      generatedQuestions: [
        {
          category: "Cloud & Backend",
          question: "You noted AWS experience alongside Spring Boot. How would you containerize and deploy this service on AWS ECS/EKS with zero-downtime rolling updates?",
          evalFocus: "Evaluates Dockerfile optimizations, health probes, and CI/CD pipelines."
        },
        {
          category: "Technical (Frontend)",
          question: "Explain how you handle component re-rendering bottlenecks in React when displaying tables with thousands of live rows.",
          evalFocus: "Assesses virtual DOM understanding, useMemo/useCallback, and windowing techniques."
        }
      ]
    }
  },
  {
    id: 103,
    jobId: 1,
    candidateId: 3,
    candidateName: "Elena Rostova",
    candidateEmail: "elena.rostova@techmail.com",
    candidatePhone: "+1 (650) 412-8890",
    candidateAvatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=120&auto=format&fit=crop&q=80",
    headline: "Backend & Microservices Engineer (Java / Spring / Cloud)",
    location: "San Jose, CA",
    appliedDate: "2026-09-02",
    status: "Under Review",
    cvFileName: "Elena_Rostova_CV.pdf",
    cvSkills: ["Java", "Spring Boot", "MySQL", "PostgreSQL", "Docker", "Kubernetes", "Kafka"],
    cvExperienceYears: 4.5,
    cvEducation: "M.S. Computer Engineering",
    aiAnalysis: {
      overallMatch: 82.0,
      skillsMatch: 78.0,
      experienceMatch: 92.0,
      educationMatch: 95.0,
      requirementsMatch: 80.0,
      summaryExplanation: "The candidate demonstrates exceptional backend engineering strength in Java, Spring Boot, MySQL, and Kafka. However, she does not demonstrate the required React frontend proficiency.",
      strengths: [
        "Superior backend distributed systems and event-driven architecture skills (Kafka, Kubernetes).",
        "Holds Master's Degree in Computer Engineering.",
        "Strong relational database tuning (MySQL/PostgreSQL)."
      ],
      gaps: [
        "Missing React.js / Frontend UI skill (vacancy requires full-stack capability)."
      ],
      generatedQuestions: [
        {
          category: "Skill Gap Probing",
          question: "Your backend experience in Spring Boot and Kafka is exemplary, but this role requires building client interfaces in React. Have you built user interfaces in JavaScript frameworks or how quickly can you transition?",
          evalFocus: "Evaluates frontend adaptability and willingness to take on full-stack scope."
        }
      ]
    }
  },
  {
    id: 104,
    jobId: 1,
    candidateId: 4,
    candidateName: "Devon Marcus",
    candidateEmail: "devon.m@juniorcode.net",
    candidatePhone: "+1 (510) 901-3321",
    candidateAvatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120&auto=format&fit=crop&q=80",
    headline: "Junior Web Developer (React, JavaScript, Node.js)",
    location: "San Francisco, CA",
    appliedDate: "2026-09-01",
    status: "Applied",
    cvFileName: "Devon_Marcus_CV.pdf",
    cvSkills: ["React", "JavaScript", "HTML", "CSS", "Node.js", "Git"],
    cvExperienceYears: 1.5,
    cvEducation: "Coding Bootcamp Graduate",
    aiAnalysis: {
      overallMatch: 67.0,
      skillsMatch: 65.0,
      experienceMatch: 52.0,
      educationMatch: 70.0,
      requirementsMatch: 60.0,
      summaryExplanation: "Devon demonstrates good foundational knowledge in React and frontend basics, but is significantly below the Senior seniority threshold (1.5 yrs vs 4 yrs required) and lacks Java/Spring Boot backend experience.",
      strengths: [
        "Enthusiastic frontend learner with modern React component skills.",
        "Clean portfolio projects."
      ],
      gaps: [
        "Lacks required Java / Spring Boot enterprise backend experience.",
        "Below the 4-year senior experience minimum."
      ],
      generatedQuestions: [
        {
          category: "General Fundamentals",
          question: "Explain the difference between synchronous and asynchronous operations in JavaScript event loops.",
          evalFocus: "Checks fundamental JS runtime mechanics."
        }
      ]
    }
  },
  {
    id: 105,
    jobId: 2,
    candidateId: 5,
    candidateName: "Liam O'Connor",
    candidateEmail: "liam.oconnor@ai-eng.io",
    candidatePhone: "+1 (415) 762-9901",
    candidateAvatar: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=120&auto=format&fit=crop&q=80",
    headline: "AI Engineer & Python Backend Specialist",
    location: "Austin, TX (Remote)",
    appliedDate: "2026-09-04",
    status: "Shortlisted",
    cvFileName: "Liam_OConnor_AI_Engineer.pdf",
    cvSkills: ["Python", "FastAPI", "SQL", "Docker", "Git", "PyTorch", "Redis", "LangChain"],
    cvExperienceYears: 3.5,
    cvEducation: "B.S. in Computer Science",
    aiAnalysis: {
      overallMatch: 96.0,
      skillsMatch: 98.0,
      experienceMatch: 94.0,
      educationMatch: 95.0,
      requirementsMatch: 96.0,
      summaryExplanation: "Near perfect match for the AI & Python Backend Engineer position. Liam possesses extensive FastAPI and Python development background, paired with practical LLM inference and Redis caching experience.",
      strengths: [
        "100% alignment with all primary required skills (Python, FastAPI, SQL, Docker).",
        "Bonus capabilities in LangChain, PyTorch, and Redis.",
        "3.5 years of directly relevant AI/ML API development experience."
      ],
      gaps: [],
      generatedQuestions: [
        {
          category: "AI & FastAPI Architecture",
          question: "How do you architect asynchronous worker pools in FastAPI using Celery or Redis Queues to prevent long-running LLM inferences from blocking incoming HTTP requests?",
          evalFocus: "Tests async concurrency, worker queues, and event loops."
        },
        {
          category: "Data Integrity & Vector Search",
          question: "When chunking large unstructured CV documents for embedding generation, what strategy do you use to preserve semantic boundaries (e.g. sections vs paragraphs)?",
          evalFocus: "Evaluates RAG preprocessing, token optimization, and semantic search precision."
        }
      ]
    }
  }
];

export const SAMPLE_CV_TEMPLATES = [
  {
    name: "Sarah Chen - Senior Full-Stack (Java + React)",
    filename: "Sarah_Chen_Senior_FullStack_CV.pdf",
    text: `Sarah Chen
Email: sarah.chen@devmail.io | Phone: +1 (415) 892-4411 | San Francisco, CA
LinkedIn: linkedin.com/in/sarahchen-dev | GitHub: github.com/sarahchen

SUMMARY
Senior Full-Stack Engineer with 5+ years of experience designing, architecting, and scaling enterprise web applications. Highly proficient in Java, Spring Boot, React.js, TypeScript, and MySQL.

EXPERIENCE
Lead Full-Stack Developer | CloudMatrix Inc. (2022 - Present)
- Architected resilient microservices using Java 17 and Spring Boot, serving 2M+ daily active requests.
- Built interactive analytics dashboards using React, TypeScript, Tailwind CSS, and REST API endpoints.
- Optimized MySQL database schemas and indexing, reducing p99 API query latency by 45%.
- Implemented automated CI/CD pipelines using Docker and Git.

Full-Stack Software Engineer | NexaCorp (2019 - 2022)
- Developed responsive single-page applications with React and Redux.
- Built RESTful web APIs with Spring Boot and integrated with relational databases.

EDUCATION
Bachelor of Science in Computer Science
University of California, Berkeley (Graduated 2019)

SKILLS
React, JavaScript, TypeScript, Java, Spring Boot, MySQL, REST API, Docker, Git, Tailwind CSS, Microservices, HTML, CSS`
  },
  {
    name: "Marcus Vance - Python & AI Specialist",
    filename: "Marcus_Vance_AI_Engineer_CV.pdf",
    text: `Marcus Vance
Email: marcus.vance@airesearch.io | Austin, TX
GitHub: github.com/marcusvance-ai

SUMMARY
Passionate AI & Backend Engineer with 3.5 years of experience developing high-performance Python microservices, FastAPI REST APIs, and generative AI integrations.

EXPERIENCE
Python AI Engineer | NeuroFlow Systems (2023 - Present)
- Built FastAPI microservices processing 50,000+ document extractions per day.
- Integrated LLM APIs (Gemini, OpenAI) for automated text summarization and scoring.
- Managed PostgreSQL and Redis caching layers for high throughput.
- Containerized applications with Docker and deployed via CI/CD pipelines.

EDUCATION
Bachelor of Science in Computer Science, UT Austin

SKILLS
Python, FastAPI, SQL, PostgreSQL, Docker, Git, Redis, Machine Learning, PyTorch, REST API`
  },
  {
    name: "Jordan Lee - Junior Frontend Developer",
    filename: "Jordan_Lee_Junior_Dev_CV.pdf",
    text: `Jordan Lee
Email: jordan.lee@webdev.net | Seattle, WA

SUMMARY
Junior Frontend Developer with 1.5 years of experience creating responsive web pages with React, JavaScript, HTML, and CSS.

EXPERIENCE
Junior Frontend Developer | PixelCraft Studio (2024 - Present)
- Developed UI components using React, HTML5, CSS3, and Tailwind CSS.
- Maintained code repositories with Git.

EDUCATION
Full-Stack Web Development Bootcamp Certificate (2023)

SKILLS
React, JavaScript, HTML, CSS, Tailwind CSS, Git`
  }
];
