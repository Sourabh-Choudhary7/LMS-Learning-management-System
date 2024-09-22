import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useLocation, useNavigate } from 'react-router-dom';
import { getAllLectures, removeCourseLecture } from '../../redux/Slices/LectureSlice';
import Layout from '../../layout/Layout';

const DisplayLecture = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { state } = useLocation();

    const {lectures} = useSelector((state) => state.lecture);
    const { role } = useSelector((state) => state?.auth)
    console.log("lectiure: ",lectures)

    const [currentVideo, setCurrentVideo] = useState(0);

    useEffect(() => {
        console.log(state._id)
        if (!state) navigate("/courses")
        dispatch(getAllLectures(state._id))
    }, [])

    const onLectureDelete = async (courseId, lectureId) => {
        console.log(courseId, lectureId);
        await dispatch(removeCourseLecture({courseId: courseId, lectureId: lectureId}));
        await dispatch(getAllLectures(courseId));
    }

    return (
        <Layout>
            <div className="flex flex-col gap-10 items-center justify-center min-h-[80vh] text-wihte">
                <div className="text-center text-2xl font-semibold text-yellow-500">
                    Course Name: {state?.title}
                </div>

                {(lectures && lectures.length > 0 ) ?  
                    (<div className="flex justify-center gap-10 w-full">
                    {/* left section for playing videos and displaying course details to admin */}
                   <div className="space-y-5 w-[28rem] h-[25rem] p-2 rounded-lg shadow-[0_0_10px_black]">
                        <video 
                            src={lectures && lectures[currentVideo]?.lecture?.secure_url}
                            className="object-fill rounded-tl-lg rounded-tr-lg w-full"   
                            controls
                            disablePictureInPicture
                            muted
                            controlsList="nodownload"

                        >
                        </video>    
                        <div>
                            <h1>
                                <span className="text-yellow-500"> Title: {" "}
                                </span>
                                {lectures && lectures[currentVideo]?.title}
                            </h1>
                            <p>
                                <span className="text-yellow-500 line-clamp-4">
                                    Description: {" "}
                                </span>
                                {lectures && lectures[currentVideo]?.description}
                            </p>
                        </div>
                   </div>

                   {/* right section for displaying list of lectres */}
                   <ul className="w-[28rem] p-2 rounded-lg shadow-[0_0_10px_black] space-y-4">
                        <li className="font-semibold text-xl text-yellow-500 flex items-center justify-between">
                            <p>Lectures list</p>
                            {role === "ADMIN" && (
                                <button onClick={() => navigate("/course/addlecture", {state: {...state}})} className="btn btn-primary btn-sm rounded-md font-semibold text-sm text-white">
                                    Add new lecture
                                </button>
                            )}
                        </li> 
                        {lectures && 
                            lectures.map((lecture, idx) => {
                                return (
                                    <li className="space-y-2" key={lecture._id} >
                                        <p className="cursor-pointer hover:text-white" onClick={() => setCurrentVideo(idx)}>
                                            <span>
                                                {" "} Lecture {idx + 1} : {" "}
                                            </span>
                                            {lecture?.title}
                                        </p>
                                        {role === "ADMIN" && (
                                            <button onClick={() => onLectureDelete(state?._id, lecture?._id)} className="btn btn-error btn-sm px-2 py-1 rounded-md font-semibold text-sm text-white">
                                                Delete
                                            </button>
                                        )}
                                    </li>
                                )
                            })    
                        }
                   </ul>
                </div>) : (
                    role === "ADMIN" && (
                        <button onClick={() => navigate("/course/addlecture", {state: {...state}})} className="btn-primary px-2 py-1 rounded-md font-semibold text-sm">
                            Add new lecture
                        </button>
                    )
                )}
            </div>
        </Layout>
    )
}

export default DisplayLecture