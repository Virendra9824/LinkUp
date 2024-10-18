

import React, { useState } from "react";
import { Link } from "react-router-dom";
import { IoMdMoon, IoIosNotifications } from "react-icons/io";
import { PiQuestionMarkFill } from "react-icons/pi";
import { MdMessage } from "react-icons/md";
import { FaBars, FaTimes } from "react-icons/fa";
import { HiSearch } from "react-icons/hi";
import DeleteAccount from "../forms/DeleteAccount";

export default function Header() {
  let userName = "Vijay Kumar";
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchBarOpen, setIsSearchBarOpen] = useState(false);
  const [isModalOpen, setModalOpen] = useState(false);

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

  return (
    <div className="bg-[rgb(26,26,26)] z-[1000] w-full fixed">
      <header className="md:w-[90%] w-[100%] px-4 md:px-0 text-white m-auto py-5 flex justify-between items-center relative">
        {/* Logo Section */}
        <div className="flex items-center space-x-4">
          <Link to="/" className="text-2xl md:text-3xl font-bold text-cyan-500 whitespace-nowrap">
            Link-Up
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
              <Link to="testPage" className="text-xl text-white hover:text-cyan-500">
                <IoMdMoon />
              </Link>
              <Link to="testPage" className="text-xl text-white hover:text-cyan-500">
                <MdMessage />
              </Link>
              <Link to="testPage" className="text-xl text-white hover:text-cyan-500">
                <IoIosNotifications />
              </Link>
              <Link to="testPage" className="text-xl text-white hover:text-cyan-500">
                <PiQuestionMarkFill />
              </Link>

              {/* User Dropdown in Mobile Menu */}
              <div className="relative">
                <button
                  onClick={toggleDropdown}
                  className="inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-gray-800 text-sm font-medium text-white hover:bg-gray-700 focus:outline-none"
                >
                  <span>{userName}</span>
                  {/* Updated SVG Path */}
                  <svg
                    className="-mr-1 ml-2 h-5 w-5"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    aria-hidden="true"
                  >
                    <path d="M10 12l-4-4h8l-4 4z" />
                  </svg>
                </button>

                {/* Dropdown menu for mobile */}
                {isDropdownOpen && (
                  <div className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-[rgb(51,51,51)] ring-1 ring-black ring-opacity-5 focus:outline-none">
                    <div className="py-1">
                      <Link to="update-profile" className="block px-4 py-2 text-sm text-white hover:bg-gray-700">
                        Update Profile
                      </Link>
                      <Link to="testPage" className="block px-4 py-2 text-sm text-white hover:bg-gray-700">
                        Log Out
                      </Link>
                      <Link to="update-password" className="block px-4 py-2 text-sm text-white hover:bg-gray-700">
                        Update Password
                      </Link>
                      <Link
                        to="update-password"
                        onClick={handleOpenModal}
                        className="block px-4 py-2 text-sm text-white hover:bg-gray-700"
                      >
                        Delete Account
                      </Link>
                      <DeleteAccount isModalOpen={isModalOpen} setModalOpen={setModalOpen} />
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Icons and User Section for Desktop */}
        <div className="hidden md:flex items-center space-x-6">
          <Link to="testPage" className="text-xl cursor-pointer">
            <IoMdMoon />
          </Link>
          <Link to="testPage" className="text-xl cursor-pointer">
            <MdMessage />
          </Link>
          <Link to="testPage" className="text-xl cursor-pointer">
            <IoIosNotifications />
          </Link>
          <Link to="testPage" className="text-xl cursor-pointer">
            <PiQuestionMarkFill />
          </Link>

          {/* User Dropdown */}
          <div className="relative inline-block text-left">
            <button
              onClick={toggleDropdown}
              className="inline-flex justify-center w-full rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-[rgb(51,51,51)] text-sm font-medium text-white hover:bg-gray-700 focus:outline-none"
            >
              <span>{userName}</span>
              {/* Updated SVG Path */}
              <svg
                className="-mr-1 ml-2 h-5 w-5"
                xmlns="http://www.w3.org/2000/svg"
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
                  <Link to="update-profile" className="block px-4 py-2 text-sm text-white hover:bg-gray-700">
                    Update Profile
                  </Link>
                  <Link to="update-password" className="block px-4 py-2 text-sm text-white hover:bg-gray-700">
                    Update Password
                  </Link>
                  <Link to="testPage" className="block px-4 py-2 text-sm text-white hover:bg-gray-700">
                    Log Out
                  </Link>
                  <Link
                    to="testPage"
                    onClick={handleOpenModal}
                    className="block px-4 py-2 text-sm text-white hover:bg-gray-700"
                  >
                    Delete Account
                  </Link>
                  <DeleteAccount isModalOpen={isModalOpen} setModalOpen={setModalOpen} />
                </div>
              </div>
            )}
          </div>
        </div>
      </header>
    </div>
  );
}
