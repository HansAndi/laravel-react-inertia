<?php

namespace App\Http\Resources;

use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class PeminjamanResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'uuid' => $this->uuid,
            'id_buku' => $this->id_buku,
            'user' => $this->user,
            'book' => $this->book,
            'tanggal_pinjam' => Carbon::parse($this->tanggal_pinjam)->translatedFormat('l\, d F Y H:i'),
            'tanggal_kembali' => $this->when($this->tanggal_kembali != null, Carbon::parse($this->tanggal_kembali)->diffForHumans()),
            'tanggal_kembali_full' => Carbon::parse($this->tanggal_kembali)->translatedFormat('l\, d F Y H:i'),
            'status_peminjaman' => $this->status_peminjaman,
            'approved' => $this->approved,
        ];
    }
}
