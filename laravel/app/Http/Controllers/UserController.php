<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use App\Models\User;
use App\Models\Product;
use App\Models\Category;
use App\Models\BasketProduct;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

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
        $this->productValidation($request);
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

    public function addProductToBasket($userId, $productId)
    {
        $user = User::find($userId);
        if (!$user) return response()->json(['message' => 'User not found'], 404);
        $product = Product::find($productId);
        if (!$product) return response()->json(['message' => 'Product not found'], 404);
        if ($user->basketProducts->contains('product_id', $productId)) {
            return response()->json(['message' => 'Product already in basket'], 400);
        }
        $product['product_id'] = $productId;
        $user->basketProducts()->create($product->toArray());
        return response()->json(['message' => 'Product added to basket successfully'], 201);
    }

    public function getProductById($userId, $productId)
    {
        $product = DB::table('products')
        ->leftJoin('categories', 'products.category_id', '=', 'categories.id')
        ->select('products.*', 'categories.name as category')
        ->where('products.id', $productId)
        ->where('products.user_id', $userId)
        ->first();
        return $product ? response()->json($product, 200) : response()->json(['error' => 'Product not found'], 404);
    }

    public function editProduct(Request $request, $userId, $productId)
    {
        $this->productValidation($request);
        $product = Product::where('user_id', $userId)->where('id', $productId)->first();
        if (!$product) return response()->json(['message' => 'Product not found'], 404);

        $data = $request->all();
        $data['weight'] *= $data['weightType'] === 'kg' ? 1000 : 1;
        $data['type'] = ucfirst(strtolower($data['type']));
        $data['category_id'] = Category::firstOrCreate(['name' => ucfirst(strtolower($data['category']))])->id;

        $product->update($data);
        return response()->json(['message' => 'Product edited successfully'], 200);
    }

    public function deleteProduct($userId, $productId)
    {
        $product = Product::where('user_id', $userId)->where('id', $productId)->first();
        if (!$product) return response()->json(['message' => 'Product not found'], 404);
        $product->delete();
        return response()->json(['message' => 'Product deleted successfully'], 200);
    }
    
    public function getProductsBasket($userId)
    {
        $user = User::find($userId);
        if (!$user) return response()->json(['message' => 'User not found'], 404);
        $basketProducts = $user->basketProducts->map(function ($product) {
            $productArray = $product->toArray();
            $productArray['quantityToBuy'] = 1;
            return $productArray;
        });
        return response()->json($basketProducts, 200);
    }

    public function removeProductFromBasket($userId, $productId)
    {
        $product = BasketProduct::where('user_id', $userId)->where('id', $productId)->first();
        if (!$product) return response()->json(['message' => 'Product not found'], 404);
        $product->delete();
        return response()->json(['message' => 'Product removed from basket successfully'], 200);
    }

    public function purchaseProducts(Request $request, $userId)
    {
        foreach ($request->json()->all() as $purchaseItem) {
            Product::where('id', $purchaseItem['product_id'])->decrement('quantity', $purchaseItem['quantityToBuy']);
        }
        BasketProduct::where('user_id', $userId)->delete();
    }

    public function productValidation(Request $request)
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
    }
}