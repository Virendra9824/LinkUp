import React from "react";
import SuggestedUser from "../SuggestedUser/SuggestedUser";

export default function UserSuggested() {
  return (
    <div className="  space-y-6 ">
      {/* Sponsored Ad Section */}
      <div className="bg-[#1A1A1A] rounded-lg p-6 ">
        <div className="flex justify-between items-center">
          <span className="font-semibold text-sm">Sponsored</span>
          <button className="text-sm text-gray-400">Create Ad</button>
        </div>
        <div className="flex justify-center">
          <img
            src="https://images.squarespace-cdn.com/content/v1/5fce63270356d927d7eecdbd/3e62a95c-1193-45a5-b0ee-f0407fd16b73/DSC_6027.jpg?format=1000w" // Replace with actual ad image URL
            alt="Ad"
            className="w-full xs:w-76 mt-4 rounded-lg "
          />
        </div>

        <div className="mt-4">
          <h3 className="font-bold">Tribe Vibe</h3>
          <a href="http://localhost:3000/" className="text-sm text-gray-400">
            tribevibe.com
          </a>
          <p className="mt-2 text-sm text-gray-300">
            Your pathway to stunning and immaculate beauty and make sure your
            skin is exfoliating skin and shining like light.
          </p>
        </div>
      </div>

      {/* Suggested for You Section */}
      <>
        <SuggestedUser />
      </>
    </div>
  );
}
