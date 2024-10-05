import React, { useEffect, useState } from 'react';
import Layout from '../../layout/Layout';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { getAllUsers } from '../../redux/Slices/statsSlice';
import { BsCollectionPlayFill, BsPersonCircle, BsTrash } from 'react-icons/bs';
import { LiaUserEditSolid } from 'react-icons/lia';
import { deleteUserByAdmin, updateUserProfileByAdmin } from '../../redux/Slices/AuthSlice';
import { TiTick } from 'react-icons/ti';
import { ImCross } from 'react-icons/im';
import { FaCamera } from 'react-icons/fa';
import toast from 'react-hot-toast';
import { IoMdArrowDropdown } from 'react-icons/io';

const AllUsers = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
    const [isEditable, setIsEditable] = useState(false);
    const [selectedUser, setSelectedUser] = useState({
        id: "",
        avatar: null,
        fullName: "",
        previewImage: "",
        user: []
    }); // State to hold selected user
    const usersList = useSelector((state) => state?.stats?.allUsers);

    useEffect(() => {
        dispatch(getAllUsers());
    }, [dispatch]);

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

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setSelectedUser({
            ...selectedUser,
            [name]: value,
        });
    }
    const getImage = (e) => {
        e.preventDefault();
        const uploadedImage = e.target.files[0];
        if (uploadedImage) {
            const fileReader = new FileReader();
            fileReader.readAsDataURL(uploadedImage);
            fileReader.addEventListener("load", function () {
                setSelectedUser({
                    ...selectedUser,
                    avatar: uploadedImage,
                    previewImage: this.result
                });
            });
        }
    };

    const toggleEditMode = (user) => {
        if (user.role === 'ADMIN') {
            toast.error("You are not allowed to update this user as this role is admin");
            return;
        }

        setSelectedUser({
            ...selectedUser,
            user: user,
            id: user._id,
            fullName: user.fullName,
            previewImage: user.avatar?.secure_url,
        });
        setIsEditable(!isEditable);
    }

    const handleUpdateUser = async (userId) => {
        if (selectedUser.fullName.length < 5) {
            toast.error("Full Name must be at least 5 characters");
            return;
        }

        const payload = {
            fullName: selectedUser.fullName,
            avatar: selectedUser.avatar,
        }

        const res = await dispatch(updateUserProfileByAdmin([selectedUser.id, payload]));
        if (res?.payload?.success)
            await dispatch(getAllUsers());
        setIsEditable(false);

    }
    const handleUserDelete = async (userId) => {
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
                    <div className="w-full flex gap-4 max-md:flex-col">
                        <div className='w-1/3 max-md:w-full'>
                            <input type="text" placeholder='Search user by name...' className='input input-bordered border-white px-2 py-2 bg-transparent w-full' />
                        </div>
                        <div className="relative w-1/3 max-md:w-full">
                            <select name="users" id="users" className="appearance-none input input-bordered border-white px-2 py-2 bg-transparent w-full cursor-pointer">
                                <option value="all-user" className='bg-gray-900'>All User</option>
                                <option value="active-user" className='bg-gray-900'>Active User</option>
                                <option value="enrolled-user" className='bg-gray-900'>Enrolled User</option>
                                <option value="inactive-user" className='bg-gray-900'>Inactive User</option>
                            </select>
                            <span className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                                <IoMdArrowDropdown />
                            </span>
                        </div>
                        <div className='w-1/3 flex gap-4 max-md:w-full'>
                            <button className='btn btn-secondary btn-outline w-1/2'>Clear Filter</button>
                            <button className='btn btn-primary btn-outline w-1/2'>Export</button>
                        </div>
                    </div>

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
                                                {
                                                    isEditable && (selectedUser?.id === element._id) ?
                                                        (
                                                            <div>
                                                                <figure>
                                                                    <label htmlFor="image_uploads" className="cursor-pointer flex relative">
                                                                        {selectedUser.previewImage ? (
                                                                            <img
                                                                                className="w-10 object-cover rounded-full border-2 border-white"
                                                                                src={selectedUser.previewImage}
                                                                                alt="Profile"
                                                                            />
                                                                        ) : (
                                                                            <BsPersonCircle className="w-10 object-cover rounded-full border-2 border-white" />
                                                                        )}

                                                                        {/* Camera Icon Overlay */}
                                                                        <div className="absolute bg-gray-800 p-1 rounded-full text-white top-6 left-8">
                                                                            <FaCamera />
                                                                        </div>
                                                                    </label>
                                                                    <input
                                                                        onChange={getImage}
                                                                        className="hidden"
                                                                        type="file"
                                                                        name="image_uploads"
                                                                        id="image_uploads"
                                                                        accept=".jpg, .jpeg, .png, .svg"
                                                                    />
                                                                </figure>
                                                            </div>
                                                        )
                                                        :
                                                        (
                                                            <div className="w-10 rounded-full cursor-pointer" onClick={() => toggleModal(element?.avatar?.secure_url)}>
                                                                <img
                                                                    alt="User avatar"
                                                                    src={element?.avatar?.secure_url}
                                                                />
                                                            </div>
                                                        )
                                                }

                                            </td>
                                            <td>
                                                {
                                                    isEditable && (selectedUser?.id === element._id) ? (
                                                        <input
                                                            type="text"
                                                            name="fullName"
                                                            id="fullName"
                                                            value={selectedUser.fullName}
                                                            onChange={handleInputChange}
                                                            className="input input-bordered w-full max-w-xs"
                                                        />
                                                    ) : (
                                                        element?.fullName?.split(' ')
                                                            .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
                                                            .join(' ')
                                                    )
                                                }
                                            </td>
                                            <td>{element?.email}</td>
                                            <td>{element?.role}</td>
                                            <td>
                                                <span className={`rounded-full text-sm ${(element?.subscription?.status) === 'active' ? 'px-2 py-1 bg-green-700 text-white text-l' : 'px-2 py-1 text-yellow-500 text-l'} `}>
                                                    {element?.subscription?.status}
                                                </span>
                                            </td>
                                            {
                                                element?.role !== 'ADMIN' ?
                                                    <td className="flex items-center gap-4">
                                                        {
                                                            isEditable && (selectedUser?.id === element._id) ?
                                                                (
                                                                    <>
                                                                        {/* Tick button to confirm the update */}
                                                                        <button
                                                                            onClick={() => handleUpdateUser(element?._id)}
                                                                            className="bg-green-500 hover:bg-green-600 transition-all ease-in-out duration-30 text-xl py-2 px-4 rounded-md font-bold max-md:px-2 max-md:py-1 max-md:text-sm"
                                                                        >
                                                                            <TiTick />
                                                                        </button>
                                                                        {/* Cancel button to discard changes */}
                                                                        <button
                                                                            onClick={() => setIsEditable(!isEditable)} // Passing null to reset the editable state
                                                                            className="bg-red-500 hover:bg-red-600 transition-all ease-in-out duration-30 text-xl py-2 px-4 rounded-md font-bold max-md:px-2 max-md:py-1 max-md:text-sm"
                                                                        >
                                                                            <ImCross />
                                                                        </button>
                                                                    </>
                                                                ) :
                                                                (
                                                                    <>
                                                                        {/* Edit button */}
                                                                        <button
                                                                            onClick={() => toggleEditMode(element)}
                                                                            className="bg-green-500 hover:bg-green-600 transition-all ease-in-out duration-30 text-xl py-2 px-4 rounded-md font-bold max-md:px-2 max-md:py-1 max-md:text-sm"
                                                                        >
                                                                            <LiaUserEditSolid />
                                                                        </button>
                                                                        {/* Delete button */}
                                                                        <button
                                                                            onClick={() => toggleModal(element?._id)}
                                                                            className="bg-red-500 hover:bg-red-600 transition-all ease-in-out duration-30 text-xl py-2 px-4 rounded-md font-bold max-md:px-2 max-md:py-1 max-md:text-sm"
                                                                        >
                                                                            <BsTrash />
                                                                        </button>
                                                                    </>
                                                                )
                                                        }
                                                    </td>
                                                    :
                                                    <td td className="flex items-center gap-4">
                                                        Can't do any action
                                                    </td>
                                            }

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
        </Layout >
    );
};

export default AllUsers;
