<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\UserController;
use App\Http\Controllers\ProductController;
/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "web" middleware group. Make something great!
|
*/
Route::group(['prefix' => 'users'], function () {
    Route::group(['prefix' => '{userId}'], function () {
        Route::get('/products', [UserController::class, 'getProducts']);
    });
    Route::post('/register', [UserController::class, 'register']);
    Route::post('/login', [UserController::class, 'login']);
});
Route::group(['prefix' => 'categories'], function () {
    Route::get('/', [ProductController::class, 'getCategories']);
});
Route::get('/', function () {
    return view('home');
});
