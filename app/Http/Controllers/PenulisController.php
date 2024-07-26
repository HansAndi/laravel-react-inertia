<?php

namespace App\Http\Controllers;

use App\Models\Penulis;
use Illuminate\Support\Facades\Gate;
use App\Http\Requests\StorePenulisRequest;
use App\Http\Requests\UpdatePenulisRequest;
use App\Http\Resources\PenulisResource;
use Illuminate\Support\Facades\Cache;
use Inertia\Inertia;

class PenulisController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $time = 60 * 60 * 24;
        $page = request('page', 1);
        $cacheKey = 'penulis-page-' . $page;
        $search = request('search');

        if ($search != '') {
            $cacheKey .= '-search-' . $search;
        }

        $penulis = Cache::tags(['penulis-pagination'])->remember($cacheKey, $time, function () use ($search) {
            return Penulis::filter($search)->latest()->paginate(10)->onEachSide(1)->withQueryString();
        });


        return Inertia::render('Penulis/Index', [
            'penulis' => PenulisResource::collection($penulis),
            'filters' => request()->only('search')
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
    public function store(StorePenulisRequest $request)
    {
        Gate::authorize('isAdmin');

        try {
            $validated = $request->validated();
            Penulis::create($validated);
        } catch (\Throwable $th) {

        }
    }

    /**
     * Display the specified resource.
     */
    public function show(Penulis $penulis)
    {
        Gate::authorize('isAdmin');

        return new PenulisResource($penulis);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Penulis $penulis)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdatePenulisRequest $request, Penulis $penulis)
    {
        Gate::authorize('isAdmin');

        try {
            $penulis->update($request->validated());
            return redirect()->route('penulis.index');
        } catch (\Exception $e) {

        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Penulis $penulis)
    {
        Gate::authorize('isAdmin');

        try {
            $penulis->delete();
        } catch (\Exception $e) {
            return redirect()->back();
        }
    }
}
