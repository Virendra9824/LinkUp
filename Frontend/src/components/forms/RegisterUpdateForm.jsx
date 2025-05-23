import React, { useEffect, useState } from "react";
import { LuEye } from "react-icons/lu";
import { LuEyeOff } from "react-icons/lu";
import { Link, useNavigate } from "react-router-dom";
import ImageUploader from "../common/ImageUploader";
import toast from "react-hot-toast";
import { sendOTP } from "../../apis/authApi";
import { signUp } from "../../apis/authApi";
import { useDispatch, useSelector } from "react-redux";
import { updateProfile } from "../../apis/userApi";
import { setUser } from "../../redux/slices/profileSlice";

export default function RegisterUpdateForm(props) {
  const { isUpdateForm } = props;
  const loggedInUser = useSelector((state) => state.profile.user);

  // State for form inputs
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    userName: "",
    email: "",
    password: "",
    confirmPassword: "",
    otp: "",
    gender: "male",
    role: "student",
    bio: "",
  });

  // State for form errors
  const [formErrors, setFormErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [sendOtpLoading, setSendOtpLoading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [sendOtpBtnMessage, setSendOtpBtnMessage] = useState("Send OTP");
  const navigate = useNavigate();
  const [profilePic, setProfilePic] = useState(null);
  const dispatch = useDispatch();

  // Validate the userName.
  let isValidUsername = (username) => {
    const usernameRegex = /^[a-zA-Z0-9._]+$/;
    const minLength = 5;
    const maxLength = 20;

    if (username?.length < minLength || username?.length > maxLength) {
      setFormErrors((prevErrors) => ({
        ...prevErrors,
        userName: "Username must be between 5 and 20 characters long.",
      }));
      return false;
    }
    if (!usernameRegex.test(username)) {
      setFormErrors((prevErrors) => ({
        ...prevErrors,
        userName:
          "Username can only contain letters, numbers, dots, and underscores.",
      }));
      return false;
    }

    setFormErrors((prevErrors) => ({
      ...prevErrors,
      userName: "",
    }));
    return true;
  };

  // Validate the bio.
  let isValidBio = (bio) => {
    const minLength = 5;
    const maxLength = 50;

    if (bio?.length < minLength || bio?.length > maxLength) {
      setFormErrors((prevErrors) => ({
        ...prevErrors,
        bio: "Bio must be between 5 and 50 chars long.",
      }));
      return false;
    }

    setFormErrors((prevErrors) => ({
      ...prevErrors,
      bio: "",
    }));
    return true;
  };

  // Form validation function
  const validateForm = () => {
    let errors = {};

    if (isUpdateForm && !formData.userName.trim()) {
      errors.userName = "Username is required";
    }
    if (isUpdateForm && !formData.bio.trim()) {
      errors.bio = "Bio is required";
    }
    if (!formData.firstName.trim()) {
      errors.firstName = "First name is required";
    }
    if (!formData.lastName.trim()) {
      errors.lastName = "Last name is required";
    }
    if (!formData.gender) {
      errors.gender = "Gender is required";
    }
    if (!formData.role) {
      errors.role = "Role is required";
    }
    if (!isUpdateForm && !formData.email) {
      errors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email) && !isUpdateForm) {
      errors.email = "Email is invalid";
    }
    if (!formData.password) {
      errors.password = "Password is required";
    }
    if (!isUpdateForm && formData.password !== formData.confirmPassword) {
      errors.confirmPassword = "Passwords do not match";
    }
    if (!isUpdateForm && !formData.otp) {
      errors.otp = "OTP is required";
    }
    if (isUpdateForm && !profilePic) {
      errors.profilePic = "Profile picture is required";
    }

    setFormErrors(errors);

    // Return true if no errors
    return Object.keys(errors).length === 0;
  };

  // Handle form submission for both register and update
  const handleSubmit = async (e) => {
    e.preventDefault();

    // For sending files, simple js object is not suitable.
    const formDataToSend = new FormData(); // Create a FormData instance

    // Append all fields from the formData object
    Object.keys(formData).forEach((key) => {
      formDataToSend.append(key, formData[key]);
    });

    // NEW USER REGISTRATION FORM
    if (!isUpdateForm && validateForm()) {
      if (profilePic) formDataToSend.append("file", profilePic);

      // console.log("Form data submitted is:");
      // for (let [key, value] of formDataToSend.entries()) {
      //   console.log(`${key}:`, value);
      // }

      const toastId = toast.loading("Loading...");
      try {
        setLoading(true);
        const response = await signUp(formDataToSend);
        console.log("Response of Signup form: ", response);
        toast.success("Signup successfully");
        navigate("/auth/login");
      } catch (error) {
        toast.error("Invalid OTP.");
        console.log("Error while signup: ", error);
      } finally {
        toast.dismiss(toastId);
        setLoading(false);
        // setFormData({
        //   firstName: "",
        //   lastName: "",
        //   email: "",
        //   password: "",
        //   confirmPassword: "",
        //   otp: "",
        //   gender: "male",
        //   role: "student",
        // });
      }
    }

    // UPDATE PROFILE FORM
    if (isUpdateForm && validateForm()) {
      if (profilePic) formDataToSend.append("file", profilePic);

      // console.log("Form data submitted is:");
      // for (let [key, value] of formDataToSend.entries()) {
      //   console.log(`${key}:`, value);
      // }

      if (!isValidUsername(formDataToSend.get("userName"))) {
        toast.error("Invalid username.");
        return;
      }

      if (!isValidBio(formDataToSend.get("bio"))) {
        toast.error("Invalid Bio.");
        return;
      }

      const toastId = toast.loading("Loading...");
      try {
        setLoading(true);
        const response = await updateProfile(formDataToSend);
        console.log("Response of updateProfile form: ", response);

        dispatch(setUser(response.updatedUser));

        if (response?.success) {
          toast.success("Profile updated successfully");
          navigate(`/user/${loggedInUser?._id}`);
        } else {
          toast.error(response?.message || "Error updating profile");
        }
      } catch (error) {
        toast.error("Invalid Password.");
        console.log("Error in update profile: ", error);
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
    const toastId = toast.loading("Loading...");
    try {
      setLoading(true);
      setSendOtpLoading(true);
      const response = await sendOTP({ email });
      // console.log("Response of OTP sent: ", response);
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

  const setInitialUserData = () => {
    setProfilePic(loggedInUser?.profilePic?.url);
    setFormData({
      firstName: loggedInUser?.firstName,
      lastName: loggedInUser?.lastName,
      userName: loggedInUser?.userName,
      gender: loggedInUser?.gender,
      role: loggedInUser?.role,
      bio: loggedInUser?.bio ? loggedInUser?.bio : "Login Again!",
      password: "",
    });
  };

  useEffect(() => {
    if (isUpdateForm) {
      setInitialUserData();
    }

    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="bg-[#1A1A1A] w-11/12 xs:w-[95%] sm:w-[80%] md:w-[50%] p-3 sm:p-4 md:p-7 mx-auto flex flex-col justify-between gap-4 rounded-xl my-2">
      <h1 className="text-white font-bold text-xl">
        Welcome to LinkUp,{" "}
        {isUpdateForm
          ? "update your profile!"
          : " the Social Media for Sociopaths!"}
      </h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        {/* Section: Unique UserName */}
        {isUpdateForm && (
          <div className="flex flex-col w-full">
            <label className="relative top-2 w-fit px-1 bg-[#1A1A1A] text-sm left-3 text-[#06B6D4]">
              Username
            </label>
            <input
              type="text"
              name="userName"
              value={formData.userName}
              onChange={handleInputChange}
              placeholder="Enter your first name"
              className="py-2 px-4 bg-[#1A1A1A] text-white border border-gray-500 rounded focus:outline-none focus:border-2 focus:border-[#06B6D4]"
            />
            {formErrors.userName && (
              <p className="text-red-500 text-xs mt-1 pl-1">
                {formErrors.userName} <sup>*</sup>
              </p>
            )}
          </div>
        )}

        {/* Section: Bio */}
        {isUpdateForm && (
          <div className="flex flex-col w-full">
            <label className="relative top-2 w-fit px-1 bg-[#1A1A1A] text-sm left-3 text-[#06B6D4]">
              Bio/Tagline
            </label>
            <input
              type="text"
              name="bio"
              value={formData.bio}
              onChange={handleInputChange}
              placeholder="Enter bio (max 50 chars)"
              className="py-2 px-4 bg-[#1A1A1A] text-white border border-gray-500 rounded focus:outline-none focus:border-2 focus:border-[#06B6D4]"
            />
            {formErrors.bio && (
              <p className="text-red-500 text-xs mt-1 pl-1">
                {formErrors.bio} <sup>*</sup>
              </p>
            )}
          </div>
        )}

        {/* Section: First and Last Name */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex flex-col w-full md:w-[48%]">
            <label className="relative top-2 w-fit px-1 bg-[#1A1A1A] text-sm left-3 text-[#06B6D4]">
              First Name
            </label>
            <input
              type="text"
              name="firstName"
              value={formData.firstName}
              onChange={handleInputChange}
              placeholder="Enter your first name"
              className="py-2 px-4 bg-[#1A1A1A] text-white border border-gray-500 rounded focus:outline-none focus:border-2 focus:border-[#06B6D4]"
            />
            {formErrors.firstName && (
              <p className="text-red-500 text-xs mt-1 pl-1">
                {formErrors.firstName} <sup>*</sup>
              </p>
            )}
          </div>
          <div className="flex flex-col w-full md:w-[48%]">
            <label className="relative top-2 w-fit px-1 bg-[#1A1A1A] text-sm left-3 text-[#06B6D4]">
              Last Name
            </label>
            <input
              type="text"
              name="lastName"
              value={formData.lastName}
              onChange={handleInputChange}
              placeholder="Enter your last name"
              className="py-2 px-4 bg-[#1A1A1A] text-white border border-gray-500 rounded focus:outline-none focus:border-2 focus:border-[#06B6D4]"
            />
            {formErrors.lastName && (
              <p className="text-red-500 text-xs mt-1 pl-1">
                {formErrors.lastName} <sup>*</sup>
              </p>
            )}
          </div>
        </div>

        {/* Section: Gender and Role */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          {/* Gender Select */}
          <div className="flex flex-col w-full md:w-[48%]">
            <label className="relative top-2 w-fit px-1 bg-[#1A1A1A] text-sm left-3 text-[#06B6D4]">
              Gender
            </label>
            <select
              name="gender"
              value={formData.gender || "male"}
              onChange={handleInputChange}
              className="py-2 px-4 bg-[#1A1A1A] text-white border border-gray-500 rounded focus:outline-none focus:border-2 focus:border-[#06B6D4]"
            >
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
            {formErrors.gender && (
              <p className="text-red-500 text-xs mt-1 pl-1">
                {formErrors.gender} <sup>*</sup>
              </p>
            )}
          </div>

          {/* Role Select */}
          <div className="flex flex-col w-full md:w-[48%]">
            <label className="relative top-2 w-fit px-1 bg-[#1A1A1A] text-sm left-3 text-[#06B6D4]">
              Role
            </label>
            <select
              name="role"
              value={formData.role || "student"}
              onChange={handleInputChange}
              className="py-2 px-4 bg-[#1A1A1A] text-white border border-gray-500 rounded focus:outline-none focus:border-2 focus:border-[#06B6D4]"
            >
              <option value="student">Student</option>
              <option value="teacher">Teacher</option>
              <option value="other">Other</option>
            </select>
            {formErrors.role && (
              <p className="text-red-500 text-xs mt-1 pl-1">
                {formErrors.role} <sup>*</sup>
              </p>
            )}
          </div>
        </div>

        {/* Section: Profile Picture */}
        <div className="flex flex-col">
          <label className="relative top-2 w-fit px-1 bg-[#1A1A1A] text-sm left-3 text-[#06B6D4]">
            Profile Photo
          </label>
          <div className="border rounded-md flex items-center justify-center border-gray-500 ">
            <div className="m-4 w-full rounded-md border-2 border-dashed border-[#00D5FA] text-center text-gray-400">
              <ImageUploader
                setPostImage={setProfilePic}
                thumbnailLink={props?.isUpdateForm ? profilePic : null}
              />
            </div>
          </div>
          {formErrors.profilePic && (
            <p className="text-red-500 text-xs mt-1 pl-1">
              {formErrors.profilePic} <sup>*</sup>
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

        {/* Section: Confirm Password */}
        {!isUpdateForm && (
          <div className="flex flex-col">
            <label className="relative z-20 top-2 w-fit px-1 bg-[#1A1A1A] text-sm left-3 text-[#06B6D4]">
              Confirm Password
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
        )}

        {/* Section: Forgot-Password */}
        {isUpdateForm && (
          <Link
            to={"/auth/update-password"}
            className="text-[#06B6D4] text-left pl-2 font-bold underline italic"
          >
            Forgot password ?
          </Link>
        )}

        {/* Section: Email */}
        {!isUpdateForm && (
          <div className="flex flex-col">
            <label className="relative  z-20 top-2 w-fit px-1 bg-[#1A1A1A] text-sm left-3 text-[#06B6D4]">
              Email
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
        )}

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
          {isUpdateForm ? "Update Profile" : "Register"}
        </button>

        {/* Section: Already have A/C */}
        {!isUpdateForm && (
          <Link
            to={"/auth/login"}
            className="text-[#06B6D4] text-left pl-2 font-bold underline italic"
          >
            Already have an account? Login here.
          </Link>
        )}
      </form>
    </div>
  );
}
