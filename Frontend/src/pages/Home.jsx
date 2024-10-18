import React from "react";
import CreatePost from "../components/posts/CreatePost";
import ShowPost from "../components/posts/ShowPost";
import UserDetails from "../components/home/UserDetails";
import UserSuggested from "../components/home/UserSuggested";

export default function Home() {
  return (
    <div className="w-[90%] lg:pb-5 pb-3 lg:pt-8 pt-4   border-4 border-emerald-600 mx-auto flex  lg:flex-row flex-col justify-between gap-8 min-h-screen">
      <div className="lg:w-[30%] w-full">
        <UserDetails />
      </div>
      <div className="flex flex-col gap-y-4 lg:w-[40%] w-full">
        <CreatePost />
        <ShowPost />
      </div>
      <div className="lg:w-[30%] w-full">
        <UserSuggested />
      </div>
    </div>
  );
}
