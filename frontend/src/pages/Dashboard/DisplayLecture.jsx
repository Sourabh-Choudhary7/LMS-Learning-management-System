import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useLocation, useNavigate } from 'react-router-dom';
import { getAllLectures, removeCourseLecture } from '../../redux/Slices/LectureSlice';
import Layout from '../../layout/Layout';

const DisplayLecture = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { state } = useLocation();

    const { lectures } = useSelector((state) => state.lecture);
    const { role } = useSelector((state) => state?.auth)

    const [currentVideo, setCurrentVideo] = useState(0);

    useEffect(() => {
        if (!state) navigate("/courses")
        dispatch(getAllLectures(state._id))
    }, [])

    const onLectureDelete = async (courseId, lectureId) => {
        await dispatch(removeCourseLecture({ courseId: courseId, lectureId: lectureId }));
        await dispatch(getAllLectures(courseId));
    }

    return (
        <Layout>
            <div className="flex flex-col gap-10 items-center justify-center min-h-[80vh] text-white bg-gray-900 py-10 w-full max-md:p-4">

                <div className="text-center text-3xl max-md:text-xxl font-semibold text-yellow-500">
                    Course Name: {state?.title}
                </div>

                {(lectures && lectures.length > 0) ? (
                    <div className="flex justify-center gap-10 w-full max-md:flex-col ">

                        <div className="bg-gray-800 rounded-lg shadow-lg p-4 w-[28rem] max-md:w-auto h-auto space-y-5">
                            <video
                                src={lectures && lectures[currentVideo]?.lecture?.secure_url}
                                className="rounded-lg w-full h-64 object-cover shadow-md"
                                controls
                                disablePictureInPicture
                                muted
                                controlsList="nodownload"
                            >
                            </video>

                            <div className="text-white">
                                <h1 className="text-xl font-bold">
                                    <span className="text-yellow-500">Title: </span>
                                    {lectures && lectures[currentVideo]?.title}
                                </h1>
                                <p className="mt-2">
                                    <span className="text-yellow-500">Description: </span>
                                    {lectures && lectures[currentVideo]?.description}
                                </p>
                            </div>
                        </div>

                        <ul className="bg-gray-800 rounded-lg shadow-lg p-4 w-[28rem] max-md:w-auto space-y-4 overflow-y-auto max-h-[28rem]">
                            <li className="font-semibold text-xl text-yellow-500 flex items-center justify-between">
                                <p>Lectures List</p>
                                {role === "ADMIN" && (
                                    <button
                                        onClick={() => navigate("/course/addlecture", { state: { ...state } })}
                                        className="rounded-md transition-all ease-in-out duration-300 btn btn-sm btn-secondary btn-outline"
                                    >
                                        Add New Lecture
                                    </button>
                                )}
                            </li>

                            {lectures.map((lecture, idx) => (
                                <li key={lecture._id} className="space-y-2">
                                    <p
                                        className="cursor-pointer hover:text-yellow-500 transition duration-300"
                                        onClick={() => setCurrentVideo(idx)}
                                    >
                                        <span>Lecture {idx + 1}:</span> {lecture?.title}
                                    </p>

                                    {role === "ADMIN" && (
                                        <button
                                            onClick={() => onLectureDelete(state?._id, lecture?._id)}
                                            className="rounded-md transition duration-300 btn btn-sm btn-error btn-outline"
                                        >
                                            Delete
                                        </button>
                                    )}
                                </li>
                            ))}
                        </ul>
                    </div>
                ) : (
                    role === "ADMIN" ? (
                        <button
                            onClick={() => navigate("/course/addlecture", { state: { ...state } })}
                            className="text-l rounded-md font-bold w-full transition-all ease-in-out duration-300 btn btn-md btn-primary btn-outline"
                        >
                            Add New Lecture
                        </button>
                    ) : (
                        role === "USER" && <p className="text-xl">Lectures Coming Soon...</p>
                    )
                )}
            </div>
        </Layout>

    )
}

export default DisplayLecture