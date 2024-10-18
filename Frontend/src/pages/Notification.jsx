import React, { useState } from "react";
import SingleNotification from "../components/Notification/SingleNotification";
import SingleUserDetails from "../components/Notification/SingleUserDetials";

export default function Notification() {
  const [selectedNotification, setSelectedNotification] = useState(null);

  // Function to handle when a notification is clicked
  const handleNotificationClick = (notification) => {
    setSelectedNotification(notification); // Set the selected notification for mobile view
  };

  return (
    <div className="md:pt-4 md:pb-8  pt-12 flex flex-col md:flex-row w-[90%] m-auto">
      {/* Notification Section */}
      <div
        className={`w-full  overflow-y-scroll scrollbar-hide md:w-[35%] bg-[rgb(26,26,26)] md:rounded-l-[8px] border-[1px] h-[400px] overflow-y-auto ${
          selectedNotification ? "hidden" : "block"
        } md:block`}
      >
        <SingleNotification onClick={handleNotificationClick} />
      </div>
      
      {/* User Details Section */}
      <div
        className={`w-full md:w-[65%] bg-[rgb(26,26,26)] md:rounded-r-[8px] h-[400px] p-6 border-[1px] ${
          selectedNotification ? "block" : "hidden"
        } md:block`}
      >
        {selectedNotification ? (
          <SingleUserDetails notification={selectedNotification} />
        ) : (
          <p className="text-white">Select a notification to view details.</p>
        )}
      </div>
    </div>
  );
}


