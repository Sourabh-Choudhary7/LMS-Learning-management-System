import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../../helpers/axiosInstance'
import toast from 'react-hot-toast';

const initialState = {
    isLoggedIn: localStorage.getItem('isLoggedIn') || false,
    role: localStorage.getItem('role') || "",
    // data: localStorage.getItem('data') || {}
    data: localStorage.getItem('data') ? JSON.parse(localStorage.getItem('data')) : null
}
// function to handle signup
export const createAccount = createAsyncThunk("/auth/signup", async (data) => {
    try {
        let res = axiosInstance.post("users/register", data);

        toast.promise(res, {
            loading: "Wait! Creating your account",
            success: (data) => {
                return data?.data?.message;
            },
            error: "Failed to create account",
        });

        // getting response resolved here
        res = await res;
        return res.data;
    } catch (error) {
        toast.error(error?.response?.data?.message);
    }
});

export const login = createAsyncThunk("/auth/login", async (data) => {
    try {
        let res = axiosInstance.post("users/login", data);

        toast.promise(res, {
            loading: "Loading...",
            success: (data) => {
                return data?.data?.message;
            },
            error: "Failed to log in",
        });

        // getting response resolved here
        res = await res;
        return res.data;
    } catch (error) {
        toast.error(error?.response?.data?.message);
        return rejectWithValue(error?.response?.data);
    }
});

export const logout = createAsyncThunk("/auth/logout", async (data) => {
    try {
        let res = axiosInstance.get("users/logout");

        toast.promise(res, {
            loading: "Loading...",
            success: (data) => {
                return data?.data?.message;
            },
            error: "Failed to logout",
        });

        // getting response resolved here
        res = await res;
        return res.data;
    } catch (error) {
        toast.error(error?.response?.data?.message);
    }
});

// function to fetch user data
// export const getUserData = createAsyncThunk("/user/details", async () => {
//     try {
//         const res = await axiosInstance.get("/users/me");
//         return res?.data;
//     } catch (error) {
//         toast.error(error.message);
//     }
// });

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
    },
    extraReducers: (builder) => {
        builder
            // for user login
            .addCase(login.fulfilled, (state, action) => {
                localStorage.setItem("data", JSON.stringify(action?.payload?.user));
                localStorage.setItem("isLoggedIn", true);
                localStorage.setItem("role", action?.payload?.user?.role);
                state.isLoggedIn = true;
                state.data = action?.payload?.user;
                state.role = action?.payload?.user?.role;
            })
            // for user logout
            .addCase(logout.fulfilled, (state) => {
                localStorage.clear();
                state.isLoggedIn = false;
                state.data = {};
            })
            // // for user details
            // .addCase(getUserData.fulfilled, (state, action) => {
            //     localStorage.setItem("data", JSON.stringify(action?.payload?.user));
            //     localStorage.setItem("isLoggedIn", true);
            //     state.isLoggedIn = true;
            //     state.data = action?.payload?.user;
            //     state.role = action?.payload?.user?.role;
            // });
    }
});

export const { } = authSlice.actions;
export default authSlice.reducer;

