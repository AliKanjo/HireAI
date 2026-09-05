<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\JobController;
use App\Http\Controllers\Api\ApplicationController;
use App\Http\Controllers\Api\AIController;
use App\Http\Controllers\Api\InterviewController;
use App\Http\Controllers\Api\AnalyticsController;

/*
|--------------------------------------------------------------------------
| API Routes for HireAI Platform
|--------------------------------------------------------------------------
*/

// Public Endpoints
Route::post('/auth/register', [AuthController::class, 'register']);
Route::post('/auth/login', [AuthController::class, 'login']);

Route::get('/jobs', [JobController::class, 'index']);
Route::get('/jobs/{id}', [JobController::class, 'show']);

// Authenticated Routes (Sanctum)
Route::middleware('auth:sanctum')->group(function () {
    // Current User
    Route::get('/auth/user', [AuthController::class, 'user']);
    Route::post('/auth/logout', [AuthController::class, 'logout']);

    // Candidate Job Applications
    Route::post('/applications', [ApplicationController::class, 'store']);
    Route::get('/candidate/applications', [ApplicationController::class, 'candidateApplications']);
    Route::delete('/applications/{id}', [ApplicationController::class, 'withdraw']);

    // Recruiter Job Management
    Route::post('/jobs', [JobController::class, 'store']);
    Route::put('/jobs/{id}', [JobController::class, 'update']);
    Route::delete('/jobs/{id}', [JobController::class, 'destroy']);
    Route::get('/recruiter/jobs', [JobController::class, 'recruiterJobs']);

    // Recruiter Candidate Review & Ranking
    Route::get('/jobs/{jobId}/candidates', [ApplicationController::class, 'jobCandidates']);
    Route::patch('/applications/{id}/status', [ApplicationController::class, 'updateStatus']);

    // AI Endpoints
    Route::post('/ai/analyze-application/{applicationId}', [AIController::class, 'analyzeApplication']);
    Route::post('/ai/generate-questions/{applicationId}', [AIController::class, 'generateQuestions']);

    // Interview Management
    Route::post('/interviews', [InterviewController::class, 'schedule']);
    Route::get('/interviews', [InterviewController::class, 'index']);
    Route::post('/interviews/{id}/feedback', [InterviewController::class, 'recordFeedback']);

    // Recruiter Analytics
    Route::get('/recruiter/analytics', [AnalyticsController::class, 'dashboardMetrics']);
});
