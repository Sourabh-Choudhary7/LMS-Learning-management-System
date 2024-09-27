import { model, Schema, mongoose } from 'mongoose'

const paymentSchema = new Schema({
    stripe_payment_intent_id: {
        type: String,
        required: true
    },
    stripe_subscription_id: {
        type: String,
        required: true
    },
    stripe_signature: {
        type: String,
        required: true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
      },
      amount: {
        type: Number,
        required: true,
      },
      currency: {
        type: String,
        required: true,
      }
}, {
    timestamps: true
});

const Payment = model('Payment', paymentSchema);

export default Payment;
