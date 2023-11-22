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
        Route::group(['prefix' => 'products'], function () {
            Route::get('/', [UserController::class, 'getProducts']);
            Route::post('/add', [UserController::class, 'addProduct']);
            Route::group(['prefix' => '{productId}'], function () {
                Route::get('/', [UserController::class, 'getProductById']);
                Route::put('/edit', [UserController::class, 'editProduct']);
                Route::delete('/delete', [UserController::class, 'deleteProduct']);
            });
        });
        Route::group(['prefix' => 'basket'], function () {
            Route::group(['prefix' => 'products'], function () {
                Route::group(['prefix' => '{productId}'], function () {
                    Route::post('/add', [UserController::class, 'addProductToBasket']);
                    Route::delete('/delete', [UserController::class, 'removeProductFromBasket']);
                });
                Route::post('/purchase', [UserController::class, 'purchaseProducts']);
                Route::get('/', [UserController::class, 'getProductsBasket']);
            });
        });
    });
    Route::post('/register', [UserController::class, 'register']);
    Route::post('/login', [UserController::class, 'login']);
});
Route::group(['prefix' => 'resources'], function () {
    Route::group(['prefix' => 'categories'], function () {
        Route::get('/', [ProductController::class, 'getCategories']);
        Route::get('/products', [ProductController::class, 'getCategoriesWithProducts']);
    });
    Route::group(['prefix' => 'products'], function () {
        Route::get('/types', [ProductController::class, 'getAllTypes']);
    });
});