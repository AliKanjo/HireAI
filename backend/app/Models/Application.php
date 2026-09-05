<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Application extends Model
{
    use HasFactory;

    protected $fillable = [
        'job_id',
        'candidate_id',
        'cv_id',
        'status',
        'cover_letter'
    ];

    public function job()
    {
        return $this->belongsTo(Job::class);
    }

    public function candidate()
    {
        return $this->belongsTo(User::class, 'candidate_id');
    }

    public function cv()
    {
        return $this->belongsTo(CV::class, 'cv_id');
    }

    public function aiAnalysis()
    {
        return $this->hasOne(AIAnalysis::class);
    }

    public function interviews()
    {
        return $this->hasMany(Interview::class);
    }
}
