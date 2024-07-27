import DangerButton from '@/Components/DangerButton';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import Modal from '@/Components/Modal';
import Pagination from '@/Components/Pagination';
import PrimaryButton from '@/Components/PrimaryButton';
import SecondaryButton from '@/Components/SecondaryButton';
import TextInput from '@/Components/TextInput';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm } from '@inertiajs/react';
import { useEffect, useRef, useState } from 'react';
import { toast } from 'react-toastify';
import { useDebouncedCallback } from 'use-debounce';

export default function Index({ auth, books, penulis, kategori, penerbit, filters }) {
    const [showModal, setShowModal] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [confirmDeletion, setConfirmDeletion] = useState(false);
    const [confirmPeminjaman, setConfirmPeminjaman] = useState(false);
    const [bookId, setBooksId] = useState(null);
    const [createAnother, setCreateAnother] = useState(false);
    const searchRef = useRef(null);

    const { data, setData, get, post, put, delete: destroy, processing, errors, reset, clearErrors } = useForm();

    const openModal = (bookId) => {
        setShowModal(true);
        if (bookId) {
            setEditMode(true);
            setBooksId(bookId);
            const bookData = books.data.find(item => item.uuid === bookId);
            if (bookData) {
                setData({
                    judul: bookData.judul || '',
                    deskripsi: bookData.deskripsi || '',
                    tahun_terbit: bookData.tahun_terbit || '',
                    penulis_id: bookData.penulis.id || '',
                    kategori_id: bookData.kategori.id || '',
                    penerbit_id: bookData.penerbit.id || '',
                    cover: bookData.cover || '',
                });
            }
            console.log(bookData)
        } else {
            setEditMode(false);
            setBooksId(null);
            reset();
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (editMode) {
            put(route('books.update', bookId), {
                preserveScroll: true,
                onSuccess: () => {
                    closeModal();
                    toast.success('Data updated successfully!');
                },
                onError: () => { },
                onFinish: () => { },
            });
        } else {
            post(route('books.store'), {
                preserveScroll: true,
                onSuccess: () => {
                    if (createAnother) {
                        reset();
                        setCreateAnother(false);
                        toast.success('Data created successfully!');
                    } else {
                        closeModal();
                        toast.success('Data created successfully!');
                    }
                },
                onError: () => {
                    createAnother && setCreateAnother(false);
                    toast.error('Something went wrong!')
                },
                onFinish: () => { },
            });
        }
    };

    const closeModal = () => {
        setTimeout(() => {
            setShowModal(false);
            setEditMode(false);
            clearErrors();
        }, 1);
    }

    const confirmDeletionModal = (bookId) => {
        setConfirmDeletion(true);
        setBooksId(bookId);
        const bookData = books.data.find(item => item.uuid === bookId);
        if (bookData) {
            setData('judul', bookData.judul || '');
        }
    }

    const deleteBook = (e) => {
        e.preventDefault();

        destroy(route('books.destroy', bookId), {
            preserveScroll: true,
            onSuccess: () => {
                closeDeletionModal();
                toast.success('Data deleted successfully!');
            },
            onError: () => { },
        });
    }

    const closeDeletionModal = () => {
        setConfirmDeletion(false);
    }

    const confirmPeminjamanModal = (bookId) => {
        setConfirmPeminjaman(true);
        setBooksId(bookId);
        const bookData = books.data.find(item => item.uuid === bookId);
        if (bookData) {
            setData({
                buku_id: bookData.id || '',
            })
        }
    }

    const peminjamanBook = (e) => {
        e.preventDefault();

        post(route('peminjaman.store'), {
            preserveScroll: true,
            onSuccess: () => {
                closePeminjamanModal();
                setTimeout(() => toast.success('Buku telah dipinjam!'), 1);
            },
            onError: () => { },
        });
    }

    const closePeminjamanModal = () => {
        setConfirmPeminjaman(false);
    }

    const handleSearch = useDebouncedCallback((value) => {
        const params = {};

        if (value) {
            params.search = value
        }

        if (filters.category) {
            params.category = filters.category;
        }

        get(
            route('books.index', params),
            {
                preserveState: true,
                replace: true
            }
        );
    }, 300);

    const handleCategoryFilter = useDebouncedCallback((value) => {
        const params = {};
        if (filters.search) {
            params.search = filters.search;
        }

        if (value) {
            params.category = value;
        }

        get(
            route('books.index', params),
            {
                preserveState: true,
                replace: true
            }
        );
    }, 100);

    useEffect(() => {
        searchRef.current?.focus();
        if (books.meta.current_page === 1) {
            const url = new URL(window.location.href);
            url.searchParams.delete('page');
            window.history.replaceState({}, '', url);
        }
    }, [books.meta.current_page]);

    const number = books.meta.links.length;

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <div className='flex justify-between items-center'>
                    <h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">Buku</h2>
                    <button className="btn btn-primary" onClick={() => openModal()}>Tambah</button>
                </div>
            }
        >
            <Head title="Buku" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="flex flex-col my-3">
                            <div className='flex justify-end py-5 px-5 gap-10'>
                                <select
                                    className="border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 focus:border-indigo-500 dark:focus:border-indigo-600 focus:ring-indigo-500 dark:focus:ring-indigo-600 rounded-md shadow-sm"
                                    name="category"
                                    defaultValue={filters.category || 'default'}
                                    onChange={(e) => handleCategoryFilter(e.target.value)}
                                >
                                    <option value={''}>Pick one</option>
                                    {kategori.map((item, index) => (
                                        <option key={index} value={item.nama_kategori}>{item.nama_kategori}</option>
                                    ))}
                                </select>

                                <TextInput
                                    id="search"
                                    type="text"
                                    className="w-1/4"
                                    placeholder="Search"
                                    defaultValue={filters.search || ''}
                                    onChange={(e) => handleSearch(e.target.value)}
                                    ref={searchRef}
                                />
                            </div>
                            <div className="overflow-x-auto p-5">
                                <table className="table table-zebra">
                                    <thead>
                                        <tr>
                                            <th>#</th>
                                            <th>Judul</th>
                                            <th>Kategori</th>
                                            <th>Tahun</th>
                                            <th>Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {books.data.length > 0 && books.data.map((item, index) => (
                                            <tr key={index}>
                                                <td className='w-20'>{
                                                    number > 1 ? (index + 1) + (number * (books.meta.current_page - 1)) : index + 1
                                                }</td>
                                                <td className='w-96'>{item.judul}</td>
                                                <td className='w-48'>{item.kategori.nama_kategori}</td>
                                                <td className='w-20'>{item.tahun_terbit}</td>
                                                <td>
                                                    <div className='flex'>
                                                        {auth.user.is_admin ? (
                                                            <>
                                                                <div className='mr-[-20px]'>
                                                                    <SecondaryButton className='' onClick={() => openModal(item.uuid)}>Edit</SecondaryButton>
                                                                </div>
                                                                <div className='ml-[40px]'>
                                                                    <DangerButton onClick={() => confirmDeletionModal(item.uuid)}>Delete</DangerButton>
                                                                </div>
                                                            </>
                                                        ) : (
                                                            <div className='mr-[-20px]'>
                                                                <SecondaryButton className='' onClick={() => confirmPeminjamanModal(item.uuid)}>Pinjam</SecondaryButton>
                                                            </div>
                                                        )}
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                                <Pagination links={books.meta.links} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <Modal show={showModal} onClose={closeModal}>
                <form onSubmit={handleSubmit} className="p-4 sm:p-8" encType=''>
                    <div>
                        <InputLabel
                            htmlFor="judul"
                            value="Judul"
                        />

                        <TextInput
                            id="judul"
                            type="text"
                            className="mt-1 block w-full"
                            placeholder="Judul"
                            isFocused={true}
                            value={data.judul || ''}
                            onChange={(e) => setData('judul', e.target.value)}
                        />

                        <InputError message={errors.judul} className="mt-2" />
                    </div>

                    <div className='mt-4'>
                        <InputLabel
                            htmlFor="deskripsi"
                            value="Deskripsi"
                        />

                        <textarea
                            className="w-full border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 focus:border-indigo-500 dark:focus:border-indigo-600 focus:ring-indigo-500 dark:focus:ring-indigo-600 rounded-md shadow-sm" name="deskripsi" id="deskripsi" placeholder='Deskripsi'
                            value={data.deskripsi || ''}
                            onChange={(e) => setData('deskripsi', e.target.value)}></textarea>

                        <InputError message={errors.deskripsi} className="mt-2" />
                    </div>

                    <div className="grid grid-cols-2 gap-4 mt-4">
                        <div>
                            <InputLabel
                                htmlFor="tahun"
                                value="Tahun Terbit"
                            />

                            <TextInput
                                id="tahun_terbit"
                                type="number"
                                className="mt-1 block w-full"
                                placeholder="Tahun Terbit"
                                value={data.tahun_terbit || ''}
                                onChange={(e) => setData('tahun_terbit', e.target.value)}
                            />

                            <InputError message={errors.tahun_terbit} className="mt-2" />
                        </div>

                        <div>
                            <InputLabel
                                htmlFor="penulis"
                                value="Penulis"
                            />

                            <select
                                className="w-full border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 focus:border-indigo-500 dark:focus:border-indigo-600 focus:ring-indigo-500 dark:focus:ring-indigo-600 rounded-md shadow-sm"
                                name="penulis_id"
                                onChange={(e) => setData('penulis_id', e.target.value)}
                                // defaultValue={'default'}
                                value={data.penulis_id || ''}
                            >
                                <option disabled value={'default'}>Pick one</option>
                                {penulis.map((item, index) => (
                                    <option key={index} value={item.id}>{item.nama_penulis}</option>
                                ))}
                            </select>

                            <InputError message={errors.penulis_id} className="mt-2" />
                        </div>

                        <div>
                            <InputLabel
                                htmlFor="kategori"
                                value="Kategori"
                            />
                            <select
                                className="w-full border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 focus:border-indigo-500 dark:focus:border-indigo-600 focus:ring-indigo-500 dark:focus:ring-indigo-600 rounded-md shadow-sm"
                                name="kategori_id"
                                onChange={(e) => setData('kategori_id', e.target.value)}
                                // defaultValue={'default'}
                                value={data.kategori_id || ''}
                            >
                                <option disabled value={'default'}>Pick one</option>
                                {kategori.map((item, index) => (
                                    <option key={index} value={item.id}>{item.nama_kategori}</option>
                                ))}
                            </select>
                            <InputError message={errors.kategori_id} className="mt-2" />
                        </div>

                        <div>
                            <InputLabel
                                htmlFor="penerbit"
                                value="Penerbit"
                            />
                            <select
                                className="w-full border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 focus:border-indigo-500 dark:focus:border-indigo-600 focus:ring-indigo-500 dark:focus:ring-indigo-600 rounded-md shadow-sm"
                                name="penerbit_id"
                                onChange={(e) => setData('penerbit_id', e.target.value)}
                                // defaultValue={'default'}
                                value={data.penerbit_id || ''}
                            >
                                <option disabled value={'default'}>Pick one</option>
                                {penerbit.map((item, index) => (
                                    <option key={index} value={item.id}>{item.nama_penerbit}</option>
                                ))}
                            </select>
                            <InputError message={errors.penerbit_id} className="mt-2" />
                        </div>
                    </div>

                    <div className='w-full max-w-xs mt-4'>
                        <InputLabel
                            htmlFor="cover"
                            value="Cover"
                        />

                        {editMode && (
                            <img src={data.cover} alt="cover" className="w-48 h-32  rounded-lg" />
                        )}

                        <TextInput
                            id="cover"
                            type="file"
                            className="file-input file-input-bordered"
                            onChange={(e) => setData('cover', e.target.files[0])}
                        />

                        <InputError message={errors.cover} className="mt-2" />
                    </div>


                    <div className="mt-4 text-right">
                        <button type="submit" className="btn btn-primary mr-2" disabled={processing}>
                            {editMode ? 'Edit' : 'Create'}
                        </button>
                        {!editMode && (
                            <button
                                type="submit"
                                className="btn btn-primary"
                                onClick={() => setCreateAnother(true)}
                                disabled={processing}
                            >
                                Create & Create Another
                            </button>
                        )}
                    </div>
                </form>
            </Modal>

            <Modal show={confirmDeletion} onClose={closeDeletionModal}>
                <form onSubmit={deleteBook} className="p-6">
                    <h2 className="text-lg font-medium text-gray-900 dark:text-gray-100">
                        Are you sure you want to delete {data.judul}?
                    </h2>

                    <div className="mt-6 flex justify-end">
                        <SecondaryButton onClick={closeDeletionModal}>Cancel</SecondaryButton>

                        <DangerButton className="ms-3" disabled={processing}>
                            Delete
                        </DangerButton>
                    </div>
                </form>
            </Modal>

            <Modal show={confirmPeminjaman} onClose={closePeminjamanModal}>
                <form onSubmit={peminjamanBook} className="p-6">
                    <input type="hidden" value={data.id_buku} />

                    <h2 className="text-lg font-medium text-gray-900 dark:text-gray-100">
                        Are you sure you want to pinjam {data.judul}?
                    </h2>

                    <div className="mt-6 flex justify-end">
                        <SecondaryButton onClick={closePeminjamanModal}>Cancel</SecondaryButton>

                        <PrimaryButton className="ms-3" disabled={processing}>
                            Pinjam
                        </PrimaryButton>
                    </div>
                </form>
            </Modal>
        </AuthenticatedLayout>
    );
}
