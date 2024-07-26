<?php

namespace App\Models;


use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Penulis extends Model
{
    use HasFactory;

    protected $table = 'penulis';
    protected $guarded = [];

    public function getRouteKeyName()
    {
        return 'uuid';
    }

    public function scopeFilter($query, $search)
    {
        $query->when($search ?? false, function ($query, $search) {
            return $query->where('nama_penulis', 'like', '%' . $search . '%');
        });
    }

    public function book()
    {
        return $this->hasMany(Book::class);
    }
}
