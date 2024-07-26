<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateBookRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'judul' => ['required', 'string', 'max:100'],
            'deskripsi' => ['nullable', 'string'],
            'id_penulis' => ['required', 'integer', 'exists:penulis,id'],
            'id_kategori' => ['required', 'integer', 'exists:kategori,id'],
            'id_penerbit' => ['required', 'integer', 'exists:penerbit,id'],
            'tahun_terbit' => ['required', 'integer', 'min:1'],
            // 'cover' => ['nullable', 'image', 'max:2048', 'mimes:jpg,jpeg,png'],
        ];
    }
}
