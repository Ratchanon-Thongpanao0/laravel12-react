<?php

use Illuminate\Support\Facades\Route;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

use App\Models\User;
use App\Models\Coffee;

use App\Http\Controllers\Api\ProductController;
use App\Http\Controllers\Api\AssetController;


// Coffee API
Route::get('/coffees', function () {
    return Coffee::all();
});


// Product API
Route::apiResource('/product', ProductController::class);


// Asset API
Route::apiResource('/assets', AssetController::class);


// Sanctum Login
Route::post('/sanctum/token', function (Request $request) {
    $user = User::where('email', $request->email)->first();

    if (!$user || !Hash::check($request->password, $user->password)) {
        return [
            'email' => ['The provided credentials are incorrect.']
        ];
    }

    return [
        'token' => $user->createToken($request->device_name)->plainTextToken
    ];
});


// Sanctum Register
Route::post('/sanctum/token/register', function (Request $request) {
    $user = User::where('email', $request->email)->first();

    if ($user) {
        return [
            'email' => ['The email is already in use.']
        ];
    }

    $user = User::create([
        'name' => $request->name,
        'email' => $request->email,
        'password' => Hash::make($request->password),
    ]);

    return [
        'token' => $user->createToken($request->device_name)->plainTextToken
    ];
});