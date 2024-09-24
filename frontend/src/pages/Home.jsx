import React from 'react'
import Layout from '../layout/Layout'
import homePageMainImage from "../assets/homePageMainImage.png";
import { Link } from "react-router-dom";

function Home() {
  return (
    <Layout>
      <div className="pt-10 text-white flex items-center justify-center gap-10 mx-16 h-[80vh] max-md:flex-col-reverse max-md:flex-wrap">
        {/* for platform details */}
        <div className="w-1/2 space-y-6 max-md:w-full">
          <h1 className="text-5xl font-semibold max-md:text-xl">
            Find out best{" "}
            <span className="text-yellow-500 font-bold">Online Courses</span>
          </h1>
          <p className="text-xl text-gray-200 max-md:text-l">
            We have a large library of courses taught by highly skilled and
            qualified faculities at a very affordable cost.
          </p>

          {/* for buttons */}
          <div className="space-x-6 max-md:flex">
            <Link to={"/courses"}>
              <button className="md:bg-yellow-500 md:px-5 md:py-3 rounded-md font-semibold text-lg cursor-pointer md:hover:bg-yellow-600 transition-all ease-in-out duration-300 max-md:btn max-md:btn-sm max-md:btn-primary">
                Explore Courses
              </button>
            </Link>
            <Link to={"/contact"}>
              <button className="md:border md:border-yellow-500 md:px-5 md:py-3 rounded-md font-semibold text-lg cursor-pointer md:hover:border-yellow-600 transition-all ease-in-out duration-300 max-md:btn max-md:btn-sm max-md:btn-secondary">
                Contact Us
              </button>
            </Link>
          </div>
        </div>

        {/* right section for image */}
        <div className="w-1/2 flex items-center justify-center max-md:w-full">
          <img src={homePageMainImage} alt="home page image" />
        </div>
      </div>
    </Layout>
  )
}

export default Home
