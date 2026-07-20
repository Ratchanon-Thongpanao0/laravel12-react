<?php

use Illuminate\Support\Facades\Route;
use App\Models\Coffee;

Route::get('/coffees', function () {
    return Coffee::all();
});