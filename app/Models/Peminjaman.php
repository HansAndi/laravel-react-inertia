<?php

namespace App\Models;

use App\Enums\StatusPeminjaman;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Peminjaman extends Model
{
    use HasFactory;

    protected $table = 'peminjaman';
    protected $fillable = ['user_id', 'id_buku', 'tanggal_pinjam', 'tanggal_kembali', 'status_peminjaman', 'approved'];
    protected $casts = ['status_peminjaman' => StatusPeminjaman::class];

    public function getRouteKeyName()
    {
        return 'uuid';
    }

    public function scopeFilter($query, array $filters)
    {
        $query->when($filters['search'] ?? false, function ($query, $search) {
            return $query->whereHas('user', function ($query) use ($search) {
                $query->where('name', 'like', '%' . $search . '%');
            });
        });

        $query->when(isset($filters['status']), function ($query) use ($filters) {
            return $query->where('status_peminjaman', $filters['status']);
        });
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function book()
    {
        return $this->belongsTo(Book::class, 'id_buku', 'id');
    }
}
