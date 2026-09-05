# HireAI — AI-Powered Recruitment & CV Analysis Platform

HireAI is an intelligent, full-stack recruitment platform designed to automate CV extraction, candidate matching against complex job requirements, candidate ranking, and contextual AI interview question synthesis.

---

## 🚀 Key Modules & Architecture

1. **AI Microservice (`ai-service/`)**:
   - Python FastAPI service for CV text parsing (PDF/Text).
   - Multidimensional matching engine (Overall, Skills, Experience, Education, Requirements Match %).
   - LLM & Heuristic prompt engine for generating candidate-tailored interview questions and evaluation rubrics.

2. **Backend API (`backend/`)**:
   - Laravel 11 REST API with Sanctum authentication & Role-Based Access Control (Candidate, Recruiter, Administrator).
   - Relational MySQL schema for jobs, applications, CVs, AI analyses, and interview scheduling.

3. **Frontend Application (`frontend/`)**:
   - Modern React 18 SPA built with Vite and Tailwind CSS.
   - Recruiter Dashboard with dynamic candidate rankings, pipeline funnels, and match histograms.
   - Candidate Portal with job search, instant AI CV match test preview, and application tracker.
   - Admin Portal for role governance and AI telemetry audit.

4. **System Design & Specs (`docs/`)**:
   - `docs/phase2_system_design.md`: Use Case, Class Diagram, ERD, Sequence, and Activity Diagrams.
   - `docs/phase3_database_design.md`: Data dictionary, constraints, and table definitions.
   - `docs/schema.sql`: Ready-to-run MySQL DDL script.

---

## 🛠️ Quick Start

### 1. Frontend (React SPA)
```bash
cd frontend
npm install
npm run dev
```
Open `http://localhost:5173` to explore the interactive platform.

### 2. AI Microservice (FastAPI)
```bash
cd ai-service
pip install -r requirements.txt
python -m app.main
```
FastAPI Swagger docs will be accessible at `http://localhost:8000/docs`.

### 3. Database Setup (MySQL)
```bash
mysql -u root -p hireai_db < docs/schema.sql
```
