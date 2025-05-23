
import React from 'react';

export default function SingleNotification() {
  const notifications = [
    {
      id: 1,
      user: "Jonathan Michael Djbnkjnkjnoe the Third", // Example of a long name
      action: "liked your post",
      time: "2 hours ago",
      avatar: "https://i.pinimg.com/564x/88/f7/0a/88f70a56a6b69c9464f8600ab4bebe3f.jpg",
    },
    {
      id: 2,
      user: "Jane Smith",
      action: "commented on your photo",
      time: "5 hours ago",
      avatar: "https://i.pinimg.com/564x/7d/ac/b3/7dacb3b58c25ceeebc4f970c6c3f8ee3.jpg",
    },
    {
      id: 3,
      user: "Mike Ross",
      action: "started followinlinlsefaljng you", //example of long action
      time: "1 day ago",
      avatar: "https://www.shutterstock.com/shutterstock/photos/2494502645/display_1500/stock-photo-florence-tuscany-italy-december-th-city-tour-in-florence-michelangelo-s-david-of-2494502645.jpg",
    },{
        id: 4,
        user: "Jonathan Michael Djbnkjnkjnoe the Third", // Example of a long name
        action: "liked your post",
        time: "2 hours ago",
        avatar: "https://via.placeholder.com/150",
      },
      {
        id: 5,
        user: "Jane Smith",
        action: "commented on your photo",
        time: "5 hours ago",
        avatar: "https://via.placeholder.com/150",
      },
      {
        id: 6,
        user: "Mike Ross",
        action: "started followinlinlsefaljng you", //example of long action
        time: "1 day ago",
        avatar: "https://via.placeholder.com/150",
      },{
        id: 7,
        user: "Jonathan Michael Djbnkjnkjnoe the Third", // Example of a long name
        action: "liked your post",
        time: "2 hours ago",
        avatar: "https://via.placeholder.com/150",
      },
      {
        id: 8,
        user: "Jane Smith",
        action: "commented on your photo",
        time: "5 hours ago",
        avatar: "https://via.placeholder.com/150",
      },
      {
        id: 9,
        user: "Mike Ross",
        action: "started followinlinlsefaljng you", //example of long action
        time: "1 day ago",
        avatar: "https://via.placeholder.com/150",
      }
    // Add more notifications as needed
  ];

  return (
    <div className="w-[90%] md:w-[90%] m-auto">
      <h1 className="text-2xl font-semibold p-1 my-2">Notifications</h1>
      <div className="space-y-2">
        {notifications.map((notification) => (
          <div
            key={notification.id}
            className="flex items-center p-2 bg-gray-800 text-white rounded-lg shadow-md hover:bg-gray-700 transition duration-300 ease-in-out"
          >
            <img
              src={notification.avatar}
              alt={`${notification.user}'s avatar`}
              className="w-12 h-12 rounded-full mr-4"
            />
            <div className="flex-grow">
              <p className="text-sm">
                <span className="font-semibold truncate block max-w-[150px]">{notification.user}</span>
                <span className=" truncate  ">{notification.action}</span> 
              </p>
              <p className="text-xs text-gray-400">{notification.time}</p>
            </div>
            <button className="text-xs text-emerald-500 w-[30%] hover:text-emerald-300">
              View
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}




