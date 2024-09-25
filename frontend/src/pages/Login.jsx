import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { FaEyeSlash, FaEye, FaKey } from "react-icons/fa";
import { MdOutlineMailOutline } from "react-icons/md";
import Layout from '../layout/Layout';
import { useDispatch } from 'react-redux';
import { login } from '../redux/Slices/AuthSlice';

const Login = () => {
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);
    const togglePasswordVisibility = () => {
        setIsPasswordVisible(!isPasswordVisible);

    }


    const [loginData, setLoginData] = useState({
        email: "",
        password: "",
    });
    const handleUserInput = (event) => {
        const { name, value } = event.target;
        setLoginData({
            ...loginData,
            [name]: value,
        });
    };

    const dispatch = useDispatch();
    const navigate = useNavigate();

    // function to login
    const handleLogin = async (event) => {
        event.preventDefault();

        if (!loginData.email || !loginData.password) {
            toast.error("Please fill all the fields")
            return;
        }

        const response = await dispatch(login(loginData))
        
        if (response?.payload?.success)
            navigate('/');

        setLoginData({
            email: "",
            password: "",
        })

    };

    return (
        <Layout >
            <div className='h-[80vh]'>
                <div className="flex justify-center items-center">
                    <div className="card card-side bg-base-100 shadow-xl w-[50vw] mt-20 max-sm:w-full">
                        <figure >
                            <img style={{ height: '100%', width: '300px' }}
                                className='block max-sm:hidden'
                                src="https://www.hostinger.com/tutorials/wp-content/uploads/sites/2/2023/02/how-to-create-online-course.webp"
                                alt="image" />
                        </figure>
                        <div className="card-body">
                            <h2 className="card-title">Login</h2>
                            <form action="" onSubmit={handleLogin} className='mt-4'>
                                <label className="input input-bordered flex items-center gap-2 mb-4">
                                    <MdOutlineMailOutline />
                                    <input
                                        type="text"
                                        className="grow"
                                        name="email"
                                        id="email"
                                        placeholder="Enter your email"
                                        value={loginData.email}
                                        onChange={handleUserInput}
                                        required
                                    />

                                </label>

                                <label className="input input-bordered flex items-center gap-2 mb-4">
                                    <FaKey />
                                    <input
                                        type={isPasswordVisible ? "text" : "password"}
                                        className="grow" name="password"
                                        id="password"
                                        placeholder="Enter your password"
                                        value={loginData.password}
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
                                    <button className="btn btn-primary btn-outline btn-sm px-8" type='submit'>Login</button>
                                </div>
                                <Link to={"/forgetpassword"}>
                                    <p className="text-center link text-accent cursor-pointer">
                                        Forget Password
                                    </p>
                                </Link>

                                <p className="text-center">
                                    Don't have an account ?{" "}
                                    <Link to={"/signup"} className="link text-accent cursor-pointer">
                                        Create Account
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

export default Login