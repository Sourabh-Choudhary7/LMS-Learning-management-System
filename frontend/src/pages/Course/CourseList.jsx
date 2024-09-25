import React, { useEffect, useMemo } from 'react'
import CourseCard from '../../components/CourseCard'
import { useDispatch, useSelector } from 'react-redux';
import { getAllCourses } from '../../redux/Slices/CourseSlice';
import Layout from '../../layout/Layout';

const CourseList = () => {
    const dispatch = useDispatch();

    const { courseData, searchQuery } = useSelector((state) => state.course);

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
            <div className="min-h-[80vh] pt-12 pl-10 pr-10 flex flex-col gap-10 text-white">
                <h1 className="text-center text-4xl font-semibold mb-8 max-md:text-xl">
                    Explore the courses made by{" "}
                    <span className="font-bold text-yellow-500">
                        Industry Experts
                    </span>
                </h1>

                <div className="mb-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
                    {filteredCourses.length > 0 ? (
                        filteredCourses.map((element) => (
                            <CourseCard key={element._id} data={element} />
                        ))
                    ) : (
                        <p className="text-lg">No courses found matching your search.</p>
                    )}
                </div>
            </div>
        </Layout>

    )
}

export default CourseList