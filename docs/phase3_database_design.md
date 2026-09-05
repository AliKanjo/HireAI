# Phase 3 — Database Design Document
## HireAI: Relational Database Schema & Data Dictionary

This document details the complete MySQL relational schema for HireAI, including tables, fields, data types, indexes, and relational integrity constraints.

---

## 1. Tables Overview

| Table Name | Description | Key Relationships |
| :--- | :--- | :--- |
| `users` | Master accounts table (authentication & roles) | 1-to-1 with candidate/recruiter profiles |
| `companies` | Companies registered on the platform | 1-to-many with jobs & recruiters |
| `recruiter_profiles` | Additional profile metadata for recruiters | belongs to `users`, `companies` |
| `candidate_profiles` | Professional profile data for job seekers | belongs to `users` |
| `jobs` | Job postings created by recruiters | belongs to `companies`, `recruiter_profiles` |
| `job_skills` | Required/preferred technical & soft skills for a job | belongs to `jobs` |
| `applications` | Job applications submitted by candidates | links `jobs`, `candidate_profiles`, `cvs` |
| `cvs` | Uploaded CV files & extracted raw JSON data | belongs to `candidate_profiles` |
| `cv_skills` | Individual skills parsed from CVs | belongs to `cvs` |
| `cv_experiences` | Work experience records parsed from CVs | belongs to `cvs` |
| `cv_education` | Academic degrees parsed from CVs | belongs to `cvs` |
| `ai_analyses` | Match score breakdown, explanations & generated interview Qs | belongs to `applications` |
| `interviews` | Scheduled interviews with date/time & meeting link | belongs to `applications`, `recruiter_profiles` |
| `interview_feedback` | Post-interview evaluation score & notes | belongs to `interviews` |
| `notifications` | System & transactional notifications | belongs to `users` |

---

## 2. Table Schemas & Definitions

### 2.1 `users`
```sql
CREATE TABLE users (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role ENUM('candidate', 'recruiter', 'admin') NOT NULL DEFAULT 'candidate',
    avatar VARCHAR(500) NULL,
    is_active BOOLEAN DEFAULT TRUE,
    email_verified_at TIMESTAMP NULL,
    remember_token VARCHAR(100) NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_user_role (role),
    INDEX idx_user_email (email)
);
```

### 2.2 `companies`
```sql
CREATE TABLE companies (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    logo VARCHAR(500) NULL,
    website VARCHAR(255) NULL,
    description TEXT NULL,
    industry VARCHAR(100) NULL,
    location VARCHAR(255) NULL,
    size_range VARCHAR(50) NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

### 2.3 `recruiter_profiles`
```sql
CREATE TABLE recruiter_profiles (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT UNSIGNED NOT NULL UNIQUE,
    company_id BIGINT UNSIGNED NOT NULL,
    position VARCHAR(150) NULL,
    phone VARCHAR(50) NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (company_id) REFERENCES companies(id) ON DELETE CASCADE
);
```

### 2.4 `candidate_profiles`
```sql
CREATE TABLE candidate_profiles (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT UNSIGNED NOT NULL UNIQUE,
    headline VARCHAR(255) NULL,
    phone VARCHAR(50) NULL,
    location VARCHAR(255) NULL,
    summary TEXT NULL,
    years_of_experience DECIMAL(3,1) DEFAULT 0.0,
    github_url VARCHAR(255) NULL,
    linkedin_url VARCHAR(255) NULL,
    portfolio_url VARCHAR(255) NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
```

### 2.5 `jobs`
```sql
CREATE TABLE jobs (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    recruiter_id BIGINT UNSIGNED NOT NULL,
    company_id BIGINT UNSIGNED NOT NULL,
    title VARCHAR(255) NOT NULL,
    department VARCHAR(100) NULL,
    location VARCHAR(255) NOT NULL,
    workplace_type ENUM('remote', 'hybrid', 'on-site') DEFAULT 'hybrid',
    job_type ENUM('full-time', 'part-time', 'contract', 'internship') DEFAULT 'full-time',
    experience_level ENUM('junior', 'mid', 'senior', 'lead', 'executive') DEFAULT 'mid',
    min_years_experience INT DEFAULT 0,
    min_education_level VARCHAR(100) NULL,
    salary_min DECIMAL(12,2) NULL,
    salary_max DECIMAL(12,2) NULL,
    currency VARCHAR(10) DEFAULT 'USD',
    description LONGTEXT NOT NULL,
    requirements LONGTEXT NOT NULL,
    benefits TEXT NULL,
    status ENUM('draft', 'active', 'closed', 'archived') DEFAULT 'active',
    deadline DATE NULL,
    views_count INT UNSIGNED DEFAULT 0,
    applications_count INT UNSIGNED DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (recruiter_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (company_id) REFERENCES companies(id) ON DELETE CASCADE,
    INDEX idx_job_status (status),
    INDEX idx_job_title (title),
    INDEX idx_job_location (location)
);
```

### 2.6 `job_skills`
```sql
CREATE TABLE job_skills (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    job_id BIGINT UNSIGNED NOT NULL,
    skill_name VARCHAR(100) NOT NULL,
    is_required BOOLEAN DEFAULT TRUE,
    importance_weight DECIMAL(3,2) DEFAULT 1.00,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (job_id) REFERENCES jobs(id) ON DELETE CASCADE,
    INDEX idx_skill_name (skill_name)
);
```

### 2.7 `cvs`
```sql
CREATE TABLE cvs (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    candidate_id BIGINT UNSIGNED NOT NULL,
    file_path VARCHAR(500) NOT NULL,
    file_name VARCHAR(255) NOT NULL,
    file_size INT UNSIGNED NOT NULL,
    mime_type VARCHAR(100) DEFAULT 'application/pdf',
    parsed_json LONGTEXT NULL,
    is_primary BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (candidate_id) REFERENCES users(id) ON DELETE CASCADE
);
```

### 2.8 `cv_skills`, `cv_experiences`, `cv_education`
```sql
CREATE TABLE cv_skills (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    cv_id BIGINT UNSIGNED NOT NULL,
    skill_name VARCHAR(100) NOT NULL,
    proficiency_level VARCHAR(50) NULL,
    years_experience DECIMAL(3,1) NULL,
    FOREIGN KEY (cv_id) REFERENCES cvs(id) ON DELETE CASCADE
);

CREATE TABLE cv_experiences (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    cv_id BIGINT UNSIGNED NOT NULL,
    company VARCHAR(255) NOT NULL,
    position VARCHAR(255) NOT NULL,
    start_date DATE NULL,
    end_date DATE NULL,
    is_current BOOLEAN DEFAULT FALSE,
    description TEXT NULL,
    FOREIGN KEY (cv_id) REFERENCES cvs(id) ON DELETE CASCADE
);

CREATE TABLE cv_education (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    cv_id BIGINT UNSIGNED NOT NULL,
    institution VARCHAR(255) NOT NULL,
    degree VARCHAR(255) NOT NULL,
    field_of_study VARCHAR(255) NULL,
    graduation_year INT NULL,
    FOREIGN KEY (cv_id) REFERENCES cvs(id) ON DELETE CASCADE
);
```

### 2.9 `applications`
```sql
CREATE TABLE applications (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    job_id BIGINT UNSIGNED NOT NULL,
    candidate_id BIGINT UNSIGNED NOT NULL,
    cv_id BIGINT UNSIGNED NOT NULL,
    status ENUM('applied', 'under_review', 'shortlisted', 'interview', 'selected', 'rejected') DEFAULT 'applied',
    cover_letter TEXT NULL,
    applied_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    UNIQUE KEY uk_candidate_job (job_id, candidate_id),
    FOREIGN KEY (job_id) REFERENCES jobs(id) ON DELETE CASCADE,
    FOREIGN KEY (candidate_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (cv_id) REFERENCES cvs(id) ON DELETE CASCADE,
    INDEX idx_app_status (status)
);
```

### 2.10 `ai_analyses`
```sql
CREATE TABLE ai_analyses (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    application_id BIGINT UNSIGNED NOT NULL UNIQUE,
    overall_match DECIMAL(5,2) NOT NULL,
    skills_match DECIMAL(5,2) NOT NULL,
    experience_match DECIMAL(5,2) NOT NULL,
    education_match DECIMAL(5,2) NOT NULL,
    requirements_match DECIMAL(5,2) NOT NULL,
    summary_explanation LONGTEXT NOT NULL,
    strengths_json JSON NULL,
    gaps_json JSON NULL,
    generated_questions_json JSON NULL,
    confidence_score DECIMAL(4,2) DEFAULT 0.95,
    analyzed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (application_id) REFERENCES applications(id) ON DELETE CASCADE,
    INDEX idx_overall_match (overall_match)
);
```

### 2.11 `interviews` & `interview_feedback`
```sql
CREATE TABLE interviews (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    application_id BIGINT UNSIGNED NOT NULL,
    recruiter_id BIGINT UNSIGNED NOT NULL,
    scheduled_at DATETIME NOT NULL,
    duration_minutes INT DEFAULT 45,
    meeting_link VARCHAR(500) NULL,
    interview_type ENUM('technical', 'hr', 'cultural', 'final') DEFAULT 'technical',
    status ENUM('scheduled', 'completed', 'cancelled', 'rescheduled') DEFAULT 'scheduled',
    notes TEXT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (application_id) REFERENCES applications(id) ON DELETE CASCADE,
    FOREIGN KEY (recruiter_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE interview_feedback (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    interview_id BIGINT UNSIGNED NOT NULL UNIQUE,
    rating INT CHECK (rating BETWEEN 1 AND 5),
    technical_score INT CHECK (technical_score BETWEEN 1 AND 5),
    communication_score INT CHECK (communication_score BETWEEN 1 AND 5),
    problem_solving_score INT CHECK (problem_solving_score BETWEEN 1 AND 5),
    notes TEXT NULL,
    recommendation ENUM('strong_hire', 'hire', 'neutral', 'reject') NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (interview_id) REFERENCES interviews(id) ON DELETE CASCADE
);
```

### 2.12 `notifications`
```sql
CREATE TABLE notifications (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT UNSIGNED NOT NULL,
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    action_url VARCHAR(255) NULL,
    is_read BOOLEAN DEFAULT FALSE,
    read_at TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
```
