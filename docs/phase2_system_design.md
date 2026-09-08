# Phase 2 — System Design Document
## HireAI: AI-Powered Recruitment and CV Analysis Platform

---

## 1. System Architecture Diagram

```mermaid
graph TB
    subgraph Client Tier ["Client Tier (Web Application)"]
        CandidateUI["Candidate Portal<br/>- Job Search & Filtering<br/>- 1-Click Application<br/>- CV Upload<br/>- Pipeline Tracker"]
        RecruiterUI["Recruiter Portal<br/>- Vacancy Management<br/>- AI CV Analysis & Scoring<br/>- Candidate Ranking<br/>- AI Interview Generator<br/>- Recruitment Analytics"]
        AdminUI["Admin Portal<br/>- User & Role Control<br/>- Company Moderation<br/>- Audit Logs & Health"]
    end

    subgraph APITier ["Backend API & Orchestration Layer (Laravel 11 REST API)"]
        AuthMiddleware["Sanctum Auth / RBAC Middleware"]
        JobService["Job & Skill Management Service"]
        AppService["Application & Pipeline Service"]
        InterviewService["Interview & Feedback Service"]
        AISyncService["AI Orchestration Client"]
        NotificationEngine["Notification & Mail Engine"]
    end

    subgraph AIServiceTier ["AI Engine Tier (Python FastAPI Service)"]
        CVParser["CV Ingestion & PDF Parser<br/>(PyPDF / pdfplumber / Regex)"]
        MatchEngine["Semantic & Criteria Match Engine<br/>(Skills, Experience, Education, Weights)"]
        QuestionGen["Interview Question Generator<br/>(LLM Contextual Engine)"]
    end

    subgraph DataStorageTier ["Data & Persistence Tier"]
        MySQL[(MySQL 8.0 Relational DB)]
        FileStore["Secure Document Storage<br/>(CV PDFs, Resumes, Logos)"]
    end

    CandidateUI & RecruiterUI & AdminUI -->|HTTPS / JSON / Bearer Token| AuthMiddleware
    AuthMiddleware --> JobService & AppService & InterviewService & AISyncService & NotificationEngine
    JobService & AppService & InterviewService & NotificationEngine --> MySQL
    AppService --> FileStore
    AISyncService -->|Internal REST / JSON Payload| CVParser
    CVParser --> MatchEngine
    MatchEngine --> QuestionGen
    AISyncService -->|Store AI Results| MySQL
```

---

## 2. Use Case Diagrams

### 2.1 Overall System Use Case

```mermaid
graph LR
    Candidate((Candidate))
    Recruiter((Recruiter))
    Admin((Administrator))

    subgraph HireAISystem ["HireAI Platform"]
        UC1a[UC1a: Register & Login (Candidate / Recruiter Public Auth)]
        UC1b[UC1b: Provision Admin Account & Role Control (Admin Only)]
        UC2[Browse & Search Jobs]
        UC3[Upload CV & Apply]
        UC4[Track Application Pipeline]
        UC5[Create & Publish Job Vacancies]
        UC6[Define Required Skills & Experience]
        UC7[Review Candidate Applications]
        UC8[Trigger & View AI CV Match Analysis]
        UC9[Rank Applicants by Match Score]
        UC10[Generate AI Interview Questions]
        UC11[Schedule Interview & Record Feedback]
        UC12[View Analytics & Hiring Funnel]
        UC13[Manage Users, Roles & Companies]
        UC14[System Audit & Monitoring]
    end

    Candidate --> UC1a
    Candidate --> UC2
    Candidate --> UC3
    Candidate --> UC4

    Recruiter --> UC1a
    Recruiter --> UC5
    Recruiter --> UC6
    Recruiter --> UC7
    Recruiter --> UC8
    Recruiter --> UC9
    Recruiter --> UC10
    Recruiter --> UC11
    Recruiter --> UC12

    Admin --> UC1a
    Admin --> UC1b
    Admin --> UC13
    Admin --> UC14
```

---

## 3. Class Diagram

```mermaid
classDiagram
    class User {
        +int id
        +string name
        +string email
        +string password
        +string role
        +string avatar
        +datetime created_at
        +register()
        +login()
        +updateProfile()
    }

    class Company {
        +int id
        +string name
        +string logo
        +string website
        +string description
        +string industry
        +string location
    }

    class RecruiterProfile {
        +int id
        +int user_id
        +int company_id
        +string position
        +string phone
    }

    class CandidateProfile {
        +int id
        +int user_id
        +string headline
        +string phone
        +string location
        +string summary
        +string github_url
        +string linkedin_url
    }

    class Job {
        +int id
        +int recruiter_id
        +int company_id
        +string title
        +string department
        +string location
        +string job_type
        +string experience_level
        +decimal salary_min
        +decimal salary_max
        +text description
        +text requirements
        +string status
        +datetime deadline
        +publish()
        +close()
    }

    class JobSkill {
        +int id
        +int job_id
        +string skill_name
        +boolean is_required
        +int importance_weight
    }

    class Application {
        +int id
        +int job_id
        +int candidate_id
        +int cv_id
        +string status
        +text cover_letter
        +datetime created_at
        +updateStatus()
        +withdraw()
    }

    class CV {
        +int id
        +int candidate_id
        +string file_path
        +string file_name
        +int file_size
        +json parsed_json
        +parseDocument()
    }

    class CVSkill {
        +int id
        +int cv_id
        +string skill_name
        +int proficiency_years
    }

    class CVExperience {
        +int id
        +int cv_id
        +string company
        +string position
        +date start_date
        +date end_date
        +boolean is_current
        +text description
    }

    class CVEducation {
        +int id
        +int cv_id
        +string institution
        +string degree
        +string field_of_study
        +int graduation_year
    }

    class AIAnalysis {
        +int id
        +int application_id
        +float overall_match
        +float skills_match
        +float experience_match
        +float education_match
        +float requirements_match
        +text summary_explanation
        +json strengths_json
        +json gaps_json
        +json generated_questions_json
        +calculateMatch()
        +generateQuestions()
    }

    class Interview {
        +int id
        +int application_id
        +int recruiter_id
        +datetime scheduled_at
        +int duration_minutes
        +string meeting_link
        +string status
        +schedule()
        +cancel()
    }

    class InterviewFeedback {
        +int id
        +int interview_id
        +int rating
        +text notes
        +string recommendation
    }

    User <|-- RecruiterProfile
    User <|-- CandidateProfile
    Company "1" -- "*" RecruiterProfile : employs
    Company "1" -- "*" Job : offers
    RecruiterProfile "1" -- "*" Job : manages
    Job "1" -- "*" JobSkill : requires
    Job "1" -- "*" Application : receives
    CandidateProfile "1" -- "*" Application : submits
    CandidateProfile "1" -- "*" CV : owns
    CV "1" -- "*" CVSkill : contains
    CV "1" -- "*" CVExperience : contains
    CV "1" -- "*" CVEducation : contains
    Application "1" -- "1" CV : attaches
    Application "1" -- "1" AIAnalysis : analyzed_by
    Application "1" -- "*" Interview : schedules
    Interview "1" -- "0..1" InterviewFeedback : has
```

---

## 4. Entity-Relationship (ER) Diagram

```mermaid
erDiagram
    USERS ||--o| RECRUITER_PROFILES : "has profile"
    USERS ||--o| CANDIDATE_PROFILES : "has profile"
    COMPANIES ||--o{ RECRUITER_PROFILES : "employs"
    COMPANIES ||--o{ JOBS : "hosts"
    RECRUITER_PROFILES ||--o{ JOBS : "posts"
    JOBS ||--o{ JOB_SKILLS : "specifies"
    JOBS ||--o{ APPLICATIONS : "receives"
    CANDIDATE_PROFILES ||--o{ APPLICATIONS : "submits"
    CANDIDATE_PROFILES ||--o{ CVS : "uploads"
    CVS ||--o{ CV_SKILLS : "lists"
    CVS ||--o{ CV_EXPERIENCES : "contains"
    CVS ||--o{ CV_EDUCATION : "includes"
    APPLICATIONS ||--|| CVS : "references"
    APPLICATIONS ||--o| AI_ANALYSES : "generates"
    APPLICATIONS ||--o{ INTERVIEWS : "schedules"
    INTERVIEWS ||--o| INTERVIEW_FEEDBACK : "receives"
    USERS ||--o{ NOTIFICATIONS : "receives"

    USERS {
        bigint id PK
        string name
        string email UK
        string password
        enum role "candidate, recruiter, admin"
        string avatar
        datetime created_at
    }

    COMPANIES {
        bigint id PK
        string name
        string logo
        string website
        text description
        string industry
        string location
    }

    JOBS {
        bigint id PK
        bigint recruiter_id FK
        bigint company_id FK
        string title
        string department
        string location
        string job_type
        string experience_level
        decimal salary_min
        decimal salary_max
        text description
        text requirements
        enum status "draft, active, closed"
        datetime deadline
    }

    APPLICATIONS {
        bigint id PK
        bigint job_id FK
        bigint candidate_id FK
        bigint cv_id FK
        enum status "applied, under_review, shortlisted, interview, selected, rejected"
        text cover_letter
        datetime created_at
    }

    AI_ANALYSES {
        bigint id PK
        bigint application_id FK
        decimal overall_match
        decimal skills_match
        decimal experience_match
        decimal education_match
        decimal requirements_match
        text summary_explanation
        json strengths_json
        json gaps_json
        json generated_questions_json
        datetime created_at
    }

    INTERVIEWS {
        bigint id PK
        bigint application_id FK
        bigint recruiter_id FK
        datetime scheduled_at
        int duration_minutes
        string meeting_link
        enum status "scheduled, completed, cancelled"
    }
```

---

## 5. Sequence Diagrams

### 5.1 CV Upload & AI Candidate Matching Flow

```mermaid
sequenceDiagram
    autonumber
    actor Candidate
    participant React as React Frontend
    participant Backend as Laravel Backend API
    participant DB as MySQL Database
    participant AI as FastAPI AI Service

    Candidate->>React: Uploads CV.pdf & applies for Job #101
    React->>Backend: POST /api/applications (formData + CV file)
    Backend->>Backend: Validate file & Save CV to storage
    Backend->>DB: Insert record into `cvs` & `applications` (status: applied)
    Backend->>AI: POST /ai/analyze-cv (CV file path + Job Requirements JSON)
    activate AI
    AI->>AI: Extract Text (Personal Info, Skills, Exp, Education)
    AI->>AI: Compare Candidate profile vs. Job skills & experience weights
    AI->>AI: Calculate Match Scores & Generate Evaluation Summary
    AI-->>Backend: Return JSON { overall_match: 87, skills: 92, exp: 85, edu: 90, req: 82, explanation, strengths, gaps }
    deactivate AI
    Backend->>DB: Insert record into `ai_analyses` & parsed CV sub-entities
    Backend->>Backend: Check if overall_match >= threshold (e.g. 80%) -> update status to under_review
    Backend-->>React: 201 Created (Application ID, Analysis Preview)
    React-->>Candidate: Show Application Success & Status Badge
```

### 5.2 Recruiter Views Ranked Candidates & Generates AI Interview Questions

```mermaid
sequenceDiagram
    autonumber
    actor Recruiter
    participant React as Recruiter Dashboard
    participant Backend as Laravel Backend API
    participant DB as MySQL Database
    participant AI as FastAPI AI Service

    Recruiter->>React: Opens Job #101 Candidates Tab
    React->>Backend: GET /api/jobs/101/candidates?sortBy=match_score
    Backend->>DB: Query Applications joined with AIAnalyses & Profiles
    DB-->>Backend: Return sorted candidate list (94%, 89%, 82%, ...)
    Backend-->>React: JSON list of ranked candidates
    React-->>Recruiter: Displays Ranked Candidate Table

    Recruiter->>React: Clicks "Generate Interview Questions" for Candidate A
    React->>Backend: POST /api/applications/55/generate-questions
    Backend->>AI: POST /ai/generate-questions (Candidate Extracted CV + Job Criteria)
    activate AI
    AI->>AI: Synthesize targeted technical and behavioral questions
    AI-->>Backend: Return Array of Contextual Questions & Sample Answers
    deactivate AI
    Backend->>DB: Update `ai_analyses.generated_questions_json`
    Backend-->>React: Return Questions JSON
    React-->>Recruiter: Displays Interactive Interview Assistant Modal
```

---

## 6. Activity Diagrams

### 6.1 Application Submission & AI Processing Pipeline

```mermaid
flowchart TD
    Start([Candidate Starts Application]) --> SelectJob[Select Job & Review Requirements]
    SelectJob --> UploadCV[Upload CV PDF & Fill Profile Info]
    UploadCV --> Submit[Submit Application]
    Submit --> StoreFile[Backend Stores CV File]
    StoreFile --> CreateAppRecord[Create Application in DB (Status: Applied)]
    CreateAppRecord --> TriggerAI[Send CV to FastAPI AI Engine]
    
    subgraph AI Engine Processing
        TriggerAI --> ExtractText[Extract Raw Text & Structure Data]
        ExtractText --> ParseEntities[Parse Skills, Experience, Education, Projects]
        ParseEntities --> CompareSkills[Compare Candidate Skills with Job Required Skills]
        CompareSkills --> CompareExp[Analyze Work Experience & Seniority Level]
        CompareExp --> ComputeScores[Calculate Match % & Weighted Scores]
        ComputeScores --> GenSummary[Generate Natural Language Fit Explanation]
    end

    GenSummary --> SaveAnalysis[Store Results in `ai_analyses` Table]
    SaveAnalysis --> ScoreCheck{Overall Match >= 70%?}
    ScoreCheck -- Yes --> SetReview[Update Status to 'Under Review']
    ScoreCheck -- No --> KeepApplied[Keep Status as 'Applied']
    SetReview --> NotifyRecruiter[Notify Recruiter of New High-Match Candidate]
    KeepApplied --> End([Workflow Complete])
    NotifyRecruiter --> End
```

### 6.2 Recruiter Hiring Workflow

```mermaid
flowchart TD
    RStart([Recruiter Logs In]) --> ViewDash[View Recruitment Dashboard & Active Vacancies]
    ViewDash --> SelectJob[Select Active Job]
    SelectJob --> ViewRanked[View Candidates Ranked by AI Match %]
    ViewRanked --> InspectProfile[Inspect Candidate Profile, Strengths & Gaps]
    
    InspectProfile --> Decision1{Candidate Suitable?}
    Decision1 -- No --> RejectCandidate[Set Status to 'Rejected']
    Decision1 -- Yes --> Shortlist[Set Status to 'Shortlisted']
    
    Shortlist --> GenQuestions[Click 'Generate AI Interview Questions']
    GenQuestions --> ReviewQ[Review AI Tailored Technical & Behavioral Questions]
    ReviewQ --> ScheduleInt[Schedule Interview with Meeting Link]
    ScheduleInt --> ConductInt[Conduct Interview]
    ConductInt --> RecordFeedback[Record Score & Feedback Notes]
    
    RecordFeedback --> FinalDecision{Final Decision}
    FinalDecision -- Hire --> MakeOffer[Set Status to 'Selected' / Make Offer]
    FinalDecision -- Reject --> RejectFinal[Set Status to 'Rejected']
    
    MakeOffer --> REnd([Process Finished])
    RejectCandidate --> REnd
    RejectFinal --> REnd
```
