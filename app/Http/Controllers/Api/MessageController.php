<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

use App\Models\ContactMessage;
use Illuminate\Support\Str;

class MessageController extends Controller
{
    public function index()
    {
        return ContactMessage::orderBy('created_at', 'desc')->get();
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string',
            'email' => 'required|email',
            'phone' => 'nullable|string',
            'company' => 'nullable|string',
            'message' => 'nullable|string',
            'services' => 'nullable|array',
        ]);

        $validated['id'] = (string) Str::uuid();
        $message = ContactMessage::create($validated);

        return response()->json($message, 201);
    }

    public function update(Request $request, ContactMessage $message)
    {
        $validated = $request->validate([
            'is_read' => 'boolean',
        ]);

        $message->update($validated);

        return response()->json($message);
    }

    public function destroy(ContactMessage $message)
    {
        $message->delete();
        return response()->json(['message' => 'Message deleted']);
    }
}
