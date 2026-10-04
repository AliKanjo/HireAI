# HireAI — AI-Powered Recruitment & CV Analysis Platform

HireAI is an enterprise-grade, full-stack recruitment automation platform engineered to streamline the end-to-end talent acquisition lifecycle. By pairing modern AI-driven candidate parsing and multi-dimensional scoring with an intuitive candidate-recruiter portal, HireAI minimizes screening overhead, mitigates bias, and empowers hiring teams with actionable, transparent talent intelligence.

---

## Table of Contents

- [Overview](#overview)
- [Key Features](#key-features)
- [Architecture & Technology Stack](#architecture--technology-stack)
- [System Architecture Flow](#system-architecture-flow)
- [Repository Structure](#repository-structure)
- [Prerequisites](#prerequisites)
- [Step-by-Step Setup Guide](#step-by-step-setup-guide)
  - [1. Database Setup](#1-database-setup-mysql)
  - [2. AI Microservice (Python / FastAPI)](#2-ai-microservice-fastapi)
  - [3. Backend API (PHP / Laravel 11)](#3-backend-api-laravel-11)
  - [4. Frontend Application (React / Vite)](#4-frontend-application-react--vite)
- [Environment Configuration](#environment-configuration)
- [API Reference](#api-reference)
  - [AI Microservice Endpoints](#ai-microservice-endpoints)
  - [Backend REST API Endpoints](#backend-rest-api-endpoints)
- [Role-Based Access Control (RBAC)](#role-based-access-control-rbac)
- [Testing & Quality Assurance](#testing--quality-assurance)
- [Security & Compliance](#security--compliance)
- [Contributing](#contributing)
- [License](#license)

---

## Overview

Recruitment workflows often suffer from manual resume screening, opaque evaluation criteria, and fragmented scheduling. HireAI solves these challenges by combining:

- **Automated Resume Parsing**: Secure text and metadata extraction from PDF, DOCX, and TXT resumes.
- **Explainable Multi-Vector Matching**: Holistic matching algorithms that score candidates across Skills, Experience, Education, and specific Job Requirements with detailed rationales.
- **Dynamic AI Interview Assistant**: Tailored interview questions derived from candidate profiles and job requirements, complete with scoring rubrics and automated answer evaluation.
- **RAG-Powered Recruitment Chatbot**: Retrieval-Augmented Generation that lets hiring managers query their candidate pools and job requirements using natural language.
- **End-to-End Workflow Management**: Real-time status pipelines (`Applied` -> `Under Review` -> `Shortlisted` -> `Interview` -> `Selected` / `Rejected`), interview scheduling, and recruitment telemetry.

---

## Key Features

### For Recruiters & Hiring Managers
- **Job Lifecycle Management**: Create, publish, update, and archive job requisitions with structured criteria (required vs. preferred skills, minimum experience, education levels).
- **Candidate Ranking & Match Breakdown**: Instant compatibility scoring displaying Overall Match %, Skills Match %, Experience Match %, and Education Match %.
- **Candidate Comparison Matrix**: Side-by-side comparative analysis of top applicants against selected requisitions.
- **AI Interview Synthesizer**: One-click generation of technical, behavioral, and situational questions tailored to each candidate's specific background and resume gaps.
- **RAG Recruitment Assistant**: In-dashboard conversational AI to query candidate pools, identify skill distributions, and extract summaries.
- **Analytics & Hiring Funnels**: Interactive visual metrics for application throughput, interview conversion, and score distributions.

### For Candidates
- **Job Discovery & Filtering**: Search and filter active job listings by domain, experience level, and role requirements.
- **Instant CV Match Preview**: Pre-application compatibility preview allowing candidates to see how their profile matches job requisitions.
- **Application Tracking**: Transparent lifecycle tracker with status updates, scheduled interview notifications, and feedback visibility.
- **CV Profile Management**: Upload, update, and manage resume documents with instant preview.

### For Administrators
- **User Governance**: Audit and manage user accounts across Candidate, Recruiter, and Admin roles.
- **Platform Telemetry**: Monitor system activity, active listings, application throughput, and system health.
- **Access Enforcement**: Strict role-based controls and security policy governance.

---

## Architecture & Technology Stack

HireAI is architected as a modular, decoupled system separating business logic, AI computation, and presentation.

| Layer | Technology | Description |
| :--- | :--- | :--- |
| **Frontend** | React 18, Vite, Tailwind CSS | High-performance Single Page Application (SPA) with responsive design, glassmorphic UI elements, Recharts data visualization, and Lucide icons. |
| **Backend API** | Laravel 11, PHP 8.2+, Sanctum | RESTful API handling business rules, persistence, authentication, rate limiting, and role-based permissions. |
| **AI Microservice** | Python 3.10+, FastAPI, Uvicorn | Dedicated AI compute engine for document parsing (PyPDF), semantic matching, candidate ranking, and LLM integrations (Google Gemini). |
| **Database** | MySQL 8.0+ | Relational schema with strict foreign keys, indexing, and normalized structures for applications, candidates, jobs, and evaluations. |

---

## System Architecture Flow

```
[ Candidate / Recruiter / Admin ]
               │
               ▼
   [ React 18 Single Page App ]
         (Port: 5173)
         │           │
         │           ▼
         │   [ AI Microservice (FastAPI) ]
         │         (Port: 8000)
         │         ├── Resume Parser (PyPDF)
         │         ├── Multi-Vector Matcher
         │         ├── Ranking Engine
         │         └── LLM / RAG Engine (Gemini)
         ▼
[ Laravel 11 REST API ] (Port: 8080)
         │
         ├── Sanctum Auth & RBAC
         ├── Application & Job Controller
         └── MySQL 8.0 Database (Port: 3306)
```

---

## Repository Structure

```
HireAI/
├── ai-service/                   # Python FastAPI AI Microservice
│   ├── app/
│   │   ├── cv_parser.py          # PDF/Text extraction and parsing
│   │   ├── matcher.py            # Multi-dimensional matching algorithm
│   │   ├── ranker.py             # Candidate ranking engine
│   │   ├── semantic_search.py    # Semantic candidate retrieval
│   │   ├── rag_assistant.py      # Recruitment RAG assistant
│   │   ├── interview_assistant.py# Question generation & answer evaluation
│   │   ├── recruitment_insights.py# Pipeline & hiring metrics engine
│   │   ├── main.py               # FastAPI application & route declarations
│   │   └── test_*.py             # Unit and integration test suites
│   ├── Procfile                  # Deployment process definition
│   └── requirements.txt          # Python dependencies
│
├── backend/                      # Laravel 11 REST API
│   ├── app/
│   │   ├── Http/Controllers/Api/ # REST controllers (Auth, Jobs, Apps, AI, Admin)
│   │   ├── Http/Middleware/      # Role-based access and security guards
│   │   └── Models/               # Eloquent domain models
│   ├── database/                 # Migrations and seeders
│   ├── routes/
│   │   └── api.php               # Protected and public API routes
│   └── .env.example              # Backend environment template
│
├── frontend/                     # React 18 / Vite Application
│   ├── src/
│   │   ├── components/           # UI components (Portals, Modals, Dashboards)
│   │   ├── services/             # Axios API clients & AI matcher bridge
│   │   ├── App.jsx               # Application root & view router
│   │   └── index.css             # Tailwind base & design system tokens
│   ├── package.json              # Frontend dependencies and scripts
│   └── vite.config.js            # Vite build configuration
│
├── docs/                         # Specification & Engineering Documentation
│   ├── phase1_requirements.md    # Software Requirements Specification (SRS)
│   ├── phase2_system_design.md   # UML diagrams (Class, ERD, Sequence, Activity)
│   ├── phase3_database_design.md # Data dictionary & schema design
│   └── schema.sql                # Complete standalone MySQL DDL schema
│
├── implementation_plan.md        # Engineering phase roadmap & milestones
├── render.yaml                   # Cloud deployment orchestration config
├── SECURITY.md                   # Vulnerability reporting and security protocols
└── README.md                     # Project documentation
```

---

## Prerequisites

Before setting up HireAI, ensure your local development environment meets the following requirements:

- **Node.js**: v18.0.0 or higher
- **npm**: v9.0.0 or higher
- **Python**: v3.10 or higher
- **PHP**: v8.2 or higher
- **Composer**: v2.5 or higher
- **MySQL**: v8.0 or higher
- **Google Gemini API Key** (optional for LLM-enhanced generation; heuristic fallbacks are included)

---

## Step-by-Step Setup Guide

### 1. Database Setup (MySQL)

Create the database and apply the provided DDL schema:

```bash
# Log in to MySQL
mysql -u root -p

# Create the HireAI database
CREATE DATABASE hireai_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
EXIT;

# Import the complete schema
mysql -u root -p hireai_db < docs/schema.sql
```

---

### 2. AI Microservice (FastAPI)

The AI engine runs independently as a FastAPI service.

```bash
# Navigate to the AI service directory
cd ai-service

# Create and activate a Python virtual environment
# Windows (PowerShell):
python -m venv venv
.\venv\Scripts\Activate.ps1

# Linux / macOS:
# python3 -m venv venv
# source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# (Optional) Set your Gemini API key in an environment variable or .env file:
# GEMINI_API_KEY="your-gemini-api-key"

# Start the AI microservice
uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```

The AI microservice will be running at `http://localhost:8000`.  
Interactive Swagger API documentation is available at `http://localhost:8000/docs`.

---

### 3. Backend API (Laravel 11)

```bash
# Navigate to the backend directory
cd backend

# Install PHP dependencies
composer install

# Copy environment file
cp .env.example .env

# Generate application key
php artisan key:generate

# Configure database credentials in .env:
# DB_HOST=127.0.0.1
# DB_PORT=3306
# DB_DATABASE=hireai_db
# DB_USERNAME=root
# DB_PASSWORD=your_mysql_password

# Run migrations (or use docs/schema.sql as imported in step 1)
php artisan migrate

# Seed initial admin user
php artisan db:seed

# Start the Laravel development server
php artisan serve --port=8080
```

The backend REST API will be available at `http://localhost:8080/api`.

---

### 4. Frontend Application (React / Vite)

```bash
# Navigate to the frontend directory
cd frontend

# Install JavaScript dependencies
npm install

# Start the Vite development server
npm run dev
```

Open your browser and navigate to `http://localhost:5173`.

---

## Environment Configuration

### Backend (`backend/.env`)

```ini
APP_NAME=HireAI
APP_ENV=local
APP_KEY=base64:...
APP_DEBUG=true
APP_URL=http://localhost:8080

DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=hireai_db
DB_USERNAME=root
DB_PASSWORD=

SANCTUM_STATEFUL_DOMAINS=localhost:5173

# Admin Provisioning Credentials
ADMIN_SEED_EMAIL=admin@hireai.io
ADMIN_SEED_PASSWORD=change_this_admin_password_in_env
```

### AI Microservice (`ai-service/.env`)

```ini
HOST=0.0.0.0
PORT=8000
GEMINI_API_KEY=your_gemini_api_key_here
MAX_FILE_SIZE_MB=10
```

---

## API Reference

### AI Microservice Endpoints

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/health` | Service health status check |
| `POST` | `/api/ai/parse-cv` | Extracts structured skills, experience, and education from uploaded CV (PDF/TXT/DOCX) |
| `POST` | `/api/ai/match` | Computes multi-dimensional compatibility scores between a CV and job requirements |
| `POST` | `/api/ai/rank` | Evaluates and orders candidate pools against a job requisition |
| `POST` | `/api/ai/semantic-search` | Semantic candidate retrieval across resumes based on arbitrary query strings |
| `POST` | `/api/ai/rag-assistant` | Contextual Q&A against recruitment data and job criteria |
| `POST` | `/api/ai/generate-interview-questions` | Generates candidate-specific interview questions and scoring rubrics |
| `POST` | `/api/ai/evaluate-answer` | Evaluates a candidate's response to an interview question against target criteria |
| `POST` | `/api/ai/insights` | Generates pipeline and recruitment analytics summaries |

### Backend REST API Endpoints

#### Authentication & Account
- `POST /api/auth/register` — Register candidate or recruiter account
- `POST /api/auth/login` — Authenticate and receive Sanctum bearer token
- `POST /api/auth/logout` — Revoke active token
- `GET /api/auth/user` — Fetch authenticated profile and role

#### Job Postings
- `GET /api/jobs` — Browse active jobs with filters
- `GET /api/jobs/{id}` — Retrieve full job details and requirements
- `POST /api/jobs` — Create new job posting (Recruiter/Admin)
- `PUT /api/jobs/{id}` — Modify job details (Recruiter/Admin)
- `DELETE /api/jobs/{id}` — Archive or delete posting (Recruiter/Admin)

#### Candidate Applications & Workflows
- `POST /api/applications` — Submit application with CV attachment
- `GET /api/candidate/applications` — List user's active applications
- `DELETE /api/applications/{id}` — Withdraw application
- `GET /api/jobs/{jobId}/candidates` — List and rank applicants for a job (Recruiter)
- `PATCH /api/applications/{id}/status` — Update stage (`under_review`, `shortlisted`, etc.)

#### Interviews & Analytics
- `POST /api/interviews` — Schedule interview with date/time and venue/link
- `GET /api/interviews` — Retrieve scheduled interviews
- `POST /api/interviews/{id}/feedback` — Record interviewer notes and rating
- `GET /api/recruiter/analytics` — Fetch dashboard metrics and conversion rates

#### Administration (Role: Admin)
- `GET /api/admin/users` — List all registered users
- `PATCH /api/admin/users/{id}/role` — Update user role (`candidate`, `recruiter`, `admin`)
- `PATCH /api/admin/users/{id}/status` — Activate or deactivate user account

---

## Role-Based Access Control (RBAC)

HireAI enforces strict separation of privileges across three primary roles:

| Capability | Candidate | Recruiter | Administrator |
| :--- | :---: | :---: | :---: |
| Browse & Search Jobs | Yes | Yes | Yes |
| Apply with CV & View Match Preview | Yes | No | No |
| Track Personal Applications | Yes | No | No |
| Create & Manage Job Postings | No | Yes | Yes |
| Review & Rank Applicants | No | Yes | Yes |
| Generate AI Interview Questions | No | Yes | Yes |
| Schedule Interviews & Log Feedback | No | Yes | Yes |
| Access Recruiter RAG Assistant | No | Yes | Yes |
| View Recruiter Analytics Dashboard | No | Yes | Yes |
| Manage User Roles & Deactivate Accounts | No | No | Yes |
| System Telemetry & Audit Logs | No | No | Yes |

---

## Testing & Quality Assurance

### AI Microservice Test Suite

The AI service includes automated test suites validating parsing, scoring, ranking, and assistant responses:

```bash
cd ai-service

# Run all test suites
python -m unittest discover app -p "test_*.py"

# Or run individual modules:
python -m app.test_ai_core
python -m app.test_ranker
python -m app.test_semantic_search
python -m app.test_rag
python -m app.test_interview
python -m app.test_insights
```

### Backend Test Suite

```bash
cd backend
php artisan test
```

### Frontend Build Validation

```bash
cd frontend
npm run build
```

---

## Security & Compliance

HireAI adheres to modern security standards for talent data handling:

- **Input Validation & File Sanitization**: Uploaded resumes are subject to strict filename sanitization (preventing directory traversal), MIME validation (`.pdf`, `.txt`, `.doc`, `.docx`), and a strict 10 MB payload ceiling.
- **Authentication**: Token-based authentication powered by Laravel Sanctum with rate limiting on sensitive authentication endpoints.
- **Credential Storage**: Cryptographic password hashing using bcrypt.
- **Access Isolation**: Multi-tier middleware enforcing role checks at every API endpoint.
- **Cross-Origin Resource Sharing (CORS)**: Configurable origin whitelisting between frontend, backend, and AI microservice.

For vulnerability reporting guidelines, refer to [SECURITY.md](file:///c:/Users/Admin/Desktop/HireAI/SECURITY.md).

---

## Contributing

1. Fork the repository.
2. Create a feature branch: `git checkout -b feature/your-feature-name`.
3. Commit your changes following standard commit conventions: `git commit -m "feat: add candidate export support"`.
4. Push to the branch: `git push origin feature/your-feature-name`.
5. Open a pull request with an explanation of your modifications.

---

## License

This project is licensed under the MIT License. See the LICENSE file for details.
