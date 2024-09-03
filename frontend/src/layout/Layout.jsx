import React, { useState } from 'react'
import Navbar from '../components/Navbar'
import Footer from '../components/footer'
import { Link } from "react-router-dom";
import { FaLongArrowAltLeft, FaHome, FaBook } from "react-icons/fa";
import { RiAdminFill } from "react-icons/ri";
import { MdContactPhone } from "react-icons/md";
import { IoIosInformationCircle } from "react-icons/io";

const Layout = ({ children }) => {
    const isLoggedIn = false; // just try to implement without state management leter we will implement all this using redux toolkit...
    return (
        <div className='min-h-100'>

            <div className="drawer z-10 ">
                <input id="my-drawer" type="checkbox" className="drawer-toggle" />
                <div className="drawer-content">
                    <Navbar isLoggedIn={isLoggedIn} />
                    {/* Page content here */}
                    <div className="p-4 h-[80vh]">
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
                            <li>
                                <Link to={"/"}><FaHome />Home</Link>
                            </li>
                            {
                                isLoggedIn && (
                                    <li>
                                        <Link to={"/admin"}><RiAdminFill />Admin Dashboard</Link>
                                    </li>
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
                                    <div className='flex justify-between items-center gap-4 absolute bottom-0'>
                                        <li>
                                            <button className='btn btn-sm btn-outline btn-primary px-10'>Login</button>
                                        </li>
                                        <li>
                                            <button className='btn btn-sm btn-outline btn-secondary px-10'>Signup</button>
                                        </li>
                                    </div>
                                )
                            }
                            {
                                isLoggedIn && (
                                    <div className='flex justify-center items-center absolute bottom-0'>
                                        <li>
                                            <button className='btn btn-sm btn-outline btn-secondary px-24'>Logout</button>
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