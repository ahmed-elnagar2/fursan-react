<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

use App\Models\User;
use App\Models\UserRole;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class UserController extends Controller
{
    public function index()
    {
        return User::with('roles')->get();
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string',
            'email' => 'required|email|unique:users',
            'password' => 'required|min:6',
            'role' => 'required|string',
        ]);

        $user = User::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'password' => Hash::make($validated['password']),
        ]);

        UserRole::create([
            'user_id' => $user->id,
            'role' => $validated['role'],
        ]);

        return response()->json($user->load('roles'), 201);
    }

    public function update(Request $request, User $user)
    {
        $validated = $request->validate([
            'role' => 'required|string',
        ]);

        // Clear old roles and add new one (Simplified for this app)
        $user->roles()->delete();
        UserRole::create([
            'user_id' => $user->id,
            'role' => $validated['role'],
        ]);

        return response()->json($user->load('roles'));
    }

    public function destroy(User $user)
    {
        $user->delete();
        return response()->json(['message' => 'User deleted']);
    }

    public function resetPassword(Request $request, User $user)
    {
        $validated = $request->validate([
            'password' => 'required|min:6',
        ]);

        $user->password = Hash::make($validated['password']);
        $user->save();

        return response()->json(['message' => 'Password reset successfully']);
    }
}
