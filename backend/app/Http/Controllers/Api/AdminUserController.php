<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;

class AdminUserController extends Controller
{
    /**
     * List all platform users (Admin Only)
     */
    public function index(Request $request)
    {
        $users = User::select('id', 'name', 'email', 'role', 'is_active', 'created_at')->get();
        return response()->json($users);
    }

    /**
     * Dedicated Admin Account Provisioning & Role Promotion Endpoint
     * 
     * Security Constraint: Only accessible by authenticated Admins.
     * UC1b: Provision Admin Account / Role Management.
     */
    public function updateRole(Request $request, $id)
    {
        $validated = $request->validate([
            'role' => 'required|in:candidate,recruiter,admin',
        ]);

        $user = User::findOrFail($id);
        $user->role = $validated['role'];
        $user->save();

        return response()->json([
            'message' => "User role updated to {$user->role} successfully",
            'user'    => $user,
        ]);
    }

    /**
     * Toggle User Account Active Status (Admin Only)
     */
    public function toggleStatus(Request $request, $id)
    {
        $user = User::findOrFail($id);
        $user->is_active = !$user->is_active;
        $user->save();

        return response()->json([
            'message'   => "User account status updated to " . ($user->is_active ? 'Active' : 'Deactivated'),
            'is_active' => $user->is_active,
        ]);
    }
}
