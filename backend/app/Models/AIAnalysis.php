<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class AIAnalysis extends Model
{
    use HasFactory;

    protected $table = 'ai_analyses';

    protected $fillable = [
        'application_id',
        'overall_match',
        'skills_match',
        'experience_match',
        'education_match',
        'requirements_match',
        'summary_explanation',
        'strengths_json',
        'gaps_json',
        'generated_questions_json',
        'confidence_score'
    ];

    protected $casts = [
        'overall_match' => 'float',
        'skills_match' => 'float',
        'experience_match' => 'float',
        'education_match' => 'float',
        'requirements_match' => 'float',
        'strengths_json' => 'array',
        'gaps_json' => 'array',
        'generated_questions_json' => 'array',
    ];

    public function application()
    {
        return $this->belongsTo(Application::class);
    }
}
