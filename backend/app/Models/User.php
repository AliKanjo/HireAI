<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable;

    /**
     * Mass assignable attributes.
     * Note: 'role' is deliberately excluded from fillable to prevent mass-assignment privilege escalation vulnerabilities.
     */
    protected $fillable = [
        'name',
        'email',
        'password',
        'avatar',
        'is_active',
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected $casts = [
        'email_verified_at' => 'datetime',
        'is_active' => 'boolean',
    ];

    public function recruiterProfile()
    {
        return $this->hasOne(RecruiterProfile::class);
    }

    public function candidateProfile()
    {
        return $this->hasOne(CandidateProfile::class);
    }

    public function jobs()
    {
        return $this->hasMany(Job::class, 'recruiter_id');
    }

    public function applications()
    {
        return $this->hasMany(Application::class, 'candidate_id');
    }

    public function cvs()
    {
        return $this->hasMany(CV::class, 'candidate_id');
    }
}
