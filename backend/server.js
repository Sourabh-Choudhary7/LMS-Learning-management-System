import app from './app.js';
import connectionToDB from './config/dbConnection.js';
import cloudinary from 'cloudinary'
import Stripe from 'stripe';

const PORT = process.env.PORT || 5000;

// Cloudinary configuration
cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Stripe configuration
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

app.listen(PORT, async () => {
  await connectionToDB();
  console.log(`Server is running on port  http:localhost:${PORT}`);
});