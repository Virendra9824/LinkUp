import React from "react";
import CreatePost from "../components/posts/CreatePost";
import ShowPost from "../components/posts/ShowPost";
import UserDetails from "../components/home/UserDetails";

export default function Home() {
  return (
    <div className="w-[90%] py-5 border-4 border-emerald-600 mx-auto flex  md:flex-row flex-col justify-center gap-8 min-h-screen">
      <div>
        <UserDetails />
      </div>
      <div className="flex flex-col gap-y-4">
        <CreatePost />
        <ShowPost />
      </div>
      <div>
        <UserDetails />
      </div>
    </div>
  );
}
