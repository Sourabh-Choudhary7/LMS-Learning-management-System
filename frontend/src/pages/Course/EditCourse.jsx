import React, { useEffect, useState } from 'react';
import Layout from '../../layout/Layout';
import { AiOutlineArrowLeft } from 'react-icons/ai';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { getAllCourses, updateCourse } from '../../redux/Slices/CourseSlice';
import toast from 'react-hot-toast';
import { FaCamera } from 'react-icons/fa';

const EditCourse = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();
    const courseDetails = location.state;

    const [isLoading, setIsLoading] = useState(false);
    console.log('Course Details:', courseDetails);

    const [updateCourseData, setUpdateCourseData] = useState({
        id: '',
        title: "",
        description: "",
        createdBy: "",
        category: "",
        thumbnail: null,
        previewImage: ""
    });

    // Initialize updateCourseData with courseDetails
    useEffect(() => {
        if (courseDetails) {
            setUpdateCourseData({
                id: courseDetails._id || '',
                title: courseDetails.title || "",
                description: courseDetails.description || "",
                createdBy: courseDetails.createdBy || "",
                category: courseDetails.category || "",
                thumbnail: null,
                previewImage: courseDetails.thumbnail?.secure_url || ""
            });
        }
    }, [courseDetails]);

    // Handle Image upload
    const getThumbnail = (e) => {
        e.preventDefault();
        const uploadedImage = e.target.files[0];
        if (uploadedImage) {
            const fileReader = new FileReader();
            fileReader.readAsDataURL(uploadedImage);
            fileReader.addEventListener("load", function () {
                setUpdateCourseData({
                    ...updateCourseData,
                    thumbnail: uploadedImage,
                    previewImage: this.result
                })
            })
        }
    }

    const handleUserInput = (e) => {
        const { name, value } = e.target;
        setUpdateCourseData((prevData) => ({
            ...prevData,
            [name]: value
        }));
    };

    // Handle form submission
    const handleOnEditCourse = async (e) => {
        e.preventDefault();

        const { title, description, createdBy, category, thumbnail } = updateCourseData;

        if (!updateCourseData.title || !updateCourseData.description || !updateCourseData.createdBy || !updateCourseData.category) {
            toast.error("Please add all the fields");
            return;
        }

        // const formData = new FormData();
        // formData.append("title", title);
        // formData.append("description", description);
        // formData.append("createdBy", createdBy);
        // formData.append("category", category);
        // if (thumbnail) {
        //   formData.append("thumbnail", thumbnail);
        // }
        // const payload = {
        //     title: updateCourseData.title,
        //     description: updateCourseData.description,
        //     thumbnail: updateCourseData.thumbnail,
        //     createdBy: updateCourseData.createdBy,
        //     category: updateCourseData.category

        // }
        setIsLoading(true);

        const res = await dispatch(updateCourse([updateCourseData.id, updateCourseData]));
        dispatch(getAllCourses())
        if (res?.payload?.success) {
            setIsLoading(false);
            navigate(-2);
        }



    };

    return (
        <Layout>
            <div className="flex items-center justify-center h-[80vh]">
                <form
                    onSubmit={handleOnEditCourse}
                    className="flex flex-col justify-center gap-5 rounded-lg p-6 text-white w-[700px] my-10 shadow-lg relative bg-gray-800"
                >
                    <Link to={()=> { "/course/description", { state: { ...state } }}} className="absolute top-4 left-4 text-2xl text-accent hover:text-accent-hover cursor-pointer">
                        <AiOutlineArrowLeft />
                    </Link>

                    <h1 className="text-center text-3xl font-bold mb-4">
                        Edit Course
                    </h1>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label htmlFor="image_uploads" className="cursor-pointer block mb-2">
                                <span className="text-lg font-semibold">Course Thumbnail</span>
                            </label>
                            <label htmlFor="image_uploads" className="cursor-pointer">
                                {updateCourseData.previewImage ? (
                                    <img
                                        className="w-full h-44 object-cover rounded border"
                                        src={updateCourseData.previewImage}
                                        alt="Course Thumbnail"
                                    />
                                ) : (
                                    <div className="w-full h-44 flex items-center justify-center border rounded relative">
                                        <FaCamera className='text-2xl text-gray-500' />
                                        <span className='absolute text-sm text-gray-500'>Upload Thumbnail</span>
                                    </div>
                                )}
                            </label>
                            <input
                                className="hidden"
                                type="file"
                                id="image_uploads"
                                accept=".jpg, .jpeg, .png"
                                name="image_uploads"
                                onChange={getThumbnail}
                            />
                        </div>

                        {/* Course Details */}
                        <div className="flex flex-col gap-4">
                            <div className="flex flex-col">
                                <label className="text-lg font-semibold" htmlFor="title">
                                    Course Title
                                </label>
                                <input
                                    type="text"
                                    name="title"
                                    id="title"
                                    placeholder="Enter course title"
                                    className="bg-transparent px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-accent"
                                    value={updateCourseData.title}
                                    onChange={handleUserInput}
                                    required
                                />
                            </div>

                            <div className="flex flex-col">
                                <label className="text-lg font-semibold" htmlFor="createdBy">
                                    Course Instructor
                                </label>
                                <input
                                    type="text"
                                    name="createdBy"
                                    id="createdBy"
                                    placeholder="Enter course instructor"
                                    className="bg-transparent px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-accent"
                                    value={updateCourseData.createdBy}
                                    onChange={handleUserInput}
                                    required
                                />
                            </div>

                            <div className="flex flex-col">
                                <label className="text-lg font-semibold" htmlFor="category">
                                    Course Category
                                </label>
                                <input
                                    type="text"
                                    name="category"
                                    id="category"
                                    placeholder="Enter course category"
                                    className="bg-transparent px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-accent"
                                    value={updateCourseData.category}
                                    onChange={handleUserInput}
                                    required
                                />
                            </div>

                            <div className="flex flex-col">
                                <label className="text-lg font-semibold" htmlFor="description">
                                    Course Description
                                </label>
                                <textarea
                                    name="description"
                                    id="description"
                                    placeholder="Enter course description"
                                    className="bg-transparent px-3 py-2 h-32 overflow-y-auto resize-none border rounded focus:outline-none focus:ring-2 focus:ring-accent"
                                    value={updateCourseData.description}
                                    onChange={handleUserInput}
                                    required
                                />
                            </div>
                        </div>
                    </div>

                    <button
                        type="submit"
                        className={`w-full py-3 rounded text-lg font-semibold 
                        ${isLoading ? 'bg-gray-600 cursor-wait' : 'bg-yellow-600 hover:bg-yellow-500'} 
                        transition-colors duration-300`}
                        disabled={isLoading}
                    >
                        {isLoading ? "Updating Course..." : "Update Course"}
                    </button>
                </form>
            </div>
        </Layout>
    );
};

export default EditCourse;
