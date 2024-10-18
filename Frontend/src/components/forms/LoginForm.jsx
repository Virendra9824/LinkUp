import React, { useState } from "react";
import { LuEye } from "react-icons/lu";
import { LuEyeOff } from "react-icons/lu";
import { Link } from "react-router-dom";

export default function LoginForm(props) {
  // State for form inputs
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  // State for form errors
  const [formErrors, setFormErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);

  // Form validation function
  const validateForm = () => {
    let errors = {};

    if (!formData.email.trim()) {
      errors.email = "Email is required";
    }
    if (!formData.password.trim()) {
      errors.password = "Password is required";
    }
    setFormErrors(errors);

    // Return true if no errors
    return Object.keys(errors).length === 0;
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      console.log("Form data submitted:", formData);
      // Submit form or make API call here
    }
  };

  // Handle input change
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  return (
    <div className="bg-[#1A1A1A] w-11/12 xs:w-[95%] sm:w-[80%] md:w-[50%] p-3 sm:p-4 md:p-7 mx-auto flex flex-col justify-between gap-4 rounded-xl">
      <h1 className="text-white font-bold text-xl">
        Welcome to LinkUp, the Social Media for Sociopaths!
      </h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        {/* Section: Email */}
        <div className="flex flex-col">
          <label className="relative top-2 w-fit px-1 bg-[#1A1A1A] text-sm left-3 text-[#06B6D4]">
            Email
          </label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            placeholder="Enter your email"
            className="py-2 px-4 bg-[#1A1A1A] text-white border border-gray-500 rounded focus:outline-none focus:border-2 focus:border-[#06B6D4]"
          />
          {formErrors.email && (
            <p className="text-red-500 text-xs mt-1 pl-1">
              {formErrors.email} <sup>*</sup>
            </p>
          )}
        </div>

        {/* Section: Password */}
        {/* show/hide Icons tag LuEyeOff and LuEye */}
        <div className="flex flex-col">
          <label className="relative z-20 top-2 w-fit px-1 bg-[#1A1A1A] text-sm left-3 text-[#06B6D4]">
            Password
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

        {/* Section: Forgot-Password */}
        <Link
          to={"/update-password"}
          className="text-[#06B6D4] text-left pl-2 font-semibold underline italic"
        >
          Forgot password ?
        </Link>

        {/* Submit Button */}
        <button
          type="submit"
          className="bg-[#06B6D4] text-black font-bold py-2 px-4 rounded mt-1 hover:bg-[#0284c7] transition-all"
        >
          Login
        </button>

        {/* Section: Create A/C */}
        <Link
          to={"/signup"}
          className="text-[#06B6D4] text-left pl-2 font-bold underline italic"
        >
          Don't have an account? Sign Up here.
        </Link>
      </form>
    </div>
  );
}
