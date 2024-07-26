<?php

use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('peminjaman', function (Blueprint $table) {
            $table->id();
            $table->uuid('uuid')->unique()->default(DB::raw('(UUID())'));
            $table->foreignId('user_id')->constrained('users')->cascadeOnUpdate();
            $table->foreignId('id_buku')->constrained('books')->cascadeOnUpdate();
            $table->dateTime('tanggal_pinjam');
            $table->dateTime('tanggal_kembali')->nullable();
            $table->boolean('approved')->default(false);
            $table->boolean('status_peminjaman')->default(false);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('peminjaman');
    }
};
