<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class CheckRole
{
    /**
     * Handle an incoming request.
     * 
     * Verifies that the authenticated database user has one of the required role(s).
     * Returns 401 for unauthenticated requests and 403 Forbidden for unauthorized roles.
     */
    public function handle(Request $request, Closure $next, string ...$roles): Response
    {
        $user = $request->user();

        // Verify Sanctum authentication
        if (!$user) {
            return response()->json([
                'message' => 'Unauthenticated access.',
            ], 401);
        }

        // Verify account active status
        if (isset($user->is_active) && !$user->is_active) {
            return response()->json([
                'message' => 'Forbidden. Your account is currently deactivated.',
            ], 403);
        }

        // Strict DB user role check against allowed roles array
        if (!in_array($user->role, $roles, true)) {
            return response()->json([
                'message' => 'Forbidden. Access restricted to authorized roles only.',
                'required_roles' => $roles,
                'current_role'  => $user->role,
            ], 403);
        }

        return $next($request);
    }
}
