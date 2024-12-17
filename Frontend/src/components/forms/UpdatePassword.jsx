import React, { useState } from "react";
import { LuEye, LuEyeOff } from "react-icons/lu";
import { changePassword } from "../../apis/authApi"; // Assuming changePassword API exists
import { Link, useNavigate } from "react-router-dom"; // Import useNavigate
import toast from "react-hot-toast";

const UpdatePassword = () => {
  const [formData, setFormData] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [formErrors, setFormErrors] = useState({});
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Handle input change
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setFormErrors({ ...formErrors, [name]: "" }); // Clear previous errors
  };

  // Handle password change submission
  const handleChangePassword = async (e) => {
    e.preventDefault();
    const { oldPassword, newPassword, confirmPassword } = formData;

    // Validation checks
    const errors = {};
    if (!oldPassword) errors.oldPassword = "Old password is required";
    if (!newPassword) errors.newPassword = "New password is required";
    if (newPassword !== confirmPassword)
      errors.confirmPassword = "New passwords do not match";

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    try {
      setLoading(true);
      await changePassword({ oldPassword, newPassword });
      toast.success("Password changed successfully!");
      navigate("/auth/login");
    } catch (error) {
      console.error(error);
      toast.error(error.message || "Failed to change password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto my-4 p-6 bg-[#1A1A1A] text-white rounded-md">
      <h2 className="text-2xl font-semibold mb-4 text-center">
        Change Password
      </h2>

      {/* Old Password Section */}
      <div className="relative flex flex-col w-full mb-4">
        <label className="relative top-2  w-fit px-1 bg-[#1A1A1A] text-sm  text-[#06B6D4] left-3">
          Old Password
        </label>
        <input
          type={showOldPassword ? "text" : "password"}
          name="oldPassword"
          value={formData.oldPassword}
          onChange={handleInputChange}
          placeholder="Enter old password"
          className="py-2 px-4 w-full bg-[#1A1A1A] text-white border border-gray-500 rounded focus:outline-none focus:border-[#06B6D4]"
        />
        <div
          onClick={() => setShowOldPassword(!showOldPassword)}
          className="absolute right-2 top-[45%] cursor-pointer"
        >
          {showOldPassword ? <LuEyeOff size={24} /> : <LuEye size={24} />}
        </div>
        {formErrors.oldPassword && (
          <p className="text-red-500 text-xs mt-1 pl-1">
            {formErrors.oldPassword}
          </p>
        )}
      </div>

      {/* New Password Section */}
      <div className="flex relative flex-col w-full mb-4">
        <label className="relative top-2 w-fit px-1 bg-[#1A1A1A] text-sm text-[#06B6D4] left-3">
          New Password
        </label>
        <input
          type={showNewPassword ? "text" : "password"}
          name="newPassword"
          value={formData.newPassword}
          onChange={handleInputChange}
          placeholder="Enter new password"
          className="py-2 px-4 w-full bg-[#1A1A1A] text-white border border-gray-500 rounded focus:outline-none focus:border-[#06B6D4]"
        />
        <div
          onClick={() => setShowNewPassword(!showNewPassword)}
          className="absolute right-2 top-[45%]"
        >
          {showNewPassword ? <LuEyeOff size={24} /> : <LuEye size={24} />}
        </div>
        {formErrors.newPassword && (
          <p className="text-red-500 text-xs mt-1 pl-1">
            {formErrors.newPassword}
          </p>
        )}
      </div>

      {/* Confirm New Password Section */}
      <div className="flex relative flex-col w-full mb-4">
        <label className="relative top-2 w-fit px-1 bg-[#1A1A1A] text-sm text-[#06B6D4] left-3">
          Confirm New Password
        </label>
        <input
          type={showConfirmPassword ? "text" : "password"}
          name="confirmPassword"
          value={formData.confirmPassword}
          onChange={handleInputChange}
          placeholder="Confirm your new password"
          className="py-2 px-4 w-full bg-[#1A1A1A] text-white border border-gray-500 rounded focus:outline-none focus:border-[#06B6D4]"
        />
        <div
          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
          className="absolute right-2 top-[45%] cursor-pointer"
        >
          {showConfirmPassword ? <LuEyeOff size={24} /> : <LuEye size={24} />}
        </div>
        {formErrors.confirmPassword && (
          <p className="text-red-500 text-xs mt-1 pl-1">
            {formErrors.confirmPassword}
          </p>
        )}
      </div>

      {/* Submit Button */}
      <button
        onClick={handleChangePassword}
        className="w-full py-2 mt-4 bg-[#06B6D4] text-black font-semibold rounded hover:bg-[#0284c7] transition-all"
        disabled={loading}
      >
        {loading ? "Changing..." : "Change Password"}
      </button>
      <Link
        to={"/auth/reset-password"}
        className="text-[#06B6D4] text-left pl-2 font-semibold underline italic"
      >
        Forgot password ?
      </Link>
    </div>
  );
};

export default UpdatePassword;
