import React, { useEffect, useState } from 'react'
import Navbar from '../components/Navbar'
import Footer from '../components/footer'
import { Link, useNavigate } from "react-router-dom";
import { FaLongArrowAltLeft, FaHome, FaBook } from "react-icons/fa";
import { RiAdminFill } from "react-icons/ri";
import { MdAddCircle, MdContactPhone } from "react-icons/md";
import { IoIosInformationCircle } from "react-icons/io";
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../redux/Slices/AuthSlice';

const Layout = ({ children }) => {

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const isLoggedIn = useSelector((state) => state?.auth?.isLoggedIn)
    const userData = useSelector((state) => state?.auth?.data);

    // for displaying the options accourding to the role
    const role = useSelector((state) => state?.auth?.role);

    async function handleLogout(e) {
        e.preventDefault();
        const res = await dispatch(logout());
        if (res?.payload?.success)
            navigate("/");
    }


    return (
        <div>
            <div className="drawer z-10 ">
                <input id="my-drawer" type="checkbox" className="drawer-toggle" />
                <div className="drawer-content">
                    <Navbar isLoggedIn={isLoggedIn} userData={userData} handleLogout={handleLogout} />
                    {/* Page content here */}
                    <div className="p-4 w-full">
                        {children}
                    </div>
                </div>
                <div className="drawer-side">
                    <label htmlFor="my-drawer" className="drawer-overlay"></label>
                    <div className="bg-base-200 text-base-conter h-full w-80 p-4">
                        {/* Close button */}
                        <label htmlFor="my-drawer" className="cursor-pointer mb-4 block">
                        </label>
                        {/* Sidebar content here */}
                        <ul className="menu relative h-full">
                            <li className="w-fit absolute right-0 top-[-30px] z-50">
                                <label htmlFor="my-drawer" className="cursor-pointer mb-4 block">
                                    <FaLongArrowAltLeft size={24} />
                                </label>

                            </li>
                            {isLoggedIn &&
                                <li>
                                    <h3>{`Welcome! ${userData?.fullName?.toUpperCase()} (${userData?.role})`}</h3>
                                </li>}
                            <li>
                                <Link to={"/"}><FaHome />Home</Link>
                            </li>
                            {
                                isLoggedIn && role === 'ADMIN' && (
                                    <>
                                        <li>
                                            <Link to={"/admin/dashboard"}><RiAdminFill />Admin Dashboard</Link>
                                        </li>
                                        <li>
                                            <Link to={"/course/create"}><MdAddCircle />Create New Course</Link>
                                        </li>
                                    </>
                                )
                            }
                            <li>
                                <Link to={"/courses"}><FaBook />Courses</Link>
                            </li>
                            <li>
                                <Link to={"/about"}><IoIosInformationCircle />About Us</Link>
                            </li>
                            <li>
                                <Link to={"/contact"}><MdContactPhone />Contact</Link>
                            </li>
                            {
                                !isLoggedIn && (
                                    <div className='flex justify-between items-center absolute bottom-0'>
                                        <li>
                                            <Link to={"/login"}>
                                                <button className='btn btn-sm btn-outline btn-primary px-8'>Login</button>
                                            </Link>
                                        </li>
                                        <li>
                                            <Link to={"/signup"}>
                                                <button className='btn btn-sm btn-outline btn-secondary px-8'>Signup</button>
                                            </Link>
                                        </li>
                                    </div>
                                )
                            }
                            {
                                isLoggedIn && (
                                    <div className='flex justify-center items-center absolute bottom-0'>
                                        <li>
                                            <button
                                                onClick={handleLogout}
                                                className='btn btn-sm btn-outline btn-secondary px-24'>Logout</button>
                                        </li>
                                    </div>
                                )
                            }
                        </ul>

                    </div>
                </div>
            </div>
            <Footer className='z-0 mt-4' />
        </div>
    )
}

export default Layout