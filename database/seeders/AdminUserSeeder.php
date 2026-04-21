<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class AdminUserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $user = \App\Models\User::updateOrCreate(
            ['email' => 'a7med.ntw@gmail.com'],
            [
                'name' => 'Ahmed',
                'password' => \Illuminate\Support\Facades\Hash::make('123456789'),
            ]
        );

        \App\Models\UserRole::updateOrCreate(
            ['user_id' => $user->id],
            ['role' => 'admin']
        );
    }
}
