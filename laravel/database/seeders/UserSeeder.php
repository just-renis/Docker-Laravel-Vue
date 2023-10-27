<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        DB::table('users')->insert([
            [
                'company_name' => 'John company',
                'email' => 'john@gmail.com',
                'password' => Hash::make('john1234'),
            ],
            [
                'company_name' => 'Renio company',
                'email' => 'renis@gmail.com',
                'password' => Hash::make('renis123'),
            ],
            [
                'company_name' => 'Bob company',
                'email' => 'bob@gmail.com',
                'password' => Hash::make('bob12345'),
            ],
        ]);
    }
}
