<?php

namespace App\Observers;

use App\Models\Kategori;
use Illuminate\Support\Facades\Cache;

class KategoriObserver
{
    /**
     * Handle the Kategori "created" event.
     */
    public function created(Kategori $kategori): void
    {
        Cache::tags(['kategori-pagination'])->flush();
    }

    /**
     * Handle the Kategori "updated" event.
     */
    public function updated(Kategori $kategori): void
    {
        Cache::tags(['kategori-pagination'])->flush();
    }

    /**
     * Handle the Kategori "deleted" event.
     */
    public function deleted(Kategori $kategori): void
    {
        Cache::tags(['kategori-pagination'])->flush();
    }

    /**
     * Handle the Kategori "restored" event.
     */
    public function restored(Kategori $kategori): void
    {
        //
    }

    /**
     * Handle the Kategori "force deleted" event.
     */
    public function forceDeleted(Kategori $kategori): void
    {
        //
    }
}
