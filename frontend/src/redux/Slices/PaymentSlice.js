import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../../helpers/axiosInstance';
import toast from 'react-hot-toast';

const initialState = {
    stripeKey: "",
    subscription_id: "",
    isPaymentVerified: false,
    allPayments: {},
    finalMonths: {},
    monthlySalesRecord: []
}

export const getStripePayKey = createAsyncThunk("/payments/getStripeKey", async () => {
    try {
        const res = axiosInstance.get("/payments/stripe-key");
        console.log("key received", res)
        return (await res).data;
    } catch (error) {
        toast.error(error?.response?.data?.message);
    }
})

export const buySubcription = createAsyncThunk("/payments/purchaseCourse", async () => {
    try {
        const res = axiosInstance.post("/payments/subscribe");
        console.log("Purchase Course Subscription: ",res);
        return (await res).data;
    } catch (error) {
        toast.error(error?.response?.data?.message);
    }
})

export const verifyPayment = createAsyncThunk("/payments/verifyPayment", async (session_id) => {
    try {
        const res = axiosInstance.post("/payments/verify", session_id);
        console.log("verify Payment: ",res);
        return (await res).data;
    } catch (error) {
        toast.error(error?.response?.data?.message);
    }
})

export const cancelCourseBundle = createAsyncThunk("/payments/cancel", async () => {
    try {
        const res = axiosInstance.post("/payments/unsubscribe");
        toast.promise(res, {
            loading: "unsubscribing the Course Bundle",
            success: (data) => {
                return data?.data?.message
            },
            error: "Failed to ubsubscribe"
        })
        return (await res).data;
    } catch(error) {
        toast.error(error?.response?.data?.message);
    }
});

export const getPaymentRecord = createAsyncThunk("/payments/record", async () => {
    try {
        const response = axiosInstance.get("/payments?count=100", );
        toast.promise(response, {
            loading: "Getting the payment records",
            success: (data) => {
                return data?.data?.message
            },
            error: "Failed to get payment records"
        })
        return (await response).data;
    } catch(error) {
        toast.error("Operation failed");
    }
});



const paymentSlice = createSlice({
    name: 'payment',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(getStripePayKey.fulfilled, (state, action) => {
                state.stripeKey = action?.payload?.key;
            })
            .addCase(buySubcription.fulfilled, (state, action) => {
                console.log("action of buySubcription", action)
                state.subscription_id = action?.payload?.subscription_id;
            })
            .addCase(verifyPayment.fulfilled, (state, action) => {
                console.log(action);
                toast.success(action?.payload?.message);
                state.isPaymentVerified = action?.payload?.success;
            })
            .addCase(verifyPayment.rejected, (state, action) => {
                console.log(action);
                toast.success(action?.payload?.message);
                state.isPaymentVerified = action?.payload?.success;
            })
            .addCase(getPaymentRecord.fulfilled, (state, action) => {
                state.allPayments = action?.payload?.allPayments;
                state.finalMonths = action?.payload?.finalMonths;
                state.monthlySalesRecord = action?.payload?.monthlySalesRecord;
            })
    }
})

export const { } = paymentSlice.actions;
export default paymentSlice.reducer;