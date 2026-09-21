<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Asset extends Model
{
    protected $fillable = [
        'asset_code',
        'name',
        'type',
        'assigned_to',
        'status',
        'maintenance_date',
        'maintenance_note',
    ];

    protected $casts = [
        'maintenance_date' => 'date',
    ];
}