<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Category;
use App\Models\User;

class ProductSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $users = User::all();
        $i = 0;
        $productsData = [
            [
                'name' => 'Fresh apples',
                'description' => 'Sour apples',
                'price' => 9.99,
                'quantity' => 10,
                'weight' => 500,
                'type' => 'Apples',
                'discount' => 0,
                'producer' => 'Apple farm',
                'seller' => 'Supermarket123',
                'category_id' => 1,
            ],
            [
                'name' => 'Beetroots',
                'description' => 'Beetroots from Germany',
                'price' => 12.99,
                'quantity' => 20,
                'weight' => 1200,
                'type' => 'Beetroots',
                'discount' => 10,
                'producer' => 'Vegetables farm',
                'seller' => 'Supermarket123',
                'category_id' => 2,
            ],
            [
                'name' => 'Small tomatoes',
                'description' => 'Tomatoes from Italy',
                'price' => 10,
                'quantity' => 200,
                'weight' => 1000,
                'type' => 'Tomatoes',
                'discount' => 20,
                'producer' => 'Vegetables farm',
                'seller' => 'Supermarket123',
                'category_id' => 2,
            ],
            [
                'name' => 'Dried pears',
                'description' => 'Dried pears from germany',
                'price' => 18.99,
                'quantity' => 4,
                'weight' => 800,
                'type' => 'Pears',
                'discount' => 0,
                'producer' => 'Pear farm',
                'seller' => 'Supermarket123',
                'category_id' => 1,
            ],
            [
                'name' => 'Walnuts',
                'description' => 'WALNUTS',
                'price' => 25.99,
                'quantity' => 200,
                'weight' => 100,
                'type' => 'Walnuts',
                'discount' => 15,
                'producer' => 'Aver',
                'seller' => 'Supermarket123',
                'category_id' => 3,
            ],
            [
                'name' => 'Apple juice',
                'description' => 'Apple juice made by humans',
                'price' => 5,
                'quantity' => 567,
                'weight' => 350,
                'type' => 'Apples',
                'discount' => 0,
                'producer' => 'Fruit farm',
                'seller' => 'Supermarket1234',
                'category_id' => 1,
            ],
            [
                'name' => 'White bread',
                'description' => 'bready bread',
                'price' => 99999.99,
                'quantity' => 50,
                'weight' => 999000,
                'type' => 'Breads',
                'discount' => 0,
                'producer' => 'Bread farm',
                'seller' => 'Seller123',
                'category_id' => 4,
            ],
            [
                'name' => 'Black bread',
                'description' => 'bread bread',
                'price' => 5.99,
                'quantity' => 23,
                'weight' => 123456,
                'type' => 'Breads',
                'discount' => 2,
                'producer' => 'Bread farm',
                'seller' => 'Seller123',
                'category_id' => 4,
            ],
            [
                'name' => 'Milk',
                'description' => 'Cow milk',
                'price' => 4.99,
                'quantity' => 60,
                'weight' => 1000,
                'type' => 'Milk',
                'discount' => 0,
                'producer' => 'Cow farm',
                'seller' => 'MilkSeller',
                'category_id' => 5,
            ]
        ];

        foreach ($users as $user) {
            if ($i < count($productsData)) {
                $user->products()->createMany([$productsData[$i], $productsData[$i + 1], $productsData[$i + 2]]);
                $i += 3;
            }
        }
    }
}
