import { Router } from 'express'
import { authorizeRoles, isLoggedIn } from '../middlewares/auth.middleware.js';
import { deleteCourseById, updateCourseById, createCourse, getAllCourses, getLecturesByCourseId, addLectureToCourseById, removeLectureFromCourse } from '../controllers/course.controller.js';
import upload from '../middlewares/multer.middleware.js';

const router = Router();

router.route('/')
    .get(getAllCourses)
    .post(
        isLoggedIn,
        authorizeRoles('ADMIN'),
        upload.single('thumbnail'),
        createCourse
    )
    .delete(
        isLoggedIn,
        authorizeRoles('ADMIN'),
        removeLectureFromCourse);

router.route('/:id')
    .get(
        isLoggedIn,
        // authorizeRoles('ADMIN'),getLecturesByCourseId // //prefer this one but I am using below one for both admin and user role because I didn't implemented checkout payment in frontend
        authorizeRoles('ADMIN', 'USER'), getLecturesByCourseId
    )
    .post(
        isLoggedIn,
        authorizeRoles('ADMIN'),
        upload.single('lecture'),
        addLectureToCourseById
    )
    .put(
        isLoggedIn,
        authorizeRoles('ADMIN'),
        upload.single('thumbnail'),
        updateCourseById
    )
    .delete(
        isLoggedIn,
        authorizeRoles('ADMIN'),
        deleteCourseById
    );

export default router;