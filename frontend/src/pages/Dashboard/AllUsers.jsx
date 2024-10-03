import React, { useEffect, useState } from 'react';
import Layout from '../../layout/Layout';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { getAllUsers } from '../../redux/Slices/statsSlice';
import { BsCollectionPlayFill, BsTrash } from 'react-icons/bs';
import { LiaUserEditSolid } from 'react-icons/lia';
import { deleteUserByAdmin } from '../../redux/Slices/AuthSlice';

const AllUsers = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState({
        id: "",
        avatar: null,
        fullName: "",
    }); // State to hold selected user
    const usersList = useSelector((state) => state?.stats?.allUsers);

    useEffect(() => {
        dispatch(getAllUsers());
    }, [dispatch]);

    // Function to toggle the modal and set the selected image
    // Function to toggle the modal for either image or confirmation based on the argument passed
    const toggleModal = (arg) => {
        if (typeof arg === 'string' && arg.includes('http')) {
            // If the argument is a URL (for enlarging image)
            setSelectedUser({
                ...selectedUser,
                avatar: arg,
            });
            setIsModalOpen(!isModalOpen);
        } else if (typeof arg === 'string') {
            // If the argument is a userId (for confirmation modal)
            setSelectedUser({
                id: arg,
                avatar: null,
                fullName: "",
            });
            setIsConfirmModalOpen(!isConfirmModalOpen);
        }
    };


    const handleUpdateUser = (userId) => {
        // console.log(`Update user: ${userId}`)
        
    }
    const handleUserDelete = async (userId) => {
        // console.log(`Delete user: ${userId}`)
        const response = await dispatch(deleteUserByAdmin(userId));
        if (response?.payload?.success)
            await dispatch(getAllUsers());
        setIsConfirmModalOpen(false);
    }
    return (
        <Layout>
            <div className="min-h-[80vh]  flex flex-col flex-wrap gap-10 text-white">
                <h1 className="text-center text-3xl font-semibold text-yellow-500">
                    All Users List
                </h1>
                <div className="mx-[10%] w-[80%] self-center flex flex-col items-center justify-center gap-10 mb-10">
                    <div className="overflow-x-auto w-full">
                        <table className="table w-full">
                            <thead className='text-l font-bold'>
                                <tr>
                                    <th>SL No.</th>
                                    <th>Profile Photo</th>
                                    <th>Full Name</th>
                                    <th>Email</th>
                                    <th>Role</th>
                                    <th>Subscription</th>
                                    <th>Action</th>
                                </tr>
                            </thead>

                            <tbody>
                                {usersList?.map((element, index) => {
                                    return (
                                        <tr key={element?._id}>
                                            <td>{index + 1}</td>
                                            <td>
                                                <div className="w-10 rounded-full cursor-pointer" onClick={() => toggleModal(element?.avatar?.secure_url)}>
                                                    <img
                                                        alt="User avatar"
                                                        src={element?.avatar?.secure_url}
                                                    />
                                                </div>
                                            </td>
                                            <td>{element?.fullName}</td>
                                            <td>{element?.email}</td>
                                            <td>{element?.role}</td>
                                            <td>
                                                <span className={`rounded-full text-sm ${(element?.subscription?.status) === 'active' ? 'px-2 py-1 bg-green-700 text-white text-l' : 'px-2 py-1 text-yellow-500 text-l'} `}>
                                                    {element?.subscription?.status}
                                                </span>
                                            </td>
                                            <td className="flex items-center gap-4">
                                                {/* to Update the Users */}
                                                <button
                                                    onClick={() => handleUpdateUser(element?._id)}
                                                    className="bg-green-500 hover:bg-green-600 transition-all ease-in-out duration-30 text-xl py-2 px-4 rounded-md font-bold max-md:px-2 max-md:py-1 max-md:texl-sm"
                                                >
                                                    <LiaUserEditSolid />
                                                </button>
                                                {/* to delete the Users */}
                                                <button
                                                    onClick={() => toggleModal(element?._id)}
                                                    className="bg-red-500 hover:bg-red-600 transition-all ease-in-out duration-30 text-xl py-2 px-4 rounded-md font-bold max-md:px-2 max-md:py-1 max-md:texl-sm"
                                                >
                                                    <BsTrash />
                                                </button>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                    {/* Modal to show the enlarged image */}
                    {isModalOpen && (
                        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" onClick={() => setIsModalOpen(!isModalOpen)}>
                            <div className="relative">
                                <button
                                    className="absolute top-2 right-2 text-white text-2xl"
                                    onClick={() => setIsModalOpen(!isModalOpen)}
                                >
                                    &times;
                                </button>
                                <img
                                    className="w-[70vw] h-[70vh] object-contain"
                                    src={selectedUser.avatar}
                                    alt="Enlarged Profile"
                                />
                            </div>
                        </div>
                    )}

                    {/* Confirmation Modal */}
                    {
                        isConfirmModalOpen && (
                            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                                <div className="w-full max-w-md p-6 bg-gray-900 rounded-md shadow-md">
                                    <div className="flex items-center justify-between">
                                        <h3 className="text-xl font-bold">Delete User</h3>
                                        <button
                                            className="text-xl font-bold text-red-500 hover:text-red-600 transition-all ease-in-out duration-30"
                                            onClick={() => setIsConfirmModalOpen(!isConfirmModalOpen)}
                                        >
                                            &times;
                                        </button>
                                    </div>
                                    <p className="mt-4 text-gray-300 ">
                                        Are you sure you want to delete this user?
                                    </p>
                                    <div className="flex items-center mt-4 w-full gap-4">
                                        <button
                                            className="w-1/2 btn btn-error btn-sm transition-all ease-in-out duration-30"
                                            onClick={() => handleUserDelete(selectedUser.id)}
                                        >
                                            Delete
                                        </button>
                                        <button
                                            className=" w-1/2 btn btn-accent btn-sm rounded-md transition-all ease-in-out duration-30"
                                            onClick={() => toggleModal(selectedUser.id)}
                                        >
                                            Cancel
                                        </button>

                                    </div>
                                </div>
                            </div>
                        )

                    }
                </div>
            </div>
        </Layout>
    );
};

export default AllUsers;
