<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $admin = \App\Models\User::factory()->create([
            'name' => 'Admin',
            'email' => 'admin@forsan.com',
            'password' => \Illuminate\Support\Facades\Hash::make('password'),
        ]);

        \App\Models\UserRole::create([
            'user_id' => $admin->id,
            'role' => 'admin',
        ]);

        \App\Models\SiteSetting::create([
            'id' => \Illuminate\Support\Str::uuid(),
            'phone' => '+20123456789',
            'email' => 'info@forsan.com',
            'hero_title' => 'مجموعة فرسان',
            'hero_subtitle' => 'شريكك الموثوق في استيراد وتصدير اللحوم المجمدة',
        ]);
    }
}
