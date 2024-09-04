import React from 'react'
import { GiHamburgerMenu } from "react-icons/gi";

const Navbar = ({ isLoggedIn }) => {


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
                                        src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp" />
                                </div>
                            </div>
                            <ul
                                tabIndex={0}
                                className="menu menu-sm dropdown-content bg-base-100 rounded-box z-[1] mt-3 w-52 p-2 shadow">
                                <li>
                                    <a className="justify-between">
                                        Profile
                                        <span className="badge">New</span>
                                    </a>
                                </li>
                                <li><a>Settings</a></li>
                                <li><a>Logout</a></li>
                            </ul>
                        </div>
                    </div>

                )
            }
        </div>
    )
}

export default Navbar;