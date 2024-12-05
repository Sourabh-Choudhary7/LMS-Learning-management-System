import React, { useEffect, useMemo, useState } from 'react';
import CourseCard from '../../components/CourseCard';
import { useDispatch, useSelector } from 'react-redux';
import { getAllCourses } from '../../redux/Slices/CourseSlice';
import Layout from '../../layout/Layout';

const CourseList = () => {
    const dispatch = useDispatch();

    const { courseData, searchQuery } = useSelector((state) => state.course);

    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 6;

    async function loadCourses() {
        await dispatch(getAllCourses());
    }

    useEffect(() => {
        loadCourses();
    }, []);

    const filteredCourses = useMemo(() => {
        if (!searchQuery) return courseData;
        return courseData.filter((course) =>
            course.title.toLowerCase().includes(searchQuery.toLowerCase())
        );
    }, [courseData, searchQuery]);

    // Calculate pagination variables
    const totalPages = Math.ceil(filteredCourses.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const paginatedCourses = filteredCourses.slice(
        startIndex,
        startIndex + itemsPerPage
    );

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

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
                    {paginatedCourses.length > 0 ? (
                        paginatedCourses.map((element) => (
                            <CourseCard key={element._id} data={element} />
                        ))
                    ) : (
                        <p className="text-lg">No courses found matching your search.</p>
                    )}
                </div>

                {/* Pagination Controls */}
                <div className="flex justify-center items-center gap-4">
                    <button
                        className="bg-gray-700 text-white px-4 py-2 rounded disabled:opacity-50"
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                    >
                        Previous
                    </button>
                    <div className="flex gap-2">
                        {Array.from({ length: totalPages }, (_, index) => (
                            <button
                                key={index}
                                className={`px-3 py-1 rounded ${
                                    currentPage === index + 1
                                        ? 'bg-yellow-500 text-black font-bold'
                                        : 'bg-gray-700 text-white'
                                }`}
                                onClick={() => handlePageChange(index + 1)}
                            >
                                {index + 1}
                            </button>
                        ))}
                    </div>
                    <button
                        className="bg-gray-700 text-white px-4 py-2 rounded disabled:opacity-50"
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage === totalPages}
                    >
                        Next
                    </button>
                </div>
            </div>
        </Layout>
    );
};

export default CourseList;
