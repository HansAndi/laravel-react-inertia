<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class StatusPeminjamanSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $statusPeminjaman = [
            ['id' => 1, 'name' => 'Pending'],
            ['id' => 2, 'name' => 'On Loan'],
            ['id' => 3, 'name' => 'Returned'],
        ];

        foreach ($statusPeminjaman as $item) {
            \App\Models\StatusPeminjaman::create([
                'id' => $item['id'],
                'name' => $item['name'],
            ]);
        }
    }
}
