import React, { useEffect, useState } from 'react'
import { GiHamburgerMenu } from "react-icons/gi";
import { Link, useLocation } from 'react-router-dom';
import { clearSearchQuery, setSearchQuery } from '../redux/Slices/CourseSlice';
import { useDispatch, useSelector } from 'react-redux';
import { MdOutlineDarkMode, MdOutlineLightMode } from 'react-icons/md';
import { setMode } from '../redux/Slices/modeSlice';

const Navbar = ({ isLoggedIn, userData, handleLogout }) => {

    const location = useLocation();

    const dispatch = useDispatch();
    const [localSearch, setLocalSearch] = useState('');

    const { darkMode } = useSelector((state) => state?.mode)
    const handleMode = () => {
        dispatch(setMode(!darkMode));
    }

    // we can also handle this from debouncing methods. Here, current implementation using setTimeout within useEffect
    useEffect(() => {
        const handler = setTimeout(() => {
            dispatch(setSearchQuery(localSearch));
        }, 300); // Debounce delay of 300ms

        return () => {
            clearTimeout(handler);
        };
    }, [localSearch, dispatch]);

    const handleInputChange = (e) => {
        setLocalSearch(e.target.value);
    };

    // const handleSearchClear = () => {
    //     setLocalSearch('');
    //     dispatch(clearSearchQuery());
    // };

    return (
        <div className={`navbar bg-base-100 h-[10vh] w-full ${darkMode ? "text-white" : "text-gray-900 bg-white"}`}>
            <div className="flex-none pl-2">
                <label htmlFor="my-drawer" className="cursor-pointer">
                    <GiHamburgerMenu className="cursor-pointer text-2xl" />
                </label>
            </div>
            <div className="flex-1 pl-2">
                <a className="btn btn-ghost text-xl">LMS</a>
            </div>

            <div className="flex-none gap-4">
                {location.pathname === '/courses' && (
                    <div className="form-control flex items-center">
                        <input
                            type="text"
                            placeholder="Search a Course..."
                            className={`input input-bordered w-24 md:w-auto ${darkMode ? "" : "bg-white border-black"}`}
                            value={localSearch}
                            onChange={handleInputChange}
                            aria-label="Search Courses"
                        />
                    </div>

                )}
                <div>
                    <section className="text-l cursor-pointer"
                        onClick={handleMode}>
                        {darkMode ? (
                            <MdOutlineDarkMode size={"20px"} />
                        ) : (
                            <MdOutlineLightMode size={"20px"} />
                        )}
                    </section>
                </div>
                {
                    isLoggedIn && (
                        <div className="dropdown dropdown-end">
                            <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar">
                                <div className="w-10 rounded-full">
                                    <img
                                        alt="User avatar"
                                        src={userData?.avatar?.secure_url} />
                                </div>
                            </div>
                            <ul
                                tabIndex={0}
                                className={`menu menu-sm dropdown-content rounded-box z-[1] mt-3 w-52 p-2 shadow ${darkMode ? "text-white bg-gray-900" : "text-black bg-white"}`}>
                                <li>
                                    <Link to="/user/profile" className="justify-between">
                                        Profile
                                        <span className="badge">New</span>
                                    </Link>
                                </li>
                                <li><Link to="/user/setting">Settings</Link></li>
                                <li><a onClick={handleLogout}>Logout</a></li>
                            </ul>
                        </div>
                    )
                }
            </div>


        </div>
    )
}

export default Navbar;