<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\MessageController;
use App\Http\Controllers\Api\ServiceController;
use App\Http\Controllers\Api\SettingsController;
use App\Http\Controllers\Api\UserController;
use App\Http\Controllers\PageController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

// Public Routes
Route::get('/', [PageController::class, 'index'])->name('home');
Route::get('/quote-request', [PageController::class, 'quoteRequest'])->name('quote-request');
Route::get('/dashboard', function () {
    return redirect()->route('admin.dashboard');
})->middleware(['auth'])->name('dashboard');

// API Data Routes (Session-based)
Route::prefix('api')->group(function () {
    Route::get('/services', [ServiceController::class, 'index']);
    Route::get('/settings', [SettingsController::class, 'index']);
    Route::post('/messages', [MessageController::class, 'store']);

    Route::middleware('auth')->group(function () {
        Route::get('/me', [AuthController::class, 'me']);
        Route::put('/update-password', [AuthController::class, 'updatePassword']);

        Route::post('/services', [ServiceController::class, 'store']);
        Route::put('/services/{service}', [ServiceController::class, 'update']);
        Route::delete('/services/{service}', [ServiceController::class, 'destroy']);

        Route::get('/messages', [MessageController::class, 'index']);
        Route::put('/messages/{message}', [MessageController::class, 'update']);
        Route::delete('/messages/{message}', [MessageController::class, 'destroy']);

        Route::put('/settings', [SettingsController::class, 'update']);

        Route::get('/users', [UserController::class, 'index']);
        Route::post('/users', [UserController::class, 'store']);
        Route::put('/users/{user}', [UserController::class, 'update']);
        Route::delete('/users/{user}', [UserController::class, 'destroy']);
        Route::put('/users/{user}/reset-password', [UserController::class, 'resetPassword']);
    });
});

// Admin Routes
Route::prefix('admin')->group(function () {
    // Route::get('/', function () {
    //     return redirect()->route('admin.dashboard');
    // });

    Route::get('/login', function () {
        return Inertia::render('AdminLogin');
    })->name('admin.login')->middleware('guest');

    Route::get('/forgot', function () {
        return Inertia::render('AdminForgot');
    })->name('admin.password.request');

    Route::get('/dashboard', function () {
        return Inertia::render('AdminDashboard');
    })->middleware(['auth'])->name('admin.dashboard');
});

require __DIR__.'/auth.php';
