<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Product;

class ProductController extends Controller
{
    public function getProducts()
    {
        return response()->json(Product::select('name', 'description', 'price')->get());
    }
}   
