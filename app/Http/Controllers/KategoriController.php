<?php

namespace App\Http\Controllers;

use App\Models\Kategori;
use Illuminate\Support\Facades\Gate;
use App\Http\Requests\StoreKategoriRequest;
use App\Http\Requests\UpdateKategoriRequest;
use App\Http\Resources\KategoriResource;
use Illuminate\Support\Facades\Cache;
use Inertia\Inertia;

class KategoriController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        Gate::authorize('isAdmin');

        $time = 60 * 60 * 24;
        $page = request('page', 1);
        $cacheKey = 'kategori-page-' . $page;
        $search = request('search');

        if ($search != '') {
            $cacheKey .= '-search-' . $search;
        }

        $kategori = Cache::tags(['kategori-pagination'])->remember($cacheKey, $time, function () use ($search) {
            return Kategori::filter($search)->latest()->paginate(10)->onEachSide(1)->withQueryString();
        });

        return Inertia::render('Kategori/Index', [
            'kategori' => KategoriResource::collection($kategori),
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
    public function store(StoreKategoriRequest $request)
    {
        Gate::authorize('isAdmin');

        Kategori::create($request->validated());
    }

    /**
     * Display the specified resource.
     */
    public function show(Kategori $kategori)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Kategori $kategori)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateKategoriRequest $request, Kategori $kategori)
    {
        Gate::authorize('isAdmin');

        $kategori->update($request->validated());
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Kategori $kategori)
    {
        Gate::authorize('isAdmin');
        
        $kategori->delete();
    }
}
