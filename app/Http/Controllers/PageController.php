<?php

namespace App\Http\Controllers;

use App\Models\Service;
use App\Models\SiteSetting;
use Inertia\Inertia;
use Illuminate\Http\Request;

class PageController extends Controller
{
    public function index()
    {
        $services = Service::where('is_active', true)->orderBy('sort_order')->get();
        $settings = SiteSetting::all()->pluck('value', 'key');
        
        return Inertia::render('Index', [
            'initialServices' => $services,
            'initialSettings' => $settings,
        ]);
    }

    public function quoteRequest()
    {
        $services = Service::where('is_active', true)->orderBy('sort_order')->get();
        return Inertia::render('QuoteRequest', [
            'initialServices' => $services,
        ]);
    }
}
