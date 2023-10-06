<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Product;

class ApiController extends Controller
{
    public function getSampleData()
    {
        $product = Product::find(1);
        $data = [
            'message' => $product->name . ' ' . $product->description,
            'value' => $product->price,
        ];
        return response()->json($data);
    }
}
