import React, { useState } from "react";
import { LuEye } from "react-icons/lu";
import { LuEyeOff } from "react-icons/lu";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { requestPasswordResetOtp, resetPassword } from "../../apis/authApi";

export default function ForgotPassword(props) {
  const { isUpdateForm } = props;

  // State for form inputs
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    otp: "",
  });

  // State for form errors
  const [formErrors, setFormErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [sendOtpLoading, setSendOtpLoading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [sendOtpBtnMessage, setSendOtpBtnMessage] = useState("Send OTP");
  const navigate = useNavigate();

  // Form validation function
  const validateForm = () => {
    let errors = {};

    if (!formData.email) {
      errors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = "Email is invalid";
    }

    if (!formData.password) {
      errors.password = "Password is required";
    }
    if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = "Passwords do not match";
    }
    if (!formData.otp) {
      errors.otp = "OTP is required";
    }

    setFormErrors(errors);

    // Return true if no errors
    return Object.keys(errors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      const toastId = toast.loading("Loading...");
      try {
        setLoading(true);
        const response = await resetPassword(formData);
        console.log("Response of update Password: ", response);
        toast.success("Password changed successfully");
        navigate("/auth/login");
      } catch (error) {
        toast.error(error?.message);
        console.log("Error while update password: ", error);
      } finally {
        toast.dismiss(toastId);
        setLoading(false);
      }
    }
  };

  // Handle input change
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSendOTP = async (email) => {
    if (!email) {
      toast.error("Email is required");
      return;
    }
    const toastId = toast.loading("Loading...");
    try {
      setLoading(true);
      setSendOtpLoading(true);
      const response = await requestPasswordResetOtp({ email });
      console.log("Response of OTP sent: ", response);
      toast.success("OTP sent");
    } catch (error) {
      toast.error("OTP not sent");
      console.log("Error while sending OTP: ", error);
    } finally {
      toast.dismiss(toastId);
      setLoading(false);
      setSendOtpLoading(false);
      setSendOtpBtnMessage("OTP Sent");
    }
  };

  return (
    <div className="bg-[#1A1A1A] my-6 w-11/12 xs:w-[95%] sm:w-[80%] md:w-[50%] p-3 sm:p-4 md:p-7 mx-auto flex flex-col justify-between gap-4 rounded-xl">
      <h1 className="text-white font-bold text-xl">
        Welcome to LinkUp,{" "}
        {isUpdateForm ? "update your profile!" : " reset your password."}
      </h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        {/* Section: Password */}
        {/* show/hide Icons tag LuEyeOff and LuEye */}
        <div className="flex flex-col">
          <label className="relative z-20 top-2 w-fit px-1 bg-[#1A1A1A] text-sm left-3 text-[#06B6D4]">
            New Password
          </label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              placeholder="Enter your password"
              className="py-2 px-4 w-full bg-[#1A1A1A] text-white border border-gray-500 rounded focus:outline-none focus:border-2 focus:border-[#06B6D4]"
            />
            <div
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-2 top-[22%]"
            >
              {!showPassword ? (
                <LuEye className="cursor-pointer" size={24} />
              ) : (
                <LuEyeOff className="cursor-pointer" size={24} />
              )}
            </div>
          </div>

          {formErrors.password && (
            <p className="text-red-500 text-xs mt-1 pl-1">
              {formErrors.password} <sup>*</sup>
            </p>
          )}
        </div>

        {/* Section: Confirm Password */}
        <div className="flex flex-col">
          <label className="relative z-20 top-2 w-fit px-1 bg-[#1A1A1A] text-sm left-3 text-[#06B6D4]">
            Confirm New Password
          </label>
          <div className="relative">
            <input
              type={showConfirmPassword ? "text" : "password"}
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleInputChange}
              placeholder="Confirm your password"
              className="py-2 px-4 w-full bg-[#1A1A1A] text-white border border-gray-500 rounded focus:outline-none focus:border-2 focus:border-[#06B6D4]"
            />
            <div
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-2 top-[22%]"
            >
              {!showConfirmPassword ? (
                <LuEye className="cursor-pointer" size={24} />
              ) : (
                <LuEyeOff className="cursor-pointer" size={24} />
              )}
            </div>
          </div>

          {formErrors.confirmPassword && (
            <p className="text-red-500 text-xs mt-1 pl-1">
              {formErrors.confirmPassword} <sup>*</sup>
            </p>
          )}
        </div>

        {/* Section: Email */}
        <div className="flex flex-col">
          <label className="relative  z-20 top-2 w-fit px-1 bg-[#1A1A1A] text-sm left-3 text-[#06B6D4]">
            Registered Email
          </label>
          <div className="relative">
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="Enter your email"
              className="py-2 px-4 w-full bg-[#1A1A1A] text-white border border-gray-500 rounded focus:outline-none focus:border-2 focus:border-[#06B6D4]"
            />
            <button
              onClick={() => handleSendOTP(formData.email)}
              disabled={sendOtpLoading}
              className={`${
                sendOtpLoading ? "cursor-not-allowed" : ""
              } absolute right-2 top-[12%] bg-[#06B6D4] text-black font-semibold py-1 px-3 rounded  hover:bg-[#0284c7] transition-all`}
            >
              {sendOtpBtnMessage}
            </button>
          </div>
          {formErrors.email && (
            <p className="text-red-500 text-xs mt-1 pl-1">
              {formErrors.email} <sup>*</sup>
            </p>
          )}
        </div>

        {/* Section: OTP */}
        {!isUpdateForm && (
          <div className="flex flex-col">
            <label className="relative top-2 w-fit px-1 bg-[#1A1A1A] text-sm left-3 text-[#06B6D4] ">
              OTP
            </label>
            <input
              type="number"
              name="otp"
              value={formData.otp}
              onChange={handleInputChange}
              className="py-2 px-4 bg-[#1A1A1A] text-white border border-gray-500 rounded focus:outline-none focus:border-2 focus:border-[#06B6D4]"
            />
            {formErrors.otp && (
              <p className="text-red-500  text-xs mt-1 pl-1">
                {formErrors.otp} <sup>*</sup>
              </p>
            )}
            <p className="text-[#06B6D4] text-xs mt-1 pl-1 italic">
              Check your e-mail and enter the otp
            </p>
          </div>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          disabled={sendOtpLoading || loading}
          className={`${
            loading ? "cursor-not-allowed" : ""
          } bg-[#06B6D4] text-black font-bold py-2 px-4 rounded mt-4 hover:bg-[#0284c7] transition-all`}
        >
          Reset Password
        </button>
      </form>
    </div>
  );
}
