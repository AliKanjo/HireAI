<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Job extends Model
{
    use HasFactory;

    protected $fillable = [
        'recruiter_id',
        'company_id',
        'title',
        'department',
        'location',
        'workplace_type',
        'job_type',
        'experience_level',
        'min_years_experience',
        'min_education_level',
        'salary_min',
        'salary_max',
        'currency',
        'description',
        'requirements',
        'benefits',
        'status',
        'deadline',
        'views_count',
        'applications_count'
    ];

    protected $casts = [
        'salary_min' => 'decimal:2',
        'salary_max' => 'decimal:2',
        'deadline' => 'date',
        'min_years_experience' => 'integer'
    ];

    public function recruiter()
    {
        return $this->belongsTo(User::class, 'recruiter_id');
    }

    public function company()
    {
        return $this->belongsTo(Company::class);
    }

    public function skills()
    {
        return $this->hasMany(JobSkill::class);
    }

    public function applications()
    {
        return $this->hasMany(Application::class);
    }
}
