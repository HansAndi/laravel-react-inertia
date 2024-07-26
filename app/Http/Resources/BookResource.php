<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Facades\Storage;

class BookResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'uuid' => $this->uuid,
            'judul' => $this->judul,
            'deskripsi' => $this->deskripsi,
            'tahun_terbit' => $this->tahun_terbit,
            'cover' => Storage::url($this->cover),
            'penulis' => PenulisResource::make($this->whenLoaded('penulis')),
            'penerbit' => PenerbitResource::make($this->whenLoaded('penerbit')),
            'kategori' => KategoriResource::make($this->whenLoaded('kategori')),
        ];
    }
}
