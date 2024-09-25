import React, { useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import Layout from '../../layout/Layout';
import { useDispatch, useSelector } from 'react-redux';
import { getAllCourses, removeCourse } from '../../redux/Slices/CourseSlice';

const CourseInfo = () => {

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const { state } = useLocation();
    const { role, data } = useSelector((state) => state.auth);

    const onCourseDataDelete = async () => {

        await dispatch(removeCourse(state?._id));
        navigate("/courses");
        await dispatch(getAllCourses());
    }

    return (
        <Layout>
            <div className="min-h-[80vh] flex justify-center items-center bg-gray-800">
                <div className="card card-side bg-black shadow-2xl rounded-lg flex flex-col lg:flex-row overflow-hidden">
                    {/* Image Section */}
                    <figure className="lg:w-[50vw] h-auto">
                        <img
                            className="w-full h-full object-cover"
                            src={state?.thumbnail?.secure_url}
                            alt="Thumbnail"
                        />
                    </figure>

                    <div className="card-body p-6 lg:p-8 w-full lg:w-1/2 bg-gray-950">
                        <h2 className="text-3xl font-extrabold text-yellow-500 text-center lg:text-left mb-4">
                            {state?.title}
                        </h2>

                        <h3 className="text-xl font-semibold text-yellow-500">Course Description:</h3>
                        <p className="text-lg text-gray-400 mb-4">{state?.description}</p>

                        <h3 className="text-lg">
                            Course Category:{" "}
                            <span className="font-bold text-yellow-500">{state?.category}</span>
                        </h3>
                        <h3 className="text-lg">
                            Total No. of Lectures:{" "}
                            <span className="font-bold text-yellow-500">{state?.numberOfLectures}</span>
                        </h3>
                        <h3 className="text-lg">
                            Course Created By:{" "}
                            <span className="font-bold text-yellow-500">{state?.createdBy}</span>
                        </h3>

                        <div className="card-actions mt-6 flex flex-wrap justify-between gap-4">
                            {/* {role === "ADMIN" || data?.subscription?.status === "active" ? (
                                <button
                                    onClick={() => navigate("/course/displaylectures", { state: { ...state } })}
                                    className="text-l rounded-md font-bold w-full lg:w-1/3 transition-all ease-in-out duration-300 btn btn-md btn-success btn-outline"
                                >
                                    Watch Lectures
                                </button>
                            ) : (
                                <button onClick={() => navigate("/checkout")} className="text-l rounded-md font-bold w-full lg:w-1/3 transition-all ease-in-out duration-300 btn btn-md btn-info btn-outline">
                                    Subscribe
                                </button>
                            )
                            } */}

                            <button
                                onClick={() => navigate(-1)}
                                className="text-l rounded-md font-bold w-full lg:w-1/3 transition-all ease-in-out duration-300 btn btn-md btn-primary btn-outline"
                            >
                                Back
                            </button>

                            <button
                                onClick={() => navigate("/course/displaylectures", { state: { ...state } })}
                                className="text-l rounded-md font-bold w-full lg:w-1/3 transition-all ease-in-out duration-300 btn btn-md btn-success btn-outline"
                            >
                                Watch Lectures
                            </button>

                            {role === "ADMIN" && (
                                <>
                                    <button
                                        onClick={() => navigate("/course/editcourse", { state: { ...state } })}
                                        className="text-l rounded-md font-bold w-full lg:w-1/3 transition-all ease-in-out duration-300 btn btn-md btn-secondary btn-outline"
                                    >
                                        Edit Course
                                    </button>

                                    <button
                                        onClick={() => onCourseDataDelete()}
                                        className="text-l rounded-md font-bold w-full lg:w-1/3 transition-all ease-in-out duration-300 btn btn-md btn-error btn-outline"
                                    >
                                        Delete Course
                                    </button>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </Layout>

    )
}

export default CourseInfo