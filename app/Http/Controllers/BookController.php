<?php

namespace App\Http\Controllers;

use App\Models\Book;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Gate;
use App\Http\Requests\StoreBookRequest;
use Illuminate\Support\Facades\Storage;
use App\Http\Requests\UpdateBookRequest;
use App\Http\Resources\BookResource;
use Illuminate\Support\Facades\Cache;

class BookController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $time = 60 * 60 * 24;
        $page = request('page', 1);
        $search = request('search');
        $category = request('category');
        $cacheKey = 'book-page-' . $page;

        if ($search != '') {
            $cacheKey .= '-search-' . $search;
        }

        if ($category != '') {
            $cacheKey .= '-category-' . $category;
        }

        $books = Cache::tags(['book-pagination'])->remember($cacheKey, $time, function () {
            return Book::filter(request(['search', 'category']))->with('penerbit', 'kategori', 'penulis')->latest()->paginate(10)->onEachSide(1)->withQueryString();
        });

        $penulis = Cache::remember('penulis', $time, function () {
            return DB::table('penulis')->orderBy('nama_penulis', 'asc')->get();
        });

        $kategori = Cache::remember('kategori', $time, function () {
            return DB::table('kategori')->orderBy('nama_kategori', 'asc')->get();
        });

        $penerbit = Cache::remember('penerbit', $time, function () {
            return DB::table('penerbit')->orderBy('nama_penerbit', 'asc')->get();
        });

        return inertia('Book/Index', [
            'books' => BookResource::collection($books),
            'penulis' => $penulis,
            'kategori' => $kategori,
            'penerbit' => $penerbit,
            'filters' => request()->only('search', 'category')
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
    public function store(StoreBookRequest $request)
    {
        Gate::authorize('isAdmin');

        $validated = $request->validated();

        if (request()->hasFile('cover')) {
            $validated['cover'] = $validated['cover']->store('cover', 'public');
        }

        Book::create($validated);

        return redirect()->route('books.index');
    }

    /**
     * Display the specified resource.
     */
    public function show(Book $book)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Book $book)
    {
        return view('book.edit', [
            'book' => $book,
            'penulis' => DB::table('penulis')->orderBy('nama_penulis', 'asc')->get(),
            'kategori' => DB::table('kategori')->orderBy('nama_kategori', 'asc')->get(),
            'penerbit' => DB::table('penerbit')->orderBy('nama_penerbit', 'asc')->get(),
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateBookRequest $request, Book $book)
    {
        Gate::authorize('isAdmin');

        $validated = $request->validated();

        if ($request->hasFile('cover')) {
            if (Storage::exists($book->cover)) {
                Storage::delete($book->cover);
            }
            $path = Storage::disk('public')->put('cover', $validated['cover']);
            $validated['cover'] = $path;
        }

        $book->update($validated);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Book $book)
    {
        Gate::authorize('isAdmin');

        if (Storage::exists($book->cover)) {
            Storage::delete($book->cover);
        }

        $book->delete();
    }
}
