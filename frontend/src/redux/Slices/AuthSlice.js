import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../../helpers/axiosInstance'
import toast from 'react-hot-toast';

const initialState = {
    isLoggedIn: localStorage.getItem('isLoggedIn') || false,
    role: localStorage.getItem('role') || "",
    // data: localStorage.getItem('data') || {}
    data: localStorage.getItem('data') ? JSON.parse(localStorage.getItem('data')) : null,
    tfaPending: false,
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

export const twoFactorAuth = createAsyncThunk("/auth/login/twoStepAuth", async (data) => {
    try {
        let res = axiosInstance.post("users/login/two-factor-auth", data);

        toast.promise(res, {
            loading: "Verifying the OTP...",
            success: (data) => {
                return data?.data?.message;
            },
            error: "Failed to log in",
        });

        res = await res;
        return res.data;
    } catch (error) {
        toast.error(error?.response?.data?.message);
        return rejectWithValue(error?.response?.data);
    }
});

export const toggleTwoFactorAuth = createAsyncThunk("/auth/user/toggleTwoFactor", async (userId) => {
    try {
        let res = axiosInstance.post("users/toggle-2fa", userId);

        toast.promise(res, {
            loading: "Setting Two Factor Authentication...",
            success: (data) => {
                return data?.data?.message;
            },
            error: "Failed to update Two Factor Authentication",
        });

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
export const getUserData = createAsyncThunk("/user/details", async () => {
    try {
        const res = await axiosInstance.get("/users/me");
        return res?.data;
    } catch (error) {
        toast.error(error.message);
    }
});

// function to handle update user
export const updateUserProfile = createAsyncThunk("/auth/update/profile", async (data) => {
    try {
        let res = axiosInstance.put("users/update", data[1]);
        toast.promise(res, {
            loading: "Wait! updating user profile...",
            success: (data) => {
                return data?.data?.message;
            },
            error: "Failed to update user profile",
        });

        // getting response resolved here
        res = await res;
        return res.data;
    } catch (error) {
        toast.error(error?.response?.data?.message);
    }
});

// function to handle change password

export const changePassword = createAsyncThunk("/auth/update/password", async (data) => {
    try {
        let res = axiosInstance.post("users/change-password", data);

        toast.promise(res, {
            loading: "Wait! updating password...",
            success: (data) => {
                return data?.data?.message;
            },
            error: "Failed to update password",
        });

        // getting response resolved here
        res = await res;
        return res.data;
    } catch (error) {
        toast.error(error?.response?.data?.message);
    }
});

// function to handle forgot password
export const forgotPassword = createAsyncThunk("/auth/reset/password", async (data) => {
    try {
        let res = axiosInstance.post("users/reset", data);

        toast.promise(res, {
            loading: "Wait! reset password link is sending to your email...",
            success: (data) => {
                return data?.data?.message;
            },
            error: "Failed to update password",
        });

        // getting response resolved here
        res = await res;
        return res.data;
    } catch (error) {
        toast.error(error?.response?.data?.message);
    }
});

// function to handle forgot password
export const resetPassword = createAsyncThunk("/auth/change/password", async ({ resetToken, data }, thunkAPI) => {
    try {
        let res = axiosInstance.post(`users/reset/${resetToken}`, data);

        toast.promise(res, {
            loading: "Wait! updating password...",
            success: (data) => {
                return data?.data?.message;
            },
            error: "Failed to update password",
        });

        // getting response resolved here
        res = await res;
        return res.data;
    } catch (error) {
        toast.error(error?.response?.data?.message);
        return thunkAPI.rejectWithValue(error?.response?.data?.message);
    }
});

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
    },
    extraReducers: (builder) => {
        builder
            // for user login
            .addCase(login.fulfilled, (state, action) => {
                if (action.payload.success && action.payload.message.includes("OTP sent")) {
                    state.isLoggedIn = false; // User is not logged in yet
                    state.tfaPending = true;   // Set flag indicating 2FA is pending
                } else if (action.payload.success) {
                    const { user } = action.payload; // Ensure you have user data to work with
                    if (user) {
                        localStorage.setItem("data", JSON.stringify(user));
                        localStorage.setItem("isLoggedIn", true);
                        localStorage.setItem("role", user.role);
                        state.isLoggedIn = true;
                        state.data = user;
                        state.role = user.role;
                        state.tfaPending = false; // Reset if login is successful
                    }
                }
            })
            // Handle Two-Factor Auth Verification
            .addCase(twoFactorAuth.fulfilled, (state, action) => {
                const { user } = action?.payload;

                // Once OTP is verified, store user data and set loggedIn to true
                localStorage.setItem("data", JSON.stringify(user));
                localStorage.setItem("isLoggedIn", true);
                localStorage.setItem("role", user?.role);

                state.isLoggedIn = true;
                state.data = user;
                state.role = user?.role;
                state.tfaPending = false; // Reset tfaPending after successful OTP verification
            })
            // for user logout
            .addCase(logout.fulfilled, (state) => {
                localStorage.clear();
                state.isLoggedIn = false;
                state.data = {};
            })
            // for user details
            .addCase(getUserData.fulfilled, (state, action) => {
                if (!action?.payload?.user) return;
                localStorage.setItem("data", JSON.stringify(action?.payload?.user));
                localStorage.setItem("isLoggedIn", true);
                localStorage.setItem("role", action?.payload?.user?.role);
                state.isLoggedIn = true;
                state.data = action?.payload?.user;
                state.role = action?.payload?.user?.role
            });
    }
});

export const { } = authSlice.actions;
export default authSlice.reducer;

