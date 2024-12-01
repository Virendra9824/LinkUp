import React from "react";
import "./App.css";
import { Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Chat from "./pages/Chat";
import Header from "./components/common/Header";
import Footer from "./components/common/Footer";
import UpdateProfile from "./components/forms/UpdateProfile";
import Login from "./pages/Login";
import DeleteAccount from "./components/forms/DeleteAccount";
import UpdatePassword from "./components/forms/UpdatePassword";
import Notification from "./pages/Notification";
import RegisterUpdateForm from "./components/forms/RegisterUpdateForm";
import { Toaster } from "react-hot-toast";
import UserDetails from "./pages/UserDetails";
import ShowPost from "./components/posts/ShowPost";
import UserSpecificPosts from "./components/posts/UserSpecificPosts";
import Error from "./pages/Error";

export default function App() {
  return (
    <div className="w-screen  min-h-screen bg-[#0A0A0A] text-white  ">
      <Header />
      <div className="pt-20 ">
        <Routes>
          <Route path={"/"} element={<Home />} />

          <Route path={"/chat/:receiverId"} element={<Chat />} />
          <Route path={"/notification"} element={<Notification />} />
          <Route path={"/update-profile"} element={<UpdateProfile />} />
          <Route path={"/auth/update-password"} element={<UpdatePassword />} />
          <Route path={"/auth/delete-account"} element={<DeleteAccount />} />
          <Route path={"/auth/register"} element={<RegisterUpdateForm />} />
          <Route path={"/auth/login"} element={<Login />} />
          <Route path={"/auth/signup"} element={<RegisterUpdateForm />} />
          <Route path={"/user/:userId"} element={<UserDetails />} />
          <Route
            path={"/user/:userId/posts/:postId"}
            element={<UserSpecificPosts />}
          />
          <Route path={"*"} element={<Error />} />
        </Routes>
      </div>

      <Footer />
      <Toaster />
    </div>
  );
}
