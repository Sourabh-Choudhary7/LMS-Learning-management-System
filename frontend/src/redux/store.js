import { configureStore } from '@reduxjs/toolkit';
import authSliceReducer from './Slices/AuthSlice';
import courseSliceReducer from './Slices/CourseSlice';
import lectureSliceReducer from './Slices/LectureSlice';
import statsSliceReducer from './Slices/statsSlice';
import PaymentSliceReducer from './Slices/PaymentSlice';


const store = configureStore({
    reducer: {
        auth: authSliceReducer,
        course: courseSliceReducer,
        lecture: lectureSliceReducer,
        payment: PaymentSliceReducer,
        stats: statsSliceReducer,
    },
    devTools: true
});

export default store;