// import express from "express";
import { Router } from 'express'
import { changePassword, forgotPassword, getAllUsers, getProfile, login, logout, register, resetPassword, toggleTwoFactorAuth, twoFactorAuthentication, updateUser } from '../controllers/user.controller.js';
import { authorizeRoles, isLoggedIn } from '../middlewares/auth.middleware.js';
import upload from '../middlewares/multer.middleware.js';

const router = Router();


router.get('/', isLoggedIn, authorizeRoles('ADMIN'), getAllUsers)
router.post('/register', upload.single("avatar"), register)
router.post('/login', login)
router.post('/login/two-factor-auth', twoFactorAuthentication)
router.post('/toggle-2fa', isLoggedIn, toggleTwoFactorAuth)
router.get('/logout', logout)
router.get('/me', isLoggedIn, getProfile)
router.post('/reset', forgotPassword)
router.post('/reset/:resetToken', resetPassword)
router.post('/change-password', isLoggedIn, changePassword)
router.put("/update", isLoggedIn, upload.single("avatar"), updateUser);
export default router;
