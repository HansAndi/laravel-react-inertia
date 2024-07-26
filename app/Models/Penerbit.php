<?php

namespace App\Models;


use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Penerbit extends Model
{
    use HasFactory;

    protected $table = 'penerbit';
    protected $fillable = ['nama_penerbit'];

    public function getRouteKeyName()
    {
        return 'uuid';
    }

    public function scopeFilter($query, $search)
    {
        $query->when($search ?? false, function ($query, $search) {
            return $query->where('nama_penerbit', 'like', '%' . $search . '%');
        });
    }

    public function book()
    {
        return $this->hasMany(Book::class);
    }
}
