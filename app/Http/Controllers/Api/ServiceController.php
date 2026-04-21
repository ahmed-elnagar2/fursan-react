<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

use App\Models\Service;
use Illuminate\Support\Str;

class ServiceController extends Controller
{
    public function index()
    {
        $query = Service::orderBy('sort_order');
        
        // Show only active services for public users
        // Admins (authenticated via Sanctum) can see all services
        if (!auth('sanctum')->check()) {
            $query->where('is_active', true);
        }
        
        return $query->get();
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string',
            'title_en' => 'nullable|string',
            'description' => 'required|string',
            'description_en' => 'nullable|string',
            'image_url' => 'nullable|string',
            'sort_order' => 'integer',
            'is_active' => 'boolean',
            'sub_services' => 'nullable|array',
        ]);

        $validated['id'] = (string) Str::uuid();
        $service = Service::create($validated);

        return response()->json($service, 201);
    }

    public function update(Request $request, Service $service)
    {
        $validated = $request->validate([
            'title' => 'string',
            'title_en' => 'nullable|string',
            'description' => 'string',
            'description_en' => 'nullable|string',
            'image_url' => 'nullable|string',
            'sort_order' => 'integer',
            'is_active' => 'boolean',
            'sub_services' => 'nullable|array',
        ]);

        $service->update($validated);

        return response()->json($service);
    }

    public function destroy(Service $service)
    {
        $service->delete();
        return response()->json(['message' => 'Service deleted']);
    }
}
