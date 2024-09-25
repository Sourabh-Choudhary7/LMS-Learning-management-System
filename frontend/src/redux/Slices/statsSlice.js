import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../helpers/axiosInstance";
import toast from 'react-hot-toast';

const initialState = {
    allUsersCount: 0,
    subscribedUsersCount: 0,
};

// function to get the stats data from backend
export const getStatsData = createAsyncThunk("getstat", async () => {
    try {
        const res = axiosInstance.get("/admin/stats/users");
        toast.promise(res, {
            loading: "Getting the stats...",
            success: (data) => {
                return data?.data?.message;
            },
            error: "Failed to load stats",
        });

        const response = await res;
        return response.data;
    } catch (error) {
        toast.error(error?.response?.data?.message);
    }
});

export const getInTouch = createAsyncThunk("/contact", async (data) => {
    console.log("formData", data)
    try {
        let res = axiosInstance.post("/contact", data);

        toast.promise(res, {
            loading: "Wait! Your request is sending...",
            success: (data) => {
                return data?.data?.message;
            },
            error: "Failed to send your request",
        });

        // getting response resolved here
        res = await res;
        return res.data;
    } catch (error) {
        toast.error(error?.response?.data?.message);
    }
});


const statsSlice = createSlice({
    name: "stats",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(getStatsData.fulfilled, (state, action) => {
            state.allUsersCount = action?.payload?.allUsersCount;
            state.subscribedUsersCount = action?.payload?.subscribedUsersCount;
        });
    },
});

export const { } = statsSlice.actions;

export default statsSlice.reducer;