import InputError from "@/Components/InputError";
import InputLabel from "@/Components/InputLabel";
import TextInput from "@/Components/TextInput";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, useForm } from "@inertiajs/react";

export default function Create({ auth }) {
    const { data, setData, post, errors, reset } = useForm({
        nama: "",
    });

    const onSubmit = (e) => {
        e.preventDefault();

        post(route('penulis.store'));
    }

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">Tambah Penulis</h2>}
        >
            <Head title="Tambah Penulis" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
                        <form onSubmit={onSubmit} className="p-4 sm:p-8">
                            <div>
                                <InputLabel
                                    htmlFor="nama_penulis"
                                    value="Nama Penulis"
                                />

                                <TextInput
                                    id="nama_penulis"
                                    type="text"
                                    className="mt-1 block w-full"
                                    placeholder="Nama Penulis"
                                    isFocused={true}
                                    value={data.nama_penulis}
                                    onChange={(e) => setData('nama_penulis', e.target.value)}
                                />

                                <InputError message={errors.nama_penulis} className="mt-2" />
                            </div>

                            <div className="mt-4 text-right">
                                <button type="submit" className="btn btn-success">
                                    Tambah
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
