<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

class AdminUserSeeder extends Seeder
{
    /**
     * Run the database seeds for initial Super Admin provisioning.
     * 
     * Security Note: Initial Admin account is created ONLY via CLI seeder / artisan command.
     * No public HTTP endpoint can produce an admin user.
     */
    public function run(): void
    {
        User::updateOrCreate(
            ['email' => 'admin@hireai.io'],
            [
                'name'      => 'Super Admin',
                'email'     => 'admin@hireai.io',
                'password'  => Hash::make('AdminSecure#2026!'),
                'role'      => 'admin',
                'is_active' => true,
                'avatar'    => 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
            ]
        );
    }
}
