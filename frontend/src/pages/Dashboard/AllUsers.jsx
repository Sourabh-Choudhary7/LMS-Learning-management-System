import React, { useEffect, useState } from 'react';
import Layout from '../../layout/Layout';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { getAllUsers } from '../../redux/Slices/statsSlice';

const AllUsers = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedImage, setSelectedImage] = useState(null); // State to hold selected image URL
    const usersList = useSelector((state) => state?.stats?.allUsers);
    
    useEffect(() => {
        dispatch(getAllUsers());
    }, [dispatch]);

    // Function to toggle the modal and set the selected image
    const toggleModal = (imageUrl) => {
        setSelectedImage(imageUrl);
        setIsModalOpen(!isModalOpen);
    };

    return (
        <Layout>
            <div className="h-auto flex flex-col flex-wrap gap-10 text-white">
                <h1 className="text-center text-3xl font-semibold text-yellow-500">
                    All Users List
                </h1>
                <div className="mx-[10%] w-[80%] self-center flex flex-col items-center justify-center gap-10 mb-10">
                    <table className="table overflow-x-scroll">
                        <thead className='text-l font-bold'>
                            <tr>
                                <th>SL No.</th>
                                <th>Profile Photo</th>
                                <th>Full Name</th>
                                <th>Email</th>
                                <th>Role</th>
                                <th>Subscription</th>
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
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>

                    {/* Modal to show the enlarged image */}
                    {isModalOpen && (
                        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" onClick={() => toggleModal(null)}>
                            <div className="relative">
                                <button
                                    className="absolute top-2 right-2 text-white text-2xl"
                                    onClick={() => toggleModal(null)}
                                >
                                    &times;
                                </button>
                                <img
                                    className="w-[70vw] h-[70vh] object-contain"
                                    src={selectedImage}
                                    alt="Enlarged Profile"
                                />
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </Layout>
    );
};

export default AllUsers;
