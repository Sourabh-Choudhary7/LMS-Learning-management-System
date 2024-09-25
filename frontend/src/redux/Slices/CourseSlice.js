import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../helpers/axiosInstance";
import toast from 'react-hot-toast';

const initialState = {
    courseData: [],
    searchQuery: ''
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

export const removeCourse = createAsyncThunk("/course/delete", async (id) => {
    try {
        let res = axiosInstance.delete(`/courses/${id}`);
        toast.promise(res, {
            loading: "Deleting course data...",
            success: "Courses delete successfully",
            error: "Failed to delete the course",
        });
        res = await res
        return res.data.courses;
    } catch (error) {
        toast.error(error?.response?.data?.message);
        throw error;
    }
});

export const updateCourse = createAsyncThunk("/course/update", async (data) => {
    const formData = new FormData();
    formData.append("title", data[1].title);
    formData.append("description", data[1].description);
    formData.append("createdBy", data[1].createdBy);
    formData.append("category", data[1].category);
    
    if (data[1].thumbnail) {
        formData.append("thumbnail", data[1].thumbnail);
    }

    try {
        let res = axiosInstance.put(`/courses/${data[0]}`, formData);  // Check if data[0] holds the correct course ID
        toast.promise(res, {
            loading: "Updating course data...",
            success: "Course updated successfully",
            error: "Failed to update the course",
        });
        return (await res).data;
    } catch (error) {
        toast.error(error?.response?.data?.message);
        throw error;
    }
});



const courseSlice = createSlice({
    name: "courses",
    initialState,
    reducers: {
        setSearchQuery: (state, action) => {
            state.searchQuery = action.payload;
        },
        clearSearchQuery: (state) => {
            state.searchQuery = "";
        }
    },
    extraReducers: (builder) => {
        builder.addCase(getAllCourses.fulfilled, (state, action) => {
            if (action.payload) {
                state.courseData = [...action.payload];
            }
        });
    }
});

export const { setSearchQuery, clearSearchQuery } = courseSlice.actions;

export default courseSlice.reducer;
