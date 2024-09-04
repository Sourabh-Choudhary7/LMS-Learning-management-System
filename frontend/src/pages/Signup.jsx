import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { FaEyeSlash, FaEye, FaKey, FaUserAlt } from "react-icons/fa";
import { MdOutlineMailOutline } from "react-icons/md";
import { BsPersonCircle } from 'react-icons/bs';
import Layout from '../layout/Layout';

const Signup = () => {
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);
    const togglePasswordVisibility = () => {
        setIsPasswordVisible(!isPasswordVisible);

    }
    const [previewImage, setPreviewImage] = useState("");

    const [signupData, setSignupData] = useState({
        fullName: "",
        email: "",
        password: "",
        avatar: ""

    });
    const handleUserInput = (event) => {
        const { name, value } = event.target;
        setSignupData({
            ...signupData,
            [name]: value,
        });
    };
    // function to Signup

    return (
        <Layout>
            <div className='h-[80vh]'>
                <div className="flex justify-center items-center">
                    <div className="card card-side bg-base-100 shadow-xl w-[30vw] max-sm:w-full">
                        <div className="card-body">
                            <h2 className="card-title justify-center mb-4">Create Your Account</h2>
                            <figure>
                                <label htmlFor="image_uploads" className="cursor-pointer flex">
                                    {previewImage ? (
                                        <img className="w-24 h-24 rounded-full m-auto" src={previewImage} />
                                    ) : (
                                        <BsPersonCircle className='w-24 h-24 rounded-full m-auto' />
                                    )}
                                </label>
                                <input
                                    onChange={"getImage"}
                                    className="hidden"
                                    type="file"
                                    name="image_uploads"
                                    id="image_uploads"
                                    accept=".jpg, .jpeg, .png, .svg"
                                />
                            </figure>
                            <form action="">
                                <label className="input input-bordered flex items-center gap-2 mb-4">
                                    <FaUserAlt />
                                    <input
                                        type="text"
                                        required
                                        name="fullName"
                                        id="fullName"
                                        placeholder="Enter your name"
                                        className="grow"
                                        onChange={handleUserInput}
                                        value={signupData.fullName}
                                    />
                                </label>
                                <label className="input input-bordered flex items-center gap-2 mb-4">
                                    <MdOutlineMailOutline />
                                    <input
                                        type="text"
                                        className="grow"
                                        name="email"
                                        id="email"
                                        placeholder="Enter your email"
                                        value={signupData.email}
                                        onChange={handleUserInput}
                                        required
                                    />

                                </label>

                                <label className="input input-bordered flex items-center gap-2 mb-4">
                                    <FaKey />
                                    <input
                                        type={isPasswordVisible ? "text" : "password"}
                                        className="grow"
                                        name="password"
                                        id="password"
                                        placeholder="Enter your password"
                                        value={signupData.password}
                                        onChange={handleUserInput}
                                        required
                                    />
                                    <span className="icon cursor-pointer" onClick={togglePasswordVisibility}>

                                        {
                                            isPasswordVisible ? (
                                                <FaEye />
                                            )
                                                :
                                                (
                                                    <FaEyeSlash />
                                                )
                                        }
                                    </span>

                                </label>

                                <div className="card-actions justify-center">
                                    <button className="btn btn-primary" type='submit'>Create Account</button>
                                </div>


                                <p className="text-center">
                                    Already have an account ?{" "}
                                    <Link to={"/login"} className="link text-accent cursor-pointer">
                                        Login here
                                    </Link>
                                </p>
                            </form>

                        </div>
                    </div>
                </div>
            </div>
        </Layout>

    )
}

export default Signup