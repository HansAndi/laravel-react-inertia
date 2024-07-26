<?php

namespace App\Http\Middleware;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Cache;
use Inertia\Middleware;

class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that is loaded on the first page visit.
     *
     * @var string
     */
    protected $rootView = 'app';

    /**
     * Determine the current asset version.
     */
    public function version(Request $request): string|null
    {
        return parent::version($request);
    }

    /**
     * Define the props that are shared by default.
     *
     * @return array<string, mixed>
     */
    public function share(Request $request): array
    {
        $user = Cache::tags(['user'])->remember('user-' . Auth::id(), 60 * 60 * 24, function () use ($request) {
            return $request->user();
        });

        return [
            ...parent::share($request),
            'auth' => [
                // 'user' => $request->user(),
                'user' => $user,
            ],
        ];
    }
}
