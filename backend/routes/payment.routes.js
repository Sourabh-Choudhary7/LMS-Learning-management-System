import { Router } from "express";
import { allPayments, buySubscription, cancelSubscription, getStripeApiKey, verifySubscription } from "../controllers/payment.controller.js";
import { authorizeRoles, isLoggedIn } from "../middlewares/auth.middleware.js";

const router = Router();

router
    .route('/stripe-key')
    .get(
        isLoggedIn,
        getStripeApiKey
    );

router
    .route('/subscribe')
    .post(
        isLoggedIn,
        buySubscription
    );

router
    .route('/verify')
    .post(
        isLoggedIn,
        verifySubscription
    );

// router
//     .route('/webhook')
//     .post(
//         isLoggedIn,
//         stripeWebhook
//     );

router
    .route('/unsubscribe')
    .post(
        isLoggedIn,
        cancelSubscription
    );

router
    .route('/')
    .get(
        isLoggedIn,
        authorizeRoles('ADMIN'),
        allPayments
    );

export default router;
