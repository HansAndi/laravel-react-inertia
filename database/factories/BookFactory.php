<?php

namespace Database\Factories;

use App\Models\Kategori;
use App\Models\Penerbit;
use App\Models\Penulis;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Book>
 */
class BookFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'judul' => $this->faker->sentence(4),
            'deskripsi' => $this->faker->paragraph,
            'penulis_id' => Penulis::all()->random()->id,
            'penerbit_id' => Penerbit::all()->random()->id,
            'kategori_id' => Kategori::all()->random()->id,
            'tahun_terbit' => $this->faker->numberBetween(2000, date('Y')),
            'cover' => $this->faker->imageUrl(),
        ];
    }
}
