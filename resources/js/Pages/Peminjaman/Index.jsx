import DangerButton from '@/Components/DangerButton';
import Modal from '@/Components/Modal';
import Pagination from '@/Components/Pagination';
import SecondaryButton from '@/Components/SecondaryButton';
import TextInput from '@/Components/TextInput';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm } from '@inertiajs/react';
import { useEffect, useRef, useState } from 'react';
import { toast } from 'react-toastify';
import { useDebouncedCallback } from 'use-debounce';

export default function Index({ auth, peminjaman, status, filters }) {
    const [showModal, setShowModal] = useState(false);
    const [peminjamanId, setPeminjamanId] = useState(null);
    const searchRef = useRef(null);

    const { data, setData, get, put, processing } = useForm();

    const openModal = (peminjamanId) => {
        setShowModal(true);
        setPeminjamanId(peminjamanId);

        const peminjamanData = peminjaman.data.find(item => item.uuid === peminjamanId);
        if (peminjamanData) {
            setData('judul', peminjamanData.judul || '');
        }
    }

    const handleSubmit = (e) => {
        e.preventDefault();

        put(route('peminjaman.update', peminjamanId), {
            preserveScroll: true,
            onSuccess: () => {
                closeModal();
                if (auth.user.is_admin) {
                    toast.success('Peminjaman approved successfully!');
                } else {
                    toast.success('Book returned successfully!');
                }
            },
            onError: () => { },
        });
    }

    const closeModal = () => {
        setShowModal(false);
    }

    const handleSearch = useDebouncedCallback((value) => {
        const params = {};
        if (value) {
            params.search = value;
        }
        if (filters.status) {
            params.status = filters.status;
        }
        get(
            route('peminjaman.index', params),
            {
                preserveState: true,
                replace: true,
            }
        );
    }, 300);

    const handleStatusFilter = useDebouncedCallback((value) => {
        const params = {};
        if (filters.search) {
            params.search = filters.search;
        }
        if (value) {
            params.status = value;
        }
        get(
            route('peminjaman.index', params),
            {
                preserveState: true,
                replace: true,
            }
        );
    }, 100);

    useEffect(() => {
        searchRef.current.focus();
        if (peminjaman.meta.current_page === 1) {
            const url = new URL(window.location.href);
            url.searchParams.delete('page');
            window.history.replaceState({}, '', url);
        }
    }, [peminjaman.meta.current_page]);

    const number = peminjaman.meta.links.length;
    console.log(peminjaman)

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <div className="text-right">
                    <button className="btn btn-primary" onClick={() => openModal()}>Tambah</button>
                </div>
            }
        >
            <Head title="Peminjaman" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="flex flex-col my-3">
                            <div className='flex justify-end py-5 px-5 gap-10'>
                                <select
                                    className="border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 focus:border-indigo-500 dark:focus:border-indigo-600 focus:ring-indigo-500 dark:focus:ring-indigo-600 rounded-md shadow-sm"
                                    name="status"
                                    defaultValue={filters.status || 'default'}
                                    onChange={(e) => handleStatusFilter(e.target.value)}
                                >
                                    <option value={'default'}>Pick one</option>
                                    {status.map((item, index) => (
                                        <option key={index} value={item.value}>{item.status}</option>
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
                                <table className="table table-zebra text-center">
                                    <thead>
                                        <tr>
                                            <th>#</th>
                                            {auth.user.is_admin ? (
                                                <th>User</th>
                                            ) : null}
                                            <th>Judul</th>
                                            <th>Tanggal Pinjam</th>
                                            <th>Tanggal Kembali</th>
                                            <th>Status Peminjaman</th>
                                            <th>Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {peminjaman.data.length > 0 && peminjaman.data.map((item, index) => (
                                            <tr key={index}>
                                                <td className='w-10'>{
                                                    number > 1 ? (index + 1) + (number * (peminjaman.meta.current_page - 1)) : index + 1
                                                }</td>
                                                {auth.user.is_admin ? (
                                                    <td className='w-48'>{item.user.name}</td>
                                                ) : null}
                                                <td className="w-52">{`${item.book.judul.split(' ').slice(0, 4).join(' ')}` + (item.book.judul.split(' ').length > 4 ? '...' : '')}</td>
                                                <td className=''>{item.tanggal_pinjam}</td>
                                                <td className={`${item.tanggal_kembali ? 'show' : ''}`} title={item.tanggal_kembali_full}>{item.tanggal_kembali}</td>
                                                <td>
                                                    {item.status_peminjaman && item.approved ? (
                                                        <div className="flex justify-center">
                                                            <span className="badge badge-error">On Loan</span>
                                                        </div>
                                                    ) : !item.status_peminjaman && !item.approved ? (
                                                        <span className="badge badge-warning">Pending</span>
                                                    ) : (
                                                        <span className="badge badge-success">Returned</span>
                                                    )}
                                                </td>
                                                <td>
                                                    <div className='flex'>
                                                        <div className='mr-[-20px]'>
                                                            {auth.user.is_admin && !item.approved ? (
                                                                <SecondaryButton className='' onClick={() => openModal(item.uuid)}>Approve</SecondaryButton>
                                                            ) : (!auth.user.is_admin && item.status_peminjaman && item.approved) ? (
                                                                <SecondaryButton className='' onClick={() => openModal(item.uuid)}>Return</SecondaryButton>
                                                            ) : null}
                                                        </div>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                                <Pagination links={peminjaman.meta.links} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <Modal show={showModal} onClose={closeModal}>
                <form onSubmit={handleSubmit} className="p-6">
                    <h2 className="text-lg font-medium text-gray-900 dark:text-gray-100">
                        {auth.user.is_admin ? 'Approve peminjaman' : 'Return buku'}  {data.judul}?
                    </h2>

                    <div className="mt-6 flex justify-end">
                        <SecondaryButton onClick={closeModal}>Cancel</SecondaryButton>

                        <DangerButton className="ms-3" disabled={processing}>
                            {auth.user.is_admin ? 'Approve' : 'Return'}
                        </DangerButton>
                    </div>
                </form>
            </Modal>
        </AuthenticatedLayout>
    );
}
