// import express from "express";
import { Router } from 'express'
import { changePassword, deactivateAccount, deleteAccount, forgotPassword, getProfile, login, logout, register, resetPassword, toggleTwoFactorAuth, twoFactorAuthentication, updateUser } from '../controllers/user.controller.js';
import { isLoggedIn } from '../middlewares/auth.middleware.js';
import upload from '../middlewares/multer.middleware.js';

const router = Router();

router.post('/register', upload.single("avatar"), register)
router.post('/login', login)
router.post('/login/two-factor-auth', twoFactorAuthentication)
router.put('/toggle-2fa', isLoggedIn, toggleTwoFactorAuth)
router.get('/logout', logout)
router.get('/me', isLoggedIn, getProfile)
router.post('/reset', forgotPassword)
router.post('/reset/:resetToken', resetPassword)
router.post('/change-password', isLoggedIn, changePassword)
router.put("/update", isLoggedIn, upload.single("avatar"), updateUser);

// User can delete and deactivate their account
router.delete('/account/delete', isLoggedIn, deleteAccount);
router.put('/account/deactivate', isLoggedIn, deactivateAccount);

export default router;
