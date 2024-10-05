import  User from '../models/user.model.js'
import sendEmail from '../utils/sendEmail.js'
import AppError from '../utils/error.utils.js';

export const contactUs = async (req, res, next) => {
    const { name, email, message } = req.body;
  
    if (!name || !email || !message) {
      return next(new AppError('Name, Email, Message are required'));
    }
  
    try {
      const subject = 'Contact Us Form';
      const textMessage = `${name} - ${email} <br /> ${message}`;
  
      // Await the send email
      await sendEmail(process.env.CONTACT_US_EMAIL, subject, textMessage);
    } catch (error) {
      console.log(error);
      return next(new AppError(error.message, 400));
    }
  
    res.status(200).json({
      success: true,
      message: 'Your request has been submitted successfully',
    });
  };

  /**
 * @USER_STATS_ADMIN
 * @ROUTE @GET {{URL}}/api/v1/admin/stats/users
 * @ACCESS Private(ADMIN ONLY)
 */
export const userStats = async (req, res, next) => {
    const allUsersCount = await User.countDocuments();
    const activeUsersCount = await User.countDocuments({ account_active: true });
    const inActiveUsersCount = await User.countDocuments({ account_active: false });
    const subscribedUsersCount = await User.countDocuments({
      'subscription.status': 'active', // subscription.status means we are going inside an object and we have to put this in quotes
    });
  
    res.status(200).json({
      success: true,
      message: 'All registered users count',
      allUsersCount,
      activeUsersCount,
      inActiveUsersCount,
      subscribedUsersCount,
    });
  }