import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../../helpers/axiosInstance';
import toast from 'react-hot-toast';

const initialState = {
    lectures: []
}

export const getAllLectures = createAsyncThunk("/course/lecture/get", async (c_id) => {
    try {
        let res = axiosInstance.get(`/courses/${c_id}`);
        toast.promise(res, {
            loading: "Fetching course lectures",
            success: "Lectures fetched successfully",
            error: "Failed to load the lectures"
        });
        return (await res).data
        
    } catch (error) {
        toast.error(error?.response?.data?.message)
    }

})

export const addCourseLecture = createAsyncThunk("/course/lectures/add", async (data) => {
    try {
        let res = axiosInstance.post(`/courses/${data.id}`, data);
        toast.promise(res, {
            loading: "Adding new lecture",
            success: "Lecture added successfully",
            error: "Failed to add the lecture"
        });
        return (await res).data
        
    } catch (error) {
        toast.error(error?.response?.data?.message)
    }
}) 

export const removeCourseLecture = createAsyncThunk("/course/lectures/remove", async (data) => {
    try {
        let res = axiosInstance.delete(`/courses?courseId=${data.courseId}&lectureId=${data.lectureId}`);
        toast.promise(res, {
            loading: "Removing lecture",
            success: "Lecture removed successfully",
            error: "Failed to remove the lecture"
        });
        return (await res).data
        
    } catch (error) {
        toast.error(error?.response?.data?.message)
    }
}) 

const lectureSlice = createSlice({
    name: "lecture",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(getAllLectures.fulfilled, (state, action) => {
            console.log(action);
            state.lectures = action?.payload?.lectures;
        })
        .addCase(addCourseLecture.fulfilled, (state, action) => {
            console.log(action);
            state.lectures = action?.payload?.course?.lectures;
        })
    }
});

export default lectureSlice.reducer;