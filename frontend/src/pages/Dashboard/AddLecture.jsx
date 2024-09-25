import React, { useEffect, useState } from 'react';
import Layout from '../../layout/Layout';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { AiOutlineArrowLeft } from 'react-icons/ai';
import { addCourseLecture, getAllLectures } from '../../redux/Slices/LectureSlice';
import { toast } from 'react-hot-toast';

const AddLecture = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();
    const courseDetails = location.state;

    // loading
    const [isLoading, setIsLoading] = useState(false);

    const [lectureData, setLectureData] = useState({
        title: '',
        description: '',
        id: courseDetails?._id || '',
        previewVideo: '',
        lectureVideo: undefined
    });

    useEffect(() => {
        if (!courseDetails) {
            navigate("/courses");
        }
    }, [courseDetails, navigate]);

    const handleVideo = (e) => {
        const file = e.target.files[0];
        if (file) {
            const validTypes = ['video/mp4', 'video/webm', 'video/ogg'];
            if (!validTypes.includes(file.type)) {
                toast.error("Unsupported video format. Please upload MP4, WEBM, or OGG.");
                return;
            }
            const maxSize = 100 * 1024 * 1024; // 100MB
            if (file.size > maxSize) {
                toast.error("Video size exceeds 100MB.");
                return;
            }
            const source = URL.createObjectURL(file);
            setLectureData(prevData => ({
                ...prevData,
                lectureVideo: file,
                previewVideo: source
            }));
        }
    };

    const handleUserInput = (e) => {
        const { name, value } = e.target;
        setLectureData(prevData => ({
            ...prevData,
            [name]: value
        }));
    };

    const AddLectureToCourse = async (e) => {
        e.preventDefault();
        if (!lectureData.title || !lectureData.description || !lectureData.lectureVideo) {
            toast.error("Please add all the fields");
            return;
        }
        if (lectureData.description.length < 10) {
            toast.error("Lecture description should be at least 10 characters long");
            return;
        }
        setIsLoading(true);

        const res = await dispatch(addCourseLecture(lectureData));
        dispatch(getAllLectures(lectureData.id))

        if (res?.payload?.success) {
            setIsLoading(false);
            navigate(-1);
        }
        setLectureData({
            id: courseDetails?._id,
            title: '',
            description: '',
            previewVideo: '',
            lectureVideo: undefined
        });
    };

    return (
        <Layout>
            <div className="flex items-center justify-center h-[80vh]">
                <form
                    onSubmit={AddLectureToCourse}
                    className="flex flex-col justify-center gap-5 rounded-lg p-4 text-white w-[700px] my-10 shadow-[0_0_10px_black] relative"
                >
                    <h1 className="text-center text-2xl font-bold">
                        Add New Lecture
                    </h1>

                    <main className="grid grid-cols-2 gap-x-10">
                        <div className="gap-y-6">
                            <div>
                                {lectureData.previewVideo ? (
                                    <video
                                        muted
                                        src={lectureData.previewVideo}
                                        controls
                                        controlsList="nodownload nofullscreen"
                                        disablePictureInPicture
                                        className="object-fill rounded-tl-lg rounded-tr-lg w-full"
                                    >
                                        Your browser does not support the video tag.
                                    </video>
                                ) : (
                                    <div className="h-48 border flex items-center justify-center cursor-pointer">
                                        <label htmlFor="lecture" className="font-semibold text-cl cursor-pointer">
                                            Choose your video
                                        </label>
                                        <input
                                            type="file"
                                            className="hidden"
                                            id="lecture"
                                            name="lecture"
                                            onChange={handleVideo}
                                            accept="video/mp4, video/webm, video/ogg"
                                        />
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="flex flex-col gap-1">
                            <div className="flex flex-col gap-1">
                                <label className="text-lg font-semibold" htmlFor="title">
                                    Lecture Title
                                </label>
                                <input
                                    type="text"
                                    name="title"
                                    id="title"
                                    placeholder="Enter lecture title"
                                    className="bg-transparent px-2 py-1 border"
                                    value={lectureData.title}
                                    onChange={handleUserInput}
                                />
                            </div>
                            <div className="flex flex-col gap-1">
                                <label className="text-lg font-semibold" htmlFor="description">
                                    Lecture Description
                                </label>
                                <textarea
                                    name="description"
                                    id="description"
                                    placeholder="Enter lecture description"
                                    className="bg-transparent px-2 py-1 h-24 overflow-y-scroll resize-none border"
                                    value={lectureData.description}
                                    onChange={handleUserInput}
                                />
                            </div>
                        </div>
                    </main>

                    <button
                        type="submit"
                        className={`w-full py-2 rounded-sm font-semibold text-lg cursor-pointer ${isLoading ? 'bg-gray-600 hover:none cursor-wait' : 'bg-yellow-600 hover:bg-yellow-500'}  transition-all ease-in-out duration-300`}
                        disabled={isLoading}
                    >
                        {isLoading ? "Adding Lecture..." : "Add Lecture"}
                    </button>

                </form>
            </div>
        </Layout>
    );
};

export default AddLecture;
