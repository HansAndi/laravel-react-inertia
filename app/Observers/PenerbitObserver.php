<?php

namespace App\Observers;

use App\Models\Penerbit;
use Illuminate\Support\Facades\Cache;

class PenerbitObserver
{
    /**
     * Handle the Penerbit "created" event.
     */
    public function created(Penerbit $penerbit): void
    {
        Cache::tags(['penerbit-pagination'])->flush();
    }

    /**
     * Handle the Penerbit "updated" event.
     */
    public function updated(Penerbit $penerbit): void
    {
        Cache::tags(['penerbit-pagination'])->flush();
    }

    /**
     * Handle the Penerbit "deleted" event.
     */
    public function deleted(Penerbit $penerbit): void
    {
        Cache::tags(['penerbit-pagination'])->flush();
    }

    /**
     * Handle the Penerbit "restored" event.
     */
    public function restored(Penerbit $penerbit): void
    {
        //
    }

    /**
     * Handle the Penerbit "force deleted" event.
     */
    public function forceDeleted(Penerbit $penerbit): void
    {
        //
    }
}
