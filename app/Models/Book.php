<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Book extends Model
{
    use HasFactory;

    protected $fillable = [
        'judul',
        'deskripsi',
        'tahun_terbit',
        'penulis_id',
        'kategori_id',
        'penerbit_id',
        'cover'
    ];

    public function getRouteKeyName()
    {
        return 'uuid';
    }

    public function scopeFilter(Builder $query, array $filters)
    {
        $query->when($filters['search'] ?? false, fn ($query, $search) =>
            $query->where('judul', 'like', '%' . $search . '%')
        );

        $query->when($filters['category'] ?? false, fn ($query, $category) =>
            $query->whereHas('kategori', fn ($query) =>
                $query->where('nama_kategori', $category)
            )
        );
    }

    public function penulis()
    {
        return $this->belongsTo(Penulis::class);
    }

    public function kategori()
    {
        return $this->belongsTo(Kategori::class);
    }

    public function penerbit()
    {
        return $this->belongsTo(Penerbit::class);
    }

    public function peminjaman()
    {
        return $this->hasMany(Peminjaman::class);
    }
}
