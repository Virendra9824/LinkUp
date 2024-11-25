import React, { useState } from "react";
import { sendOTP } from "../../apis/authApi";
import { useNavigate } from "react-router-dom"; // Import useNavigate for redirection

const SendOtpFrom = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate(); // Initialize navigate function

  const handleSendEmail = async (e) => {
    e.preventDefault();

    setLoading(true);
    setMessage(""); // Reset message before new submission

    try {
      const response = await sendOTP({ email }); // Send email data to backend
      setMessage("OTP sent successfully! Check your email.");
      
      // Redirect to RegisterUpdateForm after OTP is sent
      navigate("/auth/signup"); // Ensuregnin this matches the route for RegisterUpdateForm
    } catch (error) {
      setMessage(
        error.response?.data?.message ||
          "Failed to send OTP. Please try again later."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-6 bg-white shadow-md rounded-lg">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-4">
          Verify Your Email
        </h2>
        <p className="text-gray-600 text-center mb-6">
          Enter your email to receive an OTP for verification.
        </p>
        <form onSubmit={handleSendEmail}>
          <div className="mb-4">
            <label htmlFor="email" className="block text-sm text-gray-700 mb-2">
              Email Address
            </label>
            <input
              id="email"
              type="email"
              placeholder="Enter your email"
              className="w-full px-4 py-2 border rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className={`w-full py-2 px-4 rounded-lg text-white font-semibold ${
              loading
                ? "bg-blue-300 cursor-not-allowed"
                : "bg-blue-500 hover:bg-blue-600"
            } transition duration-200`}
          >
            {loading ? "Sending..." : "Send OTP"}
          </button>
        </form>
        {message && (
          <p
            className={`mt-4 text-center ${
              message.includes("successfully")
                ? "text-green-600"
                : "text-red-600"
            }`}
          >
            {message}
          </p>
        )}
      </div>
    </div>
  );
};

export default SendOtpFrom;
