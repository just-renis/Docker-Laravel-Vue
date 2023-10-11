<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Product;
use App\Models\Category;

class ProductSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $fruitsCategory = Category::where('name', 'Fruits')->first();
        $vegetablesCategory = Category::where('name', 'Vegetables')->first();
        $nutsCategory = Category::where('name', 'Nuts')->first();

        Product::create(['name' => 'Pears', 'description' => 'Turkish pears', 'price' => 1.99])->categories()->attach($fruitsCategory->id);
        Product::create(['name' => 'Apples', 'description' => 'Greenish sour apples', 'price' => 3.59])->categories()->attach($fruitsCategory->id);
        Product::create(['name' => 'Potatoes', 'description' => 'Large sized potatoes', 'price' => 2.49])->categories()->attach($vegetablesCategory->id);
        Product::create(['name' => 'Tomatoes', 'description' => 'Small tomatoes', 'price' => 1.29])->categories()->attach($vegetablesCategory->id);
        Product::create(['name' => 'Almonds', 'description' => 'Brazilian almonds', 'price' => 6.29])->categories()->attach($nutsCategory->id);
    }
}
