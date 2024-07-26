<?php

namespace App\Models;


use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Kategori extends Model
{
    use HasFactory;

    protected $table = 'kategori';
    protected $fillable = ['nama_kategori'];

    public function getRouteKeyName()
    {
        return 'uuid';
    }

    public function scopeFilter($query, $search)
    {
        $query->when($search ?? false, function ($query, $search) {
            return $query->where('nama_kategori', 'like', '%' . $search . '%');
        });
    }

    public function book()
    {
        return $this->hasMany(Book::class);
    }
}
