import React, { useEffect, useMemo } from 'react'
import CourseCard from '../../components/CourseCard'
import { useDispatch, useSelector } from 'react-redux';
import { getAllCourses } from '../../redux/Slices/CourseSlice';
import Layout from '../../layout/Layout';

const CourseList = () => {
    const dispatch = useDispatch();

    const { courseData, searchQuery } = useSelector((state) => state.course);
    console.log("courseData:", courseData)

    async function loadCourses() {
        await dispatch(getAllCourses());
    }

    useEffect(() => {
        loadCourses();
    }, []);

    const filteredCourses = useMemo(() => {
        if (!searchQuery) return courseData;
        return courseData.filter(course =>
            course.title.toLowerCase().includes(searchQuery.toLowerCase())
        );
    }, [courseData, searchQuery]);
    
    return (
        <Layout>
            <div className="min-h-[90vh] pt-12 pl-20 flex flex-col gap-10 text-white">
                <h1 className="text-center text-3xl font-semibold mb-5">
                    Explore the courses made by 
                    
                    <span className="font-bold text-yellow-500">
                    <span> Industry experts</span> 
                    </span>
                </h1>
                <div className="mb-10 flex flex-wrap gap-14">
                    {filteredCourses.length > 0 ? (
                        filteredCourses.map((element) => (
                            <CourseCard key={element._id} data={element} />
                        ))
                    ) : (
                        <p>No courses found matching your search.</p>
                    )}
                </div>


            </div>

        </Layout>
    )
}

export default CourseList