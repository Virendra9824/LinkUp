import React, { useState } from "react";
import { MdOutlineEdit } from "react-icons/md";
import { FaTwitter } from "react-icons/fa";
import { FaLinkedin } from "react-icons/fa6";
import { IoLocationOutline } from "react-icons/io5";
import { IoIosBriefcase } from "react-icons/io";
import { IoMdSettings } from "react-icons/io";
import { Link } from "react-router-dom";
import DeleteAccount from "../forms/DeleteAccount";

export default function UserDetails() {
  const [isModalOpen, setModalOpen] = useState(false);

  // Function to open the modal
  const handleOpenModal = () => {
    setModalOpen(true);
  };
  // let { username, commentData, profilePic } = props;
  const profilePic =
    "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=2187&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D";

  return (
    <div className="bg-[#1A1A1A] h-fit p-6 rounded-lg ">
      <div className="flex justify-center items-center text-[#C2C2C2]">
        <div className="max-w-xxl  text-white rounded-lg shadow-lg ">
          <div className="flex items-center justify-between">
            <div className="flex gap-x-2 items-center  ">
              <img
                src={profilePic} // Replace with actual image URL
                alt="profile"
                className="aspect-square xs:w-12 w-10 rounded-full "
              />
              <div className="flex flex-col justify-center items-start">
                {" "}
                {/* Adjusted classes here */}
                <h2 className="text-xl font-semibold">cat sharma</h2>
                <p className="text-gray-400">3 friends</p>
              </div>
            </div>
            <div className="text-center">
              <IoMdSettings className="text-3xl" />
            </div>
          </div>

          <div className="mt-6 space-y-2 ">
            <div className="flex items-center space-x-2">
              <span className="">
                <IoLocationOutline className="text-2xl" />
              </span>
              <span className="text-gray-400">india</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="">
                <IoIosBriefcase className="text-2xl" />
              </span>
              <span className="text-gray-400">student</span>
            </div>
            <div className="mt-4 flex-col ">
              <p className="flex justify-between">
                <span>Who's viewed your profile: </span>
                <span className="font-bold">219</span>
              </p>
              <p className="flex justify-between">
                <span>Impressions of your post:</span>{" "}
                <span className="font-bold">824</span>
              </p>
            </div>
          </div>

          <div className="mt-6 space-y-4">
            <h3 className="text-lg font-semibold">Social Profiles</h3>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <span>
                  <FaTwitter className="text-[#A3A3A3] text-2xl " />
                </span>
                <span>Twitter</span>
              </div>
              <button className=" text-gray-400 ">
                <MdOutlineEdit className="text-2xl" />
              </button>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <span>
                  <FaLinkedin className="text-[#A3A3A3] text-2xl " />
                </span>
                <span>LinkedIn</span>
              </div>
              <button className=" text-gray-400  ">
                <MdOutlineEdit className="text-2xl" />
              </button>
            </div>
          </div>

          <div className="mt-6 space-y-6 ">
            <Link
              to={"/update-profile"}
              className="w-full text-center inline-block  bg-[#06CDF4] text-black hover:text-[#06CDF4] hover:bg-[#18292C] duration-200 py-1 px-2 rounded-md"
            >
              Update Profile
            </Link>

            <Link
              to={"/update-password"}
              className="w-full  text-center inline-block  bg-[#06CDF4] text-black hover:text-[#06CDF4] hover:bg-[#18292C] duration-200 py-1 px-2 rounded-md"
            >
              Update Password
            </Link>
            <Link
              to={"/"}
              onClick={handleOpenModal}
              className="w-full  text-center inline-block  bg-red-500 text-black hover:text-red-500 hover:bg-[#291818] duration-200 py-1 px-2 rounded-md"
            >
              Delete Account

            </Link>
            <DeleteAccount isModalOpen={isModalOpen} setModalOpen={setModalOpen} />

            
          </div>
        </div>
      </div>
    </div>
  );
}
