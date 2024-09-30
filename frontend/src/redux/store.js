import { configureStore } from '@reduxjs/toolkit';
import authSliceReducer from './Slices/AuthSlice';
import courseSliceReducer from './Slices/CourseSlice';
import lectureSliceReducer from './Slices/LectureSlice';
import statsSliceReducer from './Slices/statsSlice';
import PaymentSliceReducer from './Slices/PaymentSlice';
import modeSliceReducer from './Slices/modeSlice';


const store = configureStore({
    reducer: {
        auth: authSliceReducer,
        course: courseSliceReducer,
        lecture: lectureSliceReducer,
        payment: PaymentSliceReducer,
        stats: statsSliceReducer,
        mode: modeSliceReducer
    },
    devTools: true
});

export default store;