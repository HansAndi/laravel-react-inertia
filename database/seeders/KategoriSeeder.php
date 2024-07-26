<?php

namespace Database\Seeders;

use App\Models\Kategori;
use Illuminate\Database\Seeder;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;

class KategoriSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Kategori::factory()->count(20)->create();
        // create list of genre of books

        $kategori = [
            'Fiksi',
            'Non-Fiksi',
            'Komik',
            'Novel',
            'Pendidikan',
            'Sejarah',
            'Biografi',
            'Agama',
            'Kesehatan',
            'Teknologi',
            'Olahraga',
            'Politik',
            'Hukum',
            'Ekonomi',
            'Bisnis',
            'Seni',
            'Musik',
            'Film',
            'Pariwisata',
            'Kuliner',
        ];

        foreach ($kategori as $item) {
            Kategori::create([
                'nama_kategori' => $item,
            ]);
        }
    }
}
