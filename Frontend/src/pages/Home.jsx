import React, { useEffect } from "react";
import CreatePost from "../components/posts/CreatePost";
import ShowPost from "../components/posts/ShowPost";
import UserDetails from "../components/home/UserDetails";
import UserSuggested from "../components/home/UserSuggested";

export default function Home() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  return (
    <div className="w-[90%] lg:pb-5 pb-3 lg:pt-4 pt-4  mx-auto flex lg:flex-row flex-col justify-between gap-8 min-h-screen">
      {/* RIGHT-section (Sticky on Large Screens) */}
      <div className="lg:w-[30%] w-full lg:sticky lg:top-8 self-start  h-fit">
        <UserDetails />
      </div>

      {/* Middle Section (Scrollable) */}
      <div className="flex flex-col gap-y-4 lg:w-[40%] w-full lg:overflow-y-auto lg:max-h-[calc(100vh-64px)]  lg:scrollbar-hide ">
        <CreatePost />
        <ShowPost />
      </div>

      {/* LEFT-section (Sticky on Large Screens) */}
      <div className="lg:w-[30%] w-full lg:sticky lg:top-8 self-start  h-fit">
        <UserSuggested />
      </div>
    </div>
  );
}
