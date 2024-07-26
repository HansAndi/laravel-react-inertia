<?php

namespace App\Observers;

use App\Models\Penulis;
use Illuminate\Support\Facades\Cache;

class PenulisObserver
{
    /**
     * Handle the Penulis "created" event.
     */
    public function created(Penulis $penulis): void
    {
        Cache::tags(['penulis-pagination'])->flush();
    }

    /**
     * Handle the Penulis "updated" event.
     */
    public function updated(Penulis $penulis): void
    {
        Cache::tags(['penulis-pagination'])->flush();
    }

    /**
     * Handle the Penulis "deleted" event.
     */
    public function deleted(Penulis $penulis): void
    {
        Cache::tags(['penulis-pagination'])->flush();
    }

    /**
     * Handle the Penulis "restored" event.
     */
    public function restored(Penulis $penulis): void
    {
        //
    }

    /**
     * Handle the Penulis "force deleted" event.
     */
    public function forceDeleted(Penulis $penulis): void
    {
        //
    }
}
