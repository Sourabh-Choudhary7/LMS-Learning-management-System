import { Router } from 'express';
import {
    contactUs,
    userStats,
} from '../controllers/miscellaneous.controller.js';
import { authorizeRoles, isLoggedIn } from '../middlewares/auth.middleware.js';
import { deleteUserByAdmin, getAllUsersByAdmin, updateUserByAdmin } from '../controllers/user.controller.js';
import upload from '../middlewares/multer.middleware.js';

const router = Router();

// {{URL}}/api/v1/
router.route('/contact').post(contactUs);
router
    .route('/admin/stats/users')
    .get(isLoggedIn, authorizeRoles('ADMIN'), userStats);

// Admin can do CRUD operations on User
router.get('/admin/all-users', isLoggedIn, authorizeRoles('ADMIN'), getAllUsersByAdmin);
router.put('/admin/update/:userId', isLoggedIn, authorizeRoles('ADMIN'), upload.single("avatar"), updateUserByAdmin);
router.delete('/admin/delete/:userId', isLoggedIn, authorizeRoles('ADMIN'), deleteUserByAdmin)

export default router;
