import React, { useEffect, useState } from 'react';
import Layout from '../../layout/Layout';
import { FaUserAlt, FaCamera } from 'react-icons/fa';
import { BsPersonCircle } from 'react-icons/bs';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { AiOutlineArrowLeft } from 'react-icons/ai';
import toast from 'react-hot-toast';
import { useDispatch, useSelector } from 'react-redux';
import { getUserData, updateUserProfile } from '../../redux/Slices/AuthSlice';

const EditProfile = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { state } = useLocation();

  const userId = useSelector((state) => state?.auth?.data?._id);

  const [editData, setEditData] = useState({
    fullName: state?.fullName || "",
    avatar: null,
    previewImage: state?.avatar?.secure_url || "",
    userId: userId || ""
  });

  const handleUserInput = (e) => {
    const { name, value } = e.target;
    setEditData({
      ...editData,
      [name]: value
    });
  };

  const getImage = (e) => {
    e.preventDefault();
    const uploadedImage = e.target.files[0];
    if (uploadedImage) {
      const fileReader = new FileReader();
      fileReader.readAsDataURL(uploadedImage);
      fileReader.addEventListener("load", function () {
        setEditData({
          ...editData,
          avatar: uploadedImage,
          previewImage: this.result
        });
      });
    }
  };

  const handleUpdateUserProfile = async (e) => {
    e.preventDefault();

    if (editData.fullName.length < 5) {
      toast.error("Full Name must be at least 5 characters");
      return;
    }

    const formData = new FormData();
    formData.append("fullName", editData.fullName);
    formData.append("avatar", editData.avatar);

    await dispatch(updateUserProfile([editData.userId, formData]));
    await dispatch(getUserData());
    navigate("/user/profile");
  };

  return (
    <Layout>
      <div className="h-[80vh]">
        <div className="flex justify-center mt-12">
          <div className="max-w-sm w-full bg-white shadow-md rounded-lg overflow-hidden">
            <div className="flex items-center bg-yellow-600 gap-28 pt-4">
              <Link to="/user/profile">
                <p className="link text-white text-xl cursor-pointer flex items-center justify-center w-full pl-4">
                  <AiOutlineArrowLeft />
                </p>
              </Link>
              <h1 className="text-white text-center bg-yellow-600 text-xl">Edit Profile</h1>
            </div>
            <div className="bg-yellow-600 h-20"></div>
            <form noValidate action="" onSubmit={handleUpdateUserProfile}>
              <div className="flex justify-center -mt-16 relative">
                <figure>
                  <label htmlFor="image_uploads" className="cursor-pointer flex relative">
                    {editData.previewImage ? (
                      <img
                        className="w-32 h-32 object-cover rounded-full border-4 border-white"
                        src={editData.previewImage}
                        alt="Profile"
                      />
                    ) : (
                      <BsPersonCircle className="w-32 h-32 object-cover rounded-full border-4 border-white" />
                    )}

                    {/* Camera Icon Overlay */}
                    <div className="absolute bottom-2 right-2 bg-gray-800 p-1 rounded-full text-white">
                      <FaCamera />
                    </div>
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
              </div>
              <label className="input input-bordered flex items-center gap-2 m-2">
                <FaUserAlt />
                <input
                  type="text"
                  name="fullName"
                  id="fullName"
                  placeholder="Enter your full name"
                  className="grow"
                  onChange={handleUserInput}
                  value={editData.fullName}
                />
              </label>
              <div className="mx-8">
                <button
                  type="submit"
                  className="w-full bg-blue-600 hover:bg-blue-500 transition-all ease-in-out duration-300 rounded-lg py-2 text-lg cursor-pointer text-white mb-2"
                >
                  Update profile
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </Layout>

  );
};

export default EditProfile;
