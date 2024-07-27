<?php

namespace App\Http\Controllers;

use App\Models\Peminjaman;
use Illuminate\Support\Facades\Gate;
use App\Http\Requests\StorePeminjamanRequest;
use App\Http\Requests\UpdatePeminjamanRequest;
use App\Http\Resources\PeminjamanResource;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;

class PeminjamanController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $time = 60 * 60 * 24;
        $page = request('page', 1);
        $name = Gate::allows('isAdmin') ? 'admin' : $request->user()->name;
        $cacheKey = $name .'-peminjaman-page-' . $page;
        $search = request('search');
        $status = request('status');

        if ($search != '') {
            $cacheKey .= '-search-' . $search;
        }

        if ($status != '') {
            $cacheKey .= '-status-' . $status;
        }

        if (Gate::allows('isAdmin')) {
            $peminjaman = Cache::tags(['peminjaman-pagination'])->remember($cacheKey, $time, function () {
                return Peminjaman::filter(request(['search', 'status']))
                    ->select('uuid', 'user_id', 'id_buku', 'tanggal_pinjam', 'tanggal_kembali', 'status_peminjaman', 'approved')
                    ->with('user:id,name', 'book:id,judul')
                    ->latest()
                    ->paginate(10)->onEachSide(1)->withQueryString();
            });
        } else {
            $peminjaman = Cache::tags(['peminjaman-pagination'])->remember($cacheKey, $time, function () {
                return Peminjaman::filter(request(['search', 'status']))
                    ->select('uuid', 'id_buku', 'tanggal_pinjam', 'tanggal_kembali', 'status_peminjaman', 'approved')
                    ->where('user_id', auth()->user()->id)
                    ->with('book:id,judul')
                    ->latest()
                    ->paginate(10)->onEachSide(1)->withQueryString();
            });
        }

        return inertia('Peminjaman/Index', [
            'peminjaman' => PeminjamanResource::collection($peminjaman),
            'status' => Collection::make([
                ['value' => '1', 'status' => 'Dipinjam'],
                ['value' => '0', 'status' => 'Dikembalikan'],
            ]),
            'filters' => request()->only('search', 'status')
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
    public function store(StorePeminjamanRequest $request)
    {
        Gate::denies('isAdmin');

        $request->user()->peminjaman()->create([
            'id_buku' => $request->buku_id,
            'tanggal_pinjam' => now(),
        ]);

        return to_route('peminjaman.index');
    }

    /**
     * Display the specified resource.
     */
    public function show(Peminjaman $peminjaman)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Peminjaman $peminjaman)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdatePeminjamanRequest $request, Peminjaman $peminjaman)
    {
        if(Gate::allows('isAdmin')) {

            $peminjaman->update([
                'tanggal_pinjam' => now(),
                'status_peminjaman' => true,
                'approved' => true,
            ]);
        } else {
            $peminjaman->update([
                'tanggal_kembali' => now(),
                'status_peminjaman' => false,
            ]);
        }

    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Peminjaman $peminjaman)
    {
        //
    }
}
