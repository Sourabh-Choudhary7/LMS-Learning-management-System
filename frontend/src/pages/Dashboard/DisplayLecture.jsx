import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useLocation, useNavigate } from 'react-router-dom';
import { getAllLectures } from '../../redux/Slices/LectureSlice';
import Layout from '../../layout/Layout';

const DisplayLecture = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { state } = useLocation();

    const { lecture } = useSelector((state) => state?.lecture)
    const { role } = useSelector((state) => state?.auth)


    useEffect(() => {
        console.log(state._id)
        if (!state) navigate("/courses")
        dispatch(getAllLectures(state._id))
    }, [])




    return (
        <Layout>
            <div>DisplayLecture</div>
        </Layout>
    )
}

export default DisplayLecture