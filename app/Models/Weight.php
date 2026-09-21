<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Weight extends Model
{
    protected $table = 'weights';

    protected $fillable = [
        'weight',
        'created_at',
        'updated_at',
    ];

    protected $casts = [
        'weight' => 'decimal:2',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];
}