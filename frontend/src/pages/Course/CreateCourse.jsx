import React, { useState } from 'react'
import { useDispatch } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom';
import { createCourse } from '../../redux/Slices/CourseSlice'
import { AiOutlineArrowLeft } from 'react-icons/ai';
import Layout from '../../layout/Layout';
import toast from 'react-hot-toast';

const CreateCourse = () => {

  const dispatch = useDispatch();
  const navigate = useNavigate();

  // loading
  const [isLoading, setIsLoading] = useState(false);

  const [courseData, setCourseData] = useState({
    title: "",
    description: "",
    createdBy: "",
    category: "",
    thumnail: null,
    previewImage: ""
  })

  const getThumbnail = (e) => {
    e.preventDefault();
    const uploadedImage = e.target.files[0];
    if (uploadedImage) {
      const fileReader = new FileReader();
      fileReader.readAsDataURL(uploadedImage);
      fileReader.addEventListener("load", function () {
        setCourseData({
          ...courseData,
          thumbnail: uploadedImage,
          previewImage: this.result
        })
      })
    }
  }

  const handleUserInput = (e) => {
    const { name, value } = e.target;
    setCourseData({
      ...courseData,
      [name]: value
    })
  }

  const createNewCourse = async (e) => {
    e.preventDefault();

    if (!courseData.title || !courseData.description || !courseData.createdBy || !courseData.category || !courseData.thumbnail) {
      toast.error("Please add all the fields")
      return;
    }
    if (courseData.description.length < 20) {
      toast.error("Course description should be at least 20 characters long")
      return;
    }

    const formData = new FormData();
    formData.append("title", courseData.title);
    formData.append("description", courseData.description);
    formData.append("createdBy", courseData.createdBy);
    formData.append("category", courseData.category);
    formData.append("thumbnail", courseData.thumbnail);

    setIsLoading(true);

    const res = await dispatch(createCourse(formData));
    if (res?.payload?.success)
      setIsLoading(false);
      navigate("/courses");

    setCourseData({
      title: "",
      description: "",
      createdBy: "",
      category: "",
      thumnail: null,
      previewImage: ""
    })

  }


  return (
    <Layout>
      <div className="flex items-center justify-center h-[100vh]">
        <form
          onSubmit={createNewCourse}
          className="flex flex-col justify-center gap-5 rounded-lg p-4 text-white w-[700px] my-10 shadow-[0_0_10px_black] relative"
        >

          <Link to={"/"} className="absolute top-8 text-2xl link text-accent cursor-pointer">
            <AiOutlineArrowLeft />
          </Link>

          <h1 className="text-center text-2xl font-bold">
            Create New Course
          </h1>

          <main className="grid grid-cols-2 gap-x-10">
            <div className="gap-y-6">
              <div>
                <label htmlFor="image_uploads" className="cursor-pointer">
                  {courseData.previewImage ? (
                    <img
                      className="w-full h-44 m-auto border"
                      src={courseData.previewImage}
                    />
                  ) : (
                    <div className="w-full h-44 m-auto flex items-center justify-center border">
                      <h1 className="font-bold text-lg">Upload your course thumbnail</h1>
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
              <div className="flex flex-col gap-1">
                <label className="text-lg font-semibold" htmlFor="title">
                  Course title
                </label>
                <input
                  type="text"
                  name="title"
                  id="title"
                  placeholder="Enter course title"
                  className="bg-transparent px-2 py-1 border"
                  value={courseData.title}
                  onChange={handleUserInput}
                />
              </div>
            </div>

            <div className="flex flex-col gap-1">
              <div className="flex flex-col gap-1">
                <label className="text-lg font-semibold" htmlFor="createdBy">
                  Course Instructor
                </label>
                <input
                  type="text"
                  name="createdBy"
                  id="createdBy"
                  placeholder="Enter course instructor"
                  className="bg-transparent px-2 py-1 border"
                  value={courseData.createdBy}
                  onChange={handleUserInput}
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-lg font-semibold" htmlFor="category">
                  Course category
                </label>
                <input
                  type="text"
                  name="category"
                  id="category"
                  placeholder="Enter course category"
                  className="bg-transparent px-2 py-1 border"
                  value={courseData.category}
                  onChange={handleUserInput}
                />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-lg font-semibold" htmlFor="description">
                  Course description
                </label>
                <textarea
                  type="text"
                  name="description"
                  id="description"
                  placeholder="Enter course description"
                  className="bg-transparent px-2 py-1 h-24 overflow-y-scroll resize-none border"
                  value={courseData.description}
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
            {isLoading ? "Creating Course..." : "Create Course"}
          </button>


        </form>
      </div>
    </Layout>
  )
}

export default CreateCourse