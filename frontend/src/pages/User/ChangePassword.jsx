import React, { useState } from 'react'
import Layout from '../../layout/Layout'
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import toast from 'react-hot-toast';
import { changePassword } from '../../redux/Slices/AuthSlice';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';

const ChangePassword = () => {

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [password, setPassword] = useState({
    oldPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [isPasswordVisible, setIsPasswordVisible] = useState({
    current: false,
    new: false,
    confirm: false
  })
  const togglePasswordVisibility = (field) => {
    setIsPasswordVisible({
      ...isPasswordVisible,
      [field]: !isPasswordVisible[field], // Only toggle the specific field
    });
  };

  const handleUserInputChange = (e) => {
    const { name, value } = e.target;
    setPassword({
      ...password,
      [name]: value
    })
  }

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    if (!password.oldPassword || !password.newPassword || !password.confirmPassword) {
      toast.error("Please enter all required fields");
      return;
    }

    if (!password.newPassword.match(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,20}$/)) {
      toast.error("Minimum password length should be 8 with Uppercase, Lowercase, Number and Symbol");
      return;
    }

    if (password.newPassword === password.oldPassword) {
      toast.error("New password should not match with current password");
      return;
    }

    if (password.newPassword !== password.confirmPassword) {
      toast.error("New password and Confirm password should match");
      return;
    }

    // const formData = new FormData();
    // formData.append("oldPassword", password.oldPassword);
    // formData.append("newPassword", password.newPassword);
    // Send as JSON object
    // console.log('Form Data:', [...formData.entries()]);

    const payload = {
      oldPassword: password.oldPassword,
      newPassword: password.newPassword
    };

    const res = await dispatch(changePassword(payload));

    console.log("Response:", res)

    if (res?.payload?.success)
      navigate("/user/profile");

    setPassword({
      oldPassword: '',
      newPassword: '',
      confirmPassword: '',
    });


  }

  return (
    <Layout>
      <div className="h-[80vh]">
        <div className="flex justify-center">
          <div className="bg-gray shadow-md rounded-lg p-8 max-w-md w-full border border-white">
            <form action="" onSubmit={handlePasswordChange}>
              <h2 className="text-2xl font-semibold mb-6 text-center ">Change Password</h2>
              <div className="mb-4">
                <label className="input input-bordered flex items-center gap-2 mb-4" htmlFor="oldPassword">
                  <input
                    id="oldPassword"
                    type={isPasswordVisible.current ? "text" : "password"}
                    name="oldPassword"
                    placeholder='Current Password'
                    value={password.oldPassword}
                    onChange={handleUserInputChange}
                    className="grow"
                  />
                  <span className="icon cursor-pointer" onClick={() => togglePasswordVisibility('current')}>

                    {
                      isPasswordVisible.current ? (
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
                Update Password
              </button>
            </form>
          </div>
        </div>
      </div>
    </Layout>
  )
}

export default ChangePassword