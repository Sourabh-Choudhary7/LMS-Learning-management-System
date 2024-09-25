import React, { useState } from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import { FaEyeSlash, FaEye, FaKey, FaUserAlt } from "react-icons/fa";
import { MdOutlineMailOutline } from "react-icons/md";
import { BsPersonCircle } from 'react-icons/bs';
import Layout from '../layout/Layout';
import toast from 'react-hot-toast';
import { useDispatch } from 'react-redux';
import { createAccount } from '../redux/Slices/AuthSlice';

const Signup = () => {
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);
    const togglePasswordVisibility = () => {
        setIsPasswordVisible(!isPasswordVisible);

    }
    const navigate = useNavigate()
    const dispatch = useDispatch();
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
    // function to handle the image upload
    const getImage = (event) => {
        event.preventDefault();
        // getting the image
        const uploadedImage = event.target.files[0];

        // if image exists then getting the url link of it
        if (uploadedImage) {
            setSignupData({
                ...signupData,
                avatar: uploadedImage,
            });
            const fileReader = new FileReader();
            fileReader.readAsDataURL(uploadedImage);
            fileReader.addEventListener("load", function () {
                setPreviewImage(this.result);
            });
        }
    };
    // function to create an account
    const createNewAccount = async (event) => {
        event.preventDefault();

        // checking the empty fields
        if (
            !signupData.avatar ||
            !signupData.email ||
            !signupData.fullName ||
            !signupData.password
        ) {
            toast.error("Please fill all the fields");
            return;
        }

        // checking the name field length
        if (signupData.fullName.length < 5) {
            toast.error("Name should be atleast of 5 characters");
            return;
        }

        // email validation using regex
        if (
            !signupData.email.match(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/)
        ) {
            toast.error("Invalid email id");
            return;
        }

        // password validation using regex
        if (!signupData.password.match(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,20}$/)) {
            toast.error(
                "Minimum password length should be 8 with Uppercase, Lowercase, Number and Symbol"
            );
            return;
        }

        // creating the form data from the existing data
        const formData = new FormData();
        formData.append("fullName", signupData.fullName);
        formData.append("email", signupData.email);
        formData.append("password", signupData.password);
        formData.append("avatar", signupData.avatar);

        // calling create account action
        const res = await dispatch(createAccount(formData));
        // redirect to login page if true
        if (res?.payload?.success)
            navigate('/login');

        // clearing the signup inputs
        setSignupData({
            fullName: "",
            email: "",
            password: "",
            avatar: "",
        });
        setPreviewImage("");
    };

    return (
        <Layout>
            <div className='h-[80vh]'>
                <div className="flex justify-center items-center">
                    <div className="card card-side bg-base-100 shadow-xl w-[30vw] max-sm:w-full">
                        <div className="card-body">
                            <h2 className="card-title justify-center mb-4">Create Your Account</h2>
                            <form noValidate action="" onSubmit={createNewAccount}>
                                <figure>
                                    <label htmlFor="image_uploads" className="cursor-pointer flex">
                                        {previewImage ? (
                                            <img className="w-24 h-24 rounded-full m-auto" src={previewImage} />
                                        ) : (
                                            <BsPersonCircle className='w-24 h-24 rounded-full m-auto' />
                                        )}
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