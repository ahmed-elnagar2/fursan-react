<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

use App\Models\SiteSetting;

class SettingsController extends Controller
{
    public function index()
    {
        return SiteSetting::first();
    }

    public function update(Request $request)
    {
        $settings = SiteSetting::first();
        
        $validated = $request->validate([
            'phone' => 'nullable|string',
            'email' => 'nullable|email',
            'address' => 'nullable|string',
            'address_en' => 'nullable|string',
            'hero_title' => 'nullable|string',
            'hero_subtitle' => 'nullable|string',
            'company_description' => 'nullable|string',
            'company_description_en' => 'nullable|string',
            'happy_clients' => 'nullable|string',
            'years_experience' => 'nullable|string',
            'trade_partners' => 'nullable|string',
        ]);

        if ($settings) {
            $settings->update($validated);
        } else {
            $validated['id'] = (string) \Illuminate\Support\Str::uuid();
            $settings = SiteSetting::create($validated);
        }

        return response()->json($settings);
    }
}
