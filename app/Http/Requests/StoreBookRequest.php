<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreBookRequest extends FormRequest
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
            'penulis_id' => ['required', 'integer', 'exists:penulis,id'],
            'kategori_id' => ['required', 'integer', 'exists:kategori,id'],
            'penerbit_id' => ['required', 'integer', 'exists:penerbit,id'],
            'tahun_terbit' => ['required', 'integer', 'min:1', 'between:1901,2155'],
            'cover' => ['nullable', 'image', 'max:2048', 'mimes:jpg,jpeg,png'],
        ];
    }
}
