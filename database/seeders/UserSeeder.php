<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // $user = [
        //     [
        //         'name' => 'Admin',
        //         'email' => 'admin@admin.com',
        //         'password' => Hash::make('password'),
        //         'is_admin' => true
        //     ],
        //     [
        //         'name' => 'User',
        //         'email' => 'user@user.com',
        //         'password' => Hash::make('password'),
        //         'is_admin' => false
        //     ]
        // ];

        // foreach ($user as $key => $value) {
        //     User::create($value);
        // }

        User::create([
            'name' => 'Admin',
            'email' => 'admin@admin.com',
            'password' => Hash::make('password'),
            'is_admin' => true
        ]);

        for ($i=0; $i < 10; $i++) {
            User::create([
                'name' => 'User ' . $i,
                'email' => 'user' . $i . '@user.com',
                'password' => Hash::make('password'),
                'is_admin' => false
            ]);
        }
    }
}
