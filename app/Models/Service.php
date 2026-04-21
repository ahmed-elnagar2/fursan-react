<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Service extends Model
{
    protected $keyType = 'string';
    public $incrementing = false;

    protected $fillable = [
        'id', 
        'title', 
        'title_en', 
        'description', 
        'description_en', 
        'image_url', 
        'sort_order', 
        'is_active', 
        'sub_services'
    ];

    protected $casts = [
        'sub_services' => 'array',
        'is_active' => 'boolean',
    ];
}
