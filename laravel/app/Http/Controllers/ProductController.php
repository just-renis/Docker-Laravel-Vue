<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use App\Models\Product;

class ProductController extends Controller
{
    public function getCategoriesWithProducts(Request $request)
    {
        $categories = DB::table('categories')
        ->select('categories.id', 'categories.name')
        ->selectRaw('COUNT(products.category_id) as products_count')
        ->selectRaw('JSON_ARRAYAGG(JSON_OBJECT("id", products.id, "name", products.name, "price", products.price, "description", 
        products.description, "quantity", products.quantity, "weight", products.weight, "type", 
        products.type, "discount", products.discount)) as products')
        ->leftJoin('products', 'categories.id', '=', 'products.category_id')
        ->where('products.price', '>=', (float) $request->input('minPrice', 0))
        ->where('products.price', '<=', (float) $request->input('maxPrice', 99999.99))
        ->groupBy('categories.id')
        ->get();

        foreach ($categories as $category) {
            $category->products = json_decode($category->products);
        }
        return response()->json(['categories' => $categories, 'types' => $this->getFilteredTypes($request->input('minPrice', 0), $request->input('maxPrice', 99999.99))], 200);
    }

    public function getCategories()
    {
        return response()->json(DB::table('categories')->pluck('name'), 200);
    }

    public function getAllTypes()
    {
        return response()->json(DB::table('products')->distinct()->pluck('type'), 200);
    }

    public function getFilteredTypes($minPrice, $maxPrice)
    {
        return DB::table('products')->select('type', DB::raw('count(*) as products_count'))
        ->where('products.price', '>=', $minPrice)
        ->where('products.price', '<=', $maxPrice)
        ->groupBy('type')->get();
    }
}