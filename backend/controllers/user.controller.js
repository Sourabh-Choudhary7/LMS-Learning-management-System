import AppError from "../utils/error.utils.js";
import User from '../models/user.model.js';
import cloudinary from 'cloudinary';
import fs from 'fs/promises';
import sendEmail from "../utils/sendEmail.js";
import crypto from 'crypto';
import requestIp from 'request-ip';
import useragent from 'express-useragent';
import { getGeoLocation } from "../utils/geoLocation.utils.js";
import { logLoginActivity } from "../utils/loginActivity.utils.js";

const cookieOptions = {
    maxAge: 7 * 24 * 60 * 60 * 1000,
    httpOnly: true,
    secure: true
}

const register = async (req, res, next) => {

    try {

        const { fullName, email, password } = req.body;

        if (!fullName || !email || !password) {
            return next(new AppError('All fields are required', 400));
        }

        const userExists = await User.findOne({ email });

        // If user exists send the reponse
        if (userExists) {
            return next(new AppError('Email already exists', 409));
        }

        // Create new user with the given necessary data and save to DB
        const user = await User.create({
            fullName,
            email,
            password,
            avatar: {
                public_id: email,
                secure_url:
                    'https://res.cloudinary.com/du9jzqlpt/image/upload/v1674647316/avatar_drzgxv.jpg',
            },
        });

        // If user not created send message response
        if (!user) {
            return next(
                new AppError('User registration failed, please try again later', 400)
            );
        }

        // Run only if user sends a file
        // console.log("file: ", JSON.stringify(req.file));
        if (req.file) {
            try {
                const result = await cloudinary.v2.uploader.upload(req.file.path, {
                    folder: 'lms',
                    width: 250,
                    height: 250,
                    gravity: 'faces',
                    crop: 'fill',
                });

                // If success
                if (result) {
                    // Set the public_id and secure_url in DB
                    user.avatar.public_id = result.public_id;
                    user.avatar.secure_url = result.secure_url;

                    // After successful upload remove the file from local storage
                    fs.rm(`uploads/${req.file.filename}`);
                }
            } catch (error) {
                return next(
                    new AppError(error || 'File not uploaded, please try again', 400)
                );
            }
        }

        // Save the user object
        await user.save();

        // Generating a JWT token
        const token = await user.generateJWTToken();

        // Setting the password to undefined so it does not get sent in the response
        user.password = undefined;

        // Setting the token in the cookie with name token along with cookieOptions
        res.cookie('token', token, cookieOptions);

        // If all good send the response to the frontend
        res.status(201).json({
            success: true,
            message: 'User registered successfully',
            user,
        });
    } catch (error) {
        return next(new AppError(error.message, 500));
    }

}

const loginActivity = []
const login = async (req, res, next) => {
    // Get the client IP address
    const ip = requestIp.getClientIp(req);
    const location = await getGeoLocation(ip);
    const device = `${req.useragent.platform} - ${req.useragent.browser}`;
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return next(new AppError('Email and Password are required', 400));
        }

        // Find the user by email and include the password for comparison
        const user = await User.findOne({ email }).select('+password');

        if (!(user && (await user.comparePassword(password)))) {
            return next(new AppError('Email or Password do not match or user does not exist', 401));
        }

        // If Two-Factor Authentication (2FA) is enabled
        if (user.twoFactorAuth) {
            const otp = user.enableTwoFactorAuth();
            await user.save();

            const subject = 'Your OTP for 2FA';
            const message = `Your OTP for login is: ${otp}. It is valid for 10 minutes.`;

            try {
                await sendEmail(user.email, subject, message);
                return res.status(200).json({
                    success: true,
                    message: 'OTP sent to your email. Please verify it to complete login.',
                });
            } catch (error) {
                user.otp = undefined;
                user.otpExpiry = undefined;
                await user.save();
                return next(new AppError('Failed to send OTP, please try again later', 500));
            }
        }

        // Generate JWT token
        const token = await user.generateJWTToken();
        user.password = undefined;
        // Set the token in cookies
        res.cookie('token', token, cookieOptions);

        // // Log the login activity
        // const activity = {
        //     userId: user._id,
        //     ip: ip || 'Unknown IP',
        //     location: location || { city: 'Unknown', country: 'Unknown' },
        //     device: device || 'Unknown Device',
        //     time: new Date().toISOString(),
        // };
        // loginActivity.push(activity);

        const activity = logLoginActivity(user._id, ip, location, device);
        loginActivity.push(activity);

        // Send response to the frontend
        res.status(200).json({
            success: true,
            message: 'User logged in successfully',
            user,
            loginActivity // You can return the activity or save it to DB
        });

    } catch (error) {
        next(new AppError(error.message, 500));
    }
};

const twoFactorAuthentication = async (req, res, next) => {
    // Get the client IP address
    const ip = requestIp.getClientIp(req);
    const location = await getGeoLocation(ip);
    const device = `${req.useragent.platform} - ${req.useragent.browser}`;
    try {
        const { email, otp } = req.body;

        // Check if email and OTP are provided
        if (!email || !otp) {
            return next(new AppError('Email and OTP are required', 400));
        }

        // Find the user with the provided email
        const user = await User.findOne({ email });

        if (!user || !user.twoFactorAuth) {
            return next(new AppError('Invalid request', 400));
        }

        // Verify the OTP
        if (!user.verifyTwoFactorAuth(otp)) {
            return next(new AppError('Invalid or expired OTP', 400));
        }

        // Generate JWT after successful OTP verification
        const token = await user.generateJWTToken();

        // Clear OTP fields after successful login
        user.otp = undefined;
        user.otpExpiry = undefined;
        await user.save();

        // Set JWT in the cookie and send response
        res.cookie('token', token, cookieOptions);

        const activity = logLoginActivity(user._id, ip, location, device);
        loginActivity.push(activity);

        res.status(200).json({
            success: true,
            message: 'Login successful',
            user,
            loginActivity
        });
    } catch (error) {
        next(new AppError(error.message, 500));
    }
};

const toggleTwoFactorAuth = async (req, res, next) => {
    const { userId } = req.body;

    try {
        const user = await User.findById(userId);

        if (!user) {
            return next(new AppError('User not found', 400))
        }

        // Toggle the twoFactorAuth field
        const isTfaEnabled = user.twoFactorAuth;
        if (isTfaEnabled) {
            // Disable 2FA
            user.twoFactorAuth = false;
            await user.save();
            return res.json({
                success: true,
                message: 'Two-factor authentication disabled',
            });
        } else {
            // Enable 2FA
            user.twoFactorAuth = true;
            await user.save();

            return res.json({
                success: true,
                message: 'Two-factor authentication enabled',
            });
        }

    } catch (error) {
        next(new AppError(error.message, 500));
    }
}

const logout = (req, res) => {
    try {
        res.cookie('token', null, {
            secure: true,
            maxAge: 0,
            httpOnly: true
        })

        res.status(200).json({
            success: true,
            message: 'User logged out successfully',
        });
    } catch (error) {
        return next(new AppError(error.message, 500));
    }
}

const getProfile = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const user = await User.findById(userId);

        if (!user) {
            return next(new AppError('User not found', 404));
        }


        res.status(200).json({
            success: true,
            message: 'User details',
            user,
        });

    } catch (error) {
        return next(new AppError('Failed to fetch profile details', error));
    }
}

const forgotPassword = async (req, res, next) => {
    const { email } = req.body;

    if (!email) {
        return next(new AppError('Email is required', 400));
    }

    const user = await User.findOne({ email });

    if (!user) {
        return next(new AppError('User not found with this email', 400));
    }

    const resetToken = await user.generatePasswordResetToken();

    await user.save();

    const resetPasswordUrl = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;
    console.log(resetPasswordUrl);

    const subject = 'Reset Password';
    const message = `You can reset your password by clicking <a href=${resetPasswordUrl} target="_blank">Reset your password</a>\nIf the above link does not work for some reason then copy paste this link in new tab ${resetPasswordUrl}.\n If you have not requested this, kindly ignore.`;

    try {
        await sendEmail(email, subject, message)

        res.status(200).json({
            success: true,
            message: `Reset password link sent to your email: ${email} successfully`,
        });
    }
    catch (error) {
        user.forgotPasswordExpiry = undefined;
        user.forgotPasswordToken = undefined;

        await user.save();

        return next(new AppError(error.message, 500));
    }
}

const resetPassword = async (req, res, next) => {
    try {
        const { resetToken } = req.params;
        const { password } = req.body;

        const forgotPasswordToken = crypto
            .createHash('sha256')
            .update(resetToken)
            .digest('hex');

        const user = await User.findOne({
            forgotPasswordToken,
            forgotPasswordExpiry: { $gt: Date.now() },
        })

        if (!user) {
            return next(new AppError('Invalid or expired token', 400));
        }

        user.password = password;
        user.forgotPasswordToken = undefined;
        user.forgotPasswordExpiry = undefined;
        user.save();

        res.status(200).json({
            sucess: true,
            message: 'Password reset successfully',
        })
    } catch (error) {
        return next(new AppError(error.message, 500));
    }
}

const changePassword = async (req, res, next) => {

    try {

        const { oldPassword, newPassword } = req.body;
        const { id } = req.user; // because of the middleware isLoggedIn

        if (!oldPassword || !newPassword) {
            return next(
                new AppError('Old password and new password are required', 400)
            );
        }

        // Finding the user by ID and selecting the password
        const user = await User.findById(id).select('+password');

        // If no user then throw an error message
        if (!user) {
            return next(new AppError('Invalid user id or user does not exist', 400));
        }

        // Check if the old password is correct
        const isPasswordValid = await user.comparePassword(oldPassword);

        // If the old password is not valid then throw an error message
        if (!isPasswordValid) {
            return next(new AppError('Invalid old password', 400));
        }

        // Setting the new password
        user.password = newPassword;

        // Save the data in DB
        await user.save();

        // Setting the password undefined so that it won't get sent in the response
        user.password = undefined;

        res.status(200).json({
            success: true,
            message: 'Password changed successfully',
        });
    } catch (error) {
        return next(new AppError(error.message, 500));
    }
}

const updateUser = async (req, res,) => {

    try {
        const { fullName } = req.body;
        const { id } = req.user;
        console.log(id)

        const user = await User.findById(id);

        if (!user) {
            return next(new AppError('Invalid user id or user does not exist'));
        }

        if (fullName) {
            user.fullName = fullName;
        }

        // Run only if user sends a file
        if (req.file) {
            // Deletes the old image uploaded by the user
            await cloudinary.v2.uploader.destroy(user.avatar.public_id);

            try {
                const result = await cloudinary.v2.uploader.upload(req.file.path, {
                    folder: 'lms', // Save files in a folder named lms
                    width: 250,
                    height: 250,
                    gravity: 'faces', // This option tells cloudinary to center the image around detected faces (if any) after cropping or resizing the original image
                    crop: 'fill',
                });

                // If success
                if (result) {
                    // Set the public_id and secure_url in DB
                    user.avatar.public_id = result.public_id;
                    user.avatar.secure_url = result.secure_url;

                    // After successful upload remove the file from local storage
                    fs.rm(`uploads/${req.file.filename}`);
                }
            } catch (error) {
                return next(
                    new AppError(error || 'File not uploaded, please try again', 400)
                );
            }
        }

        // Save the user object
        await user.save();

        res.status(200).json({
            success: true,
            message: 'User details updated successfully',
        });

    } catch (error) {
        return next(new AppError(error.message, 500));
    }

}

// Admin Can do CRUD operations on User
const getAllUsersByAdmin = async (req, res, next) => {
    try {
        const users = await User.find();
        if (!users) {
            return next(new AppError('Invalid user id or user does not exist'));
        }
        res.status(200).json({
            success: true,
            message: 'All Users fetch successfully',
            data: users
        });
    } catch (error) {
        return next(new AppError(error.message, 500));
    }
};

const updateUserByAdmin = async (req, res, next) => {
    try {
        const { userId } = req.params;
        const { fullName } = req.body;
        const user = await User.findById(userId);

        if (!user) {
            return next(new AppError('Invalid user id or user does not exist'));
        }
        if (user.role === 'ADMIN') {
            return next(
                new AppError("Can't do any action on Admin", 400)
            );
        }

        if (fullName) {
            user.fullName = fullName;
        }

        // Run only if user sends a file
        if (req.file) {
            // Deletes the old image uploaded by the user
            await cloudinary.v2.uploader.destroy(user.avatar.public_id);

            try {
                const result = await cloudinary.v2.uploader.upload(req.file.path, {
                    folder: 'lms', // Save files in a folder named lms
                    width: 250,
                    height: 250,
                    gravity: 'faces', // This option tells cloudinary to center the image around detected faces (if any) after cropping or resizing the original image
                    crop: 'fill',
                });

                // If success
                if (result) {
                    // Set the public_id and secure_url in DB
                    user.avatar.public_id = result.public_id;
                    user.avatar.secure_url = result.secure_url;

                    // After successful upload remove the file from local storage
                    fs.rm(`uploads/${req.file.filename}`);
                }
            } catch (error) {
                return next(
                    new AppError(error || 'File not uploaded, please try again', 400)
                );
            }
        }

        // Save the user object
        await user.save();

        res.status(200).json({
            success: true,
            message: 'User details updated successfully',
            user
        });

    } catch (error) {
        return next(new AppError(error.message, 500));
    }
}

const deleteUserByAdmin = async (req, res, next) => {
    try {
        const { userId } = req.params;
        const user = await User.findById(userId);
        if (!user) {
            return next(new AppError('Invalid user id or user does not exist'));
        }
        if (user.role === 'ADMIN') {
            return next(
                new AppError("Can't do any action on Admin", 400)
            );
        }
        await User.findByIdAndDelete(userId);
        res.status(200).json({
            success: true,
            message: 'User deleted successfully'
        });
    } catch (error) {
        return next(new AppError(error.message, 500));
    }
}


export {
    register,
    login,
    twoFactorAuthentication,
    toggleTwoFactorAuth,
    logout,
    getProfile,
    forgotPassword,
    resetPassword,
    changePassword,
    updateUser,
    getAllUsersByAdmin,
    updateUserByAdmin,
    deleteUserByAdmin
};
