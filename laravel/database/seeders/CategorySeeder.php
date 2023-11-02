<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Category;

class CategorySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run() : void
    {
        Category::create(['name' => 'Fruits']);
        Category::create(['name' => 'Vegetables']);
        Category::create(['name' => 'Nuts']);
        Category::create(['name' => 'Bread Products']);
        Category::create(['name' => 'Milk Products']);
    }
}
