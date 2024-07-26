<?php

namespace App\Observers;

use App\Models\Peminjaman;
use Illuminate\Support\Facades\Cache;

class PeminjamanObserver
{
    /**
     * Handle the Peminjaman "created" event.
     */
    public function created(Peminjaman $peminjaman): void
    {
        Cache::tags(['peminjaman-pagination'])->flush();
    }

    /**
     * Handle the Peminjaman "updated" event.
     */
    public function updated(Peminjaman $peminjaman): void
    {
        Cache::tags(['peminjaman-pagination'])->flush();
    }

    /**
     * Handle the Peminjaman "deleted" event.
     */
    public function deleted(Peminjaman $peminjaman): void
    {
        //
    }

    /**
     * Handle the Peminjaman "restored" event.
     */
    public function restored(Peminjaman $peminjaman): void
    {
        //
    }

    /**
     * Handle the Peminjaman "force deleted" event.
     */
    public function forceDeleted(Peminjaman $peminjaman): void
    {
        //
    }
}
