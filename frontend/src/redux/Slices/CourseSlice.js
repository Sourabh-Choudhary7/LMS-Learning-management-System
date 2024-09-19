import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../helpers/axiosInstance";
import toast from 'react-hot-toast';

const initialState = {
    courseData: []
}

export const getAllCourses = createAsyncThunk("/course/get", async () => {
    try {
        let res = axiosInstance.get('/courses');
        toast.promise(res, {
            loading: "loading course data...",
            success: "Courses loaded successfully",
            error: "Failed to get the courses",
        });
        res = await res
        return res.data.courses;
    } catch (error) {
        toast.error(error?.response?.data?.message);
        throw error;
    }
});

export const createCourse = createAsyncThunk("/course/create", async (data) => {
    try {
        let res = axiosInstance.post('/courses', data);
        toast.promise(res, {
            loading: "Creating new Course...",
            success: "Course created successfully",
            error: "Failed to create the course",
        });
        res = await res
        return res.data;
    } catch (error) {
        toast.error(error?.response?.data?.message);
        throw error;
    }
});



const courseSlice = createSlice({
    name: "courses",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(getAllCourses.fulfilled, (state, action) => {
            if (action.payload) {
                // console.log("Courses payload:", action.payload);
                state.courseData = [...action.payload];
            }
        });
    }
});


export default courseSlice.reducer;
