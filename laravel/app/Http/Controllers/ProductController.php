<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class ProductController extends Controller
{
    public function getCategories(Request $request)
    {
        $categories = DB::table('categories')
        ->select('categories.id', 'categories.name')
        ->selectRaw('COUNT(products.category_id) as product_count')
        ->selectRaw('JSON_ARRAYAGG(JSON_OBJECT("name", products.name, "price", products.price, "description", products.description)) as products')
        ->leftJoin('products', 'categories.id', '=', 'products.category_id')
        ->where('products.price', '>=', (float) $request->input('minPrice', 0))
        ->where('products.price', '<=', (float) $request->input('maxPrice', 9999))
        ->groupBy('categories.id')
        ->get();

        foreach ($categories as $category) $category->products = json_decode($category->products);
        return response()->json($categories);
    }
}