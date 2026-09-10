<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

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
     * Security Guards:
     * 1. Self-demotion guard: Admin cannot demote their own account.
     * 2. Last-admin guard: Cannot demote the last remaining admin on the platform.
     * 3. Audit logging: Logs all role changes with initiator details.
     */
    public function updateRole(Request $request, $id)
    {
        $validated = $request->validate([
            'role' => 'required|in:candidate,recruiter,admin',
        ]);

        $user = User::findOrFail($id);
        $oldRole = $user->role;
        $newRole = $validated['role'];

        // Guard 1: Prevent self-demotion
        if ($request->user()->id === $user->id && $newRole !== 'admin') {
            return response()->json([
                'message' => 'Action forbidden. You cannot demote your own admin account.',
            ], 400);
        }

        // Guard 2: Prevent demoting the last remaining admin on the platform
        if ($oldRole === 'admin' && $newRole !== 'admin') {
            $adminCount = User::where('role', 'admin')->count();
            if ($adminCount <= 1) {
                return response()->json([
                    'message' => 'Action forbidden. Cannot demote the last remaining admin on the platform.',
                ], 400);
            }
        }

        // Update role
        $user->role = $newRole;
        $user->save();

        // Audit Logging
        Log::info("Audit Log: Role Change", [
            'initiator_id'    => $request->user()->id,
            'initiator_email' => $request->user()->email,
            'target_user_id'  => $user->id,
            'previous_role'   => $oldRole,
            'new_role'        => $newRole,
            'timestamp'       => now()->toIso8601String(),
        ]);

        return response()->json([
            'message' => "User role updated from {$oldRole} to {$user->role} successfully",
            'user'    => $user,
        ]);
    }

    /**
     * Toggle User Account Active Status (Admin Only)
     */
    public function toggleStatus(Request $request, $id)
    {
        $user = User::findOrFail($id);

        // Guard: Prevent admin from deactivating themselves
        if ($request->user()->id === $user->id) {
            return response()->json([
                'message' => 'Action forbidden. You cannot deactivate your own account.',
            ], 400);
        }

        $user->is_active = !$user->is_active;
        $user->save();

        // Audit Logging
        Log::info("Audit Log: Account Status Change", [
            'initiator_id'   => $request->user()->id,
            'target_user_id' => $user->id,
            'new_status'     => $user->is_active ? 'Active' : 'Deactivated',
            'timestamp'      => now()->toIso8601String(),
        ]);

        return response()->json([
            'message'   => "User account status updated to " . ($user->is_active ? 'Active' : 'Deactivated'),
            'is_active' => $user->is_active,
        ]);
    }
}
