import React, { useState, useRef } from "react";
import { useDispatch } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { twoFactorAuth } from "../../redux/Slices/AuthSlice";

const TwoFactorAuthentication = () => {
  const [otp, setOtp] = useState(new Array(4).fill(""));
  const inputRefs = useRef([]);

  const dispatch = useDispatch()
  const navigate = useNavigate();
  const { state } = useLocation();

  // Handle OTP input change
  const handleChange = (element, index) => {
    if (isNaN(element.value)) return;

    const newOtp = [...otp];
    newOtp[index] = element.value;
    setOtp(newOtp);

    // Move to next input automatically
    if (element.value !== "" && index < 3) {
      inputRefs.current[index + 1].focus();
    }
  };

  // Handle backspace for moving to the previous input
  const handleBackspace = (event, index) => {
    if (event.key === "Backspace" && index > 0 && otp[index] === "") {
      inputRefs.current[index - 1].focus();
    }
  };

  // Handle form submission
  const handleSubmit = async (event) => {
    event.preventDefault();
    const otpValue = otp.join("");

    const payload = {
      email: state.email,
      otp: otpValue,
    }

    const res = await dispatch(twoFactorAuth(payload))
    if (res?.payload?.success) {
      navigate("/");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[100vh] bg-gray-900 text-white">
      <h1 className="text-4xl font-semibold text-white-500 mb-8 text-center">Two Factor Authentication!</h1>
      <h1 className="text-4xl font-semibold text-yellow-500 mb-8">Enter OTP</h1>
      <form onSubmit={handleSubmit} className="flex flex-col items-center space-y-8">

        {/* OTP Inputs */}
        <div className="flex space-x-4">
          {otp.map((value, index) => (
            <input
              key={index}
              ref={(el) => (inputRefs.current[index] = el)}
              type="text"
              maxLength="1"
              value={value}
              onChange={(e) => handleChange(e.target, index)}
              onKeyDown={(e) => handleBackspace(e, index)}
              className="w-16 h-16 text-2xl text-center rounded-md bg-gray-800 text-yellow-500 focus:outline-none focus:ring-2 focus:ring-yellow-500"
            />
          ))}
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full py-3 px-6 text-lg font-semibold bg-yellow-500 text-gray-900 rounded-md hover:bg-yellow-600 transition-all duration-300"
        >
          Submit OTP
        </button>
      </form>
    </div>
  );
};

export default TwoFactorAuthentication;
