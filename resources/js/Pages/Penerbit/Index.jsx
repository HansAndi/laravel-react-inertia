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
import { toast } from 'react-toastify';
import { useDebouncedCallback } from 'use-debounce';

export default function Index({ auth, penerbit, filters }) {
    const [showModal, setShowModal] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [confirmDeletion, setConfirmDeletion] = useState(false);
    const [penerbitId, setPenerbitId] = useState(null);
    const [createAnother, setCreateAnother] = useState(false);
    const searchRef = useRef(null);

    const { data, setData, get, post, put, delete: destroy, processing, errors, reset, clearErrors } = useForm();

    const openModal = (penerbitId = null) => {
        setShowModal(true);
        if (penerbitId) {
            setEditMode(true);
            setPenerbitId(penerbitId);
            const penerbitData = penerbit.data.find(item => item.uuid === penerbitId);
            if (penerbitData) {
                setData('nama_penerbit', penerbitData.nama_penerbit || '');
            }
        } else {
            setEditMode(false);
            setPenerbitId(null);
            reset();
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (editMode) {
            put(route('penerbit.update', penerbitId), {
                preserveScroll: true,
                onSuccess: () => {
                    closeModal();
                    toast.success('Data updated successfully!');
                },
                onError: () => { },
                onFinish: () => { },
            });
        } else {
            post(route('penerbit.store'), {
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

    const confirmDeletionModal = (penerbitId) => {
        setConfirmDeletion(true);
        setPenerbitId(penerbitId);
        const penerbitData = penerbit.data.find(item => item.uuid === penerbitId);
        if (penerbitData) {
            setData('nama_penerbit', penerbitData.nama_penerbit || '');
        }
    }

    const deletePenerbit = (e) => {
        e.preventDefault();

        destroy(route('penerbit.destroy', penerbitId), {
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
        get(
            route('penerbit.index', { search: value}),
            {
                preserveState: true,
                replace: true,
            }
        );
    }, 300);

    useEffect(() => {
        searchRef.current?.focus();
        if (penerbit.meta.current_page === 1) {
            const url = new URL(window.location.href);
            url.searchParams.delete('page');
            window.history.replaceState({}, '', url);
        }
    }, [penerbit.meta.current_page]);


    const number = penerbit.meta.links.length;

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <div className="text-right">
                    <button className="btn btn-primary" onClick={() => openModal()}>Tambah</button>
                </div>
            }
        >
            <Head title="Penerbit" />

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
                            <div className="overflow-x-auto p-5 px-5">
                                <table className="table table-zebra">
                                    <thead>
                                        <tr>
                                            <th>#</th>
                                            <th>Nama Penerbit</th>
                                            <th>Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {penerbit.data.length > 0 && penerbit.data.map((item, index) => (
                                            <tr key={item.id}>
                                                <td>{
                                                    number > 1 ? (index + 1) + (number * (penerbit.meta.current_page - 1)) : index + 1
                                                }</td>
                                                <td className='w-96'>{item.nama_penerbit}</td>
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
                                <Pagination links={penerbit.meta.links} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <Modal show={showModal} onClose={closeModal}>
                <form onSubmit={handleSubmit} className="p-4 sm:p-8">
                    <div>
                        <InputLabel
                            htmlFor="nama_penerbit"
                            value="Nama Penerbit"
                        />

                        <TextInput
                            id="nama_penerbit"
                            type="text"
                            className="mt-1 block w-full"
                            placeholder="Nama Penerbit"
                            isFocused={true}
                            value={data.nama_penerbit || ''}
                            onChange={(e) => setData('nama_penerbit', e.target.value)}
                        />

                        <InputError message={errors.nama_penerbit} className="mt-2" />
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
                <form onSubmit={deletePenerbit} className="p-6">
                    <h2 className="text-lg font-medium text-gray-900 dark:text-gray-100">
                        Are you sure you want to delete {data.nama_penerbit}?
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
