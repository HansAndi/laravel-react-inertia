<?php

namespace App\Providers;

use App\Models\Book;
use App\Models\Penulis;
use App\Models\Kategori;
use App\Models\Peminjaman;
use App\Models\Penerbit;
use App\Observers\BookObserver;
use App\Observers\PenulisObserver;
use App\Observers\KategoriObserver;
use App\Observers\PeminjamanObserver;
use App\Observers\PenerbitObserver;
use Illuminate\Support\Facades\Event;
use Illuminate\Auth\Events\Registered;
use Illuminate\Auth\Listeners\SendEmailVerificationNotification;
use Illuminate\Foundation\Support\Providers\EventServiceProvider as ServiceProvider;

class EventServiceProvider extends ServiceProvider
{
    /**
     * The event to listener mappings for the application.
     *
     * @var array<class-string, array<int, class-string>>
     */
    protected $listen = [
        Registered::class => [
            SendEmailVerificationNotification::class,
        ],
    ];

    /**
     * Register any events for your application.
     */
    public function boot(): void
    {
        Book::observe(BookObserver::class);
        Kategori::observe(KategoriObserver::class);
        Penulis::observe(PenulisObserver::class);
        Penerbit::observe(PenerbitObserver::class);
        Peminjaman::observe(PeminjamanObserver::class);
    }

    /**
     * Determine if events and listeners should be automatically discovered.
     */
    public function shouldDiscoverEvents(): bool
    {
        return false;
    }
}
