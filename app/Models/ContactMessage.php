<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ContactMessage extends Model
{
    protected $keyType = 'string';
    public $incrementing = false;

    protected $fillable = [
        'id', 
        'name', 
        'email', 
        'phone', 
        'company', 
        'message', 
        'is_read', 
        'services'
    ];

    protected $casts = [
        'services' => 'array',
        'is_read' => 'boolean',
    ];
}
