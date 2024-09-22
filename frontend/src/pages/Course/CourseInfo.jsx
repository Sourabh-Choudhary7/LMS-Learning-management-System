import React, { useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import Layout from '../../layout/Layout';
import { useSelector } from 'react-redux';

const CourseInfo = () => {

    const { state } = useLocation();
    const navigate = useNavigate();
    const { role, data } = useSelector((state) => state.auth);
    console.log(state);

    return (
        <Layout>
            <div className='min-h-[80vh]'>
                <div className="card card-side bg-base-100 shadow-xl">
                    <figure className='h-[60vh] w-[50vw]'>
                        <img
                            style={{ height: '100%', width: '100%' }}
                            src={state?.thumbnail?.secure_url}
                            alt="Thumnail" />
                    </figure>
                    <div className="card-body">
                        <h2 className="card-title font-bold text-yellow-500 flex justify-center">{state?.title}</h2>
                        <h3 className='font-bold text-yellow-500 inline'>Course Description: </h3>
                        <p>{state?.description}</p>
                        <h3>Course Category: <p className='font-bold text-yellow-500 inline'>{state?.category}</p> </h3>

                        <h3>Total No. of Lectures: <span className='font-bold text-yellow-500 inline'>{state?.numberOfLectures}</span></h3>
                        <h3>Course Created By: <span className='font-bold text-yellow-500 inline'>{state?.createdBy}</span></h3>

                        <div className="card-actions flex">
                            <div className='w-1/3'>
                                <button onClick={() => navigate(-1)} className="bg-yellow-600 text-xl rounded-md font-bold px-5 py-3 w-full hover:bg-yellow-500 transition-all ease-in-out duration-300">
                                    Back
                                </button>
                            </div>
                            <div className='w-1/3'>
                                {/* {role === "ADMIN" || data?.subscription?.status === "active" ? (
                                    <button onClick={() => navigate("/course/displaylectures", { state: { ...state } })} className="bg-yellow-600 text-xl rounded-md font-bold px-5 py-3 w-full hover:bg-yellow-500 transition-all ease-in-out duration-300">
                                        Watch lectures
                                    </button>
                                ) : (
                                    <button onClick={() => navigate("/checkout")} className="bg-yellow-600 text-xl rounded-md font-bold px-5 py-3 w-full hover:bg-yellow-500 transition-all ease-in-out duration-300">
                                        Subscribe
                                    </button>
                                )
                                } */}
                                <button onClick={() => navigate("/course/displaylectures", { state: { ...state } })} className="bg-yellow-600 text-xl rounded-md font-bold px-5 py-3 w-full hover:bg-yellow-500 transition-all ease-in-out duration-300">
                                    Watch lectures
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    )
}

export default CourseInfo