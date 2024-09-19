import React from 'react'
import { GiHamburgerMenu } from "react-icons/gi";
import { Link } from 'react-router-dom';

const Navbar = ({ isLoggedIn, userData, handleLogout }) => {

// console.log(userData)
    return (
        <div className="navbar bg-base-100 h-[10vh] w-full">
            <div className="flex-none pl-2">
                <label htmlFor="my-drawer" className="cursor-pointer">
                    <GiHamburgerMenu className="cursor-pointer text-2xl" />
                </label>
            </div>
            <div className="flex-1 pl-2">
                <a className="btn btn-ghost text-xl">LMS</a>
            </div>
            {
                isLoggedIn && (
                    <div className="flex-none gap-2">
                        <div className="form-control">
                            <input type="text" placeholder="Search" className="input input-bordered w-24 md:w-auto" />
                        </div>
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
                                className="menu menu-sm dropdown-content bg-base-100 rounded-box z-[1] mt-3 w-52 p-2 shadow">
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
                    </div>

                )
            }
        </div>
    )
}

export default Navbar;