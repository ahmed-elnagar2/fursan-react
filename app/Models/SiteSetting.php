<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class SiteSetting extends Model
{
    protected $keyType = 'string';
    public $incrementing = false;

    protected $fillable = [
        'id', 
        'phone', 
        'email', 
        'address', 
        'address_en', 
        'hero_title', 
        'hero_subtitle', 
        'company_description', 
        'company_description_en', 
        'site_title',
        'site_title_en',
        'happy_clients',
        'years_experience',
        'trade_partners'
    ];
}
