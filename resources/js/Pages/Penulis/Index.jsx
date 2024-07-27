import DangerButton from '@/Components/DangerButton';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import Modal from '@/Components/Modal';
import Pagination from '@/Components/Pagination';
import SecondaryButton from '@/Components/SecondaryButton';
import TextInput from '@/Components/TextInput';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm } from '@inertiajs/react';
import { useEffect, useRef, useState } from 'react';
import { useDebouncedCallback } from 'use-debounce';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';

export default function Index({ auth, penulis, filters }) {
    const [showModal, setShowModal] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [confirmDeletion, setConfirmDeletion] = useState(false);
    const [penulisId, setPenulisId] = useState(null);
    const [createAnother, setCreateAnother] = useState(false);
    const searchRef = useRef(null);

    const { data, setData, get, post, put, delete: destroy, processing, errors, reset, clearErrors } = useForm();

    const openModal = (penulisId = null) => {
        setShowModal(true);
        if (penulisId) {
            setEditMode(true);
            setPenulisId(penulisId);
            const penulisData = penulis.data.find(item => item.uuid === penulisId);
            if (penulisData) {
                setData('nama_penulis', penulisData.nama_penulis || '');
            }

            // axios.get(route('penulis.show', penulisId))
            //     .then(res => {
            //         setData('nama_penulis', res.data.data.nama_penulis);
            //     })
        } else {
            setEditMode(false);
            setPenulisId(null);
            reset();
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (editMode) {
            put(route('penulis.update', penulisId), {
                preserveScroll: true,
                onSuccess: () => {
                    closeModal();
                    toast.success('Data updated successfully!');
                },
                onError: () => { },
                onFinish: () => { },
            });
        } else {
            post(route('penulis.store'), {
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
        setShowModal(false);
        reset();
        clearErrors();
    }

    const confirmDeletionModal = (penulisId) => {
        setConfirmDeletion(true);
        setPenulisId(penulisId);
        const penulisData = penulis.data.find(item => item.uuid === penulisId);
        if (penulisData) {
            setData('nama_penulis', penulisData.nama_penulis || '');
        }
    }

    const deletePenulis = (e) => {
        e.preventDefault();

        destroy(route('penulis.destroy', penulisId), {
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

    const handleSearch = useDebouncedCallback((value) => {
        console.log(value);
        get(
            route('penulis.index', { search: value }),
            {
                preserveState: true,
                replace: true,
            }
        );
    }, 300);

    useEffect(() => {
        searchRef.current?.focus();
        if (penulis.meta.current_page === 1) {
            const url = new URL(window.location.href);
            url.searchParams.delete('page');
            window.history.replaceState({}, '', url);
        }
    }, [penulis.meta.current_page]);

    const number = penulis.meta.links.length;

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <div className='flex justify-between items-center'>
                    <h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">Penulis</h2>
                    <button className="btn btn-primary" onClick={() => openModal()}>Tambah</button>
                </div>
            }
        >
            <Head title="Penulis" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="flex flex-col my-3">
                            <div className='flex justify-end py-5 px-5'>
                                <TextInput
                                    id="search"
                                    type="text"
                                    className="mt-1 w-1/4"
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
                                            <th>Nama Penulis</th>
                                            <th>Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {penulis.data.length > 0 && penulis.data.map((item, index) => (
                                            <tr key={index}>
                                                <td>{
                                                    number > 1 ? (index + 1) + (number * (penulis.meta.current_page - 1)) : index + 1
                                                }</td>
                                                <td className='w-96'>{item.nama_penulis}</td>
                                                <td>
                                                    <div className='flex'>
                                                        <div className='mr-[-20px]'>
                                                            <SecondaryButton className='' onClick={() => openModal(item.uuid)}>Edit</SecondaryButton>
                                                        </div>
                                                        <div className='ml-[40px]'>
                                                            <DangerButton onClick={() => confirmDeletionModal(item.uuid)}>Delete</DangerButton>
                                                        </div>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                                <Pagination links={penulis.meta.links} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <Modal show={showModal} onClose={closeModal}>
                <form onSubmit={handleSubmit} className="p-4 sm:p-8">
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
                            value={data.nama_penulis || ''}
                            onChange={(e) => setData('nama_penulis', e.target.value)}
                        />

                        <InputError message={errors.nama_penulis} className="mt-2" />
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
                <form onSubmit={deletePenulis} className="p-6">
                    <h2 className="text-lg font-medium text-gray-900 dark:text-gray-100">
                        Are you sure you want to delete {data.nama_penulis}?
                    </h2>


                    <div className="mt-6 flex justify-end">
                        <SecondaryButton onClick={closeDeletionModal}>Cancel</SecondaryButton>

                        <DangerButton className="ms-3" disabled={processing}>
                            Delete
                        </DangerButton>
                    </div>
                </form>
            </Modal>
        </AuthenticatedLayout>
    );
}
