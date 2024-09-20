import React, { useState } from 'react'
import { FaEye, FaEyeSlash } from 'react-icons/fa'
import { useDispatch } from 'react-redux';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { resetPassword } from '../redux/Slices/AuthSlice';
import toast from 'react-hot-toast';

const ResetPassword = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { resetToken } = useParams();
    console.log('reset token: ', resetToken);

    const [password, setPassword] = useState({
        newPassword: '',
        confirmPassword: '',
    });
    const [isPasswordVisible, setIsPasswordVisible] = useState({
        new: false,
        confirm: false
    })
    const togglePasswordVisibility = (field) => {
        setIsPasswordVisible({
            ...isPasswordVisible,
            [field]: !isPasswordVisible[field],
        });
    };

    const handleUserInputChange = (e) => {
        const { name, value } = e.target;
        setPassword({
            ...password,
            [name]: value
        })
    }

    const handleResetPassword = async (e) => {
        e.preventDefault();
        if (!password.newPassword || !password.confirmPassword) {
            toast("Please enter all required fields");
            return;
        }
        if (password.newPassword !== password.confirmPassword) {
            toast("Passwords do not match");
            return;
        }
        if (!password.newPassword.match(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,20}$/)) {
            toast.error("Minimum password length should be 8 with Uppercase, Lowercase, Number and Symbol");
            return;
        }
        const payload = {
            resetToken,
            data: {
                password: password.newPassword,
            },
        };
        const res = await dispatch(resetPassword(payload));

        if (res?.payload?.success)
            navigate('/login');
        setPassword({
            newPassword: '',
            confirmPassword: '',
        })
    }
    return (
        <div className="flex justify-center items-center h-[100vh]">
            <div className="bg-gray shadow-md rounded-lg p-8 max-w-md w-full border border-white">
                <form action="" onSubmit={handleResetPassword}>
                    <h2 className="text-2xl font-semibold mb-6 text-center ">Reset password</h2>
                    <div className="mb-4">
                        <label className="input input-bordered flex items-center gap-2 mb-4" htmlFor="newPassword">
                            <input
                                id="newPassword"
                                type={isPasswordVisible.new ? "text" : "password"}
                                name="newPassword"
                                placeholder='Enter your new password'
                                value={password.newPassword}
                                onChange={handleUserInputChange}
                                className="grow"
                            />
                            <span className="icon cursor-pointer" onClick={() => togglePasswordVisibility('new')}>

                                {
                                    isPasswordVisible.new ? (
                                        <FaEye />
                                    )
                                        :
                                        (
                                            <FaEyeSlash />
                                        )
                                }
                            </span>
                        </label>
                    </div>

                    <div className="mb-6">
                        <label className="input input-bordered flex items-center gap-2 mb-4" htmlFor="confirmPassword">

                            <input
                                id="confirmPassword"
                                type={isPasswordVisible.confirm ? "text" : "password"}
                                name="confirmPassword"
                                placeholder='Enter confirm password'
                                value={password.confirmPassword}
                                onChange={handleUserInputChange}
                                className="grow"
                            />
                            <span className="icon cursor-pointer" onClick={() => togglePasswordVisibility('confirm')}>

                                {
                                    isPasswordVisible.confirm ? (
                                        <FaEye />
                                    )
                                        :
                                        (
                                            <FaEyeSlash />
                                        )
                                }
                            </span>
                        </label>
                    </div>

                    <button className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition">
                        Reset Password
                    </button>
                    <p className="text-center mt-2">
                        Go to {" "}
                        <Link to={"/login"} className="link text-accent cursor-pointer">
                            Login
                        </Link>
                    </p>
                </form>

            </div>
        </div>
    )
}

export default ResetPassword