import Stripe from 'stripe';
import User from '../models/user.model.js';
import AppError from '../utils/error.utils.js';
import Payment from '../models/payment.model.js';
import dotenv from 'dotenv';

dotenv.config();

// Initialize Stripe with your secret key
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const YOUR_DOMAIN = process.env.FRONTEND_URL;

/**
 * @ACTIVATE_SUBSCRIPTION
 * @ROUTE @POST {{URL}}/api/v1/payments/subscribe
 * @ACCESS Private (Logged in user only)
 */
export const buySubscription = async (req, res, next) => {
  const { id } = req.user;
  const user = await User.findById(id);

  if (!user) {
    return next(new AppError('Unauthorized, please login'));
  }

  if (user.role === 'ADMIN') {
    return next(new AppError('Admin cannot purchase a subscription', 400));
  }

  try {
    // Create a Stripe customer if they don't exist
    const customer = await stripe.customers.create({
      email: user.email,
      name: user.name,
    });

    // Create a Stripe Checkout Session
    const session = await stripe.checkout.sessions.create({
      // billing_address_collection: 'auto',
      payment_method_types: ['card'],
      mode: 'subscription',
      customer: customer.id,
      line_items: [
        {
          price: process.env.STRIPE_PLAN_ID, // Ensure this is a valid price ID
          quantity: 1,
        },
      ],
      success_url: `${YOUR_DOMAIN}/checkout/success?success=true&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${YOUR_DOMAIN}/checkout/fail?canceled=true`,
    });

    // Retrieve the subscription ID from the session object and store it
    user.subscription.id = session.id;
    user.subscription.status = 'pending';
    await user.save();

    // Respond with the Checkout Session URL
    res.status(200).json({
      success: true,
      message: 'Subscription created successfully',
      url: session.url,
      subscription_id : session.id
    });
  } catch (error) {
    console.error(error); // Log the error for debugging
    return next(new AppError(error.message, 500));
  }
};


/**
 * @VERIFY_SUBSCRIPTION
 * @ROUTE @POST {{URL}}/api/v1/payments/verify
 * @ACCESS Private (Logged in user only)
 */
export const verifySubscription = async (req, res, next) => {
  const { id } = req.user;
  const { session_id } = req.body;

  if (!session_id) {
    return next(new AppError('Session ID is required', 400));
  }

  try {
    // Retrieve the Checkout session from Stripe
    const session = await stripe.checkout.sessions.retrieve(session_id);

    if (session.mode === 'subscription') {
      const subscriptionId = session.subscription;

      // If payment_intent is not available, try to retrieve the invoice
      let paymentIntentId = session.payment_intent;
      if (!paymentIntentId) {
        const invoice = await stripe.invoices.retrieve(session.invoice);
        paymentIntentId = invoice.payment_intent; // Get the payment intent from the invoice
      }

      if (!paymentIntentId) {
        return next(new AppError('Payment intent is not available', 400));
      }
      const user = await User.findById(id);

      // Create payment record
      const paymentRecord = await Payment.create({
        stripe_payment_intent_id: paymentIntentId,
        stripe_signature: session.id, // Use session ID as a signature placeholder or adjust accordingly
        stripe_subscription_id: subscriptionId,
        user: user._id,
        amount: session.amount_total,
        currency: session.currency,
      });

      // Update the user's subscription status in the database
      user.subscription.id = subscriptionId;
      user.subscription.status = 'active';
      await user.save();

      return res.status(200).json({
        success: true,
        message: 'Payment verified successfully',
        payment: paymentRecord, // Return the created payment record if needed
      });
    } else {
      return next(new AppError('Session is not for a subscription', 400));
    }
  } catch (error) {
    console.error('Error verifying subscription:', error);
    return next(new AppError(error.message, 500));
  }
};

/**
 * @CANCEL_SUBSCRIPTION
 * @ROUTE @POST {{URL}}/api/v1/payments/unsubscribe
 * @ACCESS Private (Logged in user only)
 */

export const cancelSubscription = async (req, res, next) => {
  const { id } = req.user;

  const user = await User.findById(id);

  // Checking the user role
  if (user.role === 'ADMIN') {
    return next(
      new AppError('Admin cannot cancel subscription', 400)
    );
  }

  // Finding subscription ID from user
  const subscriptionId = user.subscription.id;
  // Cancel the subscription using Stripe
  try {
    const subscription = await stripe.subscriptions.cancel(subscriptionId); // Delete the subscription

    // Update the user's subscription status
    user.subscription.status = subscription.status;

    // Save the user object
    await user.save();
  } catch (error) {
    return next(new AppError(error.message, error.statusCode || 500));
  }

  // Finding the payment using the subscription ID
  const payment = await Payment.findOne({
    stripe_subscription_id: subscriptionId,
  });

  // Calculate time since subscribed
  const timeSinceSubscribed = Date.now() - payment.createdAt;

  // Define refund period (14 days)
  const refundPeriod = 14 * 24 * 60 * 60 * 1000;

  // Check if refund period has expired
  if (refundPeriod <= timeSinceSubscribed) {
    return next(
      new AppError(
        'Refund period is over, so there will not be any refunds provided.',
        400
      )
    );
  }

  // If refund period is valid, issue a refund
  try {
    await stripe.refunds.create({
      payment_intent: payment.stripe_payment_intent_id, // Assuming this ID is stored in Payment model
      amount: payment.amount, // Full refund
    });
  } catch (error) {
    return next(new AppError(error.message, error.statusCode || 500));
  }

  // Clean up user subscription details
  user.subscription.id = undefined;
  user.subscription.status = undefined;

  await user.save();
  await payment.deleteOne();

  // Send the response
  res.status(200).json({
    success: true,
    message: 'Subscription canceled successfully',
  });
};

/**
 * @GET_STRIPE_API_KEY
 * @ROUTE @GET {{URL}}/api/v1/payments/stripe-key
 * @ACCESS Public
 */
export const getStripeApiKey = async (_req, res) => {
  res.status(200).json({
    success: true,
    key: process.env.STRIPE_PUBLISHABLE_KEY,
  });
};

/**
 * @ALL_PAYMENTS
 * @ROUTE @GET {{URL}}/api/v1/payments
 * @ACCESS Private (ADMIN only)
 */
export const allPayments = async (req, res, _next) => {
  const { count, skip } = req.query;

  // Fetch all subscriptions from Stripe
  const allPayments = await stripe.subscriptions.list({
    limit: count ? parseInt(count) : 10, // If count is sent then use that else default to 10
    starting_after: skip ? skip : undefined, // If skip is sent then use that else default to undefined
  });

  const monthNames = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];

  // Initialize a record to count monthly payments
  const finalMonths = monthNames.reduce((acc, month) => {
    acc[month] = 0; // Initialize each month to 0
    return acc;
  }, {});

  // Process the payment records to find out the month of each subscription
  const monthlyWisePayments = allPayments.data.map((payment) => {
    // Convert the payment.current_period_start which is in unix time to a human-readable format
    const monthsInNumbers = new Date(payment.current_period_start * 1000);
    return monthNames[monthsInNumbers.getMonth()]; // Get the month name
  });

  // Count the payments for each month
  monthlyWisePayments.forEach((month) => {
    if (finalMonths[month] !== undefined) {
      finalMonths[month] += 1; // Increment the count for the month
    }
  });

  // Prepare the monthly sales record array
  const monthlySalesRecord = monthNames.map((monthName) => finalMonths[monthName]);

  // Send the response
  res.status(200).json({
    success: true,
    message: 'All payments',
    allPayments,
    finalMonths,
    monthlySalesRecord,
  });
};

/**
 * @WEBHOOK
 * @ROUTE @POST {{URL}}/api/v1/payments/webhook
 * @ACCESS Private
 */
// export const stripeWebhook = async (req, res) => {
//   let event;

//   const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;
//   if (endpointSecret) {
//     const signature = req.headers['stripe-signature'];
//     try {
//       event = stripe.webhooks.constructEvent(req.body, signature, endpointSecret);
//     } catch (err) {
//       console.log(`⚠️  Webhook signature verification failed.`, err.message);
//       return res.sendStatus(400);
//     }
//   }

//   let subscription;
//   let status;

//   switch (event.type) {
//     case 'customer.subscription.trial_will_end':
//     case 'customer.subscription.deleted':
//     case 'customer.subscription.created':
//     case 'customer.subscription.updated':
//       subscription = event.data.object;
//       status = subscription.status;
//       console.log(`Subscription status is ${status}.`);
//       break;
//     case 'entitlements.active_entitlement_summary.updated':
//       subscription = event.data.object;
//       console.log(`Active entitlement summary updated for ${subscription}.`);
//       break;
//     default:
//       console.log(`Unhandled event type ${event.type}.`);
//   }

//   res.send();
// };
