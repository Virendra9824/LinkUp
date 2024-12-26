import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { IoMdMoon, IoIosNotifications } from "react-icons/io";
import { PiQuestionMarkFill } from "react-icons/pi";
import { MdMessage } from "react-icons/md";
import { FaBars, FaTimes } from "react-icons/fa";
import { HiSearch } from "react-icons/hi";
import DeleteAccount from "../forms/DeleteAccount";
import toast from "react-hot-toast";
import { deleteAccount, logout } from "../../apis/authApi";
import { useDispatch, useSelector } from "react-redux";
import { setToken } from "../../redux/slices/authSlice";
import { setUser } from "../../redux/slices/profileSlice";

export default function Header() {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchBarOpen, setIsSearchBarOpen] = useState(false);
  const [isModalOpen, setModalOpen] = useState(false);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const loggedInUser = useSelector((state) => state.profile.user);
  const userId = loggedInUser?._id;
  let userName = `${loggedInUser?.firstName || "Logged"} ${
    loggedInUser?.lastName || "Out"
  }`;
  const { token } = useSelector((state) => state.auth);

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const toggleSearchBar = () => {
    setIsSearchBarOpen(!isSearchBarOpen);
  };

  const handleOpenModal = () => {
    setModalOpen(true);
  };

  let handleLogout = async () => {
    try {
      setLoading(true);
      const response = await logout();
      dispatch(setToken(null));
      dispatch(setUser(null));
      console.log("Response of logout: ", response);
      navigate("/auth/login");
      toast.success("User Logged out");
    } catch (error) {
      toast.error("Error while Logout");
      console.log("Error while logout: ", error);
    } finally {
      setLoading(false);
    }
  };

  let handleDeleteAccount = async () => {
    const toastId = toast.loading("Deleting A/C..");
    try {
      setLoading(true);
      const response = await deleteAccount();
      console.log("Response of Deleting A/C: ", response);
      navigate("/auth/signup");
    } catch (error) {
      toast.error("A/C not Deleted");
      console.log("Error while deleting A/C.");
    } finally {
      toast.dismiss(toastId);
      setModalOpen(false);
      setLoading(false);
    }
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="bg-[rgb(26,26,26)] z-[1000] w-full fixed">
      <header className="md:w-[90%] w-[100%] px-4 md:px-0 text-white m-auto py-5 flex justify-between items-center relative">
        {/* Logo Section */}
        <div className="flex items-center space-x-4">
          <Link
            to="/"
            onClick={() => window.scrollTo(0, 0)}
            className="text-2xl md:text-3xl font-bold text-cyan-500 whitespace-nowrap"
          >
            LinkUp
          </Link>
        </div>

        {/* Search Bar (Desktop Only) */}
        <div className="hidden md:flex items-center bg-[rgb(51,51,51)] rounded-full px-4 py-1 space-x-2">
          <input
            type="text"
            placeholder="Search..."
            className="bg-transparent focus:outline-none text-white"
          />
          <button className="text-white">
            <HiSearch size={20} />
          </button>
        </div>

        {/* Mobile Menu Button and Search Icon Button */}
        <div className="flex items-center space-x-8">
          {/* Search Icon Button for Mobile */}
          <button className="md:hidden text-xl" onClick={toggleSearchBar}>
            <HiSearch />
          </button>

          {/* Mobile Menu Button */}
          <button className="md:hidden text-xl" onClick={toggleMobileMenu}>
            {isMobileMenuOpen ? <FaTimes /> : <FaBars />}
          </button>
        </div>

        {/* Search Input for Mobile */}
        {isSearchBarOpen && (
          <div className="absolute top-full right-0 w-full bg-gray-800 p-2 z-20">
            <input
              type="text"
              placeholder="Search..."
              className="bg-transparent focus:outline-none text-white w-full"
            />
          </div>
        )}

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="absolute top-full left-0 w-full bg-gray-800 z-10 md:hidden">
            <div className="flex flex-col items-center space-y-4 p-4">
              {/* Icons for Mobile Menu */}
              <Link to="/" className="text-xl text-white hover:text-cyan-500">
                <IoMdMoon />
              </Link>
              <Link
                to="/chat/me"
                className="text-xl text-white hover:text-cyan-500"
              >
                <MdMessage />
              </Link>
              <Link
                to="notification"
                className="text-xl text-white hover:text-cyan-500"
              >
                <IoIosNotifications />
              </Link>
              <Link
                to="/about"
                className="text-xl text-white hover:text-cyan-500"
              >
                <PiQuestionMarkFill />
              </Link>

              {/* User Dropdown in Mobile Menu */}
              <div
                className={`${
                  !token ? "cursor-not-allowed hidden" : ""
                }  relative`}
              >
                <button
                  onClick={toggleDropdown}
                  className="inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-gray-800 text-sm font-medium text-white hover:bg-gray-700 focus:outline-none"
                >
                  <span>{userName}</span>
                  {/* Updated SVG Path */}
                  <svg
                    className="-mr-1 ml-2 h-5 w-5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    aria-hidden="true"
                  >
                    <path d="M10 12l-4-4h8l-4 4z" />
                  </svg>
                </button>

                {/* Dropdown menu for mobile */}
                {isDropdownOpen && (
                  <div
                    className={`origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-[rgb(51,51,51)] ring-1 ring-black ring-opacity-5 focus:outline-none`}
                  >
                    <div className="py-1">
                      <Link
                        to={`/user/${userId}`}
                        className="block px-4 py-2 text-sm text-white hover:bg-gray-700"
                      >
                        MyProfile
                      </Link>
                      {/* <Link
                        to="auth/login"
                        className="block px-4 py-2 text-sm text-white hover:bg-gray-700"
                      >
                        Login
                      </Link>
                      <Link
                        to="auth/signup"
                        className="block px-4 py-2 text-sm text-white hover:bg-gray-700"
                      >
                        SignUp
                      </Link> */}
                      <Link
                        to="update-profile"
                        className="block px-4 py-2 text-sm text-white hover:bg-gray-700"
                      >
                        Update Profile
                      </Link>
                      <Link
                        onClick={handleLogout}
                        className="block px-4 py-2 text-sm text-white hover:bg-gray-700"
                      >
                        Log Out
                      </Link>
                      <Link
                        to="/auth/update-password"
                        className="block px-4 py-2 text-sm text-white hover:bg-gray-700"
                      >
                        Update Password
                      </Link>
                      <Link
                        onClick={handleOpenModal}
                        className="block px-4 py-2 text-sm text-white hover:bg-gray-700"
                      >
                        Delete Account
                      </Link>
                      <DeleteAccount
                        handleDeleteAccount={handleDeleteAccount}
                        loading={loading}
                        isModalOpen={isModalOpen}
                        setModalOpen={setModalOpen}
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Icons and User Section for Desktop */}
        <div className="hidden md:flex items-center space-x-6">
          <Link to="/" className="text-xl cursor-pointer hover:text-cyan-500">
            <IoMdMoon />
          </Link>
          <Link to="/chat/me" className="text-xl cursor-pointer">
            <MdMessage />
          </Link>
          <Link to="notification" className="text-xl cursor-pointer">
            <IoIosNotifications />
          </Link>
          <Link to="/about" className="text-xl cursor-pointer">
            <PiQuestionMarkFill />
          </Link>

          {/* User Dropdown */}
          <div
            className={`${
              !token ? "cursor-not-allowed hidden" : ""
            }  relative inline-block text-left`}
          >
            <button
              onClick={toggleDropdown}
              className="inline-flex justify-center w-full rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-[rgb(51,51,51)] text-sm font-medium text-white hover:bg-gray-700 focus:outline-none"
            >
              <span>{userName}</span>
              {/* Updated SVG Path */}
              <svg
                className="-mr-1 ml-2 h-5 w-5"
                viewBox="0 0 20 20"
                fill="currentColor"
                aria-hidden="true"
              >
                <path d="M10 12l-4-4h8l-4 4z" />
              </svg>
            </button>

            {/* Dropdown menu for desktop */}
            {isDropdownOpen && (
              <div className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-[rgb(51,51,51)] ring-1 ring-black ring-opacity-5 focus:outline-none">
                <div className="py-1">
                  <Link
                    to={`/user/${userId}`}
                    className="block px-4 py-2 text-sm text-white hover:bg-gray-700"
                  >
                    MyProfile
                  </Link>
                  {/* <Link
                    to="auth/login"
                    className="block px-4 py-2 text-sm text-white hover:bg-gray-700"
                  >
                    Login
                  </Link>
                  <Link
                    to="auth/signup"
                    className="block px-4 py-2 text-sm text-white hover:bg-gray-700"
                  >
                    SignUp
                  </Link> */}
                  <Link
                    to="update-profile"
                    className="block px-4 py-2 text-sm text-white hover:bg-gray-700"
                  >
                    Update Profile
                  </Link>
                  <Link
                    to="/auth/update-password"
                    className="block px-4 py-2 text-sm text-white hover:bg-gray-700"
                  >
                    Update Password
                  </Link>
                  <Link
                    onClick={handleLogout}
                    className="block px-4 py-2 text-sm text-white hover:bg-gray-700"
                  >
                    Log Out
                  </Link>
                  <Link
                    onClick={handleOpenModal}
                    className="block px-4 py-2 text-sm text-white hover:bg-gray-700"
                  >
                    Delete Account
                  </Link>
                  <DeleteAccount
                    handleDeleteAccount={handleDeleteAccount}
                    loading={loading}
                    isModalOpen={isModalOpen}
                    setModalOpen={setModalOpen}
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </header>
    </div>
  );
}
