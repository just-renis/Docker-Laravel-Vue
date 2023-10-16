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

        $fruitsCategory->products()->create(['name' => 'Pears', 'description' => 'Turkish pears', 'price' => 1.99]);
        $fruitsCategory->products()->create(['name' => 'Apples', 'description' => 'Greenish sour apples', 'price' => 3.59]);
        $vegetablesCategory->products()->create(['name' => 'Potatoes', 'description' => 'Large-sized potatoes', 'price' => 2.49]);
        $vegetablesCategory->products()->create(['name' => 'Tomatoes', 'description' => 'Small tomatoes', 'price' => 1.29]);
        $nutsCategory->products()->create(['name' => 'Almonds', 'description' => 'Brazilian almonds', 'price' => 6.29]);
    }
}
