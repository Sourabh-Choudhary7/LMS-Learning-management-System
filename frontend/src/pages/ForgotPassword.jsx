import React, { useState } from 'react'
import { useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import Layout from '../layout/Layout';
import { forgotPassword } from '../redux/Slices/AuthSlice';
import toast from 'react-hot-toast';

const ForgotPassword = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');

  const handleUserInputChange = (e) => {
    setEmail(e.target.value);
  }

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    if (!email) {
      toast.error('Please enter your email address');
      return;
    }
    const payload = {
      email: email
    };

    const res = await dispatch(forgotPassword(payload));
    if (res?.payload?.success)
      navigate('/login');

    setEmail('');
  }
  return (
    <Layout>
      <div className="h-[80vh]">
        <div className="flex justify-center">
          <div className="bg-gray shadow-md rounded-lg p-8 max-w-md w-full border border-white">
            <form action="" onSubmit={handleForgotPassword}>
              <h2 className="text-2xl font-semibold mb-6 text-center ">Forgot password</h2>
              <div className="mb-4">
                <label className="input input-bordered flex items-center gap-2 mb-4" htmlFor="oldPassword">
                  <input
                    id="email"
                    type="text"
                    name="email"
                    placeholder='Enter your email address'
                    value={email}
                    onChange={handleUserInputChange}
                    className="grow"
                  />
                </label>
              </div>
              <button className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition">
                Get Verification Link
              </button>
              <p className="text-center mt-2">
                Already have an account ?{" "}
                <Link to={"/login"} className="link text-accent cursor-pointer">
                  Login
                </Link>
              </p>
            </form>

          </div>
        </div>
      </div>
    </Layout>
  )
}

export default ForgotPassword