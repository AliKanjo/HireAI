<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class AdminUserSeeder extends Seeder
{
    /**
     * Run the database seeds for initial Super Admin provisioning.
     * 
     * Security Note: No hardcoded secrets. Password is pulled from environment variable
     * ADMIN_SEED_PASSWORD, or defaults to a secure randomly generated string.
     */
    public function run(): void
    {
        $adminEmail = env('ADMIN_SEED_EMAIL', 'admin@hireai.io');
        $rawPassword = env('ADMIN_SEED_PASSWORD');
        $isGenerated = false;

        if (!$rawPassword) {
            $rawPassword = Str::random(24);
            $isGenerated = true;
        }

        $admin = User::updateOrCreate(
            ['email' => $adminEmail],
            [
                'name'      => 'Super Admin',
                'email'     => $adminEmail,
                'password'  => Hash::make($rawPassword),
                'role'      => 'admin',
                'is_active' => true,
                'avatar'    => 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
            ]
        );

        if ($this->command) {
            $this->command->info("Super Admin account seeded: {$admin->email}");
            if ($isGenerated) {
                $this->command->warn("Generated Admin Password: {$rawPassword}");
                $this->command->warn("Save this password immediately or set ADMIN_SEED_PASSWORD in your .env file.");
            }
        }
    }
}
