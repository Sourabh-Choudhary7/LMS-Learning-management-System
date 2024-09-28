import React, { useEffect } from 'react';
import Layout from '../../layout/Layout';
import { AiFillCheckCircle } from 'react-icons/ai';
import { useDispatch } from 'react-redux';
import { getUserData } from '../../redux/Slices/AuthSlice';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { verifyPayment } from '../../redux/Slices/PaymentSlice';
import toast from 'react-hot-toast';

const CheckoutSuccess = () => {
    const dispatch = useDispatch();
    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        const queryParams = new URLSearchParams(location.search);
        const success = queryParams.get('success'); // Extract success
        const sessionId = queryParams.get('session_id'); // Extract session_id

        if (success === 'true' && sessionId) {
            const paymentDetails = {
                session_id: sessionId, // Use the session ID to verify payment
            };

            const verifyPaymentAsync = async () => {
                const verifyRes = await dispatch(verifyPayment(paymentDetails));
                if (verifyRes?.payload?.success) {
                    // Fetch user data if payment verification is successful
                    dispatch(getUserData());
                } else {
                    navigate('/checkout/fail');
                    toast.error("Payment verification failed. Please contact support.");
                }
            };

            verifyPaymentAsync();
        } else {
            navigate('/checkout/fail'); // Redirect if the payment wasn't successful
            toast.error("Payment was not successful.");
        }
    }, [dispatch, location.search, navigate]);

    return (
        <Layout>
            <div className="min-h-[80vh] flex items-center justify-center text-white">
                <div className="w-80 h-[26rem] flex flex-col justify-center items-center shadow-[0_0_10px_black] rounded-lg relative">
                    <h1 className="bg-green-500 absolute text-center top-0 w-full py-4 text-2xl font-bold rounded-tl-lg rounded-tr-lg">Payment Successful</h1>

                    <div className="px-4 flex flex-col items-center justify-center space-y-2">
                        <div className="text-center space-y-2">
                            <h2 className="text-lg font-semibold">Welcome to the pro bundle</h2>
                            <p className="text-left">Now you can enjoy all the courses.</p>
                        </div>
                        <AiFillCheckCircle className="text-green-500 text-5xl" />
                    </div>

                    <Link to="/courses" className="bg-green-500 hover:bg-green-600 transition-all ease-in-out duration-300 absolute bottom-0 w-full py-2 text-xl font-semibold text-center rounded-br-lg rounded-bl-lg">
                        <button>Go to dashboard</button>
                    </Link>
                </div>
            </div>
        </Layout>
    );
};

export default CheckoutSuccess;
