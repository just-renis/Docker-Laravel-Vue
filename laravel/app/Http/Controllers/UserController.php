<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use App\Models\User;
use App\Models\Product;
use App\Models\Category;
use Illuminate\Support\Facades\DB;

class UserController extends Controller
{
    public function register(Request $request)
    {
        $request->validate([
            'company_name' => 'required|string|max:255|unique:users',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:8',
            'repeat_password' => 'required|string|min:8|same:password'
        ]);
        $user = User::create([
            'company_name' => $request->company_name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
        ]);
        return response()->json([
            'token' => $user->createToken('UserToken')->plainTextToken,
            'user' => $user,
        ], 201);
    }

    public function login(Request $request)
    {
        $request->validate([
            'email' => 'required|string|email|max:255',
            'password' => 'required|string|min:8',
        ]);
        $user = User::where('email', $request->email)->first();
        if ($user && Hash::check($request->password, $user->password)) {
            return response()->json([
                'token' => $user->createToken('UserToken')->plainTextToken,
                'user' => $user,
            ], 200);
        }
        return response()->json(['error' => 'Invalid credentials'], 401);
    }

    public function getProducts($userId)
    {
        $user = User::find($userId);
        if (!$user) return response()->json(['message' => 'User not found'], 404);
        return response()->json($user->products, 200);
    }

    public function addProduct(Request $request, $userId)
    {
        $maxWeight = $request->input('weightType') === 'g' ? 999999 : 999;
        $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'description' => 'required',
            'price' => ['required', 'numeric', 'min:0.01', 'max:99999.99'],
            'quantity' => ['required', 'numeric', 'min:1', 'max:10000'],
            'weight' => ['required', 'numeric', 'min:1', "max:{$maxWeight}"],
            'type' => 'required',
            'producer' => 'required',
            'seller' => 'required',
            'discount' => ['required', 'numeric', 'min:0', 'max:99'],
            'category' => 'required',
        ], [
            'name.max' => "Product name can't be longer than 255 characters.",
            'price.min' => "Product price can't be lower than 0.01€.",
            'price.max' => "Product price can't be higher than 99999.99€.",
            'quantity.min' => "There must be at least single product in store to add it.",
            'quantity.max' => "Max quantity of added items can be 10000.",
            'weight.min' => "Product must weight at least 1 gram.",
            'weight.max' => "Product can't weight more than {$maxWeight} {$request->input('weightType')}.",
            'discount.min' => "Discount can't be lower than 0%.",
            'discount.max' => "Discount can't be higher than 99%.",
        ]);
        $user = User::find($userId);
        if (!$user) return response()->json(['message' => 'User not found'], 404);

        $data = $request->all();
        $data['weight'] *= $data['weightType'] === 'kg' ? 1000 : 1;
        $data['type'] = ucfirst(strtolower($data['type']));
        $product = new Product($data);
        $product->category_id = Category::firstOrCreate(['name' => ucfirst(strtolower($data['category']))])->id;

        $user->products()->save($product);
        return response()->json(['message' => 'Product created successfully'], 201);
    }
}