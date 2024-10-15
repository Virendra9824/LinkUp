import React from "react";

export default function UserDetails() {
  // let { username, commentData, profilePic } = props;
  return (
    <div className="bg-[#1A1A1A] h-fit px-6 py-4 rounded-lg">
      <div className='flex justify-center items-center text-[#C2C2C2]'>
        <div className="max-w-xxl  text-white rounded-lg shadow-lg p-8">
          <div className="flex items-center justify-evenly ">
            <img
              src="https://via.placeholder.com/100" // Replace with actual image URL
              alt="profile"
              className="w-24 h-24 rounded-full border-2 border-white"
            />
            <div className="text-center mt-4">
              <h2 className="text-xl font-semibold">cat sharma</h2>
              <p className="text-gray-400">3 friends</p>
            </div>
            <div className="text-center mt-4">
              <h2 className="text-xl font-semibold">cat sharma</h2>
              <p className="text-gray-400">3 friends</p>
            </div>
          </div>


          <div className="mt-6 space-y-2 ">
            <div className="flex items-center space-x-2">
              <span className="material-icons">location_on</span>
              <span className="text-gray-400">india</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="material-icons">work</span>
              <span className="text-gray-400">student</span>
            </div>
            <div className="mt-4 flex-col ">
              <p className='flex justify-between'><span>Who's viewed your profile: </span><span className="font-bold">219</span></p>
              <p className='flex justify-between'><span>Impressions of your post:</span> <span className="font-bold">824</span></p>
            </div>
          </div>

          <div className="mt-6 space-y-4">
            <h3 className="text-lg font-semibold">Social Profiles</h3>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <span className="material-icons">twitter</span>
                <span>Twitter</span>
              </div>
              <button className="material-icons text-gray-400">edit</button>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <span className="material-icons">linkedin</span>
                <span>LinkedIn</span>
              </div>
              <button className="material-icons text-gray-400">edit</button>
            </div>
          </div>

          <div className="mt-6 space-y-6">
            <button className="w-full bg-[#06CDF4] text-black hover:text-[#06CDF4] hover:bg-[#18292C] duration-200 py-1 px-2 rounded-md">Update Profile</button>

            <button className="w-full bg-[#06CDF4] text-black hover:text-[#06CDF4] hover:bg-[#18292C] duration-200 py-1 px-2 rounded-md">Update Password</button>
            <button className="w-full bg-red-500 text-black hover:text-red-500 hover:bg-[#291818] duration-200 py-1 px-2 rounded-md">Delete Account</button>
          </div>
        </div>
      </div>
    </div>
  );
}
