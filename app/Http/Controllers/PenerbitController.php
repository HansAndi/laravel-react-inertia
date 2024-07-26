<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use App\Models\Penerbit;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Facades\Cache;
use App\Http\Resources\PenerbitResource;
use App\Http\Requests\StorePenerbitRequest;
use App\Http\Requests\UpdatePenerbitRequest;

class PenerbitController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        Gate::authorize('isAdmin');

        $time = 60 * 60 * 24;
        $page = request('page', 1);
        $cacheKey = 'penerbit-page-' . $page;
        $search = request('search');

        if ($search != '') {
            $cacheKey .= '-search-' . $search;
        }

        $penerbit = Cache::tags(['penerbit-pagination'])->remember($cacheKey, $time, function () use ($search) {
            return Penerbit::filter($search)->latest()->paginate(10)->onEachSide(1)->withQueryString();
        });

        return Inertia::render('Penerbit/Index', [
            'penerbit' => PenerbitResource::collection($penerbit),
            'filters' =>request()->only('search')
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StorePenerbitRequest $request)
    {
        Gate::authorize('isAdmin');

        Penerbit::create($request->validated());
    }

    /**
     * Display the specified resource.
     */
    public function show(Penerbit $penerbit)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Penerbit $penerbit)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdatePenerbitRequest $request, Penerbit $penerbit)
    {
        Gate::authorize('isAdmin');

        $penerbit->update($request->validated());
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Penerbit $penerbit)
    {
        Gate::authorize('isAdmin');

        $penerbit->delete();
    }
}
