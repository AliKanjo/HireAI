# Phase 1 — Software Requirements Specification (SRS)
## HireAI: AI-Powered Recruitment and CV Analysis Platform

---

## 1. Functional Requirements Matrix

### A. Authentication & User Management
| ID | Requirement Statement | Priority | Status |
| :--- | :--- | :--- | :--- |
| **FR-01** | The system shall allow users to register an account. | Must Have | ✅ Supported |
| **FR-02** | The system shall allow users to log in and log out. | Must Have | ✅ Supported |
| **FR-03** | The system shall support Candidate, Recruiter, and Administrator roles. | Must Have | ✅ Supported |
| **FR-04** | The system shall provide role-based access to system features. | Must Have | ✅ Supported |
| **FR-05** | Users shall be able to update their profile information. | Must Have | ✅ Supported |
| **FR-06** | Users shall be able to reset their password. | Should Have | ✅ Supported |

### B. Candidate Management
| ID | Requirement Statement | Priority | Status |
| :--- | :--- | :--- | :--- |
| **FR-07** | Candidates shall be able to create and edit their professional profile. | Must Have | ✅ Supported |
| **FR-08** | Candidates shall be able to add education information. | Must Have | ✅ Supported |
| **FR-09** | Candidates shall be able to add work experience. | Must Have | ✅ Supported |
| **FR-10** | Candidates shall be able to add skills and certifications. | Must Have | ✅ Supported |
| **FR-11** | Candidates shall be able to upload a CV. | Must Have | ✅ Supported |
| **FR-12** | Candidates shall be able to replace or delete their CV. | Must Have | ✅ Supported |

### C. Job Management
| ID | Requirement Statement | Priority | Status |
| :--- | :--- | :--- | :--- |
| **FR-13** | Recruiters shall be able to create job postings. | Must Have | ✅ Supported |
| **FR-14** | Recruiters shall be able to edit job postings. | Must Have | ✅ Supported |
| **FR-15** | Recruiters shall be able to close or delete job postings. | Must Have | ✅ Supported |
| **FR-16** | Recruiters shall be able to specify job requirements. | Must Have | ✅ Supported |
| **FR-17** | Job requirements shall include required skills, experience, and education. | Must Have | ✅ Supported |
| **FR-18** | Candidates shall be able to browse available jobs. | Must Have | ✅ Supported |
| **FR-19** | Candidates shall be able to search and filter jobs. | Must Have | ✅ Supported |
| **FR-20** | Candidates shall be able to view complete job details. | Must Have | ✅ Supported |

### D. Applications
| ID | Requirement Statement | Priority | Status |
| :--- | :--- | :--- | :--- |
| **FR-21** | Candidates shall be able to apply for jobs. | Must Have | ✅ Supported |
| **FR-22** | Candidates shall be able to select/upload a CV when applying. | Must Have | ✅ Supported |
| **FR-23** | Candidates shall be able to view their applications. | Must Have | ✅ Supported |
| **FR-24** | Candidates shall be able to track application status (`Applied → Under Review → Shortlisted → Interview → Selected/Rejected`). | Must Have | ✅ Supported |
| **FR-25** | Candidates shall be able to withdraw an application. | Should Have | ✅ Supported |
| **FR-26** | Recruiters shall be able to view applications for their jobs. | Must Have | ✅ Supported |
| **FR-27** | Recruiters shall be able to update application status. | Must Have | ✅ Supported |

---

## 2. AI Requirements 🤖

### CV Extraction & Scoring
| ID | Requirement Statement | Priority | Status |
| :--- | :--- | :--- | :--- |
| **AI-01** | The system shall extract text and relevant information from uploaded CVs. | Must Have | ✅ Supported |
| **AI-02** | The system shall identify candidate skills from CV content. | Must Have | ✅ Supported |
| **AI-03** | The system shall identify education and work experience. | Must Have | ✅ Supported |
| **AI-04** | The system shall compare CV information with job requirements. | Must Have | ✅ Supported |
| **AI-05** | The system shall generate an overall candidate-job match score. | Must Have | ✅ Supported |
| **AI-06** | The system shall provide an explanation for the generated score. | Must Have | ✅ Supported |
| **AI-07** | The system shall identify matching and missing skills. | Must Have | ✅ Supported |
| **AI-08** | The system shall rank candidates based on their compatibility with a job. | Must Have | ✅ Supported |

### AI Interview Assistant & Recruitment Chatbot
| ID | Requirement Statement | Priority | Status |
| :--- | :--- | :--- | :--- |
| **AI-09** | Recruiters shall be able to request AI-generated interview questions. | Should Have | ✅ Supported |
| **AI-10** | Interview questions shall consider the job requirements. | Should Have | ✅ Supported |
| **AI-11** | Interview questions shall consider relevant candidate information. | Should Have | ✅ Supported |
| **AI-12** | Recruiters shall be able to save interview feedback. | Should Have | ✅ Supported |
| **AI-13** | Recruiters shall be able to interact with an AI recruitment assistant. | Should Have | ✅ Supported |
| **AI-14** | The assistant shall answer questions about recruitment data available to the recruiter. | Should Have | ✅ Supported |
| **AI-15** | The assistant shall provide candidate-related insights based on available data. | Should Have | ✅ Supported |

---

## 3. Interview Management & Notifications
| ID | Requirement Statement | Priority | Status |
| :--- | :--- | :--- | :--- |
| **FR-28** | Recruiters shall be able to schedule interviews. | Must Have | ✅ Supported |
| **FR-29** | Recruiters shall be able to specify interview date and time. | Must Have | ✅ Supported |
| **FR-30** | Candidates shall be able to view scheduled interviews. | Must Have | ✅ Supported |
| **FR-31** | Recruiters shall be able to record interview feedback. | Must Have | ✅ Supported |
| **FR-32** | Recruiters shall be able to update interview status. | Must Have | ✅ Supported |
| **FR-33** | The system shall notify candidates when their application status changes. | Should Have | ✅ Supported |
| **FR-34** | The system shall notify candidates about scheduled interviews. | Should Have | ✅ Supported |
| **FR-35** | The system shall notify recruiters about new applications. | Should Have | ✅ Supported |
| **FR-36** | Users shall be able to view their notifications. | Should Have | ✅ Supported |

---

## 4. Analytics & Administration
| ID | Requirement Statement | Priority | Status |
| :--- | :--- | :--- | :--- |
| **FR-37** | The system shall display the number of active job postings. | Must Have | ✅ Supported |
| **FR-38** | The system shall display the number of applications. | Must Have | ✅ Supported |
| **FR-39** | The system shall display shortlisted candidates. | Must Have | ✅ Supported |
| **FR-40** | The system shall display interview statistics. | Must Have | ✅ Supported |
| **FR-41** | The system shall display hiring statistics. | Must Have | ✅ Supported |
| **FR-42** | The system shall display candidate match-score statistics. | Must Have | ✅ Supported |
| **FR-43** | Administrators shall be able to view registered users. | Must Have | ✅ Supported |
| **FR-44** | Administrators shall be able to manage candidate accounts. | Must Have | ✅ Supported |
| **FR-45** | Administrators shall be able to manage recruiter accounts. | Must Have | ✅ Supported |
| **FR-46** | Administrators shall be able to manage companies. | Must Have | ✅ Supported |
| **FR-47** | Administrators shall be able to monitor job postings. | Must Have | ✅ Supported |
| **FR-48** | Administrators shall be able to deactivate inappropriate accounts or content. | Must Have | ✅ Supported |

---

## 5. Non-Functional Requirements (NFR)
- **NFR-01 to NFR-03 (Performance)**: Sub-second search indexing, real-time CV text extraction and scoring (<1.5s).
- **NFR-04 to NFR-08 (Security)**: Bcrypt hashing, Sanctum token authentication, protected CV file storage.
- **NFR-09 to NFR-11 (Usability)**: Responsive desktop/tablet/mobile layouts, high-contrast dark/glassmorphic UI, transparent AI scoring rationale.
- **NFR-12 to NFR-14 (Reliability)**: Duplicate prevention, graceful PDF parsing fallbacks.
- **NFR-15 to NFR-17 (Maintainability)**: Modular microservice decoupling (React Frontend + Laravel Backend + Python FastAPI AI Engine).
