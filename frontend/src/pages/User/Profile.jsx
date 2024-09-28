import React, { useState } from 'react';
import Layout from '../../layout/Layout';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { cancelCourseBundle } from '../../redux/Slices/PaymentSlice';
import { getUserData } from '../../redux/Slices/AuthSlice';

const Profile = () => {
    const dispatch = useDispatch();
    const userData = useSelector((state) => state?.auth?.data)
    const navigate = useNavigate();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const toggleModal = () => {
        setIsModalOpen(!isModalOpen);
    }


    const handleSubscriptionCancellation = async () => {
        const res = await dispatch(cancelCourseBundle());
        if (res?.payload?.success) {
            await dispatch(getUserData());
        } 
    }
    return (
        <Layout>
            <div className="h-[80vh]">
                <div className="flex justify-center mt-12">
                    <div className="max-w-sm w-full bg-white shadow-md rounded-lg overflow-hidden">
                        <div className="bg-yellow-600 h-32"></div>
                        <div className="flex justify-center -mt-16 cursor-pointer" onClick={toggleModal}>
                            <img
                                className="w-32 h-32 object-cover rounded-full border-4 border-white"
                                src={userData?.avatar?.secure_url}
                                alt="Profile"
                            />
                        </div>
                        <div className="text-center mt-2">
                            <h2 className="text-xl font-semibold text-gray-800">{userData?.fullName.toUpperCase()}</h2>
                            <p className="text-gray-600">{userData?.role}</p>
                        </div>
                        <div className="mx-4 mt-2">
                            <p className="text-gray-700">Email: {userData?.email}</p>
                            <p className="text-gray-700 inline">Subscription: </p><p className='text-green-600 inline'>{userData?.subscription?.status === "active" ? "Active" : "Inactive"}</p>
                        </div>
                        <div className="flex items-center justify-between gap-2">
                            <Link
                                to="/changepassword"
                                className="w-1/2 bg-blue-600 hover:bg-blue-500 transition-all ease-in-out duration-300 rounded-md font-semibold py-2 cursor-pointer text-center m-2 text-white">
                                Change password
                            </Link>
                            <button
                                onClick={() => navigate("/user/editprofile", { state: { ...userData } })}
                                className="w-1/2 bg-blue-600 hover:bg-blue-500 transition-all ease-in-out duration-300 rounded-md font-semibold py-2 cursor-pointer text-center m-2 text-white">
                                Edit profile
                            </button>
                        </div>
                        <div className='mx-2 mb-2'>
                            {userData?.subscription?.status === "active" && (
                                <button onClick={handleSubscriptionCancellation} className="w-full bg-red-600 hover:bg-red-500 transition-all ease-in-out duration-300 rounded-md font-semibold py-2 cursor-pointer text-center text-white">
                                    Cancel Subscription
                                </button>
                            )}
                        </div>
                    </div>
                </div>
                {/* Modal to show the enlarged image */}
                {isModalOpen && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" onClick={toggleModal}>
                        <div className="relative">
                            <button
                                className="absolute top-2 right-2 text-white text-2xl"
                                onClick={toggleModal}
                            >
                                &times;
                            </button>
                            <img
                                className="w-[70vw] h-[70vh] object-contain"
                                src={userData?.avatar?.secure_url}
                                alt="Enlarged Profile"
                            />
                        </div>
                    </div>
                )}
            </div>
        </Layout>
    );
};

export default Profile;
