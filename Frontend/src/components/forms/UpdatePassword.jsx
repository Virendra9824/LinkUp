


import { useState } from "react";

const UpdatePassword = () => {
  const [showOtpInput, setShowOtpInput] = useState(false); // State to toggle OTP input
  const [newOtp, setNewOtp] = useState(''); // State to store user input OTP
  const [message, setMessage] = useState(''); // State to store validation message
  const [showPasswordInputs, setShowPasswordInputs] = useState(false); // State to show password fields
  const [newPassword, setNewPassword] = useState(''); // State to store new password
  const [confirmPassword, setConfirmPassword] = useState(''); // State to store confirm password

  const handleSendOtp = () => {
    setShowOtpInput(true); // Show OTP input after clicking "Send OTP"
  };

  const UserEmail = "vijaykumar9024180@gmail.com";
  const Otp = '1234'; // Store OTP as string for comparison

  const validateOtp = () => {
    if (newOtp === Otp) {
      setMessage('OTP is valid!'); // Message when OTP is correct
      setShowPasswordInputs(true); // Show password input fields when OTP is valid
    } else {
      setMessage('Invalid OTP, please try again.'); // Message when OTP is incorrect
    }
  };

  const handleUpdatePassword = () => {
    if (newPassword === confirmPassword) {
      // Handle password update logic here
      setMessage('Password updated successfully!'); // Message when password is updated
    } else {
      setMessage('Passwords do not match. Please try again.'); // Message when passwords don't match
    }
  };

  return (
    <div className="min-h-screen flex md:pt-24 pt-20  items-center justify-center bg-[rgb(10,10,10)]   p-4"  >
      <div className="bg-[rgb(26,26,26)] md:text-md text-sm p-8 rounded-lg shadow-lg w-full max-w-md">
        <h1 className=" md:text-xl text-md  font-semibold text-white mb-5 text-center">
          Welcome to Link-Up, update your password!
        </h1>
        
        {/* Section: Email */}
        <div className="flex pb-4 flex-col">
          <label className="relative top-2 w-fit px-1 bg-[#1A1A1A] text-sm left-3 text-[#06B6D4]">
            Email
          </label>
          <input
            type="email"
            name="email"
            value={UserEmail}
            placeholder="Enter your email"
            className="py-2  px-4 bg-[#1A1A1A] text-white border border-gray-500 rounded focus:outline-none focus:border-2 focus:border-[#06B6D4]"
          />
          
        </div>

        {!showOtpInput && (
          <button
            onClick={handleSendOtp}
            className="w-full bg-blue-500 text-white font-semibold py-2 rounded-md hover:bg-blue-600"
          >
            Send OTP
          </button>
        )}
        {showOtpInput && !showPasswordInputs && (
          <>
            <div className=" flex flex-col mb-4">
              <label className=" relative top-2 w-fit px-1 bg-[#1A1A1A] text-sm left-3 text-[#06B6D4]" htmlFor="otp">
                Enter your OTP
              </label>
              <input
                className="py-2  px-4 bg-[#1A1A1A] text-white border border-gray-500 rounded focus:outline-none focus:border-2 focus:border-[#06B6D4]"
                type="text"
                id="otp"
                placeholder="Enter OTP"
                value={newOtp} // Bind input value to state
                onChange={(e) => setNewOtp(e.target.value)} // Update state on input change
              />
            </div>
            <p className="text-[rgb(0,213,250)] mb-4">
              Check your email and enter the OTP
            </p>
            <button
              onClick={validateOtp} // Call validateOtp on click
              className="w-full bg-[rgb(0,213,250)] text-white font-semibold py-2 rounded-md hover:bg-blue-600"
            >
              Verify OTP
            </button>
            {message && <p className="text-red-500 mt-4">{message}</p>} {/* Display message */}
          </>
        )}
        {showPasswordInputs && (
          <>
            <div className=" flex flex-col mb-4">
              <label className=" relative top-2 w-fit px-1 bg-[#1A1A1A] text-sm left-3 text-[#06B6D4]" htmlFor="newPassword">
                New Password
              </label>
              <input
                className="py-2  px-4 bg-[#1A1A1A] text-white border border-gray-500 rounded focus:outline-none focus:border-2 focus:border-[#06B6D4]"
                type="password"
                id="newPassword"
                placeholder="Enter New Password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
            </div>
            <div className="flex flex-col mb-4">
              <label className="relative top-2 w-fit px-1 bg-[#1A1A1A] text-sm left-3 text-[#06B6D4]" htmlFor="confirmPassword">
                Confirm Password
              </label>
              <input
                className="py-2  px-4 bg-[#1A1A1A] text-white border border-gray-500 rounded focus:outline-none focus:border-2 focus:border-[#06B6D4]"
                type="password"
                id="confirmPassword"
                placeholder="Confirm New Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>
            <button
              onClick={handleUpdatePassword} // Call handleUpdatePassword on click
              className="w-full bg-blue-500 text-white font-semibold py-2 rounded-md hover:bg-blue-600"
            >
              Update Password
            </button>
            {message && <p className="mt-4 text-white">{message}</p>} {/* Display message */}
          </>
        )}
      </div>
    </div>
  );
};

export default UpdatePassword;
